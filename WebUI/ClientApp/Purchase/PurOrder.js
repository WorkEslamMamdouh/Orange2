$(document).ready(function () {
    //////////debugger;
    PurOrder.InitalizeComponent();
});
var PurOrder;
(function (PurOrder) {
    //system varables
    var SysSession = GetSystemSession(Modules.PurOrder);
    var compcode;
    var BranchCode;
    var sys = new SystemTools();
    var FinYear;
    //Arrays
    var CashboxDetails = new Array();
    var SellerDetails = new Array();
    var CurrencyDetails = new Array();
    var StateDetailsAr = new Array();
    var StateDetailsEn = new Array();
    var VendorDetails = new Array();
    var SearchDetails = new Array();
    var G_USERSDetails = new Array();
    var PurchaseOrderViewWithDetail = new IQ_PurchaseOrderWithDetail();
    var ItemsListDetails = new Array();
    //Models
    var RetrivedPurOrderModel = new IQ_GetPurchaseOrder();
    var RetrivedPurOrderDetailsModel = new Array();
    var PurOrderModel = new I_Pur_Tr_PurchaseOrder();
    var ItemDetails = new Array();
    var PurOrderDetailsModel = new Array();
    var PurOrderSingleModel = new I_Pur_Tr_PurchaseOrderDetail();
    var MasterDetailModel = new PurchaseOrderMasterDetails();
    var AllPurReceiveMasterDetailModel = new IQ_GetPurReceiveMasterDisplay();
    //DropDownlist
    var ddlStateType;
    var ddlcashType;
    var ddlSalesmanMaster;
    var ddlVendorMaster;
    var ddlSeller;
    var FamilyDetails = new Array();
    var ItemBaesdFamilyDetails = new Array();
    var VatTypeData = new Array();
    var AddonsData = new Array();
    // giedView
    var divMasterGrid = new JsGrid();
    //Textboxes
    var txtNotes;
    var txtFromDate;
    var txtToDate;
    var txtDateHeader;
    var txtSearchBox;
    var ddlVendorHeader;
    var ddlSalesmanHeader;
    var txtTotal;
    var txtVatTotal;
    var txtNetTotal;
    var txtRefNum;
    var txtCreatedAt;
    var txtCreatedBy;
    var txtUpdatedAt;
    var txtUpdatedBy;
    var txtDliveryConditions;
    var txtValidityPeriod;
    var txtShipmentConditions;
    var chkActive;
    var chkReceived;
    //buttons 
    var btnUpdate;
    var btnShow;
    var ddlIsCash;
    var ddlCurrency;
    var ddlTaxTypeHeader;
    var btnAddDetails;
    var btnSave;
    var btnBack;
    var btnAdd;
    //flags
    var GlobalPurOrderID = 0;
    var ModeType = 2; //1 view , 2 insert , 3 update 
    var AfterInsertOrUpdateFlag = false;
    var ShowFlag;
    var CountGrid = 0;
    var txtPurTrNo;
    var VatDetails = new Array();
    var DefVatType = SysSession.CurrentEnvironment.I_Control[0].DefPurVatType;
    var VatPrc;
    var lang;
    var GlobalCurrency;
    // Print Buttons
    var btnPrintTrview;
    var btnPrintTrPDF;
    var btnPrintTrEXEL;
    //   var btnPrint: HTMLButtonElement;           
    var btnPrintTransaction;
    //------------------------------------------------------------- main regions-------------------------------------
    function InitalizeComponent() {
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);
        FinYear = Number(SysSession.CurrentEnvironment.CurrentYear);
        lang = SysSession.CurrentEnvironment.Language;
        GlobalCurrency = SysSession.CurrentEnvironment.I_Control[0].Currencyid;
        //debugger
        InitalizeControls();
        $("#txtDateHeader").val(GetDate());
        IntializeEvents();
        FillddlCashBox();
        FillddlStateType();
        FillddlcashType();
        FillddlSalesmanHeader();
        FillddlVendorHeader();
        FillddlSeller();
        FillddlTaxType();
        FillddlCashType();
        FillddlCurrency();
        $('#ddlStateType').prop("value", "2");
        $('#ddlcashType').prop("value", "2");
        ShowFlag = true;
        GetVatType();
        GetAllItems();
        txtFromDate.value = DateStartMonth();
        txtToDate.value = ConvertToDateDash(GetDate()) <= ConvertToDateDash(SysSession.CurrentEnvironment.EndDate) ? GetDate() : SysSession.CurrentEnvironment.EndDate;
        //  $('#btnPrint').addClass('display_none');
    }
    PurOrder.InitalizeComponent = InitalizeComponent;
    function IntializeEvents() {
        btnShow.onclick = btnShow_onclick;
        ddlTaxTypeHeader.onchange = TaxTypeOnchange;
        btnAddDetails.onclick = AddNewRow;
        btnUpdate.onclick = btnupdate_onclick;
        btnSave.onclick = saveFunc;
        btnBack.onclick = backFunc;
        btnAdd.onclick = addFunc;
        chkActive.onclick = chkActive_onchecked;
        // print----*
        btnPrintTrview.onclick = function () { PrintReport(1); };
        btnPrintTrPDF.onclick = function () { PrintReport(2); };
        btnPrintTrEXEL.onclick = function () { PrintReport(3); };
        //btnPrint.onclick = () => { PrintReport(4); }          
        btnPrintTransaction.onclick = btnPrintPurchaseDemand_onclick;
        txtSearchBox.onkeyup = _SearchBox_Change;
    }
    function InitalizeControls() {
        // print ----*
        btnPrintTrview = document.getElementById("btnPrintTrview");
        btnPrintTrPDF = document.getElementById("btnPrintTrPDF");
        btnPrintTrEXEL = document.getElementById("btnPrintTrEXEL");
        //  btnPrint = document.getElementById("btnPrint") as HTMLButtonElement;                       
        btnPrintTransaction = document.getElementById("btnPrintTransaction");
        //Drop Downlists
        ddlStateType = document.getElementById("ddlStateType");
        ddlcashType = document.getElementById("ddlcashType");
        ddlSalesmanMaster = document.getElementById("ddlSalesmanMaster");
        ddlVendorMaster = document.getElementById("ddlVendorMaster");
        ddlSeller = document.getElementById("ddlSeller");
        //textboxes
        txtFromDate = document.getElementById("txtFromDate");
        txtToDate = document.getElementById("txtToDate");
        txtNotes = document.getElementById("txtNotes");
        txtRefNum = document.getElementById("txtRefNum");
        txtSearchBox = document.getElementById("txtSearchBox");
        txtDateHeader = document.getElementById("txtDateHeader");
        ddlVendorHeader = document.getElementById("ddlVendorHeader");
        ddlSalesmanHeader = document.getElementById("ddlSalesmanHeader");
        txtPurTrNo = document.getElementById("txtPurTrNo");
        txtTotal = document.getElementById("txtTotal");
        txtVatTotal = document.getElementById("txtVatTotal");
        txtNetTotal = document.getElementById("txtNetTotal");
        txtCreatedAt = document.getElementById("txtCreatedAt");
        txtCreatedBy = document.getElementById("txtCreatedBy");
        txtUpdatedAt = document.getElementById("txtUpdatedAt");
        txtUpdatedBy = document.getElementById("txtUpdatedBy");
        txtDliveryConditions = document.getElementById("txtDliveryConditions");
        txtValidityPeriod = document.getElementById("txtValidityPeriod");
        txtShipmentConditions = document.getElementById("txtShipmentConditions");
        chkReceived = document.getElementById("chkReceived");
        //buttons
        btnShow = document.getElementById("btnShow");
        ddlIsCash = document.getElementById("ddlIsCash");
        ddlCurrency = document.getElementById("ddlCurrency");
        ddlTaxTypeHeader = document.getElementById("ddlTaxTypeHeader");
        chkActive = document.getElementById("chkActive");
        btnAddDetails = document.getElementById("btnAddDetails");
        btnUpdate = document.getElementById("btnUpdate");
        btnBack = document.getElementById("btnBack");
        btnSave = document.getElementById("btnSave");
        btnAdd = document.getElementById("btnAdd");
        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = "أمر شراء";
        }
        else {
            document.getElementById('Screen_name').innerHTML = "Purchase Order";
        }
    }
    function Check_on_user_type() {
        //debugger
        if (SysSession.CurrentEnvironment.UserType == 1 || SysSession.CurrentEnvironment.UserType == 3) { //Salesman
            var SalesId_1 = SysSession.CurrentEnvironment.SalesManID;
            SellerDetails = SellerDetails.filter(function (s) { return s.SalesmanId == SalesId_1; });
        }
        else if (SysSession.CurrentEnvironment.UserType == 2 || SysSession.CurrentEnvironment.UserType == 3) { //CashBox
            var CashBoxID_1 = SysSession.CurrentEnvironment.CashBoxID;
            CashboxDetails = CashboxDetails.filter(function (s) { return s.CashBoxID == CashBoxID_1; });
        }
    }
    //------------------------------------------------------------- Normal Grid regions-------------------------------------
    function InitializeGrid() {
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
        divMasterGrid.PrimaryKey = "PurOrderID";
        divMasterGrid.Columns = [
            { title: "ID", name: "PurOrderID", type: "text", width: "2%", visible: false },
            { title: res.Pur_TRNO, name: "TrNo", type: "text", width: "10%" },
            { title: res.I_Vendor, name: (lang == "ar" ? "Vnd_NameA" : "Vnd_NameE"), type: "text", width: "25%" },
            { title: res.App_Salesman, name: (lang == "ar" ? "Slsm_DescA" : "Slsm_DescE"), type: "text", width: "25%" },
            { title: res.App_date, name: "TrDate", type: "text", width: "18%" },
            { title: res.Trns_RefNum, name: "RefNO", type: "text", width: "10%" },
            { title: res.I_Total, name: "Total", type: "text", width: "10%" },
            { title: res.App_TotVat, name: "VatAmount", type: "text", width: "12%" },
            { title: res.Done_Received, name: "IsReceivedDesc", type: "text", width: "12%" },
            { title: res.App_State, name: "StatusDesc", type: "text", width: "17%" },
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
        var CashType = Number(ddlcashType.value.toString());
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("PurTrReceive", "GetAllPurOrder"),
            data: { CompCode: compcode, BranchCode: BranchCode, startDate: startdt, endDate: enddt, Status: status, CashType: CashType, VendorId: vendorId, SalesmanId: salesmanId, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    PurchaseOrderViewWithDetail = result.Response;
                    for (var i = 0; i < PurchaseOrderViewWithDetail.IQ_GetPurchaseOrder.length; i++) {
                        PurchaseOrderViewWithDetail.IQ_GetPurchaseOrder[i].TrDate = DateFormat(PurchaseOrderViewWithDetail.IQ_GetPurchaseOrder[i].TrDate);
                        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
                            PurchaseOrderViewWithDetail.IQ_GetPurchaseOrder[i].StatusDesc = PurchaseOrderViewWithDetail.IQ_GetPurchaseOrder[i].Status == 0 ? "غير معتمد" : "معتمد";
                            PurchaseOrderViewWithDetail.IQ_GetPurchaseOrder[i].IsReceivedDesc = PurchaseOrderViewWithDetail.IQ_GetPurchaseOrder[i].IsReceived == true ? "نعم" : "لا";
                        }
                        else {
                            PurchaseOrderViewWithDetail.IQ_GetPurchaseOrder[i].StatusDesc = PurchaseOrderViewWithDetail.IQ_GetPurchaseOrder[i].Status == 0 ? "Non Certified" : "Certified";
                            PurchaseOrderViewWithDetail.IQ_GetPurchaseOrder[i].IsReceivedDesc = PurchaseOrderViewWithDetail.IQ_GetPurchaseOrder[i].IsReceived == true ? "Yes" : "No";
                        }
                    }
                    divMasterGrid.DataSource = PurchaseOrderViewWithDetail.IQ_GetPurchaseOrder;
                    divMasterGrid.Bind();
                }
            }
        });
    }
    function MasterGridDoubleClick() {
        clear();
        ShowFlag = true;
        $("#btnPrintTransaction").removeClass("display_none");
        $("#divEdit").removeClass("display_none");
        $("#PurOrderDetails").removeClass("display_none");
        $("#divDetails").removeClass("display_none");
        $("#btnUpdate").removeClass("display_none");
        var Selecteditem = PurchaseOrderViewWithDetail.IQ_GetPurchaseOrder.filter(function (x) { return x.PurOrderID == Number(divMasterGrid.SelectedKey); });
        if (AfterInsertOrUpdateFlag == true) {
            Selecteditem = PurchaseOrderViewWithDetail.IQ_GetPurchaseOrder.filter(function (x) { return x.PurOrderID == Number(GlobalPurOrderID); });
            AfterInsertOrUpdateFlag = false;
        }
        GlobalPurOrderID = Number(Selecteditem[0].PurOrderID);
        RetrivedPurOrderModel = new IQ_GetPurchaseOrder();
        RetrivedPurOrderModel = Selecteditem[0];
        //Header
        $("#txtDateHeader").val(RetrivedPurOrderModel.TrDate.toString());
        txtPurTrNo.value = RetrivedPurOrderModel.TrNo.toString();
        ddlVendorHeader.value = RetrivedPurOrderModel.VendorID.toString();
        ddlSalesmanHeader.value = RetrivedPurOrderModel.SalesmanId.toString();
        txtPurTrNo.innerText = RetrivedPurOrderModel.TrNo.toString();
        ddlTaxTypeHeader.value = RetrivedPurOrderModel.VATType.toString();
        txtNotes.value = RetrivedPurOrderModel.Remarks.toString();
        txtRefNum.value = RetrivedPurOrderModel.RefNO.toString();
        chkReceived.checked = RetrivedPurOrderModel.IsReceived;
        txtValidityPeriod.value = RetrivedPurOrderModel.ValidityPeriod.toString();
        txtDliveryConditions.value = RetrivedPurOrderModel.DliveryConditions.toString();
        txtShipmentConditions.value = RetrivedPurOrderModel.ShipmentConditions.toString();
        txtTotal.setVal(RetrivedPurOrderModel.Total);
        txtVatTotal.setVal(RetrivedPurOrderModel.VatAmount);
        txtNetTotal.setVal(RetrivedPurOrderModel.NetDue);
        if (RetrivedPurOrderModel.CurrencyID != null)
            ddlCurrency.value = RetrivedPurOrderModel.CurrencyID.toString();
        if (RetrivedPurOrderModel.IsCash == true) {
            ddlIsCash.value = '1';
        }
        else {
            ddlIsCash.value = '0';
        }
        $("#txtCreatedAt").prop("value", RetrivedPurOrderModel.CreatedAt);
        $("#txtCreatedBy").prop("value", RetrivedPurOrderModel.CreatedBy);
        $("#txtUpdatedAt").prop("value", RetrivedPurOrderModel.UpdatedAt);
        $("#txtUpdatedBy").prop("value", RetrivedPurOrderModel.UpdatedBy);
        chkActive.checked = RetrivedPurOrderModel.Status == 0 ? false : true;
        //Detail
        RetrivedPurOrderDetailsModel = new Array();
        RetrivedPurOrderDetailsModel = PurchaseOrderViewWithDetail.IQ_GetPurchaseOrderDetail.filter(function (x) { return x.PurOrderID == GlobalPurOrderID; });
        for (var i = 0; i < RetrivedPurOrderDetailsModel.length; i++) {
            BuildControls(i);
        }
        CountGrid = RetrivedPurOrderDetailsModel.length;
        TaxTypeOnchange();
        ComputeTotals();
        DisableControls();
        if (RetrivedPurOrderModel.Status == 1) {
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
    //-------------------------------------------------------------- Buttons Region-------------------------------------------------------------
    function btnShow_onclick() {
        ShowFlag = true;
        $("#divMasterGridiv").removeClass("display_none");
        InitializeGrid();
        $("#PurOrderDetails").addClass("display_none");
        $("#divDetails").addClass("display_none");
        $("#divGridWithDetail").removeClass("display_none");
        ShowFlag = false;
    }
    function backFunc() {
        InitializeGrid();
        $("#DivFilter").removeClass("disabledDiv");
        $("#divIconbar").removeClass("disabledIconbar");
        $("#divMasterGridiv").removeClass("disabledDiv");
        $("#divDetails").addClass("display_none");
        $("#divMasterGridiv").removeClass("display_none");
        if (ModeType == 3) {
            MasterGridDoubleClick();
        }
        else {
            DisableControls();
            clear();
            $("#PurOrderDetails").addClass("display_none");
            $("#btnUpdate").addClass("display_none");
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
        AddNewRow();
        $("#divDetails").removeClass("display_none");
        $("#PurOrderDetails").removeClass("display_none");
        $("#divMasterGridiv").addClass("disabledDiv");
        $("#divEdit").removeClass("display_none");
        txtCreatedAt.value = DateTimeFormat(Date().toString());
        txtCreatedBy.value = SysSession.CurrentEnvironment.UserCode;
        txtUpdatedAt.value = "";
        txtUpdatedBy.value = "";
        $("#btnUpdate").addClass("display_none");
        $("#btnBack").removeClass("display_none");
        $("#btnSave").removeClass("display_none");
        $("#DivFilter").attr("disabled", "disabled").off('click');
        $("#DivFilter").addClass("disabledDiv");
        $("#divIconbar").attr("disabled", "disabled").off('click');
        $("#divIconbar").addClass("disabledIconbar");
        $('#ddlCurrency').prop("value", GlobalCurrency);
        EnableControls();
    }
    function btnupdate_onclick() {
        if (!SysSession.CurrentPrivileges.EDIT)
            return;
        ShowFlag = false;
        ModeType = 3; //update                               
        $("#btnPrintTransaction").addClass("display_none");
        EnableControls();
        $("#divMasterGridiv").addClass("disabledDiv");
        $("#btnBack").removeClass("display_none");
        $("#btnSave").removeClass("display_none");
        $("#btnUpdate").addClass("display_none");
        $("#divEdit").removeClass("display_none");
        $("#DivFilter").attr("disabled", "disabled").off('click');
        $("#DivFilter").addClass("disabledDiv");
        $("#divIconbar").attr("disabled", "disabled").off('click');
        $("#divIconbar").addClass("disabledIconbar");
        chkActive.disabled = false;
        txtDateHeader.disabled = true;
        txtUpdatedAt.value = DateTimeFormat(Date().toString());
        txtUpdatedBy.value = SysSession.CurrentEnvironment.UserCode;
    }
    //-------------------------------------------------------------- Events Region-------------------------------------------------------------
    function TaxTypeOnchange() {
        var fltr = VatDetails.filter(function (x) { return (x.CODE == (ddlTaxTypeHeader.value == "null" ? DefVatType : ddlTaxTypeHeader.value)); });
        if (fltr.length != 0)
            VatPrc = fltr[0].VatPerc;
        else
            VatPrc = VatDetails.filter(function (x) { return x.CODE == Number(DefVatType); })[0].VatPerc;
        for (var cnt = 0; cnt < CountGrid; cnt++) {
            var txtRequiredQtyValue = $("#txtRequiredQty" + cnt).val();
            var txtPriceValue = $("#txtPrice" + cnt).val();
            if ($("#txtPrice" + cnt).val() == 0) {
                var total = Number(txtRequiredQtyValue) * 1;
                $("#txtTotal" + cnt).val(total.RoundToSt(2));
                var vatAmount = Number(total) * VatPrc / 100;
                $("#txtTax" + cnt).val(vatAmount.RoundToSt(2));
                var totalAfterVat = Number(vatAmount) + Number(total);
                $("#txtTotAfterTax" + cnt).val(totalAfterVat.RoundToSt(2));
            }
            else {
                var total = Number(txtRequiredQtyValue) * Number(txtPriceValue);
                $("#txtTotal" + cnt).val(total.RoundToSt(2));
                var vatAmount = Number(total) * VatPrc / 100;
                $("#txtTax" + cnt).val(vatAmount.RoundToSt(2));
                var totalAfterVat = Number(vatAmount) + Number(total);
                $("#txtTotAfterTax" + cnt).val(totalAfterVat.RoundToSt(2));
            }
        }
        ComputeTotals();
    }
    function chkActive_onchecked() {
        if (btnUpdate.disabled == true) {
            if (chkActive.checked == false) {
                openInvoice();
            }
        }
    }
    function _SearchBox_Change() {
        $("#divMasterGrid").jsGrid("option", "pageIndex", 1);
        if (txtSearchBox.value != "") {
            var search_1 = txtSearchBox.value.toLowerCase();
            SearchDetails = PurchaseOrderViewWithDetail.IQ_GetPurchaseOrder.filter(function (x) { return x.TrNo.toString().search(search_1) >= 0 || x.Vnd_NameA.toLowerCase().search(search_1) >= 0
                || x.vnd_NameE.toLowerCase().search(search_1) >= 0 || x.Slsm_NameA.toLowerCase().search(search_1) >= 0 || x.Slsm_NameE.toLowerCase().search(search_1) >= 0
                || x.RefNO.toString().search(search_1) >= 0; });
            divMasterGrid.DataSource = SearchDetails;
            divMasterGrid.Bind();
        }
        else {
            divMasterGrid.DataSource = PurchaseOrderViewWithDetail.IQ_GetPurchaseOrder;
            divMasterGrid.Bind();
        }
    }
    //-------------------------------------------------------------- Fill DropDown Region-------------------------------------------------------------
    function FillddlCashBox() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefBox", "GetAll"),
            data: { compCode: compcode, BranchCode: BranchCode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token, ModuleCode: Modules.PurOrder, FinYear: SysSession.CurrentEnvironment.CurrentYear },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    CashboxDetails = result.Response;
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
    function FillddlcashType() {
        StateDetailsAr = ["على الحساب", "نقدي", "الجميع"];
        StateDetailsEn = ["Credit", "Cash", "All"];
        if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
            for (var i = 0; i < StateDetailsEn.length; i++) {
                var newoption = document.createElement("option");
                newoption.value = i.toString();
                newoption.text = StateDetailsEn[i];
                ddlcashType.options.add(newoption);
            }
        }
        else {
            for (var i = 0; i < StateDetailsAr.length; i++) {
                var newoption = document.createElement("option");
                newoption.value = i.toString();
                newoption.text = StateDetailsAr[i];
                ddlcashType.options.add(newoption);
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
    function FillddlSalesmanHeader() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefSalesMen", "GetAllPurchasePeople"),
            data: { CompCode: compcode, BranchCode: BranchCode, IsPurchaseEnable: true, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    SellerDetails = result.Response;
                    //debugger
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
                        DocumentActions.FillCombowithdefult(VendorDetails, ddlVendorHeader, "VendorID", "NAMEL", "Select Seller");
                        DocumentActions.FillCombowithdefult(VendorDetails, ddlVendorMaster, "VendorID", "NAMEL", "Select Vendor");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(VendorDetails, ddlVendorHeader, "VendorID", "NAMEA", "اختر المورد");
                        DocumentActions.FillCombowithdefult(VendorDetails, ddlVendorMaster, "VendorID", "NAMEA", "اختر المورد");
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
    //---------------------------------------------- Enable && validation Region---------------------------------------
    function EnableControls() {
        $("#PurOrderDetails :input").removeAttr("disabled");
        $('#btnBack').removeClass("display_none");
        $('#btnSave').removeClass("display_none");
        $("#btnUpdate").addClass("display_none");
        $("#btnAddDetails").removeClass("display_none");
        for (var i = 0; i < CountGrid; i++) {
            $("#btnSearchItems" + i).removeAttr("disabled");
            $("#txtItemCode" + i).removeAttr("disabled");
            $("#txtItemName" + i).attr("disabled", "disabled");
            $("#txtRequiredQty" + i).removeAttr("disabled");
            $("#txtReceivedQty" + i).removeAttr("disabled");
            $("#txtPrice" + i).removeAttr("disabled");
            $("#txtTotal" + i).attr("disabled", "disabled");
            $("#txtTax" + i).attr("disabled", "disabled");
            $("#txtTotAfterTax" + i).attr("disabled", "disabled");
            $("#Tax" + i).attr("disabled", "disabled");
            $("#btn_minus" + i).removeClass("display_none");
        }
        txtPurTrNo.disabled = true;
        txtCreatedAt.disabled = true;
        txtCreatedBy.disabled = true;
        txtUpdatedAt.disabled = true;
        txtUpdatedBy.disabled = true;
        txtTotal.disabled = true;
        txtVatTotal.disabled = true;
        txtNetTotal.disabled = true;
    }
    function DisableControls() {
        $("#PurOrderDetails :input").attr("disabled", "disabled");
        $("#btnPrintTransaction").removeClass("display_none");
        $('#btnBack').addClass("display_none");
        $('#btnSave').addClass("display_none");
        $("#btnUpdate").removeClass("display_none");
        $("#btnAddDetails").addClass("display_none");
        for (var i = 0; i < CountGrid; i++) {
            $("#btnSearchItems" + i).attr("disabled", "disabled");
            $("#txtItemCode" + i).attr("disabled", "disabled");
            $("#txtItemName" + i).attr("disabled", "disabled");
            $("#txtRequiredQty" + i).attr("disabled", "disabled");
            $("#txtReceivedQty" + i).attr("disabled", "disabled");
            $("#txtPrice" + i).attr("disabled", "disabled");
            $("#txtTotal" + i).attr("disabled", "disabled");
            $("#txtTax" + i).attr("disabled", "disabled");
            $("#txtTotAfterTax" + i).attr("disabled", "disabled");
            $("#btn_minus" + i).addClass("display_none");
        }
        txtPurTrNo.disabled = true;
        txtTotal.disabled = true;
        txtVatTotal.disabled = true;
        txtNetTotal.disabled = true;
        txtDateHeader.disabled = true;
    }
    function ValidationHeader() {
        var newCount = 0;
        for (var i = 0; i < CountGrid; i++) {
            if ($("#txt_StatusFlag" + i).val() != "d" && $("#txt_StatusFlag" + i).val() != "m") {
                newCount++;
            }
        }
        if (!CheckDate(DateFormat(txtDateHeader.value).toString(), DateFormat(SysSession.CurrentEnvironment.StartDate).toString(), DateFormat(SysSession.CurrentEnvironment.EndDate).toString())) {
            DisplayMassage('  التاريخ ليس متطابق مع تاريخ السنه ' + DateFormat(SysSession.CurrentEnvironment.StartDate).toString(), '  The date is not identical with the date of the year ' + DateFormat(SysSession.CurrentEnvironment.StartDate).toString(), MessageType.Error);
            return false;
        }
        if (ddlVendorHeader.value == "null") {
            DisplayMassage(" برجاء اختيار المورد", "Please select vendor", MessageType.Error);
            Errorinput(ddlVendorHeader);
            return false;
        }
        else if (ddlSalesmanHeader.value == "null") {
            DisplayMassage(" برجاء اختيار المندوب", "Please select Salesman", MessageType.Error);
            Errorinput(ddlSalesmanHeader);
            return false;
        }
        else if (ddlIsCash.value == "null") {
            DisplayMassage(" برجاء اختيار طريقه الدفع", "Please choose a payment method", MessageType.Error);
            Errorinput(ddlIsCash);
            return false;
        }
        else if (ddlCurrency.value == "null") {
            DisplayMassage(" برجاء اختيار العملة", "Please choose currency", MessageType.Error);
            Errorinput(ddlCurrency);
            return false;
        }
        else if (ddlTaxTypeHeader.value == "null") {
            DisplayMassage(" برجاء اختيار نوع الضريبة", "Please select the type of tax", MessageType.Error);
            Errorinput(ddlTaxTypeHeader);
            return false;
        }
        else if (newCount == 0) {
            DisplayMassage(" برجاء ادخال بيانات امر الشراء", "Please enter purchase order data", MessageType.Error);
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
        var RequiredQty = Number($("#txtRequiredQty" + rowcount).val());
        var PriceVal = Number($("#txtPrice" + rowcount).val());
        var ReceivedQty = Number($("#txtReceivedQty" + rowcount).val());
        if ($("#txt_StatusFlag" + rowcount).val() == "d" || $("#txt_StatusFlag" + rowcount).val() == "m") {
            return true;
        }
        else {
            if ($("#txtItemCode" + rowcount).val() == "") {
                DisplayMassage(" برجاءادخال كود الصنف", "Please enter the item code", MessageType.Error);
                Errorinput($("#txtItemCode" + rowcount));
                return false;
            }
            else if (RequiredQty == 0) {
                DisplayMassage(" برجاءادخال الكمية المطلوبه", "Please enter the required quantity", MessageType.Error);
                Errorinput($("#txtRequiredQty" + rowcount));
                return false;
            }
            else if (PriceVal == 0) {
                DisplayMassage(" برجاءادخال السعر", "Please enter the price", MessageType.Error);
                Errorinput($("#txtPrice" + rowcount));
                return false;
            }
            else if (ReceivedQty == 0) {
                DisplayMassage(" برجاءادخال الكميه المستلمه", "Please enter the received quantity", MessageType.Error);
                Errorinput($("#txtReceivedQty" + rowcount));
                return false;
            }
            return true;
        }
    }
    function checkRepeatedItems(itemValue, NumberRowid) {
        var items = Number(CountGrid);
        var flag = false;
        for (var i = 0; i < items - 1; i++) {
            if (NumberRowid != 0) {
                if (Number($("#txtItemNumber" + i).val()) == itemValue && Number($("#txtPurOrderDetailsID" + i).val()) != NumberRowid) {
                    flag = true;
                }
            }
            else {
                if (Number($("#txtItemNumber" + i).val()) == itemValue) {
                    flag = true;
                }
            }
        }
        return flag;
    }
    function clear() {
        $("#div_Data").html('');
        $("#btnPrintTransaction").addClass("display_none");
        CountGrid = 0;
        txtDliveryConditions.value = "";
        txtValidityPeriod.value = "";
        txtShipmentConditions.value = "";
        txtNotes.value = "";
        txtTotal.disabled = true;
        txtVatTotal.disabled = true;
        txtNetTotal.disabled = true;
        txtPurTrNo.value = "";
        txtRefNum.value = "";
        chkReceived.checked = false;
        $("#txtDateHeader").val(GetDate());
        ddlVendorHeader.value = "null";
        ddlSalesmanHeader.value = "null";
        $('#ddlCurrency').prop("value", "null");
        txtPurTrNo.innerText = "";
        ddlTaxTypeHeader.value = "null";
        $("#ddlIsCash").prop("value", "0");
        chkActive.checked = false;
        chkActive.disabled = false;
        $("#txtCreatedAt").prop("value", "");
        $("#txtCreatedBy").prop("value", "");
        $("#txtUpdatedAt").prop("value", "");
        $("#txtUpdatedBy").prop("value", "");
    }
    /////---------------------------------------------------------- Grid controls----------------------------------
    function AddNewRow() {
        if (!SysSession.CurrentPrivileges.AddNew)
            return;
        var CanAdd = true;
        if (CountGrid > 0) {
            var LastRowNo = CountGrid - 1;
            CanAdd = Validation_Grid(LastRowNo);
        }
        if (CanAdd) {
            BuildControls(CountGrid);
            $("#txt_StatusFlag" + CountGrid).val("i"); //In Insert mode
            $("#btnSearchItems" + CountGrid).removeAttr("disabled");
            $("#txtItemCode" + CountGrid).removeAttr("disabled");
            $("#txtRequiredQty" + CountGrid).removeAttr("disabled");
            $("#txtPrice" + CountGrid).removeAttr("disabled");
            $("#txtReceivedQty" + CountGrid).removeAttr("disabled");
            // can delete new inserted record  without need for delete privilage
            $("#btn_minus" + CountGrid).removeClass("display_none");
            $("#btn_minus" + CountGrid).removeAttr("disabled");
            $("#txtItemName" + CountGrid).attr("disabled", "disabled");
            $("#Tax" + CountGrid).attr("disabled", "disabled");
            $("#txtTotal" + CountGrid).attr("disabled", "disabled");
            $("#txtTax" + CountGrid).attr("disabled", "disabled");
            $("#txtTotAfterTax" + CountGrid).attr("disabled", "disabled");
            ComputeTotals();
            CountGrid++;
        }
    }
    function BuildControls(cnt) {
        var html;
        html = "<tr id= \"No_Row" + cnt + "\">\n                    <input id=\"txtPurOrderDetailsID" + cnt + "\" type=\"hidden\" class=\"form-control display_none\"  />\n\t                <input id=\"txtItemNumber" + cnt + "\" type=\"hidden\" class=\"form-control display_none\"  />                   \n                    <input id=\"txtSerial" + cnt + "\" type=\"hidden\" class=\"form-control display_none\" value='" + cnt + "'  />\n                    <td>\n\t\t                <div class=\"form-group\">\n\t\t\t                <span id=\"btn_minus" + cnt + "\"><i class=\"fas fa-minus-circle  btn-minus\"></i></span>\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n                            <div class=\"search-content d-flex justify-content-start align-items-center\">\n                                <button type=\"button\" name=\"InvoiceSearch\" id=\"btnSearchItems" + cnt + "\" name=\"ColSearch\" class=\"style_ButSearch me-1\">\n                                    <i class=\"fas fa-search\"></i>\n                                </button>\n                                <input id=\"txtItemCode" + cnt + "\" name=\"\" disabled type=\"text\" class=\"form-control  text_Display\" />\n                            </div>\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n\t\t\t                <input id=\"txtItemName" + cnt + "\" name=\"\" disabled type=\"text\" class=\"form-control\" />\n\t\t                </div>\n\t                </td>\n\n                    <td>\n\t\t                <div class=\"form-group\">\n\t\t\t                <input type=\"number\"  id=\"txtRequiredQty" + cnt + "\" name=\"quant[10]\" class=\"form-control\" value=\"1\" min=\"1\" max=\"1000\" step=\"1\">\n\t\t                </div>\n\t                </td>\n\n                    <td>\n\t\t                <div class=\"form-group\">\n\t\t\t                <input id=\"txtReceivedQty" + cnt + "\" type=\"number\" class=\"form-control\"  disabled value=\"0\"/>\n\t\t                </div>\n\t                </td>\n\n                    <td>\n\t\t                <div class=\"form-group\">\n\t\t\t                <input id=\"txtPrice" + cnt + "\" type=\"number\" name=\"quant[20]\" class=\"form-control\" value=\"1\" min=\"0\" max=\"1000\" step=\"0.5\"/>\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n\t\t\t                <input id=\"txtTotal" + cnt + "\" type=\"number\"  class=\"form-control\" value=\"0\" />\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n\t\t\t                <input id=\"txtTax" + cnt + "\" type=\"Text\"  class=\"form-control\" value=\"0\"/>\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n\t\t\t                <input id=\"txtTotAfterTax" + cnt + "\" type=\"Text\"  class=\"form-control\" value=\"0\"/>\n\t\t                </div>\n\t                </td>\n                    <input id=\"txt_StatusFlag" + cnt + "\" name = \" \" type = \"hidden\" class=\"form-control\"/>\n                    <input id=\"txt_ID" + cnt + "\" name = \" \" type = \"hidden\" class=\"form-control\" />\n                </tr>";
        $("#div_Data").append(html);
        //// Items Search
        $('#btnSearchItems' + cnt).click(function (e) {
            var sys = new SystemTools();
            sys.FindKey(Modules.PurOrder, "btnSearchItems", "CompCode=" + compcode, function () {
                var id = SearchGrid.SearchDataGrid.SelectedKey;
                var res = false;
                var NumberRowid = Number($("#txtPurOrderDetailsID" + cnt).val());
                res = checkRepeatedItems(id, NumberRowid);
                if (res == false) {
                    if ($("#txt_StatusFlag" + cnt).val() != "i")
                        $("#txt_StatusFlag" + cnt).val("u");
                    var SrcItem = ItemsListDetails.filter(function (s) { return s.ItemID == id; });
                    if (SrcItem.length > 0) {
                        $('#txtItemNumber' + cnt).val(SrcItem[0].ItemID);
                        (SysSession.CurrentEnvironment.ScreenLanguage == "ar") ? $('#txtItemName' + cnt).val(SrcItem[0].DescA) : $('#txtItemName' + cnt).val(SrcItem[0].DescL);
                        $('#txtItemCode' + cnt).val(SrcItem[0].ItemCode);
                        $('#txtRequiredQty' + cnt).val("1");
                        $('#txtReceivedQty' + cnt).val("0");
                        $('#txtPrice' + cnt).val("1");
                        $('#txtTotal' + cnt).val("0");
                        $('#txtTax' + cnt).val("0");
                        $('#txtTotAfterTax' + cnt).val("0");
                    }
                }
                else {
                    DisplayMassage('( لايمكن تكرار نفس الاصناف في أمر الشراء )', 'The same items cannot be duplicated in the Purchase Order', MessageType.Error);
                    $('#txtItemNumber' + cnt).val("0");
                    $('#txtItemName' + cnt).val("");
                    $('#txtItemCode' + cnt).val("");
                    $('#txtRequiredQty' + cnt).val("1");
                    $('#txtReceivedQty' + cnt).val("0");
                    $('#txtPrice' + cnt).val("1");
                    $('#txtTotal' + cnt).val("0");
                    $('#txtTax' + cnt).val("0");
                    $('#txtTotAfterTax' + cnt).val("0");
                }
            });
        });
        // text change
        //Item Code Onchange
        $("#txtItemCode" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
            var ItemCode = $('#txtItemCode' + cnt).val();
            var SrcItem = ItemsListDetails.filter(function (s) { return s.ItemCode == ItemCode; });
            var res = false;
            var NumberRowid = Number($("#txtPurOrderDetailsID" + cnt).val());
            if (SrcItem.length > 0) {
                res = checkRepeatedItems(SrcItem[0].ItemID, NumberRowid);
                if (res == false) {
                    $('#txtItemNumber' + cnt).val(SrcItem[0].ItemID);
                    (SysSession.CurrentEnvironment.ScreenLanguage == "ar") ? $('#txtItemName' + cnt).val(SrcItem[0].DescA) : $('#txtItemName' + cnt).val(SrcItem[0].DescL);
                    $('#txtItemCode' + cnt).val(SrcItem[0].ItemCode);
                    $('#txtRequiredQty' + cnt).val("1");
                    $('#txtReceivedQty' + cnt).val("0");
                    $('#txtPrice' + cnt).val("1");
                    $('#txtTotal' + cnt).val("0");
                    $('#txtTax' + cnt).val("0");
                    $('#txtTotAfterTax' + cnt).val("0");
                }
                else {
                    DisplayMassage('( لايمكن تكرار نفس الاصناف في أمر الشراء )', 'The same items cannot be duplicated in the Purchase Order', MessageType.Error);
                    $('#txtItemNumber' + cnt).val("");
                    $('#txtItemName' + cnt).val("");
                    $('#txtItemCode' + cnt).val("");
                    $('#txtRequiredQty' + cnt).val("1");
                    $('#txtReceivedQty' + cnt).val("0");
                    $('#txtPrice' + cnt).val("1");
                    $('#txtTotal' + cnt).val("0");
                    $('#txtTax' + cnt).val("0");
                    $('#txtTotAfterTax' + cnt).val("0");
                }
            }
            else {
                DisplayMassage("كود الصنف غير صحيح ", "Wrong Item Code ", MessageType.Error);
                $('#txtItemNumber' + cnt).val("0");
                $('#txtItemName' + cnt).val("");
                $('#txtItemCode' + cnt).val("");
                $('#txtRequiredQty' + cnt).val("1");
                $('#txtReceivedQty' + cnt).val("0");
                $('#txtPrice' + cnt).val("1");
                $('#txtTotal' + cnt).val("0");
                $('#txtTax' + cnt).val("0");
                $('#txtTotAfterTax' + cnt).val("0");
            }
        });
        $("#txtRequiredQty" + cnt).on('keyup', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
            var txtRequiredQtyVal = Number($("#txtRequiredQty" + cnt).val());
            $("#txtReceivedQty" + cnt).val(txtRequiredQtyVal);
            var txtReceivedQtyVal = Number($("#txtReceivedQty" + cnt).val());
            var txtPriceValue = $("#txtPrice" + cnt).val();
            if ($("#txtPrice" + cnt).val() == 0) {
                var total = (Number(txtReceivedQtyVal) * 0);
                $("#txtTotal" + cnt).val(total);
                var vatAmount = Number(total) * VatPrc / 100;
                $("#txtTax" + cnt).val(vatAmount);
                var totalAfterVat = Number(vatAmount) + Number(total);
                $("#txtTotAfterTax" + cnt).val(totalAfterVat);
            }
            else {
                var total = (Number(txtReceivedQtyVal) * Number(txtPriceValue));
                $("#txtTotal" + cnt).val(total);
                var vatAmount = Number(total) * VatPrc / 100;
                $("#txtTax" + cnt).val(vatAmount);
                var totalAfterVat = Number(vatAmount) + Number(total);
                $("#txtTotAfterTax" + cnt).val(totalAfterVat);
            }
            ComputeTotals();
        });
        $("#txtPrice" + cnt).on('keyup', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
            var txtRequiredQtyValue = $("#txtReceivedQty" + cnt).val();
            var txtPriceValue = $("#txtPrice" + cnt).val();
            if (Number($("#txtReceivedQty" + cnt).val()) == 0) {
                var total = (Number(txtRequiredQtyValue) * 0);
                $("#txtTotal" + cnt).val(total);
                var vatAmount = Number(total) * VatPrc / 100;
                $("#txtTax" + cnt).val(vatAmount);
                var totalAfterVat = Number(vatAmount) + Number(total);
                $("#txtTotAfterTax" + cnt).val(totalAfterVat);
            }
            else {
                var total = Number(txtRequiredQtyValue) * Number(txtPriceValue);
                var vatAmount = Number(total) * VatPrc / 100;
                $("#txtTax" + cnt).val(vatAmount);
                var total = (Number(txtRequiredQtyValue) * Number(txtPriceValue));
                $("#txtTotal" + cnt).val(total);
                var totalAfterVat = Number(vatAmount) + Number(total);
                $("#txtTotAfterTax" + cnt).val(totalAfterVat);
            }
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
        } // $("#txtDiscoutnval" + cnt).on('keyup', function (e)
        $("#txtReceivedQty" + cnt).on('keyup', function () {
            debugger;
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
            var txtReceivedQtyVal = Number($("#txtReceivedQty" + cnt).val());
            var txtRequiredQtyVal = Number($("#txtRequiredQty" + cnt).val());
            if (txtReceivedQtyVal > txtRequiredQtyVal) {
                DisplayMassage(" لا يجب ان تزيد الكميه المستلمه عن المطلوبه ", 'The received quantity should not exceed required', MessageType.Error);
                $('#txtReceivedQty' + cnt).val(txtRequiredQtyVal);
            }
            else {
                var txtPriceValue = $("#txtPrice" + cnt).val();
                if ($("#txtPrice" + cnt).val() == 0) {
                    var total = (Number(txtReceivedQtyVal) * 0);
                    $("#txtTotal" + cnt).val(total);
                    var vatAmount = Number(total) * VatPrc / 100;
                    $("#txtTax" + cnt).val(vatAmount);
                    var totalAfterVat = Number(vatAmount) + Number(total);
                    $("#txtTotAfterTax" + cnt).val(totalAfterVat);
                }
                else {
                    var total = (Number(txtReceivedQtyVal) * Number(txtPriceValue));
                    $("#txtTotal" + cnt).val(total);
                    var vatAmount = Number(total) * VatPrc / 100;
                    $("#txtTax" + cnt).val(vatAmount);
                    var totalAfterVat = Number(vatAmount) + Number(total);
                    $("#txtTotAfterTax" + cnt).val(totalAfterVat);
                }
            }
            ComputeTotals();
        });
        if (ShowFlag == true) {
            // disabled
            $("#txtRequiredQty" + cnt).attr("disabled", "disabled");
            $("#txtReceivedQty" + cnt).attr("disabled", "disabled");
            $("#txtPrice" + cnt).attr("disabled", "disabled");
            $("#txtTotal" + cnt).attr("disabled", "disabled");
            $("#txtTax" + cnt).attr("disabled", "disabled");
            $("#txtTotAfterTax" + cnt).attr("disabled", "disabled");
            $("#txtItemName" + cnt).attr("disabled", "disabled");
            $("#btnAddDetails").addClass("display_none");
            $("#btn_minus" + cnt).addClass("display_none");
            $("#btn_minus" + cnt).attr("disabled", "disabled");
            //bind Data
            $("#txt_StatusFlag" + cnt).val("u");
            $("#txtItemCode" + cnt).prop("value", RetrivedPurOrderDetailsModel[cnt].ItemCode);
            $("#txtItemNumber" + cnt).prop("value", RetrivedPurOrderDetailsModel[cnt].ItemID);
            (SysSession.CurrentEnvironment.ScreenLanguage == "ar") ? $('#txtItemName' + cnt).val(RetrivedPurOrderDetailsModel[cnt].itm_DescA) : $('#txtItemName' + cnt).val(RetrivedPurOrderDetailsModel[cnt].itm_DescE);
            $("#txtSerial" + cnt).prop("value", ((RetrivedPurOrderDetailsModel[cnt].Serial == null || undefined) ? 0 : RetrivedPurOrderDetailsModel[cnt].Serial));
            $("#txtRequiredQty" + cnt).prop("value", ((RetrivedPurOrderDetailsModel[cnt].POStockQty == null || undefined) ? 0 : RetrivedPurOrderDetailsModel[cnt].POStockQty));
            $("#txtReceivedQty" + cnt).prop("value", ((RetrivedPurOrderDetailsModel[cnt].TotRecQty == null || undefined) ? 0 : RetrivedPurOrderDetailsModel[cnt].TotRecQty));
            $("#txtPrice" + cnt).prop("value", (RetrivedPurOrderDetailsModel[cnt].UnitPrice == null || undefined) ? 0 : RetrivedPurOrderDetailsModel[cnt].UnitPrice.RoundToSt(2));
            var price = RetrivedPurOrderDetailsModel[cnt].UnitPrice;
            var qutity = RetrivedPurOrderDetailsModel[cnt].TotRecQty;
            var total = price * qutity;
            var tax = (total * VatPrc / 100).RoundToSt(2);
            var totalAfterTax = (Number(total) + Number(tax)).RoundToSt(2);
            $("#txtTotal" + cnt).prop("value", total);
            $("#txtTax" + cnt).prop("value", tax);
            $("#txtTotAfterTax" + cnt).prop("value", totalAfterTax);
            $("#txtPurOrderDetailsID" + cnt).prop("value", RetrivedPurOrderDetailsModel[cnt].PurOrderDetailsID);
            ComputeTotals();
        }
        return;
    }
    function ComputeTotals() {
        var total = 0;
        var NetTotal = 0;
        var VatTotal = 0;
        for (var i = 0; i < CountGrid; i++) {
            var flagvalue = $("#txt_StatusFlag" + i).val();
            if (flagvalue != "d" && flagvalue != "m") {
                total += Number($("#txtTotal" + i).val());
                VatTotal += Number($("#txtTax" + i).val());
                NetTotal += Number($("#txtTotAfterTax" + i).val());
            }
        }
        $("#txtTotal").val(total.RoundToSt(2));
        $("#txtVatTotal").val(VatTotal.RoundToSt(2));
        $("#txtNetTotal").val(NetTotal.RoundToSt(2));
    }
    function DeleteRow(RecNo) {
        if (!SysSession.CurrentPrivileges.Remove)
            return;
        WorningMessage("هل تريد الحذف؟", "Do you want to delete?", "تحذير", "worning", function () {
            $("#txt_StatusFlag" + RecNo).val() == 'i' ? $("#txt_StatusFlag" + RecNo).val('m') : $("#txt_StatusFlag" + RecNo).val('d');
            ComputeTotals();
            $("#txtItemName" + RecNo).val("Null");
            $("#txtRequiredQty" + RecNo).val("1");
            $("#txtItemCode" + RecNo).val("1");
            $("#txtPrice" + RecNo).val("1");
            $("#txtReceivedQty" + RecNo).val("2");
            $("#txtTax" + RecNo).val("0");
            $("#No_Row" + RecNo).attr("hidden", "true");
        });
    }
    /////---------------------------------------------------------- main functions ----------------------------------
    function Assign() {
        MasterDetailModel = new PurchaseOrderMasterDetails();
        var StatusFlag;
        PurOrderModel = new I_Pur_Tr_PurchaseOrder();
        PurOrderDetailsModel = new Array();
        //Header
        PurOrderModel.CompCode = Number(compcode);
        PurOrderModel.BranchCode = Number(BranchCode);
        PurOrderModel.TrDate = txtDateHeader.value;
        PurOrderModel.RefNO = txtRefNum.value;
        PurOrderModel.IsReceived = chkReceived.checked;
        PurOrderModel.Total = Number(txtTotal.value);
        PurOrderModel.VatAmount = Number(txtVatTotal.value);
        PurOrderModel.NetDue = Number(txtNetTotal.value);
        if (chkActive.checked == true) {
            PurOrderModel.Status = 1;
        }
        else {
            PurOrderModel.Status = 0;
        }
        PurOrderModel.SalesmanId = Number(ddlSalesmanHeader.value);
        PurOrderModel.VendorID = Number(ddlVendorHeader.value);
        PurOrderModel.VATType = Number(ddlTaxTypeHeader.value);
        PurOrderModel.Remarks = txtNotes.value;
        PurOrderModel.DliveryConditions = txtDliveryConditions.value;
        PurOrderModel.ShipmentConditions = txtShipmentConditions.value;
        PurOrderModel.ValidityPeriod = txtValidityPeriod.value;
        PurOrderModel.CurrencyID = Number(ddlCurrency.value);
        if (ddlIsCash.value == "0") {
            PurOrderModel.IsCash = false;
        }
        else {
            PurOrderModel.IsCash = true;
        }
        // Details
        for (var i = 0; i < CountGrid; i++) {
            PurOrderSingleModel = new I_Pur_Tr_PurchaseOrderDetail();
            StatusFlag = $("#txt_StatusFlag" + i).val();
            if (StatusFlag == "i") {
                PurOrderSingleModel.PurOrderDetailsID = 0;
                PurOrderSingleModel.ItemID = $("#txtItemNumber" + i).val();
                PurOrderSingleModel.Serial = $("#txtSerial" + i).val();
                PurOrderSingleModel.StatusFlag = StatusFlag.toString();
                PurOrderSingleModel.TotRecQty = $('#txtReceivedQty' + i).val();
                PurOrderSingleModel.POStockQty = $("#txtRequiredQty" + i).val();
                PurOrderSingleModel.POQty = $("#txtRequiredQty" + i).val();
                var SelectedItem = ItemsListDetails.filter(function (x) { return x.ItemID == PurOrderSingleModel.ItemID; });
                PurOrderSingleModel.UnitID = SelectedItem[0].UomID;
                PurOrderSingleModel.VatAmount = $("#txtTax" + i).val();
                PurOrderSingleModel.UnitPrice = $("#txtPrice" + i).val();
                PurOrderSingleModel.NetUnitCost = $("#txtTotAfterTax" + i).val();
                PurOrderSingleModel.VatPrc = VatPrc;
                PurOrderDetailsModel.push(PurOrderSingleModel);
            }
            if (StatusFlag == "u") {
                PurOrderSingleModel.PurOrderDetailsID = $("#txtPurOrderDetailsID" + i).val();
                PurOrderSingleModel.ItemID = $("#txtItemNumber" + i).val();
                PurOrderSingleModel.Serial = $("#txtSerial" + i).val();
                PurOrderSingleModel.StatusFlag = StatusFlag.toString();
                PurOrderSingleModel.TotRecQty = $('#txtReceivedQty' + i).val();
                PurOrderSingleModel.POStockQty = $("#txtRequiredQty" + i).val();
                PurOrderSingleModel.POQty = $("#txtRequiredQty" + i).val();
                var SelectedItem = ItemsListDetails.filter(function (x) { return x.ItemID == PurOrderSingleModel.ItemID; });
                PurOrderSingleModel.UnitID = SelectedItem[0].UomID;
                PurOrderSingleModel.VatAmount = $("#txtTax" + i).val();
                PurOrderSingleModel.UnitPrice = $("#txtPrice" + i).val();
                PurOrderSingleModel.NetUnitCost = $("#txtTotAfterTax" + i).val();
                PurOrderSingleModel.VatPrc = VatPrc;
                PurOrderDetailsModel.push(PurOrderSingleModel);
            }
            if (StatusFlag == "d") {
                if ($("#txtPurOrderDetailsID" + i).val() != "") {
                    var deletedID = $("#txtPurOrderDetailsID" + i).val();
                    PurOrderSingleModel.StatusFlag = StatusFlag.toString();
                    PurOrderSingleModel.PurOrderDetailsID = deletedID;
                    PurOrderDetailsModel.push(PurOrderSingleModel);
                }
            }
        }
        MasterDetailModel.I_Pur_Tr_PurchaseOrder = PurOrderModel;
        MasterDetailModel.I_Pur_Tr_PurchaseOrderDetail = PurOrderDetailsModel;
        MasterDetailModel.Branch_Code = SysSession.CurrentEnvironment.BranchCode;
        MasterDetailModel.Comp_Code = SysSession.CurrentEnvironment.CompCode;
        MasterDetailModel.MODULE_CODE = Modules.PurOrder;
        MasterDetailModel.UserCode = SysSession.CurrentEnvironment.UserCode;
        MasterDetailModel.sec_FinYear = SysSession.CurrentEnvironment.CurrentYear;
    }
    function Insert() {
        MasterDetailModel.UserCode = SysSession.CurrentEnvironment.UserCode;
        MasterDetailModel.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
        MasterDetailModel.I_Pur_Tr_PurchaseOrder.CreatedBy = SysSession.CurrentEnvironment.UserCode;
        MasterDetailModel.I_Pur_Tr_PurchaseOrder.CreatedAt = DateTimeFormat(Date().toString());
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("PurTrReceive", "InsertPurOrderMasterDetail"),
            data: JSON.stringify(MasterDetailModel),
            success: function (d) {
                var result = d;
                if (result.IsSuccess == true) {
                    var res = result.Response;
                    DateSetsSccess("txtDateHeader", "txtFromDate", "txtToDate");
                    DisplayMassage(" تم اصدار  أمر شراء رقم  " + res.TrNo + " ", "Succeed" + res.TrNo, MessageType.Succeed);
                    txtPurTrNo.innerText = res.TrNo.toString();
                    GlobalPurOrderID = res.PurOrderID;
                    InitializeGrid();
                    BindAfterInsertorUpdate();
                    $("#btnPrintTransaction").removeClass("display_none");
                    Save_Succ_But();
                }
                else {
                    DisplayMassage(" هناك خطـأ  ", "Error", MessageType.Error);
                }
            }
        });
    }
    function Update() {
        MasterDetailModel.UserCode = SysSession.CurrentEnvironment.UserCode;
        MasterDetailModel.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
        MasterDetailModel.I_Pur_Tr_PurchaseOrder.UpdatedBy = SysSession.CurrentEnvironment.UserCode;
        MasterDetailModel.I_Pur_Tr_PurchaseOrder.UpdatedAt = DateTimeFormat(Date().toString());
        MasterDetailModel.I_Pur_Tr_PurchaseOrder.CreatedBy = RetrivedPurOrderModel.CreatedBy;
        MasterDetailModel.I_Pur_Tr_PurchaseOrder.CreatedAt = RetrivedPurOrderModel.CreatedAt;
        MasterDetailModel.I_Pur_Tr_PurchaseOrder.TrNo = RetrivedPurOrderModel.TrNo;
        MasterDetailModel.I_Pur_Tr_PurchaseOrder.PurOrderID = RetrivedPurOrderModel.PurOrderID;
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("PurTrReceive", "UpdatePurOrderDetail"),
            data: JSON.stringify(MasterDetailModel),
            success: function (d) {
                var result = d;
                if (result.IsSuccess == true) {
                    var res = result.Response;
                    DateSetsSccess("txtDateHeader", "txtFromDate", "txtToDate");
                    DisplayMassage(" تم تعديل امر  شراء  رقم  " + res.TrNo + " ", "Modified" + res.TrNo, MessageType.Succeed);
                    txtPurTrNo.innerText = res.TrNo.toString();
                    GlobalPurOrderID = res.PurOrderID;
                    InitializeGrid();
                    BindAfterInsertorUpdate();
                    $("#btnPrintTransaction").removeClass("display_none");
                    Save_Succ_But();
                }
                else {
                    DisplayMassage(" هناك خطـأ  ", "Error", MessageType.Error);
                }
            }
        });
    }
    function openInvoice() {
        Assign();
        MasterDetailModel.UserCode = SysSession.CurrentEnvironment.UserCode;
        MasterDetailModel.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
        MasterDetailModel.I_Pur_Tr_PurchaseOrder.UpdatedBy = SysSession.CurrentEnvironment.UserCode;
        MasterDetailModel.I_Pur_Tr_PurchaseOrder.UpdatedAt = DateTimeFormat(Date().toString());
        MasterDetailModel.I_Pur_Tr_PurchaseOrder.CreatedBy = RetrivedPurOrderModel.CreatedBy;
        MasterDetailModel.I_Pur_Tr_PurchaseOrder.CreatedAt = RetrivedPurOrderModel.CreatedAt;
        MasterDetailModel.I_Pur_Tr_PurchaseOrder.TrNo = RetrivedPurOrderModel.TrNo;
        MasterDetailModel.I_Pur_Tr_PurchaseOrder.PurOrderID = RetrivedPurOrderModel.PurOrderID;
        MasterDetailModel.I_Pur_Tr_PurchaseOrder.Status = 0;
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("PurTrReceive", "OpenPurOrder"),
            data: JSON.stringify(MasterDetailModel),
            success: function (d) {
                var res = d;
                btnUpdate.disabled = false;
                chkActive.disabled = true;
                $("#btnUpdate").removeClass("display_none");
                GlobalPurOrderID = res.PurOrderID;
                InitializeGrid();
                BindAfterInsertorUpdate();
            }
        });
    }
    function BindAfterInsertorUpdate() {
        $("#divEdit").removeClass("display_none");
        $("#PurOrderDetails").removeClass("display_none");
        AfterInsertOrUpdateFlag = true;
        MasterGridDoubleClick();
        $("#DivFilter").removeClass("disabledDiv");
        $("#divIconbar").removeClass("disabledIconbar");
        $("#divMasterGridiv").removeClass("disabledDiv");
        $("#divMasterGridiv").removeClass("display_none");
        $("#divDetails").removeClass("display_none");
    }
    /////---------------------------------------------------------- Get functions ----------------------------------
    function GetAllItems() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("StkDefItems", "GetAllFromItems"),
            data: { CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    ItemsListDetails = new Array();
                    ItemsListDetails = result.Response;
                }
            }
        });
    }
    function GetDate() {
        var today = new Date();
        var dd = today.getDate().toString();
        var ReturnedDate;
        var mm = (today.getMonth() + 1).toString();
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
    /////---------------------------------------------------------- Print ----------------------------------
    function PrintReport(OutType) {
        ////debugger
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
        if (ddlSalesmanMaster.selectedIndex > 0)
            rp.SalesmanID = Number($("#ddlSalesmanMaster").val());
        else
            rp.SalesmanID = -1;
        if (ddlVendorMaster.selectedIndex > 0)
            rp.VendorId = Number($("#ddlVendorMaster").val());
        else
            rp.VendorId = -1;
        if (Number($("#ddlStateType").val()) == 0) {
            rp.Status = 0;
        }
        else if (Number($("#ddlStateType").val()) == 1) {
            rp.Status = 1;
        }
        else {
            rp.Status = 2;
        }
        if (Number($("#ddlcashType").val()) == 0) {
            rp.CashType = 0;
        }
        else if (Number($("#ddlcashType").val()) == 1) {
            rp.CashType = 1;
        }
        else {
            rp.CashType = 2;
        }
        Ajax.Callsync({
            url: Url.Action("IProc_Rpt_PurPurchaseOrderList", "GeneralReports"),
            data: rp,
            success: function (d) {
                var result = d.result;
                window.open(result, "_blank");
            }
        });
    }
    function btnPrintPurchaseDemand_onclick() {
        debugger;
        if (!SysSession.CurrentPrivileges.PrintOut)
            return;
        var rp = new ReportParameters();
        rp.Type = 0;
        rp.Repdesign = 1;
        rp.TRId = GlobalPurOrderID;
        rp.Name_function = "IProc_Prnt_PurPurchaseOrder";
        localStorage.setItem("Report_Data", JSON.stringify(rp));
        localStorage.setItem("result", '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>');
        window.open(Url.Action("ReportsPopup", "Home"), "_blank");
    }
})(PurOrder || (PurOrder = {}));
//# sourceMappingURL=PurOrder.js.map