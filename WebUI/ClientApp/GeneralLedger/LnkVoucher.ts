
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
    //////////////////////////////////////////print buttons////////////////////////////////////////////     
    var btnPrintTrview: HTMLButtonElement;
    var btnPrintTrPDF: HTMLButtonElement;
    var btnPrintTrEXEL: HTMLButtonElement;
    var btnPrintTransaction: HTMLButtonElement;
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
        //********************************onchange****************************    
        txtSearch.onkeyup = _SearchBox_Change;
        ddlTypeTrans.onchange = () => { Back(); $('#divGridShow').addClass('display_none'); $('#Div_control').addClass('display_none');}
        //*******************************print*****************************
        btnPrintTrview.onclick = () => { PrintReport(1); }
        btnPrintTrPDF.onclick = () => { PrintReport(2); }
        btnPrintTrEXEL.onclick = () => { PrintReport(3); }
        btnPrintTransaction.onclick = PrintTransaction;
    }
    function InitializeGrid() {
        let res: any = GetResourceList("");
        TransactionsGrid.ElementName = "TransactionsGrid";
        TransactionsGrid.OnRowDoubleClicked = GridDoubleClick;
        TransactionsGrid.PrimaryKey = "ROW_ID";
        TransactionsGrid.Paging = true;
        TransactionsGrid.PageSize = 15;
        TransactionsGrid.Sorting = true;
        TransactionsGrid.InsertionMode = JsGridInsertionMode.Binding;
        TransactionsGrid.Editing = false;
        TransactionsGrid.Inserting = false;
        TransactionsGrid.SelectedIndex = 1;
        TransactionsGrid.OnItemEditing = () => { };
        TransactionsGrid.Columns = [
            { title: "ROW_ID", name: "ROW_ID", type: "text", width: "5%", visible: false },
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
    //************************************************fillddl**************************************
    function GetData_Header() {
        var Table: Array<Table>;
        Table =
            [
                { NameTable: 'G_BRANCH', Condition: " COMP_CODE = " + CompCode + " " },
                { NameTable: 'GQ_GetLnkTransComp', Condition: " COMP_CODE = " + CompCode + " and INTEGRATE = 1 and Comp_INTEGRATE = 1 order by  SUB_SYSTEM_CODE Asc ,TR_CODE Asc " },
            ]

        DataResult(Table);
        //**************************************************************************************************************
        DocumentActions.FillCombowithdefult(GetDataTable('G_BRANCH'), ddlBranch, "BRA_CODE", "BRA_DESC", (lang == "ar" ? ' اختر الفرع' : 'Branch'));
        DocumentActions.FillCombowithdefult(GetDataTable('GQ_GetLnkTransComp'), ddlTypeTrans, "TR_CODE", "TR_DESCA", (lang == "ar" ? ' اختر الحركة' : 'TypeTrans'));

        ddlBranch.value = $('#ddbra').val();
        //ListLnkTrans = GetDataTable('GQ_GetLnkTransComp') as Array<GQ_GetLnkTransComp>;

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
        $('#id_div_Filter').addClass('disabledDiv')
        $('._None_Input').removeClass('display_none')
        //chkStatus.disabled = !SysSession.CurrentPrivileges.CUSTOM2;  
    }
    function disabled() {
        $('._dis').attr('disabled', 'disabled') 
        $('#id_div_Filter').removeClass('disabledDiv')
        $('._None_Input').addClass('display_none')
    }
    function CleanDetails() {
        $('#Div_control').removeClass('display_none');
        $("#Div_control :input").val("");
        txtTrDate.value = GetDate();
        //chkStatus.checked = false; 
    }
    //****************************************************DisplayDetails*********************************************
    function GridDoubleClick() {
        CleanDetails();
        DisplayDetails(TransactionsGrid.SelectedItem)
        disabled();
    }
    function DisplayDetails(Selecteditem: AProc_LnkGenerateTrans_Result) {
        DocumentActions.RenderFromModel(Selecteditem);
        txtTrDate.value = DateFormat(Selecteditem.TR_DATE);
        //chkStatus.checked = Selecteditem.Status == 1 ? true : false;   

        //if (chkStatus.checked == true) {
        //    btnUpdate.disabled = true;
        //    chkStatus.disabled = !SysSession.CurrentPrivileges.CUSTOM1;
        //}
        //else {
        //    btnUpdate.disabled = false;
        //    chkStatus.disabled = true;
        //}
         
    }
    //****************************************************Validation*********************************************
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
        DisplayDetails(TransactionsGrid.SelectedItem)
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