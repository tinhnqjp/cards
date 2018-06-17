'use strict';

/**
 * Module dependencies
 */
var cardsPolicy = require('../policies/cards.server.policy'),
  cards = require('../controllers/cards.server.controller');

module.exports = function (app) {
  // Cards collection routes
  app.route('/api/cards').all(cardsPolicy.isAllowed)
    .get(cards.list)
    .post(cards.create);

  // Single card routes
  app.route('/api/cards/:cardId').all(cardsPolicy.isAllowed)
    .get(cards.read)
    .put(cards.update)
    .delete(cards.delete);

  app.route('/api/cards/:cardId/copy')
    .post(cards.copy);

  // Finish by binding the card middleware
  app.param('cardId', cards.cardByID);

  app.route('/api/play').get(cards.play);
  app.route('/api/tmp').post(cards.tmp);

};
