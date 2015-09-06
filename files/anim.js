$(document).ready(function(){
    function jqUpdateSize(){
    // Get the dimensions of the viewport
    var width = $(document).width();    //used for repositioning, width used to take advantage of css:contain
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
    div4.css("padding-top", width4*0.23*0.12);
    div4.css("padding-left", width4*0.23*0.25);
    div4.css("font-size", width4*0.23*0.085);
};
$(document).ready(jqUpdateSize);    // When the page first loads
$(window).resize(jqUpdateSize);     // When the browser changes size
});

