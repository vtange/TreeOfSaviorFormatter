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
                        var row = $('<tr data-ng-click="lines.select($event)"></tr>');
                        row.html(rows[i]);
                        table.append(row);
                    }
                    $("#editor").html('');
                    $compile(table)($scope)  // links ^ dynamic html to controller.
                    $("#editor").append(table);
	}
	  
	  
    $("#upload").bind("click", function () {
        var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.tsv|.csv|.txt)$/;
        if (regex.test($("#fileUpload").val().toLowerCase())) {
            if (typeof (FileReader) != "undefined") {
                var reader = new FileReader();
                reader.onload = function (e) {
                    generateTable(e);
                }
                reader.readAsText($("#fileUpload")[0].files[0]);
            } else {
                alert("This browser does not support HTML5.");
            }
        } else {
            alert("Please upload a valid CSV file.");
        }
    });

    ////////////////  drag and drop

    var page = document.querySelector("html");
    var dropzone = document.querySelector("#drop-zone");
    var results = document.querySelector("#editor");

    page.addEventListener("dragover", function(e) {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = "none";
    }, false);
    page.addEventListener("drop", function(e) {
        e.preventDefault();
        e.stopPropagation();
    }, false);

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
        e.dataTransfer.dropEffect = "copy";
    }, false);

    dropzone.addEventListener("drop", function(e) {
        e.preventDefault();
        e.stopPropagation();
        if ($("#drop-zone").hasClass("onTop")) {
            $("#drop-zone").removeClass("onTop")
        }
        // let's just work with one file
        var file = e.dataTransfer.files[0];
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
    }, false);

      ////////////////  functions
        this.stuff = "";
        this.dialogvers = "";
        this.questvers = "";
        this.trustedHtml = "";
        this.trustedHtml2 = "";
          this.select = function(e) {
              $('tr').removeClass()
              $(e.target).addClass("selected-line");
            this.stuff = $(e.target).html().replace(/\w+_\d+[\s+\t](?:\{memo X\})?\$?(.+)/, '$1'); // get text, get rid of memo x
            this.stuff = this.stuff.replace(/{nl}/g, '<br>')//replace {nl}s with brs
            this.dialogvers = this.stuff.replace(/([\w\s\d-+;|,.!&'"\?]{120})/g, '$1<br>')//break every 120
            this.dialogvers = this.dialogvers.replace(/([\w\s\d-+;|,.!&'"\?]{90})/g, '$1<br>')//now break again every 90
            this.questvers = this.stuff.replace(/([\w\s\d-+;|,.!&'"\?]{45})/g, '$1<br>')//break every 120
            this.trustedHtml = $sce.trustAsHtml(this.dialogvers); // required to ng-bind to index.html -> security check for txt-block
            this.trustedHtml2 = $sce.trustAsHtml(this.questvers); // required to ng-bind to index.html -> security check for right-bar quest desc
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