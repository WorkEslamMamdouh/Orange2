$(document).ready(function () {
    STKAdjust.InitalizeComponent();
});
var STKAdjust;
(function (STKAdjust) {
    //debugger
    //System
    var sys = new SystemTools();
    var SysSession = GetSystemSession(Modules.STKAdjust);
    var compcode;
    var Branch;
    var startDate;
    var EndDate;
    var FinYear;
    //GridView
    var Grid = new JsGrid();
    //Arrays
    var StatesFilterDetailsAr = new Array();
    var StatesFilterDetailsEn = new Array();
    var StoreSourceDetails = new Array();
    var IQ_GetStkAdjustDetailModel = new Array();
    var SearchDetails = new Array();
    var ItemsLoadDetails = new Array();
    var ItemsToListDetails = new Array();
    var CategoryDetails = new Array();
    var ItemsDetails = new Array();
    //Models
    var MasterDetailModel = new StockAdjustMasterDetails();
    var StockHeaderModel = new I_Stk_TR_Adjust();
    var StockDetailModel = new Array();
    var StockDetailSingleModel = new I_Stk_Tr_AdjustDetails();
    var StockDetailModelFiltered = new Array();
    var SelectedStockModel = new Array();
    var headerWithDetail = new IQ_GetStkAdjustWithDetail();
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
    var txtRemarks;
    //DropdownLists
    var ddlStatusFilter;
    var ddlStatusAdd;
    var ddlSourceStore;
    var ddlCategory;
    var ddlFamily;
    var ddlSourceStoreAdd;
    //buttons
    var btnRefash;
    var btnShow;
    var btnAdd;
    var btnUpdate;
    var btnSave;
    var btnBack;
    var btnAddDetails;
    var btnLoad;
    //check box
    var chkApproved;
    // Flages
    var FlagAddOrEdit = 0; //1 Add 2 Edit
    var showFlag = false;
    var AfterInsertOrUpdateFlag = false;
    //global
    var CountGrid = 0;
    var GlobalAdjustID = 0;
    // printButton
    var btnPrintTrview;
    var btnPrintTrPDF;
    var btnPrintTrEXEL;
    var btnPrint;
    var btnPrintTransaction;
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);
    function InitalizeComponent() {
        //System
        //debugger
        (SysSession.CurrentEnvironment.ScreenLanguage == "ar") ? document.getElementById('Screen_name').innerHTML = "تسوية مخزون" : document.getElementById('Screen_name').innerHTML = "Stock Adjustment";
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        Branch = Number(SysSession.CurrentEnvironment.BranchCode);
        FinYear = Number(SysSession.CurrentEnvironment.CurrentYear);
        InitalizeControls();
        fillddlSourceStore();
        // Call Fill Dropdownlists Functions
        fillddlStatusFilter();
        fillddlStatusAdd();
        $("#ddlStatusFilter").prop("value", "3");
        $("#ddlstatus").prop("value", "2");
        FillddlCategory();
        fillddlSourceStoreAdd();
        //Set Secial Values While Load
        txtFromDate.value = DateStartMonth();
        txtToDate.value = ConvertToDateDash(GetDate()) <= ConvertToDateDash(SysSession.CurrentEnvironment.EndDate) ? GetDate() : SysSession.CurrentEnvironment.EndDate;
        txtTransferDate.value = GetDate();
        InitalizeEvents();
        $('#btnPrint').addClass('display_none');
    }
    STKAdjust.InitalizeComponent = InitalizeComponent;
    //------------------------------------------------------ Main Region -----------------------------------
    function InitalizeControls() {
        //textboxs
        txtFromDate = document.getElementById("txtFromDate");
        txtToDate = document.getElementById("txtToDate");
        txtTrNo = document.getElementById("txtTrNo");
        txtTransferDate = document.getElementById("txtTransferDate");
        txtRemarks = document.getElementById("txtRemarks");
        txtRefNumber = document.getElementById("txtRefNumber");
        txtCreatedBy = document.getElementById("txtCreatedBy");
        txtCreatedAt = document.getElementById("txtCreatedAt");
        txtUpdatedBy = document.getElementById("txtUpdatedBy");
        txtUpdatedAt = document.getElementById("txtUpdatedAt");
        txtSearch = document.getElementById("txtSearch");
        //DropdownLists
        ddlStatusFilter = document.getElementById("ddlStatusFilter");
        ddlStatusAdd = document.getElementById("ddlStatusAdd");
        ddlSourceStore = document.getElementById("ddlSourceStore");
        ddlSourceStoreAdd = document.getElementById("ddlSourceStoreAdd");
        ddlCategory = document.getElementById("ddlCategory");
        ddlFamily = document.getElementById("ddlFamily");
        //buttons
        btnRefash = document.getElementById("btnRefash");
        btnShow = document.getElementById("btnShow");
        btnAdd = document.getElementById("btnAdd");
        btnUpdate = document.getElementById("btnUpdate");
        btnSave = document.getElementById("btnSave");
        btnBack = document.getElementById("btnBack");
        btnAddDetails = DocumentActions.GetElementById("btnAddDetails");
        btnLoad = DocumentActions.GetElementById("btnLoad");
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
        ddlCategory.onchange = FillddlFamily;
        btnLoad.onclick = btnLoad_onclick;
        btnAdd.onclick = btnAdd_onclick;
        btnRefash.onclick = btnRefash_onclick;
        btnShow.onclick = btnShow_onclick;
        ddlSourceStoreAdd.onchange = ddlToStoreAdd_onchange;
        btnSave.onclick = btnSave_onClick;
        btnBack.onclick = btnBack_onclick;
        btnUpdate.onclick = btnUpdate_onclick;
        btnAddDetails.onclick = AddNewRow;
        txtSearch.onkeyup = txtSearch_onKeyup;
        chkApproved.onclick = chkApproved_checked;
        ddlStatusAdd.onchange = ddlStatusAdd_onchange;
        // printButton
        btnPrintTrview.onclick = function () { PrintReport(1); };
        btnPrintTrPDF.onclick = function () { PrintReport(2); };
        btnPrintTrEXEL.onclick = function () { PrintReport(3); };
        btnPrint.onclick = function () { PrintReport(4); };
        btnPrintTransaction.onclick = btnPrintTransaction_onclick;
    }
    //------------------------------------------------------ Buttons Region -----------------------------------
    function btnUpdate_onclick() {
        if (!SysSession.CurrentPrivileges.EDIT)
            return;
        FlagAddOrEdit = 2;
        txtUpdatedAt.value = DateTimeFormat(Date().toString());
        txtUpdatedBy.value = SysSession.CurrentEnvironment.UserCode;
        chkApproved.disabled = false;
        txtTransferDate.disabled = false;
        DisableDiv();
        EnableControls();
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
        ddlStatusAdd.value = "0";
        AddNewRow();
        $("#div_Approve").removeClass("display_none");
        chkApproved.disabled = !SysSession.CurrentPrivileges.CUSTOM1;
        ddlSourceStoreAdd.selectedIndex = 0;
        //var StoreID = Number(ddlSourceStoreAdd.value);
        //GetAllStoreItems(StoreID);
        $("#btnRefash").addClass("display_none");
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
        if (txtTransferDate.disabled == true) {
            Open();
        }
    }
    function btnLoad_onclick() {
        debugger;
        if (ddlSourceStoreAdd.value != "null") {
            if (ddlCategory.value != "null") {
                var ddlCategoryID = Number(ddlCategory.value);
                var ddItemFamilyID = ddlFamily.value == "null" ? 0 : Number(ddlFamily.value);
                var storeCode = Number(ddlSourceStoreAdd.value);
                Ajax.Callsync({
                    type: "Get",
                    url: sys.apiUrl("StkDefItems", "GetAll"),
                    data: {
                        CompCode: compcode, FinYear: FinYear, catID: ddlCategoryID, ItemFamilyID: ddItemFamilyID, storeCode: storeCode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
                    },
                    success: function (d) {
                        debugger;
                        ItemsLoadDetails = new Array();
                        var result = d;
                        if (result.IsSuccess) {
                            ItemsLoadDetails = result.Response;
                            ItemsLoadDetails = ItemsLoadDetails.filter(function (x) { return x.IsStock == true; });
                            //CountGrid = ItemsLoadDetails.length;
                            //$("#div_Data").html("");
                            DeleteAll();
                            var i = CountGrid;
                            showFlag = false;
                            for (var x = 0; x < ItemsLoadDetails.length; x++) {
                                BuildControls(i);
                                $('#txtAdjustDetailID' + i).val(0);
                                $('#txtItemNumber' + i).val(ItemsLoadDetails[x].ItemID);
                                (lang == "ar" ? $('#txtItemName' + i).val(ItemsLoadDetails[x].Itm_DescA) : $('#txtItemName' + i).val(ItemsLoadDetails[x].Itm_DescE));
                                $('#txtItemCode' + i).val(ItemsLoadDetails[x].ItemCode);
                                $('#txtUnitID' + i).val(ItemsLoadDetails[x].UomID);
                                $('#txtUntitName' + i).val(ItemsLoadDetails[x].Uom_DescA);
                                $('#txtOnhandQty' + i).val(ItemsLoadDetails[x].OnhandQty);
                                $('#txtCountedQty' + i).val(ItemsLoadDetails[x].OnhandQty);
                                $('#txtDiffQty' + i).val(0);
                                if (SysSession.CurrentEnvironment.I_Control[0].IsLocalCost == false) {
                                    $("#txtUnitCost" + i).prop("value", ItemsLoadDetails[x].GlobalCost);
                                    $("#txtNewCost" + i).prop("value", ItemsLoadDetails[x].GlobalCost);
                                }
                                else {
                                    $("#txtUnitCost" + i).prop("value", ItemsLoadDetails[x].LocalCost);
                                    $("#txtNewCost" + i).prop("value", ItemsLoadDetails[x].LocalCost);
                                }
                                //$('#txtUnitCost' + i).val(ItemsLoadDetails[i].UnitPrice);                                
                                //$('#txtNewCost' + i).val(ItemsLoadDetails[i].UnitPrice);
                                $('#txtDiffCost' + i).val(0);
                                $('#txt_StatusFlag' + i).val("i");
                                $("#txtCountedQty" + i).removeAttr("disabled");
                                $("#txtNewCost" + i).removeAttr("disabled");
                                $('#txtItemCode' + i).removeAttr("disabled");
                                CountGrid++;
                                i++;
                            }
                            var ddlValue = ddlStatusAdd.value;
                            if (ddlValue == "0") {
                                $(".Qty").show();
                                $(".Cost").hide();
                            }
                            else if (ddlValue == "1") {
                                $(".Qty").hide();
                                $(".Cost").show();
                            }
                            else if (ddlValue == "2") {
                                $(".Qty").show();
                                $(".Cost").show();
                            }
                        }
                    }
                });
            }
            else {
                //$("#div_Data").html("");
                //DisplayMassage('برجاء اختيار الفئة   ', 'Please choose the store and the category and item', MessageType.Error);
                //Errorinput(ddlCategory);
                WorningMessage("هل تريد تحميل الفئة كلها؟", "Do you want to delete?", "تحذير", "worning", function () {
                    debugger;
                    var storeCode = Number(ddlSourceStoreAdd.value);
                    Ajax.Callsync({
                        type: "Get",
                        url: sys.apiUrl("StkDefItems", "GetAll"),
                        data: {
                            CompCode: compcode, FinYear: FinYear, storeCode: storeCode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
                        },
                        success: function (d) {
                            var result = d;
                            if (result.IsSuccess) {
                                ItemsLoadDetails = new Array();
                                ItemsLoadDetails = result.Response;
                                ItemsLoadDetails = ItemsLoadDetails.filter(function (x) { return x.IsStock == true; });
                                if (ItemsLoadDetails.length != 0) {
                                    DeleteAll();
                                    var i = CountGrid;
                                    showFlag = false;
                                    for (var x = 0; x < ItemsLoadDetails.length; x++) {
                                        BuildControls(i);
                                        $('#txtAdjustDetailID' + i).val(0);
                                        $('#txtItemNumber' + i).val(ItemsLoadDetails[x].ItemID);
                                        (lang == "ar" ? $('#txtItemName' + i).val(ItemsLoadDetails[x].Itm_DescA) : $('#txtItemName' + i).val(ItemsLoadDetails[x].Itm_DescE));
                                        $('#txtItemCode' + i).val(ItemsLoadDetails[x].ItemCode);
                                        $('#txtUnitID' + i).val(ItemsLoadDetails[x].UomID);
                                        $('#txtUntitName' + i).val(ItemsLoadDetails[x].Uom_DescA);
                                        $('#txtOnhandQty' + i).val(ItemsLoadDetails[x].OnhandQty);
                                        $('#txtCountedQty' + i).val(ItemsLoadDetails[x].OnhandQty);
                                        $('#txtDiffQty' + i).val(0);
                                        if (SysSession.CurrentEnvironment.I_Control[0].IsLocalCost == false) {
                                            $("#txtUnitCost" + i).prop("value", ItemsLoadDetails[x].GlobalCost);
                                            $("#txtNewCost" + i).prop("value", ItemsLoadDetails[x].GlobalCost);
                                        }
                                        else {
                                            $("#txtUnitCost" + i).prop("value", ItemsLoadDetails[x].LocalCost);
                                            $("#txtNewCost" + i).prop("value", ItemsLoadDetails[x].LocalCost);
                                        }
                                        //$('#txtUnitCost' + i).val(ItemsLoadDetails[i].UnitPrice);
                                        //$('#txtNewCost' + i).val(ItemsLoadDetails[i].UnitPrice);
                                        $('#txtDiffCost' + i).val(0);
                                        $('#txt_StatusFlag' + i).val("i");
                                        $("#txtCountedQty" + i).removeAttr("disabled");
                                        $("#txtNewCost" + i).removeAttr("disabled");
                                        $('#txtItemCode' + i).removeAttr("disabled");
                                        CountGrid++;
                                        i++;
                                    }
                                    var ddlValue = ddlStatusAdd.value;
                                    if (ddlValue == "0") {
                                        $(".Qty").show();
                                        $(".Cost").hide();
                                    }
                                    else if (ddlValue == "1") {
                                        $(".Qty").hide();
                                        $(".Cost").show();
                                    }
                                    else if (ddlValue == "2") {
                                        $(".Qty").show();
                                        $(".Cost").show();
                                    }
                                }
                                else {
                                    $("#div_Data").html("");
                                    DisplayMassage('لا توجد اصناف', 'No items', MessageType.Error);
                                }
                            }
                        }
                    });
                });
            }
        }
        else {
            $("#div_Data").html("");
            DisplayMassage('برجاء اختيار المستودع   ', 'Please choose the store and the category and item', MessageType.Error);
            Errorinput(ddlSourceStoreAdd);
        }
    }
    function btnRefash_onclick() {
        if (!Validation_Header())
            return;
        for (var i = 0; i < CountGrid; i++) {
            if (!Validation_Grid(i))
                return;
        }
        Assign();
        MasterDetailModel.I_Stk_TR_Adjust.UpdatedBy = SysSession.CurrentEnvironment.UserCode;
        MasterDetailModel.I_Stk_TR_Adjust.UpdatedAt = DateTimeFormat(Date().toString());
        MasterDetailModel.I_Stk_TR_Adjust.AdjustID = GlobalAdjustID;
        // creation
        if (SelectedStockModel.length > 0) {
            MasterDetailModel.I_Stk_TR_Adjust.CreatedBy = SelectedStockModel[0].CreatedBy;
            MasterDetailModel.I_Stk_TR_Adjust.CreatedAt = SelectedStockModel[0].CreatedAt;
        }
        else {
            MasterDetailModel.I_Stk_TR_Adjust.CreatedBy = SysSession.CurrentEnvironment.UserCode;
            MasterDetailModel.I_Stk_TR_Adjust.CreatedAt = DateTimeFormat(Date().toString());
        }
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("DirectTransfer", "RefrashStockAdjustmentDetail"),
            data: JSON.stringify(MasterDetailModel),
            success: function (d) {
                var result = d;
                if (result.IsSuccess == true) {
                    var res = result.Response;
                    DisplayMassage("تم التحديث بنجاح " + res.Tr_No, 'Edited Successfully ' + res.Tr_No, MessageType.Succeed);
                    GlobalAdjustID = res.AdjustID;
                    Save();
                    AfterInsertOrUpdateFlag = true;
                    GridRowDoubleClick();
                    btnUpdate_onclick();
                }
                else {
                    DisplayMassage("هناك خطــأ ", '(Error)', MessageType.Error);
                }
            }
        });
    }
    //------------------------------------------------------ Normal Grid Region -----------------------------------
    function InitializeGrid() {
        var res = GetResourceList("");
        Grid.OnRowDoubleClicked = GridRowDoubleClick;
        Grid.ElementName = "divGridDetails_View";
        Grid.PrimaryKey = "AdjustID";
        Grid.Paging = true;
        Grid.PageSize = 10;
        Grid.Sorting = true;
        Grid.InsertionMode = JsGridInsertionMode.Binding;
        Grid.Editing = false;
        Grid.Inserting = false;
        Grid.SelectedIndex = 1;
        Grid.OnItemEditing = function () { };
        Grid.Columns = [
            { title: res.Trns_Store, name: "AdjustID", type: "text", width: "100px", visible: false },
            { title: res.Trns_TrNO, name: "Tr_No", type: "text", width: "100px" },
            { title: res.Trns_Store, name: (lang == "ar" ? "St_DEscA" : "ST_DescE"), type: "text", width: "100px" },
            { title: res.App_ReferenceNumber, name: "RefNO", type: "text", width: "100px" },
            { title: res.App_date, name: "TrDate", type: "text", width: "100px" },
            { title: res.App_Settlement_type, name: (lang == "ar" ? "Type_DescA" : "type_DescE"), type: "text", width: "100px" },
            { title: res.total_cost, name: "TotalCost", type: "text", width: "100px" },
            { title: res.App_State, name: "Status_Desc", type: "text", width: "100px" },
        ];
        BindGridData();
    }
    function BindGridData() {
        $("#divGridShow").removeClass("display_none");
        var FromDate = DateFormatRep(txtFromDate.value).toString();
        var toDate = DateFormatRep(txtToDate.value).toString();
        var storeID = 0;
        var status = Number(ddlStatusFilter.value.toString());
        var state = Number($("#ddlstatus").val());
        if (ddlSourceStore.value != "null") {
            storeID = Number(ddlSourceStore.value.toString());
        }
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("DirectTransfer", "GetAllStockAdjustmentHeaderWithDetail"),
            data: { CompCode: compcode, TrType: status, State: state, FromDate: FromDate, toDate: toDate, Store: storeID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token, MODULE_CODE: Modules.STKAdjust, FinYear: SysSession.CurrentEnvironment.CurrentYear, Branch_Code: SysSession.CurrentEnvironment.BranchCode },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    IQ_GetStkAdjustDetailModel = new Array();
                    IQ_GetStkAdjustDetailModel = result.Response;
                    IQ_GetStkAdjustDetailModel = IQ_GetStkAdjustDetailModel.filter(function (x) { return x.BranchCode == Branch; });
                    for (var i = 0; i < IQ_GetStkAdjustDetailModel.length; i++) {
                        IQ_GetStkAdjustDetailModel[i].TrDate = DateFormat(IQ_GetStkAdjustDetailModel[i].TrDate.toString());
                        IQ_GetStkAdjustDetailModel[i].Status_Desc = IQ_GetStkAdjustDetailModel[i].Status == 1 ? (lang == "ar" ? "معتمد" : "Approved") : (lang == "ar" ? "غير معتمد" : "Not Approved");
                    }
                    Grid.DataSource = IQ_GetStkAdjustDetailModel;
                    Grid.Bind();
                }
            }
        });
    }
    function GridRowDoubleClick() {
        debugger;
        showFlag = true;
        Clear();
        CountGrid = 0;
        $("#divTransferDetails").removeClass("display_none");
        $("#btnUpdate").removeClass("display_none");
        $("#btnPrintTransaction").removeClass("display_none");
        $("#div_Approve").removeClass("display_none");
        SelectedStockModel = new Array();
        SelectedStockModel = IQ_GetStkAdjustDetailModel.filter(function (x) { return x.AdjustID == Number(Grid.SelectedKey); });
        if (AfterInsertOrUpdateFlag == true) {
            SelectedStockModel = IQ_GetStkAdjustDetailModel.filter(function (x) { return x.AdjustID == GlobalAdjustID; });
            AfterInsertOrUpdateFlag = false;
        }
        if (SelectedStockModel.length > 0) {
            GlobalAdjustID = Number(SelectedStockModel[0].AdjustID);
            txtTrNo.value = SelectedStockModel[0].Tr_No.toString();
            txtTransferDate.value = SelectedStockModel[0].TrDate;
            ddlStatusAdd.value = SelectedStockModel[0].TrType.toString();
            txtRemarks.value = SelectedStockModel[0].Remark;
            if (SelectedStockModel[0].RefNO != null)
                txtRefNumber.value = SelectedStockModel[0].RefNO;
            if (SelectedStockModel[0].StoreID != null) {
                ddlSourceStoreAdd.value = SelectedStockModel[0].StoreID.toString();
            }
            GetAllStoreItems(SelectedStockModel[0].StoreID);
            // creation
            txtCreatedBy.value = SelectedStockModel[0].CreatedBy;
            txtCreatedAt.value = SelectedStockModel[0].CreatedAt;
            // Edit
            if (SelectedStockModel[0].UpdatedBy != null) {
                txtUpdatedBy.value = SelectedStockModel[0].UpdatedBy;
                txtUpdatedAt.value = SelectedStockModel[0].UpdatedAt;
            }
            //Detail
            StockDetailModelFiltered = new Array();
            Ajax.Callsync({
                type: "Get",
                url: sys.apiUrl("DirectTransfer", "GetStockByID"),
                data: { AdjustID: GlobalAdjustID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
                success: function (d) {
                    var result = d;
                    if (result.IsSuccess) {
                        debugger;
                        headerWithDetail = new IQ_GetStkAdjustWithDetail();
                        headerWithDetail = result.Response;
                        StockDetailModelFiltered = headerWithDetail.IQ_GetStkAdjustDetail;
                        for (var i = 0; i < StockDetailModelFiltered.length; i++) {
                            BuildControls(i);
                        }
                        var ddlValue = ddlStatusAdd.value;
                        if (ddlValue == "0") {
                            $(".Qty").show();
                            $(".Cost").hide();
                        }
                        else if (ddlValue == "1") {
                            $(".Qty").hide();
                            $(".Cost").show();
                        }
                        else if (ddlValue == "2") {
                            $(".Qty").show();
                            $(".Cost").show();
                        }
                        CountGrid = StockDetailModelFiltered.length;
                        DisableControls();
                    }
                }
            });
            if (SelectedStockModel[0].Status == 1) {
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
        $('#btnRefash').removeClass('display_none');
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
            DisplayMassage(' لا توجد صلاحيه للتسوية في هذا التاريخ ( ' + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ' )', 'There is no Adjustment authority at this date' + DateFormat(SysSession.CurrentEnvironment.StartDate).toString(), MessageType.Error);
            Errorinput(txtTransferDate);
            return false;
        }
        else if (ddlSourceStoreAdd.value == "null") {
            DisplayMassage('برجاء اختيار المستودع المحول منه', 'Please select the store you are transferring from', MessageType.Error);
            Errorinput(ddlSourceStoreAdd);
            return false;
        }
        else if (newCount == 0) {
            DisplayMassage('يجب ادخال اصناف التسوية', 'Adjustment items must be entered', MessageType.Error);
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
        if ($("#txt_StatusFlag" + rowcount).val() == "d" || $("#txt_StatusFlag" + rowcount).val() == "m") {
            return true;
        }
        else {
            var Qty = Number($("#txtCountedQty" + rowcount).val());
            var cost = Number($("#txtNewCost" + rowcount).val());
            if ($("#txtItemName" + rowcount).val() == "") {
                DisplayMassage('برجاء ادخال الصنف', 'Please enter the item', MessageType.Error);
                Errorinput($("#txtItemName" + rowcount));
                return false;
            }
            else if ((cost == 0 && ddlStatusAdd.value == "1") || (cost == 0 && ddlStatusAdd.value == "2")) {
                DisplayMassage('برجاء ادخال التكلفه الجديده', 'Please enter new cost', MessageType.Error);
                Errorinput($("#txtNewCost" + rowcount));
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
                if (Number($("#txtItemNumber" + i).val()) == itemValue && Number($("#txtAdjustDetailID" + i).val()) != NumberRowid) {
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
    function fillddlStatusFilter() {
        StatesFilterDetailsAr = ["كمية", " تكلفة", "	تسوية كمية و تكلفة", "الجميع"];
        StatesFilterDetailsEn = ["quantity", " Cost", "quantity + Cost", "All"];
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
    function fillddlStatusAdd() {
        StatesFilterDetailsAr = ["كمية"];
        StatesFilterDetailsEn = ["quantity", " Cost", "Quantity + Cost"];
        if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
            for (var i = 0; i < StatesFilterDetailsEn.length; i++) {
                var newoption = document.createElement("option");
                newoption.value = i.toString();
                newoption.text = StatesFilterDetailsEn[i];
                ddlStatusAdd.options.add(newoption);
            }
        }
        else {
            for (var i = 0; i < StatesFilterDetailsAr.length; i++) {
                var newoption = document.createElement("option");
                newoption.value = i.toString();
                newoption.text = StatesFilterDetailsAr[i];
                ddlStatusAdd.options.add(newoption);
            }
        }
    }
    function fillddlSourceStore() {
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
    function fillddlSourceStoreAdd() {
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
    function ddlToStoreAdd_onchange() {
        if (ddlSourceStoreAdd.value != "null") {
            var StoreID = Number(ddlSourceStoreAdd.value);
            GetAllStoreItems(StoreID);
        }
    }
    function FillddlCategory() {
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
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                        DocumentActions.FillCombowithdefult(CategoryDetails, ddlCategory, "CatID", "DescL", "Select Category");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(CategoryDetails, ddlCategory, "CatID", "DescA", "اختر الفئه");
                    }
                }
            }
        });
    }
    function FillddlFamily() {
        if (ddlCategory.value != "null") {
            var catId = Number(ddlCategory.value);
            Ajax.Callsync({
                type: "Get",
                url: sys.apiUrl("StkDefItemType", "GetByCategory"),
                data: {
                    CompCode: compcode, CatID: catId, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
                },
                success: function (d) {
                    var result = d;
                    if (result.IsSuccess) {
                        ItemsDetails = result.Response;
                        if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                            DocumentActions.FillCombowithdefult(ItemsDetails, ddlFamily, "ItemFamilyID", "DescL", "Select Category");
                        }
                        else {
                            DocumentActions.FillCombowithdefult(ItemsDetails, ddlFamily, "ItemFamilyID", "DescA", "اختر الصنف");
                        }
                    }
                }
            });
        }
        else {
            $("#ddlFamily").empty();
        }
    }
    function ddlStatusAdd_onchange() {
        var ddlValue = ddlStatusAdd.value;
        if (ddlValue == "0") {
            $(".Qty").show();
            $(".Cost").hide();
        }
        else if (ddlValue == "1") {
            $(".Qty").hide();
            $(".Cost").show();
        }
        else if (ddlValue == "2") {
            $(".Qty").show();
            $(".Cost").show();
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
        txtRemarks.value = "";
        ddlSourceStoreAdd.value = 'null';
        chkApproved.checked = false;
        ddlCategory.value = 'null';
        $("#ddlFamily").empty();
        $(".Qty").show();
        $(".Cost").show();
    }
    function txtSearch_onKeyup() {
        //BindGridData();
        $("#divGridDetails_View").jsGrid("option", "pageIndex", 1);
        if (txtSearch.value != "") {
            var search_1 = txtSearch.value.toLowerCase();
            SearchDetails = IQ_GetStkAdjustDetailModel.filter(function (x) { return x.Tr_No.toString().toLowerCase().search(search_1) >= 0 || x.St_DEscA.toLowerCase().search(search_1) >= 0
                || x.ST_DescE.toLowerCase().search(search_1) >= 0 || x.Type_DescA.toLowerCase().search(search_1) >= 0 || x.type_DescE.toLowerCase().search(search_1) >= 0
                || x.TotalCost.toString().search(search_1) >= 0; });
            Grid.DataSource = SearchDetails;
            Grid.Bind();
        }
        else {
            Grid.DataSource = IQ_GetStkAdjustDetailModel;
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
            $("#txtCountedQty" + i).removeAttr("disabled");
            $("#txtNewCost" + i).removeAttr("disabled");
            $("#txtItemCode" + i).removeAttr("disabled");
            $("#txtItemName" + i).attr("disabled", "disabled");
            $("#txtUntitName" + i).attr("disabled", "disabled");
            $("#txtOnhandQty" + i).attr("disabled", "disabled");
            $("#txtDiffQty" + i).attr("disabled", "disabled");
            $("#txtUnitCost" + i).attr("disabled", "disabled");
            $("#txtDiffCost" + i).attr("disabled", "disabled");
            $("#btn_minus" + i).removeClass("display_none");
        }
        txtTrNo.disabled = true;
        txtCreatedBy.disabled = true;
        txtCreatedAt.disabled = true;
        txtUpdatedAt.disabled = true;
        txtUpdatedBy.disabled = true;
    }
    function DisableControls() {
        $("#divTransferDetails :input").attr("disabled", "disabled");
        $("#btnAddDetails").addClass("display_none");
        $("#btnPrintTransaction").removeClass("display_none");
        for (var i = 0; i < CountGrid; i++) {
            $("#txtCountedQty" + i).attr("disabled", "disabled");
            $("#txtNewCost" + i).attr("disabled", "disabled");
            $("#txtItemCode" + i).attr("disabled", "disabled");
            $("#txtItemName" + i).attr("disabled", "disabled");
            $("#txtUntitName" + i).attr("disabled", "disabled");
            $("#txtOnhandQty" + i).attr("disabled", "disabled");
            $("#txtDiffQty" + i).attr("disabled", "disabled");
            $("#txtUnitCost" + i).attr("disabled", "disabled");
            $("#txtDiffCost" + i).attr("disabled", "disabled");
            $("#btn_minus" + i).addClass("display_none");
        }
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
            $("#txtItemCode" + CountGrid).removeAttr("disabled");
            $("#txtUntitName" + CountGrid).attr("disabled", "disabled");
            $("#txtOnhandQty" + CountGrid).attr("disabled", "disabled");
            $("#txtDiffQty" + CountGrid).attr("disabled", "disabled");
            $("#txtUnitCost" + CountGrid).attr("disabled", "disabled");
            $("#txtDiffCost" + CountGrid).attr("disabled", "disabled");
            $("#txtCountedQty" + CountGrid).removeAttr("disabled");
            $("#txtNewCost" + CountGrid).removeAttr("disabled");
            // can delete new inserted record  without need for delete privilage
            $("#btn_minus" + CountGrid).removeClass("display_none");
            $("#btn_minus" + CountGrid).removeAttr("disabled");
            //
            var ddlValue = ddlStatusAdd.value;
            if (ddlValue == "0") {
                $(".Qty").show();
                $(".Cost").hide();
            }
            else if (ddlValue == "1") {
                $(".Qty").hide();
                $(".Cost").show();
            }
            else if (ddlValue == "2") {
                $(".Qty").show();
                $(".Cost").show();
            }
            CountGrid++;
        }
    }
    function BuildControls(cnt) {
        var html = "";
        html = "<tr id= \"No_Row" + cnt + "\">\n                    <input id=\"txtAdjustDetailID" + cnt + "\" type=\"hidden\" class=\"form-control display_none\"  />                \n                    <input id=\"txtSerial" + cnt + "\" type=\"hidden\" name=\"FromDate\" class=\"form-control display_none\" value=\"" + (CountGrid + 1) + "\"  />\n                    <input id=\"txtItemNumber" + cnt + "\" type=\"hidden\" name=\"FromDate\" class=\"form-control display_none\" value=\"" + (CountGrid + 1) + "\"  />\n                    <td>\n\t\t                <div class=\"form-group\">\n\t\t\t                <span id=\"btn_minus" + cnt + "\"><i class=\"fas fa-minus-circle  btn-minus\"></i></span>\n\t\t                </div>\n\t                </td>\n                    <td>\n\t                    <div class=\"form-group\">\n\t\t                    <button type=\"button\" class=\"style_ButSearch\" id=\"btnSearchItems" + cnt + "\" disabled name=\"ColSearch\">\n\t\t                    <i class=\"fa fa-search  \"></i>\n\t\t                     </button>\n\t                    </div>\n                    </td>\n                   \n                    <td>\n\t\t                <div class=\"form-group\">\n                            <input id=\"txtItemCode" + cnt + "\" type=\"text\" class=\"form-control\" name=\"\" disabled />\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n                            <input id=\"txtItemName" + cnt + "\" type=\"text\" class=\"form-control\" name=\"\" disabled />\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n                            <input id=\"txtUntitName" + cnt + "\" type=\"text\" class=\"form-control\" name=\"\" disabled />\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n                            <input id=\"txtOnhandQty" + cnt + "\" type=\"number\" class=\"form-control\" name=\"\" disabled />\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n                            <input id=\"txtCountedQty" + cnt + "\" type=\"number\" class=\"form-control\" name=\"\" disabled />\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n                            <input id=\"txtDiffQty" + cnt + "\" type=\"number\" value=\"0\"  min=\"0\" class=\"form-control\" name=\"\" disabled />\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n                            <input id=\"txtUnitCost" + cnt + "\" type=\"number\"  class=\"form-control\" name=\"\" disabled />\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group Cost\">\n                            <input id=\"txtNewCost" + cnt + "\" type=\"number\"  class=\"form-control\" name=\"\" disabled />\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group Cost\">\n                            <input id=\"txtDiffCost" + cnt + "\" type=\"number\" value=\"0\"  min=\"0\" class=\"form-control\" name=\"\" disabled />\n\t\t                </div>\n\t                </td>\n               <input id=\"txtUnitID" + cnt + "\" type=\"hidden\"   />\n               <input id=\"txt_StatusFlag" + cnt + "\" type=\"hidden\"   />\n               <input id=\"txt_OnhandQty" + cnt + "\" type=\"hidden\"   />\n                </tr>";
        $("#div_Data").append(html);
        //// Items Search
        $('#btnSearchItems' + cnt).click(function (e) {
            var sys = new SystemTools();
            if (ddlSourceStoreAdd.value == "null") {
                DisplayMassage("يجب اختيار المستودع الذي سيتم تسويه اصنافه ", "The Store whose items will be settled must be chosen ", MessageType.Error);
                Errorinput(ddlSourceStoreAdd);
            }
            else {
                var storeId = Number(ddlSourceStoreAdd.value); //and OnhandQty > 0
                sys.FindKey(Modules.Directtransfer, "btnSearchItems", "StoreId=" + storeId + " and IsStock = 1 and FinYear = " + FinYear, function () {
                    var id = SearchGrid.SearchDataGrid.SelectedKey;
                    var res = false;
                    debugger;
                    var NumberRowid = Number($("#txtAdjustDetailID" + cnt).val());
                    res = checkRepeatedItems(id, NumberRowid);
                    if (res == false) {
                        if ($("#txt_StatusFlag" + cnt).val() != "i")
                            $("#txt_StatusFlag" + cnt).val("u");
                        var SrcItem = ItemsToListDetails.filter(function (s) { return s.ItemID == id; });
                        if (SrcItem != null) {
                            $('#txtItemNumber' + cnt).val(id);
                            if (FlagAddOrEdit == 1)
                                $('#txtAdjustDetailID' + cnt).val(0);
                            $('#txtItemNumber' + cnt).val(SrcItem[0].ItemID);
                            (lang == "ar" ? $('#txtItemName' + cnt).val(SrcItem[0].Itm_DescA) : $('#txtItemName' + cnt).val(SrcItem[0].Itm_DescE));
                            $('#txtItemCode' + cnt).val(SrcItem[0].ItemCode);
                            $('#txtUnitID' + cnt).val(SrcItem[0].UomID);
                            $('#txtUntitName' + cnt).val(SrcItem[0].Uom_DescA);
                            $('#txtOnhandQty' + cnt).val(SrcItem[0].OnhandQty);
                            $('#txtCountedQty' + cnt).val(SrcItem[0].OnhandQty);
                            $('#txtDiffQty' + cnt).val(0);
                            //$('#txtUnitCost' + cnt).val(SrcItem[0].GlobalCost);
                            if (SysSession.CurrentEnvironment.I_Control[0].IsLocalCost == false) {
                                $("#txtUnitCost" + cnt).prop("value", SrcItem[0].GlobalCost);
                            }
                            else {
                                $("#txtUnitCost" + cnt).prop("value", SrcItem[0].LocalCost);
                            }
                            $('#txtNewCost' + cnt).val(SrcItem[0].UnitPrice);
                            $('#txtDiffCost' + cnt).val(0);
                            $("#txtCountedQty" + cnt).removeAttr("disabled");
                            //$("#txtUnitCost" + cnt).removeAttr("disabled");
                        }
                    }
                    else {
                        DisplayMassage('( لايمكن تكرار نفس الاصناف في التسوية )', 'The same items can be repeated in the adjustment', MessageType.Error);
                        $('#txtItemNumber' + cnt).val("");
                        $('#txtItemCode' + cnt).val("");
                        $('#txtItemName' + cnt).val("");
                        $('#txtUntitName' + cnt).val("");
                        $('#txt_OnhandQty' + cnt).val("");
                        $('#txtItemCode' + cnt).val("");
                        $('#txtSrcQty' + cnt).val("");
                        $('#txtToQty' + cnt).val("");
                        $('#txtUnitID' + cnt).val("");
                    }
                });
            }
        });
        //txtCountedQty on change
        $("#txtCountedQty" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
            var txtOnhandQtyVal = Number($('#txtOnhandQty' + cnt).val());
            var txtCountedQtyVal = Number($('#txtCountedQty' + cnt).val());
            if (txtCountedQtyVal > 0) {
                var txtDiffQtyVal = txtCountedQtyVal - txtOnhandQtyVal;
                $('#txtDiffQty' + cnt).val(txtDiffQtyVal);
            }
            else {
                $('#txtDiffQty' + cnt).val(txtOnhandQtyVal);
            }
        });
        //txtNewCost on change
        $("#txtNewCost" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
            var txtUnitCostVal = Number($('#txtUnitCost' + cnt).val());
            var txtNewCostVal = Number($('#txtNewCost' + cnt).val());
            if (txtNewCostVal > 0) {
                var txtDiffCostVal = txtNewCostVal - txtUnitCostVal;
                $('#txtDiffCost' + cnt).val(txtDiffCostVal);
            }
            else {
                $('#txtDiffCost' + cnt).val(txtUnitCostVal);
            }
        });
        //Item Code Onchange
        $("#txtItemCode" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
            var ItemCode = $('#txtItemCode' + cnt).val();
            var SrcItem = ItemsToListDetails.filter(function (s) { return s.ItemCode == ItemCode; });
            if (SrcItem.length > 0) {
                var res = false;
                var NumberRowid = Number($("#txtAdjustDetailID" + cnt).val());
                var id = Number(SrcItem[0].ItemID);
                res = checkRepeatedItems(id, NumberRowid);
                if (res == false) {
                    if (FlagAddOrEdit == 1)
                        $('#txtAdjustDetailID' + cnt).val(0);
                    $('#txtItemNumber' + cnt).val(SrcItem[0].ItemID);
                    (lang == "ar" ? $('#txtItemName' + cnt).val(SrcItem[0].Itm_DescA) : $('#txtItemName' + cnt).val(SrcItem[0].Itm_DescE));
                    $('#txtItemCode' + cnt).val(SrcItem[0].ItemCode);
                    $('#txtUnitID' + cnt).val(SrcItem[0].UomID);
                    $('#txtUntitName' + cnt).val(SrcItem[0].Uom_DescA);
                    $('#txtOnhandQty' + cnt).val(SrcItem[0].OnhandQty);
                    $('#txtCountedQty' + cnt).val(SrcItem[0].OnhandQty);
                    $('#txtDiffQty' + cnt).val(0);
                    if (SysSession.CurrentEnvironment.I_Control[0].IsLocalCost == false) {
                        $("#txtUnitCost" + cnt).prop("value", SrcItem[0].GlobalCost);
                    }
                    else {
                        $("#txtUnitCost" + cnt).prop("value", SrcItem[0].LocalCost);
                    }
                    $('#txtNewCost' + cnt).val(SrcItem[0].UnitPrice);
                    $('#txtDiffCost' + cnt).val(0);
                    $("#txtCountedQty" + cnt).removeAttr("disabled");
                    //$("#txtUnitCost" + cnt).removeAttr("disabled");
                }
                else {
                    DisplayMassage('( لايمكن تكرار نفس الاصناف في التسوية )', 'The same items can be repeated in the adjustment', MessageType.Error);
                    $('#txtItemNumber' + cnt).val("");
                    $('#txtItemCode' + cnt).val("");
                    $('#txtItemName' + cnt).val("");
                    $('#txtUntitName' + cnt).val("");
                    $('#txt_OnhandQty' + cnt).val("");
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
                DisplayMassage("كود الصنف غير صحيح ", "Wrong Item Code ", MessageType.Error);
            }
        });
        $("#btn_minus" + cnt).on('click', function () {
            DeleteRow(cnt);
        });
        if (showFlag == true) {
            $('#txtSerial' + cnt).val(StockDetailModelFiltered[cnt].Serial);
            $('#txtAdjustDetailID' + cnt).val(StockDetailModelFiltered[cnt].AdjustDetailID);
            $('#txtItemNumber' + cnt).val(StockDetailModelFiltered[cnt].ItemID);
            $('#txtItemCode' + cnt).val(StockDetailModelFiltered[cnt].ItemCode);
            (lang == "ar" ? $('#txtItemName' + cnt).val(StockDetailModelFiltered[cnt].itm_DescA) : $('#txtItemName' + cnt).val(StockDetailModelFiltered[cnt].itm_DescE));
            (lang == "ar" ? $('#txtUntitName' + cnt).val(StockDetailModelFiltered[cnt].Uom_DescA) : $('#txtUntitName' + cnt).val(StockDetailModelFiltered[cnt].UOM_DescE));
            if (StockDetailModelFiltered[cnt].OnhandQty != null)
                $('#txtOnhandQty' + cnt).val(StockDetailModelFiltered[cnt].OnhandQty.toString());
            if (StockDetailModelFiltered[cnt].CountQty != null)
                $('#txtCountedQty' + cnt).val(StockDetailModelFiltered[cnt].CountQty.toString());
            if (StockDetailModelFiltered[cnt].DiffQty != null)
                $('#txtDiffQty' + cnt).val(StockDetailModelFiltered[cnt].DiffQty.toString());
            if (StockDetailModelFiltered[cnt].UnitCost != null)
                $('#txtUnitCost' + cnt).val(StockDetailModelFiltered[cnt].UnitCost.toString());
            if (StockDetailModelFiltered[cnt].NewUnitCost != null)
                $('#txtNewCost' + cnt).val(StockDetailModelFiltered[cnt].NewUnitCost.toString());
            $('#txtDiffCost' + cnt).val(StockDetailModelFiltered[cnt].NewUnitCost - StockDetailModelFiltered[cnt].UnitCost);
            $('#txtUnitID' + cnt).val(StockDetailModelFiltered[cnt].UnitID);
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
            $("#txtCountedQty" + RecNo).val("1");
            $("#txtNewCost" + RecNo).val("1");
            $("#No_Row" + RecNo).attr("hidden", "true");
        });
    }
    function DeleteAll() {
        for (var i = 0; i < CountGrid; i++) {
            var RecNo = i;
            var statusFlag = $("#txt_StatusFlag" + RecNo).val();
            if (statusFlag == "i")
                $("#txt_StatusFlag" + RecNo).val("m");
            else
                $("#txt_StatusFlag" + RecNo).val("d");
            // ComputeTotals();
            $("#txtItemNumber" + RecNo).val("99");
            $("#txtItemName" + RecNo).val("1");
            $("#txtCountedQty" + RecNo).val("1");
            $("#txtNewCost" + RecNo).val("1");
            $("#No_Row" + RecNo).attr("hidden", "true");
        }
    }
    //---------------------------------------------- get By id  functions ----------------------------------------
    function GetAllStoreItems(StoreID) {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("DirectTransfer", "GetAllItemsInStoreNew"),
            data: { branch: Branch, comp: compcode, Store: StoreID, FinYear: FinYear, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    ItemsToListDetails = result.Response;
                    ItemsToListDetails = ItemsToListDetails.filter(function (x) { return x.IsStock == true; });
                }
            }
        });
    }
    //--------------------------------------------------- Main Functions-----------------------------------------------
    function Assign() {
        MasterDetailModel = new StockAdjustMasterDetails();
        StockHeaderModel = new I_Stk_TR_Adjust();
        StockDetailModel = new Array();
        // Header Data
        StockHeaderModel.Tr_No = Number(txtTrNo.value);
        StockHeaderModel.CompCode = Number(SysSession.CurrentEnvironment.CompCode);
        StockHeaderModel.BranchCode = Number(Branch);
        StockHeaderModel.TrDate = txtTransferDate.value;
        StockHeaderModel.RefNO = txtRefNumber.value;
        StockHeaderModel.TrType = Number(ddlStatusAdd.value);
        if (chkApproved.checked == true) {
            StockHeaderModel.Status = 1;
        }
        else {
            StockHeaderModel.Status = 0;
        }
        StockHeaderModel.StoreID = Number(ddlSourceStoreAdd.value);
        StockHeaderModel.Remark = txtRemarks.value;
        var StatusFlag;
        // Details
        for (var i = 0; i < CountGrid; i++) {
            StockDetailSingleModel = new I_Stk_Tr_AdjustDetails();
            StatusFlag = $("#txt_StatusFlag" + i).val();
            try {
                StatusFlag.toString();
            }
            catch (e) {
                continue;
            }
            StockDetailSingleModel.StatusFlag = StatusFlag.toString();
            if (StatusFlag == "i") {
                StockDetailSingleModel.AdjustDetailID = 0;
                StockDetailSingleModel.Serial = $("#txtSerial" + i).val();
                StockDetailSingleModel.ItemID = $("#txtItemNumber" + i).val();
                StockDetailSingleModel.UnitID = $("#txtUnitID" + i).val();
                StockDetailSingleModel.OnhandQty = Number($("#txtOnhandQty" + i).val());
                StockDetailSingleModel.NewUnitCost = Number($("#txtNewCost" + i).val());
                StockDetailSingleModel.NewStkUnitCost = Number($("#txtNewCost" + i).val());
                StockDetailSingleModel.CountQty = Number($("#txtCountedQty" + i).val());
                StockDetailSingleModel.StockCountedQty = Number($("#txtCountedQty" + i).val());
                StockDetailSingleModel.UnitCost = Number($("#txtUnitCost" + i).val());
                StockDetailSingleModel.StkUnitCost = Number($("#txtUnitCost" + i).val());
                StockDetailSingleModel.StockOnhandQty = Number($("#txtOnhandQty" + i).val());
                StockDetailModel.push(StockDetailSingleModel);
            }
            else if (StatusFlag == "u") {
                StockDetailSingleModel.AdjustDetailID = $("#txtAdjustDetailID" + i).val();
                StockDetailSingleModel.Serial = $("#txtSerial" + i).val();
                StockDetailSingleModel.ItemID = $("#txtItemNumber" + i).val();
                StockDetailSingleModel.UnitID = $("#txtUnitID" + i).val();
                StockDetailSingleModel.OnhandQty = Number($("#txtOnhandQty" + i).val());
                StockDetailSingleModel.NewUnitCost = Number($("#txtNewCost" + i).val());
                StockDetailSingleModel.NewStkUnitCost = Number($("#txtNewCost" + i).val());
                StockDetailSingleModel.CountQty = Number($("#txtCountedQty" + i).val());
                StockDetailSingleModel.StockCountedQty = Number($("#txtCountedQty" + i).val());
                StockDetailSingleModel.UnitCost = Number($("#txtUnitCost" + i).val());
                StockDetailSingleModel.StkUnitCost = Number($("#txtUnitCost" + i).val());
                StockDetailSingleModel.StockOnhandQty = Number($("#txtOnhandQty" + i).val());
                StockDetailModel.push(StockDetailSingleModel);
            }
            else if (StatusFlag == "d") {
                if (FlagAddOrEdit == 2) {
                    if ($("#txtAdjustDetailID" + i).val() != "") {
                        var deletedID = $("#txtAdjustDetailID" + i).val();
                        StockDetailSingleModel.AdjustDetailID = deletedID;
                        StockDetailModel.push(StockDetailSingleModel);
                    }
                }
            }
        }
        MasterDetailModel.I_Stk_TR_Adjust = StockHeaderModel;
        MasterDetailModel.I_Stk_Tr_AdjustDetails = StockDetailModel;
        MasterDetailModel.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
        MasterDetailModel.Branch_Code = SysSession.CurrentEnvironment.BranchCode;
        MasterDetailModel.Comp_Code = SysSession.CurrentEnvironment.CompCode;
        MasterDetailModel.MODULE_CODE = Modules.STKAdjust;
        MasterDetailModel.UserCode = SysSession.CurrentEnvironment.UserCode;
        MasterDetailModel.sec_FinYear = SysSession.CurrentEnvironment.CurrentYear;
    }
    function Insert() {
        MasterDetailModel.I_Stk_TR_Adjust.CreatedBy = SysSession.CurrentEnvironment.UserCode;
        MasterDetailModel.I_Stk_TR_Adjust.CreatedAt = DateTimeFormat(Date().toString());
        MasterDetailModel.I_Stk_TR_Adjust.AdjustID = 0;
        debugger;
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("DirectTransfer", "InsertStockAdjustmentMasterDetail"),
            data: JSON.stringify(MasterDetailModel),
            success: function (d) {
                var result = d;
                if (result.IsSuccess == true) {
                    var res = result.Response;
                    DateSetsSccess("txtTransferDate", "txtFromDate", "txtToDate");
                    DisplayMassage("تم اصدار  تسوية رقم " + res.Tr_No, ' Adjustment No ' + res.Tr_No + ' has been issued', MessageType.Succeed);
                    txtTrNo.value = res.Tr_No.toString();
                    GlobalAdjustID = res.AdjustID;
                    Save();
                    AfterInsertOrUpdateFlag = true;
                    GridRowDoubleClick();
                    if (res.Status == 1) {
                        chkApproved.disabled = !SysSession.CurrentPrivileges.CUSTOM2;
                        btnUpdate.disabled = true;
                    }
                    else {
                        chkApproved.disabled = true;
                        btnUpdate.disabled = false;
                    }
                    Save_Succ_But();
                }
                else {
                    DisplayMassage("هناك خطــأ ", '(Error)', MessageType.Error);
                }
            }
        });
    }
    function Update() {
        MasterDetailModel.I_Stk_TR_Adjust.UpdatedBy = SysSession.CurrentEnvironment.UserCode;
        MasterDetailModel.I_Stk_TR_Adjust.UpdatedAt = DateTimeFormat(Date().toString());
        MasterDetailModel.I_Stk_TR_Adjust.AdjustID = GlobalAdjustID;
        // creation
        if (SelectedStockModel.length > 0) {
            MasterDetailModel.I_Stk_TR_Adjust.CreatedBy = SelectedStockModel[0].CreatedBy;
            MasterDetailModel.I_Stk_TR_Adjust.CreatedAt = SelectedStockModel[0].CreatedAt;
        }
        else {
            MasterDetailModel.I_Stk_TR_Adjust.CreatedBy = SysSession.CurrentEnvironment.UserCode;
            MasterDetailModel.I_Stk_TR_Adjust.CreatedAt = DateTimeFormat(Date().toString());
        }
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("DirectTransfer", "UpdateStockAdjustmentDetail"),
            data: JSON.stringify(MasterDetailModel),
            success: function (d) {
                var result = d;
                if (result.IsSuccess == true) {
                    var res = result.Response;
                    DateSetsSccess("txtTransferDate", "txtFromDate", "txtToDate");
                    DisplayMassage("تم التعديل بنجاح " + res.Tr_No, 'Edited Successfully ' + res.Tr_No, MessageType.Succeed);
                    GlobalAdjustID = res.AdjustID;
                    Save();
                    AfterInsertOrUpdateFlag = true;
                    GridRowDoubleClick();
                    if (res.Status == 1) {
                        chkApproved.disabled = !SysSession.CurrentPrivileges.CUSTOM2;
                        btnUpdate.disabled = true;
                    }
                    else {
                        chkApproved.disabled = true;
                        btnUpdate.disabled = false;
                    }
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
        MasterDetailModel.I_Stk_TR_Adjust.UpdatedBy = SysSession.CurrentEnvironment.UserCode;
        MasterDetailModel.I_Stk_TR_Adjust.UpdatedAt = DateTimeFormat(Date().toString());
        MasterDetailModel.I_Stk_TR_Adjust.AdjustID = GlobalAdjustID;
        // creation
        if (SelectedStockModel.length > 0) {
            MasterDetailModel.I_Stk_TR_Adjust.CreatedBy = SelectedStockModel[0].CreatedBy;
            MasterDetailModel.I_Stk_TR_Adjust.CreatedAt = SelectedStockModel[0].CreatedAt;
        }
        else {
            MasterDetailModel.I_Stk_TR_Adjust.CreatedBy = SysSession.CurrentEnvironment.UserCode;
            MasterDetailModel.I_Stk_TR_Adjust.CreatedAt = DateTimeFormat(Date().toString());
        }
        MasterDetailModel.I_Stk_TR_Adjust.Status = 0;
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("DirectTransfer", "OpenStockAdjustment"),
            data: JSON.stringify(MasterDetailModel),
            success: function (d) {
                var result = d;
                if (result.IsSuccess == true) {
                    var res = result.Response;
                    DisplayMassage("تم فك التسوية رقم  " + res.Tr_No, 'Adjustment num ' + res.Tr_No + ' has been decoded', MessageType.Succeed);
                    AfterInsertOrUpdateFlag = true;
                    GlobalAdjustID = res.AdjustID;
                    InitializeGrid();
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
    //----------------------------------------------------------PRint Report---------------------------------------
    function PrintReport(OutType) {
        debugger;
        //////debugger;
        var storeID = $('#ddlSourceStore').val();
        var Status = $('#ddlStatusFilter').val();
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
        if (ddlStatusFilter.value == "3") {
            rp.TrType = -1;
        }
        else {
            rp.TrType = Number(ddlStatusFilter.value);
        }
        if (storeID == "null") {
            rp.storeID = -1;
        }
        else {
            rp.storeID = storeID;
        }
        if (Status == "1") {
            rp.Status = 1; //-------معتمد
        }
        else if (Status == "2") {
            rp.Status = 0; //-------غير معتمد
        }
        else {
            rp.Status = 2; //-------الجميع
        }
        Ajax.Callsync({
            url: Url.Action("IProc_Rpt_StkAdjustList", "GeneralReports"),
            data: rp,
            success: function (d) {
                var result = d.result;
                window.open(result, "_blank");
            }
        });
    }
    STKAdjust.PrintReport = PrintReport;
    function btnPrintTransaction_onclick() {
        if (!SysSession.CurrentPrivileges.PrintOut)
            return;
        var rp = new ReportParameters();
        rp.FromDate = DateFormatRep(txtFromDate.value);
        rp.ToDate = DateFormatRep(txtToDate.value);
        rp.TRId = GlobalAdjustID;
        rp.Type = 0;
        rp.Name_function = "IProc_Prnt_StkAdjust";
        localStorage.setItem("Report_Data", JSON.stringify(rp));
        localStorage.setItem("result", '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>');
        window.open(Url.Action("ReportsPopup", "Home"), "_blank");
    }
})(STKAdjust || (STKAdjust = {}));
//# sourceMappingURL=STKAdjust.js.map