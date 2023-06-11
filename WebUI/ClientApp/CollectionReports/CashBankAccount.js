$(document).ready(function () {
    CashBankAccount.InitalizeComponent();
});
var CashBankAccount;
(function (CashBankAccount) {
    var compcode;
    var BranchCode;
    var AccountType = 1;
    var sys = new SystemTools();
    var SysSession = GetSystemSession(Modules.CashBankAccount);
    //------------------------------------------------------------
    var Details_ACCOUNT = new Array();
    //------------------------------------------------------------
    var ddlBox;
    var txtDateFrom;
    var txtDateTo;
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
        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = "كشف حساب بنك ";
        }
        else {
            document.getElementById('Screen_name').innerHTML == "Bank Account Statment";
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
        fillddlBank();
        Rd_detail.checked = true;
    }
    CashBankAccount.InitalizeComponent = InitalizeComponent;
    function InitalizeControls() {
        ddlBox = document.getElementById("ddlBox");
        txtDateFrom = document.getElementById("txtFromDate");
        txtDateTo = document.getElementById("txtToDate");
        btnReset = document.getElementById("btnReset");
        Rd_detail = document.getElementById("Rd_detail");
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
    function fillddlBank() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GLDefAccount", "GetBankAcc"),
            data: {
                CompCode: compcode, AccType: 3, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    Details_ACCOUNT = result.Response;
                    for (var i = 0; i < Details_ACCOUNT.length; i++) {
                        $('#ddlBox').append('<option value="' + Details_ACCOUNT[i].ACC_CODE + '">' + (lang == "ar" ? Details_ACCOUNT[i].ACC_DESCA : Details_ACCOUNT[i].ACC_CODE) + '</option>');
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
        if ($("#ddlBox").val() == "Null" && $("#ddlBox").val() == "-1") { //-------------جميع الصناديق
            rp.BankCode = '';
        }
        else {
            rp.BankCode = $("#ddlBox").val();
        }
        if (chk_Certified.checked == true)
            rp.Status = 3;
        else
            rp.Status = 1;
        if (Rd_detail.checked == true) { //******  تقرير تفصيلي  
            rp.check = 1;
            Ajax.Callsync({
                url: Url.Action("IProc_Rpt_AccBankDetail", "GeneralReports"),
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
                url: Url.Action("IProc_Rpt_AccBankSummary", "GeneralReports"),
                data: rp,
                success: function (d) {
                    var result = d.result;
                    window.open(result, "_blank");
                }
            });
        }
    }
})(CashBankAccount || (CashBankAccount = {}));
//# sourceMappingURL=CashBankAccount.js.map