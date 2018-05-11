'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var resultCallback = {};

var SpeechToText = function () {
  function SpeechToText(cb) {
    _classCallCheck(this, SpeechToText);

    var recognition = {};
    var speechText = '';

    resultCallback = cb;

    try {
      var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      // this.recognition.continuous = true;
      this.recognition.onresult = this.handleOnResult;
    } catch (e) {
      console.error(e);
    }
  }

  _createClass(SpeechToText, [{
    key: 'start',
    value: function start() {
      console.log('stt start');
      this.recognition.start();
    }
  }, {
    key: 'stop',
    value: function stop() {
      console.log('stt stop');
      this.recognition.stop();
    }
  }, {
    key: 'handleOnResult',
    value: function handleOnResult(event) {
      // event is a SpeechRecognitionEvent object.
      // It holds all the lines we have captured so far. 
      // We only need the current one.
      var current = event.resultIndex;

      // Get a transcript of what was said.
      var transcript = event.results[current][0].transcript;

      // Add the current transcript to the contents of our Note.
      // There is a weird bug on mobile, where everything is repeated twice.
      // There is no official solution so far so we have to handle an edge case.
      var mobileRepeatBug = current == 1 && transcript == event.results[0][0].transcript;

      if (!mobileRepeatBug) {
        resultCallback(transcript);
        console.log('transcript: ', transcript);
      }

      this.recognition.start();
    }
  }]);

  return SpeechToText;
}();

exports.default = SpeechToText;