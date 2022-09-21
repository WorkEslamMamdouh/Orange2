
$(document).ready(() => {
    ////////debugger;
    PurTrReturn.InitalizeComponent();
})

namespace PurTrReturn {
    var TrType = 1;
    var SysSession: SystemSession = GetSystemSession(Modules.PurTrReturn);
    var compcode: Number;
    var BranchCode: number;//SharedSession.CurrentEnvironment.BranchCode;
    var sys: SystemTools = new SystemTools();
    var Finyear: number;
    
    //Arrays    
    var SellerDetails: Array<I_Sls_D_Salesman> = new Array<I_Sls_D_Salesman>();
    var StateDetailsAr: Array<string> = new Array<string>();
    var StateDetailsEn: Array<string> = new Array<string>();
    var VendorDetails: Array<A_Pay_D_Vendor> = new Array<A_Pay_D_Vendor>();    
    var GetPurReceiveStaisticData: Array<IQ_GetPurReceiveStaistic> = new Array<IQ_GetPurReceiveStaistic>();
    var SearchGetPurReceiveStaisticData: Array<IQ_GetPurReceiveStaistic> = new Array<IQ_GetPurReceiveStaistic>();

    //Models
    var ItemDetails: Array<IQ_GetItemStoreInfo> = new Array<IQ_GetItemStoreInfo>();
    var AD_VatTypeDetails: A_D_VAT_TYPE = new A_D_VAT_TYPE();
    var SlsInvoiceItemsDetails: Array<IQ_GetPurReceiveItem> = new Array<IQ_GetPurReceiveItem>();
    var MasterDetailModel: PurReceiveMasterDetails = new PurReceiveMasterDetails();    

    //Model
    var InvoiceStatisticsModel: Array<IQ_GetPurReceiveStaistic> = new Array<IQ_GetPurReceiveStaistic>();
    var InvoiceModel: I_Pur_TR_Receive = new I_Pur_TR_Receive();
    var invoiceItemsModel: Array<I_Pur_TR_ReceiveItems> = new Array<I_Pur_TR_ReceiveItems>();
    var invoiceItemSingleModel: I_Pur_TR_ReceiveItems = new I_Pur_TR_ReceiveItems();
    var PurReceiveStaistic: IQ_GetPurReceiveStaistic = new IQ_GetPurReceiveStaistic();
    var VatDetails: Array<A_D_VAT_TYPE> = new Array<A_D_VAT_TYPE>();
    var cashboxDetails: Array<A_RecPay_D_CashBox> = new Array<A_RecPay_D_CashBox>();
    var FamilyDetails: Array<I_ItemFamily> = new Array<I_ItemFamily>();
    var ItemFamilyDetails: Array<IQ_GetItemStoreInfo> = new Array<IQ_GetItemStoreInfo>();

    //DropDownlist
    var ddlCashBox: HTMLSelectElement;
    var ddlStateType: HTMLSelectElement;
    var ddlVendorDetails: HTMLSelectElement;
    var ddlSalesmanMaster: HTMLSelectElement;    
    var ddlVendorMaster: HTMLSelectElement;
    var ddlFreeSalesman: HTMLSelectElement;    
    var ddlReturnTypeShow: HTMLSelectElement;
   
    // giedView
    var divMasterGrid: JsGrid = new JsGrid();

    //Textboxes
    var txtFromDate: HTMLInputElement;
    var txtToDate: HTMLInputElement;
    var searchbutmemreport: HTMLInputElement;
    var ddlReturnType: HTMLSelectElement;
    var ddlTaxTypeHeader: HTMLSelectElement;    
    var btnShow: HTMLButtonElement;
    var chkActive: HTMLInputElement;


    //Array
    var AddReturnDetailsAr: Array<string> = new Array<string>();
    var AddReturnDetailsEn: Array<string> = new Array<string>();
    

    //TextBoxes
    var txtStartDate: HTMLInputElement;
    var txtEndDate: HTMLInputElement;
    var txtItemCount: HTMLInputElement;
    var txtPackageCount: HTMLInputElement;
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
    var btnAddDetails: HTMLButtonElement;
    var btnEdit: HTMLButtonElement;
    var btnSave: HTMLButtonElement;
    var btnBack: HTMLButtonElement;
    var btnAdd: HTMLButtonElement;
    var btnPrintsFrom_To: HTMLButtonElement;
    var btnRecieveSearch: HTMLButtonElement;
  
    //flags
    var Show: boolean = true;
    var EditFlag: boolean = false;
    var InvoiceFlag: boolean = false;
    var FalgOpen: boolean = false;

    var IsNew;
    //global
    var vatType: number;
    var CountGrid = 0;
    var CountItems: number = 0;
    var PackageCount: number = 0;
    var CountTotal: number = 0;
    var TaxCount: number = 0;
    var NetCount: number = 0;
    var VatPrc;
    var receiveID: number = 0;      
    var ShowFlag;
    var PurRecType = 0;
    var isCash;
    var RefTrID;
    var flag_Insert = 0;
    var StoreID;                    
    var btnPrintTrview: HTMLButtonElement;
    var btnPrintTrPDF: HTMLButtonElement;
    var btnPrintTrEXEL: HTMLButtonElement;
    var btnPrint: HTMLButtonElement;
    var btnPrintTransaction: HTMLButtonElement;
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);
        //------------------------------------------------------ Main Region -----------------------------------
    export function InitalizeComponent() { 
        Finyear = Number(SysSession.CurrentEnvironment.CurrentYear);       
        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") { document.getElementById('Screen_name').innerHTML = " مرتجع المشتريات"; }
        else { document.getElementById('Screen_name').innerHTML = "Returned purchases"; }
        InitalizeControls();
        IntializeEvents();        
        txtFromDate.value = GetDate();
        txtToDate.value = GetDate(); 
        FillddlVendorMaster();
        FillddlSalesmanMaster();
        FillddlReturnType();
        FillddlStateType();
        FillddlFamily();    
      
        FillddlReturnTypeShow();
        fillddlCashBox();
        FillddlTaxType();
        vatType = SysSession.CurrentEnvironment.I_Control[0].DefSlsVatType;
        GetVatPercentage();
        $('#ddlStateType').prop("value", 0);
        $('#ddlReturnType').prop("value", 0);
        $('#ddlShowFreeReturn').prop("value", "2");        
        txtItemCount.value = CountItems.toString();
        txtPackageCount.value = PackageCount.toString();
        txtTotal.value = CountTotal.toString();
        txtTax.value = TaxCount.toString();
        txtNet.value = NetCount.toString();
        $('#ddlStateType').prop("value", 2);
        $('#ddlReturnType').prop("value", 2);
        GetAllIItem();
        txtStartDate.value = DateStartMonth();
        txtEndDate.value = ConvertToDateDash(GetDate()) <= ConvertToDateDash(SysSession.CurrentEnvironment.EndDate) ? GetDate() : SysSession.CurrentEnvironment.EndDate;


        InitializeGrid();
        $("#divMasterGridiv").removeClass("display_none"); 

        //btnShow_onclick();
        $('#btnPrint').addClass('display_none'); 
    }
    function IntializeEvents() { 
        btnShow.onclick = btnShow_onclick;
        chkActive.onclick = chkActive_onchecked;
        btnShow.onclick = btnShow_onclick;       
        btnBack.onclick = btnBack_onclick;
        btnSave.onclick = btnSave_onclick;
        btnRecieveSearch.onclick = btnRecieveSearch_onclick;
        btnEdit.onclick = btnEdit_onclick;        
        btnAdd.onclick = AddNewReturn_onclick;
        searchbutmemreport.onkeyup = _SearchBox_Change; 

        // print Button
        btnPrintTrview.onclick = () => { PrintReport(1); }
        btnPrintTrPDF.onclick = () => { PrintReport(2); }
        btnPrintTrEXEL.onclick = () => { PrintReport(3); }
        //btnPrint.onclick = () => { PrintReport(4); }
        btnPrintTransaction.onclick = PrintTransaction;
        btnPrintsFrom_To.onclick = btnPrintsFrom_To_onclick;

    }
    function Check_on_user_type() {

        if (SysSession.CurrentEnvironment.UserType == 1 || SysSession.CurrentEnvironment.UserType ==3) { //Salesman

            let SalesId = SysSession.CurrentEnvironment.SalesManID;
            SellerDetails = SellerDetails.filter(s => s.SalesmanId == SalesId);
        }
        else if (SysSession.CurrentEnvironment.UserType == 2)
        {

        }  

    }
    function InitalizeControls() {

        //print button
        btnPrintTrview = document.getElementById("btnPrintTrview") as HTMLButtonElement;
        btnPrintTrPDF = document.getElementById("btnPrintTrPDF") as HTMLButtonElement;
        btnPrintTrEXEL = document.getElementById("btnPrintTrEXEL") as HTMLButtonElement;
        btnPrint = document.getElementById("btnPrint") as HTMLButtonElement;   
        btnPrintTransaction = document.getElementById("btnPrintTransaction") as HTMLButtonElement;   
        
        //Select
        compcode = Number(SysSession.CurrentEnvironment.CompCode);  
        BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);  
        ddlVendorMaster = document.getElementById("ddlVendorMaster") as HTMLSelectElement;
        ddlSalesmanMaster = document.getElementById("ddlSalesmanMaster") as HTMLSelectElement;
        ddlVendorDetails = document.getElementById("ddlVendorDetails") as HTMLSelectElement;
        ddlStateType = document.getElementById("ddlStateType") as HTMLSelectElement;
        ddlReturnType = document.getElementById("ddlReturnType") as HTMLSelectElement; 
        ddlReturnTypeShow = document.getElementById("ddlReturnTypeShow") as HTMLSelectElement;
        ddlTaxTypeHeader = document.getElementById("ddlTaxTypeHeader") as HTMLSelectElement; 
        ddlCashBox = document.getElementById("ddlCashBox") as HTMLSelectElement;
        ddlFreeSalesman = document.getElementById("ddlFreeSalesman") as HTMLSelectElement;
        //TextBoxes
        txtFromDate = document.getElementById("txtFromDate") as HTMLInputElement;
        txtToDate = document.getElementById("txtToDate") as HTMLInputElement;
        searchbutmemreport = document.getElementById("searchbutmemreport") as HTMLInputElement; 
        txtStartDate = document.getElementById("txtFromDate") as HTMLInputElement;
        txtEndDate = document.getElementById("txtToDate") as HTMLInputElement;
        txtItemCount = document.getElementById("txtItemCount") as HTMLInputElement;
        txtPackageCount = document.getElementById("txtPackageCount") as HTMLInputElement;
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
        btnAddDetails = document.getElementById("btnAddDetailsCharge") as HTMLButtonElement;// btnBack /*btnSave*/
        btnBack = document.getElementById("btnBack") as HTMLButtonElement;
        btnSave = document.getElementById("btnSave") as HTMLButtonElement;
        btnRecieveSearch = document.getElementById("btnRecieveSearch") as HTMLButtonElement;
        btnEdit = document.getElementById("btnUpdate") as HTMLButtonElement; 
        btnAdd = document.getElementById("btnAdd") as HTMLButtonElement;
        btnPrintsFrom_To = document.getElementById("btnPrintsFrom_To") as HTMLButtonElement;
    }
       //-----------------------------------------------------------------------  DropDownList Region ----------------------------------
    function FillddlVendorMaster() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefVendor", "GetAll"),
            data: { CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    VendorDetails = result.Response as Array<A_Pay_D_Vendor>;

                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {

                        DocumentActions.FillCombowithdefult(VendorDetails, ddlVendorMaster, "VendorID", "NAMEL", "Select Vendor");
                        DocumentActions.FillCombowithdefult(VendorDetails, ddlVendorDetails, "VendorID", "NAMEL", "Select Vendor");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(VendorDetails, ddlVendorMaster, "VendorID", "NAMEA", "اختر المورد");
                        DocumentActions.FillCombowithdefult(VendorDetails, ddlVendorDetails, "VendorID", "NAMEA", "اختر المورد");
                    }
                }
            }
        });
    }
    function FillddlSalesmanMaster() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefSalesMen", "GetAllPurchasePeople"),
            data: { CompCode: compcode, BranchCode: BranchCode, IsPurchaseEnable: true, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    
                    SellerDetails = result.Response as Array<I_Sls_D_Salesman>;

                    Check_on_user_type();
                    $('#ddlSalesmanMaster').append('<option value="null">' + (lang == "ar" ? "اختر المندوب" : "choose Seller") + '</option>');
                    $('#ddlFreeSalesman').append('<option value="null">' + (lang == "ar" ? "اختر المندوب" : "choose Seller") + '</option>');
                    for (var i = 0; i < SellerDetails.length; i++) {
                        $('#ddlSalesmanMaster').append('<option value="' + SellerDetails[i].SalesmanId + '">' + (lang == "ar" ? SellerDetails[i].NameA : SellerDetails[i].NameE) + '</option>');
                        $('#ddlFreeSalesman').append('<option value="' + SellerDetails[i].SalesmanId + '">' + (lang == "ar" ? SellerDetails[i].NameA : SellerDetails[i].NameE) + '</option>');
                    }
                   
                    SysSession.CurrentEnvironment.UserType == 1 || SysSession.CurrentEnvironment.UserType == 3 ? ($('#ddlSalesmanMaster option[value="null"]').remove()) : $('#ddlSalesmanMaster').prop('selectedIndex', 0);
                    
                }
            }
        });
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
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") { DocumentActions.FillCombowithdefult(VatDetails, ddlTaxTypeHeader, "CODE", "DESCRIPTION", "Select Tax"); }
                    else { DocumentActions.FillCombowithdefult(VatDetails, ddlTaxTypeHeader, "CODE", "DESCRIPTION", "اختر الضريبة"); }
                }
            }
        });
    }
    function fillddlCashBox() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefBox", "GetAll"),
            data: { compCode: compcode, BranchCode: BranchCode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    cashboxDetails = result.Response as Array<A_RecPay_D_CashBox>;
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") { DocumentActions.FillCombowithdefult(cashboxDetails, ddlCashBox, "CashBoxID", "CashBox_DescE", "Select CashBox"); }
                    else { DocumentActions.FillCombowithdefult(cashboxDetails, ddlCashBox, "CashBoxID", "CashBox_DescA", "اختر الصندوق"); }
                }
            }
        });
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
    function FillddlItem(ItemFamilyID: number, StoreId: number) {
        debugger
        ItemDetails = ItemFamilyDetails.filter(x => x.ItemFamilyID == ItemFamilyID && x.StoreId == StoreId);

    }
  //-----------------------------------------------------------------------  Events Region ----------------------------------
    function txtInvoiceNumber_onchange() {
        $('#div_Data').html("");
        txtItemCount.value = "";
        txtPackageCount.value = "";
        txtTotal.value = "";
        txtTax.value = "";
        txtNet.value = "";
        lblReturnNumber.value = "";
        txtInvoiceDate.value = "";
        ddlReturnTypeShow.value = "0";
        ddlFreeSalesman.value = "null";
        $('#txtCreatedBy').prop("value", "");
        $('#txtCreatedAt').prop("value", "");
        $('#txtUpdatedBy').prop("value", "");
        $('#txtUpdatedAt').prop("value", "");
        $("#divReturnDetails").removeClass("display_none");
        Show = true;
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("PurTrReceive", "GetPurReceiveByIDFromStatistics"),
            data: { receiveID: receiveID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.Response.length == 0) {
                    DisplayMassage('( لا توجد فاتورة بهذا الرقم)', 'there is no invoice with that Number', MessageType.Error);
                    txtInvoiceNumber.innerText = "";
                    btnRecieveSearch.disabled = false;
                } else if (result.IsSuccess) {
                    InvoiceStatisticsModel = result.Response as Array<IQ_GetPurReceiveStaistic>;
                    txtInvoiceNumber.value = InvoiceStatisticsModel[0].TrNo.toString();
                    ddlTaxTypeHeader.value = InvoiceStatisticsModel[0].VATType.toString();
                    StoreID = InvoiceStatisticsModel[0].StoreID;
                    txtItemCount.value = InvoiceStatisticsModel[0].Line_Count.toString();
                    txtPackageCount.value = "0";
                    txtTotal.value = "0";
                    txtTax.value = "0";
                    txtNet.value = "0";
                    txtInvoiceDate.value = GetDate().toString();
                    vatType = InvoiceStatisticsModel[0].VATType;
                    PurRecType = InvoiceStatisticsModel[0].PurRecType;
                    GetVatPercentage();

                    ddlFreeSalesman.value = InvoiceStatisticsModel[0].SalesmanId.toString();
                    if (InvoiceStatisticsModel[0].VendorID != null) {
                        $('#ddlVendorDetails option[value=' + InvoiceStatisticsModel[0].VendorID + ']').prop('selected', 'selected').change();
                        $('#txt_note').val(InvoiceStatisticsModel[0].Remarks);
                    } else {
                        $('#ddlVendorDetails option[value=Null]').prop('selected', 'selected').change();
                    }
                    if (InvoiceStatisticsModel[0].Status == 1) {
                    chkActive.checked = true;
                    } else { chkActive.checked = false; }
                    if (InvoiceStatisticsModel[0].IsCash == true) {
                        $('#ddlReturnTypeShow').prop("value", 1);
                        $("#DivCashBox1").removeClass("display_none");
                        $("#DivCashBox2").removeClass("display_none");
                        $("#ddlCashBox").prop("value", "");
                        var BoxID = InvoiceStatisticsModel[0].CashBoxID;
                        if (BoxID != 0) {
                            $('#ddlCashBox option[value=' + BoxID + ']').prop('selected', 'selected').change();
                        }
                    } else {
                        $('#ddlReturnTypeShow').prop("value", 0);
                        $("#DivCashBox1").addClass("display_none");
                        $("#DivCashBox2").addClass("display_none");
                        $("#ddlCashBox").prop("value", "");
                        $("#txtCashAmount").prop("value", "");
                    }
                    $('#divCreationPanel').removeClass("display_none");
                    $('#txtCreatedBy').prop("value", SysSession.CurrentEnvironment.UserCode);
                    $('#txtCreatedAt').prop("value", DateTimeFormat(Date().toString()));
                    $('#txtUpdatedBy').prop("value", "");
                    $('#txtUpdatedAt').prop("value", "");
                }
            }
        });
        if (InvoiceStatisticsModel[0].ReceiveID != 0) {
            Ajax.Callsync({
                type: "Get",
                url: sys.apiUrl("PurTrReceive", "GetPurReceiveItems"),
                data: { receiveID: receiveID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
                success: (d) => {
                    let result = d as BaseResponse;
                    if (result.IsSuccess) {
                        SlsInvoiceItemsDetails = result.Response as Array<IQ_GetPurReceiveItem>;
                        var buildedRows: number = 0;

                        SlsInvoiceItemsDetails = SlsInvoiceItemsDetails.filter(x => (x.RecQty - x.TotRetQty ) > 0)

                        CountGrid = 0;
                        for (let i = 0; i < SlsInvoiceItemsDetails.length; i++) {
                           
                            BuildControls(i); 
                            CountGrid++;
                        } 
                        CountItems = CountGrid;
                    }
                }
            });
        }
    }
    function chkActive_onchecked()
    {
        if (FalgOpen == true) {
            if (chkActive.checked == false)
            {
                openReturn();
                chkActive.disabled = true;
                FalgOpen = false;
            }
        }
    }
    function checkUnApprovedReturns(ReceiveID: number) {
        let res = false;
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("PurTrReceive", "GetAllUnApprovedPurReturnListByReceiveD"),
            data: {
                ReceiveID: ReceiveID, CompCode: compcode, BranchCode: BranchCode
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
 //------------------------------------------------------ Buttons Region -----------------------------------
    function btnShow_onclick() {
        ShowFlag = true;
        $("#divMasterGridiv").removeClass("display_none"); 
        BindStatisticGridData();
        $("#MasterDropDowns").removeClass("display_none");
        $("#divGridWithDetail").removeClass("display_none");
        $("#DivShow").removeClass("display_none");
        $("#DivChargesShow").removeClass("display_none");
        ShowFlag = false;
    }
    function btnEdit_onclick() {
        if (!SysSession.CurrentPrivileges.EDIT) return;
        EditFlag = true;
        $("#btnAddReturn").addClass("display_none");
        $("#btnBack").removeClass("display_none");
        $("#btnSave").removeClass("display_none");
        $('#btnUpdate').addClass("display_none");
        $('#btnPrintTransaction').addClass("display_none");
        $("#ddlCashBox").removeAttr("disabled");
        $("#txtCashAmount").removeAttr("disabled");
        $("#divGridDetails_View").addClass("disabledDiv");
        $("#divGridDetails_View").attr("disabled", "disabled").off('click');
        $("#Data_heder").removeClass("disabledDiv");
        chkActive.disabled = !SysSession.CurrentPrivileges.CUSTOM1;
        $("#btnAddDetails").addClass("display_none");

        for (let cnt = 0; cnt <= CountGrid; cnt++) {
            $("#txtReturnQuantity" + cnt).removeAttr("disabled");
            $('.btn-number3' + cnt).removeAttr("disabled");
            $('.input-number3' + cnt).removeAttr("disabled");
            $("#btn_minus" + cnt).addClass("display_none");
            $("#btn_minus" + cnt).removeAttr("disabled");
        }
        $("#DivFilter").attr("disabled", "disabled").off('click');
        $("#DivFilter").addClass("disabledDiv");
        $("#divMasterGridiv").attr("disabled", "disabled").off('click');
        $("#divMasterGridiv").addClass("disabledDiv");
        ddlCashBox.disabled = true;
        txtCashAmount.disabled = true;
        IsNew = false;
    }
    function btnRecieveSearch_onclick() {
        InvoiceFlag = true;
        let sys: SystemTools = new SystemTools();
        sys.FindKey(Modules.PurTrReturn, "btnRecieveSearch", "CompCode=" + compcode + "and BranchCode = " + BranchCode + " and TrType = 0  and Status = 1 ", () => {
            let id = SearchGrid.SearchDataGrid.SelectedKey
            receiveID = id;
            btnAddReturn_onclick();
            $("#ddlVendorDetails").attr("disabled", "disabled");
            $("#ddlReturnTypeShow").attr("disabled", "disabled");
            $("#ddlFreeSalesman").attr("disabled", "disabled");
        });
    }
    function btnSave_onclick() {


        loading('btnsave');

        setTimeout(function () {

            finishSave('btnsave');



        if (IsNew == false) {
            btnRecieveSearch.disabled = true;
            $("#txt_note").attr("disabled", "disabled");
        } else {
            btnRecieveSearch.disabled = false;
           // $("#txt_note").attr("disabled", "disabled");
        }
        if (EditFlag == true) {
            if (!SysSession.CurrentPrivileges.EDIT) return;
            if (!ValidationHeader())
                return;
            Assign();
            if (invoiceItemsModel.length > 0) {
                MasterDetailModel.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
                MasterDetailModel.UserCode = SysSession.CurrentEnvironment.UserCode;
                Update();
             
            }
            else {
                DisplayMassage('( يجب أضافه قيمه للكمية المرتجعه ع الفاتورة)', '(A value must be added to the returned quantity on the invoice)', MessageType.Error);
            }
        }
        else {
            if (!SysSession.CurrentPrivileges.AddNew) return;
            if (!ValidationHeader())
                return;
            Assign();
            if (invoiceItemsModel.length > 0) {
                MasterDetailModel.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
                MasterDetailModel.UserCode = SysSession.CurrentEnvironment.UserCode;
                Insert(); 
            }
            else {
                DisplayMassage('( يجب اختيار الفاتورة وأضافه قيمه للكمية المرتجعه ع الفاتورة)', '(A value must be added to the returned quantity on the invoice)', MessageType.Error);
            }
        }

        }, 100);
    }
    function btnBack_onclick() {
        if (EditFlag == true) {
         
            $("#DivFilter").removeClass("disabledDiv");
            $("#divMasterGridiv").removeClass("disabledDiv"); 
            $('#btnSave').toggleClass("display_none");
            $('#btnBack').toggleClass("display_none");
            $("#btnUpdate").removeClass("display_none");
            $("#btnUpdate").removeAttr("disabled");
            Grid_RowDoubleClicked();
        }
        else {
            $("#btnAddReturn").removeClass("display_none");
            $("#divGridDetails_View").removeClass("disabledDiv");
            $("#Data_heder").removeClass("disabledDiv");
            $("#DivCashBox1").addClass("display_none");
            $("#DivCashBox2").addClass("display_none");
            $("#btnBack").addClass("display_none");
            $("#btnSave").addClass("display_none");
            $("#btnPrint").addClass("display_none");
            $('#btnEdit').addClass("display_none");
            $('#btnPrintTransaction').addClass("display_none");
            btnRecieveSearch.disabled = true;
            receiveID = 0;
            txtInvoiceNumber.value = "";
            lblReturnNumber.value = "";
            clear();
            $("#DivFilter").removeClass("disabledDiv");
            $("#divMasterGridiv").removeClass("disabledDiv");
            $("#rowData").addClass("display_none");
            $("#divTotalSatistics").addClass("display_none");
            $('#btnSave').toggleClass("display_none");
            $('#btnBack').toggleClass("display_none");
            $("#btnUpdate").removeClass("display_none");
            $("#btnUpdate").removeAttr("disabled");
        }
    }
    function AddNewReturn_onclick() {
        if (!SysSession.CurrentPrivileges.AddNew) return;
        EditFlag = false;
        btnBack_onclick();
        $("#divGridDetails_View").addClass("disabledDiv");
        $("#divGridDetails_View").attr("disabled", "disabled").off('click');
        $("#divShow").removeClass("display_none");
        $("#btnAddReturn").addClass("display_none");
        btnRecieveSearch.disabled = false;
        $("#divReturnDetails").removeClass("display_none");
        $("#btnBack").removeClass("display_none");
        $("#btnSave").removeClass("display_none");
        $("#btnEdit").addClass("display_none");
        $("#btnPrintTransaction").addClass("display_none");
        $("#btnPrint").addClass("display_none");
        $('#div_Data').html("");
        txtItemCount.value = "";
        txtPackageCount.value = "";
        txtTotal.value = "";
        txtTax.value = "";
        txtNet.value = "";
        txtInvoiceNumber.value = "";
        lblReturnNumber.value = "";
        txtInvoiceDate.value = "";
        ddlFreeSalesman.value = "null";
        txtCashAmount.value = "";
        $("#txt_note").prop("value", "");
        $('#txtUpdatedBy').prop("value", "");
        $('#txtUpdatedAt').prop("value", "");
        $("#btnAddDetails").attr("disabled", "disabled");
        $("#btnAddDetails").addClass("display_none");
        chkActive.checked = false;
        txtInvoiceDate.value = GetDate();
        $("#txt_note").removeAttr("disabled");
        $("#ddlCashBox").removeAttr("disabled");
        $("#txtCashAmount").removeAttr("disabled");
        fillddlCashBox();
        $("#rowData").removeClass("display_none");
        $("#divTotalSatistics").removeClass("display_none");
        $("#DivFilter").attr("disabled", "disabled").off('click');
        $("#DivFilter").addClass("disabledDiv");
        $("#divMasterGridiv").attr("disabled", "disabled").off('click');
        $("#divMasterGridiv").addClass("disabledDiv");
        $("#btnUpdate").addClass("display_none");
        $("#txtCreatedAt").prop("value", DateTimeFormat(Date().toString()));
        $("#txtCreatedBy").prop("value", SysSession.CurrentEnvironment.UserCode);
        IsNew = true;
    }
    function btnAddReturn_onclick() {
        txtInvoiceDate.value = GetDate();
        var unApprovedReturn: boolean = false;
        lblReturnNumber.value = "";

        unApprovedReturn = checkUnApprovedReturns(receiveID);
        if (unApprovedReturn == true) {
            DisplayMassage('( لا يمكن اضافه مرتجع علي الفاتورة قبل اعتماد المرتجعات السابقه)', '(A return cannot be added to the invoice before previous returns are approved)', MessageType.Error);
            btnRecieveSearch.disabled = false;

        } else {
            txtInvoiceNumber_onchange();
            Show = false;
            $("#btnAddReturn").addClass("display_none");
            $("#btnBack").removeClass("display_none");
            $("#btnSave").removeClass("display_none");
            $("#btnPrint").addClass("display_none");
            $('#btnEdit').addClass("display_none");

            var items: number = Number(txtItemCount.value);
            for (let i = 0; i < items; i++) {
                $("#txtReturnQuantity" + i).removeAttr("disabled");

                $('.btn-number3' + i).removeAttr("disabled");
                $('.input-number3' + i).removeAttr("disabled");
            }
            $("#txtInvoiceDate").removeAttr("disabled");
            $("#btnAddDetails").addClass("display_none");
            $("#txt_note").removeAttr("disabled");

        }
    } 
    //------------------------------------------------------ Normal Grid Region -----------------------------------
    function InitializeGrid() {        
        ////debugger
        let res: any = GetResourceList("");
        divMasterGrid.ElementName = "divMasterGrid";
        divMasterGrid.PrimaryKey = "ReceiveID";
        divMasterGrid.Paging = true;
        divMasterGrid.PageSize = 10;
        divMasterGrid.Sorting = true;
        divMasterGrid.InsertionMode = JsGridInsertionMode.Binding;
        divMasterGrid.Editing = false;
        divMasterGrid.Inserting = false;
        divMasterGrid.SelectedIndex = 1;
        divMasterGrid.OnRowDoubleClicked = Grid_RowDoubleClicked;
        divMasterGrid.Columns = [
            { title: "ID", name: "ReceiveID", type: "text", width: "2%", visible: false },
            { title: res.App_ReturnNum, name: "TrNo", type: "text", width: "10%" },
            {
                title: res.App_date, css: "ColumPadding", name: "TrDate", width: "20%",
                itemTemplate: (s: string, item: IQ_GetPurReceiveStaistic): HTMLLabelElement => {
                    let txt: HTMLLabelElement = document.createElement("label");
                    txt.innerHTML = DateFormat(item.TrDate);
                    return txt;
                }
            },
            { title: res.I_Vendor, name: (lang == "ar" ? "Vnd_NameA" :"Vnd_NameE"), type: "text", width: "25%" },
            { title: res.App_Salesman, name: (lang == "ar" ? "Slsm_DescA" : "Slsm_DescE"), type: "text", width: "25%" },
            { title: res.Men_StkDefItems, name: "Line_Count", type: "text", width: "10%" },
            { title: res.App_Package, name: "Tot_Qty", type: "text", width: "10%" },
            { title: res.I_Total, name: "Total", type: "text", width: "12%" },
            { title: res.App_Tax, name: "VatAmount", type: "text", width: "12%" },
            { title: res.App_Net, name: "NetDue", type: "text", width: "12%" },
            {
                title: res.App_Certified, css: "ColumPadding", name: "statusDesciption", width: "17%",
                itemTemplate: (s: string, item: IQ_GetPurReceiveStaistic): HTMLLabelElement => {
                    let txt: HTMLLabelElement = document.createElement("label");
                    txt.innerHTML = item.Status == 1 ? (lang == "ar" ? "معتمد" : "A certified") : (lang == "ar" ? "غير معتمد" : "Not supported");;
                    return txt;
                }
            },
        ]; 
    }
    function BindStatisticGridData() {
        var startdt = DateFormatRep(txtFromDate.value).toString();
        var enddt = DateFormatRep(txtToDate.value).toString();
        var salesmanId = 0;
        var vendorId = 0;
        var status = 0; 
        if (ddlVendorMaster.value != "null") { vendorId = Number(ddlVendorMaster.value.toString());  }
        if (ddlSalesmanMaster.value != "null") { salesmanId = Number(ddlSalesmanMaster.value.toString());  } 
        status = Number(ddlStateType.value.toString());
        isCash = Number(ddlReturnType.value); 
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("PurTrReceive", "GetAllReturnPurReceiveStaistic"),
            data: { CompCode: compcode, BranchCode: BranchCode, startDate: startdt, endDate: enddt, trtype: TrType, Status: status, isCash: isCash, VendorId: vendorId, SalesmanId: salesmanId, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    GetPurReceiveStaisticData = result.Response as Array<IQ_GetPurReceiveStaistic>; 
                    //for (var i = 0; i < GetPurReceiveStaisticData.length; i++) {
                    //    GetPurReceiveStaisticData[i].TrDate = DateFormat(GetPurReceiveStaisticData[i].TrDate);
                    //    if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
                    //      //  GetPurReceiveStaisticData[i].Vendor_Name = GetPurReceiveStaisticData[i].Vnd_NameA;
                    //        GetPurReceiveStaisticData[i].StatusDesc = GetPurReceiveStaisticData[i].Status == 0 ? "غير معتمد" : "معتمد"; }
                    //    else {
                    //      //  GetPurReceiveStaisticData[i].Vendor_Name = GetPurReceiveStaisticData[i].Vnd_NameE;
                    //        GetPurReceiveStaisticData[i].StatusDesc = GetPurReceiveStaisticData[i].Status == 0 ? "Non Certified" : "Certified"; }
                    //}
                    divMasterGrid.DataSource = GetPurReceiveStaisticData;
                    divMasterGrid.Bind();
                }
            }
        });
    }
    function Grid_RowDoubleClicked() {
        CountGrid = 0;
        Show = true;
        InvoiceFlag = false;
        $("#divReturnDetails").removeClass("display_none");
        $("#btnBack").addClass("display_none");
        $("#btnSave").addClass("display_none");
        $("#btnEdit").removeClass("display_none");
        $("#btnPrintTransaction").removeClass("display_none");
        clear();
        $("#ddlCashBox").prop("value", "null");
        $("#txtCashAmount").prop("value", "");
        let Selecteditem = GetPurReceiveStaisticData.filter(x => x.ReceiveID == Number(divMasterGrid.SelectedKey));
        receiveID = Number(Selecteditem[0].ReceiveID);
        InvoiceStatisticsModel = Selecteditem;
        if (InvoiceStatisticsModel.length > 0) {

            txtInvoiceNumber.value = InvoiceStatisticsModel[0].TrNo.toString();
            ddlTaxTypeHeader.value = InvoiceStatisticsModel[0].VATType.toString();
            txtItemCount.value = InvoiceStatisticsModel[0].Line_Count.toString();
            txtPackageCount.value = InvoiceStatisticsModel[0].Tot_Qty.toString();
            txtTotal.value = InvoiceStatisticsModel[0].Total.toString();
            StoreID = InvoiceStatisticsModel[0].StoreID;
            if (InvoiceStatisticsModel[0].VatAmount != null) { txtTax.value = InvoiceStatisticsModel[0].VatAmount.toString(); }
            else { txtTax.value = '0'; }
            if (InvoiceStatisticsModel[0].NetDue != null) { txtNet.value = InvoiceStatisticsModel[0].NetDue.toString(); }
            else { txtNet.value = '0'; }
            vatType = InvoiceStatisticsModel[0].VATType;
            PurRecType = InvoiceStatisticsModel[0].PurRecType;
            if (InvoiceStatisticsModel[0].RefTrID != null) {
                txtInvoiceNumber.value = InvoiceStatisticsModel[0].RefTrID.toString();
                RefTrID = InvoiceStatisticsModel[0].RefTrID.toString();
                GetPurReceiveCharge(InvoiceStatisticsModel[0].RefTrID);
            }
          
            var ReturnNum = InvoiceStatisticsModel[0].TrNo.toString();
            lblReturnNumber.value = ReturnNum;
            txtInvoiceDate.value = DateFormat(InvoiceStatisticsModel[0].TrDate.toString());
            if (InvoiceStatisticsModel[0].VendorID != null) {
                $('#ddlVendorDetails option[value=' + InvoiceStatisticsModel[0].VendorID + ']').prop('selected', 'selected').change();
                $('#txt_note').val(InvoiceStatisticsModel[0].Remarks);
            } else { $('#ddlVendorDetails option[value=Null]').prop('selected', 'selected').change(); }
            if (InvoiceStatisticsModel[0].IsCash == true) {
                $('#ddlReturnTypeShow').prop("value", "1");
                $("#DivCashBox1").removeClass("display_none");
                $("#DivCashBox2").removeClass("display_none");
                $("#rowData").removeClass("display_none");
                $("#divTotalSatistics").removeClass("display_none");
                if (InvoiceStatisticsModel[0].CashBoxID != null && InvoiceStatisticsModel[0].CashBoxID != 0) {
                    var BoxID = InvoiceStatisticsModel[0].CashBoxID.toString();
                    var cashAmount = InvoiceStatisticsModel[0].CashPaidAmount;
                    $('#ddlCashBox option[value=' + BoxID + ']').prop('selected', 'selected').change();
                    $("#txtCashAmount").prop("value", cashAmount);
                }
            } else {
                $("#DivCashBox1").addClass("display_none");
                $("#DivCashBox2").addClass("display_none");
                $("#rowData").addClass("display_none");
                $("#divTotalSatistics").addClass("display_none");
                $('#ddlReturnTypeShow').prop("value", "0");
            }
            $('#ddlFreeSalesman').prop("value", InvoiceStatisticsModel[0].SalesmanId.toString());
            $('#btnUpdate').removeClass("display_none");
            $('#btnsave').addClass("display_none");
            $('#btnback').addClass("display_none");
            if (InvoiceStatisticsModel[0].Status == 1) {
                chkActive.checked = true;
                btnEdit.disabled = true;
                FalgOpen = true;
                chkActive.disabled = !SysSession.CurrentPrivileges.CUSTOM2;
            } else {
                chkActive.checked = false;
                chkActive.disabled = true;
                btnEdit.disabled = !SysSession.CurrentPrivileges.EDIT;
            }
            $('#divCreationPanel').removeClass("display_none");
            $('#txtCreatedBy').prop("value", InvoiceStatisticsModel[0].CreatedBy);
            $('#txtCreatedAt').prop("value", InvoiceStatisticsModel[0].CreatedAt);
            $('#txtUpdatedBy').prop("value", InvoiceStatisticsModel[0].UpdatedBy);
            $('#txtUpdatedAt').prop("value", InvoiceStatisticsModel[0].UpdatedAt);

        }
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("PurTrReceive", "GetPurReceiveItems"),
            data: { receiveID: receiveID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    SlsInvoiceItemsDetails = result.Response as Array<IQ_GetPurReceiveItem>;
                    CountGrid = 0; 
                    for (let i = 0; i < SlsInvoiceItemsDetails.length; i++) {
                        BuildControls(i);
                        CountGrid++;
                    }
                    
                    CountItems = CountGrid;

                    //SlsInvoiceItemsDetails[0].ItemID;
                }
            }
        });
        $("#rowData").removeClass("display_none");
        $("#divTotalSatistics").removeClass("display_none");
        ComputeTotals();

    }

     //---------------------------------------------- get   functions ----------------------------------------
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
    function GetPurReceiveCharge(ReceiD: number) {
        ////debugger
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("PurTrReceive", "GetPurReceiveByIDFromStatistics"),
            data: { receiveID: ReceiD, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess == true) {
                    ////debugger
                    PurReceiveStaistic = result.Response as IQ_GetPurReceiveStaistic;
                    txtInvoiceNumber.value = PurReceiveStaistic[0].TrNo;
                }
            }
        });
    }
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
    function GetVatPercentage() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GenVatType", "GetVatPercentage"),
            data: {
                CompCode: compcode, VatType: vatType, Type: 2, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
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
 //------------------------------------------------------ Controls Grid Region -----------------------------------
    function BuildControls(cnt: number) {
        var html;
        html = `<tr id="No_Row${cnt}">
 
                    <input id="InvoiceItemID${cnt}" type="hidden" class="display_none"  />
                    <input id="ReciveDetailsID${cnt}" type="hidden" class="display_none"  />

                    <td>
		                <div class="form-group">
			                <input id="txtSerialH${cnt}" type="text" class="form-control" disabled />
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
			                <input type="text" class="form-control" id="txtTotal${cnt}" disabled />
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
        //html = '<div id= "No_Row' + cnt + '" class="container-fluid style_border" > <div class="row" > <div class="col-xs-12" style="right: 3%;" > ' +
        //    '<span id="btn_minus' + cnt + '" class="fa fa-minus-circle fontitm3 display_none"></span>' +
        //    '<input id="ReciveDetailsID' + cnt + '" type="hidden" class="form-control right2 display_none"  />' +

        //    '<div class="col-lg-1  col-md-1 col-sm-1 col-xs-12" style="width: 4%;margin-right: -4%;">' +
        //    '<input id="txtSerial' + cnt + '" type="text" class="form-control input-sm right2" disabled /></div>' +

        //    '<div class="col-xs-2 p-0">' +
        //    '<select id="ddlFamily' + cnt + '" class="form-control"><option>النوع</option></select></div>' +
        //    '<div class="col-xs-3 p-0">' +
        //    '<select id="ddlItem' + cnt + '" class="form-control"><option>الصنف</option></select></div>' +
        //    '<div class=" col-xs-1 p-0">  <input type="text" class="form-control"    disabled id="txtQuantity' + cnt + '" name="quant[1]" class="form-control " value="0" min="0" max="1000" ></div>' +
        //    '<div class=" col-xs-1 p-0" style="width: 9.666667%;"><div class="input-group " ><span class="input-group-btn"><button type="button" style="background-color: #4CAF50; "   class="btnplasandmines btn-default btn-number3' + cnt + '"  id="btnminus1" data-type="minus" data-field="quant[3]"><span class="glyphicon glyphicon-minus"></span></button></span><input type="number" min="1"   style="height:36px;" id="txtReturnQuantity' + cnt + '" name="quant[3]" class="form-control   font1" value="1" min="0" max="1000" step="1"><span class="input-group-btn"><button type="button" style="background-color: #f44336;" id="btnplus3"   class="btnplasandmines btn-default btn-number3' + cnt + '" data-type="plus" data-field="quant[3]"><span class="glyphicon glyphicon-plus"></span></button></span></div></div>' +
        //    '<div class=" col-xs-2 p-0" style="width: 12.666667%;"><div class="input-group " ><span class="input-group-btn"><button type="button" style="background-color: #4CAF50; "   class="btnplasandmines btn-default btn-number2' + cnt + '"  id="btnminus2" data-type="minus" data-field="quant[2]"><span class="glyphicon glyphicon-minus"></span></button></span><input type="text" min="0"   style="height:36px;" disabled id="txtPrice' + cnt + '" name="quant[2]" class="form-control   font1" value="1" min="0" max="1000" step="0.5"><span class="input-group-btn"><button type="button" style="background-color: #f44336;" id="btnplus2' + cnt + '"   class="btnplasandmines btn-default btn-number2' + cnt + '" data-type="plus" data-field="quant[2]"><span class="glyphicon glyphicon-plus"></span></button></span></div></div>' +
        //    '<div class="col-xs-1 p-0">' +
        //    '<input id="txtTotal' + cnt + '" type="text" class="form-control right2" disabled /></div>' +
        //    '<div class="col-xs-1 p-0">' +
        //    '<input id="txtTax' + cnt + '" type="text" class="form-control right2" disabled /></div>' +
        //    '<div class="col-xs-1 p-0">' +
        //    '<input id="txtTotAfterTax' + cnt + '" type="text" class="form-control right2" disabled /></div>' +
        //    '</div></div></div>' +
        //    '<input id="txt_StatusFlag' + cnt + '" name = " " type = "hidden" class="form-control"/><input id="txt_ID' + cnt + '" name = " " type = "hidden" class="form-control" />';
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
            //FillddlItem(Number(selectedFamily), $("#ddlStore").val());
            $('#ddlItem' + cnt).empty();
            $('#ddlItem' + cnt).append('<option value="' + null + '">' + "اختر الصنف" + '</option>');
            for (var i = 0; i < ItemDetails.length; i++) {
                $('#ddlItem' + cnt).append('<option value="' + ItemDetails[i].ItemID + '">' + (lang == "ar" ? ItemDetails[i].Itm_DescA  : ItemDetails[i].Itm_DescE) + '</option>');
            }
            ComputeTotals();
        }); 
        var dropddlItem = '#ddlItem' + cnt;
        $(dropddlItem).change(function () {
            if ($('#ddlItem' + cnt).val() == "null") {
                // $("#txtQuantity" + cnt).val("1");
                $("#txtReturnQuantity" + cnt).val("1");
                $("#txtPrice" + cnt).val("1");
                $("#txtTotal" + cnt).val("0");
                $("#txtTax" + cnt).val("0");
                $("#txtTotAfterTax" + cnt).val("0");
            } else {

                var selectedItem = $(dropddlItem + ' option:selected').attr('value');
                var selectedFamily = $(drop + ' option:selected').attr('value');
                //
                var itemID = Number(selectedItem);
                var FamilyID = Number(selectedFamily);
                var NumberSelect = ItemDetails.filter(s => s.ItemID == itemID);

                var res = false;
                var NumberRowid = $("#InvoiceItemID" + cnt).val();
                res = checkRepeatedItems(itemID, FamilyID, NumberRowid);
                if (res == true) {
                    $("#ddlItem" + cnt).val("null");
                    $("#txtPrice" + cnt).val("1");
                    DisplayMassage('( لايمكن تكرار نفس الاصناف علي الفاتورة )', '(The same items cannot be duplicated on the invoice)', MessageType.Error);
                } else {
                    var NumberSelect = ItemDetails.filter(s => s.ItemID == itemID);
                    var itemPrice = NumberSelect[0].UnitPrice;
                    $("#txtPrice" + cnt).val(itemPrice);
                    //
                    var txtQuantityValue = $("#txtReturnQuantity" + cnt).val();
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
            }
            ComputeTotals();
        }); 
        // text change 
        $("#txtQuantity" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");

            var txtQuantityValue = $("#txtReturnQuantity" + cnt).val();
            var txtPriceValue = $("#txtPrice" + cnt).val();
            if ($("#txtPrice" + cnt).val() == 0) {
                var total = Number(txtQuantityValue) * 1;
                $("#txtTotal" + cnt).val(total.RoundToSt(2));
                var vatAmount = Number(total) * VatPrc / 100;
                $("#txtTax" + cnt).val(vatAmount.RoundToSt(2));
                var totalAfterVat = Number(vatAmount) + Number(total);
                $("#txtTotAfterTax" + cnt).val(totalAfterVat.RoundToSt(2));
                ComputeTotals();
            } else {
                var total = Number(txtQuantityValue) * Number(txtPriceValue);
                $("#txtTotal" + cnt).val(total.RoundToSt(2));//= total;
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
                //txtTotal.value = (CountTotal + total).RoundToSt(2).toString();
                //CountTotal = Number((CountTotal + total).RoundToSt(2).toString());

                ////txtNet.value = (NetCount + totalAfterVat).RoundToSt(2).toString();
                ////NetCount = Number((NetCount + totalAfterVat).RoundToSt(2).toString());

                //txtTax.value = (TaxCount + vatAmount).RoundToSt(2).toString();
                //TaxCount = Number((TaxCount + vatAmount).RoundToSt(2).toString());

            } else {
                var total = 1 * Number(txtPriceValue);
                var vatAmount = Number(total) * VatPrc / 100;
                $("#txtTax" + cnt).val(vatAmount.RoundToSt(2));
                var total = Number(txtQuantityValue) * Number(txtPriceValue);
                $("#txtTotal" + cnt).val(total.RoundToSt(2));

                var totalAfterVat = Number(vatAmount) + Number(total);
                $("#txtTotAfterTax" + cnt).val(totalAfterVat.RoundToSt(2));

                ComputeTotals();
            }
        });
        //txtReturnQuantity
        $("#txtReturnQuantity" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");

            var txtQuantityValue = $("#txtQuantity" + cnt).val();

            var totalReturnQuantityValue = $("#txtReturnQuantity" + cnt).val();
            var txtPriceValue = $("#txtPrice" + cnt).val();

            if (Number(txtQuantityValue) >= totalReturnQuantityValue) {   // qty accepted  
                var total = Number(totalReturnQuantityValue) * Number(txtPriceValue);
                $("#txtTotal" + cnt).val(total.RoundToSt(2));//= total;
                var vatAmount = Number(total) * VatPrc / 100;
                $("#txtTax" + cnt).val(vatAmount.RoundToSt(2));
                var totalAfterVat = Number(vatAmount) + Number(total);
                $("#txtTotAfterTax" + cnt).val(totalAfterVat.RoundToSt(2)); 
                ComputeTotals();

            }
            else {

                $("#txtReturnQuantity" + cnt).val(txtQuantityValue);
                var total = Number(txtQuantityValue) * Number(txtPriceValue);
                $("#txtTotal" + cnt).val(total.RoundToSt(2));//= total;
                var vatAmount = Number(total) * VatPrc / 100;
                $("#txtTax" + cnt).val(vatAmount.RoundToSt(2));
                var totalAfterVat = Number(vatAmount) + Number(total);
                $("#txtTotAfterTax" + cnt).val(totalAfterVat.RoundToSt(2));
                ComputeTotals();
                DisplayMassage('(  الكميه المتاحه من الشراء = ' + txtQuantityValue + ')', 'Avaliable Quantity From Purchase', MessageType.Error); 
            }
        });
        //
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
            $("#btnAddDetails").addClass("display_none");
            $("#btn_minus" + cnt).addClass("display_none");
            $("#btn_minus" + cnt).attr("disabled", "disabled");
            $("#txt_StatusFlag" + cnt).val("u");
            for (var i = 0; i < FamilyDetails.length; i++) {
                $('#ddlFamily' + cnt).append('<option value="' + FamilyDetails[i].ItemFamilyID + '">' + FamilyDetails[i].DescA + '</option>');
            }
            var FamilyID: number = Number(SlsInvoiceItemsDetails[cnt].ItemFamilyID);
            $("#ddlFamily" + cnt).prop("value", FamilyID);
            FillddlItem(FamilyID, InvoiceStatisticsModel[0].StoreID);
            for (var i = 0; i < ItemDetails.length; i++) {
                $('#ddlItem' + cnt).append('<option value="' + ItemDetails[i].ItemID + '">' + ItemDetails[i].Itm_DescA + '</option>');
            }
            debugger
            var itemcode = SlsInvoiceItemsDetails[cnt].ItemID;
            $("#ddlItem" + cnt).prop("value", itemcode.toString());
            $("#txtQuantity" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].ReceiveRecQty);
            $("#txtQuantity" + cnt).attr("data-ReceiveRecQty", SlsInvoiceItemsDetails[cnt].ReceiveRecQty);
            var price = SlsInvoiceItemsDetails[cnt].RecUnitPrice;
            $("#txtPrice" + cnt).prop("value", price);
            $("#txtReturnQuantity" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].RecQty);
            $("#txtReturnQuantity" + cnt).attr("data-RecQty", SlsInvoiceItemsDetails[cnt].RecQty);
            var itemTotal = SlsInvoiceItemsDetails[cnt].RecQty * Number(price);
            $("#txtTotal" + cnt).prop("value", itemTotal);
            var tax = SlsInvoiceItemsDetails[cnt].VatAmount;
            $("#txtTax" + cnt).prop("value", tax);
            var Net = itemTotal + tax;
            $("#txtTotAfterTax" + cnt).prop("value", Net);
            var ReciveDetailsIDVal = SlsInvoiceItemsDetails[cnt].ReciveDetailsID;
            $("#ReciveDetailsID" + cnt).prop("value", ReciveDetailsIDVal);
            $("#txtSerialH" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].Serial);
        }
        $("#btn_minus" + cnt).click(function (e) {
            //  alert("hi");
            DeleteRow(cnt);
        });
        if (InvoiceFlag == true) {
            debugger 
            $("#txt_StatusFlag" + cnt).val("i");
            let InvoiceSoldQty = SlsInvoiceItemsDetails[cnt].RecQty - SlsInvoiceItemsDetails[cnt].TotRetQty;
            let total = InvoiceSoldQty * SlsInvoiceItemsDetails[cnt].RecUnitPriceFC;
            let vat = total * SlsInvoiceItemsDetails[cnt].VatPrc / 100;
            $("#txtSerialH" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].Serial);
            $("#txtReturnQuantity" + cnt).prop("value", InvoiceSoldQty);
            $("#txtQuantity" + cnt).prop("value", InvoiceSoldQty);
            $("#txtTotal" + cnt).prop("value", total.RoundToSt(2));
            $("#txtTax" + cnt).prop("value", vat.RoundToSt(2));
            $("#txtTotAfterTax" + cnt).prop("value", (vat + total).RoundToSt(2));
            $("#InvoiceItemID" + cnt).prop("value", 0);
            $("#txtReturnQuantity" + cnt).removeAttr("disabled");
 
            ComputeTotals();
        }

        return;
    }
    function DeleteRow(RecNo: number) {
        if (!SysSession.CurrentPrivileges.Remove) return;
        WorningMessage("هل تريد الحذف؟", "Do you want to delete?", "تحذير", "worning", () => {
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
        });
    }
    function ComputeTotals() {
        debugger
        PackageCount = 0;
        CountTotal = 0;
        TaxCount = 0;
        NetCount = 0; 
        for (let i = 0; i < CountGrid; i++) {  
            var flagvalue = $("#txt_StatusFlag" + i).val();
            if (flagvalue != "d" && flagvalue != "m" ) { 
                var ReturnQty = Number($("#txtReturnQuantity" + i).val());
                PackageCount += ReturnQty; 
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
      //------------------------------------------------------ Clear && Search && Enable && Disabled Region -----------------------------------
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
        ddlFreeSalesman.value = "null"; 
        $("#txt_note").prop("value", "");
        $("#txt_note").attr("disabled", "disabled"); 
        ddlFreeSalesman.disabled = true; 
        $('#txtCreatedBy').prop("value", "");
        $('#txtCreatedAt').prop("value", ""); 
        $('#txtUpdatedBy').prop("value", "");
        $('#txtUpdatedAt').prop("value", ""); 
        $("#txtInvoiceDate").attr("disabled", "disabled"); 
        $("#ddlVendorDetails").attr("disabled", "disabled");
        $("#ddlReturnTypeShow").attr("disabled", "disabled");
        $("#ddlFreeSalesman").attr("disabled", "disabled"); 
        $("#ddlVendorDetails").prop("value", "null");
        $("#ddlCashBox").attr("disabled", "disabled");
        $("#txtCashAmount").attr("disabled", "disabled"); 
        $("#ddlCashBox").prop("value", "null");
        $("#ddlCashBox").prop("value", "null");
        $("#ddlTaxTypeHeader").prop("value", "null"); 
        $("#btnAddDetails").attr("disabled", "disabled");
        $("#btnAddDetails").addClass("display_none");
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
            $("#btn_minus" + cnt).addClass("display_none");
            $("#btn_minus" + cnt).attr("disabled", "disabled"); 
        }
        txtInvoiceDate.value = GetDate();
    }
    function ValidationHeader() {

        if (!CheckDate(DateFormat(txtInvoiceDate.value).toString(), DateFormat(SysSession.CurrentEnvironment.StartDate).toString(), DateFormat(SysSession.CurrentEnvironment.EndDate).toString())) {
         DisplayMassage('  التاريخ ليس متطابق مع تاريخ السنه (' + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ')', '  Date is incorrect (' + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ')', MessageType.Error);
            Errorinput(txtInvoiceDate);
            return
        }
        else if (ddlReturnTypeShow.value == "1" && txtCashAmount.value != "" && (ddlCashBox.value == "null" || ddlCashBox.value == "")) {
            DisplayMassage("برجاء اختيار الصندوق", "please select cashbox", MessageType.Error);
            Errorinput(ddlCashBox);
            return false
        }
        else if (txtCashAmount.value != "" && (Number(txtCashAmount.value).RoundToSt(2) != Number(txtNet.value).RoundToSt(2))) {
            DisplayMassage("يجب ان يتساوي المبلغ المسدد مع الصافي", "The amount paid must be equal to the net amount", MessageType.Error);
            Errorinput(txtCashAmount);
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
    function _SearchBox_Change() {
        if (searchbutmemreport.value != "") {
            let search: string = searchbutmemreport.value.toLowerCase();
            SearchGetPurReceiveStaisticData = GetPurReceiveStaisticData.filter(x => x.TrNo.toString().search(search) >= 0
                || x.Vnd_NameA.toLowerCase().search(search) >= 0 || x.Vnd_NameE.toLowerCase().search(search) >= 0
                || x.Slsm_DescA.toLowerCase().search(search) >= 0 || x.Slsm_DescE.toLowerCase().search(search) >= 0);
            divMasterGrid.DataSource = SearchGetPurReceiveStaisticData;
            divMasterGrid.Bind();
        } else { divMasterGrid.DataSource = GetPurReceiveStaisticData; divMasterGrid.Bind(); }
    }
  //--------------------------------------------------- Main Functions-----------------------------------------------
    function Assign() {
        var StatusFlag: String;
        MasterDetailModel = new PurReceiveMasterDetails();
        if (ddlReturnTypeShow.value == "0") {
            InvoiceModel.IsCash = false;
            InvoiceModel.VendorID = $("#ddlVendorDetails").val();
        }
        else {
            InvoiceModel.IsCash = true;
            InvoiceModel.CashPaidAmount = 0;
            if ($("#txtCashAmount").val() == null) {
                $("#txtCashAmount").val(0);
                InvoiceModel.VatAmount = 0;
                InvoiceModel.CashPaidAmount = 0;
                InvoiceModel.CashBoxID = Number(ddlCashBox.value);
            } else {
                InvoiceModel.VatAmount = $("#txtCashAmount").val();
                InvoiceModel.CashPaidAmount = $("#txtCashAmount").val();
                InvoiceModel.CashBoxID = Number(ddlCashBox.value);
            }
        }

        InvoiceModel.CompCode = Number(compcode);
        InvoiceModel.BranchCode = Number(BranchCode);
        InvoiceModel.Remarks = $("#txt_note").val();
        InvoiceModel.TrType = TrType//0 invoice 1 return 
        InvoiceModel.VendorID = $("#ddlVendorDetails").val();
        InvoiceModel.StoreID = StoreID;
        InvoiceModel.SalesmanId = Number(ddlFreeSalesman.value);
        InvoiceModel.TrDate = txtInvoiceDate.value;
        InvoiceModel.NetDue = NetCount;
        InvoiceModel.VATType = vatType;
        InvoiceModel.PurRecType = PurRecType;
        InvoiceModel.Total = Number(txtTotal.value);
        InvoiceModel.VatAmount = Number(txtTax.value);
        InvoiceModel.NetAdditionVat = Number(txtNet.value);

        if (chkActive.checked == true) {
            InvoiceModel.Status = 1;
        } else {
            InvoiceModel.Status = 0;
        }
        invoiceItemsModel = new Array<I_Pur_TR_ReceiveItems>();
        for (var i = 0; i < CountGrid; i++) {
            invoiceItemSingleModel = new I_Pur_TR_ReceiveItems();
            StatusFlag = $("#txt_StatusFlag" + i).val();
            invoiceItemSingleModel.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
            invoiceItemSingleModel.UserCode = SysSession.CurrentEnvironment.UserCode;
            invoiceItemSingleModel.VatPrc = VatPrc;
            var Qty: number = Number($('#txtReturnQuantity' + i).val());

            if (StatusFlag == "i") { 
                invoiceItemSingleModel.ReceiveID = 0;
                invoiceItemSingleModel.ReciveDetailsID = Number($("#ReciveDetailsID" + i).val());
                invoiceItemSingleModel.ItemID = Number($("#ddlItem" + i).val());
                invoiceItemSingleModel.Serial = Number($("#txtSerialH" + i).val());

               
                invoiceItemSingleModel.RecQty = Number($('#txtReturnQuantity' + i).val());
                invoiceItemSingleModel.ReceiveRecQty = Number($('#txtQuantity' + i).val());
                invoiceItemSingleModel.RecStockQty = Number($('#txtReturnQuantity' + i).val());
                 
                invoiceItemSingleModel.RecUnitPrice = $("#txtPrice" + i).val();
                var ItemTotal = invoiceItemSingleModel.RecUnitPrice * invoiceItemSingleModel.RecQty;
                invoiceItemSingleModel.VatAmount = (ItemTotal * VatPrc) / 100;
                invoiceItemSingleModel.StatusFlag = StatusFlag.toString();
                if (Qty != 0) {
                    invoiceItemsModel.push(invoiceItemSingleModel);
                }
            }
            if (StatusFlag == "u") {

                invoiceItemSingleModel.Serial = Number($("#txtSerialH" + i).val()); 
                invoiceItemSingleModel.ReciveDetailsID = $("#ReciveDetailsID" + i).val();
                invoiceItemSingleModel.RecQty = Number($('#txtReturnQuantity' + i).val());
                invoiceItemSingleModel.ItemID = Number($("#ddlItem" + i).val());
                
                invoiceItemSingleModel.RecQty = Number($('#txtReturnQuantity' + i).val());
                invoiceItemSingleModel.ReceiveRecQty = Number($('#txtQuantity' + i).val());
                invoiceItemSingleModel.RecStockQty = Number($('#txtReturnQuantity' + i).val());

                invoiceItemSingleModel.RecUnitPrice = $("#txtPrice" + i).val();
                var ItemTotal = invoiceItemSingleModel.RecUnitPrice * invoiceItemSingleModel.RecQty;
                invoiceItemSingleModel.VatAmount = (ItemTotal * VatPrc) / 100;
                invoiceItemSingleModel.StatusFlag = StatusFlag.toString();
                if (Qty != 0) {
                    invoiceItemsModel.push(invoiceItemSingleModel);
                }
            }
            if (StatusFlag == "d") {
                if (EditFlag == true) {
                    if ($("#InvoiceItemID" + i).val() != "") {
                        invoiceItemSingleModel.Serial = Number($("#txtSerialH" + i).val());
                        var deletedID = $("#InvoiceItemID" + i).val();
                        invoiceItemSingleModel.ReciveDetailsID = Number($("#ReciveDetailsID" + i).val());
                        invoiceItemSingleModel.StatusFlag = StatusFlag.toString();
                        invoiceItemSingleModel.ReceiveID = deletedID;
                        invoiceItemsModel.push(invoiceItemSingleModel);
                    }
                }
            }

        }
        InvoiceModel.TrNo = Number(lblReturnNumber.value); 
        MasterDetailModel.I_Pur_TR_Receive = InvoiceModel;
        MasterDetailModel.I_Pur_TR_ReceiveItems = invoiceItemsModel;
        MasterDetailModel.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
        MasterDetailModel.UserCode = SysSession.CurrentEnvironment.UserCode;
    }
    function Insert() {

        InvoiceModel.CreatedBy = SysSession.CurrentEnvironment.UserCode;
        InvoiceModel.CreatedAt = DateTimeFormat(Date().toString()); 

        if (txtInvoiceNumber.value.toString() == "") { InvoiceModel.RefTrID = null; }
        else { InvoiceModel.RefTrID = receiveID; }

        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("PurTrReceive", "InsertReturnPurchaseReceiveMasterDetail"),
            data: JSON.stringify(MasterDetailModel),
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess == true) {
                    let res = result.Response as IQ_GetPurReceiveStaistic;
                    DateSetsSccess("txtInvoiceDate", "txtFromDate", "txtToDate");
                    DisplayMassage("تم اصدار  مرتجع رقم " + res.TrNo, 'Return has been created' + res.TrNo, MessageType.Succeed);
                    displayDate_speed(res.ReceiveID, res);
                    Success(res.ReceiveID);
                    Save_Succ_But();
                } else {
                    DisplayMassage("هناك خطــأ ", '(Error)', MessageType.Error);
                    flag_Insert = 0;
                }
            }
        });

    }
    function Update() { 
        InvoiceModel.ReceiveID = receiveID;
        InvoiceModel.CreatedBy = InvoiceStatisticsModel[0].CreatedBy;
        InvoiceModel.CreatedAt = InvoiceStatisticsModel[0].CreatedAt;

        var returnNumber = Number(lblReturnNumber.value);
        InvoiceModel.TrNo = returnNumber;
        InvoiceModel.UpdatedBy = SysSession.CurrentEnvironment.UserCode;
        InvoiceModel.UpdatedAt = DateTimeFormat(Date().toString()); 

        InvoiceModel.StoreID = InvoiceStatisticsModel[0].StoreID;//main store 

        if (txtInvoiceNumber.value.toString() == "") {
            InvoiceModel.RefTrID = null;
            InvoiceModel.SalesmanId = Number(ddlFreeSalesman.value); }
        else {
            InvoiceModel.SalesmanId = InvoiceStatisticsModel[0].SalesmanId;
            InvoiceModel.RefTrID = Number(RefTrID);
        }


        if (!CheckDate(DateFormat(txtInvoiceDate.value).toString(), DateFormat(SysSession.CurrentEnvironment.StartDate).toString(), DateFormat(SysSession.CurrentEnvironment.EndDate).toString())) {
            WorningMessage('  التاريخ ليس متطابق مع تاريخ السنه (' + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ')', 'The date is not identical with the date of the year(' + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ')', "تحذير", "worning");
            return
        }

        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("PurTrReceive", "UpdateReturnPurchaseReceiveMasterDetail"),
            data: JSON.stringify(MasterDetailModel),
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess == true) {
                    let res = result.Response as IQ_GetPurReceiveStaistic;
                    DisplayMassage("تم تعديل المرتجع بنجاح  ", '(The return has been modified successfully)', MessageType.Succeed);  
                    displayDate_speed(res.ReceiveID, res);
                    Success(res.ReceiveID);
                    Save_Succ_But();
                } else {
                    DisplayMassage("هناك خطـأ", '(Error)', MessageType.Error);
                    flag_Insert = 0;
                }
            }
        });
         
    }
     
    function Success(RecID: number) {
      
        $("#DivFilter").removeClass("disabledDiv");
        $("#divMasterGridiv").removeClass("disabledDiv"); 
        $('#btnSave').toggleClass("display_none");
        $('#btnBack').toggleClass("display_none");
        $("#btnUpdate").removeClass("display_none");
        $("#btnUpdate").removeAttr("disabled");

        CountGrid = 0;
        Show = true;
        InvoiceFlag = false;
        $("#divReturnDetails").removeClass("display_none");
        $("#btnBack").addClass("display_none");
        $("#btnSave").addClass("display_none");
        $("#btnEdit").removeClass("display_none");
        $("#btnPrintTransaction").removeClass("display_none");
        clear();
        $("#ddlCashBox").prop("value", "null");
        $("#txtCashAmount").prop("value", "");
        let Selecteditem = GetPurReceiveStaisticData.filter(x => x.ReceiveID == Number(RecID));
        receiveID = Number(Selecteditem[0].ReceiveID);
        InvoiceStatisticsModel = Selecteditem;
        if (InvoiceStatisticsModel.length > 0) {

            txtInvoiceNumber.value = InvoiceStatisticsModel[0].TrNo.toString();
            ddlTaxTypeHeader.value = InvoiceStatisticsModel[0].VATType.toString();
            txtItemCount.value = InvoiceStatisticsModel[0].Line_Count.toString();
            txtPackageCount.value = InvoiceStatisticsModel[0].Tot_Qty.toString();
            txtTotal.value = InvoiceStatisticsModel[0].Total.toString();
            StoreID = InvoiceStatisticsModel[0].StoreID;
            if (InvoiceStatisticsModel[0].VatAmount != null) { txtTax.value = InvoiceStatisticsModel[0].VatAmount.toString(); }
            else { txtTax.value = '0'; }
            if (InvoiceStatisticsModel[0].NetDue != null) { txtNet.value = InvoiceStatisticsModel[0].NetDue.toString(); }
            else { txtNet.value = '0'; }
            vatType = InvoiceStatisticsModel[0].VATType;
            PurRecType = InvoiceStatisticsModel[0].PurRecType;
            if (InvoiceStatisticsModel[0].RefTrID != null) {
                txtInvoiceNumber.value = InvoiceStatisticsModel[0].RefTrID.toString();
                RefTrID = InvoiceStatisticsModel[0].RefTrID.toString();
                GetPurReceiveCharge(InvoiceStatisticsModel[0].RefTrID);
            }

            var ReturnNum = InvoiceStatisticsModel[0].TrNo.toString();
            lblReturnNumber.value = ReturnNum;
            txtInvoiceDate.value = DateFormat(InvoiceStatisticsModel[0].TrDate.toString());
            if (InvoiceStatisticsModel[0].VendorID != null) {
                $('#ddlVendorDetails option[value=' + InvoiceStatisticsModel[0].VendorID + ']').prop('selected', 'selected').change();
                $('#txt_note').val(InvoiceStatisticsModel[0].Remarks);
            } else { $('#ddlVendorDetails option[value=Null]').prop('selected', 'selected').change(); }
            if (InvoiceStatisticsModel[0].IsCash == true) {
                $('#ddlReturnTypeShow').prop("value", "1");
                $("#DivCashBox1").removeClass("display_none");
                $("#DivCashBox2").removeClass("display_none");
                $("#rowData").removeClass("display_none");
                $("#divTotalSatistics").removeClass("display_none");
                if (InvoiceStatisticsModel[0].CashBoxID != null && InvoiceStatisticsModel[0].CashBoxID != 0) {
                    var BoxID = InvoiceStatisticsModel[0].CashBoxID.toString();
                    var cashAmount = InvoiceStatisticsModel[0].CashPaidAmount;
                    $('#ddlCashBox option[value=' + BoxID + ']').prop('selected', 'selected').change();
                    $("#txtCashAmount").prop("value", cashAmount);
                }
            } else {
                $("#DivCashBox1").addClass("display_none");
                $("#DivCashBox2").addClass("display_none");
                $("#rowData").addClass("display_none");
                $("#divTotalSatistics").addClass("display_none");
                $('#ddlReturnTypeShow').prop("value", "0");
            }
            $('#ddlFreeSalesman').prop("value", InvoiceStatisticsModel[0].SalesmanId.toString());
            $('#btnUpdate').removeClass("display_none");
            $('#btnsave').addClass("display_none");
            $('#btnback').addClass("display_none");
            if (InvoiceStatisticsModel[0].Status == 1) {
                chkActive.checked = true;
                btnEdit.disabled = true;
                FalgOpen = true;
                chkActive.disabled = !SysSession.CurrentPrivileges.CUSTOM2;
            } else {
                chkActive.checked = false;
                chkActive.disabled = true;
                btnEdit.disabled = !SysSession.CurrentPrivileges.EDIT;
            }
            $('#divCreationPanel').removeClass("display_none");
            $('#txtCreatedBy').prop("value", InvoiceStatisticsModel[0].CreatedBy);
            $('#txtCreatedAt').prop("value", InvoiceStatisticsModel[0].CreatedAt);
            $('#txtUpdatedBy').prop("value", InvoiceStatisticsModel[0].UpdatedBy);
            $('#txtUpdatedAt').prop("value", InvoiceStatisticsModel[0].UpdatedAt);

        }
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("PurTrReceive", "GetPurReceiveItems"),
            data: { receiveID: receiveID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    SlsInvoiceItemsDetails = result.Response as Array<IQ_GetPurReceiveItem>;
                    CountGrid = 0;
                    for (let i = 0; i < SlsInvoiceItemsDetails.length; i++) {
                        BuildControls(i);
                        CountGrid++;
                    }

                    CountItems = CountGrid;

                    //SlsInvoiceItemsDetails[0].ItemID;
                }
            }
        });
        $("#rowData").removeClass("display_none");
        $("#divTotalSatistics").removeClass("display_none");
        ComputeTotals();

        $("#divGridDetails_View").removeClass("disabledDiv");
        $("#DivFilter").removeClass("disabledDiv");
        $("#divMasterGridiv").removeClass("disabledDiv");
        $("#ddlVendorDetails").attr("disabled", "disabled");
        $("#ddlReturnTypeShow").attr("disabled", "disabled");
        $("#ddlFreeSalesman").attr("disabled", "disabled");
        //$("#txt_note").attr("disabled", "disabled");
        $("#ddlCashBox").attr("disabled", "disabled");
        $("#txtCashAmount").attr("disabled", "disabled");


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
        InvoiceModel.ReceiveID = receiveID;
        InvoiceModel.CreatedBy = InvoiceStatisticsModel[0].CreatedBy;
        InvoiceModel.CreatedAt = InvoiceStatisticsModel[0].CreatedAt;
     
        InvoiceModel.TrNo = Number(lblReturnNumber.value);
        InvoiceModel.UpdatedBy = SysSession.CurrentEnvironment.UserCode;
        InvoiceModel.UpdatedAt = DateTimeFormat(Date().toString()); 

        InvoiceModel.Status = 0;
        InvoiceModel.StoreID = InvoiceStatisticsModel[0].StoreID;;//main store 
        if (txtInvoiceNumber.value.toString() == "") {
            InvoiceModel.RefTrID = null;
            InvoiceModel.SalesmanId = Number(ddlFreeSalesman.value); 
        }
        else {
            InvoiceModel.SalesmanId = InvoiceStatisticsModel[0].SalesmanId;
            InvoiceModel.RefTrID = Number(RefTrID);
        }
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("PurTrReceive", "OpenReturn"),
            data: JSON.stringify(MasterDetailModel),
            success: (d) => {
                let result = d as BaseResponse;
                let res = result.Response as IQ_GetPurReceiveStaistic;
                if (result.IsSuccess == true) {
                    DisplayMassage(" تم فك الاعتماد رقم  " + res.TrNo + " ", "invoice number " + res.TrNo + "has been unapproved", MessageType.Succeed);
                    btnEdit.disabled = false;
                    $("#btnEdit").removeClass("display_none");
                     
                    displayDate_speed(res.ReceiveID, res)

                    chkActive.checked = false;
                    chkActive.disabled = true;

                } else {
                    btnEdit.disabled = true;
                    $("#btnEdit").removeClass("display_none");
                }
            }
        });
    }
    function displayDate_speed(RecID: number, res: IQ_GetPurReceiveStaistic) {

        debugger
        GetPurReceiveStaisticData = GetPurReceiveStaisticData.filter(x => x.ReceiveID != RecID);

        res.TrDate = DateFormat(res.TrDate.toString());

        GetPurReceiveStaisticData.push(res);
        GetPurReceiveStaisticData = GetPurReceiveStaisticData.sort(dynamicSort("TrNo"));

        divMasterGrid.DataSource = GetPurReceiveStaisticData;
        divMasterGrid.Bind();

        $("#divMasterGridiv").removeClass("display_none"); 
        $("#divMasterGrid").jsGrid("option", "pageIndex", 1);

    }
  //----------------------------------------------------------PRint region---------------------------------------
    export function PrintReport(OutType: number) {
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
        rp.TrType = 1;
       
        if (ddlReturnType.selectedIndex > 0)

            rp.CashType = Number($("#ddlReturnType").val());
        else
            rp.SalesmanID = -1;
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
    function PrintTransaction() {
        if (!SysSession.CurrentPrivileges.PrintOut) return;
        let rp: ReportParameters = new ReportParameters();
        
        rp.Type = 0;
        rp.Repdesign = 1;

        debugger
        rp.TRId = receiveID;
                                                                                
                rp.Name_function = "IProc_Prnt_PurReceiveRet";
        localStorage.setItem("Report_Data", JSON.stringify(rp));

        localStorage.setItem("result", '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>');
         window.open(Url.Action("ReportsPopup", "Home"), "_blank");
    }


    function btnPrintsFrom_To_onclick() {
        btnShow_onclick();

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



        try {


            let Name_ID = 'ReceiveID'
            let NameTable = 'IQ_GetPurReceiveStaistic'
            let Condation1 = "  TrType = 1 and CompCode = " + compcode + " and BranchCode =" + BranchCode + " " +
                " and TrDate >=' " + startdt + "' and TrDate <= ' " + enddt + " ' ";
            let Condation2 = " ";


            if (salesmanId != 0 && salesmanId != null)
                Condation2 = Condation2 + " and SalesmanId =" + salesmanId;

            if (vendorId != 0 && vendorId != null)
                Condation2 = Condation2 + " and VendorID =" + vendorId;

            if (status == 0 || status == 1) {
                Condation2 = Condation2 + " and Status = " + status;
            }
            else if (status == 2) {
                Condation2 = Condation2 + "";
            }

            ///////////
            let Condation3 = Condation1 + Condation2 + " ORDER BY TrNo ASC;";


            PrintsFrom_To(TransType.Pur_Receive_Return, Name_ID, NameTable, Condation3, GetPurReceiveStaisticData.length)



        } catch (e) {

            return
        }

    }

}