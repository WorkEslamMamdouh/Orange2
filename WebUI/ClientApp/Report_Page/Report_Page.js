$(document).ready(function () {
    Report_Page.InitalizeComponent();
});
var Report_Page;
(function (Report_Page) {
    var SysSession = GetSystemSession(Modules.Home);
    //var btnPDF: HTMLButtonElement;
    var btnPrintEX;
    var btnPrintPdf;
    var btnPrint;
    var result;
    var succes;
    function InitalizeComponent() {
        setTimeout(function () { $('._Loding').removeClass('Btn_Loder'); }, 500);
        document.title = "الطباعة";
        $('#div_Reports').removeClass('display_none');
        $('.main-iconbar').addClass('display_none');
        $('#printableArea').html('<i class="fa fa-spinner fa-spin lod  Loading" style="font-size: 465%;z-index: 99999;"></i>');
        succes = localStorage.getItem("result");
        InitalizeControls();
        InitalizeEvents();
        GetReport();
        //result = localStorage.getItem("result");
        //GetHtml(succes);
    }
    Report_Page.InitalizeComponent = InitalizeComponent;
    function InitalizeControls() {
        //btnPDF = document.getElementById("btnPDF") as HTMLButtonElement;
        btnPrintPdf = document.getElementById("btnPrintPdf");
        btnPrintEX = document.getElementById("btnPrintEX");
        btnPrint = document.getElementById("btnPrintPage");
    }
    function InitalizeEvents() {
        btnPrint.onclick = print;
        btnPrintEX.onclick = function () { ReportDownload(3); };
        btnPrintPdf.onclick = function () { ReportDownload(2); };
        //btnPDF.onclick = btnPDF_onclick;
    }
    function ReportDownload(OutType) {
        var ReportData = localStorage.getItem("Report_Data");
        var data_New = JSON.parse(ReportData);
        if (ReportData != null) {
            data_New.CompCode = SysSession.CurrentEnvironment.CompCode;
            data_New.BranchCode = SysSession.CurrentEnvironment.BranchCode;
            data_New.CompNameA = SysSession.CurrentEnvironment.CompanyNameAr;
            data_New.CompNameE = SysSession.CurrentEnvironment.CompanyName;
            data_New.UserCode = SysSession.CurrentEnvironment.UserCode;
            data_New.Tokenid = SysSession.CurrentEnvironment.Token;
            data_New.ScreenLanguage = SysSession.CurrentEnvironment.ScreenLanguage;
            data_New.SystemCode = SysSession.CurrentEnvironment.SystemCode;
            data_New.SubSystemCode = SysSession.CurrentEnvironment.SubSystemCode;
            data_New.BraNameA = SysSession.CurrentEnvironment.BranchName;
            data_New.BraNameE = SysSession.CurrentEnvironment.BranchName;
            data_New.DocPDFFolder = SysSession.CurrentEnvironment.I_Control[0].DocPDFFolder;
            data_New.LoginUser = SysSession.CurrentEnvironment.UserCode;
            if (data_New.BraNameA == null || data_New.BraNameE == null) {
                data_New.BraNameA = " ";
                data_New.BraNameE = " ";
            }
            data_New.RepType = OutType; //output report as View
            data_New.Type = OutType; //output report as View
            Ajax.CallAsync({
                url: Url.Action("" + data_New.Name_function + "", "GeneralReports"),
                data: data_New,
                success: function (d) {
                    var result = d.result;
                    window.open(result, "_blank");
                }
            });
        }
    }
    function GetReport() {
        var ReportData = localStorage.getItem("Report_Data");
        var data_New = JSON.parse(ReportData);
        if (ReportData != null) {
            data_New.CompCode = SysSession.CurrentEnvironment.CompCode;
            data_New.BranchCode = SysSession.CurrentEnvironment.BranchCode;
            data_New.CompNameA = SysSession.CurrentEnvironment.CompanyNameAr;
            data_New.CompNameE = SysSession.CurrentEnvironment.CompanyName;
            data_New.UserCode = SysSession.CurrentEnvironment.UserCode;
            data_New.Tokenid = SysSession.CurrentEnvironment.Token;
            data_New.ScreenLanguage = SysSession.CurrentEnvironment.ScreenLanguage;
            data_New.SystemCode = SysSession.CurrentEnvironment.SystemCode;
            data_New.SubSystemCode = SysSession.CurrentEnvironment.SubSystemCode;
            data_New.BraNameA = SysSession.CurrentEnvironment.BranchName;
            data_New.BraNameE = SysSession.CurrentEnvironment.BranchName;
            data_New.DocPDFFolder = SysSession.CurrentEnvironment.I_Control[0].DocPDFFolder;
            data_New.LoginUser = SysSession.CurrentEnvironment.UserCode;
            data_New.DbName = $('#GetIPAddress').val();
            if (data_New.BraNameA == null || data_New.BraNameE == null) {
                data_New.BraNameA = " ";
                data_New.BraNameE = " ";
            }
            debugger;
            Ajax.CallAsync({
                url: Url.Action("" + data_New.Name_function + "", "GeneralRep"),
                data: data_New,
                success: function (d) {
                    var result = d;
                    //$('#printableArea').html("" + result + "");
                    $('#printableArea').html("");
                    var x = Url.Action("OpenPdf", "Home");
                    var UrlPdf = x + "/" + "?" + "path=" + result + "";
                    $('#printableAreaNew').attr("style", "direction: ltr!important;height: 90%;overflow: scroll;margin-right: 4%;width: 90%;  overflow: hidden; ");
                    $('#printableAreaNew').append('<iframe src="' + UrlPdf + '" frameBorder="0"scrolling="auto"height="100%" width="100%"></iframe>');
                    var Model = localStorage.getItem("Model_Screen");
                    setTimeout(function () {
                        PrintTransactionLog(SysSession.CurrentEnvironment.UserCode, SysSession.CurrentEnvironment.CompCode, SysSession.CurrentEnvironment.BranchCode, Model, SysSession.CurrentEnvironment.CurrentYear, data_New.TRId.toString());
                    }, 4000);
                }
            });
        }
    }
    function GetHtml(success) {
        debugger;
        var DocPDFFolder = SysSession.CurrentEnvironment.I_Control[0].DocPDFFolder;
        Ajax.CallAsync({
            url: Url.Action("GetHtml", "GeneralRep"),
            data: { DocPDFFolder: DocPDFFolder, success: Number(success) },
            success: function (d) {
                var html = d;
                result = html;
                if (Number(succes) != 1) {
                    $('#printableArea').addClass('display_none');
                    $('#btnPrint').addClass('display_none');
                    $('#BackError').removeClass('display_none');
                }
                $('#printableArea').html("" + result + "");
            }
        });
    }
    $(":file").change(function () {
        alert($(":file").val());
    });
    function btnPDF_onclick() {
        debugger;
        var url = "";
        Ajax.CallAsync({
            url: Url.Action("DownloadDdf", "ReportsPagePrint"),
            data: { url: url },
            success: function (d) {
                alert('ok');
            }
        });
    }
    function print() {
        printDiv("printableArea");
    }
    //function ImagetoPrint(source) {
    //    return "<html><head><scri" + "pt>function step1(){\n" +
    //        "setTimeout('step2()', 10);}\n" +
    //        "function step2(){window.print();window.close()}\n" +
    //        "</scri" + "pt></head><body onload='step1()'>\n" +
    //        "<img src='data:image/png;base64," + source + "' /></body></html>";
    //}
    //function PrintImage(source) {
    //    this.prints = true;
    //    var pwa = window.open('', 'Print-Window', 'height=600,width=800');
    //    pwa.document.open();
    //    pwa.document.write(ImagetoPrint(source));
    //    pwa.document.close();
    //}
    //function ImagetoPrint(source: string) {
    //    var div = document.getElementById(source).innerHTML
    //    return "<html><head><link href='~/css/loader.css' rel='stylesheet' /><scri" + "pt>function step1(){\n" +
    //        "setTimeout('step2()', 10);}\n" +
    //        "function step2(){window.print();window.close()}\n" +
    //        "</scri" + "pt></head><body onload='step1()'>\n" +
    //        "" + div+"</body></html>";
    //}
    //function printDiv(divName: string){
    //    var sOption = "toolbar=no,location=no,directories=yes,menubar=no,";
    //    sOption += "scrollbars=yes,width=775,height=600,left=10,top=25";
    //    var mywindow = window.open('', 'PRINT', sOption);
    //    mywindow.document.open();
    //    mywindow.document.write(ImagetoPrint(divName));
    //    mywindow.document.close();
    //}
})(Report_Page || (Report_Page = {}));
//# sourceMappingURL=Report_Page.js.map