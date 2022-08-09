$(document).ready(function () {
    AccDefVendor.InitalizeComponent();
});
var AccDefVendor;
(function (AccDefVendor) {
    // Arrays 
    var AccountType = 2;
    var MSG_ID;
    var Details = new IQVendorMasterDetail();
    var SearchDetails = new Array();
    var CodesTypes = new Array();
    var CurrencyDetails = new Array();
    var ReportGrid = new JsGrid();
    var Details_Type_D_Category = new Array();
    var Details_CustomerGroup = new Array();
    var NationalityDetails = new Array();
    var Model = new A_Pay_D_Vendor;
    var VatTypeDetails = new Array();
    var sys = new SystemTools();
    var SysSession = GetSystemSession(Modules.AccDefVendor);
    var MasterDetailModel = new VendorMasterDetail;
    var DetailsModel = new Array();
    var FilteredModel = new Array();
    var SingleModel = new A_Pay_D_VendorDoc();
    var txt_Cust_Type;
    var txt_Category;
    var txt_Grop;
    var ddlNationality;
    var txtVendorType_New;
    var txt_ID_APP_Category;
    var txt_ID_APP_Group;
    var txt_indebtedness;
    var txt_ID_APP_Type;
    var txt_tax;
    var ddlCurrency;
    var btnBack;
    var btnShow;
    var btnAdd;
    var btnEdit;
    var btnSave;
    var btnAddDetails;
    var btnCust;
    var Is_Vendor;
    var txt_CustCode;
    var txt_CustName;
    var btnsearchACC;
    var txt_ACCCode;
    var txt_ACCName;
    var txt_CustomerCODE;
    var txt_NAME;
    var txt_NAMEE;
    var txt_MOBILE;
    var txt_TEL;
    var txtOperationFixed;
    var txtOperationser;
    var txt_WorkTel;
    var txt_note;
    var txt_VatNo;
    var txt_Debit;
    var txt_DebitFC;
    var txt_Openbalance;
    var txt_CreditLimit;
    var txt_balance;
    var txtResMobile;
    var txtResName;
    var searchbutmemreport;
    var chkActive;
    //--- Print Buttons
    //    var btnPrint: HTMLButtonElement;
    var btnPrintTrview;
    var btnPrintTrPDF;
    var btnPrintTrEXEL;
    var compcode; //SharedSession.CurrentEnvironment.CompCode;
    var IsNew;
    var index;
    var Selecteditem;
    var CustomerIdUpdate = 0;
    var CustomerId;
    var Debit;
    var Credit;
    var Valid = 0;
    var Update_claenData = 0;
    var indebtedness;
    var CountGrid = 0;
    var GlobalVendorID = 0;
    var showAfterInsertOrUpdate = false;
    var ShowFlag = false;
    var PurchaserId;
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);
    var FinYear = (SysSession.CurrentEnvironment.CurrentYear);
    var AccountDetails = new A_Rec_D_Customer();
    //---------------------------------------------------------- main region---------------------------------------------------------------
    function InitalizeComponent() {
        //debugger;
        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = "الموردين";
        }
        else {
            document.getElementById('Screen_name').innerHTML = "Suppliers";
        }
        $('#btnPrintTransaction').addClass('d-none');
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        InitalizeControls();
        InitalizeEvents();
        reference_Page();
        Display_GenDefCustomerCat();
        Display_CustomerGroup();
        fillddlVatType();
        FillddlNationality();
        GetCardTypes();
        GetAllCurrency();
        //   $('#btnPrint').addClass('display_none');   
    }
    AccDefVendor.InitalizeComponent = InitalizeComponent;
    function reference_Page() {
        if (!SysSession.CurrentPrivileges.EDIT) {
            $('#btnUpdate').attr('class', 'btn btn-primary display_none');
            $('#btnSave').attr('class', 'btn btn-success display_none');
            $('#btnBack').attr('class', 'btn btn-success display_none');
        }
        if (!SysSession.CurrentPrivileges.AddNew) {
            $('#btnAdd').attr('class', 'btn btn-primary display_none');
        }
    }
    function InitalizeControls() {
        ////debugger;
        //--- Print Buttons
        //--- Print Buttons
        btnsearchACC = document.getElementById("btnsearchACC");
        txt_ACCCode = document.getElementById("txt_ACCCode");
        txt_ACCName = document.getElementById("txt_ACCName");
        //  btnPrint = document.getElementById("btnPrint") as HTMLButtonElement;
        btnPrintTrview = document.getElementById("btnPrintTrview");
        btnPrintTrPDF = document.getElementById("btnPrintTrPDF");
        btnPrintTrEXEL = document.getElementById("btnPrintTrEXEL");
        txt_ID_APP_Category = document.getElementById("txt_ID_APP_Category");
        txt_ID_APP_Type = document.getElementById("txt_ID_APP_Type");
        ddlCurrency = document.getElementById("ddlCurrency");
        txt_indebtedness = document.getElementById("txt_indebtedness");
        txt_ID_APP_Group = document.getElementById("txt_ID_APP_Group");
        btnShow = document.getElementById("btnShow");
        btnAdd = document.getElementById("btnAdd");
        btnEdit = document.getElementById("btnUpdate");
        btnSave = document.getElementById("btnSave");
        btnBack = document.getElementById("btnBack");
        btnAddDetails = document.getElementById("btnAddDetails");
        btnCust = document.getElementById("btnCust");
        txt_CustCode = document.getElementById("txt_CustCode");
        txt_CustName = document.getElementById("txt_CustName");
        //textBoxes
        txt_CustomerCODE = document.getElementById("txt_CustomerCODE");
        txt_Cust_Type = document.getElementById("txt_Cust_Type");
        txt_tax = document.getElementById("txt_tax");
        txt_NAME = document.getElementById("txt_NAME");
        txt_NAMEE = document.getElementById("txt_NAMEE");
        txt_Category = document.getElementById("txt_Category");
        txt_MOBILE = document.getElementById("txt_MOBILE");
        txt_TEL = document.getElementById("txt_TEL");
        txtOperationser = document.getElementById("txtOperationser");
        txtOperationFixed = document.getElementById("txtOperationFixed");
        txt_WorkTel = document.getElementById("txt_WorkTel");
        txt_note = document.getElementById("txt_note");
        txt_Grop = document.getElementById("txt_Grop");
        ddlNationality = document.getElementById("ddlNationality");
        txtVendorType_New = document.getElementById("txtVendorType_New");
        txt_VatNo = document.getElementById("txt_VatNo");
        txt_Debit = document.getElementById("txt_Debit");
        txt_DebitFC = document.getElementById("txt_DebitFC");
        txt_Openbalance = document.getElementById("txt_Openbalance");
        txt_CreditLimit = document.getElementById("txt_CreditLimit");
        txt_balance = document.getElementById("txt_balance");
        chkActive = document.getElementById("id_chkcustom6");
        txtResMobile = document.getElementById("txtResMobile");
        txtResName = document.getElementById("txtResName");
        searchbutmemreport = document.getElementById("searchbutmemreport");
    }
    function InitalizeEvents() {
        //debugger
        btnShow.onclick = btnShow_onclick;
        btnAdd.onclick = btnAdd_onclick;
        btnSave.onclick = btnsave_onClick;
        btnBack.onclick = btnback_onclick;
        btnEdit.onclick = btnEdit_onclick;
        searchbutmemreport.onkeyup = _SearchBox_Change;
        txt_Openbalance.onkeyup = balance_onchange;
        txt_Cust_Type.onchange = txt_Cust_Type_onchange;
        btnAddDetails.onclick = AddNewRow;
        //debugger
        // Print Buttons
        btnPrintTrview.onclick = function () { PrintReport(1); };
        btnPrintTrPDF.onclick = function () { PrintReport(2); };
        btnPrintTrEXEL.onclick = function () { PrintReport(3); };
        //    btnPrint.onclick = () => { PrintReport(4); }
        btnCust.onclick = btnCust_OnClick;
        //txt_CustCode.onchange = txt_CustCode_onchange;
        //txt_CustomerCODE.onkeyup = txt_CustomerCODE_keyup;
        txtOperationser.onkeyup = txtOperationser_keyup;
        txt_ACCCode.onchange = txt_ACCCode_onchange;
        btnsearchACC.onclick = btnsearchACC_onclick;
    }
    function btnsearchACC_onclick() {
        debugger;
        sys.FindKey(Modules.AccDefCustomer, "btncustSearch", "COMP_CODE= " + compcode + " and DETAIL = 1", function () {
            var id = SearchGrid.SearchDataGrid.SelectedKey;
            getAccountvenById(id);
        });
    }
    function getAccountvenById(custId) {
        debugger;
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefCustomer", "GetCustomerACC"),
            data: { Id: custId, COMP_CODE: SysSession.CurrentEnvironment.CompCode, FIN_YEAR: FinYear, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                ;
                if (result.IsSuccess) {
                    var AccountDeta = result.Response;
                    if (AccountDeta.length == 0) {
                        txt_ACCCode.value = "";
                        txt_ACCName.value = "";
                        Errorinput(txt_ACCCode);
                        DisplayMassage("كود العميل غير صحيح", "Customer code is wrong", MessageType.Error);
                    }
                    else {
                        $('#txt_ACCCode').val(AccountDeta[0].ACC_CODE);
                        $('#txt_ACCName').val(AccountDeta[0].ACC_DESCA);
                    }
                }
            }
        });
    }
    function txt_ACCCode_onchange() {
        txt_ACCName.value = "";
        getAccountvenById(txt_ACCCode.value);
    }
    //---------------------------------------------------------- Events region---------------------------------------------------------------
    //function txt_CustomerCODE_keyup() {
    //    var codeLength = txt_CustomerCODE.value.length;
    //    if (codeLength > 3) {
    //        txt_CustomerCODE.value = "";
    //        DisplayMassage("يجب الا يزيد الكود عن 3 ارقام", "code must not be more than 3 numbers", MessageType.Error);
    //    }
    //}
    function txtOperationser_keyup() {
        var codeLength = txtOperationser.value.length;
        if (codeLength > 10) {
            txtOperationser.value = "";
            DisplayMassage("يجب الا يزيد مسلسل العملية عن 10 ارقام", "Operation serial must not be more than 10 numbers", MessageType.Error);
        }
    }
    function btnCust_OnClick() {
        debugger;
        sys.FindKey(Modules.AccDefVendor, "btncustSearch", "CompCode= " + compcode + "", function () {
            var id = SearchGrid.SearchDataGrid.SelectedKey;
            getAccountById(id);
        });
    }
    function getAccountById(custId) {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefCustomer", "GetCustomerByCustomerId"),
            data: { CustomerId: custId, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                debugger;
                if (result.IsSuccess) {
                    AccountDetails = result.Response;
                    $('#txt_CustCode').val(AccountDetails.CustomerCODE);
                    $('#txt_CustName').val(AccountDetails.NAMEA);
                    PurchaserId = custId;
                }
            }
        });
    }
    function txt_Cust_Type_onchange() {
        if (txt_Cust_Type.value == "1" || txt_Cust_Type.value == "Null") {
            $('#div_Balance').removeClass("display_none");
            Is_Vendor = SysSession.CurrentEnvironment.I_Control[0].ISCustVendorInGL;
            if (Is_Vendor == true) {
                $('#divAccount').removeClass('display_none');
            }
            else {
                $('#txt_CustCode').val('');
                $('#txt_CustName').val('');
                $('#divAccount').addClass('display_none');
            }
        }
        else {
            $('#div_Balance').addClass("display_none");
            txt_Openbalance.value = "0";
            txt_CreditLimit.value = "0";
            txt_Debit.value = "0";
            txt_DebitFC.value = "0";
            txt_balance.value = "0";
            Debit = 0;
            Credit = 0;
            $('#txt_CustCode').val('');
            $('#txt_CustName').val('');
            $('#divAccount').addClass('display_none');
        }
    }
    function balance_onchange() {
        if (IsNew == true) {
        }
        else {
            txt_balance.value = (Number(txt_Openbalance.value) - Debit + Credit).toString();
        }
    }
    //---------------------------------------------------------- enable && disable &&validation && Search  region---------------------------------------------------------------
    function txt_disabled() {
        //debugger;
        $("#txt_ACCCode").attr("disabled", "disabled");
        $("#btnsearchACC").attr("disabled", "disabled");
        $("#txt_CustomerCODE").attr("disabled", "disabled");
        $("#txt_Cust_Type").attr("disabled", "disabled");
        $("#id_chkcustom6").attr("disabled", "disabled");
        $("#txt_NAME").attr("disabled", "disabled");
        $("#txt_NAMEE").attr("disabled", "disabled");
        $("#txt_Category").attr("disabled", "disabled");
        $("#txt_Grop").attr("disabled", "disabled");
        $("#txt_MOBILE").attr("disabled", "disabled");
        $("#txt_TEL").attr("disabled", "disabled");
        $("#txtOperationFixed").attr("disabled", "disabled");
        $("#txtOperationser").attr("disabled", "disabled");
        $("#txt_Email").attr("disabled", "disabled");
        $("#txt_WorkTel").attr("disabled", "disabled");
        $("#txt_note").attr("disabled", "disabled");
        $("#txt_tax").attr("disabled", "disabled");
        $("#txt_VatNo").attr("disabled", "disabled");
        $("#txt_Debit").attr("disabled", "disabled");
        $("#txt_DebitFC").attr("disabled", "disabled");
        $("#txt_balance").attr("disabled", "disabled");
        $("#txt_Openbalance").attr("disabled", "disabled");
        $("#txt_OpenbalanceAt").attr("disabled", "disabled");
        $("#txt_CreditLimit").attr("disabled", "disabled");
        $("#txtResName").attr("disabled", "disabled");
        $("#txtResMobile").attr("disabled", "disabled");
        $("#ddlNationality").attr("disabled", "disabled");
        $("#txtVendorType_New").attr("disabled", "disabled");
        $("#ddlCurrency").attr("disabled", "disabled");
        $("#txtRegion").attr("disabled", "disabled");
        $("#txtCity").attr("disabled", "disabled");
        $("#txtPostalCode").attr("disabled", "disabled");
        $("#txtStreet1").attr("disabled", "disabled");
        $("#txtStreet2").attr("disabled", "disabled");
        $("#txtBuilding1").attr("disabled", "disabled");
        $("#txtBuilding2").attr("disabled", "disabled");
        $("#txtProvince").attr("disabled", "disabled");
        $("#btnCust").attr("disabled", "disabled");
        $("#txt_CustCode").attr("disabled", "disabled");
    }
    function removedisabled() {
        //debugger;
        $("#txt_ACCCode").removeAttr("disabled");
        $("#btnsearchACC").removeAttr("disabled");
        $("#txt_CustomerCODE").removeAttr("disabled");
        $("#txt_Cust_Type").removeAttr("disabled");
        $("#id_chkcustom6").removeAttr("disabled");
        $("#txt_NAME").removeAttr("disabled");
        $("#txt_NAMEE").removeAttr("disabled");
        $("#txt_Category").removeAttr("disabled");
        $("#txt_Grop").removeAttr("disabled");
        $("#txt_MOBILE").removeAttr("disabled");
        $("#txt_TEL").removeAttr("disabled");
        $("#txtOperationFixed").removeAttr("disabled");
        $("#txtOperationser").removeAttr("disabled");
        $("#txt_Email").removeAttr("disabled");
        $("#txt_WorkTel").removeAttr("disabled");
        $("#txt_note").removeAttr("disabled");
        $("#txt_tax").removeAttr("disabled");
        $("#txt_VatNo").removeAttr("disabled");
        $("#txt_Debit").removeAttr("disabled");
        $("#txt_DebitFC").removeAttr("disabled");
        $("#txt_balance").removeAttr("disabled");
        $("#txt_Openbalance").removeAttr("disabled");
        $("#txt_CreditLimit").removeAttr("disabled");
        $("#txtResName").removeAttr("disabled");
        $("#txtResMobile").removeAttr("disabled");
        $("#ddlNationality").removeAttr("disabled");
        $("#txtVendorType_New").removeAttr("disabled");
        $("#txt_OpenbalanceAt").removeAttr("disabled");
        $("#ddlCurrency").removeAttr("disabled");
        $("#txtRegion").removeAttr("disabled");
        $("#txtCity").removeAttr("disabled");
        $("#txtPostalCode").removeAttr("disabled");
        $("#txtStreet1").removeAttr("disabled");
        $("#txtStreet2").removeAttr("disabled");
        $("#txtBuilding1").removeAttr("disabled");
        $("#txtBuilding2").removeAttr("disabled");
        $("#txtProvince").removeAttr("disabled");
        $("#btnCust").removeAttr("disabled");
        //$("#txt_CustCode").removeAttr("disabled");
    }
    function Validation() {
        var newCount = 0;
        for (var i = 0; i < CountGrid; i++) {
            if ($("#txt_StatusFlag" + i).val() != "d" && $("#txt_StatusFlag" + i).val() != "m") {
                newCount++;
            }
        }
        if (txt_CustomerCODE.value.trim() == "") {
            DisplayMassage("يجب ادخال رقم المورد", "Vendor number must be entered", MessageType.Worning);
            Errorinput(txt_CustomerCODE);
            return false;
        }
        if (IsNew == true && txt_CustomerCODE.value.trim() != "") {
            if (CustomerFoundBefore() == false) {
                DisplayMassage("رقم المورد موجود من قبل ", "vendor number found before", MessageType.Worning);
                Errorinput(txt_CustomerCODE);
                return false;
            }
        }
        if (txt_Cust_Type.value == "null") {
            DisplayMassage("يجب اختيار النوع ", "you must choose type", MessageType.Worning);
            Errorinput(txt_Cust_Type);
            return false;
        }
        if (txt_NAME.value.trim() == "" && txt_NAMEE.value.trim() == "") {
            DisplayMassage("يجب ادخال الاسم بالعربي او بالانجليزي ", "The name must be entered in Arabic or English", MessageType.Worning);
            Errorinput(txt_NAME);
            return false;
        }
        if (txtResName.value.trim() == "") {
            DisplayMassage("يجب ادخال المسئول ", "The responsible must be entered", MessageType.Worning);
            Errorinput(txtResName);
            return false;
        }
        Is_Vendor = SysSession.CurrentEnvironment.I_Control[0].ISCustVendorInGL;
        if (Is_Vendor == true && $('#txt_Cust_Type').val() == 1 && $('#txt_ACCCode').val().trim() == '') {
            DisplayMassage("يجب ادخال  حساب المورد  ", "please enter district", MessageType.Worning);
            Errorinput($('#txt_AccountCode'));
            return false;
        }
        if (txtResMobile.value.trim() == "") {
            DisplayMassage("يجب ادخال هاتف المسئول ", " Responsible mobile must be entered", MessageType.Worning);
            Errorinput(txtResMobile);
            return false;
        }
        if (txt_Category.value == "null") {
            DisplayMassage("يجب اختيار الفئة ", "category must be choosed", MessageType.Worning);
            Errorinput(txt_Category);
            return false;
        }
        if (txt_MOBILE.value.trim() == "") {
            DisplayMassage("يجب ادخال رقم الجوال ", "Mobile must be entered", MessageType.Worning);
            Errorinput(txt_MOBILE);
            return false;
        }
        if (txt_Grop.value == "null") {
            DisplayMassage("يجب اختيار المجموعة ", "you must choose Group", MessageType.Worning);
            Errorinput(txt_Grop);
            return false;
        }
        if ($('#txt_Email').val().trim() != '') {
            if (validate_email() == false) {
                DisplayMassage("يجب ادخال البريد الالكتروني صحيح ", "Contact Email Is Not Valid", MessageType.Worning);
                Errorinput($('#txt_Email'));
                return false;
            }
        }
        if (txtVendorType_New.value == "null") {
            DisplayMassage("يجب اختيار نشاط المورد ", "vendor activity must be choosed", MessageType.Worning);
            Errorinput(txtVendorType_New);
            return false;
        }
        if (ddlNationality.value == "null") {
            DisplayMassage("يجب اختيار الدولة ", "country must be choosed", MessageType.Worning);
            Errorinput(ddlNationality);
            return false;
        }
        if (txt_tax.value == "null") {
            DisplayMassage("يجب اختيار نوع الضريبة ", "vat type must be choosed", MessageType.Worning);
            Errorinput(txt_tax);
            return false;
        }
        if (txt_VatNo.value.trim() == "") {
            DisplayMassage("يجب ادخال الرقم الضريبي ", "Must insert Vat Number", MessageType.Worning);
            Errorinput(txt_VatNo);
            return false;
        }
        if ($('#ddlCurrency').val().trim() == 'null') {
            DisplayMassage("يجب ادخال العمله ", "please select Currency", MessageType.Worning);
            Errorinput($('#ddlCurrency'));
            return false;
        }
        var Openbalance = Number($('#txt_Openbalance').val());
        if ((txt_Openbalance.value.trim() == "") && txt_Cust_Type.value == "0") {
            DisplayMassage("يجب ادخال الرصيد الافتتاحى ", "You must enter Open Balance", MessageType.Worning);
            Errorinput(txt_Openbalance);
            return false;
        }
        //if ($('#txtRegion').val().trim() == '') {
        //    DisplayMassage("يجب ادخال المنطقة ", "please enter district", MessageType.Worning);
        //    Errorinput($('#txtRegion'));
        //    return false;
        //}
        //if ($('#txtCity').val().trim() == '') {
        //    DisplayMassage("يجب ادخال المدينة ", "please enter city", MessageType.Worning);
        //    Errorinput($('#txtCity'));
        //    return false;
        //}
        //if ($('#txtPostalCode').val().trim() == '') {
        //    DisplayMassage("يجب ادخال صندوق البريد   ", "please enter postal code", MessageType.Worning);
        //    Errorinput($('#txtPostalCode'));
        //    return false;
        //}
        //if ($('#txtStreet1').val().trim() == '') {
        //    DisplayMassage("يجب ادخال الشارع 1 ", "please enter street1 name", MessageType.Worning);
        //    Errorinput($('#txtStreet1'));
        //    return false;
        //}
        //if ($('#txtBuilding1').val().trim() == '') {
        //    DisplayMassage("يجب رقم المبني ", "please enter Building1 Number", MessageType.Worning);
        //    Errorinput($('#txtBuilding1'));
        //    return false;
        //}
        //if ($('#txtProvince').val().trim() == '') {
        //    DisplayMassage("يجب ادخال المحافظة ", "please enter province", MessageType.Worning);
        //    Errorinput($('#txtProvince'));
        //    return false;
        //}
        //if (newCount == 0) {
        //    DisplayMassage(" برجاء ادخال تفاصيل  بيانات بطاقة الهويه", "Please enter ID  details", MessageType.Error);
        //    AddNewRow();
        //    return false
        //}
        if (txtOperationFixed.value.trim() == '') {
            DisplayMassage("يجب ادخال مميز العمليه", "You must enter the process ID", MessageType.Worning);
            Errorinput($('#txtOperationFixed'));
            return false;
        }
        debugger;
        if (txtOperationFixed.value.trim() != '') {
            var word_length = txtOperationFixed.value.length;
            var word = txtOperationFixed.value;
            var Upper = false;
            var word_Upper = word[word_length - 1].toUpperCase();
            if (word_Upper == '-') {
                Upper = true;
            }
            if (Upper == false) {
                DisplayMassage("يجب ادخال رمز (-) مثال   => BSE-", "You must enter a symbol (-) Example  => BSE- ", MessageType.Worning);
                Errorinput($('#txtOperationFixed'));
                return false;
            }
        }
        if (txtOperationser.value.trim() != '') {
            var word_length = txtOperationser.value.length;
            var word = txtOperationser.value;
            var Upper = false;
            var word_Upper = word[word_length - 1].toUpperCase();
            var word_noUpper = word[0].toUpperCase();
            if (word_Upper == '0' && word_noUpper == '0') {
                Upper = true;
            }
            if (Upper == false) {
                DisplayMassage("يجب عليك إدخال (0) في البداية والنهاية مثال   => 01230", "You must enter (0) in first and end  Example  => 01230 ", MessageType.Worning);
                Errorinput($('#txtOperationser'));
                return false;
            }
        }
        return true;
    }
    function Validation_Grid(rowcount) {
        var IDNo = Number($("#txtIDNo" + rowcount).val());
        if ($("#txt_StatusFlag" + rowcount).val() == "d" || $("#txt_StatusFlag" + rowcount).val() == "m") {
            return true;
        }
        else {
            if ($("#ddlVendIDTypeCode" + rowcount).val() == "null") {
                DisplayMassage(" برجاءادخال نوع الهوية", "Please enter the ID Type", MessageType.Error);
                Errorinput($("#ddlVendIDTypeCode" + rowcount));
                return false;
            }
            else if (IDNo == 0) {
                DisplayMassage(" برجاءادخال  رقم الهوية", "Please enter the ID Number", MessageType.Error);
                Errorinput($("#txtIDNo" + rowcount));
                return false;
            }
            else if ($("#txtIDIssuePlace" + rowcount).val().trim() == "") {
                DisplayMassage(" برجاءمكان الاصدار", "Please enter the Issue Place", MessageType.Error);
                Errorinput($("#txtIDIssuePlace" + rowcount));
                return false;
            }
            else if (DateFormat($("#txtIDIssueDate" + rowcount).val()) > DateFormat($("#txtIDExpireDate" + rowcount).val())) {
                DisplayMassage(" يجب ان يكون تاريخ الانتهاء بعد تاريخ الاصدار", "Please enter the Issue Place", MessageType.Error);
                Errorinput($("#txtIDExpireDate" + rowcount));
                return false;
            }
            return true;
        }
    }
    function CustomerFoundBefore() {
        var res = true;
        var code = txt_CustomerCODE.value;
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefVendor", "CodeFounBefore"),
            data: {
                code: code, compCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.Response == 0) {
                    res = true;
                }
                else
                    res = false;
            }
        });
        return res;
    }
    function EnableControls() {
        if (!SysSession.CurrentPrivileges.AddNew)
            return;
        $("#Div_control").removeClass("display_none");
        $('#btnSave').removeClass("display_none");
        $('#btnBack').removeClass("display_none");
        $('#btnUpdate').addClass("display_none");
        $('#txt_Category').prop("selectedIndex", 0);
        $('#txt_Cust_Type').prop("selectedIndex", 0);
        $('#ddlNationality').prop("value", "null");
        $('#txtVendorType_New').prop("value", "null");
        $('#txt_tax').prop("value", "null");
        $('#txt_Grop').prop("selectedIndex", 0);
        $('#txt_Email').val("");
        txt_CustomerCODE.value = "";
        txt_NAME.value = "";
        txt_NAMEE.value = "";
        txt_MOBILE.value = "";
        txt_TEL.value = "";
        txtOperationFixed.value = "";
        txtOperationser.value = "";
        txt_WorkTel.value = "";
        txt_note.value = "";
        txt_VatNo.value = "";
        txt_Debit.value = "";
        txt_DebitFC.value = "";
        txt_Openbalance.value = "";
        txt_CreditLimit.value = "";
        txt_balance.value = "";
        txtResMobile.value = "";
        txtResName.value = "";
        txt_CustCode.value = "";
        txt_CustName.value = "";
        $("#txt_OpenbalanceAt").val(GetDate());
        $("#ddlCurrency").val("null");
        $("#txtRegion").val("");
        $("#txtCity").val("");
        $("#txtPostalCode").val("");
        $("#txtStreet1").val("");
        $("#txtStreet2").val("");
        $("#txtBuilding1").val("");
        $("#txtBuilding2").val("");
        $("#txtProvince").val("");
    }
    function _SearchBox_Change() {
        ////debugger;
        if (searchbutmemreport.value != "") {
            var search_1 = searchbutmemreport.value.toLowerCase();
            SearchDetails = Details.IQ_GetVendor.filter(function (x) { return x.NAMEA.toLowerCase().search(search_1) >= 0 || x.VendorCode.toString().search(search_1) >= 0; });
            ReportGrid.DataSource = SearchDetails;
            ReportGrid.Bind();
        }
        else {
            ReportGrid.DataSource = Details.IQ_GetVendor;
            ReportGrid.Bind();
        }
    }
    function validateEmail(email) {
        //debugger
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
    function validate_email() {
        //debugger        
        var email = $("#txt_Email").val();
        validateEmail(email);
        return validateEmail(email);
    }
    //---------------------------------------------------------- buttons region---------------------------------------------------------------
    function btnEdit_onclick() {
        IsNew = false;
        removedisabled();
        if (SysSession.CurrentPrivileges.EDIT) {
            $('#btnSave').removeClass("display_none");
            $('#btnBack').removeClass("display_none");
            $("#div_ContentData :input").removeAttr("disabled");
            $("#btnUpdate").addClass("display_none");
            $("#txt_CustomerCODE").attr("disabled", "disabled");
            $("#txt_Debit").attr("disabled", "disabled");
            $("#txt_DebitFC").attr("disabled", "disabled");
            $("#txt_balance").attr("disabled", "disabled");
            $("#id_div_Add").attr("disabled", "disabled").off('click');
            var x1 = $("#id_div_Add").hasClass("disabledDiv");
            (x1 == true) ? $("#id_div_Add").removeClass("disabledDiv") : $("#id_div_Add").addClass("disabledDiv");
        }
        else {
            $('#btnSave').addClass("display_none");
            $('#btnBack').addClass("display_none");
            $("#btnUpdate").removeClass("display_none");
        }
        if (SysSession.CurrentPrivileges.AddNew) {
            $(".btnAddDetails").removeAttr("disabled");
            $('#btnAddDetails').removeClass("display_none");
        }
        else {
            $(".btnAddDetails").attr("disabled", "disabled");
        }
        if (SysSession.CurrentPrivileges.Remove) {
            //debugger;
            $(".fa-minus-circle").removeClass("display_none");
        }
        else {
            $(".fa-minus-circle").addClass("display_none");
        }
        for (var i = 0; i < CountGrid; i++) {
            $("#ddlVendIDTypeCode" + i).removeAttr("disabled");
            $("#txtIDNo" + i).removeAttr("disabled");
            $("#txtIDIssuePlace" + i).removeAttr("disabled");
            $("#txtIDIssueDate" + i).removeAttr("disabled");
            $("#txtIDExpireDate" + i).removeAttr("disabled");
        }
    }
    function btnAdd_onclick() {
        ShowFlag = false;
        $("#div_Data").html('');
        IsNew = true;
        EnableControls();
        removedisabled();
        $("#txt_Debit").attr("disabled", "disabled");
        $("#txt_DebitFC").attr("disabled", "disabled");
        $("#txt_balance").attr("disabled", "disabled");
        $("#id_div_Add").attr("disabled", "disabled").off('click');
        var x1 = $("#id_div_Add").hasClass("disabledDiv");
        (x1 == true) ? $("#id_div_Add").removeClass("disabledDiv") : $("#id_div_Add").addClass("disabledDiv");
        reference_Page();
        CountGrid = 0;
        AddNewRow();
        SysSession.CurrentEnvironment.I_Control[0].NationalityID != null ? $("#ddlNationality").val(SysSession.CurrentEnvironment.I_Control[0].NationalityID) : $("#ddlNationality").val("null");
        SysSession.CurrentEnvironment.I_Control[0].Currencyid != null ? $("#ddlCurrency").val(SysSession.CurrentEnvironment.I_Control[0].Currencyid) : $("#ddlCurrency").val("null");
        $('#btnAddDetails').removeClass("display_none");
        Is_Vendor = SysSession.CurrentEnvironment.I_Control[0].ISCustVendorInGL;
        if (Is_Vendor == true && $('#txt_Cust_Type').val() == 1 && $('#txt_ACCCode').val().trim() == '') {
            DisplayMassage("يجب ادخال  حساب المورد  ", "please enter district", MessageType.Worning);
            Errorinput($('#txt_AccountCode'));
            return false;
        }
    }
    function btnsave_onClick() {
        loading('btnSave');
        setTimeout(function () {
            finishSave('btnSave');
            if (!Validation())
                return;
            for (var i = 0; i < CountGrid; i++) {
                if (!Validation_Grid(i))
                    return;
            }
            if (IsNew == true) {
                Insert();
                Update_claenData = 0;
                //  btnback_onclick();
            }
            else {
                Update();
                Update_claenData = 1;
                // btnback_onclick();
            }
        }, 100);
    }
    function btnShow_onclick() {
        if ($('#txt_ID_APP_Category').val() == "null" && $('#txt_ID_APP_Group').val() == "null" && $('#txt_ID_APP_Type').val() == "null") {
            DisplayMassage("يجب اختيار واحد علي الاقل من (الفئه - المجموعة - النوع )", "At least one of the tracks must be selected prior to the show", MessageType.Worning);
        }
        else {
            Display();
        }
    }
    function btnback_onclick() {
        Selecteditem = Details.IQ_GetVendor.filter(function (x) { return x.VendorID == Number(ReportGrid.SelectedKey); });
        if (Selecteditem.length == 0) {
            IsNew = true;
        }
        if (IsNew == true) {
            $('#btnAddDetails').addClass("display_none");
            $('#btnSave').addClass("display_none");
            $('#btnBack').addClass("display_none");
            //$("#div_ContentData :input").attr("disabled", "true");
            $(".fa-minus-circle").addClass("display_none");
            $("#btnUpdate").removeClass("display_none");
            $("#btnUpdate").removeAttr("disabled");
            //$("#drpPaymentType").removeAttr("disabled");
            $("#drp_G_Store").removeAttr("disabled");
            txt_disabled();
            $("#Div_control").addClass("display_none");
            $("#id_div_Add").attr("disabled", "");
            $("#id_div_Add").removeClass("disabledDiv");
        }
        else {
            $('#btnAddDetails').addClass("display_none");
            $('#btnSave').addClass("display_none");
            $('#btnBack').addClass("display_none");
            //$("#div_ContentData :input").attr("disabled", "true");
            $(".fa-minus-circle").addClass("display_none");
            $("#btnUpdate").removeClass("display_none");
            $("#btnUpdate").removeAttr("disabled");
            //$("#drpPaymentType").removeAttr("disabled");
            $("#drp_G_Store").removeAttr("disabled");
            txt_disabled();
            //DriverDoubleClick();
            if (Update_claenData != 1) {
                back_Details();
            }
            Update_claenData = 0;
            $("#id_div_Add").attr("disabled", "");
            $("#id_div_Add").removeClass("disabledDiv");
        }
    }
    function back_Details() {
        Selecteditem = Details.AQ_GetVendorDoc.filter(function (x) { return x.VendorId == Number(ReportGrid.SelectedKey); });
        for (var _i = 0, Selecteditem_1 = Selecteditem; _i < Selecteditem_1.length; _i++) {
            var item = Selecteditem_1[_i];
            if (item.Isactive) {
                chkActive.checked = true;
            }
            else
                chkActive.checked = false;
        }
        DisplayData(Selecteditem);
        reference_Page();
    }
    //---------------------------------------------------------- Normal Grid region---------------------------------------------------------------
    function InitializeGrid() {
        var res = GetResourceList("");
        $("#id_ReportGrid").removeClass("display_none");
        ReportGrid.OnRowDoubleClicked = DriverDoubleClick;
        ReportGrid.ElementName = "ReportGrid";
        ReportGrid.PrimaryKey = "VendorID";
        ReportGrid.Paging = true;
        ReportGrid.PageSize = 10;
        ReportGrid.Sorting = true;
        ReportGrid.InsertionMode = JsGridInsertionMode.Binding;
        ReportGrid.Editing = false;
        ReportGrid.Inserting = false;
        ReportGrid.SelectedIndex = 1;
        ReportGrid.OnItemEditing = function () { };
        ReportGrid.Columns = [
            { title: "الرقم", name: "VendorID", type: "text", width: "10%", visible: false },
            { title: res.App_VendorNumber, name: "VendorCode", type: "text", width: "10%" },
            { title: res.SHT_Name, name: (lang == "ar" ? "NAMEA" : "NAMEL"), type: "text", width: "30%" },
            { title: res.App_Mobile, name: "MOBILE", type: "text", width: "12%" },
            { title: res.App_CreditLimit, name: "DebitLimit", type: "text", width: "100px" },
            { title: res.App_openBalance, name: "Openbalance", type: "text", width: "100px" },
            { title: res.App_Debtor, name: "Debit", type: "text", width: "100px" },
            { title: res.App_Creditor, name: "Credit", type: "text", width: "100px" },
            { title: res.App_Balanc, name: "Isbalance", type: "text", width: "100px" },
        ];
        ReportGrid.Bind();
    }
    function Display() {
        indebtedness = $('#txt_indebtedness').val();
        var IsCredit_Type;
        if ($('#txt_ID_APP_Type').val() == "null") {
            IsCredit_Type = 2;
        }
        else {
            IsCredit_Type = Number($('#txt_ID_APP_Type').val());
        }
        var catid;
        if ($('#txt_ID_APP_Category').val() == "null") {
            catid = 0;
        }
        else {
            catid = Number($('#txt_ID_APP_Category').val());
        }
        var Groupid;
        if ($('#txt_ID_APP_Group').val() == "null") {
            Groupid = 0;
        }
        else {
            Groupid = Number($('#txt_ID_APP_Group').val());
        }
        var VendorType;
        if ($('#txtVendorType').val() == "null") {
            VendorType = 0;
        }
        else {
            VendorType = Number($('#txtVendorType').val());
        }
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefVendor", "GetFiltered"),
            data: {
                CompCode: compcode, Catid: catid, Groupid: Groupid, CreditType: IsCredit_Type, VendorType: VendorType, BalType: indebtedness, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                //debugger;
                var result = d;
                if (result.IsSuccess) {
                    Details = result.Response;
                    InitializeGrid();
                    ReportGrid.DataSource = Details.IQ_GetVendor;
                    ReportGrid.Bind();
                }
            }
        });
    }
    function DriverDoubleClick() {
        ShowFlag = true;
        $("#div_Data").html('');
        CountGrid = 0;
        if (showAfterInsertOrUpdate == true) {
            Selecteditem = Details.IQ_GetVendor.filter(function (x) { return x.VendorID == GlobalVendorID; });
            showAfterInsertOrUpdate = false;
        }
        else
            Selecteditem = Details.IQ_GetVendor.filter(function (x) { return x.VendorID == Number(ReportGrid.SelectedKey); });
        for (var _i = 0, Selecteditem_2 = Selecteditem; _i < Selecteditem_2.length; _i++) {
            var item = Selecteditem_2[_i];
            if (item.Isactive) {
                chkActive.checked = true;
            }
            else
                chkActive.checked = false;
        }
        DisplayData(Selecteditem);
        $('#btnUpdate').removeClass("display_none");
        $('#btnUpdate').removeAttr("disabled");
        chkActive.disabled = true;
        IsNew = false;
        Update_claenData = 1;
        btnback_onclick();
        reference_Page();
        $("#Div_control").removeClass("display_none");
        $("#btnAddDetails").addClass("display_none");
        $('#btnSave').addClass("display_none");
        $('#btnBack').addClass("display_none");
    }
    //---------------------------------------------------------- Display region---------------------------------------------------------------
    function DisplayData(Selecteditem) {
        DocumentActions.RenderFromModel(Selecteditem[0]);
        $('#txt_Category').prop("value", Selecteditem[0].CatID);
        if (Selecteditem[0].CURCODE != "")
            $('#ddlCurrency').prop("value", Selecteditem[0].CURCODE);
        if (Selecteditem[0].IsCreditVendor == true) {
            $('#txt_Cust_Type').prop("value", 1);
            $('#div_Balance').removeClass("display_none");
        }
        else {
            $('#txt_Cust_Type').prop("value", 0);
            $('#div_Balance').addClass("display_none");
        }
        $('#txt_Grop').prop("value", Selecteditem[0].GroupId);
        $('#txt_tax').prop("value", Selecteditem[0].VATType);
        $('#ddlNationality').prop("value", Selecteditem[0].NationalityID);
        $('#txtVendorType_New').prop("value", Selecteditem[0].VendorType);
        CustomerId = Selecteditem[0].VendorID;
        Debit = Selecteditem[0].Debit;
        Credit = Selecteditem[0].Credit;
        var Close_TrDate = DateFormat(Selecteditem[0].OpenbalanceAt);
        $('#txt_OpenbalanceAt').val(Close_TrDate);
        $('#txt_balance').val((Selecteditem[0].Openbalance + Selecteditem[0].Debit - Selecteditem[0].Credit));
        FilteredModel = new Array();
        FilteredModel = Details.AQ_GetVendorDoc.filter(function (s) { return s.VendorId == Selecteditem[0].VendorID; });
        for (var i = 0; i < FilteredModel.length; i++) {
            BuildControls(i);
        }
        CountGrid = FilteredModel.length;
        ShowFlag = false;
        for (var i = 0; i < CountGrid; i++) {
            $("#ddlVendIDTypeCode" + i).attr("disabled", "disabled");
            $("#txtIDNo" + i).attr("disabled", "disabled");
            $("#txtIDIssuePlace" + i).attr("disabled", "disabled");
            $("#txtIDIssueDate" + i).attr("disabled", "disabled");
            $("#txtIDExpireDate" + i).attr("disabled", "disabled");
        }
        if (Selecteditem[0].PurchaserId != null && Selecteditem[0].PurchaserId != 0) {
            getAccountById(Selecteditem[0].PurchaserId.toString());
        }
        else {
            $('#txt_CustCode').val('');
            $('#txt_CustName').val('');
            PurchaserId = null;
        }
        $('#txt_Openbalance').val(Selecteditem[0].Openbalance.RoundToSt(2));
        $('#txt_balance').val(Selecteditem[0].Balance.RoundToSt(2));
        $('#txt_Debit').val(Selecteditem[0].Debit.RoundToSt(2));
        $('#txt_DebitFC').val(Selecteditem[0].DebitFC.RoundToSt(2));
        debugger;
        Is_Vendor = SysSession.CurrentEnvironment.I_Control[0].ISCustVendorInGL;
        if (Is_Vendor == true && Selecteditem[0].IsCreditVendor == true) {
            debugger;
            if (Selecteditem[0].VendorID != null && Selecteditem[0].BankAccountNo != "0" && Selecteditem[0].BankAccountNo != "") {
                getAccountvenById(Selecteditem[0].BankAccountNo);
            }
            else {
                $('#txt_ACCCode').val('');
                $('#txt_ACCName').val('');
            }
            $('#divAccount').removeClass('display_none');
        }
        else {
            $('#divAccount').addClass('display_none');
        }
    }
    function Display_CustomerGroup() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GenDefGroup", "GetAll"),
            data: {
                CompCode: compcode, AccountType: AccountType, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    Details_CustomerGroup = result.Response;
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                        DocumentActions.FillCombowithdefult(Details_CustomerGroup, txt_Grop, "GroupID", "Group_DescE", "Select Group");
                        DocumentActions.FillCombowithdefult(Details_CustomerGroup, txt_ID_APP_Group, "GroupID", "Group_DescE", "Select Group");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(Details_CustomerGroup, txt_Grop, "GroupID", "Group_DescA", "اختر المجموعه");
                        DocumentActions.FillCombowithdefult(Details_CustomerGroup, txt_ID_APP_Group, "GroupID", "Group_DescA", "اختر المجموعه");
                    }
                }
            }
        });
    }
    function Display_GenDefCustomerCat() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GenDefCategory", "GetAll"),
            data: {
                CompCode: compcode, AccountType: AccountType, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    Details_Type_D_Category = result.Response;
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                        DocumentActions.FillCombowithdefult(Details_Type_D_Category, txt_ID_APP_Category, "CatID", "Cat_DescE", "Select category");
                        DocumentActions.FillCombowithdefult(Details_Type_D_Category, txt_Category, "CatID", "Cat_DescE", "Select category");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(Details_Type_D_Category, txt_ID_APP_Category, "CatID", "Cat_DescA", "اختر الفئة");
                        DocumentActions.FillCombowithdefult(Details_Type_D_Category, txt_Category, "CatID", "Cat_DescA", "اختر الفئة");
                    }
                }
            }
        });
    }
    //---------------------------------------------------------- Drop Down region---------------------------------------------------------------
    function FillddlNationality() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("Nationality", "GetAll"),
            data: {
                UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    NationalityDetails = result.Response;
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                        DocumentActions.FillCombowithdefult(NationalityDetails, ddlNationality, "NationalityID", "DescL", "Select Country");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(NationalityDetails, ddlNationality, "NationalityID", "DescA", "اختر الدوله");
                    }
                }
            }
        });
    }
    function fillddlVatType() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GenVatType", "GetAll"),
            data: {
                CompCode: compcode, VatType: 2, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    VatTypeDetails = result.Response;
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                        DocumentActions.FillCombowithdefult(VatTypeDetails, txt_tax, "CODE", "DESCRIPTION", "Select VatType");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(VatTypeDetails, txt_tax, "CODE", "DESCRIPTION", "اختر الضريبه");
                    }
                }
            }
        });
    }
    //---------------------------------------------------------- main functions region---------------------------------------------------------------
    function Assign() {
        MasterDetailModel = new VendorMasterDetail;
        Model = new A_Pay_D_Vendor();
        DetailsModel = new Array();
        MasterDetailModel.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
        MasterDetailModel.UserCode = SysSession.CurrentEnvironment.UserCode;
        // Header
        if (txt_NAME.value == "") {
            txt_NAME.value = txt_NAMEE.value;
        }
        if (txt_NAMEE.value == "") {
            txt_NAMEE.value = txt_NAME.value;
        }
        var IsCredit_Type;
        if ($('#txt_Cust_Type').val() == 0) {
            IsCredit_Type = false;
        }
        else {
            IsCredit_Type = true;
        }
        DocumentActions.AssignToModel(Model); //Insert Update
        if (chkActive.checked) {
            Model.Isactive = true;
        }
        else {
            Model.Isactive = false;
        }
        Model.CompCode = Number(compcode);
        Model.CatID = $('#txt_Category').val();
        Model.VATType = $('#txt_tax').val();
        Model.GroupId = $('#txt_Grop').val();
        Model.VendorCode = $('#txt_CustomerCODE').val();
        Model.VendorID = CustomerId;
        Model.NationalityID = $('#ddlNationality').val();
        Model.NationalityID = $('#ddlNationality').val();
        Model.VendorType = $('#txtVendorType_New').val();
        Model.RespPersonName = $('#txtResName').val();
        Model.RespPersonMobile = $('#txtResMobile').val();
        Model.IsCreditVendor = IsCredit_Type;
        Model.CURCODE = $('#ddlCurrency').val();
        Model.Address_postal = $('#txtPostalCode').val();
        Model.Address_City = $('#txtCity').val();
        Model.Address_District = $('#txtRegion').val();
        Model.Address_Street = $('#txtStreet1').val();
        Model.Address_Str_Additional = $('#txtStreet2').val();
        Model.Address_BuildingNo = $('#txtBuilding1').val();
        Model.Address_Build_Additional = $('#txtBuilding2').val();
        Model.Address_Province = $('#txtProvince').val();
        Model.PurchaserId = PurchaserId;
        Model.DebitLimit = Number(txt_CreditLimit.value) == null ? 0 : Number(txt_CreditLimit.value);
        Model.Credit = Number(txt_DebitFC.value) == null ? 0 : Number(txt_DebitFC.value);
        Model.Debit = Number(txt_Debit.value) == null ? 0 : Number(txt_Debit.value);
        Model.Openbalance = Number(txt_Openbalance.value) == null ? 0 : Number(txt_Openbalance.value);
        Model.VendorCode = $('#txt_CustomerCODE').val();
        Model.OpenbalanceAt = $('#txt_OpenbalanceAt').val();
        if (txt_Cust_Type.value == "1") {
            Model.BankAccountNo = $("#txt_ACCCode").val();
        }
        if (IsNew == true) {
            //var code: string = $('#txt_CustomerCODE').val();
            //if (code.length == 2) {
            //    code = '0' + code;
            //}
            //if (code.length == 1) {
            //    code = '00' + code;
            //}
            //var catID = $('#txt_Category').val();
            //var catObj = Details_Type_D_Category.filter(s => s.CatID == catID);
            //Model.VendorCode = catObj[0].AccountType + catObj[0].CatCode + code;
            Model.CREATED_AT = DateTimeFormat(Date().toString());
            Model.CREATED_BY = SysSession.CurrentEnvironment.UserCode;
        }
        else {
            Model.UPDATED_AT = DateTimeFormat(Date().toString());
            Model.UPDATED_BY = SysSession.CurrentEnvironment.UserCode;
        }
        // Detail
        var StatusFlag;
        for (var i = 0; i < CountGrid; i++) {
            SingleModel = new A_Pay_D_VendorDoc();
            StatusFlag = $("#txt_StatusFlag" + i).val();
            if (StatusFlag == "i") {
                SingleModel.VendorDocID = 0;
                SingleModel.VendorId = 0;
                SingleModel.StatusFlag = $("#txt_StatusFlag" + i).val();
                SingleModel.VndIDTypeCode = $("#ddlVendIDTypeCode" + i).val();
                SingleModel.IDNo = $("#txtIDNo" + i).val();
                SingleModel.IDIssuePlace = $("#txtIDIssuePlace" + i).val();
                SingleModel.IDIssueDate = $("#txtIDIssueDate" + i).val();
                SingleModel.IDIssueDateH = $("#txtIDIssueDateH" + i).val();
                SingleModel.IDExpireDate = $("#txtIDExpireDate" + i).val();
                SingleModel.IDExpireDateH = $("#txtIDExpireDateH" + i).val();
                DetailsModel.push(SingleModel);
            }
            if (StatusFlag == "u") {
                SingleModel.StatusFlag = $("#txt_StatusFlag" + i).val();
                SingleModel.VendorDocID = $("#txtVedDocID" + i).val();
                SingleModel.VendorId = $("#txtVendorID" + i).val();
                SingleModel.VndIDTypeCode = $("#ddlVendIDTypeCode" + i).val();
                SingleModel.IDNo = $("#txtIDNo" + i).val();
                SingleModel.IDIssuePlace = $("#txtIDIssuePlace" + i).val();
                SingleModel.IDIssueDate = $("#txtIDIssueDate" + i).val();
                SingleModel.IDIssueDateH = $("#txtIDIssueDateH" + i).val();
                SingleModel.IDExpireDate = $("#txtIDExpireDate" + i).val();
                SingleModel.IDExpireDateH = $("#txtIDExpireDateH" + i).val();
                DetailsModel.push(SingleModel);
            }
            if (StatusFlag == "d") {
                if ($("#txtVedDocID" + i).val() != "") {
                    var deletedID = $("#txtVedDocID" + i).val();
                    SingleModel.StatusFlag = StatusFlag.toString();
                    SingleModel.VendorDocID = deletedID;
                    DetailsModel.push(SingleModel);
                }
            }
        }
        MasterDetailModel.A_Pay_D_Vendor = Model;
        MasterDetailModel.A_Pay_D_VendorDoc = DetailsModel;
    }
    function Insert() {
        Assign();
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("AccDefVendor", "Insert"),
            data: JSON.stringify(MasterDetailModel),
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    var res = result.Response;
                    DisplayMassage("تم الحفظ بنجاح", "Success", MessageType.Succeed);
                    Valid = 0;
                    GlobalVendorID = res.VendorID;
                    InitializeGrid();
                    Display();
                    showAfterInsertOrUpdate = true;
                    DriverDoubleClick();
                }
                else {
                    DisplayMassage("خطأ", "Error", MessageType.Error);
                }
            }
        });
    }
    function Update() {
        Assign();
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("AccDefVendor", "Update"),
            data: JSON.stringify(MasterDetailModel),
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    DisplayMassage("تم التعديل بنجاح", "Success", MessageType.Succeed);
                    var res = result.Response;
                    Valid = 0;
                    GlobalVendorID = res.VendorID;
                    InitializeGrid();
                    Display();
                    showAfterInsertOrUpdate = true;
                    DriverDoubleClick();
                }
                else {
                    DisplayMassage("خطأ", "Error", MessageType.Error);
                }
            }
        });
    }
    //---------------------------------------------------------- Print region---------------------------------------------------------------
    function PrintReport(OutType) {
        //debugger+
        if (!SysSession.CurrentPrivileges.PrintOut)
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
        if (txt_ID_APP_Category.selectedIndex > 0)
            rp.CatId = Number($("#txt_ID_APP_Category").val());
        else
            rp.CatId = -1;
        if (txt_ID_APP_Group.selectedIndex > 0)
            rp.Groupid = Number($("#txt_ID_APP_Group").val());
        else
            rp.Groupid = -1;
        if (Number($("#txtVendorType").val()) == 1) { //--------مورد بضاعة
            rp.VendType = 1;
        }
        if (Number($("#txtVendorType").val()) == 2) { //--------مورد خدمات
            rp.VendType = 2;
        }
        if ($("#txtVendorType").val() == "null") { //--------الجميع
            rp.VendType = -1;
        }
        if ($("#txt_ID_APP_Type").val() == "Null") {
            rp.IsCredit = -1;
        }
        if (Number($("#txt_ID_APP_Type").val()) == 0) {
            rp.IsCredit = 2;
        }
        if (Number($("#txt_ID_APP_Type").val()) == 1) {
            rp.IsCredit = 1;
        }
        if ($("#txt_indebtedness").val() == "<") { //******عليه رصيد
            rp.BalStatus = 2;
        }
        if ($("#txt_indebtedness").val() == ">") { //******ليه رصيد
            rp.BalStatus = 1;
        }
        if ($("#txt_indebtedness").val() == "=") { //******رصيد صفري
            rp.BalStatus = 3;
        }
        if ($("#txt_indebtedness").val() == "All") { //******الجميع
            rp.BalStatus = 4;
        }
        Ajax.Callsync({
            url: Url.Action("IProc_Rep_AccVendorList", "GeneralReports"),
            data: rp,
            success: function (d) {
                var result = d.result;
                window.open(result, "_blank");
            }
        });
    }
    //---------------------------------------------------------- grid controls  region---------------------------------------------------------------
    function AddNewRow() {
        if (!SysSession.CurrentPrivileges.AddNew)
            return;
        var CanAdd = true;
        if (CountGrid > 0) {
            var LastRowNo = CountGrid - 1;
            CanAdd = Validation_Grid(LastRowNo);
        }
        if (CanAdd) {
            BuildControls(CountGrid);
            $("#txt_StatusFlag" + CountGrid).val("i"); //In Insert mode
            $("#ddlVendIDTypeCode" + CountGrid).removeAttr("disabled");
            $("#txtIDNo" + CountGrid).removeAttr("disabled");
            $("#txtIDIssuePlace" + CountGrid).removeAttr("disabled");
            $("#txtIDIssueDate" + CountGrid).removeAttr("disabled");
            $("#txtIDIssueDateH" + CountGrid).attr("disabled", "disabled");
            $("#txtIDExpireDate" + CountGrid).removeAttr("disabled");
            $("#txtIDExpireDateH" + CountGrid).attr("disabled", "disabled");
            $("#btnCust").removeAttr("disabled");
            var DateH = convertToH(GetDate());
            $("#txtIDIssueDate" + CountGrid).val(GetDate());
            $("#txtIDIssueDateH" + CountGrid).val(DateH);
            $("#txtIDExpireDate" + CountGrid).val(GetDate());
            $("#txtIDExpireDateH" + CountGrid).val(DateH);
            // can delete new inserted record  without need for delete privilage
            $("#btn_minus" + CountGrid).removeClass("display_none");
            $("#btn_minus" + CountGrid).removeAttr("disabled");
            CountGrid++;
        }
    }
    function BuildControls(cnt) {
        var html;
        //html = '<div id="row_font_header' + cnt + '" col-lg-12 col-md-12 col-sm-12 col-xl-12 col-xs-12 font_header" style="bottom: 5px;font-weight:bold">' +
        //    '<span id="btn_minus' + cnt + '" class="fa fa-minus-circle fontitm7Processes lebelminus"></span>' +
        //    '<div  ><input id="txtVendorID' + cnt + '" type="hidden" max="14" class="form-control"></div>' +
        //    '<div ><input id="txtVedDocID' + cnt + '" type="hidden" max="14" class="form-control"></div>' +
        //    '<div class="col-lg-2 col-md-2 col-sm-2 col-xl-2 col-xs-2" ><select id="ddlVendIDTypeCode' + cnt + '" class="form-control"> <option value="null"> ' + (lang == "ar" ? "اختار نوع البطاقه" : "Choose Card Type") + '</option> </select ></div>' +
        //    '<div class="col-lg-2 col-md-2 col-sm-2 col-xl-2 col-xs-2" ><input id="txtIDNo' + cnt + '" type="number" max="14" class="form-control"></div>' +
        //    '<div class="col-lg-2 col-md-2 col-sm-2 col-xl-2 col-xs-2" ><input id="txtIDIssuePlace' + cnt + '" type="text" class="form-control"></div>' +
        //    '<div class="col-lg-2 col-md-2 col-sm-2 col-xl-2 col-xs-2" ><input type="date" id="txtIDIssueDate' + cnt + '" class="form-control"></div>' +
        //    '<div class="col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-1" ><input type="text" id="txtIDIssueDateH' + cnt + '" class="form-control"></div>' +
        //    '<div class="col-lg-2 col-md-2 col-sm-2 col-xl-2 col-xs-2" ><input type="date" id="txtIDExpireDate' + cnt + '" class="form-control"></div>' +
        //    '<div class="col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-1"><input type="text" id="txtIDExpireDateH' + cnt + '" class="form-control"></div>' +
        //    '<div class="col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-1" style=""><input id="txt_StatusFlag' + cnt + '" name = " " type = "hidden" class="form-control"/><input id="CustomerDocID' + cnt + '" name = " " type = "hidden" class="form-control" /></div></div>';
        html = "<tr id= \"row_font_header" + cnt + "\">\n\t                <input id=\"txtvendorid" + cnt + "\" type=\"hidden\" max=\"14\" class=\"form-control\">\n                    <input id=\"txtveddocid" + cnt + "\" type=\"hidden\" max=\"14\" class=\"form-control\">\n                    <td>\n\t\t                <div class=\"form-group\">\n\t\t\t                <span id=\"btn_minus" + cnt + "\"><i class=\"fas fa-minus-circle fs-4 btn-minus\"></i></span>\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n\t                        <select id=\"ddlvendidtypecode" + cnt + "\" class=\"form-control\"> \n\t\t                        <option value=\"null\"> " + (lang == "ar" ? "اختار نوع البطاقه" : "choose card type") + " </option> \n\t\t                    </select >\t\t              \n                        </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n\t                    \t<input id=\"txtidno" + cnt + "\" type=\"number\" max=\"14\" class=\"form-control\">\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n\t\t                    <input id=\"txtidissueplace" + cnt + "\" type=\"text\" class=\"form-control\">\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n                    \t\t<input type=\"date\" id=\"txtidissuedate" + cnt + "\" class=\"form-control\">\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n\t                    \t<input type=\"text\" id=\"txtidissuedateh" + cnt + "\" class=\"form-control\">\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n\t\t                   <input type=\"date\" id=\"txtidexpiredate" + cnt + "\" class=\"form-control\">\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n\t                    \t<input type=\"text\" id=\"txtidexpiredateh" + cnt + "\" class=\"form-control\">\n\t\t                </div>\n\t                </td>\n             <input id=\"txt_statusflag" + cnt + "\" name = \" \" type = \"hidden\" class=\"form-control\"/>\n\t\t    <input id=\"customerdocid" + cnt + "\" name = \" \" type = \"hidden\" class=\"form-control\" />\n                </tr>";
        $("#div_Data").append(html);
        //fill dropdownlist
        for (var i = 0; i < CodesTypes.length; i++) {
            $('#ddlVendIDTypeCode' + cnt).append('<option value="' + CodesTypes[i].CodeValue + '">' + (lang == "ar" ? CodesTypes[i].DescA : CodesTypes[i].DescE) + '</option>');
        }
        $("#ddlVendIDTypeCode" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        $("#txtIDNo" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        $("#txtIDIssuePlace" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        $("#txtIDIssueDate" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
            var Date = $("#txtIDIssueDate" + cnt).val();
            var DateH = convertToH(Date);
            $("#txtIDIssueDateH" + cnt).val(DateH);
        });
        $("#txtIDExpireDate" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
            var Date = $("#txtIDExpireDate" + cnt).val();
            var DateH = convertToH(Date);
            $("#txtIDExpireDateH" + cnt).val(DateH);
        });
        $("#btn_minus" + cnt).on('click', function () {
            DeleteRow(cnt);
        });
        if (SysSession.CurrentPrivileges.Remove) {
            $("#btn_minus" + cnt).removeClass("display_none");
            $("#btn_minus" + cnt).removeAttr("disabled");
        }
        else {
            $("#btn_minus" + cnt).addClass("display_none");
            $("#btn_minus" + cnt).attr("disabled", "disabled");
        }
        if (ShowFlag == true) {
            // disabled
            $("#ddlVendIDTypeCode" + cnt).attr("disabled", "disabled");
            $("#txtIDNo" + cnt).attr("disabled", "disabled");
            $("#txtIDIssuePlace" + cnt).attr("disabled", "disabled");
            $("#txtIDIssueDate" + cnt).attr("disabled", "disabled");
            $("#txtIDIssueDateH" + cnt).attr("disabled", "disabled");
            $("#txtIDExpireDate" + cnt).attr("disabled", "disabled");
            $("#txtIDExpireDateH" + cnt).attr("disabled", "disabled");
            $("#btn_minus" + cnt).addClass("display_none");
            $("#btn_minus" + cnt).attr("disabled", "disabled");
            //bind Data
            $("#txt_StatusFlag" + cnt).val("");
            $("#txtVendorID" + cnt).prop("value", FilteredModel[cnt].VendorId);
            $("#txtVedDocID" + cnt).prop("value", FilteredModel[cnt].VendorDocID);
            $("#ddlVendIDTypeCode" + cnt).prop("value", FilteredModel[cnt].VndIDTypeCode);
            $("#txtIDNo" + cnt).prop("value", FilteredModel[cnt].IDNo);
            $("#txtIDIssuePlace" + cnt).prop("value", FilteredModel[cnt].IDIssuePlace);
            $("#txtIDIssueDate" + cnt).prop("value", DateFormat(FilteredModel[cnt].IDIssueDate));
            $("#txtIDIssueDateH" + cnt).prop("value", FilteredModel[cnt].IDIssueDateH);
            $("#txtIDExpireDate" + cnt).prop("value", DateFormat(FilteredModel[cnt].IDExpireDate));
            $("#txtIDExpireDateH" + cnt).prop("value", FilteredModel[cnt].IDExpireDateH);
        }
        return;
    }
    function DeleteRow(RecNo) {
        if (!SysSession.CurrentPrivileges.Remove)
            return;
        WorningMessage("هل تريد الحذف؟", "Do you want to delete?", "تحذير", "worning", function () {
            $("#txt_StatusFlag" + RecNo).val() == 'i' ? $("#txt_StatusFlag" + RecNo).val('m') : $("#txt_StatusFlag" + RecNo).val('d');
            $("#ddlVendIDTypeCode" + RecNo).val("22f");
            $("#txtIDNo" + RecNo).val("1");
            $("#txtIDIssuePlace" + RecNo).val("1");
            $("#row_font_header" + RecNo).attr("hidden", "true");
        });
    }
    //---------------------------------------------------------- get functions region---------------------------------------------------------------
    function GetCardTypes() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GCodes", "GetAll"),
            data: { codeType: 'VNDIDType', UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess == true) {
                    CodesTypes = result.Response;
                }
            }
        });
    }
    function GetAllCurrency() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefVendor", "GetAllCurrency"),
            data: { UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess == true) {
                    CurrencyDetails = result.Response;
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                        DocumentActions.FillCombowithdefult(CurrencyDetails, ddlCurrency, "CurrencyID", "DescL", "Select currency");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(CurrencyDetails, ddlCurrency, "CurrencyID", "DescA", "اختر العمله");
                    }
                }
            }
        });
    }
})(AccDefVendor || (AccDefVendor = {}));
//# sourceMappingURL=AccDefVendor.js.map