$(document).ready(function () {
    ManagementVoucher.InitalizeComponent();
});
var ManagementVoucher;
(function (ManagementVoucher) {
    //System
    var sys = new SystemTools();
    var SysSession = GetSystemSession(Modules.ManagementVoucher);
    var compcode;
    var VoucherCCType = 0;
    //GridView
    var Grid = new JsGrid();
    //Arrays
    var StatesFilterDetailsAr = new Array();
    var StatesFilterDetailsEn = new Array();
    var VoucherTypesDetails = new Array();
    var Display_G_USERS = new Array();
    var VoucherSourceDetails = new Array();
    var AQJournalHeaderDetails = new Array();
    var searchDetails = new Array();
    var VoucherProcessHeaderDetails = new Array();
    var TmpVoucherProcessSingl = new A_TmpVoucherProcess();
    var TmpVoucherProcessDetails = new Array();
    var Newtmp = new Array();
    //textboxs
    var txtFromDate;
    var txtToDate;
    var txtUpdatedBy;
    var txtUpdatedAt;
    var txtSearch;
    //DropdownLists
    var ddlStatusFilter;
    var ddlVoucherTypeFilter;
    var ddluserFilter;
    var ddlVoucherSourceFilter;
    var ddlJournalType;
    //buttons 
    var btnShow;
    //var btnAdd: HTMLButtonElement;
    var btnEdit;
    var btnSave;
    var btnBack;
    var btnReverse_Selection;
    var btnFalse_Everyone;
    var btnTrue_Everyone;
    var btnPost;
    var btnUnpost;
    var btnAuthorize;
    var btnUnauthorize;
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);
    function InitalizeComponent() {
        $("#Mod_Flag").val('1');
        //System
        //debugger
        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = "ادارة السندات";
        }
        else {
            document.getElementById('Screen_name').innerHTML = "Management Voucher";
        }
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        VoucherCCType = SysSession.CurrentEnvironment.I_Control[0].GL_VoucherCCType;
        InitalizeControls();
        fillddlStatusFilter();
        // Call Fill Dropdownlists Functions
        fillddlVoucherTypeFilter();
        fillddlVoucherSourceFilter();
        fillddluserFilter();
        //Set Secial Values While Load
        txtFromDate.value = GetDate();
        txtToDate.value = GetDate();
        $("#ddlStatusFilter").prop("value", "3");
        InitalizeEvents();
        txtFromDate.value = DateStartMonth();
        txtToDate.value = ConvertToDateDash(GetDate()) <= ConvertToDateDash(SysSession.CurrentEnvironment.EndDate) ? GetDate() : SysSession.CurrentEnvironment.EndDate;
        btnPost.disabled = true;
        btnUnpost.disabled = true;
        btnAuthorize.disabled = true;
        btnUnauthorize.disabled = true;
        InitializeGrid();
        btnShow_onclick();
        $('#btnPrint').addClass('display_none');
        $('#btnAdd').addClass('display_none');
        $('#icon-bar').addClass('display_none');
        $('#btnUpdate').addClass('display_none');
        $('#btnPrintTransaction').addClass('display_none');
        $('#btnSave').addClass('display_none');
        $('#btnBack').addClass('display_none');
    }
    ManagementVoucher.InitalizeComponent = InitalizeComponent;
    //------------------------------------------------------ Main Region -----------------------------------
    function InitalizeControls() {
        //textboxs
        txtFromDate = document.getElementById("txtFromDate");
        txtToDate = document.getElementById("txtToDate");
        txtUpdatedBy = document.getElementById("txtUpdatedBy");
        txtUpdatedAt = document.getElementById("txtUpdatedAt");
        txtSearch = document.getElementById("txtSearch");
        //DropdownLists
        ddlStatusFilter = document.getElementById("ddlStatusFilter");
        ddlVoucherSourceFilter = document.getElementById("ddlVoucherSourceFilter");
        ddlVoucherTypeFilter = document.getElementById("ddlVoucherTypeFilter");
        ddluserFilter = document.getElementById("ddluserFilter");
        ddlJournalType = document.getElementById("ddlJournalType");
        //buttons
        btnShow = document.getElementById("btnShow");
        //btnAdd = document.getElementById("btnAdd") as HTMLButtonElement;
        btnEdit = document.getElementById("btnEdit");
        btnSave = document.getElementById("btnSave");
        btnBack = document.getElementById("btnBack");
        btnReverse_Selection = document.getElementById("btnReverse_Selection");
        btnFalse_Everyone = document.getElementById("btnFalse_Everyone");
        btnTrue_Everyone = document.getElementById("btnTrue_Everyone");
        btnPost = document.getElementById("btnPost");
        btnUnpost = document.getElementById("btnUnpost");
        btnAuthorize = document.getElementById("btnAuthorize");
        btnUnauthorize = document.getElementById("btnUnauthorize");
    }
    function InitalizeEvents() {
        //debugger
        btnShow.onclick = btnShow_onclick;
        //btnSave.onclick = btnSave_onClick;
        //btnBack.onclick = btnBack_onclick;
        //btnEdit.onclick = btnEdit_onclick;
        txtSearch.onkeyup = txtSearch_onKeyup;
        btnReverse_Selection.onclick = btnReverse_Selection_onclick;
        btnFalse_Everyone.onclick = btnFalse_Everyone_onclick;
        btnTrue_Everyone.onclick = btnTrue_Everyone_onclick;
        btnPost.onclick = function () { Insert(1); }; // تصديق 
        btnUnpost.onclick = function () { Insert(2); }; // فك تصديق 
        btnAuthorize.onclick = function () { Insert(3); }; //ترحيل 
        btnUnauthorize.onclick = function () { Insert(4); }; //فك ترحيل          
    }
    //------------------------------------------------------ Buttons Region -----------------------------------
    function btnEdit_onclick() {
        txtUpdatedAt.value = DateTimeFormat(Date().toString());
        txtUpdatedBy.value = SysSession.CurrentEnvironment.UserCode;
    }
    function btnShow_onclick() {
        $("#divGridShow").removeClass("display_none");
        $("#divJournalDetail").addClass("display_none");
        BindGridData();
    }
    function btnBack_onclick() {
        $("#divFilter").removeClass("disabledDiv");
        $("#divGridShow").removeClass("disabledDiv");
    }
    function btnSave_onClick() {
        //if (!Validation_Header())
        //    return;
        //Assign();
        //if (FlagAddOrEdit == 1) {
        //    //Insert();
        //} else if (FlagAddOrEdit == 2)  {
        //    //Update();
        //}
        //$("#divFilter").removeClass("disabledDiv");
        //$("#divGridShow").removeClass("disabledDiv");
        //DisableControls();
        //BindGridData();
        //ShowButons();
        //$("#ButtonsDiv :input").removeAttr("disabled");
    }
    //-------------------------------------------------------- Events Region----------------------------------------- 
    function ddlStatusFilter_onchange() {
        //debugger
        if (ddlStatusFilter.value == '0') // تصديق 
         {
            btnPost.disabled = false;
            btnUnpost.disabled = true;
            btnAuthorize.disabled = true;
            btnUnauthorize.disabled = true;
            BindGridData();
        }
        else if (ddlStatusFilter.value == '1') { //مصدق 
            btnPost.disabled = true;
            btnUnpost.disabled = false;
            btnAuthorize.disabled = false;
            btnUnauthorize.disabled = true;
            BindGridData();
        }
        else if (ddlStatusFilter.value == '2') { //مرحل  
            btnPost.disabled = true;
            btnUnpost.disabled = true;
            btnAuthorize.disabled = true;
            btnUnauthorize.disabled = false;
            BindGridData();
        }
        else {
            btnPost.disabled = true;
            btnUnpost.disabled = true;
            btnAuthorize.disabled = true;
            btnUnauthorize.disabled = true;
            BindGridData();
        }
    }
    //------------------------------------------------------ Buttons checkbox-----------------------------------
    function btnReverse_Selection_onclick() {
        //debugger
        for (var i = 0; i < TmpVoucherProcessDetails.length; i++) {
            //debugger
            if (TmpVoucherProcessDetails[i].Selected == true) {
                TmpVoucherProcessDetails[i].Selected = false;
                $('#' + TmpVoucherProcessDetails[i].VOUCHER_CODE).prop("checked", false);
            }
            else if (TmpVoucherProcessDetails[i].Selected == false) {
                TmpVoucherProcessDetails[i].Selected = true;
                $('#' + TmpVoucherProcessDetails[i].VOUCHER_CODE).prop("checked", true);
            }
        }
        //console.log(TmpVoucherProcessDetails);
    }
    function btnFalse_Everyone_onclick() {
        $('.form-check-input').prop("checked", false);
        for (var i = 0; i < TmpVoucherProcessDetails.length; i++) {
            TmpVoucherProcessDetails[i].Selected = false;
        }
        //console.log(TmpVoucherProcessDetails);
    }
    function btnTrue_Everyone_onclick() {
        $('.form-check-input').prop("checked", true);
        for (var i = 0; i < TmpVoucherProcessDetails.length; i++) {
            TmpVoucherProcessDetails[i].Selected = true;
        }
        //console.log(TmpVoucherProcessDetails);
    }
    //------------------------------------------------------ Normal Grid Region -----------------------------------
    function changeCheckbox(VOUCHER_CODE, value) {
        for (var i in TmpVoucherProcessDetails) {
            if (TmpVoucherProcessDetails[i].VOUCHER_CODE == VOUCHER_CODE) {
                TmpVoucherProcessDetails[i].Selected = value;
                break; //Stop this loop, we found it!
            }
        }
        //console.log(TmpVoucherProcessDetails);
    }
    function InitializeGrid() {
        //   $("#divGridDetails").attr("style", "");
        debugger;
        var res = GetResourceList("");
        Grid.OnRowDoubleClicked = GridRowDoubleClick;
        Grid.ElementName = "divGridDetails";
        Grid.PrimaryKey = "VOUCHER_CODE";
        Grid.Paging = true;
        Grid.PageSize = 10;
        Grid.Sorting = true;
        Grid.InsertionMode = JsGridInsertionMode.Binding;
        Grid.Editing = false;
        Grid.Inserting = false;
        Grid.SelectedIndex = 1;
        Grid.OnItemEditing = function () { };
        Grid.Columns = [
            {
                title: res.choose, css: "ColumPadding", name: "checkbox", width: "6%",
                itemTemplate: function (s, item) {
                    var txt = CreateElement("checkbox", "form-check-input", " ", " ", "", " ");
                    txt.id = "" + item.VOUCHER_CODE + "";
                    txt.style.height = "25px";
                    txt.style.width = "25px";
                    txt.onclick = function (e) {
                        //item.s = Number(txt.value);
                        if (txt.checked == true) {
                            //txt.value = 'true';
                            //item.Selected = true;
                            changeCheckbox(item.VOUCHER_CODE, true);
                        }
                        else if (txt.checked == false) {
                            changeCheckbox(item.VOUCHER_CODE, false);
                        }
                    };
                    //txt.disabled = StatusFlag;
                    var checked = TmpVoucherProcessDetails.filter(function (s) { return s.VOUCHER_CODE == item.VOUCHER_CODE; });
                    txt.checked = checked[0].Selected == null ? false : checked[0].Selected;
                    //txt.value = 'false';
                    //item.Selected = false;
                    return txt;
                }
            },
            { title: res.App_Registration_Number, name: "VOUCHER_CODE", type: "text", width: "5%" },
            { title: res.App_date, name: "VOUCHER_DATE", type: "text", width: "10%" },
            { title: res.App_desc, name: "VOUCHER_DESC", type: "text", width: "20%" },
            { title: res.source, name: (lang == "ar" ? "Src_DescA" : "Src_DescE"), type: "text", width: "5%" },
            { title: res.App_Type, name: (lang == "ar" ? "TYPE_DESCA" : "TYPE_DESCE"), type: "text", width: "5%" },
            //  { title: "الاجمالي", name: "Openbalance", type: "text", width: "100px" },
            { title: res.App_State, name: (lang == "ar" ? "St_DescA" : "St_DescE"), type: "text", width: "5%" },
            { title: 'VoucherID', name: "VoucherID", type: "text", width: "20%", visible: false },
        ];
    }
    function BindGridData() {
        var FromDate = DateFormatRep(txtFromDate.value).toString();
        var toDate = DateFormatRep(txtToDate.value).toString();
        var source = 0;
        var status = 0;
        var type = 0;
        var USER_CODE = '';
        status = Number(ddlStatusFilter.value.toString());
        if (ddlVoucherSourceFilter.value != "null") {
            source = Number(ddlVoucherSourceFilter.value.toString());
        }
        if (ddlVoucherTypeFilter.value != "null") {
            type = Number(ddlVoucherTypeFilter.value.toString());
        }
        USER_CODE = ddluserFilter.value != "null" ? ddluserFilter.value : "NUll";
        AQJournalHeaderDetails = new Array();
        TmpVoucherProcessDetails = new Array();
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GLTrVoucher", "GetAllAQ_GetJournal"),
            data: { CompCode: compcode, USER_CODE: USER_CODE, FromDate: FromDate, toDate: toDate, source: source, status: status, type: type, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    //debugger
                    AQJournalHeaderDetails = result.Response;
                    Assign();
                    Grid.DataSource = AQJournalHeaderDetails;
                    Grid.Bind();
                }
            }
        });
    }
    function GridRowDoubleClick() {
    }
    //------------------------------------------------------ Fill DropDownList Region ----------------------------------
    function fillddlStatusFilter() {
        StatesFilterDetailsAr = ["جديد", " مصدق", "مرحل", "الجميع"];
        StatesFilterDetailsEn = ["New", " Approved", "deported", "All"];
        if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
            for (var i = 0; i < StatesFilterDetailsEn.length; i++) {
                var newoption = document.createElement("option");
                newoption.value = i.toString();
                newoption.text = StatesFilterDetailsEn[i];
                ddlStatusFilter.options.add(newoption);
            }
        }
        else {
            for (var i = 0; i < StatesFilterDetailsAr.length; i++) {
                var newoption = document.createElement("option");
                newoption.value = i.toString();
                newoption.text = StatesFilterDetailsAr[i];
                ddlStatusFilter.options.add(newoption);
            }
        }
        ddlStatusFilter.onchange = ddlStatusFilter_onchange;
    }
    function fillddlVoucherTypeFilter() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GLTrVoucher", "GetAllVoucherTypes"),
            data: {
                CompCode: compcode, VoucherType: 1, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    VoucherTypesDetails = result.Response;
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                        DocumentActions.FillCombowithdefult(VoucherTypesDetails, ddlVoucherTypeFilter, "TYPE_CODE", "TYPE_DESCE", "Select type");
                        DocumentActions.FillCombowithdefult(VoucherTypesDetails, ddlJournalType, "TYPE_CODE", "TYPE_DESCE", "Select type");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(VoucherTypesDetails, ddlVoucherTypeFilter, "TYPE_CODE", "TYPE_DESCA", "اختر النوع");
                        DocumentActions.FillCombowithdefult(VoucherTypesDetails, ddlJournalType, "TYPE_CODE", "TYPE_DESCA", "اختر النوع");
                    }
                }
            }
        });
    }
    function fillddluserFilter() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("G_USERS", "GetAll"),
            data: {
                CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    Display_G_USERS = result.Response;
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                        DocumentActions.FillCombowithdefult(Display_G_USERS, ddluserFilter, "USER_CODE", "USER_CODE", "Select user");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(Display_G_USERS, ddluserFilter, "USER_CODE", "USER_CODE", "اسم المستخدم");
                    }
                }
            }
        });
    }
    function fillddlVoucherSourceFilter() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GCodes", "GetAll"),
            data: {
                codeType: 'VchrSrc', UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    VoucherSourceDetails = result.Response;
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                        DocumentActions.FillCombowithdefult(VoucherSourceDetails, ddlVoucherSourceFilter, "CodeValue", "DescE", "Select Source");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(VoucherSourceDetails, ddlVoucherSourceFilter, "CodeValue", "DescA", "اختر المصدر");
                    }
                }
            }
        });
    }
    //------------------------------------------------------ Clear && Search && Enable && Disabled Region -----------------------------------     
    function txtSearch_onKeyup() {
        $("#divGridDetails").jsGrid("option", "pageIndex", 1);
        if (txtSearch.value != "") {
            var search_1 = txtSearch.value.toLowerCase();
            searchDetails = AQJournalHeaderDetails.filter(function (x) { return x.VOUCHER_CODE.toString().search(search_1) >= 0 || x.Src_DescA.toLowerCase().search(search_1) >= 0
                || x.Src_DescE.toLowerCase().search(search_1) >= 0 || x.St_DescA.toLowerCase().search(search_1) >= 0 || x.St_DescE.toLowerCase().search(search_1) >= 0
                || x.TYPE_DESCA.toLowerCase().search(search_1) >= 0 || x.TYPE_DESCE.toLowerCase().search(search_1) >= 0 || x.VOUCHER_DESC.toLowerCase().search(search_1) >= 0; });
            Grid.DataSource = searchDetails;
            Grid.Bind();
        }
        else {
            Grid.DataSource = AQJournalHeaderDetails;
            Grid.Bind();
        }
    }
    function GetDate() {
        var today = new Date();
        var dd = today.getDate().toString();
        var ReturnedDate;
        var mm = (today.getMonth() + 1).toString();
        var yyyy = today.getFullYear();
        if (Number(dd) < 10) {
            dd = ('0' + dd);
        }
        if (Number(mm) < 10) {
            mm = ('0' + mm);
        }
        ReturnedDate = yyyy + '-' + mm + '-' + dd;
        return ReturnedDate;
    }
    //--------------------------------------------------- Main Functions-----------------------------------------------
    function Assign() {
        for (var i = 0; i < AQJournalHeaderDetails.length; i++) {
            AQJournalHeaderDetails[i].VOUCHER_DATE = DateFormat(AQJournalHeaderDetails[i].VOUCHER_DATE.toString());
            TmpVoucherProcessSingl = new A_TmpVoucherProcess;
            TmpVoucherProcessSingl.id = 0;
            TmpVoucherProcessSingl.CurrentUserCode = SysSession.CurrentEnvironment.UserCode;
            TmpVoucherProcessSingl.Selected = false;
            TmpVoucherProcessSingl.COMP_CODE = AQJournalHeaderDetails[i].COMP_CODE;
            TmpVoucherProcessSingl.VOUCHER_CODE = AQJournalHeaderDetails[i].VOUCHER_CODE;
            TmpVoucherProcessSingl.VOUCHER_DATE = AQJournalHeaderDetails[i].VOUCHER_DATE;
            TmpVoucherProcessSingl.VOUCHER_DESC = AQJournalHeaderDetails[i].VOUCHER_DESC;
            TmpVoucherProcessSingl.VOUCHER_STATUS = AQJournalHeaderDetails[i].VOUCHER_STATUS;
            TmpVoucherProcessSingl.TYPE_CODE = AQJournalHeaderDetails[i].TYPE_CODE;
            TmpVoucherProcessSingl.REF_CODE = AQJournalHeaderDetails[i].REF_CODE;
            TmpVoucherProcessSingl.CREATED_BY = AQJournalHeaderDetails[i].CREATED_BY;
            TmpVoucherProcessSingl.CREATED_AT = AQJournalHeaderDetails[i].CREATED_AT;
            TmpVoucherProcessSingl.UPDATED_BY = AQJournalHeaderDetails[i].UPDATED_BY;
            TmpVoucherProcessSingl.UPDATED_AT = AQJournalHeaderDetails[i].UPDATED_AT;
            TmpVoucherProcessSingl.POSTED_BY = AQJournalHeaderDetails[i].POSTED_BY;
            TmpVoucherProcessSingl.POSTED_AT = AQJournalHeaderDetails[i].POSTED_AT;
            TmpVoucherProcessSingl.SOURCE_TYPE = Number(AQJournalHeaderDetails[i].SOURCE_TYPE);
            TmpVoucherProcessSingl.VOUCHER_DATEH = AQJournalHeaderDetails[i].VOUCHER_DATEH;
            TmpVoucherProcessSingl.AUTHORISED_BY = AQJournalHeaderDetails[i].AUTHORISED_BY;
            TmpVoucherProcessSingl.AUTHORISED_AT = AQJournalHeaderDetails[i].AUTHORISED_AT;
            TmpVoucherProcessSingl.TYPE_DESCA = AQJournalHeaderDetails[i].TYPE_DESCA;
            TmpVoucherProcessSingl.TYPE_DESCE = AQJournalHeaderDetails[i].TYPE_DESCE;
            TmpVoucherProcessSingl.St_DescE = AQJournalHeaderDetails[i].St_DescE;
            TmpVoucherProcessSingl.St_DescA = AQJournalHeaderDetails[i].St_DescA;
            TmpVoucherProcessSingl.Src_DescE = AQJournalHeaderDetails[i].Src_DescE;
            TmpVoucherProcessSingl.St_DescA = AQJournalHeaderDetails[i].St_DescA;
            TmpVoucherProcessSingl.Src_DescA = AQJournalHeaderDetails[i].Src_DescA;
            TmpVoucherProcessSingl.VoucherID = AQJournalHeaderDetails[i].VoucherID;
            TmpVoucherProcessDetails.push(TmpVoucherProcessSingl);
        }
    }
    function Insert(OpCode) {
        //TmpVoucherProcessDetails[0].Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
        //TmpVoucherProcessDetails[0].UserCode = SysSession.CurrentEnvironment.UserCode;
        //TmpVoucherProcessDetails[0].OpCode = OpCode;
        Newtmp = TmpVoucherProcessDetails.filter(function (x) { return x.Selected == true; });
        Newtmp[0].Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
        Newtmp[0].UserCode = SysSession.CurrentEnvironment.UserCode;
        Newtmp[0].OpCode = OpCode;
        Newtmp[0].Branch_Code = SysSession.CurrentEnvironment.BranchCode;
        Newtmp[0].Comp_Code = SysSession.CurrentEnvironment.CompCode;
        Newtmp[0].MODULE_CODE = Modules.ManagementVoucher;
        Newtmp[0].sec_FinYear = SysSession.CurrentEnvironment.CurrentYear;
        //debugger
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("GLTrVoucher", "Insert_A_TmpVoucher_Proc"),
            data: JSON.stringify(Newtmp),
            success: function (d) {
                var result = d;
                if (result.IsSuccess == true) {
                    VoucherProcessHeaderDetails = result.Response;
                    BindGridData();
                    DisplayMassage("تم الحفظ ", '(OK)', MessageType.Succeed);
                    Save_Succ_But();
                }
                else {
                    DisplayMassage("هناك خطــأ ", '(Error)', MessageType.Error);
                }
            }
        });
    }
})(ManagementVoucher || (ManagementVoucher = {}));
//# sourceMappingURL=ManagementVoucher.js.map