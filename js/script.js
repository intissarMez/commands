var extension = angular.module('cmdPalette', ['ngSanitize']);

  /*Disabling Debug Data*/
  extension.config(['$compileProvider', function ($compileProvider) {
    $compileProvider.debugInfoEnabled(false);
  }]);

  extension.controller('MainController', function ($scope, $http, $filter) {
    var data         = [];
    var currentItems = [];
    var txtInput = document.getElementById("queryInput");
    $scope.selectedCommand = 0;

    var exec = function(arg){
        studio.extension.quitDialog();
        studio.sendCommand(arg)
    };

    var filterData = function(query) {
      $scope.commands     = $filter('filter')(data, query);
      currentItems        = document.getElementsByClassName("list-group-item");
      $scope.selectedCommand = 0;
    };


    $http.get('js/builtInCmd.json').success(function (response) {
      $scope.commands = data = response;
    }).error(function (error) {
      studio.extension.quitDialog();
    });

    $scope.closeDialog = function ($event) {

      if (event.keyCode === 27) {
        studio.extension.quitDialog();
      }
    };

   $scope.filterDataResult = function (event) {
      filterData($scope.query);
    };

    $scope.sendCommand = function (cmd) {
        exec(cmd);
    };


   txtInput.onkeydown = function (event) {
      var currentCommand = document.getElementById('command-' +$scope.selectedCommand).value;
      switch (event.keyIdentifier) {
        case 'Enter':
          exec(currentCommand);
          break;
        case "Up":
          event.preventDefault();
          $scope.selectedCommand && $scope.selectedCommand--;
          break;
        case "Down":
          event.preventDefault();
          ($scope.selectedCommand < currentItems.length - 1 ) && $scope.selectedCommand++;
          break;
      }
    }
    filterData("");

  });


  extension.filter('commandKey', function () {
    return function (input) {
      return input.replace('key', studio.os.isWindows ? 'ctrl' : 'cmd');
    };
  })

  extension.filter('highlight', function ($sanitize) {
    return function (input, selectedWord) {
      if (selectedWord) {
        var pattern = new RegExp(selectedWord, "gi");
        return input.replace(pattern, $sanitize("<span class='highlighted'>" + selectedWord + "</span>"));
      }
      else {
        return input;
      }
    };
  });
