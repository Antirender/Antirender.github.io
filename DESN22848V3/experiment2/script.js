let bgColor;

function setup() {
    let canvas = createCanvas(800, 600);
    canvas.parent('canvas-container');
    bgColor = color(255);
}

function draw() {
    background(bgColor);
    fill(0);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("Press keys to interact!", width / 2, height / 2);
}

function keyPressed() {
    if (key === ' ') {
        // space key changes background color
        bgColor = color(random(255), random(255), random(255));
    } else if (keyCode === UP_ARROW) {
        // up arrow makes background blue
        bgColor = color(0, 0, 255);
    } else if (keyCode === DOWN_ARROW) {
        // down arrow makes background red
        bgColor = color(255, 0, 0);
    } else if (keyCode === LEFT_ARROW) {
        // left arrow makes background green
        bgColor = color(0, 255, 0);
    } else if (keyCode === RIGHT_ARROW) {
        // right arrow makes background yellow
        bgColor = color(255, 255, 0);
    }
}
