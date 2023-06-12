
$(document).ready(() => {
    CollectUnit.InitalizeComponent();
})

namespace CollectUnit {
    var sys: SystemTools = new SystemTools();
    var SysSession: SystemSession = GetSystemSession(Modules.CollectUnit);
    var compcode: Number;
    var Branch: Number;
    var startDate: string;
    var EndDate: string;
    var FinYear: number;
    var Grid: JsGrid = new JsGrid();
    var MasterDetailModel: StockAdjustMasterDetails = new StockAdjustMasterDetails();
    var txtFromDate: HTMLInputElement;
    var txtToDate: HTMLInputElement;
    var txtTransferDate: HTMLInputElement;
    var txtTrNo: HTMLInputElement;
    var txtLabourCost: HTMLInputElement;
    var searchbutmemreport: HTMLInputElement;
    var txtCreatedBy: HTMLInputElement;
    var txtCreatedAt: HTMLInputElement;
    var txtUpdatedBy: HTMLInputElement;
    var txtUpdatedAt: HTMLInputElement;
    var txtSearch: HTMLInputElement;
    var txtRemarks: HTMLInputElement;
    var btnShow: HTMLButtonElement;
    var btnAdd: HTMLButtonElement;
    var btnUpdate: HTMLButtonElement;
    var btnSave: HTMLButtonElement;
    var btnBack: HTMLButtonElement;
    var btnAddDetails: HTMLButtonElement;
    var btnLoad: HTMLButtonElement;
    var CountGrid: number = 0;
    var btnPrintTrview: HTMLButtonElement;
    var btnPrintTrPDF: HTMLButtonElement;
    var btnPrintTrEXEL: HTMLButtonElement;
    var btnPrint: HTMLButtonElement;
    var btnPrintTransaction: HTMLButtonElement;
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);
    var drp_CollType: HTMLSelectElement;
    var Filtr_CollType: HTMLSelectElement;
    var drpPaymentType: HTMLSelectElement;
    var drpitem_family: HTMLSelectElement;
    var txt_ID_APP_Type: HTMLSelectElement;
    var drp_Store: HTMLSelectElement;
    var ddlstatus: HTMLSelectElement;
    var Display_ItemFamily: Array<I_ItemFamily> = new Array<I_ItemFamily>();
    var Display_ItemFamilyFill: Array<I_ItemFamily> = new Array<I_ItemFamily>();
    var Details: Array<I_Item> = new Array<I_Item>();
    var CodesTypes: Array<G_Codes> = new Array<G_Codes>();
    var CollectList: Array<IQ_GetCollectList> = new Array<IQ_GetCollectList>();
    var SearchDetails: Array<IQ_GetCollectList> = new Array<IQ_GetCollectList>();
    var hd_CollectID: HTMLInputElement;
    var chkStatus: HTMLInputElement;
    var Model: I_TR_Collect = new I_TR_Collect();
    var ModelCollectDet: Array<I_TR_CollectDetail> = new Array<I_TR_CollectDetail>();
    var CollectMasterDetail: ICollectMasterDetails = new ICollectMasterDetails();
    var btnSave: HTMLButtonElement;
    var txtMaterialCost: HTMLInputElement;
    var gloplCollectID = 0;
    var IsPosted = false;
    //*************************************************Initialization*************************************************//
    export function InitalizeComponent() {
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
        GetCardTypes();
        drp_Store.selectedIndex = 1;
        

        Display_DrpPaymentType();
        Display_I_ItemFamily();
        txt_ID_APP_Type.innerHTML = '<option value="null">اختر الصنف</option>';
    }
    function InitalizeControls() {
        txtFromDate = document.getElementById("txtFromDate") as HTMLInputElement;
        txtToDate = document.getElementById("txtToDate") as HTMLInputElement;
        txtTrNo = document.getElementById("txtTrNo") as HTMLInputElement;
        txtTransferDate = document.getElementById("txtTransferDate") as HTMLInputElement;
        txtLabourCost = document.getElementById("txtLabourCost") as HTMLInputElement;
        searchbutmemreport = document.getElementById("searchbutmemreport") as HTMLInputElement;
        btnAdd = document.getElementById("btnAdd") as HTMLButtonElement;
        btnUpdate = document.getElementById("btnUpdate") as HTMLButtonElement;
        btnSave = document.getElementById("btnSave") as HTMLButtonElement;
        btnBack = document.getElementById("btnBack") as HTMLButtonElement;
        btnAddDetails = DocumentActions.GetElementById<HTMLButtonElement>("btnAddDetails");
        btnShow = DocumentActions.GetElementById<HTMLButtonElement>("btnShow");
        drp_Store = DocumentActions.GetElementById<HTMLSelectElement>("drp_Store");
        drpPaymentType = DocumentActions.GetElementById<HTMLSelectElement>("drpPaymentType");
        drpitem_family = DocumentActions.GetElementById<HTMLSelectElement>("drpitem_family");
        txt_ID_APP_Type = DocumentActions.GetElementById<HTMLSelectElement>("txt_ID_APP_Type");
        drp_CollType = DocumentActions.GetElementById<HTMLSelectElement>("drp_CollType");
        Filtr_CollType = DocumentActions.GetElementById<HTMLSelectElement>("Filtr_CollType");
        hd_CollectID = DocumentActions.GetElementById<HTMLInputElement>("hd_CollectID");
        chkStatus = document.getElementById("chkStatus") as HTMLInputElement;
        ddlstatus = document.getElementById("ddlstatus") as HTMLSelectElement;
        btnPrintTrview = document.getElementById("btnPrintTrview") as HTMLButtonElement;
        btnPrintTrPDF = document.getElementById("btnPrintTrPDF") as HTMLButtonElement;
        btnPrintTrEXEL = document.getElementById("btnPrintTrEXEL") as HTMLButtonElement;
        btnPrintTransaction = document.getElementById("btnPrintTransaction") as HTMLButtonElement;
    }
    function InitalizeEvents() {
        btnAdd.onclick = btnAdd_onclick;
        btnBack.onclick = btnBack_onclick;
        btnUpdate.onclick = btnUpdate_onclick;
        btnAddDetails.onclick = AddNewRow;
        btnShow.onclick = btnShow_onclick;
        btnSave.onclick = btnSave_onclick;
        chkStatus.onchange = chkStatus_onchange;
        searchbutmemreport.onkeyup = _SearchBox_Change;
        btnPrintTrview.onclick = () => { PrintReport(1); }
        btnPrintTrPDF.onclick = () => { PrintReport(2); }
        btnPrintTrEXEL.onclick = () => { PrintReport(3); }
        btnPrintTransaction.onclick = PrintTransaction;

        $("#btn_OUT_SearchItems").on('click', function () {
            btn_OUT_SrchItem_onclick();
        });

        $("#txt_OUT_ItemCode").on('change', function () {
            txt_OUT_search_onchange();
        });
 

        drpPaymentType.onchange = drpPaymentType_onchange;
        drpitem_family.onchange = itemDisplay;

    }
    function InitializeGrid() {
        let res: any = GetResourceList("");
        Grid.ElementName = "divGridDetails";
        Grid.Paging = true;
        Grid.PageSize = 10;
        Grid.Sorting = true;
        Grid.InsertionMode = JsGridInsertionMode.Binding;
        Grid.Editing = false;
        Grid.Inserting = false;
        Grid.SelectedIndex = 1;
        Grid.OnRowDoubleClicked = () => { Grid_RowDoubleClicked(Grid.SelectedKey) };
        Grid.OnItemEditing = () => { };
        Grid.PrimaryKey = "CollectID";
        Grid.Columns = [
            { title: res.App_Number, name: "CollectID", type: "text", width: "0%", visible: false },
            { title: res.App_Number, name: "TrNo", type: "text", width: "10%" },
            {
                title: res.App_date, css: "ColumPadding", name: "TrDate", width: "10%",
                itemTemplate: (s: string, item: IQ_GetCollectList): HTMLLabelElement => {
                    let txt: HTMLLabelElement = document.createElement("label");
                    txt.innerHTML = DateFormat(item.TrDate);
                    return txt;
                }
            }, 
            { title:'نوع الحركه', name: "Typ_DescA", type: "text", width: "10%" },
            { title: 'المخرجات', name: "Itm_DescA", type: "text", width: "25%" },
            { title: 'الكمية', name: "Qty", type: "text", width: "13%" },
            { title: res.Inv_LabourCost, name: "LabourCost", type: "text", width: "10%" },
            { title: " تكلفة المواد", name: "MaterialCost", type: "text", width: "10%" },
            {
                title: res.App_Certified, css: "ColumPadding", name: "statusDesciption", width: "10%",
                itemTemplate: (s: string, item: IQ_GetCollectList): HTMLLabelElement => {
                    let txt: HTMLLabelElement = document.createElement("label");
                    txt.innerHTML = item.Status == 1 ? (lang == "ar" ? "معتمد" : "A certified") : (lang == "ar" ? "غير معتمد" : "Not supported");;
                    return txt;
                }
            },
        ];
        Grid.Bind();
    }
    //***************************************************Main function************************************//
    function btnShow_onclick() {
        debugger;
        $('#divTransferDetails').addClass('display_none');

        var condition = " CompCode=" + Number(SysSession.CurrentEnvironment.CompCode) + " and BranchCode=" + Number(SysSession.CurrentEnvironment.BranchCode);
        var startdate = "";
        var Enddate = "";
        if (Filtr_CollType.value != "null" && Filtr_CollType.value != "") condition = condition + " and TrType=" + Filtr_CollType.value + "";
        if (drp_Store.value != "null" && drp_Store.value != "") condition = condition + " and StoreID=" + drp_Store.value + "";
        if (ddlstatus.value != "null" && ddlstatus.value != "") condition = condition + " and Status=" + ddlstatus.value;

        if (drpPaymentType.value != "null" && drpPaymentType.value != "") condition = condition + " and CatID=" + drpPaymentType.value + "";
        if (drpitem_family.value != "null" && drpitem_family.value != "") condition = condition + " and ItemFamilyID=" + drpitem_family.value + "";
        if (txt_ID_APP_Type.value != "null" && txt_ID_APP_Type.value != "") condition = condition + " and ItemID=" + txt_ID_APP_Type.value + "";

        if (txtFromDate.value != "") startdate = DateFormatRep(txtFromDate.value);
        if (txtToDate.value != "") Enddate = DateFormatRep(txtToDate.value);

        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("Collect", "Search"),
            data: {
                condition: condition,
                strtdt: startdate, Enddt: Enddate,
                UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {                
                debugger
                var result = d;
                if (result.IsSuccess) {
                    CollectList = result.Response as Array<IQ_GetCollectList>;
                    CollectList = CollectList.sort(dynamicSort("TrNo"));
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
    function btnSave_onclick() {
        loading('btnsave');

        setTimeout(function () {

            finishSave('btnsave');
            debugger;
            if (!Validation())
                return;


            var CanAdd: boolean = true;
            if (CountGrid > 0) {
                for (var i = 0; i < CountGrid; i++) {
                    CanAdd = Validation_Grid(i);
                    if (CanAdd == false) {
                        break;
                    }
                }
            }
            if (CanAdd) {
                if (hd_CollectID.value == "0")
                    Insert();
                else
                    Update();
            }


        }, 100);
    }
    function btnAdd_onclick() {
        debugger
        if (!SysSession.CurrentPrivileges.AddNew) return;

        $("#divTransferDetails").removeClass("display_none");
        Clear();
        EnableControls();
        $("#btnSave").removeClass("display_none");
        $("#btnUpdate").addClass("display_none");
        $("#btnPrintTransaction").addClass("display_none");
        $("#btnBack").removeClass("display_none");
        chkStatus.disabled = false;
        $(".text_off").prop("disabled", true);
        $("#btnAddDetails").removeClass("display_none");
        AddNewRow();

        IsPosted = false;
    }
    function btnUpdate_onclick() {
        if (!SysSession.CurrentPrivileges.EDIT) return;
        EnableControls();
        $("#btnSave").removeClass("display_none");
        $("#btnBack").removeClass("display_none");
        $("#btnUpdate").addClass("display_none");
        $("#btnPrintTransaction").addClass("display_none");
        $("#btnReCalculate").removeClass("display_none");
        $(".text_off").prop("disabled", true);


        $("#btnAddDetails").removeClass("display_none");
    }
    function btnBack_onclick() {

        debugger

        $("#btnSave").addClass("display_none");
        $("#btnBack").addClass("display_none");
        $("#btnUpdate").addClass("display_none");
        $("#btnPrintTransaction").addClass("display_none");
        disabledControls();
        if (hd_CollectID.value != "0") {

            Grid_RowDoubleClicked(hd_CollectID.value)
        }
        else {
            Clear();
            $('#divTransferDetails').addClass('display_none');
        }


    }
    function chkStatus_onchange() {
        if (Model.Status == 1)
            open();
    }
    //***************************************************Search******************************************// 

    function _SearchBox_Change() {

        $("#divGridDetails").jsGrid("option", "pageIndex", 1);


        if (searchbutmemreport.value != "") {

            let search: string = searchbutmemreport.value.toLowerCase();
            SearchDetails = CollectList.filter(x => x.TrNo.toString().search(search) >= 0);

            Grid.DataSource = SearchDetails;
            Grid.Bind();
        } else {
            Grid.DataSource = CollectList;
            Grid.Bind();
        }

    }
    function btnSrchItem_onclick(cnt: number) {
        debugger
        var cond: string;
        cond = "";
        cond = " CompCode=" + SysSession.CurrentEnvironment.CompCode + " and BraCode=" + SysSession.CurrentEnvironment.BranchCode;
        cond = cond + " and StoreId=" + drp_Store.value + " and  FinYear= " + SysSession.CurrentEnvironment.CurrentYear;
        sys.FindKey(Modules.CollectUnit, "btnSearchItem", cond, () => {
            let id = SearchGrid.SearchDataGrid.SelectedKey;
            if (!validationitem(id, Number($("#txt_ItemID" + cnt + "").val()))) {
                $("#txt_OUT_ItemCode" + cnt).val('');

                return
            }
            Ajax.Callsync({
                type: "Get",
                //url: sys.apiUrl("StkDefItemType", "GetAllItembyItemId"),
                //data: {
                //    CompCode: Number(SysSession.CurrentEnvironment.CompCode), UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token,
                //    itemid: id, BranchCode: Number(SysSession.CurrentEnvironment.BranchCode)
                //},
                url: sys.apiUrl("StkDefItems", "GetItem"),
                data: {
                    CompCode: compcode, BraCode: Number(SysSession.CurrentEnvironment.BranchCode), FinYear: Number(SysSession.CurrentEnvironment.CurrentYear), ItemID: id, StoreId: Number(drp_Store.value), Show: false, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
                },
                success: (d) => {
                    debugger
                    let result = d as BaseResponse;
                    if (result.IsSuccess) {
                        let res = result.Response[0] as IQ_GetItemStoreInfo;
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
                        $("#txtQuantity" + cnt).focus();

                        if ($("#txt_StatusFlag" + cnt).val() != "i")
                            $("#txt_StatusFlag" + cnt).val("u");
                    }
                }
            });
        });
    }
    function txt_search_onchange(cnt: number) {
        if ($("#txtItemCode" + cnt).val().trim() == '') {

            $("#txtItemCode" + cnt).val("");
            $("#txtItemName" + cnt).val("");
            $("#txt_ItemID" + cnt).val("");
            $("#txt_OnhandQty" + cnt).val("");
            $("#txt_GlobalCost" + cnt).val("");
            $("#txt_UnitID" + cnt).val("");
            $("#txt_StockOnhandQty" + cnt).val("");
            $("#txt_StkUnitCost" + cnt).val("");
            $("#txt_u_DescA" + cnt).val("");
            $("#txtQuantity" + cnt).val("");
            $("#txt_StatusFlag" + cnt).val("");

            return
        }

        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("StkDefItemType", "GetAllItembyItemCode"),
            data: {
                CompCode: Number(SysSession.CurrentEnvironment.CompCode), UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token,
                itemcode: $("#txtItemCode" + cnt).val(), BranchCode: Number(SysSession.CurrentEnvironment.BranchCode)
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    let res = result.Response as IQ_GetItemStoreInfo;
                    if (res != null) {

                        if (!validationitem(res.ItemID, cnt)) {
                            $("#txtItemCode" + cnt).val('');

                            return
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

                        $("#txtQuantity" + cnt).focus();

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
                        $("#txt_u_DescA" + cnt).val("");
                        $("#txtQuantity" + cnt).val("");
                        $("#txt_StatusFlag" + cnt).val("");
                    }
                }
            }
        });
    }

    function btn_OUT_SrchItem_onclick() {
        debugger
        var cond: string;
        cond = "";
        cond = " CompCode=" + SysSession.CurrentEnvironment.CompCode + " and BraCode=" + SysSession.CurrentEnvironment.BranchCode;
        cond = cond + " and StoreId=" + drp_Store.value + " and  FinYear= " + SysSession.CurrentEnvironment.CurrentYear;
        sys.FindKey(Modules.CollectUnit, "btn_OUT_SrchItem", cond, () => {
            let id = SearchGrid.SearchDataGrid.SelectedKey;



            Ajax.Callsync({
                type: "Get",
                //url: sys.apiUrl("StkDefItemType", "GetAllItembyItemId"),
                //data: {
                //    CompCode: Number(SysSession.CurrentEnvironment.CompCode), UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token,
                //    itemid: id, BranchCode: Number(SysSession.CurrentEnvironment.BranchCode)
                //},
                url: sys.apiUrl("StkDefItems", "GetItem"),
                data: {
                    CompCode: compcode, BraCode: Number(SysSession.CurrentEnvironment.BranchCode), FinYear: Number(SysSession.CurrentEnvironment.CurrentYear), ItemID: id, StoreId: Number(drp_Store.value), Show: false, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
                },
                success: (d) => {
                    let result = d as BaseResponse;
                    if (result.IsSuccess) {

                        //let res = result.Response as Array<IQ_GetItemStoreInfo> ;
                        let res = result.Response[0] as IQ_GetItemStoreInfo;
                        $("#txt_OUT_ItemCode").val(res.ItemCode);
                        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar")
                            $("#txt_OUT_ItemName").val(res.Itm_DescA);
                        else
                            $("#txt_OUT_ItemName").val(res.Itm_DescE);
                        //**hidden values
                        $("#txt_OUT_ItemID").val(res.ItemID);
                        $("#txt_OUT_OnhandQty").val(res.OnhandQty);
                        $("#txt_OUT_GlobalCost").val(res.GlobalCost);
                        $("#txt_OUT_UnitID").val(res.UomID);
                        $("#txt_OUT_StockOnhandQty").val(res.OnhandQty);
                        $("#txt_OUT_StkUnitCost").val(res.GlobalCost);
                        $("#txt_OUT_Quantity").focus();

                    }
                }
            });
        });
    }
    function txt_OUT_search_onchange() {
        if ($("#txt_OUT_ItemCode").val().trim() == '') {
            $("#txt_OUT_ItemCode").val("");
            $("#txt_OUT_ItemName").val("");
            $("#txt_OUT_ItemID").val("");
            $("#txt_OUT_OnhandQty").val("");
            $("#txt_OUT_GlobalCost").val("");
            $("#txt_OUT_UnitID").val("");
            $("#txt_OUT_StockOnhandQty").val("");
            $("#txt_OUT_StkUnitCost").val("");
            $("#txt_OUT_Quantity").val(""); 
            return
        }
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("StkDefItemType", "GetAllItembyItemCode"),
            data: {
                CompCode: Number(SysSession.CurrentEnvironment.CompCode), UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token,
                itemcode: $("#txt_OUT_ItemCode").val(), BranchCode: Number(SysSession.CurrentEnvironment.BranchCode)
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    let res = result.Response as IQ_GetItemStoreInfo;
                    debugger
                    if (res != null) {



                        $("#txt_OUT_ItemCode").val(res.ItemCode);
                        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar")
                            $("#txt_OUT_ItemName").val(res.Itm_DescA);
                        else
                            $("#txt_OUT_ItemName").val(res.Itm_DescE);
                        //**hidden values
                        $("#txt_OUT_ItemID").val(res.ItemID);
                        $("#txt_OUT_OnhandQty").val(res.OnhandQty);
                        $("#txt_OUT_GlobalCost").val(res.GlobalCost);
                        $("#txt_OUT_UnitID").val(res.UomID);
                        $("#txt_OUT_StockOnhandQty").val(res.OnhandQty);
                        $("#txt_OUT_StkUnitCost").val(res.GlobalCost);
                        $("#txt_OUT_Quantity").focus();
                    }
                    else {
                        $("#txt_OUT_ItemCode").val("");
                        $("#txt_OUT_ItemName").val("");
                        $("#txt_OUT_ItemID").val("");
                        $("#txt_OUT_OnhandQty").val("");
                        $("#txt_OUT_GlobalCost").val("");
                        $("#txt_OUT_UnitID").val("");
                        $("#txt_OUT_StockOnhandQty").val("");
                        $("#txt_OUT_StkUnitCost").val("");
                        $("#txt_OUT_Quantity").val(""); 
                    }
                }
            }
        });

    }
    //*************************************************Display******************************************//
    function Grid_RowDoubleClicked(CollectID: string) {
        $("#DivInvoiceData").removeClass("display_none");
        

        hd_CollectID.value = CollectID;
        btnPrintTransaction.disabled = false;
        Display();
        disabledControls();
        //*****Privillage 
        if (Model.Status == 1) {
            chkStatus.checked = true;
            chkprivialgesToEditApprovedInvoice();
        } else {
            chkStatus.checked = false;
            btnUpdate.disabled = !SysSession.CurrentPrivileges.EDIT;
            chkStatus.disabled = true;
        }


        $("#btnAddDetails").addClass("display_none");
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
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    let res = result.Response as IQCollectMasterDetails;
                    DisplayMaster(res.I_TR_Collect);
                    DisplayDetails(res.IQ_GetCollectDetail);
                    $('#divTransferDetails').removeClass('display_none');


                    //*****Privillage 
                    if (Model.Status == 1) {
                        chkStatus.checked = true;
                        chkprivialgesToEditApprovedInvoice();
                    } else {
                        chkStatus.checked = false;
                        btnUpdate.disabled = !SysSession.CurrentPrivileges.EDIT;
                        chkStatus.disabled = true;
                    }
                }
            }
        });
        btnUpdate.disabled = false;
    }
    function DisplayMaster(collectMaster: I_TR_Collect) {
        Model.Status = collectMaster.Status;
        DocumentActions.RenderFromModel(collectMaster);
        txtTransferDate.value = DateFormat(collectMaster.TrDate);
        drp_CollType.value = collectMaster.TrType.toString();
        IsPosted = collectMaster.IsPosted;
    }
    function DisplayDetails(CollectDet: Array<IQ_GetCollectDetail>) {
        debugger
        CountGrid = 0;
        $("#div_Data").html("");
        $("#div_Data2").html("");
        var CollectDet_Input = CollectDet.filter(x => x.IsInput == true);
        var CollectDet_Output = CollectDet.filter(x => x.IsInput == false);
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

            $("#txt_OUT_CollectDetailID").val(CollectDet_Output[cnt].CollectDetailID);
            $("#txt_OUT_ItemCode").val(CollectDet_Output[cnt].ItemCode);
            if (SysSession.CurrentEnvironment.ScreenLanguage == "ar")
                $("#txt_OUT_ItemName").val(CollectDet_Output[cnt].itm_DescA);
            else
                $("#txt_OUT_ItemName").val(CollectDet_Output[cnt].itm_DescA);
            //**hidden values
            $("#txt_OUT_ItemID").val(CollectDet_Output[cnt].ItemID);
            $("#txt_OUT_OnhandQty").val(CollectDet_Output[cnt].OnhandQty);
            $("#txt_OUT_GlobalCost").val(CollectDet_Output[cnt].UnitCost);
            $("#txt_OUT_UnitID").val(CollectDet_Output[cnt].UnitID);
            $("#txt_OUT_StockOnhandQty").val(CollectDet_Output[cnt].StockOnhandQty);
            $("#txt_OUT_StkUnitCost").val(CollectDet_Output[cnt].StkUnitCost);
            $("#txt_OUT_Quantity").val(CollectDet_Output[cnt].Qty); 
        }
    }
    //***********************************************Grid Controls*******************************************//
    function BuildControls(cnt: number) {

        var html = "";
        html = `<tr id= "No_Row${cnt}">
                    <input id="txtCollectDetailID${cnt}" type="hidden" class="form-control display_none"  />
                    <td>
		                <div class="form-group">
			                <span id="btn_minus${cnt}"><i class="fas fa-minus-circle  btn-minus display_none"></i></span>
		                </div>
	                </td>
                    <td>
	                    <div class="form-group">
		                    <button type="button" class="style_ButSearch" id="btnSearchItems${cnt}" name="ColSearch">
		                    <i class="fa fa-search  "></i>
		                     </button>
	                    </div>
                    </td>
                    <td>
		                <div class="form-group">
                            <input id="txtItemCode${cnt}" type="text" class="form-control" name=""  />
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
                            <input id="txtItemName${cnt}" type="text" class="form-control condisa" name="" disabled />
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
                            <input id="txt_u_DescA${cnt}" type="text" class="form-control condisa" name="" disabled  />
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
                            <input id="txtQuantity${cnt}" type="number" class="form-control" name=""  />
		                </div>
	                </td>
                    
               <input id="txt_StatusFlag${cnt}" type="hidden"   />
               <input id="txt_ItemID${cnt}" type="hidden"   />
               <input id="txt_OnhandQty${cnt}" type="hidden"   />
               <input id="txt_GlobalCost${cnt}" type="hidden"   />
               <input id="txt_UnitID${cnt}" type="hidden"   />
               <input id="txt_StockOnhandQty${cnt}" type="hidden"   />
               <input id="txt_StkUnitCost${cnt}" type="hidden"   />
                </tr>`;
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

        $("#txtQuantity" + cnt).on('keyup', function () {
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
        if (!SysSession.CurrentPrivileges.AddNew) return;

        var CanAdd: boolean = true;
        if (CountGrid > 0) {
            for (var i = 0; i < CountGrid; i++) {
                CanAdd = Validation_Grid(i);
                if (CanAdd == false) {
                    break;
                }
            }
        }
        if (CanAdd) {

            BuildControls(CountGrid);
            $("#txt_StatusFlag" + CountGrid).val("i"); //In Insert mode

            // can delete new inserted record  without need for delete privilage
            CountGrid++;
        }
        $(".btn-minus").removeClass("display_none");
    }
    function DeleteRow(RecNo: number) {
        if (!SysSession.CurrentPrivileges.Remove) return;
        WorningMessage("هل تريد الحذف؟", "Do you want to delete?", "تحذير", "worning", () => {
            var statusFlag = $("#txt_StatusFlag" + RecNo).val();
            if (statusFlag == "i")
                $("#txt_StatusFlag" + RecNo).val("m");
            else
                $("#txt_StatusFlag" + RecNo).val("d");

            $("#No_Row" + RecNo).attr("hidden", "true");
        });

    }
    //******************************************************validation*****************************************//
    function Validation() {
        debugger
        if ($("#drp_Store").val() == "" || $("#drp_Store").val() == "null") {
            DisplayMassage(" برجاء ادخال المستودع ", "Please Enter Store", MessageType.Worning);
            Errorinput(drp_Store);
            return false
        }
        if ($("#drp_CollType").val() == "" || $("#drp_CollType").val() == "null") {
            DisplayMassage(" برجاء اختيار نوع الحركة ", "Please Enter Store", MessageType.Worning);
            Errorinput(drp_CollType);
            return false
        }
        if ($("#txtTransferDate").val() == "") {
            DisplayMassage(" برجاء ادخال تاريخ الحركة ", "Please Enter Date", MessageType.Worning);
            Errorinput(txtTransferDate);
            return false
        }
        if (Number($("#txt_OUT_ItemCode").val()) == 0) {
            DisplayMassage("برجاء ادخال الصنف المخرجات ", "The Summetion of Cost Prescentage must equal 100", MessageType.Error);
            Errorinput($("#txt_OUT_ItemCode"));
            Errorinput($("#txt_OUT_ItemName"));
            return false
        }
        if (Number($("#txt_OUT_Quantity").val()) == 0) {
            DisplayMassage("برجاء ادخال كمية المخرجات ", "The Summetion of Cost Prescentage must equal 100", MessageType.Error);
            Errorinput($("#txt_OUT_Quantity"));
            return false
        } 
        //********************
        let FlagCount = false;
        for (var i = 0; i < CountGrid; i++) {
            if ($("#txt_StatusFlag" + i).val() != "d" && $("#txt_StatusFlag" + i).val() != "m") {
                FlagCount = true;
            }
        }
        if (!FlagCount) {
            DisplayMassage("ادخل بيانات المدخلات", "Enter Inputs Data", MessageType.Error);
            return false
        }

        //******************
        if (!CheckPeriodDate(txtTransferDate.value, "I")) {
            debugger
            DisplayMassage("لا يمكنك الاضافه او التعديل في هذة الفتره المغلقه ", "Please select a Invoice data", MessageType.Error);
            Errorinput(txtTransferDate);
            return false
        }


        return true;
    }
    function validationitem(id: number, idRow: number) {
        for (var i = 0; i < CountGrid; i++) {

            if ($("#txt_StatusFlag" + i).val() != "d" && $("#txt_StatusFlag" + i).val() != "m") {
                if ($("#txt_ItemID" + i + "").val() == id && $("#txt_ItemID" + i + "").val() != idRow) {
                    DisplayMassage("الصنف موجود من قبل", "Item found before", MessageType.Error);
                    Errorinput($("#txtItemCode" + i + ""));
                    return false
                }
            }

        }
        return true;
    }
    function Validation_Grid(rowcount: number): boolean {
        if ($("#txt_StatusFlag" + rowcount).val() == "d" || $("#txt_StatusFlag" + rowcount).val() == "m") {
            return true;
        }
        else {
            if ($("#txtItemName" + rowcount).val() == "") {
                DisplayMassage('برجاء ادخال الصنف', 'Please enter the item', MessageType.Error);
                Errorinput($("#txtItemName" + rowcount));
                Errorinput($("#txtItemCode" + rowcount));
                return false;
            }
            if (Number($("#txtQuantity" + rowcount).val()) == 0) {
                DisplayMassage('برجاء ادخال الكميه', 'Please enter the item', MessageType.Error);
                Errorinput($("#txtQuantity" + rowcount));
                return false;
            }
            return true;
        }

    }
    //******************************************************Load*****************************************//
    function FillStore() {
        debugger
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("DefStore", "GetAll"),
            data: {
                CompCode: Number(SysSession.CurrentEnvironment.CompCode),
                BranchCode: Number(SysSession.CurrentEnvironment.BranchCode),
                UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess == true) {
                    let Store = result.Response as Array<G_STORE>;
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
    function GetCardTypes() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GCodes", "GetAll"),
            data: { codeType: 'CollType', UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess == true) {
                    CodesTypes = result.Response as Array<G_Codes>;

                    if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
                        DocumentActions.FillComboFirstvalue(CodesTypes, Filtr_CollType, "CodeValue", "DescA", " اختار  نوع الحركه", null);
                        DocumentActions.FillComboFirstvalue(CodesTypes, drp_CollType, "CodeValue", "DescA", " اختار  نوع الحركه", null);
                    }
                    else {
                        DocumentActions.FillComboFirstvalue(CodesTypes, Filtr_CollType, "CodeValue", "DescE", "- Select -", null);
                        DocumentActions.FillComboFirstvalue(CodesTypes, drp_CollType, "CodeValue", "DescE", "- Select -", null);
                    }

                }
            }
        });
    } 
    //----------------------------------------------------( Get Item_Cat )
    function Display_DrpPaymentType() {

        var Display_Type: Array<I_D_Category> = new Array<I_D_Category>();

        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("StkDefCategory", "GetAll"),
            data: {
                CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    Display_Type = result.Response as Array<I_D_Category>;

                    if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
                        DocumentActions.FillCombowithdefult(Display_Type, drpPaymentType, "CatID", "DescA", "اختر الفئة");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(Display_Type, drpPaymentType, "CatID", "DescL", "Select Category");
                    }



                }
            }
        });
    }

    //----------------------------------------------------( Get item familly )
    function Display_I_ItemFamily() {

        Display_ItemFamily = new Array<I_ItemFamily>();

        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("StkDefItemType", "GetAll"),
            data: {
                CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {

                    Display_ItemFamily = result.Response as Array<I_ItemFamily>;


                    if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
                        DocumentActions.FillCombowithdefult(Display_ItemFamily, drpitem_family, "ItemFamilyID", "DescA", "اختر النوع");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(Display_ItemFamily, drpitem_family, "ItemFamilyID", "DescL", "Select Type");
                    }

                    if (drpitem_family.value != 'null') {
                        $('#txt_ID_APP_Type').html('');
                        $('#txt_ID_APP_Type').removeAttr("disabled")
                    } else {
                        $('#txt_ID_APP_Type').html('');
                        $('#txt_ID_APP_Type').attr("disabled")
                    }

                }
            }
        });
    }
    function drpPaymentType_onchange() {
        if (drpPaymentType.value != 'null') {
            Display_ItemFamilyFill = Display_ItemFamily.filter(x => x.CatID == Number(drpPaymentType.value))
            if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
                DocumentActions.FillCombowithdefult(Display_ItemFamilyFill, drpitem_family, "ItemFamilyID", "DescA", "اختر النوع");
            }
            else {
                DocumentActions.FillCombowithdefult(Display_ItemFamilyFill, drpitem_family, "ItemFamilyID", "DescL", "Select Type");
            }
        } else {
            if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
                DocumentActions.FillCombowithdefult(Display_ItemFamily, drpitem_family, "ItemFamilyID", "DescA", "اختر النوع");
            }
            else {
                DocumentActions.FillCombowithdefult(Display_ItemFamily, drpitem_family, "ItemFamilyID", "DescL", "Select Type");
            }
        }

        $('#txt_ID_APP_Type').attr("disabled", "disabled");
        txt_ID_APP_Type.innerHTML = '<option value="null">اختر الصنف</option>';

    }

    //----------------------------------------------------( Item Desc )
    function itemDisplay() {

        if (drpitem_family.value != 'null') {
            Details = new Array<I_Item>();


            var ItemFamilyID = Number($("#drpitem_family").val());
            var finyear = sys.SysSession.CurrentEnvironment.CurrentYear;
            Ajax.Callsync({
                type: "Get",
                url: sys.apiUrl("StkDefItemType", "GetI_ItemByFamilyIdOrdered"),
                data: {
                    CompCode: compcode, FinYear: finyear, familyid: ItemFamilyID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
                },
                success: (d) => {

                    let result = d as BaseResponse;
                    if (result.IsSuccess) {

                        Details = result.Response as Array<I_Item>;


                        $('#txt_ID_APP_Type').html('');
                        $('#txt_ID_APP_Type').removeAttr("disabled")
                        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
                            DocumentActions.FillCombowithdefult(Details, txt_ID_APP_Type, "ItemID", "DescA", "اختر الصنف");
                        }
                        if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                            DocumentActions.FillCombowithdefult(Details, txt_ID_APP_Type, "ItemID", "DescL", "Select Item");
                        }

                    }
                }
            });
        } else {
            $('#txt_ID_APP_Type').attr("disabled", "disabled");
            DocumentActions.FillCombowithdefult(Details, txt_ID_APP_Type, "ItemID", "Itm_DescA", "اختر الصنف");
        }


    }

    //*********************************************functions*******************************************//
    function chkprivialgesToEditApprovedInvoice() {
        if (SysSession.CurrentPrivileges.CUSTOM2 == false) {
            chkStatus.disabled = true;
            btnUpdate.disabled = true;
        } else {
            chkStatus.disabled = false;
            btnUpdate.disabled = true;
        }
    }
    function disabledControls() {
        debugger
        $("#divTransferDetails :input").prop("disabled", true);
        $("#divInputs :input").prop("disabled", true);
        $("#searchbutmemreport").removeClass("disabledDiv");
        $("#divGridDetails").removeClass("disabledDiv");
        $("#btnAddDetails").addClass("disabledplus");
        $("#btnSave").addClass("display_none");
        $("#btnUpdate").removeClass("display_none");
        $("#btnPrintTransaction").removeClass("display_none");
        $("#btnBack").addClass("display_none");
        $(".glyphicon-minus-sign").addClass("display_none");
        $("#divOutputs :input").prop("disabled", true);
        $("#div_Data2 :input").prop("disabled", true);
        $(".text_off").prop("disabled", true);
        btnUpdate.disabled = false;
        $("#divGridDetails").removeClass("disabledDiv");
        $("#divGridDetails").removeAttr("disabled");
        $("#div_hedr").removeClass("disabledDiv");
        $("#div_hedr").removeAttr("disabled").off('click');
    }
    function EnableControls() {
        $("#divTransferDetails :input").prop("disabled", false);
        $("#searchbutmemreport").addClass("disabledDiv");
        $("#divGridDetails").addClass("disabledDiv");
        $("#divGridDetails").attr("disabled", "disabled").off('click');
        $("#div_hedr").addClass("disabledDiv");
        $("#div_hedr").attr("disabled", "disabled").off('click');
        $("#btnAddDetails").removeClass("disabledplus");
        $("#divInputs :input").prop("disabled", false);
        $("#divOutputs :input").prop("disabled", false);
        txtTrNo.disabled = true;
        $(".btn-minus").removeClass("display_none");
        $("#txtCreatedBy").attr("disabled", "disabled");
        $("#txtCreatedAt").attr("disabled", "disabled");
        $("#txtUpdatedBy").attr("disabled", "disabled");
        $("#txtUpdatedAt").attr("disabled", "disabled");

        $("#VoucherNo").attr("disabled", "disabled");
        $("#txt_OUT_ItemName").attr("disabled", "disabled");
        $(".condisa").attr("disabled", "disabled");
    }
    function Clear() {
        $("#divTransferDetails :input").val("");
        $("#div_Data2 :input").val("");
        $("#divInputs :input").val("");
        txtLabourCost.value = "0";
        $("#txtMaterialCost").val("0");
        $("#VoucherNo").val("");
        txtTransferDate.value = DateFormat(Date().toString());
        Model = new I_TR_Collect();
        ModelCollectDet = new Array<I_TR_CollectDetail>();
        CollectMasterDetail = new ICollectMasterDetails();
        hd_CollectID.value = "0";
        $("#div_Data").html('');
        CountGrid = 0;
        drp_CollType.value = 'null';
    }
    //**********************************************Assign**********************************************//
    function Assign() {
        DocumentActions.AssignToModel(Model);
        Model.CollectID = Number(hd_CollectID.value);
        Model.StoreID = Number(drp_Store.value);
        Model.Status = Number(chkStatus.checked);
        Model.CompCode = Number(SysSession.CurrentEnvironment.CompCode);
        Model.BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);
        Model.UserCode = SysSession.CurrentEnvironment.UserCode;
        Model.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
        Model.TrDate = txtTransferDate.value;
        Model.TrType = Number(drp_CollType.value);
        Model.VoucherNo = Number($('#VoucherNo').val());
        Model.IsPosted = IsPosted;
        //Model.TrDateH = convertToH(txtTransferDate.value);//==========???error

        //*****************************AssignOutputdetails

        ModelCollectDet = new Array<I_TR_CollectDetail>();

        var det = new I_TR_CollectDetail();
        det.ItemID = Number($("#txt_OUT_ItemID").val());
        det.IsInput = false;
        det.UnitID = Number($("#txt_OUT_UnitID").val());
        det.OnhandQty = Number($("#txt_OUT_OnhandQty").val());
        det.UnitCost = Number($("#txt_OUT_GlobalCost").val());
        det.StockOnhandQty = Number($("#txt_OUT_StockOnhandQty").val());
        det.StkUnitCost = Number($("#txt_OUT_StkUnitCost").val());
        det.StockQty = Number($("#txt_OUT_Quantity").val());
        det.Qty = Number($("#txt_OUT_Quantity").val());
        det.CostFactorPrc =100;
        det.CollectDetailID = Number($("#txt_OUT_CollectDetailID").val());
        det.CollectID = Number(hd_CollectID.value);
        det.StatusFlag = hd_CollectID.value == "0" ? 'i' : 'u';
        ModelCollectDet.push(det);

        AssignInputdetails();

    }
    function AssignInputdetails() {
        debugger

        var det: I_TR_CollectDetail;
        var StatusFlag: string;

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
    function Insert() {
        Assign();
        Model.CollectID = 0;
        Model.CreatedAt = DateTimeFormat(Date().toString());
        Model.CreatedBy = SysSession.CurrentEnvironment.UserCode;
        Model.TrNo = null;
        CollectMasterDetail.I_TR_Collect = Model;
        CollectMasterDetail.I_TR_CollectDetail = ModelCollectDet;

        CollectMasterDetail.Branch_Code = SysSession.CurrentEnvironment.BranchCode;
        CollectMasterDetail.Comp_Code = SysSession.CurrentEnvironment.CompCode;
        CollectMasterDetail.MODULE_CODE = Modules.CollectUnit;
        CollectMasterDetail.UserCode = SysSession.CurrentEnvironment.UserCode;
        CollectMasterDetail.sec_FinYear = SysSession.CurrentEnvironment.CurrentYear;
        Ajax.Callsync({
            type: "post",
            url: sys.apiUrl("Collect", "InsertAll"),
            data: JSON.stringify(CollectMasterDetail),
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    Model = result.Response as I_TR_Collect;
                    DateSetsSccess("txtTransferDate", "txtFromDate", "txtToDate");
                    DisplayMassage("تم الحفظ", "Saved Succesfully", MessageType.Succeed);
                    gloplCollectID = Model.CollectID;
                    Success(Model.CollectID.toString());
                    Save_Succ_But();
                }
            }
        });
    }
    function Update() {
        debugger
        Assign();
        Model.CollectID = Number(hd_CollectID.value);
        Model.UpdatedAt = DateTimeFormat(Date().toString());
        Model.UpdatedBy = SysSession.CurrentEnvironment.UserCode;
        CollectMasterDetail.I_TR_Collect = Model;
        CollectMasterDetail.I_TR_CollectDetail = ModelCollectDet;

        CollectMasterDetail.Branch_Code = SysSession.CurrentEnvironment.BranchCode;
        CollectMasterDetail.Comp_Code = SysSession.CurrentEnvironment.CompCode;
        CollectMasterDetail.MODULE_CODE = Modules.CollectUnit;
        CollectMasterDetail.UserCode = SysSession.CurrentEnvironment.UserCode;
        CollectMasterDetail.sec_FinYear = SysSession.CurrentEnvironment.CurrentYear;
        Ajax.Callsync({
            type: "Post",
            url: sys.apiUrl("Collect", "UpdateALL"),
            data: JSON.stringify(CollectMasterDetail),
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    Model = result.Response as I_TR_Collect;
                    DateSetsSccess("txtTransferDate", "txtFromDate", "txtToDate");
                    DisplayMassage("تم التعديل", "Saved Succesfully", MessageType.Succeed);
                    gloplCollectID = Model.CollectID;
                    Success(Model.CollectID.toString());
                    Save_Succ_But();

                }
            }
        });
    }
    function open() {
        if (!CheckPeriodDate(txtTransferDate.value, "I")) {
            debugger
            DisplayMassage("لا يمكنك الاضافه او التعديل في هذة الفتره المغلقه ", "Please select a Invoice data", MessageType.Error);
            Errorinput(txtTransferDate);
            chkStatus.checked = true;
            return false
        }

        //Assign();
        Model.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
        Model.CollectID = Number(hd_CollectID.value);
        Model.Status = 0;
        Model.UpdatedAt = DateTimeFormat(Date().toString());
        Model.UpdatedBy = SysSession.CurrentEnvironment.UserCode;
        Model.Branch_Code = SysSession.CurrentEnvironment.BranchCode;
        Model.Comp_Code = SysSession.CurrentEnvironment.CompCode;
        Model.MODULE_CODE = Modules.CollectUnit;
        Model.UserCode = SysSession.CurrentEnvironment.UserCode;
        Model.sec_FinYear = SysSession.CurrentEnvironment.CurrentYear;
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("Collect", "Open"),
            data: JSON.stringify(Model),
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess == true) {
                    Model = result.Response as I_TR_Collect;
                    DisplayMassage("تم فك الاعتماد", "Saved Succesfully", MessageType.Succeed);
                    gloplCollectID = Model.CollectID;
                    Success(Model.CollectID.toString());
                }
            }
        });
    }
    function Success(CollectID: string) {

        btnShow_onclick();

        $("#btnSave").addClass("display_none");
        $("#btnBack").addClass("display_none");
        $("#btnUpdate").addClass("display_none");
        $("#btnPrintTransaction").addClass("display_none");
        disabledControls();
        Grid_RowDoubleClicked(CollectID)
    }
    //******************************************Print**********************************************//
    function PrintTransaction() {
        if (!SysSession.CurrentPrivileges.PrintOut) return;
        let rp: ReportParameters = new ReportParameters();

        rp.TRId = Number(hd_CollectID.value);

        rp.Name_function = "IProc_Prnt_Collect";
        localStorage.setItem("Report_Data", JSON.stringify(rp));

        
        localStorage.setItem("result", '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>');
        window.open(Url.Action("ReportsPopup", "Home"), "_blank");

    }
    export function PrintReport(OutType: number) {
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
        if (drp_Store.value == "null") { rp.storeID = -1; }
        else { rp.storeID = Number($("#drp_Store").val()); }
        if (ddlstatus.value == "null") { rp.Status = 2; }
        else { rp.Status = $("#ddlstatus").val(); }

        rp.TrType = Filtr_CollType.value == "null" ? -1 : Number(Filtr_CollType.value);
        rp.CatId = drpPaymentType.value == "null" ? -1 : Number(drpPaymentType.value);
        rp.ItemFamId = drpitem_family.value == "null" ? -1 : Number(drpitem_family.value);
        rp.ItemID = txt_ID_APP_Type.value == "null" ? -1 : Number(txt_ID_APP_Type.value);

        Ajax.Callsync({
            url: Url.Action("IProc_Rep_CollectList", "GeneralReports"),
            data: rp,
            success: (d) => {
                let result = d.result as string;

                

                window.open(result, "_blank");
            }
        })
    }

} 