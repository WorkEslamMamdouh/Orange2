$(document).ready(function () {
    SlsTrSales.InitalizeComponent();
});
var SlsTrSales;
(function (SlsTrSales) {
    //system varables
    var SysSession = GetSystemSession(Modules.SlsTrSales);
    //// 
    var compcode;
    var BranchCode;
    var sys = new SystemTools();
    var vatType;
    var startDate;
    var EndDate;
    var Finyear;
    // Arrays
    var VendorDetails = new Array();
    var custom1 = new Array();
    var SalesmanDetails = new Array(); //
    var CashDetailsAr = new Array();
    var CashDetailsEn = new Array();
    var CashboxDetails = new Array();
    var FamilyDetails = new Array();
    var CategoryDetails = new Array();
    var storeDetails = new Array();
    var ItemDetails = new Array();
    var ItemDetails_New = new Array();
    var DetailsVatNature = new Array();
    var AD_VatTypeDetails = new A_D_VAT_TYPE();
    //Models
    var MasterDetailModel = new SlsInvoiceMasterDetails();
    var InvoiceModel = new I_Sls_TR_Invoice();
    var invoiceItemsModel = new Array();
    var invoiceItemSingleModel = new I_Sls_TR_InvoiceItems();
    var Tax_Type_Model = new Tax_Type();
    // dropdownlists
    var ddlCustomer;
    var ddlSalesman;
    var ddlCashType;
    var ddlCashBox;
    var ddlStore;
    //buttons
    var btndiv_1;
    var btndiv_2;
    var btnAddDetails;
    var btnAdd;
    var btnPrntPrice;
    var btnPrint;
    var btnSave;
    var btnBack;
    //Textboxes
    var txtDate;
    var txtItemCount;
    var txtPackageCount;
    var txtTotal;
    var txtTax;
    var txtNet;
    var txtCommission;
    var txt_Tax_Discount;
    var txt_Tax_total_Discount;
    var txt_Tax_total_AfterDiscount;
    var txt_Tax_AfterTotalVAT;
    var txt_Tax_Vat;
    var txtCustomerName;
    var txtCustomerMobile;
    var txt_ApprovePass;
    //checkbox
    var chkActive;
    //labels 
    var lblMessage;
    //global
    var num_item = 0;
    var CountGrid = 0;
    var CountItems = 0;
    var PackageCount = 0;
    var CountTotal = 0;
    var TaxCount = 0;
    var NetCount = 0;
    var TypeFlag = false;
    var Default_VatPrc;
    var VatPrc;
    var invoiceID;
    var html;
    //----------------------------------------------------------------------------
    var Men_Sales_1;
    var Men_Sales_2;
    var btnChanege_1;
    var btnChanege_2;
    var btn_Add_Basket;
    var btn_Edit_Basket;
    var Basket;
    var btn_Approveprice;
    var btn_Exit_Approveprice;
    var P = 0;
    var ItemID;
    var PRODUCT_price;
    var PRODUCT_NAME = "Null";
    var ItemFamilyID;
    var IDPlus = 0;
    var CatPlus = 0;
    var scro = 0;
    var CChat;
    var Total_Basket;
    var ID_input = null;
    var btn_cancel_Popu;
    var btnminus_Quantity;
    var btnplus_Quantity;
    var btnminus_price;
    var btnplus_price;
    var btnminus_priceWithVat;
    var btnplus_priceWithVat;
    var All_item;
    var Sava_Basket;
    var btnOffer_PriceSearch;
    var Category_NAME;
    var CatID;
    var Num_Item;
    var x;
    var chat;
    var Qet_X = 0;
    var fouse;
    var txtPrice;
    var txtUnitpriceWithVat;
    var txtTotal_Price;
    var txtTotAfterTax_Popu;
    var txtTax_Rate_Popu;
    var txtQuantity;
    var Qet_Product = 0;
    var Name_Product;
    var Serial_Basket;
    var Tax_Rate_Basket;
    var OnhandQty;
    var MinUnitPrice;
    var UomID;
    var ValidationMinUnitPrice = 0;
    var Validation_Insert = 0;
    var price_Product = 0;
    var price_One_Product = 0;
    var Num_paragraph;
    var New_ItemFamilyID;
    var StoreId;
    var Num_Add_List = 0;
    var class_input;
    var Flag_Open_Menu = false;
    var List_IQ_GetSlsInvoiceItem = new Array();
    var List = new Array();
    var List_MinUnitPrice = new Array();
    var Model = new I_Sls_TR_InvoiceItems();
    var ItemDetails_New = new Array();
    var Selecteditem = new Array();
    var div_menu = document.getElementById('thing');
    var container = document.querySelector("#contentContainer");
    var num_item_IN_Menu = 0;
    var txtCommission_Basket;
    var btnPrintSlip;
    var btnPrintTransaction;
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);
    var flag_PriceWithVAT = (SysSession.CurrentEnvironment.I_Control[0].SalesPriceWithVAT);
    var Tax_Rate = 0;
    var Discount = 0;
    var flagIsSuccess_insert = false;
    function InitalizeComponent() {
        vatType = SysSession.CurrentEnvironment.I_Control[0].DefSlsVatType; //From Session
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);
        Finyear = Number(SysSession.CurrentEnvironment.CurrentYear);
        startDate = DateStartMonth();
        EndDate = SysSession.CurrentEnvironment.EndDate;
        InitalizeControls();
        fillddlSalesman();
        TypeFlag = true;
        FillddlCashType();
        $('#ddlCashType').prop("value", 1);
        FillddlCashBox();
        FillddlFamily();
        chkActive_CheckPrivilege();
        InitializeEvents();
        FillddlStore();
        FillddlVatNature();
        //GetVatPercentage();
        var date = GetDate().toString();
        $('#txtDate').prop("value", date);
        txtItemCount.value = CountItems.toString();
        txtPackageCount.value = PackageCount.toString();
        txtTotal.value = CountTotal.toString();
        txtTax.value = TaxCount.toString();
        txtNet.value = NetCount.toString();
        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            txtCustomerName.value = "عميل نقدي عام";
        }
        else {
            txtCustomerName.value = "General cash client";
        }
        Display_Category();
        Display_But();
        $("#General_Div").removeClass("disabledDiv");
        GetAllItem();
        btndiv_1_onclick();
        $("#txtDate_of_supply").val(GetDate());
        $("#txtSupply_end_Date").val(GetDate());
        GetVatPercentage();
        SysSession.CurrentEnvironment.I_Control[0].IvoiceDateEditable == true ? $('#txtDate').removeAttr("disabled") : $('#txtDate').attr("disabled", "disabled");
    }
    SlsTrSales.InitalizeComponent = InitalizeComponent;
    function InitalizeControls() {
        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = "فواتير المبيعات";
        }
        else {
            document.getElementById('Screen_name').innerHTML = "Sales Invoices";
        }
        // Drop down lists
        ddlCustomer = document.getElementById("ddlCustomer");
        ddlSalesman = document.getElementById("ddlSalesman");
        ddlCashType = document.getElementById("ddlCashType");
        ddlCashBox = document.getElementById("ddlCashBox"); //
        ddlStore = document.getElementById("ddlStore"); //
        //Buttons
        btndiv_1 = document.getElementById("btndiv_1");
        btndiv_2 = document.getElementById("btndiv_2");
        btnAddDetails = document.getElementById("btnAddDetails");
        btnSave = document.getElementById("btnSave");
        btnBack = document.getElementById("btnBack");
        btnAdd = document.getElementById("btnAdd");
        btnPrint = document.getElementById("btnPrint");
        btnPrntPrice = document.getElementById("btnPrntPrice");
        btn_Approveprice = document.getElementById("btn_Approveprice");
        btnPrintSlip = document.getElementById("btnPrintSlip");
        btnPrintTransaction = document.getElementById("btnPrintTransaction");
        //textboxes
        txtDate = document.getElementById("txtDate");
        txtItemCount = document.getElementById("txtItemCount");
        txtPackageCount = document.getElementById("txtPackageCount");
        txtTotal = document.getElementById("txtTotal");
        txtTax = document.getElementById("txtTax");
        txtNet = document.getElementById("txtNet");
        txtCommission = document.getElementById("txtCommission");
        txt_Tax_Discount = document.getElementById("txt_Tax_Discount");
        txt_Tax_total_Discount = document.getElementById("txt_Tax_total_Discount");
        txt_Tax_total_AfterDiscount = document.getElementById("txt_Tax_total_AfterDiscount");
        txt_Tax_Vat = document.getElementById("txt_Tax_Vat");
        txt_Tax_AfterTotalVAT = document.getElementById("txt_Tax_AfterTotalVAT");
        txtCustomerName = document.getElementById("txtCustomerName");
        txtCustomerMobile = document.getElementById("txtCustomerMobile");
        txt_ApprovePass = document.getElementById("txt_ApprovePass");
        //checkbox
        chkActive = document.getElementById("chkActive");
        //lables 
        lblMessage = document.getElementById("lblMessage");
        //---------------------------------------------------------------------------------------------------
        btnChanege_1 = document.getElementById("btnChanege_1");
        btnChanege_2 = document.getElementById("btnChanege_2");
        btn_Add_Basket = document.getElementById("btn_Add_Basket");
        btn_Edit_Basket = document.getElementById("btn_Edit_Basket");
        Basket = document.getElementById("Basket");
        btn_cancel_Popu = document.getElementById("btn_cancel_Popu");
        Sava_Basket = document.getElementById("Finsh_Order");
        btnOffer_PriceSearch = document.getElementById("btnOffer_PriceSearch");
        btn_Exit_Approveprice = document.getElementById("btn_Exit_Approveprice");
        Men_Sales_1 = document.getElementById("Men_Sales_1");
        Men_Sales_2 = document.getElementById("Men_Sales_2");
        btnminus_Quantity = document.getElementById("btnminus_Quantity");
        btnplus_Quantity = document.getElementById("btnplus_Quantity");
        btnminus_price = document.getElementById("btnminus_price");
        btnplus_price = document.getElementById("btnplus_price");
        btnminus_priceWithVat = document.getElementById("btnminus_priceWithVat");
        btnplus_priceWithVat = document.getElementById("btnplus_priceWithVat");
        All_item = document.getElementById("All_item");
        CChat = document.getElementById("CChat");
        Total_Basket = document.getElementById("Total_Basket");
        Num_Item = document.getElementById('Num_Item');
        x = document.getElementById("x");
        chat = document.getElementById("chat");
        fouse = document.getElementById("fouse");
        txtPrice = document.getElementById('txtPrice');
        txtUnitpriceWithVat = document.getElementById('txtUnitpriceWithVat');
        txtQuantity = document.getElementById('txtQuantity');
        txtTotal_Price = document.getElementById('txtTotal_Popu');
        txtTotAfterTax_Popu = document.getElementById('txtTotAfterTax_Popu');
        txtTax_Rate_Popu = document.getElementById('txtTax_Rate_Popu');
        txtCommission_Basket = document.getElementById('txtCommission_Basket');
    }
    function InitializeEvents() {
        btnSave.onclick = btnSave_onClick;
        btnAddDetails.onclick = AddNewRow;
        ddlCashType.onchange = ddlCashType_onchange;
        btnAdd.onclick = clear;
        chkActive.onclick = chkActive_CheckPrivilege;
        ddlCustomer.onchange = ddlCustomer_onchange;
        txt_Tax_Discount.onkeyup = txt_Tax_Discount_onchange;
        txt_Tax_total_Discount.onkeyup = txt_Tax_Discount_onchange;
        txt_Tax_total_AfterDiscount.onkeyup = Tax_Total_onchange;
        //txt_Tax_Vat.onkeyup = Tax_Net_Total;
        //txt_Tax_AfterTotalVAT.onkeyup = Tax_Net_Total;
        txtCommission.onkeyup = txtCommission_onchange;
        txtCommission_Basket.onkeyup = txtCommission_onchange_Basket;
        btnPrintSlip.onclick = btnPrintSlip_onclick;
        btnPrintTransaction.onclick = btnPrintTransaction_onclick;
        btnBack.onclick = btnback_onclick;
        btnChanege_1.onclick = btnChanege_onclick;
        btnChanege_2.onclick = btnChanege_onclick;
        btn_cancel_Popu.onclick = cancel_Popu_onclick;
        Sava_Basket.onclick = Sava_Basket_onclick;
        btnOffer_PriceSearch.onclick = btnOffer_PriceSearch_onclick;
        btn_Approveprice.onclick = btn_Approveprice_onclick;
        btn_Exit_Approveprice.onclick = btn_Exit_Approveprice_onclick;
        btndiv_1.onclick = btndiv_1_onclick;
        btndiv_2.onclick = btndiv_2_onclick;
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
                    Default_VatPrc = AD_VatTypeDetails.VatPerc;
                }
            }
        });
    }
    function Check_on_user_type() {
        if (SysSession.CurrentEnvironment.UserType == 1 || SysSession.CurrentEnvironment.UserType == 3) { //Salesman
            var SalesId_1 = SysSession.CurrentEnvironment.SalesManID;
            SalesmanDetails = SalesmanDetails.filter(function (s) { return s.SalesmanId == SalesId_1; });
        }
    }
    function txtCommission_onchange() {
        var comm = Number(txtCommission.value);
        var net = (Number(txtTotal.value) + Number(txtTax.value)).RoundToSt(2);
        if (Number(txtCommission.value) >= Number(net)) {
            DisplayMassage(" يجب ان تكون العموله اقل من الصافى", "The commission should be less than the Net", MessageType.Error);
            txtCommission.value = "0";
            Errorinput(txtCommission);
            Errorinput(txtNet);
            comm = 0;
            txtNet.value = net.toString();
        }
        else {
            txtNet.value = (Number(net) - Number(txtCommission.value)).RoundToSt(2).toString();
            comm = Number(txtCommission.value);
        }
    }
    function ddlCustomer_onchange() {
        if (ddlCustomer.value != "null") {
            var customerID = Number(ddlCustomer.value);
            custom1 = VendorDetails.filter(function (s) { return s.CustomerId == customerID; });
            txtCustomerName.value = custom1[0].NAMEA;
            txtCustomerMobile.value = custom1[0].MOBILE;
            vatType = custom1[0].VATType;
            if (SysSession.CurrentEnvironment.UserType != 1 && SysSession.CurrentEnvironment.UserType != 3) {
                ddlSalesman.value = custom1[0].SalesmanId.toString();
            }
        }
        if (Number(txtItemCount.value) > 0) {
            DisplayMassage("من فضلك اعادة ادخال  بيانات الفاتورة مره أخري", "Please re-enter the billing information again", MessageType.Worning);
        }
        else {
            AddNewRow();
        }
        CountItems = 0;
        PackageCount = 0;
        CountTotal = 0;
        TaxCount = 0;
        NetCount = 0;
        CountGrid = 0;
        Discount = 0;
        $('#div_Data').html("");
        ComputeTotals();
    }
    function btnback_onclick() {
        $('#div_Data').html("");
        $("#div_BasicData :input").prop("value", "");
        $("#divType :input").prop("value", "");
        txtDate.value = GetDate();
        $("#General_Div").attr("disabled", "disabled").off('click');
        $("#General_Div").addClass("disabledDiv");
        TypeFlag = true;
        CountGrid = 0;
        CountItems = 0;
        $('#ddlStore').prop("selectedIndex", 1);
        $('#ddlCashType').prop("value", 1);
        clear();
        //ddlCashType.disabled = false;
        //ddlCustomer.disabled = true;
        SysSession.CurrentEnvironment.I_Control[0].IvoiceDateEditable == true ? $('#txtDate').removeAttr("disabled") : $('#txtDate').attr("disabled", "disabled");
    }
    function chkActive_CheckPrivilege() {
        if (SysSession.CurrentPrivileges.CUSTOM1 == false) {
            $("#chkActive").prop("disabled", true);
        }
        else {
            $("#chkActive").prop("disabled", false);
        }
    }
    function ddlCashType_onchange() {
        if (ddlCashType.value == "1") { //نقدي 
            if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
                txtCustomerName.value = "عميل نقدي عام";
            }
            else {
                txtCustomerName.value = "General cash client";
            }
            txtCustomerMobile.value = "";
            $('#ddlCustomer option[value=null]').prop('selected', 'selected').change();
            $("#ddlCustomer").attr("disabled", "disabled");
            $("#txtCustomerName").removeAttr("disabled");
            SysSession.CurrentEnvironment.UserType == 2 || SysSession.CurrentEnvironment.UserType == 3 ? ($('#ddlCashBox').prop('selectedIndex', 1), $("#Div_Money").removeClass("display_none")) : $('#ddlCashBox').prop('selectedIndex', 0);
            $('#ddlCashBox').attr('disabled', 'disabled');
            vatType = SysSession.CurrentEnvironment.I_Control[0].DefSlsVatType; //From Session
            TypeFlag = true;
        }
        else { //علي الحساب
            $('#ddlCashBox').prop('selectedIndex', 0);
            $('#ddlCashBox').attr('disabled', 'disabled');
            txtCustomerName.value = "";
            TypeFlag = false;
            $("#txtCustomerName").attr("disabled", "disabled");
            fillddlCustomer();
            $("#Div_Money").addClass("display_none");
        }
        if (Number(txtItemCount.value) > 0) {
            DisplayMassage("من فضلك اعادة ادخال  بيانات الفاتورة مره أخري", "Please re-enter the billing information again", MessageType.Worning);
        }
        CountItems = 0;
        PackageCount = 0;
        CountTotal = 0;
        TaxCount = 0;
        NetCount = 0;
        CountGrid = 0;
        Discount = 0;
        $('#div_Data').html("");
        ComputeTotals();
    }
    function fillddlCustomer() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefCustomer", "GetAll"),
            data: {
                CompCode: compcode, BranchCode: BranchCode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    VendorDetails = result.Response;
                    VendorDetails = VendorDetails.filter(function (s) { return s.Isactive == true; });
                    if (TypeFlag == true) {
                        VendorDetails = VendorDetails.filter(function (s) { return s.STATUS == true; });
                    }
                    else {
                        VendorDetails = VendorDetails.filter(function (s) { return s.STATUS == false; });
                    }
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                        DocumentActions.FillCombowithdefult(VendorDetails, ddlCustomer, "CustomerId", "NAMEE", "Select Category");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(VendorDetails, ddlCustomer, "CustomerId", "NAMEA", "اختر العميل");
                    }
                }
            }
        });
        if (ddlCashType.value == "null") {
            $("#ddlCustomer").empty();
        }
        $("#ddlCustomer").removeAttr('disabled');
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
                    SalesmanDetails = SalesmanDetails.filter(function (s) { return s.Isactive == true; });
                    Check_on_user_type();
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                        DocumentActions.FillCombowithdefult(SalesmanDetails, ddlSalesman, "SalesmanId", "NameE", "Select saleman");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(SalesmanDetails, ddlSalesman, "SalesmanId", "NameA", "اختر المندوب");
                    }
                    SysSession.CurrentEnvironment.UserType == 1 || SysSession.CurrentEnvironment.UserType == 3 ? ($('#ddlSalesman option[value="null"]').remove()) : $('#ddlSalesman').prop('selectedIndex', 0);
                }
            }
        });
    }
    function FillddlCashType() {
        CashDetailsAr = ["علي الحساب", "نقدي"];
        CashDetailsEn = ["Cash", "Doubted"];
        if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
            for (var i = 0; i < CashDetailsEn.length; i++) {
                var newoption = document.createElement("option");
                newoption.value = i.toString();
                newoption.text = CashDetailsEn[i];
                ddlCashType.options.add(newoption);
            }
        }
        else {
            for (var i = 0; i < CashDetailsAr.length; i++) {
                var newoption = document.createElement("option");
                newoption.value = i.toString();
                newoption.text = CashDetailsAr[i];
                ddlCashType.options.add(newoption);
            }
        }
    }
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
    function FillddlFamily() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("StkDefItemType", "GetAllOrdered"),
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
    function FillddlItem(ItemFamilyID, StoreId) {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("StkDefItemType", "GetItemByFamilyIdOrdered"),
            data: {
                CompCode: compcode, BranchCode: BranchCode, FinYear: Finyear, familyid: ItemFamilyID, storeid: StoreId, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    ItemDetails_New = result.Response;
                }
            }
        });
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
    function btnSave_onClick() {
        loading('btnsave');
        setTimeout(function () {
            finishSave('btnsave');
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
                if (ddlCustomer.selectedIndex != 0 && TypeFlag == false) {
                    var net = Number(txtNet.value);
                    if (!Check_CreditLimit_Custom(net))
                        return;
                }
                Validation_Insert = 0;
                Assign();
                MasterDetailModel.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
                MasterDetailModel.UserCode = SysSession.CurrentEnvironment.UserCode;
                MasterDetailModel.CompName = SysSession.CurrentEnvironment.CompanyNameAr;
                MasterDetailModel.VatNo = SysSession.CurrentEnvironment.VatNo;
                if (Validation_Insert == 1) {
                    Open_poup_Pass();
                }
                else {
                    Insert();
                }
            }
        }, 100);
    }
    function Insert() {
        InvoiceModel.InvoiceID = 0;
        InvoiceModel.CompCode = Number(compcode);
        InvoiceModel.BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);
        InvoiceModel.CreatedBy = SysSession.CurrentEnvironment.UserCode;
        InvoiceModel.CreatedAt = DateTimeFormat(Date().toString());
        InvoiceModel.VatType = vatType;
        InvoiceModel.VatAmount = Number(txtTax.value);
        InvoiceModel.CommitionAmount = Number(txtCommission.value);
        InvoiceModel.TrType = 0; //0 invoice 1 return
        InvoiceModel.SlsInvSrc = 1; // 1 from store 2 from van 
        InvoiceModel.SlsInvType = 1; //  retail 
        InvoiceModel.TaxCurrencyID = Number(SysSession.CurrentEnvironment.I_Control[0].Currencyid);
        InvoiceModel.InvoiceCurrenyID = Number(SysSession.CurrentEnvironment.I_Control[0].Currencyid);
        InvoiceModel.InvoiceTypeCode = Number(SysSession.CurrentEnvironment.InvoiceTypeCode);
        InvoiceModel.InvoiceTransCode = Number(SysSession.CurrentEnvironment.InvoiceTransCode);
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
        if (!CheckDate(DateFormat(txtDate.value).toString(), DateFormat(SysSession.CurrentEnvironment.StartDate).toString(), DateFormat(SysSession.CurrentEnvironment.EndDate).toString())) {
            WorningMessage('   التاريخ ليس متطابق مع تاريخ السنه (' + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ')', 'The date is not identical with the date of the year (' + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ')', 'خطأ', 'Worning');
            return;
        }
        $('#btnSave').attr('disabled');
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("SlsTrSales", "InsertInvoiceMasterDetail"),
            data: JSON.stringify(MasterDetailModel),
            success: function (d) {
                var result = d;
                if (result.IsSuccess == true) {
                    var res = result.Response;
                    invoiceID = res.InvoiceID;
                    DisplayMassage(" تم اصدار  فاتورة رقم  " + res.TrNo + " ", "An invoice number has been issued ", MessageType.Succeed);
                    flagIsSuccess_insert = true;
                    $('#divCreationPanel').removeClass("display_none");
                    $('#txtCreatedBy').prop("value", SysSession.CurrentEnvironment.UserCode);
                    $('#txtCreatedAt').prop("value", DateTimeFormat(Date().toString()));
                    $("#btnSave").addClass("display_none");
                    $("#btnBack").addClass("display_none");
                    $("#btnAddDetails").addClass("display_none");
                    $("#btnAdd").removeClass("display_none");
                    $("#General_Div").attr("disabled", "disabled").off('click');
                    $("#General_Div").addClass("disabledDiv");
                    $('#condtionbtn1').removeClass("col-lg-10");
                    $('#condtionbtn1').addClass("col-lg-8");
                    $('#btnPrint').removeClass("display_none");
                    $('#btnPrntPrice').removeClass("display_none");
                    $('#div_btnPrint').removeClass("display_none");
                    clear();
                    //ddlCashType.disabled = false;
                    try {
                        Hide_Basket();
                        Remove_Item_in_Basket();
                        ValidationMinUnitPrice = 0;
                        Validation_Insert = 0;
                    }
                    catch (e) {
                    }
                    $('#btnSave').removeAttr('disabled');
                    //  DownloadInvoicePdf();
                }
                else {
                    DisplayMassage("الرجاء تحديث الصفحة واعادت تكرارالمحاولة مره اخري", "Please refresh the page and try again", MessageType.Error);
                    $('#btnSave').removeAttr('disabled');
                }
            }
        });
    }
    function Insert_Serial() {
        var Ser = 1;
        for (var i = 0; i < CountGrid; i++) {
            var flagvalue = $("#txt_StatusFlag" + i).val();
            if (flagvalue != "d" && flagvalue != "m") {
                $("#txtSerial" + i).val(Ser);
                if ($("#txt_StatusFlag" + i).val() != 'i' && $("#txt_StatusFlag" + i).val() != 'm' && $("#txt_StatusFlag" + i).val() != 'd') {
                    $("#txt_StatusFlag" + i).val('u');
                }
                Ser++;
            }
        }
    }
    function ComputeTotals() {
        PackageCount = 0;
        CountTotal = 0;
        TaxCount = 0;
        NetCount = 0;
        for (var i = 0; i < CountGrid; i++) {
            var flagvalue = $("#txt_StatusFlag" + i).val();
            if (flagvalue != "d" && flagvalue != "m" && flagvalue != null) {
                PackageCount += Number($("#txtQuantity" + i).val());
                PackageCount = Number(PackageCount);
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
    }
    function BuildControls(cnt) {
        html = '<div id= "No_Row' + cnt + '" class="container-fluid style_border" >  <div class="col-lg-12 col-md-12 col-xl-12 col-sm-12 col-xs-12" > ' +
            '<span id="btn_minus' + cnt + '" class="fa fa-minus-circle fontitm3SlsTrSales display_none"></span>' +
            '<div class="col-lg-1  col-md-1 col-sm-1 col-xs-12" style="width: 4%;">' +
            '<input id="txtSerial' + cnt + '" type="text" class="form-control input-sm right2" disabled /></div>' +
            '<div class="col-lg-2 col-md-2 col-sm-2 col-xs-12" style="width: 14%;">' +
            '<select id="ddlFamily' + cnt + '" class="form-control input-sm" disabled><option value="null" >' + (lang == "ar" ? "النوع" : "Type") + '</option></select></div>' +
            '<div class="col-lg-2  col-md-2 col-sm-2 col-xs-12" style="width: 15%;">' +
            '<select id="ddlItem' + cnt + '" class="form-control input-sm" disabled><option value="null">' + (lang == "ar" ? "الصنف" : "Item") + '</option></select></div>' +
            '<div class=" col-lg-2 col-md-2 col-sm-2 col-xs-12" style="width: 12%;"><div class="input-group "style="width: 86%;"><span class="input-group-btn"><button type="button" style="background-color: #4CAF50; "   class="btn btn-default btn-number1' + cnt + '"  id="btnminus1" data-type="minus" data-field="quant[1]"><span class="glyphicon glyphicon-minus"></span></button></span><input type="text"    style="height:36px;" id="txtQuantity' + cnt + '" name="quant[1]" class="form-control   font1" value="1" min="1" max="1000" step="1"><span class="input-group-btn"><button type="button" style="background-color: #f44336;" id="btnplus1' + cnt + '"  class="btn btn-default btn-number1' + cnt + '" data-type="plus" data-field="quant[1]"><span class="glyphicon glyphicon-plus"></span></button></span></div></div>' +
            '<div class=" col-lg-2 col-md-2 col-sm-2 col-xs-12" style="width: 16%;"><div class="input-group "style="width: 86%;"><span class="input-group-btn"><button type="button" style="background-color: #4CAF50; "   class="btn btn-default btn-number2' + cnt + '"  id="btnminus2" data-type="minus" data-field="quant[2]"><span class="glyphicon glyphicon-minus"></span></button></span><input type="text"   style="height:36px;" id="txtPrice' + cnt + '" name="quant[2]" class="form-control   font1" value="1" min="0" max="1000" step="0.5"><span class="input-group-btn"><button type="button" style="background-color: #f44336;" id="btnplus2' + cnt + '"   class="btn btn-default btn-number2' + cnt + '" data-type="plus" data-field="quant[2]"><span class="glyphicon glyphicon-plus"></span></button></span></div></div>' +
            '<div class=" col-lg-2 col-md-2 col-sm-2 col-xs-12" style="width: 13%;"><div class="input-group "style="width: 97%;"><span class="input-group-btn"><button type="button" style="background-color: #4CAF50; "   class="btn btn-default btn-number3' + cnt + '"  id="btnminus2" data-type="minus" data-field="quant[2]"><span class="glyphicon glyphicon-minus"></span></button></span><input type="text"   style="height:36px;" id="txtUnitpriceWithVat' + cnt + '" name="quant[2]" class="form-control   font1" value="1" min="0" max="1000" step="0.5"><span class="input-group-btn"><button type="button" style="background-color: #f44336;" id="btnplus3' + cnt + '"   class="btn btn-default btn-number3' + cnt + '" data-type="plus" data-field="quant[2]"><span class="glyphicon glyphicon-plus"></span></button></span></div></div>' +
            '<div class="col-lg-1  col-md-1 col-sm-1 col-xs-12"style="width: 9%;">' +
            '<input id="txtTotal' + cnt + '" type="text" class="form-control input-sm right2" disabled /></div>' +
            '<div class="col-lg-1  col-md-1 col-sm-1 col-xs-12" style="width: 3%;">' +
            '<input id="txtTax_Rate' + cnt + '" type="text" class="form-control input-sm right2" disabled /></div>' +
            '<div class="col-lg-1  col-md-1 col-sm-1 col-xs-12" style="width: 7%;">' +
            '<input id="txtTax' + cnt + '" type="text" class="form-control input-sm right2" disabled /></div>' +
            '<div class="col-lg-2  col-md-2 col-sm-2 col-xs-12 txtTotAfterTax">' +
            '<input id="txtTotAfterTax' + cnt + '" type="text" class="form-control input-sm right2" disabled /></div>' +
            '</div></div>' +
            '<input id="txt_StatusFlag' + cnt + '" name = " " type = "hidden" class="form-control"/><input id="txt_ID' + cnt + '" name = " " type = "hidden" class="form-control" />';
        $("#div_Data").append(html);
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
        $('.btn-number3' + cnt).click(function (e) {
            e.preventDefault();
            var fieldName = $(this).attr('data-field');
            var type = $(this).attr('data-type');
            var input = $("#txtUnitpriceWithVat" + cnt);
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
        for (var i = 0; i < FamilyDetails.length; i++) {
            $('#ddlFamily' + cnt).append('<option data-CatID= "' + FamilyDetails[i].CatID + '" value="' + FamilyDetails[i].ItemFamilyID + '">' + (lang == "ar" ? FamilyDetails[i].DescA : FamilyDetails[i].DescL) + '</option>');
        }
        var drop = '#ddlFamily' + cnt;
        $(drop).change(function () {
            ////// 
            var selectedFamily = $(drop + ' option:selected').attr('value');
            FillddlItem(Number(selectedFamily), $("#ddlStore").val());
            $('#ddlItem' + cnt).empty();
            $('#ddlItem' + cnt).append('<option value="' + null + '">' + (lang == "ar" ? "أختر الصنف" : "Choose item") + '</option>');
            for (var i = 0; i < ItemDetails_New.length; i++) {
                $('#ddlItem' + cnt).append('<option data-UnitPrice="' + ItemDetails_New[i].UnitPrice + '" data-MinUnitPrice="' + ItemDetails_New[i].MinUnitPrice + '" data-UomID="' + ItemDetails_New[i].UomID + '" data-OnhandQty="' + ItemDetails_New[i].OnhandQty + '" value="' + ItemDetails_New[i].ItemID + '">' + (lang == "ar" ? ItemDetails_New[i].Itm_DescA : ItemDetails_New[i].Itm_DescE) + '</option>');
            }
            var CatID = Number($('option:selected', $('#ddlFamily' + cnt)).attr('data-CatID'));
            var Cat_Tax = CategoryDetails.filter(function (s) { return s.CatID == CatID; });
            var VatNature = DetailsVatNature.filter(function (s) { return s.VatNatID == Cat_Tax[0].VatNatID; });
            Tax_Rate = VatNature[0].VatPrc;
            Tax_Type_Model = GetVat(Cat_Tax[0].VatNatID, Tax_Rate, vatType);
            Tax_Rate = Tax_Type_Model.Prc;
            VatPrc = Tax_Rate;
            $("#txtTax_Rate" + cnt).attr('Data-VatNatID', Tax_Type_Model.Nature);
            ComputeTotals();
        });
        var dropddlItem = '#ddlItem' + cnt;
        $(dropddlItem).change(function () {
            if ($('#ddlItem' + cnt).val() == "null") {
                $("#txtQuantity" + cnt).val("1");
                $("#txtPrice" + cnt).val("1");
                $("#txtUnitpriceWithVat" + cnt).val("1");
                $("#txtTotal" + cnt).val("0");
                $("#txtTax" + cnt).val("0");
                $("#txtTax_Rate" + cnt).val("0");
                $("#txtTotAfterTax" + cnt).val("0");
                $("#btnminus1" + cnt).attr("disabled", "disabled");
                $("#txtQuantity" + cnt).attr("disabled", "disabled");
                $("#btnplus1" + cnt).attr("disabled", "disabled");
                $("#btnminus2" + cnt).attr("disabled", "disabled");
                $("#txtPrice" + cnt).attr("disabled", "disabled");
                $("#txtUnitpriceWithVat" + cnt).attr("disabled", "disabled");
                $("#btnplus2" + cnt).attr("disabled", "disabled");
            }
            else {
                $("#btnminus1" + cnt).removeAttr("disabled");
                $("#txtQuantity" + cnt).removeAttr("disabled");
                $("#btnplus1" + cnt).removeAttr("disabled");
                $("#btnminus2" + cnt).removeAttr("disabled");
                $("#txtPrice" + cnt).removeAttr("disabled");
                $("#txtUnitpriceWithVat" + cnt).removeAttr("disabled");
                $("#btnplus2" + cnt).removeAttr("disabled");
                var selectedItem = $(dropddlItem + ' option:selected').attr('value');
                var selectedFamily = $(drop + ' option:selected').attr('value');
                var itemID = Number(selectedItem);
                var FamilyID = Number(selectedFamily);
                var NumberSelect = ItemDetails_New.filter(function (s) { return s.ItemID == itemID; });
                var res = false;
                res = checkRepeatedItems(itemID, FamilyID, cnt);
                if (res == true) {
                    Errorinput($("#ddlItem" + cnt));
                    $("#ddlItem" + cnt).val("null");
                    $("#txtPrice" + cnt).val("1");
                    $("#txtUnitpriceWithVat" + cnt).val("1");
                    DisplayMassage('( لايمكن تكرار نفس الاصناف علي الفاتورة )', 'The same items cannot be duplicated on the invoice', MessageType.Error);
                    $("#btnminus1" + cnt).attr("disabled", "disabled");
                    $("#txtQuantity" + cnt).attr("disabled", "disabled");
                    $("#btnplus1" + cnt).attr("disabled", "disabled");
                    $("#btnminus2" + cnt).attr("disabled", "disabled");
                    $("#txtPrice" + cnt).attr("disabled", "disabled");
                    $("#txtUnitpriceWithVat" + cnt).attr("disabled", "disabled");
                    $("#btnplus2" + cnt).attr("disabled", "disabled");
                }
                else {
                    var itemPrice = Number($('option:selected', $("#ddlItem" + cnt)).attr('data-UnitPrice'));
                    var GetUnitprice = Get_PriceWithVAT(itemPrice, VatPrc, flag_PriceWithVAT);
                    var itemPrice = GetUnitprice.unitprice;
                    $("#txtPrice" + cnt).val(itemPrice);
                    $("#txtUnitpriceWithVat" + cnt).val(GetUnitprice.unitpricewithvat);
                    var txtQuantityValue = $("#txtQuantity" + cnt).val();
                    var txtPriceValue = $("#txtPrice" + cnt).val();
                    $('#txtTax_Rate' + cnt).val(Tax_Rate);
                    var total = Number(txtQuantityValue) * Number(txtPriceValue);
                    $("#txtTotal" + cnt).val(total);
                    VatPrc = $("#txtTax_Rate" + cnt).val();
                    var vatAmount = Number(total) * VatPrc / 100;
                    $("#txtTax" + cnt).val(vatAmount.RoundToSt(2));
                    var totalAfterVat = Number(vatAmount) + Number(total);
                    $("#txtTotAfterTax" + cnt).val(totalAfterVat.RoundToSt(2));
                }
            }
            ComputeTotals();
        });
        $("#txtQuantity" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
            var txtQuantityValue = $("#txtQuantity" + cnt).val();
            var txtPriceValue = $("#txtPrice" + cnt).val();
            var total = 0;
            var Onhand_Qty = Number($('option:selected', $("#ddlItem" + cnt)).attr('data-OnhandQty'));
            if (txtQuantityValue < Onhand_Qty + 1) { }
            else {
                DisplayMassage("خطأ الكميه المتاحه (" + Onhand_Qty + ")", "Error quantity available", MessageType.Worning);
                $("#txtQuantity" + cnt).val(Onhand_Qty);
                txtQuantityValue = Onhand_Qty;
            }
            total = Number(txtQuantityValue) * Number(txtPriceValue);
            $("#txtTotal" + cnt).val(total); //= total;
            VatPrc = $("#txtTax_Rate" + cnt).val();
            var vatAmount = Number(total) * VatPrc / 100;
            $("#txtTax" + cnt).val(vatAmount.RoundToSt(2));
            var totalAfterVat = Number(vatAmount) + Number(total);
            $("#txtTotAfterTax" + cnt).val(totalAfterVat.RoundToSt(2));
            ComputeTotals();
        });
        $("#txtQuantity" + cnt).on('keyup', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
            var txtQuantityValue = $("#txtQuantity" + cnt).val();
            if (txtQuantityValue == 0) {
                $("#txtQuantity" + cnt).val('1');
            }
            txtQuantityValue = $("#txtQuantity" + cnt).val();
            var txtPriceValue = $("#txtPrice" + cnt).val();
            var total = 0;
            var Onhand_Qty = Number($('option:selected', $("#ddlItem" + cnt)).attr('data-OnhandQty'));
            if (txtQuantityValue < Onhand_Qty + 1) { }
            else {
                DisplayMassage("خطأ الكميه المتاحه (" + Onhand_Qty + ")", "Error quantity available", MessageType.Worning);
                $("#txtQuantity" + cnt).val(Onhand_Qty);
                txtQuantityValue = Onhand_Qty;
            }
            total = Number(txtQuantityValue) * Number(txtPriceValue);
            $("#txtTotal" + cnt).val(total); //= total;
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
            var SalesPrice = Number($("#txtPrice" + cnt).val());
            var GetUnitprice = Get_PriceWithVAT(SalesPrice, Number($("#txtTax_Rate" + cnt).val()), false);
            $("#txtUnitpriceWithVat" + cnt).val(GetUnitprice.unitpricewithvat);
            var txtQuantityValue = $("#txtQuantity" + cnt).val();
            var txtPriceValue = $("#txtPrice" + cnt).val();
            var total = Number($("#txtQuantity" + cnt).val()) * Number(txtPriceValue);
            VatPrc = $("#txtTax_Rate" + cnt).val();
            var vatAmount = Number(total) * VatPrc / 100;
            $("#txtTax" + cnt).val(vatAmount.RoundToSt(2));
            var total = Number(txtQuantityValue) * Number(txtPriceValue);
            $("#txtTotal" + cnt).val(total);
            var totalAfterVat = Number(vatAmount) + Number(total);
            $("#txtTotAfterTax" + cnt).val(totalAfterVat.RoundToSt(2));
            ComputeTotals();
        });
        $("#txtPrice" + cnt).on('keyup', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
            var SalesPrice = Number($("#txtPrice" + cnt).val());
            var GetUnitprice = Get_PriceWithVAT(SalesPrice, Number($("#txtTax_Rate" + cnt).val()), false);
            $("#txtUnitpriceWithVat" + cnt).val(GetUnitprice.unitpricewithvat);
            var txtQuantityValue = $("#txtQuantity" + cnt).val();
            var txtPriceValue = $("#txtPrice" + cnt).val();
            var total = Number($("#txtQuantity" + cnt).val()) * Number(txtPriceValue);
            VatPrc = $("#txtTax_Rate" + cnt).val();
            var vatAmount = Number(total) * VatPrc / 100;
            $("#txtTax" + cnt).val(vatAmount.RoundToSt(2));
            var total = Number(txtQuantityValue) * Number(txtPriceValue);
            $("#txtTotal" + cnt).val(total);
            var totalAfterVat = Number(vatAmount) + Number(total);
            $("#txtTotAfterTax" + cnt).val(totalAfterVat.RoundToSt(2));
            ComputeTotals();
        });
        $("#txtUnitpriceWithVat" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
            var SalesPrice = Number($("#txtUnitpriceWithVat" + cnt).val());
            var GetUnitprice = Get_PriceWithVAT(SalesPrice, Number($("#txtTax_Rate" + cnt).val()), true);
            //$("#txtUnitpriceWithVat" + cnt).val(GetUnitprice.unitpricewithvat)
            $("#txtPrice" + cnt).val(GetUnitprice.unitprice);
            var txtQuantityValue = $("#txtQuantity" + cnt).val();
            var txtPriceValue = $("#txtPrice" + cnt).val();
            var total = Number($("#txtQuantity" + cnt).val()) * Number(txtPriceValue);
            VatPrc = $("#txtTax_Rate" + cnt).val();
            var vatAmount = Number(total) * VatPrc / 100;
            $("#txtTax" + cnt).val(vatAmount.RoundToSt(2));
            var total = Number(txtQuantityValue) * Number(txtPriceValue);
            $("#txtTotal" + cnt).val(total);
            var totalAfterVat = Number(vatAmount) + Number(total);
            $("#txtTotAfterTax" + cnt).val(totalAfterVat.RoundToSt(2));
            ComputeTotals();
        });
        $("#txtUnitpriceWithVat" + cnt).on('keyup', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
            var SalesPrice = Number($("#txtUnitpriceWithVat" + cnt).val());
            var GetUnitprice = Get_PriceWithVAT(SalesPrice, Number($("#txtTax_Rate" + cnt).val()), true);
            //$("#txtUnitpriceWithVat" + cnt).val(GetUnitprice.unitpricewithvat)
            $("#txtPrice" + cnt).val(GetUnitprice.unitprice);
            var txtQuantityValue = $("#txtQuantity" + cnt).val();
            var txtPriceValue = $("#txtPrice" + cnt).val();
            var total = Number($("#txtQuantity" + cnt).val()) * Number(txtPriceValue);
            VatPrc = $("#txtTax_Rate" + cnt).val();
            var vatAmount = Number(total) * VatPrc / 100;
            $("#txtTax" + cnt).val(vatAmount.RoundToSt(2));
            var total = Number(txtQuantityValue) * Number(txtPriceValue);
            $("#txtTotal" + cnt).val(total);
            var totalAfterVat = Number(vatAmount) + Number(total);
            $("#txtTotAfterTax" + cnt).val(totalAfterVat.RoundToSt(2));
            ComputeTotals();
        });
        $("#btn_minus" + cnt).on('click', function () {
            DeleteRow(cnt);
        });
        if (SysSession.CurrentPrivileges.Remove) {
            $("#btn_minus" + cnt).addClass("display_none");
            $("#btn_minus" + cnt).attr("disabled", "disabled");
        }
        else {
            $("#btn_minus" + cnt).addClass("display_none");
            $("#btn_minus" + cnt).attr("disabled", "disabled");
        }
        return;
    }
    function checkRepeatedItems(itemValue, familyValue, cnt) {
        var items = Number(CountGrid);
        var flag = false;
        for (var i = 0; i < items; i++) {
            if (Number($("#ddlItem" + i).val()) == itemValue && Number($("#ddlFamily" + i).val()) == familyValue && i != cnt) {
                flag = true;
            }
        }
        return flag;
    }
    function AddNewRow() {
        if (ddlCashType.value == "0" && ddlCustomer.selectedIndex == 0 && SysSession.CurrentEnvironment.InvoiceTransCode == 1) { //علي الحساب  
            DisplayMassage(" برجاء اختيار العميل", "Please select a customer", MessageType.Worning);
            Errorinput(ddlCustomer);
            return false;
        }
        $("#btnEdit").addClass("display_none");
        $("#DivShow").removeClass("display_none");
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
            $(".btn btn-default btn-number1" + CountGrid).attr("disabled", "disabled");
            $("#txtQuantity" + CountGrid).attr("disabled", "disabled");
            $("#btnplus1" + CountGrid).attr("disabled", "disabled");
            $(".btn btn-default btn-number2" + CountGrid).attr("disabled", "disabled");
            $("#btnplus2" + CountGrid).attr("disabled", "disabled");
            // can delete new inserted record  without need for delete privilage
            $("#btn_minus" + CountGrid).removeClass("display_none");
            $("#btn_minus" + CountGrid).removeAttr("disabled");
            chkActive.checked = true;
            CountGrid++;
            //ddlCashType.disabled = false;
            //ddlCustomer.disabled = true;
            Insert_Serial();
            if (flag_PriceWithVAT == true) {
                $("#txtUnitpriceWithVat" + CountGrid).removeAttr("disabled");
                $("#txtPrice" + CountGrid).attr("disabled", "disabled");
            }
            else {
                $("#txtPrice" + CountGrid).removeAttr("disabled");
                $("#txtUnitpriceWithVat" + CountGrid).attr("disabled", "disabled");
            }
        }
    }
    function Validation_Grid(rowcount) {
        if ($("#txt_StatusFlag" + rowcount).val() == "d" || $("#txt_StatusFlag" + rowcount).val() == "m") {
            return true;
        }
        else {
            if ($("#ddlFamily" + rowcount).val() == "null") {
                DisplayMassage(" برجاء ادخال النوع", "Please enter the type", MessageType.Worning);
                Errorinput($("#ddlFamily" + rowcount));
                return false;
            }
            else if ($("#ddlItem" + rowcount).val() == "null") {
                DisplayMassage(" برجاء ادخال الصنف", "Please enter the item", MessageType.Worning);
                Errorinput($("#ddlItem" + rowcount));
                return false;
            }
            else if ($("#txtQuantity" + rowcount).val() == "") {
                DisplayMassage(" برجاء ادخال الكمية", "Please enter the quantity", MessageType.Worning);
                Errorinput($("#txtQuantity" + rowcount));
                return false;
            }
            else if ($("#txtPrice" + rowcount).val() == "") {
                DisplayMassage(" برجاء ادخال السعر", "Please enter the price", MessageType.Worning);
                Errorinput($("#txtPrice" + rowcount));
                Errorinput($("#txtUnitpriceWithVat" + rowcount));
                return false;
            }
            return true;
        }
    }
    function ValidationHeader() {
        if (ddlCustomer.selectedIndex == 0 && TypeFlag == false && SysSession.CurrentEnvironment.InvoiceTransCode == 1) {
            DisplayMassage(" برجاء اختيار العميل", "Please select a customer", MessageType.Worning);
            Errorinput(ddlCustomer);
            return false;
        }
        else if (ddlSalesman.value == "null") {
            DisplayMassage(" برجاء اختيار المندوب", "Please select a Salesman", MessageType.Worning);
            Errorinput(ddlSalesman);
            return false;
        }
        else if ((ddlCashBox.value == "null" && ddlCashType.value == "1") && (SysSession.CurrentEnvironment.UserType == 2 || SysSession.CurrentEnvironment.UserType == 3)) {
            DisplayMassage(" برجاء اختيار الصندوق", "Please select a CashBox", MessageType.Worning);
            Errorinput(ddlCashBox);
            return false;
        }
        else if (ddlStore.selectedIndex == 0) {
            DisplayMassage(" برجاء اختيار المخزن", "Please select a Store", MessageType.Worning);
            Errorinput(ddlStore);
            return false;
        }
        else if (!CheckDate(DateFormat(txtDate.value).toString(), DateFormat(SysSession.CurrentEnvironment.StartDate).toString(), DateFormat(SysSession.CurrentEnvironment.EndDate).toString())) {
            DisplayMassage(' التاريخ ليس متطابق مع  التاريخ المتاح  (' + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ')', 'The date does not match the available date (' + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ')', MessageType.Error);
            Errorinput(txtDate);
            return false;
        }
        else if (CountGrid == 0 || txtItemCount.value == '0') {
            DisplayMassage(" برجاء ادخال بيانات الفاتورة", "Please enter the invoice data", MessageType.Worning);
            Errorinput(btnAddDetails);
            return false;
        }
        else if ($('#txtCardMoney').val().trim() != '' || $('#txtCashMoney').val().trim() != '') {
            var card = Number($('#txtCardMoney').val());
            var Cash = Number($('#txtCashMoney').val());
            var Net = card + Cash;
            if (Net != Number($('#txtNet').val())) {
                DisplayMassage("يجب المبلغ المسدد يساوي الصاف ييجب ان يكون مجموع المبلغ المسدد بالكارت مع المسدد نقدا مساويا لصافي الفاتورة", "The amount paid should be equal to the net", MessageType.Worning);
                Errorinput($('#txtNet'));
                if ($('#txtCardMoney').val().trim() != '') {
                    Errorinput($('#txtCardMoney'));
                }
                if ($('#txtCashMoney').val().trim() != '') {
                    Errorinput($('#txtCashMoney'));
                }
                return false;
            }
        }
        return true;
    }
    function Assign() {
        var StatusFlag;
        invoiceItemsModel = new Array();
        List_MinUnitPrice = new Array();
        if (TypeFlag == false) {
            InvoiceModel.IsCash = false;
        }
        else {
            InvoiceModel.IsCash = true;
        }
        InvoiceModel.CustomerId = Number(ddlCustomer.value);
        InvoiceModel.SalesmanId = Number(ddlSalesman.value);
        InvoiceModel.StoreId = Number(ddlStore.value);
        InvoiceModel.TrDate = txtDate.value;
        InvoiceModel.NetAfterVat = NetCount;
        InvoiceModel.TotalAmount = Number(txtTotal.value);
        if (chkActive.checked == true) {
            InvoiceModel.Status = 1;
        }
        else {
            InvoiceModel.Status = 0;
        }
        InvoiceModel.CashBoxID = Number(ddlCashBox.value);
        InvoiceModel.CustomerName = txtCustomerName.value;
        InvoiceModel.CustomerMobileNo = txtCustomerMobile.value;
        InvoiceModel.CardAmount = $('#txtCardMoney').val().trim() == '' ? 0 : $('#txtCardMoney').val();
        InvoiceModel.CashAmount = $('#txtCashMoney').val().trim() == '' ? 0 : $('#txtCashMoney').val();
        //InvoiceModel.TrTime = GetTime();
        for (var i = 0; i < CountGrid; i++) {
            invoiceItemSingleModel = new I_Sls_TR_InvoiceItems();
            StatusFlag = $("#txt_StatusFlag" + i).val();
            invoiceItemSingleModel.InvoiceItemID = 0;
            invoiceItemSingleModel.Serial = $("#txtSerial" + i).val();
            invoiceItemSingleModel.Name_Item = $("#ddlItem" + i + " option:selected").text();
            invoiceItemSingleModel.ItemID = $("#ddlItem" + i).val();
            invoiceItemSingleModel.SoldQty = $('#txtQuantity' + i).val();
            invoiceItemSingleModel.StockSoldQty = $('#txtQuantity' + i).val();
            invoiceItemSingleModel.NetUnitPrice = $("#txtPrice" + i).val();
            invoiceItemSingleModel.Unitprice = $("#txtPrice" + i).val();
            invoiceItemSingleModel.UnitpriceWithVat = $("#txtUnitpriceWithVat" + i).val();
            invoiceItemSingleModel.MinUnitPrice = Number($('option:selected', $("#ddlItem" + i)).attr('data-MinUnitPrice'));
            VatPrc = $("#txtTax_Rate" + i).val();
            var VatNatID = Number($("#txtTax_Rate" + i).attr('data-VatNatID'));
            invoiceItemSingleModel.VatPrc = VatPrc;
            invoiceItemSingleModel.VatNatID = VatNatID;
            invoiceItemSingleModel.VatAmount = $("#txtTax" + i).val();
            invoiceItemSingleModel.ItemTotal = invoiceItemSingleModel.Unitprice * invoiceItemSingleModel.SoldQty;
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
            if (Number($("#txtPrice" + i).val()) < Number($('option:selected', $("#ddlItem" + i)).attr('data-MinUnitPrice'))) {
                List_MinUnitPrice.push(invoiceItemSingleModel);
                Validation_Insert = 1;
            }
            if (StatusFlag == "i") {
                invoiceItemSingleModel.StatusFlag = "i";
                invoiceItemsModel.push(invoiceItemSingleModel);
            }
            if (StatusFlag == "u") {
                invoiceItemSingleModel.StatusFlag = "i";
                invoiceItemsModel.push(invoiceItemSingleModel);
            }
            if (StatusFlag == "d") {
                if ($("#txt_ID" + i).val() != "") {
                    var deletedDetail = invoiceItemsModel.filter(function (x) { return x.InvoiceItemID == $("#txt_ID" + i).val(); });
                    invoiceItemSingleModel[0].StatusFlag = StatusFlag.toString();
                }
            }
        }
        MasterDetailModel.I_Sls_TR_Invoice = InvoiceModel;
        MasterDetailModel.I_Sls_TR_InvoiceItems = invoiceItemsModel;
    }
    function DeleteRow(RecNo) {
        if (!SysSession.CurrentPrivileges.Remove)
            return;
        WorningMessage("هل تريد الحذف؟", "Do you want to delete?", "تحذير", "worning", function () {
            $("#txt_StatusFlag" + RecNo).val() == 'i' ? $("#txt_StatusFlag" + RecNo).val('m') : $("#txt_StatusFlag" + RecNo).val('d');
            CountItems = CountItems - 1;
            txtItemCount.value = CountItems.toString();
            $("#ddlFamily" + RecNo).val("99");
            $("#ddlItem" + RecNo).val("99");
            $("#txtQuantity" + RecNo).val("1");
            $("#txtPrice" + RecNo).val("1");
            $("#No_Row" + RecNo).attr("hidden", "true");
            $("#txtCode" + RecNo).val("000");
            ComputeTotals();
            Insert_Serial();
            //if (txtItemCount.value == '0') {
            //    ddlCashType.disabled = false;
            //    if (ddlCashType.value == "0") {//علي الحساب
            //        ddlCustomer.disabled = false; 
            //    }
            //    else {
            //        ddlCustomer.selectedIndex = 0;
            //        ddlCustomer.disabled = true; 
            //    }
            //}
            //else {
            //    ddlCashType.disabled = true;
            //    ddlCustomer.disabled = true;
            //}
        });
    }
    function clear() {
        if (!SysSession.CurrentPrivileges.AddNew)
            return;
        AddNewRow();
        $('#div_Data').html("");
        $("#div_BasicData :input").prop("value", "");
        $("#divType :input").prop("value", "");
        txtDate.value = GetDate();
        ddlCustomer.selectedIndex = 1;
        ddlSalesman.selectedIndex = 1;
        $('#ddlStore').prop("selectedIndex", 1);
        $('#ddlCashType').prop("value", 1);
        $("#btnSave").removeClass("display_none");
        $("#btnBack").removeClass("display_none");
        $("#btnAdd").addClass("display_none");
        $('#btnPrint').addClass("display_none");
        $('#btnPrntPrice').addClass("display_none");
        $("#btnAddDetails").removeClass("display_none");
        TypeFlag = true;
        CountItems = 0;
        PackageCount = 0;
        CountTotal = 0;
        TaxCount = 0;
        NetCount = 0;
        CountGrid = 0;
        Discount = 0;
        $('#ddlCashType').prop("value", 1);
        $('#ddlStore').prop("selectedIndex", 1);
        $("#General_Div").removeClass("disabledDiv");
        $('#txtCommission').prop("value", 0);
        InvoiceModel.CustomerName = "";
        InvoiceModel.CashBoxID = 0;
        InvoiceModel.CustomerMobileNo = "";
        $('#divCreationPanel').addClass("display_none");
        $('#txtCreatedBy').prop("value", "");
        $('#txtCreatedAt').prop("value", "");
        $('#txt_Offer_Price').prop("value", "");
        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            txtCustomerName.value = "عميل نقدي عام";
        }
        else {
            txtCustomerName.value = "General cash client";
        }
        SysSession.CurrentEnvironment.UserType == 2 || SysSession.CurrentEnvironment.UserType == 3 ? $('#ddlCashBox').prop('selectedIndex', 1) : $('#ddlCashBox').prop('selectedIndex', 0);
        $('#ddlCashBox').attr('disabled', 'disabled');
        $('#ddlSalesman').prop("selectedIndex", 0);
        txtCustomerMobile.value = "";
        $('#ddlCustomer option[value=null]').prop('selected', 'selected').change();
        $("#ddlCustomer").attr("disabled", "disabled");
        $('#txtCardMoney').val('');
        $('#txtCashMoney').val('');
        $('#txtContract_NO').val("");
        $('#txtPurchase_order_No').val("");
        $('#txtTerms_of_Payment').val("");
        $("#txtDate_of_supply").val(GetDate());
        $("#txtSupply_end_Date").val(GetDate());
        $('#txt_Tax_Discount').val("0");
        $('#txt_Tax_total_Discount').val("0");
        $('#txt_Tax_total_AfterDiscount').val("0");
        $('#txt_Tax_Vat').val("0");
        $('#txt_Tax_AfterTotalVAT').val("0");
        $('#Tax_TotalInvoice').text("0");
        $('#Tax_InvoiceVAT').text("0");
        $('#Tax_AfterTotalInvoiceVAT').text("0");
        $('#Tax_Net_total_AfterDiscount').text("0");
        $('#Tax_Net_VAT').text("0");
        $('#Tax_Net_AfterTotalVAT').text("0");
    }
    function btnOffer_PriceSearch_onclick() {
        var sys = new SystemTools();
        sys.FindKey(Modules.SlsTrSales, "btnOffer_PriceSearch", "TrType = 2 and BranchCode = " + BranchCode + " and CompCode = " + compcode + "and SlsInvSrc = 1 and Status = 1", function () {
            var id = SearchGrid.SearchDataGrid.SelectedKey;
            Get_InvoiceItems(id);
        });
    }
    function Get_InvoiceItems(InvoiceID) {
        List_IQ_GetSlsInvoiceItem = new Array();
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("SlsTrSales", "GetSlsInvoiceItemsByinvoiceID"),
            data: {
                invoiceID: InvoiceID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    List_IQ_GetSlsInvoiceItem = result.Response;
                    btnback_onclick();
                    $('#txt_Offer_Price').val(InvoiceID);
                    $("#div_Data").html('');
                    Display_OfferPrice();
                }
            }
        });
    }
    function Display_OfferPrice() {
        StoreId = $("#ddlStore").val();
        for (var i = 0; i < List_IQ_GetSlsInvoiceItem.length; i++) {
            //
            var total = (List_IQ_GetSlsInvoiceItem[i].SoldQty * List_IQ_GetSlsInvoiceItem[i].Unitprice);
            CountGrid = i;
            BuildControls(CountGrid);
            $("#ddlFamily" + i).removeAttr('disabled');
            $("#ddlFamily" + i).prop("value", List_IQ_GetSlsInvoiceItem[i].ItemFamilyID);
            $("#ddlItem" + i).removeAttr('disabled');
            var selectedFamily = $("#ddlFamily" + i).val();
            var item = ItemDetails.filter(function (x) { return x.ItemFamilyID == Number(selectedFamily) && x.StoreId == StoreId; });
            $('#ddlItem' + i).empty();
            $('#ddlItem' + i).append('<option value="' + null + '">' + (lang == "ar" ? "أختر الصنف" : "Choose item") + '</option>');
            for (var u = 0; u < item.length; u++) {
                $('#ddlItem' + i).append('<option    data-UnitPrice="' + item[u].UnitPrice + '" data-MinUnitPrice="' + item[u].MinUnitPrice + '" data-UomID="' + item[u].UomID + '" data-OnhandQty="' + item[u].OnhandQty + '" value="' + item[u].ItemID + '">' + (lang == "ar" ? item[u].Itm_DescA : item[u].Itm_DescE) + '</option>');
            }
            $("#txtSerial" + i).prop("value", List_IQ_GetSlsInvoiceItem[i].Serial);
            $("#ddlItem" + i).prop("value", List_IQ_GetSlsInvoiceItem[i].ItemID);
            $("#txtQuantity" + i).val(List_IQ_GetSlsInvoiceItem[i].SoldQty);
            var itemPrice = Number($('option:selected', $("#ddlItem" + i)).attr('data-UnitPrice'));
            var GetUnitprice = Get_PriceWithVAT(itemPrice, Number(List_IQ_GetSlsInvoiceItem[i].VatPrc), false);
            $("#txtUnitpriceWithVat" + i).val(GetUnitprice.unitpricewithvat);
            $("#txtPrice" + i).val(GetUnitprice.unitprice);
            $("#txtTotal" + i).val(total);
            $("#txtTax_Rate" + i).val(List_IQ_GetSlsInvoiceItem[i].VatPrc);
            $("#txtTax" + i).val(List_IQ_GetSlsInvoiceItem[i].VatAmount);
            $("#txtTotAfterTax" + i).val(List_IQ_GetSlsInvoiceItem[i].NetAfterVat.RoundToSt(2));
            $("#txt_StatusFlag" + i).val("i");
            $("#btn_minus" + i).removeClass("display_none");
            $("#btn_minus" + i).removeAttr("disabled");
        }
        CountGrid += 1;
        ComputeTotals();
        txtItemCount.value = i.toString();
        CountItems = i;
        txtCommission.value = txtCommission_Basket.value;
    }
    function btndiv_1_onclick() {
        $("#btndiv_1").addClass("Actiev");
        $("#btndiv_1").removeClass("navbar navbar-inverse");
        $("#btndiv_2").removeClass("Actiev");
        $("#btndiv_2").addClass("navbar navbar-inverse");
        $("#div_1").removeClass("display_none");
        $("#div_2").addClass("display_none");
    }
    function btndiv_2_onclick() {
        if (Men_Sales_1.getAttribute('style') == 'display: none;') {
            if (num_item == 0 || P == 0) {
                WorningMessage('برجاء اختيار الاصناف اولاً', 'Please enter the invoice data', 'تنبيه', 'Error');
                Errorinput($('#Basket'));
                return false;
            }
        }
        else {
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
        }
        $("#btndiv_1").removeClass("Actiev");
        $("#btndiv_1").addClass("navbar navbar-inverse");
        $("#btndiv_2").addClass("Actiev");
        $("#btndiv_2").removeClass("navbar navbar-inverse");
        $("#div_1").addClass("display_none");
        $("#div_2").removeClass("display_none");
        try {
            $('#thing').attr("style", "display:none;");
            div_menu.setAttribute('style', 'display:none;');
            ID_input.setAttribute('style', 'zoom:2.4;font-size: 8px;font-weight: bold;');
        }
        catch (e) {
        }
        Compute_Invoice();
    }
    function Compute_Invoice() {
        if (Men_Sales_1.getAttribute('style') == 'display: none;') {
            var Tax_Total = 0;
            var Tax_VatAmount = 0;
            var Tax_NetAfterVat = 0;
            for (var i = 1; i < Num_Add_List + 1; i++) {
                var prgraph = document.getElementById("ppp" + i);
                if (prgraph != null) {
                    var Qty = Number(prgraph.getAttribute("data_qet_p"));
                    var Price_Item = Number(prgraph.getAttribute("data_price_p"));
                    var Total_Price_1 = Number(prgraph.getAttribute("data_total_price"));
                    var Tax_Rate_1 = Number(prgraph.getAttribute("data_Tax_Rate"));
                    var total = (Qty * Price_Item);
                    Tax_Total += Number(Qty) * Number(Price_Item);
                    Tax_VatAmount += Number(total) * Tax_Rate_1 / 100;
                    Tax_NetAfterVat += Total_Price_1;
                }
            }
            $("#Tax_TotalInvoice").text(Tax_Total.RoundToSt(2));
            $("#Tax_InvoiceVAT").text(Tax_VatAmount.RoundToSt(2));
            $("#Tax_AfterTotalInvoiceVAT").text(Tax_NetAfterVat.RoundToSt(2));
        }
        else {
            $("#Tax_TotalInvoice").text(txtTotal.value);
            $("#Tax_InvoiceVAT").text(txtTax.value);
            $("#Tax_AfterTotalInvoiceVAT").text(txtNet.value);
        }
        if (Discount == 0) {
            $("#txt_Tax_Discount").val(0);
        }
        else {
            $("#txt_Tax_Discount").val(Discount);
        }
        $("#txt_Tax_total_Discount").val($("#Tax_TotalInvoice").text());
        $("#txt_Tax_total_AfterDiscount").val(0);
        $("#txt_Tax_Vat").val(0);
        $("#txt_Tax_AfterTotalVAT").val(0);
        //let Net_total_After = Number($("#txt_Tax_total_AfterDiscount").val()) - Number($("#Tax_TotalInvoice").text())
        //$("#Tax_Net_total_AfterDiscount").text(Net_total_After);
        //let Tax_Net_VAT = Number($("#Tax_InvoiceVAT").val()) - Number($("#txt_Tax_Vat").text())
        //$("#Tax_Net_VAT").text(Tax_Net_VAT);
        //let Net_AfterTotalVAT = Number($("#Tax_AfterTotalInvoiceVAT").val()) - Number($("#txt_Tax_AfterTotalVAT").text())
        //$("#Tax_Net_AfterTotalVAT").text(Net_AfterTotalVAT);
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
        Tax_Vat = (Number($("#txt_Tax_total_AfterDiscount").val()) * Default_VatPrc) / 100;
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
        Tax_Vat = (Number($("#txt_Tax_total_AfterDiscount").val()) * Default_VatPrc) / 100;
        $("#txt_Tax_Vat").val(Number(Tax_Vat).RoundToSt(2));
        AfterTotalVAT = (Number($("#txt_Tax_total_AfterDiscount").val()) + Number($("#txt_Tax_Vat").val()));
        $("#txt_Tax_AfterTotalVAT").val(Number(AfterTotalVAT).RoundToSt(2));
        Tax_Net_Total();
    }
    //------------------------------------------------------------------------------------------------------------- 
    function btnChanege_onclick() {
        if (Men_Sales_1.getAttribute('style') == 'display: none;') {
            Men_Sales_1.setAttribute('class', 'col-lg-12 col-md-12 col-sm-12 col-xl-12 col-xs-12 backcolor animated zoomIn ');
            Men_Sales_1.setAttribute('style', '');
            Men_Sales_2.setAttribute('style', 'display: none;');
            $('#cont').toggleClass('colapsdivcont');
            $('#sidebar').toggleClass('active');
            if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
                $("body").toggleClass("mini-navbar_Arbec");
            }
            else {
                $("body").toggleClass("mini-navbar");
            }
            display_none();
            Chanege_Mode_TO_Page_1();
        }
        else {
            if (!ValidationHeader_On_Chanege())
                return;
            if (CountGrid > 0) {
                var CanAdd = true;
                for (var i = 0; i < CountGrid; i++) {
                    CanAdd = Validation_Grid(i);
                    if (CanAdd == false) {
                        break;
                    }
                }
                if (!CanAdd) {
                    return;
                }
            }
            if (CountGrid > 0) {
                Display_Page_2();
            }
            else {
                try {
                    Remove_Item_in_Basket();
                }
                catch (e) {
                }
            }
            Men_Sales_1.setAttribute('class', 'col-lg-12 col-md-12 col-sm-12 col-xl-12 col-xs-12 backcolor animated zoomOut');
            Men_Sales_1.setAttribute('style', 'display: none;');
            Men_Sales_2.setAttribute('style', '');
            $('#cont').toggleClass('colapsdivcont');
            $('#sidebar').toggleClass('active');
            if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
                $("body").toggleClass("mini-navbar_Arbec");
            }
            else {
                $("body").toggleClass("mini-navbar");
            }
            remove_display_none();
            btnminus_Quantity.onclick = btnminus_Quantity_onclick;
            btnplus_Quantity.onclick = btnminus_Quantity_onclick;
            btnminus_price.onclick = btnminus_price_onclick;
            btnplus_price.onclick = btnminus_price_onclick;
            btnminus_priceWithVat.onclick = btnminus_priceWithVat_onclick;
            btnplus_priceWithVat.onclick = btnminus_priceWithVat_onclick;
            All_item.onclick = GetAll_item_onclick;
            txtPrice.onkeyup = price_onChange;
            txtUnitpriceWithVat.onkeyup = priceWithVat_onChange;
            txtQuantity.onkeyup = Total;
            btn_Add_Basket.onclick = But_Add_Popu;
            btn_Edit_Basket.onclick = Edit_ROW_IN_Basket;
            $('.compose-discard-bt').click(Remove_Item_in_Basket);
            Basket.onclick = click_Basket;
        }
    }
    function display_none() {
        $('#thing').toggleClass("display_none");
        $('#Men_popu').toggleClass("display_none");
        $('#Basket').toggleClass("display_none");
        $('#CChat').toggleClass("display_none");
        $("#Total_Basket").toggleClass("display_none");
        $("#chat").toggleClass("display_none");
    }
    function remove_display_none() {
        $('#thing').removeClass("display_none");
        $('#Men_popu').removeClass("display_none");
        $('#CChat').removeClass("display_none");
        $("#Total_Basket").removeClass("display_none");
        $("#chat").removeClass("display_none");
        $('#Basket').removeClass("display_none");
    }
    function ValidationHeader_On_Chanege() {
        if (ddlCustomer.selectedIndex == 0 && TypeFlag == false && SysSession.CurrentEnvironment.InvoiceTransCode == 1) {
            DisplayMassage(" برجاء اختيار العميل", "Please select a customer", MessageType.Worning);
            Errorinput(ddlCustomer);
            return false;
        }
        else if (ddlSalesman.value == "null") {
            DisplayMassage(" برجاء اختيار المندوب", "Please select a Salesman", MessageType.Worning);
            Errorinput(ddlSalesman);
            return false;
        }
        else if ((ddlCashBox.value == "null" && ddlCashType.value == "1") && (SysSession.CurrentEnvironment.UserType == 2 || SysSession.CurrentEnvironment.UserType == 3)) {
            DisplayMassage(" برجاء اختيار الصندوق", "Please select a CashBox", MessageType.Worning);
            Errorinput(ddlCashBox);
            return false;
        }
        else if (ddlStore.value == "null") {
            DisplayMassage(" برجاء اختيار المخزن", "Please select a Store", MessageType.Worning);
            Errorinput(ddlStore);
            return false;
        }
        else if ($('#txtCardMoney').val().trim() != '' || $('#txtCashMoney').val().trim() != '') {
            var card = Number($('#txtCardMoney').val());
            var Cash = Number($('#txtCashMoney').val());
            var Net = card + Cash;
            if (Net != Number($('#txtNet').val())) {
                DisplayMassage("يجب المبلغ المسدد يساوي الصاف ييجب ان يكون مجموع المبلغ المسدد بالكارت مع المسدد نقدا مساويا لصافي الفاتورة", "The amount paid should be equal to the net", MessageType.Worning);
                Errorinput($('#txtNet'));
                if ($('#txtCardMoney').val().trim() != '') {
                    Errorinput($('#txtCardMoney'));
                }
                if ($('#txtCashMoney').val().trim() != '') {
                    Errorinput($('#txtCashMoney'));
                }
                return false;
            }
        }
        return true;
    }
    function Check_CreditLimit_Custom(net) {
        var Isbalance = Number((Number(custom1[0].Openbalance) + Number(custom1[0].Debit) - Number(custom1[0].Credit)).RoundToSt(2));
        var res = Number((net + Isbalance).RoundToSt(2));
        if (custom1[0].CreditLimit > 0) {
            if (res <= custom1[0].CreditLimit) {
                return true;
            }
            else {
                WorningMessage("خطأ لا يمكن ان تجاوز صافي الفاتوره (" + net + ") مع الرصيد (" + Isbalance + ") الحد الائتماني     (" + custom1[0].CreditLimit + ")", "An error could not override the net invoice(" + net + ") With the balance(" + Isbalance + ") The credit limit(" + custom1[0].CreditLimit + ")", "تحذير", "worning");
                return false;
            }
        }
        return true;
    }
    //--------------------------------------------------Display_Category--------------------------------
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
                    for (var i = 0; i < CategoryDetails.length; i++) {
                        Category_NAME = (lang == "ar" ? CategoryDetails[i].DescA : CategoryDetails[i].DescL);
                        CatID = CategoryDetails[i].CatID;
                        CatPlus = i;
                        Create_Category();
                    }
                }
            }
        });
    }
    function Create_Category() {
        var test_Category = document.getElementById("button_Category" + CatPlus);
        if (test_Category == null) {
            var button_Category = document.createElement('button');
            button_Category.setAttribute('id', 'id' + CatPlus);
            button_Category.setAttribute('type', 'button');
            button_Category.setAttribute('data-CatID', CatID);
            button_Category.setAttribute('class', 'btn btn-info Style_Category');
            button_Category.setAttribute('value', Category_NAME);
            document.getElementById("div_Category").appendChild(button_Category);
            document.getElementById('id' + CatPlus + '').innerHTML = Category_NAME;
            $('#id' + CatPlus + '').click(Selecte_Category);
        }
    }
    function GetAll_item_onclick() {
        document.getElementById("uul").innerHTML = '';
        blur_but();
        DisplayItems(FamilyDetails);
    }
    function Selecte_Category() {
        blur_but();
        CatID = $(this).attr('data-CatID');
        var Category = FamilyDetails.filter(function (x) { return x.CatID == Number(CatID); });
        document.getElementById("uul").innerHTML = '';
        DisplayItems(Category);
    }
    //--------------------------------------------------Display_But--------------------------------
    function GetAllItem() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("StkDefItemType", "GetAllItemOrdered"),
            data: {
                CompCode: compcode, BranchCode: BranchCode, FinYear: Finyear, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    ItemDetails = result.Response;
                }
            }
        });
    }
    function Display_But() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("StkDefItemType", "GetAllOrdered"),
            data: {
                CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    FamilyDetails = result.Response;
                    DisplayItems(FamilyDetails);
                }
            }
        });
    }
    function DisplayItems(ItemList) {
        for (var i = 0; i < ItemList.length; i++) {
            if (ItemList[i].CatID == 1) {
                class_input = "input_fruits";
            }
            else if (ItemList[i].CatID == 2) {
                class_input = "input_greens";
            }
            else {
                class_input = "input_blue";
            }
            PRODUCT_NAME = (lang == "ar" ? ItemList[i].DescA : ItemList[i].DescL);
            ItemFamilyID = ItemList[i].ItemFamilyID;
            CatID = ItemList[i].CatID;
            IDPlus = i;
            AddBut();
        }
    }
    function AddBut() {
        var test_input = document.getElementById("input" + IDPlus);
        if (test_input == null) {
            var ppp = document.createElement('li');
            ppp.setAttribute('id', 'li' + IDPlus);
            document.getElementById("uul").appendChild(ppp);
            var ul_ul = document.createElement('ul');
            ul_ul.setAttribute('id', 'ul_ul' + IDPlus);
            document.getElementById("li" + IDPlus + "").appendChild(ul_ul);
            var li_input = document.createElement('li');
            li_input.setAttribute('id', 'li_input' + IDPlus);
            document.getElementById("ul_ul" + IDPlus + "").appendChild(li_input);
            //var li_X = document.createElement('li');
            //li_X.setAttribute('id', 'li_div' + IDPlus);
            //document.getElementById("ul_ul" + IDPlus + "").appendChild(li_X);
            //var div_menu = document.createElement('div');
            //div_menu.setAttribute('id', 'div_menu' + IDPlus);
            //div_menu.setAttribute('style', 'display:none;');
            //div_menu.setAttribute('class', 'animated zoomin krkr');
            //document.getElementById("li_div" + IDPlus + "").appendChild(div_menu);
            //var ul_menu = document.createElement('ul');
            //ul_menu.setAttribute('id', 'ul_menu' + IDPlus);
            //document.getElementById("div_menu" + IDPlus + "").appendChild(ul_menu);
            var div = document.createElement('input');
            div.setAttribute('id', 'input' + IDPlus);
            div.setAttribute('id_QET', 'QET_' + IDPlus);
            div.setAttribute('type', 'button');
            div.setAttribute('value', PRODUCT_NAME);
            div.setAttribute('data-ItemFamilyID', ItemFamilyID);
            div.setAttribute('data-CatID', CatID);
            div.setAttribute('data-id_Menu', 'li_menu' + IDPlus);
            div.setAttribute('data-ul_menu', 'ul_menu' + IDPlus);
            div.setAttribute('data-div_menu', 'div_menu' + IDPlus);
            div.setAttribute('data-Name', PRODUCT_NAME);
            div.setAttribute('style', 'zoom:2.4;font-size: 8px;font-weight: bold;');
            div.setAttribute('class', 'Css_but chat-box-wrap shadow-reset ' + class_input + '');
            document.getElementById("li_input" + IDPlus + "").appendChild(div);
        }
        $('#input' + IDPlus).click(Open_Menu);
    }
    function blur_but() {
        if (ID_input != null) {
            if (ID_input.getAttribute('Data_Finish') == 'Finish') {
                ID_input.setAttribute('style', 'zoom:2.4;font-size: 8px;font-weight: bold; background: linear-gradient(to right, #888888 0%, #c2c2c2 100%);');
                ID_input.setAttribute('value', ID_input.getAttribute('data-name'));
            }
            else {
                ID_input.setAttribute('style', 'zoom:2.4;font-size: 8px;font-weight: bold;');
            }
        }
        div_menu.setAttribute('style', 'display:none;');
        $('#thing').removeClass("zoomIn");
    }
    //--------------------------------------------------Create_Menu--------------------------------
    container.addEventListener('click', function (event) {
        if (Flag_Open_Menu == false) {
            blur_but();
            $('#thing').attr("style", "display:none;");
            return;
        }
        var x = event.clientX;
        var y = event.clientY - 20;
        y += $(document).scrollTop();
        if (x < 1150 && y < 385) {
            if (num_item_IN_Menu == 8) {
                y -= 60;
                var ball = document.querySelector("#thing");
                ball.setAttribute('style', 'position: absolute ; left:' + (x + "px") + '; top:' + (y + "px") + '; height: 348px; ');
            }
            else if (num_item_IN_Menu == 6) {
                y = y - 100;
                var ball = document.querySelector("#thing");
                ball.setAttribute('style', 'position: absolute ; left:' + (x + "px") + '; top:' + (y + "px") + '; ');
            }
            else {
                y -= 60;
                var ball = document.querySelector("#thing");
                ball.setAttribute('style', 'position: absolute ; left:' + (x + "px") + '; top:' + (y + "px") + '; ');
            }
        }
        else if (x > 1150 && y < 385) {
            x = x - 200;
            if (num_item_IN_Menu == 6) {
                y = y - 50;
                var ball = document.querySelector("#thing");
                ball.setAttribute('style', 'position: absolute ; left:' + (x + "px") + '; top:' + (y + "px") + '; height: 348px; ');
            }
            else if (num_item_IN_Menu == 8) {
                y = y - 50;
                var ball = document.querySelector("#thing");
                ball.setAttribute('style', 'position: absolute ; left:' + (x + "px") + '; top:' + (y + "px") + '; height: 348px; ');
            }
            else {
                y -= 60;
                var ball = document.querySelector("#thing");
                ball.setAttribute('style', 'position: absolute ; left:' + (x + "px") + '; top:' + (y + "px") + '; ');
            }
        }
        else if (x < 1150 && y > 385) {
            if (num_item_IN_Menu == 1) {
                y = y - 70;
                var ball = document.querySelector("#thing");
                ball.setAttribute('style', 'position: absolute ; left:' + (x + "px") + '; top:' + (y + "px") + '; ');
            }
            else if (num_item_IN_Menu == 4) {
                y = y - 150;
                var ball = document.querySelector("#thing");
                ball.setAttribute('style', 'position: absolute ; left:' + (x + "px") + '; top:' + (y + "px") + '; ');
            }
            else if (num_item_IN_Menu == 6) {
                y = y - 350;
                var ball = document.querySelector("#thing");
                ball.setAttribute('style', 'position: absolute ; left:' + (x + "px") + '; top:' + (y + "px") + '; height: 348px; ');
            }
            else if (num_item_IN_Menu == 8) {
                y = y - 350;
                var ball = document.querySelector("#thing");
                ball.setAttribute('style', 'position: absolute ; left:' + (x + "px") + '; top:' + (y + "px") + '; height: 348px; ');
            }
            else {
                y = y - 100;
                var ball = document.querySelector("#thing");
                ball.setAttribute('style', 'position: absolute ; left:' + (x + "px") + '; top:' + (y + "px") + '; ');
            }
        }
        else if (x > 1150 && y > 385) {
            x = x - 200;
            if (num_item_IN_Menu == 1) {
                y = y - 40;
                var ball = document.querySelector("#thing");
                ball.setAttribute('style', 'position: absolute ; left:' + (x + "px") + '; top:' + (y + "px") + '; ');
            }
            else if (num_item_IN_Menu == 4) {
                y = y - 150;
                var ball = document.querySelector("#thing");
                ball.setAttribute('style', 'position: absolute ; left:' + (x + "px") + '; top:' + (y + "px") + '; ');
            }
            else if (num_item_IN_Menu == 6) {
                y = y - 350;
                var ball = document.querySelector("#thing");
                ball.setAttribute('style', 'position: absolute ; left:' + (x + "px") + '; top:' + (y + "px") + '; height: 348px; ');
            }
            else if (num_item_IN_Menu == 8) {
                y = y - 350;
                var ball = document.querySelector("#thing");
                ball.setAttribute('style', 'position: absolute ; left:' + (x + "px") + '; top:' + (y + "px") + '; height: 348px; ');
            }
            else {
                y = y - 100;
                var ball = document.querySelector("#thing");
                ball.setAttribute('style', 'position: absolute ; left:' + (x + "px") + '; top:' + (y + "px") + '; ');
            }
        }
        Flag_Open_Menu = false;
    });
    function Open_Menu() {
        Flag_Open_Menu = true;
        blur_but();
        StoreId = $("#ddlStore").val();
        New_ItemFamilyID = $(this).attr('data-ItemFamilyID');
        Select_Item(New_ItemFamilyID);
        if (Selecteditem.length == 0) {
            this.setAttribute('value', 'Finish');
            this.setAttribute('Data_Finish', 'Finish');
            this.setAttribute('disabled', 'disabled');
            div_menu.setAttribute('style', 'display:none;');
        }
        else {
            $('#thing').toggleClass("zoomIn");
            div_menu.setAttribute('style', 'display:block;');
        }
        if (Selecteditem.length == 1) {
            num_item_IN_Menu = 1;
        }
        else if (Selecteditem.length > 2 && Selecteditem.length < 5) {
            num_item_IN_Menu = 4;
        }
        else if (Selecteditem.length >= 6 && Selecteditem.length <= 8) {
            num_item_IN_Menu = 6;
        }
        else if (Selecteditem.length > 8) {
            num_item_IN_Menu = 8;
        }
        else {
            num_item_IN_Menu = 0;
        }
        var ul_Menu = document.getElementById('ul_Menu');
        ul_Menu.innerHTML = '';
        ID_input = document.getElementById($(this).attr('id'));
        ID_input.setAttribute('style', 'zoom:2.4;font-size: 8px;font-weight: bold;background: linear-gradient(to right, #000000 0%, #000000 100%);color: wheat;');
        for (var i = 0; i < Selecteditem.length; i++) {
            var li_menu = document.createElement('li');
            li_menu.setAttribute('id', 'li_menu' + $(this).attr('data-ul_menu') + i);
            li_menu.setAttribute('class', 'st_border_li_inDiv');
            li_menu.setAttribute('data-pirce', Selecteditem[i].UnitPrice.toString());
            li_menu.setAttribute('data-Name', (lang == "ar" ? Selecteditem[i].Itm_DescA.toString() : Selecteditem[i].Itm_DescE.toString()));
            li_menu.setAttribute('data-ItemID', Selecteditem[i].ItemID.toString());
            li_menu.setAttribute('data-Qty', Selecteditem[i].OnhandQty.toString());
            li_menu.setAttribute('data-MinUnitPrice', Selecteditem[i].MinUnitPrice.toString());
            li_menu.setAttribute('data-UomID', Selecteditem[i].UomID.toString());
            ul_Menu.appendChild(li_menu);
            var id_menu = document.getElementById('li_menu' + $(this).attr('data-ul_menu') + i);
            $('#' + 'li_menu' + $(this).attr('data-ul_menu') + i + '').click(click_Menu);
            id_menu.innerHTML = '' + Selecteditem[i].OnhandQty + '- ' + (lang == "ar" ? Selecteditem[i].Itm_DescA.toString() : Selecteditem[i].Itm_DescE.toString());
        }
        CatID = Number($(this).attr('data-catid'));
    }
    function Select_Item(FamilyID) {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("StkDefItemType", "GetItemByFamilyIdOrdered"),
            data: {
                CompCode: compcode, BranchCode: BranchCode, FinYear: Finyear, familyid: FamilyID, storeid: StoreId, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    ItemDetails_New = result.Response;
                    Selecteditem = ItemDetails_New;
                }
            }
        });
    }
    function click_Menu() {
        btn_Add_Basket.setAttribute('style', 'display:block;');
        btn_Edit_Basket.setAttribute('style', 'display:none;');
        Name_Product = $(this).attr('data-Name');
        OnhandQty = $(this).attr('data-Qty');
        for (var i = 0; i < Num_Add_List + 1; i++) {
            var prgraph = document.getElementById("ppp" + i);
            if (prgraph != null) {
                var Name_Item = prgraph.getAttribute("data_name_p");
                var Qty = Number(prgraph.getAttribute("data_qet_p"));
                if (Name_Item == Name_Product) {
                    OnhandQty = OnhandQty - Qty;
                }
            }
        }
        MinUnitPrice = $(this).attr('data-MinUnitPrice');
        UomID = $(this).attr('data-UomID');
        (lang == "ar" ? $('#id_Labol').html('متاح (' + OnhandQty + ') من  ' + Name_Product + '') : $('#id_Labol').html('Available (' + OnhandQty + ') From  ' + Name_Product + ''));
        $('#Men_popu').attr('style', 'display:block;');
        $('#Men_popu').attr('class', 'popu animated zoomInLeft');
        $('#txtQuantity').val('1');
        var Cat_Tax = CategoryDetails.filter(function (s) { return s.CatID == CatID; });
        var VatNature = DetailsVatNature.filter(function (s) { return s.VatNatID == Cat_Tax[0].VatNatID; });
        Tax_Rate = VatNature[0].VatPrc;
        Tax_Type_Model = GetVat(Cat_Tax[0].VatNatID, Tax_Rate, vatType);
        Tax_Rate = Tax_Type_Model.Prc;
        $("#txtTax_Rate_Popu").val(Tax_Rate);
        var itemPrice = Number($(this).attr('data-pirce'));
        var GetUnitprice = Get_PriceWithVAT(itemPrice, Tax_Rate, flag_PriceWithVAT);
        $('#txtPrice').val(GetUnitprice.unitprice);
        $('#txtUnitpriceWithVat').val(GetUnitprice.unitpricewithvat);
        ItemID = $(this).attr('data-itemid');
        PRODUCT_price = $(this).attr('data-pirce');
        $("#PopupDialog").modal("show");
        blur_but();
        Total();
        if (OnhandQty == 0) {
            $("#btn_Add_Basket").attr("disabled", "disabled").off('click');
        }
        else {
            $("#btn_Add_Basket").removeAttr("disabled");
        }
    }
    //--------------------------------------------------Open_Popu--------------------------------
    function btnminus_Quantity_onclick() {
        var type = $(this).attr('data-type');
        var input = $("#txtQuantity");
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
                if (currentVal < Number(OnhandQty)) {
                    if (currentVal < Number(input.attr('max'))) {
                        input.val((currentVal + 1)).change();
                    }
                    if (parseFloat(input.val()) == parseFloat(input.attr('max'))) {
                        $(this).val(input.attr('max'));
                    }
                }
                else {
                    WorningMessage('خطأ الكميه المتاحه (' + OnhandQty + ')', 'Error quantity available (' + OnhandQty + ')', 'خطأ', 'Worning');
                }
            }
        }
        else {
            input.val(1);
        }
        Total();
    }
    function btnminus_price_onclick() {
        var type = $(this).attr('data-type');
        var input = $("#txtPrice");
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
        Total();
        var SalesPrice = Number($("#txtPrice").val());
        var GetUnitprice = Get_PriceWithVAT(SalesPrice, Number($("#txtTax_Rate_Popu").val()), false);
        $("#txtUnitpriceWithVat").val(GetUnitprice.unitpricewithvat);
    }
    function btnminus_priceWithVat_onclick() {
        var type = $(this).attr('data-type');
        var input = $("#txtUnitpriceWithVat");
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
        var SalesPrice = Number($("#txtUnitpriceWithVat").val());
        var GetUnitprice = Get_PriceWithVAT(SalesPrice, Number($("#txtTax_Rate_Popu").val()), true);
        $("#txtPrice").val(GetUnitprice.unitprice);
        Total();
    }
    function price_onChange() {
        Total();
        var SalesPrice = Number($("#txtPrice").val());
        var GetUnitprice = Get_PriceWithVAT(SalesPrice, Number($("#txtTax_Rate_Popu").val()), false);
        $("#txtUnitpriceWithVat").val(GetUnitprice.unitpricewithvat);
    }
    function priceWithVat_onChange() {
        var SalesPrice = Number($("#txtUnitpriceWithVat").val());
        var GetUnitprice = Get_PriceWithVAT(SalesPrice, Number($("#txtTax_Rate_Popu").val()), true);
        $("#txtPrice").val(GetUnitprice.unitprice);
        Total();
    }
    function cancel_Popu_onclick() {
        $("#PopupDialog").modal("hide");
        $('#Men_popu').attr('class', 'popu animated zoomOutUp');
    }
    function Total() {
        if (Number($("#txtQuantity").val()) <= OnhandQty) {
            var total = Number($("#txtPrice").val()) * Number($("#txtQuantity").val());
            $("#txtTotal_Popu").val(total);
            VatPrc = $("#txtTax_Rate_Popu").val();
            //VatPrc = 15;
            var vatAmount = Number(total) * VatPrc / 100;
            $("#txtTax_Popu").val(vatAmount);
            var totalAfterVat = Number(vatAmount) + Number(total);
            $("#txtTotAfterTax_Popu").val(totalAfterVat.RoundToSt(2));
        }
        else {
            $("#txtQuantity").val(OnhandQty);
            WorningMessage('خطأ الكميه المتاحه (' + OnhandQty + ')', 'Error quantity available (' + OnhandQty + ')', 'خطأ', 'Worning');
            Total();
        }
    }
    function But_Add_Popu() {
        price_One_Product = parseFloat($("#txtPrice").val());
        price_Product = parseFloat(txtTotAfterTax_Popu.value);
        PRODUCT_price = parseFloat($("#txtPrice").val());
        Qet_Product = Number(txtQuantity.value);
        Add_ROW_IN_Basket();
        $("#PopupDialog").modal("hide");
        $('#Men_popu').attr('class', 'popu animated zoomOutRight');
    }
    //--------------------------------------------------Basket--------------------------------
    function Edit_ROW_IN_Basket() {
        //// 
        price_One_Product = parseFloat($("#txtPrice").val());
        price_Product = parseFloat(txtTotAfterTax_Popu.value);
        Qet_Product = Number(txtQuantity.value);
        Tax_Rate_Basket = Number(txtTax_Rate_Popu.value);
        var paragraph = document.getElementById('ppp' + Num_paragraph);
        var New_QET = Qet_Product;
        var New_price = price_Product;
        paragraph.setAttribute('data_QET_P', New_QET.toString());
        paragraph.setAttribute('data_total_price', New_price.toString());
        paragraph.innerHTML = '( ' + New_QET + ' )   ' + Name_Product + '  = ' + New_price + ' <a id="oioo' + Num_paragraph + '" data_Tax_Rate="' + Tax_Rate_Basket + '"  data-ID-Paragraph="' + Num_paragraph + '" href="#"  data-exit_id="exit' + Num_paragraph + '"  data-ip_div="comnt' + Num_paragraph + '" data-MinUnitPrice="' + MinUnitPrice + '" data-UomID="' + UomID + '" data-OnhandQty="' + OnhandQty + '" data-Name="' + Name_Product + '" data-price_One="' + price_One_Product + '"  data-Qet_Product="' + New_QET + '" class="chat-box-wrap shadow-reset animated zoomInLeft fa big-icon fa-edit"         style="font-size: 13px;padding: 4px;border-radius: 20px;color: #fdff61;margin: 0px 10px 0px 0px;"           ></a> ';
        $('#Ul_Div li a').click(click_Remove_Item_in_Basket);
        $('#Men_popu').attr('class', 'popu animated zoomOutRight');
        $("#PopupDialog").modal("hide");
        Total_Price();
    }
    function Add_ROW_IN_Basket() {
        price_One_Product = parseFloat($("#txtPrice").val());
        price_Product = parseFloat(txtTotAfterTax_Popu.value);
        Qet_Product = Number(txtQuantity.value);
        Tax_Rate_Basket = parseFloat(txtTax_Rate_Popu.value);
        var tttt = 1;
        if (P > -1) {
            for (var i = 1; i < P + 1; i++) {
                var paragraph = document.getElementById('ppp' + i);
                if (paragraph == null) { }
                else {
                    var Saerch = paragraph.getAttribute('data_Name_P');
                    if (Saerch == Name_Product) {
                        var New_P = paragraph.getAttribute('data-New_P');
                        var QET_P = paragraph.getAttribute('data_QET_P');
                        var New_QET = Number(paragraph.getAttribute('data_QET_P')) + Qet_Product;
                        var price_P = paragraph.getAttribute('data_total_price');
                        var New_price = Number(price_Product) + parseFloat(price_P);
                        Tax_Rate_Basket = Number(txtTax_Rate_Popu.value);
                        paragraph.setAttribute('data_QET_P', New_QET.toString());
                        paragraph.setAttribute('data_total_price', New_price.toString());
                        paragraph.innerHTML = '( ' + New_QET + ' )   ' + Name_Product + '  = ' + New_price + ' <a id="oioo' + New_P + '" href="#" data_Tax_Rate="' + Tax_Rate_Basket + '" data-ID-Paragraph="' + New_P + '"  data-exit_id="exit' + New_P + '"  data-ip_div="comnt' + New_P + '" data-MinUnitPrice="' + MinUnitPrice + '" data-UomID="' + UomID + '" data-OnhandQty="' + OnhandQty + '" data-Name="' + Name_Product + '" data-price_One="' + price_One_Product + '"  data-Qet_Product="' + New_QET + '" class="chat-box-wrap shadow-reset animated zoomInLeft fa big-icon fa-edit"         style="font-size: 13px;padding: 4px;border-radius: 20px;color: #fdff61;margin: 0px 10px 0px 0px;"           ></a> ';
                        $('#Ul_Div li a').click(click_Remove_Item_in_Basket);
                        tttt = 2;
                        break;
                    }
                }
            }
        }
        if (tttt == 1) {
            P += 1;
            scro += 80;
            var Qet = 1;
            if (CChat.getAttribute('style') != "display: block") {
                // 
                if ($('#Ul_Div').html() == null) {
                    var Ul_Div = document.createElement('ul');
                    Ul_Div.setAttribute('id', 'Ul_Div');
                    document.getElementById("mCSB_3_container").appendChild(Ul_Div);
                }
            }
            var Li_Ul_Div = document.createElement('ul');
            Li_Ul_Div.setAttribute('id', 'Li_Ul_Div' + P);
            Li_Ul_Div.setAttribute('style', 'margin: 14px 0px 0px 0px;');
            document.getElementById("Ul_Div").appendChild(Li_Ul_Div);
            var li1_Div = document.createElement('li');
            li1_Div.setAttribute('id', 'li1_Div' + P);
            document.getElementById("Li_Ul_Div" + P).appendChild(li1_Div);
            var li2_Div = document.createElement('li');
            li2_Div.setAttribute('id', 'li2_Div' + P);
            document.getElementById("Li_Ul_Div" + P).appendChild(li2_Div);
            var divv = document.createElement('div');
            divv.setAttribute('class', 'author-chat');
            divv.setAttribute('id', 'div' + P);
            document.getElementById("li2_Div" + P).appendChild(divv);
            var ppp = document.createElement('p');
            ppp.setAttribute('id', 'ppp' + P);
            ppp.setAttribute('class', 'chat-box-wrap shadow-reset ');
            ppp.setAttribute('style', 'width: 96%;');
            ppp.setAttribute('data_Name_P', Name_Product);
            ppp.setAttribute('data_price_P', PRODUCT_price.toString());
            ppp.setAttribute('data_ItemId', ItemID.toString());
            ppp.setAttribute('data_ItemFamilyID', New_ItemFamilyID.toString());
            ppp.setAttribute('data_QET_P', Qet_Product.toString());
            ppp.setAttribute('data_Total_QET', OnhandQty.toString());
            ppp.setAttribute('data_total_price', price_Product.toString());
            ppp.setAttribute('data_Tax_Rate', Tax_Rate_Basket.toString());
            ppp.setAttribute('data-New_P', P.toString());
            ppp.setAttribute('data-MinUnitPrice', MinUnitPrice);
            ppp.setAttribute('data-UomID', UomID);
            document.getElementById("div" + P).appendChild(ppp);
            var divvv = document.createElement('input');
            divvv.setAttribute('type', 'text');
            divvv.setAttribute('id', 'comnt' + P);
            divvv.setAttribute('class', 'author-chat alert alert-warning alert-st-three alert-st-bg2');
            divvv.setAttribute('style', 'display: none; margin: -43px 0px -25px 12px;float: left;height: 0px;width: 231px;font-size: 14px;padding: 14px;border-radius: 37px; position: relative;background-color: #a3a3a3;color: white;');
            document.getElementById("div" + P).appendChild(divvv);
            var exit_i = document.createElement('a');
            exit_i.setAttribute('id', 'exit' + P);
            exit_i.setAttribute('class', 'adminpro-icon adminpro-check-icon');
            exit_i.setAttribute('href', '#');
            exit_i.setAttribute('data-id_Nots', 'comnt' + P);
            exit_i.setAttribute('data-id_But_Nots', 'oioo' + P);
            exit_i.setAttribute('data-id_Pragraph', 'ppp' + P);
            exit_i.setAttribute('style', 'display:none;margin: -38px -39px 0px -192px;float: left;height: 0px;width: 231px;font-size: 21px;border-radius: 37px;position: relative;color: #2e617f; padding: 0px;');
            document.getElementById("div" + P).appendChild(exit_i);
            var li2_a = document.createElement('a');
            li2_a.setAttribute('id', 'a');
            li2_a.setAttribute('href', '#');
            li2_a.setAttribute('class', 'chat-box-wrap shadow-reset animated zoomInUp fa fa-remove class_ex_liest_chate');
            li2_a.setAttribute('data_Id_Ul', 'Li_Ul_Div' + P);
            li2_a.setAttribute('data_id_Pragraph', 'ppp' + P);
            li2_a.setAttribute('data-x_totel', $(this).attr('data-price'));
            li2_a.setAttribute('data-id_ppp', 'ppp' + P);
            document.getElementById("li1_Div" + P).appendChild(li2_a);
            document.getElementById('ppp' + P).innerHTML = '' + '( ' + Qet_Product + ' )   ' + Name_Product + '  = ' + price_Product + ' <a id="oioo' + P + '" data_Tax_Rate="' + Tax_Rate_Basket + '"  data-ID-Paragraph="' + P + '" href="#"  data-exit_id="exit' + P + '"  data-ip_div="comnt' + P + '"  data-MinUnitPrice="' + MinUnitPrice + '" data-UomID="' + UomID + '"  data-OnhandQty="' + OnhandQty + '"   data-Name="' + Name_Product + '" data-price_One="' + price_One_Product + '" data-Qet_Product="' + Qet_Product + '" class="chat-box-wrap shadow-reset animated zoomInLeft fa big-icon fa-edit"         style="font-size: 13px;padding: 4px;border-radius: 20px;color: #fdff61;margin: 0px 10px 0px 0px;"           ></a> ';
            var mCSB_3_container = document.getElementById("mCSB_3_container");
            mCSB_3_container.setAttribute('style', 'position: relative; top: -' + scro + 'px; left: 0px;');
            CChat.setAttribute('style', 'display: block');
            $('#Ul_Div li a').click(click_Remove_Item_in_Basket);
            Num_Item.setAttribute('data_New_QET', P);
            New_QET = P;
        }
        Qet_X = P;
        if (tttt == 1) {
            num_item += 1;
        }
        Total_Price();
        CChat.setAttribute('style', 'display: block;');
        Total_Basket.setAttribute('style', 'display: block;');
        var boll = chat.getAttribute('class');
        var hide = ("chat-box-wrap shadow-reset animated zoomInLeft collapse");
        if (hide == boll) {
            x.innerHTML = '<i id="remo" class="fa" style="margin-top: 0px;font-size: 21px;">' + num_item + '</i>';
        }
        else {
            x.innerHTML = '<i id="remo" class="fa" style="margin-top: 0px;font-size: 21px;">' + num_item + '</i>';
        }
        Num_Add_List += 1;
    }
    function click_Basket() {
        if (chat.getAttribute('style') == 'width: 28%; border-radius: 16px; height: 0px;' || chat.getAttribute('style') == 'width: 28%;border-radius: 16px;') {
            Show_Basket();
        }
        else {
            Hide_Basket();
        }
    }
    function Show_Basket() {
        var CChat = document.getElementById("CChat");
        CChat.setAttribute('aria-expanded', 'true');
        chat.setAttribute('class', 'chat-box-wrap shadow-reset animated zoomInLeft collapse in');
        chat.setAttribute('aria-expanded', 'true');
        chat.setAttribute('style', 'width: 28%; border-radius: 16px;');
    }
    function Hide_Basket() {
        chat.setAttribute('class', 'chat-box-wrap shadow-reset animated zoomInLeft collapse');
        chat.setAttribute('style', 'width: 28%; border-radius: 16px; height: 0px;');
        chat.setAttribute('aria-expanded', 'false');
    }
    function Remove_Item_in_Basket() {
        var liuu = document.getElementById("Ul_Div");
        document.getElementById("mCSB_3_container").removeChild(liuu);
        var Ul_Div = document.createElement('ul');
        Ul_Div.setAttribute('id', 'Ul_Div');
        document.getElementById("mCSB_3_container").appendChild(Ul_Div);
        num_item = 0;
        P = 0;
        Num_Item.setAttribute('data_New_QET', num_item);
        x.innerHTML = '<i id="remo" class="fa" style="margin-top: 0px;font-size: 21px;">' + num_item + '</i>';
        if (P == 0) {
            CChat.setAttribute('style', 'display: none;');
            Total_Basket.setAttribute('style', 'display: none;');
        }
        var totalPirs = document.getElementById('All_Total_Basket');
        totalPirs.innerHTML = '0';
        totalPirs.setAttribute('All_Total', '0');
        Num_Add_List = 0;
        CountGrid = 0;
        ValidationMinUnitPrice = 0;
        Validation_Insert = 0;
        txtCommission_Basket.value = "0";
    }
    function click_Remove_Item_in_Basket() {
        var coment = document.getElementById($(this).attr('id'));
        var Edit_Id = coment.getAttribute('class');
        if (Edit_Id == "chat-box-wrap shadow-reset animated zoomInLeft fa big-icon fa-edit") {
            Num_paragraph = $(this).attr('data-ID-Paragraph');
            click_Edit($(this).attr('data-name'), Number($(this).attr('data-price_one')), Number($(this).attr('data-qet_product')), Number($(this).attr('data_tax_rate')), Number($(this).attr('data-onhandqty')), Number($(this).attr('data-minunitprice')));
            //$(this).attr('data_tax_rate')
        }
        else {
            var id_Pragraph = document.getElementById($(this).attr('data_id_Pragraph'));
            if (id_Pragraph == null) {
            }
            else {
                num_item -= 1;
                CountGrid -= 1;
                Num_Item.setAttribute('data_New_QET', P);
                x.innerHTML = '<i id="remo" class="fa" style="margin-top: 0px;font-size: 21px;">' + num_item + '</i>';
                if (P == 0) {
                    CChat.setAttribute('style', 'display: none;');
                    Total_Basket.setAttribute('style', 'display: none;');
                }
                var id_ul = document.getElementById($(this).attr('data_Id_Ul'));
                document.getElementById("Ul_Div").removeChild(id_ul);
                Total_Price();
            }
        }
    }
    function Total_Price() {
        var New_Total = 0;
        for (var i = 1; i <= P + 1; i++) {
            var par = document.getElementById('ppp' + i);
            if (par != null) {
                var P_total = par.getAttribute('data_total_price');
                New_Total += parseFloat(P_total);
                Total_Basket.setAttribute('style', 'display: block;');
                document.getElementById('All_Total_Basket').innerHTML = "( " + Number(New_Total).RoundToSt(2).toString() + " )";
                document.getElementById('All_Total_Basket').setAttribute('All_Total', Number(New_Total).RoundToSt(2).toString());
                document.getElementById('All_Total_Basket').setAttribute('All_Total_Commission', Number(New_Total).RoundToSt(2).toString());
            }
        }
    }
    function txtCommission_onchange_Basket() {
        var comm = Number(txtCommission_Basket.value);
        var Net = Number($('#All_Total_Basket').attr('All_Total_Commission'));
        if (comm >= Net) {
            WorningMessage(' يجب ان تكون العموله أقل من الصافى', 'The commission should be less than net', 'خطأ', 'Worning');
            txtCommission_Basket.value = "0";
            Errorinput(txtCommission_Basket);
            Total_Price();
            return false;
        }
        if (txtCommission_Basket.value.trim() == '') {
            txtCommission_Basket.value = "0";
            Errorinput(txtCommission_Basket);
            Total_Price();
        }
        else {
            var txtNet_1 = (Number(Net) - Number(comm)).RoundToSt(2).toString();
            $('#All_Total_Basket').html('( ' + txtNet_1 + ' )');
            $('#All_Total_Basket').attr('All_Total', txtNet_1);
        }
    }
    //------------------------------------------------------Edit-----------------------------------
    function click_Edit(New_Name, New_Pirce, new_Qet, tax_rate, New_OnhandQty, New_MinUnitPrice) {
        ////  
        btn_Add_Basket.setAttribute('style', 'display:none;');
        btn_Edit_Basket.setAttribute('style', 'display:block;');
        Name_Product = New_Name;
        OnhandQty = New_OnhandQty;
        MinUnitPrice = New_MinUnitPrice;
        Tax_Rate_Basket = tax_rate;
        for (var i = 0; i < Num_Add_List + 1; i++) {
            var prgraph = document.getElementById("ppp" + i);
            if (prgraph != null) {
                var Name_Item = prgraph.getAttribute("data_name_p");
                var Qty = Number(prgraph.getAttribute("data_qet_p"));
                var Total_1 = Number(prgraph.getAttribute("data_Total_QET"));
                if (Name_Item == Name_Product) {
                    New_OnhandQty = Total_1 - Qty;
                }
            }
        }
        (lang == "ar" ? $('#id_Labol').html('متاح (' + New_OnhandQty + ') من  ' + New_Name + '') : $('#id_Labol').html('Available (' + New_OnhandQty + ') From  ' + New_Name + ''));
        $('#Men_popu').attr('style', 'display:block;');
        $('#Men_popu').attr('class', 'popu animated zoomInLeft');
        $('#txtQuantity').val(new_Qet);
        var GetUnitprice = Get_PriceWithVAT(New_Pirce, tax_rate, false);
        $('#txtPrice').val(GetUnitprice.unitprice);
        $('#txtUnitpriceWithVat').val(GetUnitprice.unitpricewithvat);
        txtTax_Rate_Popu.value = Tax_Rate_Basket;
        $("#PopupDialog").modal("show");
        Total();
    }
    //------------------------------------------------------Assign_Get_Data------------------------
    function Chanege_Mode_TO_Page_1() {
        Assign_Get_Data();
        $("#div_Data").html('');
        Display_Page_1();
    }
    function Display_Page_1() {
        StoreId = $("#ddlStore").val();
        for (var i = 0; i < List.length; i++) {
            //
            var total = (List[i].SoldQty * List[i].Unitprice);
            CountGrid = i;
            BuildControls(CountGrid);
            $("#ddlFamily" + i).removeAttr('disabled');
            $("#ddlFamily" + i).prop("value", List[i].ItemFamilyID);
            $("#ddlItem" + i).removeAttr('disabled');
            var selectedFamily = $("#ddlFamily" + i).val();
            var item = ItemDetails.filter(function (x) { return x.ItemFamilyID == Number(selectedFamily) && x.StoreId == Number(StoreId); });
            $('#ddlItem' + i).empty();
            $('#ddlItem' + i).append('<option value="' + null + '">' + (lang == "ar" ? "أختر الصنف" : "Choose item") + '</option>');
            for (var u = 0; u < item.length; u++) {
                $('#ddlItem' + i).append('<option data-UnitPrice="' + item[u].UnitPrice + '"  data-MinUnitPrice="' + item[u].MinUnitPrice + '" data-UomID="' + item[u].UomID + '" data-OnhandQty="' + item[u].OnhandQty + '" value="' + item[u].ItemID + '">' + (lang == "ar" ? item[u].Itm_DescA : item[u].Itm_DescE) + '</option>');
            }
            $("#txtSerial" + i).prop("value", List[i].Serial);
            $("#ddlItem" + i).prop("value", List[i].ItemID);
            $("#txtQuantity" + i).val(List[i].SoldQty);
            var itemPrice = Number(List[i].Unitprice);
            var GetUnitprice = Get_PriceWithVAT(itemPrice, Number(List[i].VatPrc), false);
            $("#txtUnitpriceWithVat" + i).val(GetUnitprice.unitpricewithvat);
            $("#txtPrice" + i).val(GetUnitprice.unitprice);
            $("#txtTotal" + i).val(total);
            $("#txtTax_Rate" + i).val(List[i].VatPrc);
            $("#txtTax" + i).val(List[i].VatAmount);
            $("#txtTotAfterTax" + i).val(List[i].NetAfterVat);
            $("#txt_StatusFlag" + i).val("i");
            $("#btn_minus" + i).removeClass("display_none");
            $("#btn_minus" + i).removeAttr("disabled");
        }
        CountGrid += 1;
        ComputeTotals();
        txtItemCount.value = i.toString();
        CountItems = i;
        txtCommission.value = txtCommission_Basket.value;
        //txtCommission_onchange();
        //Insert_Serial();
    }
    function Assign_Get_Data() {
        var VatAmount = 0;
        List = new Array();
        List_MinUnitPrice = new Array();
        var Ser = 1;
        for (var i = 1; i < Num_Add_List + 1; i++) {
            var prgraph = document.getElementById("ppp" + i);
            if (prgraph != null) {
                Model = new I_Sls_TR_InvoiceItems();
                var Serial = Ser;
                var Name_Item = prgraph.getAttribute("data_name_p");
                var Item_ID = Number(prgraph.getAttribute("data_itemid"));
                var ItemFamily_ID = Number(prgraph.getAttribute("data_itemfamilyid"));
                var Qty = Number(prgraph.getAttribute("data_qet_p"));
                var Price_Item = Number(prgraph.getAttribute("data_price_p"));
                var Total_Price_2 = Number(prgraph.getAttribute("data_total_price"));
                var Tax_Rate_2 = Number(prgraph.getAttribute("data_Tax_Rate"));
                var total = (Qty * Price_Item);
                VatPrc = Tax_Rate_2;
                var MinPrice = prgraph.getAttribute("data-minunitprice");
                var dat_UomID = prgraph.getAttribute("data-UomID");
                var get_Price_on_seller = document.getElementById("oioo" + prgraph.getAttribute("data-new_p"));
                var Price_on_seller = get_Price_on_seller.getAttribute("data-price_one");
                Model.InvoiceItemID = 0;
                Model.Serial = Number(Serial);
                Model.ItemID = Number(Item_ID);
                Model.SoldQty = Number(Qty);
                Model.StockSoldQty = Number(Qty);
                Model.NetUnitPrice = Number(Price_Item);
                var GetUnitprice = Get_PriceWithVAT(Number(Price_on_seller), Number(Tax_Rate_2), false);
                Model.Unitprice = Number(GetUnitprice.unitprice);
                Model.UnitpriceWithVat = Number(GetUnitprice.unitpricewithvat);
                Model.VatPrc = Tax_Rate_2; //$("#txtTax" + i).val();
                Model.VatAmount = Number(total) * VatPrc / 100;
                Model.ItemTotal = Number(Qty) * Number(Price_Item);
                Model.NetAfterVat = Total_Price_2;
                Model.ItemFamilyID = ItemFamily_ID;
                Model.MinUnitPrice = Number(MinPrice);
                Model.UomID = Number(dat_UomID);
                Model.Name_Item = Name_Item;
                Model.StatusFlag = "i";
                VatAmount += Number(total) * VatPrc / 100;
                List.push(Model);
                MasterDetailModel.I_Sls_TR_Invoice = InvoiceModel;
                MasterDetailModel.I_Sls_TR_InvoiceItems = List;
                if (ValidationMinUnitPrice == 1) {
                    if (Number(Price_on_seller) < Number(MinPrice)) {
                        List_MinUnitPrice.push(Model);
                        Validation_Insert = 1;
                    }
                }
                Ser++;
            }
        }
        InvoiceModel.VatAmount = VatAmount;
    }
    function Sava_Basket_onclick() {
        if (num_item != 0) {
            if (!SysSession.CurrentPrivileges.AddNew)
                return;
            if (!ValidationHeader_On_Chanege())
                return;
            if (ddlCustomer.selectedIndex != 0 && TypeFlag == false) {
                var net = Number($('#All_Total_Basket').attr('All_Total'));
                if (!Check_CreditLimit_Custom(net))
                    return;
            }
            ValidationMinUnitPrice = 1;
            Assign_Get_Data();
            MasterDetailModel.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
            MasterDetailModel.UserCode = SysSession.CurrentEnvironment.UserCode;
            MasterDetailModel.CompName = SysSession.CurrentEnvironment.CompanyNameAr;
            MasterDetailModel.VatNo = SysSession.CurrentEnvironment.VatNo;
            if (Validation_Insert != 1) {
                Insert_Basket();
            }
            else {
                Open_poup_Pass();
            }
        }
        else {
            WorningMessage(" برجاء اختيار الاصناف", "Please choose the items", '', '');
        }
    }
    function Insert_Basket() {
        if (!CheckDate(DateFormat(txtDate.value).toString(), DateFormat(SysSession.CurrentEnvironment.StartDate).toString(), DateFormat(SysSession.CurrentEnvironment.EndDate).toString())) {
            WorningMessage('   التاريخ ليس متطابق مع تاريخ السنه (' + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ')', 'The date is not identical with the date of the year (' + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ')', 'خطأ', 'Worning');
            return;
        }
        if (ddlCashType.value == "0") {
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
        $('#Finsh_Order').attr('disabled');
        InvoiceModel.CustomerId = Number(ddlCustomer.value);
        InvoiceModel.SalesmanId = Number(ddlSalesman.value);
        InvoiceModel.StoreId = Number(ddlStore.value);
        InvoiceModel.TrDate = txtDate.value;
        InvoiceModel.NetAfterVat = Number($('#All_Total_Basket').attr('All_Total'));
        InvoiceModel.TotalAmount = Number($('#All_Total_Basket').attr('All_Total'));
        InvoiceModel.CashBoxID = Number(ddlCashBox.value);
        InvoiceModel.CustomerName = txtCustomerName.value;
        InvoiceModel.CustomerMobileNo = txtCustomerMobile.value;
        InvoiceModel.InvoiceID = 0;
        InvoiceModel.CompCode = Number(compcode);
        InvoiceModel.BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);
        InvoiceModel.CreatedBy = SysSession.CurrentEnvironment.UserCode;
        InvoiceModel.CreatedAt = DateTimeFormat(Date().toString());
        InvoiceModel.VatType = vatType;
        InvoiceModel.CommitionAmount = Number(txtCommission_Basket.value);
        InvoiceModel.TrType = 0; //0 invoice 1 return
        InvoiceModel.SlsInvSrc = 1; // 1 from store 2 from van 
        InvoiceModel.SlsInvType = 1; //  retail 
        InvoiceModel.TaxCurrencyID = Number(SysSession.CurrentEnvironment.I_Control[0].Currencyid);
        InvoiceModel.InvoiceCurrenyID = Number(SysSession.CurrentEnvironment.I_Control[0].Currencyid);
        InvoiceModel.InvoiceTypeCode = Number(SysSession.CurrentEnvironment.InvoiceTypeCode);
        InvoiceModel.InvoiceTransCode = Number(SysSession.CurrentEnvironment.InvoiceTransCode);
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
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("SlsTrSales", "InsertInvoiceMasterDetail"),
            data: JSON.stringify(MasterDetailModel),
            success: function (d) {
                var result = d;
                if (result.IsSuccess == true) {
                    var res = result.Response;
                    invoiceID = res.InvoiceID;
                    DisplayMassage(" تم اصدار  فاتورة رقم  " + res.TrNo + " ", "An invoice number has been issued", MessageType.Succeed);
                    $('#divCreationPanel').removeClass("display_none");
                    $('#txtCreatedBy').prop("value", SysSession.CurrentEnvironment.UserCode);
                    $('#txtCreatedAt').prop("value", DateTimeFormat(Date().toString()));
                    Hide_Basket();
                    Remove_Item_in_Basket();
                    ValidationMinUnitPrice = 0;
                    Validation_Insert = 0;
                    btnChanege_onclick();
                    $('#condtionbtn1').removeClass("col-lg-10");
                    $('#condtionbtn1').addClass("col-lg-8");
                    $('#btnPrint').removeClass("display_none");
                    $('#btnPrntPrice').removeClass("display_none");
                    clear();
                    $('#Finsh_Order').removeAttr('disabled');
                }
                else {
                    WorningMessage('الرجاء تحديث الصفحة واعادت تكرارالمحاولة مره اخري', 'Please refresh the page and try again', 'خطأ', 'Worning');
                    $('#Finsh_Order').removeAttr('disabled');
                }
            }
        });
    }
    function Get_Data_From_Page1() {
        invoiceItemsModel = new Array();
        for (var i = 0; i < CountGrid; i++) {
            invoiceItemSingleModel = new I_Sls_TR_InvoiceItems();
            var New_Item = $("#ddlItem" + i);
            invoiceItemSingleModel.InvoiceItemID = 0;
            invoiceItemSingleModel.Serial = $("#txtSerial" + i).val();
            invoiceItemSingleModel.ItemID = $("#ddlItem" + i).val();
            invoiceItemSingleModel.ItemFamilyID = $("#ddlFamily" + i).val();
            invoiceItemSingleModel.SoldQty = $('#txtQuantity' + i).val();
            invoiceItemSingleModel.StockSoldQty = $('#txtQuantity' + i).val();
            invoiceItemSingleModel.NetUnitPrice = $("#txtPrice" + i).val();
            invoiceItemSingleModel.Unitprice = $("#txtPrice" + i).val();
            invoiceItemSingleModel.UnitpriceWithVat = $("#txtUnitpriceWithVat" + i).val();
            VatPrc = $("#txtTax_Rate" + i).val();
            invoiceItemSingleModel.VatPrc = VatPrc; //$("#txtTax" + i).val();
            invoiceItemSingleModel.VatAmount = $("#txtTax" + i).val();
            invoiceItemSingleModel.ItemTotal = invoiceItemSingleModel.Unitprice * invoiceItemSingleModel.SoldQty;
            invoiceItemSingleModel.NetAfterVat = $("#txtTotAfterTax" + i).val();
            invoiceItemSingleModel.Name_ItemFamily = $("#ddlFamily" + i + " option:selected").text();
            invoiceItemSingleModel.Name_Item = $("#ddlItem" + i + " option:selected").text();
            invoiceItemSingleModel.OnhandQty = Number($('option:selected', New_Item).attr('data-OnhandQty'));
            invoiceItemSingleModel.MinUnitPrice = Number($('option:selected', New_Item).attr('data-MinUnitPrice'));
            invoiceItemSingleModel.UomID = Number($('option:selected', New_Item).attr('data-UomID'));
            invoiceItemSingleModel.StatusFlag = "i";
            invoiceItemsModel.push(invoiceItemSingleModel);
        }
    }
    function BuildBasket() {
        P = 0;
        for (var i = 0; i < invoiceItemsModel.length; i++) {
            Serial_Basket = invoiceItemsModel[i].Serial;
            Name_Product = invoiceItemsModel[i].Name_Item;
            price_One_Product = invoiceItemsModel[i].Unitprice;
            price_Product = invoiceItemsModel[i].NetAfterVat;
            PRODUCT_price = invoiceItemsModel[i].Unitprice;
            Qet_Product = invoiceItemsModel[i].SoldQty;
            ItemID = invoiceItemsModel[i].ItemID;
            Tax_Rate_Basket = invoiceItemsModel[i].VatPrc;
            New_ItemFamilyID = invoiceItemsModel[i].ItemFamilyID;
            OnhandQty = invoiceItemsModel[i].OnhandQty;
            MinUnitPrice = invoiceItemsModel[i].MinUnitPrice;
            if (Name_Product != "") {
                P += 1;
                scro += 80;
                var Qet = 1;
                if (CChat.getAttribute('style') != "display: block") {
                    var Ul_Div = document.createElement('ul');
                    Ul_Div.setAttribute('id', 'Ul_Div');
                    document.getElementById("mCSB_3_container").appendChild(Ul_Div);
                }
                var Li_Ul_Div = document.createElement('ul');
                Li_Ul_Div.setAttribute('id', 'Li_Ul_Div' + P);
                Li_Ul_Div.setAttribute('style', 'margin: 14px 0px 0px 0px;');
                document.getElementById("Ul_Div").appendChild(Li_Ul_Div);
                var li1_Div = document.createElement('li');
                li1_Div.setAttribute('id', 'li1_Div' + P);
                document.getElementById("Li_Ul_Div" + P).appendChild(li1_Div);
                var li2_Div = document.createElement('li');
                li2_Div.setAttribute('id', 'li2_Div' + P);
                document.getElementById("Li_Ul_Div" + P).appendChild(li2_Div);
                var divv = document.createElement('div');
                divv.setAttribute('class', 'author-chat');
                divv.setAttribute('id', 'div' + P);
                document.getElementById("li2_Div" + P).appendChild(divv);
                var ppp = document.createElement('p');
                ppp.setAttribute('id', 'ppp' + P);
                ppp.setAttribute('class', 'chat-box-wrap shadow-reset ');
                ppp.setAttribute('style', 'width: 96%;');
                ppp.setAttribute('data_Serial_Basket', Serial_Basket);
                ppp.setAttribute('data_Name_P', Name_Product);
                ppp.setAttribute('data_price_P', PRODUCT_price.toString());
                ppp.setAttribute('data_ItemId', ItemID.toString());
                ppp.setAttribute('data_ItemFamilyID', New_ItemFamilyID.toString());
                ppp.setAttribute('data_QET_P', Qet_Product.toString());
                ppp.setAttribute('data_Total_QET', OnhandQty.toString());
                ppp.setAttribute('data_total_price', price_Product.toString());
                ppp.setAttribute('data_Tax_Rate', Tax_Rate_Basket.toString());
                ppp.setAttribute('data-New_P', P.toString());
                ppp.setAttribute('data-MinUnitPrice', MinUnitPrice);
                ppp.setAttribute('data-UomID', UomID);
                document.getElementById("div" + P).appendChild(ppp);
                var divvv = document.createElement('input');
                divvv.setAttribute('type', 'text');
                divvv.setAttribute('id', 'comnt' + P);
                divvv.setAttribute('class', 'author-chat alert alert-warning alert-st-three alert-st-bg2');
                divvv.setAttribute('style', 'display: none; margin: -43px 0px -25px 12px;float: left;height: 0px;width: 231px;font-size: 14px;padding: 14px;border-radius: 37px; position: relative;background-color: #a3a3a3;color: white;');
                document.getElementById("div" + P).appendChild(divvv);
                var exit_i = document.createElement('a');
                exit_i.setAttribute('id', 'exit' + P);
                exit_i.setAttribute('class', 'adminpro-icon adminpro-check-icon');
                exit_i.setAttribute('href', '#');
                exit_i.setAttribute('data-id_Nots', 'comnt' + P);
                exit_i.setAttribute('data-id_But_Nots', 'oioo' + P);
                exit_i.setAttribute('data-id_Pragraph', 'ppp' + P);
                exit_i.setAttribute('style', 'display:none;margin: -38px -39px 0px -192px;float: left;height: 0px;width: 231px;font-size: 21px;border-radius: 37px;position: relative;color: #2e617f; padding: 0px;');
                document.getElementById("div" + P).appendChild(exit_i);
                var li2_a = document.createElement('a');
                li2_a.setAttribute('id', 'a');
                li2_a.setAttribute('href', '#');
                li2_a.setAttribute('class', 'chat-box-wrap shadow-reset animated zoomInUp fa fa-remove class_ex_liest_chate');
                li2_a.setAttribute('data_Id_Ul', 'Li_Ul_Div' + P);
                li2_a.setAttribute('data_id_Pragraph', 'ppp' + P);
                li2_a.setAttribute('data-x_totel', $(this).attr('data-price'));
                li2_a.setAttribute('data-id_ppp', 'ppp' + P);
                document.getElementById("li1_Div" + P).appendChild(li2_a);
                document.getElementById('ppp' + P).innerHTML = '' + '( ' + Qet_Product + ' )   ' + Name_Product + '  = ' + price_Product + ' <a id="oioo' + P + '" data_Tax_Rate="' + Tax_Rate_Basket + '" data-ID-Paragraph="' + P + '" href="#"  data-exit_id="exit' + P + '"  data-ip_div="comnt' + P + '" data-MinUnitPrice="' + MinUnitPrice + '" data-UomID="' + UomID + '" data-OnhandQty="' + OnhandQty + '"  data-Name="' + Name_Product + '" data-price_One="' + price_One_Product + '" data-Qet_Product="' + Qet_Product + '" class="chat-box-wrap shadow-reset animated zoomInLeft fa big-icon fa-edit"         style="font-size: 13px;padding: 4px;border-radius: 20px;color: #fdff61;margin: 0px 10px 0px 0px;"           ></a> ';
                var mCSB_3_container = document.getElementById("mCSB_3_container");
                mCSB_3_container.setAttribute('style', 'position: relative; top: -' + scro + 'px; left: 0px;');
                CChat.setAttribute('style', 'display: block');
                $('#Ul_Div li a').click(click_Remove_Item_in_Basket);
                Num_Item.setAttribute('data_New_QET', P);
                Num_Add_List = P;
            }
        }
        Total_Price();
        Qet_X = P;
        num_item = Qet_X;
        var boll = chat.getAttribute('class');
        var hide = ("chat-box-wrap shadow-reset animated zoomInLeft collapse");
        if (hide == boll) {
            x.innerHTML = '<i id="remo" class="fa" style="margin-top: 0px;font-size: 21px;">' + Qet_X + '</i>';
        }
        else {
            x.innerHTML = '<i id="remo" class="fa" style="margin-top: 0px;font-size: 21px;">' + Qet_X + '</i>';
        }
        Num_Add_List += 1;
    }
    function Display_Page_2() {
        Get_Data_From_Page1();
        document.getElementById("mCSB_3_container").innerHTML = "";
        P = 0;
        Num_Item.setAttribute('data_New_QET', P);
        x.innerHTML = '<i id="remo" class="fa" style="margin-top: 0px;font-size: 21px;">' + P + '</i>';
        if (P == 0) {
            CChat.setAttribute('style', 'display: none;');
            Total_Basket.setAttribute('style', 'display: none;');
        }
        var totalPirs = document.getElementById('All_Total_Basket');
        totalPirs.innerHTML = '0';
        Num_Add_List = 0;
        BuildBasket();
        txtCommission_Basket.value = txtCommission.value;
        txtCommission_onchange_Basket();
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
        if (Men_Sales_2.getAttribute('style') == 'display: none;') {
            if (txt_ApprovePass.value == SysSession.CurrentEnvironment.I_Control[0].ExceedMinPricePassword) {
                Insert();
                $('#popu_Passowrd').attr('style', 'display:none;');
                $('#popu_Passowrd').attr('class', 'popu animated zoomOut');
                txt_ApprovePass.value = "";
                $("#Popup_Passowrd").modal("hide");
                $('#condtionbtn1').removeClass("col-lg-10");
                $('#condtionbtn1').addClass("col-lg-8");
                $('#btnPrint').removeClass("display_none");
                $('#btnPrntPrice').removeClass("display_none");
            }
            else {
                WorningMessage('لايمكن اعتماد الفاتورة', 'The invoice cannot be approved', 'خطأ', 'Worning');
                txt_ApprovePass.value = "";
            }
        }
        else {
            if (txt_ApprovePass.value == SysSession.CurrentEnvironment.I_Control[0].ExceedMinPricePassword) {
                Insert_Basket();
                Remove_Item_in_Basket();
                ValidationMinUnitPrice = 0;
                Validation_Insert = 0;
                txtCommission_Basket.value = "0";
                $('#popu_Passowrd').attr('style', 'display:none;');
                $('#popu_Passowrd').attr('class', 'popu animated zoomOut');
                txt_ApprovePass.value = "";
                $("#Popup_Passowrd").modal("hide");
                btnChanege_onclick();
                $('#condtionbtn1').removeClass("col-lg-10");
                $('#condtionbtn1').addClass("col-lg-8");
                $('#btnPrint').removeClass("display_none");
                $('#btnPrntPrice').removeClass("display_none");
                clear();
            }
            else {
                WorningMessage('لايمكن اعتماد الفاتورة', 'The invoice cannot be approved', 'خطأ', 'Worning');
                txt_ApprovePass.value = "";
            }
        }
    }
    function btn_Exit_Approveprice_onclick() {
        $('#popu_Passowrd').attr('style', 'display:none;');
        $('#popu_Passowrd').attr('class', 'popu animated zoomOut');
        txt_ApprovePass.value = "";
        $("#Popup_Passowrd").modal("hide");
        Validation_Insert = 0;
    }
    //------------------------------------------------------Print------------------------
    function btnPrintSlip_onclick() {
        debugger;
        flagIsSuccess_insert = false;
        btnSave_onClick();
        if (flagIsSuccess_insert == false)
            return;
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
        rp.TRId = invoiceID;
        alert;
        Ajax.CallAsync({
            url: Url.Action("rptInvoiceNote", "GeneralReports"),
            data: rp,
            success: function (d) {
                var result = d.result;
                window.open(result, "_blank");
            }
        });
    }
    function btnPrintTransaction_onclick() {
        debugger;
        flagIsSuccess_insert = false;
        btnSave_onClick();
        if (flagIsSuccess_insert == false)
            return;
        if (!SysSession.CurrentPrivileges.PrintOut)
            return;
        var rp = new ReportParameters();
        rp.Type = 0;
        rp.Typ = 2;
        rp.TRId = invoiceID;
        rp.stat = SysSession.CurrentEnvironment.InvoiceTransCode;
        rp.Name_function = "rptInvoiceNote";
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
        rp.TRId = invoiceID;
        rp.stat = SysSession.CurrentEnvironment.InvoiceTransCode;
        Ajax.Callsync({
            url: Url.Action("rptInvoiceNote", "Reports_pdf"),
            data: rp,
            success: function (d) {
            }
        });
    }
})(SlsTrSales || (SlsTrSales = {}));
//# sourceMappingURL=SlsTrSales.js.map