let particles = [];
let gravityX = 0, gravityY = 0.1; // Default gravity (downwards)

function setup() {
    createCanvas(600, 400);
}

function draw() {
    background(30);

    // Update and display particles
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].applyForce(gravityX, gravityY);
        particles[i].update();
        particles[i].display();

        // Remove faded particles
        if (particles[i].alpha <= 0) {
            particles.splice(i, 1);
        }
    }

    // Display instruction
    fill(255);
    textSize(16);
    textAlign(CENTER, CENTER);
    text("Press Space to generate particles. Arrow keys change gravity. Left-click to clear.", width / 2, height - 20);
}

// Particle class
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = random(-1, 1);
        this.vy = random(-2, 0);
        this.size = random(5, 15);
        this.alpha = 255;
        this.color = color(random(255), random(255), random(255));
    }

    applyForce(fx, fy) {
        this.vx += fx;
        this.vy += fy;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= 2; // Fade out
    }

    display() {
        noStroke();
        fill(this.color.levels[0], this.color.levels[1], this.color.levels[2], this.alpha);
        ellipse(this.x, this.y, this.size);
    }
}

// Create particles when Space is pressed
function keyPressed() {
    if (key === ' ') {
        for (let i = 0; i < 10; i++) {
            particles.push(new Particle(width / 2, height / 2));
        }
    } else if (keyCode === LEFT_ARROW) {
        gravityX = -0.1;
        gravityY = 0;
    } else if (keyCode === RIGHT_ARROW) {
        gravityX = 0.1;
        gravityY = 0;
    } else if (keyCode === UP_ARROW) {
        gravityX = 0;
        gravityY = -0.1;
    } else if (keyCode === DOWN_ARROW) {
        gravityX = 0;
        gravityY = 0.1;
    }
}

// Clear all particles on left-click
function mousePressed() {
    if (mouseButton === LEFT) {
        particles = [];
    }
}
