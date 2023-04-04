﻿$(document).ready(() => {
    //HomeComponent.Language();
    BackgroundImage.GetBackgroundImage();
    $('.main-iconbar').addClass('display_none');

});

namespace BackgroundImage {

    var sys: SystemTools = new SystemTools();

    var SysSession: SystemSession = GetSystemSession('Home');

    var GetCompStatus: Array<ModelCompStatus> = new Array<ModelCompStatus>();
    var News_Details: NewsDetails = new NewsDetails();

    var CountGrid = 0;

    var CompCode = Number(SysSession.CurrentEnvironment.CompCode)
    var BranchCode = Number(SysSession.CurrentEnvironment.BranchCode)


    class Style_New  { 
        public class_title: string;
        public class_icon: string;
        public Type_Text: string; 
    }

    export function GetBackgroundImage() {


        $.ajax({
            type: "GET",
            async: false,
            url: sys.apiUrl("SystemTools", "getBackgroundImage"),
            data: { CompCode: Number(SysSession.CurrentEnvironment.CompCode) },
            success: (response) => {
                let class_css = "<style>.hero-image {background-image: url(../../images/Background/" + response + ")!important;height: -webkit-fill-available;background-position: center!important;background-repeat: no-repeat;background-size: cover;position: relative;top:-21px;}</style>";
                $("#cont").append(class_css);
                $("#body_img").addClass("hero-image");
                //$("#cont").html(' <img id="img_divcont" style="background-repeat: no-repeat;max-width: 104.9%;height: auto;margin: -15px -29px 0px -14px;" src="/images/Background/' + response + '" alt="Alternate Text" /> ');

            }
        });


        let isNews = localStorage.getItem("Show_News");

        //$("#News_Model").modal("show");

        //if (isNews == 'false') {
            //Show_News(); 
        //}

        if (SysSession.CurrentEnvironment.UserCode == 'safe' || SysSession.CurrentEnvironment.UserCode == 'SAFE' || SysSession.CurrentEnvironment.UserCode == 'islam') {
            BiuldComp();
        }



    }

    function InitializeGrid(cnt: number) {

        var html;


        html = ' <tr  id="GridCB_' + cnt + '" >' +


            '<td id="COMP_CODE' + cnt + '" > ' +
            '1' +
            '</td>' +


            '<td  id="CBDescA_' + cnt + '" > ' +

            '</td>' +

            '<td    id="MembeshipEndDate' + cnt + '"  > ' +
            '0' +
            '</td>' +

            '<td   id="CompStatus' + cnt + '"  > ' +
            '0' +
            '</td>' +


            '<td  > ' +
            '<div class="progress">' +
            '<div id="CBprogress_' + cnt + '" class="progress-bar bg-success" role="progressbar" style="width: 25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>' +
            '</div>' +
            '</td>' +


            '<td  class="text-success" id="CBBalance_' + cnt + '" style="font-weight: bold;font-size: 15px;"  > ' +
            '0' +
            '<i class="mdi mdi-arrow-up"></i>' +
            '</td>' +


            '</tr>';

        $("#TableCashOrBank_1").append(html);

    }

    function BiuldComp() {


        debugger
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("I_VW_GetCompStatus", "GetComps"),
            data: { userCode: SysSession.CurrentEnvironment.UserCode, yr: Number(SysSession.CurrentEnvironment.CurrentYear) },
            success: (d) => {//(int CompCode, string StartDate, string EndDate, int Status, int? CustId, string SalesUser, string UserCode, string Token)
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    GetCompStatus = result.Response as Array<ModelCompStatus>;

                    CountGrid = 0;
                    $("#TableCashOrBank_1").html('');
                    for (var i = 0; i < GetCompStatus.length; i++) {

                        InitializeGrid(i);
                        DisplayGrid(i)
                        CountGrid++;

                    }

                    $("#CompStat").removeClass('display_none');
                    $("#CompStat").addClass('animate__lightSpeedInRight');


                }
            }
        });


    }

    function DisplayGrid(i: number) {


        $('#COMP_CODE' + i).html(GetCompStatus[i].COMP_CODE.toString());
        $('#CBDescA_' + i).html(GetCompStatus[i].NameA);

        $('#MembeshipEndDate' + i).html(DateFormat(GetCompStatus[i].MembeshipEndDate));

        if (GetCompStatus[i].CompStatus == 1) {
            $('#CompStatus' + i).html('فى مهلة التجديد ');
        }
        else if (GetCompStatus[i].CompStatus == 2) {
            $('#CompStatus' + i).html('استطلاع فقط');
        }
        else {
            $('#CompStatus' + i).html('مسدد بالفعل');

        }


        $('#CBprogress_' + i).attr('style', 'width: 100%');


        $('#CBBalance_' + i).html((GetNumDay(GetCompStatus[i], i)).toString());












    }


    function GetNumDay(CompanyStatus: ModelCompStatus, i: number): number {
        debugger
        var MembeshipEndDate = CompanyStatus.MembeshipEndDate;
        var status = CompanyStatus.CompStatus;
        var masg = CompanyStatus.LoginMsg;
        var MembershipAllanceDays = CompanyStatus.MembershipAllanceDays;
        let dateExport_1 = addDaysOrMonth(MembeshipEndDate, MembershipAllanceDays, 0)
        let Day_1 = daysDifference(GetDate(), DateFormat(dateExport_1));

        var MembershipreadOnlyDays = CompanyStatus.MembershipreadOnlyDays;
        let AllDays = (MembershipAllanceDays + MembershipreadOnlyDays);
        let dateExport = addDaysOrMonth(MembeshipEndDate, AllDays, 0)
        let NumDay = daysDifference(GetDate(), DateFormat(dateExport));

        if (status == 0 || status == 1 || status == 2) {
            debugger
            if (status == 1) {
                Progres(1, i);
                return Day_1
            }
            if (status == 2) {
                Progres(2, i);
                return NumDay
            }

        }

        Progres(3, i);
        return Day_1

    }

    function Progres(progress: number, i: number) {





        if (progress == 1) { // اصفر
            //$('#CBprogress_' + i).attr('class', 'progress-bar bg-success');
            //$('#CBBalance_' + i).attr('class', 'text-success');

            $('#CBprogress_' + i).attr('class', 'progress-bar bg-warning');
            $('#CBBalance_' + i).attr('class', 'text-warning');
        }

        if (progress == 2) { // احمر

            $('#CBprogress_' + i).attr('class', 'progress-bar bg-danger');
            $('#CBBalance_' + i).attr('class', 'text-danger');
        }

        if (progress == 3) {//لبني
            $('#CBprogress_' + i).attr('class', 'progress-bar bg-info');
            $('#CBBalance_' + i).attr('class', 'text-info');

        }


        //if (progress > 25 && progress < 60) { // ازرق
        //    $('#CBprogress_' + i).attr('class', 'progress-bar bg-primary');
        //    $('#CBBalance_' + i).attr('class', 'text-primary');

        //}


    }


    //***********************************************News******************************************
    
    function Show_News() {
        debugger

        let DateNow = DateFormatRep(GetDate());

        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("I_VW_GetCompStatus", "GetNews"),
            data: { CompCode: CompCode, BranchCode: BranchCode, DateNow: DateNow },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    News_Details = result.Response as NewsDetails;
                    if (News_Details.G_News.length > 0) {
 
                        for (var i = 0; i < News_Details.G_News.length; i++) {
                            BuildNews(i);
                        }

                        $("#News_Model").modal("show");
                        localStorage.setItem("Show_News", 'true');
                    }

                }
            }
        });

    }
     
    function BuildNews(cnt: number) {

        debugger

        let class_News = GetClass(cnt);

        let html_News = `
                      <div class="alert alert-${class_News.class_title} alert-white animate__animated animate__fadeInTopRight">
                        <div class="icon">${class_News.class_icon}</div>
                        <h5 class="news-date"> ${DateFormat(News_Details.G_News[cnt].NewsDate)}</h5>
                        <strong>${class_News.Type_Text} :</strong>
                        <span> ${News_Details.G_News[cnt].NewsText} </span>
                      </div>

                   `;

        $("#Div_News").append(html_News);
          

    }

    function GetClass(cnt: number): Style_New {

        debugger
        let StyleNew: Style_New = new Style_New();

        let TypeCode = News_Details.G_News[cnt].NewsTypeCode;
         
        let NewsType = News_Details.G_Codes.filter(x => x.CodeValue == TypeCode);


        StyleNew.class_title = NewsType[0].SubCode;

        if (StyleNew.class_title == "success") {
            StyleNew.class_icon ='<i class="fa-solid fa-check-to-slot"></i>';
        }
        if (StyleNew.class_title == "info") {
            StyleNew.class_icon = '<i class="fa fa-info-circle"></i>';
        }
        if (StyleNew.class_title == "warning") {
            StyleNew.class_icon = '<i class="fa fa-warning"></i>';
        }
        if (StyleNew.class_title == "danger") {
            StyleNew.class_icon = '<i class="fa-sharp fa-solid fa-ban"></i>';
        }
         
        StyleNew.Type_Text = NewsType[0].DescA;

        return StyleNew;

    }

}