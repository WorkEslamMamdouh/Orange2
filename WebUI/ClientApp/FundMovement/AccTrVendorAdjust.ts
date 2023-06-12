
$(document).ready(() => {
    AccTrVendorAdjust.InitalizeComponent();
})

namespace AccTrVendorAdjust {

    var IQ_TrType = 1;
    var AccType = 2;
    var TrType = 1;
    var custId = 0;

    var isCustomer = false;
    var IsDebit: number = 2;
    var Status: number = 2;
    var IsdebitNew = true;

    var codeType = "RecType";
    var Details: Array<IQ_GetBoxAdjustmentList> = new Array<IQ_GetBoxAdjustmentList>();
    var BilldIData: Array<IQ_GetBoxAdjustmentList> = new Array<IQ_GetBoxAdjustmentList>();
    var ReportGrid: JsGrid = new JsGrid();
    var Details_Type_D_CashBox: Array<A_RecPay_D_CashBox> = new Array<A_RecPay_D_CashBox>();
    var Details_AjustmentType: Array<A_RecPay_D_AjustmentType> = new Array<A_RecPay_D_AjustmentType>();
    var Details_AjustmentTypeNew: Array<A_RecPay_D_AjustmentType> = new Array<A_RecPay_D_AjustmentType>();
    var Model: A_RecPay_Tr_Adjustment = new A_RecPay_Tr_Adjustment();

    var CashDetailsAr: Array<string> = new Array<string>();
    var CashDetailsEn: Array<string> = new Array<string>();

    var Details_Vendor: Array<A_Pay_D_Vendor> = new Array<A_Pay_D_Vendor>();
    var VatTypeDetails: Array<A_D_VAT_TYPE> = new Array<A_D_VAT_TYPE>();
    //var Details_Vendor: Array<A_Pay_D_Vendor> = new Array<A_Pay_D_Vendor>();
    var Details_ACCOUNT: Array<A_ACCOUNT> = new Array<A_ACCOUNT>();
    var Details_Pay_D_Accounts: Array<A_RecPay_D_Accounts> = new Array<A_RecPay_D_Accounts>();

    var sys: SystemTools = new SystemTools();
    var SysSession: SystemSession = GetSystemSession(Modules.AccTrVendorAdjust);
    //txt_ID_CustmNew
    //var txt_ID_Custm: HTMLSelectElement;
    var txt_Movement_typeNew: HTMLSelectElement;
    var txt_Settlement_type: HTMLSelectElement;
    //var txt_ID_CustmNew: HTMLSelectElement;

    var txt_Settlement_typeNew: HTMLSelectElement;
    var txtDateNew: HTMLInputElement;
    var txtDateFrom: HTMLInputElement;
    var txtDateTo: HTMLInputElement;
    var txt_Movement_type: HTMLSelectElement;
    var txt_Type_of_tax: HTMLSelectElement;
    var txt_Status: HTMLSelectElement;
    var txt_CODE: HTMLInputElement;
    var txt_note: HTMLInputElement;
    var searchbutmemreport: HTMLInputElement;
    var txt_VoucherNo: HTMLInputElement;
    var txt_Amount: HTMLInputElement;
    var txt_The_tax_amount: HTMLInputElement;
    var txt_Total_after_tax: HTMLInputElement;
    var txt_ReceiptDesc: HTMLInputElement;

    //----------------------------------------------------------------print buttons
    var btnPrintTrview: HTMLButtonElement;
    var btnPrintTrPDF: HTMLButtonElement;
    var btnPrintTrEXEL: HTMLButtonElement;
    var btnPrintTransaction: HTMLButtonElement;
    var btnPrint: HTMLButtonElement;
    //----------------------------------------------------------------
    var btnBack: HTMLButtonElement;
    var btnShow: HTMLButtonElement;
    var btnAdd: HTMLButtonElement;
    var btnEdit: HTMLButtonElement;
    var btnSave: HTMLButtonElement;
    var chkActive: HTMLInputElement;

    var compcode: Number;//SharedSession.CurrentEnvironment.CompCode;
    var branchcode: number;//SharedSession.CurrentEnvironment.branchcode;
    var IsNew;
    var index;
    var Selecteditem
    var AdjustmentIDUpdate: number = 0;

    var AdjustmentID;
    var Valid = 0;
    var SearchDetails;
    var Update_claenData = 0;
    var Type_ReceiptNote = true;
    var Type_Receipt;
    var Type_Receipt_New;
    var DateFrom;
    var DateTo;
    var vendorId;
    var GlobalvendorId;
    var vndid = 0;
    var BankCode = 0;
    var expid = 0;
    var fromBoxid = 0;
    var Boxid;
    var RecPayTypeId;
    var AdustmentTypeID;

    var EDIT = SysSession.CurrentPrivileges.EDIT;
    var AddNew = SysSession.CurrentPrivileges.AddNew;

    var CUSTOM1 = SysSession.CurrentPrivileges.CUSTOM1;
    var CUSTOM2 = SysSession.CurrentPrivileges.CUSTOM2;


    var AccountDetails: Array<A_Pay_D_Vendor> = new Array<A_Pay_D_Vendor>();
    var btnVnd: HTMLButtonElement;
    var txt_VndCode: HTMLInputElement;
    var txt_VndName: HTMLInputElement;
    var btnVndH: HTMLButtonElement;
    var txt_VndCodeH: HTMLInputElement;
    var txt_VndNameH: HTMLInputElement;

    var PurchaserId;
    var custIdfilter;
    var GLOBALopenbalance;

    var vndDetails: Array<A_Pay_D_Vendor> = new Array<A_Pay_D_Vendor>();

    //var Mode: number;

    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);
    export function InitalizeComponent() {

        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = " تسوية المورد";

        } else {
            document.getElementById('Screen_name').innerHTML = "Vendor Adjustment Note";

        }



        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        branchcode = Number(SysSession.CurrentEnvironment.BranchCode);
        InitalizeControls();
        InitalizeEvents();
        reference_Page();

        //Display_Settlement_type();
        DisplayAccDefVendor();
        filldType_of_tax();

        $('#txt_Status').prop('value', 2);

        txtDateFrom.value = DateStartMonth();
        txtDateTo.value = ConvertToDateDash(GetDate()) <= ConvertToDateDash(SysSession.CurrentEnvironment.EndDate) ? GetDate() : SysSession.CurrentEnvironment.EndDate;


    }

    function chkStatus_onchange() {


        if (IsNew != true) {
            //if (Selecteditem[0].IsPosted != true) {

                if (Selecteditem[0].Status == 1 && chkActive.checked == false) {
                    Open();
                    Display(); 
                    $('#Div_control').removeClass("display_none");
                    Selecteditem = Details.filter(x => x.AdjustmentID == Number(ReportGrid.SelectedKey));
                    AdjustmentID = Selecteditem[0].AdjustmentID;
                    if (Selecteditem[0].Status == 1) {
                        chkActive.checked = true;
                        btnEdit.disabled = true;
                        chkActive.disabled = false;
                        chkActive.disabled = !SysSession.CurrentPrivileges.CUSTOM2
                    }
                    else {
                        chkActive.checked = false;
                        chkActive.disabled = true;
                        btnEdit.disabled = !SysSession.CurrentPrivileges.EDIT
                    }
                }
            //}
            //else {
            //    chkActive.checked = true;
            //    DisplayMassage(" تم ترحيل الحسبات لا يمكنك فك الاعتماد ", "You can't de-IsPosted", MessageType.Worning);
            //}
        }

    }

    function Open() {

        IsNew = false;

        Assign();


        Model.CreatedAt = $('#txtCreatedAt').val();
        Model.CreatedBy = $('#txtCreatedBy').val();

        Model.UpdatedAt = DateTimeFormat(Date().toString());
        Model.UpdatedBy = SysSession.CurrentEnvironment.UserCode;

        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("AccTrAdjust", "Open"),
            data: JSON.stringify(Model),
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    DisplayMassage("تم الحفظ بنجاح", "Saved successfully", MessageType.Succeed);
                    Update_claenData = 1;
                } else {
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

        btnShow = document.getElementById("btnShow") as HTMLButtonElement;
        btnAdd = document.getElementById("btnAdd") as HTMLButtonElement;
        btnEdit = document.getElementById("btnUpdate") as HTMLButtonElement;
        btnSave = document.getElementById("btnSave") as HTMLButtonElement;
        btnBack = document.getElementById("btnBack") as HTMLButtonElement;



        //textBoxes
        txt_CODE = document.getElementById("txt_CODE") as HTMLInputElement;
        //txt_ID_Custm = document.getElementById("txt_ID_Custm") as HTMLSelectElement;
        //txt_ID_CustmNew = document.getElementById("txt_ID_CustmNew") as HTMLSelectElement;
        txt_Movement_typeNew = document.getElementById("txt_Movement_typeNew") as HTMLSelectElement;
        txt_Settlement_type = document.getElementById("txt_Settlement_type") as HTMLSelectElement;
        txt_Settlement_typeNew = document.getElementById("txt_Settlement_typeNew") as HTMLSelectElement;
        txt_Movement_type = document.getElementById("txt_Movement_type") as HTMLSelectElement;
        txt_Status = document.getElementById("txt_Status") as HTMLSelectElement;



        txt_VoucherNo = document.getElementById("txt_VoucherNo") as HTMLInputElement;
        txt_Amount = document.getElementById("txt_Amount") as HTMLInputElement;
        txt_The_tax_amount = document.getElementById("txt_The_tax_amount") as HTMLInputElement;
        txt_Total_after_tax = document.getElementById("txt_Total_after_tax") as HTMLInputElement;
        txt_ReceiptDesc = document.getElementById("txt_ReceiptDesc") as HTMLInputElement;
        txt_Type_of_tax = document.getElementById("txt_Type_of_tax") as HTMLSelectElement;

        txtDateNew = document.getElementById("txtDateNew") as HTMLInputElement;
        txtDateFrom = document.getElementById("txtDateFrom") as HTMLInputElement;
        txtDateTo = document.getElementById("txtDateTo") as HTMLInputElement;
        txt_note = document.getElementById("txt_note") as HTMLInputElement;

        chkActive = document.getElementById("chkStatus") as HTMLInputElement;
        searchbutmemreport = document.getElementById("searchbutmemreport") as HTMLInputElement;
        //print 
        btnPrintTrview = document.getElementById("btnPrintTrview") as HTMLButtonElement;
        btnPrintTrPDF = document.getElementById("btnPrintTrPDF") as HTMLButtonElement;
        btnPrintTrEXEL = document.getElementById("btnPrintTrEXEL") as HTMLButtonElement;
        btnPrintTransaction = document.getElementById("btnPrintTransaction") as HTMLButtonElement;
        btnPrint = document.getElementById("btnPrint") as HTMLButtonElement;


        btnVnd = document.getElementById("btnVnd") as HTMLButtonElement;
        txt_VndCode = document.getElementById("txt_VndCode") as HTMLInputElement;
        txt_VndName = document.getElementById("txt_VndName") as HTMLInputElement;
        btnVndH = document.getElementById("btnVndH") as HTMLButtonElement;
        txt_VndCodeH = document.getElementById("txt_VndCodeH") as HTMLInputElement;
        txt_VndNameH = document.getElementById("txt_VndNameH") as HTMLInputElement;

    }

    function InitalizeEvents() {
        //


        btnShow.onclick = Display;
        btnAdd.onclick = btnAdd_onclick;
        btnSave.onclick = btnsave_onClick;
        btnBack.onclick = btnback_onclick;
        btnEdit.onclick = btnEdit_onclick;
        searchbutmemreport.onkeyup = _SearchBox_Change;
        chkActive.onchange = chkStatus_onchange;
        txt_Amount.onkeyup = txt_Amount_onchange;
        txt_Type_of_tax.onchange = txt_Amount_onchange;

        //txt_ID_CustmNew.onchange = AccDefVendor_onchange;
        txt_Movement_type.onchange = txt_Movement_type_onchange;
        txt_Movement_typeNew.onchange = txt_Movement_typeNew_onchange;

        txtDateFrom.value = GetDate();
        txtDateTo.value = GetDate();

        btnPrintTrview.onclick = () => { PrintReport(1); }
        btnPrintTrPDF.onclick = () => { PrintReport(2); }
        btnPrintTrEXEL.onclick = () => { PrintReport(3); }
        btnPrint.onclick = () => { PrintReport(4); }

        btnPrintTransaction.onclick = PrintTransaction;

        btnVndH.onclick = btnVndH_OnClick;
        txt_VndCodeH.onchange = txt_VndCodeH_onchange;
        btnVnd.onclick = btnVnd_OnClick;
        txt_VndCode.onchange = txt_VndCode_onchange;
    }
    function txt_Movement_type_onchange() {
        $('#txt_Settlement_type').html('');

        $('#txt_Settlement_type').append('<option value="Null">' + (lang == "ar" ? "نوع التسوية" : "Settlement type") + ' </option>');
        if (txt_Movement_type.value != "Null") {
            IsdebitNew = txt_Movement_type.value == "true" ? true : false;
            Display_Settlement_type();
        }

    }
    function txt_Movement_typeNew_onchange() {
        $('#txt_Settlement_typeNew').html('');

        $('#txt_Settlement_typeNew').append('<option value="Null"> ' + (lang == "ar" ? "نوع التسوية" : "Settlement type") + '</option>');
        if (txt_Movement_typeNew.value != "Null") {
            IsdebitNew = txt_Movement_typeNew.value == "true" ? true : false;
            Display_Settlement_typeNew();
        }
    }
    function txt_Amount_onchange() {

        //var VatPerc = $('#' + txt_Type_of_tax.value + '').attr("VatPerc");

        //if (txt_Type_of_tax.value == "Null") { VatPerc = "0"; }
        //if (txt_Amount.value == null) { txt_Amount.value = "0"; }

        //txt_The_tax_amount.value = ((Number(txt_Amount.value) * Number(VatPerc)) / 100).toString();
        //txt_Total_after_tax.value = (Number(txt_The_tax_amount.value) + Number(txt_Amount.value)).toString();

        //if (txt_Type_of_tax.value == "Null") { txt_Type_of_tax.value = "0"; }
        if (txt_Amount.value == null) { txt_Amount.value = "0"; }

        txt_The_tax_amount.value = ((Number(txt_Amount.value) * Number($('option:selected', $("#txt_Type_of_tax")).attr('Date_VatPerc'))) / 100).toString();
        txt_Total_after_tax.value = (Number(txt_The_tax_amount.value) + Number(txt_Amount.value)).toString();

    }

    function btnEdit_onclick() {

        if (!SysSession.CurrentPrivileges.EDIT) return;
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
        var x1 = $("#id_div_Add").hasClass("disabledDiv");
        var x2 = $("#id_ReportGrid").hasClass("disabledDiv");

        (x1 == true) ? $("#id_div_Add").removeClass("disabledDiv") : $("#id_div_Add").addClass("disabledDiv");
        (x2 == true) ? $("#id_ReportGrid").removeClass("disabledDiv") : $("#id_ReportGrid").addClass("disabledDiv");

        reference_Page();
        chkActive.checked = false;

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
        btnVnd.setAttribute("disabled", "disabled");
        txt_VndCode.setAttribute("disabled", "disabled");

    }

    function removedisabled() {



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
        btnVnd.removeAttribute("disabled");
        txt_VndCode.removeAttribute("disabled");


    }

    function GetDate() {

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
        if (txt_Settlement_typeNew.selectedIndex == 0) {
            DisplayMassage("يجب اختيار نوع التسويه ", "The type of settlement must be chosen", MessageType.Worning);
            Errorinput(txt_Settlement_typeNew);
            return Valid = 1;
        }
        //if (txt_ID_CustmNew.selectedIndex == 0) {
        //    DisplayMassage("يجب اختيار المورد ", "The supplier must be chosen", MessageType.Worning);
        //    Errorinput(txt_ID_CustmNew);
        //    return Valid = 1;
        //} 
        if (txt_VndCode.value == "") {
            DisplayMassage("يجب اختيار المورد ", "The supplier must be chosen", MessageType.Worning);
            Errorinput(txt_VndCode);
            return Valid = 1;
        }
        if (txt_Type_of_tax.selectedIndex == 0) {
            DisplayMassage("يجب اختيار نوع الضريبة  ", "The tax type must be selected", MessageType.Worning);
            Errorinput(txt_Type_of_tax);
            return Valid = 1;
        }
        if (txt_Amount.value == "" || txt_Amount.value == "0") {
            DisplayMassage("يجب ادخال المبلغ ", "The amount must be entered", MessageType.Worning);
            Errorinput(txt_Amount);
            return Valid = 1;
        }

        return Valid = 0;
    }

    function TrNoFounBefore() {
        var res: boolean = true;
        var TrNo = txt_CODE.value;
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccTrAdjust", "TrNoFounBefore"),
            data: {
                TrNo: TrNo, isCustomer: isCustomer, compCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.Response == 0) {
                    res = true;
                }
                else
                    res = false;
            }
        });
        return res;
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


        Selecteditem = Details.filter(x => x.AdjustmentID == Number(ReportGrid.SelectedKey));
        AdjustmentID = Selecteditem[0].AdjustmentID;
        if (Selecteditem[0].Status == 1) {
            chkActive.checked = true;
            btnEdit.disabled = true;
            chkActive.disabled = false;
            chkActive.disabled = !SysSession.CurrentPrivileges.CUSTOM2
        }
        else {
            chkActive.checked = false;
            chkActive.disabled = true;
            btnEdit.disabled = !SysSession.CurrentPrivileges.EDIT
        }
        DisplayData(Selecteditem);
        reference_Page();
    }

    function DriverDoubleClick() {


        Update_claenData = 1;
         
        Selecteditem = Details.filter(x => x.AdjustmentID == Number(ReportGrid.SelectedKey));

        txt_Movement_typeNew.value = Selecteditem[0].IsDebit;
        txt_Movement_typeNew_onchange();

        DisplayData(Selecteditem);


        AdjustmentID = Selecteditem[0].AdjustmentID;
        compcode = Selecteditem[0].CompCode;
        branchcode = Selecteditem[0].BranchCode;

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
            chkActive.disabled = !SysSession.CurrentPrivileges.CUSTOM2
        }
        else {
            chkActive.checked = false;
            chkActive.disabled = true;
            btnEdit.disabled = !SysSession.CurrentPrivileges.EDIT
        }

        $('#Div_control').removeClass("display_none"); 

    }

    function DisplayData(Selecteditem: Array<IQ_GetBoxAdjustmentList>) {


        DocumentActions.RenderFromModel(Selecteditem[0]);
        let custid = Selecteditem[0].VendorId.toString();
        getAccountById(custid, false);
        $('#txt_Movement_typeNew').prop("value", Selecteditem[0].IsDebit);
        $('#txt_Settlement_typeNew').prop("value", Selecteditem[0].AdustmentTypeID);
        //$('#txt_ID_CustmNew').prop("value", Selecteditem[0].VendorId);
        $('#btnVnd').prop("value", Selecteditem[0].VendorId);


        //var openbalance = Number($('option:selected', txt_ID_CustmNew).attr('data-openbalance'));
        //if (txt_ID_CustmNew.value == "Null") { $('#txt_Openbalance').val(""); } else { $('#txt_Openbalance').val(openbalance); }


        if (btnVnd.value == "Null") { $('#txt_Openbalance').val(""); } else { $('#txt_Openbalance').val(GLOBALopenbalance); }
        var trDate: string = DateFormat(Selecteditem[0].TrDate);

        txtDateNew.value = trDate;

        Type_ReceiptNote = false;

        $('#txt_Type_of_tax').prop("value", Selecteditem[0].VatType);



    }

    function Display_Settlement_type() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GenDefAdjustment", "GetAll"),
            data: {
                CompCode: compcode, isCustomer: isCustomer, Isdebit: IsdebitNew, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    Details_AjustmentType = result.Response as Array<A_RecPay_D_AjustmentType>;

                    DisplayStkSettlement_type();
                }
            }
        });
    }

    function DisplayStkSettlement_type() {

        for (var i = 0; i < Details_AjustmentType.length; i++) {

            $('#txt_Settlement_type').append('<option value="' + Details_AjustmentType[i].AdustmentTypeID + '">' + (lang == "ar" ? Details_AjustmentType[i].Adj_DescA : Details_AjustmentType[i].Adj_DescE) + '</option>');

        }

    }

    function Display_Settlement_typeNew() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GenDefAdjustment", "GetAll"),
            data: {
                CompCode: compcode, isCustomer: isCustomer, Isdebit: IsdebitNew, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    Details_AjustmentTypeNew = result.Response as Array<A_RecPay_D_AjustmentType>;

                    DisplayStkSettlement_typeNew();
                }
            }
        });
    }

    function DisplayStkSettlement_typeNew() {

        for (var i = 0; i < Details_AjustmentTypeNew.length; i++) {

            $('#txt_Settlement_typeNew').append('<option value="' + Details_AjustmentTypeNew[i].AdustmentTypeID + '">' + (lang == "ar" ? Details_AjustmentTypeNew[i].Adj_DescA : Details_AjustmentTypeNew[i].Adj_DescE) + '</option>');

        }

    }
     
    function DisplayAccDefVendor() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefVendor", "GetAllWithCreditType"),
            data: {
                CompCode: compcode, isCredit: true, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                //;
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    Details_Vendor = result.Response as Array<A_Pay_D_Vendor>;
                    DisplayStVendor();

                }

            }
        });

    }

    function DisplayStVendor() {
        for (var i = 0; i < Details_Vendor.length; i++) {
            $('#txt_ID_Custm').append('<option value="' + Details_Vendor[i].VendorID + '">' + Details_Vendor[i].NAMEA + '</option>');
            var balance = Number((Number(Details_Vendor[i].Openbalance) - Number(Details_Vendor[i].Debit) + Number(Details_Vendor[i].Credit)).RoundToSt(2));
            $('#txt_ID_CustmNew').append('<option data-Openbalance="' + balance + '" value="' + Details_Vendor[i].VendorID + '">' + (lang == "ar" ? Details_Vendor[i].NAMEA : Details_Vendor[i].NAMEL) + '</option>');


        }


    }

    function filldType_of_tax() {
        //
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GenVatType", "GetAll"),
            data: {
                CompCode: compcode, VatType: 1, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    VatTypeDetails = result.Response as Array<A_D_VAT_TYPE>;

                    DisplayStVatTypeDetails();

                }
            }
        });
    }

    function DisplayStVatTypeDetails() {
        //    //
        for (var i = 0; i < VatTypeDetails.length; i++) {



            //$('#txt_Type_of_tax').append('<option id="' + VatTypeDetails[i].VatType + '" value="' + VatTypeDetails[i].VatType + '" VatPerc="' + VatTypeDetails[i].VatPerc + '" >' + VatTypeDetails[i].DESCRIPTION + '</option>');

            $('#txt_Type_of_tax').append('<option  Date_VatPerc="' + VatTypeDetails[i].VatPerc + '" value="' + VatTypeDetails[i].CODE + '">' + VatTypeDetails[i].DESCRIPTION + '</option>');

        }

    }

    function EnableControls() {
        if (!SysSession.CurrentPrivileges.AddNew) return;
 
        $('#btnSave').removeClass("display_none");
        $('#btnBack').removeClass("display_none");
        $('#btnUpdate').addClass("display_none");
        $('#btnPrintTransaction').addClass("display_none");

        $('#txt_Movement_typeNew').prop("selectedIndex", 0);
        $('#txt_Settlement_typeNew').prop("selectedIndex", 0);
        $('#txt_Type_of_tax').prop("selectedIndex", 0);
        //$('#txt_ID_CustmNew').prop("selectedIndex", 0);





        txt_CODE.value = "";
        txtDateNew.value = GetDate();
        txt_note.value = "";
        txt_VoucherNo.value = "";
        txt_Amount.value = "";
        txt_The_tax_amount.value = "";
        txt_ReceiptDesc.value = "";
        txt_Total_after_tax.value = "";
        txt_VndCode.value = "";
        txt_VndName.value = "";

        $('#txt_Openbalance').val('0');





    }

    function Assign_Display() {

        AdustmentTypeID = $("#txt_Settlement_type").val();

        if ($("#txt_Movement_type").val() == "Null") { IsDebit = 2; AdustmentTypeID = 0; }
        else if ($("#txt_Movement_type").val() == "true") { IsDebit = 1; }
        else { IsDebit = 0; }

        //if (IsDebit != "Null") {

        DateFrom = DateFormatRep(txtDateFrom.value);
        DateTo = DateFormatRep(txtDateTo.value);
        custId = custId;
        Status = Number(txt_Status.value);


        if (AdustmentTypeID == "Null") { AdustmentTypeID = 0; }
        if (txt_VndCodeH.value == "") { GlobalvendorId = 0; }
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
            debugger
            Ajax.Callsync({
                type: "Get",
                url: sys.apiUrl("AccTrAdjust", "GetAccTrAdjustList"),
                data: {
                    comp: compcode, BranchCode: branchcode, IsDebit: IsDebit, isCustomer: isCustomer, Status: Status, FromDate: DateFrom, Todate: DateTo, AdustmentTypeID: AdustmentTypeID, custId: custId, vendorId: GlobalvendorId, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
                },
                success: (d) => {
                    //;
                    let result = d as BaseResponse;
                    if (result.IsSuccess) {
                        Details = result.Response as Array<IQ_GetBoxAdjustmentList>;


                        for (var i = 0; i < Details.length; i++) {

                            Details[i].TrDate = DateFormat(Details[i].TrDate);
                            if (Details[i].IsDebit) {
                                Details[i].IsDebitNew = (lang == "ar" ? "مدين" : "Debit");
                            }
                            else { Details[i].IsDebitNew = (lang == "ar" ? "دأئن" : "Creditor"); }

                            if (Details[i].Status == 1) { Details[i].Status_New = (lang == "ar" ? "معتمد " : "A certified"); }
                            else { Details[i].Status_New = (lang == "ar" ? "غير معتمد " : "Not supported"); }

                        }

                        InitializeGrid();
                        //filter_DataSource();
                        ReportGrid.DataSource = Details;
                        ReportGrid.Bind();
                        $('#Div_control').addClass("display_none");

                    }

                }
            });
        }
    }

    function _SearchBox_Change() {
        //  k//;
        $("#ReportGrid").jsGrid("option", "pageIndex", 1);

        if (searchbutmemreport.value != "") {



            let search: string = searchbutmemreport.value.toLowerCase();
            SearchDetails = Details.filter(x => x.TrNo.toString().search(search) >= 0 || x.Adj_DescA.toLowerCase().search(search) >= 0 || x.Vnd_NameE.toLowerCase().search(search) >= 0 || x.Vnd_NameA.toLowerCase().search(search) >= 0 || x.Adj_DescE.toLowerCase().search(search) >= 0); /*|| x.MOBILE.toLowerCase().search(search) >= 0*/
            //    || x.CustomerCODE.toString().search(search) >= 0 /* || x.CreditLimit.toString().search(search) >= 0 || x.Emp_NameA.toString().search(search) >= 0
            //    || x.ContactMobile.toString().search(search) >= 0 /*|| x.DueAmount.toString().search(search) >= 0 *//*|| x.DaysDiff.toString().search(search) >= 0*/);

            ReportGrid.DataSource = SearchDetails;
            ReportGrid.Bind();
        } else {
            ReportGrid.DataSource = Details;
            ReportGrid.Bind();
        }
    }

    function InitializeGrid() {

        let res: any = GetResourceList("");
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
        ReportGrid.OnItemEditing = () => { };
        ReportGrid.Columns = [
            { title: "الرقم", name: "AdjustmentID", type: "text", width: "100px", visible: false },
            { title: res.App_InvoiceNum, name: "TrNo", type: "text", width: "100px" },
            { title: res.App_date, name: "TrDate", type: "text", width: "100px" },
            { title: res.App_MovementType, name: "IsDebitNew", type: "text", width: "100px" },
            { title: res.App_Settlement_type, name: (lang == "ar" ? "Adj_DescA" : "Adj_DescE"), type: "text", width: "100px" },
            { title: res.App_VendorNumber, name: "VendorCode", type: "text", width: "100px" },
            {
                title: res.I_Vendor, name: (lang == "ar" ? "Vnd_NameA" : "Vnd_NameE"), type: "text", width: "100px"
            },
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
            DocumentActions.AssignToModel(Model);//Insert Update
            if (chkActive.checked) { Model.Status = 1 }
            else { Model.Status = 0 }
            Model.CompCode = Number(SysSession.CurrentEnvironment.CompCode);
            Model.BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);
            Model.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
            Model.UserCode = SysSession.CurrentEnvironment.UserCode;

            Model.CreatedAt = DateTimeFormat(Date().toString());
            Model.CreatedBy = SysSession.CurrentEnvironment.UserCode;
            Model.AdjustmentID = AdjustmentID;

            Model.IsDebit = $('#txt_Movement_typeNew').val();
            Model.AdustmentTypeID = $('#txt_Settlement_typeNew').val();
            Model.VendorId = PurchaserId;
            Model.VatType = $('#txt_Type_of_tax').val();
            //$('#txt_Type_of_tax').prop("value", Selecteditem[0].VatPe
            Model.CustomerId = null;
            Model.TrDateH = "1";
            Model.TrNo = 0;
            Model.IsCustomer = isCustomer;

            Model.Branch_Code = SysSession.CurrentEnvironment.BranchCode;
            Model.Comp_Code = SysSession.CurrentEnvironment.CompCode;
            Model.MODULE_CODE = Modules.AccTrVendorAdjust;
            Model.UserCode = SysSession.CurrentEnvironment.UserCode;
            Model.sec_FinYear = SysSession.CurrentEnvironment.CurrentYear;

 


        }
        else {

            DocumentActions.AssignToModel(Model);//Insert Update
            if (chkActive.checked) { Model.Status = 1 }
            else { Model.Status = 0 }


            Model.CreatedAt = $('#txtCreatedAt').val();
            Model.CreatedBy = $('#txtCreatedBy').val();

            Model.UpdatedAt = DateTimeFormat(Date().toString());
            Model.UpdatedBy = SysSession.CurrentEnvironment.UserCode;

            Model.CompCode = Number(compcode);
            Model.BranchCode = Number(branchcode);
            Model.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
            Model.UserCode = SysSession.CurrentEnvironment.UserCode;


            Model.AdjustmentID = AdjustmentID;

            Model.IsDebit = $('#txt_Movement_typeNew').val();
            Model.AdustmentTypeID = $('#txt_Settlement_typeNew').val();
            Model.VendorId = PurchaserId;
            Model.VatType = $('#txt_Type_of_tax').val();
            Model.CustomerId = null;
            Model.TrDateH = "1";
            Model.TrNo = txt_CODE.value;
            Model.IsCustomer = isCustomer;

            Model.Branch_Code = SysSession.CurrentEnvironment.BranchCode;
            Model.Comp_Code = SysSession.CurrentEnvironment.CompCode;
            Model.MODULE_CODE = Modules.AccTrVendorAdjust;
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
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("AccTrAdjust", "Insert"),
            data: JSON.stringify(Model),
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    let res = result.Response as A_RecPay_Tr_Adjustment;
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
            return
        }
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("AccTrAdjust", "Update"),
            data: JSON.stringify(Model),
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    let res = result.Response as A_RecPay_Tr_Adjustment;
                    AdjustmentID = res.AdjustmentID;
                    DisplayMassage("تم الحفظ بنجاح", "Success", MessageType.Succeed);

                    Success();

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

    function Success() {
        IsNew = true; 
        btnback_onclick();

        Display(); 
        $('#Div_control').removeClass("display_none");
        Update_claenData = 1;

        Selecteditem = Details.filter(x => x.AdjustmentID == Number(AdjustmentID));

        txt_Movement_typeNew.value = Selecteditem[0].IsDebit;
        txt_Movement_typeNew_onchange();

        DisplayData(Selecteditem);


        AdjustmentID = Selecteditem[0].AdjustmentID;
        compcode = Selecteditem[0].CompCode;
        branchcode = Selecteditem[0].BranchCode;

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
            chkActive.disabled = !SysSession.CurrentPrivileges.CUSTOM2
        }
        else {
            chkActive.checked = false;
            chkActive.disabled = true;
            btnEdit.disabled = !SysSession.CurrentPrivileges.EDIT
        }


         $("#txtUpdatedBy").val(SysSession.CurrentEnvironment.UserCode);
        $("#txtUpdatedAt").val(DateTimeFormat(Date().toString())); 

    }

    export function PrintReport(OutType: number) {
        debugger
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

        var AdjDebit;
        var AdjId;
        var CustomerID;
        var VendorId;
        var status;

        if ($("#txt_Movement_type").val() == "Null")
            AdjDebit = -1;
        else if ($("#txt_Movement_type").val() == "true")
            AdjDebit = 1;
        else
            AdjDebit = 0;

        if ($("#txt_Settlement_type").val() == "Null")
            AdjId = -1;
        else
            AdjId = Number($("#txt_Settlement_type").val());

        //////// old is txt_ID_Custm
        if ($("#txt_CustCodeH").val() == "Null")
            VendorId = -1;
        else
            VendorId = Number($("#txt_CustCodeH").val());

        if (txt_Status.selectedIndex > 0)
            status = Number($("#txt_Status").val());
        else
            status = 2;

        rp.AdjDebit = AdjDebit;
        rp.AdjId = AdjId;
        rp.TrType = 0;
        rp.CustomerID = -1;
        rp.VendorId = VendorId;
        rp.Status = status;

        Ajax.Callsync({
            url: Url.Action("IProc_Rep_AccAdjustList", "GeneralReports"),
            data: rp,
            success: (d) => {

                let result = d.result as string;

                PrintReportLog(SysSession.CurrentEnvironment.UserCode, SysSession.CurrentEnvironment.CompCode, SysSession.CurrentEnvironment.BranchCode, Modules.AccTrVendorAdjust, SysSession.CurrentEnvironment.CurrentYear);

                window.open(result, "_blank");
            }
        })
    }

    function PrintTransaction() {
        if (!SysSession.CurrentPrivileges.PrintOut) return;
        let rp: ReportParameters = new ReportParameters();

        rp.Type = 0;
        rp.Repdesign = 0;
        rp.TRId = AdjustmentID;
        rp.Name_function = "rptAdjustNote";
        localStorage.setItem("Report_Data", JSON.stringify(rp));
        

        localStorage.setItem("result", '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>');
        window.open(Url.Action("ReportsPopup", "Home"), "_blank");
    }


    function btnVndH_OnClick() {

        sys.FindKey(Modules.AccTrVendorAdjust, "btnVndSearch", "CompCode= " + compcode + "and IsCreditVendor = 1", () => {
            let id = SearchGrid.SearchDataGrid.SelectedKey;
            GlobalvendorId = id;
            getAccountHById(id, false);
        });
    }
    function getAccountHById(custId: string, code: boolean) {

        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefVendor", "GetVendorByvndId_code"),
            data: { Compcode: compcode, code: code, VendorID: custId, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {

                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    AccountDetails = result.Response as Array<A_Pay_D_Vendor>;
                    if (AccountDetails.length == 0) {

                        $('#txt_VndCodeH').val("");
                        $('#txt_VndNameH').val("");
                        Errorinput(txt_VndCodeH);
                        DisplayMassage("كود المورد غير صحيح", "Wrong vendor code", MessageType.Error);

                    }
                    else {
                        $('#txt_VndCodeH').val(AccountDetails[0].VendorCode);
                        $('#txt_VndNameH').val(AccountDetails[0].NAMEA);
                        GLOBALopenbalance = AccountDetails[0].Openbalance;
                        GlobalvendorId = AccountDetails[0].VendorID;
                    }

                }

            }
        });

    }
    function txt_VndCodeH_onchange() {
        txt_VndNameH.value = "";
        getAccountHById(txt_VndCodeH.value, true);

    }

    function btnVnd_OnClick() {

        sys.FindKey(Modules.AccTrVendorAdjust, "btnVndSearch", "CompCode= " + compcode + "and IsCreditVendor = 1", () => {
            let id = SearchGrid.SearchDataGrid.SelectedKey;
            PurchaserId = id;
            getAccountById(id, false);
        });
    }
    function getAccountById(custId: string, code: boolean) {

        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefVendor", "GetVendorByvndId_code"),
            data: { Compcode: compcode, code: code, VendorID: custId, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {

                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    AccountDetails = result.Response as Array<A_Pay_D_Vendor>;
                    if (AccountDetails.length == 0) {

                        $('#txt_VndCode').val("");
                        $('#txt_VndName').val("");
                        $('#txt_Openbalance').val("");
                        Errorinput(txt_VndCode);
                        DisplayMassage("كود المورد غير صحيح", "Wrong Vendor code", MessageType.Error);

                    }
                    else {
                        $('#txt_VndCode').val(AccountDetails[0].VendorCode);
                        $('#txt_VndName').val(AccountDetails[0].NAMEA);
                        $('#txt_Openbalance').val(AccountDetails[0].Openbalance);
                        GLOBALopenbalance = AccountDetails[0].Openbalance;
                        PurchaserId = AccountDetails[0].VendorID;
                    }

                }

            }
        });

    }
    function txt_VndCode_onchange() {
        txt_VndName.value = "";
        getAccountById(txt_VndCode.value, true);

    }

}












