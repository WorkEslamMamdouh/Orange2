$(document).ready(function () {
    AccTrPaymentNote.InitalizeComponent();
});
var AccTrPaymentNote;
(function (AccTrPaymentNote) {
    var IQ_TrType = 2;
    var AccType = 2;
    //var TrType = 1;
    var codeType = "PayType";
    var Details = new Array();
    var BilldIData = new Array();
    var ReportGrid = new JsGrid();
    var G_Currency_ = new G_Currency();
    var Details_Type_D_CashBox = new Array();
    var Details_GCodes = new Array();
    var Model = new A_RecPay_Tr_ReceiptNote();
    var Details_GCodes_ChckType = new Array();
    var Details_Customer = new Array();
    var Details_Vendor = new Array();
    var Details_ACCOUNT = new Array();
    var Details_Pay_D_Accounts = new Array();
    var Details_Acount = new Array();
    var sys = new SystemTools();
    var SysSession = GetSystemSession(Modules.AccTrPaymentNote);
    var txt_ReceiptNote;
    var txt_Status;
    var txt_ReceiptNoteNew;
    //var txt_ID_beneficiary: HTMLSelectElement;
    //var txt_ID_beneficiaryNew: HTMLSelectElement;
    var txtDateNew;
    var txtDueDate;
    var txtDateFrom;
    var txtDateTo;
    var txt_D_CashBox;
    var txt_Receiving_Fund;
    var txtCashType;
    var txtCashTypeNew;
    var txt_BankAcc_Code;
    var txt_CODE;
    var txt_note;
    var searchbutmemreport;
    var txt_VoucherNo;
    var txt_Amount;
    var txt_CashAmount;
    var txt_CardAmount;
    var txt_ReceiptDesc;
    var btnBack;
    var btnShow;
    var btnAdd;
    var btnEdit;
    var btnSave;
    var chkActive;
    var chkIsDeffered;
    ////////////////////////////////////////////donia 
    var btnBen;
    var txt_BenCode;
    var txt_BenName;
    var btnPrintsFrom_To;
    var btnBenH;
    var txt_BenCodeH;
    var txt_BenNameH;
    var BenID;
    var GlobalID = 0;
    var GlobalCustIDH = 0;
    var PurchaserVndIdH = 0;
    var GlobalBankIDH = 0;
    var GlobalAccIDH = 0;
    var GlobalBoxIDH = 0;
    ////////////////////////////////////////////Vendors////////////////////////////////////////
    var PurchaserVndId;
    var VndIdfilter;
    var GLOBALopenbalance;
    var AccountVndDetails = new Array();
    var BenVndDetails = new Array();
    //////////////////////////////////////////Customers/////////////////////////////////////////
    var AccountVendorDetails = new Array();
    var VendorDetails = new Array();
    var PurchaserCustId;
    var custIdfilter;
    //////////////////////////////////////////Bank/////////////////////////////////////////
    var AccountBankDetails = new A_ACCOUNT;
    var BankDetails = new Array();
    var PurchaserBankId;
    var BankIdfilter;
    //////////////////////////////////////////Account/////////////////////////////////////////
    var AccountAccDetails = new Array();
    var AccDetails = new Array();
    var PurchaserAccId;
    var AccIdfilter;
    //////////////////////////////////////////Account/////////////////////////////////////////
    var AccountBoxDetails = new Array();
    var BoxDetails = new Array();
    var PurchaserBoxId;
    var BoxIdfilter;
    //---------------------------------------------------print buttons 
    var btnPrintTrview;
    var btnPrintTrPDF;
    var btnPrintTrEXEL;
    var btnPrintTransaction;
    // var btnPrint: HTMLButtonElement;
    //------------------------------------------------------------------
    var compcode; //SharedSession.CurrentEnvironment.CompCode;
    var BranchCode; //SharedSession.CurrentEnvironment.BranchCode;
    var IsNew;
    var index;
    var Selecteditem;
    var ReceiptIDUpdate = 0;
    var ReceiptID;
    var Valid = 0;
    var SearchDetails;
    var Update_claenData = 0;
    var Type_ReceiptNote = true;
    var Type_Receipt;
    var Type_Receipt_New;
    var DateFrom;
    var DateTo;
    var custId = 0;
    var vndid = 0;
    var BankCode = 0;
    var expid = 0;
    var fromBoxid = 0;
    var Boxid;
    var RecPayTypeId;
    var Status;
    var isExpense;
    var IsEdite = false;
    var CashType = 0;
    var EDIT = SysSession.CurrentPrivileges.EDIT;
    var AddNew = SysSession.CurrentPrivileges.AddNew;
    var CUSTOM1 = SysSession.CurrentPrivileges.CUSTOM1;
    var CUSTOM2 = SysSession.CurrentPrivileges.CUSTOM2;
    //var Mode: number;
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);
    function InitalizeComponent() {
        //debugger
        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = "سند صرف";
        }
        else {
            document.getElementById('Screen_name').innerHTML = "Payment Permission";
        }
        console.log(SysSession.CurrentEnvironment);
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);
        InitalizeControls();
        InitalizeEvents();
        reference_Page();
        //btnAdd.disabled = true;
        Display_D_CashBox();
        Display_GCodes();
        fillddlCashType();
        Display_Acount_Code();
        txtDateFrom.value = DateStartMonth();
        txtDateTo.value = ConvertToDateDash(GetDate()) <= ConvertToDateDash(SysSession.CurrentEnvironment.EndDate) ? GetDate() : SysSession.CurrentEnvironment.EndDate;
    }
    AccTrPaymentNote.InitalizeComponent = InitalizeComponent;
    function chkStatus_onchange() {
        debugger;
        if (IsNew != true) {
            if (Selecteditem[0].IsPosted != true) {
                if (Selecteditem[0].Status == 1 && chkActive.checked == false) {
                    Open();
                    Display();
                    //btnback_onclick();
                    Selecteditem = Details.filter(function (x) { return x.ReceiptID == Number(ReportGrid.SelectedKey); });
                    ReceiptID = Selecteditem[0].ReceiptID;
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
            }
            else {
                chkActive.checked = true;
                DisplayMassage(" تم ترحيل الحسبات لا يمكنك فك الاعتماد ", "You can't de-IsPosted", MessageType.Worning);
            }
        }
    }
    function Open() {
        //debugger
        Assign();
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("AccTrReceipt", "Open"),
            data: JSON.stringify(Model),
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    DisplayMassage("تم الاعتماد بنجاح", "Accreditation was successful", MessageType.Succeed);
                    Update_claenData = 1;
                }
                else {
                    DisplayMassage("خطأء", "Error", MessageType.Error);
                    Update_claenData = 0;
                }
            }
        });
    }
    function reference_Page() {
        //debugger
        if (!EDIT) {
            $('#btnUpdate').addClass("display_none");
            $('#btnSave').addClass("display_none");
            $('#btnBack').addClass("display_none");
            //$('#btnUpdate').attr('class', 'btn btn-primary display_none');
            //$('#btnSave').attr('class', 'btn btn-success display_none');
            //$('#btnBack').attr('class', 'btn btn-success display_none');
        }
        if (!AddNew) {
            $('#btnAdd').addClass("display_none");
            //  $('#btnAdd').attr('class', 'btn btn-primary display_none');
        }
    }
    function InitalizeControls() {
        //////debugger;
        btnShow = document.getElementById("btnShow");
        btnAdd = document.getElementById("btnAdd");
        btnEdit = document.getElementById("btnUpdate");
        btnSave = document.getElementById("btnSave");
        btnBack = document.getElementById("btnBack");
        //print 
        btnPrintTrview = document.getElementById("btnPrintTrview");
        btnPrintTrPDF = document.getElementById("btnPrintTrPDF");
        btnPrintTrEXEL = document.getElementById("btnPrintTrEXEL");
        btnPrintTransaction = document.getElementById("btnPrintTransaction");
        //    btnPrint = document.getElementById("btnPrint") as HTMLButtonElement;
        //textBoxes
        txt_CODE = document.getElementById("txt_CODE");
        txt_ReceiptNote = document.getElementById("txt_ReceiptNote");
        txt_ReceiptNoteNew = document.getElementById("txt_ReceiptNoteNew");
        //txt_ID_beneficiary = document.getElementById("txt_ID_beneficiary") as HTMLSelectElement;
        // txt_ID_beneficiaryNew = document.getElementById("txt_ID_beneficiaryNew") as HTMLSelectElement;
        txt_D_CashBox = document.getElementById("txt_D_CashBox");
        txt_Status = document.getElementById("txt_Status");
        txt_VoucherNo = document.getElementById("txt_VoucherNo");
        txt_Amount = document.getElementById("txt_Amount");
        txt_CashAmount = document.getElementById("txt_CashAmount");
        txt_CardAmount = document.getElementById("txt_CardAmount");
        txt_ReceiptDesc = document.getElementById("txt_ReceiptDesc");
        txt_Receiving_Fund = document.getElementById("txt_Receiving_Fund");
        txtCashType = document.getElementById("txtCashType");
        txtCashTypeNew = document.getElementById("txtCashTypeNew");
        txt_BankAcc_Code = document.getElementById("txt_BankAcc_Code");
        txtDateNew = document.getElementById("txtDateNew");
        txtDueDate = document.getElementById("txtDueDate");
        txtDateFrom = document.getElementById("txtDateFrom");
        txtDateTo = document.getElementById("txtDateTo");
        txt_note = document.getElementById("txt_note");
        chkActive = document.getElementById("chkStatus");
        chkIsDeffered = document.getElementById("chkIsDeffered");
        searchbutmemreport = document.getElementById("searchbutmemreport");
        //////////////////////////////donia
        btnBen = document.getElementById("btnBen");
        txt_BenCode = document.getElementById("txt_BenCode");
        txt_BenName = document.getElementById("txt_BenName");
        btnPrintsFrom_To = document.getElementById("btnPrintsFrom_To");
        btnBenH = document.getElementById("btnBenH");
        txt_BenCodeH = document.getElementById("txt_BenCodeH");
        txt_BenNameH = document.getElementById("txt_BenNameH");
    }
    function InitalizeEvents() {
        ////debugger
        btnShow.onclick = btnShow_onclick;
        btnAdd.onclick = btnAdd_onclick;
        btnSave.onclick = btnsave_onClick;
        btnBack.onclick = btnback_onclick;
        btnEdit.onclick = btnEdit_onclick;
        searchbutmemreport.onkeyup = _SearchBox_Change;
        chkActive.onchange = chkStatus_onchange;
        chkIsDeffered.onchange = chkIsDeffered_onchange;
        txt_D_CashBox.onchange = txt_D_CashBox_onchange;
        txtCashTypeNew.onchange = txtCashTypeNew_onchange;
        txt_ReceiptNote.onchange = txt_ReceiptNote_onchange;
        txt_ReceiptNoteNew.onchange = txt_ReceiptNoteNew_onchange;
        //txt_ID_beneficiaryNew.onchange = txt_D_beneficiaryNew_onchange;
        txt_CashAmount.onkeyup = txt_CashAmount_onchange;
        txt_CardAmount.onkeyup = txt_CashAmount_onchange;
        txtDateFrom.value = GetDate();
        txtDateTo.value = GetDate();
        btnPrintTrview.onclick = function () { PrintReport(1); };
        btnPrintTrPDF.onclick = function () { PrintReport(2); };
        btnPrintTrEXEL.onclick = function () { PrintReport(3); };
        // btnPrint.onclick = () => { PrintReport(4); }
        btnPrintTransaction.onclick = PrintTransaction;
        txt_CashAmount.onchange = Amount_onchange;
        txt_CardAmount.onchange = Amount_onchange;
        /////////////////////////////donia
        txt_BenCode.onchange = txt_BenCode_onchange;
        btnBen.onclick = btnBen_onclick;
        txt_BenCodeH.onchange = txt_BenCodeH_onchange;
        btnBenH.onclick = btnBenH_onclick;
        btnPrintsFrom_To.onclick = btnPrintsFrom_To_onclick;
    }
    function fillddlCashType() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GCodes", "GetAll"),
            data: {
                codeType: 'ChckType', UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    Details_GCodes_ChckType = result.Response;
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                        DocumentActions.FillCombowithdefult(Details_GCodes_ChckType, txtCashType, "CodeValue", "DescE", "Type of constraint");
                        DocumentActions.FillCombowithdefult(Details_GCodes_ChckType, txtCashTypeNew, "CodeValue", "DescE", "Type of constraint");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(Details_GCodes_ChckType, txtCashType, "CodeValue", "DescA", "اختر نوع القيد");
                        DocumentActions.FillCombowithdefult(Details_GCodes_ChckType, txtCashTypeNew, "CodeValue", "DescA", "اختر نوع القيد");
                    }
                }
            }
        });
    }
    function chkIsDeffered_onchange() {
        if (chkIsDeffered.checked == true) {
            $('#btnUpdate').hasClass("display_none") ? $('#txtDueDate').removeAttr('disabled') : $('#txtDueDate').attr('disabled', 'disabled');
            //$('#btnUpdate').attr('class') == 'btn btn-primary display_none' ? $('#txtDueDate').removeAttr('disabled') : $('#txtDueDate').attr('disabled', 'disabled');
        }
        else {
            $('#txtDueDate').attr('disabled', 'disabled');
        }
    }
    function Display_Acount_Code() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GLDefAccount", "GetBankAcc"),
            data: {
                CompCode: compcode, AccType: 3, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    Details_Acount = result.Response;
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                        DocumentActions.FillCombowithdefult(Details_Acount, txt_BankAcc_Code, "ACC_CODE", "ACC_DESCL", "Type of constraint");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(Details_Acount, txt_BankAcc_Code, "ACC_CODE", "ACC_DESCA", "اختر حساب الصرف");
                    }
                }
            }
        });
    }
    function txtCashTypeNew_onchange() {
        if (txtCashTypeNew.value == '0') {
            $('#Bank_Div').addClass('display_none');
            $('#La_CashAmount').removeClass('display_none');
            $('#La_CardAmount').removeClass('display_none');
            $('#txt_CashAmount').removeClass('display_none');
            $('#txt_CardAmount').removeClass('display_none');
            $('#txt_Amount').attr('disabled', 'disabled');
            $('#txt_CheckNo').val('');
            $('#txt_TransferNo').val('');
            $('#txt_BankAcc_Code').val('null');
            chkIsDeffered.checked = false;
            txtDueDate.value = GetDate();
        }
        else if (txtCashTypeNew.value == '1' || txtCashTypeNew.value == '2') {
            $('#Bank_Div').removeClass('display_none');
            $('#La_CashAmount').addClass('display_none');
            $('#La_CardAmount').addClass('display_none');
            $('#txt_CashAmount').addClass('display_none');
            $('#txt_CardAmount').addClass('display_none');
            $('#txt_TransferNo').removeClass('display_none');
            $('#txt_CheckNo').addClass('display_none');
            $('#txt_CashAmount').val('0');
            $('#txt_CardAmount').val('0');
            $('#btnUpdate').hasClass("display_none") ? $('#txt_Amount').removeAttr('disabled') : $('#txt_Amount').attr('disabled', 'disabled');
            //$('#btnUpdate').attr('class') == 'btn btn-primary display_none' ? $('#txt_Amount').removeAttr('disabled') : $('#txt_Amount').attr('disabled', 'disabled');
        }
        else {
            $('#Bank_Div').removeClass('display_none');
            $('#La_CashAmount').addClass('display_none');
            $('#La_CardAmount').addClass('display_none');
            $('#txt_CashAmount').addClass('display_none');
            $('#txt_CardAmount').addClass('display_none');
            $('#txt_TransferNo').addClass('display_none');
            $('#txt_CheckNo').removeClass('display_none');
            $('#txt_CashAmount').val('0');
            $('#txt_CardAmount').val('0');
            $('#btnUpdate').hasClass("display_none") ? $('#txt_Amount').removeAttr('disabled') : $('#txt_Amount').attr('disabled', 'disabled');
            // $('#btnUpdate').attr('class') == 'btn btn-primary display_none' ? $('#txt_Amount').removeAttr('disabled') : $('#txt_Amount').attr('disabled', 'disabled');
        }
        chkIsDeffered_onchange();
    }
    function txt_D_CashBox_onchange() {
        if (txt_D_CashBox.value == 'Null') {
            ///////////////////doniaH
            //$("#txt_ID_beneficiary").attr("disabled", "disabled");
            //$("#txt_ID_beneficiary").prop("value", "Null");
            $("#txt_BenCodeH").attr("disabled", "disabled");
            txt_BenCodeH.value = "";
            txt_BenNameH.value = "";
            $("#txt_ReceiptNote").prop("value", "Null");
            //txt_ReceiptNote.disabled = true;
            //btnAdd.disabled = true;
        }
        else {
            var box = Details_Type_D_CashBox.filter(function (x) { return x.CashBoxID == Number(txt_D_CashBox.value); });
            if (box.length > 0) {
                isExpense = box[0].IsRecPayAccount == null ? false : box[0].IsRecPayAccount;
            }
            else {
                isExpense = false;
            }
            //Display_GCodes();
            //btnAdd.disabled = false;
            //txt_ReceiptNote.disabled = false; btnAdd.disabled = false;
        }
    }
    function txt_CashAmount_onchange() {
        if (txt_CardAmount.value == null) {
            txt_CardAmount.value = "0";
        }
        if (txt_CashAmount.value == null) {
            txt_CashAmount.value = "0";
        }
        txt_Amount.value = (Number(txt_CashAmount.value) + Number(txt_CardAmount.value)).toString();
    }
    //function txt_ID_beneficiaryNew_onchange() {
    //    var openbalance = Number($('option:selected', txt_ID_beneficiaryNew).attr('data-openbalance'));
    //    if (txt_ID_beneficiaryNew.value == "Null") { $('#txt_Openbalance').val(""); } else { if (isNaN(openbalance) == false) $('#txt_Openbalance').val(openbalance); }
    //}
    function txt_ReceiptNoteNew_onchange() {
        ///////////////////////////donia 
        txt_BenCode.value = "";
        txt_BenName.value = "";
        if (txt_ReceiptNoteNew.value == "0" || txt_ReceiptNoteNew.value == "Null") {
            //$("#txt_ID_beneficiaryNew").attr("disabled", "disabled");
            //$("#txt_ID_beneficiaryNew").prop("value", "Null");
            //Type_Receipt_New = "";
            //////////////////////////donia
            $("#btnBen").attr("disabled", "disabled");
            $("#txt_BenCode").attr("disabled", "disabled");
            Type_Receipt_New = "";
        }
        else {
            //$("#txt_ID_beneficiaryNew").removeAttr("disabled");
            //Displaybeneficiary();
            Type_ReceiptNote = false;
            $("#btnBen").removeAttr("disabled");
            $("#txt_BenCode").removeAttr("disabled");
            Type_ReceiptNote = false;
            Type_Receipt_New = txt_ReceiptNoteNew.value;
            //Displaybeneficiary();
        }
        $('#txt_Openbalance').val('');
    }
    function txt_ReceiptNote_onchange() {
        txt_BenCodeH.value = "";
        txt_BenNameH.value = "";
        if (txt_ReceiptNote.value == "0" || txt_ReceiptNote.value == "Null") {
            /////////////doniaH
            //$("#txt_ID_beneficiary").attr("disabled", "disabled");
            //$("#txt_ID_beneficiary").prop("value", "Null");
            txt_BenCodeH.disabled = true;
            btnBenH.disabled = true;
            Type_Receipt = "";
        }
        else {
            //$("#txt_ID_beneficiary").removeAttr("disabled");
            //$("#txt_BenCodeH").removeAttr("disabled");
            txt_BenCodeH.disabled = false;
            btnBenH.disabled = false;
            Type_ReceiptNote = true;
            // Displaybeneficiary();
        }
    }
    function btnEdit_onclick() {
        if (!SysSession.CurrentPrivileges.EDIT)
            return;
        IsNew = false;
        IsEdite = true;
        removedisabled();
        if (SysSession.CurrentPrivileges.EDIT) {
            $('#btnSave').removeClass("display_none");
            $('#btnBack').removeClass("display_none");
            $("#div_ContentData :input").removeAttr("disabled");
            $("#btnUpdate").addClass("display_none");
            $("#txt_CODE").attr("disabled", "disabled");
            $("#txt_VoucherNo").attr("disabled", "disabled");
            $("#txt_Receiving_Fund").attr("disabled", "disabled");
            //$("#txt_Receiving_Fund").attr("disabled", "disabled");
            $("#id_div_Add").attr("disabled", "disabled").off('click');
            var x1 = $("#id_div_Add").hasClass("disabledDiv");
            (x1 == true) ? $("#id_div_Add").removeClass("disabledDiv") : $("#id_div_Add").addClass("disabledDiv");
            $('#btnPrintTransaction').addClass("display_none");
            if (txtCashTypeNew.value == 'null' || txtCashTypeNew.value == '0') {
                $("#txt_Amount").attr("disabled", "disabled");
            }
            else {
                $("#txt_Amount").removeAttr("disabled");
            }
            $("#txtDateNew").removeAttr("disabled");
        }
    }
    function btnAdd_onclick() {
        IsEdite = false;
        if (txt_D_CashBox.value == "Null") {
            DisplayMassage('(يجب أختيار الصندوق)', '(The Box must be selected)', MessageType.Worning);
            Errorinput(txt_D_CashBox);
            return;
        }
        else {
            DisplayAddStkGCodes();
            IsNew = true;
            EnableControls();
            removedisabled();
            ///////////////////////////donia
            //txt_ID_beneficiaryNew.setAttribute("disabled", "disabled");
            txt_BenCode.setAttribute("disabled", "disabled");
            btnBen.setAttribute("disabled", "disabled");
            $("#id_div_Add").addClass("disabledDiv");
            if (txt_D_CashBox.value != "Null") {
                $('#txt_Receiving_Fund').prop("value", txt_D_CashBox.value);
                $("#txt_Receiving_Fund").attr("disabled", "disabled");
            }
            reference_Page();
            chkActive.checked = false;
            $('#btnPrintTransaction').addClass("display_none");
            $('#Bank_Div').addClass('display_none');
            $('#La_CashAmount').removeClass('display_none');
            $('#La_CardAmount').removeClass('display_none');
            $('#txt_CashAmount').removeClass('display_none');
            $('#txt_CardAmount').removeClass('display_none');
            $('#txt_Amount').attr('disabled', 'disabled');
            $('#txtDateNew').removeAttr('disabled');
            $('#txt_CheckNo').val('');
            $('#txt_TransferNo').val('');
            $('#txt_BankAcc_Code').val('null');
            chkIsDeffered.checked = false;
            txtDueDate.value = GetDate();
        }
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
    function txt_disabled() {
        txt_CODE.setAttribute("disabled", "disabled");
        txt_ReceiptNoteNew.setAttribute("disabled", "disabled");
        txtDateNew.setAttribute("disabled", "disabled");
        chkActive.setAttribute("disabled", "disabled");
        $("#chkIsDeffered").attr("disabled", "disabled");
        //txt_ID_beneficiaryNew.setAttribute("disabled", "disabled");
        txt_note.setAttribute("disabled", "disabled");
        txt_VoucherNo.setAttribute("disabled", "disabled");
        txt_Amount.setAttribute("disabled", "disabled");
        txt_ReceiptDesc.setAttribute("disabled", "disabled");
        txt_CashAmount.setAttribute("disabled", "disabled");
        txt_CardAmount.setAttribute("disabled", "disabled");
        txt_Receiving_Fund.setAttribute("disabled", "disabled");
        chkIsDeffered.setAttribute("disabled", "disabled");
        $("#txt_CheckNo").attr("disabled", "disabled");
        $("#txt_TransferNo").attr("disabled", "disabled");
        $("#txt_BankName").attr("disabled", "disabled");
        $("#txt_BankAcc_Code").attr("disabled", "disabled");
        $("#txtCashTypeNew").attr("disabled", "disabled");
        $("#txtDueDate").attr("disabled", "disabled");
        $("#txt_Amount").attr("disabled", "disabled");
        //////////////////donia
        $("#btnBen").attr("disabled", "disabled");
        $("#txt_BenCode").attr("disabled", "disabled");
    }
    function removedisabled() {
        txt_ReceiptNoteNew.removeAttribute("disabled");
        // txtDateNew.removeAttribute("disabled");
        chkIsDeffered.removeAttribute("disabled");
        $("#chkStatus").removeAttr("disabled");
        //txt_ID_beneficiaryNew.removeAttribute("disabled");
        txt_note.removeAttribute("disabled");
        txt_ReceiptDesc.removeAttribute("disabled");
        txt_CashAmount.removeAttribute("disabled");
        txt_CardAmount.removeAttribute("disabled");
        txt_Receiving_Fund.removeAttribute("disabled");
        ///////////////////////////donia
        btnBen.removeAttribute("disabled");
        txt_BenCode.removeAttribute("disabled");
        $("#txt_CheckNo").removeAttr("disabled");
        $("#txt_TransferNo").removeAttr("disabled");
        $("#txt_BankName").removeAttr("disabled");
        $("#txt_BankAcc_Code").removeAttr("disabled");
        $("#txtCashTypeNew").removeAttr("disabled");
        $("#txtDueDate").removeAttr("disabled");
        $("#txtDateNew").removeAttr("disabled");
    }
    function GetDate() {
        //debugger
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
        if (txtCashTypeNew.selectedIndex == 0) {
            DisplayMassage("يجب اختيار نوع القيد ", "The type of constraint must be selected", MessageType.Worning);
            Errorinput(txtCashTypeNew);
            return Valid = 1;
        }
        if (txt_ReceiptNoteNew.selectedIndex == 0) {
            DisplayMassage("يجب اختيار نوع الصرف ", "The type of drainage must be selected", MessageType.Worning);
            Errorinput(txt_ReceiptNoteNew);
            return Valid = 1;
        }
        //if (txt_ID_beneficiaryNew.selectedIndex == 0) {
        //    DisplayMassage("يجب اختيار المستفيد ", "The beneficiary must be chosen", MessageType.Worning);
        //    Errorinput(txt_ID_beneficiaryNew);
        //    return Valid = 1;
        //}
        if (txt_BenCode.value.trim() == "") {
            DisplayMassage("يجب اختيار المستفيد ", "The beneficiary must be chosen", MessageType.Worning);
            Errorinput(txt_BenCode);
            return Valid = 1;
        }
        if (txtDateNew.value == "") {
            DisplayMassage("يجب اختيار التاريخ ", "The date must be chosen", MessageType.Worning);
            Errorinput(txtDateNew);
            return Valid = 1;
        }
        if (txt_Receiving_Fund.value == "Null") {
            DisplayMassage("يجب اختيار سند الصندوق  ", "A fund bond must be selected", MessageType.Worning);
            Errorinput(txt_Receiving_Fund);
            return Valid = 1;
        }
        if ((txt_CashAmount.value == "0" && txt_CardAmount.value == "0" || txt_CashAmount.value.trim() == "" && txt_CardAmount.value.trim() == "" || txt_CashAmount.value.trim() == "" && txt_CardAmount.value.trim() == "0" || txt_CashAmount.value.trim() == "0" && txt_CardAmount.value.trim() == "") && txtCashTypeNew.value == "0") {
            DisplayMassage("يجب ادخال نقدي او كارت", "You must enter cash or card ", MessageType.Worning);
            Errorinput(txt_CardAmount);
            Errorinput(txt_CashAmount);
            return Valid = 1;
        }
        if (txt_Amount.value == "0" || txt_Amount.value.trim() == "") {
            DisplayMassage("يجب ادخال  البلغ   ", " Amount must be entered", MessageType.Worning);
            Errorinput($('#txt_Amount'));
            return false;
        }
        if ((txtCashTypeNew.value == "1" || txtCashTypeNew.value == "2") && $('#txt_TransferNo').val() == '') {
            DisplayMassage("يجب ادخال  رقم التحويله ", "Transfer number must be entered", MessageType.Worning);
            Errorinput($('#txt_TransferNo'));
            return Valid = 1;
        }
        if (txtCashTypeNew.value != "0" && txtCashTypeNew.value != "1" && txtCashTypeNew.value != "2" && $('#txt_CheckNo').val() == '') {
            DisplayMassage("يجب ادخال  رقم الشيك   ", "The check number must be entered", MessageType.Worning);
            Errorinput($('#txt_CheckNo'));
            return Valid = 1;
        }
        if (txtCashTypeNew.value != "0" && $('#txt_BankName').val() == '') {
            DisplayMassage("يجب ادخال  صادر من بنك  ", "The entry must be issued by a bank", MessageType.Worning);
            Errorinput($('#txt_BankName'));
            return Valid = 1;
        }
        if (txtCashTypeNew.value != "0" && txt_BankAcc_Code.selectedIndex == 0) {
            DisplayMassage("يجب اختيار  رقم  حساب الصرف  ", "You must Choose Exchange Account", MessageType.Worning);
            Errorinput(txt_BankAcc_Code);
            return Valid = 1;
        }
        //if (txt_CashAmount.value != "0" && txt_CardAmount.value == "") {
        //    txt_CardAmount.value = "0";
        //} else {
        //    txt_CashAmount.value = "0";
        //}
        return Valid = 0;
    }
    function btnShow_onclick() {
        if (txtDateFrom.value == "" || txtDateTo.value == "") {
            DisplayMassage('(يجب أختيار التاريخ)', '(The date must be selected)', MessageType.Worning);
        }
        else {
            Display();
        }
    }
    function AddDisabled() {
        ////// 
        $('#btnAddDetails').addClass("display_none");
        $('#btnSave').addClass("display_none");
        $('#btnBack').addClass("display_none");
        $("#btnPrintTransaction").removeClass("display_none");
        //$("#div_ContentData :input").attr("disabled", "true");
        $(".fa-minus-circle").addClass("display_none");
        $("#btnUpdate").removeClass("display_none");
        $("#btnUpdate").removeAttr("disabled");
        //$("#drpPaymentType").removeAttr("disabled");
        $("#drp_G_Store").removeAttr("disabled");
        txt_disabled();
        Update_claenData = 0;
        EDIT = SysSession.CurrentPrivileges.EDIT;
        AddNew = SysSession.CurrentPrivileges.AddNew;
        CUSTOM1 = SysSession.CurrentPrivileges.CUSTOM1;
        CUSTOM2 = SysSession.CurrentPrivileges.CUSTOM2;
        $("#id_div_Add").attr("disabled", "");
        $("#id_div_Add").removeClass("disabledDiv");
    }
    function btnback_onclick() {
        IsEdite = false;
        if (IsNew == true) {
            $('#btnAddDetails').addClass("display_none");
            $('#btnSave').addClass("display_none");
            $('#btnBack').addClass("display_none");
            $("#btnPrintTransaction").removeClass("display_none");
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
            EDIT = SysSession.CurrentPrivileges.EDIT;
            AddNew = SysSession.CurrentPrivileges.AddNew;
            CUSTOM1 = SysSession.CurrentPrivileges.CUSTOM1;
            CUSTOM2 = SysSession.CurrentPrivileges.CUSTOM2;
        }
        else {
            DriverDoubleClick();
        }
    }
    function DriverDoubleClick() {
        IsNew = false;
        IsEdite = false;
        EnableControls();
        AddDisabled();
        Update_claenData = 1;
        Selecteditem = Details.filter(function (x) { return x.ReceiptID == Number(ReportGrid.SelectedKey); });
        DisplayAddStkGCodes();
        DisplayData(Selecteditem);
        ReceiptID = Selecteditem[0].ReceiptID;
        //compcode = Selecteditem[0].CompCode;
        //BranchCode = Selecteditem[0].BranchCode;
        Update_claenData = 0;
        reference_Page();
        $('#btnUpdate').removeClass("display_none");
        $('#btnSave').addClass("display_none");
        $('#btnBack').addClass("display_none");
        $('#btnUpdate').removeAttr("disabled");
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
        $("#Div_control").removeClass("display_none");
        Amount_onchange();
    }
    function DisplayData(Selecteditem) {
        DocumentActions.RenderFromModel(Selecteditem[0]);
        Type_Receipt_New = "" + Selecteditem[0].RecPayTypeId + "";
        debugger;
        $('#txtCashTypeNew').prop("value", Selecteditem[0].CashType == null ? "null" : Selecteditem[0].CashType);
        $('#txt_BankAcc_Code').prop("value", Selecteditem[0].BankAcc_Code == null ? "null" : Selecteditem[0].BankAcc_Code);
        var trDate = DateFormat(Selecteditem[0].TrDate);
        var DueDate = DateFormat(Selecteditem[0].DueDate);
        txtDateNew.value = trDate;
        txtDueDate.value = DueDate == null ? GetDate() : DueDate;
        Type_ReceiptNote = false;
        //$('#txt_ID_beneficiaryNew').html("");
        //$('#txt_ID_beneficiaryNew').append('<option value="Null"> ' + (lang == "ar" ? "Choose the beneficiary" : "SBr_DescE")+'</option>');
        //if (Selecteditem[0].RecPayTypeId == 1) { DisplayAccDefCustomer(); }
        //if (Selecteditem[0].RecPayTypeId == 2) { DisplayAccDefvendor(); }
        //if (Selecteditem[0].RecPayTypeId == 3) { DisplayAccount(); }
        //if (Selecteditem[0].RecPayTypeId == 4) { Display_RecPay_D_Accounts(); }
        //if (Selecteditem[0].RecPayTypeId == 5) { Display_benef_CashBox(); }
        //if (Type_Receipt_New == "Customer") { $('#txt_ID_beneficiaryNew').prop('value', Selecteditem[0].CustomerID) }
        //else if (Type_Receipt_New == "Vendor") { $('#txt_ID_beneficiaryNew').prop('value', Selecteditem[0].VendorID) }
        //else if (Type_Receipt_New == "BankCode") { $('#txt_ID_beneficiaryNew').prop('value', Selecteditem[0].BankAccountCode) }
        //else if (Type_Receipt_New == "Expense") { $('#txt_ID_beneficiaryNew').prop('value', Selecteditem[0].ExpenseID) }
        //else if (Type_Receipt_New == "CashBox") { $('#txt_ID_beneficiaryNew').prop('value', Selecteditem[0].CashBoxID) }
        /////////////////////////////donia
        if (Selecteditem[0].RecPayTypeId == 1) {
            getAccountCustById(Selecteditem[0].CustomerID.toString(), false);
        }
        if (Selecteditem[0].RecPayTypeId == 2) {
            getAccountVndById(Selecteditem[0].VendorID.toString(), false);
        }
        if (Selecteditem[0].RecPayTypeId == 3) {
            getAccountBankById(Selecteditem[0].BankAccountCode, true);
        }
        if (Selecteditem[0].RecPayTypeId == 4) {
            getAccountAccById(Selecteditem[0].ExpenseID.toString(), false);
        }
        if (Selecteditem[0].RecPayTypeId == 5) {
            getAccountBoxById(Selecteditem[0].FromCashBoxID.toString(), false);
        }
        //if (Type_Receipt_New == "1") { getAccountCustById(Selecteditem[0].CustomerID.toString(), false); }
        //else if (Type_Receipt_New == "2") { getAccountVndById(Selecteditem[0].VendorID.toString(), false); }
        //else if (Type_Receipt_New == "3") { getAccountBankById(Selecteditem[0].BankAcc_Code, true); }
        //else if (Type_Receipt_New == "4") { getAccountAccById(Selecteditem[0].Bef_Code.toString(), true); }
        //else if (Type_Receipt_New == "5") { getAccountBoxById(Selecteditem[0].CashBoxID.toString(), false); }
        chkIsDeffered.checked = Selecteditem[0].IsDeffered == true ? true : false;
        $('#txt_ReceiptNoteNew').prop("value", Selecteditem[0].RecPayTypeId);
        $('#txt_Receiving_Fund').prop("value", Selecteditem[0].CashBoxID);
        txtCashTypeNew_onchange();
    }
    function Display_GCodes() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GCodes", "GetAll"),
            data: {
                codeType: codeType, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    Details_GCodes = result.Response;
                    DisplayStkGCodes();
                }
            }
        });
    }
    function DisplayStkGCodes() {
        $('#txt_ReceiptNote').html('');
        $('#txt_ReceiptNote').append('<option value="Null">' + (lang == "ar" ? "اختر نوع الصرف" : "select type exchange") + '</option>');
        for (var i = 0; i < Details_GCodes.length; i++) {
            $('#txt_ReceiptNote').append('<option value="' + Details_GCodes[i].CodeValue + '">' + (lang == "ar" ? Details_GCodes[i].DescA : Details_GCodes[i].DescE) + '</option>');
        }
    }
    function DisplayAddStkGCodes() {
        $('#txt_ReceiptNoteNew').html('');
        $('#txt_ReceiptNoteNew').append('<option value="Null">' + (lang == "ar" ? "اختر نوع الصرف" : "select type exchange") + '</option>');
        for (var i = 0; i < Details_GCodes.length; i++) {
            if (Details_GCodes[i].CodeValue == 4 && isExpense == false)
                continue;
            $('#txt_ReceiptNoteNew').append('<option value="' + Details_GCodes[i].CodeValue + '">' + (lang == "ar" ? Details_GCodes[i].DescA : Details_GCodes[i].DescE) + '</option>');
        }
    }
    function Display_D_CashBox() {
        //debugger
        var CashBoxID = 0;
        if (SysSession.CurrentEnvironment.UserType == 2 || SysSession.CurrentEnvironment.UserType == 3) {
            CashBoxID = SysSession.CurrentEnvironment.CashBoxID == null ? 0 : SysSession.CurrentEnvironment.CashBoxID;
        }
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefBox", "GetAllRec"),
            data: { compCode: compcode, CashBoxID: CashBoxID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    //debugger
                    Details_Type_D_CashBox = result.Response;
                    DisplayStCashBox();
                }
            }
        });
    }
    function DisplayStCashBox() {
        var box = Details_Type_D_CashBox.filter(function (x) { return x.BranchCode == BranchCode; });
        for (var i = 0; i < box.length; i++) {
            $('#txt_D_CashBox').append('<option value="' + box[i].CashBoxID + '">' + (lang == "ar" ? box[i].CashBox_DescA : box[i].CashBox_DescE) + '</option>');
        }
        for (var i = 0; i < Details_Type_D_CashBox.length; i++) {
            $('#txt_Receiving_Fund').append('<option value="' + Details_Type_D_CashBox[i].CashBoxID + '">' + (lang == "ar" ? Details_Type_D_CashBox[i].CashBox_DescA : Details_Type_D_CashBox[i].CashBox_DescE) + '</option>');
        }
        if (SysSession.CurrentEnvironment.UserType == 2 || SysSession.CurrentEnvironment.UserType == 3) {
            debugger;
            $('#txt_D_CashBox option[value="Null"]').remove();
            $('#txt_Receiving_Fund option[value="Null"]').remove();
            var box = Details_Type_D_CashBox.filter(function (x) { return x.CashBoxID == Number(txt_D_CashBox.value); });
            if (box.length > 0) {
                isExpense = box[0].IsRecPayAccount == null ? false : box[0].IsRecPayAccount;
            }
            else {
                isExpense = false;
            }
            //btnAdd.disabled = false;
        }
        else {
            $('#txt_D_CashBox').prop('selectedIndex', 0);
            $('#txt_Receiving_Fund').prop("value", "Null");
        }
    }
    function EnableControls() {
        //if (!SysSession.CurrentPrivileges.AddNew) return;
        $("#Div_control").removeClass("display_none");
        $('#btnSave').removeClass("display_none");
        $('#btnBack').removeClass("display_none");
        $('#btnUpdate').addClass("display_none");
        $('#txt_ReceiptNoteNew').prop("selectedIndex", 0);
        //$('#txt_ID_beneficiaryNew').prop("selectedIndex", 0);
        $('#txt_Receiving_Fund').prop("selectedIndex", 0);
        $('#txtCashTypeNew').prop("selectedIndex", 0);
        $('#txt_BankAcc_Code').prop("selectedIndex", 0);
        txt_CODE.value = "";
        txtDateNew.value = GetDate();
        txtDueDate.value = GetDate();
        txt_note.value = "";
        txt_VoucherNo.value = "";
        txt_Amount.value = "";
        txt_CashAmount.value = "";
        txt_ReceiptDesc.value = "";
        txt_CardAmount.value = "";
        txt_BenCode.value = "";
        txt_BenName.value = "";
        $('#txt_CheckNo').val("");
        $('#txt_TransferNo').val("");
        $('#txt_BankName').val("");
        $('#chkIsDeffered').val("");
        $('#txtCreatedBy').val("");
        $('#txtCreatedAt').val("");
        $('#txtUpdatedBy').val("");
        $('#txtUpdatedAt').val("");
        $('#txt_AmountCurrency').text("");
        $('#txt_Openbalance').val('0');
    }
    function Assign_Display() {
        //debugger
        custId = 0;
        vndid = 0;
        expid = 0;
        fromBoxid = 0;
        BankCode = 0;
        //var beneficiary = $("#txt_ID_beneficiary").val();
        var beneficiary = $("#txt_BenCodeH").val();
        Boxid = txt_D_CashBox.value;
        RecPayTypeId = txt_ReceiptNote.value;
        CashType = txtCashType.value == "null" ? 1001 : Number(txtCashType.value);
        DateFrom = DateFormatRep(txtDateFrom.value);
        DateTo = DateFormatRep(txtDateTo.value);
        Status = txt_Status.value;
        if (Boxid == "Null") {
            Boxid = 0;
        }
        if (RecPayTypeId == "Null") {
            RecPayTypeId = 0;
        }
        if (beneficiary == "") {
            beneficiary = 0;
        }
        /////////////////////////doniaH
        //if (Type_Receipt == "Customer") { custId = beneficiary; vndid = 0; BankCode = 0; expid = 0; fromBoxid = 0; }
        //else if (Type_Receipt == "Vendor") { custId = 0; vndid = beneficiary; BankCode = 0; expid = 0; fromBoxid = 0; }
        //else if (Type_Receipt == "BankCode") { custId = 0; vndid = 0; BankCode = beneficiary; expid = 0; fromBoxid = 0; }
        //else if (Type_Receipt == "Expense") { custId = 0; vndid = 0; BankCode = 0; expid = beneficiary; fromBoxid = 0; }
        //else if (Type_Receipt == "CashBox") { custId = 0; vndid = 0; BankCode = 0; expid = 0; fromBoxid = beneficiary; }
        if (RecPayTypeId == '1') {
            GlobalID = GlobalCustIDH;
            custId = beneficiary;
            vndid = 0;
            BankCode = 0;
            expid = 0;
            fromBoxid = 0;
        }
        else if (RecPayTypeId == '2') {
            GlobalID = PurchaserVndIdH;
            custId = 0;
            vndid = beneficiary;
            BankCode = 0;
            expid = 0;
            fromBoxid = 0;
        }
        else if (RecPayTypeId == '3') {
            GlobalID = GlobalBankIDH;
            custId = 0;
            vndid = 0;
            BankCode = beneficiary;
            expid = 0;
            fromBoxid = 0;
        }
        else if (RecPayTypeId == '4') {
            GlobalID = GlobalAccIDH;
            custId = 0;
            vndid = 0;
            BankCode = 0;
            expid = beneficiary;
            fromBoxid = 0;
        }
        else if (RecPayTypeId == '5') {
            GlobalID = GlobalBoxIDH;
            custId = 0;
            vndid = 0;
            BankCode = 0;
            expid = 0;
            fromBoxid = beneficiary;
        }
        //if (txt_ReceiptNote.value == "1") {
        //    GlobalID = GlobalCustIDH;
        //    //getAccountCustHById(Selecteditem[0].CustomerID.toString(), false);
        //}
        //else if (txt_ReceiptNote.value == "2") {
        //    GlobalID = PurchaserVndIdH;
        //    //getAccountVndHById(Selecteditem[0].VendorID.toString(), false);
        //}
        //else if (txt_ReceiptNote.value == "3") {
        //    GlobalID = GlobalBankIDH;
        //    //getAccountBankHById(Selecteditem[0].BankAcc_Code, true);
        //}
        //else if (txt_ReceiptNote.value == "4") {
        //    GlobalID = GlobalAccIDH;
        //    //getAccountAccHById(Selecteditem[0].Bef_Code.toString(), true);
        //}
        //else if (txt_ReceiptNote.value == "5") {
        //    GlobalID = GlobalBoxIDH;
        //    //getAccountBoxHById(Selecteditem[0].CashBoxID.toString(), false);
        //}
    }
    function Display() {
        Assign_Display();
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccTrReceipt", "GetBoxReceiveList"),
            data: {
                comp: compcode, GlobalID: GlobalID, IQ_TrType: IQ_TrType, Boxid: Boxid, Status: Status, RecPayTypeId: RecPayTypeId, FromDate: DateFrom, Todate: DateTo, custId: custId, vndid: vndid, expid: expid, BankCode: BankCode, fromBoxid: fromBoxid, CashType: CashType, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    Details = result.Response;
                    for (var i = 0; i < Details.length; i++) {
                        Details[i].TrDate = DateFormat(Details[i].TrDate);
                        if (Details[i].Status == 1) {
                            Details[i].Status_New = (lang == "ar" ? "معتمد" : "A certified");
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
    function _SearchBox_Change() {
        //  k////debugger;
        $("#ReportGrid").jsGrid("option", "pageIndex", 1);
        if (searchbutmemreport.value != "") {
            var search_1 = searchbutmemreport.value.toLowerCase();
            SearchDetails = Details.filter(function (x) { return x.TrNo.toString().search(search_1) >= 0 || x.Bef_DescA.toLowerCase().search(search_1) >= 0 || x.Bef_DescE.toLowerCase().search(search_1) >= 0; }); /*|| x.MOBILE.toLowerCase().search(search) >= 0*/
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
        $('#id_ReportGrid').removeClass("display_none");
        ReportGrid.OnRowDoubleClicked = DriverDoubleClick;
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
            { title: "الرقم", name: "ReceiptID", type: "text", width: "5%", visible: false },
            { title: res.App_InvoiceNum, name: "TrNo", type: "text", width: "8%" },
            { title: res.App_date, name: "TrDate", type: "text", width: "8%" },
            { title: res.App_Drainage_Type, name: (lang == "ar" ? "Type_DescA" : "Type_DescE"), type: "text", width: "20%" },
            { title: res.App_beneficiary_no, name: "Bef_Code", type: "text", width: "8%" },
            { title: res.App_beneficiary, name: (lang == "ar" ? "Bef_DescA" : "Bef_DescE"), type: "text", width: "15%" },
            { title: res.App_Amount, name: "Amount", type: "text", width: "8%" },
            { title: res.App_Cash, name: "CashAmount", type: "text", width: "8%" },
            { title: res.App_Card, name: "CardAmount", type: "text", width: "8%" },
            { title: res.App_Certified, name: "Status_New", type: "text", width: "8%" },
        ];
        ReportGrid.Bind();
    }
    function Assign() {
        debugger;
        Model = new A_RecPay_Tr_ReceiptNote();
        if (IsNew == true) {
            DocumentActions.AssignToModel(Model); //Insert Update
            Model.CashAmount = Number(txt_CashAmount.value);
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
            Model.ReceiptID = ReceiptID;
            Model.CashType = $('#txtCashTypeNew').val() == 'null' ? null : $('#txtCashTypeNew').val();
            Model.BankAcc_Code = $('#txt_BankAcc_Code').val() == 'null' ? null : $('#txt_BankAcc_Code').val();
            Model.CashBoxID = $('#txt_Receiving_Fund').val();
            Model.RecPayTypeId = $('#txt_ReceiptNoteNew').val();
            //var beneficiary = $("#txt_ID_beneficiaryNew").val();
            //if (Type_Receipt_New == "Customer") { custId = beneficiary; vndid = null; BankCode = 0; expid = null; fromBoxid = null; }
            //else if (Type_Receipt_New == "Vendor") { custId = null; vndid = beneficiary; BankCode = 0; expid = null; fromBoxid = null; }
            //else if (Type_Receipt_New == "BankCode") { custId = null; vndid = null; BankCode = beneficiary; expid = null; fromBoxid = null; }
            //else if (Type_Receipt_New == "Expense") { custId = null; vndid = null; BankCode = 0; expid = beneficiary; fromBoxid = null; }
            //else if (Type_Receipt_New == "CashBox") { custId = null; vndid = null; BankCode = 0; expid = null; fromBoxid = beneficiary; }
            debugger;
            /////////////////////////donia
            var beneficiary = $("#txt_BenCode").val();
            if (Type_Receipt_New == "1") {
                beneficiary = PurchaserCustId;
                custId = beneficiary;
                vndid = null;
                BankCode = null;
                expid = null;
                fromBoxid = null;
            }
            else if (Type_Receipt_New == "2") {
                beneficiary = PurchaserVndId;
                custId = null;
                vndid = beneficiary;
                BankCode = null;
                expid = null;
                fromBoxid = null;
            }
            else if (Type_Receipt_New == "3") {
                beneficiary = PurchaserBankId;
                custId = null;
                vndid = null;
                BankCode = beneficiary;
                expid = null;
                fromBoxid = null;
            }
            else if (Type_Receipt_New == "4") {
                beneficiary = PurchaserAccId;
                custId = null;
                vndid = null;
                BankCode = null;
                expid = beneficiary;
                fromBoxid = null;
            }
            else if (Type_Receipt_New == "5") {
                beneficiary = PurchaserBoxId;
                custId = null;
                vndid = null;
                BankCode = null;
                expid = null;
                fromBoxid = beneficiary;
            }
            debugger;
            Model.ExpenseID = expid;
            Model.CustomerID = custId;
            Model.VendorID = vndid;
            Model.BankAccountCode = "" + BankCode + "";
            Model.FromCashBoxID = fromBoxid;
            Model.TrType = IQ_TrType;
            Model.TrDateH = "1";
            Model.TrNo = 0;
            Model.VoucherNo = 0;
            Model.UpdatedAt = "";
            Model.IsDeffered = chkIsDeffered.checked;
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
            Model.ReceiptID = ReceiptID;
            Model.CashType = $('#txtCashTypeNew').val() == 'null' ? null : $('#txtCashTypeNew').val();
            Model.BankAcc_Code = $('#txt_BankAcc_Code').val() == 'null' ? null : $('#txt_BankAcc_Code').val();
            Model.CashBoxID = $('#txt_Receiving_Fund').val();
            Model.RecPayTypeId = $('#txt_ReceiptNoteNew').val();
            //var beneficiary = $("#txt_ID_beneficiaryNew").val();
            //if (Type_Receipt_New == "Customer") { custId = beneficiary; vndid = null; BankCode = 0; expid = null; fromBoxid = null; }
            //else if (Type_Receipt_New == "Vendor") { custId = null; vndid = beneficiary; BankCode = 0; expid = null; fromBoxid = null; }
            //else if (Type_Receipt_New == "BankCode") { custId = null; vndid = null; BankCode = beneficiary; expid = null; fromBoxid = null; }
            //else if (Type_Receipt_New == "Expense") { custId = null; vndid = null; BankCode = 0; expid = beneficiary; fromBoxid = null; }
            //else if (Type_Receipt_New == "CashBox") { custId = null; vndid = null; BankCode = 0; expid = null; fromBoxid = beneficiary; }
            debugger;
            var beneficiary = $("#txt_BenCode").val();
            if (Type_Receipt_New == "1") {
                beneficiary = PurchaserCustId;
                custId = beneficiary;
                vndid = null;
                BankCode = 0;
                expid = null;
                fromBoxid = null;
            }
            else if (Type_Receipt_New == "2") {
                beneficiary = PurchaserVndId;
                custId = null;
                vndid = beneficiary;
                BankCode = 0;
                expid = null;
                fromBoxid = null;
            }
            else if (Type_Receipt_New == "3") {
                beneficiary = PurchaserBankId;
                custId = null;
                vndid = null;
                BankCode = beneficiary;
                expid = null;
                fromBoxid = null;
            }
            else if (Type_Receipt_New == "4") {
                beneficiary = PurchaserAccId;
                custId = null;
                vndid = null;
                BankCode = 0;
                expid = beneficiary;
                fromBoxid = null;
            }
            else if (Type_Receipt_New == "5") {
                beneficiary = PurchaserBoxId;
                custId = null;
                vndid = null;
                BankCode = 0;
                expid = null;
                fromBoxid = beneficiary;
            }
            Model.ExpenseID = expid;
            Model.CustomerID = custId;
            Model.VendorID = vndid;
            Model.BankAccountCode = BankCode == null ? '' : BankCode.toString();
            Model.FromCashBoxID = fromBoxid;
            Model.TrType = IQ_TrType;
            Model.TrDateH = "1";
            Model.IsDeffered = chkIsDeffered.checked;
            debugger;
            Model.CashAmount = Number(txt_CashAmount.value);
            Model.CardAmount = Number(txt_CardAmount.value);
        }
        Model.BankName = '';
    }
    function Insert() {
        Assign();
        debugger;
        if (!CheckDate(DateFormat(txtDateNew.value).toString(), DateFormat(SysSession.CurrentEnvironment.StartDate).toString(), DateFormat(SysSession.CurrentEnvironment.EndDate).toString())) {
            //MessageBox.Show('  التاريخ ليس متطابق مع تاريخ المتاح (' + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ')', '');
            WorningMessage("  التاريخ ليس متطابق مع تاريخ المتاح (" + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ")", "Date does not match available date(" + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ")", "تحذير", "worning");
            return;
        }
        if (Model.CashBoxID == 0 || Model.CashBoxID == null) {
            txt_D_CashBox.selectedIndex = 1;
            Model.CashBoxID = Number(txt_D_CashBox.value);
        }
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("AccTrReceipt", "Insert"),
            data: JSON.stringify(Model),
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    var res = void 0;
                    res = result.Response;
                    ReceiptID = res.ReceiptID;
                    DisplayMassage("تم الحفظ بنجاح", "Success", MessageType.Succeed);
                    Valid = 0;
                    Update_claenData = 0;
                    Display();
                    IsSuccess();
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
        console.log(Model);
        if (Model.CashBoxID == 0 || Model.CashBoxID == null) {
            txt_D_CashBox.selectedIndex = 1;
            Model.CashBoxID = Number(txt_D_CashBox.value);
        }
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("AccTrReceipt", "Update"),
            data: JSON.stringify(Model),
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    DisplayMassage("تم الحفظ بنجاح", "Success", MessageType.Succeed);
                    Update_claenData = 0;
                    Display();
                    DriverDoubleClick();
                    $("#txtUpdatedBy").val(SysSession.CurrentEnvironment.UserCode);
                    $("#txtUpdatedAt").val(DateTimeFormat(Date().toString()));
                    Save_Succ_But();
                }
                else {
                    DisplayMassage("خطأء", "Error", MessageType.Error);
                    Update_claenData = 0;
                }
            }
        });
    }
    function IsSuccess() {
        IsNew = false;
        debugger;
        AddDisabled();
        Update_claenData = 1;
        Selecteditem = Details.filter(function (x) { return x.ReceiptID == Number(ReceiptID); });
        debugger;
        DisplayAddStkGCodes();
        DisplayData(Selecteditem);
        Update_claenData = 0;
        reference_Page();
        $('#btnUpdate').removeClass("display_none");
        $('#btnSave').addClass("display_none");
        $('#btnBack').addClass("display_none");
        $('#btnUpdate').removeAttr("disabled");
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
        $("#Div_control").removeClass("display_none");
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
        var RecType;
        var BoxId;
        var BnfID;
        var BnfDesc;
        var status;
        if (txt_ReceiptNote.selectedIndex > 0)
            RecType = Number($("#txt_ReceiptNote").val());
        else
            RecType = -1;
        if (txt_D_CashBox.selectedIndex > 0)
            BoxId = Number($("#txt_D_CashBox").val());
        else
            BoxId = -1;
        //////////////////////////////////////doniaH
        //if (txt_ID_beneficiary.selectedIndex > 0) {
        //    BnfID = Number($("#txt_ID_beneficiary").val());
        //    BnfDesc = txt_ID_beneficiary.value;
        //}
        if (txt_BenCodeH.value == "") {
            BnfID = Number($("#txt_BenCodeH").val());
            BnfDesc = txt_BenNameH.value;
        }
        else {
            BnfID = "";
            BnfDesc = "";
        }
        if (txt_Status.selectedIndex > 0)
            status = Number($("#txt_Status").val());
        else if ($('#txtCashType').val() == "null") {
            rp.CashType = -1;
        }
        else {
            rp.CashType = $('#txtCashType').val();
        }
        status = 2;
        rp.BoxId = BoxId;
        rp.TrType = 2;
        rp.RecType = RecType;
        rp.BnfID = BnfID;
        rp.BnfDesc = BnfDesc;
        rp.Status = status;
        Ajax.Callsync({
            url: Url.Action("IProc_Rpt_AccReceiptList", "GeneralReports"),
            data: rp,
            success: function (d) {
                var result = d.result;
                window.open(result, "_blank");
            }
        });
    }
    AccTrPaymentNote.PrintReport = PrintReport;
    function PrintTransaction() {
        if (!SysSession.CurrentPrivileges.PrintOut)
            return;
        var rp = new ReportParameters();
        rp.Type = 0;
        rp.Repdesign = 2;
        rp.TRId = ReceiptID;
        rp.Name_function = "rptReceiptNote";
        localStorage.setItem("Report_Data", JSON.stringify(rp));
        localStorage.setItem("result", '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>');
        window.open(Url.Action("ReportsPopup", "Home"), "_blank");
    }
    ///////////////////////////////////////donia
    ////////////////////////////////////////////////Display Vendors///////////////////////////
    function btnBenVnd_onclick() {
        sys.FindKey(Modules.AccTrPaymentNote, "btnVndSrch", "CompCode= " + compcode + "and IsCreditVendor = 1 and Isactive = 1", function () {
            var id = SearchGrid.SearchDataGrid.SelectedKey;
            PurchaserVndId = id;
            getAccountVndById(id, false);
        });
    }
    function getAccountVndById(custId, code) {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefVendor", "GetVendorByvndId_code"),
            data: { Compcode: compcode, code: code, VendorID: custId, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    AccountVndDetails = result.Response;
                    if (AccountVndDetails.length == 0) {
                        BenID = 0;
                        $('#txt_BenCode').val("");
                        $('#txt_BenName').val("");
                        $('#txt_Openbalance').val("");
                        Errorinput(txt_BenCode);
                        DisplayMassage("كود المورد غير صحيح", "Wrong Customer code", MessageType.Error);
                    }
                    else {
                        if (IsNew == true && AccountVndDetails[0].Isactive == true) {
                            BenID = AccountVndDetails[0].VendorID;
                            $('#txt_BenCode').val(AccountVndDetails[0].VendorCode);
                            $('#txt_BenName').val(AccountVndDetails[0].NAMEA);
                            $('#txt_Openbalance').val(AccountVndDetails[0].Openbalance);
                            GLOBALopenbalance = AccountVndDetails[0].Openbalance;
                            PurchaserVndId = AccountVndDetails[0].VendorID;
                        }
                        else if (IsNew == false && IsEdite == false) {
                            BenID = AccountVndDetails[0].VendorID;
                            $('#txt_BenCode').val(AccountVndDetails[0].VendorCode);
                            $('#txt_BenName').val(AccountVndDetails[0].NAMEA);
                            $('#txt_Openbalance').val(AccountVndDetails[0].Openbalance);
                            GLOBALopenbalance = AccountVndDetails[0].Openbalance;
                            PurchaserVndId = AccountVndDetails[0].VendorID;
                        }
                        else if ((IsNew == false && IsEdite == true && AccountVndDetails[0].Isactive == true)) {
                            BenID = AccountVndDetails[0].VendorID;
                            $('#txt_BenCode').val(AccountVndDetails[0].VendorCode);
                            $('#txt_BenName').val(AccountVndDetails[0].NAMEA);
                            $('#txt_Openbalance').val(AccountVndDetails[0].Openbalance);
                            GLOBALopenbalance = AccountVndDetails[0].Openbalance;
                            PurchaserVndId = AccountVndDetails[0].VendorID;
                        }
                        else {
                            BenID = 0;
                            $('#txt_BenCode').val("");
                            $('#txt_BenName').val("");
                            $('#txt_Openbalance').val("");
                            Errorinput(txt_BenCode);
                            DisplayMassage("كود المورد غير صحيح", "Wrong Customer code", MessageType.Error);
                        }
                    }
                }
            }
        });
    }
    function txt_BenVndCode_onchange() {
        txt_BenName.value = "";
        getAccountVndById(txt_BenCode.value, true);
    }
    function btnBenVndH_onclick() {
        sys.FindKey(Modules.AccTrPaymentNote, "btnVndSrch", "CompCode= " + compcode + "and IsCreditVendor = 1", function () {
            var id = SearchGrid.SearchDataGrid.SelectedKey;
            PurchaserVndIdH = id;
            getAccountVndHById(id, false);
        });
    }
    function getAccountVndHById(custId, code) {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefVendor", "GetVendorByvndId_code"),
            data: { Compcode: compcode, code: code, VendorID: custId, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    AccountVndDetails = result.Response;
                    if (AccountVndDetails.length == 0) {
                        $('#txt_BenCodeH').val("");
                        $('#txt_BenNameH').val("");
                        DisplayMassage("كود المورد غير صحيح", "Wrong Customer code", MessageType.Error);
                    }
                    else {
                        $('#txt_BenCodeH').val(AccountVndDetails[0].VendorCode);
                        $('#txt_BenNameH').val(AccountVndDetails[0].NAMEA);
                        PurchaserVndId = AccountVndDetails[0].VendorID;
                        ;
                    }
                }
            }
        });
    }
    function txt_BenVndCodeH_onchange() {
        txt_BenNameH.value = "";
        getAccountVndHById(txt_BenCodeH.value, true);
    }
    ////////////////////////////////////////////////Display Customers///////////////////////////
    function btnBenCust_onclick() {
        var cond = "and Isactive = 1";
        if (SysSession.CurrentEnvironment.I_Control[0].IsLocalBranchCustomer == true) {
            cond = cond + " and BranchCode=" + BranchCode;
        }
        sys.FindKey(Modules.AccTrPaymentNote, "btnCustSrch", "CompCode= " + compcode + "" + cond, function () {
            var id = SearchGrid.SearchDataGrid.SelectedKey;
            debugger;
            getAccountCustById(id, false);
        });
    }
    function getAccountCustById(custId, code) {
        debugger;
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefCustomer", "GetCustomerByCustomerId_code"),
            data: { Compcode: compcode, BranchCode: BranchCode, code: code, CustomerId: custId, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    AccountVendorDetails = result.Response;
                    debugger;
                    if (AccountVendorDetails.length == 0) {
                        BenID = 0;
                        $('#txt_BenCode').val("");
                        $('#txt_BenName').val("");
                        $('#txt_Openbalance').val("");
                        Errorinput(txt_BenCode);
                        DisplayMassage("كود العميل غير صحيح", "Wrong Customer code", MessageType.Error);
                    }
                    else {
                        if (IsNew == true && AccountVendorDetails[0].Isactive == true) {
                            BenID = AccountVendorDetails[0].CustomerId;
                            $('#txt_BenCode').val(AccountVendorDetails[0].CustomerCODE);
                            $('#txt_BenName').val(AccountVendorDetails[0].NAMEA);
                            $('#txt_Openbalance').val(AccountVendorDetails[0].Balance);
                            GLOBALopenbalance = AccountVendorDetails[0].Balance;
                            PurchaserCustId = AccountVendorDetails[0].CustomerId;
                        }
                        else if (IsNew == false && IsEdite == false) {
                            BenID = AccountVendorDetails[0].CustomerId;
                            $('#txt_BenCode').val(AccountVendorDetails[0].CustomerCODE);
                            $('#txt_BenName').val(AccountVendorDetails[0].NAMEA);
                            $('#txt_Openbalance').val(AccountVendorDetails[0].Balance);
                            GLOBALopenbalance = AccountVendorDetails[0].Balance;
                            PurchaserCustId = AccountVendorDetails[0].CustomerId;
                        }
                        else if (IsNew == false && IsEdite == true && AccountVendorDetails[0].Isactive == true) {
                            BenID = AccountVendorDetails[0].CustomerId;
                            $('#txt_BenCode').val(AccountVendorDetails[0].CustomerCODE);
                            $('#txt_BenName').val(AccountVendorDetails[0].NAMEA);
                            $('#txt_Openbalance').val(AccountVendorDetails[0].Balance);
                            GLOBALopenbalance = AccountVendorDetails[0].Balance;
                            PurchaserCustId = AccountVendorDetails[0].CustomerId;
                        }
                        else {
                            BenID = 0;
                            $('#txt_BenCode').val("");
                            $('#txt_BenName').val("");
                            $('#txt_Openbalance').val("");
                            Errorinput(txt_BenCode);
                            DisplayMassage("كود العميل غير صحيح", "Wrong Customer code", MessageType.Error);
                        }
                    }
                }
            }
        });
    }
    function txt_BenCustCode_onchange() {
        getAccountCustById(txt_BenCode.value, true);
    }
    function btnBenCustH_onclick() {
        var cond = "";
        if (SysSession.CurrentEnvironment.I_Control[0].IsLocalBranchCustomer == true) {
            cond = cond + " and BranchCode=" + BranchCode;
        }
        sys.FindKey(Modules.AccTrPaymentNote, "btnCustSrch", "CompCode= " + compcode + "" + cond, function () {
            var id = SearchGrid.SearchDataGrid.SelectedKey;
            debugger;
            getAccountCustHById(id, false);
        });
    }
    function getAccountCustHById(custId, code) {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefCustomer", "GetCustomerByCustomerId_code"),
            data: { Compcode: compcode, BranchCode: BranchCode, code: code, CustomerId: custId, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    AccountVendorDetails = result.Response;
                    if (AccountVendorDetails.length == 0) {
                        BenID = 0;
                        $('#txt_BenCodeH').val("");
                        $('#txt_BenNameH').val("");
                        Errorinput(txt_BenCodeH);
                        DisplayMassage("كود العميل غير صحيح", "Wrong Customer code", MessageType.Error);
                    }
                    else {
                        BenID = AccountVendorDetails[0].CustomerId;
                        $('#txt_BenCodeH').val(AccountVendorDetails[0].CustomerCODE);
                        $('#txt_BenNameH').val(AccountVendorDetails[0].NAMEA);
                        PurchaserCustId = AccountVendorDetails[0].CustomerId;
                    }
                }
            }
        });
    }
    function txt_BenCustCodeH_onchange() {
        getAccountCustHById(txt_BenCodeH.value, true);
    }
    ////////////////////////////////////////////////Display Bank///////////////////////////
    function btnBenBank_onclick() {
        sys.FindKey(Modules.AccTrPaymentNote, "btnbankSearch", "COMP_CODE= " + compcode + "and ACC_TYPE = 3 and ACC_ACTIVE = 1", function () {
            var id = SearchGrid.SearchDataGrid.SelectedKey;
            getAccountBankById(id, true);
        });
    }
    function getAccountBankById(custId, code) {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GLDefAccount", "GetByAccCode"),
            data: { CompCode: compcode, AccCode: custId, AccType: 3, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    AccountBankDetails = result.Response;
                    if (AccountBankDetails[0].ACC_CODE == "") {
                        BenID = 0;
                        $('#txt_BenCode').val("");
                        $('#txt_BenName').val("");
                        $('#txt_Openbalance').val("");
                        Errorinput(txt_BenCode);
                        DisplayMassage("كود البنك غير صحيح", "Wrong Bank code", MessageType.Error);
                    }
                    else {
                        debugger;
                        if (IsNew == true && AccountBankDetails[0].ACC_ACTIVE == true) {
                            BenID = AccountBankDetails[0].ACC_CODE;
                            txt_BenCode.value = AccountBankDetails[0].ACC_CODE;
                            txt_BenName.value = AccountBankDetails[0].ACC_DESCA;
                            PurchaserBankId = AccountBankDetails[0].ACC_CODE;
                        }
                        else if (IsNew == false && IsEdite == false) {
                            BenID = AccountBankDetails[0].ACC_CODE;
                            txt_BenCode.value = AccountBankDetails[0].ACC_CODE;
                            txt_BenName.value = AccountBankDetails[0].ACC_DESCA;
                            PurchaserBankId = AccountBankDetails[0].ACC_CODE;
                        }
                        else if (IsNew == false && IsEdite == true && AccountBankDetails[0].ACC_ACTIVE == true) {
                            BenID = AccountBankDetails[0].ACC_CODE;
                            txt_BenCode.value = AccountBankDetails[0].ACC_CODE;
                            txt_BenName.value = AccountBankDetails[0].ACC_DESCA;
                            PurchaserBankId = AccountBankDetails[0].ACC_CODE;
                        }
                        else {
                            BenID = 0;
                            $('#txt_BenCode').val("");
                            $('#txt_BenName').val("");
                            $('#txt_Openbalance').val("");
                            Errorinput(txt_BenCode);
                            DisplayMassage("كود البنك غير صحيح", "Wrong Bank code", MessageType.Error);
                        }
                    }
                }
            }
        });
    }
    function txt_BenBankCode_onchange() {
        getAccountBankById(txt_BenCode.value, true);
    }
    function btnBenBankH_onclick() {
        sys.FindKey(Modules.AccTrPaymentNote, "btnbankSearch", "COMP_CODE= " + compcode + "and ACC_TYPE = 3 and ACC_ACTIVE = 1", function () {
            var id = SearchGrid.SearchDataGrid.SelectedKey;
            GlobalBankIDH = id;
            getAccountBankHById(id, true);
        });
    }
    function getAccountBankHById(custId, code) {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GLDefAccount", "GetByAccCode"),
            data: { CompCode: compcode, AccCode: custId, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    AccountBankDetails = result.Response;
                    if (AccountBankDetails.ACC_CODE == "") {
                        $('#txt_BenCodeH').val("");
                        $('#txt_BenNameH').val("");
                        Errorinput(txt_BenCodeH);
                        DisplayMassage("كود البنك غير صحيح", "Wrong Bank code", MessageType.Error);
                    }
                    else {
                        txt_BenCodeH.value = AccountBankDetails.ACC_CODE;
                        txt_BenNameH.value = AccountBankDetails.ACC_DESCA;
                        PurchaserBankId = AccountBankDetails.ACC_CODE;
                    }
                }
            }
        });
    }
    function txt_BenBankCodeH_onchange() {
        getAccountBankHById(txt_BenCodeH.value, true);
    }
    ////////////////////////////////////////////////Display Account///////////////////////////
    function btnBenAcc_onclick() {
        sys.FindKey(Modules.AccTrPaymentNote, "btnAccBen", "CompCode= " + compcode + " and TrType = 2 ", function () {
            var id = SearchGrid.SearchDataGrid.SelectedKey;
            getAccountAccById(id, false);
        });
    }
    function getAccountAccById(custId, code) {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefAccounts", "GetByCode_and_byidPay"),
            data: { CompCode: compcode, id: custId, code: code, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    AccountAccDetails = result.Response;
                    if (AccountAccDetails.length == 0) {
                        BenID = 0;
                        $('#txt_BenCode').val("");
                        $('#txt_BenName').val("");
                        $('#txt_Openbalance').val("");
                        Errorinput(txt_BenCode);
                        DisplayMassage("كود البنك غير صحيح", "Wrong Bank code", MessageType.Error);
                    }
                    else {
                        BenID = AccountAccDetails[0].ExpenseID;
                        $('#txt_BenCode').val(AccountAccDetails[0].ExpCode);
                        $('#txt_BenName').val(AccountAccDetails[0].ExpDescA);
                        $('#txt_Openbalance').val("0");
                        PurchaserAccId = AccountAccDetails[0].ExpenseID;
                    }
                }
            }
        });
    }
    function BenAccCode_onchange() {
        getAccountAccById(txt_BenCode.value, true);
    }
    function btnBenAccH_onclick() {
        sys.FindKey(Modules.AccTrPaymentNote, "btnAccBen", "CompCode= " + compcode + " and TrType = 2 ", function () {
            var id = SearchGrid.SearchDataGrid.SelectedKey;
            GlobalAccIDH = id;
            getAccountAccHById(id, false);
        });
    }
    function getAccountAccHById(custId, code) {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefAccounts", "GetByCode_and_byidPay"),
            data: { CompCode: compcode, id: custId, code: code, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    AccountAccDetails = result.Response;
                    if (AccountAccDetails.length == 0) {
                        $('#txt_BenCodeH').val("");
                        $('#txt_BenNameH').val("");
                        Errorinput(txt_BenCodeH);
                        DisplayMassage("كود البنك غير صحيح", "Wrong Bank code", MessageType.Error);
                    }
                    else {
                        $('#txt_BenCodeH').val(AccountAccDetails[0].ExpCode);
                        $('#txt_BenNameH').val(AccountAccDetails[0].ExpDescA);
                        ;
                        PurchaserAccId = AccountAccDetails[0].ExpenseID;
                    }
                }
            }
        });
    }
    function BenAccCodeH_onchange() {
        getAccountAccHById(txt_BenCodeH.value, true);
    }
    ////////////////////////////////////////////////Display Box///////////////////////////
    function btnBenBox_onclick() {
        sys.FindKey(Modules.AccTrPaymentNote, "btnBoxSearch", "CompCode= " + compcode + " and IsActive = 1", function () {
            var id = SearchGrid.SearchDataGrid.SelectedKey;
            getAccountBoxById(id, false);
        });
    }
    function getAccountBoxById(custId, code) {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefBox", "GetByIdpaynote"),
            data: { code: code, compCode: compcode, BranchCode: BranchCode, CashBoxID: custId, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    AccountBoxDetails = result.Response;
                    if (AccountBoxDetails.length == 0) {
                        BenID = 0;
                        $('#txt_BenCode').val("");
                        $('#txt_BenName').val("");
                        $('#txt_Openbalance').val("");
                        Errorinput(txt_BenCode);
                        DisplayMassage("كود الصندوق غير صحيح", "Wrong CashBox code", MessageType.Error);
                    }
                    else {
                        if (IsNew == true && AccountBoxDetails[0].IsActive == true) {
                            BenID = AccountBoxDetails[0].CashBoxID;
                            $('#txt_BenCode').val(AccountBoxDetails[0].CashBoxID);
                            $('#txt_BenName').val(AccountBoxDetails[0].CashBox_DescA);
                            $('#txt_Openbalance').val("0");
                            PurchaserBoxId = AccountBoxDetails[0].CashBoxID;
                        }
                        else if (IsNew == false && IsEdite == false) {
                            BenID = AccountBoxDetails[0].CashBoxID;
                            $('#txt_BenCode').val(AccountBoxDetails[0].CashBoxID);
                            $('#txt_BenName').val(AccountBoxDetails[0].CashBox_DescA);
                            $('#txt_Openbalance').val("0");
                            PurchaserBoxId = AccountBoxDetails[0].CashBoxID;
                        }
                        else if (IsNew == false && IsEdite == true && AccountBoxDetails[0].IsActive == true) {
                            BenID = AccountBoxDetails[0].CashBoxID;
                            $('#txt_BenCode').val(AccountBoxDetails[0].CashBoxID);
                            $('#txt_BenName').val(AccountBoxDetails[0].CashBox_DescA);
                            $('#txt_Openbalance').val("0");
                            PurchaserBoxId = AccountBoxDetails[0].CashBoxID;
                        }
                        else {
                            BenID = 0;
                            $('#txt_BenCode').val("");
                            $('#txt_BenName').val("");
                            $('#txt_Openbalance').val("");
                            Errorinput(txt_BenCode);
                            DisplayMassage("كود الصندوق غير صحيح", "Wrong CashBox code", MessageType.Error);
                        }
                    }
                }
            }
        });
    }
    function txt_BenBoxCode_onchange() {
        getAccountBoxById(txt_BenCode.value, true);
    }
    function btnBenBoxH_onclick() {
        sys.FindKey(Modules.AccTrPaymentNote, "btnBoxSearch", "CompCode= " + compcode + "", function () {
            var id = SearchGrid.SearchDataGrid.SelectedKey;
            GlobalBoxIDH = id;
            getAccountBoxHById(id, false);
        });
    }
    function getAccountBoxHById(custId, code) {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefBox", "GetById"),
            data: { code: code, compCode: compcode, BranchCode: BranchCode, CashBoxID: custId, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    AccountBoxDetails = result.Response;
                    if (AccountBoxDetails.length == 0) {
                        $('#txt_BenCodeH').val("");
                        $('#txt_BenNameH').val("");
                        Errorinput(txt_BenCodeH);
                        DisplayMassage("كود الصندوق غير صحيح", "Wrong CashBox code", MessageType.Error);
                    }
                    else {
                        $('#txt_BenCodeH').val(AccountBoxDetails[0].CashBoxID);
                        $('#txt_BenNameH').val(AccountBoxDetails[0].CashBox_DescA);
                        PurchaserBoxId = AccountBoxDetails[0].CashBoxID;
                    }
                }
            }
        });
    }
    function txt_BenBoxCodeH_onchange() {
        getAccountBoxHById(txt_BenCodeH.value, true);
    }
    ////////////////////////////////////////////////BtnBenOnClick///////////////////////////
    function btnBen_onclick() {
        if (txt_ReceiptNoteNew.value == "1") {
            btnBenCust_onclick();
        }
        if (txt_ReceiptNoteNew.value == "2") {
            btnBenVnd_onclick();
        }
        if (txt_ReceiptNoteNew.value == "3") {
            btnBenBank_onclick();
        }
        if (txt_ReceiptNoteNew.value == "4") {
            btnBenAcc_onclick();
        }
        if (txt_ReceiptNoteNew.value == "5") {
            btnBenBox_onclick();
        }
    }
    function txt_BenCode_onchange() {
        if (txt_ReceiptNoteNew.value == "1") {
            txt_BenCustCode_onchange();
        }
        if (txt_ReceiptNoteNew.value == "2") {
            txt_BenVndCode_onchange();
        }
        if (txt_ReceiptNoteNew.value == "3") {
            txt_BenBankCode_onchange();
        }
        if (txt_ReceiptNoteNew.value == "4") {
            BenAccCode_onchange();
        }
        if (txt_ReceiptNoteNew.value == "5") {
            txt_BenBoxCode_onchange();
        }
    }
    function btnBenH_onclick() {
        if (txt_ReceiptNote.value == "Null") {
            Errorinput(txt_ReceiptNoteNew);
            DisplayMassage("اختر نوع الصرف", "choose ReceiptNote", MessageType.Error);
        }
        if (txt_ReceiptNote.value == "1") {
            btnBenCustH_onclick();
        }
        if (txt_ReceiptNote.value == "2") {
            btnBenVndH_onclick();
        }
        if (txt_ReceiptNote.value == "3") {
            btnBenBankH_onclick();
        }
        if (txt_ReceiptNote.value == "4") {
            btnBenAccH_onclick();
        }
        if (txt_ReceiptNote.value == "5") {
            btnBenBoxH_onclick();
        }
    }
    function txt_BenCodeH_onchange() {
        if (txt_ReceiptNote.value == "Null") {
            txt_BenCodeH.value = "";
            Errorinput(txt_ReceiptNoteNew);
            DisplayMassage("اختر نوع الصرف", "choose ReceiptNote", MessageType.Error);
        }
        if (txt_ReceiptNote.value == "1") {
            txt_BenCustCodeH_onchange();
        }
        if (txt_ReceiptNote.value == "2") {
            txt_BenVndCodeH_onchange();
        }
        if (txt_ReceiptNote.value == "3") {
            txt_BenBankCodeH_onchange();
        }
        if (txt_ReceiptNote.value == "4") {
            BenAccCodeH_onchange();
        }
        if (txt_ReceiptNote.value == "5") {
            txt_BenBoxCodeH_onchange();
        }
    }
    function Amount_onchange() {
        debugger;
        var Currency = sys.SysSession.CurrentEnvironment.I_Control[0].Currencyid;
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccTrReceipt", "TafkeetArab"),
            data: {
                Currency: Number(Currency), Amount: Number(txt_Amount.value), lang: lang
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    var Currency_ = result.Response;
                    $("#txt_AmountCurrency").text((lang == "ar" ? "المبلغ كتابةً " : "Amount in writing ") + " ( " + Currency_ + " ) ");
                }
            }
        });
    }
    function btnPrintsFrom_To_onclick() {
        btnShow_onclick();
        if (custId == 0) {
            custId = null;
        }
        if (vndid == 0) {
            vndid = null;
        }
        if (BankCode == 0) {
            BankCode = null;
        }
        if (expid == 0) {
            expid = null;
        }
        if (fromBoxid == 0) {
            fromBoxid = null;
        }
        if (Boxid == 0) {
            Boxid = null;
        }
        if (RecPayTypeId == 0) {
            RecPayTypeId = null;
        }
        if (CashType == 1001) {
            CashType = null;
        }
        if (Status == "All") {
            Status = null;
        }
        try {
            var Name_ID = 'ReceiptID';
            var NameTable = 'IQ_GetBoxReceiveList';
            var Condation1 = "  TrType=" + IQ_TrType + " and CompCode = " + compcode + " and BranchCode =" + BranchCode + " " +
                " and TrDate >=' " + DateFrom + "' and TrDate <= ' " + DateTo + " ' ";
            var Condation2 = " ";
            if (CashType != null)
                Condation2 = Condation2 + " and CashType=" + CashType;
            if (Boxid != null)
                Condation2 = Condation2 + " and CashBoxID=" + Boxid;
            if (RecPayTypeId != null)
                Condation2 = Condation2 + " and RecPayTypeId=" + RecPayTypeId;
            if (GlobalID != 0) {
                if (RecPayTypeId == 1) {
                    Condation2 = Condation2 + " and CustomerID =" + GlobalID;
                }
                else if (RecPayTypeId == 2) {
                    Condation2 = Condation2 + " and VendorID =" + GlobalID;
                }
                else if (RecPayTypeId == 3) {
                    Condation2 = Condation2 + " and BankAccountCode ='" + GlobalID + "'";
                }
                else if (RecPayTypeId == 4) {
                    Condation2 = Condation2 + " and ExpenseID =" + GlobalID;
                }
                else if (RecPayTypeId == 5) {
                    Condation2 = Condation2 + " and FromCashBoxID =" + GlobalID;
                }
            }
            if (Status != null)
                Condation2 = Condation2 + " and Status=" + Status;
            if (custId != null)
                Condation2 = Condation2 + " and CustomerID=" + GlobalID;
            if (vndid != null)
                Condation2 = Condation2 + " and VendorID=" + GlobalID;
            if (BankCode != null)
                Condation2 = Condation2 + " and BankAccountCode='" + GlobalID + "'";
            if (expid != null)
                Condation2 = Condation2 + " and ExpenseID=" + GlobalID;
            if (fromBoxid != null)
                Condation2 = Condation2 + " and FromCashBoxID=" + GlobalID;
            ///////////
            var Condation3 = Condation1 + Condation2 + " ORDER BY TrNo ASC;";
            PrintsFrom_To(TransType.AccPayment, Name_ID, NameTable, Condation3, Details.length);
        }
        catch (e) {
            return;
        }
    }
})(AccTrPaymentNote || (AccTrPaymentNote = {}));
//# sourceMappingURL=AccTrPaymentNote.js.map