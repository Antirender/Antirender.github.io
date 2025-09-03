"""
AI‑Live 后端 · Flask
====================
- /register  POST  {email,password}
- /login     POST  {email,password}
- /chat      POST  {message}     (需登录)
- /static/audio/<file>           (语音文件)
可部署于 cPanel ≥Python3.9 (Passenger WSGI)。
"""
import os, uuid, json, sqlite3, datetime, functools
from pathlib import Path
from flask import Flask, request, jsonify, send_from_directory, session, g
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from dotenv import load_dotenv
import openai, requests

# ───── 环境 ─────
BASE_DIR   = Path(__file__).resolve().parent
AUDIO_DIR  = BASE_DIR / "static" / "audio"
DB_PATH    = BASE_DIR / "instance" / "ai_live.db"
AUDIO_DIR.mkdir(parents=True, exist_ok=True)
DB_PATH.parent.mkdir(parents=True, exist_ok=True)
load_dotenv()

# ───── Flask ─────
app = Flask(__name__, static_folder="static")
app.config["SECRET_KEY"] = os.getenv("FLASK_SECRET", "change_me")
app.config["SESSION_COOKIE_SAMESITE"] = "Lax"
CORS(app, supports_credentials=True)
bcrypt = Bcrypt(app)

# ───── OpenAI / ElevenLabs ─────
openai.api_key = os.getenv("OPENAI_API_KEY")
EV_API  = os.getenv("ELEVEN_API_KEY")
EV_VOICE = os.getenv("ELEVEN_VOICE_ID", "EXAVITQu4vr4xnSDxMaL")

# ───── 数据库 ─────
def get_db():
    if "db" not in g:
        g.db = sqlite3.connect(DB_PATH, detect_types=sqlite3.PARSE_DECLTYPES)
        g.db.row_factory = sqlite3.Row
    return g.db

@app.teardown_appcontext
def close_db(exc):
    db = g.pop("db", None)
    if db:
        db.close()

def init_db():
    db=get_db()
    db.executescript("""
    CREATE TABLE IF NOT EXISTS user(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)
    db.commit()
init_db()

# ───── 工具 ─────
def login_required(f):
    @functools.wraps(f)
    def inner(*a, **kw):
        if not session.get("uid"): 
            return jsonify({"error":"auth_required"}), 401
        return f(*a, **kw)
    return inner

def gpt_reply(prompt):
    rsp = openai.ChatCompletion.create(
        model="gpt-4o-mini",
        messages=[
            {"role":"system","content":"You are Neuro‑Lite, a playful AI streamer, reply in ≤2 sentences."},
            {"role":"user","content":prompt}
        ],
        temperature=0.9,
        max_tokens=120,
    )
    return rsp.choices[0].message.content.strip()

def eleven_tts(text):
    if not EV_API: return None
    url=f"https://api.elevenlabs.io/v1/text-to-speech/{EV_VOICE}"
    headers={"xi-api-key":EV_API,"Content-Type":"application/json"}
    payload={"text":text,"model_id":"eleven_multilingual_v2",
             "voice_settings":{"stability":0.4,"similarity_boost":0.6}}
    r=requests.post(url,headers=headers,data=json.dumps(payload))
    if r.status_code != 200:
        app.logger.warning("ElevenLabs error %s", r.text)
        return None
    fname=f"{uuid.uuid4().hex}.mp3"
    fpath=AUDIO_DIR/fname
    with open(fpath,"wb") as f: f.write(r.content)
    return f"/static/audio/{fname}"

# ───── 路由 ─────
@app.route("/register", methods=["POST"])
def register():
    data=request.get_json(force=True)
    email=data.get("email","").lower().strip()
    pw   =data.get("password","")
    if not email or not pw: 
        return jsonify({"error":"empty"}), 400
    db=get_db()
    try:
        db.execute("INSERT INTO user(email,password) VALUES(?,?)",
                   (email,bcrypt.generate_password_hash(pw).decode()))
        db.commit()
    except sqlite3.IntegrityError:
        return jsonify({"error":"exists"}), 409
    return jsonify({"status":"ok"})

@app.route("/login", methods=["POST"])
def login():
    data=request.get_json(force=True)
    email=data.get("email","").lower().strip()
    pw   =data.get("password","")
    if not email or not pw: 
        return jsonify({"error":"empty"}), 400
    db=get_db()
    row=db.execute("SELECT id,password FROM user WHERE email=?", (email,)).fetchone()
    if not row or not bcrypt.check_password_hash(row["password"], pw):
        return jsonify({"error":"invalid"}), 401
    session["uid"]=row["id"]
    session.permanent=True
    return jsonify({"status":"ok"})

@app.route("/chat", methods=["POST"])
@login_required
def chat():
    user_msg=request.get_json(force=True).get("message","")[:1000]
    if not user_msg: return jsonify({"error":"empty"}),400
    reply=gpt_reply(user_msg)
    audio_url=eleven_tts(reply)
    return jsonify({"reply":reply,"audio":audio_url})

# 音频静态目录
@app.route("/static/audio/<path:fname>")
def audio(fname):
    return send_from_directory(AUDIO_DIR, fname)

# health
@app.route("/")
def index():
    return "AI‑Live backend up."

# ───── 运行 ─────
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
