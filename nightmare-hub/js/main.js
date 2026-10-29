(function () {
  "use strict";
  var STATE_KEY = "ne_state_v1";
  var LOG_KEY = "ne_log_v1";
  var THEME_KEY = "ne_theme";
  var CFG = function () { return window.NE_CONFIG || {}; };

  function nowISO() { return new Date().toISOString(); }

  /* ── Theme ── */
  function getTheme() {
    return localStorage.getItem(THEME_KEY) || "light";
  }
  function setTheme(t) {
    localStorage.setItem(THEME_KEY, t);
    document.documentElement.setAttribute("data-theme", t);
  }
  function toggleTheme() {
    var next = getTheme() === "dark" ? "light" : "dark";
    setTheme(next);
    // update toggle button text
    var btn = document.querySelector(".theme-toggle");
    if (btn) btn.textContent = next === "dark" ? "☀️" : "🌙";
  }
  // Apply theme immediately on script load
  (function () {
    var t = getTheme();
    document.documentElement.setAttribute("data-theme", t);
  })();

  /* ── State ── */
  function defaultState() {
    return {
      unlocked: false,
      entryCode: "",
      startedAt: "",
      lastSeenAt: nowISO(),
      step: "index",
      unlockedNodes: ["start"],
      inventory: [],
      puzzle: {
        puzzle1: { attempts: 0, solved: false, outcome: "" },
        puzzle2: { attempts: 0, solved: false, outcome: "" },
        puzzle3: { attempts: 0, solved: false, outcome: "" }
      },
      rabbit: { step1: false, step2: false, rewardsClaimed: false },
      feedback: [],
      aiLog: [],
      stressLevel: 0,
      exit: { escaped: false, exitedAt: "" },
      storyConfirmed: false,
      /* attempt counters for hint system */
      entryAttempts: 0,
      exitAttempts: 0,
      rabbitStep1Attempts: 0,
      rabbitStep2Attempts: 0,
      /* Mode & NG+ */
      gameMode: "",          /* "normal" or "hard" — set at entry */
      completedRuns: 0       /* incremented on each escape (NG+ counter) */
    };
  }

  function loadState() {
    try {
      var raw = localStorage.getItem(STATE_KEY);
      if (!raw) return defaultState();
      var s = JSON.parse(raw);
      var d = defaultState();
      return {
        unlocked: s.unlocked || d.unlocked,
        entryCode: s.entryCode || d.entryCode,
        startedAt: s.startedAt || d.startedAt,
        lastSeenAt: s.lastSeenAt || d.lastSeenAt,
        step: s.step || d.step,
        unlockedNodes: s.unlockedNodes || d.unlockedNodes,
        inventory: s.inventory || d.inventory,
        puzzle: {
          puzzle1: {
            attempts: (s.puzzle && s.puzzle.puzzle1 && s.puzzle.puzzle1.attempts) || 0,
            solved: (s.puzzle && s.puzzle.puzzle1 && s.puzzle.puzzle1.solved) || false,
            outcome: (s.puzzle && s.puzzle.puzzle1 && s.puzzle.puzzle1.outcome) || ""
          },
          puzzle2: {
            attempts: (s.puzzle && s.puzzle.puzzle2 && s.puzzle.puzzle2.attempts) || 0,
            solved: (s.puzzle && s.puzzle.puzzle2 && s.puzzle.puzzle2.solved) || false,
            outcome: (s.puzzle && s.puzzle.puzzle2 && s.puzzle.puzzle2.outcome) || ""
          },
          puzzle3: {
            attempts: (s.puzzle && s.puzzle.puzzle3 && s.puzzle.puzzle3.attempts) || 0,
            solved: (s.puzzle && s.puzzle.puzzle3 && s.puzzle.puzzle3.solved) || false,
            outcome: (s.puzzle && s.puzzle.puzzle3 && s.puzzle.puzzle3.outcome) || ""
          }
        },
        rabbit: {
          step1: (s.rabbit && s.rabbit.step1) || false,
          step2: (s.rabbit && s.rabbit.step2) || false,
          rewardsClaimed: (s.rabbit && s.rabbit.rewardsClaimed) || false
        },
        feedback: s.feedback || d.feedback,
        aiLog: s.aiLog || d.aiLog,
        stressLevel: s.stressLevel || d.stressLevel,
        exit: {
          escaped: (s.exit && s.exit.escaped) || false,
          exitedAt: (s.exit && s.exit.exitedAt) || ""
        },
        entryAttempts: s.entryAttempts || 0,
        exitAttempts: s.exitAttempts || 0,
        rabbitStep1Attempts: s.rabbitStep1Attempts || 0,
        rabbitStep2Attempts: s.rabbitStep2Attempts || 0,
        storyConfirmed: s.storyConfirmed || false,
        gameMode: s.gameMode || "",
        completedRuns: s.completedRuns || 0
      };
    } catch (e) { return defaultState(); }
  }

  function saveState(patchOrFull) {
    var cur = loadState();
    var keys = Object.keys(patchOrFull);
    for (var i = 0; i < keys.length; i++) cur[keys[i]] = patchOrFull[keys[i]];
    cur.lastSeenAt = nowISO();
    localStorage.setItem(STATE_KEY, JSON.stringify(cur));
    return cur;
  }

  function resetState() {
    var prev = loadState();
    var runs = prev.completedRuns || 0;
    localStorage.removeItem(STATE_KEY);
    localStorage.removeItem(LOG_KEY);
    var fresh = defaultState();
    fresh.completedRuns = runs;
    saveState(fresh);
    return fresh;
  }

  /* ── Log ── */
  function loadLog() {
    try { return JSON.parse(localStorage.getItem(LOG_KEY) || "[]"); } catch (e) { return []; }
  }

  function logEvent(type, detail) {
    var log = loadLog();
    log.push({ t: nowISO(), type: type, detail: detail || {} });
    localStorage.setItem(LOG_KEY, JSON.stringify(log));
  }

  /* ── Export / Import ── */
  function exportJSON(filename, obj) {
    var blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  }
  function exportState() { exportJSON("ne-state-" + Date.now() + ".json", loadState()); }
  function exportLogFile() { exportJSON("ne-log-" + Date.now() + ".json", loadLog()); }
  function exportStateAndLog() { exportJSON("ne-full-" + Date.now() + ".json", { state: loadState(), log: loadLog() }); }

  function importJSON(fileOrText) {
    return new Promise(function (resolve, reject) {
      var handle = function (txt) {
        try {
          var obj = JSON.parse(txt);
          if (obj.state) saveState(obj.state);
          if (obj.log) localStorage.setItem(LOG_KEY, JSON.stringify(obj.log));
          if (!obj.state && !obj.log) saveState(obj);
          resolve(obj);
        } catch (e) { reject(e); }
      };
      if (typeof fileOrText === "string") { handle(fileOrText); return; }
      var reader = new FileReader();
      reader.onload = function () { handle(reader.result); };
      reader.onerror = reject;
      reader.readAsText(fileOrText);
    });
  }

  /* ── Validation ── */
  function isValidEntryCode(code) {
    var upper = (code || "").toUpperCase();
    /* Check all modes — the mode is determined by WHICH code matches */
    var modes = (CFG().MODES) || {};
    for (var mkey in modes) {
      var mc = (modes[mkey].entryCodes || []).map(function(c){return c.toUpperCase();});
      if (mc.indexOf(upper) !== -1) return true;
    }
    /* Fallback to global codes */
    var codes = (CFG().ENTRY_CODES || []).map(function (c) { return c.toUpperCase(); });
    return codes.indexOf(upper) !== -1;
  }

  /** Determine which mode a code belongs to; returns "normal" | "hard" | "" */
  function detectModeFromCode(code) {
    var upper = (code || "").toUpperCase();
    var modes = (CFG().MODES) || {};
    for (var mkey in modes) {
      var mc = (modes[mkey].entryCodes || []).map(function(c){return c.toUpperCase();});
      if (mc.indexOf(upper) !== -1) return mkey;
    }
    return "normal"; /* fallback */
  }

  /** Return the active mode config object */
  function getModeConfig(modeKey) {
    var key = modeKey || loadState().gameMode || "normal";
    var modes = (CFG().MODES) || {};
    return modes[key] || modes.normal || {};
  }

  /** Return nodes for the active mode */
  function getModeNodes(modeKey) {
    return getModeConfig(modeKey).nodes || CFG().NODES || [];
  }

  function isValidExitPassword(pw) {
    var mc = getModeConfig();
    var expected = mc.exitPassword || CFG().EXIT_PASSWORD || "";
    return (pw || "").toUpperCase() === expected.toUpperCase();
  }

  /** Get the shortcut passphrase for the active mode */
  function getShortcutPassphrase() {
    var mc = getModeConfig();
    return (mc.shortcutPassphrase || CFG().SHORTCUT_PASSPHRASE || "").toLowerCase();
  }

  /** Count collected fragments for hard mode */
  function getFragmentCount() {
    var st = loadState();
    var count = 0;
    if (st.puzzle.puzzle1.solved) count++;
    if (st.puzzle.puzzle2.solved) count++;
    if (st.puzzle.puzzle3.solved) count++;
    if (st.unlockedNodes.indexOf("ar1") !== -1) count++;
    if (st.unlockedNodes.indexOf("vr1") !== -1) count++;
    if (st.unlockedNodes.indexOf("physical1") !== -1) count++;
    return count;
  }

  /** Check if exit should be accessible in hard mode */
  function isHardModeExitReady() {
    var mc = getModeConfig();
    return getFragmentCount() >= (mc.requiredFragments || 6);
  }

  /* ── Gate ── */
  function gateOrRedirect(req) {
    var st = loadState();
    if (req && !st.unlocked) { location.href = "index.html"; return null; }
    return st;
  }

  /* ── Helpers ── */
  function unlockNode(id) {
    var st = loadState();
    if (st.unlockedNodes.indexOf(id) === -1) { st.unlockedNodes.push(id); saveState(st); }
  }
  function addInventory(text) {
    var st = loadState();
    st.inventory.push({ t: nowISO(), text: text });
    saveState(st);
  }
  function setStress(level) {
    var st = loadState();
    st.stressLevel = Math.max(0, Math.min(3, level));
    saveState(st);
  }

  /* ── Copy ── */
  function getAriLine() {
    // Use enhanced ARI engine if available
    if (window.ARI && ARI.getPassiveMessage) {
      return ARI.getPassiveMessage();
    }
    // Fallback to legacy random lines
    var st = loadState();
    var copy = CFG().COPY || {};
    var lines = st.stressLevel >= 2 ? (copy.minotaurLines || []) : (copy.ariLines || []);
    return lines[Math.floor(Math.random() * lines.length)] || "ARI: Systems nominal.";
  }

  function getNextStepText() {
    var st = loadState();
    if (!st.unlocked) return "Enter the 3-digit code to begin.";
    if (st.gameMode === "hard") {
      var frags = getFragmentCount();
      var mc = getModeConfig();
      if (frags < mc.requiredFragments) return "Collect fragments (" + frags + "/" + mc.requiredFragments + ").";
      if (!st.exit.escaped) return "All fragments collected. Enter the exit code.";
      return "You have escaped. Congratulations, Survivor.";
    }
    /* Normal mode */
    if (!st.puzzle.puzzle1.solved) return "Solve Puzzle 1 to unlock the next nodes.";
    if (!st.puzzle.puzzle2.solved) return "Solve Puzzle 2 to continue.";
    if (!st.puzzle.puzzle3.solved) return "Solve Puzzle 3 to reach the Exit Terminal.";
    if (!st.exit.escaped) return "Enter the exit code at the terminal.";
    return "You have escaped. Congratulations, Survivor.";
  }

  /** Returns CTA object: { href, label, sublabel, icon, escaped } */
  function getNextStepCTA() {
    var st = loadState();
    if (!st.unlocked) return { href: "index.html", label: "Enter Your Code", sublabel: "Use 3-digit code to unlock the labyrinth.", icon: "🔑", escaped: false };
    if (st.gameMode === "hard") {
      var frags = getFragmentCount();
      var mc = getModeConfig();
      if (frags < mc.requiredFragments) return { href: "hub.html", label: "Collect Fragments (" + frags + "/" + mc.requiredFragments + ")", sublabel: "Explore all nodes. AR & VR are required.", icon: "🕸️", escaped: false };
      if (!st.exit.escaped) return { href: "password.html", label: "Exit Terminal", sublabel: "All fragments collected. Enter the exit code.", icon: "📟", escaped: false };
      return { href: "ending.html", label: "View Your Ending", sublabel: "See your rank, stats, and export evidence.", icon: "✓", escaped: true };
    }
    /* Normal mode */
    if (!st.puzzle.puzzle1.solved) return { href: "puzzle1.html", label: "Solve Puzzle 1", sublabel: "Identify the genuine ARI signal.", icon: "🧩", escaped: false };
    if (!st.puzzle.puzzle2.solved) return { href: "puzzle2.html", label: "Solve Puzzle 2", sublabel: "Find the uncorrupted archive log.", icon: "📚", escaped: false };
    if (!st.puzzle.puzzle3.solved) return { href: "puzzle3.html", label: "Solve Puzzle 3", sublabel: "Choose the door to the exit.", icon: "🚪", escaped: false };
    if (!st.exit.escaped) return { href: "password.html", label: "Exit Terminal", sublabel: "Enter the 3-digit exit code.", icon: "📟", escaped: false };
    return { href: "ending.html", label: "View Your Ending", sublabel: "See your rank, stats, and export evidence.", icon: "✓", escaped: true };
  }

  /** Hint system: returns true when attempts >= 2 */
  function shouldShowHint(attempts) { return attempts >= 2; }

  /* ── Render ── */
  function renderHeader(selector) {
    var el = selector ? document.querySelector(selector) : document.querySelector("[data-ne-header]");
    if (!el) return;
    var st = loadState();
    var cfg = CFG();
    var title = (cfg.PROJECT && cfg.PROJECT.title) || "Trafalgar Labyrinth";
    var themeIcon = getTheme() === "dark" ? "☀️" : "🌙";
    var modeBadge = "";
    if (st.gameMode) {
      var mc = getModeConfig(st.gameMode);
      modeBadge = '<span class="mode-badge mode-' + st.gameMode + '">' + (mc.icon || "") + " " + (mc.name || st.gameMode) + '</span>';
    }
    el.innerHTML =
      '<a href="#main" class="skip-link">Skip to content</a>' +
      '<nav class="header-nav" aria-label="Main navigation">' +
        '<a href="index.html" class="brand">' + title + '</a>' +
        modeBadge +
        '<div class="nav-links">' +
          '<a href="hub.html">Hub</a>' +
          '<a href="map.html">Map</a>' +
          '<a href="lore.html">Lore</a>' +
          '<a href="nmec.html">About</a>' +
        '</div>' +
        '<div class="header-actions">' +
          '<span class="stress-pill" aria-live="polite">Stress: ' + st.stressLevel + '/3</span>' +
          '<button class="theme-toggle" aria-label="Toggle theme" onclick="NE.toggleTheme()">' + themeIcon + '</button>' +
        '</div>' +
      '</nav>';
  }

  function renderAriBubble(elOrSelector) {
    var el = typeof elOrSelector === "string" ? document.querySelector(elOrSelector) : elOrSelector;
    if (!el) el = document.getElementById("ariBubble");
    if (!el) return;
    // Use ambient cycling if ARI engine is available
    if (window.ARI && ARI.startAmbientCycle) {
      el.style.transition = "opacity 0.3s ease";
      ARI.startAmbientCycle(el);
    } else {
      el.textContent = getAriLine();
    }
  }

  function renderInventory(elOrSelector) {
    var el = typeof elOrSelector === "string" ? document.querySelector(elOrSelector) : elOrSelector;
    if (!el) el = document.getElementById("inventoryList");
    if (!el) return;
    var st = loadState();
    if (!st.inventory.length) {
      el.innerHTML = '<div class="inv-item" style="color:var(--muted)">No items yet.</div>';
      return;
    }
    el.innerHTML = st.inventory.map(function (i) { return '<div class="inv-item">' + i.text + '</div>'; }).join("");
  }

  function renderProgress(elOrSelector) {
    var el = typeof elOrSelector === "string" ? document.querySelector(elOrSelector) : elOrSelector;
    if (!el) el = document.getElementById("nodeList");
    if (!el) return;
    var st = loadState();
    var nodes = getModeNodes();
    el.innerHTML = nodes.map(function (n) {
      var unlocked = st.unlockedNodes.indexOf(n.id) !== -1;
      return '<div class="node-pill ' + (unlocked ? "unlocked" : "locked") + '">' + n.name + '</div>';
    }).join("");
  }

  function renderOnlineIndicator(elOrSelector) {
    var el = typeof elOrSelector === "string" ? document.querySelector(elOrSelector) : elOrSelector;
    if (!el) el = document.getElementById("onlineIndicator");
    if (!el) return;
    var update = function () {
      el.textContent = navigator.onLine ? "Online" : "Offline";
      el.className = "online-pill " + (navigator.onLine ? "online" : "offline");
    };
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    update();
  }

  /* ── Init ── */
  function initPage(cb) {
    renderHeader();
    var st = loadState();
    var cfg = CFG();
    if (typeof cb === "function") cb(cfg, st);
    return st;
  }

  /* ── Public API ── */
  window.NE = {
    loadState: loadState, saveState: saveState, resetState: resetState,
    loadLog: loadLog, logEvent: logEvent,
    exportJSON: exportJSON, exportState: exportState, exportLog: exportLogFile, exportStateAndLog: exportStateAndLog,
    importJSON: importJSON,
    isValidEntryCode: isValidEntryCode, isValidExitPassword: isValidExitPassword,
    detectModeFromCode: detectModeFromCode,
    getModeConfig: getModeConfig, getModeNodes: getModeNodes,
    getShortcutPassphrase: getShortcutPassphrase,
    getFragmentCount: getFragmentCount, isHardModeExitReady: isHardModeExitReady,
    gateOrRedirect: gateOrRedirect, unlockNode: unlockNode, addInventory: addInventory,
    setStress: setStress, getAriLine: getAriLine, getNextStepText: getNextStepText, getNextStepCTA: getNextStepCTA,
    shouldShowHint: shouldShowHint,
    renderHeader: renderHeader, renderAriBubble: renderAriBubble,
    renderInventory: renderInventory, renderProgress: renderProgress,
    renderOnlineIndicator: renderOnlineIndicator,
    initPage: initPage, nowISO: nowISO, CFG: CFG,
    toggleTheme: toggleTheme, getTheme: getTheme, setTheme: setTheme,
    /* ARI console helpers */
    askAri: function (input) { return window.ARI ? ARI.processInput(input) : getAriLine(); },
    getAriQuickActions: function () { return window.ARI ? ARI.getQuickActions() : []; }
  };
})();
