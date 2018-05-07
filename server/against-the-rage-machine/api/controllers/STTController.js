const axios = require("axios");

module.exports = {
  sendFile: function (req, res) {
    var fd = new FormData();
    fd.append('audio.flac', blob);

    var data = {
      username: "a3438f60-0afc-4b30-96f7-1d03fae0f8d6",
      password: "bDg5LbJBKJG2"
    };
    axios({
      method: "post",
      url: "https://stream.watsonplatform.net/speech-to-text/api/v1/recognize?timestamps=true&max_alternatives=3",
      data: data,
      headers: {
        "Content-Type": "audio/flac"
      }
    }).then(function (resp) {
      console.log("json response:", resp.data);
      return res.ok(resp.data);
    }).catch(function (err) {
      console.log('response error', err);
      return res.serverError(err);
      // res.serverError(err);
    });
  }
}