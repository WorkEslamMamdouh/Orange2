$(document).ready(function () {
    AdminBar.InitalizeComponent();
});
var AdminBar;
(function (AdminBar) {
    var compcode;
    var AccountType = 1;
    var sys = new SystemTools();
    var link = 'http://localhost:51374/';
    var SysSession = GetSystemSession('Home');
    var lang = SysSession.CurrentEnvironment.ScreenLanguage;
    var ddlCompFilter;
    var txt_BraCode;
    // var txt_CompNameA     : HTMLInputElement;
    var txt_BRA_DESCE;
    var txt_TelNum;
    var txt_Email;
    var txt_HRResponsible;
    //var txt_Address       : HTMLInputElement;
    var txt_GrpTax;
    // var txt_Tax           : HTMLInputElement;
    var txt_IDNo;
    var ddl_IdType;
    // var txt_LogoIcon      : HTMLInputElement;
    // var txt_BackgroungPic1: HTMLInputElement;
    // var txt_BackgroungPic2: HTMLInputElement;
    var ddl_Country;
    var ddl_Currency;
    var txt_Region;
    var txt_City;
    var txt_Dist;
    var txt_Street1;
    var txt_Street2;
    var txt_BuildNum1;
    var txt_BuildNum2;
    var txt_postCode;
    var txt_BRA_DESC;
    var searchbutmemreport;
    var ExceedMinPricePassword;
    var RetailInvoicePaymentDef;
    var OperationInvoicePaymentDef;
    var btnSave;
    var btnBack;
    var btnEdit;
    var btnAdd;
    var IsNew = true;
    var BRA_CODE = 0;
    var Chk_RetailInvoiceAllowed;
    var Chk_RetailInvoiceAllowed2;
    var Chk_RetailInvoiceTransCode;
    var Chk_RetailInvoiceTransCode2;
    var Chk_RetailInvoicePayment;
    var Chk_RetailInvoicePayment2;
    var Chk_RetailInvoicePayment3;
    var Chk_WholeInvoiceAllowed;
    var Chk_WholeInvoiceAllowed2;
    var Chk_WholeInvoiceTransCode;
    var Chk_WholeInvoiceTransCode2;
    var Chk_WholeInvoicePayment;
    var Chk_WholeInvoicePayment2;
    var Chk_WholeInvoicePayment3;
    var chk_AutoupdateSalesPrice;
    var chk_AutoupdateSalesPrice2;
    var Txt_SalePriceAddPerc;
    var Txt_SalePriceMinAddPerc;
    var Txt_PswPrice;
    //------------------------------------------------------------
    var CompFilter = new Array();
    var Grid = new JsGrid();
    var GridS = new JsGrid();
    var BRANCH = new Array();
    var Model = new G_BRANCH();
    var CodesTypes = new Array();
    var CountryFilter = new Array();
    var CurrencyFilter = new Array();
    var SelecteData = new Array();
    var ControlDet = new Array();
    var SelecteDataComp = new Array();
    /////////////////////////////////////////////////////////////////////// SECOND GRID //////////////////////////////////////////
    var txt_STORE_CODE;
    var txt_DescA;
    var txt_DescL;
    var txt_Tel1;
    var txt_Tel2;
    var txt_Address2;
    var txt_Remarks;
    var searchbutmemreportS;
    var btnAddStore;
    var btnSaveS;
    var btnBackS;
    var btnEditS;
    var Store = new Array();
    var SelectSData = new Array();
    var ModelS = new G_STORE();
    var IsNewS = true;
    var STR_CODE = 0;
    ////////////////////////////////////////////////////////////////////////////////
    function InitalizeComponent() {
        try {
            $('#divcompinformtion').removeClass("display_none");
            $("#btnEdit").addClass("display_none");
            InitalizeControls();
            InitalizeEvents();
            FillddlCompFilter();
            //InitializeGrid();
            Fillddl_IdType();
            Fillddl_Country();
            Fillddl_Currency();
            Disabled();
            Chk_RetailInvoiceAllowed.checked = true;
            Chk_RetailInvoicePayment.checked = true;
            Chk_RetailInvoiceTransCode.checked = true;
            Chk_WholeInvoiceAllowed.checked = true;
            Chk_WholeInvoicePayment.checked = true;
            Chk_WholeInvoiceTransCode.checked = true;
            /////////////////////////////////////////////////////////////////////// SECOND GRID //////////////////////////////////////////
            // $('#divstoreinformtion').removeClass("display_none");
            $("#btnEditS").addClass("display_none");
            $("#btnAddStore").addClass("display_none");
            DisabledStr();
        }
        catch (e) {
            MessageBox.Show("      يجب معاودة الدخول مرة اخري بستخدم الاسم وكلمة السر", "You must log in again using your name and password ", function () {
                window.location.href = "/Login/HomePage";
            }), 1000;
        }
    }
    AdminBar.InitalizeComponent = InitalizeComponent;
    function InitalizeControls() {
        ddlCompFilter = document.getElementById("ddlCompFilter");
        txt_BraCode = document.getElementById("txt_BraCode");
        //txt_CompNameA = document.getElementById("txt_CompNameA") as HTMLInputElement;
        txt_BRA_DESCE = document.getElementById("txt_BRA_DESCE");
        txt_TelNum = document.getElementById("txt_TelNum");
        txt_Email = document.getElementById("txt_Email");
        txt_HRResponsible = document.getElementById("txt_HRResponsible");
        //txt_Address = document.getElementById("txt_Address") as HTMLInputElement;
        txt_GrpTax = document.getElementById("txt_GrpTax");
        // txt_Tax = document.getElementById("txt_Tax") as HTMLInputElement;
        txt_IDNo = document.getElementById("txt_IDNo");
        ddl_IdType = document.getElementById("txt_IdType");
        //txt_LogoIcon = document.getElementById("txt_LogoIcon") as HTMLInputElement;
        //txt_BackgroungPic1 = document.getElementById("txt_BackgroungPic1") as HTMLInputElement;
        // txt_BackgroungPic2 = document.getElementById("txt_BackgroungPic2") as HTMLInputElement;
        ddl_Country = document.getElementById("txt_Country");
        ddl_Currency = document.getElementById("txt_Currency");
        txt_Region = document.getElementById("txt_Region");
        txt_City = document.getElementById("txt_City");
        txt_Dist = document.getElementById("txt_Dist");
        txt_Street1 = document.getElementById("txt_Street1");
        txt_Street2 = document.getElementById("txt_Street2");
        txt_BuildNum1 = document.getElementById("txt_BuildNum1");
        txt_BuildNum2 = document.getElementById("txt_BuildNum2");
        txt_postCode = document.getElementById("txt_postCode");
        txt_BRA_DESC = document.getElementById("txt_BRA_DESC");
        searchbutmemreport = document.getElementById("searchbutmemreport");
        chk_AutoupdateSalesPrice = document.getElementById("chk_AutoupdateSalesPrice");
        chk_AutoupdateSalesPrice2 = document.getElementById("chk_AutoupdateSalesPrice2");
        Txt_SalePriceAddPerc = document.getElementById("Txt_SalePriceAddPerc");
        Txt_SalePriceMinAddPerc = document.getElementById("Txt_SalePriceMinAddPerc");
        Txt_PswPrice = document.getElementById("Txt_PswPrice");
        Chk_RetailInvoiceAllowed = document.getElementById("Chk_RetailInvoiceAllowed");
        Chk_RetailInvoiceAllowed2 = document.getElementById("Chk_RetailInvoiceAllowed2");
        Chk_RetailInvoiceTransCode = document.getElementById("Chk_RetailInvoiceTransCode");
        Chk_RetailInvoiceTransCode2 = document.getElementById("Chk_RetailInvoiceTransCode2");
        Chk_RetailInvoicePayment = document.getElementById("Chk_RetailInvoicePayment");
        Chk_RetailInvoicePayment2 = document.getElementById("Chk_RetailInvoicePayment2");
        Chk_RetailInvoicePayment3 = document.getElementById("Chk_RetailInvoicePayment3");
        Chk_WholeInvoiceAllowed = document.getElementById("Chk_WholeInvoiceAllowed");
        Chk_WholeInvoiceAllowed2 = document.getElementById("Chk_WholeInvoiceAllowed2");
        Chk_WholeInvoiceTransCode = document.getElementById("Chk_WholeInvoiceTransCode");
        Chk_WholeInvoiceTransCode2 = document.getElementById("Chk_WholeInvoiceTransCode2");
        Chk_WholeInvoicePayment = document.getElementById("Chk_WholeInvoicePayment");
        Chk_WholeInvoicePayment2 = document.getElementById("Chk_WholeInvoicePayment2");
        Chk_WholeInvoicePayment3 = document.getElementById("Chk_WholeInvoicePayment3");
        btnAdd = document.getElementById("btnAdd");
        btnSave = document.getElementById("btnSave");
        btnBack = document.getElementById("btnBack");
        btnEdit = document.getElementById("btnEdit");
        /////////////////////////////////////////////////////////////////////// SECOND GRID //////////////////////////////////////////
        txt_STORE_CODE = document.getElementById("txt_STORE_CODE");
        txt_DescA = document.getElementById("txt_DescA");
        txt_DescL = document.getElementById("txt_DescL");
        txt_Tel1 = document.getElementById("txt_Tel1");
        txt_Tel2 = document.getElementById("txt_Tel2");
        txt_Address2 = document.getElementById("txt_Address2");
        txt_Remarks = document.getElementById("txt_Remarks");
        searchbutmemreportS = document.getElementById("searchbutmemreportS");
        btnAddStore = document.getElementById("btnAddStore");
        btnSaveS = document.getElementById("btnSaveS");
        btnBackS = document.getElementById("btnBackS");
        btnEditS = document.getElementById("btnEditS");
        ExceedMinPricePassword = document.getElementById("ExceedMinPricePassword");
        RetailInvoicePaymentDef = document.getElementById("RetailInvoicePaymentDef");
        OperationInvoicePaymentDef = document.getElementById("OperationInvoicePaymentDef");
    }
    function InitalizeEvents() {
        ddlCompFilter.onchange = ddlCompFilter_onchange;
        btnAdd.onclick = btnAdd_onclick;
        btnSave.onclick = btnSave_onclick;
        btnBack.onclick = btnBack_onclick;
        btnEdit.onclick = btnEdit_onclick;
        searchbutmemreport.onkeyup = SearchBox;
        /////////////////////////////////////////////////////////////////////// SECOND GRID //////////////////////////////////////////
        btnAddStore.onclick = btnAddStore_onclick;
        btnSaveS.onclick = btnSaveS_onclick;
        btnBackS.onclick = btnBackS_onclick;
        btnEditS.onclick = btnEditS_onclick;
        searchbutmemreportS.onkeyup = SearchSBox;
        chk_AutoupdateSalesPrice.onclick = chk_AutoupdateSalesPrice_onchange;
        chk_AutoupdateSalesPrice2.onclick = chk_AutoupdateSalesPrice2_onchange;
    }
    function ddlCompFilter_onchange() {
        InitializeGrid();
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("I_Control", "GetAll"),
            data: { CompCode: Number(ddlCompFilter.value) },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    ControlDet = result.Response;
                }
            }
        });
    }
    function BindGrid() {
        Clear();
        ClearStr();
        $('#divShow').removeClass("display_none");
        $("#divSecondGrid").addClass("display_none");
        $("#divstoreinformtion").addClass("display_none");
        var COMP_CODE = 0;
        if (ddlCompFilter.value != "null") {
            COMP_CODE = Number(ddlCompFilter.value);
        }
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GBranch", "GetById"),
            //url: link + "GBranch/GetById",
            data: { id: COMP_CODE, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    BRANCH = result.Response;
                    Grid.DataSource = BRANCH;
                    Grid.Bind();
                }
            }
        });
    }
    function InitializeGrid() {
        var res = GetResourceList("");
        Grid.ElementName = "divGridDetails";
        Grid.Paging = true;
        Grid.PageSize = 10;
        Grid.Sorting = true;
        Grid.Editing = false;
        Grid.Inserting = false;
        Grid.SelectedIndex = 1;
        Grid.OnRowDoubleClicked = Grid_RowDoubleClicked;
        Grid.OnItemEditing = function () { };
        Grid.PrimaryKey = "BRA_CODE";
        Grid.Columns = [
            { title: res.App_Number, name: "BRA_CODE", type: "text", width: "2%", visible: false },
            { title: "رقم الفرع", name: "BRA_CODE", type: "text", width: "13%" },
            { title: "اسم الفرع", name: "BRA_DESC", type: "text", width: "12%" },
            { title: "رقم التليفون", name: "Tel", type: "text", width: "20%" },
        ];
        BindGrid();
        //InitializeStoreGrid();
    }
    function Grid_RowDoubleClicked() {
        $("#divSecondGrid").removeClass("display_none");
        $("#divstoreinformtion").removeClass("display_none");
        $("#btnEditS").addClass("display_none");
        $("#btnAddStore").removeClass("display_none");
        $("#divGrid").removeClass("display_none");
        $("#btnEdit").removeClass("display_none");
        $("#btnSave").addClass("display_none");
        $("#btnBack").addClass("display_none");
        // $('#divcompinformtion').removeClass("display_none");
        SelecteData = BRANCH.filter(function (x) { return x.BRA_CODE == Number(Grid.SelectedKey); });
        DocumentActions.RenderFromModel(SelecteData[0]);
        if (SelecteData[0].RetailInvoiceAllowed == 0) {
            Chk_RetailInvoiceAllowed.checked = true;
        }
        else {
            Chk_RetailInvoiceAllowed2.checked = true;
        }
        if (SelecteData[0].RetailInvoiceTransCode == 0) {
            Chk_RetailInvoiceTransCode.checked = true;
        }
        else {
            Chk_RetailInvoiceTransCode2.checked = true;
        }
        if (SelecteData[0].RetailInvoicePayment == 0) {
            Chk_RetailInvoicePayment.checked = true;
        }
        else if (SelecteData[0].RetailInvoicePayment == 1) {
            Chk_RetailInvoicePayment2.checked = true;
        }
        else {
            Chk_RetailInvoicePayment3.checked = true;
        }
        if (SelecteData[0].WholeInvoiceAllowed == 0) {
            Chk_WholeInvoiceAllowed.checked = true;
        }
        else {
            Chk_WholeInvoiceAllowed2.checked = true;
        }
        if (SelecteData[0].WholeInvoiceTransCode == 0) {
            Chk_WholeInvoiceTransCode.checked = true;
        }
        else {
            Chk_WholeInvoiceTransCode2.checked = true;
        }
        if (SelecteData[0].WholeInvoicePayment == 0) {
            Chk_WholeInvoicePayment.checked = true;
        }
        else if (SelecteData[0].WholeInvoicePayment == 1) {
            Chk_WholeInvoicePayment2.checked = true;
        }
        else {
            Chk_WholeInvoicePayment3.checked = true;
        }
        debugger;
        if (ControlDet[0].IsLocalSalePrice == true) {
            if (SelecteData[0].AutoupdateSalesPrice == true) {
                chk_AutoupdateSalesPrice.checked = true;
                Txt_SalePriceAddPerc.disabled = false;
                Txt_SalePriceMinAddPerc.disabled = false;
            }
            else {
                chk_AutoupdateSalesPrice2.checked = true;
                Txt_SalePriceAddPerc.disabled = true;
                Txt_SalePriceMinAddPerc.disabled = true;
            }
        }
        else {
            chk_AutoupdateSalesPrice.disabled = true;
            chk_AutoupdateSalesPrice2.disabled = true;
            Txt_SalePriceMinAddPerc.disabled = true;
            Txt_SalePriceAddPerc.disabled = true;
        }
        debugger;
        Txt_PswPrice.value = SelecteData[0].ExceedMinPricePassword, toString();
        Txt_SalePriceAddPerc.value = SelecteData[0].SalePriceAddPerc.toString();
        Txt_SalePriceMinAddPerc.value = SelecteData[0].SalePriceMinAddPerc.toString();
        InitializeStoreGrid();
        var filter_Comp = CompFilter.filter(function (x) { return x.COMP_CODE == Number(ddlCompFilter.value); });
        // $("#txt_CompNameA").val(filter_Comp[0].NameA);
        //$("#txt_BRA_DESCE").val(filter_Comp[0].NameE);
        //$("#txt_BackgroungPic1").val(filter_Comp[0].BkImage1);
        //$("#txt_BackgroungPic2").val(filter_Comp[0].BkImage2);
        //$("#txt_HRResponsible").val(filter_Comp[0].HRResponsible);
        //$("#txt_LogoIcon").val(filter_Comp[0].LogoIcon);
        txt_HRResponsible.value = SelecteData[0].HRResponsible;
        ddl_IdType.value = SelecteData[0].VndIDTypeCode == null ? 'null' : SelecteData[0].VndIDTypeCode.toString();
        ddl_Country.value = SelecteData[0].NationalityID == null ? 'null' : SelecteData[0].NationalityID.toString();
        ddl_Currency.value = SelecteData[0].Currencyid == null ? 'null' : SelecteData[0].Currencyid.toString();
        Disabled();
        ClearStr();
    }
    function InitializeStoreGrid() {
        var res = GetResourceList("");
        GridS.ElementName = "divGridStoreDetails";
        GridS.Paging = true;
        GridS.PageSize = 10;
        GridS.Sorting = true;
        GridS.Editing = false;
        GridS.Inserting = false;
        GridS.SelectedIndex = 1;
        GridS.OnRowDoubleClicked = GridS_RowDoubleClicked;
        GridS.OnItemEditing = function () { };
        GridS.PrimaryKey = "StoreId";
        GridS.Columns = [
            { title: res.App_Number, name: "StoreId", type: "text", width: "2%", visible: false },
            { title: "رقم المستودع", name: "STORE_CODE", type: "text", width: "10%" },
            { title: "اسم المستودع", name: (lang == "ar" ? "DescA" : "DescL"), type: "text", width: "30%" },
            //{ title: "اسم المستودع", name: "DescA", type: "text", width: "12%" },
            { title: "العنوان", name: "Address", type: "text", width: "30%" },
        ];
        BindStoreGrid();
    }
    function BindStoreGrid() {
        $('#divStoreShow').removeClass("display_none");
        var branch = Number(Grid.SelectedKey);
        var COMP_CODE = Number(ddlCompFilter.value);
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("DefStore", "GetAll"),
            //url: link + "DefStore/GetAll",
            data: { CompCode: COMP_CODE, BranchCode: branch, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    Store = result.Response;
                    GridS.DataSource = Store;
                    GridS.Bind();
                }
            }
        });
    }
    function GridS_RowDoubleClicked() {
        $("#divstoreinformtion").removeClass("display_none");
        $("#btnEditS").removeClass("display_none");
        $("#btnSaveS").addClass("display_none");
        $("#btnBackS").addClass("display_none");
        SelectSData = Store.filter(function (x) { return x.StoreId == Number(GridS.SelectedKey); });
        DisabledStr();
        txt_STORE_CODE.value = SelectSData[0].STORE_CODE == null ? '' : SelectSData[0].STORE_CODE.toString();
        txt_DescA.value = SelectSData[0].DescA.toString();
        txt_DescL.value = SelectSData[0].DescL.toString();
        txt_Tel1.value = SelectSData[0].Tel1.toString();
        txt_Tel2.value = SelectSData[0].Tel2.toString();
        txt_Address2.value = SelectSData[0].Address.toString();
        txt_Remarks.value = SelectSData[0].Remarks.toString();
    }
    function AssignStore() {
        ModelS = new G_STORE();
        //DocumentActions.AssignToModel(Model);
        ModelS.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
        ModelS.UserCode = SysSession.CurrentEnvironment.UserCode;
        ModelS.BranchId = 1;
        ModelS.COMP_CODE = Number(ddlCompFilter.value);
        ModelS.BRA_CODE = Number(txt_BraCode.value);
        ModelS.STORE_CODE = Number(txt_STORE_CODE.value);
        ModelS.DescA = txt_DescA.value;
        ModelS.DescL = txt_DescL.value;
        ModelS.Tel1 = txt_Tel1.value;
        ModelS.Tel2 = txt_Tel2.value;
        ModelS.Address = txt_Address2.value;
        ModelS.Remarks = txt_Remarks.value;
        ModelS.CreatedBy = SysSession.CurrentEnvironment.UserCode;
        ModelS.CreatedAt = DateTimeFormat(GetDate().toString());
    }
    function InsertS() {
        IsNewS = true;
        AssignStore();
        Ajax.Callsync({
            type: "Post",
            url: sys.apiUrl("DefStore", "Insert"),
            //url: link + "DefStore/Insert",
            data: JSON.stringify(ModelS),
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    DisplayMassage("تم الحفظ بنجاح", "Saved successfully", MessageType.Succeed);
                    STR_CODE = result.Response;
                    $("#btnSaveS").addClass("display_none");
                    $("#btnBackS").addClass("display_none");
                    $("#btnEditS").removeClass("display_none");
                    DisabledStr();
                    BindStoreGrid();
                    $("#divSecondGrid").removeClass("disabledDiv");
                    SelectSData = Store.filter(function (x) { return x.StoreId == Number(STR_CODE); });
                    DisabledStr();
                    txt_STORE_CODE.value = SelectSData[0].STORE_CODE == null ? '' : SelectSData[0].STORE_CODE.toString();
                    txt_DescA.value = SelectSData[0].DescA.toString();
                    txt_DescL.value = SelectSData[0].DescL.toString();
                    txt_Tel1.value = SelectSData[0].Tel1.toString();
                    txt_Tel2.value = SelectSData[0].Tel2.toString();
                    txt_Address2.value = SelectSData[0].Address.toString();
                    txt_Remarks.value = SelectSData[0].Remarks.toString();
                }
                else {
                    DisplayMassage("خطأء", "Error", MessageType.Error);
                }
            }
        });
    }
    function UpdateS() {
        AssignStore();
        var COMP_CODE = Number(ddlCompFilter.value);
        var BRA_CODE = Number(Grid.SelectedKey);
        var STORE_CODE = Number(txt_STORE_CODE.value);
        var DescA = txt_DescA.value;
        var DescL = txt_DescL.value;
        var Tel1 = txt_Tel1.value;
        var Tel2 = txt_Tel2.value;
        var Address = txt_Address2.value;
        var Remarks = txt_Remarks.value;
        var UpdatedBy = SysSession.CurrentEnvironment.UserCode;
        //Ajax.Callsync({
        //    type: "Get",
        //    url: link + "DefStore/Update",
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("DefStore", "Update"),
            data: { BRA_CODE: BRA_CODE, STORE_CODE: STORE_CODE, DescA: DescA, DescL: DescL, Tel1: Tel1, Tel2: Tel2, Address: Address, Remarks: Remarks, UpdatedBy: UpdatedBy },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    DisplayMassage("تم الحفظ بنجاح", "Saved successfully", MessageType.Succeed);
                    // var STR_CODE = result.Response as G_STORE;
                    ModelS.UpdatedBy = SysSession.CurrentEnvironment.UserCode;
                    ModelS.UpdatedAt = DateTimeFormat(GetDate().toString());
                    $("#btnSaveS").addClass("display_none");
                    $("#btnBackS").addClass("display_none");
                    $("#btnEditS").removeClass("display_none");
                    DisabledStr();
                    BindStoreGrid();
                    $("#divSecondGrid").removeClass("disabledDiv");
                    GridS_RowDoubleClicked();
                }
            }
        });
        // Grid_RowDoubleClicked();
    }
    function FillddlCompFilter() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GComp", "GetAll"),
            //url: link +"GComp/GetAll", 
            data: { UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    CompFilter = result.Response;
                    $('#ddlCompFilter').append("<option value=null >" + (lang == "ar" ? "اختر الشركة" : "Choose Company") + "</option>");
                    for (var i = 0; i < CompFilter.length; i++) {
                        $('#ddlCompFilter').append("<option value=" + CompFilter[i].COMP_CODE + " >" + (lang == "ar" ? CompFilter[i].NameA : CompFilter[i].NameE) + "</option>");
                    }
                }
            }
        });
    }
    function Fillddl_IdType() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GCodes", "GetAll"),
            // url: link + "GCodes/GetAll",
            data: { codeType: 'VNDIDType', UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess == true) {
                    CodesTypes = result.Response;
                    DocumentActions.FillCombowithdefult(CodesTypes, ddl_IdType, "CodeValue", "DescA", " اختر نوع المعرف ");
                }
            }
        });
    }
    function Fillddl_Country() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("Nationality", "GetAll"),
            //url: link + "Nationality/GetAll",
            data: { UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess == true) {
                    CountryFilter = result.Response;
                    DocumentActions.FillCombowithdefult(CountryFilter, ddl_Country, "NationalityID", "DescA", " اختر الدولة ");
                }
            }
        });
    }
    function Fillddl_Currency() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefVendor", "GetAllCurrency"),
            // url: link + "AccDefVendor/GetAllCurrency",
            data: { UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess == true) {
                    CurrencyFilter = result.Response;
                    DocumentActions.FillCombowithdefult(CurrencyFilter, ddl_Currency, "CurrencyID", "DescA", " اختر العملة ");
                }
            }
        });
    }
    function Insert() {
        Ajax.Callsync({
            type: "Post",
            url: sys.apiUrl("GBranch", "Insert"),
            //url: link + "GBranch/Insert",
            data: JSON.stringify(Model),
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    DisplayMassage("تم الحفظ بنجاح", "Saved successfully", MessageType.Succeed);
                    BRA_CODE = result.Response;
                }
                else {
                    DisplayMassage("خطأء", "Error", MessageType.Error);
                }
            }
        });
    }
    function Assign() {
        Model = new G_BRANCH();
        DocumentActions.AssignToModel(Model);
        Model.COMP_CODE = Number(ddlCompFilter.value);
        Model.HRResponsible = txt_HRResponsible.value;
        Model.IDNo = txt_IDNo.value;
        Model.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
        Model.UserCode = SysSession.CurrentEnvironment.UserCode;
        //Model.RetailInvoiceAllowed = Number(Chk_RetailInvoiceAllowed.checked);
        if (Chk_RetailInvoiceAllowed.checked == true) {
            Model.RetailInvoiceAllowed = 0;
        }
        else {
            Model.RetailInvoiceAllowed = 1;
        }
        //Model.RetailInvoiceTransCode = Number(Chk_RetailInvoiceTransCode.checked);
        if (Chk_RetailInvoiceTransCode.checked == true) {
            Model.RetailInvoiceTransCode = 0;
        }
        else {
            Model.RetailInvoiceTransCode = 1;
        }
        if (Chk_RetailInvoicePayment.checked == true) {
            Model.RetailInvoicePayment = 0;
        }
        else if (Chk_RetailInvoicePayment2.checked == true) {
            Model.RetailInvoicePayment = 1;
        }
        else {
            Model.RetailInvoicePayment = 2;
        }
        //Model.WholeInvoiceAllowed = Number(Chk_WholeInvoiceAllowed.checked);
        if (Chk_WholeInvoiceAllowed.checked == true) {
            Model.WholeInvoiceAllowed = 0;
        }
        else {
            Model.WholeInvoiceAllowed = 1;
        }
        //Model.WholeInvoiceTransCode = Number(Chk_WholeInvoiceTransCode.checked);
        if (Chk_WholeInvoiceTransCode.checked == true) {
            Model.WholeInvoiceTransCode = 0;
        }
        else {
            Model.WholeInvoiceTransCode = 1;
        }
        if (Chk_WholeInvoicePayment.checked == true) {
            Model.WholeInvoicePayment = 0;
        }
        else if (Chk_WholeInvoicePayment2.checked == true) {
            Model.WholeInvoicePayment = 1;
        }
        else {
            Model.WholeInvoicePayment = 2;
        }
        Model.AutoupdateSalesPrice = chk_AutoupdateSalesPrice.checked == true ? true : false;
    }
    function Update() {
        $("#btnEdit").removeClass("display_none");
        $("#btnSave").addClass("display_none");
        $("#btnBack").addClass("display_none");
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("GBranch", "Update"),
            data: JSON.stringify(Model),
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    DisplayMassage("تم الحفظ بنجاح", "Saved successfully", MessageType.Succeed);
                    var BRA_CODE = result.Response;
                }
            }
        });
    }
    function btnAdd_onclick() {
        if (ddlCompFilter.value == "null") {
            DisplayMassage("اختر الشركة", "Saved successfully", MessageType.Succeed);
            return;
        }
        txt_BraCode.disabled = false;
        $("#divSecondGrid").addClass("disabledDiv");
        $("#divstoreinformtion").addClass("disabledDiv");
        // txt_CompNameA.disabled = true;
        //txt_BRA_DESCE.disabled = true;
        // txt_BackgroungPic1.disabled = true;
        // txt_BackgroungPic2.disabled = true;
        // txt_LogoIcon.disabled = true;
        //txt_HRResponsible.disabled = true;
        $("#divGrid").addClass("disabledDiv");
        $("#btnEdit").addClass("display_none");
        $("#btnSave").removeClass("display_none");
        $("#btnBack").removeClass("display_none");
        // $('#divcompinformtion').removeClass("display_none");
        Clear();
        Enabled();
        var filter_Comp = CompFilter.filter(function (x) { return x.COMP_CODE == Number(ddlCompFilter.value); });
        //$("#txt_CompNameA").val(filter_Comp[0].NameA);
        //$("#txt_BRA_DESCE").val(filter_Comp[0].NameE);
        // $("#txt_BackgroungPic1").val(filter_Comp[0].BkImage1);
        //$("#txt_BackgroungPic2").val(filter_Comp[0].BkImage2);
        IsNew = true;
        $("#btnAddStore").addClass("display_none");
    }
    function btnEdit_onclick() {
        $("#btnBack").removeClass("display_none");
        $("#btnSave").removeClass("display_none");
        $("#btnEdit").addClass("display_none");
        $("#divGrid").addClass("disabledDiv");
        $("#divSecondGrid").addClass("disabledDiv");
        $("#divstoreinformtion").addClass("disabledDiv");
        Enabled();
        // txt_CompNameA.disabled = true;
        //txt_BRA_DESCE.disabled = true;
        //txt_BackgroungPic1.disabled = true;
        //txt_BackgroungPic2.disabled = true;
        IsNew = false;
    }
    function btnSave_onclick() {
        if (!validation())
            return;
        Assign();
        if (IsNew == false) {
            Update();
        }
        else {
            Insert();
        }
        succes();
        $("#divSecondGrid").removeClass("disabledDiv");
        $("#divstoreinformtion").removeClass("disabledDiv");
    }
    function btnBack_onclick() {
        $("#btnEdit").addClass("display_none");
        $("#btnSave").removeClass("display_none");
        $("#btnBack").removeClass("display_none");
        Disabled();
        $("#divGrid").removeClass("disabledDiv");
        $("#divSecondGrid").removeClass("disabledDiv");
        $("#divstoreinformtion").removeClass("disabledDiv");
        if (IsNew == true) {
            // $("#divcompinformtion").addClass("display_none");
            $("#btnEdit").addClass("display_none");
            $("#btnSave").addClass("display_none");
            $("#btnBack").addClass("display_none");
            Disabled();
            Clear();
            ClearStr();
            $("#divSecondGrid").addClass("display_none");
            $("#divstoreinformtion").addClass("display_none");
        }
        else {
            Grid_RowDoubleClicked();
            //$("#divcompinformtion").removeClass("display_none");
        }
    }
    function Disabled() {
        txt_BraCode.disabled = true;
        //txt_CompNameA.disabled = true;
        txt_BRA_DESCE.disabled = true;
        txt_TelNum.disabled = true;
        txt_Email.disabled = true;
        txt_HRResponsible.disabled = true;
        //txt_Address.disabled = true;
        txt_GrpTax.disabled = true;
        // txt_Tax.disabled = true;
        txt_IDNo.disabled = true;
        ddl_IdType.disabled = true;
        ddl_Country.disabled = true;
        ddl_Currency.disabled = true;
        txt_Region.disabled = true;
        txt_City.disabled = true;
        txt_Dist.disabled = true;
        txt_Street1.disabled = true;
        txt_Street2.disabled = true;
        txt_BuildNum1.disabled = true;
        txt_BuildNum2.disabled = true;
        txt_postCode.disabled = true;
        ExceedMinPricePassword.disabled = true;
        RetailInvoicePaymentDef.disabled = true;
        OperationInvoicePaymentDef.disabled = true;
        txt_BRA_DESC.disabled = true;
        chk_AutoupdateSalesPrice.disabled = true;
        chk_AutoupdateSalesPrice2.disabled = true;
        Txt_SalePriceAddPerc.disabled = true;
        Txt_SalePriceMinAddPerc.disabled = true;
        Txt_PswPrice.disabled = true;
        Chk_RetailInvoiceAllowed.disabled = true;
        Chk_RetailInvoiceAllowed2.disabled = true;
        Chk_RetailInvoiceTransCode.disabled = true;
        Chk_RetailInvoiceTransCode2.disabled = true;
        Chk_RetailInvoicePayment.disabled = true;
        Chk_RetailInvoicePayment2.disabled = true;
        Chk_RetailInvoicePayment3.disabled = true;
        Chk_WholeInvoiceAllowed.disabled = true;
        Chk_WholeInvoiceAllowed2.disabled = true;
        Chk_WholeInvoiceTransCode.disabled = true;
        Chk_WholeInvoiceTransCode2.disabled = true;
        Chk_WholeInvoicePayment.disabled = true;
        Chk_WholeInvoicePayment2.disabled = true;
        Chk_WholeInvoicePayment3.disabled = true;
    }
    function Enabled() {
        txt_BRA_DESCE.disabled = false;
        txt_TelNum.disabled = false;
        txt_Email.disabled = false;
        txt_HRResponsible.disabled = false;
        txt_GrpTax.disabled = false;
        txt_IDNo.disabled = false;
        ddl_IdType.disabled = false;
        ddl_Country.disabled = false;
        ddl_Currency.disabled = false;
        txt_Region.disabled = false;
        txt_City.disabled = false;
        txt_Dist.disabled = false;
        txt_Street1.disabled = false;
        txt_Street2.disabled = false;
        txt_BuildNum1.disabled = false;
        txt_BuildNum2.disabled = false;
        txt_postCode.disabled = false;
        ExceedMinPricePassword.disabled = false;
        RetailInvoicePaymentDef.disabled = false;
        OperationInvoicePaymentDef.disabled = false;
        txt_BRA_DESC.disabled = false;
        chk_AutoupdateSalesPrice.disabled = false;
        chk_AutoupdateSalesPrice2.disabled = false;
        Txt_PswPrice.disabled = false;
        Chk_RetailInvoiceAllowed.disabled = false;
        Chk_RetailInvoiceAllowed2.disabled = false;
        Chk_RetailInvoiceTransCode.disabled = false;
        Chk_RetailInvoiceTransCode2.disabled = false;
        Chk_RetailInvoicePayment.disabled = false;
        Chk_RetailInvoicePayment2.disabled = false;
        Chk_RetailInvoicePayment3.disabled = false;
        Chk_WholeInvoiceAllowed.disabled = false;
        Chk_WholeInvoiceAllowed2.disabled = false;
        Chk_WholeInvoiceTransCode.disabled = false;
        Chk_WholeInvoiceTransCode2.disabled = false;
        Chk_WholeInvoicePayment.disabled = false;
        Chk_WholeInvoicePayment2.disabled = false;
        Chk_WholeInvoicePayment3.disabled = false;
        if (chk_AutoupdateSalesPrice2.checked == true) {
            Txt_SalePriceAddPerc.disabled = true;
            Txt_SalePriceMinAddPerc.disabled = true;
        }
    }
    function Clear() {
        txt_BraCode.value = "";
        //txt_CompNameA.value = "";
        txt_BRA_DESCE.value = "";
        txt_TelNum.value = "";
        txt_Email.value = "";
        txt_HRResponsible.value = "";
        //txt_Address.value = "";
        txt_GrpTax.value = "";
        //txt_Tax.value = "";
        txt_IDNo.value = "";
        ddl_IdType.value = "null";
        // txt_LogoIcon.value = "";
        //txt_BackgroungPic1.value = "";
        //txt_BackgroungPic2.value = "";
        ddl_Country.value = "null";
        ddl_Currency.value = "null";
        txt_Region.value = "";
        txt_City.value = "";
        txt_Dist.value = "";
        txt_Street1.value = "";
        txt_Street2.value = "";
        txt_BuildNum1.value = "";
        txt_BuildNum2.value = "";
        txt_postCode.value = "";
        txt_BRA_DESC.value = "";
        chk_AutoupdateSalesPrice.checked = true;
        chk_AutoupdateSalesPrice2.checked = false;
        Txt_SalePriceAddPerc.value = "";
        Txt_SalePriceMinAddPerc.value = "";
        Txt_PswPrice.value = "";
        ExceedMinPricePassword.value = "";
        RetailInvoicePaymentDef.value = "";
        OperationInvoicePaymentDef.value = "";
        Chk_RetailInvoiceAllowed.checked = true;
        Chk_RetailInvoicePayment.checked = true;
        Chk_RetailInvoiceTransCode.checked = true;
        Chk_WholeInvoiceAllowed.checked = true;
        Chk_WholeInvoicePayment.checked = true;
        Chk_WholeInvoiceTransCode.checked = true;
    }
    function validateEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
    function validate_email() {
        var email = $("#txt_Email").val();
        validateEmail(email);
        return validateEmail(email);
    }
    function validation() {
        var zero = Number(txt_BraCode.value);
        SelecteData = BRANCH.filter(function (x) { return x.BRA_CODE == zero; });
        if (IsNew == true && SelecteData.length > 0) {
            DisplayMassage("الرمز موجود من قبل ", "The Code already exists", MessageType.Worning);
            Errorinput(txt_BraCode);
            return false;
        }
        if (txt_BraCode.value == "" || txt_BraCode.value.trim() == "" || zero <= 0) {
            DisplayMassage("يجب ادخال الرمز  ", "Please, Enter The Code!", MessageType.Worning);
            Errorinput(txt_BraCode);
            return false;
        }
        if ((txt_BRA_DESC.value == "" || txt_BRA_DESC.value.trim() == "") && (txt_BRA_DESCE.value == "" || txt_BRA_DESCE.value.trim() == "")) {
            DisplayMassage("يجب ادخال اسم الشركة بالعربي او اسم الفرع بالانجليزي  ", "Please, Enter The Arabic Or English Branch Name !", MessageType.Worning);
            Errorinput(txt_BRA_DESC);
            Errorinput(txt_BRA_DESCE);
            return false;
        }
        if ((txt_BRA_DESC.value == "" || txt_BRA_DESC.value.trim() == "") && txt_BRA_DESCE.value != "") {
            txt_BRA_DESC.value = txt_BRA_DESCE.value;
        }
        if ((txt_BRA_DESCE.value == "" || txt_BRA_DESCE.value.trim() == "") && txt_BRA_DESC.value != "") {
            txt_BRA_DESCE.value = txt_BRA_DESC.value;
        }
        //if (txt_BRA_DESC.value == "" || txt_BRA_DESC.value.trim() == "") {
        //    DisplayMassage(" يجب ادخال اسم الفرع    ", "Please, Enter The Branch Name!", MessageType.Worning);
        //    Errorinput(txt_BRA_DESC);
        //    return false;
        //}
        //if (txt_TelNum.value == "" || txt_TelNum.value.trim() == "") {
        //    DisplayMassage("يجب ادخال رقم الهاتف  ", "Please, Enter The telephone Number!", MessageType.Worning);
        //    Errorinput(txt_TelNum);
        //    return false;
        //}
        if ($('#txt_Email').val().trim() != '') {
            if (validate_email() == false) {
                DisplayMassage("يجب ادخال البريد الالكتروني صحيح ", "You must enter a valid email", MessageType.Worning);
                Errorinput($('#txt_Email'));
                return false;
            }
        }
        if (txt_IDNo.value.trim() != "" && ddl_IdType.value == "null") {
            DisplayMassage("يجب ادخال نوع المعرف  ", "Please, Enter The Vndor ID Type Code!", MessageType.Worning);
            Errorinput(ddl_IdType);
            return false;
        }
        return true;
    }
    function succes() {
        BindGrid();
        Disabled();
        // $("#divcompinformtion").removeClass("display_none");
        $("#btnEdit").removeClass("display_none");
        $("#divGrid").removeClass("disabledDiv");
        $("#btnBack").addClass("display_none");
        $("#btnSave").addClass("display_none");
        if (IsNew == false) {
            Grid_RowDoubleClicked();
        }
        else {
            $("#divGrid").removeClass("display_none");
            $("#btnEdit").removeClass("display_none");
            $("#btnSave").addClass("display_none");
            $("#btnBack").addClass("display_none");
            // $('#divcompinformtion').removeClass("display_none");
            SelecteData = BRANCH.filter(function (x) { return x.BRA_CODE == Number(BRA_CODE); });
            DocumentActions.RenderFromModel(SelecteData[0]);
            if (SelecteData[0].RetailInvoiceAllowed == 0) {
                Chk_RetailInvoiceAllowed.checked = true;
            }
            else {
                Chk_RetailInvoiceAllowed2.checked = true;
            }
            if (SelecteData[0].RetailInvoiceTransCode == 0) {
                Chk_RetailInvoiceTransCode.checked = true;
            }
            else {
                Chk_RetailInvoiceTransCode2.checked = true;
            }
            if (SelecteData[0].RetailInvoicePayment == 0) {
                Chk_RetailInvoicePayment.checked = true;
            }
            else if (SelecteData[0].RetailInvoicePayment == 1) {
                Chk_RetailInvoicePayment2.checked = true;
            }
            else {
                Chk_RetailInvoicePayment3.checked = true;
            }
            if (SelecteData[0].WholeInvoiceAllowed == 0) {
                Chk_WholeInvoiceAllowed.checked = true;
            }
            else {
                Chk_WholeInvoiceAllowed2.checked = true;
            }
            if (SelecteData[0].WholeInvoiceTransCode == 0) {
                Chk_WholeInvoiceTransCode.checked = true;
            }
            else {
                Chk_WholeInvoiceTransCode2.checked = true;
            }
            if (SelecteData[0].WholeInvoicePayment == 0) {
                Chk_WholeInvoicePayment.checked = true;
            }
            else if (SelecteData[0].WholeInvoicePayment == 1) {
                Chk_WholeInvoicePayment2.checked = true;
            }
            else {
                Chk_WholeInvoicePayment3.checked = true;
            }
            txt_HRResponsible.value = SelecteData[0].HRResponsible;
            ddl_IdType.value = SelecteData[0].VndIDTypeCode == null ? 'null' : SelecteData[0].VndIDTypeCode.toString();
            ddl_Country.value = SelecteData[0].NationalityID == null ? 'null' : SelecteData[0].NationalityID.toString();
            ddl_Currency.value = SelecteData[0].Currencyid == null ? 'null' : SelecteData[0].Currencyid.toString();
            Disabled();
        }
    }
    function SearchBox() {
        var SearchDetails;
        if (searchbutmemreport.value != "") {
            var search_1 = searchbutmemreport.value.toLowerCase();
            SearchDetails = BRANCH.filter(function (x) { return x.BRA_CODE.toString().toLowerCase().search(search_1) >= 0 || x.BRA_DESC.toLowerCase().toLowerCase().search(search_1) >= 0; });
            Grid.DataSource = SearchDetails;
            Grid.Bind();
        }
        else {
            Grid.DataSource = BRANCH;
            Grid.Bind();
        }
    }
    /////////////////////////////////////////////////////////////////////// SECOND GRID //////////////////////////////////////////
    function DisabledStr() {
        txt_STORE_CODE.disabled = true;
        txt_DescA.disabled = true;
        txt_DescL.disabled = true;
        txt_Tel1.disabled = true;
        txt_Tel2.disabled = true;
        txt_Address2.disabled = true;
        txt_Remarks.disabled = true;
    }
    function EnabledStr() {
        txt_DescA.disabled = false;
        txt_DescL.disabled = false;
        txt_Tel1.disabled = false;
        txt_Tel2.disabled = false;
        txt_Address2.disabled = false;
        txt_Remarks.disabled = false;
    }
    function ClearStr() {
        txt_STORE_CODE.value = "";
        txt_DescA.value = "";
        txt_DescL.value = "";
        txt_Tel1.value = "";
        txt_Tel2.value = "";
        txt_Address2.value = "";
        txt_Remarks.value = "";
    }
    function btnAddStore_onclick() {
        txt_STORE_CODE.disabled = false;
        IsNewS = true;
        ClearStr();
        EnabledStr();
        $("#divSecondGrid").addClass("disabledDiv");
        $("#btnEditS").addClass("display_none");
        $("#btnSaveS").removeClass("display_none");
        $("#btnBackS").removeClass("display_none");
        $("#divstoreinformtion").removeClass("disabledDiv");
        $("#divcompinformtion").addClass("disabledDiv");
        $("#divGrid").addClass("disabledDiv");
    }
    function btnSaveS_onclick() {
        if (!validationStr()) {
            return;
        }
        if (IsNewS == false) {
            UpdateS();
        }
        else {
            InsertS();
        }
        $("#divSecondGrid").removeClass("disabledDiv");
        $("#btnEditS").removeClass("display_none");
        $("#btnSaveS").addClass("display_none");
        $("#btnBackS").addClass("display_none");
        $("#divstoreinformtion").removeClass("disabledDiv");
        $("#divcompinformtion").removeClass("disabledDiv");
        $("#divGrid").removeClass("disabledDiv");
    }
    function btnBackS_onclick() {
        $("#divSecondGrid").removeClass("disabledDiv");
        $("#divstoreinformtion").removeClass("disabledDiv");
        $("#divcompinformtion").removeClass("disabledDiv");
        $("#divGrid").removeClass("disabledDiv");
        if (IsNewS == false) {
            GridS_RowDoubleClicked();
            $("#btnEditS").removeClass("display_none");
            $("#btnSaveS").addClass("display_none");
            $("#btnBackS").addClass("display_none");
        }
        else {
            $("#btnEditS").addClass("display_none");
            $("#btnSaveS").addClass("display_none");
            $("#btnBackS").addClass("display_none");
        }
        DisabledStr();
    }
    function btnEditS_onclick() {
        $("#divSecondGrid").addClass("disabledDiv");
        $("#btnBackS").removeClass("display_none");
        $("#btnSaveS").removeClass("display_none");
        $("#btnEditS").addClass("display_none");
        //   $("#divGrid").addClass("disabledDiv");
        EnabledStr();
        IsNewS = false;
    }
    function SearchSBox() {
        var SearchDetails;
        if (searchbutmemreportS.value != "") {
            var search_2 = searchbutmemreportS.value.toLowerCase();
            SearchDetails = Store.filter(function (x) { return x.STORE_CODE.toString().toLowerCase().search(search_2) >= 0 || x.DescA.toLowerCase().toLowerCase().search(search_2) >= 0; });
            GridS.DataSource = SearchDetails;
            GridS.Bind();
        }
        else {
            GridS.DataSource = Store;
            GridS.Bind();
        }
    }
    function validationStr() {
        var zero = Number(txt_STORE_CODE.value);
        SelectSData = Store.filter(function (x) { return x.STORE_CODE == zero; });
        if (IsNewS == true && SelectSData.length > 0) {
            DisplayMassage("الرمز موجود من قبل ", "The Code already exists", MessageType.Worning);
            Errorinput(txt_STORE_CODE);
            return false;
        }
        if (txt_STORE_CODE.value == "" || txt_STORE_CODE.value.trim() == "" || zero <= 0) {
            DisplayMassage("يجب ادخال الرمز  ", "Please, Enter The Code!", MessageType.Worning);
            Errorinput(txt_STORE_CODE);
            return false;
        }
        if ((txt_DescA.value == "" || txt_DescA.value.trim() == "") && (txt_DescL.value == "" || txt_DescL.value.trim() == "")) {
            DisplayMassage("يجب ادخال اسم المستودع بالعربي او اسم المستودع بالانجليزي  ", "Please, Enter The Arabic Or English Store Name !", MessageType.Worning);
            Errorinput(txt_DescA);
            Errorinput(txt_DescL);
            return false;
        }
        if ((txt_DescA.value == "" || txt_DescA.value.trim() == "") && txt_DescL.value != "") {
            txt_DescA.value = txt_DescL.value;
        }
        if ((txt_DescL.value == "" || txt_DescL.value.trim() == "") && txt_DescA.value != "") {
            txt_DescL.value = txt_DescA.value;
        }
        //if (txt_Tel1.value == "" || txt_Tel1.value.trim() == "" || zero <= 0) {
        //    DisplayMassage("يجب ادخال رقم الهاتف  ", "Please, Enter The Phone Number!", MessageType.Worning);
        //    Errorinput(txt_Tel1);
        //    return false;
        //}
        //if (txt_Address2.value == "" || txt_Address2.value.trim() == "" || zero <= 0) {
        //    DisplayMassage("يجب ادخال العنوان  ", "Please, Enter The address!", MessageType.Worning);
        //    Errorinput(txt_Address2);
        //    return false;
        //}
        return true;
    }
    function chk_AutoupdateSalesPrice_onchange() {
        if (ControlDet[0].IsLocalSalePrice == true) {
            Txt_SalePriceAddPerc.disabled = false;
            Txt_SalePriceMinAddPerc.disabled = false;
        }
        else {
            Txt_SalePriceAddPerc.disabled = true;
            Txt_SalePriceMinAddPerc.disabled = true;
        }
    }
    function chk_AutoupdateSalesPrice2_onchange() {
        Txt_SalePriceAddPerc.disabled = true;
        Txt_SalePriceMinAddPerc.disabled = true;
    }
})(AdminBar || (AdminBar = {}));
//# sourceMappingURL=AdminBar.js.map