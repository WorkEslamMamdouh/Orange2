(function ($) {

    //var lod = '<i class="fa fa-spinner fa-spin lod  "></i>';

    //let lod_Old = '';
    //let id = '';
    //$('button').mousedown(function () {
    //    if (id == '') {
    //        id = this.getAttribute('id');
    //        lod_Old = $(this).html();
    //        $(this).append(lod);

    //    }


    //    setTimeout(function () {
    //        $('#' + id + '').removeAttr("disabled");
    //        $('#' + id + '').html(lod_Old);
    //        lod_Old = '';
    //        id = '';
    //    }, 500);


    //});


    //$('#Loading_Div').html('<i class="fa fa-spinner fa-spin lod  Loading" style="font-size: 465%;z-index: 99999;"></i>');
    $('#Loading_Div').html('<span class="loader" style="font-size: 465%;z-index: 99999;"></span>'); 

    $('.iconbar-container').attr('style', 'display : none');
    //$('.iconbar-container').addClass('hidden_Control');
    setTimeout(function () {

        $('#Loading_Div').html('');
        $('.iconbar-container').removeClass('hidden_Control');
        $('.iconbar-container').attr('style', '');
         

    }, 150);

    setTimeout(function () {

       
        $('.iconbars').attr('style', '');

    }, 500);

})(jQuery); 