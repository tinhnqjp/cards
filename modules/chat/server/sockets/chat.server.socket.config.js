'use strict';
var _ = require('lodash');

// Create the chat configuration
module.exports = function (io, socket) {
  socket.on('init', function (_user) {
    var user = _.find(global.onlineUsers, { 'username': _user.username });
    if (!user) {
      global.onlineUsers.push({ socketId: socket.id, username: _user.username });
    }
    io.emit('init', global.onlineUsers);
  });

  // socket.broadcast.emit('chatMessage', {
  //   type: 'status',
  //   text: '<Not Sender>',
  //   created: Date.now(),
  //   profileImageURL: socket.request.user.profileImageURL,
  //   username: socket.request.user.username
  // });

  io.emit('online', {
    type: 'online',
    text: socket.request.user.username + ' online',
    created: Date.now(),
    profileImageURL: socket.request.user.profileImageURL,
    username: socket.request.user.username
  });

  // Send a chat messages to all connected sockets when a message is received
  socket.on('chatMessage', function (message) {
    message.type = 'message';
    message.created = Date.now();
    message.profileImageURL = socket.request.user.profileImageURL;
    message.username = socket.request.user.username;

    // Emit the 'chatMessage' event
    io.emit('chatMessage', message);
  });

  socket.on('subscribe', function (room) {
    console.log('​module.exports -> room', room);
    socket.join(room);
  });

  socket.on('unsubscribe', function (room) {
    socket.leave(room);
  });

  socket.on('send', function (message) {
    message.type = 'message';
    message.created = Date.now();
    message.profileImageURL = socket.request.user.profileImageURL;
    message.username = socket.request.user.username;
    io.sockets.in(message.room).emit('private', message);
  });

  // Emit the status event when a socket client is disconnected
  socket.on('disconnect', function () {
    io.emit('online', {
      type: 'offline',
      text: socket.request.user.username + ' offline',
      created: Date.now(),
      profileImageURL: socket.request.user.profileImageURL,
      username: socket.request.user.username
    });
    global.onlineUsers = _.remove(global.onlineUsers, function (online) {
      return online.username !== socket.request.user.username;
    });
    io.emit('init', global.onlineUsers);
  });
};
