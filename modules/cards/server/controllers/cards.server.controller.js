'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Card = mongoose.model('Card'),
  Word = mongoose.model('Word'),
  _ = require('lodash'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an card
 */
exports.create = function (req, res) {
  var arrWords;
  var content = req.body.content;
  // console.log(content);
  if (content) {
    arrWords = content.split("\n\n");
    var card = new Card();
    card.title = req.body.title;
    arrWords = content.split("\n\n");
    arrWords.forEach(word => {
      var strings = word.split("\t");
      var obj = new Word();
      obj.front = strings[0];
      obj.back = strings[1];
      obj.card = card;
      obj.user = req.user;
      obj.save();
      card.words.push(obj);
    });
    card.save();
    res.json(card);
  } else {
    return res.status(422).send({
      message: 'content null'
    });
  }
  console.log('​exports.create -> arrWords', arrWords);
};

/**
 * Show the current card
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var card = req.card ? req.card.toJSON() : {};

  // Add a custom field to the Card, for determining if the current User is the 'owner'.
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Card model.
  card.isCurrentUserOwner = !!(req.user && card.user && card.user._id.toString() === req.user._id.toString());

  res.json(card);
};

/**
 * Update an card
 */
exports.update = function (req, res) {
  var card = req.card;

  card.title = req.body.title;
  card.content = req.body.content;

  card.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(card);
    }
  });
};

/**
 * Delete an card
 */
exports.delete = function (req, res) {
  var card = req.card;

  card.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(card);
    }
  });
};

/**
 * copy an card
 */
exports.copy = function (req, res) {
  var card = req.card;
  var newCard = new Card();
  _.extend(newCard, {
    title: card.title + ' - コピー',
    words: card.words
  });
  newCard.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(newCard);
    }
  });
};

/**
 * List of Cards
 */
exports.list = function (req, res) {
  var limit = Number(req.query.limit) || 10;
  var page = Number(req.query.page) || 1;
  var keyword = req.query.keyword || null;
  var condition = {};
  if (keyword) {
    var regex = new RegExp(keyword.trim(), 'i');
    condition = {
      $or: [
        { 'front': regex },
        { 'back': regex }
      ]
    };
  }

  Card.find(condition)
    .skip((limit * page) - limit)
    .limit(limit)
    .sort('-created').populate('user', 'displayName').exec(function (err, cards) {
      Card.count(condition).exec(function (err, count) {
        if (err) {
          return res.status(422).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.json({
            laws: cards,
            current: page,
            total: count
          });
        }
      });
    });
};

/**
 * Card middleware
 */
exports.cardByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Card is invalid'
    });
  }

  Card.findById(id).populate('user', 'displayName').exec(function (err, card) {
    if (err) {
      return next(err);
    } else if (!card) {
      return res.status(404).send({
        message: 'No card with that identifier has been found'
      });
    }
    req.card = card;
    next();
  });
};

exports.play = function (req, res) {
  var ids = req.body.ids || null;
  if (!ids) {
    return res.status(422).send({
      message: 'ids null'
    });
  }
  getWordsByCardIds(ids)
    .then(function (listWord) {
      console.info('**OK**');
      res.send(listWord);
    })
    .catch(function (error) {
      console.error('**ERROR**', error);
      return res.status(422).send({
        message: error
      });
    });
};

exports.tmp = function (req, res) {

  var arrWords;
  var content = req.body.content;
  // console.log(content);
  if (content) {
    arrWords = content.split("\n\n");
    createCard(req.body.title, arrWords, req.user)
      .then(function (result) {
        console.info('**OK**');
        res.send(result);
      })
      .catch(function (error) {
        console.error('**ERROR**', error);
        return res.status(422).send({
          message: error
        });
      });
  }
};

function createCard(title, arrWords, user) {
  return new Promise(function (resolve, reject) {
    var card = new Card();
    foreachWord(arrWords, card, user)
      .then(function (listWord) {
        card.words = [];
        card.title = title;
        listWord.forEach(obj => {
          card.words.push(obj);
        });
        // console.log(listWord);
        return card.save();
      })
      .then(function (result) {
        resolve(result);
      })
      .catch(function (error) {
        reject(error);
      });
  });
}


function foreachWord(arrWords, card, user) {
  var promises = [];
  arrWords.forEach(word => {
    var strings = word.split("\t");
    var front = strings[0];
    var back = strings[1];
    promises.push(createWord(front, back, card, user));
  });
  return Promise.all(promises);
}

function getWordsByCardIds(ids) {
  return new Promise(function (resolve, reject) {
    var cardIds = [];
    try {
      console.log(ids);
      if (ids instanceof Array) {
        for (var index in ids) {
          cardIds.push(new mongoose.Types.ObjectId(ids[index]));
        }
      } else {
        cardIds.push(new mongoose.Types.ObjectId(ids));
      }
    } catch (error) {
      reject({ message: 'Id incorrect' });
    }
    Word.find({ 'card': { $in: cardIds } })
      .sort('-created').exec(function (err, words) {
        if (err) {
          reject(err);
        } else {
          resolve(words)
        }
      });
  });
}

function createWord(front, back, card, user) {
  return new Promise(function (resolve, reject) {
    var obj = new Word();
    obj.front = front;
    obj.back = back;
    obj.card = card;
    obj.user = user;
    obj.save(function (err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}