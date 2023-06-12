$(document).ready(() => {

    SlsTrServicesReturn.InitalizeComponent();
})
namespace SlsTrServicesReturn {
    //system varables
    var SysSession: SystemSession = GetSystemSession(Modules.Ser_Return_Sales);
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
    //var ddlInvoiceCustomer: HTMLSelectElement;
    var ddlType: HTMLSelectElement;


    // Arrays
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
    var SalesmanDetails: Array<I_Sls_D_Salesman> = new Array<I_Sls_D_Salesman>();
    var CostCentreDetailsIst: Array<G_COST_CENTER> = new Array<G_COST_CENTER>();
    var AccountDetails: A_ACCOUNT = new A_ACCOUNT();
    var resObj: AQ_ServSlsInvoiceMasterDetails = new AQ_ServSlsInvoiceMasterDetails();


    //Models
    var InvoiceStatisticsModel: Array<AQVAT_GetSlsInvoiceList> = new Array<AQVAT_GetSlsInvoiceList>();
    var InvoiceItemsDetailsModel: Array<AVAT_TR_SlsInvoiceItem> = new Array<AVAT_TR_SlsInvoiceItem>();
    var InvoiceModel: AVAT_TR_SlsInvoice = new AVAT_TR_SlsInvoice();
    var MasterDetailsModel: ServSlsInvoiceMasterDetails = new ServSlsInvoiceMasterDetails();
    var invoiceItemSingleModel: AVAT_TR_SlsInvoiceItem = new AVAT_TR_SlsInvoiceItem();
    var ServicesDetails: Array<AQVAT_GetService> = new Array<AQVAT_GetService>();
    var MasterDetailModel: SlsInvoiceMasterDetails = new SlsInvoiceMasterDetails();
    var storeDetails: Array<G_STORE> = new Array<G_STORE>();
    var GlobInvoiceModel: AQ_ServSlsInvoiceMasterDetails = new AQ_ServSlsInvoiceMasterDetails();

    //TextBoxes
    var txtStartDate: HTMLInputElement;
    var txtEndDate: HTMLInputElement;
    var txtItemCount: HTMLInputElement;
    var txtTotalbefore: HTMLInputElement;
    var txtTotalDiscount: HTMLInputElement;
    var txtPackageCount: HTMLInputElement;
    var txtTotal: HTMLInputElement;
    var txtTax: HTMLInputElement;
    var txtNet: HTMLInputElement;
    var txtInvoiceDate: HTMLInputElement;
    var searchbutmemreport: HTMLInputElement;
    var txtCashAccount: HTMLInputElement;
    var txtCashAccountName: HTMLInputElement;
    var txtInvoiceID: HTMLInputElement;
    var txtReturnNumber: HTMLInputElement;

    //var txtDiscountPrcnt: HTMLInputElement;
    var txtDiscountValue: HTMLInputElement;
    var txtCustomerCode: HTMLInputElement;
    var txtCustomerName: HTMLInputElement;
    //labels


    //checkbox
    var chkActive: HTMLInputElement;

    //buttons 
    var btnAdd: HTMLButtonElement;
    var btnShow: HTMLButtonElement;
    var btnUpdate: HTMLButtonElement;
    var btnBack: HTMLButtonElement;
    var btnSave: HTMLButtonElement;
    var btnInvoiceSearch: HTMLButtonElement;
    var btnAccSearch: HTMLButtonElement;
    //print buttons 

    var btnPrintTrview: HTMLButtonElement;
    var btnPrintTrPDF: HTMLButtonElement;
    var btnPrintTrEXEL: HTMLButtonElement;
    var btnPrintTransaction: HTMLButtonElement;
    var btnPrintslip: HTMLButtonElement;
    var btnCustomerSrch: HTMLButtonElement;


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
    var GlobalReturnID: number = 0;
    var GlobalinvoiceID: number = 0;
    //flags : 
    var Show: boolean = true;
    var NewAdd: boolean = true;
    var FlagAfterInsertOrUpdate: boolean = false;
    var FlagUpdateMode: boolean = false;
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);
    var btnPrint: HTMLInputElement;
    var Tax_Rate = 0;
    var Tax_Type_Model: Tax_Type = new Tax_Type();
  
    var CustomerId = 0;

    //------------------------------------------------------ Main Region------------------------
    export function InitalizeComponent() {
        // VatPrc
        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = "مرتجع  المبيعات ";
        }
        else {
            document.getElementById('Screen_name').innerHTML = "Sales Return";
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

        FillddlStateType(); DisplayMassage
        FillddlInvoiceType();
        vatType = SysSession.CurrentEnvironment.I_Control[0].DefSlsVatType;
        GetVatPercentage();
        $('#ddlStateType').prop("value", "2");
        $('#ddlInvoiceType').prop("value", "2");
        txtItemCount.value = CountItems.toString();
        txtPackageCount.value = PackageCount.toString();
        txtTotal.value = CountTotal.toString();
        txtTax.value = TaxCount.toString();
        txtNet.value = NetCount.toString();
        GetAllServices();
        GetAllCostCenters();

    }
    function InitalizeControls() {
        btnPrint = document.getElementById("btnPrint") as HTMLInputElement;

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
        txtTotalbefore = document.getElementById("txtTotalbefore") as HTMLInputElement;
        txtTotalDiscount = document.getElementById("txtTotalDiscount") as HTMLInputElement;
        txtPackageCount = document.getElementById("txtPackageCount") as HTMLInputElement;
        txtTotal = document.getElementById("txtTotal") as HTMLInputElement;
        txtTax = document.getElementById("txtTax") as HTMLInputElement;
        txtNet = document.getElementById("txtNet") as HTMLInputElement;
        txtInvoiceDate = document.getElementById("txtInvoiceDate") as HTMLInputElement;
        txtCashAccount = document.getElementById("txtCashAccount") as HTMLInputElement;
        txtCashAccountName = document.getElementById("txtCashAccountName") as HTMLInputElement;
        txtInvoiceID = document.getElementById("txtInvoiceID") as HTMLInputElement;
        txtReturnNumber = document.getElementById("txtReturnNumber") as HTMLInputElement;
        txtDiscountValue = document.getElementById("txtDiscountValue") as HTMLInputElement;
        txtCustomerCode = document.getElementById("txtCustomerCode") as HTMLInputElement;
        txtCustomerName = document.getElementById("txtCustomerName") as HTMLInputElement;
        //txtDiscountPrcnt = document.getElementById("txtDiscountPrcnt") as HTMLInputElement;

        //checkbox
        chkActive = document.getElementById("chkActive") as HTMLInputElement;

        //button
        btnAdd = document.getElementById("btnAdd") as HTMLButtonElement;
        btnShow = document.getElementById("btnShow") as HTMLButtonElement;
        btnUpdate = document.getElementById("btnUpdate") as HTMLButtonElement;
        btnBack = document.getElementById("btnBack") as HTMLButtonElement;
        btnSave = document.getElementById("btnSave") as HTMLButtonElement;
        btnInvoiceSearch = document.getElementById("btnInvoiceSearch") as HTMLButtonElement;
        btnAccSearch = document.getElementById("btnAccSearch") as HTMLButtonElement;
        //print 
        btnPrintTrview = document.getElementById("btnPrintTrview") as HTMLButtonElement;
        btnPrintTrPDF = document.getElementById("btnPrintTrPDF") as HTMLButtonElement;
        btnPrintTrEXEL = document.getElementById("btnPrintTrEXEL") as HTMLButtonElement;
        btnPrintTransaction = document.getElementById("btnPrintTransaction") as HTMLButtonElement;
        btnPrintslip = document.getElementById("btnPrintslip") as HTMLButtonElement;
        btnCustomerSrch = document.getElementById("btnCustomerSrch") as HTMLButtonElement;

    }
    function InitializeEvents() {

        chkActive.onclick = chkActive_onchecked;
        btnAdd.onclick = btnAdd_onclick;
        btnShow.onclick = btnShow_onclick;
        btnUpdate.onclick = btnUpdate_onclick;
        btnAccSearch.onclick = btnAccSearch_onclick;
        btnBack.onclick = btnBack_onclick;
        btnSave.onclick = btnSave_onclick;
        btnInvoiceSearch.onclick = btnInvoiceSearch_onclick;
        txtCashAccount.onchange = txtCashAccount_onchange;
        btnCustomerSrch.onclick = btnCustomerSrch_onclick;

        //print
        btnPrintTrview.onclick = () => { PrintReport(1); }
        btnPrintTrPDF.onclick = () => { PrintReport(2); }
        btnPrintTrEXEL.onclick = () => { PrintReport(3); }
        btnPrint.onclick = () => { PrintReport(4); }
        btnPrintTransaction.onclick = PrintTransaction;
        btnPrintslip.onclick = btnPrintslip_onclick;
        ////
        txtDiscountValue.onkeyup = txtDiscountValue_onchange;

        searchbutmemreport.onkeyup = _SearchBox_Change;
    }
    //------------------------------------------------------ Events Region------------------------
   

    function btnCustomerSrch_onclick() {
        let Credit = '';
        if (ddlType.value == "0") {
            Credit = "and IsCreditCustomer = 1"
        }
        if (ddlType.value == "1") {
            Credit = "and IsCreditCustomer = 0"
        }
        else {
            Credit = ""

        }
        let sys: SystemTools = new SystemTools();
        //sys.FindKey(Modules.Sales_Services, "btnCustomerSrch", "CompCode=" + compcode + "and BranchCode=" + BranchCode + " and ISPersonal ='" + CustType.IsPersonal + "' and SalesInvoiceNature = " + CustType.SalesInvoiceNature + "", () => {
        sys.FindKey(Modules.Sales_Services, "btnCustomerSrch", "CompCode=" + compcode + "and BranchCode=" + BranchCode + "" + Credit + "", () => {
            let id = SearchGrid.SearchDataGrid.SelectedKey;

            var custObjct = VendorDetails.filter(s => s.CustomerId == id);
            txtCustomerCode.value = custObjct[0].CustomerCODE;
            CustomerId = custObjct[0].CustomerId;
            txtCustomerName.value = lang == "ar" ? custObjct[0].NAMEA : custObjct[0].NAMEE;
            ddlInvoiceCustomer_onchange();
        });
    }
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

        //if (btnUpdate.getAttribute('class') != 'btn btn-primary display_none') {

        if (chkActive.checked == false && FlagUpdateMode == false) {
            openInvoice();
        }
        // }

    }
    function chkPreivilegeToEditApprovedInvoice() {

        if (SysSession.CurrentPrivileges.CUSTOM2 == false) {
            chkActive.disabled = true;
            btnUpdate.disabled = true;
        } else {
            chkActive.disabled = false;
            btnUpdate.disabled = true;
        }
    }
    function Check_CreditLimit_Custom(net: number) {

        var custID = CustomerId;
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
    function txtDiscountValue_onchange() {
        if (txtDiscountValue.value.trim() != '' && txtDiscountValue.value != '0') {
            txtNet.value = (Number(NetCount.RoundToSt(2)) - Number(txtDiscountValue.value)).RoundToSt(2);


        }
        else {
            ComputeTotals();
        }
    }
    function txtCashAccount_onchange() {
        var accCode = txtCashAccount.value;
        GetAccByCode(accCode);
    }
    //------------------------------------------------------ Buttons Region------------------------
    function btnAccSearch_onclick() {
        let sys: SystemTools = new SystemTools();
        sys.FindKey(Modules.Sales_Services, "btnAccSearch", "COMP_CODE=" + compcode + "and DETAIL='True' and ACC_TYPE in ( 1 , 2, 3) ", () => {
            let id = SearchGrid.SearchDataGrid.SelectedKey;
            GetAccByCode(id);

        });
    }
    function btnInvoiceSearch_onclick() {
        clearBeforeInvSearch();
        debugger
        let IsCash = '';
        if (ddlType.value == "0") {
            IsCash = "and IsCash = 0";
        }
        else if (ddlType.value == "1") {
            IsCash = "and IsCash = 1";
        }
        else {
            IsCash = "";
        }

        if (CustomerId == 0) {
            let sys: SystemTools = new SystemTools();
            sys.FindKey(Modules.Ser_Return_Sales, "btnInvoiceSearch", "CompCode=" + compcode + "and Status=1 and TrType=0 and BranchCode = " + BranchCode + "" + IsCash, () => {
                let id = SearchGrid.SearchDataGrid.SelectedKey;
                GetInvoiceByID(id);
            });
        } else {
            var CustId: number = CustomerId;
            clearBeforeInvSearch();
            let sys: SystemTools = new SystemTools();
            sys.FindKey(Modules.Ser_Return_Sales, "btnInvoiceSearch", "CompCode=" + compcode + "and Status=1 and TrType=0 and BranchCode = " + BranchCode + "and CustomerId = " + CustId + "" + IsCash, () => {
                let id = SearchGrid.SearchDataGrid.SelectedKey;
                GetInvoiceByID(id);
            });
            //CustomerId = 0;
        }
    }
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

        if (!ValidationGrid())
            return;

        if (ddlType.value == "0") {

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
        FlagUpdateMode = false;
        $("#btnpreview").addClass("display_none");

    }, 100);
    }
    function btnBack_onclick() {
        if (NewAdd == true) { //add

            $("#DivInvoiceDetails").addClass("display_none");
            $("#cotrolDiv").removeClass("disabledDiv");
            $("#ddlType").attr("disabled", "disabled");
            $("#chkActive").attr("disabled", "disabled");

            $("#btnPrintInvoicePrice").removeClass("display_none");
            $("#div_btnPrint").removeClass("display_none");

            $("#btnUpdate").removeClass("display_none");
            $("#btnPrintTransaction").removeClass("display_none");
            $("#btnBack").addClass("display_none");
            $("#btnSave").addClass("display_none");
            $("#txt_Remarks").attr("disabled", "disabled");
            $("#txtDiscountValue").attr("disabled", "disabled");
            $("#btnpreview").addClass("display_none");

            CustomerId = 0;

        }
        else {//Edit

            Grid_RowDoubleClicked();
            $("#cotrolDiv").removeClass("disabledDiv");
            $("#ddlType").attr("disabled", "disabled");
            $("#chkActive").attr("disabled", "disabled");
            $("#txt_Remarks").attr("disabled", "disabled");
            $("#txtDiscountValue").attr("disabled", "disabled");

            $("#btnPrintInvoicePrice").removeClass("display_none");
            $("#div_btnPrint").removeClass("display_none");

            $("#btnUpdate").removeClass("display_none");
            $("#btnPrintTransaction").removeClass("display_none");
            $("#btnBack").addClass("display_none");
            $("#btnSave").addClass("display_none");
            $("#btnpreview").addClass("display_none");


            CustomerId = 0;

        }

    }
    function btnAdd_onclick() {
        $("#DivInvoiceDetails").removeClass("display_none");
        FlagUpdateMode = true;
        txtReturnNumber.value = '';
        txtInvoiceID.value = '';
        txtInvoiceDate.value = GetDate();

        txtCashAccount.value = "";
        txtCashAccountName.value = "";
        ddlType.value = 'null'
        txtTotal.value = '0'
        txtTax.value = '0'
        txtNet.value = '0'
        txtItemCount.value = '0'
        txtPackageCount.value = '0'
        $('#txtVoucherNo').val('');
        //txtDiscountPrcnt.value = '0'
        txtDiscountValue.value = '0'
        chkActive.checked = true;
        $('#txtCreatedBy').prop("value", SysSession.CurrentEnvironment.UserCode);
        $('#txtCreatedAt').prop("value", DateTimeFormat(GetDate().toString()));
        $('#txtUpdatedBy').prop("value", "");
        $('#txtUpdatedAt').prop("value", "");

        btnInvoiceSearch.disabled = false;



        chkActive.disabled = false;
        txtInvoiceDate.disabled = true;
        ddlType.disabled = true;
        txtCashAccount.disabled = true;
        txtCashAccountName.disabled = true;

        $("#btnUpdate").addClass("display_none");
        $("#btnPrintTransaction").addClass("display_none");
        $("#btnPrintInvoicePrice").addClass("display_none");
        $("#div_btnPrint").addClass("display_none");
        $("#btnBack").removeClass("display_none");
        $("#btnSave").removeClass("display_none");
        $("#btnpreview").removeClass("display_none");


        $("#div_Data").html("");
        CountGrid = 0;
        CountItems = 0;

        $("#cotrolDiv").attr("disabled", "disabled").off('click');
        $("#cotrolDiv").addClass("disabledDiv");

        $("#ddlType").removeAttr("disabled");
        $("#btnCustomerSrch").removeAttr("disabled");

        $("#txtDiscountValue").removeAttr("disabled");
        $("#txt_Remarks").removeAttr("disabled");

        $("#txt_Remarks").val("");


        txtCustomerCode.value = "";
        txtCustomerName.value = "";
        txtTotalbefore.value = "";

        Show = false;

        NewAdd = true;

        //   AddNewRow();
    }
    function btnShow_onclick() {
        InitializeGrid();
        $("#divShow").removeClass("display_none");
        $("#DivInvoiceDetails").addClass("display_none");
        $("#cotrolDiv").removeClass("disabledDiv");
    }
    function btnUpdate_onclick() {
        if (!SysSession.CurrentPrivileges.EDIT) return;
        FlagUpdateMode = true;
        $("#cotrolDiv").attr("disabled", "disabled").off('click');
        $("#cotrolDiv").addClass("disabledDiv");
        Show = false;
        $("#btnUpdate").addClass("display_none");
        $("#btnPrintTransaction").addClass("display_none");
        $("#btnPrintInvoicePrice").addClass("display_none");
        $("#div_btnPrint").addClass("display_none");
        $("#btnBack").removeClass("display_none");
        $("#btnSave").removeClass("display_none");

        var items: number = Number(CountGrid);
        for (let i = 0; i < items + 1; i++) {
            $("#txtReturnQuantity" + i).removeAttr("disabled");

            $("#btn_minus" + i).addClass("display_none");
            $("#btn_minus" + i).removeAttr("disabled");
            $("#btn_minus" + i).click(function (e) {
                DeleteRow(i);
            });
        }

        $("#chkActive").removeAttr("disabled");
        checkValidation();
        NewAdd = false;
        if (ddlType.value == "1") {
            btnAccSearch.disabled = false;
            txtCashAccount.disabled = false;
        } else {
            btnAccSearch.disabled = true;
            txtCashAccount.disabled = true;
        }

        $("#txtDiscountValue").removeAttr("disabled");
        $("#txt_Remarks").removeAttr("disabled");

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

                    VendorDetails = result.Response as Array<A_Rec_D_Customer>;
                    
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {//ddlInvoiceCustomer
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
            data: { CompCode: compcode, trtype: 1, BranchCode: BranchCode, IsCash: IsCash, StartDate: startDate, EndDate: endDate, Status: status, CustId: customerId, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    AQ_ServSlsInvoiceDetails = result.Response as Array<AQVAT_GetSlsInvoiceList>;
                    for (let i = 0; i < AQ_ServSlsInvoiceDetails.length; i++) {
                        AQ_ServSlsInvoiceDetails[i].TrDate = DateFormat(AQ_ServSlsInvoiceDetails[i].TrDate.toString());
                        AQ_ServSlsInvoiceDetails[i].statusDesciption = AQ_ServSlsInvoiceDetails[i].Status == 1 ? (lang == "ar" ? "معتمد" : "A certified") : (lang == "ar" ? "غير معتمد" : "Not supported");
                        AQ_ServSlsInvoiceDetails[i].IsCashDesciption = AQ_ServSlsInvoiceDetails[i].IsCash == false ? (lang == "ar" ? "علي الحساب" : "On account") : (lang == "ar" ? "نقدي" : "Cash");
                    }
                    Grid.DataSource = AQ_ServSlsInvoiceDetails;
                    Grid.Bind();
                }
            }
        });
    }
    function Grid_RowDoubleClicked() {
        Show = true;
        FlagUpdateMode = false
        $("#divShow").removeClass("display_none");
        $("#btnUpdate").removeClass("display_none");
        $("#btnPrintTransaction").removeClass("display_none");
        $("#DivInvoiceDetails").removeClass("display_none");
        clear();
        InvoiceStatisticsModel = new Array<AQVAT_GetSlsInvoiceList>();

        

        if (FlagAfterInsertOrUpdate == true) {
            Selecteditem = AQ_ServSlsInvoiceDetails.filter(x => x.InvoiceID == Number(GlobalReturnID));

        } else {

            if (Grid.SelectedKey == undefined) {
                Selecteditem = AQ_ServSlsInvoiceDetails.filter(x => x.InvoiceID == Number(GlobalinvoiceID));
            } else
                Selecteditem = AQ_ServSlsInvoiceDetails.filter(x => x.InvoiceID == Number(Grid.SelectedKey));

        }


        GlobalReturnID = Number(Selecteditem[0].InvoiceID);
        InvoiceStatisticsModel = Selecteditem;
        if (InvoiceStatisticsModel.length > 0) {
            txtInvoiceID.value = InvoiceStatisticsModel[0].RetInv_DocNo;
            GlobalinvoiceID = InvoiceStatisticsModel[0].RefTrID;
            txtTotal.value = InvoiceStatisticsModel[0].TotalAmount.toString();
            txtTax.value = InvoiceStatisticsModel[0].VatAmount.toString();
            txtNet.value = InvoiceStatisticsModel[0].NetAfterVat.toString();

            //txtDiscountPrcnt.value = InvoiceStatisticsModel[0].DiscountPrc.toString();

            txtReturnNumber.value = InvoiceStatisticsModel[0].TrNo.toString();

            txtInvoiceDate.value = DateFormat(InvoiceStatisticsModel[0].TrDate.toString());
            txtCustomerName.value = lang == "ar" ? InvoiceStatisticsModel[0].Cus_NameA.toString() : InvoiceStatisticsModel[0].Cus_NameE.toString();
            txtCustomerCode.value = InvoiceStatisticsModel[0].Cus_Code.toString();
            CustomerId = InvoiceStatisticsModel[0].CustomerId;


            if (InvoiceStatisticsModel[0].Status == 1) {
                chkActive.checked = true;
                chkPreivilegeToEditApprovedInvoice();
            } else {
                chkActive.checked = false;
                btnUpdate.disabled = !SysSession.CurrentPrivileges.EDIT;
                chkActive.disabled = true;
            }
            //if (InvoiceStatisticsModel[0].IsCash == false) {
            //    $('#ddlType').prop("value", "0");
            //    txtCashAccount.value = InvoiceStatisticsModel[0].BankAccount.toString();
            //    GetAccByCode(txtCashAccount.value);
            //} else {
            //    $('#ddlType').prop("value", "1");

            //}

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
            data: { InvoiceID: GlobalReturnID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    resObj = result.Response as AQ_ServSlsInvoiceMasterDetails;
                    SlsInvoiceItemsDetails = resObj.AQVAT_GetSlsInvoiceItem;

                }
            }
        });
        for (let i = 0; i < SlsInvoiceItemsDetails.length; i++) {
            BuildControls(i);
        }
        CountGrid = SlsInvoiceItemsDetails.length;
        CountItems = SlsInvoiceItemsDetails.length;

        $("#btnSave").addClass("display_none");
        $("#btnBack").addClass("display_none");

        $("ddlInvoiceCustomer").attr("disabled", "disabled");
        $("txt_Remarks").attr("disabled", "disabled");
        $("txtDiscountValue").attr("disabled", "disabled");

        btnAccSearch.disabled = true;
        txtInvoiceDate.disabled = true;

        ddlType.disabled = true;
        txtCashAccount.disabled = true;
        txtCashAccountName.disabled = true;
        btnCustomerSrch.disabled = true;

        if (InvoiceStatisticsModel[0].Status == 1) {
            if (!SysSession.CurrentPrivileges.CUSTOM2) {
                $("#btnUpdate").addClass("display_none");
            } else {
                $("#btnUpdate").removeClass("display_none");

            }
        }
        DocumentActions.RenderFromModel(InvoiceStatisticsModel[0]);
        let DeliveryDate: string = InvoiceStatisticsModel[0].DeliveryDate == null ? GetDate() : DateFormat(InvoiceStatisticsModel[0].DeliveryDate);
        $('#txtDeliveryDate').val(DeliveryDate);
        let DeliveryEndDate: string = InvoiceStatisticsModel[0].DeliveryEndDate == null ? GetDate() : DateFormat(InvoiceStatisticsModel[0].DeliveryEndDate);
        $('#txtDeliveryEndDate').val(DeliveryEndDate);

        $('#txtContractNo').val(InvoiceStatisticsModel[0].ContractNo.toString());
        $('#txtPurchaseorderNo').val(InvoiceStatisticsModel[0].PurchaseorderNo.toString());
        $('#txt_Remarks').val(InvoiceStatisticsModel[0].Remark.toString());
        ComputeTotals();
    }
    //------------------------------------------------------ Controls Grid Region------------------------
    function BuildControls(cnt: number) {
        var html;
        html = `<tr id="No_Row${cnt}">
                    '<input id="InvoiceItemID${cnt}" type="hidden" class="form-control display_none"  />'
                    <td>
		                <div class="form-group">
			               <input id="txtSerial${cnt}" type="text" class="form-control" disabled />
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
			                 <input id="txtServicCode${cnt}" name="" disabled type="text" class="form-control" />
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
			                <select id="ddlItem${cnt}" class="form-control">
                                <option value="null">${(lang == "ar" ? "الخدمه" : "Service") }</option>
                            </select>
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
			                <input type="text" disabled id="txtQuantity${cnt}" name="quant[1]" class="form-control" value="1" min="1" max="1000" step="1">
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
			               <input type="text" disabled class="form-control" id="txtReturnQuantity${cnt}" name="quant[3]" class="form-control" value="0" min="0" max="1000" step="1">
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
			              <input type="text" disabled id="txtPrice${cnt}" name="quant[2]" class="form-control" value="1" min="0" max="1000" step="0.5">
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
			                <input type="number" disabled id="txtDiscountPrc${cnt}" name="quant[2]" class="form-control" value="0" min="0" max="1000" step="0.5">
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
			                <input type="number" disabled id="txtDiscountAmount${cnt}" name="quant[2]" class="form-control" value="0" min="0" max="1000" step="0.5">
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
			                <select id="ddlCostCenter${cnt}" class="form-control input-sm">
                                 <option value="null">${(lang == "ar" ? "مركز التكلفة" : "cost Center")}</option>
                            </select>
		                </div>
	                </td>
                  
                    <input id="txt_StatusFlag${cnt}" name = " " type = "hidden" class="form-control"/>
                    <input id="txt_ID${cnt}" name = " " type = "hidden" class="form-control" />
                </tr>`;
       
        $("#div_Data").append(html);

        //fill dropdownlist
        for (var i = 0; i < ServicesDetails.length; i++) {
            var catID = ServicesDetails[i].SrvCategoryID;
            var catObj = CategorDetails.filter(s => s.SrvCategoryID == catID);
            $('#ddlItem' + cnt).append('<option  data-VatNatID= "' + catObj[0].VatNatID + '"  value="' + ServicesDetails[i].Itemid + '">' + (lang == "ar" ? ServicesDetails[i].Itm_DescA : ServicesDetails[i].Itm_DescE) + '</option>');

            $("#txtQuantity" + cnt).val("1");
            $("#txtPrice" + cnt).val("1");
            $("#txtTotal" + cnt).val("0");
            $("#txtTax" + cnt).val("0");
            $("#txtTotAfterTax" + cnt).val("0");


            let Cat_Tax = DetailsVatNature.filter(s => s.VatNatID == catObj[0].VatNatID);
            Tax_Rate = Cat_Tax[0].VatPrc;

            Tax_Type_Model = GetVat(Cat_Tax[0].VatNatID, Tax_Rate, vatType);

            Tax_Rate = Tax_Type_Model.Prc
            $("#txtTax_Rate" + cnt).attr('data-VatNatID', Tax_Type_Model.Nature);
        }

        //ComputeTotals();
        //fill CostCenter
        for (var i = 0; i < CostCentreDetailsIst.length; i++) {
            $('#ddlCostCenter' + cnt).append('<option   value="' + CostCentreDetailsIst[i].CC_CODE + '">' + (lang == "ar" ? CostCentreDetailsIst[i].CC_DESCA : CostCentreDetailsIst[i].CC_DESCE) + '</option>');
        }


        var dropddlItem = '#ddlItem' + cnt;
        $(dropddlItem).change(function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");

            if ($('#ddlItem' + cnt).val() == "null") {
                $("#txtQuantity" + cnt).val("1");
                $("#txtPrice" + cnt).val("1");
                $("#txtTotal" + cnt).val("0");
                $("#txtTax" + cnt).val("0");
                $("#txtTotAfterTax" + cnt).val("0");
            } else {

                var selectedItem = $(dropddlItem + ' option:selected').attr('value');

                var itemID = Number(selectedItem);
                var NumberSelect = ServicesDetails.filter(s => s.Itemid == itemID);

                if (NumberSelect.length > 0) {
                    var itemPrice = NumberSelect[0].UnitPrice;
                    $("#txtPrice" + cnt).val(itemPrice);
                    var txtQuantityValue = $("#txtQuantity" + cnt).val();
                    var txtPriceValue = $("#txtPrice" + cnt).val();

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
            ComputeTotals();
        });

        // text change

        $("#txtReturnQuantity" + cnt).on('keyup', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");

            var txtQuantityValue = $("#txtQuantity" + cnt).val();
            var txtReturnQuantityValue = $("#txtReturnQuantity" + cnt).val();
            var txtPriceValue = $("#txtNetUnitPrice" + cnt).val();
            if (Number(txtReturnQuantityValue) <= Number(txtQuantityValue)) {
                var total = Number(txtReturnQuantityValue) * Number(txtPriceValue);
                $("#txtTotal" + cnt).val(total.RoundToSt(2));
                VatPrc = Number($("#txtTax_Rate" + cnt).val());
                var vatAmount = Number(total) * VatPrc / 100;
                $("#txtTax" + cnt).val(vatAmount.RoundToSt(2));
                var totalAfterVat = Number(vatAmount.RoundToSt(2)) + Number(total.RoundToSt(2));
                $("#txtTotAfterTax" + cnt).val(totalAfterVat.RoundToSt(2));
                ComputeTotals();
            }
            else {
                $("#txtReturnQuantity" + cnt).val("0");
                $("#txtNetUnitPrice" + cnt).val("1");
                $("#txtPrice" + cnt).val("1");
                $("#txtTotal" + cnt).val("0");
                $("#txtTax" + cnt).val("0");
                $("#txtTotAfterTax" + cnt).val("0");
                DisplayMassage('( يجب ان تكون الكميه المرتجعه اقل من الكمية المباعة)', 'Return Quantity must be less than sold Quantity', MessageType.Error);

            }
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

        $("#ddlCostCenter" + cnt).attr("disabled", "disabled");
        $("#txtSerial" + cnt).attr("disabled", "disabled");
        $("#txtTax_Rate" + cnt).attr("disabled", "disabled");
        $("#ddlItem" + cnt).attr("disabled", "disabled");
        $("#txtServicCode" + cnt).attr("disabled", "disabled");
        $("#txtQuantity" + cnt).attr("disabled", "disabled");
        $("#txtPrice" + cnt).attr("disabled", "disabled");
        $("#txtReturnQuantity" + cnt).attr("disabled", "disabled");
        $("#txtTotal" + cnt).attr("disabled", "disabled");
        $("#txtTax" + cnt).attr("disabled", "disabled");
        $("#txtTotAfterTax" + cnt).attr("disabled", "disabled");
        $("#txtRemarks" + cnt).attr("disabled", "disabled");

        $("#btn_minus" + cnt).addClass("display_none");
        $("#btn_minus" + cnt).attr("disabled", "disabled");


        $("#ddlItem" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].ItemID);
        $("#txtServicCode" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].it_itemCode);

        $("#ddlCostCenter" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].CC_CODE);

        $("#txtSerial" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].Serial);
        $("#txtPrice" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].Unitprice);
        $("#txtTax_Rate" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].VatPrc);


        $("#txtDiscountPrc" + cnt).val(SlsInvoiceItemsDetails[cnt].DiscountPrc);

        $("#txtDiscountAmount" + cnt).val(SlsInvoiceItemsDetails[cnt].DiscountAmount);

        $("#txtNetUnitPrice" + cnt).val(SlsInvoiceItemsDetails[cnt].NetUnitPrice);
        $("#txtRemarks" + cnt).val(SlsInvoiceItemsDetails[cnt].Remarks);


        if (Show == true) { // display return


            //bind Data
            $("#txt_StatusFlag" + cnt).val("");
            $("#txtReturnQuantity" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].SoldQty);
            $("#txtQuantity" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].InvoiceSoldQty);
            $("#txtTotal" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].ItemTotal);
            $("#txtTax" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].VatAmount.RoundToSt(2));
            $("#txtTotAfterTax" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].NetAfterVat.RoundToSt(2));
            $("#InvoiceItemID" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].InvoiceItemID);



        }
        else { // load from invoice 
            $("#txt_StatusFlag" + cnt).val("i");
            let InvoiceSoldQty = SlsInvoiceItemsDetails[cnt].SoldQty - SlsInvoiceItemsDetails[cnt].TotRetQty;
            let total = InvoiceSoldQty * SlsInvoiceItemsDetails[cnt].NetUnitPrice;
            let vat = total * SlsInvoiceItemsDetails[cnt].VatPrc / 100;
            $("#txtReturnQuantity" + cnt).prop("value", InvoiceSoldQty);
            $("#txtQuantity" + cnt).prop("value", InvoiceSoldQty);
            $("#txtTotal" + cnt).prop("value", total.RoundToSt(2));
            $("#txtTax" + cnt).prop("value", vat.RoundToSt(2));
            $("#txtTotAfterTax" + cnt).prop("value", (vat + total).RoundToSt(2));
            $("#InvoiceItemID" + cnt).prop("value", 0);
            $("#txtReturnQuantity" + cnt).removeAttr("disabled");

            $("#btn_minus" + cnt).addClass("display_none");
            $("#btn_minus" + cnt).removeAttr("disabled");
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
            ComputeTotals();
            Insert_Serial();

            txtItemCount.value = CountItems.toString();
            $("#ddlCostCenter" + RecNo).val("99");
            $("#ddlItem" + RecNo).val("99");
            $("#txtQuantity" + RecNo).val("99");
            $("#txtPrice" + RecNo).val("199");
            $("#No_Row" + RecNo).attr("hidden", "true");
        });
    }
    function ComputeTotals() {
        debugger
        PackageCount = 0;
        CountTotal = 0;
        let TotalDiscount = 0;
        let Totalbefore = 0;
        TaxCount = 0;
        NetCount = 0;
        for (let i = 0; i < CountGrid; i++) {
            var flagvalue = $("#txt_StatusFlag" + i).val();
            if (flagvalue != "d" && flagvalue != "m") {
                PackageCount += Number($("#txtReturnQuantity" + i).val());
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
            SearchDetails = AQ_ServSlsInvoiceDetails.filter(x => x.TrNo.toString().search(search) >= 0
                || x.Cus_NameA.toLowerCase().search(search) >= 0 || x.Cus_NameE.toLowerCase().search(search) >= 0
                || x.DocNo.toLowerCase().search(search) >= 0);

            Grid.DataSource = SearchDetails;
            Grid.Bind();
        } else {
            Grid.DataSource = AQ_ServSlsInvoiceDetails;
            Grid.Bind();
        }
    }
    function ValidationHeader() {
        var newCount: number = 0;
        for (let i = 0; i < CountGrid; i++) {
            if ($("#txt_StatusFlag" + i).val() != "d" && $("#txt_StatusFlag" + i).val() != "m") {
                newCount++;
            }
        }
        if (!CheckDate(DateFormat(txtInvoiceDate.value).toString(), DateFormat(SysSession.CurrentEnvironment.StartDate).toString(), DateFormat(SysSession.CurrentEnvironment.EndDate).toString())) {

            DisplayMassage('  التاريخ ليس متطابق مع تاريخ السنه (' + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ')', '  The date is not identical with the date of the year (' + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ')', MessageType.Error);
            return
        }
        else if (txtInvoiceID.value.trim() == "") {
            DisplayMassage(" برجاء ادخال الفاتورة", "Please enter the Invoice ", MessageType.Error);
            Errorinput(txtInvoiceID);
            return false
        }
        else if (ddlType.value == "1" && txtCashAccount.value.trim() == "") {
            DisplayMassage(" برجاء ادخال حساب النقدية", "Please enter cash account ", MessageType.Error);
            Errorinput(txtCashAccount);
            return false
        }
        else if (newCount == 0) {
            DisplayMassage(" برجاء ادخال بيانات المرتجع", "Please select a Return data", MessageType.Error);
            return false
        }

        return true;
    }
    function ValidationGrid() {
        var count = 0;
        for (var i = 0; i < CountGrid; i++) {
            if ($("#txt_StatusFlag" + i).val() != "d" && $("#txt_StatusFlag" + i).val() != "m") {
                var RetQty = Number($("#txtReturnQuantity" + i).val());
                if (RetQty != 0) {
                    count++;
                }
            }
        }
        if (count == 0) {
            DisplayMassage('( يجب أضافه قيمه للكمية المرتجعه ع الفاتورة)', 'you must add value to the return quantity', MessageType.Error);
            return false
        }

        return true;
    }
    function clear() {
        $('#div_Data').html("");
        CountGrid = 0;
    }
    function clearBeforeInvSearch() {
        txtReturnNumber.value = '';
        txtInvoiceID.value = '';
        txtInvoiceDate.value = GetDate();
        //ddlInvoiceCustomer.value = 'null'
        txtCashAccount.value = "";
        txtCashAccountName.value = "";
        //ddlType.value = 'null'
        txtTotal.value = '0'
        txtTax.value = '0'
        txtNet.value = '0'
        txtItemCount.value = '0'
        txtPackageCount.value = '0'
        //txtDiscountPrcnt.value = '0'
        txtDiscountValue.value = '0'
        chkActive.checked = true;
        $('#txtCreatedBy').prop("value", SysSession.CurrentEnvironment.UserCode);
        $('#txtCreatedAt').prop("value", DateTimeFormat(GetDate().toString()));
        $('#txtUpdatedBy').prop("value", "");
        $('#txtUpdatedAt').prop("value", "");

        btnInvoiceSearch.disabled = false;

        $('#ddlInvoiceCustomer').val('null');
        $("#ddlInvoiceCustomer").removeAttr("disabled");


        chkActive.disabled = false;
        txtInvoiceDate.disabled = true;
        //ddlType.disabled = true;
        txtCashAccount.disabled = true;
        txtCashAccountName.disabled = true;
        ComputeTotals();
        // btnInvoiceSearch.disabled = true;
        //ddlInvoiceCustomer.disabled = true;
        txtInvoiceDate.disabled = true;
        //ddlType.disabled = true;

        $('#div_Data').html("");
        CountGrid = 0;
        ComputeTotals();
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
    function GetInvoiceByID(id: number) {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("ServTrSales", "GetServSalesInvByID"),//GetServSalesInvByID(int InvoiceID,
            data: {
                InvoiceID: id, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    GlobInvoiceModel = new AQ_ServSlsInvoiceMasterDetails();
                    GlobInvoiceModel = result.Response as AQ_ServSlsInvoiceMasterDetails;
                    GlobalinvoiceID = GlobInvoiceModel.AQVAT_GetSlsInvoiceItem[0].InvoiceID;
                    BindInvoiceData();
                }
            }
        });
    }
    function BindInvoiceData() {
        Show = false;
        clear();
        InvoiceStatisticsModel = new Array<AQVAT_GetSlsInvoiceList>();

        GlobalReturnID = 0;
        txtReturnNumber.value = "";

        SlsInvoiceItemsDetails = new Array<AQVAT_GetSlsInvoiceItem>();
        SlsInvoiceItemsDetails = GlobInvoiceModel.AQVAT_GetSlsInvoiceItem.filter(x => x.SoldQty > x.TotRetQty);
        var buildedRows: number = 0;
        // Details
        for (let i = 0; i < SlsInvoiceItemsDetails.length; i++) {


            //// Bind Return Vaalue
            //var SoldQty = SlsInvoiceItemsDetails[i].TotRetQty - SlsInvoiceItemsDetails[i].SoldQty;
            //if (SoldQty < 0) {
            //    SoldQty = SoldQty * -1;
            //}
            //$("#txtReturnQuantity" + i).prop("value", "0");
            //$("#txtTotal" + i).prop("value", "0");
            //$("#txtTax" + i).prop("value", "0");
            //$("#txtTotAfterTax" + i).prop("value", "0");
            //$("#InvoiceItemID" + i).prop("value", "0");


            BuildControls(i);

            buildedRows++;

        }
        // Header
        if (buildedRows == 0) {
            txtInvoiceID.value = "";
            DisplayMassage('( لا توجد اصناف علي هذه الفاتورة)', 'this invoice has no items', MessageType.Error);
            btnInvoiceSearch.disabled = false;
            clear();
            return;
        } else {
            InvoiceStatisticsModel = GlobInvoiceModel.AQVAT_GetSlsInvoiceList;
            if (InvoiceStatisticsModel.length > 0) {
                txtTotal.value = InvoiceStatisticsModel[0].TotalAmount.toString();
                txtInvoiceID.value = InvoiceStatisticsModel[0].DocNo;
                txtTax.value = InvoiceStatisticsModel[0].VatAmount.toString();
                txtNet.value = InvoiceStatisticsModel[0].NetAfterVat.toString();
                txtCashAccount.value = InvoiceStatisticsModel[0].BankAccount.toString();
                GetAccByCode(txtCashAccount.value);
                //  txtInvoiceDate.value = DateFormat(InvoiceStatisticsModel[0].TrDate.toString());

                $('#txtVoucherNo').val(InvoiceStatisticsModel[0].VoucherNo);
                CustomerId = InvoiceStatisticsModel[0].CustomerId;
                var Cust = VendorDetails.filter(s => s.CustomerId == CustomerId);

                txtCustomerCode.value = Cust[0].CustomerCODE
                txtCustomerName.value = Cust[0].NAMEA
                //txtDiscountPrcnt.value = InvoiceStatisticsModel[0].DiscountPrc.toString();

                let DeliveryDate: string = InvoiceStatisticsModel[0].DeliveryDate == null ? GetDate() : DateFormat(InvoiceStatisticsModel[0].DeliveryDate);
                $('#txtDeliveryDate').val(DeliveryDate);
                let DeliveryEndDate: string = InvoiceStatisticsModel[0].DeliveryEndDate == null ? GetDate() : DateFormat(InvoiceStatisticsModel[0].DeliveryEndDate);
                $('#txtDeliveryEndDate').val(DeliveryEndDate);

                $('#txtContractNo').val(InvoiceStatisticsModel[0].ContractNo.toString());
                $('#txtPurchaseorderNo').val(InvoiceStatisticsModel[0].PurchaseorderNo.toString());
                $('#txt_Remarks').val(InvoiceStatisticsModel[0].Remark.toString());
                $('#txtDiscountValue').val(InvoiceStatisticsModel[0].RoundingAmount.toString());

                if (InvoiceStatisticsModel[0].IsCash == true) {
                    $('#ddlType').prop("value", "1");
                    $('#btnAccSearch').removeAttr("disabled");
                    $('#txtCashAccount').removeAttr("disabled");
                } else {
                    $('#ddlType').prop("value", "0");

                    $('#btnAccSearch').attr("disabled", "disabled");
                    $('#txtCashAccount').attr("disabled", "disabled");

                }
                btnAccSearch.disabled = true;
                txtCashAccount.disabled = true;
                $('#divCreationPanel').removeClass("display_none");

                $('#btnCustomerSrch').attr("disabled", "disabled");
                $('#ddlType').attr("disabled", "disabled");



            }

            CountGrid = SlsInvoiceItemsDetails.length;
            CountItems = SlsInvoiceItemsDetails.length;

            // btnInvoiceSearch.disabled = true; 
            txtInvoiceDate.disabled = true;
            //ddlInvoiceCustomer.disabled = true;
            //ddlType.disabled = true;
            ComputeTotals();


        }
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
    //------------------------------------------------------ main Functions  Region------------------------
    function Assign() {
        var StatusFlag: String;
        MasterDetailsModel = new ServSlsInvoiceMasterDetails();
        InvoiceModel = new AVAT_TR_SlsInvoice();
        InvoiceItemsDetailsModel = new Array<AVAT_TR_SlsInvoiceItem>();
        InvoiceModel.CustomerId = CustomerId;
        InvoiceModel.CompCode = Number(compcode);
        InvoiceModel.BranchCode = Number(BranchCode);
        InvoiceModel.InvoiceCurrenyID = Currency;
        InvoiceModel.BankAccount = txtCashAccount.value;
        InvoiceModel.RoundingAmount = Number(txtDiscountValue.value);
        InvoiceModel.TrNo = Number(txtReturnNumber.value);
        InvoiceModel.VoucherNo = Number($('#txtVoucherNo').val());


        MasterDetailsModel.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
        MasterDetailsModel.UserCode = SysSession.CurrentEnvironment.UserCode;
        MasterDetailsModel.CompName = SysSession.CurrentEnvironment.CompanyNameAr;
        MasterDetailsModel.VatNo = SysSession.CurrentEnvironment.VatNo;

        InvoiceModel.TrType = 1//0 invoice 1 return
        InvoiceModel.SlsInvSrc = 1   // 1 from store 2 from van 
        InvoiceModel.SlsInvType = 1//  retail 
        InvoiceModel.RefTrID = GlobalinvoiceID;
        ///////////////

        InvoiceModel.NetAfterVat = NetCount;
        InvoiceModel.TotalAmount = Number(txtTotal.value);
        InvoiceModel.TrDate = txtInvoiceDate.value;
        InvoiceModel.VatType = vatType;
        InvoiceModel.VatAmount = Number(txtTax.value);
        //InvoiceModel.DiscountPrc = Number(txtDiscountPrcnt.value);

        InvoiceModel.TaxCurrencyID = Number(SysSession.CurrentEnvironment.I_Control[0].Currencyid);
        InvoiceModel.InvoiceCurrenyID = Number(SysSession.CurrentEnvironment.I_Control[0].Currencyid);
        InvoiceModel.InvoiceTypeCode = Number(SysSession.CurrentEnvironment.InvoiceTypeCode);
        InvoiceModel.InvoiceTransCode = Number(SysSession.CurrentEnvironment.InvoiceTransCode);


        InvoiceModel.ContractNo = $('#txtContractNo').val();
        InvoiceModel.PurchaseorderNo = $('#txtPurchaseorderNo').val();
        InvoiceModel.DeliveryDate = $('#txtDeliveryDate').val();
        InvoiceModel.DeliveryEndDate = $('#txtDeliveryEndDate').val();
        InvoiceModel.Remark = $('#txt_Remarks').val();
        InvoiceModel.TaxNotes = '';


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
                invoiceItemSingleModel.ItemID = $("#ddlItem" + i).val();
                var SerObj = ServicesDetails.filter(s => s.Itemid == invoiceItemSingleModel.ItemID);
                invoiceItemSingleModel.UomID = SerObj[0].UomID;
                invoiceItemSingleModel.CC_CODE = $("#ddlCostCenter" + i).val();
                invoiceItemSingleModel.Serial = $("#txtSerial" + i).val();
                let SoldQty = Number($("#txtReturnQuantity" + i).val());
                //let TotRetQty = Number($("#txtQuantity" + i).val());
                invoiceItemSingleModel.InvoiceSoldQty = Number($("#txtQuantity" + i).val());
                invoiceItemSingleModel.SoldQty = $('#txtReturnQuantity' + i).val();
                //invoiceItemSingleModel.TotRetQty = $("#txtQuantity" + i).val();
                //invoiceItemSingleModel.NetUnitPrice = $("#txtPrice" + i).val();
                invoiceItemSingleModel.Unitprice = $("#txtPrice" + i).val();
                VatPrc = $("#txtTax_Rate" + i).val();
                let VatNatID = Number($("#txtTax_Rate" + i).attr('data-VatNatID'));
                invoiceItemSingleModel.VatPrc = VatPrc;
                invoiceItemSingleModel.VatApplied = VatPrc;
                invoiceItemSingleModel.VatNatID = VatNatID;


                var itemcode = $("#txtServicCode" + i).val();
                var itemobj = ServicesDetails.filter(s => s.ItemCode == itemcode)
                invoiceItemSingleModel.ItemID = itemobj[0].Itemid;
                var catID = itemobj[0].SrvCategoryID;
                var catObj = CategorDetails.filter(s => s.SrvCategoryID == catID);
                invoiceItemSingleModel.VatNatID = catObj[0].VatNatID;
 

                invoiceItemSingleModel.VatAmount = $("#txtTax" + i).val();
                invoiceItemSingleModel.ItemNetAmount = $("#txtTotAfterTax" + i).val();
                invoiceItemSingleModel.ItemTotal = invoiceItemSingleModel.Unitprice * invoiceItemSingleModel.SoldQty;
                invoiceItemSingleModel.DiscountPrc = $("#txtDiscountPrc" + i).val();
                invoiceItemSingleModel.DiscountAmount = $("#txtDiscountAmount" + i).val();
                invoiceItemSingleModel.NetUnitPrice = $("#txtNetUnitPrice" + i).val();
                //invoiceItemSingleModel.Remarks = $("#txtRemarks" + i).val();
                invoiceItemSingleModel.StatusFlag = StatusFlag.toString();
                if (invoiceItemSingleModel.SoldQty > 0) {
                    InvoiceItemsDetailsModel.push(invoiceItemSingleModel);
                }
            }
            if (StatusFlag == "u") {
                var invoiceItemId = $("#InvoiceItemID" + i).val()
                invoiceItemSingleModel.InvoiceItemID = invoiceItemId;
                invoiceItemSingleModel.ItemID = $("#ddlItem" + i).val();
                var SerObj = ServicesDetails.filter(s => s.Itemid == invoiceItemSingleModel.ItemID);
                invoiceItemSingleModel.UomID = SerObj[0].UomID;
                invoiceItemSingleModel.CC_CODE = $("#ddlCostCenter" + i).val();
                invoiceItemSingleModel.Serial = $("#txtSerial" + i).val();
                invoiceItemSingleModel.StatusFlag = StatusFlag.toString();
                let SoldQty = Number($("#txtReturnQuantity" + i).val());
                let TotRetQty = Number($("#txtQuantity" + i).val());
                invoiceItemSingleModel.InvoiceSoldQty = (TotRetQty - SoldQty);
                invoiceItemSingleModel.SoldQty = $('#txtReturnQuantity' + i).val();
                //invoiceItemSingleModel.TotRetQty = $("#txtQuantity" + i).val(); 
                //invoiceItemSingleModel.NetUnitPrice = $("#txtPrice" + i).val();
                invoiceItemSingleModel.Unitprice = $("#txtPrice" + i).val();
                VatPrc = $("#txtTax_Rate" + i).val();
                let VatNatID = Number($("#txtTax_Rate" + i).attr('data-VatNatID'));
                invoiceItemSingleModel.VatPrc = VatPrc;
                invoiceItemSingleModel.VatApplied = VatPrc;
                var itemcode = $("#txtServicCode" + i).val();
                var itemobj = ServicesDetails.filter(s => s.ItemCode == itemcode)
                invoiceItemSingleModel.ItemID = itemobj[0].Itemid;
                var catID = itemobj[0].SrvCategoryID;
                var catObj = CategorDetails.filter(s => s.SrvCategoryID == catID);
                invoiceItemSingleModel.VatNatID = catObj[0].VatNatID;                invoiceItemSingleModel.ItemNetAmount = $("#txtTotAfterTax" + i).val();
                invoiceItemSingleModel.ItemTotal = invoiceItemSingleModel.Unitprice * invoiceItemSingleModel.SoldQty;
                invoiceItemSingleModel.DiscountPrc = $("#txtDiscountPrc" + i).val();
                invoiceItemSingleModel.DiscountAmount = $("#txtDiscountAmount" + i).val();
                invoiceItemSingleModel.NetUnitPrice = $("#txtNetUnitPrice" + i).val();
                //invoiceItemSingleModel.Remarks = $("#txtRemarks" + i).val();
                invoiceItemSingleModel.VatAmount = invoiceItemSingleModel.ItemTotal * invoiceItemSingleModel.VatPrc / 100;
                invoiceItemSingleModel.NetAfterVat = invoiceItemSingleModel.ItemTotal + invoiceItemSingleModel.VatAmount;
                if (invoiceItemSingleModel.SoldQty > 0) {
                    InvoiceItemsDetailsModel.push(invoiceItemSingleModel);
                }

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
        MasterDetailsModel.MODULE_CODE = Modules.Ser_Return_Sales;
        MasterDetailsModel.UserCode = SysSession.CurrentEnvironment.UserCode;
        MasterDetailsModel.sec_FinYear = SysSession.CurrentEnvironment.CurrentYear;

    }
    function Update() {

        InvoiceModel.InvoiceID = GlobalReturnID;
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
            url: sys.apiUrl("ServTrSales", "updateRetInvoiceMasterDetail"),
            data: JSON.stringify(MasterDetailsModel),
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess == true) {

                    let res = result.Response as AVAT_TR_SlsInvoice;
                    DisplayMassage('( تم تعديل المرتجع بنجاح )', '(The return has been successfully modified)', MessageType.Succeed);
                    $("#cotrolDiv").removeClass("disabledDiv");
                    $('#divCreationPanel').removeClass("display_none");
                    $('#txtUpdatedBy').prop("value", res.UpdatedBy);
                    $('#txtUpdatedAt').prop("value", res.UpdatedAt);
                    GlobalReturnID = res.InvoiceID;
                    FlagAfterInsertOrUpdate = true;
                    InitializeGrid();
                    Grid_RowDoubleClicked();
                    FlagAfterInsertOrUpdate = false;
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
            url: sys.apiUrl("ServTrSales", "InsertRetInvoiceMasterDetail"),
            data: JSON.stringify(MasterDetailsModel),
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess == true) {
                    //debugger
                    let res = result.Response as AVAT_TR_SlsInvoice;
                    GlobalReturnID = res.InvoiceID;
                    CustomerId = 0

                    FlagAfterInsertOrUpdate = true;

                    InitializeGrid();
                    Grid_RowDoubleClicked();
                    FlagAfterInsertOrUpdate = false;
                    DisplayMassage(" تم اصدار  مرتجع رقم  " + res.TrNo + " ", "An return number has been issued ", MessageType.Succeed);
                    $("#cotrolDiv").removeClass("disabledDiv");
                    $("#btnInvoiceSearch").attr("disabled", "disabled");
                    DownloadInvoicePdf();
                    Save_Succ_But();
                } else {
                    DisplayMassage("الرجاء تحديث الصفحة واعادت تكرارالمحاولة مره اخري", "Please refresh the page and try again", MessageType.Error);
                }
            }
        });

    }
    function openInvoice() {
        Assign();
        InvoiceModel.InvoiceID = GlobalReturnID;
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
            url: sys.apiUrl("ServTrSales", "OpenRetSrvSlsInv"),
            data: JSON.stringify(MasterDetailsModel),
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess == true) {
                    btnUpdate.disabled = false;
                    DisplayMassage(' تم فك الاعتماد بنجاح ', 'Deaccredited successfully', MessageType.Succeed);
                    let res = result.Response as AVAT_TR_SlsInvoice;
                    $("#cotrolDiv").removeClass("disabledDiv");
                    GlobalReturnID = res.InvoiceID;
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
        //
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
        rp.TrType = 1;    //---------------------------------slsinvoice  RETURN
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
    function PrintTransaction() {
        if (!SysSession.CurrentPrivileges.PrintOut) return;

        let rp: ReportParameters = new ReportParameters();
        
        rp.Type = 4;
        rp.Repdesign = 0;
        rp.TRId = GlobalReturnID;
        rp.slip = 0;
        rp.TrType = 1;                                                    
            rp.Name_function = "IProc_Prnt_VATSlsInvoice";
            localStorage.setItem("Report_Data", JSON.stringify(rp));

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
        rp.Type = 4;
        rp.Repdesign = 0;
        rp.Typ = 0;
        rp.slip = 1;
        rp.TRId = GlobalReturnID;
        rp.TrType = 1;
        Ajax.CallAsync({
            url: Url.Action("IProc_Prnt_VATSlsInvoice", "GeneralReports"),
            data: rp,
            success: (d) => {
                let result = d.result as string;
                window.open(result, "_blank");
            }
        })

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
        rp.DocPDFFolder = SysSession.CurrentEnvironment.I_Control[0].DocPDFFolder;


        rp.BraNameA = SysSession.CurrentEnvironment.BranchName;
        rp.BraNameE = SysSession.CurrentEnvironment.BranchName;
        if (rp.BraNameA == null || rp.BraNameE == null) {

            rp.BraNameA = " ";
            rp.BraNameE = " ";
        }

        rp.TRId = GlobalReturnID;
        rp.slip = 0;
        rp.TrType = 1;

        Ajax.CallAsync({
            url: Url.Action("IProc_Prnt_VATSlsInvoice", "Reports_pdf"),
            data: rp,
            success: (d) => {

            }
        })
    }

}