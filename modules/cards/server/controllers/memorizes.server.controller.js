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
 * List of latest
 */
exports.latest = function (req, res) {
  var condition = {
    user: req.user
  };
  Memorize
    .find(condition)
    .sort('-created')
    .populate('card', 'title')
    .exec(function (err, results) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        var array = [];
        if (results.length > 0) {
          results.forEach(memorize => {
            // sum memorize
            var sum_memorize = 0;
            memorize.words.forEach(word => {
              sum_memorize = sum_memorize + word.memorize;
            });

            // title
            var isGroup = 0;
            var title = '';
            var param = [];
            if (memorize.card.length > 1) {
              isGroup = 1;
              memorize.card.forEach((card, index, array) => {
                title += card.title;
                param.push(card._id);
                if (index !== (array.length - 1)) {
                  title += '\n';
                }
              });
            } else {
              title = memorize.card[0] ? memorize.card[0].title : '';
              param.push(memorize.card[0] ? memorize.card[0]._id : '');
            }
            // param

            var _memorize = {
              _id: memorize._id,
              isGroup: isGroup,
              title: title,
              param: param,
              current: memorize.current,
              words: memorize.words.length,
              memorize: sum_memorize,
              created: memorize.created,
            };
            array.push(_memorize);
          });
        } else {

        }
        res.json(array);
      }
    });
};

/**
 * List of latest
 */
exports.current = function (req, res) {
  var id = req.body.id || null;
  var random = req.body.random || 0;
  var filter = req.body.filter || 0;
  var quiz = req.body.quiz || 1;

  Memorize.findById(new mongoose.Types.ObjectId(id))
    .sort('-updated')
    .exec(function (err, memorize) {
      if (memorize) {
        if (random === 1 && filter === 1) {
          memorize.current_quiz11 = quiz;
        } else if (random === 1 && filter === 0) {
          memorize.current_quiz10 = quiz;
        } else if (random === 0 && filter === 1) {
          memorize.current_quiz01 = quiz;
        } else {
          memorize.current_quiz00 = quiz;
        }
        memorize.save();
      }

      res.json(memorize);
    });
};