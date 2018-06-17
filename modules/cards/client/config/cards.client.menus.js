(function () {
  'use strict';

  angular
    .module('cards')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'cards',
      state: 'cards',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'cards', {
      title: 'List cards',
      state: 'cards.list',
      roles: ['*']
    });
  }
}());
