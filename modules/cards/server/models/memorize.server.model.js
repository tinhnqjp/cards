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
  // 00: random 0 & filter 0
  // 11: random 1 & filter 1
  current_quiz00: { type: Number, default: 1 },
  current_quiz10: { type: Number, default: 1 },
  current_quiz01: { type: Number, default: 1 },
  current_quiz11: { type: Number, default: 1 },
  
  card: [{ type: Schema.ObjectId, ref: 'Card' }],
  user: { type: Schema.ObjectId, ref: 'User' },
  updated: { type: Date, default: Date.now },
  created: { type: Date, default: Date.now }
});

mongoose.model('Memorize', MemorizeSchema);

