﻿
$(document).ready(() => {
    LnkVoucher.InitalizeComponent();
})

namespace LnkVoucher {
    var sys: SystemTools = new SystemTools();
    var SysSession: SystemSession = GetSystemSession(Modules.LnkVoucher);
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);
    var TrType = 1;
    var codeType = "RecType";
    var Name_Screen = (lang == "ar" ? '  قيود الربط' : 'LnkVoucher');

    var CompCode = Number(SysSession.CurrentEnvironment.CompCode);
    var BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);

    var TransactionsGrid: JsGrid = new JsGrid();
    var LnkTransDetails: Array<AProc_LnkGenerateTrans_Result> = new Array<AProc_LnkGenerateTrans_Result>();
    var LnkVoucherlMastDet: LnkVoucherlMasterDetails = new LnkVoucherlMasterDetails();
    var AccountDetails: A_ACCOUNT = new A_ACCOUNT();
    var AccountDetailsIst: Array<A_ACCOUNT> = new Array<A_ACCOUNT>();
    var CostCentreDetailsIst: Array<G_COST_CENTER> = new Array<G_COST_CENTER>();
    var CostCenterDetails: G_COST_CENTER = new G_COST_CENTER();

    var txtSearch: HTMLInputElement;
    var txtTrDate: HTMLInputElement;
    var txtFromDate: HTMLInputElement;
    var txtToDate: HTMLInputElement;
    var txtFromNumber: HTMLInputElement;
    var txtToNumber: HTMLInputElement;
    var txtDifference: HTMLInputElement;
    var txtTotalCredit: HTMLInputElement;
    var txtTotalDebit: HTMLInputElement;

    var ddlBranch: HTMLSelectElement;
    var ddlTypeTrans: HTMLSelectElement;

    var btnGenerationVoucher: HTMLButtonElement;
    var btnBack: HTMLButtonElement;
    var btnShow: HTMLButtonElement;
    var btnAdd: HTMLButtonElement;
    var btnUpdate: HTMLButtonElement;
    var btnSave: HTMLButtonElement;
    var btnAddDetails: HTMLButtonElement;
    //////////////////////////////////////////print buttons////////////////////////////////////////////     
    var btnPrintTrview: HTMLButtonElement;
    var btnPrintTrPDF: HTMLButtonElement;
    var btnPrintTrEXEL: HTMLButtonElement;
    var btnPrintTransaction: HTMLButtonElement;
    var Events = 0;
    var CountGrid = 0;
    var VoucherCCType = SysSession.CurrentEnvironment.I_Control[0].GL_VoucherCCType;
    var Flag_Enabled_All = SysSession.CurrentPrivileges.CUSTOM2;
    var CostCenter_Enabled = SysSession.CurrentPrivileges.CUSTOM1;
    export function InitalizeComponent() {
        document.getElementById('Screen_name').innerHTML = Name_Screen;
        $('#btnAdd').addClass('hidden_Control');
        InitalizeControls();
        InitalizeEvents();
        InitializeGrid();
        txtFromDate.value = DateStartMonth();
        txtToDate.value = ConvertToDateDash(GetDate()) <= ConvertToDateDash(SysSession.CurrentEnvironment.EndDate) ? GetDate() : SysSession.CurrentEnvironment.EndDate;
        GetData_Header();

    }
    function InitalizeControls() {
        btnShow = document.getElementById("btnShow") as HTMLButtonElement;
        btnAdd = document.getElementById("btnAdd") as HTMLButtonElement;
        btnUpdate = document.getElementById("btnUpdate") as HTMLButtonElement;
        btnSave = document.getElementById("btnSave") as HTMLButtonElement;
        btnBack = document.getElementById("btnBack") as HTMLButtonElement;
        btnGenerationVoucher = document.getElementById("btnGenerationVoucher") as HTMLButtonElement;
        btnAddDetails = document.getElementById("btnAddDetails") as HTMLButtonElement;
        ////////  
        ddlBranch = document.getElementById("ddlBranch") as HTMLSelectElement;
        ddlTypeTrans = document.getElementById("ddlTypeTrans") as HTMLSelectElement;
        ////////        
        txtTrDate = document.getElementById("txtTrDate") as HTMLInputElement;
        txtSearch = document.getElementById("txtSearch") as HTMLInputElement;
        txtFromDate = document.getElementById("txtFromDate") as HTMLInputElement;
        txtToDate = document.getElementById("txtToDate") as HTMLInputElement;
        txtFromNumber = document.getElementById("txtFromNumber") as HTMLInputElement;
        txtToNumber = document.getElementById("txtToNumber") as HTMLInputElement;
        txtTotalDebit = document.getElementById("txtTotalDebit") as HTMLInputElement;
        txtTotalCredit = document.getElementById("txtTotalCredit") as HTMLInputElement;
        txtDifference = document.getElementById("txtDifference") as HTMLInputElement;
        //print 
        btnPrintTrview = document.getElementById("btnPrintTrview") as HTMLButtonElement;
        btnPrintTrPDF = document.getElementById("btnPrintTrPDF") as HTMLButtonElement;
        btnPrintTrEXEL = document.getElementById("btnPrintTrEXEL") as HTMLButtonElement;
        btnPrintTransaction = document.getElementById("btnPrintTransaction") as HTMLButtonElement;
    }
    function InitalizeEvents() {
        //********************************Btn****************************
        btnShow.onclick = btnShow_onclick;
        btnAdd.onclick = btnAdd_onclick;
        btnSave.onclick = btnSave_onClick;
        btnBack.onclick = btnBack_onclick;
        btnUpdate.onclick = btnUpdate_onclick;
        btnGenerationVoucher.onclick = btnGenerationVoucher_onclick;
        btnAddDetails.onclick = AddNewRow;
        //********************************onchange****************************    
        txtSearch.onkeyup = _SearchBox_Change;
        ddlTypeTrans.onchange = () => { Back(); $('#divGridShow').addClass('display_none'); $('#Div_control').addClass('display_none'); }
        //*******************************print*****************************
        txtFromNumber.onchange = () => { txtToNumber.value = txtToNumber.value.trim() == '' || Number(txtToNumber.value) < Number(txtFromNumber.value) ? txtFromNumber.value : txtToNumber.value }
        btnPrintTrview.onclick = () => { PrintReport(1); }
        btnPrintTrPDF.onclick = () => { PrintReport(2); }
        btnPrintTrEXEL.onclick = () => { PrintReport(3); }
        btnPrintTransaction.onclick = PrintTransaction;
        clickEventsVisible();
    }
    function InitializeGrid() {
        let res: any = GetResourceList("");
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
        TransactionsGrid.OnItemEditing = () => { };
        TransactionsGrid.Columns = [
            { title: "TRID", name: "TRID", type: "text", width: "5%", visible: false },
            { title: res.App_Number, name: "TR_NO", type: "text", width: "5%" },
            { title: res.TransTrType, name: "TR_CODE", type: "text", width: "5%", visible: false },
            {
                title: res.App_date, css: "ColumPadding", name: "TR_DATE", width: "8%",
                itemTemplate: (s: string, item: AProc_LnkGenerateTrans_Result): HTMLLabelElement => {
                    let txt: HTMLLabelElement = document.createElement("label");
                    txt.innerHTML = DateFormat(item.TR_DATE);
                    return txt;
                }
            },
            { title: 'الحركة', name: (lang == "ar" ? "TR_DESCA" : "TR_DESCE"), type: "text", width: "10%" },
            { title: "النوع", name: "TR_TYPE", type: "text", width: "15%" },
            { title: res.value, name: "TR_AMOUNT", type: "text", width: "5%" },
            { title: res.TransDesc, name: (lang == "ar" ? "VOUCHER_DESCA" : "VOUCHER_DESCE"), type: "text", width: "20%" },
            {
                title: 'الحاله', css: "ColumPadding", name: "IsGenerated", width: "4%",
                itemTemplate: (s: string, item: AProc_LnkGenerateTrans_Result): HTMLLabelElement => {
                    let txt: HTMLLabelElement = document.createElement("label");
                    txt.innerHTML = item.IsPosted == true ? (lang == "ar" ? "تم التوليد" : "Generated") : (lang == "ar" ? "لم يتم التوليد" : "Not Generated");
                    return txt;
                }
            },
        ];
        TransactionsGrid.Bind();
    }
    function clickEventsVisible() {
        var clickEventCost = 0;
        var clickEventAcc = 0;
        $("#divCostCnterName").on('click', function () {
            debugger
            if (Events == 0) {
                var show1 = $(".costcntr").is(":visible");
                //var show2 = $(".Acc").is(":visible");
                if (show1 == true) {

                    $(".costcntr").addClass("display_none");
                    $("#IdTable").attr("style", "width: 110%;");

                    clickEventCost = 1;
                }
                else {
                    clickEventCost = 0;
                    $(".costcntr").removeClass("display_none");
                    if (clickEventCost == 0 && clickEventAcc == 0) {
                        $("#IdTable").attr("style", "width: 125%;");
                    }
                }
                Events = 1;
                setTimeout(function () { Events = 0 }, 700);
            }

        });

        $("#divAccNumber").on('click', function () {
            debugger
            if (Events == 0) {
                //$(".Acc").toggle();
                /////////////////////////
                var show1 = $(".Acc").is(":visible");
                //var show2 = $(".Acc").is(":visible");
                if (show1 == true) {

                    $(".Acc").addClass("display_none");
                    $("#IdTable").attr("style", "width: 110%;");
                    clickEventAcc = 1;
                }
                else {
                    clickEventAcc = 0;
                    $(".Acc").removeClass("display_none");
                    if (clickEventCost == 0 && clickEventAcc == 0) {
                        $("#IdTable").attr("style", "width: 125%;");
                    }
                }
                Events = 1;
                setTimeout(function () { Events = 0 }, 700);
            }

        });

        //divJouralHide
        $("#divCostCnterNameCCDT").on('click', function () {
            debugger

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
                setTimeout(function () { Events = 0 }, 700);
            }

        });

    }
    //************************************************fillddl**************************************
    function GetData_Header() {
        var Table: Array<Table>;
        Table =
            [
                { NameTable: 'G_BRANCH', Condition: " COMP_CODE = " + CompCode + " " },
                { NameTable: 'GQ_GetLnkTransComp', Condition: " COMP_CODE = " + CompCode + " and INTEGRATE = 1 and Comp_INTEGRATE = 1  and isview = 1  order by  SUB_SYSTEM_CODE Asc ,TR_CODE Asc " },
                { NameTable: 'A_ACCOUNT', Condition: " COMP_CODE = " + CompCode + " " },
                { NameTable: 'G_COST_CENTER', Condition: " COMP_CODE = " + CompCode + " " },
            ]

        DataResult(Table);
        //**************************************************************************************************************
        DocumentActions.FillCombowithdefult(GetDataTable('G_BRANCH'), ddlBranch, "BRA_CODE", "BRA_DESC", (lang == "ar" ? ' اختر الفرع' : 'Branch'));
        DocumentActions.FillCombowithdefult(GetDataTable('GQ_GetLnkTransComp'), ddlTypeTrans, "TR_CODE", "TR_DESCA", (lang == "ar" ? ' اختر الحركة' : 'TypeTrans'));
        ddlBranch.value = $('#ddbra').val();
        AccountDetailsIst = GetDataTable('A_ACCOUNT') as Array<A_ACCOUNT>;
        CostCentreDetailsIst = GetDataTable('G_COST_CENTER') as Array<G_COST_CENTER>;

    }
    function GetAccByCode(AccCode: string): boolean {
        debugger
        var flag: boolean = true;
        var accObj = AccountDetailsIst.filter(s => s.ACC_CODE == AccCode);
        if (accObj.length > 0) {
            AccountDetails = accObj[0];


        } else {


            flag = false;
        }
        return flag;
    }
    function GetCostCenterByCode(CC_Code: string): boolean {
        var flag: boolean = true;

        var ccObj = CostCentreDetailsIst.filter(s => s.CC_CODE == CC_Code);
        if (ccObj.length > 0) {
            CostCenterDetails = ccObj[0];
        } else {
            flag = false;
        }
        return flag;
    }
    function _SearchBox_Change() {
        $("#TransactionsGrid").jsGrid("option", "pageIndex", 1);

        if (txtSearch.value != "") {
            let search: string = txtSearch.value.toLowerCase();
            let SearchDetails = LnkTransDetails.filter(x => x.TR_NO.toString().search(search) >= 0 || x.VOUCHER_DESCA.toLowerCase().search(search) >= 0 || x.TR_DESCA.toLowerCase().search(search) >= 0);

            TransactionsGrid.DataSource = SearchDetails;
            TransactionsGrid.Bind();
        } else {
            TransactionsGrid.DataSource = LnkTransDetails;
            TransactionsGrid.Bind();
        }
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
        var trType = "" + ddlTypeTrans.value + ","
        var StartDate: string = DateFormatRep(txtFromDate.value);
        var EndDate: string = DateFormatRep(txtToDate.value);
        var FromNum: number = 0;
        var ToNum: number = 0;
        if (txtFromNumber.value != "") {
            FromNum = Number(txtFromNumber.value);
        }
        if (txtToNumber.value != "") {
            ToNum = Number(txtToNumber.value);
        }

        let IsPosted = Number($('#ddlStatus').val());

        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("TranPosting", "LoadLnkVouchTransactions"),
            data: {
                Comp: CompCode, branchCode: branchCode, TrType: trType, StartDate: StartDate, EndDate: EndDate, FromNum: FromNum, ToNum: ToNum, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token, Modules: Modules.LnkVoucher, FinYear: SysSession.CurrentEnvironment.CurrentYear
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    debugger
                    LnkTransDetails = result.Response as Array<AProc_LnkGenerateTrans_Result>;
                    IsPosted != -1 ? LnkTransDetails = LnkTransDetails.filter(x => x.IsPosted == Boolean(IsPosted)) : null;

                    if (LnkTransDetails.length > 0) {
                        LnkTransDetails = LnkTransDetails.sort(dynamicSort("TrNo"));

                        TransactionsGrid.DataSource = LnkTransDetails;
                        TransactionsGrid.Bind();

                        $('#divGridShow').removeClass('display_none');
                        $('#Div_control').addClass('display_none');

                    } else {
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

            var CanAdd: boolean = true;
            if (CountGrid > 0) {
                for (var i = 0; i < CountGrid; i++) {
                    CanAdd = Validation_Grid(i);
                    if (CanAdd == false) {
                        break;
                    }
                }
            }
            if (CanAdd) {

                //$("#txtUpdatedBy").val(SysSession.CurrentEnvironment.UserCode);
                //$("#txtUpdatedAt").val(DateTimeFormat(Date().toString()));
                if (Number(txtDifference.value) != 0 && SysSession.CurrentEnvironment.I_Control[0].GL_JournalSaveUnbalanced == true) {
                    WorningMessage("القيد غير متوازن هل تريد الحفظ ؟؟", "The constraint is unbalanced Do you want to save", "تحذير", "worning", () => {
                        Assign();
                        Update();
                    });
                } else {
                    Assign();
                    Update();
                }

            }
        }, 100);
    }
    function btnBack_onclick() {
        CleanDetails();
        DisplayData(TransactionsGrid.SelectedItem)
        disabled();
    }
    function btnUpdate_onclick() {
        Enabled();
    }
    function btnGenerationVoucher_onclick() {
        btnGenerationVoucher.innerHTML = ' جاري التوليد <span class="glyphicon glyphicon-file"></span>  <i class="fa fa-spinner fa-spin lod  Loading" style="font-size: 140% !important;z-index: 99999;"></i> ';
        btnGenerationVoucher.disabled = true;
        setTimeout(function () {
            let TrID = Number($('#TRID').val())
            let TR_CODE = $('#TR_CODE').val()
            Ajax.Callsync({
                type: "Get",
                url: sys.apiUrl("TranPosting", "LnkVoucherGenerate"),
                data: { TrID: TrID, CompCode: CompCode, BranchCode: BranchCode, tr_code: TR_CODE },
                success: (d) => {//(int TrID, int CompCode, int branchCode)
                    let result = d as BaseResponse;
                    if (result.IsSuccess) {
                        let List = result.Response as Array<AQ_GetLnkVoucher>;
                        CountGrid = 0;
                        $("#div_Data").html('');

                        List.length == 0 ? setTimeout(function () { $('#icon-bar').addClass('display_none') }, 20) : $('#icon-bar').removeClass('display_none')

                        $("#btnGenerationVoucher").addClass('animate__animated animate__fadeOutBottomRight');
                        for (let i = 0; i < List.length; i++) {
                            BuildControls(i);
                            DisplayBuildControls(List[i], i);
                            CountGrid++
                        }
                        $('.table-responsive').scrollLeft(3);
                        ComputeTotals();

                        btnGenerationVoucher.disabled = false;

                        setTimeout(function () { $("#btnGenerationVoucher").attr('class', 'btn btn-main Grin animate__animated   animate__fadeInBottomRight') }, 1000);
                        btnGenerationVoucher.innerHTML = `<i class="fa-solid fa-arrow-left fa-fade"></i>اعادة توليد القيد<i class="fa-solid fa-arrow-right fa-fade"></i>`;
                    }
                }
            });

        }, 500);
    }
    //****************************************************CleanInput********************************************* 
    function Enabled() {
        if (Flag_Enabled_All) {
            $('._dis').removeAttr('disabled')
            $('.btn_minus_non').removeClass('display_none')
            $('._None_Input').removeClass('display_none')
        }
        else {
            $('._Remarks').removeAttr('disabled')
            $('.table-responsive').scrollLeft(-500);
            $('#Line_DescA0').focus();
            if (CostCenter_Enabled) {
                $('._Cost').removeAttr('disabled') 
            }
        
        }

        $('#id_div_Filter').addClass('disabledDiv')
        $('#btnGenerationVoucher').attr('disabled', 'disabled')
    }
    function disabled() {
        $('#btnGenerationVoucher').removeAttr('disabled')
        $('._dis').attr('disabled', 'disabled')
        $('._Remarks').attr('disabled', 'disabled')
        $('._Cost').attr('disabled', 'disabled')
        $('#id_div_Filter').removeClass('disabledDiv')
        $('._None_Input').addClass('display_none')
        $('.btn_minus_non').addClass('display_none')
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
        DisplayData(TransactionsGrid.SelectedItem)
        disabled();
    }
    function DisplayData(Selecteditem: AProc_LnkGenerateTrans_Result) {
        DocumentActions.RenderFromModel(Selecteditem);
        txtTrDate.value = DateFormat(Selecteditem.TR_DATE);
        $('#TRID').val(Selecteditem.TRID);
        $('#TR_CODE').val(Selecteditem.TR_CODE);
        DisplayDetails(Selecteditem.TRID, Selecteditem.TR_CODE);
    }
    function DisplayDetails(TrID: number, tr_code: string) {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("TranPosting", "GetLnkVoucherById"),
            data: { TrID: TrID, CompCode: CompCode, tr_code: tr_code },
            success: (d) => {//(int TrID, int CompCode, int branchCode)
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    debugger
                    let List = result.Response as Array<AQ_GetLnkVoucher>;
                    CountGrid = 0;
                    $("#div_Data").html('');
                    List.length == 0 ? setTimeout(function () { $('#icon-bar').addClass('display_none'); $('#btnGenerationVoucher').removeClass('Grin') }, 20) : $('#icon-bar').removeClass('display_none'); $('#btnGenerationVoucher').addClass('Grin')
                    for (let i = 0; i < List.length; i++) {
                        BuildControls(i);
                        DisplayBuildControls(List[i], i);
                        CountGrid++
                    }
                    $('.table-responsive').scrollLeft(3);
                    ComputeTotals();
                }
            }
        });
    }
    ////****************************************************Controls Grid Region****************************************************
    function BuildControls(cnt: number) {
        var html = "";
        html = `<tr id= "No_Row${cnt}">
                    
	                <td>
		                <div class="form-group display_none btn_minus_non">
			                <span id="btn_minus${cnt}"><i class="fas fa-minus-circle  btn-minusNew"></i></span> 
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
			                <button type="button" class="style_ButSearch _dis"  id="btnSearchAcc${cnt}" name="ColSearch" disabled>
                                <i class="fa fa-search"></i>
                             </button>
		                </div>
	                </td>
                     <td style="width:9%;">
		                <div class="form-group">
			                 <input id="Acc_Code${cnt}" value="" name="" disabled type="text" class="form-control _dis" />
		                </div>
	                </td>
                    <td style="width:17%;" class="Acc">
		                <div class="form-group">
			                  <input id="ACC_DESCA${cnt}" value="" name="" disabled type="text" class="form-control"  />
		                </div>
	                </td>
                    <td style="width:9%;">
		                <div class="form-group">
			               <input id="Debit${cnt}" name="" disabled type="number" value=""  min="0" class="form-control _dis" />
		                </div>
	                </td>
                    <td style="width:9%;">
		                <div class="form-group">
			               <input id="Credit${cnt}" name="" disabled type="number" value=""  min="0" class="form-control _dis" />
		                </div>
	                </td>

                    <td>
		                <div class="form-group">
			                <button type="button" class="_Cost style_ButSearch _dis"  id="btnSearchCostCenter${cnt}" name="ColSearch" disabled>
                                <i class="fa fa-search"></i>
                             </button>
		                </div>
	                </td>
                     <td style="width:9%;">
		                <div class="form-group">
			                <input id="CC_Code${cnt}" name="" value="" disabled type="text" class="_Cost form-control _dis" />
		                </div>
	                </td>
                    <td style="width:17%;" class="costcntr">
		                <div class="form-group">
			                  <input id="CC_DESCA${cnt}" name="" value="" disabled type="text" class="form-control" />
		                </div>
	                </td>

                    
                    <td style="width:28%;">
		                <div class="form-group">
			              <textarea id="Line_DescA${cnt}" name="" value="" disabled type="text" class="_Remarks form-control _dis"></textarea>
		                </div>
	                </td>
                     
                </tr>`;
        $("#div_Data").append(html);

        BuildAllFild(AQ_GetLnkVoucher, cnt, "No_Row");


        $('#btnSearchAcc' + cnt).click(function (e) {
            let sys: SystemTools = new SystemTools();

            sys.FindKey(Modules.JournalVoucher, "btnAccountSearch", "COMP_CODE=" + CompCode + "and ACC_ACTIVE = 1 and DETAIL =1  ", () => {
                let id = SearchGrid.SearchDataGrid.SelectedKey
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


            var id = $('#Acc_Code' + cnt).val();
            if (GetAccByCode(id)) {

                if (AccountDetails != null) {
                    $('#ACC_DESCA' + cnt).val((lang == "ar" ? AccountDetails.ACC_DESCA : AccountDetails.ACC_DESCL));
                    $('#txtAccountNameFooter').val((lang == "ar" ? AccountDetails.ACC_DESCA : AccountDetails.ACC_DESCL));
                    $("#divAccountNameFooter").removeClass("display_none");
                } else {
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
            let sys: SystemTools = new SystemTools();

            sys.FindKey(Modules.JournalVoucher, "btnCostCenterSearch", "COMP_CODE=" + CompCode + "and ACTIVE = 1 ", () => {
                let id = SearchGrid.SearchDataGrid.SelectedKey
                $('#CC_Code' + cnt).val(id);
                GetCostCenterByCode(id);
                $('#CC_DESCA' + cnt).val((lang == "ar" ? CostCenterDetails.CC_DESCA : CostCenterDetails.CC_DESCE));
                $('#txtCostCntrNameFooter').val((lang == "ar" ? CostCenterDetails.CC_DESCA : CostCenterDetails.CC_DESCE));
                if ($("#StatusFlag" + cnt).val() != "i")
                    $("#StatusFlag" + cnt).val("u");
            });
        });
        $("#CC_Code" + cnt).on('change', function () {


            var id = $('#CC_Code' + cnt).val();

            if (GetCostCenterByCode(id)) {

                $('#CC_DESCA' + cnt).val((lang == "ar" ? CostCenterDetails.CC_DESCA : CostCenterDetails.CC_DESCE));
                $('#txtCostCntrNameFooter').val((lang == "ar" ? CostCenterDetails.CC_DESCA : CostCenterDetails.CC_DESCE));
                $("#divCostCntrNameFooter").removeClass("display_none");

            }
            else {
                $('#CC_Code' + cnt).val("");
                $('#CC_DESCA' + cnt).val("");
                $('#txtCostCntrNameFooter').val("");
                //  $("#divCostCntrNameFooter").addClass("display_none"); 
                DisplayMassage("مركز التكلفة غير صحيح ", "Wrong Cost Center ", MessageType.Error);
            }
        });

        //Depit on change  
        $("#Debit" + cnt).on('change', function () {


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
            var AccObj = AccountDetailsIst.filter(s => s.COMP_CODE == CompCode && s.ACC_CODE == AccCodeVal);
            if (AccObj.length > 0) {
                $("#divAccountNameFooter").removeClass("display_none");
                $("#txtAccountNameFooter").prop("value", (lang == "ar" ? AccObj[0].ACC_DESCA : AccObj[0].ACC_DESCL));
            } else {
                $("#txtAccountNameFooter").prop("value", "");
            }
            //GetAllCostCenters CostCentreDetailsIst
            var CC_CodeVal = $('#CC_Code' + cnt).val();
            var CCObj = CostCentreDetailsIst.filter(s => s.COMP_CODE == CompCode && s.CC_CODE == CC_CodeVal);
            if (CCObj.length > 0) {
                $("#divCostCntrNameFooter").removeClass("display_none");
                $("#txtCostCntrNameFooter").prop("value", lang == "ar" ? CCObj[0].CC_DESCA : CCObj[0].CC_DESCE);
            } else {
                //   $("#divCostCntrNameFooter").addClass("display_none");
                $("#txtCostCntrNameFooter").prop("value", "");
            }

            $('#txtRemark').val($('#Line_DescA' + cnt).val());

        });


    }
    function ComputeTotals() {

        let DepitTotal = 0;
        let CreditTotal = 0;
        var Difference: number = 0;

        for (let f = 0; f < CountGrid; f++) {
            var flagvalue = $("#StatusFlag" + f).val();
            if (flagvalue != "d" && flagvalue != "m") {
                DepitTotal += Number($("#Debit" + f).val());
                CreditTotal += Number($("#Credit" + f).val());
            }
        }
        DepitTotal = DepitTotal.RoundToNum(2);
        CreditTotal = CreditTotal.RoundToNum(2);
        txtTotalDebit.value = DepitTotal.toLocaleString();
        txtTotalCredit.value = CreditTotal.toLocaleString();

        Difference = (DepitTotal - CreditTotal).RoundToNum(2);
        txtDifference.value = Difference.toLocaleString();


    }
    function DeleteRow(RecNo: number) {
        if (!SysSession.CurrentPrivileges.Remove) return;
        WorningMessage("هل تريد الحذف؟", "Do you want to delete?", "تحذير", "worning", () => {

            var statusFlag = $("#StatusFlag" + RecNo).val();
            if (statusFlag == "i")
                $("#StatusFlag" + RecNo).val("m");
            else
                $("#StatusFlag" + RecNo).val("d");



            $("#No_Row" + RecNo).attr("hidden", "true");
            Insert_Serial();

            ComputeTotals();
        });

    }
    function AddNewRow() {

        if (!SysSession.CurrentPrivileges.AddNew) return;
        var CanAdd: boolean = true;
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

            $("#ID" + CountGrid).val($("#ID" + (CountGrid - 1)).val());
            $("#CompCode" + CountGrid).val($("#CompCode" + (CountGrid - 1)).val());
            $("#bracode" + CountGrid).val($("#bracode" + (CountGrid - 1)).val());
            $("#System_Code" + CountGrid).val($("#System_Code" + (CountGrid - 1)).val());
            $("#Tr_Code" + CountGrid).val($("#Tr_Code" + (CountGrid - 1)).val());
            $("#TrID" + CountGrid).val($("#TrID" + (CountGrid - 1)).val());
            $("#TrNo" + CountGrid).val($("#TrNo" + (CountGrid - 1)).val());
            $("#Serial" + CountGrid).val((CountGrid + 1));
            $("#Voucher_No" + CountGrid).val($("#Voucher_No" + (CountGrid - 1)).val());
            $("#SOURCE_TYPE" + CountGrid).val($("#SOURCE_TYPE" + (CountGrid - 1)).val());
            $("#TYPE_CODE" + CountGrid).val($("#TYPE_CODE" + (CountGrid - 1)).val());
            $("#TrDate" + CountGrid).val(txtTrDate.value);

            $('._dis').removeAttr('disabled')
            $('.btn_minus_non').removeClass('display_none')
            CountGrid++;
            Insert_Serial();
        }
    }
    function Insert_Serial() {

        let Chack_Flag = false;
        let flagval = "";
        let Ser = 1;
        for (let i = 0; i < CountGrid; i++) {
            flagval = $("#StatusFlag" + i).val();
            if (flagval != "d" && flagval != "m") {
                $("#Serial" + i).val(Ser);
                Ser++;
            }
            if (flagval == 'd' || flagval == 'm' || flagval == 'i') {
                Chack_Flag = true
            }
            if (Chack_Flag) {
                if ($("#StatusFlag" + i).val() != 'i' && $("#StatusFlag" + i).val() != 'm' && $("#StatusFlag" + i).val() != 'd') {
                    $("#StatusFlag" + i).val('u');
                }
            }
        }

    }
    //****************************************************Validation*********************************************
    function Validation_Grid(rowcount: number) {
        var AccNum = $("#Acc_Code" + rowcount).val()
        var AccObject = AccountDetailsIst.filter(s => s.COMP_CODE == CompCode && s.ACC_CODE == AccNum);
        var Debit = Number($("#Debit" + rowcount).val());
        var credit = Number($("#Credit" + rowcount).val());

        if ($("#StatusFlag" + rowcount).val() == "d" || $("#StatusFlag" + rowcount).val() == "") {
            return true;
        }
        else {
            if ($("#Acc_Code" + rowcount).val() == "") {
                DisplayMassage('برجاء ادخال رقم الحساب', '(Please enter account number)', MessageType.Error);
                Errorinput($("#Acc_Code" + rowcount));
                return false;
            }
            else if (Debit == 0 && credit == 0) {
                DisplayMassage('برجاء ادخال مبلغ المدين او الدائن', '(Please enter the debit or credit amount)', MessageType.Error);
                Errorinput($("#Debit" + rowcount));
                return false
            }
            else if ($("#txtCostCntrNum" + rowcount).val() == "" && (AccObject[0].ACC_GROUP == 4 || AccObject[0].ACC_GROUP == 5) && VoucherCCType == 1) {
                DisplayMassage('برجاء ادخال  مركز التكلفه', '(Please enter the cost center)', MessageType.Error);
                Errorinput($("#txtCostCntrNum" + rowcount));
                return false
            }
            else if ($("#txtCostCntrNum" + rowcount).val() == "" && VoucherCCType == 2) {
                DisplayMassage('برجاء ادخال  مركز التكلفه', '(Please enter the cost center)', MessageType.Error);
                Errorinput($("#txtCostCntrNum" + rowcount));
                return false
            }



            return true;
        }
    }
    function Validation() {

        return true;

    }
    //****************************************************Assign_Data*********************************************
    function Assign() {
        debugger

        let Model = new Array<A_LnkVoucher>();
        Model = AssignBuildControls(A_LnkVoucher, CountGrid);
        console.log(Model);

        let Filter = new FilterLnkVoucher;
        Filter.Comp = CompCode;
        Filter.branchCode = Number(ddlBranch.value);
        Filter.FromNum = Number(txtFromNumber.value);
        Filter.ToNum = Number(txtToNumber.value);
        Filter.TrType = "" + ddlTypeTrans.value + ","
        Filter.StartDate = DateFormatRep(txtFromDate.value);
        Filter.EndDate = DateFormatRep(txtToDate.value);
        Filter.UserCode = SysSession.CurrentEnvironment.UserCode;

        LnkVoucherlMastDet.A_LnkVoucher = Model;
        LnkVoucherlMastDet.FilterLnkVoucher = Filter;

        LnkVoucherlMastDet.Branch_Code = SysSession.CurrentEnvironment.BranchCode;
        LnkVoucherlMastDet.Comp_Code = SysSession.CurrentEnvironment.CompCode;
        LnkVoucherlMastDet.MODULE_CODE = Modules.LnkVoucher;
        LnkVoucherlMastDet.UserCode = SysSession.CurrentEnvironment.UserCode;
        LnkVoucherlMastDet.sec_FinYear = SysSession.CurrentEnvironment.CurrentYear;


    }
    function Update() {
        debugger
        if (!CheckDate(DateFormat(txtTrDate.value).toString(), DateFormat(SysSession.CurrentEnvironment.StartDate).toString(), DateFormat(SysSession.CurrentEnvironment.EndDate).toString())) {
            WorningMessage("  التاريخ ليس متطابق مع تاريخ المتاح (" + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ")", "Date does not match available date(" + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ")", "تحذير", "worning");
            return
        }
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("TranPosting", "UpdateDetail"),
            data: JSON.stringify(LnkVoucherlMastDet),
            success: (d) => {
                debugger
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    debugger
                    let res = result.Response as Array<AProc_LnkGenerateTrans_Result>;
                    DisplayMassage("تم التعديل بنجاح", "Success", MessageType.Succeed);
                    Success(0, res);
                    Save_Succ_But();
                } else {
                    DisplayMassage("خطأء", "Error", MessageType.Error);
                }
            }
        });

    }
    function Success(ID: number, res: Array<AProc_LnkGenerateTrans_Result>) {

        debugger
        LnkTransDetails = res;

        let IsPosted = Number($('#ddlStatus').val());
        IsPosted != -1 ? LnkTransDetails = LnkTransDetails.filter(x => x.IsPosted == Boolean(IsPosted)) : null;

        LnkTransDetails = LnkTransDetails.sort(dynamicSort("TrNo"));

        $('#divGridShow').removeClass('display_none');
        $('#Div_control').addClass('display_none');
        TransactionsGrid.DataSource = LnkTransDetails;
        TransactionsGrid.Bind();
        CleanDetails();
        DisplayData(TransactionsGrid.SelectedItem)
        disabled();
    }
    //*******************************************************Print*********************************************************     
    export function PrintReport(OutType: number) {
        if (!SysSession.CurrentPrivileges.PrintOut) return;
        let rp: ReportParameters = new ReportParameters();

        rp.RepType = OutType;//output report as View
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

        //**************************************************************
        rp.User = SysSession.CurrentEnvironment.UserCode;
        rp.SystemCode = SysSession.CurrentEnvironment.SystemCode;
        rp.TrTypeSt = "" + ddlTypeTrans.value + ",";
        rp.FromDate = DateFormatRep(txtFromDate.value);
        rp.ToDate = DateFormatRep(txtToDate.value);
        rp.fromNum = Number(txtFromNumber.value);
        rp.ToNum = Number(txtToNumber.value);
        rp.IsGenerated = Number($('#ddlStatus').val());

        Ajax.Callsync({
            url: Url.Action("Rep_LnkVoucherList", "GeneralReports"),
            data: rp,
            success: (d) => {

                let result = d.result as string;



                window.open(result);
            }
        })
    }
    function PrintTransaction() {
        if (!SysSession.CurrentPrivileges.PrintOut) return;
        let rp: ReportParameters = new ReportParameters();


        rp.TRId = Number($('#TRID').val())
        rp.TrTypeSt = $('#TR_CODE').val()
        rp.Type = 0;

        rp.Name_function = "rptPrnt_LnkVoucher";
        //rp.Name_function = "rptReceiptNote";
        localStorage.setItem("Report_Data", JSON.stringify(rp));


        localStorage.setItem("result", '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>');
        window.open(Url.Action("ReportsPopup", "Home"), "_blank");
    }
} 