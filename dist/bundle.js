(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
      this.recognition.continuous = true;
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
    }
  }]);

  return SpeechToText;
}();

exports.default = SpeechToText;
},{}],2:[function(require,module,exports){
'use strict';

var _SpeechToText = require('./SpeechToText');

var _SpeechToText2 = _interopRequireDefault(_SpeechToText);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isRecording = false;
var stt = new _SpeechToText2.default(watsonAnalyze);
var toggleButton = document.getElementById('powerToggle');
toggleButton.addEventListener('click', handleToggle);

function handleToggle(evt) {
  if (!isRecording) {
    stt.start();
    isRecording = true;
  } else {
    stt.stop();
    isRecording = false;
  }
}

function requestResultId(text) {
  var data = JSON.stringify({
    "language": "eng",
    "text": text
  });

  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", analyzeText);

  xhr.open("POST", "https://svc02.api.bitext.com/sentiment/", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("Authorization", "Bearer 798cbcdd5090478b86b0c54ac61cce69");
  xhr.setRequestHeader("Access-Control-Allow-Origin", "http://localhost:8080/");
  xhr.setRequestHeader("Cache-Control", "no-cache");

  xhr.send(data);
}

function analyzeText() {
  if (this.readyState === 4) {
    // bittext api
    var resultId = JSON.parse(this.responseText).resultid;
    var data = null;
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        handleResponse(JSON.parse(this.responseText));
      }
    });

    xhr.open("GET", 'https://svc02.api.bitext.com/sentiment/' + resultId, true);
    xhr.setRequestHeader("Authorization", "Bearer 798cbcdd5090478b86b0c54ac61cce69");
    xhr.setRequestHeader("Cache-Control", "no-cache");

    xhr.send(data);
  }
}

function watsonAnalyze(text) {
  var data = JSON.stringify({
    "text": text
  });

  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      handleResponse(JSON.parse(this.responseText));
    }
  });

  xhr.open("POST", "https://gateway.watsonplatform.net/tone-analyzer/api/v3/tone?version=2017-09-21");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("Authorization", "Basic ZGMxMWU2YjQtMzA2NC00YjAzLWIzOGItNjc4NDMxZWM5MGJhOllCb0FsMUd5aDhySg==");
  xhr.setRequestHeader("Cache-Control", "no-cache");

  xhr.send(data);
}

function handleResponse(json) {
  var emotion = json.document_tone.tones[0];
  var score = 0;
  console.log('emotion: ', emotion);
  if (emotion.tone_id === 'anger') {
    console.log('score: ', emotion.score);
    score = emotion.score;
  }
  var evt = new CustomEvent('anger-response', { score: score });
  document.body.dispatchEvent(evt);
}
},{"./SpeechToText":1}]},{},[2]);
