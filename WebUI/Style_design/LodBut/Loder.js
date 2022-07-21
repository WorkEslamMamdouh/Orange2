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


    $('#Loading_Div').html('<i class="fa fa-spinner fa-spin lod  Loading" style="font-size: 465%;z-index: 99999;"></i>');

    setTimeout(function () {

        $('#Loading_Div').html('');
    }, 150);


})(jQuery); 