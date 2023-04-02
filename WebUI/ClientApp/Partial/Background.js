$(document).ready(function () {
    //HomeComponent.Language();
    BackgroundImage.GetBackgroundImage();
    $('.main-iconbar').addClass('display_none');
});
var BackgroundImage;
(function (BackgroundImage) {
    var sys = new SystemTools();
    var SysSession = GetSystemSession('Home');
    var GetCompStatus = new Array();
    var News_Details = new NewsDetails();
    var CountGrid = 0;
    var CompCode = Number(SysSession.CurrentEnvironment.CompCode);
    var BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);
    function GetBackgroundImage() {
        $.ajax({
            type: "GET",
            async: false,
            url: sys.apiUrl("SystemTools", "getBackgroundImage"),
            data: { CompCode: Number(SysSession.CurrentEnvironment.CompCode) },
            success: function (response) {
                var class_css = "<style>.hero-image {background-image: url(../../images/Background/" + response + ")!important;height: -webkit-fill-available;background-position: center!important;background-repeat: no-repeat;background-size: cover;position: relative;top:-21px;}</style>";
                $("#cont").append(class_css);
                $("#body_img").addClass("hero-image");
                //$("#cont").html(' <img id="img_divcont" style="background-repeat: no-repeat;max-width: 104.9%;height: auto;margin: -15px -29px 0px -14px;" src="/images/Background/' + response + '" alt="Alternate Text" /> ');
            }
        });
        var isNews = localStorage.getItem("Show_News");
        //if (isNews == 'false') {
        //Show_News(); 
        //}
        if (SysSession.CurrentEnvironment.UserCode == 'safe' || SysSession.CurrentEnvironment.UserCode == 'SAFE' || SysSession.CurrentEnvironment.UserCode == 'islam') {
            BiuldComp();
        }
    }
    BackgroundImage.GetBackgroundImage = GetBackgroundImage;
    function InitializeGrid(cnt) {
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
        debugger;
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("I_VW_GetCompStatus", "GetComps"),
            data: { userCode: SysSession.CurrentEnvironment.UserCode, yr: Number(SysSession.CurrentEnvironment.CurrentYear) },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    GetCompStatus = result.Response;
                    CountGrid = 0;
                    $("#TableCashOrBank_1").html('');
                    for (var i = 0; i < GetCompStatus.length; i++) {
                        InitializeGrid(i);
                        DisplayGrid(i);
                        CountGrid++;
                    }
                    $("#CompStat").removeClass('display_none');
                    $("#CompStat").addClass('animate__lightSpeedInRight');
                }
            }
        });
    }
    function DisplayGrid(i) {
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
    function GetNumDay(CompanyStatus, i) {
        debugger;
        var MembeshipEndDate = CompanyStatus.MembeshipEndDate;
        var status = CompanyStatus.CompStatus;
        var masg = CompanyStatus.LoginMsg;
        var MembershipAllanceDays = CompanyStatus.MembershipAllanceDays;
        var dateExport_1 = addDaysOrMonth(MembeshipEndDate, MembershipAllanceDays, 0);
        var Day_1 = daysDifference(GetDate(), DateFormat(dateExport_1));
        var MembershipreadOnlyDays = CompanyStatus.MembershipreadOnlyDays;
        var AllDays = (MembershipAllanceDays + MembershipreadOnlyDays);
        var dateExport = addDaysOrMonth(MembeshipEndDate, AllDays, 0);
        var NumDay = daysDifference(GetDate(), DateFormat(dateExport));
        if (status == 0 || status == 1 || status == 2) {
            debugger;
            if (status == 1) {
                Progres(1, i);
                return Day_1;
            }
            if (status == 2) {
                Progres(2, i);
                return NumDay;
            }
        }
        Progres(3, i);
        return Day_1;
    }
    function Progres(progress, i) {
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
        if (progress == 3) { //لبني
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
        var DateNow = DateFormatRep(GetDate());
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("I_VW_GetCompStatus", "GetNews"),
            data: { CompCode: CompCode, BranchCode: BranchCode, DateNow: DateNow },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    News_Details = result.Response;
                    if (News_Details.G_News.length > 0) {
                        for (var i = 0; i < News_Details.G_Codes.length; i++) {
                            BuildNews(i);
                        }
                        $("#News_Model").modal("show");
                        localStorage.setItem("Show_News", 'true');
                    }
                }
            }
        });
    }
    function BuildNews(cnt) {
        debugger;
        var html_News = "\n                    <div id=\"\" style=\"margin-top: 1%;\" class=\"col-lg-12 grid-margin stretch-card animate__animated animate__lightSpeedInRight\">\n                        <div class=\"card \" style=\"background-color: " + News_Details.G_Codes[cnt].SubCode + ";\">\n                            <div class=\"card-body\">\n\n\n                                <h4 id=\"Titel_TypeNews" + cnt + "\" class=\"card-title\">" + News_Details.G_Codes[cnt].DescA + "  </h4>\n                                <div id=\"Prag_News" + News_Details.G_Codes[cnt].CodeValue + "\" style=\"margin-right: 5%;\" class=\"table-responsive\">\n                                  \n\n\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n\n                   ";
        var Pragraph = News_Details.G_News.filter(function (x) { return x.NewsTypeCode == News_Details.G_Codes[cnt].CodeValue; });
        if (Pragraph.length == 0) {
            return;
        }
        $("#Div_News").append(html_News);
        var htmlPrag = '';
        for (var i = 0; i < Pragraph.length; i++) {
            htmlPrag = htmlPrag + '<li style="font-weight: bold;">' + Pragraph[i].NewsText + '</li>';
        }
        debugger;
        $("#Prag_News" + News_Details.G_Codes[cnt].CodeValue).html(htmlPrag);
    }
})(BackgroundImage || (BackgroundImage = {}));
//# sourceMappingURL=Background.js.map