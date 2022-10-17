$(document).ready(function () {
    SlsTrSalesReturn.InitalizeComponent();
});
var SlsTrSalesReturn;
(function (SlsTrSalesReturn) {
    //system varables
    var SysSession = GetSystemSession(Modules.SlsTrReturn);
    var compcode;
    var BranchCode;
    var sys = new SystemTools();
    var vatType;
    var Finyear;
    //ddl
    var ddlCustomer;
    var ddlSalesMan;
    var ddlStateType;
    var ddlInvoiceCustomer;
    var ddlFreeSalesman;
    var ddlSalesPerson;
    var ddlReturnType;
    var ddlReturnTypeShow;
    var ddlShowFreeReturn;
    var ddlCashBox;
    var ddlTaxTypeHeader;
    var searchbutmemreport;
    var txtRefNo;
    var txtRemarks;
    // Arrays
    var VendorDetails = new Array();
    var AddReturnDetailsAr = new Array();
    var AddReturnDetailsEn = new Array();
    var StateDetailsAr = new Array();
    var StateDetailsEn = new Array();
    var SlsInvoiceStatisticsDetails = new Array();
    var SearchDetails = new Array();
    var SlsInvoiceItemsDetails = new Array();
    var Selecteditem = new Array();
    var FamilyDetails = new Array();
    var ItemDetails = new Array();
    var AD_VatTypeDetails = new A_D_VAT_TYPE();
    var SalesmanDetails = new Array();
    var cashboxDetails = new Array();
    var VatDetails = new Array();
    var ItemFamilyDetails = new Array();
    //Model
    var InvoiceStatisticsModel = new Array();
    var InvoicemodelForReturn = new Array();
    var MasterDetailModel = new SlsInvoiceMasterDetails();
    var InvoiceModel = new I_Sls_TR_Invoice();
    var invoiceItemsModel = new Array();
    var invoiceItemSingleModel = new I_Sls_TR_InvoiceItems();
    var Tax_Type_Model = new Tax_Type();
    //TextBoxes
    var txtStartDate;
    var txtEndDate;
    var txtItemCount;
    var txtPackageCount;
    var txtTotalbefore;
    var txtTotalDiscount;
    var txtTotal;
    var txtTax;
    var txtNet;
    var txtCashAmount;
    var txtInvoiceDate;
    var txtInvoiceNumber;
    var lblReturnNumber;
    //checkbox
    var chkActive;
    //buttons 
    var btnShow;
    var btnAdd;
    var btnBack; // btnBack btnSave
    var btnSave;
    var btnInvoiceSearch;
    var btnUpdate;
    //print buttons 
    var btnPrintTrview;
    var btnPrintTrPDF;
    var btnPrintTrEXEL;
    var btnPrintTransaction;
    var btnPrintsFrom_To;
    // giedView
    var Grid = new JsGrid();
    //global
    var CountGrid = 0;
    var CountItems = 0;
    var PackageCount = 0;
    var CountTotal = 0;
    var TaxCount = 0;
    var NetCount = 0;
    var Tax_Rate = 0;
    var VatPrc;
    var globalInvoiceID = 0;
    var globalRefTrID = 0;
    var StoreID;
    var GlobalReturnID = 0;
    var GlobalDocNo = "";
    //flags
    var Show = true;
    var EditFlag = false;
    var InsertFlag = false;
    var btnPrint;
    var AfterInsertOrUpdateFlag = false;
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);
    var flag_PriceWithVAT = (SysSession.CurrentEnvironment.I_Control[0].SalesPriceWithVAT);
    //------------------------------------------------------ Main Region -----------------------------------
    function InitalizeComponent() {
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
    SlsTrSalesReturn.InitalizeComponent = InitalizeComponent;
    function InitalizeControls() {
        // Drop down lists
        ddlCustomer = document.getElementById("ddlCustomer");
        ddlSalesMan = document.getElementById("ddlSalesMan");
        ddlStateType = document.getElementById("ddlStateType");
        ddlReturnType = document.getElementById("ddlReturnType");
        ddlReturnTypeShow = document.getElementById("ddlReturnTypeShow");
        ddlInvoiceCustomer = document.getElementById("ddlInvoiceCustomer");
        ddlFreeSalesman = document.getElementById("ddlFreeSalesman");
        ddlSalesPerson = document.getElementById("ddlSalesPerson");
        ddlShowFreeReturn = document.getElementById("ddlShowFreeReturn");
        ddlCashBox = document.getElementById("ddlCashBox");
        ddlTaxTypeHeader = document.getElementById("ddlTaxTypeHeader");
        txtRefNo = document.getElementById("txtRefNo");
        txtRemarks = document.getElementById("txtRemarks");
        //TextBoxes
        searchbutmemreport = document.getElementById("searchbutmemreport");
        txtStartDate = document.getElementById("txtStartDate");
        txtEndDate = document.getElementById("txtEndDate");
        txtItemCount = document.getElementById("txtItemCount");
        txtPackageCount = document.getElementById("txtPackageCount");
        txtTotalDiscount = document.getElementById("txtTotalDiscount");
        txtTotalbefore = document.getElementById("txtTotalbefore");
        txtTotal = document.getElementById("txtTotal");
        txtTax = document.getElementById("txtTax");
        txtNet = document.getElementById("txtNet");
        txtInvoiceDate = document.getElementById("txtInvoiceDate");
        txtInvoiceNumber = document.getElementById("txtInvoiceNumber");
        lblReturnNumber = document.getElementById("lblReturnNumber");
        txtCashAmount = document.getElementById("txtCashAmount");
        //checkbox
        chkActive = document.getElementById("chkActive");
        //button
        btnShow = document.getElementById("btnShow");
        btnAdd = document.getElementById("btnAdd");
        btnBack = document.getElementById("btnBack");
        btnSave = document.getElementById("btnSave");
        btnInvoiceSearch = document.getElementById("btnInvoiceSearch");
        btnUpdate = document.getElementById("btnUpdate");
        //print 
        btnPrintTrview = document.getElementById("btnPrintTrview");
        btnPrintTrPDF = document.getElementById("btnPrintTrPDF");
        btnPrintTrEXEL = document.getElementById("btnPrintTrEXEL");
        btnPrintTransaction = document.getElementById("btnPrintTransaction");
        btnPrintsFrom_To = document.getElementById("btnPrintsFrom_To");
        btnPrint = document.getElementById("btnPrint");
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
        btnPrintTrview.onclick = function () { PrintReport(1); };
        btnPrintTrPDF.onclick = function () { PrintReport(2); };
        btnPrintTrEXEL.onclick = function () { PrintReport(3); };
        //btnPrint.onclick = () => { PrintReport(4); }
        btnPrintTransaction.onclick = PrintTransaction;
        btnPrintsFrom_To.onclick = btnPrintsFrom_To_onclick;
        searchbutmemreport.onkeyup = _SearchBox_Change;
    }
    function Check_on_user_type() {
        if (SysSession.CurrentEnvironment.UserType == 1 || SysSession.CurrentEnvironment.UserType == 3) { //Salesman
            var SalesId_1 = SysSession.CurrentEnvironment.SalesManID;
            SalesmanDetails = SalesmanDetails.filter(function (s) { return s.SalesmanId == SalesId_1; });
        }
    }
    //------------------------------------------------------ Events Region -----------------------------------
    function ddlCustomer_onchange() {
        var customerID = Number(ddlCustomer.value);
        var custObj = VendorDetails.filter(function (s) { return s.CustomerId == customerID; });
        FillddlSalesMan();
        if (SysSession.CurrentEnvironment.UserType != 1 && SysSession.CurrentEnvironment.UserType == 3) {
            ddlSalesMan.value = custObj[0].SalesmanId.toString();
        }
    }
    function ddlInvoiceCustomer_onchange() {
        var customerID = Number(ddlInvoiceCustomer.value);
        var custObj = VendorDetails.filter(function (s) { return s.CustomerId == customerID; });
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
            var cashCustomers = VendorDetails.filter(function (s) { return s.IsCreditCustomer == false; });
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
            var creditCustomers = VendorDetails.filter(function (s) { return s.IsCreditCustomer == true; });
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
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    debugger;
                    InvoiceStatisticsModel = result.Response;
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
                    }
                    else {
                        chkActive.checked = false;
                    }
                    if (InvoiceStatisticsModel[0].IsCash == true) {
                        $('#ddlReturnTypeShow').prop("value", 1);
                        $("#DivCashBox1").removeClass("display_none");
                        $("#DivCashBox2").removeClass("display_none");
                        $("#txtCashAmount").val("");
                    }
                    else {
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
                success: function (d) {
                    var result = d;
                    if (result.IsSuccess) {
                        SlsInvoiceItemsDetails = result.Response;
                        var buildedRows = 0;
                        CountGrid = 0;
                        for (var i = 0; i < SlsInvoiceItemsDetails.length; i++) {
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
        }
        catch (e) {
        }
    }
    function checkUnApprovedReturns(invoiceID) {
        var res = false;
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("SlsTrSales", "GetAllUnApprovedSlsReturnListByInvoiceID"),
            data: {
                invoiceID: invoiceID, CompCode: compcode, BranchCode: BranchCode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
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
        if (!SysSession.CurrentPrivileges.EDIT)
            return;
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
        for (var cnt = 0; cnt <= CountGrid; cnt++) {
            $("#txtReturnQuantity" + cnt).removeAttr("disabled");
            $('.btn-number3' + cnt).removeAttr("disabled");
            $('.input-number3' + cnt).removeAttr("disabled");
        }
        EditFlag = true;
        SysSession.CurrentEnvironment.I_Control[0].IvoiceDateEditable == true ? $('#txtInvoiceDate').removeAttr("disabled") : $('#txtInvoiceDate').attr("disabled", "disabled");
    }
    function btnInvoiceSearch_onclick() {
        debugger;
        var sys = new SystemTools();
        sys.FindKey(Modules.SlsTrReturn, "btnInvoiceSearch", "CompCode=" + compcode + "and BranchCode = " + BranchCode + " and TrType = 0  and Status = 1 ", function () {
            var id = SearchGrid.SearchDataGrid.SelectedKey;
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
                if (!SysSession.CurrentPrivileges.EDIT)
                    return;
                for (var i_1 = 0; i_1 < CountGrid; i_1++) {
                    if (!ValidationGrid(i_1))
                        return;
                }
                Update();
            }
            else {
                if (!SysSession.CurrentPrivileges.AddNew)
                    return;
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
            $("#divIconbar").removeAttr("disabled");
            $("#divIconbar").removeClass("disabledIconbar");
            $("#cotrolDiv").removeAttr("disabled");
            $("#cotrolDiv").removeClass("disabledDiv");
            $("#divShow").removeAttr("disabled");
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
                }
                else {
                    $("#txtCashAmount").val('');
                }
            }
            catch (e) {
            }
            $("#div_Data").html('');
            for (var i = 0; i < SlsInvoiceItemsDetails.length; i++) {
                BuildControls(i);
            }
            CountGrid = SlsInvoiceItemsDetails.length;
            CountItems = SlsInvoiceItemsDetails.length;
            txtInvoiceDate.value = DateFormat(InvoiceStatisticsModel[0].TrDate.toString());
            if (InvoiceStatisticsModel[0].Status == 1) {
                chkActive.checked = true;
            }
            else {
                chkActive.checked = false;
            }
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
        if (!SysSession.CurrentPrivileges.AddNew)
            return;
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
        if (!SysSession.CurrentPrivileges.AddNew)
            return;
        txtInvoiceDate.value = GetDate();
        var unApprovedReturn = false;
        lblReturnNumber.value = "";
        unApprovedReturn = checkUnApprovedReturns(globalRefTrID);
        if (unApprovedReturn == true) {
            DisplayMassage('لا يمكن اضافه مرتجع علي الفاتورة قبل اعتماد المرتجعات السابقه', 'you cannot add new return on invoice before approve previous one ', MessageType.Error);
        }
        else {
            Show = false;
            $("#btnBack").removeClass("display_none");
            $("#btnSave").removeClass("display_none");
            $("#btnPrint").addClass("display_none");
            $('#btnUpdate').addClass("display_none");
            for (var i = 0; i < CountGrid; i++) {
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
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    VendorDetails = result.Response;
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
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    SalesmanDetails = result.Response;
                    SalesmanDetails = SalesmanDetails.filter(function (s) { return s.Isactive == true; });
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
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    cashboxDetails = result.Response;
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
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    SalesmanDetails = result.Response;
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
            for (var i = 0; i < StateDetailsEn.length; i++) {
                var newoption = document.createElement("option");
                newoption.value = i.toString();
                newoption.text = StateDetailsEn[i];
                ddlStateType.options.add(newoption);
            }
        }
        else {
            for (var i = 0; i < StateDetailsAr.length; i++) {
                var newoption = document.createElement("option");
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
            for (var i = 0; i < StateDetailsEn.length; i++) {
                var newoption = document.createElement("option");
                newoption.value = i.toString();
                newoption.text = StateDetailsEn[i];
                ddlReturnType.options.add(newoption);
            }
        }
        else {
            for (var i = 0; i < StateDetailsAr.length; i++) {
                var newoption = document.createElement("option");
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
            for (var i = 0; i < AddReturnDetailsEn.length; i++) {
                var newoption = document.createElement("option");
                newoption.value = i.toString();
                newoption.text = AddReturnDetailsEn[i];
                ddlReturnTypeShow.options.add(newoption);
            }
        }
        else {
            for (var i = 0; i < AddReturnDetailsAr.length; i++) {
                var newoption = document.createElement("option");
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
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    VatDetails = result.Response;
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
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    FamilyDetails = result.Response;
                }
            }
        });
    }
    function FillddlItem(ItemFamilyID) {
        ItemDetails = ItemFamilyDetails.filter(function (x) { return x.ItemFamilyID == ItemFamilyID && x.StoreId == StoreID; });
    }
    //------------------------------------------------------ Get Functions Region -----------------------------------
    function GetAllIItem() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("StkDefItems", "GetAllItemWithoutOnhandQty"),
            data: {
                CompCode: compcode, FinYear: Finyear, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    ItemFamilyDetails = result.Response;
                }
            }
        });
    }
    function _SearchBox_Change() {
        if (searchbutmemreport.value != "") {
            //debugger
            var search_1 = searchbutmemreport.value.toLowerCase();
            SearchDetails = SlsInvoiceStatisticsDetails.filter(function (x) { return x.TrNo.toString().search(search_1) >= 0 || x.CustomerName.toLowerCase().search(search_1) >= 0
                || x.Slsm_DescA.toLowerCase().search(search_1) >= 0; });
            Grid.DataSource = SearchDetails;
            Grid.Bind();
        }
        else {
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
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    AD_VatTypeDetails = result.Response;
                    VatPrc = AD_VatTypeDetails.VatPerc;
                }
            }
        });
    }
    function GetInvoiceByID(invoiceID) {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("SlsTrSales", "GetSlsInvoiceByIDFromStatistics"),
            data: { invoiceID: invoiceID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    InvoicemodelForReturn = result.Response;
                    if (InvoicemodelForReturn.length > 0)
                        txtInvoiceNumber.value = InvoicemodelForReturn[0].TrNo.toString();
                }
            }
        });
    }
    //------------------------------------------------------ Normal Grid Region -----------------------------------
    function InitializeGrid() {
        var res = GetResourceList("");
        Grid.ElementName = "divGridDetails_View";
        Grid.Paging = true;
        Grid.PageSize = 10;
        Grid.Sorting = true;
        Grid.InsertionMode = JsGridInsertionMode.Binding;
        Grid.Editing = false;
        Grid.Inserting = false;
        Grid.SelectedIndex = 1;
        Grid.OnRowDoubleClicked = Grid_RowDoubleClicked;
        Grid.OnItemEditing = function () { };
        Grid.PrimaryKey = "InvoiceID";
        Grid.Columns = [
            { title: res, name: "InvoiceID", type: "text", width: "2%", visible: false },
            { title: res.App_Number, name: "TrNo", type: "text", width: "13%" },
            {
                title: res.App_date, css: "ColumPadding", name: "TrDate", width: "20%",
                itemTemplate: function (s, item) {
                    var txt = document.createElement("label");
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
                itemTemplate: function (s, item) {
                    var txt = document.createElement("label");
                    txt.innerHTML = item.IsCash == true ? (lang == "ar" ? "نقدي" : "Cash") : (lang == "ar" ? "علي الحساب" : "On account");
                    return txt;
                }
            },
            {
                title: res.App_Certified, css: "ColumPadding", name: "statusDesciption", width: "17%",
                itemTemplate: function (s, item) {
                    var txt = document.createElement("label");
                    txt.innerHTML = item.Status == 1 ? (lang == "ar" ? "معتمد" : "A certified") : (lang == "ar" ? "غير معتمد" : "Not supported");
                    ;
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
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    SlsInvoiceStatisticsDetails = result.Response;
                    Grid.DataSource = SlsInvoiceStatisticsDetails;
                    Grid.Bind();
                }
            }
        });
    }
    function Grid_RowDoubleClicked() {
        Show = true;
        $("#divReturnDetails").removeClass("display_none");
        InvoiceStatisticsModel = new Array();
        Selecteditem = SlsInvoiceStatisticsDetails.filter(function (x) { return x.InvoiceID == Number(Grid.SelectedKey); });
        if (AfterInsertOrUpdateFlag == true) {
            Selecteditem = SlsInvoiceStatisticsDetails.filter(function (x) { return x.InvoiceID == GlobalReturnID; });
            AfterInsertOrUpdateFlag = false;
        }
        InvoiceStatisticsModel = Selecteditem;
        if (InvoiceStatisticsModel.length > 0) {
            GlobalReturnID = Number(InvoiceStatisticsModel[0].InvoiceID);
            GlobalDocNo = InvoiceStatisticsModel[0].DocNo;
            globalRefTrID = Number(InvoiceStatisticsModel[0].RefTrID);
            txtRefNo.value = InvoiceStatisticsModel[0].RefNO.toString();
            txtRemarks.value = InvoiceStatisticsModel[0].Remark.toString();
            StoreID = InvoiceStatisticsModel[0].StoreId;
            ddlTaxTypeHeader.value = InvoiceStatisticsModel[0].VatType.toString();
            txtItemCount.value = InvoiceStatisticsModel[0].Line_Count.toString();
            txtPackageCount.value = InvoiceStatisticsModel[0].Tot_Qty.toString();
            txtTotalDiscount.value = InvoiceStatisticsModel[0].ItemDiscountTotal.toString();
            txtTotalbefore.value = InvoiceStatisticsModel[0].ItemTotal.toString();
            txtTotal.value = InvoiceStatisticsModel[0].TotalAmount.toString();
            txtTax.value = InvoiceStatisticsModel[0].VatAmount.toString();
            txtNet.value = InvoiceStatisticsModel[0].NetAfterVat.toString();
            if (InvoiceStatisticsModel[0].RefTrID != null) {
                var RefID = InvoiceStatisticsModel[0].RefTrID;
                GetInvoiceByID(RefID);
            }
            var ReturnNum = InvoiceStatisticsModel[0].TrNo.toString();
            lblReturnNumber.value = ReturnNum;
            txtInvoiceDate.value = DateFormat(InvoiceStatisticsModel[0].TrDate.toString());
            if (InvoiceStatisticsModel[0].CustomerId != null) {
                $('#txtCustomerName').prop("value", InvoiceStatisticsModel[0].Cus_NameA.toString());
                var custId = InvoiceStatisticsModel[0].CustomerId.toString();
                ddlInvoiceCustomer.value = custId;
            }
            else {
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
            }
            else {
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
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    SlsInvoiceItemsDetails = result.Response;
                    $("#div_Data").html('');
                    CountGrid = 0;
                    debugger;
                    for (var i = 0; i < SlsInvoiceItemsDetails.length; i++) {
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
    function BuildControls(cnt) {
        var html;
        html = "<tr id=\"No_Row" + cnt + "\">\n\t                <td>\n                    <input id=\"InvoiceItemID" + cnt + "\" type=\"hidden\" class=\"display_none\"  />\n\t\t                <div class=\"form-group\">\n                            <input id=\"txtSerial" + cnt + "\" type=\"text\" class=\"form-control no-border\" disabled />\n\t\t                </div>\n\t                </td>\n\t                <td>\n\t\t                <div class=\"form-group\">\n                            <select id=\"ddlFamily" + cnt + "\" class=\"form-control\">\n                                <option value=\"null\"> " + (lang == "ar" ? "النوع" : "Type") + "</option>\n                            </select>\n\t\t                </div>\n\t                </td>\n\t                <td>\n\t\t                <div class=\"form-group\">\n                            <select id=\"ddlItem" + cnt + "\" class=\"form-control\">\n                                <option value=\"null\">" + (lang == "ar" ? "الصنف" : "Item") + " </option>\n                            </select>\n\t\t                </div>\n\t                </td>\n\t                <td>\n\t\t                <div class=\"form-group\">\n                            <input id=\"txtQuantity" + cnt + "\" type=\"text\" class=\"form-control\" name=\"quant[1]\" value=\"0\" min=\"0\" max=\"1000\" disabled />\n\t\t                </div>\n\t                </td>\n\t                <td>\n\t\t                <div class=\"form-group ps-1\">\n\t\t\t                <input class=\"counter\" type=\"number\" data-id=\"number\" id=\"txtReturnQuantity" + cnt + "\" name=\"quant[3]\" value=\"1\" min=\"0\" max=\"1000\" step=\"1\"/>\n\t\t\t                <div class=\"value-button decrease-button btn-number3" + cnt + "\" data-id=\"decrease\" id=\"btnminus1\" data-type=\"minus\" data-field=\"quant[3]\">-</div>\n\t\t\t                <div class=\"value-button increase-button btn-number3" + cnt + "\" data-id=\"increase\" id=\"btnplus3\" data-type=\"plus\" data-field=\"quant[3]\">+</div>\n\t\t                </div>\n\t                </td>\n\t                <td>\n\t\t                <div class=\"form-group\">\n\t\t\t                <input type=\"text\" class=\"form-control\" id=\"txtPrice" + cnt + "\" name=\"quant[3]\" value=\"0\" min=\"0\" step=\"1\"/>\n\t\t                </div>\n\t                </td>\n\t                <td>\n\t\t                <div class=\"form-group\">\n\t\t\t                <input type=\"text\" class=\"form-control\" id=\"txtUnitpriceWithVat" + cnt + "\" value=\"0\" min=\"0\" step=\"1\"/>\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\" >\n\t\t\t               <input id=\"txtDiscountPrc" + cnt + "\" type=\"text\" disabled class=\"form-control\"  name=\"quant[3]\" class=\"form-control\" value=\"0\" min=\"0\" step=\"1\">\n\t\t                </div>\n\t                </td>  \n                    <td>\n\t\t                <div class=\"form-group\"style=\"width: 84px;\" >\n\t\t\t               <input id=\"txtDiscountAmount" + cnt + "\" type=\"text\" disabled class=\"form-control\"  name=\"quant[3]\" class=\"form-control\" value=\"0\" min=\"0\" step=\"1\">\n\t\t                </div>\n\t                </td>  \n                    <td>\n\t\t                <div class=\"form-group\"style=\"width: 84px;\" >\n\t\t\t               <input id=\"txtNetUnitPrice" + cnt + "\" type=\"text\" disabled class=\"form-control\"  name=\"quant[3]\" class=\"form-control\" value=\"0\" min=\"0\" step=\"1\">\n\t\t                </div>\n\t                </td>\n\t                <td>\n\t\t                <div class=\"form-group\">\n\t\t\t                <input type=\"text\" class=\"form-control\" id=\"txtTotal" + cnt + "\" disabled />\n\t\t                </div>\n\t                </td>\n\t                <td>\n\t\t                <div class=\"form-group\">\n\t\t\t                <input type=\"text\" class=\"form-control\" id=\"txtTax_Rate" + cnt + "\"  disabled />\n\t\t                </div>\n\t                </td>\n\t                <td>\n\t\t                <div class=\"form-group\">\n\t\t\t                <input type=\"text\" class=\"form-control\" id=\"txtTax" + cnt + "\" disabled/>\n\t\t                </div>\n\t                </td>\n\t                <td>\n\t\t                <div class=\"form-group\">\n\t\t\t                <input type=\"text\" class=\"form-control\" id=\"txtTotAfterTax" + cnt + "\" disabled />\n\t\t                </div>\n                        <input id=\"vatnatid" + cnt + "\" name = \"\" type = \"hidden\" class=\"form-control\"/>\n\t\t                <input id=\"UnitCost" + cnt + "\" name = \"\" type = \"hidden\" class=\"form-control\"/>\n\t\t                <input id=\"txt_StatusFlag" + cnt + "\" name = \"\" type = \"hidden\" class=\"form-control\"/>\n\t\t                <input id=\"txt_ID" + cnt + "\" name = \"\" type = \"hidden\" class=\"form-control\"/>\n\t                </td>\n\t        \n                </tr>";
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
                }
                else if (type == 'plus') {
                    if (currentVal < Number(input.attr('max'))) {
                        input.val((currentVal + 0.5)).change();
                    }
                    if (parseFloat(input.val()) == parseFloat(input.attr('max'))) {
                        $(this).val(input.attr('max'));
                    }
                }
            }
            else {
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
                $(".btn-number2" + cnt + "[data-type='minus'][data-field='" + name + "']").removeAttr('disabled');
            }
            else {
                alert('Sorry, the minimum value was reached');
                $(this).val($(this).data('oldValue'));
            }
            if (valueCurrent <= maxValue) {
                $(".btn-number2" + cnt + "[data-type='plus'][data-field='" + name + "']").removeAttr('disabled');
            }
            else {
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
                }
                else if (type == 'plus') {
                    if (currentVal < Number(input.attr('max'))) {
                        input.val((currentVal + 1)).change();
                    }
                    if (parseFloat(input.val()) == parseFloat(input.attr('max'))) {
                        $(this).val(input.attr('max'));
                    }
                }
            }
            else {
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
                $(".btn-number3" + cnt + "[data-type='minus'][data-field='" + name + "']").removeAttr('disabled');
            }
            else {
                alert('Sorry, the minimum value was reached');
                $(this).val($(this).data('oldValue'));
            }
            if (valueCurrent <= maxValue) {
                $(".btn-number3" + cnt + "[data-type='plus'][data-field='" + name + "']").removeAttr('disabled');
            }
            else {
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
            }
            else {
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
                $(".btn-number1" + cnt + "[data-type='minus'][data-field='" + name + "']").removeAttr('disabled');
            }
            else {
                alert('Sorry, the minimum value was reached');
                $(this).val($(this).data('oldValue'));
            }
            if (valueCurrent <= maxValue) {
                $(".btn-number1" + cnt + "[data-type='plus'][data-field='" + name + "']").removeAttr('disabled');
            }
            else {
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
            }
            else {
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
                }
                else {
                    var NumberSelect = ItemDetails.filter(function (s) { return s.ItemID == itemID; });
                    var GetUnitprice = Get_PriceWithVAT(NumberSelect[0].UnitPrice, VatPrc, flag_PriceWithVAT);
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
                    }
                    else {
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
            }
            else {
                var total = Number(txtQuantityValue) * Number(txtPriceValue);
                $("#txtTotal" + cnt).val(total.RoundToSt(2)); //= total;
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
            }
            else {
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
            if (Number(txtReturnQuantityValue) <= Number(txtQuantityValue)) { //acept qty 
                var total = Number(txtReturnQuantityValue) * Number(txtPriceValue);
                $("#txtTotal" + cnt).val(total.RoundToSt(2)); //= total;
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
            if (Number(txtReturnQuantityValue) <= Number(txtQuantityValue)) { //acept qty 
                var total = Number(txtReturnQuantityValue) * Number(txtPriceValue);
                $("#txtTotal" + cnt).val(total.RoundToSt(2)); //= total;
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
        var FamilyID = Number(SlsInvoiceItemsDetails[cnt].ItemFamilyID);
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
            var GetUnitprice = Get_PriceWithVAT(SlsInvoiceItemsDetails[cnt].Unitprice, SlsInvoiceItemsDetails[cnt].VatPrc, false);
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
            var InvoiceSoldQty = SlsInvoiceItemsDetails[cnt].SoldQty - SlsInvoiceItemsDetails[cnt].TotRetQty;
            var total = InvoiceSoldQty * SlsInvoiceItemsDetails[cnt].NetUnitPrice;
            var vat = total * SlsInvoiceItemsDetails[cnt].VatPrc / 100;
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
            var TotalDiscount = 0;
            var Totalbefore = 0;
            for (var i = 0; i < CountGrid; i++) {
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
        for (var cnt = 0; cnt <= CountGrid; cnt++) {
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
        var newCount = 0;
        for (var i = 0; i < CountGrid; i++) {
            if ($("#txt_StatusFlag" + i).val() != "d" && $("#txt_StatusFlag" + i).val() != "m") {
                newCount++;
            }
        }
        var NetVal = 0;
        var CashVal = 0;
        if (txtNet.value != "")
            NetVal = Number(Number(txtNet.value).RoundToSt(2));
        if (txtCashAmount.value != "")
            CashVal = Number(Number(txtCashAmount.value).RoundToSt(2));
        if (newCount == 0) {
            DisplayMassage("برجاء ادخال بيانات المرتجع", 'please Enter Return Data', MessageType.Error);
            return false;
        }
        else if (chkActive.checked == true && ddlReturnTypeShow.value == "1" && (ddlCashBox.value == "null" || ddlCashBox.value == null)) {
            DisplayMassage("برجاءاختيار الصندوق", 'please select Cashbox', MessageType.Error);
            Errorinput(ddlCashBox);
            return false;
        }
        else if (txtCashAmount.value != "" && chkActive.checked == true && ddlReturnTypeShow.value == "1" && (NetVal != CashVal)) {
            DisplayMassage("يجب ان يتساوي المبلغ المسدد مع الصافي", 'paid amount must be equal to the net', MessageType.Error);
            Errorinput(txtNet);
            return false;
        }
        else if (!CheckPeriodDate(txtInvoiceDate.value, "I")) {
            debugger;
            DisplayMassage("لا يمكنك الاضافه او التعديل في هذة الفتره المغلقه ", "Please select a Invoice data", MessageType.Error);
            Errorinput(txtInvoiceDate);
            return false;
        }
        return true;
    }
    function ValidationGrid(i) {
        if ($("#txt_StatusFlag" + i).val() != "d" && $("#txt_StatusFlag" + i).val() != "m") {
            var RetQty = Number($("#txtReturnQuantity" + i).val());
            if (RetQty == 0) {
                DisplayMassage('( يجب أضافه قيمه للكمية المرتجعه ع الفاتورة)', 'you must add value to the return quantity', MessageType.Error);
                Errorinput($("#txtReturnQuantity" + i));
                return false;
            }
            else
                return true;
        }
    }
    function checkRepeatedItems(itemValue, familyValue, NumberRowid) {
        var items = Number(txtItemCount.value);
        var flag = false;
        for (var i = 0; i < items - 1; i++) {
            if (Number($("#ddlItem" + i).val()) == itemValue && Number($("#ddlFamily" + i).val()) == familyValue && Number($("#InvoiceItemID" + i).val()) != NumberRowid) { // $("#No_Row" + cnt).val();
                flag = true;
            }
        }
        return flag;
    }
    //--------------------------------------------------- Main Functions-----------------------------------------------
    function Assign() {
        MasterDetailModel = new SlsInvoiceMasterDetails();
        invoiceItemsModel = new Array();
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
        InvoiceModel.TrType = 1; //0 invoice 1 return
        InvoiceModel.SlsInvSrc = 1; // 1 from store 2 from van 
        InvoiceModel.SlsInvType = 1; //  retail 
        InvoiceModel.StoreId = StoreID; //main store
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
        }
        else {
            InvoiceModel.Status = 0;
        }
        InvoiceModel.RefTrID = Number(globalRefTrID);
        // Details
        var StatusFlag;
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
                invoiceItemSingleModel.StockUnitCost = Number($("#UnitCost" + i).val());
                invoiceItemSingleModel.VatNatID = Number($("#vatnatid" + i).val());
                if (Qty != 0) {
                    invoiceItemsModel.push(invoiceItemSingleModel);
                }
            }
            if (StatusFlag == "u") {
                var invoiceItemId = $("#InvoiceItemID" + i).val();
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
                invoiceItemSingleModel.StockUnitCost = Number($("#UnitCost" + i).val());
                invoiceItemSingleModel.VatNatID = Number($("#vatnatid" + i).val());
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
            success: function (d) {
                var result = d;
                if (result.IsSuccess == true) {
                    var res = result.Response;
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
                }
                else {
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
        }
        else {
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
            success: function (d) {
                var result = d;
                if (result.IsSuccess == true) {
                    var res = result.Response;
                    DateSetsSccess("txtInvoiceDate", "txtStartDate", "txtEndDate");
                    GlobalReturnID = res.InvoiceID;
                    DisplayMassage("تم تعديل المرتجع بنجاح  ", 'Return number ' + res.TrNo + ' modified Successfully', MessageType.Succeed);
                    $('#txtUpdatedBy').prop("value", res.UpdatedBy);
                    $('#txtUpdatedAt').prop("value", res.UpdatedAt);
                    displayDate_speed(GlobalReturnID, res);
                    Success();
                    Save_Succ_But();
                }
                else {
                    DisplayMassage("هناك خطـأ", '(Error)', MessageType.Error);
                }
            }
        });
        EditFlag = false;
    }
    function openReturn() {
        if (!CheckPeriodDate(txtInvoiceDate.value, "I")) {
            debugger;
            DisplayMassage("لا يمكنك الاضافه او التعديل في هذة الفتره المغلقه ", "Please select a Invoice data", MessageType.Error);
            Errorinput(txtInvoiceDate);
            chkActive.checked = true;
            return false;
        }
        Assign();
        InvoiceModel.InvoiceID = GlobalReturnID;
        if (InvoiceStatisticsModel.length > 0) {
            InvoiceModel.CreatedBy = InvoiceStatisticsModel[0].CreatedBy;
            InvoiceModel.CreatedAt = InvoiceStatisticsModel[0].CreatedAt;
        }
        else {
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
            success: function (d) {
                var result = d;
                if (result.IsSuccess == true) {
                    var res = result.Response;
                    DisplayMassage('( تم فك اعتماد الفاتورة (' + res.TrNo + ') بنجاح )', '(The invoice has been successfully modified)', MessageType.Succeed);
                    GlobalReturnID = res.InvoiceID;
                    $('#divCreationPanel').removeClass("display_none");
                    $('#txtUpdatedBy').prop("value", res.UpdatedBy);
                    $('#txtUpdatedAt').prop("value", res.UpdatedAt);
                    displayDate_speed(GlobalReturnID, res);
                    chkActive.checked = false;
                    chkActive.disabled = true;
                    btnUpdate.disabled = false;
                }
                else {
                    btnUpdate.disabled = true;
                }
            }
        });
    }
    function displayDate_speed(invID, res) {
        SlsInvoiceStatisticsDetails = SlsInvoiceStatisticsDetails.filter(function (x) { return x.InvoiceID != invID; });
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
    function PrintReport(OutType) {
        if (!SysSession.CurrentPrivileges.PrintOut)
            return;
        var rp = new ReportParameters();
        rp.RepType = OutType; //output report as View
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
        if (ddlSalesMan.selectedIndex > 0) {
            rp.SalesmanID = Number($("#ddlSalesMan").val());
        }
        else {
            rp.SalesmanID = -1;
        }
        if ($("#ddlCustomer").val() == "null") {
            rp.CustomerID = -1;
        }
        else {
            rp.CustomerID = Number($("#ddlCustomer").val());
        }
        rp.CashType = Number($("#ddlReturnType").val());
        rp.OperationId = -1;
        rp.Status = Number($("#ddlStateType").val());
        rp.TrType = 1;
        rp.src = 1;
        Ajax.Callsync({
            url: Url.Action("IProc_Rpt_SlsInvoiceList", "GeneralReports"),
            data: rp,
            success: function (d) {
                var result = d.result;
                window.open(result, "_blank");
            }
        });
    }
    SlsTrSalesReturn.PrintReport = PrintReport;
    function PrintTransaction() {
        if (!SysSession.CurrentPrivileges.PrintOut)
            return;
        var rp = new ReportParameters();
        rp.Type = 0;
        rp.Repdesign = 1;
        debugger;
        rp.TRId = GlobalReturnID;
        rp.Name_function = "rptInvoiceNoteRet";
        localStorage.setItem("Report_Data", JSON.stringify(rp));
        localStorage.setItem("result", '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>');
        window.open(Url.Action("ReportsPopup", "Home"), "_blank");
    }
    function DownloadInvoicePdf() {
        var rp = new ReportParameters();
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
        debugger;
        rp.TRId = GlobalReturnID;
        Ajax.CallAsync({
            url: Url.Action("rptInvoiceNoteRet", "Reports_pdf"),
            data: rp,
            success: function (d) {
            }
        });
    }
    function btnPrintsFrom_To_onclick() {
        btnShow_onclick();
        var startDate = DateFormatRep(txtStartDate.value).toString();
        var endDate = DateFormatRep(txtEndDate.value).toString();
        var customerId = 0;
        var status = 0;
        var SalesMan = 0;
        var IsCash = 0;
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
        }
        else if (Number(ddlReturnType.value) == 1) {
            IsCash = 1;
        }
        else {
            IsCash = 2;
        }
        try {
            var Name_ID = 'InvoiceID';
            var NameTable = 'I_Sls_TR_Invoice';
            var Condation1 = " SlsInvSrc = 1 and  TrType = 1 and CompCode = " + compcode + " and BranchCode =" + BranchCode + " " +
                " and TrDate >=' " + startDate + "' and TrDate <= ' " + endDate + " ' ";
            var Condation2 = " ";
            if (customerId != 0 && customerId != null)
                Condation2 = Condation2 + " and CustomerId =" + customerId;
            if (SalesMan != 0 && SalesMan != null)
                Condation2 = Condation2 + " and SalesmanId =" + SalesMan; // and Status = " + Status
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
            var Condation3 = Condation1 + Condation2 + " ORDER BY TrNo ASC;";
            PrintsFrom_To(TransType.InvoiceReturn, Name_ID, NameTable, Condation3, SlsInvoiceStatisticsDetails.length);
        }
        catch (e) {
            return;
        }
    }
})(SlsTrSalesReturn || (SlsTrSalesReturn = {}));
//# sourceMappingURL=SlsTrSalesReturn.js.map