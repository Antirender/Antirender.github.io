let sounds = {};
let soundsLoaded = false;

function preload() {
    soundFormats('mp3');

    try {
        sounds['do'] = loadSound('do.mp3', checkLoaded);
        sounds['re'] = loadSound('re.mp3', checkLoaded);
        sounds['mi'] = loadSound('mi.mp3', checkLoaded);
        sounds['fa'] = loadSound('fa.mp3', checkLoaded);
        sounds['so'] = loadSound('so.mp3', checkLoaded);
        sounds['la'] = loadSound('la.mp3', checkLoaded);
    } catch (error) {
        console.error("Error loading sounds:", error);
    }
}

function checkLoaded() {
    let loadedCount = Object.values(sounds).filter(sound => sound.isLoaded()).length;
    if (loadedCount === 6) {
        soundsLoaded = true;
        document.getElementById("status").innerText = "Sounds Loaded! Press keys to play notes.";
    }
}

function setup() {
    let canvas = createCanvas(400, 200);
    canvas.parent('canvas-container');
    background(240);
    
    fill(0);
    textSize(20);
    textAlign(CENTER, CENTER);
    text("Press keys to play musical notes!", width / 2, height / 2);
}

function playSound(note) {
    if (soundsLoaded && sounds[note] && !sounds[note].isPlaying()) {
        sounds[note].loop(); // Loop sound while key is pressed
    }
}

function stopSound(note) {
    if (soundsLoaded && sounds[note]) {
        sounds[note].stop(); // Stop sound when key is released
    }
}

// Play sound when key is pressed
function keyPressed() {
    if (key === ' ') {
        playSound('do');
    } else if (keyCode === UP_ARROW) {
        playSound('re');
    } else if (keyCode === DOWN_ARROW) {
        playSound('mi');
    } else if (keyCode === LEFT_ARROW) {
        playSound('fa');
    } else if (keyCode === RIGHT_ARROW) {
        playSound('so');
    }
}

// Stop sound when key is released
function keyReleased() {
    if (key === ' ') {
        stopSound('do');
    } else if (keyCode === UP_ARROW) {
        stopSound('re');
    } else if (keyCode === DOWN_ARROW) {
        stopSound('mi');
    } else if (keyCode === LEFT_ARROW) {
        stopSound('fa');
    } else if (keyCode === RIGHT_ARROW) {
        stopSound('so');
    }
}

// Play sound when mouse is pressed
function mousePressed() {
    if (mouseButton === LEFT) {
        playSound('la');
    }
}

// Stop sound when mouse is released
function mouseReleased() {
    if (mouseButton === LEFT) {
        stopSound('la');
    }
}
