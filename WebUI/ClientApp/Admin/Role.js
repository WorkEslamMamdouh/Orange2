$(document).ready(function () {
    Role.InitalizeComponent();
});
var Role;
(function (Role) {
    var sys = new SystemTools();
    var SysSession = GetSystemSession(Modules.AdminRoleBranch);
    var ModelGRole = new G_Role();
    var masterDetail = new G_RoleModuleMaste();
    var Model = new G_RoleModule();
    var Detail_Model = new Array();
    var GetRoleBranch = new Array();
    var GRole = new Array();
    var GSearchFormModule = new Array();
    var GSearchForm = new Array();
    var GRoleModule = new Array();
    var RoleModule = new Array();
    var SelecteData = new Array();
    var GBRANCH = new Array();
    var Grid = new JsGrid();
    var btnAdd;
    var btnSave;
    var btnBack;
    var btnEdit;
    var IsNew = true;
    var txtComp;
    var txtBranch;
    var btnAddDetails;
    var btnAddDetails3;
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);
    var CountGrid = 0;
    var CountGrid3 = 0;
    var Newcount = 0;
    var Newcount3 = 0;
    var RoleId_;
    function InitalizeComponent() {
        InitalizeControls();
        InitializeEvents();
        GetData_Header_loader();
        GRole = GetDataTable('G_Role');
        BindGrid();
        InitializeGrid();
        // GetComp();
    }
    Role.InitalizeComponent = InitalizeComponent;
    function InitalizeControls() {
        btnAdd = document.getElementById("btnAdd");
        btnSave = document.getElementById("btnSave");
        btnBack = document.getElementById("btnBack");
        btnEdit = document.getElementById("btnEdit");
        btnAddDetails = document.getElementById("btnAddDetails");
    }
    function InitializeEvents() {
        btnAddDetails.onclick = AddNewRow;
        btnAdd.onclick = btnAdd_onclick;
        btnSave.onclick = btnSave_onclick;
        btnBack.onclick = btnBack_onclick;
        btnEdit.onclick = btnEdit_onclick;
    }
    function BindGrid() {
        debugger;
        Grid.DataSource = GRole;
        Grid.Bind();
    }
    function InitializeGrid() {
        debugger;
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
        Grid.PrimaryKey = "RoleId";
        Grid.Columns = [
            { title: res.App_Number, name: "RoleId", type: "text", width: "0%", visible: false },
            { title: " DescA  ", name: "DescA", type: "text", width: "15%" },
            { title: "DescE", name: "DescE", type: "text", width: "15%" },
            { title: "IsAvailable", name: "IsAvailable", type: "text", width: "5%" },
            { title: "IsShowable", name: "IsShowable", type: "text", width: "5%" },
            { title: "RoleType", name: "RoleType", type: "text", width: "5%" },
        ];
        BindGrid();
        //InitializeStoreGrid();
    }
    function Grid_RowDoubleClicked() {
        debugger;
        $("#div_BasicData :input").attr("disabled", "disabled");
        $("#btnEdit").addClass("display_none");
        $("#btnEdit").removeClass("display_none");
        $("#btnSave").addClass("display_none");
        $("#btnBack").addClass("display_none");
        SelecteData = GRole.filter(function (x) { return x.RoleId == Number(Grid.SelectedKey); });
        DocumentActions.RenderFromModel(SelecteData[0]);
        $("#data_lebel").removeClass("display_none");
        $("#data_lebel2").removeClass("display_none");
        if (SelecteData[0].IsAvailable == false) {
            $("#txtIsAvailable").val("0");
        }
        else {
            $("#txtIsAvailable").val("1");
        }
        if (SelecteData[0].IsShowable == false) {
            $("#txtIsShowable").val("0");
        }
        else {
            $("#txtIsShowable").val("1");
        }
        Display();
    }
    function btnAdd_onclick() {
        IsNew = true;
        EnableControls();
        $("#id_div_Add").attr("disabled", "disabled").off('click');
        $("#GridDetails").addClass("disabledDiv");
        $("#DataDetails").html('');
        CountGrid = 0;
        $('#btnAddDetails').removeClass("display_none");
        $('#data_lebel').removeClass("display_none");
        $('#data_lebel2').removeClass("display_none");
        $('#div_BasicData').removeClass("display_none");
        $("#div_BasicData :input").val("");
        $("#div_BasicData :input").removeAttr("disabled");
        $("#DataDetails :input").removeAttr("disabled");
    }
    function EnableControls() {
        $("#Div_control").removeClass("display_none");
        $('#btnSave').removeClass("display_none");
        $('#btnBack').removeClass("display_none");
        $('#btnEdit').addClass("display_none");
        $('#txt_Category').prop("selectedIndex", 0);
    }
    function btnEdit_onclick() {
        IsNew = false;
        $("#btnBack").removeClass("display_none");
        $("#btnSave").removeClass("display_none");
        $("#btnEdit").addClass("display_none");
        $("#btnEdit").addClass("display_none");
        $("#btnAddDetails").removeClass("display_none");
        $("#GridDetails").attr("disabled", "disabled").off('click');
        $("#GridDetails").addClass("disabledDiv");
        $("#div_BasicData :input").removeAttr("disabled");
        Enabel();
    }
    function btnSave_onclick() {
        setTimeout(function () {
            finishSave('btnSave');
            if (!validation())
                return;
            debugger;
            Newcount = 0;
            var CanAdd = true;
            if (CountGrid > 0) {
                for (var i = 0; i < CountGrid; i++) {
                    CanAdd = Validation_Grid(i);
                    if (CanAdd == false) {
                        break;
                    }
                }
            }
            if (CanAdd) {
                if (IsNew == true) {
                    Assign();
                    Insert();
                }
                else {
                    Assign();
                    Update();
                }
            }
        }, 100);
    }
    function btnBack_onclick() {
        debugger;
        if (IsNew == true) {
            $("#btnEdit").addClass("display_none");
            $("#btnSave").addClass("display_none");
            $("#btnBack").addClass("display_none");
            $("#data_lebel").addClass("display_none");
            $("#data_lebel2").addClass("display_none");
            $("#GridDetails").removeAttr("disabled").off('click');
            $("#GridDetails").removeClass("disabledDiv");
            $("#div_BasicData :input").attr("disabled", "disabled");
            Disabled();
            InitalizeComponent();
        }
        else {
            $("#btnEdit").removeClass("display_none");
            $("#btnSave").addClass("display_none");
            $("#btnBack").addClass("display_none");
            $("#GridDetails").removeAttr("disabled").off('click');
            $("#GridDetails").removeClass("disabledDiv");
            $("#div_BasicData :input").attr("disabled", "disabled");
            Disabled();
        }
    }
    function validation() {
        if ($("#txtDescA").val() == "" || $("#txtDescA").val() == "") {
            DisplayMassage(" يجب ادخال اسم عربي  ", "Please, Enter The CompCode!", MessageType.Worning);
            Errorinput($("#txtDescA"));
            return false;
        }
        if ($("#txtDescE").val() == "" || $("#txtDescA").val() == "") {
            DisplayMassage(" يجب ادخال اسم انجليزي  ", "Please, Enter The CompCode!", MessageType.Worning);
            Errorinput($("#txtDescE"));
            return false;
        }
        if ($("#txtRemarks").val() == "" || $("#txtRemarks").val() == "") {
            DisplayMassage(" يجب ادخال الوصف الوصف لتفصيل الصلاحية  ", "Please, Enter The CompCode!", MessageType.Worning);
            Errorinput($("#txtRemarks"));
            return false;
        }
        return true;
    }
    function succes() {
        Disabled();
        $("#btnEdit").removeClass("display_none");
        $("#btnBack").addClass("display_none");
        $("#btnSave").addClass("display_none");
        if (IsNew == false) {
        }
        else {
            $("#btnEdit").removeClass("display_none");
            $("#btnSave").addClass("display_none");
            $("#btnBack").addClass("display_none");
            Disabled();
        }
    }
    function Display() {
        GRoleModule = GetDataTable('G_RoleModule');
        RoleModule = GRoleModule.filter(function (x) { return x.RoleId == SelecteData[0].RoleId; });
        $("#DataDetails").html('');
        CountGrid = 0;
        for (var i = 0; i < RoleModule.length; i++) {
            BuildControls(i);
            Disbly_BuildControls(i, RoleModule);
            CountGrid += 1;
        }
    }
    function Disbly_BuildControls(cnt, GetRoleModule) {
        debugger;
        $("#btnAddDetails").addClass("display_none");
        $("#btn_minus3" + cnt).addClass("display_none");
        $("#txt_StatusFlag" + cnt).val("");
        $("#MODULE_CODE" + cnt).val(GetRoleModule[cnt].MODULE_CODE);
        $("#txtRole" + cnt).val(GetRoleModule[cnt].RoleId);
        $("#SYSTEM_CODE" + cnt).val(GetRoleModule[cnt].SYSTEM_CODE);
        $("#SUB_SYSTEM_CODE" + cnt).val(GetRoleModule[cnt].SUB_SYSTEM_CODE);
        var EXECUTE = document.getElementById("EXECUTE" + cnt);
        if (GetRoleModule[cnt].EXECUTE == true) {
            EXECUTE.checked = true;
        }
        else {
            EXECUTE.checked = false;
        }
        var VIEW = document.getElementById("VIEW" + cnt);
        if (GetRoleModule[cnt].VIEW == true) {
            VIEW.checked = true;
        }
        else {
            VIEW.checked = false;
        }
        var CREATE = document.getElementById("CREATE" + cnt);
        if (GetRoleModule[cnt].CREATE == true) {
            CREATE.checked = true;
        }
        else {
            CREATE.checked = false;
        }
        var EDIT = document.getElementById("EDIT" + cnt);
        if (GetRoleModule[cnt].EDIT == true) {
            EDIT.checked = true;
        }
        else {
            EDIT.checked = false;
        }
        var DELETE = document.getElementById("DELETE" + cnt);
        if (GetRoleModule[cnt].DELETE == true) {
            DELETE.checked = true;
        }
        else {
            DELETE.checked = false;
        }
        var CUSTOM1 = document.getElementById("CUSTOM1" + cnt);
        if (GetRoleModule[cnt].CUSTOM1 == true) {
            CUSTOM1.checked = true;
        }
        else {
            CUSTOM1.checked = false;
        }
        var CUSTOM2 = document.getElementById("CUSTOM2" + cnt);
        if (GetRoleModule[cnt].CUSTOM2 == true) {
            CUSTOM2.checked = true;
        }
        else {
            CUSTOM2.checked = false;
        }
    }
    function AddNewRow() {
        debugger;
        Newcount = 0;
        var CanAdd = true;
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
            $("#txt_StatusFlag" + CountGrid).val("i");
            $("#btn_minus" + CountGrid).removeClass("display_none");
            $("#btn_minus" + CountGrid).removeAttr("disabled");
            $("#MODULE_CODE" + i).removeAttr("disabled");
            $("#SYSTEM_CODE" + i).removeAttr("disabled");
            $("#SUB_SYSTEM_CODE" + i).removeAttr("disabled");
            $("#VIEW" + i).removeAttr("disabled");
            $("#EXECUTE" + i).removeAttr("disabled");
            $("#CREATE" + i).removeAttr("disabled");
            $("#EDIT" + i).removeAttr("disabled");
            $("#DELETE" + i).removeAttr("disabled");
            $("#CUSTOM1" + i).removeAttr("disabled");
            $("#CUSTOM2" + i).removeAttr("disabled");
            CountGrid++;
        }
    }
    function BuildControls(cnt) {
        var html;
        html = '<div id="No_Row' + cnt + '" class=" font_header col-lg-12" style="bottom: 5px;font-weight:bold;padding-top: 9px;">' +
            '<span id="btn_minus' + cnt + '" class="fa fa-minus-circle fontitm4user lebelminus display_none"></span>' +
            '<div class="col-lg-2" style="width: 22%;"> <select disabled id="MODULE_CODE' + cnt + '" class="form-control"><option value="null">  MODULE_CODE اختر   </option> </select>  </div>' +
            '<div class="col-lg-1" style=""> <input id="SYSTEM_CODE' + cnt + '" disabled name=" " type="text" class="form-control"/>  </div>' +
            '<div class="col-lg-1" style=""> <input id="SUB_SYSTEM_CODE' + cnt + '" disabled name=" " type="text" class="form-control"/>  </div>' +
            '<div class="col-lg-1" style=""> <input type="checkbox" class="checkbox" id="VIEW' + cnt + '" disabled name="">  </div>' +
            '<div class="col-lg-1" style=""> <input type="checkbox" class="checkbox" id="EXECUTE' + cnt + '" disabled name="">  </div>' +
            '<div class="col-lg-1" style=""> <input type="checkbox" class="checkbox" id="CREATE' + cnt + '" disabled name="">  </div>' +
            '<div class="col-lg-1" style=""> <input type="checkbox" class="checkbox" id="EDIT' + cnt + '" disabled name="">  </div>' +
            '<div class="col-lg-1" style=""> <input type="checkbox" class="checkbox" id="DELETE' + cnt + '" disabled name="">  </div>' +
            '<div class="col-lg-1" style=""> <input type="checkbox" class="checkbox" id="CUSTOM1' + cnt + '" disabled name="">  </div>' +
            '<div class="col-lg-1" style=""> <input type="checkbox" class="checkbox" id="CUSTOM2' + cnt + '" disabled name="">  </div>' +
            '<div class="col-lg-1" style=""><input id="txt_StatusFlag' + cnt + '" name = " " type = "hidden" class="form-control"/><input id="txtRole' + cnt + '" name = " " type = "hidden" class="form-control" /><input id="BRA_CODE' + cnt + '" name = " " type = "hidden" class="form-control" /></div></div>';
        $("#DataDetails").append(html);
        for (var i = 0; i < GRole.length; i++) {
            $('#txtRole' + cnt).append('<option value="' + GRole[i].RoleId + '">' + (lang == "ar" ? GRole[i].DescA : GRole[i].DescE) + '</option>');
        }
        for (var i = 0; i < GRoleModule.length; i++) {
            $('#MODULE_CODE' + cnt).append('<option value="' + GRoleModule[i].MODULE_CODE + '">' + (lang == "ar" ? GRoleModule[i].MODULE_CODE : GRoleModule[i].MODULE_CODE) + '</option>');
        }
        $("#btn_minus" + cnt).on('click', function () {
            DeleteRow(cnt);
        });
        $("#MODULE_CODE" + cnt).on('change', function () {
            debugger;
            if (Validate_Role(cnt) == false) {
                DisplayMassage("رقم الصلاحية موجود من قبل ", "The Role already exists", MessageType.Worning);
                Errorinput($("#MODULE_CODE" + cnt));
                $("#MODULE_CODE" + cnt).val('null');
                return false;
            }
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        $("#No_Row" + cnt).on('click', function () {
            debugger;
            Display3($("#MODULE_CODE" + cnt).val());
        });
        $("#SYSTEM_CODE" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        $("#SUB_SYSTEM_CODE" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        $("#VIEW" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        $("#EXECUTE" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        $("#CREATE" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        $("#EDIT" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        $("#DELETE" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        $("#CUSTOM1" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        $("#CUSTOM2" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        return;
    }
    function DeleteRow(RecNo) {
        debugger;
        $("#No_Row" + RecNo).attr("hidden", "true");
        $("#txt_StatusFlag" + RecNo).val() == 'i' ? $("#txt_StatusFlag" + RecNo).val('m') : $("#txt_StatusFlag" + RecNo).val('d');
        var StatusFlag = $("#txt_StatusFlag" + RecNo).val();
    }
    function Validation_Grid(rowcount) {
        if ($("#txt_StatusFlag" + rowcount).val() == "d" || $("#txt_StatusFlag" + rowcount).val() == "m") {
            Newcount++;
        }
        else {
            if ($("#MODULE_CODE" + rowcount).val() == "null") {
                DisplayMassage("اختر الصلاحية", "Choose validity", MessageType.Error);
                Errorinput($("#txtRole" + rowcount));
                return false;
            }
            if ($("#SYSTEM_CODE" + rowcount).val() == "null") {
                DisplayMassage("اختر الصلاحية", "Choose validity", MessageType.Error);
                Errorinput($("#txtRole" + rowcount));
                return false;
            }
            if ($("#SUB_SYSTEM_CODE" + rowcount).val() == "null") {
                DisplayMassage("اختر الصلاحية", "Choose validity", MessageType.Error);
                Errorinput($("#txtRole" + rowcount));
                return false;
            }
        }
        return true;
    }
    function btnBack_Def_onclick() {
        $('#btnBack_Def').addClass("display_none");
        $('#btnSave_Def').addClass("display_none");
        $('#btnAddDetails').attr('class', 'glyphicon glyphicon-plus-sign  display_none');
        $(".fa-minus-circle").addClass("display_none");
        CountGrid = 0;
        $("#DataDetails").html("");
    }
    function refresh() {
        $('#DataDetails').html("");
        CountGrid = 0;
    }
    function Assign() {
        debugger;
        masterDetail = new G_RoleModuleMaste();
        Detail_Model = new Array();
        ModelGRole = DocumentActions.AssignToModel(ModelGRole);
        debugger;
        ModelGRole.IsAvailable = $("#txtIsAvailable").prop("checked");
        ModelGRole.IsShowable = $("#txtIsShowable").prop("checked");
        var StatusFlag;
        for (var i = 0; i < CountGrid; i++) {
            Model = new G_RoleModule();
            StatusFlag = $("#txt_StatusFlag" + i).val();
            $("#txt_StatusFlag" + i).val("");
            if (StatusFlag == "i") {
                Model.StatusFlag = StatusFlag.toString();
                Model.RoleId = Number(Grid.SelectedKey);
                Model.MODULE_CODE = $("#MODULE_CODE" + i).val();
                Model.SYSTEM_CODE = $("#SYSTEM_CODE" + i).val();
                Model.SUB_SYSTEM_CODE = $("#SUB_SYSTEM_CODE" + i).val();
                Model.VIEW = $("#VIEW" + i).val();
                Model.EXECUTE = $("#EXECUTE" + i).val();
                Model.CREATE = $("#CREATE" + i).val();
                Model.EDIT = $("#EDIT" + i).val();
                Model.DELETE = $("#DELETE" + i).val();
                Model.CUSTOM1 = $("#CUSTOM1" + i).val();
                Model.CUSTOM2 = $("#CUSTOM2" + i).val();
                Detail_Model.push(Model);
            }
            if (StatusFlag == "u") {
                Model.RoleId = Number(Grid.SelectedKey);
                Model.MODULE_CODE = $("#MODULE_CODE" + i).val();
                Model.SYSTEM_CODE = $("#SYSTEM_CODE" + i).val();
                Model.SUB_SYSTEM_CODE = $("#SUB_SYSTEM_CODE" + i).val();
                Model.VIEW = $("#VIEW" + i).val();
                Model.EXECUTE = $("#EXECUTE" + i).val();
                Model.CREATE = $("#CREATE" + i).val();
                Model.EDIT = $("#EDIT" + i).val();
                Model.DELETE = $("#DELETE" + i).val();
                Model.CUSTOM1 = $("#CUSTOM1" + i).val();
                Model.CUSTOM2 = $("#CUSTOM2" + i).val();
                Detail_Model.push(Model);
            }
            if (StatusFlag == "d") {
                debugger;
                Model.StatusFlag = StatusFlag.toString();
                Model.RoleId = Number(Grid.SelectedKey);
                Model.MODULE_CODE = $("#MODULE_CODE" + i).val();
                Detail_Model.push(Model);
            }
        }
        masterDetail.G_Role = ModelGRole;
        masterDetail.G_RoleModule = Detail_Model;
    }
    function Insert() {
        debugger;
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("G_Branch", "InsertRoleModuleMasteh"),
            data: JSON.stringify(masterDetail),
            success: function (d) {
                debugger;
                var result = d;
                if (result.IsSuccess == true) {
                    RoleId_ = result.Response;
                    DisplayMassage("تم الحفظ بنجاح", "Success", MessageType.Succeed);
                    success_Insert(Number(RoleId_));
                }
                else {
                    MessageBox.Show(result.ErrorMessage, "خطأ");
                }
            }
        });
    }
    function success_Insert(id) {
        debugger;
        GetData_Header_loader();
        GRole = GetDataTable('G_Role');
        $("#GridDetails").removeAttr("disabled").off('click');
        $("#GridDetails").removeClass("disabledDiv");
        $("#div_BasicData :input").attr("disabled", "disabled");
        $("#btnEdit").removeClass("display_none");
        $("#btnSave").addClass("display_none");
        $("#btnBack").addClass("display_none");
        SelecteData = GRole.filter(function (x) { return x.RoleId == id; });
        DocumentActions.RenderFromModel(SelecteData[0]);
        $("#data_lebel").removeClass("display_none");
        $("#data_lebel2").removeClass("display_none");
        if (SelecteData[0].IsAvailable == false) {
            $("#txtIsAvailable").val("0");
        }
        else {
            $("#txtIsAvailable").val("1");
        }
        if (SelecteData[0].IsShowable == false) {
            $("#txtIsShowable").val("0");
        }
        else {
            $("#txtIsShowable").val("1");
        }
        Display();
    }
    function Update() {
        debugger;
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("G_Branch", "updateRoleModuleMasteh"),
            data: JSON.stringify(masterDetail),
            success: function (d) {
                debugger;
                var result = d;
                if (result.IsSuccess == true) {
                    RoleId_ = result.Response;
                    DisplayMassage("تم الحفظ بنجاح", "Success", MessageType.Succeed);
                    success_Insert(Number(RoleId_));
                }
                else {
                    MessageBox.Show(result.ErrorMessage, "خطأ");
                }
            }
        });
    }
    function GetData_Header_loader() {
        var Table;
        Table =
            [
                { NameTable: 'G_Role', Condition: "" },
                { NameTable: 'G_RoleModule', Condition: "" },
                { NameTable: 'G_SearchFormModule', Condition: "" },
            ];
        DataResult(Table);
        FillDropwithAttr(GetDataTable('G_Role'), "txtBranch", "RoleId", (lang == "ar" ? "DescA" : "DescE"), (lang == "ar" ? "الجميع" : "All"), "", "");
    }
    function Validate_Role(rowno) {
        debugger;
        var res = true;
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("G_Branch", "chackRoleModule"),
            data: {
                MODULE_CODE: $("#MODULE_CODE" + rowno).val(), Roleid: Number(Grid.SelectedKey)
            },
            success: function (d) {
                var result = d;
                if (result.Response == 0) {
                    res = true;
                }
                else
                    res = false;
            }
        });
        return res;
    }
    function Disabled() {
        for (var i = 0; i < CountGrid; i++) {
            $("#btn_minus" + i).addClass("display_none");
            $("#MODULE_CODE" + i).attr("disabled", "disabled");
            $("#SYSTEM_CODE" + i).attr("disabled", "disabled");
            $("#SUB_SYSTEM_CODE" + i).attr("disabled", "disabled");
            $("#VIEW" + i).attr("disabled", "disabled");
            $("#EXECUTE" + i).attr("disabled", "disabled");
            $("#CREATE" + i).attr("disabled", "disabled");
            $("#EDIT" + i).attr("disabled", "disabled");
            $("#DELETE" + i).attr("disabled", "disabled");
            $("#CUSTOM1" + i).attr("disabled", "disabled");
            $("#CUSTOM2" + i).attr("disabled", "disabled");
        }
    }
    function Enabel() {
        for (var i = 0; i < CountGrid; i++) {
            $("#btn_minus" + i).removeClass("display_none");
            $("#MODULE_CODE" + i).removeAttr("disabled");
            $("#SYSTEM_CODE" + i).removeAttr("disabled");
            $("#SUB_SYSTEM_CODE" + i).removeAttr("disabled");
            $("#VIEW" + i).removeAttr("disabled");
            $("#EXECUTE" + i).removeAttr("disabled");
            $("#CREATE" + i).removeAttr("disabled");
            $("#EDIT" + i).removeAttr("disabled");
            $("#DELETE" + i).removeAttr("disabled");
            $("#CUSTOM1" + i).removeAttr("disabled");
            $("#CUSTOM2" + i).removeAttr("disabled");
        }
    }
    function Display3(MODULE) {
        GSearchFormModule = GetDataTable('G_SearchFormModule');
        debugger;
        GSearchForm = GSearchFormModule.filter(function (x) { return x.ModuleCode == MODULE; });
        $("#DataDetails3").html('');
        CountGrid3 = 0;
        for (var i = 0; i < GSearchForm.length; i++) {
            BuildControls3(i);
            Disbly_BuildControls3(i, GSearchForm);
            CountGrid3 += 1;
        }
        $("#data_lebel3").removeClass("display_none");
    }
    function AddNewRow3() {
        debugger;
        Newcount3 = 0;
        var CanAdd = true;
        if (CountGrid3 > 0) {
            for (var i = 0; i < CountGrid3; i++) {
                CanAdd = Validation_Grid3(i);
                if (CanAdd == false) {
                    break;
                }
            }
        }
        if (CanAdd) {
            BuildControls3(CountGrid3);
            $("#txt_StatusFlag3" + CountGrid).val("i");
            $("#btn_minus3" + CountGrid).removeClass("display_none");
            $("#btn_minus3" + CountGrid).removeAttr("disabled");
            $("#MODULE_CODESearchForm" + i).removeAttr("disabled");
            $("#ControlCode" + i).removeAttr("disabled");
            $("#SearchFormCode" + i).removeAttr("disabled");
            CountGrid3++;
        }
    }
    function BuildControls3(cnt) {
        var html;
        html = '<div id="No_Row3' + cnt + '" class=" font_header col-lg-12" style="bottom: 5px;font-weight:bold;padding-top: 9px;">' +
            '<span id="btn_minus3' + cnt + '" class="fa fa-minus-circle fontitm4user lebelminus display_none"></span>' +
            '<div class="col-lg-2" style="width: 22%;"> <select disabled id="ModuleCodeSearchForm' + cnt + '" class="form-control"><option value="null">  MODULE_CODE اختر   </option> </select>  </div>' +
            '<div class="col-lg-2" style=""> <input id="ControlCode' + cnt + '" disabled name=" " type="text" class="form-control"/>  </div>' +
            '<div class="col-lg-2" style=""> <input id="SearchFormCode' + cnt + '" disabled name=" " type="text" class="form-control"/>  </div>' +
            '<div class="col-lg-1" style=""><input id="txt_StatusFlag3' + cnt + '" name = " " type = "hidden" class="form-control"/> </div></div>';
        $("#DataDetails3").append(html);
        for (var i = 0; i < GSearchForm.length; i++) {
            $('#ModuleCodeSearchForm' + cnt).append('<option value="' + GSearchForm[i].ModuleCode + '">' + (lang == "ar" ? GSearchForm[i].ModuleCode : GSearchForm[i].ModuleCode) + '</option>');
        }
        $("#btn_minus3" + cnt).on('click', function () {
            DeleteRow3(cnt);
        });
        $("#ControlCode" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        $("#SearchFormCode" + cnt).on('change', function () {
            if ($("#txt_StatusFlag3" + cnt).val() != "i")
                $("#txt_StatusFlag3" + cnt).val("u");
        });
        $("#ModuleCodeSearchForm" + cnt).on('change', function () {
            //debugger
            //if (Validate_Role(cnt) == false) {
            //    DisplayMassage("رقم الصلاحية موجود من قبل ", "The Role already exists", MessageType.Worning);
            //    Errorinput($("#MODULE_CODE" + cnt));
            //    $("#MODULE_CODE" + cnt).val('null')
            //    return false;
            //}
            if ($("#txt_StatusFlag3" + cnt).val() != "i")
                $("#txt_StatusFlag3" + cnt).val("u");
        });
        return;
    }
    function DeleteRow3(RecNo) {
        debugger;
        $("#No_Row3" + RecNo).attr("hidden", "true");
        $("#txt_StatusFlag3" + RecNo).val() == 'i' ? $("#txt_StatusFlag3" + RecNo).val('m') : $("#txt_StatusFlag3" + RecNo).val('d');
        var StatusFlag = $("#txt_StatusFlag3" + RecNo).val();
    }
    function Validation_Grid3(rowcount) {
        if ($("#txt_StatusFlag3" + rowcount).val() == "d" || $("#txt_StatusFlag3" + rowcount).val() == "m") {
            Newcount++;
        }
        else {
            if ($("#ModuleCodeSearchForm" + rowcount).val() == "null") {
                DisplayMassage("اختر الصلاحية", "Choose validity", MessageType.Error);
                Errorinput($("#MODULE_CODESearchForm" + rowcount));
                return false;
            }
            if ($("#ControlCode" + rowcount).val() == "null") {
                DisplayMassage("اختر الصلاحية", "Choose validity", MessageType.Error);
                Errorinput($("#ControlCode" + rowcount));
                return false;
            }
            if ($("#SearchFormCode" + rowcount).val() == "null") {
                DisplayMassage("اختر الصلاحية", "Choose validity", MessageType.Error);
                Errorinput($("#SearchFormCode" + rowcount));
                return false;
            }
        }
        return true;
    }
    function Disbly_BuildControls3(cnt, GetG_SearchForm) {
        debugger;
        $("#btnAddDetails3").addClass("display_none");
        $("#btn_minus3" + cnt).addClass("display_none");
        $("#txt_StatusFlag3" + cnt).val("");
        $("#ModuleCodeSearchForm" + cnt).val(GetG_SearchForm[cnt].ModuleCode);
        $("#ControlCode" + cnt).val(GetG_SearchForm[cnt].ControlCode);
        $("#SearchFormCode" + cnt).val(GetG_SearchForm[cnt].SearchFormCode);
    }
})(Role || (Role = {}));
//# sourceMappingURL=Role.js.map