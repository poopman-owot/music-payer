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

function playNoteByLetter(note, octave, bpm, noteType) {
  if (noteType == false) {
    return
  }
  const notes = {
    C: 261.63,
    'C#': 277.18,
    D: 293.66,
    'D#': 311.13,
    E: 329.63,
    F: 349.23,
    'F#': 369.99,
    G: 392.00,
    'G#': 415.30,
    A: 440.00,
    'A#': 466.16,
    B: 493.88,
  };

  const noteName = note.toUpperCase();
  if (!Object.keys(notes).includes(noteName)) {
    console.error('Invalid note name!');
    return;
  }

  const parsedOctave = parseInt(octave, 10);
  if (isNaN(parsedOctave) || parsedOctave < 1 || parsedOctave > 8) {
    console.error('Invalid octave! Please use a number between 1 and 8.');
    return;
  }

  const frequency = notes[noteName] * Math.pow(2, parsedOctave - 4);

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

function runFunctionAtBPM(bpm, func, range) {
  const beatsPerSecond = bpm / 60;
  const millisecondsPerBeat = 1000 / beatsPerSecond;

  function executeFunction() {
    func(range);
  }

musicLoop =  setInterval(executeFunction, millisecondsPerBeat);
}

function getMusicChar(char = getChar()) {
  if (" _|".includes(char)) {
    return false
  }
else if (char == "𝄓") {
clearInterval(musicLoop);
return false
}
  const musicNotes = "𝅝𝅗𝅥♩♪♬";
  const specifyNote = musicNotes.includes(char);
  return specifyNote ? char : "𝅝";
}
// Example usage: Execute the function every beat at 120 BPM
function PlayMusic(range) {
  w.moveCursor("right");
  let [X, Y, x, y] = cursorCoords;
  const orderedNotes = ["C", "D", "E", "F", "G", "A", "B"];
  let octave = 4; // Fix the variable name for octave


  w.moveCursor("down", 0, range);
  for (let i = 0; i < range; i++) {

    if (i % 7 === 0 && i !== 0) {
      octave--;
    }
  }

  for (let i = 0; i < (range * 2); i++) {

    if (i % 7 === 0 && i !== 0) {
      octave++;
    }
    const currentOctave = octave; // Store the current octave in a separate variable
    if (getMusicChar()) {
      console.log(orderedNotes[(i+(9-range)) % 7], currentOctave, getMusicChar())

      playNoteByLetter(orderedNotes[(i+(9-range)) % 7], currentOctave, 120, getMusicChar());
    }
    w.moveCursor("up");
  }

  w.moveCursor("down", 0, range);
  octave = 4;


}
