$(document).ready(function(){
    $('body').flowtype({
       minimum   : 1,
       maximum   : 9000,
       minFont   : 0.001,
       maxFont   : 18.25,
       fontRatio : 100
    });
    function jqUpdateSize(){
    // Get the dimensions of the viewport
    var width = $(window).width();    //used for repositioning, width used to take advantage of css:contain
        //for every element, make a height to width ratio.
    var div1 = $('.left-bar');
    var width1 = div1.width();
    div1.css("height", width1*2.28);
    var div2 = $('.drop-zone');
    var width2 = div2.width();
    div2.css("height", width2*0.56);
    var div3 = $('.right-bar');
    var width3 = div3.width();
    div3.css("top", width*0.22);
    div3.css("height", width3*1.3);
    var div4 = $('.text-block');
    var width4 = div4.width();
    div4.css("top", width*0.42);
    div4.css("height", width4*0.23);
    var div5 = $('.dialog');
    var width5 = div5.width();
    div5.css("top", width*0.0135);
    div5.css("height", width5*0.23);
};
$(document).ready(jqUpdateSize);    // When the page first loads
$(window).resize(jqUpdateSize);     // When the browser changes size
});

