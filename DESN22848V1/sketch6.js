new p5((p) => {
    let on;
    let button;
    let osc, envelope, fft;
    let particles = [];

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        on = false;

        button = p.createButton('start');
        button.position(150, 150);
        button.mousePressed(turnOn);

        p.noStroke();
    };

    const turnOn = () => {
        on = true;

        osc = new p5.Oscillator('sawtooth');
        osc.start();
        osc.amp(0.5);

        envelope = new p5.Env();
        envelope.setADSR(0.05, 0.1, 0.2, 0.3);
        envelope.setRange(1, 0);

        fft = new p5.FFT();
    }

    p.draw = () => {
        p.background(10, 10, 30);

        if (on) {
            if (p.frameCount % 30 === 0) {
                let freqValue = p.random(200, 800);
                osc.freq(freqValue);
                envelope.play(osc, 0, 0.1);
                
                let spectrum = fft.analyze();
                let energy = fft.getEnergy("treble");

                for (let i = 0; i < energy / 10; i++) {
                    particles.push(new Particle());
                }
            }
        }

        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update();
            particles[i].show();
            if (particles[i].finished()) {
                particles.splice(i, 1);
            }
        }
    }

    class Particle {
        constructor() {
            this.pos = p.createVector(p.width / 2, p.height / 2);
            this.vel = p5.Vector.random2D().mult(p.random(1, 5));
            this.alpha = 255;
        }

        update() {
            this.pos.add(this.vel);
            this.alpha -= 5;
        }

        finished() {
            return this.alpha < 0;
        }

        show() {
            p.fill(255, this.alpha);
            p.ellipse(this.pos.x, this.pos.y, 8);
        }
    }
});