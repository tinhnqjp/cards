(function () {
  'use strict';

  angular
    .module('cards.admin')
    .controller('CardsAdminListController', CardsAdminListController);

  CardsAdminListController.$inject = ['CardsService', 'CardsApi', '$scope', '$state', '$window',
    'Authentication', '$window', 'Notification'
  ];

  function CardsAdminListController(CardsService, CardsApi, $scope, $state, $window, Notification) {
    var vm = this;
    vm.currentPage = 1;
    vm.pageSize = 50;
    vm.offset;
    vm.cards = [];
    initData();

    function initData() {
      vm.offset = (vm.currentPage - 1) * vm.pageSize;
      var input = {
        page: vm.currentPage,
        limit: vm.pageSize,
        keyword: vm.keyword
      };
      CardsService.get(input, function (output) {
        vm.cards = output.laws;
        vm.totalItems = output.total;
        vm.currentPage = output.current;
      });
    }

    vm.pageChanged = function () {
      // $state.transitionTo('admin.cards.play', { id: "5b23951384ab4653f841b49a" }, { notify: false });
      initData();
    };

    vm.search = function () {
      initData();
    };

    vm.remove = function (_card) {
      $scope.handleShowConfirm({
        message: 'Are you sure you want to delete?'
      }, function () {
        vm.busy = true;
        var card = new CardsService({
          _id: _card._id
        });
        card.$remove(function () {
          vm.busy = false;
          initData();
        });
      });
    };

    vm.chooseFolder = function (card) {

    };
  }
}());
