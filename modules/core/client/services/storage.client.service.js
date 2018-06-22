(function () {
  'use strict';

  // Create the Socket.io wrapper service
  angular
    .module('core')
    .factory('StorageService', StorageService);

  StorageService.$inject = ['localStorageService'];

  function StorageService(localStorageService) {
    var service = {
      removeItem: removeItem,
      clearAll: clearAll,
      getItem: getItem,
      setItem: setItem
    };

    return service;

    function removeItem(key) {
      return localStorageService.remove(key);
    }

    function clearAll() {
      return localStorageService.clearAll();
    }

    function getItem(key) {
      return localStorageService.get(key);
    }

    function setItem(key, val) {
      return localStorageService.set(key, val);
    }
  }
}());
