(function () {
  'use strict';

  angular
    .module('core')
    .controller('HeaderController', HeaderController);

  HeaderController.$inject = ['$scope', '$state', 'Authentication', 'menuService', 'FoldersService'];

  function HeaderController($scope, $state, Authentication, menuService, FoldersService) {
    var vm = this;

    vm.accountMenu = menuService.getMenu('account').items[0];
    vm.authentication = Authentication;
    vm.isCollapsed = false;
    vm.menu = menuService.getMenu('topbar');
    vm.menuFolders = FoldersService.query();

    $scope.$on('$stateChangeSuccess', stateChangeSuccess);

    function stateChangeSuccess() {
      vm.menuFolders = FoldersService.query();
      // Collapsing the menu after navigation
      vm.isCollapsed = false;
    }
  }
}());
