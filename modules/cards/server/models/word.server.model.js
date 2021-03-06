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
 * Word Schema
 */
var WordSchema = new Schema({
  created: { type: Date, default: Date.now },
  index: { type: Number, default: 0 },
  front: { type: String, default: '', trim: true },
  back: { type: String, default: '', trim: true },
  back_line1: { type: String, default: '', trim: true },
  back_line2: { type: String, default: '', trim: true },
  back_line3: { type: String, default: '', trim: true },
  card: { type: Schema.ObjectId, ref: 'Card' },
  user: { type: Schema.ObjectId, ref: 'User' }
});

mongoose.model('Word', WordSchema);

