let player;
let stars = [];
let obstacles = [];
let score = 0;
let gameOver = false;

function setup() {
    let canvas = createCanvas(800, 600);
    canvas.parent('canvas-container');
    player = new Player();
    spawnItem();
}

function draw() {
    background(240);

    if (!gameOver) {
        player.update();
        player.display();

        // update and draw stars
        for (let i = stars.length - 1; i >= 0; i--) {
            stars[i].update();
            stars[i].display();

            // check if player collects a star
            if (player.collects(stars[i])) {
                score += 10;
                stars.splice(i, 1);
                document.getElementById("scoreDisplay").innerText = score;
            }

            // remove stars if they go off screen
            if (stars[i] && stars[i].y > height) {
                stars.splice(i, 1);
            }
        }

        // update and draw obstacles
        for (let i = obstacles.length - 1; i >= 0; i--) {
            obstacles[i].update();
            obstacles[i].display();

            // check if player hits an obstacle
            if (player.hits(obstacles[i])) {
                gameOver = true;
                document.getElementById("gameOverText").style.display = "block";
            }

            // remove obstacles if they go off screen
            if (obstacles[i] && obstacles[i].y > height) {
                obstacles.splice(i, 1);
            }
        }
    } else {
        fill(0);
        textSize(32);
        textAlign(CENTER, CENTER);
        text("Game Over! Press Space to Restart", width / 2, height / 2);
    }
}

// function to spawn new stars and obstacles randomly
function spawnItem() {
    if (!gameOver) {
        let x = random(width);
        let type = random() > 0.5 ? "star" : "obstacle";

        if (type === "star") {
            stars.push(new Star(x, 0));
        } else {
            obstacles.push(new Obstacle(x, 0));
        }
    }

    let nextSpawnTime = random(500, 1500); // 0.5s to 1.5s
    setTimeout(spawnItem, nextSpawnTime);
}

// function to restart game
function keyPressed() {
    if (gameOver && key === ' ') {
        resetGame();
    }
}

// function to reset the game
function resetGame() {
    gameOver = false;
    document.getElementById("gameOverText").style.display = "none";
    score = 0;
    document.getElementById("scoreDisplay").innerText = score;
    stars = [];
    obstacles = [];
}

// player class
class Player {
    constructor() {
        this.x = width / 2;
        this.y = height - 50;
        this.size = 40;
        this.speed = 5;
    }

    update() {
        if (keyIsDown(LEFT_ARROW) && this.x > 0) {
            this.x -= this.speed;
        }
        if (keyIsDown(RIGHT_ARROW) && this.x < width) {
            this.x += this.speed;
        }
    }

    display() {
        fill(0, 0, 255);
        ellipse(this.x, this.y, this.size);
    }

    collects(star) {
        if (!star) return false;
        let d = dist(this.x, this.y, star.x, star.y);
        return d < (this.size + star.size) / 2;
    }

    hits(obstacle) {
        if (!obstacle) return false;
        let d = dist(this.x, this.y, obstacle.x, obstacle.y);
        return d < (this.size + obstacle.size) / 2;
    }
}

// star class
class Star {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 30;
        this.speed = random(2, 5);
    }

    update() {
        this.y += this.speed;
    }

    display() {
        fill(255, 255, 0);
        noStroke();
        ellipse(this.x, this.y, this.size);
    }
}

// obstacle class
class Obstacle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 40;
        this.speed = random(3, 6);
    }

    update() {
        this.y += this.speed;
    }

    display() {
        fill(255, 0, 0);
        noStroke();
        rectMode(CENTER);
        rect(this.x, this.y, this.size, this.size);
    }
}
