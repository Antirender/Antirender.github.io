let fallingShapes = [];
let score = 0;
let difficultyMultiplier = 1.0;

function setup() {
    let canvas = createCanvas(800, 600);
    canvas.parent('canvas-container');
    spawnShape(); // start spawning shapes
}

function draw() {
    background(240);

    // update and draw falling shapes
    for (let i = fallingShapes.length - 1; i >= 0; i--) {
        fallingShapes[i].update();
        fallingShapes[i].display();

        // remove shapes if they leave the screen
        if (fallingShapes[i].isOutOfBounds()) {
            fallingShapes.splice(i, 1);
        }
    }

    fill(0);
    textSize(24);
    textAlign(CENTER, CENTER);
    text("Press the correct key to catch the right shape.", width / 2, 30);
}

// function to spawn new shapes at **random intervals (0.25s - 1.5s)**
function spawnShape() {
    let shapeTypes = ['circle', 'square', 'triangle', 'star', 'diamond'];
    let selectedShape = random(shapeTypes);
    
    let x = random(width * 0.2, width * 0.8);
    let baseSpeed = random(2, 4) * difficultyMultiplier;
    let isReverse = random() > 0.85; // 15% chance of reverse movement

    fallingShapes.push(new FallingShape(x, isReverse ? height : 0, baseSpeed, selectedShape, isReverse));

    // increase difficulty slightly over time
    difficultyMultiplier *= 1.001;

    let nextSpawnTime = random(250, 1500); // 0.25s to 1.5s
    setTimeout(spawnShape, nextSpawnTime);
}

// function to detect key presses and match the correct shape
function keyPressed() {
    let shapeCaught = false;
    for (let i = fallingShapes.length - 1; i >= 0; i--) {
        if (fallingShapes[i].isCatchable()) {
            let correctKey = fallingShapes[i].getKey();
            if (correctKey && keyCode === correctKey) {
                score += fallingShapes[i].getScore();
                fallingShapes.splice(i, 1);
                shapeCaught = true;
                break;
            }
        }
    }

    if (shapeCaught) {
        document.getElementById("scoreDisplay").innerText = score;
    }
}

// falling shape class
class FallingShape {
    constructor(x, y, speed, type, isReverse) {
        this.x = x;
        this.y = y;
        this.size = 50;
        this.speed = speed;
        this.type = type;
        this.isReverse = isReverse;
        this.color = this.getColor();
    }

    update() {
        this.y += this.isReverse ? -this.speed : this.speed;
    }

    display() {
        fill(this.color);
        noStroke();
        
        if (this.type === 'circle') {
            ellipse(this.x, this.y, this.size);
        } else if (this.type === 'square') {
            rectMode(CENTER);
            rect(this.x, this.y, this.size, this.size);
        } else if (this.type === 'triangle') {
            triangle(
                this.x, this.y - this.size / 2,
                this.x - this.size / 2, this.y + this.size / 2,
                this.x + this.size / 2, this.y + this.size / 2
            );
        } else if (this.type === 'star') {
            this.drawStar(this.x, this.y, this.size / 2, this.size);
        } else if (this.type === 'diamond') {
            quad(
                this.x, this.y - this.size / 2,
                this.x - this.size / 2, this.y,
                this.x, this.y + this.size / 2,
                this.x + this.size / 2, this.y
            );
        }
    }

    getColor() {
        let colors = {
            'circle': color(255, 0, 0),      // red
            'square': color(0, 0, 255),      // blue
            'triangle': color(0, 255, 0),    // green
            'star': color(255, 255, 0),      // yellow
            'diamond': color(128, 0, 128)    // purple
        };
        return colors[this.type];
    }

    getScore() {
        let scores = {
            'circle': 5,       // space
            'square': 10,      // up arrow
            'triangle': 15,    // down arrow
            'star': 20,        // left arrow
            'diamond': 25      // right arrow
        };
        return scores[this.type];
    }

    getKey() {
        let keys = {
            'circle': 32,     // space
            'square': UP_ARROW,
            'triangle': DOWN_ARROW,
            'star': LEFT_ARROW,
            'diamond': RIGHT_ARROW
        };
        return keys[this.type];
    }

    isCatchable() {
        return this.y >= height - 50 || this.y <= 50;
    }

    isOutOfBounds() {
        return this.y > height + 50 || this.y < -50;
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
