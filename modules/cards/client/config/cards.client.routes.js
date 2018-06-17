(function () {
  'use strict';

  angular
    .module('cards.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('cards', {
        abstract: true,
        url: '/cards',
        template: '<ui-view/>'
      })
      .state('cards.list', {
        url: '',
        templateUrl: '/modules/cards/client/views/list-cards.client.view.html',
        controller: 'CardsListController',
        controllerAs: 'vm'
      })
      .state('cards.view', {
        url: '/:cardId',
        templateUrl: '/modules/cards/client/views/view-card.client.view.html',
        controller: 'CardsController',
        controllerAs: 'vm',
        resolve: {
          cardResolve: getCard
        },
        data: {
          pageTitle: '{{ cardResolve.title }}'
        }
      });
  }

  getCard.$inject = ['$stateParams', 'CardsService'];

  function getCard($stateParams, CardsService) {
    return CardsService.get({
      cardId: $stateParams.cardId
    }).$promise;
  }
}());
