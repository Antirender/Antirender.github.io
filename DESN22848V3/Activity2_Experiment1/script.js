let sounds = {};
let visuals = [];
let colors = [ [255, 0, 0], [0, 255, 0], [0, 0, 255], [255, 255, 0], [128, 0, 128] ];

function preload() {
    soundFormats('mp3');

    try {
        sounds['space'] = loadSound('drum.mp3');
        sounds['up'] = loadSound('synth.mp3');
        sounds['down'] = loadSound('bass.mp3');
        sounds['left'] = loadSound('guitar.mp3');
        sounds['right'] = loadSound('bell.mp3');
    } catch (error) {
        console.error("Error loading sounds:", error);
    }
}

function setup() {
    createCanvas(600, 400);
}

function draw() {
    background(30);

    // Display visuals when buttons are pressed
    for (let v of visuals) {
        fill(v.color);
        noStroke();
        ellipse(v.x, v.y, v.size);
        v.size += 1;  // Expand visual effect
        v.alpha -= 5; // Fade out
    }

    // Remove visuals when fully faded
    visuals = visuals.filter(v => v.alpha > 0);

    fill(255);
    textSize(18);
    textAlign(CENTER, CENTER);
    text("Press Makey Makey buttons to play sounds!", width / 2, 30);
}

// Function to play sound and add a visual effect
function playSound(key, colorIndex) {
    if (sounds[key] && !sounds[key].isPlaying()) {
        sounds[key].play();
        visuals.push({ x: random(width), y: random(height), size: 20, alpha: 255, color: colors[colorIndex] });
    }
}

// Key press mapping to Makey Makey
function keyPressed() {
    if (key === ' ') {
        playSound('space', 0);
    } else if (keyCode === UP_ARROW) {
        playSound('up', 1);
    } else if (keyCode === DOWN_ARROW) {
        playSound('down', 2);
    } else if (keyCode === LEFT_ARROW) {
        playSound('left', 3);
    } else if (keyCode === RIGHT_ARROW) {
        playSound('right', 4);
    }
}

// Reset visuals when mouse is clicked
function mousePressed() {
    if (mouseButton === LEFT) {
        visuals = [];
    }
}
