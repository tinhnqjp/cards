'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  path = require('path'),
  config = require(path.resolve('./config/config')),
  chalk = require('chalk');

var CardSchema = new Schema({
  created: { type: Date, default: Date.now },
  title: { type: String, default: '', trim: true },
  words: [{ type: Schema.ObjectId, ref: 'Word' }],
  user: { type: Schema.ObjectId, ref: 'User' }
});

mongoose.model('Card', CardSchema);

