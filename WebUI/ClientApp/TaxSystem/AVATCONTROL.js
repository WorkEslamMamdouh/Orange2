$(document).ready(function () {
    AVATCONTROL.InitializeComponent();
});
var AVATCONTROL;
(function (AVATCONTROL) {
    //************system variables
    var SysSession = GetSystemSession(Modules.VatSetting);
    var sys = new SystemTools();
    //***********Variables
    var Model = new AVAT_CONTROL();
    var Period = new Array(2);
    var Account = new Array();
    var VatPeriod = new Array();
    var MasterGrid = new JsGrid();
    var vatyear = Number(SysSession.CurrentEnvironment.CurrentYear);
    //***********Controls
    var txtFromDate;
    var txtToDate;
    var drpVAT_PERIOD;
    var txtVAT_ALLOWED_DAYS;
    var txtVAT_WARNING_DAYS;
    var chkSetting;
    var txtVAT_PREVBAL;
    var txtVAT_DB_ACC;
    var txtVAT_CR_ACC;
    var txtVAT_ACCURUAL_ACC;
    var btnAccountSearch_DB;
    var btnAccountSearch_CR;
    var btnAccountSearch_Acc;
    var btnSave;
    var btnUpdate;
    var btnBack;
    var btnSls_DISC_ACC_CODE;
    var btnPur_DISC_ACC_CODE;
    var txtSls_DISC_ACC_CODE;
    var txtPur_DISC_ACC_CODE;
    var txtSls_DISC;
    var txtPur_DISC;
    //*************************Initialization************************//
    function InitializeComponent() {
        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = "اعدادت الضريبة ";
            Period = [{ id: 1, value: 'كل شهر' }, { id: 2, value: 'كل 3 شهور' }];
        }
        else {
            document.getElementById('Screen_name').innerHTML = "Vat Control Setting";
            Period = [{ id: 1, value: 'Every Month' }, { id: 2, value: 'Every 3 Month' }];
        }
        $("#icon-bar").addClass("display_none");
        $("#btnShow").addClass("display_none");
        $("#btnAdd").addClass("display_none");
        $("#btnPrintTrview").addClass("viewresult");
        $("#btnPrintTrview span").html("عرض تقرير");
        InitializeControls();
        InitializeEvents();
        InitializeGrid();
        debugger;
        FillPeriod();
        Load_Account();
        LoadControlSetting();
        Load_VatPeriod();
        //Button_privialges();
        btnUpdate.disabled = !SysSession.CurrentPrivileges.EDIT;
        chkSetting.disabled = true;
    }
    AVATCONTROL.InitializeComponent = InitializeComponent;
    function InitializeControls() {
        txtFromDate = document.getElementById("txtFromDate");
        txtToDate = document.getElementById("txtToDate");
        drpVAT_PERIOD = document.getElementById("drpVAT_PERIOD");
        txtVAT_ALLOWED_DAYS = document.getElementById("txtVAT_ALLOWED_DAYS");
        txtVAT_WARNING_DAYS = document.getElementById("txtVAT_WARNING_DAYS");
        chkSetting = document.getElementById("chkSetting");
        txtVAT_PREVBAL = document.getElementById("txtVAT_PREVBAL");
        txtVAT_DB_ACC = document.getElementById("txtVAT_DB_ACC");
        txtVAT_CR_ACC = document.getElementById("txtVAT_CR_ACC");
        txtVAT_ACCURUAL_ACC = document.getElementById("txtVAT_ACCURUAL_ACC");
        btnUpdate = document.getElementById("btnUpdate");
        btnSave = document.getElementById("btnSave");
        btnBack = document.getElementById("btnBack");
        btnAccountSearch_DB = document.getElementById("btnAccountSearch_DB");
        btnAccountSearch_CR = document.getElementById("btnAccountSearch_CR");
        btnAccountSearch_Acc = document.getElementById("btnAccountSearch_Acc");
        btnSls_DISC_ACC_CODE = document.getElementById("btnSls_DISC_ACC_CODE");
        btnPur_DISC_ACC_CODE = document.getElementById("btnPur_DISC_ACC_CODE");
        txtSls_DISC_ACC_CODE = document.getElementById("txtSls_DISC_ACC_CODE");
        txtPur_DISC_ACC_CODE = document.getElementById("txtPur_DISC_ACC_CODE");
        txtSls_DISC = document.getElementById("txtSls_DISC");
        txtPur_DISC = document.getElementById("txtPur_DISC");
    }
    function InitializeEvents() {
        btnUpdate.onclick = btnEdit_onclick;
        btnSave.onclick = btnSave_onclick;
        btnBack.onclick = btnBack_onclick;
        chkSetting.onchange = AllowSetting;
        btnAccountSearch_DB.onclick = btnAccountSearch_DB_onclick;
        btnAccountSearch_CR.onclick = btnAccountSearch_CR_onclick;
        btnAccountSearch_Acc.onclick = btnAccountSearch_Acc_onclick;
        btnSls_DISC_ACC_CODE.onclick = btnSls_DISC_ACC_CODE_onclick;
        btnPur_DISC_ACC_CODE.onclick = btnPur_DISC_ACC_CODE_onclick;
    }
    function InitializeGrid() {
        $("#divMasterGridiv").removeClass("display_none");
        var res = GetResourceList("");
        MasterGrid.ElementName = "divMasterGrid";
        MasterGrid.Paging = true;
        MasterGrid.PageSize = 12;
        MasterGrid.Sorting = true;
        MasterGrid.InsertionMode = JsGridInsertionMode.Binding;
        MasterGrid.Editing = false;
        MasterGrid.Inserting = false;
        MasterGrid.SelectedIndex = 1;
        MasterGrid.OnItemEditing = function () { };
        MasterGrid.PrimaryKey = "PERIOD_CODE";
        MasterGrid.Columns = [
            { title: res.App_Code, name: "COMP_CODE", type: "number", width: "10%", visible: false },
            { title: res.App_Code, name: "VAT_YEAR", type: "number", width: "10%", visible: false },
            { title: res.App_Number, name: "PERIOD_CODE", type: "number", width: "10%" },
            { title: res.App_FromDate, name: "FROM_DATE", type: "text", width: "30%" },
            { title: res.App_ToDate, name: "TO_DATE", type: "text", width: "30%" },
            { title: "الحالة", name: "STATUS", type: "text", width: "30%", visible: false },
            { title: res.App_State, name: "STATUS_txt", type: "text", width: "30%" },
            { title: res.App_Registration_Number, name: "VOUCHER_CODE", type: "text", width: "30%" },
            { title: res.App_Tax, name: "NETVAT_AMOUNT", type: "text", width: "30%" },
        ];
        MasterGrid.Bind();
    }
    //**************************************Load Data******************************************//
    function LoadControlSetting() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AVATCONTROL", "GetAllByYear"),
            data: {
                UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token, COMP_CODE: SysSession.CurrentEnvironment.CompCode,
                VAT_YEAR: vatyear
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    Model = result.Response;
                    Display();
                }
            }
        });
    }
    function Load_Account() {
        var Query = "select * from [dbo].[A_ACCOUNT] where COMP_CODE= " + SysSession.CurrentEnvironment.CompCode + " and DETAIL=1 ";
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDtTypes", "ExecuteAccountQry"),
            data: {
                UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token, Query: Query
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    Account = result.Response;
                }
            }
        });
    }
    function FillPeriod() {
        if (SysSession.CurrentEnvironment.Language == "ar") {
            DocumentActions.FillComboFirstvalue(Period, drpVAT_PERIOD, "id", "value", "- اختر -", null);
            DocumentActions.FillComboFirstvalue(Period, drpVAT_PERIOD, "id", "value", "- اختر -", null);
        }
        else {
            DocumentActions.FillComboFirstvalue(Period, drpVAT_PERIOD, "id", "value", "- Select -", null);
            DocumentActions.FillComboFirstvalue(Period, drpVAT_PERIOD, "id", "value", "- Select -", null);
        }
    }
    function Load_VatPeriod() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AVATPERIOD", "GetAllByComp"),
            data: {
                UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token, compcode: Number(SysSession.CurrentEnvironment.CompCode)
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    VatPeriod = result.Response;
                    for (var i = 0; i < VatPeriod.length; i++) {
                        VatPeriod[i].FROM_DATE = DateFormat(VatPeriod[i].FROM_DATE);
                        VatPeriod[i].TO_DATE = DateFormat(VatPeriod[i].TO_DATE);
                        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
                            if (VatPeriod[i].STATUS == 0)
                                VatPeriod[i].STATUS_txt = "مفتوحة";
                            else if (VatPeriod[i].STATUS == 1)
                                VatPeriod[i].STATUS_txt = "مغلقة";
                            else if (VatPeriod[i].STATUS == 2)
                                VatPeriod[i].STATUS_txt = "تم الترحيل";
                        }
                        else if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                            if (VatPeriod[i].STATUS == 0)
                                VatPeriod[i].STATUS_txt = "opened";
                            else if (VatPeriod[i].STATUS == 1)
                                VatPeriod[i].STATUS_txt = "closed";
                            else if (VatPeriod[i].STATUS == 2)
                                VatPeriod[i].STATUS_txt = "posted";
                        }
                    }
                    VatPeriod = VatPeriod.filter(function (x) { return x.VAT_YEAR == vatyear; });
                    MasterGrid.DataSource = VatPeriod;
                    MasterGrid.Bind();
                }
            }
        });
    }
    //*********************************Display*****************************************//
    function Display() {
        debugger;
        txtFromDate.value = DateFormat(Model.VAT_START_DATE);
        txtToDate.value = DateFormat(Model.VAT_END_DATE);
        drpVAT_PERIOD.value = Model.VAT_PERIOD.toString();
        txtVAT_ALLOWED_DAYS.value = Model.VAT_ALLOWED_DAYS.toString();
        txtVAT_WARNING_DAYS.value = Model.VAT_WARNING_DAYS.toString();
        chkSetting.checked = Model.VAT_SETTING;
        txtVAT_PREVBAL.value = Model.VAT_PREVBAL.toString();
        txtVAT_DB_ACC.value = Model.VAT_DB_ACC.toString();
        txtVAT_CR_ACC.value = Model.VAT_CR_ACC.toString();
        txtVAT_ACCURUAL_ACC.value = Model.VAT_ACCURUAL_ACC;
        txtSls_DISC_ACC_CODE.value = Model.Sls_DISC_ACC_CODE;
        txtPur_DISC_ACC_CODE.value = Model.Pur_DISC_ACC_CODE;
        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            $("#txtAccountdesc_Db").val(Account.filter(function (x) { return x.ACC_CODE == Model.VAT_DB_ACC; })[0].ACC_DESCA);
            $("#txtAccountdesc_CR").val(Account.filter(function (x) { return x.ACC_CODE == Model.VAT_CR_ACC; })[0].ACC_DESCA);
            $("#txtAccountdesc_Acc").val(Account.filter(function (x) { return x.ACC_CODE == Model.VAT_ACCURUAL_ACC; })[0].ACC_DESCA);
            $("#txtSls_DISC").val(Account.filter(function (x) { return x.ACC_CODE == Model.Sls_DISC_ACC_CODE; })[0].ACC_DESCA);
            $("#txtPur_DISC").val(Account.filter(function (x) { return x.ACC_CODE == Model.Pur_DISC_ACC_CODE; })[0].ACC_DESCA);
        }
        else {
            $("#txtAccountdesc_Db").val(Account.filter(function (x) { return x.ACC_CODE == Model.VAT_DB_ACC; })[0].ACC_DESCL);
            $("#txtAccountdesc_CR").val(Account.filter(function (x) { return x.ACC_CODE == Model.VAT_CR_ACC; })[0].ACC_DESCL);
            $("#txtAccountdesc_Acc").val(Account.filter(function (x) { return x.ACC_CODE == Model.VAT_ACCURUAL_ACC; })[0].ACC_DESCL);
            $("#txtSls_DISC").val(Account.filter(function (x) { return x.ACC_CODE == Model.Sls_DISC_ACC_CODE; })[0].ACC_DESCL);
            $("#txtPur_DISC").val(Account.filter(function (x) { return x.ACC_CODE == Model.Pur_DISC_ACC_CODE; })[0].ACC_DESCL);
        }
        if (Model.VAT_SETTING)
            chkSetting.disabled = true;
    }
    function AllowSetting() {
        debugger;
        if (!SysSession.CurrentPrivileges.CUSTOM1)
            return;
        if (chkSetting.checked) {
            var p = 0;
            if (drpVAT_PERIOD.value == "1")
                p = 1;
            else if (drpVAT_PERIOD.value == "2")
                p = 3;
            else {
                DisplayMassage("ادخل فترة تقديم الاقرار", "Enter Period", MessageType.Error);
                return;
            }
            debugger;
            Ajax.Callsync({
                type: "Get",
                url: sys.apiUrl("AVATCONTROL", "AllowControlSetting"),
                data: {
                    UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token, COMP_CODE: SysSession.CurrentEnvironment.CompCode,
                    stdt: txtFromDate.value, Enddt: txtToDate.value, period: p, vatyear: vatyear
                },
                success: function (d) {
                    var result = d;
                    if (result.IsSuccess) {
                        debugger;
                        var count = result.Response;
                    }
                }
            });
            Load_VatPeriod();
            chkSetting.disabled = true;
        }
    }
    //***************************************Search*********************************//
    function btnAccountSearch_DB_onclick() {
        var sys = new SystemTools();
        var cond = " COMP_CODE = " + SysSession.CurrentEnvironment.CompCode + " and DETAIL=1 and ACC_GROUP=1";
        sys.FindKey(Modules.VatSetting, "btnAccountSearch_DB", cond, function () {
            var id = SearchGrid.SearchDataGrid.SelectedKey;
            var Query = "select * from [dbo].[A_ACCOUNT] where ACC_CODE= '" + id + "' and COMP_CODE=" + SysSession.CurrentEnvironment.CompCode;
            Ajax.Callsync({
                type: "Get",
                url: sys.apiUrl("AccDtTypes", "ExecuteAccountQry"),
                data: {
                    UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token, Query: Query
                },
                success: function (d) {
                    var result = d;
                    if (result.IsSuccess) {
                        var res = result.Response;
                        txtVAT_DB_ACC.value = res[0].ACC_CODE;
                        if (SysSession.CurrentEnvironment.Language == "ar")
                            $("#txtAccountdesc_Db").val(res[0].ACC_DESCA);
                        else
                            $("#txtAccountdesc_Db").val(res[0].ACC_DESCL);
                    }
                }
            });
        });
    }
    function btnAccountSearch_CR_onclick() {
        debugger;
        var sys = new SystemTools();
        var cond = " COMP_CODE = " + SysSession.CurrentEnvironment.CompCode + " and DETAIL=1 and ACC_GROUP=2";
        sys.FindKey(Modules.VatSetting, "btnAccountSearch_CR", cond, function () {
            debugger;
            var id = SearchGrid.SearchDataGrid.SelectedKey;
            var Query = "select * from [dbo].[A_ACCOUNT] where ACC_CODE= '" + id + "' and COMP_CODE=" + SysSession.CurrentEnvironment.CompCode;
            Ajax.Callsync({
                type: "Get",
                url: sys.apiUrl("AccDtTypes", "ExecuteAccountQry"),
                data: {
                    UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token, Query: Query
                },
                success: function (d) {
                    var result = d;
                    if (result.IsSuccess) {
                        debugger;
                        var res = result.Response;
                        txtVAT_CR_ACC.value = res[0].ACC_CODE;
                        if (SysSession.CurrentEnvironment.Language == "ar")
                            $("#txtAccountdesc_CR").val(res[0].ACC_DESCA);
                        else
                            $("#txtAccountdesc_CR").val(res[0].ACC_DESCL);
                    }
                }
            });
        });
    }
    function btnAccountSearch_Acc_onclick() {
        var sys = new SystemTools();
        var cond = " COMP_CODE = " + SysSession.CurrentEnvironment.CompCode + " and DETAIL=1 and ACC_GROUP=2";
        sys.FindKey(Modules.VatSetting, "btnAccountSearch_Acc", cond, function () {
            var id = SearchGrid.SearchDataGrid.SelectedKey;
            var Query = "select * from [dbo].[A_ACCOUNT] where ACC_CODE= '" + id + "' and COMP_CODE=" + SysSession.CurrentEnvironment.CompCode;
            Ajax.Callsync({
                type: "Get",
                url: sys.apiUrl("AccDtTypes", "ExecuteAccountQry"),
                data: {
                    UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token, Query: Query
                },
                success: function (d) {
                    var result = d;
                    if (result.IsSuccess) {
                        var res = result.Response;
                        txtVAT_ACCURUAL_ACC.value = res[0].ACC_CODE;
                        if (SysSession.CurrentEnvironment.Language == "ar")
                            $("#txtAccountdesc_Acc").val(res[0].ACC_DESCA);
                        else
                            $("#txtAccountdesc_Acc").val(res[0].ACC_DESCL);
                    }
                }
            });
        });
    }
    function btnSls_DISC_ACC_CODE_onclick() {
        var sys = new SystemTools();
        var cond = " COMP_CODE = " + SysSession.CurrentEnvironment.CompCode + " and DETAIL=1";
        sys.FindKey(Modules.VatSetting, "btnSls_DISC_ACC_CODE", cond, function () {
            var id = SearchGrid.SearchDataGrid.SelectedKey;
            var Query = "select * from [dbo].[A_ACCOUNT] where ACC_CODE= '" + id + "' and COMP_CODE=" + SysSession.CurrentEnvironment.CompCode;
            Ajax.Callsync({
                type: "Get",
                url: sys.apiUrl("AccDtTypes", "ExecuteAccountQry"),
                data: {
                    UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token, Query: Query
                },
                success: function (d) {
                    var result = d;
                    if (result.IsSuccess) {
                        debugger;
                        var res = result.Response;
                        txtSls_DISC_ACC_CODE.value = res[0].ACC_CODE;
                        if (SysSession.CurrentEnvironment.Language == "ar") {
                            txtSls_DISC.value = res[0].ACC_DESCA;
                            //  $("#txtSls_DISC").val(res[0].ACC_DESCA);
                        }
                        else {
                            txtSls_DISC.value = res[0].ACC_DESCL;
                            // $("#txtSls_DISC").val(res[0].ACC_DESCL);
                        }
                    }
                }
            });
        });
    }
    function btnPur_DISC_ACC_CODE_onclick() {
        var sys = new SystemTools();
        var cond = " COMP_CODE = " + SysSession.CurrentEnvironment.CompCode + " and DETAIL=1";
        sys.FindKey(Modules.VatSetting, "btnPur_DISC_ACC_CODE", cond, function () {
            var id = SearchGrid.SearchDataGrid.SelectedKey;
            var Query = "select * from [dbo].[A_ACCOUNT] where ACC_CODE= '" + id + "' and COMP_CODE=" + SysSession.CurrentEnvironment.CompCode;
            Ajax.Callsync({
                type: "Get",
                url: sys.apiUrl("AccDtTypes", "ExecuteAccountQry"),
                data: {
                    UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token, Query: Query
                },
                success: function (d) {
                    var result = d;
                    if (result.IsSuccess) {
                        var res = result.Response;
                        txtPur_DISC_ACC_CODE.value = res[0].ACC_CODE;
                        if (SysSession.CurrentEnvironment.Language == "ar")
                            $("#txtPur_DISC").val(res[0].ACC_DESCA);
                        else
                            $("#txtPur_DISC").val(res[0].ACC_DESCL);
                    }
                }
            });
        });
    }
    //***********************************Save Data*************************************//
    function Update() {
        Model.COMP_CODE = Number(SysSession.CurrentEnvironment.CompCode);
        Model.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
        Model.UserCode = SysSession.CurrentEnvironment.UserCode;
        Model.VAT_ACCURUAL_ACC = txtVAT_ACCURUAL_ACC.value;
        Model.VAT_ALLOWED_DAYS = Number(txtVAT_ALLOWED_DAYS.value);
        Model.VAT_CR_ACC = txtVAT_CR_ACC.value;
        Model.VAT_DB_ACC = txtVAT_DB_ACC.value;
        Model.VAT_END_DATE = txtToDate.value;
        Model.VAT_PERIOD = Number(drpVAT_PERIOD.value);
        Model.VAT_PREVBAL = Number(txtVAT_PREVBAL.value);
        Model.VAT_SETTING = chkSetting.checked;
        Model.VAT_START_DATE = txtFromDate.value;
        Model.VAT_WARNING_DAYS = Number(txtVAT_WARNING_DAYS.value);
        Model.VAT_YEAR = vatyear;
        Model.Sls_DISC_ACC_CODE = txtSls_DISC_ACC_CODE.value;
        Model.Pur_DISC_ACC_CODE = txtPur_DISC_ACC_CODE.value;
        Ajax.Callsync({
            type: "post",
            url: sys.apiUrl("AVATCONTROL", "Update"),
            data: JSON.stringify(Model),
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    Model = result.Response;
                    DisplayMassage("تم الحفظ", "Saved Succesfully", MessageType.Succeed);
                    btnBack_onclick();
                }
            }
        });
    }
    function btnSave_onclick() {
        loading('btnsave');
        setTimeout(function () {
            finishSave('btnsave');
            if (!Validation())
                return;
            Update();
            if (Model.VAT_SETTING)
                chkSetting.disabled = true;
            txtFromDate.disabled = true;
            txtToDate.disabled = true;
            chkSetting.disabled = true;
        }, 100);
    }
    function btnEdit_onclick() {
        if (!SysSession.CurrentPrivileges.EDIT)
            return;
        if (!chkSetting.checked) {
            txtFromDate.disabled = false;
            txtToDate.disabled = false;
            drpVAT_PERIOD.disabled = false;
            chkSetting.disabled = !SysSession.CurrentPrivileges.CUSTOM1;
        }
        else {
            txtFromDate.disabled = true;
            txtToDate.disabled = true;
            drpVAT_PERIOD.disabled = true;
            chkSetting.disabled = true;
        }
        txtVAT_ALLOWED_DAYS.disabled = false;
        txtVAT_WARNING_DAYS.disabled = false;
        //txtVAT_DB_ACC.disabled = false;
        //txtVAT_CR_ACC.disabled = false;
        //txtVAT_ACCURUAL_ACC.disabled = false;
        btnAccountSearch_DB.disabled = false;
        btnAccountSearch_CR.disabled = false;
        btnAccountSearch_Acc.disabled = false;
        txtVAT_PREVBAL.disabled = false;
        $("#btnUpdate").addClass("display_none");
        $("#btnBack").removeClass("display_none");
        $("#btnSave").removeClass("display_none");
        btnSls_DISC_ACC_CODE.disabled = false;
        btnPur_DISC_ACC_CODE.disabled = false;
        //txtSls_DISC_ACC_CODE.disabled = false;
        //txtPur_DISC_ACC_CODE.disabled = false;
        //chkSetting.disabled = false;
    }
    function btnBack_onclick() {
        $("#btnUpdate").removeClass("display_none");
        $("#btnBack").addClass("display_none");
        $("#btnSave").addClass("display_none");
        txtVAT_PREVBAL.disabled = true;
        txtVAT_ALLOWED_DAYS.disabled = true;
        drpVAT_PERIOD.disabled = true;
        txtVAT_WARNING_DAYS.disabled = true;
        txtVAT_DB_ACC.disabled = true;
        txtVAT_CR_ACC.disabled = true;
        txtVAT_ACCURUAL_ACC.disabled = true;
        btnAccountSearch_DB.disabled = true;
        btnAccountSearch_CR.disabled = true;
        btnAccountSearch_Acc.disabled = true;
        Display();
        chkSetting.disabled = false;
        btnSls_DISC_ACC_CODE.disabled = true;
        btnPur_DISC_ACC_CODE.disabled = true;
        txtSls_DISC_ACC_CODE.disabled = true;
        txtPur_DISC_ACC_CODE.disabled = true;
        txtFromDate.disabled = true;
        txtToDate.disabled = true;
        chkSetting.disabled = true;
    }
    //***********************Validation && privilege*********//
    function Validation() {
        if ($("#txtFromDate").val() == "") {
            DisplayMassage(" من فضلك ادخل تاريخ  البداية  ", "Enter start date please", MessageType.Error);
            return false;
        }
        if ($("#txtToDate").val() == "") {
            DisplayMassage(" من فضلك ادخل تاريخ النهاية  ", "Enter End date please", MessageType.Error);
            return false;
        }
        if ($("#txtVAT_WARNING_DAYS").val() == "") {
            DisplayMassage(" من فضلك ادخل مدة التنبيه للاقرار  ", "Enter warning days please", MessageType.Error);
            return false;
        }
        if ($("#txtVAT_PREVBAL").val() == "") {
            DisplayMassage(" من فضلك ادخل ضريبة القيمة المضافة من الفترة السابقة  ", "Enter Pervious vat please", MessageType.Error);
            return false;
        }
        if (drpVAT_PERIOD.value == "" || drpVAT_PERIOD.value == "null") {
            DisplayMassage(" من فضلك ادخل فترة تقديم الاقرار  ", "Enter period please", MessageType.Error);
            return false;
        }
        if ($("#txtVAT_ALLOWED_DAYS").val() == "") {
            DisplayMassage(" من فضلك ادخل مدة السماح للاقرار  ", "Enter  vat Allowed days please", MessageType.Error);
            return false;
        }
        if ($("#txtVAT_DB_ACC").val() == "") {
            DisplayMassage(" من فضلك ادخل حساب ضريبة القيمة المضافة مدين  ", "Enter  vat debit Account please", MessageType.Error);
            return false;
        }
        if ($("#txtVAT_CR_ACC").val() == "") {
            DisplayMassage(" من فضلك ادخل حساب ضريبة القيمة المضافة دائن  ", "Enter  vat Credit Account please", MessageType.Error);
            return false;
        }
        if ($("#txtVAT_ACCURUAL_ACC").val() == "") {
            DisplayMassage(" من فضلك ادخل حساب ضريبة القيمة المضافة المستحقة  ", "Enter VAT ACCURUAL ACC please", MessageType.Error);
            return false;
        }
        if ($("#txtSls_DISC_ACC_CODE").val() == "") {
            DisplayMassage(" من فضلك ادخل حساب  خصم مبيعات الخدمة  ", "Enter VAT ACCURUAL ACC please", MessageType.Error);
            return false;
        }
        if ($("#txtPur_DISC_ACC_CODE").val() == "") {
            DisplayMassage(" من فضلك ادخل حساب  خصم مشتريات الخدمة  ", "Enter VAT ACCURUAL ACC please", MessageType.Error);
            return false;
        }
        return true;
    }
    function Button_privialges() {
        btnUpdate.disabled = !SysSession.CurrentPrivileges.EDIT;
    }
})(AVATCONTROL || (AVATCONTROL = {}));
//# sourceMappingURL=AVATCONTROL.js.map