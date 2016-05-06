angular.module('cmdPalette', [])

.controller('MainController', function($scope, $http,$filter) {
    $http.get('js/builtInCmd.json').success(function(data) {
      $scope.commands = data;
      $scope.filterData = function (query){
      $scope.commands = $filter('filter')(data, query)};

    }).error(function(error) {
        studio.extension.quitDialog();
    });

   $scope.closeDialog = function($event) {
        if (event.keyCode === 27) {
            studio.extension.quitDialog();
        }
    }

    $scope.sendCommand = function(cmd) {
      studio.extension.quitDialog();
      studio.sendCommand(cmd);
      }
})


.filter('commandKey', function () {
  return function (input) {
      return input.replace('key', studio.os.isWindows ? 'ctrl':'cmd');
  };
})

.filter('highlight', function() {
    return function(input, selectedWord) {
      if(selectedWord) {
        var pattern = new RegExp(selectedWord, "gi");
        return input.replace(pattern, "<span class='highlighted'>" + selectedWord + "</span>");
      }
      else {
        return input;
      }
    };
});
