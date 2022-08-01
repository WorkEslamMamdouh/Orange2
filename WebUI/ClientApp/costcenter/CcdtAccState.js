$(document).ready(function () {
    CcdtAccState.InitalizeComponent();
});
var CcdtAccState;
(function (CcdtAccState) {
    //arrays
    var AccountDetail = new A_ACCOUNT();
    var CostCentreDetail = new A_CCDT_COSTCENTERS();
    //systems
    var sys = new SystemTools();
    var SysSession = GetSystemSession(Modules.CcdtAccState);
    var compcode;
    var branch;
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);
    //globals
    var AccCCdtType;
    var CostCCdtType;
    //textboxs
    var txtFromDate;
    var txtToDate;
    var txtAccountCode;
    var txtAcountName;
    var txtCCName;
    var txtCCcode;
    //radio
    var rdAccount;
    var rpSummary;
    var rdCostCntr;
    //check
    var chkHideZeros;
    var chkIsAuthVchr;
    var chkIsNewVchr;
    //buttons
    var btnAccountSearch;
    var btnCostCntrSearch;
    var btnReset;
    //print
    var btnPrint;
    var btnPrintTrview;
    var btnPrintTrPDF;
    var btnPrintTrEXEL;
    //------------------------------------- main region------------------------------
    function InitalizeComponent() {
        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = "كشف حساب مركز فرعي";
        }
        else {
            document.getElementById('Screen_name').innerHTML = "Cost Center Bank Statement ";
        }
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        branch = Number(SysSession.CurrentEnvironment.BranchCode);
        InitalizeControls();
        InitalizeEvents();
        // values
        txtFromDate.value = SysSession.CurrentEnvironment.StartDate;
        txtToDate.value = ConvertToDateDash(GetDate()) <= ConvertToDateDash(SysSession.CurrentEnvironment.EndDate) ? GetDate() : SysSession.CurrentEnvironment.EndDate;
        rdAccount.checked = true;
        rpSummary.checked = true;
        $('#btnPrint').addClass('display_none');
    }
    CcdtAccState.InitalizeComponent = InitalizeComponent;
    function InitalizeControls() {
        //TextBoxes
        txtFromDate = document.getElementById("txtFromDate");
        txtToDate = document.getElementById("txtToDate");
        txtAccountCode = document.getElementById("txtAccountCode");
        txtAcountName = document.getElementById("txtAcountName");
        txtCCName = document.getElementById("txtCCName");
        txtCCcode = document.getElementById("txtCCcode");
        //radiobuttons
        rdAccount = document.getElementById("rdAccount");
        rdCostCntr = document.getElementById("rdCostCntr");
        rpSummary = document.getElementById("rpSummary");
        //checkBoxes
        chkHideZeros = document.getElementById("chkHideZeros");
        chkIsAuthVchr = document.getElementById("chkIsAuthVchr");
        chkIsNewVchr = document.getElementById("chkIsNewVchr");
        //buttons
        btnAccountSearch = document.getElementById("btnAccountSearch");
        btnCostCntrSearch = document.getElementById("btnCostCntrSearch");
        btnReset = document.getElementById("btnReset");
        btnPrint = document.getElementById("btnPrint");
        btnPrintTrview = document.getElementById("btnPrintTrview");
        btnPrintTrPDF = document.getElementById("btnPrintTrPDF");
        btnPrintTrEXEL = document.getElementById("btnPrintTrEXEL");
        $("#iconMainPages").addClass("d-none");
        $("#iconReportPages").removeClass("d-none");
        $("#btnPrintTrview").addClass("print-report");
        $("#btnPrintTrview span").text("عرض تقرير");
    }
    function InitalizeEvents() {
        btnAccountSearch.onclick = btnAccountSearch_onclick;
        btnCostCntrSearch.onclick = btnCostCntrSearch_onclick;
        txtAccountCode.onchange = txtAccountCode_onchange;
        txtCCcode.onchange = txtCCcode_onchange;
        btnReset.onclick = clear;
        rdAccount.onclick = clear;
        rdCostCntr.onclick = clear;
        btnPrintTrview.onclick = function () { PrintReport(1); };
        btnPrintTrPDF.onclick = function () { PrintReport(2); };
        btnPrintTrEXEL.onclick = function () { PrintReport(3); };
        btnPrint.onclick = function () { PrintReport(4); };
    }
    //------------------------------------- events region------------------------------
    function btnAccountSearch_onclick() {
        var sys = new SystemTools();
        if (rdCostCntr.checked == true) {
            if (txtCCcode.value == "") {
                DisplayMassage("يجب اختيار مركز التكلفه اولا", "you must choose cost center first ", MessageType.Error);
            }
            else {
                sys.FindKey(Modules.CcdtAccState, "btnAccountSearch", "COMP_CODE=" + compcode + "and DETAIL='True' and CCDT_TYPE ='" + CostCCdtType + "'", function () {
                    var id = SearchGrid.SearchDataGrid.SelectedKey;
                    GetAccByCode(id);
                });
            }
        }
        else {
            sys.FindKey(Modules.CcdtAccState, "btnAccountSearch", "COMP_CODE=" + compcode + "and DETAIL='True' and isnull(CCDT_TYPE,'') <>''", function () {
                var id = SearchGrid.SearchDataGrid.SelectedKey;
                GetAccByCode(id);
            });
        }
    }
    function btnCostCntrSearch_onclick() {
        var sys = new SystemTools();
        if (rdAccount.checked == true) {
            if (txtAccountCode.value == "") {
                DisplayMassage("يجب اختيار رقم الحساب اولا", "you must choose Account number first ", MessageType.Error);
            }
            else {
                sys.FindKey(Modules.CcdtAccState, "btnCostCntrSearch", "COMP_CODE=" + compcode + "and CCDT_TYPE ='" + AccCCdtType + "'", function () {
                    var id = SearchGrid.SearchDataGrid.SelectedKey;
                    GetCostCenterByCode(id);
                });
            }
        }
        else {
            if (chkHideZeros.checked == true) {
                sys.FindKey(Modules.CcdtAccState, "btnCostCntrSearch", "COMP_CODE=" + compcode + "and CCDT_TYPE is not null", function () {
                    var id = SearchGrid.SearchDataGrid.SelectedKey;
                    GetCostCenterByCode(id);
                });
            }
            else {
                sys.FindKey(Modules.CcdtAccState, "btnCostCntrSearch", "COMP_CODE=" + compcode, function () {
                    var id = SearchGrid.SearchDataGrid.SelectedKey;
                    GetCostCenterByCode(id);
                });
            }
        }
    }
    function txtAccountCode_onchange() {
        var accountCode = txtAccountCode.value;
        if (accountCode == "") {
            txtAccountCode.value = "";
            txtAcountName.value = "";
            AccCCdtType = "";
        }
        else
            GetAccByCode(accountCode);
    }
    function txtCCcode_onchange() {
        var ccCode = txtCCcode.value;
        if (ccCode == "") {
            txtCCcode.value = "";
            txtCCName.value = "";
            CostCCdtType = "";
        }
        else
            GetCostCenterByCode(ccCode);
    }
    //----------------------------------------- Get Functions region---------------------------------
    function GetAccByCode(AccCode) {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GLDefAccount", "GetActivAccByCode"),
            data: { CompCode: compcode, AccCode: AccCode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.Response == null) {
                    DisplayMassage("رقم الحساب غير صحيح", "Wrong Account Code ", MessageType.Error);
                    txtAccountCode.value = "";
                    txtAcountName.value = "";
                    AccCCdtType = "";
                }
                else if (result.IsSuccess) {
                    AccountDetail = result.Response;
                    if (rdAccount.checked == true) {
                        txtAccountCode.value = AccountDetail.ACC_CODE;
                        txtAcountName.value = (lang == "ar" ? AccountDetail.ACC_DESCA : AccountDetail.ACC_DESCL);
                        AccCCdtType = AccountDetail.CCDT_TYPE;
                    }
                    else {
                        if (txtCCcode.value == "") {
                            DisplayMassage("يجب اختيار مركز التكلفه", "you must choose cost center first ", MessageType.Error);
                        }
                        else {
                            if (CostCCdtType == AccountDetail.CCDT_TYPE) {
                                txtAccountCode.value = AccountDetail.ACC_CODE;
                                txtAcountName.value = (lang == "ar" ? AccountDetail.ACC_DESCA : AccountDetail.ACC_DESCL);
                                AccCCdtType = AccountDetail.CCDT_TYPE;
                            }
                            else {
                                DisplayMassage("نوع الحساب غير متطابق مع نوع مركز التكلفه الفرعي ", "Account type not the same as Cost center type ", MessageType.Error);
                                txtAccountCode.value = "";
                                txtAcountName.value = "";
                                AccCCdtType = "";
                            }
                        }
                    }
                }
            }
        });
    }
    function GetCostCenterByCode(CCcode) {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDtCostCenters", "GetCCDTCostByCode"),
            data: { CompCode: compcode, CostCntreCode: CCcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.Response == null) {
                    DisplayMassage("رقم مركز التكلفه غير صحيح", "Wrong cost center Code ", MessageType.Error);
                    txtCCcode.value = "";
                    txtCCName.value = "";
                    CostCCdtType = "";
                }
                else if (result.IsSuccess) {
                    CostCentreDetail = result.Response;
                    if (rdCostCntr.checked == true) {
                        txtCCcode.value = CostCentreDetail.CCDT_CODE;
                        txtCCName.value = (lang == "ar" ? CostCentreDetail.CCDT_DESCA : CostCentreDetail.CCDT_DESCE);
                        CostCCdtType = CostCentreDetail.CCDT_TYPE;
                    }
                    else {
                        if (txtAccountCode.value == "") {
                            DisplayMassage("يجب اختيار الحساب اولا", "you must choose account first ", MessageType.Error);
                        }
                        else {
                            if (AccCCdtType == CostCentreDetail.CCDT_TYPE) {
                                txtCCcode.value = CostCentreDetail.CCDT_CODE;
                                txtCCName.value = (lang == "ar" ? CostCentreDetail.CCDT_DESCA : CostCentreDetail.CCDT_DESCE);
                                CostCCdtType = CostCentreDetail.CCDT_TYPE;
                            }
                            else {
                                DisplayMassage("نوع مركز التكلفه الفرعي غير متطابق مع نوع الحساب  ", "Cost center type not the same as Account type", MessageType.Error);
                                txtCCcode.value = "";
                                txtCCName.value = "";
                                CostCCdtType = "";
                            }
                        }
                    }
                }
            }
        });
    }
    //----------------------------------------- validation && clear---------------------------------
    function Validation() {
        debugger;
        if (rdAccount.checked == true && txtAccountCode.value == "") {
            DisplayMassage("يجب ادخال رقم الحساب", "you must enter Account number ", MessageType.Error);
            return false;
        }
        else if (rdCostCntr.checked == true && txtCCcode.value == "") {
            DisplayMassage("يجب ادخال مركز التكلفه", "you must enter cost center ", MessageType.Error);
            return false;
        }
        return true;
    }
    function clear() {
        txtFromDate.value = SysSession.CurrentEnvironment.StartDate;
        txtToDate.value = ConvertToDateDash(GetDate()) <= ConvertToDateDash(SysSession.CurrentEnvironment.EndDate) ? GetDate() : SysSession.CurrentEnvironment.EndDate;
        //rdAccount.checked = true;
        txtCCcode.value = "";
        txtCCName.value = "";
        txtAccountCode.value = "";
        txtAcountName.value = "";
        //chkHideZeros.checked = false;
        AccCCdtType = "";
        CostCCdtType = "";
    }
    function PrintReport(OutType) {
        debugger;
        if (!Validation())
            return;
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
        if (txtCCcode.value == "") {
            rp.dtccCode = "-1";
        }
        else {
            rp.dtccCode = txtCCcode.value.toString();
        }
        if (txtAccountCode.value == "0") {
            rp.AccCode = "";
        }
        else {
            rp.AccCode = txtAccountCode.value.toString();
        }
        if (chkHideZeros.checked == true) {
            rp.exzero = 1;
        }
        else {
            rp.exzero = 0;
        }
        if (chkIsNewVchr.checked == true) {
            rp.IsNewVchr = 1;
        }
        else {
            rp.IsNewVchr = 0;
        }
        if (chkIsAuthVchr.checked == true) {
            rp.IsAuthVchr = 1;
        }
        else {
            rp.IsAuthVchr = 0;
        }
        if (rdAccount.checked == true) {
            rp.TrType = 1;
        }
        else {
            rp.TrType = 0;
        }
        if (rpSummary.checked == true) {
            rp.check = 1;
        }
        else {
            rp.check = 0;
        }
        Ajax.Callsync({
            url: Url.Action("AProc_Rpt_GLDtCCenterStatmentSummary", "GeneralReports"),
            data: rp,
            success: function (d) {
                var result = d.result;
                window.open(result, "_blank");
            }
        });
    }
})(CcdtAccState || (CcdtAccState = {}));
//# sourceMappingURL=CcdtAccState.js.map