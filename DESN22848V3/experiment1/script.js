let bgColor;
let circles = [];
let squares = [];
let movingObjects = [];
let stars = [];

function setup() {
    let canvas = createCanvas(800, 600);
    canvas.parent('canvas-container');
    bgColor = color(255);
}

function draw() {
    background(bgColor);

    // draw all stored circles
    for (let c of circles) {
        fill(0, 0, 255);
        ellipse(c.x, c.y, 40, 40);
    }

    // draw all stored squares
    for (let s of squares) {
        fill(255, 0, 0);
        rect(s.x, s.y, 40, 40);
    }

    // draw all stored stars
    for (let star of stars) {
        drawStar(star.x, star.y, star.size);
    }

    // update and draw moving objects
    for (let obj of movingObjects) {
        obj.update();
        obj.display();
    }

    // remove finished animations
    movingObjects = movingObjects.filter(obj => obj.active);
}

function keyPressed() {
    if (key === ' ') {
        // space key changes background color
        bgColor = color(random(255), random(255), random(255));
    } else if (keyCode === UP_ARROW) {
        // up arrow adds a blue circle at the top
        circles.push({ x: random(width), y: 50 });
    } else if (keyCode === DOWN_ARROW) {
        // down arrow adds a red square at the bottom
        squares.push({ x: random(width), y: height - 50 });
    } else if (keyCode === LEFT_ARROW) {
        // left arrow triggers left sliding animation
        movingObjects.push(new MovingObject(-50, height / 2, 50, 'left'));
    } else if (keyCode === RIGHT_ARROW) {
        // right arrow triggers right sliding animation
        movingObjects.push(new MovingObject(width + 50, height / 2, 50, 'right'));
    }
}

function mousePressed() {
    if (mouseButton === LEFT) {
        // left click adds a random star
        stars.push({
            x: random(width),
            y: random(height),
            size: random(20, 50)
        });
    }
}

// class for sliding objects
class MovingObject {
    constructor(x, y, size, direction) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.direction = direction;
        this.speed = 5;
        this.active = true;
    }

    update() {
        if (this.direction === 'left') {
            this.x += this.speed;
            if (this.x > width / 2) this.active = false;
        } else if (this.direction === 'right') {
            this.x -= this.speed;
            if (this.x < width / 2) this.active = false;
        }
    }

    display() {
        fill(0, 255, 0);
        ellipse(this.x, this.y, this.size);
    }
}

// function to draw a star
function drawStar(x, y, size) {
    fill(255, 255, 0);
    stroke(0);
    strokeWeight(1);
    beginShape();
    for (let i = 0; i < 10; i++) {
        let angle = PI / 5 * i;
        let r = i % 2 === 0 ? size : size / 2;
        let sx = x + cos(angle) * r;
        let sy = y + sin(angle) * r;
        vertex(sx, sy);
    }
    endShape(CLOSE);
}
