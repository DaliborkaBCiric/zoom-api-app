const express = require('express');
const app = express();
const port = process.env.PORT || 5000;;
const jwt = require('jsonwebtoken');
const config = require('./config');
const rp = require('request-promise');

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));

// create a GET route
app.get('/express_backend', (req, res) => {
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' });
});
//Use the ApiKey and APISecret from config.js
const payload = {
  iss: config.APIKey,
  exp: ((new Date()).getTime() + 5000)
};
const token = jwt.sign(payload, config.APISecret);


//get the form 
app.get('/', (req, res) => res.send(req.body));

app.get('/userinfo', (req, res) => {
  let options = {
    uri: "https://api.zoom.us/v2/users/" + config.userId,
    qs: {
      status: 'active'
    },
    auth: {
      'bearer': token
    },
    headers: {
      'User-Agent': 'Zoom-api-Jwt-Request',
      'content-type': 'application/json'
    },
    json: true
  };

  rp(options)
    .then((response) => {
      resp = response
      var result = JSON.stringify(resp)
      res.send(JSON.parse(JSON.stringify(result)));
    })
    .catch(function (err) {
      console.log('API call failed, reason ', err);
    });
})

//use userinfo from the form and make a post request to /userinfo
app.get('/meetings/:userId', (req, res) => {
  console.log(req.params.userId, "UESR")
  var options = {
    uri: "https://api.zoom.us/v2/users/" + req.params.userId + "/meetings",
    qs: {
      status: 'active'
    },
    auth: {
      'bearer': token
    },
    headers: {
      'User-Agent': 'Zoom-api-Jwt-Request',
      'content-type': 'application/json'
    },
    json: true //Parse the JSON string in the response
  };

  rp(options)
    .then((response) => {
      resp = response
      var result = JSON.stringify(resp)
      res.send(JSON.parse(JSON.stringify(result)));

    })
    .catch(function (err) {
      // API call failed...
      console.log('API call failed, reason ', err);
    });
});