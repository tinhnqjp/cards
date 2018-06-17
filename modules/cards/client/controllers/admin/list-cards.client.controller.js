(function () {
  'use strict';

  angular
    .module('cards.admin')
    .controller('CardsAdminListController', CardsAdminListController);

  CardsAdminListController.$inject = ['CardsService', 'CardsApi', '$scope', '$state', '$window', 'Authentication'];

  function CardsAdminListController(CardsService, CardsApi, $scope) {
    var vm = this;
    vm.currentPage = 1;
    vm.pageSize = 15;
    vm.offset;
    vm.cards = [];
    initData();

    function initData() {
      vm.offset = (vm.currentPage - 1) * vm.pageSize;
      var input = { page: vm.currentPage, limit: vm.pageSize, keyword: vm.keyword };
      // console.log(input);
      CardsService.get(input, function (output) {
        vm.cards = output.laws;
        vm.totalItems = output.total;
        vm.currentPage = output.current;
      });
    }

    vm.pageChanged = function () {
      initData();
    };

    vm.search = function () {
      initData();
    };

    vm.remove = function (_card) {
      $scope.handleShowConfirm({
        message: 'この法令を削除します。よろしいですか？'
      }, function () {
        vm.busy = true;
        var card = new CardsService({
          _id: _card._id
        });
        card.$remove(function () {
          vm.busy = false;
          initData();
          $scope.nofitySuccess('法令データの削除が完了しました。');
        });
      });
    };

    vm.copy = function (_card) {
      $scope.handleShowConfirm({
        message: 'この法令データをコピーします。よろしいですか？'
      }, function () {
        vm.busy = true;
        CardsApi.copy(_card._id)
          .then(function (res) {
            vm.busy = false;
            initData();
            $scope.nofitySuccess('法令データのコピーが完了しました。');
          })
          .catch(function (res) {
            vm.busy = false;
            $scope.nofityError('法令データのコピーが失敗しました。');
          });
      });
    };
  }
}());
