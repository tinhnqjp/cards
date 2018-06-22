(function () {
  'use strict';

  angular
    .module('core')
    .controller('PlayAdminController', PlayAdminController);

  PlayAdminController.$inject = ['$scope', 'CardsService', 'CardsApi', '$location', '$uibModal', 'StorageService'];
  function PlayAdminController($scope, CardsService, CardsApi, $location, $uibModal, StorageService) {
    var vm = this;
    vm.form = {};
    $scope.initData();

    $scope.setting = function () {
      vm.setting = {
        list: ['front', 'back'],
        front: [],
        back: []
      };
      // init modal
      var modalInstance = $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'setting.html',
        controller: 'ModalInstanceCtrl',
        controllerAs: '$ctrl',
        size: 'lg',
        resolve: {
          setting: function () {
            return vm.setting;
          }
        }
      });

      modalInstance.result.then(function (setting) {
        vm.setting = setting;
        StorageService.setItem('setting', vm.setting)
      });
    };
    // end controller
  }
  angular
    .module('core')
    .controller('ModalInstanceCtrl', function ($uibModalInstance, setting) {
      // setting
      var $ctrl = this;
      $ctrl.setting = setting;
      /**
       * when click button 決定 in modal
       * @param {*} content selected
       */
      $ctrl.ok = function () {
        $uibModalInstance.close($ctrl.setting);
      };

      /**
       * when click button 閉じる in modal
       */
      $ctrl.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
    });
}());
