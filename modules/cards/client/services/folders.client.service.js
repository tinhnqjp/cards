(function () {
  'use strict';
  angular
    .module('folders.services', [])
    .factory('FoldersService', FoldersService)
    .factory('FoldersApi', FoldersApi);

  FoldersService.$inject = ['$resource', '$log'];

  function FoldersService($resource, $log) {
    var Folder = $resource('/api/folders/:folderId', { folderId: '@_id' }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Folder.prototype, {
      createOrUpdate: function () {
        var folder = this;
        return createOrUpdate(folder);
      }
    });

    return Folder;

    function createOrUpdate(folder) {
      if (folder._id) {
        return folder.$update(onSuccess, onError);
      } else {
        return folder.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(folder) {
        // Any required internal processing from inside the service, goes here.
      }

      // Handle error response
      function onError(errorResponse) {
        var error = errorResponse.data;
        // Handle error internally
        handleError(error);
      }
    }

    function handleError(error) {
      // Log error
      $log.error(error);
    }
  }

  FoldersApi.$inject = ['$http'];
  function FoldersApi($http) {
    this.listCards = function (folderId, keyword) {
      return $http.get('/api/folders/' + folderId + '/cards', { keyword: keyword }, { ignoreLoadingBar: true });
    };

    return this;
  }

}());
