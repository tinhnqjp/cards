'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Room = mongoose.model('Room'),
  _ = require('lodash'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

exports.create = function (req, res) {
  var users = [];
  users.push(new mongoose.Types.ObjectId(req.user._id));
  users.push(new mongoose.Types.ObjectId(req.body.users));
  getRooms(users)
    .then((room) => {
      if (room) {
        res.json(room);
      } else {
        room = new Room();
        room.title = req.body.title;
        room.users = users;
        room.save();
        res.json(room);
      }
    })
    .catch((err) => {
      console.log('**ERROR**', err);
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    });
};

exports.delete = function (req, res) {
  var room = req.room;
  room.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json({});
    }
  });
};

exports.update = function (req, res) {
  var room = req.article;
  room.title = req.body.title;

  room.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(room);
    }
  });
};

exports.list = function (req, res) {
  var condition = {
    users: req.user
  };
  Room.find(condition)
    .sort('-created').exec(function (err, rooms) {
      res.json(rooms);
    });
};

exports.roomByID = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'room is invalid'
    });
  }

  Room.findById(id).exec(function (err, room) {
    if (err) {
      return next(err);
    } else if (!room) {
      return res.status(404).send({
        message: 'No room with that identifier has been found'
      });
    }
    req.room = room;
    next();
  });
};

function getRooms(_users) {
  var condition = { $and: [{ 'users': _users[0] }, { 'users': _users[1] }] };
  return Room.findOne(condition).exec();
}
