(function () {
  'use strict';

  angular
    .module('core')
    .controller('AppController', AppController);

  AppController.$inject = ['$scope', 'CardsService', 'CardsApi', '$location', '$state', '$stateParams', 'ngDialog'];

  function AppController($scope, CardsService, CardsApi, $location, $state, $stateParams, ngDialog) {
    var vm = this;
    $scope.curQuiz;
    $scope.isFlipped = [];
    $scope.memorize;
    $scope.listQuiz = [];
    $scope.listQuizTmp = [];
    $scope.isSpeed = false;
    $scope.ids;
    $scope.hideBtnRandom = false;

    $scope.initData = function () {
      $scope.ids = $location.search().id;
      // console.log($scope.ids);
      CardsApi.play($scope.ids).then(function (res) {
        $scope.memorize = res.data;
        var list = res.data.words.slice();
        list.sort(function (a, b) {
          if (a.word.card === b.word.card) {
            return a.word.index - b.word.index;
          }
          return a.word.card > b.word.card ? 1 : -1;
        });

        $scope.listQuiz = list.slice();
        $scope.listQuizTmp = list.slice();
        // reset
        $scope.curQuiz = getCurQuiz();
        $scope.hideBtnRandom = false;
      });

      if ($scope.curQuiz > $scope.listQuiz.length) {
        var list = _.where($scope.listQuizTmp.slice(), { memorize: 1 });
        $scope.termRemember = list.length;
      }
    };

    $scope.termRemember = 0;
    $scope.next = function () {
      console.log($scope.curQuiz);
      if ($scope.curQuiz <= $scope.listQuiz.length) {
        $scope.curQuiz++;
        setCurQuiz();
      } else {
        var list = _.where($scope.listQuizTmp.slice(), { memorize: 1 });
        console.log(list.length);
        $scope.termRemember = list.length;
      }
    };

    $scope.prev = function () {
      if ($scope.curQuiz > 1) {
        $scope.curQuiz--;
        setCurQuiz();
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
      var state = $state.current.name;
      if (state === 'admin.cards.play') {
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
          $scope.rememberIt(quiz, level);
        }
      }
    };

    $scope.rememberIt = function (quiz, level = 0) {
      event.stopPropagation();
      quiz.memorize = level;
      CardsApi.remembered(quiz.word._id, level).then(function (res) {
        console.log('rememberIt', quiz.word._id, level);
      });
    };

    $scope.isRandom = 0;
    $scope.random = function (isRandom) {
      $scope.isRandom = isRandom;
      $scope.listQuiz = processFilterRandom($scope.isFilter, $scope.isRandom, $scope.listQuizTmp);
      if (isRandom === 1) {
        $scope.hideBtnRandom = true;
      } else {
        $scope.hideBtnRandom = false;
      }
      // reset
      $scope.curQuiz = getCurQuiz();
    };

    $scope.hideBtnFilter = false;
    $scope.isFilter = 0;
    $scope.filter = function (isFilter) {
      $scope.isFilter = isFilter;
      $scope.listQuiz = processFilterRandom($scope.isFilter, $scope.isRandom, $scope.listQuizTmp);
      if (isFilter === 1) {
        $scope.hideBtnFilter = true;
      } else {
        $scope.hideBtnFilter = false;
      }
      // reset
      $scope.curQuiz = getCurQuiz();
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
    };

    /** private method */
    function processFilterRandom(isFilter, isRandom, listQuiz) {
      var list;
      if (isFilter === 1 && isRandom === 1) {
        list = _.where(listQuiz.slice(), { memorize: 1 });
        return list.sort(function (a, b) { return 0.5 - Math.random(); });
      } else if (isFilter === 1) {
        return _.where(listQuiz.slice(), { memorize: 1 });
      } else if (isRandom === 1) {
        list = listQuiz.slice();
        return list.sort(function (a, b) { return 0.5 - Math.random(); });
      } else {
        return listQuiz.slice();
      }
    }

    function getCurQuiz() {
      if ($scope.isRandom === 1 && $scope.isFilter === 1) {
        return $scope.memorize.current_quiz11;
      } else if ($scope.isRandom === 1 && $scope.isFilter === 0) {
        return $scope.memorize.current_quiz10;
      } else if ($scope.isRandom === 0 && $scope.isFilter === 1) {
        return $scope.memorize.current_quiz01;
      } else {
        return $scope.memorize.current_quiz00;
      }
    }

    $scope.isBusy = false;
    function setCurQuiz() {
      if (!$scope.isBusy) {
        $scope.isBusy = true;
        CardsApi.current($scope.memorize._id, $scope.isRandom, $scope.isFilter, $scope.curQuiz)
          .then(function (res) {
            $scope.memorize.current_quiz00 = res.data.current_quiz00;
            $scope.memorize.current_quiz10 = res.data.current_quiz10;
            $scope.memorize.current_quiz01 = res.data.current_quiz01;
            $scope.memorize.current_quiz11 = res.data.current_quiz11;
            $scope.isBusy = false;
          });
      }
    }
    /** private method */
  }

  /** filter */
  angular
    .module('core')
    .filter('breakLine', function () {
      return function (text) {
        return text.replace(/\n/g, '<br/>');
      };
    })
    .filter('formatdate', function ($filter) {
      return function (timestamp) {
        var currentDate = new Date();
        var toFormat = new Date(timestamp);
        if (toFormat.getDate() === currentDate.getDate()
          && toFormat.getMonth() === currentDate.getMonth()
          && toFormat.getFullYear() === currentDate.getFullYear()) {
          return 'Today ' + $filter('date')(toFormat.getTime(), 'H:mma');
        }
        if (toFormat.getDate() === (currentDate.getDate() - 1)
          && toFormat.getMonth() === currentDate.getMonth()
          && toFormat.getFullYear() === currentDate.getFullYear()) {
          return 'Yesterday ' + $filter('date')(toFormat.getTime(), 'H:mma');
        }

        return $filter('date')(toFormat.getTime(), 'EEEE H:mma');
      };
    }).filter('highlight', function ($sce) {
      return function (text, phrase) {
        if (phrase) {
          text = text.replace(new RegExp('(' + phrase + ')', 'gi'), '<span class="highlighted">$1</span>');
        }
        return $sce.trustAsHtml(text);
      };
    });
})();
