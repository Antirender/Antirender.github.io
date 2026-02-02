window.sketchWrapper = sketch => {
    let wave;
    let button;
    let playing = false;
    let fft;
    let amp;
    let particles = [];

    sketch.setup = () => {
        sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
        button = sketch.createButton('play/pause')
            .size(200, 50)
            .style('font-size', '18px')
            .style('color', '#ffff00')
            .style('background-color', "#888888")
            .style('border', '2px solid yellow')
            .position(50, 50)
            .mousePressed(turnOn);

        wave = new p5.Oscillator('sine');
        fft = new p5.FFT();
        amp = new p5.Amplitude();

        for (let i = 0; i < 150; i++) {
            particles.push(new Particle(sketch.random(sketch.width), sketch.random(sketch.height)));
        }
    };

    sketch.draw = () => {
        sketch.background(playing ? 255 : 50, 0, 0, 50);

        if (playing) {
            wave.amp(0.5);
            wave.freq(1100);
            
            let spectrum = fft.analyze();
            let level = amp.getLevel();
            
            sketch.noFill();
            sketch.stroke(255);
            sketch.strokeWeight(2);
            sketch.beginShape();
            for (let i = 0; i < spectrum.length; i++) {
                let x = sketch.map(i, 0, spectrum.length, 0, sketch.width);
                let y = sketch.map(spectrum[i], 0, 255, sketch.height, 0);
                sketch.vertex(x, y);
            }
            sketch.endShape();
            
            for (let p of particles) {
                p.update(level);
                p.show();
            }
        }
    };

    function turnOn() {
        if (!playing) {
            playing = true;
            wave.start();
        } else {
            playing = false;
            wave.stop();
        }
    }

    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.vx = sketch.random(-2, 2);
            this.vy = sketch.random(-2, 2);
            this.alpha = 255;
        }

        update(level) {
            this.x += this.vx * (1 + level * 5);
            this.y += this.vy * (1 + level * 5);
            this.alpha -= 1;
            if (this.alpha < 0) {
                this.x = sketch.random(sketch.width);
                this.y = sketch.random(sketch.height);
                this.alpha = 255;
            }
        }

        show() {
            sketch.noStroke();
            sketch.fill(sketch.random(200, 360), 255, 255, this.alpha / 255);
            sketch.ellipse(this.x, this.y, 6);
        }
    }
};
