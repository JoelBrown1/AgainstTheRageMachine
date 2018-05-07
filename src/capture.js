(function () {
  // The width and height of the captured photo. We will set the
  // width to the value defined here, but the height will be
  // calculated based on the aspect ratio of the input stream.

  var width = 320;    // We will scale the photo width to this
  var height = 0;     // This will be computed based on the input stream

  // |streaming| indicates whether or not we're currently streaming
  // video from the camera. Obviously, we start at false.

  var streaming = false;

  // The various HTML elements we need to configure or control. These
  // will be set by the startup() function.

  var video = null;
  var canvas = null;
  var photo = null;
  var startbutton = null;

  function startup() {
    video = document.getElementById('video');
    canvas = document.getElementById('canvas');
    photo = document.getElementById('photo');
    startbutton = document.getElementById('startbutton');

    navigator.getMedia = (navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia);

    navigator.getMedia(
      {
        video: true,
        audio: false
      },
      function (stream) {
        if (navigator.mozGetUserMedia) {
          video.mozSrcObject = stream;
        } else {
          var vendorURL = window.URL || window.webkitURL;
          video.src = vendorURL.createObjectURL(stream);
        }
        video.play();
      },
      function (err) {
        console.log("An error occured! " + err);
      }
    );

    video.addEventListener('canplay', function (ev) {
      if (!streaming) {
        height = video.videoHeight / (video.videoWidth / width);

        // Firefox currently has a bug where the height can't be read from
        // the video, so we will make assumptions if this happens.

        if (isNaN(height)) {
          height = width / (4 / 3);
        }

        video.setAttribute('width', width);
        video.setAttribute('height', height);
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);
        streaming = true;
      }
    }, false);

    startbutton.addEventListener('click', function (ev) {
      takepicture();
      ev.preventDefault();
    }, false);

    clearphoto();
    getAudio();
  }

  // Fill the photo with an indication that none has been
  // captured.

  function clearphoto() {
    var context = canvas.getContext('2d');
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);

    var data = canvas.toDataURL('image/png');
    photo.setAttribute('src', data);
  }

  // Capture a photo by fetching the current contents of the video
  // and drawing it into a canvas, then converting that to a PNG
  // format data URL. By drawing it on an offscreen canvas and then
  // drawing that to the screen, we can change its size and/or apply
  // other changes before drawing it.
  /*POST /speech-to-text/api/v1/recognize?timestamps=true&amp;max_alternatives=3 HTTP/1.1
Host: stream.watsonplatform.net
Content-Type: audio/flac
Authorization: Basic YTM0MzhmNjAtMGFmYy00YjMwLTk2ZjctMWQwM2ZhZTBmOGQ2OmJEZzVMYkpCS0pHMg==
Cache-Control: no-cache
Postman-Token: 40615fa6-f72d-4f17-91a1-6f64d563f540

undefined*/
  var fileReader = new FileReader();
  function getAudio() {
    console.log('getAudio');
    var file = '/Users/noetibbl/Documents/_WIP/SFHackathon/AgainstTheRageMachine/dist/audio.flac';
    var blob = new Blob([file], {type: 'audio/flac'});
    fileReader.addEventListener('load', _handleAudioFileLoad, false);
    fileReader.readAsBinaryString(blob);

    // var data = new FormData();
    // data.append('file', '/Users/noetibbl/Documents/_WIP/SFHackathon/AgainstTheRageMachine/dist/audio.flac');
    // var xhr = new XMLHttpRequest();
    // xhr.withCredentials = true;

    // xhr.addEventListener("readystatechange", function () {
    //   if (this.readyState === 4) {
    //     console.log(this.responseText);
    //   }
    // });

    // xhr.open("POST", "https://stream.watsonplatform.net/speech-to-text/api/v1/recognize?timestamps=true&max_alternatives=3", true);
    // xhr.setRequestHeader("Content-Type", "audio/flac");
    // xhr.setRequestHeader("Authorization", "Basic YTM0MzhmNjAtMGFmYy00YjMwLTk2ZjctMWQwM2ZhZTBmOGQ2OmJEZzVMYkpCS0pHMg==");
    // // xhr.setRequestHeader("Cache-Control", "no-cache");

    // xhr.send(blob);

    // var headers = {
    //   Authorization: "Basic YTM0MzhmNjAtMGFmYy00YjMwLTk2ZjctMWQwM2ZhZTBmOGQ2OmJEZzVMYkpCS0pHMg==",
    //   // "Access-Control-Allow-Origin": "*",
    //   // "Access-Control-Allow-Credentials": "true",
    //   // "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
    //   // "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    //   "content-type": "audio/flac"
    // };
    // axios({
    //   method: "post",
    //   url: "https://stream.watsonplatform.net/speech-to-text/api/v1/recognize?timestamps=true&max_alternatives=3",
    //   headers: headers,
    //   data: data,
    // }).then(function (resp) {
    //   console.log("json response:", resp.data);
    // }).catch(function (err) {
    //   console.log('response error', err);
    // });
  }

  function _handleAudioFileLoad(evt) {
    console.log('audio file: ', fileReader.result);
    var headers = {
      Authorization: "Basic YTM0MzhmNjAtMGFmYy00YjMwLTk2ZjctMWQwM2ZhZTBmOGQ2OmJEZzVMYkpCS0pHMg==",
      // "Access-Control-Allow-Origin": "*",
      // "Access-Control-Allow-Credentials": "true",
      // "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
      // "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, Authorization",
      "content-type": "audio/flac"
    };
    axios({
      method: "post",
      url: "https://stream.watsonplatform.net/speech-to-text/api/v1/recognize?timestamps=true&max_alternatives=3",
      headers: headers,
      data: evt.target.result,
    }).then(function (resp) {
      console.log("json response:", resp.data);
    }).catch(function (err) {
      console.log('response error', err);
    });
  }

  function takepicture() {
    var context = canvas.getContext('2d');
    if (width && height) {
      canvas.width = width;
      canvas.height = height;
      context.drawImage(video, 0, 0, width, height);


      var dataUrl = canvas.toDataURL('image/png');
      var dataBlob = canvas.toBlob(function (blob) {
        var formData = new FormData();
        formData.append('userfile', blob);
        axios({
          method: 'post',
          url: 'http://127.0.0.1:1337/image/',
          data: formData,
          headers: { 'Content-Type': 'multipart/form-data' }
        })
          .then(function (response) {
            console.log('done!');
          });
      });

      photo.setAttribute('src', dataUrl);
    } else {
      clearphoto();
    }
  }

  // Set up our event listener to run the startup process
  // once loading is complete.
  window.addEventListener('load', startup, false);
})();