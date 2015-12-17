(function() {
    //start of function
  var app = angular.module('formatter', []);
  app.controller('lineDisplay',['$scope', '$sce', function($scope, $sce) {
	$scope.file1 = [];
	$scope.file2 = [];
	$scope.lines = [];
	$scope.useCombined = function(){
		return $scope.file1.length > 0 && $scope.file2.length > 0;
	};
    ////////////////  file upload
	var generateTable_drop = function(eventTarget, side){
        // let's just work with one file
        var file = eventTarget.dataTransfer.files[0];
        var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.tsv|.csv|.txt)$/;
        //console.log("Type: " + file.type);                        for debug use
        //console.log(regex.test(file.name.toLowerCase()));
        if (regex.test(file.name.toLowerCase())) {
                    var reader = new FileReader();
                    reader.onload = function(e) {
                            generateTableAng(e, side);
                    }
                    reader.readAsText(file);
        } else {
        alert("Please upload a valid CSV file.");
        }
	}
	var uploadedFileCheck = function(str, side){
		var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.tsv|.csv|.txt)$/;
        if (regex.test($(str).val().toLowerCase())) {
            if (typeof (FileReader) != "undefined") {
                var reader = new FileReader();
                reader.onload = function (e) {
                    generateTableAng(e,side);
                }
                reader.readAsText($(str)[0].files[0]);
            } else {
                alert("This browser does not support HTML5.");
            }
        } else {
            alert("Please upload a valid CSV file.");
        }
	}
	var generateCombined = function(){
		$scope.file1.length > $scope.file2.length ? $scope.lines = Array($scope.file1.length) : $scope.lines = Array($scope.file2.length)
		for(var i = 0; i < $scope.lines.length; i++){
			$scope.lines[i] = {
				one:$scope.file1[i],
				two:$scope.file2[i]
			};
		}
	}
	var generateTableAng = function(eventTarget, side){
					//remove dropzone, depend on side (editor will generate via ngrepeat)
					if(side === 1){
						$( "#drop-zone" ).remove();
						$scope.file1 = eventTarget.target.result.split("\n");
						generateCombined();
						$scope.$apply()
					}
					else{
						$( "#drop-zone2" ).remove();
						$scope.file2 = eventTarget.target.result.split("\n");
						generateCombined();
						$scope.$apply()
					};
	}
    $("#upload").on("click", function () {
		uploadedFileCheck("#fileUpload",1);
    });
    $("#upload2").on("click", function () {
        uploadedFileCheck("#fileUpload2",2);
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
		generateTable_drop(e, 1)
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
        generateTable_drop(e, 2)
    }, false);
	  
	  
      ////////////////  selected line preparation for dialog box
        $scope.stuff = "";
        $scope.dialogvers = "";
        $scope.questvers = "";
        $scope.trustedHtml = "";
        $scope.trustedHtml2 = "";
          $scope.select = function(e) {
              $('textarea').removeClass()
              $(e.target).addClass("selected-line");
			  //console.log($(e.target).val())
            $scope.stuff = $(e.target).val().replace(/\w+_\d+[\s+\t](?:\{memo X\})?\$?(.+)/, '$1'); // get text, get rid of memo x
            $scope.stuff = $scope.stuff.replace(/{nl}/g, '<br>')//replace {nl}s with brs
            $scope.dialogvers = $scope.stuff.replace(/([\w\s\d-+;|,.!&'"\?]{120})/g, '$1<br>')//break every 120
            $scope.dialogvers = $scope.dialogvers.replace(/([\w\s\d-+;|,.!&'"\?]{90})/g, '$1<br>')//now break again every 90
            $scope.questvers = $scope.stuff.replace(/([\w\s\d-+;|,.!&'"\?]{45})/g, '$1<br>')//break every 45
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