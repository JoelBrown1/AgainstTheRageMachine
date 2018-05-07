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
    console.log('cb: ', resultCallback);

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
      this.recognition.start();
    }
  }, {
    key: 'stop',
    value: function stop() {
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
        console.log('cb: ', resultCallback);
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
var stt = new _SpeechToText2.default(analyzeText);
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

function analyzeText(text) {
  // var jsonData = JSON.stringify({
  //   "text": "Team, I know that times are tough! Product sales have been disappointing for the past three quarters. We have a competitive product, but we need to do a better job of selling it!"
  // });

  var data = JSON.stringify({
    "text": text
  });

  console.log('data: ', data);

  // axios({
  //   method: 'post',
  //   url: 'http://localhost:9000/watson/tone-analyzer',
  //   data: jsonData
  // }).then(response => {
  //   // console.log('reponse: ', reponse);
  // });

  // var xhr = new XMLHttpRequest();
  // xhr.withCredentials = true;

  // xhr.addEventListener("readystatechange", function () {
  //   if (this.readyState === 4) {
  //     console.log(this.responseText);
  //   }
  // });

  // xhr.open("POST", "https://gateway.watsonplatform.net/tone-analyzer/api/v3/tone?version=2017-09-21");
  // xhr.setRequestHeader("Content-Type", "application/json");
  // xhr.setRequestHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  // xhr.setRequestHeader("Authorization", "Basic ZGMxMWU2YjQtMzA2NC00YjAzLWIzOGItNjc4NDMxZWM5MGJhOllCb0FsMUd5aDhySg==");
  // xhr.setRequestHeader("Cache-Control", "no-cache");

  // xhr.send(data);
}
},{"./SpeechToText":1}]},{},[2]);
