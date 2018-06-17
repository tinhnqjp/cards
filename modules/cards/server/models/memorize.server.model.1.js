'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  path = require('path'),
  config = require(path.resolve('./config/config')),
  chalk = require('chalk');

/**
 * Memorize Schema
 */
var MemorizeSchema = new Schema({
  words: [{
    word: { type: Schema.ObjectId, ref: 'Word' },
    memorize: { type: Number, default: 0 }
  }],
  current_quiz: { type: Number, default: 1 },
  current_filter: { type: Number, default: 1 },
  card: [{ type: Schema.ObjectId, ref: 'Card' }],
  user: { type: Schema.ObjectId, ref: 'User' }
});

mongoose.model('Memorize', MemorizeSchema);

