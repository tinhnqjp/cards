'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  path = require('path'),
  relationship = require('mongoose-relationship');

var CardSchema = new Schema({
  created: { type: Date, default: Date.now },
  title: { type: String, default: '', trim: true },
  words: [{ type: Schema.ObjectId, ref: 'Word' }],
  folders: [{ type: Schema.ObjectId, ref: 'Folder', childPath: 'cards' }],
  user: { type: Schema.ObjectId, ref: 'User' }
});

CardSchema.plugin(relationship, { relationshipPathName: 'folders' });
mongoose.model('Card', CardSchema);

