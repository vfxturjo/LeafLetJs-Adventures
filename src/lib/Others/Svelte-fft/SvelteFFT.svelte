<script>
import { onMount } from "svelte";

let audioCtx;
let analyser;
let canvas;
let canvasCtx;
let WIDTH;
let HEIGHT;
let bufferLength;
let dataArray;

let source, recording, amplitude;

function toggleRecording() {
  if (recording) {
    recording = false;
    console.log("DISconnected!");
  } else {
    recording = true;
    createAudioContext_once();
    console.log("connected!");
  }
}

async function createAudioContext_once() {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  analyser = audioCtx.createAnalyser();

  // Set buffer length
  analyser.fftSize = 2048;
  bufferLength = analyser.frequencyBinCount;
  console.log(bufferLength);
  dataArray = new Uint8Array(bufferLength);

  // Get microphone stream
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then((stream) => {
      // Connect stream to audio context
      source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
    })
    .catch((err) => console.log(err));

  // Initialize Canvas
  canvas = document.getElementById("canvas");
  canvasCtx = canvas.getContext("2d");

  WIDTH = canvas.width;
  HEIGHT = canvas.height;

  // Draw spectrum
  drawSpectrum();
}

function drawSpectrum() {
  if (recording) {
    requestAnimationFrame(drawSpectrum);
  }

  // Get spectrum data
  analyser.getByteFrequencyData(dataArray);

  // Clear canvas
  canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

  // Draw spectrum
  let barWidth = (WIDTH / bufferLength) * 2.5;
  let barHeight;
  let x = 0;
  let x_main = 0;

  for (let i = 0; i < bufferLength; i++) {
    barHeight = dataArray[i];

    canvasCtx.fillStyle = "rgb(0, 0, 0)";
    canvasCtx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight / 2);
    // canvasCtx.fillRect(x_main, HEIGHT - barHeight / 2, barWidth, barHeight / 2);

    x += barWidth + 1;
    // x_main = Math.log10(barx);
  }
}

//
//
//
//
// other added things
//#region //? other funcs
function getFrequencyValue(frequency) {
  var nyquist = analyser.sampleRate / 2;
  var index = Math.round((frequency / nyquist) * bufferLength.length);
  return bufferLength[index];
}
function getMaxAmplitude(dataArray) {
  var max = 0;
  for (var i = 0; i < dataArray.length; i++) {
    if (dataArray[i] > max) {
      max = dataArray[i];
    }
  }
  return max;
}

export function binIndexForFrequency(frequency) {
  return (
    1 +
    Math.round(
      (frequency * this.analyser.fftSize) / this.audioContext.sampleRate
    )
  );
}

export function frequencyForBinIndex(index) {
  return ((index - 1) * this.audioContext.sampleRate) / this.analyser.fftSize;
}

//#endregion
</script>

<canvas id="canvas" width="500" height="200"></canvas>

<button on:click="{toggleRecording}">{recording ? "Pause" : "Resume"}</button>
