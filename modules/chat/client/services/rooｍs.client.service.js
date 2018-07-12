(function () {
  'use strict';

  angular
    .module('chat.services')
    .factory('RoomsService', RoomsService).factory('RoomsApi', RoomsApi);

  RoomsService.$inject = ['$resource', '$log'];

  function RoomsService($resource, $log) {
    var Room = $resource('/api/rooms/:roomId', { roomId: '@_id' }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Room.prototype, {
      createOrUpdate: function () {
        var room = this;
        return createOrUpdate(room);
      }
    });

    return Room;

    function createOrUpdate(room) {
      if (room._id) {
        return room.$update(onSuccess, onError);
      } else {
        return room.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(room) {
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

  RoomsApi.$inject = ['$http'];
  function RoomsApi($http) {

    this.copy = function (roomId) {
      return $http.post('/api/rooms/' + roomId + '/copy', null, { ignoreLoadingBar: true });
    };
    this.play = function (ids) {
      return $http.post('/api/play', { ids: ids }, { ignoreLoadingBar: true });
    };
    this.remembered = function (id, remembered) {
      return $http.post('/api/remembered', { id: id, remembered: remembered }, { ignoreLoadingBar: true });
    };
    this.latest = function (input) {
      return $http.post('/api/latest', input, { ignoreLoadingBar: true });
    };
    this.current = function (id, random, filter, quiz) {
      return $http.post('/api/current', { id: id, random: random, filter: filter, quiz: quiz }, { ignoreLoadingBar: true });
    };
    return this;
  }

}());
