(function (app) {
  'use strict';

  app.registerModule('cards', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('cards.admin', ['core.admin']);
  app.registerModule('cards.admin.routes', ['core.admin.routes']);
  app.registerModule('cards.services');
  app.registerModule('cards.routes', ['ui.router', 'core.routes', 'cards.services']);
}(ApplicationConfiguration));
