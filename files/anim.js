$(document).ready(function(){

    ////////////////  file upload

    $("#upload").bind("click", function () {
        var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.tsv|.csv|.txt)$/;
        if (regex.test($("#fileUpload").val().toLowerCase())) {
            if (typeof (FileReader) != "undefined") {
                var reader = new FileReader();
                reader.onload = function (e) {
                    var table = $("<table />");
                    var rows = e.target.result.split("\n");
                    for (var i = 0; i < rows.length; i++) {
                        var row = $("<tr />");
                        var cells = rows[i].split(",");
                        for (var j = 0; j < cells.length; j++) {
                            var cell = $("<td />");
                            cell.html(cells[j]);
                            row.append(cell);
                        }
                        table.append(row);
                    }
                    $("#editor").html('');
                    $("#editor").append(table);
                }
                reader.readAsText($("#fileUpload")[0].files[0]);
            } else {
                alert("This browser does not support HTML5.");
            }
        } else {
            alert("Please upload a valid CSV file.");
        }
    });

    ////////////////  DRAG AND DROP

    function dragenter(e) {
      e.stopPropagation();
      e.preventDefault();
    }

    function dragover(e) {
      e.stopPropagation();
      e.preventDefault();
    }
    function drop(e) {
      e.stopPropagation();
      e.preventDefault();

      var dt = e.dataTransfer;
      var files = dt.files;

      handleFiles(files);
    }
    var dropbox;

    dropbox = document.getElementById("drop-zone");
    dropbox.addEventListener("dragenter", dragenter, false);
    dropbox.addEventListener("dragover", dragover, false);
    dropbox.addEventListener("drop", drop, false);

    ////////////////  RESIZING

    function jqUpdateSize(){
    // Get the dimensions of the viewport
    var width = $(window).width();    //used for repositioning, width used to take advantage of css:contain
        //for every element, make a height to width ratio.
    //var div1 = $('.left-bar');
    //var width1 = div1.width();                will do if requested
    //div1.css("height", width1*2.28);
        
    var div2 = $('#drop-zone');
    var width2 = div2.width();
    div2.css("height", width2*0.56);
        
    var div3 = $('.right-bar');
    var width3 = div3.width();
    div3.css("top", width*(0.222));
    div3.css("height", width3*1.3);
        
    var div4 = $('.text-block');
    var width4 = div4.width();
    div4.css("top", width*0.41);
    div4.css("height", width4*0.26);
        
    //var div5 = $('.dialog');
    //var width5 = div5.width();                not required as right-bar shows
    //div5.css("top", width*0.026);
    //div5.css("height", width5*0.1);
        
    $('.dialog').flowtype({
       minimum   : 10,
       maximum   : 9000,
       minFont   : 1,
       maxFont   : 48.25,
       fontRatio : 200
    });
    $('.quest').flowtype({
       minimum   : 10,
       maximum   : 9000,
       minFont   : 1,
       maxFont   : 48.25,
       fontRatio : 200
    });
    $('.title').flowtype({
       minimum   : 10,
       maximum   : 9000,
       minFont   : 1,
       maxFont   : 48.25,
       fontRatio : 200
    });
    $('.small').flowtype({
       minimum   : 10,
       maximum   : 9000,
       minFont   : 1,
       maxFont   : 48.25,
       fontRatio : 200
    });
};
$(document).ready(jqUpdateSize);    // When the page first loads
$(window).resize(jqUpdateSize);     // When the browser changes size
});

