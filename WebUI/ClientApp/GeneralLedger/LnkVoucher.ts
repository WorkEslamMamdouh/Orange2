
$(document).ready(() => {
    LnkVoucher.InitalizeComponent();
})

namespace LnkVoucher {
    var sys: SystemTools = new SystemTools();
    var SysSession: SystemSession = GetSystemSession(Modules.AccTrReceiptNoteNew);
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);
    var TrType = 1;
    var codeType = "RecType";
    var Name_Screen = (lang == "ar" ? ' ربط القيود' : 'LnkVoucher');

    var CompCode = Number(SysSession.CurrentEnvironment.CompCode);
    var BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);

    var TransactionsGrid: JsGrid = new JsGrid();
    var LnkTransDetails: Array<AProc_LnkGenerateTrans_Result> = new Array<AProc_LnkGenerateTrans_Result>();
    var Model: A_RecPay_Tr_ReceiptNote = new A_RecPay_Tr_ReceiptNote();
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

    var ddlBranch: HTMLSelectElement;
    var ddlTypeTrans: HTMLSelectElement;

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
        btnAddDetails.onclick = AddNewRow;
        //********************************onchange****************************    
        txtSearch.onkeyup = _SearchBox_Change;
        ddlTypeTrans.onchange = () => { Back(); $('#divGridShow').addClass('display_none'); $('#Div_control').addClass('display_none'); }
        //*******************************print*****************************
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
            { title: res.TransTrType, name: "TR_CODE", type: "text", width: "5%", visible: false },
            { title: res.App_Number, name: "TR_NO", type: "text", width: "5%" },
            //{ title: res.App_date, name: "TR_DATE", type: "text", width: "8%" },
            {
                title: res.App_date, css: "ColumPadding", name: "TR_DATE", width: "8%",
                itemTemplate: (s: string, item: AProc_LnkGenerateTrans_Result): HTMLLabelElement => {
                    let txt: HTMLLabelElement = document.createElement("label");
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
                itemTemplate: (s: string, item: AProc_LnkGenerateTrans_Result): HTMLLabelElement => {
                    let txt: HTMLLabelElement = document.createElement("label");
                    txt.innerHTML = item.IsPosted == true ? (lang == "ar" ? "تم" : "Done") : "";
                    return txt;
                }
            },
        ];
        TransactionsGrid.Bind();
    }
    function clickEventsVisible() {

        $("#divCostCnterName").on('click', function () {
            debugger
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
                }
                else {
                    $(".Acc").removeClass("display_none");
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
                { NameTable: 'GQ_GetLnkTransComp', Condition: " COMP_CODE = " + CompCode + " and INTEGRATE = 1 and Comp_INTEGRATE = 1 order by  SUB_SYSTEM_CODE Asc ,TR_CODE Asc " },
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
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("TranPosting", "LoadLnkVouchTransactions"),
            data: {
                Comp: CompCode, branchCode: branchCode, TrType: trType, StartDate: StartDate, EndDate: EndDate, FromNum: FromNum, ToNum: ToNum, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token, Modules: Modules.TranPosting, FinYear: SysSession.CurrentEnvironment.CurrentYear
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    debugger
                    LnkTransDetails = result.Response as Array<AProc_LnkGenerateTrans_Result>;

                    if (LnkTransDetails.length > 0) {
                        LnkTransDetails = LnkTransDetails.filter(x => x.TR_NO != null).sort(function (a, b) { return a.TR_NO - b.TR_NO });

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


            $("#txtUpdatedBy").val(SysSession.CurrentEnvironment.UserCode);
            $("#txtUpdatedAt").val(DateTimeFormat(Date().toString()));
            Assign();
            Update();

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
            let search: string = txtSearch.value.toLowerCase();
            let SearchDetails = LnkTransDetails.filter(x => x.TR_NO.toString().search(search) >= 0 || x.VOUCHER_DESCA.toLowerCase().search(search) >= 0 || x.TR_DESCA.toLowerCase().search(search) >= 0);

            TransactionsGrid.DataSource = SearchDetails;
            TransactionsGrid.Bind();
        } else {
            TransactionsGrid.DataSource = LnkTransDetails;
            TransactionsGrid.Bind();
        }
    }
    //****************************************************CleanInput********************************************* 
    function Enabled() {
        $('._dis').removeAttr('disabled')
        $('.btn_minus_non').removeClass('display_none')
        $('#id_div_Filter').addClass('disabledDiv')
        $('._None_Input').removeClass('display_none') 
    }
    function disabled() {
        $('._dis').attr('disabled', 'disabled')
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
        DisplayDetails(59212)
    }
    function DisplayDetails(TrID: number) {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("TranPosting", "GetLnkVoucherById"),
            data: { TrID: TrID, CompCode: CompCode, branchCode: BranchCode },
            success: (d) => {//(int TrID, int CompCode, int branchCode)
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    let List = result.Response as Array<IQ_GetSlsInvoiceItemVer2>; 
                    CountGrid = 0;
                    $("#div_Data").html('');
                    for (let i = 0; i < List.length; i++) {
                        BuildControls(i);
                        CountGrid++
                    } 
                }
            }
        });
    }
    ////**************************************************** Controls Grid Region //****************************************************
    function BuildControls(cnt: number) {
        var html = "";
        html = `<tr id= "No_Row${cnt}">
                     <input id="VoucherDetailID${cnt}" type="hidden" value="" class="form-control display_none"  />
                    <input id="txtSerial${cnt}" name="FromDate" disabled type="hidden" value="" class="form-control" />
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
			                 <input id="txtAccNumber${cnt}" value="" name="" disabled type="text" class="form-control _dis" />
		                </div>
	                </td>
                    <td style="width:17%;" class="Acc">
		                <div class="form-group">
			                  <input id="txtAccName${cnt}" value="" name="" disabled type="text" class="form-control"  />
		                </div>
	                </td>
                    <td style="width:9%;">
		                <div class="form-group">
			               <input id="txtDebit${cnt}" name="FromDate" disabled type="number" value=""  min="0" class="form-control _dis" />
		                </div>
	                </td>
                    <td style="width:9%;">
		                <div class="form-group">
			               <input id="txtCredit${cnt}" name="FromDate" disabled type="number" value=""  min="0" class="form-control _dis" />
		                </div>
	                </td>

                    <td>
		                <div class="form-group">
			                <button type="button" class="style_ButSearch _dis"  id="btnSearchCostCenter${cnt}" name="ColSearch" disabled>
                                <i class="fa fa-search"></i>
                             </button>
		                </div>
	                </td>
                     <td style="width:9%;">
		                <div class="form-group">
			                <input id="txtCostCntrNum${cnt}" name="FromDate" value="" disabled type="text" class="form-control _dis" />
		                </div>
	                </td>
                    <td style="width:17%;" class="costcntr">
		                <div class="form-group">
			                  <input id="txtCostCntrName${cnt}" name="FromDate" value="" disabled type="text" class="form-control" />
		                </div>
	                </td>

                    
                    <td style="width:22%;">
		                <div class="form-group">
			              <input id="Notes${cnt}" name="FromDate" value="" disabled type="text" class="form-control _dis" />
		                </div>
	                </td>
                    
                  
                    <input id="txt_StatusFlag${cnt}" name = " " value="" type = "hidden" class="form-control"/>
                    <input id="FlagUpdate${cnt}" name = " " value="" type = "hidden" class="form-control"/>

                    <input id="INVOICE_NO${cnt}" name = " " value="" type = "hidden" class="form-control"/>
                    <input id="BOOK_TR_NO${cnt}" name = " " value="" type = "hidden" class="form-control"/>
                    <input id="SRC_SYSTEM_CODE${cnt}" name = " " value="" type = "hidden" class="form-control"/>
                    <input id="SRC_SUB_SYSTEM_CODE${cnt}" name = " " value="" type = "hidden" class="form-control"/>
                    <input id="SRC_BRA_CODE${cnt}" name = " " value="" type = "hidden" class="form-control"/>
                    <input id="SRC_TR_CODE${cnt}" name = " " value="" type = "hidden" class="form-control"/>
                    <input id="SRC_TR_NO${cnt}" name = " " value="" type = "hidden" class="form-control"/>
                    <input id="SRC_TR_TYPE${cnt}" name = " " value="" type = "hidden" class="form-control"/>
                </tr>`;
        $("#div_Data").append(html);


        $('#btnSearchAcc' + cnt).click(function (e) {
            let sys: SystemTools = new SystemTools();

            sys.FindKey(Modules.JournalVoucher, "btnAccountSearch", "COMP_CODE=" + CompCode + "and ACC_ACTIVE = 1 and DETAIL =1  ", () => {
                let id = SearchGrid.SearchDataGrid.SelectedKey
                $('#txtAccNumber' + cnt).val(id);
                if (GetAccByCode(id)) {
                    $('#txtAccName' + cnt).val((lang == "ar" ? AccountDetails.ACC_DESCA : AccountDetails.ACC_DESCL));
                    $('#txtAccountNameFooter').val((lang == "ar" ? AccountDetails.ACC_DESCA : AccountDetails.ACC_DESCL));

                }

                if ($("#txt_StatusFlag" + cnt).val() != "i")
                    $("#txt_StatusFlag" + cnt).val("u");
            });

        });
        $("#txtAccNumber" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");

            var id = $('#txtAccNumber' + cnt).val();
            if (GetAccByCode(id)) {

                if (AccountDetails != null) {
                    $('#txtAccName' + cnt).val((lang == "ar" ? AccountDetails.ACC_DESCA : AccountDetails.ACC_DESCL));
                    $('#txtAccountNameFooter').val((lang == "ar" ? AccountDetails.ACC_DESCA : AccountDetails.ACC_DESCL));
                    $("#divAccountNameFooter").removeClass("display_none");
                } else {
                    $('#txtAccNumber' + cnt).val("");
                    $('#txtAccName' + cnt).val("");
                    $('#txtAccountNameFooter').val("");
                    $('#txtCredit' + cnt).val("");
                    DisplayMassage("رقم الحساب غير صحيح ", "Wrong Account number ", MessageType.Error);
                } 
            }
            else {
                $('#txtAccNumber' + cnt).val("");
                $('#txtAccName' + cnt).val("");
                $('#txtAccountNameFooter').val("");
                $('#txtCredit' + cnt).val("");
                DisplayMassage("رقم الحساب غير صحيح ", "Wrong Account number ", MessageType.Error);
            }
        });

        //// Second Search
        $('#btnSearchCostCenter' + cnt).click(function (e) {
            let sys: SystemTools = new SystemTools();

            sys.FindKey(Modules.JournalVoucher, "btnCostCenterSearch", "COMP_CODE=" + CompCode + "and ACTIVE = 1 ", () => {
                let id = SearchGrid.SearchDataGrid.SelectedKey
                $('#txtCostCntrNum' + cnt).val(id);
                GetCostCenterByCode(id);
                $('#txtCostCntrName' + cnt).val((lang == "ar" ? CostCenterDetails.CC_DESCA : CostCenterDetails.CC_DESCE));
                $('#txtCostCntrNameFooter').val((lang == "ar" ? CostCenterDetails.CC_DESCA : CostCenterDetails.CC_DESCE));
                if ($("#txt_StatusFlag" + cnt).val() != "i")
                    $("#txt_StatusFlag" + cnt).val("u");
            });
        });
        $("#txtCostCntrNum" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");

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

        //Depit on change  
        $("#txtDebit" + cnt).on('keyup', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");

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

        //Credit on change   
        $("#txtCredit" + cnt).on('keyup', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");

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

        // Notes change
        $("#Notes" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");

        });

        $("#btn_minus" + cnt).on('click', function () {
            DeleteRow(cnt);
        });

        // on click Region to display Account And Cost Centers Names in Footer
        $("#No_Row" + cnt).on('click', function () {
            var AccCodeVal = $('#txtAccNumber' + cnt).val();
            var AccObj = AccountDetailsIst.filter(s => s.COMP_CODE == CompCode && s.ACC_CODE == AccCodeVal);
            if (AccObj.length > 0) {
                $("#divAccountNameFooter").removeClass("display_none");
                $("#txtAccountNameFooter").prop("value", (lang == "ar" ? AccObj[0].ACC_DESCA : AccObj[0].ACC_DESCL));
            } else {
                $("#txtAccountNameFooter").prop("value", "");
            }
            //GetAllCostCenters CostCentreDetailsIst
            var CC_CodeVal = $('#txtCostCntrNum' + cnt).val();
            var CCObj = CostCentreDetailsIst.filter(s => s.COMP_CODE == CompCode && s.CC_CODE == CC_CodeVal);
            if (CCObj.length > 0) {
                $("#divCostCntrNameFooter").removeClass("display_none");
                $("#txtCostCntrNameFooter").prop("value", lang == "ar" ? CCObj[0].CC_DESCA : CCObj[0].CC_DESCE);
            } else {
                //   $("#divCostCntrNameFooter").addClass("display_none");
                $("#txtCostCntrNameFooter").prop("value", "");
            }
        });


    }
    function DisplayBuildControls() {
         
    }
    function ComputeTotals() {

        let CountItems = 0;
        let PackageCount = 0;
        let txtUnitCosts = 0;
        let CountTotal = 0;
        debugger
        for (let i = 0; i < CountGrid; i++) {
            var flagvalue = $("#txt_StatusFlag" + i).val();
            if (flagvalue != "d" && flagvalue != "m") {

                PackageCount += Number($("#txtOnhandQty" + i).val());

                txtUnitCosts += (Number($("#txtUnitCost" + i).val()));

                CountTotal += Number($("#txtTotal" + i).val());


                CountItems++
            }
        }

        $("#txtItemCount").val(CountItems.RoundToSt(2));
        $("#txtPackageCount").val(PackageCount.RoundToSt(2));
        $("#txtUnitCosts").val(txtUnitCosts.RoundToSt(2));
        $("#txtTotal").val(CountTotal.RoundToSt(2));


    }
    function DeleteRow(RecNo: number) {
        if (!SysSession.CurrentPrivileges.Remove) return;
        WorningMessage("هل تريد الحذف؟", "Do you want to delete?", "تحذير", "worning", () => {

            var statusFlag = $("#txt_StatusFlag" + RecNo).val();
            if (statusFlag == "i")
                $("#txt_StatusFlag" + RecNo).val("m");
            else
                $("#txt_StatusFlag" + RecNo).val("d");

            // ComputeTotals();
            $("#txtItemNumber" + RecNo).val("99");
            $("#txtItemName" + RecNo).val("1");
            $("#txtOnhandQty" + RecNo).val("1");

            $("#No_Row" + RecNo).attr("hidden", "true");


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
            $("#txt_StatusFlag" + CountGrid).val("i"); //In Insert mode    
            $('._dis').removeAttr('disabled')
            $('.btn_minus_non').removeClass('display_none')
            CountGrid++; 
        }
    }

    //****************************************************Validation*********************************************
    function Validation_Grid(rowcount: number) {
         
        if ($("#txt_StatusFlag" + rowcount).val() == "d" || $("#txt_StatusFlag" + rowcount).val() == "m") {
            return true;
        } else {
             
            return true;
        }
    }
    function Validation() {

        return true;

    }
    //****************************************************Assign_Data*********************************************
    function Assign() {
        debugger
        Model = new A_RecPay_Tr_ReceiptNote();

        DocumentActions.AssignToModel(Model);//Insert Update
        //Model.Status = chkStatus.checked == true ? 1 : 0;


        Model.CustomerID = null;
        Model.VendorID = null;
        Model.ExpenseID = null;
        Model.FromCashBoxID = null;
        Model.BankAccountCode = null;

        if (Model.RecPayTypeId == 1) { Model.CustomerID = Number($('#txt_BenIDH').val()) }
        if (Model.RecPayTypeId == 2) { Model.VendorID = Number($('#txt_BenIDH').val()) }
        if (Model.RecPayTypeId == 3) { Model.BankAccountCode = $('#txt_BenIDH').val() }
        if (Model.RecPayTypeId == 4) { Model.ExpenseID = Number($('#txt_BenIDH').val()) }
        if (Model.RecPayTypeId == 5) { Model.FromCashBoxID = Number($('#txt_BenIDH').val()) }

        Model.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
        Model.UserCode = SysSession.CurrentEnvironment.UserCode;
        Model.CompCode = CompCode;
        Model.BranchCode = BranchCode;
        Model.TrType = TrType;
        Model.TrNo = Number($('#txt_CODE').val());
        Model.ReceiptID = Number($('#ReceiptID').val());
        Model.Comp_Code = CompCode.toString();
        Model.Branch_Code = BranchCode.toString();
        Model.TrDateH = '1';
    }
    function Update() {
        debugger
        if (!CheckDate(DateFormat(txtTrDate.value).toString(), DateFormat(SysSession.CurrentEnvironment.StartDate).toString(), DateFormat(SysSession.CurrentEnvironment.EndDate).toString())) {
            WorningMessage("  التاريخ ليس متطابق مع تاريخ المتاح (" + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ")", "Date does not match available date(" + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ")", "تحذير", "worning");
            return
        }
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("AccTrReceipt", "Update"),
            data: JSON.stringify(Model),
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    let res = result.Response as AProc_LnkGenerateTrans_Result
                    DisplayMassage("تم التعديل بنجاح", "Success", MessageType.Succeed);
                    Success(res.TRID, res);
                    Save_Succ_But();
                } else {
                    DisplayMassage("خطأء", "Error", MessageType.Error);
                }
            }
        });

    }
    function Open() {
        if (!CheckDate(DateFormat(txtTrDate.value).toString(), DateFormat(SysSession.CurrentEnvironment.StartDate).toString(), DateFormat(SysSession.CurrentEnvironment.EndDate).toString())) {
            WorningMessage("  التاريخ ليس متطابق مع تاريخ المتاح (" + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ")", "Date does not match available date(" + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ")", "تحذير", "worning");
            return
        }
        Assign();
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("AccTrReceipt", "Open"),
            data: JSON.stringify(Model),
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    let res = result.Response as AProc_LnkGenerateTrans_Result
                    DisplayMassage("تم فك الاعتماد بنجاح", "Success", MessageType.Succeed);
                    Success(res.TRID, res);
                    Save_Succ_But();
                } else {
                    DisplayMassage("خطأء", "Error", MessageType.Error);
                }
            }
        });

    }
    function Success(ReceiptID: number, res: AProc_LnkGenerateTrans_Result) {
        LnkTransDetails = LnkTransDetails.filter(x => x.TRID != ReceiptID);
        LnkTransDetails.push(res);
        LnkTransDetails = LnkTransDetails.sort(dynamicSort("TrNo"));
        TransactionsGrid.SelectedItem = res;
        $('#divGridShow').removeClass('display_none');
        $('#Div_control').addClass('display_none');
        TransactionsGrid.DataSource = LnkTransDetails;
        TransactionsGrid.Bind();
        CleanDetails();
        DisplayData(TransactionsGrid.SelectedItem)
        disabled();
    }
    //***************************************************************************Print*********************************************************     
    export function PrintReport(OutType: number) {
        // 
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

        Ajax.Callsync({
            url: Url.Action("IProc_Rpt_AccReceiptList", "GeneralReports"),
            data: rp,
            success: (d) => {

                let result = d.result as string;

                PrintReportLog(SysSession.CurrentEnvironment.UserCode, SysSession.CurrentEnvironment.CompCode, SysSession.CurrentEnvironment.BranchCode, Modules.AccTrReceiptNote, SysSession.CurrentEnvironment.CurrentYear);

                window.open(result);
                // window.close(result)
            }
        })
    }
    function PrintTransaction() {
        if (!SysSession.CurrentPrivileges.PrintOut) return;
        let rp: ReportParameters = new ReportParameters();

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
} 