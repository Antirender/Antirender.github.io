let shapeX, shapeY;
let shapeIndex = 0;
let shapeTypes = ["Circle", "Square", "Triangle", "Star", "Line"];
let shapeColor;

function setup() {
    createCanvas(600, 400);
    shapeX = width / 2;
    shapeY = height / 2;
    shapeColor = color(random(255), random(255), random(255));
}

function draw() {
    background(240);

    // Display shape type text
    fill(0);
    textSize(18);
    textAlign(CENTER, CENTER);
    text("Current Shape: " + shapeTypes[shapeIndex], width / 2, 30);

    // Set shape color
    fill(shapeColor);
    noStroke();

    // Draw shape based on selected index
    if (shapeIndex === 0) {
        ellipse(shapeX, shapeY, 50, 50);
    } else if (shapeIndex === 1) {
        rectMode(CENTER);
        rect(shapeX, shapeY, 50, 50);
    } else if (shapeIndex === 2) {
        triangle(shapeX, shapeY - 30, shapeX - 25, shapeY + 20, shapeX + 25, shapeY + 20);
    } else if (shapeIndex === 3) {
        drawStar(shapeX, shapeY, 15, 30, 5);
    } else if (shapeIndex === 4) {
        stroke(0);
        line(shapeX - 30, shapeY, shapeX + 30, shapeY);
    }
}

// Move shape with arrow keys
function keyPressed() {
    let step = 10;
    if (keyCode === LEFT_ARROW) {
        shapeX -= step;
    } else if (keyCode === RIGHT_ARROW) {
        shapeX += step;
    } else if (keyCode === UP_ARROW) {
        shapeY -= step;
    } else if (keyCode === DOWN_ARROW) {
        shapeY += step;
    } else if (key === ' ') {
        shapeIndex = (shapeIndex + 1) % shapeTypes.length; // Cycle through shapes
        shapeColor = color(random(255), random(255), random(255)); // Change color
    }
}

// Reset shape position on left-click
function mousePressed() {
    if (mouseButton === LEFT) {
        shapeX = width / 2;
        shapeY = height / 2;
    }
}

// Function to draw a star
function drawStar(x, y, radius1, radius2, npoints) {
    let angle = TWO_PI / npoints;
    let halfAngle = angle / 2.0;
    beginShape();
    for (let i = 0; i < TWO_PI; i += angle) {
        let sx = x + cos(i) * radius2;
        let sy = y + sin(i) * radius2;
        vertex(sx, sy);
        sx = x + cos(i + halfAngle) * radius1;
        sy = y + sin(i + halfAngle) * radius1;
        vertex(sx, sy);
    }
    endShape(CLOSE);
}
