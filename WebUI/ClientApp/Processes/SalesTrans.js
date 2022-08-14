$(document).ready(function () {
    SalesTrans.InitalizeComponent();
});
var SalesTrans;
(function (SalesTrans) {
    //System
    var sys = new SystemTools();
    var SysSession = GetSystemSession(Modules.SalesTrans);
    var compcode;
    var Branch;
    var startDate;
    var EndDate;
    var FinYear;
    //GridView
    var Grid = new JsGrid();
    //Arrays
    var BranchDetails = new Array();
    var StatesFilterDetailsAr = new Array();
    var StatesFilterDetailsEn = new Array();
    var OperSalesmanDetails = new Array();
    var IQ_SalesOperTransferWithDetail = new IQ_GetOPerationTransferWithDetail();
    var SearchDetails = new Array();
    var OpSalsmanItem = new IQ_GetOperationSalesmanItem;
    var ItemsListDetails = new Array();
    //   var ItemsSourceListDetails: Array<IQ_GetItemStoreInfo> = new Array<IQ_GetItemStoreInfo>();
    var ItemsToListDetails = new Array();
    var operationDetails = new Array();
    var SalesmanDetails = new Array();
    var SalesmanTODetails = new Array();
    //Models
    var MasterDetailModel = new OPerationSalesmanTransferWithDetail();
    var HeaderModel = new I_TR_OperationTF();
    var DetailModel = new Array();
    var DetailSingleModel = new I_TR_OperationTFDetail();
    var DetailModelFiltered = new Array();
    var IQTransferDetailModel = new Array();
    var IQDetailSingleModel = new IQ_GetTransferDetail();
    var SelectedModel = new Array();
    //textboxs
    var txtFromDate;
    var txtToDate;
    var txtTransferDate;
    var txtTrNo;
    var txtRefNumber;
    var txtCreatedBy;
    var txtCreatedAt;
    var txtUpdatedBy;
    var txtUpdatedAt;
    var txtSearch;
    var txtApprovedBy;
    var txtRemarks;
    var txtOPerationStatus;
    //DropdownLists
    var ddlStatusFilter;
    var ddlSourceSalesman;
    var ddlToSalesman;
    var ddlSourceSalesmanAdd;
    var ddlToSalesmanAdd;
    var ddlOPerationMaster;
    //buttons
    var btnShow;
    var btnAdd;
    var btnUpdate;
    var btnSave;
    var btnBack;
    var btnAddDetails;
    //check box
    var chkApproved;
    // Flages
    var FlagAddOrEdit = 0; //1 Add 2 Edit
    var showFlag = false;
    var AfterInsertOrUpdateFlag = false;
    //global
    var CountGrid = 0;
    var GlobalTransferID = 0;
    var GlobalOPerationID = 0;
    var GlobalOPerationStatus = false; // true--> open && false----close 
    // printButton
    var btnPrintTrview;
    var btnPrintTrPDF;
    var btnPrintTrEXEL;
    var btnPrint;
    var btnPrintTransaction;
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);
    //------------------------------------------------------ Main Region -----------------------------------
    function InitalizeComponent() {
        //System
        (SysSession.CurrentEnvironment.ScreenLanguage == "ar") ? document.getElementById('Screen_name').innerHTML = "تحويل المناديب" : document.getElementById('Screen_name').innerHTML = "Salesman Transfer";
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        Branch = Number(SysSession.CurrentEnvironment.BranchCode);
        FinYear = Number(SysSession.CurrentEnvironment.CurrentYear);
        InitalizeControls();
        // Call Fill Dropdownlists Functions
        fillddlStatusFilter();
        $("#ddlStatusFilter").prop("value", "2");
        //Set Secial Values While Load
        txtFromDate.value = DateStartMonth();
        txtToDate.value = ConvertToDateDash(GetDate()) <= ConvertToDateDash(SysSession.CurrentEnvironment.EndDate) ? GetDate() : SysSession.CurrentEnvironment.EndDate;
        txtTransferDate.value = GetDate();
        InitalizeEvents();
        fillddlSalesman();
        fillddlOperation();
        $('#btnPrint').addClass('display_none');
    }
    SalesTrans.InitalizeComponent = InitalizeComponent;
    function InitalizeControls() {
        //textboxs
        txtFromDate = document.getElementById("txtFromDate");
        txtToDate = document.getElementById("txtToDate");
        txtTrNo = document.getElementById("txtTrNo");
        txtTransferDate = document.getElementById("txtTransferDate");
        txtApprovedBy = document.getElementById("txtApprovedBy");
        txtRemarks = document.getElementById("txtRemarks");
        txtRefNumber = document.getElementById("txtRefNumber");
        txtCreatedBy = document.getElementById("txtCreatedBy");
        txtCreatedAt = document.getElementById("txtCreatedAt");
        txtUpdatedBy = document.getElementById("txtUpdatedBy");
        txtUpdatedAt = document.getElementById("txtUpdatedAt");
        txtSearch = document.getElementById("txtSearch");
        txtOPerationStatus = document.getElementById("txtOPerationStatus");
        //DropdownLists
        ddlStatusFilter = document.getElementById("ddlStatusFilter");
        ddlSourceSalesman = document.getElementById("ddlSourceSalesman");
        ddlToSalesman = document.getElementById("ddlToSalesman");
        ddlSourceSalesmanAdd = document.getElementById("ddlSourceSalesmanAdd");
        ddlToSalesmanAdd = document.getElementById("ddlToSalesmanAdd");
        ddlOPerationMaster = document.getElementById("ddlOPerationMaster");
        //buttons
        btnShow = document.getElementById("btnShow");
        btnAdd = document.getElementById("btnAdd");
        btnUpdate = document.getElementById("btnUpdate");
        btnSave = document.getElementById("btnSave");
        btnBack = document.getElementById("btnBack");
        btnAddDetails = DocumentActions.GetElementById("btnAddDetails");
        //checkBox
        chkApproved = document.getElementById("chkApproved");
        //printButton
        btnPrintTrview = document.getElementById("btnPrintTrview");
        btnPrintTrPDF = document.getElementById("btnPrintTrPDF");
        btnPrintTrEXEL = document.getElementById("btnPrintTrEXEL");
        btnPrint = document.getElementById("btnPrint");
        btnPrintTransaction = document.getElementById("btnPrintTransaction");
    }
    function InitalizeEvents() {
        btnAdd.onclick = btnAdd_onclick;
        btnShow.onclick = btnShow_onclick;
        btnSave.onclick = btnSave_onClick;
        btnBack.onclick = btnBack_onclick;
        btnUpdate.onclick = btnEdit_onclick;
        btnAddDetails.onclick = AddNewRow;
        txtSearch.onkeyup = txtSearch_onKeyup;
        chkApproved.onclick = chkApproved_checked;
        ddlOPerationMaster.onchange = ddlOPerationMaster_onchange;
        ddlSourceSalesmanAdd.onchange = ddlSourceSalesmanAdd_onchange;
        // printButton
        btnPrintTrview.onclick = function () { PrintReport(1); };
        btnPrintTrPDF.onclick = function () { PrintReport(2); };
        btnPrintTrEXEL.onclick = function () { PrintReport(3); };
        btnPrint.onclick = function () { PrintReport(4); };
        btnPrintTransaction.onclick = btnPrintTransaction_onclick;
    }
    function Check_on_user_type() {
        if (SysSession.CurrentEnvironment.UserType == 1 || SysSession.CurrentEnvironment.UserType == 3) { //Salesman
            var SalesId_1 = SysSession.CurrentEnvironment.SalesManID;
            SalesmanDetails = SalesmanDetails.filter(function (s) { return s.SalesmanId == SalesId_1; });
        }
        else if (SysSession.CurrentEnvironment.UserType == 2) { //CashBox
        }
    }
    //------------------------------------------------------ Buttons Region -----------------------------------
    function btnEdit_onclick() {
        if (!SysSession.CurrentPrivileges.EDIT)
            return;
        if (GlobalOPerationStatus == false) {
            DisplayMassage("لا يمكن التعديل علي عملية مغلقه", "you Cannot Edit on Closed Operations", MessageType.Error);
        }
        else {
            FlagAddOrEdit = 2;
            txtUpdatedAt.value = DateTimeFormat(Date().toString());
            txtUpdatedBy.value = SysSession.CurrentEnvironment.UserCode;
            chkApproved.disabled = false;
            DisableDiv();
            EnableControls();
            HideButtons();
        }
    }
    function btnAdd_onclick() {
        if (!SysSession.CurrentPrivileges.AddNew)
            return;
        if (ddlOPerationMaster.value != "null") {
            if (GlobalOPerationStatus == false) {
                DisplayMassage("لا يمكن الاضاقة علي عملية مغلقه", "you Cannot Add on Closed Operations", MessageType.Error);
            }
            else {
                CountGrid = 0;
                Clear();
                DisableDiv();
                HideButtons();
                EnableControls();
                showFlag = false;
                FlagAddOrEdit = 1;
                txtCreatedAt.value = DateTimeFormat(GetDate().toString());
                txtCreatedBy.value = SysSession.CurrentEnvironment.UserCode;
                GlobalOPerationID = Number(ddlOPerationMaster.value);
                fillddlSourceSalesmanAdd(GlobalOPerationID);
                GetAllOPerationItem(GlobalOPerationID);
                fillddlToSalesmanAdd();
                AddNewRow();
                $("#div_Approve").removeClass("display_none");
                chkApproved.disabled = !SysSession.CurrentPrivileges.CUSTOM1;
            }
        }
        else {
            DisplayMassage('يجب اختيار العملية', 'Please choose the operation', MessageType.Error);
            Errorinput(ddlOPerationMaster);
            $("#divTransferDetails").addClass("display_none");
            $("#div_Approve").addClass("display_none");
            $("#btnUpdate").addClass("display_none");
            $("#btnPrintTransaction").addClass("display_none");
        }
    }
    function btnShow_onclick() {
        if (ddlOPerationMaster.value != "null") {
            $("#div_Approve").addClass("display_none");
            $("#btnUpdate").addClass("display_none");
            $("#btnPrintTransaction").addClass("display_none");
            $("#divTransferDetails").addClass("display_none");
            $("#divGridShow").removeClass("display_none");
            InitializeGrid();
            $("#divShow").removeClass("display_none");
        }
        else {
            DisplayMassage("يجب اختيار العملية", "Please Select Operation", MessageType.Error);
            Errorinput(ddlOPerationMaster);
        }
    }
    function btnBack_onclick() {
        $("#div_hedr").removeClass("disabledDiv");
        $("#divShow").removeClass("disabledDiv");
        $("#divGridShow").removeClass("disabledDiv");
        ShowButons();
        if (FlagAddOrEdit == 2) {
            GridRowDoubleClick();
        }
        else {
            $("#divTransferDetails").addClass("display_none");
            $("#div_Approve").addClass("display_none");
            $("#btnUpdate").addClass("display_none");
            DisableControls();
            Clear();
            $("#btnPrintTransaction").addClass("display_none");
        }
    }
    function btnSave_onClick() {
        loading('btnsave');
        setTimeout(function () {
            finishSave('btnsave');
            if (!Validation_Header())
                return;
            for (var i = 0; i < CountGrid; i++) {
                if (!Validation_Grid(i))
                    return;
            }
            Assign();
            if (FlagAddOrEdit == 1) {
                Insert();
            }
            else {
                Update();
            }
        }, 100);
    }
    function chkApproved_checked() {
        if (!SysSession.CurrentPrivileges.CUSTOM2)
            return;
        if (txtRefNumber.disabled == true) {
            if (GlobalOPerationStatus == false) {
                DisplayMassage("لا يمكن فك اعتماد عملية مغلقه", "you Cannot Open Closed Operations", MessageType.Error);
            }
            else {
                Open();
            }
        }
    }
    function ddlOPerationMaster_onchange() {
        $("#div_Approve").addClass("display_none");
        $("#btnUpdate").addClass("display_none");
        $("#btnPrintTransaction").addClass("display_none");
        $("#divTransferDetails").addClass("display_none");
        $("#divGridShow").addClass("display_none");
        txtOPerationStatus.value = "";
        if (ddlOPerationMaster.value != "null") {
            var opID = Number(ddlOPerationMaster.value);
            var opObj = operationDetails.filter(function (s) { return s.OperationID == opID; });
            if (opObj[0].Status == 2) {
                GlobalOPerationStatus = true;
                txtOPerationStatus.value = (lang == "ar" ? "مفتوحه" : "opened");
            }
            else {
                GlobalOPerationStatus = false;
                txtOPerationStatus.value = (lang == "ar" ? "مغلقه" : "closed");
            }
        }
    }
    //------------------------------------------------------ Normal Grid Region -----------------------------------
    function InitializeGrid() {
        var res = GetResourceList("");
        Grid.OnRowDoubleClicked = GridRowDoubleClick;
        Grid.ElementName = "divGridDetails_View";
        Grid.PrimaryKey = "OperationTFID";
        Grid.Paging = true;
        Grid.PageSize = 10;
        Grid.Sorting = true;
        Grid.InsertionMode = JsGridInsertionMode.Binding;
        Grid.Editing = false;
        Grid.Inserting = false;
        Grid.SelectedIndex = 1;
        Grid.OnItemEditing = function () { };
        Grid.Columns = [
            { title: res.App_date, name: "OperationTFID", type: "text", width: "10%", visible: false },
            { title: res.Trns_TrNO, name: "Tr_No", type: "text", width: "10%" },
            { title: res.Trns_RefNum, name: "RefNO", type: "text", width: "10%" },
            { title: res.App_date, name: "TrDate", type: "text", width: "10%" },
            { title: res.Transfer_type, name: "TrType_Desc", type: "text", width: "10%" },
            { title: res.fromSales, name: (lang == "ar" ? "FromSls_NameA" : "FromSls_NameE"), type: "text", width: "10%" },
            { title: res.ToSales, name: (lang == "ar" ? "ToSls_NameA" : "Tosls_NameE"), type: "text", width: "10%" },
            { title: res.I_Vendor, name: (lang == "ar" ? "Vnd_nameA" : "Vnd_NameE"), type: "text", width: "10%" },
            { title: res.Done_sent, name: "IsSent_Desc", type: "text", width: "10%" },
        ];
        BindGridData();
    }
    function BindGridData() {
        IQ_SalesOperTransferWithDetail = new IQ_GetOPerationTransferWithDetail();
        $("#divGridShow").removeClass("display_none");
        var FromDate = DateFormatRep(txtFromDate.value).toString();
        var toDate = DateFormatRep(txtToDate.value).toString();
        var status = 0;
        var OPerationID = 0;
        var sourcrSales = 0;
        var ToSalesman = 0;
        status = Number(ddlStatusFilter.value.toString());
        if (ddlSourceSalesman.value != "null") {
            sourcrSales = Number(ddlSourceSalesman.value.toString());
        }
        if (ddlToSalesman.value != "null") {
            ToSalesman = Number(ddlToSalesman.value.toString());
        }
        if (ddlOPerationMaster.value != "null") {
            OPerationID = Number(ddlOPerationMaster.value.toString());
        }
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("Processes", "GetAllSalesmanTransferHeaderWithDetail"),
            data: { TrType: 0, FromDate: FromDate, toDate: toDate, status: status, sourcrSales: sourcrSales, ToSales: ToSalesman, operation: OPerationID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    IQ_SalesOperTransferWithDetail = new IQ_GetOPerationTransferWithDetail();
                    IQ_SalesOperTransferWithDetail = result.Response;
                    for (var i = 0; i < IQ_SalesOperTransferWithDetail.IQ_GetOperationTF.length; i++) {
                        IQ_SalesOperTransferWithDetail.IQ_GetOperationTF[i].TrDate = DateFormat(IQ_SalesOperTransferWithDetail.IQ_GetOperationTF[i].TrDate.toString());
                        IQ_SalesOperTransferWithDetail.IQ_GetOperationTF[i].IsSent == true ? IQ_SalesOperTransferWithDetail.IQ_GetOperationTF[i].IsSent_Desc = (lang == "ar" ? "تم" : "sent") : IQ_SalesOperTransferWithDetail.IQ_GetOperationTF[i].IsSent_Desc = (lang == "ar" ? "لا" : "not sent");
                        if (IQ_SalesOperTransferWithDetail.IQ_GetOperationTF[i].TrType == 0)
                            IQ_SalesOperTransferWithDetail.IQ_GetOperationTF[i].TrType_Desc = (lang == "ar" ? "تحويل مباشر" : "Direct transfer");
                    }
                    Grid.DataSource = IQ_SalesOperTransferWithDetail.IQ_GetOperationTF;
                    Grid.Bind();
                }
            }
        });
    }
    function GridRowDoubleClick() {
        showFlag = true;
        Clear();
        $("#divTransferDetails").removeClass("display_none");
        $("#btnPrintTransaction").removeClass("display_none");
        $("#btnUpdate").removeClass("display_none");
        $("#div_Approve").removeClass("display_none");
        SelectedModel = IQ_SalesOperTransferWithDetail.IQ_GetOperationTF.filter(function (x) { return x.OperationTFID == Number(Grid.SelectedKey); });
        if (AfterInsertOrUpdateFlag == true) {
            SelectedModel = IQ_SalesOperTransferWithDetail.IQ_GetOperationTF.filter(function (x) { return x.OperationTFID == GlobalTransferID; });
            AfterInsertOrUpdateFlag = false;
        }
        if (SelectedModel.length > 0) {
            GlobalOPerationID = Number(SelectedModel[0].OperationID);
            GlobalTransferID = Number(SelectedModel[0].OperationTFID);
            txtTrNo.value = SelectedModel[0].Tr_No.toString();
            txtTransferDate.value = SelectedModel[0].TrDate;
            txtApprovedBy.value = SelectedModel[0].VerfiedBy;
            txtRemarks.value = SelectedModel[0].Remark;
            if (SelectedModel[0].RefNO != null)
                txtRefNumber.value = SelectedModel[0].RefNO;
            fillddlSourceSalesmanAdd(GlobalOPerationID);
            fillddlToSalesmanAdd();
            GetAllOPerationItem(GlobalOPerationID);
            if (SelectedModel[0].FromSalesmanID != null)
                ddlSourceSalesmanAdd.value = SelectedModel[0].FromSalesmanID.toString();
            if (SelectedModel[0].ToSalesmanID != null)
                ddlToSalesmanAdd.value = SelectedModel[0].ToSalesmanID.toString();
            // creation
            txtCreatedBy.value = SelectedModel[0].CreatedBy;
            txtCreatedAt.value = SelectedModel[0].CreatedAt;
            // Edit
            if (SelectedModel[0].UpdatedBy != null) {
                txtUpdatedBy.value = SelectedModel[0].UpdatedBy;
                txtUpdatedAt.value = SelectedModel[0].UpdatedAt;
            }
            // Details
            DetailModelFiltered = new Array();
            DetailModelFiltered = IQ_SalesOperTransferWithDetail.IQ_GetOperationTFDetail.filter(function (s) { return s.OperationTFID == GlobalTransferID; });
            for (var i = 0; i < DetailModelFiltered.length; i++) {
                BuildControls(i);
            }
            CountGrid = DetailModelFiltered.length;
            DisableControls();
            if (SelectedModel[0].IsSent == true) {
                chkApproved.checked = true;
                btnUpdate.disabled = true;
                chkApproved.disabled = !SysSession.CurrentPrivileges.CUSTOM2;
            }
            else {
                chkApproved.checked = false;
                chkApproved.disabled = true;
                btnUpdate.disabled = false;
            }
        }
    }
    //------------------------------------------------------ Validation Region -----------------------------------
    function Validation_Header() {
        var newCount = 0;
        for (var i = 0; i < CountGrid; i++) {
            if ($("#txt_StatusFlag" + i).val() != "d" && $("#txt_StatusFlag" + i).val() != "m") {
                newCount++;
            }
        }
        if (!CheckDate(DateFormat(txtTransferDate.value).toString(), DateFormat(SysSession.CurrentEnvironment.StartDate).toString(), DateFormat(SysSession.CurrentEnvironment.EndDate).toString())) {
            DisplayMassage(' لا توجد صلاحيه للتحويل في هذا التاريخ (' + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ')', 'There is no transfer validity at this date ' + DateFormat(SysSession.CurrentEnvironment.StartDate).toString(), MessageType.Error);
            Errorinput(txtTransferDate);
            return false;
        }
        else if (ddlToSalesmanAdd.value == "null") {
            DisplayMassage('برجاء اختيار المندوب المحول اليه', 'Please choose the salesman you are transferring to', MessageType.Error);
            Errorinput(ddlToSalesmanAdd);
            return false;
        }
        else if (ddlToSalesmanAdd.value == "null") {
            DisplayMassage('برجاء اختيار المندوب المحول منه', 'Please choose the salesman you are transferring from', MessageType.Error);
            Errorinput(ddlToSalesmanAdd);
            return false;
        }
        else if (ddlSourceSalesmanAdd.value == ddlToSalesmanAdd.value) {
            DisplayMassage('( يجب ان تتم عمليه التحويل بين مندوبين مختلفين)', 'you must choose transfered from salesman', MessageType.Error);
            return;
        }
        else if (txtApprovedBy.value == "") {
            DisplayMassage('برجاء ادخال اعتماد بواسطه', 'Please enter Approved by', MessageType.Error);
            Errorinput(txtApprovedBy);
            return false;
        }
        else if (newCount == 0) {
            DisplayMassage('يجب ادخال اصناف التحويل', 'Please enter Transfering Items', MessageType.Error);
            return false;
        }
        else if (!CheckPeriodDate(txtTransferDate.value, "I")) {
            debugger;
            DisplayMassage("لا يمكنك الاضافه او التعديل في هذة الفتره المغلقه ", "Please select a Invoice data", MessageType.Error);
            Errorinput(txtTransferDate);
            return false;
        }
        return true;
    }
    function Validation_Grid(rowcount) {
        var convertQty = Number($("#txtRecQty" + rowcount).val());
        if ($("#txt_StatusFlag" + rowcount).val() == "d" || $("#txt_StatusFlag" + rowcount).val() == "m") {
            return true;
        }
        else {
            if ($("#txtItemName" + rowcount).val() == "") {
                DisplayMassage('برجاء ادخال الصنف', 'Please enter item', MessageType.Error);
                Errorinput($("#txtItemName" + rowcount));
                return false;
            }
            if (convertQty <= 0) {
                DisplayMassage('برجاء ادخال الكميه المحولة إلي المندوب', 'Please enter to salesman Quantity ', MessageType.Error);
                Errorinput($("#txtRecQty" + rowcount));
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
                if (Number($("#txtItemID" + i).val()) == itemValue && Number($("#txtOperationTFDetailID" + i).val()) != NumberRowid) {
                    flag = true;
                }
            }
            else {
                if (Number($("#txtItemID" + i).val()) == itemValue) {
                    flag = true;
                }
            }
        }
        return flag;
    }
    //-----------------------------------------------------------------------  DropDownList Region ----------------------------------
    function fillddlStatusFilter() {
        StatesFilterDetailsAr = ["جديد", " محول", "الجميع"];
        StatesFilterDetailsEn = ["New", " Returned", "All"];
        if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
            for (var i = 0; i < StatesFilterDetailsEn.length; i++) {
                var newoption = document.createElement("option");
                newoption.value = i.toString();
                newoption.text = StatesFilterDetailsEn[i];
                ddlStatusFilter.options.add(newoption);
            }
        }
        else {
            for (var i = 0; i < StatesFilterDetailsAr.length; i++) {
                var newoption = document.createElement("option");
                newoption.value = i.toString();
                newoption.text = StatesFilterDetailsAr[i];
                ddlStatusFilter.options.add(newoption);
            }
        }
    }
    function fillddlSourceSalesmanAdd(opeartionID) {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("Processes", "GetOperationSalesman"),
            data: {
                OperationID: opeartionID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    OperSalesmanDetails = result.Response;
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                        DocumentActions.FillCombowithdefult(OperSalesmanDetails, ddlSourceSalesmanAdd, "SalesmanId", "NameE", "Select salesman");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(OperSalesmanDetails, ddlSourceSalesmanAdd, "SalesmanId", "NameA", "اختر المندوب");
                    }
                }
            }
        });
    }
    function fillddlToSalesmanAdd() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefSalesMen", "GetAllOperationPeople"),
            data: {
                CompCode: compcode, BranchCode: Branch, ISOperationEnable: true, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    SalesmanTODetails = result.Response;
                    //var salesmanID = Number(ddlSourceSalesmanAdd.value);
                    //SalesmanTODetails = SalesmanTODetails.filter(s => s.SalesmanId != salesmanID);
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                        DocumentActions.FillCombowithdefult(SalesmanTODetails, ddlToSalesmanAdd, "SalesmanId", "NameE", "Select salesman");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(SalesmanTODetails, ddlToSalesmanAdd, "SalesmanId", "NameA", "اختر المندوب");
                    }
                }
            }
        });
    }
    function fillddlOperation() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("OperationInvoice", "GetAllOperationswithoutStatus"),
            data: { CompCode: compcode, BranchCode: Branch, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    operationDetails = result.Response;
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                        DocumentActions.FillCombowithdefult(operationDetails, ddlOPerationMaster, "OperationID", "TrNo", "Select operation");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(operationDetails, ddlOPerationMaster, "OperationID", "TrNo", "اختر العملية");
                    }
                }
            }
        });
    }
    function fillddlSalesman() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefSalesMen", "GetAllOperationPeople"),
            data: {
                CompCode: compcode, BranchCode: Branch, ISOperationEnable: true, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    SalesmanDetails = result.Response;
                    Check_on_user_type();
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                        DocumentActions.FillCombowithdefult(SalesmanDetails, ddlSourceSalesman, "SalesmanId", "NameE", "Select Category");
                        DocumentActions.FillCombowithdefult(SalesmanDetails, ddlToSalesman, "SalesmanId", "NameE", "Select Category");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(SalesmanDetails, ddlSourceSalesman, "SalesmanId", "NameA", "اختر المندوب");
                        DocumentActions.FillCombowithdefult(SalesmanDetails, ddlToSalesman, "SalesmanId", "NameA", "اختر المندوب");
                    }
                    SysSession.CurrentEnvironment.UserType == 1 || SysSession.CurrentEnvironment.UserType == 3 ? ($('#ddlSalesman option[value="null"]').remove()) : $('#ddlSalesman').prop('selectedIndex', 0);
                    SysSession.CurrentEnvironment.UserType == 1 || SysSession.CurrentEnvironment.UserType == 3 ? ($('#ddlSalesmanFilter option[value="null"]').remove()) : $('#ddlSalesmanFilter').prop('selectedIndex', 0);
                }
            }
        });
    }
    function ddlSourceSalesmanAdd_onchange() {
        CountGrid = 0;
        $("#div_Data").html("");
        AddNewRow();
    }
    //------------------------------------------------------ Clear && Search && Enable && Disabled Region -----------------------------------
    function Clear() {
        $("#div_Data").html("");
        txtTransferDate.value = GetDate();
        txtUpdatedBy.value = "";
        txtUpdatedAt.value = "";
        txtCreatedBy.value = "";
        txtCreatedAt.value = "";
        txtRefNumber.value = "";
        txtTrNo.value = "";
        txtApprovedBy.value = "";
        txtRemarks.value = "";
        ddlSourceSalesmanAdd.value = 'null';
        ddlToSalesmanAdd.value = 'null';
        chkApproved.checked = false;
    }
    function txtSearch_onKeyup() {
        if (txtSearch.value != "") {
            var search_1 = txtSearch.value.toLowerCase();
            SearchDetails = IQ_SalesOperTransferWithDetail.IQ_GetOperationTF.filter(function (x) { return x.FromSls_NameA.toString().toLowerCase().search(search_1) >= 0 || x.FromSls_NameE.toString().toLowerCase().search(search_1) >= 0
                || x.IsSent_Desc.toLowerCase().search(search_1) >= 0 || x.ReceivedBy.toLowerCase().search(search_1) >= 0
                || x.ToSls_NameA.toLowerCase().search(search_1) >= 0 || x.Tosls_NameE.toLowerCase().search(search_1) >= 0
                || x.TrType_Desc.toString().search(search_1) >= 0 || x.Vnd_nameA.toString().search(search_1) >= 0
                || x.Vnd_NameE.toString().search(search_1) >= 0 || x.RefNO.toString().search(search_1) >= 0 || x.Tr_No.toString().search(search_1) >= 0; });
            Grid.DataSource = SearchDetails;
            Grid.Bind();
        }
        else {
            Grid.DataSource = IQ_SalesOperTransferWithDetail.IQ_GetOperationTF;
            Grid.Bind();
        }
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
    function EnableControls() {
        $("#divTransferDetails :input").removeAttr("disabled");
        $("#btnAddDetails").removeClass("display_none");
        $("#btnPrintTransaction").addClass("display_none");
        for (var i = 0; i < CountGrid; i++) {
            $("#btnSearchItems" + i).removeAttr("disabled");
            $("#txtItemName" + i).attr("disabled", "disabled");
            $("#btn_minus" + i).removeClass("display_none");
            $('#txtItemID' + i).attr("disabled", "disabled");
            $('#txtOperationItemID' + i).attr("disabled", "disabled");
            $('#txt_OnhandQty' + i).attr("disabled", "disabled");
            $('#txtItemCode' + i).attr("disabled", "disabled");
            // $('#txtSendQty' + i).attr("disabled", "disabled");
            $('#txtRecQty' + i).removeAttr("disabled");
        }
        txtTrNo.disabled = true;
        txtCreatedAt.disabled = true;
        txtCreatedBy.disabled = true;
        txtUpdatedAt.disabled = true;
        txtUpdatedBy.disabled = true;
        txtTransferDate.disabled = true;
    }
    function DisableControls() {
        $("#divTransferDetails :input").attr("disabled", "disabled");
        $("#btnAddDetails").addClass("display_none");
        $("#btnPrintTransaction").removeClass("display_none");
        for (var i = 0; i < CountGrid; i++) {
            $("#btnSearchItems" + i).attr("disabled", "disabled");
            $('#txtItemID' + i).attr("disabled", "disabled");
            $('#txtOperationItemID' + i).attr("disabled", "disabled");
            $('#txtItemName' + i).attr("disabled", "disabled");
            $('#txt_OnhandQty' + i).attr("disabled", "disabled");
            $('#txtItemCode' + i).attr("disabled", "disabled");
            //$('#txtSendQty' + i).attr("disabled", "disabled");
            $('#txtRecQty' + i).attr("disabled", "disabled");
            $("#btn_minus" + i).addClass("display_none");
        }
        txtTrNo.disabled = true;
    }
    function HideButtons() {
        $("#btnUpdate").addClass("display_none");
        $("#btnSave").removeClass("display_none");
        $("#btnBack").removeClass("display_none");
    }
    function ShowButons() {
        $("#btnUpdate").removeClass("display_none");
        $("#btnSave").addClass("display_none");
        $("#btnBack").addClass("display_none");
    }
    function DisableDiv() {
        $("#div_hedr").addClass("disabledDiv");
        $("#divShow").addClass("disabledDiv");
        $("#divTransferDetails").removeClass("disabledDiv");
        $("#divTransferDetails").removeClass("display_none");
    }
    //------------------------------------------------------ Controls Grid Region -----------------------------------
    function AddNewRow() {
        if (!SysSession.CurrentPrivileges.AddNew)
            return;
        showFlag = false;
        var CanAdd = true;
        if (CountGrid > 0) {
            var LastRowNo = CountGrid - 1;
            CanAdd = Validation_Grid(LastRowNo);
        }
        if (CanAdd) {
            $(".Acc").show();
            $(".costcntr").show();
            BuildControls(CountGrid);
            $("#txt_StatusFlag" + CountGrid).val("i"); //In Insert mode
            $("#btnSearchItems" + CountGrid).removeAttr("disabled");
            $("#txtItemID" + CountGrid).attr("disabled", "disabled");
            $("#txtItemName" + CountGrid).attr("disabled", "disabled");
            $("#txtItemCode" + CountGrid).removeAttr("disabled");
            // $("#txtSendQty" + CountGrid).attr("disabled", "disabled");
            $("#txtRecQty" + CountGrid).removeAttr("disabled");
            // can delete new inserted record  without need for delete privilage
            $("#btn_minus" + CountGrid).removeClass("display_none");
            $("#btn_minus" + CountGrid).removeAttr("disabled");
            CountGrid++;
        }
    }
    function BuildControls(cnt) {
        var html = "";
        html = "<tr id=\"No_Row" + cnt + "\">\n                    <input id=\"txtOperationTFDetailID" + cnt + "\" type=\"hidden\" class=\"form-control display_none\"  />\n                    <input id=\"txtOperationItemID" + cnt + "\" type=\"hidden\" name=\"FromDate\" class=\"form-control display_none\"  />\n                    <input id=\"txtItemID" + cnt + "\" type=\"hidden\" name=\"FromDate\" class=\"form-control display_none\"  />\n\t                <td>\n\t\t                <div class=\"form-group\">\n\t\t\t                <span id=\"btn_minus" + cnt + "\" class=\"display_none\"><i class=\"fas fa-minus-circle fs-4 btn-minus \"></i></span>\n\t\t                </div>\n\t                </td>\n                   \n                    <td>\n\t                    <div class=\"form-group\">\n\t\t                    <div class=\"search-content d-flex justify-content-start align-items-center\">\n\t\t\t                    <button type=\"button\" name=\"InvoiceSearch\" id=\"btnSearchItems" + cnt + "\" name=\"ColSearch\" class=\"style_ButSearch me-1\">\n\t\t\t\t                    <i class=\"fas fa-search\"></i>\n\t\t\t                    </button>\n\t\t\t                    <input id=\"txtItemCode" + cnt + "\" name=\"\" disabled type=\"text\" class=\"form-control\" />\n\t\t                    </div>\n\t                    </div>\n                    </td>\n                        <td>\n\t\t                <div class=\"form-group\">\n\t\t\t                <input type=\"text\"  class=\"form-control\" id=\"txtItemName" + cnt + "\" disabled>\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n\t\t\t               <input id=\"txtRecQty" + cnt + "\" type=\"number\"  class=\"form-control\"  disabled>\n\t\t                </div>\n\t                </td>\n                    <input id=\"txt_StatusFlag" + cnt + "\" name = \" \" type = \"hidden\" class=\"form-control\"/>\n                    <input id=\"txt_OnhandQty" + cnt + "\" name = \" \" type = \"hidden\" class=\"form-control\"/>\n                </tr>";
        //html = '<div id= "No_Row' + cnt + '" class="container-fluid style_border" > <div class="row" ><div class="col-lg-12 col-md-12 col-sm-12 col-xl-12 col-xs-12">' +
        //    '<input id="txtOperationTFDetailID' + cnt + '" name="" disabled type="hidden" value=" " class="form-control  text_Display" />' +
        //    '<div class="col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-1" style="width:1.5%!important">' +
        //    '<span id="btn_minus' + cnt + '" class=" glyphicon glyphicon-minus-sign fontitm3DirectTransfer "></span>' +
        //    '</div>' +
        //    '<input id="txtOperationItemID' + cnt + '" name="FromDate" disabled type="hidden"  class="form-control  text_Display" />' +
        //    '<div class="col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-1" style="width:4%!important;">' +
        //    '<button type="button" class="col-lg-12 col-md-12 col-sm-12 col-xl-12 col-xs-12 src-btn btn btn-warning input-sm" id="btnSearchItems' + cnt + '" name="ColSearch">   ' +
        //    '<i class="fa fa-search"></i></button>' +
        //    '<input id="txtItemID' + cnt + '" name="" disabled type="hidden" class="col-lg-9 col-md-9 col-sm-9 col-xl-9 col-xs-9  form-control  text_Display" /></div>' +
        //    '<div class="col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-1 Acc" >' +
        //    '<input id="txtItemCode' + cnt + '" name="" disabled type="text" class="form-control text_Display" /></div>' +
        //    '<div class="col-lg-3 col-md-3 col-sm-3 col-xl-3 col-xs-3 Acc" >' +
        //    '<input id="txtItemName' + cnt + '" name="" disabled type="text" class="form-control text_Display" /></div>' +
        //    //'<div class="col-lg-1 Acc" style=" ">' +
        //    //'<input id="txtSendQty' + cnt + '" name="" disabled type="text" class="form-control  text_Display" /></div>' +
        //    '<div class="col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-1 Acc" style=" ">' +
        //    '<input id="txtRecQty' + cnt + '" name="" disabled type="number" class="form-control text_Display" /></div>' +
        //    '<input id="txt_StatusFlag' + cnt + '" name = " " type ="hidden" />' +
        //    '<input id="txt_OnhandQty' + cnt + '" name = " " type ="hidden" />' +
        //    '</div>';
        $("#div_Data").append(html);
        //// Items Search
        $('#btnSearchItems' + cnt).click(function (e) {
            var sys = new SystemTools();
            var opID = GlobalOPerationID;
            if (ddlOPerationMaster.value != "null")
                opID = Number(ddlOPerationMaster.value);
            var Salsman = 0;
            if (ddlSourceSalesmanAdd.value == "null") {
                DisplayMassage('( يجب اختيار المندوب المحول منه )', 'you must choose transfered from salesman', MessageType.Error);
                return;
            }
            else
                Salsman = Number(ddlSourceSalesmanAdd.value);
            sys.FindKey(Modules.SalesTrans, "btnSearchItems", "OperationID=" + opID + " and OnhandQty > 0  and SalesmanId= " + Salsman, function () {
                var id = SearchGrid.SearchDataGrid.SelectedKey;
                var res = false;
                var opList = ItemsListDetails.filter(function (s) { return s.OperationItemID == id && s.SalesmanId == Salsman; });
                OpSalsmanItem = opList[0];
                var NumberRowid = Number($("#txtOperationTFDetailID" + cnt).val());
                res = checkRepeatedItems(OpSalsmanItem.ItemID, NumberRowid);
                if (res == false) {
                    if ($("#txt_StatusFlag" + cnt).val() != "i")
                        $("#txt_StatusFlag" + cnt).val("u");
                    if (OpSalsmanItem.OperationItemID != null) {
                        $('#txtItemID' + cnt).val(OpSalsmanItem.ItemID);
                        $('#txtOperationItemID' + cnt).val(OpSalsmanItem.OperationItemID);
                        (SysSession.CurrentEnvironment.ScreenLanguage == "ar") ? $('#txtItemName' + cnt).val(OpSalsmanItem.IT_DescA) : $('#txtItemName' + cnt).val(OpSalsmanItem.IT_DescE);
                        $('#txt_OnhandQty' + cnt).val(OpSalsmanItem.OnhandQty);
                        $('#txtItemCode' + cnt).val(OpSalsmanItem.ItemCode);
                        //   $('#txtSendQty' + cnt).val(OpSalsmanItem.OnhandQty);
                        $('#txtRecQty' + cnt).val("0");
                    }
                }
                else {
                    DisplayMassage('( لايمكن تكرار نفس الاصناف في التحويل )', 'The same items cannot be duplicated in the transfer', MessageType.Error);
                    $('#txtItemID' + cnt).val("");
                    $('#txtOperationItemID' + cnt).val("");
                    $('#txtItemName' + cnt).val("");
                    $('#txt_OnhandQty' + cnt).val("");
                    $('#txtItemCode' + cnt).val("");
                    //   $('#txtSendQty' + cnt).val("");
                    $('#txtRecQty' + cnt).val("");
                }
            });
        });
        //Quintity on change  
        $("#txtRecQty" + cnt).on('keyup', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
            var ConvertedQntyVal = Number($('#txtRecQty' + cnt).val());
            if (ConvertedQntyVal < 0) {
                $('#txtRecQty' + cnt).val("0");
                $('#txtRecQty' + cnt).select();
            }
            var ItemID = Number($('#txtItemID' + cnt).val());
            var selectedItem = ItemsListDetails.filter(function (s) { return s.ItemID == ItemID; });
            if (selectedItem[0].OnhandQty < ConvertedQntyVal) {
                DisplayMassage("لا يمكن تحويل كمية اكبر من الكمية المتاحه ", 'It is not possible to transfer an amount greater than the available quantity', MessageType.Error);
                $('#txtRecQty' + cnt).val(selectedItem[0].OnhandQty);
            }
        });
        //Item Code Onchange
        $("#txtItemCode" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
            var ItemCode = $('#txtItemCode' + cnt).val();
            var SrcItem = ItemsListDetails.filter(function (s) { return s.ItemCode == ItemCode; });
            if (SrcItem.length > 0) {
                var res = false;
                var NumberRowid = Number($("#txtOperationTFDetailID" + cnt).val());
                var id = Number(SrcItem[0].ItemID);
                res = checkRepeatedItems(id, NumberRowid);
                if (res == false) {
                    $('#txtItemID' + cnt).val(SrcItem[0].ItemID);
                    $('#txtOperationItemID' + cnt).val(SrcItem[0].OperationItemID);
                    (SysSession.CurrentEnvironment.ScreenLanguage == "ar") ? $('#txtItemName' + cnt).val(SrcItem[0].IT_DescA) : $('#txtItemName' + cnt).val(SrcItem[0].IT_DescE);
                    $('#txt_OnhandQty' + cnt).val(SrcItem[0].OnhandQty);
                    $('#txtItemCode' + cnt).val(SrcItem[0].ItemCode);
                    //   $('#txtSendQty' + cnt).val(SrcItem[0].OnhandQty);
                    $('#txtRecQty' + cnt).val("0");
                }
                else {
                    DisplayMassage('( لايمكن تكرار نفس الاصناف في التحويل )', 'The same items cannot be duplicated in the transfer', MessageType.Error);
                    $('#txtItemID' + cnt).val("");
                    $('#txtOperationItemID' + cnt).val("");
                    $('#txtOperationSalesmanID' + cnt).val("");
                    $('#txtItemName' + cnt).val("");
                    $('#txt_OnhandQty' + cnt).val("");
                    $('#txtItemCode' + cnt).val("");
                    //  $('#txtSendQty' + cnt).val("");
                    $('#txtRecQty' + cnt).val("");
                }
            }
            else {
                $('#txtItemID' + cnt).val("");
                $('#txtOperationItemID' + cnt).val("");
                $('#txtOperationSalesmanID' + cnt).val("");
                $('#txtItemName' + cnt).val("");
                $('#txt_OnhandQty' + cnt).val("");
                $('#txtItemCode' + cnt).val("");
                // $('#txtSendQty' + cnt).val("");
                $('#txtRecQty' + cnt).val("");
                DisplayMassage("كود الصنف غير صحيح ", "Wrong Item Code ", MessageType.Error);
            }
        });
        $("#btn_minus" + cnt).on('click', function () {
            DeleteRow(cnt);
        });
        if (showFlag == true) {
            $('#txtOperationTFDetailID' + cnt).val(DetailModelFiltered[cnt].OperationTFDetailID);
            $('#txtItemID' + cnt).val(DetailModelFiltered[cnt].ItemID);
            $('#txtOperationItemID' + cnt).val(DetailModelFiltered[cnt].OperationItemID);
            (SysSession.CurrentEnvironment.ScreenLanguage == "ar") ? $('#txtItemName' + cnt).val(DetailModelFiltered[cnt].IT_DescA) : $('#txtItemName' + cnt).val(DetailModelFiltered[cnt].IT_DescE);
            $('#txt_OnhandQty' + cnt).val("ss");
            $('#txtItemCode' + cnt).val(DetailModelFiltered[cnt].ItemCode);
            //  $('#txtSendQty' + cnt).val(DetailModelFiltered[cnt].SendQty);
            $('#txtRecQty' + cnt).val(DetailModelFiltered[cnt].RecQty);
            $('#txt_StatusFlag' + cnt).val("");
        }
    }
    function DeleteRow(RecNo) {
        if (!SysSession.CurrentPrivileges.Remove)
            return;
        WorningMessage("هل تريد الحذف؟", "Do you want to delete?", "تحذير", "worning", function () {
            var statusFlag = $("#txt_StatusFlag" + RecNo).val();
            if (statusFlag == "i")
                $("#txt_StatusFlag" + RecNo).val("m");
            else
                $("#txt_StatusFlag" + RecNo).val("d");
            // ComputeTotals();
            $("#txtItemID" + RecNo).val("99");
            $("#txtItemName" + RecNo).val("1");
            $("#txtRecQty" + RecNo).val("1");
            $("#txtItemCode" + RecNo).val("1");
            //$("#txtSendQty" + RecNo).val("1");
            $("#txtRecQty" + RecNo).val("1");
            $("#No_Row" + RecNo).attr("hidden", "true");
        });
    }
    //---------------------------------------------- get By id  functions ----------------------------------------
    function GetAllOPerationItem(operationID) {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("Processes", "GetAllOperationItems"),
            data: { operationid: operationID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    ItemsListDetails = result.Response;
                }
            }
        });
    }
    //--------------------------------------------------- Main Functions-----------------------------------------------
    function Assign() {
        MasterDetailModel = new OPerationSalesmanTransferWithDetail();
        HeaderModel = new I_TR_OperationTF();
        DetailModel = new Array();
        // Header Data
        HeaderModel.Tr_No = Number(txtTrNo.value);
        HeaderModel.TrType = 0;
        HeaderModel.OperationID = GlobalOPerationID;
        HeaderModel.CompCode = Number(SysSession.CurrentEnvironment.CompCode);
        HeaderModel.BranchCode = Number(Branch);
        HeaderModel.TrDate = txtTransferDate.value;
        HeaderModel.RefNO = txtRefNumber.value;
        if (chkApproved.checked == true) {
            HeaderModel.IsSent = true;
        }
        else {
            HeaderModel.IsSent = false;
        }
        HeaderModel.ToSalesmanID = Number(ddlToSalesmanAdd.value);
        HeaderModel.FromSalesmanID = Number(ddlSourceSalesmanAdd.value);
        HeaderModel.VerfiedBy = txtApprovedBy.value;
        HeaderModel.Remark = txtRemarks.value;
        var StatusFlag;
        // Details
        for (var i = 0; i < CountGrid; i++) {
            DetailSingleModel = new I_TR_OperationTFDetail();
            StatusFlag = $("#txt_StatusFlag" + i).val();
            DetailSingleModel.StatusFlag = StatusFlag.toString();
            if (StatusFlag == "i") {
                DetailSingleModel.OperationTFDetailID = 0;
                DetailSingleModel.OperationItemID = $("#txtOperationItemID" + i).val();
                DetailSingleModel.ItemID = $("#txtItemID" + i).val();
                DetailSingleModel.SendQty = $("#txtRecQty" + i).val();
                DetailSingleModel.RecQty = $("#txtRecQty" + i).val();
                DetailModel.push(DetailSingleModel);
            }
            else if (StatusFlag == "u") {
                DetailSingleModel.OperationTFDetailID = $("#txtOperationTFDetailID" + i).val();
                DetailSingleModel.OperationItemID = $("#txtOperationItemID" + i).val();
                DetailSingleModel.ItemID = $("#txtItemID" + i).val();
                DetailSingleModel.SendQty = $("#txtRecQty" + i).val();
                DetailSingleModel.RecQty = $("#txtRecQty" + i).val();
                DetailModel.push(DetailSingleModel);
            }
            else if (StatusFlag == "d") {
                if (FlagAddOrEdit == 2) {
                    if ($("#txtOperationTFDetailID" + i).val() != "") {
                        var deletedID = $("#txtOperationTFDetailID" + i).val();
                        DetailSingleModel.OperationTFDetailID = deletedID;
                        DetailModel.push(DetailSingleModel);
                    }
                }
            }
        }
        MasterDetailModel.I_TR_OperationTF = HeaderModel;
        MasterDetailModel.I_TR_OperationTFDetail = DetailModel;
        MasterDetailModel.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
        MasterDetailModel.UserCode = SysSession.CurrentEnvironment.UserCode;
    }
    function Insert() {
        MasterDetailModel.I_TR_OperationTF.CreatedBy = SysSession.CurrentEnvironment.UserCode;
        MasterDetailModel.I_TR_OperationTF.CreatedAt = DateTimeFormat(Date().toString());
        MasterDetailModel.I_TR_OperationTF.OperationTFID = 0;
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("Processes", "InsertProcesTransferMasterDetail"),
            data: JSON.stringify(MasterDetailModel),
            success: function (d) {
                var result = d;
                if (result.IsSuccess == true) {
                    var res = result.Response;
                    DisplayMassage("تم اصدار  تحويل رقم " + res.Tr_No, 'Transfer number ' + res.Tr_No + 'has been issued', MessageType.Succeed);
                    txtTrNo.value = res.Tr_No.toString();
                    GlobalTransferID = res.OperationTFID;
                    Save();
                    AfterInsertOrUpdateFlag = true;
                    GridRowDoubleClick();
                    Save_Succ_But();
                }
                else {
                    DisplayMassage("هناك خطــأ ", '(Error)', MessageType.Error);
                }
            }
        });
    }
    function Update() {
        MasterDetailModel.I_TR_OperationTF.UpdatedBy = SysSession.CurrentEnvironment.UserCode;
        MasterDetailModel.I_TR_OperationTF.UpdatedAt = DateTimeFormat(Date().toString());
        MasterDetailModel.I_TR_OperationTF.OperationTFID = GlobalTransferID;
        // creation
        if (SelectedModel.length > 0) {
            MasterDetailModel.I_TR_OperationTF.CreatedBy = SelectedModel[0].CreatedBy;
            MasterDetailModel.I_TR_OperationTF.CreatedAt = SelectedModel[0].CreatedAt;
        }
        else {
            MasterDetailModel.I_TR_OperationTF.CreatedBy = SysSession.CurrentEnvironment.UserCode;
            MasterDetailModel.I_TR_OperationTF.CreatedAt = DateTimeFormat(Date().toString());
        }
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("Processes", "UpdateProcesTransferDetail"),
            data: JSON.stringify(MasterDetailModel),
            success: function (d) {
                var result = d;
                if (result.IsSuccess == true) {
                    var res = result.Response;
                    GlobalTransferID = res.OperationTFID;
                    DisplayMassage("تم التعديل بنجاح " + res.Tr_No, 'Editied successfully' + res.Tr_No, MessageType.Succeed);
                    Save();
                    InitializeGrid();
                    AfterInsertOrUpdateFlag = true;
                    GridRowDoubleClick();
                    Save_Succ_But();
                }
                else {
                    DisplayMassage("هناك خطــأ ", '(Error)', MessageType.Error);
                }
            }
        });
    }
    function Open() {
        Assign();
        MasterDetailModel.I_TR_OperationTF.UpdatedBy = SysSession.CurrentEnvironment.UserCode;
        MasterDetailModel.I_TR_OperationTF.UpdatedAt = DateTimeFormat(Date().toString());
        MasterDetailModel.I_TR_OperationTF.OperationTFID = GlobalTransferID;
        // creation
        if (SelectedModel.length > 0) {
            MasterDetailModel.I_TR_OperationTF.CreatedBy = SelectedModel[0].CreatedBy;
            MasterDetailModel.I_TR_OperationTF.CreatedAt = SelectedModel[0].CreatedAt;
        }
        else {
            MasterDetailModel.I_TR_OperationTF.CreatedBy = SysSession.CurrentEnvironment.UserCode;
            MasterDetailModel.I_TR_OperationTF.CreatedAt = DateTimeFormat(Date().toString());
        }
        MasterDetailModel.I_TR_OperationTF.IsSent = false;
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("Processes", "OpenProcesTransfer"),
            data: JSON.stringify(MasterDetailModel),
            success: function (d) {
                var result = d;
                if (result.IsSuccess == true) {
                    var res = result.Response;
                    DisplayMassage("تم فك التحويل " + res.Tr_No, 'Transfer decoded' + res.Tr_No, MessageType.Succeed);
                    GlobalTransferID = res.OperationTFID;
                    InitializeGrid();
                    AfterInsertOrUpdateFlag = true;
                    GridRowDoubleClick();
                    chkApproved.disabled = true;
                    btnUpdate.disabled = false;
                }
                else {
                    DisplayMassage("هناك خطــأ ", '(Error)', MessageType.Error);
                }
            }
        });
    }
    function Save() {
        InitializeGrid();
        $("#div_hedr").removeClass("disabledDiv");
        $("#divShow").removeClass("disabledDiv");
        $("#divGridShow").removeClass("disabledDiv");
        ShowButons();
        DisableControls();
    }
    //----------------------------------------------------------PRint region---------------------------------------
    function PrintReport(OutType) {
        ////debugger;
        var FromStore = $('#ddlSourceStore').val();
        var ToStore = $('#ddlToStore').val();
        var FromBra = $('#ddlSourceSalesman').val();
        var ToBra = $('#ddlToSalesman').val();
        var status = $('#ddlStatusFilter').val();
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
        if ($('#ddlOPerationMaster').val() == "null") {
            rp.OperationId = -1;
        }
        else {
            rp.OperationId = Number($('#ddlOPerationMaster').val());
        }
        if ($('#ddlSourceSalesman').val() == "null") {
            rp.FromSls = -1;
        }
        else {
            rp.FromSls = Number($('#ddlSourceSalesman').val());
        }
        if ($('#ddlToSalesman').val() == "null") {
            rp.ToSls = -1;
        }
        else {
            rp.FromSls = Number($('#ddlToSalesman').val());
        }
        if ($('#ddlStatusFilter').val() == "0") { // جديد 
            rp.Status = 0;
        }
        else if ($('#ddlStatusFilter').val() == "1") { //محول
            rp.Status = 1;
        }
        else { //الجميع
            rp.Status = 2;
        }
        Ajax.Callsync({
            url: Url.Action("IProc_Rpt_OerationTFList", "GeneralReports"),
            data: rp,
            success: function (d) {
                var result = d.result;
                window.open(result, "_blank");
            }
        });
    }
    SalesTrans.PrintReport = PrintReport;
    function btnPrintTransaction_onclick() {
        debugger;
        if (!SysSession.CurrentPrivileges.PrintOut)
            return;
        var rp = new ReportParameters();
        rp.TRId = GlobalTransferID;
        rp.Type = 0;
        rp.Name_function = "IProc_Prnt_OerationTf";
        localStorage.setItem("Report_Data", JSON.stringify(rp));
        localStorage.setItem("result", '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>');
        window.open(Url.Action("ReportsPopup", "Home"), "_blank");
    }
})(SalesTrans || (SalesTrans = {}));
//# sourceMappingURL=SalesTrans.js.map