(function() {
  'use strict';

  angular.module('core').controller('AppController', AppController);

  AppController.$inject = ['$scope', 'CardsService', 'CardsApi', '$location', '$state', '$stateParams'];

  function AppController($scope, CardsService, CardsApi, $location, $state, $stateParams) {
    var vm = this;
    $scope.currentPage = 1;
    $scope.isFlipped = [];
    $scope.listQuestion = [];
    $scope.isSpeed = false;
    $scope.ids = $location.search().id;

    // initData();

    
    $scope.initData = function() {
      CardsApi.play($scope.ids).then(function(res) {
        $scope.listQuestion = res.data;
      });
    }

    $scope.next = function() {
      if ($scope.currentPage < $scope.listQuestion.length) {
        $scope.currentPage++;
      }
    };

    $scope.prev = function() {
      if ($scope.currentPage > 1) {
        $scope.currentPage--;
      }
    };

    $scope.flipped = function() {
      if ($scope.isFlipped[$scope.currentPage]) {
        $scope.isFlipped[$scope.currentPage] = false;
      } else {
        $scope.isFlipped[$scope.currentPage] = true;
      }
    };

    $scope.sayIt = function() {
      return new Promise(resolve => {
        var text = $scope.listQuestion[$scope.currentPage - 1].front;
        console.log(text);
        var msg = new SpeechSynthesisUtterance();
        msg.text = text;
        msg.lang = 'ja-JA';
        msg.onend = resolve;
        window.speechSynthesis.speak(msg);
      });
    };

    $scope.keypress = function($event) {
      console.log($event.keyCode);
      if ($event.keyCode === 38 || $event.keyCode === 32) {
        $scope.flipped();
      } else if ($event.keyCode === 13) {
        $scope.sayIt();
      } else if ($event.keyCode === 39) {
        $scope.next();
      } else if ($event.keyCode === 40) {
        $scope.flipped();
      } else if ($event.keyCode === 37) {
        $scope.prev();
      }
    };

    $scope.memorize = function() {
      
    };

  }
})();
