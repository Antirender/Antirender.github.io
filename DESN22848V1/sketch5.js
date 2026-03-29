new p5((p) => {
    let on;
    let button;
    let osc, envelope, fft;
    let angle = 0;

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

        osc = new p5.Oscillator('square');
        osc.start();
        osc.amp(0.5);

        envelope = new p5.Env();
        envelope.setADSR(0.05, 0.2, 0.3, 0.5);
        envelope.setRange(1, 0);

        fft = new p5.FFT();
    }

    p.draw = () => {
        p.background(20);
        if (on) {
            if (p.frameCount % 30 === 0) {
                let freqValue = p.random(100, 600);
                osc.freq(freqValue);
                envelope.play(osc, 0, 0.1);
            }

            let spectrum = fft.analyze();
            p.translate(p.width / 2, p.height / 2);
            for (let i = 0; i < spectrum.length / 40; i++) {
                let amp = spectrum[i];
                let r = p.map(amp, 0, 255, 20, 200);
                let x = r * p.cos(angle + i * 0.1);
                let y = r * p.sin(angle + i * 0.1);
                p.fill(amp / 2, amp / 5, amp);
                p.ellipse(x, y, 5);
            }

            angle += 0.01;
        }
    };
});