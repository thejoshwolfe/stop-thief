let audioCtx = null;
const twoPi = 2 * Math.PI;
const majorSecond = Math.pow(2, 2/12);

const volume = 0.1;

const singlesDiv = document.getElementById("singlesDiv");
if (singlesDiv != null) {
  // This is the UI for the sound test page.
  [
    "Crime", "Floor", "Door", "Glass", "Street", "Subway",
    "Wait", // Also mundane button presses.
    "Tip",
    "Arrest", "Wrong", "Correct", "Comply", "Run",
  ].forEach(name => {
    let button = document.createElement("input");
    button.type = "button";
    button.value = name;
    singlesDiv.appendChild(button);

    button.addEventListener("click", function() {
      playSounds([sounds[name]]);
    });
  });

  document.getElementById("subwayStreetButton").addEventListener("click", function() {
    playSounds([sounds.Subway, 0.2, sounds.Street]);
  });
  document.getElementById("arrestWrongButton").addEventListener("click", function() {
    playSounds([sounds.Arrest, 1.1, sounds.Wrong]);
  });
  document.getElementById("arrestCorrectComplyButton").addEventListener("click", function() {
    playSounds([sounds.Arrest, sounds.Correct, 1.4, sounds.Comply]);
  });
  document.getElementById("arrestCorrectRunButton").addEventListener("click", function() {
    playSounds([sounds.Arrest, sounds.Correct, 1.4, sounds.Run]);
  });
  document.getElementById("arrestCorrectRunRandomButton").addEventListener("click", function() {
    const sequence = [sounds.Arrest, sounds.Correct, 1.4, sounds.Run];
    for (let i = 5 + Math.floor(2 * Math.random()); i > 0; i--) {
      sequence.push(0.4);
      sequence.push([
        sounds.Crime,
        sounds.Floor,
        sounds.Glass,
        sounds.Door,
        sounds.Street,
      ][Math.floor(5 * Math.random())]);
    }
    playSounds(sequence);
  });
}

function playSounds(sequence) {
  if (audioCtx == null) audioCtx = new AudioContext();
  let t = audioCtx.currentTime;
  for (let item of sequence) {
    if (typeof item === "function") {
      const buffer = item();
      let noiseNode = new AudioBufferSourceNode(audioCtx, {buffer});
      noiseNode.connect(audioCtx.destination);
      noiseNode.start(t);
      t += buffer.length / audioCtx.sampleRate;
    } else if (typeof item === "number") {
      t += item;
    } else throw new Error("not sure what this is: " + item);
  }
}

const sounds = {
  Door() {
    const duration = 2.0;
    const sampleRate = audioCtx.sampleRate;
    const bufferSize = sampleRate * duration;
    const buffer = new AudioBuffer({length: bufferSize, sampleRate});

    const choppyPeriod = 1/20;

    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      const t = i / sampleRate;
      const choppyWave = Math.sin(t * twoPi / choppyPeriod);
      if (choppyWave < -0.6) {
        data[i] = 0;
      } else {
        const squareFrequency = 90 + 5 * t;
        data[i] = volume * Math.sign(Math.sin(t * twoPi * squareFrequency));
      }
    }

    return buffer;
  },

  Crime() {
    const duration = 1.5;
    const sampleRate = audioCtx.sampleRate;
    const bufferSize = sampleRate * duration;
    const buffer = new AudioBuffer({length: bufferSize, sampleRate});

    const ascentPeriod = duration / 9;

    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      const t = i / sampleRate;
      const ascentTime = t % ascentPeriod;
      const f = 350 + 300 * ascentTime / ascentPeriod;
      data[i] = volume * Math.sign(Math.sin(ascentTime * twoPi * f) + Math.sin(ascentTime * twoPi * f * majorSecond));
    }

    return buffer;
  },

  Street() {
    const duration = 1.0;
    const sampleRate = audioCtx.sampleRate;
    const bufferSize = sampleRate * duration;
    const buffer = new AudioBuffer({length: bufferSize, sampleRate});

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
      }
      if (t > noteEnds[noteCursor]) {
        data[i] = 0.0;
      } else {
        const f = noteFrequencies[noteCursor];
        data[i] = volume * Math.sign(Math.sin(t * twoPi * f));
      }
    }

    return buffer;
  },

  Subway() {
    const duration = 2.5;
    const sampleRate = audioCtx.sampleRate;
    const bufferSize = sampleRate * duration;
    const buffer = new AudioBuffer({length: bufferSize, sampleRate});

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
      }
      if (t > noteEnds[noteCursor]) {
        data[i] = 0.0;
      } else {
        const f = noteFrequencies[noteCursor];
        data[i] = volume * Math.sign(Math.sin(t * twoPi * f));
      }
    }

    return buffer;
  },

  Floor() {
    const duration = 1.8;
    const sampleRate = audioCtx.sampleRate;
    const bufferSize = sampleRate * duration;
    const buffer = new AudioBuffer({length: bufferSize, sampleRate});

    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      let t = i / sampleRate;
      if (t > 0.9) {
        // Second step.
        t -= 0.9;
      }
      if (t < 0.23) {
        const squareFrequency = 150 + 20000 * t * t * t * t;
        data[i] = volume * Math.sign(Math.sin(t * twoPi * squareFrequency));
      } else {
        data[i] = 0;
      }
    }

    return buffer;
  },

  Glass() {
    const duration = 0.67;
    const sampleRate = audioCtx.sampleRate;
    const bufferSize = sampleRate * duration;
    const buffer = new AudioBuffer({length: bufferSize, sampleRate});

    const noteFrequencies = [
      880 * Math.pow(2, 6.5/12), // E half flat
      880 * Math.pow(2, 8.5/12), // F half sharp
      880 * Math.pow(2, 10.5/12), // G half sharp
      880 * Math.pow(2, 12.5/12), //  A half sharp
    ];
    const noteTimes = [];

    const noteDuration = duration / 17.5;
    for (let i = 0; i < 16; i++) {
      noteTimes.push(noteDuration * (i + 1.5));
      if (noteFrequencies.length <= i) {
        noteFrequencies.push(noteFrequencies[i % 4]);
      }
    }
    noteTimes.push(999);

    const data = buffer.getChannelData(0);
    let noteCursor = 0;
    for (let i = 0; i < bufferSize; i++) {
      const t = i / sampleRate;
      if (t < noteTimes[0]) {
        // Put the b in bwing.
        const s = t / (noteDuration * 1.5);
        const squareFrequency = 880 + 400 * s * s;
        data[i] = volume * 0.5 * Math.sign(
          Math.sin(t * twoPi * squareFrequency) +
          Math.sin(t * twoPi * squareFrequency * Math.pow(2, 4/12))
        );
      } else {
        if (t >= noteTimes[noteCursor + 1]) {
          noteCursor = noteCursor + 1;
        }
        const f = noteFrequencies[noteCursor];
        data[i] = volume * Math.sign(Math.sin(t * twoPi * f));
      }
    }

    return buffer;
  },

  Wait() {
    const duration = 0.035;
    const sampleRate = audioCtx.sampleRate;
    const bufferSize = sampleRate * duration;
    const buffer = new AudioBuffer({length: bufferSize, sampleRate});

    const note = 440 * Math.pow(2, 9.5/12); // F sharp-and-a-half

    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      const t = i / sampleRate;
      data[i] = volume * Math.sign(Math.sin(t * twoPi * note));
    }

    return buffer;
  },

  Tip() {
    const duration = 0.7;
    const sampleRate = audioCtx.sampleRate;
    const bufferSize = sampleRate * duration;
    const buffer = new AudioBuffer({length: bufferSize, sampleRate});

    // Bb \ C# / F# / C \ D half sharp / F# and a half \ C / E
    const noteFrequencies = [
      440 * Math.pow(2, 13/12), // Bb
      440 * Math.pow(2, 4/12), // C#
      440 * Math.pow(2, 9/12), // F#
      440 * Math.pow(2, 15/12), // C
      440 * Math.pow(2, 5.5/12), // D half sharp
      440 * Math.pow(2, 9.5/12), // F sharp and a half
      440 * Math.pow(2, 3/12), // C
      440 * Math.pow(2, 7/12), // E
    ];
    const noteTimes =     [0.00, 0.06, 0.16, 0.24, 0.30, 0.40, 0.48, 0.56,   999];
    const noteDurations = [0.04, 0.04, 0.04, 0.04, 0.05, 0.04, 0.04, 0.04,  0];
    const noteEnds = noteTimes.map((t, i) => t + noteDurations[i]);

    const data = buffer.getChannelData(0);
    let noteCursor = 0;
    for (let i = 0; i < bufferSize; i++) {
      const t = i / sampleRate;
      if (t >= noteTimes[noteCursor + 1]) {
        noteCursor = noteCursor + 1;
      }
      if (t > noteEnds[noteCursor]) {
        data[i] = 0.0;
      } else {
        const f = noteFrequencies[noteCursor];
        data[i] = volume * Math.sign(Math.sin(t * twoPi * f));
      }
    }

    return buffer;
  },

  Arrest() {
    const duration = 4;
    const sampleRate = audioCtx.sampleRate;
    const bufferSize = sampleRate * duration;
    const buffer = new AudioBuffer({length: bufferSize, sampleRate});

    const checkpointPitches = [
      (0/12), // A
      (12/12), // A
      (0/12),
      (12/12),
      (0/12),
      (12/12),
      (0/12),
      (12/12),
      (8/12),
      (-19/12),

      (-19/12),
    ];
    const checkpointTimes = [
      0.0 * 1.5/7,
      1.0 * 1.5/7,
      2.0 * 1.5/7,
      3.0 * 1.5/7,
      4.0 * 1.5/7,
      5.0 * 1.5/7,
      6.0 * 1.5/7,
      7.0 * 1.5/7,
      7.5 * 1.5/7,
      4,

      999,
    ];

    const data = buffer.getChannelData(0);
    let cursor = 0;
    let sample = volume;
    let nextEdgeTime = 0;
    for (let i = 0; i < bufferSize; i++) {
      const t = i / sampleRate;
      if (t >= checkpointTimes[cursor + 1]) {
        cursor = cursor + 1;
      }
      if (t >= nextEdgeTime) {
        sample = -sample;
        const pitch = interpolate(
          checkpointPitches[cursor],
          checkpointPitches[cursor + 1],
          checkpointTimes[cursor],
          checkpointTimes[cursor + 1],
          t,
        );
        const f = 440 * Math.pow(2, pitch);
        const period = 1/f;
        nextEdgeTime += period / 2;
      }
      data[i] = sample;
    }

    return buffer;

    function interpolate(y_min, y_max, x_min, x_max, x) {
      const s = (x - x_min) / (x_max - x_min);
      // sag the curve toward lower frequences.
      const y_sag = Math.min(y_min, y_max);
      return linearInterpolate(
        linearInterpolate(y_min, y_sag, s),
        linearInterpolate(y_sag, y_max, s),
        s,
      );
    }
    function linearInterpolate(y_min, y_max, s) {
      return y_min + s * (y_max - y_min);
    }
  },

  Wrong() {
    const duration = 0.42;
    const sampleRate = audioCtx.sampleRate;
    const bufferSize = sampleRate * duration;
    const buffer = new AudioBuffer({length: bufferSize, sampleRate});

    const fundamentalFrequency = 1/(duration / 16);

    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      const t = i / sampleRate;
      data[i] = volume * Math.sign(
        Math.sin(t * twoPi * fundamentalFrequency * 1)/1 +
        Math.sin(t * twoPi * fundamentalFrequency * 2)/1 +
        Math.sin(t * twoPi * fundamentalFrequency * 3)/2 +
        Math.sin(t * twoPi * fundamentalFrequency * 4)/1 +
        Math.sin(t * twoPi * fundamentalFrequency * 5)/3 +
        Math.sin(t * twoPi * fundamentalFrequency * 6)/3 +
        Math.sin(t * twoPi * fundamentalFrequency * 7)/3 +
        Math.sin(t * twoPi * fundamentalFrequency * 8)/1 +
        Math.sin(t * twoPi * fundamentalFrequency * 16)/2 +
        Math.sin(t * twoPi * fundamentalFrequency * 32)/2 +
        0
      );
    }

    return buffer;
  },

  Correct() {
    const duration = 2.4;
    const sampleRate = audioCtx.sampleRate;
    const bufferSize = sampleRate * duration;
    const buffer = new AudioBuffer({length: bufferSize, sampleRate});

    // 4(6)6(6)8
    const pewPeriod = duration / 30;

    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      const t = i / sampleRate;
      const bulletIndex = Math.floor(t / pewPeriod);
      if (4 <= bulletIndex && bulletIndex < 10) {
        data[i] = 0;
      } else if (16 <= bulletIndex && bulletIndex < 22) {
        data[i] = 0;
      } else {
        const pewTime = t % pewPeriod;
        const f = 800 - 300 * pewTime / pewPeriod;
        data[i] = volume * Math.sign(Math.sin(pewTime * twoPi * f) + Math.sin(pewTime * twoPi * f * majorSecond));
      }
    }

    return buffer;
  },

  Comply() {
    const duration = 3.85;
    const sampleRate = audioCtx.sampleRate;
    const bufferSize = sampleRate * duration;
    const buffer = new AudioBuffer({length: bufferSize, sampleRate});

    const noteFrequencies = [
      440 * Math.pow(2, 0/12), // A
      440 * Math.pow(2, -7/12), // D
    ];
    const noteTimes = [];

    const noteDuration = duration / 8;
    for (let i = 0; i < 16; i++) {
      noteTimes.push(noteDuration * i);
      if (noteFrequencies.length <= i) {
        noteFrequencies.push(noteFrequencies[i % 2]);
      }
    }
    noteTimes.push(999);

    const data = buffer.getChannelData(0);
    let noteCursor = 0;
    for (let i = 0; i < bufferSize; i++) {
      const t = i / sampleRate;
      if (t >= noteTimes[noteCursor + 1]) {
        noteCursor = noteCursor + 1;
      }
      const f = noteFrequencies[noteCursor];
      data[i] = volume * Math.sign(Math.sin(t * twoPi * f));
    }

    return buffer;
  },

  Run() {
    const duration = 1.7;
    const sampleRate = audioCtx.sampleRate;
    const bufferSize = sampleRate * duration;
    const buffer = new AudioBuffer({length: bufferSize, sampleRate});

    const noteDuration = duration / 10;
    const noteFrequencies = [
      220 * Math.pow(2, 3.5/12), // C half sharp
      220 * Math.pow(2, 3.5/12), // C half sharp
      220 * Math.pow(2, 0.5/12), // A half sharp
      220 * Math.pow(2, 5.5/12), // D half sharp
      220 * Math.pow(2, 3.5/12), // C half sharp
      220 * Math.pow(2, 0.5/12), // A half sharp
    ];
    const noteTimes = [
      noteDuration * 0,
      noteDuration * 1,
      noteDuration * 2,
      noteDuration * 3,
      noteDuration * 4,
      noteDuration * 6,

      999,
    ];
    const noteDurations = [
      noteDuration * 0.9,
      noteDuration,
      noteDuration,
      noteDuration,
      noteDuration * 2,
      noteDuration * 3.5,

      999,
    ];

    const noteEnds = noteTimes.map((t, i) => t + noteDurations[i]);

    const data = buffer.getChannelData(0);
    let noteCursor = 0;
    for (let i = 0; i < bufferSize; i++) {
      const t = i / sampleRate;
      if (t >= noteTimes[noteCursor + 1]) {
        noteCursor = noteCursor + 1;
      }
      if (t > noteEnds[noteCursor]) {
        data[i] = 0.0;
      } else {
        const f = noteFrequencies[noteCursor];
        data[i] = volume * Math.sign(Math.sin(t * twoPi * f));
      }
    }

    return buffer;
  },
};
