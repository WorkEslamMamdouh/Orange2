$(document).ready(() => {

    SlsTrServices.InitalizeComponent();
})
namespace SlsTrServices {
    //system varables
    var SysSession: SystemSession = GetSystemSession(Modules.Sales_Services);
    var compcode: Number;
    var BranchCode: number;
    var Currency: number;
    var sys: SystemTools = new SystemTools();
    var vatType: number;
    var Finyear: number;

    //ddl
    var ddlCustomer: HTMLSelectElement;
    var ddlStateType: HTMLSelectElement;
    var ddlInvoiceType: HTMLSelectElement;
    var ddlType: HTMLSelectElement;


    // Arrays
    var AllVendorDetails: Array<A_Rec_D_Customer> = new Array<A_Rec_D_Customer>();
    var VendorDetails: Array<A_Rec_D_Customer> = new Array<A_Rec_D_Customer>();
    var DetailsVatNature: Array<G_VatNature> = new Array<G_VatNature>();
    var G_USERSDetails: Array<G_USERS> = new Array<G_USERS>();
    var StateDetailsAr: Array<string> = new Array<string>();
    var StateDetailsEn: Array<string> = new Array<string>();
    var InvoiceDetailsAr: Array<string> = new Array<string>();
    var InvoiceDetailsEn: Array<string> = new Array<string>();
    var InvoiceTypeDetailsAr: Array<string> = new Array<string>();
    var InvoiceEyptDetailsEn: Array<string> = new Array<string>();
    var AQ_ServSlsInvoiceDetails: Array<AQVAT_GetSlsInvoiceList> = new Array<AQVAT_GetSlsInvoiceList>();
    var SearchDetails: Array<AQVAT_GetSlsInvoiceList> = new Array<AQVAT_GetSlsInvoiceList>();
    var Selecteditem: Array<AQVAT_GetSlsInvoiceList> = new Array<AQVAT_GetSlsInvoiceList>();
    var SlsInvoiceItemsDetails: Array<AQVAT_GetSlsInvoiceItem> = new Array<AQVAT_GetSlsInvoiceItem>();
    var CategorDetails: Array<AVAT_D_SrvCategory> = new Array<AVAT_D_SrvCategory>();
    var AD_VatTypeDetails: A_D_VAT_TYPE = new A_D_VAT_TYPE();
    var CostCentreDetailsIst: Array<G_COST_CENTER> = new Array<G_COST_CENTER>();
    var AccountDetails: A_ACCOUNT = new A_ACCOUNT();
    var CostCenterDetails: G_COST_CENTER = new G_COST_CENTER();
    //Models
    var InvoiceStatisticsModel: Array<AQVAT_GetSlsInvoiceList> = new Array<AQVAT_GetSlsInvoiceList>();
    var InvoiceItemsDetailsModel: Array<AVAT_TR_SlsInvoiceItem> = new Array<AVAT_TR_SlsInvoiceItem>();
    var InvoiceModel: AVAT_TR_SlsInvoice = new AVAT_TR_SlsInvoice();
    var MasterDetailsModel: ServSlsInvoiceMasterDetails = new ServSlsInvoiceMasterDetails();
    var invoiceItemSingleModel: AVAT_TR_SlsInvoiceItem = new AVAT_TR_SlsInvoiceItem();
    var ServicesDetails: Array<AQVAT_GetService> = new Array<AQVAT_GetService>();
    var HeaderWithDetailModel: AQ_ServSlsInvoiceMasterDetails = new AQ_ServSlsInvoiceMasterDetails();
    //TextBoxes
    var txtStartDate: HTMLInputElement;
    var txtEndDate: HTMLInputElement;
    var txtItemCount: HTMLInputElement;
    var txtPackageCount: HTMLInputElement;
    var txtTotal: HTMLInputElement;
    var txtTotalbefore: HTMLInputElement;
    var txtTotalDiscount: HTMLInputElement;
    var txtTax: HTMLInputElement;
    var txtNet: HTMLInputElement;
    //var txtDiscountPrcnt: HTMLInputElement;
    var txtDiscountValue: HTMLInputElement;
    var txtInvoiceDate: HTMLInputElement;
    var searchbutmemreport: HTMLInputElement;
    var txtCashAccount: HTMLInputElement;
    var txtCashAccountName: HTMLInputElement;
    var txtCustomerCode: HTMLInputElement;
    var txtVoucherNo: HTMLInputElement;
    var txtCustomerName: HTMLInputElement;

    //labels
    var lblInvoiceNumber: HTMLInputElement;
    var txtDocNum: HTMLInputElement;

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
    var btnAccSearch: HTMLButtonElement;
    var btnCustomerSrch: HTMLButtonElement;

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
    var VatPrc;
    var GlobalinvoiceID: number = 0;
    //flags : 
    var Show: boolean = true;
    var NewAdd: boolean = true;
    var FlagAfterInsertOrUpdate: boolean = false;
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);
    //var btnPrint: HTMLInputElement;
    var Tax_Rate = 0;
    var Tax_Type_Model: Tax_Type = new Tax_Type();

    var CustomerId = 0;
    var InvoiceTransCode = 0;

    //------------------------------------------------------ Main Region------------------------
    export function InitalizeComponent() {

        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = "فاتورة مبيعات";
        }
        else {
            document.getElementById('Screen_name').innerHTML = "Sales Invoices";
        }
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);
        Finyear = Number(SysSession.CurrentEnvironment.CurrentYear);
        Currency = SysSession.CurrentEnvironment.I_Control[0].Currencyid;

        InitalizeControls();
        InitializeEvents();
        fillddlCustomer();
        FillddlVatNature();

        FillddlFamily();
        txtStartDate.value = DateStartMonth();
        txtEndDate.value = ConvertToDateDash(GetDate()) <= ConvertToDateDash(SysSession.CurrentEnvironment.EndDate) ? GetDate() : SysSession.CurrentEnvironment.EndDate;

        FillddlStateType();
        FillddlInvoiceType();
        FillddlType();
        vatType = SysSession.CurrentEnvironment.I_Control[0].DefSlsVatType;
        GetVatPercentage();
        $('#ddlStateType').prop("value", "2");
        $('#ddlInvoiceType').prop("value", "2");
        txtItemCount.value = CountItems.toString();
        txtPackageCount.value = PackageCount.toString();
        txtTotal.value = CountTotal.toString();
        txtTotalDiscount.value = CountTotal.toString();
        txtTotalbefore.value = CountTotal.toString();
        txtTax.value = TaxCount.toString();
        txtNet.value = NetCount.toString();
        GetAllServices();
        GetAllCostCenters();

    }
    function InitalizeControls() {
      //  btnPrint = document.getElementById("btnPrint") as HTMLInputElement;

        // Drop down lists
        ddlCustomer = document.getElementById("ddlCustomer") as HTMLSelectElement;
        ddlStateType = document.getElementById("ddlStateType") as HTMLSelectElement;
        ddlInvoiceType = document.getElementById("ddlInvoiceType") as HTMLSelectElement;
        ddlType = document.getElementById("ddlType") as HTMLSelectElement;

        //TextBoxes
        searchbutmemreport = document.getElementById("searchbutmemreport") as HTMLInputElement;
        txtStartDate = document.getElementById("txtStartDate") as HTMLInputElement;
        txtEndDate = document.getElementById("txtEndDate") as HTMLInputElement;
        txtItemCount = document.getElementById("txtItemCount") as HTMLInputElement;
        txtPackageCount = document.getElementById("txtPackageCount") as HTMLInputElement;
        txtTotal = document.getElementById("txtTotal") as HTMLInputElement;
        txtTotalbefore = document.getElementById("txtTotalbefore") as HTMLInputElement;
        txtTotalDiscount = document.getElementById("txtTotalDiscount") as HTMLInputElement;
        txtTax = document.getElementById("txtTax") as HTMLInputElement;
        txtNet = document.getElementById("txtNet") as HTMLInputElement;
        //txtDiscountPrcnt = document.getElementById("txtDiscountPrcnt") as HTMLInputElement;
        txtDiscountValue = document.getElementById("txtDiscountValue") as HTMLInputElement;
        txtInvoiceDate = document.getElementById("txtInvoiceDate") as HTMLInputElement;
        txtCashAccount = document.getElementById("txtCashAccount") as HTMLInputElement;
        txtCashAccountName = document.getElementById("txtCashAccountName") as HTMLInputElement;
        txtCustomerCode = document.getElementById("txtCustomerCode") as HTMLInputElement;
        txtVoucherNo = document.getElementById("txtVoucherNo") as HTMLInputElement;
        txtCustomerName = document.getElementById("txtCustomerName") as HTMLInputElement;

        //labels
        lblInvoiceNumber = document.getElementById("lblInvoiceNumber") as HTMLInputElement;
        txtDocNum = document.getElementById("txtDocNum") as HTMLInputElement;

        //checkbox
        chkActive = document.getElementById("chkActive") as HTMLInputElement;
        //button
        btnAdd = document.getElementById("btnAdd") as HTMLButtonElement;
        btnShow = document.getElementById("btnShow") as HTMLButtonElement;
        btnUpdate = document.getElementById("btnUpdate") as HTMLButtonElement;
        btnAddDetails = document.getElementById("btnAddDetails") as HTMLButtonElement;// btnBack btnSave
        btnBack = document.getElementById("btnBack") as HTMLButtonElement;
        btnSave = document.getElementById("btnSave") as HTMLButtonElement;
        btnAccSearch = document.getElementById("btnAccSearch") as HTMLButtonElement;
        btnCustomerSrch = document.getElementById("btnCustomerSrch") as HTMLButtonElement;

        //print 
        btnPrintTrview = document.getElementById("btnPrintTrview") as HTMLButtonElement;
        btnPrintTrPDF = document.getElementById("btnPrintTrPDF") as HTMLButtonElement;
        btnPrintTrEXEL = document.getElementById("btnPrintTrEXEL") as HTMLButtonElement;
        btnPrintTransaction = document.getElementById("btnPrintTransaction") as HTMLButtonElement;
        btnPrintslip = document.getElementById("btnPrintslip") as HTMLButtonElement;
        ////
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
        searchbutmemreport.onkeyup = _SearchBox_Change;
        ddlType.onchange = ddlType_onchange;
        btnAccSearch.onclick = btnAccSearch_onclick;
        btnCustomerSrch.onclick = btnCustomerSrch_onclick;
        txtCashAccount.onchange = txtCashAccount_onchange;
        //txtDiscountPrcnt.onkeyup = txtDiscountPrcnt_onchange;
        txtDiscountValue.onkeyup = txtDiscountValue_onchange;
        txtCustomerCode.onchange = txtCustomerCode_onchange;
        //print
        btnPrintTrview.onclick = () => { PrintReport(1); }
        btnPrintTrPDF.onclick = () => { PrintReport(2); }
        btnPrintTrEXEL.onclick = () => { PrintReport(3); }
     //   btnPrint.onclick = () => { PrintReport(4); }
        btnPrintTransaction.onclick = PrintTransaction;
        btnPrintslip.onclick = btnPrintslip_onclick;
        //btnPrintInvoicePrice.onclick = btnPrintInvoicePrice_onclick;


    }
    //------------------------------------------------------ Events Region------------------------


    function ddlInvoiceCustomer_onchange() {
        if (txtCustomerCode.value == "") {
        } else {
            var custcode = txtCustomerCode.value;
            var customer = VendorDetails.filter(s => s.CustomerCODE == custcode);
            if (customer.length > 0)
                vatType = customer[0].VATType;
        }
    }
    function checkValidation() {
        if (!SysSession.CurrentPrivileges.CUSTOM1) {
            chkActive.disabled = true;
        } else {
            chkActive.disabled = false;
        }
    }
    function chkActive_onchecked() {
        if (chkActive.checked == false && ddlType.disabled == true) {
            openInvoice();
        }
    }
    function chkPreivilegeToEditApprovedInvoice() {
        debugger
        if (SysSession.CurrentPrivileges.CUSTOM2 == false) {
            chkActive.disabled = true;
            btnUpdate.disabled = true;
        } else {
            chkActive.disabled = false;
            btnUpdate.disabled = true;
        }
    }
    function Check_CreditLimit_Custom(net: number) {

        var custCode = txtCustomerCode.value;

        var custom1 = VendorDetails.filter(s => s.CustomerCODE == custCode);

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
    function ddlType_onchange() {
        if (ddlType.value == "0") {// علي الحساب
            btnAccSearch.disabled = true;
            txtCashAccount.disabled = true;
            txtCashAccount.value = "";
            txtCashAccountName.value = "";
            txtCustomerCode.value = "";
            txtCustomerName.value = "";
        } else {
            btnAccSearch.disabled = false;
            txtCashAccount.disabled = false;
            txtCashAccount.value = "";
            txtCashAccountName.value = "";
            txtCustomerCode.value = "";
            txtCustomerName.value = "";
        }
    }
    function btnAccSearch_onclick() {
        let sys: SystemTools = new SystemTools();
        if (ddlType.value == "0") {

        }
        sys.FindKey(Modules.Sales_Services, "btnAccSearch", "COMP_CODE=" + compcode + "and DETAIL='True' and ACC_TYPE in ( 1 , 2, 3) ", () => {
            let id = SearchGrid.SearchDataGrid.SelectedKey;
            GetAccByCode(id);

        });
    }
    function btnCustomerSrch_onclick() {
        debugger
        let Credit = '';
        if (ddlType.value == "0") {
            Credit = "and IsCreditCustomer = 1"
        }
        else {
            Credit = ""

        }
        let sys: SystemTools = new SystemTools();
        //sys.FindKey(Modules.Sales_Services, "btnCustomerSrch", "CompCode=" + compcode + "and BranchCode=" + BranchCode + " and ISPersonal ='" + CustType.IsPersonal + "' and SalesInvoiceNature = " + CustType.SalesInvoiceNature + "", () => {
        var cond: string;

        cond = "CompCode=" + compcode + "" + Credit;
        if (SysSession.CurrentEnvironment.I_Control.IsLocalBranchCustomer == true) { cond = cond + "and BranchCode=" + BranchCode; }


        sys.FindKey(Modules.Sales_Services, "btnCustomerSrch", cond, () => {
            let id = SearchGrid.SearchDataGrid.SelectedKey;
            CustomerId = id;
            var custObjct = AllVendorDetails.filter(s => s.CustomerId == id);
            txtCustomerCode.value = custObjct[0].CustomerCODE;
            txtCustomerName.value = lang == "ar" ? custObjct[0].NAMEA : custObjct[0].NAMEE;
            ddlInvoiceCustomer_onchange();
        });
    }
    function txtCustomerCode_onchange() {
        if (txtCustomerCode.value != "") {
            var custObjct = AllVendorDetails.filter(s => s.CustomerCODE == txtCustomerCode.value);
            if (custObjct.length > 0) {
                txtCustomerName.value = lang == "ar" ? custObjct[0].NAMEA : custObjct[0].NAMEE;
            } else {
                txtCustomerCode.value = "";
                txtCustomerName.value = "";
                DisplayMassage("كود العميل غير صحيح", "Wrong Customer code", MessageType.Error);
            }
        } else {
            txtCustomerCode.value = "";
            txtCustomerName.value = "";
        }
    }
    function txtCashAccount_onchange() {
        var accCode = txtCashAccount.value;
        GetAccByCode(accCode);
    }
    function txtDiscountValue_onchange() {

        if (txtDiscountValue.value.trim() != '' && txtDiscountValue.value != '0') {
            txtNet.value = (Number(NetCount.RoundToSt(2)) - Number(txtDiscountValue.value)).RoundToSt(2);

        }
        else {
            ComputeTotals();
        }
    }
    function txtDiscountPrcnt_onchange() {
        //var DisPrc = Number(txtDiscountPrcnt.value);
        //if (DisPrc <= 100) {
        //    var NetVal = Number(txtTotal.value) + Number(txtTax.value);
        //    var DiscAmount = (DisPrc / 100) * NetVal;
        //    txtDiscountValue.value = DiscAmount.RoundToSt(2);
        //    txtNet.value = (NetVal - DiscAmount).RoundToSt(2);
        //} else {
        //    txtDiscountPrcnt.value = "0";
        //    txtDiscountValue.value = "0";
        //    DisplayMassage("يجب الا تزيد نسبه الخصم عن 100", "discount percentage cannot be larger than 100", MessageType.Error);
        //}
    }
    //------------------------------------------------------ Buttons Region------------------------
    function btnSave_onclick() {
        loading('btnsave');

        setTimeout(function () {

            finishSave('btnsave');

        if (!SysSession.CurrentPrivileges.AddNew) return;

        if (!CheckDate(DateFormat(txtInvoiceDate.value).toString(), DateFormat(SysSession.CurrentEnvironment.StartDate).toString(), DateFormat(SysSession.CurrentEnvironment.EndDate).toString())) {
            WorningMessage('  التاريخ ليس متطابق مع تاريخ السنه (' + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ')', '  The date is not identical with the date of the year (' + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ')', "تحذير", "worning");
            Errorinput(txtInvoiceDate);
            return
        }


        if (!ValidationHeader()) return;

        for (let i = 0; i < CountGrid; i++) {
            if (!Validation_Grid(i))
                return;
        }

        if (txtCustomerCode.value != "" && ddlType.value == "0") {

            let net = Number(txtNet.value);
            if (!Check_CreditLimit_Custom(net))
                return;
        }

        Assign();

        if (NewAdd == true) {
            insert();
        }
        else {
            Update();
        }
        //$("#btnPrintInvoicePrice").removeClass("display_none");
        $("#div_btnPrint").removeClass("display_none");
        $("#btnPrintTransaction").removeClass("display_none");
        $("#btnpreview").addClass("display_none");

        }, 100);
    }
    function btnBack_onclick() {
        //$("#btnPrintInvoicePrice").removeClass("display_none");
        $("#div_btnPrint").removeClass("display_none");
        $("#btnPrintTransaction").removeClass("display_none");



        $('#txt_Remarks').attr("disabled", "disabled");
        $('#txtDeliveryDate').attr("disabled", "disabled");
        $('#txtDeliveryEndDate').attr("disabled", "disabled");
        $('#txtContractNo').attr("disabled", "disabled");
        $('#txtWorkOrderType').attr("disabled", "disabled");
        $('#txtWorkOrderNo').attr("disabled", "disabled");
        $('#txtPurchaseorderNo').attr("disabled", "disabled");
        $('#txtPaymentTerms').attr("disabled", "disabled");


        $("#btnBack").addClass("display_none");
        $("#btnSave").addClass("display_none");
        $("#btnpreview").addClass("display_none");
        $("#btnUpdate").removeClass("display_none");

        $("#cotrolDiv").removeClass("disabledDiv");
        $("#ddlType").attr("disabled", "disabled");
        if (NewAdd == true) { //add

            $("#DivInvoiceDetails").addClass("display_none");
            $("#chkActive").attr("disabled", "disabled");


        }
        else {//Edit

            Grid_RowDoubleClicked();

        }

    }
    function btnAdd_onclick() {
        $("#DivInvoiceDetails").removeClass("display_none");

        lblInvoiceNumber.value = '';
        txtDocNum.value = '';
        txtInvoiceDate.value = GetDate();
        txtCustomerCode.value = '';
        txtVoucherNo.value = '';
        txtCustomerName.value = '';
        txtCashAccount.value = "";
        txtCashAccountName.value = "";
        ddlType.value = '1'
        txtTotal.value = '0'
        txtTotalbefore.value = '0'
        txtTotalDiscount.value = '0'
        txtTax.value = '0'
        txtNet.value = '0'
        //txtDiscountPrcnt.value = "0";
        txtDiscountValue.value = "0";
        txtItemCount.value = '0'
        txtPackageCount.value = '0'
        chkActive.checked = true;
        $('#txtCreatedBy').prop("value", SysSession.CurrentEnvironment.UserCode);
        $('#txtCreatedAt').prop("value", DateTimeFormat(GetDate().toString()));
        $('#txtUpdatedBy').prop("value", "");
        $('#txtUpdatedAt').prop("value", "");

        $('#ddlInvoiceCustomer').val('null');
        $("#ddlInvoiceCustomer").removeAttr("disabled");


        $('#txtDeliveryDate').val(GetDate());
        $('#txtDeliveryEndDate').val(GetDate());

        $('#txtContractNo').val('');
        $('#txtWorkOrderType').val('');
        $('#txtWorkOrderNo').val('');
        $('#txtPurchaseorderNo').val('');
        $('#txt_Remarks').val('');
        $('#txtPaymentTerms').val('');


        $('#txt_Remarks').removeAttr('disabled');
        $('#txtDeliveryDate').removeAttr('disabled');
        $('#txtDeliveryEndDate').removeAttr('disabled');
        $('#txtContractNo').removeAttr('disabled');
        $('#txtWorkOrderType').removeAttr('disabled');
        $('#txtWorkOrderNo').removeAttr('disabled');
        $('#txtPurchaseorderNo').removeAttr('disabled');
        $('#txtPaymentTerms').removeAttr('disabled');


        chkActive.disabled = false;
        btnCustomerSrch.disabled = false;
        txtCustomerCode.disabled = false;
        //txtVoucherNo.disabled = false;
        //txtInvoiceDate.disabled = true;
        SysSession.CurrentEnvironment.I_Control[0].IvoiceDateEditable == true ? $('#txtInvoiceDate').removeAttr("disabled") : $('#txtInvoiceDate').attr("disabled", "disabled");
        txtCashAccountName.disabled = true;
        //txtDiscountPrcnt.disabled = false;
        txtDiscountValue.disabled = false;
        ddlType.disabled = false;

        $("#btnAddDetails").removeClass("display_none");
        $("#btnUpdate").addClass("display_none");
        $("#btnPrintTransaction").addClass("display_none");
        //$("#btnPrintInvoicePrice").addClass("display_none");
        $("#div_btnPrint").addClass("display_none");
        $("#btnBack").removeClass("display_none");
        $("#btnSave").removeClass("display_none");
        $("#btnpreview").removeClass("display_none");


        $("#div_Data").html("");
        CountGrid = 0;
        CountItems = 0;

        $("#cotrolDiv").attr("disabled", "disabled").off('click');
        $("#cotrolDiv").addClass("disabledDiv");

        Show = false;

        NewAdd = true;

        AddNewRow();

        btnAccSearch.disabled = false;
        txtCashAccount.disabled = false;

 

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
        Show = false;
        $("#btnUpdate").addClass("display_none");
        $("#btnPrintTransaction").addClass("display_none");
        //$("#btnPrintInvoicePrice").addClass("display_none");
        $("#div_btnPrint").addClass("display_none");
        $("#btnBack").removeClass("display_none");
        $("#btnSave").removeClass("display_none");

        for (let i = 0; i < CountGrid; i++) {
            $("#btnSearchCostCenter" + i).removeAttr("disabled");
            $("#btnSearchService" + i).removeAttr("disabled");
            $("#txtServiceCode" + i).removeAttr("disabled");
            $("#txtCostCntrNum" + i).removeAttr("disabled");
            $("#txtRemarks" + i).removeAttr("disabled");

            $("#txtQuantity" + i).removeAttr("disabled");
            $("#txtPrice" + i).removeAttr("disabled");
            $("#txtDiscountPrc" + i).removeAttr("disabled");
            $("#txtDiscountAmount" + i).removeAttr("disabled");

            $("#btn_minus" + i).removeClass("display_none");
            $("#btn_minus" + i).removeAttr("disabled");
            //$("#btn_minus" + i).click(function (e) {
            //    DeleteRow(i);
            //});
        }
        btnCustomerSrch.disabled = false;
        txtCustomerCode.disabled = false;
        //txtVoucherNo.disabled = false;
        $("#ddlType").removeAttr("disabled");
        $("#chkActive").removeAttr("disabled");
        $("#btnAddDetails").removeClass("display_none");


        $('#txt_Remarks').removeAttr('disabled');
        $('#txtDeliveryDate').removeAttr('disabled');
        $('#txtDeliveryEndDate').removeAttr('disabled');
        $('#txtContractNo').removeAttr('disabled');
        $('#txtWorkOrderType').removeAttr('disabled');
        $('#txtWorkOrderNo').removeAttr('disabled');
        $('#txtPurchaseorderNo').removeAttr('disabled');
        $('#txtPaymentTerms').removeAttr('disabled');

        checkValidation();

        NewAdd = false;

        //txtDiscountPrcnt.disabled = false;
        txtDiscountValue.disabled = false;
        ddlType.disabled = false;
        if (ddlType.value == '1') {
            btnAccSearch.disabled = false;
            txtCashAccount.disabled = false;
        }


        $('#ddlCashBox').prop('selectedIndex', 0);
        $('#ddlCashBox').attr('disabled', 'disabled');
        SysSession.CurrentEnvironment.I_Control[0].IvoiceDateEditable == true ? $('#txtInvoiceDate').removeAttr("disabled") : $('#txtInvoiceDate').attr("disabled", "disabled");






    }
    //------------------------------------------------------ Drop Down Region------------------------
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

                    AllVendorDetails = result.Response as Array<A_Rec_D_Customer>;
                    //alert(CustType.IsPersonal);
                    //VendorDetails = VendorDetails.filter(x => x.ISPersonal == CustType.IsPersonal && x.SalesInvoiceNature == CustType.SalesInvoiceNature)
                    VendorDetails = AllVendorDetails;
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                        DocumentActions.FillCombowithdefult(VendorDetails, ddlCustomer, "CustomerId", "NAMEE", "Select customer");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(VendorDetails, ddlCustomer, "CustomerId", "NAMEA", "اختر العميل");
                    }
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
    function FillddlFamily() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AVATSrvCategory", "GetServiceCat"),
            data: {
                compcode: compcode, IsPurchase: false, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    CategorDetails = result.Response as Array<AVAT_D_SrvCategory>;
                    GetAllServices();
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
    //------------------------------------------------------ Normal Grid Region------------------------
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
            { title: res.App_date, name: "TrDate", type: "text", width: "20%" },
            { title: res.App_Cutomer, name: (lang == "ar" ? "Cus_NameA" : "Cus_NameE"), type: "text", width: "25%" },
            { title: res.App_total, name: "TotalAmount", type: "text", width: "15%" },
            { title: res.App_Tax, name: "VatAmount", type: "text", width: "12%" },
            { title: res.App_Net, name: "NetAfterVat", type: "text", width: "13%" },
            { title: res.App_DocumentNo, name: "DocNo", type: "text", width: "20%" },
            { title: res.generalserial, name: "GlobalInvoiceCounter", type: "text", width: "20%" },
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
        var IsCash: number = 0;

        if (ddlCustomer.value != "null") {
            customerId = Number(ddlCustomer.value.toString());
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
            url: sys.apiUrl("ServTrSales", "GetAllServSalesInvoice"),
            data: { CompCode: compcode, trtype: 0, BranchCode: BranchCode, IsCash: IsCash, StartDate: startDate, EndDate: endDate, Status: status, CustId: customerId, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    AQ_ServSlsInvoiceDetails = result.Response as Array<AQVAT_GetSlsInvoiceList>;
                    for (let i = 0; i < AQ_ServSlsInvoiceDetails.length; i++) {
                        AQ_ServSlsInvoiceDetails[i].TrDate = DateFormat(AQ_ServSlsInvoiceDetails[i].TrDate.toString());
                        AQ_ServSlsInvoiceDetails[i].statusDesciption = AQ_ServSlsInvoiceDetails[i].Status == 1 ? (lang == "ar" ? "معتمد" : "A certified") : (lang == "ar" ? "غير معتمد" : "Not supported");
                        AQ_ServSlsInvoiceDetails[i].IsCashDesciption = AQ_ServSlsInvoiceDetails[i].IsCash == true ? (lang == "ar" ? "نقدي" : "Cash") : (lang == "ar" ? "علي الحساب" : "On account");
                    }
                    Grid.DataSource = AQ_ServSlsInvoiceDetails;
                    Grid.Bind();
                }
            }
        });
    }
    function Grid_RowDoubleClicked() {
        Show = true;
        $("#divShow").removeClass("display_none");
        $("#btnUpdate").removeClass("display_none");
        $("#btnPrintTransaction").removeClass("display_none");
        $("#DivInvoiceDetails").removeClass("display_none");
        clear();
        InvoiceStatisticsModel = new Array<AQVAT_GetSlsInvoiceList>();

        

        if (FlagAfterInsertOrUpdate == true) {
            Selecteditem = AQ_ServSlsInvoiceDetails.filter(x => x.InvoiceID == Number(GlobalinvoiceID));
        } else {
            if (Grid.SelectedKey == undefined) {
                Selecteditem = AQ_ServSlsInvoiceDetails.filter(x => x.InvoiceID == Number(GlobalinvoiceID));
            } else
                Selecteditem = AQ_ServSlsInvoiceDetails.filter(x => x.InvoiceID == Number(Grid.SelectedKey));
        }
        GlobalinvoiceID = Number(Selecteditem[0].InvoiceID);

        InvoiceStatisticsModel = Selecteditem;
        if (InvoiceStatisticsModel.length > 0) {

            txtTotal.value = InvoiceStatisticsModel[0].TotalAmount.toString();
            txtTax.value = InvoiceStatisticsModel[0].VatAmount.toString();
            txtNet.value = (InvoiceStatisticsModel[0].NetAfterVat - InvoiceStatisticsModel[0].DiscountAmount).RoundToSt(2);

            lblInvoiceNumber.value = InvoiceStatisticsModel[0].TrNo.toString();
            txtDocNum.value = InvoiceStatisticsModel[0].DocNo.toString();
            txtInvoiceDate.value = DateFormat(InvoiceStatisticsModel[0].TrDate.toString());
            txtCustomerName.value = lang == "ar" ? InvoiceStatisticsModel[0].Cus_NameA.toString() : InvoiceStatisticsModel[0].Cus_NameE.toString();

            txtCustomerCode.value = InvoiceStatisticsModel[0].Cus_Code.toString();
            txtDiscountValue.value = InvoiceStatisticsModel[0].RoundingAmount.RoundToSt(2);
            txtVoucherNo.value = InvoiceStatisticsModel[0].VoucherNo.toString();
            //--------------------------------------------------------------------------------------------------------------------------------------------------------------------
            //$('#txtWorkOrderNo').val(InvoiceStatisticsModel[0].WorkOrderNo)
            //$('#txtWorkOrderType').val(InvoiceStatisticsModel[0].WorkOrderType)




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
                txtCashAccount.value = InvoiceStatisticsModel[0].BankAccount.toString();
                GetAccByCode(txtCashAccount.value);
                txtCashAccountName.value = (lang == "ar" ? AccountDetails.ACC_DESCA : AccountDetails.ACC_DESCL);
            } else {
                $('#ddlType').prop("value", "0");
                txtCashAccount.value = "";
                txtCashAccountName.value = "";
            }

            $('#divCreationPanel').removeClass("display_none");

            $('#txtCreatedBy').prop("value", InvoiceStatisticsModel[0].CreatedBy);
            $('#txtCreatedAt').prop("value", InvoiceStatisticsModel[0].CreatedAt);

            $('#txtUpdatedBy').prop("value", InvoiceStatisticsModel[0].UpdatedBy);
            $('#txtUpdatedAt').prop("value", InvoiceStatisticsModel[0].UpdatedAt);
        }

        SlsInvoiceItemsDetails = new Array<AQVAT_GetSlsInvoiceItem>();
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("ServTrSales", "GetServSalesInvByID"),
            data: { InvoiceID: GlobalinvoiceID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    HeaderWithDetailModel = result.Response as AQ_ServSlsInvoiceMasterDetails;

                }
            }
        });
        SlsInvoiceItemsDetails = HeaderWithDetailModel.AQVAT_GetSlsInvoiceItem.filter(s => s.InvoiceID == GlobalinvoiceID);
        for (let i = 0; i < SlsInvoiceItemsDetails.length; i++) {
            BuildControls(i);

        }
        CountGrid = SlsInvoiceItemsDetails.length;
        CountItems = SlsInvoiceItemsDetails.length;

        $("#btnSave").addClass("display_none");
        $("#btnBack").addClass("display_none");

        $("ddlInvoiceCustomer").attr("disabled", "disabled");


        txtCashAccount.disabled = true;
        btnAccSearch.disabled = true;
        txtInvoiceDate.disabled = true;

        ddlType.disabled = true;
        txtCustomerCode.disabled = true;
        txtVoucherNo.disabled = true;
        txtCashAccountName.disabled = true;
        btnCustomerSrch.disabled = true;
        //txtDiscountPrcnt.disabled = true;
        txtDiscountValue.disabled = true;

        $('#txt_Remarks').attr("disabled", "disabled");
        $('#txtDeliveryDate').attr("disabled", "disabled");
        $('#txtDeliveryEndDate').attr("disabled", "disabled");
        $('#txtContractNo').attr("disabled", "disabled");
        $('#txtWorkOrderType').attr("disabled", "disabled");
        $('#txtWorkOrderNo').attr("disabled", "disabled");
        $('#txtPurchaseorderNo').attr("disabled", "disabled");
        $('#txtPaymentTerms').attr("disabled", "disabled");

        if (InvoiceStatisticsModel[0].Status == 1) {
            if (!SysSession.CurrentPrivileges.CUSTOM2) {
                $("#btnUpdate").addClass("display_none");
            } else {
                $("#btnUpdate").removeClass("display_none");

            }
        }
        let DeliveryDate: string = InvoiceStatisticsModel[0].DeliveryDate == null ? GetDate() : DateFormat(InvoiceStatisticsModel[0].DeliveryDate);
        $('#txtDeliveryDate').val(DeliveryDate);
        let DeliveryEndDate: string = InvoiceStatisticsModel[0].DeliveryEndDate == null ? GetDate() : DateFormat(InvoiceStatisticsModel[0].DeliveryEndDate);
        $('#txtDeliveryEndDate').val(DeliveryEndDate);

        $('#txtContractNo').val(InvoiceStatisticsModel[0].ContractNo.toString());
        $('#txtPurchaseorderNo').val(InvoiceStatisticsModel[0].PurchaseorderNo.toString());
        $('#txt_Remarks').val(InvoiceStatisticsModel[0].Remark.toString());
        $('#txtPaymentTerms').val(InvoiceStatisticsModel[0].PaymentTerms.toString());
        CustomerId = InvoiceStatisticsModel[0].CustomerId

        DocumentActions.RenderFromModel(InvoiceStatisticsModel[0]);
        ComputeTotals();
    }
    //------------------------------------------------------ Controls Grid Region------------------------
    function BuildControls(cnt: number) {
        var html;
        html = `<tr id="No_Row${cnt}">
                    '<input id="InvoiceItemID${cnt}" type="hidden" class="form-control display_none"  />'
	                <td>
		                <div class="form-group">
			                <span id="btn_minus${cnt}"><i class="fas fa-minus-circle  btn-minus"></i></span>
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
			               <input id="txtSerial${cnt}" type="text" class="form-control" disabled />
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
			                <button type="button" class="style_ButSearch" id="btnSearchService${cnt}" name="ColSearch"  >
                                <i class="fa fa-search"></i>
                             </button>
		                </div>
	                </td>
                     <td>
		                <div class="form-group">
			                 <input id="txtServiceCode${cnt}" name="" disabled type="text" class="form-control" />
                             <input id="txtServiceName${cnt}" name="FromDate" disabled type="text" class="form-control" />
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
			                <input type="number" id="txtQuantity${cnt}" name="quant[1]" class="form-control" value="1" min="1" max="1000" step="1">
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
			               <input type="text"  class="form-control" id="txtReturnQuantity${cnt}" name="quant[3]" class="form-control" value="0" min="0" max="1000" step="1">
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
			              <input type="number"  id="txtPrice${cnt}" name="quant[2]" class="form-control" value="1" min="0" max="1000" step="0.5">
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
			                <input type="number"  id="txtDiscountPrc${cnt}" name="quant[2]" class="form-control" value="0" min="0" max="1000" step="0.5">
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
			                <input type="number"  id="txtDiscountAmount${cnt}" name="quant[2]" class="form-control" value="0" min="0" max="1000" step="0.5">
		                </div>
	                </td>
	                <td>
		                <div class="form-group">
			                <input type="number" disabled id="txtNetUnitPrice${cnt}" name="quant[2]" class="form-control" value="0" min="0" max="1000" step="0.5">
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
			                <input id="txtTotal${cnt}" type="text" class="form-control" disabled />
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
			                <input id="txtTax_Rate${cnt}" type="text" class="form-control" disabled />
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
			                <input id="txtTax${cnt}" type="text" class="form-control" disabled />
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
			                <input id="txtTotAfterTax${cnt}" type="text" class="form-control" disabled />
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
			                <button type="button" class="style_ButSearch" id="btnSearchCostCenter${cnt}" name="ColSearch" disabled>
                                <i class="fa fa-search"></i>
                             </button>
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
			                <input id="txtCostCntrNum${cnt}" name="" disabledtype="text" class="form-control">
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
			                <input id="txtCostCntrName${cnt}" name="FromDate" disabled type="text" class="form-control">
		                </div>
	                </td>
                  
                    <input id="txt_StatusFlag${cnt}" name = " " type = "hidden" class="form-control"/>
                </tr>`;
        
        $("#div_Data").append(html);

        //Search Region
        //// First Search
        $('#btnSearchService' + cnt).click(function (e) {
            let sys: SystemTools = new SystemTools();

            sys.FindKey(Modules.Sales_Services, "btnServiceSearch", "CompCode=" + compcode + "and IsPurchase = 'False' ", () => {
                let id = SearchGrid.SearchDataGrid.SelectedKey;

                $("#txtQuantity" + cnt).val("1");
                $("#txtPrice" + cnt).val("1");
                $("#txtDiscountPrc" + cnt).val("0");
                $("#txtDiscountAmount" + cnt).val("0");
                $("#txtNetUnitPrice" + cnt).val("0");
                $("#txtTotal" + cnt).val("0");
                $("#txtTax" + cnt).val("0");
                $("#txtTotAfterTax" + cnt).val("0");

                if ($("#txt_StatusFlag" + cnt).val() != "i")
                    $("#txt_StatusFlag" + cnt).val("u");

                var itemID = Number(id);
                var NumberSelect = ServicesDetails.filter(s => s.Itemid == itemID);

                if (NumberSelect.length > 0) {
                    $('#txtServiceCode' + cnt).val(NumberSelect[0].ItemCode);
                    $('#txtServiceName' + cnt).val((lang == "ar" ? NumberSelect[0].Itm_DescA : NumberSelect[0].Itm_DescE));

                    var itemPrice = NumberSelect[0].UnitPrice;
                    $("#txtPrice" + cnt).val(itemPrice);
                    $("#txtNetUnitPrice" + cnt).val(itemPrice);
                    var txtQuantityValue = $("#txtQuantity" + cnt).val();
                    var txtPriceValue = $("#txtPrice" + cnt).val();

                    var catID = NumberSelect[0].SrvCategoryID;
                    var catObj = CategorDetails.filter(s => s.SrvCategoryID == catID);
                    let Cat_Tax = DetailsVatNature.filter(s => s.VatNatID == catObj[0].VatNatID);
                    Tax_Rate = Cat_Tax[0].VatPrc;

                    Tax_Type_Model = GetVat(Cat_Tax[0].VatNatID, Tax_Rate, vatType);

                    Tax_Rate = Tax_Type_Model.Prc;

                    $('#txtTax_Rate' + cnt).val(Tax_Rate);
                    var total = Number(txtQuantityValue) * Number(txtPriceValue);
                    $("#txtTotal" + cnt).val(total.RoundToSt(2));
                    VatPrc = Tax_Rate;
                    var vatAmount = Number(total.RoundToSt(2)) * VatPrc / 100;
                    $("#txtTax" + cnt).val(vatAmount.RoundToSt(2));
                    var totalAfterVat = Number(vatAmount) + Number(total);
                    $("#txtTotAfterTax" + cnt).val(totalAfterVat.RoundToSt(2));
                }
                ComputeTotals();
            });
        });
        $("#txtServiceCode" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
            $("#txtQuantity" + cnt).val("1");
            $("#txtPrice" + cnt).val("1");
            $("#txtTotal" + cnt).val("0");
            $("#txtTax" + cnt).val("0");
            $("#txtTotAfterTax" + cnt).val("0");
            var code = $('#txtServiceCode' + cnt).val();
            var NumberSelect = ServicesDetails.filter(s => s.ItemCode == code);

            if (NumberSelect.length > 0) {
                $('#txtServiceName' + cnt).val((lang == "ar" ? NumberSelect[0].Itm_DescA : NumberSelect[0].Itm_DescE));

                var itemPrice = NumberSelect[0].UnitPrice;
                $("#txtPrice" + cnt).val(itemPrice);
                var txtQuantityValue = $("#txtQuantity" + cnt).val();
                var txtPriceValue = $("#txtPrice" + cnt).val();

                var catID = NumberSelect[0].SrvCategoryID;
                var catObj = CategorDetails.filter(s => s.SrvCategoryID == catID);
                let Cat_Tax = DetailsVatNature.filter(s => s.VatNatID == catObj[0].VatNatID);
                Tax_Rate = Cat_Tax[0].VatPrc;

                Tax_Type_Model = GetVat(Cat_Tax[0].VatNatID, Tax_Rate, vatType);

                Tax_Rate = Tax_Type_Model.Prc;

                $('#txtTax_Rate' + cnt).val(Tax_Rate);
                var total = Number(txtQuantityValue) * Number(txtPriceValue);
                $("#txtTotal" + cnt).val(total.RoundToSt(2));
                VatPrc = Tax_Rate;
                var vatAmount = Number(total.RoundToSt(2)) * VatPrc / 100;
                $("#txtTax" + cnt).val(vatAmount.RoundToSt(2));
                var totalAfterVat = Number(vatAmount) + Number(total);
                $("#txtTotAfterTax" + cnt).val(totalAfterVat.RoundToSt(2));

                ComputeTotals();
            }
            else {
                $('#txtServiceCode' + cnt).val("");
                $('#txtServiceName' + cnt).val("");
                DisplayMassage("كود الخدمه غير صحيح ", "Wrong service code ", MessageType.Error);
            }
        });
        //// Second Search
        $('#btnSearchCostCenter' + cnt).click(function (e) {
            let sys: SystemTools = new SystemTools();

            sys.FindKey(Modules.Sales_Services, "btnCostCenterSearch", "COMP_CODE=" + compcode + "and ACTIVE = 1 ", () => {
                let id = SearchGrid.SearchDataGrid.SelectedKey
                $('#txtCostCntrNum' + cnt).val(id);
                GetCostCenterByCode(id);
                $('#txtCostCntrName' + cnt).val((lang == "ar" ? CostCenterDetails.CC_DESCA : CostCenterDetails.CC_DESCE));
                $('#txtCostCntrNum' + cnt).val(CostCenterDetails.CC_CODE);
                if ($("#txt_StatusFlag" + cnt).val() != "i")
                    $("#txt_StatusFlag" + cnt).val("u");
            });
        });
        $("#txtCostCntrNum" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");

            var id = $('#txtCostCntrNum' + cnt).val();
            if (id == "") {
                $('#txtCostCntrName' + cnt).val("");
            } else {
                GetCostCenterByCode(id);
                if (CostCenterDetails != null) {
                    $('#txtCostCntrName' + cnt).val((lang == "ar" ? CostCenterDetails.CC_DESCA : CostCenterDetails.CC_DESCE));
                }
                else {
                    $('#txtCostCntrNum' + cnt).val("");
                    $('#txtCostCntrName' + cnt).val("");
                    DisplayMassage("مركز التكلفة غير صحيح ", "Wrong Cost Center ", MessageType.Error);
                }
            }
        });
        $("#txtRemarks" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });

        // text change

        $("#txtQuantity" + cnt).on('keyup', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");

            var txtQuantityValue = $("#txtQuantity" + cnt).val();
            var txtPriceValue = $("#txtNetUnitPrice" + cnt).val();
            var total = 0;

            var quntity = Number(Number(txtQuantityValue).RoundToSt(2));
            if ($("#txtPrice" + cnt).val() == 0) { total = quntity * 1; }
            else { total = quntity * Number(txtPriceValue); }
            //  $('#txtTax_Rate' + cnt).val(Tax_Rate);

            $("#txtTotal" + cnt).val(total.RoundToSt(2));
            VatPrc = $("#txtTax_Rate" + cnt).val();
            var vatAmount = Number(total) * VatPrc / 100;
            $("#txtTax" + cnt).val(vatAmount.RoundToSt(2));
            var totalAfterVat = Number(vatAmount.RoundToSt(2)) + Number(total.RoundToSt(2));
            $("#txtTotAfterTax" + cnt).val(totalAfterVat.RoundToSt(2));
            ComputeTotals();

        });

        $("#txtPrice" + cnt).on('keyup', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");

            var txtQuantityValue = $("#txtQuantity" + cnt).val();
            var txtPriceValue = $("#txtNetUnitPrice" + cnt).val();
            //   $('#txtTax_Rate' + cnt).val(Tax_Rate);

            var total = Number(txtQuantityValue) * Number(txtPriceValue);
            VatPrc = $("#txtTax_Rate" + cnt).val();
            var vatAmount = Number(total) * VatPrc / 100;
            $("#txtTax" + cnt).val(vatAmount.RoundToSt(2));
            var total = Number(txtQuantityValue) * Number(txtPriceValue);
            $("#txtTotal" + cnt).val(total.RoundToSt(2));

            var totalAfterVat = Number(vatAmount.RoundToSt(2)) + Number(total.RoundToSt(2));
            $("#txtTotAfterTax" + cnt).val(totalAfterVat.RoundToSt(2));


            let txtPrice = Number($("#txtPrice" + cnt).val());
            let txtDiscountPrc = Number($("#txtDiscountPrc" + cnt).val());

            $("#txtDiscountAmount" + cnt).val(((txtDiscountPrc * txtPrice) / 100).RoundToSt(2));

            $("#txtNetUnitPrice" + cnt).val((txtPrice - ((txtDiscountPrc * txtPrice) / 100)));



            ComputeTotals();

        });

        $("#txtDiscountPrc" + cnt).on('keyup', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");



            let txtPrice = Number($("#txtPrice" + cnt).val());
            let txtDiscountPrc = Number($("#txtDiscountPrc" + cnt).val());

            $("#txtDiscountAmount" + cnt).val(((txtDiscountPrc * txtPrice) / 100).RoundToSt(2));

            $("#txtNetUnitPrice" + cnt).val((txtPrice - ((txtDiscountPrc * txtPrice) / 100)).RoundToSt(2));


            var txtQuantityValue = $("#txtQuantity" + cnt).val();
            var txtPriceValue = $("#txtNetUnitPrice" + cnt).val();
            //   $('#txtTax_Rate' + cnt).val(Tax_Rate);

            var total = Number(txtQuantityValue) * Number(txtPriceValue);
            VatPrc = $("#txtTax_Rate" + cnt).val();
            var vatAmount = Number(total) * VatPrc / 100;
            $("#txtTax" + cnt).val(vatAmount.RoundToSt(2));
            var total = Number(txtQuantityValue) * Number(txtPriceValue);
            $("#txtTotal" + cnt).val(total.RoundToSt(2));

            var totalAfterVat = Number(vatAmount.RoundToSt(2)) + Number(total.RoundToSt(2));
            $("#txtTotAfterTax" + cnt).val(totalAfterVat.RoundToSt(2));


            ComputeTotals();

        });
        $("#txtDiscountAmount" + cnt).on('keyup', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");





            let txtPrice = Number($("#txtPrice" + cnt).val());
            let txtDiscountAmount = Number($("#txtDiscountAmount" + cnt).val());

            $("#txtDiscountPrc" + cnt).val(((txtDiscountAmount / txtPrice) * 100).RoundToSt(2));

            $("#txtNetUnitPrice" + cnt).val((txtPrice - txtDiscountAmount).RoundToSt(2));



            var txtQuantityValue = $("#txtQuantity" + cnt).val();
            var txtPriceValue = $("#txtNetUnitPrice" + cnt).val();
            //   $('#txtTax_Rate' + cnt).val(Tax_Rate);

            var total = Number(txtQuantityValue) * Number(txtPriceValue);
            VatPrc = $("#txtTax_Rate" + cnt).val();
            var vatAmount = Number(total) * VatPrc / 100;
            $("#txtTax" + cnt).val(vatAmount.RoundToSt(2));
            var total = Number(txtQuantityValue) * Number(txtPriceValue);
            $("#txtTotal" + cnt).val(total.RoundToSt(2));

            var totalAfterVat = Number(vatAmount.RoundToSt(2)) + Number(total.RoundToSt(2));
            $("#txtTotAfterTax" + cnt).val(totalAfterVat.RoundToSt(2));



            ComputeTotals();

        });
        $("#txtNetUnitPrice" + cnt).on('keyup', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");

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

        if (Show == true) {
            // disabled

            $("#btnSearchCostCenter" + cnt).attr("disabled", "disabled");
            $("#btnSearchService" + cnt).attr("disabled", "disabled");
            $("#txtServiceCode" + cnt).attr("disabled", "disabled");
            $("#txtCostCntrNum" + cnt).attr("disabled", "disabled");
            $("#txtRemarks" + cnt).attr("disabled", "disabled");

            $("#txtSerial" + cnt).attr("disabled", "disabled");
            $("#txtTax_Rate" + cnt).attr("disabled", "disabled");
            $("#txtQuantity" + cnt).attr("disabled", "disabled");
            $("#txtPrice" + cnt).attr("disabled", "disabled");
            $("#txtDiscountPrc" + cnt).attr("disabled", "disabled");
            $("#txtDiscountAmount" + cnt).attr("disabled", "disabled");
            $("#txtNetUnitPrice" + cnt).attr("disabled", "disabled");
            $("#txtReturnQuantity" + cnt).attr("disabled", "disabled");
            $("#txtTotal" + cnt).attr("disabled", "disabled");
            $("#txtTax" + cnt).attr("disabled", "disabled");
            $("#txtTotAfterTax" + cnt).attr("disabled", "disabled");


            $("#btnAddDetails").addClass("display_none");

            $("#btn_minus" + cnt).addClass("display_none");
            $("#btn_minus" + cnt).attr("disabled", "disabled");

            //bind Data

            $("#txt_StatusFlag" + cnt).val("");

            $("#txtServiceName" + cnt).prop("value", (lang == "ar" ? SlsInvoiceItemsDetails[cnt].it_DescA : SlsInvoiceItemsDetails[cnt].It_DescE));
            $("#txtCostCntrName" + cnt).prop("value", (lang == "ar" ? SlsInvoiceItemsDetails[cnt].CC_DESCA : SlsInvoiceItemsDetails[cnt].CC_DESCE));
            $("#txtServiceCode" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].it_itemCode);
            $("#txtCostCntrNum" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].CC_CODE);
            $("#txtRemarks" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].Remarks);

            $("#txtSerial" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].Serial);
            $("#txtQuantity" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].SoldQty);
            $("#txtPrice" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].Unitprice);
            $("#txtDiscountPrc" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].DiscountPrc);
            $("#txtDiscountAmount" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].DiscountAmount);
            $("#txtNetUnitPrice" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].NetUnitPrice);
            $("#txtTax_Rate" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].VatPrc);
            $("#txtReturnQuantity" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].TotRetQty);
            $("#txtTotal" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].ItemTotal);
            $("#txtTax" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].VatAmount.RoundToSt(2));
            $("#txtTotAfterTax" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].NetAfterVat.RoundToSt(2));
            $("#InvoiceItemID" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].InvoiceItemID);
        }
        $("#btn_minus" + cnt).click(function (e) {
            DeleteRow(cnt);
        });
        return;
    }
    function DeleteRow(RecNo: number) {
        if (!SysSession.CurrentPrivileges.Remove) return;
        WorningMessage("هل تريد الحذف؟", "Do you want to delete?", "تحذير", "worning", () => {
            $("#txt_StatusFlag" + RecNo).val() == 'i' ? $("#txt_StatusFlag" + RecNo).val('m') : $("#txt_StatusFlag" + RecNo).val('d');
            CountItems = CountItems - 1;

            txtItemCount.value = CountItems.toString();
            $("#txtCostCntrNum" + RecNo).val("99");
            $("#txtRemarks" + RecNo).val("99");
            $("#txtServiceCode" + RecNo).val("99");
            $("#txtQuantity" + RecNo).val("99");
            $("#txtPrice" + RecNo).val("199");
            $("#txtDiscountPrc" + RecNo).val("199");
            $("#txtDiscountAmount" + RecNo).val("199");
            $("#txtNetUnitPrice" + RecNo).val("199");
            $("#No_Row" + RecNo).attr("hidden", "true");
            ComputeTotals();
            Insert_Serial();

        });
    }
    function AddNewRow() {
        if (SysSession.CurrentEnvironment.InvoiceTransCode == 1) {

            if (txtCustomerCode.value == null && txtCustomerCode.value == '' && SysSession.CurrentEnvironment.InvoiceTransCode == 1) {//علي الحساب
                DisplayMassage(" برجاء اختيار العميل", "Please select a customer", MessageType.Worning);
                Errorinput(txtCustomerCode);
                return false
            }
        }
        else {
            if (ddlType.value == "0" && txtCustomerCode.value == null && txtCustomerCode.value == '') {//علي الحساب
                DisplayMassage(" برجاء اختيار العميل", "Please select a customer", MessageType.Worning);
                Errorinput(txtCustomerCode);
                return false
            }
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
            $("#txtCostCntrNum" + CountGrid).removeAttr("disabled");
            $("#txtRemarks" + CountGrid).removeAttr("disabled");
            $("#txtServiceCode" + CountGrid).removeAttr("disabled");

            $("#btnServiceSearch" + CountGrid).removeAttr("disabled");
            $("#btnSearchCostCenter" + CountGrid).removeAttr("disabled");

            $("#txtQuantity" + CountGrid).removeAttr("disabled");
            $("#txtPrice" + CountGrid).removeAttr("disabled");
            $("#txtDiscountPrc" + CountGrid).removeAttr("disabled");
            $("#txtDiscountAmount" + CountGrid).removeAttr("disabled");
            $("#txtReturnQuantity" + CountGrid).attr("disabled", "disabled");
            $("#btn_minus" + CountGrid).removeClass("display_none");
            $("#btn_minus" + CountGrid).removeAttr("disabled");
            CountGrid++;
            Insert_Serial();

        }
    }
    function ComputeTotals() {

        PackageCount = 0;
        CountTotal = 0;
        let TotalDiscount = 0;
        let Totalbefore = 0;
        TaxCount = 0;
        NetCount = 0;
        for (let i = 0; i < CountGrid; i++) {
            var flagvalue = $("#txt_StatusFlag" + i).val();
            if (flagvalue != "d" && flagvalue != "m") {
                PackageCount += Number($("#txtQuantity" + i).val());
                PackageCount = Number(PackageCount.RoundToSt(2).toString());

                Totalbefore += (Number($("#txtQuantity" + i).val()) * Number($("#txtPrice" + i).val()));
                Totalbefore = Number(Totalbefore.RoundToSt(2).toString());

                TotalDiscount += (Number($("#txtQuantity" + i).val()) * Number($("#txtDiscountAmount" + i).val()));
                TotalDiscount = Number(TotalDiscount.RoundToSt(2).toString());

                CountTotal += Number($("#txtTotal" + i).val());
                CountTotal = Number(CountTotal.RoundToSt(2).toString());

                TaxCount += Number($("#txtTax" + i).val());
                TaxCount = Number(TaxCount.RoundToSt(2).toString());

                NetCount += Number($("#txtTotAfterTax" + i).val());
                //NetCount = Number(NetCount.RoundToSt(2).toString());
                //NetCount = (Number(NetCount.RoundToSt(2)) - Number(txtDiscountValue.value));

            }
        }
        txtItemCount.value = CountItems.toString();
        txtPackageCount.value = PackageCount.toString();
        txtTotalDiscount.value = TotalDiscount.toString();
        txtTotalbefore.value = Totalbefore.toString();
        txtTotal.value = CountTotal.toString();
        txtTax.value = TaxCount.toString();
        txtNet.value = (Number(NetCount.RoundToSt(2)) - Number(txtDiscountValue.value)).RoundToSt(2);
        //txtDiscountPrcnt_onchange();
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
    //------------------------------------------------------ Search && Clear &&Validation  Region------------------------
    function _SearchBox_Change() {

        $("#divGridDetails").jsGrid("option", "pageIndex", 1);


        if (searchbutmemreport.value != "") {
            let search: string = searchbutmemreport.value.toLowerCase();
            SearchDetails = AQ_ServSlsInvoiceDetails.filter(x => x.TrNo.toString().search(search) >= 0 || x.Cus_NameA.toLowerCase().search(search) >= 0
                || x.Cus_NameE.toLowerCase().search(search) >= 0 || x.DocNo.toLowerCase().search(search) >= 0
                || x.statusDesciption.toLowerCase().search(search) >= 0 || x.IsCashDesciption.toLowerCase().search(search) >= 0);

            Grid.DataSource = SearchDetails;
            Grid.Bind();
        } else {
            Grid.DataSource = AQ_ServSlsInvoiceDetails;
            Grid.Bind();
        }
    }
    function ValidationHeader() {
        if (!CheckDate(DateFormat(txtInvoiceDate.value).toString(), DateFormat(SysSession.CurrentEnvironment.StartDate).toString(), DateFormat(SysSession.CurrentEnvironment.EndDate).toString())) {

            WorningMessage('  التاريخ ليس متطابق مع تاريخ السنه (' + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ')', '  The date is not identical with the date of the year (' + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ')', "تحذير", "worning");
            return
        } else if (txtCustomerCode.value == "" && SysSession.CurrentEnvironment.InvoiceTransCode == 1) {
            DisplayMassage('(برجاء ادخال العميل)', '(Please enters a customer)', MessageType.Error);
            Errorinput(txtCustomerCode);
            return false
        }
        else if (ddlType.value == "1" && txtCashAccount.value.trim() == "") {
            DisplayMassage(" برجاء ادخال حساب النقدية", "Please enter cash account ", MessageType.Error);
            Errorinput(txtCashAccount);
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

        return true;
    }
    function Validation_Grid(rowcount: number) {

        var Qty: number = Number($("#txtQuantity" + rowcount).val());
        var Price: number = Number($("#txtPrice" + rowcount).val());
        if ($("#txt_StatusFlag" + rowcount).val() == "d" || $("#txt_StatusFlag" + rowcount).val() == "m") {
            return true;
        } else {
            if ($("#txtServiceCode" + rowcount).val() == "") {
                DisplayMassage(" برجاء ادخال الخدمة", "Please enter the service", MessageType.Error);
                Errorinput($("#txtServiceCode" + rowcount));
                return false
            }
            else if ($("#txtCostCntrNum" + rowcount).val() == "") {
                DisplayMassage(" برجاء ادخال مركز التكلفة", "Please enter Cost Center", MessageType.Error);
                Errorinput($("#txtCostCntrNum" + rowcount));
                return false
            }
            else if (Qty == 0) {
                DisplayMassage(" برجاء ادخال الكمية المباعة", "Please enter the Quantity sold", MessageType.Error);
                Errorinput($("#txtQuantity" + rowcount));
                return false
            }
            else if (Price == 0) {
                DisplayMassage(" برجاء ادخال السعر", "Please enter the Price", MessageType.Error);
                Errorinput($("#txtPrice" + rowcount));
                return false
            }
            return true;
        }
    }
    function clear() {
        $('#div_Data').html("");
        CountGrid = 0;
    }
    //------------------------------------------------------ Get Functions  Region------------------------
    function GetAllServices() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AVatDService", "GetAllFromView"),
            data: {
                compcode: compcode, ispur: false, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    ServicesDetails = result.Response as Array<AQVAT_GetService>;
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
    function GetAllCostCenters() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GLTrVoucher", "GetAllCostCenters"),
            data: { CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    CostCentreDetailsIst = result.Response as Array<G_COST_CENTER>;
                }
            }
        });
    }
    function GetAccByCode(AccCode: string) {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GLDefAccount", "GetActivAccByCode"),
            data: { CompCode: compcode, AccCode: AccCode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.Response == null) {
                    DisplayMassage("رقم الحساب غير صحيح", "Wrong Account Code ", MessageType.Error);
                    txtCashAccount.value = "";
                    txtCashAccountName.value = "";
                } else if (result.IsSuccess) {
                    AccountDetails = result.Response as A_ACCOUNT;
                    txtCashAccount.value = AccountDetails.ACC_CODE;
                    txtCashAccountName.value = (lang == "ar" ? AccountDetails.ACC_DESCA : AccountDetails.ACC_DESCL);
                }

            }
        });
    }
    function GetCostCenterByCode(CC_Code: string) {
        var obj = CostCentreDetailsIst.filter(s => s.CC_CODE == CC_Code && s.ACTIVE == true);
        CostCenterDetails = obj[0];
    }
    //------------------------------------------------------ main Functions  Region------------------------
    function Assign() {
        var StatusFlag: String;
        MasterDetailsModel = new ServSlsInvoiceMasterDetails();
        InvoiceModel = new AVAT_TR_SlsInvoice();
        InvoiceItemsDetailsModel = new Array<AVAT_TR_SlsInvoiceItem>();
        var CustCode = txtCustomerCode.value;
        //var custObj = VendorDetails.filter(s => s.CustomerCODE == CustCode);
        //InvoiceModel.CustomerId = custObj[0].CustomerId;
        InvoiceModel.CustomerId = CustomerId;
        InvoiceModel.CompCode = Number(compcode);
        InvoiceModel.BranchCode = Number(BranchCode);
        InvoiceModel.InvoiceCurrenyID = Currency;
        InvoiceModel.BankAccount = txtCashAccount.value;
        InvoiceModel.RoundingAmount = Number(txtDiscountValue.value);
        InvoiceModel.VoucherNo = Number(txtVoucherNo.value);
        InvoiceModel.PaymentTerms = $('#txtPaymentTerms').val();
        //InvoiceModel.DiscountAmount = Number(txtDiscountValue.value);
        //InvoiceModel.DiscountPrc = Number(txtDiscountPrcnt.value);

        InvoiceModel.TrNo = Number(lblInvoiceNumber.value);
        InvoiceModel.DocNo = (txtDocNum.value);

        MasterDetailsModel.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
        MasterDetailsModel.UserCode = SysSession.CurrentEnvironment.UserCode;
        MasterDetailsModel.CompName = SysSession.CurrentEnvironment.CompanyNameAr;
        MasterDetailsModel.VatNo = SysSession.CurrentEnvironment.VatNo;

        InvoiceModel.TrType = 0//0 invoice 1 return
        InvoiceModel.SlsInvSrc = 1   // 1 from store 2 from van 
        InvoiceModel.SlsInvType = 1 //  retail 

        InvoiceModel.RefTrID = null;
        ///////////////
        InvoiceModel.InvoiceID = GlobalinvoiceID;
        InvoiceModel.NetAfterVat = Number(txtNet.value) - Number(txtDiscountValue.value);
        InvoiceModel.TotalAmount = Number(txtTotal.value);
        InvoiceModel.ItemTotal = Number(txtTotalbefore.value);
        InvoiceModel.ItemDiscountTotal = Number(txtTotalDiscount.value);
        InvoiceModel.TrDate = txtInvoiceDate.value;
        InvoiceModel.VatType = vatType;
        InvoiceModel.VatAmount = Number(txtTax.value);

        InvoiceModel.TaxCurrencyID = Number(SysSession.CurrentEnvironment.I_Control[0].Currencyid);
        InvoiceModel.InvoiceCurrenyID = Number(SysSession.CurrentEnvironment.I_Control[0].Currencyid);
        InvoiceModel.InvoiceTypeCode = Number(SysSession.CurrentEnvironment.InvoiceTypeCode);
        InvoiceModel.InvoiceTransCode = Number(SysSession.CurrentEnvironment.InvoiceTransCode);


        InvoiceModel.ContractNo = $('#txtContractNo').val();
        //InvoiceModel.WorkOrderType = $('#txtWorkOrderType').val();
        //InvoiceModel.WorkOrderNo = $('#txtWorkOrderNo').val();
        InvoiceModel.PurchaseorderNo = $('#txtPurchaseorderNo').val();
        InvoiceModel.DeliveryDate = $('#txtDeliveryDate').val();
        InvoiceModel.DeliveryEndDate = $('#txtDeliveryEndDate').val();
        InvoiceModel.Remark = $('#txt_Remarks').val();
        InvoiceModel.TaxNotes = '';

        if (SysSession.CurrentEnvironment.InvoiceTransCode == 3) {

            if ((Number(txtCustomerCode.value) == 0 || txtCustomerCode.value == '' || txtCustomerCode.value == "null")) {
                InvoiceModel.InvoiceTransCode = 2;
            }
            else {
                InvoiceModel.InvoiceTransCode = 1;
            }
        }
        else {
            InvoiceModel.InvoiceTransCode = SysSession.CurrentEnvironment.InvoiceTransCode;
        }
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
            invoiceItemSingleModel = new AVAT_TR_SlsInvoiceItem();
            StatusFlag = $("#txt_StatusFlag" + i).val();


            if (StatusFlag == "i") {
                invoiceItemSingleModel.InvoiceItemID = 0;
                var itemcode = $("#txtServiceCode" + i).val();
                var itemobj = ServicesDetails.filter(s => s.ItemCode == itemcode)
                invoiceItemSingleModel.ItemID = itemobj[0].Itemid;
                var catID = itemobj[0].SrvCategoryID;
                var catObj = CategorDetails.filter(s => s.SrvCategoryID == catID);
                invoiceItemSingleModel.VatNatID = catObj[0].VatNatID;
                invoiceItemSingleModel.UomID = itemobj[0].UomID;
                invoiceItemSingleModel.CC_CODE = $("#txtCostCntrNum" + i).val();
                //invoiceItemSingleModel.Remarks = $("#txtRemarks" + i).val();
                invoiceItemSingleModel.Serial = $("#txtSerial" + i).val();
                invoiceItemSingleModel.SoldQty = $('#txtQuantity' + i).val();
                invoiceItemSingleModel.DiscountPrc = $("#txtDiscountPrc" + i).val();
                invoiceItemSingleModel.DiscountAmount = $("#txtDiscountAmount" + i).val();
                invoiceItemSingleModel.NetUnitPrice = $("#txtNetUnitPrice" + i).val();
                invoiceItemSingleModel.Unitprice = $("#txtPrice" + i).val();
                VatPrc = $("#txtTax_Rate" + i).val();
                invoiceItemSingleModel.VatPrc = VatPrc;
                invoiceItemSingleModel.VatApplied = VatPrc;
                invoiceItemSingleModel.VatAmount = $("#txtTax" + i).val();
                invoiceItemSingleModel.ItemNetAmount = $("#txtTotAfterTax" + i).val();
                invoiceItemSingleModel.ItemTotal = invoiceItemSingleModel.Unitprice * invoiceItemSingleModel.SoldQty;
                invoiceItemSingleModel.TotRetQty = $("#txtReturnQuantity" + i).val();
                invoiceItemSingleModel.StatusFlag = StatusFlag.toString();
                InvoiceItemsDetailsModel.push(invoiceItemSingleModel);

            }
            if (StatusFlag == "u") {
                var invoiceItemId = $("#InvoiceItemID" + i).val()
                var itemcode = $("#txtServiceCode" + i).val();
                var itemobj = ServicesDetails.filter(s => s.ItemCode == itemcode)
                invoiceItemSingleModel.ItemID = itemobj[0].Itemid;
                invoiceItemSingleModel.InvoiceItemID = invoiceItemId;
                var catID = itemobj[0].SrvCategoryID;
                var catObj = CategorDetails.filter(s => s.SrvCategoryID == catID);
                invoiceItemSingleModel.VatNatID = catObj[0].VatNatID;
                invoiceItemSingleModel.UomID = itemobj[0].UomID;
                invoiceItemSingleModel.CC_CODE = $("#txtCostCntrNum" + i).val();
                //invoiceItemSingleModel.Remarks = $("#txtRemarks" + i).val();
                invoiceItemSingleModel.Serial = $("#txtSerial" + i).val();
                invoiceItemSingleModel.SoldQty = $('#txtQuantity' + i).val();
                invoiceItemSingleModel.DiscountPrc = $("#txtDiscountPrc" + i).val();
                invoiceItemSingleModel.DiscountAmount = $("#txtDiscountAmount" + i).val();
                invoiceItemSingleModel.NetUnitPrice = $("#txtNetUnitPrice" + i).val();
                invoiceItemSingleModel.Unitprice = $("#txtPrice" + i).val();
                VatPrc = $("#txtTax_Rate" + i).val();
                invoiceItemSingleModel.VatPrc = VatPrc;
                invoiceItemSingleModel.VatApplied = VatPrc;
                invoiceItemSingleModel.VatAmount = $("#txtTax" + i).val();
                invoiceItemSingleModel.ItemNetAmount = $("#txtTotAfterTax" + i).val();
                invoiceItemSingleModel.ItemTotal = invoiceItemSingleModel.Unitprice * invoiceItemSingleModel.SoldQty;
                invoiceItemSingleModel.TotRetQty = $("#txtReturnQuantity" + i).val();
                invoiceItemSingleModel.StatusFlag = StatusFlag.toString();
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
        MasterDetailsModel.AVAT_TR_SlsInvoice = InvoiceModel;
        MasterDetailsModel.AVAT_TR_SlsInvoiceItem = InvoiceItemsDetailsModel;

        MasterDetailsModel.Branch_Code = SysSession.CurrentEnvironment.BranchCode;
        MasterDetailsModel.Comp_Code = SysSession.CurrentEnvironment.CompCode;
        MasterDetailsModel.MODULE_CODE = Modules.Sales_Services;
        MasterDetailsModel.UserCode = SysSession.CurrentEnvironment.UserCode;
        MasterDetailsModel.sec_FinYear = SysSession.CurrentEnvironment.CurrentYear;

    }
    function Update() {
        InvoiceModel.InvoiceID = GlobalinvoiceID;
        InvoiceModel.UpdatedBy = SysSession.CurrentEnvironment.UserCode;
        InvoiceModel.UpdatedAt = DateTimeFormat(Date().toString());
        if (InvoiceStatisticsModel.length > 0) {
            InvoiceModel.CreatedAt = InvoiceStatisticsModel[0].CreatedAt;
            InvoiceModel.CreatedBy = InvoiceStatisticsModel[0].CreatedBy;
            InvoiceModel.DocNo = InvoiceStatisticsModel[0].DocNo;
            InvoiceModel.DocUUID = InvoiceStatisticsModel[0].DocUUID;
            InvoiceModel.TrTime = InvoiceStatisticsModel[0].TrTime;
            InvoiceModel.TrNo = InvoiceStatisticsModel[0].TrNo;
        }

        MasterDetailsModel.AVAT_TR_SlsInvoice.TrTime = InvoiceStatisticsModel[0].TrTime;

        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("ServTrSales", "updateInvoiceMasterDetail"),
            data: JSON.stringify(MasterDetailsModel),
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess == true) {
                    //debugger
                    let res = result.Response as AVAT_TR_SlsInvoice;
                    DisplayMassage('( تم تعديل الفاتورة بنجاح )', '(The invoice has been successfully modified)', MessageType.Succeed);
                    $("#cotrolDiv").removeClass("disabledDiv");
                    $('#divCreationPanel').removeClass("display_none");
                    $('#txtUpdatedBy').prop("value", res.UpdatedBy);
                    $('#txtUpdatedAt').prop("value", res.UpdatedAt);
                    GlobalinvoiceID = res.InvoiceID;
                    FlagAfterInsertOrUpdate = true;
                    InitializeGrid();
                    Grid_RowDoubleClicked();
                    FlagAfterInsertOrUpdate = false;
                    if (res.Status == 1) {
                        DownloadInvoicePdf();
                    }
                    Save_Succ_But();

                } else {
                    DisplayMassage("الرجاء تحديث الصفحة واعادت تكرارالمحاولة مره اخري ", "Please refresh the page and try again", MessageType.Error);
                }
            }
        });


    }
    function insert() {
        InvoiceModel.CreatedAt = DateTimeFormat(Date().toString());
        InvoiceModel.CreatedBy = SysSession.CurrentEnvironment.UserCode;
        InvoiceModel.InvoiceID = 0;
         Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("ServTrSales", "InsertInvoiceMasterDetail"),
            data: JSON.stringify(MasterDetailsModel),
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess == true) {
                    //debugger
                    let res = result.Response as AVAT_TR_SlsInvoice;
                    GlobalinvoiceID = res.InvoiceID;
                    FlagAfterInsertOrUpdate = true;

                    InitializeGrid();
                    Grid_RowDoubleClicked();
                    FlagAfterInsertOrUpdate = false;
                    DisplayMassage(" تم اصدار  فاتورة رقم  " + res.TrNo + " ", "An invoice number has been issued ", MessageType.Succeed);
                    $("#cotrolDiv").removeClass("disabledDiv");
                    NewAdd = false;
                    if (res.Status == 1) {
                        DownloadInvoicePdf(); 
                    }

                    Save_Succ_But();

                } else {
                    DisplayMassage("الرجاء تحديث الصفحة واعادت تكرارالمحاولة مره اخري", "Please refresh the page and try again", MessageType.Error);
                }
            }
        });

    }
    function openInvoice() {
        Assign();
        InvoiceModel.InvoiceID = GlobalinvoiceID;
        InvoiceModel.UpdatedBy = SysSession.CurrentEnvironment.UserCode;
        InvoiceModel.UpdatedAt = DateTimeFormat(Date().toString());
        if (InvoiceStatisticsModel.length > 0) {
            InvoiceModel.CreatedAt = InvoiceStatisticsModel[0].CreatedAt;
            InvoiceModel.CreatedBy = InvoiceStatisticsModel[0].CreatedBy;
            InvoiceModel.DocNo = InvoiceStatisticsModel[0].DocNo;
            InvoiceModel.DocUUID = InvoiceStatisticsModel[0].DocUUID;
            InvoiceModel.TrTime = InvoiceStatisticsModel[0].TrTime;
            InvoiceModel.TrNo = InvoiceStatisticsModel[0].TrNo;
        }
        InvoiceModel.Status = 0;
        MasterDetailsModel.AVAT_TR_SlsInvoice.TrTime = InvoiceStatisticsModel[0].TrTime;
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("ServTrSales", "OpenSrvSlsInv"),
            data: JSON.stringify(MasterDetailsModel),
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess == true) {
                    btnUpdate.disabled = false;
                    DisplayMassage(' تم فك الاعتماد بنجاح ', 'Deaccredited successfully', MessageType.Succeed);
                    let res = result.Response as AVAT_TR_SlsInvoice;
                    $("#cotrolDiv").removeClass("disabledDiv");
                    GlobalinvoiceID = res.InvoiceID;
                    FlagAfterInsertOrUpdate = true;
                    InitializeGrid();
                    Grid_RowDoubleClicked();
                    FlagAfterInsertOrUpdate = false;

                } else {
                    DisplayMassage("الرجاء تحديث الصفحة واعادت تكرارالمحاولة مره اخري ", "Please refresh the page and try again", MessageType.Error);
                }
            }
        });
    }
    //------------------------------------------------------Print------------------------
    function PrintReport(OutType: number) {
        debugger
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
        rp.TrType = 0;    //---------------------------------slsinvoice
        if (ddlCustomer.selectedIndex > 0) { rp.CustomerID = Number($("#ddlCustomer").val()); }
        else { rp.CustomerID = -1; }

        rp.CashType = Number($("#ddlInvoiceType").val());
        rp.Status = Number($("#ddlStateType").val())



        Ajax.Callsync({
            url: Url.Action("IProc_Rpt_VATSlsInvoiceList", "GeneralReports"),
            data: rp,
            success: (d) => {

                let result = d.result as string;
                
                window.open(result, "_blank");
            }
        })
    }
    function btnPrintInvoicePrice_onclick() {
        if (!SysSession.CurrentPrivileges.PrintOut) return;

        let rp: ReportParameters = new ReportParameters();
         
        rp.TRId = GlobalinvoiceID;
        rp.slip = 0;
        rp.Typ = 1;
                                                                                      
            rp.Name_function = "IProc_Prnt_VATSlsInvoicePriceshow";
            localStorage.setItem("Report_Data", JSON.stringify(rp));

            localStorage.setItem("result", '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>');
             window.open(Url.Action("ReportsPopup", "Home"), "_blank");
    }
    function PrintTransaction() {
        if (!SysSession.CurrentPrivileges.PrintOut) return;
        
        let rp: ReportParameters = new ReportParameters();
         
        rp.TRId = GlobalinvoiceID;
        rp.slip = 0;
                                 
            rp.Name_function = "IProc_Prnt_VATSlsInvoice";
            localStorage.setItem("Report_Data", JSON.stringify(rp));
        

            localStorage.setItem("result", '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>');
             window.open(Url.Action("ReportsPopup", "Home"), "_blank");
    }
    function btnPrintslip_onclick() {
        debugger;
        if (!SysSession.CurrentPrivileges.PrintOut) return;

        let rp: ReportParameters = new ReportParameters();
         
        rp.TRId = GlobalinvoiceID;
        rp.slip = 1;

        rp.Name_function = "IProc_Prnt_VATSlsInvoice";
        localStorage.setItem("Report_Data", JSON.stringify(rp));
        

        localStorage.setItem("result", '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>');
        window.open(Url.Action("ReportsPopup", "Home"), "_blank");
          
    }

    function DownloadInvoicePdf() {


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
        rp.BraNameA = SysSession.CurrentEnvironment.BranchName;
        rp.BraNameE = SysSession.CurrentEnvironment.BranchName;
        rp.DocPDFFolder = SysSession.CurrentEnvironment.I_Control[0].DocPDFFolder;

        if (rp.BraNameA == null || rp.BraNameE == null) {

            rp.BraNameA = " ";
            rp.BraNameE = " ";
        }

        rp.TRId = GlobalinvoiceID;
        rp.slip = 0;

        Ajax.CallAsync({
            url: Url.Action("Prnt_VATSlsInvoice", "Reports_pdf"),
            data: rp,
            success: (d) => {
                

            }
        })
    }
}               