$(document).ready(function () {
    AccTrPaymentNoteNew.InitalizeComponent();
});
var AccTrPaymentNoteNew;
(function (AccTrPaymentNoteNew) {
    var sys = new SystemTools();
    var SysSession = GetSystemSession(Modules.AccTrPaymentNoteNew);
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);
    var TrType = 2;
    var codeType = "PayType";
    var Name_Not = (lang == "ar" ? 'صرف' : 'Receipt');
    var CompCode = Number(SysSession.CurrentEnvironment.CompCode);
    var BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);
    var ReportGrid = new JsGrid();
    var Details = new Array();
    var Model = new A_RecPay_Tr_ReceiptNote();
    var txtChargeWithVat;
    var txtCharges;
    var searchbutmemreport;
    var txt_BenCodeF;
    var txt_BenCodeH;
    var txtProviderCode;
    var txtTrDate;
    var txtProviderIndDate;
    var txtDueDate;
    var txtDateFrom;
    var txtDateTo;
    var chkStatus;
    var chkIsDeffered;
    var txt_CashAmount;
    var txt_CardAmount;
    var txt_Amount;
    var txtProviderInvoiceNo;
    var txt_note;
    var txtProviderName;
    var txtCashTypeF;
    var txtCashTypeH;
    var txt_ReceiptNoteF;
    var txt_ReceiptNoteH;
    var txt_BankAcc_Code;
    var dbChargeBank;
    var dbCC_Code;
    var txt_Status;
    var txt_D_CashBoxF;
    var txt_D_CashBoxH;
    var dbChargeVatType;
    var dbProviderVatType;
    var btnBack;
    var btnShow;
    var btnAdd;
    var btnUpdate;
    var btnSave;
    var btnBenF;
    var btnBenH;
    var btnProv;
    //////////////////////////////////////////print buttons////////////////////////////////////////////     
    var btnPrintTrview;
    var btnPrintTrPDF;
    var btnPrintTrEXEL;
    var btnPrintTransaction;
    var btnSend;
    var btnPrintslip;
    var btnPrintsFrom_To;
    var Flag_IsNew = false;
    var ProviderName = "";
    var Type;
    function InitalizeComponent() {
        document.getElementById('Screen_name').innerHTML = (lang == "ar" ? "سند " + Name_Not + "" : " " + Name_Not + "");
        InitalizeControls();
        InitalizeEvents();
        InitializeGrid();
        txtDateFrom.value = DateStartMonth();
        txtDateTo.value = ConvertToDateDash(GetDate()) <= ConvertToDateDash(SysSession.CurrentEnvironment.EndDate) ? GetDate() : SysSession.CurrentEnvironment.EndDate;
        GetData_Header_loader();
        //fillddlCashBox();
        //fillddlG_Codes();
        //fillddlAcount_Code();
        //fillddlVatType();
        //fillddlChargeBank();
        //fillddlCOST_CENTER();
    }
    AccTrPaymentNoteNew.InitalizeComponent = InitalizeComponent;
    function InitalizeControls() {
        btnShow = document.getElementById("btnShow");
        btnAdd = document.getElementById("btnAdd");
        btnUpdate = document.getElementById("btnUpdate");
        btnSave = document.getElementById("btnSave");
        btnBack = document.getElementById("btnBack");
        btnBenF = document.getElementById("btnBenF");
        btnBenH = document.getElementById("btnBenH");
        btnProv = document.getElementById("btnProv");
        ////////  
        txtCashTypeF = document.getElementById("txtCashTypeF");
        txtCashTypeH = document.getElementById("txtCashTypeH");
        txt_ReceiptNoteF = document.getElementById("txt_ReceiptNoteF");
        txt_ReceiptNoteH = document.getElementById("txt_ReceiptNoteH");
        txt_D_CashBoxH = document.getElementById("txt_D_CashBoxH");
        txt_D_CashBoxF = document.getElementById("txt_D_CashBoxF");
        dbChargeVatType = document.getElementById("dbChargeVatType");
        dbProviderVatType = document.getElementById("dbProviderVatType");
        txt_BankAcc_Code = document.getElementById("txt_BankAcc_Code");
        dbChargeBank = document.getElementById("dbChargeBank");
        dbCC_Code = document.getElementById("dbCC_Code");
        txt_Status = document.getElementById("txt_Status");
        ////////
        txt_BenCodeF = document.getElementById("txt_BenCodeF");
        txt_BenCodeH = document.getElementById("txt_BenCodeH");
        txtProviderCode = document.getElementById("txtProviderCode");
        txt_CashAmount = document.getElementById("txt_CashAmount");
        txt_CardAmount = document.getElementById("txt_CardAmount");
        txt_Amount = document.getElementById("txt_Amount");
        txtProviderInvoiceNo = document.getElementById("txtProviderInvoiceNo");
        txt_note = document.getElementById("txt_note");
        txtProviderName = document.getElementById("txtProviderName");
        txtTrDate = document.getElementById("txtTrDate");
        txtProviderIndDate = document.getElementById("txtProviderIndDate");
        txtDueDate = document.getElementById("txtDueDate");
        chkStatus = document.getElementById("chkStatus");
        chkIsDeffered = document.getElementById("chkIsDeffered");
        txtCharges = document.getElementById("txtCharges");
        txtChargeWithVat = document.getElementById("txtChargeWithVat");
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
        btnProv.onclick = btnProv_onclick;
        //********************************onchange****************************
        txt_BenCodeF.onchange = function () { BenCode_onchange('F'); };
        txt_BenCodeH.onchange = function () { BenCode_onchange('H'); };
        txt_ReceiptNoteF.onchange = function () { CleanBen('F'); };
        txt_ReceiptNoteH.onchange = function () { CleanBen('H'); CleanDiv_Charge_Provider(); };
        txt_CashAmount.onkeyup = function () { txt_Amount.value = (Number(txt_CashAmount.value) + Number(txt_CardAmount.value)).RoundToSt(2); $('#Provider_Div').is(":hidden") == false ? CalculatorProvider() : ""; };
        txt_CardAmount.onkeyup = function () { txt_Amount.value = (Number(txt_CashAmount.value) + Number(txt_CardAmount.value)).RoundToSt(2); $('#Provider_Div').is(":hidden") == false ? CalculatorProvider() : ""; };
        searchbutmemreport.onkeyup = _SearchBox_Change;
        txtCashTypeH.onchange = txtCashTypeH_onchange;
        txtCashTypeF.onchange = txtCashTypeF_onchange;
        chkIsDeffered.onchange = chkIsDeffered_onchange;
        chkStatus.onchange = chkStatus_onchange;
        txtProviderName.onchange = txtProviderName_onchange;
        dbChargeVatType.onchange = function () { CalculatorCharges(false); };
        txtCharges.onkeyup = function () { CalculatorCharges(false); };
        txtChargeWithVat.onkeyup = function () { CalculatorCharges(true); };
        dbProviderVatType.onchange = CalculatorProvider;
        txtProviderCode.onchange = function () { getProVndById($('#txtProviderCode').val(), true); };
        dbChargeBank.onchange = function () { Mode_Charge(); };
        txt_Amount.onkeyup = function () { $('#Provider_Div').is(":hidden") == false ? CalculatorProvider() : ""; };
        txtProviderInvoiceNo.onkeyup = function () { CalculatorProvider(); };
        dbCC_Code.onchange = function () { CalculatorProvider(); };
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
                title: res.App_date, css: "ColumPadding", name: "TrDate", width: "10%",
                itemTemplate: function (s, item) {
                    var txt = document.createElement("label");
                    txt.innerHTML = DateFormat(item.TrDate);
                    return txt;
                }
            },
            { title: 'نوع الصرف', name: (lang == "ar" ? "Type_DescA" : "Type_DescE"), type: "text", width: "11%" },
            { title: res.App_beneficiary_no, name: "Bef_Code", type: "text", width: "11%" },
            { title: res.App_beneficiary, name: "Bef_DescA", type: "text", width: "20%" },
            { title: res.App_Amount, name: "Amount", type: "text", width: "11%" },
            { title: 'مورد الخدمه', name: "ProviderName", type: "text", width: "17%" },
            { title: 'رسوم بنكية', name: "ChargeWithVat", type: "Number", width: "11%" },
            {
                title: res.App_Certified, css: "ColumPadding", name: "statusDesciption", width: "7%",
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
    function GetData_Header_loader() {
        var Table;
        Table =
            [
                { NameTable: 'A_RecPay_D_CashBox', Condition: " CompCode = " + CompCode + " " },
                { NameTable: 'G_Codes', Condition: "" },
                { NameTable: 'A_ACCOUNT', Condition: " COMP_CODE = " + CompCode + " and ACC_TYPE = 3 and DETAIL = 1 " },
                { NameTable: 'A_D_VAT_TYPE', Condition: " COMP_CODE = " + CompCode + " and TYPE = 1" },
                { NameTable: 'A_G_Vendor', Condition: "" },
                { NameTable: 'G_COST_CENTER', Condition: " COMP_CODE = " + CompCode + " " },
                //{ NameTable: 'GProc_GetBranchModules', Condition: " 1, 1 ", IsProc: true, IsExec: true },
            ];
        DataResult(Table);
        debugger;
        //alert(GetDataTable('GProc_GetBranchModules'))
        //**************************************************************************************************************
        var Listbox = GetDataTable('A_RecPay_D_CashBox');
        DocumentActions.FillCombowithdefult(Listbox, txt_D_CashBoxF, "CashBoxID", (lang == "ar" ? 'CashBox_DescA' : 'CashBox_DescE'), (lang == "ar" ? 'اختر الصندوق' : 'Box'));
        DocumentActions.FillCombowithdefult(Listbox, txt_D_CashBoxH, "CashBoxID", (lang == "ar" ? 'CashBox_DescA' : 'CashBox_DescE'), (lang == "ar" ? 'اختر الصندوق' : 'Box'));
        //**************************************************************************************************************
        var ListAcc = GetDataTable('A_ACCOUNT');
        DocumentActions.FillCombowithdefult(ListAcc, txt_BankAcc_Code, "ACC_CODE", (lang == "ar" ? 'ACC_DESCA' : 'ACC_DESCL'), (lang == "ar" ? 'اختر حساب الصرف' : 'Type of constraint'));
        //**************************************************************************************************************
        var ListCodes = GetDataTable('G_Codes');
        var fillModel_GCodes = ListCodes;
        var ChckType = fillModel_GCodes.filter(function (x) { return x.CodeType == 'ChckType'; });
        DocumentActions.FillCombowithdefult(ChckType, txtCashTypeF, "CodeValue", (lang == "ar" ? 'DescA' : 'DescE'), (lang == "ar" ? 'اختر نوع النقد' : 'Type of constraint'));
        DocumentActions.FillCombowithdefult(ChckType, txtCashTypeH, "CodeValue", (lang == "ar" ? 'DescA' : 'DescE'), (lang == "ar" ? 'اختر نوع النقد' : 'Type of constraint'));
        Type = fillModel_GCodes.filter(function (x) { return x.CodeType == codeType; });
        DocumentActions.FillCombowithdefult(Type, txt_ReceiptNoteF, "CodeValue", (lang == "ar" ? 'DescA' : 'DescE'), (lang == "ar" ? "اختر نوع " + Name_Not + "" : 'Type of constraint'));
        DocumentActions.FillCombowithdefult(Type, txt_ReceiptNoteH, "CodeValue", (lang == "ar" ? 'DescA' : 'DescE'), (lang == "ar" ? "اختر نوع " + Name_Not + "" : 'Type of constraint'));
        $('#txt_ReceiptNoteF option[value="6"]').remove();
        //**************************************************************************************************************
        var ListVat = GetDataTable('A_D_VAT_TYPE');
        for (var i = 0; i < ListVat.length; i++) {
            $('#dbChargeVatType').append('<option data_VatPerc="' + ListVat[i].VatPerc + '" value="' + ListVat[i].CODE + '">' + ListVat[i].DESCRIPTION + '</option>');
            $('#dbProviderVatType').append('<option data_VatPerc="' + ListVat[i].VatPerc + '" value="' + ListVat[i].CODE + '">' + ListVat[i].DESCRIPTION + '</option>');
        }
        //**************************************************************************************************************
        var ListBank = GetDataTable('A_G_Vendor');
        DocumentActions.FillCombowithdefult(ListBank, dbChargeBank, "VendorID", (lang == "ar" ? 'NAMEA' : 'NAMEL'), (lang == "ar" ? 'بدون رسوم بنكية' : 'Bank'));
        //**************************************************************************************************************
        var ListCOST = GetDataTable('G_COST_CENTER');
        DocumentActions.FillCombowithdefult(ListCOST, dbCC_Code, "CC_CODE", (lang == "ar" ? 'CC_DESCA' : 'CC_DESCE'), (lang == "ar" ? 'اختر التكلفة' : 'COST'));
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
                    var ChckType = fillModel_GCodes.filter(function (x) { return x.CodeType == 'ChckType'; });
                    DocumentActions.FillCombowithdefult(ChckType, txtCashTypeF, "CodeValue", (lang == "ar" ? 'DescA' : 'DescE'), (lang == "ar" ? 'اختر نوع النقد' : 'Type of constraint'));
                    DocumentActions.FillCombowithdefult(ChckType, txtCashTypeH, "CodeValue", (lang == "ar" ? 'DescA' : 'DescE'), (lang == "ar" ? 'اختر نوع النقد' : 'Type of constraint'));
                    Type = fillModel_GCodes.filter(function (x) { return x.CodeType == codeType; });
                    DocumentActions.FillCombowithdefult(Type, txt_ReceiptNoteF, "CodeValue", (lang == "ar" ? 'DescA' : 'DescE'), (lang == "ar" ? "اختر نوع " + Name_Not + "" : 'Type of constraint'));
                    DocumentActions.FillCombowithdefult(Type, txt_ReceiptNoteH, "CodeValue", (lang == "ar" ? 'DescA' : 'DescE'), (lang == "ar" ? "اختر نوع " + Name_Not + "" : 'Type of constraint'));
                    $('#txt_ReceiptNoteF option[value="6"]').remove();
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
                    DocumentActions.FillCombowithdefult(Model_Acount, txt_BankAcc_Code, "ACC_CODE", (lang == "ar" ? 'ACC_DESCA' : 'ACC_DESCL'), (lang == "ar" ? 'اختر حساب الصرف' : 'Type of constraint'));
                }
            }
        });
    }
    function fillddlVatType() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GenVatType", "GetAll"),
            data: {
                CompCode: CompCode, VatType: 1, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    var VatTypeDetails = result.Response;
                    for (var i = 0; i < VatTypeDetails.length; i++) {
                        $('#dbChargeVatType').append('<option data_VatPerc="' + VatTypeDetails[i].VatPerc + '" value="' + VatTypeDetails[i].CODE + '">' + VatTypeDetails[i].DESCRIPTION + '</option>');
                        $('#dbProviderVatType').append('<option data_VatPerc="' + VatTypeDetails[i].VatPerc + '" value="' + VatTypeDetails[i].CODE + '">' + VatTypeDetails[i].DESCRIPTION + '</option>');
                    }
                }
            }
        });
    }
    function fillddlChargeBank() {
        var query = "select * from [dbo].[A_G_Vendor]";
        var NameTable = "A_G_Vendor";
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("SystemTools", "Get_Table"),
            data: {
                query: query, NameTable: NameTable
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    var ListBank = result.Response;
                    DocumentActions.FillCombowithdefult(ListBank, dbChargeBank, "VendorID", (lang == "ar" ? 'NAMEA' : 'NAMEL'), (lang == "ar" ? 'بدون رسوم بنكية' : 'Bank'));
                }
            }
        });
    }
    function fillddlCOST_CENTER() {
        var query = "select * from G_COST_CENTER where COMP_CODE = " + CompCode + "";
        var NameTable = "G_COST_CENTER";
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("SystemTools", "Get_Table"),
            data: {
                query: query, NameTable: NameTable
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    var ListCOST = result.Response;
                    DocumentActions.FillCombowithdefult(ListCOST, dbCC_Code, "CC_CODE", (lang == "ar" ? 'CC_DESCA' : 'CC_DESCE'), (lang == "ar" ? 'اختر التكلفة' : 'COST'));
                }
            }
        });
    }
    //************************************************Btn_Events**********************************
    function btnBen_onclick(Type) {
        debugger;
        if ($('#txt_ReceiptNote' + Type).val() == "null") {
            DisplayMassage("برجاء اختيار نوع الصرف", "", MessageType.Worning);
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
        if ($('#txt_ReceiptNote' + Type).val() == "6") {
            BenAcc(Type);
        }
    }
    function btnProv_onclick() {
        var cond = " CompCode= " + CompCode + "and IsCreditVendor = 1 and Isactive = 1";
        sys.FindKey(Modules.AccTrReceiptNote, "btnVndSrch", cond, function () {
            var id = SearchGrid.SearchDataGrid.SelectedKey;
            getProVndById(id, false);
        });
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
            if (Flag_IsNew == true) {
                $("#txtCreatedBy").val(SysSession.CurrentEnvironment.UserCode);
                $("#txtCreatedAt").val(DateTimeFormat(Date().toString()));
                if ($('#dbChargeBank').is(":hidden") == false) {
                    if ($('#dbChargeBank').val() == 'null') {
                        Errorinput($('#dbChargeBank'));
                        WorningMessage("لا يوجد رسوم بنكية لعملية الصرف ، هل انت متأكد الحفظ ؟ ", "Do you want to delete?", "تنبيه", "worning", function () {
                            loading('btnSave');
                            setTimeout(function () {
                                Assign();
                                Insert();
                                finishSave('btnSave');
                            }, 100);
                        });
                    }
                    else {
                        Assign();
                        Insert();
                    }
                }
                else {
                    Assign();
                    Insert();
                }
            }
            else {
                $("#txtUpdatedBy").val(SysSession.CurrentEnvironment.UserCode);
                $("#txtUpdatedAt").val(DateTimeFormat(Date().toString()));
                if ($('#dbChargeBank').is(":hidden") == false) {
                    if ($('#dbChargeBank').val() == 'null') {
                        Errorinput($('#dbChargeBank'));
                        WorningMessage("لا يوجد رسوم بنكية لعملية الصرف ، هل انت متأكد الحفظ ؟ ", "Do you want to delete?", "تنبيه", "worning", function () {
                            loading('btnSave');
                            setTimeout(function () {
                                Assign();
                                Update();
                                finishSave('btnSave');
                            }, 100);
                        });
                    }
                    else {
                        Assign();
                        Update();
                    }
                }
                else {
                    Assign();
                    Update();
                }
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
    //************************************************Change_Events**********************************
    function BenCode_onchange(Type) {
        debugger;
        if ($('#txt_ReceiptNote' + Type).val() == "null") {
            DisplayMassage("برجاء اختيار نوع الصرف", "", MessageType.Worning);
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
        if ($('#txt_ReceiptNote' + Type).val() == "6") {
            getAccountAccById(Type, $('#txt_BenCode' + Type).val(), true);
        }
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
    function txtCashTypeF_onchange() {
        DocumentActions.FillCombowithdefult(Type, txt_ReceiptNoteF, "CodeValue", (lang == "ar" ? 'DescA' : 'DescE'), (lang == "ar" ? "اختر نوع " + Name_Not + "" : 'Type of constraint'));
        $('#txt_ReceiptNoteF option[value="6"]').remove();
        if (txtCashTypeF.value == '9') {
            $('#txt_ReceiptNoteF').html('');
            $('#txt_ReceiptNoteF').append('<option value="6">مصروف مستحق</option>');
            txt_ReceiptNoteF.value = '6';
        }
        else {
            txt_ReceiptNoteF.value = 'null';
        }
    }
    function txtCashTypeH_onchange() {
        $('._dis_Bank').attr('disabled', 'disabled');
        $('#Charge_Div').addClass('display_none');
        $('#Provider_Div').addClass('display_none');
        $('#txt_CheckNo').removeClass('display_none');
        $('#txt_TransferNo').addClass('display_none');
        $('._Card').addClass('display_none');
        $('._Cash').addClass('display_none');
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
        $('#txtDueDate').attr('disabled', 'disabled');
        DocumentActions.FillCombowithdefult(Type, txt_ReceiptNoteH, "CodeValue", (lang == "ar" ? 'DescA' : 'DescE'), (lang == "ar" ? "اختر نوع " + Name_Not + "" : 'Type of constraint'));
        $('#txt_ReceiptNoteH option[value="6"]').remove();
        if (txtCashTypeH.value == '0') { // نقدي 
            $('._Cash').removeClass('display_none');
        }
        else if (txtCashTypeH.value == '8') { //تحصيل شبكة  
            $('._Card').removeClass('display_none');
        }
        else { // الجميع 
            $('._dis_Bank').removeAttr('disabled');
            $('#txt_Amount').removeAttr('disabled');
            if (txtCashTypeH.value != '9') {
                $('#Charge_Div').removeClass('display_none');
            }
            if (txtCashTypeH.value == '1' || txtCashTypeH.value == '2') {
                $('#txt_CheckNo').addClass('display_none');
                $('#txt_TransferNo').removeClass('display_none');
            }
        }
        if (txt_ReceiptNoteH.value == '4' || txt_ReceiptNoteH.value == '6') {
            $('#Provider_Div').removeClass('display_none');
        }
        if (txtCashTypeH.value == '9') {
            $('#txt_ReceiptNoteH').html('');
            $('#txt_ReceiptNoteH').append('<option value="6">مصروف مستحق</option>');
            txt_ReceiptNoteH.value = '6';
            Mode_CashType();
            $('._dis_Bank').attr('disabled', 'disabled');
        }
        else {
            txt_ReceiptNoteH.value = 'null';
        }
        CleanBen('H');
        CleanDiv_Charge_Provider();
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
    function CalculatorCharges(Calculat_WithVAT) {
        debugger;
        if (dbChargeVatType.value == 'null') {
            $("#txtCharges").val('');
            $("#txtChargesVat").val('');
            $("#txtChargeWithVat").val('');
            Errorinput(dbChargeVatType);
            return;
        }
        var VatPrc = $('option:selected', $("#dbChargeVatType")).attr('data_VatPerc');
        $("#txtChargesVatPrc").val(VatPrc);
        if (Calculat_WithVAT) { // تجميع مع الضريبه
            var NetPrice = Number($("#txtChargeWithVat").val());
            var GetUnitprice = Get_PriceWithVAT(NetPrice, Number(VatPrc), true);
            $("#txtCharges").val((GetUnitprice.unitprice).RoundToSt(2));
        }
        var Vat = (Number($("#txtCharges").val()) * Number(VatPrc)) / 100;
        $("#txtChargesVat").val(Vat.RoundToSt(2));
        if (!Calculat_WithVAT) {
            var Net = (Number($("#txtCharges").val()) + Number($("#txtChargesVat").val())).RoundToSt(2);
            $("#txtChargeWithVat").val(Number(Net));
        }
    }
    function CalculatorProvider() {
        debugger;
        if ($("#dbProviderVatType").val() == 'null') {
            $("#txtProviderVatPrc").val('');
            $("#txtProviderVatAmount").val('');
            $("#txtProviderAmountBeforeVat").val('');
            return;
        }
        if (Number($("#txt_Amount").val()) == 0) {
            Errorinput($("#txt_Amount"));
        }
        var VatPrc = $('option:selected', $("#dbProviderVatType")).attr('data_VatPerc');
        $("#txtProviderVatPrc").val(VatPrc);
        var NetPrice = Number($("#txt_Amount").val());
        var GetUnitprice = Get_PriceWithVAT(NetPrice, Number(VatPrc), true);
        $("#txtProviderAmountBeforeVat").val((GetUnitprice.unitprice.RoundToSt(2)));
        var Vat = (GetUnitprice.unitprice * Number(VatPrc)) / 100;
        $("#txtProviderVatAmount").val(Vat.RoundToSt(2));
    }
    function txtProviderName_onchange() {
        if (txtProviderName.value.trim() != ProviderName.trim()) {
            $('#txtProviderCode').val('');
            $('#txtProviderID').val('');
            $('#txtProviderVatNo').val('');
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
    //****************************************************Vendors**********************************************
    function BenVnd(Type) {
        //var cond = " CompCode= " + CompCode.toString() + " and IsCreditVendor = 1";
        //cond = cond + Type == 'H' ? "and Isactive = 1" : "";
        debugger;
        sys.FindKey(Modules.AccTrReceiptNote, "btnVndSrch", " CompCode= " + CompCode + " and IsCreditVendor = 1 " + (Type == 'H' ? "and Isactive = 1" : ""), function () {
            var id = SearchGrid.SearchDataGrid.SelectedKey;
            getAccountVndById(Type, id, false);
        });
    }
    function getAccountVndById(Type, VenId, code) {
        if (VenId.toString().trim() == '') {
            CleanBen(Type);
            Errorinput($('#txt_BenCode' + Type));
            DisplayMassage("كود المورد غير صحيح", "Wrong Customer code", MessageType.Error);
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
                        DisplayMassage("كود المورد غير صحيح", "Wrong Customer code", MessageType.Error);
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
    //****************************************************Bank*************************************************
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
    //****************************************************Bank*************************************************
    function BenAcc(Type) {
        sys.FindKey(Modules.AccTrReceiptNote, "btnAccBen", "CompCode= " + CompCode + " and TrType = 2 ", function () {
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
            url: sys.apiUrl("AccDefAccounts", "GetPayByCode_and_byid"),
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
    //****************************************************Box**************************************************
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
    //****************************************************Provider********************************************* 
    function getProVndById(VenId, code) {
        $('#txtProviderCode').val('');
        $('#txtProviderName').val('');
        $('#txtProviderID').val('');
        $('#txtProviderVatNo').val('');
        if (VenId.toString().trim() == '') {
            Errorinput($('#txtProviderCode'));
            DisplayMassage("كود المورد غير صحيح", "Wrong Customer code", MessageType.Error);
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
                        Errorinput($('#txtProviderCode'));
                        DisplayMassage("كود المورد غير صحيح", "Wrong Customer code", MessageType.Error);
                    }
                    else {
                        $('#txtProviderCode').val(Model_Vnd[0].VendorCode);
                        $('#txtProviderName').val(Model_Vnd[0].NAMEA);
                        ProviderName = Model_Vnd[0].NAMEA;
                        $('#txtProviderID').val(Model_Vnd[0].VendorID);
                        $('#txtProviderVatNo').val(Model_Vnd[0].VATNo);
                        $('#dbProviderVatType').val(Model_Vnd[0].VATType);
                        CalculatorProvider();
                    }
                }
            }
        });
    }
    //****************************************************CleanInput*******************************************
    function CleanBen(Type) {
        $('#txt_BenCode' + Type).val("");
        $('#txt_BenName' + Type).val("");
        $('#txt_Openbalance' + Type).val("");
        $('#txt_BenID' + Type).val("");
        if (txt_ReceiptNoteH.value == '4' || txt_ReceiptNoteH.value == '6') {
            $('#Provider_Div').removeClass('display_none');
        }
        else {
            $('#Provider_Div').addClass('display_none');
        }
    }
    function Enabled() {
        $('._dis').removeAttr('disabled');
        $('#chkIsDeffered').removeAttr('disabled');
        $('#id_div_Filter').addClass('disabledDiv');
        chkStatus.disabled = !SysSession.CurrentPrivileges.CUSTOM2;
        chkIsDeffered.checked == true ? $('#txtDueDate').removeAttr('disabled') : $('#txtDueDate').attr('disabled', 'disabled');
        if (txtCashTypeH.value != '0' && txtCashTypeH.value != '8' && txtCashTypeH.value != '6') { // نقدي  او تحصيل شبكة  
            $('#txt_Amount').removeAttr('disabled');
            $('._dis_Bank').removeAttr('disabled');
        }
        Mode_Charge();
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
        $("._dbd").val("null");
        txtTrDate.value = GetDate();
        txtProviderIndDate.value = GetDate();
        txtDueDate.value = GetDate();
        chkIsDeffered.checked = false;
        chkStatus.checked = false;
        txtCashTypeH_onchange();
        $('#txt_ReceiptNoteH').append('<option value="6">مصروف مستحق</option>');
    }
    function CleanDiv_Charge_Provider() {
        if ($('#Charge_Div').is(":hidden") == true) { //Charge_____Validation
            $("#Charge_Div :input").val("");
            $(".Charge_db").val("null");
            $("#dbChargeVatType").val("7");
        }
        if ($('#Provider_Div').is(":hidden") == true) { //Provider_____Validation
            $("#Provider_Div :input").val("");
            $(".Prov_db").val("null");
            $("#dbProviderVatType").val("7");
            txtProviderIndDate.value = GetDate();
        }
        Mode_Charge();
    }
    function Mode_Charge() {
        if (dbChargeBank.value == 'null') {
            $("#Charge_Div :input").attr('disabled', 'disabled');
            $('#dbChargeBank').removeAttr('disabled');
            $("#Charge_Div :input").val("");
            $(".Charge_db").val("null");
            $("#dbChargeVatType").val("7");
        }
        else {
            $("#Charge_Div :input").removeAttr('disabled');
        }
    }
    //****************************************************DisplayDetails*********************************************
    function GridDoubleClick() {
        CleanDetails();
        DisplayDetails(ReportGrid.SelectedItem);
        disabled();
    }
    function DisplayDetails(Selecteditem) {
        debugger;
        if (Selecteditem.CashType == 9) { // مصروف مستحق  
            $('#txt_ReceiptNoteH').html('');
            $('#txt_ReceiptNoteH').append('<option value="6">مصروف مستحق</option>');
        }
        else {
            DocumentActions.FillCombowithdefult(Type, txt_ReceiptNoteH, "CodeValue", (lang == "ar" ? 'DescA' : 'DescE'), (lang == "ar" ? "اختر نوع " + Name_Not + "" : 'Type of constraint'));
            $('#txt_ReceiptNoteH option[value="6"]').remove();
        }
        DocumentActions.RenderFromModel(Selecteditem);
        txtTrDate.value = DateFormat(Selecteditem.TrDate);
        txtDueDate.value = DateFormat(Selecteditem.DueDate);
        txtProviderIndDate.value = DateFormat(Selecteditem.ProviderIndDate);
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
        if (Selecteditem.RecPayTypeId == 6) {
            getAccountAccById('H', Selecteditem.ExpenseID.toString(), false);
        }
        Flag_IsNew = false;
        if (chkStatus.checked == true) {
            btnUpdate.disabled = true;
            chkStatus.disabled = !SysSession.CurrentPrivileges.CUSTOM1;
        }
        else {
            btnUpdate.disabled = false;
            chkStatus.disabled = true;
        }
        if (Number(Selecteditem.ProviderID) != 0) {
            getProVndById(Selecteditem.ProviderID.toString(), false);
            $('#txtProviderVatNo').val(Selecteditem.ProviderVatNo);
            $('#dbProviderVatType').val(Selecteditem.ProviderVatType);
            CalculatorProvider();
        }
        Mode_CashType();
    }
    function Mode_CashType() {
        $('#Charge_Div').addClass('display_none');
        $('#Provider_Div').addClass('display_none');
        $('._Cash').addClass('display_none');
        $('._Card').addClass('display_none');
        $('#txt_CheckNo').removeClass('display_none'); //الشيك
        $('#txt_TransferNo').addClass('display_none'); //التحويل
        if (txtCashTypeH.value == '0') { // نقدي 
            $('._Cash').removeClass('display_none');
            if (txt_ReceiptNoteH.value == '4') { //صرف لحساب
                $('#Provider_Div').removeClass('display_none');
            }
        }
        else if (txtCashTypeH.value == '8') { //تحصيل شبكة  
            $('._Card').removeClass('display_none');
            if (txt_ReceiptNoteH.value == '4') { //صرف لحساب
                $('#Provider_Div').removeClass('display_none');
            }
        }
        else {
            if (txt_ReceiptNoteH.value != '6') { //مصروف مستحق
                $('#Charge_Div').removeClass('display_none');
            }
            if (txt_ReceiptNoteH.value == '4' || txt_ReceiptNoteH.value == '6') { //صرف لحساب و مصروف مستحق
                $('#Provider_Div').removeClass('display_none');
            }
            if (txtCashTypeH.value == '1' || txtCashTypeH.value == '2') {
                $('#txt_CheckNo').addClass('display_none'); //الشيك
                $('#txt_TransferNo').removeClass('display_none'); //التحويل
            }
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
        if ($('#txt_BankName').is(":disabled") == false) { //Bank_____Validation
            if ($('#txt_TransferNo').val().trim() == '' && $('#txt_TransferNo').is(":hidden") == false) {
                DisplayMassage("يجب ادخال  رقم التحويله ", " Transfer number must be entered", MessageType.Worning);
                Errorinput($('#txt_TransferNo'));
                return false;
            }
            if ($('#txt_CheckNo').val().trim() == '' && $('#txt_CheckNo').is(":hidden") == false) {
                DisplayMassage("يجب ادخال  رقم الشيك ", " Check number must be entered", MessageType.Worning);
                Errorinput($('#txt_CheckNo'));
                return false;
            }
            if ($('#txt_BankName').val().trim() == '') {
                DisplayMassage("يجب ادخال صرف الي بنك  ", " The entry must be issued by a bank", MessageType.Worning);
                Errorinput($('#txt_BankName'));
                return false;
            }
            if (txt_BankAcc_Code.selectedIndex == 0) {
                DisplayMassage("يجب اختيار  حساب الصرف  ", "You must choose the deposit account number", MessageType.Worning);
                Errorinput(txt_BankAcc_Code);
                return false;
            }
        }
        if ($('#Charge_Div').is(":hidden") == false) { //Charge_____Validation
            if (dbChargeBank.value != 'null') {
                if (dbChargeVatType.value == 'null') {
                    DisplayMassage("يجب اختيار نوع الضريبة  ", "Choose the type of Vat", MessageType.Worning);
                    Errorinput(dbChargeVatType);
                    return false;
                }
                if (Number($('#txtCharges').val()) == 0) {
                    DisplayMassage("يجب ادخال  البلغ   ", " Amount must be entered", MessageType.Worning);
                    Errorinput($('#txtCharges'));
                    return false;
                }
            }
        }
        if ($('#Provider_Div').is(":hidden") == false) { //Provider____Validation
            if (dbProviderVatType.value == 'null') {
                DisplayMassage("يجب اختيار نوع الضريبة  ", "Choose the type of Vat", MessageType.Worning);
                Errorinput(dbProviderVatType);
                return false;
            }
            if (txtProviderName.value.trim() == '' && dbProviderVatType.value != '10') {
                DisplayMassage("يجب ادخال المورد   ", "Choose the type of Ven", MessageType.Worning);
                Errorinput(txtProviderName);
                return false;
            }
            if ($('#txtProviderVatNo').val().trim() == '' && dbProviderVatType.value != '10') {
                DisplayMassage("يجب ادخال الرقم الضريبى   ", "Choose the type of Vat No", MessageType.Worning);
                Errorinput($('#txtProviderVatNo'));
                return false;
            }
            if (dbCC_Code.value == 'null') {
                DisplayMassage("يجب اختيار مركز التكلفة  ", "Choose the type of Cost", MessageType.Worning);
                Errorinput(dbCC_Code);
                return false;
            }
        }
        return true;
    }
    //****************************************************Assign_Data*********************************************
    function Assign() {
        debugger;
        if ($('#Provider_Div').is(":hidden") == false) { //Provider____Validation
            CalculatorProvider();
        }
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
        if (Model.RecPayTypeId == 6) {
            Model.ExpenseID = Number($('#txt_BenIDH').val());
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
        if ($('#txt_BankAcc_Code').val() == 'null') {
            Model.BankAcc_Code = null;
        }
        else {
            Model.BankAcc_Code = $('#txt_BankAcc_Code').val();
        }
        Model.Branch_Code = SysSession.CurrentEnvironment.BranchCode;
        Model.Comp_Code = SysSession.CurrentEnvironment.CompCode;
        Model.MODULE_CODE = Modules.AccTrPaymentNoteNew;
        Model.UserCode = SysSession.CurrentEnvironment.UserCode;
        Model.sec_FinYear = SysSession.CurrentEnvironment.CurrentYear;
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
                    DisplayMassage("تم اصدار سند رقم ( " + res.TrNo + " ) بنجاح", "Saved successfully", MessageType.Succeed);
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
                    DisplayMassage("تم تعديل سند رقم ( " + res.TrNo + " ) بنجاح", "Saved successfully", MessageType.Succeed);
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
                    DisplayMassage("تم فك سند رقم ( " + res.TrNo + " ) بنجاح", "Saved successfully", MessageType.Succeed);
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
            rp.RecType = Number($("#txt_ReceiptNoteF").val());
        else
            rp.RecType = -1;
        if (txt_D_CashBoxF.selectedIndex > 0)
            rp.BoxId = Number($("#txt_D_CashBoxF").val());
        else
            rp.BoxId = -1;
        /////////////////////////doniaH
        //if (txt_ID_beneficiary.selectedIndex > 0) {
        //    rp.BnfID = $("#txt_ID_beneficiary").val();
        //    rp.BnfDesc = txt_ID_beneficiary.value;
        //}
        if ($("#txt_BenCodeF").val() != "") {
            rp.BnfID = $("#txt_BenCodeF").val();
            rp.BnfDesc = $("#txt_BenNameF").val();
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
        rp.TrType = TrType;
        if ($("#txtCashTypeF").val() == "null") {
            rp.CashType = -1;
        }
        else {
            rp.CashType = $("#txtCashTypeF").val();
        }
        Ajax.Callsync({
            url: Url.Action("IProc_Rpt_AccReceiptList", "GeneralReports"),
            data: rp,
            success: function (d) {
                var result = d.result;
                window.open(result);
                // window.close(result)
            }
        });
    }
    AccTrPaymentNoteNew.PrintReport = PrintReport;
    function PrintTransaction() {
        if (!SysSession.CurrentPrivileges.PrintOut)
            return;
        var rp = new ReportParameters();
        rp.Type = 0;
        rp.slip = 0;
        rp.Repdesign = 2;
        rp.TRId = Number($('#ReceiptID').val());
        rp.Name_function = "rptReceiptNote";
        localStorage.setItem("Report_Data", JSON.stringify(rp));
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
        rp.Repdesign = 2;
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
            PrintsFrom_To(TransType.AccPayment, Name_ID, NameTable, Condation3, Details.length);
        }
        catch (e) {
            return;
        }
    }
})(AccTrPaymentNoteNew || (AccTrPaymentNoteNew = {}));
//# sourceMappingURL=AccTrPaymentNoteNew.js.map