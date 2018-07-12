'use strict';

/**
 * Module dependencies
 */
var rooms = require('../controllers/rooms.server.controller');

module.exports = function (app) {
  // Cards collection routes
  app.route('/api/rooms')
    .get(rooms.list)
    .post(rooms.create);

  // Single card routes
  app.route('/api/rooms/:roomId')
    .put(rooms.update)
    .delete(rooms.delete);

  // Finish by binding the card middleware
  app.param('roomId', rooms.roomByID);
};
