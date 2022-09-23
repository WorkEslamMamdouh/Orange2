
$(document).ready(() => {
    AccDefCustomer.InitalizeComponent();
})

namespace AccDefCustomer {

    var AccountType: Number = 1;
    var CodesTypes: Array<G_Codes> = new Array<G_Codes>();
    var GetCustomerDoc: Array<AQ_GetCustomerDoc> = new Array<AQ_GetCustomerDoc>();
    var DetailsModel: Array<A_Rec_D_CustomerDoc> = new Array<A_Rec_D_CustomerDoc>();
    var Details: Array<IQ_GetCustomer> = new Array<IQ_GetCustomer>();
    var ReportGrid: JsGrid = new JsGrid();
    var Details_Type_D_Category: Array<A_RecPay_D_Category> = new Array<A_RecPay_D_Category>();
    var Details_CustomerGroup: Array<A_RecPay_D_Group> = new Array<A_RecPay_D_Group>();
    //var Model: A_Rec_D_Customer = new A_Rec_D_Customer();
    var Model: Rec_D_CustomerDetail = new Rec_D_CustomerDetail();
    var singleModel: A_Rec_D_CustomerDoc = new A_Rec_D_CustomerDoc();
    var VatTypeDetails: Array<A_D_VAT_TYPE> = new Array<A_D_VAT_TYPE>();
    var SalesmanDetails: Array<I_Sls_D_Salesman> = new Array<I_Sls_D_Salesman>();
    var NationalityDetails: Array<G_Nationality> = new Array<G_Nationality>();
    var CurrencyDetails: Array<G_Currency> = new Array<G_Currency>();
    var sys: SystemTools = new SystemTools();
    var SysSession: SystemSession = GetSystemSession(Modules.AccDefCustomer);

    var txt_Cust_Type: HTMLSelectElement;
    var txt_Category: HTMLSelectElement;
    var txt_Grop: HTMLSelectElement;
    var txt_tax: HTMLSelectElement;
    var ddlSalesman_New: HTMLSelectElement;
    var txt_Country: HTMLSelectElement;
    var txt_Currency: HTMLSelectElement;

    var btnBack: HTMLButtonElement;
    var btnShow: HTMLButtonElement;
    var btnAdd: HTMLButtonElement;
    var btnEdit: HTMLButtonElement;
    var btnSave: HTMLButtonElement;
    var btnAddDetails: HTMLButtonElement;
    var btnsearchCust: HTMLButtonElement;
    var Is_cust: boolean;

    var txt_CustCode: HTMLInputElement;
    var txt_CustName: HTMLInputElement;

    var txt_CustomerCODE: HTMLInputElement;
    var txt_NAME: HTMLInputElement;
    var txt_NAMEE: HTMLInputElement;
    //var txt_ADDRESS: HTMLInputElement;
    var txt_MOBILE: HTMLInputElement;
    var txt_TEL: HTMLInputElement;
    //var txt_IDNo: HTMLInputElement;
    var txt_WorkTel: HTMLInputElement;
    var txt_note: HTMLInputElement;
    var txt_VatNo: HTMLInputElement;
    var txt_Debit: HTMLInputElement;
    var txt_DebitFC: HTMLInputElement;
    var txt_Openbalance: HTMLInputElement;
    var txt_OpenbalanceAt: HTMLInputElement;
    var txt_CreditLimit: HTMLInputElement;
    var txt_balance: HTMLInputElement;
    var searchbutmemreport: HTMLInputElement;

    //chkboxes
    var chkActive: HTMLInputElement;

    var compcode: Number;//SharedSession.CurrentEnvironment.CompCode;
    var BranchCode: number;//SharedSession.CurrentEnvironment.BranchCode;
    var IsNew;
    var index;
    var Selecteditem
    var CustomerIdUpdate: number = 0;
    var CustomerId;
    var Debit;
    var Credit;
    var Valid = 0;
    var CountGrid = 0;
    var SearchDetails;
    var Update_claenData = 0;
    var Balance;
    var indebtedness;
    var validEmail;
    var Page = true;
    let pageIndex;
    var Newcount = 0;

    //--- Print Buttons
   // var btnPrint: HTMLButtonElement;
    var btnPrintTrview: HTMLButtonElement;
    var btnPrintTrPDF: HTMLButtonElement;
    var btnPrintTrEXEL: HTMLButtonElement;
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);
    var FinYear = (SysSession.CurrentEnvironment.CurrentYear);
    var IsAutoCode = SysSession.CurrentEnvironment.I_Control[0].IsAutoNoCustVendor;
    export function InitalizeComponent() {

        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = "العملاء";

        } else {
            document.getElementById('Screen_name').innerHTML = "Customers";

        }
        debugger
        $('#btnPrintTransaction').addClass('d-none');
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);
        InitalizeControls();
        InitalizeEvents();
        reference_Page();
        Display_GenDefCustomerCat();
        Display_CustomerGroup();
        fillddlVatType();
        fillddlSalesman();
        FillddlNationality();
        GetCardTypes();
        GetAllCurrency();
      //  $('#btnPrint').addClass('display_none');   
    }
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
        //--- Print Buttons
        //--- Print Buttons
        btnsearchCust = document.getElementById("btnsearchCust") as HTMLButtonElement;
        txt_CustCode = document.getElementById("txt_CustCode") as HTMLInputElement;
        txt_CustName = document.getElementById("txt_CustName") as HTMLInputElement;


        //btnPrint = document.getElementById("btnPrint") as HTMLButtonElement;
        btnPrintTrview = document.getElementById("btnPrintTrview") as HTMLButtonElement;
        btnPrintTrPDF = document.getElementById("btnPrintTrPDF") as HTMLButtonElement;
        btnPrintTrEXEL = document.getElementById("btnPrintTrEXEL") as HTMLButtonElement;

        btnShow = document.getElementById("btnShow") as HTMLButtonElement;
        btnAdd = document.getElementById("btnAdd") as HTMLButtonElement;
        btnEdit = document.getElementById("btnUpdate") as HTMLButtonElement;
        btnSave = document.getElementById("btnSave") as HTMLButtonElement;
        btnAddDetails = document.getElementById("btnAddDetails") as HTMLButtonElement;
        btnBack = document.getElementById("btnBack") as HTMLButtonElement;

        //textBoxes
        txt_CustomerCODE = document.getElementById("txt_CustomerCODE") as HTMLInputElement;
        txt_Cust_Type = document.getElementById("txt_Cust_Type") as HTMLSelectElement;
        ddlSalesman_New = document.getElementById("ddlSalesman_New") as HTMLSelectElement;
        txt_NAME = document.getElementById("txt_NAME") as HTMLInputElement;
        txt_NAMEE = document.getElementById("txt_NAMEE") as HTMLInputElement;
        txt_Category = document.getElementById("txt_Category") as HTMLSelectElement;
        txt_Country = document.getElementById("txt_Country") as HTMLSelectElement;
        txt_Currency = document.getElementById("txt_Currency") as HTMLSelectElement;
        txt_Grop = document.getElementById("txt_Grop") as HTMLSelectElement;
        //txt_ADDRESS = document.getElementById("txt_ADDRESS") as HTMLInputElement;
        txt_MOBILE = document.getElementById("txt_MOBILE") as HTMLInputElement;
        txt_TEL = document.getElementById("txt_TEL") as HTMLInputElement;
        //txt_IDNo = document.getElementById("txt_IDNo") as HTMLInputElement;
        txt_WorkTel = document.getElementById("txt_WorkTel") as HTMLInputElement;
        txt_note = document.getElementById("txt_note") as HTMLInputElement;
        txt_tax = document.getElementById("txt_tax") as HTMLSelectElement;
        txt_VatNo = document.getElementById("txt_VatNo") as HTMLInputElement;
        txt_Debit = document.getElementById("txt_Debit") as HTMLInputElement;
        txt_DebitFC = document.getElementById("txt_DebitFC") as HTMLInputElement;
        txt_Openbalance = document.getElementById("txt_Openbalance") as HTMLInputElement;
        txt_OpenbalanceAt = document.getElementById("txt_OpenbalanceAt") as HTMLInputElement;
        txt_CreditLimit = document.getElementById("txt_CreditLimit") as HTMLInputElement;
        txt_balance = document.getElementById("txt_balance") as HTMLInputElement;
        chkActive = document.getElementById("id_chkcustom6") as HTMLInputElement;
        searchbutmemreport = document.getElementById("searchbutmemreport") as HTMLInputElement;
    }
    function InitalizeEvents() {
        btnShow.onclick = btnShow_onclick;
        btnAdd.onclick = btnAdd_onclick;
        btnSave.onclick = btnsave_onClick;
        btnAddDetails.onclick = AddNewRow;
        btnBack.onclick = btnback_onclick;
        btnEdit.onclick = btnEdit_onclick;
        searchbutmemreport.onkeyup = _SearchBox_Change;
        txt_Openbalance.onkeyup = balance_onchange;
        txt_Cust_Type.onchange = txt_Cust_Type_onchange;
        // Print Buttons
        btnPrintTrview.onclick = () => { PrintReport(1); }
        btnPrintTrPDF.onclick = () => { PrintReport(2); }
        btnPrintTrEXEL.onclick = () => { PrintReport(3); }
       // btnPrint.onclick = () => { PrintReport(4); } 

        txt_CustCode.onchange = txt_CustCode_onchange;
        btnsearchCust.onclick = btnsearchCust_onclick;

    }
    function btnsearchCust_onclick() {
        debugger
        sys.FindKey(Modules.AccDefCustomer, "btncustSearch", "COMP_CODE= " + compcode + " and DETAIL = 1", () => {
            var id = SearchGrid.SearchDataGrid.SelectedKey;
            getAccountById(id);
        });
    }
    function getAccountById(custId: string) {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefCustomer", "GetCustomerACC"),
            data: { Id: custId, COMP_CODE: SysSession.CurrentEnvironment.CompCode, FIN_YEAR: FinYear, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
               
                if (result.IsSuccess) {
                    var AccountDeta: Array<AQ_GetAccount> = result.Response as Array<AQ_GetAccount>;
                    if (AccountDeta.length == 0) {
                        txt_CustCode.value = "";
                        txt_CustName.value = "";
                        Errorinput(txt_CustCode);
                        DisplayMassage("كود العميل غير صحيح", "Customer code is wrong", MessageType.Error);
                    }
                    else {
                        $('#txt_CustCode').val(AccountDeta[0].ACC_CODE);
                        $('#txt_CustName').val(AccountDeta[0].ACC_DESCA);
                    }
                }
            }
        });
    }
    function txt_CustCode_onchange() {
        txt_CustName.value = "";
        getAccountById(txt_CustCode.value);
    }
    function txt_Cust_Type_onchange() {


        if (txt_Cust_Type.value == "1" || txt_Cust_Type.value == "Null") {
            $('#div_Balance').removeClass("display_none");
            Is_cust = SysSession.CurrentEnvironment.I_Control[0].ISCustVendorInGL;
            if (Is_cust == true) {
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
            txt_OpenbalanceAt.value = GetDate();
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
        if (IsNew != true) {
            txt_balance.value = (Number(txt_Openbalance.value) + Debit - Credit).toString();
        }

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
            $("#txt_CustomerCODE").attr("disabled", "disabled");
            $("#txt_Debit").attr("disabled", "disabled");
            $("#txt_DebitFC").attr("disabled", "disabled");
            $("#txt_balance").attr("disabled", "disabled");

            $("#txt_Currency").removeAttr("disabled");

            $("#id_div_Add").attr("disabled", "disabled").off('click');
            var x1 = $("#id_div_Add").hasClass("disabledDiv");

            (x1 == true) ? $("#id_div_Add").removeClass("disabledDiv") : $("#id_div_Add").addClass("disabledDiv");

            $("#Div_DOC :input").removeAttr("disabled");
            $("#Div_ADDRESS :input").removeAttr("disabled");

            for (var i = 0; i < CountGrid; i++) {

                $("#IDIssueDateH" + i).attr("disabled", "disabled");
                $("#IDExpireDateH" + i).attr("disabled", "disabled"); 
            }

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
            $(".fa-minus-circle").removeClass("display_none");
        }
        else {
            $(".fa-minus-circle").addClass("display_none");
        }

    }
    function btnAdd_onclick() {
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

        $("#data_lebel").html('');
        CountGrid = 0;
        $('#btnAddDetails').removeClass("display_none");

        $('#Div_control').removeClass("display_none");
        $('#Div_DOC').removeClass("display_none");
        $('#Div_ADDRESS').removeClass("display_none");

        $("#Div_ADDRESS :input").removeAttr("disabled");
        $("#Div_ADDRESS :input").val("");
        $("#txt_Country").val("null");


        AddNewRow();


        SysSession.CurrentEnvironment.I_Control[0].NationalityID != null ? $("#txt_Country").val(SysSession.CurrentEnvironment.I_Control[0].NationalityID) : $("#txt_Country").val("null");
        SysSession.CurrentEnvironment.I_Control[0].Currencyid != null ? $("#txt_Currency").val(SysSession.CurrentEnvironment.I_Control[0].Currencyid) : $("#txt_Currency").val("null");


        Is_cust = SysSession.CurrentEnvironment.I_Control[0].ISCustVendorInGL;
        if (Is_cust == true) {
            if (txt_Cust_Type.value == "Null") {
                $('#divAccount').addClass('display_none');
            }
            else if (txt_Cust_Type.value == "0") {
                $('#divAccount').addClass('display_none');
            }
            else if (txt_Cust_Type.value == "1") {
                $('#divAccount').removeClass('display_none');
            }
        }
        else {
            $('#divAccount').addClass('display_none');
        }

         
        if (IsAutoCode == true) {
            txt_CustomerCODE.disabled = true;
        }


    }
    function btnsave_onClick() {
        loading('btnSave');

        setTimeout(function () {

            finishSave('btnSave');
        if (!Validation()) return
        debugger
        Newcount = 0;
        var CanAdd: boolean = true;
        if (CountGrid == 0) {
            DisplayMassage("يجب ادخال  بينات  الهويه   ", "You must enter credit limit", MessageType.Worning);
            Errorinput(btnAddDetails);
            AddNewRow();
            return false;
        }
        if (CountGrid > 0) {

            for (var i = 0; i < CountGrid; i++) { 
                CanAdd = Validation_Grid(i);
                if (CanAdd == false) {
                    break;
                }
            }
        }
        if (CanAdd) {

            if (IsNew == true) {
                Assign_CustomerDoc();
                Insert();

            }
            else {
                Assign_CustomerDoc();
                Update();

            }
            }
        }, 100);
    }
    function txt_disabled() {
        $("#btnsearchCust").attr("disabled", "disabled");
        $("#txt_CustCode").attr("disabled", "disabled");
        $("#txt_CustomerCODE").attr("disabled", "disabled");
        $("#txt_Cust_Type").attr("disabled", "disabled");
        $("#id_chkcustom6").attr("disabled", "disabled");
        $("#txt_NAME").attr("disabled", "disabled");
        $("#txt_NAMEE").attr("disabled", "disabled");
        $("#txt_Category").attr("disabled", "disabled");
        $("#ddlSalesman_New").attr("disabled", "disabled");
        $("#txt_Grop").attr("disabled", "disabled");
        //$("#txt_ADDRESS").attr("disabled", "disabled");
        $("#txt_MOBILE").attr("disabled", "disabled");
        $("#txt_TEL").attr("disabled", "disabled");
        $("#txt_Email").attr("disabled", "disabled");
        //$("#txt_IDNo").attr("disabled", "disabled");
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
        $("#txt_Currency").attr("disabled", "disabled");
    }
    function removedisabled() {
        $("#txt_CustomerCODE").removeAttr("disabled");
        $("#txt_Cust_Type").removeAttr("disabled");
        $("#id_chkcustom6").removeAttr("disabled");
        $("#txt_NAME").removeAttr("disabled");
        $("#txt_NAMEE").removeAttr("disabled");
        $("#txt_Category").removeAttr("disabled");
        $("#ddlSalesman_New").removeAttr("disabled");
        $("#txt_Grop").removeAttr("disabled");
        //$("#txt_ADDRESS").removeAttr("disabled");
        $("#txt_MOBILE").removeAttr("disabled");
        $("#txt_TEL").removeAttr("disabled");
        $("#txt_Email").removeAttr("disabled");
        //$("#txt_IDNo").removeAttr("disabled");
        $("#txt_WorkTel").removeAttr("disabled");
        $("#txt_note").removeAttr("disabled");
        $("#txt_tax").removeAttr("disabled");
        $("#txt_VatNo").removeAttr("disabled");
        $("#txt_Debit").removeAttr("disabled");
        $("#txt_DebitFC").removeAttr("disabled");
        $("#txt_balance").removeAttr("disabled");
        $("#txt_Openbalance").removeAttr("disabled");
        $("#txt_OpenbalanceAt").removeAttr("disabled");
        $('#btnsearchCust').removeAttr("disabled");
        $('#txt_CustCode').removeAttr("disabled");
        $("#txt_CreditLimit").removeAttr("disabled");
        $("#txt_Currency").removeAttr("disabled");
    }
        
    function CustomerFoundBefore() {
        var res: boolean = true;
        var code = txt_CustomerCODE.value;
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefCustomer", "CodeFounBefore"),
            data: {
                code: code, compCode: compcode, BranchCode: BranchCode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
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
    function btnShow_onclick() {
        if ($('#txt_ID_APP_Category').val() == "Null" && $('#txt_ID_APP_Group').val() == "Null" && $('#txt_ID_APP_Type').val() == "Null" && $('#ddlSalesman').val() == "Null") {
            DisplayMassage("  يجب اختيار واحد علي الاقل من (الفئه - المجموعة - النوع - المندوب )", "At least one of the tracks must be selected prior to the show", MessageType.Worning);
        }
        else {
            $('#Div_control').addClass("display_none");
            $('#Div_DOC').addClass("display_none");
            $('#Div_ADDRESS').addClass("display_none");
            Display();

        }
    }
    function btnback_onclick() {
        Selecteditem = Details.filter(x => x.CustomerId == Number(ReportGrid.SelectedKey));
        if (Selecteditem.length == 0) {
            IsNew = true;
        }
        if (IsNew == true) {
            $('#btnAddDetails').addClass("display_none");
            $('#btnSave').addClass("display_none");
            $('#btnBack').addClass("display_none");
            $(".fa-minus-circle").addClass("display_none");
            $("#btnUpdate").removeClass("display_none");
            $("#btnUpdate").removeAttr("disabled");
            $("#drp_G_Store").removeAttr("disabled");
            txt_disabled();
            $("#Div_control").addClass("display_none");
            $("#id_div_Add").removeClass("disabledDiv");
            $('#Div_DOC').addClass("display_none");
            $('#Div_ADDRESS').addClass("display_none");

        }
        else {
            $('#btnAddDetails').addClass("display_none");
            $('#btnSave').addClass("display_none");
            $('#btnBack').addClass("display_none");
            $(".fa-minus-circle").addClass("display_none");
            $("#btnUpdate").removeClass("display_none");
            $("#btnUpdate").removeAttr("disabled");
            $("#drp_G_Store").removeAttr("disabled");
            txt_disabled();
            if (Update_claenData != 1) {

                back_Details();
            }

            Update_claenData = 0;

            $("#id_div_Add").attr("disabled", "");
            $("#id_div_Add").removeClass("disabledDiv");
        }

        $("#Div_ADDRESS :input").attr("disabled", "disabled");

    }
    function back_Details() {

        Selecteditem = Details.filter(x => x.CustomerId == Number(CustomerId)); 
        for (var item of Selecteditem) {
            if (item.Isactive) { chkActive.checked = true; }
            else chkActive.checked = false;
        }
        DisplayData(Selecteditem);
        reference_Page();
    }           
    function FillddlNationality() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("Nationality", "GetAll"),
            data: {
                UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {

                    NationalityDetails = result.Response as Array<G_Nationality>;
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                        DocumentActions.FillCombowithdefult(NationalityDetails, txt_Country, "NationalityID", "DescL", "Select Category");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(NationalityDetails, txt_Country, "NationalityID", "DescA", "اختر الدوله");
                    }

                }
            }
        });
    }
    function GetAllCurrency() {

        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefVendor", "GetAllCurrency"),
            data: { UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess == true) {
                    CurrencyDetails = result.Response as Array<G_Currency>;

                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                        DocumentActions.FillCombowithdefult(CurrencyDetails, txt_Currency, "CurrencyID", "DescL", "Select Category");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(CurrencyDetails, txt_Currency, "CurrencyID", "DescA", "اختر العمله");
                    }
                }
            }
        });
    }     
    function GetCardTypes() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GCodes", "GetAll"),
            data: { codeType: 'CusIDType', UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess == true) {
                    CodesTypes = result.Response as Array<G_Codes>;
                }
            }
        });
    } 
    function DriverDoubleClick() {
        Selecteditem = Details.filter(x => x.CustomerId == Number(ReportGrid.SelectedKey));
        for (var item of Selecteditem) {
            if (item.Isactive) { chkActive.checked = true; }
            else chkActive.checked = false;

        }
        $('#Div_control').removeClass("display_none");
        $('#Div_DOC').removeClass("display_none");
        $('#Div_ADDRESS').removeClass("display_none");
        DisplayData(Selecteditem);
        $('#btnUpdate').removeClass("display_none");
        $('#btnSave').addClass("display_none");
        $('#btnBack').addClass("display_none");
        $('#btnUpdate').removeAttr("disabled");
        chkActive.disabled = true;
        IsNew = false;
        Update_claenData = 0;
        btnback_onclick();
        $('#btnSave').addClass("display_none");
        $('#btnBack').addClass("display_none");
        reference_Page();
       
    }
    function DisplayData(Selecteditem: Array<IQ_GetCustomer>) {
        DocumentActions.RenderFromModel(Selecteditem[0]);
        $('#txt_Category').prop("value", Selecteditem[0].CatID);
        if (Selecteditem[0].IsCreditCustomer != false) {
            $('#txt_Cust_Type').prop("value", 1);
            $('#div_Balance').removeClass("display_none");
        }
        else {
            $('#txt_Cust_Type').prop("value", 0);
            $('#div_Balance').addClass("display_none");
        }

        $('#txt_Grop').prop("value", Selecteditem[0].GroupId == null ? 'null' : Selecteditem[0].GroupId);
        $('#txt_tax').prop("value", Selecteditem[0].VATType == null ? 'null' : Selecteditem[0].VATType);
        $('#txt_Country').prop("value", Selecteditem[0].NationalityID == null ? 'null' : Selecteditem[0].NationalityID);
        $('#ddlSalesman_New').prop("value", Selecteditem[0].SalesmanId == null ? '0' : Selecteditem[0].SalesmanId);
        $('#txt_Currency').prop("value", Selecteditem[0].CURCODE == null ? 'null' : Selecteditem[0].CURCODE);

        CustomerId = Selecteditem[0].CustomerId;
        Debit = Selecteditem[0].Debit;
        Credit = Selecteditem[0].Credit


        $('#txt_balance').val((Selecteditem[0].Openbalance + Selecteditem[0].Debit - Selecteditem[0].Credit));

        var Close_TrDate: string = DateFormat(Selecteditem[0].OpenbalanceAt);
        $('#txt_OpenbalanceAt').val(Close_TrDate);


        BindGetCustomerDocGridData(Selecteditem[0].CustomerId);
        $('#txt_Openbalance').val(Selecteditem[0].Openbalance.RoundToSt(2));
        $('#txt_balance').val(Selecteditem[0].Balance.RoundToSt(2));
        $('#txt_Debit').val(Selecteditem[0].Debit.RoundToSt(2));
        $('#txt_DebitFC').val(Selecteditem[0].Credit.RoundToSt(2));


        txt_CustCode.value = "";
        txt_CustName.value = "";


        Is_cust = SysSession.CurrentEnvironment.I_Control[0].ISCustVendorInGL;
        debugger
        if (Selecteditem[0].CustomerId != null && Selecteditem[0].CustomerId != 0 && Is_cust == true && Selecteditem[0].IsCreditCustomer == true) {
            getAccountById(Selecteditem[0].AccountNo);
            $('#divAccount').removeClass('display_none');
        }
        else {
            $('#txt_CustCode').val('');
            $('#txt_CustName').val('');
            $('#divAccount').addClass('display_none');
            //PurchaserId = null;
        }

    }
    function BindGetCustomerDocGridData(CustomerId: number) {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefCustomer", "GetCustomerDoc"),
            data: { CustomerId: CustomerId, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    GetCustomerDoc = result.Response as Array<AQ_GetCustomerDoc>;

                    $("#data_lebel").html('');
                    CountGrid = 0;
                    for (var i = 0; i < GetCustomerDoc.length; i++) {
                        BuildControls(i);
                        Disbly_BuildControls(i, GetCustomerDoc);
                        CountGrid += 1;
                    }



                }
            }
        });
    }


    function BuildControls(cnt: number) {
        var html;
        html = `<tr id= "row_font_header${cnt}">
                    <td>
		                <div class="form-group">
			                <span id="btn_minus3${cnt}"><i class="fas fa-minus-circle btn-minus"></i></span>
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
                           	<select disabled id="CusIDTypeCode${cnt}" class="form-control"> 
		                        <option value="null">${ (lang == "ar" ? "اختار نوع الهويه" : "Choose Identity Type") }</option> 
		                     </select >
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
                           <input disabled id="IDNo${cnt}" type="number" class="form-control">
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
                           <input disabled id="IDIssuePlace${cnt}" type="text" class="form-control">
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
                            <input type="date" disabled id="IDIssueDate${cnt}" class="form-control">
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
		                    <input type="text" disabled id="IDIssueDateH${cnt}" class="form-control">
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
		                    <input type="date" disabled id="IDExpireDate${cnt}" class="form-control">
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
		                    <input type="text" disabled id="IDExpireDateH${cnt}" class="form-control">
		                </div>
	                </td>
             <input id="txt_StatusFlag${cnt}" name = " " type = "hidden" class="form-control"/>
		    <input id="CustomerDocID${cnt}" name = " " type = "hidden" class="form-control" />
                </tr>`;

        $("#data_lebel").append(html);


        for (var i = 0; i < CodesTypes.length; i++) {
            $('#CusIDTypeCode' + cnt).append('<option value="' + CodesTypes[i].CodeValue + '">' + (lang == "ar" ? CodesTypes[i].DescA : CodesTypes[i].DescE) + '</option>');
        }



        $("#btn_minus3" + cnt).on('click', function () {

            DeleteRow(cnt);
        });
        if (SysSession.CurrentPrivileges.Remove) {
            $("#btn_minus3" + cnt).addClass("display_none");
            $("#btn_minus3" + cnt).attr("disabled", "disabled");
        }
        else {
            $("#btn_minus3" + cnt).addClass("display_none");
            $("#btn_minus3" + cnt).attr("disabled", "disabled");
        }
        $("#CusIDTypeCode" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });

        $("#IDNo" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });

        $("#IDIssuePlace" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        $("#IDIssueDate" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");


            $("#IDIssueDateH" + cnt).val(convertToH($("#IDIssueDate" + cnt).val())); 

        });
        $("#IDIssueDateH" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        $("#IDExpireDate" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");

            $("#IDExpireDateH" + cnt).val(convertToH($("#IDExpireDate" + cnt).val())); 

        });
        $("#IDExpireDateH" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });

    }
    function Disbly_BuildControls(cnt: number, AQ_GetCustomerDoc: Array<AQ_GetCustomerDoc>) {
        debugger
        $("#btnAddDetails").addClass("display_none");
        $("#btn_minus3" + cnt).addClass("display_none");
        $("#txt_StatusFlag" + cnt).val(""); 
        $("#CustomerDocID" + cnt).val(AQ_GetCustomerDoc[cnt].CustomerDocID);
        $("#CusIDTypeCode" + cnt).prop('value', AQ_GetCustomerDoc[cnt].CusIDTypeCode == null ? 'null' : AQ_GetCustomerDoc[cnt].CusIDTypeCode);
        $("#IDNo" + cnt).val(AQ_GetCustomerDoc[cnt].IDNo);
        $("#IDIssuePlace" + cnt).val(AQ_GetCustomerDoc[cnt].IDIssuePlace);
        $("#IDIssueDate" + cnt).val(DateFormat(AQ_GetCustomerDoc[cnt].IDIssueDate)); 
        $("#IDIssueDateH" + cnt).val(AQ_GetCustomerDoc[cnt].IDIssueDateH);
        $("#IDExpireDate" + cnt).val(DateFormat(AQ_GetCustomerDoc[cnt].IDExpireDate)); 
        $("#IDExpireDateH" + cnt).val(AQ_GetCustomerDoc[cnt].IDExpireDateH);


    }
    function AddNewRow() {
        if (!SysSession.CurrentPrivileges.AddNew) return;
        Newcount = 0;
        var CanAdd: boolean = true;
        if (CountGrid > 0) {
            for (var i = 0; i < CountGrid; i++) {
                CanAdd = Validation_Grid(i);
                if (CanAdd == false) {
                    break;
                }
            }
        }
        if (CanAdd) {

         

            BuildControls(CountGrid);
             
            $("#Div_ADDRESS :input").removeAttr("disabled");

            $("#txt_StatusFlag" + CountGrid).val("i"); //In Insert mode
            $("#btn_minus3" + CountGrid).removeClass("display_none");
            $("#btn_minus3" + CountGrid).removeAttr("disabled");


            $("#IDIssueDate" + CountGrid).val(GetDate());
            $("#IDExpireDate" + CountGrid).val(GetDate());
            $("#IDIssueDateH" + CountGrid).val(convertToH(GetDate()));
            $("#IDExpireDateH" + CountGrid).val(convertToH(GetDate()));


            $("#CusIDTypeCode" + CountGrid).removeAttr("disabled"); 
            $("#IDNo" + CountGrid).removeAttr("disabled"); 
            $("#IDIssuePlace" + CountGrid).removeAttr("disabled"); 
            $("#IDIssueDate" + CountGrid).removeAttr("disabled"); 
            $("#IDExpireDate" + CountGrid).removeAttr("disabled"); 

            $("#IDIssueDateH" + CountGrid).attr("disabled", "disabled");
            $("#IDExpireDateH" + CountGrid).attr("disabled", "disabled"); 
          
          
          
          

            CountGrid++;
        }
    
    



    }
    function DeleteRow(RecNo: number) {
        if (!SysSession.CurrentPrivileges.Remove) return;
        WorningMessage("هل تريد الحذف؟", "Do you want to delete?", "تحذير", "worning", () => {


            $("#txt_StatusFlag" + RecNo).val() == 'i' ? $("#txt_StatusFlag" + RecNo).val('m') : $("#txt_StatusFlag" + RecNo).val('d');


            $("#CusIDTypeCode" + RecNo).val("1");
            $("#IDNo" + RecNo).val("2");
            $("#IDIssuePlace" + RecNo).val("1");


            $("#row_font_header" + RecNo).attr("hidden", "true");



        });
    }

    function Validation() {
         
        if (txt_CustomerCODE.value.trim() == "" && IsAutoCode == false) {
            DisplayMassage("يجب ادخال رقم العميل", "Vendor number must be entered", MessageType.Worning);
            Errorinput(txt_CustomerCODE);
            return false;
        } 
        if (IsNew == true && txt_CustomerCODE.value != '' ) {
            if (CustomerFoundBefore() == false) {
                DisplayMassage("رقم العميل موجود من قبل ", "The customer number already exists", MessageType.Worning);
                Errorinput(txt_CustomerCODE);
                return false;
            }
        }
        if (txt_NAME.value.trim() == "" && txt_NAMEE.value.trim() == "") {
            DisplayMassage("يجب ادخال الاسم بالعربي او بالانجليزي ", "The name must be entered in Arabic or English", MessageType.Worning);
            Errorinput(txt_NAME);
            return false;

        }
        if (Is_cust == true && $('#txt_Cust_Type').val() == 1 && $('#txt_CustCode').val().trim() == '') {
            DisplayMassage("يجب ادخال  حساب العميل  ", "please enter district", MessageType.Worning);
            Errorinput($('#txt_CustCode'));
            return false;
        }
        if (txt_Cust_Type.selectedIndex == 0) {
            DisplayMassage("يجب اختيار النوع ", "The type must be selected", MessageType.Worning);
            Errorinput(txt_Cust_Type);
            return false;
        }
        if (txt_Category.selectedIndex == 0) {
            DisplayMassage("يجب اختيار الفئة ", "Category must be selected", MessageType.Worning);
            Errorinput(txt_Category);
            return false;
        }
        if (txt_Grop.selectedIndex == 0) {
            DisplayMassage("يجب اختيار المجموعه ", "The group must be selected", MessageType.Worning);
            Errorinput(txt_Grop);
            return false;
        }
        if (ddlSalesman_New.selectedIndex == 0 && txt_Cust_Type.value == "0") {
            DisplayMassage("يجب اختيار المندوب ", "The delegate must be selected", MessageType.Worning);
            Errorinput(ddlSalesman_New);
            return false;

        }
        if (txt_MOBILE.value.trim() == "") {
            DisplayMassage("يجب ادخال رقم الجوال", "Must insert Mobile Number", MessageType.Worning);
            Errorinput(txt_MOBILE);
            return false;
        }

        if (txt_tax.selectedIndex == 0) {
            DisplayMassage("يجب اختيار نوع الضريبة ", "You must choose the type of tax", MessageType.Worning);
            Errorinput(txt_tax);
            return false;
        }
        if (txt_VatNo.value.trim() == ""  ) {
            DisplayMassage("يجب ادخال الرقم الضريبي ", "Must insert Vat Number", MessageType.Worning);
            Errorinput(txt_VatNo);
            return false;
        }
        //if ( txt_VatNo.value.length < 9) {
        //    DisplayMassage(" يجب ان يكون الرقم الضريبي اكبر من 9 ارقام ", "Must insert Vat Number", MessageType.Worning);
        //    Errorinput(txt_VatNo);
        //    return false;
        //}
        if (txt_Currency.selectedIndex == 0) {
            DisplayMassage("يجب اختيار العمله   ", "You must choose the type of tax", MessageType.Worning);
            Errorinput(txt_Currency);
            return false;
        }

        var Openbalance = Number($('#txt_Openbalance').val());
        if ((txt_Openbalance.value.trim() == "" ) && txt_Cust_Type.value == "1") {
            DisplayMassage("يجب ادخال الرصيد الافتتاحى ", "You must enter Open Balance", MessageType.Worning);
            Errorinput(txt_Openbalance);
            return false;
        }
        //var CreditLimit = Number($('#txt_CreditLimit').val());
        //if ((txt_CreditLimit.value.trim() == "" || CreditLimit <= 0) && txt_Cust_Type.value == "1") {
        //    DisplayMassage("يجب ادخال الحد الائتماني ", "You must enter credit limit", MessageType.Worning);
        //    Errorinput(txt_CreditLimit);
        //    return false;
        //}
        if ($('#txt_Email').val().trim() != '') {

            if (validate_email() == false) {
                DisplayMassage("يجب ادخال البريد الالكتروني صحيح ", "You must enter a valid email", MessageType.Worning);
                Errorinput($('#txt_Email'));
                return false;
            }
        } 
        //if (txt_ADDRESS.value.trim() == "") {
        //    DisplayMassage("يجب ادخال العنوان", "Must insert Address", MessageType.Worning);
        //    Errorinput(txt_ADDRESS);
        //    return false;
        //}

        if (txt_Country.selectedIndex == 0) {
            DisplayMassage("يجب اختيار الدوله   ", "The country must be chosen", MessageType.Worning);
            Errorinput(txt_Country);
            return false;
        }

        //if ($('#txt_Address_District').val().trim() == '') {
        //    DisplayMassage("يجب ادخال المنطقة", "Region must be entered", MessageType.Worning);
        //    Errorinput($('#txt_Address_District'));
        //    return false;
        //}

        //if ($('#txt_Address_City').val().trim() == '') {
        //    DisplayMassage("يجب ادخال المدينه", "City must be entered", MessageType.Worning);
        //    Errorinput($('#txt_Address_City'));
        //    return false;
        //}

        //if ($('#txt_Address_Province').val().trim() == '') {
        //    DisplayMassage("يجب ادخال المحافظه", "Governorate must be entered", MessageType.Worning);
        //    Errorinput($('#txt_Address_Province'));
        //    return false;
        //}

        //if ($('#txt_Address_Street').val().trim() == '') {
        //    DisplayMassage("يجب ادخال الشارع 1", "Street 1 must be entered", MessageType.Worning);
        //    Errorinput($('#txt_Address_Street'));
        //    return false;
        //}

        //if ($('#txt_Address_BuildingNo').val().trim() == '') {
        //    DisplayMassage("يجب ادخال رقم المبني 1", "Building number 1 must be entered", MessageType.Worning);
        //    Errorinput($('#txt_Address_BuildingNo'));
        //    return false;
        //}


        //if (txt_IDNo.value.trim() == "") {
        //    DisplayMassage("يجب ادخال رقم الهوية", "Must insert ID Number", MessageType.Worning);
        //    Errorinput(txt_IDNo);
        //    return false;
        //}




        return true;
    }

    function Validation_Grid(rowcount: number) {

        if (($("#txt_StatusFlag" + rowcount).val() != 'd' || $("#txt_StatusFlag" + rowcount).val() != 'm')) {

            Newcount++;

        }
        if ($("#CusIDTypeCode" + rowcount).val() == "null" && ($("#txt_StatusFlag" + rowcount).val() != 'd' || $("#txt_StatusFlag" + rowcount).val() != 'm')) {
            DisplayMassage_Processes("برجاء اختيار نوع الهويه!", "Please choose the type of ID!", MessageType.Worning);
            Errorinput($("#CusIDTypeCode" + rowcount));
            return false
        }
        if ($("#IDNo" + rowcount).val().trim() == "" && ($("#txt_StatusFlag" + rowcount).val() != 'd' || $("#txt_StatusFlag" + rowcount).val() != 'm')) {
            DisplayMassage_Processes(" برجاء ادخال رقم البطاقه!", "Please enter the card number!", MessageType.Worning);
            Errorinput($("#IDNo" + rowcount));

            return false
        }
        if ($("#IDIssuePlace" + rowcount).val().trim() == "" && ($("#txt_StatusFlag" + rowcount).val() != 'd' || $("#txt_StatusFlag" + rowcount).val() != 'm')) {
            DisplayMassage_Processes(" برجاء ادخال مكان إصدار الهوية!", "Please enter the place of issuance of the ID!", MessageType.Worning);
            Errorinput($("#IDIssuePlace" + rowcount));

            return false
        }
        if (Newcount == 0) {
            DisplayMassage("يجب ادخال  بينات  الهويه   ", "Identity data must be entered", MessageType.Worning);
            Errorinput(btnAddDetails);
            AddNewRow();
            return false;
        }

        return true;

    }



    function Display_CustomerGroup() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GenDefGroup", "GetAll"),
            data: {
                CompCode: compcode, AccountType: AccountType, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    Details_CustomerGroup = result.Response as Array<A_RecPay_D_Group>;

                    DisplayStkCustomerGroup();
                }
            }
        });
    }
    function DisplayStkCustomerGroup() {
        for (var i = 0; i < Details_CustomerGroup.length; i++) {

            $('#txt_ID_APP_Group').append('<option value="' + Details_CustomerGroup[i].GroupID + '">' + (lang == "ar" ? Details_CustomerGroup[i].Group_DescA : Details_CustomerGroup[i].Group_DescE) + '</option>');
            $('#txt_Grop').append('<option value="' + Details_CustomerGroup[i].GroupID + '">' + (lang == "ar" ? Details_CustomerGroup[i].Group_DescA : Details_CustomerGroup[i].Group_DescE) + '</option>');

        }

    }
    function Display_GenDefCustomerCat() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GenDefCategory", "GetAll"),
            data: {
                CompCode: compcode, AccountType: AccountType, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    Details_Type_D_Category = result.Response as Array<A_RecPay_D_Category>;
                    DisplayStGenDefCustomerCat();
                }
            }
        });
    }
    function DisplayStGenDefCustomerCat() {
        for (var i = 0; i < Details_Type_D_Category.length; i++) {

            $('#txt_ID_APP_Category').append('<option value="' + Details_Type_D_Category[i].CatID + '">' + (lang == "ar" ? Details_Type_D_Category[i].Cat_DescA : Details_Type_D_Category[i].Cat_DescE) + '</option>');
            $('#txt_Category').append('<option value="' + Details_Type_D_Category[i].CatID + '">' + (lang == "ar" ? Details_Type_D_Category[i].Cat_DescA : Details_Type_D_Category[i].Cat_DescE) + '</option>');

        }

    }
    function fillddlSalesman() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefSalesMen", "GetAllSalesPeople"),
            data: {
                CompCode: compcode, BranchCode: BranchCode, IsSalesEnable: true, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    SalesmanDetails = result.Response as Array<I_Sls_D_Salesman>;
                    SalesmanDetails = SalesmanDetails.filter(s => s.Isactive == true);
                    DisplaySalesman();
                }
            }
        });
    }
    function DisplaySalesman() {
        for (var i = 0; i < SalesmanDetails.length; i++) {

            $('#ddlSalesman').append('<option value="' + SalesmanDetails[i].SalesmanId + '">' + (lang == "ar" ? SalesmanDetails[i].NameA : SalesmanDetails[i].NameE) + '</option>');
            $('#ddlSalesman_New').append('<option value="' + SalesmanDetails[i].SalesmanId + '">' + (lang == "ar" ? SalesmanDetails[i].NameA : SalesmanDetails[i].NameE) + '</option>');

        }

    }
    function fillddlVatType() {
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
        for (var i = 0; i < VatTypeDetails.length; i++) {

            $('#txt_tax').append('<option value="' + VatTypeDetails[i].CODE + '">' + VatTypeDetails[i].DESCRIPTION + '</option>');

        }

    }
    function EnableControls() {
        if (!SysSession.CurrentPrivileges.AddNew) return;

        $("#Div_control").removeClass("display_none");
        $('#btnSave').removeClass("display_none");
        $('#btnBack').removeClass("display_none");
        $('#btnUpdate').addClass("display_none");
        $('#txt_Category').prop("selectedIndex", 0);
        $('#txt_Cust_Type').prop("selectedIndex", 0);
        $('#txt_tax').prop("selectedIndex", 0);
        $('#txt_Country').prop("selectedIndex", 0);
        $('#txt_Currency').prop("selectedIndex", 0);
        $('#txt_Grop').prop("selectedIndex", 0);
        $('#ddlSalesman_New').prop("selectedIndex", 0);


        $('#txt_Email').val('')
        txt_CustomerCODE.value = "";
        txt_NAME.value = "";
        txt_NAMEE.value = "";
        //txt_ADDRESS.value = "";
        txt_MOBILE.value = "";
        txt_TEL.value = "";
        //txt_IDNo.value = "";
        txt_WorkTel.value = "";
        txt_note.value = "";
        txt_VatNo.value = "";
        txt_Debit.value = "";
        txt_DebitFC.value = "";
        txt_Openbalance.value = "";
        txt_OpenbalanceAt.value = GetDate();
        txt_CreditLimit.value = "";
        txt_balance.value = "";

    }
    function Display() {
        var value_list_Salesman = $('#ddlSalesman').find('option:selected').val();
        indebtedness = $('#txt_indebtedness').val();
        var IsCredit_Type: number;
        if ($('#txt_ID_APP_Type').val() == "Null") {
            IsCredit_Type = 2;
        }
        else {
            IsCredit_Type = Number($('#txt_ID_APP_Type').val());
        }
        var catid: number;
        if ($('#txt_ID_APP_Category').val() == "Null") {
            catid = 0;
        }
        else {
            catid = Number($('#txt_ID_APP_Category').val());

        }
        var Groupid: number;
        if ($('#txt_ID_APP_Group').val() == "Null") {
            Groupid = 0;
        }
        else {
            Groupid = Number($('#txt_ID_APP_Group').val());

        }
        var slsid: number;
        if ($('#ddlSalesman').val() == "Null") {
            slsid = 0;
        }
        else {
            slsid = Number($('#ddlSalesman').val());

        }

        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefCustomer", "GetFiltered"),
            data: {
                CompCode: compcode, BranchCode: BranchCode, Catid: catid, Groupid: Groupid, Slsid: slsid, CreditType: IsCredit_Type, BalType: indebtedness, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    Details = result.Response as Array<IQ_GetCustomer>;

                    for (var i = 0; i < Details.length; i++) {
                        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {

                            if (Details[i].Balance > 0) Details[i].Balance = Number(Details[i].Balance.RoundToSt(2));
                            else Details[i].Balance = Number(Details[i].Balance.RoundToSt(2));

                            if (Details[i].Openbalance > 0) Details[i].Openbalance = Number(Details[i].Openbalance.RoundToSt(2));
                            else Details[i].Openbalance = Number(Details[i].Openbalance.RoundToSt(2));
                        }
                        else {
                            if (Details[i].Openbalance > 0) Details[i].Openbalance = Number(Details[i].Openbalance.RoundToSt(2));
                            else Details[i].Openbalance = Number(Details[i].Openbalance.RoundToSt(2));

                            if (Details[i].Balance > 0) Details[i].Balance = Number(Details[i].Balance.RoundToSt(2));
                            else Details[i].Balance = Number(Details[i].Balance.RoundToSt(2));
                        }
                    }             
                    $('#ddlSalesman').prop("value", value_list_Salesman);
                    InitializeGrid();
                    ReportGrid.DataSource = Details;
                    ReportGrid.Bind();

                }

            }
        });
    }
    function _SearchBox_Change() {
        if (Page) {
            pageIndex = $("#ReportGrid").jsGrid("option", "pageIndex");
        }


        if (searchbutmemreport.value != "") {
            Page = false;
            $("#ReportGrid").jsGrid("option", "pageIndex", 1);
            let search: string = searchbutmemreport.value.toLowerCase();
            SearchDetails = Details.filter(x => x.NAMEA.toLowerCase().search(search) >= 0 || x.NAMEE.toLowerCase().search(search) >= 0
                || x.CustomerCODE.toString().search(search) >= 0);
            ReportGrid.DataSource = SearchDetails;
            ReportGrid.Bind();
        } else {
            Page = true;
            ReportGrid.DataSource = Details;
            ReportGrid.Bind();
            $("#ReportGrid").jsGrid("option", "pageIndex", pageIndex);

        }
    }
    function InitializeGrid() {
        let res: any = GetResourceList("");
        $("#id_ReportGrid").removeClass("display_none");
        ReportGrid.OnRowDoubleClicked = DriverDoubleClick;
        ReportGrid.ElementName = "ReportGrid";
        ReportGrid.PrimaryKey = "CustomerId";
        ReportGrid.Paging = true;
        ReportGrid.PageSize = 10;
        ReportGrid.Sorting = true;
        ReportGrid.InsertionMode = JsGridInsertionMode.Binding;
        ReportGrid.Editing = false;
        ReportGrid.Inserting = false;
        ReportGrid.SelectedIndex = 1;
        ReportGrid.OnItemEditing = () => { };
        ReportGrid.Columns = [
            { title: "الرقم", name: "CustomerId", type: "text", width: "8%", visible: false },
            { title: res.App_CustomerCODE, name: "CustomerCODE", type: "text", width: "10%" },
            { title: res.SHT_Name, name: (lang == "ar" ? "NAMEA" : "NAMEE"), type: "text", width: "20%" },
            { title: res.App_Mobile, name: "MOBILE", type: "text", width: "12%" },
            { title: res.App_Salesman, name: (lang == "ar" ? "Sls_NameA" : "Sls_NameE"), type: "text", width: "10%" },
            { title: res.App_CreditLimit, name: "CreditLimit", type: "text", width: "10%" },
            { title: res.App_openBalance, name: "Openbalance", type: "text", width: "10%" },
            { title: res.App_Debtor, name: "Debit", type: "text", width: "10%" },
            { title: res.App_Creditor, name: "Credit", type: "text", width: "10%" },
            { title: res.App_Balanc, name: "Balance", type: "text", width: "10%" },
        ];
        ReportGrid.Bind();
    }


    function Assign_CustomerDoc() {

        Model.A_Rec_D_CustomerDoc = new Array<A_Rec_D_CustomerDoc>();
        var StatusFlag: String;
        for (var i = 0; i < CountGrid; i++) {
            singleModel = new A_Rec_D_CustomerDoc();
            StatusFlag = $("#txt_StatusFlag" + i).val();
            $("#txt_StatusFlag" + i).val("");
            singleModel.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
            singleModel.UserCode = SysSession.CurrentEnvironment.UserCode;
            if (StatusFlag == "i") {
                singleModel.CustomerDocID = 0;
                singleModel.CustomerId = CustomerId;
                singleModel.StatusFlag = StatusFlag.toString();
                singleModel.CusIDTypeCode = Number($("#CusIDTypeCode" + i).val());
                singleModel.IDNo = $("#IDNo" + i).val();
                singleModel.IDIssuePlace = $('#IDIssuePlace' + i).val();//
                singleModel.IDIssueDate = $('#IDIssueDate' + i).val();
                singleModel.IDIssueDateH = $("#IDIssueDateH" + i).val();
                singleModel.IDExpireDate = $("#IDExpireDate" + i).val();
                singleModel.IDExpireDateH = $("#IDExpireDateH" + i).val();

                Model.A_Rec_D_CustomerDoc.push(singleModel);

            }
            if (StatusFlag == "u") {
                var CustomerDocID = $("#CustomerDocID" + i).val();
                singleModel.CustomerDocID = CustomerDocID;
                singleModel.CustomerId = CustomerId;
                singleModel.StatusFlag = StatusFlag.toString();
                singleModel.CusIDTypeCode = Number($("#CusIDTypeCode" + i).val());
                singleModel.IDNo = $("#IDNo" + i).val();
                singleModel.IDIssuePlace = $('#IDIssuePlace' + i).val();//
                singleModel.IDIssueDate = $('#IDIssueDate' + i).val();
                singleModel.IDIssueDateH = $("#IDIssueDateH" + i).val();
                singleModel.IDExpireDate = $("#IDExpireDate" + i).val();
                singleModel.IDExpireDateH = $("#IDExpireDateH" + i).val();

                Model.A_Rec_D_CustomerDoc.push(singleModel);

            }
            if (StatusFlag == "d") {
                if ($("#CustomerDocID" + i).val() != "") {
                    var CustomerDocID = $("#CustomerDocID" + i).val();
                    singleModel.CustomerDocID = CustomerDocID;
                    singleModel.CustomerId = CustomerId;
                    singleModel.StatusFlag = StatusFlag.toString();
                    Model.A_Rec_D_CustomerDoc.push(singleModel);
                }
            }
        }
    }

    function Assign() {

        debugger
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
        Model.A_Rec_D_Customer = new A_Rec_D_Customer();
        if (IsNew == true) {
            DocumentActions.AssignToModel(Model.A_Rec_D_Customer);//Insert Update
            if (chkActive.checked) { Model.A_Rec_D_Customer.Isactive = true; }
            else { Model.A_Rec_D_Customer.Isactive = false; }
            Model.A_Rec_D_Customer.CompCode = Number(compcode);
            Model.A_Rec_D_Customer.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
            Model.A_Rec_D_Customer.UserCode = SysSession.CurrentEnvironment.UserCode;
            Model.A_Rec_D_Customer.BranchCode = BranchCode;
            Model.A_Rec_D_Customer.CREATED_AT = DateTimeFormat(Date().toString());
            Model.A_Rec_D_Customer.CREATED_BY = SysSession.CurrentEnvironment.UserCode;
            Model.A_Rec_D_Customer.CatID = $('#txt_Category').val();
            Model.A_Rec_D_Customer.VATType = $('#txt_tax').val();
            Model.A_Rec_D_Customer.NationalityID = $('#txt_Country').val();
            Model.A_Rec_D_Customer.CURCODE = $('#txt_Currency').val();
            Model.A_Rec_D_Customer.GroupId = $('#txt_Grop').val();
            Model.A_Rec_D_Customer.SalesmanId = $('#ddlSalesman_New').val();
            Model.A_Rec_D_Customer.CustomerId = CustomerId;
            Model.A_Rec_D_Customer.DiscountplanID = Number("Null");
            Model.A_Rec_D_Customer.IsCreditCustomer = IsCredit_Type;
            Model.A_Rec_D_Customer.CreditLimit = Number(txt_CreditLimit.value) == null ? 0 : Number(txt_CreditLimit.value);
            Model.A_Rec_D_Customer.Credit = Number(txt_DebitFC.value) == null ? 0 : Number(txt_DebitFC.value);
            Model.A_Rec_D_Customer.Debit = Number(txt_Debit.value) == null ? 0 : Number(txt_Debit.value);
            Model.A_Rec_D_Customer.Openbalance = Number(txt_Openbalance.value) == null ? 0 : Number(txt_Openbalance.value);
            Model.A_Rec_D_Customer.OpenbalanceAt = $('#txt_OpenbalanceAt').val();
            
            if ($("#txt_Cust_Type").val() == "1") {
                Model.A_Rec_D_Customer.AccountNo = $("#txt_CustCode").val();
            }

        }
        else {

            DocumentActions.AssignToModel(Model.A_Rec_D_Customer);//Insert Update
            if (chkActive.checked) { Model.A_Rec_D_Customer.Isactive = true; }
            else { Model.A_Rec_D_Customer.Isactive = false; }
            Model.A_Rec_D_Customer.CompCode = Number(compcode);
            Model.A_Rec_D_Customer.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
            Model.A_Rec_D_Customer.UserCode = SysSession.CurrentEnvironment.UserCode;
            Model.A_Rec_D_Customer.BranchCode = BranchCode;
            Model.A_Rec_D_Customer.UPDATED_AT = DateTimeFormat(Date().toString());
            Model.A_Rec_D_Customer.UPDATED_BY = SysSession.CurrentEnvironment.UserCode;
            Model.A_Rec_D_Customer.CustomerId = CustomerId;
            Model.A_Rec_D_Customer.CatID = $('#txt_Category').val();
            Model.A_Rec_D_Customer.VATType = $('#txt_tax').val();
            Model.A_Rec_D_Customer.NationalityID = $('#txt_Country').val();
            Model.A_Rec_D_Customer.CURCODE = $('#txt_Currency').val();
            Model.A_Rec_D_Customer.GroupId = $('#txt_Grop').val();
            Model.A_Rec_D_Customer.SalesmanId = $('#ddlSalesman_New').val();
            Model.A_Rec_D_Customer.DiscountplanID = Number("Null");
            Model.A_Rec_D_Customer.IsCreditCustomer = IsCredit_Type;
            Model.A_Rec_D_Customer.CreditLimit = Number(txt_CreditLimit.value) == null ? 0 : Number(txt_CreditLimit.value);
            Model.A_Rec_D_Customer.Credit = Number(txt_DebitFC.value) == null ? 0 : Number(txt_DebitFC.value);
            Model.A_Rec_D_Customer.Debit = Number(txt_Debit.value) == null ? 0 : Number(txt_Debit.value);
            Model.A_Rec_D_Customer.Openbalance = Number(txt_Openbalance.value) == null ? 0 : Number(txt_Openbalance.value);
            Model.A_Rec_D_Customer.OpenbalanceAt = $('#txt_OpenbalanceAt').val();

            if ($("#txt_Cust_Type").val() == "1") {
                Model.A_Rec_D_Customer.AccountNo = $("#txt_CustCode").val();
            }

        }


    }
    function Insert() {

        Assign();
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("AccDefCustomer", "Insert"),
            data: JSON.stringify(Model),
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    CustomerId = result.Response as A_Rec_D_Customer;
                    DisplayMassage("تم الحفظ بنجاح", "Success", MessageType.Succeed);
                    success_Insert();
                    Valid = 0;
                    Save_Succ_But();
                } else {
                    DisplayMassage("خطأء", "Error", MessageType.Error);
                }
            }
        });
    }
    function Update() {
        Assign();
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("AccDefCustomer", "Update"),
            data: JSON.stringify(Model),
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    CustomerId = d.result as number;
                    DisplayMassage("تم التعديل بنجاح", "Success", MessageType.Succeed);
                    success();
                    Save_Succ_But();
                } else {
                    DisplayMassage("خطأء", "Error", MessageType.Error);
                }
            }
        });

    }

    function success() {


        Display();

        DriverDoubleClick();

    } 
    function success_Insert() {

        Display(); 
        $('#btnAddDetails').addClass("display_none");
        $('#btnSave').addClass("display_none");
        $('#btnBack').addClass("display_none");
        $(".fa-minus-circle").addClass("display_none");
        $("#btnUpdate").removeClass("display_none");
        $("#btnUpdate").removeAttr("disabled");
        $("#drp_G_Store").removeAttr("disabled");
        txt_disabled();
        $("#id_div_Add").attr("disabled", "");
        $("#id_div_Add").removeClass("disabledDiv");
        $('#Div_DOC').addClass("display_none");
        $('#Div_ADDRESS').addClass("display_none");


        Selecteditem = Details.filter(x => x.CustomerId == Number(CustomerId));
        for (var item of Selecteditem) {
            if (item.Isactive) { chkActive.checked = true; }
            else chkActive.checked = false;

        }
        $('#Div_control').removeClass("display_none");
        $('#Div_DOC').removeClass("display_none");
        $('#Div_ADDRESS').removeClass("display_none");
        DisplayData(Selecteditem);
        $('#btnUpdate').removeClass("display_none");
        $('#btnSave').addClass("display_none");
        $('#btnBack').addClass("display_none");
        $('#btnUpdate').removeAttr("disabled");
        chkActive.disabled = true;
        IsNew = false;

        reference_Page();
        $("#Div_control").removeClass("display_none");

        $("#Div_ADDRESS :input").attr("disabled", "disabled");


    }

    function validateEmail(email) {

        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
    function validate_email() {

        validEmail = 0;
        const email = $("#txt_Email").val();
        validateEmail(email)

        return validateEmail(email);
    }
    function PrintReport(OutType: number) {

        if (!SysSession.CurrentPrivileges.PrintOut) return;
        let rp: ReportParameters = new ReportParameters();
        rp.CompCode = SysSession.CurrentEnvironment.CompCode;
        rp.BranchCode = SysSession.CurrentEnvironment.BranchCode;
        rp.CompNameA = SysSession.CurrentEnvironment.CompanyNameAr;
        rp.CompNameE = SysSession.CurrentEnvironment.CompanyName;
        rp.UserCode = SysSession.CurrentEnvironment.UserCode;
        rp.Tokenid = SysSession.CurrentEnvironment.Token;
        rp.BraNameA = SysSession.CurrentEnvironment.BranchName;
        rp.BraNameE = SysSession.CurrentEnvironment.BranchNameEn;
        rp.ScreenLanguage = SysSession.CurrentEnvironment.ScreenLanguage;
        rp.SystemCode = SysSession.CurrentEnvironment.SystemCode;
        rp.SubSystemCode = SysSession.CurrentEnvironment.SubSystemCode;
        if (rp.BraNameA == null || rp.BraNameE == null) {

            rp.BraNameA = " ";
            rp.BraNameE = " ";
        }

        rp.LoginUser = SysSession.CurrentEnvironment.UserCode;
        rp.RepType = OutType;//output report as View

        if ($("#txt_ID_APP_Category").val() == "Null") {//-------------جميع الفئات
            rp.CatId = -1;
        } else {
            rp.CatId = Number($("#txt_ID_APP_Category").val());
        }
        if ($("#txt_ID_APP_Group").val() == "Null") {//-------------جميع المجموعات
            rp.Groupid = -1;
        } else {
            rp.Groupid = Number($("#txt_ID_APP_Group").val());
        }
        if ($("#ddlSalesman").val() == "Null") {//-------------جميع المناديب 
            rp.SalesmanID = -1;
        } else {
            rp.SalesmanID = Number($("#ddlSalesman").val());
        }
        if ($("#txt_ID_APP_Type").val() == "Null") {//-------------جميع الانواع

            rp.IsCredit = -1;
        }
        if (Number($("#txt_ID_APP_Type").val()) == 0) {//-------------نقدي
            rp.IsCredit = 2;

        }
        if (Number($("#txt_ID_APP_Type").val()) == 1) {//-------------آجل
            rp.IsCredit = 1;

        }
        if ($("#txt_indebtedness").val() == ">") {//******عليه مديونيه
            rp.BalStatus = 1;

        }
        if ($("#txt_indebtedness").val() == "<") {//******ليه مديونيه
            rp.BalStatus = 2;

        }
        if ($("#txt_indebtedness").val() == "=") {//******صفري
            rp.BalStatus = 3;

        }
        if ($("#txt_indebtedness").val() == "All") {//******الجميع

            rp.BalStatus = 4;
        }



        Ajax.Callsync({
            url: Url.Action("IProc_Rep_AccCustomerList", "GeneralReports"),
            data: rp,
            success: (d) => {

                let result = d.result as string;


                window.open(result, "_blank");
            }
        })
    }
}













