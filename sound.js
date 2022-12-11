const audioCtx = new AudioContext();
const sampleRate = audioCtx.sampleRate;
const twoPi = 2 * Math.PI;
const majorSecond = Math.pow(2, 2/12);

const volume = 0.1;

const theDiv = document.getElementById("theDiv");
[
  "Crime", "Floor", "Glass", "Door", "Street", "Subway",
  "Wait", // Also mundane button presses.
  "Tip",
  "ArrestStart", "ArrestWrong", "ArrestCorrect", "Comply", "Run",
].forEach(name => {
  let button = document.createElement("input");
  button.type = "button";
  button.value = name;
  theDiv.appendChild(button);

  setTimeout(function() {
    if (sounds[name] != null) {
      button.addEventListener("click", function() {
        sounds[name]();
      });
    } else {
      button.disabled = true;
    }
  }, 0);
});

const sounds = {
  Door() {
    const duration = 2.0;
    const bufferSize = sampleRate * duration;
    const buffer = new AudioBuffer({length: bufferSize, sampleRate: audioCtx.sampleRate});

    const choppyPeriod = 1/20;

    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      const t = i / sampleRate;
      const choppyWave = Math.sin(t * twoPi / choppyPeriod);
      if (choppyWave < -0.6) {
        data[i] = 0;
      } else {
        const squarePeriod = 1/(90 + 5 * t);
        data[i] = volume * Math.sign(Math.sin(t * twoPi / squarePeriod));
      }
    }

    let noiseNode = new AudioBufferSourceNode(audioCtx, {buffer});
    noiseNode.connect(audioCtx.destination);
    noiseNode.start();

    return duration;
  },

  Crime() {
    const duration = 1.5;
    const bufferSize = sampleRate * duration;
    const buffer = new AudioBuffer({length: bufferSize, sampleRate: audioCtx.sampleRate});

    const ascentPeriod = duration / 9;

    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      const t = i / sampleRate;
      const ascentTime = t % ascentPeriod;
      const f = 350 + 300 * ascentTime / ascentPeriod;
      data[i] = volume * Math.sign(Math.sin(ascentTime * twoPi * f) + Math.sin(ascentTime * twoPi * f * majorSecond));
    }

    let noiseNode = new AudioBufferSourceNode(audioCtx, {buffer});
    noiseNode.connect(audioCtx.destination);
    noiseNode.start();

    return duration;
  },

  Street() {
    const duration = 1.0;
    const bufferSize = sampleRate * duration;
    const buffer = new AudioBuffer({length: bufferSize, sampleRate: audioCtx.sampleRate});

    const noteFrequencies = [
      440 * Math.pow(2, 13/12), // Bb
      440 * Math.pow(2, 12/12),
      440 * Math.pow(2, 11/12),
      440 * Math.pow(2, 10/12),
      440 * Math.pow(2, 9/12),
      440 * Math.pow(2, 8/12),
      440 * Math.pow(2, 7/12),
      440 * Math.pow(2, 6/12), // Eb
    ];
    const noteTimes =     [0.00, 0.17, 0.30, 0.42, 0.55, 0.68, 0.81, 0.95,   999];
    const noteDurations = [0.04, 0.04, 0.04, 0.04, 0.04, 0.04, 0.04, 0.045,  0];
    const noteEnds = noteTimes.map((t, i) => t + noteDurations[i]);

    const data = buffer.getChannelData(0);
    let noteCursor = 0;
    for (let i = 0; i < bufferSize; i++) {
      const t = i / sampleRate;
      if (t >= noteTimes[noteCursor + 1]) {
        noteCursor = noteCursor + 1;
      } else if (t > noteEnds[noteCursor]) {
        data[i] = 0.0;
      } else {
        const f = noteFrequencies[noteCursor];
        data[i] = volume * Math.sign(Math.sin(t * twoPi * f));
      }
    }

    let noiseNode = new AudioBufferSourceNode(audioCtx, {buffer});
    noiseNode.connect(audioCtx.destination);
    noiseNode.start();

    return duration;
  },

  Subway() {
    const duration = 2.5;
    const bufferSize = sampleRate * duration;
    const buffer = new AudioBuffer({length: bufferSize, sampleRate: audioCtx.sampleRate});

    const noteFrequencies = [
      110 * Math.pow(2, 2/12), // B
      110 * Math.pow(2, 2/12),
      110 * Math.pow(2, 3/12),
      110 * Math.pow(2, 4/12), // Db
    ];
    const noteTimes =     [0.000, 0.090, 0.170, 0.240];
    const noteDurations = [0.035, 0.025, 0.025, 0.025];
    const repeates = 8;
    const noteLoopPeriod = duration / repeates;
    for (let i = 1; i < repeates; i++) {
      for (let j = 0; j < 4; j++) {
        noteTimes.push(noteTimes[j] + noteLoopPeriod * i);
        noteDurations.push(noteDurations[j]);
        noteFrequencies.push(noteFrequencies[j]);
      }
    }
    noteTimes.push(999);
    noteDurations.push(0);
    const noteEnds = noteTimes.map((t, i) => t + noteDurations[i]);

    const data = buffer.getChannelData(0);
    let noteCursor = 0;
    for (let i = 0; i < bufferSize; i++) {
      const t = i / sampleRate;
      if (t >= noteTimes[noteCursor + 1]) {
        noteCursor = noteCursor + 1;
      } else if (t > noteEnds[noteCursor]) {
        data[i] = 0.0;
      } else {
        const f = noteFrequencies[noteCursor];
        data[i] = volume * Math.sign(Math.sin(t * twoPi * f));
      }
    }

    let noiseNode = new AudioBufferSourceNode(audioCtx, {buffer});
    noiseNode.connect(audioCtx.destination);
    noiseNode.start();

    return duration;
  },

  Floor() {
    const duration = 1.8;
    const bufferSize = sampleRate * duration;
    const buffer = new AudioBuffer({length: bufferSize, sampleRate: audioCtx.sampleRate});

    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      let t = i / sampleRate;
      if (t > 0.9) {
        // Second step.
        t -= 0.9;
      }
      if (t < 0.23) {
        const squarePeriod = 1/(150 + 20000 * t * t * t * t);
        data[i] = volume * Math.sign(Math.sin(t * twoPi / squarePeriod));
      } else {
        data[i] = 0;
      }
    }

    let noiseNode = new AudioBufferSourceNode(audioCtx, {buffer});
    noiseNode.connect(audioCtx.destination);
    noiseNode.start();

    return duration;
  },

  Wait() {
    const duration = 0.035;
    const bufferSize = sampleRate * duration;
    const buffer = new AudioBuffer({length: bufferSize, sampleRate: audioCtx.sampleRate});

    const note = 440 * Math.pow(2, 9.5/12); // F sharp-and-a-half

    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      const t = i / sampleRate;
      data[i] = volume * Math.sign(Math.sin(t * twoPi * note));
    }

    let noiseNode = new AudioBufferSourceNode(audioCtx, {buffer});
    noiseNode.connect(audioCtx.destination);
    noiseNode.start();

    return duration;
  },
};
