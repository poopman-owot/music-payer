Permissions.can_edit_tile = _ => {
  return true
}
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();

function playNote(frequency, duration) {
  const oscillator = audioContext.createOscillator();

  oscillator.connect(audioContext.destination);
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
  oscillator.start();
  setTimeout(() => {
    oscillator.stop();
  }, duration);
}

function playNoteByLetter(note, octave, bpm, noteType, accidental = '') {
  if (noteType === false) {
    return;
  }

  const notes = {
    C: 261.63,
    'C♯': 277.18,
    'D♭': 277.18,
    D: 293.66,
    'D♯': 311.13,
    'E♭': 311.13,
    E: 329.63,
    F: 349.23,
    'F♯': 369.99,
    'G♭': 369.99,
    G: 392.00,
    'G♯': 415.30,
    'A♭': 415.30,
    A: 440.00,
    'A♯': 466.16,
    'B♭': 466.16,
    B: 493.88,
  };
//console.log((note + accidental).toUpperCase())
  const noteNameWithAccidental = (note + accidental).toUpperCase();
  if (!Object.keys(notes).includes(noteNameWithAccidental)) {
    console.error('Invalid note name!');
    return;
  }

  const parsedOctave = parseInt(octave, 10);
  if (isNaN(parsedOctave) || parsedOctave < 1 || parsedOctave > 8) {
    console.error('Invalid octave! Please use a number between 1 and 8.');
    return;
  }

  const frequency = notes[noteNameWithAccidental] * Math.pow(2, parsedOctave - 4);
  const noteDuration = calculateNoteDuration(bpm, noteType);

  playNote(frequency, noteDuration);
}

function calculateNoteDuration(bpm, noteType) {
  // Map note types to their duration in beats
  const noteTypes = {
    '𝅝': 1, // Whole note
    '𝅗𝅥': 1 / 2, // Half note
    '♩': 1 / 4, // Quarter note
    '♪': 1 / 8, // Eighth note
    '♬': 1 / 16 // Sixteenth note
  };

  // Check if the noteType is a valid key in the noteTypes object
  if (!Object.keys(noteTypes).includes(noteType)) {
    console.error('Invalid note type!');
    return;
  }

  // Calculate the duration of the note in seconds based on BPM and note type
  const beatsPerSecond = bpm / 60;
  const secondsPerBeat = 1 / beatsPerSecond;
  const noteDurationInSeconds = secondsPerBeat * noteTypes[noteType];

  return noteDurationInSeconds * 1000; // Convert to milliseconds
}

var musicLoop;
let savedParams = [120, 15,3];
let shouldLoop = false;

function runFunctionAtBPM(bpm, func, range, startingLowCoctive) {
  shouldLoop = true;
  savedParams = [bpm, range,startingLowCoctive]
  const beatsPerSecond = bpm / 60;
  const millisecondsPerBeat = 1000 / beatsPerSecond;

  function executeFunction() {
    func(range,startingLowCoctive);
  }

  musicLoop = setInterval(executeFunction, millisecondsPerBeat);
}

function getMusicChar(char = getChar()) {
  if (" _|".includes(char)) {
    return false
  } else if (char == "𝄓") {
    clearInterval(musicLoop);
    return false
  }
else if (char == "♺"){
let [a,b,c,d] = cursorCoords;
const amount = getLink(a,b,c,d) ? getLink(a,b,c,d).url : "";
w.moveCursor("left", 0, amount);
getMusicChar()
}
  const musicNotes = "𝅝𝅗𝅥♩♪♬";
  const specifyNote = musicNotes.includes(char);
  return specifyNote ? char : "𝅝";
}
// Example usage: Execute the function every beat at 120 BPM
function PlayMusic(range,startingLowCoctive) {
  w.moveCursor("right");
  let [X, Y, x, y] = cursorCoords;
  const orderedNotes = ["C", "D", "E", "F", "G", "A", "B"];
  let octave;
  for (let i = 0; i < range; i++) {
        octave = (~~((i)/7))+startingLowCoctive;

let [a,b,c,d] = cursorCoords
const accent = getLink(a,b,c,d) ? getLink(a,b,c,d).url : "";
    const currentOctave = octave; // Store the current octave in a separate variable
    if (getMusicChar()) {
console.log(orderedNotes[i%7],currentOctave,)
      playNoteByLetter(orderedNotes[i%7], currentOctave, 120, getMusicChar(),accent);
    }
    w.moveCursor("up");
  }

  w.moveCursor("down", 0, range);


}
document.addEventListener("dblclick", function() {
  if (shouldLoop) {
    clearInterval(musicLoop);
    shouldLoop = false;
  } else {
    runFunctionAtBPM(savedParams[0], PlayMusic, savedParams[1],savedParams[2])
  }
});
