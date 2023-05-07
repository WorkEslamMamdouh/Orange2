$(document).ready(function () {
    AccTrReceiptNoteNew.InitalizeComponent();
});
var AccTrReceiptNoteNew;
(function (AccTrReceiptNoteNew) {
    var sys = new SystemTools();
    var SysSession = GetSystemSession(Modules.AccTrReceiptNote);
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);
    var TrType = 1;
    var codeType = "RecType";
    var Name_Not = (lang == "ar" ? 'الاستلام' : 'Receipt');
    var CompCode = Number(SysSession.CurrentEnvironment.CompCode);
    var BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);
    var ReportGrid = new JsGrid();
    var Details = new Array();
    var Model = new A_RecPay_Tr_ReceiptNote();
    var searchbutmemreport;
    var txt_BenCodeF;
    var txt_BenCodeH;
    var txtTrDate;
    var txtDueDate;
    var txtDateFrom;
    var txtDateTo;
    var chkStatus;
    var chkIsDeffered;
    var txt_CashAmount;
    var txt_CardAmount;
    var txt_Amount;
    var txt_note;
    var txtCashTypeF;
    var txtCashTypeH;
    var txt_ReceiptNoteF;
    var txt_ReceiptNoteH;
    var txt_BankAcc_Code;
    var txt_Status;
    var txt_D_CashBoxF;
    var txt_D_CashBoxH;
    var btnBack;
    var btnShow;
    var btnAdd;
    var btnUpdate;
    var btnSave;
    var btnBenF;
    var btnBenH;
    //////////////////////////////////////////print buttons////////////////////////////////////////////     
    var btnPrintTrview;
    var btnPrintTrPDF;
    var btnPrintTrEXEL;
    var btnPrintTransaction;
    var btnSend;
    var btnPrintslip;
    var btnPrintsFrom_To;
    var Flag_IsNew = false;
    function InitalizeComponent() {
        document.getElementById('Screen_name').innerHTML = (lang == "ar" ? "سند " + Name_Not + "" : " " + Name_Not + "");
        InitalizeControls();
        InitalizeEvents();
        InitializeGrid();
        txtDateFrom.value = DateStartMonth();
        txtDateTo.value = ConvertToDateDash(GetDate()) <= ConvertToDateDash(SysSession.CurrentEnvironment.EndDate) ? GetDate() : SysSession.CurrentEnvironment.EndDate;
        fillddlCashBox();
        fillddlG_Codes();
        fillddlAcount_Code();
    }
    AccTrReceiptNoteNew.InitalizeComponent = InitalizeComponent;
    function InitalizeControls() {
        btnShow = document.getElementById("btnShow");
        btnAdd = document.getElementById("btnAdd");
        btnUpdate = document.getElementById("btnUpdate");
        btnSave = document.getElementById("btnSave");
        btnBack = document.getElementById("btnBack");
        btnBenF = document.getElementById("btnBenF");
        btnBenH = document.getElementById("btnBenH");
        ////////  
        txtCashTypeF = document.getElementById("txtCashTypeF");
        txtCashTypeH = document.getElementById("txtCashTypeH");
        txt_ReceiptNoteF = document.getElementById("txt_ReceiptNoteF");
        txt_ReceiptNoteH = document.getElementById("txt_ReceiptNoteH");
        txt_D_CashBoxH = document.getElementById("txt_D_CashBoxH");
        txt_D_CashBoxF = document.getElementById("txt_D_CashBoxF");
        txt_BankAcc_Code = document.getElementById("txt_BankAcc_Code");
        txt_Status = document.getElementById("txt_Status");
        ////////
        txt_BenCodeF = document.getElementById("txt_BenCodeF");
        txt_BenCodeH = document.getElementById("txt_BenCodeH");
        txt_CashAmount = document.getElementById("txt_CashAmount");
        txt_CardAmount = document.getElementById("txt_CardAmount");
        txt_Amount = document.getElementById("txt_Amount");
        txt_note = document.getElementById("txt_note");
        txtTrDate = document.getElementById("txtTrDate");
        txtDueDate = document.getElementById("txtDueDate");
        chkStatus = document.getElementById("chkStatus");
        chkIsDeffered = document.getElementById("chkIsDeffered");
        searchbutmemreport = document.getElementById("searchbutmemreport");
        txtDateFrom = document.getElementById("txtDateFrom");
        txtDateTo = document.getElementById("txtDateTo");
        //print 
        btnPrintTrview = document.getElementById("btnPrintTrview");
        btnPrintTrPDF = document.getElementById("btnPrintTrPDF");
        btnPrintTrEXEL = document.getElementById("btnPrintTrEXEL");
        btnPrintTransaction = document.getElementById("btnPrintTransaction");
        btnSend = document.getElementById("btnSend");
        btnPrintslip = document.getElementById("btnPrintslip");
        btnPrintsFrom_To = document.getElementById("btnPrintsFrom_To");
    }
    function InitalizeEvents() {
        //********************************Btn****************************
        btnShow.onclick = btnShow_onclick;
        btnAdd.onclick = btnAdd_onclick;
        btnSave.onclick = btnSave_onClick;
        btnBack.onclick = btnBack_onclick;
        btnUpdate.onclick = btnUpdate_onclick;
        btnBenF.onclick = function () { btnBen_onclick('F'); };
        btnBenH.onclick = function () { btnBen_onclick('H'); };
        //********************************onchange****************************
        txt_BenCodeF.onchange = function () { BenCode_onchange('F'); };
        txt_BenCodeH.onchange = function () { BenCode_onchange('H'); };
        txt_ReceiptNoteF.onchange = function () { CleanBen('F'); };
        txt_ReceiptNoteH.onchange = function () { CleanBen('H'); };
        txt_CashAmount.onkeyup = function () { txt_Amount.value = (Number(txt_CashAmount.value) + Number(txt_CardAmount.value)).RoundToSt(2); };
        txt_CardAmount.onkeyup = function () { txt_Amount.value = (Number(txt_CashAmount.value) + Number(txt_CardAmount.value)).RoundToSt(2); };
        searchbutmemreport.onkeyup = _SearchBox_Change;
        txtCashTypeH.onchange = txtCashTypeH_onchange;
        chkIsDeffered.onchange = chkIsDeffered_onchange;
        chkStatus.onchange = chkStatus_onchange;
        //*******************************print*****************************
        btnPrintTrview.onclick = function () { PrintReport(1); };
        btnPrintTrPDF.onclick = function () { PrintReport(2); };
        btnPrintTrEXEL.onclick = function () { PrintReport(3); };
        btnPrintTransaction.onclick = PrintTransaction;
        btnPrintslip.onclick = btnPrintslip_onclick;
        btnPrintsFrom_To.onclick = btnPrintsFrom_To_onclick;
    }
    function InitializeGrid() {
        var res = GetResourceList("");
        ReportGrid.OnRowDoubleClicked = GridDoubleClick;
        ReportGrid.ElementName = "ReportGrid";
        ReportGrid.PrimaryKey = "ReceiptID";
        ReportGrid.Paging = true;
        ReportGrid.PageSize = 10;
        ReportGrid.Sorting = true;
        ReportGrid.InsertionMode = JsGridInsertionMode.Binding;
        ReportGrid.Editing = false;
        ReportGrid.Inserting = false;
        ReportGrid.SelectedIndex = 1;
        ReportGrid.OnItemEditing = function () { };
        ReportGrid.Columns = [
            { title: "الرقم", name: "ReceiptID", type: "text", width: " ", visible: false },
            { title: "رقم السند", name: "TrNo", type: "text", width: "11%" },
            {
                title: res.App_date, css: "ColumPadding", name: "TrDate", width: "20%",
                itemTemplate: function (s, item) {
                    var txt = document.createElement("label");
                    txt.innerHTML = DateFormat(item.TrDate);
                    return txt;
                }
            },
            { title: res.App_Receipt_Type, name: (lang == "ar" ? "Type_DescA" : "Type_DescE"), type: "text", width: "11%" },
            { title: res.App_beneficiary_no, name: "Bef_Code", type: "text", width: "11%" },
            { title: res.App_beneficiary, name: "Bef_DescA", type: "text", width: "11%" },
            { title: res.App_Amount, name: "Amount", type: "text", width: "11%" },
            { title: res.App_Cash, name: "CashAmount", type: "text", width: "11%" },
            { title: res.App_Card, name: "CardAmount", type: "text", width: "11%" },
            {
                title: res.App_Certified, css: "ColumPadding", name: "statusDesciption", width: "17%",
                itemTemplate: function (s, item) {
                    var txt = document.createElement("label");
                    txt.innerHTML = item.Status == 1 ? (lang == "ar" ? "معتمد" : "A certified") : (lang == "ar" ? "غير معتمد" : "Not supported");
                    ;
                    return txt;
                }
            },
        ];
        ReportGrid.Bind();
    }
    //************************************************fillddl**************************************
    function fillddlCashBox() {
        var CashBoxID = 0;
        if (SysSession.CurrentEnvironment.UserType == 2 || SysSession.CurrentEnvironment.UserType == 3) {
            CashBoxID = SysSession.CurrentEnvironment.CashBoxID == null ? 0 : SysSession.CurrentEnvironment.CashBoxID;
        }
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefBox", "GetAllRec"),
            data: { compCode: CompCode, CashBoxID: CashBoxID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    var fillModel_CashBox = result.Response;
                    var box = fillModel_CashBox.filter(function (x) { return x.BranchCode == BranchCode; });
                    DocumentActions.FillCombowithdefult(box, txt_D_CashBoxF, "CashBoxID", (lang == "ar" ? 'CashBox_DescA' : 'CashBox_DescE'), (lang == "ar" ? 'اختر الصندوق' : 'Box'));
                    DocumentActions.FillCombowithdefult(fillModel_CashBox, txt_D_CashBoxH, "CashBoxID", (lang == "ar" ? 'CashBox_DescA' : 'CashBox_DescE'), (lang == "ar" ? 'اختر الصندوق' : 'Box'));
                }
            }
        });
    }
    function fillddlG_Codes() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GCodes", "GetAll_GCodes"),
            data: {
                UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    var fillModel_GCodes = result.Response;
                    var ChckType = fillModel_GCodes.filter(function (x) { return x.CodeType == 'ChckType' && x.CodeValue != 9; });
                    DocumentActions.FillCombowithdefult(ChckType, txtCashTypeF, "CodeValue", (lang == "ar" ? 'DescA' : 'DescE'), (lang == "ar" ? 'اختر نوع النقد' : 'Type of constraint'));
                    DocumentActions.FillCombowithdefult(ChckType, txtCashTypeH, "CodeValue", (lang == "ar" ? 'DescA' : 'DescE'), (lang == "ar" ? 'اختر نوع النقد' : 'Type of constraint'));
                    var Type = fillModel_GCodes.filter(function (x) { return x.CodeType == codeType; });
                    DocumentActions.FillCombowithdefult(Type, txt_ReceiptNoteF, "CodeValue", (lang == "ar" ? 'DescA' : 'DescE'), (lang == "ar" ? "اختر نوع " + Name_Not + "" : 'Type of constraint'));
                    DocumentActions.FillCombowithdefult(Type, txt_ReceiptNoteH, "CodeValue", (lang == "ar" ? 'DescA' : 'DescE'), (lang == "ar" ? "اختر نوع " + Name_Not + "" : 'Type of constraint'));
                }
            }
        });
    }
    function fillddlAcount_Code() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GLDefAccount", "GetBankAcc"),
            data: {
                CompCode: CompCode, AccType: 3, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    var Model_Acount = result.Response;
                    DocumentActions.FillCombowithdefult(Model_Acount, txt_BankAcc_Code, "ACC_CODE", (lang == "ar" ? 'ACC_DESCA' : 'ACC_DESCL'), (lang == "ar" ? 'اختر حساب الايداع' : 'Type of constraint'));
                }
            }
        });
    }
    //************************************************Btn_Events**********************************
    function btnBen_onclick(Type) {
        debugger;
        if ($('#txt_ReceiptNote' + Type).val() == "null") {
            DisplayMassage("برجاء اختيار نوع الاستلام", "", MessageType.Worning);
            Errorinput($('#txt_ReceiptNote' + Type));
        }
        if ($('#txt_ReceiptNote' + Type).val() == "1") {
            BenCust(Type);
        }
        if ($('#txt_ReceiptNote' + Type).val() == "2") {
            BenVnd(Type);
        }
        if ($('#txt_ReceiptNote' + Type).val() == "3") {
            BenBank(Type);
        }
        if ($('#txt_ReceiptNote' + Type).val() == "4") {
            BenAcc(Type);
        }
        if ($('#txt_ReceiptNote' + Type).val() == "5") {
            BenBox(Type);
        }
    }
    function BenCode_onchange(Type) {
        debugger;
        if ($('#txt_ReceiptNote' + Type).val() == "null") {
            DisplayMassage("برجاء اختيار نوع الاستلام", "", MessageType.Worning);
            Errorinput($('#txt_ReceiptNote' + Type));
        }
        if ($('#txt_ReceiptNote' + Type).val() == "1") {
            getAccountCustById(Type, $('#txt_BenCode' + Type).val(), true);
        }
        if ($('#txt_ReceiptNote' + Type).val() == "2") {
            getAccountVndById(Type, $('#txt_BenCode' + Type).val(), true);
        }
        if ($('#txt_ReceiptNote' + Type).val() == "3") {
            getAccountBankById(Type, $('#txt_BenCode' + Type).val(), true);
        }
        if ($('#txt_ReceiptNote' + Type).val() == "4") {
            getAccountAccById(Type, $('#txt_BenCode' + Type).val(), true);
        }
        if ($('#txt_ReceiptNote' + Type).val() == "5") {
            getAccountBoxById(Type, $('#txt_BenCode' + Type).val(), true);
        }
    }
    function btnShow_onclick() {
        var BenID = Number($('#txt_BenIDF').val());
        var Boxid = txt_D_CashBoxF.value == 'null' ? 0 : Number(txt_D_CashBoxF.value);
        var Status = txt_Status.value;
        var RecPayTypeId = txt_ReceiptNoteF.value == 'null' ? 0 : Number(txt_ReceiptNoteF.value);
        var DateFrom = DateFormatRep(txtDateFrom.value);
        var DateTo = DateFormatRep(txtDateTo.value);
        var CashType = txtCashTypeF.value == "null" ? -1 : Number(txtCashTypeF.value);
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccTrReceipt", "GetBoxReceiveListNew"),
            data: {
                comp: CompCode, BenID: BenID, TrType: TrType, Boxid: Boxid, RecPayTypeId: RecPayTypeId, Status: Status, FromDate: DateFrom, Todate: DateTo, CashType: CashType, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token, MODULE_CODE: Modules.AccTrReceiptNote, FinYear: SysSession.CurrentEnvironment.CurrentYear, BranchCode: SysSession.CurrentEnvironment.BranchCode
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    Details = result.Response;
                    $('#id_ReportGrid').removeClass('display_none');
                    $('#Div_control').addClass('display_none');
                    ReportGrid.DataSource = Details;
                    ReportGrid.Bind();
                }
            }
        });
    }
    function btnAdd_onclick() {
        CleanDetails();
        Enabled();
        Flag_IsNew = true;
    }
    function btnSave_onClick() {
        loading('btnSave');
        setTimeout(function () {
            finishSave('btnSave');
            if (!Validation()) {
                return;
            }
            Assign();
            if (Flag_IsNew == true) {
                $("#txtCreatedBy").val(SysSession.CurrentEnvironment.UserCode);
                $("#txtCreatedAt").val(DateTimeFormat(Date().toString()));
                Assign();
                Insert();
            }
            else {
                $("#txtUpdatedBy").val(SysSession.CurrentEnvironment.UserCode);
                $("#txtUpdatedAt").val(DateTimeFormat(Date().toString()));
                Assign();
                Update();
            }
        }, 100);
    }
    function btnBack_onclick() {
        if (Flag_IsNew == true) {
            $('#Div_control').addClass('display_none');
            disabled();
        }
        else {
            GridDoubleClick();
        }
    }
    function btnUpdate_onclick() {
        Enabled();
    }
    function _SearchBox_Change() {
        $("#ReportGrid").jsGrid("option", "pageIndex", 1);
        if (searchbutmemreport.value != "") {
            var search_1 = searchbutmemreport.value.toLowerCase();
            var SearchDetails = Details.filter(function (x) { return x.TrNo.toString().search(search_1) >= 0 || x.Bef_Code.toString().search(search_1) >= 0 || x.Bef_DescA.toLowerCase().search(search_1) >= 0; });
            ReportGrid.DataSource = SearchDetails;
            ReportGrid.Bind();
        }
        else {
            ReportGrid.DataSource = Details;
            ReportGrid.Bind();
        }
    }
    function txtCashTypeH_onchange() {
        $('#Bank_Div').addClass('display_none');
        $('._Cash').addClass('display_none');
        $('._Card').addClass('display_none');
        $('#txt_CheckNo').removeClass('display_none');
        $('#txt_TransferNo').addClass('display_none');
        $('#txt_CheckNo').val('');
        $('#txt_TransferNo').val('');
        $('#txt_CardAmount').val('0');
        $('#txt_CashAmount').val('0');
        $('#txt_Amount').val('');
        $('#txt_BankName').val('');
        $('#txt_BankAcc_Code').val('null');
        chkIsDeffered.checked = false;
        txtDueDate.value = GetDate();
        $('#txt_Amount').attr('disabled', 'disabled');
        if (txtCashTypeH.value == '0') { // نقدي 
            $('._Cash').removeClass('display_none');
        }
        else if (txtCashTypeH.value == '8') { //تحصيل شبكة 
            $('._Card').removeClass('display_none');
        }
        else { // الجميع 
            $('#Bank_Div').removeClass('display_none');
            $('#txt_Amount').removeAttr('disabled');
            if (txtCashTypeH.value == '1' || txtCashTypeH.value == '2') {
                $('#txt_CheckNo').addClass('display_none');
                $('#txt_TransferNo').removeClass('display_none');
            }
        }
    }
    function chkIsDeffered_onchange() {
        if (chkIsDeffered.checked == true) {
            txt_note.disabled == false ? $('#txtDueDate').removeAttr('disabled') : $('#txtDueDate').attr('disabled', 'disabled');
        }
        else {
            $('#txtDueDate').attr('disabled', 'disabled');
        }
    }
    function chkStatus_onchange() {
        if (chkStatus.checked == false) {
            txt_note.disabled == true ? Open() : null;
        }
    }
    //****************************************************Customer*********************************************
    function BenCust(Type) {
        var cond = Type == 'H' ? "and Isactive = 1" : "";
        if (SysSession.CurrentEnvironment.I_Control[0].IsLocalBranchCustomer == true) {
            cond = cond + " and BranchCode=" + BranchCode;
        }
        sys.FindKey(Modules.AccTrReceiptNote, "btnCustSrch", "CompCode= " + CompCode + "" + cond, function () {
            var id = SearchGrid.SearchDataGrid.SelectedKey;
            getAccountCustById(Type, id, false);
        });
    }
    function getAccountCustById(Type, custId, code) {
        debugger;
        if (custId.toString().trim() == '') {
            CleanBen(Type);
            Errorinput($('#txt_BenCode' + Type));
            DisplayMassage("كود العميل غير صحيح", "Wrong Customer code", MessageType.Error);
            return;
        }
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefCustomer", "GetCustomerByCustomerId_code"),
            data: { Compcode: CompCode, BranchCode: BranchCode, code: code, CustomerId: custId.toString().trim(), UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                debugger;
                if (result.IsSuccess) {
                    var Model_Cust = result.Response;
                    if (Model_Cust.length == 0) {
                        CleanBen(Type);
                        Errorinput($('#txt_BenCode' + Type));
                        DisplayMassage("كود العميل غير صحيح", "Wrong Customer code", MessageType.Error);
                    }
                    else {
                        $('#txt_BenCode' + Type).val(Model_Cust[0].CustomerCODE);
                        $('#txt_BenName' + Type).val(Model_Cust[0].NAMEA);
                        $('#txt_Openbalance' + Type).val(Model_Cust[0].Openbalance);
                        $('#txt_BenID' + Type).val(Model_Cust[0].CustomerId);
                    }
                }
            }
        });
    }
    //****************************************************Vendors*********************************************
    function BenVnd(Type) {
        var cond = " CompCode= " + CompCode + "and IsCreditVendor = 1";
        cond = cond + Type == 'H' ? "and Isactive = 1" : "";
        sys.FindKey(Modules.AccTrReceiptNote, "btnVndSrch", cond, function () {
            var id = SearchGrid.SearchDataGrid.SelectedKey;
            getAccountVndById(Type, id, false);
        });
    }
    function getAccountVndById(Type, VenId, code) {
        debugger;
        if (VenId.toString().trim() == '') {
            CleanBen(Type);
            Errorinput($('#txt_BenCode' + Type));
            DisplayMassage("كود العميل غير صحيح", "Wrong Customer code", MessageType.Error);
            return;
        }
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefVendor", "GetVendorByvndId_code"),
            data: { Compcode: CompCode, code: code, VendorID: VenId.toString().trim(), UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    var Model_Vnd = result.Response;
                    if (Model_Vnd.length == 0) {
                        CleanBen(Type);
                        Errorinput($('#txt_BenCode' + Type));
                        DisplayMassage("كود العميل غير صحيح", "Wrong Customer code", MessageType.Error);
                    }
                    else {
                        $('#txt_BenCode' + Type).val(Model_Vnd[0].VendorCode);
                        $('#txt_BenName' + Type).val(Model_Vnd[0].NAMEA);
                        $('#txt_Openbalance' + Type).val(Model_Vnd[0].Openbalance);
                        $('#txt_BenID' + Type).val(Model_Vnd[0].VendorID);
                    }
                }
            }
        });
    }
    //****************************************************Bank*********************************************
    function BenBank(Type) {
        debugger;
        var cond = " COMP_CODE= " + CompCode + "and ACC_TYPE = 3";
        cond += Type == 'H' ? " and ACC_ACTIVE = 1" : "";
        sys.FindKey(Modules.AccTrReceiptNote, "btnbankSearch", cond, function () {
            var id = SearchGrid.SearchDataGrid.SelectedKey;
            getAccountBankById(Type, id, true);
        });
    }
    function getAccountBankById(Type, BankId, code) {
        debugger;
        if (BankId.toString().trim() == '') {
            CleanBen(Type);
            Errorinput($('#txt_BenCode' + Type));
            DisplayMassage("كود الحساب غير صحيح", "Wrong Acc code", MessageType.Error);
            return;
        }
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GLDefAccount", "GetByAccCode"),
            data: { CompCode: CompCode, AccCode: BankId.toString().trim(), UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    var Model_Bank = result.Response;
                    debugger;
                    if (Model_Bank == null) {
                        CleanBen(Type);
                        Errorinput($('#txt_BenCode' + Type));
                        DisplayMassage("كود الحساب غير صحيح", "Wrong Bank code", MessageType.Error);
                    }
                    else {
                        $('#txt_BenCode' + Type).val(Model_Bank.ACC_CODE);
                        $('#txt_BenName' + Type).val(Model_Bank.ACC_DESCA);
                        $('#txt_Openbalance' + Type).val(0);
                        $('#txt_BenID' + Type).val(Model_Bank.ACC_CODE);
                    }
                }
            }
        });
    }
    //****************************************************Bank*********************************************
    function BenAcc(Type) {
        sys.FindKey(Modules.AccTrReceiptNote, "btnAccBen", "CompCode= " + CompCode + " and TrType = 1 ", function () {
            var id = SearchGrid.SearchDataGrid.SelectedKey;
            getAccountAccById(Type, id, false);
        });
    }
    function getAccountAccById(Type, AccId, code) {
        debugger;
        if (AccId.toString().trim() == '') {
            CleanBen(Type);
            Errorinput($('#txt_BenCode' + Type));
            DisplayMassage("كود الحساب غير صحيح", "Wrong Acc code", MessageType.Error);
            return;
        }
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefAccounts", "GetByCode_and_byid"),
            data: { CompCode: CompCode, id: AccId.toString().trim(), code: code, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    var Model_Acc = result.Response;
                    if (Model_Acc.length == 0) {
                        CleanBen(Type);
                        Errorinput($('#txt_BenCode' + Type));
                        DisplayMassage("كود الحساب غير صحيح", "Wrong Bank code", MessageType.Error);
                    }
                    else {
                        $('#txt_BenCode' + Type).val(Model_Acc[0].ExpCode);
                        $('#txt_BenName' + Type).val(Model_Acc[0].ExpDescA);
                        $('#txt_Openbalance' + Type).val(0);
                        $('#txt_BenID' + Type).val(Model_Acc[0].ExpenseID);
                    }
                }
            }
        });
    }
    //****************************************************Box*********************************************
    function BenBox(Type) {
        debugger;
        var cond = "CompCode= " + CompCode;
        cond += Type == 'H' ? " and IsActive = 1" : "";
        sys.FindKey(Modules.AccTrReceiptNote, "btnBoxSearch", cond, function () {
            var id = SearchGrid.SearchDataGrid.SelectedKey;
            getAccountBoxById(Type, id, false);
        });
    }
    function getAccountBoxById(Type, BoxId, code) {
        debugger;
        if (BoxId.toString().trim() == '') {
            CleanBen(Type);
            Errorinput($('#txt_BenCode' + Type));
            DisplayMassage("كود الصندوق غير صحيح", "Wrong Acc code", MessageType.Error);
            return;
        }
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefBox", "GetByIdpaynote"),
            data: { code: code, compCode: CompCode, BranchCode: BranchCode, CashBoxID: BoxId.toString().trim(), UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    var Model_Box = result.Response;
                    if (Model_Box.length == 0) {
                        CleanBen(Type);
                        Errorinput($('#txt_BenCode' + Type));
                        DisplayMassage("كود الصندوق غير صحيح", "Wrong CashBox code", MessageType.Error);
                    }
                    else {
                        $('#txt_BenCode' + Type).val(Model_Box[0].CashBoxID);
                        $('#txt_BenName' + Type).val(Model_Box[0].CashBox_DescA);
                        $('#txt_Openbalance' + Type).val(0);
                        $('#txt_BenID' + Type).val(Model_Box[0].CashBoxID);
                    }
                }
            }
        });
    }
    //****************************************************CleanInput*********************************************
    function CleanBen(Type) {
        $('#txt_BenCode' + Type).val("");
        $('#txt_BenName' + Type).val("");
        $('#txt_Openbalance' + Type).val("");
        $('#txt_BenID' + Type).val("");
    }
    function Enabled() {
        $('._dis').removeAttr('disabled');
        $('#chkIsDeffered').removeAttr('disabled');
        $('#id_div_Filter').addClass('disabledDiv');
        chkStatus.disabled = !SysSession.CurrentPrivileges.CUSTOM2;
        chkIsDeffered.checked == true ? $('#txtDueDate').removeAttr('disabled') : $('#txtDueDate').attr('disabled', 'disabled');
    }
    function disabled() {
        $('._dis').attr('disabled', 'disabled');
        $('#chkIsDeffered').attr('disabled', 'disabled');
        $('#id_div_Filter').removeClass('disabledDiv');
    }
    function CleanDetails() {
        $('#Div_control').removeClass('display_none');
        CleanBen('H');
        $("#Div_control :input").val("");
        txt_D_CashBoxH.selectedIndex = 1;
        txtCashTypeH.value = '0';
        txt_ReceiptNoteH.value = 'null';
        txt_BankAcc_Code.value = 'null';
        txtTrDate.value = GetDate();
        txtDueDate.value = GetDate();
        chkIsDeffered.checked = false;
        chkStatus.checked = false;
        txtCashTypeH_onchange();
    }
    //****************************************************DisplayDetails*********************************************
    function GridDoubleClick() {
        CleanDetails();
        DisplayDetails(ReportGrid.SelectedItem);
        disabled();
    }
    function DisplayDetails(Selecteditem) {
        DocumentActions.RenderFromModel(Selecteditem);
        txtTrDate.value = DateFormat(Selecteditem.TrDate);
        txtDueDate.value = DateFormat(Selecteditem.DueDate);
        chkStatus.checked = Selecteditem.Status == 1 ? true : false;
        chkIsDeffered.checked = Selecteditem.IsDeffered == true ? true : false;
        if (Selecteditem.RecPayTypeId == 1) {
            getAccountCustById('H', Selecteditem.CustomerID.toString(), false);
        }
        if (Selecteditem.RecPayTypeId == 2) {
            getAccountVndById('H', Selecteditem.VendorID.toString(), false);
        }
        if (Selecteditem.RecPayTypeId == 3) {
            getAccountBankById('H', Selecteditem.BankAccountCode, true);
        }
        if (Selecteditem.RecPayTypeId == 4) {
            getAccountAccById('H', Selecteditem.ExpenseID.toString(), false);
        }
        if (Selecteditem.RecPayTypeId == 5) {
            getAccountBoxById('H', Selecteditem.FromCashBoxID.toString(), false);
        }
        Flag_IsNew = false;
        if (txtCashTypeH.value == '0') {
            $('#Bank_Div').addClass('display_none');
            $('._Cash').removeClass('display_none');
        }
        else {
            $('#Bank_Div').removeClass('display_none');
            $('._Cash').addClass('display_none');
        }
        if (chkStatus.checked == true) {
            btnUpdate.disabled = true;
            chkStatus.disabled = !SysSession.CurrentPrivileges.CUSTOM1;
        }
        else {
            btnUpdate.disabled = false;
            chkStatus.disabled = true;
        }
    }
    //****************************************************Validation*********************************************
    function Validation() {
        if (txt_D_CashBoxH.value == 'null') {
            DisplayMassage("يجب اختيار نوع الصندوق ", "Choose the type of constraint", MessageType.Worning);
            Errorinput(txt_D_CashBoxH);
            return false;
        }
        if (txtCashTypeH.value == 'null') {
            DisplayMassage("يجب اختيار نوع النقد ", "Choose the type of constraint", MessageType.Worning);
            Errorinput(txtCashTypeH);
            return false;
        }
        if (txt_ReceiptNoteH.value == 'null') {
            DisplayMassage("يجب اختيار نوع " + Name_Not + " ", "Choose the type of constraint", MessageType.Worning);
            Errorinput(txt_ReceiptNoteH);
            return false;
        }
        if (txt_BenCodeH.value.trim() == '') {
            DisplayMassage("يجب اختيار المستفيد ", "Choose the type of constraint", MessageType.Worning);
            Errorinput(txt_BenCodeH);
            Errorinput(btnBenH);
            return false;
        }
        if ((Number(txt_CashAmount.value) == 0) && txtCashTypeH.value == "0") {
            DisplayMassage("يجب ادخال نقدي ", "You must enter cash or card ", MessageType.Worning);
            Errorinput(txt_CardAmount);
            Errorinput(txt_CashAmount);
            return false;
        }
        if ((Number(txt_CardAmount.value) == 0) && txtCashTypeH.value == "8") {
            DisplayMassage("يجب ادخال الشبكه", "You must enter cash or card ", MessageType.Worning);
            Errorinput(txt_CardAmount);
            Errorinput(txt_CashAmount);
            return false;
        }
        if (Number($('#txt_Amount').val()) == 0) {
            DisplayMassage("يجب ادخال  البلغ   ", " Amount must be entered", MessageType.Worning);
            Errorinput($('#txt_Amount'));
            return false;
        }
        if ($('#Bank_Div').is(":hidden") == false) { //Bank_____Validation
            if (Number($('#txt_TransferNo').val()) == 0 && ($('#txt_TransferNo').is(":hidden") == false)) {
                DisplayMassage("يجب ادخال  رقم التحويله ", " Transfer number must be entered", MessageType.Worning);
                Errorinput($('#txt_TransferNo'));
                return false;
            }
            if (Number($('#txt_CheckNo').val()) == 0 && ($('#txt_CheckNo').is(":hidden") == false)) {
                DisplayMassage("يجب ادخال  رقم الشيك ", " Check number must be entered", MessageType.Worning);
                Errorinput($('#txt_CheckNo'));
                return false;
            }
            if ($('#txt_BankName').val().trim() == '') {
                DisplayMassage("يجب ادخال صرف من  بنك  ", " The entry must be issued by a bank", MessageType.Worning);
                Errorinput($('#txt_BankName'));
                return false;
            }
            if (txt_BankAcc_Code.selectedIndex == 0) {
                DisplayMassage("يجب اختيار  حساب الايداع  ", "You must choose the deposit account number", MessageType.Worning);
                Errorinput(txt_BankAcc_Code);
                return false;
            }
        }
        return true;
    }
    //****************************************************Assign_Data*********************************************
    function Assign() {
        debugger;
        Model = new A_RecPay_Tr_ReceiptNote();
        DocumentActions.AssignToModel(Model); //Insert Update
        Model.Status = chkStatus.checked == true ? 1 : 0;
        Model.IsDeffered = chkIsDeffered.checked == true ? true : false;
        Model.CustomerID = null;
        Model.VendorID = null;
        Model.ExpenseID = null;
        Model.FromCashBoxID = null;
        Model.BankAccountCode = null;
        if (Model.RecPayTypeId == 1) {
            Model.CustomerID = Number($('#txt_BenIDH').val());
        }
        if (Model.RecPayTypeId == 2) {
            Model.VendorID = Number($('#txt_BenIDH').val());
        }
        if (Model.RecPayTypeId == 3) {
            Model.BankAccountCode = $('#txt_BenIDH').val();
        }
        if (Model.RecPayTypeId == 4) {
            Model.ExpenseID = Number($('#txt_BenIDH').val());
        }
        if (Model.RecPayTypeId == 5) {
            Model.FromCashBoxID = Number($('#txt_BenIDH').val());
        }
        Model.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
        Model.UserCode = SysSession.CurrentEnvironment.UserCode;
        Model.CompCode = CompCode;
        Model.BranchCode = BranchCode;
        Model.TrType = TrType;
        Model.TrNo = Number($('#txt_CODE').val());
        Model.ReceiptID = Number($('#ReceiptID').val());
        Model.Comp_Code = CompCode.toString();
        Model.Branch_Code = BranchCode.toString();
        Model.TrDateH = '1';
    }
    function Insert() {
        debugger;
        if (!CheckDate(DateFormat(txtTrDate.value).toString(), DateFormat(SysSession.CurrentEnvironment.StartDate).toString(), DateFormat(SysSession.CurrentEnvironment.EndDate).toString())) {
            WorningMessage("  التاريخ ليس متطابق مع تاريخ المتاح (" + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ")", "Date does not match available date(" + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ")", "تحذير", "worning");
            return;
        }
        console.log(Model);
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("AccTrReceipt", "Insert"),
            data: JSON.stringify(Model),
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    var res = result.Response;
                    DisplayMassage("تم الحفظ بنجاح", "Saved successfully", MessageType.Succeed);
                    Success(res.ReceiptID, res);
                    Save_Succ_But();
                }
                else {
                    DisplayMassage("خطأء", "Error", MessageType.Error);
                }
            }
        });
    }
    function Update() {
        debugger;
        if (!CheckDate(DateFormat(txtTrDate.value).toString(), DateFormat(SysSession.CurrentEnvironment.StartDate).toString(), DateFormat(SysSession.CurrentEnvironment.EndDate).toString())) {
            WorningMessage("  التاريخ ليس متطابق مع تاريخ المتاح (" + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ")", "Date does not match available date(" + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ")", "تحذير", "worning");
            return;
        }
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("AccTrReceipt", "Update"),
            data: JSON.stringify(Model),
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    var res = result.Response;
                    DisplayMassage("تم التعديل بنجاح", "Success", MessageType.Succeed);
                    Success(res.ReceiptID, res);
                    Save_Succ_But();
                }
                else {
                    DisplayMassage("خطأء", "Error", MessageType.Error);
                }
            }
        });
    }
    function Open() {
        debugger;
        if (!CheckDate(DateFormat(txtTrDate.value).toString(), DateFormat(SysSession.CurrentEnvironment.StartDate).toString(), DateFormat(SysSession.CurrentEnvironment.EndDate).toString())) {
            WorningMessage("  التاريخ ليس متطابق مع تاريخ المتاح (" + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ")", "Date does not match available date(" + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ")", "تحذير", "worning");
            return;
        }
        Assign();
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("AccTrReceipt", "Open"),
            data: JSON.stringify(Model),
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    var res = result.Response;
                    DisplayMassage("تم فك الاعتماد بنجاح", "Success", MessageType.Succeed);
                    Success(res.ReceiptID, res);
                    Save_Succ_But();
                }
                else {
                    DisplayMassage("خطأء", "Error", MessageType.Error);
                }
            }
        });
    }
    function Success(ReceiptID, res) {
        Details = Details.filter(function (x) { return x.ReceiptID != ReceiptID; });
        Details.push(res);
        Details = Details.sort(dynamicSort("TrNo"));
        ReportGrid.SelectedItem = res;
        $('#id_ReportGrid').removeClass('display_none');
        $('#Div_control').addClass('display_none');
        ReportGrid.DataSource = Details;
        ReportGrid.Bind();
        CleanDetails();
        DisplayDetails(ReportGrid.SelectedItem);
        disabled();
    }
    //***************************************************************************Print*********************************************************     
    function PrintReport(OutType) {
        // 
        if (!SysSession.CurrentPrivileges.PrintOut)
            return;
        var rp = new ReportParameters();
        rp.RepType = OutType; //output report as View
        rp.FromDate = DateFormatRep(txtDateFrom.value);
        rp.ToDate = DateFormatRep(txtDateTo.value);
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
        if (txt_ReceiptNoteF.selectedIndex > 0)
            rp.RecType = Number($("#txt_ReceiptNote").val());
        else
            rp.RecType = -1;
        if (txt_D_CashBoxF.selectedIndex > 0)
            rp.BoxId = Number($("#txt_D_CashBox").val());
        else
            rp.BoxId = -1;
        /////////////////////////doniaH
        //if (txt_ID_beneficiary.selectedIndex > 0) {
        //    rp.BnfID = $("#txt_ID_beneficiary").val();
        //    rp.BnfDesc = txt_ID_beneficiary.value;
        //}
        if ($("#txt_BenCodeH").val() != "") {
            rp.BnfID = $("#txt_BenCodeH").val();
            rp.BnfDesc = $("#txt_BenNameH").val();
        }
        else {
            rp.BnfID = "";
            rp.BnfDesc = "";
        }
        //txt_Status
        if (txt_Status.selectedIndex > 0)
            rp.Status = Number($("#txt_Status").val());
        else
            rp.Status = 2;
        rp.TrType = 1;
        if ($("#txtCashType").val() == "null") {
            rp.CashType = -1;
        }
        else {
            rp.CashType = $("#txtCashType").val();
        }
        Ajax.Callsync({
            url: Url.Action("IProc_Rpt_AccReceiptList", "GeneralReports"),
            data: rp,
            success: function (d) {
                var result = d.result;
                PrintReportLog(SysSession.CurrentEnvironment.UserCode, SysSession.CurrentEnvironment.CompCode, SysSession.CurrentEnvironment.BranchCode, Modules.AccTrReceiptNote, SysSession.CurrentEnvironment.CurrentYear);
                window.open(result);
                // window.close(result)
            }
        });
    }
    AccTrReceiptNoteNew.PrintReport = PrintReport;
    function PrintTransaction() {
        if (!SysSession.CurrentPrivileges.PrintOut)
            return;
        var rp = new ReportParameters();
        rp.Type = 0;
        rp.slip = 0;
        rp.Repdesign = 1;
        rp.TRId = Number($('#ReceiptID').val());
        rp.Name_function = "rptReceiptNote";
        localStorage.setItem("Report_Data", JSON.stringify(rp));
        PrintTransactionLog(SysSession.CurrentEnvironment.UserCode, SysSession.CurrentEnvironment.CompCode, SysSession.CurrentEnvironment.BranchCode, Modules.AccTrReceiptNote, SysSession.CurrentEnvironment.CurrentYear, rp.TRId.toString());
        localStorage.setItem("result", '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>');
        window.open(Url.Action("ReportsPopup", "Home"), "_blank");
    }
    function btnPrintslip_onclick() {
        if (!SysSession.CurrentPrivileges.PrintOut)
            return;
        var rp = new ReportParameters();
        rp.CompCode = SysSession.CurrentEnvironment.CompCode;
        rp.BranchCode = SysSession.CurrentEnvironment.BranchCode;
        rp.CompNameA = SysSession.CurrentEnvironment.CompanyNameAr;
        rp.CompNameE = SysSession.CurrentEnvironment.CompanyName;
        rp.UserCode = SysSession.CurrentEnvironment.UserCode;
        rp.Tokenid = SysSession.CurrentEnvironment.Token;
        rp.ScreenLanguage = SysSession.CurrentEnvironment.ScreenLanguage;
        rp.SystemCode = SysSession.CurrentEnvironment.SystemCode;
        rp.SubSystemCode = SysSession.CurrentEnvironment.SubSystemCode;
        var BranchNameA = SysSession.CurrentEnvironment.BranchName;
        var BranchNameE = SysSession.CurrentEnvironment.BranchName;
        if (BranchNameA == null || BranchNameE == null) {
            BranchNameA = " ";
            BranchNameE = " ";
        }
        rp.BraNameA = BranchNameA;
        rp.BraNameE = BranchNameE;
        rp.Type = 0;
        rp.slip = 1;
        rp.Repdesign = 1;
        rp.TRId = Number($('#ReceiptID').val());
        Ajax.CallAsync({
            url: Url.Action("rptReceiptNote", "GeneralReports"),
            data: rp,
            success: function (d) {
                var result = d.result;
                PrintTransactionLog(SysSession.CurrentEnvironment.UserCode, SysSession.CurrentEnvironment.CompCode, SysSession.CurrentEnvironment.BranchCode, Modules.AccTrReceiptNote, SysSession.CurrentEnvironment.CurrentYear, rp.TRId.toString());
                window.open(result, "_blank");
            }
        });
    }
    function btnPrintsFrom_To_onclick() {
        btnShow_onclick();
        var BenID = Number($('#txt_BenIDF').val());
        var Boxid = txt_D_CashBoxF.value == 'null' ? null : Number(txt_D_CashBoxF.value);
        var Status = txt_Status.value == 'All' ? null : txt_Status.value;
        var RecPayTypeId = txt_ReceiptNoteF.value == 'null' ? null : Number(txt_ReceiptNoteF.value);
        var DateFrom = DateFormatRep(txtDateFrom.value);
        var DateTo = DateFormatRep(txtDateTo.value);
        var CashType = txtCashTypeF.value == "null" ? -1 : Number(txtCashTypeF.value);
        try {
            var Name_ID = 'ReceiptID';
            var NameTable = 'IQ_GetBoxReceiveList';
            var Condation1 = "  TrType=" + TrType + " and CompCode = " + CompCode + " and BranchCode =" + BranchCode + " " +
                " and TrDate >=' " + DateFrom + "' and TrDate <= ' " + DateTo + " ' ";
            var Condation2 = " ";
            if (CashType != -1)
                Condation2 = Condation2 + " and CashType=" + CashType;
            if (Boxid != null)
                Condation2 = Condation2 + " and CashBoxID=" + Boxid;
            if (RecPayTypeId != null)
                Condation2 = Condation2 + " and RecPayTypeId=" + RecPayTypeId;
            if (BenID != 0) {
                if (RecPayTypeId == 1) {
                    Condation2 = Condation2 + " and CustomerID =" + BenID;
                }
                else if (RecPayTypeId == 2) {
                    Condation2 = Condation2 + " and VendorID =" + BenID;
                }
                else if (RecPayTypeId == 3) {
                    Condation2 = Condation2 + " and BankAccountCode ='" + BenID + "'";
                }
                else if (RecPayTypeId == 4) {
                    Condation2 = Condation2 + " and ExpenseID =" + BenID;
                }
                else if (RecPayTypeId == 5) {
                    Condation2 = Condation2 + " and FromCashBoxID =" + BenID;
                }
            }
            if (Status != null)
                Condation2 = Condation2 + " and Status=" + Status;
            var Condation3 = Condation1 + Condation2 + " ORDER BY TrNo ASC;";
            PrintsFrom_To(TransType.AccReceive, Name_ID, NameTable, Condation3, Details.length);
        }
        catch (e) {
            return;
        }
    }
})(AccTrReceiptNoteNew || (AccTrReceiptNoteNew = {}));
//# sourceMappingURL=AccTrReceiptNoteNew.js.map