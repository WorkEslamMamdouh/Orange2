$(document).ready(function () {
    DirectTransfer.InitalizeComponent();
});
var DirectTransfer;
(function (DirectTransfer) {
    //System
    var sys = new SystemTools();
    var SysSession = GetSystemSession(Modules.Directtransfer);
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
    var StoreSourceDetails = new Array();
    var StoreToDetails = new Array();
    var IQ_DirectTransferDetail = new Array();
    var SearchDetails = new Array();
    var ItemsListDetails = new Array();
    var ItemsSourceListDetails = new Array();
    var ItemsToListDetails = new Array();
    var HeaderWithDetailModel = new IQ_DirectTransferWithDetail();
    //Models
    var MasterDetailModel = new DirectTransferMasterDetails();
    var TranferHeaderModel = new I_Stk_TR_Transfer();
    var TransferDetailModel = new Array();
    var TransferDetailSingleModel = new I_Stk_TR_TransferDetails();
    var TransferDetailModelFiltered = new Array();
    var IQTransferDetailModel = new Array();
    var IQTransferDetailSingleModel = new IQ_GetTransferDetail();
    var SelectedTransferModel = new Array();
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
    //DropdownLists
    var ddlStatusFilter;
    var ddlSourceBranch;
    var ddlSourceStore;
    var ddlToBranch;
    var ddlToStore;
    var ddlSourceBranchAdd;
    var ddlSourceStoreAdd;
    var ddlToBranchAdd;
    var ddlToStoreAdd;
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
        (SysSession.CurrentEnvironment.ScreenLanguage == "ar") ? document.getElementById('Screen_name').innerHTML = "تحويل مباشر" : document.getElementById('Screen_name').innerHTML = "Direct Transfer";
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        Branch = Number(SysSession.CurrentEnvironment.BranchCode);
        FinYear = Number(SysSession.CurrentEnvironment.CurrentYear);
        InitalizeControls();
        // Call Fill Dropdownlists Functions  
        $("#ddlStatusFilter").prop("value", "2");
        fillddlBranchFilter();
        //Set Secial Values While Load
        txtFromDate.value = DateStartMonth();
        txtToDate.value = ConvertToDateDash(GetDate()) <= ConvertToDateDash(SysSession.CurrentEnvironment.EndDate) ? GetDate() : SysSession.CurrentEnvironment.EndDate;
        txtTransferDate.value = GetDate();
        InitalizeEvents();
        $('#btnPrint').addClass('display_none');
    }
    DirectTransfer.InitalizeComponent = InitalizeComponent;
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
        //DropdownLists
        ddlStatusFilter = document.getElementById("ddlStatusFilter");
        ddlSourceBranch = document.getElementById("ddlSourceBranch");
        ddlSourceStore = document.getElementById("ddlSourceStore");
        ddlToBranch = document.getElementById("ddlToBranch");
        ddlToStore = document.getElementById("ddlToStore");
        ddlSourceBranchAdd = document.getElementById("ddlSourceBranchAdd");
        ddlSourceStoreAdd = document.getElementById("ddlSourceStoreAdd");
        ddlToBranchAdd = document.getElementById("ddlToBranchAdd");
        ddlToStoreAdd = document.getElementById("ddlToStoreAdd");
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
        ddlSourceBranch.onchange = fillddlSourceStore;
        ddlToBranch.onchange = fillddlToStore;
        ddlSourceBranchAdd.onchange = fillddlSourceStoreAdd;
        ddlToBranchAdd.onchange = fillddlToStoreAdd;
        btnAdd.onclick = btnAdd_onclick;
        btnShow.onclick = btnShow_onclick;
        ddlSourceStoreAdd.onchange = ddlSourceStoreAdd_onchange;
        ddlToStoreAdd.onchange = ddlToStoreAdd_onchange;
        btnSave.onclick = btnSave_onClick;
        btnBack.onclick = btnBack_onclick;
        btnUpdate.onclick = btnUpdate_onclick;
        btnAddDetails.onclick = AddNewRow;
        txtSearch.onkeyup = txtSearch_onKeyup;
        chkApproved.onclick = chkApproved_checked;
        // printButton
        btnPrintTrview.onclick = function () { PrintReport(1); };
        btnPrintTrPDF.onclick = function () { PrintReport(2); };
        btnPrintTrEXEL.onclick = function () { PrintReport(3); };
        //btnPrint.onclick = () => { PrintReport(4); }
        btnPrintTransaction.onclick = btnPrintTransaction_onclick;
    }
    //------------------------------------------------------ Buttons Region -----------------------------------
    function btnUpdate_onclick() {
        if (!SysSession.CurrentPrivileges.EDIT)
            return;
        ddlSourceStoreAdd_onchange();
        ddlToStoreAdd_onchange();
        FlagAddOrEdit = 2;
        txtUpdatedAt.value = DateTimeFormat(Date().toString());
        txtUpdatedBy.value = SysSession.CurrentEnvironment.UserCode;
        chkApproved.disabled = false;
        ddlSourceBranchAdd.disabled = true;
        DisableDiv();
        EnableControls();
        txtTransferDate.disabled = false;
        HideButtons();
    }
    function btnAdd_onclick() {
        if (!SysSession.CurrentPrivileges.AddNew)
            return;
        CountGrid = 0;
        Clear();
        DisableDiv();
        HideButtons();
        EnableControls();
        showFlag = false;
        FlagAddOrEdit = 1;
        txtCreatedAt.value = DateTimeFormat(GetDate().toString());
        txtCreatedBy.value = SysSession.CurrentEnvironment.UserCode;
        $("#ddlSourceBranchAdd").prop("value", Branch.toString());
        ddlSourceBranchAdd.disabled = true;
        fillddlSourceStoreAdd();
        AddNewRow();
        $("#div_Approve").removeClass("display_none");
        $("#ddlToStoreAdd").empty();
        chkApproved.disabled = !SysSession.CurrentPrivileges.CUSTOM1;
    }
    function btnShow_onclick() {
        $("#divShow").removeClass("display_none");
        $("#div_Approve").addClass("display_none");
        $("#btnUpdate").addClass("display_none");
        $("#divTransferDetails").addClass("display_none");
        $("#divGridShow").removeClass("display_none");
        InitializeGrid();
    }
    function btnBack_onclick() {
        $("#div_hedr").removeClass("disabledDiv");
        $("#divIconbar").removeClass("disabledIconbar");
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
        if (!SysSession.CurrentPrivileges.CUSTOM2) {
            chkApproved.checked = true;
            return;
        }
        if (txtRemarks.disabled == true) {
            Open();
        }
    }
    //------------------------------------------------------ Normal Grid Region -----------------------------------
    function InitializeGrid() {
        var res = GetResourceList("");
        Grid.OnRowDoubleClicked = GridRowDoubleClick;
        Grid.ElementName = "divGridDetails_View";
        Grid.PrimaryKey = "TransfareID";
        Grid.Paging = true;
        Grid.PageSize = 10;
        Grid.Sorting = true;
        Grid.InsertionMode = JsGridInsertionMode.Binding;
        Grid.Editing = false;
        Grid.Inserting = false;
        Grid.SelectedIndex = 1;
        Grid.OnItemEditing = function () { };
        Grid.Columns = [
            { title: res.App_date, name: "TransfareID", type: "text", width: "", visible: false },
            { title: res.Trns_TrNO, name: "Tr_No", type: "text", width: "8.5%" },
            { title: res.Trns_RefNum, name: "RefNO", type: "text", width: "8.5%" },
            { title: res.App_date, name: "TrDate", type: "text", width: "11%" },
            { title: res.Transfer_type, name: "TrType_Desc", type: "text", width: "9.5%" },
            { title: res.Branch_Transferred_from, name: (lang == "ar" ? "SBr_DescA" : "SBr_DescE"), type: "text", width: "12.5%" },
            { title: res.Store_Transferred_from, name: (lang == "ar" ? "SSt_DescA" : "SSt_DescE"), type: "text", width: "15%" },
            { title: res.Branch_Transferred_To, name: (lang == "ar" ? "RBr_DescA" : "RBr_DescE"), type: "text", width: "12%" },
            { title: res.Store_Transferred_To, name: (lang == "ar" ? "RSt_DescA" : "RSt_DescE"), type: "text", width: "15%" },
            { title: res.Done_sent, name: "IsSent_Desc", type: "text", width: "8%" },
        ];
        BindGridData();
    }
    function BindGridData() {
        IQ_DirectTransferDetail = new Array();
        $("#divGridShow").removeClass("display_none");
        var FromDate = DateFormatRep(txtFromDate.value).toString();
        var toDate = DateFormatRep(txtToDate.value).toString();
        var status = 0;
        var sourcrBR = 0;
        var ToBR = 0;
        var sourcrStore = 0;
        var ToStore = 0;
        status = Number(ddlStatusFilter.value.toString());
        if (ddlSourceBranch.value != "null") {
            sourcrBR = Number(ddlSourceBranch.value.toString());
        }
        if (ddlToBranch.value != "null") {
            ToBR = Number(ddlToBranch.value.toString());
        }
        if (ddlSourceStore.value != "null") {
            sourcrStore = Number(ddlSourceStore.value.toString());
        }
        if (ddlToStore.value != "null") {
            ToStore = Number(ddlToStore.value.toString());
        }
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("DirectTransfer", "GetAllDirectTransferHeaderWithDetail"),
            data: { compcode: compcode, TrType: 0, TFType: 1, FromDate: FromDate, toDate: toDate, status: status, sourcrBR: sourcrBR, ToBR: ToBR, sourcrStore: sourcrStore, ToStore: ToStore, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token, MODULE_CODE: Modules.Directtransfer, FinYear: SysSession.CurrentEnvironment.CurrentYear },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    IQ_DirectTransferDetail = result.Response;
                    for (var i = 0; i < IQ_DirectTransferDetail.length; i++) {
                        IQ_DirectTransferDetail[i].TrDate = DateFormat(IQ_DirectTransferDetail[i].TrDate.toString());
                        IQ_DirectTransferDetail[i].IsSent == true ? IQ_DirectTransferDetail[i].IsSent_Desc = (lang == "ar" ? "تم" : "sent") : IQ_DirectTransferDetail[i].IsSent_Desc = (lang == "ar" ? "لا" : "not sent");
                        if (IQ_DirectTransferDetail[i].TrType == 0)
                            IQ_DirectTransferDetail[i].TrType_Desc = (lang == "ar" ? "تحويل مباشر" : "Direct transfer");
                    }
                    Grid.DataSource = IQ_DirectTransferDetail;
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
        SelectedTransferModel = IQ_DirectTransferDetail.filter(function (x) { return x.TransfareID == Number(Grid.SelectedKey); });
        if (AfterInsertOrUpdateFlag == true) {
            SelectedTransferModel = IQ_DirectTransferDetail.filter(function (x) { return x.TransfareID == GlobalTransferID; });
            AfterInsertOrUpdateFlag = false;
        }
        if (SelectedTransferModel.length > 0) {
            GlobalTransferID = Number(SelectedTransferModel[0].TransfareID);
            txtTrNo.value = SelectedTransferModel[0].Tr_No.toString();
            txtTransferDate.value = SelectedTransferModel[0].TrDate;
            txtApprovedBy.value = SelectedTransferModel[0].VerfiedBy;
            txtRemarks.value = SelectedTransferModel[0].Remark;
            if (SelectedTransferModel[0].RefNO != null)
                txtRefNumber.value = SelectedTransferModel[0].RefNO;
            fillddlBranchFilter();
            if (SelectedTransferModel[0].ReceiverBranchCode != null)
                ddlToBranchAdd.value = SelectedTransferModel[0].ReceiverBranchCode.toString();
            if (SelectedTransferModel[0].SenderBranchCode != null)
                ddlSourceBranchAdd.value = SelectedTransferModel[0].SenderBranchCode.toString();
            fillddlSourceStoreAdd();
            fillddlToStoreAdd();
            if (SelectedTransferModel[0].SenderStoreID != null) {
                ddlSourceStoreAdd.value = SelectedTransferModel[0].SenderStoreID.toString();
                GetAllStoreItems(SelectedTransferModel[0].SenderBranchCode, SelectedTransferModel[0].SenderStoreID);
            }
            if (SelectedTransferModel[0].ReceiverStoreID != null)
                ddlToStoreAdd.value = SelectedTransferModel[0].ReceiverStoreID.toString();
            // creation
            txtCreatedBy.value = SelectedTransferModel[0].CreatedBy;
            txtCreatedAt.value = SelectedTransferModel[0].CreatedAt;
            // Edit
            if (SelectedTransferModel[0].UpdatedBy != null) {
                txtUpdatedBy.value = SelectedTransferModel[0].UpdatedBy;
                txtUpdatedAt.value = SelectedTransferModel[0].UpdatedAt;
            }
            // Details
            TransferDetailModelFiltered = new Array();
            Ajax.Callsync({
                type: "Get",
                url: sys.apiUrl("DirectTransfer", "GetTransferByID"),
                data: { TransferID: GlobalTransferID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
                success: function (d) {
                    var result = d;
                    if (result.IsSuccess) {
                        HeaderWithDetailModel = result.Response;
                        TransferDetailModelFiltered = HeaderWithDetailModel.IQ_GetTransferDetail;
                        for (var i = 0; i < TransferDetailModelFiltered.length; i++) {
                            BuildControls(i);
                        }
                        CountGrid = TransferDetailModelFiltered.length;
                    }
                }
            });
            DisableControls();
            if (SelectedTransferModel[0].IsSent == true) {
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
        else if (ddlSourceBranchAdd.value == "null") {
            DisplayMassage('برجاء اختيار الفرع المحول منه', 'Please choose the branch you are transferring from', MessageType.Error);
            Errorinput(ddlSourceBranchAdd);
            return false;
        }
        else if (ddlSourceStoreAdd.value == "null") {
            DisplayMassage('برجاء اختيار المستودع المحول منه', 'Please choose the Store you are transferring from', MessageType.Error);
            Errorinput(ddlSourceStoreAdd);
            return false;
        }
        else if (ddlToBranchAdd.value == "null") {
            DisplayMassage('برجاء اختيار الفرع المحول اليه', 'Please choose the branch you are transferring to', MessageType.Error);
            Errorinput(ddlToBranchAdd);
            return false;
        }
        else if (ddlToStoreAdd.value == "null") {
            DisplayMassage('برجاء اختيار المستودع المحول اليه', 'Please choose the branch you are transferring to', MessageType.Error);
            Errorinput(ddlToStoreAdd);
            return false;
        }
        else if ((ddlToStoreAdd.value == ddlSourceStoreAdd.value) && (ddlToBranchAdd.value == ddlSourceBranchAdd.value)) {
            DisplayMassage(' لايمكن ان يحول المستودع و الفرع لنفسه ', 'The store and branch cannot be transferred to itself', MessageType.Error);
            Errorinput(ddlToStoreAdd);
            Errorinput(ddlToBranchAdd);
            return false;
        }
        else if (txtApprovedBy.value == "") {
            DisplayMassage('برجاء ادخال اعتماد بواسطه', 'Please enter Approved by', MessageType.Error);
            Errorinput(txtApprovedBy);
            return false;
        }
        else if (newCount == 0) {
            DisplayMassage('يجب ادخال اصناف التحويل', 'Please enter Transfering Items', MessageType.Error);
            Errorinput(ddlSourceBranchAdd);
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
        var convertQty = Number($("#txtConvertedQnty" + rowcount).val());
        if ($("#txt_StatusFlag" + rowcount).val() == "d" || $("#txt_StatusFlag" + rowcount).val() == "m") {
            return true;
        }
        else {
            if ($("#txtItemName" + rowcount).val() == "") {
                DisplayMassage('برجاء ادخال الصنف', 'Please enter item', MessageType.Error);
                Errorinput($("#txtItemName" + rowcount));
                return false;
            }
            else if (convertQty == 0) {
                DisplayMassage('برجاء ادخال الكمية المحولة', 'Please enter converted Quantity', MessageType.Error);
                Errorinput($("#txtConvertedQnty" + rowcount));
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
                if (Number($("#txtItemNumber" + i).val()) == itemValue && Number($("#TransfareDetailID" + i).val()) != NumberRowid) {
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
    //-----------------------------------------------------------------------  DropDownList Region ----------------------------------
    function fillddlBranchFilter() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GBranch", "GetAll"),
            data: {
                CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    BranchDetails = result.Response;
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                        DocumentActions.FillCombowithdefult(BranchDetails, ddlSourceBranch, "BRA_CODE", "BRA_DESCL", "Select branch");
                        DocumentActions.FillCombowithdefult(BranchDetails, ddlToBranch, "BRA_CODE", "BRA_DESCL", "Select branch");
                        DocumentActions.FillCombowithdefult(BranchDetails, ddlSourceBranchAdd, "BRA_CODE", "BRA_DESCL", "Select branch");
                        DocumentActions.FillCombowithdefult(BranchDetails, ddlToBranchAdd, "BRA_CODE", "BRA_DESCL", "Select branch");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(BranchDetails, ddlSourceBranch, "BRA_CODE", "BRA_DESC", "اختر الفرع");
                        DocumentActions.FillCombowithdefult(BranchDetails, ddlToBranch, "BRA_CODE", "BRA_DESC", "اختر الفرع");
                        DocumentActions.FillCombowithdefult(BranchDetails, ddlSourceBranchAdd, "BRA_CODE", "BRA_DESC", "اختر الفرع");
                        DocumentActions.FillCombowithdefult(BranchDetails, ddlToBranchAdd, "BRA_CODE", "BRA_DESC", "اختر الفرع");
                    }
                }
            }
        });
    }
    function fillddlSourceStore() {
        if (ddlSourceBranch.value != "null") {
            var Branch = Number(ddlSourceBranch.value);
            Ajax.Callsync({
                type: "Get",
                url: sys.apiUrl("StkDefStore", "GetAll"),
                data: {
                    CompCode: compcode, BranchCode: Branch, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
                },
                success: function (d) {
                    var result = d;
                    if (result.IsSuccess) {
                        StoreSourceDetails = result.Response;
                        if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                            DocumentActions.FillCombowithdefult(StoreSourceDetails, ddlSourceStore, "StoreId", "DescL", "Select Store");
                        }
                        else {
                            DocumentActions.FillCombowithdefult(StoreSourceDetails, ddlSourceStore, "StoreId", "DescA", "اختر المستودع");
                        }
                    }
                }
            });
        }
    }
    function fillddlToStore() {
        if (ddlToBranch.value != "null") {
            var Branch = Number(ddlToBranch.value);
            Ajax.Callsync({
                type: "Get",
                url: sys.apiUrl("StkDefStore", "GetAll"),
                data: {
                    CompCode: compcode, BranchCode: Branch, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
                },
                success: function (d) {
                    var result = d;
                    if (result.IsSuccess) {
                        StoreToDetails = result.Response;
                        if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                            DocumentActions.FillCombowithdefult(StoreToDetails, ddlToStore, "StoreId", "DescL", "Select Store");
                        }
                        else {
                            DocumentActions.FillCombowithdefult(StoreToDetails, ddlToStore, "StoreId", "DescA", "اختر المستودع");
                        }
                    }
                }
            });
        }
    }
    function fillddlSourceStoreAdd() {
        if (ddlSourceBranchAdd.value != "null") {
            var Branch = Number(ddlSourceBranchAdd.value);
            Ajax.Callsync({
                type: "Get",
                url: sys.apiUrl("StkDefStore", "GetAll"),
                data: {
                    CompCode: compcode, BranchCode: Branch, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
                },
                success: function (d) {
                    var result = d;
                    if (result.IsSuccess) {
                        StoreSourceDetails = result.Response;
                        if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                            DocumentActions.FillCombowithdefult(StoreSourceDetails, ddlSourceStoreAdd, "StoreId", "DescL", "Select Store");
                        }
                        else {
                            DocumentActions.FillCombowithdefult(StoreSourceDetails, ddlSourceStoreAdd, "StoreId", "DescA", "اختر المستودع");
                        }
                    }
                }
            });
        }
    }
    function fillddlToStoreAdd() {
        if (ddlToBranchAdd.value != "null") {
            var Branch = Number(ddlToBranchAdd.value);
            Ajax.Callsync({
                type: "Get",
                url: sys.apiUrl("StkDefStore", "GetAll"),
                data: {
                    CompCode: compcode, BranchCode: Branch, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
                },
                success: function (d) {
                    var result = d;
                    if (result.IsSuccess) {
                        StoreToDetails = result.Response;
                        if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                            DocumentActions.FillCombowithdefult(StoreToDetails, ddlToStoreAdd, "StoreId", "DescL", "Select Store");
                        }
                        else {
                            DocumentActions.FillCombowithdefult(StoreToDetails, ddlToStoreAdd, "StoreId", "DescA", "اختر المستودع");
                        }
                    }
                }
            });
        }
    }
    function ddlSourceStoreAdd_onchange() {
        if (ddlSourceStoreAdd.value != "null" && ddlSourceBranchAdd.value != "null") {
            var BranchID = Number(ddlSourceBranchAdd.value);
            var StoreID = Number(ddlSourceStoreAdd.value);
            GetAllStoreItems(BranchID, StoreID);
            ItemsSourceListDetails = new Array();
            ItemsSourceListDetails = ItemsListDetails;
        }
    }
    function ddlToStoreAdd_onchange() {
        if (ddlToStoreAdd.value != "null" && ddlToBranchAdd.value != "null") {
            if ((ddlToStoreAdd.value == ddlSourceStoreAdd.value) && (ddlToBranchAdd.value == ddlSourceBranchAdd.value)) {
                DisplayMassage(' لايمكن ان يحول المستودع و الفرع لنفسه ', 'The store and branch cannot be transferred to itself', MessageType.Error);
                ddlToStoreAdd.focus();
                ddlToStoreAdd.value = "null";
            }
            else {
                var BranchID = Number(ddlToBranchAdd.value);
                var StoreID = Number(ddlToStoreAdd.value);
                GetAllStoreItems(BranchID, StoreID);
                ItemsToListDetails = new Array();
                ItemsToListDetails = ItemsListDetails;
            }
        }
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
        ddlSourceBranchAdd.value = 'null';
        ddlSourceStoreAdd.value = 'null';
        ddlToBranchAdd.value = 'null';
        ddlToStoreAdd.value = 'null';
        chkApproved.checked = false;
    }
    function txtSearch_onKeyup() {
        $("#divGridDetails_View").jsGrid("option", "pageIndex", 1);
        if (txtSearch.value != "") {
            var search_1 = txtSearch.value.toLowerCase();
            SearchDetails = IQ_DirectTransferDetail.filter(function (x) { return x.RBr_DescA.toString().toLowerCase().search(search_1) >= 0 || x.RBr_DescE.toString().toLowerCase().search(search_1) >= 0
                || x.SBr_DescA.toLowerCase().search(search_1) >= 0 || x.SBr_DescE.toLowerCase().search(search_1) >= 0
                || x.RSt_DescA.toLowerCase().search(search_1) >= 0 || x.RSt_DescE.toLowerCase().search(search_1) >= 0
                || x.SSt_DescA.toString().search(search_1) >= 0 || x.SSt_DescE.toString().search(search_1) >= 0
                || x.Tr_No.toString().search(search_1) >= 0 || x.RefNO.toString().search(search_1) >= 0; });
            Grid.DataSource = SearchDetails;
            Grid.Bind();
        }
        else {
            Grid.DataSource = IQ_DirectTransferDetail;
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
            $("#txtUntitName" + i).attr("disabled", "disabled");
            $("#txtSrcQty" + i).attr("disabled", "disabled");
            $("#txtToQty" + i).attr("disabled", "disabled");
            $("#txtConvertedQnty" + i).removeClass("display_none");
            $("#txtUntitName" + i).removeClass("display_none");
        }
        txtTrNo.disabled = true;
        txtCreatedAt.disabled = true;
        txtCreatedBy.disabled = true;
        txtUpdatedAt.disabled = true;
        txtUpdatedBy.disabled = true;
    }
    function DisableControls() {
        $("#divTransferDetails :input").attr("disabled", "disabled");
        $("#btnAddDetails").addClass("display_none");
        $("#btnPrintTransaction").removeClass("display_none");
        for (var i = 0; i < CountGrid; i++) {
            $("#btnSearchItems" + i).attr("disabled", "disabled");
            $("#txtConvertedQnty" + i).attr("disabled", "disabled");
            $("#txtUntitName" + i).attr("disabled", "disabled");
            $("#txtUntitName" + i).attr("disabled", "disabled");
            $("#txtSrcQty" + i).attr("disabled", "disabled");
            $("#txtToQty" + i).attr("disabled", "disabled");
            $("#btn_minus" + i).addClass("display_none");
        }
        txtTrNo.disabled = true;
        txtTransferDate.disabled = true;
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
        $("#divIconbar").addClass("disabledIconbar");
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
            $("#txtSerial" + CountGrid).attr("disabled", "disabled");
            $("#btnSearchItems" + CountGrid).removeAttr("disabled");
            $("#txtItemNumber" + CountGrid).attr("disabled", "disabled");
            $("#txtItemName" + CountGrid).attr("disabled", "disabled");
            $("#txtConvertedQnty" + CountGrid).removeAttr("disabled");
            $("#txtUntitName" + CountGrid).attr("disabled", "disabled");
            $("#txtItemCode" + CountGrid).removeAttr("disabled");
            $("#txtSrcQty" + CountGrid).attr("disabled", "disabled");
            $("#txtToQty" + CountGrid).attr("disabled", "disabled");
            // can delete new inserted record  without need for delete privilage
            $("#btn_minus" + CountGrid).removeClass("display_none");
            $("#btn_minus" + CountGrid).removeAttr("disabled");
            CountGrid++;
        }
    }
    function BuildControls(cnt) {
        var html = "";
        html = "<tr id= \"No_Row" + cnt + "\">\n                    <input id=\"TransfareDetailID" + cnt + "\" type=\"hidden\" class=\"form-control display_none\"  />                \n                    <input id=\"txtSerial" + cnt + "\" type=\"hidden\" name=\"FromDate\" class=\"form-control display_none\" value=\"" + (CountGrid + 1) + "\"  />\n                    <input id=\"txtItemNumber" + cnt + "\" type=\"hidden\" name=\"FromDate\" class=\"form-control display_none\" value=\"" + (CountGrid + 1) + "\"  />\n                    <td>\n\t\t                <div class=\"form-group\">\n\t\t\t                <span id=\"btn_minus" + cnt + "\"><i class=\"fas fa-minus-circle  btn-minus\"></i></span>\n\t\t                </div>\n\t                </td>\n                    <td>\n\t                    <div class=\"form-group\">\n\t\t                    <button type=\"button\" class=\"style_ButSearch\" id=\"btnSearchItems" + cnt + "\" name=\"ColSearch\" disabled>\n\t\t                         <i class=\"fa fa-search  \"></i>\n\t\t                     </button>\n\t                    </div>\n                    </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n                            <input id=\"txtItemCode" + cnt + "\" type=\"text\" class=\"form-control\" name=\"\" disabled />\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n                            <input id=\"txtItemName" + cnt + "\" type=\"text\" class=\"form-control\" name=\"\" disabled />\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n                            <input id=\"txtUntitName" + cnt + "\" type=\"text\" class=\"form-control\" name=\"\" disabled />\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n                            <input id=\"txtSrcQty" + cnt + "\" type=\"text\" class=\"form-control\" name=\"\" disabled />\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n                            <input id=\"txtToQty" + cnt + "\" type=\"text\" class=\"form-control\" name=\"\" disabled />\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n                            <input id=\"txtConvertedQnty" + cnt + "\" type=\"number\" value=\"0\"  min=\"0\" class=\"form-control\" name=\"\" disabled />\n\t\t                </div>\n\t                </td>\n               <input id=\"txtUnitID" + cnt + "\" type=\"hidden\"   />\n               <input id=\"txt_StatusFlag" + cnt + "\" type=\"hidden\"   />\n               <input id=\"txt_OnhandQty" + cnt + "\" type=\"hidden\"   />\n               <input id=\"UnitCost" + cnt + "\" type=\"hidden\"   />\n                </tr>";
        $("#div_Data").append(html);
        //// Items Search
        $('#btnSearchItems' + cnt).click(function (e) {
            var sys = new SystemTools();
            if (ddlSourceStoreAdd.value == "null" || ddlToStoreAdd.value == "null" || ddlToStoreAdd.value == "") {
                DisplayMassage("يجب اختيار المستودع الذي سيتم التحويل منه و المستودع الذي سيتم التحويل له ", "You must choose the store from which the transfer will be made and the store to which the transfer will be made", MessageType.Error);
                Errorinput(ddlSourceStoreAdd);
                Errorinput(ddlToStoreAdd);
                Errorinput(ddlToStoreAdd);
            }
            else {
                var storeId = Number(ddlSourceStoreAdd.value);
                sys.FindKey(Modules.Directtransfer, "btnSearchItems", "StoreId=" + storeId + " and OnhandQty > 0 and IsStock = 1 and FinYear = " + FinYear, function () {
                    debugger;
                    var id = SearchGrid.SearchDataGrid.SelectedKey;
                    var res = false;
                    var NumberRowid = Number($("#TransfareDetailID" + cnt).val());
                    res = checkRepeatedItems(id, NumberRowid);
                    if (res == false) {
                        if ($("#txt_StatusFlag" + cnt).val() != "i")
                            $("#txt_StatusFlag" + cnt).val("u");
                        debugger;
                        var SrcItem = ItemsSourceListDetails.filter(function (s) { return s.ItemID == id; });
                        var Toitem = ItemsToListDetails.filter(function (s) { return s.ItemID == id; });
                        if (SrcItem.length > 0) {
                            if (SysSession.CurrentEnvironment.I_Control[0].IsLocalCost == false) {
                                $("#UnitCost" + cnt).prop("value", SrcItem[0].GlobalCost);
                            }
                            else {
                                $("#UnitCost" + cnt).prop("value", SrcItem[0].LocalCost);
                            }
                            debugger;
                            $('#txtItemNumber' + cnt).val(id);
                            (SysSession.CurrentEnvironment.ScreenLanguage == "ar") ? $('#txtItemName' + cnt).val(SrcItem[0].Itm_DescA) : $('#txtItemName' + cnt).val(SrcItem[0].Itm_DescE);
                            (SysSession.CurrentEnvironment.ScreenLanguage == "ar") ? $('#txtUntitName' + cnt).val(SrcItem[0].Uom_DescA) : $('#txtUntitName' + cnt).val(SrcItem[0].Uom_DescE);
                            $('#txt_OnhandQty' + cnt).val(SrcItem[0].OnhandQty);
                            $('#txtItemCode' + cnt).val(SrcItem[0].ItemCode);
                            $('#txtSrcQty' + cnt).val(SrcItem[0].OnhandQty);
                            $('#txtUnitID' + cnt).val(SrcItem[0].UomID);
                            $('#txtToQty' + cnt).val(Toitem.length == 0 ? 0 : Toitem[0].OnhandQty);
                            $('#txtConvertedQnty' + cnt).val("0");
                            debugger;
                        }
                    }
                    else {
                        DisplayMassage('( لايمكن تكرار نفس الاصناف في التحويل )', 'The same items cannot be duplicated in the transfer', MessageType.Error);
                        $('#txtItemCode' + cnt).val("");
                        $('#txt_OnhandQty' + cnt).val("");
                        $('#txtItemNumber' + cnt).val("");
                        $('#txtItemCode' + cnt).val("");
                        $('#txtSrcQty' + cnt).val("");
                        $('#txtToQty' + cnt).val("");
                        $('#txtUnitID' + cnt).val("");
                        $('#UnitCost' + cnt).val("");
                    }
                });
            }
        });
        //Quintity on change  
        $("#txtConvertedQnty" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
            var ConvertedQntyVal = Number($('#txtConvertedQnty' + cnt).val());
            var ItemID = Number($('#txtItemNumber' + cnt).val());
            var selectedItem = ItemsSourceListDetails.filter(function (s) { return s.ItemID == ItemID; });
            if (selectedItem[0].OnhandQty < ConvertedQntyVal) {
                DisplayMassage("لا يمكن تحويل كمية اكبر من الكمية المتاحه ", 'It is not possible to transfer an amount greater than the available quantity', MessageType.Error);
                $('#txtConvertedQnty' + cnt).val(selectedItem[0].OnhandQty);
            }
        });
        //Item Code Onchange
        $("#txtItemCode" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
            var ItemCode = $('#txtItemCode' + cnt).val();
            var SrcItem = ItemsSourceListDetails.filter(function (s) { return s.ItemCode == ItemCode; });
            var Toitem = ItemsToListDetails.filter(function (s) { return s.ItemCode == ItemCode; });
            if (ddlSourceStoreAdd.value == "null" || ddlToStoreAdd.value == "null" || ddlToStoreAdd.value == "") {
                DisplayMassage("يجب اختيار المستودع الذي سيتم التحويل منه و المستودع الذي سيتم التحويل له ", "You must choose the store from which the transfer will be made and the store to which the transfer will be made", MessageType.Error);
                Errorinput(ddlSourceStoreAdd);
                Errorinput(ddlToStoreAdd);
                Errorinput(ddlToStoreAdd);
                $('#txtItemCode' + cnt).val("");
            }
            else {
                if (SrcItem.length > 0) {
                    var res = false;
                    var NumberRowid = Number($("#TransfareDetailID" + cnt).val());
                    var id = Number(SrcItem[0].ItemID);
                    res = checkRepeatedItems(id, NumberRowid);
                    if (res == false) {
                        $('#txtItemNumber' + cnt).val(SrcItem[0].ItemID);
                        (SysSession.CurrentEnvironment.ScreenLanguage == "ar") ? $('#txtItemName' + cnt).val(SrcItem[0].Itm_DescA) : $('#txtItemName' + cnt).val(SrcItem[0].Itm_DescE);
                        (SysSession.CurrentEnvironment.ScreenLanguage == "ar") ? $('#txtUntitName' + cnt).val(SrcItem[0].Uom_DescA) : $('#txtUntitName' + cnt).val(SrcItem[0].Uom_DescE);
                        $('#txt_OnhandQty' + cnt).val(SrcItem[0].OnhandQty);
                        $('#txtItemCode' + cnt).val(SrcItem[0].ItemCode);
                        $('#txtSrcQty' + cnt).val(SrcItem[0].OnhandQty);
                        $('#txtToQty' + cnt).val(Toitem[0].OnhandQty);
                        $('#txtUnitID' + cnt).val(SrcItem[0].UomID);
                    }
                    else {
                        DisplayMassage('( لايمكن تكرار نفس الاصناف في التحويل )', 'The same items cannot be duplicated in the transfer', MessageType.Error);
                        $('#txtItemCode' + cnt).val("");
                        $('#txt_OnhandQty' + cnt).val("");
                        $('#txtItemNumber' + cnt).val("");
                        $('#txtItemCode' + cnt).val("");
                        $('#txtSrcQty' + cnt).val("");
                        $('#txtToQty' + cnt).val("");
                        $('#txtUnitID' + cnt).val("");
                    }
                }
                else {
                    $('#txtItemNumber' + cnt).val("");
                    $('#txtItemCode' + cnt).val("");
                    $('#txtItemName' + cnt).val("");
                    $('#txtUntitName' + cnt).val("");
                    $('#txt_OnhandQty' + cnt).val("");
                    $('#txtItemCode' + cnt).val("");
                    $('#txtSrcQty' + cnt).val("");
                    $('#txtToQty' + cnt).val("");
                    $('#txtUnitID' + cnt).val("");
                    if (ddlSourceStoreAdd.value == "null" || ddlToStoreAdd.value == "null" || ddlToStoreAdd.value == "") {
                        DisplayMassage("يجب اختيار المستودع الذي سيتم التحويل منه و المستودع الذي سيتم التحويل له ", "You must choose the store from which the transfer will be made and the store to which the transfer will be made", MessageType.Error);
                        Errorinput(ddlSourceStoreAdd);
                        Errorinput(ddlToStoreAdd);
                        Errorinput(ddlToStoreAdd);
                    }
                    else
                        DisplayMassage("كود الصنف غير صحيح ", "Wrong Item Code ", MessageType.Error);
                }
            }
        });
        $("#btn_minus" + cnt).on('click', function () {
            DeleteRow(cnt);
        });
        if (showFlag == true) {
            $('#UnitCost' + cnt).val(TransferDetailModelFiltered[cnt].UnitCost);
            $('#txtSerial' + cnt).val(TransferDetailModelFiltered[cnt].Serial);
            $('#TransfareDetailID' + cnt).val(TransferDetailModelFiltered[cnt].TransfareDetailID);
            $('#txtItemNumber' + cnt).val(TransferDetailModelFiltered[cnt].ItemID);
            (SysSession.CurrentEnvironment.ScreenLanguage == "ar") ? $('#txtItemName' + cnt).val(TransferDetailModelFiltered[cnt].Itm_DescA) : $('#txtItemName' + cnt).val(TransferDetailModelFiltered[cnt].Itm_DescE);
            if (TransferDetailModelFiltered[cnt].StockSendQty != null)
                $('#txtConvertedQnty' + cnt).val(TransferDetailModelFiltered[cnt].SendQty.toString());
            $('#txtItemCode' + cnt).val(TransferDetailModelFiltered[cnt].ItemCode);
            $('#txtUnitID' + cnt).val(TransferDetailModelFiltered[cnt].UnitID);
            (SysSession.CurrentEnvironment.ScreenLanguage == "ar") ? $('#txtUntitName' + cnt).val(TransferDetailModelFiltered[cnt].uom_DescA) : $('#txtUntitName' + cnt).val(TransferDetailModelFiltered[cnt].uom_DescE);
            $('#txtSrcQty' + cnt).val(TransferDetailModelFiltered[cnt].SrcOhnandQty);
            $('#txtToQty' + cnt).val(TransferDetailModelFiltered[cnt].RecOnhandQty);
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
            $("#txtItemNumber" + RecNo).val("99");
            $("#txtItemName" + RecNo).val("1");
            $("#txtConvertedQnty" + RecNo).val("1");
            $("#txtUntitName" + RecNo).val("1");
            $("#txtItemCode" + RecNo).val("1");
            $("#txtSrcQty" + RecNo).val("1");
            $("#txtToQty" + RecNo).val("1");
            $("#txtUnitID" + RecNo).val("1");
            $("#No_Row" + RecNo).attr("hidden", "true");
            var counter = 0;
            for (var i = 0; i < CountGrid; i++) {
                var flagvalue = $("#txt_StatusFlag" + i).val();
                if (flagvalue != "d" && flagvalue != "m") {
                    if ($("#txt_StatusFlag" + i).val() != "i")
                        $("#txt_StatusFlag" + i).val("u");
                    $("#txtSerial" + i).prop("value", counter + 1);
                    counter = counter + 1;
                }
            }
        });
    }
    //---------------------------------------------- get By id  functions ----------------------------------------
    function GetAllStoreItems(BranchID, StoreID) {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("DirectTransfer", "GetAllItemsInStore"),
            data: { branch: BranchID, comp: compcode, Store: StoreID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    ItemsListDetails = result.Response;
                    ItemsListDetails = ItemsListDetails.filter(function (x) { return x.IsStock == true && x.FinYear == FinYear; });
                }
            }
        });
    }
    //--------------------------------------------------- Main Functions-----------------------------------------------
    function Assign() {
        MasterDetailModel = new DirectTransferMasterDetails();
        TranferHeaderModel = new I_Stk_TR_Transfer();
        TransferDetailModel = new Array();
        // Header Data
        TranferHeaderModel.Tr_No = Number(txtTrNo.value);
        TranferHeaderModel.TrType = 0;
        TranferHeaderModel.TFType = 1;
        TranferHeaderModel.CompCode = Number(SysSession.CurrentEnvironment.CompCode);
        TranferHeaderModel.BranchCode = Number(Branch);
        TranferHeaderModel.TrDate = txtTransferDate.value;
        TranferHeaderModel.RefNO = txtRefNumber.value;
        if (chkApproved.checked == true) {
            TranferHeaderModel.IsSent = true;
        }
        else {
            TranferHeaderModel.IsSent = false;
        }
        TranferHeaderModel.SenderBranchCode = Number(ddlSourceBranchAdd.value);
        TranferHeaderModel.ReceiverBranchCode = Number(ddlToBranchAdd.value);
        TranferHeaderModel.SenderStoreID = Number(ddlSourceStoreAdd.value);
        TranferHeaderModel.ReceiverStoreID = Number(ddlToStoreAdd.value);
        TranferHeaderModel.VerfiedBy = txtApprovedBy.value;
        TranferHeaderModel.Remark = txtRemarks.value;
        var StatusFlag;
        // Details
        for (var i = 0; i < CountGrid; i++) {
            TransferDetailSingleModel = new I_Stk_TR_TransferDetails();
            StatusFlag = $("#txt_StatusFlag" + i).val();
            TransferDetailSingleModel.StatusFlag = StatusFlag.toString();
            if (StatusFlag == "i") {
                TransferDetailSingleModel.TransfareDetailID = 0;
                TransferDetailSingleModel.Serial = $("#txtSerial" + i).val();
                TransferDetailSingleModel.ItemID = $("#txtItemNumber" + i).val();
                TransferDetailSingleModel.StockSendQty = $("#txtConvertedQnty" + i).val();
                TransferDetailSingleModel.SendQty = $("#txtConvertedQnty" + i).val();
                TransferDetailSingleModel.UnitID = Number($("#txtUnitID" + i).val());
                TransferDetailSingleModel.RecOnhandQty = Number($("#txtToQty" + i).val());
                TransferDetailSingleModel.SrcOhnandQty = Number($("#txtSrcQty" + i).val());
                TransferDetailSingleModel.UnitCost = Number($("#UnitCost" + i).val());
                TransferDetailModel.push(TransferDetailSingleModel);
            }
            else if (StatusFlag == "u") {
                TransferDetailSingleModel.TransfareDetailID = $("#TransfareDetailID" + i).val();
                TransferDetailSingleModel.Serial = $("#txtSerial" + i).val();
                TransferDetailSingleModel.ItemID = $("#txtItemNumber" + i).val();
                TransferDetailSingleModel.StockSendQty = $("#txtConvertedQnty" + i).val();
                TransferDetailSingleModel.SendQty = $("#txtConvertedQnty" + i).val();
                TransferDetailSingleModel.UnitID = Number($("#txtUnitID" + i).val());
                TransferDetailSingleModel.RecOnhandQty = Number($("#txtToQty" + i).val());
                TransferDetailSingleModel.SrcOhnandQty = Number($("#txtSrcQty" + i).val());
                TransferDetailSingleModel.UnitCost = Number($("#UnitCost" + i).val());
                TransferDetailModel.push(TransferDetailSingleModel);
            }
            else if (StatusFlag == "d") {
                if (FlagAddOrEdit == 2) {
                    if ($("#TransfareDetailID" + i).val() != "") {
                        var deletedID = $("#TransfareDetailID" + i).val();
                        TransferDetailSingleModel.TransfareDetailID = deletedID;
                        TransferDetailModel.push(TransferDetailSingleModel);
                    }
                }
            }
        }
        MasterDetailModel.I_Stk_TR_Transfer = TranferHeaderModel;
        MasterDetailModel.I_Stk_TR_TransferDetails = TransferDetailModel;
        MasterDetailModel.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
        MasterDetailModel.UserCode = SysSession.CurrentEnvironment.UserCode;
        MasterDetailModel.Branch_Code = SysSession.CurrentEnvironment.BranchCode;
        MasterDetailModel.Comp_Code = SysSession.CurrentEnvironment.CompCode;
        MasterDetailModel.MODULE_CODE = Modules.Directtransfer;
        MasterDetailModel.UserCode = SysSession.CurrentEnvironment.UserCode;
        MasterDetailModel.sec_FinYear = SysSession.CurrentEnvironment.CurrentYear;
    }
    function Insert() {
        MasterDetailModel.I_Stk_TR_Transfer.CreatedBy = SysSession.CurrentEnvironment.UserCode;
        MasterDetailModel.I_Stk_TR_Transfer.CreatedAt = DateTimeFormat(Date().toString());
        MasterDetailModel.I_Stk_TR_Transfer.TransfareID = 0;
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("DirectTransfer", "InsertDirectTransferMasterDetail"),
            data: JSON.stringify(MasterDetailModel),
            success: function (d) {
                var result = d;
                if (result.IsSuccess == true) {
                    var res = result.Response;
                    DateSetsSccess("txtTransferDate", "txtFromDate", "txtToDate");
                    btnShow_onclick();
                    DisplayMassage("تم اصدار  تحويل رقم " + res.Tr_No, 'Transfer number ' + res.Tr_No + 'has been issued', MessageType.Succeed);
                    txtTrNo.value = res.Tr_No.toString();
                    GlobalTransferID = res.TransfareID;
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
        MasterDetailModel.I_Stk_TR_Transfer.UpdatedBy = SysSession.CurrentEnvironment.UserCode;
        MasterDetailModel.I_Stk_TR_Transfer.UpdatedAt = DateTimeFormat(Date().toString());
        MasterDetailModel.I_Stk_TR_Transfer.TransfareID = GlobalTransferID;
        // creation
        if (SelectedTransferModel.length > 0) {
            MasterDetailModel.I_Stk_TR_Transfer.CreatedBy = SelectedTransferModel[0].CreatedBy;
            MasterDetailModel.I_Stk_TR_Transfer.CreatedAt = SelectedTransferModel[0].CreatedAt;
        }
        else {
            MasterDetailModel.I_Stk_TR_Transfer.CreatedBy = SysSession.CurrentEnvironment.UserCode;
            MasterDetailModel.I_Stk_TR_Transfer.CreatedAt = DateTimeFormat(Date().toString());
        }
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("DirectTransfer", "UpdateDirectTransferDetail"),
            data: JSON.stringify(MasterDetailModel),
            success: function (d) {
                var result = d;
                if (result.IsSuccess == true) {
                    var res = result.Response;
                    DateSetsSccess("txtTransferDate", "txtFromDate", "txtToDate");
                    btnShow_onclick();
                    DisplayMassage("تم التعديل بنجاح " + res.Tr_No, 'Editied successfully' + res.Tr_No, MessageType.Succeed);
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
    function Open() {
        if (!CheckPeriodDate(txtTransferDate.value, "I")) {
            debugger;
            DisplayMassage("لا يمكنك الاضافه او التعديل في هذة الفتره المغلقه ", "Please select a Invoice data", MessageType.Error);
            Errorinput(txtTransferDate);
            chkApproved.checked = true;
            return false;
        }
        Assign();
        MasterDetailModel.I_Stk_TR_Transfer.UpdatedBy = SysSession.CurrentEnvironment.UserCode;
        MasterDetailModel.I_Stk_TR_Transfer.UpdatedAt = DateTimeFormat(Date().toString());
        MasterDetailModel.I_Stk_TR_Transfer.TransfareID = GlobalTransferID;
        // creation
        if (SelectedTransferModel.length > 0) {
            MasterDetailModel.I_Stk_TR_Transfer.CreatedBy = SelectedTransferModel[0].CreatedBy;
            MasterDetailModel.I_Stk_TR_Transfer.CreatedAt = SelectedTransferModel[0].CreatedAt;
        }
        else {
            MasterDetailModel.I_Stk_TR_Transfer.CreatedBy = SysSession.CurrentEnvironment.UserCode;
            MasterDetailModel.I_Stk_TR_Transfer.CreatedAt = DateTimeFormat(Date().toString());
        }
        MasterDetailModel.I_Stk_TR_Transfer.IsSent = false;
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("DirectTransfer", "Open"),
            data: JSON.stringify(MasterDetailModel),
            success: function (d) {
                var result = d;
                if (result.IsSuccess == true) {
                    var res = result.Response;
                    DisplayMassage("تم فك التحويل " + res.Tr_No, 'Transfer decoded' + res.Tr_No, MessageType.Succeed);
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
        $("#divIconbar").removeClass("disabledIconbar");
        $("#divShow").removeClass("disabledDiv");
        $("#divGridShow").removeClass("disabledDiv");
        ShowButons();
        DisableControls();
    }
    //----------------------------------------------------------PRint region---------------------------------------
    function PrintReport(OutType) {
        //// 
        var FromStore = $('#ddlSourceStore').val();
        var ToStore = $('#ddlToStore').val();
        var FromBra = $('#ddlSourceBranch').val();
        var ToBra = $('#ddlToBranch').val();
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
        rp.TrType = 0;
        rp.TfType = 1;
        if (FromBra == "null") {
            rp.FromBra = -1;
            rp.FromstoreID = -1;
        }
        else {
            rp.FromBra = FromBra;
            rp.FromstoreID = FromStore;
        }
        if (ToBra == "null") {
            rp.ToBra = -1;
            rp.ToStoreID = -1;
        }
        else {
            rp.ToBra = ToBra;
            rp.ToStoreID = ToStore;
        }
        rp.Status = Number(status);
        Ajax.Callsync({
            url: Url.Action("IProc_Rpt_StkTransferList", "GeneralReports"),
            data: rp,
            success: function (d) {
                var result = d.result;
                window.open(result, "_blank");
            }
        });
    }
    DirectTransfer.PrintReport = PrintReport;
    function btnPrintTransaction_onclick() {
        if (!SysSession.CurrentPrivileges.PrintOut)
            return;
        var rp = new ReportParameters();
        rp.FromDate = DateFormatRep(GetDate().toString());
        rp.ToDate = DateFormatRep(GetDate().toString());
        rp.TRId = GlobalTransferID;
        rp.Type = 0;
        rp.Name_function = "IProc_Prnt_StkTransfer";
        localStorage.setItem("Report_Data", JSON.stringify(rp));
        localStorage.setItem("result", '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>');
        window.open(Url.Action("ReportsPopup", "Home"), "_blank");
    }
})(DirectTransfer || (DirectTransfer = {}));
//# sourceMappingURL=DirectTransfer.js.map