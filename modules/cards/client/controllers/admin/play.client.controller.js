(function () {
  'use strict';

  angular
    .module('cards.admin')
    .controller('PlayAdminController', PlayAdminController);

  PlayAdminController.$inject = ['$scope', 'CardsService', 'CardsApi'];
  function PlayAdminController($scope, CardsService, CardsApi) {
    var vm = this;
    vm.form = {};
    
  }
}());
