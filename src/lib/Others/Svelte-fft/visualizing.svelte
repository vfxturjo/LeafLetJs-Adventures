<script>
let audioCtx, analyser;
let canvas, canvas2;
let canvasCtx, canvasCtx2;
let WIDTH, HEIGHT;
let bufferLength, dataArray;
let fftSize = 0,
  sampleRate = 0,
  target_fftSize = 2048;

let source, recording, amplitude;

let testVal;
let params = {
  a: 0,
  b: 0.5,
  min: 0,
  max: 5,
};

let notes_n_values_optimize = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

//
//

function toggleLiveMonitoring() {
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
  // @ts-ignore
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  analyser = audioCtx.createAnalyser();

  // Set buffer length
  analyser.fftSize = target_fftSize;
  bufferLength = analyser.frequencyBinCount;
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
  canvas = document.getElementById("canvas"); // @ts-ignore
  canvasCtx = canvas.getContext("2d");
  canvas2 = document.getElementById("canvas2"); // @ts-ignore
  canvasCtx2 = canvas2.getContext("2d"); // @ts-ignore
  WIDTH = canvas.width; // @ts-ignore
  HEIGHT = canvas.height;

  console.log(
    "fftSize: ",
    analyser.fftSize,
    ", bufferLength: ",
    bufferLength,
    ", sampleRate:",
    sampleRate
  );

  // Draw spectrum
  drawSpectrum();
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

  for (let i = 0; i < bufferLength; i++) {
    barHeight = dataArray[i] / 2;

    canvasCtx.fillStyle = "rgb(0, 0, 0)";
    canvasCtx.fillRect(x, HEIGHT, barWidth, -barHeight);

    x += barWidth + 1;

    // Counting Octaves data
    notes_n_values_optimize[frequencyToNote_noOct(frequencyForBinIndex(i))] +=
      dataArray[i] / dataArray_max;
  }

  let total_pitch_val = notes_n_values_optimize.reduce(
    (sum, item) => sum + item,
    0
  );

  // draw pitch
  for (let i = 0; i < notes_n_values_optimize.length; i++) {
    let pitchHeight = rangeMap(
      (notes_n_values_optimize[i] / total_pitch_val) * 100,
      params.a,
      params.b,
      params.min,
      params.max
    );

    canvasCtx2.fillStyle = "rgb(0, 0, 0)";
    canvasCtx2.fillRect(i * 10, HEIGHT, barWidth * 5, -pitchHeight);
  }
}

//
//
// other added things
//#region //? other funcs

export function frequencyForBinIndex(index) {
  return ((index - 1) * sampleRate) / fftSize;
}

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
</script>

<!-- HTML PART -->

<canvas id="canvas" width="500" height="200"></canvas>
<canvas id="canvas2" width="500" height="200"></canvas>

<button on:click="{toggleLiveMonitoring}"
  >{recording ? "Pause" : "Resume"}</button
>

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
  the pitch is: {frequencyToNote_noOct(testVal)}
</p>

<!-- {#each notes_n_values_optimize as item}
  {item} <br />
{/each} -->
