$(document).ready(function () {
    UserActLog.InitalizeComponent();
});
var UserActLog;
(function (UserActLog) {
    var compcode;
    var BranchCode;
    var sys = new SystemTools();
    var SysSession = GetSystemSession(Modules.UserActLog);
    /*----------------------------------------------------------------- Input Control------------------------------------------------------------------ */
    var Screen_name;
    var txtFromDate;
    var txtToDate;
    var txtFromTime;
    var txtToTime;
    var repUser;
    var repTitle;
    var repTitle;
    var repDate;
    var drpUser;
    var drpTitle;
    var drpOpr;
    var drpFinYear;
    var drpstatus;
    /*----------------------------------------------------------------- Button Control------------------------------------------------------------------ */
    var btnReset;
    //--- Print Buttons
    var btnPrint;
    var btnPrintTrview;
    var btnPrintTrPDF;
    var btnPrintTrEXEL;
    /*----------------------------------------------------------------- Variable --------------------------------------------------------------------- */
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);
    function InitalizeComponent() {
        InitalizeControls();
        InitalizeEvents();
        $("#iconMainPages").addClass("d-none");
        $("#iconReportPages").removeClass("d-none");
        $("#btnPrintTrview").addClass("print-report");
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        BranchCode = Number(sys.SysSession.CurrentEnvironment.BranchCode);
        Screen_name.innerHTML = lang == "ar" ? "تقرير نشاط المستخدمين" : "User Activity Report";
        document.title = "Safe Student 1.0-" + (lang == "ar" ? "تقرير نشاط المستخدمين" : "User Activity Report");
        txtFromDate.value = DateFormat(SysSession.CurrentEnvironment.StartDate);
        txtToDate.value = DateFormat(ConvertToDateDash(GetDate()) <= ConvertToDateDash(SysSession.CurrentEnvironment.EndDate) ? GetDate() : SysSession.CurrentEnvironment.EndDate);
        txtFromTime.value = "00:00:00";
        txtToTime.value = "23:59:00";
        GetData_Header_loader();
    }
    UserActLog.InitalizeComponent = InitalizeComponent;
    function InitalizeControls() {
        /*----------------------------------------------------------------- Input Control------------------------------------------------------------------ */
        Screen_name = document.getElementById("Screen_name");
        txtFromDate = document.getElementById("txtFromDate");
        txtToDate = document.getElementById("txtToDate");
        txtFromTime = document.getElementById("txtFromTime");
        txtToTime = document.getElementById("txtToTime");
        repUser = document.getElementById("repUser");
        repTitle = document.getElementById("repTitle");
        repTitle = document.getElementById("repTitle");
        repDate = document.getElementById("repDate");
        drpUser = document.getElementById("drpUser");
        drpTitle = document.getElementById("drpTitle");
        drpOpr = document.getElementById("drpOpr");
        drpFinYear = document.getElementById("drpFinYear");
        drpstatus = document.getElementById("drpstatus");
        /*----------------------------------------------------------------- Button Control------------------------------------------------------------------ */
        btnReset = document.getElementById("btnReset");
        //--- Print Buttons
        btnPrint = document.getElementById("btnPrint");
        btnPrintTrview = document.getElementById("btnPrintTrview");
        btnPrintTrPDF = document.getElementById("btnPrintTrPDF");
        btnPrintTrEXEL = document.getElementById("btnPrintTrEXEL");
    }
    function InitalizeEvents() {
        // Print Buttons
        btnPrintTrview.onclick = function () { PrintReport(1); };
        btnPrintTrPDF.onclick = function () { PrintReport(2); };
        btnPrintTrEXEL.onclick = function () { PrintReport(3); };
        btnPrint.onclick = function () { PrintReport(4); };
    }
    /*----------------------------------------------------------------- Get Func------------------------------------------------------------------ */
    function GetData_Header_loader() {
        var Table;
        Table =
            [
                { NameTable: 'G_USERS', Condition: " CompCode = " + compcode + " " },
                { NameTable: 'G_MODULES', Condition: "" },
                { NameTable: 'G_Codes', Condition: "CodeType = 'UserLog'" },
                { NameTable: 'G_CONTROL', Condition: " COMP_CODE = " + compcode + "" },
            ];
        DataResult(Table);
        debugger;
        FillDropwithAttr(GetDataTable('G_USERS'), "drpUser", "USER_CODE", "USER_CODE", (lang == "ar" ? "الجميع" : "All"), "", "");
        FillDropwithAttr(GetDataTable('G_MODULES'), "drpTitle", "MODULE_CODE", (lang == "ar" ? "MODULE_DESCA" : "MODULE_DESCE"), (lang == "ar" ? "الجميع" : "All"), "SysCode", "SYSTEM_CODE");
        FillDropwithAttr(GetDataTable('G_Codes'), "drpOpr", "CodeValue", (lang == "ar" ? "DescA" : "DescE"), (lang == "ar" ? "الجميع" : "All"), "", "");
        FillDropwithAttr(GetDataTable('G_CONTROL'), "drpFinYear", "FIN_YEAR", "FIN_YEAR", (lang == "ar" ? "الجميع" : "All"), "", "");
    }
    /*----------------------------------------------------------------- Rep Func------------------------------------------------------------------ */
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
        rp.RepType = OutType;
        //--------------------GroupType
        if (repUser.checked) {
            rp.Typ = 1;
        }
        else if (repTitle.checked) {
            rp.Typ = 2;
        }
        else {
            rp.Typ = 3;
        }
        debugger;
        rp.FromDate = DateFormatRep(txtFromDate.value);
        rp.ToDate = DateFormatRep(txtToDate.value);
        rp.FromTime = DateFormatRep(txtFromTime.value);
        rp.ToTime = DateFormatRep(txtToTime.value);
        rp.FinYear = drpFinYear.value == "Null" ? -1 : Number(drpFinYear.value);
        rp.SysCode = drpTitle.value == "Null" ? "-1" : $('option:selected', $("#drpTitle")).attr('data-syscode');
        rp.Module = drpTitle.value == "Null" ? "-1" : drpTitle.value;
        rp.User_Code = drpUser.value == "Null" ? "-1" : drpUser.value;
        rp.OperationId = drpOpr.value == "Null" ? -1 : Number(drpOpr.value);
        rp.OprStatus = drpstatus.value == "Null" ? -1 : Number(drpstatus.value);
        Ajax.Callsync({
            url: Url.Action("Rep_UserActivityLog", "GeneralReports"),
            data: rp,
            success: function (d) {
                var result = d.result;
                PrintReportLog(SysSession.CurrentEnvironment.UserCode, SysSession.CurrentEnvironment.CompCode, SysSession.CurrentEnvironment.BranchCode, Modules.Inventorymove, SysSession.CurrentEnvironment.CurrentYear);
                window.open(result, "_blank");
            }
        });
    }
})(UserActLog || (UserActLog = {}));
//# sourceMappingURL=UserActLog.js.map