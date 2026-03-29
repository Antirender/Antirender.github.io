window.sketchWrapper = sketch => {
    let wave;
    let button;
    let slider;
    let playing = false;
    let amp;
    let time = 0;
    let waveforms = ['sine', 'triangle', 'sawtooth', 'square'];
    let currentWave = 0;
    let circleSize = 50;

    sketch.setup = () => {
        sketch.createCanvas(sketch.displayWidth, sketch.displayHeight);

        button = sketch.createButton('play/pause');
        button.position(100, 100);
        button.mousePressed(turnOn);

        slider = sketch.createSlider(100, 1200, 440);
        slider.position(100, 150);

        wave = new p5.Oscillator('sine');
        amp = new p5.Amplitude();
    };

    sketch.draw = () => {
        let level = amp.getLevel();
        let bgColor = sketch.map(level, 0, 1, 50, 255);
        sketch.background(bgColor, 100, 255 - bgColor, 100);

        if (playing) {
            time += 0.01;
            let modFreq = slider.value() + sketch.random(-10, 10); // Slight random variation
            wave.freq(modFreq);

            if (time > 2) {
                currentWave = (currentWave + 1) % waveforms.length;
                wave.setType(waveforms[currentWave]);
                time = 0;
            }

            // Expanding pulse effect
            circleSize = sketch.lerp(circleSize, level * 500, 0.1);
            sketch.noFill();
            sketch.stroke(255);
            sketch.ellipse(sketch.width / 2, sketch.height / 2, circleSize);
        }
    };

    function turnOn() {
        if (!playing) {
            playing = true;
            wave.start();
        } else {
            playing = false;
            wave.stop();
        }
    }
};
