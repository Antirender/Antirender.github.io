
let mic, fft, amplitude;
let started = false;
let startButton;

// arcs + circles arrays
let arcs = [];
let circles = [];

// flower color
let flowerColor;
let flowerInverted = false; 

function setup() {
  let canvas = createCanvas(windowWidth, 400);
  canvas.parent("p5-container");

  colorMode(HSB, 360, 100, 100);

  started = false;
  flowerColor = color(200, 80, 80);

// start button
  startButton = createButton("Click to start sound visualization");
  startButton.size(250, 50);
  startButton.position(windowWidth / 2 - 125, height / 2 - 25);
  startButton.style("z-index", "300");
  startButton.mousePressed(startSound);
}

function startSound() {
  mic = new p5.AudioIn();
  mic.start();

  fft = new p5.FFT();
  amplitude = new p5.Amplitude();

  started = true;
  startButton.hide();
}

function draw() {
  background(255);

  if (!started) return;

  // get volume
  let vol = mic.getLevel();
  let waveform = fft.waveform();

  // flower
  drawFlower(waveform);

  // arcs
  if (vol > 0.02) {
    spawnArc();
  }

  // circles
  if (vol > 0.1) {
    spawnCircle(vol);
  }

  // update arcs
  for (let i = arcs.length - 1; i >= 0; i--) {
    updateArc(i);
  }

  // update circles
  for (let i = circles.length - 1; i >= 0; i--) {
    updateCircle(i);
  }

  // heading 
  let heading = document.getElementById("heading");
  if (heading) {
    let scaleFactor = map(vol, 0, 1, 1, 1.5);
    heading.style.transform = `scale(${scaleFactor})`;
  }
}


function drawFlower(waveform) {
  if (!waveform || waveform.length < 1) return;

  let spectrum = fft.analyze();
  let level = amplitude.getLevel();


  let petalCount = 100;
  let angleStep = TWO_PI / petalCount;

  // base radius
  let baseRadius = height * 0.4;

  let points = [];

  // gather points
  for (let i = 0; i < petalCount; i++) {
    let waveIndex = floor(map(i, 0, petalCount, 0, waveform.length - 1));
    let specIndex = floor(map(i, 0, petalCount, 0, spectrum.length - 1));

    let waveVal = waveform[waveIndex]; // -1..1
    let freqVal = spectrum[specIndex]; // 0..255


    let freqSize = pow(map(freqVal, 0, 255, 0, 1), 1.2);

    // combine freq 
    let dynamicFactor = (1 + freqSize) * (1 + level);


    let wavePush = waveVal * 4; 

    let angle = i * angleStep;
    let finalRadius = baseRadius * dynamicFactor + wavePush * 10;
    let x = finalRadius * cos(angle);
    let y = finalRadius * sin(angle);

    points.push({ x, y });
  }

  push();
  translate(width / 2, height / 2);

  // choose color
  let c = flowerInverted ? invertColor(flowerColor) : flowerColor;


  for (let i = 0; i < petalCount; i++) {
    let curr = points[i];
    let next = points[(i + 1) % petalCount]; // wrap around
    stroke(i * (360 / petalCount), 80, 100);
    strokeWeight(2 + amplitude.getLevel() * 8);
    line(curr.x, curr.y, next.x, next.y);
  }

  pop();
}

// arcs
function spawnArc() {
  let arcObj = {
    x: width / 2,
    y: height / 2,
    startAng: random(TWO_PI),
    arcSize: random(PI / 6, PI / 2),
    radius: random(30, 100),
    alpha: 255,
    col: color(random(360), 80, 100),
    rotSpeed: random(-0.05, 0.05)
  };
  arcs.push(arcObj);
}

function updateArc(i) {
  let a = arcs[i];
  push();
  translate(a.x, a.y);

  // rotate only if mouse in canvas
  if (mouseIsInCanvas()) {
    rotate(frameCount * a.rotSpeed);
  }

  stroke(hue(a.col), saturation(a.col), brightness(a.col), a.alpha);
  strokeWeight(3);
  noFill();
  arc(0, 0, a.radius * 2, a.radius * 2, a.startAng, a.startAng + a.arcSize);
  pop();

  a.alpha *= 0.95;
  a.radius *= 0.98;

  if (a.alpha < 1 || a.radius < 5) {
    arcs.splice(i, 1);
  }
}

// circles
function spawnCircle(vol) {
  let c = {
    x: random(width),
    y: random(height),
    size: map(vol, 0, 1, 20, 100),
    alpha: 255,
    col: color(random(360), 80, 100)
  };
  circles.push(c);
}

function updateCircle(i) {
  let c = circles[i];
  noStroke();
  fill(hue(c.col), saturation(c.col), brightness(c.col), c.alpha);
  ellipse(c.x, c.y, c.size);

  c.size *= 0.97;
  c.alpha *= 0.95;

  if (c.size < 3 || c.alpha < 1) {
    circles.splice(i, 1);
  }
}

// mouse click 
function mousePressed() {
  if (!started) return;
  flowerInverted = !flowerInverted;
}


// invert color in hsb
function invertColor(col) {
  let h = hue(col);
  let s = saturation(col);
  let b = brightness(col);
  return color(h, s, 100 - b);
}

// check if mouse is in canvas
function mouseIsInCanvas() {
  return (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height);
}

// windowResized
function windowResized() {
  resizeCanvas(windowWidth, 400);
  if (!started && startButton) {
    startButton.position(windowWidth / 2 - 125, height / 2 - 25);
  }
}
