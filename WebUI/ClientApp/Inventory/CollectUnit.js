$(document).ready(function () {
    CollectUnit.InitalizeComponent();
});
var CollectUnit;
(function (CollectUnit) {
    var sys = new SystemTools();
    var SysSession = GetSystemSession(Modules.CollectUnit);
    var compcode;
    var Branch;
    var startDate;
    var EndDate;
    var FinYear;
    var backflag = false;
    var Grid = new JsGrid();
    var MasterDetailModel = new StockAdjustMasterDetails();
    var txtFromDate;
    var txtToDate;
    var txtTransferDate;
    var txtTrNo;
    var txtLabourCost;
    var txtCreatedBy;
    var txtCreatedAt;
    var txtUpdatedBy;
    var txtUpdatedAt;
    var txtSearch;
    var txtRemarks;
    var btnShow;
    var btnAdd;
    var btnUpdate;
    var btnSave;
    var btnBack;
    var btnAddDetails;
    var btnAddDetails2;
    var btnLoad;
    var CountGrid = 0;
    var CountGrid2 = 0;
    var btnPrintTrview;
    var btnPrintTrPDF;
    var btnPrintTrEXEL;
    var btnPrint;
    var btnPrintTransaction;
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);
    var drp_Store;
    var ddlstatus;
    var CollectList = new Array();
    var hd_CollectID;
    var chkStatus;
    var Model = new I_TR_Collect();
    var ModelCollectDet = new Array();
    var CollectMasterDetail = new ICollectMasterDetails();
    var btnSave;
    var txtMaterialCost;
    var btndiv_1;
    var btndiv_2;
    var gloplCollectID = 0;
    //*************************************************Initialization*************************************************//
    function InitalizeComponent() {
        //System
        (SysSession.CurrentEnvironment.ScreenLanguage == "ar") ? document.getElementById('Screen_name').innerHTML = "تجميع الاصناف" : document.getElementById('Screen_name').innerHTML = "Collect Unit";
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        Branch = Number(SysSession.CurrentEnvironment.BranchCode);
        FinYear = Number(SysSession.CurrentEnvironment.CurrentYear);
        InitalizeControls();
        $("#ddlstatus").prop("value", "null");
        txtFromDate.value = DateStartMonth();
        txtToDate.value = ConvertToDateDash(GetDate()) <= ConvertToDateDash(SysSession.CurrentEnvironment.EndDate) ? GetDate() : SysSession.CurrentEnvironment.EndDate;
        txtTransferDate.value = GetDate();
        InitalizeEvents();
        InitializeGrid();
        FillStore();
        drp_Store.selectedIndex = 1;
    }
    CollectUnit.InitalizeComponent = InitalizeComponent;
    function InitalizeControls() {
        txtFromDate = document.getElementById("txtFromDate");
        txtToDate = document.getElementById("txtToDate");
        txtTrNo = document.getElementById("txtTrNo");
        txtTransferDate = document.getElementById("txtTransferDate");
        txtLabourCost = document.getElementById("txtLabourCost");
        btnAdd = document.getElementById("btnAdd");
        btnUpdate = document.getElementById("btnUpdate");
        btnSave = document.getElementById("btnSave");
        btnBack = document.getElementById("btnBack");
        btnAddDetails = DocumentActions.GetElementById("btnAddDetails");
        btnAddDetails2 = DocumentActions.GetElementById("btnAddDetails2");
        btnShow = DocumentActions.GetElementById("btnShow");
        drp_Store = DocumentActions.GetElementById("drp_Store");
        hd_CollectID = DocumentActions.GetElementById("hd_CollectID");
        chkStatus = document.getElementById("chkStatus");
        ddlstatus = document.getElementById("ddlstatus");
        btnPrintTrview = document.getElementById("btnPrintTrview");
        btnPrintTrPDF = document.getElementById("btnPrintTrPDF");
        btnPrintTrEXEL = document.getElementById("btnPrintTrEXEL");
        btnPrintTransaction = document.getElementById("btnPrintTransaction");
        btndiv_1 = document.getElementById("btndiv_1");
        btndiv_2 = document.getElementById("btndiv_2");
    }
    function InitalizeEvents() {
        btnAdd.onclick = btnAdd_onclick;
        btnBack.onclick = btnBack_onclick;
        btnUpdate.onclick = btnUpdate_onclick;
        btnAddDetails.onclick = AddNewRow;
        btnAddDetails2.onclick = AddNewRow2;
        btnShow.onclick = btnShow_onclick;
        btnSave.onclick = btnSave_onclick;
        chkStatus.onchange = chkStatus_onchange;
        btnPrintTrview.onclick = function () { PrintReport(1); };
        btnPrintTrPDF.onclick = function () { PrintReport(2); };
        btnPrintTrEXEL.onclick = function () { PrintReport(3); };
        btnPrintTransaction.onclick = PrintTransaction;
        btndiv_1.onclick = btndiv_1_onclick;
        btndiv_2.onclick = btndiv_2_onclick;
    }
    function InitializeGrid() {
        var res = GetResourceList("");
        Grid.ElementName = "divGridDetails";
        Grid.Paging = true;
        Grid.PageSize = 10;
        Grid.Sorting = true;
        Grid.InsertionMode = JsGridInsertionMode.Binding;
        Grid.Editing = false;
        Grid.Inserting = false;
        Grid.SelectedIndex = 1;
        Grid.OnRowDoubleClicked = Grid_RowDoubleClicked;
        Grid.OnItemEditing = function () { };
        Grid.PrimaryKey = "CollectID";
        Grid.Columns = [
            { title: res.App_Number, name: "CollectID", type: "text", width: "0%", visible: false },
            { title: res.App_Number, name: "TrNo", type: "text", width: "13%" },
            { title: res.App_date, name: "TrDate", type: "text", width: "20%" },
            { title: res.App_date, name: "Remark", type: "text", width: "20%" },
            { title: res.Inv_LabourCost, name: "LabourCost", type: "text", width: "13%" },
            { title: res.Inv_CostPrc, name: "MaterialCost", type: "text", width: "13%" },
            { title: res.App_Certified, name: "status_txt", type: "text", width: "17%" }
        ];
        Grid.Bind();
    }
    //***********************************************Grid Controls*******************************************//
    function BuildControls(cnt) {
        var html = "";
        html = "<tr id= \"No_Row" + cnt + "\">\n                    <input id=\"txtCollectDetailID" + cnt + "\" type=\"hidden\" class=\"form-control display_none\"  />\n                    <td>\n\t\t                <div class=\"form-group\">\n\t\t\t                <span id=\"btn_minus" + cnt + "\"><i class=\"fas fa-minus-circle fs-4 btn-minus\"></i></span>\n\t\t                </div>\n\t                </td>\n                    <td>\n\t                    <div class=\"form-group\">\n\t\t                    <button type=\"button\" class=\"style_ButSearch\" id=\"btnSearchItems" + cnt + "\" name=\"ColSearch\">\n\t\t                    <i class=\"fa fa-search  \"></i>\n\t\t                     </button>\n\t                    </div>\n                    </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n                            <input id=\"txtItemCode" + cnt + "\" type=\"text\" class=\"form-control\" name=\"\"  />\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n                            <input id=\"txtItemName" + cnt + "\" type=\"text\" class=\"form-control\" name=\"\" disabled />\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n                            <input id=\"txt_u_DescA" + cnt + "\" type=\"text\" class=\"form-control\" name=\"\"  />\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n                            <input id=\"txtQuantity" + cnt + "\" type=\"number\" class=\"form-control\" name=\"\"  />\n\t\t                </div>\n\t                </td>\n                    \n               <input id=\"txt_StatusFlag" + cnt + "\" type=\"hidden\"   />\n               <input id=\"txt_ItemID" + cnt + "\" type=\"hidden\"   />\n               <input id=\"txt_OnhandQty" + cnt + "\" type=\"hidden\"   />\n               <input id=\"txt_GlobalCost" + cnt + "\" type=\"hidden\"   />\n               <input id=\"txt_UnitID" + cnt + "\" type=\"hidden\"   />\n               <input id=\"txt_StockOnhandQty" + cnt + "\" type=\"hidden\"   />\n               <input id=\"txt_StkUnitCost" + cnt + "\" type=\"hidden\"   />\n                </tr>";
        $("#div_Data").append(html);
        $("#btnSearchItems" + cnt).on('click', function () {
            btnSrchItem_onclick(cnt);
        });
        $("#txtItemCode" + cnt).on('change', function () {
            txt_search_onchange(cnt);
        });
        $("#btn_minus" + cnt).on('click', function () {
            DeleteRow(cnt);
        });
        $("#txtQuantity" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
            if (Number($("#txtQuantity" + cnt).val()) > Number($("#txt_OnhandQty" + cnt).val())) {
                DisplayMassage("يجب ان تكون الكمبةالمدخلة اصغر من الكمية الفعلية (" + Number($("#txt_OnhandQty" + cnt).val()) + ") ", "Quantity must be less than On hand Quantity", MessageType.Worning);
                //Errorinput($("#txtQuantity" + cnt));
                //$("#txtQuantity" + cnt).val(Number($("#txt_OnhandQty" + cnt).val()));
            }
        });
    }
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
            // can delete new inserted record  without need for delete privilage
            CountGrid++;
        }
    }
    function validationitem(id, idRow) {
        for (var i = 0; i < CountGrid; i++) {
            if ($("#txt_StatusFlag" + i).val() != "d" && $("#txt_StatusFlag" + i).val() != "m") {
                if ($("#txt_ItemID" + i + "").val() == id && $("#txt_ItemID" + i + "").val() != idRow) {
                    DisplayMassage("الصنف موجود من قبل", "Item found before", MessageType.Error);
                    Errorinput($("#txtItemCode" + i + ""));
                    return false;
                }
            }
        }
        return true;
    }
    function validationitem2(id, idRow) {
        for (var i = 0; i < CountGrid2; i++) {
            if ($("#txt_OUT_StatusFlag" + i).val() != "d" && $("#txt_OUT_StatusFlag" + i).val() != "m") {
                if ($("#txt_OUT_ItemID" + i + "").val() == id && $("#txt_OUT_ItemID" + i + "").val() != idRow) {
                    DisplayMassage("الصنف موجود من قبل", "Item found before", MessageType.Error);
                    Errorinput($("#txt_OUT_ItemCode" + i + ""));
                    return false;
                }
            }
        }
        return true;
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
            $("#No_Row" + RecNo).attr("hidden", "true");
        });
    }
    function DeleteRow2(RecNo) {
        if (!SysSession.CurrentPrivileges.Remove)
            return;
        WorningMessage("هل تريد الحذف؟", "Do you want to delete?", "تحذير", "worning", function () {
            var statusFlag = $("#txt_OUT_StatusFlag" + RecNo).val();
            if (statusFlag == "i")
                $("#txt_OUT_StatusFlag" + RecNo).val("m");
            else
                $("#txt_OUT_StatusFlag" + RecNo).val("d");
            $("#No_OUT_Row" + RecNo).attr("hidden", "true");
        });
    }
    function AddNewRow2() {
        if (!SysSession.CurrentPrivileges.AddNew)
            return;
        var CanAdd = true;
        if (CountGrid2 > 0) {
            var LastRowNo = CountGrid2 - 1;
            CanAdd = Validation_Grid(LastRowNo);
        }
        if (CanAdd) {
            BuildControls2(CountGrid2);
            $("#txt_OUT_StatusFlag" + CountGrid2).val("i"); //In Insert mode
            //// can delete new inserted record  without need for delete privilage
            CountGrid2++;
        }
    }
    function BuildControls2(cnt) {
        var html = "";
        html = "<tr id= \"No_OUT_Row" + cnt + "\">\n                    <input id=\"txt_OUT_CollectDetailID" + cnt + "\" type=\"hidden\" class=\"form-control display_none\"  />\n                    <td>\n\t\t                <div class=\"form-group\">\n\t\t\t                <span id=\"btn_minus2" + cnt + "\"><i class=\"fas fa-minus-circle fs-4 btn-minus\"></i></span>\n\t\t                </div>\n\t                </td>\n                    <td>\n\t                    <div class=\"form-group\">\n\t\t                    <button type=\"button\" class=\"style_ButSearch\" id=\"btn_OUT_SearchItems" + cnt + "\" name=\"ColSearch\">\n\t\t                    <i class=\"fa fa-search  \"></i>\n\t\t                     </button>\n\t                    </div>\n                    </td>\n                   \n                    <td>\n\t\t                <div class=\"form-group\">\n                            <input id=\"txt_OUT_ItemCode" + cnt + "\" type=\"text\" class=\"form-control\" name=\"\"  />\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n                            <input id=\"txt_OUT_ItemName" + cnt + "\" type=\"text\" class=\"form-control\" name=\"\" disabled />\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n                            <input id=\"txt_OUT_Quantity" + cnt + "\" type=\"number\" class=\"form-control\" name=\"\"  />\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n                            <input id=\"txt_OUT_CostFactorPrc" + cnt + "\" type=\"number\" class=\"form-control\" name=\"\"  />\n\t\t                </div>\n\t                </td>\n                    \n               <input id=\"txt_OUT_StatusFlag" + cnt + "\" type=\"hidden\"   />\n               <input id=\"txt_OUT_ItemID" + cnt + "\" type=\"hidden\"   />\n               <input id=\"txt_OUT_GlobalCost" + cnt + "\" type=\"hidden\"   />\n               <input id=\"txt_OUT_UnitID" + cnt + "\" type=\"hidden\"   />\n               <input id=\"txt_OUT_StockOnhandQty" + cnt + "\" type=\"hidden\"   />\n               <input id=\"txt_OUT_StkUnitCost" + cnt + "\" type=\"hidden\"   />\n                </tr>";
        $("#div_Data2").append(html);
        $("#btn_OUT_SearchItems" + cnt).on('click', function () {
            btn_OUT_SrchItem_onclick(cnt);
        });
        $("#txt_OUT_ItemCode" + cnt).on('change', function () {
            txt_OUT_search_onchange(cnt);
        });
        $("#btn_minus2" + cnt).on('click', function () {
            DeleteRow2(cnt);
        });
        $("#txt_OUT_Quantity" + cnt).on('change', function () {
            if ($("#txt_OUT_StatusFlag" + cnt).val() != "i")
                $("#txt_OUT_StatusFlag" + cnt).val("u");
            //if (Number($("#txt_OUT_Quantity" + cnt).val()) > Number($("#txt_OUT_OnhandQty" + cnt).val())) {
            //    DisplayMassage("يجب ان تكون الكمبةالمدخلة اصغر من الكمية الفعلية ", "Quantity must be less than On hand Quantity", MessageType.Worning);
            //    Errorinput($("#txt_OUT_Quantity" + cnt));
            //    $("#txt_OUT_Quantity" + cnt).val("0");
            //}
        });
        $("#txt_OUT_CostFactorPrc" + cnt).on('change', function () {
            if ($("#txt_OUT_StatusFlag" + cnt).val() != "i")
                $("#txt_OUT_StatusFlag" + cnt).val("u");
        });
    }
    function Validation_Grid(rowcount) {
        if ($("#txt_StatusFlag" + rowcount).val() == "d" || $("#txt_StatusFlag" + rowcount).val() == "m") {
            return true;
        }
        else {
            if ($("#txtItemName" + rowcount).val() == "") {
                DisplayMassage('برجاء ادخال الصنف', 'Please enter the item', MessageType.Error);
                Errorinput($("#txtItemName" + rowcount));
                return false;
            }
            return true;
        }
    }
    //******************************************************Load*****************************************//
    function FillStore() {
        debugger;
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("DefStore", "GetAll"),
            data: {
                CompCode: Number(SysSession.CurrentEnvironment.CompCode),
                BranchCode: Number(SysSession.CurrentEnvironment.BranchCode),
                UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess == true) {
                    var Store = result.Response;
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
                        DocumentActions.FillComboFirstvalue(Store, drp_Store, "StoreId", "DescA", "- اختر -", null);
                    }
                    else {
                        DocumentActions.FillComboFirstvalue(Store, drp_Store, "StoreId", "DescL", "- Select -", null);
                    }
                }
            }
        });
    }
    //***************************************************Main function************************************//
    function btnSave_onclick() {
        loading('btnsave');
        setTimeout(function () {
            finishSave('btnsave');
            debugger;
            if (!Validation())
                return;
            if (hd_CollectID.value == "0")
                Insert();
            else
                Update();
        }, 100);
    }
    function btnAdd_onclick() {
        debugger;
        if (!SysSession.CurrentPrivileges.AddNew)
            return;
        $("#divTransferDetails").removeClass("display_none");
        Clear();
        EnableControls();
        $("#btnSave").removeClass("display_none");
        $("#btnUpdate").addClass("display_none");
        $("#btnPrintTransaction").addClass("display_none");
        $("#btnBack").removeClass("display_none");
        chkStatus.disabled = false;
        $(".text_off").prop("disabled", true);
        btndiv_1_onclick();
        $("#btnAddDetails").removeClass("display_none");
        $("#btnAddDetails2").removeClass("display_none");
    }
    function btnUpdate_onclick() {
        if (!SysSession.CurrentPrivileges.EDIT)
            return;
        EnableControls();
        $("#btnSave").removeClass("display_none");
        $("#btnBack").removeClass("display_none");
        $("#btnUpdate").addClass("display_none");
        $("#btnPrintTransaction").addClass("display_none");
        $("#btnReCalculate").removeClass("display_none");
        $(".text_off").prop("disabled", true);
        $("#btnAddDetails").removeClass("display_none");
        $("#btnAddDetails2").removeClass("display_none");
    }
    function btnBack_onclick() {
        backflag = true;
        if (hd_CollectID.value != "0") {
            var selectedid = hd_CollectID.value;
            Clear();
            hd_CollectID.value = selectedid;
            Display();
            QueryMode();
            btnUpdate.disabled = false;
        }
        else {
            Clear();
            Searchprocess();
            $("#btnSave").addClass("display_none");
            $("#btnBack").addClass("display_none");
            $("#btnUpdate").addClass("display_none");
            $("#btnPrintTransaction").addClass("display_none");
        }
        $("#div_hedr").removeClass("disabledDiv");
        $("#div_hedr").removeAttr("disabled").off('click');
        $("#divIconbar").removeClass("disabledIconbar");
        $("#divIconbar").removeAttr("disabled").off('click');
        $("#btnAddDetails").addClass("display_none");
        $("#btnAddDetails2").addClass("display_none");
    }
    function chkStatus_onchange() {
        if (Model.Status == 1)
            open();
    }
    //***************************************************Search******************************************//
    function btnShow_onclick() {
        debugger;
        Search();
    }
    function Search() {
        $('#divTransferDetails').addClass('display_none');
        var condition = " CompCode=" + Number(SysSession.CurrentEnvironment.CompCode) + " and BranchCode=" + Number(SysSession.CurrentEnvironment.BranchCode);
        var startdate = "";
        var Enddate = "";
        if (drp_Store.value != "null" && drp_Store.value != "")
            condition = condition + " and StoreID=" + drp_Store.value + "";
        if (ddlstatus.value != "null" && ddlstatus.value != "")
            condition = condition + " and Status=" + ddlstatus.value;
        if (txtFromDate.value != "")
            startdate = DateFormatRep(txtFromDate.value);
        if (txtToDate.value != "")
            Enddate = DateFormatRep(txtToDate.value);
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("Collect", "Search"),
            data: {
                condition: condition,
                strtdt: startdate, Enddt: Enddate,
                UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    CollectList = result.Response;
                    for (var i = 0; i < CollectList.length; i++) {
                        CollectList[i].TrDate = DateFormat(CollectList[i].TrDate);
                        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar")
                            if (CollectList[i].Status == 1)
                                CollectList[i].status_txt = "معتمد";
                            else if (CollectList[i].Status == 0)
                                CollectList[i].status_txt = "غير معتمد";
                        if (SysSession.CurrentEnvironment.ScreenLanguage == "en")
                            if (CollectList[i].Status == 1)
                                CollectList[i].status_txt = "Authorized";
                            else if (CollectList[i].Status == 0)
                                CollectList[i].status_txt = "UnAuthorized";
                    }
                    Grid.DataSource = CollectList;
                    Grid.Bind();
                    $("#searchtext").removeClass("display_none");
                    $("#divShow").removeClass("display_none");
                    $("#cotrolDiv").removeClass("disabledDiv");
                    $("#btnUpdate").addClass("display_none");
                    $("#btnPrintTransaction").addClass("display_none");
                }
            }
        });
    }
    function btnSrchItem_onclick(cnt) {
        debugger;
        var cond;
        cond = "";
        cond = " CompCode=" + SysSession.CurrentEnvironment.CompCode + " and BraCode=" + SysSession.CurrentEnvironment.BranchCode;
        cond = cond + " and StoreId=" + drp_Store.value;
        sys.FindKey(Modules.CollectUnit, "btnSearchItem", cond, function () {
            var id = SearchGrid.SearchDataGrid.SelectedKey;
            if (!validationitem(id, Number($("#txt_ItemID" + cnt + "").val()))) {
                $("#txt_OUT_ItemCode" + cnt).val('');
                return;
            }
            Ajax.Callsync({
                type: "Get",
                url: sys.apiUrl("StkDefItemType", "GetAllItembyItemId"),
                data: {
                    CompCode: Number(SysSession.CurrentEnvironment.CompCode), UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token,
                    itemid: id, BranchCode: Number(SysSession.CurrentEnvironment.BranchCode)
                },
                success: function (d) {
                    var result = d;
                    if (result.IsSuccess) {
                        var res = result.Response;
                        $("#txtItemCode" + cnt).val(res.ItemCode);
                        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
                            $("#txtItemName" + cnt).val(res.Itm_DescA);
                            $("#txt_u_DescA" + cnt).val(res.Uom_DescA);
                        }
                        else {
                            $("#txtItemName" + cnt).val(res.Itm_DescE);
                            $("#txt_u_DescA" + cnt).val(res.Uom_DescE);
                        }
                        //**hidden values
                        $("#txt_ItemID" + cnt).val(res.ItemID);
                        $("#txt_OnhandQty" + cnt).val(res.OnhandQty);
                        $("#txt_GlobalCost" + cnt).val(res.GlobalCost);
                        $("#txt_UnitID" + cnt).val(res.UomID);
                        $("#txt_StockOnhandQty" + cnt).val(res.OnhandQty);
                        if (SysSession.CurrentEnvironment.I_Control[0].IsLocalCost == false) {
                            $("#txt_StkUnitCost" + cnt).prop("value", res.GlobalCost);
                        }
                        else {
                            $("#txt_StkUnitCost" + cnt).prop("value", res.LocalCost);
                        }
                        if ($("#txt_StatusFlag" + cnt).val() != "i")
                            $("#txt_StatusFlag" + cnt).val("u");
                    }
                }
            });
        });
    }
    function btn_OUT_SrchItem_onclick(cnt) {
        debugger;
        var cond;
        cond = "";
        cond = " CompCode=" + SysSession.CurrentEnvironment.CompCode + " and BraCode=" + SysSession.CurrentEnvironment.BranchCode;
        cond = cond + " and StoreId=" + drp_Store.value;
        sys.FindKey(Modules.CollectUnit, "btn_OUT_SrchItem", cond, function () {
            var id = SearchGrid.SearchDataGrid.SelectedKey;
            if (!validationitem2(id, Number($("#txt_OUT_ItemID" + cnt + "").val()))) {
                $("#txt_OUT_ItemCode" + cnt).val('');
                return;
            }
            Ajax.Callsync({
                type: "Get",
                url: sys.apiUrl("StkDefItemType", "GetAllItembyItemId"),
                data: {
                    CompCode: Number(SysSession.CurrentEnvironment.CompCode), UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token,
                    itemid: id, BranchCode: Number(SysSession.CurrentEnvironment.BranchCode)
                },
                success: function (d) {
                    var result = d;
                    if (result.IsSuccess) {
                        var res = result.Response;
                        $("#txt_OUT_ItemCode" + cnt).val(res.ItemCode);
                        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar")
                            $("#txt_OUT_ItemName" + cnt).val(res.Itm_DescA);
                        else
                            $("#txt_OUT_ItemName" + cnt).val(res.Itm_DescE);
                        //**hidden values
                        $("#txt_OUT_ItemID" + cnt).val(res.ItemID);
                        $("#txt_OUT_OnhandQty" + cnt).val(res.OnhandQty);
                        $("#txt_OUT_GlobalCost" + cnt).val(res.GlobalCost);
                        $("#txt_OUT_UnitID" + cnt).val(res.UomID);
                        $("#txt_OUT_StockOnhandQty" + cnt).val(res.OnhandQty);
                        $("#txt_OUT_StkUnitCost" + cnt).val(res.GlobalCost);
                        if ($("#txt_OUT_StatusFlag" + cnt).val() != "i")
                            $("#txt_OUT_StatusFlag" + cnt).val("u");
                    }
                }
            });
        });
    }
    function txt_search_onchange(cnt) {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("StkDefItemType", "GetAllItembyItemCode"),
            data: {
                CompCode: Number(SysSession.CurrentEnvironment.CompCode), UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token,
                itemcode: $("#txtItemCode" + cnt).val(), BranchCode: Number(SysSession.CurrentEnvironment.BranchCode)
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    var res = result.Response;
                    if (res != null) {
                        if (!validationitem(res.ItemID, cnt)) {
                            $("#txtItemCode" + cnt).val('');
                            return;
                        }
                        $("#txtItemCode" + cnt).val(res.ItemCode);
                        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
                            $("#txtItemName" + cnt).val(res.Itm_DescA);
                            $("#txt_u_DescA" + cnt).val(res.Uom_DescA);
                        }
                        else {
                            $("#txtItemName" + cnt).val(res.Itm_DescE);
                            $("#txt_u_DescA" + cnt).val(res.Uom_DescE);
                        }
                        //**hidden values
                        $("#txt_ItemID" + cnt).val(res.ItemID);
                        $("#txt_OnhandQty" + cnt).val(res.OnhandQty);
                        $("#txt_GlobalCost" + cnt).val(res.GlobalCost);
                        $("#txt_UnitID" + cnt).val(res.UomID);
                        $("#txt_StockOnhandQty" + cnt).val(res.OnhandQty);
                        if (SysSession.CurrentEnvironment.I_Control[0].IsLocalCost == false) {
                            $("#txt_StkUnitCost" + cnt).prop("value", res.GlobalCost);
                        }
                        else {
                            $("#txt_StkUnitCost" + cnt).prop("value", res.LocalCost);
                        }
                        if ($("#txt_StatusFlag" + cnt).val() != "i")
                            $("#txt_StatusFlag" + cnt).val("u");
                    }
                    else {
                        $("#txtItemCode" + cnt).val("");
                        $("#txtItemName" + cnt).val("");
                        $("#txt_ItemID" + cnt).val("");
                        $("#txt_OnhandQty" + cnt).val("");
                        $("#txt_GlobalCost" + cnt).val("");
                        $("#txt_UnitID" + cnt).val("");
                        $("#txt_StockOnhandQty" + cnt).val("");
                        $("#txt_StkUnitCost" + cnt).val("");
                        if ($("#txt_StatusFlag" + cnt).val() != "i")
                            $("#txt_StatusFlag" + cnt).val("u");
                    }
                }
            }
        });
    }
    function txt_OUT_search_onchange(cnt) {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("StkDefItemType", "GetAllItembyItemCode"),
            data: {
                CompCode: Number(SysSession.CurrentEnvironment.CompCode), UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token,
                itemcode: $("#txt_OUT_ItemCode" + cnt).val(), BranchCode: Number(SysSession.CurrentEnvironment.BranchCode)
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    var res = result.Response;
                    debugger;
                    if (res != null) {
                        if (!validationitem2(res.ItemID, cnt)) {
                            $("#txt_OUT_ItemCode" + cnt).val('');
                            return;
                        }
                        $("#txt_OUT_ItemCode" + cnt).val(res.ItemCode);
                        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar")
                            $("#txt_OUT_ItemName" + cnt).val(res.Itm_DescA);
                        else
                            $("#txt_OUT_ItemName" + cnt).val(res.Itm_DescE);
                        //**hidden values
                        $("#txt_OUT_ItemID" + cnt).val(res.ItemID);
                        $("#txt_OUT_OnhandQty" + cnt).val(res.OnhandQty);
                        $("#txt_OUT_GlobalCost" + cnt).val(res.GlobalCost);
                        $("#txt_OUT_UnitID" + cnt).val(res.UomID);
                        $("#txt_OUT_StockOnhandQty" + cnt).val(res.OnhandQty);
                        $("#txt_OUT_StkUnitCost" + cnt).val(res.GlobalCost);
                        if ($("#txt_OUT_StatusFlag" + cnt).val() != "i")
                            $("#txt_OUT_StatusFlag" + cnt).val("u");
                    }
                    else {
                        $("#txt_OUT_ItemCode" + cnt).val("");
                        $("#txt_OUT_ItemName" + cnt).val("");
                        $("#txt_OUT_ItemID" + cnt).val("");
                        $("#txt_OUT_OnhandQty" + cnt).val("");
                        $("#txt_OUT_GlobalCost" + cnt).val("");
                        $("#txt_OUT_UnitID" + cnt).val("");
                        $("#txt_OUT_StockOnhandQty" + cnt).val("");
                        $("#txt_OUT_StkUnitCost" + cnt).val("");
                        if ($("#txt_OUT_StatusFlag" + cnt).val() != "i")
                            $("#txt_OUT_StatusFlag" + cnt).val("u");
                    }
                }
            }
        });
    }
    //*************************************************Display******************************************//
    function Grid_RowDoubleClicked() {
        $("#DivInvoiceData").removeClass("display_none");
        hd_CollectID.value = Grid.SelectedKey;
        //GlobalInvoiceID = Number(Grid.SelectedKey);
        backflag = false;
        btnPrintTransaction.disabled = false;
        Display();
        QueryMode();
        //*****Privillage
        checkprivialges();
        if (Model.Status == 1) {
            chkStatus.checked = true;
            chkprivialgesToEditApprovedInvoice();
        }
        else {
            chkStatus.checked = false;
            btnUpdate.disabled = !SysSession.CurrentPrivileges.EDIT;
            chkStatus.disabled = true;
        }
        $("#btnAddDetails").addClass("display_none");
        $("#btnAddDetails2").addClass("display_none");
    }
    function Display() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("Collect", "GetAllDatabyId"),
            data: {
                COMP_CODE: Number(SysSession.CurrentEnvironment.CompCode),
                BRA_CODE: Number(SysSession.CurrentEnvironment.BranchCode),
                UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token,
                Id: Number(hd_CollectID.value),
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    var res = result.Response;
                    DisplayMaster(res.I_TR_Collect);
                    DisplayDetails(res.IQ_GetCollectDetail);
                    $('#divTransferDetails').removeClass('display_none');
                    if (backflag == false) {
                        btndiv_1_onclick();
                    }
                    //*****Privillage
                    checkprivialges();
                    if (Model.Status == 1) {
                        chkStatus.checked = true;
                        chkprivialgesToEditApprovedInvoice();
                    }
                    else {
                        chkStatus.checked = false;
                        btnUpdate.disabled = !SysSession.CurrentPrivileges.EDIT;
                        chkStatus.disabled = true;
                    }
                }
            }
        });
        btnUpdate.disabled = false;
    }
    function DisplayMaster(collectMaster) {
        Model.Status = collectMaster.Status;
        DocumentActions.RenderFromModel(collectMaster);
        txtTransferDate.value = DateFormat(collectMaster.TrDate);
    }
    function DisplayDetails(CollectDet) {
        debugger;
        CountGrid = 0;
        CountGrid2 = 0;
        $("#div_Data").html("");
        $("#div_Data2").html("");
        var CollectDet_Input = CollectDet.filter(function (x) { return x.IsInput == true; });
        var CollectDet_Output = CollectDet.filter(function (x) { return x.IsInput == false; });
        //**********Input Details
        for (var cnt = 0; cnt < CollectDet_Input.length; cnt++) {
            BuildControls(cnt);
            $("#txtCollectDetailID" + cnt).val(CollectDet_Input[cnt].CollectDetailID);
            $("#txtItemCode" + cnt).val(CollectDet_Input[cnt].ItemCode);
            if (SysSession.CurrentEnvironment.ScreenLanguage == "ar")
                $("#txtItemName" + cnt).val(CollectDet_Input[cnt].itm_DescA);
            else
                $("#txtItemName" + cnt).val(CollectDet_Input[cnt].itm_DescA);
            //**hidden values
            $("#txt_ItemID" + cnt).val(CollectDet_Input[cnt].ItemID);
            $("#txt_StatusFlag" + cnt).val("");
            $("#txt_OnhandQty" + cnt).val(CollectDet_Input[cnt].OnhandQty);
            $("#txt_GlobalCost" + cnt).val(CollectDet_Input[cnt].UnitCost);
            $("#txt_UnitID" + cnt).val(CollectDet_Input[cnt].UnitID);
            $("#txt_StockOnhandQty" + cnt).val(CollectDet_Input[cnt].StockOnhandQty);
            $("#txt_StkUnitCost" + cnt).val(CollectDet_Input[cnt].StkUnitCost);
            $("#txt_u_DescA" + cnt).val(CollectDet_Input[cnt].u_DescA);
            $("#txtQuantity" + cnt).val(CollectDet_Input[cnt].Qty);
            CountGrid++;
        }
        //**********Output Details
        for (var cnt = 0; cnt < CollectDet_Output.length; cnt++) {
            BuildControls2(cnt);
            $("#txt_OUT_CollectDetailID" + cnt).val(CollectDet_Output[cnt].CollectDetailID);
            $("#txt_OUT_ItemCode" + cnt).val(CollectDet_Output[cnt].ItemCode);
            if (SysSession.CurrentEnvironment.ScreenLanguage == "ar")
                $("#txt_OUT_ItemName" + cnt).val(CollectDet_Output[cnt].itm_DescA);
            else
                $("#txt_OUT_ItemName" + cnt).val(CollectDet_Output[cnt].itm_DescA);
            //**hidden values
            $("#txt_OUT_ItemID" + cnt).val(CollectDet_Output[cnt].ItemID);
            $("#txt_OUT_StatusFlag" + cnt).val("");
            $("#txt_OUT_OnhandQty" + cnt).val(CollectDet_Output[cnt].OnhandQty);
            $("#txt_OUT_GlobalCost" + cnt).val(CollectDet_Output[cnt].UnitCost);
            $("#txt_OUT_UnitID" + cnt).val(CollectDet_Output[cnt].UnitID);
            $("#txt_OUT_StockOnhandQty" + cnt).val(CollectDet_Output[cnt].StockOnhandQty);
            $("#txt_OUT_StkUnitCost" + cnt).val(CollectDet_Output[cnt].StkUnitCost);
            $("#txt_OUT_Quantity" + cnt).val(CollectDet_Output[cnt].Qty);
            $("#txt_OUT_CostFactorPrc" + cnt).val(CollectDet_Output[cnt].CostFactorPrc);
            CountGrid2++;
        }
    }
    //*********************************************functions*******************************************//
    function checkprivialges() {
        debugger;
        // لو ليه صلاحية او فك الاعتماد هيكون مفنوح
        if (SysSession.CurrentPrivileges.CUSTOM1 || SysSession.CurrentPrivileges.CUSTOM2) {
            chkStatus.disabled = false;
        }
        else {
            chkStatus.disabled = true;
        }
    }
    function QueryMode() {
        debugger;
        $("#divTransferDetails :input").prop("disabled", true);
        $("#divInputs :input").prop("disabled", true);
        $("#divGridDetails").removeClass("disabledDiv");
        $("#btnAddDetails").addClass("disabledplus");
        $("#btnAddDetails2").addClass("disabledplus");
        $("#btnSave").addClass("display_none");
        $("#btnUpdate").removeClass("display_none");
        $("#btnPrintTransaction").removeClass("display_none");
        $("#btnBack").addClass("display_none");
        $(".glyphicon-minus-sign").addClass("display_none");
        $("#divOutputs :input").prop("disabled", true);
        $("#div_Data2 :input").prop("disabled", true);
        $(".text_off").prop("disabled", true);
        btnUpdate.disabled = false;
    }
    function Searchprocess() {
        Clear();
        Search();
        QueryMode();
    }
    function Clear() {
        $("#divTransferDetails :input").val("");
        $("#div_Data2 :input").val("");
        $("#divInputs :input").val("");
        txtLabourCost.value = "0";
        $("#txtMaterialCost").val("0");
        txtTransferDate.value = DateFormat(Date().toString());
        Model = new I_TR_Collect();
        ModelCollectDet = new Array();
        CollectMasterDetail = new ICollectMasterDetails();
        hd_CollectID.value = "0";
    }
    function EnableControls() {
        $("#divTransferDetails :input").prop("disabled", false);
        $("#divGridDetails").addClass("disabledDiv");
        $("#divGridDetails").attr("disabled", "disabled").off('click');
        $("#div_hedr").addClass("disabledDiv");
        $("#div_hedr").attr("disabled", "disabled").off('click');
        $("#divIconbar").addClass("disabledIconbar");
        $("#divIconbar").attr("disabled", "disabled").off('click');
        $("#btnAddDetails").removeClass("disabledplus");
        $("#btnAddDetails2").removeClass("disabledplus");
        $("#divInputs :input").prop("disabled", false);
        $("#divOutputs :input").prop("disabled", false);
        txtTrNo.disabled = true;
        $(".glyphicon-minus-sign").removeClass("display_none");
        $("#txtCreatedBy").attr("disabled", "disabled");
        $("#txtCreatedAt").attr("disabled", "disabled");
        $("#txtUpdatedBy").attr("disabled", "disabled");
        $("#txtUpdatedAt").attr("disabled", "disabled");
    }
    function Validation() {
        debugger;
        if ($("#drp_Store").val() == "" || $("#drp_Store").val() == "null") {
            DisplayMassage(" برجاء ادخال المستودع ", "Please Enter Store", MessageType.Worning);
            Errorinput(drp_Store);
            return false;
        }
        if ($("#txtTransferDate").val() == "") {
            DisplayMassage(" برجاء ادخال تاريخ الحركة ", "Please Enter Date", MessageType.Worning);
            Errorinput(txtTransferDate);
            return false;
        }
        if ($("#txtLabourCost").val() == "") {
            DisplayMassage(" برجاء ادخال تكلفة العمالة", "Please Enter Labour Cost", MessageType.Worning);
            Errorinput(txtLabourCost);
            return false;
        }
        if ($("#txtMaterialCost").val() == "") {
            DisplayMassage(" برجاء ادخال تكلفة المواد ", "Please Enter Material Cost", MessageType.Worning);
            Errorinput(txtMaterialCost);
            return false;
        }
        //********************
        if (CountGrid == 0) {
            DisplayMassage("ادخل بيانات المدخلات", "Enter Inputs Data", MessageType.Error);
            return false;
        }
        //********************
        if (CountGrid2 == 0) {
            DisplayMassage("ادخل بيانات المخرجات", "Enter Outputs Data", MessageType.Error);
            return false;
        }
        //******************
        if (!CheckPeriodDate(txtTransferDate.value, "I")) {
            debugger;
            DisplayMassage("لا يمكنك الاضافه او التعديل في هذة الفتره المغلقه ", "Please select a Invoice data", MessageType.Error);
            Errorinput(txtTransferDate);
            return false;
        }
        var Prc = 0;
        for (var i = 0; i < CountGrid2; i++) {
            if ($("#txt_OUT_StatusFlag" + i).val() != "d" && $("#txt_OUT_StatusFlag" + i).val() != "m") {
                Prc = Prc + Number($("#txt_OUT_CostFactorPrc" + i + "").val());
            }
        }
        if (Prc != 100) {
            DisplayMassage("لابد ان يكون مجموع نسبة التكلفة للمخرجات بساوى 100", "The Summetion of Cost Prescentage must equal 100", MessageType.Error);
            Errorinput($("#txt_OUT_CostFactorPrc" + i + "").val());
            return false;
        }
        return true;
    }
    function chkprivialgesToEditApprovedInvoice() {
        if (SysSession.CurrentPrivileges.CUSTOM2 == false) {
            chkStatus.disabled = true;
            btnUpdate.disabled = true;
        }
        else {
            chkStatus.disabled = false;
            btnUpdate.disabled = true;
        }
    }
    function Assign() {
        DocumentActions.AssignToModel(Model);
        Model.StoreID = Number(drp_Store.value);
        Model.Status = Number(chkStatus.checked);
        Model.CompCode = Number(SysSession.CurrentEnvironment.CompCode);
        Model.BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);
        Model.UserCode = SysSession.CurrentEnvironment.UserCode;
        Model.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
        Model.TrDate = txtTransferDate.value;
        Model.TrDateH = convertToH(txtTransferDate.value); //==========???error
    }
    function AssignInputdetails() {
        debugger;
        ModelCollectDet == new Array();
        var det;
        var StatusFlag;
        // Details
        for (var i = 0; i < CountGrid; i++) {
            det = new I_TR_CollectDetail();
            StatusFlag = $("#txt_StatusFlag" + i).val();
            if (StatusFlag == "i") {
                det.ItemID = Number($("#txt_ItemID" + i).val());
                det.IsInput = true;
                det.UnitID = Number($("#txt_UnitID" + i).val());
                det.OnhandQty = Number($("#txt_OnhandQty" + i).val());
                det.UnitCost = Number($("#txt_GlobalCost" + i).val());
                det.StockOnhandQty = Number($("#txt_StockOnhandQty" + i).val());
                det.StkUnitCost = Number($("#txt_StkUnitCost" + i).val());
                det.StockQty = Number($("#txtQuantity" + i).val());
                det.Qty = Number($("#txtQuantity" + i).val());
                det.CollectDetailID = Number($("#txtCollectDetailID" + i).val());
                det.CollectID = Number(hd_CollectID.value);
                det.StatusFlag = $("#txt_StatusFlag" + i).val();
                det.StatusFlag = StatusFlag;
                ModelCollectDet.push(det);
            }
            if (StatusFlag == "u") {
                det.ItemID = Number($("#txt_ItemID" + i).val());
                det.IsInput = true;
                det.UnitID = Number($("#txt_UnitID" + i).val());
                det.OnhandQty = Number($("#txt_OnhandQty" + i).val());
                det.UnitCost = Number($("#txt_GlobalCost" + i).val());
                det.StockOnhandQty = Number($("#txt_StockOnhandQty" + i).val());
                det.StkUnitCost = Number($("#txt_StkUnitCost" + i).val());
                det.StockQty = Number($("#txtQuantity" + i).val());
                det.Qty = Number($("#txtQuantity" + i).val());
                det.CollectDetailID = Number($("#txtCollectDetailID" + i).val());
                det.CollectID = Number(hd_CollectID.value);
                det.StatusFlag = $("#txt_StatusFlag" + i).val();
                det.StatusFlag = StatusFlag;
                ModelCollectDet.push(det);
            }
            if (StatusFlag == "d") {
                if ($("#txt_ItemID" + i).val() != "") {
                    det.ItemID = Number($("#txt_ItemID" + i).val());
                    det.UnitID = Number($("#txt_UnitID" + i).val());
                    det.CollectDetailID = Number($("#txtCollectDetailID" + i).val());
                    det.CollectID = Number(hd_CollectID.value);
                    det.StatusFlag = StatusFlag;
                    ModelCollectDet.push(det);
                }
            }
        }
    }
    function AssignOutputdetails() {
        debugger;
        var det;
        var StatusFlag;
        // Details
        for (var i = 0; i < CountGrid2; i++) {
            det = new I_TR_CollectDetail();
            StatusFlag = $("#txt_OUT_StatusFlag" + i).val();
            if (StatusFlag == "i") {
                det.ItemID = Number($("#txt_OUT_ItemID" + i).val());
                det.IsInput = false;
                det.UnitID = Number($("#txt_OUT_UnitID" + i).val());
                det.OnhandQty = Number($("#txt_OUT_OnhandQty" + i).val());
                det.UnitCost = Number($("#txt_OUT_GlobalCost" + i).val());
                det.StockOnhandQty = Number($("#txt_OUT_StockOnhandQty" + i).val());
                det.StkUnitCost = Number($("#txt_OUT_StkUnitCost" + i).val());
                det.StockQty = Number($("#txt_OUT_Quantity" + i).val());
                det.Qty = Number($("#txt_OUT_Quantity" + i).val());
                det.CostFactorPrc = Number($("#txt_OUT_CostFactorPrc" + i).val());
                det.CollectDetailID = Number($("#txt_OUT_CollectDetailID" + i).val());
                det.CollectID = Number(hd_CollectID.value);
                det.StatusFlag = StatusFlag;
                ModelCollectDet.push(det);
            }
            if (StatusFlag == "u") {
                det.ItemID = Number($("#txt_OUT_ItemID" + i).val());
                det.IsInput = false;
                det.UnitID = Number($("#txt_OUT_UnitID" + i).val());
                det.OnhandQty = Number($("#txt_OUT_OnhandQty" + i).val());
                det.UnitCost = Number($("#txt_OUT_GlobalCost" + i).val());
                det.StockOnhandQty = Number($("#txt_OUT_StockOnhandQty" + i).val());
                det.StkUnitCost = Number($("#txt_OUT_StkUnitCost" + i).val());
                det.StockQty = Number($("#txt_OUT_Quantity" + i).val());
                det.Qty = Number($("#txt_OUT_Quantity" + i).val());
                det.CostFactorPrc = Number($("#txt_OUT_CostFactorPrc" + i).val());
                det.CollectDetailID = Number($("#txt_OUT_CollectDetailID" + i).val());
                det.CollectID = Number(hd_CollectID.value);
                det.StatusFlag = StatusFlag;
                ModelCollectDet.push(det);
            }
            if (StatusFlag == "d") {
                if ($("#txt_OUT_ItemID" + i).val() != "") {
                    det.ItemID = Number($("#txt_OUT_ItemID" + i).val());
                    det.IsInput = false;
                    det.UnitID = Number($("#txt_OUT_UnitID" + i).val());
                    det.OnhandQty = Number($("#txt_OUT_OnhandQty" + i).val());
                    det.UnitCost = Number($("#txt_OUT_GlobalCost" + i).val());
                    det.StockOnhandQty = Number($("#txt_OUT_StockOnhandQty" + i).val());
                    det.StkUnitCost = Number($("#txt_OUT_StkUnitCost" + i).val());
                    det.StockQty = Number($("#txt_OUT_Quantity" + i).val());
                    det.Qty = Number($("#txt_OUT_Quantity" + i).val());
                    det.CostFactorPrc = Number($("#txt_OUT_CostFactorPrc" + i).val());
                    det.CollectDetailID = Number($("#txt_OUT_CollectDetailID" + i).val());
                    det.CollectID = Number(hd_CollectID.value);
                    det.StatusFlag = StatusFlag;
                    ModelCollectDet.push(det);
                }
            }
        }
    }
    function Insert() {
        Assign();
        AssignInputdetails();
        AssignOutputdetails();
        Model.CollectID = 0;
        Model.CreatedAt = DateTimeFormat(Date().toString());
        Model.CreatedBy = SysSession.CurrentEnvironment.UserCode;
        Model.TrNo = null;
        CollectMasterDetail.I_TR_Collect = Model;
        CollectMasterDetail.I_TR_CollectDetail = ModelCollectDet;
        Ajax.Callsync({
            type: "post",
            url: sys.apiUrl("Collect", "InsertAll"),
            data: JSON.stringify(CollectMasterDetail),
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    Model = result.Response;
                    DateSetsSccess("txtTransferDate", "txtFromDate", "txtToDate");
                    DisplayMassage("تم الحفظ", "Saved Succesfully", MessageType.Succeed);
                    gloplCollectID = Model.CollectID;
                    Success();
                    Save_Succ_But();
                }
            }
        });
    }
    function Update() {
        debugger;
        Assign();
        AssignInputdetails();
        AssignOutputdetails();
        Model.CollectID = Number(hd_CollectID.value);
        Model.UpdatedAt = DateTimeFormat(Date().toString());
        Model.UpdatedBy = SysSession.CurrentEnvironment.UserCode;
        CollectMasterDetail.I_TR_Collect = Model;
        CollectMasterDetail.I_TR_CollectDetail = ModelCollectDet;
        Ajax.Callsync({
            type: "post",
            url: sys.apiUrl("Collect", "UpdateALL"),
            data: JSON.stringify(CollectMasterDetail),
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    Model = result.Response;
                    DateSetsSccess("txtTransferDate", "txtFromDate", "txtToDate");
                    DisplayMassage("تم التعديل", "Saved Succesfully", MessageType.Succeed);
                    gloplCollectID = Model.CollectID;
                    Success();
                    Save_Succ_But();
                }
            }
        });
    }
    function Success() {
        Searchprocess();
        $("#DivInvoiceData").removeClass("display_none");
        hd_CollectID.value = gloplCollectID.toString();
        //GlobalInvoiceID = Number(Grid.SelectedKey);
        backflag = false;
        btnPrintTransaction.disabled = false;
        Display();
        QueryMode();
        //*****Privillage
        checkprivialges();
        if (Model.Status == 1) {
            chkStatus.checked = true;
            chkprivialgesToEditApprovedInvoice();
        }
        else {
            chkStatus.checked = false;
            btnUpdate.disabled = !SysSession.CurrentPrivileges.EDIT;
            chkStatus.disabled = true;
        }
        $("#btnAddDetails").addClass("display_none");
        $("#btnAddDetails2").addClass("display_none");
        $("#div_hedr").removeClass("disabledDiv");
        $("#div_hedr").removeAttr("disabled").off('click');
        $("#divIconbar").removeClass("disabledIconbar");
        $("#divIconbar").removeAttr("disabled").off('click');
    }
    function open() {
        if (!CheckPeriodDate(txtTransferDate.value, "I")) {
            debugger;
            DisplayMassage("لا يمكنك الاضافه او التعديل في هذة الفتره المغلقه ", "Please select a Invoice data", MessageType.Error);
            Errorinput(txtTransferDate);
            chkStatus.checked = true;
            return false;
        }
        Assign();
        Model.Status = 0;
        Model.UpdatedAt = DateTimeFormat(Date().toString());
        Model.UpdatedBy = SysSession.CurrentEnvironment.UserCode;
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("Collect", "Open"),
            data: JSON.stringify(Model),
            success: function (d) {
                var result = d;
                if (result.IsSuccess == true) {
                    Model = result.Response;
                    DisplayMassage("تم فك الاعتماد", "Saved Succesfully", MessageType.Succeed);
                    gloplCollectID = Model.CollectID;
                    Success();
                }
            }
        });
    }
    //******************************************Print**********************************************//
    function PrintTransaction() {
        if (!SysSession.CurrentPrivileges.PrintOut)
            return;
        var rp = new ReportParameters();
        rp.TRId = Number(hd_CollectID.value);
        rp.Name_function = "IProc_Prnt_Collect";
        localStorage.setItem("Report_Data", JSON.stringify(rp));
        localStorage.setItem("result", '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>');
        window.open(Url.Action("ReportsPopup", "Home"), "_blank");
    }
    function PrintReport(OutType) {
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
        if (drp_Store.value == "null") {
            rp.storeID = -1;
        }
        else {
            rp.storeID = Number($("#drp_Store").val());
        }
        if (ddlstatus.value == "null") {
            rp.Status = 2;
        }
        else {
            rp.Status = $("#ddlstatus").val();
        }
        Ajax.Callsync({
            url: Url.Action("IProc_Rep_CollectList", "GeneralReports"),
            data: rp,
            success: function (d) {
                var result = d.result;
                window.open(result, "_blank");
            }
        });
    }
    CollectUnit.PrintReport = PrintReport;
    function btndiv_1_onclick() {
        $("#btndiv_1").addClass("btn-active");
        $("#btndiv_11").removeClass("btn-main");
        //Edit
        $("#btndiv_2").removeClass("btn-active");
        $("#btndiv_22").addClass("btn-main");
        //Edit
        $("#div_1").removeClass("display_none");
        $("#div_2").addClass("display_none");
    }
    function btndiv_2_onclick() {
        $("#btndiv_1").removeClass("btn-active");
        $("#btndiv_11").addClass("btn-main");
        //Edit
        $("#btndiv_2").addClass("btn-active");
        $("#btndiv_22").removeClass("btn-main");
        //Edit
        $("#div_1").addClass("display_none");
        $("#div_2").removeClass("display_none");
    }
})(CollectUnit || (CollectUnit = {}));
//# sourceMappingURL=CollectUnit.js.map