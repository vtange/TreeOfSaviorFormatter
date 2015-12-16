(function() {
    //start of function
  var app = angular.module('formatter', []);
  app.factory('linesFile', function() {
    var linesFile = {};
	  linesFile.file1 = [];
	  linesFile.file2 = [];
    return linesFile;
  }); //end of service
  app.controller('lineDisplay',['$scope', '$compile', '$sce', 'linesFile', function($scope, $compile, $sce, linesFile) {
	var linesFile = linesFile;
    ////////////////  file upload
    var generateTable = function(eventTarget){
		            var table = $("<table></table>");
                    var rows = eventTarget.target.result.split("\n");
                    for (var i = 0; i < rows.length; i++) {
                        var row = $('<tr data-ng-click="select($event)"></tr>');
                        row.html(rows[i]);
                        table.append(row);
                    }
                    $("#editor").html('');
                    $compile(table)($scope)  // links ^ dynamic html to controller.
                    $("#editor").append(table);
	}
	var generateTable_drop = function(eventTarget){
        // let's just work with one file
        var file = eventTarget.dataTransfer.files[0];
        var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.tsv|.csv|.txt)$/;
        //console.log("Type: " + file.type);                        for debug use
        //console.log(regex.test(file.name.toLowerCase()));
        if (regex.test(file.name.toLowerCase())) {
                    var reader = new FileReader();

                    reader.onload = function(e) {
                            generateTable(e);
                    }

                    reader.readAsText(file);
        } else {
        alert("Please upload a valid CSV file.");
        }
	}
	var generateTableAng = function(eventTarget, side){
                    linesFile.file1 = eventTarget.target.result.split("\n");
					//remove dropzone, depend on side (editor will generate via ngrepeat)
					if(side === 1){$( "#drop-zone" ).remove();}
					else{$( "#drop-zone2" ).remove();}
	}
    $("#upload").on("click", function () {
        var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.tsv|.csv|.txt)$/;
        if (regex.test($("#fileUpload").val().toLowerCase())) {
            if (typeof (FileReader) != "undefined") {
                var reader = new FileReader();
                reader.onload = function (e) {
                    generateTableAng(e,1);
                }
                reader.readAsText($("#fileUpload")[0].files[0]);
            } else {
                alert("This browser does not support HTML5.");
            }
        } else {
            alert("Please upload a valid CSV file.");
        }
    });
    $("#upload2").on("click", function () {
        var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.tsv|.csv|.txt)$/;
        if (regex.test($("#fileUpload2").val().toLowerCase())) {
            if (typeof (FileReader) != "undefined") {
                var reader = new FileReader();
                reader.onload = function (e) {
                    generateTableAng(e,2);
                }
                reader.readAsText($("#fileUpload2")[0].files[0]);
            } else {
                alert("This browser does not support HTML5.");
            }
        } else {
            alert("Please upload a valid CSV file.");
        }
    });

    ////////////////  drag and drop
	// prevent missed drops == load file
    var page = document.querySelector("html");
	page.addEventListener("dragover", function(e) {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = "none";
    }, false);
    page.addEventListener("drop", function(e) {
        e.preventDefault();
        e.stopPropagation();
    }, false);

	//dropzone1 upload
    var dropzone = document.querySelector("#drop-zone");

    dropzone.addEventListener('dragleave', function (e) {
        if ($("#drop-zone").hasClass("onTop")) {
            $("#drop-zone").removeClass("onTop")
        }
    });

    dropzone.addEventListener("dragover", function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (!$("#drop-zone").hasClass("onTop")) {
            $("#drop-zone").addClass("onTop")
        }
        e.dataTransfer.dropEffect = "copy";//mouse icon
    }, false);

    dropzone.addEventListener("drop", function(e) {
        e.preventDefault();
        e.stopPropagation();
        if ($("#drop-zone").hasClass("onTop")) {
            $("#drop-zone").removeClass("onTop")
        }
		generateTable_drop(e)
    }, false);
	  
	  
	//dropzone2 upload
    var dropzone2 = document.querySelector("#drop-zone2");

    dropzone2.addEventListener('dragleave', function (e) {
        if ($("#drop-zone2").hasClass("onTop")) {
            $("#drop-zone2").removeClass("onTop")
        }
    });

    dropzone2.addEventListener("dragover", function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (!$("#drop-zone2").hasClass("onTop")) {
            $("#drop-zone2").addClass("onTop")
        }
        e.dataTransfer.dropEffect = "copy";//mouse icon
    }, false);

    dropzone2.addEventListener("drop", function(e) {
        e.preventDefault();
        e.stopPropagation();
        if ($("#drop-zone2").hasClass("onTop")) {
            $("#drop-zone2").removeClass("onTop")
        }
        generateTable_drop(e)
    }, false);

      ////////////////  selected line preparation for dialog box
        $scope.stuff = "";
        $scope.dialogvers = "";
        $scope.questvers = "";
        $scope.trustedHtml = "";
        $scope.trustedHtml2 = "";
          $scope.select = function(e) {
              $('tr').removeClass()
              $(e.target).addClass("selected-line");
            $scope.stuff = $(e.target).html().replace(/\w+_\d+[\s+\t](?:\{memo X\})?\$?(.+)/, '$1'); // get text, get rid of memo x
            $scope.stuff = $scope.stuff.replace(/{nl}/g, '<br>')//replace {nl}s with brs
            $scope.dialogvers = $scope.stuff.replace(/([\w\s\d-+;|,.!&'"\?]{120})/g, '$1<br>')//break every 120
            $scope.dialogvers = $scope.dialogvers.replace(/([\w\s\d-+;|,.!&'"\?]{90})/g, '$1<br>')//now break again every 90
            $scope.questvers = $scope.stuff.replace(/([\w\s\d-+;|,.!&'"\?]{45})/g, '$1<br>')//break every 120
            $scope.trustedHtml = $sce.trustAsHtml($scope.dialogvers); // required to ng-bind to index.html -> security check for txt-block
            $scope.trustedHtml2 = $sce.trustAsHtml($scope.questvers); // required to ng-bind to index.html -> security check for right-bar quest desc
        };
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