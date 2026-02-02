let colors = ["red", "blue", "green", "yellow", "purple"];
let keyMap = {
    " ": "red",         // Space → Red Light
    "ArrowUp": "blue",  // Up Arrow → Blue Light
    "ArrowDown": "green", // Down Arrow → Green Light
    "ArrowLeft": "yellow", // Left Arrow → Yellow Light
    "ArrowRight": "purple" // Right Arrow → Purple Light
};

let targetColor = "red"; // Default value to avoid undefined issues
let startTime;
let reactionTime = "--";
let waitingForResponse = false;

function setup() {
    createCanvas(600, 400);
    pickNewColor();
}

function draw() {
    background(240);

    // Ensure targetColor is a valid string before using fill()
    if (typeof targetColor === "string" && colors.includes(targetColor)) {
        fill(targetColor);
    } else {
        fill(255, 0, 0); // Default to red if there's an issue
    }

    rect(200, 100, 200, 200); // Display reaction light

    // Display instructions
    fill(0);
    textSize(18);
    textAlign(CENTER, CENTER);
    text("React fast! Press the correct button!", width / 2, 50);
    text("Target Color: " + targetColor.toUpperCase(), width / 2, 80);
}

// Function to select a new random color
function pickNewColor() {
    setTimeout(() => {
        let newColor = random(colors); // Ensure random() picks a valid value
        if (typeof newColor === "string") {
            targetColor = newColor; // Assign it properly
        } else {
            targetColor = "red"; // Fallback in case of error
        }
        startTime = millis();
        waitingForResponse = true;
    }, random(2000, 5000)); // Random delay before light turns on
}

// Detect key press and measure reaction time
function keyPressed() {
    if (waitingForResponse && keyMap[key] === targetColor) {
        reactionTime = millis() - startTime;
        document.getElementById("reactionTime").innerText = reactionTime;
        waitingForResponse = false;
        pickNewColor(); // Start a new round
    }
}

// Reset game on left-click
function mousePressed() {
    if (mouseButton === LEFT) {
        reactionTime = "--";
        document.getElementById("reactionTime").innerText = reactionTime;
        pickNewColor();
    }
}
