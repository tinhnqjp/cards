(function () {
  'use strict';

  angular
    .module('cards.admin')
    .controller('CardsAdminController', CardsAdminController);

  CardsAdminController.$inject = ['$scope', '$state', '$window', 'cardResolve', 'Authentication', 'Notification', '$uibModal', 'FoldersService', 'CardsApi'];

  function CardsAdminController($scope, $state, $window, card, Authentication, Notification, $uibModal, FoldersService, CardsApi) {
    var vm = this;
    vm.card = card;
    vm.authentication = Authentication;
    vm.form = {};
    vm.content;
    vm.folders = [];
    vm.title = 'Create New';
    initData();

    function initData() {
      if (vm.card._id) {
        vm.title = 'Edit';
      }
      createEmptyWords();
    }

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
      spliceEmptyWords();
      // Create a new card, or update the current instance
      vm.card.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);
      console.log(vm.card);

      function successCallback(res) {
        // $state.go('admin.cards.list'); // should we send the User to the list or the updated Card's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Card saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Card save error!' });
      }
    };

    vm.chooseFolder = function () {
      var arrayFolder = FoldersService.query();
      console.log(vm.card.folders);
      // init modal
      var modalInstance = $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'chooseFolderModal.html',
        controller: 'ModalInstanceCtrl',
        controllerAs: '$ctrl',
        resolve: {
          content: {
            folders: arrayFolder,
            ids: vm.card.folders
          }
        }
      });

      modalInstance.result.then(function (selectedItem) {
        // click button folder
        vm.card.folders = selectedItem.ids;
        if (vm.card._id) {
          vm.card.createOrUpdate()
            .then(successCallback)
            .catch(errorCallback);
        }

        function successCallback(res) {
          console.log(res.data);
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Folders add successfully!' });
        }

        function errorCallback(res) {
          Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Folders add error!' });
        }

      }, function (dismiss) {
        if (dismiss === 'addNew') {
          var modalInstanceAdd = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'addFolderModal.html',
            controller: 'ModalInstanceCtrl',
            controllerAs: '$ctrl',
            resolve: {
              content: {
                title: ''
              }
            }
          });

          modalInstanceAdd.result.then(function (content) {
            var folder = new FoldersService();
            folder.title = content.title;
            folder.createOrUpdate()
              .then(successCallback)
              .catch(errorCallback);

            function successCallback(res) {
              Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> folder add new successfully!' });
              vm.chooseFolder();
            }
            function errorCallback(res) {
              Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> folder save error!' });
            }
          });
        }
      });
    };


    vm.importModal = function () {
      // init modal
      var modalInstance = $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'importModal.html',
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
          var arrWords = vm.content.split('\n\n');
          arrWords.forEach(word => {
            var arrString = word.split('\t');
            vm.card.words.push({
              front: arrString[0].trim(),
              back: arrString[1].trim()
            });
            // console.log(arrString);
          });

          spliceEmptyWords();
        }
      });

      // console.log(vm.content);
    };

    /** method private */
    function spliceEmptyWords() {
      for (var index = vm.card.words.length - 1; index >= 0; index--) {
        var word = vm.card.words[index];
        if (!word.front && !word.back) {
          vm.card.words.splice(index, 1);
        }
      }
    }

    function createEmptyWords() {
      if (!vm.card.words || vm.card.words.length === 0) {
        vm.card.words = [];
        for (var index = 1; index <= 5; index++) {
          vm.card.words.push({
            front: '',
            back: ''
          });
        }
      }
    }
    /** method private */

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

    /**
     * when click button add new folder in modal
     */
    $ctrl.addNew = function () {
      $uibModalInstance.dismiss('addNew');
    };
  });
}());
