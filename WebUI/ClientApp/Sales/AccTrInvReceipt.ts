
$(document).ready(() => {
    ////////debugger;
    AccTrInvReceipt.InitalizeComponent();
})

namespace AccTrInvReceipt {
    //system varables
    var invoiceID;
    var SysSession: SystemSession = GetSystemSession(Modules.AccTrInvReceipt);
    var compcode: Number;
    var BranchCode: number;//SharedSession.CurrentEnvironment.BranchCode;
    var Finyear: number;//SharedSession.CurrentEnvironment.BranchCode;
    var sys: SystemTools = new SystemTools();

    //Arrays
    var CashboxDetails: Array<A_RecPay_D_CashBox> = new Array<A_RecPay_D_CashBox>();
    var SellerDetails: Array<I_Sls_D_Salesman> = new Array<I_Sls_D_Salesman>();
    var StateDetailsAr: Array<string> = new Array<string>();
    var StateDetailsEn: Array<string> = new Array<string>();
    var SlsInvoiceStatisticsDetails: Array<IQ_GetSlsInvoiceStatistic> = new Array<IQ_GetSlsInvoiceStatistic>();
    var SearchDetails: Array<IQ_GetSlsInvoiceStatistic> = new Array<IQ_GetSlsInvoiceStatistic>();
    var CustomersDetails: Array<A_Rec_D_Customer> = new Array<A_Rec_D_Customer>();
    var Customer: A_Rec_D_Customer = new A_Rec_D_Customer();//
    var G_USERSDetails: Array<G_USERS> = new Array<G_USERS>();
    var SlsInvoiceItemsDetails: Array<IQ_GetSlsInvoiceItem> = new Array<IQ_GetSlsInvoiceItem>();
    var FamilyDetails: Array<I_ItemFamily> = new Array<I_ItemFamily>();
    var ItemDetailsStoreInfo: Array<IQ_GetItemStoreInfo> = new Array<IQ_GetItemStoreInfo>();
    var ItemDetails: Array<IQ_GetItemStoreInfo> = new Array<IQ_GetItemStoreInfo>();
    var AD_VatTypeDetails: A_D_VAT_TYPE = new A_D_VAT_TYPE();
    //StoreDetails = result.Response as G_STORE;
    var StoreDetails: G_STORE = new G_STORE();//

    //Models
    var SlsInvoiceListModel: Array<IQ_GetSlsInvoiceList> = new Array<IQ_GetSlsInvoiceList>();
    var UpdatedModel: Array<I_Sls_TR_Invoice> = new Array<I_Sls_TR_Invoice>();
    var FilteredModel: Array<I_Sls_TR_Invoice> = new Array<I_Sls_TR_Invoice>();
    var InvoiceStatisticsModel: Array<IQ_GetSlsInvoiceStatistic> = new Array<IQ_GetSlsInvoiceStatistic>();

    var InvoiceModel: I_Sls_TR_Invoice = new I_Sls_TR_Invoice();
    var MasterDetailsModel: SlsInvoiceMasterDetails = new SlsInvoiceMasterDetails();
    var invoiceItemSingleModel: I_Sls_TR_InvoiceItems = new I_Sls_TR_InvoiceItems();
    var InvoiceItemsDetailsModel: Array<I_Sls_TR_InvoiceItems> = new Array<I_Sls_TR_InvoiceItems>();
    var List_MinUnitPrice: Array<I_Sls_TR_InvoiceItems> = new Array<I_Sls_TR_InvoiceItems>();

    //DropDownlist
    var ddlCashBox: HTMLSelectElement;
    var ddlStateType: HTMLSelectElement;
    var ddlSalesman: HTMLSelectElement;
    var ddlSeller: HTMLSelectElement;
    var ddlCustomer: HTMLSelectElement;

    // giedView
    var Grid: JsGrid = new JsGrid();

    //Textboxes
    var txtDate: HTMLInputElement;
    var txtSearchBox1: HTMLInputElement;
    var txtNetTot: HTMLInputElement;
    var txtCommisionTot: HTMLInputElement;
    var txtPaidAmountTot: HTMLInputElement;
    var txtCashTot: HTMLInputElement;
    var txtCardTot: HTMLInputElement;
    var txtItemCount: HTMLInputElement;
    var txtPackageCount: HTMLInputElement;
    var txtTotal: HTMLInputElement;
    var txtTax: HTMLInputElement;
    var txt_ApprovePass: HTMLInputElement;

    var txtNetInv: HTMLInputElement;
    var txtCommisionInv: HTMLInputElement;
    var txtPaidAmountInv: HTMLInputElement;
    var txtCashInv: HTMLInputElement;
    var txtCardInv: HTMLInputElement;

    //buttons 
    var btnExecute: HTMLButtonElement;
    var btnShow: HTMLButtonElement;
    var btnUpdate: HTMLButtonElement;
    var btnAddDetails: HTMLButtonElement;
    var btnBack: HTMLButtonElement;
    var btnSave: HTMLButtonElement;
    var btn_Approveprice: HTMLButtonElement;
    var btn_Exit_Approveprice: HTMLButtonElement;


    //labels
    var lblInvoiceNumber: HTMLLabelElement;
    var lblInvoiceDate: HTMLLabelElement;
    var lblInvoiceCustomer: HTMLLabelElement;
    var lblInvoiceSalesman: HTMLLabelElement;
    var lblInvoiceCustomerMobile: HTMLLabelElement;
    var lblInvoiceStore: HTMLLabelElement;

    //flags
    var NetTot: number = 0;
    var CommisionTot: number = 0;
    var PaidAmountTot: number = 0;
    var CashTot: number = 0;
    var CardTot: number = 0;

    var NetInv: number = 0;
    var CommisionInv: number = 0;
    var PaidAmountInv: number = 0;
    var CashInv: number = 0;
    var CardInv: number = 0;

    var ShowFlag: boolean;
    var StatusFlag: boolean;
    var Show: boolean = true;

    //global
    var VatPrc;
    var vatType: number;
    var CountGrid = 0;
    var CountItems: number = 0;
    var PackageCount: number = 0;
    var CountTotal: number = 0;
    var TaxCount: number = 0;
    var NetCount: number = 0;
    var commissionCount: number = 0;
    var Validation_Insert = 0;
    var storeID;
    //---------------------------------------------------------------------------------------print Buttons 
    
    var btnPrint: HTMLButtonElement;
    var btnPrintTrview: HTMLButtonElement;
    var btnPrintTrPDF: HTMLButtonElement;
    var btnPrintTrEXEL: HTMLButtonElement;
    var btnPrintTransaction: HTMLButtonElement;
    var btnPrintslip: HTMLButtonElement;
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);



  

    //---------------------------------------------------------------------------------------
    export function InitalizeComponent() {
        InitalizeControls();
        //GetAllCustomers();
        txtDate.value = GetDate();
        IntializeEvents();
        FillddlCashBox();
        FillddlStateType();
        FillddlSalesman();
        FillddlSeller();
        FillddlCustomer();
        FillddlFamily();
        $('#ddlStateType').prop("value", "2");
        ShowFlag = true;
        StatusFlag = false;
        $("#btnExecute").attr("disabled", "disabled");
        GetVatPercentage();

        txtItemCount.value = CountItems.toString();
        txtPackageCount.value = PackageCount.toString();
        txtTotal.value = CountTotal.toString();
        txtTax.value = TaxCount.toString();
        txtNetInv.value = NetInv.toString();
        txtCommisionInv.value = CommisionInv.toString();
        txtPaidAmountInv.value = PaidAmountInv.toString();
        txtCashInv.value = CashInv.toString();
        txtCardInv.value = CardInv.toString();

        txtNetTot.value = NetTot.toString();
        txtCommisionTot.value = CommisionTot.toString();
        txtPaidAmountTot.value = PaidAmountTot.toString();
        txtCashTot.value = CashTot.toString();
        txtCardTot.value = CardTot.toString();
        InitializeGrid();
        GetAllIItem();

        $('#btnPrint').addClass('display_none');

    }
    function IntializeEvents() {
        btnUpdate.onclick = btnUpdate_onclick;
        btnShow.onclick = btnShow_onclick;
        btnExecute.onclick = btnExecute_onclick;
        txtSearchBox1.onkeyup = SearchBox_Change;
        ddlStateType.onchange = ddlStateType_onchange;
        btnAddDetails.onclick = AddNewRow;
        btnBack.onclick = btnBack_onclick;
        btnSave.onclick = btnSave_onclick;
        txtCommisionInv.onchange = txtCommisionInv_onchange;
        //   txtCardTot.onchange = cashOrCredit_onchange;
        //   txtCashTot.onchange = cashOrCredit_onchange;
        btn_Approveprice.onclick = btn_Approveprice_onclick;
        btn_Exit_Approveprice.onclick = btn_Exit_Approveprice_onclick;


        btnPrintTrview.onclick = () => { PrintReport(1); }
        btnPrintTrPDF.onclick = () => { PrintReport(2); }
        btnPrintTrEXEL.onclick = () => { PrintReport(3); }
        btnPrint.onclick = () => { PrintReport(4); }
        btnPrintTransaction.onclick = btnPrintTransaction_onclick;
        btnPrintslip.onclick = btnPrintslip_onclick;


    }
    function txtCommisionInv_onchange() {
        var comm = Number(txtCommisionInv.value);
        var Net = Number(txtNetInv.value);
        if (comm > Net) {
            DisplayMassage('(يجب ان تكون العموله أفل من الصافى)', '(commission must be less that Net)', MessageType.Error);

            txtCommisionInv.value = "";
            return false
        } else {
            txtPaidAmountInv.value = (Net - comm).toString();
        }
    }
    function InitalizeControls() {

        Finyear = Number(SysSession.CurrentEnvironment.CurrentYear);
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);
        vatType = SysSession.CurrentEnvironment.I_Control[0].DefSlsVatType;
        //---------------------------------------------------------------------------------------print Buttons
        btnPrint = document.getElementById("btnPrint") as HTMLButtonElement;
        btnPrintTrview = document.getElementById("btnPrintTrview") as HTMLButtonElement;
        btnPrintTrPDF = document.getElementById("btnPrintTrPDF") as HTMLButtonElement;
        btnPrintTrEXEL = document.getElementById("btnPrintTrEXEL") as HTMLButtonElement;
        btnPrintTransaction = document.getElementById("btnPrintTransaction") as HTMLButtonElement;
        btnPrintslip = document.getElementById("btnPrintslip") as HTMLButtonElement;



        //---------------------------------------------------------------------------------------
        //Drop Downlists
        ddlCashBox = document.getElementById("ddlCashBox") as HTMLSelectElement;
        ddlStateType = document.getElementById("ddlStateType") as HTMLSelectElement;
        ddlSalesman = document.getElementById("ddlSalesman") as HTMLSelectElement;
        ddlSeller = document.getElementById("ddlSeller") as HTMLSelectElement;
        ddlCustomer = document.getElementById("ddlCustomer") as HTMLSelectElement;

        //textboxes
        txtDate = document.getElementById("txtDate") as HTMLInputElement;
        txtSearchBox1 = document.getElementById("txtSearchBox1") as HTMLInputElement;

        //textbox Totals
        txtNetTot = document.getElementById("txtNetTot") as HTMLInputElement;
        txtCommisionTot = document.getElementById("txtCommisionTot") as HTMLInputElement;
        txtPaidAmountTot = document.getElementById("txtPaidAmountTot") as HTMLInputElement;
        txtCashTot = document.getElementById("txtCashTot") as HTMLInputElement;
        txtCardTot = document.getElementById("txtCardTot") as HTMLInputElement;
        txtItemCount = document.getElementById("txtItemCount") as HTMLInputElement;
        txtPackageCount = document.getElementById("txtPackageCount") as HTMLInputElement;
        txtTotal = document.getElementById("txtTotal") as HTMLInputElement;
        txtTax = document.getElementById("txtTax") as HTMLInputElement;
        txt_ApprovePass = document.getElementById("txt_ApprovePass") as HTMLInputElement;

        txtNetInv = document.getElementById("txtNetInv") as HTMLInputElement;
        txtCommisionInv = document.getElementById("txtCommisionInv") as HTMLInputElement;
        txtPaidAmountInv = document.getElementById("txtPaidAmountInv") as HTMLInputElement;
        txtCashInv = document.getElementById("txtCashInv") as HTMLInputElement;
        txtCardInv = document.getElementById("txtCardInv") as HTMLInputElement;

        //buttons
        btnExecute = document.getElementById("btnExecute") as HTMLButtonElement;
        btnShow = document.getElementById("btnShow") as HTMLButtonElement;
        btnUpdate = document.getElementById("btnUpdate") as HTMLButtonElement;
        btnAddDetails = document.getElementById("btnAddDetails") as HTMLButtonElement;// btnBack btnSave
        btnBack = document.getElementById("btnBack") as HTMLButtonElement;
        btnSave = document.getElementById("btnSave") as HTMLButtonElement;
        btn_Approveprice = document.getElementById("btn_Approveprice") as HTMLButtonElement;
        btn_Exit_Approveprice = document.getElementById("btn_Exit_Approveprice") as HTMLButtonElement;


        //labels

        lblInvoiceNumber = document.getElementById("lblInvoiceNumber") as HTMLLabelElement;
        lblInvoiceDate = document.getElementById("lblInvoiceDate") as HTMLLabelElement;
        lblInvoiceCustomer = document.getElementById("lblInvoiceCustomer") as HTMLLabelElement;
        lblInvoiceSalesman = document.getElementById("lblInvoiceSalesman") as HTMLLabelElement;
        lblInvoiceCustomerMobile = document.getElementById("lblInvoiceCustomerMobile") as HTMLLabelElement;
        lblInvoiceStore = document.getElementById("lblInvoiceStore") as HTMLLabelElement;

        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = " تحصيل الفواتير النقدية";

        } else {
            document.getElementById('Screen_name').innerHTML = "Sales Invoices";

        }
       

    }
    function InitializeGrid() {
        //////debugger;      
        let res: any = GetResourceList("");
        $("#id_divGridDetails").attr("style", "");
        Grid.ElementName = "divGridDetails";
        Grid.Paging = true;
        Grid.PageSize = 10;
        Grid.Sorting = true;
       // Grid.InsertionMode = JsGridInsertionMode.Binding;
        Grid.Editing = false;
        Grid.Inserting = false;
        Grid.OnRowDoubleClicked = Grid_RowDoubleClicked;
        Grid.SelectedIndex = 1;
        //Grid.OnItemEditing = () => { };
        Grid.PrimaryKey = "InvoiceID";
        Grid.Columns = [
            { title: "ID", name: "InvoiceID", type: "text", width: "2%", visible: false },
            { title: res.App_InvoiceNum, name: "TrNo", type: "text", width: "13%" },
            { title: res.App_Cutomer, name: "CustomerName", type: "text", width: "25%" },
            { title: res.App_Mobile, name: "CustomerMobileNo", type: "text", width: "15%" },
            { title: res.App_Salesman, name: "Slsm_DescA", type: "text", width: "25%" },
            { title: res.Men_StkDefItemsNumber, name: "Line_Count", type: "text", width: "12%" },
            { title: res.App_PackageCount, name: "Tot_Qty", type: "text", width: "12%" },
            { title: res.App_total, name: "TotalAmount", type: "text", width: "10%" },
            { title: res.App_Tax, name: "VatAmount", type: "text", width: "10%" },
            { title: res.net, name: "NetAfterVat", type: "text", width: "10%" },
            { title: res.App_Commission, name: "CommitionAmount", type: "text", width: "15%" },
            {
                title: res.App_TobePaid, name: "RemainAmount", type: "text", width: "17%", css: "classfont"
            },
            {
                title: res.App_CashPaid, css: "ColumPadding", name: "CashAmount", width: "14%",
                itemTemplate: (s: string, item: IQ_GetSlsInvoiceStatistic): HTMLInputElement => {
                    let txt: HTMLInputElement = CreateElement("number", "form-control disabled", " ", " ", "", " ");
                    txt.id = "txtcash";
                    //txt.name = SlsInvoiceListModel.indexOf(item).toString();
                    //SlsInvoiceListModel = Grid.DataSource;
                    txt.style.height = "25px";
                    txt.style.width = "70px";
                    txt.onchange = (e) => {
                        item.CashAmount = Number(txt.value);
                      
                        //////
                        CashTot = 0;
                        CardTot = 0;

                        for (let i = 0; i < SlsInvoiceStatisticsDetails.length; i++) {
                            CashTot += SlsInvoiceStatisticsDetails[i].CashAmount;
                            CardTot += SlsInvoiceStatisticsDetails[i].CardAmount;
                        }
                        txtCashTot.value = CashTot.RoundToSt(2).toString();
                        txtCardTot.value = CardTot.RoundToSt(2).toString();
                        //////
                    };
 
                        txt.disabled = StatusFlag;
                        txt.value = item.CashAmount.toString();
                   
                    if (ddlStateType.value != "null") {
                        var status = Number(ddlStateType.value.toString());
                        if (status == 0) {
                            txt.disabled = false;
                        }
                        else if (status == 2 || status == 1) {
                            txt.disabled = true;
                        }
                    }
                    return txt;
                }
            }
            , {//res.Renew_Renew
                title: res.App_CardPaid, css: "ColumPadding ", name: "CardAmount", width: "14%",
                itemTemplate: (s: string, item: IQ_GetSlsInvoiceStatistic): HTMLInputElement => {
                    let txt: HTMLInputElement = CreateElement("number", " form-control disabled", " ", " ", "", " ");
                    txt.id = "txtcard";
                   
                    txt.style.height = "25px";
                    txt.style.width = "70px";
                    txt.onchange = (e) => {
                        item.CardAmount = Number(txt.value);
                     

                        CashTot = 0;
                        CardTot = 0;

                        for (let i = 0; i < SlsInvoiceStatisticsDetails.length; i++) {
                            CashTot += SlsInvoiceStatisticsDetails[i].CashAmount;
                            CardTot += SlsInvoiceStatisticsDetails[i].CardAmount;
                        }
                        txtCashTot.value = CashTot.RoundToSt(2).toString();
                        txtCardTot.value = CardTot.RoundToSt(2).toString();
                    };
              
                        txt.disabled = StatusFlag;
                        txt.value = item.CardAmount.toString();
                   
                    if (ddlStateType.value != "null") {
                        var status = Number(ddlStateType.value.toString());
                        if (status == 0) {
                            txt.disabled = false;
                        }
                        else if (status == 2 || status == 1) {
                            txt.disabled = true;
                        }
                    }
                    return txt;
                }
            }
        ];
        
        BindStatisticGridData();
    }
    function Check_on_user_type() {

        if (SysSession.CurrentEnvironment.UserType == 1 || SysSession.CurrentEnvironment.UserType == 3) { //Salesman

            let SalesId = SysSession.CurrentEnvironment.SalesManID;
            SellerDetails = SellerDetails.filter(s => s.SalesmanId == SalesId);

        }
        else if (SysSession.CurrentEnvironment.UserType == 2) {//CashBox

        }

    }
    function GetStoreNameByID(id: number) {
        // GetById(int id, string UserCode, string Token)
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("StkDefStore", "GetById"),
            data: { id: id, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    StoreDetails = result.Response as G_STORE;
                    lblInvoiceStore.innerText = StoreDetails.DescA.toString();
                }
            }
        });
    }
    function Grid_RowDoubleClicked() {
        Show = true;//   //////debugger;
        $("#btnUpdate").removeClass("display_none");//
        $("#div_btnPrint").removeClass("display_none");//
        $("#divInvoiceDetails").removeClass("display_none");
        clear();
        txtCashInv.disabled = true;
        txtCardInv.disabled = true;
        ////debugger
        InvoiceStatisticsModel = new Array<IQ_GetSlsInvoiceStatistic>();
        let Selecteditem = SlsInvoiceStatisticsDetails.filter(x => x.InvoiceID == Number(Grid.SelectedKey));
        invoiceID = Number(Selecteditem[0].InvoiceID);
        InvoiceStatisticsModel = Selecteditem; 
        if (InvoiceStatisticsModel.length > 0) {
            lblInvoiceNumber.innerText = InvoiceStatisticsModel[0].TrNo.toString();
            lblInvoiceDate.innerText = DateFormat(InvoiceStatisticsModel[0].TrDate.toString());

            lblInvoiceSalesman.innerText = InvoiceStatisticsModel[0].Slsm_DescA.toString();
            if (InvoiceStatisticsModel[0].CustomerMobileNo != null || InvoiceStatisticsModel[0].CustomerMobileNo != "") {
                lblInvoiceCustomerMobile.innerText = InvoiceStatisticsModel[0].CustomerMobileNo.toString();
            } else {
                lblInvoiceCustomerMobile.innerText = (lang == "ar" ? "لا يوجد رقم" : "no number");
            }
            if (InvoiceStatisticsModel[0].CustomerId != null) {
                lblInvoiceCustomer.innerText = (lang == "ar" ? InvoiceStatisticsModel[0].Cus_NameA.toString() : InvoiceStatisticsModel[0].Cus_NameE.toString());
            } else {
                lblInvoiceCustomer.innerText = InvoiceStatisticsModel[0].CustomerName.toString();
            }
             storeID = InvoiceStatisticsModel[0].StoreId;
            GetStoreNameByID(storeID);
            ////////////////////

            txtItemCount.value = InvoiceStatisticsModel[0].Line_Count.toString();
            CountItems = InvoiceStatisticsModel[0].Line_Count;

            txtPackageCount.value = InvoiceStatisticsModel[0].Tot_Qty.toString();
            PackageCount = InvoiceStatisticsModel[0].Tot_Qty;

            txtTotal.value = InvoiceStatisticsModel[0].TotalAmount.RoundToSt(2).toString();
            CountTotal = Number( InvoiceStatisticsModel[0].TotalAmount.RoundToSt(2));

            txtTax.value = InvoiceStatisticsModel[0].VatAmount.RoundToSt(2).toString();
            TaxCount = Number(InvoiceStatisticsModel[0].VatAmount.RoundToSt(2));

            txtNetInv.value = InvoiceStatisticsModel[0].NetAfterVat.RoundToSt(2).toString();
            NetInv = Number( InvoiceStatisticsModel[0].NetAfterVat.RoundToSt(2));

            txtCommisionInv.value = InvoiceStatisticsModel[0].CommitionAmount.RoundToSt(2).toString();
            CommisionInv = Number( InvoiceStatisticsModel[0].CommitionAmount.RoundToSt(2));

            txtPaidAmountInv.value = InvoiceStatisticsModel[0].RemainAmount.RoundToSt(2).toString();
            PaidAmountInv = Number( InvoiceStatisticsModel[0].RemainAmount.RoundToSt(2));

            txtCashInv.value = InvoiceStatisticsModel[0].CashAmount.RoundToSt(2).toString();
            CashInv = Number(InvoiceStatisticsModel[0].CashAmount.RoundToSt(2));

            txtCardInv.value = InvoiceStatisticsModel[0].CardAmount.RoundToSt(2);
            CardInv = Number( InvoiceStatisticsModel[0].CardAmount.RoundToSt(2));


            $('#divCreationPanel').removeClass("display_none");

            $('#txtCreatedBy').prop("value", InvoiceStatisticsModel[0].CreatedBy);
            $('#txtCreatedAt').prop("value", InvoiceStatisticsModel[0].CreatedAt);

            $('#txtUpdatedBy').prop("value", InvoiceStatisticsModel[0].UpdatedBy);
            $('#txtUpdatedAt').prop("value", InvoiceStatisticsModel[0].UpdatedAt);
          
        }


        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("SlsTrSales", "GetSlsInvoiceItem"),
            data: { invoiceID: invoiceID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {//(int CompCode, string StartDate, string EndDate, int Status, int? CustId, string SalesUser, string UserCode, string Token)
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    SlsInvoiceItemsDetails = result.Response as Array<IQ_GetSlsInvoiceItem>;
                    for (let i = 0; i < SlsInvoiceItemsDetails.length; i++) {
                        BuildControls(i);
                    }
                    CountGrid = SlsInvoiceItemsDetails.length;
                    CountItems = SlsInvoiceItemsDetails.length;
                }
            }
        });

        NetInv = 0;
        CommisionInv = 0;
        PaidAmountInv = 0;
        CashInv = 0;
        CardInv = 0;

        $("#btnSave").addClass("display_none");
        $("#btnBack").addClass("display_none");
        $(".disabled").attr("disabled", "disabled");

        if (ddlStateType.value == "1" || ddlStateType.value == "2") {
            $("#btnUpdate").attr("disabled", "disabled");
        } else {
            $("#btnUpdate").removeAttr("disabled");
        }
        
    }
  
    function BindStatisticGridData() {
      
        var dt = DateFormatRep(txtDate.value).toString();
        var cashboxId = 0;
        var salesmanId = 0;
        var customerId = 0;
        var status = 0;
        var seller = "null";
        //if (ddlCashBox.value != "null") {
        //    cashboxId = Number(ddlCashBox.value.toString());
        //}

        if (ddlSalesman.value != "null") {
            salesmanId = Number(ddlSalesman.value.toString());
        }
        if (ddlCustomer.value != "null") {
            customerId = Number(ddlCustomer.value.toString());
        }
        if (ddlSeller.value != "null") {
            seller = ddlSeller.value.toString();
        }
        status = Number(ddlStateType.value.toString());
        ///////////
        if (status == 1 || status == 2)//مسدد
        {
            if (ddlCashBox.value == "null") {
                cashboxId = 0;
            } else if (ddlCashBox.value != "null") {
                cashboxId = Number(ddlCashBox.value);
            }
        }
        else if (status == 0)   //غير مسدد
        {
            cashboxId = 0;
        }
        //////////
        NetTot = 0;
        CommisionTot = 0;
        PaidAmountTot = 0;
        CashTot = 0;
        CardTot = 0;
        ////debugger;
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("SlsTrSales", "GetAllSlsInvoiceCashStatistic"),
            data: { CompCode: compcode, BranchCode: BranchCode, TrDate: dt, Status: status, CashBoxid: cashboxId, SalesmanId: salesmanId, CustId: customerId, SalesUser: seller, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    //////debugger;
                    SlsInvoiceStatisticsDetails = result.Response as Array<IQ_GetSlsInvoiceStatistic>;
                    /////////////////
                    //////debugger;
                    for (let i = 0; i < SlsInvoiceStatisticsDetails.length; i++) {

                        if (SlsInvoiceStatisticsDetails[i].NetAfterVat != null && SlsInvoiceStatisticsDetails[i].NetAfterVat != 0)
                            NetTot += SlsInvoiceStatisticsDetails[i].NetAfterVat;
                        if (SlsInvoiceStatisticsDetails[i].CommitionAmount != null && SlsInvoiceStatisticsDetails[i].CommitionAmount != 0)
                            CommisionTot += SlsInvoiceStatisticsDetails[i].CommitionAmount;
                        if (SlsInvoiceStatisticsDetails[i].RemainAmount != null && SlsInvoiceStatisticsDetails[i].RemainAmount != 0)
                            PaidAmountTot += SlsInvoiceStatisticsDetails[i].RemainAmount;
                        if (SlsInvoiceStatisticsDetails[i].CashAmount != null && SlsInvoiceStatisticsDetails[i].CashAmount != 0)
                            CashTot += SlsInvoiceStatisticsDetails[i].CashAmount;
                        if (SlsInvoiceStatisticsDetails[i].CardAmount != null && SlsInvoiceStatisticsDetails[i].CardAmount != 0)
                        CardTot +=SlsInvoiceStatisticsDetails[i].CardAmount;
                    }
                    txtNetTot.value = NetTot.RoundToSt(2).toString();
                    txtCommisionTot.value = CommisionTot.RoundToSt(2).toString();
                    txtPaidAmountTot.value = PaidAmountTot.RoundToSt(2).toString();
                    txtCashTot.value = CashTot.RoundToSt(2).toString();
                    txtCardTot.value = CardTot.RoundToSt(2).toString();

                    //////////////////////
                   // Grid.DataSource = "";
                }
            }
        });

        Grid.DataSource = SlsInvoiceStatisticsDetails;
        Grid.Bind();
    }
    function Validation() {
        var res = true;
        if (ddlCashBox.value == "null" && ddlStateType.value == "0") {
            DisplayMassage('(يجب اختيار الصندوق الذي سوف يتم السداد علية)', '(The CashBox to be paid must be selected )', MessageType.Error);
            $("#divGridWithDetail").add("display_none");
            $("#btnExecute").attr("disabled", "disabled");
            $("#divGridDetails").add("disabledDiv");//divGridDetailsTot
            $("#divGridDetailsTot").add("disabledDiv");//
            $("#divGrid").addClass("display_none");
        //    $("#divGridDetailsTot").addClass("display_none");
            res = false;
        }
        return res;
    }
 
    function FillddlCashBox() {
        ////debugger.
        let CashBoxID = 0;
        if (SysSession.CurrentEnvironment.UserType == 2 || SysSession.CurrentEnvironment.UserType == 3) {

            CashBoxID = SysSession.CurrentEnvironment.CashBoxID == null ? 0 : SysSession.CurrentEnvironment.CashBoxID
        }

        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefBox", "GetById"),
            data: { compCode: compcode, BranchCode: BranchCode, CashBoxID: CashBoxID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    CashboxDetails = result.Response as Array<A_RecPay_D_CashBox>;
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                        DocumentActions.FillCombowithdefult(CashboxDetails, ddlCashBox, "CashBoxID", "CashBox_DescE", "Select CashBox");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(CashboxDetails, ddlCashBox, "CashBoxID", "CashBox_DescA", "اختر الصندوق");
                    }

                    SysSession.CurrentEnvironment.UserType == 2 || SysSession.CurrentEnvironment.UserType == 3? ($('#ddlCashBox option[value="null"]').remove()) : $('#ddlCashBox').prop('selectedIndex', 0);
                    
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

        StateDetailsAr = [" غير مسدد", "مسدد", "الجميع"];
        StateDetailsEn = ["Not Paid", "Paid", "All"];

        if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
            //let option = document.createElement("option");
            //option.value = null;
            //option.text = "Select ...";
            //ddlStateType.options.add(option);
            for (let i = 0; i < StateDetailsEn.length; i++) {
                let newoption = document.createElement("option");
                newoption.value = i.toString();
                newoption.text = StateDetailsEn[i];
                ddlStateType.options.add(newoption);
            }
        }
        else {
            //let option = document.createElement("option");
            //option.value = null;
            //option.text = "اختر ...";
            //ddlStateType.options.add(option);
            for (let i = 0; i < StateDetailsAr.length; i++) {
                let newoption = document.createElement("option");
                newoption.value = i.toString();
                newoption.text = StateDetailsAr[i];
                ddlStateType.options.add(newoption);
            }
        }
    }
    function FillddlSalesman() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefSalesMen", "GetAllSalesPeople"),
            data: { CompCode: compcode, BranchCode: BranchCode, IsSalesEnable: true, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    SellerDetails = result.Response as Array<I_Sls_D_Salesman>;

                    Check_on_user_type();

                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                        DocumentActions.FillCombowithdefult(SellerDetails, ddlSalesman, "SalesmanId", "NameE", "Select Seller");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(SellerDetails, ddlSalesman, "SalesmanId", "NameA", "اختر المندوب");
                    }

                    SysSession.CurrentEnvironment.UserType == 1 || SysSession.CurrentEnvironment.UserType == 3 ? ($('#ddlSalesman option[value="null"]').remove()) : $('#ddlSalesman').prop('selectedIndex', 0);

                    

                }
            }
        });
    }
    function FillddlCustomer() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefCustomer", "GetAll"),
            data: {
                CompCode: compcode, BranchCode: BranchCode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {

                    CustomersDetails = result.Response as Array<A_Rec_D_Customer>;
                    // CustomersDetails = CustomersDetails.filter(s => s.STATUS == true);

                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                        DocumentActions.FillCombowithdefult(CustomersDetails, ddlCustomer, "CustomerId", "NAMEE", "Select Category");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(CustomersDetails, ddlCustomer, "CustomerId", "NAMEA", "اختر العميل");
                    }
                }
            }
        });
    }
    function btnShow_onclick() {
        if (Validation() == false)
            return;
        ShowFlag = true;
        StatusFlag = true;
        BindStatisticGridData();
        ddlStateType_onchange();
        $("#divGrid").removeClass("display_none");
        $("#divGridWithDetail").removeClass("display_none");
        $("#btnExecute").removeAttr("disabled");
        $("#divGridDetails").removeClass("disabledDiv");
        $("#divGridDetailsTot").removeClass("disabledDiv"); 
        $("#divGridDetailsTot").removeClass("display_none"); 
        ShowFlag = false;
        if (ddlStateType.value == "1" || ddlStateType.value == "2") {
            $("#btnUpdate").attr("disabled", "disabled");
        } else {
            $("#btnUpdate").removeAttr("disabled");
        }
        txtSearchBox1.value = '';
        $("#divInvoiceDetails").addClass("display_none");
    }
    function btnExecute_onclick() {
        ////debugger
        var ValidDataFlag = 1;
        FilteredModel = Grid.DataSource;
        /////////
        
        for (let i = 0; i < FilteredModel.length; i++) {
            var cash: number = FilteredModel[i].CashAmount;
            var card: number = FilteredModel[i].CardAmount;
            var Remain: number = FilteredModel[i].RemainAmount;
            if (card != 0 || cash != 0) {
                if (Remain != (card + cash)) {
                    //  $("#btnExecute").attr("disabled", "disabled");
                    DisplayMassage('يجب ان يكون المبلغ المطلوب سداده مساوي للسداد النقدي مجموع مع السداد بالكارت للفاتورة رقم   ( ' + FilteredModel[i].TrNo + "  )", '(The amount to be paid must be equal to the total cash payment with the card payment for invoice number)' + FilteredModel[i].TrNo + "  )", MessageType.Error);
                    ValidDataFlag = 0;
                    break;
                }
            }
        }


        ////////////////
        if (ValidDataFlag == 1) {
            UpdatedModel = Grid.DataSource;
            UpdatedModel = UpdatedModel.filter(s => s.CardAmount != 0 || s.CashAmount != 0);
            for (let i = 0; i < UpdatedModel.length; i++) {

                UpdatedModel[i].UpdatedAt = DateTimeFormat(Date().toString());
                UpdatedModel[i].UpdatedBy = SysSession.CurrentEnvironment.UserCode;
                UpdatedModel[i].CashBoxID = Number(ddlCashBox.value);
            }
            if (UpdatedModel.length > 0) {
                Ajax.Callsync({
                    type: "POST",
                    url: sys.apiUrl("SlsTrSales", "UpdateInoviceCashList"),
                    data: JSON.stringify(UpdatedModel),
                    success: (d) => {
                        let result = d as BaseResponse;
                        if (result.IsSuccess == true) {
                            $("#divGridWithDetail").addClass("display_none");

                            DisplayMassage('(تم التنفيذ بنجاح )', '(Successfully executed)', MessageType.Succeed);

                            btnShow_onclick();

                            StatusFlag = false;
                        }
                        else {
                            DisplayMassage('( هناك خطأ )', '(Error)', MessageType.Error);
                        }
                    }
                });
            }
            else {
                DisplayMassage('( لا توجد فواتير مسدده كي يتم التنفيذ )', '(There are no invoices paid to be executed)', MessageType.Error);
            }

        }
    }
    function btnUpdate_onclick() {
        if (!SysSession.CurrentPrivileges.EDIT) return;
        Show = false;
        $("#divGridDetails").addClass("disabledDiv");
        $("#divGridDetailsTot").addClass("disabledDiv");
        $("#btnShow").attr("disabled", "disabled");
        $("#divGridDetails").attr("disabled", "disabled").off('click');//divGridDetailsTot
        $("#divGridDetailsTot").attr("disabled", "disabled").off('click');//
        $("#btnUpdate").addClass("display_none");
        $("#btnBack").removeClass("display_none");
        $("#div_btnPrint").addClass("display_none");  
        $("#btnSave").removeClass("display_none");
        $("#btnExecute").attr("disabled", "disabled");
        var items: number = Number(txtItemCount.value);
        for (let i = 0; i < items; i++) {
            // Controls Grid
            $("#ddlFamily" + i).removeAttr("disabled");
            $("#ddlItem" + i).removeAttr("disabled");
            $("#txtQuantity" + i).removeAttr("disabled");
            $("#txtPrice" + i).removeAttr("disabled");
            //$("#txtTotal" + i).removeAttr("disabled");
            //$("#txtTax" + i).removeAttr("disabled");
            //$("#txtTotAfterTax" + i).removeAttr("disabled");

            $('.btn-number1' + i).removeAttr("disabled");
            $('.input-number1' + i).removeAttr("disabled");

            $('.btn-number2' + i).removeAttr("disabled");
            $('.input-number2' + i).removeAttr("disabled");
            
            $("#btn_minus" + i).removeClass("display_none");
            $("#btn_minus" + i).removeAttr("disabled");
        }
        $("#txtInvoiceDate").removeAttr("disabled");
        $("#ddlInvoiceCustomer").removeAttr("disabled");
        $("#ddlSalesman").removeAttr("disabled");
        $("#chkActive").removeAttr("disabled");

        $("#btnAddDetails").removeClass("display_none");
        
        $("#txtCardInv" ).removeAttr("disabled");
        $("#txtCashInv").removeAttr("disabled");
        $("#txtCommisionInv").removeAttr("disabled");
        txtCommisionInv.disabled = false;
        //open process transaction
        assignSalesInvoceObj();
        Ajax.Callsync({
            type: "Post",
            url: sys.apiUrl("SlsTrSales", "OpenCashInvoices"),
            data: JSON.stringify(InvoiceModel),
            success: (d) => {
                let result = d as BaseResponse;
            }
        });
    }
    function assignSalesInvoceObj() {
        InvoiceModel = new I_Sls_TR_Invoice;
        //InvoiceModel = InvoiceStatisticsModel[0];
        
        InvoiceModel.Status = 0;
        

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
    function SearchBox_Change() {
        if (txtSearchBox1.value != "")
        {
            debugger            
            let search: string = txtSearchBox1.value.toLowerCase();
            SearchDetails = SlsInvoiceStatisticsDetails.filter(x => x.TrNo.toString().search(search) >= 0 || x.CustomerName.toLowerCase().search(search) >= 0 || x.CustomerMobileNo.toLowerCase().search(search) >= 0 || x.Slsm_DescA.toLowerCase().search(search) >= 0 || x.Slsm_DescE.toLowerCase().search(search) >= 0);

            NetTot = 0;
            CommisionTot = 0;
            PaidAmountTot = 0;
            CashTot = 0;
            CardTot = 0;


            for (let i = 0; i < SearchDetails.length; i++)
            {
                NetTot += SearchDetails[i].NetAfterVat;
                CommisionTot += SearchDetails[i].CommitionAmount;
                PaidAmountTot += SearchDetails[i].RemainAmount;
                CashTot += SearchDetails[i].CashAmount;
                CardTot += SearchDetails[i].CardAmount;
            }
            Grid.DataSource = SearchDetails;
            Grid.Bind();
            txtNetTot.value = NetTot.RoundToSt(2).toString();
            txtCommisionTot.value = CommisionTot.RoundToSt(2).toString();
            txtPaidAmountTot.value = PaidAmountTot.RoundToSt(2).toString();
            txtCashTot.value = CashTot.RoundToSt(2).toString();
            txtCardTot.value = CardTot.RoundToSt(2).toString();

            
            
        }
        else
        {   NetTot = 0;
            CommisionTot = 0;
            PaidAmountTot = 0;
            CashTot = 0;
            CardTot = 0;
            for (let i = 0; i < SlsInvoiceStatisticsDetails.length; i++)
            {NetTot += SlsInvoiceStatisticsDetails[i].NetAfterVat;
                CommisionTot += SlsInvoiceStatisticsDetails[i].CommitionAmount;
                PaidAmountTot += SlsInvoiceStatisticsDetails[i].RemainAmount;
                CashTot += SlsInvoiceStatisticsDetails[i].CashAmount;
                CardTot += SlsInvoiceStatisticsDetails[i].CardAmount;}
            txtNetTot.value = NetTot.RoundToSt(2).toString();
            txtPaidAmountTot.value = PaidAmountTot.RoundToSt(2).toString();
            txtCashTot.value = CashTot.RoundToSt(2).toString();
            txtCardTot.value = CardTot.RoundToSt(2).toString();         
            Grid.DataSource = SlsInvoiceStatisticsDetails;
            Grid.Bind();
        }
    }
    function ddlStateType_onchange() {
        var status = Number(ddlStateType.value);
        if (status == 1 || status==2) {
            $("#btnExecute").attr("disabled", "disabled");
        } else {
            $("#btnExecute").removeAttr("disabled");
        }
    }
    function clear() {
        $('#div_Data').html("");
    }
    function BuildControls(cnt: number) {
        var html;
        //////////debugger;
        html = '<div id= "No_Row' + cnt + '" class="container-fluid style_border" > <span id = "btn_minus' + cnt + '" class="fa fa-minus-circle fontitm3 display_none" > </span> <div class="row"> <div class="col-lg-12" > ' +         

            '<input id="InvoiceItemID' + cnt + '" type="hidden" class="form-control right2 display_none"  />' +

            '<div class="col-lg-2">' +
            '<select id="ddlFamily' + cnt + '" class="form-control"><option>النوع</option></select></div>' +

            '<div class="col-lg-2">' +
            '<select id="ddlItem' + cnt + '" class="form-control"><option>الصنف</option></select></div>' +

            '<div class=" col-lg-2"><div class="input-group " ><span class="input-group-btn"><button type="button" style="background-color: #4CAF50; "   class="btnplasandmines btn-default btn-number1' + cnt + '"  id="btnminus1" data-type="minus" data-field="quant[1]"><span class="glyphicon glyphicon-minus"></span></button></span><input type="text"   style="height:36px;" id="txtQuantity' + cnt + '" name="quant[1]" class="form-control   font1" value="1" min="1" max="1000" step="1"><span class="input-group-btn"><button type="button" style="background-color: #f44336;" id="btnplus1"   class="btnplasandmines btn-default btn-number1' + cnt + '" data-type="plus" data-field="quant[1]"><span class="glyphicon glyphicon-plus"></span></button></span></div></div>' +
            '<div class=" col-lg-2"><div class="input-group " ><span class="input-group-btn"><button type="button" style="background-color: #4CAF50; "   class="btnplasandmines btn-default btn-number2' + cnt + '"  id="btnminus2" data-type="minus" data-field="quant[2]"><span class="glyphicon glyphicon-minus"></span></button></span><input type="text"   style="height:36px;" id="txtPrice' + cnt + '" name="quant[2]" class="form-control   font1" value="1" min="0" max="1000" step="0.5"><span class="input-group-btn"><button type="button" style="background-color: #f44336;" id="btnplus2' + cnt + '"   class="btnplasandmines btn-default btn-number2' + cnt + '" data-type="plus" data-field="quant[2]"><span class="glyphicon glyphicon-plus"></span></button></span></div></div>' +

            '<div class="col-lg-1">' +
            '<input id="txtTotal' + cnt + '" type="text" class="form-control right2" disabled /></div>' +

            '<div class="col-lg-1">' +
            '<input id="txtTax' + cnt + '" type="text" class="form-control right2" disabled /></div>' +

            '<div class="col-lg-2">' +
            '<input id="txtTotAfterTax' + cnt + '" type="text" class="form-control right2" disabled /></div>' +
            '</div></div></div>' +

            '<input id="txt_StatusFlag' + cnt + '" name = " " type = "hidden" class="form-control"/><input id="txt_ID' + cnt + '" name = " " type = "hidden" class="form-control" />';
        $("#div_Data").append(html);

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
       
        //fill dropdownlist
        for (var i = 0; i < FamilyDetails.length; i++) {
            $('#ddlFamily' + cnt).append('<option value="' + FamilyDetails[i].ItemFamilyID + '">' + (lang == "ar" ? FamilyDetails[i].DescA : FamilyDetails[i].DescL) + '</option>');
        }
        //FillddlItem
        var drop = '#ddlFamily' + cnt;
        $(drop).change(function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");

            var selectedFamily = $(drop + ' option:selected').attr('value');
            FillddlItem(Number(selectedFamily), storeID);
            $('#ddlItem' + cnt).empty();
            $('#ddlItem' + cnt).append('<option value="' + null + '">' + (lang == "ar" ? "اختر الصنف" : "Choose item" )  + '</option>');
            for (var i = 0; i < ItemDetails.length; i++) {
                //$('#ddlItem' + cnt).append('<option value="' + ItemDetails[i].ItemID + '">' + ItemDetails[i].Itm_DescA + '</option>');
                $('#ddlItem' + cnt).append('<option data-MinUnitPrice="' + ItemDetails[i].MinUnitPrice + '" data-OnhandQty="' + ItemDetails[i].OnhandQty + '" value="' + ItemDetails[i].ItemID + '">' + (lang == "ar" ? ItemDetails[i].Itm_DescA : ItemDetails[i].Itm_DescE) + '</option>');
            }
            ComputeTotals();
        });

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
                    //
                    var itemPrice = NumberSelect[0].UnitPrice;
                    $("#txtPrice" + cnt).val(itemPrice);

                    var txtQuantityValue = $("#txtQuantity" + cnt).val();
                    var txtPriceValue = $("#txtPrice" + cnt).val();
                    if ($("#txtPrice" + cnt).val() == 0) {
                        var total = Number(txtQuantityValue) * 1;
                        $("#txtTotal" + cnt).val(total);
                        var vatAmount = Number(total) * VatPrc / 100;
                        $("#txtTax" + cnt).val(vatAmount.RoundToSt(2));
                        var totalAfterVat = Number(vatAmount) + Number(total);
                        $("#txtTotAfterTax" + cnt).val(totalAfterVat);
                    } else {
                        var total = Number(txtQuantityValue) * Number(txtPriceValue);
                        $("#txtTotal" + cnt).val(total);
                        var vatAmount = Number(total) * VatPrc / 100;
                        $("#txtTax" + cnt).val(vatAmount.RoundToSt(2));
                        var totalAfterVat = Number(vatAmount) + Number(total);
                        $("#txtTotAfterTax" + cnt).val(totalAfterVat);
                    }
                }
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

            let Onhand_Qty = Number($('option:selected', $("#ddlItem" + cnt)).attr('data-OnhandQty'))
            if (txtQuantityValue < Onhand_Qty) { }
            else {
                DisplayMassage("خطأ الكميه المتاحه (" + Onhand_Qty + ")!", "Error quantity available! (" + Onhand_Qty + ")", MessageType.Error);
                $("#txtQuantity" + cnt).val(Onhand_Qty);
                txtQuantityValue = Onhand_Qty;
            }

            if ($("#txtPrice" + cnt).val() == 0) {  total = Number(txtQuantityValue) * 1; }
            else { total = Number(txtQuantityValue) * Number(txtPriceValue);}

            $("#txtTotal" + cnt).val(total);
            var vatAmount = Number(total) * VatPrc / 100;
            $("#txtTax" + cnt).val(vatAmount.RoundToSt(2));
            var totalAfterVat = Number(vatAmount) + Number(total);
            $("#txtTotAfterTax" + cnt).val(totalAfterVat);
            ComputeTotals();



        });


        $("#txtQuantity" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");

            var txtQuantityValue = $("#txtQuantity" + cnt).val();
            var txtPriceValue = $("#txtPrice" + cnt).val();
            var total = 0;

            let Onhand_Qty = Number($('option:selected', $("#ddlItem" + cnt)).attr('data-OnhandQty'))
            if (txtQuantityValue < Onhand_Qty) { }
            else {
                DisplayMassage("خطأ الكميه المتاحه (" + Onhand_Qty + ")!", "Error quantity available! (" + Onhand_Qty + ")", MessageType.Error);

                $("#txtQuantity" + cnt).val(Onhand_Qty);
                txtQuantityValue = Onhand_Qty;
            }

            if ($("#txtPrice" + cnt).val() == 0) { total = Number(txtQuantityValue) * 1; }
            else { total = Number(txtQuantityValue) * Number(txtPriceValue); }

            $("#txtTotal" + cnt).val(total);
            var vatAmount = Number(total) * VatPrc / 100;
            $("#txtTax" + cnt).val(vatAmount.RoundToSt(2));
            var totalAfterVat = Number(vatAmount) + Number(total);
            $("#txtTotAfterTax" + cnt).val(totalAfterVat);
            ComputeTotals();


        });
        $("#txtPrice" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");

            var txtQuantityValue = $("#txtQuantity" + cnt).val();
            var txtPriceValue = $("#txtPrice" + cnt).val();

            if ($("#txtQuantity" + cnt).val() == 0) {
                var total = 1 * Number(txtPriceValue);
                $("#txtTotal" + cnt).val(total);
                var vatAmount = Number(total) * VatPrc / 100;
                $("#txtTax" + cnt).val(vatAmount.RoundToSt(2));

                var totalAfterVat = Number(vatAmount) + Number(total);
                $("#txtTotAfterTax" + cnt).val(totalAfterVat);

                ComputeTotals();
                //txtTotal.value = (CountTotal + total).RoundToSt(2).toString();
                //CountTotal = Number((CountTotal + total).RoundToSt(2).toString());

                //txtNet.value = (NetCount + totalAfterVat).RoundToSt(2).toString();
                //NetCount = Number((NetCount + totalAfterVat).RoundToSt(2).toString());

                //txtTax.value = (TaxCount + vatAmount).RoundToSt(2).toString();
                //TaxCount = Number((TaxCount + vatAmount).RoundToSt(2).toString());

            } else {
                var total = 1 * Number(txtPriceValue);
                var vatAmount = Number(total) * VatPrc / 100;
                $("#txtTax" + cnt).val(vatAmount.RoundToSt(2));
                var total = Number(txtQuantityValue) * Number(txtPriceValue);
                $("#txtTotal" + cnt).val(total);

                var totalAfterVat = Number(vatAmount) + Number(total);
                $("#txtTotAfterTax" + cnt).val(totalAfterVat);

                ComputeTotals();
            }
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

        if (Show == true) {
            // disabled
            $("#ddlFamily" + cnt).attr("disabled", "disabled");
            $("#ddlItem" + cnt).attr("disabled", "disabled");
            $("#txtQuantity" + cnt).attr("disabled", "disabled");
            $("#txtPrice" + cnt).attr("disabled", "disabled");
            //$("#txtReturnQuantity" + cnt).attr("disabled", "disabled");
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

         

            $("#txt_StatusFlag" + cnt).val("");

            for (var i = 0; i < FamilyDetails.length; i++) {
                $('#ddlFamily' + cnt).append('<option value="' + FamilyDetails[i].ItemFamilyID + '">' + FamilyDetails[i].DescA + '</option>');
            }

            var FamilyID: number = Number(SlsInvoiceItemsDetails[cnt].ItemFamilyID);
         
            $("#ddlFamily" + cnt).prop("value", FamilyID);

            FillddlItem(FamilyID, storeID);

           
            for (var i = 0; i < ItemDetails.length; i++) {
           
                $('#ddlItem' + cnt).append('<option data-MinUnitPrice="' + ItemDetails[i].MinUnitPrice + '" data-OnhandQty="' + ItemDetails[i].OnhandQty + '" value="' + ItemDetails[i].ItemID + '">' + ItemDetails[i].Itm_DescA + '</option>');
            }

            var itemcode = SlsInvoiceItemsDetails[cnt].ItemID;
            $("#ddlItem" + cnt).prop("value", itemcode.toString());

            var SoldQty = SlsInvoiceItemsDetails[cnt].SoldQty;
            $("#txtQuantity" + cnt).prop("value", SoldQty);

            var price = SlsInvoiceItemsDetails[cnt].NetUnitPrice;
            $("#txtPrice" + cnt).prop("value", price);

            
            var itemTotal = SlsInvoiceItemsDetails[cnt].ItemTotal;
            $("#txtTotal" + cnt).prop("value", itemTotal);

            var tax = SlsInvoiceItemsDetails[cnt].VatAmount;
            $("#txtTax" + cnt).prop("value", tax);

            var Net = SlsInvoiceItemsDetails[cnt].NetAfterVat;
            $("#txtTotAfterTax" + cnt).prop("value", Net);

            var InvoiceItemID = SlsInvoiceItemsDetails[cnt].InvoiceItemID;
            $("#InvoiceItemID" + cnt).prop("value", InvoiceItemID);


        }
        $("#btn_minus" + cnt).click(function (e) {
         
            DeleteRow(cnt);
        });
        return;
    }
    function checkRepeatedItems(itemValue: number, familyValue: number, NumberRowid: number) {
        var items: number = Number(txtItemCount.value);
        var flag = false;
        for (let i = 0; i < items-1 ; i++) {
            if (Number($("#ddlItem" + i).val()) == itemValue && Number($("#ddlFamily" + i).val()) == familyValue && Number($("#InvoiceItemID" + i).val()) != NumberRowid) {// $("#No_Row" + cnt).val();
                flag = true;
            }
        }
        return flag;
    }
     
    function GetAllIItem() {
        //debugger;
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("StkDefItems", "GetAllItemWithoutOnhandQty"),
            data: {
                CompCode: compcode, FinYear: Finyear, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
               
                let result = d as BaseResponse;
                if (result.IsSuccess) {

                    ItemDetailsStoreInfo = result.Response as Array<IQ_GetItemStoreInfo>;
                }
            }
        });
    }
    function FillddlItem(ItemFamilyID: number, StoreId: number) {
        ItemDetails = ItemDetailsStoreInfo.filter(x => x.ItemFamilyID == ItemFamilyID && x.StoreId == StoreId);
        }
    function DeleteRow(RecNo: number) {
        if (!SysSession.CurrentPrivileges.Remove) return;
        WorningMessage("هل تريد الحذف؟", "Do you want to delete?", "تحذير", "worning", () => {
            $("#txt_StatusFlag" + RecNo).val() == 'i' ? $("#txt_StatusFlag" + RecNo).val('') : $("#txt_StatusFlag" + RecNo).val('d'); 
            CountItems = Number( CountItems )- 1;
            
            ComputeTotals();
            txtCommisionInv_onchange();
            txtItemCount.value = CountItems.toString();

            $("#ddlFamily" + RecNo).val("99");
            $("#ddlItem" + RecNo).val("99");
            $("#txtQuantity" + RecNo).val("1");
            $("#txtPrice" + RecNo).val("1");
            $("#No_Row" + RecNo).attr("hidden", "true");
          
        });
    }
    function ComputeTotals() {
        
        PackageCount = 0;
        CountTotal = 0;
        TaxCount = 0;
        NetCount = 0;

        for (let i = 0; i < CountGrid; i++) {
            var flagvalue = $("#txt_StatusFlag" + i).val();
            if (flagvalue != "d")
            {
                PackageCount += Number($("#txtQuantity" + i).val());
                PackageCount = PackageCount;

                CountTotal += Number($("#txtTotal" + i).val());
                CountTotal = Number(CountTotal.RoundToSt(2).toString());

                TaxCount += Number($("#txtTax" + i).val());
                TaxCount = Number(TaxCount.RoundToSt(2).toString());

                NetCount += Number($("#txtTotAfterTax" + i).val());
                NetCount = Number(NetCount.RoundToSt(2).toString());
            }
        }
        
        txtPackageCount.value = PackageCount.toString();
        txtTotal.value = CountTotal.toString();
        txtTax.value = TaxCount.toString();
        txtNetInv.value = NetCount.toString();
        txtItemCount.value = CountItems.toString();
      
        txtCardInv.value = CardInv.toString();
        txtCashInv.value = CashInv.toString();
        txtPaidAmountInv.value = PaidAmountInv.toString();
        txtCommisionInv_onchange();
   
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
    function FillddlFamily() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("StkDefItemType", "GetAll"),
            data: {
                CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                //////////debugger;
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    FamilyDetails = result.Response as Array<I_ItemFamily>;
                }
            }
        });
    }
    function AddNewRow() {
        //$("#DivShow").removeClass("display_none");
        ////////debugger
        if (!SysSession.CurrentPrivileges.AddNew) return;
        var CanAdd: boolean = true;
        if (CountGrid > 0) {
            var LastRowNo = CountGrid - 1;
            CanAdd = Validation_Grid(LastRowNo);
        }
        if (CanAdd) {
            CountItems =Number( CountItems) + 1;
            txtItemCount.value = CountItems.toString();
            //  var length: number = SlsInvoiceItemsDetails.length;
            BuildControls(CountGrid);
            $("#txt_StatusFlag" + CountGrid).val("i"); //In Insert mode

            $("#ddlFamily" + CountGrid).removeAttr("disabled");
            $("#ddlItem" + CountGrid).removeAttr("disabled");
            $("#txtQuantity" + CountGrid).removeAttr("disabled");
            $("#txtPrice" + CountGrid).removeAttr("disabled");
            // $("#txtTax" + CountGrid).removeAttr("disabled");
            // $("#txtTotAfterTax" + CountGrid).removeAttr("disabled");

            // can delete new inserted record  without need for delete privilage
            $("#btn_minus" + CountGrid).removeClass("display_none");
            $("#btn_minus" + CountGrid).removeAttr("disabled");
            //$("#ddlFamily" + CountGrid).select2();
            //$("#ddlItem" + CountGrid).select2();
            //var username = $('#ddlFamily' + CountGrid + 'option:selected').text();
            //var userid = $('#ddlFamily' + CountGrid).val();
            //var username = $('#ddlItem' + CountGrid + 'option:selected').text();
            //var userid = $('#ddlItem' + CountGrid).val();

          //  $('#result').html("id : " + userid + ", name : " + username);
            CountGrid++;
        }
    }
    function btnBack_onclick() {
        Grid_RowDoubleClicked();
        $("#btnExecute").removeAttr("disabled");
        $("#btnUpdate").removeClass("display_none");
        $("#div_btnPrint").removeClass("display_none");
        $("#btnBack").addClass("display_none");
        $("#btnSave").addClass("display_none");
        $("#divGridDetails").removeAttr("disabled").off('click');
        $("#divGridDetails").removeClass("disabledDiv");
        $("#divGridDetailsTot").removeAttr("disabled").off('click');
        $("#divGridDetailsTot").removeClass("disabledDiv");
        $("#txtCardInv").attr("disabled", "disabled");
        $("#txtCashInv").attr("disabled", "disabled");
        $("#txtCommisionInv").attr("disabled", "disabled");
        $("#btnShow").removeAttr("disabled");
        txtCommisionInv.disabled = true;
    }
    function btnSave_onclick() {
        loading('btnsave');

        setTimeout(function () {

            finishSave('btnsave');

        if (!SysSession.CurrentPrivileges.EDIT) return;
        
        if (Number(txtCardInv.value) != 0 || Number(txtCashInv.value) != 0) {
            if (!cashOrCredit_onchange())   return;         
        } 

    
            Validation_Insert = 0;
            Assign();
            MasterDetailsModel.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
            MasterDetailsModel.UserCode = SysSession.CurrentEnvironment.UserCode;
            InvoiceModel.UpdatedBy = SysSession.CurrentEnvironment.UserCode;
            InvoiceModel.UpdatedAt = DateTimeFormat(Date().toString());
        InvoiceModel.VatType = vatType;

        InvoiceModel.Status = 1;
        InvoiceModel.CashAmount = Number(txtCashInv.value);
        InvoiceModel.CardAmount = Number(txtCardInv.value);
        var tot = Number(txtCashInv.value) + Number(txtCardInv.value);
        var comm = Number(txtCommisionInv.value);
        var remain = Number(txtPaidAmountInv.value) - (tot - comm);
        InvoiceModel.RemainAmount = remain;
            InvoiceModel.VatAmount = Number(txtTax.value);
            InvoiceModel.CommitionAmount = Number(txtCommisionInv.value);
            if (InvoiceModel.CardAmount + InvoiceModel.CashAmount > 0 )
                InvoiceModel.CashBoxID = Number(ddlCashBox.value);
            //$('#btnPrint').removeClass("display_none");
            //$('#btnPrntPrice').removeClass("display_none");

            if (Validation_Insert == 1) { Open_poup_Pass(); }
            else {
                Update();
                $('#condtionbtn1').removeClass("col-lg-10");
                $('#condtionbtn1').addClass("col-lg-8");
                $('#condtionbtn2').removeClass("col-lg-2");
                $('#condtionbtn2').addClass("col-lg-4");

                $("#btnExecute").removeAttr("disabled");
                $("#btnShow").removeAttr("disabled");
            }  
        }, 100);
    }
    function Assign()
    {
        MasterDetailsModel = new SlsInvoiceMasterDetails();
        InvoiceModel = new I_Sls_TR_Invoice();
        InvoiceItemsDetailsModel = new Array<I_Sls_TR_InvoiceItems>();
        List_MinUnitPrice = new Array<I_Sls_TR_InvoiceItems>();

        var StatusFlag: String;
        //InvoiceModel = InvoiceStatisticsModel[0];
        InvoiceModel.NetAfterVat = NetCount;
        InvoiceModel.TotalAmount = Number(txtTotal.value);
       InvoiceModel.Status = 1;
        // Details
        for (var i = 0; i < CountGrid; i++) {
            invoiceItemSingleModel = new I_Sls_TR_InvoiceItems();
            StatusFlag = $("#txt_StatusFlag" + i).val();
            $("#txt_StatusFlag" + i).val("");

            invoiceItemSingleModel.Name_Item = $("#ddlItem" + i + " option:selected").text();
            invoiceItemSingleModel.MinUnitPrice = Number($('option:selected', $("#ddlItem" + i)).attr('data-MinUnitPrice'));

            if (Number($("#txtPrice" + i).val()) < Number($('option:selected', $("#ddlItem" + i)).attr('data-MinUnitPrice')))
            {
                List_MinUnitPrice.push(invoiceItemSingleModel);
                Validation_Insert = 1;
            }

            if (StatusFlag == "i") {
                invoiceItemSingleModel.InvoiceItemID = 0;
                invoiceItemSingleModel.ItemID = $("#ddlItem" + i).val();
                invoiceItemSingleModel.SoldQty = $('#txtQuantity' + i).val();
                invoiceItemSingleModel.StockSoldQty = $('#txtQuantity' + i).val();//
                invoiceItemSingleModel.NetUnitPrice = $("#txtPrice" + i).val();
                invoiceItemSingleModel.Unitprice = $("#txtPrice" + i).val();
                invoiceItemSingleModel.VatPrc = VatPrc;//$("#txtTax" + i).val();
                invoiceItemSingleModel.VatAmount = $("#txtTax" + i).val();
                invoiceItemSingleModel.ItemTotal = invoiceItemSingleModel.Unitprice * invoiceItemSingleModel.SoldQty;
                invoiceItemSingleModel.StatusFlag = StatusFlag.toString();
                InvoiceItemsDetailsModel.push(invoiceItemSingleModel);
            }
            if (StatusFlag == "u") {
                var invoiceItemId = $("#InvoiceItemID" + i).val();
                invoiceItemSingleModel.InvoiceItemID = invoiceItemId;
                invoiceItemSingleModel.ItemID = $("#ddlItem" + i).val();
                invoiceItemSingleModel.StatusFlag = StatusFlag.toString();
                invoiceItemSingleModel.ItemID = $("#ddlItem" + i).val();
                invoiceItemSingleModel.SoldQty = $('#txtQuantity' + i).val();
                invoiceItemSingleModel.StockSoldQty = $('#txtQuantity' + i).val();//
                invoiceItemSingleModel.NetUnitPrice = $("#txtPrice" + i).val();
                invoiceItemSingleModel.Unitprice = $("#txtPrice" + i).val();
                invoiceItemSingleModel.VatPrc = VatPrc;// $("#txtTax" + i).val();
                invoiceItemSingleModel.ItemTotal = invoiceItemSingleModel.Unitprice * invoiceItemSingleModel.SoldQty;
                invoiceItemSingleModel.VatAmount = invoiceItemSingleModel.ItemTotal * invoiceItemSingleModel.VatPrc / 100;
                invoiceItemSingleModel.NetAfterVat = invoiceItemSingleModel.ItemTotal + invoiceItemSingleModel.VatAmount;
                InvoiceItemsDetailsModel.push(invoiceItemSingleModel);
            }
            if (StatusFlag == "d") {
                if ($("#InvoiceItemID" + i).val() != "")
                {
                    var deletedID = $("#InvoiceItemID" + i).val();
                    invoiceItemSingleModel.StatusFlag = StatusFlag.toString();
                    invoiceItemSingleModel.InvoiceItemID = deletedID;
                    InvoiceItemsDetailsModel.push(invoiceItemSingleModel);
                }
            }
         

        }
        MasterDetailsModel.I_Sls_TR_Invoice = InvoiceModel;
        MasterDetailsModel.I_Sls_TR_InvoiceItems = InvoiceItemsDetailsModel;
    }
    function Update() {
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("SlsTrSales", "updateInvoiceMasterDetail"),
            data: JSON.stringify(MasterDetailsModel),
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess == true) {
                    let res = result.Response as I_Sls_TR_Invoice;
                    DisplayMassage('( تم تعديل الفاتورة بنجاح )', '(The invoice has been successfully modified)', MessageType.Succeed);

                   
                    $('#divCreationPanel').removeClass("display_none");
                    $('#txtUpdatedBy').prop("value", res.UpdatedBy);
                    $('#txtUpdatedAt').prop("value", res.UpdatedAt);

                    $("#btnSave").addClass("display_none");
                    $("#btnBack").addClass("display_none");
                    $("#btnAddDetails").addClass("display_none");
                    //$("#btnUpdate").removeClass("display_none");
                    //$("#div_btnPrint").removeClass("display_none");
                    $("#divGridDetails").removeClass("disabledDiv"); 
                    $("#divGridDetailsTot").removeClass("disabledDiv"); 
                    //$("#General_Div").attr("disabled", "disabled").off('click');
                    //$("#General_Div").addClass("disabledDiv");
                    BindStatisticGridData();
                    $("#btnUpdate").addClass("display_none");//
                    $("#div_btnPrint").addClass("display_none");//
                    $("#divInvoiceDetails").addClass("display_none");
                } else {
                    //$("#btnAdd").removeClass("display_none");
                    DisplayMassage('( هناك خطـأ )', '(Error)', MessageType.Error);
                }
            }
        });
        
        // diable grid controls
        for (let i = 0; i < CountGrid; i++) {
            $("#ddlFamily" + i).attr("disabled", "disabled");
            $("#ddlItem" + i).attr("disabled", "disabled");
            $("#txtQuantity" + i).attr("disabled", "disabled");
            $("#txtPrice" + i).attr("disabled", "disabled");
            $("#txtTotal" + i).attr("disabled", "disabled");
            $("#txtTax" + i).attr("disabled", "disabled");
            $("#txtTotAfterTax" + i).attr("disabled", "disabled");


            $('.btn-number1' + i).attr("disabled", "disabled");
            $('.input-number1' + i).attr("disabled", "disabled");

            $('.btn-number2' + i).attr("disabled", "disabled");
            $('.input-number2' + i).attr("disabled", "disabled");

            $('.btn-number3' + i).attr("disabled", "disabled");
            $('.input-number3' + i).attr("disabled", "disabled");

            $("#btnAddDetails").addClass("display_none");

            $("#btn_minus" + i).addClass("display_none");
            $("#btn_minus" + i).attr("disabled", "disabled");
        }
    }
    function Validation_Grid(rowcount: number) {
        var Qty = Number($("#txtQuantity" + rowcount).val());
        var Price = Number($("#txtPrice" + rowcount).val()); 
        var newCount: number = 0;
        for (let i = 0; i < CountGrid; i++) {
            if ($("#txt_StatusFlag" + i).val() != "d" && $("#txt_StatusFlag" + i).val() != "") {
                newCount++;
            }
        }
        if ($("#txt_StatusFlag" + rowcount).val() == "d" || $("#txt_StatusFlag" + rowcount).val() == "") {
            return true;
        } else {
            if ($("#ddlFamily" + rowcount).val() == "null" ||$("#ddlFamily" + rowcount).val() == "") {
                DisplayMassage(" برجاء اختيار النوع", "Please select type", MessageType.Error);
                Errorinput($("#ddlFamily" + rowcount));
                return false
            }
            else if ($("#ddlItem" + rowcount).val() == "null" ||$("#ddlItem" + rowcount).val() == null) {
                DisplayMassage(" برجاء اختيار الصنف", "Please select item", MessageType.Error);
                Errorinput($("#ddlItem" + rowcount));
                return false
            }
            else if (Qty==0) {
                DisplayMassage(" برجاءادخال الكمية المباعة", "Please enter the quantity sold", MessageType.Error);
                Errorinput($("#txtQuantity" + rowcount));
                return false
            }
            else if (Price==0) {
                DisplayMassage(" برجاءادخال السعر ", "Please enter the price ", MessageType.Error);
                Errorinput($("#txtPrice" + rowcount));
                return false
            }
            else if (newCount == 0) {
                DisplayMassage(" برجاءادخال اصناف علي الفاتورة ", "Please enter items on the invoice ", MessageType.Error);
                return false
            }
            return true;
        }
    }
    function cashOrCredit_onchange() :boolean {
        var cash: number = Number(txtCashInv.value);
        var card: number = Number(txtCardInv.value);
        var Remain: number = Number(txtPaidAmountInv.value);

        if (Remain != (card + cash)) {
  
            DisplayMassage('( يجب ان يكون المبلغ المطلوب سداده مساوي للسداد النقدي مجموع مع السداد بالكارت )', '(The amount to be paid must be equal to the total cash payment with card payment)', MessageType.Error);
            return false;
        }
        return true
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
        //////debugger;

        if (txt_ApprovePass.value == SysSession.CurrentEnvironment.I_Control[0].ExceedMinPricePassword) {
            Update();
            $('#condtionbtn1').removeClass("col-lg-10");
            $('#condtionbtn1').addClass("col-lg-8");
            $('#condtionbtn2').removeClass("col-lg-2");
            $('#condtionbtn2').addClass("col-lg-4");
            $("#btnExecute").removeAttr("disabled");
        }
        else {
            
            DisplayMassage(" لايمكن اعتماد الفاتورة", "The invoice cannot be approved", MessageType.Error);
            
            txt_ApprovePass.value = "";

        }
    }
    function btn_Exit_Approveprice_onclick() {



        $('#popu_Passowrd').attr('style', 'display:none;');
        $('#popu_Passowrd').attr('class', 'popu animated zoomOut');
        txt_ApprovePass.value = "";
        $("#Popup_Passowrd").modal("hide");
        Validation_Insert = 0;


    }
    function PrintReport(OutType: number) {
    

        ////debugger

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
        rp.RepType = OutType;
        rp.TrType = 0;
        rp.FromDate = DateFormatRep(txtDate.value);
        rp.ToDate = DateFormatRep(txtDate.value);
                  
        if (ddlCustomer.value == "null") { rp.CustomerID = -1;}
        else { rp.CustomerID = Number($("#ddlCustomer").val());}


        if (ddlSalesman.value == "null") { rp.SalesmanID = -1;}    
        else { rp.SalesmanID = Number($("#ddlSalesman").val());}
         

        rp.PaymentType = Number( ddlStateType.value);
        
        if (ddlStateType.value == "1" || ddlStateType.value == "2")//مسدد
        {
            if (ddlCashBox.value == "null") {
                rp.CashBoxID = -1;
            } else {
                rp.CashBoxID = Number(ddlCashBox.value);
            }
        }
        else    //غير مسدد
        {
            rp.CashBoxID = -1;
        }
        rp.MobileNo ="-1";
        rp.Status = 2;
     
        Ajax.Callsync({
            url: Url.Action("IProc_Rpt_AccSlsCashInvoiceList", "GeneralReports"),
            data: rp,
            success: (d) => {

                let result = d.result as string;


                window.open(result);
                // window.close(result)
            }
        })



    }

    function btnPrintTransaction_onclick() {
        if (!SysSession.CurrentPrivileges.PrintOut) return;
        let rp: ReportParameters = new ReportParameters();
        
        rp.Type = 0;
        rp.slip =0;
        rp.Repdesign = 0;
        rp.TRId = invoiceID;
                              
            rp.Name_function = "IProc_Prnt_SlsInvoice";
            localStorage.setItem("Report_Data", JSON.stringify(rp));

            localStorage.setItem("result", '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>');
             window.open(Url.Action("ReportsPopup", "Home"), "_blank");
    }
    function btnPrintslip_onclick() {
        if (!SysSession.CurrentPrivileges.PrintOut) return;
        //debugger;
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
        rp.slip = 1;
        rp.TRId = invoiceID;

        Ajax.CallAsync({
            url: Url.Action("IProc_Prnt_SlsInvoice", "GeneralReports"),
            data: rp,
            success: (d) => {
                let result = d.result as string;
                window.open(result, "_blank");
            }
        })

    }
    
}









