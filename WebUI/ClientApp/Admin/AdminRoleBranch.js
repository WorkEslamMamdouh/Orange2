$(document).ready(function () {
    AdminRoleBranch.InitalizeComponent();
});
var AdminRoleBranch;
(function (AdminRoleBranch) {
    var sys = new SystemTools();
    var SysSession = GetSystemSession(Modules.AdminRoleBranch);
    var Model = new G_RoleBranch();
    var Detail_Model = new Array();
    var GetRoleBranch = new Array();
    var GRole = new Array();
    var GBRANCH = new Array();
    var btnSave;
    var btnBack;
    var btnEdit;
    var IsNew = true;
    var txtComp;
    var txtBranch;
    var btnAddDetails;
    var btnPermissionsrole;
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);
    var CountGrid = 0;
    function InitalizeComponent() {
        InitalizeControls();
        InitializeEvents();
        GetData_Header_loader();
        GetComp();
    }
    AdminRoleBranch.InitalizeComponent = InitalizeComponent;
    function InitalizeControls() {
        btnSave = document.getElementById("btnSave");
        btnBack = document.getElementById("btnBack");
        btnEdit = document.getElementById("btnEdit");
        txtComp = document.getElementById("txtComp");
        txtBranch = document.getElementById("txtBranch");
        btnAddDetails = document.getElementById("btnAddDetails");
        btnPermissionsrole = document.getElementById("btnPermissionsrole");
    }
    function InitializeEvents() {
        txtComp.onchange = txtComp_onchange;
        txtBranch.onchange = txtBranch_onchange;
        btnAddDetails.onclick = AddNewRow;
        btnPermissionsrole.onclick = Update;
        //btnAdd.onclick = btnAdd_onclick;
        btnSave.onclick = btnSave_onclick;
        btnBack.onclick = btnBack_onclick;
        btnEdit.onclick = btnEdit_onclick;
    }
    function btnEdit_onclick() {
        $("#btnBack").removeClass("display_none");
        $("#btnSave").removeClass("display_none");
        $("#btnEdit").addClass("display_none");
        $("#btnEdit").addClass("display_none");
        $("#btnAddDetails").removeClass("display_none");
        txtComp.disabled = true;
        txtBranch.disabled = true;
        for (var i = 0; i < CountGrid; i++) {
            // $("#txtRole" + i).removeAttr("disabled");
            $("#btn_minus" + i).removeClass("display_none");
        }
    }
    function btnSave_onclick() {
        debugger;
        if (!validation())
            return;
        var CanAdd = true;
        if (CountGrid > 0) {
            for (var i = 0; i < CountGrid; i++) {
                CanAdd = Validation_Grid(i);
                if (CanAdd == false) {
                    break;
                }
            }
        }
        if (CanAdd && CountGrid > 0) {
            Assign();
            Update();
            succes();
        }
        else {
            DisplayMassage('( برجاء اختيار الصلاحيه )', '(Error)', MessageType.Error);
        }
    }
    function validation() {
        if (txtComp.value == "" || txtComp.value.trim() == "") {
            DisplayMassage("يجب اختيار الشركة  ", "Please, Enter The CompCode!", MessageType.Worning);
            Errorinput(txtComp);
            return false;
        }
        if (txtBranch.value == "" || txtBranch.value.trim() == "") {
            DisplayMassage("يجب اختيار القرع  ", "Please, Enter The BranchCode!", MessageType.Worning);
            Errorinput(txtBranch);
            return false;
        }
        return true;
    }
    function succes() {
        Disabled();
        // $("#divcompinformtion").removeClass("display_none");
        $("#btnEdit").removeClass("display_none");
        $("#btnBack").addClass("display_none");
        $("#btnSave").addClass("display_none");
        if (IsNew == false) {
            //Grid_RowDoubleClicked();
        }
        else {
            $("#btnEdit").removeClass("display_none");
            $("#btnSave").addClass("display_none");
            $("#btnBack").addClass("display_none");
            Disabled();
        }
    }
    function btnBack_onclick() {
        $("#btnEdit").removeClass("display_none");
        $("#btnSave").addClass("display_none");
        $("#btnBack").addClass("display_none");
        txtComp.disabled = false;
        txtBranch.disabled = false;
        $("#btnAddDetails").addClass("display_none");
        Display();
    }
    function txtComp_onchange() {
        $("#Div_DOC").removeClass("display_none");
        GetBranch();
        Display();
    }
    function txtBranch_onchange() {
        Display();
    }
    function GetComp() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("G_Branch", "GetAllCOMP"),
            //data: {},
            success: function (d) {
                var result = d;
                debugger;
                if (result.length > 0) {
                    var compList = result;
                    for (var i = 0; i < compList.length; i++) {
                        $('#txtComp').append('<option value="' + compList[i].COMP_CODE + '">' + (lang == "ar" ? compList[i].NameA : compList[i].NameE) + '</option>');
                    }
                }
            }
        });
    }
    function GetBranch() {
        debugger;
        txtBranch.innerHTML = "";
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("G_Branch", "GetAll"),
            data: { CompCode: Number(txtComp.value) },
            success: function (d) {
                var result = d;
                debugger;
                if (result.IsSuccess) {
                    var BranchList = result.Response;
                    for (var i = 0; i < BranchList.length; i++) {
                        $('#txtBranch').append(' <option value = "' + BranchList[i].BRA_CODE + '" > ' + (lang == "ar" ? BranchList[i].BRA_DESCE : BranchList[i].BRA_DESC) + ' </option>');
                    }
                }
            }
        });
    }
    function Display() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("G_Branch", "GetRoleBranch"),
            data: { CompCode: txtComp.value, BRA_CODE: txtBranch.value },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    GetRoleBranch = result.Response;
                    $("#data_lebel").html('');
                    CountGrid = 0;
                    for (var i = 0; i < GetRoleBranch.length; i++) {
                        BuildControls(i);
                        Disbly_BuildControls(i, GetRoleBranch);
                        CountGrid += 1;
                    }
                }
            }
        });
    }
    function Disbly_BuildControls(cnt, AQ_GetCustomerDoc) {
        debugger;
        $("#btnAddDetails").addClass("display_none");
        $("#btn_minus3" + cnt).addClass("display_none");
        $("#txt_StatusFlag" + cnt).val("");
        $("#COMP_CODE" + cnt).val(AQ_GetCustomerDoc[cnt].COMP_CODE);
        $("#BRA_CODE" + cnt).val(AQ_GetCustomerDoc[cnt].BRA_CODE);
        $("#txtRole" + cnt).val(AQ_GetCustomerDoc[cnt].RoleId);
    }
    function AddNewRow() {
        debugger;
        if (txtComp.value == "null") {
            DisplayMassage(" يجب اختيار الشركة ", "The company must be selected", MessageType.Worning);
            Errorinput($('#txtComp'));
            return;
        }
        else {
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
                $("#txt_StatusFlag" + CountGrid).val("i"); //In Insert mode 
                $("#txtRole" + CountGrid).removeAttr("disabled");
                $("#btn_minus" + CountGrid).removeClass("display_none");
                $("#btn_minus" + CountGrid).removeAttr("disabled");
                CountGrid++;
            }
        }
    }
    function BuildControls(cnt) {
        var html;
        html = '<div id="No_Row' + cnt + '" class=" font_header col-lg-12" style="bottom: 5px;font-weight:bold">' +
            '<span id="btn_minus' + cnt + '" class="fa fa-minus-circle fontitm4user lebelminus display_none"></span>' +
            '<div class="col-lg-5" style=""> <select disabled id="txtRole' + cnt + '" class="form-control"><option value="null">   اختر   </option> </select>  </div>' +
            '<div class="col-lg-1" style=""><input id="txt_StatusFlag' + cnt + '" name = " " type = "hidden" class="form-control"/><input id="COMP_CODE' + cnt + '" name = " " type = "hidden" class="form-control" /><input id="BRA_CODE' + cnt + '" name = " " type = "hidden" class="form-control" /></div></div>';
        $("#data_lebel").append(html);
        GetDataTable;
        for (var i = 0; i < GRole.length; i++) {
            $('#txtRole' + cnt).append('<option value="' + GRole[i].RoleId + '">' + (lang == "ar" ? GRole[i].DescA : GRole[i].DescE) + '</option>');
        }
        $("#btn_minus" + cnt).on('click', function () {
            DeleteRow(cnt);
        });
        $("#txtRole" + cnt).on('change', function () {
            debugger;
            if (Validate_Role(cnt) == false) {
                DisplayMassage("رقم الصلاحية موجود من قبل ", "The Role already exists", MessageType.Worning);
                Errorinput($("#txtRole" + cnt));
                $("#txtRole" + cnt).val('null');
                return false;
            }
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
            return true;
        }
        else {
            if ($("#txtRole" + rowcount).val() == "null") {
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
        $("#data_lebel").html("");
    }
    function refresh() {
        $('#data_lebel').html("");
        CountGrid = 0;
    }
    function Update() {
        debugger;
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("G_Branch", "InsertRoleBranch"),
            data: JSON.stringify(Detail_Model),
            success: function (d) {
                debugger;
                var result = d;
                if (result.IsSuccess == true) {
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
                        DisplayMassage('( تم تعديل بنجاح )', '(success)', MessageType.Succeed);
                    }
                    else {
                        DisplayMassage('( Done )', '(success)', MessageType.Succeed);
                    }
                    btnBack_Def_onclick();
                    refresh();
                    Display();
                    txtComp.disabled = false;
                    txtBranch.disabled = false;
                }
                else {
                    MessageBox.Show(result.ErrorMessage, "خطأ");
                }
            }
        });
    }
    function Assign() {
        debugger;
        Detail_Model = new Array();
        var StatusFlag;
        for (var i = 0; i < CountGrid; i++) {
            Model = new G_RoleBranch();
            StatusFlag = $("#txt_StatusFlag" + i).val();
            $("#txt_StatusFlag" + i).val("");
            if (StatusFlag == "i") {
                Model.StatusFlag = StatusFlag.toString();
                Model.COMP_CODE = Number(txtComp.value);
                Model.BRA_CODE = Number(txtBranch.value);
                Model.RoleId = Number($("#txtRole" + i).val());
                Detail_Model.push(Model);
            }
            if (StatusFlag == "u") {
                Model.StatusFlag = StatusFlag.toString();
                Model.COMP_CODE = Number(txtComp.value);
                Model.BRA_CODE = Number(txtBranch.value);
                Model.RoleId = Number($("#txtRole" + i).val());
                Detail_Model.push(Model);
            }
            if (StatusFlag == "d") {
                debugger;
                if (txtComp.value != "null") {
                    Model.StatusFlag = StatusFlag.toString();
                    Model.COMP_CODE = Number(txtComp.value);
                    Model.BRA_CODE = Number(txtBranch.value);
                    Model.RoleId = Number($("#txtRole" + i).val());
                    Detail_Model.push(Model);
                }
            }
        }
    }
    function GetData_Header_loader() {
        var Table;
        Table =
            [
                { NameTable: 'G_Role', Condition: "RoleType=3" },
            ];
        DataResult(Table);
        GRole = GetDataTable('G_Role');
    }
    function Validate_Role(rowno) {
        var res = true;
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("G_Branch", "chackRole"),
            data: {
                COMP_CODE: Number(txtComp.value), Branch_CODE: Number(txtBranch.value), Roleid: Number($("#txtRole" + rowno).val())
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
    }
})(AdminRoleBranch || (AdminRoleBranch = {}));
//# sourceMappingURL=AdminRoleBranch.js.map