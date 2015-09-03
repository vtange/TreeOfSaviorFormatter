(function() {
    //start of function
  var app = angular.module('formatter', ['filters']);
  app.factory('linesFile', function() {
    var linesFile = {};
    linesFile.monstall = monstall;
    linesFile.modelObject = {};
    return linesFile;
  }); //end of service
  app.controller('lineDisplay',['$scope','linesFile', function($scope, linesFile) {
//monsterDb -> get database, get model object
    $scope.linesFile = linesFile;
    }]) //end of controller
  //end of function
})();