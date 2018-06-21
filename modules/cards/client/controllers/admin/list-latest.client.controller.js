(function () {
  'use strict';

  angular
    .module('cards.admin')
    .controller('LatestAdminListController', LatestAdminListController);

  LatestAdminListController.$inject = ['CardsService', 'CardsApi', '$scope', '$state', '$window',
    'Authentication', '$window', 'Notification'];

  function LatestAdminListController(CardsService, CardsApi, $scope, $state, $window, Notification) {
    var vm = this;
    vm.latests = [];
    initData();

    function initData() {
      var input = { keyword: vm.keyword };
      CardsApi.latest(input).then(function (res) {
        vm.latests = res.data;
        console.log(vm.latests);
      });
    }

    vm.search = function () {
      initData();
    };
  }
}());
