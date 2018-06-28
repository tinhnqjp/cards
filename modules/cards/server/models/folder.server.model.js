'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  relationship = require('mongoose-relationship');

var FolderSchema = new Schema({
  created: { type: Date, default: Date.now },
  title: { type: String, default: '', trim: true },
  cards: [{ type: Schema.ObjectId, ref: 'Card' }],
  user: { type: Schema.ObjectId, ref: 'User' }
});

mongoose.model('Folder', FolderSchema);
