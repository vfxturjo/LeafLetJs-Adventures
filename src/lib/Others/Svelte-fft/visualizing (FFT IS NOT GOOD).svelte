<script>
import { onMount } from "svelte";

let audioCtx;
let analyser;
let canvas, canvas2;
let canvasCtx, canvasCtx2;
let WIDTH;
let HEIGHT;
let bufferLength;
let dataArray;
// $: fftSize = analyser ? analyser.fftSize : 0;
// $: sampleRate = audioCtx ? audioCtx.sampleRate : 0;
let fftSize = 0,
  sampleRate = 0;

let source, recording, amplitude;

let notes_n_values = {
  0: {
    name: "A",
    value: 0,
  },
  1: {
    name: "A#",
    value: 0,
  },
  2: {
    name: "B",
    value: 0,
  },
  3: {
    name: "C",
    value: 0,
  },
  4: {
    name: "C#",
    value: 0,
  },
  5: {
    name: "D",
    value: 0,
  },
  6: {
    name: "D#",
    value: 0,
  },
  7: {
    name: "E",
    value: 0,
  },
  8: {
    name: "F",
    value: 0,
  },
  9: {
    name: "F#",
    value: 0,
  },
  10: {
    name: "G",
    value: 0,
  },
  11: {
    name: "G#",
    value: 0,
  },
};
let notes_n_values_optimize = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

function toggleRecording() {
  if (recording) {
    recording = false;
    console.log("DISconnected!");
  } else {
    recording = true;
    createAudioContext_once();
    console.log("connected!");
    fftSize = analyser ? analyser.fftSize : 0;
    sampleRate = audioCtx ? audioCtx.sampleRate : 0;
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

  canvas2 = document.getElementById("canvas2");
  canvasCtx2 = canvas2.getContext("2d");

  WIDTH = canvas.width;
  HEIGHT = canvas.height;

  // Draw spectrum
  drawSpectrum();

  console.log(fftSize, sampleRate);
}

function drawSpectrum() {
  if (recording) {
    requestAnimationFrame(drawSpectrum);
  }

  // Get spectrum data
  analyser.getByteFrequencyData(dataArray);
  let dataArray_sum = dataArray.reduce((sum, item) => sum + item, 0);
  let dataArray_max = dataArray.reduce(function (a, b) {
    return Math.max(a, b);
  });

  // Clear canvas AND CLEAR VALUE
  canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
  canvasCtx2.clearRect(0, 0, WIDTH, HEIGHT);
  notes_n_values_optimize = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

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

    // DOING EXTRA
    notes_n_values_optimize[frequencyToNote_noOct(frequencyForBinIndex(i))] +=
      dataArray[i] / dataArray_max;

    // notes_n_values[frequencyToNote_noOct(frequencyForBinIndex(i))]["value"] += dataArray[i];
    // console.log(frequencyToNote_noOct(frequencyForBinIndex(i)));
  }

  // draw pitch
  let total_pitch_val = notes_n_values_optimize.reduce(
    (sum, item) => sum + item,
    0
  );
  for (let i = 0; i < notes_n_values_optimize.length; i++) {
    let pitchHeight = rangeMap(
      (notes_n_values_optimize[i] / total_pitch_val) * 100,
      params.a,
      params.b,
      params.min,
      params.max
    );
    canvasCtx2.fillStyle = "rgb(0, 0, 0)";
    canvasCtx2.fillRect(
      i * 10,
      HEIGHT - pitchHeight / 2,
      barWidth * 5,
      pitchHeight / 2
    );
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
  return 1 + Math.round((frequency * fftSize) / sampleRate);
}

export function frequencyForBinIndex(index) {
  return ((index - 1) * sampleRate) / fftSize;
}
//
//
//Function to convert frequency to musical note
function frequencyToNote(freq) {
  //Convert frequency to a corresponding musical note
  var note = Math.round(12 * Math.log2(freq / 440)) + 49;

  //Convert musical note to corresponding semitone
  var semitone = note % 12;

  //Return both the musical note and the semitone
  return note + " (" + semitone + ")";
}
function frequencyToNote_noOct(freq) {
  //Convert frequency to a corresponding musical note
  var note = Math.round(12 * Math.log2(freq / 440)) + 49;

  //Convert musical note to corresponding semitone
  var semitone = note % 12;

  //Return both the musical note and the semitone
  return Math.round(note % 12);
}
function rangeMap(input, inputMin, inputMax, outputMin, outputMax) {
  return (
    outputMin +
    (outputMax - outputMin) * ((input - inputMin) / (inputMax - inputMin))
  );
}
//#endregion
let testVal;
let params = {
  a: 0,
  b: 0,
  min: 0,
  max: 0,
};
</script>

<canvas id="canvas" width="500" height="200"></canvas>
<canvas id="canvas2" width="500" height="200"></canvas>

<button on:click="{toggleRecording}">{recording ? "Pause" : "Resume"}</button>

<div class="sliders">
  <input type="range" min="0" max="10" bind:value="{params.a}" />
  <input type="range" min="0" max="10" bind:value="{params.b}" />
  <input type="range" min="0" max="100" bind:value="{params.min}" />
  <input type="range" min="0" max="100" bind:value="{params.max}" />
</div>
<input
  class="w-full"
  type="range"
  min="26"
  max="22000"
  bind:value="{testVal}"
/>
<p>
  the hz value: {testVal} <br />
  the pitch is: {frequencyToNote(testVal)}
</p>
{#each notes_n_values_optimize as item}
  {item} <br />
{/each}
