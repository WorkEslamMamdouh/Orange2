$(document).ready(function () {
    ////////;
    PurTrReceive.InitalizeComponent();
});
var PurTrReceive;
(function (PurTrReceive) {
    //system varables
    var SysSession = GetSystemSession(Modules.PurTrReceive);
    var compcode;
    var BranchCode; //SharedSession.CurrentEnvironment.BranchCode;
    var sys = new SystemTools();
    var GlobalCurrency;
    //Arrays
    var CashboxDetails = new Array();
    var SellerDetails = new Array();
    var StateDetailsAr = new Array();
    var StateDetailsEn = new Array();
    var filterVendorDetails = new Array();
    var Vendor_list = new Array();
    var VendorDetails = new Array();
    var SearchDetails = new Array();
    var G_USERSDetails = new Array();
    var GetPurReceiveStaisticData = new Array();
    var StoresDetails = new Array();
    var CodesDetails = new Array();
    var VatDetails = new Array();
    var PurReceiveChargeData = new Array();
    var FamilyDetails = new Array();
    var ItemBaesdFamilyDetails = new Array();
    var ItemFamilyDetails = new Array();
    var VatTypeData = new Array();
    var AddonsData = new Array();
    var VendorModel = new A_Pay_D_Vendor();
    var CurrencyDetails = new Array();
    //Models
    var RetrivedPurchaseModel = new Array();
    var ReceiveModel = new I_Pur_TR_Receive();
    var ItemDetails = new Array();
    var PurOrderDetailModel = new IQ_PurchaseOrderWithDetail();
    var ReceiveItemsDetailsModel = new Array();
    var chargesDetailsModel = new Array();
    var chargesingleModel = new I_Pur_Tr_ReceiveCharges();
    var ReceiveItemSingleModel = new I_Pur_TR_ReceiveItems();
    var MasterDetailModel = new PurReceiveMasterDetails();
    var AllPurReceiveMasterDetailModel = new IQ_GetPurReceiveMasterDisplay();
    //DropDownlist
    var ddlStateType;
    var ddlSalesmanMaster;
    var ddlVendorMaster;
    var ddlSeller;
    var ddlCurrency;
    // giedView
    var divMasterGrid = new JsGrid();
    //Textboxes
    var txtNotes;
    var txtFromDate;
    var txtToDate;
    var txtDateHeader;
    var ddlStoreHeader;
    var ddlSalesmanHeader;
    var lblInvoiceNumber;
    var txtPurOrderNum;
    var txtVendorName;
    var txtCurrencyRate;
    //buttons 
    var btnUpdate;
    var btnShow;
    var ddlIsCash;
    var ddlCashBoxH;
    var ddlReciveTypeHeader;
    var ddlTaxTypeHeader;
    var VendorRecieptID;
    var chkActive;
    var btnAddDetails;
    var btnAddDetailsCharge;
    var txtFamilyType;
    var txtTotal;
    var txtAddons;
    var txtItemsNumber;
    var searchbutmemreport;
    var txtTax;
    var txtAddonsTax;
    var txtTotalFamily;
    var txtTotalAddons;
    var btnSave;
    var btnBack;
    var btnAdd;
    var btnPurOrderSearch;
    //var btnPrintInvoicePrice: HTMLButtonElement;
    var btnVendorSearch;
    //flags && global
    var GlobalReceiveID = 0;
    var currencrRate = 1;
    var ModeType = 2; //1 view , 2 insert , 3 update 
    var ShowFlag = false; // Normal Add
    var PurOrderShowFlag = false; //  Add From Purchase Order
    var CountGrid = 0;
    var CountGridCharge = 0;
    var CountItems = 0;
    var CountItemsCharge = 0;
    var globalPurOrderID = 0;
    var globalVendorID = 0;
    var DefVatType = SysSession.CurrentEnvironment.I_Control[0].DefPurVatType;
    var VatPrc;
    var vatpriceVendor;
    var Finyear;
    // Print Buttons
    var btnPrintTrview;
    var btnPrintTrPDF;
    var btnPrintTrEXEL;
    var btnPrint;
    var btnPrintTransaction;
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);
    //---------------------------------------------------------------- main region----------------------------------------------------
    function InitalizeComponent() {
        Finyear = Number(SysSession.CurrentEnvironment.CurrentYear);
        InitalizeControls();
        GlobalCurrency = SysSession.CurrentEnvironment.I_Control[0].Currencyid;
        // VatPrc = SysSession.CurrentEnvironment.I_Control[0].DefPurVatType;
        $("#txtDateHeader").val(GetDate());
        IntializeEvents();
        FillddlCashBox();
        FillddlStateType();
        FillddlSalesmanHeader();
        FillddlVendorHeader();
        FillddlStoreHeader();
        FillddlSeller();
        FillddlReciveType();
        FillddlTaxType();
        FillddlCashType();
        FillddlFamily();
        GetAllIItem();
        FillddlVendor();
        FillddlCurrency();
        $('#ddlStateType').prop("value", "2");
        $('#ddlStoreHeader').prop("selectedIndex", 1);
        ShowFlag = true;
        GetVatType();
        GetAddonsData();
        txtFromDate.value = DateStartMonth();
        txtToDate.value = ConvertToDateDash(GetDate()) <= ConvertToDateDash(SysSession.CurrentEnvironment.EndDate) ? GetDate() : SysSession.CurrentEnvironment.EndDate;
        $('#btnPrint').addClass('display_none');
    }
    PurTrReceive.InitalizeComponent = InitalizeComponent;
    function InitalizeControls() {
        // print ----*
        btnPrintTrview = document.getElementById("btnPrintTrview");
        btnPrintTrPDF = document.getElementById("btnPrintTrPDF");
        btnPrintTrEXEL = document.getElementById("btnPrintTrEXEL");
        btnPrint = document.getElementById("btnPrint");
        btnPrintTransaction = document.getElementById("btnPrintTransaction");
        //btnPrintInvoicePrice = document.getElementById("btnPrintInvoicePrice") as HTMLButtonElement;
        //----------------------------------------------------------------------------------------//
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);
        //Drop Downlists
        ddlStateType = document.getElementById("ddlStateType");
        ddlSalesmanMaster = document.getElementById("ddlSalesmanMaster");
        ddlVendorMaster = document.getElementById("ddlVendorMaster");
        ddlStoreHeader = document.getElementById("ddlStoreHeader");
        ddlSalesmanHeader = document.getElementById("ddlSalesmanHeader");
        ddlSeller = document.getElementById("ddlSeller");
        ddlIsCash = document.getElementById("ddlIsCash");
        ddlCashBoxH = document.getElementById("ddlCashBoxH");
        ddlReciveTypeHeader = document.getElementById("ddlReciveTypeHeader");
        ddlTaxTypeHeader = document.getElementById("ddlTaxTypeHeader");
        ddlCurrency = document.getElementById("ddlCurrency");
        //textboxes
        txtFromDate = document.getElementById("txtFromDate");
        txtToDate = document.getElementById("txtToDate");
        txtNotes = document.getElementById("txtNotes");
        searchbutmemreport = document.getElementById("searchbutmemreport");
        txtDateHeader = document.getElementById("txtDateHeader");
        lblInvoiceNumber = document.getElementById("lblInvoiceNumber");
        txtFamilyType = document.getElementById("txtFamilyType");
        txtTotal = document.getElementById("txtTotal");
        txtAddons = document.getElementById("txtAddons");
        txtItemsNumber = document.getElementById("txtItemsNumber");
        txtTax = document.getElementById("txtTax");
        txtAddonsTax = document.getElementById("txtAddonsTax");
        txtTotalFamily = document.getElementById("txtTotalFamily");
        txtTotalAddons = document.getElementById("txtTotalAddons");
        txtPurOrderNum = document.getElementById("txtPurOrderNum");
        txtVendorName = document.getElementById("txtVendorName");
        txtCurrencyRate = document.getElementById("txtCurrencyRate");
        //buttons
        btnShow = document.getElementById("btnShow");
        VendorRecieptID = document.getElementById("VendorRecieptID");
        chkActive = document.getElementById("chkActive");
        btnAddDetails = document.getElementById("btnAddDetails");
        btnAddDetailsCharge = document.getElementById("btnAddDetailsCharge");
        btnUpdate = document.getElementById("btnUpdate");
        btnBack = document.getElementById("btnBack");
        btnSave = document.getElementById("btnSave");
        btnAdd = document.getElementById("btnAdd");
        btnPurOrderSearch = document.getElementById("btnPurOrderSearch");
        btnVendorSearch = document.getElementById("btnVendorSearch");
        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = "إستلام المشتريات";
        }
        else {
            document.getElementById('Screen_name').innerHTML = " Receipt of purchases  ";
        }
    }
    function IntializeEvents() {
        btnShow.onclick = btnShow_onclick;
        ddlTaxTypeHeader.onchange = TaxTypeOnchange;
        ddlIsCash.onchange = ddlIsCashOnchange;
        btnAddDetailsCharge.onclick = AddNewRowCharge;
        btnAddDetails.onclick = AddNewRow;
        btnUpdate.onclick = btnupdate_onclick;
        btnSave.onclick = saveFunc;
        btnBack.onclick = backFunc;
        btnAdd.onclick = addFunc;
        chkActive.onclick = chkActive_onchecked;
        btnPurOrderSearch.onclick = btnPurOrderSearch_onclick;
        txtPurOrderNum.onchange = txtPurOrderNum_onchange;
        btnVendorSearch.onclick = btnVendorSearch_onclick;
        txtCurrencyRate.onkeyup = txtCurrencyRate_onkeyup;
        // print----*
        btnPrintTrview.onclick = function () { PrintReport(1); };
        btnPrintTrPDF.onclick = function () { PrintReport(2); };
        btnPrintTrEXEL.onclick = function () { PrintReport(3); };
        //btnPrint.onclick = () => { PrintReport(4); }
        btnPrintTransaction.onclick = btnPrintTransaction_onclick;
        //btnPrintInvoicePrice.onclick = btnPrntPrice_onclick;
        searchbutmemreport.onkeyup = _SearchBox_Change;
    }
    //---------------------------------------------------------------- normal region----------------------------------------------------
    function ddlIsCashOnchange() {
        if (ddlIsCash.value == '0') {
            $('#ddlCashBoxH').attr('disabled', 'disabled');
            ;
        }
        else {
            $('#ddlCashBoxH').removeAttr('disabled');
        }
    }
    function InitializeGrid() {
        $("#divMasterGridiv").removeClass("display_none");
        var res = GetResourceList("");
        divMasterGrid.ElementName = "divMasterGrid";
        divMasterGrid.Paging = true;
        divMasterGrid.PageSize = 10;
        divMasterGrid.Sorting = true;
        divMasterGrid.InsertionMode = JsGridInsertionMode.Binding;
        divMasterGrid.Editing = false;
        divMasterGrid.Inserting = false;
        divMasterGrid.SelectedIndex = 1;
        divMasterGrid.OnRowDoubleClicked = MasterGridDoubleClick;
        divMasterGrid.PrimaryKey = "ReceiveID";
        divMasterGrid.Columns = [
            { title: "ID", name: "ReceiveID", type: "text", width: "0", visible: false },
            { title: res.App_InvoiceNum, name: "TrNo", type: "number", width: "7%" },
            { title: res.Men_PurOrder, name: "PoNo", type: "text", width: "8%" },
            { title: res.I_Vendor, name: (lang == "ar" ? "Vnd_NameA" : "Vnd_NameE"), type: "text", width: "15%" },
            { title: res.App_Salesman, name: (lang == "ar" ? "Slsm_DescA" : "Slsm_DescE"), type: "text", width: "15%" },
            { title: res.App_date, name: "TrDate", type: "text", width: "10%" },
            { title: res.Men_StkDefItems, name: "Item_Count", type: "text", width: "4%" },
            { title: res.App_Package, name: "Tot_Qty", type: "text", width: "5%" },
            { title: res.I_Total, name: "Total", type: "text", width: "7%" },
            { title: res.App_Tax, name: "Tot_VAT", type: "text", width: "7%" },
            { title: res.App_Net, name: "Tot_Net", type: "text", width: "7%" },
            { title: res.I_Additions, name: "TotAdd", type: "text", width: "7%" },
            { title: res.I_Additions_Tax, name: "TotAddVat", type: "text", width: "8%" },
            { title: res.App_State, name: "StatusDesc", type: "text", width: "5%" },
        ];
        BindStatisticGridData();
    }
    function BindStatisticGridData() {
        var startdt = DateFormatRep(txtFromDate.value).toString();
        var enddt = DateFormatRep(txtToDate.value).toString();
        var salesmanId = 0;
        var vendorId = 0;
        var status = 0;
        if (ddlVendorMaster.value != "null") {
            vendorId = Number(ddlVendorMaster.value.toString());
        }
        if (ddlSalesmanMaster.value != "null") {
            salesmanId = Number(ddlSalesmanMaster.value.toString());
        }
        status = Number(ddlStateType.value.toString());
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("PurTrReceive", "GetAllPurReceiveStaistic"),
            data: { CompCode: compcode, BranchCode: BranchCode, startDate: startdt, endDate: enddt, trtype: 0, Status: status, VendorId: vendorId, SalesmanId: salesmanId, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    GetPurReceiveStaisticData = result.Response;
                    for (var i = 0; i < GetPurReceiveStaisticData.length; i++) {
                        GetPurReceiveStaisticData[i].TrDate = DateFormat(GetPurReceiveStaisticData[i].TrDate);
                        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
                            GetPurReceiveStaisticData[i].Vendor_Name = GetPurReceiveStaisticData[i].Vnd_NameA;
                            GetPurReceiveStaisticData[i].Tot_VAT = Number(GetPurReceiveStaisticData[i].Tot_VAT.toFixed(2));
                            GetPurReceiveStaisticData[i].Tot_Net = Number(GetPurReceiveStaisticData[i].Tot_Net.toFixed(2));
                            GetPurReceiveStaisticData[i].StatusDesc = GetPurReceiveStaisticData[i].Status == 0 ? "غير معتمد" : "معتمد";
                        }
                        else {
                            GetPurReceiveStaisticData[i].Vendor_Name = GetPurReceiveStaisticData[i].Vnd_NameA;
                            GetPurReceiveStaisticData[i].StatusDesc = GetPurReceiveStaisticData[i].Status == 0 ? "Non Certified" : "Certified";
                        }
                    }
                    divMasterGrid.DataSource = GetPurReceiveStaisticData;
                    divMasterGrid.Bind();
                }
            }
        });
    }
    function MasterGridDoubleClick() {
        debugger;
        ShowFlag = true;
        $('#ddlCurrency').prop("value", "null");
        var Selecteditem = GetPurReceiveStaisticData.filter(function (x) { return x.ReceiveID == Number(divMasterGrid.SelectedKey); });
        GlobalReceiveID = Number(Selecteditem[0].ReceiveID);
        RetrivedPurchaseModel = Selecteditem;
        DataHeader();
        AllGetPurReceiveItemsCharge();
        DisableControls();
        if (RetrivedPurchaseModel[0].Status == 1) {
            chkActive.checked = true;
            chkActive.disabled = !SysSession.CurrentPrivileges.CUSTOM2;
            btnUpdate.disabled = true;
        }
        else {
            chkActive.checked = false;
            chkActive.disabled = true;
            btnUpdate.disabled = false;
        }
        VatPrc = VatDetails.filter(function (x) { return x.CODE == RetrivedPurchaseModel[0].VATType; })[0].VatPerc;
        $("#divDetails").removeClass("display_none");
        $("#divEdit").removeClass("display_none");
        txtNotes.disabled = true;
        ddlCashBoxH.disabled = true;
        txtDateHeader.disabled = true;
        txtPurOrderNum.disabled = true;
        btnVendorSearch.disabled = true;
        btnPurOrderSearch.disabled = true;
    }
    function DataHeader() {
        if (RetrivedPurchaseModel.length > 0) {
            $("#txtDateHeader").val(RetrivedPurchaseModel[0].TrDate.toString());
            globalVendorID = RetrivedPurchaseModel[0].VendorID;
            txtVendorName.value = RetrivedPurchaseModel[0].Vnd_NameA.toString();
            ddlStoreHeader.value = RetrivedPurchaseModel[0].StoreID.toString();
            ddlSalesmanHeader.value = RetrivedPurchaseModel[0].SalesmanId.toString();
            lblInvoiceNumber.innerText = RetrivedPurchaseModel[0].TrNo.toString();
            ddlTaxTypeHeader.value = RetrivedPurchaseModel[0].VATType.toString();
            txtNotes.value = RetrivedPurchaseModel[0].Remarks.toString();
            ddlReciveTypeHeader.value = RetrivedPurchaseModel[0].PurRecType.toString();
            VendorRecieptID.value = RetrivedPurchaseModel[0].VendorInvNo.toString();
            txtCurrencyRate.value = RetrivedPurchaseModel[0].CurrencyRate.RoundToSt(6);
            if (RetrivedPurchaseModel[0].CurrencyID != null)
                ddlCurrency.value = RetrivedPurchaseModel[0].CurrencyID.toString();
            $("#txtCreatedAt").prop("value", RetrivedPurchaseModel[0].CreatedAt);
            $("#txtCreatedBy").prop("value", RetrivedPurchaseModel[0].CreatedBy);
            $("#txtUpdatedAt").prop("value", RetrivedPurchaseModel[0].UpdatedAt);
            $("#txtUpdatedBy").prop("value", RetrivedPurchaseModel[0].UpdatedBy);
            chkActive.checked = RetrivedPurchaseModel[0].Status == 0 ? false : true;
            if (RetrivedPurchaseModel[0].Status == 1) {
                chkActive.checked = true;
                chkActive.disabled = false;
                btnUpdate.disabled = true;
            }
            else {
                chkActive.checked = false;
                chkActive.disabled = true;
                btnUpdate.disabled = false;
            }
        }
        txtFamilyType.value = (IsNullOrEmpty(RetrivedPurchaseModel[0].Line_Count.toString()) == true ? "0" : RetrivedPurchaseModel[0].Line_Count.toString());
        txtTotal.value = (IsNullOrEmpty(RetrivedPurchaseModel[0].Total.toString()) == true ? "0" : RetrivedPurchaseModel[0].Total.toString());
        txtAddons.value = (IsNullOrEmpty(RetrivedPurchaseModel[0].NetAdditionCost.toString()) == true ? "0" : RetrivedPurchaseModel[0].NetAdditionCost.toString());
        txtItemsNumber.value = (IsNullOrEmpty(RetrivedPurchaseModel[0].Tot_Qty.toString()) == true ? "0" : RetrivedPurchaseModel[0].Tot_Qty.toString());
        txtTax.value = (IsNullOrEmpty(RetrivedPurchaseModel[0].VatAmount.toString()) == true ? "0" : RetrivedPurchaseModel[0].VatAmount.toString());
        txtAddonsTax.value = (IsNullOrEmpty(RetrivedPurchaseModel[0].NetAdditionVat.toString()) == true ? "0" : RetrivedPurchaseModel[0].NetAdditionVat.toString());
        txtTotalFamily.value = (IsNullOrEmpty(RetrivedPurchaseModel[0].NetDue.toString()) == true ? "0" : RetrivedPurchaseModel[0].NetDue.toString());
        var v = RetrivedPurchaseModel[0].TotAddAfterVat;
        if (v != null)
            txtTotalAddons.value = (IsNullOrEmpty(RetrivedPurchaseModel[0].TotAddAfterVat.toString()) == true ? "0" : RetrivedPurchaseModel[0].TotAddAfterVat.toString());
        var FullAllPriceWithoutTaxval = Number(txtTotal.value) + Number(txtAddons.value);
        $("#txtTotalPurchaseWithoutTax").val(FullAllPriceWithoutTaxval.RoundToSt(2));
        var FullAllTaxval = Number(txtTax.value) + Number(txtAddonsTax.value);
        $("#txtTotalTax").val(FullAllTaxval.RoundToSt(2));
        var FullAllPRiceWithTaxVal = Number(txtTotalFamily.value) + Number(txtTotalAddons.value);
        $("#txtTotalPurchaseWithTax").val(FullAllPRiceWithTaxVal.RoundToSt(2));
        //TaxTypeOnchange();
        if (RetrivedPurchaseModel[0].IsCash == true) {
            ddlIsCash.value = '1';
            $('#ddlCashBoxH').removeAttr('disabled');
        }
        else {
            ddlIsCash.value = '0';
            $('#ddlCashBoxH').attr('disabled', 'disabled');
            ;
        }
    }
    function AllGetPurReceiveItemsCharge() {
        //
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("PurTrReceive", "AllGetPurReceiveItemsCharge"),
            data: { receiveID: GlobalReceiveID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    AllPurReceiveMasterDetailModel = result.Response;
                    ShowFlag = true;
                    ItemDetails = AllPurReceiveMasterDetailModel.IQ_GetPurReceiveItem;
                    PurReceiveChargeData = AllPurReceiveMasterDetailModel.IQ_GetPurReceiveCharge;
                    $("#div_Data").html('');
                    for (var i = 0; i < ItemDetails.length; i++) {
                        VatPrc = ItemDetails[i].VatPrc;
                        BuildControls(i);
                    }
                    $("#div_ChargesData").html('');
                    Vendor_list = filterVendorDetails;
                    for (var i = 0; i < PurReceiveChargeData.length; i++) {
                        PurReceiveChargeData[i].RefInvoiceDate = DateFormat(PurReceiveChargeData[i].RefInvoiceDate);
                        BuildControlsCharges(i);
                    }
                    CountGrid = ItemDetails.length;
                    CountItems = ItemDetails.length;
                    CountGridCharge = PurReceiveChargeData.length;
                    CountItemsCharge = PurReceiveChargeData.length;
                    ComputeTotalsCharge();
                }
            }
        });
    }
    //---------------------------------------------------------------- buttons region----------------------------------------------------
    function btnShow_onclick() {
        ShowFlag = true;
        $("#divMasterGridiv").removeClass("display_none");
        InitializeGrid();
        $("#divDetails").addClass("display_none");
        $("#MasterDropDowns").removeClass("display_none");
        $("#divGridWithDetail").removeClass("display_none");
        $("#DivShow").removeClass("display_none");
        $("#divTotalSatistics").removeClass("display_none");
        $("#DivChargesShow").removeClass("display_none");
    }
    function backFunc() {
        $("#DivFilter").removeClass("disabledDiv");
        $("#divIconbar").removeClass("disabledIconbar");
        $("#divMasterGridiv").removeClass("disabledDiv");
        $("#divMasterGridiv").removeClass("display_none");
        if (ModeType == 3) {
            MasterGridDoubleClick();
        }
        else {
            DisableControls();
            clear();
            $("#divDetails").addClass("display_none");
        }
    }
    function saveFunc() {
        loading('btnsave');
        setTimeout(function () {
            finishSave('btnsave');
            if (!ValidationHeader())
                return;
            for (var i = 0; i < CountGrid; i++) {
                if (!Validation_Grid(i))
                    return;
            }
            for (var i = 0; i < CountGridCharge; i++) {
                if (!ValidationCharge_Grid(i))
                    return;
            }
            if (ddlIsCash.value == "0") {
                $('#ddlCashBoxH').removeAttr('disabled');
                var net = Number($('#txtTotalPurchaseWithTax').val());
                if (!Check_CreditLimit_Vendor(net))
                    return;
            }
            Assign();
            if (ModeType == 2) //Insert
             {
                Insert();
            }
            else if (ModeType == 3) //update
             {
                Update();
            }
        }, 100);
    }
    function addFunc() {
        if (!SysSession.CurrentPrivileges.AddNew)
            return;
        ModeType = 2; //insert
        ShowFlag = false;
        clear();
        EnableControls();
        btnPurOrderSearch.disabled = false;
        $("#txtCreatedAt").prop("value", DateTimeFormat(Date().toString()));
        $("#txtCreatedBy").prop("value", SysSession.CurrentEnvironment.UserCode);
        $('#ddlCurrency').prop("value", GlobalCurrency);
        if (ddlIsCash.value == '0') {
            $('#ddlCashBoxH').attr('disabled', 'disabled');
            ;
        }
        else {
            $('#ddlCashBoxH').removeAttr('disabled');
        }
        ddlTaxTypeHeader.value = DefVatType;
        ddlTaxTypeHeader.disabled = true;
        TaxTypeOnchange();
        AddNewRow();
        txtPurOrderNum.disabled = false;
    }
    function btnupdate_onclick() {
        if (!SysSession.CurrentPrivileges.EDIT)
            return;
        ShowFlag = false;
        ModeType = 3; //update
        EnableControls();
        btnPurOrderSearch.disabled = true;
        $("#txtUpdatedAt").prop("value", DateTimeFormat(Date().toString()));
        $("#txtUpdatedBy").prop("value", SysSession.CurrentEnvironment.UserCode);
        txtPurOrderNum.disabled = false;
    }
    function btnPurOrderSearch_onclick() {
        var sys = new SystemTools();
        sys.FindKey(Modules.PurTrReceive, "btnPurOrderSearch", "CompCode=" + compcode + "and Status=1 and IsReceived='False' and BranchCode = " + BranchCode, function () {
            var id = SearchGrid.SearchDataGrid.SelectedKey;
            globalPurOrderID = id;
            getPurOrderByID();
        });
    }
    function txtPurOrderNum_onchange() {
        //getPurOrderByID(txtPurOrderNum.value);
    }
    function btnVendorSearch_onclick() {
        var sys = new SystemTools();
        sys.FindKey(Modules.PurTrReceive, "btnVendorSearch", "CompCode=" + compcode + " and VendorType = 1  and Isactive =1", function () {
            var id = SearchGrid.SearchDataGrid.SelectedKey;
            globalVendorID = id;
            getVendorByID();
        });
    }
    //---------------------------------------------------------------- Events region----------------------------------------------------
    function TaxTypeOnchange() {
        //////;
        var fltr = VatDetails.filter(function (x) { return (x.CODE == (ddlTaxTypeHeader.value == "null" ? DefVatType : ddlTaxTypeHeader.value)); });
        if (fltr.length != 0)
            VatPrc = fltr[0].VatPerc;
        else
            VatPrc = VatDetails.filter(function (x) { return x.CODE == Number(DefVatType); })[0].VatPerc;
        if (ModeType != 2) {
            for (var cnt = 0; cnt < CountGrid; cnt++) {
                //////;
                //
                var txtQuantityValue = $("#txtQuantity" + cnt).val();
                var txtPriceValue = $("#txtPrice" + cnt).val();
                if ($("#txtPrice" + cnt).val() == 0) {
                    var total = Number(txtQuantityValue) * 1;
                    $("#txtTotal" + cnt).val(total.RoundToSt(2));
                    var vatAmount = Number(total) * VatPrc / 100;
                    $("#txtTax" + cnt).val(vatAmount.RoundToSt(2));
                    var totalAfterVat = Number(vatAmount) + Number(total);
                    $("#txtTotAfterTax" + cnt).val(totalAfterVat.RoundToSt(2));
                }
                else {
                    var total = Number(txtQuantityValue) * Number(txtPriceValue);
                    $("#txtTotal" + cnt).val(total.RoundToSt(2));
                    var vatAmount = Number(total) * VatPrc / 100;
                    $("#txtTax" + cnt).val(vatAmount.RoundToSt(2));
                    var totalAfterVat = Number(vatAmount) + Number(total);
                    $("#txtTotAfterTax" + cnt).val(totalAfterVat.RoundToSt(2));
                }
            }
            ComputeTotals();
        }
    }
    function chkActive_onchecked() {
        if (btnUpdate.disabled == true) {
            if (chkActive.checked == false) {
                openInvoice();
                chkActive.disabled = true;
            }
        }
    }
    function _SearchBox_Change() {
        if (searchbutmemreport.value != "") {
            var search_1 = searchbutmemreport.value.toLowerCase();
            SearchDetails = GetPurReceiveStaisticData.filter(function (x) { return x.TrNo.toString().search(search_1) >= 0
                || x.Vnd_NameA.toLowerCase().search(search_1) >= 0 || x.Vnd_NameE.toLowerCase().search(search_1) >= 0
                || (lang == "ar" ? x.Slsm_DescA.toLowerCase().search(search_1) >= 0 : x.Slsm_DescE.toLowerCase().search(search_1) >= 0); });
            divMasterGrid.DataSource = SearchDetails;
            divMasterGrid.Bind();
        }
        else {
            divMasterGrid.DataSource = GetPurReceiveStaisticData;
            divMasterGrid.Bind();
        }
    }
    function txtCurrencyRate_onkeyup() {
        currencrRate = 1;
        var txtQuantityVal = 0;
        var txtPriceVal = 0;
        var txtPriceValFc = 0;
        var TotalFc = 0;
        for (var i = 0; i < CountGrid; i++) {
            var flagvalue = $("#txt_StatusFlag" + i).val();
            if (flagvalue != "d" && flagvalue != "m") {
                txtQuantityVal = $("#txtQuantity" + i).val();
                txtPriceValFc = $("#txtPriceFc" + i).val();
                TotalFc = Number(txtQuantityVal) * Number(txtPriceValFc);
                $("#txtTotalFc" + i).val(Number(TotalFc).toFixed(2));
                txtPriceVal = $("#txtPriceFc" + i).val() * currencrRate;
                $("#txtPrice" + i).val(txtPriceVal);
                var total = Number(txtQuantityVal) * Number(txtPriceVal);
                $("#txtTotal" + i).val(total);
                var vatAmount = Number(total) * VatPrc / 100;
                $("#txtTax" + i).val(vatAmount);
                var totalAfterVat = Number(vatAmount) + Number(total);
                $("#txtTotAfterTax" + i).val(totalAfterVat.RoundToSt(2));
            }
        }
        ComputeTotals();
    }
    //---------------------------------------------------------------- Fill Drop Down region----------------------------------------------------
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
    function FillddlItems(ItemFamilyID, StoreId) {
        ItemBaesdFamilyDetails = ItemFamilyDetails.filter(function (x) { return x.ItemFamilyID == ItemFamilyID && x.StoreId == StoreId; });
        if (ModeType == 2) //Insert
         {
            ItemBaesdFamilyDetails = ItemFamilyDetails.filter(function (x) { return x.ItemFamilyID == ItemFamilyID && x.StoreId == StoreId && x.IsActive == true && x.IsPurchase == true; });
        }
        else {
            if (ShowFlag == true || PurOrderShowFlag == true) {
                ItemBaesdFamilyDetails = ItemFamilyDetails.filter(function (x) { return x.ItemFamilyID == ItemFamilyID && x.StoreId == StoreId; });
            }
            else {
                ItemBaesdFamilyDetails = ItemFamilyDetails.filter(function (x) { return x.ItemFamilyID == ItemFamilyID && x.StoreId == StoreId && x.IsActive == true && x.IsPurchase == true; });
            }
        }
    }
    function FillddlCashBox() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefBox", "GetAll"),
            data: { compCode: compcode, BranchCode: BranchCode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    CashboxDetails = result.Response;
                    $('#ddlCashBoxH').append('<option value="null">' + (lang == "ar" ? "اختر الصندوق" : "choose Box") + '</option>');
                    for (var i = 0; i < CashboxDetails.length; i++) {
                        $('#ddlCashBoxH').append('<option value="' + CashboxDetails[i].CashBoxID + '">' + (lang == "ar" ? CashboxDetails[i].CashBox_DescA : CashboxDetails[i].CashBox_DescE) + '</option>');
                    }
                }
            }
        });
    }
    function FillddlSeller() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("G_USERS", "GetAll"),
            data: { CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    G_USERSDetails = result.Response;
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                        DocumentActions.FillCombowithdefult(G_USERSDetails, ddlSeller, "USER_CODE", "USER_CODE", "Select Seller");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(G_USERSDetails, ddlSeller, "USER_CODE", "USER_CODE", "اختر البائع");
                    }
                }
            }
        });
    }
    function FillddlStateType() {
        StateDetailsAr = ["غير معتمد", "معتمد", "الجميع"];
        StateDetailsEn = ["Not Certified", "Certified", "All"];
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
    function FillddlCashType() {
        StateDetailsAr = ["علي الحساب", "نقدي"];
        StateDetailsEn = ["On account", "Cash"];
        if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
            for (var i = 0; i < StateDetailsEn.length; i++) {
                var newoption = document.createElement("option");
                newoption.value = i.toString();
                newoption.text = StateDetailsEn[i];
                ddlIsCash.options.add(newoption);
            }
        }
        else {
            for (var i = 0; i < StateDetailsAr.length; i++) {
                var newoption = document.createElement("option");
                newoption.value = i.toString();
                newoption.text = StateDetailsAr[i];
                ddlIsCash.options.add(newoption);
            }
        }
    }
    function FillddlAddonsType(cnt) {
        StateDetailsAr = ["خصم", "اضافة"];
        StateDetailsEn = ["Discount", "addition"];
        if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
            for (var i = 0; i < StateDetailsEn.length; i++) {
                $("#txtAddonsTypeCharge" + cnt).append(new Option(StateDetailsEn[i], i.toString()));
            }
        }
        else {
            for (var i = 0; i < StateDetailsAr.length; i++) {
                $("#txtAddonsTypeCharge" + cnt).append(new Option(StateDetailsAr[i], i.toString()));
            }
        }
    }
    function FillddlIsCashType(cnt) {
        StateDetailsAr = ["علي الحساب", "نقدى"];
        StateDetailsEn = ["Postpaid", "Cash"];
        if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
            for (var i = 0; i < StateDetailsEn.length; i++) {
                $("#txtVendorIsCheckCharge" + cnt).append(new Option(StateDetailsEn[i], i.toString()));
            }
        }
        else {
            for (var i = 0; i < StateDetailsAr.length; i++) {
                $("#txtVendorIsCheckCharge" + cnt).append(new Option(StateDetailsAr[i], i.toString()));
            }
        }
    }
    function FillddlSalesmanHeader() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefSalesMen", "GetAllPurchasePeople"),
            data: { CompCode: compcode, BranchCode: BranchCode, IsPurchaseEnable: true, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    SellerDetails = result.Response;
                    Check_on_user_type();
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                        DocumentActions.FillCombowithdefult(SellerDetails, ddlSalesmanHeader, "SalesmanId", "NameE", "Select Seller");
                        DocumentActions.FillCombowithdefult(SellerDetails, ddlSalesmanMaster, "SalesmanId", "NameE", "Select Seller");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(SellerDetails, ddlSalesmanHeader, "SalesmanId", "NameA", "اختر المندوب");
                        DocumentActions.FillCombowithdefult(SellerDetails, ddlSalesmanMaster, "SalesmanId", "NameA", "اختر المندوب");
                    }
                    SysSession.CurrentEnvironment.UserType == 1 || SysSession.CurrentEnvironment.UserType == 3 ? $('#ddlSalesmanHeader').prop('selectedIndex', 1) : $('#ddlSalesmanHeader').prop('selectedIndex', 0);
                    SysSession.CurrentEnvironment.UserType == 1 || SysSession.CurrentEnvironment.UserType == 3 ? ($('#ddlSalesmanMaster option[value="null"]').remove()) : $('#ddlSalesmanMaster').prop('selectedIndex', 0);
                }
            }
        });
    }
    function FillddlVendorHeader() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefVendor", "GetAllVendorType"),
            data: { CompCode: compcode, VendorType: 1, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    VendorDetails = result.Response;
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                        DocumentActions.FillCombowithdefult(VendorDetails, ddlVendorMaster, "VendorID", "NAMEL", "Select Vendor");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(VendorDetails, ddlVendorMaster, "VendorID", "NAMEA", "اختر المورد");
                    }
                }
            }
        });
    }
    function FillddlVendor() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefVendor", "GetAllVendorType"),
            data: { CompCode: compcode, VendorType: 2, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    filterVendorDetails = result.Response;
                }
            }
        });
    }
    function FillddlStoreHeader() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("StkDefStore", "GetAll"),
            data: {
                CompCode: compcode, BranchCode: BranchCode, AccountType: 1, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    StoresDetails = result.Response;
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                        DocumentActions.FillCombowithdefult(StoresDetails, ddlStoreHeader, "StoreId", "DescL", "Select Store");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(StoresDetails, ddlStoreHeader, "StoreId", "DescA", "اختر المخزن");
                    }
                }
            }
        });
    }
    function FillddlTaxType() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GenVatType", "GetAll"),
            data: {
                CompCode: compcode, VatType: 2, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    VatDetails = result.Response;
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                        DocumentActions.FillCombowithdefult(VatDetails, ddlTaxTypeHeader, "CODE", "DESCRIPTION", "Select Tax");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(VatDetails, ddlTaxTypeHeader, "CODE", "DESCRIPTION", "اختر الضريبة");
                    }
                    ddlTaxTypeHeader.value = DefVatType.toString();
                    VatPrc = VatDetails.filter(function (x) { return x.CODE == Number(ddlTaxTypeHeader.value); })[0].VatPerc;
                }
            }
        });
    }
    function FillddlReciveType() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GCodes", "GetAll"),
            data: {
                codeType: "PurRecType", UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    CodesDetails = result.Response;
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                        DocumentActions.FillCombowithdefult(CodesDetails, ddlReciveTypeHeader, "CodeValue", "DescE", "Select Recieve Type");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(CodesDetails, ddlReciveTypeHeader, "CodeValue", "DescA", " اختر نوع الإستلام");
                    }
                }
            }
        });
    }
    function FillddlCurrency() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefVendor", "GetAllCurrency"),
            data: { UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    CurrencyDetails = result.Response;
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                        DocumentActions.FillCombowithdefult(CurrencyDetails, ddlCurrency, "CurrencyID", "DescL", "Select currency");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(CurrencyDetails, ddlCurrency, "CurrencyID", "DescA", "اختر العمله");
                    }
                }
            }
        });
    }
    //---------------------------------------------------------------- Get Functions region----------------------------------------------------
    function GetAllIItem() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("StkDefItems", "GetAllItemPur"),
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
    function GetVatType() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GenVatType", "GetAll"),
            data: {
                CompCode: compcode, VatType: 2, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    VatTypeData = result.Response;
                }
            }
        });
    }
    function GetAddonsData() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("PurTrReceive", "GetAllPurDefCharges"),
            data: {
                compCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    AddonsData = result.Response;
                }
            }
        });
    }
    function Check_CreditLimit_Vendor(net) {
        var Vendor1 = VendorDetails.filter(function (s) { return s.VendorID == globalVendorID; });
        var Isbalance = Number((Number(Vendor1[0].Openbalance) - Number(Vendor1[0].Debit) + Number(Vendor1[0].Credit)).RoundToSt(2));
        var res = Number((net + Isbalance).RoundToSt(2));
        if (Vendor1[0].DebitLimit > 0) {
            if (res <= Vendor1[0].DebitLimit) {
                return true;
            }
            else {
                MessageBox.Show("خطأ لا يمكن ان تجاوز صافي الفاتوره (" + net + ") مع الرصيد (" + Isbalance + ") الحد الائتماني     (" + Vendor1[0].DebitLimit + ")", "خطأ");
                return false;
            }
        }
        return true;
    }
    function Check_on_user_type() {
        if (SysSession.CurrentEnvironment.UserType == 1 || SysSession.CurrentEnvironment.UserType == 3) { //Salesman
            var SalesId_1 = SysSession.CurrentEnvironment.SalesManID;
            SellerDetails = SellerDetails.filter(function (s) { return s.SalesmanId == SalesId_1; });
        }
        else if (SysSession.CurrentEnvironment.UserType == 2 || SysSession.CurrentEnvironment.UserType == 3) { //CashBox
            var CashBoxID_1 = SysSession.CurrentEnvironment.CashBoxID;
            CashboxDetails = CashboxDetails.filter(function (s) { return s.CashBoxID == CashBoxID_1; });
        }
    }
    function getPurOrderByID() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("PurTrReceive", "GetPurOrderMasterDetailByID"),
            data: {
                PurOrderID: globalPurOrderID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    PurOrderDetailModel = new IQ_PurchaseOrderWithDetail();
                    PurOrderDetailModel = result.Response;
                    clear();
                    BindPurOrder();
                }
            }
        });
    }
    function BindPurOrder() {
        if (PurOrderDetailModel.IQ_GetPurchaseOrder.length > 0) {
            txtVendorName.value = PurOrderDetailModel.IQ_GetPurchaseOrder[0].Vnd_NameA.toString();
            globalVendorID = PurOrderDetailModel.IQ_GetPurchaseOrder[0].VendorID;
            ddlSalesmanHeader.value = PurOrderDetailModel.IQ_GetPurchaseOrder[0].SalesmanId.toString();
            txtPurOrderNum.value = PurOrderDetailModel.IQ_GetPurchaseOrder[0].TrNo.toString();
            ddlTaxTypeHeader.value = PurOrderDetailModel.IQ_GetPurchaseOrder[0].VATType.toString();
            txtNotes.value = PurOrderDetailModel.IQ_GetPurchaseOrder[0].Remarks.toString();
            if (PurOrderDetailModel.IQ_GetPurchaseOrder[0].IsCash == true) {
                ddlIsCash.value = '1';
                $('#ddlCashBoxH').attr('disabled', 'disabled');
                ;
            }
            else {
                ddlIsCash.value = '0';
                $('#ddlCashBoxH').removeAttr('disabled');
            }
            PurOrderShowFlag = true;
            ShowFlag = false;
            for (var i = 0; i < PurOrderDetailModel.IQ_GetPurchaseOrderDetail.length; i++) {
                VatPrc = PurOrderDetailModel.IQ_GetPurchaseOrder[0].VATType;
                BuildControls(i);
            }
            PurOrderShowFlag = false;
            CountGrid = PurOrderDetailModel.IQ_GetPurchaseOrderDetail.length;
            CountItems = PurOrderDetailModel.IQ_GetPurchaseOrderDetail.length;
            ComputeTotals();
            $("#txtCreatedAt").prop("value", DateTimeFormat(Date().toString()));
            $("#txtCreatedBy").prop("value", SysSession.CurrentEnvironment.UserCode);
        }
        PurOrderDetailModel = new IQ_PurchaseOrderWithDetail();
    }
    function getVendorByID() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefVendor", "GetById"),
            data: {
                id: globalVendorID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    VendorModel = new A_Pay_D_Vendor();
                    VendorModel = result.Response;
                    txtVendorName.value = (lang == "ar" ? VendorModel.NAMEA : VendorModel.NAMEL);
                    vatpriceVendor = VendorModel.VATType;
                    ddlTaxTypeHeader.value = VendorModel.VATType.toString();
                    var fltr = VatDetails.filter(function (x) { return (x.CODE == (ddlTaxTypeHeader.value == "null" ? DefVatType : ddlTaxTypeHeader.value)); });
                    if (fltr.length != 0)
                        VatPrc = fltr[0].VatPerc;
                    else
                        VatPrc = VatDetails.filter(function (x) { return x.CODE == Number(DefVatType); })[0].VatPerc;
                    if (ModeType == 2 || ModeType == 3) {
                        for (var cnt = 0; cnt < CountGrid; cnt++) {
                            //////;
                            //
                            var txtQuantityValue = $("#txtQuantity" + cnt).val();
                            var txtPriceValue = $("#txtPrice" + cnt).val();
                            if ($("#txtPrice" + cnt).val() == 0) {
                                var total = Number(txtQuantityValue) * 1;
                                $("#txtTotal" + cnt).val(total.RoundToSt(2));
                                var vatAmount = Number(total) * VatPrc / 100;
                                $("#txtTax" + cnt).val(vatAmount.RoundToSt(2));
                                var totalAfterVat = Number(vatAmount) + Number(total);
                                $("#txtTotAfterTax" + cnt).val(totalAfterVat.RoundToSt(2));
                            }
                            else {
                                var total = Number(txtQuantityValue) * Number(txtPriceValue);
                                $("#txtTotal" + cnt).val(total.RoundToSt(2));
                                var vatAmount = Number(total) * VatPrc / 100;
                                $("#txtTax" + cnt).val(vatAmount.RoundToSt(2));
                                var totalAfterVat = Number(vatAmount) + Number(total);
                                $("#txtTotAfterTax" + cnt).val(totalAfterVat.RoundToSt(2));
                            }
                        }
                        ComputeTotals();
                    }
                }
            }
        });
    }
    //---------------------------------------------------------------- Items Grid Controls  region---------------------------------------------------- 
    function AddNewRow() {
        if (ddlTaxTypeHeader.value == "null") {
            DisplayMassage(" برجاء اختيار نوع الضريبة", "Please select a TaxType", MessageType.Error);
            Errorinput(ddlTaxTypeHeader);
            return;
        }
        if (!SysSession.CurrentPrivileges.AddNew)
            return;
        var CanAdd = true;
        if (CountGrid > 0) {
            var LastRowNo = CountGrid - 1;
            CanAdd = Validation_Grid(LastRowNo);
        }
        if (CanAdd) {
            CountItems = CountItems + 1;
            BuildControls(CountGrid);
            $("#txt_StatusFlag" + CountGrid).val("i"); //In Insert mode
            $("#txtFamilyType").val(CountItems); //In Insert mode
            $("#ddlFamily" + CountGrid).removeAttr("disabled");
            $("#ddlItem" + CountGrid).removeAttr("disabled");
            $("#txtQuantity" + CountGrid).removeAttr("disabled");
            $("#txtPrice" + CountGrid).attr("disabled", "disabled");
            $("#txtPriceFc" + CountGrid).removeAttr("disabled");
            // can delete new inserted record  without need for delete privilage
            $("#btn_minus" + CountGrid).removeClass("display_none");
            $("#btn_minus" + CountGrid).removeAttr("disabled");
            CountGrid++;
            Insert_Serial();
            ComputeTotals();
        }
    }
    function BuildControls(cnt) {
        var html;
        html = "<tr id= \"No_Row" + cnt + "\">\n                    <input id=\"ReciveDetailsID" + cnt + "\" type=\"hidden\" class=\"form-control display_none\"  />\n\t                <th>\n\t\t                <div class=\"form-group\">\n\t\t\t                <span id=\"btn_minus" + cnt + "\"><i class=\"fas fa-minus-circle fs-4 btn-minus\"></i></span>\n\t\t                </div>\n\t                </th>\n                    <th>\n\t\t                <div class=\"form-group\">\n                            <select id=\"ddlFamily" + cnt + "\" class=\"form-control select_\">\n                                <option value=\"null\">" + (lang == "ar" ? "اختر" : "Choose") + "</option>\n                            </select>\n\t\t                </div>\n\t                </th>\n                     <th>\n\t\t                <div class=\"form-group\">\n                        <select id=\"ddlItem" + cnt + "\" class=\"form-control select_\">\n                            <option value=\"null\">" + (lang == "ar" ? "اختر" : "Choose") + "</option>\n                        </select>\n\t\t                </div>\n\t                </th>\n                     <th>\n\t\t                <div class=\"form-group\">\n\t\t\t                <input type=\"number\"  id=\"txtQuantity" + cnt + "\" name=\"quant[10]\" class=\"form-control\" value=\"1\" min=\"1\" max=\"1000\" step=\"1\">\n\t\t                </div>\n\t                </th>\n                    <th>\n\t\t                <div class=\"form-group\">\n\t\t\t                <input id=\"txtQuantityReturnValue" + cnt + "\" type=\"number\" class=\"form-control\"  disabled value=\"0\"/>\n\t\t                </div>\n\t                </th>\n                    <th>\n\t\t                <div class=\"form-group\">\n\t\t\t                <input type=\"number\"  id=\"txtPriceFc" + cnt + "\" name=\"quant[20]\" class=\"form-control\" value=\"1\" min=\"0\" max=\"1000\" step=\"0.5\">\n\t\t                </div>\n\t                </th>\n                    <th>\n\t\t                <div class=\"form-group\">\n\t\t\t              <input id=\"txtTotalFc" + cnt + "\" type=\"number\" disabled class=\"form-control\"  value=\"0\"/>\n\t\t                </div>\n\t                </th>\n                    <th>\n\t\t                <div class=\"form-group\">\n\t\t\t              <input id=\"txtPrice" + cnt + "\" disabled type=\"text\" class=\"form-control\"  value=\"0\"/>\n\t\t                </div>\n\t                </th>\n                    <th>\n\t\t                <div class=\"form-group\">\n\t\t\t              <input id=\"txtTotal" + cnt + "\" type=\"text\" class=\"form-control\" disabled />\n\t\t                </div>\n\t                </th>\n                    <th>\n\t\t                <div class=\"form-group\">\n\t\t\t               <input id=\"txtTax" + cnt + "\" type=\"text\" disabled class=\"form-control\" data_VatPrc=\"" + ((VatPrc == null || undefined) ? 0 : VatPrc) + "\"  value=\"0\"/>\n\t\t                </div>\n\t                </th>\n                    <th>\n\t\t                <div class=\"form-group\">\n\t\t\t                <input id=\"txtTotAfterTax" + cnt + "\" type=\"text\" disabled value=\"0\" class=\"form-control\"  />\n\t\t                </div>\n\t                </th>\n                    <th>\n\t\t                <div class=\"form-group\">\n\t\t\t             <input id=\"txtAddons" + cnt + "\" type=\"text\" disabled class=\"form-control\"  value=\"0\" />\n\t\t                </div>\n\t                </th>\n                    <th>\n\t\t                <div class=\"form-group\">\n\t\t\t             <input id=\"txtTotAddons" + cnt + "\" type=\"text\" disabled class=\"form-control\"  value=\"0\" />\n\t\t                </div>\n\t                </th>\n                <input id=\"UnitCost" + cnt + "\" name = \" \" type = \"hidden\" class=\"form-control \"/>\n                <input id=\"txt_StatusFlag" + cnt + "\" name = \" \" type = \"hidden\" class=\"form-control input-sm\"/>\n                <input id=\"txt_ID" + cnt + "\" name = \" \" type = \"hidden\" class=\"form-control input-sm\" />';\n                </tr>";
        //html = '<div id= "No_Row' + cnt + '" class=" style_border" > <div class="col-xs-12 p-0" > <div class="col-lg-xs-12" > ' +
        //    '<span id="btn_minus' + cnt + '" class="fa fa-minus-circle fontitm3PurTrReceive display_none"></span>' +
        //    '<input id="ReciveDetailsID' + cnt + '" type="hidden" class="form-control input-sm right2 display_none"  />' +
        //    '<div class="col-lg-1  col-md-1 col-sm-1 col-xs-12" style="width: 4%;">' +
        //    '<input id="txtSerialH' + cnt + '" type="text" class="form-control input-sm right2" disabled /></div>' +
        //    '<div class="col-xs-2 pl-0" style="margin-right: -1%;width: 15%;" >' +
        //    '<select id="ddlFamily' + cnt + '" class="form-control input-sm"><option value="null">' + (lang == "ar" ? "اختر" : "Choose") + '</option></select></div>' +
        //    '<div class="col-xs-2 p-0"    style="width: 15%;">' +
        //    '<select id="ddlItem' + cnt + '" class="form-control input-sm"><option value="null">' + (lang == "ar" ? "اختر" : "Choose") + '</option></select></div>' +
        //    '<div class="col-xs-1 " style="width: 8%;"><input type="number"  id="txtQuantity' + cnt + '" name="quant[10]" class="form-control input-sm   font1" value="1" min="1" max="1000" step="1"></div>' +
        //    '<div class="col-xs-1 " style="width: 7%;" >' +
        //    '<input id="txtQuantityReturnValue' + cnt + '" type="number" class="form-control input-sm right2"  disabled value="0"/></div>' +
        //    '<div class="col-xs-1 "><input type="number"  id="txtPriceFc' + cnt + '" name="quant[20]" class="form-control input-sm  font1" value="1" min="0" max="1000" step="0.5"> </div>' +
        //    '<div class="col-xs-1 ">' +
        //    '<input id="txtTotalFc' + cnt + '" type="number" disabled class="form-control input-sm right2"  value="0"/></div>' +
        //    '<div class="col-xs-1">' +
        //    '<input id="txtPrice' + cnt + '" disabled type="text" class="form-control input-sm right2"  value="0"/></div>' +
        //    '<div class="col-xs-1" >' +
        //    '<input id="txtTotal' + cnt + '" type="text" disabled class="form-control input-sm right2"  value="0" /></div>' +
        //    '<div class="col-xs-1">' +
        //    '<input id="txtTax' + cnt + '" type="text" disabled class="form-control input-sm right2" data_VatPrc="' + ((VatPrc == null || undefined) ? 0 : VatPrc) + '"  value="0"/></div>' +
        //    '<div class="col-xs-1">' +
        //    '<input id="txtTotAfterTax' + cnt + '" type="text" disabled value="0" class="form-control input-sm right2"  /></div>' +
        //    '<div class="col-xs-2 "style="position:absolute;right:100%">' +
        //    '<div class="col-xs-6 ">' +
        //    '<input id="txtAddons' + cnt + '" type="text" disabled class="form-control input-sm right2"  value="0" /></div>' +
        //    '<div class="col-xs-6 p-0 ">' +
        //    '<input id="txtTotAddons' + cnt + '" type="text" disabled class="form-control input-sm right2"  value="0"/></div>' +
        //    '</div>' +
        //    '</div>' +
        //    '</div></div></div>' +
        //    '<input id="UnitCost' + cnt + '" name = " " type = "hidden" class="form-control input-sm"/><input id="txt_StatusFlag' + cnt + '" name = " " type = "hidden" class="form-control input-sm"/><input id="txt_ID' + cnt + '" name = " " type = "hidden" class="form-control input-sm" />';
        $("#div_Data").append(html);
        $('.btn-number1' + cnt).click(function (e) {
            e.preventDefault();
            var fieldName = $(this).attr('data-field');
            var type = $(this).attr('data-type');
            var input = $("input[name='" + fieldName + "']");
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
                $(".btn-number1[data-type='minus'][data-field='" + name + "']").removeAttr('disabled');
            }
            else {
                alert('Sorry, the minimum value was reached');
                $(this).val($(this).data('oldValue'));
            }
            if (valueCurrent <= maxValue) {
                $(".btn-number1[data-type='plus'][data-field='" + name + "']").removeAttr('disabled');
            }
            else {
                alert('Sorry, the maximum value was reached');
                $(this).val($(this).data('oldValue'));
            }
        });
        $('.input-number1' + cnt).keydown(function (e) {
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
        $('.btn-number2' + cnt).click(function (e) {
            e.preventDefault();
            var fieldName = $(this).attr('data-field');
            var type = $(this).attr('data-type');
            var input = $("input[name='" + fieldName + "']");
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
        $('.input-number2' + cnt).focusin(function () {
            $(this).data('oldValue', $(this).val());
        });
        $('.input-number2' + cnt).change(function () {
            var minValue = parseInt($(this).attr('min'));
            var maxValue = parseInt($(this).attr('max'));
            var valueCurrent = parseInt($(this).val());
            var name = $(this).attr('name');
            if (valueCurrent >= minValue) {
                $(".btn-number2[data-type='minus'][data-field='" + name + "']").removeAttr('disabled');
            }
            else {
                alert('Sorry, the minimum value was reached');
                $(this).val($(this).data('oldValue'));
            }
            if (valueCurrent <= maxValue) {
                $(".btn-number2[data-type='plus'][data-field='" + name + "']").removeAttr('disabled');
            }
            else {
                alert('Sorry, the maximum value was reached');
                $(this).val($(this).data('oldValue'));
            }
        });
        $('.input-number2' + cnt).keydown(function (e) {
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
        var drop = '#ddlFamily' + cnt;
        $('#ddlFamily' + cnt).empty();
        $('#ddlFamily' + cnt).append('<option value="' + null + '">' + (lang == "ar" ? "اختر النوع" : "Choose type") + '</option>');
        for (var i = 0; i < FamilyDetails.length; i++) {
            $('#ddlFamily' + cnt).append('<option value="' + FamilyDetails[i].ItemFamilyID + '">' + (lang == "ar" ? FamilyDetails[i].DescA : FamilyDetails[i].DescL) + '</option>');
        }
        $('#ddlFamily' + cnt).change(function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
            if ($('#ddlFamily' + cnt).val() != "null" && ddlStoreHeader.value != "null") {
                $('#ddlItem' + cnt).empty();
                $('#ddlItem' + cnt).append('<option value="' + null + '">' + "اختر الصنف" + '</option>');
                FillddlItems(Number($('#ddlFamily' + cnt).val()), Number(ddlStoreHeader.value));
                for (var i = 0; i < ItemBaesdFamilyDetails.length; i++) {
                    $('#ddlItem' + cnt).append('<option data-MinUnitPrice="' + ItemBaesdFamilyDetails[i].MinUnitPrice + '"data-UomID="' + ItemBaesdFamilyDetails[i].UomID + '" data-OnhandQty="' + ItemBaesdFamilyDetails[i].OnhandQty + '" value="' + ItemBaesdFamilyDetails[i].ItemID + '">' + (lang == "ar" ? ItemBaesdFamilyDetails[i].Itm_DescA : ItemBaesdFamilyDetails[i].Itm_DescE) + '</option>');
                }
            }
            else {
                alert("يجب اختيار المخزن والنوع");
                $('#ddlFamily' + cnt).val("null");
            }
        });
        var dropddlItem = '#ddlItem' + cnt;
        $('#ddlItem' + cnt).change(function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
            if ($('#ddlItem' + cnt).val() == "null") {
                $("#txtQuantity" + cnt).val("0");
                $("#txtPrice" + cnt).val("0");
                $("#txtTotal" + cnt).val("0");
                $("#txtPriceFc" + cnt).val("0");
                $("#txtTotalFc" + cnt).val("0");
                $("#txtTax" + cnt).val("0");
                $("#txtTotAfterTax" + cnt).val("0");
            }
            else {
                var selectedItem = $(dropddlItem + ' option:selected').attr('value');
                var selectedFamily = $(drop + ' option:selected').attr('value');
                var itemID = Number(selectedItem);
                var FamilyID = Number(selectedFamily);
                var res = false;
                var NumberRowid = $("#ReciveDetailsID" + cnt).val();
                //res = checkRepeatedItems(itemID, FamilyID, NumberRowid);
                //if (res == true) {
                //    $("#ddlItem" + cnt).val("null");
                //    $("#txtPrice" + cnt).val("1");
                //    DisplayMassage('( لايمكن تكرار نفس الاصناف علي الفاتورة )', 'The same items cannot be repeated on the invoice', MessageType.Error);
                //} else {
                $("#txtPriceFc" + cnt).val("1");
                var txtQuantityValue = $("#txtQuantity" + cnt).val();
                var txtPriceValueFc = $("#txtPriceFc" + cnt).val();
                var totalFc = Number(txtQuantityValue) * Number(txtPriceValueFc);
                $("#txtTotalFc" + cnt).val(Number(totalFc).toFixed(2));
                var txtPriceValue = $("#txtPriceFc" + cnt).val() * currencrRate;
                $("#txtPrice" + cnt).val(txtPriceValue);
                var total = Number(txtQuantityValue) * Number(txtPriceValue);
                $("#txtTotal" + cnt).val(total);
                var vatAmount = Number(total) * VatPrc / 100;
                $("#txtTax" + cnt).val(vatAmount);
                var totalAfterVat = Number(vatAmount) + Number(total);
                $("#txtTotAfterTax" + cnt).val(totalAfterVat.RoundToSt(2));
                //}
            }
            ComputeTotals();
        });
        // text change
        $("#txtQuantity" + cnt).on('keyup', function () {
            debugger;
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
            var txtQuantityValue = $("#txtQuantity" + cnt).val();
            var txtPriceValueFc = $("#txtPriceFc" + cnt).val();
            var totalFc = Number(txtQuantityValue) * Number(txtPriceValueFc);
            $("#txtTotalFc" + cnt).val(Number(totalFc).toFixed(2));
            var txtPriceValue = $("#txtPriceFc" + cnt).val() * currencrRate;
            $("#txtPrice" + cnt).val(txtPriceValue);
            var total = Number(txtQuantityValue) * Number(txtPriceValue);
            $("#txtTotal" + cnt).val(total);
            var vatAmount = Number(total) * VatPrc / 100;
            $("#txtTax" + cnt).val(vatAmount);
            var totalAfterVat = Number(vatAmount) + Number(total);
            $("#txtTotAfterTax" + cnt).val(totalAfterVat.RoundToSt(2));
            ComputeTotals();
        });
        $("#txtPriceFc" + cnt).on('keyup', function () {
            debugger;
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
            var txtQuantityValue = $("#txtQuantity" + cnt).val();
            var txtPriceValueFc = $("#txtPriceFc" + cnt).val();
            var totalFc = Number(txtQuantityValue) * Number(txtPriceValueFc);
            $("#txtTotalFc" + cnt).val(Number(totalFc).toFixed(2));
            var txtPriceValue = $("#txtPriceFc" + cnt).val() * currencrRate;
            $("#txtPrice" + cnt).val(txtPriceValue);
            var total = Number(txtQuantityValue) * Number(txtPriceValue);
            $("#txtTotal" + cnt).val(total);
            var vatAmount = Number(total) * VatPrc / 100;
            $("#txtTax" + cnt).val(vatAmount);
            var totalAfterVat = Number(vatAmount) + Number(total);
            $("#txtTotAfterTax" + cnt).val(totalAfterVat.RoundToSt(2));
            debugger;
            ComputeTotals();
        });
        $("#btn_minus" + cnt).on('click', function () {
            DeleteRow(cnt);
        });
        if (SysSession.CurrentPrivileges.Remove) {
            $("#btn_minus" + cnt).removeClass("display_none");
            $("#btn_minus" + cnt).removeAttr("disabled");
        }
        else {
            $("#btn_minus" + cnt).addClass("display_none");
            $("#btn_minus" + cnt).attr("disabled", "disabled");
        }
        $("#txtQuantity" + cnt).change(function () {
            debugger;
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
            ComputeTotals();
        });
        $("#txtPrice" + cnt).change(function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
            ComputeTotals();
        });
        $("#txtAddons" + cnt).change(function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
            $("#txtTotAddons" + cnt).val((Number($("#txtAddons" + cnt).val()) + Number($("#txtPrice" + cnt).val())));
            ComputeTotals();
        });
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        if (ShowFlag == true) {
            // disabled
            $("#txtQuantity" + cnt).attr("disabled", "disabled");
            $("#txtQuantityReturnValue" + cnt).attr("disabled", "disabled");
            $("#txtPrice" + cnt).attr("disabled", "disabled");
            $("#txtPriceFc" + cnt).attr("disabled", "disabled");
            $("#txtAddons" + cnt).attr("disabled", "disabled");
            $("#txtTotAddons" + cnt).attr("disabled", "disabled");
            $("#txtTotal" + cnt).attr("disabled", "disabled");
            $("#txtTotalFc" + cnt).attr("disabled", "disabled");
            $("#txtTax" + cnt).attr("disabled", "disabled");
            $("#txtTotAfterTax" + cnt).attr("disabled", "disabled");
            $("#ddlFamily" + cnt).attr("disabled", "disabled");
            $("#ddlItem" + cnt).attr("disabled", "disabled");
            $('.btn-number1' + cnt).attr("disabled", "disabled");
            $('.input-number1' + cnt).attr("disabled", "disabled");
            $('.btn-number2' + cnt).attr("disabled", "disabled");
            $('.input-number2' + cnt).attr("disabled", "disabled");
            $("#btnAddDetails").addClass("display_none");
            $("#btn_minus" + cnt).addClass("display_none");
            $("#btn_minus" + cnt).attr("disabled", "disabled");
            //bind Data
            //$("#txt_StatusFlag" + cnt).val("u");
            for (var i = 0; i < FamilyDetails.length; i++) {
                $('#ddlFamily' + cnt).append('<option   value="' + FamilyDetails[i].ItemFamilyID + '">' + (lang == "ar" ? FamilyDetails[i].DescA : FamilyDetails[i].DescL) + '</option>');
            }
            var FamilyID = Number(ItemDetails[cnt].ItemFamilyID);
            $("#ddlFamily" + cnt).prop("value", FamilyID);
            FillddlItems(Number($('#ddlFamily' + cnt).val()), Number(ddlStoreHeader.value));
            for (var i = 0; i < ItemDetails.length; i++) {
                $('#ddlItem' + cnt).append('<option data-UomID="' + ItemDetails[i].UnitID + '"   value="' + ItemDetails[i].ItemID + '">' + (lang == "ar" ? ItemDetails[i].it_DescA : ItemDetails[i].It_DescE) + '</option>');
            }
            var itemcode = ItemDetails[cnt].ItemID;
            $("#UnitCost" + cnt).prop("value", ItemDetails[cnt].StockUnitCost);
            $("#ddlItem" + cnt).prop("value", itemcode.toString());
            $("#txtQuantity" + cnt).prop("value", ((ItemDetails[cnt].RecQty == null || undefined) ? 0 : ItemDetails[cnt].RecQty));
            $("#txtQuantityReturnValue" + cnt).prop("value", ((ItemDetails[cnt].TotRetQty == null || undefined) ? 0 : ItemDetails[cnt].TotRetQty));
            $("#txtPrice" + cnt).prop("value", (ItemDetails[cnt].RecUnitPrice == null || undefined) ? 0 : ItemDetails[cnt].RecUnitPrice.RoundToSt(2));
            $("#txtSerialH" + cnt).prop("value", (ItemDetails[cnt].Serial == null || undefined) ? 0 : ItemDetails[cnt].Serial.RoundToSt(2));
            $("#txtPriceFc" + cnt).prop("value", (ItemDetails[cnt].RecUnitPriceFC == null || undefined) ? 0 : ItemDetails[cnt].RecUnitPriceFC.RoundToSt(2));
            $("#txtAddons" + cnt).prop("value", (ItemDetails[cnt].UnitAddCost == null || undefined) ? 0 : ItemDetails[cnt].UnitAddCost.RoundToSt(2));
            $("#txtTotAddons" + cnt).prop("value", (ItemDetails[cnt].NetUnitCost == null || undefined) ? 0 : ItemDetails[cnt].NetUnitCost.RoundToSt(2));
            $("#txtTax" + cnt).prop("value", (ItemDetails[cnt].VatAmount == null || undefined) ? 0 : ItemDetails[cnt].VatAmount.RoundToSt(2));
            var price = ItemDetails[cnt].RecUnitPrice;
            var pricefc = ItemDetails[cnt].RecUnitPriceFC;
            var qutity = ItemDetails[cnt].RecQty;
            var total = price * qutity;
            var totalfc = pricefc * qutity;
            var tax = $("#txtTax" + cnt).val();
            var totalAfterTax = (Number(total) + Number(tax)).RoundToSt(2);
            $("#txtTotal" + cnt).prop("value", total);
            $("#txtTotalFc" + cnt).prop("value", totalfc.RoundToSt(2));
            $("#txtTotAfterTax" + cnt).prop("value", totalAfterTax);
            var ReciveDetailsID = ItemDetails[cnt].ReciveDetailsID;
            $("#ReciveDetailsID" + cnt).prop("value", ReciveDetailsID);
        }
        if (PurOrderShowFlag == true) {
            // disabled
            $("#txtQuantityReturnValue" + cnt).attr("disabled", "disabled");
            $("#txtAddons" + cnt).attr("disabled", "disabled");
            $("#txtTotAddons" + cnt).attr("disabled", "disabled");
            $("#txtTotal" + cnt).attr("disabled", "disabled");
            $("#txtTotalFc" + cnt).attr("disabled", "disabled");
            $("#txtPrice" + cnt).attr("disabled", "disabled");
            $("#txtTax" + cnt).attr("disabled", "disabled");
            $("#txtTotAfterTax" + cnt).attr("disabled", "disabled");
            $('.btn-number1' + cnt).removeAttr("disabled");
            $('.input-number1' + cnt).removeAttr("disabled");
            $('.btn-number2' + cnt).removeAttr("disabled");
            $('.input-number2' + cnt).removeAttr("disabled");
            //bind Data
            $("#txt_StatusFlag" + cnt).val("i");
            for (var i = 0; i < ItemFamilyDetails.length; i++) {
                $('#ddlFamily' + cnt).append('<option value="' + ItemFamilyDetails[i].ItemFamilyID + '">' + (lang == "ar" ? ItemFamilyDetails[i].Family_DescA : ItemFamilyDetails[i].Family_DescE) + '</option>');
            }
            var itemID = PurOrderDetailModel.IQ_GetPurchaseOrderDetail[cnt].ItemID;
            var ItemObj = ItemFamilyDetails.filter(function (s) { return s.ItemID == itemID; });
            $("#ddlFamily" + cnt).prop("value", ItemObj[0].ItemFamilyID);
            FillddlItems(ItemObj[0].ItemFamilyID, Number(ddlStoreHeader.value));
            for (var i = 0; i < ItemBaesdFamilyDetails.length; i++) {
                $('#ddlItem' + cnt).append('<option  value="' + ItemBaesdFamilyDetails[i].ItemID + '">' + (lang == "ar" ? ItemBaesdFamilyDetails[i].Itm_DescA : ItemBaesdFamilyDetails[i].Itm_DescE) + '</option>');
            }
            $("#ddlItem" + cnt).prop("value", PurOrderDetailModel.IQ_GetPurchaseOrderDetail[cnt].ItemID);
            $("#UnitCost" + cnt).prop("value", PurOrderDetailModel.IQ_GetPurchaseOrderDetail[cnt].StockUnitCost);
            //POQty – TotRecQty where POQty – TotRecQty> 0 
            var PurQuantity = PurOrderDetailModel.IQ_GetPurchaseOrderDetail[cnt].POQty - PurOrderDetailModel.IQ_GetPurchaseOrderDetail[cnt].TotRecQty;
            if (PurQuantity > 0) {
                $("#txtQuantity" + cnt).prop("value", PurQuantity);
            }
            else {
                $("#txtQuantity" + cnt).prop("value", 0);
            }
            $("#txtQuantityReturnValue" + cnt).prop("value", 0);
            $("#txtPrice" + cnt).prop("value", (PurOrderDetailModel.IQ_GetPurchaseOrderDetail[cnt].UnitPrice == null || undefined) ? 0 : PurOrderDetailModel.IQ_GetPurchaseOrderDetail[cnt].UnitPrice.RoundToSt(2));
            $("#txtTax" + cnt).prop("value", (ItemDetails[cnt].VatAmount == null || undefined) ? 0 : ItemDetails[cnt].VatAmount.RoundToSt(2));
            var price = PurOrderDetailModel.IQ_GetPurchaseOrderDetail[cnt].UnitPrice;
            var total = 0;
            if (PurQuantity > 0)
                total = price * PurQuantity;
            var tax = $("#txtTax" + cnt).val();
            var totalAfterTax = (Number(total) + Number(tax)).RoundToSt(2);
            $("#txtTotal" + cnt).prop("value", total);
            $("#txtTax" + cnt).prop("value", tax);
            $("#txtTotAfterTax" + cnt).prop("value", totalAfterTax);
            $("#ReciveDetailsID" + cnt).prop("value", 0);
        }
        $(".select_").select2();
        return;
    }
    function ComputeTotals() {
        var txtQuantityVal = 0;
        var txtPriceVal = 0;
        var Totallll = 0;
        var txtPriceValFc = 0;
        var TotalFc = 0;
        var txtTaxVal = 0;
        var txtTotAfterTaxVal = 0;
        var txtAddonsVal = 0;
        var FullAddons = 0;
        debugger;
        for (var i = 0; i < CountGrid; i++) {
            debugger;
            var flagvalue = $("#txt_StatusFlag" + i).val();
            if (flagvalue != "d" && flagvalue != "m") {
                txtQuantityVal += Number($("#txtQuantity" + i).val()); // عدد العبوات
                txtPriceVal = Number($("#txtPriceFc" + i).val() * currencrRate);
                Totallll += Number((Number($("#txtQuantity" + i).val()) * txtPriceVal));
                txtPriceValFc = Number($("#txtPriceFc" + i).val());
                TotalFc += Number((Number($("#txtQuantity" + i).val()) * txtPriceValFc).RoundToSt(2));
                txtTaxVal += Number($("#txtTax" + i).val());
                txtTotAfterTaxVal += Number($("#txtTotAfterTax" + i).val());
                txtAddonsVal += Number($("#txtAddons" + i).val());
                FullAddons += txtAddonsVal * txtQuantityVal;
            }
        }
        $("#txtLocalTotalFooter").val(TotalFc);
        var txtAddonsTot = Number($("#txtAddons").val());
        txtFamilyType.value = CountItems.toString(); //عدد الاصناف 
        $("#txtItemsNumber").val(txtQuantityVal); // عدد العبوات
        //  var FullAllPriceWithoutTaxVal = (txtAddonsTot + Total).RoundToSt(2);
        $("#txtTotalPurchaseWithoutTax").val((txtAddonsTot + Totallll).RoundToSt(2)); //مجمل التكلفة بدون ضريبة
        $("#txtTotal").val(Totallll);
        $("#txtTax").val(txtTaxVal.RoundToSt(2));
        $("#txtTotalFamily").val((txtTotAfterTaxVal).RoundToSt(2));
        var txtAddonsTaxValue = Number($("#txtAddonsTax").val());
        $("#txtTotalTax").val((txtTaxVal + txtAddonsTaxValue).RoundToSt(2));
        $("#txtAddons").val((FullAddons).RoundToSt(2));
        $("#txtAddonsTax").val(((FullAddons * VatPrc / 100)).RoundToSt(2));
        $("#txtTotalAddons").val((Number(FullAddons * VatPrc / 100) + Number(FullAddons)).RoundToSt(2));
        var txtValueChargeTot = Number($("#txtTotalAddons").val());
        var txtTotalVal = Number($("#txtTotalFamily").val());
        $("#txtTotalPurchaseWithTax").val((txtValueChargeTot + txtTotalVal).RoundToSt(2));
        ComputeTotalsCharge();
    }
    function checkRepeatedItems(itemValue, familyValue, NumberRowid) {
        var items = Number(CountGrid);
        var flag = false;
        for (var i = 0; i < items - 1; i++) {
            if (NumberRowid.toString() != "") {
                if (Number($("#ddlItem" + i).val()) == itemValue && Number($("#ddlFamily" + i).val()) == familyValue && Number($("#ReciveDetailsID" + i).val()) != NumberRowid) {
                    flag = true;
                }
            }
            else {
                if (Number($("#ddlItem" + i).val()) == itemValue && Number($("#ddlFamily" + i).val()) == familyValue) {
                    flag = true;
                }
            }
        }
        return flag;
    }
    function DeleteRow(RecNo) {
        if (!SysSession.CurrentPrivileges.Remove)
            return;
        WorningMessage("هل تريد الحذف؟", "Do you want to delete?", "تحذير", "worning", function () {
            $("#txt_StatusFlag" + RecNo).val() == 'i' ? $("#txt_StatusFlag" + RecNo).val('m') : $("#txt_StatusFlag" + RecNo).val('d');
            CountItems = CountItems - 1;
            $("#ddlFamily" + RecNo).val("Null");
            $("#ddlItem" + RecNo).val("Null");
            $("#txtQuantity" + RecNo).val("1");
            $("#txtPrice" + RecNo).val("1");
            $("#txtQuantityReturnValue" + RecNo).val("0");
            $("#txtAddons" + RecNo).val("0");
            $("#txtTotAddons" + RecNo).val("0");
            $("#txtTax" + RecNo).val("0");
            $("#No_Row" + RecNo).attr("hidden", "true");
            $("#txtCode" + RecNo).val("000");
            Insert_Serial();
            ComputeTotals();
        });
    }
    function Insert_Serial() {
        debugger;
        var Chack_Flag = false;
        var flagval = "";
        var Ser = 1;
        for (var i = 0; i < CountGrid; i++) {
            flagval = $("#txt_StatusFlag" + i).val();
            if (flagval != "d" && flagval != "m") {
                $("#txtSerialH" + i).val(Ser);
                Ser++;
            }
            if (flagval == 'd' || flagval == 'm') {
                Chack_Flag = true;
            }
            if (Chack_Flag) {
                if ($("#txt_StatusFlag" + i).val() != 'i' && $("#txt_StatusFlag" + i).val() != 'm' && $("#txt_StatusFlag" + i).val() != 'd') {
                    $("#txt_StatusFlag" + i).val('u');
                }
            }
        }
    }
    //---------------------------------------------------------------- Charges Grid Controls  region----------------------------------------------------
    function AddNewRowCharge() {
        if (!SysSession.CurrentPrivileges.AddNew)
            return;
        var CanAddCharge = true;
        if (CountGridCharge > 0) {
            var LastRowNoCharge = CountGridCharge - 1;
            CanAddCharge = ValidationCharge_Grid(LastRowNoCharge);
        }
        if (CanAddCharge) {
            Vendor_list = filterVendorDetails.filter(function (x) { return x.Isactive == true; });
            CountItemsCharge = CountItemsCharge + 1;
            BuildControlsCharges(CountGridCharge);
            $("#txt_StatusFlag1" + CountGridCharge).val("i"); //In Insert mode
            $("#btn_minus1" + CountGridCharge).removeClass("display_none");
            $("#btn_minus1" + CountGridCharge).removeAttr("disabled");
            ComputeTotalsCharge();
            CountGridCharge++;
            Insert_SerialCharge();
        }
    }
    function BuildControlsCharges(cnt) {
        var html;
        html = "<tr id= \"No_Row1" + cnt + "\">\n                    <input id=\"ReceiveExpensesID" + cnt + "\" type=\"hidden\" class=\"form-control display_none\"  />\n\t                <th>\n\t\t                <div class=\"form-group\">\n\t\t\t                <span id=\"btn_minus1" + cnt + "\"><i class=\"fas fa-minus-circle fs-4 btn-minus\"></i></span>\n\t\t                </div>\n\t                </th>\n                    <th>\n\t\t                <div class=\"form-group\">\n                            <input id=\"txtSerial" + cnt + "\" type=\"text\" class=\"form-control\" disabled value=\"" + CountItemsCharge + "\"/>\n\t\t                </div>\n\t                </th>\n                     <th>\n\t\t                <div class=\"form-group\">\n                            <select id=\"txtAddonsCharge" + cnt + "\" class=\"form-control\" value=\"null\" ></select>\n\t\t                </div>\n\t                </th>\n                     <th>\n\t\t                <div class=\"form-group\">\n\t\t\t                <input id=\"txtAddonsTypeCharge" + cnt + "\" type=\"text\" class=\"form-control\" disabled value=\" \"/>\n\t\t                </div>\n\t                </th>\n                    <th>\n\t\t                <div class=\"form-group\">\n\t\t\t                <input id=\"txtValueCharge" + cnt + "\" type=\"text\" class=\"form-control\"  value=\"0\"/>\n\t\t                </div>\n\t                </th>\n                    <th>\n\t\t                <div class=\"form-group\">\n                            <select id=\"txtVatType" + cnt + "\" class=\"form-control \" value=\"null\" ></select>\n\t\t                </div>\n\t                </th>\n                    <th>\n\t\t                <div class=\"form-group\">\n                            <input id=\"txtVatCharge" + cnt + "\" type=\"text\" disabled value=\"0\" class=\"form-control \"  />\n\t\t                </div>\n\t                </th>\n                    <th>\n\t\t                <div class=\"form-group\">\n                            <input id=\"txtValueAfterVatCharge" + cnt + "\" type=\"text\" disabled class=\"form-control\"   value=\"0\" />\n\t\t                </div>\n\t                </th>\n                    <th>\n\t\t                <div class=\"form-group\">\n                            <select id=\"txtVendorIsCheckCharge" + cnt + "\" class=\"form-control\"  ></select>\n\t\t                </div>\n\t                </th>\n                    <th>\n\t\t                <div class=\"form-group\">\n                            <input id=\"txtInvoiceNumberCharge" + cnt + "\" type=\"text\" class=\"form-control\"  value=\"0\"/>\n\t\t                </div>\n\t                </th>\n                    <th>\n\t\t                <div class=\"form-group\">\n                            <input id=\"txtInvoiceDateCharge" + cnt + "\" type=\"date\" class=\"form-control\"  />\n\t\t                </div>\n\t                </th>\n                    <th>\n\t\t                <div class=\"form-group\">\n                            <select id=\"txtVendorCharge" + cnt + "\" class=\"form-control\"  ></select>\n\t\t                </div>\n\t                </th>\n                    <th>\n\t\t                <div class=\"form-group\">\n                            <select id=\"txt_D_CashBox" + cnt + "\" name=\"\"  disabled=\"disabled\" class=\"form-control\" tabindex=\"-1\" aria-hidden=\"true\">\n                             <option value=\"Null\">" + (lang == "ar" ? "الصنوق" : "CashBox") + "  </option>\n                            </select>\n\t\t                </div>\n\t                </th>\n                    <input id=\"txt_StatusFlag1" + cnt + "\" name = \" \" type = \"hidden\" class=\"form-control\"/>\n                    <input id=\"txt_ID1" + cnt + "\" name = \" \" type = \"hidden\" class=\"form-control\" />;\n\n                </tr>";
        //html = '<div id= "No_Row1' + cnt + '" class="style_border" > <div class="row" > <div class="col-xs-12 gridPurTrReceive" > ' +
        //    '<span id="btn_minus1' + cnt + '" class="fa fa-minus-circle fontitm4PurTrReceive "></span>' +
        //    '<div class="col-xs-1">' +
        //    '<input id="ReceiveExpensesID' + cnt + '" type="hidden" class="form-control input-sm right2 display_none"  />' +
        //    '<input id="txtSerial' + cnt + '" type="text" class="form-control input-sm right2" disabled value="' + (CountItemsCharge) + '"/></div>' +
        //    '<div class="col-xs-2">' +
        //    '<select id="txtAddonsCharge' + cnt + '" class="form-control input-sm" value="null" ></select></div>' +
        //    '<div class="col-xs-1">' +
        //    '<input id="txtAddonsTypeCharge' + cnt + '" type="text" class="form-control input-sm right2" disabled value=" "/></div>' +
        //    '<div class="col-xs-1">' +
        //    '<input id="txtValueCharge' + cnt + '" type="text"   class="form-control input-sm right2"  value="0"/></div>' +
        //    '<div class="col-xs-2">' +
        //    '<select id="txtVatType' + cnt + '" class="form-control input-sm" value="null" ></select></div>' +
        //    '<div class="col-xs-1">' +
        //    '<input id="txtVatCharge' + cnt + '" type="text" disabled value="0" class="form-control input-sm right2"  /></div>' +
        //    '<div class="col-xs-1">' +
        //    '<input id="txtValueAfterVatCharge' + cnt + '" type="text" disabled class="form-control input-sm right2"   value="0" /></div>' +
        //    '<div class="col-xs-1"style="width: 12%!important;">' +
        //    '<select id="txtVendorIsCheckCharge' + cnt + '" class="form-control input-sm"  ></select></div>' +
        //    '<div class="col-xs-1">' +
        //    '<input id="txtInvoiceNumberCharge' + cnt + '" type="text" class="form-control input-sm right2"  value="0"/></div>' +
        //    '</div>' +
        //    '<div class="col-xs-2 txtInvoiceDateCharge">' +
        //    '<input id="txtInvoiceDateCharge' + cnt + '" type="date" class="form-control input-sm right2"  /></div>' +
        //    '<div class="col-xs-2 txtVendorCharge">' +
        //    '<select id="txtVendorCharge' + cnt + '" class="form-control input-sm"  ></select></div>' +
        //    '<div class="col-xs-2 txt_D_CashBox ">' +
        //    '<select id="txt_D_CashBox' + cnt + '" name=""  disabled="disabled" class="form-control input-sm   " tabindex="-1" aria-hidden="true"><option value="Null"> ' + (lang == "ar" ? "الصنوق" : "CashBox") + '  </option></select></div>' +
        //    ' </div></div>' +
        //    '<input id="txt_StatusFlag1' + cnt + '" name = " " type = "hidden" class="form-control input-sm"/><input id="txt_ID1' + cnt + '" name = " " type = "hidden" class="form-control input-sm" />';
        $("#div_ChargesData").append(html);
        $("#txtInvoiceDateCharge" + cnt).val(DateFormat(GetCurrentDate().toString()));
        $("#txtInvoiceDateCharge" + cnt).val(GetDate());
        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar")
            $('#txtVendorCharge' + cnt).append('<option value="null">' + "اختر" + '</option>');
        else
            $('#txtVendorCharge' + cnt).append('<option value="null">' + "Choose" + '</option>');
        for (var i = 0; i < Vendor_list.length; i++) {
            if (SysSession.CurrentEnvironment.ScreenLanguage == "ar")
                $('#txtVendorCharge' + cnt).append('<option value="' + Vendor_list[i].VendorID + '">' + Vendor_list[i].NAMEA + '</option>');
            else
                $('#txtVendorCharge' + cnt).append('<option value="' + Vendor_list[i].VendorID + '">' + Vendor_list[i].NAMEL + '</option>');
        }
        for (var i = 0; i < CashboxDetails.length; i++) {
            $('#txt_D_CashBox' + cnt).append('<option value="' + CashboxDetails[i].CashBoxID + '">' + (lang == "ar" ? CashboxDetails[i].CashBox_DescA : CashboxDetails[i].CashBox_DescE) + '</option>');
        }
        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar")
            $('#txtVatType' + cnt).append('<option value="null">' + "اختر" + '</option>');
        else
            $('#txtVatType' + cnt).append('<option value="null">' + "Choose" + '</option>');
        for (var i = 0; i < VatTypeData.length; i++) {
            if (SysSession.CurrentEnvironment.ScreenLanguage == "ar")
                $('#txtVatType' + cnt).append('<option value="' + VatTypeData[i].CODE + '">' + VatTypeData[i].DESCRIPTION + '</option>');
            else
                $('#txtVatType' + cnt).append('<option value="' + VatTypeData[i].CODE + '">' + VatTypeData[i].DESCRIPTION + '</option>');
        }
        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar")
            $('#txtAddonsCharge' + cnt).append('<option value="null">' + "اختر" + '</option>');
        else
            $('#txtAddonsCharge' + cnt).append('<option value="null">' + "Choose" + '</option>');
        for (var i = 0; i < AddonsData.length; i++) {
            if (SysSession.CurrentEnvironment.ScreenLanguage == "ar")
                $('#txtAddonsCharge' + cnt).append('<option value="' + AddonsData[i].ChargeID + '">' + AddonsData[i].DESCA + '</option>');
            else
                $('#txtAddonsCharge' + cnt).append('<option value="' + AddonsData[i].ChargeID + '">' + AddonsData[i].DESCL + '</option>');
        }
        var drop = '#txtAddonsCharge' + cnt;
        $(drop).change(function () {
            if ($("#txt_StatusFlag1" + cnt).val() != "i")
                $("#txt_StatusFlag1" + cnt).val("u");
            var Addons = Number($(drop + ' option:selected').attr('value'));
            if (isNaN(Addons)) {
                $("#txtAddonsTypeCharge" + cnt).val(" ");
            }
            else {
                var addTypeobj = AddonsData.filter(function (s) { return s.ChargeID == Addons; });
                var addType = addTypeobj[0].IsAddition;
                if (addType == true) {
                    $("#txtAddonsTypeCharge" + cnt).val("اضافة");
                }
                else {
                    $("#txtAddonsTypeCharge" + cnt).val("خصم");
                }
            }
            ComputeTotalsCharge();
        });
        FillddlIsCashType(cnt);
        $("#txtVendorCharge" + cnt).change(function () {
            if ($("#txt_StatusFlag1" + cnt).val() != "i")
                $("#txt_StatusFlag1" + cnt).val("u");
        });
        $("#txtVatType" + cnt).change(function () {
            if ($("#txt_StatusFlag1" + cnt).val() != "i")
                $("#txt_StatusFlag1" + cnt).val("u");
            var selectedItem = $("#txtVatType" + cnt + ' option:selected').attr('value');
            if (selectedItem != "null") {
                var Code = Number(selectedItem);
                var NumberSelect = VatTypeData.filter(function (s) { return s.CODE == Code; });
                $("#txtVatType" + cnt).attr('data-VatPerc', NumberSelect[0].VatPerc);
                var vatPercentage = Number(NumberSelect[0].VatPerc);
                var amount = Number($("#txtValueCharge" + cnt).val());
                if (amount >= 0) {
                    var vatAmount = (vatPercentage * amount) / 100;
                    $("#txtVatCharge" + cnt).val(vatAmount.RoundToSt(2));
                    $("#txtValueAfterVatCharge" + cnt).val((vatAmount + amount).RoundToSt(2));
                }
                else {
                    $("#txtVatCharge" + cnt).val("0");
                    $("#txtValueAfterVatCharge" + cnt).val("0");
                }
            }
            else {
                $("#txtVatCharge" + cnt).val("0");
                $("#txtValueAfterVatCharge" + cnt).val("0");
            }
            ComputeTotalsCharge();
            //
        });
        // text change
        $("#txt_D_CashBox" + cnt).on('change', function () {
            if ($("#txt_StatusFlag1" + cnt).val() != "i")
                $("#txt_StatusFlag1" + cnt).val("u");
        });
        $("#txtInvoiceNumberCharge" + cnt).on('change', function () {
            if ($("#txt_StatusFlag1" + cnt).val() != "i")
                $("#txt_StatusFlag1" + cnt).val("u");
        });
        $("#txtInvoiceDateCharge" + cnt).on('change', function () {
            if ($("#txt_StatusFlag1" + cnt).val() != "i")
                $("#txt_StatusFlag1" + cnt).val("u");
        });
        $("#txtValueCharge" + cnt).on('change', function () {
            if ($("#txt_StatusFlag1" + cnt).val() != "i")
                $("#txt_StatusFlag1" + cnt).val("u");
            var selectedItem = $("#txtVatType" + cnt + ' option:selected').attr('value');
            if (selectedItem != "null") {
                var Code = Number(selectedItem);
                var NumberSelect = VatTypeData.filter(function (s) { return s.CODE == Code; });
                var vatPercentage = Number(NumberSelect[0].VatPerc);
                var amount = Number($("#txtValueCharge" + cnt).val());
                if (amount >= 0) {
                    var vatAmount = (vatPercentage * amount) / 100;
                    $("#txtVatCharge" + cnt).val(vatAmount.RoundToSt(2));
                    $("#txtValueAfterVatCharge" + cnt).val((vatAmount + amount).RoundToSt(2));
                }
                else {
                    $("#txtVatCharge" + cnt).val("0");
                    $("#txtValueAfterVatCharge" + cnt).val("0");
                }
            }
            else {
                $("#txtVatCharge" + cnt).val("0");
                $("#txtValueAfterVatCharge" + cnt).val("0");
            }
            ComputeTotalsCharge();
        });
        $("#btn_minus1" + cnt).on('click', function () {
            DeleteRowCharge(cnt);
        });
        if (SysSession.CurrentPrivileges.Remove) {
            $("#btn_minus1" + cnt).removeClass("display_none");
            $("#btn_minus1" + cnt).removeAttr("disabled");
        }
        else {
            $("#btn_minus1" + cnt).addClass("display_none");
            $("#btn_minus1" + cnt).attr("disabled", "disabled");
        }
        $("#txtVendorIsCheckCharge" + cnt).on('change', function () {
            //
            if ($("#txt_StatusFlag1" + cnt).val() != "i")
                $("#txt_StatusFlag1" + cnt).val("u");
            if ($("#txtVendorIsCheckCharge" + cnt).val() == 1) {
                $("#txt_D_CashBox" + cnt).prop("disabled", false);
            }
            else {
                $("#txt_D_CashBox" + cnt).prop("disabled", true);
                $("#txt_D_CashBox" + cnt).prop("value", "Null");
            }
        });
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        if (ShowFlag == true) {
            // disabled
            $("#txtSerial" + cnt).attr("disabled", "disabled");
            $("#txtAddonsCharge" + cnt).attr("disabled", "disabled");
            $("#txtAddonsTypeCharge" + cnt).attr("disabled", "disabled");
            $("#txtValueCharge" + cnt).attr("disabled", "disabled");
            $("#txtVatType" + cnt).attr("disabled", "disabled");
            $("#txtVatCharge" + cnt).attr("disabled", "disabled");
            $("#txtValueAfterVatCharge" + cnt).attr("disabled", "disabled");
            $("#txtVendorIsCheckCharge" + cnt).attr("disabled", "disabled");
            $("#txtInvoiceNumberCharge" + cnt).attr("disabled", "disabled");
            $("#txtInvoiceDateCharge" + cnt).attr("disabled", "disabled");
            $("#txtVendorCharge" + cnt).attr("disabled", "disabled");
            $("#txt_D_CashBox" + cnt).attr("disabled", "disabled");
            $("#btnAddDetailsCharge").addClass("display_none");
            $("#btn_minus1" + cnt).addClass("display_none");
            $("#btn_minus1" + cnt).attr("disabled", "disabled");
            //bind Data
            $("#txt_StatusFlag1" + cnt).val("u");
            $("#txtSerial" + cnt).prop("value", (PurReceiveChargeData[cnt].Serial == null || undefined) ? 0 : PurReceiveChargeData[cnt].Serial);
            $("#txtValueCharge" + cnt).prop("value", (PurReceiveChargeData[cnt].Amount == null || undefined) ? 0 : PurReceiveChargeData[cnt].Amount);
            $("#txtVatCharge" + cnt).prop("value", (PurReceiveChargeData[cnt].VatAmount == null || undefined) ? 0 : PurReceiveChargeData[cnt].VatAmount);
            $("#txtValueAfterVatCharge" + cnt).prop("value", ((PurReceiveChargeData[cnt].NetAtferVat == null || undefined) ? 0 : PurReceiveChargeData[cnt].NetAtferVat));
            $("#txtInvoiceDateCharge" + cnt).prop("value", ((PurReceiveChargeData[cnt].RefInvoiceDate == null || undefined) ? "" : PurReceiveChargeData[cnt].RefInvoiceDate));
            $("#txtInvoiceNumberCharge" + cnt).prop("value", (PurReceiveChargeData[cnt].RefInvoiceNo == null || undefined) ? 0 : PurReceiveChargeData[cnt].RefInvoiceNo);
            //GetAddonsData();
            //addons
            for (var i = 0; i < AddonsData.length; i++) {
                if (SysSession.CurrentEnvironment.ScreenLanguage == "ar")
                    $('#txtAddonsCharge' + cnt).append('<option value="' + AddonsData[i].ChargeID + '">' + AddonsData[i].DESCA + '</option>');
                else
                    $('#txtAddonsCharge' + cnt).append('<option value="' + AddonsData[i].ChargeID + '">' + AddonsData[i].DESCL + '</option>');
            }
            $("#txtAddonsCharge" + cnt).val(PurReceiveChargeData[cnt].ChargeID);
            //addons type
            PurReceiveChargeData[cnt].IsAddition;
            FillddlAddonsType(cnt);
            $("#txtAddonsTypeCharge" + cnt).val(PurReceiveChargeData[cnt].IsAddition ? "اضافة" : "خصم");
            //GetVatType();
            ///VatType
            for (var i = 0; i < VatTypeData.length; i++) {
                if (SysSession.CurrentEnvironment.ScreenLanguage == "ar")
                    $('#txtVatType' + cnt).append('<option value="' + VatTypeData[i].CODE + '">' + VatTypeData[i].DESCRIPTION + '</option>');
                else
                    $('#txtVatType' + cnt).append('<option value="' + VatTypeData[i].CODE + '">' + VatTypeData[i].DESCRIPTION + '</option>');
            }
            $("#txtVatType" + cnt).val(PurReceiveChargeData[cnt].VatType);
            $("#txtVatType" + cnt).attr('data-VatPerc', PurReceiveChargeData[cnt].VatPrc);
            //IsCash
            //FillddlIsCashType(cnt);
            $("#txtVendorIsCheckCharge" + cnt).val(PurReceiveChargeData[cnt].isPaidByVendor ? "0" : "1");
            var ReceiveExpensesID = PurReceiveChargeData[cnt].ReceiveExpensesID;
            $("#ReceiveExpensesID" + cnt).prop("value", ReceiveExpensesID);
            //Vendor
            if (PurReceiveChargeData[cnt].CashBoxID != null && PurReceiveChargeData[cnt].CashBoxID != 0) {
                $("#txt_D_CashBox" + cnt).val(PurReceiveChargeData[cnt].CashBoxID);
            }
            if (PurReceiveChargeData[cnt].VendorID != null && PurReceiveChargeData[cnt].VendorID != 0) {
                $("#txtVendorCharge" + cnt).val(PurReceiveChargeData[cnt].VendorID);
            }
            ComputeTotalsCharge();
        }
        return;
    }
    function DeleteRowCharge(RecNo) {
        if (!SysSession.CurrentPrivileges.Remove)
            return;
        WorningMessage("هل تريد الحذف؟", "Do you want to delete?", "تحذير", "worning", function () {
            $("#txt_StatusFlag1" + RecNo).val() == 'i' ? $("#txt_StatusFlag1" + RecNo).val('m') : $("#txt_StatusFlag1" + RecNo).val('d');
            CountItemsCharge = CountItemsCharge - 1;
            ComputeTotalsCharge();
            $("#txtAddonsCharge" + RecNo).val("Null");
            $("#txtSerial" + RecNo).val("0");
            $("#txtValueCharge" + RecNo).val("0");
            $("#txtVatType" + RecNo).val("Null");
            $("#txtVatCharge" + RecNo).val("0");
            $("#txtValueAfterVatCharge" + RecNo).val("0");
            $("#txtVendorIsCheckCharge" + RecNo).val("0");
            $("#txtInvoiceNumberCharge" + RecNo).val("0");
            $("#txtInvoiceDateCharge" + RecNo).val("0");
            $("#txtVendorCharge" + RecNo).val("Null");
            $("#No_Row1" + RecNo).attr("hidden", "true");
            $("#txtCode1" + RecNo).val("000");
            //////////////
            Insert_SerialCharge();
            /////////////
        });
    }
    function ComputeTotalsCharge() {
        var txtValueChargeTot = 0;
        var txtVatChargeTot = 0;
        var txtTotalAddonsTot = 0;
        for (var i = 0; i < CountGridCharge; i++) {
            var flagvalue = $("#txt_StatusFlag1" + i).val();
            if (flagvalue != "d" && flagvalue != "m") {
                if ($("#txtAddonsTypeCharge" + i).val() == "اضافة") {
                    txtValueChargeTot += Number($("#txtValueCharge" + i).val());
                    txtVatChargeTot += Number($("#txtVatCharge" + i).val());
                    txtTotalAddonsTot += txtVatChargeTot + txtValueChargeTot;
                }
                else {
                    txtValueChargeTot -= Number($("#txtValueCharge" + i).val());
                    txtVatChargeTot -= Number($("#txtVatCharge" + i).val());
                    txtTotalAddonsTot = txtTotalAddonsTot - (txtVatChargeTot + txtValueChargeTot);
                }
            }
        }
        $("#txtAddons").val((txtValueChargeTot).RoundToSt(2));
        $("#txtAddonsTax").val((txtVatChargeTot).RoundToSt(2));
        $("#txtTotalAddons").val((txtValueChargeTot + txtVatChargeTot).RoundToSt(2));
        //
        var tottxtTotal = Number($("#txtTotal").val());
        $("#txtTotalPurchaseWithoutTax").val((txtValueChargeTot + tottxtTotal).RoundToSt(2));
        var txtValueChargeTot = Number($("#txtTotalAddons").val());
        var txtTotalVal = Number($("#txtTotalFamily").val());
        $("#txtTotalPurchaseWithTax").val((txtValueChargeTot + txtTotalVal).RoundToSt(2));
        var txtTaxlVal = Number($("#txtTax").val());
        $("#txtTotalTax").val((txtTaxlVal + txtVatChargeTot).RoundToSt(2));
    }
    function Insert_SerialCharge() {
        debugger;
        var Chack_Flag = false;
        var flagval = "";
        var Ser = 1;
        for (var i = 0; i < CountGridCharge; i++) {
            flagval = $("#txt_StatusFlag1" + i).val();
            if (flagval != "d" && flagval != "m") {
                $("#txtSerial" + i).val(Ser);
                Ser++;
            }
            if (flagval == 'd' || flagval == 'm') {
                Chack_Flag = true;
            }
            if (Chack_Flag) {
                if ($("#txt_StatusFlag1" + i).val() != 'i' && $("#txt_StatusFlag1" + i).val() != 'm' && $("#txt_StatusFlag1" + i).val() != 'd') {
                    $("#txt_StatusFlag1" + i).val('u');
                }
            }
        }
    }
    //---------------------------------------------------------------- Validation && Clear && Enable && disable  region----------------------------------------------------
    function clear() {
        currencrRate = 1;
        $("#div_Data").html('');
        $("#div_ChargesData").html('');
        $("#txtTotalPurchaseWithoutTax").prop("value", "");
        $("#txtTotalTax").prop("value", "");
        $("#txtTotalPurchaseWithTax").prop("value", "");
        $("#btnPrintTransaction").addClass("display_none");
        $("#btnPrintTransaction").addClass("display_none");
        CountGrid = 0;
        CountGridCharge = 0;
        CountItems = 0;
        CountItemsCharge = 0;
        $("#txtLocalTotalFooter").val("0");
        txtCurrencyRate.value = "0";
        txtFamilyType.value = "0";
        txtTotal.value = "0";
        txtAddons.value = "0";
        txtItemsNumber.value = "0";
        txtTax.value = "0";
        txtAddonsTax.value = "0";
        txtTotalFamily.value = "0";
        txtTotalAddons.value = "0";
        txtPurOrderNum.value = "";
        $("#txtDateHeader").val(GetDate());
        txtVendorName.value = "";
        ddlSalesmanHeader.value = "null";
        lblInvoiceNumber.innerText = "";
        ddlTaxTypeHeader.value = "null";
        txtNotes.value = "";
        $("#ddlIsCash").prop("value", "0");
        $('#ddlCashBoxH').removeAttr('disabled');
        ddlReciveTypeHeader.value = "null";
        VendorRecieptID.value = "";
        chkActive.checked = false;
        chkActive.disabled = false;
        $("#txtCreatedAt").prop("value", "");
        $("#txtCreatedBy").prop("value", "");
        $("#txtUpdatedAt").prop("value", "");
        $("#txtUpdatedBy").prop("value", "");
    }
    function ValidationHeader() {
        var newCount = 0;
        for (var i = 0; i < CountGrid; i++) {
            if ($("#txt_StatusFlag" + i).val() != "d" && $("#txt_StatusFlag" + i).val() != "m") {
                newCount++;
            }
        }
        if (!CheckDate(DateFormat(txtDateHeader.value).toString(), DateFormat(SysSession.CurrentEnvironment.StartDate).toString(), DateFormat(SysSession.CurrentEnvironment.EndDate).toString())) {
            DisplayMassage('  التاريخ ليس متطابق مع تاريخ السنه (' + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ')', 'The date does not match the date of the year' + DateFormat(SysSession.CurrentEnvironment.StartDate).toString(), MessageType.Error);
            return false;
        }
        else if (txtVendorName.value == "") {
            DisplayMassage(" برجاء اختيار المورد", "Please select a supplier", MessageType.Error);
            Errorinput(txtVendorName);
            return false;
        }
        else if (ddlSalesmanHeader.value == "null") {
            DisplayMassage(" برجاء اختيار المندوب", "Please select the salesman", MessageType.Error);
            Errorinput(ddlSalesmanHeader);
            return false;
        }
        else if (ddlIsCash.value == "null") {
            DisplayMassage(" برجاء اختيار طريقه الدفع", "Please choose a payment method", MessageType.Error);
            Errorinput(ddlIsCash);
            return false;
        }
        else if (ddlIsCash.value == "1" && ddlCashBoxH.value == "null") {
            DisplayMassage(" برجاء اختيار الصندوق", "Please choose a Cashbox", MessageType.Error);
            Errorinput(ddlCashBoxH);
            return false;
        }
        else if (ddlReciveTypeHeader.value == "null") {
            DisplayMassage(" برجاءاختيار  نوع الاستلام", "Please choose the type of receipt", MessageType.Error);
            Errorinput(ddlReciveTypeHeader);
            return false;
        }
        else if (ddlTaxTypeHeader.value == "null") {
            DisplayMassage(" برجاء اختيار نوع الضريبة", "Please select a tax type", MessageType.Error);
            Errorinput(ddlTaxTypeHeader);
            return false;
        }
        else if (VendorRecieptID.value == "") {
            DisplayMassage(" برجاء  ادخال رقم فاتورة المورد", "Please enter the vendor invoice number", MessageType.Error);
            Errorinput(VendorRecieptID);
            return false;
        }
        else if (txtCurrencyRate.value == "") {
            DisplayMassage(" برجاء  ادخال معامل التحويل", "Please enter Currency rate", MessageType.Error);
            Errorinput(txtCurrencyRate);
            return false;
        }
        else if (Number($('#txtFamilyType').val()) == 0) {
            DisplayMassage(" برجاء ادخال بيانات الفاتورة", "Please enter the billing information", MessageType.Error);
            return false;
        }
        else if (!CheckPeriodDate(txtDateHeader.value, "I")) {
            debugger;
            DisplayMassage("لا يمكنك الاضافه او التعديل في هذة الفتره المغلقه ", "Please select a Invoice data", MessageType.Error);
            Errorinput(txtDateHeader);
            return false;
        }
        return true;
    }
    function Validation_Grid(rowcount) {
        if ($("#txt_StatusFlag" + rowcount).val() == "d" || $("#txt_StatusFlag" + rowcount).val() == "m") {
            return true;
        }
        else {
            var RequiredQty = Number($("#txtQuantity" + rowcount).val());
            var PriceVal = Number($("#txtPrice" + rowcount).val());
            if ($("#ddlFamily" + rowcount).val() == "" || $("#ddlFamily" + rowcount).val() == "null") {
                DisplayMassage(" برجاءادخال النوع", "Please enter the type", MessageType.Error);
                Errorinput($("#ddlFamily" + rowcount));
                return false;
            }
            else if ($("#ddlItem" + rowcount).val() == " " || $("#ddlItem" + rowcount).val() == "null") {
                DisplayMassage(" برجاءادخال الصنف", "Please enter the item", MessageType.Error);
                Errorinput($("#ddlItem" + rowcount));
                return false;
            }
            else if (RequiredQty == 0) {
                DisplayMassage(" برجاءادخال الكمية", "Please enter the quantity", MessageType.Error);
                Errorinput($("#txtQuantity" + rowcount));
                return false;
            }
            else if (PriceVal == 0) {
                DisplayMassage(" برجاءادخال السعر", "Please enter the price", MessageType.Error);
                Errorinput($("#txtPrice" + rowcount));
                return false;
            }
            return true;
        }
    }
    function ValidationCharge_Grid(rowcount) {
        if ($("#txt_StatusFlag1" + rowcount).val() == "d" || $("#txt_StatusFlag1" + rowcount).val() == "m") {
            return true;
        }
        else {
            var chargeVal = Number($("#txtValueCharge" + rowcount).val());
            if ($("#txtAddonsCharge" + rowcount).val() == "null") {
                DisplayMassage(" برجاء اختيار الإضافة", "Please enter the Adds", MessageType.Error);
                Errorinput($("#txtAddonsCharge" + rowcount));
                return false;
            }
            else if (chargeVal == 0) {
                DisplayMassage(" برجاء اختيار قيمة الاضافة", "Please enter the Adds on value", MessageType.Error);
                Errorinput($("#txtValueCharge" + rowcount));
                return false;
            }
            else if ($("#txtAddonsTypeCharge" + rowcount).val() == "null") {
                DisplayMassage(" برجاء اختيار نوع الإضافة", "Please enter the Adds on Type", MessageType.Error);
                Errorinput($("#txtAddonsTypeCharge" + rowcount));
                return false;
            }
            else if ($("#txtVatType" + rowcount).val() == "null") {
                DisplayMassage(" برجاء اختيار نوع الضريبة", "Please enter the tax type", MessageType.Error);
                Errorinput($("#txtVatType" + rowcount));
                return false;
            }
            else if ($("#txtVendorCharge" + rowcount).val() == "null") {
                DisplayMassage(" برجاءاختيارالمورد في جدول الاضافات", "Please choose the vendor in the additions table", MessageType.Error);
                Errorinput($("#txtVendorCharge" + rowcount));
                return false;
            }
            else if ($("#txt_D_CashBox" + rowcount).val() == "Null" && $("#txtVendorIsCheckCharge" + rowcount).val() == "1" && ($("#txt_StatusFlag1" + rowcount).val() != 'd') && ($("#txt_StatusFlag1" + rowcount).val() != 'm')) {
                DisplayMassage(" برجاء اختيار الصندوق", "please choose the cashbox", MessageType.Error);
                Errorinput($("#txt_D_CashBox" + rowcount));
                return false;
            }
        }
        return true;
    }
    function EnableControls() {
        debugger;
        $("#divDetails").removeClass("display_none");
        $("#divDetails").removeClass("display_none");
        $("#divEdit").removeClass("display_none");
        $("#divTotalSatistics").removeClass("display_none");
        $("#DivFilter").addClass("disabledDiv");
        $("#divIconbar").addClass("disabledIconbar");
        $("#divMasterGridiv").addClass("disabledDiv");
        $("#divDetails :input").removeAttr("disabled");
        $("#divTotalSatistics :input").attr("disabled", "disabled");
        $("#btnAddDetails").removeClass("display_none");
        $("#btnAddDetailsCharge").removeClass("display_none");
        $("#btnPrintTransaction").addClass("display_none");
        $("#btnPrintTransaction").addClass("display_none");
        //$("#btnPrintInvoicePrice").addClass("display_none");
        $("#btnUpdate").addClass("display_none");
        $("#btnBack").removeClass("display_none");
        $("#btnSave").removeClass("display_none");
        for (var i = 0; i < CountGrid; i++) {
            $("#txtQuantityReturnValue" + i).prop("disabled", true);
            $("#txtAddons" + i).prop("disabled", true);
            $("#txtTotAddons" + i).prop("disabled", true);
            $("#txtTotal" + i).prop("disabled", true);
            $("#txtTotalFc" + i).prop("disabled", true);
            $("#txtPrice" + i).prop("disabled", true);
            $("#txtTax" + i).prop("disabled", true);
            $("#txtTotAfterTax" + i).prop("disabled", true);
            $("#btn_minus" + i).removeClass("display_none");
            $("#btn_minus" + i).removeAttr("disabled");
        }
        for (var i = 0; i < CountGridCharge; i++) {
            $("#txtSerial" + i).prop("disabled", true);
            $("#txtVatCharge" + i).prop("disabled", true);
            $("#txtValueAfterVatCharge" + i).prop("disabled", true);
            $("#txtAddonsTypeCharge" + i).prop("disabled", true);
            $("#btn_minus1" + i).removeClass("display_none");
            $("#btn_minus1" + i).removeAttr("disabled");
        }
        txtNotes.disabled = false;
        txtPurOrderNum.disabled = true;
        txtVendorName.disabled = true;
        txtDateHeader.disabled = false;
        //txtCurrencyRate.disabled = true;
        chkActive.disabled = !SysSession.CurrentPrivileges.CUSTOM1;
        $("#txtCreatedAt").prop("disabled", "disabled");
        $("#txtCreatedBy").prop("disabled", "disabled");
        $("#txtUpdatedAt").prop("disabled", "disabled");
        $("#txtUpdatedBy").prop("disabled", "disabled");
    }
    function DisableControls() {
        $("#divDetails").removeClass("display_none");
        $("#divEdit").removeClass("display_none");
        $("#divDetails").removeClass("display_none");
        $("#divTotalSatistics").removeClass("display_none");
        $("#DivFilter").removeClass("disabledDiv");
        $("#divIconbar").removeClass("disabledIconbar");
        $("#divMasterGridiv").removeClass("disabledDiv");
        $("#divDetails :input").attr("disabled", "disabled");
        $("#btnAddDetails").addClass("display_none");
        $("#btnAddDetailsCharge").addClass("display_none");
        $("#btnPrintTransaction").removeClass("display_none");
        $("#btnPrintTransaction").removeClass("display_none");
        //$("#btnPrintInvoicePrice").removeClass("display_none");
        $("#btnUpdate").removeClass("display_none");
        $("#btnBack").addClass("display_none");
        $("#btnSave").addClass("display_none");
        for (var i = 0; i < CountGrid; i++) {
            $("#txtQuantityReturnValue" + i).prop("disabled", true);
            $("#txtAddons" + i).prop("disabled", true);
            $("#txtTotAddons" + i).prop("disabled", true);
            $("#txtTotal" + i).prop("disabled", true);
            $("#txtTax" + i).prop("disabled", true);
            $("#txtTotal" + i).prop("disabled", true);
            $("#txtTotalFc" + i).prop("disabled", true);
            $("#txtPrice" + i).prop("disabled", true);
            $("#txtTotAfterTax" + i).prop("disabled", true);
            $("#btn_minus" + i).addClass("display_none");
            $("#btn_minus" + i).removeAttr("disabled");
        }
        for (var i = 0; i < CountGridCharge; i++) {
            $("#txtSerial" + i).prop("disabled", true);
            $("#txtVatCharge" + i).prop("disabled", true);
            $("#txtValueAfterVatCharge" + i).prop("disabled", true);
            $("#txtAddonsTypeCharge" + i).prop("disabled", true);
            $("#btn_minus1" + i).addClass("display_none");
            $("#btn_minus1" + i).removeAttr("disabled");
        }
        txtNotes.disabled = true;
        ddlCashBoxH.disabled = true;
        txtDateHeader.disabled = true;
        txtPurOrderNum.disabled = true;
        btnVendorSearch.disabled = true;
        btnPurOrderSearch.disabled = true;
    }
    //---------------------------------------------------------------- main functions  region----------------------------------------------------
    function Assign() {
        debugger;
        var StatusFlag;
        ReceiveModel = new I_Pur_TR_Receive();
        ReceiveItemsDetailsModel = new Array();
        chargesDetailsModel = new Array();
        MasterDetailModel.UserCode = SysSession.CurrentEnvironment.UserCode;
        MasterDetailModel.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
        ReceiveModel.CompCode = Number(compcode);
        ReceiveModel.BranchCode = Number(BranchCode);
        /// if come from PurOrder
        ReceiveModel.PurOrderID = globalPurOrderID;
        ReceiveModel.TrType = 0; //0 invoice 1 return
        ReceiveModel.PurRecType = Number(ddlReciveTypeHeader.value); //  retail PurRecType
        ReceiveModel.StoreID = Number(ddlStoreHeader.value); //main store
        ReceiveModel.TrDate = txtDateHeader.value;
        if (chkActive.checked == true) {
            ReceiveModel.Status = 1;
        }
        else {
            ReceiveModel.Status = 0;
        }
        ReceiveModel.SalesmanId = Number(ddlSalesmanHeader.value);
        ReceiveModel.VendorID = globalVendorID;
        ReceiveModel.VendorInvNo = VendorRecieptID.value;
        ReceiveModel.VATType = Number(ddlTaxTypeHeader.value);
        ReceiveModel.CurrencyID = Number(ddlCurrency.value);
        ReceiveModel.CurrencyRate = Number(txtCurrencyRate.value);
        ReceiveModel.TotalFC = Number($("#txtLocalTotalFooter").val());
        ReceiveModel.Remarks = txtNotes.value;
        if (ddlIsCash.value == '1') {
            ReceiveModel.CashBoxID = Number(ddlCashBoxH.value);
            ReceiveModel.IsCash = true;
        }
        else {
            ReceiveModel.CashBoxID = 0;
            ReceiveModel.IsCash = false;
        }
        //if (ddlIsCash.value == "0") { ReceiveModel.IsCash = false; $('#ddlCashBoxH').removeAttr('disabled'); } else { ReceiveModel.IsCash = true; $('#ddlCashBoxH').attr('disabled','disabled');; }
        ReceiveModel.NetAdditionVat = Number(txtAddonsTax.value);
        ReceiveModel.NetAdditionCost = Number(txtAddons.value);
        ReceiveModel.NetDue = Number(txtTotalFamily.value);
        ReceiveModel.VatAmount = Number(txtTax.value);
        ReceiveModel.Total = Number(txtTotal.value);
        // Details Receive items
        for (var i = 0; i < CountGrid; i++) {
            ReceiveItemSingleModel = new I_Pur_TR_ReceiveItems();
            StatusFlag = $("#txt_StatusFlag" + i).val();
            if (StatusFlag == "i") {
                ReceiveItemSingleModel.ReciveDetailsID = 0;
                ReceiveItemSingleModel.Serial = $("#txtSerialH" + i).val();
                ReceiveItemSingleModel.ItemID = $("#ddlItem" + i).val();
                ReceiveItemSingleModel.StatusFlag = StatusFlag.toString();
                ReceiveItemSingleModel.RecQty = $('#txtQuantity' + i).val();
                ReceiveItemSingleModel.RecStockQty = $('#txtQuantity' + i).val(); //
                ReceiveItemSingleModel.TotRetQty = $("#txtQuantityReturnValue" + i).val();
                ReceiveItemSingleModel.RecUnitPrice = $("#txtPrice" + i).val();
                ReceiveItemSingleModel.RecUnitPriceFC = $("#txtPriceFc" + i).val();
                ReceiveItemSingleModel.UnitAddCost = $("#txtAddons" + i).val();
                ReceiveItemSingleModel.NetUnitCost = $("#txtTotAddons" + i).val();
                ReceiveItemSingleModel.VatAmount = $("#txtTax" + i).val();
                ReceiveItemSingleModel.StockUnitCost = Number($("#UnitCost" + i).val());
                ReceiveItemSingleModel.VatPrc = VatPrc;
                ReceiveItemSingleModel.UnitID = Number($('option:selected', $("#ddlItem" + i)).attr('data-UomID'));
                chargesingleModel.VatPrc = Number($("#txtVatType" + i).attr('data-VatPerc'));
                ReceiveItemsDetailsModel.push(ReceiveItemSingleModel);
            }
            if (StatusFlag == "u") {
                var RecItemId = $("#ReciveDetailsID" + i).val();
                ReceiveItemSingleModel.ReciveDetailsID = RecItemId;
                ReceiveItemSingleModel.Serial = $("#txtSerialH" + i).val();
                ReceiveItemSingleModel.ItemID = $("#ddlItem" + i).val();
                ReceiveItemSingleModel.StatusFlag = StatusFlag.toString();
                ReceiveItemSingleModel.RecQty = $('#txtQuantity' + i).val();
                ReceiveItemSingleModel.RecStockQty = $('#txtQuantity' + i).val(); //
                ReceiveItemSingleModel.TotRetQty = $("#txtQuantityReturnValue" + i).val();
                ReceiveItemSingleModel.RecUnitPrice = $("#txtPrice" + i).val();
                ReceiveItemSingleModel.RecUnitPriceFC = $("#txtPriceFc" + i).val();
                ReceiveItemSingleModel.UnitAddCost = $("#txtAddons" + i).val();
                ReceiveItemSingleModel.NetUnitCost = $("#txtTotAddons" + i).val();
                ReceiveItemSingleModel.VatAmount = $("#txtTax" + i).val();
                ReceiveItemSingleModel.StockUnitCost = Number($("#UnitCost" + i).val());
                ReceiveItemSingleModel.VatPrc = VatPrc;
                ReceiveItemSingleModel.UnitID = Number($('option:selected', $("#ddlItem" + i)).attr('data-UomID'));
                chargesingleModel.VatPrc = Number($("#txtVatType" + i).attr('data-VatPerc'));
                ReceiveItemsDetailsModel.push(ReceiveItemSingleModel);
            }
            if (StatusFlag == "d") {
                if ($("#ReciveDetailsID" + i).val() != "") {
                    var deletedID = $("#ReciveDetailsID" + i).val();
                    ReceiveItemSingleModel.StatusFlag = StatusFlag.toString();
                    ReceiveItemSingleModel.ReciveDetailsID = deletedID;
                    ReceiveItemsDetailsModel.push(ReceiveItemSingleModel);
                }
            }
        }
        // Details Receive charges
        for (var i = 0; i < CountGridCharge; i++) {
            chargesingleModel = new I_Pur_Tr_ReceiveCharges();
            StatusFlag = $("#txt_StatusFlag1" + i).val();
            if (StatusFlag == "i") {
                chargesingleModel.ReceiveExpensesID = 0;
                chargesingleModel.StatusFlag = StatusFlag.toString();
                chargesingleModel.Serial = $("#txtSerial" + i).val();
                chargesingleModel.ChargeID = $("#txtAddonsCharge" + i).val();
                chargesingleModel.Amount = $('#txtValueCharge' + i).val();
                chargesingleModel.VatType = $('#txtVatType' + i).val(); //
                chargesingleModel.VatAmount = $("#txtVatCharge" + i).val();
                chargesingleModel.NetAtferVat = $("#txtValueAfterVatCharge" + i).val();
                var ispaid = $("#txtVendorIsCheckCharge" + i).val();
                if (ispaid == "0") {
                    chargesingleModel.isPaidByVendor = true;
                }
                else {
                    chargesingleModel.isPaidByVendor = false;
                }
                chargesingleModel.RefInvoiceNo = $("#txtInvoiceNumberCharge" + i).val();
                chargesingleModel.RefInvoiceDate = $("#txtInvoiceDateCharge" + i).val();
                chargesingleModel.VendorID = $("#txtVendorCharge" + i).val();
                //chargesingleModel.CashBoxID = $("#txt_D_CashBox" + i).val();
                if ($("#txt_D_CashBox" + i).val() == "Null") {
                    chargesingleModel.CashBoxID = 0;
                }
                else {
                    chargesingleModel.CashBoxID = $("#txt_D_CashBox" + i).val();
                }
                chargesDetailsModel.push(chargesingleModel);
            }
            if (StatusFlag == "u") {
                var chargeItemId = $("#ReceiveExpensesID" + i).val();
                chargesingleModel.StatusFlag = StatusFlag.toString();
                chargesingleModel.Serial = $("#txtSerial" + i).val();
                chargesingleModel.ReceiveExpensesID = chargeItemId;
                chargesingleModel.ChargeID = $("#txtAddonsCharge" + i).val();
                chargesingleModel.Amount = $('#txtValueCharge' + i).val();
                chargesingleModel.VatType = $('#txtVatType' + i).val(); //
                chargesingleModel.VatAmount = $("#txtVatCharge" + i).val();
                chargesingleModel.NetAtferVat = $("#txtValueAfterVatCharge" + i).val();
                var ispaid = $("#txtVendorIsCheckCharge" + i).val();
                if (ispaid == "0") {
                    chargesingleModel.isPaidByVendor = true;
                }
                else {
                    chargesingleModel.isPaidByVendor = false;
                }
                chargesingleModel.RefInvoiceNo = $("#txtInvoiceNumberCharge" + i).val();
                chargesingleModel.RefInvoiceDate = $("#txtInvoiceDateCharge" + i).val();
                chargesingleModel.VendorID = $("#txtVendorCharge" + i).val();
                //chargesingleModel.CashBoxID = $("#txt_D_CashBox" + i).val();
                if ($("#txt_D_CashBox" + i).val() == "Null") {
                    chargesingleModel.CashBoxID = 0;
                }
                else {
                    chargesingleModel.CashBoxID = $("#txt_D_CashBox" + i).val();
                }
                chargesDetailsModel.push(chargesingleModel);
            }
            if (StatusFlag == "d") {
                if ($("#ReceiveExpensesID" + i).val() != "") {
                    var deletedID = $("#ReceiveExpensesID" + i).val();
                    chargesingleModel.StatusFlag = StatusFlag.toString();
                    chargesingleModel.ReceiveExpensesID = deletedID;
                    chargesDetailsModel.push(chargesingleModel);
                }
            }
        }
        MasterDetailModel.I_Pur_TR_Receive = ReceiveModel;
        MasterDetailModel.I_Pur_TR_ReceiveItems = ReceiveItemsDetailsModel;
        MasterDetailModel.I_Pur_Tr_ReceiveCharges = chargesDetailsModel; //I_Pur_Tr_ReceiveCharges
    }
    function Insert() {
        MasterDetailModel.UserCode = SysSession.CurrentEnvironment.UserCode;
        MasterDetailModel.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
        MasterDetailModel.I_Pur_TR_Receive.CreatedBy = SysSession.CurrentEnvironment.UserCode;
        MasterDetailModel.I_Pur_TR_Receive.CreatedAt = DateTimeFormat(Date().toString());
        //if (!CheckDate(DateFormat(txtDateHeader.value).toString(), DateFormat(SysSession.CurrentEnvironment.StartDate).toString(), DateFormat(SysSession.CurrentEnvironment.EndDate).toString())) {
        //    MessageBox.Show('  التاريخ ليس متطابق مع تاريخ السنه (' + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ')', '');
        //    return
        //}
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("PurTrReceive", "InsertPurchaseReceiveMasterDetail"),
            data: JSON.stringify(MasterDetailModel),
            success: function (d) {
                var result = d;
                if (result.IsSuccess == true) {
                    debugger;
                    var res = result.Response;
                    DisplayMassage(" تم اصدار  فاتورة رقم  " + res.I_Pur_TR_Receive.TrNo + " ", "invoice number" + res.I_Pur_TR_Receive.TrNo + "has been issued", MessageType.Succeed);
                    lblInvoiceNumber.innerText = res.I_Pur_TR_Receive.TrNo.toString();
                    GlobalReceiveID = res.I_Pur_TR_Receive.ReceiveID;
                    Success(res.I_Pur_TR_Receive.ReceiveID);
                    //InitializeGrid();
                    //BindAfterInsertorUpdate(res.I_Pur_TR_Receive.ReceiveID);
                    //DisableControls();
                    //if (RetrivedPurchaseModel[0].Status == 1) {
                    //    chkActive.checked = true;
                    //    chkActive.disabled = !SysSession.CurrentPrivileges.CUSTOM2;
                    //    btnUpdate.disabled = true;
                    //} else {
                    //    chkActive.checked = false;
                    //    chkActive.disabled = true;
                    //    btnUpdate.disabled = false;
                    //}
                    Save_Succ_But();
                }
                else {
                    DisplayMassage(" هناك خطـأ  ", "Error", MessageType.Error);
                }
            }
        });
    }
    function Update() {
        MasterDetailModel.I_Pur_TR_Receive.UpdatedBy = SysSession.CurrentEnvironment.UserCode;
        MasterDetailModel.I_Pur_TR_Receive.UpdatedAt = DateTimeFormat(Date().toString());
        MasterDetailModel.I_Pur_TR_Receive.CreatedBy = RetrivedPurchaseModel[0].CreatedBy;
        MasterDetailModel.I_Pur_TR_Receive.CreatedAt = RetrivedPurchaseModel[0].CreatedAt;
        // MasterDetailModel.I_Pur_TR_Receive.PurOrderID = RetrivedPurchaseModel[0].PurOrderID;
        MasterDetailModel.I_Pur_TR_Receive.TrNo = RetrivedPurchaseModel[0].TrNo;
        MasterDetailModel.I_Pur_TR_Receive.ReceiveID = RetrivedPurchaseModel[0].ReceiveID;
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("PurTrReceive", "UpdateListPurchaseReceiveMasterDetail"),
            data: JSON.stringify(MasterDetailModel),
            success: function (d) {
                var result = d;
                if (result.IsSuccess == true) {
                    var res = result.Response;
                    DisplayMassage(" تم تعديل فاتورة رقم  " + res.I_Pur_TR_Receive.TrNo + " ", "invoice number " + res.I_Pur_TR_Receive.TrNo + "has been editied", MessageType.Succeed);
                    lblInvoiceNumber.innerText = res.I_Pur_TR_Receive.TrNo.toString();
                    GlobalReceiveID = res.I_Pur_TR_Receive.ReceiveID;
                    Success(res.I_Pur_TR_Receive.ReceiveID);
                    //InitializeGrid();
                    //BindAfterInsertorUpdate(res.I_Pur_TR_Receive.ReceiveID);
                    //DisableControls();
                    //if (RetrivedPurchaseModel[0].Status == 1) {
                    //    chkActive.checked = true;
                    //    chkActive.disabled = !SysSession.CurrentPrivileges.CUSTOM2;
                    //    btnUpdate.disabled = true;
                    //} else {
                    //    chkActive.checked = false;
                    //    chkActive.disabled = true;
                    //    btnUpdate.disabled = false;
                    //}
                    Save_Succ_But();
                }
                else {
                    DisplayMassage(" هناك خطـأ  ", "Error", MessageType.Error);
                }
            }
        });
    }
    function Success(ReceiveID) {
        $("#DivFilter").removeClass("disabledDiv");
        $("#divIconbar").removeClass("disabledIconbar");
        $("#divMasterGridiv").removeClass("disabledDiv");
        $("#divMasterGridiv").removeClass("display_none");
        //DisableControls();
        clear();
        $("#divDetails").addClass("display_none");
        ShowFlag = true;
        $("#divMasterGridiv").removeClass("display_none");
        InitializeGrid();
        $("#divDetails").addClass("display_none");
        $("#MasterDropDowns").removeClass("display_none");
        $("#divGridWithDetail").removeClass("display_none");
        $("#DivShow").removeClass("display_none");
        $("#divTotalSatistics").removeClass("display_none");
        $("#DivChargesShow").removeClass("display_none");
        ShowFlag = true;
        $('#ddlCurrency').prop("value", "null");
        var Selecteditem = GetPurReceiveStaisticData.filter(function (x) { return x.ReceiveID == Number(ReceiveID); });
        GlobalReceiveID = Number(Selecteditem[0].ReceiveID);
        RetrivedPurchaseModel = Selecteditem;
        DataHeader();
        AllGetPurReceiveItemsCharge();
        DisableControls();
        if (RetrivedPurchaseModel[0].Status == 1) {
            chkActive.checked = true;
            chkActive.disabled = !SysSession.CurrentPrivileges.CUSTOM2;
            btnUpdate.disabled = true;
        }
        else {
            chkActive.checked = false;
            chkActive.disabled = true;
            btnUpdate.disabled = false;
        }
        VatPrc = VatDetails.filter(function (x) { return x.CODE == RetrivedPurchaseModel[0].VATType; })[0].VatPerc;
        $("#divDetails").removeClass("display_none");
        $("#divEdit").removeClass("display_none");
        $("#btnPrintTransaction").removeClass("display_none");
        $("#btnPrintTransaction").removeClass("display_none");
    }
    function openInvoice() {
        if (!CheckPeriodDate(txtDateHeader.value, "I")) {
            debugger;
            DisplayMassage("لا يمكنك الاضافه او التعديل في هذة الفتره المغلقه ", "Please select a Invoice data", MessageType.Error);
            Errorinput(txtDateHeader);
            chkActive.checked = true;
            return false;
        }
        Assign();
        MasterDetailModel.I_Pur_TR_Receive.CreatedBy = RetrivedPurchaseModel[0].CreatedBy;
        MasterDetailModel.I_Pur_TR_Receive.CreatedAt = RetrivedPurchaseModel[0].CreatedAt;
        // MasterDetailModel.I_Pur_TR_Receive.PurOrderID = RetrivedPurchaseModel[0].PurOrderID;
        MasterDetailModel.I_Pur_TR_Receive.TrNo = RetrivedPurchaseModel[0].TrNo;
        MasterDetailModel.I_Pur_TR_Receive.ReceiveID = RetrivedPurchaseModel[0].ReceiveID;
        MasterDetailModel.I_Pur_TR_Receive.UpdatedBy = SysSession.CurrentEnvironment.UserCode;
        MasterDetailModel.I_Pur_TR_Receive.UpdatedAt = DateTimeFormat(Date().toString());
        MasterDetailModel.I_Pur_TR_Receive.Status = 0;
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("PurTrReceive", "Open"),
            data: JSON.stringify(MasterDetailModel),
            success: function (d) {
                var result = d;
                var res = result.Response;
                if (result.IsSuccess == true) {
                    btnUpdate.disabled = false;
                    chkActive.disabled = true;
                    $("#btnUpdate").removeClass("display_none");
                    GlobalReceiveID = res.I_Pur_TR_Receive.ReceiveID;
                    InitializeGrid();
                    BindAfterInsertorUpdate(res.I_Pur_TR_Receive.ReceiveID);
                    DisableControls();
                    chkActive.checked = false;
                    chkActive.disabled = true;
                    btnUpdate.disabled = false;
                    DisplayMassage(" تم فك الاعتماد رقم  " + res.I_Pur_TR_Receive.TrNo + " ", "invoice number " + res.I_Pur_TR_Receive.TrNo + "has been unapproved", MessageType.Succeed);
                }
                else {
                    btnUpdate.disabled = true;
                    $("#btnUpdate").removeClass("display_none");
                }
            }
        });
    }
    function BindAfterInsertorUpdate(receiveid) {
        debugger;
        ShowFlag = true;
        $("#btnPrintTransaction").removeClass("display_none");
        $("#btnPrintTransaction").removeClass("display_none");
        GlobalReceiveID = receiveid;
        var Selecteditem = GetPurReceiveStaisticData.filter(function (x) { return x.ReceiveID == receiveid; });
        GlobalReceiveID = Number(Selecteditem[0].ReceiveID);
        RetrivedPurchaseModel = Selecteditem;
        DataHeader();
        AllGetPurReceiveItemsCharge();
    }
    //---------------------------------------------------------------- Print  region----------------------------------------------------
    function PrintReport(OutType) {
        //
        if (!SysSession.CurrentPrivileges.PrintOut)
            return;
        var rp = new ReportParameters();
        rp.RepType = OutType; //output report as View
        rp.FromDate = DateFormatRep(txtFromDate.value);
        rp.ToDate = DateFormatRep(txtToDate.value);
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
        rp.TrType = 0;
        rp.CashType = 2;
        if (ddlSalesmanMaster.selectedIndex > 0)
            rp.SalesmanID = Number($("#ddlSalesmanMaster").val());
        else
            rp.SalesmanID = -1;
        if (ddlVendorMaster.selectedIndex > 0)
            rp.VendorId = Number($("#ddlVendorMaster").val());
        else
            rp.VendorId = -1;
        if (ddlStateType.selectedIndex > 0) {
            if (Number($("#ddlStateType").val()) == 0) {
                rp.Status = 0;
            }
            if (Number($("#ddlStateType").val()) == 1) {
                rp.Status = 1;
            }
            if (Number($("#ddlStateType").val()) == 2) {
                rp.Status = 2;
            }
        }
        Ajax.Callsync({
            url: Url.Action("IProc_Rpt_PurReceiveList", "GeneralReports"),
            data: rp,
            success: function (d) {
                var result = d.result;
                window.open(result, "_blank");
            }
        });
    }
    function btnPrintTransaction_onclick() {
        //
        if (!SysSession.CurrentPrivileges.PrintOut)
            return;
        var rp = new ReportParameters();
        rp.Type = 0;
        rp.Repdesign = 0;
        rp.TRId = GlobalReceiveID;
        rp.Name_function = "IProc_Prnt_PurReceive";
        localStorage.setItem("Report_Data", JSON.stringify(rp));
        localStorage.setItem("result", '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>');
        window.open(Url.Action("ReportsPopup", "Home"), "_blank");
    }
    function btnPrntPrice_onclick() {
        //
        if (!SysSession.CurrentPrivileges.PrintOut)
            return;
        var rp = new ReportParameters();
        rp.Type = 0;
        rp.Repdesign = 1;
        rp.TRId = GlobalReceiveID;
        rp.Name_function = "IProc_Prnt_PurReceivePrice";
        localStorage.setItem("Report_Data", JSON.stringify(rp));
        localStorage.setItem("result", '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>');
        window.open(Url.Action("ReportsPopup", "Home"), "_blank");
    }
})(PurTrReceive || (PurTrReceive = {}));
//# sourceMappingURL=PurTrReceive.js.map