$(document).ready(function () {
    AccDefBox.InitalizeComponent();
});
var AccDefBox;
(function (AccDefBox) {
    var NumAccType = 1;
    var NetworkAccType = 3;
    var AccountType = 1;
    var MSG_ID;
    var Details = new Array();
    var DetailsModel = new Array();
    var Details_NumAcount = new Array();
    var Details_NetworkAcount = new Array();
    //var Details: Array<G_USERS> = new Array<G_USERS>();
    var btnNew_sub_Add_service;
    var btnSave_Def;
    var btnAddDetails;
    var btnUpdate_Def;
    var sys = new SystemTools();
    var SysSession = GetSystemSession(Modules.AccDefBox);
    var Model = new A_RecPay_D_CashBox();
    var CountGrid = 0;
    var compcode; //SharedSession.CurrentEnvironment.CompCode;
    var BranchCode; //SharedSession.CurrentEnvironment.BranchCode;
    var btnBack_Def;
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);
    function InitalizeComponent() {
        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = "تعريف الصندوق";
        }
        else {
            document.getElementById('Screen_name').innerHTML = "Fund definition";
        }
        $('#icon-bar').addClass('hidden_Control');
        $('#divIconbar').addClass('hidden_Control');
        $("#icon-bar").addClass("d-none");
        $('#iconbar_Definition').removeClass('hidden_Control');
        $("#divShow").removeClass("display_none");
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);
        InitalizeControls();
        InitalizeEvents();
        Display_Acount_Code();
        Display_Network_account_Code();
        Display();
    }
    AccDefBox.InitalizeComponent = InitalizeComponent;
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
        btnSave_Def.onclick = btnSave_Def_onClick;
        btnBack_Def.onclick = btnBack_Def_onclick;
        btnUpdate_Def.onclick = btnUpdate_Def_onclick;
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
            //$("#txtCode" + CountGrid).removeAttr("disabled");
            $("#txtDescA" + CountGrid).removeAttr("disabled");
            $("#txtDescL" + CountGrid).removeAttr("disabled");
            //$("#txtUSERS" + CountGrid).removeAttr("disabled");
            $("#txtAcount" + CountGrid).removeAttr("disabled");
            $("#txtAcount_Code" + CountGrid).removeAttr("disabled");
            $("#checkbox" + CountGrid).removeAttr("disabled");
            $("#IsRecPayAccount" + CountGrid).removeAttr("disabled");
            $("#txtopenbalance" + CountGrid).removeAttr("disabled");
            $("#txtopenDate" + CountGrid).removeAttr("disabled");
            // can delete new inserted record  without need for delete privilage
            $("#btn_minus" + CountGrid).removeClass("display_none");
            $("#btn_minus" + CountGrid).removeAttr("disabled");
            $("#txtopenDate" + CountGrid).val(GetDate());
            //$(".btn-minus").addClass("display_none");
            $("#btnUpdate_Def").removeClass("display_none");
            //$("#txtCode" + CountGrid).attr("disabled", "disabled");
            CountGrid++;
        }
        $("#btnUpdate_Def").addClass("display_none");
    }
    function BuildControls(cnt) {
        var html;
        ////debugger;
        html = "<tr id= \"No_Row" + cnt + "\"> \n                    <td>\n\t\t                <div class=\"form-group\">\n\t\t\t                <span id=\"btn_minus" + cnt + "\" class=\"btn-minus\" ><i class=\"fas fa-minus-circle btn-minus\"></i></span>\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n                            <input id=\"txtDescA" + cnt + "\" type=\"text\" class=\"form-control\" name=\"\" disabled />\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n                            <input id=\"IsRecPayAccount" + cnt + "\" type=\"checkbox\" class=\"form-check-input\" disabled >\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n                            <select id=\"txtAcount" + cnt + "\" class=\"form-control\"  disabled>\n\t\t                        <option value=\"Null\">" + (lang == "ar" ? "رقم الحساب" : "Account number") + "</option>\n\t                        </select>\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n                            <select id=\"txtAcount_Code" + cnt + "\" class=\"form-control\"  disabled=\"disabled\">\n\t\t                        <option value=\"Null\">" + (lang == "ar" ? "رقم الحساب الشبكة" : "Network account number") + "</option>\n\t                        </select >\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n                            <input id=\"checkbox" + cnt + "\" type=\"checkbox\" class=\"form-check-input\" disabled>\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n                            <input id=\"txtopenbalance" + cnt + "\" type= \"number\" class=\"form-control\" disabled/>\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n                            <input id=\"txtopenDate" + cnt + "\" type= \"date\" class=\"form-control\" disabled/>\n\t\t                </div>\n\t                </td>\n                    \n               <input id = \"txt_StatusFlag" + cnt + "\" name = \" \" type = \"hidden\" disabled class=\"form-control\"/>\n               <input id = \"txt_ID" + cnt + "\" name = \" \" type = \"hidden\" disabled class=\"form-control\"/>\n                </tr>";
        $("#div_Data").append(html);
        for (var i = 0; i < Details_NumAcount.length; i++) {
            //debugger;
            $('#txtAcount' + cnt).append('<option value="' + Details_NumAcount[i].ACC_CODE + '">' + (lang == "ar" ? Details_NumAcount[i].ACC_DESCA : Details_NumAcount[i].ACC_DESCL) + '</option>');
        }
        for (var i = 0; i < Details_NetworkAcount.length; i++) {
            //debugger;
            $('#txtAcount_Code' + cnt).append('<option value="' + Details_NetworkAcount[i].ACC_CODE + '">' + (lang == "ar" ? Details_NetworkAcount[i].ACC_DESCA : Details_NetworkAcount[i].ACC_DESCL) + '</option>');
        }
        $("#btn_minus" + cnt).on('click', function () {
            DeleteRow(cnt);
        });
        $("#txtCode" + cnt).on('change', function () {
            //Validate_code(cnt);
        });
        $("#txtDescA" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        $("#txtDescL" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        $("#txtopenbalance" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        $("#txtopenDate" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        $("#txtAcount" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        $("#txtAcount_Code" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        $("#checkbox" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        $("#IsRecPayAccount" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        if (SysSession.CurrentPrivileges.Remove) {
            //$("#btn_minus" + cnt).removeClass("display_none");
            //$("#btn_minus" + cnt).removeAttr("disabled");
            $("#btn_minus" + cnt).addClass("display_none");
            $("#btn_minus" + cnt).attr("disabled", "disabled");
        }
        else {
            $("#btn_minus" + cnt).addClass("display_none");
            $("#btn_minus" + cnt).attr("disabled", "disabled");
        }
        return;
    }
    function Display_Acount_Code() {
        //var StkDefCategory: Array<G_USERS> = new Array<G_USERS>();
        //debugger;
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GLDefAccount", "GetByTypeForBoxes"),
            data: {
                CompCode: compcode, AccType: NumAccType, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    //debugger
                    Details_NumAcount = result.Response;
                    //DisplayStkG_USERS();
                }
            }
        });
    }
    function Display_Network_account_Code() {
        //var StkDefCategory: Array<G_USERS> = new Array<G_USERS>();
        //debugger;
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GLDefAccount", "GetByType"),
            data: {
                CompCode: compcode, AccType: NetworkAccType, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    //debugger
                    Details_NetworkAcount = result.Response;
                    //DisplayStkG_USERS();
                }
            }
        });
    }
    function btnSave_Def_onClick() {
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
    function btnUpdate_Def_onclick() {
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
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefBox", "GetAll"),
            data: {
                compCode: compcode, BranchCode: BranchCode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token, ModuleCode: Modules.AccDefBox, FinYear: SysSession.CurrentEnvironment.CurrentYear
            },
            success: function (d) {
                //debugger;
                var result = d;
                if (result.IsSuccess) {
                    Details = result.Response;
                    DisplayAccDefBox();
                }
            }
        });
    }
    function DisplayAccDefBox() {
        $('#div_Data').html("");
        CountGrid = 0;
        for (var i = 0; i < Details.length; i++) {
            BuildControls(CountGrid);
            CountGrid++;
            $("#txt_ID" + i).val(Details[i].CashBoxID);
            $("#txtDescA" + i).val(Details[i].CashBox_DescA);
            $("#txtDescL" + i).val(Details[i].CashBox_DescE);
            $("#txtopenbalance" + i).val(Details[i].OpenBalance);
            $("#txtopenDate" + i).val(DateFormat(Details[i].OpenBalanceDate));
            if (Details[i].IsActive) {
                $("#checkbox" + i).attr('checked', 'true');
            }
            else
                $("#checkbox" + i).removeAttr('checked');
            if (Details[i].IsRecPayAccount) {
                $("#IsRecPayAccount" + i).attr('checked', 'true');
            }
            else
                $("#IsRecPayAccount" + i).removeAttr('checked');
            $("#txtAcount" + i).val(Details[i].AccountCode == "" ? "Null" : Details[i].AccountCode);
            $("#txtAcount_Code" + i).val(Details[i].CardAccountCode == "" ? "Null" : Details[i].CardAccountCode);
            $("#txt_StatusFlag" + i).val("");
        }
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
    function btnBack_Def_onclick() {
        $('#btnSave_Def').addClass("display_none");
        $('#btnBack_Def').addClass("display_none");
        $("#div_ContentData :input").attr("disabled", "true");
        $(".btn-minus").addClass("display_none");
        $("#btnUpdate_Def").removeClass("display_none");
        $("#btnUpdate_Def").removeAttr("disabled");
        $(".btnAddDetails").attr("disabled", "disabled");
        $("#btnAddDetails").addClass("display_none");
        DisplayAccDefBox();
    }
    function Validation_Grid(rowcount) {
        if ($("#txt_StatusFlag" + rowcount).val() == "d" || $("#txt_StatusFlag" + rowcount).val() == "m") {
            return true;
        }
        else {
            if ($("#txtDescA" + rowcount).val() == "") {
                $("#txtDescA" + rowcount).val($("#txtDescL" + rowcount).val());
            }
            if ($("#txtDescL" + rowcount).val() == "") {
                $("#txtDescL" + rowcount).val($("#txtDescA" + rowcount).val());
            }
            if ((lang == "ar" ? $("#txtDescA" + rowcount).val() : $("#txtDescL" + rowcount).val()) == '') {
                WorningMessage('ادخل الوصف ', 'Enter The Description', 'خطاء', 'Erorr');
                Errorinput((lang == "ar" ? $("#txtDescA" + rowcount) : $("#txtDescL" + rowcount)));
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
        var StatusFlag;
        DetailsModel = new Array();
        for (var i = 0; i < CountGrid; i++) {
            Model = new A_RecPay_D_CashBox();
            StatusFlag = $("#txt_StatusFlag" + i).val();
            if (StatusFlag == "i") {
                Model.StatusFlag = StatusFlag.toString();
                Model.CashBoxID = 0;
                Model.CompCode = Number(SysSession.CurrentEnvironment.CompCode);
                Model.BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);
                //Model.CreatedBy = SysSession.CurrentEnvironment.UserCode;
                //Model.UpdatedBy = "";
                //Model.AccountCode = $("#txtCode" + i).val();
                Model.CashBox_DescA = $("#txtDescA" + i).val();
                Model.CashBox_DescE = $("#txtDescL" + i).val();
                Model.OpenBalance = $("#txtopenbalance" + i).val();
                Model.OpenBalanceDate = $("#txtopenDate" + i).val();
                //Model.User_Code = $("#txtUSERS" + i).val();
                if ($("#txtAcount" + i).val() == "Null") {
                    Model.AccountCode = "0";
                }
                else {
                    Model.AccountCode = $("#txtAcount" + i).val();
                }
                if ($("#txtAcount_Code" + i).val() == "Null") {
                    Model.CardAccountCode = "0";
                }
                else {
                    Model.CardAccountCode = $("#txtAcount_Code" + i).val();
                }
                if ($("#checkbox" + i).is(':checked')) {
                    Model.IsActive = true;
                }
                else {
                    Model.IsActive = false;
                }
                if ($("#IsRecPayAccount" + i).is(':checked')) {
                    Model.IsRecPayAccount = true;
                }
                else {
                    Model.IsRecPayAccount = false;
                }
                DetailsModel.push(Model);
                //Model.CompCode = Number(compcode);
            }
            if (StatusFlag == "u") {
                Model.StatusFlag = StatusFlag.toString();
                Model.CashBoxID = Number($("#txt_ID" + i).val());
                Model.CompCode = Number(SysSession.CurrentEnvironment.CompCode);
                Model.BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);
                //Model.CreatedBy = SysSession.CurrentEnvironment.UserCode;
                //Model.UpdatedBy = "";
                //Model.AccountCode = $("#txtCode" + i).val();
                Model.CashBox_DescA = $("#txtDescA" + i).val();
                Model.CashBox_DescE = $("#txtDescL" + i).val();
                Model.OpenBalance = $("#txtopenbalance" + i).val();
                Model.OpenBalanceDate = $("#txtopenDate" + i).val();
                //Model.User_Code = $("#txtUSERS" + i).val();
                if ($("#txtAcount" + i).val() == "Null") {
                    Model.AccountCode = "0";
                }
                else {
                    Model.AccountCode = $("#txtAcount" + i).val();
                }
                if ($("#txtAcount_Code" + i).val() == "Null") {
                    Model.CardAccountCode = "0";
                }
                else {
                    Model.CardAccountCode = $("#txtAcount_Code" + i).val();
                }
                if ($("#checkbox" + i).is(':checked')) {
                    Model.IsActive = true;
                }
                else {
                    Model.IsActive = false;
                }
                if ($("#IsRecPayAccount" + i).is(':checked')) {
                    Model.IsRecPayAccount = true;
                }
                else {
                    Model.IsRecPayAccount = false;
                }
                DetailsModel.push(Model);
            }
            if (StatusFlag == "d") {
                if ($("#txt_ID" + i).val() != "") {
                    Model.StatusFlag = StatusFlag.toString();
                    Model.CashBoxID = Number($("#txt_ID" + i).val());
                    Model.CompCode = Number(SysSession.CurrentEnvironment.CompCode);
                    Model.BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);
                    DetailsModel.push(Model);
                }
            }
        }
    }
    function Update() {
        Assign();
        if (DetailsModel.length > 0) {
            DetailsModel[0].Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
            DetailsModel[0].UserCode = SysSession.CurrentEnvironment.UserCode;
            DetailsModel[0].Branch_Code = SysSession.CurrentEnvironment.BranchCode;
            DetailsModel[0].Comp_Code = SysSession.CurrentEnvironment.CompCode;
            DetailsModel[0].sec_FinYear = SysSession.CurrentEnvironment.CurrentYear;
            DetailsModel[0].MODULE_CODE = Modules.AccDefBox;
        }
        //debugger;
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("AccDefBox", "UpdateLst"),
            data: JSON.stringify(DetailsModel),
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
})(AccDefBox || (AccDefBox = {}));
//# sourceMappingURL=AccDefBox.js.map