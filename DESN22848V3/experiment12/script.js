let ball;
let boxSize = 300;
let paused = false;

function setup() {
    createCanvas(600, 400, WEBGL);
    ball = new Ball();
}

function draw() {
    background(30);
    
    // Lighting for better 3D effect
    ambientLight(150);
    pointLight(255, 255, 255, 200, 100, 100);

    // Draw the boundary box
    stroke(255);
    noFill();
    box(boxSize);

    // Update ball position if not paused
    if (!paused) {
        ball.update();
    }
    
    ball.display();
}

// Ball class
class Ball {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.size = 30;
        this.speedX = 2;
        this.speedY = 2;
        this.speedZ = 2;
    }

    update() {
        // Move ball
        this.x += this.speedX;
        this.y += this.speedY;
        this.z += this.speedZ;

        // Bounce off walls
        if (abs(this.x) > boxSize / 2 - this.size / 2) this.speedX *= -1;
        if (abs(this.y) > boxSize / 2 - this.size / 2) this.speedY *= -1;
        if (abs(this.z) > boxSize / 2 - this.size / 2) this.speedZ *= -1;
    }

    display() {
        fill(0, 255, 0);
        noStroke();
        push();
        translate(this.x, this.y, this.z);
        sphere(this.size / 2);
        pop();
    }
}

// Adjust ball speed with arrow keys
function keyPressed() {
    let speedStep = 0.5;
    if (keyCode === LEFT_ARROW) {
        ball.speedX -= speedStep;
    } else if (keyCode === RIGHT_ARROW) {
        ball.speedX += speedStep;
    } else if (keyCode === UP_ARROW) {
        ball.speedY -= speedStep;
    } else if (keyCode === DOWN_ARROW) {
        ball.speedY += speedStep;
    } else if (key === ' ') {
        paused = !paused; // Toggle pause
    }
}

// Reset ball position on left-click
function mousePressed() {
    if (mouseButton === LEFT) {
        ball.x = 0;
        ball.y = 0;
        ball.z = 0;
        ball.speedX = 2;
        ball.speedY = 2;
        ball.speedZ = 2;
    }
}
