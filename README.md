# TreeOfSaviorFormatter

# Takeaways

  - Basic Angular ng-Repeat method will not work in this. Too many watchers created, even with optimizations such as ```track by $index``` (Angular method used ```$scope.apply``` to register changes in Array made by drag-n-drop/jQuery upload.)
  - Use of ```flowtype.js``` to make scaleable font for the game-font rendering.
  - Use of ```autosize.js``` to autosize ```<textarea>``` elements to avoid overflow.
  - Use of ```fuzzyset.js``` for fuzzy searching and close comparison of strings.
  - Use ```$sce.trustAsHtml``` to grab rendered text from webpage into Angular and display it with HTML such as ```<brs>```

  
  		$scope.renderDialog = function(line){
			line = linePreRender(line);
            line = line.replace(/([\w\s\d-+;|,.!&'"\?]{120})/g, '$1<br>')		//break every 120
            line = line.replace(/([\w\s\d-+;|,.!&'"\?]{90})/g, '$1<br>')		//now break again every 90
            line = $sce.trustAsHtml(line);										// required to ng-bind to index.html -> security check for txt-block
			return line;
		};
	
	
- jQuery-generated Table. Use ```$compile``` to append ng-blah's to Angular.
- Gotcha: One column tables don't need ```<td>```'s, but 2+ do.
- Gotcha: Always use an object and direct ng-models to a property of that object.
- Regex: file extension check, and remove QUEST_blah and possible {memo X}, replace {nl} with HTML ```<br>```
- Replace table cell content with ```<textarea>``` when selected, add green glow (CSS ```!important``` used)
- New ```<textarea>```'s are ```$compile```d to an ```$scope.new()```->"EditingScope" and ```$destroy```ed when deselected.

```
var textarea = $('<textarea id="'+$scope.selectedCell+'" data-ng-model="selectedLine.text"></textarea>');
EditingScope.$destroy();			//remove old textarea scope
EditingScope = $scope.$new();			//generate new textarea scope
$compile(textarea)(EditingScope);		//make connections
$("#"+$scope.selectedCell).append(textarea);	//append the new html
```

- Keep track of what HTML element is selected via its HTML id.
```
$scope.selectedCell = event.target.id;
```
- CSS add green glow
	

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

 - Export as .txt function as ```$scope.export```
