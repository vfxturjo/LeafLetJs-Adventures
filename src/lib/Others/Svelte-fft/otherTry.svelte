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

function toggle_pause() {
  if (audioCtx.state === "running") {
    audioCtx.suspend();
  } else if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
}

const pitchSamples = [];

function drawSpectrum() {
  if (recording) {
    requestAnimationFrame(drawSpectrum);
  }
  let lastPos = 0,
    lastItem = 0;

  // Get spectrum data
  analyser.getByteFrequencyData(dataArray);

  // console.log(dataArray);
  // Clear canvas
  canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

  dataArray.forEach((item, i) => {
    if (item > 128 && lastItem <= 128) {
      // we have crossed below the mid point
      const elapsedSteps = i - lastPos; // how far since the last time we did this
      lastPos = i;

      const hertz = 1 / (elapsedSteps / 44100);
      pitchSamples.push(hertz); // an array of every pitch encountered
    }

    canvasCtx.fillRect(i, item, 1, 1); // point in the wave

    lastItem = item;
  });
}

//
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
//#endregion
</script>

<canvas id="canvas" width="500" height="200"></canvas>

<button on:click="{toggleRecording}">{recording ? "Pause" : "Resume"}</button>
