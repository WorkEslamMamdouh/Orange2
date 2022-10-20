$(document).ready(function () {
    Services.InitalizeComponent();
});
var Services;
(function (Services) {
    var sys = new SystemTools();
    var SysSession = GetSystemSession(Modules.Services);
    var compcode;
    var BranchCode;
    var Finyear;
    var Lang;
    var IsPur;
    var IsSls;
    var ddlServCateroryFilter;
    var searchbutmemreport;
    var btnShow;
    var btnAdd;
    var btnUpdate;
    var btnSave;
    var btnBack;
    var txt_CODE;
    var txt_DeskA;
    var txt_DeskE;
    var ddlServCaterory;
    var txtunitprice;
    var txt_unit;
    var txtCreatedBy;
    var txtCreatedAt;
    var txtUpdatedBy;
    var txtUpdatedAt;
    var Grid = new JsGrid();
    var IsNew = true;
    var Itemid = 0;
    var flag = true;
    var SelecteData = new Array();
    var AQvatServiceDetails = new Array();
    var ServCateroryFilter = new Array();
    var ddlUnitFilter = new Array();
    var Model = new AVAT_D_Service();
    function InitalizeComponent() {
        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = "الخدمات ";
        }
        else {
            document.getElementById('Screen_name').innerHTML = "Services";
        }
        $("#btnShow").addClass("d-none");
        $("#btnPrintTrview").addClass("d-none");
        $("#btnPrintTrPDF").addClass("d-none");
        $("#btnPrintTrEXEL").addClass("d-none");
        $("#btnPrintTransaction").addClass("d-none");
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);
        Finyear = Number(SysSession.CurrentEnvironment.CurrentYear);
        Lang = SysSession.CurrentEnvironment.Language;
        InitalizeControls();
        IntializeEvents();
        fillddlUnit();
        $('#Div_control').addClass("display_none");
        IsPur.checked = true;
        fillddlServCaterory();
        btnShow_onclick();
    }
    Services.InitalizeComponent = InitalizeComponent;
    function InitalizeControls() {
        IsPur = document.getElementById("IsPur");
        IsSls = document.getElementById("IsSls");
        ddlServCateroryFilter = document.getElementById("ddlServCateroryFilter");
        btnShow = document.getElementById("btnShow");
        btnAdd = document.getElementById("btnAdd");
        btnUpdate = document.getElementById("btnUpdate");
        btnSave = document.getElementById("btnSave");
        btnBack = document.getElementById("btnBack");
        txt_CODE = document.getElementById("txt_CODE");
        txt_DeskA = document.getElementById("txt_DeskA");
        txt_DeskE = document.getElementById("txt_DeskE");
        ddlServCaterory = document.getElementById("ddlServCaterory");
        txtunitprice = document.getElementById("txtunitprice");
        txt_unit = document.getElementById("txt_unit");
        txtUpdatedAt = document.getElementById("txtUpdatedAt");
        txtUpdatedBy = document.getElementById("txtUpdatedBy");
        txtCreatedAt = document.getElementById("txtCreatedAt");
        txtCreatedBy = document.getElementById("txtCreatedBy");
        searchbutmemreport = document.getElementById("searchbutmemreport");
    }
    function IntializeEvents() {
        //   btnShow.onclick = btnShow_onclick;
        btnAdd.onclick = btnAdd_onclick;
        btnUpdate.onclick = btnedit_onclick;
        btnSave.onclick = btnsave_onclick;
        btnBack.onclick = btnback_onclick;
        IsPur.onchange = btnShow_Clk;
        IsSls.onchange = btnShow_Clk;
        searchbutmemreport.onkeyup = SearchBox;
        ddlServCateroryFilter.onchange = btnShow_on;
    }
    function InitializeGrid() {
        var res = GetResourceList("");
        Grid.ElementName = "ReportGrid";
        Grid.Paging = true;
        Grid.Sorting = true;
        Grid.Editing = false;
        Grid.Inserting = false;
        Grid.OnRowDoubleClicked = ServiceGridDoubleClick;
        Grid.SelectedIndex = 1;
        Grid.PrimaryKey = "Itemid";
        Grid.Columns = [
            { title: "ID", name: "Itemid", type: "text", width: "5%", visible: false },
            { title: res.SHT_Code, name: "ItemCode", type: "text", width: "15%" },
            { title: res.App_DescA, name: "Itm_DescA", type: "text", width: "30%" },
            { title: res.App_DescE, name: "Itm_DescE", type: "text", width: "30%" },
            { title: res.APP_Category, name: (Lang == "ar" ? "Cat_DescA" : "cat_DescE"), type: "text", width: "15%" },
            { title: res.App_Tax, name: (Lang == "ar" ? "VatNatureDescA" : "VatNatureDescE"), type: "text", width: "15%" },
        ];
        BindGrid();
    }
    // Display();
    function BindGrid() {
        $('#id_ReportGrid').removeClass("display_none");
        var serCatID = 0;
        var Ispur = false;
        if (ddlServCateroryFilter.value != "null") {
            serCatID = Number(ddlServCateroryFilter.value);
        }
        if (IsPur.checked == true) {
            Ispur = true;
        }
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AVatDService", "GetAllFiltered"),
            data: { compcode: SysSession.CurrentEnvironment.CompCode, isPurchase: Ispur, SrvCatId: serCatID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    AQvatServiceDetails = result.Response;
                    Grid.DataSource = AQvatServiceDetails;
                    Grid.Bind();
                }
            }
        });
    }
    function fillddlServCaterory() {
        var serCatID = 0;
        var Ispurr = true;
        if (IsPur.checked == false) {
            Ispurr = false;
        }
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AVATSrvCategory", "GetServiceCat"),
            data: { compcode: SysSession.CurrentEnvironment.CompCode, isPurchase: Ispurr, SrvCatId: serCatID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    ServCateroryFilter = result.Response;
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
                        DocumentActions.FillCombowithdefult(ServCateroryFilter, ddlServCateroryFilter, "SrvCategoryID", "DescA", "اختر الفئة");
                        DocumentActions.FillCombowithdefult(ServCateroryFilter, ddlServCaterory, "SrvCategoryID", "DescA", "اختر الفئة");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(ServCateroryFilter, ddlServCateroryFilter, "SrvCategoryID", "DescE", "Select Category");
                        DocumentActions.FillCombowithdefult(ServCateroryFilter, ddlServCaterory, "SrvCategoryID", "DescL", "Select Category");
                    }
                }
            }
        });
        //  btnShow_onclick();
    }
    function btnShow_on() {
        flag = false;
        btnShow_onclick();
    }
    function btnShow_Clk() {
        flag = true;
        btnShow_onclick();
    }
    function fillddlUnit() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("StkDefUnit", "GetAll"),
            data: { CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    ddlUnitFilter = result.Response;
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
                        DocumentActions.FillCombowithdefult(ddlUnitFilter, txt_unit, "UomID", "DescA", "اختر الوحدة");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(ddlUnitFilter, txt_unit, "UomID", "DescE", "Select Unit");
                    }
                }
            }
        });
    }
    function Assign() {
        var pur = false;
        if (IsPur.checked == true) {
            pur = true;
        }
        Model = new AVAT_D_Service();
        DocumentActions.AssignToModel(Model);
        Model.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
        Model.UserCode = SysSession.CurrentEnvironment.UserCode;
        Model.CompCode = Number(compcode);
        Model.SrvCategoryID = Number(ddlServCaterory.value);
        //Model.DescA = txt_DeskA.value;
        //Model.DescL = txt_DeskE.value;
        //Model.ItemCode = txt_CODE.value;
        //Model.UnitPrice = Number(txtunitprice.value);
        Model.UomID = Number(txt_unit.value);
        if (IsNew == true) {
            Model.Itemid = 0;
        }
        else {
            Model.Itemid = Itemid;
        }
        Model.Branch_Code = SysSession.CurrentEnvironment.BranchCode;
        Model.Comp_Code = SysSession.CurrentEnvironment.CompCode;
        Model.MODULE_CODE = Modules.Services;
        Model.sec_FinYear = SysSession.CurrentEnvironment.CurrentYear;
    }
    function Insert() {
        $("#btnUpdate").removeClass("display_none");
        $("#btnSave").addClass("display_none");
        $("#btnBack").addClass("display_none");
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("AVatDService", "Insert"),
            data: JSON.stringify(Model),
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    DisplayMassage("تم الحفظ بنجاح", "Saved successfully", MessageType.Succeed);
                    var res = result.Response;
                    Itemid = res.Itemid;
                    txt_CODE.value = res.ItemCode;
                    succes();
                    txtCreatedAt.value = DateTimeFormat(GetDate().toString());
                    txtCreatedBy.value = SysSession.CurrentEnvironment.UserCode;
                    Save_Succ_But();
                }
                else {
                    DisplayMassage("خطأء", "Error", MessageType.Error);
                }
            }
        });
    }
    function Update() {
        Assign();
        $("#btnUpdate").removeClass("display_none");
        $("#btnSave").addClass("display_none");
        $("#btnBack").addClass("display_none");
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("AVatDService", "Update"),
            data: JSON.stringify(Model),
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    DisplayMassage("تم الحفظ بنجاح", "Saved successfully", MessageType.Succeed);
                    var res = result.Response;
                    Itemid = res.Itemid;
                    succes();
                    txtUpdatedAt.value = DateTimeFormat(GetDate().toString());
                    txtUpdatedBy.value = SysSession.CurrentEnvironment.UserCode;
                    Save_Succ_But();
                }
                else {
                    DisplayMassage("خطأء", "Error", MessageType.Error);
                }
            }
        });
    }
    function succes() {
        BindGrid();
        Disabled();
        $("#Div_control").removeClass("display_none");
        $("#btnUpdate").removeClass("display_none");
        $("#id_div_Add").removeClass("disabledDiv");
        SelecteData = AQvatServiceDetails.filter(function (x) { return x.Itemid == Number(Itemid); });
        txt_DeskA.value = SelecteData[0].Itm_DescA;
        DocumentActions.RenderFromModel(SelecteData[0]);
        ddlServCaterory.value = SelecteData[0].SrvCategoryID.toString();
        Itemid = SelecteData[0].Itemid;
        txt_DeskE.value = SelecteData[0].Itm_DescE;
        //if (IsNew == false) {
        //    txtCreatedAt.value = DateTimeFormat(GetDate().toString());
        //    txtCreatedBy.value = SysSession.CurrentEnvironment.UserCode;
        //}
    }
    function btnShow_onclick() {
        if (flag == true) {
            ddlServCateroryFilter.value = "null";
        }
        var CatVal = ddlServCateroryFilter.value;
        InitializeGrid();
        fillddlServCaterory();
        ddlServCateroryFilter.value = CatVal;
        // $('#searchbutmemreport').removeClass("display_none");
        $('#Div_control').addClass("display_none");
        //Clear();
    }
    function ServiceGridDoubleClick() {
        $("#Div_control").removeClass("display_none");
        $("#btnUpdate").removeClass("display_none");
        //   $("#id_div_Add").removeClass("disabledDiv");
        SelecteData = AQvatServiceDetails.filter(function (x) { return x.Itemid == Number(Grid.SelectedKey); });
        DocumentActions.RenderFromModel(SelecteData[0]);
        ddlServCaterory.value = SelecteData[0].SrvCategoryID.toString();
        txt_CODE.value = SelecteData[0].ItemCode;
        Itemid = SelecteData[0].Itemid;
        //$("#ddlServCaterory").prop("value", SelecteData[0].SrvCategoryID.toString())
        txt_DeskA.value = SelecteData[0].Itm_DescA;
        txt_DeskE.value = SelecteData[0].Itm_DescE;
        txtCreatedAt.value = DateTimeFormat(GetDate().toString());
        txtCreatedBy.value = SysSession.CurrentEnvironment.UserCode;
        txtUpdatedAt.value = DateTimeFormat(GetDate().toString());
        txtUpdatedBy.value = SysSession.CurrentEnvironment.UserCode;
    }
    function btnAdd_onclick() {
        IsNew = true;
        Clear();
        Enabled();
        $('#Div_control').removeClass("display_none");
        $("#btnBack").removeClass("display_none");
        $("#btnSave").removeClass("display_none");
        $("#btnUpdate").addClass("display_none");
        $("#id_div_Add").addClass("disabledDiv");
        txtCreatedAt.value = DateTimeFormat(GetDate().toString());
        txtCreatedBy.value = SysSession.CurrentEnvironment.UserCode;
    }
    function btnedit_onclick() {
        $('#Div_control').removeClass("display_none");
        $("#btnBack").removeClass("display_none");
        $("#btnSave").removeClass("display_none");
        $("#btnUpdate").addClass("display_none");
        $("#id_div_Add").addClass("disabledDiv");
        Enabled();
        IsNew = false;
        txtUpdatedAt.value = DateTimeFormat(GetDate().toString());
        txtUpdatedBy.value = SysSession.CurrentEnvironment.UserCode;
    }
    function btnsave_onclick() {
        loading('btnSave');
        setTimeout(function () {
            finishSave('btnSave');
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
        }, 100);
        //$('#Div_control').addClass("display_none");
        //$("#id_div_Add").removeClass("disabledDiv");
        //Disabled();
    }
    function btnback_onclick() {
        Disabled();
        $("#btnBack").addClass("display_none");
        $("#btnSave").addClass("display_none");
        if (IsNew == true) {
            $('#Div_control').addClass("display_none");
            $("#btnUpdate").addClass("display_none");
            $("#id_div_Add").removeClass("disabledDiv");
        }
        else {
            ServiceGridDoubleClick();
            $("#btnUpdate").removeClass("display_none");
            $("#id_div_Add").removeClass("disabledDiv");
        }
    }
    function Disabled() {
        txt_DeskA.disabled = true;
        txt_DeskE.disabled = true;
        ddlServCaterory.disabled = true;
        txtunitprice.disabled = true;
        txt_unit.disabled = true;
    }
    function Enabled() {
        txt_DeskA.disabled = false;
        txt_DeskE.disabled = false;
        ddlServCaterory.disabled = false;
        txtunitprice.disabled = false;
        txt_unit.disabled = false;
    }
    function Clear() {
        txt_DeskA.value = "";
        txt_DeskE.value = "";
        ddlServCaterory.value = "null";
        txtunitprice.value = "";
        txt_unit.value = "null";
        txtCreatedAt.value = "";
        txtCreatedBy.value = "";
        txtUpdatedAt.value = "";
        txtUpdatedBy.value = "";
        txt_CODE.value = "";
    }
    function validation() {
        if ((txt_DeskA.value == "" || txt_DeskA.value.trim() == "") && (txt_DeskE.value == "" || txt_DeskE.value.trim() == "")) {
            DisplayMassage("يجب ادخال الوصف بالعربي او الوصف بالانجليزي  ", "Please, Enter The Arabic Or English Name !", MessageType.Worning);
            Errorinput(txt_DeskA);
            Errorinput(txt_DeskE);
            return false;
        }
        if ((txt_DeskA.value == "" || txt_DeskA.value.trim() == "") && txt_DeskE.value != "") {
            txt_DeskA.value = txt_DeskE.value;
        }
        if ((txt_DeskE.value == "" || txt_DeskE.value.trim() == "") && txt_DeskA.value != "") {
            txt_DeskE.value = txt_DeskA.value;
        }
        if (ddlServCaterory.value == "" || ddlServCaterory.value == "null" || ddlServCaterory.value.trim() == "") {
            DisplayMassage("يجب ادخال الفئة", "Please, Enter The Category!", MessageType.Worning);
            Errorinput(ddlServCaterory);
            return false;
        }
        var zero = Number(txtunitprice.value);
        if (txtunitprice.value == "" || txtunitprice.value.trim() == "" || zero <= 0) {
            DisplayMassage("يجب ادخال السعر  ", "Please, Enter The Price!", MessageType.Worning);
            Errorinput(txtunitprice);
            return false;
        }
        if (txt_unit.value == "" || txt_unit.value == "null" || txt_unit.value.trim() == "") {
            DisplayMassage("يجب ادخال الوحدة  ", "Please, Enter The Unit!", MessageType.Worning);
            Errorinput(txt_unit);
            return false;
        }
        return true;
    }
    function SearchBox() {
        var SearchDetails;
        if (searchbutmemreport.value != "") {
            var search_1 = searchbutmemreport.value.toLowerCase();
            SearchDetails = AQvatServiceDetails.filter(function (x) { return x.CAT_CODE.toString().toLowerCase().search(search_1) >= 0 || x.Itm_DescA.toLowerCase().toLowerCase().search(search_1) >= 0 || x.Itm_DescE.toLowerCase().toLowerCase().search(search_1) >= 0 || x.ItemCode.toLowerCase().search(search_1) >= 0 || x.Cat_DescA.toLowerCase().search(search_1) >= 0 || x.cat_DescE.toLowerCase().search(search_1) >= 0 || x.VatNatureDescA.toLowerCase().search(search_1) >= 0 || x.VatNatureDescE.toLowerCase().search(search_1) >= 0; });
            Grid.DataSource = SearchDetails;
            Grid.Bind();
        }
        else {
            Grid.DataSource = AQvatServiceDetails;
            Grid.Bind();
        }
    }
})(Services || (Services = {}));
//# sourceMappingURL=Services.js.map