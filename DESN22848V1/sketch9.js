new p5((p) => {
    let on;
    let button;
    let osc, envelope, fft;
    let scaleArray = [48,50,52,53,55,57,59,60];
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
        osc = new p5.Oscillator('triangle');

        envelope = new p5.Env();
        envelope.setADSR(0.01,0.3,0.2,0.3);
        envelope.setRange(0.8,0);

        osc.start();
        fft = new p5.FFT();
    }

    p.draw = () => {
        p.background(10,10,30);
        if (on) {
            if (p.frameCount %45 ===0 || p.frameCount ===1) {
                let midiValue = scaleArray[note];
                let freqValue = p.midiToFreq(midiValue);
                osc.freq(freqValue);

                envelope.play(osc,0,0.15);
                note = (note +1) % scaleArray.length;
            }

            let spectrum = fft.analyze();
            for (let i=0; i<spectrum.length/15; i++) {
                p.fill(spectrum[i],spectrum[i]/5,spectrum[i]/2);
                let x = p.map(i,0,spectrum.length/15,0,p.width);
                let h = p.map(spectrum[i],0,255,0,p.height);
                p.rect(x,p.height,spectrum.length/15,-h);
            }
        }
    }
});