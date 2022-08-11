﻿
$(document).ready(() => {
    //////////debugger;
    PurOrder.InitalizeComponent();
})

namespace PurOrder {
    //system varables
    var SysSession: SystemSession = GetSystemSession(Modules.PurOrder);
    var compcode: Number;
    var BranchCode: number;
    var sys: SystemTools = new SystemTools();
    var FinYear: number;

    //Arrays
    var CashboxDetails: Array<A_RecPay_D_CashBox> = new Array<A_RecPay_D_CashBox>();
    var SellerDetails: Array<I_Sls_D_Salesman> = new Array<I_Sls_D_Salesman>();
    var CurrencyDetails: Array<G_Currency> = new Array<G_Currency>();
    var StateDetailsAr: Array<string> = new Array<string>();
    var StateDetailsEn: Array<string> = new Array<string>();
    var VendorDetails: Array<A_Pay_D_Vendor> = new Array<A_Pay_D_Vendor>();
    var SearchDetails: Array<IQ_GetPurchaseOrder> = new Array<IQ_GetPurchaseOrder>(); 
    var G_USERSDetails: Array<G_USERS> = new Array<G_USERS>();
    var PurchaseOrderViewWithDetail: IQ_PurchaseOrderWithDetail = new IQ_PurchaseOrderWithDetail();
    var ItemsListDetails: Array<I_Item> = new Array<I_Item>();
    //Models
    var RetrivedPurOrderModel: IQ_GetPurchaseOrder = new IQ_GetPurchaseOrder();
    var RetrivedPurOrderDetailsModel: Array<IQ_GetPurchaseOrderDetail> = new Array<IQ_GetPurchaseOrderDetail>();
    var PurOrderModel: I_Pur_Tr_PurchaseOrder = new I_Pur_Tr_PurchaseOrder();
    var ItemDetails: Array<IQ_GetPurReceiveItem> = new Array<IQ_GetPurReceiveItem>();
    var PurOrderDetailsModel: Array<I_Pur_Tr_PurchaseOrderDetail> = new Array<I_Pur_Tr_PurchaseOrderDetail>();
    var PurOrderSingleModel: I_Pur_Tr_PurchaseOrderDetail = new I_Pur_Tr_PurchaseOrderDetail();
    var MasterDetailModel: PurchaseOrderMasterDetails = new PurchaseOrderMasterDetails();
    var AllPurReceiveMasterDetailModel: IQ_GetPurReceiveMasterDisplay = new IQ_GetPurReceiveMasterDisplay();


    //DropDownlist
    var ddlStateType: HTMLSelectElement;
    var ddlcashType: HTMLSelectElement;
    var ddlSalesmanMaster: HTMLSelectElement;
    var ddlVendorMaster: HTMLSelectElement;
    var ddlSeller: HTMLSelectElement;
    var FamilyDetails: Array<I_ItemFamily> = new Array<I_ItemFamily>();
    var ItemBaesdFamilyDetails: Array<IQ_GetItemStoreInfo> = new Array<IQ_GetItemStoreInfo>();
    var VatTypeData: Array<A_D_VAT_TYPE> = new Array<A_D_VAT_TYPE>();
    var AddonsData: Array<I_Pur_D_Charges> = new Array<I_Pur_D_Charges>();

    // giedView
    var divMasterGrid: JsGrid = new JsGrid();

    //Textboxes
    var txtNotes: HTMLInputElement;
    var txtFromDate: HTMLInputElement;
    var txtToDate: HTMLInputElement;
    var txtDateHeader: HTMLInputElement;
    var txtSearchBox: HTMLInputElement;
    var ddlVendorHeader: HTMLSelectElement;
    var ddlSalesmanHeader: HTMLSelectElement;
    var txtTotal: HTMLInputElement;
    var txtVatTotal: HTMLInputElement;
    var txtNetTotal: HTMLInputElement;
    var txtRefNum: HTMLInputElement;
    var txtCreatedAt : HTMLInputElement;
    var txtCreatedBy: HTMLInputElement;
    var txtUpdatedAt : HTMLInputElement;
    var txtUpdatedBy: HTMLInputElement;
    var txtDliveryConditions: HTMLInputElement;
    var txtValidityPeriod : HTMLInputElement;
    var txtShipmentConditions : HTMLInputElement;

    var chkActive: HTMLInputElement;
    var chkReceived: HTMLInputElement;
    //buttons 
    var btnUpdate: HTMLButtonElement;
    var btnShow: HTMLButtonElement;
    var ddlIsCash: HTMLSelectElement;
    var ddlCurrency: HTMLSelectElement;
    var ddlTaxTypeHeader: HTMLSelectElement
    var btnAddDetails: HTMLButtonElement;
    var btnSave: HTMLButtonElement;
    var btnBack: HTMLButtonElement;
    var btnAdd: HTMLButtonElement;

    //flags
    var GlobalPurOrderID: number = 0;
    var ModeType = 2;//1 view , 2 insert , 3 update 
    var AfterInsertOrUpdateFlag: boolean = false;
    var ShowFlag: boolean;
    var CountGrid = 0;
    var txtPurTrNo: HTMLInputElement;
    var VatDetails: Array<A_D_VAT_TYPE> = new Array<A_D_VAT_TYPE>();
    
    var DefVatType =SysSession.CurrentEnvironment.I_Control[0].DefPurVatType; 
    var VatPrc;
    var lang: string;
    var GlobalCurrency: number;

    // Print Buttons
    var btnPrintTrview: HTMLButtonElement;
    var btnPrintTrPDF: HTMLButtonElement;
    var btnPrintTrEXEL: HTMLButtonElement;
 //   var btnPrint: HTMLButtonElement;           
    var btnPrintTransaction: HTMLButtonElement;
    //------------------------------------------------------------- main regions-------------------------------------
    export function InitalizeComponent() {
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
        btnPrintTrview.onclick = () => { PrintReport(1); }
        btnPrintTrPDF.onclick = () => { PrintReport(2); }
        btnPrintTrEXEL.onclick = () => { PrintReport(3); }
        //btnPrint.onclick = () => { PrintReport(4); }          
        btnPrintTransaction.onclick = btnPrintPurchaseDemand_onclick;

        txtSearchBox.onkeyup = _SearchBox_Change;

    }
    function InitalizeControls() {
        // print ----*
        btnPrintTrview = document.getElementById("btnPrintTrview") as HTMLButtonElement;
        btnPrintTrPDF = document.getElementById("btnPrintTrPDF") as HTMLButtonElement;
        btnPrintTrEXEL = document.getElementById("btnPrintTrEXEL") as HTMLButtonElement;
      //  btnPrint = document.getElementById("btnPrint") as HTMLButtonElement;                       
        btnPrintTransaction = document.getElementById("btnPrintTransaction") as HTMLButtonElement;
        
        //Drop Downlists
        ddlStateType = document.getElementById("ddlStateType") as HTMLSelectElement;
        ddlcashType = document.getElementById("ddlcashType") as HTMLSelectElement;
        ddlSalesmanMaster = document.getElementById("ddlSalesmanMaster") as HTMLSelectElement;
        ddlVendorMaster = document.getElementById("ddlVendorMaster") as HTMLSelectElement;
        ddlSeller = document.getElementById("ddlSeller") as HTMLSelectElement;

        //textboxes
        txtFromDate = document.getElementById("txtFromDate") as HTMLInputElement;
        txtToDate = document.getElementById("txtToDate") as HTMLInputElement;
        txtNotes = document.getElementById("txtNotes") as HTMLInputElement;
        txtRefNum = document.getElementById("txtRefNum") as HTMLInputElement;
        txtSearchBox = document.getElementById("txtSearchBox") as HTMLInputElement;
        txtDateHeader = document.getElementById("txtDateHeader") as HTMLInputElement;
        ddlVendorHeader = document.getElementById("ddlVendorHeader") as HTMLSelectElement;
        ddlSalesmanHeader = document.getElementById("ddlSalesmanHeader") as HTMLSelectElement;
        txtPurTrNo = document.getElementById("txtPurTrNo") as HTMLInputElement;
        txtTotal = document.getElementById("txtTotal") as HTMLInputElement;
        txtVatTotal = document.getElementById("txtVatTotal") as HTMLInputElement;
        txtNetTotal = document.getElementById("txtNetTotal") as HTMLInputElement;
        txtCreatedAt = document.getElementById("txtCreatedAt") as HTMLInputElement;
        txtCreatedBy = document.getElementById("txtCreatedBy") as HTMLInputElement;
        txtUpdatedAt = document.getElementById("txtUpdatedAt") as HTMLInputElement;
        txtUpdatedBy = document.getElementById("txtUpdatedBy") as HTMLInputElement;
        txtDliveryConditions = document.getElementById("txtDliveryConditions") as HTMLInputElement;
        txtValidityPeriod = document.getElementById("txtValidityPeriod") as HTMLInputElement;
        txtShipmentConditions = document.getElementById("txtShipmentConditions") as HTMLInputElement;
        chkReceived = document.getElementById("chkReceived") as HTMLInputElement;

        //buttons
        btnShow = document.getElementById("btnShow") as HTMLButtonElement;
        ddlIsCash = document.getElementById("ddlIsCash") as HTMLSelectElement;
        ddlCurrency = document.getElementById("ddlCurrency") as HTMLSelectElement;
        ddlTaxTypeHeader = document.getElementById("ddlTaxTypeHeader") as HTMLSelectElement;
        chkActive = document.getElementById("chkActive") as HTMLInputElement;
        btnAddDetails = document.getElementById("btnAddDetails") as HTMLButtonElement;
        btnUpdate = document.getElementById("btnUpdate") as HTMLButtonElement;
        btnBack = document.getElementById("btnBack") as HTMLButtonElement;
        btnSave = document.getElementById("btnSave") as HTMLButtonElement;
        btnAdd = document.getElementById("btnAdd") as HTMLButtonElement;

        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = "أمر شراء";

        } else {
            document.getElementById('Screen_name').innerHTML = "Purchase Order";

        }

    }
    function Check_on_user_type() {

        //debugger
        if (SysSession.CurrentEnvironment.UserType == 1 || SysSession.CurrentEnvironment.UserType == 3) { //Salesman

            let SalesId = SysSession.CurrentEnvironment.SalesManID;
            SellerDetails = SellerDetails.filter(s => s.SalesmanId == SalesId);

        }
        else if (SysSession.CurrentEnvironment.UserType == 2 || SysSession.CurrentEnvironment.UserType == 3) {//CashBox

            let CashBoxID = SysSession.CurrentEnvironment.CashBoxID;
            CashboxDetails = CashboxDetails.filter(s => s.CashBoxID == CashBoxID);
        }

    }
        //------------------------------------------------------------- Normal Grid regions-------------------------------------
    function InitializeGrid() {
        let res: any = GetResourceList("");
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
        let CashType = Number(ddlcashType.value.toString())

        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("PurTrReceive", "GetAllPurOrder"),
            data: { CompCode: compcode, BranchCode: BranchCode, startDate: startdt, endDate: enddt, Status: status, CashType: CashType, VendorId: vendorId, SalesmanId: salesmanId, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    PurchaseOrderViewWithDetail = result.Response as IQ_PurchaseOrderWithDetail;

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
        

        let Selecteditem = PurchaseOrderViewWithDetail.IQ_GetPurchaseOrder.filter(x => x.PurOrderID == Number(divMasterGrid.SelectedKey));
        if (AfterInsertOrUpdateFlag == true) {
            Selecteditem = PurchaseOrderViewWithDetail.IQ_GetPurchaseOrder.filter(x => x.PurOrderID == Number(GlobalPurOrderID));
            AfterInsertOrUpdateFlag = false;
        }
        GlobalPurOrderID = Number(Selecteditem[0].PurOrderID);

        RetrivedPurOrderModel = new IQ_GetPurchaseOrder();
        RetrivedPurOrderModel = Selecteditem[0];
        //Header
        $("#txtDateHeader").val(RetrivedPurOrderModel.TrDate.toString());
        txtPurTrNo.value = RetrivedPurOrderModel.TrNo.toString()
        ddlVendorHeader.value = RetrivedPurOrderModel.VendorID.toString()
        ddlSalesmanHeader.value = RetrivedPurOrderModel.SalesmanId.toString()
        txtPurTrNo.innerText = RetrivedPurOrderModel.TrNo.toString()
        ddlTaxTypeHeader.value = RetrivedPurOrderModel.VATType.toString()
        txtNotes.value = RetrivedPurOrderModel.Remarks.toString();
        txtRefNum.value = RetrivedPurOrderModel.RefNO.toString();
        chkReceived.checked = RetrivedPurOrderModel.IsReceived;

        txtValidityPeriod.value = RetrivedPurOrderModel.ValidityPeriod.toString();
        txtDliveryConditions.value = RetrivedPurOrderModel.DliveryConditions.toString();
        txtShipmentConditions.value = RetrivedPurOrderModel.ShipmentConditions.toString();

        txtTotal.value = RetrivedPurOrderModel.Total.toString();
        txtVatTotal.value = RetrivedPurOrderModel.VatAmount.toString();
        txtNetTotal.value = RetrivedPurOrderModel.NetDue.toString();
        if (RetrivedPurOrderModel.CurrencyID != null)
            ddlCurrency.value = RetrivedPurOrderModel.CurrencyID.toString();
        if (RetrivedPurOrderModel.IsCash == true) { ddlIsCash.value = '1'; }
        else { ddlIsCash.value = '0'; }

        $("#txtCreatedAt").prop("value", RetrivedPurOrderModel.CreatedAt);
        $("#txtCreatedBy").prop("value", RetrivedPurOrderModel.CreatedBy);


        $("#txtUpdatedAt").prop("value", RetrivedPurOrderModel.UpdatedAt);
        $("#txtUpdatedBy").prop("value", RetrivedPurOrderModel.UpdatedBy);


        chkActive.checked = RetrivedPurOrderModel.Status == 0 ? false : true;

        //Detail
        RetrivedPurOrderDetailsModel = new Array<IQ_GetPurchaseOrderDetail>();
        RetrivedPurOrderDetailsModel = PurchaseOrderViewWithDetail.IQ_GetPurchaseOrderDetail.filter(x => x.PurOrderID == GlobalPurOrderID);

        for (let i = 0; i < RetrivedPurOrderDetailsModel.length; i++) {
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

        } else {
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
        } else {
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

        if (!ValidationHeader() )
            return;

        for (let i = 0; i < CountGrid; i++) {
            if (!Validation_Grid(i))
                return;
        }

        Assign();
        if (ModeType == 2)//Insert
        {
            Insert();
        }
        else if (ModeType == 3)//update
        {
            Update();
        }
                                                            
    }, 100);
    }
    function addFunc() {
        if (!SysSession.CurrentPrivileges.AddNew) return;
        ModeType = 2;//insert
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
        if (!SysSession.CurrentPrivileges.EDIT) return;
        ShowFlag = false;
        ModeType = 3;//update                               
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
        let fltr = VatDetails.filter(x => (x.CODE == (ddlTaxTypeHeader.value == "null" ? DefVatType : ddlTaxTypeHeader.value)));
        if (fltr.length != 0)
            VatPrc = fltr[0].VatPerc;
        else
            VatPrc = VatDetails.filter(x => x.CODE == Number(DefVatType))[0].VatPerc;
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
            } else {
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


                chkActive.disabled = true;
                btnUpdate.disabled = false;
            }
        }
    }
    function _SearchBox_Change() {
        if (txtSearchBox.value != "") {

            let search: string = txtSearchBox.value.toLowerCase();
            SearchDetails = PurchaseOrderViewWithDetail.IQ_GetPurchaseOrder.filter(x => x.TrNo.toString().search(search) >= 0 || x.Vnd_NameA.toLowerCase().search(search) >= 0
                || x.vnd_NameE.toLowerCase().search(search) >= 0 || x.Slsm_NameA.toLowerCase().search(search) >= 0 || x.Slsm_NameE.toLowerCase().search(search) >= 0
                || x.RefNO.toString().search(search) >= 0  );

            divMasterGrid.DataSource = SearchDetails;
            divMasterGrid.Bind();
        } else {
            divMasterGrid.DataSource = PurchaseOrderViewWithDetail.IQ_GetPurchaseOrder;
            divMasterGrid.Bind();
        }
    }

//-------------------------------------------------------------- Fill DropDown Region-------------------------------------------------------------
    function FillddlCashBox() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefBox", "GetAll"),
            data: { compCode: compcode, BranchCode: BranchCode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    CashboxDetails = result.Response as Array<A_RecPay_D_CashBox>;
                }
            }
        });
    }
    function FillddlSeller() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("G_USERS", "GetAll"),
            data: { CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    G_USERSDetails = result.Response as Array<G_USERS>;
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
    function FillddlcashType() {

        StateDetailsAr = ["على الحساب", "نقدي", "الجميع"];
        StateDetailsEn = ["Credit", "Cash", "All"];

        if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {

            for (let i = 0; i < StateDetailsEn.length; i++) {
                let newoption = document.createElement("option");
                newoption.value = i.toString();
                newoption.text = StateDetailsEn[i];
                ddlcashType.options.add(newoption);
            }
        }
        else {

            for (let i = 0; i < StateDetailsAr.length; i++) {
                let newoption = document.createElement("option");
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

            for (let i = 0; i < StateDetailsEn.length; i++) {
                let newoption = document.createElement("option");
                newoption.value = i.toString();
                newoption.text = StateDetailsEn[i];
                ddlIsCash.options.add(newoption);
            }
        }
        else {
            for (let i = 0; i < StateDetailsAr.length; i++) {
                let newoption = document.createElement("option");
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
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    CurrencyDetails = result.Response as Array<G_Currency>;

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
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    SellerDetails = result.Response as Array<I_Sls_D_Salesman>;
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
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    VendorDetails = result.Response as Array<A_Pay_D_Vendor>;
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
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {

                    VatDetails = result.Response as Array<A_D_VAT_TYPE>;


                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                        DocumentActions.FillCombowithdefult(VatDetails, ddlTaxTypeHeader, "CODE", "DESCRIPTION", "Select Tax");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(VatDetails, ddlTaxTypeHeader, "CODE", "DESCRIPTION", "اختر الضريبة");
                    }
                 
                    ddlTaxTypeHeader.value = DefVatType.toString();
                    VatPrc = VatDetails.filter(x => x.CODE == Number(ddlTaxTypeHeader.value))[0].VatPerc;
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

        for (let i = 0; i < CountGrid; i++) {

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
        for (let i = 0; i < CountGrid; i++) {

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
        var newCount: number = 0;
        for (let i = 0; i < CountGrid; i++) {
            if ($("#txt_StatusFlag" + i).val() != "d" && $("#txt_StatusFlag" + i).val() != "m") {
                newCount++;
            }
        }
        if (!CheckDate(DateFormat(txtDateHeader.value).toString(), DateFormat(SysSession.CurrentEnvironment.StartDate).toString(), DateFormat(SysSession.CurrentEnvironment.EndDate).toString())) {
            DisplayMassage('  التاريخ ليس متطابق مع تاريخ السنه ' + DateFormat(SysSession.CurrentEnvironment.StartDate).toString(), '  The date is not identical with the date of the year ' + DateFormat(SysSession.CurrentEnvironment.StartDate).toString(), MessageType.Error);
            return false
        }
        if (ddlVendorHeader.value == "null") {
            DisplayMassage(" برجاء اختيار المورد", "Please select vendor", MessageType.Error);
           Errorinput(ddlVendorHeader);
            return false
        }
        else if (ddlSalesmanHeader.value == "null") {
            DisplayMassage(" برجاء اختيار المندوب", "Please select Salesman", MessageType.Error);
            Errorinput(ddlSalesmanHeader);
            return false
        }
        else if (ddlIsCash.value == "null") {
            DisplayMassage(" برجاء اختيار طريقه الدفع", "Please choose a payment method", MessageType.Error);
            Errorinput(ddlIsCash);
            return false
        }
        else if (ddlCurrency.value == "null") {
            DisplayMassage(" برجاء اختيار العملة", "Please choose currency", MessageType.Error);
            Errorinput(ddlCurrency);
            return false
        }
        else if (ddlTaxTypeHeader.value == "null") {
            DisplayMassage(" برجاء اختيار نوع الضريبة", "Please select the type of tax", MessageType.Error);
            Errorinput(ddlTaxTypeHeader);
            return false
        }
        else if (newCount == 0) {
            DisplayMassage(" برجاء ادخال بيانات امر الشراء", "Please enter purchase order data", MessageType.Error);
            return false
        }
        else if (!CheckPeriodDate(txtDateHeader.value, "I")) {
            debugger
            DisplayMassage("لا يمكنك الاضافه او التعديل في هذة الفتره المغلقه ", "Please select a Invoice data", MessageType.Error);
            Errorinput(txtDateHeader);
            return false
        }

        return true;
    }
    function Validation_Grid(rowcount: number) {
        var RequiredQty: number = Number($("#txtRequiredQty" + rowcount).val());
        var PriceVal: number = Number($("#txtPrice" + rowcount).val());
        var ReceivedQty: number = Number($("#txtReceivedQty" + rowcount).val());
        if ($("#txt_StatusFlag" + rowcount).val() == "d" || $("#txt_StatusFlag" + rowcount).val() == "m") {
            return true;
        }
        else {
            if ($("#txtItemCode" + rowcount).val() == "") {
                DisplayMassage(" برجاءادخال كود الصنف", "Please enter the item code", MessageType.Error);
                Errorinput($("#txtItemCode" + rowcount));
                return false
            }
            else if (RequiredQty == 0) {
                DisplayMassage(" برجاءادخال الكمية المطلوبه", "Please enter the required quantity", MessageType.Error);
                Errorinput($("#txtRequiredQty" + rowcount));
                return false
            }
            else if (PriceVal == 0) {
                DisplayMassage(" برجاءادخال السعر", "Please enter the price", MessageType.Error);
                Errorinput($("#txtPrice" + rowcount));
                return false
            }
            else if (ReceivedQty == 0) {
                DisplayMassage(" برجاءادخال الكميه المستلمه", "Please enter the received quantity", MessageType.Error);
                Errorinput($("#txtReceivedQty" + rowcount));
                return false
            }
             return true;
        }
       
    }
    function checkRepeatedItems(itemValue: number, NumberRowid: number)
    {
        var items: number = Number(CountGrid);
        var flag = false;
        for (let i = 0; i < items - 1; i++) {
            if (NumberRowid != 0) {
                if (Number($("#txtItemNumber" + i).val()) == itemValue && Number($("#txtPurOrderDetailsID" + i).val()) != NumberRowid) {
                    flag = true;
                }
            }
            else {
                if (Number($("#txtItemNumber" + i).val()) == itemValue ) {
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
        if (!SysSession.CurrentPrivileges.AddNew) return;
        var CanAdd: boolean = true;
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
    function BuildControls(cnt: number) {
        var html;
        html = `<tr id= "No_Row${cnt}">
                    <input id="txtPurOrderDetailsID${cnt}" type="hidden" class="form-control display_none"  />
	                <input id="txtItemNumber${cnt}" type="hidden" class="form-control display_none"  />                   
                    <input id="txtSerial${cnt}" type="hidden" class="form-control display_none" value='${cnt}'  />
                    <td>
		                <div class="form-group">
			                <span id="btn_minus${cnt}"><i class="fas fa-minus-circle fs-4 btn-minus"></i></span>
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
                            <div class="search-content d-flex justify-content-start align-items-center">
                                <button type="button" name="InvoiceSearch" id="btnSearchItems${cnt}" name="ColSearch" class="style_ButSearch me-1">
                                    <i class="fas fa-search"></i>
                                </button>
                                <input id="txtItemCode${cnt}" name="" disabled type="text" class="form-control  text_Display" />
                            </div>
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
			                <input id="txtItemName${cnt}" name="" disabled type="text" class="form-control" />
		                </div>
	                </td>

                    <td>
		                <div class="form-group">
			                <input type="number"  id="txtRequiredQty${cnt}" name="quant[10]" class="form-control" value="1" min="1" max="1000" step="1">
		                </div>
	                </td>

                    <td>
		                <div class="form-group">
			                <input id="txtReceivedQty${cnt}" type="number" class="form-control"  disabled value="0"/>
		                </div>
	                </td>

                    <td>
		                <div class="form-group">
			                <input id="txtPrice${cnt}" type="number" name="quant[20]" class="form-control" value="1" min="0" max="1000" step="0.5"/>
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
			                <input id="txtTotal${cnt}" type="number"  class="form-control" value="0" />
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
			                <input id="txtTax${cnt}" type="Text"  class="form-control" value="0"/>
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
			                <input id="txtTotAfterTax${cnt}" type="Text"  class="form-control" value="0"/>
		                </div>
	                </td>
                    <input id="txt_StatusFlag${cnt}" name = " " type = "hidden" class="form-control"/>
                    <input id="txt_ID${cnt}" name = " " type = "hidden" class="form-control" />
                </tr>`;
        //html = '<div id= "No_Row' + cnt + '" class="container-fluid style_border" > <div class="" > <div class="col-xs-12" > ' +
        //    '<span id="btn_minus' + cnt + '" class="fa fa-minus-circle fontitm3PurOrder display_none"></span>' +
        //    '<input id="txtPurOrderDetailsID' + cnt + '" type="hidden" class="form-control right2 display_none"  />' +
        //    '<input id="txtItemNumber' + cnt + '" type="hidden" class="form-control right2 display_none"  />' +
        //    '<input id="txtSerial' + cnt + '" type="hidden" class="form-control right2 display_none" value=' + cnt + '  />' +
            
        //    '<div class="col-xs-1" style="width:4%!important;">' +
        //  '<button type="button" class=" src-btn btn btn-warning input-sm col-xs-12" id="btnSearchItems' + cnt + '" name="ColSearch">   ' +
        //    '<i class="fa fa-search"></i></button>' + '</div>' +

        //    '<div class="col-xs-1">' +
        //    '<input id="txtItemCode' + cnt + '" name="" disabled type="text" class="form-control  text_Display" /> </div>' +

        //    '<div class="col-xs-3 p-0">' +
        //    '<input id="txtItemName' + cnt + '" name="" disabled type="text" class="form-control  text_Display" /></div>' +

        //    '<div class="col-xs-1"><input type="number"  id="txtRequiredQty' + cnt + '" name="quant[10]" class="form-control   font1" value="1" min="1" max="1000" step="1"></div>' +

        //    '<div class="col-xs-1">' +
        //    '<input id="txtReceivedQty' + cnt + '" type="number" class="form-control right2"  disabled value="0"/></div>' +

        //    '<div class="col-xs-1"><input type="number" style="height:36px;" id="txtPrice' + cnt + '" name="quant[20]" class="form-control   font1" value="1" min="0" max="1000" step="0.5"> </div>' +

        //    '<div class="col-xs-1">' +
        //    '<input id="txtTotal' + cnt + '" type="number" disabled class="form-control right2"  value="0"/></div>' +
        //    '<div class="col-xs-1">' +
        //    '<input id="txtTax' + cnt + '" disabled type="text" class="form-control right2"  value="0"/></div>' +

        //    '<div class="col-xs-1">' +
        //    '<input id="txtTotAfterTax' + cnt + '" type="text" disabled value="0" class="form-control right2"  /></div>' +

        //    '</div></div></div>' +

        //    '<input id="txt_StatusFlag' + cnt + '" name = " " type = "hidden" class="form-control"/><input id="txt_ID' + cnt + '" name = " " type = "hidden" class="form-control" />';

        $("#div_Data").append(html);

        //// Items Search
        $('#btnSearchItems' + cnt).click(function (e) {
            let sys: SystemTools = new SystemTools();
            sys.FindKey(Modules.PurOrder, "btnSearchItems", "CompCode=" + compcode , () => {
                    let id = SearchGrid.SearchDataGrid.SelectedKey
                    var res = false;
                var NumberRowid = Number($("#txtPurOrderDetailsID" + cnt).val());
                    res = checkRepeatedItems(id, NumberRowid);
                if (res == false) {
                    if ($("#txt_StatusFlag" + cnt).val() != "i")
                        $("#txt_StatusFlag" + cnt).val("u");

                    var SrcItem = ItemsListDetails.filter(s => s.ItemID == id);

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
                    
                }  });
            
        });
        // text change

        //Item Code Onchange
        $("#txtItemCode" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");

            var ItemCode = $('#txtItemCode' + cnt).val();

            var SrcItem = ItemsListDetails.filter(s => s.ItemCode == ItemCode);
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
                
            } else {
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
                    DisplayMassage("كود الصنف غير صحيح ", "Wrong Item Code ", MessageType.Error); $('#txtItemNumber' + cnt).val("0");
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

            var txtRequiredQtyVal: number = Number($("#txtRequiredQty" + cnt).val());
            $("#txtReceivedQty" + cnt).val(txtRequiredQtyVal)
            var txtReceivedQtyVal: number = Number($("#txtReceivedQty" + cnt).val());

            var txtPriceValue = $("#txtPrice" + cnt).val();
            if ($("#txtPrice" + cnt).val() == 0) {
                var total = (Number(txtReceivedQtyVal) * 0);
                $("#txtTotal" + cnt).val(total);
                var vatAmount = Number(total) * VatPrc / 100;
                $("#txtTax" + cnt).val(vatAmount);
                var totalAfterVat = Number(vatAmount) + Number(total);
                $("#txtTotAfterTax" + cnt).val(totalAfterVat);
            } else {
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
            } else {
                var total = Number(txtRequiredQtyValue) * Number(txtPriceValue);
                var vatAmount = Number(total) * VatPrc / 100;
                $("#txtTax" + cnt).val(vatAmount);
                var total = (Number(txtRequiredQtyValue) * Number(txtPriceValue))
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
        }// $("#txtDiscoutnval" + cnt).on('keyup', function (e)
        $("#txtReceivedQty" + cnt).on('keyup', function () {
            debugger
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
            var txtReceivedQtyVal: number = Number($("#txtReceivedQty" + cnt).val());
            var txtRequiredQtyVal: number = Number($("#txtRequiredQty" + cnt).val());
            if (txtReceivedQtyVal > txtRequiredQtyVal) {
                DisplayMassage(" لا يجب ان تزيد الكميه المستلمه عن المطلوبه ", 'The received quantity should not exceed required', MessageType.Error);
                $('#txtReceivedQty' + cnt).val(txtRequiredQtyVal);
            } else {
                var txtPriceValue = $("#txtPrice" + cnt).val();
                if ($("#txtPrice" + cnt).val() == 0) {
                    var total = (Number(txtReceivedQtyVal) * 0);
                    $("#txtTotal" + cnt).val(total);
                    var vatAmount = Number(total) * VatPrc / 100;
                    $("#txtTax" + cnt).val(vatAmount);
                    var totalAfterVat = Number(vatAmount) + Number(total);
                    $("#txtTotAfterTax" + cnt).val(totalAfterVat);
                } else {
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


            var price: number = RetrivedPurOrderDetailsModel[cnt].UnitPrice;
            var qutity: number = RetrivedPurOrderDetailsModel[cnt].TotRecQty;
            var total: number = price * qutity;
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
        var total: number = 0;
        var NetTotal: number = 0;
        var VatTotal: number = 0;

        for (let i = 0; i < CountGrid; i++) {
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
    function DeleteRow(RecNo: number) {
        if (!SysSession.CurrentPrivileges.Remove) return;
        WorningMessage("هل تريد الحذف؟", "Do you want to delete?", "تحذير", "worning", () => {
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
        var StatusFlag: String;
        PurOrderModel = new I_Pur_Tr_PurchaseOrder();
        PurOrderDetailsModel = new Array<I_Pur_Tr_PurchaseOrderDetail>();

        //Header
        PurOrderModel.CompCode = Number(compcode);
        PurOrderModel.BranchCode = Number(BranchCode);
        PurOrderModel.TrDate = txtDateHeader.value;
        PurOrderModel.RefNO = txtRefNum.value;
        PurOrderModel.IsReceived = chkReceived.checked;
        PurOrderModel.Total = Number(txtTotal.value);
        PurOrderModel.VatAmount = Number(txtVatTotal.value);
        PurOrderModel.NetDue = Number(txtNetTotal.value);
        if (chkActive.checked == true) { PurOrderModel.Status = 1; } else { PurOrderModel.Status = 0; }
        PurOrderModel.SalesmanId = Number(ddlSalesmanHeader.value);
        PurOrderModel.VendorID = Number(ddlVendorHeader.value);
        PurOrderModel.VATType = Number(ddlTaxTypeHeader.value);
        PurOrderModel.Remarks = txtNotes.value;
        PurOrderModel.DliveryConditions = txtDliveryConditions.value;
        PurOrderModel.ShipmentConditions = txtShipmentConditions.value;
        PurOrderModel.ValidityPeriod = txtValidityPeriod.value;
        PurOrderModel.CurrencyID = Number( ddlCurrency.value);

        if (ddlIsCash.value == "0") { PurOrderModel.IsCash = false; } else { PurOrderModel.IsCash = true; }


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
                var SelectedItem = ItemsListDetails.filter(x => x.ItemID == PurOrderSingleModel.ItemID);
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
                var SelectedItem = ItemsListDetails.filter(x => x.ItemID == PurOrderSingleModel.ItemID);
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
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess == true) {
                    let res = result.Response as I_Pur_Tr_PurchaseOrder;
                    DateSetsSccess("txtDateHeader", "txtFromDate", "txtToDate");
                    DisplayMassage(" تم اصدار  أمر شراء رقم  " + res.TrNo + " ", "Succeed" + res.TrNo, MessageType.Succeed);
                    txtPurTrNo.innerText = res.TrNo.toString();
                    GlobalPurOrderID = res.PurOrderID;
                    InitializeGrid();
                    BindAfterInsertorUpdate();

                    $("#btnPrintTransaction").removeClass("display_none");
                    Save_Succ_But();
                } else {

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
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess == true) {
                    let res = result.Response as I_Pur_Tr_PurchaseOrder;
                    DateSetsSccess("txtDateHeader", "txtFromDate", "txtToDate");
                    DisplayMassage(" تم تعديل امر  شراء  رقم  " + res.TrNo + " ", "Modified" + res.TrNo, MessageType.Succeed);

                    txtPurTrNo.innerText = res.TrNo.toString();
                    GlobalPurOrderID = res.PurOrderID;
                    InitializeGrid();
                    BindAfterInsertorUpdate();

                    $("#btnPrintTransaction").removeClass("display_none");
                    Save_Succ_But();
                } else {

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
            success: (d) => {
                let res = d as I_Pur_Tr_PurchaseOrder;
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
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    ItemsListDetails = new Array<I_Item>();
                    ItemsListDetails = result.Response as Array<I_Item>;
                }
            }
        });
    }
    function GetDate() {
        var today: Date = new Date();
        var dd: string = today.getDate().toString();
        var ReturnedDate: string;
        var mm: string = (today.getMonth() + 1).toString();
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
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {

                    VatTypeData = result.Response as Array<A_D_VAT_TYPE>;


                }
            }
        });
    }
  /////---------------------------------------------------------- Print ----------------------------------
    function PrintReport(OutType: number) {
        ////debugger
        if (!SysSession.CurrentPrivileges.PrintOut) return;
        let rp: ReportParameters = new ReportParameters();
        rp.RepType = OutType;//output report as View
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
            success: (d) => {

                let result = d.result as string;


                window.open(result, "_blank");
            }
        })
    }
    
    function btnPrintPurchaseDemand_onclick() {
         debugger
        if (!SysSession.CurrentPrivileges.PrintOut) return;
        let rp: ReportParameters = new ReportParameters();
        
        rp.Type = 0;
        rp.Repdesign = 1;
        rp.TRId = GlobalPurOrderID;
                                                                                   
                rp.Name_function = "IProc_Prnt_PurPurchaseOrder";
        localStorage.setItem("Report_Data", JSON.stringify(rp));

        localStorage.setItem("result", '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>');
         window.open(Url.Action("ReportsPopup", "Home"), "_blank");


    }

}