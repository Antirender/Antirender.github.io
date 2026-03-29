new p5((p) => {
    let on;
    let button;
    let osc, envelope, fft;
    let wave = [];

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

        osc = new p5.Oscillator('triangle');
        osc.start();
        osc.amp(0.5);

        envelope = new p5.Env();
        envelope.setADSR(0.05, 0.2, 0.3, 0.4);
        envelope.setRange(1, 0);

        fft = new p5.FFT();
    }

    p.draw = () => {
        p.background(10);

        if (on) {
            if (p.frameCount % 20 === 0) {
                let freqValue = p.random(150, 700);
                osc.freq(freqValue);
                envelope.play(osc, 0, 0.1);
            }

            let waveform = fft.waveform();
            wave.push(waveform);

            if (wave.length > 20) {
                wave.shift();
            }

            p.translate(p.width / 2, p.height / 2);
            for (let i = 0; i < wave.length; i++) {
                let offset = p.map(i, 0, wave.length, 0, 200);
                p.beginShape();
                for (let j = 0; j < waveform.length; j += 5) {
                    let x = p.map(j, 0, waveform.length, -p.width/2, p.width/2);
                    let y = p.map(wave[i][j], -1, 1, -100, 100);
                    p.stroke(255 - i * 10, i * 15, 200);
                    p.vertex(x, y + offset);
                }
                p.endShape();
            }
        }
    }
});