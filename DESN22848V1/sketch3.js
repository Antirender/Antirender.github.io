new p5((p) => {
    let on;
    let button;
    let noise, envelope, fft;

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        on = false;

        button = p.createButton('start');
        button.position(110, 110);
        button.mousePressed(turnOn);

        p.noStroke();
    };

    const turnOn = () => {
        on = true;
        
        noise = new p5.Noise('white'); 
        noise.amp(0);
        
        envelope = new p5.Env();
        envelope.setADSR(0.01, 0.2, 0.2, 0.5);
        envelope.setRange(1, 0);

        noise.start();
        fft = new p5.FFT();
    }

    p.draw = () => {
        p.background(20);
        if (on) {
            if (p.frameCount % 30 === 0) {
                envelope.play(noise);
            }

            let spectrum = fft.analyze();
            for (let i = 0; i < spectrum.length / 20; i++) {
                p.fill(0, spectrum[i], spectrum[i] / 5);
                let x = p.map(i, 0, spectrum.length / 20, 0, p.width);
                let h = p.map(spectrum[i], 0, 255, 0, p.height);
                p.ellipse(x, p.height / 2, h / 4);
            }
        }
    };
});