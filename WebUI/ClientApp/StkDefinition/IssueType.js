$(document).ready(function () {
    IssueType.InitalizeComponent();
});
var IssueType;
(function (IssueType) {
    var Details = new Array();
    var DisplayDetail = new Array();
    var btnSave_Def;
    var btnAddDetails;
    var btnUpdate_Def;
    var sys = new SystemTools();
    var SysSession = GetSystemSession(Modules.IssueType);
    var Model = new I_D_IssueType();
    var AccDataData = new Array();
    var CountGrid = 0;
    var compcode; //SharedSession.CurrentEnvironment.CompCode;
    var btnBack_Def;
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);
    function InitalizeComponent() {
        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = "انواع الصرف";
        }
        else {
            document.getElementById('Screen_name').innerHTML = "Payment Type";
        }
        $('#divIconbar').addClass('hidden_Control');
        $('#icon-bar').addClass('d-none');
        $('#iconbar_Definition').removeClass('hidden_Control');
        $("#divShow").removeClass("display_none");
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        InitalizeControls();
        InitalizeEvents();
        GetddlAcc();
        Display();
    }
    IssueType.InitalizeComponent = InitalizeComponent;
    function InitalizeControls() {
        ////debugger;
        btnAddDetails = document.getElementById("btnAddDetails");
        btnUpdate_Def = document.getElementById("btnUpdate_Def");
        btnSave_Def = document.getElementById("btnSave_Def");
        btnBack_Def = document.getElementById("btnBack_Def");
        // Buton privialges for single record page
    }
    function InitalizeEvents() {
        ////debugger;
        btnAddDetails.onclick = AddNewRow; //
        btnSave_Def.onclick = btnsave_onClick;
        btnBack_Def.onclick = btnback_onclick;
        btnUpdate_Def.onclick = btnedite_onclick;
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
            $("#txt_StatusFlag" + CountGrid).val("i"); //In Insert mode         
            $("#txtDescA" + CountGrid).removeAttr("disabled");
            $("#txtDescE" + CountGrid).removeAttr("disabled");
            $("#ddlAcc" + CountGrid).removeAttr("disabled");
            $("#Txt_Remarks" + CountGrid).removeAttr("disabled");
            $("#btn_minus" + CountGrid).removeClass("display_none");
            $("#btn_minus" + CountGrid).removeAttr("disabled");
            $("#btnUpdate_Def").removeClass("display_none");
            CountGrid++;
        }
        $("#btnUpdate_Def").addClass("display_none");
    }
    function BuildControls(cnt) {
        var html = "";
        html = "<tr id= \"No_Row" + cnt + "\"> \n\t\t    \n                    <td>\n\t\t                <div class=\"form-group\">\n\t\t\t                <span id=\"btn_minus" + cnt + "\" class=\"btn-minus\" ><i class=\"fas fa-minus-circle  \"></i></span>\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n                            <input id=\"txtDescA" + cnt + "\" type=\"text\" class=\"form-control\" name=\"\" disabled />\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n                            <input id=\"txtDescE" + cnt + "\" type=\"text\" class=\"form-control\" name=\"\" disabled />\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n                            <select id=\"ddlAcc" + cnt + "\"  class=\"form-control \" disabled>\n\t\t                        <option value=\"Null\">" + (lang == "ar" ? "اختر رقم الحساب" : "Choose Account Number") + "</option>\n\t\t                    </select>\n\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n                            <input id=\"Txt_Remarks" + cnt + "\" type=\"text\" class=\"form-control\" name=\"\" disabled />\n\t\t                </div>\n\t                </td>\n\n                     <td class=\"display_none\">\n\t\t                <input id =\"txt_StatusFlag" + cnt + "\" name = \" \" type = \"text\" disabled class=\"form-control display_none\"/>\n\t\t            <input id =\"IssueTypeID" + cnt + "\" name = \" \" type = \"text\" disabled class=\"form-control display_none\"/>\n\n\t                </td>\n                   \n                </tr>";
        $("#div_Data").append(html);
        if (SysSession.CurrentPrivileges.Remove) {
            $("#btn_minus" + cnt).addClass("display_none");
            $("#btn_minus" + cnt).attr("disabled", "disabled");
        }
        else {
            $("#btn_minus" + cnt).addClass("display_none");
            $("#btn_minus" + cnt).attr("disabled", "disabled");
        }
        $(document).ready(function () {
            // Initialize select2
            $("#ddlAcc" + cnt).select2();
            // Read selected option
            $('#but_read' + cnt).click(function () {
                var username = $('#ddlAcc' + cnt + ' option:selected').text();
                var userid = $('#ddlAcc' + cnt + '').val();
                $('#result').html("id : " + userid + ", name : " + username);
            });
        });
        for (var i = 0; i < AccDataData.length; i++) {
            if (SysSession.CurrentEnvironment.ScreenLanguage == "ar")
                $('#ddlAcc' + cnt).append('<option value="' + AccDataData[i].ACC_CODE + '">' + AccDataData[i].ACC_DESCA + '</option>');
            else
                $('#ddlAcc' + cnt).append('<option value="' + AccDataData[i].ACC_CODE + '">' + AccDataData[i].ACC_DESCL + '</option>');
        }
        $("#btn_minus" + cnt).on('click', function () {
            DeleteRow(cnt);
        });
        $("#txtDescA" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        $("#txtDescE" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        $("#Txt_Remarks" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        $("#ddlAcc" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        return;
    }
    function btnsave_onClick() {
        loading('btnSave_Def');
        setTimeout(function () {
            finishSave('btnSave_Def');
            var CanAdd = true;
            if (CountGrid == 0) {
                WorningMessage('يجب الاضافة للحفظ', 'Must Add for saving', 'خطاء', 'Erorr');
                Errorinput(btnAddDetails);
                CanAdd = false;
                return;
            }
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
                Update();
            }
        }, 100);
    }
    function btnedite_onclick() {
        if (!SysSession.CurrentPrivileges.EDIT)
            return;
        $('#btnSave_Def').removeClass("display_none");
        $('#btnBack_Def').removeClass("display_none");
        $("#div_ContentData :input").removeAttr("disabled");
        $("#btnUpdate_Def").addClass("display_none");
        $(".disable").attr("disabled", "disabled");
        if (SysSession.CurrentPrivileges.Remove == true) {
            $(".btn-minus").removeClass("display_none");
        }
        else {
            $(".btn-minus").addClass("display_none");
        }
        debugger;
        if (SysSession.CurrentPrivileges.AddNew == true) {
            $(".btnAddDetails").removeAttr("disabled");
            $('#btnAddDetails').removeClass("display_none");
        }
        else {
            $(".btnAddDetails").attr("disabled", "disabled");
            $('#btnAddDetails').addClass("display_none");
        }
    }
    function Display() {
        debugger;
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("Stk_TR_IssueToCC", "GetAllIssueTypes"),
            data: {
                CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token, FinYear: SysSession.CurrentEnvironment.CurrentYear, Branch_Code: SysSession.CurrentEnvironment.BranchCode, MODULE_CODE: Modules.IssueType
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    DisplayDetail = result.Response;
                    CountGrid = 0;
                    $("#div_Data").html('');
                    for (var i = 0; i < DisplayDetail.length; i++) {
                        debugger;
                        BuildControls(i);
                        $("#IssueTypeID" + i).val(DisplayDetail[i].IssueTypeID);
                        $("#txtDescA" + i).val(DisplayDetail[i].DescA);
                        $("#txtDescE" + i).val(DisplayDetail[i].DescE);
                        $('#ddlAcc' + i + '  option[value=' + DisplayDetail[i].GL_Acc_Code + ']').prop('selected', 'selected').change();
                        $("#Txt_Remarks" + i).val(DisplayDetail[i].Remarks);
                        $("#txt_StatusFlag" + i).val("");
                        CountGrid++;
                    }
                }
            }
        });
    }
    function GetddlAcc() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GLDefAccount", "GetAccDetailByComp"),
            data: { CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                AccDataData = result.Response;
            }
        });
    }
    function DeleteRow(RecNo) {
        if (!SysSession.CurrentPrivileges.Remove)
            return;
        WorningMessage("هل تريد الحذف؟", "Do you want to delete?", "تحذير", "worning", function () {
            $("#txt_StatusFlag" + RecNo).val() == 'i' ? $("#txt_StatusFlag" + RecNo).val('m') : $("#txt_StatusFlag" + RecNo).val('d');
            $("#No_Row" + RecNo).attr("hidden", "true");
            //$("#txtCode" + RecNo).val("000");
        });
    }
    function btnback_onclick() {
        $('#btnSave_Def').addClass("display_none");
        $('#btnBack_Def').addClass("display_none");
        $("#div_ContentData :input").attr("disabled", "true");
        $(".btn-minus").addClass("display_none");
        $("#btnUpdate_Def").removeClass("display_none");
        $("#btnUpdate_Def").removeAttr("disabled");
        $(".btnAddDetails").attr("disabled", "disabled");
        $("#btnAddDetails").addClass("display_none");
        // DisplayAccDefBox();
    }
    function Validation_Grid(rowcount) {
        if ($("#txt_StatusFlag" + rowcount).val() == "d" || $("#txt_StatusFlag" + rowcount).val() == "m") {
            return true;
        }
        else {
            if ($("#txtDescA" + rowcount).val() == "") {
                $("#txtDescA" + rowcount).val($("#txtDescE" + rowcount).val());
            }
            if ($("#txtDescE" + rowcount).val() == "") {
                $("#txtDescE" + rowcount).val($("#txtDescA" + rowcount).val());
            }
            if ((lang == "ar" ? $("#txtDescA" + rowcount).val() : $("#txtDescE" + rowcount).val()) == '') {
                WorningMessage('ادخل الاسم العربي ', 'Enter The Arabic Name ', 'خطاء', 'Erorr');
                Errorinput((lang == "ar" ? $("#txtDescA" + rowcount) : $("#txtDescE" + rowcount)));
                return false;
            }
            if ($("#txtAcount" + rowcount).val() == 'Null') {
                WorningMessage('اختار رقم الحساب', 'Enter The code', 'خطاء', 'Erorr');
                Errorinput($("#txtAcount" + rowcount));
                return false;
            }
            if ($("#txtAcount_Code" + rowcount).val() == 'Null') {
                WorningMessage('اختار رقم حساب الشبكة ', 'Enter The Network Account Number', 'خطاء', 'Erorr');
                Errorinput($("#txtAcount_Code" + rowcount));
                return false;
            }
        }
        return true;
    }
    function Assign() {
        debugger;
        Details = new Array();
        var StatusFlag;
        for (var i = 0; i < CountGrid; i++) {
            Model = new I_D_IssueType();
            StatusFlag = $("#txt_StatusFlag" + i).val();
            if (StatusFlag == "i") {
                Model.StatusFlag = StatusFlag;
                Model.IssueTypeID = 0;
                Model.CompCode = Number(SysSession.CurrentEnvironment.CompCode);
                Model.DescA = $("#txtDescA" + i).val();
                Model.DescE = $("#txtDescE" + i).val();
                Model.GL_Acc_Code = $("#ddlAcc" + i).val();
                Model.Remarks = $("#Txt_Remarks" + i).val();
                Model.CreatedAt = GetDate();
                Model.CreatedBy = SysSession.CurrentEnvironment.UserCode;
                Details.push(Model);
            }
            if (StatusFlag == "u") {
                Model.StatusFlag = StatusFlag;
                Model.IssueTypeID = Number($("#IssueTypeID" + i).val());
                Model.CompCode = Number(SysSession.CurrentEnvironment.CompCode);
                Model.DescA = $("#txtDescA" + i).val();
                Model.DescE = $("#txtDescE" + i).val();
                Model.GL_Acc_Code = $("#ddlAcc" + i).val();
                Model.Remarks = $("#Txt_Remarks" + i).val();
                Model.CreatedAt = GetDate();
                Model.CreatedBy = SysSession.CurrentEnvironment.UserCode;
                Model.UpdatedAt = GetDate();
                Model.UpdatedBy = SysSession.CurrentEnvironment.UserCode;
                Details.push(Model);
            }
            if (StatusFlag == "d") {
                Model.StatusFlag = StatusFlag;
                Model.IssueTypeID = Number($("#IssueTypeID" + i).val());
                Model.CompCode = Number(SysSession.CurrentEnvironment.CompCode);
                Details.push(Model);
            }
        }
        Details[0].Branch_Code = SysSession.CurrentEnvironment.BranchCode;
        Details[0].Comp_Code = SysSession.CurrentEnvironment.CompCode;
        Details[0].MODULE_CODE = Modules.IssueType;
        Details[0].UserCode = SysSession.CurrentEnvironment.UserCode;
        Details[0].sec_FinYear = SysSession.CurrentEnvironment.CurrentYear;
    }
    function Update() {
        Assign();
        console.log(Details);
        var stringDetail = JSON.stringify(Details);
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("Stk_TR_IssueToCC", "UpdateLISTIssueTypes"),
            data: { stringDetail: stringDetail },
            success: function (d) {
                //debugger
                var result = d;
                if (result.IsSuccess == true) {
                    WorningMessage("تم الحفظ!", "Saved!", "تحذير", "worning");
                    success();
                    Save_Succ_But();
                }
                else {
                    //debugger;
                    MessageBox.Show(result.ErrorMessage, "خطأ");
                }
            }
        });
    }
    function success() {
        $('#btnSave_Def').addClass("display_none");
        $('#btnBack_Def').addClass("display_none");
        $("#div_ContentData :input").attr("disabled", "true");
        $(".btn-minus").addClass("display_none");
        $("#btnUpdate_Def").removeClass("display_none");
        $("#btnUpdate_Def").removeAttr("disabled");
        $(".btnAddDetails").attr("disabled", "disabled");
        $("#btnAddDetails").addClass("display_none");
        Display();
    }
})(IssueType || (IssueType = {}));
//# sourceMappingURL=IssueType.js.map