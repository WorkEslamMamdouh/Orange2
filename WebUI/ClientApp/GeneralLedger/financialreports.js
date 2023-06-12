$(document).ready(function () {
    financialreports.InitalizeComponent();
});
var financialreports;
(function (financialreports) {
    var compcode;
    var AccountType = 1;
    var sys = new SystemTools();
    var SysSession = GetSystemSession(Modules.financialreports);
    var txtFromDate;
    var txtToDate;
    var CostCenterDetails = new G_COST_CENTER();
    var chkview;
    var chk_Certified;
    var chk_New;
    var chkLandscapePrint;
    var chkLengthPrint;
    var frmdate;
    // Print Buttons
    var btnPrint;
    var btnPrintTrview;
    var btnPrintTrPDF;
    var btnPrintTrEXEL;
    var Is_h_Enable;
    var IsAEnable;
    var IsBEnable;
    var btnReset;
    var btnCCostSearch;
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);
    function InitalizeComponent() {
        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = "التقارير المالية";
        }
        else {
            document.getElementById('Screen_name').innerHTML == "[Financial Reports";
        }
        $("#iconMainPages").addClass("d-none");
        $("#iconReportPages").removeClass("d-none");
        $("#btnPrintTrview").addClass("print-report");
        $("#btnPrintTrview span").text("عرض تقرير");
        InitalizeControls();
        InitalizeEvents();
        txtFromDate.value = DateStartMonth();
        txtToDate.value = ConvertToDateDash(GetDate()) <= ConvertToDateDash(SysSession.CurrentEnvironment.EndDate) ? GetDate() : SysSession.CurrentEnvironment.EndDate;
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        chkview.checked = false;
        chk_Certified.checked = false;
        chk_New.checked = false;
        IsAEnable.checked = true;
        enableDisableCost();
        chkLandscapePrint.checked = true;
    }
    financialreports.InitalizeComponent = InitalizeComponent;
    function InitalizeControls() {
        txtFromDate = document.getElementById("txtFromDate");
        txtToDate = document.getElementById("txtToDate");
        frmdate = document.getElementById("frmdate");
        btnCCostSearch = document.getElementById("btnCCostSearch");
        IsAEnable = document.getElementById("IsAEnable");
        Is_h_Enable = document.getElementById("Is_h_Enable");
        IsBEnable = document.getElementById("IsBEnable");
        chkview = document.getElementById("chkview");
        chk_Certified = document.getElementById("chk_Certified");
        chk_New = document.getElementById("chk_New");
        btnReset = document.getElementById("btnReset");
        chkLandscapePrint = document.getElementById("chkLandscapePrint");
        chkLengthPrint = document.getElementById("chkLengthPrint");
        //---------------------------------------------------------------------- Print Buttons
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
        btnReset.onclick = btnReset_onclick;
        btnCCostSearch.onclick = btnCCostSearch_onclick;
        Is_h_Enable.onclick = enableDisableCost;
        IsAEnable.onclick = enableDisableCost;
        IsBEnable.onclick = enableDisableCost;
    }
    function enableDisableCost() {
        var Is_h_Enable = ($('#Is_h_Enable').is(':checked'));
        var IsAEnable = ($('#IsAEnable').is(':checked'));
        if (Is_h_Enable == true || IsAEnable == true) {
            $("#btnCCostSearch").fadeOut("fast");
            $("#txtCenter_Cost_ID").fadeOut("fast");
            $("#txtCenter_Cost_DESC").fadeOut("fast");
            $("#CostCenterl").fadeOut("fast");
        }
        else {
            $("#btnCCostSearch").fadeIn("slow");
            $("#txtCenter_Cost_ID").fadeIn("slow");
            $("#txtCenter_Cost_DESC").fadeIn("slow");
            $("#CostCenterl").fadeIn("slow");
        }
        if (Is_h_Enable == true) {
            $("#txtToDate").fadeOut("fast");
            $("#todate").fadeOut("fast");
            frmdate.innerHTML = 'في تاريخ';
        }
        else {
            $("#txtToDate").fadeIn("slow");
            $("#todate").fadeIn("slow");
        }
    }
    function btnCCostSearch_onclick() {
        debugger;
        var sys = new SystemTools();
        sys.FindKey(Modules.Accountstatement, "btnCCostSearch", "COMP_CODE=" + compcode + " ", function () {
            var id = SearchGrid.SearchDataGrid.SelectedKey;
            $('#txtCenter_Cost_ID').val(id);
            GetCostCenterByCode(id);
            $('#txtCenter_Cost_DESC').val((lang == "ar" ? CostCenterDetails.CC_DESCA : CostCenterDetails.CC_DESCE));
        });
    }
    function GetCostCenterByCode(CC_Code) {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("CostCenter", "GetByCostCntreCode"),
            data: { CompCode: compcode, CostCntreCode: CC_Code, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    CostCenterDetails = result.Response;
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
        debugger;
        txtFromDate.value = DateFormat(SysSession.CurrentEnvironment.StartDate);
        txtToDate.value = ConvertToDateDash(GetDate()) <= ConvertToDateDash(SysSession.CurrentEnvironment.EndDate) ? GetDate() : SysSession.CurrentEnvironment.EndDate;
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        discharge();
        chkview.checked = false;
        chk_Certified.checked = false;
        chk_New.checked = false;
    }
    function discharge() {
        $('#txtFromAcc_ID').val("");
        $('#txtFromAcc_DESC').val("");
        $('#txtCenter_Cost_ID').val("");
        $('#txtCenter_Cost_DESC').val("");
        $('#txtToAcc_ID').val("");
        $('#txtToAcc_DESC').val("");
        $('#txt_ID_level').val("Null");
    }
    //----------------------------------------------------( Report )
    function PrintReport(OutType) {
        debugger;
        var rp = new ReportParameters();
        rp.RepType = OutType; //output report as View
        rp.FromDate = DateFormatRep(txtFromDate.value);
        rp.ToDate = DateFormatRep(txtToDate.value);
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
        rp.FromDate = DateFormatRep(txtFromDate.value);
        rp.ToDate = DateFormatRep(txtToDate.value);
        if (chkview.checked == true) //-----------------------------------( Hide zero accounts )
         {
            rp.exzero = 1;
        }
        else {
            rp.exzero = 0;
        }
        if (chk_Certified.checked == true) //------------------------------------( Inclusion of certified restrictions )
         {
            rp.IsAuthVchr = 1;
        }
        else {
            rp.IsAuthVchr = 0;
        }
        if (chk_New.checked == true) //-------------------------------------( Inclusion of new restrictions )
         {
            rp.IsNewVchr = 1;
        }
        else {
            rp.IsNewVchr = 0;
        }
        if (IsAEnable.checked == true) //-------------------------------------( Trail balance)
         {
            rp.Typ = 1;
            rp.cc_code = "-1"; //-----------------------------( cost center )
        }
        else if (IsBEnable.checked == true) //-------------------------------------( Income )
         {
            rp.Typ = 2;
            if ($('#txtCenter_Cost_ID').val() == "") {
                rp.cc_code = "-1";
            }
            else {
                rp.cc_code = $('#txtCenter_Cost_ID').val(); //-----------------------------( cost center )
            }
        }
        else //-------------------------------------( balance sheet )
         {
            rp.Typ = 3;
            rp.cc_code = "-1"; //-----------------------------( cost center )
            rp.FromDate = DateFormatRep(SysSession.CurrentEnvironment.StartDate);
            rp.ToDate = DateFormatRep(txtFromDate.value);
        }
        if ($('#txt_ID_level').val() == "Null") {
            rp.Level = -1;
        }
        else {
            rp.Level = $('#txt_ID_level').val();
        }
        var ccd = $('#txtCenter_Cost_DESC').val();
        var ccI = $('#txtCenter_Cost_ID').val();
        if (chkLandscapePrint.checked == true) {
            rp.check = 1;
        }
        else {
            rp.check = 0;
        }
        debugger;
        Ajax.Callsync({
            url: Url.Action("AProc_Rpt_GLFinancialStatment", "GeneralReports"),
            data: rp,
            success: function (d) {
                var result = d.result;
                window.open(result, "_blank");
            }
        });
    }
})(financialreports || (financialreports = {}));
//# sourceMappingURL=financialreports.js.map