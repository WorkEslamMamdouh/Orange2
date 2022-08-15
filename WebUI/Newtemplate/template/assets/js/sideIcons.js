var navTop = $('#icon-bar').offset().top;
$(document).ready(function () {
    var heightIcon = screen.height * 5 / 100;
    if ($(this).scrollTop() >= 0) {
        $('.print-details').css('position', 'fixed');
        $('.print-details').css('top', `auto`);
        $('.print-details').css('bottom', `${heightIcon}px`);
        $('.edit').css('position', 'fixed');
        $('.edit').css('top', `auto`);
        $('.edit').css('bottom', `${heightIcon + 60}px`);
        $('.back').css('position', 'fixed');
        $('.back').css('bottom', `${heightIcon + 120}px`);
        $('.save').css('position', 'fixed');
        $('.save').css('bottom', `${heightIcon + 180}px`);

    } else {
        $('.print-details').css('position', 'absolute');
        $('.print-details').css('bottom', `${navTop}px`);
        $('.edit').css('position', 'absolute');
        $('.edit').css('bottom', `${navTop + 60}px`);
        $('.back').css('position', 'absolute');
        $('.back').css('bottom', `${navTop + 120}px`);
        $('.save').css('position', 'absolute');
        $('.save').css('bottom', `${navTop + 180}px`);

    }
});
//$(window).scroll(function () {
//    var heightIcon = screen.height * 5 / 100;
//    if ($(this).scrollTop() >= 0) {
//        $('.print-details').css('position', 'fixed');
//        $('.print-details').css('top', `auto`);
//        $('.print-details').css('bottom', `${heightIcon}px`);
//        $('.edit').css('position', 'fixed');
//        $('.edit').css('top', `auto`);
//        $('.edit').css('bottom', `${heightIcon+60}px`);
//        $('.back').css('position', 'fixed');
//        $('.back').css('bottom', `${heightIcon + 120}px`);
//        $('.save').css('position', 'fixed');
//        $('.save').css('bottom', `${heightIcon + 180}px`);

//    } else {
//        $('.print-details').css('position', 'absolute');
//        $('.print-details').css('bottom', `${navTop}px`);
//        $('.edit').css('position', 'absolute');
//        $('.edit').css('bottom', `${navTop + 60}px`);
//        $('.back').css('position', 'absolute');
//        $('.back').css('bottom', `${navTop + 120}px`);
//        $('.save').css('position', 'absolute');
//        $('.save').css('bottom', `${navTop + 180}px`);

//    }
//}); 
