let on;
let startButton;
let mic;
let fft;
let amp;
let sound;
let t, calcX = 0,
    calcY = 0,
    currX = 0,
    currY = 0,
    targetX = 0,
    targetY = 0;

function setup() {
    let canvas;
    if (windowWidth > 1200) {
        img = loadImage("assets/studio.png");
        canvas = createCanvas(1920, 630);
    } else if (windowWidth > 900) {
        img = loadImage("assets/studio-tablet-wide.png");
        canvas = createCanvas(1200, 394);
    } else {
        img = loadImage("assets/studio-tablet-tall.png");
        canvas = createCanvas(700, 230);
    }
    canvas.parent('header');
    
    noFill();
    on = false;
    amp = new p5.Amplitude();
    amp.setInput(mic);
    colorMode(HSB);
	strokeCap(ROUND); //PROJECT for rectangles, ROUND for circles and rounded rectangles

    sound = 1; // Used by load to check if sound has been properly loaded or not
   
    radius = height*3/8; // Radius of the circle made
	number = 100; // Number of points making up the circle
	baseAngle = 0;
	angle = baseAngle; // Used to draw the circle of points
	
	translate(width/2, height/2);
    rec = 0; // This only needs to be non-zero if using strokeCap(Project), since it means they will be properly rotated

    startButton = createButton('Click to allow microphone access and start the sound visualization')

    .size(400, 60)
        .style('font-size', '20px')
        .style('color', '#988a6b')
        .style('background-color', "#f1f1f1")
        .style('text-align', 'center')
        .style('transition-duration', '0.4s')
        .style('border', '2px #8e653c')
        .mouseOver(() => (startButton.style('background-color', "#ffffff"), (startButton.style('border', '4px #988a6b'))))
        .mouseOut(() => (startButton.style('background-color', "#f1f1f1"), (startButton.style('border', '2px #8e653c'))))
        .position((windowWidth / 2) - 200, windowHeight / 3, 'relative')
        .mousePressed(turnOn);

}

turnOn = () => {
    on = true;
    mic = new p5.AudioIn();
    mic.start();
    fft = new p5.FFT(0.5, 512); ////(sample accuracy 0.1 - 1.0, size); 
    fft.setInput(mic);

    startButton.style('display', 'none');
}

draw = () => {
    background(360);
    if (on) {
       
        magnitude = radius/20
        angle = baseAngle;
        /////including fft.waveform is step 1
        //let waveform = fft.waveform();
        let spectrum = fft.analyze(); // analyze the frequency

        beginShape();
        translate(width/2, height/2);
        for(var i = 0; i < number; i++){
            
            spec = spectrum[i*2]; // Most of the 1024 parts of the spectrum are unused,
            size = sq(map(spec, 0, 255, 0, 1)); // Squaring the map() makes a bigger difference between the highs and the lows
            level = amp.getLevel(); // Get the current volume
            
            x1 = sin(angle)*radius; // Get the inner coords of the point on the circle using trig
            y1 = cos(angle)*radius;
    
            modifier = (1 + size/2)*(1+level/10) + rec; // This basically calculates the length of each line, play around with the values!
            
            x2 = x1 * modifier; // Get the second set of coords for the end of the line
            y2 = y1 * modifier;
    
            strokeWeight((level+1)*10); // Change line width based on volume
            
            stroke(i*(360/number), 360, 360); // Rainbow colours
            line(x1, y1, x2, y2);
            angle += TWO_PI/number;
        }
        endShape();	

        //////KEEPS IT SNAPPY IF LEFT RUNNING, PREVENTING MEMORY LEAK?
        spectrum = null;
        waveform = null;

    canvas.style.WebkitTransform = t;
    canvas.style.msTransform = t;
    canvas.style.transform = t;
    }
}

// clicking the canvas creates a gesture for chrome
mouseClicked = () => {
    if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
        if (getAudioContext().state !== 'running') {
            getAudioContext().resume();
        }

    }
}


    
