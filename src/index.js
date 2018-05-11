import SpeechToText from './SpeechToText';

let isRecording = false;
const stt = new SpeechToText(watsonAnalyze);
const toggleButton = document.getElementById('powerToggle');
toggleButton.addEventListener('click', handleToggle);

function handleToggle(evt) {
  if(!isRecording) {
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

    xhr.open("GET", `https://svc02.api.bitext.com/sentiment/${resultId}`, true);
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
  const emotion = json.document_tone.tones[0];
  let score = 0; 
  console.log('emotion: ', emotion);
  if(emotion.tone_id === 'anger') {
    console.log('score: ', emotion.score);
    score = emotion.score;
  }
  const evt = new CustomEvent('anger-response', { score });
  document.body.dispatchEvent(evt);
}