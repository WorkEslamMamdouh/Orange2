$(document).ready(function () {
    LnkVoucher.InitalizeComponent();
});
var LnkVoucher;
(function (LnkVoucher) {
    var sys = new SystemTools();
    var SysSession = GetSystemSession(Modules.AccTrReceiptNoteNew);
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);
    var TrType = 1;
    var codeType = "RecType";
    var Name_Screen = (lang == "ar" ? ' ربط القيود' : 'LnkVoucher');
    var CompCode = Number(SysSession.CurrentEnvironment.CompCode);
    var BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);
    var TransactionsGrid = new JsGrid();
    var LnkTransDetails = new Array();
    var Model = new A_RecPay_Tr_ReceiptNote();
    var AccountDetails = new A_ACCOUNT();
    var AccountDetailsIst = new Array();
    var CostCentreDetailsIst = new Array();
    var CostCenterDetails = new G_COST_CENTER();
    var txtSearch;
    var txtTrDate;
    var txtFromDate;
    var txtToDate;
    var txtFromNumber;
    var txtToNumber;
    var ddlBranch;
    var ddlTypeTrans;
    var btnBack;
    var btnShow;
    var btnAdd;
    var btnUpdate;
    var btnSave;
    var btnAddDetails;
    //////////////////////////////////////////print buttons////////////////////////////////////////////     
    var btnPrintTrview;
    var btnPrintTrPDF;
    var btnPrintTrEXEL;
    var btnPrintTransaction;
    var Events = 0;
    var CountGrid = 0;
    function InitalizeComponent() {
        document.getElementById('Screen_name').innerHTML = Name_Screen;
        $('#btnAdd').addClass('hidden_Control');
        InitalizeControls();
        InitalizeEvents();
        InitializeGrid();
        txtFromDate.value = DateStartMonth();
        txtToDate.value = ConvertToDateDash(GetDate()) <= ConvertToDateDash(SysSession.CurrentEnvironment.EndDate) ? GetDate() : SysSession.CurrentEnvironment.EndDate;
        GetData_Header();
    }
    LnkVoucher.InitalizeComponent = InitalizeComponent;
    function InitalizeControls() {
        btnShow = document.getElementById("btnShow");
        btnAdd = document.getElementById("btnAdd");
        btnUpdate = document.getElementById("btnUpdate");
        btnSave = document.getElementById("btnSave");
        btnBack = document.getElementById("btnBack");
        btnAddDetails = document.getElementById("btnAddDetails");
        ////////  
        ddlBranch = document.getElementById("ddlBranch");
        ddlTypeTrans = document.getElementById("ddlTypeTrans");
        ////////        
        txtTrDate = document.getElementById("txtTrDate");
        txtSearch = document.getElementById("txtSearch");
        txtFromDate = document.getElementById("txtFromDate");
        txtToDate = document.getElementById("txtToDate");
        txtFromNumber = document.getElementById("txtFromNumber");
        txtToNumber = document.getElementById("txtToNumber");
        //print 
        btnPrintTrview = document.getElementById("btnPrintTrview");
        btnPrintTrPDF = document.getElementById("btnPrintTrPDF");
        btnPrintTrEXEL = document.getElementById("btnPrintTrEXEL");
        btnPrintTransaction = document.getElementById("btnPrintTransaction");
    }
    function InitalizeEvents() {
        //********************************Btn****************************
        btnShow.onclick = btnShow_onclick;
        btnAdd.onclick = btnAdd_onclick;
        btnSave.onclick = btnSave_onClick;
        btnBack.onclick = btnBack_onclick;
        btnUpdate.onclick = btnUpdate_onclick;
        btnAddDetails.onclick = AddNewRow;
        //********************************onchange****************************    
        txtSearch.onkeyup = _SearchBox_Change;
        ddlTypeTrans.onchange = function () { Back(); $('#divGridShow').addClass('display_none'); $('#Div_control').addClass('display_none'); };
        //*******************************print*****************************
        btnPrintTrview.onclick = function () { PrintReport(1); };
        btnPrintTrPDF.onclick = function () { PrintReport(2); };
        btnPrintTrEXEL.onclick = function () { PrintReport(3); };
        btnPrintTransaction.onclick = PrintTransaction;
        clickEventsVisible();
    }
    function InitializeGrid() {
        var res = GetResourceList("");
        TransactionsGrid.ElementName = "TransactionsGrid";
        TransactionsGrid.OnRowDoubleClicked = GridDoubleClick;
        TransactionsGrid.PrimaryKey = "TRID";
        TransactionsGrid.Paging = true;
        TransactionsGrid.PageSize = 15;
        TransactionsGrid.Sorting = true;
        TransactionsGrid.InsertionMode = JsGridInsertionMode.Binding;
        TransactionsGrid.Editing = false;
        TransactionsGrid.Inserting = false;
        TransactionsGrid.SelectedIndex = 1;
        TransactionsGrid.OnItemEditing = function () { };
        TransactionsGrid.Columns = [
            { title: "TRID", name: "TRID", type: "text", width: "5%", visible: false },
            { title: res.TransTrType, name: "TR_CODE", type: "text", width: "5%", visible: false },
            { title: res.App_Number, name: "TR_NO", type: "text", width: "5%" },
            //{ title: res.App_date, name: "TR_DATE", type: "text", width: "8%" },
            {
                title: res.App_date, css: "ColumPadding", name: "TR_DATE", width: "8%",
                itemTemplate: function (s, item) {
                    var txt = document.createElement("label");
                    txt.innerHTML = DateFormat(item.TR_DATE);
                    return txt;
                }
            },
            { title: 'الحركة', name: (lang == "ar" ? "TR_DESCA" : "TR_DESCE"), type: "text", width: "10%" },
            { title: "النوع", name: "VOUCHER_SOURCE_TYPE", type: "text", width: "15%" },
            { title: res.value, name: "TR_AMOUNT", type: "text", width: "5%" },
            { title: res.TransDesc, name: (lang == "ar" ? "VOUCHER_DESCA" : "VOUCHER_DESCE"), type: "text", width: "20%" },
            //{ title: res.Trans_Generate, name: "IsGeneratedDesc", type: "text", width: "4%" },
            {
                title: res.Trans_Generate, css: "ColumPadding", name: "IsGenerated", width: "4%",
                itemTemplate: function (s, item) {
                    var txt = document.createElement("label");
                    txt.innerHTML = item.IsPosted == true ? (lang == "ar" ? "تم" : "Done") : "";
                    return txt;
                }
            },
        ];
        TransactionsGrid.Bind();
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
    //************************************************fillddl**************************************
    function GetData_Header() {
        var Table;
        Table =
            [
                { NameTable: 'G_BRANCH', Condition: " COMP_CODE = " + CompCode + " " },
                { NameTable: 'GQ_GetLnkTransComp', Condition: " COMP_CODE = " + CompCode + " and INTEGRATE = 1 and Comp_INTEGRATE = 1 order by  SUB_SYSTEM_CODE Asc ,TR_CODE Asc " },
                { NameTable: 'A_ACCOUNT', Condition: " COMP_CODE = " + CompCode + " " },
                { NameTable: 'G_COST_CENTER', Condition: " COMP_CODE = " + CompCode + " " },
            ];
        DataResult(Table);
        //**************************************************************************************************************
        DocumentActions.FillCombowithdefult(GetDataTable('G_BRANCH'), ddlBranch, "BRA_CODE", "BRA_DESC", (lang == "ar" ? ' اختر الفرع' : 'Branch'));
        DocumentActions.FillCombowithdefult(GetDataTable('GQ_GetLnkTransComp'), ddlTypeTrans, "TR_CODE", "TR_DESCA", (lang == "ar" ? ' اختر الحركة' : 'TypeTrans'));
        ddlBranch.value = $('#ddbra').val();
        AccountDetailsIst = GetDataTable('A_ACCOUNT');
        CostCentreDetailsIst = GetDataTable('G_COST_CENTER');
    }
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
    //************************************************Btn_Events**********************************
    function btnShow_onclick() {
        if (ddlBranch.value == 'null') {
            DisplayMassage("يجب أختيار الفرع", "The type of movement must be selected", MessageType.Error);
            Errorinput(ddlBranch);
            return;
        }
        if (ddlTypeTrans.value == 'null') {
            DisplayMassage("يجب أختيار نوع الحركة", "The type of movement must be selected", MessageType.Error);
            Errorinput(ddlTypeTrans);
            return;
        }
        var branchCode = Number(ddlBranch.value);
        var trType = "" + ddlTypeTrans.value + ",";
        var StartDate = DateFormatRep(txtFromDate.value);
        var EndDate = DateFormatRep(txtToDate.value);
        var FromNum = 0;
        var ToNum = 0;
        if (txtFromNumber.value != "") {
            FromNum = Number(txtFromNumber.value);
        }
        if (txtToNumber.value != "") {
            ToNum = Number(txtToNumber.value);
        }
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("TranPosting", "LoadLnkVouchTransactions"),
            data: {
                Comp: CompCode, branchCode: branchCode, TrType: trType, StartDate: StartDate, EndDate: EndDate, FromNum: FromNum, ToNum: ToNum, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token, Modules: Modules.TranPosting, FinYear: SysSession.CurrentEnvironment.CurrentYear
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    debugger;
                    LnkTransDetails = result.Response;
                    if (LnkTransDetails.length > 0) {
                        LnkTransDetails = LnkTransDetails.filter(function (x) { return x.TR_NO != null; }).sort(function (a, b) { return a.TR_NO - b.TR_NO; });
                        TransactionsGrid.DataSource = LnkTransDetails;
                        TransactionsGrid.Bind();
                        $('#divGridShow').removeClass('display_none');
                        $('#Div_control').addClass('display_none');
                    }
                    else {
                        TransactionsGrid.DataSource = LnkTransDetails;
                        TransactionsGrid.Bind();
                        DisplayMassage("لا يوجد حركات", "There are no moves here", MessageType.Error);
                    }
                }
            }
        });
    }
    function btnAdd_onclick() {
        CleanDetails();
        Enabled();
    }
    function btnSave_onClick() {
        loading('btnSave');
        setTimeout(function () {
            finishSave('btnSave');
            if (!Validation()) {
                return;
            }
            $("#txtUpdatedBy").val(SysSession.CurrentEnvironment.UserCode);
            $("#txtUpdatedAt").val(DateTimeFormat(Date().toString()));
            Assign();
            //Update();
        }, 100);
    }
    function btnBack_onclick() {
        GridDoubleClick();
    }
    function btnUpdate_onclick() {
        Enabled();
    }
    function _SearchBox_Change() {
        $("#TransactionsGrid").jsGrid("option", "pageIndex", 1);
        if (txtSearch.value != "") {
            var search_1 = txtSearch.value.toLowerCase();
            var SearchDetails = LnkTransDetails.filter(function (x) { return x.TR_NO.toString().search(search_1) >= 0 || x.VOUCHER_DESCA.toLowerCase().search(search_1) >= 0 || x.TR_DESCA.toLowerCase().search(search_1) >= 0; });
            TransactionsGrid.DataSource = SearchDetails;
            TransactionsGrid.Bind();
        }
        else {
            TransactionsGrid.DataSource = LnkTransDetails;
            TransactionsGrid.Bind();
        }
    }
    //****************************************************CleanInput********************************************* 
    function Enabled() {
        $('._dis').removeAttr('disabled');
        $('.btn_minus_non').removeClass('display_none');
        $('#id_div_Filter').addClass('disabledDiv');
        $('._None_Input').removeClass('display_none');
    }
    function disabled() {
        $('._dis').attr('disabled', 'disabled');
        $('#id_div_Filter').removeClass('disabledDiv');
        $('._None_Input').addClass('display_none');
        $('.btn_minus_non').addClass('display_none');
    }
    function CleanDetails() {
        $('#Div_control').removeClass('display_none');
        $("#Div_control :input").val("");
        txtTrDate.value = GetDate();
        //chkStatus.checked = false; 
    }
    //****************************************************DisplayData*********************************************
    function GridDoubleClick() {
        CleanDetails();
        DisplayData(TransactionsGrid.SelectedItem);
        disabled();
    }
    function DisplayData(Selecteditem) {
        DocumentActions.RenderFromModel(Selecteditem);
        txtTrDate.value = DateFormat(Selecteditem.TR_DATE);
        DisplayDetails(59212);
    }
    function DisplayDetails(TrID) {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("TranPosting", "GetLnkVoucherById"),
            data: { TrID: TrID, CompCode: CompCode, branchCode: BranchCode },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    var List = result.Response;
                    CountGrid = 0;
                    $("#div_Data").html('');
                    for (var i = 0; i < List.length; i++) {
                        BuildControls(i);
                        DisplayBuildControls(List[i], i);
                        CountGrid++;
                    }
                }
            }
        });
    }
    ////**************************************************** Controls Grid Region //****************************************************
    function BuildControls(cnt) {
        var html = "";
        html = "<tr id= \"No_Row" + cnt + "\">\n                    \n\t                <td>\n\t\t                <div class=\"form-group display_none btn_minus_non\">\n\t\t\t                <span id=\"btn_minus" + cnt + "\"><i class=\"fas fa-minus-circle  btn-minusNew\"></i></span> \n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n\t\t\t                <button type=\"button\" class=\"style_ButSearch _dis\"  id=\"btnSearchAcc" + cnt + "\" name=\"ColSearch\" disabled>\n                                <i class=\"fa fa-search\"></i>\n                             </button>\n\t\t                </div>\n\t                </td>\n                     <td style=\"width:9%;\">\n\t\t                <div class=\"form-group\">\n\t\t\t                 <input id=\"Acc_Code" + cnt + "\" value=\"\" name=\"\" disabled type=\"text\" class=\"form-control _dis\" />\n\t\t                </div>\n\t                </td>\n                    <td style=\"width:17%;\" class=\"Acc\">\n\t\t                <div class=\"form-group\">\n\t\t\t                  <input id=\"ACC_DESCA" + cnt + "\" value=\"\" name=\"\" disabled type=\"text\" class=\"form-control\"  />\n\t\t                </div>\n\t                </td>\n                    <td style=\"width:9%;\">\n\t\t                <div class=\"form-group\">\n\t\t\t               <input id=\"Debit" + cnt + "\" name=\"FromDate\" disabled type=\"number\" value=\"\"  min=\"0\" class=\"form-control _dis\" />\n\t\t                </div>\n\t                </td>\n                    <td style=\"width:9%;\">\n\t\t                <div class=\"form-group\">\n\t\t\t               <input id=\"Credit" + cnt + "\" name=\"FromDate\" disabled type=\"number\" value=\"\"  min=\"0\" class=\"form-control _dis\" />\n\t\t                </div>\n\t                </td>\n\n                    <td>\n\t\t                <div class=\"form-group\">\n\t\t\t                <button type=\"button\" class=\"style_ButSearch _dis\"  id=\"btnSearchCostCenter" + cnt + "\" name=\"ColSearch\" disabled>\n                                <i class=\"fa fa-search\"></i>\n                             </button>\n\t\t                </div>\n\t                </td>\n                     <td style=\"width:9%;\">\n\t\t                <div class=\"form-group\">\n\t\t\t                <input id=\"CC_Code" + cnt + "\" name=\"FromDate\" value=\"\" disabled type=\"text\" class=\"form-control _dis\" />\n\t\t                </div>\n\t                </td>\n                    <td style=\"width:17%;\" class=\"costcntr\">\n\t\t                <div class=\"form-group\">\n\t\t\t                  <input id=\"CC_DESCA" + cnt + "\" name=\"FromDate\" value=\"\" disabled type=\"text\" class=\"form-control\" />\n\t\t                </div>\n\t                </td>\n\n                    \n                    <td style=\"width:22%;\">\n\t\t                <div class=\"form-group\">\n\t\t\t              <input id=\"Line_DescA" + cnt + "\" name=\"FromDate\" value=\"\" disabled type=\"text\" class=\"form-control _dis\" />\n\t\t                </div>\n\t                </td>\n                    \n                  \n                    <input id=\"StatusFlag" + cnt + "\" name = \" \" value=\"\" type = \"hidden\" class=\"form-control\"/>\n\n                   <input id=\"ID" + cnt + "\" type=\"hidden\" value=\"\" class=\"form-control \"  />\n                     <input id=\"CompCode" + cnt + "\" type=\"hidden\" value=\"\" class=\"form-control \"  />\n                     <input id=\"bracode" + cnt + "\" type=\"hidden\" value=\"\" class=\"form-control \"  />\n                     <input id=\"System_Code" + cnt + "\" type=\"hidden\" value=\"\" class=\"form-control \"  />\n                     <input id=\"Tr_Code" + cnt + "\" type=\"hidden\" value=\"\" class=\"form-control \"  />\n                     <input id=\"TrID" + cnt + "\" type=\"hidden\" value=\"\" class=\"form-control \"  />\n                     <input id=\"TrNo" + cnt + "\" type=\"hidden\" value=\"\" class=\"form-control \"  />\n                    <input id=\"Serial" + cnt + "\"  type=\"hidden\" value=\"\" class=\"form-control\" />\n                    <input id=\"Voucher_No" + cnt + "\" type=\"hidden\" value=\"\" class=\"form-control\" /> \n                    <input id=\"Line_DescAE" + cnt + "\" type=\"hidden\" value=\"\" class=\"form-control\" />\n                    <input id=\"SOURCE_TYPE" + cnt + "\" type=\"hidden\" value=\"\" class=\"form-control\" />\n                    <input id=\"TYPE_CODE" + cnt + "\" type=\"hidden\" value=\"\" class=\"form-control\" />\n                    <input id=\"TR_DESCA" + cnt + "\" type=\"hidden\" value=\"\" class=\"form-control\" />\n                    <input id=\"TR_DESCE" + cnt + "\" type=\"hidden\" value=\"\" class=\"form-control\" />\n                    <input id=\"Src_DescA" + cnt + "\" type=\"hidden\" value=\"\" class=\"form-control\" />\n                    <input id=\"TYPE_DESCA" + cnt + "\" type=\"hidden\" value=\"\" class=\"form-control\" />\n                    <input id=\"TYPE_DESCE" + cnt + "\" type=\"hidden\" value=\"\" class=\"form-control\" />\n                    <input id=\"TrDate" + cnt + "\" type=\"hidden\" value=\"\" class=\"form-control\" />\n                </tr>";
        $("#div_Data").append(html);
        $('#btnSearchAcc' + cnt).click(function (e) {
            var sys = new SystemTools();
            sys.FindKey(Modules.JournalVoucher, "btnAccountSearch", "COMP_CODE=" + CompCode + "and ACC_ACTIVE = 1 and DETAIL =1  ", function () {
                var id = SearchGrid.SearchDataGrid.SelectedKey;
                $('#Acc_Code' + cnt).val(id);
                if (GetAccByCode(id)) {
                    $('#ACC_DESCA' + cnt).val((lang == "ar" ? AccountDetails.ACC_DESCA : AccountDetails.ACC_DESCL));
                    $('#txtAccountNameFooter').val((lang == "ar" ? AccountDetails.ACC_DESCA : AccountDetails.ACC_DESCL));
                }
                if ($("#StatusFlag" + cnt).val() != "i")
                    $("#StatusFlag" + cnt).val("u");
            });
        });
        $("#Acc_Code" + cnt).on('change', function () {
            if ($("#StatusFlag" + cnt).val() != "i")
                $("#StatusFlag" + cnt).val("u");
            var id = $('#Acc_Code' + cnt).val();
            if (GetAccByCode(id)) {
                if (AccountDetails != null) {
                    $('#ACC_DESCA' + cnt).val((lang == "ar" ? AccountDetails.ACC_DESCA : AccountDetails.ACC_DESCL));
                    $('#txtAccountNameFooter').val((lang == "ar" ? AccountDetails.ACC_DESCA : AccountDetails.ACC_DESCL));
                    $("#divAccountNameFooter").removeClass("display_none");
                }
                else {
                    $('#Acc_Code' + cnt).val("");
                    $('#ACC_DESCA' + cnt).val("");
                    $('#txtAccountNameFooter').val("");
                    $('#Credit' + cnt).val("");
                    DisplayMassage("رقم الحساب غير صحيح ", "Wrong Account number ", MessageType.Error);
                }
            }
            else {
                $('#Acc_Code' + cnt).val("");
                $('#ACC_DESCA' + cnt).val("");
                $('#txtAccountNameFooter').val("");
                $('#Credit' + cnt).val("");
                DisplayMassage("رقم الحساب غير صحيح ", "Wrong Account number ", MessageType.Error);
            }
        });
        //// Second Search
        $('#btnSearchCostCenter' + cnt).click(function (e) {
            var sys = new SystemTools();
            sys.FindKey(Modules.JournalVoucher, "btnCostCenterSearch", "COMP_CODE=" + CompCode + "and ACTIVE = 1 ", function () {
                var id = SearchGrid.SearchDataGrid.SelectedKey;
                $('#CC_Code' + cnt).val(id);
                GetCostCenterByCode(id);
                $('#CC_DESCA' + cnt).val((lang == "ar" ? CostCenterDetails.CC_DESCA : CostCenterDetails.CC_DESCE));
                $('#CC_DESCAFooter').val((lang == "ar" ? CostCenterDetails.CC_DESCA : CostCenterDetails.CC_DESCE));
                if ($("#StatusFlag" + cnt).val() != "i")
                    $("#StatusFlag" + cnt).val("u");
            });
        });
        $("#CC_Code" + cnt).on('change', function () {
            if ($("#StatusFlag" + cnt).val() != "i")
                $("#StatusFlag" + cnt).val("u");
            var id = $('#CC_Code' + cnt).val();
            if (GetCostCenterByCode(id)) {
                $('#CC_DESCA' + cnt).val((lang == "ar" ? CostCenterDetails.CC_DESCA : CostCenterDetails.CC_DESCE));
                $('#CC_DESCAFooter').val((lang == "ar" ? CostCenterDetails.CC_DESCA : CostCenterDetails.CC_DESCE));
                $("#divCostCntrNameFooter").removeClass("display_none");
            }
            else {
                $('#CC_Code' + cnt).val("");
                $('#CC_DESCA' + cnt).val("");
                $('#CC_DESCAFooter').val("");
                //  $("#divCostCntrNameFooter").addClass("display_none"); 
                DisplayMassage("مركز التكلفة غير صحيح ", "Wrong Cost Center ", MessageType.Error);
            }
        });
        //Depit on change  
        $("#Debit" + cnt).on('change', function () {
            if ($("#StatusFlag" + cnt).val() != "i")
                $("#StatusFlag" + cnt).val("u");
            var DebitVal = Number($('#Debit' + cnt).val());
            var CreditVal = Number($('#Credit' + cnt).val());
            if (DebitVal == 0) {
                if (CreditVal == 0) {
                    DisplayMassage("يجب اضافه قيمه للمدين او الدائن فقط ", '(The value must be added to the debtor or creditors only)', MessageType.Error);
                    $('#Credit' + cnt).val("0");
                }
            }
            $("#Credit" + cnt).val('0');
            ComputeTotals();
        });
        //Credit on change   
        $("#Credit" + cnt).on('change', function () {
            if ($("#StatusFlag" + cnt).val() != "i")
                $("#StatusFlag" + cnt).val("u");
            var DebitVal = Number($('#Debit' + cnt).val());
            var CreditVal = Number($('#Credit' + cnt).val());
            if (CreditVal == 0) {
                if (DebitVal == 0) {
                    DisplayMassage("يجب اضافه قيمه للمدين او الدائن فقط ", '(The value must be added to the debtor or creditors only)', MessageType.Error);
                    $('#Debit' + cnt).val("0");
                }
            }
            $("#Debit" + cnt).val('0');
            ComputeTotals();
        });
        // Line_DescA change
        $("#Line_DescA" + cnt).on('change', function () {
            if ($("#StatusFlag" + cnt).val() != "i")
                $("#StatusFlag" + cnt).val("u");
        });
        $("#btn_minus" + cnt).on('click', function () {
            DeleteRow(cnt);
        });
        // on click Region to display Account And Cost Centers Names in Footer
        $("#No_Row" + cnt).on('click', function () {
            var AccCodeVal = $('#Acc_Code' + cnt).val();
            var AccObj = AccountDetailsIst.filter(function (s) { return s.COMP_CODE == CompCode && s.ACC_CODE == AccCodeVal; });
            if (AccObj.length > 0) {
                $("#divAccountNameFooter").removeClass("display_none");
                $("#txtAccountNameFooter").prop("value", (lang == "ar" ? AccObj[0].ACC_DESCA : AccObj[0].ACC_DESCL));
            }
            else {
                $("#txtAccountNameFooter").prop("value", "");
            }
            //GetAllCostCenters CostCentreDetailsIst
            var CC_CodeVal = $('#CC_Code' + cnt).val();
            var CCObj = CostCentreDetailsIst.filter(function (s) { return s.COMP_CODE == CompCode && s.CC_CODE == CC_CodeVal; });
            if (CCObj.length > 0) {
                $("#divCostCntrNameFooter").removeClass("display_none");
                $("#CC_DESCAFooter").prop("value", lang == "ar" ? CCObj[0].CC_DESCA : CCObj[0].CC_DESCE);
            }
            else {
                //   $("#divCostCntrNameFooter").addClass("display_none");
                $("#CC_DESCAFooter").prop("value", "");
            }
        });
    }
    function DisplayBuildControls(dataSource, cnt) {
        debugger;
        var properties = Object.getOwnPropertyNames(dataSource);
        for (var _i = 0, properties_1 = properties; _i < properties_1.length; _i++) {
            var property = properties_1[_i];
            debugger;
            $("#" + property + cnt).val(setVal(dataSource[property]));
        }
    }
    function ComputeTotals() {
        var CountItems = 0;
        var PackageCount = 0;
        var txtUnitCosts = 0;
        var CountTotal = 0;
        debugger;
        for (var i = 0; i < CountGrid; i++) {
            var flagvalue = $("#StatusFlag" + i).val();
            if (flagvalue != "d" && flagvalue != "m") {
                PackageCount += Number($("#txtOnhandQty" + i).val());
                txtUnitCosts += (Number($("#txtUnitCost" + i).val()));
                CountTotal += Number($("#txtTotal" + i).val());
                CountItems++;
            }
        }
        $("#txtItemCount").val(CountItems.RoundToSt(2));
        $("#txtPackageCount").val(PackageCount.RoundToSt(2));
        $("#txtUnitCosts").val(txtUnitCosts.RoundToSt(2));
        $("#txtTotal").val(CountTotal.RoundToSt(2));
    }
    function DeleteRow(RecNo) {
        if (!SysSession.CurrentPrivileges.Remove)
            return;
        WorningMessage("هل تريد الحذف؟", "Do you want to delete?", "تحذير", "worning", function () {
            var statusFlag = $("#StatusFlag" + RecNo).val();
            if (statusFlag == "i")
                $("#StatusFlag" + RecNo).val("m");
            else
                $("#StatusFlag" + RecNo).val("d");
            // ComputeTotals();
            $("#txtItemNumber" + RecNo).val("99");
            $("#txtItemName" + RecNo).val("1");
            $("#txtOnhandQty" + RecNo).val("1");
            $("#No_Row" + RecNo).attr("hidden", "true");
        });
    }
    function AddNewRow() {
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
            $("#StatusFlag" + CountGrid).val("i"); //In Insert mode    
            $('._dis').removeAttr('disabled');
            $('.btn_minus_non').removeClass('display_none');
            CountGrid++;
        }
    }
    //****************************************************Validation*********************************************
    function Validation_Grid(rowcount) {
        if ($("#StatusFlag" + rowcount).val() == "d" || $("#StatusFlag" + rowcount).val() == "m") {
            return true;
        }
        else {
            return true;
        }
    }
    function Validation() {
        return true;
    }
    //****************************************************Assign_Data*********************************************
    function Assign() {
        debugger;
        var modle = new AQ_GetLnkVoucher;
        var xx = AssignBuildControls(modle, CountGrid);
        console.log(xx);
        //Model = new A_RecPay_Tr_ReceiptNote();
        //DocumentActions.AssignToModel(Model);//Insert Update
        ////Model.Status = chkStatus.checked == true ? 1 : 0;
        //Model.CustomerID = null;
        //Model.VendorID = null;
        //Model.ExpenseID = null;
        //Model.FromCashBoxID = null;
        //Model.BankAccountCode = null;
        //if (Model.RecPayTypeId == 1) { Model.CustomerID = Number($('#txt_BenIDH').val()) }
        //if (Model.RecPayTypeId == 2) { Model.VendorID = Number($('#txt_BenIDH').val()) }
        //if (Model.RecPayTypeId == 3) { Model.BankAccountCode = $('#txt_BenIDH').val() }
        //if (Model.RecPayTypeId == 4) { Model.ExpenseID = Number($('#txt_BenIDH').val()) }
        //if (Model.RecPayTypeId == 5) { Model.FromCashBoxID = Number($('#txt_BenIDH').val()) }
        //Model.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
        //Model.UserCode = SysSession.CurrentEnvironment.UserCode;
        //Model.CompCode = CompCode;
        //Model.BranchCode = BranchCode;
        //Model.TrType = TrType;
        //Model.TrNo = Number($('#txt_CODE').val());
        //Model.ReceiptID = Number($('#ReceiptID').val());
        //Model.Comp_Code = CompCode.toString();
        //Model.Branch_Code = BranchCode.toString();
        //Model.TrDateH = '1';
    }
    function Update() {
        debugger;
        if (!CheckDate(DateFormat(txtTrDate.value).toString(), DateFormat(SysSession.CurrentEnvironment.StartDate).toString(), DateFormat(SysSession.CurrentEnvironment.EndDate).toString())) {
            WorningMessage("  التاريخ ليس متطابق مع تاريخ المتاح (" + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ")", "Date does not match available date(" + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ")", "تحذير", "worning");
            return;
        }
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("AccTrReceipt", "Update"),
            data: JSON.stringify(Model),
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    var res = result.Response;
                    DisplayMassage("تم التعديل بنجاح", "Success", MessageType.Succeed);
                    Success(res.TRID, res);
                    Save_Succ_But();
                }
                else {
                    DisplayMassage("خطأء", "Error", MessageType.Error);
                }
            }
        });
    }
    function Open() {
        if (!CheckDate(DateFormat(txtTrDate.value).toString(), DateFormat(SysSession.CurrentEnvironment.StartDate).toString(), DateFormat(SysSession.CurrentEnvironment.EndDate).toString())) {
            WorningMessage("  التاريخ ليس متطابق مع تاريخ المتاح (" + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ")", "Date does not match available date(" + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ")", "تحذير", "worning");
            return;
        }
        Assign();
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("AccTrReceipt", "Open"),
            data: JSON.stringify(Model),
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    var res = result.Response;
                    DisplayMassage("تم فك الاعتماد بنجاح", "Success", MessageType.Succeed);
                    Success(res.TRID, res);
                    Save_Succ_But();
                }
                else {
                    DisplayMassage("خطأء", "Error", MessageType.Error);
                }
            }
        });
    }
    function Success(ReceiptID, res) {
        LnkTransDetails = LnkTransDetails.filter(function (x) { return x.TRID != ReceiptID; });
        LnkTransDetails.push(res);
        LnkTransDetails = LnkTransDetails.sort(dynamicSort("TrNo"));
        TransactionsGrid.SelectedItem = res;
        $('#divGridShow').removeClass('display_none');
        $('#Div_control').addClass('display_none');
        TransactionsGrid.DataSource = LnkTransDetails;
        TransactionsGrid.Bind();
        CleanDetails();
        DisplayData(TransactionsGrid.SelectedItem);
        disabled();
    }
    //***************************************************************************Print*********************************************************     
    function PrintReport(OutType) {
        // 
        if (!SysSession.CurrentPrivileges.PrintOut)
            return;
        var rp = new ReportParameters();
        rp.RepType = OutType; //output report as View
        rp.FromDate = DateFormatRep(txtFromDate.value);
        rp.ToDate = DateFormatRep(txtToDate.value);
        rp.CompCode = SysSession.CurrentEnvironment.CompCode;
        rp.BranchCode = SysSession.CurrentEnvironment.BranchCode;
        rp.CompNameA = SysSession.CurrentEnvironment.CompanyNameAr;
        rp.CompNameE = SysSession.CurrentEnvironment.CompanyName;
        rp.UserCode = SysSession.CurrentEnvironment.UserCode;
        rp.Tokenid = SysSession.CurrentEnvironment.Token;
        var BranchNameA = SysSession.CurrentEnvironment.BranchName;
        var BranchNameE = SysSession.CurrentEnvironment.BranchNameEn;
        rp.ScreenLanguage = SysSession.CurrentEnvironment.ScreenLanguage;
        rp.SystemCode = SysSession.CurrentEnvironment.SystemCode;
        rp.SubSystemCode = SysSession.CurrentEnvironment.SubSystemCode;
        if (BranchNameA == null || BranchNameE == null) {
            BranchNameA = " ";
            BranchNameE = " ";
        }
        rp.BraNameA = BranchNameA;
        rp.BraNameE = BranchNameE;
        rp.LoginUser = SysSession.CurrentEnvironment.UserCode;
        Ajax.Callsync({
            url: Url.Action("IProc_Rpt_AccReceiptList", "GeneralReports"),
            data: rp,
            success: function (d) {
                var result = d.result;
                PrintReportLog(SysSession.CurrentEnvironment.UserCode, SysSession.CurrentEnvironment.CompCode, SysSession.CurrentEnvironment.BranchCode, Modules.AccTrReceiptNote, SysSession.CurrentEnvironment.CurrentYear);
                window.open(result);
                // window.close(result)
            }
        });
    }
    LnkVoucher.PrintReport = PrintReport;
    function PrintTransaction() {
        if (!SysSession.CurrentPrivileges.PrintOut)
            return;
        var rp = new ReportParameters();
        rp.Type = 0;
        rp.slip = 0;
        rp.Repdesign = 1;
        rp.TRId = Number($('#ReceiptID').val());
        rp.Name_function = "rptReceiptNote";
        localStorage.setItem("Report_Data", JSON.stringify(rp));
        PrintTransactionLog(SysSession.CurrentEnvironment.UserCode, SysSession.CurrentEnvironment.CompCode, SysSession.CurrentEnvironment.BranchCode, Modules.AccTrReceiptNote, SysSession.CurrentEnvironment.CurrentYear, rp.TRId.toString());
        localStorage.setItem("result", '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>');
        window.open(Url.Action("ReportsPopup", "Home"), "_blank");
    }
})(LnkVoucher || (LnkVoucher = {}));
//# sourceMappingURL=LnkVoucher.js.map