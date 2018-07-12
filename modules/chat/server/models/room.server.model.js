'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  relationship = require('mongoose-relationship');

var RoomSchema = new Schema({
  created: { type: Date, default: Date.now },
  title: { type: String, default: '', trim: true },
  users: [{ type: Schema.ObjectId, ref: 'User' }]
});

mongoose.model('Room', RoomSchema);
