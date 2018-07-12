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
  app.route('/api/cards/:cardId/chooseFolder').post(cards.chooseFolder);

  // Finish by binding the card middleware
  app.param('cardId', cards.cardByID);

  app.route('/api/play').post(cards.play);
  app.route('/api/remembered').post(cards.remembered);
  app.route('/api/tmp').post(cards.tmp);

  // memories
  app.route('/api/latest').post(memorizes.latest);
  app.route('/api/current').post(memorizes.current);

  // folders
  app.route('/api/folders').all(cardsPolicy.isAllowed)
    .get(folders.list)
    .post(folders.create);
  // /api/folders/5b46c48838139a2b9c4acf40
  app.route('/api/folders/:folderId')
    .all(cardsPolicy.isAllowed)
    .get(folders.read)
    .put(folders.update)
    .delete(folders.delete);
  app.route('/api/folders/:folderId/cards')
    .get(folders.listCards);
  app.param('folderId', folders.folderByID);

  app.route('/api/folderadd').post(folders.addcard);
};
