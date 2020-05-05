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

app.get('/meetings', (req, res) => {
  console.log("https://api.zoom.us/v2/users/" + config.userId, 'dsadadasdsa')
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
app.get('/userinfo', (req, res) => {
  //Store the options for Zoom API which will be used to make an API call later.
  var options = {
    //You can use a different uri if you're making an API call to a different Zoom endpoint.
    uri: "https://api.zoom.us/v2/users/daliborka.b.ciric@gmail.com",
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

  //Use request-promise module's .then() method to make request calls.
  rp(options)
    .then((response) => {
      //printing the response on the console
      console.log('User has', response);
      //console.log(typeof response);
      resp = response
      //Adding html to the page
      // var title1 = '<center><h3>Your token: </h3></center>'
      // var result1 = title1 + '<code><pre style="background-color:#aef8f9;">' + token + '</pre></code>';
      // var title = '<center><h3>User\'s information:</h3></center>'
      //Prettify the JSON format using pre tag and JSON.stringify
      // var result = title + '<code><pre style="background-color:#aef8f9;">' + JSON.stringify(resp, null, 2) + '</pre></code>'
      var result = JSON.stringify(resp)
      res.send(JSON.parse(JSON.stringify(result)));

    })
    .catch(function (err) {
      // API call failed...
      console.log('API call failed, reason ', err);
    });
});