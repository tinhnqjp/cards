'use strict';

/**
 * Module dependencies
 */
var cardsPolicy = require('../policies/cards.server.policy'),
  cards = require('../controllers/cards.server.controller'),
  folders = require('../controllers/folders.server.controller'),
  memorizes = require('../controllers/memorizes.server.controller');

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

  app.route('/api/play').post(cards.play);
  app.route('/api/remembered').post(cards.remembered);
  app.route('/api/tmp').post(cards.tmp);

  // memories
  app.route('/api/latest').post(memorizes.latest);
  app.route('/api/current').post(memorizes.current);

  // folders
  app.route('/api/folder').all(cardsPolicy.isAllowed)
    .get(folders.list)
    .post(folders.create);
  app.route('/api/folder/:folderId').all(cardsPolicy.isAllowed)
    .put(folders.update)
    .delete(folders.delete);

  app.route('/api/folderadd').post(folders.addcard);
};
