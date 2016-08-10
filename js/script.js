var extension = angular.module('cmdPalette', ['ngSanitize']);

  /*Disabling or Enabling Debug Data based on user preferences*/
    extension.config(['$compileProvider', function ($compileProvider) {
       $compileProvider.debugInfoEnabled(studio.getPreferences("commandPalette.debugMode") == true ? true : false);
    }]);

  extension.controller('MainController', function ($scope, $http, $filter) {

    /*SET USER PREFERENCES*/
    $scope.toggleDebugMode = function(){
      studio.setPreferences("commandPalette.debugMode", $scope.isEnabled);
    }
    $scope.value = studio.getPreferences("commandPalette.debugMode");
    /***********/

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

if(txtInput)
   txtInput.onkeydown = function (event) {

        switch (event.keyIdentifier) {

       case 'Enter':

          exec($scope.commands[$scope.selectedCommand].name);
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
