new p5((p) => {
    let on;
    let button;
    let osc, envelope, fft;
    let modOsc;

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
        
        modOsc = new p5.Oscillator('sine');
        modOsc.freq(5);
        modOsc.amp(1);
        
        osc.amp(modOsc);
        osc.start();
        modOsc.start();

        envelope = new p5.Env();
        envelope.setADSR(0.05, 0.1, 0.3, 0.2);
        envelope.setRange(1, 0);

        fft = new p5.FFT();
    }

    p.draw = () => {
        p.background(20);
        if (on) {
            if (p.frameCount % 60 === 0 || p.frameCount === 1) {
                let freqValue = p.random(200, 800);
                osc.freq(freqValue);
                envelope.play(osc, 0, 0.1);
            }

            let spectrum = fft.analyze();
            for (let i = 0; i < spectrum.length / 20; i++) {
                p.fill(spectrum[i] / 2, spectrum[i] / 5, spectrum[i]);
                let x = p.map(i, 0, spectrum.length / 20, 0, p.width);
                let h = p.map(spectrum[i], 0, 255, 0, p.height);
                p.ellipse(x, p.height / 2, h / 4);
            }
        }
    };
});