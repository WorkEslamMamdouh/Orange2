$(document).ready(function () {
    AccTrCustomerAdjust.InitalizeComponent();
});
var AccTrCustomerAdjust;
(function (AccTrCustomerAdjust) {
    var IQ_TrType = 1;
    var AccType = 2;
    var TrType = 1;
    var vendorId = 0;
    var isCustomer = true;
    var IsDebit = 2;
    var Status = 2;
    var IsdebitNew = true;
    var codeType = "RecType";
    var Details = new Array();
    var BilldIData = new Array();
    var ReportGrid = new JsGrid();
    var Details_Type_D_CashBox = new Array();
    var Details_AjustmentType = new Array();
    var Details_AjustmentTypeNew = new Array();
    var Model = new A_RecPay_Tr_Adjustment();
    var CashDetailsAr = new Array();
    var CashDetailsEn = new Array();
    var Details_Customer = new Array();
    var VatTypeDetails = new Array();
    var Details_Vendor = new Array();
    var Details_ACCOUNT = new Array();
    var Details_Pay_D_Accounts = new Array();
    var sys = new SystemTools();
    var SysSession = GetSystemSession(Modules.AccTrCustomerAdjust);
    //txt_ID_CustmNew
    var txt_ID_Custm;
    var txt_Movement_typeNew;
    var txt_Settlement_type;
    // var txt_ID_CustmNew: HTMLSelectElement;
    var txt_Settlement_typeNew;
    var txtDateNew;
    var txtDateFrom;
    var txtDateTo;
    var txt_Movement_type;
    var txt_Type_of_tax;
    var txt_Status;
    var txt_CODE;
    var txt_note;
    var searchbutmemreport;
    var txt_VoucherNo;
    var txt_Amount;
    var txt_The_tax_amount;
    var txt_Total_after_tax;
    var txt_ReceiptDesc;
    var btnBack;
    var btnShow;
    var btnAdd;
    var btnEdit;
    var btnSave;
    var chkActive;
    //---------------------------------------------------------------print buttons 
    var btnPrintTrview;
    var btnPrintTrPDF;
    var btnPrintTrEXEL;
    var btnPrintTransaction;
    var btnPrint;
    //---------------------------------------------------------------
    var compcode; //SharedSession.CurrentEnvironment.CompCode;
    var BranchCode; //SharedSession.CurrentEnvironment.CompCode;
    var IsNew;
    var index;
    var Selecteditem;
    var AdjustmentIDUpdate = 0;
    var AdjustmentID;
    var Valid = 0;
    var SearchDetails;
    var Update_claenData = 0;
    var Type_ReceiptNote = true;
    var Type_Receipt;
    var Type_Receipt_New;
    var DateFrom;
    var DateTo;
    var custId;
    var vndid = 0;
    var BankCode = 0;
    var expid = 0;
    var fromBoxid = 0;
    var Boxid;
    var RecPayTypeId;
    var AdustmentTypeID;
    var GLOBALopenbalance;
    var EDIT = SysSession.CurrentPrivileges.EDIT;
    var AddNew = SysSession.CurrentPrivileges.AddNew;
    var CUSTOM1 = SysSession.CurrentPrivileges.CUSTOM1;
    var CUSTOM2 = SysSession.CurrentPrivileges.CUSTOM2;
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);
    var AccountDetails = new Array();
    var btnCust;
    var txt_CustCode;
    var txt_CustName;
    var btnCustH;
    var txt_CustCodeH;
    var txt_CustNameH;
    var PurchaserId;
    var custIdfilter;
    var VendorDetails = new Array();
    //var Mode: number;
    function InitalizeComponent() {
        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = " تسوية عميل";
        }
        else {
            document.getElementById('Screen_name').innerHTML = "Customer Adjustment Note";
        }
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);
        InitalizeControls();
        InitalizeEvents();
        reference_Page();
        DisplayAccDefCustomer();
        filldType_of_tax();
        txt_Status.value = "2";
        txtDateFrom.value = DateStartMonth();
        txtDateTo.value = ConvertToDateDash(GetDate()) <= ConvertToDateDash(SysSession.CurrentEnvironment.EndDate) ? GetDate() : SysSession.CurrentEnvironment.EndDate;
    }
    AccTrCustomerAdjust.InitalizeComponent = InitalizeComponent;
    function chkStatus_onchange() {
        if (IsNew != true) {
            //if (Selecteditem[0].IsPosted != true) {
            if (Selecteditem[0].Status == 1 && chkActive.checked == false) {
                Open();
            }
            //}
            //else {
            //    chkActive.checked = true;
            //    DisplayMassage(" تم ترحيل الحسبات لا يمكنك فك الاعتماد ", "You can't de-IsPosted", MessageType.Worning);
            //}
        }
    }
    function Open() {
        Assign();
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("AccTrAdjust", "Open"),
            data: JSON.stringify(Model),
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    DisplayMassage("تم الحفظ بنجاح", "Saved successfully", MessageType.Succeed);
                    Update_claenData = 1;
                    Display();
                    //btnback_onclick();
                    Selecteditem = Details.filter(function (x) { return x.AdjustmentID == Number(ReportGrid.SelectedKey); });
                    AdjustmentID = Selecteditem[0].AdjustmentID;
                    if (Selecteditem[0].Status == 1) {
                        chkActive.checked = true;
                        btnEdit.disabled = true;
                        chkActive.disabled = false;
                        chkActive.disabled = !SysSession.CurrentPrivileges.CUSTOM2;
                    }
                    else {
                        chkActive.checked = false;
                        chkActive.disabled = true;
                        btnEdit.disabled = !SysSession.CurrentPrivileges.EDIT;
                    }
                }
                else {
                    DisplayMassage("خطأء", "Error", MessageType.Error);
                    Update_claenData = 0;
                }
            }
        });
    }
    function Displaymode() {
        //$('#btnSave').attr('class', 'btn btn-success display_none');
        //$('#btnBack').attr('class', 'btn btn-success display_none');
        //$('#btnUpdate').attr('class', 'btn btn-primary');
        //$('#btnAdd').attr('class', 'btn btn-primary');
        ////$("#divnotifications :input").prop("disabled", false);
        //btnAdd.disabled = !SysSession.CurrentPrivileges.AddNew
        removedisabled();
    }
    function reference_Page() {
        if (!EDIT) {
            $('#btnUpdate').attr('class', 'btn btn-primary display_none');
            $('#btnPrintTransaction').attr('class', 'btn btn-primary display_none');
            $('#btnSave').attr('class', 'btn btn-success display_none');
            $('#btnBack').attr('class', 'btn btn-success display_none');
        }
        //if (!AddNew) { $('#btnAdd').attr('class', 'btn btn-primary display_none'); }
        //if (CUSTOM1) { $("#chkStatus").removeAttr("disabled"); }
        //if (!CUSTOM1) { $("#chkStatus").attr("disabled", "disabled"); }
    }
    function InitalizeControls() {
        ////;
        btnShow = document.getElementById("btnShow");
        btnAdd = document.getElementById("btnAdd");
        btnEdit = document.getElementById("btnUpdate");
        btnSave = document.getElementById("btnSave");
        btnBack = document.getElementById("btnBack");
        //textBoxes
        txt_CODE = document.getElementById("txt_CODE");
        txt_ID_Custm = document.getElementById("txt_ID_Custm");
        //txt_ID_CustmNew = document.getElementById("txt_ID_CustmNew") as HTMLSelectElement;
        txt_Movement_typeNew = document.getElementById("txt_Movement_typeNew");
        txt_Settlement_type = document.getElementById("txt_Settlement_type");
        txt_Settlement_typeNew = document.getElementById("txt_Settlement_typeNew");
        txt_Movement_type = document.getElementById("txt_Movement_type");
        txt_Status = document.getElementById("txt_Status");
        txt_VoucherNo = document.getElementById("txt_VoucherNo");
        txt_Amount = document.getElementById("txt_Amount");
        txt_The_tax_amount = document.getElementById("txt_The_tax_amount");
        txt_Total_after_tax = document.getElementById("txt_Total_after_tax");
        txt_ReceiptDesc = document.getElementById("txt_ReceiptDesc");
        txt_Type_of_tax = document.getElementById("txt_Type_of_tax");
        txtDateNew = document.getElementById("txtDateNew");
        txtDateFrom = document.getElementById("txtDateFrom");
        txtDateTo = document.getElementById("txtDateTo");
        txt_note = document.getElementById("txt_note");
        //print 
        btnPrintTrview = document.getElementById("btnPrintTrview");
        btnPrintTrPDF = document.getElementById("btnPrintTrPDF");
        btnPrintTrEXEL = document.getElementById("btnPrintTrEXEL");
        btnPrintTransaction = document.getElementById("btnPrintTransaction");
        btnPrint = document.getElementById("btnPrint");
        chkActive = document.getElementById("chkStatus");
        searchbutmemreport = document.getElementById("searchbutmemreport");
        btnCust = document.getElementById("btnCust");
        txt_CustCode = document.getElementById("txt_CustCode");
        txt_CustName = document.getElementById("txt_CustName");
        btnCustH = document.getElementById("btnCustH");
        txt_CustCodeH = document.getElementById("txt_CustCodeH");
        txt_CustNameH = document.getElementById("txt_CustNameH");
    }
    function InitalizeEvents() {
        //
        btnShow.onclick = btnShow_onclick;
        btnAdd.onclick = btnAdd_onclick;
        btnSave.onclick = btnsave_onClick;
        btnBack.onclick = btnback_onclick;
        btnEdit.onclick = btnEdit_onclick;
        searchbutmemreport.onkeyup = _SearchBox_Change;
        chkActive.onchange = chkStatus_onchange;
        txt_Amount.onkeyup = txt_Amount_onchange;
        txt_Type_of_tax.onchange = txt_Amount_onchange;
        txt_Movement_type.onchange = txt_Movement_type_onchange;
        txt_Movement_typeNew.onchange = txt_Movement_typeNew_onchange;
        txtDateFrom.value = GetDate();
        txtDateTo.value = GetDate();
        btnPrintTrview.onclick = function () { PrintReport(1); };
        btnPrintTrPDF.onclick = function () { PrintReport(2); };
        btnPrintTrEXEL.onclick = function () { PrintReport(3); };
        btnPrint.onclick = function () { PrintReport(4); };
        btnPrintTransaction.onclick = PrintTransaction;
        btnCust.onclick = btnCust_OnClick;
        btnCustH.onclick = btnCustH_OnClick;
        txt_CustCode.onchange = txt_CustCode_onchange;
        txt_CustCodeH.onchange = txt_CustCodeH_onchange;
    }
    function txt_Movement_type_onchange() {
        $('#txt_Settlement_type').html('');
        $('#txt_Settlement_type').append('<option value="Null"> ' + (lang == "ar" ? "نوع التسوية" : "Settlement type") + '</option>');
        if (txt_Movement_type.value != "Null") {
            IsdebitNew = txt_Movement_type.value == "true" ? true : false;
            Display_Settlement_type();
        }
    }
    function txt_Movement_typeNew_onchange() {
        debugger;
        if (txt_Movement_typeNew.value != "Null") {
            IsdebitNew = txt_Movement_typeNew.value == "true" ? true : false;
            Display_Settlement_typeNew();
        }
        $('#txt_Settlement_typeNew').append('<option value="Null">' + (lang == "ar" ? "اختر" : "Choose") + '</option>');
    }
    function txt_Amount_onchange() {
        //if (txt_Type_of_tax.value == "Null") { txt_Type_of_tax.value = "0"; }
        //if (txt_Amount.value == null) { txt_Amount.value = "0"; }
        txt_The_tax_amount.value = ((Number(txt_Amount.value) * Number($('option:selected', $("#txt_Type_of_tax")).attr('Date_VatPerc'))) / 100).toString();
        txt_Total_after_tax.value = (Number(txt_The_tax_amount.value) + Number(txt_Amount.value)).toString();
    }
    function btnEdit_onclick() {
        if (!SysSession.CurrentPrivileges.EDIT)
            return;
        IsNew = false;
        removedisabled();
        if (SysSession.CurrentPrivileges.EDIT) {
            $('#btnSave').removeClass("display_none");
            $('#btnBack').removeClass("display_none");
            $("#div_ContentData :input").removeAttr("disabled");
            $("#btnUpdate").addClass("display_none");
            $("#btnPrintTransaction").addClass("display_none");
            $("#txt_CODE").attr("disabled", "disabled");
            $("#txt_VoucherNo").attr("disabled", "disabled");
            $("#id_div_Add").addClass("disabledDiv");
            $("#id_ReportGrid").addClass("disabledDiv");
        }
    }
    function btnAdd_onclick() {
        IsNew = true;
        EnableControls();
        removedisabled();
        //txt_Settlement_typeNew.setAttribute("disabled", "disabled");
        $("#id_div_Add").attr("disabled", "disabled").off('click');
        $("#id_ReportGrid").attr("disabled", "disabled").off('click');
        $("#id_div_Add").addClass("disabledDiv");
        $("#id_ReportGrid").addClass("disabledDiv");
        reference_Page();
        chkActive.checked = false;
        $('#txt_CustCode').val("");
        $('#txt_CustName').val("");
        $('#txt_Openbalance').val("");
        $('#Div_control').removeClass("display_none");
    }
    function btnsave_onClick() {
        loading('btnSave');
        setTimeout(function () {
            finishSave('btnSave');
            if (IsNew == true) {
                Validation();
                if (Valid == 1) {
                }
                else {
                    Insert();
                }
            }
            else {
                Validation();
                if (Valid == 1) {
                }
                else {
                    Update();
                }
            }
        }, 100);
    }
    function btnShow_onclick() {
        Display();
    }
    function btnback_onclick() {
        $('#btnAddDetails').addClass("display_none");
        $('#btnSave').addClass("display_none");
        $('#btnBack').addClass("display_none");
        $(".fa-minus-circle").addClass("display_none");
        $("#btnUpdate").removeClass("display_none");
        $("#btnPrintTransaction").removeClass("display_none");
        $("#btnUpdate").removeAttr("disabled");
        $("#btnPrintTransaction").removeAttr("disabled");
        $("#drp_G_Store").removeAttr("disabled");
        txt_disabled();
        $("#id_div_Add").attr("disabled", "");
        $("#id_div_Add").removeClass("disabledDiv");
        $("#id_ReportGrid").attr("disabled", "");
        $("#id_ReportGrid").removeClass("disabledDiv");
        EDIT = SysSession.CurrentPrivileges.EDIT;
        AddNew = SysSession.CurrentPrivileges.AddNew;
        CUSTOM1 = SysSession.CurrentPrivileges.CUSTOM1;
        CUSTOM2 = SysSession.CurrentPrivileges.CUSTOM2;
        if (IsNew == true) {
            $('#Div_control').addClass("display_none");
        }
        else {
            DriverDoubleClick();
            $('#Div_control').removeClass("display_none");
        }
    }
    function back_Details() {
        Selecteditem = Details.filter(function (x) { return x.AdjustmentID == Number(ReportGrid.SelectedKey); });
        AdjustmentID = Selecteditem[0].AdjustmentID;
        if (Selecteditem[0].Status == 1) {
            chkActive.checked = true;
            btnEdit.disabled = true;
            chkActive.disabled = false;
            chkActive.disabled = !SysSession.CurrentPrivileges.CUSTOM2;
        }
        else {
            chkActive.checked = false;
            chkActive.disabled = true;
            btnEdit.disabled = !SysSession.CurrentPrivileges.EDIT;
        }
        DriverDoubleClick();
        reference_Page();
    }
    function txt_disabled() {
        txt_CODE.setAttribute("disabled", "disabled");
        txt_Movement_typeNew.setAttribute("disabled", "disabled");
        txtDateNew.setAttribute("disabled", "disabled");
        $("#chkStatus").attr("disabled", "disabled");
        txt_Settlement_typeNew.setAttribute("disabled", "disabled");
        txt_note.setAttribute("disabled", "disabled");
        txt_VoucherNo.setAttribute("disabled", "disabled");
        txt_Amount.setAttribute("disabled", "disabled");
        txt_ReceiptDesc.setAttribute("disabled", "disabled");
        txt_Amount.setAttribute("disabled", "disabled");
        //txt_Total_after_tax.setAttribute("disabled", "disabled");
        txt_Type_of_tax.setAttribute("disabled", "disabled");
        //txt_ID_CustmNew.setAttribute("disabled", "disabled");
        txt_CustCode.setAttribute("disabled", "disabled");
        btnCust.setAttribute("disabled", "disabled");
    }
    function removedisabled() {
        //;
        //txt_CODE.removeAttribute("disabled");
        txt_Movement_typeNew.removeAttribute("disabled");
        //txtDateNew.removeAttribute("disabled");
        $("#chkStatus").removeAttr("disabled");
        $("#txtDateNew").removeAttr("disabled");
        txt_Settlement_typeNew.removeAttribute("disabled");
        txt_note.removeAttribute("disabled");
        //txt_VoucherNo.removeAttribute("disabled");
        txt_Amount.removeAttribute("disabled");
        txt_ReceiptDesc.removeAttribute("disabled");
        //txt_Amount.removeAttribute("disabled");
        //txt_Total_after_tax.removeAttribute("disabled");
        txt_Type_of_tax.removeAttribute("disabled");
        //txt_ID_CustmNew.removeAttribute("disabled");
        $("#btnCust").removeAttr("disabled");
        $("#txt_CustCode").removeAttr("disabled");
    }
    function GetDate() {
        var today = new Date;
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
    function Validation() {
        //if (IsNew == true) {
        //    if (TrNoFounBefore() == false) {
        //        DisplayMassage("الرقم موجود من قبل ", "Contact Email Is Not Valid", MessageType.Worning);
        //        return Valid = 1;
        //    }
        //}
        //if (txt_CODE.value == "") {
        //    DisplayMassage("يجب ادخال الرقم ", "Contact Email Is Not Valid", MessageType.Worning);
        //    return Valid = 1;
        //}
        if (txtDateNew.value == "") {
            DisplayMassage("يجب اختيار التاريخ ", "The date must be chosen", MessageType.Worning);
            Errorinput(txtDateNew);
            return Valid = 1;
        }
        if (txt_Movement_typeNew.selectedIndex == 0) {
            DisplayMassage("يجب اختيار نوع الحركه ", "You must choose the type of movement", MessageType.Worning);
            Errorinput(txt_Movement_typeNew);
            return Valid = 1;
        }
        if (txt_Settlement_typeNew.value == 'Null') {
            DisplayMassage("يجب اختيار نوع التسويه ", "The type of settlement must be chosen", MessageType.Worning);
            Errorinput(txt_Settlement_typeNew);
            return Valid = 1;
        } // if (txt_ID_CustmNew.selectedIndex == 0) {
        //    DisplayMassage("يجب اختيار العميل ", "The customer must be chosen", MessageType.Worning);
        //    Errorinput(txt_ID_CustmNew);
        //    return Valid = 1;
        //} 
        if (txt_CustCode.value == "") {
            DisplayMassage("يجب اختيار العميل ", "The customer must be chosen", MessageType.Worning);
            Errorinput(txt_CustCode);
            return Valid = 1;
        }
        if (txt_Type_of_tax.selectedIndex == 0) {
            DisplayMassage("يجب اختيار نوع الضريبة  ", "The tax type must be selected", MessageType.Worning);
            Errorinput(txt_Type_of_tax);
            return Valid = 1;
        }
        if (txt_Amount.value.trim() == "" || txt_Amount.value == "0") {
            DisplayMassage("يجب ادخال المبلغ ", "The amount must be entered", MessageType.Worning);
            Errorinput(txt_Amount);
            return Valid = 1;
        }
        return Valid = 0;
    }
    function DriverDoubleClick() {
        Update_claenData = 1;
        Selecteditem = Details.filter(function (x) { return x.AdjustmentID == Number(ReportGrid.SelectedKey); });
        txt_Movement_typeNew.value = Selecteditem[0].IsDebit;
        txt_Movement_typeNew_onchange();
        DisplayData(Selecteditem);
        AdjustmentID = Selecteditem[0].AdjustmentID;
        compcode = Selecteditem[0].CompCode;
        BranchCode = Selecteditem[0].BranchCode;
        IsNew = false;
        Update_claenData = 0;
        reference_Page();
        $('#Div_control').removeClass("display_none");
        $('#btnUpdate').removeClass("display_none");
        $('#btnPrintTransaction').removeClass("display_none");
        $('#btnSave').addClass("display_none");
        $('#btnBack').addClass("display_none");
        $('#btnUpdate').removeAttr("disabled");
        $('#btnPrintTransaction').removeAttr("disabled");
        if (Selecteditem[0].Status == 1) {
            chkActive.checked = true;
            btnEdit.disabled = true;
            chkActive.disabled = false;
            chkActive.disabled = !SysSession.CurrentPrivileges.CUSTOM2;
        }
        else {
            chkActive.checked = false;
            chkActive.disabled = true;
            btnEdit.disabled = !SysSession.CurrentPrivileges.EDIT;
        }
        $('#Div_control').removeClass("display_none");
    }
    function DisplayData(Selecteditem) {
        DocumentActions.RenderFromModel(Selecteditem[0]);
        var custid = Selecteditem[0].CustomerId.toString();
        getAccountById(custid, false);
        $('#txt_Movement_typeNew').prop("value", Selecteditem[0].IsDebit);
        $('#txt_Settlement_typeNew').prop("value", Selecteditem[0].AdustmentTypeID);
        //$('#txt_ID_CustmNew').prop("value", Selecteditem[0].CustomerId);
        $('#btnCust').prop("value", Selecteditem[0].CustomerId);
        $('#txt_Type_of_tax').prop("value", Selecteditem[0].VatType);
        //var openbalance = Number($('option:selected', txt_ID_CustmNew).attr('data-openbalance'));
        //if (txt_ID_CustmNew.value == "Null") { $('#txt_Openbalance').val(""); } else { $('#txt_Openbalance').val(openbalance); }
        if (btnCust.value == "Null") {
            $('#txt_Openbalance').val("");
        }
        else {
            $('#txt_Openbalance').val(GLOBALopenbalance);
        }
        var trDate = DateFormat(Selecteditem[0].TrDate);
        txtDateNew.value = trDate;
        Type_ReceiptNote = false;
    }
    function btnCust_OnClick() {
        sys.FindKey(Modules.AccTrCustomerAdjust, "btncustSearch", "CompCode= " + compcode + "", function () {
            var id = SearchGrid.SearchDataGrid.SelectedKey;
            getAccountById(id, false);
        });
    }
    function getAccountById(custId, code) {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefCustomer", "GetCustomerByCustomerId_code"),
            data: { Compcode: compcode, BranchCode: BranchCode, code: code, CustomerId: custId, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    AccountDetails = result.Response;
                    if (AccountDetails.length == 0) {
                        $('#txt_CustCode').val("");
                        $('#txt_CustName').val("");
                        $('#txt_Openbalance').val("");
                        Errorinput(txt_CustCode);
                        DisplayMassage("كود العميل غير صحيح", "Wrong Customer code", MessageType.Error);
                    }
                    else {
                        $('#txt_CustCode').val(AccountDetails[0].CustomerCODE);
                        $('#txt_CustName').val(AccountDetails[0].NAMEA);
                        $('#txt_Openbalance').val(AccountDetails[0].Openbalance);
                        GLOBALopenbalance = AccountDetails[0].Openbalance;
                        PurchaserId = AccountDetails[0].CustomerId;
                    }
                }
            }
        });
    }
    function txt_CustCode_onchange() {
        getAccountById(txt_CustCode.value, true);
    }
    function btnCustH_OnClick() {
        sys.FindKey(Modules.AccTrCustomerAdjust, "btncustSearch", "CompCode= " + compcode + "", function () {
            var id = SearchGrid.SearchDataGrid.SelectedKey;
            getAccountHById(id, false);
        });
    }
    function getAccountHById(custId, code) {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefCustomer", "GetCustomerByCustomerId_code"),
            data: { Compcode: compcode, BranchCode: BranchCode, code: code, CustomerId: custId, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    AccountDetails = result.Response;
                    if (AccountDetails.length == 0) {
                        $('#txt_CustCodeH').val("");
                        $('#txt_CustNameH').val("");
                        Errorinput(txt_CustCodeH);
                        DisplayMassage("كود العميل غير صحيح", "Wrong Customer code", MessageType.Error);
                    }
                    else {
                        $('#txt_CustCodeH').val(AccountDetails[0].CustomerCODE);
                        $('#txt_CustNameH').val(AccountDetails[0].NAMEA);
                        GLOBALopenbalance = AccountDetails[0].Openbalance;
                        custIdfilter = custId;
                    }
                }
            }
        });
    }
    function txt_CustCodeH_onchange() {
        getAccountHById(txt_CustCodeH.value, true);
    }
    function Display_Settlement_type() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GenDefAdjustment", "GetAll"),
            data: {
                CompCode: compcode, isCustomer: isCustomer, Isdebit: IsdebitNew, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    Details_AjustmentType = result.Response;
                    $('#txt_Settlement_type').append('<option value="Null">' + (lang == "ar" ? "اختر" : "Choose") + '</option>');
                    for (var i = 0; i < Details_AjustmentType.length; i++) {
                        $('#txt_Settlement_type').append('<option value="' + Details_AjustmentType[i].AdustmentTypeID + '">' + (lang == "ar" ? Details_AjustmentType[i].Adj_DescA : Details_AjustmentType[i].Adj_DescE) + '</option>');
                    }
                }
            }
        });
    }
    function Display_Settlement_typeNew() {
        $('#txt_Settlement_typeNew').html('');
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GenDefAdjustment", "GetAll"),
            data: {
                CompCode: compcode, isCustomer: isCustomer, Isdebit: IsdebitNew, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    Details_AjustmentTypeNew = result.Response;
                    debugger;
                    for (var i = 0; i < Details_AjustmentTypeNew.length; i++) {
                        $('#txt_Settlement_typeNew').append('<option value="' + Details_AjustmentTypeNew[i].AdustmentTypeID + '">' + (lang == "ar" ? Details_AjustmentTypeNew[i].Adj_DescA : Details_AjustmentTypeNew[i].Adj_DescE) + '</option>');
                    }
                }
            }
        });
    }
    function DisplayAccDefCustomer() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefCustomer", "GetAllWithCreditType"),
            data: {
                CompCode: compcode, BranchCode: BranchCode, isCredit: true, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                //;
                var result = d;
                if (result.IsSuccess) {
                    Details_Customer = result.Response;
                    for (var i = 0; i < Details_Customer.length; i++) {
                        $('#txt_ID_Custm').append('<option value="' + Details_Customer[i].CustomerId + '">' + Details_Customer[i].NAMEA + '</option>');
                        var balance = Number((Details_Customer[i].Openbalance + Details_Customer[i].Debit - Details_Customer[i].Credit).RoundToSt(2));
                        $('#txt_ID_CustmNew').append('<option data-Openbalance="' + balance + '" value="' + Details_Customer[i].CustomerId + '">' + (lang == "ar" ? Details_Customer[i].NAMEA : Details_Customer[i].NAMEE) + '</option>');
                    }
                }
            }
        });
    }
    function filldType_of_tax() {
        //
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GenVatType", "GetAll"),
            data: {
                CompCode: compcode, VatType: 1, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    VatTypeDetails = result.Response;
                    for (var i = 0; i < VatTypeDetails.length; i++) {
                        $('#txt_Type_of_tax').append('<option  Date_VatPerc="' + VatTypeDetails[i].VatPerc + '" value="' + VatTypeDetails[i].CODE + '">' + VatTypeDetails[i].DESCRIPTION + '</option>');
                    }
                }
            }
        });
    }
    function EnableControls() {
        if (!SysSession.CurrentPrivileges.AddNew)
            return;
        $('#btnSave').removeClass("display_none");
        $('#btnBack').removeClass("display_none");
        $('#btnUpdate').addClass("display_none");
        $('#btnPrintTransaction').addClass("display_none");
        txt_Movement_typeNew.selectedIndex = 0;
        txt_Settlement_typeNew.selectedIndex = 0;
        txt_Type_of_tax.selectedIndex = 0;
        txt_CODE.value = "";
        txtDateNew.value = GetDate();
        txt_note.value = "";
        txt_VoucherNo.value = "";
        txt_Amount.value = "";
        txt_The_tax_amount.value = "";
        txt_ReceiptDesc.value = "";
        txt_Total_after_tax.value = "";
        $('#txt_Openbalance').val('0');
    }
    function Assign_Display() {
        //if (IsDebit != "Null") {
        DateFrom = DateFormatRep(txtDateFrom.value);
        DateTo = DateFormatRep(txtDateTo.value);
        AdustmentTypeID = $("#txt_Settlement_type").val();
        Status = Number(txt_Status.value);
        vendorId = vendorId;
        if ($("#txt_Movement_type").val() == "Null") {
            IsDebit = 2;
            AdustmentTypeID = 0;
        }
        else if ($("#txt_Movement_type").val() == "true") {
            IsDebit = 1;
        }
        else {
            IsDebit = 0;
        }
        if (AdustmentTypeID == "Null") {
            AdustmentTypeID = 0;
        }
        if ($('#txt_CustCodeH').val() == "") {
            custId = 0;
        }
        else {
            custId = custIdfilter;
        }
        return Valid = 1;
        //}
        //else {
        //    DisplayMassage('يجب اختيار نوع الحركة', 'يجب اختيار نوع الحرك', MessageType.Worning)
        //    return Valid = 0;
        //}
    }
    function Display() {
        Assign_Display();
        if (Valid == 1) {
            Ajax.Callsync({
                type: "Get",
                url: sys.apiUrl("AccTrAdjust", "GetAccTrAdjustList"),
                data: {
                    comp: compcode, BranchCode: BranchCode, IsDebit: IsDebit, isCustomer: isCustomer, Status: Status, FromDate: DateFrom, Todate: DateTo, AdustmentTypeID: AdustmentTypeID, custId: custId, vendorId: vendorId, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
                },
                success: function (d) {
                    //;
                    var result = d;
                    if (result.IsSuccess) {
                        Details = result.Response;
                        for (var i = 0; i < Details.length; i++) {
                            Details[i].TrDate = DateFormat(Details[i].TrDate);
                            if (Details[i].IsDebit) {
                                Details[i].IsDebitNew = (lang == "ar" ? "مدين" : "Debit");
                            }
                            else {
                                Details[i].IsDebitNew = (lang == "ar" ? "دأئن" : "Credit");
                            }
                            if (Details[i].Status == 1) {
                                Details[i].Status_New = (lang == "ar" ? "معتمد " : "A certified ");
                            }
                            else {
                                Details[i].Status_New = (lang == "ar" ? "غير معتمد" : "Not supported");
                            }
                        }
                        InitializeGrid();
                        //filter_DataSource();
                        ReportGrid.DataSource = Details;
                        ReportGrid.Bind();
                    }
                }
            });
        }
    }
    function _SearchBox_Change() {
        //  k//;
        $("#ReportGrid").jsGrid("option", "pageIndex", 1);
        if (searchbutmemreport.value != "") {
            var search_1 = searchbutmemreport.value.toLowerCase();
            SearchDetails = Details.filter(function (x) { return x.TrNo.toString().search(search_1) >= 0 || x.Adj_DescA.toLowerCase().search(search_1) >= 0 || x.Adj_DescE.toLowerCase().search(search_1) >= 0 || x.cus_NameA.toLowerCase().search(search_1) >= 0 || x.Cus_NameE.toLowerCase().search(search_1) >= 0 || x.CustomerCODE.toLowerCase().search(search_1) >= 0; }); /*|| x.MOBILE.toLowerCase().search(search) >= 0*/
            //    || x.CustomerCODE.toString().search(search) >= 0 /* || x.CreditLimit.toString().search(search) >= 0 || x.Emp_NameA.toString().search(search) >= 0
            //    || x.ContactMobile.toString().search(search) >= 0 /*|| x.DueAmount.toString().search(search) >= 0 *//*|| x.DaysDiff.toString().search(search) >= 0*/);
            ReportGrid.DataSource = SearchDetails;
            ReportGrid.Bind();
        }
        else {
            ReportGrid.DataSource = Details;
            ReportGrid.Bind();
        }
    }
    function InitializeGrid() {
        var res = GetResourceList("");
        $("#id_ReportGrid").removeClass("display_none");
        ReportGrid.OnRowDoubleClicked = DriverDoubleClick;
        ReportGrid.ElementName = "ReportGrid";
        ReportGrid.PrimaryKey = "AdjustmentID";
        ReportGrid.Paging = true;
        ReportGrid.PageSize = 10;
        ReportGrid.Sorting = true;
        ReportGrid.InsertionMode = JsGridInsertionMode.Binding;
        ReportGrid.Editing = false;
        ReportGrid.Inserting = false;
        ReportGrid.SelectedIndex = 1;
        ReportGrid.OnItemEditing = function () { };
        ReportGrid.Columns = [
            { title: "الرقم", name: "AdjustmentID", type: "text", width: "100px", visible: false },
            { title: res.App_InvoiceNum, name: "TrNo", type: "text", width: "100px" },
            { title: res.App_date, name: "TrDate", type: "text", width: "100px" },
            { title: res.App_MovementType, name: "IsDebitNew", type: "text", width: "100px" },
            {
                title: res.App_Settlement_type, name: (lang == "ar" ? "Adj_DescA" : "Adj_DescE"), type: "text", width: "100px"
            },
            { title: res.App_CustomerCODE, name: "CustomerCODE", type: "text", width: "100px" },
            { title: res.App_Cutomer, name: "cus_NameA", type: "text", width: "100px" },
            { title: res.App_Amount, name: "Amount", type: "text", width: "100px" },
            { title: res.App_Tax, name: "VatAmount", type: "text", width: "100px" },
            { title: res.App_Settlement_total, name: "NetAfterVAT", type: "text", width: "100px" },
            { title: res.App_Certified, name: "Status_New", type: "text", width: "100px" },
        ];
        ReportGrid.Bind();
    }
    function Assign() {
        Model = new A_RecPay_Tr_Adjustment();
        if (IsNew == true) {
            DocumentActions.AssignToModel(Model); //Insert Update
            if (chkActive.checked) {
                Model.Status = 1;
            }
            else {
                Model.Status = 0;
            }
            Model.CompCode = Number(SysSession.CurrentEnvironment.CompCode);
            Model.BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);
            Model.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
            Model.UserCode = SysSession.CurrentEnvironment.UserCode;
            Model.CreatedAt = DateTimeFormat(Date().toString());
            Model.CreatedBy = SysSession.CurrentEnvironment.UserCode;
            Model.AdjustmentID = AdjustmentID;
            Model.IsDebit = $('#txt_Movement_typeNew').val();
            Model.AdustmentTypeID = $('#txt_Settlement_typeNew').val();
            Model.CustomerId = PurchaserId;
            Model.VatType = $('#txt_Type_of_tax').val();
            Model.VendorId = null;
            Model.TrDateH = "1";
            Model.TrNo = 0;
            Model.IsCustomer = isCustomer;
            Model.Branch_Code = SysSession.CurrentEnvironment.BranchCode;
            Model.Comp_Code = SysSession.CurrentEnvironment.CompCode;
            Model.MODULE_CODE = Modules.AccTrCustomerAdjust;
            Model.UserCode = SysSession.CurrentEnvironment.UserCode;
            Model.sec_FinYear = SysSession.CurrentEnvironment.CurrentYear;
        }
        else {
            DocumentActions.AssignToModel(Model); //Insert Update
            if (chkActive.checked) {
                Model.Status = 1;
            }
            else {
                Model.Status = 0;
            }
            Model.CompCode = Number(compcode);
            Model.BranchCode = Number(BranchCode);
            Model.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
            Model.UserCode = SysSession.CurrentEnvironment.UserCode;
            Model.UpdatedAt = DateTimeFormat(Date().toString());
            Model.UpdatedBy = SysSession.CurrentEnvironment.UserCode;
            Model.AdjustmentID = AdjustmentID;
            Model.IsDebit = $('#txt_Movement_typeNew').val();
            Model.AdustmentTypeID = $('#txt_Settlement_typeNew').val();
            Model.CustomerId = PurchaserId;
            Model.VatType = $('#txt_Type_of_tax').val();
            Model.VendorId = null;
            Model.TrDateH = "1";
            Model.TrNo = txt_CODE.value;
            Model.IsCustomer = isCustomer;
            Model.Branch_Code = SysSession.CurrentEnvironment.BranchCode;
            Model.Comp_Code = SysSession.CurrentEnvironment.CompCode;
            Model.MODULE_CODE = Modules.AccTrCustomerAdjust;
            Model.UserCode = SysSession.CurrentEnvironment.UserCode;
            Model.sec_FinYear = SysSession.CurrentEnvironment.CurrentYear;
        }
    }
    function Insert() {
        Assign();
        if (!CheckDate(DateFormat(txtDateNew.value).toString(), DateFormat(SysSession.CurrentEnvironment.StartDate).toString(), DateFormat(SysSession.CurrentEnvironment.EndDate).toString())) {
            //MessageBox.Show('  التاريخ ليس متطابق مع تاريخ المتاح (' + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ')', '');
            WorningMessage("  التاريخ ليس متطابق مع تاريخ المتاح (" + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ")", "Date does not match available date(" + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ")", "تحذير", "worning");
            return;
        }
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("AccTrAdjust", "Insert"),
            data: JSON.stringify(Model),
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    var res = result.Response;
                    AdjustmentID = res.AdjustmentID;
                    DisplayMassage("تم الحفظ بنجاح", "Success", MessageType.Succeed);
                    Success();
                    Save_Succ_But();
                }
                else {
                    DisplayMassage("خطأء", "Error", MessageType.Error);
                }
            }
        });
    }
    function Update() {
        Assign();
        if (!CheckDate(DateFormat(txtDateNew.value).toString(), DateFormat(SysSession.CurrentEnvironment.StartDate).toString(), DateFormat(SysSession.CurrentEnvironment.EndDate).toString())) {
            //MessageBox.Show('  التاريخ ليس متطابق مع تاريخ المتاح (' + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ')', '');
            WorningMessage("  التاريخ ليس متطابق مع تاريخ المتاح (" + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ")", "Date does not match available date(" + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ")", "تحذير", "worning");
            return;
        }
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("AccTrAdjust", "Update"),
            data: JSON.stringify(Model),
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    var res = result.Response;
                    AdjustmentID = res.AdjustmentID;
                    DisplayMassage("تم الحفظ بنجاح", "Success", MessageType.Succeed);
                    Success();
                    Save_Succ_But();
                }
                else {
                    DisplayMassage("خطأء", "Error", MessageType.Error);
                    Update_claenData = 0;
                }
            }
        });
    }
    function Success() {
        IsNew = true;
        btnback_onclick();
        Display();
        Update_claenData = 1;
        Selecteditem = Details.filter(function (x) { return x.AdjustmentID == Number(AdjustmentID); });
        txt_Movement_typeNew.value = Selecteditem[0].IsDebit;
        txt_Movement_typeNew_onchange();
        DisplayData(Selecteditem);
        AdjustmentID = Selecteditem[0].AdjustmentID;
        compcode = Selecteditem[0].CompCode;
        BranchCode = Selecteditem[0].BranchCode;
        IsNew = false;
        Update_claenData = 0;
        reference_Page();
        $('#Div_control').removeClass("display_none");
        $('#btnUpdate').removeClass("display_none");
        $('#btnPrintTransaction').removeClass("display_none");
        $('#btnSave').addClass("display_none");
        $('#btnBack').addClass("display_none");
        $('#btnUpdate').removeAttr("disabled");
        $('#btnPrintTransaction').removeAttr("disabled");
        if (Selecteditem[0].Status == 1) {
            chkActive.checked = true;
            btnEdit.disabled = true;
            chkActive.disabled = false;
            chkActive.disabled = !SysSession.CurrentPrivileges.CUSTOM2;
        }
        else {
            chkActive.checked = false;
            chkActive.disabled = true;
            btnEdit.disabled = !SysSession.CurrentPrivileges.EDIT;
        }
        $("#txtUpdatedBy").val(SysSession.CurrentEnvironment.UserCode);
        $("#txtUpdatedAt").val(DateTimeFormat(Date().toString()));
    }
    function PrintReport(OutType) {
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
        var AdjDebit;
        var AdjId;
        var CustomerID;
        var VendorId;
        var status;
        if ($("#txt_Movement_type").val() == "Null")
            AdjDebit = -1;
        if ($("#txt_Movement_type").val() == "true")
            AdjDebit = 1;
        if ($("#txt_Movement_type").val() == "false")
            AdjDebit = 0;
        if ($("#txt_Settlement_type").val() == "Null")
            AdjId = -1;
        else
            AdjId = Number($("#txt_Settlement_type").val());
        if ($("#txt_CustCode").val() == "Null")
            CustomerID = -1;
        else
            CustomerID = Number($("#txt_CustCode").val());
        if (txt_Status.selectedIndex > 0)
            status = Number($("#txt_Status").val());
        else
            status = 2;
        rp.AdjDebit = AdjDebit;
        rp.AdjId = AdjId;
        rp.TrType = 1;
        rp.CustomerID = CustomerID;
        rp.VendorId = -1;
        rp.Status = status;
        Ajax.Callsync({
            url: Url.Action("IProc_Rep_AccAdjustList", "GeneralReports"),
            data: rp,
            success: function (d) {
                var result = d.result;
                window.open(result, "_blank");
            }
        });
    }
    AccTrCustomerAdjust.PrintReport = PrintReport;
    function PrintTransaction() {
        if (!SysSession.CurrentPrivileges.PrintOut)
            return;
        var rp = new ReportParameters();
        rp.Type = 0;
        rp.Repdesign = 1;
        rp.TRId = AdjustmentID;
        rp.Name_function = "rptAdjustNote";
        localStorage.setItem("Report_Data", JSON.stringify(rp));
        localStorage.setItem("result", '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>');
        window.open(Url.Action("ReportsPopup", "Home"), "_blank");
    }
})(AccTrCustomerAdjust || (AccTrCustomerAdjust = {}));
//# sourceMappingURL=AccTrCustomerAdjust.js.map