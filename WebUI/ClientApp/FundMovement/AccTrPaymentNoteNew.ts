
$(document).ready(() => {
    AccTrPaymentNoteNew.InitalizeComponent();
})

namespace AccTrPaymentNoteNew {
    var sys: SystemTools = new SystemTools();
    var SysSession: SystemSession = GetSystemSession(Modules.AccTrReceiptNote);
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);
    var TrType = 2;
    var codeType = "PayType";
    var Name_Not = (lang == "ar" ? 'صرف' : 'Receipt');

    var CompCode = Number(SysSession.CurrentEnvironment.CompCode);
    var BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);

    var ReportGrid: JsGrid = new JsGrid();
    var Details: Array<IQ_GetBoxReceiveList> = new Array<IQ_GetBoxReceiveList>();
    var Model: A_RecPay_Tr_ReceiptNote = new A_RecPay_Tr_ReceiptNote();

    var txtChargeWithVat: HTMLInputElement;
    var txtCharges: HTMLInputElement;
    var searchbutmemreport: HTMLInputElement;
    var txt_BenCodeF: HTMLInputElement;
    var txt_BenCodeH: HTMLInputElement;
    var txtProviderCode: HTMLInputElement;
    var txtTrDate: HTMLInputElement;
    var txtProviderIndDate: HTMLInputElement;
    var txtDueDate: HTMLInputElement;
    var txtDateFrom: HTMLInputElement;
    var txtDateTo: HTMLInputElement;
    var chkStatus: HTMLInputElement;
    var chkIsDeffered: HTMLInputElement;
    var txt_CashAmount: HTMLInputElement;
    var txt_CardAmount: HTMLInputElement;
    var txt_Amount: HTMLInputElement;
    var txtProviderInvoiceNo: HTMLInputElement;
    var txt_note: HTMLInputElement;
    var txtProviderName: HTMLInputElement;

    var txtCashTypeF: HTMLSelectElement;
    var txtCashTypeH: HTMLSelectElement;
    var txt_ReceiptNoteF: HTMLSelectElement;
    var txt_ReceiptNoteH: HTMLSelectElement;
    var txt_BankAcc_Code: HTMLSelectElement;
    var dbChargeBank: HTMLSelectElement;
    var dbCC_Code: HTMLSelectElement;
    var txt_Status: HTMLSelectElement;
    var txt_D_CashBoxF: HTMLSelectElement;
    var txt_D_CashBoxH: HTMLSelectElement;
    var dbChargeVatType: HTMLSelectElement;
    var dbProviderVatType: HTMLSelectElement;

    var btnBack: HTMLButtonElement;
    var btnShow: HTMLButtonElement;
    var btnAdd: HTMLButtonElement;
    var btnUpdate: HTMLButtonElement;
    var btnSave: HTMLButtonElement;
    var btnBenF: HTMLButtonElement;
    var btnBenH: HTMLButtonElement;
    var btnProv: HTMLButtonElement;
    //////////////////////////////////////////print buttons////////////////////////////////////////////     
    var btnPrintTrview: HTMLButtonElement;
    var btnPrintTrPDF: HTMLButtonElement;
    var btnPrintTrEXEL: HTMLButtonElement;
    var btnPrintTransaction: HTMLButtonElement;
    var btnSend: HTMLButtonElement;
    var btnPrintslip: HTMLButtonElement;
    var btnPrintsFrom_To: HTMLButtonElement;
    var Flag_IsNew = false;
    var ProviderName = "";
    var Type;
    export function InitalizeComponent() {
        document.getElementById('Screen_name').innerHTML = (lang == "ar" ? "سند " + Name_Not + "" : " " + Name_Not + "");
        InitalizeControls();
        InitalizeEvents();
        InitializeGrid();
        txtDateFrom.value = DateStartMonth();
        txtDateTo.value = ConvertToDateDash(GetDate()) <= ConvertToDateDash(SysSession.CurrentEnvironment.EndDate) ? GetDate() : SysSession.CurrentEnvironment.EndDate;
        fillddlCashBox();
        fillddlG_Codes();
        fillddlAcount_Code();
        fillddlVatType();
        fillddlChargeBank();
        fillddlCOST_CENTER();
    }
    function InitalizeControls() {
        btnShow = document.getElementById("btnShow") as HTMLButtonElement;
        btnAdd = document.getElementById("btnAdd") as HTMLButtonElement;
        btnUpdate = document.getElementById("btnUpdate") as HTMLButtonElement;
        btnSave = document.getElementById("btnSave") as HTMLButtonElement;
        btnBack = document.getElementById("btnBack") as HTMLButtonElement;
        btnBenF = document.getElementById("btnBenF") as HTMLButtonElement;
        btnBenH = document.getElementById("btnBenH") as HTMLButtonElement;
        btnProv = document.getElementById("btnProv") as HTMLButtonElement;
        ////////  
        txtCashTypeF = document.getElementById("txtCashTypeF") as HTMLSelectElement;
        txtCashTypeH = document.getElementById("txtCashTypeH") as HTMLSelectElement;
        txt_ReceiptNoteF = document.getElementById("txt_ReceiptNoteF") as HTMLSelectElement;
        txt_ReceiptNoteH = document.getElementById("txt_ReceiptNoteH") as HTMLSelectElement;
        txt_D_CashBoxH = document.getElementById("txt_D_CashBoxH") as HTMLSelectElement;
        txt_D_CashBoxF = document.getElementById("txt_D_CashBoxF") as HTMLSelectElement;
        dbChargeVatType = document.getElementById("dbChargeVatType") as HTMLSelectElement;
        dbProviderVatType = document.getElementById("dbProviderVatType") as HTMLSelectElement;
        txt_BankAcc_Code = document.getElementById("txt_BankAcc_Code") as HTMLSelectElement;
        dbChargeBank = document.getElementById("dbChargeBank") as HTMLSelectElement;
        dbCC_Code = document.getElementById("dbCC_Code") as HTMLSelectElement;
        txt_Status = document.getElementById("txt_Status") as HTMLSelectElement;
        ////////
        txt_BenCodeF = document.getElementById("txt_BenCodeF") as HTMLInputElement;
        txt_BenCodeH = document.getElementById("txt_BenCodeH") as HTMLInputElement;
        txtProviderCode = document.getElementById("txtProviderCode") as HTMLInputElement;
        txt_CashAmount = document.getElementById("txt_CashAmount") as HTMLInputElement;
        txt_CardAmount = document.getElementById("txt_CardAmount") as HTMLInputElement;
        txt_Amount = document.getElementById("txt_Amount") as HTMLInputElement;
        txtProviderInvoiceNo = document.getElementById("txtProviderInvoiceNo") as HTMLInputElement;
        txt_note = document.getElementById("txt_note") as HTMLInputElement;
        txtProviderName = document.getElementById("txtProviderName") as HTMLInputElement;
        txtTrDate = document.getElementById("txtTrDate") as HTMLInputElement;
        txtProviderIndDate = document.getElementById("txtProviderIndDate") as HTMLInputElement;
        txtDueDate = document.getElementById("txtDueDate") as HTMLInputElement;
        chkStatus = document.getElementById("chkStatus") as HTMLInputElement;
        chkIsDeffered = document.getElementById("chkIsDeffered") as HTMLInputElement;
        txtCharges = document.getElementById("txtCharges") as HTMLInputElement;
        txtChargeWithVat = document.getElementById("txtChargeWithVat") as HTMLInputElement;
        searchbutmemreport = document.getElementById("searchbutmemreport") as HTMLInputElement;
        txtDateFrom = document.getElementById("txtDateFrom") as HTMLInputElement;
        txtDateTo = document.getElementById("txtDateTo") as HTMLInputElement;
        //print 
        btnPrintTrview = document.getElementById("btnPrintTrview") as HTMLButtonElement;
        btnPrintTrPDF = document.getElementById("btnPrintTrPDF") as HTMLButtonElement;
        btnPrintTrEXEL = document.getElementById("btnPrintTrEXEL") as HTMLButtonElement;
        btnPrintTransaction = document.getElementById("btnPrintTransaction") as HTMLButtonElement;
        btnSend = document.getElementById("btnSend") as HTMLButtonElement;
        btnPrintslip = document.getElementById("btnPrintslip") as HTMLButtonElement;
        btnPrintsFrom_To = document.getElementById("btnPrintsFrom_To") as HTMLButtonElement;
    }
    function InitalizeEvents() {
        //********************************Btn****************************
        btnShow.onclick = btnShow_onclick;
        btnAdd.onclick = btnAdd_onclick;
        btnSave.onclick = btnSave_onClick;
        btnBack.onclick = btnBack_onclick;
        btnUpdate.onclick = btnUpdate_onclick;
        btnBenF.onclick = () => { btnBen_onclick('F') }
        btnBenH.onclick = () => { btnBen_onclick('H') }
        btnProv.onclick = btnProv_onclick;
        //********************************onchange****************************
        txt_BenCodeF.onchange = () => { BenCode_onchange('F') }
        txt_BenCodeH.onchange = () => { BenCode_onchange('H') }
        txt_ReceiptNoteF.onchange = () => { CleanBen('F') }
        txt_ReceiptNoteH.onchange = () => { CleanBen('H'); CleanDiv_Charge_Provider(); }
        txt_CashAmount.onkeyup = () => { txt_Amount.value = (Number(txt_CashAmount.value) + Number(txt_CardAmount.value)).RoundToSt(2); }
        txt_CardAmount.onkeyup = () => { txt_Amount.value = (Number(txt_CashAmount.value) + Number(txt_CardAmount.value)).RoundToSt(2); }
        searchbutmemreport.onkeyup = _SearchBox_Change;
        txtCashTypeH.onchange = txtCashTypeH_onchange;
        chkIsDeffered.onchange = chkIsDeffered_onchange;
        chkStatus.onchange = chkStatus_onchange;
        txtProviderName.onchange = txtProviderName_onchange;
        dbChargeVatType.onchange = () => { CalculatorCharges(false) }
        txtCharges.onkeyup = () => { CalculatorCharges(false) }
        txtChargeWithVat.onkeyup = () => { CalculatorCharges(true) }
        dbProviderVatType.onchange = CalculatorProvider;
        txtProviderCode.onchange = () => { getProVndById($('#txtProviderCode').val(), true); }
        dbChargeBank.onchange = () => { Mode_Charge();}
        txt_Amount.onkeyup = () => { $('#Provider_Div').is(":hidden") == false ? CalculatorProvider() : "" }
        txtProviderInvoiceNo.onkeyup = () => { CalculatorProvider() }
        dbCC_Code.onchange = () => { CalculatorProvider() }
        //*******************************print*****************************
        btnPrintTrview.onclick = () => { PrintReport(1); }
        btnPrintTrPDF.onclick = () => { PrintReport(2); }
        btnPrintTrEXEL.onclick = () => { PrintReport(3); }
        btnPrintTransaction.onclick = PrintTransaction;
        btnPrintslip.onclick = btnPrintslip_onclick;
        btnPrintsFrom_To.onclick = btnPrintsFrom_To_onclick;
    }
    function InitializeGrid() {
        let res: any = GetResourceList("");
        ReportGrid.OnRowDoubleClicked = GridDoubleClick;
        ReportGrid.ElementName = "ReportGrid";
        ReportGrid.PrimaryKey = "ReceiptID";
        ReportGrid.Paging = true;
        ReportGrid.PageSize = 10;
        ReportGrid.Sorting = true;
        ReportGrid.InsertionMode = JsGridInsertionMode.Binding;
        ReportGrid.Editing = false;
        ReportGrid.Inserting = false;
        ReportGrid.SelectedIndex = 1;
        ReportGrid.OnItemEditing = () => { };
        ReportGrid.Columns = [
            { title: "الرقم", name: "ReceiptID", type: "text", width: " ", visible: false },
            { title: "رقم السند", name: "TrNo", type: "text", width: "11%" },
            {
                title: res.App_date, css: "ColumPadding", name: "TrDate", width: "10%",
                itemTemplate: (s: string, item: IQ_GetBoxReceiveList): HTMLLabelElement => {
                    let txt: HTMLLabelElement = document.createElement("label");
                    txt.innerHTML = DateFormat(item.TrDate);
                    return txt;
                }
            },
            { title: res.App_Receipt_Type, name: (lang == "ar" ? "Type_DescA" : "Type_DescE"), type: "text", width: "11%" },
            { title: res.App_beneficiary_no, name: "Bef_Code", type: "text", width: "11%" },
            { title: res.App_beneficiary, name: "Bef_DescA", type: "text", width: "20%" },
            { title: res.App_Amount, name: "Amount", type: "text", width: "11%" },
            { title: 'مورد الخدمه', name: "ProviderName", type: "text", width: "17%" },
            { title: 'رسوم بنكية', name: "ChargeWithVat", type: "Number", width: "11%" },
            {
                title: res.App_Certified, css: "ColumPadding", name: "statusDesciption", width: "7%",
                itemTemplate: (s: string, item: IQ_GetBoxReceiveList): HTMLLabelElement => {
                    let txt: HTMLLabelElement = document.createElement("label");
                    txt.innerHTML = item.Status == 1 ? (lang == "ar" ? "معتمد" : "A certified") : (lang == "ar" ? "غير معتمد" : "Not supported");;
                    return txt;
                }
            },

        ];
        ReportGrid.Bind();
        
    }
    //************************************************fillddl**************************************
    function fillddlCashBox() {
        let CashBoxID = 0;
        if (SysSession.CurrentEnvironment.UserType == 2 || SysSession.CurrentEnvironment.UserType == 3) {

            CashBoxID = SysSession.CurrentEnvironment.CashBoxID == null ? 0 : SysSession.CurrentEnvironment.CashBoxID;
        }
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefBox", "GetAllRec"),
            data: { compCode: CompCode, CashBoxID: CashBoxID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    let fillModel_CashBox = result.Response as Array<A_RecPay_D_CashBox>;
                    let box = fillModel_CashBox.filter(x => x.BranchCode == BranchCode)
                    DocumentActions.FillCombowithdefult(box, txt_D_CashBoxF, "CashBoxID", (lang == "ar" ? 'CashBox_DescA' : 'CashBox_DescE'), (lang == "ar" ? 'اختر الصندوق' : 'Box'));
                    DocumentActions.FillCombowithdefult(fillModel_CashBox, txt_D_CashBoxH, "CashBoxID", (lang == "ar" ? 'CashBox_DescA' : 'CashBox_DescE'), (lang == "ar" ? 'اختر الصندوق' : 'Box'));
                }
            }
        });
    }
    function fillddlG_Codes() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GCodes", "GetAll_GCodes"),
            data: {
                UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    let fillModel_GCodes = result.Response as Array<G_Codes>;
                    let ChckType = fillModel_GCodes.filter(x => x.CodeType == 'ChckType');

                    DocumentActions.FillCombowithdefult(ChckType, txtCashTypeF, "CodeValue", (lang == "ar" ? 'DescA' : 'DescE'), (lang == "ar" ? 'اختر نوع النقد' : 'Type of constraint'));
                    DocumentActions.FillCombowithdefult(ChckType, txtCashTypeH, "CodeValue", (lang == "ar" ? 'DescA' : 'DescE'), (lang == "ar" ? 'اختر نوع النقد' : 'Type of constraint'));

                    Type = fillModel_GCodes.filter(x => x.CodeType == codeType);

                    DocumentActions.FillCombowithdefult(Type, txt_ReceiptNoteF, "CodeValue", (lang == "ar" ? 'DescA' : 'DescE'), (lang == "ar" ? "اختر نوع " + Name_Not + "" : 'Type of constraint'));
                    DocumentActions.FillCombowithdefult(Type, txt_ReceiptNoteH, "CodeValue", (lang == "ar" ? 'DescA' : 'DescE'), (lang == "ar" ? "اختر نوع " + Name_Not + "" : 'Type of constraint'));

                }
            }
        });
    }
    function fillddlAcount_Code() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GLDefAccount", "GetBankAcc"),
            data: {
                CompCode: CompCode, AccType: 3, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    let Model_Acount = result.Response as Array<A_ACCOUNT>;
                    DocumentActions.FillCombowithdefult(Model_Acount, txt_BankAcc_Code, "ACC_CODE", (lang == "ar" ? 'ACC_DESCA' : 'ACC_DESCL'), (lang == "ar" ? 'اختر حساب الصرف' : 'Type of constraint'));

                }
            }
        });
    }
    function fillddlVatType() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GenVatType", "GetAll"),
            data: {
                CompCode: CompCode, VatType: 1, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    let VatTypeDetails = result.Response as Array<A_D_VAT_TYPE>;
                    for (var i = 0; i < VatTypeDetails.length; i++) {
                        $('#dbChargeVatType').append('<option data_VatPerc="' + VatTypeDetails[i].VatPerc + '" value="' + VatTypeDetails[i].CODE + '">' + VatTypeDetails[i].DESCRIPTION + '</option>');
                        $('#dbProviderVatType').append('<option data_VatPerc="' + VatTypeDetails[i].VatPerc + '" value="' + VatTypeDetails[i].CODE + '">' + VatTypeDetails[i].DESCRIPTION + '</option>');
                    }

                }
            }
        });
    }
    function fillddlChargeBank() {
        let query = "select * from [dbo].[A_G_Vendor]";
        let NameTable = "A_G_Vendor";
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("SystemTools", "Get_Table"),
            data: {
                query: query, NameTable: NameTable
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    let ListBank = result.Response as Array<A_G_Vendor>;
                    DocumentActions.FillCombowithdefult(ListBank, dbChargeBank, "VendorID", (lang == "ar" ? 'NAMEA' : 'NAMEL'), (lang == "ar" ? 'بدون رسوم بنكية' : 'Bank'));

                }
            }
        });
    }
    function fillddlCOST_CENTER() {
        let query = "select * from G_COST_CENTER where COMP_CODE = " + CompCode + "";
        let NameTable = "G_COST_CENTER";
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("SystemTools", "Get_Table"),
            data: {
                query: query, NameTable: NameTable
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    let ListCOST = result.Response as Array<G_COST_CENTER>;
                    DocumentActions.FillCombowithdefult(ListCOST, dbCC_Code, "CC_CODE", (lang == "ar" ? 'CC_DESCA' : 'CC_DESCE'), (lang == "ar" ? 'اختر التكلفة' : 'COST'));

                }
            }
        });
    }
    //************************************************Btn_Events**********************************
    function btnBen_onclick(Type: string) {
        debugger
        if ($('#txt_ReceiptNote' + Type).val() == "null") { DisplayMassage("برجاء اختيار نوع الصرف", "", MessageType.Worning); Errorinput($('#txt_ReceiptNote' + Type)) }
        if ($('#txt_ReceiptNote' + Type).val() == "1") { BenCust(Type); }
        if ($('#txt_ReceiptNote' + Type).val() == "2") { BenVnd(Type); }
        if ($('#txt_ReceiptNote' + Type).val() == "3") { BenBank(Type); }
        if ($('#txt_ReceiptNote' + Type).val() == "4") { BenAcc(Type); }
        if ($('#txt_ReceiptNote' + Type).val() == "5") { BenBox(Type); }
        if ($('#txt_ReceiptNote' + Type).val() == "6") { BenAcc(Type); }
    }
    function btnProv_onclick() {
        let cond = " CompCode= " + CompCode + "and IsCreditVendor = 1 and Isactive = 1";
        sys.FindKey(Modules.AccTrReceiptNote, "btnVndSrch", cond, () => {
            let id = SearchGrid.SearchDataGrid.SelectedKey;
            getProVndById(id, false);
        });
    }
    function btnShow_onclick() {

        let BenID = Number($('#txt_BenIDF').val())
        let Boxid = txt_D_CashBoxF.value == 'null' ? 0 : Number(txt_D_CashBoxF.value);
        let Status = txt_Status.value;
        let RecPayTypeId = txt_ReceiptNoteF.value == 'null' ? 0 : Number(txt_ReceiptNoteF.value);
        let DateFrom = DateFormatRep(txtDateFrom.value);
        let DateTo = DateFormatRep(txtDateTo.value);
        let CashType = txtCashTypeF.value == "null" ? -1 : Number(txtCashTypeF.value);

        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccTrReceipt", "GetBoxReceiveListNew"),
            data: {
                comp: CompCode, BenID: BenID, TrType: TrType, Boxid: Boxid, RecPayTypeId: RecPayTypeId, Status: Status, FromDate: DateFrom, Todate: DateTo, CashType: CashType, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token, MODULE_CODE: Modules.AccTrReceiptNote, FinYear: SysSession.CurrentEnvironment.CurrentYear, BranchCode: SysSession.CurrentEnvironment.BranchCode
            }, //int comp, int BenID, int TrType, int? Boxid, int? RecPayTypeId, string Status, string FromDate, string Todate, int? CashType, string UserCode, string Token, string FinYear, string MODULE_CODE, string BranchCode
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    Details = result.Response as Array<IQ_GetBoxReceiveList>;
                    $('#id_ReportGrid').removeClass('display_none');
                    $('#Div_control').addClass('display_none');
                    ReportGrid.DataSource = Details;
                    ReportGrid.Bind();

                }
            }
        });
    }
    function btnAdd_onclick() {
        CleanDetails();
        Enabled();
        Flag_IsNew = true;
    }
    function btnSave_onClick() {
        loading('btnSave');

        setTimeout(function () {

            finishSave('btnSave');
            if (!Validation()) {
                return;
            }

            if (Flag_IsNew == true) {
                $("#txtCreatedBy").val(SysSession.CurrentEnvironment.UserCode);
                $("#txtCreatedAt").val(DateTimeFormat(Date().toString()));
                Assign();
                Insert();
            }
            else {
                $("#txtUpdatedBy").val(SysSession.CurrentEnvironment.UserCode);
                $("#txtUpdatedAt").val(DateTimeFormat(Date().toString()));
                Assign();
                Update();
            }
        }, 100);
    }
    function btnBack_onclick() {

        if (Flag_IsNew == true) {
            $('#Div_control').addClass('display_none');
            disabled();
        }
        else {
            GridDoubleClick();
        }
    }
    function btnUpdate_onclick() {
        Enabled();

    }
    //************************************************Change_Events**********************************
    function BenCode_onchange(Type: string) {
        debugger
        if ($('#txt_ReceiptNote' + Type).val() == "null") { DisplayMassage("برجاء اختيار نوع الصرف", "", MessageType.Worning); Errorinput($('#txt_ReceiptNote' + Type)) }
        if ($('#txt_ReceiptNote' + Type).val() == "1") { getAccountCustById(Type, $('#txt_BenCode' + Type).val(), true); }
        if ($('#txt_ReceiptNote' + Type).val() == "2") { getAccountVndById(Type, $('#txt_BenCode' + Type).val(), true); }
        if ($('#txt_ReceiptNote' + Type).val() == "3") { getAccountBankById(Type, $('#txt_BenCode' + Type).val(), true); }
        if ($('#txt_ReceiptNote' + Type).val() == "4") { getAccountAccById(Type, $('#txt_BenCode' + Type).val(), true); }
        if ($('#txt_ReceiptNote' + Type).val() == "5") { getAccountBoxById(Type, $('#txt_BenCode' + Type).val(), true); }
        if ($('#txt_ReceiptNote' + Type).val() == "6") { getAccountAccById(Type, $('#txt_BenCode' + Type).val(), true); }
    }
    function _SearchBox_Change() {
        $("#ReportGrid").jsGrid("option", "pageIndex", 1);

        if (searchbutmemreport.value != "") {
            let search: string = searchbutmemreport.value.toLowerCase();
            let SearchDetails = Details.filter(x => x.TrNo.toString().search(search) >= 0 || x.Bef_Code.toString().search(search) >= 0 || x.Bef_DescA.toLowerCase().search(search) >= 0);

            ReportGrid.DataSource = SearchDetails;
            ReportGrid.Bind();
        } else {
            ReportGrid.DataSource = Details;
            ReportGrid.Bind();
        }
    }
    function txtCashTypeH_onchange() {

        $('._dis_Bank').attr('disabled', 'disabled');
        $('#Charge_Div').addClass('display_none');
        $('#Provider_Div').addClass('display_none');
        $('#txt_CheckNo').removeClass('display_none');
        $('#txt_TransferNo').addClass('display_none');
        $('._Card').addClass('display_none');
        $('._Cash').addClass('display_none');
        $('#txt_CheckNo').val('');
        $('#txt_TransferNo').val('');
        $('#txt_CardAmount').val('0');
        $('#txt_CashAmount').val('0');
        $('#txt_Amount').val('');
        $('#txt_BankName').val('');
        $('#txt_BankAcc_Code').val('null');
        chkIsDeffered.checked = false;
        txtDueDate.value = GetDate();
        $('#txt_Amount').attr('disabled', 'disabled');
        $('#txtDueDate').attr('disabled', 'disabled');

        DocumentActions.FillCombowithdefult(Type, txt_ReceiptNoteH, "CodeValue", (lang == "ar" ? 'DescA' : 'DescE'), (lang == "ar" ? "اختر نوع " + Name_Not + "" : 'Type of constraint'));
        $('#txt_ReceiptNoteH option[value="6"]').remove()

        if (txtCashTypeH.value == '0') {  // نقدي 
            $('._Cash').removeClass('display_none');
        }
        else if (txtCashTypeH.value == '8') { //تحصيل شبكة  
            $('._Card').removeClass('display_none');
        }
        else { // الجميع 

            $('._dis_Bank').removeAttr('disabled');
            $('#txt_Amount').removeAttr('disabled');

            if (txtCashTypeH.value != '9') {
                $('#Charge_Div').removeClass('display_none');
            }

            if (txtCashTypeH.value == '1' || txtCashTypeH.value == '2') {
                $('#txt_CheckNo').addClass('display_none');
                $('#txt_TransferNo').removeClass('display_none');
            }

        }


        if (txt_ReceiptNoteH.value == '4' || txt_ReceiptNoteH.value == '6') {
            $('#Provider_Div').removeClass('display_none');
        }

        if (txtCashTypeH.value == '9') {
            $('#txt_ReceiptNoteH').html('');
            $('#txt_ReceiptNoteH').append('<option value="6">مصروف مستحق</option>');
            txt_ReceiptNoteH.value = '6';
            Mode_CashType();
            $('._dis_Bank').attr('disabled', 'disabled');  
        }
        else {
            txt_ReceiptNoteH.value = 'null';
        }


        CleanBen('H'); CleanDiv_Charge_Provider();
    }
    function chkIsDeffered_onchange() {

        if (chkIsDeffered.checked == true) {

            txt_note.disabled == false ? $('#txtDueDate').removeAttr('disabled') : $('#txtDueDate').attr('disabled', 'disabled');

        }
        else {
            $('#txtDueDate').attr('disabled', 'disabled');

        }

    }
    function chkStatus_onchange() {
        if (chkStatus.checked == false) {
            txt_note.disabled == true ? Open() : null;
        }
    }
    function CalculatorCharges(Calculat_WithVAT: boolean) {
        debugger

        if (dbChargeVatType.value == 'null') {
            $("#txtCharges").val('');
            $("#txtChargesVat").val('');
            $("#txtChargeWithVat").val('');
            Errorinput(dbChargeVatType);
            return
        }

        let VatPrc = $('option:selected', $("#dbChargeVatType")).attr('data_VatPerc')
        $("#txtChargesVatPrc").val(VatPrc);

        if (Calculat_WithVAT) { // تجميع مع الضريبه

            var NetPrice = Number($("#txtChargeWithVat").val());
            let GetUnitprice: IGetunitprice = Get_PriceWithVAT(NetPrice, Number(VatPrc), true);

            $("#txtCharges").val((GetUnitprice.unitprice).RoundToSt(2));
        }

        let Vat = (Number($("#txtCharges").val()) * Number(VatPrc)) / 100;
        $("#txtChargesVat").val(Vat.RoundToSt(2));

        if (!Calculat_WithVAT) {
            let Net = (Number($("#txtCharges").val()) + Number($("#txtChargesVat").val())).RoundToSt(2);
            $("#txtChargeWithVat").val(Number(Net));
        }



    }
    function CalculatorProvider() {
        debugger

        if ($("#dbProviderVatType").val() == 'null') {
            $("#txtProviderVatPrc").val('');
            $("#txtProviderVatAmount").val('');
            $("#txtProviderAmountBeforeVat").val('');
            return;
        }

        if (Number($("#txt_Amount").val()) == 0) {
            Errorinput($("#txt_Amount"));
        }

        let VatPrc = $('option:selected', $("#dbProviderVatType")).attr('data_VatPerc')
        $("#txtProviderVatPrc").val(VatPrc);


        var NetPrice = Number($("#txt_Amount").val());
        let GetUnitprice: IGetunitprice = Get_PriceWithVAT(NetPrice, Number(VatPrc), true);

        $("#txtProviderAmountBeforeVat").val((GetUnitprice.unitprice).RoundToSt(2));


        let Vat = (Number($("#txtProviderAmountBeforeVat").val()) * Number(VatPrc)) / 100;
        $("#txtProviderVatAmount").val(Vat.RoundToSt(2));


    }
    function txtProviderName_onchange() {

        if (txtProviderName.value.trim() != ProviderName.trim()) {
            $('#txtProviderCode').val('');
            $('#txtProviderID').val('');
            $('#txtProviderVatNo').val('');
        }

    }
    //****************************************************Customer*********************************************
    function BenCust(Type: string) {

        let cond = Type == 'H' ? "and Isactive = 1" : "";
        if (SysSession.CurrentEnvironment.I_Control[0].IsLocalBranchCustomer == true) { cond = cond + " and BranchCode=" + BranchCode; }

        sys.FindKey(Modules.AccTrReceiptNote, "btnCustSrch", "CompCode= " + CompCode + "" + cond, () => {
            var id = SearchGrid.SearchDataGrid.SelectedKey;

            getAccountCustById(Type, id, false);
        });
    }
    function getAccountCustById(Type: string, custId: string, code: boolean) {
        debugger
        if (custId.toString().trim() == '') {
            CleanBen(Type)
            Errorinput($('#txt_BenCode' + Type));
            DisplayMassage("كود العميل غير صحيح", "Wrong Customer code", MessageType.Error);
            return
        }

        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefCustomer", "GetCustomerByCustomerId_code"),
            data: { Compcode: CompCode, BranchCode: BranchCode, code: code, CustomerId: custId.toString().trim(), UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                debugger
                if (result.IsSuccess) {
                    let Model_Cust = result.Response as Array<IQ_GetCustomer>;
                    if (Model_Cust.length == 0) {

                        CleanBen(Type)
                        Errorinput($('#txt_BenCode' + Type));
                        DisplayMassage("كود العميل غير صحيح", "Wrong Customer code", MessageType.Error);

                    }
                    else {
                        $('#txt_BenCode' + Type).val(Model_Cust[0].CustomerCODE);
                        $('#txt_BenName' + Type).val(Model_Cust[0].NAMEA);
                        $('#txt_Openbalance' + Type).val(Model_Cust[0].Openbalance);
                        $('#txt_BenID' + Type).val(Model_Cust[0].CustomerId);
                    }

                }

            }
        });

    }
    //****************************************************Vendors**********************************************
    function BenVnd(Type: string) {
        //var cond = " CompCode= " + CompCode.toString() + " and IsCreditVendor = 1";
        //cond = cond + Type == 'H' ? "and Isactive = 1" : "";
        debugger; 
        sys.FindKey(Modules.AccTrReceiptNote, "btnVndSrch", " CompCode= " + CompCode + " and IsCreditVendor = 1 " + (Type =='H' ? "and Isactive = 1" : "") , () => {
            let id = SearchGrid.SearchDataGrid.SelectedKey;
            getAccountVndById(Type, id, false);
        });

    }
    function getAccountVndById(Type: string, VenId: string, code: boolean) {

        if (VenId.toString().trim() == '') {
            CleanBen(Type)
            Errorinput($('#txt_BenCode' + Type));
            DisplayMassage("كود المورد غير صحيح", "Wrong Customer code", MessageType.Error);
            return
        }


        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefVendor", "GetVendorByvndId_code"),
            data: { Compcode: CompCode, code: code, VendorID: VenId.toString().trim(), UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {

                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    let Model_Vnd = result.Response as Array<A_Pay_D_Vendor>;
                    if (Model_Vnd.length == 0) {

                        CleanBen(Type)
                        Errorinput($('#txt_BenCode' + Type));
                        DisplayMassage("كود المورد غير صحيح", "Wrong Customer code", MessageType.Error);
                    }
                    else {
                        $('#txt_BenCode' + Type).val(Model_Vnd[0].VendorCode);
                        $('#txt_BenName' + Type).val(Model_Vnd[0].NAMEA);
                        $('#txt_Openbalance' + Type).val(Model_Vnd[0].Openbalance);
                        $('#txt_BenID' + Type).val(Model_Vnd[0].VendorID);

                    }

                }

            }
        });

    }
    //****************************************************Bank*************************************************
    function BenBank(Type: string) {
        debugger
        let cond = " COMP_CODE= " + CompCode + "and ACC_TYPE = 3";
        cond += Type == 'H' ? " and ACC_ACTIVE = 1" : "";

        sys.FindKey(Modules.AccTrReceiptNote, "btnbankSearch", cond, () => {
            var id = SearchGrid.SearchDataGrid.SelectedKey;
            getAccountBankById(Type, id, true);
        });
    }
    function getAccountBankById(Type: string, BankId: string, code: boolean) {
        debugger
        if (BankId.toString().trim() == '') {
            CleanBen(Type)
            Errorinput($('#txt_BenCode' + Type));
            DisplayMassage("كود الحساب غير صحيح", "Wrong Acc code", MessageType.Error);
            return
        }
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GLDefAccount", "GetByAccCode"),
            data: { CompCode: CompCode, AccCode: BankId.toString().trim(), UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    let Model_Bank = result.Response as A_ACCOUNT;
                    debugger
                    if (Model_Bank == null) {

                        CleanBen(Type)
                        Errorinput($('#txt_BenCode' + Type));
                        DisplayMassage("كود الحساب غير صحيح", "Wrong Bank code", MessageType.Error);
                    }
                    else {
                        $('#txt_BenCode' + Type).val(Model_Bank.ACC_CODE);
                        $('#txt_BenName' + Type).val(Model_Bank.ACC_DESCA);
                        $('#txt_Openbalance' + Type).val(0);
                        $('#txt_BenID' + Type).val(Model_Bank.ACC_CODE);
                    }
                }


            }
        });

    }
    //****************************************************Bank*************************************************
    function BenAcc(Type: string) {

        sys.FindKey(Modules.AccTrReceiptNote, "btnAccBen", "CompCode= " + CompCode + " and TrType = 2 ", () => {
            var id = SearchGrid.SearchDataGrid.SelectedKey;

            getAccountAccById(Type, id, false);
        });
    }
    function getAccountAccById(Type: string, AccId: string, code: boolean) {

        debugger
        if (AccId.toString().trim() == '') {
            CleanBen(Type)
            Errorinput($('#txt_BenCode' + Type));
            DisplayMassage("كود الحساب غير صحيح", "Wrong Acc code", MessageType.Error);
            return
        }
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefAccounts", "GetPayByCode_and_byid"),
            data: { CompCode: CompCode, id: AccId.toString().trim(), code: code, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {

                    let Model_Acc = result.Response as Array<A_RecPay_D_Accounts>;
                    if (Model_Acc.length == 0) {

                        CleanBen(Type)
                        Errorinput($('#txt_BenCode' + Type));
                        DisplayMassage("كود الحساب غير صحيح", "Wrong Bank code", MessageType.Error);
                    }
                    else {
                        $('#txt_BenCode' + Type).val(Model_Acc[0].ExpCode);
                        $('#txt_BenName' + Type).val(Model_Acc[0].ExpDescA);
                        $('#txt_Openbalance' + Type).val(0);
                        $('#txt_BenID' + Type).val(Model_Acc[0].ExpenseID);
                    }

                }

            }
        });

    }
    //****************************************************Box**************************************************
    function BenBox(Type: string) {
        debugger
        let cond = "CompCode= " + CompCode;
        cond += Type == 'H' ? " and IsActive = 1" : "";

        sys.FindKey(Modules.AccTrReceiptNote, "btnBoxSearch", cond, () => {
            var id = SearchGrid.SearchDataGrid.SelectedKey;
            getAccountBoxById(Type, id, false);
        });
    }
    function getAccountBoxById(Type: string, BoxId: string, code: boolean) {
        debugger
        if (BoxId.toString().trim() == '') {
            CleanBen(Type)
            Errorinput($('#txt_BenCode' + Type));
            DisplayMassage("كود الصندوق غير صحيح", "Wrong Acc code", MessageType.Error);
            return
        }
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefBox", "GetByIdpaynote"),
            data: { code: code, compCode: CompCode, BranchCode: BranchCode, CashBoxID: BoxId.toString().trim(), UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    let Model_Box = result.Response as Array<A_RecPay_D_CashBox>;
                    if (Model_Box.length == 0) {

                        CleanBen(Type)
                        Errorinput($('#txt_BenCode' + Type));
                        DisplayMassage("كود الصندوق غير صحيح", "Wrong CashBox code", MessageType.Error);

                    }
                    else {
                        $('#txt_BenCode' + Type).val(Model_Box[0].CashBoxID);
                        $('#txt_BenName' + Type).val(Model_Box[0].CashBox_DescA);
                        $('#txt_Openbalance' + Type).val(0);
                        $('#txt_BenID' + Type).val(Model_Box[0].CashBoxID);

                    }

                }

            }
        });

    }
    //****************************************************Provider********************************************* 
    function getProVndById(VenId: string, code: boolean) {

        $('#txtProviderCode').val('');
        $('#txtProviderName').val('');
        $('#txtProviderID').val('');
        $('#txtProviderVatNo').val('');


        if (VenId.toString().trim() == '') {
            Errorinput($('#txtProviderCode'));
            DisplayMassage("كود المورد غير صحيح", "Wrong Customer code", MessageType.Error);
            return
        }


        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefVendor", "GetVendorByvndId_code"),
            data: { Compcode: CompCode, code: code, VendorID: VenId.toString().trim(), UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {

                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    let Model_Vnd = result.Response as Array<A_Pay_D_Vendor>;
                    if (Model_Vnd.length == 0) {

                        Errorinput($('#txtProviderCode'));
                        DisplayMassage("كود المورد غير صحيح", "Wrong Customer code", MessageType.Error);
                    }
                    else {
                        $('#txtProviderCode').val(Model_Vnd[0].VendorCode);
                        $('#txtProviderName').val(Model_Vnd[0].NAMEA);
                        ProviderName = Model_Vnd[0].NAMEA;
                        $('#txtProviderID').val(Model_Vnd[0].VendorID);
                        $('#txtProviderVatNo').val(Model_Vnd[0].VATNo);
                        $('#dbProviderVatType').val(Model_Vnd[0].VATType);
                        CalculatorProvider();

                    }

                }

            }
        });

    }
    //****************************************************CleanInput*******************************************
    function CleanBen(Type: string) {

        $('#txt_BenCode' + Type).val("");
        $('#txt_BenName' + Type).val("");
        $('#txt_Openbalance' + Type).val("");
        $('#txt_BenID' + Type).val("");

        if (txt_ReceiptNoteH.value == '4' || txt_ReceiptNoteH.value == '6') {
            $('#Provider_Div').removeClass('display_none');
        }
        else {
            $('#Provider_Div').addClass('display_none');
        }
    }
    function Enabled() {
        $('._dis').removeAttr('disabled')
        $('#chkIsDeffered').removeAttr('disabled')
        $('#id_div_Filter').addClass('disabledDiv')
        chkStatus.disabled = !SysSession.CurrentPrivileges.CUSTOM2;
        chkIsDeffered.checked == true ? $('#txtDueDate').removeAttr('disabled') : $('#txtDueDate').attr('disabled', 'disabled');

        if (txtCashTypeH.value != '0' && txtCashTypeH.value != '8' && txtCashTypeH.value != '6') {  // نقدي  او تحصيل شبكة  
            $('#txt_Amount').removeAttr('disabled');
            $('._dis_Bank').removeAttr('disabled');
        }

        Mode_Charge();

    }
    function disabled() {
        $('._dis').attr('disabled', 'disabled')
        $('#chkIsDeffered').attr('disabled', 'disabled')
        $('#id_div_Filter').removeClass('disabledDiv')
    }
    function CleanDetails() {
        $('#Div_control').removeClass('display_none');
        CleanBen('H');
        $("#Div_control :input").val("");

        txt_D_CashBoxH.selectedIndex = 1;
        txtCashTypeH.value = '0';
        $("._dbd").val("null");
        txtTrDate.value = GetDate();
        txtProviderIndDate.value = GetDate();
        txtDueDate.value = GetDate();
        chkIsDeffered.checked = false;
        chkStatus.checked = false;
        txtCashTypeH_onchange();
        $('#txt_ReceiptNoteH').append('<option value="6">مصروف مستحق</option>');

    }
    function CleanDiv_Charge_Provider() {

        if ($('#Charge_Div').is(":hidden") == true) { //Charge_____Validation
            $("#Charge_Div :input").val("");
            $(".Charge_db").val("null");
            $("#dbChargeVatType").val("7");
        }

        if ($('#Provider_Div').is(":hidden") == true) { //Provider_____Validation
            $("#Provider_Div :input").val("");
            $(".Prov_db").val("null");
            $("#dbProviderVatType").val("7");
            txtProviderIndDate.value = GetDate();
        }

        Mode_Charge();
    }
    function Mode_Charge() {

        if (dbChargeBank.value == 'null') {
            $("#Charge_Div :input").attr('disabled', 'disabled')
            $('#dbChargeBank').removeAttr('disabled');
            $("#Charge_Div :input").val(""); $(".Charge_db").val("null"); $("#dbChargeVatType").val("7"); 
        }
        else {
            $("#Charge_Div :input").removeAttr('disabled');
        }

    }
    //****************************************************DisplayDetails*********************************************
    function GridDoubleClick() {
        CleanDetails();
        DisplayDetails(ReportGrid.SelectedItem)
        disabled();
    }
    function DisplayDetails(Selecteditem: IQ_GetBoxReceiveList) {
        debugger
        if (Selecteditem.CashType == 9) {  // مصروف مستحق  
            $('#txt_ReceiptNoteH').html('');
            $('#txt_ReceiptNoteH').append('<option value="6">مصروف مستحق</option>');
        }
        else {
            DocumentActions.FillCombowithdefult(Type, txt_ReceiptNoteH, "CodeValue", (lang == "ar" ? 'DescA' : 'DescE'), (lang == "ar" ? "اختر نوع " + Name_Not + "" : 'Type of constraint'));
            $('#txt_ReceiptNoteH option[value="6"]').remove()
        }
        DocumentActions.RenderFromModel(Selecteditem);
        txtTrDate.value = DateFormat(Selecteditem.TrDate);
        txtDueDate.value = DateFormat(Selecteditem.DueDate);
        txtProviderIndDate.value = DateFormat(Selecteditem.ProviderIndDate);
        chkStatus.checked = Selecteditem.Status == 1 ? true : false;
        chkIsDeffered.checked = Selecteditem.IsDeffered == true ? true : false;
        if (Selecteditem.RecPayTypeId == 1) { getAccountCustById('H', Selecteditem.CustomerID.toString(), false); }
        if (Selecteditem.RecPayTypeId == 2) { getAccountVndById('H', Selecteditem.VendorID.toString(), false); }
        if (Selecteditem.RecPayTypeId == 3) { getAccountBankById('H', Selecteditem.BankAccountCode, true); }
        if (Selecteditem.RecPayTypeId == 4) { getAccountAccById('H', Selecteditem.ExpenseID.toString(), false); }
        if (Selecteditem.RecPayTypeId == 5) { getAccountBoxById('H', Selecteditem.FromCashBoxID.toString(), false); }
        if (Selecteditem.RecPayTypeId == 6) { getAccountAccById('H', Selecteditem.ExpenseID.toString(), false); }
        Flag_IsNew = false;


        if (chkStatus.checked == true) {
            btnUpdate.disabled = true;
            chkStatus.disabled = !SysSession.CurrentPrivileges.CUSTOM1;
        }
        else {
            btnUpdate.disabled = false;
            chkStatus.disabled = true;
        }


        if (Number(Selecteditem.ProviderID) != 0) {
            getProVndById(Selecteditem.ProviderID.toString(), false);
            $('#txtProviderVatNo').val(Selecteditem.ProviderVatNo);
            $('#dbProviderVatType').val(Selecteditem.ProviderVatType);
            CalculatorProvider();
        }


        Mode_CashType();


    }
    function Mode_CashType() {

        $('#Charge_Div').addClass('display_none');
        $('#Provider_Div').addClass('display_none');
        $('._Cash').addClass('display_none');
        $('._Card').addClass('display_none');
        $('#txt_CheckNo').removeClass('display_none');//الشيك
        $('#txt_TransferNo').addClass('display_none');//التحويل

        if (txtCashTypeH.value == '0') {// نقدي 
            $('._Cash').removeClass('display_none');

            if (txt_ReceiptNoteH.value == '4') {//صرف لحساب
                $('#Provider_Div').removeClass('display_none');
            }
        }
        else if (txtCashTypeH.value == '8') {//تحصيل شبكة  
            $('._Card').removeClass('display_none');

            if (txt_ReceiptNoteH.value == '4') {//صرف لحساب
                $('#Provider_Div').removeClass('display_none');
            }
        }
        else {

            if (txt_ReceiptNoteH.value != '6') {//مصروف مستحق
                $('#Charge_Div').removeClass('display_none');
            }
            if (txt_ReceiptNoteH.value == '4' || txt_ReceiptNoteH.value == '6') {//صرف لحساب و مصروف مستحق
                $('#Provider_Div').removeClass('display_none');
            }


            if (txtCashTypeH.value == '1' || txtCashTypeH.value == '2') {
                $('#txt_CheckNo').addClass('display_none'); //الشيك
                $('#txt_TransferNo').removeClass('display_none'); //التحويل
            }

        }

    }
    //****************************************************Validation*********************************************
    function Validation() {

        if (txt_D_CashBoxH.value == 'null') {
            DisplayMassage("يجب اختيار نوع الصندوق ", "Choose the type of constraint", MessageType.Worning);
            Errorinput(txt_D_CashBoxH);
            return false;

        }
        if (txtCashTypeH.value == 'null') {
            DisplayMassage("يجب اختيار نوع النقد ", "Choose the type of constraint", MessageType.Worning);
            Errorinput(txtCashTypeH);
            return false;

        }
        if (txt_ReceiptNoteH.value == 'null') {
            DisplayMassage("يجب اختيار نوع " + Name_Not + " ", "Choose the type of constraint", MessageType.Worning);
            Errorinput(txt_ReceiptNoteH);
            return false;

        }

        if (txt_BenCodeH.value.trim() == '') {
            DisplayMassage("يجب اختيار المستفيد ", "Choose the type of constraint", MessageType.Worning);
            Errorinput(txt_BenCodeH);
            Errorinput(btnBenH);
            return false;
        }

        if ((Number(txt_CashAmount.value) == 0) && txtCashTypeH.value == "0") {
            DisplayMassage("يجب ادخال نقدي ", "You must enter cash or card ", MessageType.Worning);
            Errorinput(txt_CardAmount);
            Errorinput(txt_CashAmount);
            return false;

        }
        if ((Number(txt_CardAmount.value) == 0) && txtCashTypeH.value == "8") {
            DisplayMassage("يجب ادخال الشبكه", "You must enter cash or card ", MessageType.Worning);
            Errorinput(txt_CardAmount);
            Errorinput(txt_CashAmount);
            return false;

        }
        if (Number($('#txt_Amount').val()) == 0) {
            DisplayMassage("يجب ادخال  البلغ   ", " Amount must be entered", MessageType.Worning);
            Errorinput($('#txt_Amount'));
            return false;
        }


        if ($('#txt_BankName').is(":disabled") == false) {//Bank_____Validation

            if ($('#txt_TransferNo').val().trim() == '' && $('#txt_TransferNo').is(":hidden") == false) {
                DisplayMassage("يجب ادخال  رقم التحويله ", " Transfer number must be entered", MessageType.Worning);
                Errorinput($('#txt_TransferNo'));
                return false;
            }

            if ($('#txt_CheckNo').val().trim() == '' && $('#txt_CheckNo').is(":hidden") == false) {
                DisplayMassage("يجب ادخال  رقم الشيك ", " Check number must be entered", MessageType.Worning);
                Errorinput($('#txt_CheckNo'));
                return false;
            }

            if ($('#txt_BankName').val().trim() == '') {
                DisplayMassage("يجب ادخال صرف الي بنك  ", " The entry must be issued by a bank", MessageType.Worning);
                Errorinput($('#txt_BankName'));
                return false;
            }
            if (txt_BankAcc_Code.selectedIndex == 0) {
                DisplayMassage("يجب اختيار  حساب الصرف  ", "You must choose the deposit account number", MessageType.Worning);
                Errorinput(txt_BankAcc_Code);
                return false;
            }

        }


        if ($('#Charge_Div').is(":hidden") == false) { //Charge_____Validation

            if (dbChargeBank.value != 'null') {

                if (dbChargeVatType.value == 'null') {
                    DisplayMassage("يجب اختيار نوع الضريبة  ", "Choose the type of Vat", MessageType.Worning);
                    Errorinput(dbChargeVatType);
                    return false;
                }

                if (Number($('#txtCharges').val()) == 0) {
                    DisplayMassage("يجب ادخال  البلغ   ", " Amount must be entered", MessageType.Worning);
                    Errorinput($('#txtCharges'));
                    return false;
                }

            }
        }


        if ($('#Provider_Div').is(":hidden") == false) { //Provider____Validation

            if (txtProviderName.value.trim() == '') {
                DisplayMassage("يجب ادخال المورد   ", "Choose the type of Ven", MessageType.Worning);
                Errorinput(txtProviderName);
                return false;
            }

            if ($('#txtProviderVatNo').val().trim() == '') {
                DisplayMassage("يجب ادخال الرقم الضريبى   ", "Choose the type of Vat No", MessageType.Worning);
                Errorinput($('#txtProviderVatNo'));
                return false;
            }

            if (dbProviderVatType.value == 'null') {
                DisplayMassage("يجب اختيار نوع الضريبة  ", "Choose the type of Vat", MessageType.Worning);
                Errorinput(dbProviderVatType);
                return false;
            }

            if (dbCC_Code.value == 'null') {
                DisplayMassage("يجب اختيار مركز التكلفة  ", "Choose the type of Cost", MessageType.Worning);
                Errorinput(dbCC_Code);
                return false;
            }



        }

        return true;

    }
    //****************************************************Assign_Data*********************************************
    function Assign() {
        debugger
        Model = new A_RecPay_Tr_ReceiptNote();

        DocumentActions.AssignToModel(Model);//Insert Update
        Model.Status = chkStatus.checked == true ? 1 : 0;
        Model.IsDeffered = chkIsDeffered.checked == true ? true : false;

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
        if (Model.RecPayTypeId == 6) { Model.ExpenseID = Number($('#txt_BenIDH').val()) }

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
    function Insert() {
        debugger
        if (!CheckDate(DateFormat(txtTrDate.value).toString(), DateFormat(SysSession.CurrentEnvironment.StartDate).toString(), DateFormat(SysSession.CurrentEnvironment.EndDate).toString())) {
            WorningMessage("  التاريخ ليس متطابق مع تاريخ المتاح (" + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ")", "Date does not match available date(" + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ")", "تحذير", "worning");
            return
        }
        console.log(Model);
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("AccTrReceipt", "Insert"),
            data: JSON.stringify(Model),
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    let res = result.Response as IQ_GetBoxReceiveList
                    DisplayMassage("تم اصدار سند رقم ( " + res.TrNo + " ) بنجاح", "Saved successfully", MessageType.Succeed);
                    Success(res.ReceiptID, res);
                    Save_Succ_But();
                } else {
                    DisplayMassage("خطأء", "Error", MessageType.Error);
                }
            }
        });
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
                    let res = result.Response as IQ_GetBoxReceiveList
                    DisplayMassage("تم تعديل سند رقم ( " + res.TrNo + " ) بنجاح", "Saved successfully", MessageType.Succeed);
                    Success(res.ReceiptID, res);
                    Save_Succ_But();
                } else {
                    DisplayMassage("خطأء", "Error", MessageType.Error);
                }
            }
        });

    }
    function Open() {
        debugger
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
                    let res = result.Response as IQ_GetBoxReceiveList
                    DisplayMassage("تم فك سند رقم ( " + res.TrNo + " ) بنجاح", "Saved successfully", MessageType.Succeed);
                    Success(res.ReceiptID, res);
                    Save_Succ_But();
                } else {
                    DisplayMassage("خطأء", "Error", MessageType.Error);
                }
            }
        });

    }
    function Success(ReceiptID: number, res: IQ_GetBoxReceiveList) {
        Details = Details.filter(x => x.ReceiptID != ReceiptID);
        Details.push(res);
        Details = Details.sort(dynamicSort("TrNo"));
        ReportGrid.SelectedItem = res;
        $('#id_ReportGrid').removeClass('display_none');
        $('#Div_control').addClass('display_none');
        ReportGrid.DataSource = Details;
        ReportGrid.Bind();
        CleanDetails();
        DisplayDetails(ReportGrid.SelectedItem)
        disabled();
    }
    //***************************************************************************Print*********************************************************     
    export function PrintReport(OutType: number) {
        // 
        if (!SysSession.CurrentPrivileges.PrintOut) return;
        let rp: ReportParameters = new ReportParameters();

        rp.RepType = OutType;//output report as View
        rp.FromDate = DateFormatRep(txtDateFrom.value);
        rp.ToDate = DateFormatRep(txtDateTo.value);
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

        if (txt_ReceiptNoteF.selectedIndex > 0)
            rp.RecType = Number($("#txt_ReceiptNoteF").val());
        else
            rp.RecType = -1;

        if (txt_D_CashBoxF.selectedIndex > 0)
            rp.BoxId = Number($("#txt_D_CashBoxF").val());
        else
            rp.BoxId = -1;
        /////////////////////////doniaH
        //if (txt_ID_beneficiary.selectedIndex > 0) {
        //    rp.BnfID = $("#txt_ID_beneficiary").val();
        //    rp.BnfDesc = txt_ID_beneficiary.value;
        //}

        if ($("#txt_BenCodeF").val() != "") {
            rp.BnfID = $("#txt_BenCodeF").val();
            rp.BnfDesc = $("#txt_BenNameF").val();
        }
        else {
            rp.BnfID = "";
            rp.BnfDesc = "";
        }
        //txt_Status
        if (txt_Status.selectedIndex > 0)
            rp.Status = Number($("#txt_Status").val());
        else
            rp.Status = 2;
        rp.TrType = TrType;
        if ($("#txtCashTypeF").val() == "null") {
            rp.CashType = -1;
        } else {
            rp.CashType = $("#txtCashTypeF").val();
        }

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
        rp.Repdesign = 2;
        rp.TRId = Number($('#ReceiptID').val());

        rp.Name_function = "rptReceiptNote";
        localStorage.setItem("Report_Data", JSON.stringify(rp));
        PrintTransactionLog(SysSession.CurrentEnvironment.UserCode, SysSession.CurrentEnvironment.CompCode, SysSession.CurrentEnvironment.BranchCode, Modules.AccTrReceiptNote, SysSession.CurrentEnvironment.CurrentYear, rp.TRId.toString());

        localStorage.setItem("result", '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>');
        window.open(Url.Action("ReportsPopup", "Home"), "_blank");
    }
    function btnPrintslip_onclick() {
        if (!SysSession.CurrentPrivileges.PrintOut) return;
        let rp: ReportParameters = new ReportParameters();

        rp.CompCode = SysSession.CurrentEnvironment.CompCode;
        rp.BranchCode = SysSession.CurrentEnvironment.BranchCode;
        rp.CompNameA = SysSession.CurrentEnvironment.CompanyNameAr;
        rp.CompNameE = SysSession.CurrentEnvironment.CompanyName;
        rp.UserCode = SysSession.CurrentEnvironment.UserCode;
        rp.Tokenid = SysSession.CurrentEnvironment.Token;
        rp.ScreenLanguage = SysSession.CurrentEnvironment.ScreenLanguage;
        rp.SystemCode = SysSession.CurrentEnvironment.SystemCode;
        rp.SubSystemCode = SysSession.CurrentEnvironment.SubSystemCode;
        var BranchNameA = SysSession.CurrentEnvironment.BranchName;
        var BranchNameE = SysSession.CurrentEnvironment.BranchName;
        if (BranchNameA == null || BranchNameE == null) {

            BranchNameA = " ";
            BranchNameE = " ";
        }
        rp.BraNameA = BranchNameA;
        rp.BraNameE = BranchNameE;
        rp.Type = 0;
        rp.slip = 1;
        rp.Repdesign = 2;
        rp.TRId = Number($('#ReceiptID').val());
        Ajax.CallAsync({
            url: Url.Action("rptReceiptNote", "GeneralReports"),
            data: rp,
            success: (d) => {
                let result = d.result as string;
                PrintTransactionLog(SysSession.CurrentEnvironment.UserCode, SysSession.CurrentEnvironment.CompCode, SysSession.CurrentEnvironment.BranchCode, Modules.AccTrReceiptNote, SysSession.CurrentEnvironment.CurrentYear, rp.TRId.toString());
                window.open(result, "_blank");
            }
        })
    }
    function btnPrintsFrom_To_onclick() {
        btnShow_onclick();

        let BenID = Number($('#txt_BenIDF').val())
        let Boxid = txt_D_CashBoxF.value == 'null' ? null : Number(txt_D_CashBoxF.value);
        let Status = txt_Status.value == 'All' ? null : txt_Status.value;
        let RecPayTypeId = txt_ReceiptNoteF.value == 'null' ? null : Number(txt_ReceiptNoteF.value);
        let DateFrom = DateFormatRep(txtDateFrom.value);
        let DateTo = DateFormatRep(txtDateTo.value);
        let CashType = txtCashTypeF.value == "null" ? -1 : Number(txtCashTypeF.value);

        try {

            let Name_ID = 'ReceiptID'
            let NameTable = 'IQ_GetBoxReceiveList'
            let Condation1 = "  TrType=" + TrType + " and CompCode = " + CompCode + " and BranchCode =" + BranchCode + " " +
                " and TrDate >=' " + DateFrom + "' and TrDate <= ' " + DateTo + " ' ";
            let Condation2 = " ";


            if (CashType != -1)
                Condation2 = Condation2 + " and CashType=" + CashType;

            if (Boxid != null)
                Condation2 = Condation2 + " and CashBoxID=" + Boxid;
            if (RecPayTypeId != null)
                Condation2 = Condation2 + " and RecPayTypeId=" + RecPayTypeId;
            if (BenID != 0) {
                if (RecPayTypeId == 1) {
                    Condation2 = Condation2 + " and CustomerID =" + BenID;
                }
                else if (RecPayTypeId == 2) {
                    Condation2 = Condation2 + " and VendorID =" + BenID;
                }
                else if (RecPayTypeId == 3) {
                    Condation2 = Condation2 + " and BankAccountCode ='" + BenID + "'";
                }
                else if (RecPayTypeId == 4) {
                    Condation2 = Condation2 + " and ExpenseID =" + BenID;
                }
                else if (RecPayTypeId == 5) {
                    Condation2 = Condation2 + " and FromCashBoxID =" + BenID;
                }
            }
            if (Status != null)
                Condation2 = Condation2 + " and Status=" + Status;


            let Condation3 = Condation1 + Condation2 + " ORDER BY TrNo ASC;";


            PrintsFrom_To(TransType.AccPayment, Name_ID, NameTable, Condation3, Details.length)


        } catch (e) {

            return
        }

    }

} 