(function () {
  'use strict';

  angular
    .module('cards.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.cards', {
        abstract: true,
        url: '/cards',
        template: '<ui-view/>'
      })
      .state('admin.cards.list', {
        url: '',
        templateUrl: '/modules/cards/client/views/admin/list-cards.client.view.html',
        controller: 'CardsAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.cards.create', {
        url: '/create',
        templateUrl: '/modules/cards/client/views/admin/form-card.client.view.html',
        controller: 'CardsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          cardResolve: newCard
        }
      })
      .state('admin.cards.edit', {
        url: '/:cardId/edit',
        templateUrl: '/modules/cards/client/views/admin/form-card.client.view.html',
        controller: 'CardsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin'],
          pageTitle: '{{ cardResolve.title }}'
        },
        resolve: {
          cardResolve: getCard
        }
      }).state('admin.cards.play', {
        url: '/play?id',
        templateUrl: '/modules/cards/client/views/admin/play-card.client.view.html',
        controller: 'PlayAdminController',
        controllerAs: 'vm'
      });
  }

  getCard.$inject = ['$stateParams', 'CardsService'];

  function getCard($stateParams, CardsService) {
    return CardsService.get({
      cardId: $stateParams.cardId
    }).$promise;
  }

  newCard.$inject = ['CardsService'];

  function newCard(CardsService) {
    return new CardsService();
  }
}());
