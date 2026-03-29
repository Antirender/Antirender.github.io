new p5((p) => {
    let on;
    let button;
    let osc1, osc2, osc3, envelope, fft;
    let wave = [];
    let colors = [];

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        on = false;

        button = p.createButton('start');
        button.position(150, 150);
        button.mousePressed(turnOn);

        p.noStroke();

        for (let i = 0; i < 20; i++) {
            colors.push(p.color(p.random(100, 255), p.random(50, 200), p.random(150, 255)));
        }
    };

    const turnOn = () => {
        on = true;

        osc1 = new p5.Oscillator('sine');
        osc2 = new p5.Oscillator('square');
        osc3 = new p5.Oscillator('sawtooth');

        osc1.start();
        osc2.start();
        osc3.start();

        osc1.amp(0.3);
        osc2.amp(0.2);
        osc3.amp(0.1);

        envelope = new p5.Env();
        envelope.setADSR(0.05, 0.3, 0.4, 0.5);
        envelope.setRange(1, 0);

        fft = new p5.FFT();
    }

    p.draw = () => {
        p.background(10, 5, 20, 50);

        if (on) {
            if (p.frameCount % 30 === 0) {
                let freq1 = p.random(100, 600);
                let freq2 = freq1 * p.random(1, 2);
                let freq3 = freq1 / p.random(1, 2);

                osc1.freq(freq1);
                osc2.freq(freq2);
                osc3.freq(freq3);

                envelope.play(osc1, 0, 0.1);
                envelope.play(osc2, 0.1, 0.1);
                envelope.play(osc3, 0.2, 0.1);
            }

            let waveform = fft.waveform();
            wave.push(waveform);

            if (wave.length > 20) {
                wave.shift();
            }

            p.translate(p.width / 2, p.height / 2);
            for (let i = 0; i < wave.length; i++) {
                let offset = p.map(i, 0, wave.length, 0, 200);
                let c = colors[i % colors.length];
                p.stroke(c);
                p.strokeWeight(1.5);
                p.noFill();
                p.beginShape();
                for (let j = 0; j < waveform.length; j += 5) {
                    let x = p.map(j, 0, waveform.length, -p.width/2, p.width/2);
                    let y = p.map(wave[i][j], -1, 1, -150, 150);
                    p.vertex(x + p.sin(p.frameCount * 0.01 + i) * 10, y + offset);
                }
                p.endShape();
            }
        }
    }
});