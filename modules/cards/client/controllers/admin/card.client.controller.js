(function () {
  'use strict';

  angular
    .module('cards.admin')
    .controller('CardsAdminController', CardsAdminController);

  CardsAdminController.$inject = ['$scope', '$state', '$window', 'cardResolve', 'Authentication', 'Notification', '$uibModal'];

  function CardsAdminController($scope, $state, $window, card, Authentication, Notification, $uibModal) {
    var vm = this;
    vm.card = card;
    vm.authentication = Authentication;
    vm.form = {};
    vm.content;
    initData();

    function initData () {
      if (!vm.card.words) {
        vm.card.words = [];
      }
      for (var index = 1; index <= 5; index++) {
        vm.card.words.push({
          front: '',
          back: ''
        });
      }
    };

    vm.pushWord = function () {
      vm.card.words.push({
        front: '',
        back: ''
      });
    };

    vm.removeWord = function (_item) {
      var index = vm.card.words.indexOf(_item);
      $scope.handleShowConfirm({
        message: 'Are you sure you want to delete?'
      }, function () {
        vm.card.words.splice(index, 1);
      });
    };

    // Save Card
    vm.save = function (isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.cardForm');
        return false;
      }
      for (var index = vm.card.words.length -1; index >= 0; index--) {
        var word = vm.card.words[index];
        if(!word.front && !word.back) {
          vm.card.words.splice(index, 1);
        }
      }

      // Create a new card, or update the current instance
      vm.card.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        // $state.go('admin.cards.list'); // should we send the User to the list or the updated Card's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Card saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Card save error!' });
      }
    }


    vm.openModal = function () {
      // init modal
      var modalInstance = $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'myModalContent.html',
        controller: 'ModalInstanceCtrl',
        controllerAs: '$ctrl',
        size: 'lg',
        resolve: {
          content: function () {
            return vm.content;
          }
        }
      });

      modalInstance.result.then(function (content) {
        vm.content = content;

        if (vm.content) {
          var arrWords = vm.content.split("\n\n");
          arrWords.forEach(word => {
            var arrString = word.split("\t");
            vm.card.words.push({
              front: arrString[0].trim(),
              back: arrString[1].trim()
            });
            console.log(arrString);
          });
        }
      });

      console.log(vm.content);
    };

  }

  angular.module('cards.admin').controller('ModalInstanceCtrl', function ($uibModalInstance, content) {
    var $ctrl = this;
    $ctrl.content = content;
    /**
     * when click button 決定 in modal
     * @param {*} content selected
     */
    $ctrl.ok = function () {
      $uibModalInstance.close($ctrl.content);
    };

    /**
     * when click button 閉じる in modal
     */
    $ctrl.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  });
}());
