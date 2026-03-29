let bgColor;
let movingCircles = [];

function setup() {
    let canvas = createCanvas(800, 600);
    canvas.parent('canvas-container');
    bgColor = color(255);
}

function draw() {
    background(bgColor);

    // update and draw all moving circles
    for (let c of movingCircles) {
        c.move();
        c.display();
    }

    fill(0);
    textSize(24);
    textAlign(CENTER, CENTER);
    text("Press keys or click to interact!", width / 2, height / 2);
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

function mousePressed() {
    if (mouseButton === LEFT) {
        // left click adds a moving circle
        movingCircles.push(new MovingCircle(random(width), random(height)));
    }
}

// moving circle class
class MovingCircle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = random(20, 50);
        this.xSpeed = random(-2, 2);
        this.ySpeed = random(-2, 2);
    }

    move() {
        this.x += this.xSpeed;
        this.y += this.ySpeed;

        // bounce off edges
        if (this.x < 0 || this.x > width) {
            this.xSpeed *= -1;
        }
        if (this.y < 0 || this.y > height) {
            this.ySpeed *= -1;
        }
    }

    display() {
        fill(255, 165, 0);
        noStroke();
        ellipse(this.x, this.y, this.size);
    }
}
