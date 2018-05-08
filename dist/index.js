'use strict';

var _SpeechToText = require('./SpeechToText');

var _SpeechToText2 = _interopRequireDefault(_SpeechToText);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isRecording = false;
var stt = new _SpeechToText2.default(requestResultId);
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
        console.log(JSON.parse(this.responseText));
      }
    });

    xhr.open("GET", 'https://svc02.api.bitext.com/sentiment/' + resultId, true);
    xhr.setRequestHeader("Authorization", "Bearer 798cbcdd5090478b86b0c54ac61cce69");
    xhr.setRequestHeader("Cache-Control", "no-cache");

    xhr.send(data);
  }

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