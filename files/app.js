(function() {
    //start of function
  var app = angular.module('formatter', []);
  app.factory('linesFile', function() {
    var linesFile = {};
    return linesFile;
  }); //end of service
  app.controller('lineDisplay',['$scope', function($scope) {
          this.select = function(){
            console.log("selected");
          }
    }]) //end of controller
  app.controller('aideCtrl',[ function() {
//toggle text block
      this.txtblock = 0;
      this.toggle = function(){
        if(this.txtblock == 0){
            return this.txtblock = 1;
        }
        else {
            return this.txtblock = 0;
        }
      };
      this.toggledOn = function(){
          return this.txtblock === 1;
      };
//toggle right bar
      this.rbar = 0;
      this.toggle2 = function(){
        if(this.rbar == 0){
            return this.rbar = 1;
        }
        else {
            return this.rbar = 0;
        }
      };
      this.toggledOn2 = function(){
          return this.rbar === 1;
      };
    }]) //end of controller
  //end of function
})();