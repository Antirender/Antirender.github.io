new p5((p) => {
    let on;
    let button;
    let osc1, osc2, osc3, envelope1, envelope2, envelope3, fft;
    let scaleArray = [50,55,60,65,69,74,79,84];
    let note = 0;
    let reverb, delay;

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
        osc1 = new p5.Oscillator('sine');
        osc2 = new p5.Oscillator('triangle');
        osc3 = new p5.Oscillator('sawtooth');

        envelope1 = new p5.Env();
        envelope1.setADSR(0.05,0.3,0.2,0.4);
        envelope1.setRange(0.8,0);

        envelope2 = new p5.Env();
        envelope2.setADSR(0.02,0.5,0.3,0.5);
        envelope2.setRange(0.7,0);

        envelope3 = new p5.Env();
        envelope3.setADSR(0.01,0.2,0.5,0.3);
        envelope3.setRange(0.6,0);

        reverb = new p5.Reverb();
        delay = new p5.Delay();

        osc1.start();
        osc2.start();
        osc3.start();

        reverb.process(osc1,3,2);
        delay.process(osc2,0.5,0.4,500);

        fft = new p5.FFT();
    }

    p.draw = () => {
        p.background(30,0,40);
        if (on) {
            if (p.frameCount %20 ===0 || p.frameCount ===1) {
                let midiValue = scaleArray[note];
                let freqValue = p.midiToFreq(midiValue);

                osc1.freq(freqValue);
                osc2.freq(freqValue *0.75);
                osc3.freq(freqValue *1.25);

                envelope1.play(osc1,0,0.15);
                envelope2.play(osc2,0,0.2);
                envelope3.play(osc3,0,0.1);

                note = (note +1) % scaleArray.length;
            }

            let spectrum = fft.analyze();
            for (let i=0; i<spectrum.length/12; i++) {
                p.fill(spectrum[i]/4, spectrum[i]/2, spectrum[i]);
                let x = p.map(i,0,spectrum.length/12,0,p.width);
                let h = p.map(spectrum[i],0,255,0,p.height);
                p.triangle(x,p.height,x+10,p.height-h,x-10,p.height-h);
            }
        }
    }
});