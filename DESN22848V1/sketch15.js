window.sketchWrapper = sketch => {
    let wave;
    let button;
    let slider;
    let dropdown;
    let playing = false;
    let amp;

    sketch.setup = () => {
        sketch.createCanvas(sketch.displayWidth, sketch.displayHeight);

        button = sketch.createButton('play/pause');
        button.position(100, 100);
        button.mousePressed(turnOn);

        slider = sketch.createSlider(100, 1200, 440);
        slider.position(100, 150);

        dropdown = sketch.createSelect();
        dropdown.position(100, 200);
        dropdown.option('sine');
        dropdown.option('triangle');
        dropdown.option('sawtooth');
        dropdown.option('square');
        dropdown.changed(changeWaveform);

        wave = new p5.Oscillator('sine');
        amp = new p5.Amplitude();
    };

    sketch.draw = () => {
        let level = amp.getLevel();
        let bgColor = sketch.map(level, 0, 1, 50, 255);
        
        if (playing) {
            sketch.background(bgColor, 0, 0); // Dynamic background effect
            wave.amp(0.5);
            wave.freq(slider.value());
        } else {
            sketch.background(255);
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

    function changeWaveform() {
        wave.setType(dropdown.value());
    }
};
