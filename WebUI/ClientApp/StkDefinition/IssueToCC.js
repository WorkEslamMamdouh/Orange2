$(document).ready(function () {
    IssueToCC.InitalizeComponent();
});
var IssueToCC;
(function (IssueToCC_1) {
    //------------------------------------------------------------------------------* G L O B A L * ----------------------------- 
    var SysSession = GetSystemSession(Modules.IssueToCC);
    var CountGrid = 0;
    var compcode;
    var BranchCode;
    var GlobalStoreCode = 0;
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);
    var sys = new SystemTools();
    var Grid = new JsGrid();
    //------------------------------------------------------------------------------* A R R A Y S * ----------------------------- 
    var Display_STORE = new Array();
    var Display_Item = new Array();
    var Display_Unit = new Array();
    var GridDetails = new Array();
    var COST_CENTERDetails = new Array();
    var IssueTypeDetails = new Array();
    var IssueToCC = new I_Stk_TR_IssueToCC();
    var IssueMasterDetails = new Stk_TR_IssueToCCMasterDetails();
    var StkIssueCCDetail = new Array();
    var ModelMaster = new I_Stk_TR_IssueToCC();
    var ModelDetail = new Array();
    var SingleModelDetail = new I_Stk_TR_IssueToCCDetails();
    //------------------------------------------------------------------------------* B U T T O N S * --------------------------- 
    var btnShow;
    var btnAdd;
    var btnAddDetails;
    var btnSave;
    var btnBack;
    var btnUpdate;
    //******PrintButton******
    // var btnPrint: HTMLButtonElement;
    var btnPrintTrview;
    var btnPrintTrPDF;
    var btnPrintTrEXEL;
    var btnPrintTransaction;
    //***********************
    //------------------------------------------------------------------------------* D R O P D O W N S * ----------------------- 
    var drp_G_Store;
    var drp_C_Center;
    var drp_Pay_Type;
    var drp_Status;
    var ddl_C_center;
    var txtStoreID;
    var ddl_PaymentType;
    //------------------------------------------------------------------------------* I N P U T S * ----------------------------- 
    var txtStartDate;
    var txtEndDate;
    var searchbutmemreport;
    var txtTr_No;
    var txTrDate;
    var txRefNo;
    var txtRemark;
    var txtCreatedBy;
    var txtCreatedAt;
    var txtUpdatedBy;
    var txtUpdatedAt;
    var txtStoreCode;
    var chkStatus;
    //------------------------------------------------------------------------------* F L A G S * -------------------------------- 
    var IsNew = false;
    var IssueToCcID = 0;
    var IssueQty = 0;
    var UnitCost = 0;
    var TotRetQty = 0;
    var IssueedBeforeQty = 0;
    var IsSuccess = false;
    function InitalizeComponent() {
        document.getElementById('Screen_name').innerHTML = (lang == "ar" ? "امر صرف" : "Payment Order");
        document.title = (lang == "ar" ? "امر صرف" : "Payment Order");
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);
        InitalizeControls();
        InitalizeEvents();
        Get_CostCenter();
        Get_PaymentType();
        Get_G_store();
        InitializeGrid();
        txtStartDate.value = DateStartMonth();
        txtEndDate.value = GetDate();
        Get_Items();
    }
    IssueToCC_1.InitalizeComponent = InitalizeComponent;
    function InitalizeControls() {
        //------------------------------------------------------------------------------* B U T T O N S * --------------------------- 
        btnShow = document.getElementById("btnShow");
        btnAdd = document.getElementById("btnAdd");
        btnAddDetails = document.getElementById("btnAddDetails");
        btnUpdate = document.getElementById("btnUpdate");
        btnSave = document.getElementById("btnSave");
        btnBack = document.getElementById("btnBack");
        //******PrintButton******
        // btnPrint = document.getElementById("btnPrint") as  HTMLButtonElement;
        btnPrintTrview = document.getElementById("btnPrintTrview");
        btnPrintTrPDF = document.getElementById("btnPrintTrPDF");
        btnPrintTrEXEL = document.getElementById("btnPrintTrEXEL");
        btnPrintTransaction = document.getElementById("btnPrintTransaction");
        //***********************
        //------------------------------------------------------------------------------* D R O P D O W N S * ----------------------- 
        drp_C_Center = document.getElementById("drp_C_Center");
        drp_Pay_Type = document.getElementById("drp_Pay_Type");
        drp_Status = document.getElementById("drp_Status");
        drp_G_Store = document.getElementById("drp_G_Store");
        ddl_C_center = document.getElementById("ddl_C_center");
        txtStoreID = document.getElementById("txtStoreID");
        ddl_PaymentType = document.getElementById("ddl_PaymentType");
        //------------------------------------------------------------------------------* I N P U T S * ----------------------------- 
        searchbutmemreport = document.getElementById("searchbutmemreport");
        txtStartDate = document.getElementById("txtStartDate");
        txtEndDate = document.getElementById("txtEndDate");
        txtTr_No = document.getElementById("txtTr_No");
        txTrDate = document.getElementById("txTrDate");
        txRefNo = document.getElementById("txRefNo");
        txtRemark = document.getElementById("txtRemark");
        txtCreatedBy = document.getElementById("txtCreatedBy");
        txtCreatedAt = document.getElementById("txtCreatedAt");
        txtUpdatedBy = document.getElementById("txtUpdatedBy");
        txtUpdatedAt = document.getElementById("txtUpdatedAt");
        txtStoreCode = document.getElementById("txtStoreCode");
        chkStatus = document.getElementById("chkStatus");
    }
    function InitalizeEvents() {
        btnShow.onclick = btnShow_onclick;
        btnAdd.onclick = btnAdd_onclick;
        btnBack.onclick = btnback_onclick;
        btnUpdate.onclick = btnUpdate_onclick;
        btnSave.onclick = btnsave_onClick;
        btnAddDetails.onclick = AddNewRow;
        //btnPrint.onclick = () => { PrintReport(1); }
        btnPrintTrview.onclick = function () { PrintReport(1); };
        btnPrintTrPDF.onclick = function () { PrintReport(2); };
        btnPrintTrEXEL.onclick = function () { PrintReport(3); };
        btnPrintTransaction.onclick = btnPrintTransaction_onclick;
    }
    //------------------------------------------------------------------------------* E V E N T S * -----------------------------    
    function btnShow_onclick() {
        Display();
    }
    function btnAdd_onclick() {
        txtStoreCode.value = $("#txtStoreID").find(':selected').attr('data-storecode');
        IsNew = true;
        $('#id_divGridDetails').removeClass('display_none');
        $("#div_dis").addClass("disabledDiv");
        $("#div_dis").attr("disabled", "disabled").off('click');
        $("#id_divMasterGrid").addClass("disabledDiv");
        $("#id_divMasterGrid").attr("disabled", "disabled").off('click');
        $('#btnPrintTransaction').addClass('display_none');
        Clear();
        EnableInputs();
        $('#btnAddDetails').removeClass('display_none');
    }
    function btnUpdate_onclick() {
        $('#id_divGridDetails').removeClass('display_none');
        $("#div_dis").addClass("disabledDiv");
        $("#div_dis").attr("disabled", "disabled").off('click');
        $("#divIconbar").addClass("disabledIconbar");
        $("#divIconbar").attr("disabled", "disabled").off('click');
        $("#id_divMasterGrid").addClass("disabledDiv");
        $("#id_divMasterGrid").attr("disabled", "disabled").off('click');
        $('#btnUpdate').addClass('display_none');
        $('#btnPrintTransaction').addClass('display_none');
        $('#btnBack').removeClass('display_none');
        $('#btnSave').removeClass('display_none');
        $('#btnAddDetails').removeClass('display_none');
        EnableInputs();
        EnableBuild();
    }
    function btnback_onclick() {
        debugger;
        $("#id_divMasterGrid").removeClass("disabledDiv");
        $("#id_divMasterGrid").removeAttr("disabled").off('click');
        $("#div_dis").removeClass("disabledDiv");
        $("#divIconbar").removeClass("disabledIconbar");
        $('#btnUpdate').removeClass('display_none');
        $('#btnPrintTransaction').removeClass('display_none');
        $('#btnBack').addClass('display_none');
        $('#btnSave').addClass('display_none');
        $('#btnAddDetails').addClass('display_none');
        if (IsNew == true) {
            $('#id_divGridDetails').addClass('display_none');
        }
        else {
            Grid_RowDoubleClicked();
        }
    }
    function btnsave_onClick() {
        loading('btnsave');
        setTimeout(function () {
            finishSave('btnsave');
            var CanAdd = true;
            if (CountGrid > 0) {
                for (var i = 0; i < CountGrid; i++) {
                    debugger;
                    CanAdd = Validation_Grid(i);
                    if (CanAdd == false) {
                        break;
                    }
                }
            }
            if (CanAdd) {
                Assign();
                if (IsNew == true) {
                    Insert();
                }
                else {
                    Update();
                }
            }
        }, 100);
    }
    function AddNewRow() {
        if (!SysSession.CurrentPrivileges.AddNew)
            return;
        var CanAdd = true;
        if (CountGrid > 0) {
            for (var i = 0; i < CountGrid; i++) {
                debugger;
                CanAdd = Validation_Grid(i);
                if (CanAdd == false) {
                    break;
                }
            }
        }
        if (CanAdd) {
            BuildControls(CountGrid);
            $("#txtCode" + CountGrid).removeAttr("disabled");
            $("#txtQTY" + CountGrid).removeAttr("disabled");
            $("#txt_StatusFlag" + CountGrid).val("i"); //In Insert mode
            CountGrid++;
        }
        $("#btnedite").addClass("display_none");
    }
    //------------------------------------------------------------------------------* G E T * ------------------------------------     
    function Get_CostCenter() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("CostCenter", "GetAll"),
            data: {
                CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    COST_CENTERDetails = result.Response;
                    for (var i = 0; i < COST_CENTERDetails.length; i++) {
                        $('#drp_C_Center').append('<option value="' + COST_CENTERDetails[i].CC_CODE + '">' + (lang == "ar" ? COST_CENTERDetails[i].CC_DESCA : COST_CENTERDetails[i].CC_DESCE) + '</option>');
                        $('#ddl_C_center').append('<option value="' + COST_CENTERDetails[i].CC_CODE + '">' + (lang == "ar" ? COST_CENTERDetails[i].CC_DESCA : COST_CENTERDetails[i].CC_DESCE) + '</option>');
                    }
                }
            }
        });
    }
    function Get_PaymentType() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("Stk_TR_IssueToCC", "GetAllIssueTypes"),
            data: {
                CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    IssueTypeDetails = result.Response;
                    for (var i = 0; i < IssueTypeDetails.length; i++) {
                        $('#drp_Pay_Type').append('<option value="' + IssueTypeDetails[i].IssueTypeID + '">' + (lang == "ar" ? IssueTypeDetails[i].DescA : IssueTypeDetails[i].DescE) + '</option>');
                        $('#ddl_PaymentType').append('<option value="' + IssueTypeDetails[i].IssueTypeID + '">' + (lang == "ar" ? IssueTypeDetails[i].DescA : IssueTypeDetails[i].DescE) + '</option>');
                    }
                }
            }
        });
    }
    function Get_G_store() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("StkDefStore", "GetAll"),
            data: {
                CompCode: compcode, BranchCode: BranchCode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    Display_STORE = result.Response;
                    for (var i = 0; i < Display_STORE.length; i++) {
                        $('#drp_G_Store').append('<option value="' + Display_STORE[i].StoreId + '">' + (lang == "ar" ? Display_STORE[i].DescA : Display_STORE[i].DescL) + '</option>');
                        $('#txtStoreID').append('<option value="' + Display_STORE[i].StoreId + '" data-storeCode = "' + Display_STORE[i].STORE_CODE + '">' + (lang == "ar" ? Display_STORE[i].DescA : Display_STORE[i].DescL) + '</option>');
                    }
                }
            }
        });
    }
    function Get_Items() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("StkDefItems", "GetAllItem"),
            data: {
                CompCode: compcode, BraCode: BranchCode, FinYear: sys.SysSession.CurrentEnvironment.CurrentYear, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    Display_Item = result.Response;
                }
            }
        });
    }
    //------------------------------------------------------------------------------* D I S P L A Y * -----------------------------       
    function Display() {
        debugger;
        var FromDate = "";
        var ToDate = "";
        var TRType = 0;
        var StoreID = 0;
        var CC_CODE = "0";
        var Status = 0;
        FromDate = DateFormatRep(txtStartDate.value);
        ToDate = DateFormatRep(txtEndDate.value);
        if (drp_Pay_Type.value != "null") {
            TRType = Number(drp_Pay_Type.value);
        }
        if (drp_Status.value != "null") {
            TRType = Number(drp_Status.value);
        }
        if (drp_G_Store.value != "null") {
            StoreID = Number(drp_G_Store.value);
        }
        if (drp_C_Center.value != "null") {
            CC_CODE = drp_C_Center.value;
        }
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("Stk_TR_IssueToCC", "GetFiltered"),
            data: {
                CompCode: compcode, BranchCode: BranchCode, FromDate: FromDate, ToDate: ToDate, TRType: TRType, StoreID: StoreID, CC_CODE: CC_CODE, Status: Status, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                GridDetails = result.Response;
                if (result.IsSuccess) {
                    $('#id_divMasterGrid').removeClass('display_none');
                    for (var i = 0; i < GridDetails.length; i++) {
                        GridDetails[i].TrDate = DateFormat(GridDetails[i].TrDate);
                    }
                    Grid.DataSource = GridDetails;
                    Grid.Bind();
                }
            }
        });
    }
    function InitializeGrid() {
        var res = GetResourceList("");
        Grid.ElementName = "divMasterGrid";
        Grid.Paging = true;
        Grid.PageSize = 10;
        Grid.Sorting = true;
        Grid.InsertionMode = JsGridInsertionMode.Binding;
        Grid.Editing = false;
        Grid.Inserting = false;
        Grid.SelectedIndex = 1;
        Grid.OnRowDoubleClicked = Grid_RowDoubleClicked;
        Grid.OnItemEditing = function () { };
        Grid.PrimaryKey = "IssueToCcID";
        Grid.Columns = [
            { title: res.App_Number, name: "IssueToCcID", type: "text", width: "1%", visible: false },
            { title: res.App_Number, name: "Tr_No", type: "text", width: "9%" },
            { title: res.App_date, name: "TrDate", type: "text", width: "10%" },
            { title: res.App_Store, name: (lang == "ar" ? "store_DescA" : "store_DescE"), type: "text", width: "25%" },
            { title: res.PaymentTypes, name: (lang == "ar" ? "Type_DescA" : "Type_DescE"), type: "text", width: "25%" },
            { title: res.CostCenter, name: (lang == "ar" ? "CC_DESCA" : "CC_DESCE"), type: "text", width: "25%" },
        ];
    }
    function Grid_RowDoubleClicked() {
        IsNew = false;
        DocumentActions.RenderFromModel(Grid.SelectedItem);
        IssueToCcID = Number(Grid.SelectedKey);
        bindDetails();
    }
    function bindDetails() {
        $("#div_Data").html("");
        $('#id_divGridDetails').removeClass('display_none');
        $('#btnUpdate').removeClass('display_none');
        $('#btnPrintTransaction').removeClass('display_none');
        $('#btnBack').addClass('display_none');
        $('#btnSave').addClass('display_none');
        DisableInputs();
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("Stk_TR_IssueToCC", "GetDetailByID"),
            data: {
                IssueToCcID: IssueToCcID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    debugger;
                    StkIssueCCDetail = result.Response;
                    for (var i = 0; i < StkIssueCCDetail.length; i++) {
                        BuildControls(i);
                        $('#ItemID' + i).val(StkIssueCCDetail[i].ItemID);
                        $('#txtSerial' + i).val(i + 1);
                        $('#txtCode' + i).val(StkIssueCCDetail[i].ItemCode);
                        $('#txtItemName' + i).val(lang == "ar" ? StkIssueCCDetail[i].itm_DescA : StkIssueCCDetail[i].itm_DescE);
                        $('#txtUnitName' + i).val(lang == "ar" ? StkIssueCCDetail[i].uom_DescA : StkIssueCCDetail[i].uom_DescE);
                        $('#txtQTY' + i).val(StkIssueCCDetail[i].ReqQty);
                        $('#IssueToCcDetailID' + i).val(StkIssueCCDetail[i].IssueToCcDetailID);
                        $('#txtUnitID' + i).val(StkIssueCCDetail[i].UnitID);
                        IssueQty = StkIssueCCDetail[i].IssueQty;
                        UnitCost = StkIssueCCDetail[i].UnitCost;
                        TotRetQty = StkIssueCCDetail[i].TotRetQty;
                        IssueedBeforeQty = StkIssueCCDetail[i].IssueedBeforeQty;
                        $('#ddlItem' + i).attr('disabled', 'disabled');
                        $('#txtQTY' + i).attr('disabled', 'disabled');
                        $('#btn_minus' + i).addClass('display_none');
                        CountGrid++;
                    }
                }
            }
        });
    }
    function BuildControls(cnt) {
        var html;
        html = "<tr id= \"No_Row" + cnt + "\">\n                    <input id=\"ItemID" + cnt + "\" type=\"hidden\" class=\"form-control display_none\"  />  \n                    <td>\n\t\t                <div class=\"form-group\">\n\t\t\t                <span id=\"btn_minus" + cnt + "\"><i class=\"fas fa-minus-circle fs-4 btn-minus\"></i></span>\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n                            <input id=\"txtSerial" + cnt + "\" type=\"number\"  value=\"" + (cnt + 1) + "\" class=\"form-control\" name=\"\" disabled />\n\t\t                </div>\n\t                </td>\n                    <td>\n                        <div class=\"form-group\">\n                            <button type=\"button\" class=\"btn btn-main input-sm\" id=\"btnSearchItems" + cnt + "\" name=\"ColSearch\">\n                                <i class=\"fas fa-search\"></i>\n                            </button>\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n                            <input id=\"txtCode" + cnt + "\" type=\"text\" class=\"form-control\" name=\"\" disabled />\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n                            <input id=\"txtItemName" + cnt + "\" type=\"text\" class=\"form-control\" name=\"\" disabled />\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n                            <input id=\"txtUntitName" + cnt + "\" type=\"number\" class=\"form-control\" name=\"\" disabled />\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n                            <input id=\"txtQTY" + cnt + "\" type=\"number\" class=\"form-control\" name=\"\" disabled />\n\t\t                </div>\n\t                </td>\n                    \n               <input id=\"txt_StatusFlag" + cnt + "\" type=\"hidden\"   />\n               <input id=\"IssueToCcDetailID" + cnt + "\" type=\"hidden\"   />\n               <input id=\"txtUnitID" + cnt + "\" type=\"hidden\"   />\n                </tr>";
        $("#div_Data").append(html);
        //// Items Search
        $('#btnSearchItems' + cnt).click(function (e) {
            var sys = new SystemTools();
            var storeId = Number(txtStoreID.value); //and OnhandQty > 0
            var FinYear = SysSession.CurrentEnvironment.CurrentYear; //and OnhandQty > 0
            sys.FindKey(Modules.IssueToCC, "btnSearchItems", "StoreId=" + storeId + " and IsStock = 1 and FinYear = " + FinYear, function () {
                var id = SearchGrid.SearchDataGrid.SelectedKey;
                var res = false;
                debugger;
                var NumberRowid = Number($("#txtSerial" + cnt).val());
                res = checkRepeatedItems(id, NumberRowid);
                if (res == false) {
                    if ($("#txt_StatusFlag" + cnt).val() != "i")
                        $("#txt_StatusFlag" + cnt).val("u");
                    var SrcItem = Display_Item.filter(function (s) { return s.ItemID == id; });
                    if (SrcItem != null) {
                        $('#ItemID' + cnt).val(id);
                        $('#txtCode' + cnt).val(SrcItem[0].ItemCode);
                        (lang == "ar" ? $('#txtItemName' + cnt).val(SrcItem[0].Itm_DescA) : $('#txtItemName' + cnt).val(SrcItem[0].Itm_DescE));
                        $('#txtUnitID' + cnt).val(SrcItem[0].UomID);
                        $('#txtUnitName' + cnt).val(SrcItem[0].Uom_DescA);
                        $('#txtQTY' + cnt).val(SrcItem[0].OnhandQty);
                    }
                }
                else {
                    DisplayMassage('( لايمكن تكرار نفس الاصناف )', 'The same items cannot be repeated ', MessageType.Error);
                    $('#ItemID' + cnt).val("");
                    $('#txtCode' + cnt).val("");
                    Errorinput(('#txtCode' + cnt));
                    $('#txtItemName' + cnt).val("");
                    $('#txtUnitID' + cnt).val("");
                    $('#txtUnitName' + cnt).val("");
                    $('#txtQTY' + cnt).val("");
                    $('#txtDetailID' + cnt).val("");
                }
            });
        });
        $('#txtCode' + cnt).change(function () {
            var filter = Display_Item.filter(function (s) { return s.ItemCode == $('#txtCode' + cnt).val(); });
            if (filter.length > 0) {
                var id_1 = filter[0].ItemID;
                var res = false;
                debugger;
                var NumberRowid = Number($("#txtSerial" + cnt).val());
                res = checkRepeatedItems(id_1, NumberRowid);
                if (res == false) {
                    if ($("#txt_StatusFlag" + cnt).val() != "i")
                        $("#txt_StatusFlag" + cnt).val("u");
                    var SrcItem = Display_Item.filter(function (s) { return s.ItemID == id_1; });
                    if (SrcItem != null) {
                        $('#ItemID' + cnt).val(id_1);
                        $('#txtCode' + cnt).val(SrcItem[0].ItemCode);
                        (lang == "ar" ? $('#txtItemName' + cnt).val(SrcItem[0].Itm_DescA) : $('#txtItemName' + cnt).val(SrcItem[0].Itm_DescE));
                        $('#txtUnitID' + cnt).val(SrcItem[0].UomID);
                        $('#txtUnitName' + cnt).val(SrcItem[0].Uom_DescA);
                        $('#txtQTY' + cnt).val(SrcItem[0].OnhandQty);
                    }
                }
                else {
                    DisplayMassage('( لايمكن تكرار نفس الاصناف )', 'The same items cannot be repeated ', MessageType.Error);
                    $('#ItemID' + cnt).val("");
                    $('#txtCode' + cnt).val("");
                    Errorinput(('#txtCode' + cnt));
                    $('#txtItemName' + cnt).val("");
                    $('#txtUnitID' + cnt).val("");
                    $('#txtUnitName' + cnt).val("");
                    $('#txtQTY' + cnt).val("");
                    $('#txtDetailID' + cnt).val("");
                }
            }
            else {
                DisplayMassage('(كود الصنف غير موجود  )', 'The Code of items not available ', MessageType.Error);
                $('#ItemID' + cnt).val("");
                $('#txtCode' + cnt).val("");
                Errorinput(('#txtCode' + cnt));
                $('#txtItemName' + cnt).val("");
                $('#txtUnitID' + cnt).val("");
                $('#txtUnitName' + cnt).val("");
                $('#txtQTY' + cnt).val("");
                $('#txtDetailID' + cnt).val("");
            }
        });
        $("#btn_minus" + cnt).on('click', function () {
            DeleteRow(cnt);
        });
    }
    //------------------------------------------------------------------------------* A S S I G N* -----------------------------     
    function Update() {
        var stringDetail = JSON.stringify(IssueMasterDetails);
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("Stk_TR_IssueToCC", "Update"),
            data: { stringDetail: stringDetail },
            success: function (d) {
                var result = d;
                if (result.IsSuccess == true) {
                    IssueToCC = result.Response;
                    Success();
                }
                else {
                    DisplayMassage_Processes('خطأ', 'Wrong', MessageType.Worning);
                }
            }
        });
    }
    function Insert() {
        var stringDetail = JSON.stringify(IssueMasterDetails);
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("Stk_TR_IssueToCC", "Insert"),
            data: { stringDetail: stringDetail },
            success: function (d) {
                var result = d;
                if (result.IsSuccess == true) {
                    IssueToCC = result.Response;
                    Success();
                }
                else {
                    DisplayMassage_Processes('خطأ', 'Wrong', MessageType.Worning);
                }
            }
        });
    }
    function Assign() {
        debugger;
        ModelMaster = new I_Stk_TR_IssueToCC();
        ModelDetail = new Array();
        IssueMasterDetails = new Stk_TR_IssueToCCMasterDetails();
        DocumentActions.AssignToModel(ModelMaster);
        ModelMaster.BranchCode = BranchCode;
        ModelMaster.CompCode = compcode;
        ModelMaster.StoreID = Number(txtStoreID.value);
        ModelMaster.StoreCode = Number(txtStoreCode.value);
        ModelMaster.Status = chkStatus.checked == true ? 1 : 0;
        ModelMaster.TRType = 0;
        var StatusFlag;
        if (IsNew == true) {
            ModelMaster.CreatedAt = GetDate();
            ModelMaster.CreatedBy = sys.SysSession.CurrentEnvironment.UserCode;
            ModelMaster.Tr_No = 0;
            for (var i = 0; i < CountGrid; i++) {
                SingleModelDetail = new I_Stk_TR_IssueToCCDetails();
                StatusFlag = $("#txt_StatusFlag" + i).val();
                if (StatusFlag == "i") {
                    SingleModelDetail.IssueToCcDetailID = 0;
                    SingleModelDetail.IssueToCcID = 0;
                    SingleModelDetail.Serial = Number($('#txtSerial' + i).val());
                    SingleModelDetail.ItemID = Number($('#ItemID' + i).val());
                    SingleModelDetail.UnitID = Number($('#txtUnitID' + i).val());
                    SingleModelDetail.ReqQty = Number($('#txtQTY' + i).val());
                    SingleModelDetail.IssueQty = 0;
                    SingleModelDetail.UnitCost = 0;
                    SingleModelDetail.TotRetQty = 0;
                    SingleModelDetail.IssueedBeforeQty = 0;
                    SingleModelDetail.StatusFlag = "i";
                    ModelDetail.push(SingleModelDetail);
                }
            }
        }
        else {
            for (var i = 0; i < CountGrid; i++) {
                SingleModelDetail = new I_Stk_TR_IssueToCCDetails();
                StatusFlag = $("#txt_StatusFlag" + i).val();
                if (StatusFlag == "i") {
                    SingleModelDetail.IssueToCcDetailID = Number($('#IssueToCcDetailID' + i).val());
                    SingleModelDetail.IssueToCcID = IssueToCcID;
                    SingleModelDetail.Serial = Number($('#txtSerial' + i).val());
                    SingleModelDetail.ItemID = Number($('#ddlItem' + i).val());
                    SingleModelDetail.UnitID = Number($('#txtUnitID' + i).val());
                    SingleModelDetail.ReqQty = Number($('#txtQTY' + i).val());
                    SingleModelDetail.IssueQty = 0;
                    SingleModelDetail.UnitCost = 0;
                    SingleModelDetail.TotRetQty = 0;
                    SingleModelDetail.IssueedBeforeQty = 0;
                    SingleModelDetail.StatusFlag = "i";
                    ModelDetail.push(SingleModelDetail);
                }
                if (StatusFlag == "u") {
                    SingleModelDetail.IssueToCcDetailID = Number($('#IssueToCcDetailID' + i).val());
                    SingleModelDetail.IssueToCcID = IssueToCcID;
                    SingleModelDetail.Serial = Number($('#txtSerial' + i).val());
                    SingleModelDetail.ItemID = Number($('#ddlItem' + i).val());
                    SingleModelDetail.UnitID = Number($('#txtUnitID' + i).val());
                    SingleModelDetail.ReqQty = Number($('#txtQTY' + i).val());
                    SingleModelDetail.IssueQty = IssueQty;
                    SingleModelDetail.UnitCost = UnitCost;
                    SingleModelDetail.TotRetQty = TotRetQty;
                    SingleModelDetail.IssueedBeforeQty = IssueedBeforeQty;
                    SingleModelDetail.StatusFlag = "u";
                    ModelDetail.push(SingleModelDetail);
                }
                if (StatusFlag == "d") {
                    SingleModelDetail.IssueToCcDetailID = Number($('#IssueToCcDetailID' + i).val());
                    SingleModelDetail.IssueToCcID = IssueToCcID;
                    SingleModelDetail.ItemID = Number($('#ddlItem' + i).val());
                    SingleModelDetail.StatusFlag = "d";
                    ModelDetail.push(SingleModelDetail);
                }
            }
            ModelMaster.IssueToCcID = IssueToCcID;
            ModelMaster.Tr_No = Number(txtTr_No.value);
            ModelMaster.CreatedAt = DateFormat(txtCreatedAt.value);
            ModelMaster.CreatedBy = txtCreatedBy.value;
            ModelMaster.UpdatedAt = GetDate();
            ModelMaster.UpdatedBy = sys.SysSession.CurrentEnvironment.UserCode;
        }
        IssueMasterDetails.UserCode = sys.SysSession.CurrentEnvironment.UserCode;
        IssueMasterDetails.Token = "HGFD-" + sys.SysSession.CurrentEnvironment.Token;
        IssueMasterDetails.I_Stk_TR_IssueToCCDetails = ModelDetail;
        IssueMasterDetails.I_Stk_TR_IssueToCC = ModelMaster;
    }
    //------------------------------------------------------------------------------* A S S I G N* -----------------------------   
    function DeleteRow(RecNo) {
        if (!SysSession.CurrentPrivileges.Remove)
            return;
        WorningMessage("هل تريد الحذف؟", "Do you want to delete?", "تحذير", "worning", function () {
            if ($("#txtCode" + RecNo).val() == "") {
                $("#No_Row" + RecNo).attr("hidden", "true");
            }
            else {
                $("#No_Row" + RecNo).attr("hidden", "true");
            }
            $("#txt_StatusFlag" + RecNo).val() == 'i' ? $("#txt_StatusFlag" + RecNo).val('m') : $("#txt_StatusFlag" + RecNo).val('d');
            $("#txtCode" + RecNo).val("000");
            $("#txtUntitNamePrice" + RecNo).val("000");
            $("#txtMinUnitPrice" + RecNo).val("000");
        });
    }
    function DisableInputs() {
        //------------------------------------------------------------------------------* D R O P D O W N S * -----------------------                 
        ddl_C_center.disabled = true;
        txtStoreID.disabled = true;
        ddl_PaymentType.disabled = true;
        //------------------------------------------------------------------------------* I N P U T S * -----------------------------         
        chkStatus.disabled = true;
        txTrDate.disabled = true;
        txRefNo.disabled = true;
        txtRemark.disabled = true;
    }
    function EnableInputs() {
        //------------------------------------------------------------------------------* D R O P D O W N S * ----------------------- 
        ddl_C_center.disabled = false;
        txtStoreID.disabled = false;
        ddl_PaymentType.disabled = false;
        //------------------------------------------------------------------------------* I N P U T S * ----------------------------- 
        chkStatus.disabled = false;
        txTrDate.disabled = false;
        txRefNo.disabled = false;
        txtRemark.disabled = false;
        btnAddDetails.classList.remove('display_none');
    }
    function EnableBuild() {
        debugger;
        for (var i = 0; i < CountGrid; i++) {
            $('#ddlItem' + i).removeAttr('disabled');
            $('#txtQTY' + i).removeAttr('disabled');
            $('#txtCode' + i).removeAttr('disabled');
            $('#btn_minus' + i).removeClass('display_none');
        }
    }
    function DisableBuild() {
        for (var i = 0; i < CountGrid; i++) {
            $('#ddlItem' + i).attr('disabled', 'disabled');
            $('#txtQTY' + i).attr('disabled', 'disabled');
            $('#txtCode' + i).attr('disabled', 'disabled');
            $('#btn_minus' + i).addClass('display_none');
        }
    }
    function Clear() {
        //------------------------------------------------------------------------------* D R O P D O W N S * -----------------------  
        ddl_C_center.selectedIndex = 0;
        txtStoreID.selectedIndex = 0;
        ddl_PaymentType.selectedIndex = 0;
        chkStatus.checked = false;
        //------------------------------------------------------------------------------* I N P U T S * -----------------------------  
        txtTr_No.value = "";
        txTrDate.value = GetDate();
        txRefNo.value = "";
        txtRemark.value = "";
        CountGrid = 0;
        $("#div_Data").html("");
    }
    function Success() {
        Display();
        $("#id_divMasterGrid").removeClass("disabledDiv");
        $("#id_divMasterGrid").removeAttr("disabled").off('click');
        $("#div_dis").removeClass("disabledDiv");
        $("#divIconbar").removeClass("disabledIconbar");
        DocumentActions.RenderFromModel(IssueToCC);
        txTrDate.value = IssueToCC.TrDate;
        IssueToCcID = IssueToCC.IssueToCcID;
        bindDetails();
    }
    function Validation_Grid(rowcount) {
        if ($("#txt_StatusFlag" + rowcount).val() == "d" || $("#txt_StatusFlag" + rowcount).val() == "m") {
            return true;
        }
        else {
            //if ($("#txt_UOM" + rowcount).val() == "null" && $("#txt_StatusFlag" + rowcount).val() != "d") {
            //    Errorinput($("#txt_UOM" + rowcount));
            //    DisplayMassage_Processes('اختار وحدة القياس', 'Choose The Measuring Unit', MessageType.Worning);
            //    return false;
            //} 
        }
        return true;
    }
    function checkRepeatedItems(itemValue, NumberRowid) {
        var items = Number(CountGrid);
        var flag = false;
        for (var i = 0; i < items - 1; i++) {
            if (NumberRowid != 0) {
                if (Number($("#ItemID" + i).val()) == itemValue && Number($("#txtSerial" + i).val()) != NumberRowid) {
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
    //------------------------------------------------------------------------------* P R I N T* -----------------------------
    function PrintReport(OutType) {
        var rp = new ReportParameters();
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
        rp.RepType = OutType; //output report as View
        rp.FromDate = DateFormatRep(txtStartDate.value);
        rp.ToDate = DateFormatRep(txtEndDate.value);
        if (drp_G_Store.value == "null") {
            rp.storeID = -1;
        }
        else {
            rp.storeID = Number(drp_G_Store.value);
        }
        if (drp_Pay_Type.value == "null") {
            rp.IssueTypeID = -1;
        }
        else {
            rp.IssueTypeID = Number(drp_Pay_Type.value);
        }
        if (drp_Status.value == "null") {
            rp.Status = -1;
        }
        else {
            rp.Status = Number(drp_Status.value);
        }
        //if (drp_C_Center.value == "null") { rp.cc_code = "-1"; }
        //else { rp.cc_code = drp_C_Center.value; }
        Ajax.Callsync({
            url: Url.Action("IProc_Rpt_StkIssueList", "GeneralReports"),
            data: rp,
            success: function (d) {
                var result = d.result;
                window.open(result, "_blank");
            }
        });
    }
    function btnPrintTransaction_onclick() {
        debugger;
        var rp = new ReportParameters();
        rp.RepType = 0;
        rp.TRId = IssueToCcID;
        rp.Name_function = "IProc_Prnt_StkIssue";
        localStorage.setItem("Report_Data", JSON.stringify(rp));
        localStorage.setItem("result", '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>');
        window.open(Url.Action("ReportsPopup", "Home"), "_blank");
    }
})(IssueToCC || (IssueToCC = {}));
//# sourceMappingURL=IssueToCC.js.map