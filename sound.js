const audioCtx = new AudioContext();
const sampleRate = audioCtx.sampleRate;
const twoPi = 2 * Math.PI;
const majorSecond = Math.pow(2, 2/12);

const volume = 0.1;

const theDiv = document.getElementById("theDiv");
["Door", "Crime", "Street"].forEach(name => {
  let button = document.createElement("input");
  button.type = "button";
  button.value = name;
  theDiv.appendChild(button);

  button.addEventListener("click", function() {
    sounds[name]();
  });
});

const sounds = {
  Door() {
    const duration = 2.0;
    const bufferSize = sampleRate * duration;
    const noiseBuffer = new AudioBuffer({length: bufferSize, sampleRate: audioCtx.sampleRate});

    const choppyPeriod = 1/20;

    const data = noiseBuffer.getChannelData(0);
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

    let noiseNode = new AudioBufferSourceNode(audioCtx, {buffer: noiseBuffer});
    noiseNode.connect(audioCtx.destination);
    noiseNode.start();

    return duration;
  },

  Crime() {
    const duration = 1.5;
    const bufferSize = sampleRate * duration;
    const noiseBuffer = new AudioBuffer({length: bufferSize, sampleRate: audioCtx.sampleRate});

    const ascentPeriod = duration / 9;

    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      const t = i / sampleRate;
      const ascentTime = t % ascentPeriod;
      const f = 350 + 300 * ascentTime / ascentPeriod;
      data[i] = volume * Math.sign(Math.sin(ascentTime * twoPi * f) + Math.sin(ascentTime * twoPi * f * majorSecond));
    }

    let noiseNode = new AudioBufferSourceNode(audioCtx, {buffer: noiseBuffer});
    noiseNode.connect(audioCtx.destination);
    noiseNode.start();

    return duration;
  },

  Street() {
    const duration = 1.0;
    const bufferSize = sampleRate * duration;
    const noiseBuffer = new AudioBuffer({length: bufferSize, sampleRate: audioCtx.sampleRate});

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

    const data = noiseBuffer.getChannelData(0);
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

    let noiseNode = new AudioBufferSourceNode(audioCtx, {buffer: noiseBuffer});
    noiseNode.connect(audioCtx.destination);
    noiseNode.start();

    return duration;
  },
};
