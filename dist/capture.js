'use strict';

(function () {
	// The width and height of the captured photo. We will set the
	// width to the value defined here, but the height will be
	// calculated based on the aspect ratio of the input stream.

	var width = 320; // We will scale the photo width to this
	var height = 0; // This will be computed based on the input stream

	// |streaming| indicates whether or not we're currently streaming
	// video from the camera. Obviously, we start at false.

	var streaming = false;

	// The various HTML elements we need to configure or control. These
	// will be set by the startup() function.

	var video = null;
	var canvas = null;
	var photo = null;
	var startbutton = null;
	var imageTray = document.querySelector('.image-tray');
	var startbutton = document.getElementById('startbutton');
	var powerToggle = document.getElementById('powerToggle');
	var modal = document.querySelector('.modal');
	var modalClose = document.querySelector('.close');
	var PHOTO_CAPTURE_RATE = 2000; // API won't support anything under 1000
	var callStartedAt;
	var isMachineOn = false;

	// Line Chart
	var myLineChart = new Chart("rageRange", {
		type: "line",
		data: {
			labels: ["One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"],
			datasets: [{
				data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				borderColor: "#ee4444",
				backgroundColor: "rgba(200,10,10,0.1)",
				lineTension: 0.05,
				pointRadius: 0
			}, {
				data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				borderColor: "#4444ee",
				backgroundColor: "rgba(10,10,250,0.1)",
				lineTension: 0.05,
				pointRadius: 0
			}]
		},
		options: {
			legend: { display: false },
			tooltips: { enabled: false },
			scales: {
				yAxes: [{
					ticks: {
						min: 0,
						max: 100
					}
				}],
				xAxes: [{ display: false }]
			}
		}
	});

	// Gauge Chart
	var rageGauge = new JustGage({
		id: "rageGauge",
		value: 0,
		min: 0,
		max: 100,
		title: "Visitors"
	});

	function startMachine() {
		// callStartedAt = new Date();
		// debugger;
		isMachineOn = true;
		takepicture();
	}
	function stopMachine() {
		isMachineOn = false;
	}
	function updateGraphs(newAnger) {
		myLineChart.data.datasets[0].data.unshift(newAnger);
		myLineChart.data.datasets[0].data.pop();
		myLineChart.update();

		// Gauge
		var sum = myLineChart.data.datasets[0].data.slice(0, 3).reduce(function (previous, current) {
			return current += previous;
		});
		var avg = sum / 3;
		rageGauge.refresh(avg);
		if (avg > 95) {
			modal.classList.add('open');
		}
	}
	function updateTextGraph(newAnger) {
		myLineChart.data.datasets[1].data.unshift(newAnger);
		myLineChart.data.datasets[1].data.pop();
		myLineChart.update();
	}

	function startup() {
		video = document.getElementById('video');
		canvas = document.getElementById('canvas');
		photo = document.getElementById('photo');
		document.body.addEventListener('anger-response', function (evt) {
			console.log('current anger level', evt.detail);
			updateTextGraph(evt.detail.score * 100);
		});

		modalClose.addEventListener('click', function () {
			console.log('close');
			modal.classList.remove('open');
		});

		navigator.getMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

		navigator.getMedia({ video: true, audio: false }, function (stream) {
			if (navigator.mozGetUserMedia) {
				video.mozSrcObject = stream;
			} else {
				var vendorURL = window.URL || window.webkitURL;
				video.src = vendorURL.createObjectURL(stream);
			}
			video.play();
			startbutton.classList.add('hide');
		}, function (err) {
			console.log("An error occured! " + err);
		});

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

		powerToggle.addEventListener('change', function (e) {
			if (e.target.checked) {
				startMachine();
			} else {
				stopMachine();
			}
		});
	}

	// Capture a photo by fetching the current contents of the video
	// and drawing it into a canvas, then converting that to a PNG
	// format data URL. By drawing it on an offscreen canvas and then
	// drawing that to the screen, we can change its size and/or apply
	// other changes before drawing it.

	function uploadFileToAPI(pictureTakenAt) {
		return function (blob) {
			var now = pictureTakenAt;
			var formData = new FormData();
			formData.append('api_key', "qapZyITSrsmbltM_APkK5EDO6utlirmf");
			formData.append('api_secret', "p5XwMDtWcuYCKY1RlXmLzrKpGmrRcSOP");
			formData.append('return_attributes', "emotion");
			formData.append('image_file', blob);

			axios({
				method: 'post',
				url: 'https://api-us.faceplusplus.com/facepp/v3/detect',
				data: formData,
				headers: { 'Content-Type': 'multipart/form-data' }
			}).then(function (response) {
				// Handle API response
				var beforeNow = now;
				var rightNow = new Date();
				var timeDiff = rightNow.getTime() - beforeNow.getTime();
				if (isMachineOn) {
					if (timeDiff > PHOTO_CAPTURE_RATE) {
						takepicture();
					} else {
						setTimeout(takepicture, PHOTO_CAPTURE_RATE - timeDiff);
					}
				}
				if (response.data.faces.length) {
					console.log(response.data.faces[0].attributes.emotion);
					updateGraphs(response.data.faces[0].attributes.emotion.anger);
				} else {
					console.log('No Faces detected');
				}
			});
		};
	}

	function takepicture() {
		var context = canvas.getContext('2d');
		if (width && height) {
			canvas.width = width;
			canvas.height = height;
			context.drawImage(video, 0, 0, width, height);

			// Push image file into history
			var dataUrl = canvas.toDataURL('image/png');
			var imageFile = new Image();

			imageFile.src = dataUrl;
			imageTray.prepend(imageFile);

			// Upload image to Face++ APIs
			var now = new Date();
			canvas.toBlob(uploadFileToAPI(now));
		}
	}

	// Set up our event listener to run the startup process
	// once loading is complete.
	// window.addEventListener('load', startup, false);
	startbutton.addEventListener('click', startup);
})();