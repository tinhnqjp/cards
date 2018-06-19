(function () {
  'use strict';

  angular
    .module('cards.admin')
    .controller('CardsAdminListController', CardsAdminListController);

  CardsAdminListController.$inject = ['CardsService', 'CardsApi', '$scope', '$state', '$window',
    'Authentication', '$window', 'Notification'];

  function CardsAdminListController(CardsService, CardsApi, $scope, $state, $window, Notification) {
    var vm = this;
    vm.currentPage = 1;
    vm.pageSize = 15;
    vm.offset;
    vm.cards = [];
    initData();

    function initData() {
      vm.offset = (vm.currentPage - 1) * vm.pageSize;
      var input = { page: vm.currentPage, limit: vm.pageSize, keyword: vm.keyword };
      console.log(input);
      CardsService.get(input, function (output) {
        vm.cards = output.laws;
        vm.totalItems = output.total;
        vm.currentPage = output.current;

      });

    }

    vm.pageChanged = function () {
      $state.transitionTo('admin.cards.play', { id: "5b23951384ab4653f841b49a" }, { notify: false });
      // $state.go('admin.cards.play({id: "5b23951384ab4653f841b49a"})');
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
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> データの削除が完了しました。' });
        });
      });
    };

    vm.copy = function (_card) {
      $scope.handleShowConfirm({
        message: 'Are you sure you want to copy?'
      }, function () {
        vm.busy = true;
        CardsApi.copy(_card._id)
          .then(function (res) {
            vm.busy = false;
            initData();
            Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> データのコピーが完了しました。' });
          })
          .catch(function (res) {
            console.log(res);
            vm.busy = false;
            Notification.error({ message: '<i class="glyphicon glyphicon-ok"></i> データのコピーが失敗しました。' });
          });
      });
    };
  }
}());
