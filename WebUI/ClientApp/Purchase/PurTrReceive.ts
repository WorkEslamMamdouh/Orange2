
$(document).ready(() => {
    ////////;
    PurTrReceive.InitalizeComponent();
})

namespace PurTrReceive {
    //system varables
    var SysSession: SystemSession = GetSystemSession(Modules.PurTrReceive);
    var compcode: Number;
    var BranchCode: number;//SharedSession.CurrentEnvironment.BranchCode;
    var sys: SystemTools = new SystemTools();
    var GlobalCurrency: number
    //Arrays
    var CashboxDetails: Array<A_RecPay_D_CashBox> = new Array<A_RecPay_D_CashBox>();
    var SellerDetails: Array<I_Sls_D_Salesman> = new Array<I_Sls_D_Salesman>();
    var StateDetailsAr: Array<string> = new Array<string>();
    var StateDetailsEn: Array<string> = new Array<string>();
    var filterVendorDetails: Array<A_Pay_D_Vendor> = new Array<A_Pay_D_Vendor>();
    var Vendor_list: Array<A_Pay_D_Vendor> = new Array<A_Pay_D_Vendor>();
    var VendorDetails: Array<A_Pay_D_Vendor> = new Array<A_Pay_D_Vendor>();
    var SearchDetails: Array<IQ_GetPurReceiveStaistic> = new Array<IQ_GetPurReceiveStaistic>();
    var G_USERSDetails: Array<G_USERS> = new Array<G_USERS>();
    var GetPurReceiveStaisticData: Array<IQ_GetPurReceiveStaistic> = new Array<IQ_GetPurReceiveStaistic>();
    var StoresDetails: Array<G_STORE> = new Array<G_STORE>();
    var CodesDetails: Array<G_Codes> = new Array<G_Codes>();
    var VatDetails: Array<A_D_VAT_TYPE> = new Array<A_D_VAT_TYPE>();
    var PurReceiveChargeData: Array<IQ_GetPurReceiveCharge> = new Array<IQ_GetPurReceiveCharge>();
    var FamilyDetails: Array<I_ItemFamily> = new Array<I_ItemFamily>();
    var ItemBaesdFamilyDetails: Array<IQ_GetItemStoreInfo> = new Array<IQ_GetItemStoreInfo>();
    var ItemFamilyDetails: Array<IQ_GetItemStoreInfo> = new Array<IQ_GetItemStoreInfo>();
    var VatTypeData: Array<A_D_VAT_TYPE> = new Array<A_D_VAT_TYPE>();
    var AddonsData: Array<I_Pur_D_Charges> = new Array<I_Pur_D_Charges>();
    var VendorModel: A_Pay_D_Vendor = new A_Pay_D_Vendor();
    var CurrencyDetails: Array<G_Currency> = new Array<G_Currency>();
    //Models
    var RetrivedPurchaseModel: Array<IQ_GetPurReceiveStaistic> = new Array<IQ_GetPurReceiveStaistic>();
    var ReceiveModel: I_Pur_TR_Receive = new I_Pur_TR_Receive();
    var ItemDetails: Array<IQ_GetPurReceiveItem> = new Array<IQ_GetPurReceiveItem>();
    var PurOrderDetailModel: IQ_PurchaseOrderWithDetail = new IQ_PurchaseOrderWithDetail();
    var ReceiveItemsDetailsModel: Array<I_Pur_TR_ReceiveItems> = new Array<I_Pur_TR_ReceiveItems>();
    var chargesDetailsModel: Array<I_Pur_Tr_ReceiveCharges> = new Array<I_Pur_Tr_ReceiveCharges>();
    var chargesingleModel: I_Pur_Tr_ReceiveCharges = new I_Pur_Tr_ReceiveCharges();
    var ReceiveItemSingleModel: I_Pur_TR_ReceiveItems = new I_Pur_TR_ReceiveItems();
    var MasterDetailModel: PurReceiveMasterDetails = new PurReceiveMasterDetails();
    var AllPurReceiveMasterDetailModel: IQ_GetPurReceiveMasterDisplay = new IQ_GetPurReceiveMasterDisplay();
    var ModelPurchase: ModelLastPurchase = new ModelLastPurchase();

    //DropDownlist
    var ddlStateType: HTMLSelectElement;
    var ddlSalesmanMaster: HTMLSelectElement;
    var ddlVendorMaster: HTMLSelectElement;
    var ddlSeller: HTMLSelectElement;
    var ddlCurrency: HTMLSelectElement;


    // giedView
    var divMasterGrid: JsGrid = new JsGrid();

    //Textboxes
    var txtNotes: HTMLInputElement;
    var txtFromDate: HTMLInputElement;
    var txtToDate: HTMLInputElement;
    var txtDateHeader: HTMLInputElement;
    var ddlStoreHeader: HTMLSelectElement;
    var ddlSalesmanHeader: HTMLSelectElement;
    var lblInvoiceNumber: HTMLInputElement;
    var txtPurOrderNum: HTMLInputElement;
    var txtVendorName: HTMLInputElement;
    var txtCurrencyRate: HTMLInputElement;

    //buttons 
    var btnCustLastPrice: HTMLButtonElement;
    var btnUpdate: HTMLButtonElement;
    var btnShow: HTMLButtonElement;
    var ddlIsCash: HTMLSelectElement;
    var ddlCashBoxH: HTMLSelectElement;
    var ddlReciveTypeHeader: HTMLSelectElement;
    var ddlTaxTypeHeader: HTMLSelectElement;
    var VendorRecieptID: HTMLInputElement;
    var chkActive: HTMLInputElement;
    var btnAddDetails: HTMLButtonElement;
    var btnAddDetailsCharge: HTMLButtonElement;
    var txtFamilyType: HTMLInputElement;
    var txtTotal: HTMLInputElement;
    var txtAddons: HTMLInputElement;
    var txtItemsNumber: HTMLInputElement;
    var searchbutmemreport: HTMLInputElement;
    var txtTax: HTMLInputElement;
    var txtAddonsTax: HTMLInputElement;
    var txtTotalFamily: HTMLInputElement;
    var txtTotalAddons: HTMLInputElement;
    var txtTotalbefore: HTMLInputElement;
    var txtTotalDiscount: HTMLInputElement;
    var btnSave: HTMLButtonElement;
    var btnBack: HTMLButtonElement;
    var btnAdd: HTMLButtonElement;
    var btnPurOrderSearch: HTMLButtonElement;
    //var btnPrintInvoicePrice: HTMLButtonElement;
    var btnVendorSearch: HTMLButtonElement;

    //flags && global

    var GlobalReceiveID: number = 0;
    var currencrRate: number = 1;
    var ModeType = 2;//1 view , 2 insert , 3 update 
    var ShowFlag: boolean = false; // Normal Add
    var PurOrderShowFlag: boolean = false; //  Add From Purchase Order
    var CountGrid = 0;
    var CountGridCharge = 0;
    var CountItems: number = 0;
    var CountItemsCharge: number = 0;
    var globalPurOrderID: number = 0;
    var globalVendorID: number = 0;

    var DefVatType = SysSession.CurrentEnvironment.I_Control[0].DefPurVatType;
    var VatPrc;
    var vatpriceVendor;
    var Finyear: number;

    // Print Buttons
    var btnPrintTrview: HTMLButtonElement;
    var btnPrintTrPDF: HTMLButtonElement;
    var btnPrintTrEXEL: HTMLButtonElement;
    var btnPrint: HTMLButtonElement;
    var btnPrintTransaction: HTMLButtonElement;
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);

    var flagLastPrice = 2;
    var itemid_LastPrice = 0;
    //---------------------------------------------------------------- main region----------------------------------------------------
    export function InitalizeComponent() {
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
    function InitalizeControls() {
        // print ----*
        btnPrintTrview = document.getElementById("btnPrintTrview") as HTMLButtonElement;
        btnPrintTrPDF = document.getElementById("btnPrintTrPDF") as HTMLButtonElement;
        btnPrintTrEXEL = document.getElementById("btnPrintTrEXEL") as HTMLButtonElement;
        btnPrint = document.getElementById("btnPrint") as HTMLButtonElement;
        btnPrintTransaction = document.getElementById("btnPrintTransaction") as HTMLButtonElement;
        //btnPrintInvoicePrice = document.getElementById("btnPrintInvoicePrice") as HTMLButtonElement;


        //----------------------------------------------------------------------------------------//
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);
        //Drop Downlists
        ddlStateType = document.getElementById("ddlStateType") as HTMLSelectElement;
        ddlSalesmanMaster = document.getElementById("ddlSalesmanMaster") as HTMLSelectElement;
        ddlVendorMaster = document.getElementById("ddlVendorMaster") as HTMLSelectElement;
        ddlStoreHeader = document.getElementById("ddlStoreHeader") as HTMLSelectElement;
        ddlSalesmanHeader = document.getElementById("ddlSalesmanHeader") as HTMLSelectElement;
        ddlSeller = document.getElementById("ddlSeller") as HTMLSelectElement;
        ddlIsCash = document.getElementById("ddlIsCash") as HTMLSelectElement;
        ddlCashBoxH = document.getElementById("ddlCashBoxH") as HTMLSelectElement;
        ddlReciveTypeHeader = document.getElementById("ddlReciveTypeHeader") as HTMLSelectElement;
        ddlTaxTypeHeader = document.getElementById("ddlTaxTypeHeader") as HTMLSelectElement;
        ddlCurrency = document.getElementById("ddlCurrency") as HTMLSelectElement;

        //textboxes
        txtFromDate = document.getElementById("txtFromDate") as HTMLInputElement;
        txtToDate = document.getElementById("txtToDate") as HTMLInputElement;
        txtNotes = document.getElementById("txtNotes") as HTMLInputElement;
        searchbutmemreport = document.getElementById("searchbutmemreport") as HTMLInputElement;
        txtDateHeader = document.getElementById("txtDateHeader") as HTMLInputElement;
        lblInvoiceNumber = document.getElementById("lblInvoiceNumber") as HTMLInputElement;
        txtFamilyType = document.getElementById("txtFamilyType") as HTMLInputElement;
        txtTotal = document.getElementById("txtTotal") as HTMLInputElement;
        txtAddons = document.getElementById("txtAddons") as HTMLInputElement;
        txtItemsNumber = document.getElementById("txtItemsNumber") as HTMLInputElement;
        txtTax = document.getElementById("txtTax") as HTMLInputElement;
        txtAddonsTax = document.getElementById("txtAddonsTax") as HTMLInputElement;
        txtTotalFamily = document.getElementById("txtTotalFamily") as HTMLInputElement;
        txtTotalAddons = document.getElementById("txtTotalAddons") as HTMLInputElement;
        txtTotalDiscount = document.getElementById("txtTotalDiscount") as HTMLInputElement;
        txtTotalbefore = document.getElementById("txtTotalbefore") as HTMLInputElement;
        txtPurOrderNum = document.getElementById("txtPurOrderNum") as HTMLInputElement;
        txtVendorName = document.getElementById("txtVendorName") as HTMLInputElement;
        txtCurrencyRate = document.getElementById("txtCurrencyRate") as HTMLInputElement;

        //buttons
        btnShow = document.getElementById("btnShow") as HTMLButtonElement;
        VendorRecieptID = document.getElementById("VendorRecieptID") as HTMLInputElement;
        chkActive = document.getElementById("chkActive") as HTMLInputElement;
        btnAddDetails = document.getElementById("btnAddDetails") as HTMLButtonElement;
        btnAddDetailsCharge = document.getElementById("btnAddDetailsCharge") as HTMLButtonElement;
        btnCustLastPrice = document.getElementById("btnCustLastPrice") as HTMLButtonElement;
        btnUpdate = document.getElementById("btnUpdate") as HTMLButtonElement;
        btnBack = document.getElementById("btnBack") as HTMLButtonElement;
        btnSave = document.getElementById("btnSave") as HTMLButtonElement;
        btnAdd = document.getElementById("btnAdd") as HTMLButtonElement;
        btnPurOrderSearch = document.getElementById("btnPurOrderSearch") as HTMLButtonElement;
        btnVendorSearch = document.getElementById("btnVendorSearch") as HTMLButtonElement;

        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = "إستلام المشتريات";

        } else {
            document.getElementById('Screen_name').innerHTML = " Receipt of purchases  ";

        }

    }
    function IntializeEvents() {
        btnShow.onclick = btnShow_onclick;
        ddlTaxTypeHeader.onchange = TaxTypeOnchange;
        ddlIsCash.onchange = ddlIsCashOnchange;
        btnAddDetailsCharge.onclick = AddNewRowCharge;
        btnAddDetails.onclick = AddNewRow;
        btnCustLastPrice.onclick = LastPrice_onclick;
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
        btnPrintTrview.onclick = () => { PrintReport(1); }
        btnPrintTrPDF.onclick = () => { PrintReport(2); }
        btnPrintTrEXEL.onclick = () => { PrintReport(3); }
        //btnPrint.onclick = () => { PrintReport(4); }
        btnPrintTransaction.onclick = btnPrintTransaction_onclick;
        //btnPrintInvoicePrice.onclick = btnPrntPrice_onclick;

        searchbutmemreport.onkeyup = _SearchBox_Change;

    }

    //-----------------------------------------------------------------------------------------------------------------------------
    function LastPrice_onclick() {





        if (flagLastPrice % 2 === 0) {


            if (txtVendorName.value.trim() == "") {
                DisplayMassage('(برجاء اختيار الموارد)', '(Please select a customer)', MessageType.Error);
                Errorinput(txtVendorName);
                return false
            }

            if (ddlStoreHeader.value == "null") {
                DisplayMassage('(برجاء اختيار المستودع)', '(Please select a customer)', MessageType.Error);
                Errorinput(ddlStoreHeader);

                return false
            }

            let ChackCount = 0;
            for (var i = 0; i < CountGrid; i++) {
                let StatusFlag = $("#txt_StatusFlag" + i).val();
                if (StatusFlag != "d" && StatusFlag != "m") {
                    if (ChackCount == 0) {
                        itemid_LastPrice = $('#ddlItem' + i).val();
                        GetLastPrice(itemid_LastPrice, $("#ddlItem" + i + " option:selected").text())
                    }

                    ChackCount++;
                }
            }

            if (ChackCount == 0) {
                DisplayMassage('(برجاء ادخال الاصناف الفاتوره)', '(Please select a customer)', MessageType.Error);
                Errorinput(btnAddDetails);
                return false
            }


            //$("#btnCustLastPrice").animate({ right: '-2%' }, 'slow');
            $("#btnCustLastPrice").addClass("active");
            timerHiddenLastPrice();

        }
        else {
           // $("#btnCustLastPrice").animate({ right: '-88%' }, 'slow');
            $("#btnCustLastPrice").removeClass("active");
        }

        flagLastPrice++;
    }
    function timerHiddenLastPrice() {
        setTimeout(function () {
          //  $("#btnCustLastPrice").animate({ right: '-88%' }, 'slow');
            $("#btnCustLastPrice").removeClass("active");
            flagLastPrice = 2;
        }, 20000);
    }
    function GetLastPrice(itemid: number, Name: string) { 
        let VendorID = globalVendorID;
        let storeid = ddlStoreHeader.value;
        let invid = GlobalReceiveID


        let flagPrice = true;
        if (itemid.toString() == 'null') {
            flagPrice = false
        }
        if (ddlStoreHeader.value.toString() == 'null') {
            flagPrice = false
        }
        if (txtVendorName.value.trim() == '') {
            flagPrice = false
        }


        if (flagPrice == true) {

            Ajax.Callsync({
                type: "Get",
                url: sys.apiUrl("PurTrReceive", "GetLastPrice"),
                data: { CompCode: compcode, BranchCode: BranchCode, itemid: itemid, vendorid: VendorID, storeid: storeid, invid: invid },
                success: (d) => {
                    let result = d as BaseResponse;
                    if (result.IsSuccess) {
                        ModelPurchase = result.Response as ModelLastPurchase;
                        $("#VndLastPrice").html(ModelPurchase.VndLastPrice.toString())
                        $("#VndLastTr").html(ModelPurchase.VndLastTr.toString())
                        $("#LastPurchase").html(ModelPurchase.LastPurchase.toString())
                        $("#Curcost").html(ModelPurchase.Curcost.toString())
                        $("#VndLastDate").html(ModelPurchase.VndLastDate.toString())
                        $("#Name_Item").html(Name)

                    }
                }
            });

        }
        else {

            $("#VndLastPrice").html("-----")
            $("#VndLastTr").html("-----")
            $("#LastPurchase").html("-----")
            $("#Curcost").html("-----")
            $("#VndLastDate").html("-----")
            $("#Name_Item").html("-----")

        }


    }
    //---------------------------------------------------------------- normal region----------------------------------------------------
    function ddlIsCashOnchange() {
        if (ddlIsCash.value == '0') {
            $('#ddlCashBoxH').attr('disabled', 'disabled');;
        } else {
            $('#ddlCashBoxH').removeAttr('disabled');
        }
    }
    function InitializeGrid() {
        $("#divMasterGridiv").removeClass("display_none");
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
            { title: "اجمالي الاصناف ", name: "ItemTotalFC", type: "text", width: "7%" },
            { title: "  الخصم ", name: "ItemDiscountTotalFC", type: "text", width: "7%" },
            { title: "  الاجمالي بعد الخصم	 ", name: "Total", type: "text", width: "7%" },
            { title: res.App_Tax, name: "VatAmount", type: "text", width: "7%" },
            { title: "الاجمالي بعد الضريبة	", name: "NetDue", type: "text", width: "7%" },
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
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    GetPurReceiveStaisticData = result.Response as Array<IQ_GetPurReceiveStaistic>;

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
        debugger
        ShowFlag = true;
        $('#ddlCurrency').prop("value", "null");
        let Selecteditem = GetPurReceiveStaisticData.filter(x => x.ReceiveID == Number(divMasterGrid.SelectedKey));
        GlobalReceiveID = Number(Selecteditem[0].ReceiveID);
        RetrivedPurchaseModel = Selecteditem;
        DataHeader();
        AllGetPurReceiveItemsCharge();
        DisableControls();
        if (RetrivedPurchaseModel[0].Status == 1) {
            chkActive.checked = true;
            chkActive.disabled = !SysSession.CurrentPrivileges.CUSTOM2;
            btnUpdate.disabled = true;

        } else {
            chkActive.checked = false;
            chkActive.disabled = true;
            btnUpdate.disabled = false;
        }
        VatPrc = VatDetails.filter(x => x.CODE == RetrivedPurchaseModel[0].VATType)[0].VatPerc;

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
            txtVendorName.value = RetrivedPurchaseModel[0].Vnd_NameA.toString()
            ddlStoreHeader.value = RetrivedPurchaseModel[0].StoreID.toString()
            ddlSalesmanHeader.value = RetrivedPurchaseModel[0].SalesmanId.toString()
            lblInvoiceNumber.innerText = RetrivedPurchaseModel[0].TrNo.toString()
            ddlTaxTypeHeader.value = RetrivedPurchaseModel[0].VATType.toString()
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

            } else {
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

        txtTotalbefore.setVal(RetrivedPurchaseModel[0].ItemTotalFC)
        txtTotalDiscount.setVal(RetrivedPurchaseModel[0].ItemDiscountTotalFC);
         
        $("#txtLocalTotalFooter").val(IsNullOrEmpty(RetrivedPurchaseModel[0].TotalFC.toString()) == true ? "0" : RetrivedPurchaseModel[0].TotalFC.toString());
         
            txtTotalAddons.setVal(RetrivedPurchaseModel[0].TotAddAfterVat);

        var FullAllPriceWithoutTaxval = Number(txtTotal.value) + Number(txtAddons.value);
        $("#txtTotalPurchaseWithoutTax").val(FullAllPriceWithoutTaxval.RoundToSt(2));

        var FullAllTaxval = Number(txtTax.value) + Number(txtAddonsTax.value);
        $("#txtTotalTax").val(FullAllTaxval.RoundToSt(2));

        var FullAllPRiceWithTaxVal = Number(txtTotalFamily.value) + Number(txtTotalAddons.value);
        $("#txtTotalPurchaseWithTax").val(FullAllPRiceWithTaxVal.RoundToSt(2));

        //TaxTypeOnchange();

        if (RetrivedPurchaseModel[0].IsCash == true) { ddlIsCash.value = '1'; $('#ddlCashBoxH').removeAttr('disabled'); }
        else { ddlIsCash.value = '0'; $('#ddlCashBoxH').attr('disabled', 'disabled'); }

    }
    function AllGetPurReceiveItemsCharge() {
        //
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("PurTrReceive", "AllGetPurReceiveItemsCharge"),
            data: { receiveID: GlobalReceiveID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    AllPurReceiveMasterDetailModel = result.Response as IQ_GetPurReceiveMasterDisplay;

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
        //$("#divMasterGridiv").removeClass("display_none");

        if (ModeType == 3) {
            MasterGridDoubleClick();
        } else {
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

            for (let i = 0; i < CountGrid; i++) {
                if (!Validation_Grid(i))
                    return;
            }

            for (let i = 0; i < CountGridCharge; i++) {
                if (!ValidationCharge_Grid(i))
                    return;
            }

            if (ddlIsCash.value == "0") {
                $('#ddlCashBoxH').removeAttr('disabled');
                let net = Number($('#txtTotalPurchaseWithTax').val());
                if (!Check_CreditLimit_Vendor(net))
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

        EnableControls();

        btnPurOrderSearch.disabled = false;
        $("#txtCreatedAt").prop("value", DateTimeFormat(Date().toString()));
        $("#txtCreatedBy").prop("value", SysSession.CurrentEnvironment.UserCode);
        $('#ddlCurrency').prop("value", GlobalCurrency);
        if (ddlIsCash.value == '0') {
            $('#ddlCashBoxH').attr('disabled', 'disabled');;
        } else {
            $('#ddlCashBoxH').removeAttr('disabled');
        }
        ddlTaxTypeHeader.value = DefVatType;
        ddlTaxTypeHeader.disabled = true;
        TaxTypeOnchange();
        AddNewRow();
        txtPurOrderNum.disabled = false;



    }
    function btnupdate_onclick() {
        if (!SysSession.CurrentPrivileges.EDIT) return;
        ShowFlag = false;
        ModeType = 3;//update
        EnableControls();
        btnPurOrderSearch.disabled = true;
        $("#txtUpdatedAt").prop("value", DateTimeFormat(Date().toString()));
        $("#txtUpdatedBy").prop("value", SysSession.CurrentEnvironment.UserCode);
        txtPurOrderNum.disabled = false;



    }
    function btnPurOrderSearch_onclick() {
        let sys: SystemTools = new SystemTools();
        sys.FindKey(Modules.PurTrReceive, "btnPurOrderSearch", "CompCode=" + compcode + "and Status=1 and IsReceived='False' and BranchCode = " + BranchCode, () => {
            let id = SearchGrid.SearchDataGrid.SelectedKey
            globalPurOrderID = id;
            getPurOrderByID();
        });
    }

    function txtPurOrderNum_onchange() {
        //getPurOrderByID(txtPurOrderNum.value);
    }

    function btnVendorSearch_onclick() {
        let sys: SystemTools = new SystemTools();
        sys.FindKey(Modules.PurTrReceive, "btnVendorSearch", "CompCode=" + compcode + " and VendorType = 1  and Isactive =1", () => {
            let id = SearchGrid.SearchDataGrid.SelectedKey
            globalVendorID = id;
            getVendorByID();
        });
    }
    //---------------------------------------------------------------- Events region----------------------------------------------------
    function TaxTypeOnchange() {
        //////;

        let fltr = VatDetails.filter(x => (x.CODE == (ddlTaxTypeHeader.value == "null" ? DefVatType : ddlTaxTypeHeader.value)));
        if (fltr.length != 0)
            VatPrc = fltr[0].VatPerc;

        else
            VatPrc = VatDetails.filter(x => x.CODE == Number(DefVatType))[0].VatPerc;

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
                } else {
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
            let search: string = searchbutmemreport.value.toLowerCase();
            SearchDetails = GetPurReceiveStaisticData.filter(x => x.TrNo.toString().search(search) >= 0
                || x.Vnd_NameA.toLowerCase().search(search) >= 0 || x.Vnd_NameE.toLowerCase().search(search) >= 0
                || (lang == "ar" ? x.Slsm_DescA.toLowerCase().search(search) >= 0 : x.Slsm_DescE.toLowerCase().search(search) >= 0));

            divMasterGrid.DataSource = SearchDetails;
            divMasterGrid.Bind();
        } else {
            divMasterGrid.DataSource = GetPurReceiveStaisticData;
            divMasterGrid.Bind();
        }
    }
    function txtCurrencyRate_onkeyup() {
        currencrRate = 1
        var txtQuantityVal: number = 0;
        var txtPriceVal: number = 0;
        var txtPriceValFc: number = 0;
        var TotalFc: number = 0;
        for (let i = 0; i < CountGrid; i++) {
            var flagvalue = $("#txt_StatusFlag" + i).val();
            if (flagvalue != "d" && flagvalue != "m") {

                totalRow(i, true)

            }
        }

        
    }
    //---------------------------------------------------------------- Fill Drop Down region----------------------------------------------------
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
    function FillddlItems(ItemFamilyID: number, StoreId: number) {

        ItemBaesdFamilyDetails = ItemFamilyDetails.filter(x => x.ItemFamilyID == ItemFamilyID && x.StoreId == StoreId);


        if (ModeType == 2)//Insert
        {
            ItemBaesdFamilyDetails = ItemFamilyDetails.filter(x => x.ItemFamilyID == ItemFamilyID && x.StoreId == StoreId && x.IsActive == true && x.IsPurchase == true);
        }
        else {
            if (ShowFlag == true || PurOrderShowFlag == true) {
                ItemBaesdFamilyDetails = ItemFamilyDetails.filter(x => x.ItemFamilyID == ItemFamilyID && x.StoreId == StoreId);
            }
            else {
                ItemBaesdFamilyDetails = ItemFamilyDetails.filter(x => x.ItemFamilyID == ItemFamilyID && x.StoreId == StoreId && x.IsActive == true && x.IsPurchase == true);
            }
        }

    }
    function FillddlCashBox() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefBox", "GetAll"),
            data: { compCode: compcode, BranchCode: BranchCode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    CashboxDetails = result.Response as Array<A_RecPay_D_CashBox>;

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
    function FillddlAddonsType(cnt: number) {

        StateDetailsAr = ["خصم", "اضافة"];
        StateDetailsEn = ["Discount", "addition"];

        if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
            for (let i = 0; i < StateDetailsEn.length; i++) {

                $("#txtAddonsTypeCharge" + cnt).append(new Option(StateDetailsEn[i], i.toString()));

            }
        }
        else {
            for (let i = 0; i < StateDetailsAr.length; i++) {

                $("#txtAddonsTypeCharge" + cnt).append(new Option(StateDetailsAr[i], i.toString()));

            }
        }
    }
    function FillddlIsCashType(cnt: number) {

        StateDetailsAr = ["علي الحساب", "نقدى"];
        StateDetailsEn = ["Postpaid", "Cash"];

        if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {

            for (let i = 0; i < StateDetailsEn.length; i++) {

                $("#txtVendorIsCheckCharge" + cnt).append(new Option(StateDetailsEn[i], i.toString()));

            }
        }
        else {

            for (let i = 0; i < StateDetailsAr.length; i++) {

                $("#txtVendorIsCheckCharge" + cnt).append(new Option(StateDetailsAr[i], i.toString()));

            }
        }
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
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    filterVendorDetails = result.Response as Array<A_Pay_D_Vendor>;

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
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {

                    StoresDetails = result.Response as Array<G_STORE>;

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
    function FillddlReciveType() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GCodes", "GetAll"),
            data: {
                codeType: "PurRecType", UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {

                    CodesDetails = result.Response as Array<G_Codes>;

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
    //---------------------------------------------------------------- Get Functions region----------------------------------------------------
    function GetAllIItem() {

        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("StkDefItems", "GetAllItemPur"),
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
    function GetAddonsData() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("PurTrReceive", "GetAllPurDefCharges"),
            data: {
                compCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    AddonsData = result.Response as Array<I_Pur_D_Charges>;
                }
            }
        });
    }
    function Check_CreditLimit_Vendor(net: number) {

        var Vendor1 = VendorDetails.filter(s => s.VendorID == globalVendorID);
        var Isbalance = Number((Number(Vendor1[0].Openbalance) - Number(Vendor1[0].Debit) + Number(Vendor1[0].Credit)).RoundToSt(2));

        let res = Number((net + Isbalance).RoundToSt(2));

        if (Vendor1[0].DebitLimit > 0) {

            if (res <= Vendor1[0].DebitLimit) { return true }
            else {
                MessageBox.Show("خطأ لا يمكن ان تجاوز صافي الفاتوره (" + net + ") مع الرصيد (" + Isbalance + ") الحد الائتماني     (" + Vendor1[0].DebitLimit + ")", "خطأ");

                return false
            }

        }

        return true

    }
    function Check_on_user_type() {


        if (SysSession.CurrentEnvironment.UserType == 1 || SysSession.CurrentEnvironment.UserType == 3) { //Salesman

            let SalesId = SysSession.CurrentEnvironment.SalesManID;
            SellerDetails = SellerDetails.filter(s => s.SalesmanId == SalesId);



        }
        else if (SysSession.CurrentEnvironment.UserType == 2 || SysSession.CurrentEnvironment.UserType == 3) {//CashBox

            let CashBoxID = SysSession.CurrentEnvironment.CashBoxID;
            CashboxDetails = CashboxDetails.filter(s => s.CashBoxID == CashBoxID);
        }

    }
    function getPurOrderByID() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("PurTrReceive", "GetPurOrderMasterDetailByID"),
            data: {
                PurOrderID: globalPurOrderID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    PurOrderDetailModel = new IQ_PurchaseOrderWithDetail();
                    PurOrderDetailModel = result.Response as IQ_PurchaseOrderWithDetail;
                    clear();
                    BindPurOrder();
                }
            }
        });
    }
    function BindPurOrder() {
        if (PurOrderDetailModel.IQ_GetPurchaseOrder.length > 0) {
            txtVendorName.value = PurOrderDetailModel.IQ_GetPurchaseOrder[0].Vnd_NameA.toString()
            globalVendorID = PurOrderDetailModel.IQ_GetPurchaseOrder[0].VendorID;
            ddlSalesmanHeader.value = PurOrderDetailModel.IQ_GetPurchaseOrder[0].SalesmanId.toString()
            txtPurOrderNum.value = PurOrderDetailModel.IQ_GetPurchaseOrder[0].TrNo.toString()
            ddlTaxTypeHeader.value = PurOrderDetailModel.IQ_GetPurchaseOrder[0].VATType.toString()
            txtNotes.value = PurOrderDetailModel.IQ_GetPurchaseOrder[0].Remarks.toString();
            if (PurOrderDetailModel.IQ_GetPurchaseOrder[0].IsCash == true) { ddlIsCash.value = '1'; $('#ddlCashBoxH').attr('disabled', 'disabled');; }
            else { ddlIsCash.value = '0'; $('#ddlCashBoxH').removeAttr('disabled'); }
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
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    VendorModel = new A_Pay_D_Vendor();
                    VendorModel = result.Response as A_Pay_D_Vendor;
                    txtVendorName.value = (lang == "ar" ? VendorModel.NAMEA : VendorModel.NAMEL);

                    vatpriceVendor = VendorModel.VATType;
                    ddlTaxTypeHeader.value = VendorModel.VATType.toString();

                    let fltr = VatDetails.filter(x => (x.CODE == (ddlTaxTypeHeader.value == "null" ? DefVatType : ddlTaxTypeHeader.value)));
                    if (fltr.length != 0)
                        VatPrc = fltr[0].VatPerc;

                    else
                        VatPrc = VatDetails.filter(x => x.CODE == Number(DefVatType))[0].VatPerc;

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
                            } else {
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
            return
        }

        if (!SysSession.CurrentPrivileges.AddNew) return;
        var CanAdd: boolean = true;
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
            $("#btnSearchItems" + CountGrid).removeAttr("disabled");
            // can delete new inserted record  without need for delete privilage
            $("#btn_minus" + CountGrid).removeClass("display_none");
            $("#btn_minus" + CountGrid).removeAttr("disabled");


            CountGrid++;

            Insert_Serial();
            ComputeTotals();

        }
    }
    function BuildControls(cnt: number) {
        var html;
        html = `<tr id= "No_Row${cnt}">
                    <input id="ReciveDetailsID${cnt}" type="hidden" class="form-control display_none"  />
	                <td>
		                <div class="form-group">
			                <span id="btn_minus${cnt}"><i class="fas fa-minus-circle fs-4 btn-minus"></i></span>
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
			                <button type="button" class="style_ButSearch" id="btnSearchItems${cnt}" disabled>
                            <i class="fa fa-search  "></i>
                             </button>
 
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
                            <select id="ddlFamily${cnt}" class="form-control select_">
                                <option value="null">${(lang == "ar" ? "اختر" : "Choose")}</option>
                            </select>
		                </div>
	                </td>
                     <td>
		                <div class="form-group">
                        <select id="ddlItem${cnt}" class="form-control select_">
                            <option value="null">${ (lang == "ar" ? "اختر" : "Choose")}</option>
                        </select>
		                </div>
	                </td>
                     <td>
		                <div class="form-group">
			                <input type="number"  id="txtQuantity${cnt}" name="quant[10]" class="form-control" value="1" min="1" max="1000" step="1">
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
			                <input id="txtQuantityReturnValue${cnt}" type="number" class="form-control"  disabled value="0"/>
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
			                <input type="number"  id="txtPriceFc${cnt}" name="quant[20]" class="form-control" value="1" min="0" max="1000" step="0.5">
		                </div>
	                </td>
                    <td>
		                <div class="form-group" >
			               <input id="txtDiscountPrc${cnt}" type="text"  class="form-control"  name="quant[3]" class="form-control" value="0" min="0" step="1">
		                </div>
	                </td>  
                    <td>
		                <div class="form-group"style="width: 84px;" >
			               <input id="txtDiscountAmount${cnt}" type="text"  class="form-control"  name="quant[3]" class="form-control" value="0" min="0" step="1">
		                </div>
	                </td>  
                    <td>
		                <div class="form-group"style="width: 84px;" >
			               <input id="txtNetUnitPrice${cnt}" type="text" disabled class="form-control"  name="quant[3]" class="form-control" value="0" min="0" step="1">
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
			              <input id="txtTotalFc${cnt}" type="number" disabled class="form-control"  value="0"/>
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
			              <input id="txtPrice${cnt}" disabled type="text" class="form-control"  value="0"/>
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
			              <input id="txtTotal${cnt}" type="text" class="form-control" disabled />
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
			               <input id="txtTax${cnt}" type="text" disabled class="form-control" data_VatPrc="${((VatPrc == null || undefined) ? 0 : VatPrc)}"  value="0"/>
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
			                <input id="txtTotAfterTax${cnt}" type="text" disabled value="0" class="form-control"  />
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
			             <input id="txtAddons${cnt}" type="text" disabled class="form-control"  value="0" />
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
			             <input id="txtTotAddons${cnt}" type="text" disabled class="form-control"  value="0" />
		                </div>
	                </td>
                <input id="UnitCost${cnt}" name = " " type = "hidden" class="form-control "/>
                <input id="txt_StatusFlag${cnt}" name = " " type = "hidden" class="form-control input-sm"/>
                <input id="txt_ID${cnt}" name = " " type = "hidden" class="form-control input-sm" />';
                </tr>`;
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
        $('.input-number1' + cnt).focusin(function () {
            $(this).data('oldValue', $(this).val());
        });
        $('.input-number1' + cnt).change(function () {

            var minValue = parseInt($(this).attr('min'));
            var maxValue = parseInt($(this).attr('max'));
            var valueCurrent = parseInt($(this).val());

            var name = $(this).attr('name');
            if (valueCurrent >= minValue) {
                $(".btn-number1[data-type='minus'][data-field='" + name + "']").removeAttr('disabled')
            } else {
                alert('Sorry, the minimum value was reached');
                $(this).val($(this).data('oldValue'));
            }
            if (valueCurrent <= maxValue) {
                $(".btn-number1[data-type='plus'][data-field='" + name + "']").removeAttr('disabled')
            } else {
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
        $('.input-number2' + cnt).focusin(function () {
            $(this).data('oldValue', $(this).val());
        });
        $('.input-number2' + cnt).change(function () {

            var minValue = parseInt($(this).attr('min'));
            var maxValue = parseInt($(this).attr('max'));
            var valueCurrent = parseInt($(this).val());

            var name = $(this).attr('name');
            if (valueCurrent >= minValue) {
                $(".btn-number2[data-type='minus'][data-field='" + name + "']").removeAttr('disabled')
            } else {
                alert('Sorry, the minimum value was reached');
                $(this).val($(this).data('oldValue'));
            }
            if (valueCurrent <= maxValue) {
                $(".btn-number2[data-type='plus'][data-field='" + name + "']").removeAttr('disabled')
            } else {
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

        $('#btnSearchItems' + cnt).click(function (e) {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");

            debugger
            let sys: SystemTools = new SystemTools();

            var storeId = Number(ddlStoreHeader.value);//and OnhandQty > 0
            var FinYear = SysSession.CurrentEnvironment.CurrentYear;//and OnhandQty > 0
            let qury = "CompCode = " + compcode + " and  StoreId=" + storeId + " and IsPurchase = 1 and FinYear = " + FinYear;

            sys.FindKey(Modules.IssueToCC, "btnSearchItems", qury, () => {
                let id = SearchGrid.SearchDataGrid.SelectedKey

                ItemBaesdFamilyDetails = ItemFamilyDetails.filter(x => x.ItemID == id);

                //$('#ddlFamily' + cnt).val(ItemBaesdFamilyDetails[0].ItemFamilyID);

                $('#ddlFamily' + cnt + ' option[value=' + ItemBaesdFamilyDetails[0].ItemFamilyID+']').prop('selected', 'selected').change();

                let searchItemID = ItemBaesdFamilyDetails[0].ItemID;

                FillddlItems(Number($('#ddlFamily' + cnt).val()), Number(ddlStoreHeader.value));
                $('#ddlItem' + cnt).empty();
                $('#ddlItem' + cnt).append('<option value="' + null + '">' + "اختر الصنف" + '</option>');
                for (var i = 0; i < ItemBaesdFamilyDetails.length; i++) {
                    $('#ddlItem' + cnt).append('<option data-MinUnitPrice="' + ItemBaesdFamilyDetails[i].MinUnitPrice + '" data-OnhandQty="' + ItemBaesdFamilyDetails[i].OnhandQty + '" value="' + ItemBaesdFamilyDetails[i].ItemID + '">' + (lang == "ar" ? ItemBaesdFamilyDetails[i].Itm_DescA : ItemBaesdFamilyDetails[i].Itm_DescE) + '</option>');
                }

                $('#ddlItem' + cnt).val(searchItemID);



                var selectedItem = $(dropddlItem + ' option:selected').attr('value');
                var selectedFamily = $(drop + ' option:selected').attr('value');

                var itemID = Number(selectedItem);
                var FamilyID = Number(selectedFamily);
                var res = false;
                var NumberRowid = $("#ReciveDetailsID" + cnt).val();
                res = checkRepeatedItems(itemID, FamilyID, NumberRowid);
                $("#txtPrice" + cnt).val("1");
                $("#txtPriceFc" + cnt).val("1");
                $("#txtQuantity" + cnt).val("1");
                $("#txtDiscountPrc" + cnt).val("0");
                $("#txtDiscountAmount" + cnt).val("0"); 
                if (res == true) {
                $("#ddlItem" + cnt).val("null");  
                    DisplayMassage('( لايمكن تكرار نفس الاصناف علي الفاتورة )', 'The same items cannot be repeated on the invoice', MessageType.Error);
                } 
              
                totalRow(cnt, true); 




            });
        });


        //script
        //fill dropdownlist
        var drop = '#ddlFamily' + cnt;
        $('#ddlFamily' + cnt).empty();
        $('#ddlFamily' + cnt).append('<option value="' + null + '">' + (lang == "ar" ? "اختر النوع" : "Choose type") + '</option>');
        for (var i = 0; i < FamilyDetails.length; i++) {
            $('#ddlFamily' + cnt).append('<option value="' + FamilyDetails[i].ItemFamilyID + '">' + (lang == "ar" ? FamilyDetails[i].DescA : FamilyDetails[i].DescL) + '</option>');
        }
        $('#ddlFamily' + cnt).change(
            () => {
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
        $('#ddlItem' + cnt).change(
            () => {
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
                    $("#txtNetUnitPrice" + cnt).val("0");
                    ComputeTotals();
                } else {
               
                    $("#txtPriceFc" + cnt).val("1");
                    $("#txtQuantity" + cnt).val("1");
                    $("#txtDiscountPrc" + cnt).val("0");
                    $("#txtDiscountAmount" + cnt).val("0");

                    totalRow(cnt, true);


                    itemid_LastPrice = $('#ddlItem' + cnt).val();
                    GetLastPrice(itemid_LastPrice, $("#ddlItem" + cnt + " option:selected").text())

                }
            });

        // text change

        $("#txtQuantity" + cnt).on('keyup', function () {
            debugger
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");



            totalRow(cnt, true);


        });

        $("#txtPriceFc" + cnt).on('keyup', function () {
            debugger
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");



            totalRow(cnt, true);

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
        $("#txtQuantity" + cnt).change(() => {
            debugger
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
            totalRow(cnt, true);
             
        });

        $("#txtPrice" + cnt).change(() => {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");

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


            let txtPrice = Number($("#txtPrice" + cnt).val());
            let txtDiscountAmount = Number($("#txtDiscountAmount" + cnt).val());

            $("#txtDiscountPrc" + cnt).val(((txtDiscountAmount / txtPrice) * 100).RoundToSt(2));

            $("#txtNetUnitPrice" + cnt).val((txtPrice - txtDiscountAmount).RoundToSt(2));


            totalRow(cnt, false);

        });

        $("#txtAddons" + cnt).change(() => {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
            $("#txtTotAddons" + cnt).val((Number($("#txtAddons" + cnt).val()) + Number($("#txtPrice" + cnt).val())));
            totalRow(cnt, true); 
        });


        $("#No_Row" + cnt).on('click', function () {
            itemid_LastPrice = $('#ddlItem' + cnt).val();

            GetLastPrice(itemid_LastPrice, $("#ddlItem" + cnt + " option:selected").text())

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

            var FamilyID: number = Number(ItemDetails[cnt].ItemFamilyID);
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

            $("#txtAddons" + cnt).prop("value", (ItemDetails[cnt].UnitAddCost == null || undefined) ? 0 : ItemDetails[cnt].UnitAddCost.RoundToSt(2));
            $("#txtTotAddons" + cnt).prop("value", (ItemDetails[cnt].NetUnitCost == null || undefined) ? 0 : ItemDetails[cnt].NetUnitCost.RoundToSt(2));

            debugger
             
            $("#txtPriceFc" + cnt).prop("value", (ItemDetails[cnt].OrgUnitpriceFC == null || undefined) ? 0 : ItemDetails[cnt].OrgUnitpriceFC.RoundToSt(2)); 
            $("#txtNetUnitPrice" + cnt).prop("value", (ItemDetails[cnt].RecUnitPriceFC == null || undefined) ? 0 : ItemDetails[cnt].RecUnitPriceFC.RoundToSt(2));
            $("#txtDiscountPrc" + cnt).prop("value", (ItemDetails[cnt].DiscountPrc == null || undefined) ? 0 : ItemDetails[cnt].DiscountPrc.RoundToSt(2)); 
            $("#txtDiscountAmount" + cnt).prop("value", (ItemDetails[cnt].DiscountAmount == null || undefined) ? 0 : ItemDetails[cnt].DiscountAmount.RoundToSt(2));

        

            $("#txtTax" + cnt).prop("value", (ItemDetails[cnt].VatAmount == null || undefined) ? 0 : ItemDetails[cnt].VatAmount.RoundToSt(2));
            var price: number = ItemDetails[cnt].RecUnitPrice;
            var pricefc: number = ItemDetails[cnt].RecUnitPriceFC;
            var qutity: number = ItemDetails[cnt].RecQty;
            var total: number = price * qutity;
            var totalfc: number = pricefc * qutity;
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
            var ItemObj = ItemFamilyDetails.filter(s => s.ItemID == itemID);
            $("#ddlFamily" + cnt).prop("value", ItemObj[0].ItemFamilyID);

            FillddlItems(ItemObj[0].ItemFamilyID, Number(ddlStoreHeader.value));


            for (var i = 0; i < ItemBaesdFamilyDetails.length; i++) {
                $('#ddlItem' + cnt).append('<option  value="' + ItemBaesdFamilyDetails[i].ItemID + '">' + (lang == "ar" ? ItemBaesdFamilyDetails[i].Itm_DescA : ItemBaesdFamilyDetails[i].Itm_DescE) + '</option>');
            }
            $("#ddlItem" + cnt).prop("value", PurOrderDetailModel.IQ_GetPurchaseOrderDetail[cnt].ItemID);
            $("#UnitCost" + cnt).prop("value", PurOrderDetailModel.IQ_GetPurchaseOrderDetail[cnt].StockUnitCost);
            //POQty – TotRecQty where POQty – TotRecQty> 0 
            var PurQuantity: number = PurOrderDetailModel.IQ_GetPurchaseOrderDetail[cnt].POQty - PurOrderDetailModel.IQ_GetPurchaseOrderDetail[cnt].TotRecQty;
            if (PurQuantity > 0) { $("#txtQuantity" + cnt).prop("value", PurQuantity); } else { $("#txtQuantity" + cnt).prop("value", 0); }


            $("#txtQuantityReturnValue" + cnt).prop("value", 0);

            $("#txtPrice" + cnt).prop("value", (PurOrderDetailModel.IQ_GetPurchaseOrderDetail[cnt].UnitPrice == null || undefined) ? 0 : PurOrderDetailModel.IQ_GetPurchaseOrderDetail[cnt].UnitPrice.RoundToSt(2));

            $("#txtTax" + cnt).prop("value", (ItemDetails[cnt].VatAmount == null || undefined) ? 0 : ItemDetails[cnt].VatAmount.RoundToSt(2));
            var price: number = PurOrderDetailModel.IQ_GetPurchaseOrderDetail[cnt].UnitPrice;
              
            var total: number = 0;
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

    function totalRow(cnt: number, flagDiscountAmount: boolean) {
        debugger

         
        let txtPrice = Number($("#txtPriceFc" + cnt).val()) 
        let txtDiscountPrc = Number($("#txtDiscountPrc" + cnt).val());

        if (flagDiscountAmount) {
            $("#txtDiscountAmount" + cnt).val( ((txtDiscountPrc * txtPrice) / 100).toString());
            $("#txtNetUnitPrice" + cnt).val((txtPrice - ((txtDiscountPrc * txtPrice) / 100)).RoundToSt(2));
        }
        else {

            let txtDiscountAmount = Number($("#txtDiscountAmount" + cnt).val());
            $("#txtDiscountPrc" + cnt).val(((txtDiscountAmount / txtPrice) * 100).RoundToSt(2));
            $("#txtNetUnitPrice" + cnt).val((txtPrice - txtDiscountAmount).RoundToSt(2));
        }




        var txtQuantityValue = $("#txtQuantity" + cnt).val();
        var txtPriceValueFc = $("#txtNetUnitPrice" + cnt).val();



        //var txtQuantityValue = $("#txtQuantity" + cnt).val();
        //var txtPriceValueFc = $("#txtPriceFc" + cnt).val();
        var totalFc = Number(txtQuantityValue) * Number(txtPriceValueFc);
        $("#txtTotalFc" + cnt).val(Number(totalFc).toFixed(2));


        var txtPriceValue = $("#txtNetUnitPrice" + cnt).val() * (Number($("#txtCurrencyRate").val()) == 0 ? 1 : Number($("#txtCurrencyRate").val()));
        $("#txtPrice" + cnt).val(txtPriceValue);
        var total = Number(txtQuantityValue) * Number(txtPriceValue);
        $("#txtTotal" + cnt).val(total);

        var vatAmount = Number(total) * VatPrc / 100;
        $("#txtTax" + cnt).val(vatAmount);
        var totalAfterVat = Number(vatAmount) + Number(total);
        $("#txtTotAfterTax" + cnt).val(totalAfterVat.RoundToSt(2));


        ComputeTotals();


    }
    function ComputeTotals() {

        var Totalbefore: number = 0;
        var TotalDiscount: number = 0;
        var txtQuantityVal: number = 0;
        var txtPriceVal: number = 0;
        var Totallll: number = 0;
        var txtPriceValFc: number = 0;
        var TotalFc: number = 0;
        var txtTaxVal: number = 0;
        var txtTotAfterTaxVal: number = 0;
        var txtAddonsVal: number = 0;
        var FullAddons: number = 0;
        debugger
        for (let i = 0; i < CountGrid; i++) {
            debugger
            var flagvalue = $("#txt_StatusFlag" + i).val();
            if (flagvalue != "d" && flagvalue != "m") {
                txtQuantityVal += Number($("#txtQuantity" + i).val()); // عدد العبوات
                txtPriceVal = Number($("#txtNetUnitPrice" + i).val() * currencrRate);
                Totallll += Number((Number($("#txtQuantity" + i).val()) * txtPriceVal));

                txtPriceValFc = Number($("#txtNetUnitPrice" + i).val());
                TotalFc += Number((Number($("#txtQuantity" + i).val()) * txtPriceValFc).RoundToSt(2));

                txtTaxVal += Number($("#txtTax" + i).val());
                txtTotAfterTaxVal += Number($("#txtTotAfterTax" + i).val());
                txtAddonsVal += Number($("#txtAddons" + i).val());
                FullAddons += txtAddonsVal * txtQuantityVal;



                Totalbefore += (Number($("#txtQuantity" + i).val()) * Number($("#txtPriceFc" + i).val()));
                Totalbefore = Number(Totalbefore.RoundToSt(2).toString());

                TotalDiscount += (Number($("#txtQuantity" + i).val()) * Number($("#txtDiscountAmount" + i).val()));
                TotalDiscount = Number(TotalDiscount.RoundToSt(2).toString());

            }
        }
        $("#txtLocalTotalFooter").val(TotalFc);
        var txtAddonsTot = Number($("#txtAddons").val());
        txtFamilyType.value = CountItems.toString();//عدد الاصناف 
        $("#txtItemsNumber").val(txtQuantityVal);// عدد العبوات
        //  var FullAllPriceWithoutTaxVal = (txtAddonsTot + Total).RoundToSt(2);
        $("#txtTotalPurchaseWithoutTax").val((txtAddonsTot + Totallll).RoundToSt(2));//مجمل التكلفة بدون ضريبة
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
         
        txtTotalDiscount.value = TotalDiscount.toString();
        txtTotalbefore.value = Totalbefore.toString();

        ComputeTotalsCharge();

    }
    function checkRepeatedItems(itemValue: number, familyValue: number, NumberRowid: number) {
        var items: number = Number(CountGrid);
        var flag = false;
        for (let i = 0; i < items - 1; i++) {
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
    function DeleteRow(RecNo: number) {
        if (!SysSession.CurrentPrivileges.Remove) return;
        WorningMessage("هل تريد الحذف؟", "Do you want to delete?", "تحذير", "worning", () => {
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
        debugger
        let Chack_Flag = false;
        let flagval = "";
        let Ser = 1;
        for (let i = 0; i < CountGrid; i++) {
            flagval = $("#txt_StatusFlag" + i).val();
            if (flagval != "d" && flagval != "m") {
                $("#txtSerialH" + i).val(Ser);
                Ser++;
            }
            if (flagval == 'd' || flagval == 'm') {
                Chack_Flag = true
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

        if (!SysSession.CurrentPrivileges.AddNew) return;
        var CanAddCharge: boolean = true;
        if (CountGridCharge > 0) {
            var LastRowNoCharge = CountGridCharge - 1;
            CanAddCharge = ValidationCharge_Grid(LastRowNoCharge);
        }
        if (CanAddCharge) {

            Vendor_list = filterVendorDetails.filter(x => x.Isactive == true);

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
    function BuildControlsCharges(cnt: number) {
        var html;
        html = `<tr id= "No_Row_1${cnt}">
                    <input id="ReceiveExpensesID${cnt}" type="hidden" class="form-control display_none"  />
	                <td>
		                <div class="form-group">
			                <span id="btn_minus1${cnt}"><i class="fas fa-minus-circle fs-4 btn-minus"></i></span>
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
                            <input id="txtSerial${cnt}" type="text" class="form-control" disabled value="${CountItemsCharge}"/>
		                </div>
	                </td>
                     <td>
		                <div class="form-group">
                            <select id="txtAddonsCharge${cnt}" class="form-control" value="null" ></select>
		                </div>
	                </td>
                     <td>
		                <div class="form-group">
			                <input id="txtAddonsTypeCharge${cnt}" type="text" class="form-control" disabled value=" "/>
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
			                <input id="txtValueCharge${cnt}" type="text" class="form-control"  value="0"/>
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
                            <select id="txtVatType${cnt}" class="form-control " value="null" ></select>
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
                            <input id="txtVatCharge${cnt}" type="text" disabled value="0" class="form-control "  />
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
                            <input id="txtValueAfterVatCharge${cnt}" type="text" disabled class="form-control"   value="0" />
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
                            <select id="txtVendorIsCheckCharge${cnt}" class="form-control"  ></select>
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
                            <input id="txtInvoiceNumberCharge${cnt}" type="text" class="form-control"  value="0"/>
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
                            <input id="txtInvoiceDateCharge${cnt}" type="date" class="form-control"  />
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
                            <select id="txtVendorCharge${cnt}" class="form-control"  ></select>
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
                            <select id="txt_D_CashBox${cnt}" name=""  disabled="disabled" class="form-control" tabindex="-1" aria-hidden="true">
                             <option value="Null">${ (lang == "ar" ? "الصندوق" : "CashBox")}  </option>
                            </select>
		                </div>
	                </td>
                    <input id="txt_StatusFlag1${cnt}" name = " " type = "hidden" class="form-control"/>
                    <input id="txt_ID1${cnt}" name = " " type = "hidden" class="form-control" />;

                </tr>`;
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
            } else {
                var addTypeobj = AddonsData.filter(s => s.ChargeID == Addons);
                var addType = addTypeobj[0].IsAddition;
                if (addType == true) {
                    $("#txtAddonsTypeCharge" + cnt).val("اضافة");
                } else {
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
                var NumberSelect = VatTypeData.filter(s => s.CODE == Code);
                $("#txtVatType" + cnt).attr('data-VatPerc', NumberSelect[0].VatPerc);
                var vatPercentage = Number(NumberSelect[0].VatPerc);
                var amount = Number($("#txtValueCharge" + cnt).val());
                if (amount >= 0) {
                    var vatAmount = (vatPercentage * amount) / 100;
                    $("#txtVatCharge" + cnt).val(vatAmount.RoundToSt(2));

                    $("#txtValueAfterVatCharge" + cnt).val((vatAmount + amount).RoundToSt(2));

                } else {

                    $("#txtVatCharge" + cnt).val("0");
                    $("#txtValueAfterVatCharge" + cnt).val("0");

                }
            } else {
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
                var NumberSelect = VatTypeData.filter(s => s.CODE == Code);
                var vatPercentage = Number(NumberSelect[0].VatPerc);
                var amount = Number($("#txtValueCharge" + cnt).val());
                if (amount >= 0) {
                    var vatAmount = (vatPercentage * amount) / 100;
                    $("#txtVatCharge" + cnt).val(vatAmount.RoundToSt(2));

                    $("#txtValueAfterVatCharge" + cnt).val((vatAmount + amount).RoundToSt(2));

                } else {

                    $("#txtVatCharge" + cnt).val("0");
                    $("#txtValueAfterVatCharge" + cnt).val("0");

                }
            } else {
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
            else { $("#txt_D_CashBox" + cnt).prop("disabled", true); $("#txt_D_CashBox" + cnt).prop("value", "Null"); }
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
            PurReceiveChargeData[cnt].IsAddition
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
    function DeleteRowCharge(RecNo: number) {
        if (!SysSession.CurrentPrivileges.Remove) return;
        WorningMessage("هل تريد الحذف؟", "Do you want to delete?", "تحذير", "worning", () => {
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
            $("#No_Row_1" + RecNo).attr("hidden", "true");
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
        for (let i = 0; i < CountGridCharge; i++) {
            var flagvalue = $("#txt_StatusFlag1" + i).val();
            if (flagvalue != "d" && flagvalue != "m") {
                if ($("#txtAddonsTypeCharge" + i).val() == "اضافة") {
                    txtValueChargeTot += Number($("#txtValueCharge" + i).val());

                    txtVatChargeTot += Number($("#txtVatCharge" + i).val())

                    txtTotalAddonsTot += txtVatChargeTot + txtValueChargeTot;
                }
                else {
                    txtValueChargeTot -= Number($("#txtValueCharge" + i).val());

                    txtVatChargeTot -= Number($("#txtVatCharge" + i).val())

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
        debugger
        let Chack_Flag = false;
        let flagval = "";
        let Ser = 1;
        for (let i = 0; i < CountGridCharge; i++) {
            flagval = $("#txt_StatusFlag1" + i).val();
            if (flagval != "d" && flagval != "m") {
                $("#txtSerial" + i).val(Ser);
                Ser++;
            }
            if (flagval == 'd' || flagval == 'm') {
                Chack_Flag = true
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
        var newCount: number = 0;
        for (let i = 0; i < CountGrid; i++) {
            if ($("#txt_StatusFlag" + i).val() != "d" && $("#txt_StatusFlag" + i).val() != "m") {
                newCount++;
            }
        }

        if (!CheckDate(DateFormat(txtDateHeader.value).toString(), DateFormat(SysSession.CurrentEnvironment.StartDate).toString(), DateFormat(SysSession.CurrentEnvironment.EndDate).toString())) {
            DisplayMassage('  التاريخ ليس متطابق مع تاريخ السنه (' + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ')', 'The date does not match the date of the year' + DateFormat(SysSession.CurrentEnvironment.StartDate).toString(), MessageType.Error);
            return false
        } else if (txtVendorName.value == "") {
            DisplayMassage(" برجاء اختيار المورد", "Please select a supplier", MessageType.Error);
            Errorinput(txtVendorName);
            return false
        }
        else if (ddlSalesmanHeader.value == "null") {
            DisplayMassage(" برجاء اختيار المندوب", "Please select the salesman", MessageType.Error);
            Errorinput(ddlSalesmanHeader);
            return false
        }
        else if (ddlIsCash.value == "null") {
            DisplayMassage(" برجاء اختيار طريقه الدفع", "Please choose a payment method", MessageType.Error);
            Errorinput(ddlIsCash);
            return false
        } else if (ddlIsCash.value == "1" && ddlCashBoxH.value == "null") {
            DisplayMassage(" برجاء اختيار الصندوق", "Please choose a Cashbox", MessageType.Error);
            Errorinput(ddlCashBoxH);
            return false
        }
        else if (ddlReciveTypeHeader.value == "null") {
            DisplayMassage(" برجاءاختيار  نوع الاستلام", "Please choose the type of receipt", MessageType.Error);
            Errorinput(ddlReciveTypeHeader);
            return false
        }
        else if (ddlTaxTypeHeader.value == "null") {
            DisplayMassage(" برجاء اختيار نوع الضريبة", "Please select a tax type", MessageType.Error);
            Errorinput(ddlTaxTypeHeader);
            return false
        }
        else if (VendorRecieptID.value == "") {
            DisplayMassage(" برجاء  ادخال رقم فاتورة المورد", "Please enter the vendor invoice number", MessageType.Error);
            Errorinput(VendorRecieptID);
            return false
        }
        else if (txtCurrencyRate.value == "") {
            DisplayMassage(" برجاء  ادخال معامل التحويل", "Please enter Currency rate", MessageType.Error);
            Errorinput(txtCurrencyRate);
            return false
        }
        else if (Number($('#txtFamilyType').val()) == 0) {
            DisplayMassage(" برجاء ادخال بيانات الفاتورة", "Please enter the billing information", MessageType.Error);
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
        if ($("#txt_StatusFlag" + rowcount).val() == "d" || $("#txt_StatusFlag" + rowcount).val() == "m") {
            return true;
        }
        else {
            var RequiredQty: number = Number($("#txtQuantity" + rowcount).val());
            var PriceVal: number = Number($("#txtPrice" + rowcount).val());
            if ($("#ddlFamily" + rowcount).val() == "" || $("#ddlFamily" + rowcount).val() == "null") {
                DisplayMassage(" برجاءادخال النوع", "Please enter the type", MessageType.Error);
                Errorinput($("#ddlFamily" + rowcount));
                return false
            }
            else if ($("#ddlItem" + rowcount).val() == " " || $("#ddlItem" + rowcount).val() == "null") {
                DisplayMassage(" برجاءادخال الصنف", "Please enter the item", MessageType.Error);
                Errorinput($("#ddlItem" + rowcount));
                return false
            }
            else if (RequiredQty == 0) {
                DisplayMassage(" برجاءادخال الكمية", "Please enter the quantity", MessageType.Error);
                Errorinput($("#txtQuantity" + rowcount));
                return false
            }
            else if (PriceVal == 0) {
                DisplayMassage(" برجاءادخال السعر", "Please enter the price", MessageType.Error);
                Errorinput($("#txtPrice" + rowcount));
                return false
            }
            return true;
        }
    }
    function ValidationCharge_Grid(rowcount: number) {
        if ($("#txt_StatusFlag1" + rowcount).val() == "d" || $("#txt_StatusFlag1" + rowcount).val() == "m") {
            return true;
        }
        else {
            var chargeVal: number = Number($("#txtValueCharge" + rowcount).val());
            if ($("#txtAddonsCharge" + rowcount).val() == "null") {
                DisplayMassage(" برجاء اختيار الإضافة", "Please enter the Adds", MessageType.Error);
                Errorinput($("#txtAddonsCharge" + rowcount));
                return false
            } else if (chargeVal == 0) {
                DisplayMassage(" برجاء اختيار قيمة الاضافة", "Please enter the Adds on value", MessageType.Error);
                Errorinput($("#txtValueCharge" + rowcount));
                return false
            }
            else if ($("#txtAddonsTypeCharge" + rowcount).val() == "null") {
                DisplayMassage(" برجاء اختيار نوع الإضافة", "Please enter the Adds on Type", MessageType.Error);
                Errorinput($("#txtAddonsTypeCharge" + rowcount));
                return false
            }
            else if ($("#txtVatType" + rowcount).val() == "null") {
                DisplayMassage(" برجاء اختيار نوع الضريبة", "Please enter the tax type", MessageType.Error);
                Errorinput($("#txtVatType" + rowcount));
                return false
            }
            else if ($("#txtVendorCharge" + rowcount).val() == "null") {
                DisplayMassage(" برجاءاختيارالمورد في جدول الاضافات", "Please choose the vendor in the additions table", MessageType.Error);
                Errorinput($("#txtVendorCharge" + rowcount));
                return false
            }
            else if ($("#txt_D_CashBox" + rowcount).val() == "Null" && $("#txtVendorIsCheckCharge" + rowcount).val() == "1" && ($("#txt_StatusFlag1" + rowcount).val() != 'd') && ($("#txt_StatusFlag1" + rowcount).val() != 'm')) {
                DisplayMassage(" برجاء اختيار الصندوق", "please choose the cashbox", MessageType.Error);
                Errorinput($("#txt_D_CashBox" + rowcount));
                return false
            }
        }
        return true;

    }
    function EnableControls() {
        debugger
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
            $("#btnSearchItems" + CountGrid).removeAttr("disabled");
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
        debugger
        var StatusFlag: String;
        ReceiveModel = new I_Pur_TR_Receive();
        ReceiveItemsDetailsModel = new Array<I_Pur_TR_ReceiveItems>();
        chargesDetailsModel = new Array<I_Pur_Tr_ReceiveCharges>();

        MasterDetailModel.UserCode = SysSession.CurrentEnvironment.UserCode;
        MasterDetailModel.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;

        ReceiveModel.CompCode = Number(compcode);
        ReceiveModel.BranchCode = Number(BranchCode);

        /// if come from PurOrder
        ReceiveModel.PurOrderID = globalPurOrderID;

        ReceiveModel.TrType = 0//0 invoice 1 return
        ReceiveModel.PurRecType = Number(ddlReciveTypeHeader.value); //  retail PurRecType
        ReceiveModel.StoreID = Number(ddlStoreHeader.value);//main store
        ReceiveModel.TrDate = txtDateHeader.value;
        if (chkActive.checked == true) { ReceiveModel.Status = 1; } else { ReceiveModel.Status = 0; }
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
        } else {
            ReceiveModel.CashBoxID = 0;
            ReceiveModel.IsCash = false;
        }


        //if (ddlIsCash.value == "0") { ReceiveModel.IsCash = false; $('#ddlCashBoxH').removeAttr('disabled'); } else { ReceiveModel.IsCash = true; $('#ddlCashBoxH').attr('disabled','disabled');; }

        ReceiveModel.NetAdditionVat = Number(txtAddonsTax.value);
        ReceiveModel.NetAdditionCost = Number(txtAddons.value);
        ReceiveModel.NetDue = Number(txtTotalFamily.value);
        ReceiveModel.VatAmount = Number(txtTax.value);
        ReceiveModel.Total = Number(txtTotal.value);

        ReceiveModel.ItemTotalFC = Number(txtTotalbefore.value);
        ReceiveModel.ItemDiscountTotalFC = Number(txtTotalDiscount.value);
        ReceiveModel.DiscountAmount = Number(txtTotalDiscount.value);

        //ReceiveModel.ItemTotal = Number(txtTotalbefore.value);
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
                ReceiveItemSingleModel.RecStockQty = $('#txtQuantity' + i).val();//
                ReceiveItemSingleModel.TotRetQty = $("#txtQuantityReturnValue" + i).val();
                ReceiveItemSingleModel.RecUnitPrice = $("#txtPrice" + i).val();
                ReceiveItemSingleModel.UnitAddCost = $("#txtAddons" + i).val();
                ReceiveItemSingleModel.NetUnitCost = $("#txtTotAddons" + i).val();
                ReceiveItemSingleModel.VatAmount = $("#txtTax" + i).val();
                ReceiveItemSingleModel.StockUnitCost = Number($("#UnitCost" + i).val())
                ReceiveItemSingleModel.VatPrc = VatPrc;
                ReceiveItemSingleModel.UnitID = Number($('option:selected', $("#ddlItem" + i)).attr('data-UomID'));
               

                ReceiveItemSingleModel.DiscountPrc = Number($("#txtDiscountPrc" + i).val());
                ReceiveItemSingleModel.DiscountAmount = Number($("#txtDiscountAmount" + i).val());
                ReceiveItemSingleModel.OrgUnitpriceFC = Number($("#txtPriceFc" + i).val());
                ReceiveItemSingleModel.RecUnitPriceFC = $("#txtNetUnitPrice" + i).val();
                //ReceiveItemSingleModel.RecUnitPriceFC = $("#txtPriceFc" + i).val();


                chargesingleModel.VatPrc = Number($("#txtVatType" + i).attr('data-VatPerc'));

                ReceiveItemsDetailsModel.push(ReceiveItemSingleModel);

            }
            if (StatusFlag == "u") {
                var RecItemId = $("#ReciveDetailsID" + i).val()
                ReceiveItemSingleModel.ReciveDetailsID = RecItemId;
                ReceiveItemSingleModel.Serial = $("#txtSerialH" + i).val();
                ReceiveItemSingleModel.ItemID = $("#ddlItem" + i).val();
                ReceiveItemSingleModel.StatusFlag = StatusFlag.toString();
                ReceiveItemSingleModel.RecQty = $('#txtQuantity' + i).val();
                ReceiveItemSingleModel.RecStockQty = $('#txtQuantity' + i).val();//
                ReceiveItemSingleModel.TotRetQty = $("#txtQuantityReturnValue" + i).val();
                ReceiveItemSingleModel.RecUnitPrice = $("#txtPrice" + i).val();
                ReceiveItemSingleModel.UnitAddCost = $("#txtAddons" + i).val();
                ReceiveItemSingleModel.NetUnitCost = $("#txtTotAddons" + i).val();
                ReceiveItemSingleModel.VatAmount = $("#txtTax" + i).val();
                ReceiveItemSingleModel.StockUnitCost = Number($("#UnitCost" + i).val())

                ReceiveItemSingleModel.DiscountPrc = Number($("#txtDiscountPrc" + i).val());
                ReceiveItemSingleModel.DiscountAmount = Number($("#txtDiscountAmount" + i).val());
                ReceiveItemSingleModel.OrgUnitpriceFC = Number($("#txtPriceFc" + i).val());
                ReceiveItemSingleModel.RecUnitPriceFC = Number($("#txtNetUnitPrice" + i).val());
                //ReceiveItemSingleModel.RecUnitPriceFC = $("#txtPriceFc" + i).val();

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
                chargesingleModel.VatType = $('#txtVatType' + i).val();//
                chargesingleModel.VatAmount = $("#txtVatCharge" + i).val();
                chargesingleModel.NetAtferVat = $("#txtValueAfterVatCharge" + i).val();
                var ispaid = $("#txtVendorIsCheckCharge" + i).val();
                if (ispaid == "0") { chargesingleModel.isPaidByVendor = true } else { chargesingleModel.isPaidByVendor = false }

                chargesingleModel.RefInvoiceNo = $("#txtInvoiceNumberCharge" + i).val();
                chargesingleModel.RefInvoiceDate = $("#txtInvoiceDateCharge" + i).val();
                chargesingleModel.VendorID = $("#txtVendorCharge" + i).val();
                //chargesingleModel.CashBoxID = $("#txt_D_CashBox" + i).val();

                if ($("#txt_D_CashBox" + i).val() == "Null") { chargesingleModel.CashBoxID = 0; }
                else { chargesingleModel.CashBoxID = $("#txt_D_CashBox" + i).val(); }

                chargesDetailsModel.push(chargesingleModel);

            }
            if (StatusFlag == "u") {
                var chargeItemId = $("#ReceiveExpensesID" + i).val();
                chargesingleModel.StatusFlag = StatusFlag.toString();
                chargesingleModel.Serial = $("#txtSerial" + i).val();
                chargesingleModel.ReceiveExpensesID = chargeItemId;
                chargesingleModel.ChargeID = $("#txtAddonsCharge" + i).val();
                chargesingleModel.Amount = $('#txtValueCharge' + i).val();
                chargesingleModel.VatType = $('#txtVatType' + i).val();//
                chargesingleModel.VatAmount = $("#txtVatCharge" + i).val();
                chargesingleModel.NetAtferVat = $("#txtValueAfterVatCharge" + i).val();
                var ispaid = $("#txtVendorIsCheckCharge" + i).val();
                if (ispaid == "0") { chargesingleModel.isPaidByVendor = true } else { chargesingleModel.isPaidByVendor = false }

                chargesingleModel.RefInvoiceNo = $("#txtInvoiceNumberCharge" + i).val();
                chargesingleModel.RefInvoiceDate = $("#txtInvoiceDateCharge" + i).val();
                chargesingleModel.VendorID = $("#txtVendorCharge" + i).val();
                //chargesingleModel.CashBoxID = $("#txt_D_CashBox" + i).val();
                if ($("#txt_D_CashBox" + i).val() == "Null") { chargesingleModel.CashBoxID = 0; }
                else { chargesingleModel.CashBoxID = $("#txt_D_CashBox" + i).val(); }
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
        MasterDetailModel.I_Pur_Tr_ReceiveCharges = chargesDetailsModel;//I_Pur_Tr_ReceiveCharges
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
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess == true) {
                    debugger
                    let res = result.Response as PurReceiveMasterDetails;
                    DateSetsSccess("txtDateHeader", "txtFromDate", "txtToDate");
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
                } else {

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
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess == true) {
                    let res = result.Response as PurReceiveMasterDetails;
                    DateSetsSccess("txtDateHeader", "txtFromDate", "txtToDate");

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
                } else {

                    DisplayMassage(" هناك خطـأ  ", "Error", MessageType.Error);
                }
            }
        });

    }

    function Success(ReceiveID: number) {

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
        let Selecteditem = GetPurReceiveStaisticData.filter(x => x.ReceiveID == Number(ReceiveID));
        GlobalReceiveID = Number(Selecteditem[0].ReceiveID);
        RetrivedPurchaseModel = Selecteditem;
        DataHeader();
        AllGetPurReceiveItemsCharge();
        DisableControls();
        if (RetrivedPurchaseModel[0].Status == 1) {
            chkActive.checked = true;
            chkActive.disabled = !SysSession.CurrentPrivileges.CUSTOM2;
            btnUpdate.disabled = true;

        } else {
            chkActive.checked = false;
            chkActive.disabled = true;
            btnUpdate.disabled = false;
        }
        VatPrc = VatDetails.filter(x => x.CODE == RetrivedPurchaseModel[0].VATType)[0].VatPerc;

        $("#divDetails").removeClass("display_none");
        $("#divEdit").removeClass("display_none");

        $("#btnPrintTransaction").removeClass("display_none");
        $("#btnPrintTransaction").removeClass("display_none");


    }

    function openInvoice() {

        if (!CheckPeriodDate(txtDateHeader.value, "I")) {
            debugger
            DisplayMassage("لا يمكنك الاضافه او التعديل في هذة الفتره المغلقه ", "Please select a Invoice data", MessageType.Error);
            Errorinput(txtDateHeader);
            chkActive.checked = true;
            return false
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
            success: (d) => {
                let result = d as BaseResponse;
                let res = result.Response as PurReceiveMasterDetails;
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

                } else {
                    btnUpdate.disabled = true;
                    $("#btnUpdate").removeClass("display_none");
                }
            }
        });


    }
    function BindAfterInsertorUpdate(receiveid: number) {
        debugger
        ShowFlag = true;
        $("#btnPrintTransaction").removeClass("display_none");
        $("#btnPrintTransaction").removeClass("display_none");
        GlobalReceiveID = receiveid;

        let Selecteditem = GetPurReceiveStaisticData.filter(x => x.ReceiveID == receiveid);
        GlobalReceiveID = Number(Selecteditem[0].ReceiveID);
        RetrivedPurchaseModel = Selecteditem;
        DataHeader();
        AllGetPurReceiveItemsCharge();
    }
    //---------------------------------------------------------------- Print  region----------------------------------------------------
    function PrintReport(OutType: number) {
        //
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
            success: (d) => {

                let result = d.result as string;


                window.open(result, "_blank");
            }
        })
    }
    function btnPrintTransaction_onclick() {
        //
        if (!SysSession.CurrentPrivileges.PrintOut) return;
        let rp: ReportParameters = new ReportParameters();

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
        if (!SysSession.CurrentPrivileges.PrintOut) return;
        let rp: ReportParameters = new ReportParameters();
        rp.Type = 0;
        rp.Repdesign = 1;
        rp.TRId = GlobalReceiveID;


        rp.Name_function = "IProc_Prnt_PurReceivePrice";
        localStorage.setItem("Report_Data", JSON.stringify(rp));

        localStorage.setItem("result", '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>');
        window.open(Url.Action("ReportsPopup", "Home"), "_blank");


    }
}