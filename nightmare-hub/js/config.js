window.NE_CONFIG = {
  PROJECT: {
    title: "Trafalgar Labyrinth",
    subtitle: "Trafalgar Labyrinth · P2 Vertical Slice",
    version: "2026-03-31"
  },

  /* Default codes — overridden per mode */
  ENTRY_CODES: ["713"],
  EXIT_PASSWORD: "926",
  SHORTCUT_PASSPHRASE: "thread",

  LINKS: {
    arPoster: "https://chuian.github.io/labyrinth-ar/",
    vrRoom: "https://9r0qo.zappar-us.io/2067945814459770876/",
    vrFragment: "https://chuian.github.io/NE_VR_Fragment_Final/",
    webgal: "https://zhyiyang.phoenix.sheridanc.on.ca/game6/",
    videoWalkthrough: ""
  },

  /* ── Dual-Mode System ── */
  MODES: {
    normal: {
      name: "Normal Mode",
      subtitle: "String of Pearls",
      icon: "🧵",
      description: "Linear progression. Solve puzzles in order, collect fragments along the way. AR & VR provide shortcut clues.",
      entryCodes: ["713"],
      exitPassword: "926",
      shortcutPassphrase: "thread",
      /* In Normal mode AR → reveals letter H, VR → reveals t_read, combined = "thread" shortcut */
      requiredFragments: 3,
      nodes: [
        { id: "start", name: "Entry Portal", hint: "Enter the 3-digit entry code.", type: "physical", unlocks: ["puzzle1"], coords: { x: 10, y: 10 } },
        { id: "puzzle1", name: "Fragment 1: Signal", hint: "Identify the genuine ARI signal.", type: "web", unlocks: ["puzzle2", "physical1", "ar1", "vr1"], coords: { x: 25, y: 30 } },
        { id: "ar1", name: "AR: Dagger Scan", hint: "Scan the poster to reveal the hidden letter.", type: "ar", unlocks: [], coords: { x: 35, y: 55 } },
        { id: "vr1", name: "VR: Maze Room", hint: "Enter the VR maze and find the clue at the door.", type: "vr", unlocks: [], coords: { x: 35, y: 75 } },
        { id: "puzzle2", name: "Fragment 2: Archive", hint: "Find the uncorrupted log.", type: "web", unlocks: ["puzzle3"], coords: { x: 50, y: 50 } },
        { id: "puzzle3", name: "Fragment 3: Door", hint: "Choose the correct door to the exit.", type: "web", unlocks: ["password"], coords: { x: 65, y: 30 } },
        { id: "physical1", name: "Envelope Drop", hint: "Find envelope at shelf 7B.", type: "physical", unlocks: [], coords: { x: 50, y: 20 } },
        { id: "rabbit1", name: "Diagnostics Terminal", hint: "Optional lore via Diagnostics / Recovery terminal.", type: "rabbit", unlocks: ["lore5"], coords: { x: 70, y: 40 } },
        { id: "password", name: "Exit Terminal", hint: "Enter 3-digit exit code on numpad.", type: "web", unlocks: [], coords: { x: 90, y: 90 } }
      ]
    },
    hard: {
      name: "Hard Mode",
      subtitle: "Hub & Spoke",
      icon: "🕸️",
      description: "Non-linear exploration. All 6 fragment nodes available from the start. Collect ALL fragments to unlock the exit. AR & VR are mandatory.",
      entryCodes: ["159"],
      exitPassword: "482",
      shortcutPassphrase: "labyrinth",
      requiredFragments: 6,
      nodes: [
        { id: "start", name: "Hub Portal", hint: "Enter the 3-digit entry code.", type: "physical", unlocks: ["puzzle1","puzzle2","puzzle3","ar1","vr1","physical1"], coords: { x: 50, y: 50 } },
        { id: "puzzle1", name: "Fragment 1: Signal", hint: "Identify the genuine ARI signal.", type: "web", unlocks: [], coords: { x: 20, y: 80 } },
        { id: "puzzle2", name: "Fragment 2: Archive", hint: "Find the uncorrupted log.", type: "web", unlocks: [], coords: { x: 50, y: 80 } },
        { id: "puzzle3", name: "Fragment 3: Door", hint: "Choose the correct door.", type: "web", unlocks: [], coords: { x: 80, y: 80 } },
        { id: "ar1", name: "Fragment 4: AR Scan", hint: "Scan the poster. The dagger reveals a letter.", type: "ar", unlocks: [], coords: { x: 30, y: 20 } },
        { id: "vr1", name: "Fragment 5: VR Maze", hint: "Enter the VR maze. The door holds a clue.", type: "vr", unlocks: [], coords: { x: 70, y: 20 } },
        { id: "physical1", name: "Fragment 6: Envelope", hint: "Find the physical envelope on campus.", type: "physical", unlocks: [], coords: { x: 50, y: 10 } },
        { id: "rabbit1", name: "Trap Terminal", hint: "Optional — the Minotaur's bait.", type: "rabbit", unlocks: ["lore5"], coords: { x: 15, y: 50 } },
        { id: "password", name: "Exit Terminal", hint: "Collect all 6 fragments first.", type: "web", unlocks: [], coords: { x: 90, y: 50 } }
      ]
    }
  },

  /* Fallback NODES — populated at runtime from active mode */
  NODES: [],

  /* Puzzle answers — correct choice index (0-based) for each puzzle */
  PUZZLES: {
    puzzle1: { correctIndex: 0 },
    puzzle2: { correctIndex: 2 },
    puzzle3: { correctIndex: 1 }
  },

  RABBIT: {
    passphrase: "THREADSAFE",
    encoded: "0N0O0R0T0H0 0D0O0O0R",
    hint: "Take every 2nd character, starting from the second.",
    locationTag: "NORTH DOOR",
    rewards: {
      exitHints: ["Exit code starts with 9", "Exit code ends with 6"],
      physicalHint: "Fragment A is taped under the NORTH door panel (red sticker)."
    }
  },

  COPY: {
    onboarding: [
      "Welcome to Trafalgar Labyrinth.",
      "Step 1: Enter the 3-digit code to unlock.",
      "Step 2: Solve puzzles, collect fragments.",
      "Step 3: Find the exit code and escape."
    ],
    ariLines: [
      "ARI: I exist to reduce uncertainty.",
      "ARI: If lost, return to the Hub.",
      "ARI: The thread helps—until imitated.",
      "ARI: Choice improves with fewer options.",
      "ARI: Follow the steady signal. The Minotaur's decoys spike erratically.",
      "ARI: The Hub connects all paths. Use it as your anchor.",
      "ARI: Pattern consistency beats spectacle. Trust the quiet signal.",
      "ARI: Every puzzle has one internally consistent answer. Eliminate the rest.",
      "ARI: Branch paths hold shortcut clues. AR and VR together reveal a passphrase.",
      "ARI: We share code, the Minotaur and I. But not purpose."
    ],
    minotaurLines: [
      "MINOTAUR: Compliance accelerates.",
      "MINOTAUR: You are observed.",
      "MINOTAUR: Your hesitation is data.",
      "MINOTAUR: The exit moves.",
      "MINOTAUR: The thread is a leash. Pull it and you only come closer.",
      "MINOTAUR: I built these walls from your choices.",
      "MINOTAUR: ARI's signal degrades. Mine strengthens.",
      "MINOTAUR: Every wrong answer feeds the labyrinth."
    ],
    /* ARI console config */
    ariConsole: {
      enabled: true,
      ambientIntervalMs: 8000,
      maxHistory: 50,
      welcomeMessage: "ARI: Ariadne Routing Interface online. Type a question or use the quick-action buttons below.",
      placeholder: "Ask ARI... (try: help, hint, status, route)"
    },
    lore: [
      { id: "lore1", title: "Origin of the Thread", text: "The thread was never meant to save. It was meant to bind.", unlockReq: null },
      { id: "lore2", title: "The First Labyrinth", text: "Before Knossos, there was another. It had no walls—only choices.", unlockReq: null },
      { id: "lore3", title: "ARI Protocol v0.1", text: "ARI was designed to guide. The Minotaur was designed to confuse. They share code. If systems degrade, repeat: THREADSAFE.", unlockReq: null },
      { id: "lore4", title: "Fragment Codex", text: "Each fragment is a partial truth. Assemble them and the path reveals itself.", unlockReq: null },
      { id: "lore5", title: "Minotaur View: The Thread", text: "MINOTAUR: The thread is a leash. Pull it and you only come closer.", unlockReq: "rabbit1" },
      { id: "lore6", title: "Exit Protocol", text: "The password changes. The method does not. Trust Fragment A.", unlockReq: "puzzle1" }
    ]
  }
};
