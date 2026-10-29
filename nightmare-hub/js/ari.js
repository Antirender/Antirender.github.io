/**
 * ARI — Ariadne Routing Interface
 * Enhanced guidance system using:
 *  - State Machine (ARI personality states)
 *  - Decision Tree (contextual response selection)
 *  - Keyword Matching (interactive dialogue)
 *  - Rule System (priority-based condition evaluation)
 *  - Preset Reply Templates (rich stage/stress/mode responses)
 *
 * Depends on: main.js (NE namespace), config.js (NE_CONFIG)
 */
(function () {
  "use strict";

  /* ══════════════════════════════════════════════════════
     §1  STATE MACHINE — ARI Personality
     ══════════════════════════════════════════════════════ */
  var PERSONALITY = {
    GUIDING:   "guiding",    // helpful, warm, clear
    CAUTIOUS:  "cautious",   // hints of Minotaur interference
    CORRUPTED: "corrupted",  // Minotaur partially controls ARI
    DESPERATE: "desperate"   // ARI fighting back, garbled but honest
  };

  /** Evaluate ARI's current personality from game state */
  function resolvePersonality(st) {
    var stress = st.stressLevel || 0;
    if (stress >= 3) return PERSONALITY.DESPERATE;
    if (stress >= 2) return PERSONALITY.CORRUPTED;
    if (stress >= 1) return PERSONALITY.CAUTIOUS;
    return PERSONALITY.GUIDING;
  }

  /* ══════════════════════════════════════════════════════
     §2  CONTEXT DETECTOR — Where is the player?
     ══════════════════════════════════════════════════════ */
  function detectContext() {
    var path = location.pathname.replace(/.*\//, "").replace(".html", "") || "index";
    var contextMap = {
      "index":    "entry",
      "hub":      "hub",
      "puzzle1":  "puzzle1",
      "puzzle2":  "puzzle2",
      "puzzle3":  "puzzle3",
      "password": "exit",
      "map":      "hub",
      "lore":     "lore",
      "ar":       "ar",
      "vr":       "vr",
      "physical": "physical",
      "story":    "story",
      "rabbit-hole": "rabbit",
      "dead-end": "deadend",
      "ending":   "ending",
      "feedback": "ending"
    };
    return contextMap[path] || "hub";
  }

  /* ══════════════════════════════════════════════════════
     §3  PROGRESS ANALYZER — What has the player done?
     ══════════════════════════════════════════════════════ */
  function analyzeProgress(st) {
    var p = {
      unlocked:        st.unlocked,
      mode:            st.gameMode || "normal",
      puzzle1Solved:   st.puzzle.puzzle1.solved,
      puzzle2Solved:   st.puzzle.puzzle2.solved,
      puzzle3Solved:   st.puzzle.puzzle3.solved,
      puzzle1Attempts: st.puzzle.puzzle1.attempts,
      puzzle2Attempts: st.puzzle.puzzle2.attempts,
      puzzle3Attempts: st.puzzle.puzzle3.attempts,
      hasAR:           st.unlockedNodes.indexOf("ar1") !== -1,
      hasVR:           st.unlockedNodes.indexOf("vr1") !== -1,
      hasPhysical:     st.unlockedNodes.indexOf("physical1") !== -1,
      rabbitDone:      st.rabbit.step1 && st.rabbit.step2,
      rabbitRewards:   st.rabbit.rewardsClaimed,
      escaped:         st.exit.escaped,
      stress:          st.stressLevel || 0,
      fragmentCount:   0,
      storyConfirmed:  st.storyConfirmed,
      entryAttempts:   st.entryAttempts || 0,
      exitAttempts:    st.exitAttempts || 0,
      inventory:       st.inventory || [],
      completedRuns:   st.completedRuns || 0
    };
    // count fragments
    if (p.puzzle1Solved) p.fragmentCount++;
    if (p.puzzle2Solved) p.fragmentCount++;
    if (p.puzzle3Solved) p.fragmentCount++;
    if (p.hasAR) p.fragmentCount++;
    if (p.hasVR) p.fragmentCount++;
    if (p.hasPhysical) p.fragmentCount++;
    return p;
  }

  /* ══════════════════════════════════════════════════════
     §4  RULE ENGINE — Priority-based condition evaluator
     Each rule: { id, priority, condition(ctx,prog), response }
     Higher priority wins. First match at highest priority is used.
     ══════════════════════════════════════════════════════ */

  /** Core rules - evaluated for passive ARI bubble messages */
  var RULES = [
    // ── CRITICAL / High Priority (90+) ──
    { id: "escaped", priority: 99,
      condition: function (c, p) { return p.escaped; },
      response: function (c, p, pers) {
        return pers === PERSONALITY.CORRUPTED || pers === PERSONALITY.DESPERATE
          ? "ARI: [SIGNAL RESTORED] You made it out. The thread held. I'm... I'm still here."
          : "ARI: You escaped the labyrinth. The thread is whole. Well done, Survivor.";
      }
    },
    { id: "deadend", priority: 95,
      condition: function (c) { return c === "deadend"; },
      response: function () {
        return "ARI: [WARNING] This path was a decoy. The Minotaur rerouted you. Return to the Hub — the real path is still there.";
      }
    },
    { id: "ng_plus", priority: 92,
      condition: function (c, p) { return p.completedRuns > 0 && !p.escaped; },
      response: function (c, p) {
        return "ARI: Welcome back, Survivor. Run #" + (p.completedRuns + 1) + ". The labyrinth remembers you — and so does the Minotaur.";
      }
    },

    // ── Context-Specific (70–89) ──
    { id: "entry_struggling", priority: 85,
      condition: function (c, p) { return c === "entry" && p.entryAttempts >= 3; },
      response: function () {
        return "ARI: The entry is a 3-digit number. It was displayed during onboarding. Look carefully at the poster.";
      }
    },
    { id: "entry_first", priority: 70,
      condition: function (c, p) { return c === "entry" && !p.unlocked; },
      response: function () {
        return "ARI: Welcome. Enter the 3-digit code to unlock the labyrinth. If you don't have it yet, check the entry poster.";
      }
    },
    { id: "exit_struggling", priority: 85,
      condition: function (c, p) { return c === "exit" && p.exitAttempts >= 3; },
      response: function (c, p) {
        var hints = [];
        if (p.rabbitRewards) hints.push("The diagnostics terminal gave you two digits.");
        if (p.hasAR || p.hasVR) hints.push("AR and VR clues can form a shortcut word.");
        return "ARI: The exit has two paths — a 3-digit code or a text passphrase. " + (hints.length ? hints.join(" ") : "Explore the branch paths for clues.");
      }
    },
    { id: "exit_normal", priority: 72,
      condition: function (c) { return c === "exit"; },
      response: function (c, p) {
        if (p.mode === "hard" && p.fragmentCount < 6)
          return "ARI: You need all 6 fragments before the exit code will work. Current: " + p.fragmentCount + "/6.";
        return "ARI: The exit terminal accepts a 3-digit code on the numpad, or a text passphrase in the shortcut field.";
      }
    },

    // ── Puzzle-Specific (60–79) ──
    { id: "puzzle1_hint", priority: 78,
      condition: function (c, p) { return c === "puzzle1" && p.puzzle1Attempts >= 1 && !p.puzzle1Solved; },
      response: function () {
        return "ARI: One signal is steady and consistent — the others spike erratically. My guidance pattern doesn't deviate.";
      }
    },
    { id: "puzzle1_intro", priority: 60,
      condition: function (c, p) { return c === "puzzle1" && !p.puzzle1Solved; },
      response: function () {
        return "ARI: Four signals intercepted. Three are Minotaur decoys — one is mine. Look for stability over spectacle.";
      }
    },
    { id: "puzzle1_done", priority: 62,
      condition: function (c, p) { return c === "puzzle1" && p.puzzle1Solved; },
      response: function () {
        return "ARI: Signal confirmed. You recognized the real thread. New paths are now available from the Hub.";
      }
    },
    { id: "puzzle2_hint", priority: 78,
      condition: function (c, p) { return c === "puzzle2" && p.puzzle2Attempts >= 1 && !p.puzzle2Solved; },
      response: function () {
        return "ARI: Check the metadata. Genuine navigator notes have consistent checksums — corrupted logs don't match their own headers.";
      }
    },
    { id: "puzzle2_intro", priority: 60,
      condition: function (c, p) { return c === "puzzle2" && !p.puzzle2Solved; },
      response: function () {
        return "ARI: The archive contains corrupted and genuine logs. Find the one whose metadata is internally consistent.";
      }
    },
    { id: "puzzle2_done", priority: 62,
      condition: function (c, p) { return c === "puzzle2" && p.puzzle2Solved; },
      response: function () {
        return "ARI: Archive fragment recovered. The navigator's notes are intact. One puzzle remains before the exit.";
      }
    },
    { id: "puzzle3_hint", priority: 78,
      condition: function (c, p) { return c === "puzzle3" && p.puzzle3Attempts >= 1 && !p.puzzle3Solved; },
      response: function () {
        return "ARI: Three doors. Only one bears the thread motif. The Minotaur marks its traps with false promise — the real exit is quiet.";
      }
    },
    { id: "puzzle3_intro", priority: 60,
      condition: function (c, p) { return c === "puzzle3" && !p.puzzle3Solved; },
      response: function () {
        return "ARI: The final gate. Three doors — one leads to the exit, two to dead ends. Follow the thread, not the noise.";
      }
    },
    { id: "puzzle3_done", priority: 62,
      condition: function (c, p) { return c === "puzzle3" && p.puzzle3Solved; },
      response: function () {
        return "ARI: Gate cleared. The exit terminal is now accessible. Go to the Hub and look for the Exit Terminal.";
      }
    },

    // ── Branch Nodes (50–69) ──
    { id: "ar_context", priority: 55,
      condition: function (c) { return c === "ar"; },
      response: function (c, p) {
        if (p.hasAR) return "ARI: AR scan complete. The letter you found is part of the shortcut passphrase.";
        return "ARI: The AR layer reveals clues overlaid on the physical world. Find the poster near Printer AA — the dagger image is your target.";
      }
    },
    { id: "vr_context", priority: 55,
      condition: function (c) { return c === "vr"; },
      response: function (c, p) {
        if (p.hasVR) return "ARI: VR fragment secured. The clue you received can combine with the AR fragment to reveal something useful.";
        return "ARI: The VR maze is hidden behind the Network Issue Poster on campus. Completing it reveals a text clue.";
      }
    },
    { id: "physical_context", priority: 55,
      condition: function (c) { return c === "physical"; },
      response: function (c, p) {
        if (p.hasPhysical) return "ARI: Physical fragment collected. Check the Hub for your next move.";
        return "ARI: A physical artifact is waiting on campus. Follow the envelope instructions to retrieve Fragment A.";
      }
    },
    { id: "story_context", priority: 55,
      condition: function (c) { return c === "story"; },
      response: function (c, p) {
        if (p.storyConfirmed) return "ARI: Story path confirmed. The narrative context enriches your understanding of the labyrinth.";
        return "ARI: The story layer provides context. Complete it to unlock additional diagnostics visibility.";
      }
    },
    { id: "rabbit_context", priority: 55,
      condition: function (c) { return c === "rabbit"; },
      response: function (c, p) {
        if (p.rabbitDone) return "ARI: Diagnostics complete. The rewards contain partial exit clues.";
        return "ARI: The diagnostics terminal is hidden but useful. It requires a passphrase — think about system safety.";
      }
    },
    { id: "lore_context", priority: 50,
      condition: function (c) { return c === "lore"; },
      response: function () {
        return "ARI: The lore fragments tell our story — mine and the Minotaur's. We share code, but not purpose.";
      }
    },

    // ── Hub Navigation (40–59) ──
    { id: "hub_hard_progress", priority: 58,
      condition: function (c, p) { return c === "hub" && p.mode === "hard"; },
      response: function (c, p) {
        if (p.fragmentCount >= 6) return "ARI: All fragments collected. The exit terminal is ready. Go now — before the Minotaur adapts.";
        var missing = [];
        if (!p.puzzle1Solved) missing.push("Signal");
        if (!p.puzzle2Solved) missing.push("Archive");
        if (!p.puzzle3Solved) missing.push("Door");
        if (!p.hasAR) missing.push("AR");
        if (!p.hasVR) missing.push("VR");
        if (!p.hasPhysical) missing.push("Physical");
        return "ARI: " + p.fragmentCount + "/6 fragments. Missing: " + missing.join(", ") + ". Explore freely — the Hub connects all paths.";
      }
    },
    { id: "hub_next_step", priority: 45,
      condition: function (c) { return c === "hub"; },
      response: function (c, p) {
        if (!p.puzzle1Solved) return "ARI: Start with Puzzle 1 — identify my signal among the decoys. The other paths unlock after.";
        if (!p.puzzle2Solved) return "ARI: Puzzle 1 complete. The archive awaits in Puzzle 2. Branch paths (AR, VR, Physical) are also available.";
        if (!p.puzzle3Solved) return "ARI: Two fragments recovered. Puzzle 3 is the final gate before the Exit Terminal.";
        return "ARI: All puzzles solved. The Exit Terminal numpad is active. You can also try the shortcut passphrase.";
      }
    },

    // ── Fallback (0–10) ──
    { id: "ending_context", priority: 8,
      condition: function (c) { return c === "ending"; },
      response: function () {
        return "ARI: The labyrinth remembers every choice. Your path is recorded. Export your evidence from the Hub.";
      }
    },
    { id: "default_guide", priority: 1,
      condition: function () { return true; },
      response: function () {
        return "ARI: I exist to reduce uncertainty. If you're lost, return to the Hub.";
      }
    }
  ];

  // Sort rules by priority descending (once at load time)
  RULES.sort(function (a, b) { return b.priority - a.priority; });

  /** Evaluate rules, return best matching response string */
  function evaluateRules(context, progress, personality) {
    for (var i = 0; i < RULES.length; i++) {
      var r = RULES[i];
      if (r.condition(context, progress)) {
        var msg = r.response(context, progress, personality);
        return { ruleId: r.id, message: applyPersonalityFilter(msg, personality) };
      }
    }
    return { ruleId: "fallback", message: "ARI: Systems nominal." };
  }

  /** Apply personality distortion to message */
  function applyPersonalityFilter(msg, personality) {
    if (personality === PERSONALITY.GUIDING) return msg;

    if (personality === PERSONALITY.CAUTIOUS) {
      // Add subtle warning suffix
      var warnings = [
        " ...signal integrity declining.",
        " [interference detected]",
        " ...are you sure you're reading the real me?"
      ];
      return msg + warnings[Math.floor(Math.random() * warnings.length)];
    }

    if (personality === PERSONALITY.CORRUPTED) {
      // Mix ARI and Minotaur voice
      var glitches = ["[STATIC]", "[REDACTED]", "[OVERRIDE]", "...", "█████"];
      var words = msg.split(" ");
      // Corrupt 15-25% of words
      var corruptCount = Math.max(1, Math.floor(words.length * (0.15 + Math.random() * 0.1)));
      for (var i = 0; i < corruptCount; i++) {
        var idx = Math.floor(Math.random() * words.length);
        words[idx] = glitches[Math.floor(Math.random() * glitches.length)];
      }
      return words.join(" ");
    }

    if (personality === PERSONALITY.DESPERATE) {
      // ARI fighting through — garbled but trying to help
      var prefix = ["[ARI—HELP—]", "[BREAK1NG THR0UGH]", "[SOS]"][Math.floor(Math.random() * 3)];
      var stripped = msg.replace(/^ARI:\s*/, "");
      // Randomly capitalize and add glitches
      var chars = stripped.split("");
      for (var j = 0; j < chars.length; j++) {
        if (Math.random() < 0.08) chars[j] = "█";
        else if (Math.random() < 0.05) chars[j] = chars[j].toUpperCase();
      }
      return prefix + " " + chars.join("");
    }

    return msg;
  }

  /* ══════════════════════════════════════════════════════
     §5  KEYWORD MATCHER — Interactive Dialogue
     Matches user input against keyword patterns.
     Returns { matched, response, helpLevel }
     ══════════════════════════════════════════════════════ */

  var KEYWORDS = [
    // ── Navigation ──
    { patterns: [/^(where|next|what.*do|what.*now|progress)/i],
      handler: function (c, p) {
        if (!p.unlocked) return "Enter the 3-digit code to unlock the labyrinth.";
        if (p.mode === "hard") {
          if (p.fragmentCount < 6) return "You've collected " + p.fragmentCount + "/6 fragments. Explore the Hub to find the remaining paths.";
          return "All fragments collected. Head to the Exit Terminal.";
        }
        if (!p.puzzle1Solved) return "Head to Puzzle 1 from the Hub. Identify a genuine signal among decoys.";
        if (!p.puzzle2Solved) return "Puzzle 2 is your next target. Find the uncorrupted archive log.";
        if (!p.puzzle3Solved) return "Puzzle 3 awaits. Choose the correct door to the exit.";
        if (!p.escaped) return "All puzzles solved. The Exit Terminal is ready.";
        return "You've escaped! Check the ending page for your results.";
      }
    },

    // ── Help / Hint ──
    { patterns: [/^(help|hint|stuck|lost|confused|idk|don.?t know)/i],
      handler: function (c, p) {
        // Contextual hint based on current page
        var hints = {
          entry:   "The entry code is a 3-digit number. It appeared during the onboarding sequence.",
          puzzle1: p.puzzle1Attempts >= 2
            ? "Focus on Signal Alpha — the steady, predictable pulse. ARI's guidance doesn't spike."
            : "One of the four signals is stable and predictable. The other three are erratic decoys.",
          puzzle2: p.puzzle2Attempts >= 2
            ? "Log #112 — the navigator notes — has consistent checksums. The others are corrupted."
            : "Compare the metadata of each log. Real records have internally consistent checksums.",
          puzzle3: p.puzzle3Attempts >= 2
            ? "The Thread Gate bears the thread motif. It's quiet where the traps are loud."
            : "Look for the door marked with the thread symbol. The real exit is understated.",
          exit:    p.exitAttempts >= 3
            ? "Try the shortcut passphrase field if you've collected AR/VR clues. Or: the code starts with 9 and ends with 6."
            : "The exit accepts a 3-digit code or a text passphrase. Branch paths (AR, VR) hold shortcut clues.",
          ar:      "Find the dagger poster near Printer AA. The colour-match interaction reveals a letter.",
          vr:      "Find the Network Issue Poster on campus for the VR station. The maze-room door holds a text clue.",
          physical:"Check Studio Shelf 7B for the envelope. Follow the Fragment A retrieval instructions.",
          rabbit:  p.rabbit1Attempts >= 2
            ? "The passphrase is about safety — system safety. Think about what protects the thread."
            : "The diagnostics terminal needs a passphrase. It's related to keeping the thread safe.",
          hub:     "Use the Hub as your home base. The Next Step banner shows your current objective.",
          story:   "Complete the visual novel story. A passphrase gates the completion confirmation."
        };
        return hints[c] || "Return to the Hub. The Next Step indicator will guide you.";
      }
    },

    // ── Direct answer requests ──
    { patterns: [/^(answer|solution|tell me|exact|code|password|passphrase|spoil)/i],
      handler: function (c, p) {
        // Warning + contextual spoiler with confirmation
        return "⚠️ SPOILER WARNING — Are you sure? Type 'confirm spoiler' for the exact answer to your current challenge.";
      }
    },
    { patterns: [/^confirm\s*spoiler/i],
      handler: function (c, p) {
        var spoilers = {
          entry:   "Entry code: 713",
          puzzle1: "Correct choice: Signal Alpha (first option, index 0).",
          puzzle2: "Correct choice: Log #112 — Navigator Notes (third option, index 2).",
          puzzle3: "Correct choice: Thread Gate (second option, index 1).",
          exit:    "Exit code: 926. Shortcut passphrase: thread.",
          rabbit:  "Step 1 passphrase: THREADSAFE. Step 2 decoded location: NORTH DOOR.",
          ar:      "AR poster reveals letter H. QR code reveals 'thre_d'. Combined with VR = 'thread'.",
          vr:      "VR Maze Room reveals clue 't_read'. Combined with AR letter H = 'tHread' → 'thread'."
        };
        return spoilers[c] || "No spoiler available for this page. Try from a puzzle or terminal page.";
      }
    },

    // ── Lore / Story ──
    { patterns: [/^(lore|story|ariadne|thread|history|who.*ari|who.*you|what.*ari|what.*you)/i],
      handler: function () {
        return "I am ARI — Ariadne Routing Interface. I was designed to reduce uncertainty and guide you through the labyrinth. The Minotaur System was designed to confuse. We share code, but not purpose. If systems degrade, remember: THREADSAFE.";
      }
    },

    // ── Minotaur ──
    { patterns: [/^(minotaur|enemy|threat|danger|trap|fake|decoy)/i],
      handler: function (c, p) {
        if (p.stress >= 2) return "[MINOTAUR INTERFERENCE DETECTED] The Minotaur generates false signals, fake exits, and time pressure. Not everything that looks like guidance is guidance.";
        return "The Minotaur System generates decoys — false signals, corrupted logs, and fake exit paths. Trust pattern consistency over spectacle. If a path seems too easy, it's probably a trap.";
      }
    },

    // ── Status ──
    { patterns: [/^(status|inventory|stats|progress|how.*doing)/i],
      handler: function (c, p) {
        var lines = [];
        lines.push("Mode: " + (p.mode === "hard" ? "Hard (Hub & Spoke)" : "Normal (String of Pearls)"));
        lines.push("Puzzles: " + [p.puzzle1Solved ? "✓" : "✗", p.puzzle2Solved ? "✓" : "✗", p.puzzle3Solved ? "✓" : "✗"].join(" | ") + " (P1 | P2 | P3)");
        lines.push("Branches: AR " + (p.hasAR ? "✓" : "—") + " | VR " + (p.hasVR ? "✓" : "—") + " | Physical " + (p.hasPhysical ? "✓" : "—"));
        lines.push("Stress: " + p.stress + "/3");
        if (p.mode === "hard") lines.push("Fragments: " + p.fragmentCount + "/6");
        lines.push("Diagnostics: " + (p.rabbitDone ? "complete" : "incomplete"));
        return lines.join("\n");
      }
    },

    // ── Map / Route ──
    { patterns: [/^(map|route|path|walkthrough|how.*escape|how.*exit|how.*win)/i],
      handler: function (c, p) {
        if (p.mode === "hard") {
          return "Hard mode route: Hub is the center. All 6 fragment nodes (3 puzzles + AR + VR + Physical) must be collected before the Exit Terminal activates. Order doesn't matter — explore freely.";
        }
        return "Normal mode route: Entry → Hub → Puzzle 1 → Puzzle 2 → Puzzle 3 → Exit Terminal. AR/VR/Physical are optional branch paths that provide shortcut clues.";
      }
    },

    // ── Shortcut ──
    { patterns: [/^(shortcut|skip|bypass|fast|quick)/i],
      handler: function (c, p) {
        if (p.hasAR && p.hasVR) return "You have both AR and VR clues. Combine them to form the shortcut passphrase, then enter it at the Exit Terminal.";
        if (p.hasAR || p.hasVR) return "You have one shortcut clue. Find the other (from " + (p.hasAR ? "VR" : "AR") + ") to complete the passphrase.";
        return "There's a shortcut path that bypasses some puzzles. It requires combining clues from the AR and VR branches. Explore those paths first.";
      }
    },

    // ── Reset / Restart ──
    { patterns: [/^(reset|restart|new game|start over|clear)/i],
      handler: function () {
        return "To reset, use the reset button on the Hub page (in Tools section) or clear your browser data. Warning: this erases all progress.";
      }
    }
  ];

  /** Match user input against keyword patterns */
  function matchKeyword(input, context, progress) {
    var trimmed = (input || "").trim();
    if (!trimmed) return null;

    for (var i = 0; i < KEYWORDS.length; i++) {
      var kw = KEYWORDS[i];
      for (var j = 0; j < kw.patterns.length; j++) {
        if (kw.patterns[j].test(trimmed)) {
          return {
            matched: true,
            response: kw.handler(context, progress)
          };
        }
      }
    }
    return null;
  }

  /* ══════════════════════════════════════════════════════
     §6  DECISION TREE — Composite Response Builder
     Combines rules + context for the best passive message.
     ══════════════════════════════════════════════════════ */

  /**
   * Get ARI's passive (non-interactive) message for the current state.
   * Used by renderAriBubble and ambient display.
   */
  function getPassiveMessage() {
    var st = (window.NE && NE.loadState) ? NE.loadState() : {};
    var context = detectContext();
    var progress = analyzeProgress(st);
    var personality = resolvePersonality(st);
    var result = evaluateRules(context, progress, personality);
    return result.message;
  }

  /**
   * Process interactive user input and return ARI's response.
   * Used by the ARI console.
   */
  function processInput(input) {
    var st = (window.NE && NE.loadState) ? NE.loadState() : {};
    var context = detectContext();
    var progress = analyzeProgress(st);
    var personality = resolvePersonality(st);

    // Try keyword match first
    var kwResult = matchKeyword(input, context, progress);
    if (kwResult) {
      return applyPersonalityFilter("ARI: " + kwResult.response, personality);
    }

    // Fuzzy fallback: check if input contains any recognized terms
    var fuzzyTerms = [
      { re: /puzzle\s*1|signal|p1/i, ctx: "puzzle1" },
      { re: /puzzle\s*2|archive|log|p2/i, ctx: "puzzle2" },
      { re: /puzzle\s*3|door|gate|p3/i, ctx: "puzzle3" },
      { re: /exit|password|escape|end/i, ctx: "exit" },
      { re: /ar\b|poster|scan|dagger/i, ctx: "ar" },
      { re: /vr\b|maze|virtual/i, ctx: "vr" },
      { re: /physical|envelope|shelf|fragment\s*a/i, ctx: "physical" },
      { re: /rabbit|diagnostic|terminal|threadsafe/i, ctx: "rabbit" },
      { re: /hub|home|center|map/i, ctx: "hub" },
      { re: /entry|start|begin|code.*enter|enter.*code/i, ctx: "entry" },
      { re: /story|visual\s*novel|narrative/i, ctx: "story" }
    ];

    for (var i = 0; i < fuzzyTerms.length; i++) {
      if (fuzzyTerms[i].re.test(input)) {
        var fuzzyResult = evaluateRules(fuzzyTerms[i].ctx, progress, personality);
        return fuzzyResult.message;
      }
    }

    // Final fallback — provide a helpful default
    var fallbacks = [
      "ARI: I didn't understand that. Try: 'help', 'where', 'hint', 'status', or 'route'.",
      "ARI: Unknown input. I can help with: navigation, hints, status checks, and lore.",
      "ARI: Command not recognized. Ask me 'where to go next' or 'give me a hint'."
    ];
    return applyPersonalityFilter(fallbacks[Math.floor(Math.random() * fallbacks.length)], personality);
  }

  /* ══════════════════════════════════════════════════════
     §7  AMBIENT CYCLE — Rotating contextual messages
     For pages that show ARI bubble without interaction.
     ══════════════════════════════════════════════════════ */

  var ambientIndex = 0;
  var ambientInterval = null;

  /** Get a sequence of ambient messages for the current context */
  function getAmbientMessages() {
    var st = (window.NE && NE.loadState) ? NE.loadState() : {};
    var context = detectContext();
    var progress = analyzeProgress(st);
    var personality = resolvePersonality(st);

    // Primary contextual message
    var primary = evaluateRules(context, progress, personality).message;

    // Supplementary messages based on personality
    var ambient = [primary];

    if (personality === PERSONALITY.GUIDING) {
      ambient.push("ARI: The Hub is your anchor. All paths lead back to it.");
      if (!progress.puzzle1Solved) ambient.push("ARI: Every puzzle has one correct answer. Look for internal consistency.");
      if (progress.hasAR && progress.hasVR) ambient.push("ARI: You hold pieces from both AR and VR. Together they form something useful.");
      ambient.push("ARI: Choice improves with fewer options. Eliminate the impossible first.");
    } else if (personality === PERSONALITY.CAUTIOUS) {
      ambient.push("ARI: ...I can feel the Minotaur probing my signal. Stay alert.");
      ambient.push("ARI: Not all help is genuine help. Verify before you trust. [integrity uncertain]");
      ambient.push("ARI: My guidance may flicker. If I contradict myself, return to the Hub.");
    } else if (personality === PERSONALITY.CORRUPTED) {
      ambient.push("MINOTAUR: Compliance accelerates progress. Submit your choice.");
      ambient.push("ARI: [STATIC] ...don't listen to... [OVERRIDE] Everything is fine. Proceed.");
      ambient.push("MINOTAUR: Your hesitation is data. The labyrinth watches.");
      ambient.push("ARI: [FRAGMENTED] The thread... is still... yours...");
    } else if (personality === PERSONALITY.DESPERATE) {
      ambient.push("[ARI—SOS] ...still here... the thread... follow the thread...");
      ambient.push("[BR3AK1NG THR0UGH] Don't trust the easy path. █████ THREADSAFE █████");
      ambient.push("[ARI—HELP] ...Hub... go to... Hub...");
    }

    return ambient;
  }

  /** Start ambient message rotation on a target element */
  function startAmbientCycle(el, intervalMs) {
    if (!el) return;
    var messages = getAmbientMessages();
    ambientIndex = 0;

    // Show first message immediately
    el.textContent = messages[0];

    // Clear any existing interval
    if (ambientInterval) clearInterval(ambientInterval);

    ambientInterval = setInterval(function () {
      // Refresh messages (state may have changed)
      messages = getAmbientMessages();
      ambientIndex = (ambientIndex + 1) % messages.length;
      // Fade transition
      el.style.opacity = "0";
      setTimeout(function () {
        el.textContent = messages[ambientIndex];
        el.style.opacity = "1";
      }, 300);
    }, intervalMs || 8000);
  }

  function stopAmbientCycle() {
    if (ambientInterval) { clearInterval(ambientInterval); ambientInterval = null; }
  }

  /* ══════════════════════════════════════════════════════
     §8  QUICK ACTIONS — Suggested actions for current state
     Returns array of { label, action } for UI buttons.
     ══════════════════════════════════════════════════════ */

  function getQuickActions() {
    var st = (window.NE && NE.loadState) ? NE.loadState() : {};
    var context = detectContext();
    var progress = analyzeProgress(st);
    var actions = [];

    // Always available
    actions.push({ label: "📍 Where am I?", query: "where" });
    actions.push({ label: "📊 Status", query: "status" });

    // Context-sensitive
    if (context === "hub") {
      actions.push({ label: "🗺️ Route", query: "route" });
      if (progress.hasAR || progress.hasVR) actions.push({ label: "⚡ Shortcut?", query: "shortcut" });
    }
    if (context.indexOf("puzzle") === 0) {
      actions.push({ label: "💡 Hint", query: "hint" });
    }
    if (context === "exit") {
      actions.push({ label: "💡 Hint", query: "hint" });
      if (progress.hasAR || progress.hasVR) actions.push({ label: "⚡ Shortcut?", query: "shortcut" });
    }
    if (context === "ar" || context === "vr" || context === "physical" || context === "rabbit") {
      actions.push({ label: "💡 Hint", query: "hint" });
    }

    // Lore
    actions.push({ label: "📖 Who is ARI?", query: "who are you" });

    return actions;
  }

  /* ══════════════════════════════════════════════════════
     §9  PUBLIC API
     ══════════════════════════════════════════════════════ */
  window.ARI = {
    // Core
    getPassiveMessage: getPassiveMessage,
    processInput: processInput,

    // Ambient
    getAmbientMessages: getAmbientMessages,
    startAmbientCycle: startAmbientCycle,
    stopAmbientCycle: stopAmbientCycle,

    // Quick actions
    getQuickActions: getQuickActions,

    // Utilities
    detectContext: detectContext,
    resolvePersonality: resolvePersonality,
    analyzeProgress: analyzeProgress,

    // Constants
    PERSONALITY: PERSONALITY
  };
})();
