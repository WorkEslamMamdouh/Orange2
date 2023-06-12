$(document).ready(function () {
    SlsTrSalesManager.InitalizeComponent();
});
var SlsTrSalesManager;
(function (SlsTrSalesManager) {
    //system varables
    var SysSession = GetSystemSession(Modules.SlsTrSalesManager);
    var compcode;
    var BranchCode;
    var sys = new SystemTools();
    var vatType;
    var Finyear;
    //ddl
    var btndiv_1;
    var btndiv_2;
    var btnCustLastPrice;
    var ddlStore;
    var ddlCustomer;
    var ddlSalesmanFilter;
    var ddlSalesman;
    var ddlSalesPersonFilter;
    var ddlSalesPerson;
    var ddlStateType;
    var ddlInvoiceType;
    var ddlInvoiceCustomer;
    var txt_CustCode;
    var ddlType;
    var ddlCashBox;
    // Arrays
    var CashboxDetails = new Array();
    var CustomerDetails = new Array();
    var filterCustomerDetails = new Array();
    var CategoryDetails = new Array();
    var DetailsVatNature = new Array();
    var G_USERSDetails = new Array();
    var StateDetailsAr = new Array();
    var StateDetailsEn = new Array();
    var InvoiceDetailsAr = new Array();
    var InvoiceDetailsEn = new Array();
    var InvoiceTypeDetailsAr = new Array();
    var InvoiceEyptDetailsEn = new Array();
    var displayData = new IQ_GetSlsInvoiceStatisticVer2();
    var SlsInvoiceStatisticsDetails = new Array();
    var Selecteditem = new Array();
    var SearchDetails = new Array();
    var SlsInvoiceItemsDetails = new Array();
    var FamilyDetails = new Array();
    var ItemDetails = new Array();
    var AD_VatTypeDetails = new A_D_VAT_TYPE();
    var SalesmanDetails = new Array();
    var SalesmanFilterDetails = new Array();
    //Models
    var InvoiceStatisticsModel = new Array();
    var InvoiceItemsDetailsModel = new Array();
    var InvoiceModel = new I_Sls_TR_Invoice();
    var MasterDetailsModel = new SlsInvoiceMasterDetails();
    var invoiceItemSingleModel = new I_Sls_TR_InvoiceItems();
    var List_MinUnitPrice = new Array();
    var ItemFamilyDetails = new Array();
    var MasterDetailModel = new SlsInvoiceMasterDetails();
    var ModelPrice = new ModelLastPrice();
    var storeDetails = new Array();
    var AccountDetails = new Array();
    //TextBoxes
    var txt_Tax_total_Discount;
    var txt_Tax_Discount;
    var txt_Tax_total_AfterDiscount;
    var txtStartDate;
    var txtEndDate;
    var txtItemCount;
    var txtTotalbefore;
    var txtTotalDiscount;
    var txtPackageCount;
    var txtTotal;
    var txtTax;
    var txtNet;
    var txtCommission;
    var txtInvoiceDate;
    var txtCustomerMobile;
    var txtInvoiceCustomerName;
    var txt_ApprovePass;
    var searchbutmemreport;
    //labels
    var lblInvoiceNumber;
    var txtRefNo;
    var txtRemarks;
    //checkbox
    var chkActive;
    var StoreID;
    //buttons 
    var btnAdd;
    var btnShow;
    var btnUpdate;
    var btnAddDetails;
    var btnBack; // btnBack btnSave
    var btnSave;
    var btn_Approveprice;
    var btn_Exit_Approveprice;
    //print buttons 
    var btnPrintsFrom_To;
    var btnPrintTrview;
    var btnPrintTrPDF;
    var btnPrintTrEXEL;
    var btnPrintTransaction;
    var btnPrintInvoicePrice;
    var btnPrintslip;
    var btnCustFilter;
    var btnCust;
    // giedView
    var Grid = new JsGrid();
    //global
    var Discount = 0;
    var CountGrid = 0;
    var CountItems = 0;
    var PackageCount = 0;
    var CountTotal = 0;
    var TaxCount = 0;
    var NetCount = 0;
    var commissionCount = 0;
    var VatPrc = 0;
    var Validation_Insert = 0;
    var GlobalinvoiceID = 0;
    var GlobalDocNo = "";
    var invoiceID;
    //flags : 
    var TypeFlag = false;
    var IsSuccess = true;
    var Show = true;
    var NewAdd = true;
    var AutherizeFlag = false;
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);
    var flag_PriceWithVAT = (SysSession.CurrentEnvironment.I_Control[0].SalesPriceWithVAT);
    var btnPrint;
    var Tax_Rate = 0;
    var Tax_Type_Model = new Tax_Type();
    var InvoiceTransCode = 0;
    var Page = true;
    var pageIndex;
    var flagLastPrice = 2;
    var itemid_LastPrice = 0;
    //------------------------------------------------------ Main Region------------------------
    function InitalizeComponent() {
        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = "فواتير التجزئه ";
        }
        else {
            document.getElementById('Screen_name').innerHTML = "Retail invoices";
        }
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);
        Finyear = Number(SysSession.CurrentEnvironment.CurrentYear);
        InitalizeControls();
        InitializeEvents();
        //fillddlCustomer();
        Display_Category();
        FillddlVatNature();
        FillddlFamily();
        fillddlSalesman();
        FillddlStore();
        //txtStartDate.value = DateStartMonth();
        txtStartDate.value = ConvertToDateDash(GetDate()) <= ConvertToDateDash(SysSession.CurrentEnvironment.EndDate) ? GetDate() : SysSession.CurrentEnvironment.EndDate;
        txtEndDate.value = ConvertToDateDash(GetDate()) <= ConvertToDateDash(SysSession.CurrentEnvironment.EndDate) ? GetDate() : SysSession.CurrentEnvironment.EndDate;
        FillddlStateType();
        DisplayMassage;
        FillddlInvoiceType();
        FillddlType();
        vatType = SysSession.CurrentEnvironment.I_Control[0].DefSlsVatType;
        GetVatPercentage();
        $('#ddlStateType').prop("value", "2");
        $('#ddlInvoiceType').prop("value", "2");
        txtItemCount.value = CountItems.toString();
        txtPackageCount.value = PackageCount.toString();
        txtTotal.value = CountTotal.toString();
        txtTax.value = TaxCount.toString();
        txtNet.value = NetCount.toString();
        txtCommission.value = commissionCount.toString();
        GetAllIItem();
        FillddlCashBox();
        $('#btnPrint').addClass('display_none');
        //GetLastPrice(3236)
        InitializeGrid();
    }
    SlsTrSalesManager.InitalizeComponent = InitalizeComponent;
    function InitalizeControls() {
        btnPrint = document.getElementById("btnPrint");
        // Drop down lists
        ddlStore = document.getElementById("ddlStore");
        ddlCustomer = document.getElementById("ddlCustomer");
        ddlSalesmanFilter = document.getElementById("ddlSalesmanFilter");
        ddlSalesman = document.getElementById("ddlSalesman");
        ddlSalesPersonFilter = document.getElementById("ddlSalesPersonFilter");
        ddlSalesPerson = document.getElementById("ddlSalesPerson");
        ddlStateType = document.getElementById("ddlStateType");
        ddlInvoiceCustomer = document.getElementById("ddlInvoiceCustomer");
        txt_CustCode = document.getElementById("txt_CustCode");
        ddlCashBox = document.getElementById("ddlCashBox");
        ddlInvoiceType = document.getElementById("ddlInvoiceType");
        ddlType = document.getElementById("ddlType");
        //TextBoxes
        txtRefNo = document.getElementById("txtRefNo");
        txtRemarks = document.getElementById("txtRemarks");
        searchbutmemreport = document.getElementById("searchbutmemreport");
        txtStartDate = document.getElementById("txtStartDate");
        txt_Tax_Discount = document.getElementById("txt_Tax_Discount");
        txt_Tax_total_Discount = document.getElementById("txt_Tax_total_Discount");
        txt_Tax_total_AfterDiscount = document.getElementById("txt_Tax_total_AfterDiscount");
        txtEndDate = document.getElementById("txtEndDate");
        txtItemCount = document.getElementById("txtItemCount");
        txtTotalDiscount = document.getElementById("txtTotalDiscount");
        txtTotalbefore = document.getElementById("txtTotalbefore");
        txtPackageCount = document.getElementById("txtPackageCount");
        txtTotal = document.getElementById("txtTotal");
        txtTax = document.getElementById("txtTax");
        txtNet = document.getElementById("txtNet");
        txtCommission = document.getElementById("txtCommission");
        txtInvoiceDate = document.getElementById("txtInvoiceDate");
        txtCustomerMobile = document.getElementById("txtCustomerMobile");
        txtInvoiceCustomerName = document.getElementById("txtInvoiceCustomerName");
        txt_ApprovePass = document.getElementById("txt_ApprovePass");
        //labels
        lblInvoiceNumber = document.getElementById("lblInvoiceNumber");
        //checkbox
        chkActive = document.getElementById("chkActive");
        //button
        btndiv_1 = document.getElementById("btndiv_1");
        btndiv_2 = document.getElementById("btndiv_2");
        btnCustLastPrice = document.getElementById("btnCustLastPrice");
        btnAdd = document.getElementById("btnAdd");
        btnShow = document.getElementById("btnShow");
        btnUpdate = document.getElementById("btnUpdate");
        btnAddDetails = document.getElementById("btnAddDetails"); // btnBack btnSave
        btnBack = document.getElementById("btnBack");
        btnSave = document.getElementById("btnSave");
        btn_Approveprice = document.getElementById("btn_Approveprice");
        btn_Exit_Approveprice = document.getElementById("btn_Exit_Approveprice");
        //print 
        btnPrintsFrom_To = document.getElementById("btnPrintsFrom_To");
        btnPrintTrview = document.getElementById("btnPrintTrview");
        btnPrintTrPDF = document.getElementById("btnPrintTrPDF");
        btnPrintTrEXEL = document.getElementById("btnPrintTrEXEL");
        btnPrintTransaction = document.getElementById("btnPrintTransaction");
        btnPrintslip = document.getElementById("btnPrintslip");
        btnCustFilter = document.getElementById("btnCustFilter");
        btnCust = document.getElementById("btnCust");
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
        btnCustFilter.onclick = btnCustFilter_onclick;
        btnCust.onclick = btnCust_onclick;
        txtCommission.onkeyup = txtCommission_onchange;
        ddlType.onchange = ddlType_onchange;
        btn_Approveprice.onclick = btn_Approveprice_onclick;
        btn_Exit_Approveprice.onclick = btn_Exit_Approveprice_onclick;
        txt_CustCode.onchange = txt_CustCode_onchange;
        txt_Tax_Discount.onkeyup = txt_Tax_Discount_onchange;
        txt_Tax_total_Discount.onkeyup = txt_Tax_Discount_onchange;
        txt_Tax_total_AfterDiscount.onkeyup = Tax_Total_onchange;
        //print
        btnPrintTrview.onclick = function () { PrintReport(1); };
        btnPrintTrPDF.onclick = function () { PrintReport(2); };
        btnPrintTrEXEL.onclick = function () { PrintReport(3); };
        //btnPrint.onclick = () => { PrintReport(4); }
        btnPrintTransaction.onclick = PrintTransaction;
        btnPrintslip.onclick = btnPrintslip_onclick;
        ////
        //btnPrintInvoicePrice.onclick = btnPrintInvoicePrice_onclick;
        searchbutmemreport.onkeyup = _SearchBox_Change;
        //searchbutmemreport.onkeyup = _SearchBox_Change1;
        btnPrintsFrom_To.onclick = btnPrintsFrom_To_onclick;
        btndiv_1.onclick = btndiv_1_onclick;
        btndiv_2.onclick = btndiv_2_onclick;
        btnCustLastPrice.onclick = LastPrice_onclick;
    }
    function btnCustFilter_onclick() {
        var cond = "";
        if (SysSession.CurrentEnvironment.I_Control[0].IsLocalBranchCustomer == true) {
            cond = " and BranchCode=" + BranchCode;
        }
        sys.FindKey(Modules.AccDefVendor, "btncustSearch", "CompCode= " + compcode + " " + cond, function () {
            var id = SearchGrid.SearchDataGrid.SelectedKey;
            getCustomerByIdFilter(id, false);
        });
    }
    function getCustomerByIdFilter(custId, iscode) {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefCustomer", "GetCustomerByCustomerId_code"),
            data: { Compcode: compcode, BranchCode: BranchCode, code: iscode, CustomerId: custId, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    AccountDetails = result.Response;
                    $('#txt_CustNameFilter').val(AccountDetails[0].NAMEA);
                    //$('#txt_CustCode').val(AccountDetails.CustomerCODE);
                    ddlCustomer.value = AccountDetails[0].CustomerId.toString();
                }
            }
        });
    }
    function btnCust_onclick() {
        var cond = "";
        if (SysSession.CurrentEnvironment.I_Control[0].IsLocalBranchCustomer == true) {
            cond = " and BranchCode=" + BranchCode;
        }
        sys.FindKey(Modules.AccDefVendor, "btncustSearch", "CompCode= " + compcode + " " + cond, function () {
            var id = SearchGrid.SearchDataGrid.SelectedKey;
            getCustomerById(id, false);
        });
    }
    function getCustomerById(custId, iscode) {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefCustomer", "GetCustomerByCustomerId_code"),
            data: { Compcode: compcode, BranchCode: BranchCode, code: iscode, CustomerId: custId, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                ;
                if (result.IsSuccess) {
                    AccountDetails = result.Response;
                    if (AccountDetails.length > 0) {
                        $('#txt_CustCode').val(AccountDetails[0].CustomerCODE);
                        ddlInvoiceCustomer.value = AccountDetails[0].CustomerId.toString();
                        vatType = AccountDetails[0].VATType;
                        txtInvoiceCustomerName.value = AccountDetails[0].NAMEA.toString();
                        txtCustomerMobile.value = AccountDetails[0].MOBILE;
                        if (SysSession.CurrentEnvironment.UserType != 1 && SysSession.CurrentEnvironment.UserType != 3) {
                            if (AccountDetails[0].SalesmanId != null && AccountDetails[0].SalesmanId != 0) {
                                ddlSalesman.value = AccountDetails[0].SalesmanId.toString();
                            }
                        }
                    }
                    else {
                        DisplayMassage('العميل غير صحيح', '(Please select a customer)', MessageType.Error);
                        $('#txtInvoiceCustomerName').val('');
                        $('#txt_CustCode').val('');
                        ddlInvoiceCustomer.value = '';
                        vatType = SysSession.CurrentEnvironment.I_Control[0].DefSlsVatType;
                        txtCustomerMobile.value = '';
                    }
                }
            }
        });
    }
    function LastPrice_onclick() {
        if (flagLastPrice % 2 === 0) {
            if (ddlInvoiceCustomer.value.trim() == "") {
                DisplayMassage('( لا يوجد عميل علي الفاتوره برجاء اختيار العميل اولاً )', '(Please select a customer)', MessageType.Error);
                Errorinput(txt_CustCode);
                return false;
            }
            if (ddlStore.value == "null") {
                DisplayMassage('(برجاء اختيار المستودع)', '(Please select a customer)', MessageType.Error);
                Errorinput(ddlStore);
                return false;
            }
            var ChackCount = 0;
            for (var i = 0; i < CountGrid; i++) {
                var StatusFlag = $("#txt_StatusFlag" + i).val();
                if (StatusFlag != "d" && StatusFlag != "m") {
                    if (ChackCount == 0) {
                        itemid_LastPrice = $('#ddlItem' + i).val();
                        GetLastPrice(itemid_LastPrice, $("#ddlItem" + i + " option:selected").text());
                    }
                    ChackCount++;
                }
            }
            if (ChackCount == 0) {
                DisplayMassage('(برجاء ادخال الاصناف الفاتوره)', '(Please select a customer)', MessageType.Error);
                Errorinput(btnAddDetails);
                return false;
            }
            //   $("#btnCustLastPrice").animate({ right: '-1%' }, 'slow');
            $("#btnCustLastPrice").addClass("active");
            timerHiddenLastPrice();
        }
        else {
            //$("#btnCustLastPrice").animate({ right: '-87%' }, 'slow');
            $("#btnCustLastPrice").removeClass("active");
        }
        flagLastPrice++;
    }
    function timerHiddenLastPrice() {
        setTimeout(function () {
            //   $("#btnCustLastPrice").animate({ right: '-87%' }, 'slow');
            $("#btnCustLastPrice").removeClass("active");
            flagLastPrice = 2;
        }, 20000);
    }
    function GetLastPrice(itemid, Name) {
        var customerid = ddlInvoiceCustomer.value;
        var storeid = ddlStore.value;
        //let invid = 0;
        var invid = GlobalinvoiceID;
        //@itemid = 3236,
        var flagPrice = true;
        if (itemid.toString() == 'null') {
            flagPrice = false;
        }
        if (ddlStore.value.toString() == 'null') {
            flagPrice = false;
        }
        if (ddlInvoiceCustomer.value.trim() == '') {
            flagPrice = false;
        }
        if (flagPrice == true) {
            Ajax.Callsync({
                type: "Get",
                url: sys.apiUrl("SlsTrSales", "GetLastPrice"),
                data: { CompCode: compcode, BranchCode: BranchCode, itemid: itemid, customerid: customerid, storeid: storeid, invid: invid },
                success: function (d) {
                    var result = d;
                    if (result.IsSuccess) {
                        ModelPrice = result.Response;
                        $("#CustLastPrice").html(ModelPrice.CustLastPrice.toString());
                        $("#CustLastTr").html(ModelPrice.CustLastTr.toString());
                        $("#LastPrice").html(ModelPrice.LastPrice.toString());
                        $("#LastPurchase").html(ModelPrice.LastPurchase.toString());
                        $("#Curcost").html(ModelPrice.Curcost.toString());
                        $("#custLastDate").html(ModelPrice.custLastDate.toString());
                        $("#Name_Item").html(Name);
                    }
                }
            });
        }
        else {
            $("#CustLastPrice").html("-----");
            $("#CustLastTr").html("-----");
            $("#LastPrice").html("-----");
            $("#LastPurchase").html("-----");
            $("#Curcost").html("-----");
            $("#custLastDate").html("-----");
            $("#Name_Item").html("-----");
        }
    }
    function btndiv_1_onclick() {
        $("#btndiv_1").addClass("Actiev");
        //  $("#btndiv_1").removeClass("navbar navbar-inverse");
        $("#btndiv_2").removeClass("Actiev");
        //  $("#btndiv_2").addClass("navbar navbar-inverse");
        $("#div_1").removeClass("display_none");
        $("#div_2").addClass("display_none");
    }
    function btndiv_2_onclick() {
        if (CountGrid == 0 || txtItemCount.value == '0') {
            DisplayMassage(" برجاء ادخال بيانات الفاتورة", "Please enter the invoice data", MessageType.Worning);
            Errorinput(btnAddDetails);
            return false;
        }
        else {
            var CanAdd = true;
            if (CountGrid > 0) {
                for (var i = 0; i < CountGrid; i++) {
                    CanAdd = Validation_Grid(i);
                    if (CanAdd == false) {
                        return false;
                        //break;
                    }
                }
            }
        }
        $("#btndiv_1").removeClass("Actiev");
        //$("#btndiv_1").addClass("navbar navbar-inverse");
        $("#btndiv_2").addClass("Actiev");
        //$("#btndiv_2").removeClass("navbar navbar-inverse");
        $("#div_1").addClass("display_none");
        $("#div_2").removeClass("display_none");
        if ($("#btnUpdate").attr('class') == 'btn btn-primary float_left display_none') {
        }
        else {
            Compute_Invoice();
        }
    }
    function Compute_Invoice() {
        $("#Tax_TotalInvoice").text(txtTotal.value);
        $("#Tax_InvoiceVAT").text(txtTax.value);
        $("#Tax_AfterTotalInvoiceVAT").text(txtNet.value);
        if (NewAdd == true) {
            if (Discount == 0) {
                $("#txt_Tax_Discount").val(0);
            }
            else {
                $("#txt_Tax_Discount").val(Discount);
            }
            $("#txt_Tax_total_Discount").val($("#Tax_TotalInvoice").text());
        }
        else {
            $("#txt_Tax_Discount").val(Selecteditem[0].AllowPrc);
            $("#txt_Tax_total_Discount").val(Selecteditem[0].AllowBase);
        }
        $("#txt_Tax_total_Discount").val($("#Tax_TotalInvoice").text());
        $("#txt_Tax_total_AfterDiscount").val(0);
        $("#txt_Tax_Vat").val(0);
        $("#txt_Tax_AfterTotalVAT").val(0);
        txt_Tax_Discount_onchange();
    }
    function Tax_Net_Total() {
        var Net_total_After = Number($("#Tax_TotalInvoice").text()) - Number($("#txt_Tax_total_AfterDiscount").val());
        $("#Tax_Net_total_AfterDiscount").text(Net_total_After.RoundToSt(2));
        var Tax_Net_VAT = Number($("#Tax_InvoiceVAT").text()) - Number($("#txt_Tax_Vat").val());
        $("#Tax_Net_VAT").text(Tax_Net_VAT.RoundToSt(2));
        var Net_AfterTotalVAT = Number($("#Tax_AfterTotalInvoiceVAT").text()) - Number($("#txt_Tax_AfterTotalVAT").val());
        $("#Tax_Net_AfterTotalVAT").text(Net_AfterTotalVAT.RoundToSt(2));
        var difference_1 = (Number($("#Tax_Net_total_AfterDiscount").text()) * 0.15);
        var difference_2 = difference_1 + Number($("#Tax_Net_total_AfterDiscount").text());
        var difference_3 = difference_2 - Number($("#Tax_Net_AfterTotalVAT").text());
        $("#txtFraction_difference").text(difference_3.RoundToSt(4));
    }
    function txt_Tax_Discount_onchange() {
        if (Number(txt_Tax_Discount.value) > 100) {
            txt_Tax_Discount.value = '100';
            Errorinput(txt_Tax_Discount);
            //return
        }
        Discount = Number(txt_Tax_Discount.value);
        var Disc = txt_Tax_Discount.value;
        var total_Discount = $("#txt_Tax_total_Discount").val();
        var total_After_Discount = 0;
        var Tax_Vat = 0;
        var AfterTotalVAT = 0;
        total_After_Discount = (Number(Disc) * Number(total_Discount)) / 100;
        $("#txt_Tax_total_AfterDiscount").val(total_After_Discount.RoundToSt(2));
        Tax_Vat = (Number($("#txt_Tax_total_AfterDiscount").val()) * VatPrc) / 100;
        $("#txt_Tax_Vat").val(Number(Tax_Vat).RoundToSt(2));
        AfterTotalVAT = (Number($("#txt_Tax_total_AfterDiscount").val()) + Number($("#txt_Tax_Vat").val()));
        $("#txt_Tax_AfterTotalVAT").val(Number(AfterTotalVAT).RoundToSt(2));
        Tax_Net_Total();
    }
    function Tax_Total_onchange() {
        if (Number(txt_Tax_total_AfterDiscount.value) > Number($("#Tax_TotalInvoice").text())) {
            txt_Tax_total_AfterDiscount.value = $("#Tax_TotalInvoice").text();
            Errorinput(txt_Tax_total_AfterDiscount);
        }
        var Tax_Vat = 0;
        var AfterTotalVAT = 0;
        $("#txt_Tax_Discount").val('0');
        $("#txt_Tax_total_Discount").val('0');
        Tax_Vat = (Number($("#txt_Tax_total_AfterDiscount").val()) * VatPrc) / 100;
        $("#txt_Tax_Vat").val(Number(Tax_Vat).RoundToSt(2));
        AfterTotalVAT = (Number($("#txt_Tax_total_AfterDiscount").val()) + Number($("#txt_Tax_Vat").val()));
        $("#txt_Tax_AfterTotalVAT").val(Number(AfterTotalVAT).RoundToSt(2));
        Tax_Net_Total();
    }
    function Check_on_user_type() {
        if (SysSession.CurrentEnvironment.UserType == 1 || SysSession.CurrentEnvironment.UserType == 3) { //Salesman
            var SalesId_1 = SysSession.CurrentEnvironment.SalesManID;
            SalesmanDetails = SalesmanDetails.filter(function (s) { return s.SalesmanId == SalesId_1; });
        }
    }
    //------------------------------------------------------ Events Region------------------------
    function txt_CustCode_onchange() {
        var custID = txt_CustCode.value;
        getCustomerById(custID, true);
        ComputeTotals();
    }
    function ddlType_onchange() {
        if (ddlType.value == "1") { //نقدي 
            if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
                txtInvoiceCustomerName.value = "عميل نقدي عام";
                txtCustomerMobile.value = "";
            }
            else {
                txtInvoiceCustomerName.value = "General cash client";
                txtCustomerMobile.value = "";
            }
            txtCustomerMobile.value = "";
            $('#ddlInvoiceCustomer').val('');
            //$("#ddlInvoiceCustomer").attr("disabled", "disabled");
            $("#txtCustomerMobile").attr("disabled", "disabled");
            $("#txtInvoiceCustomerName").removeAttr("disabled");
            SysSession.CurrentEnvironment.UserType == 2 || SysSession.CurrentEnvironment.UserType == 3 ? ($('#ddlCashBox').prop('selectedIndex', 1), $("#Div_Money").removeClass("display_none")) : $('#ddlCashBox').prop('selectedIndex', 0);
            $('#ddlCashBox').attr('disabled', 'disabled');
            $("#Div_Money").removeClass("display_none");
            vatType = SysSession.CurrentEnvironment.I_Control[0].DefSlsVatType; //From Session
            $('#ddlCashBox').removeAttr("disabled");
            $("#txtCashMoney").val("");
            $("#txtCardMoney").val("");
            TypeFlag = true;
            if (NewAdd == true) {
                chkActive.checked = SysSession.CurrentEnvironment.I_Control[0].IsRetailCashInvoiceDefAuth;
            }
            if (compcode != 4) {
                //if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {//ddlInvoiceCustomer 
                //    DocumentActions.FillCombowithdefult(CustomerDetails, ddlInvoiceCustomer, "CustomerId", "NAMEE", "Select customer");
                //}
                //else {
                //    DocumentActions.FillCombowithdefult(CustomerDetails, ddlInvoiceCustomer, "CustomerId", "NAMEA", "اختر العميل");
                //}
            }
        }
        else { //علي الحساب
            $("#txtCashMoney").val("");
            $("#txtCardMoney").val("");
            $('#ddlCashBox').prop('selectedIndex', 0);
            $('#ddlCashBox').attr('disabled', 'disabled');
            txtInvoiceCustomerName.value = "";
            $("#txtInvoiceCustomerName").attr("disabled", "disabled");
            $("#ddlInvoiceCustomer").removeAttr("disabled");
            $("#txtCustomerMobile").removeAttr("disabled");
            TypeFlag = false;
            $("#Div_Money").addClass("display_none");
            //fillddlCustomer();
            if (NewAdd == true) {
                chkActive.checked = SysSession.CurrentEnvironment.I_Control[0].IsRetailCreditInvoiceDefAuth;
            }
            if (compcode != 4) {
                var cust = CustomerDetails.filter(function (x) { return x.IsCreditCustomer == true; });
                //if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {//ddlInvoiceCustomer 
                //    DocumentActions.FillCombowithdefult(cust, ddlInvoiceCustomer, "CustomerId", "NAMEE", "Select customer");
                //}
                //else {
                //    DocumentActions.FillCombowithdefult(cust, ddlInvoiceCustomer, "CustomerId", "NAMEA", "اختر العميل");
                //}
            }
        }
        //if (CountItems > 0) {
        //    DisplayMassage("من فضلك اعادة ادخال  بيانات الفاتورة مره أخري", "Please re-enter the billing information again", MessageType.Worning);
        //}
        //CountItems = 0;
        //PackageCount = 0;
        //CountTotal = 0;
        //TaxCount = 0;
        //NetCount = 0;
        //CountGrid = 0;
        //$('#div_Data').html("");
        ComputeTotals();
    }
    function txtCommission_onchange() {
        var net = (Number(txtTotal.value) + Number(txtTax.value)).RoundToSt(2);
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
    }
    function checkValidation() {
        if (!SysSession.CurrentPrivileges.CUSTOM1) {
            chkActive.disabled = true;
        }
        else {
            chkActive.disabled = false;
        }
    }
    function chkActive_onchecked() {
        if (btnUpdate.getAttribute('class') != 'btn btn-primary display_none') {
            if (chkActive.checked == false && InvoiceStatisticsModel[0].Status == 1) {
                openInvoice();
            }
        }
    }
    function chkPreivilegeToEditApprovedInvoice() {
        if (SysSession.CurrentPrivileges.CUSTOM2 == false) {
            chkActive.disabled = true;
            btnUpdate.disabled = true;
        }
        else {
            chkActive.disabled = false;
            btnUpdate.disabled = true;
        }
    }
    function Check_CreditLimit_Custom(net) {
        var custID = Number(ddlInvoiceCustomer.value);
        var custom1 = new A_Rec_D_Customer;
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefCustomer", "GetCustomerByCustomerId"),
            data: {
                CustomerId: custID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    custom1 = result.Response;
                }
            }
        });
        if (custom1 != null) {
            var Isbalance = Number((Number(custom1.Openbalance) + Number(custom1.Debit) - Number(custom1.Credit)).RoundToSt(2));
            var res = Number((net + Isbalance).RoundToSt(2));
            if (custom1.CreditLimit > 0) {
                if (res <= custom1.CreditLimit) {
                    return true;
                }
                else {
                    WorningMessage("خطأ لا يمكن ان تجاوز صافي الفاتوره (" + net + ") مع الرصيد (" + Isbalance + ") الحد الائتماني     (" + custom1.CreditLimit + ")", "Error The net invoice (" + net + ") cannot exceed the balance (" + Isbalance + ") credit limit (" + custom1.CreditLimit + ") ");
                    return false;
                }
            }
        }
        return true;
    }
    //------------------------------------------------------ Buttons Region------------------------
    function btnSave_onclick() {
        loading('btnsave');
        setTimeout(function () {
            finishSave('btnsave');
            if (!SysSession.CurrentPrivileges.AddNew)
                return;
            if (!ValidationHeader())
                return;
            var CanAdd = true;
            if (CountGrid > 0) {
                for (var i = 0; i < CountGrid; i++) {
                    CanAdd = Validation_Grid(i);
                    if (CanAdd == false) {
                        break;
                    }
                }
            }
            if (CanAdd) {
                if (ddlInvoiceCustomer.value.trim() != "" && ddlType.value == "0") {
                    var net = Number(txtNet.value);
                    if (!Check_CreditLimit_Custom(net))
                        return;
                }
                Validation_Insert = 0;
                MasterDetailsModel = new SlsInvoiceMasterDetails();
                Assign();
                InvoiceModel.VatType = vatType;
                InvoiceModel.VatAmount = Number(txtTax.value);
                InvoiceModel.CommitionAmount = Number(txtCommission.value);
                if (Validation_Insert == 1) {
                    Open_poup_Pass();
                }
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
                    Update();
                    //if (AutherizeFlag == false) {
                    //}
                    //else {
                    //    updateWithProcess();
                    //}
                    IsSuccess = false;
                }
            }
        }, 100);
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
            $("#txtCashMoney").attr("disabled", "disabled");
            $("#txtCardMoney").attr("disabled", "disabled");
            $("#txtRefNo").attr("disabled", "disabled");
            $("#txtRemarks").attr("disabled", "disabled");
            $("#txt_Tax_Discount").attr("disabled", "disabled");
            $("#txt_Tax_total_Discount").attr("disabled", "disabled");
            $("#txt_Tax_total_AfterDiscount").attr("disabled", "disabled");
            $("#txtContract_NO").attr("disabled", "disabled");
            $("#txtPurchase_order_No").attr("disabled", "disabled");
            $("#txtDate_of_supply").attr("disabled", "disabled");
            $("#txtSupply_end_Date").attr("disabled", "disabled");
            $("#txtTerms_of_Payment").attr("disabled", "disabled");
            $('#ddlCashBox').attr('disabled', 'disabled');
            $("#btnPrintInvoicePrice").removeClass("display_none");
            $("#div_btnPrint").removeClass("display_none");
            $("#btnUpdate").removeClass("display_none");
            $("#btnPrintTransaction").removeClass("display_none");
            $("#btnBack").addClass("display_none");
            $("#btnSave").addClass("display_none");
            ddlStore.disabled = true;
        }
        else { //Edit
            Grid_RowDoubleClicked();
            $("#cotrolDiv").removeClass("disabledDiv");
            $("#divIconbar").removeClass("disabledIconbar");
            $("#txtInvoiceCustomerName").attr("disabled", "disabled");
            $("#txtCustomerMobile").attr("disabled", "disabled");
            $("#ddlType").attr("disabled", "disabled");
            $("#chkActive").attr("disabled", "disabled");
            $("#txtCommission").attr("disabled", "disabled");
            $('#ddlCashBox').attr('disabled', 'disabled');
            $("#txtCashMoney").attr("disabled", "disabled");
            $("#txtCardMoney").attr("disabled", "disabled");
            $("#txtRefNo").attr("disabled", "disabled");
            $("#txtRemarks").attr("disabled", "disabled");
            $("#txt_Tax_Discount").attr("disabled", "disabled");
            $("#txt_Tax_total_Discount").attr("disabled", "disabled");
            $("#txt_Tax_total_AfterDiscount").attr("disabled", "disabled");
            $("#txtContract_NO").attr("disabled", "disabled");
            $("#txtPurchase_order_No").attr("disabled", "disabled");
            $("#txtDate_of_supply").attr("disabled", "disabled");
            $("#txtSupply_end_Date").attr("disabled", "disabled");
            $("#txtTerms_of_Payment").attr("disabled", "disabled");
            $("#btnPrintInvoicePrice").removeClass("display_none");
            $("#div_btnPrint").removeClass("display_none");
            $("#btnUpdate").removeClass("display_none");
            $("#btnPrintTransaction").removeClass("display_none");
            $("#btnBack").addClass("display_none");
            $("#btnSave").addClass("display_none");
            ddlStore.disabled = true;
        }
    }
    function btnAdd_onclick() {
        if (sys.SysSession.CurrentEnvironment.InvoiceTransCode != 1) {
            $('#btndiv_2').addClass('display_none');
        }
        else {
            $('#btndiv_2').removeClass('display_none');
        }
        $("#DivInvoiceDetails").removeClass("display_none");
        lblInvoiceNumber.value = '';
        txtInvoiceDate.value = GetDate();
        ddlInvoiceCustomer.value = '';
        txtInvoiceCustomerName.value = '';
        txtCustomerMobile.value = '';
        ddlSalesman.value = 'null';
        ddlSalesPerson.value = 'null';
        txtRefNo.value = "";
        txtRemarks.value = "";
        SysSession.CurrentEnvironment.UserType == 1 || SysSession.CurrentEnvironment.UserType == 3 ? ($('#ddlStore option[value="null"]').remove()) : $('#ddlStore').prop('selectedIndex', 1);
        txtTotal.value = '0';
        txtTax.value = '0';
        txtNet.value = '0';
        txtCommission.value = '0';
        txtItemCount.value = '0';
        txtPackageCount.value = '0';
        $('#txtCreatedBy').prop("value", "");
        $('#txtCreatedAt').prop("value", "");
        $('#txtUpdatedBy').prop("value", "");
        $('#txtUpdatedAt').prop("value", "");
        $('#txt_CustCode').prop("value", "");
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
        $('#ddlInvoiceCustomer').val('');
        //$("#ddlInvoiceCustomer").attr("disabled", "disabled");
        $("#txtCustomerMobile").attr("disabled", "disabled");
        $("#txtInvoiceCustomerName").removeAttr("disabled");
        TypeFlag = true;
        txtInvoiceCustomerName.disabled = false;
        ddlSalesman.disabled = false;
        ddlSalesPerson.disabled = false;
        ddlStore.disabled = false;
        ddlType.disabled = false;
        txtCommission.disabled = false;
        txtRefNo.disabled = false;
        txtRemarks.disabled = false;
        $("#btnAddDetails").removeClass("display_none");
        $("#btnUpdate").addClass("display_none");
        $("#btnPrintTransaction").addClass("display_none");
        $("#btnPrintInvoicePrice").addClass("display_none");
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
        $('#txtCreatedBy').prop("value", SysSession.CurrentEnvironment.UserCode);
        $('#txtCreatedAt').prop("value", DateTimeFormat(Date().toString()));
        GetAllIItem();
        //AddNewRow();
        SysSession.CurrentEnvironment.UserType == 2 || SysSession.CurrentEnvironment.UserType == 3 ? ($('#ddlCashBox').prop('selectedIndex', 1), $("#Div_Money").removeClass("display_none")) : $('#ddlCashBox').prop('selectedIndex', 0);
        $('#ddlCashBox').removeAttr('disabled');
        SysSession.CurrentEnvironment.I_Control[0].IvoiceDateEditable == true ? $('#txtInvoiceDate').removeAttr("disabled") : $('#txtInvoiceDate').attr("disabled", "disabled");
        btndiv_1_onclick();
        $('#txt_Tax_Discount').val("0");
        $('#txt_Tax_total_Discount').val("0");
        $('#txt_Tax_total_AfterDiscount').val("0");
        $('#txt_Tax_Vat').val("0");
        $('#txt_Tax_AfterTotalVAT').val("0");
        $('#txtContract_NO').val("");
        $('#txtPurchase_order_No').val("");
        $('#txtTerms_of_Payment').val("");
        $('#txtCashMoney').val("");
        $('#txtCardMoney').val("");
        $('#txtDate_of_supply').val(GetDate());
        $('#txtSupply_end_Date').val(GetDate());
        $("#txt_Tax_Discount").removeAttr("disabled");
        $("#txt_Tax_total_Discount").removeAttr("disabled");
        $("#txt_Tax_total_AfterDiscount").removeAttr("disabled");
        $("#txtContract_NO").removeAttr("disabled");
        $("#txtPurchase_order_No").removeAttr("disabled");
        $("#txtDate_of_supply").removeAttr("disabled");
        $("#txtSupply_end_Date").removeAttr("disabled");
        $("#txtTerms_of_Payment").removeAttr("disabled");
        $("#txtCashMoney").removeAttr("disabled");
        $("#txtCardMoney").removeAttr("disabled");
        $("#btnCust").removeAttr("disabled");
        $("#txt_CustCode").removeAttr("disabled");
        ddlInvoiceCustomer.disabled = false;
        ddlInvoiceCustomer.value = '';
        $("#Div_Money").removeClass("display_none");
        if (SysSession.CurrentEnvironment.I_Control.RetailInvoicePaymentDef == 2) {
            $("#txtCashMoney").val("");
            $("#txtCardMoney").val("");
            $('#ddlCashBox').prop('selectedIndex', 0);
            $('#ddlCashBox').attr('disabled', 'disabled');
            txtInvoiceCustomerName.value = "";
            $("#txtInvoiceCustomerName").attr("disabled", "disabled");
            $("#ddlInvoiceCustomer").removeAttr("disabled");
            $("#btnCust").removeAttr("disabled");
            $("#txt_CustCode").removeAttr("disabled");
            $("#txtCustomerMobile").removeAttr("disabled");
            TypeFlag = false;
            $("#Div_Money").addClass("display_none");
            ddlType.value = '0';
            chkActive.disabled = !SysSession.CurrentPrivileges.CUSTOM1;
            chkActive.checked = SysSession.CurrentEnvironment.I_Control[0].IsRetailCreditInvoiceDefAuth;
            if (compcode != 4) {
                //filterCustomerDetails = CustomerDetails.filter(x => x.Isactive == true);
                //DocumentActions.FillCombowithdefult(filterCustomerDetails, ddlInvoiceCustomer, "CustomerId", (lang == "ar" ? "NAMEA" : "NAMEE"), (lang == "ar" ? "اختر العميل" : "Select customer"));
            }
        }
        else {
            if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
                txtInvoiceCustomerName.value = "عميل نقدي عام";
                txtCustomerMobile.value = "";
            }
            else {
                txtInvoiceCustomerName.value = "General cash client";
                txtCustomerMobile.value = "";
            }
            txtCustomerMobile.value = "";
            $('#ddlInvoiceCustomer').val('');
            //$("#ddlInvoiceCustomer").attr("disabled", "disabled");
            $("#txtCustomerMobile").attr("disabled", "disabled");
            $("#txtInvoiceCustomerName").removeAttr("disabled");
            SysSession.CurrentEnvironment.UserType == 2 || SysSession.CurrentEnvironment.UserType == 3 ? ($('#ddlCashBox').prop('selectedIndex', 1), $("#Div_Money").removeClass("display_none")) : $('#ddlCashBox').prop('selectedIndex', 0);
            $('#ddlCashBox').attr('disabled', 'disabled');
            $("#Div_Money").removeClass("display_none");
            vatType = SysSession.CurrentEnvironment.I_Control[0].DefSlsVatType; //From Session
            $('#ddlCashBox').removeAttr("disabled");
            $("#txtCashMoney").val("");
            $("#txtCardMoney").val("");
            TypeFlag = true;
            ddlType.value = '1';
            chkActive.disabled = !SysSession.CurrentPrivileges.CUSTOM1;
            chkActive.checked = SysSession.CurrentEnvironment.I_Control[0].IsRetailCashInvoiceDefAuth;
            if (compcode != 4) {
                //filterCustomerDetails = CustomerDetails.filter(x => x.Isactive == true && x.IsCreditCustomer == true);
                //DocumentActions.FillCombowithdefult(filterCustomerDetails, ddlInvoiceCustomer, "CustomerId", (lang == "ar" ? "NAMEA" : "NAMEE"), (lang == "ar" ? "اختر العميل" : "Select customer"));
            }
        }
        if (compcode == 4) {
            //filterCustomerDetails = CustomerDetails.filter(x => x.Isactive == true);
            //DocumentActions.FillCombowithdefult(filterCustomerDetails, ddlInvoiceCustomer, "CustomerId", (lang == "ar" ? "NAMEA" : "NAMEE"), (lang == "ar" ? "اختر العميل" : "Select customer"));
        }
        $("#btnCust").removeAttr("disabled");
        $("#txt_CustCode").removeAttr("disabled");
    }
    function btnShow_onclick() {
        BindStatisticGridData();
        $("#divShow").removeClass("display_none");
        $("#DivInvoiceDetails").addClass("display_none");
        $("#cotrolDiv").removeClass("disabledDiv");
        $("#divIconbar").removeClass("disabledIconbar");
    }
    function btnUpdate_onclick() {
        if (!SysSession.CurrentPrivileges.EDIT)
            return;
        $("#cotrolDiv").attr("disabled", "disabled").off('click');
        $("#cotrolDiv").addClass("disabledDiv");
        $("#divIconbar").attr("disabled", "disabled").off('click');
        $("#divIconbar").addClass("disabledIconbar");
        Show = false;
        $("#btnUpdate").addClass("display_none");
        $("#btnPrintTransaction").addClass("display_none");
        $("#btnPrintInvoicePrice").addClass("display_none");
        $("#div_btnPrint").addClass("display_none");
        $("#btnBack").removeClass("display_none");
        $("#btnSave").removeClass("display_none");
        var items = Number(CountGrid);
        var _loop_1 = function (i) {
            $("#ddlFamily" + i).removeAttr("disabled");
            $("#ddlItem" + i).removeAttr("disabled");
            $("#txtQuantity" + i).removeAttr("disabled");
            $("#txtQuantity" + i).removeClass("px-3");
            $("#btnSearchItems" + i).removeAttr("disabled");
            $("#txtDiscountPrc" + i).removeAttr("disabled");
            $("#txtDiscountAmount" + i).removeAttr("disabled");
            $("#txtNetUnitPrice" + i).removeAttr("disabled");
            if (flag_PriceWithVAT == true) {
                $("#txtUnitpriceWithVat" + i).removeAttr("disabled");
                $("#txtPrice" + i).removeAttr("disabled");
            }
            else {
                $("#txtPrice" + i).removeAttr("disabled");
                $("#txtUnitpriceWithVat" + i).attr("disabled", "disabled");
            }
            $('.btn-number1' + i).removeAttr("disabled");
            $('.input-number1' + i).removeAttr("disabled");
            $('.btn-number2' + i).removeAttr("disabled");
            $('.input-number2' + i).removeAttr("disabled");
            $('.btn-number3' + i).removeAttr("disabled");
            $('.input-number3' + i).removeAttr("disabled");
            $("#btn_minus" + i).removeClass("display_none");
            $("#btn_minus" + i).removeAttr("disabled");
            $("#btn_minus" + i).click(function (e) {
                DeleteRow(i);
            });
        };
        for (var i = 0; i < items + 1; i++) {
            _loop_1(i);
        }
        $("#ddlInvoiceCustomer").removeAttr("disabled");
        $("#btnCust").removeAttr("disabled");
        $("#txt_CustCode").removeAttr("disabled");
        $("#ddlSalesman").removeAttr("disabled");
        $("#ddlSalesPerson").removeAttr("disabled");
        $("#txtRefNo").removeAttr("disabled");
        $("#txtRemarks").removeAttr("disabled");
        $("#txtInvoiceCustomerName").removeAttr("disabled");
        $("#txtCustomerMobile").removeAttr("disabled");
        $("#ddlType").removeAttr("disabled");
        $("#chkActive").removeAttr("disabled");
        $("#txt_Tax_Discount").removeAttr("disabled");
        $("#txt_Tax_total_Discount").removeAttr("disabled");
        $("#txt_Tax_total_AfterDiscount").removeAttr("disabled");
        $("#txtContract_NO").removeAttr("disabled");
        $("#txtPurchase_order_No").removeAttr("disabled");
        $("#txtDate_of_supply").removeAttr("disabled");
        $("#txtSupply_end_Date").removeAttr("disabled");
        $("#txtTerms_of_Payment").removeAttr("disabled");
        $("#txtCashMoney").removeAttr("disabled");
        $("#txtCardMoney").removeAttr("disabled");
        $("#txtCommission").removeAttr("disabled");
        $("#btnAddDetails").removeClass("display_none");
        checkValidation();
        NewAdd = false;
        if (ddlType.value == "1") { //نقدي 
            TypeFlag = true;
        }
        else { //علي الحساب
            TypeFlag = false;
        }
        $("#txtInvoiceCustomerName").removeAttr("disabled");
        $("#ddlInvoiceCustomer").removeAttr("disabled");
        $("#btnCust").removeAttr("disabled");
        $("#txt_CustCode").removeAttr("disabled");
        $("#txtCustomerMobile").removeAttr("disabled");
        $('#ddlCashBox').removeAttr('disabled');
        SysSession.CurrentEnvironment.I_Control[0].IvoiceDateEditable == true ? $('#txtInvoiceDate').removeAttr("disabled") : $('#txtInvoiceDate').attr("disabled", "disabled");
        var CustID = Number(ddlInvoiceCustomer.value);
        //let Cust = CustomerDetails.filter(x => x.CustomerId == CustID);
        //filterCustomerDetails = CustomerDetails.filter(x => x.Isactive == true);
        //filterCustomerDetails.push(Cust[0])
        //DocumentActions.FillCombowithdefult(filterCustomerDetails, ddlInvoiceCustomer, "CustomerId", (lang == "ar" ? "NAMEA" : "NAMEE"), (lang == "ar" ? "اختر العميل" : "Select customer"));
        //ddlInvoiceCustomer.value = CustID.toString();
        $("#btnCust").removeAttr("disabled");
        $("#txt_CustCode").removeAttr("disabled");
    }
    //------------------------------------------------------ Drop Down Region------------------------
    function FillddlCashBox() {
        var CashBoxID = 0;
        if (SysSession.CurrentEnvironment.UserType == 2 || SysSession.CurrentEnvironment.UserType == 3) {
            CashBoxID = SysSession.CurrentEnvironment.CashBoxID == null ? 0 : SysSession.CurrentEnvironment.CashBoxID;
        }
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefBox", "GetById"),
            data: { compCode: compcode, BranchCode: BranchCode, CashBoxID: CashBoxID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    CashboxDetails = result.Response;
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                        DocumentActions.FillCombowithdefult(CashboxDetails, ddlCashBox, "CashBoxID", "CashBox_DescE", "CashBox");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(CashboxDetails, ddlCashBox, "CashBoxID", "CashBox_DescA", "اختر الصندوق");
                    }
                    SysSession.CurrentEnvironment.UserType == 2 || SysSession.CurrentEnvironment.UserType == 3 ? ($('#ddlCashBox').prop('selectedIndex', 1), $("#Div_Money").removeClass("display_none")) : $('#ddlCashBox').prop('selectedIndex', 0);
                    $('#ddlCashBox').attr('disabled', 'disabled');
                }
            }
        });
    }
    function fillddlSalesman() {
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
                    //------------------------------------------------- ddlSalesPerson-----------------------------
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                        DocumentActions.FillCombowithdefult(SalesmanDetails, ddlSalesPerson, "SalesmanId", "NameE", "Select Salesman");
                        DocumentActions.FillCombowithdefult(SalesmanDetails, ddlSalesPersonFilter, "SalesmanId", "NameE", "Select Category");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(SalesmanDetails, ddlSalesPerson, "SalesmanId", "NameA", "اختر البائع");
                        DocumentActions.FillCombowithdefult(SalesmanDetails, ddlSalesPersonFilter, "SalesmanId", "NameA", "اختر البائع");
                    }
                }
            }
        });
    }
    function FillddlStateType() {
        StateDetailsAr = ["غير معتمد", " معتمد", "الجميع"];
        StateDetailsEn = [" Not Approved", " Approved", "All"];
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
    function FillddlInvoiceType() {
        InvoiceDetailsAr = ["علي الحساب", " نقدي", "الجميع"];
        InvoiceDetailsEn = [" Credit ", " Cash", "All"];
        if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
            for (var i = 0; i < InvoiceDetailsEn.length; i++) {
                var newoption = document.createElement("option");
                newoption.value = i.toString();
                newoption.text = InvoiceDetailsEn[i];
                ddlInvoiceType.options.add(newoption);
            }
        }
        else {
            for (var i = 0; i < InvoiceDetailsAr.length; i++) {
                var newoption = document.createElement("option");
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
            for (var i = 0; i < InvoiceEyptDetailsEn.length; i++) {
                var newoption = document.createElement("option");
                newoption.value = i.toString();
                newoption.text = InvoiceEyptDetailsEn[i];
                ddlType.options.add(newoption);
            }
        }
        else {
            for (var i = 0; i < InvoiceTypeDetailsAr.length; i++) {
                var newoption = document.createElement("option");
                newoption.value = i.toString();
                newoption.text = InvoiceTypeDetailsAr[i];
                ddlType.options.add(newoption);
            }
        }
    }
    function FillddlFamily() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("StkDefItemType", "GetAllOrdered"),
            data: {
                CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                ////////
                var result = d;
                if (result.IsSuccess) {
                    FamilyDetails = result.Response;
                }
            }
        });
    }
    function FillddlItem(ItemFamilyID) {
        if (NewAdd == true) {
            if (ddlStore.value == "null") {
                DisplayMassage('(برجاء اختيار المستودع)', '(Please select a Store)', MessageType.Error);
                Errorinput(ddlStore);
                return;
            }
            else {
                StoreID = Number(ddlStore.value);
            }
            //ItemDetails = ItemFamilyDetails.filter(x => x.ItemFamilyID == ItemFamilyID && x.StoreId == StoreID );
            ItemDetails = ItemFamilyDetails.filter(function (x) { return x.ItemFamilyID == ItemFamilyID && x.StoreId == StoreID && x.IsActive == true && x.ISSales == true; });
        }
        else {
            if (Show == true) {
                ItemDetails = ItemFamilyDetails.filter(function (x) { return x.ItemFamilyID == ItemFamilyID && x.StoreId == StoreID; });
            }
            else {
                ItemDetails = ItemFamilyDetails.filter(function (x) { return x.ItemFamilyID == ItemFamilyID && x.StoreId == StoreID && x.IsActive == true && x.ISSales == true; });
            }
        }
    }
    function FillddlStore() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("StkDefStore", "GetAll"),
            data: {
                CompCode: compcode, BranchCode: BranchCode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    storeDetails = result.Response;
                    if (SysSession.CurrentEnvironment.UserType == 1 || SysSession.CurrentEnvironment.UserType == 3) {
                        var StoreID_1 = SysSession.CurrentEnvironment.StoreID;
                        storeDetails = storeDetails.filter(function (s) { return s.StoreId == StoreID_1; });
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
    function Display_Category() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("StkDefCategory", "GetAll"),
            data: {
                CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    CategoryDetails = result.Response;
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
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    DetailsVatNature = result.Response;
                }
            }
        });
    }
    //------------------------------------------------------ Normal Grid Region------------------------
    function InitializeGrid() {
        var res = GetResourceList("");
        Grid.ElementName = "divGridDetails";
        Grid.OnDataLoaded = function () { };
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
            { title: res.App_Number, name: "InvoiceID", type: "text", width: "2%", visible: false },
            { title: res.App_Number, name: "TrNo", type: "text", width: "13%" },
            { title: res.App_Cutomer, name: "Cus_NameA", type: "text", width: "25%" },
            { title: res.App_Salesman, name: (lang == "ar" ? "Slsm_DescA" : "Slsm_DescE"), type: "text", width: "25%" },
            {
                title: res.App_date, css: "ColumPadding", name: "TrDate", width: "20%",
                itemTemplate: function (s, item) {
                    var txt = document.createElement("label");
                    txt.innerHTML = DateFormat(item.TrDate);
                    return txt;
                }
            },
            { title: res.Men_StkDefItems, name: "Line_Count", type: "text", width: "12%" },
            { title: res.App_Package, name: "Tot_Qty", type: "text", width: "12%" },
            { title: res.App_total, name: "TotalAmount", type: "text", width: "15%" },
            { title: res.App_Tax, name: "VatAmount", type: "text", width: "12%" },
            { title: res.App_Net, name: "NetAfterVat", type: "text", width: "13%" },
            { title: res.App_Commission, name: "CommitionAmount", type: "text", width: "15%" },
            { title: res.App_TobePaid, name: "RemainAmount", type: "text", width: "17%", css: "classfont" },
            //{ title: res.App_invoiceType, name: "IsCashDesciption", type: "text", width: "16%" },
            //{ title: res.App_Certified, name: "statusDesciption", type: "text", width: "17%" },
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
        var ddlSalesmanFilterValue = 0;
        var ddlSalesPersonFilterValue = 0;
        var IsCash = 0;
        if (ddlCustomer.value.trim() != "") {
            customerId = Number(ddlCustomer.value.toString());
        }
        if (ddlSalesmanFilter.value != "null") {
            ddlSalesmanFilterValue = Number(ddlSalesmanFilter.value.toString());
        }
        if (ddlSalesPersonFilter.value != "null") {
            ddlSalesPersonFilterValue = Number(ddlSalesPersonFilter.value.toString());
        }
        if (ddlStateType.value != "null") {
            status = Number(ddlStateType.value.toString());
        }
        if (Number(ddlInvoiceType.value) == 0) {
            IsCash = 0;
        }
        else if (Number(ddlInvoiceType.value) == 1) {
            IsCash = 1;
        }
        else {
            IsCash = 2;
        }
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("SlsTrSales", "GetAllSlsInvoiceReviewStatistic"),
            data: { CompCode: compcode, BranchCode: BranchCode, IsCash: IsCash, StartDate: startDate, EndDate: endDate, Status: status, CustId: customerId, SalesMan: ddlSalesmanFilterValue, SalesPerson: ddlSalesPersonFilterValue, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    SlsInvoiceStatisticsDetails = result.Response;
                    //for (let i = 0; i < SlsInvoiceStatisticsDetails.length; i++) {
                    //    //SlsInvoiceStatisticsDetails[i].TrDate = DateFormat(SlsInvoiceStatisticsDetails[i].TrDate.toString());
                    //    SlsInvoiceStatisticsDetails[i].statusDesciption = SlsInvoiceStatisticsDetails[i].Status == 1 ? (lang == "ar" ? "معتمد" : "A certified") : (lang == "ar" ? "غير معتمد" : "Not supported");
                    //    SlsInvoiceStatisticsDetails[i].IsCashDesciption = SlsInvoiceStatisticsDetails[i].IsCash == true ? (lang == "ar" ? "نقدي" : "Cash") : (lang == "ar" ? "علي الحساب" : "On account");
                    //}
                    Grid.DataSource = SlsInvoiceStatisticsDetails;
                    Grid.Bind();
                }
            }
        });
    }
    function Grid_RowDoubleClicked() {
        Show = true; //   ////
        $("#btnUpdate").removeClass("display_none");
        $("#btnPrintTransaction").removeClass("display_none");
        $("#DivInvoiceDetails").removeClass("display_none");
        clear();
        $("#btnBack").addClass("display_none");
        $("#btnSave").addClass("display_none");
        InvoiceStatisticsModel = new Array();
        Selecteditem = new Array();
        Selecteditem = SlsInvoiceStatisticsDetails.filter(function (x) { return x.InvoiceID == Number(Grid.SelectedKey); });
        GlobalDocNo = Selecteditem[0].DocNo;
        try {
            GlobalinvoiceID = Number(Selecteditem[0].InvoiceID);
        }
        catch (e) {
            Selecteditem = SlsInvoiceStatisticsDetails.filter(function (x) { return x.InvoiceID == Number(invoiceID); });
            GlobalinvoiceID = Number(Selecteditem[0].InvoiceID);
        }
        InvoiceStatisticsModel = Selecteditem;
        if (InvoiceStatisticsModel[0].InvoiceTransCode != 1) {
            $('#btndiv_2').addClass('display_none');
        }
        else {
            $('#btndiv_2').removeClass('display_none');
        }
        if (InvoiceStatisticsModel.length) {
            txtItemCount.value = "" + InvoiceStatisticsModel[0].Line_Count + "";
            txtPackageCount.value = "" + InvoiceStatisticsModel[0].Tot_Qty + "";
            txtTotal.value = InvoiceStatisticsModel[0].TotalAmount.RoundToSt(2);
            txtTax.value = InvoiceStatisticsModel[0].VatAmount.RoundToSt(2);
            txtNet.value = InvoiceStatisticsModel[0].NetAfterVat == null ? '' : InvoiceStatisticsModel[0].NetAfterVat.RoundToSt(2);
            txtCommission.value = InvoiceStatisticsModel[0].CommitionAmount.RoundToSt(2);
            commissionCount = InvoiceStatisticsModel[0].CommitionAmount;
            //ComputeTotals();
            GlobalinvoiceID = InvoiceStatisticsModel[0].InvoiceID;
            //InvoiceTransCode = InvoiceStatisticsModel[0].InvoiceTransCode;
            lblInvoiceNumber.value = InvoiceStatisticsModel[0].TrNo.toString();
            txtInvoiceDate.value = DateFormat(InvoiceStatisticsModel[0].TrDate.toString());
            StoreID = Selecteditem[0].StoreId;
            if (InvoiceStatisticsModel[0].CustomerId != null) {
                $('#ddlInvoiceCustomer').val(InvoiceStatisticsModel[0].CustomerId);
                $('#txt_CustCode').val(InvoiceStatisticsModel[0].Cus_Code);
                $('#txtInvoiceCustomerName').prop("value", InvoiceStatisticsModel[0].Cus_NameA);
                $('#txtCustomerMobile').prop("value", InvoiceStatisticsModel[0].CustomerMobileNo);
            }
            else {
                $('#txtInvoiceCustomerName').prop("value", InvoiceStatisticsModel[0].CustomerName);
                $('#txtCustomerMobile').prop("value", InvoiceStatisticsModel[0].CustomerMobileNo);
                //$('#ddlInvoiceCustomer option[value=null]').prop('selected', 'selected').change();
                $('#ddlInvoiceCustomer').val('');
                //$('#ddlInvoiceCustomer').val(InvoiceStatisticsModel[0].CustomerId.toString());
            }
            var ddlSalesmanValue = InvoiceStatisticsModel[0].SalesmanId.toString();
            $('#ddlSalesman').prop("value", ddlSalesmanValue);
            var ddlSalesPersonValue = setVal(InvoiceStatisticsModel[0].SalesPersonId);
            $('#ddlSalesPerson').prop("value", ddlSalesPersonValue);
            if (InvoiceStatisticsModel[0].Status == 1) {
                chkActive.checked = true;
                chkPreivilegeToEditApprovedInvoice();
            }
            else {
                chkActive.checked = false;
                btnUpdate.disabled = !SysSession.CurrentPrivileges.EDIT;
                chkActive.disabled = true;
            }
            if (InvoiceStatisticsModel[0].IsCash == true) {
                $('#ddlType').prop("value", "1");
                $("#txtCustomerMobile").attr("disabled", "disabled");
                $("#txtInvoiceCustomerName").removeAttr("disabled");
                $("#Div_Money").removeClass("display_none");
                TypeFlag = true;
            }
            else {
                $('#ddlType').prop("value", "0");
                $('#ddlCashBox').prop('selectedIndex', 0);
                $('#ddlCashBox').attr('disabled', 'disabled');
                $("#txtInvoiceCustomerName").attr("disabled", "disabled");
                //$("#ddlInvoiceCustomer").removeAttr("disabled");
                $("#txtCustomerMobile").removeAttr("disabled");
                $("#Div_Money").addClass("display_none");
                TypeFlag = false;
            }
            $('#divCreationPanel').removeClass("display_none");
            $('#txtCreatedBy').prop("value", InvoiceStatisticsModel[0].CreatedBy);
            $('#txtCreatedAt').prop("value", InvoiceStatisticsModel[0].CreatedAt);
            $('#txtUpdatedBy').prop("value", InvoiceStatisticsModel[0].UpdatedBy);
            $('#txtUpdatedAt').prop("value", InvoiceStatisticsModel[0].UpdatedAt);
            $('#txtCashMoney').prop("value", InvoiceStatisticsModel[0].CashAmount.RoundToSt(2));
            $('#txtCardMoney').prop("value", InvoiceStatisticsModel[0].CardAmount.RoundToSt(2));
            $('#ddlCashBox').val(InvoiceStatisticsModel[0].CashBoxID == null ? 'null' : InvoiceStatisticsModel[0].CashBoxID);
        }
        NewAdd = false;
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("SlsTrSales", "GetSlsInvoiceItem"),
            data: { invoiceID: GlobalinvoiceID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    SlsInvoiceItemsDetails = result.Response;
                    for (var i = 0; i < SlsInvoiceItemsDetails.length; i++) {
                        BuildControls(i);
                    }
                    CountGrid = SlsInvoiceItemsDetails.length;
                    CountItems = SlsInvoiceItemsDetails.length;
                }
            }
        });
        $("#btnSave").addClass("display_none");
        $("#btnBack").addClass("display_none");
        //$("#ddlInvoiceCustomer").attr("disabled", "disabled");
        $("#ddlSalesPerson").attr("disabled", "disabled");
        $("#ddlSalesman").attr("disabled", "disabled");
        $("#txtCashMoney").attr("disabled", "disabled");
        $("#txtCardMoney").attr("disabled", "disabled");
        $('#ddlCashBox').attr('disabled', 'disabled');
        //ddlInvoiceCustomer.disabled = true;
        ddlSalesman.disabled = true;
        txtInvoiceDate.disabled = true;
        ddlInvoiceCustomer.disabled = true;
        txtInvoiceCustomerName.disabled = true;
        txtCustomerMobile.disabled = true;
        ddlSalesman.disabled = true;
        txtRefNo.disabled = true;
        txtRemarks.disabled = true;
        ddlType.disabled = true;
        txtCommission.disabled = true;
        ddlStore.disabled = true;
        if (InvoiceStatisticsModel[0].Status == 1) {
            if (!SysSession.CurrentPrivileges.CUSTOM2) {
                AutherizeFlag = false;
                $("#btnUpdate").addClass("display_none");
            }
            else {
                AutherizeFlag = true;
                $("#btnUpdate").removeClass("display_none");
            }
        }
        DocumentActions.RenderFromModel(InvoiceStatisticsModel[0]);
        txtNet.value = InvoiceStatisticsModel[0].NetAfterVat.RoundToSt(2);
        $('#txtContract_NO').val(InvoiceStatisticsModel[0].ContractNo);
        $('#txtPurchase_order_No').val(InvoiceStatisticsModel[0].PurchaseorderNo);
        $('#txtTerms_of_Payment').val(InvoiceStatisticsModel[0].TaxNotes);
        var DeliveryDate = DateFormat(InvoiceStatisticsModel[0].DeliveryDate);
        $('#txtDate_of_supply').val(DeliveryDate);
        var DeliveryEndDate = DateFormat(InvoiceStatisticsModel[0].DeliveryEndDate);
        $('#txtSupply_end_Date').val(DeliveryEndDate);
        NewAdd = false;
        btndiv_1_onclick();
        $("#div_btnPrint").removeClass("display_none");
        $("#btnPrintInvoicePrice").removeClass("display_none");
        $("#btnCust").attr("disabled", "disabled");
        $("#txt_CustCode").attr("disabled", "disabled");
    }
    //------------------------------------------------------ Controls Grid Region------------------------
    function BuildControls(cnt) {
        var html;
        html = "<tr id=\"No_Row" + cnt + "\">\n                    <input id=\"InvoiceItemID" + cnt + "\" type=\"hidden\" class=\"form-control display_none\"  />\n\t                <td>\n\t\t                <div class=\"form-group\">\n\t\t\t                <span id=\"btn_minus" + cnt + "\"><i class=\"fas fa-minus-circle  btn-minus\"></i></span>\n\t\t                </div>\n\t                </td>\n                     <td>\n\t\t                <div class=\"form-group\">\n\t\t\t                <button type=\"button\" class=\"style_ButSearch\" id=\"btnSearchItems" + cnt + "\" disabled>\n                            <i class=\"fa fa-search  \"></i>\n                             </button>\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n\t\t\t                <input id=\"txtSerial" + cnt + "\" type=\"text\" class=\"form-control\" disabled />\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n\t\t\t                <select id=\"ddlFamily" + cnt + "\" class=\"form-control select_\">\n                                 <option value=\"null\"> " + (lang == "ar" ? "النوع" : "Type") + " </option>\n                            </select>\n\t\t                </div>\n\t                </td>\n                     <td>\n\t\t                <div class=\"form-group\">\n\t\t\t                <select id=\"ddlItem" + cnt + "\" class=\"form-control select_\">\n                              <option value=\"null\">  " + (lang == "ar" ? "الصنف" : "Item") + " </option>\n                            </select>\n\t\t                </div>\n\t                </td>\n                     <td>\n\t\t                <div class=\"form-group\">\n\t\t\t                <div class=\"form-group counter-group ps-1\">\n\t\t\t                    <input class=\"counter px-3\" type=\"number\" data-id=\"number\" id=\"txtQuantity" + cnt + "\" name=\"quant[3]\" value=\"1\" min=\"0\" max=\"1000\" step=\"1\"/>\n\t\t\t                    <div class=\"value-button decrease-button btn-number1" + cnt + "\" data-id=\"decrease\" id=\"btnminus1\" data-type=\"minus\" data-field=\"quant[1]\">-</div>\n\t\t\t                    <div class=\"value-button increase-button btn-number1" + cnt + "\" data-id=\"increase\" id=\"btnplus1\" data-type=\"plus\" data-field=\"quant[1]\">+</div>\n\t\t                    </div>\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n\t\t\t                <input type=\"text\"  class=\"form-control\" id=\"txtReturnQuantity" + cnt + "\" name=\"quant[3]\" class=\"form-control\" value=\"0\" min=\"0\" max=\"1000\" step=\"1\">\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n\t\t\t                <input type=\"text\"  class=\"form-control\" id=\"txtPrice" + cnt + "\" name=\"quant[3]\" class=\"form-control\" value=\"0\" min=\"0\" step=\"1\">\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\" >\n\t\t\t               <input id=\"txtUnitpriceWithVat" + cnt + "\" type=\"text\"  class=\"form-control\"  name=\"quant[3]\" class=\"form-control\" value=\"0\" min=\"0\" step=\"1\">\n\t\t                </div>\n\t                </td> \n                    <td>\n\t\t                <div class=\"form-group\" >\n\t\t\t               <input id=\"txtDiscountPrc" + cnt + "\" type=\"text\"  class=\"form-control\"  name=\"quant[3]\" class=\"form-control\" value=\"0\" min=\"0\" step=\"1\">\n\t\t                </div>\n\t                </td>  \n                    <td>\n\t\t                <div class=\"form-group\"  >\n\t\t\t               <input id=\"txtDiscountAmount" + cnt + "\" type=\"text\"  class=\"form-control\"  name=\"quant[3]\" class=\"form-control\" value=\"0\" min=\"0\" step=\"1\">\n\t\t                </div>\n\t                </td>  \n                    <td>\n\t\t                <div class=\"form-group\" >\n\t\t\t               <input id=\"txtNetUnitPrice" + cnt + "\" type=\"text\" disabled class=\"form-control\"  name=\"quant[3]\" class=\"form-control\" value=\"0\" min=\"0\" step=\"1\">\n\t\t                </div>\n\t                </td>\n\n                    <td>\n\t\t                <div class=\"form-group\" >\n\t\t\t              <input id=\"txtTax_Rate" + cnt + "\" type=\"text\" class=\"form-control\" disabled />\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\"  >\n\t\t\t              <input id=\"txtTotal" + cnt + "\" type=\"text\" class=\"form-control\" disabled />\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n\t\t\t            <input id=\"txtTax" + cnt + "\" type=\"text\" class=\"form-control\" disabled />\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\" >\n\t\t\t              <input id=\"txtTotAfterTax" + cnt + "\" type=\"text\" class=\"form-control\" disabled />\n\t\t                </div>\n\t                </td>\n                    <input id=\"UnitCost" + cnt + "\" name = \" \" type = \"hidden\" class=\"form-control\"/>\n                    <input id=\"txt_StatusFlag" + cnt + "\" name = \" \" type = \"hidden\" class=\"form-control\"/>\n                    <input id=\"txt_ID" + cnt + "\" name = \" \" type = \"hidden\" class=\"form-control\" />\n                </tr>";
        $("#div_Data").append(html);
        $(".select_").select2();
        var username = $('.select_ option:selected').text();
        var userid = $('.select_').val();
        $('#result').html("id : " + userid + ", name : " + username);
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
        //script
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
        $('#btnSearchItems' + cnt).click(function (e) {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
            var sys = new SystemTools();
            var storeId = Number(ddlStore.value); //and OnhandQty > 0
            var FinYear = SysSession.CurrentEnvironment.CurrentYear; //and OnhandQty > 0
            var qury = "CompCode = " + compcode + " and  StoreId=" + storeId + " and ISSales =1 and IsActive = 1 and  FinYear = " + FinYear;
            sys.FindKey(Modules.IssueToCC, "btnSearchItems", qury, function () {
                var id = SearchGrid.SearchDataGrid.SelectedKey;
                ItemDetails = ItemFamilyDetails.filter(function (x) { return x.ItemID == id; });
                //$('#ddlFamily' + cnt).val(ItemDetails[0].ItemFamilyID);
                $('#ddlFamily' + cnt + ' option[value=' + ItemDetails[0].ItemFamilyID + ']').prop('selected', 'selected').change();
                var searchItemID = id;
                //var selectedFamily = $('#ddlFamily' + cnt + '  option:selected').attr('value');
                //FillddlItem(Number(selectedFamily));
                //$('#ddlItem' + cnt).empty();
                //$('#ddlItem' + cnt).append('<option value="' + null + '">' + "اختر الصنف" + '</option>');
                //for (var i = 0; i < ItemDetails.length; i++) {
                //    //$('#ddlItem' + cnt).append('<option value="' + ItemDetails[i].ItemID + '">' + ItemDetails[i].Itm_DescA + '</option>');
                //    $('#ddlItem' + cnt).append('<option data-MinUnitPrice="' + ItemDetails[i].MinUnitPrice + '"data-UomID="' + ItemDetails[i].UomID + '" data-OnhandQty="' + ItemDetails[i].OnhandQty + '" value="' + ItemDetails[i].ItemID + '">' + ItemDetails[i].Itm_DescA + '</option>');
                //}
                //$("#txtQuantity" + cnt).val("1");
                //$("#txtPrice" + cnt).val("1");
                //$("#txtUnitpriceWithVat" + cnt).val("1");
                //$("#txtTotal" + cnt).val("0");
                //$("#txtTax" + cnt).val("0");
                //$("#txtTotAfterTax" + cnt).val("0");
                $('#ddlItem' + cnt).val(searchItemID);
                var selectedItem = $('#ddlItem' + cnt).val();
                var selectedFamily = $(drop + ' option:selected').attr('value');
                //
                var itemID = Number(selectedItem);
                var FamilyID = Number(selectedFamily);
                var NumberSelect = ItemDetails.filter(function (s) { return s.ItemID == itemID; });
                //var res = false;
                //res = checkRepeatedItems(itemID, FamilyID, cnt);
                //if (res == true) {
                //    $("#ddlItem" + cnt).val("null");
                //    $("#txtPrice" + cnt).val("1");
                //    $("#txtUnitpriceWithVat" + cnt).val("1");
                //    DisplayMassage('( لايمكن تكرار نفس الاصناف علي الفاتورة )', '(Error)', MessageType.Error);
                //} else {
                if (NumberSelect.length > 0) {
                    if (SysSession.CurrentEnvironment.I_Control[0].IsLocalCost == false) {
                        $("#UnitCost" + cnt).prop("value", NumberSelect[0].GlobalCost);
                    }
                    else {
                        $("#UnitCost" + cnt).prop("value", NumberSelect[0].LocalCost);
                    }
                    var GetUnitprice = Get_PriceWithVAT(NumberSelect[0].UnitPrice, VatPrc, flag_PriceWithVAT);
                    var itemPrice = GetUnitprice.unitprice;
                    $("#txtPrice" + cnt).val(itemPrice);
                    $("#txtUnitpriceWithVat" + cnt).val(GetUnitprice.unitpricewithvat);
                    //
                    var txtQuantityValue = $("#txtQuantity" + cnt).val();
                    var txtPriceValue = $("#txtPrice" + cnt).val();
                    var CatID_1 = Number($('option:selected', $('#ddlFamily' + cnt)).attr('data-CatID'));
                    var Cat_Tax_1 = CategoryDetails.filter(function (s) { return s.CatID == CatID_1; });
                    var VatNature = DetailsVatNature.filter(function (s) { return s.VatNatID == Cat_Tax_1[0].VatNatID; });
                    Tax_Rate = VatNature[0].VatPrc;
                    Tax_Type_Model = GetVat(Cat_Tax_1[0].VatNatID, Tax_Rate, vatType);
                    Tax_Rate = Tax_Type_Model.Prc;
                    VatPrc = Tax_Rate;
                    $("#txtTax_Rate" + cnt).attr('data-VatNatID', Tax_Type_Model.Nature);
                    $('#txtTax_Rate' + cnt).val(Tax_Rate);
                    $("#txtUnitpriceWithVat" + cnt).val((Number($("#txtPrice" + cnt).val()) * (Tax_Rate + 100) / 100).RoundToNum(2));
                    $("#txtPrice" + cnt).val((Number($("#txtUnitpriceWithVat" + cnt).val()) * 100 / (Tax_Rate + 100)).RoundToSt(2));
                }
                ComputeTotals();
            });
        });
        //fill dropdownlist
        for (var i = 0; i < FamilyDetails.length; i++) {
            $('#ddlFamily' + cnt).append('<option data-CatID= "' + FamilyDetails[i].CatID + '"  value="' + FamilyDetails[i].ItemFamilyID + '">' + (lang == "ar" ? FamilyDetails[i].DescA : FamilyDetails[i].DescL) + '</option>');
        }
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
            $("#txtQuantity" + cnt).val("1");
            $("#txtPrice" + cnt).val("1");
            $("#txtUnitpriceWithVat" + cnt).val("1");
            $("#txtTotal" + cnt).val("0");
            $("#txtTax" + cnt).val("0");
            $("#txtTotAfterTax" + cnt).val("0");
            ComputeTotals();
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
            }
            else {
                var selectedItem = $(dropddlItem + ' option:selected').attr('value');
                var selectedFamily = $(drop + ' option:selected').attr('value');
                //
                var itemID = Number(selectedItem);
                var FamilyID = Number(selectedFamily);
                var NumberSelect = ItemDetails.filter(function (s) { return s.ItemID == itemID; });
                //var res = false;
                //res = checkRepeatedItems(itemID, FamilyID, cnt);
                //if (res == true) {
                //    $("#ddlItem" + cnt).val("null");
                //    $("#txtPrice" + cnt).val("1");
                //    $("#txtUnitpriceWithVat" + cnt).val("1");
                //    DisplayMassage('( لايمكن تكرار نفس الاصناف علي الفاتورة )', '(Error)', MessageType.Error);
                //} else {
                if (NumberSelect.length > 0) {
                    if (SysSession.CurrentEnvironment.I_Control[0].IsLocalCost == false) {
                        $("#UnitCost" + cnt).prop("value", NumberSelect[0].GlobalCost);
                    }
                    else {
                        $("#UnitCost" + cnt).prop("value", NumberSelect[0].LocalCost);
                    }
                    var GetUnitprice = Get_PriceWithVAT(NumberSelect[0].UnitPrice, VatPrc, flag_PriceWithVAT);
                    var itemPrice = GetUnitprice.unitprice;
                    $("#txtPrice" + cnt).val(itemPrice);
                    $("#txtUnitpriceWithVat" + cnt).val(GetUnitprice.unitpricewithvat);
                    //
                    var txtQuantityValue = $("#txtQuantity" + cnt).val();
                    var txtPriceValue = $("#txtPrice" + cnt).val();
                    if ($("#txtPrice" + cnt).val() == 0) {
                        $('#txtTax_Rate' + cnt).val(Tax_Rate);
                        var total = Number(txtQuantityValue) * 1;
                        $("#txtTotal" + cnt).val(total.RoundToSt(2));
                        VatPrc = $("#txtTax_Rate" + cnt).val();
                        var vatAmount = Number(total) * VatPrc / 100;
                        $("#txtTax" + cnt).val(vatAmount.RoundToSt(2));
                        var totalAfterVat = Number(vatAmount) + Number(total);
                        $("#txtTotAfterTax" + cnt).val(totalAfterVat.RoundToSt(2));
                    }
                    else {
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
                // }
                itemid_LastPrice = $('#ddlItem' + cnt).val();
                GetLastPrice(itemid_LastPrice, $("#ddlItem" + cnt + " option:selected").text());
            }
            ComputeTotals();
        });
        // text change
        $("#txtQuantity" + cnt).on('keyup', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
            var txtQuantityValue = $("#txtQuantity" + cnt).val();
            var txtPriceValue = $("#txtPrice" + cnt).val();
            var total = 0;
            if (txtQuantityValue == 0) {
                $("#txtQuantity" + cnt).val("1");
            }
            var Onhand_Qty = Number($('option:selected', $("#ddlItem" + cnt)).attr('data-OnhandQty'));
            if (isNaN(Onhand_Qty)) {
                DisplayMassage("برجاء اختيار الصنف ", "Please choose the item", MessageType.Error);
                Errorinput($("#ddlItem" + cnt));
                $("#txtQuantity" + cnt).val("1");
            }
            else {
                if (txtQuantityValue > Onhand_Qty) {
                    DisplayMassage("خطأ الكميه المتاحه (" + Onhand_Qty + ")", "Error quantity available(" + Onhand_Qty + ")", MessageType.Error);
                    //if (SysSession.CurrentEnvironment.I_Control[0].ExceedOnhandQty != 1) { // invoice, send tf , direct tf                         
                    if (false) {
                        Errorinput($("#txtQuantity" + cnt));
                        $("#txtQuantity" + cnt).val(Onhand_Qty);
                        txtQuantityValue = Onhand_Qty;
                    }
                }
            }
            totalRow(cnt, true);
        });
        $("#txtQuantity" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
            var txtQuantityValue = $("#txtQuantity" + cnt).val();
            var txtPriceValue = $("#txtPrice" + cnt).val();
            var total = 0;
            var Onhand_Qty = Number($('option:selected', $("#ddlItem" + cnt)).attr('data-OnhandQty'));
            if (isNaN(Onhand_Qty)) {
                DisplayMassage("برجاء اختيار الصنف ", "Please choose the item", MessageType.Error);
                Errorinput($("#ddlItem" + cnt));
                $("#txtQuantity" + cnt).val("1");
            }
            else {
                if (txtQuantityValue > Onhand_Qty) {
                    DisplayMassage("خطأ الكميه المتاحه (" + Onhand_Qty + ")", "Error quantity available(" + Onhand_Qty + ")", MessageType.Error);
                    //if (SysSession.CurrentEnvironment.I_Control[0].ExceedOnhandQty != 1) { // invoice, send tf , direct tf                         
                    if (false) {
                        Errorinput($("#txtQuantity" + cnt));
                        $("#txtQuantity" + cnt).val(Onhand_Qty);
                        txtQuantityValue = Onhand_Qty;
                    }
                }
            }
            totalRow(cnt, true);
        });
        $("#txtPrice" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
            var SalesPrice = Number($("#txtPrice" + cnt).val());
            var GetUnitprice = Get_PriceWithVAT(SalesPrice, Number(VatPrc), false);
            $("#txtUnitpriceWithVat" + cnt).val(GetUnitprice.unitpricewithvat);
            totalRow(cnt, true);
        });
        $("#txtPrice" + cnt).on('keyup', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
            var SalesPrice = Number($("#txtPrice" + cnt).val());
            var GetUnitprice = Get_PriceWithVAT(SalesPrice, Number(VatPrc), false);
            $("#txtUnitpriceWithVat" + cnt).val(GetUnitprice.unitpricewithvat);
            totalRow(cnt, true);
        });
        $("#txtDiscountPrc" + cnt).on('keyup', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
            totalRow(cnt, true);
        });
        $("#txtDiscountAmount" + cnt).on('keyup', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
            var txtPrice = Number($("#txtPrice" + cnt).val());
            var txtDiscountAmount = Number($("#txtDiscountAmount" + cnt).val());
            $("#txtDiscountPrc" + cnt).val(((txtDiscountAmount / txtPrice) * 100).RoundToSt(2));
            $("#txtNetUnitPrice" + cnt).val((txtPrice - txtDiscountAmount).RoundToSt(2));
            totalRow(cnt, false);
        });
        $("#txtUnitpriceWithVat" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
            var SalesPrice = Number($("#txtUnitpriceWithVat" + cnt).val());
            var GetUnitprice = Get_PriceWithVAT(SalesPrice, Number(VatPrc), true);
            //$("#txtUnitpriceWithVat" + cnt).val(GetUnitprice.unitpricewithvat)
            $("#txtPrice" + cnt).val(GetUnitprice.unitprice);
            totalRow(cnt, true);
        });
        $("#txtUnitpriceWithVat" + cnt).on('keyup', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
            var SalesPrice = Number($("#txtUnitpriceWithVat" + cnt).val());
            var GetUnitprice = Get_PriceWithVAT(SalesPrice, Number(VatPrc), true);
            //$("#txtUnitpriceWithVat" + cnt).val(GetUnitprice.unitpricewithvat)
            $("#txtPrice" + cnt).val(GetUnitprice.unitprice);
            totalRow(cnt, true);
        });
        $("#btn_minus" + cnt).on('click', function () {
            DeleteRow(cnt);
        });
        $("#No_Row" + cnt).on('click', function () {
            itemid_LastPrice = $('#ddlItem' + cnt).val();
            GetLastPrice(itemid_LastPrice, $("#ddlItem" + cnt + " option:selected").text());
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
            $("#ddlFamily" + cnt).attr("disabled", "disabled");
            $("#txtSerial" + cnt).attr("disabled", "disabled");
            $("#txtTax_Rate" + cnt).attr("disabled", "disabled");
            $("#ddlItem" + cnt).attr("disabled", "disabled");
            $("#txtQuantity" + cnt).attr("disabled", "disabled");
            $("#txtPrice" + cnt).attr("disabled", "disabled");
            $("#txtUnitpriceWithVat" + cnt).attr("disabled", "disabled");
            $("#txtReturnQuantity" + cnt).attr("disabled", "disabled");
            $("#txtTotal" + cnt).attr("disabled", "disabled");
            $("#txtTax" + cnt).attr("disabled", "disabled");
            $("#txtTotAfterTax" + cnt).attr("disabled", "disabled");
            $("#txtDiscountPrc" + cnt).attr("disabled", "disabled");
            $("#txtDiscountAmount" + cnt).attr("disabled", "disabled");
            $('.btn-number1' + cnt).attr("disabled", "disabled");
            $('.input-number1' + cnt).attr("disabled", "disabled");
            $('.btn-number2' + cnt).attr("disabled", "disabled");
            $('.input-number2' + cnt).attr("disabled", "disabled");
            $('.btn-number3' + cnt).attr("disabled", "disabled");
            $('.input-number3' + cnt).attr("disabled", "disabled");
            $("#btnAddDetails").addClass("display_none");
            $("#btn_minus" + cnt).addClass("display_none");
            $("#btn_minus" + cnt).attr("disabled", "disabled");
            //bind Data
            $("#txt_StatusFlag" + cnt).val("");
            //for (var i = 0; i < FamilyDetails.length; i++) {
            //    $('#ddlFamily' + cnt).append('<option value="' + FamilyDetails[i].ItemFamilyID + '">' + (lang == "ar" ? FamilyDetails[i].DescA : FamilyDetails[i].DescL) + '</option>');
            //}
            var FamilyID = Number(SlsInvoiceItemsDetails[cnt].ItemFamilyID);
            $("#ddlFamily" + cnt).prop("value", FamilyID);
            FillddlItem(FamilyID);
            for (var i = 0; i < ItemDetails.length; i++) {
                $('#ddlItem' + cnt).append('<option data-MinUnitPrice="' + ItemDetails[i].MinUnitPrice + '"data-UomID="' + ItemDetails[i].UomID + '" data-OnhandQty="' + ItemDetails[i].OnhandQty + '" value="' + ItemDetails[i].ItemID + '">' + (lang == "ar" ? ItemDetails[i].Itm_DescA : ItemDetails[i].Itm_DescE) + '</option>');
            }
            $("#ddlItem" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].ItemID);
            $("#txtSerial" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].Serial);
            $("#txtQuantity" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].SoldQty);
            $("#txtPrice" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].Unitprice);
            if (SlsInvoiceItemsDetails[cnt].UnitpriceWithVat == null || SlsInvoiceItemsDetails[cnt].UnitpriceWithVat == 0) {
                var GetUnitprice = Get_PriceWithVAT(SlsInvoiceItemsDetails[cnt].Unitprice, SlsInvoiceItemsDetails[cnt].VatPrc, false);
                $("#txtUnitpriceWithVat" + cnt).prop("value", GetUnitprice.unitpricewithvat);
            }
            else {
                $("#txtUnitpriceWithVat" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].UnitpriceWithVat);
            }
            //$("#txtUnitpriceWithVat" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].UnitpriceWithVat);
            $("#txtDiscountPrc" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].DiscountPrc);
            $("#txtDiscountAmount" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].DiscountAmount);
            $("#txtNetUnitPrice" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].NetUnitPrice);
            $("#txtTax_Rate" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].VatPrc);
            $("#txtReturnQuantity" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].TotRetQty);
            $("#txtTotal" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].ItemTotal);
            $("#txtTax" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].VatAmount.RoundToSt(2));
            $("#txtTotAfterTax" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].NetAfterVat.RoundToSt(2));
            $("#InvoiceItemID" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].InvoiceItemID);
            $("#UnitCost" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].StockUnitCost);
        }
        $("#btn_minus" + cnt).click(function (e) {
            DeleteRow(cnt);
        });
        $(".select_").select2();
        //Resizable_Table();
        return;
    }
    function totalRow(cnt, flagDiscountAmount) {
        var CatID = Number($('option:selected', $('#ddlFamily' + cnt)).attr('data-CatID'));
        var Cat_Tax = CategoryDetails.filter(function (s) { return s.CatID == CatID; });
        var VatNature = DetailsVatNature.filter(function (s) { return s.VatNatID == Cat_Tax[0].VatNatID; });
        Tax_Rate = VatNature[0].VatPrc;
        Tax_Type_Model = GetVat(Cat_Tax[0].VatNatID, Tax_Rate, vatType);
        Tax_Rate = Tax_Type_Model.Prc;
        VatPrc = Tax_Rate;
        $("#txtTax_Rate" + cnt).attr('data-VatNatID', Tax_Type_Model.Nature);
        $('#txtTax_Rate' + cnt).val(Tax_Rate);
        //$("#txtUnitpriceWithVat" + cnt).val((Number($("#txtPrice" + cnt).val()) * (Tax_Rate + 100) / 100).RoundToNum(2))
        //$("#txtPrice" + cnt).val((Number($("#txtUnitpriceWithVat" + cnt).val()) * 100 / (Tax_Rate + 100)).RoundToSt(2))
        //-------------------------
        var txtPrice = Number($("#txtPrice" + cnt).val());
        var txtDiscountPrc = Number($("#txtDiscountPrc" + cnt).val());
        if (flagDiscountAmount) {
            $("#txtDiscountAmount" + cnt).val(((txtDiscountPrc * txtPrice) / 100).RoundToSt(2));
            $("#txtNetUnitPrice" + cnt).val((txtPrice - ((txtDiscountPrc * txtPrice) / 100)).RoundToSt(2));
        }
        else {
            var txtDiscountAmount = Number($("#txtDiscountAmount" + cnt).val());
            $("#txtDiscountPrc" + cnt).val(((txtDiscountAmount / txtPrice) * 100).RoundToSt(2));
            $("#txtNetUnitPrice" + cnt).val((txtPrice - txtDiscountAmount).RoundToSt(2));
        }
        var txtQuantityValue = $("#txtQuantity" + cnt).val();
        var txtPriceValue = $("#txtNetUnitPrice" + cnt).val();
        var total = Number(txtQuantityValue) * Number(txtPriceValue);
        VatPrc = $("#txtTax_Rate" + cnt).val();
        var vatAmount = Number(total) * VatPrc / 100;
        $("#txtTax" + cnt).val(vatAmount.RoundToSt(2));
        var total = Number(txtQuantityValue) * Number(txtPriceValue);
        $("#txtTotal" + cnt).val(total.RoundToSt(2));
        var totalAfterVat = Number(vatAmount.RoundToSt(2)) + Number(total.RoundToSt(2));
        $("#txtTotAfterTax" + cnt).val(totalAfterVat.RoundToSt(2));
        ComputeTotals();
    }
    function DeleteRow(RecNo) {
        if (!SysSession.CurrentPrivileges.Remove)
            return;
        WorningMessage("هل تريد الحذف؟", "Do you want to delete?", "تحذير", "worning", function () {
            $("#txt_StatusFlag" + RecNo).val() == 'i' ? $("#txt_StatusFlag" + RecNo).val('m') : $("#txt_StatusFlag" + RecNo).val('d');
            CountItems = CountItems - 1;
            ComputeTotals();
            Insert_Serial();
            txtItemCount.value = CountItems.toString();
            $("#ddlFamily" + RecNo).val("99");
            $("#ddlItem" + RecNo).val("99");
            $("#txtQuantity" + RecNo).val("99");
            $("#txtPrice" + RecNo).val("199");
            $("#txtUnitpriceWithVat" + RecNo).val("199");
            $("#No_Row" + RecNo).attr("hidden", "true");
        });
    }
    function AddNewRow() {
        if (SysSession.CurrentEnvironment.InvoiceTransCode == 1) {
            if (ddlInvoiceCustomer.value.trim() == "" && SysSession.CurrentEnvironment.InvoiceTransCode == 1) { //علي الحساب  
                DisplayMassage(" برجاء اختيار العميل", "Please select a customer", MessageType.Worning);
                Errorinput(ddlInvoiceCustomer);
                return false;
            }
        }
        else {
            if (ddlType.value == "0" && ddlInvoiceCustomer.value.trim() == "") { //علي الحساب  
                DisplayMassage(" برجاء اختيار العميل", "Please select a customer", MessageType.Worning);
                Errorinput(ddlInvoiceCustomer);
                return false;
            }
        }
        if (!SysSession.CurrentPrivileges.AddNew)
            return;
        var CanAdd = true;
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
            $("#btnSearchItems" + CountGrid).removeAttr("disabled");
            $("#txtQuantity" + i).removeClass("px-3");
            $("#txtReturnQuantity" + CountGrid).attr("disabled", "disabled");
            $("#btn_minus" + CountGrid).removeClass("display_none");
            $("#btn_minus" + CountGrid).removeAttr("disabled");
            if (flag_PriceWithVAT == true) {
                $("#txtUnitpriceWithVat" + CountGrid).removeAttr("disabled");
                $("#txtPrice" + CountGrid).removeAttr("disabled");
            }
            else {
                $("#txtPrice" + CountGrid).removeAttr("disabled");
                $("#txtUnitpriceWithVat" + CountGrid).attr("disabled", "disabled");
            }
            CountGrid++;
            Insert_Serial();
        }
    }
    function checkRepeatedItems(itemValue, familyValue, cnt) {
        var items = Number(txtItemCount.value);
        var flag = false;
        for (var i = 0; i < items - 1; i++) {
            if (Number($("#ddlItem" + i).val()) == itemValue && Number($("#ddlFamily" + i).val()) == familyValue && i != cnt) {
                flag = true;
            }
        }
        return flag;
    }
    function ComputeTotals() {
        PackageCount = 0;
        CountTotal = 0;
        var TotalDiscount = 0;
        var Totalbefore = 0;
        TaxCount = 0;
        NetCount = 0;
        for (var i = 0; i < CountGrid; i++) {
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
            }
        }
        txtItemCount.value = CountItems.toString();
        txtPackageCount.value = PackageCount.toString();
        txtTotalDiscount.value = TotalDiscount.toString();
        txtTotalbefore.value = Totalbefore.toString();
        txtTotal.value = CountTotal.toString();
        txtTax.value = TaxCount.toString();
        txtNet.value = (Number(NetCount.RoundToSt(2))).RoundToSt(2);
    }
    function Insert_Serial() {
        var Chack_Flag = false;
        var flagval = "";
        var Ser = 1;
        for (var i = 0; i < CountGrid; i++) {
            flagval = $("#txt_StatusFlag" + i).val();
            if (flagval != "d" && flagval != "m") {
                $("#txtSerial" + i).val(Ser);
                Ser++;
            }
            if (flagval == 'd' || flagval == 'm' || flagval == 'i') {
                Chack_Flag = true;
            }
            if (Chack_Flag) {
                if ($("#txt_StatusFlag" + i).val() != 'i' && $("#txt_StatusFlag" + i).val() != 'm' && $("#txt_StatusFlag" + i).val() != 'd') {
                    $("#txt_StatusFlag" + i).val('u');
                }
            }
        }
    }
    //------------------------------------------------------ Search && Clear &&Validation  Region------------------------
    function _SearchBox_Change() {
        if (searchbutmemreport.value != "") {
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
        //$("#divGridDetails").jsGrid("option", "pageIndex", 1);
        // 
        //var myarr = $("#divGridDetails").jsGrid("option", "data");
        //let val = searchbutmemreport.value;
        //var result = myarr[0].filter(function (e) {
        //    return e.indexOf(val) !== -1;
        //});
        //Grid.DataSource = result;
        //Grid.Bind();
        //let a = $("#divGridDetails").jsGrid("option", "data");
        //var search = new RegExp(term, 'i'); // prepare a regex object
        //let b = a.filter(item => item.toLowerCase().indexOf(term) > -1);
        //console.log(b); // ["foo","fool","cool"]
        //var term = searchbutmemreport.value; // search term (regex pattern)
        //let ar = $("#divGridDetails").jsGrid("option", "data");
        //Grid.DataSource = findInArray( ar,term);
        //Grid.Bind();
        return;
        //$("#divGridDetails").jsGrid("option", "pageSize", 10000); 
        //let cnt = 1;
        //if (SlsInvoiceStatisticsDetails.length > 0) {
        //    let ii = 0;
        //    $("#divGridDetails").jsGrid("option", "pageIndex", cnt);
        //    for (var u = 0; u < SlsInvoiceStatisticsDetails.length; u++) {
        //         
        //        if (ii > $("#divGridDetails").jsGrid("option", "pageSize")) {
        //            cnt += 1;
        //            $("#divGridDetails").jsGrid("option", "pageIndex", cnt);
        //            ii = 0;
        //        }
        //        ii++;
        //        //------------------------------------------------------------------------
        //        var  input, filter, table, tr, td, i, txtValue;
        //        input = document.getElementById("searchbutmemreport");
        //        filter = input.value.toUpperCase();
        //        table = document.getElementById("divGridDetails");
        //        tr = table.getElementsByTagName("tr");
        //        for (i = 0; i < tr.length; i++) {
        //            td = tr[i].getElementsByTagName("td")[0];
        //            if (td) {
        //                txtValue = td.textContent || td.innerText;
        //                if (txtValue.toUpperCase().indexOf(filter) > -1) {
        //                    tr[i].style.display = ""; 
        //                } else {
        //                    tr[i].style.display = "none";
        //                }
        //            }
        //        }
        //        //------------------------------------------------------------------------
        //    }
        //}
        //if (searchbutmemreport.value.trim() == '') {
        //    $("#divGridDetails").jsGrid("option", "pageIndex", 1);
        //    $('.jsgrid-filter-row').attr('style', 'display: none;')
        //    $('.jsgrid-insert-row').attr('style', 'display: none;')
        //}
        //let pages =( SlsInvoiceStatisticsDetails.length / Number($("#divGridDetails").jsGrid("option", "pageSize"))) + 1;
        //pages = parseInt(pages.toString());
        //pages = pages + 1;
        //alert(pages);
        //for (var u = 1; u <= pages; u++) {
        //    var input, filter, table, tr, td, i, txtValue;
        //    input = document.getElementById("searchbutmemreport");
        //    filter = input.value.toUpperCase();
        //    table = document.getElementById("divGridDetails");
        //    tr = table.getElementsByTagName("tr");
        //    let flag = 0;
        //    for (i = 0; i < tr.length; i++) {
        //        td = tr[i].getElementsByTagName("td")[0];
        //        if (td) {
        //            txtValue = td.textContent || td.innerText;
        //            if (txtValue.toUpperCase().indexOf(filter) > -1) {
        //                tr[i].style.display = "";
        //                flag = 1;
        //            } else {
        //                tr[i].style.display = "none";
        //            }
        //        }
        //    }
        //    if (flag == 1) {
        //        break;
        //    }
        //    else {
        //        $("#divGridDetails").jsGrid("option", "pageIndex", u); 
        //    }
        //}
        //$('.jsgrid-filter-row').attr('style', 'display: none;')
        //$('.jsgrid-insert-row').attr('style', 'display: none;')
        ////setTimeout(function () {
        ////    $("#divGridDetails").jsGrid("option", "pageSize", 10);
        ////}, 1500);
    }
    function ValidationHeader() {
        if (ddlInvoiceCustomer.value.trim() == "" && SysSession.CurrentEnvironment.InvoiceTransCode == 1) {
            DisplayMassage('(برجاء اختيار العميل)', '(Please select a customer)', MessageType.Error);
            Errorinput(ddlInvoiceCustomer);
            return false;
        }
        else if (ddlSalesman.value == "null") {
            DisplayMassage(" برجاء اختيار المندوب", "Please select a Salesman", MessageType.Error);
            Errorinput(ddlSalesman);
            return false;
        }
        else if (ddlSalesPerson.value == "null") {
            DisplayMassage(" برجاء اختيار البائع", "Please select a Salesman", MessageType.Error);
            Errorinput(ddlSalesPerson);
            return false;
        }
        else if (ddlStore.value == "null" && NewAdd == true) {
            DisplayMassage(" برجاء اختيار المستودع", "Please select a Store", MessageType.Error);
            Errorinput(ddlStore);
            return false;
        }
        else if (txtInvoiceDate.value == "") {
            DisplayMassage(" برجاء ادخال التاريخ", "Please select a Date", MessageType.Error);
            Errorinput(txtInvoiceDate);
            return false;
        }
        else if (CountGrid == 0) {
            DisplayMassage(" برجاء ادخال بيانات الفاتورة", "Please select a Invoice data", MessageType.Error);
            Errorinput(btnAddDetails);
            return false;
        }
        else if (txtItemCount.value == '0') {
            DisplayMassage(" برجاء ادخال بيانات الفاتورة", "Please select a Invoice data", MessageType.Error);
            Errorinput(btnAddDetails);
            return false;
        }
        else if (ddlCashBox.value == 'null' && ddlType.value == '1') {
            DisplayMassage(" برجاء اختيار الصندوق", "Please select a Invoice data", MessageType.Error);
            Errorinput(ddlCashBox);
            return false;
        }
        else if (!CheckPeriodDate(txtInvoiceDate.value, "I")) {
            DisplayMassage("لا يمكنك الاضافه او التعديل في هذة الفتره المغلقه ", "Please select a Invoice data", MessageType.Error);
            Errorinput(txtInvoiceDate);
            return false;
        }
        else if (ddlType.value == '1') {
            var card = Number($('#txtCardMoney').val());
            var Cash = Number($('#txtCashMoney').val());
            var Net = card + Cash;
            if (Net != Number($('#txtNet').val())) {
                DisplayMassage("يجب ان يكون مجموع المبلغ المسدد بالكارت مع المسدد نقدا مساويا لصافي الفاتورة", "The amount paid should be equal to the net", MessageType.Worning);
                Errorinput($('#txtNet'));
                if ($('#txtCardMoney').val().trim() == '' && $('#txtCashMoney').val().trim() == '') {
                    Errorinput($('#txtCardMoney'));
                    Errorinput($('#txtCashMoney'));
                    Errorinput($('#txtNet'));
                }
                if ($('#txtCardMoney').val().trim() != '') {
                    Errorinput($('#txtCardMoney'));
                    Errorinput($('#txtNet'));
                }
                if ($('#txtCashMoney').val().trim() != '') {
                    Errorinput($('#txtCashMoney'));
                    Errorinput($('#txtNet'));
                }
                return false;
            }
        }
        return true;
    }
    function Validation_Grid(rowcount) {
        var Qty = Number($("#txtQuantity" + rowcount).val());
        var Price = Number($("#txtPrice" + rowcount).val());
        if ($("#txt_StatusFlag" + rowcount).val() == "d" || $("#txt_StatusFlag" + rowcount).val() == "m") {
            return true;
        }
        else {
            if ($("#ddlFamily" + rowcount).val() == "null") {
                DisplayMassage(" برجاء ادخال النوع", "Please enter the type", MessageType.Error);
                Errorinput($("#ddlFamily" + rowcount));
                return false;
            }
            else if ($("#ddlItem" + rowcount).val() == "null" || $("#ddlItem" + rowcount).val() == null) {
                DisplayMassage(" برجاء ادخال الصنف", "Please enter the Item", MessageType.Error);
                Errorinput($("#ddlItem" + rowcount));
                return false;
            }
            else if (Qty == 0) {
                DisplayMassage(" برجاء ادخال الكمية المباعة", "Please enter the Quantity sold", MessageType.Error);
                Errorinput($("#txtQuantity" + rowcount));
                return false;
            }
            else if (Price == 0) {
                DisplayMassage(" برجاء ادخال السعر", "Please enter the Price", MessageType.Error);
                Errorinput($("#txtPrice" + rowcount));
                Errorinput($("#txtUnitpriceWithVat" + rowcount));
                return false;
            }
            return true;
        }
    }
    function clear() {
        $('#div_Data').html("");
        CountGrid = 0;
        $('#txt_Tax_Discount').val("0");
        $('#txt_Tax_total_Discount').val("0");
        $('#txt_Tax_total_AfterDiscount').val("0");
        $('#txt_Tax_Vat').val("0");
        $('#txt_Tax_AfterTotalVAT').val("0");
        $('#ddlInvoiceCustomer').val("");
        $("#txt_Tax_Discount").attr("disabled", "disabled");
        $("#txt_Tax_total_Discount").attr("disabled", "disabled");
        $("#txt_Tax_total_AfterDiscount").attr("disabled", "disabled");
        $("#txtContract_NO").attr("disabled", "disabled");
        $("#txtPurchase_order_No").attr("disabled", "disabled");
        $("#txtDate_of_supply").attr("disabled", "disabled");
        $("#txtSupply_end_Date").attr("disabled", "disabled");
        $("#txtTerms_of_Payment").attr("disabled", "disabled");
    }
    //------------------------------------------------------ Get Functions  Region------------------------
    function GetAllIItem() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("StkDefItems", "GetAllItem"),
            data: {
                CompCode: compcode, BraCode: BranchCode, FinYear: Finyear, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    ItemFamilyDetails = result.Response;
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
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    AD_VatTypeDetails = result.Response;
                    VatPrc = AD_VatTypeDetails.VatPerc;
                }
            }
        });
    }
    //------------------------------------------------------ main Functions  Region------------------------
    function Assign() {
        List_MinUnitPrice = new Array();
        var StatusFlag;
        InvoiceModel = new I_Sls_TR_Invoice();
        InvoiceItemsDetailsModel = new Array();
        MasterDetailsModel.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
        MasterDetailsModel.UserCode = SysSession.CurrentEnvironment.UserCode;
        MasterDetailsModel.CompName = SysSession.CurrentEnvironment.CompanyNameAr;
        MasterDetailsModel.VatNo = SysSession.CurrentEnvironment.VatNo;
        InvoiceModel.CustomerId = Number(ddlInvoiceCustomer.value);
        InvoiceModel.CompCode = Number(compcode);
        InvoiceModel.BranchCode = Number(BranchCode);
        var InvoiceNumber = Number(lblInvoiceNumber.value);
        InvoiceModel.TrNo = InvoiceNumber;
        if (NewAdd != true) {
            InvoiceModel.CreatedAt = InvoiceStatisticsModel[0].CreatedAt;
            InvoiceModel.CreatedBy = InvoiceStatisticsModel[0].CreatedBy;
        }
        InvoiceModel.TrType = 0; //0 invoice 1 return
        InvoiceModel.SlsInvSrc = 1; // 1 from store 2 from van 
        InvoiceModel.SlsInvType = 1; //  retail 
        InvoiceModel.StoreId = StoreID; //main store
        InvoiceModel.RefTrID = null;
        ///////////////
        InvoiceModel.InvoiceID = GlobalinvoiceID;
        InvoiceModel.SalesmanId = Number(ddlSalesman.value);
        InvoiceModel.SalesPersonId = Number(ddlSalesPerson.value);
        InvoiceModel.StoreId = Number(ddlStore.value);
        InvoiceModel.NetAfterVat = Number(txtNet.value);
        InvoiceModel.TotalAmount = Number(txtTotal.value);
        InvoiceModel.ItemTotal = Number(txtTotalbefore.value);
        InvoiceModel.ItemDiscountTotal = Number(txtTotalDiscount.value);
        InvoiceModel.TrDate = txtInvoiceDate.value;
        InvoiceModel.CustomerName = txtInvoiceCustomerName.value;
        InvoiceModel.CustomerMobileNo = txtCustomerMobile.value;
        InvoiceModel.CommitionAmount = Number(txtCommission.value);
        InvoiceModel.VatType = vatType;
        InvoiceModel.VatAmount = Number(txtTax.value);
        InvoiceModel.RefNO = txtRefNo.value;
        InvoiceModel.Remark = txtRemarks.value;
        InvoiceModel.CardAmount = $('#txtCardMoney').val().trim() == '' ? 0 : Number($('#txtCardMoney').val());
        InvoiceModel.CashAmount = $('#txtCashMoney').val().trim() == '' ? 0 : Number($('#txtCashMoney').val());
        InvoiceModel.TaxCurrencyID = Number(SysSession.CurrentEnvironment.I_Control[0].Currencyid);
        InvoiceModel.InvoiceCurrenyID = Number(SysSession.CurrentEnvironment.I_Control[0].Currencyid);
        InvoiceModel.InvoiceTypeCode = Number(SysSession.CurrentEnvironment.InvoiceTypeCode);
        InvoiceModel.DocNo = GlobalDocNo;
        if (SysSession.CurrentEnvironment.InvoiceTransCode == 3) {
            if ((Number(ddlInvoiceCustomer.value) == 0 || ddlInvoiceCustomer.value.trim() == "")) {
                InvoiceModel.InvoiceTransCode = 2;
            }
            else {
                InvoiceModel.InvoiceTransCode = 1;
            }
        }
        else {
            InvoiceModel.InvoiceTransCode = SysSession.CurrentEnvironment.InvoiceTransCode;
        }
        InvoiceModel.DiscountAmount = 0;
        InvoiceModel.DiscountPrc = 0;
        InvoiceModel.AllowBase = $('#txt_Tax_total_Discount').val();
        InvoiceModel.AllowPrc = $('#txt_Tax_Discount').val();
        InvoiceModel.AllowVatPrc = $('#txt_Tax_Vat').val();
        InvoiceModel.AllowAfterVat = $('#txt_Tax_AfterTotalVAT').val();
        InvoiceModel.RoundingAmount = Number($('#txtFraction_difference').text());
        InvoiceModel.ContractNo = $('#txtContract_NO').val();
        InvoiceModel.PurchaseorderNo = $('#txtPurchase_order_No').val();
        InvoiceModel.DeliveryDate = $('#txtDate_of_supply').val();
        InvoiceModel.DeliveryEndDate = $('#txtSupply_end_Date').val();
        InvoiceModel.TaxNotes = $('#txtTerms_of_Payment').val();
        InvoiceModel.QtyTotal = $('#txtPackageCount').val();
        InvoiceModel.LineCount = $('#txtItemCount').val();
        InvoiceModel.CashBoxID = Number($('#ddlCashBox').val()) == 0 ? null : Number($('#ddlCashBox').val());
        //InvoiceModel.CashBoxID = Number($('#ddlCashBox').val());
        //InvoiceModel.CashBoxID = 20;
        if (ddlType.value == "0") {
            InvoiceModel.IsCash = false;
        }
        else {
            InvoiceModel.IsCash = true;
        }
        if (chkActive.checked == true) {
            InvoiceModel.Status = 1;
        }
        else {
            InvoiceModel.Status = 0;
        }
        // Details
        for (var i = 0; i < CountGrid; i++) {
            invoiceItemSingleModel = new I_Sls_TR_InvoiceItems();
            StatusFlag = $("#txt_StatusFlag" + i).val();
            //--------------------------------------------------------------**** VatNatID = null ****----------------------------------------------------
            if (StatusFlag != 'd' && StatusFlag != 'm') {
                var NatID = Number($("#txtTax_Rate" + i).attr('data-VatNatID'));
                if (isNaN(NatID) == true || NatID == 0) {
                    var itemID = Number($("#ddlItem" + i).val());
                    var NumberSelect = ItemFamilyDetails.filter(function (s) { return s.ItemID == itemID; });
                    Tax_Rate = NumberSelect[0].VatPrc;
                    Tax_Type_Model = GetVat(NumberSelect[0].VatNatID, Tax_Rate, vatType);
                    Tax_Rate = Tax_Type_Model.Prc;
                    VatPrc = Tax_Rate;
                    $("#txtTax_Rate" + i).attr('Data-VatNatID', Tax_Type_Model.Nature);
                    $("#txtTax_Rate" + i).val(VatPrc);
                    if (StatusFlag != 'd' && StatusFlag != 'm' && StatusFlag != 'i') {
                        StatusFlag = "u";
                    }
                }
            }
            //------------------------------------------------------------------------------------------------------------
            invoiceItemSingleModel.Name_Item = $("#ddlItem" + i + " option:selected").text();
            invoiceItemSingleModel.MinUnitPrice = Number($('option:selected', $("#ddlItem" + i)).attr('data-MinUnitPrice'));
            var MinPrice = $('option:selected', $("#ddlItem" + i)).attr('data-MinUnitPrice');
            if (Number($("#txtPrice" + i).val()) < Number(MinPrice)) {
                List_MinUnitPrice.push(invoiceItemSingleModel);
                Validation_Insert = 1;
            }
            if (StatusFlag == "i") {
                invoiceItemSingleModel.InvoiceItemID = 0;
                invoiceItemSingleModel.ItemID = $("#ddlItem" + i).val();
                invoiceItemSingleModel.Serial = $("#txtSerial" + i).val();
                invoiceItemSingleModel.SoldQty = $('#txtQuantity' + i).val();
                invoiceItemSingleModel.StockSoldQty = $('#txtQuantity' + i).val(); // 
                invoiceItemSingleModel.Unitprice = $("#txtPrice" + i).val();
                invoiceItemSingleModel.UnitpriceWithVat = $("#txtUnitpriceWithVat" + i).val();
                invoiceItemSingleModel.DiscountPrc = Number($("#txtDiscountPrc" + i).val());
                invoiceItemSingleModel.DiscountAmount = Number($("#txtDiscountAmount" + i).val());
                invoiceItemSingleModel.NetUnitPrice = Number($("#txtNetUnitPrice" + i).val());
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
                var VatNatID = Number($("#txtTax_Rate" + i).attr('data-VatNatID'));
                invoiceItemSingleModel.VatPrc = VatPrc; //$("#txtTax" + i).val();
                invoiceItemSingleModel.VatNatID = VatNatID;
                invoiceItemSingleModel.VatAmount = $("#txtTax" + i).val();
                invoiceItemSingleModel.ItemTotal = invoiceItemSingleModel.Unitprice * invoiceItemSingleModel.SoldQty;
                invoiceItemSingleModel.TotRetQty = $("#txtReturnQuantity" + i).val();
                invoiceItemSingleModel.StatusFlag = StatusFlag.toString();
                invoiceItemSingleModel.StockUnitCost = Number($("#UnitCost" + i).val());
                InvoiceItemsDetailsModel.push(invoiceItemSingleModel);
            }
            if (StatusFlag == "u") {
                var invoiceItemId = $("#InvoiceItemID" + i).val();
                invoiceItemSingleModel.InvoiceItemID = invoiceItemId;
                invoiceItemSingleModel.ItemID = $("#ddlItem" + i).val();
                invoiceItemSingleModel.Serial = $("#txtSerial" + i).val();
                invoiceItemSingleModel.StatusFlag = StatusFlag.toString();
                invoiceItemSingleModel.SoldQty = $('#txtQuantity' + i).val();
                invoiceItemSingleModel.StockSoldQty = $('#txtQuantity' + i).val(); //
                invoiceItemSingleModel.TotRetQty = $('#txtReturnQuantity' + i).val();
                invoiceItemSingleModel.Unitprice = $("#txtPrice" + i).val();
                invoiceItemSingleModel.UnitpriceWithVat = $("#txtUnitpriceWithVat" + i).val();
                invoiceItemSingleModel.DiscountPrc = Number($("#txtDiscountPrc" + i).val());
                invoiceItemSingleModel.DiscountAmount = Number($("#txtDiscountAmount" + i).val());
                invoiceItemSingleModel.NetUnitPrice = Number($("#txtNetUnitPrice" + i).val());
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
                var VatNatID = Number($("#txtTax_Rate" + i).attr('data-VatNatID'));
                invoiceItemSingleModel.VatPrc = VatPrc; // $("#txtTax" + i).val();
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
        MasterDetailsModel.Branch_Code = SysSession.CurrentEnvironment.BranchCode;
        MasterDetailsModel.Comp_Code = SysSession.CurrentEnvironment.CompCode;
        MasterDetailsModel.MODULE_CODE = SysSession.CurrentEnvironment.ModuleCode;
        MasterDetailsModel.UserCode = SysSession.CurrentEnvironment.UserCode;
        MasterDetailsModel.sec_FinYear = SysSession.CurrentEnvironment.CurrentYear;
    }
    function Update() {
        debugger;
        if (!CheckDate(DateFormat(txtInvoiceDate.value).toString(), DateFormat(SysSession.CurrentEnvironment.StartDate).toString(), DateFormat(SysSession.CurrentEnvironment.EndDate).toString())) {
            WorningMessage('  التاريخ ليس متطابق مع تاريخ السنه (' + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ')', '  The date is not identical with the date of the year (' + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ')', "تحذير", "worning");
            return;
        }
        InvoiceModel.CreatedAt = InvoiceStatisticsModel[0].CreatedAt;
        InvoiceModel.CreatedBy = InvoiceStatisticsModel[0].CreatedBy;
        MasterDetailsModel.I_Sls_TR_Invoice.TrTime = InvoiceStatisticsModel[0].TrTime;
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("SlsTrSales", "updateInvoiceMasterDetail"),
            data: JSON.stringify(MasterDetailsModel),
            success: function (d) {
                var result = d;
                if (result.IsSuccess == true) {
                    var res = result.Response;
                    DateSetsSccess("txtInvoiceDate", "txtStartDate", "txtEndDate");
                    DisplayMassage('( تم تعديل الفاتورة (' + res.TrNo + ') بنجاح )', '(The invoice has been successfully modified)', MessageType.Succeed);
                    invoiceID = res.InvoiceID;
                    $('#divCreationPanel').removeClass("display_none");
                    $('#txtUpdatedBy').prop("value", res.UpdatedBy);
                    $('#txtUpdatedAt').prop("value", res.UpdatedAt);
                    //success();
                    displayDate_speed(invoiceID, res);
                    success_insert();
                    IsSuccess = true;
                    if (res.Status == 1) {
                        setTimeout(function () { DownloadInvoicePdf(); }, 500);
                    }
                    Save_Succ_But();
                }
                else {
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
            return;
        }
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("SlsTrSales", "InsertInvoiceMasterDetail"),
            data: JSON.stringify(MasterDetailsModel),
            success: function (d) {
                var result = d;
                if (result.IsSuccess == true) {
                    var res = result.Response;
                    DateSetsSccess("txtInvoiceDate", "txtStartDate", "txtEndDate");
                    invoiceID = res.InvoiceID;
                    DisplayMassage(" تم اصدار  فاتورة رقم  " + res.TrNo + " ", "An invoice number has been issued ", MessageType.Succeed);
                    GlobalDocNo = res.DocNo;
                    displayDate_speed(invoiceID, res);
                    success_insert();
                    IsSuccess = true;
                    if (res.Status == 1) {
                        setTimeout(function () { DownloadInvoicePdf(); }, 500);
                    }
                    Save_Succ_But();
                }
                else {
                    IsSuccess = false;
                    DisplayMassage("الرجاء تحديث الصفحة واعادت تكرارالمحاولة مره اخري", "Please refresh the page and try again", MessageType.Error);
                }
            }
        });
    }
    function success_insert() {
        //NewAdd = true;
        //btnBack_onclick();
        //btnShow_onclick();
        $("#cotrolDiv").removeClass("disabledDiv");
        $("#divIconbar").removeClass("disabledIconbar");
        Show = true; //   ////
        $("#btnUpdate").removeClass("display_none");
        $("#btnPrintTransaction").removeClass("display_none");
        $("#DivInvoiceDetails").removeClass("display_none");
        NewAdd = false;
        clear();
        InvoiceStatisticsModel = new Array();
        Selecteditem = new Array();
        Selecteditem = SlsInvoiceStatisticsDetails.filter(function (x) { return x.InvoiceID == Number(invoiceID); });
        GlobalinvoiceID = Selecteditem[0].InvoiceID;
        InvoiceStatisticsModel = Selecteditem;
        InvoiceStatisticsModel = Selecteditem;
        if (InvoiceStatisticsModel[0].InvoiceTransCode != 1) {
            $('#btndiv_2').addClass('display_none');
        }
        else {
            $('#btndiv_2').removeClass('display_none');
        }
        if (InvoiceStatisticsModel.length) {
            txtItemCount.value = "" + InvoiceStatisticsModel[0].Line_Count + "";
            txtPackageCount.value = "" + InvoiceStatisticsModel[0].Tot_Qty + "";
            txtTotal.value = InvoiceStatisticsModel[0].TotalAmount.RoundToSt(2);
            txtTax.value = InvoiceStatisticsModel[0].VatAmount.RoundToSt(2);
            txtNet.value = InvoiceStatisticsModel[0].NetAfterVat == null ? '' : InvoiceStatisticsModel[0].NetAfterVat.RoundToSt(2);
            txtCommission.value = InvoiceStatisticsModel[0].CommitionAmount.RoundToSt(2);
            commissionCount = InvoiceStatisticsModel[0].CommitionAmount;
            //ComputeTotals();
            GlobalinvoiceID = InvoiceStatisticsModel[0].InvoiceID;
            //InvoiceTransCode = InvoiceStatisticsModel[0].InvoiceTransCode;
            lblInvoiceNumber.value = InvoiceStatisticsModel[0].TrNo.toString();
            txtInvoiceDate.value = DateFormat(InvoiceStatisticsModel[0].TrDate.toString());
            StoreID = Selecteditem[0].StoreId;
            if (InvoiceStatisticsModel[0].CustomerId != null) {
                //$('#ddlInvoiceCustomer').val(InvoiceStatisticsModel[0].CustomerId);
                $('#ddlInvoiceCustomer').prop("value", InvoiceStatisticsModel[0].CustomerId);
                $('#txt_CustCode').val(InvoiceStatisticsModel[0].Cus_Code);
                $('#txtInvoiceCustomerName').prop("value", InvoiceStatisticsModel[0].Cus_NameA);
                $('#txtCustomerMobile').prop("value", InvoiceStatisticsModel[0].CustomerMobileNo);
            }
            else {
                $('#txtInvoiceCustomerName').prop("value", InvoiceStatisticsModel[0].CustomerName);
                $('#txtCustomerMobile').prop("value", InvoiceStatisticsModel[0].CustomerMobileNo);
                //$('#ddlInvoiceCustomer option[value=null]').prop('selected', 'selected').change();
                $('#ddlInvoiceCustomer').val('');
                //$('#ddlInvoiceCustomer').val(InvoiceStatisticsModel[0].CustomerId.toString());
            }
            var ddlSalesmanValue = InvoiceStatisticsModel[0].SalesmanId.toString();
            $('#ddlSalesman').prop("value", ddlSalesmanValue);
            var ddlSalesPersonValue = InvoiceStatisticsModel[0].SalesPersonId.toString();
            $('#ddlSalesPerson').prop("value", ddlSalesPersonValue);
            if (InvoiceStatisticsModel[0].Status == 1) {
                chkActive.checked = true;
                chkPreivilegeToEditApprovedInvoice();
            }
            else {
                chkActive.checked = false;
                btnUpdate.disabled = !SysSession.CurrentPrivileges.EDIT;
                chkActive.disabled = true;
            }
            if (InvoiceStatisticsModel[0].IsCash == true) {
                $('#ddlType').prop("value", "1");
                $("#txtCustomerMobile").attr("disabled", "disabled");
                $("#txtInvoiceCustomerName").removeAttr("disabled");
                $("#Div_Money").removeClass("display_none");
                TypeFlag = true;
            }
            else {
                $('#ddlType').prop("value", "0");
                $('#ddlCashBox').prop('selectedIndex', 0);
                $('#ddlCashBox').attr('disabled', 'disabled');
                $("#txtInvoiceCustomerName").attr("disabled", "disabled");
                //$("#ddlInvoiceCustomer").removeAttr("disabled");
                $("#txtCustomerMobile").removeAttr("disabled");
                $("#Div_Money").addClass("display_none");
                TypeFlag = false;
            }
            $('#divCreationPanel').removeClass("display_none");
            $('#txtCreatedBy').prop("value", InvoiceStatisticsModel[0].CreatedBy);
            $('#txtCreatedAt').prop("value", InvoiceStatisticsModel[0].CreatedAt);
            $('#txtUpdatedBy').prop("value", InvoiceStatisticsModel[0].UpdatedBy);
            $('#txtUpdatedAt').prop("value", InvoiceStatisticsModel[0].UpdatedAt);
            $('#txtCashMoney').prop("value", InvoiceStatisticsModel[0].CashAmount.RoundToSt(2));
            $('#txtCardMoney').prop("value", InvoiceStatisticsModel[0].CardAmount.RoundToSt(2));
            $('#ddlCashBox').val(InvoiceStatisticsModel[0].CashBoxID == null ? 'null' : InvoiceStatisticsModel[0].CashBoxID);
        }
        NewAdd = false;
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("SlsTrSales", "GetSlsInvoiceItem"),
            data: { invoiceID: GlobalinvoiceID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    SlsInvoiceItemsDetails = result.Response;
                    for (var i = 0; i < SlsInvoiceItemsDetails.length; i++) {
                        BuildControls(i);
                    }
                    CountGrid = SlsInvoiceItemsDetails.length;
                    CountItems = SlsInvoiceItemsDetails.length;
                }
            }
        });
        $("#btnSave").addClass("display_none");
        $("#btnBack").addClass("display_none");
        //$("#ddlInvoiceCustomer").attr("disabled", "disabled");
        $("#ddlSalesPerson").attr("disabled", "disabled");
        $("#ddlSalesman").attr("disabled", "disabled");
        $("#txtCashMoney").attr("disabled", "disabled");
        $("#txtCardMoney").attr("disabled", "disabled");
        $('#ddlCashBox').attr('disabled', 'disabled');
        //ddlInvoiceCustomer.disabled = true;
        ddlSalesman.disabled = true;
        txtInvoiceDate.disabled = true;
        ddlInvoiceCustomer.disabled = true;
        txtInvoiceCustomerName.disabled = true;
        txtCustomerMobile.disabled = true;
        ddlSalesman.disabled = true;
        txtRefNo.disabled = true;
        txtRemarks.disabled = true;
        ddlType.disabled = true;
        txtCommission.disabled = true;
        ddlStore.disabled = true;
        if (InvoiceStatisticsModel[0].Status == 1) {
            if (!SysSession.CurrentPrivileges.CUSTOM2) {
                AutherizeFlag = false;
                $("#btnUpdate").addClass("display_none");
            }
            else {
                AutherizeFlag = true;
                $("#btnUpdate").removeClass("display_none");
            }
        }
        DocumentActions.RenderFromModel(InvoiceStatisticsModel[0]);
        txtNet.value = InvoiceStatisticsModel[0].NetAfterVat.RoundToSt(2);
        $('#txtContract_NO').val(InvoiceStatisticsModel[0].ContractNo);
        $('#txtPurchase_order_No').val(InvoiceStatisticsModel[0].PurchaseorderNo);
        $('#txtTerms_of_Payment').val(InvoiceStatisticsModel[0].TaxNotes);
        var DeliveryDate = DateFormat(InvoiceStatisticsModel[0].DeliveryDate);
        $('#txtDate_of_supply').val(DeliveryDate);
        var DeliveryEndDate = DateFormat(InvoiceStatisticsModel[0].DeliveryEndDate);
        $('#txtSupply_end_Date').val(DeliveryEndDate);
        NewAdd = false;
        btndiv_1_onclick();
        $("#div_btnPrint").removeClass("display_none");
        $("#btnPrintInvoicePrice").removeClass("display_none");
        $("#btnCust").attr("disabled", "disabled");
        $("#txt_CustCode").attr("disabled", "disabled");
    }
    function displayDate_speed(invID, res) {
        NewAdd = true;
        btnBack_onclick();
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
    }
    function success() {
        $("#cotrolDiv").removeClass("disabledDiv");
        $("#divIconbar").removeClass("disabledIconbar");
        BindStatisticGridData();
        Grid_RowDoubleClicked();
    }
    function open_success() {
        Show = true; //   ////
        $("#btnUpdate").removeClass("display_none");
        $("#btnPrintTransaction").removeClass("display_none");
        $("#DivInvoiceDetails").removeClass("display_none");
        clear();
        InvoiceStatisticsModel = new Array();
        Selecteditem = new Array();
        Selecteditem = SlsInvoiceStatisticsDetails.filter(function (x) { return x.InvoiceID == Number(Grid.SelectedKey); });
        GlobalinvoiceID = Number(Selecteditem[0].InvoiceID);
        InvoiceStatisticsModel = Selecteditem;
        if (InvoiceStatisticsModel[0].InvoiceTransCode != 1) {
            $('#btndiv_2').addClass('display_none');
        }
        else {
            $('#btndiv_2').removeClass('display_none');
        }
        if (InvoiceStatisticsModel.length) {
            txtItemCount.value = InvoiceStatisticsModel[0].Line_Count.toString();
            txtPackageCount.value = InvoiceStatisticsModel[0].Tot_Qty.toString();
            txtTotal.value = InvoiceStatisticsModel[0].TotalAmount.toString();
            txtTax.value = InvoiceStatisticsModel[0].VatAmount.toString();
            txtNet.value = InvoiceStatisticsModel[0].NetAfterVat == null ? '' : InvoiceStatisticsModel[0].NetAfterVat.toString();
            txtCommission.value = InvoiceStatisticsModel[0].CommitionAmount.toString();
            commissionCount = InvoiceStatisticsModel[0].CommitionAmount;
            ComputeTotals();
            GlobalinvoiceID = InvoiceStatisticsModel[0].InvoiceID;
            //InvoiceTransCode = InvoiceStatisticsModel[0].InvoiceTransCode;
            lblInvoiceNumber.value = InvoiceStatisticsModel[0].TrNo.toString();
            txtInvoiceDate.value = DateFormat(InvoiceStatisticsModel[0].TrDate.toString());
            StoreID = Selecteditem[0].StoreId;
            if (InvoiceStatisticsModel[0].CustomerId != null) {
                //$('#ddlInvoiceCustomer').val(InvoiceStatisticsModel[0].CustomerId); 
                $('#ddlInvoiceCustomer').prop("value", InvoiceStatisticsModel[0].CustomerId);
                $('#txtInvoiceCustomerName').prop("value", InvoiceStatisticsModel[0].Cus_NameA);
                $('#txtCustomerMobile').prop("value", InvoiceStatisticsModel[0].CustomerMobileNo);
            }
            else {
                $('#txtInvoiceCustomerName').prop("value", InvoiceStatisticsModel[0].CustomerName);
                $('#txtCustomerMobile').prop("value", InvoiceStatisticsModel[0].CustomerMobileNo);
                //$('#ddlInvoiceCustomer option[value=null]').prop('selected', 'selected').change();
                $('#ddlInvoiceCustomer').val('');
                //$('#ddlInvoiceCustomer').val(InvoiceStatisticsModel[0].CustomerId.toString());
            }
            var ddlSalesmanValue = InvoiceStatisticsModel[0].SalesmanId.toString();
            $('#ddlSalesman').prop("value", ddlSalesmanValue);
            var ddlSalesPersonValue = InvoiceStatisticsModel[0].SalesPersonId.toString();
            $('#ddlSalesPerson').prop("value", ddlSalesPersonValue);
            if (InvoiceStatisticsModel[0].Status == 1) {
                chkActive.checked = true;
                chkPreivilegeToEditApprovedInvoice();
            }
            else {
                chkActive.checked = false;
                btnUpdate.disabled = !SysSession.CurrentPrivileges.EDIT;
                chkActive.disabled = true;
            }
            if (InvoiceStatisticsModel[0].IsCash == true) {
                $('#ddlType').prop("value", "1");
                $("#txtCustomerMobile").attr("disabled", "disabled");
                $("#txtInvoiceCustomerName").removeAttr("disabled");
                $("#Div_Money").removeClass("display_none");
                TypeFlag = true;
            }
            else {
                $('#ddlType').prop("value", "0");
                $('#ddlCashBox').prop('selectedIndex', 0);
                $('#ddlCashBox').attr('disabled', 'disabled');
                $("#txtInvoiceCustomerName").attr("disabled", "disabled");
                //$("#ddlInvoiceCustomer").removeAttr("disabled");
                $("#txtCustomerMobile").removeAttr("disabled");
                $("#Div_Money").addClass("display_none");
                TypeFlag = false;
            }
            $('#divCreationPanel').removeClass("display_none");
            $('#txtCreatedBy').prop("value", InvoiceStatisticsModel[0].CreatedBy);
            $('#txtCreatedAt').prop("value", InvoiceStatisticsModel[0].CreatedAt);
            $('#txtUpdatedBy').prop("value", InvoiceStatisticsModel[0].UpdatedBy);
            $('#txtUpdatedAt').prop("value", InvoiceStatisticsModel[0].UpdatedAt);
            $('#txtCashMoney').prop("value", InvoiceStatisticsModel[0].CashAmount.RoundToSt(2));
            $('#txtCardMoney').prop("value", InvoiceStatisticsModel[0].CardAmount.RoundToSt(2));
            $('#ddlCashBox').val(InvoiceStatisticsModel[0].CashBoxID == null ? 'null' : InvoiceStatisticsModel[0].CashBoxID);
        }
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("SlsTrSales", "GetSlsInvoiceItem"),
            data: { invoiceID: GlobalinvoiceID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    SlsInvoiceItemsDetails = result.Response;
                    for (var i = 0; i < SlsInvoiceItemsDetails.length; i++) {
                        BuildControls(i);
                    }
                    CountGrid = SlsInvoiceItemsDetails.length;
                    CountItems = SlsInvoiceItemsDetails.length;
                }
            }
        });
        $("#btnSave").addClass("display_none");
        $("#btnBack").addClass("display_none");
        //$("#ddlInvoiceCustomer").attr("disabled", "disabled");
        $("#ddlSalesman").attr("disabled", "disabled");
        $("#ddlSalesPerson").attr("disabled", "disabled");
        $("#txtCashMoney").attr("disabled", "disabled");
        $("#txtCardMoney").attr("disabled", "disabled");
        $('#ddlCashBox').attr('disabled', 'disabled');
        txtInvoiceDate.disabled = true;
        ddlInvoiceCustomer.disabled = true;
        txtInvoiceCustomerName.disabled = true;
        txtCustomerMobile.disabled = true;
        txtRefNo.disabled = true;
        txtRemarks.disabled = true;
        ddlType.disabled = true;
        txtCommission.disabled = true;
        ddlStore.disabled = true;
        if (InvoiceStatisticsModel[0].Status == 1) {
            if (!SysSession.CurrentPrivileges.CUSTOM2) {
                AutherizeFlag = false;
                $("#btnUpdate").addClass("display_none");
            }
            else {
                AutherizeFlag = true;
                $("#btnUpdate").removeClass("display_none");
            }
        }
        DocumentActions.RenderFromModel(InvoiceStatisticsModel[0]);
        $('#txtContract_NO').val(InvoiceStatisticsModel[0].ContractNo);
        $('#txtPurchase_order_No').val(InvoiceStatisticsModel[0].PurchaseorderNo);
        $('#txtTerms_of_Payment').val(InvoiceStatisticsModel[0].TaxNotes);
        var DeliveryDate = DateFormat(InvoiceStatisticsModel[0].DeliveryDate);
        $('#txtDate_of_supply').val(DeliveryDate);
        var DeliveryEndDate = DateFormat(InvoiceStatisticsModel[0].DeliveryEndDate);
        $('#txtSupply_end_Date').val(DeliveryEndDate);
        NewAdd = false;
        btndiv_1_onclick();
        $("#div_btnPrint").removeClass("display_none");
        $("#btnPrintInvoicePrice").removeClass("display_none");
    }
    function updateWithProcess() {
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("SlsTrSales", "Open"),
            data: JSON.stringify(MasterDetailsModel),
            success: function (d) {
                var result = d;
                if (result.IsSuccess == true) {
                    var res = result.Response;
                    if (res.Status == 0) {
                        DisplayMassage('( تم تعديل الفاتورة بنجاح )', '(success)', MessageType.Succeed);
                    }
                    else {
                        DisplayMassage('( تم اعتماد الفاتورة بنجاح )', '(success)', MessageType.Succeed);
                    }
                    $('#divCreationPanel').removeClass("display_none");
                    $('#txtUpdatedBy').prop("value", res.UpdatedBy);
                    $('#txtUpdatedAt').prop("value", res.UpdatedAt);
                    AutherizeFlag = false;
                    success();
                    IsSuccess = true;
                }
                else {
                    IsSuccess = false;
                    DisplayMassage('( هناك خطـأ)', '(Error)', MessageType.Error);
                }
            }
        });
    }
    function openInvoice() {
        if (!CheckPeriodDate(txtInvoiceDate.value, "I")) {
            DisplayMassage("لا يمكنك الاضافه او التعديل في هذة الفتره المغلقه ", "Please select a Invoice data", MessageType.Error);
            Errorinput(txtInvoiceDate);
            chkActive.checked = true;
            return false;
        }
        Assign();
        //InvoiceModel.CreatedAt = InvoiceStatisticsModel[0].CreatedAt;
        //InvoiceModel.CreatedBy = InvoiceStatisticsModel[0].CreatedBy;
        //let Selecteditem
        //Selecteditem = SlsInvoiceStatisticsDetails.filter(x => x.InvoiceID == Number(Grid.SelectedKey));
        //try {
        //    GlobalinvoiceID = Number(Selecteditem[0].InvoiceID);
        //} catch (e) {
        //    Selecteditem = SlsInvoiceStatisticsDetails.filter(x => x.InvoiceID == Number(invoiceID));
        //    GlobalinvoiceID = Number(Selecteditem[0].InvoiceID);
        //}
        InvoiceModel.InvoiceID = GlobalinvoiceID;
        InvoiceModel.CompCode = Number(compcode);
        InvoiceModel.BranchCode = Number(BranchCode);
        var InvoiceNumber = Number(lblInvoiceNumber.value);
        InvoiceModel.TrNo = InvoiceNumber;
        InvoiceModel.CreatedAt = $('#txtCreatedAt').val();
        InvoiceModel.CreatedBy = $('#txtCreatedBy').val();
        InvoiceModel.UpdatedBy = SysSession.CurrentEnvironment.UserCode;
        InvoiceModel.UpdatedAt = DateTimeFormat(Date().toString());
        InvoiceModel.CustomerName = $("#txtInvoiceCustomerName").val();
        //InvoiceModel.CustomerName = $("#ddlInvoiceCustomer option:selected").text();
        InvoiceModel.TrType = 0; // invoice 1 return
        InvoiceModel.SlsInvSrc = 1; // 1 from store 2 from van 
        InvoiceModel.SlsInvType = 1; // retail 
        InvoiceModel.StoreId = StoreID; //main store
        InvoiceModel.SalesmanId = Number(ddlSalesman.value);
        InvoiceModel.SalesPersonId = Number(ddlSalesPerson.value);
        InvoiceModel.StoreId = Number(ddlStore.value);
        InvoiceModel.RefTrID = null;
        InvoiceModel.Status = 0;
        MasterDetailsModel.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
        MasterDetailsModel.UserCode = SysSession.CurrentEnvironment.UserCode;
        MasterDetailsModel.I_Sls_TR_Invoice.TrTime = InvoiceStatisticsModel[0].TrTime;
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("SlsTrSales", "Open"),
            data: JSON.stringify(MasterDetailsModel),
            success: function (d) {
                var result = d;
                if (result.IsSuccess == true) {
                    var res = result.Response;
                    DisplayMassage('( تم فك اعتماد الفاتورة (' + res.TrNo + ') بنجاح )', '(The invoice has been successfully modified)', MessageType.Succeed);
                    invoiceID = res.InvoiceID;
                    $('#divCreationPanel').removeClass("display_none");
                    $('#txtUpdatedBy').prop("value", res.UpdatedBy);
                    $('#txtUpdatedAt').prop("value", res.UpdatedAt);
                    displayDate_speed(invoiceID, res);
                    $("#DivInvoiceDetails").removeClass("display_none");
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
                Update();
                //if (AutherizeFlag == false) {
                //} else {
                //    updateWithProcess();
                //    AutherizeFlag = false;
                //}
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
    //------------------------------------------------------Print------------------------
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
        if (ddlSalesmanFilter.selectedIndex > 0)
            rp.SalesmanID = Number($("#ddlSalesmanFilter").val());
        else
            rp.SalesmanID = -1;
        if (Number($("#ddlCustomer").val()) == 0)
            rp.CustomerID = -1;
        else
            rp.CustomerID = Number($("#ddlCustomer").val());
        rp.OperationId = -1;
        rp.CashType = Number($("#ddlInvoiceType").val());
        rp.Status = Number($("#ddlStateType").val());
        rp.TrType = 0;
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
    SlsTrSalesManager.PrintReport = PrintReport;
    function PrintTransaction() {
        if (!SysSession.CurrentPrivileges.PrintOut)
            return;
        var rp = new ReportParameters();
        window.open(Url.Action("ReportsPopup", "Home"), "blank");
        localStorage.setItem("result", '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>');
        rp.Type = 4;
        rp.Repdesign = 0;
        rp.TRId = GlobalinvoiceID;
        rp.slip = 0;
        rp.stat = InvoiceModel.InvoiceTransCode;
        rp.Name_function = "rptInvoiceNote";
        localStorage.setItem("Report_Data", JSON.stringify(rp));
        localStorage.setItem("result", '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>');
        window.open(Url.Action("ReportsPopup", "Home"), "blank");
    }
    function btnPrintInvoicePrice_onclick() {
        ////
        if (!SysSession.CurrentPrivileges.PrintOut)
            return;
        var rp = new ReportParameters();
        window.open(Url.Action("ReportsPopup", "Home"), "blank");
        localStorage.setItem("result", '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>');
        rp.Type = 0;
        rp.FromDate = DateFormatRep(txtStartDate.value);
        rp.ToDate = DateFormatRep(txtEndDate.value);
        if (ddlSalesmanFilter.selectedIndex > 0)
            rp.SalesmanID = Number($("#ddlSalesmanFilter").val());
        else
            rp.SalesmanID = -1;
        if ($("#ddlCustomer").val() == "null")
            rp.CustomerID = -1;
        else
            rp.CustomerID = Number($("#ddlCustomer").val());
        rp.CashType = Number($("#ddlInvoiceType").val());
        rp.Status = Number($("#ddlStateType").val());
        rp.TrType = 0;
        rp.Typ = 1;
        rp.TRId = GlobalinvoiceID;
        rp.Name_function = "rptInvoiceNote";
        localStorage.setItem("Report_Data", JSON.stringify(rp));
        localStorage.setItem("result", '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>');
        window.open(Url.Action("ReportsPopup", "Home"), "blank");
    }
    function btnPrintslip_onclick() {
        if (!SysSession.CurrentPrivileges.PrintOut)
            return;
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
        rp.TRId = GlobalinvoiceID;
        Ajax.CallAsync({
            url: Url.Action("rptInvoiceNote", "GeneralReports"),
            data: rp,
            success: function (d) {
                var result = d.result;
                window.open(result, "_blank");
            }
        });
    }
    function DownloadInvoicePdf() {
        var rp = new ReportParameters();
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
        rp.DocPDFFolder = SysSession.CurrentEnvironment.I_Control[0].DocPDFFolder;
        if (BranchNameA == null || BranchNameE == null) {
            BranchNameA = " ";
            BranchNameE = " ";
        }
        rp.BraNameA = BranchNameA;
        rp.BraNameE = BranchNameE;
        rp.LoginUser = SysSession.CurrentEnvironment.UserCode;
        rp.Type = 0;
        rp.Typ = 2;
        rp.TRId = GlobalinvoiceID;
        rp.stat = InvoiceModel.InvoiceTransCode;
        Ajax.Callsync({
            url: Url.Action("rptInvoiceNote", "Reports_pdf"),
            data: rp,
            success: function (d) {
                var result = d;
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
        var SalesPerson = 0;
        var IsCash = 0;
        if (ddlCustomer.value.trim() != "") {
            customerId = Number(ddlCustomer.value.toString());
        }
        if (ddlSalesmanFilter.value != "null") {
            SalesMan = Number(ddlSalesmanFilter.value.toString());
        }
        if (ddlSalesPersonFilter.value != "null") {
            SalesPerson = Number(ddlSalesPersonFilter.value.toString());
        }
        if (ddlStateType.value != "null") {
            status = Number(ddlStateType.value.toString());
        }
        if (Number(ddlInvoiceType.value) == 0) {
            IsCash = 0;
        }
        else if (Number(ddlInvoiceType.value) == 1) {
            IsCash = 1;
        }
        else {
            IsCash = 2;
        }
        try {
            var Name_ID = 'InvoiceID';
            var NameTable = 'I_Sls_TR_Invoice';
            var Condation1 = " SlsInvSrc = 1 and  TrType = 0 and CompCode = " + compcode + " and BranchCode =" + BranchCode + " " +
                " and TrDate >=' " + startDate + "' and TrDate <= ' " + endDate + " ' ";
            var Condation2 = " ";
            if (customerId != 0 && customerId != null)
                Condation2 = Condation2 + " and CustomerId =" + customerId;
            if (SalesPerson != 0 && SalesPerson != null)
                Condation2 = Condation2 + " and SalesPersonId =" + SalesPerson; // and Status = " + Status   
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
            PrintsFrom_To(TransType.Invoice, Name_ID, NameTable, Condation3, SlsInvoiceStatisticsDetails.length);
        }
        catch (e) {
            return;
        }
    }
})(SlsTrSalesManager || (SlsTrSalesManager = {}));
//# sourceMappingURL=SlsTrSalesManager.js.map