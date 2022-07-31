$(document).ready(function () {
    Accountbalances.InitalizeComponent();
});
var Accountbalances;
(function (Accountbalances) {
    var compcode;
    var AccountType = 1;
    var sys = new SystemTools();
    var SysSession = GetSystemSession(Modules.Accountbalances);
    var AccountDetails = new A_ACCOUNT();
    var CostCenterDetails = new G_COST_CENTER();
    var txtFromDate;
    var txtToDate;
    var btnReset;
    var chk_Certified;
    var chk_New;
    var IsMoveEnable;
    var IsE_termEnable;
    var IsF_termEnable;
    var IsF_AEnable;
    var IsM_AEnable;
    var IsE_AEnable;
    var Details_IsF_termEnable;
    var Details_IsM_AEnable;
    var Details_IsE_termEnable;
    var txtFromAcc_ID;
    var txtCenter_Cost_ID;
    var txtFromAcc_DESC;
    var txtCenter_Cost_DESC;
    var btnFromAccSearch;
    var btnCCostSearch;
    // Print Buttons
    var btnPrint;
    var btnPrintTrview;
    var btnPrintTrPDF;
    var btnPrintTrEXEL;
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);
    function InitalizeComponent() {
        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = "الاستاذ العام";
        }
        else {
            document.getElementById('Screen_name').innerHTML == "general ledger";
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
        chk_Certified.checked = false;
        chk_New.checked = false;
        IsF_AEnable.checked = true;
        IsM_AEnable.checked = true;
        IsE_AEnable.checked = true;
        $('#btnPrint').addClass('display_none');
        IsE_AEnable.checked = true;
        txtFromAcc_ID.disabled = false;
        txtCenter_Cost_ID.disabled = false;
    }
    Accountbalances.InitalizeComponent = InitalizeComponent;
    function InitalizeControls() {
        btnPrint = document.getElementById("btnPrint");
        txtFromDate = document.getElementById("txtFromDate");
        txtToDate = document.getElementById("txtToDate");
        btnFromAccSearch = document.getElementById("btnFromAccSearch");
        btnCCostSearch = document.getElementById("btnCCostSearch");
        IsF_AEnable = document.getElementById("IsF_AEnable");
        IsM_AEnable = document.getElementById("IsM_AEnable");
        IsE_AEnable = document.getElementById("IsE_AEnable");
        btnReset = document.getElementById("btnReset");
        txtFromAcc_ID = document.getElementById("txtFromAcc_ID");
        txtCenter_Cost_ID = document.getElementById("txtCenter_Cost_ID");
        txtFromAcc_DESC = document.getElementById("txtFromAcc_DESC");
        txtCenter_Cost_DESC = document.getElementById("txtCenter_Cost_DESC");
        chk_Certified = document.getElementById("chk_Certified");
        chk_New = document.getElementById("chk_New");
        //---------------------------------------------------------------------- Print Buttons
        btnPrint = document.getElementById("btnPrint");
        btnPrintTrview = document.getElementById("btnPrintTrview");
        btnPrintTrPDF = document.getElementById("btnPrintTrPDF");
        btnPrintTrEXEL = document.getElementById("btnPrintTrEXEL");
    }
    function InitalizeEvents() {
        btnFromAccSearch.onclick = btnFromAccSearch_onclick;
        txtFromAcc_ID.onchange = txtFromAcc_ID_onchange;
        btnCCostSearch.onclick = btnCCostSearch_onclick;
        txtCenter_Cost_ID.onchange = txtCenter_Cost_ID_onchange;
        btnReset.onclick = btnReset_onclick;
        // Print Buttons
        btnPrintTrview.onclick = function () { PrintReport(1); };
        btnPrintTrPDF.onclick = function () { PrintReport(2); };
        btnPrintTrEXEL.onclick = function () { PrintReport(3); };
        btnPrint.onclick = function () { PrintReport(4); };
    }
    //-----------------------------------------------------------------------   (  Button search from Account  )
    function btnFromAccSearch_onclick() {
        sys.FindKey(Modules.Accountbalances, "btnFromAccSearch", "COMP_CODE= " + compcode + " and DETAIL = 0 ", function () {
            var id = SearchGrid.SearchDataGrid.SelectedKey;
            $('#txtFromAcc_ID').val(id);
            GetAccByCode(id);
            $('#txtFromAcc_DESC').val((lang == "ar" ? AccountDetails.ACC_DESCA : AccountDetails.ACC_DESCL));
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
                    debugger;
                    if (AccountDetails == null) {
                        txtFromAcc_ID.value = "";
                        txtFromAcc_DESC.value = "";
                        Errorinput(txtFromAcc_ID);
                        DisplayMassage("كود الحساب غير صحيح", "Wrong Account code", MessageType.Error);
                    }
                    else {
                        $('#txtFromAcc_ID').val(AccountDetails.ACC_CODE);
                        $('#txtFromAcc_DESC').val(AccountDetails.ACC_DESCA);
                    }
                }
            }
        });
    }
    function txtFromAcc_ID_onchange() {
        txtFromAcc_DESC.value = "";
        GetAccByCode(txtFromAcc_ID.value);
    }
    //-----------------------------------------------------------------------   (  Button search Cost Center )
    function btnCCostSearch_onclick() {
        var sys = new SystemTools();
        sys.FindKey(Modules.Accountbalances, "btnCCostSearch", "COMP_CODE=" + compcode + "", function () {
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
    function txtCenter_Cost_ID_onchange() {
        txtCenter_Cost_DESC.value = "";
        GetCostCenterByCode(txtCenter_Cost_ID.value);
    }
    //-----------------------------------------------------------------------   (  Get Date  )
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
        discharge();
        chk_Certified.checked = false;
        chk_New.checked = false;
        IsF_AEnable.checked = true;
        IsM_AEnable.checked = true;
        IsE_AEnable.checked = true;
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
        if ($('#txtCenter_Cost_ID').val() == "") {
            rp.cc_code = "-1";
        }
        else {
            rp.cc_code = $('#txtCenter_Cost_ID').val();
        }
        if ($('#txtFromAcc_ID').val() == "") {
            rp.AccCode = "-1";
        }
        else {
            rp.AccCode = $('#txtFromAcc_ID').val();
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
        Details_IsF_termEnable = document.querySelector("input[name=IsF_termEnable]:checked");
        if (Details_IsF_termEnable.value == "D") {
            rp.OpenType = 1;
        }
        else if (Details_IsF_termEnable.value == "C") {
            rp.OpenType = 2;
        }
        else if (Details_IsF_termEnable.value == "Z") {
            rp.OpenType = 3;
        }
        else {
            rp.OpenType = 4;
        }
        Details_IsM_AEnable = document.querySelector("input[name=IsMoveEnable]:checked");
        if (Details_IsM_AEnable.value == "D") {
            rp.PrdType = 1;
        }
        else if (Details_IsM_AEnable.value == "C") {
            rp.PrdType = 2;
        }
        else if (Details_IsM_AEnable.value == "Z") {
            rp.PrdType = 3;
        }
        else {
            rp.PrdType = 4;
        }
        Details_IsE_termEnable = document.querySelector("input[name=IsE_termEnable]:checked");
        if (Details_IsE_termEnable.value == "D") {
            rp.EndType = 1;
        }
        else if (Details_IsE_termEnable.value == "C") {
            rp.EndType = 2;
        }
        else if (Details_IsE_termEnable.value == "Z") {
            rp.EndType = 3;
        }
        else {
            rp.EndType = 4;
        }
        if ($('#txtFromAcc_ID').val() == "") {
            //MessageBox.Show("يجب اختيار حساب الاستاذ", "تنبيه")
            WorningMessage("يجب اختيار حساب الاستاذ!", "Please Enter Account Number!", "خطأ", "Error");
            return;
        }
        Ajax.Callsync({
            url: Url.Action("AProc_Rpt_GLGeneralLedger", "GeneralReports"),
            data: rp,
            success: function (d) {
                var result = d.result;
                window.open(result, "_blank");
            }
        });
    }
})(Accountbalances || (Accountbalances = {}));
//# sourceMappingURL=Accountbalances.js.map