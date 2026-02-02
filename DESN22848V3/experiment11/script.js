let rotationX = 0, rotationY = 0; // Rotation angles
let isSpinning = false; // Spin state
let shapeIndex = 0; // Current shape (0-5)
let shapeTypes = ["Box", "Sphere", "Cylinder", "Cone", "Torus", "Plane"];

function setup() {
    createCanvas(600, 400, WEBGL); // Enable 3D rendering
}

function draw() {
    background(30);

    // Lighting for better 3D effect
    ambientLight(150);
    pointLight(255, 255, 255, 200, 100, 100);

    // Rotate the shape if spinning
    if (isSpinning) {
        rotationX += 0.05;
        rotationY += 0.05;
    }

    // Apply rotation
    rotateX(rotationX);
    rotateY(rotationY);

    // Draw the selected shape
    fill(0, 150, 255);
    stroke(255);
    
    switch (shapeIndex) {
        case 0: box(100); break;
        case 1: sphere(50); break;
        case 2: cylinder(40, 100); break;
        case 3: cone(50, 100); break;
        case 4: torus(50, 20); break;
        case 5: plane(100, 100); break;
    }

    // Display current shape name
    push();
    resetMatrix();
    fill(255);
    textSize(20);
    textAlign(CENTER, CENTER);
    text("Current Shape: " + shapeTypes[shapeIndex], width / 2, height - 30);
    pop();
}

// Start spinning when Space is pressed
function keyPressed() {
    if (key === ' ') {
        isSpinning = true;
    } else if (keyCode === UP_ARROW) {
        shapeIndex = (shapeIndex + 1) % shapeTypes.length; // Cycle through shapes
    }
}

// Stop spinning when Space is released
function keyReleased() {
    if (key === ' ') {
        isSpinning = false;
    }
}

// Reset everything on left-click
function mousePressed() {
    if (mouseButton === LEFT) {
        rotationX = 0;
        rotationY = 0;
        isSpinning = false;
        shapeIndex = 0;
    }
}
