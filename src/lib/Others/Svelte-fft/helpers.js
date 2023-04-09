function getFrequencyValue(frequency) {
  var nyquist = sampleRate / 2;
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
