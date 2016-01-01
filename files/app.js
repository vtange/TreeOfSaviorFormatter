(function() {
    //start of function
  var app = angular.module('formatter', ['ngAlertify']);
  app.controller('lineDisplay',['$scope', '$compile', '$sce', 'alertify', function($scope, $compile, $sce, alertify) {
	$scope.file1name = "file1.tsv";
	$scope.file1 = [];
	$scope.file2name = "file2.tsv";
	$scope.file2 = [];
	$scope.lines = [];
	$scope.export = function(side){
		var toBeExported = [];
		//prelim empty file check
		//if side is 1 and file 1 is [];
		if (side === 1 && $scope.file1.length === 0){
			alert("Nothing to export.");
			return;
		}
		//if side is 2 and file 2 is [];
		if (side === 2 && $scope.file2.length === 0){
			alert("Nothing to export.");
			return;
		}
		//prelim emtpy file check
		if($scope.useCombined()){//export on dbl col mode
			if (side === 1){
				for (var i = 0; i < $scope.file1.length; i++){
					toBeExported.push($scope.lines.one);
				}
			}
			else{
				for (var i = 0; i < $scope.file2.length; i++){
					toBeExported.push($scope.lines.two);
				}
			}
		}//export on dbl col mode
		//else export on single col mode
		else{
			//if side 1
			if(side === 1){
				toBeExported = $scope.file1;
			}
			//else
			else{
				toBeExported = $scope.file2;
			}
		}//else export on single col mode
		// export download phase
		  var element = document.createElement('a');
		  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(toBeExported.join("\n")));
		  element.setAttribute('download', side === 1? $scope.file1name : $scope.file2name);

		  element.style.display = 'none';
		  document.body.appendChild(element);

		  element.click();

		  document.body.removeChild(element);
		};
	  	//end export download phase
      ////////////////  selected line preparation for dialog box
        $scope.selectedLine = {text:""};		//becomes rendered line
        $scope.selectedArr = [];				//for saving edits, comparison
        $scope.selectedIndex = -1;				//for saving edits, comparison
        $scope.selectedProp = null;				//differentiate column in double-mode
	  	$scope.selectedCell;					//green highlight
	  	$scope.one = 'one';						//bandaid fix for selecting in double mode
	  	$scope.two = 'two';						//bandaid fix for selecting in double mode
	  	$scope.select = function(arr, index, prop, event) {		//save current work, green highlight, selectArr & Index, Updateselect Line
			var $lastClicked = $scope.selectedCell;
			if(!(event.target.id == $scope.selectedCell && prop == $scope.selectedProp)){	//prevent reselecting same cell, allow different column
				//double column mode vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
				if(arr[index].constructor == Object){
					//enter saving phase
					if($scope.selectedArr[$scope.selectedIndex]!==undefined){	// check if there is a valid selected cell to save into
						if(prop == $scope.selectedProp){						// check if remain on same column
							$scope.saveLine($scope.selectedArr,$scope.selectedIndex, prop);
						}
						else{													// ..if switched columns
							if(prop == "one"){
								$scope.saveLine($scope.selectedArr,$scope.selectedIndex, "two");
							}
							else{
								$scope.saveLine($scope.selectedArr,$scope.selectedIndex, "one");
							}
						}
					}//end saving phase
					//glowing textarea phase
						if ($scope.selectedCell){
							$("#"+$lastClicked).removeClass("selected-line");
							$("#"+$lastClicked).html($scope.selectedLine.text);// or selectedArr[$scope.selectedIndex][$scope.selectedProp]
							if(nlMode === true){
								$scope.nlCheck($scope.selectedLine.text, $scope.selectedIndex);
							}
						}
						$scope.selectedCell = event.target.id;
						$("#"+$scope.selectedCell).removeClass("nl-mark");
						$("#"+$scope.selectedCell).addClass("selected-line");
						$("#"+$scope.selectedCell).html('');
						var textarea = $('<textarea id="'+$scope.selectedCell+'" data-ng-model="selectedLine.text"></textarea>');
						EditingScope.$destroy();
						EditingScope = $scope.$new();
						$compile(textarea)(EditingScope);
						$("#"+$scope.selectedCell).append(textarea);
					//end glowing textarea phase
					$scope.selectedLine.text = arr[index][prop];
					$scope.selectedArr = arr;
					$scope.selectedIndex = index;
					$scope.selectedProp = prop;
					$scope.setTextArea();
				}//double column mode ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
				else{//single column mode vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
					if($scope.selectedArr[$scope.selectedIndex]!==undefined){		//enter saving phase, check if there is a valid selected cell to save into
						$scope.saveLine($scope.selectedArr,$scope.selectedIndex);
					}//end saving phase
					//glowing textarea phase
						if ($scope.selectedCell){
							$("#"+$lastClicked).removeClass("selected-line");
							$("#"+$lastClicked).html($scope.selectedLine.text);
							if(nlMode === true){
								$scope.nlCheck($scope.selectedLine.text, $scope.selectedIndex);
							}
						}
						$scope.selectedCell = event.target.id;
						$("#"+$scope.selectedCell).removeClass("nl-mark");
						$("#"+$scope.selectedCell).addClass("selected-line");
						$("#"+$scope.selectedCell).html('');
						var textarea = $('<textarea id="'+$scope.selectedCell+'" data-ng-model="selectedLine.text"></textarea>');
						EditingScope.$destroy();
						EditingScope = $scope.$new();
						$compile(textarea)(EditingScope);
						$("#"+$scope.selectedCell).append(textarea);
					//end glowing textarea phase
					$scope.selectedLine.text = arr[index];
					$scope.selectedArr = arr;
					$scope.selectedIndex = index;
					$scope.setTextArea();
				}//single column mode ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
			};
        };
	  	$scope.setTextArea = function(){
				$('textarea').html($scope.selectedLine.text);					//textarea requires innerHTML content
				autosize(document.querySelector('textarea'));					//set start size of textarea
		};
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
		};
	  	var linePreRender = function(line){
            line = line.replace(/\w+_\d+[\s+\t](?:\{memo X\})?\$?(.+)/, '$1');	// get text, get rid of memo x
            line = line.replace(/{nl}/g, '<br>')								//replace {nl}s with brs
			autosize(document.querySelector('textarea'));					//resize textarea as text is rendered(as i type)
			return line;
		};
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
	    var nlMode = false;
	  	$scope.nlScan = function(){
			//prevent toggle if no file
			if ($scope.file1.length === 0 && $scope.file2.length ===0){
				alert('Load a file first.');
				return;
			}
			//prompt for side
			if (nlMode === false){
				nlMode = true;
			}
			else{
				nlMode = false;
			}
			setSide(scan);
			function scan(side){
				//define arr, remove undefined
				if($scope.useCombined()){
					var arr = side === 1 ? $scope.lines.map(function(obj){return obj['one'];}) : $scope.lines.map(function(obj){return obj['two'];});
				}
				else{
					var arr = side === 1 ? $scope.file1 : $scope.file2;
				}
				arr = arr.filter(function(element){return element !== undefined;});
				//arr.foreach(item) do nlcheck(item)
				arr.forEach(function(item, i){
					$scope.nlCheck(item, i, side);
				})
			}
		};
		$scope.nlCheck = function(string, index, side){
			//this checks a single line for nl, useful for after edit
			var test = /\t([\w\s\d-+;|,.!&'"\?]{90})/g;
			if(string.search(test)!==-1){
				//double col mode
				if ($scope.useCombined()){
					if (side === 2){
						console.log(document.getElementById('lineII'+index));
					}
					else{
						console.log(document.getElementById('line'+index));
					}
				}
				//single col mode
				else{
					$('#line'+index).addClass('nl-mark');
				}
			}
		};
    ////////////////  file upload
	function setSide(callback){
			var sidetoCheck;
			var whichSide = alertify
							  .okBtn("Right")
							  .cancelBtn("Left")
							  .confirm("Which Side?", function (ev) {
								  //left
								  ev.preventDefault();
								  sidetoCheck = 2;
								  alertify.success("Checking Right Side...");
								  callback(sidetoCheck);
							  }, function(ev) {
								  //right
								  ev.preventDefault();
								  sidetoCheck = 1;
								  alertify.error("Checking Left Side...");
								  callback(sidetoCheck);
							  });
	}
	var grabFileName = function(input, side){
		//filename grab for future export
		if (side === 1){
			$scope.file1name = input;
		}
		else{
			$scope.file2name = input;
		}
		//filename grab for future export
	}
	var processDropped = function(eventTarget, side){
        // let's just work with one file
        var file = eventTarget.dataTransfer.files[0];
        var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.tsv|.csv|.txt)$/;
        //console.log("Type: " + file.type);                        for debug use
        //console.log(regex.test(file.name.toLowerCase()));
		grabFileName(file.name, side);
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
		grabFileName($(str).val(), side);
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
			var table = $("<table></table>");
			for (var i = 0; i < arr.length; i++) {
				var row = $('<tr data-ng-click="select('+abrev+','+i+',null,$event)" id="line'+i+'"></tr>');
				row.html(arr[i]);
				table.append(row);
			}
		return table;
	}
	var twoSidedTable = function(){
			var table = $("<table></table>");
			for (var i = 0; i < $scope.lines.length; i++) {
				var row = $('<tr></tr>');
				var col1 = $('<td data-ng-click="select(lines,'+i+',one,$event)" id="line'+i+'"></td>');
				var col2 = $('<td data-ng-click="select(lines,'+i+',two,$event)" id="lineII'+i+'"></td>');
				//would not work, double quotes conflict
				col1.html($scope.lines[i]['one']);
				col2.html($scope.lines[i]['two']);
				row.append(col1);
				row.append(col2);
				table.append(row);
			}
		return table;
	}
	var TableScope = $scope.$new();
	var EditingScope = $scope.$new();
	var renderTable = function(arr){
		if ($scope.useCombined()){
			//clear editors, unbind Angular
			TableScope.$destroy();
			TableScope = $scope.$new();
			$("#editors").html('');
			//generate double column table
			var table = twoSidedTable();
			$compile(table)(TableScope);  // links ^ dynamic html to controller.  -> if this is still slow then consider compiling only hovered
			$("#editors").append(table);
		}
		else{
			var table = oneSidedTable(arr);
			$compile(table)(TableScope);  // links ^ dynamic html to controller.  -> if this is still slow then consider compiling only hovered
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