(function () {
  'use strict';

  angular
    .module('cards.admin')
    .controller('CardsAdminController', CardsAdminController);

  CardsAdminController.$inject = ['$scope', '$state', '$window', 'cardResolve', 'Authentication', 'Notification'];

  function CardsAdminController($scope, $state, $window, card, Authentication, Notification) {
    var vm = this;

    vm.card = card;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Card
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.card.$remove(function () {
          $state.go('admin.cards.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Card deleted successfully!' });
        });
      }
    }

    // Save Card
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.cardForm');
        return false;
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
  }
}());
