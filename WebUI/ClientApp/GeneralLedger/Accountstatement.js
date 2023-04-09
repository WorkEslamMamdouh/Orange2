$(document).ready(function () {
    Accountstatement.InitalizeComponent();
});
var Accountstatement;
(function (Accountstatement) {
    var compcode;
    var AccountType = 1;
    var sys = new SystemTools();
    var SysSession = GetSystemSession(Modules.Accountstatement);
    var txtFromDate;
    var txtToDate;
    var AccountDetails = new A_ACCOUNT();
    var CostCenterDetails = new G_COST_CENTER();
    var chkview;
    var chk_Certified;
    var chk_New;
    var chk_IncludeInvTR;
    var btnReset;
    // Print Buttons
    var btnPrint;
    var btnPrintTrview;
    var btnPrintTrPDF;
    var btnPrintTrEXEL;
    var btnFromAccSearch;
    var btnToAccSearch;
    var btnCCostSearch;
    var txtFromAcc_ID;
    var txtFromAcc_DESC;
    var txtToAcc_ID;
    var txtToAcc_DESC;
    var txtCenter_Cost_ID;
    var txtCenter_Cost_DESC;
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);
    function InitalizeComponent() {
        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = "كشف حساب ";
        }
        else {
            document.getElementById('Screen_name').innerHTML == "Account Statment";
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
        chk_IncludeInvTR.checked = false;
        $('#btnPrint').addClass('display_none');
        txtFromAcc_ID.disabled = false;
        txtToAcc_ID.disabled = false;
        txtCenter_Cost_ID.disabled = false;
    }
    Accountstatement.InitalizeComponent = InitalizeComponent;
    function InitalizeControls() {
        txtFromDate = document.getElementById("txtFromDate");
        txtToDate = document.getElementById("txtToDate");
        btnFromAccSearch = document.getElementById("btnFromAccSearch");
        txtFromAcc_ID = document.getElementById("txtFromAcc_ID");
        txtFromAcc_DESC = document.getElementById("txtFromAcc_DESC");
        txtToAcc_ID = document.getElementById("txtToAcc_ID");
        txtToAcc_DESC = document.getElementById("txtToAcc_DESC");
        txtCenter_Cost_ID = document.getElementById("txtCenter_Cost_ID");
        txtCenter_Cost_DESC = document.getElementById("txtCenter_Cost_DESC");
        btnToAccSearch = document.getElementById("btnToAccSearch");
        btnCCostSearch = document.getElementById("btnCCostSearch");
        chkview = document.getElementById("chkview");
        chk_Certified = document.getElementById("chk_Certified");
        chk_New = document.getElementById("chk_New");
        chk_IncludeInvTR = document.getElementById("chk_IncludeInvTR");
        btnReset = document.getElementById("btnReset");
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
        btnFromAccSearch.onclick = btnFromAccSearch_onclick;
        txtFromAcc_ID.onchange = txtFromAcc_ID_onchange;
        btnToAccSearch.onclick = btnToAccSearch_onclick;
        txtToAcc_ID.onchange = txtToAcc_ID_onchange;
        btnCCostSearch.onclick = btnCCostSearch_onclick;
        txtCenter_Cost_ID.onchange = txtCenter_Cost_ID_onchange;
        btnReset.onclick = btnReset_onclick;
    }
    function btnFromAccSearch_onclick() {
        sys.FindKey(Modules.Accountstatement, "btnFromAccSearch", "COMP_CODE= " + compcode + " and DETAIL = 1 ", function () {
            var id = SearchGrid.SearchDataGrid.SelectedKey;
            $('#txtFromAcc_ID').val(id);
            GetAccByCode(id);
            $('#txtFromAcc_DESC').val((lang == "ar" ? AccountDetails.ACC_DESCA : AccountDetails.ACC_DESCL));
            $('#txtToAcc_ID').val(id);
            $('#txtToAcc_DESC').val((lang == "ar" ? AccountDetails.ACC_DESCA : AccountDetails.ACC_DESCL));
        });
    }
    function btnToAccSearch_onclick() {
        sys.FindKey(Modules.Accountstatement, "btnFromAccSearch", "COMP_CODE= " + compcode + " and DETAIL = 1 ", function () {
            var id = SearchGrid.SearchDataGrid.SelectedKey;
            $('#txtToAcc_ID').val(id);
            GetAccByCode(id);
            $('#txtToAcc_DESC').val((lang == "ar" ? AccountDetails.ACC_DESCA : AccountDetails.ACC_DESCL));
        });
    }
    function btnCCostSearch_onclick() {
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
                    debugger;
                    if (CostCenterDetails == null) {
                        txtCenter_Cost_ID.value = "";
                        // txtCenter_Cost_DESC.value = "";
                        $('#txtCenter_Cost_DESC').val("");
                        Errorinput(txtCenter_Cost_ID);
                        DisplayMassage("كود التكلفة غير صحيح", "Wrong Account cost", MessageType.Error);
                    }
                    else {
                        $('#txtCenter_Cost_ID').val(CostCenterDetails.CC_CODE);
                        $('#txtCenter_Cost_DESC').val(CostCenterDetails.CC_DESCA);
                    }
                }
            }
        });
    }
    function GetAccByCode(AccCode) {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GLDefAccount", "GetByAccCode"),
            data: { CompCode: compcode, AccCode: AccCode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    AccountDetails = result.Response;
                    //debugger
                    //if (AccountDetails == null) {
                    //    txtFromAcc_ID.value = "";
                    //    txtFromAcc_DESC.value = "";
                    //    Errorinput(txtFromAcc_ID);
                    //    DisplayMassage("كود الحساب غير صحيح", "Wrong Account code", MessageType.Error);
                    //}
                    //else {
                    //    $('#txtFromAcc_ID').val(AccountDetails.ACC_CODE);
                    //    $('#txtFromAcc_DESC').val(AccountDetails.ACC_DESCA);
                    //}
                }
            }
        });
    }
    function txtFromAcc_ID_onchange() {
        GetAccByCode(txtFromAcc_ID.value);
        if (AccountDetails == null) {
            txtFromAcc_ID.value = "";
            txtFromAcc_DESC.value = "";
            Errorinput(txtFromAcc_ID);
            DisplayMassage("كود الحساب غير صحيح", "Wrong Account code", MessageType.Error);
        }
        else {
            $('#txtFromAcc_ID').val(AccountDetails.ACC_CODE);
            $('#txtFromAcc_DESC').val(AccountDetails.ACC_DESCA);
            $('#txtToAcc_ID').val(AccountDetails.ACC_CODE);
            $('#txtToAcc_DESC').val(AccountDetails.ACC_DESCA);
        }
    }
    function txtToAcc_ID_onchange() {
        GetAccByCode(txtToAcc_ID.value);
        if (AccountDetails == null) {
            txtToAcc_ID.value = "";
            txtToAcc_DESC.value = "";
            Errorinput(txtToAcc_ID);
            DisplayMassage("كود الحساب غير صحيح", "Wrong Account code", MessageType.Error);
        }
        else {
            $('#txtToAcc_ID').val(AccountDetails.ACC_CODE);
            $('#txtToAcc_DESC').val(AccountDetails.ACC_DESCA);
        }
    }
    function txtCenter_Cost_ID_onchange() {
        txtCenter_Cost_DESC.value = "";
        GetCostCenterByCode(txtCenter_Cost_ID.value);
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
        txtFromDate.value = DateFormat(SysSession.CurrentEnvironment.StartDate);
        txtToDate.value = ConvertToDateDash(GetDate()) <= ConvertToDateDash(SysSession.CurrentEnvironment.EndDate) ? GetDate() : SysSession.CurrentEnvironment.EndDate;
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        discharge();
        chkview.checked = false;
        chk_Certified.checked = false;
        chk_New.checked = false;
        chk_IncludeInvTR.checked = false;
        //txtFromAcc_ID.disabled = false;
        //txtFromAcc_ID.value = "";
        //txtFromAcc_DESC.value = "";
        //txtToAcc_ID.disabled = false;
        //txtToAcc_ID.value = "";
        //txtToAcc_DESC.value = "";
        //txtCenter_Cost_ID.disabled = false;
        //txtCenter_Cost_ID.value = "";
        //txtCenter_Cost_DESC.value = "";
    }
    function discharge() {
        $('#txtFromAcc_ID').val("");
        $('#txtFromAcc_DESC').val("");
        $('#txtCenter_Cost_ID').val("");
        $('#txtCenter_Cost_DESC').val("");
        $('#txtToAcc_ID').val("");
        $('#txtToAcc_DESC').val("");
    }
    //----------------------------------------------------( Report )
    function PrintReport(OutType) {
        if ($('#txtFromAcc_ID').val() == "" || $('#txtToAcc_ID').val() == "") {
            WorningMessage("يجب ادخال الحساب!", "Must Enter Account!", "تحذير", "worning");
            return;
        }
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
        rp.FromDate = DateFormatRep(txtFromDate.value);
        rp.ToDate = DateFormatRep(txtToDate.value);
        rp.IncludeInvTR = chk_IncludeInvTR.checked == true ? 1 : 0;
        if ($('#txtFromAcc_ID').val() == "") {
            rp.fromacc = "-1";
        }
        else {
            rp.fromacc = $('#txtFromAcc_ID').val();
        }
        if ($('#txtToAcc_ID').val() == "") {
            rp.toacc = "-1";
        }
        else {
            rp.toacc = $('#txtToAcc_ID').val();
        }
        if ($('#txtCenter_Cost_ID').val() == "") {
            rp.cc_code = "-1";
        }
        else {
            rp.cc_code = $('#txtCenter_Cost_ID').val();
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
        if (chkview.checked == true) //-----------------------------------( Hide zero accounts )
         {
            rp.exzero = 1;
        }
        else {
            rp.exzero = 0;
        }
        if ($('#txtFromAcc_ID').val() == "" || $('#txtToAcc_ID').val() == "") {
            MessageBox.Show("يجب اختيار الحساب", "تنبيه");
            return;
        }
        Ajax.Callsync({
            url: Url.Action("AProc_Rpt_GLAccountStatment", "GeneralReports"),
            data: rp,
            success: function (d) {
                var result = d.result;
                PrintReportLog(SysSession.CurrentEnvironment.UserCode, SysSession.CurrentEnvironment.CompCode, SysSession.CurrentEnvironment.BranchCode, Modules.Accountstatement, SysSession.CurrentEnvironment.CurrentYear);
                window.open(result, "_blank");
            }
        });
    }
})(Accountstatement || (Accountstatement = {}));
//# sourceMappingURL=Accountstatement.js.map