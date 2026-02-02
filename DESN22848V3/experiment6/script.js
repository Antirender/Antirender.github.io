let shapes = [];

function setup() {
    let canvas = createCanvas(800, 600);
    canvas.parent('canvas-container');
    background(240);
}

function draw() {
    background(240);

    // draw all stored shapes
    for (let s of shapes) {
        s.display();
    }
}

function keyPressed() {
    let x = random(width);
    let y = random(height);
    let size = random(20, 60);
    
    if (key === ' ') {
        // space key draws a red circle
        shapes.push(new Shape(x, y, size, color(255, 0, 0), 'circle'));
    } else if (keyCode === UP_ARROW) {
        // up arrow draws a blue rectangle
        shapes.push(new Shape(x, y, size, color(0, 0, 255), 'rectangle'));
    } else if (keyCode === DOWN_ARROW) {
        // down arrow draws a green triangle
        shapes.push(new Shape(x, y, size, color(0, 255, 0), 'triangle'));
    } else if (keyCode === LEFT_ARROW) {
        // left arrow draws a yellow ellipse
        shapes.push(new Shape(x, y, size, color(255, 255, 0), 'ellipse'));
    } else if (keyCode === RIGHT_ARROW) {
        // right arrow draws a purple star
        shapes.push(new Shape(x, y, size, color(128, 0, 128), 'star'));
    }
}

function mousePressed() {
    // left click clears all shapes
    shapes = [];
}

// shape class
class Shape {
    constructor(x, y, size, col, type) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.col = col;
        this.type = type;
    }

    display() {
        fill(this.col);
        noStroke();

        if (this.type === 'circle') {
            ellipse(this.x, this.y, this.size);
        } else if (this.type === 'rectangle') {
            rectMode(CENTER);
            rect(this.x, this.y, this.size, this.size);
        } else if (this.type === 'triangle') {
            triangle(
                this.x, this.y - this.size / 2,
                this.x - this.size / 2, this.y + this.size / 2,
                this.x + this.size / 2, this.y + this.size / 2
            );
        } else if (this.type === 'ellipse') {
            ellipse(this.x, this.y, this.size * 1.5, this.size);
        } else if (this.type === 'star') {
            this.drawStar(this.x, this.y, this.size / 2, this.size);
        }
    }

    drawStar(x, y, radius1, radius2) {
        beginShape();
        for (let i = 0; i < 10; i++) {
            let angle = PI / 5 * i;
            let r = (i % 2 === 0) ? radius2 : radius1;
            let sx = x + cos(angle) * r;
            let sy = y + sin(angle) * r;
            vertex(sx, sy);
        }
        endShape(CLOSE);
    }
}
