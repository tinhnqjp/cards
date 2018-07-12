(function () {
  'use strict';

  angular
    .module('cards.admin')
    .controller('FolderAdminListController', FolderAdminListController);

  FolderAdminListController.$inject = ['FoldersApi', 'folderResolve', '$scope', '$state', 'Notification'];

  function FolderAdminListController(FoldersApi, folder, $scope, $state, Notification) {
    var vm = this;
    vm.folder = folder;
    vm.cards = [];
    initData();

    function initData() {
      console.log(vm.folder);
      var input = { keyword: vm.keyword };
      FoldersApi.listCards(vm.folder._id, input).then(function (res) {
        vm.cards = res.data;
      });
    }

    vm.search = function () {
      initData();
    };

    vm.remove = function (_card) {
      $scope.handleShowConfirm({
        message: 'Are you sure you want to delete?'
      }, function () {
        vm.folder.$remove(function () {
          $state.go('admin.latest');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Folder deleted successfully!' });
        });
      });
    };
  }
}());
