$(document).ready(function () {
    UserActLogSum.InitalizeComponent();
});
var UserActLogSum;
(function (UserActLogSum) {
    var compcode;
    var BranchCode;
    var sys = new SystemTools();
    var SysSession = GetSystemSession(Modules.UserActLogSum);
    var BranchModules = new Array();
    /*----------------------------------------------------------------- Input Control------------------------------------------------------------------ */
    var Screen_name;
    var txtFromDate;
    var txtToDate;
    var repUser;
    var repTitle;
    var drpUser;
    var drpTitle;
    var drpBranch;
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
        BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);
        Screen_name.innerHTML = lang == "ar" ? "تقرير نشاط المستخدمين" : "User Activity Report";
        document.title = " نظام اورانج " + (lang == "ar" ? "تقرير نشاط المستخدمين" : "User Activity Report");
        txtFromDate.value = DateFormat(SysSession.CurrentEnvironment.StartDate);
        txtToDate.value = DateFormat(ConvertToDateDash(GetDate()) <= ConvertToDateDash(SysSession.CurrentEnvironment.EndDate) ? GetDate() : SysSession.CurrentEnvironment.EndDate);
        GetData_Header_loader();
        GetBranchModules();
    }
    UserActLogSum.InitalizeComponent = InitalizeComponent;
    function InitalizeControls() {
        /*----------------------------------------------------------------- Input Control------------------------------------------------------------------ */
        Screen_name = document.getElementById("Screen_name");
        txtFromDate = document.getElementById("txtFromDate");
        txtToDate = document.getElementById("txtToDate");
        repUser = document.getElementById("repUser");
        repTitle = document.getElementById("repTitle");
        repTitle = document.getElementById("repTitle");
        drpUser = document.getElementById("drpUser");
        drpTitle = document.getElementById("drpTitle");
        drpBranch = document.getElementById("drpBranch");
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
        drpBranch.onchange = GetBranchModules;
    }
    /*----------------------------------------------------------------- Get Func------------------------------------------------------------------ */
    function GetData_Header_loader() {
        var Table;
        Table =
            [
                { NameTable: 'G_USERS', Condition: " CompCode = " + compcode + " " },
                { NameTable: 'G_BRANCH', Condition: " COMP_CODE = " + compcode + "" },
            ];
        DataResult(Table);
        FillDropwithAttr(GetDataTable('G_USERS'), "drpUser", "USER_CODE", "USER_CODE", (lang == "ar" ? "الجميع" : "All"), "", "");
        FillDropwithAttr(GetDataTable('G_BRANCH'), "drpBranch", "BRA_CODE", "BRA_DESC", (lang == "ar" ? "الجميع" : "All"), "", "");
    }
    function GetBranchModules() {
        var BraCode = drpBranch.value == "Null" ? -1 : Number(drpBranch.value);
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GBranch", "GetBranchModules"),
            data: { CompCode: compcode, BranchCode: BraCode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    debugger;
                    BranchModules = result.Response;
                    FillDropwithAttr(BranchModules, "drpTitle", "MODULE_CODE", (lang == "ar" ? "MODULE_DESCA" : "MODULE_DESCE"), (lang == "ar" ? "الجميع" : "All"), "", "");
                }
            }
        });
    }
    /*----------------------------------------------------------------- Rep Func------------------------------------------------------------------ */
    function PrintReport(OutType) {
        var rp = new ReportParameters();
        rp.CompCode = SysSession.CurrentEnvironment.CompCode;
        rp.BranchCode = SysSession.CurrentEnvironment.BranchCode;
        rp.CompNameA = SysSession.CurrentEnvironment.CompanyNameAr;
        rp.CompNameE = SysSession.CurrentEnvironment.CompanyName;
        rp.UserCode = SysSession.CurrentEnvironment.UserCode;
        rp.Tokenid = "HGFD-" + SysSession.CurrentEnvironment.Token;
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
        rp.braCode = drpBranch.value == "Null" ? -1 : Number(drpBranch.value);
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
        rp.SysCode = drpTitle.value == "Null" ? "-1" : $('option:selected', $("#drpTitle")).attr('data-syscode');
        rp.Module = drpTitle.value == "Null" ? "-1" : drpTitle.value;
        rp.User_Code = drpUser.value == "Null" ? "-1" : drpUser.value;
        rp.Typ = repUser.checked == true ? 1 : 0;
        Ajax.Callsync({
            url: Url.Action("Rep_UserActivitySummary", "GeneralReports"),
            data: rp,
            success: function (d) {
                var result = d.result;
                PrintReportLog(SysSession.CurrentEnvironment.UserCode, SysSession.CurrentEnvironment.CompCode, SysSession.CurrentEnvironment.BranchCode, Modules.Inventorymove, SysSession.CurrentEnvironment.CurrentYear);
                window.open(result, "_blank");
            }
        });
    }
})(UserActLogSum || (UserActLogSum = {}));
//# sourceMappingURL=UserActLogSum.js.map