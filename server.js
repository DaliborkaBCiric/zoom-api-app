const express = require('express');
const app = express();
const port = process.env.PORT || 5000;;
const config = require('./config');
const jwt = require('jsonwebtoken');
const rp = require('request-promise');

let http = require('http');

let server = http.createServer(app);
let io = require('socket.io').listen(server);

// The server should start listening
server.listen(8080);
const payload = {
  iss: config.APIKey,
  exp: ((new Date()).getTime() + 5000)
};
const token = jwt.sign(payload, config.APISecret);

// usernames which are currently connected to the chat
sockets = [];
people = {};
myRoom = null;
let users = [];
let members = [];

//generate private room name for two users
function getARoom(user1, user2) {
  return 'privateRoom' + user1.userName + "And" + user2.userName;
}

//you could use e.g. underscore to achieve this (
function findUserByName(name) {
  for (socketId in people) {
    if (people[socketId].userName === name) {
      return socketId;
    }
  }
  return false;
}

io.sockets.on('connection', (socket) => {
  updateClients(users)
  updateRoomMembers(members);
  //join the server
  socket.on('join', (user) => {
    people[socket.id] = { userName: user.name, email: user.email };
    let userInfo = new Object();
    userInfo.userName = user.name;
    userInfo.email = user.email;
    if (!users.find(u => u.email === user.email)) {
      users.push(userInfo);
    }
    updateClients(users);
  });

  //initiate private message
  socket.on('initiate private message', (receiverName, senderEmail, receiverEmail, message) => {
    let receiverSocketId = findUserByName(receiverName);
    let receiver = people[receiverSocketId];
    let room = getARoom(people[socket.id], receiver);
    let roomMembers = new Object();
    if (!members.find(member => member.room === room)) {
      myRoom = room
      socket.join(room);
      io.sockets.connected[receiverSocketId].join(room);
      roomMembers.room = room;
      roomMembers.receiver = receiver;
      roomMembers.receiverEmail = people[socketId].email;
      roomMembers.sender = people[socket.id];
      roomMembers.senderEmail = people[socket.id].email;
      members.push(roomMembers);
      updateRoomMembers(members);
    }
  });

  socket.on('remove room', (room) => {
    let m = members.find(member => member.receiverEmail === room)
    if (m) {
      members.splice(m, 1);
    }
    updateRoomMembers(members);
  })

  socket.on('disconnect', function () {
    delete people[socket.id];
    let test = []
    Object.keys(people).forEach((key) => {
      test.push(people[key])
    });

    let valuesA = users.reduce((users, { email }) => Object.assign(users, { [email]: email }), {});
    let valuesB = test.reduce((users, { email }) => Object.assign(users, { [email]: email }), {});
    let result = [...users.filter(({ email }) => !valuesB[email]), ...test.filter(({ email }) => !valuesA[email])];
    if (result) {
      result.map(res => users.splice(users.indexOf(res), 1))
    }
  });


  function updateClients(usersInfo) {
    io.emit('update', usersInfo);
    io.to(socket.channel).emit('update', usersInfo);
  }

  function updateRoomMembers(roomMembers) {
    io.emit('updateRoom', roomMembers);
    io.to(socket.channel).emit('updateRoom', roomMembers);
  }
});


// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));


//get the form 
app.get('/', (req, res) => res.send(req.body));

app.get('/create-user/:userName/:userEmail', (req, res) => {
  console.log(req.params, 'req.params.userEmail')
  let options = {
    uri: `https://api.zoom.us/v2/users`,
    qs: {
      status: 'active'
    },
    auth: {
      'bearer': token
    },
    method: "POST",
    headers: {
      'User-Agent': 'Zoom-api-Jwt-Request',
      'Content-Type': 'application/json'
    },
    body: {
      "action": "create",
      "user_info": {
        "email": req.params.userEmail,
        "type": 1,
        "first_name": req.params.userName,
        "last_name": ""
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

app.get('/create-meeting/:userEmail', (req, res) => {
  // console.log(req.params.userEmail, 'req.params.userEmail')
  let options = {
    uri: `https://api.zoom.us/v2/users/${config.userId}/meetings`,
    qs: {
      status: 'active'
    },
    auth: {
      'bearer': token
    },
    method: "POST",
    headers: {
      'User-Agent': 'Zoom-api-Jwt-Request',
      'Content-Type': 'application/json'
    },
    body: {
      "topic": "Bilateral meeting",
      "type": 2,
      "start_time": new Date(),
      "timezone": "Europe/Belgrade",
      "agenda": `Bilateral meeting initiated by user ${req.params.userEmail}`,
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
  let options = {
    uri: `https://api.zoom.us/v2/users/${config.userId}/meetings`,
    qs: {
      status: 'active',
      page_size: '300',
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