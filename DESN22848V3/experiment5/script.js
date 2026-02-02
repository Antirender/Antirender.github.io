let objects = [];

function setup() {
    let canvas = createCanvas(800, 600);
    canvas.parent('canvas-container');
    background(240);
}

function draw() {
    background(240);

    // update and display all objects
    for (let obj of objects) {
        obj.update();
        obj.display();
    }
}

function keyPressed() {
    let x = random(width);
    let size = random(20, 50);
    
    if (key === ' ') {
        // space key drops a red bouncing ball
        objects.push(new BouncingObject(x, 50, size, color(255, 0, 0)));
    } else if (keyCode === UP_ARROW) {
        // up arrow drops a blue bouncing square
        objects.push(new BouncingObject(x, 50, size, color(0, 0, 255), 'square'));
    } else if (keyCode === DOWN_ARROW) {
        // down arrow drops a green bouncing ball
        objects.push(new BouncingObject(x, 50, size, color(0, 255, 0)));
    } else if (keyCode === LEFT_ARROW) {
        // left arrow drops a yellow square
        objects.push(new BouncingObject(x, 50, size, color(255, 255, 0), 'square'));
    } else if (keyCode === RIGHT_ARROW) {
        // right arrow drops a purple ball
        objects.push(new BouncingObject(x, 50, size, color(128, 0, 128)));
    }
}

function mousePressed() {
    // left click drops a bouncing object with random color
    let size = random(20, 50);
    let colors = [color(255, 165, 0), color(0, 255, 255), color(255, 20, 147)];
    let shapeType = random(['circle', 'square']);
    objects.push(new BouncingObject(mouseX, 50, size, random(colors), shapeType));
}

// class for bouncing objects
class BouncingObject {
    constructor(x, y, size, col, shape = 'circle') {
        this.x = x;
        this.y = y;
        this.size = size;
        this.col = col;
        this.shape = shape;
        this.ySpeed = 0;
        this.gravity = 0.5;
        this.bounceFactor = 0.7;
    }

    update() {
        this.ySpeed += this.gravity;
        this.y += this.ySpeed;

        // bounce when hitting the bottom
        if (this.y + this.size / 2 >= height) {
            this.y = height - this.size / 2;
            this.ySpeed *= -this.bounceFactor;
        }
    }

    display() {
        fill(this.col);
        noStroke();
        if (this.shape === 'circle') {
            ellipse(this.x, this.y, this.size);
        } else {
            rectMode(CENTER);
            rect(this.x, this.y, this.size, this.size);
        }
    }
}
