(function () {
  'use strict';

  angular
    .module('cards.admin')
    .controller('PlayAdminController', PlayAdminController);

  PlayAdminController.$inject = ['$scope', 'CardsService', 'CardsApi', '$location'];
  function PlayAdminController($scope, CardsService, CardsApi, $location) {
    var vm = this;
    vm.form = {};
    $scope.initData();
  }
}());
