(function () {
  'use strict';

  angular.module('core').controller('AppController', AppController);

  AppController.$inject = ['$scope', 'CardsService', 'CardsApi', '$location', '$state', '$stateParams', 'ngDialog'];

  function AppController($scope, CardsService, CardsApi, $location, $state, $stateParams, ngDialog) {
    var vm = this;
    $scope.curQuiz = 1;
    $scope.isFlipped = [];
    $scope.memorize;
    $scope.listQuiz = [];
    $scope.isSpeed = false;
    $scope.ids;

    $scope.initData = function () {
      $scope.ids = $location.search().id;
      console.log($scope.ids);
      CardsApi.play($scope.ids).then(function (res) {
        $scope.memorize = res.data;
        console.log('​$scope.initData -> $scope.memorize', $scope.memorize);
        $scope.listQuiz = res.data.words;
      });
    }

    $scope.next = function () {
      if ($scope.curQuiz < $scope.listQuiz.length) {
        $scope.curQuiz++;
      }
    };

    $scope.prev = function () {
      if ($scope.curQuiz > 1) {
        $scope.curQuiz--;
      }
    };

    $scope.flipped = function () {
      if ($scope.isFlipped[$scope.curQuiz]) {
        $scope.isFlipped[$scope.curQuiz] = false;
      } else {
        $scope.isFlipped[$scope.curQuiz] = true;
      }
    };

    $scope.sayIt = function (text) {
      event.stopPropagation();
      return new Promise(resolve => {
        var msg = new SpeechSynthesisUtterance();
        msg.text = text;
        msg.lang = 'ja-JA';
        msg.onend = resolve;
        window.speechSynthesis.speak(msg);
      });
    };

    $scope.keypress = function ($event) {
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
      } else if ($event.keyCode === 83) {
        // quiz, level
        var quiz = $scope.listQuiz[$scope.curQuiz - 1];
        var level = 1;
        level = quiz.memorize > 0 ? 0 : 1;
        console.log($scope.listQuiz[$scope.curQuiz - 1], quiz.memorize, level);
        $scope.rememberIt(quiz, level);
      }
    };

    $scope.rememberIt = function (quiz, level = 0) {
      event.stopPropagation();
      quiz.memorize = level;
      CardsApi.remembered(quiz.word._id, level).then(function (res) {
        console.log('rememberIt', quiz.word._id, level);
      });
    };

    $scope.handleShowConfirm = function (content, resolve, reject) {
      $scope.dialog = content;
      ngDialog.openConfirm({
        templateUrl: 'confirmTemplate.html',
        scope: $scope
      }).then(function (res) {
        delete $scope.dialog;
        if (resolve) {
          resolve(res);
        }
      }, function (res) {
        delete $scope.dialog;
        if (reject) {
          reject(res);
        }
      });
    }
  }


  angular.module('core').filter('breakLine', function () {
    return function (text) {
      return text.replace(/\n/g, '<br/>');
    }
  });
})();
