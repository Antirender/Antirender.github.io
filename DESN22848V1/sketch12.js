new p5((p) => {
    let on;
    let button;
    let oscs = [];
    let envelopes = [];
    let fft;
    let scaleArray;
    let note = 0;
    let reverb, delay;
    let bgColor;

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        on = false;

        scaleArray = [];
        for (let i = 0; i < 8; i++) {
            scaleArray.push(p.floor(p.random(40, 90)));
        }

        bgColor = p.color(p.random(50, 255), p.random(50, 255), p.random(50, 255));

        button = p.createButton('start');
        button.position(150, 150);
        button.mousePressed(turnOn);

        p.noStroke();
    };

    const turnOn = () => { 
        on = true;

        let waveTypes = ['sine', 'triangle', 'square', 'sawtooth'];

        for (let i = 0; i < 4; i++) {
            let osc = new p5.Oscillator(p.random(waveTypes));
            let env = new p5.Env();
            env.setADSR(p.random(0.01, 0.3), p.random(0.1, 0.6), p.random(0.2, 0.8), p.random(0.2, 0.7));
            env.setRange(p.random(0.4, 1), 0);

            osc.start();
            osc.amp(0);
            oscs.push(osc);
            envelopes.push(env);
        }

        reverb = new p5.Reverb();
        delay = new p5.Delay();

        reverb.process(oscs[p.floor(p.random(oscs.length))], p.random(1, 5), p.random(1, 3));
        delay.process(oscs[p.floor(p.random(oscs.length))], p.random(0.2, 0.7), p.random(0.3, 0.6), p.random(200, 600));

        fft = new p5.FFT();
    }

    p.draw = () => {
        p.background(bgColor);

        if (on) {
            if (p.frameCount % p.floor(p.random(10, 50)) === 0 || p.frameCount === 1) {
                let midiValue = scaleArray[p.floor(p.random(scaleArray.length))];
                let freqValue = p.midiToFreq(midiValue);

                for (let i = 0; i < oscs.length; i++) {
                    oscs[i].freq(freqValue * p.random(0.5, 2));
                    envelopes[i].play(oscs[i], 0, p.random(0.1, 0.3));
                }
            }

            let spectrum = fft.analyze();
            for (let i = 0; i < spectrum.length / p.random(8, 20); i++) {
                p.fill(p.random(255), p.random(255), p.random(255), spectrum[i]);
                let x = p.map(i, 0, spectrum.length / 12, 0, p.width);
                let h = p.map(spectrum[i], 0, 255, 0, p.height);
                let shapeType = p.floor(p.random(3));

                if (shapeType === 0) {
                    p.ellipse(x, p.height / 2, spectrum.length / 20, -h);
                } else if (shapeType === 1) {
                    p.rect(x, p.height, spectrum.length / 20, -h);
                } else {
                    p.triangle(x, p.height, x + 10, p.height - h, x - 10, p.height - h);
                }
            }
        }
    }

    // 添加窗口重置时的清理
    p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    }
});