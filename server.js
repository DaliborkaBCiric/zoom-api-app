const express = require('express');
const app = express();
const port = process.env.PORT || 5000;;
const config = require('./config');
const rp = require('request-promise');

let http = require('http');

let server = http.createServer(app);
let io = require('socket.io').listen(server);

// The server should start listening
server.listen(80);

// usernames which are currently connected to the chat
sockets = [];
people = {};
myRoom = null;
let users = [];

var userNames = {};

//generate private room name for two users
function getARoom(user1, user2) {
  return 'privateRoom' + user1.name + "And" + user2.name;
}

//you could use e.g. underscore to achieve this (
function findUserByName(name) {
  for (socketId in people) {
    if (people[socketId].name === name) {
      return socketId;
    }
  }
  return false;
}

io.sockets.on('connection', (socket) => {

  //join the server
  socket.on('join', (name) => {
    people[socket.id] = { name: name };
    var userInfo = new Object();
    userInfo.userName = name;
    userInfo.socketId = socket.id;
    users.push(userInfo);
    updateClients(users);
  });

  //initiate private message
  socket.on('initiate private message', (receiverName, message) => {
    let receiverSocketId = findUserByName(receiverName);
    if (receiverSocketId) {
      let receiver = people[receiverSocketId];
      let room = getARoom(people[socket.id], receiver);
      myRoom = room
      
      socket.join(room);

      io.sockets.connected[receiverSocketId].join(room);
      io.sockets.in(room).emit('private room created', room, message);
      io.sockets.emit("change_data");
    }
  });

  socket.on('send private message', (message) => {
    io.sockets.in(myRoom).emit('private chat message', message);
  });

  socket.on("incoming data", (data) => {
    socket.broadcast.emit("outgoing data", { num: data });
  });

  //disconnect from the server
  io.on('disconnect', function () {
    delete people[socket.id];
    sockets.splice(sockets.indexOf(socket), 1);
  });

  function updateClients(usersInfo) {
    io.emit('update', usersInfo);
    io.to(socket.channel).emit('update', usersInfo);
  }
});


// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));


//get the form 
app.get('/', (req, res) => res.send(req.body));

app.post('/create-meeting', (req, res) => {
  let options = {
    uri: `https://api.zoom.us/v2/users/${config.userId}/meetings`,
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
    body: {

    },
    json: true
  };
});


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
    body: {
      "topic": "Bilateral meeting",
      "type": 2,
      "start_time": "2020-05-10T19:30:00Z",
      "duration": 3,
      "timezone": "Europe/Belgrade",
      "agenda": `Bilateral meeting hosted by ${config.userId}`,
      "settings": {
        "host_video": false,
        "participant_video": false,
        "cn_meeting": false,
        "in_meeting": true,
        "join_before_host": true,
        "mute_upon_entry": true,
        "watermark": false,
        "use_pmi": false,
        "registrants_email_notification": true
      }
    },
    json: true
  };

  rp(options)
    .then((response) => {
      resp = response
      let result = JSON.stringify(resp)
      res.send(JSON.parse(JSON.stringify(result)));
    })
    .catch(function (err) {
      console.log('API call failed, reason ', err);
    });
})

//use userinfo from the form and make a post request to /userinfo
app.get('/meetings/:userId', (req, res) => {
  console.log(req.params.userId, "UESR")
  let options = {
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
      let result = JSON.stringify(resp)
      res.send(JSON.parse(JSON.stringify(result)));

    })
    .catch(function (err) {
      // API call failed...
      console.log('API call failed, reason ', err);
    });
});