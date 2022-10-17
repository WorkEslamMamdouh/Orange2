$(document).ready(function () {
    CashBoxAccount.InitalizeComponent();
});
var CashBoxAccount;
(function (CashBoxAccount) {
    var compcode;
    var BranchCode;
    var AccountType = 1;
    var sys = new SystemTools();
    var SysSession = GetSystemSession(Modules.CashBoxAccount);
    //------------------------------------------------------------
    var Details_Box = new Array();
    //------------------------------------------------------------
    var ddlBox;
    var txtDateFrom;
    var txtDateTo;
    var CashType;
    var Rd_detail;
    var btnReset;
    //--- Print Buttons
    var btnPrint;
    var btnPrintTrview;
    var btnPrintTrPDF;
    var btnPrintTrEXEL;
    var chk_Certified;
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);
    function InitalizeComponent() {
        debugger;
        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = "كشف حساب صندوق ";
        }
        else {
            document.getElementById('Screen_name').innerHTML == "Box Account Statment";
        }
        $('#btnPrint').addClass('display_none');
        $("#iconMainPages").addClass("d-none");
        $("#iconReportPages").removeClass("d-none");
        $("#btnPrintTrview").addClass("print-report");
        $("#btnPrintTrview span").text("عرض تقرير");
        InitalizeControls();
        InitalizeEvents();
        txtDateFrom.value = DateFormat(SysSession.CurrentEnvironment.StartDate);
        txtDateTo.value = ConvertToDateDash(GetDate()) <= ConvertToDateDash(SysSession.CurrentEnvironment.EndDate) ? GetDate() : SysSession.CurrentEnvironment.EndDate;
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);
        fillddlBox();
        Rd_detail.checked = true;
        CashType.checked = true;
    }
    CashBoxAccount.InitalizeComponent = InitalizeComponent;
    function InitalizeControls() {
        ddlBox = document.getElementById("ddlBox");
        txtDateFrom = document.getElementById("txtFromDate");
        txtDateTo = document.getElementById("txtToDate");
        btnReset = document.getElementById("btnReset");
        Rd_detail = document.getElementById("Rd_detail");
        CashType = document.getElementById("CashType");
        chk_Certified = document.getElementById("chk_Certified");
        //---------------------------------------------------------------------- Print Buttons
        btnPrint = document.getElementById("btnPrint");
        btnPrintTrview = document.getElementById("btnPrintTrview");
        btnPrintTrPDF = document.getElementById("btnPrintTrPDF");
        btnPrintTrEXEL = document.getElementById("btnPrintTrEXEL");
    }
    function InitalizeEvents() {
        btnReset.onclick = btnReset_onclick;
        // Print Buttons
        btnPrintTrview.onclick = function () { PrintReport(1); };
        btnPrintTrPDF.onclick = function () { PrintReport(2); };
        btnPrintTrEXEL.onclick = function () { PrintReport(3); };
        btnPrint.onclick = function () { PrintReport(4); };
    }
    function fillddlBox() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefBox", "GetAll"),
            data: {
                CompCode: compcode, BranchCode: BranchCode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token, ModuleCode: Modules.CashBoxAccount, FinYear: SysSession.CurrentEnvironment.CurrentYear
            },
            //success: (d) => {
            //    let result = d as BaseResponse;
            //    if (result.IsSuccess) {
            //        Details_Box = result.Response as Array<A_RecPay_D_CashBox>;
            //        DocumentActions.FillCombowithdefult(Details_Box, ddlBox, "CashBoxID", "BRA_DESC", "اختر الصندوق")
            //    }
            //}
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    Details_Box = result.Response;
                    for (var i = 0; i < Details_Box.length; i++) {
                        $('#ddlBox').append('<option value="' + Details_Box[i].CashBoxID + '">' + (lang == "ar" ? Details_Box[i].CashBox_DescA : Details_Box[i].CashBox_DescE) + '</option>');
                    }
                }
            }
        });
    }
    function GetDate() {
        var today = new Date();
        var dd = today.getDate().toString();
        var ReturnedDate;
        var mm = (today.getMonth() + 1).toString();
        var yyyy = today.getFullYear();
        if (Number(dd) < 10) {
            dd = ('0' + dd);
        }
        if (Number(mm) < 10) {
            mm = ('0' + mm);
        }
        ReturnedDate = yyyy + '-' + mm + '-' + dd;
        return ReturnedDate;
    }
    function btnReset_onclick() {
        txtDateFrom.value = DateFormat(SysSession.CurrentEnvironment.StartDate);
        txtDateTo.value = ConvertToDateDash(GetDate()) <= ConvertToDateDash(SysSession.CurrentEnvironment.EndDate) ? GetDate() : SysSession.CurrentEnvironment.EndDate;
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        InitalizeComponent();
        ddlBox.value = "Null";
        chk_Certified.checked = true;
        Rd_detail.checked = true;
        CashType.checked = true;
    }
    //----------------------------------------------------( Report )
    function PrintReport(OutType) {
        var rp = new ReportParameters();
        rp.CompCode = SysSession.CurrentEnvironment.CompCode;
        rp.BranchCode = SysSession.CurrentEnvironment.BranchCode;
        rp.CompNameA = SysSession.CurrentEnvironment.CompanyNameAr;
        rp.CompNameE = SysSession.CurrentEnvironment.CompanyName;
        rp.UserCode = SysSession.CurrentEnvironment.UserCode;
        rp.Tokenid = SysSession.CurrentEnvironment.Token;
        var BranchNameA = SysSession.CurrentEnvironment.BranchName;
        var BranchNameE = SysSession.CurrentEnvironment.BranchNameEn;
        rp.ScreenLanguage = SysSession.CurrentEnvironment.ScreenLanguage;
        rp.SystemCode = SysSession.CurrentEnvironment.SystemCode;
        rp.SubSystemCode = SysSession.CurrentEnvironment.SubSystemCode;
        if (BranchNameA == null || BranchNameE == null) {
            BranchNameA = " ";
            BranchNameE = " ";
        }
        rp.BraNameA = BranchNameA;
        rp.BraNameE = BranchNameE;
        rp.LoginUser = SysSession.CurrentEnvironment.UserCode;
        rp.RepType = OutType; //output report as View
        rp.FromDate = DateFormatRep(txtDateFrom.value);
        rp.ToDate = DateFormatRep(txtDateTo.value);
        if ($("#ddlBox").val() == "Null") { //-------------جميع الصناديق 
            rp.BoxId = -1;
        }
        else {
            rp.BoxId = Number($("#ddlBox").val());
        }
        if (chk_Certified.checked == true)
            rp.Status = 3;
        else
            rp.Status = 1;
        rp.CashType = CashType.checked == true ? 1 : 2;
        if (Rd_detail.checked == true) { //******  تقرير تفصيلي  
            rp.check = 1;
            Ajax.Callsync({
                url: Url.Action("IProc_Rpt_AccBoxDetail", "GeneralReports"),
                data: rp,
                success: function (d) {
                    var result = d.result;
                    window.open(result, "_blank");
                }
            });
        }
        else { //******  تقرير ملخص   
            rp.check = 2;
            Ajax.Callsync({
                url: Url.Action("IProc_Rpt_AccBoxSummary", "GeneralReports"),
                data: rp,
                success: function (d) {
                    var result = d.result;
                    window.open(result, "_blank");
                }
            });
        }
    }
})(CashBoxAccount || (CashBoxAccount = {}));
//# sourceMappingURL=CashBoxAccount.js.map