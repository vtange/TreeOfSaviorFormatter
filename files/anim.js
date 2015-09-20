$(document).ready(function(){

    ////////////////  file upload

    $("#upload").bind("click", function () {
        var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.tsv|.csv|.txt)$/;
        if (regex.test($("#fileUpload").val().toLowerCase())) {
            if (typeof (FileReader) != "undefined") {
                var reader = new FileReader();
                reader.onload = function (e) {
                    var table = $("<table></table>");
                    var rows = e.target.result.split("\n");
                    for (var i = 0; i < rows.length; i++) {
                        var row = $("<tr data-ng-click='list.select()'></tr>");
                        row.html(rows[i]);
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
                        var table = $("<table />");
                        var rows = e.target.result.split("\n");
                        for (var i = 0; i < rows.length; i++) {
                            var row = $("<tr />");
                            row.html(rows[i]);
                            table.append(row);
                        }
                        $("#editor").html('');
                        $("#editor").append(table);
                    }

                    reader.readAsText(file);
        } else {
        alert("Please upload a valid CSV file.");
        }
    }, false);
    
    
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
    //var width5 = div5.width();                not required, scales auto with txt block
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

