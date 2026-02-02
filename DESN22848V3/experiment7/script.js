let fallingShapes = [];
let score = 0;

function setup() {
    let canvas = createCanvas(800, 600);
    canvas.parent('canvas-container');
    spawnShape(); // start the first shape spawn
}

function draw() {
    background(240);

    // update and draw falling shapes
    for (let i = fallingShapes.length - 1; i >= 0; i--) {
        fallingShapes[i].update();
        fallingShapes[i].display();

        // remove shapes if they reach the bottom
        if (fallingShapes[i].y > height) {
            fallingShapes.splice(i, 1);
        }
    }

    fill(0);
    textSize(24);
    textAlign(CENTER, CENTER);
    text("Press Space when the shape reaches the bottom!", width / 2, 30);
}

// function to spawn new shapes at **random intervals (0.25s - 1.5s)**
function spawnShape() {
    let x = random(width * 0.3, width * 0.7);
    let speed = random(2, 5);
    fallingShapes.push(new FallingShape(x, 0, speed));

    let nextSpawnTime = random(250, 1500); // 0.25s to 1.5s
    setTimeout(spawnShape, nextSpawnTime);
}

// function to detect Space key press
function keyPressed() {
    if (key === ' ') {
        let shapeCaught = false;
        for (let i = fallingShapes.length - 1; i >= 0; i--) {
            if (fallingShapes[i].isCatchable()) {
                score += 10;
                fallingShapes.splice(i, 1);
                shapeCaught = true;
                break;
            }
        }

        if (shapeCaught) {
            document.getElementById("scoreDisplay").innerText = score;
        }
    }
}

// falling shape class
class FallingShape {
    constructor(x, y, speed) {
        this.x = x;
        this.y = y;
        this.size = 40;
        this.speed = speed;
        this.color = color(random(255), random(255), random(255));
    }

    update() {
        this.y += this.speed;
    }

    display() {
        fill(this.color);
        noStroke();
        ellipse(this.x, this.y, this.size);
    }

    isCatchable() {
        return this.y >= height - 50;
    }
}
