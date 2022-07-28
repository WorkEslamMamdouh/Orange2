$(document).ready(() => {
    ServPurInvoice.InitializeComponent();
})
namespace ServPurInvoice {//----------------- from 1-9 12:00 Pm
    //************system variables
    var SysSession: SystemSession = GetSystemSession(Modules.Ser_Purchasing);
    var compcode: number;
    var BranchCode: number;
    var isNew: boolean = false;
    var showFlag: boolean = false;
    var EditModeFlag: boolean = false;
    var sys: SystemTools = new SystemTools();
    var VatPrc;
    //****controls
    var btnAdd: HTMLButtonElement;
    var btnShow: HTMLButtonElement;
    var btnSave: HTMLButtonElement;
    var btnBack: HTMLButtonElement;
    var btnAddHeaderControls: HTMLButtonElement;
    var btnAddChildControls: HTMLButtonElement;
    var btnUpdate: HTMLButtonElement;

    var drpSrchStatus: HTMLSelectElement;
    var drpImportInvoiceFilter: HTMLSelectElement;
    //var chk_ImportInvoice: HTMLInputElement;
    var chkClosed: HTMLInputElement;
    var chk_ImportInvoiceDetail: HTMLInputElement;
    var hd_InvoiceId: HTMLInputElement;
    var txtPerson: HTMLInputElement;
    var txtSearch: HTMLInputElement;
    //------------------------------------- Arrays
    var MasterGrid: JsGrid = new JsGrid();
    var Selected_Data: Array<AVAT_TR_PurInvoice> = new Array<AVAT_TR_PurInvoice>();
    var searchDetails: Array<AVAT_TR_PurInvoice> = new Array<AVAT_TR_PurInvoice>();
    var AQ_ServPurInvoiceMasterDetailModel: Array<AVAT_TR_PurInvoice> = new Array<AVAT_TR_PurInvoice>();
    var ParentHeaderDetails: Array<AVAT_TR_PurInvoice> = new Array<AVAT_TR_PurInvoice>();
    var PurInvoiceDetail: Array<AQVAT_GetPurInvoiceDetail> = new Array<AQVAT_GetPurInvoiceDetail>();
    var List_Status: Array<string> = new Array<string>();
    var List_StatusEn: Array<string> = new Array<string>();
    var GetPurInvoiceDet: AQ_ServPurInvoiceMasterDetail = new AQ_ServPurInvoiceMasterDetail();
    var Menu: AVAT_TR_PurInvoice = new AVAT_TR_PurInvoice();
    var ModelPurInvoiceHeader: Array<AQVAT_GetPurInvoiceHeader> = new Array<AQVAT_GetPurInvoiceHeader>();
    var ModelPurInvoiceDetail: Array<AQVAT_GetPurInvoiceDetail> = new Array<AQVAT_GetPurInvoiceDetail>();
    var SalesmanDetails: Array<I_Sls_D_Salesman> = new Array<I_Sls_D_Salesman>();
    var VendorDetail: A_Pay_D_Vendor = new A_Pay_D_Vendor();
    var VendorDetailList: Array<A_Pay_D_Vendor> = new Array<A_Pay_D_Vendor>();
    var AccountDetails: A_ACCOUNT = new A_ACCOUNT();
    var StatesFilterDetailsAr: Array<string> = new Array<string>();
    var StatesFilterDetailsEn: Array<string> = new Array<string>();
    var ServicesDetails: Array<AQVAT_GetService> = new Array<AQVAT_GetService>();
    var CategorDetails: Array<AVAT_D_SrvCategory> = new Array<AVAT_D_SrvCategory>();
    var DetailsVatNature: Array<G_VatNature> = new Array<G_VatNature>();
    var Tax_Type_Model: Tax_Type = new Tax_Type();
    var CostCentreDetailsIst: Array<G_COST_CENTER> = new Array<G_COST_CENTER>();
    var CostCenterDetails: G_COST_CENTER = new G_COST_CENTER();
    var HeaderWithDetailModel: AQ_ServPurInvoiceMasterDetail = new AQ_ServPurInvoiceMasterDetail();

    var InvHeaderAssign: Array<AVAT_TR_PurInvoiceHeader> = new Array<AVAT_TR_PurInvoiceHeader>();
    var InvHeaderAssignSingle: AVAT_TR_PurInvoiceHeader = new AVAT_TR_PurInvoiceHeader();
    // var DetailList: Array<AVAT_TR_PurInvoiceDetail> = new Array<AVAT_TR_PurInvoiceDetail>();
    var InvDetailAssignSingle: AVAT_TR_PurInvoiceDetail = new AVAT_TR_PurInvoiceDetail();

    var MasterDetailModel: ServPurchseInvoiceMasterDetail = new ServPurchseInvoiceMasterDetail();

    // ------------- global Variables
    var CountGrid1: number = 0;
    var CountGrid2: number = 0;
    var GlobalVendorNum: number = 0;//رقم الفاتورة المختارة 
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);
    var Tax_Rate = 0;
    var vatType: number;
    var GlobalMenuID: number;
    var FlagAfterInsertOrUpdate: boolean = false;
    //****************************New****************************************//
    var CurrentVendorSerial = 0;
    var DetailList: Array<AVAT_TR_PurInvoiceDetail> = new Array<AVAT_TR_PurInvoiceDetail>();
    //***********************************************************************//
    //TextBoxes
    var txtStartDate: HTMLInputElement;
    var txtEndDate: HTMLInputElement;
    var txtTR_DATE: HTMLInputElement;
    var txtCreatedBy: HTMLInputElement;
    var txtCreatedAt: HTMLInputElement;
    var txtUpdatedBy: HTMLInputElement;
    var txtUpdatedAt: HTMLInputElement;
    var txtRefNum: HTMLInputElement;
    var txtMenuNum: HTMLInputElement;
    var txtRemark: HTMLInputElement;

    var txtInvTotal: HTMLInputElement;
    var txtVat: HTMLInputElement;
    var txtDiscountValue: HTMLInputElement;
    var txtNet: HTMLInputElement;

    //print buttons
    var btnPrintTrview: HTMLButtonElement;
    var btnPrintTrPDF: HTMLButtonElement;
    var btnPrintTrEXEL: HTMLButtonElement;
    var btnPrintTransaction: HTMLButtonElement;
    //var btnPrint: HTMLButtonElement;
    //------------------------------------------------------ Main Region------------------------
    export function InitializeComponent() {
        //     system
        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = "المشتريات";
        }
        else {
            document.getElementById('Screen_name').innerHTML = "Purchaes";
        }
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);
        vatType = SysSession.CurrentEnvironment.I_Control[0].DefSlsVatType;
        // calling functions
        InitializeControls();
        InitializeEvents();
        FillStatus();
        FilldrpImportInvoiceFilter();
        $('#drpSrchStatus').prop("value", "2");
        $('#drpImportInvoiceFilter').prop("value", "2");
        txtStartDate.value = DateStartMonth();
        txtEndDate.value = ConvertToDateDash(GetDate()) <= ConvertToDateDash(SysSession.CurrentEnvironment.EndDate) ? GetDate() : SysSession.CurrentEnvironment.EndDate;
        FillddlVatNature();
        FillddlFamily();
        GetAllCostCenters();
        GetAllVendors();
    }
    function InitializeControls() {
        drpSrchStatus = document.getElementById("drpSrchStatus") as HTMLSelectElement;
        drpImportInvoiceFilter = document.getElementById("drpImportInvoiceFilter") as HTMLSelectElement;
        btnAdd = document.getElementById("btnAdd") as HTMLButtonElement;
        btnShow = document.getElementById("btnShow") as HTMLButtonElement;
        btnSave = document.getElementById("btnSave") as HTMLButtonElement;
        btnBack = document.getElementById("btnBack") as HTMLButtonElement;
        btnUpdate = document.getElementById("btnUpdate") as HTMLButtonElement;
        btnAddHeaderControls = document.getElementById("btnAddHeaderControls") as HTMLButtonElement;
        btnAddChildControls = document.getElementById("btnAddChildControls") as HTMLButtonElement;

        chkClosed = document.getElementById("chkClosed") as HTMLInputElement;

        chk_ImportInvoiceDetail = document.getElementById("chk_ImportInvoiceDetail") as HTMLInputElement;
        hd_InvoiceId = document.getElementById("hd_InvoiceId") as HTMLInputElement;
        //Textboxes 
        txtStartDate = document.getElementById("txtStartDate") as HTMLInputElement;
        txtEndDate = document.getElementById("txtEndDate") as HTMLInputElement;
        txtTR_DATE = document.getElementById("txtTR_DATE") as HTMLInputElement;
        txtCreatedBy = document.getElementById("txtCreatedBy") as HTMLInputElement;
        txtCreatedAt = document.getElementById("txtCreatedAt") as HTMLInputElement;
        txtUpdatedBy = document.getElementById("txtUpdatedBy") as HTMLInputElement;
        txtUpdatedAt = document.getElementById("txtUpdatedAt") as HTMLInputElement;
        txtRefNum = document.getElementById("txtRefNum") as HTMLInputElement;
        txtMenuNum = document.getElementById("txtMenuNum") as HTMLInputElement;
        txtRemark = document.getElementById("txtRemark") as HTMLInputElement;
        txtPerson = document.getElementById("txtPerson") as HTMLInputElement;
        txtSearch = document.getElementById("txtSearch") as HTMLInputElement;


        txtInvTotal = document.getElementById("txtInvTotal") as HTMLInputElement;
        txtVat = document.getElementById("txtVat") as HTMLInputElement;
        txtDiscountValue = document.getElementById("txtDiscountValue") as HTMLInputElement;
        txtNet = document.getElementById("txtNet") as HTMLInputElement;

        //print 
        btnPrintTrview = document.getElementById("btnPrintTrview") as HTMLButtonElement;
        btnPrintTrPDF = document.getElementById("btnPrintTrPDF") as HTMLButtonElement;
        btnPrintTrEXEL = document.getElementById("btnPrintTrEXEL") as HTMLButtonElement;
        btnPrintTransaction = document.getElementById("btnPrintTransaction") as HTMLButtonElement;
     //   btnPrint = document.getElementById("btnPrint") as HTMLInputElement;


    }
    function InitializeEvents() {
        btnShow.onclick = btnShow_onclick;
        btnAdd.onclick = btnadd_onclick;
        btnSave.onclick = btnSave_onclick;
        btnBack.onclick = btnBack_onclick;
        btnUpdate.onclick = btnUpdate_onclick;
        btnAddHeaderControls.onclick = AddNewRow_Header;
        btnAddChildControls.onclick = AddNewRow_Details;
        chkClosed.onclick = Open;
        txtSearch.onkeyup = txtSearch_Change;

        //print
        btnPrintTrview.onclick = () => { PrintReport(1); }
        btnPrintTrPDF.onclick = () => { PrintReport(2); }
        btnPrintTrEXEL.onclick = () => { PrintReport(3); }
       // btnPrint.onclick = () => { PrintReport(4); }
        btnPrintTransaction.onclick = btnPrintReceive_onclick;


    }
    //--------------------------------------------------- butttons Region----------------------------------------------
    function btnShow_onclick() {
        InitializeGrid();
        $("#divDetails").addClass("display_none");
        $("#divEdit").addClass("display_none");
        $("#divMasterGridiv").removeClass("display_none");
    }
    function btnadd_onclick() {
        if (!SysSession.CurrentPrivileges.AddNew) return;
        isNew = true;
        EditModeFlag = false
        showFlag = false;
        clear();
        txtCreatedBy.value = SysSession.CurrentEnvironment.UserCode;
        txtCreatedAt.value = DateTimeFormat(Date().toString());
        txtUpdatedAt.value = "";
        txtUpdatedBy.value = "";
        EnableControls();
        AddNewRow_Header();
        $("#divEdit").removeClass("display_none");
    }


    //function btnSave_onclick() {
    //    Assign();
    //    if (!ValidationMenu())
    //        return;

    //    for (let i = 0; i < CountGrid1; i++) {
    //        if (!ValidationHeaderWithDetail(i))
    //            return;
    //    }

    //    for (let i = 0; i < CountGrid1; i++) {
    //        if (!Validation_Grid_Header(i))
    //            return;
    //    }

    //    for (let i = 0; i < DetailList.length; i++) {
    //        if (!ValidationDetailBeforeSave(i))
    //            return;
    //    }

    //    if (isNew == true) {
    //        Insert();
    //    } else {
    //        Update();
    //    }
    //    EditModeFlag = false;
    //    isNew = false;
    //}


    function btnBack_onclick() {

        if (isNew == true) {
            clear();
            DisableControls();
            $("#divDetails").addClass("display_none");
            $("#divEdit").addClass("display_none");
        } else {
            EditModeFlag = false;
            MasterGridDoubleClick();
        }
        $("#btnPrintTransaction").removeClass("display_none");

    }
    function btnUpdate_onclick() {
        if (!SysSession.CurrentPrivileges.EDIT) return;
        $("#DivChargesShow2").addClass("display_none");
        $("#btnPrintTransaction").addClass("display_none");
        EditModeFlag = true;
        isNew = false;
        showFlag = false;

        for (var i = 0; i < CountGrid1; i++) {
            AssignForGrids(ModelPurInvoiceHeader[i].VND_SERIAL, i);
        }

        EnableControls();
        txtUpdatedBy.value = SysSession.CurrentEnvironment.UserCode;
        txtUpdatedAt.value = DateTimeFormat(Date().toString());
    }
    function txtSearch_Change() {
        if (txtSearch.value != "") {

            let search: string = txtSearch.value.toLowerCase();
            searchDetails = AQ_ServPurInvoiceMasterDetailModel.filter(x => x.TR_NO.toString().search(search) >= 0 || x.DocNo.toLowerCase().search(search) >= 0
                || x.PERSON.toLowerCase().search(search) >= 0);

            MasterGrid.DataSource = searchDetails;
            MasterGrid.Bind();
        } else {
            MasterGrid.DataSource = AQ_ServPurInvoiceMasterDetailModel;
            MasterGrid.Bind();
        }
    }
    //-------------------------------------------------------main functions ----------------------------------------------//
    //function Assign() {
    //    MasterDetailModel = new ServPurchseInvoiceMasterDetail();
    //    // Header
    //    Menu = new AVAT_TR_PurInvoice();
    //    Menu.CompCode = compcode;
    //    Menu.BranchCode = BranchCode;
    //    Menu.InvoiceId = 0;
    //    Menu.TR_NO = 0;
    //    Menu.DocNo = "";
    //    Menu.TR_DATE = txtTR_DATE.value;
    //    Menu.PERSON = txtPerson.value;
    //    Menu.TOTAL = Number(txtInvTotal.value);
    //    Menu.DISCOUNT = Number(txtDiscountValue.value);
    //    Menu.PAID = 0;
    //    Menu.JOURNAL_NO = 0;
    //    Menu.JOURNAL_RET_NO = 0;
    //    Menu.CLOSED = chkClosed.checked;
    //    Menu.CANCEL = false;
    //    Menu.Remark = txtRemark.value;

    //    Menu.IsPosted = false;
    //    Menu.ACTUAL_DATE = "";
    //    Menu.PrntNo = "";
    //    Menu.Ref_No = txtRefNum.value;
    //    Menu.Vat = Number(txtVat.value);
    //    Menu.NetATax = Number(txtNet.value);
    //    Menu.InvoiceDate = "";
    //    Menu.ImportInvoice = chk_ImportInvoiceDetail.checked;
    //    Menu.CCDT_CODE = "";
    //    Menu.ImportInvoiceDesc = "";

    //    // Invoices Headers
    //    for (var i = 0; i < InvHeaderAssign.length; i++) {
    //        AssignForGrids(InvHeaderAssign[i].VND_SERIAL, i);
    //    }
    //    MasterDetailModel.AVAT_TR_PurInvoiceHeader = InvHeaderAssign;

    //    // Invoices Details
    //    MasterDetailModel.AVAT_TR_PurInvoiceDetail = DetailList;


    //}



    function Insert() {
        Menu.CreatedAt = DateTimeFormat(Date().toString());
        Menu.CreatedBy = SysSession.CurrentEnvironment.UserCode;
        MasterDetailModel.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
        MasterDetailModel.UserCode = SysSession.CurrentEnvironment.UserCode;
        MasterDetailModel.AVAT_TR_PurInvoice = Menu;
        hd_InvoiceId.value = "0";
        Ajax.Callsync({
            type: "post",
            url: sys.apiUrl("ServPurInvoice", "Insert"),
            data: JSON.stringify(MasterDetailModel),
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    let res = result.Response as AVAT_TR_PurInvoice;
                    GlobalMenuID = res.InvoiceId;
                    updateDocNumber();
                    FlagAfterInsertOrUpdate = true;
                    InitializeGrid();
                    MasterGridDoubleClick();
                    FlagAfterInsertOrUpdate = false;
                    DisplayMassage(" تم اصدار  قائمة رقم  " + res.TR_NO + " ", "An Menu " + res.TR_NO + "number has been issued ", MessageType.Succeed);
                }
            }
        });

    }
    function Update() {


        MasterDetailModel.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
        MasterDetailModel.UserCode = SysSession.CurrentEnvironment.UserCode;
        Menu.UpdatedAt = DateTimeFormat(Date().toString());
        Menu.UpdatedBy = SysSession.CurrentEnvironment.UserCode;
        if (Selected_Data.length > 0) {
            Menu.CreatedAt = Selected_Data[0].CreatedAt;
            Menu.CreatedBy = Selected_Data[0].CreatedBy;
            Menu.InvoiceId = Selected_Data[0].InvoiceId;
            Menu.DocNo = Selected_Data[0].DocNo;
            Menu.TR_NO = Selected_Data[0].TR_NO;
        }
        MasterDetailModel.AVAT_TR_PurInvoice = Menu;
        hd_InvoiceId.value = "0";

        Ajax.Callsync({
            type: "Post",
            url: sys.apiUrl("ServPurInvoice", "UpdatePurchaseInvoice"),
            data: JSON.stringify(MasterDetailModel),
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    let res = result.Response as AVAT_TR_PurInvoice;
                    GlobalMenuID = res.InvoiceId;
                    FlagAfterInsertOrUpdate = true;
                    InitializeGrid();
                    MasterGridDoubleClick();
                    FlagAfterInsertOrUpdate = false;
                    DisplayMassage(" تم تعديل  قائمة رقم  " + res.TR_NO + " ", "The Menu " + res.TR_NO + "menu number has been editied ", MessageType.Succeed);
                }
            }
        });
    }
    function Open() {
        if (Selected_Data[0].CLOSED == true && chkClosed.checked == false) {
            if (txtPerson.disabled == true) {
                if (!SysSession.CurrentPrivileges.CUSTOM2) return;
                Assign();
                for (var i = 0; i < InvHeaderAssign.length; i++) {
                    DisplayInvoicesDetails(InvHeaderAssign[i].InvoiceHeaderID);
                }
                MasterDetailModel.AVAT_TR_PurInvoiceDetail = DetailList;
                MasterDetailModel.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
                MasterDetailModel.UserCode = SysSession.CurrentEnvironment.UserCode;
                Menu.UpdatedAt = DateTimeFormat(Date().toString());
                Menu.UpdatedBy = SysSession.CurrentEnvironment.UserCode;

                Menu.CLOSED = false;
                if (Selected_Data.length > 0) {
                    Menu.CreatedAt = Selected_Data[0].CreatedAt;
                    Menu.CreatedBy = Selected_Data[0].CreatedBy;
                    Menu.InvoiceId = Selected_Data[0].InvoiceId;
                    Menu.DocNo = Selected_Data[0].DocNo;
                    Menu.TR_NO = Selected_Data[0].TR_NO;
                }
                MasterDetailModel.AVAT_TR_PurInvoice = Menu;
                hd_InvoiceId.value = "0";

                Ajax.Callsync({
                    type: "Post",
                    url: sys.apiUrl("ServPurInvoice", "OpenPurchaseInvoice"),
                    data: JSON.stringify(MasterDetailModel),
                    success: (d) => {
                        let result = d as BaseResponse;
                        if (result.IsSuccess) {
                            let res = result.Response as AVAT_TR_PurInvoice;
                            GlobalMenuID = res.InvoiceId;
                            FlagAfterInsertOrUpdate = true;
                            InitializeGrid();
                            MasterGridDoubleClick();
                            FlagAfterInsertOrUpdate = false;
                            DisplayMassage(" تم فك اعتماد  قائمة رقم  " + res.TR_NO + " ", "The Menu " + res.TR_NO + "menu number has been unauthorized ", MessageType.Succeed);
                        }
                    }
                });
            }
            if (!SysSession.CurrentPrivileges.CUSTOM1) {
                DisplayMassage(" لا يوجد لديك صلاحيه للاعتماد ", "there is no prevelge for authorize", MessageType.Error);

            }
        }
    }
    //-------------------------------------------------------  Drop Down lists ----------------------------------------------//
    function FillStatus() {
        List_Status = ["مفتوح", " مغلق", "الجميع"];
        List_StatusEn = [" open", " closed", "All"];

        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            for (let i = 0; i < List_Status.length; i++) {
                let newoption = document.createElement("option");
                newoption.value = i.toString();
                newoption.text = List_Status[i];
                drpSrchStatus.options.add(newoption);
            }
        }
        else {
            for (let i = 0; i < List_StatusEn.length; i++) {
                let newoption = document.createElement("option");
                newoption.value = i.toString();
                newoption.text = List_StatusEn[i];
                drpSrchStatus.options.add(newoption);
            }
        }
    }
    function FilldrpImportInvoiceFilter() {
        var List_StatusImp: Array<string> = ["نعم", " لا", "الجميع"];
        var List_StatusEnmp: Array<string> = [" yes", " No", "All"];

        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            for (let i = 0; i < List_StatusImp.length; i++) {
                let newoption = document.createElement("option");
                newoption.value = i.toString();
                newoption.text = List_StatusImp[i];
                drpImportInvoiceFilter.options.add(newoption);
            }
        }
        else {
            for (let i = 0; i < List_StatusEnmp.length; i++) {
                let newoption = document.createElement("option");
                newoption.value = i.toString();
                newoption.text = List_StatusEnmp[i];
                drpImportInvoiceFilter.options.add(newoption);
            }
        }
    }
    //------------------------------------------------------ Normal Grid Region------------------------
    function InitializeGrid() {
        $("#divMasterGridiv").removeClass("display_none");
        let res: any = GetResourceList("");
        MasterGrid.ElementName = "divMasterGrid";
        MasterGrid.Paging = true;
        MasterGrid.PageSize = 10;
        MasterGrid.Sorting = true;
        MasterGrid.InsertionMode = JsGridInsertionMode.Binding;
        MasterGrid.Editing = false;
        MasterGrid.Inserting = false;
        MasterGrid.SelectedIndex = 1;
        MasterGrid.OnRowDoubleClicked = MasterGridDoubleClick;
        MasterGrid.OnItemEditing = () => { };
        MasterGrid.PrimaryKey = "InvoiceId";
        MasterGrid.Columns = [
            { title: "Id", name: "InvoiceId", type: "number", width: "05%", css: "display_none" },
            { title: res.Inv_MenuNo, name: "TR_NO", type: "number", width: "10%" },
            { title: res.App_DocumentNo, name: "DocNo", type: "number", width: "20%" },
            { title: res.App_date, name: "TR_DATE", type: "text", width: "12%" },
            { title: res.App_Salesman, name: "PERSON", type: "text", width: "30%" },
            { title: res.I_Total, name: "TOTAL", type: "text", width: "10%" },
            { title: res.App_Tax, name: "Vat", type: "text", width: "10%" },
            { title: res.net, name: "NetATax", type: "text", width: "10%" },
            { title: res.Inv_ImportInvoice, name: "ImportInvoiceDesc", type: "text", width: "8%" },
            { title: res.App_State, name: "CLOSEDDesc", type: "text", width: "8%" },
            { title: res.App_Notes, name: "Remark", type: "text", width: "40%" },

        ];
        BindGridData();
    }
    function BindGridData() {
        var startdate = DateFormatRep($('#txtStartDate').val());
        var Enddate = DateFormatRep($('#txtEndDate').val());
        var clos = Number(drpSrchStatus.value);
        var chkImp = Number(drpImportInvoiceFilter.value);
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("ServPurInvoice", "Search"),
            data: {
                UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token, strtdt: startdate, Enddt: Enddate, clos: clos, chkImp: chkImp, compCode: compcode, branch: BranchCode
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    AQ_ServPurInvoiceMasterDetailModel = result.Response as Array<AVAT_TR_PurInvoice>;
                    ParentHeaderDetails = AQ_ServPurInvoiceMasterDetailModel;
                    for (var i = 0; i < ParentHeaderDetails.length; i++) {
                        ParentHeaderDetails[i].TR_DATE = DateFormat(ParentHeaderDetails[i].TR_DATE);
                        ParentHeaderDetails[i].ImportInvoiceDesc = ParentHeaderDetails[i].ImportInvoice == true ? (lang == "ar" ? "نعم" : "yes") : (lang == "ar" ? "لا" : "No");
                        ParentHeaderDetails[i].CLOSEDDesc = ParentHeaderDetails[i].CLOSED == true ? (lang == "ar" ? "مغلقه" : "closed") : (lang == "ar" ? "مفتوحه" : "opened");
                    }
                    MasterGrid.DataSource = ParentHeaderDetails;
                    MasterGrid.Bind();
                    $("#searchtext").removeClass("display_none");

                }
            }
        });
    }
    function MasterGridDoubleClick() {
        clear();
        $("#divDetails").removeClass("display_none");
        $("#divEdit").removeClass("display_none");
        $("#btnUpdate").removeClass("display_none");
        // Bind Menu
        showFlag = true;
        Selected_Data = new Array<AVAT_TR_PurInvoice>();
        if (FlagAfterInsertOrUpdate == true) {
            Selected_Data = AQ_ServPurInvoiceMasterDetailModel.filter(x => x.InvoiceId == GlobalMenuID);
            txtMenuNum.value = Selected_Data[0].TR_NO.toString();
        } else {
            Selected_Data = AQ_ServPurInvoiceMasterDetailModel.filter(x => x.InvoiceId == Number(MasterGrid.SelectedKey));
        }
        if (Selected_Data.length > 0) {
            GlobalMenuID = Selected_Data[0].InvoiceId
            txtMenuNum.value = Selected_Data[0].TR_NO.toString();
            txtRefNum.value = Selected_Data[0].Ref_No.toString();
            chk_ImportInvoiceDetail.checked = Selected_Data[0].ImportInvoice;
            txtTR_DATE.value = Selected_Data[0].TR_DATE.toString();

            txtPerson.value = Selected_Data[0].PERSON;
            txtRemark.value = Selected_Data[0].Remark.toString();
            txtRemark.value = Selected_Data[0].Remark.toString();
            $('#txtVoucherNo').val(Selected_Data[0].JOURNAL_NO.toString());
            txtVat.value = Selected_Data[0].Vat.toString();
            txtInvTotal.value = Selected_Data[0].TOTAL.toString();
            txtDiscountValue.value = Selected_Data[0].DISCOUNT.toString();
            txtNet.value = Selected_Data[0].NetATax.toString();
            chkClosed.checked = Selected_Data[0].CLOSED;
            txtCreatedAt.value = Selected_Data[0].CreatedAt;
            txtCreatedBy.value = Selected_Data[0].CreatedBy;
            txtUpdatedAt.value = Selected_Data[0].UpdatedAt;
            txtUpdatedBy.value = Selected_Data[0].UpdatedBy;
        }

        // Bind Invoices Header
        DisplayInvoicesHeader(GlobalMenuID);

        // Bind Invoices Details
        DisableControls();

        if (Selected_Data[0].CLOSED == true) {
            btnUpdate.disabled = true;
            chkClosed.disabled = !SysSession.CurrentPrivileges.CUSTOM2;
        } else {
            btnUpdate.disabled = false;
            chkClosed.disabled = true;
        }
        $("#DivChargesShow2").addClass("display_none");
        //***new

        DetailList = HeaderWithDetailModel.AQVAT_GetPurInvoiceDetail;
    }
    function DisplayInvoicesHeader(invoiceID: number) {
        ModelPurInvoiceHeader = new Array<AQVAT_GetPurInvoiceHeader>();

        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("ServPurInvoice", "AllGetGetPurInvoiceDetails"),
            data: {
                InvoiceId: invoiceID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    HeaderWithDetailModel = result.Response as AQ_ServPurInvoiceMasterDetail;
                }
            }
        });

        ModelPurInvoiceHeader = HeaderWithDetailModel.AQVAT_GetPurInvoiceHeader.filter(s => s.InvoiceId == invoiceID);
        CountGrid1 = ModelPurInvoiceHeader.length;
        for (var i = 0; i < CountGrid1; i++) {
            BuildControls_Header(i);
        }
    }
    function DisplayInvoicesDetails(invoiceHeaderID: number) {
        ModelPurInvoiceDetail = new Array<AQVAT_GetPurInvoiceDetail>();
        ModelPurInvoiceDetail = HeaderWithDetailModel.AQVAT_GetPurInvoiceDetail.filter(s => s.InvoiceHeaderID == invoiceHeaderID);
        CountGrid2 = ModelPurInvoiceDetail.length;
        for (var i = 0; i < CountGrid2; i++) {
            var HeaderObj = DetailList.filter(s => s.VND_SERIAL == GlobalVendorNum && s.TR_SERIAL == ModelPurInvoiceDetail[i].TR_SERIAL);
            InvDetailAssignSingle = new AVAT_TR_PurInvoiceDetail;
            InvDetailAssignSingle.InvoiceDetailID = ModelPurInvoiceDetail[i].InvoiceDetailID;
            InvDetailAssignSingle.InvoiceHeaderID = ModelPurInvoiceDetail[i].InvoiceHeaderID;
            InvDetailAssignSingle.InvoiceId = ModelPurInvoiceDetail[i].InvoiceId;
            InvDetailAssignSingle.TR_SERIAL = ModelPurInvoiceDetail[i].TR_SERIAL;
            InvDetailAssignSingle.VND_SERIAL = ModelPurInvoiceDetail[i].VND_SERIAL;
            InvDetailAssignSingle.ItemID = ModelPurInvoiceDetail[i].ItemID;
            InvDetailAssignSingle.UomID = ModelPurInvoiceDetail[i].UomID;
            InvDetailAssignSingle.VatNatID = ModelPurInvoiceDetail[i].VatNatID;
            InvDetailAssignSingle.SoldQty = ModelPurInvoiceDetail[i].SoldQty;
            InvDetailAssignSingle.Unitprice = ModelPurInvoiceDetail[i].Unitprice;
            InvDetailAssignSingle.DiscountPrc = ModelPurInvoiceDetail[i].DiscountPrc;
            InvDetailAssignSingle.DiscountAmount = ModelPurInvoiceDetail[i].DiscountAmount;
            InvDetailAssignSingle.NetUnitPrice = ModelPurInvoiceDetail[i].NetUnitPrice;
            InvDetailAssignSingle.ItemTotal = ModelPurInvoiceDetail[i].ItemTotal;
            InvDetailAssignSingle.VatApplied = ModelPurInvoiceDetail[i].VatApplied;
            InvDetailAssignSingle.VatPrc = ModelPurInvoiceDetail[i].VatPrc;
            InvDetailAssignSingle.VatAmount = ModelPurInvoiceDetail[i].VatAmount;
            InvDetailAssignSingle.NetAfterVat = ModelPurInvoiceDetail[i].NetAfterVat;
            InvDetailAssignSingle.REMARK = ModelPurInvoiceDetail[i].REMARK;
            InvDetailAssignSingle.ACTUAL_DATE = ModelPurInvoiceDetail[i].ACTUAL_DATE;
            InvDetailAssignSingle.QTY_RET = ModelPurInvoiceDetail[i].QTY_RET;
            InvDetailAssignSingle.CC_CODE = ModelPurInvoiceDetail[i].CC_CODE;
            InvDetailAssignSingle.CompCode = ModelPurInvoiceDetail[i].CompCode;
            InvDetailAssignSingle.BranchCode = ModelPurInvoiceDetail[i].BranchCode;
            InvDetailAssignSingle.StatusFlag = $("#txt_StatusFlag2" + i).val();
            if (HeaderObj[0] == null) {
                DetailList.push(InvDetailAssignSingle);
            } else {

            }
        }
    }
    //------------------------------------------------------ first Controls Grid Region------------------------
    function BuildControls_Header(cnt: number) {
        var html;
        html = '<div id= "No_Row1' + cnt + '" class="container-fluid style_border" > <div class="row" > <div class="col-lg-12 col-md-12 col-sm-12 col-xl-12 col-xs-12 " > ' +
            '<span id="btn_minus1' + cnt + '" class="fa fa-minus-circle fontitm4PurTrReceive display_none"></span>' +
            '<span id="btn_arrowdown' + cnt + '" class="styledown glyphicon glyphicon-circle-arrow-down   "></span>' +

            '<div class="col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-1 ">' +
            '<input id="txtInvoiceHeaderID' + cnt + '" type="hidden" class="form-control input-sm right2 display_none"/>' +
            '<input id="VND_SERIAL' + cnt + '" type="hidden"  class="form-control input-sm right2 display_none"/>' +

            '<input id="txtInvSerial' + cnt + '" type="text" class="form-control input-sm right2" disabled value="' + cnt + '"/></div>' +
            '<div class="col-lg-2 col-md-2 col-sm-2 col-xl-2 col-xs-2">' +
            '<input id="txtDocNum' + cnt + '" type="text" disabled value="0" class="form-control input-sm right2"/></div>' +
            '<div class="col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-1">' +
            '<input id="txtInvTrNO' + cnt + '" type="text" class="form-control input-sm right2" disabled value="' + (0) + '"/></div>' +
            '<div class="col-lg-4 col-md-4 col-sm-4 col-xl-4 col-xs-4 ">' +
            '<button type="button" class="col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-1 src-btn btn btn-search input-sm  btn-warning" id="btnVendorSrch' + cnt + '" name="ColSearch">   ' +
            '<i class="fa fa-search  "></i></button>' +
            '<input id="txtVndrCode' + cnt + '" name="" disabled type="text" class="col-lg-4 col-md-4 col-sm-4 col-xl-4 col-xs-4 form-control input-sm  text_Display  "/>' +
            '<input id="txtVendoeName' + cnt + '" name="" disabled type="text" class="col-lg-7 col-md-7 col-sm-7 col-xl-7 col-xs-7  form-control input-sm  text_Display"/>' +
            '</div>' +

            '<div class="col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-1 col-md-1 col-sm-1 col-xl-1 col-xs-1">' +
            '<Input id="chkCash' + cnt + '" type="checkbox" class="form-control input-sm right2" disabled value=" "/></div>' +

            '<div class="col-lg-2 col-md-2 col-sm-2 col-xl-2 col-xs-2">' +
            '<input id="txtInvoiceDate' + cnt + '" type="date" disabled class="form-control input-sm right2"   value=' + GetDate() + ' /></div>' +

            '<div class="col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-1">' +
            '<input id="txtInvtotal' + cnt + '" type="text" disabled class="form-control input-sm right2"   value="0"/></div>' +

            "<div class='col-lg-10 col-md-10 col-sm-10 col-xl-10 col-xs-10' style='position: absolute; right: 99% '>" +

            '<div class="col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-1">' +
            '<input id="txtInvVat' + cnt + '" type="text" disabled value="0" class="form-control input-sm right2"/></div>' +

            '<div class="col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-1">' +
            '<input id="txtDiscoutnval' + cnt + '" type="number" disabled value="0" class="form-control input-sm right2"/></div>' +
            '<div class="col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-1">' +
            '<input id="txtInvNet' + cnt + '" type="number" disabled class="form-control input-sm right2"   value="0"/></div>' +
            '<div class="col-lg-6 col-md-6 col-sm-6 col-xl-6 col-xs-6">' +

            '<button type="button" disabled class="col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-1 src-btn btn btn-search input-sm  btn-warning" id="btnAccSearch' + cnt + '" name="ColSearch">   ' +
            '<i class="fa fa-search  "></i></button>' +
            '<input id="txtAccCode' + cnt + '" name="" disabled type="text" class="col-lg-3 col-md-3 col-sm-3 col-xl-3 col-xs-3 form-control input-sm  text_Display  "/>' +
            '<input id="txtAccDesc' + cnt + '" name="" disabled type="text" class="col-lg-8 col-md-8 col-sm-8 col-xl-8 col-xs-8 form-control input-sm  text_Display"/> </div>' +

            '<div class="col-lg-3 col-md-3 col-sm-3 col-xl-3 col-xs-3">' +
            '<input id="txtInvoiceDesc' + cnt + '" type="text" disabled class="form-control input-sm right2"   /></div>' +
            '</div>' +
            "</div>" +
            ' </div></div>' +

            '<input id="txt_StatusFlag1' + cnt + '" name = " " type = "hidden" class="form-control input-sm"/><input id="txt_ID1' + cnt + '" name = " " type = "hidden" class="form-control input-sm"/>';

        $("#divData_Header").append(html);

        //// Vendor Search
        $('#btnVendorSrch' + cnt).click(function (e) {
            let sys: SystemTools = new SystemTools();

            sys.FindKey(Modules.Ser_Purchasing, "btnVndorSearch", "CompCode=" + compcode + "and Isactive = 'True' ", () => {
                let id = SearchGrid.SearchDataGrid.SelectedKey;
                GetVendorByID(id);
                $('#txtVndrCode' + cnt).val(VendorDetail.VendorCode);
                $('#txtVendoeName' + cnt).val((lang == "ar" ? VendorDetail.NAMEA : VendorDetail.NAMEL));
                if ($("#txt_StatusFlag1" + cnt).val() != "i")
                    $("#txt_StatusFlag1" + cnt).val("u");

                GlobalVendorNum = $("#VND_SERIAL" + cnt).val();
                AssignForGrids(GlobalVendorNum, cnt);
            });
        });

        $("#txtVndrCode" + cnt).on('change', function () {
            if ($("#txt_StatusFlag1" + cnt).val() != "i")
                $("#txt_StatusFlag1" + cnt).val("u");
            var code = $('#txtVndrCode' + cnt).val();
            var VendObj = VendorDetailList.filter(s => s.VendorCode == code && s.Isactive == true && s.CompCode == compcode);
            if (VendObj.length > 0) {
                $('#txtVendoeName' + cnt).val((lang == "ar" ? VendObj[0].NAMEA : VendObj[0].NAMEL));
            }
            else {
                $('#txtVndrCode' + cnt).val("");
                $('#txtVendoeName' + cnt).val("");
                DisplayMassage("كود المورد غير صحيح ", "Wrong vendor code ", MessageType.Error);
            }
        });
        //// Account Search
        $('#btnAccSearch' + cnt).click(function (e) {
            let sys: SystemTools = new SystemTools();

            sys.FindKey(Modules.Ser_Purchasing, "btnAccountSearch", "COMP_CODE=" + compcode + "and ACC_ACTIVE = 1 and DETAIL =1 ", () => {
                let id = SearchGrid.SearchDataGrid.SelectedKey
                if (GetAccByCode(id)) {
                    $('#txtAccCode' + cnt).val(AccountDetails.ACC_CODE);
                    $('#txtAccDesc' + cnt).val((lang == "ar" ? AccountDetails.ACC_DESCA : AccountDetails.ACC_DESCL));
                }
                GlobalVendorNum = $("#VND_SERIAL" + cnt).val();
                AssignForGrids(GlobalVendorNum, cnt);

                if ($("#txt_StatusFlag1" + cnt).val() != "i")
                    $("#txt_StatusFlag1" + cnt).val("u");
            });


        });
        $("#txtAccCode" + cnt).on('change', function () {
            if ($("#txt_StatusFlag1" + cnt).val() != "i")
                $("#txt_StatusFlag1" + cnt).val("u");

            var code = $('#txtAccCode' + cnt).val();
            if (GetAccByCode(code)) {
                $('#txtAccCode' + cnt).val(AccountDetails.ACC_CODE);
                $('#txtAccDesc' + cnt).val((lang == "ar" ? AccountDetails.ACC_DESCA : AccountDetails.ACC_DESCL));
                GlobalVendorNum = $("#VND_SERIAL" + cnt).val();
                AssignForGrids(GlobalVendorNum, cnt);
            }
            else {
                $('#txtAccCode' + cnt).val("");
                $('#txtAccDesc' + cnt).val("");
                DisplayMassage("رقم الحساب غير صحيح ", "Wrong Account code ", MessageType.Error);
            }
        });

        $("#chkCash" + cnt).on('change', function () {
            if ($("#txt_StatusFlag1" + cnt).val() != "i")
                $("#txt_StatusFlag1" + cnt).val("u");
            var checked: boolean = $("#chkCash" + cnt).prop("checked");

            if (checked == true) {
                $('#btnAccSearch' + cnt).removeAttr("disabled");
                $('#txtAccCode' + cnt).removeAttr("disabled");
            } else {
                $('#btnAccSearch' + cnt).attr("disabled", "disabled");
                $('#txtAccCode' + cnt).attr("disabled", "disabled");
            }
            GlobalVendorNum = $("#VND_SERIAL" + cnt).val();
            AssignForGrids(GlobalVendorNum, cnt);
        });

        $("#txtInvTrNO" + cnt).on('change', function () {
            if ($("#txt_StatusFlag1" + cnt).val() != "i")
                $("#txt_StatusFlag1" + cnt).val("u");

            GlobalVendorNum = $("#VND_SERIAL" + cnt).val();
            AssignForGrids(GlobalVendorNum, cnt);
        });

        $("#txtInvoiceDesc" + cnt).on('change', function () {
            if ($("#txt_StatusFlag1" + cnt).val() != "i")
                $("#txt_StatusFlag1" + cnt).val("u");

            GlobalVendorNum = $("#VND_SERIAL" + cnt).val();
            AssignForGrids(GlobalVendorNum, cnt);
        });


        $("#txtDiscoutnval" + cnt).on('keyup', function (e) {
            if ($("#txt_StatusFlag1" + cnt).val() != "i")
                $("#txt_StatusFlag1" + cnt).val("u");
            Assign();
            var totalVal = Number($("#txtInvtotal" + cnt).val());
            var VatVal = Number($("#txtInvVat" + cnt).val());
            var DisVal = Number($("#txtDiscoutnval" + cnt).val());
            if (DisVal > (VatVal + totalVal)) {
                DisplayMassage("يجب الا تزيد قيمه الخصم عن الاجمالي مع الضريبه", "Discount Value must be less than total with vat", MessageType.Error);
                $("#txtDiscoutnval" + cnt).val("0");
            } else {

                GlobalVendorNum = $("#VND_SERIAL" + cnt).val();
                var headDI = Number($("#txtInvoiceHeaderID" + cnt).val());

                if (isNew == false) {
                    DisplayInvoicesDetails(headDI);
                    DisplayGridDetails(GlobalVendorNum);
                }
                var NetVal = (totalVal + VatVal) - DisVal;
                $("#txtInvNet" + cnt).val(NetVal.RoundToSt(2).toString());
                ComputeTotals();

            }
        });

        $("#btn_minus1" + cnt).on('click', function () {
            DeleteRowCharge(cnt);
        });

        /// row changed click
        //$("#btn_arrowdown" + cnt).on('click', function () {

        //    if (!Validation_Grid_Header(cnt))
        //        return;

        //    GlobalVendorNum = $("#VND_SERIAL" + cnt).val();
        //    if (EditModeFlag == true) {
        //        var InvHeaderID = $("#txtInvoiceHeaderID" + cnt).val();
        //        DisplayInvoicesDetails(InvHeaderID);
        //    }
        //    DisplayGridDetails(GlobalVendorNum);
        //    EnableControls();
        //    if (EditModeFlag == false) {
        //        DisableControls();
        //    }
        //    if (isNew == true) {
        //        EnableControls();
        //    }
        //});

        //***new
        $("#btn_arrowdown" + cnt).on('click', function () {

            btn_arrowdown_onclick(cnt);
        });
        //******

        if (showFlag == true) {
            $("#txtInvoiceHeaderID" + cnt).val(ModelPurInvoiceHeader[cnt].InvoiceHeaderID);
            //$("#txtInvSerial" + cnt).val(ModelPurInvoiceHeader[cnt].VND_SERIAL);
            $("#txtInvSerial" + cnt).val(cnt + 1);//***new
            $("#VND_SERIAL" + cnt).val(ModelPurInvoiceHeader[cnt].VND_SERIAL);
            $("#txtInvTrNO" + cnt).val(ModelPurInvoiceHeader[cnt].Ref_No);
            $("#txtDocNum" + cnt).val(ModelPurInvoiceHeader[cnt].DocNo);
            $("#txtVndrCode" + cnt).val(ModelPurInvoiceHeader[cnt].VendorCode);
            $("#txtVendoeName" + cnt).val(ModelPurInvoiceHeader[cnt].vnd_NameA);

            if (ModelPurInvoiceHeader[cnt].TR_TYPE == 0) {
                $("#chkCash" + cnt).prop("checked", false);

            } else {
                $("#chkCash" + cnt).prop("checked", true);

            }

            $("#txtInvoiceDate" + cnt).val(DateFormat(ModelPurInvoiceHeader[cnt].InvoiceDate));
            $("#txtDiscoutnval" + cnt).val(ModelPurInvoiceHeader[cnt].DISCOUNT);
            $("#txtInvtotal" + cnt).val(ModelPurInvoiceHeader[cnt].TOTAL);

            $("#txtInvVat" + cnt).attr('data-VndVatType', ModelPurInvoiceHeader[cnt].VndVatType);

            //alert(ModelPurInvoiceHeader[cnt].VndVatType);

            $("#txtInvVat" + cnt).val(ModelPurInvoiceHeader[cnt].Vat);
            $("#txtInvNet" + cnt).val(ModelPurInvoiceHeader[cnt].NetATax);
            $("#txtAccCode" + cnt).val(ModelPurInvoiceHeader[cnt].PAY_ACC_CODE);
            $("#txtAccDesc" + cnt).val(ModelPurInvoiceHeader[cnt].ACC_DESCA);
            $("#txtInvoiceDesc" + cnt).val(ModelPurInvoiceHeader[cnt].REMARK);
            $("#txt_StatusFlag1" + cnt).val("");
        }
        return;

    }
    //function AddNewRow_Header() {

    //    if (!SysSession.CurrentPrivileges.AddNew) return;
    //    var CanAddCharge: boolean = true;
    //    if (CountGrid1 > 0) {

    //        for (var i = 0; i < CountGrid1; i++) {

    //            CanAddCharge = Validation_Grid_Header(i);
    //            if (CanAddCharge == false) {
    //                break;
    //            }
    //        }
    //    }
    //    if (CanAddCharge) {

    //        BuildControls_Header(CountGrid1);
    //        $("#txt_StatusFlag1" + CountGrid1).val("i"); //In Insert mode
    //        $("#txtInvSerial" + CountGrid1).attr("disabled", "disabled");
    //        $("#txtInvTrNO" + CountGrid1).removeAttr("disabled");
    //        $("#btnVendorSrch" + CountGrid1).removeAttr("disabled");
    //        $("#txtVndrCode" + CountGrid1).removeAttr("disabled");
    //        $("#txtVendoeName" + CountGrid1).attr("disabled", "disabled");
    //        $("#chkCash" + CountGrid1).removeAttr("disabled");
    //        $("#txtDiscoutnval" + CountGrid1).removeAttr("disabled");
    //        $("#txtInvoiceDate" + CountGrid1).removeAttr("disabled");
    //        $("#txtInvtotal" + CountGrid1).attr("disabled", "disabled");
    //        $("#txtDocNum" + CountGrid1).attr("disabled", "disabled");
    //        $("#txtInvVat" + CountGrid1).attr("disabled", "disabled");
    //        $("#txtInvNet" + CountGrid1).attr("disabled", "disabled");
    //        $("#btnAccSearch" + CountGrid1).attr("disabled", "disabled");
    //        $("#txtAccCode" + CountGrid1).attr("disabled", "disabled");
    //        $("#txtAccDesc" + CountGrid1).attr("disabled", "disabled");
    //        $("#txtInvoiceDesc" + CountGrid1).removeAttr("disabled");

    //        $("#VND_SERIAL" + CountGrid1).val(CountGrid1 + 1);

    //        GlobalVendorNum = CountGrid1 + 1;
    //        // can delete new inserted record  without need for delete privilage
    //        $("#btn_minus1" + CountGrid1).removeClass("display_none");
    //        $("#btn_minus1" + CountGrid1).removeAttr("disabled");

    //        var count = InvHeaderAssign.filter(s => s.VND_SERIAL == GlobalVendorNum)
    //        if (count.length > 0) {
    //            var count2 = count.length - 1;
    //            AssignForGrids(GlobalVendorNum, count2);
    //        }
    //        ////***new
    //        // 
    //        //InvHeaderAssignSingle.VND_SERIAL = GetMaxVendorSerial();
    //        //$("#VND_SERIAL" + CountGrid1).val(GetMaxVendorSerial().toString());
    //        ////*********
    //        CountGrid1 += 1;
    //        Insert_Serial_Header();

    //    }
    //    $("#DivChargesShow2").addClass("display_none");
    //}
    //function DeleteRowCharge(RecNo: number) {
    //    // 
    //    if (!SysSession.CurrentPrivileges.Remove) return;
    //    WorningMessage("هل تريد الحذف؟", "Do you want to delete?", "تحذير", "worning", () => {

    //        $("#txt_StatusFlag1" + RecNo).val() == 'i' ? $("#txt_StatusFlag1" + RecNo).val('m') : $("#txt_StatusFlag1" + RecNo).val('d');


    //        $("#txtInvTrNO" + RecNo).val("22");
    //        $("#txtVndrCode" + RecNo).val("22");
    //        $("#txtVendoeName" + RecNo).val("22");
    //        $("#txtInvoiceDate" + RecNo).val("22");
    //        $("#txtDiscoutnval" + RecNo).val("22");
    //        $("#txtInvtotal" + RecNo).val("22");
    //        $("#txtInvVat" + RecNo).val("22");
    //        $("#txtAccCode" + RecNo).val("22");
    //        $("#txtAccDesc" + RecNo).val("22");
    //        $("#txtInvoiceDesc" + RecNo).val("22");
    //        GlobalVendorNum = $("#VND_SERIAL" + RecNo).val();
    //        AssignForGrids(GlobalVendorNum, RecNo);
    //        $("#No_Row1" + RecNo).attr("hidden", "true");
    //        $("#div_Data").html("");
    //        $("#DivChargesShow2").addClass("display_none");
    //        Insert_Serial_Header();
    //        ComputeTotals();

    //    });
    //}

    function Validation_Grid_Header(rowcount: number) {
        if ($("#txt_StatusFlag1" + rowcount).val() == "d" || $("#txt_StatusFlag1" + rowcount).val() == "m") {
            return true;
        } else {
            var checked: boolean = $("#chkCash" + rowcount).prop("checked");
            if ($("#txtVendoeName" + rowcount).val() == "") {
                DisplayMassage(" برجاء ادخال المورد", "Please enter the vendor", MessageType.Error);
                Errorinput($("#txtVendoeName" + rowcount));
                return false
            }
            else if ($("#txtAccCode" + rowcount).val() == "" && checked == true) {
                DisplayMassage(" برجاء ادخال الحساب", "Please enter Account code ", MessageType.Error);
                Errorinput($("#txtAccCode" + rowcount));
                return false
            }
            return true;
        }
    }
    function Insert_Serial_Header() {

        let Ser = 1;
        for (let i = 0; i < CountGrid1; i++) {
            var flagvalue = $("#txt_StatusFlag1" + i).val();
            if (flagvalue != "d" && flagvalue != "m") {
                $("#txtInvSerial" + i).val(Ser);
                Ser++;
            }
        }

    }
    function ComputeTotals() {
        var vatAmount = 0;
        var totalAmount = 0;
        var DiscountAmount = 0;
        var netAmount = 0;
        let VaType = 0;
        // Total Detail
        for (let i = 0; i < CountGrid2; i++) {
            if (GlobalVendorNum == Number($("#VND_SERIALDetail" + i).val())) {
                var flagvalue = $("#txt_StatusFlag2" + i).val();
                if (flagvalue != "d" && flagvalue != "m") {
                    vatAmount += Number($("#txtVatAmount" + i).val());
                    vatAmount = Number(vatAmount.RoundToSt(2).toString());

                    totalAmount += Number($("#txtDetailTotal" + i).val());
                    totalAmount = Number(totalAmount.RoundToSt(2).toString());

                    netAmount += Number($("#txtDetailNet" + i).val());
                    netAmount = Number(netAmount.RoundToSt(2).toString());
                    VaType = Number($("#txtVatAmount" + i).attr('data-vatType'));
                }
            }
        }
        var ID = GlobalVendorNum - 1
        $("#txtInvtotal" + ID).val(totalAmount.RoundToSt(2));
        $("#txtInvVat" + ID).val(vatAmount.RoundToSt(2));
        $("#txtInvVat" + ID).attr('data-VndVatType', VaType);

        //$("#txtInvNet" + ID).val(netAmount.RoundToSt(2));
        //****new
        if ($("#txt_StatusFlag1" + ID).val() != 'i' && $("#txt_StatusFlag1" + ID).val() != 'd')
            $("#txt_StatusFlag1" + ID).val("u");
        //totalHeaders
        vatAmount = 0;
        totalAmount = 0;
        DiscountAmount = 0;
        netAmount = 0;
        for (let i = 0; i < CountGrid1; i++) {
            var flagvalue = $("#txt_StatusFlag1" + i).val();
            if (flagvalue != "d" && flagvalue != "m") {
                vatAmount += Number($("#txtInvVat" + i).val());
                vatAmount = Number(vatAmount.RoundToSt(2).toString());

                totalAmount += Number($("#txtInvtotal" + i).val());
                totalAmount = Number(totalAmount.RoundToSt(2).toString());

                DiscountAmount += Number($("#txtDiscoutnval" + i).val());
                DiscountAmount = Number(DiscountAmount.RoundToSt(2).toString());

                netAmount += Number($("#txtInvNet" + i).val());
                netAmount = Number(netAmount.RoundToSt(2).toString());

            }
        }
        txtInvTotal.value = totalAmount.RoundToSt(2);
        txtVat.value = vatAmount.RoundToSt(2);
        txtDiscountValue.value = DiscountAmount.RoundToSt(2);
        $('#txtInvNet' + ID).val(((totalAmount + vatAmount) - DiscountAmount).RoundToSt(2));
        txtNet.value = (totalAmount + vatAmount - DiscountAmount).RoundToSt(2);

    }
    //------------------------------------------------------ Second Controls Grid Region------------------------
    function BuildControls_Details(cnt: number) {
        var html;
        html = '<div id= "No_Row2' + cnt + '" class="container-fluid style_border" > <div class="row" > <div class="col-lg-12 col-md-12 col-sm-12 col-xl-12 col-xs-12 " > ' +
            '<span id="btn_minus2' + cnt + '" class="fa fa-minus-circle fontitm4PurTrReceive display_none"></span>' +
            '<div class="col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-1 p-0">' +
            '<input id="txtInvoiceDetailID' + cnt + '" type="hidden" class="form-control input-sm right2 display_none"/>' +
            '<input id="VND_SERIALDetail' + cnt + '" type="hidden" class="form-control input-sm right2 display_none"/>' +
            //**new
            '<input id="txtTR_SERIAL' + cnt + '" type="hidden" class="form-control input-sm right2 display_none"/>' +
            //***
            '<input id="txtDetailSerial' + cnt + '" type="text" class="form-control input-sm right2" disabled value="' + cnt + '"/></div>' +

            '<div class="col-lg-3 col-md-3 col-sm-3 col-xl-3 col-xs-3 p-0">' +
            '<button type="button" class="col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-1 src-btn btn btn-search input-sm  btn-warning " id="btnServicSrch' + cnt + '" name="ColSearch">   ' +
            '<i class="fa fa-search  "></i></button>' +
            '<input id="txtServCode' + cnt + '" name="" disabled type="text" class="col-lg-3 col-md-3 col-sm-3 col-xl-3 col-xs-3 form-control input-sm  text_Display  "/>' +
            '<input id="txtServName' + cnt + '" name="" disabled type="text" class="form-control col-lg-8 col-md-8 col-sm-8 col-xl-8 col-xs-8 input-sm  text_Display"/>' +
            '</div>' +
            '<div class="col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-1 p-0">' +
            '<input id="txtQty' + cnt + '" type="number" class="form-control input-sm right2" disabled value="1 "/></div>' +
            '<div class="col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-1 p-0">' +
            '<input id="txtPrice' + cnt + '" type="text" disabled  class="form-control input-sm right2"  value="0"/></div>' +
            '<div class="col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-1 p-0">' +
            '<input id="txtDetailTotal' + cnt + '" type="text"  disabled class="form-control input-sm right2"  value="0"/></div>' +
            '<div class="col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-1 p-0">' +
            '<input id="txtVatPrc' + cnt + '" type="text" disabled class="form-control input-sm right2"   value="0"/></div>' +
            '<div class="col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-1 p-0">' +
            '<input id="txtVatAmount' + cnt + '" type="text" disabled value="0" class="form-control input-sm right2"/></div>' +
            '<div class="col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-1 p-0">' +
            '<input id="txtDetailNet' + cnt + '" type="text" disabled class="form-control input-sm right2"   value="0"/></div>' +
            "<div class='col-lg-8 col-md-8 col-sm-8 col-xl-8 col-xs-8' style='position: absolute; right: 82% '>" +
            '<button type="button" class="col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-1 src-btn btn btn-search input-sm btn-warning " id="btnCostCntrSrch' + cnt + '" name="ColSearch">   ' +
            '<i class="fa fa-search  "></i></button>' +
            '<input id="txtCCcode' + cnt + '" name="" disabled type="text" class="col-lg-2 col-md-2 col-sm-2 col-xl-2 col-xs-2 form-control input-sm  text_Display  "/>' +
            '<input id="txtCCName' + cnt + '" name="" disabled type="text" class="form-control input-sm col-lg-3 col-md-3 col-sm-3 col-xl-3 col-xs-3  text_Display"/>' +
            '<input id="txtCRemarks' + cnt + '" name="" disabled type="text" class="form-control input-sm col-lg-5 col-md-5 col-sm-5 col-xl-5 col-xs-5  text_Display"/>' +
            "</div>" +

            '</div>' +

            ' </div></div>' +
            '<input id="txt_StatusFlag2' + cnt + '" name = " " type = "hidden" class="form-control input-sm"/><input id="txt_ID1' + cnt + '" name = " " type = "hidden" class="form-control input-sm"/>';

        $("#div_Data").append(html);

        //// service Search
        $('#btnServicSrch' + cnt).click(function (e) {
            let sys: SystemTools = new SystemTools();

            sys.FindKey(Modules.Ser_Purchasing, "btnServiceSearch", "CompCode=" + compcode + "and IsPurchase = 'True' ", () => {
                let id = SearchGrid.SearchDataGrid.SelectedKey;

                $("#txtQuantity" + cnt).val("1");
                $("#txtPrice" + cnt).val("1");
                $("#txtDetailTotal" + cnt).val("0");
                $("#txtVatAmount" + cnt).val("0");
                $("#txtDetailNet" + cnt).val("0");

                if ($("#txt_StatusFlag2" + cnt).val() != "i")
                    $("#txt_StatusFlag2" + cnt).val("u");

                var itemID = Number(id);
                var NumberSelect = ServicesDetails.filter(s => s.Itemid == itemID);

                if (NumberSelect.length > 0) {
                    $('#txtServCode' + cnt).val(NumberSelect[0].ItemCode);
                    $('#txtServName' + cnt).val((lang == "ar" ? NumberSelect[0].Itm_DescA : NumberSelect[0].Itm_DescE));

                    var itemPrice = NumberSelect[0].UnitPrice;
                    $("#txtPrice" + cnt).val(itemPrice);
                    var txtQuantityValue = $("#txtQty" + cnt).val();
                    var txtPriceValue = $("#txtPrice" + cnt).val();

                    var catID = NumberSelect[0].SrvCategoryID;
                    var catObj = CategorDetails.filter(s => s.SrvCategoryID == catID);
                    let Cat_Tax = DetailsVatNature.filter(s => s.VatNatID == catObj[0].VatNatID);
                    Tax_Rate = Cat_Tax[0].VatPrc;

                    Tax_Type_Model = GetVat(Cat_Tax[0].VatNatID, Tax_Rate, vatType);

                    Tax_Rate = Tax_Type_Model.Prc;

                    $('#txtVatPrc' + cnt).val(Tax_Rate);
                    var total = Number(txtQuantityValue) * Number(txtPriceValue);
                    $("#txtDetailTotal" + cnt).val(total.RoundToSt(2));
                    VatPrc = Tax_Rate;
                    var vatAmount = Number(total.RoundToSt(2)) * VatPrc / 100;
                    $("#txtVatAmount" + cnt).val(vatAmount.RoundToSt(2));
                    var totalAfterVat = Number(vatAmount) + Number(total);
                    $("#txtDetailNet" + cnt).val(totalAfterVat.RoundToSt(2));

                }
                ComputeTotals();
                GlobalVendorNum = $("#VND_SERIALDetail" + cnt).val();
                ComputeTotals();
                var Serial = $("#txtDetailSerial" + cnt).val();
                AssignDetailsForGrids(GlobalVendorNum, cnt, Serial);
            });


        });
        $("#txtServCode" + cnt).on('change', function () {
            if ($("#txt_StatusFlag2" + cnt).val() != "i")
                $("#txt_StatusFlag2" + cnt).val("u");
            var code = $('#txtServCode' + cnt).val();
            var NumberSelect = ServicesDetails.filter(s => s.ItemCode == code);

            if (NumberSelect.length > 0) {
                $('#txtServName' + cnt).val((lang == "ar" ? NumberSelect[0].Itm_DescA : NumberSelect[0].Itm_DescE));

                var itemPrice = NumberSelect[0].UnitPrice;
                $("#txtPrice" + cnt).val(itemPrice);
                var txtQuantityValue = $("#txtQty" + cnt).val();
                var txtPriceValue = $("#txtPrice" + cnt).val();

                var catID = NumberSelect[0].SrvCategoryID;
                var catObj = CategorDetails.filter(s => s.SrvCategoryID == catID);
                let Cat_Tax = DetailsVatNature.filter(s => s.VatNatID == catObj[0].VatNatID);
                Tax_Rate = Cat_Tax[0].VatPrc;

                Tax_Type_Model = GetVat(Cat_Tax[0].VatNatID, Tax_Rate, vatType);

                Tax_Rate = Tax_Type_Model.Prc;



                $('#txtVatPrc' + cnt).val(Tax_Rate);
                var total = Number(txtQuantityValue) * Number(txtPriceValue);
                $("#txtDetailTotal" + cnt).val(total.RoundToSt(2));
                VatPrc = Tax_Rate;
                var vatAmount = Number(total.RoundToSt(2)) * VatPrc / 100;

                $("#txtVatAmount" + cnt).attr('data-vatType', Tax_Type_Model.VatType);
                $("#txtVatAmount" + cnt).val(vatAmount.RoundToSt(2));
                var totalAfterVat = Number(vatAmount) + Number(total);
                $("#txtDetailNet" + cnt).val(totalAfterVat.RoundToSt(2));

            } else {
                $("#txtQuantity" + cnt).val("1");
                $("#txtPrice" + cnt).val("1");
                $("#txtDetailTotal" + cnt).val("0");
                $("#txtVatAmount" + cnt).val("0");
                $("#txtDetailNet" + cnt).val("0");
                $('#txtServCode' + cnt).val("");
                $('#txtServName' + cnt).val("");
                DisplayMassage("كود الخدمه غير صحيح ", "Wrong service code ", MessageType.Error);
            }
            ComputeTotals();
            GlobalVendorNum = $("#VND_SERIALDetail" + cnt).val();
            ComputeTotals();
            var Serial = $("#txtDetailSerial" + cnt).val();
            AssignDetailsForGrids(GlobalVendorNum, cnt, Serial);
        });

        // Cost Center Search
        $('#btnCostCntrSrch' + cnt).click(function (e) {
            let sys: SystemTools = new SystemTools();

            sys.FindKey(Modules.Ser_Purchasing, "btnCostCenterSearch", "COMP_CODE=" + compcode + "and ACTIVE = 1 ", () => {
                let id = SearchGrid.SearchDataGrid.SelectedKey;
                GetCostCenterByCode(id);
                $('#txtCCName' + cnt).val((lang == "ar" ? CostCenterDetails.CC_DESCA : CostCenterDetails.CC_DESCE));
                $('#txtCCcode' + cnt).val(CostCenterDetails.CC_CODE);
                if ($("#txt_StatusFlag2" + cnt).val() != "i")
                    $("#txt_StatusFlag2" + cnt).val("u");

                GlobalVendorNum = $("#VND_SERIALDetail" + cnt).val();
                var Serial = $("#txtDetailSerial" + cnt).val();
                AssignDetailsForGrids(GlobalVendorNum, cnt, Serial);
            });
        });
        $("#txtCCcode" + cnt).on('change', function () {
            if ($("#txt_StatusFlag2" + cnt).val() != "i")
                $("#txt_StatusFlag2" + cnt).val("u");
            var id = $('#txtCCcode' + cnt).val();
            GetCostCenterByCode(id);
            if (CostCenterDetails != null) {
                $('#txtCCName' + cnt).val((lang == "ar" ? CostCenterDetails.CC_DESCA : CostCenterDetails.CC_DESCE));
                $('#txtCCcode' + cnt).val(CostCenterDetails.CC_CODE);
            } else {
                DisplayMassage("كود مركز التكلفه غير صحيح ", "Wrong Cost Center code ", MessageType.Error);
                $('#txtCCName' + cnt).val("");
                $('#txtCCcode' + cnt).val("");
            }

            GlobalVendorNum = $("#VND_SERIALDetail" + cnt).val();
            var Serial = $("#txtDetailSerial" + cnt).val();
            AssignDetailsForGrids(GlobalVendorNum, cnt, Serial);

        });

        // events
        $("#txtQty" + cnt).on('keyup', function () {
            if ($("#txt_StatusFlag2" + cnt).val() != "i")
                $("#txt_StatusFlag2" + cnt).val("u");

            var txtQuantityValue = $("#txtQty" + cnt).val();
            var txtPriceValue = $("#txtPrice" + cnt).val();
            var total = 0;

            var quntity = Number(Number(txtQuantityValue).RoundToSt(2));
            if ($("#txtPrice" + cnt).val() == 0) { total = quntity * 1; }
            else { total = quntity * Number(txtPriceValue); }

            $("#txtDetailTotal" + cnt).val(total.RoundToSt(2));
            VatPrc = $("#txtVatPrc" + cnt).val();
            var vatAmount = Number(total) * VatPrc / 100;
            $("#txtVatAmount" + cnt).val(vatAmount.RoundToSt(2));
            var totalAfterVat = Number(vatAmount.RoundToSt(2)) + Number(total.RoundToSt(2));
            $("#txtDetailNet" + cnt).val(totalAfterVat.RoundToSt(2));

            GlobalVendorNum = $("#VND_SERIALDetail" + cnt).val();
            var Serial = $("#txtDetailSerial" + cnt).val();
            AssignDetailsForGrids(GlobalVendorNum, cnt, Serial);
            ComputeTotals();
        });

        $("#txtPrice" + cnt).on('keyup', function () {
            if ($("#txt_StatusFlag2" + cnt).val() != "i")
                $("#txt_StatusFlag2" + cnt).val("u");

            var txtQuantityValue = $("#txtQty" + cnt).val();
            var txtPriceValue = $("#txtPrice" + cnt).val();

            var total = Number(txtQuantityValue) * Number(txtPriceValue);
            VatPrc = $("#txtVatPrc" + cnt).val();
            var vatAmount = Number(total) * VatPrc / 100;
            $("#txtVatAmount" + cnt).val(vatAmount.RoundToSt(2));
            var total = Number(txtQuantityValue) * Number(txtPriceValue);
            $("#txtDetailTotal" + cnt).val(total.RoundToSt(2));

            var totalAfterVat = Number(vatAmount.RoundToSt(2)) + Number(total.RoundToSt(2));
            $("#txtDetailNet" + cnt).val(totalAfterVat.RoundToSt(2));

            GlobalVendorNum = $("#VND_SERIALDetail" + cnt).val();
            var Serial = $("#txtDetailSerial" + cnt).val();
            AssignDetailsForGrids(GlobalVendorNum, cnt, Serial);
            ComputeTotals();
        });


        $("#txtCRemarks" + cnt).on('keyup', function () {
            if ($("#txt_StatusFlag2" + cnt).val() != "i")
                $("#txt_StatusFlag2" + cnt).val("u");

        });

        $("#txtInvoiceDesc" + cnt).on('keyup', function () {
            if ($("#txt_StatusFlag2" + cnt).val() != "i")
                $("#txt_StatusFlag2" + cnt).val("u");

            var Serial = $("#txtDetailSerial" + cnt).val();
            AssignDetailsForGrids(GlobalVendorNum, cnt, Serial);
        });


        $("#btn_minus2" + cnt).on('click', function () {
            DeleteRowDetail(cnt);
        });

        return;

    }
    //function AddNewRow_Details() {

    //    if (!SysSession.CurrentPrivileges.AddNew) return;
    //    var CanAddCharge: boolean = true;
    //    if (CountGrid2 > 0) {

    //        for (var i = 0; i < CountGrid2; i++) {
    //            CanAddCharge = Validation_Grid_Detail(i);
    //            if (CanAddCharge == false) {
    //                break;
    //            }
    //        }
    //    }
    //    if (CanAddCharge) {
    //        BuildControls_Details(CountGrid2);
    //        $("#txt_StatusFlag2" + CountGrid2).val("i"); //In Insert mode
    //        $("#txtDetailSerial" + CountGrid2).attr("disabled", "disabled");
    //        $("#btnServicSrch" + CountGrid2).removeAttr("disabled");
    //        $("#txtServCode" + CountGrid2).removeAttr("disabled");
    //        $("#txtServName" + CountGrid2).attr("disabled", "disabled");
    //        $("#txtQty" + CountGrid2).removeAttr("disabled");
    //        $("#txtPrice" + CountGrid2).removeAttr("disabled");
    //        $("#txtDetailTotal" + CountGrid2).attr("disabled", "disabled");
    //        $("#txtVatPrc" + CountGrid2).attr("disabled", "disabled");
    //        $("#txtVatAmount" + CountGrid2).attr("disabled", "disabled");
    //        $("#txtDetailNet" + CountGrid2).attr("disabled", "disabled");

    //        $("#VND_SERIALDetail" + CountGrid2).val(GlobalVendorNum);

    //        $("#btnCostCntrSrch" + CountGrid2).removeAttr("disabled");
    //        $("#txtCCcode" + CountGrid2).removeAttr("disabled");
    //        $("#txtCCName" + CountGrid2).attr("disabled", "disabled");

    //        // can delete new inserted record  without need for delete privilage
    //        $("#btn_minus2" + CountGrid2).removeClass("display_none");
    //        $("#btn_minus2" + CountGrid2).removeAttr("disabled");

    //         
    //        CountGrid2 += 1;
    //        Insert_Serial_Detail(GlobalVendorNum);
    //        var count = DetailList.filter(s => s.VND_SERIAL == GlobalVendorNum)
    //        if (count.length > 0) {
    //            var count2 = count.length - 1;
    //            var x = CountGrid2 - 1;
    //            var Serial = $("#txtDetailSerial" + x).val();
    //            AssignDetailsForGrids(GlobalVendorNum, count2, Serial);
    //        }
    //    }
    //}
    function Validation_Grid_Detail(rowcount: number) {
        if ($("#txt_StatusFlag2" + rowcount).val() == "d" || $("#txt_StatusFlag2" + rowcount).val() == "m") {
            return true;
        } else {
            var Qty: number = Number($("#txtQty" + rowcount).val());
            var Price: number = Number($("#txtPrice" + rowcount).val());

            if ($("#txtServCode" + rowcount).val() == "") {
                DisplayMassage(" برجاء ادخال الخدمة", "Please enter the service", MessageType.Error);
                Errorinput($("#txtServCode" + rowcount));
                return false
            }
            else if ($("#txtCCcode" + rowcount).val() == "") {
                DisplayMassage(" برجاء ادخال مركز التكلفة", "Please enter  Cost center ", MessageType.Error);
                Errorinput($("#txtCCcode" + rowcount));
                return false
            }
            else if (Qty == 0) {
                DisplayMassage(" برجاء ادخال الكمية ", "Please enter the Quantity ", MessageType.Error);
                Errorinput($("#txtQty" + rowcount));
                return false
            }
            else if (Price == 0) {
                DisplayMassage(" برجاء ادخال السعر", "Please enter the Price", MessageType.Error);
                Errorinput($("#txtPrice" + rowcount));
                return false
            }
            return true;
        }
    }
    function Insert_Serial_Detail(GlobalVendorNum: number) {
        let Ser = 1;
        for (let i = 0; i < CountGrid2; i++) {
            var flagvalue = $("#txt_StatusFlag2" + i).val();
            var fvndSer = $("#VND_SERIALDetail" + i).val();
            if (flagvalue != "d" && flagvalue != "m" && fvndSer == GlobalVendorNum) {
                $("#txtDetailSerial" + i).val(Ser);
                Ser++;
            }
        }
    }
    function DeleteRowDetail(RecNo: number) {
        // 
        if (!SysSession.CurrentPrivileges.Remove) return;
        WorningMessage("هل تريد الحذف؟", "Do you want to delete?", "تحذير", "worning", () => {

            $("#txt_StatusFlag2" + RecNo).val() == 'i' ? $("#txt_StatusFlag2" + RecNo).val('m') : $("#txt_StatusFlag2" + RecNo).val('d');


            $("#txtServCode" + RecNo).val("22");
            $("#txtServName" + RecNo).val("22");
            $("#txtQty" + RecNo).val("22");
            $("#txtPrice" + RecNo).val("22");
            $("#txtDetailTotal" + RecNo).val("22");
            $("#txtVatPrc" + RecNo).val("22");
            $("#txtVatAmount" + RecNo).val("22");
            $("#txtDetailNet" + RecNo).val("22");
            $("#txtCCcode" + RecNo).val("22");
            $("#txtCCName" + RecNo).val("22");

            $("#No_Row2" + RecNo).attr("hidden", "true");

            GlobalVendorNum = $("#VND_SERIALDetail" + RecNo).val();
            var Serial = $("#txtDetailSerial" + RecNo).val();
            Insert_Serial_Detail(GlobalVendorNum);


            ComputeTotals();
        });
    }
    function ValidationDetailBeforeSave(rowcount: number) {
        if (DetailList[rowcount].StatusFlag == "d" || DetailList[rowcount].StatusFlag == "m") {
            return true;
        } else {
            var Qty: number = Number(DetailList[rowcount].SoldQty);
            var Price: number = Number(DetailList[rowcount].NetUnitPrice);

            if (DetailList[rowcount].ItemID == 0) {
                DisplayMassage(" برجاء  التأكد من ادخال جميع الخدمات", "Please enter the service", MessageType.Error);
                return false
            }
            else if (DetailList[rowcount].CC_CODE == "") {
                DisplayMassage(" برجاء  التأكد من ادخال جميع  مراكز التكلفة", "Please enter  Cost center ", MessageType.Error);
                return false
            }
            else if (Qty == 0) {
                DisplayMassage(" برجاءالتأكد من ادخال جميع الكميات ", "Please enter the Quantity ", MessageType.Error);

                return false
            }
            else if (Price == 0) {
                DisplayMassage(" برجاء التأكد من ادخال جميع الاسعار", "Please enter the Price", MessageType.Error);

                return false
            }
            return true;
        }
    }
    //------------------------------------------------------ Assigns Region------------------------
    function AssignForGrids(GlobalVendorNum: number, cnt: number) {
        var HeaderObj = InvHeaderAssign.filter(s => s.VND_SERIAL == GlobalVendorNum);
        InvHeaderAssignSingle = new AVAT_TR_PurInvoiceHeader;
        InvHeaderAssignSingle.InvoiceHeaderID = Number($("#txtInvoiceHeaderID" + cnt).val());
        InvHeaderAssignSingle.InvoiceId = 0;
        InvHeaderAssignSingle.DocNo = $("#txtDocNum" + cnt).val();

        InvHeaderAssignSingle.VND_SERIAL = GlobalVendorNum;
        var vndCode = $("#txtVndrCode" + cnt).val();
        var vndObj = VendorDetailList.filter(s => s.VendorCode == vndCode);
        if (vndObj.length > 0)
            InvHeaderAssignSingle.VendorID = vndObj[0].VendorID;
        var checked: boolean = $("#chkCash" + cnt).prop("checked");
        if (checked == true) {
            InvHeaderAssignSingle.TR_TYPE = 1;
        } else {
            InvHeaderAssignSingle.TR_TYPE = 0;
        }
        InvHeaderAssignSingle.VENDOR_NAME = $("#txtVendoeName" + cnt).val();
        InvHeaderAssignSingle.TOTAL = $("#txtInvtotal" + cnt).val();
        InvHeaderAssignSingle.DISCOUNT = $("#txtDiscoutnval" + cnt).val();
        InvHeaderAssignSingle.PAID = 0;

        //InvHeaderAssignSingle.VndVatType = Number($("#txtInvVat" + cnt).attr('data-VndVatType'));
        InvHeaderAssignSingle.VndVatType = vatType;
        InvHeaderAssignSingle.Vat = $("#txtInvVat" + cnt).val();
        InvHeaderAssignSingle.NetATax = $("#txtInvNet" + cnt).val();
        InvHeaderAssignSingle.VatApplied = false;

        //InvHeaderAssignSingle.VndVatType = 0;

        InvHeaderAssignSingle.VatPrc = VatPrc;
        InvHeaderAssignSingle.SalesType = 0;
        InvHeaderAssignSingle.PAY_ACC_CODE = $("#txtAccCode" + cnt).val();
        InvHeaderAssignSingle.REMARK = $("#txtInvoiceDesc" + cnt).val();
        InvHeaderAssignSingle.CompCode = Number(compcode);
        InvHeaderAssignSingle.BranchCode = BranchCode;
        InvHeaderAssignSingle.InvoiceDate = $("#txtInvoiceDate" + cnt).val();
        InvHeaderAssignSingle.Ref_No = $("#txtInvTrNO" + cnt).val();
        InvHeaderAssignSingle.StatusFlag = $("#txt_StatusFlag1" + cnt).val();


        if (HeaderObj[0] == null) {
            InvHeaderAssign.push(InvHeaderAssignSingle);
        } else {
            var objIndex = InvHeaderAssign.indexOf(HeaderObj[0]);
            InvHeaderAssign[objIndex] = InvHeaderAssignSingle;
            if (InvHeaderAssignSingle.StatusFlag == 'm') {
                InvHeaderAssign.splice(objIndex, 1);
            }
        }


    }
    function AssignDetailsForGrids(GlobalVendorNum: number, cnt: number, DetailSerial: number) {
        var HeaderObj = DetailList.filter(s => s.VND_SERIAL == GlobalVendorNum && s.TR_SERIAL == DetailSerial);
        InvDetailAssignSingle = new AVAT_TR_PurInvoiceDetail;

        InvDetailAssignSingle.InvoiceDetailID = Number($("#txtInvoiceDetailID" + cnt).val());


        InvDetailAssignSingle.InvoiceHeaderID = 0;
        InvDetailAssignSingle.InvoiceId = 0;
        InvDetailAssignSingle.TR_SERIAL = DetailSerial;
        InvDetailAssignSingle.VND_SERIAL = GlobalVendorNum;
        var itemcode = $("#txtServCode" + cnt).val();
        var itemobj = ServicesDetails.filter(s => s.ItemCode == itemcode)
        if (itemobj.length > 0) {
            InvDetailAssignSingle.ItemID = itemobj[0].Itemid;
            var catID = itemobj[0].SrvCategoryID;
            InvDetailAssignSingle.UomID = itemobj[0].UomID;
            var catObj = CategorDetails.filter(s => s.SrvCategoryID == catID);
            InvDetailAssignSingle.VatNatID = catObj[0].VatNatID;
        }
        InvDetailAssignSingle.SoldQty = $("#txtQty" + cnt).val();
        InvDetailAssignSingle.Unitprice = $("#txtPrice" + cnt).val();
        InvDetailAssignSingle.DiscountPrc = 0;
        InvDetailAssignSingle.DiscountAmount = 0;
        InvDetailAssignSingle.NetUnitPrice = $("#txtPrice" + cnt).val();
        InvDetailAssignSingle.ItemTotal = $("#txtDetailTotal" + cnt).val();
        InvDetailAssignSingle.VatApplied = VatPrc;
        InvDetailAssignSingle.VatPrc = $("#txtVatPrc" + cnt).val();
        InvDetailAssignSingle.VatAmount = $("#txtVatAmount" + cnt).val();
        InvDetailAssignSingle.NetAfterVat = $("#txtDetailNet" + cnt).val();
        InvDetailAssignSingle.REMARK = "";
        InvDetailAssignSingle.ACTUAL_DATE = "";
        InvDetailAssignSingle.QTY_RET = 0;
        InvDetailAssignSingle.CC_CODE = $("#txtCCcode" + cnt).val();
        InvDetailAssignSingle.REMARK = $("#txtCRemarks" + cnt).val();
        InvDetailAssignSingle.CompCode = Number(compcode);
        InvDetailAssignSingle.BranchCode = BranchCode;
        InvDetailAssignSingle.StatusFlag = $("#txt_StatusFlag2" + cnt).val();;

        if (HeaderObj[0] == null) {
            DetailList.push(InvDetailAssignSingle);
        } else {
            var objIndex = DetailList.indexOf(HeaderObj[0]);
            DetailList[objIndex] = InvDetailAssignSingle;
            if (InvDetailAssignSingle.StatusFlag == 'm') {
                DetailList.splice(objIndex, 1);
            }
        }
    }
    function DisplayGridDetails(GlobalVendorNum: number) {
        $("#div_Data").html("");
        $("#DivChargesShow2").removeClass("display_none");
        var DetailArray = new Array<AVAT_TR_PurInvoiceDetail>();
        var DetailArrayShow = new Array<AQVAT_GetPurInvoiceDetail>();
        if (showFlag == true) {
            DetailArrayShow = HeaderWithDetailModel.AQVAT_GetPurInvoiceDetail.filter(x => x.VND_SERIAL == GlobalVendorNum && x.InvoiceId == GlobalMenuID)
            CountGrid2 = DetailArrayShow.length;
            for (var i = 0; i < DetailArrayShow.length; i++) {
                BuildControls_Details(i);
                $("#txtInvoiceDetailID" + i).val(DetailArrayShow[i].InvoiceDetailID);
                $("#txtDetailSerial" + i).val(DetailArrayShow[i].TR_SERIAL);
                $("#VND_SERIALDetail" + i).val(GlobalVendorNum);
                var itemobj = ServicesDetails.filter(s => s.Itemid == DetailArrayShow[i].ItemID);
                if (itemobj.length > 0) {
                    $("#txtServCode" + i).val(itemobj[0].ItemCode);
                    $("#txtServName" + i).val(itemobj[0].Itm_DescA);
                }
                $("#txtQty" + i).val(DetailArrayShow[i].SoldQty);
                $("#txtPrice" + i).val(DetailArrayShow[i].NetUnitPrice);
                $("#txtDetailTotal" + i).val(DetailArrayShow[i].ItemTotal);
                $("#txtVatPrc" + i).val(DetailArrayShow[i].VatPrc);
                $("#txtVatAmount" + i).val(DetailArrayShow[i].VatAmount);
                $("#txtDetailNet" + i).val(DetailArrayShow[i].NetAfterVat);
                $("#txtCRemarks" + i).val(DetailArrayShow[i].REMARK);

                $("#txtCCcode" + i).val(DetailArrayShow[i].CC_CODE);
                var costCntrObj = CostCentreDetailsIst.filter(s => s.CC_CODE == DetailArrayShow[i].CC_CODE)
                if (costCntrObj.length > 0) {
                    $("#txtCCName" + i).val(costCntrObj[0].CC_DESCA);
                }


                $("#txt_StatusFlag2" + i).val("");

            }

        } else {
            DetailArray = DetailList.filter(s => s.VND_SERIAL == GlobalVendorNum);
            CountGrid2 = DetailArray.length;
            for (var i = 0; i < DetailArray.length; i++) {
                BuildControls_Details(i);
                var statusFlag = DetailArray[i].StatusFlag;

                $("#txtInvoiceDetailID" + i).val(DetailArray[i].InvoiceDetailID);
                $("#txtDetailSerial" + i).val(DetailArray[i].TR_SERIAL);
                $("#VND_SERIALDetail" + i).val(GlobalVendorNum);
                var itemobj = ServicesDetails.filter(s => s.Itemid == DetailArray[i].ItemID);
                if (itemobj.length > 0) {
                    $("#txtServCode" + i).val(itemobj[0].ItemCode);
                    $("#txtServName" + i).val(itemobj[0].Itm_DescA);
                }
                $("#txtQty" + i).val(DetailArray[i].SoldQty);
                $("#txtPrice" + i).val(DetailArray[i].NetUnitPrice);
                $("#txtDetailTotal" + i).val(DetailArray[i].ItemTotal);
                $("#txtVatPrc" + i).val(DetailArray[i].VatPrc);
                $("#txtVatAmount" + i).val(DetailArray[i].VatAmount);
                $("#txtDetailNet" + i).val(DetailArray[i].NetAfterVat);
                $("#txtCCcode" + i).val(DetailArray[i].CC_CODE);
                $("#txtCRemarks" + i).val(DetailArray[i].REMARK);

                var costCntrObj = CostCentreDetailsIst.filter(s => s.CC_CODE == DetailArray[i].CC_CODE)
                if (costCntrObj.length > 0) {
                    $("#txtCCName" + i).val(costCntrObj[0].CC_DESCA);
                }
                $("#txt_StatusFlag2" + i).val(DetailArray[i].StatusFlag);
                $("#btn_minus2" + i).removeClass("display_none");
                if (statusFlag == "d" || statusFlag == "m") {
                    $("#No_Row2" + i).attr("hidden", "true");
                }
            }
        }
    }
    //------------------------------------------------------ Search && Clear &&Validation  Region------------------------
    function ValidationMenu() {
        var newCount: number = 0;
        for (let i = 0; i < CountGrid1; i++) {
            if ($("#txt_StatusFlag1" + i).val() != "d" && $("#txt_StatusFlag1" + i).val() != "m") {
                newCount++;
            }
        }
        if (!CheckDate(DateFormat(txtTR_DATE.value).toString(), DateFormat(SysSession.CurrentEnvironment.StartDate).toString(), DateFormat(SysSession.CurrentEnvironment.EndDate).toString())) {

            WorningMessage('  التاريخ ليس متطابق مع تاريخ السنه (' + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ')', '  The date is not identical with the date of the year (' + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ')', "تحذير", "worning");
            return
        } else if (txtPerson.value == "null") {
            DisplayMassage('(برجاء ادخال المندوب)', '(Please Enter the  customer)', MessageType.Error);
            Errorinput(txtPerson);
            return false
        }
        else if (newCount == 0) {
            DisplayMassage(" برجاء ادخال  الفواتير", "Please enter Invoice data", MessageType.Error);
            return false
        }
        return true;
    }
    //function ValidationHeaderWithDetail(cnt: number) {
    //    var newCount: number = 0;
    //    if (isNew == false) {
    //        DisplayInvoicesDetails($("#txtInvoiceHeaderID" + cnt).val())
    //    }
    //    if ($("#txt_StatusFlag1" + cnt).val() != "d" && $("#txt_StatusFlag1" + cnt).val() != "m") {
    //        for (let j = 0; j < DetailList.length; j++) {
    //            if ((InvHeaderAssign[cnt].VND_SERIAL == DetailList[j].VND_SERIAL) && DetailList[j].StatusFlag != "m") {
    //                newCount++;
    //            }
    //        }
    //        if (newCount == 0) {
    //            var ser = $("#txtInvSerial" + cnt).val();
    //            DisplayMassage('الفاتورة مسلسل  ' + ser + 'لا يوجد لها تفاصيل ', 'invoice Number ' + ser + ' have no details', MessageType.Error);
    //            Errorinput($("#txtInvSerial" + cnt));
    //            return false;
    //        }
    //    }

    //    return true;
    //}
    function clear() {
        $("#div_Master :input").val("");

        $("#divData_Header").html("");
        $("#div_Data").html("");

        txtTR_DATE.value = GetDate(); 

        txtPerson.value = "";

        txtCreatedBy.value = "";
        txtCreatedAt.value = "";
        txtUpdatedAt.value = "";
        txtUpdatedBy.value = "";

        CountGrid1 = 0;
        CountGrid2 = 0;

        InvHeaderAssign = new Array<AVAT_TR_PurInvoiceHeader>();
        DetailList = new Array<AVAT_TR_PurInvoiceDetail>();

        //***new
        CurrentVendorSerial = 0;
        DetailList = new Array<AVAT_TR_PurInvoiceDetail>();
        chkClosed.checked = false;
    }
    function EnableControls() {
        $("#DivFilter").addClass("disabledDiv");
        $("#divMasterGridiv").addClass("disabledDiv");

        $("#divDetails").removeClass("display_none");
        $("#div_Master :input").prop("disabled", false);
        $("#btnSave").removeClass("display_none");
        $("#btnBack").removeClass("display_none");
        $("#btnUpdate").addClass("display_none");

        $("#btnAddHeaderControls").removeClass("display_none");
        $("#btnAddChildControls").removeClass("display_none");

        for (let i = 0; i < CountGrid1; i++) {

            $("#txtInvSerial" + i).attr("disabled", "disabled");
            $("#txtInvTrNO" + i).removeAttr("disabled");
            $("#btnVendorSrch" + i).removeAttr("disabled");
            $("#txtVndrCode" + i).removeAttr("disabled");
            $("#txtDocNum" + i).attr("disabled", "disabled");
            $("#txtVendoeName" + i).attr("disabled", "disabled");
            $("#chkCash" + i).removeAttr("disabled");
            var checked: boolean = $("#chkCash" + i).prop("checked");
            if (checked == true) {
                $("#btnAccSearch" + i).removeAttr("disabled");
                $("#txtAccCode" + i).removeAttr("disabled");
            } else {
                $("#btnAccSearch" + i).attr("disabled", "disabled");
                $("#txtAccCode" + i).attr("disabled", "disabled");
            }
            $("#txtInvoiceDate" + i).removeAttr("disabled");
            $("#txtDiscoutnval" + i).removeAttr("disabled");
            $("#txtInvtotal" + i).attr("disabled", "disabled");
            $("#txtInvVat" + i).attr("disabled", "disabled");
            $("#txtInvNet" + i).attr("disabled", "disabled");

            $("#txtAccDesc" + i).attr("disabled", "disabled");
            $("#txtInvoiceDesc" + i).removeAttr("disabled");

            $("#btn_minus1" + i).removeClass("display_none");
        }
        for (let i = 0; i < CountGrid2; i++) {
            $("#txtDetailSerial" + i).attr("disabled", "disabled");
            $("#btnServicSrch" + i).removeAttr("disabled");
            $("#txtServCode" + i).removeAttr("disabled");
            $("#txtServName" + i).attr("disabled", "disabled");
            $("#txtQty" + i).removeAttr("disabled");
            $("#txtPrice" + i).removeAttr("disabled");
            $("#txtDetailTotal" + i).attr("disabled", "disabled");
            $("#txtVatPrc" + i).attr("disabled", "disabled");
            $("#txtVatAmount" + i).attr("disabled", "disabled");
            $("#txtDetailNet" + i).attr("disabled", "disabled");
            $("#btnCostCntrSrch" + i).removeAttr("disabled");
            $("#txtCCcode" + i).removeAttr("disabled");
            $("#txtCRemarks" + i).removeAttr("disabled");
            $("#txtCCName" + i).attr("disabled", "disabled");

            $("#btn_minus2" + i).removeClass("display_none");
        }
        txtCreatedAt.disabled = true;
        txtCreatedBy.disabled = true;
        txtUpdatedAt.disabled = true;
        txtUpdatedBy.disabled = true;
        $("#txtVoucherNo").attr("disabled", "disabled");


        txtInvTotal.disabled = true;
        txtVat.disabled = true;
        txtDiscountValue.disabled = true;
        txtNet.disabled = true;
        chkClosed.disabled = !SysSession.CurrentPrivileges.CUSTOM1; 
        txtMenuNum.disabled = true;
    }
    function DisableControls() {
        $("#DivFilter").removeClass("disabledDiv");
        $("#divMasterGridiv").removeClass("disabledDiv");

        $("#div_Master :input").prop("disabled", true);
        $("#btnSave").addClass("display_none");
        $("#btnBack").addClass("display_none");
        $("#btnUpdate").removeClass("display_none"); 
        $("#TR_DATE").attr("disabled", "disabled");
        $("#btnAddHeaderControls").addClass("display_none");
        $("#btnAddChildControls").addClass("display_none");
        for (let i = 0; i < CountGrid1; i++) {
            $("#txtInvSerial" + i).attr("disabled", "disabled");
            $("#txtDocNum" + i).attr("disabled", "disabled");
            $("#txtInvTrNO" + i).attr("disabled", "disabled");
            $("#btnVendorSrch" + i).attr("disabled", "disabled");
            $("#txtVndrCode" + i).attr("disabled", "disabled");
            $("#txtVendoeName" + i).attr("disabled", "disabled");
            $("#chkCash" + i).attr("disabled", "disabled");
            $("#txtInvoiceDate" + i).attr("disabled", "disabled");
            $("#txtDiscoutnval" + i).attr("disabled", "disabled");
            $("#txtInvtotal" + i).attr("disabled", "disabled");
            $("#txtInvVat" + i).attr("disabled", "disabled");
            $("#txtInvNet" + i).attr("disabled", "disabled");
            $("#btnAccSearch" + i).attr("disabled", "disabled");
            $("#txtAccCode" + i).attr("disabled", "disabled");
            $("#txtAccDesc" + i).attr("disabled", "disabled");
            $("#txtInvoiceDesc" + i).attr("disabled", "disabled");

            $("#btn_minus1" + i).addClass("display_none");
        }
        for (let i = 0; i < CountGrid2; i++) {
            $("#txtDetailSerial" + i).attr("disabled", "disabled");
            $("#btnServicSrch" + i).attr("disabled", "disabled");
            $("#txtServCode" + i).attr("disabled", "disabled");
            $("#txtServName" + i).attr("disabled", "disabled");
            $("#txtQty" + i).attr("disabled", "disabled");
            $("#txtPrice" + i).attr("disabled", "disabled");
            $("#txtDetailTotal" + i).attr("disabled", "disabled");
            $("#txtVatPrc" + i).attr("disabled", "disabled");
            $("#txtVatAmount" + i).attr("disabled", "disabled");
            $("#txtDetailNet" + i).attr("disabled", "disabled");
            $("#btnCostCntrSrch" + i).attr("disabled", "disabled");
            $("#txtCCcode" + i).attr("disabled", "disabled");
            $("#txtCRemarks" + i).attr("disabled", "disabled");
            $("#txtCCName" + i).attr("disabled", "disabled");

            $("#btn_minus2" + i).addClass("display_none");
        }
    }
    //------------------------------------------------------ Get Functions  Region------------------------
    function GetAllVendors() {
        Ajax.Callsync({
            type: "Get",//GetAll(int CompCode
            url: sys.apiUrl("AccDefVendor", "GetAll"),
            data: { CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    VendorDetailList = result.Response as Array<A_Pay_D_Vendor>;
                }
            }
        });
    }
    function GetVendorByID(id: number) {
        var VendObj = VendorDetailList.filter(s => s.VendorID == id);
        VendorDetail = VendObj[0];
    }
    function GetAccByCode(AccCode: string): boolean {
        var flag: boolean = true;
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GLDefAccount", "GetActivAccByCode"),
            data: { CompCode: compcode, AccCode: AccCode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    AccountDetails = result.Response as A_ACCOUNT;
                }
            }
        });
        return flag;
    }
    function GetAllServices() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AVatDService", "GetAllFromView"),
            data: {
                compcode: compcode, ispur: true, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    ServicesDetails = result.Response as Array<AQVAT_GetService>;
                }
            }
        });
    }
    function FillddlFamily() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AVATSrvCategory", "GetServiceCat"),
            data: {
                compcode: compcode, IsPurchase: true, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    CategorDetails = result.Response as Array<AVAT_D_SrvCategory>;
                    GetAllServices();
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
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    DetailsVatNature = result.Response as Array<G_VatNature>;
                }
            }
        });
    }
    function GetAllCostCenters() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GLTrVoucher", "GetAllCostCenters"),
            data: { CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    CostCentreDetailsIst = result.Response as Array<G_COST_CENTER>;
                }
            }
        });
    }
    function GetCostCenterByCode(CC_Code: string) {
        var obj = CostCentreDetailsIst.filter(s => s.CC_CODE == CC_Code && s.ACTIVE == true);
        CostCenterDetails = obj[0];
    }
    function updateDocNumber() {
        /// updateDocNumber
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("ServPurInvoice", "updateHeadersDocNum"),
            data: { IvnoiceID: GlobalMenuID },
            success: (d) => {
            }
        });
    }
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



        rp.CashType = -1;

        if (drpSrchStatus.selectedIndex > 0)

            rp.Status = Number($("#drpSrchStatus").val());
        else
            rp.Status = -1;

        Ajax.Callsync({
            url: Url.Action("IProc_Rpt_VATPurInvoiceList", "GeneralReports"),
            data: rp,
            success: (d) => {

                let result = d.result as string;


                window.open(result, "_blank");
            }
        })
    }
    function btnPrintReceive_onclick() {
        if (!SysSession.CurrentPrivileges.PrintOut) return;
        
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
        rp.Type = 0;
        rp.Repdesign = 1;
        rp.TRId = GlobalMenuID;

        Ajax.CallAsync({
            url: Url.Action("IProc_Prnt_VATPurInvoice", "GeneralReports"),
            data: rp,
            success: (d) => {


                //let result = d as BaseResponse;
                // window.open(Url.Action("ReportsPopup", "Home"), "_blank");
                //localStorage.setItem("result", "" + result + "");

                let result = d.result as string;
                window.open(result, "_blank");
            }
        })
    }
    //***************************************New********************************//
    function btn_arrowdown_onclick(index: number) {
        //*****لو يوجد خدمات للفاتورة الحالية

        var CurrentDetailObj: AVAT_TR_PurInvoiceDetail = new AVAT_TR_PurInvoiceDetail();
        var CurrentHeaderId: number = 0;
        var CurrentInvoiceId: number = 0;
        if (CurrentVendorSerial != 0) {
            let x = DetailList.filter(x => x.VND_SERIAL == CurrentVendorSerial);
            if (x != null) {
                CurrentInvoiceId = x[0].InvoiceId;
                CurrentHeaderId = x[0].InvoiceHeaderID;
            }
            else {
                CurrentInvoiceId = 0;
                CurrentHeaderId = 0;
            }

            //******** مسح كل الخدمات  القديمة الخاصة بالفاتورة الحالية  
            DetailList = DetailList.filter(x => x.VND_SERIAL != CurrentVendorSerial);
            //********نحفظ الخدمات الجديدة للفاتورة الحالية
            for (var i = 0; i < CountGrid2; i++) {
                CurrentDetailObj = new AVAT_TR_PurInvoiceDetail;
                CurrentDetailObj.InvoiceDetailID = Number($("#txtInvoiceDetailID" + i).val());
                CurrentDetailObj.InvoiceHeaderID = CurrentHeaderId;
                CurrentDetailObj.InvoiceId = CurrentInvoiceId;
                //CurrentDetailObj.TR_SERIAL = $("#txtDetailSerial" + i).val();
                CurrentDetailObj.TR_SERIAL = $("#txtTR_SERIAL" + i).val();
                CurrentDetailObj.VND_SERIAL = CurrentVendorSerial;
                var itemcode = $("#txtServCode" + i).val();
                var itemobj = ServicesDetails.filter(s => s.ItemCode == itemcode)
                if (itemobj.length > 0) {
                    CurrentDetailObj.ItemID = itemobj[0].Itemid;
                    var catID = itemobj[0].SrvCategoryID;
                    CurrentDetailObj.UomID = itemobj[0].UomID;
                    var catObj = CategorDetails.filter(s => s.SrvCategoryID == catID);
                    CurrentDetailObj.VatNatID = catObj[0].VatNatID;
                }
                CurrentDetailObj.SoldQty = $("#txtQty" + i).val();
                CurrentDetailObj.Unitprice = $("#txtPrice" + i).val();
                CurrentDetailObj.DiscountPrc = 0;
                CurrentDetailObj.DiscountAmount = 0;
                CurrentDetailObj.NetUnitPrice = $("#txtPrice" + i).val();
                CurrentDetailObj.ItemTotal = $("#txtDetailTotal" + i).val();
                CurrentDetailObj.VatApplied = VatPrc;
                CurrentDetailObj.VatPrc = $("#txtVatPrc" + i).val();
                CurrentDetailObj.VatAmount = $("#txtVatAmount" + i).val();
                CurrentDetailObj.NetAfterVat = $("#txtDetailNet" + i).val();
                CurrentDetailObj.REMARK = "";
                CurrentDetailObj.ACTUAL_DATE = "";
                CurrentDetailObj.QTY_RET = 0;
                CurrentDetailObj.CC_CODE = $("#txtCCcode" + i).val();
                CurrentDetailObj.REMARK = $("#txtCRemarks" + i).val();
                CurrentDetailObj.CompCode = Number(compcode);
                CurrentDetailObj.BranchCode = BranchCode;
                CurrentDetailObj.StatusFlag = $("#txt_StatusFlag2" + i).val();
                DetailList.push(CurrentDetailObj);
            }

        }
        //*****تحديث الرقم الحالي برقم الفاتورة الجديدة
        CurrentVendorSerial = $("#VND_SERIAL" + index).val();

        //*****عرض خدمات الفاتورة المختارة
        let DetailForSelectedVendorSR = DetailList.filter(x => x.VND_SERIAL == CurrentVendorSerial);
        DisplayDetail(DetailForSelectedVendorSR);
        //******
        EnableControls();
        if (EditModeFlag == false) {
            DisableControls();
        }
        if (isNew == true) {
            EnableControls();
        }
        //******
        DetailList = DetailList;
        GlobalVendorNum = CurrentVendorSerial;

    }

    function DisplayDetail(DetailForSelectedVendorSR: Array<AVAT_TR_PurInvoiceDetail>) {
        CountGrid2 = 0;
        let Detailserial = 0;
        $("#div_Data").html("");
        $("#DivChargesShow2").removeClass("display_none");
        for (var i = 0; i < DetailForSelectedVendorSR.length; i++) {
            BuildControls_Details(i);
            Detailserial = Detailserial + 1;
            $("#txtInvoiceDetailID" + i).val(DetailForSelectedVendorSR[i].InvoiceDetailID);
            //$("#txtDetailSerial" + i).val(DetailForSelectedVendorSR[i].TR_SERIAL);
            $("#txtDetailSerial" + i).val(Detailserial);
            $("#txtTR_SERIAL" + i).val(DetailForSelectedVendorSR[i].TR_SERIAL);
            $("#VND_SERIALDetail" + i).val(CurrentVendorSerial);
            var itemobj = ServicesDetails.filter(s => s.Itemid == DetailForSelectedVendorSR[i].ItemID);
            if (itemobj.length > 0) {
                $("#txtServCode" + i).val(itemobj[0].ItemCode);
                $("#txtServName" + i).val(itemobj[0].Itm_DescA);
            }
            $("#txtQty" + i).val(DetailForSelectedVendorSR[i].SoldQty);
            $("#txtPrice" + i).val(DetailForSelectedVendorSR[i].NetUnitPrice);
            $("#txtDetailTotal" + i).val(DetailForSelectedVendorSR[i].ItemTotal);
            $("#txtVatPrc" + i).val(DetailForSelectedVendorSR[i].VatPrc);
            $("#txtVatAmount" + i).val(DetailForSelectedVendorSR[i].VatAmount);
            $("#txtDetailNet" + i).val(DetailForSelectedVendorSR[i].NetAfterVat);
            $("#txtCCcode" + i).val(DetailForSelectedVendorSR[i].CC_CODE);
            $("#txtCRemarks" + i).val(DetailForSelectedVendorSR[i].REMARK);
            var costCntrObj = CostCentreDetailsIst.filter(s => s.CC_CODE == DetailForSelectedVendorSR[i].CC_CODE)
            if (costCntrObj.length > 0) {
                $("#txtCCName" + i).val(costCntrObj[0].CC_DESCA);
            }
            if (DetailForSelectedVendorSR[i].StatusFlag == "d" || DetailForSelectedVendorSR[i].StatusFlag == "m") {
                $("#No_Row2" + i).attr("hidden", "true");
                Detailserial = Detailserial - 1;//لو السطر اتلغي هننقص من رقم المسلسل واحد لانه هيكون مخفي
            }
            $("#txt_StatusFlag2" + i).val(DetailForSelectedVendorSR[i].StatusFlag);
            CountGrid2++;
        }
    }

    function AssignHeader() {
        let Header = new AVAT_TR_PurInvoiceHeader();
        for (var i = 0; i < CountGrid1; i++) {
            Header = new AVAT_TR_PurInvoiceHeader;
            Header.InvoiceHeaderID = Number($("#txtInvoiceHeaderID" + i).val());
            Header.InvoiceId = 0;
            Header.DocNo = $("#txtDocNum" + i).val();
            Header.VND_SERIAL = GlobalVendorNum;
            var vndCode = $("#txtVndrCode" + i).val();
            var vndObj = VendorDetailList.filter(s => s.VendorCode == vndCode);
            if (vndObj.length > 0)
                Header.VendorID = vndObj[0].VendorID;
            var checked: boolean = $("#chkCash" + i).prop("checked");
            if (checked == true) {
                Header.TR_TYPE = 1;
            } else {
                Header.TR_TYPE = 0;
            }
            Header.VENDOR_NAME = $("#txtVendoeName" + i).val();
            Header.TOTAL = $("#txtInvtotal" + i).val();
            Header.DISCOUNT = $("#txtDiscoutnval" + i).val();
            Header.PAID = 0;
            Header.Vat = $("#txtInvVat" + i).val();
            Header.NetATax = $("#txtInvNet" + i).val();
            Header.VatApplied = false;
            Header.VndVatType = 0;
            Header.VatPrc = VatPrc;
            Header.SalesType = 0;
            Header.PAY_ACC_CODE = $("#txtAccCode" + i).val();
            Header.REMARK = $("#txtInvoiceDesc" + i).val();
            Header.CompCode = Number(compcode);
            Header.BranchCode = BranchCode;
            Header.InvoiceDate = $("#txtInvoiceDate" + i).val();
            Header.Ref_No = $("#txtInvTrNO" + i).val();
            Header.StatusFlag = $("#txt_StatusFlag1" + i).val();
            InvHeaderAssign.push(Header);
        }
    }

    function Assign() {
        MasterDetailModel = new ServPurchseInvoiceMasterDetail();
        // Header
        Menu = new AVAT_TR_PurInvoice();
        Menu.CompCode = compcode;
        Menu.BranchCode = BranchCode;
        Menu.InvoiceId = 0;
        Menu.TR_NO = 0;
        Menu.DocNo = "";
        Menu.TR_DATE = txtTR_DATE.value;
        Menu.PERSON = txtPerson.value;
        Menu.TOTAL = Number(txtInvTotal.value);
        Menu.DISCOUNT = Number(txtDiscountValue.value);
        Menu.PAID = 0;
        Menu.JOURNAL_NO = 0;
        Menu.JOURNAL_RET_NO = 0;
        Menu.CLOSED = chkClosed.checked;
        Menu.CANCEL = false;
        Menu.Remark = txtRemark.value;

        Menu.IsPosted = false;
        Menu.ACTUAL_DATE = "";
        Menu.PrntNo = "";
        Menu.Ref_No = txtRefNum.value;
        Menu.Vat = Number(txtVat.value);
        Menu.NetATax = Number(txtNet.value);
        Menu.InvoiceDate = "";
        Menu.ImportInvoice = chk_ImportInvoiceDetail.checked;
        Menu.CCDT_CODE = "";
        Menu.ImportInvoiceDesc = "";

        // Invoices Headers
        for (var i = 0; i < InvHeaderAssign.length; i++) {
            AssignForGrids(InvHeaderAssign[i].VND_SERIAL, i);
        }





        MasterDetailModel.AVAT_TR_PurInvoiceHeader = InvHeaderAssign;

        // Invoices Details
        MasterDetailModel.AVAT_TR_PurInvoiceDetail = DetailList;


    }

    function AddNewRow_Details() {

        if (!SysSession.CurrentPrivileges.AddNew) return;
        var CanAddCharge: boolean = true;
        if (CountGrid2 > 0) {

            for (var i = 0; i < CountGrid2; i++) {
                CanAddCharge = Validation_Grid_Detail(i);
                if (CanAddCharge == false) {
                    break;
                }
            }
        }
        if (CanAddCharge) {
            BuildControls_Details(CountGrid2);
            $("#txt_StatusFlag2" + CountGrid2).val("i"); //In Insert mode
            $("#txtDetailSerial" + CountGrid2).attr("disabled", "disabled");
            $("#btnServicSrch" + CountGrid2).removeAttr("disabled");
            $("#txtServCode" + CountGrid2).removeAttr("disabled");
            $("#txtServName" + CountGrid2).attr("disabled", "disabled");
            $("#txtQty" + CountGrid2).removeAttr("disabled");
            $("#txtPrice" + CountGrid2).removeAttr("disabled");
            $("#txtDetailTotal" + CountGrid2).attr("disabled", "disabled");
            $("#txtVatPrc" + CountGrid2).attr("disabled", "disabled");
            $("#txtVatAmount" + CountGrid2).attr("disabled", "disabled");
            $("#txtDetailNet" + CountGrid2).attr("disabled", "disabled");

            $("#VND_SERIALDetail" + CountGrid2).val(GlobalVendorNum);

            $("#btnCostCntrSrch" + CountGrid2).removeAttr("disabled");
            $("#txtCCcode" + CountGrid2).removeAttr("disabled");
            $("#txtCRemarks" + CountGrid2).removeAttr("disabled");
            $("#txtCCName" + CountGrid2).attr("disabled", "disabled");

            // can delete new inserted record  without need for delete privilage
            $("#btn_minus2" + CountGrid2).removeClass("display_none");
            $("#btn_minus2" + CountGrid2).removeAttr("disabled");

            //***new

            if (CountGrid2 == 0) {
                $("#txtTR_SERIAL" + CountGrid2).val(CountGrid2 + 1);
            }
            else {
                let MaxTRSerial: number = Number($("#txtTR_SERIAL" + (CountGrid2 - 1)).val());
                let NewTRSerial: number = MaxTRSerial + 1;
                $("#txtTR_SERIAL" + CountGrid2).val(NewTRSerial);//for new row
            }
            //***







            CountGrid2 += 1;
            //Insert_Serial_Detail(GlobalVendorNum);
            Insert_Serial_Detail(GlobalVendorNum);
            var count = DetailList.filter(s => s.VND_SERIAL == GlobalVendorNum)
            if (count.length > 0) {
                var count2 = count.length - 1;
                var x = CountGrid2 - 1;
                var Serial = $("#txtDetailSerial" + x).val();
                //AssignDetailsForGrids(GlobalVendorNum, count2, Serial);
            }


        }
    }

    function btnSave_onclick() {
        //****to collect the detail data 
        loading('btnsave');

        setTimeout(function () {

            finishSave('btnsave');
        if (!CheckDate(DateFormat(txtTR_DATE.value).toString(), DateFormat(SysSession.CurrentEnvironment.StartDate).toString(), DateFormat(SysSession.CurrentEnvironment.EndDate).toString())) {
            WorningMessage('  التاريخ ليس متطابق مع تاريخ السنه (' + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ')', '  The date is not identical with the date of the year (' + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ')', "تحذير", "worning");
            Errorinput(txtTR_DATE);
            return
        }

      

        btn_arrowdown_onclick(0);


        Assign();

        if (!ValidationMenu())
            return;


        for (let i = 0; i < CountGrid1; i++) {
            if (!ValidationHeaderWithDetail(i))
                return;
        }

        for (let i = 0; i < CountGrid1; i++) {
            if (!Validation_Grid_Header(i))
                return;
        }

        for (let i = 0; i < DetailList.length; i++) {
            if (!ValidationDetailBeforeSave(i))
                return;
        }

        if (isNew == true) {
            Insert();
        } else {
            Update();
        }
        EditModeFlag = false;
        isNew = false;
        CurrentVendorSerial = 0;
        $("#btnPrintTransaction").removeClass("display_none");

        }, 100);
    }

    function DeleteRowCharge(RecNo: number) {
        // 
        if (!SysSession.CurrentPrivileges.Remove) return;
        WorningMessage("هل تريد الحذف؟", "Do you want to delete?", "تحذير", "worning", () => {




            DetailList = DetailList;

            debugger

            //$("#txt_StatusFlag1" + RecNo).val() == 'i' ? $("#txt_StatusFlag1" + RecNo).val('m') : $("#txt_StatusFlag1" + RecNo).val('d');

            $("#txt_StatusFlag1" + RecNo).val("d");

            $("#txtInvTrNO" + RecNo).val("22");
            $("#txtVndrCode" + RecNo).val("22");
            $("#txtVendoeName" + RecNo).val("22");
            $("#txtInvoiceDate" + RecNo).val("22");
            $("#txtDiscoutnval" + RecNo).val("22");
            $("#txtInvtotal" + RecNo).val("22");
            $("#txtInvVat" + RecNo).val("22");
            $("#txtAccCode" + RecNo).val("22");
            $("#txtAccDesc" + RecNo).val("22");
            $("#txtInvoiceDesc" + RecNo).val("22");
            GlobalVendorNum = $("#VND_SERIAL" + RecNo).val();
            AssignForGrids(GlobalVendorNum, RecNo);
            $("#No_Row1" + RecNo).attr("hidden", "true");
            $("#div_Data").html("");
            $("#DivChargesShow2").addClass("display_none");
            Insert_Serial_Header();
            ComputeTotals();
            //****new
            CurrentVendorSerial = 0;
            CountGrid1 = CountGrid1 - 1;


        });
    }

    function GetMaxVendorSerial() {
        let yy = ModelPurInvoiceHeader.sort(x => x.VND_SERIAL);
        let MaxVenSrl = yy[yy.length - 1].VND_SERIAL;
        return MaxVenSrl + 1;
    }

    function AddNewRow_Header() {

        if (!SysSession.CurrentPrivileges.AddNew) return;
        var CanAddCharge: boolean = true;
        if (CountGrid1 > 0) {

            for (var i = 0; i < CountGrid1; i++) {

                CanAddCharge = Validation_Grid_Header(i);
                if (CanAddCharge == false) {
                    break;
                }
            }
        }
        if (CanAddCharge) {

            BuildControls_Header(CountGrid1);
            $("#txt_StatusFlag1" + CountGrid1).val("i"); //In Insert mode
            $("#txtInvSerial" + CountGrid1).attr("disabled", "disabled");
            $("#txtInvTrNO" + CountGrid1).removeAttr("disabled");
            $("#btnVendorSrch" + CountGrid1).removeAttr("disabled");
            $("#txtVndrCode" + CountGrid1).removeAttr("disabled");
            $("#txtVendoeName" + CountGrid1).attr("disabled", "disabled");
            $("#chkCash" + CountGrid1).removeAttr("disabled");
            $("#txtDiscoutnval" + CountGrid1).removeAttr("disabled");
            $("#txtInvoiceDate" + CountGrid1).removeAttr("disabled");
            $("#txtInvtotal" + CountGrid1).attr("disabled", "disabled");
            $("#txtDocNum" + CountGrid1).attr("disabled", "disabled");
            $("#txtInvVat" + CountGrid1).attr("disabled", "disabled");
            $("#txtInvNet" + CountGrid1).attr("disabled", "disabled");
            $("#btnAccSearch" + CountGrid1).attr("disabled", "disabled");
            $("#txtAccCode" + CountGrid1).attr("disabled", "disabled");
            $("#txtAccDesc" + CountGrid1).attr("disabled", "disabled");
            $("#txtInvoiceDesc" + CountGrid1).removeAttr("disabled");
            //****new

            //$("#VND_SERIAL" + CountGrid1).val(CountGrid1 + 1);
            if (CountGrid1 == 0) {
                $("#VND_SERIAL" + CountGrid1).val(CountGrid1 + 1);
            }
            else {
                let MaxVendorSerial: number = Number($("#VND_SERIAL" + (CountGrid1 - 1)).val());
                let NewVendorSerial: number = MaxVendorSerial + 1;
                $("#VND_SERIAL" + CountGrid1).val(NewVendorSerial);//for new row
            }
            //****
            GlobalVendorNum = CountGrid1 + 1;
            // can delete new inserted record  without need for delete privilage
            $("#btn_minus1" + CountGrid1).removeClass("display_none");
            $("#btn_minus1" + CountGrid1).removeAttr("disabled");

            var count = InvHeaderAssign.filter(s => s.VND_SERIAL == GlobalVendorNum)
            if (count.length > 0) {
                var count2 = count.length - 1;
                AssignForGrids(GlobalVendorNum, count2);
            }
            ////***new
            // 
            //InvHeaderAssignSingle.VND_SERIAL = GetMaxVendorSerial();
            //$("#VND_SERIAL" + CountGrid1).val(GetMaxVendorSerial().toString());
            ////*********
            CountGrid1 += 1;
            Insert_Serial_Header();

        }
        $("#DivChargesShow2").addClass("display_none");
    }

    function ValidationHeaderWithDetail(cnt: number) {
        var newCount: number = 0;
        if ($("#txt_StatusFlag1" + cnt).val() != "d" && $("#txt_StatusFlag1" + cnt).val() != "m") {
            for (let j = 0; j < DetailList.length; j++) {
                if ((InvHeaderAssign[cnt].VND_SERIAL == DetailList[j].VND_SERIAL) && DetailList[j].StatusFlag != "m") {
                    newCount++;
                }
            }
            if (newCount == 0) {
                var ser = $("#txtInvSerial" + cnt).val();
                DisplayMassage('الفاتورة مسلسل  ' + ser + 'لا يوجد لها تفاصيل ', 'invoice Number ' + ser + ' have no details', MessageType.Error);
                Errorinput($("#txtInvSerial" + cnt));
                return false;
            }
        }

        return true;
    }
                                                              
}