'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Card = mongoose.model('Card'),
  Word = mongoose.model('Word'),
  Memorize = mongoose.model('Memorize'),
  _ = require('lodash'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an card
 */
exports.create = function (req, res) {
  var card = new Card();
  card.title = req.body.title;
  card.folders = req.body.folders;
  var words = req.body.words;
  // card.words = req.body.words;
  var wordIds = [];
  new Promise(function (resolve, reject) {
    words.forEach(function (word) {
      var objWord = new Word();
      if (word.back) {
        var strings = word.back.split('\n');
        if (strings.length > 0) {
          objWord.back_line1 = strings[0] ? strings[0] : '';
          objWord.back_line2 = strings[1] ? strings[1] : '';
          objWord.back_line3 = strings[2] ? strings[2] : '';
        }
      }
      objWord.index = word.index;
      objWord.front = word.front;
      objWord.back = word.back;
      objWord.card = card._id;
      objWord.user = req.user;
      objWord.save(function (err) {
        if (err) {
          reject(err);
        }
      });
      wordIds.push(new mongoose.Types.ObjectId(objWord._id));
    });
    resolve(wordIds);
  })
    .then(function (wordIds) {
      card.words = wordIds;
      return card.save();
    })
    .then(function () {
      res.json(card);
    })
    .catch(function (error) {
      console.log('**ERROR**', error);
      return res.status(422).send({
        message: errorHandler.getErrorMessage(error)
      });
    });
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
  card.folders = req.body.folders;
  card.words = req.body.words;
  var wordIds = [];
  new Promise(function (resolve, reject) {
    card.words.forEach(function (word) {
      if (word.back) {
        var strings = word.back.split('\n');
        if (strings.length > 0) {
          word.back_line1 = strings[0] ? strings[0] : '';
          word.back_line2 = strings[1] ? strings[1] : '';
          word.back_line3 = strings[2] ? strings[2] : '';
        }
      }
      word.card = card._id;
      word.user = req.user;
      Word.update({ _id: word._id }, word, { upsert: true, setDefaultsOnInsert: true }, function (err) {
        if (err) {
          console.log(err);
          reject(err);
        }
      });
      wordIds.push(new mongoose.Types.ObjectId(word._id));
    });
    resolve(wordIds);
  })
    .then(function (wordIds) {
      var condition = { $and: [{ 'card': card._id }, { '_id': { $nin: wordIds } }] };
      return Word.remove(condition).exec();
    })
    .then(function () {
      var condition = { $and: [{ 'card': card._id }, { '_id': { $nin: wordIds } }] };
      return Memorize.remove(condition).exec();
    })
    .then(function () {
      return card.save();
    })
    .then(function () {
      res.json(card);
    })
    .catch(function (error) {
      console.log('**ERROR**', error);
      return res.status(422).send({
        message: errorHandler.getErrorMessage(error)
      });
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
      Word.remove({ 'card': card._id }).exec(function (err, result) {
        // console.log(err, result);
      });

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
 * chooseFolder
 */
exports.chooseFolder = function (req, res) {
  var ids = req.body.folders || null;
  var card = req.card;
  card.folders = [];
  card.folders = ids;
  card.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json({});
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

  Card.findById(id)
    .populate('words')
    .populate('user', 'displayName')
    .exec(function (err, card) {
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
  var cardIds = [];
  try {
    console.log(ids);
    if (ids instanceof Array) {
      for (var index = 0; index < ids.length; index++) {
        cardIds.push(new mongoose.Types.ObjectId(ids[index]));
      }
    } else {
      cardIds.push(new mongoose.Types.ObjectId(ids));
    }
  } catch (error) {
    console.log({ message: 'Id incorrect' });
  }

  // save
  getMemorizes(req.user, cardIds)
    .then(function (memorizes) {
      if (memorizes) {
        res.json(memorizes);
      } else {
        getWordsByCardIds(cardIds)
          .then(function (listWord) {
            var words = [];
            listWord.forEach(word => {
              words.push({
                word: word,
                memorize: 0
              });
            });
            var memorize = new Memorize();
            memorize.user = req.user;
            memorize.card = cardIds;
            memorize.words = words;
            memorize.current_quiz00 = 1;
            memorize.current_quiz10 = 1;
            memorize.current_quiz01 = 1;
            memorize.current_quiz11 = 1;

            return memorize.save();
          })
          .then(function (memorize) {
            res.json(memorize);
          });
      }
    })
    .catch(function (error) {
      console.error('**ERROR**', error);
      return res.status(422).send({
        message: error
      });
    });
};

exports.remembered = function (req, res) {
  var id = req.body.id || null;
  var remembered = req.body.remembered || 0;
  if (!id) {
    return res.status(422).send({
      message: 'id null'
    });
  }
  var condition = {
    $and: [
      { 'user': req.user },
      { 'words.word': id }]
  };
  Memorize.find(condition)
    .sort('-updated').exec(function (error, result) {
      if (error) {
        return res.status(422).send({
          message: error
        });
        // reject(error);
      } else {
        result.forEach(memorize => {
          memorize.words.forEach(item => {
            if (item.word.toString() === id) {
              item.memorize = remembered;
            }
          });
          memorize.updated = Date.now();
          memorize.save();
        });
        res.json(result);
      }
    });
};


exports.tmp = function (req, res) {
  var id = req.body.id || null;
  var remembered = req.body.remembered || null;
  if (!id) {
    return res.status(422).send({
      message: 'id null'
    });
  }
  var condition = {
    $and: [
      { 'user': req.user },
      { 'words.word': id }]
  };
  Memorize.find(condition)
    .sort('-updated').exec(function (error, result) {
      if (error) {
        return res.status(422).send({
          message: error
        });
        // reject(error);
      } else {
        result.forEach(memorize => {
          memorize.words.forEach(item => {
            // console.log('word', item.word, id);
            if (item.word === id) {
              item.memorize = remembered;
              console.log('word', item.word, id);
            }
          });
          memorize.save();
        });
        res.json(result);
        // resolve(result);
      }
    });
};

function getMemorizes(user, cardIds) {
  return new Promise(function (resolve, reject) {
    var condition = {
      $and: [{ 'user': user }, { 'card': cardIds }]
    };
    Memorize.findOne(condition)
      .sort('-updated').populate('words.word').exec(function (error, result) {
        if (error) {
          reject(error);
        } else {
          if (result) {
            result.updated = Date.now();
            result.save();
          }
          resolve(result);
        }
      });
  });
}

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
    var strings = word.split('\t');
    var front = strings[0];
    var back = strings[1];
    promises.push(createWord(front, back, card, user));
  });
  return Promise.all(promises);
}

function getWordsByCardIds(cardIds) {
  return new Promise(function (resolve, reject) {

    Word.find({ 'card': { $in: cardIds } })
      .sort('-created').exec(function (err, words) {
        if (err) {
          reject(err);
        } else {
          resolve(words);
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
