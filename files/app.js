(function() {
    //start of function
  var app = angular.module('formatter', []);
  app.controller('lineDisplay',['$scope', '$compile', '$sce', function($scope, $compile, $sce) {
	$scope.file1 = [];
	$scope.file2 = [];
	$scope.lines = [];

      ////////////////  selected line preparation for dialog box
        $scope.selectedLine = {text:""};		//becomes rendered line
        $scope.selectedArr = [];				//saving
        $scope.selectedIndex = -1;				//saving
        $scope.selectedProp = "three";			//differentiate column in double-mode
	  	$scope.selectedCell;					//green highlight
	  	$scope.select = function(arr, index, prop) {							//save current work, green highlight, selectArr & Index, Updateselect Line
			if(!(this == $scope.selectedCell && prop == $scope.selectedProp)){	//prevent reselecting same cell, allow different column
				if(arr[index].constructor == Object){							//double column mode
					if($scope.selectedArr[$scope.selectedIndex]!==undefined){	//enter saving phase, check if there is a valid selected cell to save into
						if(prop == $scope.selectedProp){						// if remain on same column
							$scope.saveLine($scope.selectedArr,$scope.selectedIndex, prop);
						}
						else{													// if switch column
							if(prop == "one"){
								$scope.saveLine($scope.selectedArr,$scope.selectedIndex, "two");
							}
							else{
								$scope.saveLine($scope.selectedArr,$scope.selectedIndex, "one");
							}
						}
					}
					$scope.selectedCell = this;									//assign values as selected
					$scope.selectedLine.text = arr[index][prop];
					$scope.selectedArr = arr;
					$scope.selectedIndex = index;
					$scope.selectedProp = prop;
				}
				else{															//single column mode
				if($scope.selectedArr[$scope.selectedIndex]!==undefined){		//enter saving phase, check if there is a valid selected cell to save into
					$scope.saveLine($scope.selectedArr,$scope.selectedIndex);
				}
				$scope.selectedCell = this;										//assign values as selected
				$scope.selectedLine.text = arr[index];
				$scope.selectedArr = arr;
				$scope.selectedIndex = index;
				}
			};
        };
	  	$scope.isSelected = function(prop){										//green highlight
			if(prop){															//double column mode, prevents double green
				return this == $scope.selectedCell && $scope.selectedProp == prop;
			}
			else{
				return this == $scope.selectedCell;
			}
		}
		$scope.saveLine = function(arr, index, prop){							//save current work
																				//cannot just use line as argument[0] with file1[$index] at html, doesn't link to array
			if (arr[index].constructor == Object){
				arr[index][prop] = $scope.selectedLine.text;
				$scope.selectedCell = {};//deselect
			}
			else{
				arr[index] = $scope.selectedLine.text;
				$scope.selectedCell = {};//deselect
			}
		}
	  	var linePreRender = function(line){
            line = line.replace(/\w+_\d+[\s+\t](?:\{memo X\})?\$?(.+)/, '$1');	// get text, get rid of memo x
            line = line.replace(/{nl}/g, '<br>')								//replace {nl}s with brs
			autosize(document.querySelectorAll('textarea'));					//resize textarea as text is rendered(as i type)
			return line;
		}
		$scope.renderDialog = function(line){
			line = linePreRender(line);
            line = line.replace(/([\w\s\d-+;|,.!&'"\?]{120})/g, '$1<br>')		//break every 120
            line = line.replace(/([\w\s\d-+;|,.!&'"\?]{90})/g, '$1<br>')		//now break again every 90
            line = $sce.trustAsHtml(line);										// required to ng-bind to index.html -> security check for txt-block
			return line;
		};
	  	$scope.renderQuestDesc = function(line){
            line = linePreRender(line);
            line = line.replace(/([\w\s\d-+;|,.!&'"\?]{45})/g, '$1<br>')		//break every 45
            line = $sce.trustAsHtml(line);										// required to ng-bind to index.html -> security check for right-bar quest desc
			return line;
		};
	$scope.useCombined = function(){
		return $scope.file1.length > 0 && $scope.file2.length > 0;
	};
    ////////////////  file upload
	var processDropped = function(eventTarget, side){
        // let's just work with one file
        var file = eventTarget.dataTransfer.files[0];
        var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.tsv|.csv|.txt)$/;
        //console.log("Type: " + file.type);                        for debug use
        //console.log(regex.test(file.name.toLowerCase()));
        if (regex.test(file.name.toLowerCase())) {
                    var reader = new FileReader();
                    reader.onload = function(e) {
                            generateArr(e, side);
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
                    generateArr(e,side);
                }
                reader.readAsText($(str)[0].files[0]);
            } else {
                alert("This browser does not support HTML5.");
            }
        } else {
            alert("Please upload a valid CSV file.");
        }
	}
	var oneSidedTable = function(arr){
			var abrev = arr === $scope.file1 ? 'file1' : 'file2';
			console.log(abrev);
			var table = $("<table></table>");
			for (var i = 0; i < arr.length; i++) {
				var row = $('<tr data-ng-click="select('+abrev+','+i+')"></tr>');
				row.html(arr[i]);
				table.append(row);
			}
		return table;
	}
	var renderTable = function(arr){
		if ($scope.useCombined === true){
			console.log('rendering tabble');
			//clear editors
			$("#editors").html('');
			//generate double column table
		}
		else{
			console.log('rendering table');
			//table generation (make a function out of this)
			var table = oneSidedTable(arr);
			$compile(table)($scope);  // links ^ dynamic html to controller.  -> if this is still slow then consider compiling only hovered
			//table generation (make a function out of this)
			//editor1 or 2
			var position = arr === $scope.file1 ? '#editor' : '#editor2';
			$(position).append(table);
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
	var generateArr = function(eventTarget, side){
					//remove dropzone, depend on side (editor will generate via ngrepeat)
					if(side === 1){
						$( "#drop-zone" ).remove();
						$scope.file1 = eventTarget.target.result.split("\n");
						generateCombined();
						renderTable($scope.file1);
					}
					else{
						$( "#drop-zone2" ).remove();
						$scope.file2 = eventTarget.target.result.split("\n");
						generateCombined();
						renderTable($scope.file2);
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
		processDropped(e, 1)
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
        processDropped(e, 2)
    }, false);

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
  app.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                event.preventDefault();
				scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });
            }
        });
    };
});//end of directive
  //end of function
})();