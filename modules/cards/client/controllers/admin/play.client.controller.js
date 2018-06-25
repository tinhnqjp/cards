(function() {
  'use strict';

  angular.module('core').controller('PlayAdminController', PlayAdminController);

  PlayAdminController.$inject = [
    '$scope',
    'CardsService',
    'CardsApi',
    '$location',
    'StorageService'
  ];
  function PlayAdminController(
    $scope,
    CardsService,
    CardsApi,
    $location,
    StorageService
  ) {
    var vm = this;
    vm.form = {};
    $scope.initData();

    // end controller
  }
})();
