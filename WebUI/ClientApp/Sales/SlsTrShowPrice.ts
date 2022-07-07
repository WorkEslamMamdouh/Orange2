$(document).ready(() => {

    SlsTrShowPrice.InitalizeComponent();
})
namespace SlsTrShowPrice {
    //system varables
    debugger
    var TrType = 2;
    var compcode: Number;
    var BranchCode: number;
    var sys: SystemTools = new SystemTools();
    var vatType: number;
    var Finyear: number;

    var SysSession: SystemSession = GetSystemSession(Modules.SlsTrShowPrice);
    //ddl
    var ddlStore: HTMLSelectElement;
    var ddlCustomer: HTMLSelectElement;
    var ddlSalesmanFilter: HTMLSelectElement;
    var ddlStateType: HTMLSelectElement;
    var ddlInvoiceType: HTMLSelectElement;
    var ddlInvoiceCustomer: HTMLSelectElement;
    var ddlSalesman: HTMLSelectElement;
    var ddlType: HTMLSelectElement;


    // Arrays
    var VendorDetails: Array<A_Rec_D_Customer> = new Array<A_Rec_D_Customer>();
    var CategoryDetails: Array<I_D_Category> = new Array<I_D_Category>();
    var G_USERSDetails: Array<G_USERS> = new Array<G_USERS>();
    var StateDetailsAr: Array<string> = new Array<string>();
    var StateDetailsEn: Array<string> = new Array<string>();
    var InvoiceDetailsAr: Array<string> = new Array<string>();
    var InvoiceDetailsEn: Array<string> = new Array<string>();
    var InvoiceTypeDetailsAr: Array<string> = new Array<string>();
    var InvoiceEyptDetailsEn: Array<string> = new Array<string>();
    var DetailsVatNature: Array<G_VatNature> = new Array<G_VatNature>();
    var SlsInvoiceStatisticsDetails: Array<IQ_GetSlsInvoiceStatistic> = new Array<IQ_GetSlsInvoiceStatistic>();
    var SearchDetails: Array<IQ_GetSlsInvoiceStatistic> = new Array<IQ_GetSlsInvoiceStatistic>();
    var SlsInvoiceItemsDetails: Array<IQ_GetSlsInvoiceItem> = new Array<IQ_GetSlsInvoiceItem>();
    var FamilyDetails: Array<I_ItemFamily> = new Array<I_ItemFamily>();
    var ItemDetails: Array<IQ_GetItemStoreInfo> = new Array<IQ_GetItemStoreInfo>();
    var AD_VatTypeDetails: A_D_VAT_TYPE = new A_D_VAT_TYPE();
    var SalesmanDetails: Array<I_Sls_D_Salesman> = new Array<I_Sls_D_Salesman>();
    var SalesmanFilterDetails: Array<I_Sls_D_Salesman> = new Array<I_Sls_D_Salesman>();

    //Models
    var InvoiceStatisticsModel: Array<IQ_GetSlsInvoiceStatistic> = new Array<IQ_GetSlsInvoiceStatistic>();
    var InvoiceItemsDetailsModel: Array<I_Sls_TR_InvoiceItems> = new Array<I_Sls_TR_InvoiceItems>();
    var InvoiceModel: I_Sls_TR_Invoice = new I_Sls_TR_Invoice();
    var MasterDetailsModel: SlsInvoiceMasterDetails = new SlsInvoiceMasterDetails();
    var invoiceItemSingleModel: I_Sls_TR_InvoiceItems = new I_Sls_TR_InvoiceItems();
    var List_MinUnitPrice: Array<I_Sls_TR_InvoiceItems> = new Array<I_Sls_TR_InvoiceItems>();
    var ItemFamilyDetails: Array<IQ_GetItemStoreInfo> = new Array<IQ_GetItemStoreInfo>();
    var MasterDetailModel: SlsInvoiceMasterDetails = new SlsInvoiceMasterDetails();
    var storeDetails: Array<G_STORE> = new Array<G_STORE>();
    var Tax_Type_Model: Tax_Type = new Tax_Type();

    //TextBoxes
    var txtStartDate: HTMLInputElement;
    var txtEndDate: HTMLInputElement;
    var txtItemCount: HTMLInputElement;
    var txtPackageCount: HTMLInputElement;
    var txtTotal: HTMLInputElement;
    var txtTax: HTMLInputElement;
    var txtNet: HTMLInputElement;
    var txtCommission: HTMLInputElement;
    var txtInvoiceDate: HTMLInputElement;
    var txtCustomerMobile: HTMLInputElement;
    var txtInvoiceCustomerName: HTMLInputElement;
    var txt_ApprovePass: HTMLInputElement;
    var searchbutmemreport: HTMLInputElement;

    //labels
    var lblInvoiceNumber: HTMLLabelElement;

    //checkbox
    var chkActive: HTMLInputElement;
    var StoreID;

    //buttons 
    var btnAdd: HTMLButtonElement;
    var btnShow: HTMLButtonElement;
    var btnUpdate: HTMLButtonElement;
    var btnAddDetails: HTMLButtonElement;
    var btnBack: HTMLButtonElement;// btnBack btnSave
    var btnSave: HTMLButtonElement;
    var btn_Approveprice: HTMLButtonElement;
    var btn_Exit_Approveprice: HTMLButtonElement;
    //print buttons 

    var btnPrintTrview: HTMLButtonElement;
    var btnPrintTrPDF: HTMLButtonElement;
    var btnPrintTrEXEL: HTMLButtonElement;
    var btnPrintTransaction: HTMLButtonElement;
    //var btnPrintInvoicePrice: HTMLButtonElement;
    var btnPrintslip: HTMLButtonElement;


    // giedView
    var Grid: JsGrid = new JsGrid();

    //global
    var CountGrid = 0;
    var CountItems: number = 0;
    var PackageCount: number = 0;
    var CountTotal: number = 0;
    var TaxCount: number = 0;
    var NetCount: number = 0;
    var commissionCount: number = 0;
    var VatPrc;
    var Validation_Insert = 0;
    var GlobalinvoiceID: number = 0;
    var invoiceID: number;
    //flags : 
    var TypeFlag: boolean = false;
    var IsSuccess: boolean = true;
    var Show: boolean = true;
    var NewAdd: boolean = true;
    var AutherizeFlag: boolean = false;
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);
    var flag_PriceWithVAT = (SysSession.CurrentEnvironment.I_Control[0].SalesPriceWithVAT);

 //   var btnPrint: HTMLInputElement;
    var Tax_Rate = 0;
    export function InitalizeComponent() {
        // VatPrc
        var mod = SysSession.CurrentPrivileges.MODULE_CODE;
         
         if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = "عرض أسعار";
        }
        else {
            document.getElementById('Screen_name').innerHTML = "Quotation";
        }
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);
        Finyear = Number(SysSession.CurrentEnvironment.CurrentYear);

        InitalizeControls();
        InitializeEvents();
        fillddlCustomer();
        Display_Category();
        FillddlFamily();
        fillddlSalesman();
        FillddlStore();
        txtStartDate.value = DateStartMonth();
        txtEndDate.value = ConvertToDateDash(GetDate()) <= ConvertToDateDash(SysSession.CurrentEnvironment.EndDate) ? GetDate() : SysSession.CurrentEnvironment.EndDate;

        FillddlStateType(); DisplayMassage
        FillddlInvoiceType();
        FillddlType();
        vatType = SysSession.CurrentEnvironment.I_Control[0].DefSlsVatType;
        FillddlVatNature();
        // GetVatPercentage();
        $('#ddlStateType').prop("value", "2");
        $('#ddlInvoiceType').prop("value", "2");
        txtItemCount.value = CountItems.toString();
        txtPackageCount.value = PackageCount.toString();
        txtTotal.value = CountTotal.toString();
        txtTax.value = TaxCount.toString();
        txtNet.value = NetCount.toString();
        txtCommission.value = commissionCount.toString();
        GetAllIItem();

       // $('#btnPrint').addClass('display_none');
    }
    function InitalizeControls() {
      //  btnPrint = document.getElementById("btnPrint") as HTMLInputElement;

        // Drop down lists
        ddlStore = document.getElementById("ddlStore") as HTMLSelectElement;
        ddlCustomer = document.getElementById("ddlCustomer") as HTMLSelectElement;
        ddlSalesmanFilter = document.getElementById("ddlSalesmanFilter") as HTMLSelectElement;
        ddlStateType = document.getElementById("ddlStateType") as HTMLSelectElement;
        ddlInvoiceCustomer = document.getElementById("ddlInvoiceCustomer") as HTMLSelectElement;
        ddlSalesman = document.getElementById("ddlSalesman") as HTMLSelectElement;
        ddlInvoiceType = document.getElementById("ddlInvoiceType") as HTMLSelectElement;
        ddlType = document.getElementById("ddlType") as HTMLSelectElement;

        //TextBoxes
        searchbutmemreport = document.getElementById("searchbutmemreport") as HTMLInputElement;
        txtStartDate = document.getElementById("txtStartDate") as HTMLInputElement;
        txtEndDate = document.getElementById("txtEndDate") as HTMLInputElement;
        txtItemCount = document.getElementById("txtItemCount") as HTMLInputElement;
        txtPackageCount = document.getElementById("txtPackageCount") as HTMLInputElement;
        txtTotal = document.getElementById("txtTotal") as HTMLInputElement;
        txtTax = document.getElementById("txtTax") as HTMLInputElement;
        txtNet = document.getElementById("txtNet") as HTMLInputElement;
        txtCommission = document.getElementById("txtCommission") as HTMLInputElement;
        txtInvoiceDate = document.getElementById("txtInvoiceDate") as HTMLInputElement;
        txtCustomerMobile = document.getElementById("txtCustomerMobile") as HTMLInputElement;
        txtInvoiceCustomerName = document.getElementById("txtInvoiceCustomerName") as HTMLInputElement;
        txt_ApprovePass = document.getElementById("txt_ApprovePass") as HTMLInputElement;

        //labels
        lblInvoiceNumber = document.getElementById("lblInvoiceNumber") as HTMLLabelElement;

        //checkbox
        chkActive = document.getElementById("chkActive") as HTMLInputElement;
        //button
        btnAdd = document.getElementById("btnAdd") as HTMLButtonElement;
        btnShow = document.getElementById("btnShow") as HTMLButtonElement;
        btnUpdate = document.getElementById("btnUpdate") as HTMLButtonElement;
        btnAddDetails = document.getElementById("btnAddDetails") as HTMLButtonElement;// btnBack btnSave
        btnBack = document.getElementById("btnBack") as HTMLButtonElement;
        btnSave = document.getElementById("btnSave") as HTMLButtonElement;
        btn_Approveprice = document.getElementById("btn_Approveprice") as HTMLButtonElement;
        btn_Exit_Approveprice = document.getElementById("btn_Exit_Approveprice") as HTMLButtonElement;
        //print 
        btnPrintTrview = document.getElementById("btnPrintTrview") as HTMLButtonElement;
        btnPrintTrPDF = document.getElementById("btnPrintTrPDF") as HTMLButtonElement;
        btnPrintTrEXEL = document.getElementById("btnPrintTrEXEL") as HTMLButtonElement;
        btnPrintTransaction = document.getElementById("btnPrintTransaction") as HTMLButtonElement;
        btnPrintslip = document.getElementById("btnPrintslip") as HTMLButtonElement;
        //////debugger
        //btnPrintInvoicePrice = document.getElementById("btnPrintInvoicePrice") as HTMLButtonElement;

    }
    function InitializeEvents() {

        chkActive.onclick = chkActive_onchecked;
        btnAdd.onclick = btnAdd_onclick;
        btnShow.onclick = btnShow_onclick;
        btnUpdate.onclick = btnUpdate_onclick;
        btnAddDetails.onclick = AddNewRow;
        btnBack.onclick = btnBack_onclick;
        btnSave.onclick = btnSave_onclick;
        txtCommission.onkeyup = txtCommission_onchange;
        ddlType.onchange = ddlType_onchange;
        btn_Approveprice.onclick = btn_Approveprice_onclick;
        btn_Exit_Approveprice.onclick = btn_Exit_Approveprice_onclick;
        ddlInvoiceCustomer.onchange = ddlInvoiceCustomer_onchange;
        //print
        btnPrintTrview.onclick = () => { PrintReport(1); }
        btnPrintTrPDF.onclick = () => { PrintReport(2); }
        btnPrintTrEXEL.onclick = () => { PrintReport(3); }
    //    btnPrint.onclick = () => { PrintReport(4); }
        btnPrintTransaction.onclick = PrintTransaction;
        btnPrintslip.onclick = btnPrintslip_onclick;
        //////debugger
        //btnPrintInvoicePrice.onclick = btnPrintInvoicePrice_onclick;
        searchbutmemreport.onkeyup = _SearchBox_Change;
    }
    function Check_on_user_type() {

        if (SysSession.CurrentEnvironment.UserType == 1 || SysSession.CurrentEnvironment.UserType == 3) { //Salesman

            let SalesId = SysSession.CurrentEnvironment.SalesManID;
            SalesmanDetails = SalesmanDetails.filter(s => s.SalesmanId == SalesId);

        }

    }
    function ddlInvoiceCustomer_onchange() {
        if (ddlInvoiceCustomer.value == "null") {
            if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
                txtInvoiceCustomerName.value = "عميل نقدي عام";
                txtCustomerMobile.value = '';
            }
            else {
                txtInvoiceCustomerName.value = "General cash client";
                txtCustomerMobile.value = '';

            }
            ddlType.value = "1";
        } else {
            var custID = Number(ddlInvoiceCustomer.value);
            var customer = VendorDetails.filter(s => s.CustomerId == custID);
            vatType = customer[0].VATType;
            txtInvoiceCustomerName.value = customer[0].NAMEA.toString();
            txtCustomerMobile.value = customer[0].MOBILE;
            if (SysSession.CurrentEnvironment.UserType != 1 && SysSession.CurrentEnvironment.UserType != 3) {
                ddlSalesman.value = customer[0].SalesmanId == null ? 'null' : customer[0].SalesmanId.toString();
                if (ddlSalesman.value == '') {
                    ddlSalesman.value = 'null';
                }
            }

        }


        if (CountItems > 0) {
            DisplayMassage("من فضلك اعادة ادخال  بيانات الفاتورة مره أخري", "Please re-enter the billing information again", MessageType.Worning);
        }

        CountItems = 0;
        PackageCount = 0;
        CountTotal = 0;
        TaxCount = 0;
        NetCount = 0;
        CountGrid = 0;
        $('#div_Data').html("");
        ComputeTotals();
        AddNewRow();

    }
    function ddlType_onchange() {
        if (ddlType.value == "1") {//نقدي 
            if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
                txtInvoiceCustomerName.value = "عميل نقدي عام";
                txtCustomerMobile.value = "";
            }
            else {
                txtInvoiceCustomerName.value = "General cash client";
                txtCustomerMobile.value = "";
            }
            txtCustomerMobile.value = "";
            //$('#ddlInvoiceCustomer option[value=null]').prop('selected', 'selected').change();
            $('#ddlInvoiceCustomer').val('null');
            $("#ddlInvoiceCustomer").attr("disabled", "disabled");
            $("#txtCustomerMobile").attr("disabled", "disabled");
            $("#txtInvoiceCustomerName").removeAttr("disabled");

            vatType = SysSession.CurrentEnvironment.I_Control[0].DefSlsVatType; //From Session

            TypeFlag = true;
        } else {//علي الحساب

            $('#ddlCashBox').prop('selectedIndex', 0);
            $('#ddlCashBox').attr('disabled', 'disabled');
            txtInvoiceCustomerName.value = "";
            $("#txtInvoiceCustomerName").attr("disabled", "disabled");
            $("#ddlInvoiceCustomer").removeAttr("disabled");
            $("#txtCustomerMobile").removeAttr("disabled");

            TypeFlag = false;

            //fillddlCustomer();
        }


        if (CountItems > 0) {
            DisplayMassage("من فضلك اعادة ادخال  بيانات الفاتورة مره أخري", "Please re-enter the billing information again", MessageType.Worning);
        }

        CountItems = 0;
        PackageCount = 0;
        CountTotal = 0;
        TaxCount = 0;
        NetCount = 0;
        CountGrid = 0;
        $('#div_Data').html("");

        ComputeTotals();

    }
    function txtCommission_onchange() {


        var comm = Number(txtCommission.value);
        let net = (Number(txtTotal.value) + Number(txtTax.value)).RoundToSt(2);
        if (Number(txtCommission.value) >= Number(net)) {
            DisplayMassage(" يجب ان تكون العموله اقل من الصافى", "The commission should be less than the Net", MessageType.Error);
            txtCommission.value = "0";
            Errorinput(txtCommission);
            Errorinput(txtNet);
            commissionCount = 0;
            txtNet.value = net.toString();
        }
        else {
            txtNet.value = (Number(net) - Number(txtCommission.value)).RoundToSt(2).toString();
            commissionCount = Number(txtCommission.value);
        }

        //if (Number(txtCommission.value) >= Number(txtTotal.value)) { 
        //    DisplayMassage(" يجب ان تكون العموله اقل من الاجمالي", "The commission should be less than the total", MessageType.Error);   
        //    txtCommission.value = "0";
        //    Errorinput(txtCommission); 
        //}
        //commissionCount = Number(txtCommission.value);
    }
    function checkValidation() {
        if (!SysSession.CurrentPrivileges.CUSTOM1) {
            chkActive.disabled = true;
        } else {
            chkActive.disabled = false;
        }
    }
    function btnSave_onclick() {
        loading('btnsave');

        setTimeout(function () {

            finishSave('btnsave');
        if (!SysSession.CurrentPrivileges.AddNew) return;
        if (!ValidationHeader()) return;

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

            if (ddlInvoiceCustomer.selectedIndex != 0 && ddlType.value == "0") {

                let net = Number(txtNet.value);
                if (!Check_CreditLimit_Custom(net))
                    return;
            }

            Validation_Insert = 0;
            MasterDetailsModel = new SlsInvoiceMasterDetails();
            Assign();
         

            InvoiceModel.VatType = vatType;
            InvoiceModel.VatAmount = Number(txtTax.value);
            InvoiceModel.CommitionAmount = Number(txtCommission.value);

            if (Validation_Insert == 1) { Open_poup_Pass(); }
            else if (NewAdd == true) {

                InvoiceModel.CreatedAt = DateTimeFormat(Date().toString());
                InvoiceModel.CreatedBy = SysSession.CurrentEnvironment.UserCode;

                MasterDetailsModel.I_Sls_TR_Invoice = InvoiceModel;
                insert();

            }
            else {

                InvoiceModel.UpdatedBy = SysSession.CurrentEnvironment.UserCode;
                InvoiceModel.UpdatedAt = DateTimeFormat(Date().toString());
                MasterDetailsModel.I_Sls_TR_Invoice = InvoiceModel;
                if (AutherizeFlag == false) {

                    Update();
                }
                else {
                    updateWithProcess();
                }

                IsSuccess = false;
                //$("#btnPrintInvoicePrice").removeClass("display_none");   
            }
            }

        }, 100);
    }
    function fillddlCustomer() {

        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefCustomer", "GetAll"),
            data: {
                CompCode: compcode, BranchCode: BranchCode, AccountType: 1, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {

                    VendorDetails = result.Response as Array<A_Rec_D_Customer>;
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {//ddlInvoiceCustomer
                        DocumentActions.FillCombowithdefult(VendorDetails, ddlCustomer, "CustomerId", "NAMEE", "Select customer");
                        DocumentActions.FillCombowithdefult(VendorDetails, ddlInvoiceCustomer, "CustomerId", "NAMEE", "Select customer");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(VendorDetails, ddlCustomer, "CustomerId", "NAMEA", "اختر العميل");
                        DocumentActions.FillCombowithdefult(VendorDetails, ddlInvoiceCustomer, "CustomerId", "NAMEA", "اختر العميل");
                    }
                }
            }
        });
    }
    function btnBack_onclick() {
        if (NewAdd == true) { //add

            $("#DivInvoiceDetails").addClass("display_none");
            $("#cotrolDiv").removeClass("disabledDiv");
            $("#divIconbar").removeClass("disabledIconbar");
            $("#txtInvoiceCustomerName").attr("disabled", "disabled");
            $("#txtCustomerMobile").attr("disabled", "disabled");
            $("#ddlType").attr("disabled", "disabled");
            $("#chkActive").attr("disabled", "disabled");
            $("#txtCommission").attr("disabled", "disabled");

            //$("#btnPrintInvoicePrice").removeClass("display_none");      

            $("#btnUpdate").removeClass("display_none");
            $("#btnPrintTransaction").removeClass("display_none");
            $("#btnBack").addClass("display_none");
            $("#btnSave").addClass("display_none");

        }
        else {//Edit

            Grid_RowDoubleClicked();
            $("#cotrolDiv").removeClass("disabledDiv");
            $("#divIconbar").removeClass("disabledIconbar");
            $("#txtInvoiceCustomerName").attr("disabled", "disabled");
            $("#txtCustomerMobile").attr("disabled", "disabled");
            $("#ddlType").attr("disabled", "disabled");
            $("#chkActive").attr("disabled", "disabled");
            $("#txtCommission").attr("disabled", "disabled");

            //$("#btnPrintInvoicePrice").removeClass("display_none");    

            $("#btnUpdate").removeClass("display_none");
            $("#btnPrintTransaction").removeClass("display_none");
            $("#btnBack").addClass("display_none");
            $("#btnSave").addClass("display_none");

        }

    }
    function fillddlSalesman() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefSalesMen", "GetAllSalesPeople"),// GetAllSalesPeople(int CompCode, bool IsSalesEnable, string UserCode, string Token)
            data: {
                CompCode: compcode, BranchCode: BranchCode, IsSalesEnable: true, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {

                    SalesmanDetails = result.Response as Array<I_Sls_D_Salesman>;
                    SalesmanDetails = SalesmanDetails.filter(s => s.Isactive == true);
                    Check_on_user_type();

                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                        DocumentActions.FillCombowithdefult(SalesmanDetails, ddlSalesman, "SalesmanId", "NameE", "Select Salesman");
                        DocumentActions.FillCombowithdefult(SalesmanDetails, ddlSalesmanFilter, "SalesmanId", "NameE", "Select Category");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(SalesmanDetails, ddlSalesman, "SalesmanId", "NameA", "اختر المندوب");
                        DocumentActions.FillCombowithdefult(SalesmanDetails, ddlSalesmanFilter, "SalesmanId", "NameA", "اختر المندوب");
                    }
                    SysSession.CurrentEnvironment.UserType == 1 || SysSession.CurrentEnvironment.UserType == 3 ? ($('#ddlSalesman option[value="null"]').remove()) : $('#ddlSalesman').prop('selectedIndex', 0);
                    SysSession.CurrentEnvironment.UserType == 1 || SysSession.CurrentEnvironment.UserType == 3 ? ($('#ddlSalesmanFilter option[value="null"]').remove()) : $('#ddlSalesmanFilter').prop('selectedIndex', 0);

                }
            }
        });
    }
    function FillddlStateType() {
        StateDetailsAr = ["غير معتمد", " معتمد", "الجميع"];
        StateDetailsEn = [" Not Approved", " Approved", "All"];

        if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
            for (let i = 0; i < StateDetailsEn.length; i++) {
                let newoption = document.createElement("option");
                newoption.value = i.toString();
                newoption.text = StateDetailsEn[i];
                ddlStateType.options.add(newoption);
            }
        }
        else {
            for (let i = 0; i < StateDetailsAr.length; i++) {
                let newoption = document.createElement("option");
                newoption.value = i.toString();
                newoption.text = StateDetailsAr[i];
                ddlStateType.options.add(newoption);
            }
        }
    }
    function FillddlInvoiceType() {
        InvoiceDetailsAr = ["علي الحساب", " نقدي", "الجميع"];
        InvoiceDetailsEn = [" Credit ", " Cash", "All"];

        if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
            for (let i = 0; i < InvoiceDetailsEn.length; i++) {
                let newoption = document.createElement("option");
                newoption.value = i.toString();
                newoption.text = InvoiceDetailsEn[i];
                ddlInvoiceType.options.add(newoption);
            }
        }
        else {
            for (let i = 0; i < InvoiceDetailsAr.length; i++) {
                let newoption = document.createElement("option");
                newoption.value = i.toString();
                newoption.text = InvoiceDetailsAr[i];
                ddlInvoiceType.options.add(newoption);
            }
        }
    }
    function FillddlType() {
        InvoiceTypeDetailsAr = ["علي الحساب", " نقدي"];
        InvoiceEyptDetailsEn = [" Credit ", " Cash"];

        if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
            for (let i = 0; i < InvoiceEyptDetailsEn.length; i++) {
                let newoption = document.createElement("option");
                newoption.value = i.toString();
                newoption.text = InvoiceEyptDetailsEn[i];
                ddlType.options.add(newoption);
            }
        }
        else {
            for (let i = 0; i < InvoiceTypeDetailsAr.length; i++) {
                let newoption = document.createElement("option");
                newoption.value = i.toString();
                newoption.text = InvoiceTypeDetailsAr[i];
                ddlType.options.add(newoption);
            }
        }

    }
    function btnAdd_onclick() {
        $("#DivInvoiceDetails").removeClass("display_none");

        lblInvoiceNumber.innerText = '0';
        txtInvoiceDate.value = GetDate();
        ddlInvoiceCustomer.value = 'null'
        txtInvoiceCustomerName.value = ''
        txtCustomerMobile.value = ''
        ddlSalesman.value = 'null'
        SysSession.CurrentEnvironment.UserType == 1 || SysSession.CurrentEnvironment.UserType == 3 ? ($('#ddlStore option[value="null"]').remove()) : $('#ddlStore').prop('selectedIndex', 1);
        ddlType.value = '1'
        txtTotal.value = '0'
        txtTax.value = '0'
        txtNet.value = '0'
        txtCommission.value = '0'
        txtItemCount.value = '0'
        txtPackageCount.value = '0'
        chkActive.checked = true;
        $('#txtCreatedBy').prop("value", "");
        $('#txtCreatedAt').prop("value", "");
        $('#txtUpdatedBy').prop("value", "");
        $('#txtUpdatedAt').prop("value", "");

        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            txtInvoiceCustomerName.value = "عميل نقدي عام";
            txtCustomerMobile.value = "";
        }
        else {
            txtInvoiceCustomerName.value = "General cash client";
            txtCustomerMobile.value = "";
        }
        txtCustomerMobile.value = "";
        //$('#ddlInvoiceCustomer option[value=null]').prop('selected', 'selected').change();
        $('#ddlInvoiceCustomer').val('null');
        $("#ddlInvoiceCustomer").attr("disabled", "disabled");
        $("#txtCustomerMobile").attr("disabled", "disabled");
        $("#txtInvoiceCustomerName").removeAttr("disabled");


        TypeFlag = true;
        chkActive.disabled = false;
        txtInvoiceDate.disabled = false;
        txtInvoiceCustomerName.disabled = false;
        ddlSalesman.disabled = false;
        ddlStore.disabled = false;
        ddlType.disabled = false;
        txtCommission.disabled = false;


        $("#btnAddDetails").removeClass("display_none");
        $("#btnUpdate").addClass("display_none");
        $("#btnPrintTransaction").addClass("display_none");
        //$("#btnPrintInvoicePrice").addClass("display_none");
        $("#div_btnPrint").addClass("display_none");
        $("#btnBack").removeClass("display_none");
        $("#btnSave").removeClass("display_none");


        $("#div_Data").html("");
        CountGrid = 0;
        CountItems = 0;

        $("#cotrolDiv").attr("disabled", "disabled").off('click');
        $("#cotrolDiv").addClass("disabledDiv");
        $("#divIconbar").attr("disabled", "disabled").off('click');
        $("#divIconbar").addClass("disabledIconbar");

        Show = false;

        NewAdd = true;

        AddNewRow();
        SysSession.CurrentEnvironment.I_Control[0].IvoiceDateEditable == true ? $('#txtInvoiceDate').removeAttr("disabled") : $('#txtInvoiceDate').attr("disabled", "disabled");

    }
    function btnShow_onclick() {
        InitializeGrid();
        $("#divShow").removeClass("display_none");
        $("#DivInvoiceDetails").addClass("display_none");
        $("#cotrolDiv").removeClass("disabledDiv");
    }
    function btnUpdate_onclick() {
        if (!SysSession.CurrentPrivileges.EDIT) return;
        $("#cotrolDiv").attr("disabled", "disabled").off('click');
        $("#cotrolDiv").addClass("disabledDiv");
        $("#divIconbar").attr("disabled", "disabled").off('click');
        $("#divIconbar").addClass("disabledIconbar");
        Show = false;
        $("#btnUpdate").addClass("display_none");
        $("#btnPrintTransaction").addClass("display_none");
        //$("#btnPrintInvoicePrice").addClass("display_none");
        $("#div_btnPrint").addClass("display_none");
        $("#btnBack").removeClass("display_none");
        $("#btnSave").removeClass("display_none");

        var items: number = Number(CountGrid);
        for (let i = 0; i < items + 1; i++) {
            $("#ddlFamily" + i).removeAttr("disabled");
            $("#ddlItem" + i).removeAttr("disabled");
            $("#txtQuantity" + i).removeAttr("disabled");
            $("#txtPrice" + i).removeAttr("disabled");
            $("#txtUnitpriceWithVat" + i).removeAttr("disabled");

            $('.btn-number1' + i).removeAttr("disabled");
            $('.input-number1' + i).removeAttr("disabled");

            $('.btn-number2' + i).removeAttr("disabled");
            $('.input-number2' + i).removeAttr("disabled");

            $('.btn-number3' + i).removeAttr("disabled");
            $('.input-number3' + i).removeAttr("disabled");

            $("#btn_minus" + i).removeClass("display_none");
            $("#btn_minus" + i).removeAttr("disabled");
            $("#btn_minus" + i).click(function (e) {
                //  alert("hi");
                DeleteRow(i);
            });
        }
        //$("#txtInvoiceDate").removeAttr("disabled");
        $("#ddlInvoiceCustomer").removeAttr("disabled");
        $("#ddlSalesman").removeAttr("disabled");
        $("#txtInvoiceCustomerName").removeAttr("disabled");
        $("#txtCustomerMobile").removeAttr("disabled");
        $("#ddlType").removeAttr("disabled");
        $("#chkActive").removeAttr("disabled");
        $("#txtCommission").removeAttr("disabled");
        $("#btnAddDetails").removeClass("display_none");
        checkValidation();

        NewAdd = false;

        if (ddlType.value == "1") {//نقدي 
            if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
                txtInvoiceCustomerName.value = "عميل نقدي عام";
                txtCustomerMobile.value = "";
            }
            else {
                txtInvoiceCustomerName.value = "General cash client";
                txtCustomerMobile.value = "";
            }
            txtCustomerMobile.value = "";
            //$('#ddlInvoiceCustomer option[value=null]').prop('selected', 'selected').change();
            $('#ddlInvoiceCustomer').val('null');
            $("#ddlInvoiceCustomer").attr("disabled", "disabled");
            $("#txtCustomerMobile").attr("disabled", "disabled");
            $("#txtInvoiceCustomerName").removeAttr("disabled");

            TypeFlag = true;
        } else {//علي الحساب

            $('#ddlCashBox').prop('selectedIndex', 0);
            $('#ddlCashBox').attr('disabled', 'disabled');

            $("#txtInvoiceCustomerName").attr("disabled", "disabled");
            $("#ddlInvoiceCustomer").removeAttr("disabled");
            $("#txtCustomerMobile").removeAttr("disabled");

            TypeFlag = false;
        }
        SysSession.CurrentEnvironment.I_Control[0].IvoiceDateEditable == true ? $('#txtInvoiceDate').removeAttr("disabled") : $('#txtInvoiceDate').attr("disabled", "disabled");

    }
    function InitializeGrid() {
        let res: any = GetResourceList("");
        Grid.ElementName = "divGridDetails";
        Grid.Paging = true;
        Grid.PageSize = 10;
        Grid.Sorting = true;
        Grid.InsertionMode = JsGridInsertionMode.Binding;
        Grid.Editing = false;
        Grid.Inserting = false;
        Grid.SelectedIndex = 1;
        Grid.OnRowDoubleClicked = Grid_RowDoubleClicked;
        Grid.OnItemEditing = () => { };
        Grid.PrimaryKey = "InvoiceID";
        Grid.Columns = [
            { title: res.App_Number, name: "InvoiceID", type: "text", width: "2%", visible: false },
            { title: res.App_Number, name: "TrNo", type: "text", width: "13%" },
            { title: res.App_Cutomer, name: "CustomerName", type: "text", width: "25%" },
            { title: res.App_Salesman, name: (lang == "ar" ? "Slsm_DescA" : "Slsm_DescE"), type: "text", width: "25%" },
            { title: res.App_date, name: "TrDate", type: "text", width: "20%" },
            { title: res.Men_StkDefItems, name: "Line_Count", type: "text", width: "12%" },
            { title: res.App_Package, name: "Tot_Qty", type: "text", width: "12%" },
            { title: res.App_total, name: "TotalAmount", type: "text", width: "15%" },
            { title: res.App_Tax, name: "VatAmount", type: "text", width: "12%" },
            { title: res.App_Net, name: "NetAfterVat", type: "text", width: "13%" },
            { title: res.App_Commission, name: "CommitionAmount", type: "text", width: "15%" },
            { title: res.App_TobePaid, name: "RemainAmount", type: "text", width: "17%", css: "classfont" },
            { title: res.App_invoiceType, name: "IsCashDesciption", type: "text", width: "16%" },
            { title: res.App_Certified, name: "statusDesciption", type: "text", width: "17%" },
        ];
        BindStatisticGridData();
    }
    function BindStatisticGridData() {
        var startDate = DateFormatRep(txtStartDate.value).toString();
        var endDate = DateFormatRep(txtEndDate.value).toString();
        var customerId = 0;
        var status = 0;
        var ddlSalesmanFilterValue = 0;
        var IsCash: number = 0;

        if (ddlCustomer.value != "null") {
            customerId = Number(ddlCustomer.value.toString());
        }

        if (ddlSalesmanFilter.value != "null") {
            ddlSalesmanFilterValue = Number(ddlSalesmanFilter.value.toString());
        }
        if (ddlStateType.value != "null") {
            status = Number(ddlStateType.value.toString());
        }
        if (Number(ddlInvoiceType.value) == 0) {
            IsCash = 0;
        } else if (Number(ddlInvoiceType.value) == 1) {
            IsCash = 1;
        } else {
            IsCash = 2;
        }

        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("SlsTrSales", "GetAllSlsTrShowPriceStatistic"),
            data: { CompCode: compcode, BranchCode: BranchCode, IsCash: IsCash, StartDate: startDate, EndDate: endDate, Status: status, CustId: customerId, SalesMan: ddlSalesmanFilterValue, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {//(int CompCode, string StartDate, string EndDate, int Status, int? CustId, string SalesUser, string UserCode, string Token)
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    SlsInvoiceStatisticsDetails = result.Response as Array<IQ_GetSlsInvoiceStatistic>;
                    for (let i = 0; i < SlsInvoiceStatisticsDetails.length; i++) {
                        SlsInvoiceStatisticsDetails[i].TrDate = DateFormat(SlsInvoiceStatisticsDetails[i].TrDate.toString());
                        SlsInvoiceStatisticsDetails[i].statusDesciption = SlsInvoiceStatisticsDetails[i].Status == 1 ? (lang == "ar" ? "معتمد" : "A certified") : (lang == "ar" ? "غير معتمد" : "Not supported");
                        SlsInvoiceStatisticsDetails[i].IsCashDesciption = SlsInvoiceStatisticsDetails[i].IsCash == true ? (lang == "ar" ? "نقدي" : "Cash") : (lang == "ar" ? "علي الحساب" : "On account");
                    }
                    Grid.DataSource = SlsInvoiceStatisticsDetails;
                    Grid.Bind();
                }
            }
        });
    }
    function Grid_RowDoubleClicked() {
        //debugger
        Show = true;//   //////debugger;
        $("#btnUpdate").removeClass("display_none");
        $("#btnPrintTransaction").removeClass("display_none");
        $("#DivInvoiceDetails").removeClass("display_none");
        clear();
        InvoiceStatisticsModel = new Array<IQ_GetSlsInvoiceStatistic>();
        let Selecteditem
        Selecteditem = SlsInvoiceStatisticsDetails.filter(x => x.InvoiceID == Number(Grid.SelectedKey));
        try {
            GlobalinvoiceID = Number(Selecteditem[0].InvoiceID);

        } catch (e) {
            Selecteditem = SlsInvoiceStatisticsDetails.filter(x => x.InvoiceID == Number(invoiceID));
            GlobalinvoiceID = Number(Selecteditem[0].InvoiceID);
        }
        InvoiceStatisticsModel = Selecteditem;
        if (InvoiceStatisticsModel.length) {
            txtItemCount.value = InvoiceStatisticsModel[0].Line_Count.toString();
            txtPackageCount.value = InvoiceStatisticsModel[0].Tot_Qty.toString();
            txtTotal.value = InvoiceStatisticsModel[0].TotalAmount.toString();
            txtTax.value = InvoiceStatisticsModel[0].VatAmount.toString();
            txtNet.value = InvoiceStatisticsModel[0].NetAfterVat.toString();
            txtCommission.value = InvoiceStatisticsModel[0].CommitionAmount.toString();
            commissionCount = InvoiceStatisticsModel[0].CommitionAmount;
            ComputeTotals();
            GlobalinvoiceID = InvoiceStatisticsModel[0].InvoiceID;
            lblInvoiceNumber.innerText = InvoiceStatisticsModel[0].TrNo.toString();
            txtInvoiceDate.value = DateFormat(InvoiceStatisticsModel[0].TrDate.toString());
            StoreID = Selecteditem[0].StoreId

            if (InvoiceStatisticsModel[0].CustomerId != null) {
                ddlInvoiceCustomer.value = InvoiceStatisticsModel[0].CustomerId.toString();
                $('#txtInvoiceCustomerName').val(InvoiceStatisticsModel[0].Cus_NameA);
                $('#txtCustomerMobile').prop("value", InvoiceStatisticsModel[0].CustomerMobileNo);
            } else {
                $('#txtInvoiceCustomerName').val(InvoiceStatisticsModel[0].CustomerName);
                $('#txtCustomerMobile').prop("value", InvoiceStatisticsModel[0].CustomerMobileNo);
                ddlInvoiceCustomer.value = 'null';
            }

            var ddlSalesmanValue = InvoiceStatisticsModel[0].SalesmanId.toString();
            $('#ddlSalesman').prop("value", ddlSalesmanValue);

            if (InvoiceStatisticsModel[0].Status == 1) {
                chkActive.checked = true;
                chkPreivilegeToEditApprovedInvoice();
            } else {
                chkActive.checked = false;
                btnUpdate.disabled = !SysSession.CurrentPrivileges.EDIT;
                chkActive.disabled = true;

            }
            if (InvoiceStatisticsModel[0].IsCash == true) {
                $('#ddlType').prop("value", "1");
                if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
                    txtInvoiceCustomerName.value = "عميل نقدي عام";
                    txtCustomerMobile.value = "";
                }
                else {
                    txtInvoiceCustomerName.value = "General cash client";
                    txtCustomerMobile.value = "";
                }
                txtCustomerMobile.value = "";
                //$('#ddlInvoiceCustomer option[value=null]').prop('selected', 'selected').change();
                $('#ddlInvoiceCustomer').val('null');
                $("#ddlInvoiceCustomer").attr("disabled", "disabled");
                $("#txtCustomerMobile").attr("disabled", "disabled");
                $("#txtInvoiceCustomerName").removeAttr("disabled");


                TypeFlag = true;
            } else {
                $('#ddlType').prop("value", "0");
                $('#ddlCashBox').prop('selectedIndex', 0);
                $('#ddlCashBox').attr('disabled', 'disabled');

                $("#txtInvoiceCustomerName").attr("disabled", "disabled");
                $("#ddlInvoiceCustomer").removeAttr("disabled");
                $("#txtCustomerMobile").removeAttr("disabled");

                TypeFlag = false;
            }

            $('#divCreationPanel').removeClass("display_none");

            $('#txtCreatedBy').prop("value", InvoiceStatisticsModel[0].CreatedBy);
            $('#txtCreatedAt').prop("value", InvoiceStatisticsModel[0].CreatedAt);

            $('#txtUpdatedBy').prop("value", InvoiceStatisticsModel[0].UpdatedBy);
            $('#txtUpdatedAt').prop("value", InvoiceStatisticsModel[0].UpdatedAt);
        }
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("SlsTrSales", "GetSlsInvoiceItem"),
            data: { invoiceID: GlobalinvoiceID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {//(int CompCode, string StartDate, string EndDate, int Status, int? CustId, string SalesUser, string UserCode, string Token)
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    SlsInvoiceItemsDetails = result.Response as Array<IQ_GetSlsInvoiceItem>;
                    for (let i = 0; i < SlsInvoiceItemsDetails.length; i++) {
                        BuildControls(i);
                    }
                    CountGrid = SlsInvoiceItemsDetails.length;
                    CountItems = SlsInvoiceItemsDetails.length;
                }
            }
        });
        $("#btnSave").addClass("display_none");
        $("#btnBack").addClass("display_none");

        $("txtInvoiceDate").attr("disabled", "disabled");
        $("ddlInvoiceCustomer").attr("disabled", "disabled");
        $("ddlSalesman").attr("disabled", "disabled");

        txtInvoiceDate.disabled = true;
        ddlInvoiceCustomer.disabled = true;
        ddlSalesman.disabled = true;

        txtInvoiceDate.disabled = true;
        ddlInvoiceCustomer.disabled = true;
        txtInvoiceCustomerName.disabled = true;
        txtCustomerMobile.disabled = true;

        ddlSalesman.disabled = true;
        ddlType.disabled = true;
        txtCommission.disabled = true;

        if (InvoiceStatisticsModel[0].Status == 1) {
            if (!SysSession.CurrentPrivileges.CUSTOM2) {
                AutherizeFlag = false;
                $("#btnUpdate").addClass("display_none");
            } else {
                AutherizeFlag = true;
                $("#btnUpdate").removeClass("display_none");

            }
        }
        DocumentActions.RenderFromModel(InvoiceStatisticsModel[0]);
        $("#div_btnPrint").addClass("display_none");

    }
    function BuildControls(cnt: number) {
        var html;
        //debugger;
        html = `<tr>
                    <input id="InvoiceItemID${cnt}" type="hidden" class="form-control display_none"  />
	                <th>
		                <div class="form-group">
			                <span id="btn_minus${cnt}"><i class="fas fa-minus-circle fs-4 btn-minus"></i></span>
		                </div>
	                </th>
                    <th>
		                <div class="form-group">
			                <input id="txtSerial${cnt}" type="text" class="form-control" disabled />
		                </div>
	                </th>
                    <th>
		                <div class="form-group">
			                <select id="ddlFamily${cnt}" class="form-control select_">
                                 <option value="null"> ${(lang == "ar" ? "النوع" : "Type")} </option>
                            </select>
		                </div>
	                </th>
                     <th>
		                <div class="form-group">
			                <select id="ddlItem${cnt}" class="form-control select_">
                              <option value="null">  ${(lang == "ar" ? "الصنف" : "Item")} </option>
                            </select>
		                </div>
	                </th>
                     <th>
		                <div class="form-group">
			                <div class="form-group ps-1">
			                    <input class="counter" type="number" data-id="number" id="txtQuantity${cnt}" name="quant[3]" value="1" min="0" max="1000" step="1"/>
			                    <div class="value-button decrease-button btn-number1${cnt}" data-id="decrease" id="btnminus1" data-type="minus" data-field="quant[1]">-</div>
			                    <div class="value-button increase-button btn-number1${cnt}" data-id="increase" id="btnplus1" data-type="plus" data-field="quant[1]">+</div>
		                    </div>
		                </div>
	                </th>
                    <th>
		                <div class="form-group">
			                <input type="text"  class="form-control" id="txtReturnQuantity${cnt}" name="quant[3]" class="form-control" value="0" min="0" max="1000" step="1">
		                </div>
	                </th>
                    <th>
		                <div class="form-group">
			                <input type="text"  class="form-control" id="txtPrice${cnt}" name="quant[3]" class="form-control" value="0" min="0" step="1">
		                </div>
	                </th>
                    <th>
		                <div class="form-group">
			               <input id="txtUnitpriceWithVat${cnt}" type="text"  class="form-control"  name="quant[3]" class="form-control" value="0" min="0" step="1">
		                </div>
	                </th>
                    <th>
		                <div class="form-group">
			              <input id="txtTax_Rate${cnt}" type="text" class="form-control" disabled />
		                </div>
	                </th>
                    <th>
		                <div class="form-group">
			              <input id="txtTotal${cnt}" type="text" class="form-control" disabled />
		                </div>
	                </th>
                    <th>
		                <div class="form-group">
			            <input id="txtTax${cnt}" type="text" class="form-control" disabled />
		                </div>
	                </th>
                    <th>
		                <div class="form-group">
			              <input id="txtTotAfterTax${cnt}" type="text" class="form-control" disabled />
		                </div>
	                </th>
                    <input id="UnitCost${cnt}" name = " " type = "hidden" class="form-control"/>
                    <input id="txt_StatusFlag${cnt}" name = " " type = "hidden" class="form-control"/>
                    <input id="txt_ID${cnt}" name = " " type = "hidden" class="form-control" />
                </tr>`;
        $("#div_Data").append(html);
        //html = '<div id= "No_Row' + cnt + '" class="container-fluid style_border" > <div class="col-xs-12 " > <div class="col-xs-12> ' +
        //    '<div class="col-xs-1">' +
        //    '<span id="btn_minus' + cnt + '" class="fa fa-minus-circle fontitm3SlsTrShowPrice"></span></div>' +
        //    '<div class="col-xs-1  col-md-1 col-sm-1 col-xs-12" style="width: 4%;">' +
        //    '<input id="txtSerial' + cnt + '" type="text" class="form-control input-sm   input-sm right2" disabled /></div>' +
        //    '<input id="InvoiceItemID' + cnt + '" type="hidden" class="form-control input-sm   right2 display_none"  />' +
        //    '<div class="col-xs-2">' +
        //    '<select id="ddlFamily' + cnt + '" class="form-control input-sm  "><option value="null">' + (lang == "ar" ? "النوع" : "Type") + '</option></select></div>' +
        //    '<div class="col-xs-2">' +
        //    '<select id="ddlItem' + cnt + '" class="form-control input-sm  "><option value="null">' + (lang == "ar" ? "الصنف" : "Item") + '</option></select></div>' +
        //    '<div class="col-xs-1 left_right"><div class="input-group " ><span class="input-group-btn"><button type="button" style="background-color: #4CAF50; "   class="btnplasandmines btn-default btn-number1' + cnt + '"  id="btnminus1" data-type="minus" data-field="quant[1]"><span class="glyphicon glyphicon-minus"></span></button></span><input type="text"   style="height:30px;" id="txtQuantity' + cnt + '" name="quant[1]" class="form-control input-sm     font1" value="1" min="1" max="1000" step="1"><span class="input-group-btn"><button type="button" style="background-color: #f44336;" id="btnplus1"   class="btnplasandmines btn-default btn-number1' + cnt + '" data-type="plus" data-field="quant[1]"><span class="glyphicon glyphicon-plus"></span></button></span></div></div>' +
        //    '<div class="col-xs-1" style="width: 6%;"><input type="text"  class="form-control input-sm  " id="txtReturnQuantity' + cnt + '" name="quant[3]" class="form-control input-sm    font1" value="0" min="0" max="1000" step="1"></div>' +

        //    '<div class="col-xs-1"><input type="text"  class="form-control input-sm  " id="txtPrice' + cnt + '" name="quant[3]" class="form-control input-sm     font1" value="0" min="0" step="1"></div>' +

        //    '<div class="col-xs-1"><input type="text"  class="form-control input-sm  " id="txtUnitpriceWithVat' + cnt + '" name="quant[3]" class="form-control input-sm     font1" value="0" min="0" step="1"></div>' +

        //    //'<div class=" col-lg-1" style="width: 12.666667%;" ><div class="input-group " ><span class="input-group-btn"><button type="button" style="background-color: #4CAF50; "   class="btnplasandmines btn-default btn-number2' + cnt + '"  id="btnminus2" data-type="minus" data-field="quant[2]"><span class="glyphicon glyphicon-minus"></span></button></span><input type="text"   style="height:36px;" id="txtPrice' + cnt + '" name="quant[2]" class="form-control input-sm     font1" value="1" min="0" max="1000" step="0.5"><span class="input-group-btn"><button type="button" style="background-color: #f44336;" id="btnplus2' + cnt + '"   class="btnplasandmines btn-default btn-number2' + cnt + '" data-type="plus" data-field="quant[2]"><span class="glyphicon glyphicon-plus"></span></button></span></div></div>' +

        //    '<div class="col-xs-1" style="width: 4%;">' +
        //    '<input id="txtTax_Rate' + cnt + '" type="text" class="form-control input-sm   input-sm right2" disabled /></div>' +
        //    '<div class="col-xs-1">' +
        //    '<input id="txtTotal' + cnt + '" type="text" class="form-control input-sm   right2" disabled /></div>' +
        //    '<div class="col-xs-1">' +
        //    '<input id="txtTax' + cnt + '" type="text" class="form-control input-sm   right2" disabled /></div>' +
        //    '<div class="col-xs-1">' +
        //    '<input id="txtTotAfterTax' + cnt + '" type="text" class="form-control input-sm   right2" disabled /></div>' +
        //    '</div></div></div>' +
        //    '<input id="UnitCost' + cnt + '" name = " " type = "hidden" class="form-control input-sm  "/><input id="txt_StatusFlag' + cnt + '" name = " " type = "hidden" class="form-control input-sm  "/><input id="txt_ID' + cnt + '" name = " " type = "hidden" class="form-control input-sm  " />';
    

        $('.btn-number1' + cnt).click(function (e) {
            e.preventDefault();
            var fieldName = $(this).attr('data-field');
            var type = $(this).attr('data-type');
            var input = $("#txtQuantity" + cnt);
            var currentVal = parseFloat(input.val());
            if (!isNaN(currentVal)) {
                if (type == 'minus') {

                    if (currentVal > Number(input.attr('min'))) {
                        input.val((currentVal - 1)).change();
                    }
                    if (parseFloat(input.val()) == Number(input.attr('min'))) {
                        $(this).val(input.attr('min'));
                    }

                }
                else if (type == 'plus') {

                    if (currentVal < Number(input.attr('max'))) {
                        input.val((currentVal + 1)).change();
                    }
                    if (parseFloat(input.val()) == parseFloat(input.attr('max'))) {
                        $(this).val(input.attr('max'));
                    }

                }
            } else {
                input.val(1);
            }
        });
        $('.input-number1' + cnt).focusin(function () {
            $(this).data('oldValue', $(this).val());
        });
        $('.input-number1' + cnt).change(function () {

            var minValue = parseInt($(this).attr('min'));
            var maxValue = parseInt($(this).attr('max'));
            var valueCurrent = parseInt($(this).val());

            var name = $(this).attr('name');
            if (valueCurrent >= minValue) {
                $(".btn-number1" + cnt + "[data-type='minus'][data-field='" + name + "']").removeAttr('disabled')
            } else {
                alert('Sorry, the minimum value was reached');
                $(this).val($(this).data('oldValue'));
            }
            if (valueCurrent <= maxValue) {
                $(".btn-number1" + cnt + "[data-type='plus'][data-field='" + name + "']").removeAttr('disabled')
            } else {
                alert('Sorry, the maximum value was reached');
                $(this).val($(this).data('oldValue'));
            }


        });
        $(".input-number1" + cnt).keydown(function (e) {
            // Allow: backspace, delete, tab, escape, enter and .
            if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 190]) !== -1 ||
                // Allow: Ctrl+A
                (e.keyCode == 65 && e.ctrlKey === true) ||
                // Allow: home, end, left, right
                (e.keyCode >= 35 && e.keyCode <= 39)) {
                // let it happen, don't do anything
                return;
            }
            // Ensure that it is a number and stop the keypress
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        });


        $('.input-number2' + cnt).focusin(function () {
            $(this).data('oldValue', $(this).val());
        });
        $('.input-number2' + cnt).change(function () {

            var minValue = parseInt($(this).attr('min'));
            var maxValue = parseInt($(this).attr('max'));
            var valueCurrent = parseInt($(this).val());

            var name = $(this).attr('name');
            if (valueCurrent >= minValue) {
                $(".btn-number2" + cnt + "[data-type='minus'][data-field='" + name + "']").removeAttr('disabled')
            } else {
                alert('Sorry, the minimum value was reached');
                $(this).val($(this).data('oldValue'));
            }
            if (valueCurrent <= maxValue) {
                $(".btn-number2" + cnt + "[data-type='plus'][data-field='" + name + "']").removeAttr('disabled')
            } else {
                alert('Sorry, the maximum value was reached');
                $(this).val($(this).data('oldValue'));
            }


        });
        $(".input-number2" + cnt).keydown(function (e) {
            // Allow: backspace, delete, tab, escape, enter and .
            if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 190]) !== -1 ||
                // Allow: Ctrl+A
                (e.keyCode == 65 && e.ctrlKey === true) ||
                // Allow: home, end, left, right
                (e.keyCode >= 35 && e.keyCode <= 39)) {
                // let it happen, don't do anything
                return;
            }
            // Ensure that it is a number and stop the keypress
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        });

        $('.btn-number3' + cnt).click(function (e) {
            e.preventDefault();
            var fieldName = $(this).attr('data-field');
            var type = $(this).attr('data-type');
            var input = $("#txtReturnQuantity" + cnt);
            var currentVal = parseFloat(input.val());
            if (!isNaN(currentVal)) {
                if (type == 'minus') {

                    if (currentVal > Number(input.attr('min'))) {
                        input.val((currentVal - 0.5)).change();
                    }
                    if (parseFloat(input.val()) == Number(input.attr('min'))) {
                        $(this).val(input.attr('min'));
                    }

                } else if (type == 'plus') {

                    if (currentVal < Number(input.attr('max'))) {
                        input.val((currentVal + 0.5)).change();
                    }
                    if (parseFloat(input.val()) == parseFloat(input.attr('max'))) {
                        $(this).val(input.attr('max'));
                    }

                }
            } else {
                input.val(1);
            }
        });
        $('.input-number3' + cnt).focusin(function () {
            $(this).data('oldValue', $(this).val());
        });
        $('.input-number3' + cnt).change(function () {

            var minValue = parseInt($(this).attr('min'));
            var maxValue = parseInt($(this).attr('max'));
            var valueCurrent = parseInt($(this).val());

            var name = $(this).attr('name');
            if (valueCurrent >= minValue) {
                $(".btn-number3" + cnt + "[data-type='minus'][data-field='" + name + "']").removeAttr('disabled')
            } else {
                alert('Sorry, the minimum value was reached');
                $(this).val($(this).data('oldValue'));
            }
            if (valueCurrent <= maxValue) {
                $(".btn-number3" + cnt + "[data-type='plus'][data-field='" + name + "']").removeAttr('disabled')
            } else {
                alert('Sorry, the maximum value was reached');
                $(this).val($(this).data('oldValue'));
            }


        });
        $(".input-number3" + cnt).keydown(function (e) {
            // Allow: backspace, delete, tab, escape, enter and .
            if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 190]) !== -1 ||
                // Allow: Ctrl+A
                (e.keyCode == 65 && e.ctrlKey === true) ||
                // Allow: home, end, left, right
                (e.keyCode >= 35 && e.keyCode <= 39)) {
                // let it happen, don't do anything
                return;
            }
            // Ensure that it is a number and stop the keypress
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        });

        //fill dropdownlist
        for (var i = 0; i < FamilyDetails.length; i++) {
            $('#ddlFamily' + cnt).append('<option data-CatID= "' + FamilyDetails[i].CatID + '"  value="' + FamilyDetails[i].ItemFamilyID + '">' + (lang == "ar" ? FamilyDetails[i].DescA : FamilyDetails[i].DescL) + '</option>');
        }
        //debugger
        //FillddlItem
        var drop = '#ddlFamily' + cnt;
        $(drop).change(function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");

            var selectedFamily = $(drop + ' option:selected').attr('value');
            FillddlItem(Number(selectedFamily));
            $('#ddlItem' + cnt).empty();
            $('#ddlItem' + cnt).append('<option value="' + null + '">' + "اختر الصنف" + '</option>');
            for (var i = 0; i < ItemDetails.length; i++) {
                //$('#ddlItem' + cnt).append('<option value="' + ItemDetails[i].ItemID + '">' + ItemDetails[i].Itm_DescA + '</option>');
                $('#ddlItem' + cnt).append('<option data-MinUnitPrice="' + ItemDetails[i].MinUnitPrice + '"data-UomID="' + ItemDetails[i].UomID + '" data-OnhandQty="' + ItemDetails[i].OnhandQty + '" value="' + ItemDetails[i].ItemID + '">' + ItemDetails[i].Itm_DescA + '</option>');
            }

            ComputeTotals();

            let CatID = Number($('option:selected', $('#ddlFamily' + cnt)).attr('data-CatID'));
            let Cat_Tax = CategoryDetails.filter(s => s.CatID == CatID);
            let VatNature = DetailsVatNature.filter(s => s.VatNatID == Cat_Tax[0].VatNatID);
            Tax_Rate = VatNature[0].VatPrc;

            Tax_Type_Model = GetVat(Cat_Tax[0].VatNatID, Tax_Rate, vatType);

            Tax_Rate = Tax_Type_Model.Prc
            VatPrc = Tax_Rate;
            $("#txtTax_Rate" + cnt).attr('data-VatNatID', Tax_Type_Model.Nature);
        });

        var dropddlItem = '#ddlItem' + cnt;
        $(dropddlItem).change(function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");

            if ($('#ddlItem' + cnt).val() == "null") {
                $("#txtQuantity" + cnt).val("1");
                $("#txtPrice" + cnt).val("1");
                $("#txtUnitpriceWithVat" + cnt).val("1");
                $("#txtTotal" + cnt).val("0");
                $("#txtTax" + cnt).val("0");
                $("#txtTotAfterTax" + cnt).val("0");
            } else {

                var selectedItem = $(dropddlItem + ' option:selected').attr('value');
                var selectedFamily = $(drop + ' option:selected').attr('value');
                //
                var itemID = Number(selectedItem);
                var FamilyID = Number(selectedFamily);
                var NumberSelect = ItemDetails.filter(s => s.ItemID == itemID);

                var res = false;
                res = checkRepeatedItems(itemID, FamilyID, cnt);
                if (res == true) {
                    $("#ddlItem" + cnt).val("null");
                    $("#txtPrice" + cnt).val("1");
                    $("#txtUnitpriceWithVat" + cnt).val("1");
                    DisplayMassage('( لايمكن تكرار نفس الاصناف علي الفاتورة )', '(Error)', MessageType.Error);
                } else {
                    //debugger
                    //var NumberSelect = ItemDetails.filter(s => s.ItemID == itemID);
                    if (NumberSelect.length > 0) {

                        if (SysSession.CurrentEnvironment.I_Control[0].IsLocalCost == false) {
                            $("#UnitCost" + cnt).prop("value", NumberSelect[0].GlobalCost);
                        }
                        else {
                            $("#UnitCost" + cnt).prop("value", NumberSelect[0].LocalCost);
                        }




                        let GetUnitprice: IGetunitprice = Get_PriceWithVAT(NumberSelect[0].UnitPrice, VatPrc, flag_PriceWithVAT);

                        var itemPrice = GetUnitprice.unitprice;

                        $("#txtPrice" + cnt).val(itemPrice);
                        $("#txtUnitpriceWithVat" + cnt).val(GetUnitprice.unitpricewithvat);

                        var txtQuantityValue = $("#txtQuantity" + cnt).val();
                        var txtPriceValue = $("#txtPrice" + cnt).val();
                        if ($("#txtPrice" + cnt).val() == 0) {
                            $('#txtTax_Rate' + cnt).val(Tax_Rate);
                            var total = Number(txtQuantityValue.RoundToSt(2)) * 1;
                            $("#txtTotal" + cnt).val(total.RoundToSt(2));
                            VatPrc = $("#txtTax_Rate" + cnt).val();
                            var vatAmount = Number(total) * VatPrc / 100;
                            $("#txtTax" + cnt).val(vatAmount.RoundToSt(2));
                            var totalAfterVat = Number(vatAmount) + Number(total);
                            $("#txtTotAfterTax" + cnt).val(totalAfterVat.RoundToSt(2));
                        } else {
                            $('#txtTax_Rate' + cnt).val(Tax_Rate);
                            var total = Number(txtQuantityValue) * Number(txtPriceValue);
                            $("#txtTotal" + cnt).val(total.RoundToSt(2));
                            VatPrc = $("#txtTax_Rate" + cnt).val();
                            var vatAmount = Number(total.RoundToSt(2)) * VatPrc / 100;
                            $("#txtTax" + cnt).val(vatAmount.RoundToSt(2));
                            var totalAfterVat = Number(vatAmount) + Number(total);
                            $("#txtTotAfterTax" + cnt).val(totalAfterVat.RoundToSt(2));
                        }
                    }

                }
            }
            ComputeTotals();
        });

        $("#txtQuantity" + cnt).on('keyup', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");

            var txtQuantityValue = $("#txtQuantity" + cnt).val();
            var txtPriceValue = $("#txtPrice" + cnt).val();
            var total = 0;

            if (txtQuantityValue == 0) {
                $("#txtQuantity" + cnt).val("1")
            }
            let Onhand_Qty = Number($('option:selected', $("#ddlItem" + cnt)).attr('data-OnhandQty'))
            if (isNaN(Onhand_Qty)) {
                DisplayMassage("برجاء اختيار الصنف ", "Please choose the item", MessageType.Error);
                Errorinput($("#ddlItem" + cnt));
                $("#txtQuantity" + cnt).val("1");
            } else {
                if (txtQuantityValue < Onhand_Qty) { }
                else {
                    DisplayMassage("خطأ الكميه المتاحه (" + Onhand_Qty + ")", "Error quantity available", MessageType.Error);
                    $("#txtQuantity" + cnt).val(Onhand_Qty);
                    Errorinput($("#txtQuantity" + cnt));
                    txtQuantityValue = Onhand_Qty;
                }
            }
            var quntity = Number(Number(txtQuantityValue).RoundToSt(2));
            if ($("#txtPrice" + cnt).val() == 0) { total = quntity * 1; }
            else { total = quntity * Number(txtPriceValue); }
            $('#txtTax_Rate' + cnt).val(Tax_Rate);

            $("#txtTotal" + cnt).val(total.RoundToSt(2));
            VatPrc = $("#txtTax_Rate" + cnt).val();
            var vatAmount = Number(total) * VatPrc / 100;
            $("#txtTax" + cnt).val(vatAmount.RoundToSt(2));
            var totalAfterVat = Number(vatAmount) + Number(total);
            $("#txtTotAfterTax" + cnt).val(totalAfterVat.RoundToSt(2));
            ComputeTotals();



        });


        $("#txtQuantity" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");

            var txtQuantityValue = $("#txtQuantity" + cnt).val();
            var txtPriceValue = $("#txtPrice" + cnt).val();
            var total = 0;

            let Onhand_Qty = Number($('option:selected', $("#ddlItem" + cnt)).attr('data-OnhandQty'))
            if (isNaN(Onhand_Qty)) {
                DisplayMassage("برجاء اختيار الصنف ", "Please choose the item", MessageType.Error);
                Errorinput($("#ddlItem" + cnt));
                $("#txtQuantity" + cnt).val("1");
            } else {
                if (txtQuantityValue < Onhand_Qty) { }
                else {
                    DisplayMassage("خطأ الكميه المتاحه (" + Onhand_Qty + ")", "Error quantity available(" + Onhand_Qty + ")", MessageType.Error);
                    Errorinput($("#txtQuantity" + cnt));
                    $("#txtQuantity" + cnt).val(Onhand_Qty);
                    txtQuantityValue = Onhand_Qty;
                }
            }
            if ($("#txtPrice" + cnt).val() == 0) { total = Number(txtQuantityValue) * 1; }
            else { total = Number(txtQuantityValue) * Number(txtPriceValue); }
            $('#txtTax_Rate' + cnt).val(Tax_Rate);
            $("#txtTotal" + cnt).val(total.RoundToSt(2));
            VatPrc = $("#txtTax_Rate" + cnt).val();
            var vatAmount = Number(total) * VatPrc / 100;
            $("#txtTax" + cnt).val(vatAmount.RoundToSt(2));
            var totalAfterVat = Number(vatAmount) + Number(total);
            $("#txtTotAfterTax" + cnt).val(totalAfterVat.RoundToSt(2));
            ComputeTotals();


        });


        $("#txtPrice" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
            VatPrc = $("#txtTax_Rate" + cnt).val();
            var SalesPrice = Number($("#txtPrice" + cnt).val());
            let GetUnitprice: IGetunitprice = Get_PriceWithVAT(SalesPrice, Number(VatPrc), false);


            $("#txtUnitpriceWithVat" + cnt).val(GetUnitprice.unitpricewithvat)
            //$("#txtPrice" + cnt).val(GetUnitprice.unitprice);



            var txtQuantityValue = $("#txtQuantity" + cnt).val();
            var txtPriceValue = $("#txtPrice" + cnt).val();

            var total = Number(txtQuantityValue) * Number(txtPriceValue);
            var vatAmount = Number(total) * VatPrc / 100;
            $("#txtTax" + cnt).val(vatAmount.RoundToSt(2));
            var total = Number(txtQuantityValue) * Number(txtPriceValue);
            $("#txtTotal" + cnt).val(total.RoundToSt(2));

            var totalAfterVat = Number(vatAmount) + Number(total);
            $("#txtTotAfterTax" + cnt).val(totalAfterVat.RoundToSt(2));

            ComputeTotals();

        });

        $("#txtPrice" + cnt).on('keyup', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
            VatPrc = $("#txtTax_Rate" + cnt).val();
            var SalesPrice = Number($("#txtPrice" + cnt).val());
            let GetUnitprice: IGetunitprice = Get_PriceWithVAT(SalesPrice, Number(VatPrc), false);

            $("#txtUnitpriceWithVat" + cnt).val(GetUnitprice.unitpricewithvat)
            //$("#txtPrice" + cnt).val(GetUnitprice.unitprice);


            var txtQuantityValue = $("#txtQuantity" + cnt).val();
            var txtPriceValue = $("#txtPrice" + cnt).val();

            var total = Number(txtQuantityValue) * Number(txtPriceValue);
            var vatAmount = Number(total) * VatPrc / 100;
            $("#txtTax" + cnt).val(vatAmount.RoundToSt(2));
            var total = Number(txtQuantityValue) * Number(txtPriceValue);
            $("#txtTotal" + cnt).val(total.RoundToSt(2));

            var totalAfterVat = Number(vatAmount) + Number(total);
            $("#txtTotAfterTax" + cnt).val(totalAfterVat.RoundToSt(2));

            ComputeTotals();


        });

        $("#txtUnitpriceWithVat" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
            VatPrc = $("#txtTax_Rate" + cnt).val();
            var SalesPrice = Number($("#txtUnitpriceWithVat" + cnt).val());
            let GetUnitprice: IGetunitprice = Get_PriceWithVAT(SalesPrice, Number(VatPrc), true);


            //$("#txtUnitpriceWithVat" + cnt).val(GetUnitprice.unitpricewithvat)
            $("#txtPrice" + cnt).val(GetUnitprice.unitprice);


            var txtQuantityValue = $("#txtQuantity" + cnt).val();
            var txtPriceValue = $("#txtPrice" + cnt).val();

            var total = Number(txtQuantityValue) * Number(txtPriceValue);
            var vatAmount = Number(total) * VatPrc / 100;
            $("#txtTax" + cnt).val(vatAmount.RoundToSt(2));
            var total = Number(txtQuantityValue) * Number(txtPriceValue);
            $("#txtTotal" + cnt).val(total.RoundToSt(2));

            var totalAfterVat = Number(vatAmount) + Number(total);
            $("#txtTotAfterTax" + cnt).val(totalAfterVat.RoundToSt(2));

            ComputeTotals();

        });

        $("#txtUnitpriceWithVat" + cnt).on('keyup', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
            VatPrc = $("#txtTax_Rate" + cnt).val();
            var SalesPrice = Number($("#txtUnitpriceWithVat" + cnt).val());
            let GetUnitprice: IGetunitprice = Get_PriceWithVAT(SalesPrice, Number(VatPrc), true);


            //$("#txtUnitpriceWithVat" + cnt).val(GetUnitprice.unitpricewithvat)
            $("#txtPrice" + cnt).val(GetUnitprice.unitprice);


            var txtQuantityValue = $("#txtQuantity" + cnt).val();
            var txtPriceValue = $("#txtPrice" + cnt).val();

            var total = Number(txtQuantityValue) * Number(txtPriceValue);
            var vatAmount = Number(total) * VatPrc / 100;
            $("#txtTax" + cnt).val(vatAmount.RoundToSt(2));
            var total = Number(txtQuantityValue) * Number(txtPriceValue);
            $("#txtTotal" + cnt).val(total.RoundToSt(2));

            var totalAfterVat = Number(vatAmount) + Number(total);
            $("#txtTotAfterTax" + cnt).val(totalAfterVat.RoundToSt(2));

            ComputeTotals();

        });

        $("#btn_minus" + cnt).on('click', function () {
            DeleteRow(cnt);
        });

        if (SysSession.CurrentPrivileges.Remove) {
            $("#btn_minus" + cnt).addClass("display_none");
            $("#btn_minus" + cnt).removeAttr("disabled");
        }
        else {
            $("#btn_minus" + cnt).addClass("display_none");
            $("#btn_minus" + cnt).attr("disabled", "disabled");
        }
        //debugger
        if (Show == true) {
            $("#ddlFamily" + cnt).attr("disabled", "disabled");
            $("#ddlItem" + cnt).attr("disabled", "disabled");
            $("#txtQuantity" + cnt).attr("disabled", "disabled");
            $("#txtPrice" + cnt).attr("disabled", "disabled");
            $("#txtUnitpriceWithVat" + cnt).attr("disabled", "disabled");
            $("#txtReturnQuantity" + cnt).attr("disabled", "disabled");
            $("#txtTotal" + cnt).attr("disabled", "disabled");
            $("#txtTax" + cnt).attr("disabled", "disabled");
            $("#txtTotAfterTax" + cnt).attr("disabled", "disabled");
            $("#txtSerial" + cnt).attr("disabled", "disabled");
            $("#txtTax_Rate" + cnt).attr("disabled", "disabled");

            $('.btn-number1' + cnt).attr("disabled", "disabled");
            $('.input-number1' + cnt).attr("disabled", "disabled");

            $('.btn-number2' + cnt).attr("disabled", "disabled");
            $('.input-number2' + cnt).attr("disabled", "disabled");

            $('.btn-number3' + cnt).attr("disabled", "disabled");
            $('.input-number3' + cnt).attr("disabled", "disabled");

            $("#btnAddDetails").addClass("display_none");

            $("#btn_minus" + cnt).addClass("display_none");
            $("#btn_minus" + cnt).attr("disabled", "disabled");

            $("#txt_StatusFlag" + cnt).val("");
            for (var i = 0; i < FamilyDetails.length; i++) {
                $('#ddlFamily' + cnt).append('<option value="' + FamilyDetails[i].ItemFamilyID + '">' + (lang == "ar" ? FamilyDetails[i].DescA : FamilyDetails[i].DescL) + '</option>');
            }

            var FamilyID: number = Number(SlsInvoiceItemsDetails[cnt].ItemFamilyID);
            $("#ddlFamily" + cnt).prop("value", FamilyID);

            FillddlItem(FamilyID);

            for (var i = 0; i < ItemDetails.length; i++) {
                $('#ddlItem' + cnt).append('<option data-MinUnitPrice="' + ItemDetails[i].MinUnitPrice + '"data-UomID="' + ItemDetails[i].UomID + '" data-OnhandQty="' + ItemDetails[i].OnhandQty + '" value="' + ItemDetails[i].ItemID + '">' + (lang == "ar" ? ItemDetails[i].Itm_DescA : ItemDetails[i].Itm_DescE) + '</option>');
            }


            $("#ddlItem" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].ItemID);
            $("#txtSerial" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].Serial);
            $("#txtQuantity" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].SoldQty);
            $("#txtPrice" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].NetUnitPrice);

            $("#UnitCost" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].StockUnitCost);

            if (SlsInvoiceItemsDetails[cnt].UnitpriceWithVat == null || SlsInvoiceItemsDetails[cnt].UnitpriceWithVat == 0) {

                let GetUnitprice: IGetunitprice = Get_PriceWithVAT(SlsInvoiceItemsDetails[cnt].Unitprice, SlsInvoiceItemsDetails[cnt].VatPrc, false)
                $("#txtUnitpriceWithVat" + cnt).prop("value", GetUnitprice.unitpricewithvat);
            }
            else {
                $("#txtUnitpriceWithVat" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].UnitpriceWithVat);
            }

            $("#txtTax_Rate" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].VatPrc);
            $("#txtReturnQuantity" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].InvoiceSoldQty);
            $("#txtTotal" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].ItemTotal);
            $("#txtTax" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].VatAmount.RoundToSt(2));
            $("#txtTotAfterTax" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].NetAfterVat.RoundToSt(2));
            $("#InvoiceItemID" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].InvoiceItemID);
        }
        $("#btn_minus" + cnt).click(function (e) {
            DeleteRow(cnt);
            // alert('delete');
        });
        $(".select_").select2();
        return;
    }
    function Display_Category() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("StkDefCategory", "GetAll"),
            data: {
                CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    CategoryDetails = result.Response as Array<I_D_Category>;

                }
            }
        });

    }
    function FillddlVatNature() {

        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GenVatType", "GetAllVatNature"),
            data: {
                CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    DetailsVatNature = result.Response as Array<G_VatNature>;
                }
            }
        });
    }
    function Insert_Serial() {

        let Ser = 1;
        for (let i = 0; i < CountGrid; i++) {
            var flagvalue = $("#txt_StatusFlag" + i).val();
            if (flagvalue != "d" && flagvalue != "m") {
                $("#txtSerial" + i).val(Ser);
                Ser++;
            }
        }

    }
    function _SearchBox_Change() {
        //  k////////debugger;

        if (searchbutmemreport.value != "") {

            let search: string = searchbutmemreport.value.toLowerCase();
            SearchDetails = SlsInvoiceStatisticsDetails.filter(x => x.TrNo.toString().search(search) >= 0 || x.CustomerName.toLowerCase().search(search) >= 0
                || x.Slsm_DescA.toLowerCase().search(search) >= 0 || x.Slsm_DescE.toLowerCase().search(search) >= 0 /*|| x.PortName.toLowerCase().search(search) >= 0*/
              /*  || x.CustomerCODE.toString().search(search) >= 0  || x.CreditLimit.toString().search(search) >= 0 || x.Emp_NameA.toString().search(search) >= 0
                || x.ContactMobile.toString().search(search) >= 0 /*|| x.DueAmount.toString().search(search) >= 0 *//*|| x.DaysDiff.toString().search(search) >= 0*/);

            Grid.DataSource = SearchDetails;
            Grid.Bind();
        } else {
            Grid.DataSource = SlsInvoiceStatisticsDetails;
            Grid.Bind();
        }
    }
    function checkRepeatedItems(itemValue: number, familyValue: number, cnt: number) {
        var items: number = Number(CountGrid);
        var flag = false;
        for (let i = 0; i < items; i++) {
            if (Number($("#ddlItem" + i).val()) == itemValue && Number($("#ddlFamily" + i).val()) == familyValue && i != cnt) {
                flag = true;
            }
        }
        return flag;
    }
    function ComputeTotals() {
        PackageCount = 0;
        CountTotal = 0;
        TaxCount = 0;
        NetCount = 0;
        for (let i = 0; i < CountGrid; i++) {
            var flagvalue = $("#txt_StatusFlag" + i).val();
            if (flagvalue != "d") {
                PackageCount += Number($("#txtQuantity" + i).val());
                PackageCount = Number(PackageCount.RoundToSt(2).toString());

                CountTotal += Number($("#txtTotal" + i).val());
                CountTotal = Number(CountTotal.RoundToSt(2).toString());

                TaxCount += Number($("#txtTax" + i).val());
                TaxCount = Number(TaxCount.RoundToSt(2).toString());

                NetCount += Number($("#txtTotAfterTax" + i).val());
                NetCount = Number(NetCount.RoundToSt(2).toString());
            }
        }

        txtItemCount.value = CountItems.toString();
        txtPackageCount.value = PackageCount.toString();
        txtTotal.value = CountTotal.toString();
        txtTax.value = TaxCount.toString();
        txtNet.value = NetCount.toString();
        txtCommission.value = commissionCount.toString();
    }
    function FillddlFamily() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("StkDefItemType", "GetAllOrdered"),
            data: {
                CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                //////////debugger;
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    FamilyDetails = result.Response as Array<I_ItemFamily>;
                }
            }
        });
    }
    function GetAllIItem() {

        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("StkDefItems", "GetAllItem"),
            data: {
                CompCode: compcode, FinYear: Finyear, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                //////////////debugger;
                let result = d as BaseResponse;
                if (result.IsSuccess) {

                    ItemFamilyDetails = result.Response as Array<IQ_GetItemStoreInfo>;
                }
            }
        });
    }
    function FillddlItem(ItemFamilyID: number) {
        if (NewAdd == true) {

            if (ddlStore.value == "null") {
                DisplayMassage('(برجاء اختيار المستودع)', '(Please select a Store)', MessageType.Error);
                Errorinput(ddlStore);
                return
            }
            else {
                StoreID = ddlStore.value;
            }
        }
        ItemDetails = ItemFamilyDetails.filter(x => x.ItemFamilyID == ItemFamilyID && x.StoreId == StoreID);
    }
    function FillddlStore() {

        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("StkDefStore", "GetAll"),
            data: {
                CompCode: compcode, BranchCode: BranchCode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    storeDetails = result.Response as Array<G_STORE>;

                    if (SysSession.CurrentEnvironment.UserType == 1 || SysSession.CurrentEnvironment.UserType == 3) {
                        let StoreID = SysSession.CurrentEnvironment.StoreID;
                        storeDetails = storeDetails.filter(s => s.StoreId == StoreID);
                    }

                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                        DocumentActions.FillCombowithdefult(storeDetails, ddlStore, "StoreId", "DescL", "Select Store");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(storeDetails, ddlStore, "StoreId", "DescA", "اختر المستودع");
                    }
                    SysSession.CurrentEnvironment.UserType == 1 || SysSession.CurrentEnvironment.UserType == 3 ? ($('#ddlStore option[value="null"]').remove()) : $('#ddlStore').prop('selectedIndex', 1);
                }
            }
        });
    }
    function GetVatPercentage() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GenVatType", "GetVatPercentage"),
            data: {
                CompCode: compcode, VatType: vatType, Type: 1, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    AD_VatTypeDetails = result.Response as A_D_VAT_TYPE;
                    VatPrc = AD_VatTypeDetails.VatPerc;
                }
            }
        });
    }
    function DeleteRow(RecNo: number) {
        if (!SysSession.CurrentPrivileges.Remove) return;
        WorningMessage("هل تريد الحذف؟", "Do you want to delete?", "تحذير", "worning", () => {
            $("#txt_StatusFlag" + RecNo).val() == 'i' ? $("#txt_StatusFlag" + RecNo).val('m') : $("#txt_StatusFlag" + RecNo).val('d');
            CountItems = CountItems - 1;
            ComputeTotals();
            Insert_Serial();
            txtItemCount.value = CountItems.toString();
            $("#ddlFamily" + RecNo).val("99");
            $("#ddlItem" + RecNo).val("99");
            $("#txtQuantity" + RecNo).val("1");
            $("#txtPrice" + RecNo).val("1");
            $("#txtUnitpriceWithVat" + RecNo).val("1");
            $("#No_Row" + RecNo).attr("hidden", "true");
        });
    }
    function AddNewRow() {

        if (ddlType.value == "0" && ddlInvoiceCustomer.selectedIndex == 0 && SysSession.CurrentEnvironment.InvoiceTransCode == 1) {//علي الحساب  
            DisplayMassage(" برجاء اختيار العميل", "Please select a customer", MessageType.Worning);
            Errorinput(ddlInvoiceCustomer);
            return false
        }


        if (!SysSession.CurrentPrivileges.AddNew) return;
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
            CountItems = CountItems + 1;
            txtItemCount.value = CountItems.toString();
            BuildControls(CountGrid);
            $("#txt_StatusFlag" + CountGrid).val("i"); //In Insert mode 
            $("#ddlFamily" + CountGrid).removeAttr("disabled");
            $("#ddlItem" + CountGrid).removeAttr("disabled");
            $("#txtQuantity" + CountGrid).removeAttr("disabled");
            $("#txtPrice" + CountGrid).removeAttr("disabled");
            $("#txtUnitpriceWithVat" + CountGrid).removeAttr("disabled");
            $("#txtReturnQuantity" + CountGrid).attr("disabled", "disabled");
            $("#btn_minus" + CountGrid).removeClass("display_none");
            $("#btn_minus" + CountGrid).removeAttr("disabled");
            CountGrid++;
            Insert_Serial();
        }
    }
    function Validation_Grid(rowcount: number) {

        if ($("#txt_StatusFlag" + rowcount).val() == "d" || $("#txt_StatusFlag" + rowcount).val() == "m") {
            return true;
        } else {
            if ($("#ddlFamily" + rowcount).val() == "null") {
                DisplayMassage(" برجاء ادخال النوع", "Please enter the type", MessageType.Error);
                Errorinput($("#ddlFamily" + rowcount));
                return false
            }
            else if ($("#ddlItem" + rowcount).val() == "null" || $("#ddlItem" + rowcount).val() == null) {
                DisplayMassage(" برجاء ادخال الصنف", "Please enter the Item", MessageType.Error);
                Errorinput($("#ddlItem" + rowcount));
                return false
            }
            else if ($("#txtQuantity" + rowcount).val() == "") {
                DisplayMassage(" برجاء ادخال الكمية المباعة", "Please enter the Quantity sold", MessageType.Error);
                Errorinput($("#txtQuantity" + rowcount));
                return false
            }
            else if ($("#txtPrice" + rowcount).val() == "") {
                DisplayMassage(" برجاء ادخال السعر", "Please enter the Price", MessageType.Error);
                Errorinput($("#txtPrice" + rowcount));
                Errorinput($("#txtUnitpriceWithVat" + rowcount));
                return false
            }
            return true;
        }
    }
    function clear() {
        $('#div_Data').html("");
        CountGrid = 0;
    }
    function Update() {

        if (!CheckDate(DateFormat(txtInvoiceDate.value).toString(), DateFormat(SysSession.CurrentEnvironment.StartDate).toString(), DateFormat(SysSession.CurrentEnvironment.EndDate).toString())) {
            WorningMessage('  التاريخ ليس متطابق مع تاريخ السنه (' + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ')', '  The date is not identical with the date of the year (' + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ')', "تحذير", "worning");
            return
        }
        MasterDetailsModel.I_Sls_TR_Invoice.TrTime = InvoiceStatisticsModel[0].TrTime;
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("SlsTrSales", "updateSlsTrShowPriceDetail"),
            data: JSON.stringify(MasterDetailsModel),
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess == true) {
                    let res = result.Response as I_Sls_TR_Invoice;
                    DisplayMassage('( تم تعديل الفاتورة بنجاح )', '(The invoice has been successfully modified)', MessageType.Succeed);

                    $('#divCreationPanel').removeClass("display_none");
                    $('#txtUpdatedBy').prop("value", res.UpdatedBy);
                    $('#txtUpdatedAt').prop("value", res.UpdatedAt);
                    success();
                    IsSuccess = true;

                } else {
                    IsSuccess = false;
                    DisplayMassage("الرجاء تحديث الصفحة واعادت تكرارالمحاولة مره اخري ", "Please refresh the page and try again", MessageType.Error);
                }
            }
        });


    }
    function insert() {

        InvoiceModel.InvoiceID = 0;
           
        if (!CheckDate(DateFormat(txtInvoiceDate.value).toString(), DateFormat(SysSession.CurrentEnvironment.StartDate).toString(), DateFormat(SysSession.CurrentEnvironment.EndDate).toString())) {

            WorningMessage('  التاريخ ليس متطابق مع تاريخ السنه (' + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ')', '  The date is not identical with the date of the year (' + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ')', "تحذير", "worning");
            return
        }
                  debugger
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("SlsTrSales", "InsertShwPriceMasterDetail"),
            data: JSON.stringify(MasterDetailsModel),
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess == true) {
                    let res = result.Response as I_Sls_TR_Invoice;
                    invoiceID = res.InvoiceID;
                    DisplayMassage(" تم اصدار  فاتورة رقم  " + res.TrNo + " ", "An invoice number has been issued ", MessageType.Succeed);

                    success_insert();

                    IsSuccess = true;

                } else {
                    IsSuccess = false;

                    DisplayMassage("الرجاء تحديث الصفحة واعادت تكرارالمحاولة مره اخري", "Please refresh the page and try again", MessageType.Error);

                }
            }
        });

    }
    function success_insert() {

        NewAdd = true;
        btnBack_onclick();
        btnShow_onclick();

        $("#cotrolDiv").removeClass("disabledDiv");
        $("#divIconbar").removeClass("disabledIconbar");
        Show = true;
        $("#btnUpdate").removeClass("display_none");
        $("#btnPrintTransaction").removeClass("display_none");
        $("#DivInvoiceDetails").removeClass("display_none");
        clear();
        InvoiceStatisticsModel = new Array<IQ_GetSlsInvoiceStatistic>();
        let Selecteditem = SlsInvoiceStatisticsDetails.filter(x => x.InvoiceID == Number(invoiceID));
        GlobalinvoiceID = Number(Selecteditem[0].InvoiceID);
        InvoiceStatisticsModel = Selecteditem;
        if (InvoiceStatisticsModel.length) {
            txtItemCount.value = InvoiceStatisticsModel[0].Line_Count.toString();
            txtPackageCount.value = InvoiceStatisticsModel[0].Tot_Qty.toString();
            txtTotal.value = InvoiceStatisticsModel[0].TotalAmount.toString();
            txtTax.value = InvoiceStatisticsModel[0].VatAmount.toString();
            txtNet.value = InvoiceStatisticsModel[0].NetAfterVat.toString();
            txtCommission.value = InvoiceStatisticsModel[0].CommitionAmount.toString();
            commissionCount = InvoiceStatisticsModel[0].CommitionAmount;
            ComputeTotals();
            GlobalinvoiceID = InvoiceStatisticsModel[0].InvoiceID;
            lblInvoiceNumber.innerText = InvoiceStatisticsModel[0].TrNo.toString();
            txtInvoiceDate.value = DateFormat(InvoiceStatisticsModel[0].TrDate.toString());
            StoreID = Selecteditem[0].StoreId

            if (InvoiceStatisticsModel[0].CustomerId != null) {
                ddlInvoiceCustomer.value = InvoiceStatisticsModel[0].CustomerId.toString();
                $('#txtInvoiceCustomerName').prop("value", InvoiceStatisticsModel[0].Cus_NameA);
                $('#txtCustomerMobile').prop("value", InvoiceStatisticsModel[0].CustomerMobileNo);

            } else {
                $('#txtInvoiceCustomerName').prop("value", InvoiceStatisticsModel[0].CustomerName);
                $('#txtCustomerMobile').prop("value", InvoiceStatisticsModel[0].CustomerMobileNo);

                ddlInvoiceCustomer.value = 'null';
            }

            var ddlSalesmanValue = InvoiceStatisticsModel[0].SalesmanId.toString();
            $('#ddlSalesman').prop("value", ddlSalesmanValue);
            var ddlStoreValue = InvoiceStatisticsModel[0].StoreId.toString();
            $('#ddlStore').prop("value", ddlStoreValue);

            if (InvoiceStatisticsModel[0].Status == 1) {
                chkActive.checked = true;
                chkPreivilegeToEditApprovedInvoice();
            } else {
                chkActive.checked = false;
                btnUpdate.disabled = !SysSession.CurrentPrivileges.EDIT;
                chkActive.disabled = true;

            }
            if (InvoiceStatisticsModel[0].IsCash == true) {
                $('#ddlType').prop("value", "1");
                if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
                    txtInvoiceCustomerName.value = "عميل نقدي عام";
                    txtCustomerMobile.value = "";
                }
                else {
                    txtInvoiceCustomerName.value = "General cash client";
                    txtCustomerMobile.value = "";
                }
                txtCustomerMobile.value = "";
                //$('#ddlInvoiceCustomer option[value=null]').prop('selected', 'selected').change();
                $('#ddlInvoiceCustomer').val('null');
                $("#ddlInvoiceCustomer").attr("disabled", "disabled");
                $("#txtCustomerMobile").attr("disabled", "disabled");
                $("#txtInvoiceCustomerName").removeAttr("disabled");


                TypeFlag = true;
            } else {
                $('#ddlType').prop("value", "0");
                $('#ddlCashBox').prop('selectedIndex', 0);
                $('#ddlCashBox').attr('disabled', 'disabled');

                $("#txtInvoiceCustomerName").attr("disabled", "disabled");
                $("#ddlInvoiceCustomer").removeAttr("disabled");
                $("#txtCustomerMobile").removeAttr("disabled");

                TypeFlag = false;
            }

            $('#divCreationPanel').removeClass("display_none");

            $('#txtCreatedBy').prop("value", InvoiceStatisticsModel[0].CreatedBy);
            $('#txtCreatedAt').prop("value", InvoiceStatisticsModel[0].CreatedAt);

            $('#txtUpdatedBy').prop("value", InvoiceStatisticsModel[0].UpdatedBy);
            $('#txtUpdatedAt').prop("value", InvoiceStatisticsModel[0].UpdatedAt);
        }
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("SlsTrSales", "GetSlsInvoiceItem"),
            data: { invoiceID: GlobalinvoiceID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {//(int CompCode, string StartDate, string EndDate, int Status, int? CustId, string SalesUser, string UserCode, string Token)
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    SlsInvoiceItemsDetails = result.Response as Array<IQ_GetSlsInvoiceItem>;
                    for (let i = 0; i < SlsInvoiceItemsDetails.length; i++) {
                        BuildControls(i);
                    }
                    CountGrid = SlsInvoiceItemsDetails.length;
                    CountItems = SlsInvoiceItemsDetails.length;
                }
            }
        });
        $("#btnSave").addClass("display_none");
        $("#btnBack").addClass("display_none");

        $("txtInvoiceDate").attr("disabled", "disabled");
        $("ddlInvoiceCustomer").attr("disabled", "disabled");

        txtInvoiceDate.disabled = true;
        ddlInvoiceCustomer.disabled = true;
        ddlSalesman.disabled = true;
        ddlStore.disabled = true;

        txtInvoiceDate.disabled = true;
        ddlInvoiceCustomer.disabled = true;
        txtInvoiceCustomerName.disabled = true;
        txtCustomerMobile.disabled = true;

        ddlType.disabled = true;
        txtCommission.disabled = true;

        if (InvoiceStatisticsModel[0].Status == 1) {
            if (!SysSession.CurrentPrivileges.CUSTOM2) {
                AutherizeFlag = false;
                $("#btnUpdate").addClass("display_none");
            } else {
                AutherizeFlag = true;
                $("#btnUpdate").removeClass("display_none");
            }
        }
        DocumentActions.RenderFromModel(InvoiceStatisticsModel[0]);

    }
    function success() {
        $("#cotrolDiv").removeClass("disabledDiv");
        $("#divIconbar").removeClass("disabledIconbar");
        BindStatisticGridData();
        Grid_RowDoubleClicked();
        //open_success();
    }
    function open_success() {

        Show = true;//    
        $("#btnUpdate").removeClass("display_none");
        $("#btnPrintTransaction").removeClass("display_none");
        $("#DivInvoiceDetails").removeClass("display_none");
        clear();
        InvoiceStatisticsModel = new Array<IQ_GetSlsInvoiceStatistic>();
        let Selecteditem
        Selecteditem = SlsInvoiceStatisticsDetails.filter(x => x.InvoiceID == Number(GlobalinvoiceID));

        InvoiceStatisticsModel = Selecteditem;
        if (InvoiceStatisticsModel.length) {
            txtItemCount.value = InvoiceStatisticsModel[0].Line_Count.toString();
            txtPackageCount.value = InvoiceStatisticsModel[0].Tot_Qty.toString();
            txtTotal.value = InvoiceStatisticsModel[0].TotalAmount.toString();
            txtTax.value = InvoiceStatisticsModel[0].VatAmount.toString();
            txtNet.value = InvoiceStatisticsModel[0].NetAfterVat.toString();
            txtCommission.value = InvoiceStatisticsModel[0].CommitionAmount.toString();
            commissionCount = InvoiceStatisticsModel[0].CommitionAmount;
            ComputeTotals();
            GlobalinvoiceID = InvoiceStatisticsModel[0].InvoiceID;
            lblInvoiceNumber.innerText = InvoiceStatisticsModel[0].TrNo.toString();
            txtInvoiceDate.value = DateFormat(InvoiceStatisticsModel[0].TrDate.toString());
            StoreID = Selecteditem[0].StoreId

            if (InvoiceStatisticsModel[0].CustomerId != null) {
                ddlInvoiceCustomer.value = InvoiceStatisticsModel[0].CustomerId.toString();
                $('#txtInvoiceCustomerName').val(InvoiceStatisticsModel[0].Cus_NameA);
                $('#txtCustomerMobile').prop("value", InvoiceStatisticsModel[0].CustomerMobileNo);
            } else {
                $('#txtInvoiceCustomerName').val(InvoiceStatisticsModel[0].CustomerName);
                $('#txtCustomerMobile').prop("value", InvoiceStatisticsModel[0].CustomerMobileNo);
                ddlInvoiceCustomer.value = 'null';
            }

            var ddlSalesmanValue = InvoiceStatisticsModel[0].SalesmanId.toString();
            $('#ddlSalesman').prop("value", ddlSalesmanValue);

            if (InvoiceStatisticsModel[0].Status == 1) {
                chkActive.checked = true;
                chkPreivilegeToEditApprovedInvoice();
            } else {
                chkActive.checked = false;
                btnUpdate.disabled = !SysSession.CurrentPrivileges.EDIT;
                chkActive.disabled = true;

            }
            if (InvoiceStatisticsModel[0].IsCash == true) {
                $('#ddlType').prop("value", "1");
                if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
                    txtInvoiceCustomerName.value = "عميل نقدي عام";
                    txtCustomerMobile.value = "";
                }
                else {
                    txtInvoiceCustomerName.value = "General cash client";
                    txtCustomerMobile.value = "";
                }
                txtCustomerMobile.value = "";
                //$('#ddlInvoiceCustomer option[value=null]').prop('selected', 'selected').change();
                $('#ddlInvoiceCustomer').val('null');
                $("#ddlInvoiceCustomer").attr("disabled", "disabled");
                $("#txtCustomerMobile").attr("disabled", "disabled");
                $("#txtInvoiceCustomerName").removeAttr("disabled");


                TypeFlag = true;
            } else {
                $('#ddlType').prop("value", "0");
                $('#ddlCashBox').prop('selectedIndex', 0);
                $('#ddlCashBox').attr('disabled', 'disabled');

                $("#txtInvoiceCustomerName").attr("disabled", "disabled");
                $("#ddlInvoiceCustomer").removeAttr("disabled");
                $("#txtCustomerMobile").removeAttr("disabled");

                TypeFlag = false;
            }

            $('#divCreationPanel').removeClass("display_none");

            $('#txtCreatedBy').prop("value", InvoiceStatisticsModel[0].CreatedBy);
            $('#txtCreatedAt').prop("value", InvoiceStatisticsModel[0].CreatedAt);

            $('#txtUpdatedBy').prop("value", InvoiceStatisticsModel[0].UpdatedBy);
            $('#txtUpdatedAt').prop("value", InvoiceStatisticsModel[0].UpdatedAt);
        }
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("SlsTrSales", "GetSlsInvoiceItem"),
            data: { invoiceID: GlobalinvoiceID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {//(int CompCode, string StartDate, string EndDate, int Status, int? CustId, string SalesUser, string UserCode, string Token)
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    SlsInvoiceItemsDetails = result.Response as Array<IQ_GetSlsInvoiceItem>;
                    for (let i = 0; i < SlsInvoiceItemsDetails.length; i++) {
                        BuildControls(i);
                    }
                    CountGrid = SlsInvoiceItemsDetails.length;
                    CountItems = SlsInvoiceItemsDetails.length;
                }
            }
        });
        $("#btnSave").addClass("display_none");
        $("#btnBack").addClass("display_none");

        $("txtInvoiceDate").attr("disabled", "disabled");
        $("ddlInvoiceCustomer").attr("disabled", "disabled");
        $("ddlSalesman").attr("disabled", "disabled");

        txtInvoiceDate.disabled = true;
        ddlInvoiceCustomer.disabled = true;
        ddlSalesman.disabled = true;

        txtInvoiceDate.disabled = true;
        ddlInvoiceCustomer.disabled = true;
        txtInvoiceCustomerName.disabled = true;
        txtCustomerMobile.disabled = true;

        ddlSalesman.disabled = true;
        ddlType.disabled = true;
        txtCommission.disabled = true;

        if (InvoiceStatisticsModel[0].Status == 1) {
            if (!SysSession.CurrentPrivileges.CUSTOM2) {
                AutherizeFlag = false;
                $("#btnUpdate").addClass("display_none");
            } else {
                AutherizeFlag = true;
                $("#btnUpdate").removeClass("display_none");

            }
        }
        DocumentActions.RenderFromModel(InvoiceStatisticsModel[0]);


    }
    function ValidationHeader() {
        if (ddlInvoiceCustomer.value == "null" && ddlType.value == "0" && SysSession.CurrentEnvironment.InvoiceTransCode == 1) {
            DisplayMassage('(برجاء اختيار العميل)', '(Please select a customer)', MessageType.Error);
            Errorinput(ddlInvoiceCustomer);
            return false
        }
        else if (ddlSalesman.value == "null") {
            DisplayMassage(" برجاء اختيار المندوب", "Please select a Salesman", MessageType.Error);

            Errorinput(ddlSalesman);
            return false
        }
        else if (ddlStore.value == "null" && NewAdd == true) {
            DisplayMassage(" برجاء اختيار المستودع", "Please select a Store", MessageType.Error);
            Errorinput(ddlStore);
            return false
        }
        else if (txtInvoiceDate.value == "") {
            DisplayMassage(" برجاء ادخال التاريخ", "Please select a Date", MessageType.Error);
            Errorinput(txtInvoiceDate);
            return false
        }
        else if (CountGrid == 0) {
            DisplayMassage(" برجاء ادخال بيانات الفاتورة", "Please select a Invoice data", MessageType.Error);

            Errorinput(btnAddDetails);
            return false
        }
        else if (txtItemCount.value == '0') {
            DisplayMassage(" برجاء ادخال بيانات الفاتورة", "Please select a Invoice data", MessageType.Error);
            Errorinput(btnAddDetails);
            return false
        }
        else if (!CheckPeriodDate(txtInvoiceDate.value, "I")) {
            debugger
            DisplayMassage("لا يمكنك الاضافه او التعديل في هذة الفتره المغلقه ", "Please select a Invoice data", MessageType.Error);
            Errorinput(txtInvoiceDate);
            return false
        }

        return true;
    }
    function Assign() {
        List_MinUnitPrice = new Array<I_Sls_TR_InvoiceItems>();
        var StatusFlag: String;
        InvoiceModel = new I_Sls_TR_Invoice();
        InvoiceItemsDetailsModel = new Array<I_Sls_TR_InvoiceItems>();

        MasterDetailsModel.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
        MasterDetailsModel.UserCode = SysSession.CurrentEnvironment.UserCode;
        MasterDetailsModel.CompName = SysSession.CurrentEnvironment.CompanyNameAr;
        MasterDetailsModel.VatNo = SysSession.CurrentEnvironment.VatNo;
        //if (ddlInvoiceCustomer.value != "null")
        InvoiceModel.CustomerId = Number(ddlInvoiceCustomer.value);
        InvoiceModel.CompCode = Number(compcode);
        InvoiceModel.BranchCode = Number(BranchCode);
        var InvoiceNumber = Number(lblInvoiceNumber.innerText);
        InvoiceModel.TrNo = InvoiceNumber;

        if (NewAdd != true) {
            InvoiceModel.CreatedAt = InvoiceStatisticsModel[0].CreatedAt;
            InvoiceModel.CreatedBy = InvoiceStatisticsModel[0].CreatedBy;
        }


        InvoiceModel.TrType = TrType//0 invoice 1 return
        InvoiceModel.SlsInvSrc = 1   // 1 from store 2 from van 
        InvoiceModel.SlsInvType = 1 //  retail 
        InvoiceModel.StoreId = StoreID;//main store

        InvoiceModel.RefTrID = null;
        ///////////////
        InvoiceModel.InvoiceID = GlobalinvoiceID;
        InvoiceModel.SalesmanId = Number(ddlSalesman.value);
        InvoiceModel.StoreId = Number(ddlStore.value);
        InvoiceModel.NetAfterVat = NetCount;
        InvoiceModel.TotalAmount = Number(txtTotal.value);
        InvoiceModel.TrDate = txtInvoiceDate.value;
        InvoiceModel.CustomerName = txtInvoiceCustomerName.value;
        InvoiceModel.CustomerMobileNo = txtCustomerMobile.value;
        InvoiceModel.CommitionAmount = Number(txtCommission.value);
        InvoiceModel.VatType = vatType;
        InvoiceModel.VatAmount = Number(txtTax.value);


        InvoiceModel.TaxCurrencyID = Number(SysSession.CurrentEnvironment.I_Control[0].Currencyid);
        InvoiceModel.InvoiceCurrenyID = Number(SysSession.CurrentEnvironment.I_Control[0].Currencyid);
        InvoiceModel.InvoiceTypeCode = Number(SysSession.CurrentEnvironment.InvoiceTypeCode);
        InvoiceModel.InvoiceTransCode = Number(SysSession.CurrentEnvironment.InvoiceTransCode);

        InvoiceModel.DiscountAmount = 0;
        InvoiceModel.DiscountPrc = 0;

        InvoiceModel.DiscountPrc = 0;
        InvoiceModel.DiscountPrc = 0;


        InvoiceModel.ContractNo = '';
        InvoiceModel.PurchaseorderNo = '';
        InvoiceModel.DeliveryDate = '';
        InvoiceModel.DeliveryEndDate = '';
        InvoiceModel.TaxNotes = '';

        InvoiceModel.CashBoxID = null;


        if (ddlType.value == "0") {
            InvoiceModel.IsCash = false;
        } else {
            InvoiceModel.IsCash = true;
        }

        if (chkActive.checked == true) {
            InvoiceModel.Status = 1;
        } else {
            InvoiceModel.Status = 0;
        }
        // Details
        for (var i = 0; i < CountGrid; i++) {
            invoiceItemSingleModel = new I_Sls_TR_InvoiceItems();
            StatusFlag = $("#txt_StatusFlag" + i).val();

            invoiceItemSingleModel.Name_Item = $("#ddlItem" + i + " option:selected").text();
            invoiceItemSingleModel.MinUnitPrice = Number($('option:selected', $("#ddlItem" + i)).attr('data-MinUnitPrice'));

            if (Number($("#txtPrice" + i).val()) < Number($('option:selected', $("#ddlItem" + i)).attr('data-MinUnitPrice'))) {
                List_MinUnitPrice.push(invoiceItemSingleModel);
                Validation_Insert = 1;
            }

            if (StatusFlag == "i") {
                invoiceItemSingleModel.InvoiceItemID = 0;
                invoiceItemSingleModel.ItemID = $("#ddlItem" + i).val();
                invoiceItemSingleModel.Serial = $("#txtSerial" + i).val();
                invoiceItemSingleModel.SoldQty = $('#txtQuantity' + i).val();
                invoiceItemSingleModel.StockSoldQty = $('#txtQuantity' + i).val();//
                invoiceItemSingleModel.NetUnitPrice = $("#txtPrice" + i).val();
                invoiceItemSingleModel.Unitprice = $("#txtPrice" + i).val();
                invoiceItemSingleModel.UnitpriceWithVat = $("#txtUnitpriceWithVat" + i).val();
                //-----------------------------------------------------
                invoiceItemSingleModel.UomID = Number($('option:selected', $("#ddlItem" + i)).attr('data-UomID'));
                invoiceItemSingleModel.NetUnitPriceWithVat = $("#txtUnitpriceWithVat" + i).val();
                invoiceItemSingleModel.BaseQty = 1;
                invoiceItemSingleModel.BaseQtyPrice = $("#txtPrice" + i).val();
                invoiceItemSingleModel.BaseQtyUomid = Number($('option:selected', $("#ddlItem" + i)).attr('data-UomID'));
                invoiceItemSingleModel.ChargeVatNatID = null;
                invoiceItemSingleModel.DiscountVatNatID = null;
                invoiceItemSingleModel.ChargeCode = null; 
                //-----------------------------------------------------
                VatPrc = $("#txtTax_Rate" + i).val();
                let VatNatID = Number($("#txtTax_Rate" + i).attr('data-VatNatID'));
                invoiceItemSingleModel.VatPrc = VatPrc;
                invoiceItemSingleModel.VatNatID = VatNatID;
                invoiceItemSingleModel.VatAmount = $("#txtTax" + i).val();
                invoiceItemSingleModel.ItemTotal = invoiceItemSingleModel.Unitprice * invoiceItemSingleModel.SoldQty;
                invoiceItemSingleModel.TotRetQty = $("#txtReturnQuantity" + i).val();
                invoiceItemSingleModel.StockUnitCost = Number($("#UnitCost" + i).val());
                invoiceItemSingleModel.StatusFlag = StatusFlag.toString();
                InvoiceItemsDetailsModel.push(invoiceItemSingleModel);

            }
            if (StatusFlag == "u") {
                var invoiceItemId = $("#InvoiceItemID" + i).val()
                invoiceItemSingleModel.InvoiceItemID = invoiceItemId;
                invoiceItemSingleModel.Serial = $("#txtSerial" + i).val();
                invoiceItemSingleModel.ItemID = $("#ddlItem" + i).val();
                invoiceItemSingleModel.StatusFlag = StatusFlag.toString();
                invoiceItemSingleModel.ItemID = $("#ddlItem" + i).val();
                invoiceItemSingleModel.SoldQty = $('#txtQuantity' + i).val();
                invoiceItemSingleModel.StockSoldQty = $('#txtQuantity' + i).val();//
                invoiceItemSingleModel.TotRetQty = $('#txtReturnQuantity' + i).val();
                invoiceItemSingleModel.NetUnitPrice = $("#txtPrice" + i).val();
                invoiceItemSingleModel.Unitprice = $("#txtPrice" + i).val();
                invoiceItemSingleModel.UnitpriceWithVat = $("#txtUnitpriceWithVat" + i).val();
                //-----------------------------------------------------
                invoiceItemSingleModel.UomID = Number($('option:selected', $("#ddlItem" + i)).attr('data-UomID'));
                invoiceItemSingleModel.NetUnitPriceWithVat = $("#txtUnitpriceWithVat" + i).val();
                invoiceItemSingleModel.BaseQty = 1;
                invoiceItemSingleModel.BaseQtyPrice = $("#txtPrice" + i).val();
                invoiceItemSingleModel.BaseQtyUomid = Number($('option:selected', $("#ddlItem" + i)).attr('data-UomID'));
                invoiceItemSingleModel.ChargeVatNatID = null;
                invoiceItemSingleModel.DiscountVatNatID = null;
                invoiceItemSingleModel.ChargeCode = null;
                //-----------------------------------------------------
                VatPrc = $("#txtTax_Rate" + i).val();
                let VatNatID = Number($("#txtTax_Rate" + i).attr('data-VatNatID'));
                invoiceItemSingleModel.VatPrc = VatPrc;
                invoiceItemSingleModel.VatNatID = VatNatID;
                invoiceItemSingleModel.ItemTotal = invoiceItemSingleModel.Unitprice * invoiceItemSingleModel.SoldQty;
                invoiceItemSingleModel.VatAmount = invoiceItemSingleModel.ItemTotal * invoiceItemSingleModel.VatPrc / 100;
                invoiceItemSingleModel.NetAfterVat = invoiceItemSingleModel.ItemTotal + invoiceItemSingleModel.VatAmount;
                invoiceItemSingleModel.StockUnitCost = Number($("#UnitCost" + i).val());
                InvoiceItemsDetailsModel.push(invoiceItemSingleModel);

            }
            if (StatusFlag == "d") {
                if ($("#InvoiceItemID" + i).val() != "") {
                    var deletedID = $("#InvoiceItemID" + i).val();
                    invoiceItemSingleModel.StatusFlag = StatusFlag.toString();
                    invoiceItemSingleModel.InvoiceItemID = deletedID;
                    InvoiceItemsDetailsModel.push(invoiceItemSingleModel);
                }
            }
        }
        MasterDetailsModel.I_Sls_TR_Invoice = InvoiceModel;
        MasterDetailsModel.I_Sls_TR_InvoiceItems = InvoiceItemsDetailsModel;
    }
    function updateWithProcess() {

        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("SlsTrSales", "OpenShwPrice"),
            data: JSON.stringify(MasterDetailsModel),
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess == true) {
                    let res = result.Response as I_Sls_TR_Invoice;
                    if (res.Status == 0) {
                        DisplayMassage('( تم تعديل الفاتورة بنجاح )', '(success)', MessageType.Succeed);
                    } else {
                        DisplayMassage('( تم اعتماد الفاتورة بنجاح )', '(success)', MessageType.Succeed);
                    }

                    $('#divCreationPanel').removeClass("display_none");
                    $('#txtUpdatedBy').prop("value", res.UpdatedBy);
                    $('#txtUpdatedAt').prop("value", res.UpdatedAt);

                    AutherizeFlag = false;
                    success();

                    IsSuccess = true;

                } else {
                    IsSuccess = false;
                    DisplayMassage('( هناك خطـأ)', '(Error)', MessageType.Error);
                }
            }
        });


    }
    function chkActive_onchecked() {

        if (btnUpdate.getAttribute('class') != 'btn btn-primary display_none') {
            if (chkActive.checked == false) {
                openInvoice();
            }
        }
    }
    function chkPreivilegeToEditApprovedInvoice() {
        debugger
        if (SysSession.CurrentPrivileges.CUSTOM2 == false) {
            chkActive.disabled = true;
            btnUpdate.disabled = true;
            //btnPrintTransaction.disabled = true;
        } else {
            chkActive.disabled = false;
            btnUpdate.disabled = true;
            //  btnPrintTransaction.disabled = true;
        }
    }
    function openInvoice() {
        //debugger

        Assign();
        //let Selecteditem
        //Selecteditem = SlsInvoiceStatisticsDetails.filter(x => x.InvoiceID == Number(Grid.SelectedKey)); 
        //try {
        //    GlobalinvoiceID = Number(Selecteditem[0].InvoiceID);

        //} catch (e) {
        //      Selecteditem = SlsInvoiceStatisticsDetails.filter(x => x.InvoiceID == Number(invoiceID));
        //    GlobalinvoiceID = Number(Selecteditem[0].InvoiceID);
        //}

        InvoiceModel.InvoiceID = GlobalinvoiceID;

        InvoiceModel.CompCode = Number(compcode);
        InvoiceModel.BranchCode = Number(BranchCode);
        var InvoiceNumber = Number(lblInvoiceNumber.innerText);
        InvoiceModel.TrNo = InvoiceNumber;

        InvoiceModel.CreatedAt = $('#txtCreatedAt').val();
        InvoiceModel.CreatedBy = $('#txtCreatedBy').val();

        InvoiceModel.UpdatedBy = SysSession.CurrentEnvironment.UserCode;
        InvoiceModel.UpdatedAt = DateTimeFormat(Date().toString());

        InvoiceModel.CustomerName = $("#ddlInvoiceCustomer option:selected").text();
        InvoiceModel.TrType = TrType//0 invoice 1 return
        InvoiceModel.SlsInvSrc = 1   // 1 from store 2 from van 
        InvoiceModel.SlsInvType = 1 //  retail 
        InvoiceModel.StoreId = StoreID;//main store

        InvoiceModel.SalesmanId = Number(ddlSalesman.value);
        InvoiceModel.StoreId = Number(ddlStore.value);
        InvoiceModel.RefTrID = null;
        InvoiceModel.Status = 0;

        MasterDetailsModel.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
        MasterDetailsModel.UserCode = SysSession.CurrentEnvironment.UserCode;
        MasterDetailsModel.I_Sls_TR_Invoice.TrTime = InvoiceStatisticsModel[0].TrTime;
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("SlsTrSales", "OpenShwPrice"),
            data: JSON.stringify(MasterDetailsModel),
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess == true) {
                    btnUpdate.disabled = false;

                    $("#cotrolDiv").removeClass("disabledDiv");
                    $("#divIconbar").removeClass("disabledIconbar");
                    BindStatisticGridData();
                    open_success();

                } else {
                    btnUpdate.disabled = true;
                }
            }
        });
    }
    //------------------------------------------------------Poup_Pass------------------------
    function Open_poup_Pass() {

        $('#popu_Passowrd').attr('style', 'display:block;');
        $('#popu_Passowrd').attr('class', 'popu animated zoomInLeft');
        txt_ApprovePass.value = "";
        $("#Popup_Passowrd").modal("show");



        var Ul_List = document.getElementById('Ul_List_MinUnitPrice');

        Ul_List.innerHTML = '';

        for (var i = 0; i < List_MinUnitPrice.length; i++) {

            var li_List_MinUnitPrice = document.createElement('li');
            li_List_MinUnitPrice.setAttribute('id', 'li_List_MinUnitPrice' + i);
            li_List_MinUnitPrice.setAttribute('class', 'st_border_li_List_MinUnitPrice');
            Ul_List.appendChild(li_List_MinUnitPrice);

            var id_List = document.getElementById('li_List_MinUnitPrice' + i);
            id_List.innerHTML = '-( ' + List_MinUnitPrice[i].Name_Item + ' ) السعر (' + List_MinUnitPrice[i].Unitprice + ') الحد (0' + List_MinUnitPrice[i].MinUnitPrice + '0)';


        }


    }
    function btn_Approveprice_onclick() {
        if (txt_ApprovePass.value == SysSession.CurrentEnvironment.I_Control[0].ExceedMinPricePassword) {

            if (NewAdd == true) {

                InvoiceModel.CreatedAt = DateTimeFormat(Date().toString());
                InvoiceModel.CreatedBy = SysSession.CurrentEnvironment.UserCode;

                MasterDetailsModel.I_Sls_TR_Invoice = InvoiceModel;
                insert();

            }
            else {

                if (AutherizeFlag == false) {
                    Update();

                } else {
                    updateWithProcess();
                    AutherizeFlag = false;
                }

            }


            if (IsSuccess == true) {
                $('#popu_Passowrd').attr('style', 'display:none;');
                $('#popu_Passowrd').attr('class', 'popu animated zoomOut');
                txt_ApprovePass.value = "";
                $("#Popup_Passowrd").modal("hide");
                Validation_Insert = 0;
                IsSuccess = false;
            }

        }
        else {
            WorningMessage("لايمكن اعتماد الفاتورة", "The invoice cannot be approved", "تحذير", "worning");
            txt_ApprovePass.value = "";

        }
    }
    function btn_Exit_Approveprice_onclick() {

        $('#popu_Passowrd').attr('style', 'display:none;');
        $('#popu_Passowrd').attr('class', 'popu animated zoomOut');
        txt_ApprovePass.value = "";
        $("#Popup_Passowrd").modal("hide");
        Validation_Insert = 0;
        IsSuccess = false;
    }

    function Check_CreditLimit_Custom(net: number) {

        var custID = Number(ddlInvoiceCustomer.value);
        var custom1 = VendorDetails.filter(s => s.CustomerId == custID);

        var Isbalance = Number((Number(custom1[0].Openbalance) + Number(custom1[0].Debit) - Number(custom1[0].Credit)).RoundToSt(2));

        let res = Number((net + Isbalance).RoundToSt(2));

        if (custom1[0].CreditLimit > 0) {

            if (res <= custom1[0].CreditLimit) { return true }
            else {
                WorningMessage("خطأ لا يمكن ان تجاوز صافي الفاتوره (" + net + ") مع الرصيد (" + Isbalance + ") الحد الائتماني     (" + custom1[0].CreditLimit + ")", "Error The net invoice (" + net + ") cannot exceed the balance (" + Isbalance + ") credit limit (" + custom1[0].CreditLimit + ") ");
                return false
            }

        }
        return true
    }
    export function PrintReport(OutType: number) {
        //////debugger;
        if (!SysSession.CurrentPrivileges.PrintOut) return;
        let rp: ReportParameters = new ReportParameters();

        rp.RepType = OutType;//output report as View
        rp.FromDate = DateFormatRep(txtStartDate.value);
        rp.ToDate = DateFormatRep(txtEndDate.value);
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
        if (ddlSalesmanFilter.selectedIndex > 0) { rp.SalesmanID = Number($("#ddlSalesmanFilter").val()); }
        else { rp.SalesmanID = -1; }

        if ($("#ddlCustomer").val() == "null") { rp.CustomerID = -1; }
        else { rp.CustomerID = Number($("#ddlCustomer").val()); }


        rp.OperationId = -1;
        rp.CashType = Number($("#ddlInvoiceType").val());
        rp.Status = Number($("#ddlStateType").val());
        rp.TrType = TrType;
        rp.src = 1;
        rp.Typ = 5;
        Ajax.Callsync({
            url: Url.Action("IProc_Rpt_SlsInvoiceList", "GeneralReports"),
            data: rp,
            success: (d) => {

                let result = d.result as string;


                window.open(result, "_blank");
            }
        })
    }
    function PrintTransaction() {
        if (!SysSession.CurrentPrivileges.PrintOut) return;

        let rp: ReportParameters = new ReportParameters();
        
        rp.Type = 4;
        rp.Repdesign = 0;
        rp.TRId = GlobalinvoiceID;
        rp.slip = 0;
                                                                    
            rp.Name_function = "rptInvoiceNote";
            localStorage.setItem("Report_Data", JSON.stringify(rp));

            localStorage.setItem("result", '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>');
             window.open(Url.Action("ReportsPopup", "Home"), "_blank");
    }
    //function btnPrintInvoicePrice_onclick() {
    //    //////debugger
    //    if (!SysSession.CurrentPrivileges.PrintOut) return;

    //    let rp: ReportParameters = new ReportParameters();
        
    //    rp.Type = 0;
    //    rp.FromDate = DateFormatRep(txtStartDate.value);
    //    rp.ToDate = DateFormatRep(txtEndDate.value);
         
      
    //    if (ddlSalesmanFilter.selectedIndex > 0)

    //        rp.SalesmanID = Number($("#ddlSalesmanFilter").val());
    //    else
    //        rp.SalesmanID = -1;

    //    if ($("#ddlCustomer").val() == "null")
    //        rp.CustomerID = -1;
    //    else
    //        rp.CustomerID = Number($("#ddlCustomer").val());


    //    rp.CashType = Number($("#ddlInvoiceType").val());
    //    rp.Status = Number($("#ddlStateType").val());
       
    //    rp.TrType = TrType;
         
    //    rp.Typ = 1;
    //    rp.TRId = GlobalinvoiceID;
        
    //        rp.Name_function = "rptInvoiceNote";
    //        localStorage.setItem("Report_Data", JSON.stringify(rp));

    //        localStorage.setItem("result", '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>');
    //         window.open(Url.Action("ReportsPopup", "Home"), "_blank");
    //}
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
        rp.Type = 4;
        rp.Repdesign = 0;
        rp.Typ = 1;
        rp.slip = 1;
        rp.TRId = GlobalinvoiceID;

        Ajax.CallAsync({
            url: Url.Action("rptInvoiceNote", "GeneralReports"),
            data: rp,
            success: (d) => {
                let result = d.result as string;
                window.open(result, "_blank");
            }
        })

    }



}