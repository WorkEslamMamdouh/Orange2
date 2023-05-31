$(document).ready(function () {
    JournalVoucherNew.InitalizeComponent();
});
var JournalVoucherNew;
(function (JournalVoucherNew) {
    //System
    var sys = new SystemTools();
    var SysSession = GetSystemSession(Modules.JournalVoucher);
    var compcode;
    var VoucherCCDtType = 0;
    var VoucherCCType = 0;
    var GL_JournalSaveUnbalanced = false;
    var startDate;
    var EndDate;
    var FinYear = (SysSession.CurrentEnvironment.CurrentYear);
    //GridView
    var Grid = new JsGrid();
    //Arrays
    var StatesFilterDetailsAr = new Array();
    var StatesFilterDetailsEn = new Array();
    var VoucherTypesDetails = new Array();
    var VoucherSourceDetails = new Array();
    var AQJournalHeaderWithDetails = new Array();
    var TempHeaderWithDetail = new VchrTemplatMasterDetail();
    var SearchDetails = new Array();
    var AccountDetails = new A_ACCOUNT();
    var AccountDetailsIst = new Array();
    var CostCentreDetailsIst = new Array();
    var CostCenterDetails = new G_COST_CENTER();
    var CostCentreDetailsCCDTIst = new Array();
    var CostCentreDetailsCCDT = new A_CCDT_COSTCENTERS();
    //Models
    var MasterDetailModel = new JournalMasterDetails();
    var ReversedJournalMasterDetailModel = new AQ_GetJournalHeaderWithDetail();
    var JournalHeaderModel = new A_JOURNAL_HEADER();
    var JournalDetailModel = new Array();
    var JournalDetailSingleModel = new A_JOURNAL_DETAIL();
    var JournalDetailModelFiltered = new Array();
    var AQJournalDetailModel = new Array();
    var AQJournalDetailSingleModel = new AQ_GetJournalDetail();
    var SelectedJournalModel = new Array();
    var selectedTemplateModel = new A_TR_VchrTemplate();
    var TemplateDetailModelFiltered = new Array();
    var TempMasterDetailModel = new VchrTemplatMasterDetail();
    var TempHeaderModel = new A_TR_VchrTemplate();
    var TempDetailModel = new Array();
    var TempDetailSingleModel = new A_TR_VchrTemplateDetail();
    //textboxs
    var txtFromDate;
    var txtToDate;
    var txtJouranlNumber;
    var txtJouranlDate;
    var txtJournalDescripton;
    var txtRefNumber;
    var txtResource;
    var txtCreatedBy;
    var txtCreatedAt;
    var txtUpdatedBy;
    var txtUpdatedAt;
    var txtAuthorizedBy;
    var txtAuthorizedAt;
    var txtPostedBy;
    var txtPostedAt;
    var txtSearch;
    var txtTotalDebit;
    var txtTotalCredit;
    var txtDifference;
    var txtCostCntrNameFooter;
    var txtAccountNameFooter;
    var txtTempName;
    var txtTempNumber;
    //DropdownLists
    var ddlStatusFilter;
    var ddlVoucherTypeFilter;
    var ddlVoucherSourceFilter;
    var ddlJournalType;
    //buttons
    var btnCopyRemark;
    var btnShow;
    var btnAdd;
    var btnUpdate;
    var btnSave;
    var btnSaveTemp;
    var btnBackTemp;
    var btnBack;
    var btnAddDetails;
    var btnPost;
    var btnAuthorize;
    var btnUnAuthorize;
    var btnReverseVoucher;
    var btnLoadTemplate;
    var btnCreateTemplate;
    var btnUpdateTemplate;
    var btnDeleteTemplate;
    //--- Print Buttons
    var btnPrint;
    var btnPrintTrview;
    var btnPrintTrPDF;
    var btnPrintTrEXEL;
    // Radio Buttons
    var rdNew;
    var rdAuthorized;
    var rdPosted;
    //var rdPosted: HTMLInputElement;
    var rdSaveValue;
    var rdSaveDesc;
    // Flages
    var FlagAddOrEdit = 0; //1 Add 2 Edit
    var TempFlagAddOrEdit = 0; //1 Add 2 Edit Template
    var showFlag = false;
    var TempshowFlag = false;
    var AuthorizeFlag = false;
    var PostFlag = false;
    var ReverseFlag = false;
    var AfterInsertOrUpdateFlag = false;
    //global
    var CountGrid = 0;
    var GlobalVoucherID = 0;
    var GlobalTemplateID = 0;
    var DepitTotal = 0;
    var CreditTotal = 0;
    var btnPrintTransaction;
    var GlobalNum = 0;
    var Events = 0;
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);
    function InitalizeComponent() {
        //System
        OpenScreen(SysSession.CurrentEnvironment.UserCode, SysSession.CurrentEnvironment.CompCode, SysSession.CurrentEnvironment.BranchCode, Modules.JournalVoucher, SysSession.CurrentEnvironment.CurrentYear);
        (SysSession.CurrentEnvironment.ScreenLanguage == "ar") ? document.getElementById('Screen_name').innerHTML = "سند قيد" : document.getElementById('Screen_name').innerHTML = "Journal Voucher";
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        VoucherCCType = SysSession.CurrentEnvironment.I_Control[0].GL_VoucherCCType;
        GL_JournalSaveUnbalanced = SysSession.CurrentEnvironment.I_Control[0].GL_JournalSaveUnbalanced;
        VoucherCCDtType = SysSession.CurrentEnvironment.I_Control[0].GL_VoucherCCDT_Type;
        InitalizeControls();
        // Call Fill Dropdownlists Functions
        fillddlStatusFilter();
        fillddlVoucherTypeFilter();
        fillddlVoucherSourceFilter();
        GetAllAccount();
        GetAllCostCenters();
        GetAllCostCentersCCDT();
        //Set Secial Values While Load
        txtFromDate.value = DateStartMonth();
        txtToDate.value = ConvertToDateDash(GetDate()) <= ConvertToDateDash(SysSession.CurrentEnvironment.EndDate) ? GetDate() : SysSession.CurrentEnvironment.EndDate;
        txtJouranlDate.value = GetDate();
        $("#ddlStatusFilter").prop("value", "3");
        btnAddDetails.onclick = AddNewRow;
        InitalizeEvents();
        InitializeGrid();
    }
    JournalVoucherNew.InitalizeComponent = InitalizeComponent;
    //------------------------------------------------------ Main Region -----------------------------------
    function InitalizeControls() {
        //textboxs
        txtFromDate = document.getElementById("txtFromDate");
        txtToDate = document.getElementById("txtToDate");
        txtJouranlNumber = document.getElementById("txtJouranlNumber");
        txtJouranlDate = document.getElementById("txtJouranlDate");
        txtJournalDescripton = document.getElementById("txtJournalDescripton");
        txtRefNumber = document.getElementById("txtRefNumber");
        txtResource = document.getElementById("txtResource");
        txtCreatedBy = document.getElementById("txtCreatedBy");
        txtCreatedAt = document.getElementById("txtCreatedAt");
        txtUpdatedBy = document.getElementById("txtUpdatedBy");
        txtUpdatedAt = document.getElementById("txtUpdatedAt");
        txtAuthorizedBy = document.getElementById("txtAuthorizedBy");
        txtAuthorizedAt = document.getElementById("txtAuthorizedAt");
        txtPostedBy = document.getElementById("txtPostedBy");
        txtPostedAt = document.getElementById("txtPostedAt");
        txtSearch = document.getElementById("txtSearch");
        txtTotalDebit = document.getElementById("txtTotalDebit");
        txtTotalCredit = document.getElementById("txtTotalCredit");
        txtDifference = document.getElementById("txtDifference");
        txtCostCntrNameFooter = document.getElementById("txtCostCntrNameFooter");
        txtAccountNameFooter = document.getElementById("txtAccountNameFooter");
        txtTempName = document.getElementById("txtTempName");
        txtTempNumber = document.getElementById("txtTempNumber");
        //DropdownLists
        ddlStatusFilter = document.getElementById("ddlStatusFilter");
        ddlVoucherSourceFilter = document.getElementById("ddlVoucherSourceFilter");
        ddlVoucherTypeFilter = document.getElementById("ddlVoucherTypeFilter");
        ddlJournalType = document.getElementById("ddlJournalType");
        //buttons
        btnCopyRemark = document.getElementById("btnCopyRemark");
        btnShow = document.getElementById("btnShow");
        btnAdd = document.getElementById("btnAdd");
        btnUpdate = document.getElementById("btnUpdate");
        btnSave = document.getElementById("btnSave");
        btnSaveTemp = document.getElementById("btnSaveTemp");
        btnBackTemp = document.getElementById("btnBackTemp");
        btnBack = document.getElementById("btnBack");
        btnReverseVoucher = document.getElementById("btnReverseVoucher");
        btnAddDetails = DocumentActions.GetElementById("btnAddDetails");
        btnAuthorize = document.getElementById("btnAuthorize");
        btnUnAuthorize = document.getElementById("btnUnAuthorize");
        btnPost = DocumentActions.GetElementById("btnPost");
        btnLoadTemplate = DocumentActions.GetElementById("btnLoadTemplate");
        btnCreateTemplate = document.getElementById("btnCreateTemplate");
        btnUpdateTemplate = document.getElementById("btnEditTemplate");
        btnDeleteTemplate = DocumentActions.GetElementById("btnDeleteTemplate");
        btnPrint = document.getElementById("btnPrint");
        btnPrintTrview = document.getElementById("btnPrintTrview");
        btnPrintTrPDF = document.getElementById("btnPrintTrPDF");
        btnPrintTrEXEL = document.getElementById("btnPrintTrEXEL");
        btnPrintTransaction = document.getElementById("btnPrintTransaction");
        //Radio buttons
        rdPosted = document.getElementById("rdPosted");
        rdNew = document.getElementById("rdNew");
        rdAuthorized = document.getElementById("rdAuthorized");
        //rdPosted = document.getElementById("rdPosted") as HTMLInputElement;
        rdSaveValue = document.getElementById("rdSaveValue");
        rdSaveDesc = document.getElementById("rdSaveDesc");
    }
    function InitalizeEvents() {
        btnCopyRemark.onclick = btnCopyRemark_onclick;
        btnShow.onclick = btnShow_onclick;
        btnAdd.onclick = btnAdd_onclick;
        btnSave.onclick = btnSave_onClick;
        btnBack.onclick = btnBack_onclick;
        btnUpdate.onclick = btnUpdate_onclick;
        btnAddDetails.onclick = AddNewRow;
        txtSearch.onkeyup = txtSearch_onKeyup;
        btnAuthorize.onclick = btnAuthorize_onclick;
        btnUnAuthorize.onclick = btnUnAuthorize_onclick;
        btnPost.onclick = btnPost_onclick;
        btnReverseVoucher.onclick = btnReverseVoucher_onclick;
        clickEventsVisible();
        btnCreateTemplate.onclick = btnCreateTemplate_onclick;
        btnUpdateTemplate.onclick = btnUpdateTemplate_onclick;
        btnLoadTemplate.onclick = btnLoadTemplate_onclick;
        btnDeleteTemplate.onclick = btnDeleteTemplate_onclick;
        btnPrintTrview.onclick = function () { PrintReport(1); };
        btnPrintTrPDF.onclick = function () { PrintReport(2); };
        btnPrintTrEXEL.onclick = function () { PrintReport(3); };
        btnPrint.onclick = function () { PrintReport(4); };
        btnPrintTransaction.onclick = btnPrintTransaction_onclick;
        btnSaveTemp.onclick = btnTempSave_onclick;
        btnBackTemp.onclick = btnBackTemp_onclick;
    }
    //------------------------------------------------------ Buttons Region -----------------------------------
    function btnCopyRemark_onclick() {
        debugger;
        for (var i = 0; i < CountGrid; i++) {
            if ($("#txt_StatusFlag" + i).val() != "d" && $("#txt_StatusFlag" + i).val() != "m") {
                $("#Notes" + i).val(txtJournalDescripton.value);
                if ($("#txt_StatusFlag" + i).val() == "") {
                    $("#txt_StatusFlag" + i).val("u");
                }
            }
        }
    }
    function btnUpdate_onclick() {
        if (!SysSession.CurrentPrivileges.EDIT)
            return;
        FlagAddOrEdit = 2;
        txtUpdatedAt.value = DateTimeFormat(Date().toString());
        txtUpdatedBy.value = SysSession.CurrentEnvironment.UserCode;
        rdPosted.disabled = true;
        rdNew.disabled = true;
        rdAuthorized.disabled = true;
        //rdPosted.disabled = true;
        DisableDiv();
        EnableControls();
        HideButtons();
        $('#DivTemplate').removeClass('showdiv');
        $('#spandiv_contentliest').removeClass('fa-caret-left');
        $('#spandiv_contentliest').addClass('fa-caret-down');
        $(".BtnHide").removeAttr("disabled");
        $("#btnSaveTemp").addClass("display_none");
        $("#btnBackTemp").addClass("display_none");
        $("#txtTempName").attr("disabled", "disabled");
        $("#rdPosted").attr("disabled", "disabled");
        $("._dis").attr("disabled", "disabled");
    }
    function btnAdd_onclick() {
        if (!SysSession.CurrentPrivileges.AddNew)
            return;
        CountGrid = 0;
        Clear();
        DisableDiv();
        HideButtons();
        EnableControls();
        AddNewRow();
        showFlag = false;
        TempshowFlag = false;
        FlagAddOrEdit = 1;
        rdNew.checked = true;
        txtCreatedAt.value = DateTimeFormat(Date().toString());
        txtCreatedBy.value = SysSession.CurrentEnvironment.UserCode;
        txtResource.value = (lang == "ar" ? "قيد يدوي" : "manual entry");
        $("#ddlJournalType").prop("value", "1");
        $("#btnAuthorize").attr("disabled", "disabled");
        $("#btnUnAuthorize").addClass("display_none");
        $("#btnPost").attr("disabled", "disabled");
        $("#rdPosted").attr("disabled", "disabled");
        $("#btnUpdate").attr("disabled", "disabled");
        $('#DivTemplate').removeClass('showdiv');
        $('#spandiv_contentliest').removeClass('fa-caret-left');
        $('#spandiv_contentliest').addClass('fa-caret-down');
        $(".BtnHide").removeAttr("disabled");
        $("#btnSaveTemp").addClass("display_none");
        $("#btnBackTemp").addClass("display_none");
        $("#txtTempName").attr("disabled", "disabled");
        $("._dis").attr("disabled", "disabled");
    }
    function btnShow_onclick() {
        $("#divGridShow").removeClass("display_none");
        $("#divTempHeader").removeClass("display_none");
        $("#divJournalDetail").addClass("display_none");
        Back();
        BindGridData();
    }
    function btnBack_onclick() {
        //if (TempFlagAddOrEdit == 1 || TempFlagAddOrEdit == 2) {
        //    $(".BtnHide").show();
        //    TempFlagAddOrEdit = 0;
        //    Clear();
        //    DisableControls();
        //    $("#divJournalDetail").addClass("display_none");
        //    //$("#divTemplateData").addClass("display_none");
        //}
        //else {
        ShowButons();
        if (FlagAddOrEdit == 2) {
            GridRowDoubleClick();
        }
        else {
            DisableControls();
            Clear();
            $("#divJournalDetail").addClass("display_none");
            Back();
        }
        //}
        $("#divFilter").removeClass("disabledDiv");
        $("#divGridShow").removeClass("disabledDiv");
        $('#DivTemplate').addClass('showdiv');
        $('#spandiv_contentliest').addClass('fa-caret-left');
        $('#spandiv_contentliest').removeClass('fa-caret-down');
        GlobalTemplateID = 0;
    }
    function btnSave_onClick() {
        //if (TempFlagAddOrEdit == 1 || TempFlagAddOrEdit == 2) {
        //    btnTempSave_onclick();
        //}
        //else {
        loading('btnsave');
        setTimeout(function () {
            finishSave('btnsave');
            if (!Validation_Header())
                return;
            for (var i = 0; i < CountGrid; i++) {
                if (!Validation_Grid(i))
                    return;
            }
            if (Number(txtDifference.value) != 0 && GL_JournalSaveUnbalanced == true) {
                WorningMessage("القيد غير متوازن هل تريد الحفظ ؟؟", "The constraint is unbalanced Do you want to save", "تحذير", "worning", function () {
                    Save();
                });
            }
            else {
                Save();
            }
            //}
        }, 100);
    }
    function btnAuthorize_onclick() {
        if (!SysSession.CurrentPrivileges.CUSTOM1)
            return;
        if (Number(txtDifference.value) != 0) {
            DisplayMassage('خطأ لا يمكن اعتماد قيد غير متوازن ', '(Error: Unbalanced constraint cannot be adopted)', MessageType.Error);
            AuthorizeFlag = false;
        }
        else {
            AuthorizeFlag = true;
            Assign();
            Update();
            txtAuthorizedBy.value = SysSession.CurrentEnvironment.UserCode;
            txtAuthorizedAt.value = DateTimeFormat(Date().toString());
            rdAuthorized.checked = true;
        }
    }
    function btnUnAuthorize_onclick() {
        if (!SysSession.CurrentPrivileges.CUSTOM3)
            return;
        Assign();
        Open();
    }
    function btnPost_onclick() {
        if (!SysSession.CurrentPrivileges.CUSTOM2)
            return;
        PostFlag = true;
        Assign();
        Update();
        BindGridData();
        txtPostedBy.value = SysSession.CurrentEnvironment.UserCode;
        txtPostedAt.value = DateTimeFormat(Date().toString());
        //rdPosted.checked = true;
    }
    function btnReverseVoucher_onclick() {
        if (!SysSession.CurrentPrivileges.AddNew)
            return;
        if (GlobalVoucherID != 0) {
            WorningMessageDailog("سيتم انشاء قيد جديد ...", "new Journal Voucher Will be created", "عكس سند قيد", "Reverse Voucher", function () {
                Ajax.Callsync({
                    type: "Get",
                    url: sys.apiUrl("GLTrVoucher", "ReverseVoucher"),
                    data: {
                        comp: compcode, Branch_Code: SysSession.CurrentEnvironment.BranchCode, sec_FinYear: SysSession.CurrentEnvironment.CurrentYear, MODULE_CODE: SysSession.CurrentEnvironment.ModuleCode, VoucherId: GlobalVoucherID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
                    },
                    success: function (d) {
                        var result = d;
                        if (result.IsSuccess) {
                            ReversedJournalMasterDetailModel = result.Response;
                            ReverseFlag = true;
                            GridRowDoubleClick();
                            ReverseFlag = false;
                            BindGridData();
                        }
                    }
                });
            });
        }
        else {
            DisplayMassage('لا يوجد قيد كي يتم عكسه برجاء اختيار قيد او انشاء جديد', '(There is no entry to be reversed. Please choose a new entry or create a new entry)', MessageType.Error);
            txtJournalDescripton.focus();
            return false;
        }
    }
    //------------------------------------------------------ Normal Grid Region -----------------------------------
    function InitializeGrid() {
        var res = GetResourceList("");
        Grid.OnRowDoubleClicked = GridRowDoubleClick;
        Grid.ElementName = "divGridDetails";
        Grid.PrimaryKey = "VoucherID";
        Grid.Paging = true;
        Grid.PageSize = 10;
        Grid.Sorting = true;
        Grid.InsertionMode = JsGridInsertionMode.Binding;
        Grid.Editing = false;
        Grid.Inserting = false;
        Grid.SelectedIndex = 1;
        Grid.OnItemEditing = function () { };
        Grid.Columns = [
            { title: "رقم القيد", name: "VoucherID", type: "text", width: "0px", visible: false },
            { title: res.App_Registration_Number, name: "VOUCHER_CODE", type: "number", width: "50px" },
            {
                title: res.App_date, css: "ColumPadding", name: "VOUCHER_DATE", width: "100px",
                itemTemplate: function (s, item) {
                    var txt = document.createElement("label");
                    txt.innerHTML = DateFormat(item.VOUCHER_DATE);
                    return txt;
                }
            },
            { title: res.App_desc, name: "VOUCHER_DESC", type: "text", width: "200px" },
            { title: res.source, name: (lang == "ar" ? "Src_DescA" : "Src_DescB"), type: "text", width: "100px" },
            { title: res.App_Type, name: (lang == "ar" ? "TYPE_DESCA" : "TYPE_DESCE"), type: "text", width: "100px" },
            { title: "اجمالي القيد", name: "TotalDebit", type: "number", width: "100px" },
            { title: res.App_State, name: (lang == "ar" ? "St_DescA" : "St_DescE"), type: "text", width: "100px" },
        ];
    }
    function BindGridData() {
        AQJournalHeaderWithDetails = new Array();
        $("#divGridShow").removeClass("display_none");
        var FromDate = DateFormatRep(txtFromDate.value).toString();
        var toDate = DateFormatRep(txtToDate.value).toString();
        var source = 0;
        var status = 0;
        var type = 0;
        status = Number(ddlStatusFilter.value.toString());
        if (ddlVoucherSourceFilter.value != "null") {
            source = Number(ddlVoucherSourceFilter.value.toString());
        }
        if (ddlVoucherTypeFilter.value != "null") {
            type = Number(ddlVoucherTypeFilter.value.toString());
        }
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GLTrVoucher", "GetAllAQ_GetJournalHeader"),
            data: { CompCode: compcode, FromDate: FromDate, toDate: toDate, source: source, status: status, type: type, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) { //AQ_GetJournalDetail
                    AQJournalHeaderWithDetails = result.Response;
                    //for (let i = 0; i < AQJournalHeaderWithDetails.length; i++) {
                    //    AQJournalHeaderWithDetails[i].VOUCHER_DATE = DateFormat(AQJournalHeaderWithDetails[i].VOUCHER_DATE.toString());
                    //}
                    Grid.DataSource = AQJournalHeaderWithDetails;
                    Grid.Bind();
                }
            }
        });
    }
    function GridRowDoubleClick() {
        showFlag = true;
        TempshowFlag = false;
        AuthorizeFlag = false;
        PostFlag = false;
        rdPosted.checked = false;
        Clear();
        $("#divJournalDetail").removeClass("display_none");
        if (ReverseFlag == true) {
            SelectedJournalModel = ReversedJournalMasterDetailModel.AQ_GetJournalHeader;
        }
        else {
            SelectedJournalModel = AQJournalHeaderWithDetails.filter(function (x) { return x.VoucherID == Number(Grid.SelectedKey); });
            if (AfterInsertOrUpdateFlag == true) {
                SelectedJournalModel = AQJournalHeaderWithDetails.filter(function (x) { return x.VoucherID == GlobalVoucherID; });
            }
        }
        if (SelectedJournalModel.length > 0) {
            GlobalVoucherID = Number(SelectedJournalModel[0].VoucherID);
            txtJouranlNumber.value = SelectedJournalModel[0].VOUCHER_CODE.toString();
            txtJournalDescripton.value = SelectedJournalModel[0].VOUCHER_DESC;
            txtJouranlDate.value = DateFormat(SelectedJournalModel[0].VOUCHER_DATE);
            if (SelectedJournalModel[0].REF_CODE != null)
                txtRefNumber.value = SelectedJournalModel[0].REF_CODE.toString();
            txtResource.value = txtResource.value = (lang == "ar" ? SelectedJournalModel[0].Src_DescA.toString() : SelectedJournalModel[0].Src_DescE.toString());
            if (SelectedJournalModel[0].TYPE_CODE != null)
                ddlJournalType.value = SelectedJournalModel[0].TYPE_CODE.toString();
            // creation
            txtCreatedBy.value = SelectedJournalModel[0].CREATED_BY;
            txtCreatedAt.value = SelectedJournalModel[0].CREATED_AT;
            // Edit
            if (SelectedJournalModel[0].UPDATED_BY != null) {
                txtUpdatedBy.value = SelectedJournalModel[0].UPDATED_BY;
                txtUpdatedAt.value = SelectedJournalModel[0].UPDATED_AT;
            }
        }
        JournalDetailModelFiltered = new Array();
        if (ReverseFlag == true) {
            JournalDetailModelFiltered = ReversedJournalMasterDetailModel.AQ_GetJournalDetail;
        }
        else {
            Ajax.Callsync({
                type: "Get",
                url: sys.apiUrl("GLTrVoucher", "GetAllJournalDetail"),
                data: { VoucherID: GlobalVoucherID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
                success: function (d) {
                    var result = d;
                    if (result.IsSuccess) {
                        JournalDetailModelFiltered = result.Response;
                    }
                }
            });
        }
        JournalDetailModelFiltered = JournalDetailModelFiltered.filter(function (x) { return x.VOUCHER_SERIAL != null; }).sort(function (a, b) { return a.VOUCHER_SERIAL - b.VOUCHER_SERIAL; });
        debugger;
        $('#Loading_Div').html('<i class="fa fa-spinner fa-spin lod  Loading"  ></i>');
        document.body.scrollTop = 800;
        document.documentElement.scrollTop = 800;
        setTimeout(function () {
            debugger;
            var fragment = document.createDocumentFragment();
            for (var i = 0; i < JournalDetailModelFiltered.length; ++i) {
                fragment.appendChild(BuildControlsGrid(i)); // Append to the DocumentFragment
            }
            document.getElementById("div_Data").appendChild(fragment); // Append the DocumentFragment to the div
            // costCenter Type 
            if (VoucherCCType == 0) {
                $(".ccType").hide();
            }
            // costCenterCCDT Type
            if (VoucherCCDtType == 1) {
                $(".ccTypeBranch").show();
            }
            else {
                $(".ccTypeBranch").hide();
            }
            var show2 = $(".costcntr").is(":visible");
            //var show2 = $(".Acc").is(":visible");
            if (show2 == false) {
                $(".costcntr").addClass("display_none");
            }
            else {
                $(".costcntr").removeClass("display_none");
            }
            var show1 = $(".Acc").is(":visible");
            //var show2 = $(".Acc").is(":visible");
            if (show1 == false) {
                $(".Acc").addClass("display_none");
            }
            else {
                $(".Acc").removeClass("display_none");
            }
            var show3 = $(".costcntrCCDt").is(":visible");
            //var show2 = $(".Acc").is(":visible");
            if (show3 == false) {
                $(".costcntrCCDt").addClass("display_none");
            }
            else {
                $(".costcntrCCDt").removeClass("display_none");
            }
            CountGrid = JournalDetailModelFiltered.length;
            ComputeTotals();
            DisableControls();
            $('#Loading_Div').html('');
        }, 1);
        // جديد
        if (SelectedJournalModel[0].VOUCHER_STATUS == 0) {
            rdNew.checked = true;
            $("#btnUnAuthorize").addClass("display_none");
            $("#btnPost").addClass("display_none");
            $("#btnAuthorize").removeClass("display_none");
            $("#btnPost").attr("disabled", "disabled");
            $("#btnUpdate").removeAttr("disabled");
            btnUpdate.disabled = !SysSession.CurrentPrivileges.EDIT;
            btnAuthorize.disabled = !SysSession.CurrentPrivileges.CUSTOM1;
            txtAuthorizedBy.value = "";
            txtAuthorizedAt.value = "";
            txtPostedBy.value = "";
            txtPostedAt.value = "";
        }
        // معتمد
        if (SelectedJournalModel[0].VOUCHER_STATUS == 1) {
            rdAuthorized.checked = true;
            txtAuthorizedBy.value = SelectedJournalModel[0].AUTHORISED_BY;
            txtAuthorizedAt.value = SelectedJournalModel[0].AUTHORISED_AT;
            $("#btnUnAuthorize").removeClass("display_none");
            $("#btnPost").removeClass("display_none");
            btnUnAuthorize.disabled = !SysSession.CurrentPrivileges.CUSTOM3;
            $("#btnAuthorize").addClass("display_none");
            btnPost.disabled = !SysSession.CurrentPrivileges.CUSTOM2;
            $("#btnUpdate").attr("disabled", "disabled");
            txtPostedBy.value = "";
            txtPostedAt.value = "";
        }
        // مرحل
        if (SelectedJournalModel[0].VOUCHER_STATUS == 2) {
            rdPosted.checked = true;
            txtPostedBy.value = SelectedJournalModel[0].POSTED_BY;
            txtPostedAt.value = SelectedJournalModel[0].POSTED_AT;
            txtAuthorizedBy.value = SelectedJournalModel[0].AUTHORISED_BY;
            txtAuthorizedAt.value = SelectedJournalModel[0].AUTHORISED_AT;
            $("#btnAuthorize").attr("disabled", "disabled");
            $("#btnUnAuthorize").addClass("display_none");
            $("#btnAuthorize").addClass("display_none");
            $("#btnPost").addClass("display_none");
            $("#btnPost").attr("disabled", "disabled");
            $("#btnUpdate").attr("disabled", "disabled");
        }
    }
    //------------------------------------------------------ Validation Region -----------------------------------
    function Validation_Header() {
        var newCount = 0;
        for (var i = 0; i < CountGrid; i++) {
            if ($("#txt_StatusFlag" + i).val() != "d" && $("#txt_StatusFlag" + i).val() != "m") {
                newCount++;
            }
        }
        if (!CheckDate(DateFormat(txtJouranlDate.value).toString(), DateFormat(SysSession.CurrentEnvironment.StartDate).toString(), DateFormat(SysSession.CurrentEnvironment.EndDate).toString())) {
            WorningMessage(' لا توجد صلاخيه للاضافة في هذا التاريخ (' + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ')', 'There is no salakhiyah to add on this date(' + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ')', "تحذير", "worning");
            txtJournalDescripton.focus();
            return false;
        }
        else if (txtJournalDescripton.value == "") {
            DisplayMassage('برجاء ادخال الوصف', '(must enter describtion)', MessageType.Error);
            Errorinput(txtJournalDescripton);
            return false;
        }
        else if (ddlJournalType.value == "null") {
            DisplayMassage('برجاء اختيار النوع', '(must choose type)', MessageType.Error);
            Errorinput(ddlJournalType);
            return false;
        }
        else if (Number(txtDifference.value) != 0 && GL_JournalSaveUnbalanced == false) {
            DisplayMassage('خطأ لا يمكن حفظ قيد غير متوازن', '(Error Unbalanced constraint cannot be saved)', MessageType.Error);
            Errorinput(txtDifference);
            return false;
        }
        else if (newCount == 0) {
            DisplayMassage('يجب ادخال تفاصيل سند القيد', '(Error)', MessageType.Error);
            return false;
        }
        else if (!CheckPeriodDate(txtJouranlDate.value, "A")) {
            debugger;
            DisplayMassage("لا يمكنك الاضافه او التعديل في هذة الفتره المغلقه ", "Please select a Invoice data", MessageType.Error);
            Errorinput(txtJouranlDate);
            return false;
        }
        return true;
    }
    function Validation_Grid(rowcount) {
        var AccNum = $("#txtAccNumber" + rowcount).val();
        var AccObject = AccountDetailsIst.filter(function (s) { return s.COMP_CODE == compcode && s.ACC_CODE == AccNum; });
        var Debit = Number($("#txtDebit" + rowcount).val());
        var credit = Number($("#txtCredit" + rowcount).val());
        if ($("#txt_StatusFlag" + rowcount).val() == "d" || $("#txt_StatusFlag" + rowcount).val() == "") {
            return true;
        }
        else {
            if ($("#txtAccNumber" + rowcount).val() == "") {
                DisplayMassage('برجاء ادخال رقم الحساب', '(Please enter account number)', MessageType.Error);
                Errorinput($("#txtAccNumber" + rowcount));
                return false;
            }
            else if (Debit == 0 && credit == 0 && GlobalTemplateID == 0) {
                DisplayMassage('برجاء ادخال مبلغ المدين او الدائن', '(Please enter the debit or credit amount)', MessageType.Error);
                Errorinput($("#txtDebit" + rowcount));
                return false;
            }
            else if ($("#txtCostCntrNum" + rowcount).val() == "" && (AccObject[0].ACC_GROUP == 4 || AccObject[0].ACC_GROUP == 5) && VoucherCCType == 1) {
                DisplayMassage('برجاء ادخال  مركز التكلفه', '(Please enter the cost center)', MessageType.Error);
                Errorinput($("#txtCostCntrNum" + rowcount));
                return false;
            }
            else if ($("#txtCostCntrNum" + rowcount).val() == "" && VoucherCCType == 2) {
                DisplayMassage('برجاء ادخال  مركز التكلفه', '(Please enter the cost center)', MessageType.Error);
                Errorinput($("#txtCostCntrNum" + rowcount));
                return false;
            }
            else if (AccObject.length > 0) {
                if ($("#txtCCDtCostCntrNum" + rowcount).val() == "" && VoucherCCDtType == 1 && (AccObject[0].CCDT_TYPE != null && AccObject[0].CCDT_TYPE != "")) {
                    DisplayMassage('برجاء ادخال  مركز التكلفه الفرعي', '(Please enter the CCDT cost center)', MessageType.Error);
                    Errorinput($("#txtCCDtCostCntrNum" + rowcount));
                    return false;
                }
            }
            return true;
        }
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
    function Clear() {
        $("#div_Data").html("");
        $(".Acc").show();
        $(".costcntr").show();
        txtJouranlNumber.value = '';
        txtJournalDescripton.value = '';
        txtRefNumber.value = '';
        txtResource.value = '';
        ddlJournalType.value = 'null';
        txtJouranlDate.value = GetDate();
        rdNew.checked = false;
        rdAuthorized.checked = false;
        rdPosted.checked = false;
        txtTotalDebit.value = "";
        txtTotalCredit.value = "";
        txtDifference.value = "";
        txtAuthorizedBy.value = "";
        txtAuthorizedAt.value = "";
        txtPostedBy.value = "";
        txtPostedAt.value = "";
        txtUpdatedBy.value = "";
        txtUpdatedAt.value = "";
        txtCreatedBy.value = "";
        txtCreatedAt.value = "";
        txtCostCntrNameFooter.value = "";
        txtAccountNameFooter.value = "";
        txtTempNumber.value = "";
        txtTempName.value = "";
        rdSaveDesc.checked = false;
        rdSaveValue.checked = false;
        GlobalTemplateID = 0;
    }
    function txtSearch_onKeyup() {
        //BindGridData();
        if (txtSearch.value != "") {
            var search_1 = txtSearch.value.toLowerCase();
            SearchDetails = AQJournalHeaderWithDetails.filter(function (x) { return x.VOUCHER_CODE.toString().toLowerCase().search(search_1) >= 0 || x.VOUCHER_DESC.toLowerCase().search(search_1) >= 0 || x.SOURCE_TYPE.toLowerCase().search(search_1) >= 0
                || x.TYPE_DESCA.toLowerCase().search(search_1) >= 0 || x.TYPE_DESCE.toLowerCase().search(search_1) >= 0
                || x.Src_DescA.toLowerCase().search(search_1) >= 0 || x.Src_DescE.toLowerCase().search(search_1) >= 0
                || x.VOUCHER_DESC.toLowerCase().search(search_1) >= 0 || x.St_DescA.toLowerCase().search(search_1) >= 0 || x.St_DescE.toLowerCase().search(search_1) >= 0; });
            Grid.DataSource = SearchDetails;
            Grid.Bind();
        }
        else {
            Grid.DataSource = AQJournalHeaderWithDetails;
            Grid.Bind();
        }
    }
    function EnableControls() {
        $("#div_BasicData :input").removeAttr("disabled");
        $("#btnAddDetails").removeClass("display_none");
        for (var i = 0; i < CountGrid; i++) {
            $("#btnSearchAcc" + i).removeAttr("disabled");
            $("#txtCostCntrName" + i).removeAttr("disabled");
            $("#btn_minus" + i).removeClass("display_none");
            $("#btn_Insert" + i).removeClass("display_none");
            $("#btn_Copy" + i).removeClass("display_none");
            $("#txtSerial" + i).attr("disabled", "disabled");
            $("#txtAccName" + i).attr("disabled", "disabled");
            $("#txtCostCntrName" + i).attr("disabled", "disabled");
            if (VoucherCCType == 0) {
                $("#txtCostCntrNum" + i).attr("disabled", "disabled");
                $("#btnSearchCostCenter" + i).attr("disabled", "disabled");
                $("#txtCostCntrName" + i).attr("disabled", "disabled");
            }
            if (VoucherCCDtType == 1) {
                $("#txtCCDtCostCntrNum" + i).removeAttr("disabled");
                $("#btnSearchCCdtTypes" + i).removeAttr("disabled");
                $("#txtCCDTCostCntrName" + i).attr("disabled", "disabled");
            }
            ChackCCDT_TYPE(i);
        }
        rdNew.disabled = true;
        rdAuthorized.disabled = true;
        //rdPosted.disabled = true;
        txtResource.disabled = true;
        txtJouranlNumber.disabled = true;
        txtTotalCredit.disabled = true;
        txtTotalDebit.disabled = true;
        txtDifference.disabled = true;
        //txtJouranlDate.disabled = true;
        txtCostCntrNameFooter.disabled = true;
        txtAccountNameFooter.disabled = true;
        $("._dis_non").removeClass("display_none");
    }
    function DisableControls() {
        $("#div_BasicData :input").attr("disabled", "disabled");
        $("#ButtonsDiv :input").removeAttr("disabled");
        $("#btnAddDetails").addClass("display_none");
        $("#btnBack").addClass("display_none");
        $("#btnSave").addClass("display_none");
        $("._dis_non").addClass("display_none");
        $("._dise").attr("disabled", "disabled");
        //for (let i = 0; i < CountGrid; i++) {
        //    $("#btnSearchAcc" + i).attr("disabled", "disabled");
        //    $("#txtCostCntrName" + i).attr("disabled", "disabled");
        //    $("#btn_minus" + i).addClass("display_none");
        //    $("#btn_Insert" + i).addClass("display_none");
        //    $("#btn_Copy" + i).addClass("display_none");
        //    $("#txtCCDtCostCntrNum" + i).attr("disabled", "disabled");
        //    $("#btnSearchCCdtTypes" + i).attr("disabled", "disabled");
        //    $("#txtCCDTCostCntrName" + i).attr("disabled", "disabled");
        //}
        txtResource.disabled = true;
        txtJouranlNumber.disabled = true;
        //txtJouranlDate.disabled = true;
        txtTotalCredit.disabled = true;
        txtTotalDebit.disabled = true;
        txtDifference.disabled = true;
    }
    function HideButtons() {
        $("#btnReverseVoucher").addClass("display_none");
        $("#btnPrintTransaction").addClass("display_none");
        $("#btnUpdate").addClass("display_none");
        $("#btnAuthorize").addClass("display_none");
        $("#btnUnAuthorize").addClass("display_none");
        $("#btnPost").addClass("display_none");
        $("#btnSave").removeClass("display_none");
        $("#btnBack").removeClass("display_none");
    }
    function ShowButons() {
        $("#btnPrintTransaction").removeClass("display_none");
        $("#btnReverseVoucher").removeClass("display_none");
        $("#btnUpdate").removeClass("display_none");
        $("#btnAuthorize").removeClass("display_none");
        $("#btnUnAuthorize").addClass("display_none");
        $("#btnPost").removeClass("display_none");
        $("#btnSave").addClass("display_none");
        $("#btnBack").addClass("display_none");
    }
    function DisableDiv() {
        $("#divFilter").addClass("disabledDiv");
        $("#divGridShow").addClass("disabledDiv");
        $("#divJournalDetail").removeClass("disabledDiv");
        $("#divJournalDetail").removeClass("display_none");
        $("#divTempHeader").removeClass("display_none");
    }
    //------------------------------------------------------ Controls Grid Region -----------------------------------
    function AddNewRow() {
        if (!SysSession.CurrentPrivileges.AddNew)
            return;
        showFlag = false;
        TempshowFlag = false;
        //var CanAdd: boolean = true;
        //if (CountGrid > 0) {    
        //    for (var i = 0; i < CountGrid; i++) {
        //        CanAdd = Validation_Grid(i);
        //        if (CanAdd == false) {
        //            break;
        //        }
        //    }
        //}
        //if (CanAdd) {
        $(".Acc").show();
        $(".costcntr").show();
        $("#div_Data").append(BuildControlsGrid(CountGrid));
        // costCenter Type 
        if (VoucherCCType == 0) {
            $(".ccType").hide();
        }
        // costCenterCCDT Type
        if (VoucherCCDtType == 1) {
            $(".ccTypeBranch").show();
        }
        else {
            $(".ccTypeBranch").hide();
        }
        var show2 = $(".costcntr").is(":visible");
        //var show2 = $(".Acc").is(":visible");
        if (show2 == false) {
            $(".costcntr").addClass("display_none");
        }
        else {
            $(".costcntr").removeClass("display_none");
        }
        var show1 = $(".Acc").is(":visible");
        //var show2 = $(".Acc").is(":visible");
        if (show1 == false) {
            $(".Acc").addClass("display_none");
        }
        else {
            $(".Acc").removeClass("display_none");
        }
        var show3 = $(".costcntrCCDt").is(":visible");
        //var show2 = $(".Acc").is(":visible");
        if (show3 == false) {
            $(".costcntrCCDt").addClass("display_none");
        }
        else {
            $(".costcntrCCDt").removeClass("display_none");
        }
        //BuildControls(CountGrid);
        $("#txt_StatusFlag" + CountGrid).val("i"); //In Insert mode
        $("#txtSerial" + CountGrid).attr("disabled", "disabled");
        $("#btnSearchAcc" + CountGrid).removeAttr("disabled");
        $("#txtAccNumber" + CountGrid).removeAttr("disabled");
        $("#txtAccName" + CountGrid).attr("disabled", "disabled");
        $("#txtDebit" + CountGrid).removeAttr("disabled");
        $("#txtCredit" + CountGrid).removeAttr("disabled");
        $("#txtCostCntrNum" + CountGrid).removeAttr("disabled");
        $("#btnSearchCostCenter" + CountGrid).removeAttr("disabled");
        $("#txtCostCntrName" + CountGrid).attr("disabled", "disabled");
        $("#txtCCDtCostCntrNum" + CountGrid).removeAttr("disabled");
        $("#btnSearchCCdtTypes" + CountGrid).removeAttr("disabled");
        $("#txtCCDTCostCntrName" + CountGrid).attr("disabled", "disabled");
        $("#Notes" + CountGrid).removeAttr("disabled");
        //var counter = 0;
        //for (let i = 0; i <= CountGrid; i++) {
        //    var flagvalue = $("#txt_StatusFlag" + i).val();
        //    if (flagvalue != "d" && flagvalue != "") {
        //        if ($("#txt_StatusFlag" + i).val() != "i")
        //            $("#txt_StatusFlag" + i).val("u");
        //        $("#txtSerial" + i).prop("value", counter + 1);
        //        counter = counter + 1;
        //    }
        //}
        Insert_Serial();
        // can delete new inserted record  without need for delete privilage
        $("#btn_minus" + CountGrid).removeClass("display_none");
        $("#btn_minus" + CountGrid).removeAttr("disabled");
        $("#btn_Insert" + CountGrid).removeClass("display_none");
        $("#btn_Copy" + CountGrid).removeClass("display_none");
        CountGrid++;
        //}
    }
    function Insert_Serial() {
        var Chack_Flag = false;
        var flagval = "";
        var Ser = 1;
        for (var i = 0; i < CountGrid; i++) {
            flagval = $("#txt_StatusFlag" + i).val();
            if (flagval != "d" && flagval != "m") {
                $("#txtSerial" + i).val(Ser);
                Ser++;
            }
            if (flagval == 'd' || flagval == 'm' || flagval == 'i') {
                Chack_Flag = true;
            }
            if (Chack_Flag) {
                if ($("#txt_StatusFlag" + i).val() != 'i' && $("#txt_StatusFlag" + i).val() != 'm' && $("#txt_StatusFlag" + i).val() != 'd') {
                    $("#txt_StatusFlag" + i).val('u');
                }
            }
        }
    }
    function BuildControlsGrid(cnt) {
        var tr = document.createElement("tr");
        tr.id = 'No_Row' + cnt + '';
        tr.setAttribute('class', 'container-fluid style_border');
        var txtSerial = CountGrid + 1;
        var VoucherDetailID = "";
        var txtAccNumber = "";
        var txtAccName = "";
        var txtDebit = "";
        var txtCredit = "";
        var txtCostCntrNum = "";
        var txtCostCntrName = "";
        var txtCCDtCostCntrNum = "";
        var txtCCDTCostCntrName = "";
        var Notes = "";
        var INVOICE_NO = "";
        var BOOK_TR_NO = "";
        var SRC_SYSTEM_CODE = "";
        var SRC_SUB_SYSTEM_CODE = "";
        var SRC_BRA_CODE = "";
        var SRC_TR_CODE = "";
        var SRC_TR_NO = "";
        var SRC_TR_TYPE = "";
        var txt_StatusFlag = "";
        var ChackCCDT_dis = "";
        if (showFlag == true) {
            txtSerial = (JournalDetailModelFiltered[cnt].VOUCHER_SERIAL);
            VoucherDetailID = setVal(JournalDetailModelFiltered[cnt].VoucherDetailID).toString();
            txtAccNumber = (JournalDetailModelFiltered[cnt].ACC_CODE);
            txtAccName = (lang == "ar" ? JournalDetailModelFiltered[cnt].ACC_DESCA : JournalDetailModelFiltered[cnt].ACC_DESCL);
            if (JournalDetailModelFiltered[cnt].DEBIT != null)
                txtDebit = setVal(JournalDetailModelFiltered[cnt].DEBIT.toString());
            if (JournalDetailModelFiltered[cnt].CREDIT != null)
                txtCredit = setVal(JournalDetailModelFiltered[cnt].CREDIT.toString());
            txtCostCntrNum = (JournalDetailModelFiltered[cnt].CC_CODE);
            txtCostCntrName = (lang == "ar" ? JournalDetailModelFiltered[cnt].CC_DESCA : JournalDetailModelFiltered[cnt].CC_DESCE);
            txtCCDtCostCntrNum = (JournalDetailModelFiltered[cnt].CCDT_CODE);
            txtCCDTCostCntrName = (lang == "ar" ? JournalDetailModelFiltered[cnt].CCDT_DESCA : JournalDetailModelFiltered[cnt].CCDT_DESCE);
            txtCostCntrName = txtCostCntrName == null ? '' : txtCostCntrName;
            txtCostCntrNum = txtCostCntrNum == null ? '' : txtCostCntrNum;
            txtCCDtCostCntrNum = txtCCDtCostCntrNum == null ? '' : txtCCDtCostCntrNum;
            txtCCDTCostCntrName = txtCCDTCostCntrName == null ? '' : txtCCDTCostCntrName;
            Notes = (lang == "ar" ? JournalDetailModelFiltered[cnt].DESCA : JournalDetailModelFiltered[cnt].DESCL);
            var StatusFl = JournalDetailModelFiltered[cnt].StatusFlag == null ? 'u' : JournalDetailModelFiltered[cnt].StatusFlag;
            INVOICE_NO = setVal(JournalDetailModelFiltered[cnt].INVOICE_NO).toString();
            BOOK_TR_NO = setVal(JournalDetailModelFiltered[cnt].BOOK_TR_NO).toString();
            SRC_SYSTEM_CODE = (JournalDetailModelFiltered[cnt].SRC_SYSTEM_CODE);
            SRC_SUB_SYSTEM_CODE = (JournalDetailModelFiltered[cnt].SRC_SUB_SYSTEM_CODE);
            SRC_BRA_CODE = setVal(JournalDetailModelFiltered[cnt].SRC_BRA_CODE).toString();
            SRC_TR_CODE = (JournalDetailModelFiltered[cnt].SRC_TR_CODE);
            SRC_TR_NO = setVal(JournalDetailModelFiltered[cnt].SRC_TR_NO).toString();
            SRC_TR_TYPE = (JournalDetailModelFiltered[cnt].SRC_TR_TYPE);
            txt_StatusFlag = (StatusFl);
        }
        if (TempshowFlag == true) {
            txtSerial = (TemplateDetailModelFiltered[cnt].VOUCHER_SERIAL);
            VoucherDetailID = setVal(TemplateDetailModelFiltered[cnt].VoucherDetailID).toString();
            txtAccNumber = (TemplateDetailModelFiltered[cnt].ACC_CODE);
            var AccObj = AccountDetailsIst.filter(function (s) { return s.ACC_CODE == TemplateDetailModelFiltered[cnt].ACC_CODE && s.COMP_CODE == compcode; });
            txtAccName = (lang == "ar" ? AccObj[0].ACC_DESCA : AccObj[0].ACC_DESCL);
            if (TemplateDetailModelFiltered[cnt].DEBIT != null)
                txtDebit = setVal(TemplateDetailModelFiltered[cnt].DEBIT.toString());
            if (TemplateDetailModelFiltered[cnt].CREDIT != null)
                txtCredit = setVal(TemplateDetailModelFiltered[cnt].CREDIT.toString());
            txtCostCntrNum = (TemplateDetailModelFiltered[cnt].CC_CODE);
            var CCobj = CostCentreDetailsIst.filter(function (s) { return s.CC_CODE == TemplateDetailModelFiltered[cnt].CC_CODE && s.COMP_CODE == compcode; });
            if (CCobj.length > 0) {
                txtCostCntrName = (lang == "ar" ? CCobj[0].CC_DESCA : CCobj[0].CC_DESCE);
            }
            else {
                txtCostCntrName = ("");
            }
            txtCCDtCostCntrNum = (TemplateDetailModelFiltered[cnt].CCDT_CODE);
            var CCDtobj = CostCentreDetailsCCDTIst.filter(function (s) { return s.CCDT_CODE == TemplateDetailModelFiltered[cnt].CCDT_CODE && s.COMP_CODE == compcode; });
            if (CCDtobj.length > 0) {
                txtCCDTCostCntrName = (lang == "ar" ? CCDtobj[0].CCDT_DESCA : CCDtobj[0].CCDT_DESCE);
            }
            else {
                txtCCDTCostCntrName = ("");
            }
            txtCostCntrName = txtCostCntrName == null ? '' : txtCostCntrName;
            txtCostCntrNum = txtCostCntrNum == null ? '' : txtCostCntrNum;
            txtCCDtCostCntrNum = txtCCDtCostCntrNum == null ? '' : txtCCDtCostCntrNum;
            txtCCDTCostCntrName = txtCCDTCostCntrName == null ? '' : txtCCDTCostCntrName;
            Notes = (lang == "ar" ? TemplateDetailModelFiltered[cnt].DESCA : TemplateDetailModelFiltered[cnt].DESCL);
            txt_StatusFlag = ("u");
            ChackCCDT_dis = Chack_disabled(cnt, TemplateDetailModelFiltered[cnt].ACC_CODE.toString());
        }
        var html = " \n                    <input id=\"VoucherDetailID" + cnt + "\" type=\"hidden\" value=\"" + VoucherDetailID + "\" class=\"form-control display_none\"  />\n                    <input id=\"txtSerial" + cnt + "\" name=\"FromDate\" disabled type=\"hidden\" value=\"" + txtSerial + "\" class=\"form-control\" />\n\t                <td>\n\t\t                <div class=\"form-group _dis_non\">\n\t\t\t                <span id=\"btn_minus" + cnt + "\"><i class=\"fas fa-minus-circle  btn-minus\"></i></span>\n\t\t\t                <span id=\"btn_Copy" + cnt + "\"><i class=\"fas fa-clone  btn-copy\"></i></span>\n                            <span id=\"btn_Insert" + cnt + "\"><i class=\"fas fa-share fa-rotate-180 btn-insert\"></i></span>\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n\t\t\t                <button type=\"button\" class=\"style_ButSearch\"  id=\"btnSearchAcc" + cnt + "\" name=\"ColSearch\" disabled>\n                                <i class=\"fa fa-search\"></i>\n                             </button>\n\t\t                </div>\n\t                </td>\n                     <td style=\"width:9%;\">\n\t\t                <div class=\"form-group\">\n\t\t\t                 <input id=\"txtAccNumber" + cnt + "\" value=\"" + txtAccNumber + "\" name=\"\" disabled type=\"text\" class=\"form-control\" />\n\t\t                </div>\n\t                </td>\n                    <td style=\"width:17%;\" class=\"Acc\">\n\t\t                <div class=\"form-group\">\n\t\t\t                  <input id=\"txtAccName" + cnt + "\" value=\"" + txtAccName + "\" name=\"\" disabled type=\"text\" class=\"form-control\"  />\n\t\t                </div>\n\t                </td>\n                    <td style=\"width:9%;\">\n\t\t                <div class=\"form-group\">\n\t\t\t               <input id=\"txtDebit" + cnt + "\" name=\"FromDate\" disabled type=\"number\" value=\"" + txtDebit + "\"  min=\"0\" class=\"form-control\" />\n\t\t                </div>\n\t                </td>\n                    <td style=\"width:9%;\">\n\t\t                <div class=\"form-group\">\n\t\t\t               <input id=\"txtCredit" + cnt + "\" name=\"FromDate\" disabled type=\"number\" value=\"" + txtCredit + "\"  min=\"0\" class=\"form-control\" />\n\t\t                </div>\n\t                </td>\n\n                    <td>\n\t\t                <div class=\"form-group\">\n\t\t\t                <button type=\"button\" class=\"style_ButSearch\"  id=\"btnSearchCostCenter" + cnt + "\" name=\"ColSearch\" disabled>\n                                <i class=\"fa fa-search\"></i>\n                             </button>\n\t\t                </div>\n\t                </td>\n                     <td style=\"width:9%;\">\n\t\t                <div class=\"form-group\">\n\t\t\t                <input id=\"txtCostCntrNum" + cnt + "\" name=\"FromDate\" value=\"" + txtCostCntrNum + "\" disabled type=\"text\" class=\"form-control\" />\n\t\t                </div>\n\t                </td>\n                    <td style=\"width:17%;\" class=\"costcntr\">\n\t\t                <div class=\"form-group\">\n\t\t\t                  <input id=\"txtCostCntrName" + cnt + "\" name=\"FromDate\" value=\"" + txtCostCntrName + "\" disabled type=\"text\" class=\"form-control\" />\n\t\t                </div>\n\t                </td>\n\n                    <td class=\"display_none\">\n\t\t                <div class=\"form-group\">\n\t\t\t                <button type=\"button\" class=\"style_ButSearch\"   id=\"btnSearchCCdtTypes" + cnt + "\" " + ChackCCDT_dis + " name=\"ColSearch\" disabled>\n                                <i class=\"fa fa-search\"></i>\n                             </button>\n\t\t                </div>\n\t                </td>\n                     <td class=\"display_none\">\n\t\t                <div class=\"form-group\">\n\t\t\t               <input id=\"txtCCDtCostCntrNum" + cnt + "\" value=\"" + txtCCDtCostCntrNum + "\" name=\"FromDate\" disabled " + ChackCCDT_dis + " type=\"text\" class=\"form-control\" />\n\t\t                </div>\n\t                </td>\n                    <td class=\"display_none costcntrCCDt\">\n\t\t                <div class=\"form-group\">\n\t\t\t                  <input id=\"txtCCDTCostCntrName" + cnt + "\" value=\"" + txtCCDTCostCntrName + "\" name=\"FromDate\" disabled type=\"text\" class=\"form-control\" />\n\t\t                </div>\n\t                </td>\n\n\n                    <td style=\"width:22%;\">\n\t\t                <div class=\"form-group\">\n\t\t\t              <input id=\"Notes" + cnt + "\" name=\"FromDate\" value=\"" + Notes + "\" disabled type=\"text\" class=\"form-control\" />\n\t\t                </div>\n\t                </td>\n                    \n                  \n                    <input id=\"txt_StatusFlag" + cnt + "\" name = \" \" value=\"" + txt_StatusFlag + "\" type = \"hidden\" class=\"form-control\"/>\n                    <input id=\"FlagUpdate" + cnt + "\" name = \" \" value=\"\" type = \"hidden\" class=\"form-control\"/>\n\n                    <input id=\"INVOICE_NO" + cnt + "\" name = \" \" value=\"" + INVOICE_NO + "\" type = \"hidden\" class=\"form-control\"/>\n                    <input id=\"BOOK_TR_NO" + cnt + "\" name = \" \" value=\"" + BOOK_TR_NO + "\" type = \"hidden\" class=\"form-control\"/>\n                    <input id=\"SRC_SYSTEM_CODE" + cnt + "\" name = \" \" value=\"" + SRC_SYSTEM_CODE + "\" type = \"hidden\" class=\"form-control\"/>\n                    <input id=\"SRC_SUB_SYSTEM_CODE" + cnt + "\" name = \" \" value=\"" + SRC_SUB_SYSTEM_CODE + "\" type = \"hidden\" class=\"form-control\"/>\n                    <input id=\"SRC_BRA_CODE" + cnt + "\" name = \" \" value=\"" + SRC_BRA_CODE + "\" type = \"hidden\" class=\"form-control\"/>\n                    <input id=\"SRC_TR_CODE" + cnt + "\" name = \" \" value=\"" + SRC_TR_CODE + "\" type = \"hidden\" class=\"form-control\"/>\n                    <input id=\"SRC_TR_NO" + cnt + "\" name = \" \" value=\"" + SRC_TR_NO + "\" type = \"hidden\" class=\"form-control\"/>\n                    <input id=\"SRC_TR_TYPE" + cnt + "\" name = \" \" value=\"" + SRC_TR_TYPE + "\" type = \"hidden\" class=\"form-control\"/>\n                 ";
        tr.innerHTML = html;
        AddEventControls(cnt, tr);
        return tr;
    }
    function AddEventControls(cnt, div) {
        var elements = div.querySelectorAll('#No_Row' + cnt + ' [id^="btn_"],#No_Row' + cnt + ' [id^="btn"], #No_Row' + cnt + ' [class^="form-control"], #No_Row' + cnt + ' input');
        elements.forEach(function (element) {
            // Add event listeners to the elements as needed
            debugger;
            if (element.id.toString() == "btnSearchAcc" + cnt) {
                element.addEventListener('click', function (event) {
                    var sys = new SystemTools();
                    sys.FindKey(Modules.JournalVoucher, "btnAccountSearch", "COMP_CODE=" + compcode + "and ACC_ACTIVE = 1 and DETAIL =1   ", function () {
                        var id = SearchGrid.SearchDataGrid.SelectedKey;
                        $('#txtAccNumber' + cnt).val(id);
                        if (GetAccByCode(id)) {
                            $('#txtAccName' + cnt).val((lang == "ar" ? AccountDetails.ACC_DESCA : AccountDetails.ACC_DESCL));
                            $('#txtAccountNameFooter').val((lang == "ar" ? AccountDetails.ACC_DESCA : AccountDetails.ACC_DESCL));
                            ChackCCDT_TYPE(cnt);
                        }
                        if ($("#txt_StatusFlag" + cnt).val() != "i") {
                            $("#txt_StatusFlag" + cnt).val("u");
                            $("#FlagUpdate" + cnt).val("s");
                        }
                    });
                });
            }
            if (element.id.toString() == "btnSearchCostCenter" + cnt) {
                element.addEventListener('click', function (event) {
                    var sys = new SystemTools();
                    sys.FindKey(Modules.JournalVoucher, "btnCostCenterSearch", "COMP_CODE=" + compcode + "and ACTIVE = 1 ", function () {
                        var id = SearchGrid.SearchDataGrid.SelectedKey;
                        $('#txtCostCntrNum' + cnt).val(id);
                        GetCostCenterByCode(id);
                        $('#txtCostCntrName' + cnt).val((lang == "ar" ? CostCenterDetails.CC_DESCA : CostCenterDetails.CC_DESCE));
                        $('#txtCostCntrNameFooter').val((lang == "ar" ? CostCenterDetails.CC_DESCA : CostCenterDetails.CC_DESCE));
                        if ($("#txt_StatusFlag" + cnt).val() != "i") {
                            $("#txt_StatusFlag" + cnt).val("u");
                            $("#FlagUpdate" + cnt).val("s");
                        }
                    });
                });
            }
            if (element.id.toString() == "btnSearchCCdtTypes" + cnt) {
                element.addEventListener('click', function (event) {
                    if ($("#txt_StatusFlag" + cnt).val() != "i") {
                        $("#txt_StatusFlag" + cnt).val("u");
                        $("#FlagUpdate" + cnt).val("s");
                    }
                    var sys = new SystemTools();
                    //getAccount CCDtype
                    var Account = $("#txtAccNumber" + cnt).val();
                    var accObj = AccountDetailsIst.filter(function (s) { return s.ACC_CODE == Account; });
                    if (accObj.length > 0) {
                        var ccdtype = accObj[0].CCDT_TYPE;
                        sys.FindKey(Modules.JournalVoucher, "btnSearchCCdtTypes", "COMP_CODE=" + compcode + "and CCDT_TYPE ='" + ccdtype + "'", function () {
                            var id = SearchGrid.SearchDataGrid.SelectedKey;
                            $('#txtCCDtCostCntrNum' + cnt).val(id);
                            if (GetCostCenterCCDTByCode(id)) {
                                $('#txtCCDTCostCntrName' + cnt).val((lang == "ar" ? CostCentreDetailsCCDT.CCDT_DESCA : CostCentreDetailsCCDT.CCDT_DESCE));
                            }
                        });
                    }
                    else {
                        DisplayMassage("يجب اختيار الحساب اولا", "you must choose Account ", MessageType.Worning);
                    }
                });
            }
            if (element.id.toString() == "btn_minus" + cnt) {
                element.addEventListener('click', function (event) {
                    DeleteRow(cnt);
                });
            }
            if (element.id.toString() == "btn_Copy" + cnt) {
                element.addEventListener('click', function (event) {
                    CopyNewRow(cnt);
                    ComputeTotals();
                });
            }
            if (element.id.toString() == "btn_Insert" + cnt) {
                element.addEventListener('click', function (event) {
                    InsertNewRow(cnt);
                });
            }
            if (element.id.toString() == "No_Row" + cnt) {
                element.addEventListener('click', function (event) {
                    var AccCodeVal = $('#txtAccNumber' + cnt).val();
                    var AccObj = AccountDetailsIst.filter(function (s) { return s.COMP_CODE == compcode && s.ACC_CODE == AccCodeVal; });
                    if (AccObj.length > 0) {
                        $("#divAccountNameFooter").removeClass("display_none");
                        $("#txtAccountNameFooter").prop("value", (lang == "ar" ? AccObj[0].ACC_DESCA : AccObj[0].ACC_DESCL));
                    }
                    else {
                        $("#txtAccountNameFooter").prop("value", "");
                    }
                    //GetAllCostCenters CostCentreDetailsIst
                    var CC_CodeVal = $('#txtCostCntrNum' + cnt).val();
                    var CCObj = CostCentreDetailsIst.filter(function (s) { return s.COMP_CODE == compcode && s.CC_CODE == CC_CodeVal; });
                    if (CCObj.length > 0) {
                        $("#divCostCntrNameFooter").removeClass("display_none");
                        $("#txtCostCntrNameFooter").prop("value", lang == "ar" ? CCObj[0].CC_DESCA : CCObj[0].CC_DESCE);
                    }
                    else {
                        //   $("#divCostCntrNameFooter").addClass("display_none");
                        $("#txtCostCntrNameFooter").prop("value", "");
                    }
                });
            }
            if (element.id.toString() == "txtAccNumber" + cnt) {
                element.addEventListener('change', function (event) {
                    debugger;
                    if ($("#txt_StatusFlag" + cnt).val() != "i") {
                        $("#txt_StatusFlag" + cnt).val("u");
                        $("#FlagUpdate" + cnt).val("s");
                    }
                    var id = $('#txtAccNumber' + cnt).val();
                    if (GetAccByCode(id)) {
                        if (VoucherCCDtType == 1) {
                            if (AccountDetails.CCDT_TYPE != null && AccountDetails.CCDT_TYPE != "") {
                                $('#txtAccName' + cnt).val((lang == "ar" ? AccountDetails.ACC_DESCA : AccountDetails.ACC_DESCL));
                                $('#txtAccountNameFooter').val((lang == "ar" ? AccountDetails.ACC_DESCA : AccountDetails.ACC_DESCL));
                                $("#divAccountNameFooter").removeClass("display_none");
                            }
                            else {
                                $('#txtAccName' + cnt).val((lang == "ar" ? AccountDetails.ACC_DESCA : AccountDetails.ACC_DESCL));
                                $('#txtAccountNameFooter').val((lang == "ar" ? AccountDetails.ACC_DESCA : AccountDetails.ACC_DESCL));
                                $("#divAccountNameFooter").addClass("display_none");
                            }
                        }
                        else {
                            $('#txtAccName' + cnt).val((lang == "ar" ? AccountDetails.ACC_DESCA : AccountDetails.ACC_DESCL));
                            $('#txtAccountNameFooter').val((lang == "ar" ? AccountDetails.ACC_DESCA : AccountDetails.ACC_DESCL));
                            $("#divAccountNameFooter").removeClass("display_none");
                        }
                        ChackCCDT_TYPE(cnt);
                    }
                    else {
                        $('#txtAccNumber' + cnt).val("");
                        $('#txtAccName' + cnt).val("");
                        $('#txtAccountNameFooter').val("");
                        $('#txtCredit' + cnt).val("");
                        DisplayMassage("رقم الحساب غير صحيح ", "Wrong Account number ", MessageType.Error);
                    }
                });
            }
            if (element.id.toString() == "txtCostCntrNum" + cnt) {
                element.addEventListener('change', function (event) {
                    if ($("#txt_StatusFlag" + cnt).val() != "i") {
                        $("#txt_StatusFlag" + cnt).val("u");
                        $("#FlagUpdate" + cnt).val("s");
                    }
                    var id = $('#txtCostCntrNum' + cnt).val();
                    if (GetCostCenterByCode(id)) {
                        $('#txtCostCntrName' + cnt).val((lang == "ar" ? CostCenterDetails.CC_DESCA : CostCenterDetails.CC_DESCE));
                        $('#txtCostCntrNameFooter').val((lang == "ar" ? CostCenterDetails.CC_DESCA : CostCenterDetails.CC_DESCE));
                        $("#divCostCntrNameFooter").removeClass("display_none");
                    }
                    else {
                        $('#txtCostCntrNum' + cnt).val("");
                        $('#txtCostCntrName' + cnt).val("");
                        $('#txtCostCntrNameFooter').val("");
                        //  $("#divCostCntrNameFooter").addClass("display_none"); 
                        DisplayMassage("مركز التكلفة غير صحيح ", "Wrong Cost Center ", MessageType.Error);
                    }
                });
            }
            if (element.id.toString() == "txtCCDtCostCntrNum" + cnt) {
                element.addEventListener('change', function (event) {
                    if ($("#txt_StatusFlag" + cnt).val() != "i") {
                        $("#txt_StatusFlag" + cnt).val("u");
                        $("#FlagUpdate" + cnt).val("s");
                    }
                    var Account = $("#txtAccNumber" + cnt).val();
                    var accObj = AccountDetailsIst.filter(function (s) { return s.ACC_CODE == Account; });
                    if (accObj.length > 0) {
                        var ccdtype = accObj[0].CCDT_TYPE;
                        var id = $('#txtCCDtCostCntrNum' + cnt).val();
                        if (GetCostCenterCCDTByCode(id) && ccdtype == CostCentreDetailsCCDT.CCDT_TYPE) {
                            $('#txtCCDTCostCntrName' + cnt).val((lang == "ar" ? CostCentreDetailsCCDT.CCDT_DESCA : CostCentreDetailsCCDT.CCDT_DESCE));
                        }
                        else {
                            $('#txtCCDtCostCntrNum' + cnt).val("");
                            $('#txtCCDTCostCntrName' + cnt).val("");
                            DisplayMassage("مركز التكلفة الفرعي غير صحيح ", "Wrong CCDt Cost Center ", MessageType.Error);
                        }
                    }
                    else {
                        $('#txtCCDtCostCntrNum' + cnt).val("");
                        DisplayMassage("يجب اختيار الحساب اولا", "you must choose Account ", MessageType.Worning);
                    }
                });
            }
            if (element.id.toString() == "txtDebit" + cnt) {
                element.addEventListener('change', function (event) {
                    debugger;
                    if ($("#txt_StatusFlag" + cnt).val() != "i") {
                        $("#txt_StatusFlag" + cnt).val("u");
                        $("#FlagUpdate" + cnt).val("s");
                    }
                    var txtDebitVal = Number($('#txtDebit' + cnt).val());
                    var txtCreditVal = Number($('#txtCredit' + cnt).val());
                    if (txtDebitVal == 0) {
                        if (txtCreditVal == 0) {
                            DisplayMassage("يجب اضافه قيمه للمدين او الدائن فقط ", '(The value must be added to the debtor or creditors only)', MessageType.Error);
                            $('#txtCredit' + cnt).val("0");
                        }
                    }
                    $("#txtCredit" + cnt).val('0');
                    ComputeTotals();
                });
            }
            if (element.id.toString() == "txtCredit" + cnt) {
                debugger;
                element.addEventListener('change', function (event) {
                    debugger;
                    if ($("#txt_StatusFlag" + cnt).val() != "i") {
                        $("#txt_StatusFlag" + cnt).val("u");
                        $("#FlagUpdate" + cnt).val("s");
                    }
                    var txtDebitVal = Number($('#txtDebit' + cnt).val());
                    var txtCreditVal = Number($('#txtCredit' + cnt).val());
                    if (txtCreditVal == 0) {
                        if (txtDebitVal == 0) {
                            DisplayMassage("يجب اضافه قيمه للمدين او الدائن فقط ", '(The value must be added to the debtor or creditors only)', MessageType.Error);
                            $('#txtDebit' + cnt).val("0");
                        }
                    }
                    $("#txtDebit" + cnt).val('0');
                    ComputeTotals();
                });
            }
            if (element.id.toString() == "Notes" + cnt) {
                element.addEventListener('change', function (event) {
                    if ($("#txt_StatusFlag" + cnt).val() != "i") {
                        $("#txt_StatusFlag" + cnt).val("u");
                        $("#FlagUpdate" + cnt).val("s");
                    }
                });
            }
            if (element.id.toString() == "txtAccNumber" + cnt) {
                element.addEventListener('change', function (event) {
                });
            }
        });
    }
    function clickEventsVisible() {
        $("#divCostCnterName").on('click', function () {
            debugger;
            if (Events == 0) {
                var show1 = $(".costcntr").is(":visible");
                //var show2 = $(".Acc").is(":visible");
                if (show1 == true) {
                    $(".costcntr").addClass("display_none");
                }
                else {
                    $(".costcntr").removeClass("display_none");
                }
                Events = 1;
                setTimeout(function () { Events = 0; }, 700);
            }
        });
        $("#divAccNumber").on('click', function () {
            debugger;
            if (Events == 0) {
                //$(".Acc").toggle();
                /////////////////////////
                var show1 = $(".Acc").is(":visible");
                //var show2 = $(".Acc").is(":visible");
                if (show1 == true) {
                    $(".Acc").addClass("display_none");
                }
                else {
                    $(".Acc").removeClass("display_none");
                }
                Events = 1;
                setTimeout(function () { Events = 0; }, 700);
            }
        });
        //divJouralHide
        $("#divCostCnterNameCCDT").on('click', function () {
            debugger;
            //$(".costcntrCCDt").toggle();
            /////////////////////////
            if (Events == 0) {
                var show1 = $(".costcntrCCDt").is(":visible");
                //var show2 = $(".Acc").is(":visible");
                if (show1 == true) {
                    $(".costcntrCCDt").addClass("display_none");
                }
                else {
                    $(".costcntrCCDt").removeClass("display_none");
                }
                Events = 1;
                setTimeout(function () { Events = 0; }, 700);
            }
        });
    }
    function ComputeTotals() {
        DepitTotal = 0;
        CreditTotal = 0;
        var Difference = 0;
        for (var f = 0; f < CountGrid; f++) {
            var flagvalue = $("#txt_StatusFlag" + f).val();
            if (flagvalue != "d" && flagvalue != "m") {
                DepitTotal += Number($("#txtDebit" + f).val());
                CreditTotal += Number($("#txtCredit" + f).val());
            }
        }
        DepitTotal = DepitTotal.RoundToNum(2);
        CreditTotal = CreditTotal.RoundToNum(2);
        txtTotalDebit.value = DepitTotal.toLocaleString();
        txtTotalCredit.value = CreditTotal.toLocaleString();
        Difference = (DepitTotal - CreditTotal).RoundToNum(2);
        txtDifference.value = Difference.toLocaleString();
    }
    function DeleteRow(RecNo) {
        debugger;
        if (!SysSession.CurrentPrivileges.Remove)
            return;
        WorningMessage("هل تريد الحذف؟", "Do you want to delete?", "تحذير", "worning", function () {
            var statusFlag = $("#txt_StatusFlag" + RecNo).val();
            if (statusFlag == "i") {
                $("#txt_StatusFlag" + RecNo).val("m");
                $("#FlagUpdate" + RecNo).val("m");
            }
            else {
                $("#txt_StatusFlag" + RecNo).val("d");
                $("#FlagUpdate" + RecNo).val("d");
            }
            $("#txtAccNumber" + RecNo).val("99");
            $("#txtAccName" + RecNo).val("1");
            $("#txtDebit" + RecNo).val("1");
            $("#txtCredit" + RecNo).val("1");
            $("#txtCostCntrNum" + RecNo).val("1");
            $("#txtCostCntrName" + RecNo).val("1");
            $("#txtCCDtCostCntrNum" + RecNo).val("1");
            $("#txtCCDTCostCntrName" + RecNo).val("1");
            $("#Notes" + RecNo).val("1");
            $("#No_Row" + RecNo).attr("hidden", "true");
            Insert_Serial();
            ComputeTotals();
        });
    }
    function CopyNewRow(RecNo) {
        //debugger;
        CountGrid++;
        AssignGridControlsForCopy(RecNo);
        $("#div_Data").html("");
        $(".Acc").show();
        $(".costcntr").show();
        $(".costcntrCCDt").show();
        showFlag = true;
        TempshowFlag = false;
        var counter = 0;
        for (var i = 0; i < CountGrid; i++) {
            var statusFlag = JournalDetailModelFiltered[i].StatusFlag;
            $("#div_Data").append(BuildControlsGrid(i));
            // costCenter Type 
            if (VoucherCCType == 0) {
                $(".ccType").hide();
            }
            // costCenterCCDT Type
            if (VoucherCCDtType == 1) {
                $(".ccTypeBranch").show();
            }
            else {
                $(".ccTypeBranch").hide();
            }
            var show2 = $(".costcntr").is(":visible");
            //var show2 = $(".Acc").is(":visible");
            if (show2 == false) {
                $(".costcntr").addClass("display_none");
            }
            else {
                $(".costcntr").removeClass("display_none");
            }
            var show1 = $(".Acc").is(":visible");
            //var show2 = $(".Acc").is(":visible");
            if (show1 == false) {
                $(".Acc").addClass("display_none");
            }
            else {
                $(".Acc").removeClass("display_none");
            }
            var show3 = $(".costcntrCCDt").is(":visible");
            //var show2 = $(".Acc").is(":visible");
            if (show3 == false) {
                $(".costcntrCCDt").addClass("display_none");
            }
            else {
                $(".costcntrCCDt").removeClass("display_none");
            }
            //BuildControls(i);
            //alert(statusFlag + ' ---> Row =' +i )
            if (statusFlag == "d" || statusFlag == "m") {
                $("#No_Row" + i).attr("hidden", "true");
            }
            // disabled
            $("#txtSerial" + i).attr("disabled", "disabled");
            $("#btnSearchAcc" + i).removeAttr("disabled");
            $("#txtAccNumber" + i).removeAttr("disabled");
            $("#txtAccName" + i).attr("disabled", "disabled");
            $("#txtDebit" + i).removeAttr("disabled");
            $("#txtCredit" + i).removeAttr("disabled");
            $("#txtCostCntrNum" + i).removeAttr("disabled");
            $("#btnSearchCostCenter" + i).removeAttr("disabled");
            $("#txtCostCntrName" + i).attr("disabled", "disabled");
            $("#txtCCDtCostCntrNum" + i).removeAttr("disabled");
            $("#btnSearchCCdtTypes" + i).removeAttr("disabled");
            $("#txtCCDTCostCntrName" + i).attr("disabled", "disabled");
            $("#Notes" + i).removeAttr("disabled");
            //alert(FlagAddOrEdit);
            // counter
            if (statusFlag != "d" && statusFlag != "m") {
                //if (FlagAddOrEdit == 1) {
                //    $("#txt_StatusFlag" + (i)).val("i");
                //} else {
                //    $("#txt_StatusFlag" + (i)).val("u");
                //} 
                $("#txtSerial" + i).prop("value", counter + 1);
                counter = counter + 1;
                $("#btn_minus" + i).removeClass("display_none");
                $("#btn_minus" + i).removeAttr("disabled");
                $("#btn_Insert" + i).removeClass("display_none");
                $("#btn_Copy" + i).removeClass("display_none");
            }
            ChackCCDT_TYPE(i);
        }
    }
    function InsertNewRow(RecNo) {
        CountGrid++;
        AssignGridControlsForInsert(RecNo);
        $("#div_Data").html("");
        $(".Acc").show();
        $(".costcntr").show();
        $(".costcntrCCDt").show();
        showFlag = true;
        TempshowFlag = false;
        var counter = 0;
        for (var i = 0; i < CountGrid; i++) {
            if (i == RecNo) {
                showFlag = false;
            }
            else {
                showFlag = true;
            }
            var statusFlag = JournalDetailModelFiltered[i].StatusFlag;
            $("#div_Data").append(BuildControlsGrid(i));
            // costCenter Type 
            if (VoucherCCType == 0) {
                $(".ccType").hide();
            }
            // costCenterCCDT Type
            if (VoucherCCDtType == 1) {
                $(".ccTypeBranch").show();
            }
            else {
                $(".ccTypeBranch").hide();
            }
            var show2 = $(".costcntr").is(":visible");
            //var show2 = $(".Acc").is(":visible");
            if (show2 == false) {
                $(".costcntr").addClass("display_none");
            }
            else {
                $(".costcntr").removeClass("display_none");
            }
            var show1 = $(".Acc").is(":visible");
            //var show2 = $(".Acc").is(":visible");
            if (show1 == false) {
                $(".Acc").addClass("display_none");
            }
            else {
                $(".Acc").removeClass("display_none");
            }
            var show3 = $(".costcntrCCDt").is(":visible");
            //var show2 = $(".Acc").is(":visible");
            if (show3 == false) {
                $(".costcntrCCDt").addClass("display_none");
            }
            else {
                $(".costcntrCCDt").removeClass("display_none");
            }
            //BuildControls(i);
            if (statusFlag == 'i') {
                $("#txt_StatusFlag" + (i)).val("i");
            }
            if (statusFlag == "d" || statusFlag == "m") {
                $("#No_Row" + i).attr("hidden", "true");
            }
            JournalDetailModelFiltered[i].StatusFlag = statusFlag;
            // disabled
            $("#txtSerial" + i).attr("disabled", "disabled");
            $("#btnSearchAcc" + i).removeAttr("disabled");
            $("#txtAccNumber" + i).removeAttr("disabled");
            $("#txtAccName" + i).attr("disabled", "disabled");
            $("#txtDebit" + i).removeAttr("disabled");
            $("#txtCredit" + i).removeAttr("disabled");
            $("#txtCostCntrNum" + i).removeAttr("disabled");
            $("#btnSearchCostCenter" + i).removeAttr("disabled");
            $("#txtCostCntrName" + i).attr("disabled", "disabled");
            $("#Notes" + i).removeAttr("disabled");
            $("#txtCCDtCostCntrNum" + i).removeAttr("disabled");
            $("#btnSearchCCdtTypes" + i).removeAttr("disabled");
            $("#txtCCDTCostCntrName" + i).attr("disabled", "disabled");
            //counter
            if (statusFlag != "d" && statusFlag != "m") {
                //if (FlagAddOrEdit == 1) {
                //    $("#txt_StatusFlag" + (i)).val("i");
                //} else {
                //    $("#txt_StatusFlag" + (i)).val("u");
                //} 
                $("#txtSerial" + i).prop("value", counter + 1);
                counter = counter + 1;
                $("#btn_minus" + i).removeClass("display_none");
                $("#btn_minus" + i).removeAttr("disabled");
                $("#btn_Insert" + i).removeClass("display_none");
                $("#btn_Copy" + i).removeClass("display_none");
            }
            ChackCCDT_TYPE(i);
        }
    }
    function AssignGridControlsForInsert(RecNum) {
        AQJournalDetailModel = new Array();
        var StatusFlag;
        var flagNewRecord = false;
        // Details
        for (var i = 0; i < CountGrid; i++) {
            AQJournalDetailSingleModel = new AQ_GetJournalDetail();
            if (i == RecNum) {
                AQJournalDetailSingleModel.StatusFlag = "i";
                AQJournalDetailModel.push(AQJournalDetailSingleModel);
                flagNewRecord = true;
            }
            else {
                if (flagNewRecord == true) {
                    StatusFlag = $("#txt_StatusFlag" + (i - 1)).val();
                    AQJournalDetailSingleModel.COMP_CODE = Number(SysSession.CurrentEnvironment.CompCode);
                    AQJournalDetailSingleModel.StatusFlag = StatusFlag.toString();
                    AQJournalDetailSingleModel.VOUCHER_SERIAL = (i + 1);
                    //AQJournalDetailSingleModel.VOUCHER_SERIAL = $("#txtSerial" + (i - 1)).val();
                    AQJournalDetailSingleModel.ACC_CODE = $("#txtAccNumber" + (i - 1)).val();
                    AQJournalDetailSingleModel.ACC_DESCA = $("#txtAccName" + (i - 1)).val();
                    AQJournalDetailSingleModel.CC_DESCA = $("#txtCostCntrName" + (i - 1)).val();
                    AQJournalDetailSingleModel.CC_CODE = $("#txtCostCntrNum" + (i - 1)).val();
                    AQJournalDetailSingleModel.DEBIT = $("#txtDebit" + (i - 1)).val();
                    AQJournalDetailSingleModel.CREDIT = $("#txtCredit" + (i - 1)).val();
                    AQJournalDetailSingleModel.DESCL = $("#Notes" + (i - 1)).val();
                    AQJournalDetailSingleModel.DESCA = $("#Notes" + (i - 1)).val();
                    AQJournalDetailSingleModel.INVOICE_NO = $("#INVOICE_NO" + (i - 1)).val();
                    AQJournalDetailSingleModel.BOOK_TR_NO = $("#BOOK_TR_NO" + (i - 1)).val();
                    AQJournalDetailSingleModel.SRC_SYSTEM_CODE = $("#SRC_SYSTEM_CODE" + (i - 1)).val();
                    AQJournalDetailSingleModel.SRC_SUB_SYSTEM_CODE = $("#SRC_SUB_SYSTEM_CODE" + (i - 1)).val();
                    AQJournalDetailSingleModel.SRC_BRA_CODE = $("#SRC_BRA_CODE" + (i - 1)).val();
                    AQJournalDetailSingleModel.SRC_TR_CODE = $("#SRC_TR_CODE" + (i - 1)).val();
                    AQJournalDetailSingleModel.SRC_TR_NO = $("#SRC_TR_NO" + (i - 1)).val();
                    AQJournalDetailSingleModel.SRC_TR_TYPE = $("#SRC_TR_TYPE" + (i - 1)).val();
                    AQJournalDetailSingleModel.CCDT_TYPE = $("#txtCCDtCostCntrNum" + (i - 1)).val();
                    AQJournalDetailSingleModel.CCDT_DESCA = $("#txtCCDTCostCntrName" + (i - 1)).val();
                    if (StatusFlag == "i") {
                        AQJournalDetailSingleModel.VoucherDetailID = 0;
                    }
                    else if (StatusFlag == "u" || StatusFlag == "d") {
                        AQJournalDetailSingleModel.VoucherDetailID = $("#VoucherDetailID" + (i - 1)).val();
                    }
                    AQJournalDetailModel.push(AQJournalDetailSingleModel);
                }
                else {
                    StatusFlag = $("#txt_StatusFlag" + i).val();
                    AQJournalDetailSingleModel.COMP_CODE = Number(SysSession.CurrentEnvironment.CompCode);
                    AQJournalDetailSingleModel.StatusFlag = StatusFlag.toString();
                    AQJournalDetailSingleModel.VOUCHER_SERIAL = (i + 1);
                    //AQJournalDetailSingleModel.VOUCHER_SERIAL = $("#txtSerial" + i).val();
                    AQJournalDetailSingleModel.ACC_CODE = $("#txtAccNumber" + i).val();
                    AQJournalDetailSingleModel.ACC_DESCA = $("#txtAccName" + i).val();
                    AQJournalDetailSingleModel.CC_DESCA = $("#txtCostCntrName" + i).val();
                    AQJournalDetailSingleModel.CC_CODE = $("#txtCostCntrNum" + i).val();
                    AQJournalDetailSingleModel.DEBIT = $("#txtDebit" + i).val();
                    AQJournalDetailSingleModel.CREDIT = $("#txtCredit" + i).val();
                    AQJournalDetailSingleModel.DESCL = $("#Notes" + i).val();
                    AQJournalDetailSingleModel.DESCA = $("#Notes" + i).val();
                    AQJournalDetailSingleModel.INVOICE_NO = $("#INVOICE_NO" + (i)).val();
                    AQJournalDetailSingleModel.BOOK_TR_NO = $("#BOOK_TR_NO" + (i)).val();
                    AQJournalDetailSingleModel.SRC_SYSTEM_CODE = $("#SRC_SYSTEM_CODE" + (i)).val();
                    AQJournalDetailSingleModel.SRC_SUB_SYSTEM_CODE = $("#SRC_SUB_SYSTEM_CODE" + (i)).val();
                    AQJournalDetailSingleModel.SRC_BRA_CODE = $("#SRC_BRA_CODE" + (i)).val();
                    AQJournalDetailSingleModel.SRC_TR_CODE = $("#SRC_TR_CODE" + (i)).val();
                    AQJournalDetailSingleModel.SRC_TR_NO = $("#SRC_TR_NO" + (i)).val();
                    AQJournalDetailSingleModel.SRC_TR_TYPE = $("#SRC_TR_TYPE" + (i)).val();
                    AQJournalDetailSingleModel.CCDT_TYPE = $("#txtCCDtCostCntrNum" + (i)).val();
                    AQJournalDetailSingleModel.CCDT_DESCA = $("#txtCCDTCostCntrName" + (i)).val();
                    if (StatusFlag == "i") {
                        AQJournalDetailSingleModel.VoucherDetailID = 0;
                    }
                    else if (StatusFlag == "u" || StatusFlag == "d") {
                        AQJournalDetailSingleModel.VoucherDetailID = Number($("#VoucherDetailID" + i).val());
                    }
                    AQJournalDetailModel.push(AQJournalDetailSingleModel);
                }
            }
        }
        JournalDetailModelFiltered = AQJournalDetailModel;
        flagNewRecord = false;
    }
    function AssignGridControlsForCopy(RecNum) {
        AQJournalDetailModel = new Array();
        var StatusFlag;
        var flagNewRecord = false;
        // Details
        for (var i = 0; i < CountGrid; i++) {
            AQJournalDetailSingleModel = new AQ_GetJournalDetail();
            if (i == RecNum + 1) {
                AQJournalDetailSingleModel.StatusFlag = "i";
                AQJournalDetailSingleModel.VoucherDetailID = 0;
                AQJournalDetailSingleModel.VOUCHER_SERIAL = (i + 1);
                //AQJournalDetailSingleModel.VOUCHER_SERIAL = $("#txtSerial" + (i - 1)).val();
                AQJournalDetailSingleModel.ACC_CODE = $("#txtAccNumber" + (i - 1)).val();
                AQJournalDetailSingleModel.ACC_DESCA = $("#txtAccName" + (i - 1)).val();
                AQJournalDetailSingleModel.CC_DESCA = $("#txtCostCntrName" + (i - 1)).val();
                AQJournalDetailSingleModel.CC_CODE = $("#txtCostCntrNum" + (i - 1)).val();
                AQJournalDetailSingleModel.DEBIT = $("#txtDebit" + (i - 1)).val();
                AQJournalDetailSingleModel.CREDIT = $("#txtCredit" + (i - 1)).val();
                AQJournalDetailSingleModel.DESCL = $("#Notes" + (i - 1)).val();
                AQJournalDetailSingleModel.DESCA = $("#Notes" + (i - 1)).val();
                AQJournalDetailSingleModel.INVOICE_NO = $("#INVOICE_NO" + (i - 1)).val();
                AQJournalDetailSingleModel.BOOK_TR_NO = $("#BOOK_TR_NO" + (i - 1)).val();
                AQJournalDetailSingleModel.SRC_SYSTEM_CODE = $("#SRC_SYSTEM_CODE" + (i - 1)).val();
                AQJournalDetailSingleModel.SRC_SUB_SYSTEM_CODE = $("#SRC_SUB_SYSTEM_CODE" + (i - 1)).val();
                AQJournalDetailSingleModel.SRC_BRA_CODE = $("#SRC_BRA_CODE" + (i - 1)).val();
                AQJournalDetailSingleModel.SRC_TR_CODE = $("#SRC_TR_CODE" + (i - 1)).val();
                AQJournalDetailSingleModel.SRC_TR_NO = $("#SRC_TR_NO" + (i - 1)).val();
                AQJournalDetailSingleModel.SRC_TR_TYPE = $("#SRC_TR_TYPE" + (i - 1)).val();
                AQJournalDetailSingleModel.CCDT_TYPE = $("#txtCCDtCostCntrNum" + (i - 1)).val();
                AQJournalDetailSingleModel.CCDT_DESCA = $("#txtCCDTCostCntrName" + (i - 1)).val();
                AQJournalDetailModel.push(AQJournalDetailSingleModel);
                flagNewRecord = true;
            }
            else {
                if (flagNewRecord == true) {
                    StatusFlag = $("#txt_StatusFlag" + (i - 1)).val();
                    //$("#txt_StatusFlag" + (i - 1)).val("");
                    AQJournalDetailSingleModel.COMP_CODE = Number(SysSession.CurrentEnvironment.CompCode);
                    AQJournalDetailSingleModel.StatusFlag = StatusFlag.toString();
                    AQJournalDetailSingleModel.VOUCHER_SERIAL = (i + 1);
                    //AQJournalDetailSingleModel.VOUCHER_SERIAL = $("#txtSerial" + (i - 1)).val();
                    AQJournalDetailSingleModel.ACC_CODE = $("#txtAccNumber" + (i - 1)).val();
                    AQJournalDetailSingleModel.ACC_DESCA = $("#txtAccName" + (i - 1)).val();
                    AQJournalDetailSingleModel.CC_DESCA = $("#txtCostCntrName" + (i - 1)).val();
                    AQJournalDetailSingleModel.CC_CODE = $("#txtCostCntrNum" + (i - 1)).val();
                    AQJournalDetailSingleModel.DEBIT = $("#txtDebit" + (i - 1)).val();
                    AQJournalDetailSingleModel.CREDIT = $("#txtCredit" + (i - 1)).val();
                    AQJournalDetailSingleModel.DESCL = $("#Notes" + (i - 1)).val();
                    AQJournalDetailSingleModel.DESCA = $("#Notes" + (i - 1)).val();
                    AQJournalDetailSingleModel.CCDT_TYPE = $("#txtCCDtCostCntrNum" + (i - 1)).val();
                    AQJournalDetailSingleModel.CCDT_DESCA = $("#txtCCDTCostCntrName" + (i - 1)).val();
                    AQJournalDetailSingleModel.INVOICE_NO = $("#INVOICE_NO" + (i - 1)).val();
                    AQJournalDetailSingleModel.BOOK_TR_NO = $("#BOOK_TR_NO" + (i - 1)).val();
                    AQJournalDetailSingleModel.SRC_SYSTEM_CODE = $("#SRC_SYSTEM_CODE" + (i - 1)).val();
                    AQJournalDetailSingleModel.SRC_SUB_SYSTEM_CODE = $("#SRC_SUB_SYSTEM_CODE" + (i - 1)).val();
                    AQJournalDetailSingleModel.SRC_BRA_CODE = $("#SRC_BRA_CODE" + (i - 1)).val();
                    AQJournalDetailSingleModel.SRC_TR_CODE = $("#SRC_TR_CODE" + (i - 1)).val();
                    AQJournalDetailSingleModel.SRC_TR_NO = $("#SRC_TR_NO" + (i - 1)).val();
                    AQJournalDetailSingleModel.SRC_TR_TYPE = $("#SRC_TR_TYPE" + (i - 1)).val();
                    if (StatusFlag == "i") {
                        AQJournalDetailSingleModel.VoucherDetailID = 0;
                    }
                    else if (StatusFlag == "u" || StatusFlag == "d") {
                        AQJournalDetailSingleModel.VoucherDetailID = $("#VoucherDetailID" + (i - 1)).val();
                    }
                    AQJournalDetailModel.push(AQJournalDetailSingleModel);
                }
                else {
                    StatusFlag = $("#txt_StatusFlag" + i).val();
                    //$("#txt_StatusFlag" + i).val("");
                    AQJournalDetailSingleModel.COMP_CODE = Number(SysSession.CurrentEnvironment.CompCode);
                    AQJournalDetailSingleModel.StatusFlag = StatusFlag.toString();
                    AQJournalDetailSingleModel.VOUCHER_SERIAL = (i + 1);
                    //AQJournalDetailSingleModel.VOUCHER_SERIAL = $("#txtSerial" + i).val();
                    AQJournalDetailSingleModel.ACC_CODE = $("#txtAccNumber" + i).val();
                    AQJournalDetailSingleModel.ACC_DESCA = $("#txtAccName" + i).val();
                    AQJournalDetailSingleModel.CC_DESCA = $("#txtCostCntrName" + i).val();
                    AQJournalDetailSingleModel.CC_CODE = $("#txtCostCntrNum" + i).val();
                    AQJournalDetailSingleModel.DEBIT = $("#txtDebit" + i).val();
                    AQJournalDetailSingleModel.CREDIT = $("#txtCredit" + i).val();
                    AQJournalDetailSingleModel.DESCL = $("#Notes" + i).val();
                    AQJournalDetailSingleModel.DESCA = $("#Notes" + i).val();
                    AQJournalDetailSingleModel.INVOICE_NO = $("#INVOICE_NO" + (i)).val();
                    AQJournalDetailSingleModel.BOOK_TR_NO = $("#BOOK_TR_NO" + (i)).val();
                    AQJournalDetailSingleModel.SRC_SYSTEM_CODE = $("#SRC_SYSTEM_CODE" + (i)).val();
                    AQJournalDetailSingleModel.SRC_SUB_SYSTEM_CODE = $("#SRC_SUB_SYSTEM_CODE" + (i)).val();
                    AQJournalDetailSingleModel.SRC_BRA_CODE = $("#SRC_BRA_CODE" + (i)).val();
                    AQJournalDetailSingleModel.SRC_TR_CODE = $("#SRC_TR_CODE" + (i)).val();
                    AQJournalDetailSingleModel.SRC_TR_NO = $("#SRC_TR_NO" + (i)).val();
                    AQJournalDetailSingleModel.SRC_TR_TYPE = $("#SRC_TR_TYPE" + (i)).val();
                    AQJournalDetailSingleModel.CCDT_TYPE = $("#txtCCDtCostCntrNum" + (i)).val();
                    AQJournalDetailSingleModel.CCDT_DESCA = $("#txtCCDTCostCntrName" + (i)).val();
                    if (StatusFlag == "i") {
                        AQJournalDetailSingleModel.VoucherDetailID = 0;
                    }
                    else if (StatusFlag == "u" || StatusFlag == "d") {
                        AQJournalDetailSingleModel.VoucherDetailID = Number($("#VoucherDetailID" + i).val());
                    }
                    AQJournalDetailModel.push(AQJournalDetailSingleModel);
                }
            }
        }
        JournalDetailModelFiltered = AQJournalDetailModel;
        flagNewRecord = false;
    }
    //---------------------------------------------- get By id  functions ----------------------------------------
    function GetAccByCode(AccCode) {
        debugger;
        var flag = true;
        var accObj = AccountDetailsIst.filter(function (s) { return s.ACC_CODE == AccCode; });
        if (accObj.length > 0) {
            AccountDetails = accObj[0];
        }
        else {
            flag = false;
        }
        return flag;
    }
    function ChackCCDT_TYPE(cnt) {
        var AccNum = $("#txtAccNumber" + cnt).val();
        var AccObject = AccountDetailsIst.filter(function (s) { return s.COMP_CODE == compcode && s.ACC_CODE == AccNum; });
        if (AccObject.length > 0) {
            if (VoucherCCDtType == 1 && (AccObject[0].CCDT_TYPE != null && AccObject[0].CCDT_TYPE != "")) {
                $("#btnSearchCCdtTypes" + cnt).removeAttr("disabled");
                $("#txtCCDtCostCntrNum" + cnt).removeAttr("disabled");
            }
            else {
                $("#btnSearchCCdtTypes" + cnt).attr("disabled", "disabled");
                $("#txtCCDtCostCntrNum" + cnt).attr("disabled", "disabled");
            }
        }
    }
    function Chack_disabled(cnt, AccNumber) {
        var AccNum = AccNumber;
        var AccObject = AccountDetailsIst.filter(function (s) { return s.COMP_CODE == compcode && s.ACC_CODE == AccNum; });
        if (AccObject.length > 0) {
            if (VoucherCCDtType == 1 && (AccObject[0].CCDT_TYPE != null && AccObject[0].CCDT_TYPE != "")) {
                return "";
            }
            else {
                return "disabled";
            }
        }
        return "";
    }
    function GetCostCenterByCode(CC_Code) {
        var flag = true;
        var ccObj = CostCentreDetailsIst.filter(function (s) { return s.CC_CODE == CC_Code; });
        if (ccObj.length > 0) {
            CostCenterDetails = ccObj[0];
        }
        else {
            flag = false;
        }
        return flag;
    }
    function GetAllAccount() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GLDefAccount", "GetAll"),
            data: { CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    AccountDetailsIst = result.Response;
                }
            }
        });
    }
    function GetAllCostCenters() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GLTrVoucher", "GetAllCostCenters"),
            data: { CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    CostCentreDetailsIst = result.Response;
                }
            }
        });
    }
    function GetAllCostCentersCCDT() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDtCostCenters", "GetAll"),
            data: { compCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    CostCentreDetailsCCDTIst = result.Response;
                }
            }
        });
    }
    function GetCostCenterCCDTByCode(CC_Code) {
        var flag = true;
        var ccObj = CostCentreDetailsCCDTIst.filter(function (s) { return s.CCDT_CODE == CC_Code; });
        if (ccObj.length > 0) {
            CostCentreDetailsCCDT = ccObj[0];
        }
        else {
            flag = false;
        }
        return flag;
    }
    //--------------------------------------------------- Main Functions-----------------------------------------------
    function Assign() {
        debugger;
        MasterDetailModel = new JournalMasterDetails();
        JournalHeaderModel = new A_JOURNAL_HEADER();
        JournalDetailModel = new Array();
        // Header Data
        JournalHeaderModel.VOUCHER_CODE = Number(txtJouranlNumber.value);
        JournalHeaderModel.COMP_CODE = Number(SysSession.CurrentEnvironment.CompCode);
        JournalHeaderModel.VOUCHER_DATE = txtJouranlDate.value;
        JournalHeaderModel.VOUCHER_DESC = txtJournalDescripton.value;
        if (txtTotalDebit.value != "") {
            JournalHeaderModel.TotalDebit = DepitTotal.RoundToNum(2);
        }
        if (txtTotalCredit.value != "") {
            JournalHeaderModel.TotalCredit = CreditTotal.RoundToNum(2);
        }
        if (rdNew.checked == true) {
            JournalHeaderModel.VOUCHER_STATUS = 0;
        }
        else if (rdAuthorized.checked == true) {
            JournalHeaderModel.VOUCHER_STATUS = 1;
        }
        //else if (rdPosted.checked == true) { JournalHeaderModel.VOUCHER_STATUS = 2; }
        JournalHeaderModel.TYPE_CODE = Number(ddlJournalType.value);
        JournalHeaderModel.REF_CODE = txtRefNumber.value;
        JournalHeaderModel.CREATED_BY = txtCreatedBy.value;
        JournalHeaderModel.CREATED_AT = txtCreatedAt.value;
        JournalHeaderModel.UPDATED_BY = txtUpdatedBy.value;
        JournalHeaderModel.UPDATED_AT = txtUpdatedAt.value;
        var StatusFlag;
        // Details
        for (var i = 0; i < CountGrid; i++) {
            JournalDetailSingleModel = new A_JOURNAL_DETAIL();
            StatusFlag = $("#txt_StatusFlag" + i).val();
            if (GlobalTemplateID != 0 && StatusFlag != "d" && StatusFlag != "m") {
                StatusFlag = "i";
            }
            JournalDetailSingleModel.COMP_CODE = Number(SysSession.CurrentEnvironment.CompCode);
            JournalDetailSingleModel.StatusFlag = StatusFlag.toString();
            if (StatusFlag == "i") {
                JournalDetailSingleModel.VoucherDetailID = 0;
                JournalDetailSingleModel.VOUCHER_SERIAL = $("#txtSerial" + i).val();
                JournalDetailSingleModel.ACC_CODE = $("#txtAccNumber" + i).val();
                JournalDetailSingleModel.CC_CODE = $("#txtCostCntrNum" + i).val();
                JournalDetailSingleModel.DEBIT = $("#txtDebit" + i).val();
                JournalDetailSingleModel.CREDIT = $("#txtCredit" + i).val();
                JournalDetailSingleModel.DESCL = $("#Notes" + i).val();
                JournalDetailSingleModel.DESCA = $("#Notes" + i).val();
                JournalDetailSingleModel.CCDT_CODE = $("#txtCCDtCostCntrNum" + i).val();
                //****************************************************************************
                JournalDetailSingleModel.INVOICE_NO = $("#INVOICE_NO" + i).val();
                JournalDetailSingleModel.BOOK_TR_NO = $("#BOOK_TR_NO" + i).val();
                JournalDetailSingleModel.SRC_SYSTEM_CODE = $("#SRC_SYSTEM_CODE" + i).val();
                JournalDetailSingleModel.SRC_SUB_SYSTEM_CODE = $("#SRC_SUB_SYSTEM_CODE" + i).val();
                JournalDetailSingleModel.SRC_BRA_CODE = $("#SRC_BRA_CODE" + i).val();
                JournalDetailSingleModel.SRC_TR_CODE = $("#SRC_TR_CODE" + i).val();
                JournalDetailSingleModel.SRC_TR_NO = $("#SRC_TR_NO" + i).val();
                JournalDetailSingleModel.SRC_TR_TYPE = $("#SRC_TR_TYPE" + i).val();
                JournalDetailModel.push(JournalDetailSingleModel);
            }
            else if (StatusFlag == "u") {
                JournalDetailSingleModel.VoucherDetailID = $("#VoucherDetailID" + i).val();
                JournalDetailSingleModel.VOUCHER_SERIAL = $("#txtSerial" + i).val();
                JournalDetailSingleModel.ACC_CODE = $("#txtAccNumber" + i).val();
                JournalDetailSingleModel.CC_CODE = $("#txtCostCntrNum" + i).val();
                JournalDetailSingleModel.DEBIT = $("#txtDebit" + i).val();
                JournalDetailSingleModel.CREDIT = $("#txtCredit" + i).val();
                JournalDetailSingleModel.DESCL = $("#Notes" + i).val();
                JournalDetailSingleModel.DESCA = $("#Notes" + i).val();
                JournalDetailSingleModel.CCDT_CODE = $("#txtCCDtCostCntrNum" + i).val();
                //****************************************************************************
                JournalDetailSingleModel.INVOICE_NO = $("#INVOICE_NO" + i).val();
                JournalDetailSingleModel.BOOK_TR_NO = $("#BOOK_TR_NO" + i).val();
                JournalDetailSingleModel.SRC_SYSTEM_CODE = $("#SRC_SYSTEM_CODE" + i).val();
                JournalDetailSingleModel.SRC_SUB_SYSTEM_CODE = $("#SRC_SUB_SYSTEM_CODE" + i).val();
                JournalDetailSingleModel.SRC_BRA_CODE = $("#SRC_BRA_CODE" + i).val();
                JournalDetailSingleModel.SRC_TR_CODE = $("#SRC_TR_CODE" + i).val();
                JournalDetailSingleModel.SRC_TR_NO = $("#SRC_TR_NO" + i).val();
                JournalDetailSingleModel.SRC_TR_TYPE = $("#SRC_TR_TYPE" + i).val();
                JournalDetailModel.push(JournalDetailSingleModel);
            }
            else if (StatusFlag == "d") {
                if (FlagAddOrEdit == 2) {
                    var deletedID = Number($("#VoucherDetailID" + i).val());
                    JournalDetailSingleModel.VoucherDetailID = deletedID;
                    JournalDetailModel.push(JournalDetailSingleModel);
                }
            }
            var FlagUpdate = $("#FlagUpdate" + i).val();
            if (FlagUpdate == "s") {
                JournalDetailSingleModel = new A_JOURNAL_DETAIL();
                JournalDetailSingleModel.FlagUpdate = FlagUpdate.toString();
                JournalDetailSingleModel.COMP_CODE = Number(SysSession.CurrentEnvironment.CompCode);
                JournalDetailSingleModel.VoucherDetailID = $("#VoucherDetailID" + i).val();
                JournalDetailSingleModel.VOUCHER_SERIAL = $("#txtSerial" + i).val();
                JournalDetailSingleModel.ACC_CODE = $("#txtAccNumber" + i).val();
                JournalDetailSingleModel.CC_CODE = $("#txtCostCntrNum" + i).val();
                JournalDetailSingleModel.DEBIT = $("#txtDebit" + i).val();
                JournalDetailSingleModel.CREDIT = $("#txtCredit" + i).val();
                JournalDetailSingleModel.DESCL = $("#Notes" + i).val();
                JournalDetailSingleModel.DESCA = $("#Notes" + i).val();
                JournalDetailSingleModel.CCDT_CODE = $("#txtCCDtCostCntrNum" + i).val();
                //****************************************************************************
                JournalDetailSingleModel.INVOICE_NO = $("#INVOICE_NO" + i).val();
                JournalDetailSingleModel.BOOK_TR_NO = $("#BOOK_TR_NO" + i).val();
                JournalDetailSingleModel.SRC_SYSTEM_CODE = $("#SRC_SYSTEM_CODE" + i).val();
                JournalDetailSingleModel.SRC_SUB_SYSTEM_CODE = $("#SRC_SUB_SYSTEM_CODE" + i).val();
                JournalDetailSingleModel.SRC_BRA_CODE = $("#SRC_BRA_CODE" + i).val();
                JournalDetailSingleModel.SRC_TR_CODE = $("#SRC_TR_CODE" + i).val();
                JournalDetailSingleModel.SRC_TR_NO = $("#SRC_TR_NO" + i).val();
                JournalDetailSingleModel.SRC_TR_TYPE = $("#SRC_TR_TYPE" + i).val();
                JournalDetailModel.push(JournalDetailSingleModel);
            }
        }
        MasterDetailModel.A_JOURNAL_HEADER.COMP_CODE = Number(SysSession.CurrentEnvironment.CompCode);
        MasterDetailModel.Branch_Code = SysSession.CurrentEnvironment.BranchCode;
        MasterDetailModel.MODULE_CODE = SysSession.CurrentEnvironment.ModuleCode;
        MasterDetailModel.sec_FinYear = SysSession.CurrentEnvironment.CurrentYear;
        MasterDetailModel.A_JOURNAL_HEADER = JournalHeaderModel;
        MasterDetailModel.A_JOURNAL_DETAIL = JournalDetailModel;
        MasterDetailModel.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
        MasterDetailModel.UserCode = SysSession.CurrentEnvironment.UserCode;
    }
    function Insert() {
        MasterDetailModel.A_JOURNAL_HEADER.SOURCE_TYPE = "1";
        MasterDetailModel.A_JOURNAL_HEADER.CREATED_BY = SysSession.CurrentEnvironment.UserCode;
        MasterDetailModel.A_JOURNAL_HEADER.CREATED_AT = DateTimeFormat(Date().toString());
        MasterDetailModel.A_JOURNAL_HEADER.VoucherID = 0;
        console.log(MasterDetailModel);
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("GLTrVoucher", "InsertJournalMasterDetail"),
            data: JSON.stringify(MasterDetailModel),
            success: function (d) {
                var result = d;
                if (result.IsSuccess == true) {
                    var res = result.Response;
                    DateSetsSccess("txtJouranlDate", "txtFromDate", "txtToDate");
                    DisplayMassage("تم اصدار  سند قيد رقم " + res.VOUCHER_CODE, '(success)', MessageType.Succeed);
                    txtJouranlNumber.value = res.VOUCHER_CODE.toString();
                    GlobalVoucherID = res.VoucherID;
                    //BindGridData();
                    AfterInsertOrUpdateFlag = true;
                    ShowButons();
                    //GridRowDoubleClick();
                    displayDate_speed(res.VoucherID, res);
                    AfterInsertOrUpdateFlag = false;
                    $("#divFilter").removeClass("disabledDiv");
                    $("#divGridShow").removeClass("disabledDiv");
                    //DisableControls();
                    GlobalTemplateID = 0;
                    $('#DivTemplate').addClass('showdiv');
                    $('#spandiv_contentliest').addClass('fa-caret-left');
                    $('#spandiv_contentliest').removeClass('fa-caret-down');
                    FlagAddOrEdit = 2;
                    Save_Succ_But();
                }
                else {
                    DisplayMassage("هناك خطــأ ", '(Error)', MessageType.Error);
                }
            }
        });
    }
    function Update() {
        debugger;
        try {
            MasterDetailModel.A_JOURNAL_HEADER.UPDATED_BY = SysSession.CurrentEnvironment.UserCode;
            MasterDetailModel.A_JOURNAL_HEADER.UPDATED_AT = DateTimeFormat(Date().toString());
            MasterDetailModel.A_JOURNAL_HEADER.SOURCE_TYPE = SelectedJournalModel[0].SOURCE_TYPE;
            MasterDetailModel.A_JOURNAL_HEADER.VoucherID = GlobalVoucherID;
            // creation
            MasterDetailModel.A_JOURNAL_HEADER.CREATED_BY = SelectedJournalModel[0].CREATED_BY;
            MasterDetailModel.A_JOURNAL_HEADER.CREATED_AT = SelectedJournalModel[0].CREATED_AT;
        }
        catch (e) {
        }
        // Edit
        if (SelectedJournalModel[0].UPDATED_BY != null) {
            txtUpdatedBy.value = SelectedJournalModel[0].UPDATED_BY;
            txtUpdatedAt.value = SelectedJournalModel[0].UPDATED_AT;
        }
        // Authorized
        if (SelectedJournalModel[0].AUTHORISED_BY != null) {
            txtAuthorizedBy.value = SelectedJournalModel[0].AUTHORISED_BY;
            txtAuthorizedAt.value = SelectedJournalModel[0].AUTHORISED_AT;
            MasterDetailModel.A_JOURNAL_HEADER.AUTHORISED_BY = SelectedJournalModel[0].AUTHORISED_BY;
            MasterDetailModel.A_JOURNAL_HEADER.AUTHORISED_AT = SelectedJournalModel[0].AUTHORISED_AT;
        }
        if (SelectedJournalModel[0].POSTED_BY != null) {
            txtPostedBy.value = SelectedJournalModel[0].POSTED_BY;
            txtPostedAt.value = SelectedJournalModel[0].POSTED_AT;
        }
        if (AuthorizeFlag == true) {
            MasterDetailModel.A_JOURNAL_HEADER.VOUCHER_STATUS = 1;
            MasterDetailModel.A_JOURNAL_HEADER.AUTHORISED_BY = SysSession.CurrentEnvironment.UserCode;
            MasterDetailModel.A_JOURNAL_HEADER.AUTHORISED_AT = DateTimeFormat(Date().toString());
            txtAuthorizedBy.value = SysSession.CurrentEnvironment.UserCode;
            txtAuthorizedAt.value = DateTimeFormat(Date().toString());
        }
        // posted
        if (PostFlag == true) {
            MasterDetailModel.A_JOURNAL_HEADER.VOUCHER_STATUS = 2;
            MasterDetailModel.A_JOURNAL_HEADER.POSTED_BY = SysSession.CurrentEnvironment.UserCode;
            MasterDetailModel.A_JOURNAL_HEADER.POSTED_AT = DateTimeFormat(Date().toString());
            txtPostedBy.value = SysSession.CurrentEnvironment.UserCode;
            txtPostedAt.value = DateTimeFormat(Date().toString());
        }
        debugger;
        console.log(MasterDetailModel);
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("GLTrVoucher", "UpdateJournalMasterDetail"),
            data: JSON.stringify(MasterDetailModel),
            success: function (d) {
                var result = d;
                if (result.IsSuccess == true) {
                    var res = result.Response;
                    DateSetsSccess("txtJouranlDate", "txtFromDate", "txtToDate");
                    if (AuthorizeFlag == true) {
                        DisplayMassage('تم التصديق بنجاح', '(Success)', MessageType.Succeed);
                        $("#btnUpdate").attr("disabled", "disabled");
                        $("#btnAuthorize").removeAttr("disabled");
                        $("#btnPost").removeAttr("disabled");
                        $("#btnAuthorize").addClass("display_none");
                        $("#btnUnAuthorize").removeClass("display_none");
                        AuthorizeFlag = false;
                    }
                    else if (PostFlag == true) {
                        DisplayMassage('تم الترحيل  بنجاح', '(success)', MessageType.Succeed);
                        $("#btnUpdate").attr("disabled", "disabled");
                        $("#btnAuthorize").attr("disabled", "disabled");
                        $("#btnPost").attr("disabled", "disabled");
                        $("#btnAuthorize").removeClass("display_none");
                        $("#btnUnAuthorize").addClass("display_none");
                        PostFlag = false;
                    }
                    else {
                        DisplayMassage("تم تعديل  سند قيد رقم " + res.VOUCHER_CODE, '(success)', MessageType.Succeed);
                        $("#btnAuthorize").removeAttr("disabled");
                        $("#btnPost").attr("disabled", "disabled");
                        $("#btnAuthorize").removeClass("display_none");
                        $("#btnUnAuthorize").addClass("display_none");
                    }
                    GlobalVoucherID = res.VoucherID;
                    //Success();
                    //BindGridData();
                    AfterInsertOrUpdateFlag = true;
                    ShowButons();
                    //GridRowDoubleClick(); 
                    displayDate_speed(res.VoucherID, res);
                    AfterInsertOrUpdateFlag = false;
                    $("#divFilter").removeClass("disabledDiv");
                    $("#divGridShow").removeClass("disabledDiv");
                    //DisableControls();
                    GlobalTemplateID = 0;
                    $('#DivTemplate').addClass('showdiv');
                    $('#spandiv_contentliest').addClass('fa-caret-left');
                    $('#spandiv_contentliest').removeClass('fa-caret-down');
                    FlagAddOrEdit = 2;
                    Save_Succ_But();
                }
                else {
                    DisplayMassage("هناك خطــأ ", '(Error)', MessageType.Error);
                }
            }
        });
    }
    function Open() {
        if (!CheckDate(DateFormat(txtJouranlDate.value).toString(), DateFormat(SysSession.CurrentEnvironment.StartDate).toString(), DateFormat(SysSession.CurrentEnvironment.EndDate).toString())) {
            WorningMessage('  التاريخ ليس متطابق مع تاريخ السنه (' + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ')', '  The date is not identical with the date of the year (' + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ')', "تحذير", "worning");
            Errorinput(txtJouranlDate);
            return;
        }
        if (!CheckPeriodDate(txtJouranlDate.value, "A")) {
            debugger;
            DisplayMassage("لا يمكنك الاضافه او التعديل في هذة الفتره المغلقه ", "Please select a Invoice data", MessageType.Error);
            Errorinput(txtJouranlDate);
            return false;
        }
        MasterDetailModel.A_JOURNAL_HEADER.UPDATED_BY = SysSession.CurrentEnvironment.UserCode;
        MasterDetailModel.A_JOURNAL_HEADER.UPDATED_AT = DateTimeFormat(Date().toString());
        MasterDetailModel.A_JOURNAL_HEADER.SOURCE_TYPE = SelectedJournalModel[0].SOURCE_TYPE;
        MasterDetailModel.A_JOURNAL_HEADER.VoucherID = GlobalVoucherID;
        // creation
        MasterDetailModel.A_JOURNAL_HEADER.CREATED_BY = SelectedJournalModel[0].CREATED_BY;
        MasterDetailModel.A_JOURNAL_HEADER.CREATED_AT = SelectedJournalModel[0].CREATED_AT;
        MasterDetailModel.A_JOURNAL_HEADER.VOUCHER_STATUS = 0;
        // Edit
        if (SelectedJournalModel[0].UPDATED_BY != null) {
            txtUpdatedBy.value = SysSession.CurrentEnvironment.UserCode;
            txtUpdatedAt.value = DateTimeFormat(Date().toString());
        }
        txtAuthorizedBy.value = "";
        txtAuthorizedAt.value = "";
        txtPostedBy.value = "";
        txtPostedAt.value = "";
        MasterDetailModel.A_JOURNAL_HEADER.AUTHORISED_BY = "";
        MasterDetailModel.A_JOURNAL_HEADER.AUTHORISED_AT = "";
        MasterDetailModel.A_JOURNAL_HEADER.POSTED_BY = "";
        MasterDetailModel.A_JOURNAL_HEADER.POSTED_AT = "";
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("GLTrVoucher", "Open"),
            data: JSON.stringify(MasterDetailModel),
            success: function (d) {
                var result = d;
                if (result.IsSuccess == true) {
                    var res = result.Response;
                    GlobalVoucherID = res.VoucherID;
                    DisplayMassage('تم فك الاعتماد بنجاح', '(Success)', MessageType.Succeed);
                    rdNew.checked = true;
                    $("#btnUpdate").removeAttr("disabled");
                    $("#btnAuthorize").removeAttr("disabled");
                    $("#btnPost").attr("disabled", "disabled");
                    $("#btnAuthorize").removeClass("display_none");
                    $("#btnUnAuthorize").addClass("display_none");
                    //BindGridData();
                    AfterInsertOrUpdateFlag = true;
                    //GridRowDoubleClick();
                    displayDate_speed(res.VoucherID, res);
                    AfterInsertOrUpdateFlag = false;
                }
                else {
                    DisplayMassage("هناك خطــأ ", '(Error)', MessageType.Error);
                }
            }
        });
    }
    function displayDate_speed(VouchID, res) {
        AQJournalHeaderWithDetails = AQJournalHeaderWithDetails.filter(function (x) { return x.VoucherID != VouchID; });
        AQJournalHeaderWithDetails.push(res);
        AQJournalHeaderWithDetails = AQJournalHeaderWithDetails.sort(dynamicSortNew("VOUCHER_CODE"));
        Grid.DataSource = AQJournalHeaderWithDetails;
        Grid.Bind();
        $("#divGridDetails").jsGrid("option", "pageIndex", 1);
        Success(VouchID);
    }
    function Success(VouchID) {
        debugger;
        showFlag = true;
        TempshowFlag = false;
        AuthorizeFlag = false;
        PostFlag = false;
        Clear();
        $("#divJournalDetail").removeClass("display_none");
        SelectedJournalModel = AQJournalHeaderWithDetails.filter(function (x) { return x.VoucherID == VouchID; });
        if (SelectedJournalModel.length > 0) {
            GlobalVoucherID = Number(SelectedJournalModel[0].VoucherID);
            txtJouranlNumber.value = SelectedJournalModel[0].VOUCHER_CODE.toString();
            txtJournalDescripton.value = SelectedJournalModel[0].VOUCHER_DESC;
            txtJouranlDate.value = DateFormat(SelectedJournalModel[0].VOUCHER_DATE);
            if (SelectedJournalModel[0].REF_CODE != null)
                txtRefNumber.value = SelectedJournalModel[0].REF_CODE.toString();
            txtResource.value = txtResource.value = (lang == "ar" ? SelectedJournalModel[0].Src_DescA.toString() : SelectedJournalModel[0].Src_DescE.toString());
            if (SelectedJournalModel[0].TYPE_CODE != null)
                ddlJournalType.value = SelectedJournalModel[0].TYPE_CODE.toString();
            // creation
            txtCreatedBy.value = SelectedJournalModel[0].CREATED_BY;
            txtCreatedAt.value = SelectedJournalModel[0].CREATED_AT;
            // Edit
            if (SelectedJournalModel[0].UPDATED_BY != null) {
                txtUpdatedBy.value = SelectedJournalModel[0].UPDATED_BY;
                txtUpdatedAt.value = SelectedJournalModel[0].UPDATED_AT;
            }
        }
        JournalDetailModelFiltered = new Array();
        if (ReverseFlag == true) {
            JournalDetailModelFiltered = ReversedJournalMasterDetailModel.AQ_GetJournalDetail;
        }
        else {
            Ajax.Callsync({
                type: "Get",
                url: sys.apiUrl("GLTrVoucher", "GetAllJournalDetail"),
                data: { VoucherID: GlobalVoucherID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
                success: function (d) {
                    var result = d;
                    if (result.IsSuccess) {
                        JournalDetailModelFiltered = result.Response;
                    }
                }
            });
        }
        JournalDetailModelFiltered = JournalDetailModelFiltered.filter(function (x) { return x.VOUCHER_SERIAL != null; }).sort(function (a, b) { return a.VOUCHER_SERIAL - b.VOUCHER_SERIAL; });
        debugger;
        $('#Loading_Div').html('<i class="fa fa-spinner fa-spin lod  Loading"  ></i>');
        document.body.scrollTop = 800;
        document.documentElement.scrollTop = 800;
        setTimeout(function () {
            debugger;
            var fragment = document.createDocumentFragment();
            for (var i = 0; i < JournalDetailModelFiltered.length; ++i) {
                fragment.appendChild(BuildControlsGrid(i)); // Append to the DocumentFragment
            }
            document.getElementById("div_Data").appendChild(fragment); // Append the DocumentFragment to the div
            // costCenter Type 
            if (VoucherCCType == 0) {
                $(".ccType").hide();
            }
            // costCenterCCDT Type
            if (VoucherCCDtType == 1) {
                $(".ccTypeBranch").show();
            }
            else {
                $(".ccTypeBranch").hide();
            }
            var show2 = $(".costcntr").is(":visible");
            //var show2 = $(".Acc").is(":visible");
            if (show2 == false) {
                $(".costcntr").addClass("display_none");
            }
            else {
                $(".costcntr").removeClass("display_none");
            }
            var show1 = $(".Acc").is(":visible");
            //var show2 = $(".Acc").is(":visible");
            if (show1 == false) {
                $(".Acc").addClass("display_none");
            }
            else {
                $(".Acc").removeClass("display_none");
            }
            var show3 = $(".costcntrCCDt").is(":visible");
            //var show2 = $(".Acc").is(":visible");
            if (show3 == false) {
                $(".costcntrCCDt").addClass("display_none");
            }
            else {
                $(".costcntrCCDt").removeClass("display_none");
            }
            CountGrid = JournalDetailModelFiltered.length;
            ComputeTotals();
            DisableControls();
            $('#Loading_Div').html('');
        }, 1);
        // جديد
        if (SelectedJournalModel[0].VOUCHER_STATUS == 0) {
            rdNew.checked = true;
            $("#btnUnAuthorize").addClass("display_none");
            $("#btnPost").addClass("display_none");
            $("#btnAuthorize").removeClass("display_none");
            $("#btnPost").attr("disabled", "disabled");
            $("#btnUpdate").removeAttr("disabled");
            btnUpdate.disabled = !SysSession.CurrentPrivileges.EDIT;
            btnAuthorize.disabled = !SysSession.CurrentPrivileges.CUSTOM1;
            txtAuthorizedBy.value = "";
            txtAuthorizedAt.value = "";
            txtPostedBy.value = "";
            txtPostedAt.value = "";
        }
        // معتمد
        if (SelectedJournalModel[0].VOUCHER_STATUS == 1) {
            rdAuthorized.checked = true;
            txtAuthorizedBy.value = SelectedJournalModel[0].AUTHORISED_BY;
            txtAuthorizedAt.value = SelectedJournalModel[0].AUTHORISED_AT;
            $("#btnUnAuthorize").removeClass("display_none");
            $("#btnPost").removeClass("display_none");
            btnUnAuthorize.disabled = !SysSession.CurrentPrivileges.CUSTOM3;
            $("#btnAuthorize").addClass("display_none");
            btnPost.disabled = !SysSession.CurrentPrivileges.CUSTOM2;
            $("#btnUpdate").attr("disabled", "disabled");
            txtPostedBy.value = "";
            txtPostedAt.value = "";
        }
        // مرحل
        if (SelectedJournalModel[0].VOUCHER_STATUS == 2) {
            rdPosted.checked = true;
            txtPostedBy.value = SelectedJournalModel[0].POSTED_BY;
            txtPostedAt.value = SelectedJournalModel[0].POSTED_AT;
            txtAuthorizedBy.value = SelectedJournalModel[0].AUTHORISED_BY;
            txtAuthorizedAt.value = SelectedJournalModel[0].AUTHORISED_AT;
            $("#btnAuthorize").attr("disabled", "disabled");
            $("#btnUnAuthorize").addClass("display_none");
            $("#btnAuthorize").addClass("display_none");
            $("#btnPost").addClass("display_none");
            $("#btnPost").attr("disabled", "disabled");
            $("#btnUpdate").attr("disabled", "disabled");
        }
    }
    function Save() {
        if (!CheckDate(DateFormat(txtJouranlDate.value).toString(), DateFormat(SysSession.CurrentEnvironment.StartDate).toString(), DateFormat(SysSession.CurrentEnvironment.EndDate).toString())) {
            WorningMessage('  التاريخ ليس متطابق مع تاريخ السنه (' + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ')', '  The date is not identical with the date of the year (' + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ')', "تحذير", "worning");
            Errorinput(txtJouranlDate);
            return;
        }
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
            Assign();
            if (FlagAddOrEdit == 1) {
                Insert();
            }
            else if (FlagAddOrEdit == 2) {
                Update();
            }
        }
    }
    //------------------------------------------------------ Template Region -----------------------------------
    function btnLoadTemplate_onclick() {
        var sys = new SystemTools();
        sys.FindKey(Modules.JournalVoucher, "btnLoadTemplate", "COMP_CODE=" + compcode + " and VOUCHER_TYPE =1", function () {
            Clear();
            GlobalTemplateID = SearchGrid.SearchDataGrid.SelectedKey;
            GetTemplateByID();
            $("#divTemplateData :input").attr("disabled", "disabled");
            //$("#divTemplateData").addClass("display_none");
            HideButtons();
            rdNew.checked = true;
            txtCreatedAt.value = DateTimeFormat(Date().toString());
            txtCreatedBy.value = SysSession.CurrentEnvironment.UserCode;
            txtResource.value = (lang == "ar" ? "قيد يدوي" : "manual entry");
            FlagAddOrEdit = 1;
            showFlag = false;
            TempshowFlag = false;
            DisableDiv();
            for (var i = 0; i < CountGrid; i++) {
                $('#txt_StatusFlag' + i).val("i");
                ChackCCDT_TYPE(i);
            }
            $("#btnBackTemp").removeClass("display_none");
            $("#btnBackTemp").removeAttr("disabled");
            $("#btnCreateTemplate").removeAttr("disabled");
            $("#btnDeleteTemplate").removeAttr("disabled");
            $("#btnEditTemplate").removeAttr("disabled");
            $("#btnLoadTemplate").removeAttr("disabled");
        });
    }
    function btnCreateTemplate_onclick() {
        if (!SysSession.CurrentPrivileges.AddNew)
            return;
        $("#divJournalDetail").removeClass("display_none");
        TempshowFlag = false;
        TempFlagAddOrEdit = 1;
        $("#divTemplateData :input").removeAttr("disabled");
        $("#divTemplateData").removeClass("display_none");
        $(".BtnHide").attr("disabled", "disabled");
        HideButtons();
        EnableControls();
        DisableDiv();
        txtTempNumber.disabled = true;
        $("#btnSaveTemp").removeClass("display_none");
        $("#btnBackTemp").removeClass("display_none");
    }
    function btnUpdateTemplate_onclick() {
        if (!SysSession.CurrentPrivileges.EDIT)
            return;
        sys.FindKey(Modules.JournalVoucher, "btnLoadTemplate", "COMP_CODE=" + compcode, function () {
            Clear();
            TempshowFlag = true;
            GlobalTemplateID = SearchGrid.SearchDataGrid.SelectedKey;
            TempFlagAddOrEdit = 2;
            GetTemplateByID();
            //$(".BtnHide").hide();
            $("#divTemplateData :input").removeAttr("disabled");
            $("#divTemplateData").removeClass("display_none");
            HideButtons();
            txtTempNumber.disabled = true;
            DisableDiv();
            for (var i = 0; i < CountGrid; i++) {
                //$('#txt_StatusFlag' + i).val("u");
                ChackCCDT_TYPE(i);
            }
            $(".BtnHide").attr("disabled", "disabled");
            $("#btnSaveTemp").removeClass("display_none");
            $("#btnBackTemp").removeClass("display_none");
        });
    }
    function btnDeleteTemplate_onclick() {
        if (!SysSession.CurrentPrivileges.Remove)
            return;
        Clear();
        sys.FindKey(Modules.JournalVoucher, "btnLoadTemplate", "COMP_CODE=" + compcode, function () {
            var TemplateID = SearchGrid.SearchDataGrid.SelectedKey;
            WorningMessage("هل تريد حذف النموذج  ", "Do you want to delete?", "تحذير", "worning", function () {
                Ajax.Callsync({
                    type: "GET",
                    url: sys.apiUrl("GLTrVoucher", "DeleteJournalTemplateMasterDetail"),
                    data: { TemplateID: TemplateID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
                    success: function (d) {
                        var result = d;
                        if (result.IsSuccess == true) {
                            DisplayMassage("تم حذف  النموذج  ", '(success)', MessageType.Succeed);
                        }
                        else {
                            DisplayMassage("هناك خطــأ ", '(Error)', MessageType.Error);
                        }
                    }
                });
            });
        });
    }
    function btnBackTemp_onclick() {
        //$(".BtnHide").show();
        $(".BtnHide").removeAttr("disabled");
        HideButtons();
        $("#btnSaveTemp").addClass("display_none");
        $("#btnBackTemp").addClass("display_none");
        TempFlagAddOrEdit = 0;
        if (FlagAddOrEdit == 1) { //Insert
            btnAdd_onclick();
        }
        else if (FlagAddOrEdit == 2) { //update
            GridRowDoubleClick();
            btnUpdate_onclick();
        }
        $("#txtTempName").attr("disabled", "disabled");
        GlobalTemplateID = 0;
    }
    function btnTempSave_onclick() {
        if (!TempValidation())
            return;
        AssignTemp();
        if (TempFlagAddOrEdit == 1) {
            InsertTemp();
        }
        else {
            UpdateTemp();
            GlobalTemplateID = 0;
        }
        //$("#divTemplateData :input").attr("disabled", "disabled");
        //$(".BtnHide").show();
        //$("#divFilter").removeClass("disabledDiv");
        //$("#divGridShow").removeClass("disabledDiv");
        //DisableControls();
        //$("#divJournalDetail").addClass("display_none");
    }
    function TempValidation() {
        var newCount = 0;
        for (var i = 0; i < CountGrid; i++) {
            if ($("#txt_StatusFlag" + i).val() != "d" && $("#txt_StatusFlag" + i).val() != "m") {
                newCount++;
            }
        }
        if (txtTempName.value == "") {
            DisplayMassage('برجاء ادخال اسم النموذج', 'Please Enter Template Name', MessageType.Error);
            Errorinput(txtTempName);
            return false;
        }
        else if (rdSaveDesc.checked == false && rdSaveValue.checked == false) {
            DisplayMassage('برجاء اختيار نوع الحفظ', 'Please Choose Save Type', MessageType.Error);
            Errorinput(rdSaveDesc);
            Errorinput(rdSaveValue);
            return false;
        }
        else if (newCount == 0) {
            DisplayMassage('يجب ادخال تفاصيل النموذج', 'you must Add Template Details', MessageType.Error);
            return false;
        }
        return true;
    }
    function AssignTemp() {
        TempMasterDetailModel = new VchrTemplatMasterDetail();
        TempHeaderModel = new A_TR_VchrTemplate();
        TempDetailModel = new Array();
        // Header Data
        if (TempFlagAddOrEdit == 2) {
            TempHeaderModel.VOUCHER_CODE = Number(txtTempNumber.value);
        }
        TempHeaderModel.COMP_CODE = Number(SysSession.CurrentEnvironment.CompCode);
        TempHeaderModel.TEMPLATE_DESC = txtTempName.value;
        if (rdSaveDesc.checked == true) {
            TempHeaderModel.VOUCHER_DESC = txtJournalDescripton.value;
        }
        else {
            TempHeaderModel.VOUCHER_DESC = "";
        }
        if (rdSaveValue.checked == true) {
            TempHeaderModel.IsSaveValue = true;
        }
        //if (rdNew.checked == true) { TempHeaderModel.VOUCHER_TYPE = 0; }
        //else if (rdAuthorized.checked == true) { TempHeaderModel.VOUCHER_TYPE = 1; }
        //else if (rdPosted.checked == true) { TempHeaderModel.VOUCHER_TYPE = 2; }
        TempHeaderModel.VOUCHER_TYPE = 1;
        TempHeaderModel.TYPE_CODE = Number(ddlJournalType.value);
        var StatusFlag;
        // Details
        for (var i = 0; i < CountGrid; i++) {
            TempDetailSingleModel = new A_TR_VchrTemplateDetail();
            if (TempFlagAddOrEdit == 1) {
                StatusFlag = "i";
            }
            else {
                StatusFlag = $("#txt_StatusFlag" + i).val();
            }
            $("#txt_StatusFlag" + i).val("");
            TempDetailSingleModel.COMP_CODE = Number(SysSession.CurrentEnvironment.CompCode);
            TempDetailSingleModel.StatusFlag = StatusFlag.toString();
            if (StatusFlag == "i") {
                TempDetailSingleModel.VoucherDetailID = 0;
                TempDetailSingleModel.VOUCHER_SERIAL = $("#txtSerial" + i).val();
                TempDetailSingleModel.ACC_CODE = $("#txtAccNumber" + i).val();
                TempDetailSingleModel.CC_CODE = $("#txtCostCntrNum" + i).val();
                if (rdSaveValue.checked == true) {
                    TempDetailSingleModel.DEBIT = $("#txtDebit" + i).val();
                    TempDetailSingleModel.CREDIT = $("#txtCredit" + i).val();
                }
                else {
                    TempDetailSingleModel.DEBIT = 0;
                    TempDetailSingleModel.CREDIT = 0;
                }
                TempDetailSingleModel.DESCL = $("#Notes" + i).val();
                TempDetailSingleModel.DESCA = $("#Notes" + i).val();
                TempDetailSingleModel.CCDT_CODE = $("#txtCCDtCostCntrNum" + i).val();
                TempDetailModel.push(TempDetailSingleModel);
            }
            else if (StatusFlag == "u") {
                TempDetailSingleModel.VoucherDetailID = Number($("#VoucherDetailID" + i).val());
                TempDetailSingleModel.VOUCHER_SERIAL = $("#txtSerial" + i).val();
                TempDetailSingleModel.ACC_CODE = $("#txtAccNumber" + i).val();
                TempDetailSingleModel.CC_CODE = $("#txtCostCntrNum" + i).val();
                if (rdSaveValue.checked == true) {
                    TempDetailSingleModel.DEBIT = $("#txtDebit" + i).val();
                    TempDetailSingleModel.CREDIT = $("#txtCredit" + i).val();
                }
                else {
                    TempDetailSingleModel.DEBIT = 0;
                    TempDetailSingleModel.CREDIT = 0;
                }
                TempDetailSingleModel.DESCL = $("#Notes" + i).val();
                TempDetailSingleModel.DESCA = $("#Notes" + i).val();
                TempDetailSingleModel.CCDT_CODE = $("#txtCCDtCostCntrNum" + i).val();
                TempDetailModel.push(TempDetailSingleModel);
            }
            else if (StatusFlag == "d") {
                if (TempFlagAddOrEdit == 2) {
                    var deletedID = Number($("#VoucherDetailID" + i).val());
                    TempDetailSingleModel.VoucherDetailID = deletedID;
                    TempDetailModel.push(TempDetailSingleModel);
                }
            }
        }
        TempMasterDetailModel.A_TR_VchrTemplate = TempHeaderModel;
        TempMasterDetailModel.A_TR_VchrTemplateDetail = TempDetailModel;
        TempMasterDetailModel.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
        TempMasterDetailModel.UserCode = SysSession.CurrentEnvironment.UserCode;
    }
    function InsertTemp() {
        TempMasterDetailModel.A_TR_VchrTemplate.CREATED_BY = SysSession.CurrentEnvironment.UserCode;
        TempMasterDetailModel.A_TR_VchrTemplate.CREATED_AT = DateTimeFormat(Date().toString());
        TempMasterDetailModel.A_TR_VchrTemplate.TemplateID = 0;
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("GLTrVoucher", "InsertJournalTemplateMasterDetail"),
            data: JSON.stringify(TempMasterDetailModel),
            success: function (d) {
                var result = d;
                if (result.IsSuccess == true) {
                    var res = result.Response;
                    DisplayMassage("تم اصدار  نموذج رقم " + res.VOUCHER_CODE, '(success)', MessageType.Succeed);
                    txtTempNumber.value = res.VOUCHER_CODE.toString();
                    GlobalTemplateID = res.TemplateID;
                    //btnBackTemp_onclick();
                    $(".BtnHide").removeAttr("disabled");
                    HideButtons();
                    $("#btnSaveTemp").addClass("display_none");
                    $("#btnBackTemp").addClass("display_none");
                    $("#txtTempName").attr("disabled", "disabled");
                    $("#txtTempName").val("");
                    $("#txtTempNumber").val("");
                    rdSaveDesc.checked = false;
                    rdSaveValue.checked = false;
                    rdSaveDesc.disabled = true;
                    rdSaveValue.disabled = true;
                }
                else {
                    DisplayMassage("هناك خطــأ ", '(Error)', MessageType.Error);
                }
            }
        });
    }
    function UpdateTemp() {
        TempMasterDetailModel.A_TR_VchrTemplate.UPDATED_BY = SysSession.CurrentEnvironment.UserCode;
        TempMasterDetailModel.A_TR_VchrTemplate.UPDATED_AT = DateTimeFormat(Date().toString());
        TempMasterDetailModel.A_TR_VchrTemplate.TemplateID = GlobalTemplateID;
        TempMasterDetailModel.A_TR_VchrTemplate.VOUCHER_CODE = selectedTemplateModel.VOUCHER_CODE;
        // creation
        TempMasterDetailModel.A_TR_VchrTemplate.CREATED_BY = selectedTemplateModel.CREATED_BY;
        TempMasterDetailModel.A_TR_VchrTemplate.CREATED_AT = selectedTemplateModel.CREATED_AT;
        // updated
        if (selectedTemplateModel.UPDATED_BY != null) {
            TempMasterDetailModel.A_TR_VchrTemplate.UPDATED_BY = selectedTemplateModel.UPDATED_BY;
            TempMasterDetailModel.A_TR_VchrTemplate.UPDATED_AT = selectedTemplateModel.UPDATED_AT;
        }
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("GLTrVoucher", "UpdateJournalTemplateMasterDetail"),
            data: JSON.stringify(TempMasterDetailModel),
            success: function (d) {
                var result = d;
                if (result.IsSuccess == true) {
                    var res = result.Response;
                    DisplayMassage("تم تعديل  نموذج رقم " + res.VOUCHER_CODE, "Model No. has been modified " + res.VOUCHER_CODE, MessageType.Succeed);
                    btnBackTemp_onclick();
                }
                else {
                    DisplayMassage("هناك خطــأ ", '(there is a mistake)', MessageType.Error);
                }
            }
        });
    }
    function GetTemplateByID() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GLTrVoucher", "GetTemplateByID"),
            data: { TemplateId: GlobalTemplateID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    TempHeaderWithDetail = result.Response;
                    TempshowFlag = true;
                    showFlag = false;
                    Clear();
                    $("#divJournalDetail").removeClass("display_none");
                    selectedTemplateModel = TempHeaderWithDetail.A_TR_VchrTemplate;
                    GlobalTemplateID = Number(selectedTemplateModel.TemplateID);
                    txtTempNumber.value = selectedTemplateModel.VOUCHER_CODE.toString();
                    txtJournalDescripton.value = selectedTemplateModel.VOUCHER_DESC;
                    txtTempName.value = selectedTemplateModel.TEMPLATE_DESC;
                    if (selectedTemplateModel.IsSaveValue == true) {
                        rdSaveValue.checked = true;
                    }
                    rdSaveDesc.checked = true;
                    if (selectedTemplateModel.TYPE_CODE != null)
                        ddlJournalType.value = selectedTemplateModel.TYPE_CODE.toString();
                    // creation
                    txtCreatedBy.value = selectedTemplateModel.CREATED_BY;
                    txtCreatedAt.value = selectedTemplateModel.CREATED_AT;
                    // Edit
                    if (selectedTemplateModel.UPDATED_BY != null) {
                        txtUpdatedBy.value = selectedTemplateModel.UPDATED_BY;
                        txtUpdatedAt.value = selectedTemplateModel.UPDATED_AT;
                    }
                    TemplateDetailModelFiltered = new Array();
                    TemplateDetailModelFiltered = TempHeaderWithDetail.A_TR_VchrTemplateDetail.filter(function (s) { return s.TemplateID == GlobalTemplateID; });
                    var fragment = document.createDocumentFragment();
                    for (var i = 0; i < TemplateDetailModelFiltered.length; ++i) {
                        fragment.appendChild(BuildControlsGrid(i)); // Append to the DocumentFragment
                    }
                    document.getElementById("div_Data").appendChild(fragment); // Append the DocumentFragment to the div
                    // costCenter Type 
                    if (VoucherCCType == 0) {
                        $(".ccType").hide();
                    }
                    // costCenterCCDT Type
                    if (VoucherCCDtType == 1) {
                        $(".ccTypeBranch").show();
                    }
                    else {
                        $(".ccTypeBranch").hide();
                    }
                    var show2 = $(".costcntr").is(":visible");
                    //var show2 = $(".Acc").is(":visible");
                    if (show2 == false) {
                        $(".costcntr").addClass("display_none");
                    }
                    else {
                        $(".costcntr").removeClass("display_none");
                    }
                    var show1 = $(".Acc").is(":visible");
                    //var show2 = $(".Acc").is(":visible");
                    if (show1 == false) {
                        $(".Acc").addClass("display_none");
                    }
                    else {
                        $(".Acc").removeClass("display_none");
                    }
                    var show3 = $(".costcntrCCDt").is(":visible");
                    //var show2 = $(".Acc").is(":visible");
                    if (show3 == false) {
                        $(".costcntrCCDt").addClass("display_none");
                    }
                    else {
                        $(".costcntrCCDt").removeClass("display_none");
                    }
                    CountGrid = TemplateDetailModelFiltered.length;
                    ComputeTotals();
                    $('#Loading_Div').html('');
                    EnableControls();
                }
            }
        });
    }
    //----------------------------------------------------( Report )
    function PrintReport(OutType) {
        var rp = new ReportParameters();
        rp.CompCode = SysSession.CurrentEnvironment.CompCode;
        rp.BranchCode = SysSession.CurrentEnvironment.BranchCode;
        rp.CompNameA = SysSession.CurrentEnvironment.CompanyNameAr;
        rp.CompNameE = SysSession.CurrentEnvironment.CompanyName;
        rp.UserCode = SysSession.CurrentEnvironment.UserCode;
        rp.Tokenid = SysSession.CurrentEnvironment.Token;
        rp.BraNameA = SysSession.CurrentEnvironment.BranchName;
        rp.BraNameE = SysSession.CurrentEnvironment.BranchNameEn;
        rp.ScreenLanguage = SysSession.CurrentEnvironment.ScreenLanguage;
        rp.SystemCode = SysSession.CurrentEnvironment.SystemCode;
        rp.SubSystemCode = SysSession.CurrentEnvironment.SubSystemCode;
        if (rp.BraNameA == null || rp.BraNameE == null) {
            rp.BraNameA = " ";
            rp.BraNameE = " ";
        }
        rp.LoginUser = SysSession.CurrentEnvironment.UserCode;
        rp.RepType = OutType; //output report as View
        rp.FromDate = DateFormatRep(txtFromDate.value);
        rp.ToDate = DateFormatRep(txtToDate.value);
        if ($("#ddlStatusFilter").val() == "0") //------------- جديد
         {
            rp.Status = 0;
        }
        else if ($("#ddlStatusFilter").val() == "1") //-------------مصدق
         {
            rp.Status = 1;
        }
        else if ($("#ddlStatusFilter").val() == "2") { //-------------مرحل
            rp.Status = 2;
        }
        else //-------------الجميع 
         {
            rp.Status = 3;
        }
        if ($("#ddlVoucherSourceFilter").val() == "null") { //------------- جميع  المصادر  
            rp.VchrSource = -1;
        }
        else {
            rp.VchrSource = $("#ddlVoucherSourceFilter").val();
        }
        if ($("#ddlVoucherTypeFilter").val() == "null") { //------------- جميع  الانواع  
            rp.VchrType = -1;
        }
        else {
            rp.VchrType = $("#ddlVoucherTypeFilter").val();
        }
        Ajax.Callsync({
            url: Url.Action("AProc_Rpt_JournalVoucherList", "GeneralReports"),
            data: rp,
            success: function (d) {
                var result = d.result;
                PrintReportLog(rp.UserCode, rp.CompCode, rp.BranchCode, Modules.JournalVoucher, SysSession.CurrentEnvironment.CurrentYear);
                window.open(result, "_blank");
            }
        });
    }
    function btnPrintTransaction_onclick() {
        var rp = new ReportParameters();
        rp.RepType = 0;
        rp.TRId = GlobalVoucherID;
        rp.Name_function = "AProc_Prnt_JournalVoucher";
        localStorage.setItem("Report_Data", JSON.stringify(rp));
        localStorage.setItem("result", '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>');
        window.open(Url.Action("ReportsPopup", "Home"), "_blank");
        PrintTransactionLog(rp.UserCode, rp.CompCode, rp.BranchCode, Modules.JournalVoucher, SysSession.CurrentEnvironment.CurrentYear, rp.TRId.toString());
    }
})(JournalVoucherNew || (JournalVoucherNew = {}));
//# sourceMappingURL=JournalVoucherNew.js.map