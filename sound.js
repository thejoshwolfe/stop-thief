const audioCtx = new AudioContext();
const sampleRate = audioCtx.sampleRate;
const twoPi = 2 * Math.PI;

const volume = 0.25;

const theDiv = document.getElementById("theDiv");
let button = document.createElement("input");
button.type = "button";
button.value = "Door";
theDiv.appendChild(button);

button.addEventListener("click", function() {
  playDoor();
});

function playDoor() {
  const bufferSize = sampleRate * 2.0;
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
}
