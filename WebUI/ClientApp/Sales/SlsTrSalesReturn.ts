$(document).ready(() => {

    SlsTrSalesReturn.InitalizeComponent();
})
namespace SlsTrSalesReturn {
    //system varables
    var SysSession: SystemSession = GetSystemSession(Modules.SlsTrReturn);
    var compcode: Number;
    var BranchCode: number;
    var sys: SystemTools = new SystemTools();
    var vatType: number;
    var Finyear: number;
    //ddl
    var ddlCustomer: HTMLSelectElement;
    var ddlSalesMan: HTMLSelectElement;
    var ddlStateType: HTMLSelectElement;
    var ddlInvoiceCustomer: HTMLSelectElement;
    var ddlFreeSalesman: HTMLSelectElement;
    var ddlSalesPerson: HTMLSelectElement;
    var ddlReturnType: HTMLSelectElement;
    var ddlReturnTypeShow: HTMLSelectElement;
    var ddlShowFreeReturn: HTMLSelectElement;
    var ddlCashBox: HTMLSelectElement;
    var ddlTaxTypeHeader: HTMLSelectElement;
    var searchbutmemreport: HTMLInputElement;
    var txtRefNo: HTMLInputElement;
    var txtRemarks: HTMLInputElement;
    // Arrays
    var VendorDetails: Array<A_Rec_D_Customer> = new Array<A_Rec_D_Customer>();
    var AddReturnDetailsAr: Array<string> = new Array<string>();
    var AddReturnDetailsEn: Array<string> = new Array<string>();
    var StateDetailsAr: Array<string> = new Array<string>();
    var StateDetailsEn: Array<string> = new Array<string>();
    var SlsInvoiceStatisticsDetails: Array<IQ_GetSlsInvoiceStatisticVer2> = new Array<IQ_GetSlsInvoiceStatisticVer2>();
    var SearchDetails: Array<IQ_GetSlsInvoiceStatisticVer2> = new Array<IQ_GetSlsInvoiceStatisticVer2>();
    var SlsInvoiceItemsDetails: Array<IQ_GetSlsInvoiceItem> = new Array<IQ_GetSlsInvoiceItem>();
    var Selecteditem: Array<IQ_GetSlsInvoiceStatisticVer2> = new Array<IQ_GetSlsInvoiceStatisticVer2>();
    var FamilyDetails: Array<I_ItemFamily> = new Array<I_ItemFamily>();
    var ItemDetails: Array<IQ_GetItemStoreInfo> = new Array<IQ_GetItemStoreInfo>();
    var AD_VatTypeDetails: A_D_VAT_TYPE = new A_D_VAT_TYPE();
    var SalesmanDetails: Array<I_Sls_D_Salesman> = new Array<I_Sls_D_Salesman>();
    var cashboxDetails: Array<A_RecPay_D_CashBox> = new Array<A_RecPay_D_CashBox>();
    var VatDetails: Array<A_D_VAT_TYPE> = new Array<A_D_VAT_TYPE>();
    var ItemFamilyDetails: Array<IQ_GetItemStoreInfo> = new Array<IQ_GetItemStoreInfo>();
    //Model
    var InvoiceStatisticsModel: Array<IQ_GetSlsInvoiceStatisticVer2> = new Array<IQ_GetSlsInvoiceStatisticVer2>();
    var InvoicemodelForReturn: Array<IQ_GetSlsInvoiceStatisticVer2> = new Array<IQ_GetSlsInvoiceStatisticVer2>();
    var MasterDetailModel: SlsInvoiceMasterDetails = new SlsInvoiceMasterDetails();
    var InvoiceModel: I_Sls_TR_Invoice = new I_Sls_TR_Invoice();
    var invoiceItemsModel: Array<I_Sls_TR_InvoiceItems> = new Array<I_Sls_TR_InvoiceItems>();
    var invoiceItemSingleModel: I_Sls_TR_InvoiceItems = new I_Sls_TR_InvoiceItems();
    var Tax_Type_Model: Tax_Type = new Tax_Type();

    //TextBoxes
    var txtStartDate: HTMLInputElement;
    var txtEndDate: HTMLInputElement;
    var txtItemCount: HTMLInputElement;
    var txtPackageCount: HTMLInputElement;
    var txtTotalbefore: HTMLInputElement;
    var txtTotalDiscount: HTMLInputElement;
    var txtTotal: HTMLInputElement;
    var txtTax: HTMLInputElement;
    var txtNet: HTMLInputElement;
    var txtCashAmount: HTMLInputElement;
    var txtInvoiceDate: HTMLInputElement;
    var txtInvoiceNumber: HTMLInputElement;
    var lblReturnNumber: HTMLInputElement;


    //checkbox
    var chkActive: HTMLInputElement;

    //buttons 
    var btnShow: HTMLButtonElement;
    var btnAdd: HTMLButtonElement;
    var btnBack: HTMLButtonElement;// btnBack btnSave
    var btnSave: HTMLButtonElement;
    var btnInvoiceSearch: HTMLButtonElement;
    var btnUpdate: HTMLButtonElement;
    //print buttons 
    var btnPrintTrview: HTMLButtonElement;
    var btnPrintTrPDF: HTMLButtonElement;
    var btnPrintTrEXEL: HTMLButtonElement;
    var btnPrintTransaction: HTMLButtonElement;
    var btnPrintsFrom_To: HTMLButtonElement;

    // giedView
    var Grid: JsGrid = new JsGrid();


    //global
    var CountGrid = 0;
    var CountItems: number = 0;
    var PackageCount: number = 0;
    var CountTotal: number = 0;
    var TaxCount: number = 0;
    var NetCount: number = 0;
    var Tax_Rate: number = 0;
    var VatPrc;
    var globalInvoiceID: number = 0;
    var globalRefTrID: number = 0;
    var StoreID;
    var GlobalReturnID: number = 0;
    var GlobalDocNo: string = "";
    //flags
    var Show: boolean = true;
    var EditFlag: boolean = false;
    var InsertFlag: boolean = false;
    var btnPrint: HTMLInputElement;
    var AfterInsertOrUpdateFlag: boolean = false;
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);
    var flag_PriceWithVAT = (SysSession.CurrentEnvironment.I_Control[0].SalesPriceWithVAT);

    //------------------------------------------------------ Main Region -----------------------------------
    export function InitalizeComponent() {
        // VatPrc
        ////debugger
        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = "مرتجع فواتير";
        }
        else {
            document.getElementById('Screen_name').innerHTML = " Invoice Return";
        }
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);
        Finyear = Number(SysSession.CurrentEnvironment.CurrentYear);
        InitalizeControls();
        InitializeEvents();
        fillddlCustomer();
        FillddlSalesMan();
        FillddlFamily();
        fillddlFreeSalesman();
        FillddlStateType();
        FillddlReturnType();
        FillddlReturnTypeShow();
        fillddlCashBox();
        FillddlTaxType();
        vatType = SysSession.CurrentEnvironment.I_Control[0].DefSlsVatType;
        //GetVatPercentage();
        $('#ddlStateType').prop("value", "2");
        $('#ddlReturnType').prop("value", "2");
        $('#ddlShowFreeReturn').prop("value", "2");
        txtItemCount.value = CountItems.toString();
        txtPackageCount.value = PackageCount.toString();
        txtTotal.value = CountTotal.toString();
        txtTax.value = TaxCount.toString();
        txtNet.value = NetCount.toString();
        GetAllIItem();

        txtStartDate.value = DateStartMonth();
        txtEndDate.value = ConvertToDateDash(GetDate()) <= ConvertToDateDash(SysSession.CurrentEnvironment.EndDate) ? GetDate() : SysSession.CurrentEnvironment.EndDate;


        SysSession.CurrentEnvironment.I_Control[0].IvoiceDateEditable == true ? $('#txtInvoiceDate').removeAttr("disabled") : $('#txtInvoiceDate').attr("disabled", "disabled");
        $('#btnPrint').addClass('display_none');

        InitializeGrid();
    }
    function InitalizeControls() {

        // Drop down lists
        ddlCustomer = document.getElementById("ddlCustomer") as HTMLSelectElement;
        ddlSalesMan = document.getElementById("ddlSalesMan") as HTMLSelectElement;
        ddlStateType = document.getElementById("ddlStateType") as HTMLSelectElement;
        ddlReturnType = document.getElementById("ddlReturnType") as HTMLSelectElement;
        ddlReturnTypeShow = document.getElementById("ddlReturnTypeShow") as HTMLSelectElement;
        ddlInvoiceCustomer = document.getElementById("ddlInvoiceCustomer") as HTMLSelectElement;
        ddlFreeSalesman = document.getElementById("ddlFreeSalesman") as HTMLSelectElement;
        ddlSalesPerson = document.getElementById("ddlSalesPerson") as HTMLSelectElement;
        ddlShowFreeReturn = document.getElementById("ddlShowFreeReturn") as HTMLSelectElement;
        ddlCashBox = document.getElementById("ddlCashBox") as HTMLSelectElement;
        ddlTaxTypeHeader = document.getElementById("ddlTaxTypeHeader") as HTMLSelectElement;
        txtRefNo = document.getElementById("txtRefNo") as HTMLInputElement;
        txtRemarks = document.getElementById("txtRemarks") as HTMLInputElement;
        //TextBoxes
        searchbutmemreport = document.getElementById("searchbutmemreport") as HTMLInputElement;
        txtStartDate = document.getElementById("txtStartDate") as HTMLInputElement;
        txtEndDate = document.getElementById("txtEndDate") as HTMLInputElement;
        txtItemCount = document.getElementById("txtItemCount") as HTMLInputElement;
        txtPackageCount = document.getElementById("txtPackageCount") as HTMLInputElement;
        txtTotalDiscount = document.getElementById("txtTotalDiscount") as HTMLInputElement;
        txtTotalbefore = document.getElementById("txtTotalbefore") as HTMLInputElement;
        txtTotal = document.getElementById("txtTotal") as HTMLInputElement;
        txtTax = document.getElementById("txtTax") as HTMLInputElement;
        txtNet = document.getElementById("txtNet") as HTMLInputElement;
        txtInvoiceDate = document.getElementById("txtInvoiceDate") as HTMLInputElement;
        txtInvoiceNumber = document.getElementById("txtInvoiceNumber") as HTMLInputElement;
        lblReturnNumber = document.getElementById("lblReturnNumber") as HTMLInputElement;
        txtCashAmount = document.getElementById("txtCashAmount") as HTMLInputElement;


        //checkbox
        chkActive = document.getElementById("chkActive") as HTMLInputElement;

        //button
        btnShow = document.getElementById("btnShow") as HTMLButtonElement;
        btnAdd = document.getElementById("btnAdd") as HTMLButtonElement;
        btnBack = document.getElementById("btnBack") as HTMLButtonElement;
        btnSave = document.getElementById("btnSave") as HTMLButtonElement;
        btnInvoiceSearch = document.getElementById("btnInvoiceSearch") as HTMLButtonElement;
        btnUpdate = document.getElementById("btnUpdate") as HTMLButtonElement;
        //print 
        btnPrintTrview = document.getElementById("btnPrintTrview") as HTMLButtonElement;
        btnPrintTrPDF = document.getElementById("btnPrintTrPDF") as HTMLButtonElement;
        btnPrintTrEXEL = document.getElementById("btnPrintTrEXEL") as HTMLButtonElement;
        btnPrintTransaction = document.getElementById("btnPrintTransaction") as HTMLButtonElement;
        btnPrintsFrom_To = document.getElementById("btnPrintsFrom_To") as HTMLButtonElement;
        btnPrint = document.getElementById("btnPrint") as HTMLInputElement;
    }
    function InitializeEvents() {
        chkActive.onclick = chkActive_onchecked;
        btnShow.onclick = btnShow_onclick;
        btnAdd.onclick = AddNewReturn_onclick;
        btnBack.onclick = btnBack_onclick;
        btnSave.onclick = btnSave_onclick;
        txtInvoiceNumber.onchange = txtInvoiceNumber_onchange;
        btnInvoiceSearch.onclick = btnInvoiceSearch_onclick;
        btnUpdate.onclick = btnUpdate_onclick;
        ddlInvoiceCustomer.onchange = ddlInvoiceCustomer_onchange;
        ddlReturnTypeShow.onchange = ddlReturnTypeShow_onchange;
        ddlCustomer.onchange = ddlCustomer_onchange;
        //print
        btnPrintTrview.onclick = () => { PrintReport(1); }
        btnPrintTrPDF.onclick = () => { PrintReport(2); }
        btnPrintTrEXEL.onclick = () => { PrintReport(3); }
        //btnPrint.onclick = () => { PrintReport(4); }
        btnPrintTransaction.onclick = PrintTransaction;
        btnPrintsFrom_To.onclick = btnPrintsFrom_To_onclick;
        searchbutmemreport.onkeyup = _SearchBox_Change;
    }
    function Check_on_user_type() {

        if (SysSession.CurrentEnvironment.UserType == 1 || SysSession.CurrentEnvironment.UserType == 3) { //Salesman

            let SalesId = SysSession.CurrentEnvironment.SalesManID;
            SalesmanDetails = SalesmanDetails.filter(s => s.SalesmanId == SalesId);

        }

    }
    //------------------------------------------------------ Events Region -----------------------------------
    function ddlCustomer_onchange() {
        var customerID = Number(ddlCustomer.value);
        var custObj = VendorDetails.filter(s => s.CustomerId == customerID);
        FillddlSalesMan();

        if (SysSession.CurrentEnvironment.UserType != 1 && SysSession.CurrentEnvironment.UserType == 3) {
            ddlSalesMan.value = custObj[0].SalesmanId.toString();

        }

    }
    function ddlInvoiceCustomer_onchange() {
        var customerID = Number(ddlInvoiceCustomer.value);
        var custObj = VendorDetails.filter(s => s.CustomerId == customerID);
        fillddlFreeSalesman();

        if (lang == "ar")
            $("#txtCustomerName").prop("value", custObj[0].NAMEA);
        else
            $("#txtCustomerName").prop("value", custObj[0].NAMEE);

        ddlFreeSalesman.value = custObj[0].SalesmanId.toString();

    }
    function ddlReturnTypeShow_onchange() {

        if (ddlReturnTypeShow.value == "1") {
            $("#DivCashBox1").removeClass("display_none");
            $("#DivCashBox2").removeClass("display_none");
            $("#txtCashAmount").prop("value", "");
            fillddlCashBox();
            var cashCustomers = VendorDetails.filter(s => s.IsCreditCustomer == false)
            if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                DocumentActions.FillCombowithdefult(cashCustomers, ddlInvoiceCustomer, "CustomerId", "NAMEE", "Select customer");
            }
            else {
                DocumentActions.FillCombowithdefult(cashCustomers, ddlInvoiceCustomer, "CustomerId", "NAMEA", "اختر العميل");
            }


        }
        else if (ddlReturnTypeShow.value == "0") {
            $("#DivCashBox1").addClass("display_none");
            $("#DivCashBox2").addClass("display_none");
            $("#txtCashAmount").prop("value", "");

            var creditCustomers = VendorDetails.filter(s => s.IsCreditCustomer == true);
            if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                DocumentActions.FillCombowithdefult(creditCustomers, ddlInvoiceCustomer, "CustomerId", "NAMEE", "Select customer");
            }
            else {
                DocumentActions.FillCombowithdefult(creditCustomers, ddlInvoiceCustomer, "CustomerId", "NAMEA", "اختر العميل");
            }
        }
    }
    function txtInvoiceNumber_onchange() {
        $('#div_Data').html("");

        txtItemCount.value = "";
        txtPackageCount.value = "";
        txtTotal.value = "";
        txtTax.value = "";
        txtNet.value = "";

        lblReturnNumber.value = "";
        txtInvoiceDate.value = "";
        ddlInvoiceCustomer.value = "null";
        ddlReturnTypeShow.value = "0";
        ddlFreeSalesman.value = "null";
        // ddlSalesPerson.value = "null";

        $('#txtCreatedBy').prop("value", "");
        $('#txtCreatedAt').prop("value", "");

        $('#txtUpdatedBy').prop("value", "");
        $('#txtUpdatedAt').prop("value", "");

        $("#divReturnDetails").removeClass("display_none");
      
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("SlsTrSales", "GetSlsInvoiceByIDFromStatistics"),
            data: { invoiceID: globalRefTrID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    debugger
                    InvoiceStatisticsModel = result.Response as Array<IQ_GetSlsInvoiceStatisticVer2>;
                    txtInvoiceNumber.value = InvoiceStatisticsModel[0].TrNo.toString();
                    txtItemCount.value = InvoiceStatisticsModel[0].Line_Count.toString();
                    GlobalDocNo = InvoiceStatisticsModel[0].DocNo;
                    txtPackageCount.value = "0";
                    txtTotal.value = "0";
                    txtTax.value = "0";
                    txtNet.value = "0";

                    ddlTaxTypeHeader.value = InvoiceStatisticsModel[0].VatType.toString();
                    StoreID = InvoiceStatisticsModel[0].StoreId;
                    txtInvoiceDate.value = DateFormat(InvoiceStatisticsModel[0].TrDate.toString());
                    ddlCashBox.value = InvoiceStatisticsModel[0].CashBoxID == null ? 'null' : InvoiceStatisticsModel[0].CashBoxID.toString();
                    vatType = InvoiceStatisticsModel[0].VatType;
                    //GetVatPercentage();
                    $('#txtInvoiceCustomerName').val(InvoiceStatisticsModel[0].CustomerName);
                    ddlFreeSalesman.value = InvoiceStatisticsModel[0].SalesmanId.toString();
                    // ddlSalesPerson.value = InvoiceStatisticsModel[0].SalesPersonId.toString();
                    if (InvoiceStatisticsModel[0].CustomerId != null) {
                        ddlInvoiceCustomer.value = InvoiceStatisticsModel[0].CustomerId.toString();
                        var customerName = InvoiceStatisticsModel[0].Cus_NameA.toString();
                        $('#txtCustomerName').prop("value", customerName);
                    }
                    else {
                        var customerName = InvoiceStatisticsModel[0].CustomerName.toString();
                        $('#txtCustomerName').prop("value", customerName);
                    }

                    if (InvoiceStatisticsModel[0].Status == 1) {
                        chkActive.checked = true;
                    } else {
                        chkActive.checked = false;
                    }

                    if (InvoiceStatisticsModel[0].IsCash == true) {
                        $('#ddlReturnTypeShow').prop("value", 1);
                        $("#DivCashBox1").removeClass("display_none");
                        $("#DivCashBox2").removeClass("display_none");
                        $("#txtCashAmount").val("");

                    } else {
                        $('#ddlReturnTypeShow').prop("value", 0);
                        $("#DivCashBox1").addClass("display_none");
                        $("#DivCashBox2").addClass("display_none");

                        $("#txtCashAmount").val("");
                    }
                    $('#divCreationPanel').removeClass("display_none");

                    $('#txtCreatedBy').prop("value", SysSession.CurrentEnvironment.UserCode);
                    $('#txtCreatedAt').prop("value", GetDate().toString());

                    $('#txtUpdatedBy').prop("value", "");
                    $('#txtUpdatedAt').prop("value", "");
                }
            }
        });
        if (InvoiceStatisticsModel[0].InvoiceID != 0) {
            Ajax.Callsync({
                type: "Get",
                url: sys.apiUrl("SlsTrSales", "GetSlsInvoiceItem"),
                data: { invoiceID: globalRefTrID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
                success: (d) => {
                    let result = d as BaseResponse;
                    if (result.IsSuccess) {
                        SlsInvoiceItemsDetails = result.Response as Array<IQ_GetSlsInvoiceItem>;
                        var buildedRows: number = 0;
                        CountGrid = 0;
                        for (let i = 0; i < SlsInvoiceItemsDetails.length; i++) {

                            if ((SlsInvoiceItemsDetails[i].SoldQty - SlsInvoiceItemsDetails[i].TotRetQty) > 0) {
                                BuildControls(i);
                                $("#txtReturnQuantity" + i).prop("value", '0');
                                $("#txtTotal" + i).prop("value", 0);
                                $("#txtTax" + i).prop("value", 0);
                                $("#txtTotAfterTax" + i).prop("value", 0);
                                txtItemCount.value = '0';
                                txtPackageCount.value = '0';
                                txtTotal.value = '0';
                                txtTax.value = '0';
                                txtNet.value = '0';
                                Display_GridConrtol(i);
                                buildedRows++;
                            }
                            if (buildedRows == 0) {
                                txtInvoiceNumber.value = "";
                                DisplayMassage('( لا توجد اصناف علي هذه الفاتورة)', 'this invoice has no items', MessageType.Error);
                                btnInvoiceSearch.disabled = false;
                                clear();
                                return;
                            }

                            CountGrid++; 
                        } 
                        CountItems = CountGrid;

                        ComputeTotals();
                    }
                }
            });
        }
        SysSession.CurrentEnvironment.I_Control[0].IvoiceDateEditable == true ? $('#txtInvoiceDate').removeAttr("disabled") : $('#txtInvoiceDate').attr("disabled", "disabled");

    }
    function chkActive_onchecked() {

        if (txtRemarks.disabled == true) {
            openReturn();
            $('#btnPrintTransaction').removeClass("display_none");
        }
    }
    function chkPreivilegeToEditApprovedReturns() {
        try {


            if (InvoiceStatisticsModel[0].Status == 1) {
                chkActive.disabled = !SysSession.CurrentPrivileges.CUSTOM2;
                btnUpdate.disabled = true;
                chkActive.checked = true;
            }
            else {
                chkActive.disabled = true;
                chkActive.checked = false;
                btnUpdate.disabled = !SysSession.CurrentPrivileges.EDIT;
            }
        } catch (e) {

        }
    }
    function checkUnApprovedReturns(invoiceID: number) {
        let res = false;
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("SlsTrSales", "GetAllUnApprovedSlsReturnListByInvoiceID"),
            data: {
                invoiceID: invoiceID, CompCode: compcode, BranchCode: BranchCode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    if (result.Response != 0) {
                        res = true;
                    }
                }
            }
        });
        return res;
    }
    //------------------------------------------------------ buttons Region -----------------------------------
    function btnUpdate_onclick() {
        if (!SysSession.CurrentPrivileges.EDIT) return;
        EditFlag = true;
        InsertFlag = true;
        btnInvoiceSearch.disabled = true;
        $("#btnBack").removeClass("display_none");
        $("#btnSave").removeClass("display_none");
        $('#btnUpdate').addClass("display_none");
        $('#btnPrintTransaction').addClass("display_none");

        $("#ddlCashBox").removeAttr("disabled");
        $("#txtCashAmount").removeAttr("disabled");
        //$("#txtInvoiceDate").attr("disabled","disabled");

        $("#divGridDetails_View").addClass("disabledDiv");
        $("#divGridDetails_View").attr("disabled", "disabled").off('click');
        $("#searchbutmemreport").attr("disabled", "disabled").off('click');
        $("#divIconbar").addClass("disabledIconbar");
        $("#divIconbar").attr("disabled", "disabled").off('click');
        $("#cotrolDiv").addClass("disabledDiv");
        $("#cotrolDiv").attr("disabled", "disabled").off('click');

        $("#divShow").addClass("disabledDiv");
        $("#divShow").attr("disabled", "disabled").off('click');



        txtRemarks.disabled = false;
        txtRefNo.disabled = false;


        chkActive.disabled = !SysSession.CurrentPrivileges.CUSTOM1;

        for (let cnt = 0; cnt <= CountGrid; cnt++) {

            $("#txtReturnQuantity" + cnt).removeAttr("disabled");


            $('.btn-number3' + cnt).removeAttr("disabled");
            $('.input-number3' + cnt).removeAttr("disabled");
        }
        EditFlag = true;

        SysSession.CurrentEnvironment.I_Control[0].IvoiceDateEditable == true ? $('#txtInvoiceDate').removeAttr("disabled") : $('#txtInvoiceDate').attr("disabled", "disabled");
    }
    function btnInvoiceSearch_onclick() {
        debugger
        let sys: SystemTools = new SystemTools();

        sys.FindKey(Modules.SlsTrReturn, "btnInvoiceSearch", "CompCode=" + compcode + "and BranchCode = " + BranchCode + " and TrType = 0  and Status = 1 ", () => {
            let id = SearchGrid.SearchDataGrid.SelectedKey
            Show = false;
            globalRefTrID = id;
            btnInvoiceSearch.disabled = true;
            txtInvoiceNumber_onchange();
            btnAdd_onclick();
        });
    }
    function btnSave_onclick() {
        loading('btnsave');

        setTimeout(function () {

            finishSave('btnsave');
            btnInvoiceSearch.disabled = false;
            if (!ValidationHeader())
                return;

            Assign();
            if (EditFlag == true) {
                if (!SysSession.CurrentPrivileges.EDIT) return;

                for (let i = 0; i < CountGrid; i++) {
                    if (!ValidationGrid(i))
                        return
                }
                Update();
            }
            else {
                if (!SysSession.CurrentPrivileges.AddNew) return;

                if (invoiceItemsModel.length > 0) {
                    Insert();
                }
                else {
                    DisplayMassage('يجب أضافه قيمه للكمية المرتجعه ع الفاتورة', 'you must add value to the return quantity', MessageType.Error);
                    for (var i = 0; i < CountGrid; i++) {
                        if ($("#txt_StatusFlag" + i).val() != "d" && $("#txt_StatusFlag" + i).val() != "m") {
                            if (Number($("#txtReturnQuantity" + i).val()) == 0) {
                                Errorinput($("#txtReturnQuantity" + i));
                            }
                        }
                    }
                }
            }

        }, 100);
    }
    function btnBack_onclick() {
        if (InsertFlag == false) {

            $("#divReturnDetails").addClass("display_none");
            $("#btnBack").addClass("display_none");
            $("#btnSave").addClass("display_none");
            $('#btnPrintTransaction').addClass("display_none");
            $("#divGridDetails_View").removeClass("disabledDiv");
            $("#searchbutmemreport").removeAttr("disabled");
            $("#divIconbar").removeAttr("disabled");
            $("#divIconbar").removeClass("disabledIconbar");
            $("#chkActive").attr("disabled", "disabled");
            $("#cotrolDiv").removeAttr("disabled");
            $("#cotrolDiv").removeClass("disabledDiv");
            $("#divShow").removeAttr("disabled");
            $("#divShow").removeClass("disabledDiv");


        }
        else {

            $("#divIconbar").removeAttr("disabled")
            $("#divIconbar").removeClass("disabledIconbar");

            $("#cotrolDiv").removeAttr("disabled")
            $("#cotrolDiv").removeClass("disabledDiv");
            $("#divShow").removeAttr("disabled")
            $("#divShow").removeClass("disabledDiv");
            $('#condtionbtn1').removeClass("col-lg-10");
            $('#condtionbtn1').addClass("col-lg-8");
            $('#condtionbtn2').removeClass("col-lg-2");
            $('#condtionbtn2').addClass("col-lg-4");
            $("#divGridDetails_View").removeClass("disabledDiv");
            $("#searchbutmemreport").removeAttr("disabled");




            $("#txtCustomerName").attr("disabled", "disabled");
            $("#ddlFreeSalesman").attr("disabled", "disabled");
            // $("#ddlSalesPerson").attr("disabled", "disabled");

            $("#txtInvoiceDate").attr("disabled", "disabled");
            $("#btnUpdate").addClass("display_none");
            $('#btnPrint').removeClass("display_none");
            $("#btnSave").addClass("display_none");
            $('#btnPrintTransaction').removeClass("display_none");
            $('#btnBack').addClass("display_none");
            $('#btnUpdate').removeClass("display_none");
            globalInvoiceID = 0;
            globalRefTrID = 0;
            $("#ddlCashBox").attr("disabled", "disabled");
            $("#txtCashAmount").attr("disabled", "disabled");
            $("#btnInvoiceSearch").attr("disabled", "disabled");
            $("#txtInvoiceDate").attr("disabled", "disabled");
            $("#chkActive").attr("disabled", "disabled");

            try {
                if (InvoiceStatisticsModel[0].CashBoxID != null && InvoiceStatisticsModel[0].CashBoxID != 0) {
                    var BoxID = InvoiceStatisticsModel[0].CashBoxID.toString();
                    var cashAmount = InvoiceStatisticsModel[0].CashAmount.toString();
                    ddlCashBox.value = InvoiceStatisticsModel[0].CashBoxID.toString();
                    $("#txtCashAmount").prop("value", cashAmount);
                } else {
                    $("#txtCashAmount").val('');
                }
            } catch (e) {

            }


            $("#div_Data").html('');
            for (let i = 0; i < SlsInvoiceItemsDetails.length; i++) {
                BuildControls(i);
            }
            CountGrid = SlsInvoiceItemsDetails.length;
            CountItems = SlsInvoiceItemsDetails.length;

            txtInvoiceDate.value = DateFormat(InvoiceStatisticsModel[0].TrDate.toString());
            if (InvoiceStatisticsModel[0].Status == 1) { chkActive.checked = true; } else { chkActive.checked = false; }

        }
        txtRefNo.disabled = true;
        txtRemarks.disabled = true;
    }
    function btnShow_onclick() {

        BindStatisticGridData();
        $("#divShow").removeClass("display_none");
        $("#divReturnDetails").addClass("display_none");

        $("#divGridDetails_View").removeClass("disabledDiv");
        $("#searchbutmemreport").removeAttr("disabled");

        $("#ddlCustomer").removeAttr("disabled");
        $("#txtStartDate").removeAttr("disabled");
        $("#txtEndDate").removeAttr("disabled");
        $("#ddlSalesMan").removeAttr("disabled");
        $("#ddlReturnType").removeAttr("disabled");
        $("#ddlStateType").removeAttr("disabled");
    }
    function AddNewReturn_onclick() {
        if (!SysSession.CurrentPrivileges.AddNew) return;
        $("#searchbutmemreport").attr("disabled", "disabled").off('click');
        $("#divGridDetails_View").addClass("disabledDiv");
        $("#divGridDetails_View").attr("disabled", "disabled").off('click');
        $("#divIconbar").addClass("disabledIconbar");
        $("#divIconbar").attr("disabled", "disabled").off('click');

        $("#cotrolDiv").addClass("disabledDiv");
        $("#cotrolDiv").attr("disabled", "disabled").off('click');
        $("#divShow").addClass("disabledDiv");
        $("#divShow").attr("disabled", "disabled").off('click');


        $("#divShow").removeClass("display_none");
        btnInvoiceSearch.disabled = false;
        txtRefNo.disabled = false;
        txtRemarks.disabled = false;
        $("#divReturnDetails").removeClass("display_none");
        $("#btnBack").removeClass("display_none");
        $("#btnSave").removeClass("display_none");
        $("#btnUpdate").addClass("display_none");
        $("#btnPrintTransaction").addClass("display_none");
        $("#btnPrint").addClass("display_none");

        $('#div_Data').html("");
        txtItemCount.value = "";
        txtPackageCount.value = "";
        txtTotal.value = "";
        txtTax.value = "";
        txtNet.value = "";
        txtRefNo.value = "";
        txtRemarks.value = "";
        txtInvoiceNumber.value = "";

        lblReturnNumber.value = "";
        txtInvoiceDate.value = "";
        ddlInvoiceCustomer.value = "null";
        ddlReturnTypeShow.value = "0";
        ddlFreeSalesman.value = "null";
        // ddlSalesPerson.value = "null";
        txtCashAmount.value = "";
        ddlTaxTypeHeader.value = "null";
        $("#txtCustomerName").prop("value", "");


        $('#txtCreatedBy').prop("value", SysSession.CurrentEnvironment.UserCode);
        $('#txtCreatedAt').prop("value", DateTimeFormat(Date().toString()));

        $('#txtUpdatedBy').prop("value", "");
        $('#txtUpdatedAt').prop("value", "");
        chkActive.checked = true;
        chkActive.disabled = false;
        txtRemarks.disabled = false;
        txtRefNo.disabled = false;
        txtInvoiceDate.value = GetDate();

        fillddlCashBox();
        $("#ddlFreeSalesman").attr("disabled", "disabled");
        // $("#ddlSalesPerson").attr("disabled", "disabled");


        InsertFlag = false;
        EditFlag = false;
        SysSession.CurrentEnvironment.I_Control[0].IvoiceDateEditable == true ? $('#txtInvoiceDate').removeAttr("disabled") : $('#txtInvoiceDate').attr("disabled", "disabled");


    }
    function btnAdd_onclick() {
        if (!SysSession.CurrentPrivileges.AddNew) return;
        txtInvoiceDate.value = GetDate();
        var unApprovedReturn: boolean = false;
        lblReturnNumber.value = "";

        unApprovedReturn = checkUnApprovedReturns(globalRefTrID);
        if (unApprovedReturn == true) {
            DisplayMassage('لا يمكن اضافه مرتجع علي الفاتورة قبل اعتماد المرتجعات السابقه', 'you cannot add new return on invoice before approve previous one ', MessageType.Error);

        } else {
            Show = false;
            $("#btnBack").removeClass("display_none");
            $("#btnSave").removeClass("display_none");
            $("#btnPrint").addClass("display_none");
            $('#btnUpdate').addClass("display_none");

            for (let i = 0; i < CountGrid; i++) {
                $("#txtReturnQuantity" + i).removeAttr("disabled");

                $('.btn-number3' + i).removeAttr("disabled");
                $('.input-number3' + i).removeAttr("disabled");

            }
            $("#ddlInvoiceCustomer").attr("disabled", "disabled");
            $("#ddlReturnTypeShow").attr("disabled", "disabled");
            $("#ddlFreeSalesman").attr("disabled", "disabled");
            // $("#ddlSalesPerson").attr("disabled", "disabled");
            $("#ddlReturnTypeShow").attr("disabled", "disabled");
            $("#txtCustomerName").attr("disabled", "disabled");

            $("#txtInvoiceDate").removeAttr("disabled");
            $("#ddlCashBox").removeAttr("disabled");
            $("#txtCashAmount").removeAttr("disabled");
            txtRemarks.disabled = false;
            txtRefNo.disabled = false;
            SysSession.CurrentEnvironment.I_Control[0].IvoiceDateEditable == true ? $('#txtInvoiceDate').removeAttr("disabled") : $('#txtInvoiceDate').attr("disabled", "disabled");

        }
    }
    //------------------------------------------------------ ddl Region -----------------------------------
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
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
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
    function FillddlSalesMan() {
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

                    Check_on_user_type();

                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                        DocumentActions.FillCombowithdefult(SalesmanDetails, ddlSalesMan, "SalesmanId", "NameE", "Select salesman");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(SalesmanDetails, ddlSalesMan, "SalesmanId", "NameA", "اختر المندوب");
                    }


                    SysSession.CurrentEnvironment.UserType == 1 || SysSession.CurrentEnvironment.UserType == 3 ? ($('#ddlSalesMan option[value="null"]').remove()) : $('#ddlSalesMan').prop('selectedIndex', 0);

                }
            }
        });
    }
    function fillddlCashBox() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefBox", "GetAll"),
            data: {
                compCode: compcode, BranchCode: BranchCode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token, ModuleCode: Modules.SlsTrReturn, FinYear: SysSession.CurrentEnvironment.CurrentYear
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {

                    cashboxDetails = result.Response as Array<A_RecPay_D_CashBox>;
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                        DocumentActions.FillCombowithdefult(cashboxDetails, ddlCashBox, "CashBoxID", "CashBox_DescE", "Select CashBox");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(cashboxDetails, ddlCashBox, "CashBoxID", "CashBox_DescA", "اختر الصندوق");
                    }
                }
            }
        });
    }
    function fillddlFreeSalesman() {
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


                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                        DocumentActions.FillCombowithdefult(SalesmanDetails, ddlFreeSalesman, "SalesmanId", "NameE", "Select salesman");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(SalesmanDetails, ddlFreeSalesman, "SalesmanId", "NameA", "اختر المندوب");
                    }

                    //if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                    //    DocumentActions.FillCombowithdefult(SalesmanDetails, ddlSalesPerson, "SalesmanId", "NameE", "Select salesman");
                    //}
                    //else {
                    //    DocumentActions.FillCombowithdefult(SalesmanDetails, ddlSalesPerson, "SalesmanId", "NameA", "اختر البائع");
                    //} 

                }
            }
        });
    }
    function FillddlStateType() {
        StateDetailsAr = [" غير معتمد", "معتمد", "الجميع"];
        StateDetailsEn = ["Not Approved", "Approved", "All"];

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
    function FillddlReturnType() {
        StateDetailsAr = ["علي الحساب ", "نقدي", "الجميع"];
        StateDetailsEn = ["Credit", "Cash", "All"];

        if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
            for (let i = 0; i < StateDetailsEn.length; i++) {
                let newoption = document.createElement("option");
                newoption.value = i.toString();
                newoption.text = StateDetailsEn[i];
                ddlReturnType.options.add(newoption);

            }
        }
        else {
            for (let i = 0; i < StateDetailsAr.length; i++) {
                let newoption = document.createElement("option");
                newoption.value = i.toString();
                newoption.text = StateDetailsAr[i];
                ddlReturnType.options.add(newoption);
            }
        }
    }
    function FillddlReturnTypeShow() {
        AddReturnDetailsAr = ["علي الحساب ", "نقدي"];
        AddReturnDetailsEn = ["Credit", "Cash"];

        if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
            for (let i = 0; i < AddReturnDetailsEn.length; i++) {
                let newoption = document.createElement("option");
                newoption.value = i.toString();
                newoption.text = AddReturnDetailsEn[i];
                ddlReturnTypeShow.options.add(newoption);

            }
        }
        else {
            for (let i = 0; i < AddReturnDetailsAr.length; i++) {
                let newoption = document.createElement("option");
                newoption.value = i.toString();
                newoption.text = AddReturnDetailsAr[i];
                ddlReturnTypeShow.options.add(newoption);
            }
        }
    }
    function FillddlTaxType() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GenVatType", "GetAll"),
            data: {
                CompCode: compcode, VatType: 1, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {

                    VatDetails = result.Response as Array<A_D_VAT_TYPE>;
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                        DocumentActions.FillCombowithdefult(VatDetails, ddlTaxTypeHeader, "CODE", "DESCRIPTION", "Select vat");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(VatDetails, ddlTaxTypeHeader, "CODE", "DESCRIPTION", "اختر الضريبة");
                    }


                }
            }
        });
    }
    function FillddlFamily() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("StkDefItemType", "GetAll"),
            data: {
                CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    FamilyDetails = result.Response as Array<I_ItemFamily>;
                }
            }
        });
    }
    function FillddlItem(ItemFamilyID: number) {
        ItemDetails = ItemFamilyDetails.filter(x => x.ItemFamilyID == ItemFamilyID && x.StoreId == StoreID);


    }
    //------------------------------------------------------ Get Functions Region -----------------------------------
    function GetAllIItem() {

        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("StkDefItems", "GetAllItemWithoutOnhandQty"),
            data: {
                CompCode: compcode, FinYear: Finyear, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    ItemFamilyDetails = result.Response as Array<IQ_GetItemStoreInfo>;
                }
            }
        });
    }
    function _SearchBox_Change() {

        if (searchbutmemreport.value != "") {
            //debugger
            let search: string = searchbutmemreport.value.toLowerCase();
            SearchDetails = SlsInvoiceStatisticsDetails.filter(x => x.TrNo.toString().search(search) >= 0 || x.CustomerName.toLowerCase().search(search) >= 0
                || x.Slsm_DescA.toLowerCase().search(search) >= 0  );

            Grid.DataSource = SearchDetails;
            Grid.Bind();
        } else {
            Grid.DataSource = SlsInvoiceStatisticsDetails;
            Grid.Bind();
        }
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
    function GetInvoiceByID(invoiceID: number) {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("SlsTrSales", "GetSlsInvoiceByIDFromStatistics"),
            data: { invoiceID: invoiceID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    InvoicemodelForReturn = result.Response as Array<IQ_GetSlsInvoiceStatisticVer2>;
                    if (InvoicemodelForReturn.length > 0)
                        txtInvoiceNumber.value = InvoicemodelForReturn[0].TrNo.toString();
                }
            }
        });
    }
    //------------------------------------------------------ Normal Grid Region -----------------------------------
    function InitializeGrid() {
        let res: any = GetResourceList("");
        Grid.ElementName = "divGridDetails_View";
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
            { title: res, name: "InvoiceID", type: "text", width: "2%", visible: false },
            { title: res.App_Number, name: "TrNo", type: "text", width: "13%" },
            {
                title: res.App_date, css: "ColumPadding", name: "TrDate", width: "20%",
                itemTemplate: (s: string, item: IQ_GetSlsInvoiceStatisticVer2): HTMLLabelElement => {
                    let txt: HTMLLabelElement = document.createElement("label");
                    txt.innerHTML = DateFormat(item.TrDate);
                    return txt;
                }
            },
            { title: res.App_Cutomer, name: "CustomerName", type: "text", width: "25%" },
            { title: res.App_Salesman, name: (lang == "ar" ? "Slsm_DescA" : "Slsm_DescE"), type: "text", width: "25%" },
            { title: res.Men_StkDefItems, name: "Line_Count", type: "text", width: "12%" },
            { title: res.App_Package, name: "Tot_Qty", type: "text", width: "12%" },
            { title: res.App_total, name: "TotalAmount", type: "text", width: "10%" },
            { title: res.App_Tax, name: "VatAmount", type: "text", width: "10%" },
            { title: res.App_Net, name: "NetAfterVat", type: "text", width: "10%" },
            {
                title: res.App_invoiceType, css: "ColumPadding", name: "IsCashDesciption", width: "17%",
                itemTemplate: (s: string, item: IQ_GetSlsInvoiceStatisticVer2): HTMLLabelElement => {
                    let txt: HTMLLabelElement = document.createElement("label");
                    txt.innerHTML = item.IsCash == true ? (lang == "ar" ? "نقدي" : "Cash") : (lang == "ar" ? "علي الحساب" : "On account");
                    return txt;
                }
            },
            {
                title: res.App_Certified, css: "ColumPadding", name: "statusDesciption", width: "17%",
                itemTemplate: (s: string, item: IQ_GetSlsInvoiceStatisticVer2): HTMLLabelElement => {
                    let txt: HTMLLabelElement = document.createElement("label");
                    txt.innerHTML = item.Status == 1 ? (lang == "ar" ? "معتمد" : "A certified") : (lang == "ar" ? "غير معتمد" : "Not supported");;
                    return txt;
                }
            },
        ];
     
    }
    function BindStatisticGridData() {
        var startDate = DateFormatRep(txtStartDate.value).toString();
        var endDate = DateFormatRep(txtEndDate.value).toString();
        var customerId = 0;
        var status = 0;
        var returnType = 0;
        var SalesMan = "null";
        var FreeReturnShow = 0;

        if (ddlCustomer.value != "null") {
            customerId = Number(ddlCustomer.value.toString());
        }
        if (ddlSalesMan.value != "null") {
            SalesMan = ddlSalesMan.value.toString();
        }
        status = Number(ddlStateType.value.toString());


        returnType = Number(ddlReturnType.value.toString());

        FreeReturnShow = Number(ddlShowFreeReturn.value.toString());
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("SlsTrSales", "GetAllReturnSlsInvoiceStatistic"),
            data: { CompCode: compcode, BranchCode: BranchCode, StartDate: startDate, EndDate: endDate, Status: status, FreeReturn: FreeReturnShow, returnType: returnType, CustId: customerId, SalesMan: SalesMan, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    SlsInvoiceStatisticsDetails = result.Response as Array<IQ_GetSlsInvoiceStatisticVer2>;

                    Grid.DataSource = SlsInvoiceStatisticsDetails;
                    Grid.Bind();
                }
            }
        });
    }
    function Grid_RowDoubleClicked() {
        Show = true; 
        $("#divReturnDetails").removeClass("display_none");
        InvoiceStatisticsModel = new Array<IQ_GetSlsInvoiceStatisticVer2>();
        

        Selecteditem = SlsInvoiceStatisticsDetails.filter(x => x.InvoiceID == Number(Grid.SelectedKey));
        if (AfterInsertOrUpdateFlag == true) {
            
            Selecteditem = SlsInvoiceStatisticsDetails.filter(x => x.InvoiceID == GlobalReturnID);
            AfterInsertOrUpdateFlag = false;
        }

        InvoiceStatisticsModel = Selecteditem;
        if (InvoiceStatisticsModel.length > 0) {
            GlobalReturnID = Number(InvoiceStatisticsModel[0].InvoiceID);
            GlobalDocNo = InvoiceStatisticsModel[0].DocNo;
            globalRefTrID = Number(InvoiceStatisticsModel[0].RefTrID);

            txtRefNo.value = InvoiceStatisticsModel[0].RefNO.toString();
            txtRemarks.value = InvoiceStatisticsModel[0].Remark.toString();
            StoreID = InvoiceStatisticsModel[0].StoreId
            ddlTaxTypeHeader.value = InvoiceStatisticsModel[0].VatType.toString();

            txtItemCount.value = InvoiceStatisticsModel[0].Line_Count.toString();
            txtPackageCount.value = InvoiceStatisticsModel[0].Tot_Qty.toString();

            txtTotalDiscount.value = InvoiceStatisticsModel[0].ItemDiscountTotal.toString();
            txtTotalbefore.value = InvoiceStatisticsModel[0].ItemTotal.toString();
            txtTotal.value = InvoiceStatisticsModel[0].TotalAmount.toString();
            txtTax.value = InvoiceStatisticsModel[0].VatAmount.toString();
            txtNet.value = InvoiceStatisticsModel[0].NetAfterVat.toString();

            if (InvoiceStatisticsModel[0].RefTrID != null) {
                var RefID: number = InvoiceStatisticsModel[0].RefTrID;
                GetInvoiceByID(RefID);
            }
            var ReturnNum = InvoiceStatisticsModel[0].TrNo.toString();
            lblReturnNumber.value = ReturnNum;
            txtInvoiceDate.value = DateFormat(InvoiceStatisticsModel[0].TrDate.toString());


            if (InvoiceStatisticsModel[0].CustomerId != null) {
                $('#txtCustomerName').prop("value", InvoiceStatisticsModel[0].Cus_NameA.toString());

                var custId = InvoiceStatisticsModel[0].CustomerId.toString();
                ddlInvoiceCustomer.value = custId;
            } else {
                $('#txtCustomerName').prop("value", InvoiceStatisticsModel[0].CustomerName.toString());
            }

            if (InvoiceStatisticsModel[0].IsCash == true) {
                $('#ddlReturnTypeShow').prop("value", "1");
                $("#DivCashBox1").removeClass("display_none");
                $("#DivCashBox2").removeClass("display_none");
                if (InvoiceStatisticsModel[0].CashBoxID != null && InvoiceStatisticsModel[0].CashBoxID != 0) {
                    var BoxID = InvoiceStatisticsModel[0].CashBoxID.toString();
                    var cashAmount = InvoiceStatisticsModel[0].CashAmount.toString();
                    ddlCashBox.value = InvoiceStatisticsModel[0].CashBoxID.toString();
                    $("#txtCashAmount").prop("value", cashAmount);
                }
                else {
                    $("#ddlCashBox").attr("disabled", "disabled");
                    $("#txtCashAmount").attr("disabled", "disabled");
                    $("#txtCashAmount").prop("value", "");
                }

            } else {
                $("#DivCashBox1").addClass("display_none");
                $("#DivCashBox2").addClass("display_none");
                $('#ddlReturnTypeShow').prop("value", "0");
                $("#txtCashAmount").prop("value", "");
            }
            $('#ddlFreeSalesman').prop("value", InvoiceStatisticsModel[0].SalesmanId.toString());

            // $('#ddlSalesPerson').prop("value", Number(InvoiceStatisticsModel[0].SalesPersonId) == 0 ? 'null' : InvoiceStatisticsModel[0].SalesPersonId.toString());
            if (InvoiceStatisticsModel[0].Status == 1) {
                chkActive.disabled = !SysSession.CurrentPrivileges.CUSTOM2;
                btnUpdate.disabled = true;
                chkActive.checked = true;
            }
            else {
                chkActive.disabled = true;
                btnUpdate.disabled = !SysSession.CurrentPrivileges.EDIT;
                chkActive.checked = false;
            }

            $('#divCreationPanel').removeClass("display_none");

            $('#txtCreatedBy').prop("value", InvoiceStatisticsModel[0].CreatedBy);
            $('#txtCreatedAt').prop("value", InvoiceStatisticsModel[0].CreatedAt);

            $('#txtUpdatedBy').prop("value", InvoiceStatisticsModel[0].UpdatedBy);
            $('#txtUpdatedAt').prop("value", InvoiceStatisticsModel[0].UpdatedAt);


            $("#txtCustomerName").attr("disabled", "disabled");
            $("#ddlFreeSalesman").attr("disabled", "disabled");
            // $("#ddlSalesPerson").attr("disabled", "disabled");
            txtRefNo.disabled = true;
            txtRemarks.disabled = true;

            $("#btnInvoiceSearch").attr("disabled", "disabled");
        }


        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("SlsTrSales", "GetSlsInvoiceItem"),
            data: { invoiceID: GlobalReturnID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    SlsInvoiceItemsDetails = result.Response as Array<IQ_GetSlsInvoiceItem>;
                    $("#div_Data").html('');
                    CountGrid = 0;
                    debugger
                    for (let i = 0; i < SlsInvoiceItemsDetails.length; i++) {
                        BuildControls(i);
                        Display_GridConrtol(i);

                        CountGrid++;
                    } 
                    CountItems = CountGrid;

                    ComputeTotals();
                }
            }
        });

        $('#btnPrintTransaction').removeClass("display_none");

    }
    //------------------------------------------------------ Controls Grid Region -----------------------------------
    function BuildControls(cnt: number) {
        var html;
        html = `<tr id="No_Row${cnt}">
	                <td>
                    <input id="InvoiceItemID${cnt}" type="hidden" class="display_none"  />
		                <div class="form-group">
                            <input id="txtSerial${cnt}" type="text" class="form-control no-border" disabled />
		                </div>
	                </td>
	                <td>
		                <div class="form-group">
                            <select id="ddlFamily${cnt}" class="form-control">
                                <option value="null"> ${(lang == "ar" ? "النوع" : "Type")}</option>
                            </select>
		                </div>
	                </td>
	                <td>
		                <div class="form-group">
                            <select id="ddlItem${cnt}" class="form-control">
                                <option value="null">${(lang == "ar" ? "الصنف" : "Item")} </option>
                            </select>
		                </div>
	                </td>
	                <td>
		                <div class="form-group">
                            <input id="txtQuantity${cnt}" type="text" class="form-control" name="quant[1]" value="0" min="0" max="1000" disabled />
		                </div>
	                </td>
	                <td>
		                <div class="form-group ps-1">
			                <input class="counter" type="number" data-id="number" id="txtReturnQuantity${cnt}" name="quant[3]" value="1" min="0" max="1000" step="1"/>
			                <div class="value-button decrease-button btn-number3${cnt}" data-id="decrease" id="btnminus1" data-type="minus" data-field="quant[3]">-</div>
			                <div class="value-button increase-button btn-number3${cnt}" data-id="increase" id="btnplus3" data-type="plus" data-field="quant[3]">+</div>
		                </div>
	                </td>
	                <td>
		                <div class="form-group">
			                <input type="text" class="form-control" id="txtPrice${cnt}" name="quant[3]" value="0" min="0" step="1"/>
		                </div>
	                </td>
	                <td>
		                <div class="form-group">
			                <input type="text" class="form-control" id="txtUnitpriceWithVat${cnt}" value="0" min="0" step="1"/>
		                </div>
	                </td>
                    <td>
		                <div class="form-group" >
			               <input id="txtDiscountPrc${cnt}" type="text" disabled class="form-control"  name="quant[3]" class="form-control" value="0" min="0" step="1">
		                </div>
	                </td>  
                    <td>
		                <div class="form-group"style="width: 84px;" >
			               <input id="txtDiscountAmount${cnt}" type="text" disabled class="form-control"  name="quant[3]" class="form-control" value="0" min="0" step="1">
		                </div>
	                </td>  
                    <td>
		                <div class="form-group"style="width: 84px;" >
			               <input id="txtNetUnitPrice${cnt}" type="text" disabled class="form-control"  name="quant[3]" class="form-control" value="0" min="0" step="1">
		                </div>
	                </td>
	                <td>
		                <div class="form-group">
			                <input type="text" class="form-control" id="txtTotal${cnt}" disabled />
		                </div>
	                </td>
	                <td>
		                <div class="form-group">
			                <input type="text" class="form-control" id="txtTax_Rate${cnt}"  disabled />
		                </div>
	                </td>
	                <td>
		                <div class="form-group">
			                <input type="text" class="form-control" id="txtTax${cnt}" disabled/>
		                </div>
	                </td>
	                <td>
		                <div class="form-group">
			                <input type="text" class="form-control" id="txtTotAfterTax${cnt}" disabled />
		                </div>
                        <input id="vatnatid${cnt}" name = "" type = "hidden" class="form-control"/>
		                <input id="UnitCost${cnt}" name = "" type = "hidden" class="form-control"/>
		                <input id="txt_StatusFlag${cnt}" name = "" type = "hidden" class="form-control"/>
		                <input id="txt_ID${cnt}" name = "" type = "hidden" class="form-control"/>
	                </td>
	        
                </tr>`;
        $("#div_Data").append(html);

        //script
        $('.btn-number2' + cnt).click(function (e) {
            e.preventDefault();
            var fieldName = $(this).attr('data-field');
            var type = $(this).attr('data-type');
            var input = $("#txtPrice" + cnt);
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
        //script

        //script
        $('.btn-number3' + cnt).click(function (e) {
            e.preventDefault();
            var fieldName = $(this).attr('data-field');
            var type = $(this).attr('data-type');
            var input = $("#txtReturnQuantity" + cnt);
            var currentVal = parseFloat(input.val());
            if (!isNaN(currentVal)) {
                if (type == 'minus') {

                    if (currentVal > Number(input.attr('min'))) {
                        input.val((currentVal - 1)).change();
                    }
                    if (parseFloat(input.val()) == Number(input.attr('min'))) {
                        $(this).val(input.attr('min'));
                    }

                } else if (type == 'plus') {

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
        //script
        //script
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
        //script

        //fill dropdownlist
        for (var i = 0; i < FamilyDetails.length; i++) {
            $('#ddlFamily' + cnt).append('<option value="' + FamilyDetails[i].ItemFamilyID + '">' + (lang == "ar" ? FamilyDetails[i].DescA : FamilyDetails[i].DescL) + '</option>');
        }
        //FillddlItem
        var drop = '#ddlFamily' + cnt;
        $(drop).change(function () {
            var selectedFamily = $(drop + ' option:selected').attr('value');
            FillddlItem(Number(selectedFamily));
            $('#ddlItem' + cnt).empty();
            $('#ddlItem' + cnt).append('<option value="' + null + '">' + "اختر الصنف" + '</option>');
            for (var i = 0; i < ItemDetails.length; i++) {
                $('#ddlItem' + cnt).append('<option value="' + ItemDetails[i].ItemID + '">' + ItemDetails[i].Itm_DescA + '</option>');
            }
            ComputeTotals();
        });

        var dropddlItem = '#ddlItem' + cnt;
        $(dropddlItem).change(function () {
            if ($('#ddlItem' + cnt).val() == "null") {
                // $("#txtQuantity" + cnt).val("1");
                $("#txtReturnQuantity" + cnt).val("1");
                $("#txtPrice" + cnt).val("1");
                $("#txtUnitpriceWithVat" + cnt).val("1");
                $("#txtDiscountAmount" + cnt).val("1");
                $("#txtDiscountPrc" + cnt).val("1");
                $("#txtNetUnitPrice" + cnt).val("1");
                $("#txtTotal" + cnt).val("0");
                $("#txtTax" + cnt).val("0");
                $("#txtTotAfterTax" + cnt).val("0");
            } else {

                var selectedItem = $(dropddlItem + ' option:selected').attr('value');
                var selectedFamily = $(drop + ' option:selected').attr('value');
                //
                var itemID = Number(selectedItem);
                var FamilyID = Number(selectedFamily);

                var res = false;
                var NumberRowid = $("#InvoiceItemID" + cnt).val();
                res = checkRepeatedItems(itemID, FamilyID, NumberRowid);
                if (res == true) {
                    $("#ddlItem" + cnt).val("null");
                    $("#txtPrice" + cnt).val("1");
                    $("#txtUnitpriceWithVat" + cnt).val("1");
                    $("#txtDiscountAmount" + cnt).val("1");
                    $("#txtDiscountPrc" + cnt).val("1");
                    $("#txtNetUnitPrice" + cnt).val("1");
                    DisplayMassage('( لايمكن تكرار نفس الاصناف علي الفاتورة )', 'the same items cannot be repeated', MessageType.Error);
                } else {



                    var NumberSelect = ItemDetails.filter(s => s.ItemID == itemID);



                    let GetUnitprice: IGetunitprice = Get_PriceWithVAT(NumberSelect[0].UnitPrice, VatPrc, flag_PriceWithVAT);

                    var itemPrice = GetUnitprice.unitprice;
                    $("#txtPrice" + cnt).val(itemPrice);
                    $("#txtUnitpriceWithVat" + cnt).val(GetUnitprice.unitpricewithvat);

                    //
                    var txtQuantityValue = $("#txtReturnQuantity" + cnt).val();
                    var txtPriceValue = $("#txtPrice" + cnt).val();
                    if ($("#txtPrice" + cnt).val() == 0) {
                        var total = Number(txtQuantityValue) * 1;
                        $("#txtTotal" + cnt).val(total.RoundToSt(2));
                        VatPrc = Number($("#txtTax_Rate" + cnt).val());
                        var vatAmount = Number(total) * VatPrc / 100;
                        $("#txtTax" + cnt).val(vatAmount.RoundToSt(2));
                        var totalAfterVat = Number(vatAmount) + Number(total);
                        $("#txtTotAfterTax" + cnt).val(totalAfterVat.RoundToSt(2));
                    } else {
                        var total = Number(txtQuantityValue) * Number(txtPriceValue);
                        $("#txtTotal" + cnt).val(total.RoundToSt(2));
                        VatPrc = Number($("#txtTax_Rate" + cnt).val());
                        var vatAmount = Number(total) * VatPrc / 100;
                        $("#txtTax" + cnt).val(vatAmount.RoundToSt(2));
                        var totalAfterVat = Number(vatAmount) + Number(total);
                        $("#txtTotAfterTax" + cnt).val(totalAfterVat.RoundToSt(2));
                    }
                }
            }
            ComputeTotals();
        });

        $("#txtQuantity" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");

            var txtQuantityValue = $("#txtReturnQuantity" + cnt).val();
            var txtPriceValue = $("#txtNetUnitPrice" + cnt).val();
            if ($("#txtNetUnitPrice" + cnt).val() == 0) {
                var total = Number(txtQuantityValue) * 1;
                $("#txtTotal" + cnt).val(total.RoundToSt(2));
                VatPrc = Number($("#txtTax_Rate" + cnt).val());
                var vatAmount = Number(total) * VatPrc / 100;
                $("#txtTax" + cnt).val(vatAmount.RoundToSt(2));
                var totalAfterVat = Number(vatAmount) + Number(total);
                $("#txtTotAfterTax" + cnt).val(totalAfterVat.RoundToSt(2));
                ComputeTotals();
            } else {
                var total = Number(txtQuantityValue) * Number(txtPriceValue);
                $("#txtTotal" + cnt).val(total.RoundToSt(2));//= total;
                VatPrc = Number($("#txtTax_Rate" + cnt).val());
                var vatAmount = Number(total) * VatPrc / 100;
                $("#txtTax" + cnt).val(vatAmount.RoundToSt(2));
                var totalAfterVat = Number(vatAmount) + Number(total);
                $("#txtTotAfterTax" + cnt).val(totalAfterVat.RoundToSt(2));
                ComputeTotals();
            }
        });
        $("#txtPrice" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");

            var txtQuantityValue = $("#txtReturnQuantity" + cnt).val();
            var txtPriceValue = $("#txtPrice" + cnt).val();

            if ($("#txtReturnQuantity" + cnt).val() == 0) {
                var total = 1 * Number(txtPriceValue);
                $("#txtTotal" + cnt).val(total.RoundToSt(2));
                var vatAmount = Number(total) * VatPrc / 100;
                $("#txtTax" + cnt).val(vatAmount.RoundToSt(2));

                var totalAfterVat = Number(vatAmount) + Number(total);
                $("#txtTotAfterTax" + cnt).val(totalAfterVat.RoundToSt(2));

                ComputeTotals();

            } else {
                var total = 1 * Number(txtPriceValue);
                VatPrc = Number($("#txtTax_Rate" + cnt).val());
                var vatAmount = Number(total) * VatPrc / 100;
                $("#txtTax" + cnt).val(vatAmount.RoundToSt(2));
                var total = Number(txtQuantityValue) * Number(txtPriceValue);
                $("#txtTotal" + cnt).val(total.RoundToSt(2));

                var totalAfterVat = Number(vatAmount) + Number(total);
                $("#txtTotAfterTax" + cnt).val(totalAfterVat.RoundToSt(2));

                ComputeTotals();
            }
        });


        $("#txtReturnQuantity" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");

            var txtQuantityValue = $("#txtQuantity" + cnt).val();
            var txtReturnQuantityValue = $("#txtReturnQuantity" + cnt).val();
            var txtPriceValue = $("#txtNetUnitPrice" + cnt).val();
            if (Number(txtReturnQuantityValue) <= Number(txtQuantityValue)) {  //acept qty 


                var total = Number(txtReturnQuantityValue) * Number(txtPriceValue);
                $("#txtTotal" + cnt).val(total.RoundToSt(2));//= total;
                VatPrc = Number($("#txtTax_Rate" + cnt).val());
                var vatAmount = Number(total) * VatPrc / 100;
                $("#txtTax" + cnt).val(vatAmount.RoundToSt(2));
                var totalAfterVat = Number(vatAmount) + Number(total);
                $("#txtTotAfterTax" + cnt).val(totalAfterVat.RoundToSt(2));
                ComputeTotals();

            }
            else {

                $("#txtReturnQuantity" + cnt).val(txtQuantityValue);
                var total = Number($("#txtReturnQuantity" + cnt).val()) * Number(txtPriceValue);
                $("#txtTotal" + cnt).val(total.RoundToSt(2));
                VatPrc = Number($("#txtTax_Rate" + cnt).val());
                var vatAmount = Number(total) * VatPrc / 100;
                $("#txtTax" + cnt).val(vatAmount.RoundToSt(2));
                var totalAfterVat = Number(vatAmount) + Number(total);
                $("#txtTotAfterTax" + cnt).val(totalAfterVat.RoundToSt(2));
                ComputeTotals();
                DisplayMassage('( يجب ان تكون الكميه المرتجعه اقل من الكمية المباعة)', 'Return Quantity must be less than sold Quantity', MessageType.Error);

            }
        });

        $("#txtReturnQuantity" + cnt).on('keyup', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");

            var txtQuantityValue = $("#txtQuantity" + cnt).val();
            var txtReturnQuantityValue = $("#txtReturnQuantity" + cnt).val();
            var txtPriceValue = $("#txtNetUnitPrice" + cnt).val();
            if (Number(txtReturnQuantityValue) <= Number(txtQuantityValue)) {  //acept qty 


                var total = Number(txtReturnQuantityValue) * Number(txtPriceValue);
                $("#txtTotal" + cnt).val(total.RoundToSt(2));//= total;
                VatPrc = Number($("#txtTax_Rate" + cnt).val());
                var vatAmount = Number(total) * VatPrc / 100;
                $("#txtTax" + cnt).val(vatAmount.RoundToSt(2));
                var totalAfterVat = Number(vatAmount) + Number(total);
                $("#txtTotAfterTax" + cnt).val(totalAfterVat.RoundToSt(2));
                ComputeTotals();

            }
            else {

                $("#txtReturnQuantity" + cnt).val(txtQuantityValue);
                var total = Number($("#txtReturnQuantity" + cnt).val()) * Number(txtPriceValue);
                $("#txtTotal" + cnt).val(total.RoundToSt(2));
                VatPrc = Number($("#txtTax_Rate" + cnt).val());
                var vatAmount = Number(total) * VatPrc / 100;
                $("#txtTax" + cnt).val(vatAmount.RoundToSt(2));
                var totalAfterVat = Number(vatAmount) + Number(total);
                $("#txtTotAfterTax" + cnt).val(totalAfterVat.RoundToSt(2));
                ComputeTotals();
                DisplayMassage('( يجب ان تكون الكميه المرتجعه اقل من الكمية المباعة)', 'Return Quantity must be less than sold Quantity', MessageType.Error);

            }
        });



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

        //bind Data

        $("#txt_StatusFlag" + cnt).val("");

        for (var i = 0; i < FamilyDetails.length; i++) {
            $('#ddlFamily' + cnt).append('<option value="' + FamilyDetails[i].ItemFamilyID + '">' + (lang == "ar" ? FamilyDetails[i].DescA : FamilyDetails[i].DescL) + '</option>');
        }

        var FamilyID: number = Number(SlsInvoiceItemsDetails[cnt].ItemFamilyID);
        $("#ddlFamily" + cnt).prop("value", FamilyID);

        FillddlItem(FamilyID);

        for (var i = 0; i < ItemDetails.length; i++) {
            $('#ddlItem' + cnt).append('<option value="' + ItemDetails[i].ItemID + '">' + (lang == "ar" ? ItemDetails[i].Itm_DescA : ItemDetails[i].Itm_DescE) + '</option>');
        }

        $("#ddlItem" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].ItemID);
        var SoldQty = SlsInvoiceItemsDetails[cnt].TotRetQty - SlsInvoiceItemsDetails[cnt].SoldQty;
        if (SoldQty < 0) {
            SoldQty = SoldQty * -1;
        }
        $("#txtQuantity" + cnt).prop("value", SoldQty);

        $("#txtPrice" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].Unitprice);


        if (SlsInvoiceItemsDetails[cnt].UnitpriceWithVat == null || SlsInvoiceItemsDetails[cnt].UnitpriceWithVat == 0) {

            let GetUnitprice: IGetunitprice = Get_PriceWithVAT(SlsInvoiceItemsDetails[cnt].Unitprice, SlsInvoiceItemsDetails[cnt].VatPrc, false)
            $("#txtUnitpriceWithVat" + cnt).prop("value", GetUnitprice.unitpricewithvat);
        }
        else {
            $("#txtUnitpriceWithVat" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].UnitpriceWithVat);
        }

 
        return;
    }
    function Display_GridConrtol(cnt) {


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

        $("#btn_minus" + cnt).addClass("display_none");
        $("#btn_minus" + cnt).attr("disabled", "disabled");


        $("#txtSerial" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].Serial);
        $("#txtServicCode" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].it_itemCode);
        $("#InvoiceItemID" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].InvoiceItemID);
        $("#txt_ItemID" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].ItemID);
         
        $("#txtPrice" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].Unitprice);
        $("#txtTax_Rate" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].VatPrc);
        $("#txtTax_Rate" + cnt).attr('data-VatNatID', SlsInvoiceItemsDetails[cnt].VatNatID);
        $("#txtDiscountPrc" + cnt).val(SlsInvoiceItemsDetails[cnt].DiscountPrc);
        $("#txtDiscountAmount" + cnt).val(SlsInvoiceItemsDetails[cnt].DiscountAmount);
        $("#txtNetUnitPrice" + cnt).val(SlsInvoiceItemsDetails[cnt].NetUnitPrice);

         
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
            //$("#btn_minus" + cnt).removeAttr("disabled");
        }


    }
    function ComputeTotals() {
        if (CountGrid != 0) {

            PackageCount = 0;
            CountTotal = 0;
            TaxCount = 0;
            NetCount = 0;
            let TotalDiscount = 0;
            let Totalbefore = 0;

            for (let i = 0; i < CountGrid; i++) {
                var flagvalue = $("#txt_StatusFlag" + i).val();
                if (flagvalue != "d" || flagvalue != "m") {
                    var ReturnQty = Number($("#txtReturnQuantity" + i).val());
                    PackageCount += ReturnQty;
                    PackageCount = Number(PackageCount);

                    Totalbefore += (Number($("#txtQuantity" + i).val()) * Number($("#txtPrice" + i).val()));
                    Totalbefore = Number(Totalbefore.RoundToSt(2).toString());

                    TotalDiscount += (Number($("#txtQuantity" + i).val()) * Number($("#txtDiscountAmount" + i).val()));
                    TotalDiscount = Number(TotalDiscount.RoundToSt(2).toString());

                    CountTotal += Number($("#txtTotal" + i).val()) == null ? 0 : Number($("#txtTotal" + i).val());
                    CountTotal = Number(CountTotal.RoundToSt(2).toString()) == null ? 0 : Number(CountTotal.RoundToSt(2).toString());

                    TaxCount += Number($("#txtTax" + i).val()) == null ? 0 : Number($("#txtTax" + i).val());
                    TaxCount = Number(TaxCount.RoundToSt(2).toString()) == null ? 0 : Number(TaxCount.RoundToSt(2).toString());

                    NetCount += Number($("#txtTotAfterTax" + i).val()) == null ? 0 : Number($("#txtTotAfterTax" + i).val());
                    NetCount = Number(NetCount.RoundToSt(2).toString()) == null ? 0 : Number(NetCount.RoundToSt(2).toString());


                }
            }
            txtItemCount.value = CountItems.toString();
            txtPackageCount.value = PackageCount.toString();
            txtTotal.value = CountTotal.toString();
            txtTax.value = TaxCount.toString();
            txtNet.value = NetCount.toString();
            txtTotalDiscount.value = TotalDiscount.toString();
            txtTotalbefore.value = Totalbefore.toString();
        }

    }
    //------------------------------------------------------ Validation  && clear Region -----------------------------------
    function clear() {
        $('#div_Data').html("");
        txtItemCount.value = "";
        txtPackageCount.value = "";
        txtTotal.value = "";
        txtTax.value = "";
        txtNet.value = "";
        txtInvoiceNumber.value = "";
        lblReturnNumber.value = "";
        txtInvoiceDate.value = "";
        txtRefNo.value = "";
        txtRemarks.value = "";
        ddlInvoiceCustomer.value = "null";
        ddlReturnTypeShow.value = "0";
        ddlFreeSalesman.value = "null";
        //ddlSalesPerson.value = "null";


        $("#txtCustomerName").prop("value", "");
        $("#txtCustomerName").attr("disabled", "disabled");

        ddlFreeSalesman.disabled = true;
        //ddlSalesPerson.disabled = true;

        $('#txtCreatedBy').prop("value", "");
        $('#txtCreatedAt').prop("value", "");

        $('#txtUpdatedBy').prop("value", "");
        $('#txtUpdatedAt').prop("value", "");

        $("#txtInvoiceDate").attr("disabled", "disabled");
        $("#ddlInvoiceCustomer").attr("disabled", "disabled");

        $("#ddlReturnTypeShow").attr("disabled", "disabled");
        $("#ddlFreeSalesman").attr("disabled", "disabled");
        //$("#ddlSalesPerson").attr("disabled", "disabled");

        $("#ddlCashBox").attr("disabled", "disabled");
        $("#txtCashAmount").attr("disabled", "disabled");

        $("#ddlCashBox").prop("value", "null");
        $("#txtCashAmount").prop("value", "");
        $("#ddlTaxTypeHeader").prop("value", "null");

        $("#btnPrint").addClass("display_none");

        for (let cnt = 0; cnt <= CountGrid; cnt++) {
            $("#ddlFamily" + cnt).attr("disabled", "disabled");
            $("#ddlItem" + cnt).attr("disabled", "disabled");
            $("#txtQuantity" + cnt).attr("disabled", "disabled");
            $("#txtPrice" + cnt).attr("disabled", "disabled");
            $("#txtReturnQuantity" + cnt).attr("disabled", "disabled");
            $("#txtTotal" + cnt).attr("disabled", "disabled");
            $("#txtTax" + cnt).attr("disabled", "disabled");
            $("#txtTotAfterTax" + cnt).attr("disabled", "disabled");


            $('.btn-number1' + cnt).attr("disabled", "disabled");
            $('.input-number1' + cnt).attr("disabled", "disabled");

            $('.btn-number2' + cnt).attr("disabled", "disabled");
            $('.input-number2' + cnt).attr("disabled", "disabled");

            $('.btn-number3' + cnt).attr("disabled", "disabled");
            $('.input-number3' + cnt).attr("disabled", "disabled");
        }
        txtInvoiceDate.value = GetDate();
    }
    function ValidationHeader() {

        var newCount: number = 0;
        for (let i = 0; i < CountGrid; i++) {
            if ($("#txt_StatusFlag" + i).val() != "d" && $("#txt_StatusFlag" + i).val() != "m") {
                newCount++;
            }
        }

        var NetVal: number = 0;
        var CashVal: number = 0;

        if (txtNet.value != "")
            NetVal = Number(Number(txtNet.value).RoundToSt(2));
        if (txtCashAmount.value != "")
            CashVal = Number(Number(txtCashAmount.value).RoundToSt(2));


        if (newCount == 0) {
            DisplayMassage("برجاء ادخال بيانات المرتجع", 'please Enter Return Data', MessageType.Error);
            return false
        }

        else if (chkActive.checked == true && ddlReturnTypeShow.value == "1" && (ddlCashBox.value == "null" || ddlCashBox.value == null)) {
            DisplayMassage("برجاءاختيار الصندوق", 'please select Cashbox', MessageType.Error);
            Errorinput(ddlCashBox);
            return false
        }

        else if (txtCashAmount.value != "" && chkActive.checked == true && ddlReturnTypeShow.value == "1" && (NetVal != CashVal)) {
            DisplayMassage("يجب ان يتساوي المبلغ المسدد مع الصافي", 'paid amount must be equal to the net', MessageType.Error);
            Errorinput(txtNet);
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
    function ValidationGrid(i: number) {

        if ($("#txt_StatusFlag" + i).val() != "d" && $("#txt_StatusFlag" + i).val() != "m") {
            var RetQty = Number($("#txtReturnQuantity" + i).val());
            if (RetQty == 0) {
                DisplayMassage('( يجب أضافه قيمه للكمية المرتجعه ع الفاتورة)', 'you must add value to the return quantity', MessageType.Error);
                Errorinput($("#txtReturnQuantity" + i));
                return false
            }
            else
                return true;
        }
    }
    function checkRepeatedItems(itemValue: number, familyValue: number, NumberRowid: number) {
        var items: number = Number(txtItemCount.value);
        var flag = false;
        for (let i = 0; i < items - 1; i++) {
            if (Number($("#ddlItem" + i).val()) == itemValue && Number($("#ddlFamily" + i).val()) == familyValue && Number($("#InvoiceItemID" + i).val()) != NumberRowid) {// $("#No_Row" + cnt).val();
                flag = true;
            }
        }
        return flag;
    }
    //--------------------------------------------------- Main Functions-----------------------------------------------
    function Assign() {

        MasterDetailModel = new SlsInvoiceMasterDetails();
        invoiceItemsModel = new Array<I_Sls_TR_InvoiceItems>();
        InvoiceModel = new I_Sls_TR_Invoice();

        // Header
        InvoiceModel.CompCode = Number(compcode);
        InvoiceModel.BranchCode = Number(BranchCode);
        InvoiceModel.VatType = vatType;
        InvoiceModel.VatAmount = Number(txtTax.value);
        InvoiceModel.InvoiceTransCode = InvoiceStatisticsModel[0].InvoiceTransCode;
        InvoiceModel.InvoiceTypeCode = InvoiceStatisticsModel[0].InvoiceTypeCode;
        //InvoiceModel.RefNO = InvoiceStatisticsModel[0].RefNO;
        //InvoiceModel.Remark = InvoiceStatisticsModel[0].Remark;


        InvoiceModel.TrType = 1//0 invoice 1 return
        InvoiceModel.SlsInvSrc = 1   // 1 from store 2 from van 
        InvoiceModel.SlsInvType = 1 //  retail 
        InvoiceModel.StoreId = StoreID;//main store
        InvoiceModel.CRDBReasoncode = 1;

        if (txtInvoiceNumber.value.toString() == "") {
            InvoiceModel.RefTrID = null;
        }
        else {
            InvoiceModel.RefTrID = GlobalReturnID;
        }
        /////////////////////
        if (ddlReturnTypeShow.value == "0") {
            InvoiceModel.IsCash = false;
            InvoiceModel.CustomerName = $("#ddlInvoiceCustomer option:selected").text();
        }
        else {
            InvoiceModel.IsCash = true;
            InvoiceModel.CustomerName = $("#txtCustomerName").val();
            InvoiceModel.CashAmount = $("#txtCashAmount").val();
        }
        InvoiceModel.CashBoxID = Number(ddlCashBox.value);
        InvoiceModel.CustomerId = Number(ddlInvoiceCustomer.value);

        InvoiceModel.SalesmanId = Number(ddlFreeSalesman.value);
        InvoiceModel.RefNO = txtRefNo.value;
        InvoiceModel.Remark = txtRemarks.value;
        // InvoiceModel.SalesPersonId = Number(ddlSalesPerson.value);
        InvoiceModel.TrDate = txtInvoiceDate.value;

        InvoiceModel.ItemTotal = Number(txtTotalbefore.value);
        InvoiceModel.ItemDiscountTotal = Number(txtTotalDiscount.value);
        InvoiceModel.NetAfterVat = Number(txtNet.value);
        InvoiceModel.TotalAmount = Number(txtTotal.value);

        InvoiceModel.CashAmount = Number(txtNet.value);
        InvoiceModel.CardAmount = 0;



        if (chkActive.checked == true) {
            InvoiceModel.Status = 1;
        } else {
            InvoiceModel.Status = 0;
        }
        InvoiceModel.RefTrID = Number(globalRefTrID);

        // Details
        var StatusFlag: String;
        for (var i = 0; i < CountGrid; i++) {
            invoiceItemSingleModel = new I_Sls_TR_InvoiceItems();
            StatusFlag = '';
            StatusFlag = $("#txt_StatusFlag" + i).val();
            var Qty = Number($('#txtReturnQuantity' + i).val());
            if (StatusFlag == "i") {
                invoiceItemSingleModel.InvoiceItemID = 0;
                invoiceItemSingleModel.Serial = $("#txtSerial" + i).val();
                invoiceItemSingleModel.ItemID = $("#ddlItem" + i).val();

                invoiceItemSingleModel.InvoiceSoldQty = $('#txtQuantity' + i).val(); 
                invoiceItemSingleModel.SoldQty = $('#txtReturnQuantity' + i).val();
                invoiceItemSingleModel.StockSoldQty = $('#txtReturnQuantity' + i).val();

                invoiceItemSingleModel.NetUnitPrice = $("#txtPrice" + i).val();
                invoiceItemSingleModel.Unitprice = $("#txtPrice" + i).val();
                invoiceItemSingleModel.UnitpriceWithVat = $("#txtUnitpriceWithVat" + i).val();

                invoiceItemSingleModel.DiscountAmount = $("#txtDiscountAmount" + i).val();
                invoiceItemSingleModel.DiscountPrc = $("#txtDiscountPrc" + i).val();
                invoiceItemSingleModel.NetUnitPrice = $("#txtNetUnitPrice" + i).val();


                VatPrc = Number($("#txtTax_Rate" + i).val());
                invoiceItemSingleModel.VatPrc = VatPrc;
                invoiceItemSingleModel.VatAmount = $("#txtTax" + i).val();
                invoiceItemSingleModel.ItemTotal = invoiceItemSingleModel.Unitprice * invoiceItemSingleModel.SoldQty;
                invoiceItemSingleModel.StatusFlag = StatusFlag.toString();

                invoiceItemSingleModel.StockUnitCost = Number($("#UnitCost" + i).val())
                invoiceItemSingleModel.VatNatID = Number($("#vatnatid" + i).val())

                if (Qty != 0) {
                    invoiceItemsModel.push(invoiceItemSingleModel);
                }
            }
            if (StatusFlag == "u") {
                var invoiceItemId = $("#InvoiceItemID" + i).val()
                invoiceItemSingleModel.InvoiceItemID = invoiceItemId;
                invoiceItemSingleModel.Serial = $("#txtSerial" + i).val();
                invoiceItemSingleModel.ItemID = $("#ddlItem" + i).val();
                invoiceItemSingleModel.StatusFlag = StatusFlag.toString();

                invoiceItemSingleModel.SoldQty = $('#txtReturnQuantity' + i).val();
                invoiceItemSingleModel.StockSoldQty = $('#txtReturnQuantity' + i).val();
                invoiceItemSingleModel.InvoiceSoldQty = $('#txtQuantity' + i).val(); 

                invoiceItemSingleModel.NetUnitPrice = $("#txtPrice" + i).val();
                invoiceItemSingleModel.Unitprice = $("#txtPrice" + i).val();
                invoiceItemSingleModel.UnitpriceWithVat = $("#txtUnitpriceWithVat" + i).val();

                invoiceItemSingleModel.DiscountAmount = $("#txtDiscountAmount" + i).val();
                invoiceItemSingleModel.DiscountPrc = $("#txtDiscountPrc" + i).val();
                invoiceItemSingleModel.NetUnitPrice = $("#txtNetUnitPrice" + i).val();


                VatPrc = Number($("#txtTax_Rate" + i).val());
                invoiceItemSingleModel.VatPrc = VatPrc;
                invoiceItemSingleModel.ItemTotal = invoiceItemSingleModel.Unitprice * invoiceItemSingleModel.SoldQty;
                invoiceItemSingleModel.VatAmount = invoiceItemSingleModel.ItemTotal * invoiceItemSingleModel.VatPrc / 100;
                invoiceItemSingleModel.NetAfterVat = invoiceItemSingleModel.ItemTotal + invoiceItemSingleModel.VatAmount;
                invoiceItemSingleModel.StockUnitCost = Number($("#UnitCost" + i).val())
                invoiceItemSingleModel.VatNatID = Number($("#vatnatid" + i).val())

                if (Qty != 0) {
                    invoiceItemsModel.push(invoiceItemSingleModel);
                }
            }
            if (StatusFlag == "d") {
                if (EditFlag == true) {
                    if ($("#InvoiceItemID" + i).val() != "") {
                        var deletedID = $("#InvoiceItemID" + i).val();
                        invoiceItemSingleModel.StatusFlag = StatusFlag.toString();
                        invoiceItemSingleModel.InvoiceItemID = deletedID;
                        invoiceItemsModel.push(invoiceItemSingleModel);
                    }
                }
            }

        }
        MasterDetailModel.I_Sls_TR_Invoice = InvoiceModel;
        MasterDetailModel.I_Sls_TR_InvoiceItems = invoiceItemsModel;

        MasterDetailModel.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
        MasterDetailModel.UserCode = SysSession.CurrentEnvironment.UserCode;
        MasterDetailModel.CompName = SysSession.CurrentEnvironment.CompanyNameAr;
        MasterDetailModel.VatNo = SysSession.CurrentEnvironment.VatNo;
    }
    function Insert() {
        InvoiceModel.InvoiceID = 0;
        InvoiceModel.CreatedBy = SysSession.CurrentEnvironment.UserCode;
        InvoiceModel.CreatedAt = DateTimeFormat(Date().toString());
        InvoiceModel.DocNo = GlobalDocNo;

        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("SlsTrSales", "InsertSlsReturnMasterDetail"),
            data: JSON.stringify(MasterDetailModel),
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess == true) {
                    let res = result.Response as IQ_GetSlsInvoiceStatisticVer2;
                    DateSetsSccess("txtInvoiceDate", "txtStartDate", "txtEndDate");
                    DisplayMassage("تم اصدار  مرتجع رقم " + res.TrNo, 'Return Number ' + res.TrNo + "has been issued", MessageType.Succeed);
                    var returnValue = res.TrNo.toString();
                    lblReturnNumber.value = returnValue.toString();
                    GlobalReturnID = res.InvoiceID;
                    $('#txtCreatedBy').prop("value", SysSession.CurrentEnvironment.UserCode);
                    $('#txtCreatedAt').prop("value", DateTimeFormat(Date().toString()));
                     
                    displayDate_speed(GlobalReturnID, res);
                    Success();
                      
                    Save_Succ_But();
                } else {
                    DisplayMassage("هناك خطــأ ", '(Error)', MessageType.Error);
                    InsertFlag = true;
                }
            }
        });

    }
    function Success() {
  
        $("#divReturnDetails").removeClass("display_none");
        $("#ddlCashBox").attr("disabled", "disabled");
        $("#txtCashAmount").attr("disabled", "disabled");
        $("#btnInvoiceSearch").attr("disabled", "disabled");
        $('#btnPrint').removeClass("display_none");
        $("#btnSave").addClass("display_none");
        $('#btnBack').addClass("display_none");
        $('#btnUpdate').removeClass("display_none");

        $("#divIconbar").removeAttr("disabled");
        $("#divIconbar").removeClass("disabledIconbar");

        $("#cotrolDiv").removeAttr("disabled");
        $("#cotrolDiv").removeClass("disabledDiv");
        $("#divShow").removeAttr("disabled");
        $("#divShow").removeClass("disabledDiv");
        txtInvoiceDate.disabled = true;
        txtRefNo.disabled = true;
        txtRemarks.disabled = true;
        chkPreivilegeToEditApprovedReturns();
        $("#divShow").removeClass("display_none");
        $("#divGridDetails_View").removeClass("disabledDiv");
        $("#divGridDetails_View").removeClass("display_none");
        $("#searchbutmemreport").removeAttr("disabled");
         
        $('#btnPrintTransaction').removeClass("display_none");

        AfterInsertOrUpdateFlag = true;
        Grid_RowDoubleClicked();

    }
    function Update() {
        InvoiceModel.InvoiceID = GlobalReturnID;
        if (InvoiceStatisticsModel.length > 0) {
            InvoiceModel.CreatedBy = InvoiceStatisticsModel[0].CreatedBy;
            InvoiceModel.CreatedAt = InvoiceStatisticsModel[0].CreatedAt;
        } else {
            InvoiceModel.CreatedBy = SysSession.CurrentEnvironment.UserCode;
            InvoiceModel.CreatedAt = DateTimeFormat(Date().toString());
        }

        InvoiceModel.TrNo = Number(lblReturnNumber.value);
        InvoiceModel.UpdatedBy = SysSession.CurrentEnvironment.UserCode;
        InvoiceModel.UpdatedAt = DateTimeFormat(Date().toString());
        InvoiceModel.DocNo = GlobalDocNo;

        InvoiceModel.RefTrID = Number(globalRefTrID);
        MasterDetailModel.I_Sls_TR_Invoice.TrTime = InvoiceStatisticsModel[0].TrTime;
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("SlsTrSales", "updateReturnMasterDetail"),
            data: JSON.stringify(MasterDetailModel),
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess == true) {
                    let res = result.Response as IQ_GetSlsInvoiceStatisticVer2;
                    DateSetsSccess("txtInvoiceDate", "txtStartDate", "txtEndDate");
                    GlobalReturnID = res.InvoiceID;
                    DisplayMassage("تم تعديل المرتجع بنجاح  ", 'Return number ' + res.TrNo + ' modified Successfully', MessageType.Succeed);
                    $('#txtUpdatedBy').prop("value", res.UpdatedBy);
                    $('#txtUpdatedAt').prop("value", res.UpdatedAt);


                    displayDate_speed(GlobalReturnID, res);
                    Success();
                    Save_Succ_But();
                } else {
                    DisplayMassage("هناك خطـأ", '(Error)', MessageType.Error);
                }
            }
        });


        EditFlag = false;
    }
    function openReturn() {


        if (!CheckPeriodDate(txtInvoiceDate.value, "I")) {
            debugger
            DisplayMassage("لا يمكنك الاضافه او التعديل في هذة الفتره المغلقه ", "Please select a Invoice data", MessageType.Error);
            Errorinput(txtInvoiceDate);
            chkActive.checked = true;
            return false
        }

        Assign();
        InvoiceModel.InvoiceID = GlobalReturnID;
        if (InvoiceStatisticsModel.length > 0) {
            InvoiceModel.CreatedBy = InvoiceStatisticsModel[0].CreatedBy;
            InvoiceModel.CreatedAt = InvoiceStatisticsModel[0].CreatedAt;
        } else {
            InvoiceModel.CreatedBy = SysSession.CurrentEnvironment.UserCode;
            InvoiceModel.CreatedAt = DateTimeFormat(Date().toString());
        }

        InvoiceModel.TrNo = Number(lblReturnNumber.value);
        InvoiceModel.UpdatedBy = SysSession.CurrentEnvironment.UserCode;
        InvoiceModel.UpdatedAt = DateTimeFormat(Date().toString());

        InvoiceModel.RefTrID = Number(globalRefTrID);
        InvoiceModel.Status = 0;
        MasterDetailModel.I_Sls_TR_Invoice.TrTime = InvoiceStatisticsModel[0].TrTime;
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("SlsTrSales", "OpenReturn"),
            data: JSON.stringify(MasterDetailModel),
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess == true) { 
                    let res = result.Response as IQ_GetSlsInvoiceStatisticVer2;
                    DisplayMassage('( تم فك اعتماد الفاتورة (' + res.TrNo + ') بنجاح )', '(The invoice has been successfully modified)', MessageType.Succeed);       
                    GlobalReturnID = res.InvoiceID;
                    $('#divCreationPanel').removeClass("display_none");
                    $('#txtUpdatedBy').prop("value", res.UpdatedBy);
                    $('#txtUpdatedAt').prop("value", res.UpdatedAt);

                    displayDate_speed(GlobalReturnID, res)

                    chkActive.checked = false;
                    chkActive.disabled = true;

                    btnUpdate.disabled = false;
                } else {
                    btnUpdate.disabled = true;
                }
            }
        });

    }
    function displayDate_speed(invID: number, res: IQ_GetSlsInvoiceStatisticVer2) {
          

        SlsInvoiceStatisticsDetails = SlsInvoiceStatisticsDetails.filter(x => x.InvoiceID != invID);


        res.TrDate = DateFormat(res.TrDate.toString());
        res.statusDesciption = res.Status == 1 ? (lang == "ar" ? "معتمد" : "A certified") : (lang == "ar" ? "غير معتمد" : "Not supported");
        res.IsCashDesciption = res.IsCash == true ? (lang == "ar" ? "نقدي" : "Cash") : (lang == "ar" ? "علي الحساب" : "On account");

        SlsInvoiceStatisticsDetails.push(res);

        SlsInvoiceStatisticsDetails = SlsInvoiceStatisticsDetails.sort(dynamicSort("TrNo"));


        Grid.DataSource = SlsInvoiceStatisticsDetails;
        Grid.Bind();
        $("#divShow").removeClass("display_none");
        
        $("#DivInvoiceDetails").addClass("display_none");
        $("#cotrolDiv").removeClass("disabledDiv");
        $("#divIconbar").removeClass("disabledIconbar");
        $("#divShow").removeClass("display_none");
        //$("#divReturnDetails").addClass("display_none");

        $("#divGridDetails_View").removeClass("disabledDiv");
        $("#searchbutmemreport").removeAttr("disabled");

        $("#ddlCustomer").removeAttr("disabled");
        $("#txtStartDate").removeAttr("disabled");
        $("#txtEndDate").removeAttr("disabled");
        $("#ddlSalesMan").removeAttr("disabled");
        $("#ddlReturnType").removeAttr("disabled");
        $("#ddlStateType").removeAttr("disabled");

    }
    //----------------------------------------------------------Print region---------------------------------------
    export function PrintReport(OutType: number) {
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




        if (ddlSalesMan.selectedIndex > 0) { rp.SalesmanID = Number($("#ddlSalesMan").val()); }
        else { rp.SalesmanID = -1; }

        if ($("#ddlCustomer").val() == "null") { rp.CustomerID = -1; }
        else { rp.CustomerID = Number($("#ddlCustomer").val()); }

        rp.CashType = Number($("#ddlReturnType").val());
        rp.OperationId = -1;
        rp.Status = Number($("#ddlStateType").val());

        rp.TrType = 1;
        rp.src = 1;

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

        rp.Type = 0;
        rp.Repdesign = 1;
        debugger
        rp.TRId = GlobalReturnID;

        rp.Name_function = "rptInvoiceNoteRet";
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
        rp.DocPDFFolder = SysSession.CurrentEnvironment.I_Control[0].DocPDFFolder;

        var BranchNameA = SysSession.CurrentEnvironment.BranchName;
        var BranchNameE = SysSession.CurrentEnvironment.BranchName;
        if (BranchNameA == null || BranchNameE == null) {

            BranchNameA = " ";
            BranchNameE = " ";
        }
        rp.BraNameA = BranchNameA;
        rp.BraNameE = BranchNameE;
        rp.Type = 0;
        rp.Repdesign = 1;
        debugger
        rp.TRId = GlobalReturnID;

        Ajax.CallAsync({
            url: Url.Action("rptInvoiceNoteRet", "Reports_pdf"),
            data: rp,
            success: (d) => {
            }
        })


    }



    function btnPrintsFrom_To_onclick() {
        btnShow_onclick();

        var startDate = DateFormatRep(txtStartDate.value).toString();
        var endDate = DateFormatRep(txtEndDate.value).toString();
        var customerId = 0;
        var status = 0;
        var SalesMan = 0; 
        var IsCash: number = 0;

        if (ddlCustomer.value != "null") {
            customerId = Number(ddlCustomer.value.toString());
        }

        if (ddlSalesMan.value != "null") {
            SalesMan = Number(ddlSalesMan.value.toString());
        } 
        if (ddlStateType.value != "null") {
            status = Number(ddlStateType.value.toString());
        }
        if (Number(ddlReturnType.value) == 0) {
            IsCash = 0;
        } else if (Number(ddlReturnType.value) == 1) {
            IsCash = 1;
        } else {
            IsCash = 2;
        }



        try {


            let Name_ID = 'InvoiceID'
            let NameTable = 'I_Sls_TR_Invoice'
            let Condation1 = " SlsInvSrc = 1 and  TrType = 1 and CompCode = " + compcode + " and BranchCode =" + BranchCode + " " +
                " and TrDate >=' " + startDate + "' and TrDate <= ' " + endDate + " ' ";
            let Condation2 = " ";


            if (customerId != 0 && customerId != null)
                Condation2 = Condation2 + " and CustomerId =" + customerId;            
            if (SalesMan != 0 && SalesMan != null)
                Condation2 = Condation2 + " and SalesmanId =" + SalesMan;// and Status = " + Status
            if (status == 2)
                Condation2 = Condation2 + "";
            else {
                Condation2 = Condation2 + " and Status = " + status;
            }
            /////////////' and IsCash = '" + IsCash+"'"
            if (IsCash == 2)
                Condation2 = Condation2 + "";
            else if (IsCash == 0) {
                Condation2 = Condation2 + " and IsCash = 'False' ";
            }
            else if (IsCash == 1) {
                Condation2 = Condation2 + " and IsCash = 'True' ";
            }
            ///////////
            let Condation3 = Condation1 + Condation2 + " ORDER BY TrNo ASC;";


            PrintsFrom_To(TransType.InvoiceReturn, Name_ID, NameTable, Condation3, SlsInvoiceStatisticsDetails.length)



        } catch (e) {

            return
        }

    }


}