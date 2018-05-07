import SpeechToText from './SpeechToText';

let isRecording = false;
const stt = new SpeechToText(analyzeText);
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