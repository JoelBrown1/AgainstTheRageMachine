'use strict';

var express = require('express');
var cors = require('cors');
var app = express();
var axios = require('axios');

app.post('/watson/tone-analyzer', cors(), function (req, res, next) {
  console.log('Post: req: ', req.body);
  // res.json({msg: 'This is CORS-enabled for a whitelisted domain.'})
  axios({
    method: 'post',
    url: 'https://gateway.watsonplatform.net/tone-analyzer/api/v3/tone?version=2017-09-21',
    data: JSON.stringify({
      "text": "Team, I know that times are tough! Product sales have been disappointing for the past three quarters. We have a competitive product, but we need to do a better job of selling it!"
    }),
    headers: {
      'Authorization': 'Basic ZGMxMWU2YjQtMzA2NC00YjAzLWIzOGItNjc4NDMxZWM5MGJhOllCb0FsMUd5aDhySg==',
      'Content-Type': 'application/json'
    }
  }).then(function (response) {
    // console.log('reponse: ', reponse, ' res: ', res);
  }).catch(function (error) {
    console.log(error.response);
  });
});

app.listen(9000, function () {
  console.log('CORS-enabled web server listening on port 9000');
});