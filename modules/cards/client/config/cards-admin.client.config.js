(function () {
  'use strict';

  // Configuring the cards Admin module
  angular
    .module('cards.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage cards',
      state: 'admin.cards.list'
    });
  }
}());
