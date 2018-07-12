(function () {
  'use strict';

  angular
    .module('chat')
    .controller('ChatController', ChatController);

  ChatController.$inject = ['$scope', '$state', 'Authentication', 'Socket', 'UsersApi', 'Notification', 'RoomsService'];

  function ChatController($scope, $state, Authentication, Socket, UsersApi, Notification, RoomsService) {
    var vm = this;

    vm.messages = [];
    vm.rooms = [];
    vm.onlineUsers = [];
    vm.listUsers = [];
    vm.messageText = '';
    vm.current = { _id: 'abc12345' };

    init();

    function init() {
      // If user is not signed in then redirect back home
      if (!Authentication.user) {
        $state.go('home');
      }

      // Make sure the Socket is connected
      if (!Socket.socket) {
        Socket.connect();
      }

      var roomId = vm.current._id;
      Socket.emit('subscribe', roomId);

      UsersApi.listusers().then((result) => {
        vm.listUsers = result.data;
      }).catch((err) => {
        console.log(err);
      });

      Socket.on('online', function (message) {
        var icon = '<i class="fas fa-circle"> ';
        if (message.type === 'offline') {
          icon = '<i class="far fa-circle"> ';
        }
        Notification.success({ message: icon + message.text });
      });

      vm.rooms = RoomsService.query();
      console.log('​init -> vm.rooms', vm.rooms);

      // Add an event listener to the 'chatMessage' event
      Socket.on('subscribe', function (message) {
        console.log('​init -> subscribe', message);
      });

      Socket.on('private', function (data) {
        var flg = false;
        vm.messages.forEach(item => {
          if (item.room === vm.current._id) {
            flg = true;
            item.datas.push(data);
          }
        });
        if (!flg) {
          vm.messages.push({ room: vm.current._id, datas: [data] });
        }
      });

      Socket.on('init', function (_users) {
        vm.onlineUsers = _users;
        vm.listUsers.forEach(user => {
          var userOnline = _.findWhere(vm.onlineUsers, { username: user.username });
          user.online = false;
          if (userOnline) {
            user.online = true;
            user.socketId = userOnline.socketId;
          }
          console.log(user.username, user.online, user.socketId, userOnline);
        });
      });

      // Remove the event listener when the controller instance is destroyed
      $scope.$on('$destroy', function () {
        Socket.removeListener('chatMessage');
        Socket.removeListener('init');
      });
    }

    vm.chatTo = function (_user) {
      console.log(_user);
      var room = new RoomsService();
      room.title = 'room ' + _user.username + ' & ' + Authentication.user.username;
      room.users = (_user._id);
      room.$save(onSuccess, onError);

      function onSuccess(_room) {
        vm.current = _room;
        var roomId = vm.current._id;
        Socket.emit('subscribe', roomId);
      }

      // Handle error response
      function onError(errorResponse) {
        var error = errorResponse.data;
        console.log('​onError -> error', error);
      }
    };

    vm.sendMessage = function () {
      Socket.emit('send', {
        room: vm.current._id,
        text: vm.messageText
      });
      vm.messageText = '';
    };
  }
}());
