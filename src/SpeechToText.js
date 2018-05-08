let resultCallback = {};

class SpeechToText {
  constructor(cb) {
    const recognition = {};
    let speechText = '';

    resultCallback = cb;

    try {
      var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.onresult = this.handleOnResult;
    }
    catch (e) {
      console.error(e);
    }
  }

  start() {
    console.log('stt start');
    this.recognition.start();
  }

  stop() {
    console.log('stt stop');
    this.recognition.stop();
  }

  handleOnResult(event) {
    // event is a SpeechRecognitionEvent object.
    // It holds all the lines we have captured so far. 
    // We only need the current one.
    var current = event.resultIndex;

    // Get a transcript of what was said.
    var transcript = event.results[current][0].transcript;

    // Add the current transcript to the contents of our Note.
    // There is a weird bug on mobile, where everything is repeated twice.
    // There is no official solution so far so we have to handle an edge case.
    var mobileRepeatBug = (current == 1 && transcript == event.results[0][0].transcript);

    if (!mobileRepeatBug) {
      resultCallback(transcript);
      console.log('transcript: ', transcript);
    }
  }
}

export default SpeechToText;