'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Card = mongoose.model('Card'),
  Folder = mongoose.model('Folder'),
  _ = require('lodash'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

exports.create = function (req, res) {
  var folder = new Folder();
  folder.title = req.body.title;
  folder.cards = [];
  folder.user = req.user;
  folder.save();
  res.json(folder);
};

exports.delete = function (req, res) {
  var folder = req.folder;
  folder.remove(function (err) {
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
  var folder = req.article;
  folder.title = req.body.title;

  folder.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(folder);
    }
  });
};

exports.list = function (req, res) {
  var condition = {
    user: req.user
  };
  Folder.find(condition)
    .sort('-created').exec(function (err, folders) {
      res.json(folders);
    });
};

exports.listCards = function (req, res) {
  var folder = req.folder;
  Card.find({ folders: folder })
    .sort('-created').exec(function (err, cards) {
      res.json(cards);
    });
};

exports.read = function (req, res) {
  var folder = req.folder ? req.folder.toJSON() : {};
  res.json(folder);
};

exports.folderByID = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Folder is invalid'
    });
  }

  Folder.findById(id)
    .populate('user', 'username')
    .exec(function (err, folder) {
      if (err) {
        return next(err);
      } else if (!folder) {
        return res.status(404).send({
          message: 'No folder with that identifier has been found'
        });
      }
      req.folder = folder;
      next();
    });
};

/**
 * List of latest
 */
exports.addcard = function (req, res) {
  var folder = new Folder({});
  folder.save();

  var card = new Card({});
  card.folders.push(folder);
  card.save();

  res.json(card);
};
