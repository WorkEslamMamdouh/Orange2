
$(document).ready(() => {
    AccTrReceiptNote.InitalizeComponent();
})

namespace AccTrReceiptNote {

    var IQ_TrType = 1;
    var AccType = 2;
    var TrType = 1;
    var codeType = "RecType";
    var Details: Array<IQ_GetBoxReceiveList> = new Array<IQ_GetBoxReceiveList>();
    var BilldIData: Array<IQ_GetBoxReceiveList> = new Array<IQ_GetBoxReceiveList>();
    var ReportGrid: JsGrid = new JsGrid();
    var Details_Type_D_CashBox: Array<A_RecPay_D_CashBox> = new Array<A_RecPay_D_CashBox>();
    var Details_GCodes: Array<G_Codes> = new Array<G_Codes>();
    var Details_GCodes_ChckType: Array<G_Codes> = new Array<G_Codes>();
    var Model: A_RecPay_Tr_ReceiptNote = new A_RecPay_Tr_ReceiptNote();

    var CashDetailsAr: Array<string> = new Array<string>();
    var CashDetailsEn: Array<string> = new Array<string>();

    var Details_Customer: Array<A_Rec_D_Customer> = new Array<A_Rec_D_Customer>();
    var Details_Vendor: Array<A_Pay_D_Vendor> = new Array<A_Pay_D_Vendor>();
    var Details_ACCOUNT: Array<A_ACCOUNT> = new Array<A_ACCOUNT>();
    var Details_Pay_D_Accounts: Array<A_RecPay_D_Accounts> = new Array<A_RecPay_D_Accounts>();
    var Details_Acount: Array<A_ACCOUNT> = new Array<A_ACCOUNT>();

    var sys: SystemTools = new SystemTools();
    var SysSession: SystemSession = GetSystemSession(Modules.AccTrReceiptNote);
    var CashAmount = 0;
    var txt_ReceiptNote: HTMLSelectElement;
    var txt_Status: HTMLSelectElement;
    var txt_ReceiptNoteNew: HTMLSelectElement;
    //var txt_ID_beneficiary: HTMLSelectElement;
    // var txt_ID_beneficiaryNew: HTMLSelectElement;
    var txtDateNew: HTMLInputElement;
    var txtDueDate: HTMLInputElement;
    var txtDateFrom: HTMLInputElement;
    var txtDateTo: HTMLInputElement;
    var txt_D_CashBox: HTMLSelectElement;
    var txt_Receiving_Fund: HTMLSelectElement;
    var txt_BankAcc_Code: HTMLSelectElement;
    var txtCashType: HTMLSelectElement;
    var txtCashTypeNew: HTMLSelectElement;
    var txt_CODE: HTMLInputElement;
    var txt_note: HTMLInputElement;
    var searchbutmemreport: HTMLInputElement;
    var txt_VoucherNo: HTMLInputElement;
    var txt_Amount: HTMLInputElement;
    var txt_CashAmount: HTMLInputElement;
    var txt_CardAmount: HTMLInputElement;
    var txt_ReceiptDesc: HTMLInputElement;

    var btnBack: HTMLButtonElement;
    var btnShow: HTMLButtonElement;
    var btnAdd: HTMLButtonElement;
    var btnUpdate: HTMLButtonElement;
    var btnSave: HTMLButtonElement;
    var chkActive: HTMLInputElement;
    var chkIsDeffered: HTMLInputElement;

    ////////////////////////////////////////////donia 
    var btnBen: HTMLButtonElement;
    var txt_BenCode: HTMLInputElement;
    var txt_BenName: HTMLInputElement;

    var btnBenH: HTMLButtonElement;
    var txt_BenCodeH: HTMLInputElement;
    var txt_BenNameH: HTMLInputElement;
    var GlobalID = 0;
    var GlobalCustIDH = 0;
    var PurchaserVndIdH = 0;
    var GlobalBankIDH = 0;
    var GlobalAccIDH = 0;
    var GlobalBoxIDH = 0;
    var IsEdite: boolean = false; 
    ////////////////////////////////////////////Vendors////////////////////////////////////////
    var PurchaserVndId;
    var VndIdfilter;
    var GLOBALopenbalance;
    var AccountVndDetails: Array<A_Pay_D_Vendor> = new Array<A_Pay_D_Vendor>();
    var BenVndDetails: Array<A_Pay_D_Vendor> = new Array<A_Pay_D_Vendor>(); 
    //////////////////////////////////////////Customers/////////////////////////////////////////
    var AccountVendorDetails: Array<IQ_GetCustomer> = new Array<IQ_GetCustomer>();
    var VendorDetails: Array<A_Rec_D_Customer> = new Array<A_Rec_D_Customer>();
    var PurchaserCustId;
    var custIdfilter; 
    //////////////////////////////////////////Bank/////////////////////////////////////////
    var AccountBankDetails: A_ACCOUNT = new A_ACCOUNT;
    var BankDetails: Array<A_ACCOUNT> = new Array<A_ACCOUNT>();
    var PurchaserBankId;
    var BankIdfilter; 
    //////////////////////////////////////////Account/////////////////////////////////////////
    var AccountAccDetails: Array<A_RecPay_D_Accounts> = new Array<A_RecPay_D_Accounts>();
    var AccDetails: Array<A_RecPay_D_Accounts> = new Array<A_RecPay_D_Accounts>();
    var PurchaserAccId;
    var AccIdfilter; 
    //////////////////////////////////////////Account/////////////////////////////////////////
    var AccountBoxDetails: Array<A_RecPay_D_CashBox> = new Array<A_RecPay_D_CashBox>();
    var BoxDetails: Array<A_RecPay_D_CashBox> = new Array<A_RecPay_D_CashBox>();
    var PurchaserBoxId;
    var BoxIdfilter;
    //////////////////////////////////////////print buttons////////////////////////////////////////////

    var btnPrintTrview: HTMLButtonElement;
    var btnPrintTrPDF: HTMLButtonElement;
    var btnPrintTrEXEL: HTMLButtonElement;
    var btnPrintTransaction: HTMLButtonElement;
    //var btnPrint: HTMLButtonElement;
    var btnPrintslip: HTMLButtonElement;
    var btnPrintsFrom_To: HTMLButtonElement;

     
    var compcode: Number;//SharedSession.CurrentEnvironment.CompCode;
    var BranchCode: number;//SharedSession.CurrentEnvironment.BranchCode;
    var IsNew;
    var index;
    var Selecteditem
    var ReceiptIDUpdate: number = 0;
    var ReceiptID = 0;
    var Reciept_TrNo = 0;
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
    var isExpense: boolean;

    var EDIT = SysSession.CurrentPrivileges.EDIT;
    var AddNew = SysSession.CurrentPrivileges.AddNew;

    var CUSTOM1 = SysSession.CurrentPrivileges.CUSTOM1;
    var CUSTOM2 = SysSession.CurrentPrivileges.CUSTOM2;
    var CashType = 0;
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);



    export function InitalizeComponent() {

        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = "سند استلام";

        } else {
            document.getElementById('Screen_name').innerHTML = "AccTrReceiptNote";

        }



        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);
        InitalizeControls();
        InitalizeEvents();
        reference_Page();



        Display_GCodes();
        Display_D_CashBox();
        fillddlCashType();
        //txt_ReceiptNote.disabled = true;

        txtDateFrom.value = DateStartMonth();
        txtDateTo.value = ConvertToDateDash(GetDate()) <= ConvertToDateDash(SysSession.CurrentEnvironment.EndDate) ? GetDate() : SysSession.CurrentEnvironment.EndDate;

        Display_Acount_Code();
    }

    function InitalizeControls() {
        //////// 

        btnShow = document.getElementById("btnShow") as HTMLButtonElement;
        btnAdd = document.getElementById("btnAdd") as HTMLButtonElement;
        btnUpdate = document.getElementById("btnUpdate") as HTMLButtonElement;
        btnSave = document.getElementById("btnSave") as HTMLButtonElement;
        btnBack = document.getElementById("btnBack") as HTMLButtonElement;



        //textBoxes
        txt_CODE = document.getElementById("txt_CODE") as HTMLInputElement;
        txt_ReceiptNote = document.getElementById("txt_ReceiptNote") as HTMLSelectElement;
        txt_ReceiptNoteNew = document.getElementById("txt_ReceiptNoteNew") as HTMLSelectElement;
        //txt_ID_beneficiary = document.getElementById("txt_ID_beneficiary") as HTMLSelectElement;
        //txt_ID_beneficiaryNew = document.getElementById("txt_ID_beneficiaryNew") as HTMLSelectElement;
        txt_D_CashBox = document.getElementById("txt_D_CashBox") as HTMLSelectElement;
        txt_Status = document.getElementById("txt_Status") as HTMLSelectElement;
        txtCashType = document.getElementById("txtCashType") as HTMLSelectElement;
        txtCashTypeNew = document.getElementById("txtCashTypeNew") as HTMLSelectElement;



        txt_VoucherNo = document.getElementById("txt_VoucherNo") as HTMLInputElement;
        txt_Amount = document.getElementById("txt_Amount") as HTMLInputElement;
        txt_CashAmount = document.getElementById("txt_CashAmount") as HTMLInputElement;
        txt_CardAmount = document.getElementById("txt_CardAmount") as HTMLInputElement;
        txt_ReceiptDesc = document.getElementById("txt_ReceiptDesc") as HTMLInputElement;
        txt_Receiving_Fund = document.getElementById("txt_Receiving_Fund") as HTMLSelectElement;
        txt_BankAcc_Code = document.getElementById("txt_BankAcc_Code") as HTMLSelectElement;

        txtDueDate = document.getElementById("txtDueDate") as HTMLInputElement;
        txtDateNew = document.getElementById("txtDateNew") as HTMLInputElement;
        txtDateFrom = document.getElementById("txtDateFrom") as HTMLInputElement;
        txtDateTo = document.getElementById("txtDateTo") as HTMLInputElement;
        txt_note = document.getElementById("txt_note") as HTMLInputElement;

        chkActive = document.getElementById("chkStatus") as HTMLInputElement;
        chkIsDeffered = document.getElementById("chkIsDeffered") as HTMLInputElement;
        searchbutmemreport = document.getElementById("searchbutmemreport") as HTMLInputElement;

        //print 
        btnPrintTrview = document.getElementById("btnPrintTrview") as HTMLButtonElement;
        btnPrintTrPDF = document.getElementById("btnPrintTrPDF") as HTMLButtonElement;
        btnPrintTrEXEL = document.getElementById("btnPrintTrEXEL") as HTMLButtonElement;
        btnPrintTransaction = document.getElementById("btnPrintTransaction") as HTMLButtonElement;
        //btnPrint = document.getElementById("btnPrint") as HTMLButtonElement;
        btnPrintslip = document.getElementById("btnPrintslip") as HTMLButtonElement;
        btnPrintsFrom_To = document.getElementById("btnPrintsFrom_To") as HTMLButtonElement;

        //////////////////////////////donia
        btnBen = document.getElementById("btnBen") as HTMLButtonElement;
        txt_BenCode = document.getElementById("txt_BenCode") as HTMLInputElement;
        txt_BenName = document.getElementById("txt_BenName") as HTMLInputElement;

        btnBenH = document.getElementById("btnBenH") as HTMLButtonElement;
        txt_BenCodeH = document.getElementById("txt_BenCodeH") as HTMLInputElement;
        txt_BenNameH = document.getElementById("txt_BenNameH") as HTMLInputElement;
    }

    function InitalizeEvents() {
        ////// 


        btnShow.onclick = btnShow_onclick;
        btnAdd.onclick = btnAdd_onclick;
        btnSave.onclick = btnsave_onClick;
        btnBack.onclick = btnback_onclick;
        btnUpdate.onclick = btnUpdate_onclick;
        searchbutmemreport.onkeyup = _SearchBox_Change;
        chkActive.onchange = chkStatus_onchange;
        chkIsDeffered.onchange = chkIsDeffered_onchange;
        txt_D_CashBox.onchange = txt_D_CashBox_onchange;
        txtCashTypeNew.onchange = txtCashTypeNew_onchange;
        txt_ReceiptNote.onchange = txt_ReceiptNote_onchange;
        txt_ReceiptNoteNew.onchange = txt_ReceiptNoteNew_onchange;
        // txt_ID_beneficiaryNew.onchange = txt_ID_beneficiaryNew_onchange;
        txt_CashAmount.onkeyup = txt_CashAmount_onchange;
        txt_CardAmount.onkeyup = txt_CashAmount_onchange;

        txtDateFrom.value = GetDate();
        txtDateTo.value = GetDate();


        btnPrintTrview.onclick = () => { PrintReport(1); }
        btnPrintTrPDF.onclick = () => { PrintReport(2); }
        btnPrintTrEXEL.onclick = () => { PrintReport(3); }
        //btnPrint.onclick = () => { PrintReport(4); }
        btnPrintTransaction.onclick = PrintTransaction;
        //btnPrintslip. = btnPrintslip;
        btnPrintslip.onclick = btnPrintslip_onclick;

        /////////////////////////////donia
        txt_BenCode.onchange = txt_BenCode_onchange;
        btnBen.onclick = btnBen_onclick;

        txt_BenCodeH.onchange = txt_BenCodeH_onchange;
        btnBenH.onclick = btnBenH_onclick;
        txt_CashAmount.onchange = Amount_onchange;
        txt_CardAmount.onchange = Amount_onchange;

        btnPrintsFrom_To.onclick = btnPrintsFrom_To_onclick;

    }

    function fillddlCashType() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GCodes", "GetAll"),
            data: {
                codeType: 'ChckType', UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    Details_GCodes_ChckType = result.Response as Array<G_Codes>;
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

            $('#btnUpdate').attr('class') == 'btn btn-primary display_none' ? $('#txtDueDate').removeAttr('disabled') : $('#txtDueDate').attr('disabled', 'disabled');

        }
        else {
            $('#txtDueDate').attr('disabled', 'disabled');

        }

    }

    function txtCashTypeNew_onchange() {
        debugger
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
            $('#txt_Amount').attr('disabled', 'disabled');

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

            //$('#btnUpdate').attr('class') == 'btn btn-primary display_none' ? $('#txt_Amount').removeAttr('disabled') : $('#txt_Amount').attr('disabled', 'disabled');

            $('#txt_Amount').removeAttr('disabled');
             
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

            $('#txt_Amount').removeAttr('disabled');

            //$('#btnUpdate').attr('class') == 'btn btn-primary display_none' ? $('#txt_Amount').removeAttr('disabled') : $('#txt_Amount').attr('disabled', 'disabled');

        }

        chkIsDeffered_onchange();

    }

    function Display_Acount_Code() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GLDefAccount", "GetBankAcc"),
            data: {
                CompCode: compcode, AccType: 3, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    Details_Acount = result.Response as Array<A_ACCOUNT>;
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                        DocumentActions.FillCombowithdefult(Details_Acount, txt_BankAcc_Code, "ACC_CODE", "ACC_DESCL", "Type of constraint");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(Details_Acount, txt_BankAcc_Code, "ACC_CODE", "ACC_DESCA", "اختر حساب الايداع");
                    }


                }
            }
        });
    }

    function chkStatus_onchange() {
        // 
        if (IsNew != true) {
            if (Selecteditem[0].IsPosted != true) {

                if (Valid != 1 && Selecteditem[0].Status == 1 && chkActive.checked == false) {
                    Open();
                    Display();
                    Selecteditem = Details.filter(x => x.ReceiptID == Number(ReportGrid.SelectedKey));
                    ReceiptID = Selecteditem[0].ReceiptID;
                    if (Selecteditem[0].Status == 1) {
                        chkActive.checked = true;
                        btnUpdate.disabled = true;
                        chkActive.disabled = false;
                        chkActive.disabled = !SysSession.CurrentPrivileges.CUSTOM2
                    }
                    else {
                        chkActive.checked = false;
                        chkActive.disabled = true;
                        btnUpdate.disabled = !SysSession.CurrentPrivileges.EDIT
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
        // 
        Assign();
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("AccTrReceipt", "Open"),
            data: JSON.stringify(Model),
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    DisplayMassage("تم الاعتماد بنجاح", "Success", MessageType.Succeed);
                    Update_claenData = 1;
                } else {
                    DisplayMassage("خطأء", "Error", MessageType.Error);
                    Update_claenData = 0;
                }
            }
        });
    }

    function reference_Page() {
        // 
        if (!EDIT) {

            $('#btnUpdate').attr('class', 'btn btn-primary display_none');
            $('#btnSave').attr('class', 'btn btn-success display_none');
            $('#btnBack').attr('class', 'btn btn-success display_none');

        }
        if (!AddNew) { $('#btnAdd').attr('class', 'btn btn-primary display_none'); }
        //if (CUSTOM1) { $("#chkStatus").removeAttr("disabled");}
        //if (!CUSTOM1) { $("#chkStatus").attr("disabled", "disabled"); }

    }

    function txt_D_CashBox_onchange() {
        // 

        if (txt_D_CashBox.value == 'Null') {
            /////////////////////doniaH
            //$("#txt_ID_beneficiary").attr("disabled", "disabled");
            //$("#txt_ID_beneficiary").prop("value", "Null");
            //$("#txt_ReceiptNote").prop("value", "Null");

            $("#txt_BenCodeH").attr("disabled", "disabled");
            txt_BenCodeH.value = "";
            txt_BenNameH.value = "";
            $("#txt_ReceiptNote").prop("value", "Null");

        }
        else {
            var box = Details_Type_D_CashBox.filter(x => x.CashBoxID == Number(txt_D_CashBox.value));
            if (box.length > 0) {
                isExpense = box[0].IsRecPayAccount == null ? false : box[0].IsRecPayAccount;

            }
            else {
                isExpense = false;
            }
        }

    }

    function txt_CashAmount_onchange() {
        if (txt_CardAmount.value == null) { txt_CardAmount.value = "0"; }
        if (txt_CashAmount.value == null) { txt_CashAmount.value = "0"; }
        txt_Amount.value = (Number(txt_CashAmount.value) + Number(txt_CardAmount.value)).toString();


    }

    function txt_ReceiptNoteNew_onchange() {

        txt_BenCode.value = "";
        txt_BenName.value = "";
        if (txt_ReceiptNoteNew.value == "0" || txt_ReceiptNoteNew.value == "Null") {


            //$("#txt_ID_beneficiaryNew").attr("disabled", "disabled");
            //$("#txt_ID_beneficiaryNew").prop("value", "Null");
            $("#btnBen").attr("disabled", "disabled");
            $("#txt_BenCode").attr("disabled", "disabled");
            Type_Receipt_New = "donia";

        }
        else {
            //$("#txt_ID_beneficiaryNew").removeAttr("disabled");
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

            /////////////////doniaH
            //$("#txt_ID_beneficiary").attr("disabled", "disabled");
            //$("#txt_ID_beneficiary").prop("value", "Null");
            // $("#txt_BenCodeH").attr("disabled", "disabled");
            txt_BenCodeH.disabled = true;
            btnBenH.disabled = true;
            Type_Receipt = "";

        }
        else {
            //$("#txt_BenCodeH").removeAttr("disabled");
            txt_BenCodeH.disabled = false;
            btnBenH.disabled = false;
            Type_ReceiptNote = true;

            //Displaybeneficiary();
        }

    }

    function btnUpdate_onclick() {

        if (!SysSession.CurrentPrivileges.EDIT) return;
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
            $("#txt_Amount").attr("disabled", "disabled");
            $("#txt_Receiving_Fund").attr("disabled", "disabled");
            //$("#txt_Receiving_Fund").attr("disabled", "disabled");

            $("#id_div_Add").addClass("disabledDiv");

            $('#btnPrintTransaction').addClass("display_none");


            txtCashTypeNew.value != '0' ? $('#txt_Amount').removeAttr('disabled') : $('#txt_Amount').attr('disabled', 'disabled');
            chkIsDeffered.checked == true ? $('#txtDueDate').removeAttr('disabled') : $('#txtDueDate').attr('disabled', 'disabled');
            $(".btn-group").addClass("display_none");

            $('#txt_Receiving_Fund').removeAttr('disabled');

        }
         

    }

    function btnAdd_onclick() {
        IsEdite = false;
        if (txt_D_CashBox.value == "Null") {
            DisplayMassage('(يجب أختيار الصندوق)', '(The Box must be selected)', MessageType.Worning)
            Errorinput(txt_D_CashBox);
            Back();
            return;
        } else {

            $("#Div_control").removeClass("display_none");
            DisplayAddStkGCodes();
            IsNew = true;
            EnableControls();
            removedisabled();
            //txt_ID_beneficiaryNew.setAttribute("disabled", "disabled");
            txt_BenCode.setAttribute("disabled", "disabled");
            btnBen.setAttribute("disabled", "disabled");

          
           $("#id_div_Add").addClass("disabledDiv");

            if (txt_D_CashBox.value != "Null") { $('#txt_Receiving_Fund').prop("value", txt_D_CashBox.value); $("#txt_Receiving_Fund").attr("disabled", "disabled"); }



            reference_Page();
            chkActive.checked = false;
            $('#btnPrintTransaction').addClass("display_none");


            $('#Bank_Div').addClass('display_none');
            $('.btn-group').addClass('display_none');
            $('#La_CashAmount').removeClass('display_none');
            $('#La_CardAmount').removeClass('display_none');
            $('#txt_CashAmount').removeClass('display_none');
            $('#txt_CardAmount').removeClass('display_none');

            $('#txt_Amount').attr('disabled', 'disabled');
            $('#txtDateNew').removeAttr('disabled');
            $('#txt_Receiving_Fund').removeAttr('disabled');
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
        CashAmount = Number($('#txt_CashAmount').val());
        if (!Validation()) {
            return;
        }
        if (IsNew == true) {


            Insert();



        }
        else {

            //// 
            Update();



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

        $("#btnBen").attr("disabled", "disabled");
        $("#txt_BenCode").attr("disabled", "disabled");


    }

    function removedisabled() {
        ////// 

        txt_ReceiptNoteNew.removeAttribute("disabled");

        chkIsDeffered.removeAttribute("disabled");
        $("#chkStatus").removeAttr("disabled");
        //txt_ID_beneficiaryNew.removeAttribute("disabled");
        txt_note.removeAttribute("disabled");
        txt_ReceiptDesc.removeAttribute("disabled");
        txt_CashAmount.removeAttribute("disabled");
        txt_CardAmount.removeAttribute("disabled");
        txt_Receiving_Fund.removeAttribute("disabled");


        $("#txt_CheckNo").removeAttr("disabled");
        $("#txt_TransferNo").removeAttr("disabled");
        $("#txt_BankName").removeAttr("disabled");
        $("#txt_BankAcc_Code").removeAttr("disabled");
        $("#txtCashTypeNew").removeAttr("disabled");
        $("#txtDueDate").removeAttr("disabled");
        $("#txtDateNew").removeAttr("disabled");

        $("#btnBen").removeAttr("disabled");
        $("#txt_BenCode").removeAttr("disabled");


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
        $(".btn-group").removeClass("display_none");

    }

    function GetDate() {
        //// 
        var today: Date = new Date;
        var dd: string = today.getDate().toString();
        var ReturnedDate: string;
        var mm: string = (today.getMonth() + 1).toString();
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
            DisplayMassage("يجب اختيار نوع القيد ", "Choose the type of constraint", MessageType.Worning);
            Errorinput(txtCashTypeNew);
            return false;

        }
        if (txt_ReceiptNoteNew.selectedIndex == 0) {
            DisplayMassage("يجب اختيار نوع الاستلام ", " The type of receipt must be selected", MessageType.Worning);
            Errorinput(txt_ReceiptNoteNew);
            return false;
        }


        //if (txt_ID_beneficiaryNew.selectedIndex == 0) {
        //    DisplayMassage("يجب اختيار المستفيد ", "The beneficiary must be chosen", MessageType.Worning);
        //    Errorinput(txt_ID_beneficiaryNew);
        //    return false;

        //}

        if (txt_BenCode.value == "") {
            DisplayMassage("يجب اختيار المستفيد ", "The beneficiary must be chosen", MessageType.Worning);
            Errorinput(txt_BenCode);
            return false;
        }
        if (txtDateNew.value == "") {
            DisplayMassage("يجب اختيار التاريخ ", "The date must be chosen ", MessageType.Worning);
            Errorinput(txtDateNew);
            return false;
        }
        if (txt_Receiving_Fund.value == "Null") {
            DisplayMassage("يجب اختيار سند الصندوق  ", "A fund bond must be selected ", MessageType.Worning);
            Errorinput(txt_Receiving_Fund);
            return false;
        }
        if ((txt_CashAmount.value == "0" && txt_CardAmount.value == "0") && txtCashTypeNew.value == "0") {
            DisplayMassage("يجب ادخال نقدي او كارت", "You must enter cash or card ", MessageType.Worning);
            Errorinput(txt_CashAmount);
            Errorinput(txt_CardAmount);
            return false;

        }
        if (txt_Amount.value == "0" || txt_Amount.value.trim() == ""){
            DisplayMassage("يجب ادخال  البلغ   ", " Amount must be entered", MessageType.Worning);
            Errorinput($('#txt_Amount'));
            return false;
        }
        if ((txtCashTypeNew.value == "1" || txtCashTypeNew.value == "2") && $('#txt_TransferNo').val() == '') {
            DisplayMassage("يجب ادخال  رقم التحويله ", " Transfer number must be entered", MessageType.Worning);
            Errorinput($('#txt_TransferNo'));
            return false;
        }
        if (txtCashTypeNew.value != "0" && txtCashTypeNew.value != "1" && txtCashTypeNew.value != "2" && $('#txt_CheckNo').val() == '') {
            DisplayMassage("يجب ادخال  رقم الشيك   ", " The check number must be entered", MessageType.Worning);
            Errorinput($('#txt_CheckNo').val());
            return false;
        }

        if (txtCashTypeNew.value != "0" && $('#txt_BankName').val() == '') {
            DisplayMassage("يجب ادخال  صادر من بنك  ", " The entry must be issued by a bank", MessageType.Worning);
            Errorinput($('#txt_BankName'));
            return false;
        }
        if (txtCashTypeNew.value != "0" && txt_BankAcc_Code.selectedIndex == 0) {
            DisplayMassage("يجب اختيار  رقم الحساب الايداع  ", "You must choose the deposit account number", MessageType.Worning);
            Errorinput(txt_BankAcc_Code);
            return false;
        }

        $(".btn-group").removeClass("display_none");


        return true;

    }

    function btnShow_onclick() {

        if (txtDateFrom.value == "" || txtDateTo.value == "") {

            DisplayMassage('(يجب أختيار التاريخ)', '(The date must be selected)', MessageType.Worning)
        }
        else {
            Display();
        }
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
            $(".btn-group").removeClass("display_none");
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
        debugger
        IsEdite = false;
        IsNew = false;
        AddDisabled();

        Selecteditem = Details.filter(x => x.ReceiptID == Number(ReportGrid.SelectedKey));
        Update_claenData = 1;
        DisplayAddStkGCodes();

        DisplayData(Selecteditem);
        ReceiptID = Selecteditem[0].ReceiptID;
        compcode = Selecteditem[0].CompCode;
        BranchCode = Selecteditem[0].BranchCode;
        //chkActive.disabled = true;


        Update_claenData = 0; 
        reference_Page();

        ////// 
        $('#btnUpdate').removeClass("display_none");
        $('#btnSave').addClass("display_none");
        $('#btnBack').addClass("display_none");

        // 
        if (Selecteditem[0].Status == 1) {
            chkActive.checked = true;
            btnUpdate.disabled = true;
            chkActive.disabled = false;
            chkActive.disabled = !SysSession.CurrentPrivileges.CUSTOM2
        }
        else {
            chkActive.checked = false;
            chkActive.disabled = true;
            btnUpdate.disabled = !SysSession.CurrentPrivileges.EDIT
        }

        $("#Div_control").removeClass("display_none");


        Amount_onchange();
    }

    function DisplayData(Selecteditem: Array<IQ_GetBoxReceiveList>) {
        debugger
        DocumentActions.RenderFromModel(Selecteditem[0]);
        ReceiptID = Selecteditem[0].ReceiptID;
        Reciept_TrNo = Selecteditem[0].TrNo;


        $('#txtCashTypeNew').prop("value", Selecteditem[0].CashType == null ? "null" : Selecteditem[0].CashType);
        $('#txt_BankAcc_Code').prop("value", Selecteditem[0].BankAcc_Code == null ? "null" : Selecteditem[0].BankAcc_Code);
        $('#txt_BenName').prop("value", Selecteditem[0].BankName);
         
        var trDate: string = DateFormat(Selecteditem[0].TrDate);
        var DueDate: string = DateFormat(Selecteditem[0].DueDate);

        txtDateNew.value = trDate;
        txtDueDate.value = DueDate == null ? GetDate() : DueDate;

        Type_ReceiptNote = false;
        //$('#txt_ID_beneficiaryNew').html("");
        //$('#txt_ID_beneficiaryNew').append('<option value="Null"> اختار المستفيد</option>');

        // $('#txt_BenCode').html(""); 

        debugger

        if (Selecteditem[0].RecPayTypeId == 1) { getAccountCustById(Selecteditem[0].CustomerID.toString(), false); }
        if (Selecteditem[0].RecPayTypeId == 2) { getAccountVndById(Selecteditem[0].VendorID.toString(), false); }
        if (Selecteditem[0].RecPayTypeId == 3) { getAccountBankById(Selecteditem[0].BankAccountCode, true); }
        if (Selecteditem[0].RecPayTypeId == 4) { getAccountAccById(Selecteditem[0].ExpenseID.toString(), false); }
        if (Selecteditem[0].RecPayTypeId == 5) { getAccountBoxById(Selecteditem[0].FromCashBoxID.toString(), false); }


        //if (Type_Receipt_New == "1") { getAccountCustById(Selecteditem[0].CustomerID.toString(), false); }
        //else if (Type_Receipt_New == "2") { getAccountVndById(Selecteditem[0].VendorID.toString(), false); }
        //else if (Type_Receipt_New == "3") { getAccountBankById(Selecteditem[0].BankAcc_Code, true); }
        //else if (Type_Receipt_New == "4") { getAccountAccById(Selecteditem[0].Bef_Code.toString(), true); }
        //else if (Type_Receipt_New == "5") { getAccountBoxById(Selecteditem[0].CashBoxID.toString(), false); }

        $('#txt_Receiving_Fund').prop("value", Selecteditem[0].CashBoxID);
        $('#txt_ReceiptNoteNew').prop("value", Selecteditem[0].RecPayTypeId);

        chkIsDeffered.checked = Selecteditem[0].IsDeffered == true ? true : false;

        txtCashTypeNew_onchange();
    }

    function Display_GCodes() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GCodes", "GetAll"),
            data: {
                codeType: codeType, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    Details_GCodes = result.Response as Array<G_Codes>;

                    DisplayStkGCodes();
                }
            }
        });
    }

    function DisplayStkGCodes() {

        $('#txt_ReceiptNote').html('');

        $('#txt_ReceiptNote').append('<option value="Null">' + (lang == "ar" ? " اختر نوع الاستلام" : "Choose the type of receipt") + '</option>');

        for (var i = 0; i < Details_GCodes.length; i++) {




            $('#txt_ReceiptNote').append('<option value="' + Details_GCodes[i].CodeValue + '">' + (lang == "ar" ? Details_GCodes[i].DescA : Details_GCodes[i].DescE) + '</option>');



        }

    }

    function DisplayAddStkGCodes() {
        $('#txt_ReceiptNoteNew').html('');
        $('#txt_ReceiptNoteNew').append('<option value="Null">' + (lang == "ar" ? "اختر نوع الاستلام " : "Choose receipt type") + '</option>');
        for (var i = 0; i < Details_GCodes.length; i++) {
            if (Details_GCodes[i].CodeValue == 4 && isExpense == false)
                continue;
            $('#txt_ReceiptNoteNew').append('<option value="' + Details_GCodes[i].CodeValue + '">' + (lang == "ar" ? Details_GCodes[i].DescA : Details_GCodes[i].DescE) + '</option>');
        }
    }

    function Display_D_CashBox() {
        //// 
        let CashBoxID = 0;
        if (SysSession.CurrentEnvironment.UserType == 2 || SysSession.CurrentEnvironment.UserType == 3) {

            CashBoxID = SysSession.CurrentEnvironment.CashBoxID == null ? 0 : SysSession.CurrentEnvironment.CashBoxID;
        }

        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefBox", "GetAllRec"),
            data: { compCode: compcode, CashBoxID: CashBoxID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    //// 
                    Details_Type_D_CashBox = result.Response as Array<A_RecPay_D_CashBox>;

                    DisplayStCashBox();

                    //SysSession.CurrentEnvironment.UserType == 2 || 3 ? ($('#txt_D_CashBox option[value="null"]').remove()) : $('#txt_D_CashBox').prop('selectedIndex', 0);
                    //SysSession.CurrentEnvironment.UserType == 2 || 3 ? ($('#txt_Receiving_Fund option[value="null"]').remove()) : $('#txt_Receiving_Fund').prop('selectedIndex', 0);
                }
            }
        });
    }

    function DisplayStCashBox() {

        var box = Details_Type_D_CashBox.filter(x => x.BranchCode == BranchCode)

        for (var i = 0; i < box.length; i++) {
            $('#txt_D_CashBox').append('<option value="' + box[i].CashBoxID + '">' + (lang == "ar" ? box[i].CashBox_DescA : box[i].CashBox_DescE) + '</option>');
         
        }
         
        for (var i = 0; i < Details_Type_D_CashBox.length; i++) {
        
            $('#txt_Receiving_Fund').append('<option value="' + Details_Type_D_CashBox[i].CashBoxID + '">' + (lang == "ar" ? Details_Type_D_CashBox[i].CashBox_DescA : Details_Type_D_CashBox[i].CashBox_DescE) + '</option>');
        }



        if (SysSession.CurrentEnvironment.UserType == 2 || SysSession.CurrentEnvironment.UserType == 3) {

            //$('#txt_D_CashBox option[value="Null"]').remove();
            $('#txt_Receiving_Fund option[value="Null"]').remove();
            var box = Details_Type_D_CashBox.filter(x => x.CashBoxID == Number(txt_D_CashBox.value));
            if (box.length > 0) {
                isExpense = box[0].IsRecPayAccount == null ? false : box[0].IsRecPayAccount;

            }
            else {
                isExpense = false;
            }

        }
        else {
            $('#txt_D_CashBox').prop('selectedIndex', 0);
            $('#txt_Receiving_Fund').prop("value", "Null");

        }
    }
     
    function EnableControls() {
        if (!SysSession.CurrentPrivileges.AddNew) return;

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

        $('#txt_Openbalance').val('0');
        $("#txt_AmountCurrency").text("");

    }

    function Assign_Display() {
        /////////////doniaH 

        custId = 0; vndid = 0; expid = 0; fromBoxid = 0; BankCode = 0;

        //var beneficiary = $("#txt_ID_beneficiary").val();
        var beneficiary = $("#txt_BenCodeH").val();
        Boxid = txt_D_CashBox.value;
        RecPayTypeId = txt_ReceiptNote.value;
        CashType = txtCashType.value == "null" ? 1001 : Number(txtCashType.value);
        DateFrom = DateFormatRep(txtDateFrom.value);
        DateTo = DateFormatRep(txtDateTo.value);
        Status = txt_Status.value;

        if (Boxid == "Null") { Boxid = 0; }
        if (RecPayTypeId == "Null") { RecPayTypeId = 0; }
        if (beneficiary == "") { beneficiary = 0; }

        if (RecPayTypeId == '1') { GlobalID = GlobalCustIDH; custId = beneficiary; vndid = 0; BankCode = 0; expid = 0; fromBoxid = 0; }
        else if (RecPayTypeId == '2') { GlobalID = PurchaserVndIdH; custId = 0; vndid = beneficiary; BankCode = 0; expid = 0; fromBoxid = 0; }
        else if (RecPayTypeId == '3') { GlobalID = GlobalBankIDH; custId = 0; vndid = 0; BankCode = beneficiary; expid = 0; fromBoxid = 0; }
        else if (RecPayTypeId == '4') { GlobalID = GlobalAccIDH; custId = 0; vndid = 0; BankCode = 0; expid = beneficiary; fromBoxid = 0; }
        else if (RecPayTypeId == '5') { GlobalID = GlobalBoxIDH; custId = 0; vndid = 0; BankCode = 0; expid = 0; fromBoxid = beneficiary; }

        //if (txt_ReceiptNote.value == "1")
        //{
        //    GlobalID = GlobalCustIDH;
        //    //getAccountCustHById(Selecteditem[0].CustomerID.toString(), false);
        //}
        //else if (txt_ReceiptNote.value == "2")
        //{
        //    GlobalID = PurchaserVndIdH;
        //    //getAccountVndHById(Selecteditem[0].VendorID.toString(), false);
        //}
        //else if (txt_ReceiptNote.value == "3")
        //{
        //    GlobalID = GlobalBankIDH;
        //    //getAccountBankHById(Selecteditem[0].BankAcc_Code, true);
        //}
        //else if (txt_ReceiptNote.value == "4")
        //{
        //    GlobalID = GlobalAccIDH;
        //    //getAccountAccHById(Selecteditem[0].Bef_Code.toString(), true);
        //}
        //else if (txt_ReceiptNote.value == "5")
        //{
        //    GlobalID = GlobalBoxIDH;
        //    //getAccountBoxHById(Selecteditem[0].CashBoxID.toString(), false);
        //}

    }

    function Display() {
        debugger
        Assign_Display();
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccTrReceipt", "GetBoxReceiveList"),
            data: {
                comp: compcode, GlobalID: GlobalID, IQ_TrType: IQ_TrType, Boxid: Boxid, Status: Status, RecPayTypeId: RecPayTypeId, FromDate: DateFrom, Todate: DateTo, custId: custId, vndid: vndid, expid: expid, BankCode: BankCode, fromBoxid: fromBoxid, CashType: CashType, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token, MODULE_CODE: Modules.AccTrReceiptNote, FinYear: SysSession.CurrentEnvironment.CurrentYear, BranchCode: SysSession.CurrentEnvironment.BranchCode
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    Details = result.Response as Array<IQ_GetBoxReceiveList>;                     
                    InitializeGrid();
                    ReportGrid.DataSource = Details;
                    ReportGrid.Bind();

                }
            }
        });
    }

    function _SearchBox_Change() {
        $("#ReportGrid").jsGrid("option", "pageIndex", 1);

        if (searchbutmemreport.value != "") {
            let search: string = searchbutmemreport.value.toLowerCase();
            SearchDetails = Details.filter(x => x.TrNo.toString().search(search) >= 0 || x.Bef_Code.toString().search(search) >= 0 || x.Bef_DescA.toLowerCase().search(search) >= 0);

            ReportGrid.DataSource = SearchDetails;
            ReportGrid.Bind();
        } else {

            ReportGrid.DataSource = Details;
            ReportGrid.Bind();
        }
    }

    function InitializeGrid() {


        let res: any = GetResourceList("");
        //$("#id_ReportGrid").attr("style", "");
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
        ReportGrid.OnItemEditing = () => { };
        ReportGrid.Columns = [
            { title: "الرقم", name: "ReceiptID", type: "text", width: " ", visible: false },
            { title:  "رقم السند" , name: "TrNo", type: "text", width: "11%" },
            {
                title: res.App_date, css: "ColumPadding", name: "TrDate", width: "20%",
                itemTemplate: (s: string, item: IQ_GetBoxReceiveList): HTMLLabelElement => {
                    let txt: HTMLLabelElement = document.createElement("label");
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
                itemTemplate: (s: string, item: IQ_GetBoxReceiveList): HTMLLabelElement => {
                    let txt: HTMLLabelElement = document.createElement("label");
                    txt.innerHTML = item.Status == 1 ? (lang == "ar" ? "معتمد" : "A certified") : (lang == "ar" ? "غير معتمد" : "Not supported");;
                    return txt;
                }
            },

        ];
        ReportGrid.Bind();
    }

    function Assign() {
        debugger
        Model = new A_RecPay_Tr_ReceiptNote();

        if (IsNew == true) {
            DocumentActions.AssignToModel(Model);//Insert Update
            if (chkActive.checked) { Model.Status = 1 }
            else { Model.Status = 0 }
            Model.CompCode = Number(SysSession.CurrentEnvironment.CompCode);
            Model.BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);
            Model.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
            Model.UserCode = SysSession.CurrentEnvironment.UserCode;

            Model.CreatedAt = DateTimeFormat(Date().toString());
            Model.CreatedBy = SysSession.CurrentEnvironment.UserCode;
            Model.ReceiptID = 0;
            //Model.ReceiptID = ReceiptID;


            Model.CashType = $('#txtCashTypeNew').val() == 'null' ? null : $('#txtCashTypeNew').val();
            Model.BankAcc_Code = $('#txt_BankAcc_Code').val() == 'null' ? null : $('#txt_BankAcc_Code').val();
            Model.CashAmount = CashAmount; 

            Model.RecPayTypeId = $('#txt_ReceiptNoteNew').val();
            //var beneficiary = $("#txt_ID_beneficiaryNew").val();
            var beneficiary = $("#txt_BenCode").val();


            if ($('#txt_ReceiptNoteNew').val() == "1") { beneficiary = PurchaserCustId; custId = beneficiary; vndid = null; BankCode = null; expid = null; fromBoxid = null; }
            else if ($('#txt_ReceiptNoteNew').val() == "2") { beneficiary = PurchaserVndId; custId = null; vndid = beneficiary; BankCode = null; expid = null; fromBoxid = null; }
            else if ($('#txt_ReceiptNoteNew').val() == "3") { beneficiary = PurchaserBankId; custId = null; vndid = null; BankCode = beneficiary; expid = null; fromBoxid = null; }
            else if ($('#txt_ReceiptNoteNew').val() == "4") { beneficiary = PurchaserAccId; custId = null; vndid = null; BankCode = null; expid = beneficiary; fromBoxid = null; }
            else if ($('#txt_ReceiptNoteNew').val() == "5") { beneficiary = PurchaserBoxId; custId = null; vndid = null; BankCode = null; expid = null; fromBoxid = beneficiary; }

            Model.ExpenseID = expid;
            Model.CustomerID = custId;
            Model.VendorID = vndid;

            Model.BankAccountCode = BankCode == null ? null : BankCode.toString(); 
            Model.BankName = txt_BenName.value;
            Model.FromCashBoxID = fromBoxid;
            Model.TrType = IQ_TrType;
            Model.TrDateH = "1";

            Model.TrNo = 0;
            Model.VoucherNo = 0;
            Model.UpdatedAt = "";
            Model.IsDeffered = chkIsDeffered.checked;
            Model.CashBoxID = Number($('#txt_Receiving_Fund').val());
            Model.BankName = $('#txt_BankName').val();

            Model.Branch_Code = SysSession.CurrentEnvironment.BranchCode;
            Model.Comp_Code = SysSession.CurrentEnvironment.CompCode;
            Model.MODULE_CODE = Modules.AccTrReceiptNote;
            Model.UserCode = SysSession.CurrentEnvironment.UserCode;
            Model.sec_FinYear = SysSession.CurrentEnvironment.CurrentYear;
        }
        else {
            DocumentActions.AssignToModel(Model);//Insert Update
            if (chkActive.checked) { Model.Status = 1 }
            else { Model.Status = 0 }
            Model.CompCode = Number(SysSession.CurrentEnvironment.CompCode);
            Model.BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);
            Model.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
            Model.UserCode = SysSession.CurrentEnvironment.UserCode;

            Model.CreatedAt = DateTimeFormat(Date().toString());
            Model.CreatedBy = SysSession.CurrentEnvironment.UserCode;
            Model.ReceiptID = ReceiptID;
            Model.CashAmount = CashAmount;
            Model.CashType = $('#txtCashTypeNew').val() == 'null' ? null : $('#txtCashTypeNew').val();
            Model.BankAcc_Code = $('#txt_BankAcc_Code').val() == 'null' ? null : $('#txt_BankAcc_Code').val(); 
            Model.RecPayTypeId = $('#txt_ReceiptNoteNew').val();
            //var beneficiary = $("#txt_ID_beneficiaryNew").val();
            var beneficiary = $("#txt_BenCode").val();
            Model.BankName = $('#txt_BankName').val();


            if ($('#txt_ReceiptNoteNew').val() == "1") { beneficiary = PurchaserCustId; custId = beneficiary; vndid = null; BankCode = null; expid = null; fromBoxid = null; }
            else if ($('#txt_ReceiptNoteNew').val() == "2") { beneficiary = PurchaserVndId; custId = null; vndid = beneficiary; BankCode = null; expid = null; fromBoxid = null; }
            else if ($('#txt_ReceiptNoteNew').val() == "3") { beneficiary = PurchaserBankId; custId = null; vndid = null; BankCode = beneficiary; expid = null; fromBoxid = null; }
            else if ($('#txt_ReceiptNoteNew').val() == "4") { beneficiary = PurchaserAccId; custId = null; vndid = null; BankCode = null; expid = beneficiary; fromBoxid = null; }
            else if ($('#txt_ReceiptNoteNew').val() == "5") { beneficiary = PurchaserBoxId; custId = null; vndid = null; BankCode = null; expid = null; fromBoxid = beneficiary; }

            Model.ExpenseID = expid;
            Model.CustomerID = custId;
            Model.VendorID = vndid;

            Model.BankAccountCode = BankCode == null ? null : BankCode.toString();
            Model.BankName = txt_BenName.value;
            Model.FromCashBoxID = fromBoxid;
            Model.TrType = IQ_TrType;
            Model.TrDateH = "1";

            Model.TrNo = Reciept_TrNo;
            Model.VoucherNo = 0;
            Model.UpdatedAt = "";
            Model.IsDeffered = chkIsDeffered.checked;
            Model.CashBoxID = Number($('#txt_Receiving_Fund').val());


           Model.Branch_Code = SysSession.CurrentEnvironment.BranchCode;
           Model.Comp_Code = SysSession.CurrentEnvironment.CompCode;
           Model.MODULE_CODE = Modules.AccTrReceiptNote;
           Model.UserCode = SysSession.CurrentEnvironment.UserCode;
           Model.sec_FinYear = SysSession.CurrentEnvironment.CurrentYear;


        } 
    }

    function Insert() {
        Assign();

        if (!CheckDate(DateFormat(txtDateNew.value).toString(), DateFormat(SysSession.CurrentEnvironment.StartDate).toString(), DateFormat(SysSession.CurrentEnvironment.EndDate).toString())) {
            //MessageBox.Show('  التاريخ ليس متطابق مع تاريخ المتاح (' + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ')', '');
            WorningMessage("  التاريخ ليس متطابق مع تاريخ المتاح (" + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ")", "Date does not match available date(" + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ")", "تحذير", "worning");
            return
        }
        console.log(Model);
        Ajax.Callsync({
            type: "POST",

            url: sys.apiUrl("AccTrReceipt", "Insert"),
            data: JSON.stringify(Model),
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    let res;
                    res = result.Response as A_RecPay_Tr_ReceiptNote
                    ReceiptID = res.ReceiptID;
                    DisplayMassage("تم الحفظ بنجاح", "Saved successfully", MessageType.Succeed);
                    Valid = 0;
                    Update_claenData = 0;
                    $('#txt_D_CashBox').val('Null');
                    Display();
                    IsSuccess();
                    //DriverDoubleClick();     
                    Save_Succ_But();
                } else {
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
            return
        }
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("AccTrReceipt", "Update"),
            data: JSON.stringify(Model),
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    DisplayMassage("تم الحفظ بنجاح", "Success", MessageType.Succeed);
                    Update_claenData = 0;
                    $('#txt_D_CashBox').val('Null');
                    Display();
                    DriverDoubleClick();
                    $("#txtUpdatedBy").val(SysSession.CurrentEnvironment.UserCode);
                    $("#txtUpdatedAt").val(DateTimeFormat(Date().toString()));
                    Save_Succ_But();
                } else {
                    DisplayMassage("خطأء", "Error", MessageType.Error);
                    Update_claenData = 0;
                }
            }
        });

    }

    function IsSuccess() {
        IsNew = false;
        AddDisabled();
        Selecteditem = Details.filter(x => x.ReceiptID == Number(ReceiptID));
        Update_claenData = 1;
        DisplayAddStkGCodes();

        DisplayData(Selecteditem);
        ReceiptID = Selecteditem[0].ReceiptID;
        compcode = Selecteditem[0].CompCode;
        BranchCode = Selecteditem[0].BranchCode;
        //chkActive.disabled = true;


        Update_claenData = 0; 

        reference_Page();

        ////// 
        $('#btnUpdate').removeClass("display_none");
        $('#btnSave').addClass("display_none");
        $('#btnBack').addClass("display_none");

        // 
        if (Selecteditem[0].Status == 1) {
            chkActive.checked = true;
            btnUpdate.disabled = true;
            chkActive.disabled = false;
            chkActive.disabled = !SysSession.CurrentPrivileges.CUSTOM2
        }
        else {
            chkActive.checked = false;
            chkActive.disabled = true;
            btnUpdate.disabled = !SysSession.CurrentPrivileges.EDIT
        }

        $("#Div_control").removeClass("display_none");



    }

    export function PrintReport(OutType: number) {
        // 
        if (!SysSession.CurrentPrivileges.PrintOut) return;
        let rp: ReportParameters = new ReportParameters();

        rp.RepType = OutType;//output report as View
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

        if (txt_ReceiptNote.selectedIndex > 0)
            rp.RecType = Number($("#txt_ReceiptNote").val());
        else
            rp.RecType = -1;

        if (txt_D_CashBox.selectedIndex > 0)
            rp.BoxId = Number($("#txt_D_CashBox").val());
        else
            rp.BoxId = -1;
        /////////////////////////doniaH
        //if (txt_ID_beneficiary.selectedIndex > 0) {
        //    rp.BnfID = $("#txt_ID_beneficiary").val();
        //    rp.BnfDesc = txt_ID_beneficiary.value;
        //}

        if (txt_BenCodeH.value == "") {
            rp.BnfID = $("#txt_BenCodeH").val();
            rp.BnfDesc = txt_BenNameH.value;
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
        } else {
            rp.CashType = $("#txtCashType").val();
        }

        Ajax.Callsync({
            url: Url.Action("IProc_Rpt_AccReceiptList", "GeneralReports"),
            data: rp,
            success: (d) => {

                let result = d.result as string;

                PrintReportLog(SysSession.CurrentEnvironment.UserCode, SysSession.CurrentEnvironment.CompCode, SysSession.CurrentEnvironment.BranchCode, Modules.AccTrReceiptNote, SysSession.CurrentEnvironment.CurrentYear);

                window.open(result);
                // window.close(result)
            }
        })
    }

    function PrintTransaction() {

        if (!SysSession.CurrentPrivileges.PrintOut) return;
        let rp: ReportParameters = new ReportParameters();

        rp.Type = 0;
        rp.slip = 0;
        rp.Repdesign = 1;
        rp.TRId = ReceiptID;

        rp.Name_function = "rptReceiptNote";
        localStorage.setItem("Report_Data", JSON.stringify(rp));
        PrintTransactionLog(SysSession.CurrentEnvironment.UserCode, SysSession.CurrentEnvironment.CompCode, SysSession.CurrentEnvironment.BranchCode, Modules.AccTrReceiptNote, SysSession.CurrentEnvironment.CurrentYear, rp.TRId.toString());

        localStorage.setItem("result", '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>');
        window.open(Url.Action("ReportsPopup", "Home"), "_blank");
    }

    function btnPrintslip_onclick() {

        if (!SysSession.CurrentPrivileges.PrintOut) return;
        let rp: ReportParameters = new ReportParameters();

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
        rp.TRId = ReceiptID;
        Ajax.CallAsync({
            url: Url.Action("rptReceiptNote", "GeneralReports"),
            data: rp,
            success: (d) => {
                let result = d.result as string;
                PrintTransactionLog(SysSession.CurrentEnvironment.UserCode, SysSession.CurrentEnvironment.CompCode, SysSession.CurrentEnvironment.BranchCode, Modules.AccTrReceiptNote, SysSession.CurrentEnvironment.CurrentYear, rp.TRId.toString());

                window.open(result, "_blank");
            }
        })
    }

     ////////////////////////////////////////////////Display Vendors///////////////////////////
    function btnBenVnd_onclick() {

        sys.FindKey(Modules.AccTrReceiptNote, "btnVndSrch", "CompCode= " + compcode + "and IsCreditVendor = 1 and Isactive = 1", () => {
            let id = SearchGrid.SearchDataGrid.SelectedKey;
            PurchaserVndId = id;
            getAccountVndById(id, false);
        });
    }
    function getAccountVndById(custId: string, code: boolean) {

        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefVendor", "GetVendorByvndId_code"),
            data: { Compcode: compcode, code: code, VendorID: custId, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {

                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    AccountVndDetails = result.Response as Array<A_Pay_D_Vendor>;
                    if (AccountVndDetails.length == 0) {

                        $('#txt_BenCode').val("");
                        $('#txt_BenName').val("");
                        $('#txt_Openbalance').val("");
                        Errorinput(txt_BenCode);
                        DisplayMassage("كود المورد غير صحيح", "Wrong Customer code", MessageType.Error);

                    }
                    else {
                        if (IsNew == true && AccountVndDetails[0].Isactive == true) {
                            $('#txt_BenCode').val(AccountVndDetails[0].VendorCode);
                            $('#txt_BenName').val(AccountVndDetails[0].NAMEA);
                            $('#txt_Openbalance').val(AccountVndDetails[0].Openbalance);
                            GLOBALopenbalance = AccountVndDetails[0].Openbalance;
                            PurchaserVndId = AccountVndDetails[0].VendorID;
                        }
                        else if (IsNew == false && IsEdite == false) {
                            $('#txt_BenCode').val(AccountVndDetails[0].VendorCode);
                            $('#txt_BenName').val(AccountVndDetails[0].NAMEA);
                            $('#txt_Openbalance').val(AccountVndDetails[0].Openbalance);
                            GLOBALopenbalance = AccountVndDetails[0].Openbalance;
                            PurchaserVndId = AccountVndDetails[0].VendorID;
                        } else if ((IsNew == false && IsEdite == true && AccountVndDetails[0].Isactive == true)) {
                            $('#txt_BenCode').val(AccountVndDetails[0].VendorCode);
                            $('#txt_BenName').val(AccountVndDetails[0].NAMEA);
                            $('#txt_Openbalance').val(AccountVndDetails[0].Openbalance);
                            GLOBALopenbalance = AccountVndDetails[0].Openbalance;
                            PurchaserVndId = AccountVndDetails[0].VendorID;
                        } else {
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

        sys.FindKey(Modules.AccTrReceiptNote, "btnVndSrch", "CompCode= " + compcode + "and IsCreditVendor = 1", () => {
            let id = SearchGrid.SearchDataGrid.SelectedKey;
            PurchaserVndIdH = id;
            getAccountVndHById(id, false);
        });
    }
    function getAccountVndHById(custId: string, code: boolean) {

        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefVendor", "GetVendorByvndId_code"),
            data: { Compcode: compcode, code: code, VendorID: custId, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {

                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    AccountVndDetails = result.Response as Array<A_Pay_D_Vendor>;
                    if (AccountVndDetails.length == 0) {

                        $('#txt_BenCodeH').val("");
                        $('#txt_BenNameH').val("");
                        Errorinput(txt_BenCodeH);
                        DisplayMassage("كود المورد غير صحيح", "Wrong Customer code", MessageType.Error);

                    }
                    else {
                        $('#txt_BenCodeH').val(AccountVndDetails[0].VendorCode);
                        $('#txt_BenNameH').val(AccountVndDetails[0].NAMEA);
                        PurchaserVndId = AccountVndDetails[0].VendorID;
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

        let cond = "and Isactive = 1";
        if (SysSession.CurrentEnvironment.I_Control[0].IsLocalBranchCustomer == true) { cond = cond + " and BranchCode=" + BranchCode; }

        sys.FindKey(Modules.AccTrReceiptNote, "btnCustSrch", "CompCode= " + compcode + "" + cond, () => {
            var id = SearchGrid.SearchDataGrid.SelectedKey;

            getAccountCustById(id, false);
        });
    }
    function getAccountCustById(custId: string, code: boolean) {

        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefCustomer", "GetCustomerByCustomerId_code"),
            data: { Compcode: compcode, BranchCode: BranchCode, code: code, CustomerId: custId, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    AccountVendorDetails = result.Response as Array<IQ_GetCustomer>;
                    if (AccountVendorDetails.length == 0) {

                        $('#txt_BenCode').val("");
                        $('#txt_BenName').val("");
                        $('#txt_Openbalance').val("");
                        Errorinput(txt_BenCode);
                        DisplayMassage("كود العميل غير صحيح", "Wrong Customer code", MessageType.Error);

                    }
                    else {
                        if (IsNew == true && AccountVendorDetails[0].Isactive == true) {
                        $('#txt_BenCode').val(AccountVendorDetails[0].CustomerCODE);
                        $('#txt_BenName').val(AccountVendorDetails[0].NAMEA);
                        $('#txt_Openbalance').val(AccountVendorDetails[0].Openbalance);
                        GLOBALopenbalance = AccountVendorDetails[0].Openbalance;
                            PurchaserCustId = AccountVendorDetails[0].CustomerId;
                        } else if (IsNew == false && IsEdite == false) {    
                            $('#txt_BenCode').val(AccountVendorDetails[0].CustomerCODE);
                            $('#txt_BenName').val(AccountVendorDetails[0].NAMEA);
                            $('#txt_Openbalance').val(AccountVendorDetails[0].Openbalance);
                            GLOBALopenbalance = AccountVendorDetails[0].Openbalance;
                            PurchaserCustId = AccountVendorDetails[0].CustomerId;
                        } else if (IsNew == false && IsEdite == true && AccountVendorDetails[0].Isactive == true) {    
                            $('#txt_BenCode').val(AccountVendorDetails[0].CustomerCODE);
                            $('#txt_BenName').val(AccountVendorDetails[0].NAMEA);
                            $('#txt_Openbalance').val(AccountVendorDetails[0].Openbalance);
                            GLOBALopenbalance = AccountVendorDetails[0].Openbalance;
                            PurchaserCustId = AccountVendorDetails[0].CustomerId;
                        }
                        else {
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

        let cond = "";
        if (SysSession.CurrentEnvironment.I_Control[0].IsLocalBranchCustomer == true) { cond = cond + " and BranchCode=" + BranchCode; }

        getAccountCustById(txt_BenCode.value, true);

    }

    function btnBenCustH_onclick() {

        let cond = "";
        if (SysSession.CurrentEnvironment.I_Control[0].IsLocalBranchCustomer == true) { cond = cond + " and BranchCode=" + BranchCode; }


        sys.FindKey(Modules.AccTrReceiptNote, "btnCustSrch", "CompCode= " + compcode + "" + cond, () => {
            var id = SearchGrid.SearchDataGrid.SelectedKey;
            GlobalCustIDH = id;
            getAccountCustHById(id, false);
        });
    }
    function getAccountCustHById(custId: string, code: boolean) {

        let cond = "";
        if (SysSession.CurrentEnvironment.I_Control[0].IsLocalBranchCustomer == true) { cond = cond + " and BranchCode=" + BranchCode; }


        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefCustomer", "GetCustomerByCustomerId_code"),
            data: { Compcode: compcode, BranchCode: BranchCode, code: code, CustomerId: custId, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    AccountVendorDetails = result.Response as Array<IQ_GetCustomer>;
                    if (AccountVendorDetails.length == 0) {

                        $('#txt_BenCodeH').val("");
                        $('#txt_BenNameH').val("");
                        Errorinput(txt_BenCodeH);
                        DisplayMassage("كود العميل غير صحيح", "Wrong Customer code", MessageType.Error);

                    }
                    else {
                        $('#txt_BenCodeH').val(AccountVendorDetails[0].CustomerCODE);
                        $('#txt_BenNameH').val(AccountVendorDetails[0].NAMEA);
                        PurchaserCustId = AccountVendorDetails[0].CustomerId;;
                    }

                }

            }
        });

    }
    function txt_BenCustCodeH_onchange() {

        let cond = "";
        if (SysSession.CurrentEnvironment.I_Control[0].IsLocalBranchCustomer == true) { cond = cond + " and BranchCode=" + BranchCode; }


        getAccountCustHById(txt_BenCodeH.value, true);

    }

    ////////////////////////////////////////////////Display Bank///////////////////////////

    function btnBenBank_onclick() {
        sys.FindKey(Modules.AccTrReceiptNote, "btnbankSearch", "COMP_CODE= " + compcode + "and ACC_TYPE = 3 and ACC_ACTIVE = 1", () => {
            var id = SearchGrid.SearchDataGrid.SelectedKey;

            getAccountBankById(id, true);
        });
    }
    function getAccountBankById(custId: string, code: boolean) {
        debugger
        if (custId.trim() == '') {
            custId = '999999999999';
        }
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GLDefAccount", "GetByAccCode"),
            data: { CompCode: compcode, AccCode: custId, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    AccountBankDetails = result.Response as A_ACCOUNT;
                    debugger
                    if (AccountBankDetails == null) {

                        $('#txt_BenCode').val("");
                        $('#txt_BenName').val("");
                        $('#txt_Openbalance').val("");
                        Errorinput(txt_BenCode);
                        DisplayMassage("كود الحساب غير صحيح", "Wrong Bank code", MessageType.Error);

                    }
                    else {
                        if (IsNew == true && AccountBankDetails.ACC_ACTIVE == true) {
                            txt_BenCode.value = AccountBankDetails.ACC_CODE;
                            txt_BenName.value = AccountBankDetails.ACC_DESCA;
                            PurchaserBankId = AccountBankDetails.ACC_CODE;
                        } else if (IsNew == false && IsEdite == false) {
                            txt_BenCode.value = AccountBankDetails.ACC_CODE;
                            txt_BenName.value = AccountBankDetails.ACC_DESCA;
                            PurchaserBankId = AccountBankDetails.ACC_CODE;
                        } else if (IsNew == false && IsEdite == true && AccountBankDetails.ACC_ACTIVE == true) {
                            txt_BenCode.value = AccountBankDetails.ACC_CODE;
                            txt_BenName.value = AccountBankDetails.ACC_DESCA;
                            PurchaserBankId = AccountBankDetails.ACC_CODE;
                        } else {
                            $('#txt_BenCode').val("");
                            $('#txt_BenName').val("");
                            $('#txt_Openbalance').val("");
                            Errorinput(txt_BenCode);
                            DisplayMassage("كود الحساب غير صحيح", "Wrong Bank code", MessageType.Error);
                        }
                    }

                }
                else {
                    $('#txt_BenCode').val("");
                    $('#txt_BenName').val("");
                    $('#txt_Openbalance').val("");
                    Errorinput(txt_BenCode);
                    DisplayMassage("كود الحساب غير صحيح", "Wrong Bank code", MessageType.Error);
                }

            }
        });

    }
    function txt_BenBankCode_onchange() {
        getAccountBankById(txt_BenCode.value, true);

    }

    function btnBenBankH_onclick() {
        sys.FindKey(Modules.AccTrReceiptNote, "btnbankSearch", "COMP_CODE= " + compcode + "and ACC_TYPE = 3", () => {
            var id = SearchGrid.SearchDataGrid.SelectedKey;
            GlobalBankIDH = id;
            getAccountBankHById(id, true);
        });
    }
    function getAccountBankHById(custId: string, code: boolean) {

        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GLDefAccount", "GetByAccCode"),
            data: { CompCode: compcode, AccCode: custId, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    AccountBankDetails = result.Response as A_ACCOUNT;
                    if (AccountBankDetails.ACC_CODE == "") {

                        $('#txt_BenCodeH').val("");
                        $('#txt_BenNameH').val("");
                        Errorinput(txt_BenCodeH);
                        DisplayMassage("كود الحساب غير صحيح", "Wrong Bank code", MessageType.Error);

                    }
                    else {
                        txt_BenCodeH.value = AccountBankDetails.ACC_CODE;
                        txt_BenNameH.value = AccountBankDetails.ACC_DESCA;

                        //$('#txt_Openbalance').val("0");
                        //GLOBALopenbalance = AccountBankDetails[0].Openbalance;
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

        sys.FindKey(Modules.AccTrReceiptNote, "btnAccBen", "CompCode= " + compcode + " and TrType = 1 ", () => {
            var id = SearchGrid.SearchDataGrid.SelectedKey;

            getAccountAccById(id, false);
        });
    }
    function getAccountAccById(custId: string, code: boolean) {

        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefAccounts", "GetByCode_and_byid"),
            data: { CompCode: compcode, id: custId, code: code, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {

                    AccountAccDetails = result.Response as Array<A_RecPay_D_Accounts>;
                    if (AccountAccDetails.length == 0) {

                        $('#txt_BenCode').val("");
                        $('#txt_BenName').val("");
                        $('#txt_Openbalance').val("");
                        Errorinput(txt_BenCode);
                        DisplayMassage("كود الحساب غير صحيح", "Wrong Bank code", MessageType.Error);

                    }
                    else {
                        $('#txt_BenCode').val(AccountAccDetails[0].ExpCode);
                        $('#txt_BenName').val(AccountAccDetails[0].ExpDescA);
                        $('#txt_Openbalance').val("0");
                        //GLOBALopenbalance = AccountBankDetails[0].Openbalance;
                        PurchaserAccId = AccountAccDetails[0].ExpenseID;
                        expid = AccountAccDetails[0].ExpenseID; 
                    }

                }

            }
        });

    }
    function BenAccCode_onchange() {
        getAccountAccById(txt_BenCode.value, true);

    }

    function btnBenAccH_onclick() {

        sys.FindKey(Modules.AccTrReceiptNote, "btnAccBen", "CompCode= " + compcode + " and TrType = 1 ", () => {
            var id = SearchGrid.SearchDataGrid.SelectedKey;
            GlobalAccIDH = id;
            getAccountAccHById(id, false);
        });
    }
    function getAccountAccHById(custId: string, code: boolean) {

        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefAccounts", "GetByCode_and_byid"),
            data: { CompCode: compcode, id: custId, code: code, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {

                    AccountAccDetails = result.Response as Array<A_RecPay_D_Accounts>;
                    if (AccountAccDetails.length == 0) {

                        $('#txt_BenCodeH').val("");
                        $('#txt_BenNameH').val("");
                        Errorinput(txt_BenCodeH);
                        DisplayMassage("كود الحساب غير صحيح", "Wrong Bank code", MessageType.Error);

                    }
                    else {
                        $('#txt_BenCodeH').val(AccountAccDetails[0].ExpCode);
                        $('#txt_BenNameH').val(AccountAccDetails[0].ExpDescA); 
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

        sys.FindKey(Modules.AccTrReceiptNote, "btnBoxSearch", "CompCode= " + compcode + "  and IsActive = 1", () => {
            var id = SearchGrid.SearchDataGrid.SelectedKey;

            getAccountBoxById(id, false);
        });
    }
    function getAccountBoxById(custId: string, code: boolean) {

        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefBox", "GetByIdpaynote"),
            data: { code: code, compCode: compcode, BranchCode: BranchCode, CashBoxID: custId, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    AccountBoxDetails = result.Response as Array<A_RecPay_D_CashBox>;
                    if (AccountBoxDetails.length == 0) {

                        $('#txt_BenCode').val("");
                        $('#txt_BenName').val("");
                        $('#txt_Openbalance').val("");
                        Errorinput(txt_BenCode);
                        DisplayMassage("كود الصندوق غير صحيح", "Wrong CashBox code", MessageType.Error);

                    }
                    else {
                        if (IsNew == true && AccountBoxDetails[0].IsActive == true) {
                        $('#txt_BenCode').val(AccountBoxDetails[0].CashBoxID);
                        $('#txt_BenName').val(AccountBoxDetails[0].CashBox_DescA);
                        $('#txt_Openbalance').val("0");                                 
                            PurchaserBoxId = AccountBoxDetails[0].CashBoxID;
                        }
                        else if (IsNew == false && IsEdite == false) {
                            $('#txt_BenCode').val(AccountBoxDetails[0].CashBoxID);
                            $('#txt_BenName').val(AccountBoxDetails[0].CashBox_DescA);
                            $('#txt_Openbalance').val("0");
                            PurchaserBoxId = AccountBoxDetails[0].CashBoxID;

                        } else if (IsNew == false && IsEdite == true && AccountBoxDetails[0].IsActive == true) {
                            $('#txt_BenCode').val(AccountBoxDetails[0].CashBoxID);
                            $('#txt_BenName').val(AccountBoxDetails[0].CashBox_DescA);
                            $('#txt_Openbalance').val("0");
                            PurchaserBoxId = AccountBoxDetails[0].CashBoxID;
                        } else {
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

        sys.FindKey(Modules.AccTrReceiptNote, "btnBoxSearch", "CompCode= " + compcode + "", () => {
            var id = SearchGrid.SearchDataGrid.SelectedKey;
            GlobalBoxIDH = id;
            getAccountBoxHById(id, false);
        });
    }
    function getAccountBoxHById(custId: string, code: boolean) {

        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefBox", "GetById"),
            data: { code: code, compCode: compcode, BranchCode: BranchCode, CashBoxID: custId, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    AccountBoxDetails = result.Response as Array<A_RecPay_D_CashBox>;
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
        if (txt_ReceiptNoteNew.value == "1") { btnBenCust_onclick(); }
        if (txt_ReceiptNoteNew.value == "2") { btnBenVnd_onclick(); }
        if (txt_ReceiptNoteNew.value == "3") { btnBenBank_onclick(); }
        if (txt_ReceiptNoteNew.value == "4") { btnBenAcc_onclick(); }
        if (txt_ReceiptNoteNew.value == "5") { btnBenBox_onclick(); }
    }

    function txt_BenCode_onchange() {
        if (txt_ReceiptNoteNew.value == "1") { txt_BenCustCode_onchange(); }
        if (txt_ReceiptNoteNew.value == "2") { txt_BenVndCode_onchange(); }
        if (txt_ReceiptNoteNew.value == "3") { txt_BenBankCode_onchange(); }
        if (txt_ReceiptNoteNew.value == "4") { BenAccCode_onchange(); }
        if (txt_ReceiptNoteNew.value == "5") { txt_BenBoxCode_onchange(); }
    }

    function btnBenH_onclick() {
        if (txt_ReceiptNote.value == "Null") {
            Errorinput(txt_ReceiptNoteNew);
            DisplayMassage("اختر نوع الاستلام", "choose ReceiptNote", MessageType.Error);
        }
        if (txt_ReceiptNote.value == "1") { btnBenCustH_onclick(); }
        if (txt_ReceiptNote.value == "2") { btnBenVndH_onclick(); }
        if (txt_ReceiptNote.value == "3") { btnBenBankH_onclick(); }
        if (txt_ReceiptNote.value == "4") { btnBenAccH_onclick(); }
        if (txt_ReceiptNote.value == "5") { btnBenBoxH_onclick(); }
    }

    function txt_BenCodeH_onchange() {
        if (txt_ReceiptNote.value == "Null") {
            txt_BenCodeH.value = "";
            Errorinput(txt_ReceiptNoteNew);
            DisplayMassage("اختر نوع الاستلام", "choose ReceiptNote", MessageType.Error);
        }
        if (txt_ReceiptNote.value == "1") { txt_BenCustCodeH_onchange(); }
        if (txt_ReceiptNote.value == "2") { txt_BenVndCodeH_onchange(); }
        if (txt_ReceiptNote.value == "3") { txt_BenBankCodeH_onchange(); }
        if (txt_ReceiptNote.value == "4") { BenAccCodeH_onchange(); }
        if (txt_ReceiptNote.value == "5") { txt_BenBoxCodeH_onchange(); }
    }

    function Amount_onchange() {
        debugger;
        var Currency = sys.SysSession.CurrentEnvironment.I_Control[0].Currencyid
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccTrReceipt", "TafkeetArab"),
            data: {
                Currency: Number(Currency), Amount: Number(txt_Amount.value), lang: lang
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    var Currency_ = result.Response;
                    $("#txt_AmountCurrency").text((lang == "ar" ? "المبلغ كتابةً " : "Amount in writing ") + " ( " + Currency_ + " ) ");
                }
            }
        });
    }

    function btnPrintsFrom_To_onclick() {
        btnShow_onclick();

        if (custId == 0) { custId = null; }
        if (vndid == 0) { vndid = null; }
        if (BankCode == 0) { BankCode = null; }
        if (expid == 0) { expid = null; }
        if (fromBoxid == 0) { fromBoxid = null; }
        if (Boxid == 0) { Boxid = null; }
        if (RecPayTypeId == 0) { RecPayTypeId = null; }
        if (CashType == 1001) { CashType = null; }
        if (Status == "All") { Status = null; }



        try {
  
            let Name_ID = 'ReceiptID'
            let NameTable = 'IQ_GetBoxReceiveList'
            let Condation1 = "  TrType=" + IQ_TrType + " and CompCode = " + compcode + " and BranchCode =" + BranchCode + " " +
                " and TrDate >=' " + DateFrom + "' and TrDate <= ' " + DateTo + " ' ";
            let Condation2 = " ";

             
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
            let Condation3 = Condation1 + Condation2 + " ORDER BY TrNo ASC;";

          

            PrintsFrom_To(TransType.AccReceive, Name_ID, NameTable, Condation3, Details.length)



        } catch (e) {

            return
        }

    }
} 