'use strict';

var _TextToSpeech = require('./TextToSpeech');

var _TextToSpeech2 = _interopRequireDefault(_TextToSpeech);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var tts = new _TextToSpeech2.default();
tts.fetchStream();