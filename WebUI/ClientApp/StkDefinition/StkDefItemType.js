$(document).ready(function () {
    StkDefItemType.InitalizeComponent();
});
var StkDefItemType;
(function (StkDefItemType) {
    var AccountType = 1;
    var MSG_ID;
    var Details = new Array();
    var Display_Type = new Array();
    var Details_New = new Array();
    var BilldDetail = new Array();
    var Detail_Model = new Array();
    //var Details: Array<I_D_Category> = new Array<I_D_Category>();
    var btnNew_sub_Add_service;
    var btnSave_Def;
    var btnAddDetails;
    var btnEdit;
    var sys = new SystemTools();
    //var sys: _shared = new _shared();
    var SysSession = GetSystemSession(Modules.StkDefItemType);
    var Model = new I_ItemFamily();
    var CountGrid = 0;
    var compcode; //SharedSession.CurrentEnvironment.CompCode;
    var btnBack_Def;
    var catId;
    var catId_type_change;
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);
    function InitalizeComponent() {
        ////
        $('#divIconbar').addClass('hidden_Control');
        $('#iconbar_Definition').removeClass('hidden_Control');
        $("#divShow").removeClass("display_none");
        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = "أنواع الأصناف";
        }
        else {
            document.getElementById('Screen_name').innerHTML = "ItemType";
        }
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        InitalizeControls();
        InitalizeEvents();
        Display_DrpPaymentType();
        //Display();
    }
    StkDefItemType.InitalizeComponent = InitalizeComponent;
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
    function InitalizeControls() {
        ////
        btnAddDetails = document.getElementById("btnAddDetails");
        btnEdit = document.getElementById("btnUpdate_Def");
        btnSave_Def = document.getElementById("btnSave_Def");
        btnBack_Def = document.getElementById("btnBack_Def");
        // Buton privialges for single record page
    }
    function InitalizeEvents() {
        ////
        btnAddDetails.onclick = AddNewRow; //
        btnSave_Def.onclick = btnSave_Def_onClick;
        btnBack_Def.onclick = btnBack_Def_onclick;
        $("#drpPaymentType").on('change', function () {
            $("#divShow").removeClass("display_none");
            catId = $('#drpPaymentType').val();
            btnBack_Def_onclick();
            //
        });
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
            $("#txtDescA" + CountGrid).removeAttr("disabled");
            $("#txtDescL" + CountGrid).removeAttr("disabled");
            $("#select_Type_Item" + CountGrid).removeAttr("disabled");
            $("#select_Type_Item" + CountGrid).removeAttr("disabled");
            $("#txtRefItemCode" + CountGrid).removeAttr("disabled");
            $("#txtBarCodePrefix" + CountGrid).removeAttr("disabled");
            $("#txtLastBarCodeSeq" + CountGrid).removeAttr("disabled");
            //$("#txtAcount_Code" + CountGrid).removeAttr("disabled");
            // can delete new inserted record  without need for delete privilage
            $("#btn_minus" + CountGrid).removeClass("display_none");
            $("#btn_minus" + CountGrid).removeAttr("disabled");
            //$(".minus_btn").addClass("display_none");
            $("#btnUpdate_Def").removeClass("display_none");
            CountGrid++;
            //$('#select_Type_Item' + CountGrid).prop("value", catId);
        }
        $("#btnUpdate_Def").addClass("display_none");
    }
    function BuildControls(cnt) {
        var html;
        html = "<tr id= \"No_Row" + cnt + "\"> \n                    <td>\n\t\t                <div class=\"form-group\">\n\t\t\t                <span id=\"btn_minus" + cnt + "\"><i class=\"fas fa-minus-circle btn-minus display_none\"></i></span>\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n                            <input id=\"txtCode" + cnt + "\" type=\"text\" class=\"form-control\" name=\"\" disabled />\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n                            <input id=\"txtDescA" + cnt + "\" type=\"text\" class=\"form-control\" name=\"\" disabled />\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n                            <input id=\"txtDescL" + cnt + "\" type=\"text\" class=\"form-control\" name=\"\" disabled />\n\t\t                </div>\n\t                </td>\n                    <td>\n                        <select disabled id=\"select_Type_Item" + cnt + "\" class=\"form-control\"> \n                           <option value=\"Null\"> " + (lang == "ar" ? "اختر الفئة" : " Type_Item ") + "</option>\n                        </select>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n                            <input id=\"txtRefItemCode" + cnt + "\" type=\"number\" class=\"form-control\" name=\"\" disabled />\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n                            <input id=\"txtBarCodePrefix" + cnt + "\" type=\"text\" class=\"form-control\" name=\"\" disabled />\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n                            <input id=\"txtLastBarCodeSeq" + cnt + "\" type=\"number\" class=\"form-control\" name=\"\" disabled />\n\t\t                </div>\n\t                </td>\n                    \n               <input id=\"txt_StatusFlag" + cnt + "\" type=\"hidden\"   />\n               <input id=\"txt_ID" + cnt + "\" type=\"hidden\"   />\n\n                </tr>";
        $("#div_Data").append(html);
        for (var i = 0; i < Display_Type.length; i++) {
            //
            $('#select_Type_Item' + cnt).append('<option value="' + Display_Type[i].CatID + '">' + (lang == "ar" ? Display_Type[i].DescA : Display_Type[i].DescL) + '</option>');
        }
        $("#btn_minus" + cnt).on('click', function () {
            DeleteRow(cnt);
        });
        $("#txtCode" + cnt).on('change', function () {
            Validate_code(cnt);
        });
        $("#txtDescA" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        $("#txtDescL" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        $("#txtRefItemCode" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        $("#txtBarCodePrefix" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        $("#txtLastBarCodeSeq" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        $("#select_Type_Item" + cnt).on('change', function () {
            catId_type_change = $('#drpPaymentType').val();
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
    function Display_DrpPaymentType() {
        //var StkDefCategory: Array<I_D_Category> = new Array<I_D_Category>();
        // 
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("StkDefCategory", "GetAll"),
            data: {
                CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    Display_Type = result.Response;
                    DisplayStkDefCategory();
                }
            }
        });
    }
    function DisplayStkDefCategory() {
        for (var i = 0; i < Display_Type.length; i++) {
            // 
            $('#drpPaymentType').append('<option value="' + Display_Type[i].CatID + '">' + (lang == "ar" ? Display_Type[i].DescA : Display_Type[i].DescL) + '</option>');
        }
    }
    function refresh() {
        $('#div_Data').html("");
        CountGrid = 0;
        catId = $('#drpPaymentType').val();
        Display();
    }
    function Update() {
        Assign();
        //
        if (BilldDetail.filter(function (x) { return x.FamilyCode == ""; }).length > 0) {
            if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
                MessageBox.Show("يجب ادخال الكود", "");
            }
            else {
                MessageBox.Show("Please, Enter The Code!", "");
            }
            return;
        }
        if (Details.filter(function (x) { return x.DescA == ""; }).length > 0) {
            if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
                MessageBox.Show("يجب ادخال الوصف باعربي", "");
            }
            else {
                MessageBox.Show("please, Enter The Arabic Description!", "");
            }
            return;
        }
        if (Details.filter(function (x) { return x.CatID == 0; }).length > 0) {
            if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
                MessageBox.Show("يجب ادخال  الفئة", "");
            }
            else {
                MessageBox.Show("Please, Enter The Category!", "");
            }
            return;
        }
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
            Model = new I_ItemFamily();
            StatusFlag = $("#txt_StatusFlag" + i).val();
            $("#txt_StatusFlag" + i).val("");
            //
            if (StatusFlag == "i") {
                Model.StatusFlag = StatusFlag.toString();
                Model.CompCode = Number(SysSession.CurrentEnvironment.CompCode);
                //Model.AccountType = Number(AccountType);
                Model.CreatedBy = SysSession.CurrentEnvironment.UserCode;
                //Model.UpdatedBy = "";
                Model.ItemFamilyID = 0;
                Model.FamilyCode = $("#txtCode" + i).val();
                Model.CatID = $('#select_Type_Item' + i).val();
                Model.RefItemCode = $("#txtRefItemCode" + i).val();
                Model.BarCodePrefix = $("#txtBarCodePrefix" + i).val();
                Model.LastBarCodeSeq = $("#txtLastBarCodeSeq" + i).val();
                if ($("#txtDescA" + i).val() == "") {
                    Model.DescA = $("#txtDescL" + i).val();
                    $("#txtDescA" + i).val($("#txtDescL" + i).val());
                }
                else {
                    Model.DescA = $("#txtDescA" + i).val();
                }
                if ($("#txtDescL" + i).val() == "") {
                    Model.DescL = $("#txtDescA" + i).val();
                    $("#txtDescL" + i).val($("#txtDescA" + i).val());
                }
                else {
                    Model.DescL = $("#txtDescL" + i).val();
                }
                Detail_Model.push(Model);
                //Model.CompCode = Number(compcode);
            }
            if (StatusFlag == "u") {
                Model.StatusFlag = StatusFlag.toString();
                Model.CompCode = Number(SysSession.CurrentEnvironment.CompCode);
                //Model.AccountType = Number(AccountType);
                Model.CreatedBy = SysSession.CurrentEnvironment.UserCode;
                //Model.UpdatedBy = "";
                Model.ItemFamilyID = $("#txt_ID" + i).val();
                Model.FamilyCode = $("#txtCode" + i).val();
                Model.CatID = $('#select_Type_Item' + i).val();
                Model.RefItemCode = $("#txtRefItemCode" + i).val();
                Model.BarCodePrefix = $("#txtBarCodePrefix" + i).val();
                Model.LastBarCodeSeq = $("#txtLastBarCodeSeq" + i).val();
                if ($("#txtDescA" + i).val() == "") {
                    Model.DescA = $("#txtDescL" + i).val();
                    $("#txtDescA" + i).val($("#txtDescL" + i).val());
                }
                else {
                    Model.DescA = $("#txtDescA" + i).val();
                }
                if ($("#txtDescL" + i).val() == "") {
                    Model.DescL = $("#txtDescA" + i).val();
                    $("#txtDescL" + i).val($("#txtDescA" + i).val());
                }
                else {
                    Model.DescL = $("#txtDescL" + i).val();
                }
                Detail_Model.push(Model);
            }
            if (StatusFlag == "d") {
                if ($("#txt_ID" + i).val() != "") {
                    Model.StatusFlag = StatusFlag.toString();
                    Model.ItemFamilyID = $("#txt_ID" + i).val();
                    Model.FamilyCode = $("#txtCode" + i).val();
                    Model.CatID = $('#select_Type_Item' + i).val();
                    Model.RefItemCode = $("#txtRefItemCode" + i).val();
                    Model.BarCodePrefix = $("#txtBarCodePrefix" + i).val();
                    Model.LastBarCodeSeq = $("#txtLastBarCodeSeq" + i).val();
                    Detail_Model.push(Model);
                }
            }
        }
    }
    function Display() {
        //
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("StkDefItemType", "GetAll"),
            data: {
                CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                //
                var result = d;
                if (result.IsSuccess) {
                    Details = result.Response;
                    DisplayGenDefCategory();
                }
            }
        });
    }
    function DisplayGenDefCategory() {
        CountGrid = 0;
        BilldDetail = Details.filter(function (x) { return x.CatID == catId; });
        for (var i = 0; i < BilldDetail.length; i++) {
            BuildControls(CountGrid);
            CountGrid++;
            //
            $("#txt_ID" + i).val(BilldDetail[i].ItemFamilyID);
            $("#txtCode" + i).val(BilldDetail[i].FamilyCode);
            $("#txtDescA" + i).val(BilldDetail[i].DescA);
            $("#txtDescL" + i).val(BilldDetail[i].DescL);
            $("#txtRefItemCode" + i).val(BilldDetail[i].RefItemCode);
            $("#txtBarCodePrefix" + i).val(BilldDetail[i].BarCodePrefix);
            $("#txtLastBarCodeSeq" + i).val(BilldDetail[i].LastBarCodeSeq);
            $("#btn_minus" + i).removeClass("display_none");
            //for (var s = 0; s < Display_Type.length; s++) {
            //    //
            //    $('#select_Type_Item' + i).append('<option value="' + Display_Type[s].CatID + '">' + Display_Type[s].DescA + '</option>');
            //}
            $("#txt_StatusFlag" + i).val("");
            $('#select_Type_Item' + i).prop("value", catId);
        }
    }
    function DeleteRow(RecNo) {
        if (!SysSession.CurrentPrivileges.Remove)
            return;
        WorningMessage("هل تريد الحذف؟", "Do you want to delete?", "تحذير", "worning", function () {
            $("#No_Row" + RecNo).attr("hidden", "true");
            $("#txtCode" + RecNo).val("000");
            $("#txtDescA" + RecNo).val("0");
            $("#txtDescL" + RecNo).val(0);
            $('#select_Type_Item' + RecNo).prop("selectedIndex", 1);
            $("#txt_StatusFlag" + RecNo).val() == 'i' ? $("#txt_StatusFlag" + RecNo).val('m') : $("#txt_StatusFlag" + RecNo).val('d');
        });
    }
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
        Display();
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
            if ($("#txtCode" + rowcount).val() == '') {
                WorningMessage('ادخل كود', 'Enter The code', 'خطاء', 'Erorr');
                Errorinput($("#txtCode" + rowcount));
                return false;
            }
            if ((lang == "ar" ? $("#txtDescA" + rowcount).val() : $("#txtDescL" + rowcount).val()) == '') {
                WorningMessage('ادخل الوصف ', 'Enter The Description', 'خطاء', 'Erorr');
                Errorinput((lang == "ar" ? $("#txtDescA" + rowcount) : $("#txtDescL" + rowcount)));
                return false;
            }
            if ($("#select_Type_Item" + rowcount).val() == "Null") {
                WorningMessage('اختار الفئة', 'Enter The Type Item', 'خطاء', 'Erorr');
                Errorinput($("#select_Type_Item" + rowcount));
                return false;
            }
        }
        return true;
    }
    function Validate_code(rowno) {
        //
        for (var i = 0; i < CountGrid; i++) {
            if (i != rowno) {
                if ($("#txt_StatusFlag" + i).val() == "d") {
                    return true;
                }
                else {
                    if ($("#txtCode" + rowno).val() == $("#txtCode" + i).val()) {
                        var Code = $("#txtCode" + rowno).val();
                        $("#txtCode" + rowno).val("");
                        WorningMessage("لا يمكن تكرار رقم الكود " + Code, "code cannot br repeated?", "تحذير", "worning", function () {
                            $("#txtCode" + rowno).val("");
                            return false;
                        });
                    }
                }
            }
        }
        if ($("#txt_StatusFlag" + rowno).val() != "i")
            $("#txt_StatusFlag" + rowno).val("u");
        return true;
    }
})(StkDefItemType || (StkDefItemType = {}));
//# sourceMappingURL=StkDefItemType.js.map