$(document).ready(function(){


    ////////////////  RESIZING

    function jqUpdateSize(){
    // Get the dimensions of the viewport
    var width = $(window).width();    //used for repositioning, width used to take advantage of css:contain
        //for every element, make a height to width ratio.

    var div3 = $('.right-bar');
    var width3 = div3.width();
    div3.css("top", width*(0.222));
    div3.css("height", width3*1.3);
        
    var div4 = $('.text-block');
    var width4 = div4.width();
    div4.css("top", width*0.41);
    div4.css("height", width4*0.26);
        
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
       fontRatio : 190
    });
    $('.title').flowtype({
       minimum   : 10,
       maximum   : 9000,
       minFont   : 1,
       maxFont   : 48.25,
       fontRatio : 190
    });
    $('.small').flowtype({
       minimum   : 10,
       maximum   : 9000,
       minFont   : 1,
       maxFont   : 48.25,
       fontRatio : 190
    });
};
$(document).ready(jqUpdateSize);    // When the page first loads
$(window).resize(jqUpdateSize);     // When the browser changes size
});

