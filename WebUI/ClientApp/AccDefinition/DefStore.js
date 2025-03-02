$(document).ready(function () {
    DefStore.InitalizeComponent();
});
var DefStore;
(function (DefStore) {
    var Details = new Array();
    var Details_NumAcount = new Array();
    var Selected_Data = new Array();
    var detailstore = new Array();
    var Modelstore = new G_STORE();
    var BranchDetails = new Array();
    var Model = new A_RecPay_D_CashBox();
    var SysSession = GetSystemSession(Modules.DefStore);
    var ReportGrid = new JsGrid();
    var sys = new SystemTools();
    //buttons
    var btnSave;
    var btnBack;
    var btnAdd;
    var btnEdit;
    var btnBack;
    var btnShow;
    var checkactive;
    var searchbutmemreport;
    //dropdown
    var drpinventoryAccount;
    var drpuserType;
    //global
    var CountGrid = -1;
    var compcode; //SharedSession.CurrentEnvironment.CompCode; 
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);
    var flag = false;
    var flag1 = true;
    var SearchDetails;
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);
    var Page = true;
    var pageIndex;
    function InitalizeComponent() {
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = "المستودعات";
        }
        else {
            document.getElementById('Screen_name').innerHTML = " Warehouses";
        }
        $('#btnPrintTransaction').addClass('d-none');
        $('#btnPrintTrview').addClass('d-none');
        $('#btnPrintTrPDF').addClass('d-none');
        $('#btnPrintTrEXEL').addClass('d-none');
        InitalizeControls();
        InitalizeEvents();
        FilldrpinventoryAccount();
        fillddlBranch();
    }
    DefStore.InitalizeComponent = InitalizeComponent;
    function InitalizeControls() {
        btnAdd = document.getElementById("btnAdd");
        btnEdit = document.getElementById("btnUpdate");
        btnSave = document.getElementById("btnSave");
        btnBack = document.getElementById("btnBack");
        btnShow = document.getElementById("btnShow");
        searchbutmemreport = document.getElementById("searchbutmemreport");
        checkactive = document.getElementById("checkactive");
        drpuserType = document.getElementById("drpuserType");
        drpinventoryAccount = document.getElementById("drpinventoryAccount");
    }
    function InitalizeEvents() {
        btnSave.onclick = btnsave_onClick;
        btnShow.onclick = Displaystore;
        btnEdit.onclick = btnEdit_onclick;
        btnBack.onclick = btnback_onclick;
        btnAdd.onclick = btnadd_onclick;
        searchbutmemreport.onkeyup = _SearchBox_Change;
    }
    //---------------------------------------------------------------------------Inventory Account
    function FilldrpinventoryAccount() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GLDefAccount", "GetAll_store"),
            data: {
                CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    Details_NumAcount = result.Response;
                    DocumentActions.FillCombowithdefult(Details_NumAcount, drpinventoryAccount, "ACC_CODE", (lang == "ar" ? "ACC_DESCA" : "ACC_DESCL"), (lang == "ar" ? "اختر حساب المخزون" : "Select inventory Account"));
                }
            }
        });
    }
    //---------------------------------------------------------------------------Branch Name  
    function fillddlBranch() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GBranch", "GetAll"),
            data: {
                CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    BranchDetails = result.Response;
                    DisplaydrpuserType();
                }
            }
        });
    }
    function DisplaydrpuserType() {
        debugger;
        for (var i = 0; i < BranchDetails.length; i++) {
            $('#drpuserType').append('<option value="' + BranchDetails[i].BRA_CODE + '">' + (lang == "ar" ? BranchDetails[i].BRA_DESC : BranchDetails[i].BRA_DESCL) + '</option>');
            $('#drpuserType_new').append('<option value="' + BranchDetails[i].BRA_CODE + '">' + (lang == "ar" ? BranchDetails[i].BRA_DESC : BranchDetails[i].BRA_DESCL) + '</option>');
        }
    }
    //---------------------------------------------------------------------------he Grid Of Branchs & Stores
    function Displaystore() {
        $('#divMasterGridiv').removeClass('display_none');
        detailstore = new Array();
        var BranchCode = Number($('#drpuserType').val());
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("DefStore", "GetAll"),
            data: {
                CompCode: compcode, BranchCode: BranchCode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    detailstore = result.Response;
                    for (var i = 0; i < detailstore.length; i++) {
                        detailstore[i].NameIsActive = detailstore[i].IsActive == true ? (lang == "ar" ? "فعال" : "Active") : (lang == "ar" ? "غير فعال" : "Not Active");
                    }
                    InitializeGridstore();
                    ReportGrid.DataSource = detailstore;
                    ReportGrid.Bind();
                }
            }
        });
    }
    function InitializeGridstore() {
        var res = GetResourceList("");
        $("#id_ReportGrid").attr("style", "");
        ReportGrid.ElementName = "divMasterGrid";
        ReportGrid.Paging = true;
        ReportGrid.PageSize = 15;
        ReportGrid.Sorting = true;
        ReportGrid.InsertionMode = JsGridInsertionMode.Binding;
        ReportGrid.Editing = false;
        ReportGrid.Inserting = false;
        ReportGrid.OnRowDoubleClicked = MasterGridDoubleClick;
        ReportGrid.SelectedIndex = 1;
        ReportGrid.PrimaryKey = "StoreId";
        ReportGrid.OnItemEditing = function () { };
        ReportGrid.Columns = [
            { title: res.Branch_NUM, name: "BRA_CODE", type: "text", width: "5%" },
            { title: res.App_BranchName, name: (lang == "ar" ? "BRA_DESC" : "BRA_DESCL"), type: "text", width: "10%" },
            { title: res.Trns_StoreNO, name: "STORE_CODE", type: "text", width: "10%" },
            { title: res.Store_name, name: (lang == "ar" ? "DescA" : "DescL"), type: "text", width: "10%" },
            { title: res.App_Active, name: "NameIsActive", type: "text", width: "10%" },
        ];
        ReportGrid.Bind();
    }
    function MasterGridDoubleClick() {
        $('#btnUpdate').removeClass('display_none');
        $('#btnBack').addClass('display_none');
        $('#btnSave').addClass('display_none');
        Selected_Data = new Array();
        Selected_Data = detailstore.filter(function (x) { return x.StoreId == Number(ReportGrid.SelectedKey); });
        $('#StoreDetail').removeClass('display_none');
        DisplayData(Selected_Data);
    }
    function DisplayData(Selected_Data) {
        DocumentActions.RenderFromModel(Selected_Data[0]);
    }
    //---------------------------------------------------------------------------Search in Grid
    function _SearchBox_Change() {
        if (Page) {
            pageIndex = $("#ReportGrid").jsGrid("option", "pageIndex");
        }
        if (searchbutmemreport.value != "") {
            Page = false;
            $("#ReportGrid").jsGrid("option", "pageIndex", 1);
            var search_1 = searchbutmemreport.value.toLowerCase();
            SearchDetails = detailstore.filter(function (x) { return x.STORE_CODE.toString().search(search_1) >= 0 || x.DescA.toLowerCase().search(search_1) >= 0 || x.BRA_DESC.toLowerCase().search(search_1) >= 0; });
            ReportGrid.DataSource = SearchDetails;
            ReportGrid.Bind();
        }
        else {
            Page = true;
            ReportGrid.DataSource = detailstore;
            ReportGrid.Bind();
            $("#ReportGrid").jsGrid("option", "pageIndex", pageIndex);
        }
    }
    //---------------------------------------------------------------------------Edit button
    function btnEdit_onclick() {
        debugger;
        if (!SysSession.CurrentPrivileges.EDIT)
            return;
        flag = true;
        $('#btnSave').removeClass('display_none');
        $('#btnBack').removeClass('display_none');
        $('#btnUpdate').addClass('display_none');
        $('#btnAdd').addClass('display_none');
        $("#masterdiv").attr("disabled", "disabled").off('click');
        $("#masterdiv").addClass("disabledDiv");
        VALIDATEDIS();
    }
    //---------------------------------------------------------------------------Back button
    function btnback_onclick() {
        $('#StoreDetail').addClass('display_none');
        $('#btnSave').addClass('display_none');
        $('#btnBack').addClass('display_none');
        $('#btnUpdate').removeClass('display_none');
        $('#btnShow').removeClass('display_none');
        $('#btnAdd').removeClass('display_none');
        $("#masterdiv").removeAttr("disabled");
        $("#masterdiv").removeClass("disabledDiv");
        Displaystore();
        MasterGridDoubleClick();
        REMOVEVALIDATEDIS();
        flag == true ? $('#StoreDetail').removeClass('display_none') : $('#StoreDetail').addClass('display_none');
    }
    //---------------------------------------------------------------------------Add button
    function btnadd_onclick() {
        if (!SysSession.CurrentPrivileges.AddNew)
            return;
        flag = false;
        $('#btnShow').addClass('display_none');
        $('#btnSave').removeClass('display_none');
        $('#btnBack').removeClass('display_none');
        $("#masterdiv").attr("disabled", "disabled").off('click');
        $("#masterdiv").addClass("disabledDiv");
        $('#btnUpdate').addClass('display_none');
        $('#StoreDetail').removeClass('display_none');
        checkactive.checked = false;
        Cleartxt();
        VALIDATEDIS();
    }
    //---------------------------------------------------------------------------Save button
    function btnsave_onClick() {
        loading('btnSave');
        setTimeout(function () {
            finishSave('btnSave');
            if (!validations())
                return;
            Modelstore = new G_STORE();
            DocumentActions.AssignToModel(Modelstore);
            Modelstore.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
            Modelstore.UserCode = SysSession.CurrentEnvironment.UserCode;
            Modelstore.COMP_CODE = Number(SysSession.CurrentEnvironment.CompCode);
            Modelstore.BranchId = Number(SysSession.CurrentEnvironment.BranchCode);
            Modelstore.BRA_CODE = $('#drpuserType_new').val();
            Modelstore.IsActive = checkactive.checked;
            Modelstore.StockAccCode = $('#drpinventoryAccount').val();
            Modelstore.Fax = "1";
            Modelstore.STORE_TYPE = 1;
            Modelstore.TYPE_CODE = 1;
            if (flag == true) {
                Modelstore.StoreId = Number(ReportGrid.SelectedKey);
                Modelstore.UpdatedBy = SysSession.CurrentEnvironment.UserCode;
                Modelstore.UpdatedAt = DateTimeFormat(Date().toString());
                Modelstore.CreatedBy = $('#txtCreatedBy').val();
                Modelstore.CreatedAt = $('#txtCreatedAt').val();
                Update();
            }
            else {
                Modelstore.StoreId = 0;
                Modelstore.CreatedBy = SysSession.CurrentEnvironment.UserCode;
                Modelstore.CreatedAt = DateTimeFormat(Date().toString());
                Insert();
            }
        }, 100);
    }
    //---------------------------------------------------------------------------Update and Insert
    function Update() {
        Modelstore.Branch_Code = SysSession.CurrentEnvironment.BranchCode;
        Modelstore.Comp_Code = SysSession.CurrentEnvironment.CompCode;
        Modelstore.MODULE_CODE = Modules.DefStore;
        Modelstore.UserCode = SysSession.CurrentEnvironment.UserCode;
        Modelstore.sec_FinYear = SysSession.CurrentEnvironment.CurrentYear;
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("DefStore", "Update"),
            data: JSON.stringify(Modelstore),
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    DisplayMassage("تم الحفظ بنجاح", "Success", MessageType.Succeed);
                    btnback_onclick();
                    Displaystore();
                    MasterGridDoubleClick();
                    Save_Succ_But();
                }
                else {
                    DisplayMassage("خطأء", "Error", MessageType.Error);
                }
            }
        });
    }
    function Insert() {
        Modelstore.Branch_Code = SysSession.CurrentEnvironment.BranchCode;
        Modelstore.Comp_Code = SysSession.CurrentEnvironment.CompCode;
        Modelstore.MODULE_CODE = Modules.DefStore;
        Modelstore.UserCode = SysSession.CurrentEnvironment.UserCode;
        Modelstore.sec_FinYear = SysSession.CurrentEnvironment.CurrentYear;
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("DefStore", "Insert"),
            data: JSON.stringify(Modelstore),
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    var storeID = result.Response;
                    DisplayMassage("تم الحفظ بنجاح", "Success", MessageType.Succeed);
                    btnback_onclick();
                    Displaystore();
                    $('#btnUpdate').removeClass('display_none');
                    Selected_Data = new Array();
                    Selected_Data = detailstore.filter(function (x) { return x.StoreId == Number(storeID); });
                    $('#StoreDetail').removeClass('display_none');
                    DisplayData(Selected_Data);
                    Save_Succ_But();
                }
                else {
                    DisplayMassage("خطأء", "Error", MessageType.Error);
                }
            }
        });
    }
    //---------------------------------------------------------------------------Validations and movement 
    function Cleartxt() {
        $('#txtPurTrNo').val('');
        $('#drpuserType_new').val('Null');
        $('#txtName_Arabic').val('');
        $('#txtName_English').val('');
        $('#drpinventoryAccount').val('null');
        $('#txtphone').val('');
        $('#txtphone2').val('');
        $('#txtaddress').val('');
        $('#txtNotes').val('');
        $('#txtCreatedBy').val('');
        $('#txtCreatedAt').val('');
        $('#txtUpdatedBy').val('');
        $('#txtUpdatedAt').val('');
    }
    function REMOVEVALIDATEDIS() {
        $('#txtPurTrNo').attr('disabled', 'disabled');
        $('#txtPurTrNo').attr('disabled', 'disabled');
        $('#drpuserType_new').attr('disabled', 'disabled');
        $('#txtName_Arabic').attr('disabled', 'disabled');
        $('#txtName_English').attr('disabled', 'disabled');
        $('#drpinventoryAccount').attr('disabled', 'disabled');
        $('#txtphone').attr('disabled', 'disabled');
        $('#txtphone2').attr('disabled', 'disabled');
        $('#txtaddress').attr('disabled', 'disabled');
        $('#txtNotes').attr('disabled', 'disabled');
        $('#checkactive').attr('disabled', 'disabled');
    }
    function VALIDATEDIS() {
        $('#txtPurTrNo').removeAttr('disabled');
        $('#txtPurTrNo').removeAttr('disabled');
        $('#drpuserType_new').removeAttr('disabled');
        $('#txtName_Arabic').removeAttr('disabled');
        $('#txtName_English').removeAttr('disabled');
        $('#drpinventoryAccount').removeAttr('disabled');
        $('#txtphone').removeAttr('disabled');
        $('#txtphone2').removeAttr('disabled');
        $('#txtaddress').removeAttr('disabled');
        $('#txtNotes').removeAttr('disabled');
        $('#checkactive').removeAttr('disabled');
    }
    function validations() {
        if ($('#txtPurTrNo').val() == null || $('#txtPurTrNo').val() == "") {
            WorningMessage("يجب ادخال رقم المستودع!", "The warehouse number must be entered!", "تحذير", "worning");
            Errorinput($('#txtPurTrNo'));
            return false;
        }
        var qty = Number($('#txtName_Arabic').val());
        if ($('#txtName_Arabic').val() == null || $('#txtName_Arabic').val().trim() == "" || qty >= 0) {
            WorningMessage("يجب ادخال الاسم بالعربي!", "The Arabic Name must be entered!", "تحذير", "worning");
            Errorinput($('#txtName_Arabic'));
            return false;
        }
        var qty1 = Number($('#txtName_English').val());
        if ($('#txtName_English').val() == null || $('#txtName_English').val().trim() == "" || qty1 >= 0) {
            WorningMessage("يجب ادخال الاسم بالانجليزية!", "The English Name must be entered!", "تحذير", "worning");
            Errorinput($('#txtName_English'));
            return false;
        }
        //if ($('#drpinventoryAccount').val() == "null") {
        //    WorningMessage("يجب اختيار  حساب المخزون  !", "The Inventory Account must be selected!", "تحذير", "worning");
        //    Errorinput($('#drpinventoryAccount'));
        //    return false;
        //}
        if ($('#drpuserType_new').val() == "Null") {
            WorningMessage("يجب اختيار اسم الفرع!", "The Branch Name must be selected!", "تحذير", "worning");
            Errorinput($('#drpuserType_new'));
            return false;
        }
        if ($('#txtphone').val().trim() == "") {
            WorningMessage("يجب ادخال الهاتف  !", "The Phone must be selected!", "تحذير", "worning");
            Errorinput($('#txtphone'));
            return false;
        }
        if ($('#txtphone2').val().trim() == "") {
            WorningMessage("يجب ادخال الهاتف2  !", "The Phone2 must be selected!", "تحذير", "worning");
            Errorinput($('#txtphone2'));
            return false;
        }
        var qty2 = Number($('#txtaddress').val());
        if ($('#txtaddress').val().trim() == "" || qty2 >= 0) {
            WorningMessage("يجب ادخال العنوان  !", "The Address must be selected!", "تحذير", "worning");
            Errorinput($('#txtaddress'));
            return false;
        }
        return true;
    }
})(DefStore || (DefStore = {}));
//# sourceMappingURL=DefStore.js.map