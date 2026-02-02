new p5((p) => {
    let on;
    let button;
    let osc1, osc2, envelope1, envelope2, fft;
    let scaleArray = [60,63,67,70,74,77,81,84];
    let note = 0;

    p.setup = () => {
        p.createCanvas(p.windowWidth,p.windowHeight);
        on = false;

        button = p.createButton('start');
        button.position(150,150);
        button.mousePressed(turnOn);

        p.noStroke();
    };

    const turnOn = () => { 
        on = true;
        osc1 = new p5.Oscillator('square');
        osc2 = new p5.Oscillator('sawtooth');

        envelope1 = new p5.Env();
        envelope1.setADSR(0.02,0.4,0.3,0.4);
        envelope1.setRange(0.9,0);

        envelope2 = new p5.Env();
        envelope2.setADSR(0.03,0.5,0.2,0.5);
        envelope2.setRange(0.7,0);

        osc1.start();
        osc2.start();
        fft = new p5.FFT();
    }

    p.draw = () => {
        p.background(0,30,10);
        if (on) {
            if (p.frameCount %30 ===0 || p.frameCount ===1) {
                let midiValue = scaleArray[note];
                let freqValue = p.midiToFreq(midiValue);
                osc1.freq(freqValue);
                osc2.freq(freqValue *1.5);

                envelope1.play(osc1,0,0.2);
                envelope2.play(osc2,0,0.2);
                note = (note +1) % scaleArray.length;
            }

            let spectrum = fft.analyze();
            for (let i=0; i<spectrum.length/10; i++) {
                p.fill(spectrum[i]/2, spectrum[i], spectrum[i]/4);
                let x = p.map(i,0,spectrum.length/10,0,p.width);
                let h = p.map(spectrum[i],0,255,0,p.height);
                p.ellipse(x,p.height/2,spectrum.length/20,-h);
            }
        }
    }
});