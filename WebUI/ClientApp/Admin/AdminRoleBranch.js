$(document).ready(function () {
    AdminRoleBranch.InitalizeComponent();
});
var AdminRoleBranch;
(function (AdminRoleBranch) {
    var sys = new SystemTools();
    var SysSession = GetSystemSession(Modules.AccDefCustomer);
    var Model = new G_RoleBranch();
    var BilldDetail = new Array();
    var Detail_Model = new Array();
    var GRole = new Array();
    var GBRANCH = new Array();
    var txtComp;
    var txtBranch;
    var btnAddDetails;
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);
    var CountGrid = 0;
    function InitalizeComponent() {
        InitalizeControls();
        InitializeEvents();
        GetData_Header_loader();
        GRole = GetDataTable('G_Role');
        GetComp();
    }
    AdminRoleBranch.InitalizeComponent = InitalizeComponent;
    function InitalizeControls() {
        txtComp = document.getElementById("txtComp");
        txtBranch = document.getElementById("txtBranch");
    }
    function InitializeEvents() {
        txtComp.onchange = GetBranch;
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
        GBRANCH = GetDataTable('G_BRANCH');
        txtBranch.innerHTML = "";
        for (var i = 0; i < GBRANCH.length; i++) {
            $('#txtBranch').append(' <option value = "' + GBRANCH[i].Branch_Code + '" > ' + (lang == "ar" ? GBRANCH[i].BRA_DESCE : GBRANCH[i].BRA_DESC) + ' </option>');
        }
        //Ajax.Callsync({
        //    type: "Get",
        //    url: sys.apiUrl("G_Branch", "GetAll"),
        //    data: { CompCode: Number(txtComp.value) },
        //    success: (d) => {
        //        let result = d as BaseResponse;
        //        if (result.IsSuccess) {
        //            var BranchList: Array<G_BRANCH> = result.Response as Array<G_BRANCH>;
        //            for (var i = 0; i < BranchList.length; i++) {
        //                $('#txtBranch').append(' <option value = "' + BranchList[i].Branch_Code + '" > ' + (lang == "ar" ? BranchList[i].BRA_DESCE : BranchList[i].BRA_DESC) + ' </option>');
        //            }
        //        }
        //    }
        //});
    }
    function AddNewRow() {
        ////
        if (!SysSession.CurrentPrivileges.AddNew)
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
        if (CanAdd) {
            BuildControls(CountGrid);
            $("#txt_StatusFlag" + CountGrid).val("i"); //In Insert mode 
            $("#txtCode" + CountGrid).removeAttr("disabled");
            $("#btn_minus" + CountGrid).removeClass("display_none");
            $("#btn_minus" + CountGrid).removeAttr("disabled");
            $("#btnUpdate_Def").removeClass("display_none");
            CountGrid++;
        }
        $("#btnUpdate_Def").addClass("display_none");
    }
    function BuildControls(cnt) {
        var html;
        html = "<tr id= \"No_Row" + cnt + "\"> \n                    <td>\n\t\t                <div class=\"form-group\">\n\t\t\t                <span id=\"btn_minus" + cnt + "\"><i class=\"fas fa-minus-circle btn-minus display_none\"></i></span>\n\t\t                </div>\n\t                </td>\n                    \n                    <td>\n                        <select disabled id=\"txtRole" + cnt + "\" class=\"form-control\"> \n                           <option value=\"Null\"> " + (lang == "ar" ? "اختر الفئة" : " Type_Item ") + "</option>\n                        </select>\n\t                </td>\n                     \n               <input id=\"txt_StatusFlag" + cnt + "\" type=\"hidden\"   />\n               <input id=\"txt_ID" + cnt + "\" type=\"hidden\"   />\n\n                </tr>";
        $("#div_Data").append(html);
        GetDataTable;
        for (var i = 0; i < GRole.length; i++) {
            //
            $('#txtRole' + cnt).append('<option value="' + GRole[i].RoleId + '">' + (lang == "ar" ? GRole[i].DescA : GRole[i].DescE) + '</option>');
        }
        $("#btn_minus" + cnt).on('click', function () {
            DeleteRow(cnt);
        });
        $("#txtRole" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        if (SysSession.CurrentPrivileges.Remove) {
            $("#btn_minus" + cnt).addClass("display_none");
            $("#btn_minus" + cnt).attr("disabled", "disabled");
        }
        else {
            $("#btn_minus" + cnt).addClass("display_none");
            $("#btn_minus" + cnt).attr("disabled", "disabled");
        }
        return;
    }
    function DeleteRow(RecNo) {
        if (!SysSession.CurrentPrivileges.Remove)
            return;
        WorningMessage("هل تريد الحذف؟", "Do you want to delete?", "تحذير", "worning", function () {
            $("#No_Row" + RecNo).attr("hidden", "true");
            $("#txtCode" + RecNo).val("000");
            $("#txtDescA" + RecNo).val("0");
            $("#txt_StatusFlag" + RecNo).val() == 'i' ? $("#txt_StatusFlag" + RecNo).val('m') : $("#txt_StatusFlag" + RecNo).val('d');
        });
    }
    function Validation_Grid(rowcount) {
        if ($("#txt_StatusFlag" + rowcount).val() == "d" || $("#txt_StatusFlag" + rowcount).val() == "m") {
            return true;
        }
        else {
            if ($("#txtCode" + rowcount).val() == '') {
                WorningMessage('ادخل كود', 'Enter The code', 'خطاء', 'Erorr');
                Errorinput($("#txtCode" + rowcount));
                return false;
            }
        }
        return true;
    }
    $('#btnUpdate_Def').on('click', function () {
        if (SysSession.CurrentPrivileges.EDIT) {
            $('#btnSave_Def').removeClass("display_none");
            $('#btnBack_Def').removeClass("display_none");
            $("#div_ContentData :input").removeAttr("disabled");
            $("#btnUpdate_Def").addClass("display_none");
        }
        else {
            $('#btnSave_Def').addClass("display_none");
            $('#btnBack_Def').addClass("display_none");
            $("#btnUpdate_Def").removeClass("display_none");
        }
        if (SysSession.CurrentPrivileges.AddNew) {
            $(".btnAddDetails").removeAttr("disabled");
            $('#btnAddDetails').attr('class', 'glyphicon glyphicon-plus-sign');
        }
        else {
            $(".btnAddDetails").attr("disabled", "disabled");
        }
        if (SysSession.CurrentPrivileges.Remove) {
            //
            $(".fa-minus-circle").removeClass("display_none");
        }
        else {
            $(".fa-minus-circle").addClass("display_none");
        }
    });
    function btnBack_Def_onclick() {
        $('#btnBack_Def').addClass("display_none");
        $('#btnSave_Def').addClass("display_none");
        $('#btnAddDetails').attr('class', 'glyphicon glyphicon-plus-sign  display_none');
        $("#div_ContentData :input").attr("disabled", "true");
        $(".fa-minus-circle").addClass("display_none");
        $("#btnUpdate_Def").removeClass("display_none");
        $("#btnUpdate_Def").removeAttr("disabled");
        $("#drpPaymentType").removeAttr("disabled");
        CountGrid = 0;
        $("#div_Data").html("");
    }
    function btnSave_Def_onClick() {
        loading('btnSave_Def');
        setTimeout(function () {
            finishSave('btnSave_Def');
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
                Update();
            }
        }, 100);
    }
    function refresh() {
        $('#div_Data').html("");
        CountGrid = 0;
    }
    function Update() {
        Assign();
        Detail_Model[0].Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
        Detail_Model[0].UserCode = SysSession.CurrentEnvironment.UserCode;
        Detail_Model[0].Branch_Code = SysSession.CurrentEnvironment.BranchCode;
        Detail_Model[0].Comp_Code = SysSession.CurrentEnvironment.CompCode;
        Detail_Model[0].MODULE_CODE = Modules.StkDefItemType;
        Detail_Model[0].UserCode = SysSession.CurrentEnvironment.UserCode;
        Detail_Model[0].sec_FinYear = SysSession.CurrentEnvironment.CurrentYear;
        //
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("StkDefItemType", "Updatelist"),
            data: JSON.stringify(Detail_Model),
            success: function (d) {
                //
                var result = d;
                if (result.IsSuccess == true) {
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
                        MessageBox.Show("تم الحفظ", "");
                    }
                    else {
                        MessageBox.Show("Done", "");
                    }
                    btnBack_Def_onclick();
                    refresh();
                }
                else {
                    //
                    MessageBox.Show(result.ErrorMessage, "خطأ");
                }
            }
        });
    }
    function Assign() {
        Detail_Model = new Array();
        var StatusFlag;
        for (var i = 0; i < CountGrid; i++) {
            Model = new G_RoleBranch();
            StatusFlag = $("#txt_StatusFlag" + i).val();
            $("#txt_StatusFlag" + i).val("");
            if (StatusFlag == "i") {
                Model.StatusFlag = StatusFlag.toString();
                Model.COMP_CODE = Number(SysSession.CurrentEnvironment.CompCode);
                Model.RoleId = 0;
                Detail_Model.push(Model);
            }
            if (StatusFlag == "u") {
                Model.StatusFlag = StatusFlag.toString();
                Model.COMP_CODE = Number(SysSession.CurrentEnvironment.CompCode);
                Model.RoleId = $("#txtRole" + i).val();
                Detail_Model.push(Model);
            }
            if (StatusFlag == "d") {
                if ($("#txt_ID" + i).val() != "") {
                    Model.StatusFlag = StatusFlag.toString();
                    Model.RoleId = $("#txtRole" + i).val();
                    Detail_Model.push(Model);
                }
            }
        }
    }
    function GetData_Header_loader() {
        var Table;
        Table =
            [
                { NameTable: 'G_COMPANY', Condition: "" },
                { NameTable: 'G_BRANCH', Condition: "COMP_CODE = '" + txtComp.value + "'" },
                { NameTable: 'G_Role', Condition: "" },
            ];
        DataResult(Table);
        FillDropwithAttr(GetDataTable('G_COMPANY'), "txtComp", "COMP_CODE", "NameA", (lang == "ar" ? "الجميع" : "All"), "", "");
        FillDropwithAttr(GetDataTable('G_BRANCH'), "txtBranch", "Branch_Code", (lang == "ar" ? "BRA_DESCE" : "BRA_DESCE"), (lang == "ar" ? "الجميع" : "All"), "", "");
        FillDropwithAttr(GetDataTable('G_Role'), "txtBranch", "RoleId", (lang == "ar" ? "DescA" : "DescE"), (lang == "ar" ? "الجميع" : "All"), "", "");
    }
})(AdminRoleBranch || (AdminRoleBranch = {}));
//# sourceMappingURL=AdminRoleBranch.js.map