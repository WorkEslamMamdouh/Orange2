$(document).ready(() => {
    TranPosting.InitalizeComponent();
})
namespace TranPosting {
    //System
    var sys: SystemTools = new SystemTools();
    var SysSession: SystemSession = GetSystemSession(Modules.TranPosting);
    var compcode: Number;
    var branch: Number;
    var startDate: string;
    var EndDate: string;
    var Selecteditem = new GQ_GetUsers;

    //GridView
    var SubSystemGrid: JsGrid = new JsGrid();
    var TransactionsGrid: JsGrid = new JsGrid();
    var VoucherDetailGrid: JsGrid = new JsGrid();

    //DropdownLists
    var ddlBranch: HTMLSelectElement;

    //textboxs
    var txtFromDate: HTMLInputElement;
    var txtToDate: HTMLInputElement;
    var txtFromNumber: HTMLInputElement;
    var txtToNumber: HTMLInputElement;
    var txtDebit: HTMLInputElement;
    var txtCedit: HTMLInputElement;
    var txtDesc: HTMLInputElement;
    var txtDiff: HTMLInputElement;
    var txtVoucherDate: HTMLInputElement;
    var txtSearchBox: HTMLInputElement;
    var txtSearchTrans: HTMLInputElement;

    //labels
    //   var lblVoucherNum: HTMLLabelElement;

    //buttons
    var btndiv_11: HTMLButtonElement;
    var btndiv_22: HTMLButtonElement;
    var btndiv_33: HTMLButtonElement;
    var btnLoad: HTMLButtonElement;
    var btnShowVouchers: HTMLButtonElement;
    var btnCreateVoucher: HTMLButtonElement;

    var btnSelectAll: HTMLButtonElement;
    var btnReverseSelection: HTMLButtonElement;
    var btnUnSelectAll: HTMLButtonElement;

    //Arrays
    var BranchDetails: Array<G_BRANCH> = new Array<G_BRANCH>();
    var SubSystemDetails: Array<GQ_GetLnkTransComp> = new Array<GQ_GetLnkTransComp>();
    var SubSystemDetailsRefreshed: Array<GQ_GetLnkTransComp> = new Array<GQ_GetLnkTransComp>();
    var LnkTransDetails: Array<G_LnkTrans_Temp> = new Array<G_LnkTrans_Temp>();
    var SearchDetailsTrans: Array<G_LnkTrans_Temp> = new Array<G_LnkTrans_Temp>();
    var selectedLnkTransDetails: Array<G_LnkTrans_Temp> = new Array<G_LnkTrans_Temp>();
    var GetLnkVoucherDetail: Array<GQ_GetLnkVoucherDetail> = new Array<GQ_GetLnkVoucherDetail>();
    var SearchDetails: Array<GQ_GetLnkVoucherDetail> = new Array<GQ_GetLnkVoucherDetail>();
    //var SelectedModuleCodes: Array<GQ_GetLnkTransComp> = new Array<GQ_GetLnkTransComp>();

    // global
    var debitTot: number = 0;
    var cerditTot: number = 0;
    var diffTot: number = 0;
    var lang: string;
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);
    var IsUpdated: boolean = false;
    var IsChange: boolean = false;

    export function InitalizeComponent() {

        $("#iconbar_Definition").addClass("d-none");
        $("#divIconbar").addClass("d-none");
        $("#icon-bar").addClass("d-none");

        InitalizeControls();
        //System
        (SysSession.CurrentEnvironment.ScreenLanguage == "ar") ? document.getElementById('Screen_name').innerHTML = "ترحيل الحسابات" : document.getElementById('Screen_name').innerHTML = "Receipt Voucher";
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        branch = Number(SysSession.CurrentEnvironment.BranchCode);
        lang = SysSession.CurrentEnvironment.ScreenLanguage;
        //Set Secial Values While Load
        txtFromDate.value = DateStartMonth();
        txtToDate.value = ConvertToDateDash(GetDate()) <= ConvertToDateDash(SysSession.CurrentEnvironment.EndDate) ? GetDate() : SysSession.CurrentEnvironment.EndDate;
        txtVoucherDate.value = ConvertToDateDash(GetDate()) <= ConvertToDateDash(SysSession.CurrentEnvironment.EndDate) ? GetDate() : SysSession.CurrentEnvironment.EndDate;



        //Fill ddl
        fillddlBranch();

        InitializeEvents();

        // initialize Grids

        InitializeSubSystemGrid();
        // InitializePagesGrid();
        InitializeTransactionsGrid();
        InitializeVoucherDetailGrid();

        //$("#btndiv_3").addClass("Actiev");
        //$("#btndiv_1").removeClass("Actiev");
        //$("#btndiv_2").removeClass("Actiev");

        $("#btndiv_3").addClass("btn-active");
        $("#btndiv_1").removeClass("btn-active");
        $("#btndiv_2").removeClass("btn-active");

        $("#btndiv_33").removeClass("btn-main");
        $("#btndiv_11").addClass("btn-main");
        $("#btndiv_22").addClass("btn-main");

        $("#div_3").removeClass("display_none");
        $("#div_1").addClass("display_none");
        $("#div_2").addClass("display_none");


        ddlBranch.selectedIndex = 1;
    }
    function InitalizeControls() {

        //DropdownLists
        ddlBranch = document.getElementById("ddlBranch") as HTMLSelectElement;

        //textboxs
        txtFromDate = document.getElementById("txtFromDate") as HTMLInputElement;
        txtToDate = document.getElementById("txtToDate") as HTMLInputElement;
        txtFromNumber = document.getElementById("txtFromNumber") as HTMLInputElement;
        txtToNumber = document.getElementById("txtToNumber") as HTMLInputElement;
        txtDebit = document.getElementById("txtDebit") as HTMLInputElement;
        txtCedit = document.getElementById("txtCedit") as HTMLInputElement;
        txtDesc = document.getElementById("txtDesc") as HTMLInputElement;
        txtDiff = document.getElementById("txtDiff") as HTMLInputElement;
        txtVoucherDate = document.getElementById("txtVoucherDate") as HTMLInputElement;
        txtSearchBox = document.getElementById("txtSearchBox") as HTMLInputElement;
        txtSearchTrans = document.getElementById("txtSearchTrans") as HTMLInputElement;

        //labels
        //   lblVoucherNum = document.getElementById("lblVoucherNum") as HTMLLabelElement;

        //buttons
        btnLoad = document.getElementById("btnLoad") as HTMLButtonElement;
        btnShowVouchers = document.getElementById("btnShowVouchers") as HTMLButtonElement;
        btnCreateVoucher = document.getElementById("btnCreateVoucher") as HTMLButtonElement;
        btnSelectAll = document.getElementById("btnSelectAll") as HTMLButtonElement;
        btnReverseSelection = document.getElementById("btnReverseSelection") as HTMLButtonElement;
        btnUnSelectAll = document.getElementById("btnUnSelectAll") as HTMLButtonElement;
        btndiv_11 = document.getElementById("btndiv_11") as HTMLButtonElement;
        btndiv_22 = document.getElementById("btndiv_22") as HTMLButtonElement;
        btndiv_33 = document.getElementById("btndiv_33") as HTMLButtonElement;

    }
    function InitializeEvents() {
        btnLoad.onclick = () => {
            if (!CheckDate(DateFormat(txtFromDate.value).toString(), DateFormat(SysSession.CurrentEnvironment.StartDate).toString(), DateFormat(SysSession.CurrentEnvironment.EndDate).toString()) == true || !CheckDate(DateFormat(txtToDate.value).toString(), DateFormat(SysSession.CurrentEnvironment.StartDate).toString(), DateFormat(SysSession.CurrentEnvironment.EndDate).toString()) == true) {
                WorningMessage('   التاريخ ليس متطابق مع تاريخ السنه (' + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ')', '  The date is not identical with the date of the year (' + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ')', "هل انت متأكد ؟ ", "worning", () => {
                    btnLoad_onclick();
                });
            }
            else {
                btnLoad_onclick();
            }
        };
        btnShowVouchers.onclick = () => {
            if (!CheckDate(DateFormat(txtFromDate.value).toString(), DateFormat(SysSession.CurrentEnvironment.StartDate).toString(), DateFormat(SysSession.CurrentEnvironment.EndDate).toString()) == true || !CheckDate(DateFormat(txtToDate.value).toString(), DateFormat(SysSession.CurrentEnvironment.StartDate).toString(), DateFormat(SysSession.CurrentEnvironment.EndDate).toString()) == true) {
                WorningMessage('   التاريخ ليس متطابق مع تاريخ السنه (' + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ')', '  The date is not identical with the date of the year (' + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ')', "هل انت متأكد ؟ ", "worning", () => {
                    btnShowVouchers_onclick();
                });
            }
            else {
                btnShowVouchers_onclick();
            }
        };
        btnCreateVoucher.onclick = () => {
            if (!CheckDate(DateFormat(txtFromDate.value).toString(), DateFormat(SysSession.CurrentEnvironment.StartDate).toString(), DateFormat(SysSession.CurrentEnvironment.EndDate).toString()) == true || !CheckDate(DateFormat(txtToDate.value).toString(), DateFormat(SysSession.CurrentEnvironment.StartDate).toString(), DateFormat(SysSession.CurrentEnvironment.EndDate).toString()) == true) {
                WorningMessage('   التاريخ ليس متطابق مع تاريخ السنه (' + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ')', '  The date is not identical with the date of the year (' + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ')', "هل انت متأكد ؟ ", "worning", () => {
                    btnCreateVoucher_onclick();
                });
            }
            else {
                btnCreateVoucher_onclick();
            }
        };
        //btnShowVouchers.onclick = btnShowVouchers_onclick;
        //btnCreateVoucher.onclick = btnCreateVoucher_onclick;
        btnSelectAll.onclick = btnSelectAll_onclick;
        btnReverseSelection.onclick = btnReverseSelection_onclick;
        btnUnSelectAll.onclick = btnUnSelectAll_onclick;
        txtToDate.onchange = txtToDate_onchange;
        txtVoucherDate.onchange = txtVoucherDate_onchange;
        btndiv_11.onclick = btndiv_11_onclick;
        btndiv_22.onclick = btndiv_22_onclick;
        btndiv_33.onclick = btndiv_33_onclick;
        txtSearchBox.onkeyup = txtSearchBox_onchange;
        txtSearchTrans.onkeyup = txtSearchTrans_onchange;
    }

    //------------------------------------------------------ ButtonsRegion ----------------------------------
    function btnLoad_onclick() {

         
        var SelectFalg: boolean = false;
        if (ddlBranch.value == "null") {
            DisplayMassage("يجب اختيار الفرع", "you must Select Branch", MessageType.Error);
            Errorinput(ddlBranch);
            return;
        } else {
            var branchCode = Number(ddlBranch.value);
            var trType: string = "";
            for (let i = 0; i < SubSystemDetails.length; i++) {
                if (SubSystemDetails[i].Selected == true) {
                    if (trType != "") trType += " , ";
                    trType += "" + SubSystemDetails[i].TR_CODE + "";

                    SelectFalg = true;
                }
            }

            if (SelectFalg == false) {
                DisplayMassage("يجب تحديد نوع الحركة", "The type of movement must be selected", MessageType.Error);
                return;
            }

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
                url: sys.apiUrl("TranPosting", "LoadTransactions"),
                data: {
                    Comp: compcode, branchCode: branchCode, TrType: trType, StartDate: StartDate, EndDate: EndDate, FromNum: FromNum, ToNum: ToNum, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token, Modules: Modules.TranPosting, FinYear: SysSession.CurrentEnvironment.CurrentYear
                },
                success: (d) => {
                    let result = d as BaseResponse;
                    if (result.IsSuccess) {
                        SubSystemDetails
                        LnkTransDetails = result.Response as Array<G_LnkTrans_Temp>;


                        if (LnkTransDetails.length > 0) {
                            LnkTransDetails = LnkTransDetails.filter(x => x.TR_NO != null).sort(function (a, b) { return a.TR_NO - b.TR_NO });


                            for (let i = 0; i < LnkTransDetails.length; i++) {
                                (LnkTransDetails[i].TR_DATE != null) ? LnkTransDetails[i].TR_DATE = DateFormatRep(LnkTransDetails[i].TR_DATE) : "";
                                if (lang == "ar")
                                    (LnkTransDetails[i].IsGenerated == true) ? LnkTransDetails[i].IsGeneratedDesc = "تم " : "";
                                else
                                    (LnkTransDetails[i].IsGenerated == true) ? LnkTransDetails[i].IsGeneratedDesc = "Done " : "";
                            }
                            InitializeTransactionsGrid();
                            TransactionsGrid.DataSource = LnkTransDetails;
                            TransactionsGrid.Bind();

                            $("#btndiv_1").addClass("btn-active");
                            $("#btndiv_3").removeClass("btn-active");
                            $("#btndiv_2").removeClass("btn-active");

                            $("#btndiv_11").removeClass("btn-main");
                            $("#btndiv_33").addClass("btn-main");
                            $("#btndiv_22").addClass("btn-main");

                            $("#div_1").removeClass("display_none");
                            $("#div_3").addClass("display_none");
                            $("#div_2").addClass("display_none");
                            $('#btnShowVouchers').removeAttr('disabled');
                        } else {
                            InitializeTransactionsGrid();
                            TransactionsGrid.DataSource = LnkTransDetails;
                            TransactionsGrid.Bind();
                            DisplayMassage("لا يوجد حركات", "There are no moves here", MessageType.Error);

                        }
                    }

                }
            });
            selectedLnkTransDetails = new Array<G_LnkTrans_Temp>();
            GetLnkVoucherDetail = new Array<GQ_GetLnkVoucherDetail>();
            VoucherDetailGrid.DataSource = GetLnkVoucherDetail;
            VoucherDetailGrid.Bind();
            txtDesc.value = "";
            txtDebit.value = "0";
            txtCedit.value = "0";
            txtDiff.value = "0";
            btnCreateVoucher.disabled = true;
        }
    }

    function btnShowVouchers_onclick() {
 

        debitTot = 0;
        cerditTot = 0;
        diffTot = 0;
        debugger
        let LnkTransDetails = new Array<G_LnkTrans_Temp>();
        LnkTransDetails = TransactionsGrid.DataSource;
        selectedLnkTransDetails = LnkTransDetails.filter(x => x.IsSelected == true)

        selectedLnkTransDetails[0].Branch_Code = SysSession.CurrentEnvironment.BranchCode;
        selectedLnkTransDetails[0].Comp_Code = SysSession.CurrentEnvironment.CompCode;
        selectedLnkTransDetails[0].MODULE_CODE = Modules.SlsTrSalesManagerNew;
        selectedLnkTransDetails[0].UserCode = SysSession.CurrentEnvironment.UserCode;
        selectedLnkTransDetails[0].sec_FinYear = SysSession.CurrentEnvironment.CurrentYear;

        if (selectedLnkTransDetails.length != 0) {


            Ajax.Callsync({
                type: "POST",
                url: sys.apiUrl("TranPosting", "UpdateTransactions"),
                data: JSON.stringify(selectedLnkTransDetails),
                success: (d) => {
                    let result = d as BaseResponse;
                    if (result.IsSuccess) {
                        debugger;
                        GetLnkVoucherDetail = new Array<GQ_GetLnkVoucherDetail>();
                        VoucherDetailGrid.DataSource = new Array<GQ_GetLnkVoucherDetail>();
                        GetLnkVoucherDetail = result.Response as Array<GQ_GetLnkVoucherDetail>;
                        VoucherDetailGrid.DataSource = GetLnkVoucherDetail;
                        for (let i = 0; i < GetLnkVoucherDetail.length; i++) {
                            debitTot += GetLnkVoucherDetail[i].DEBIT;
                            cerditTot += GetLnkVoucherDetail[i].CREDIT;
                        }
                        diffTot = debitTot.RoundToNum(2) - cerditTot.RoundToNum(2);

                        txtDebit.value = debitTot.RoundToSt(2);
                        txtCedit.value = cerditTot.RoundToSt(2);
                        txtDiff.value = diffTot.RoundToSt(2);
                        var brID = Number(ddlBranch.value);
                        var txtBranch = BranchDetails.filter(s => s.BRA_CODE == brID);
                        if (lang == "ar")
                            txtDesc.value = "ملخص حركه  " + txtBranch[0].BRA_DESC + " الفتره من تاريخ " + txtFromDate.value + " الي تاريخ " + txtToDate.value;
                        else
                            txtDesc.value = "breif of transaction" + txtBranch[0].BRA_DESC + " period from date " + txtFromDate.value + " to date " + txtToDate.value;

                        VoucherDetailGrid.Bind();
                        RefreshTransactions();

                        //$("#btndiv_3").removeClass("Actiev");
                        //$("#btndiv_1").removeClass("Actiev");
                        //$("#btndiv_2").addClass("Actiev");

                        $("#btndiv_2").addClass("btn-active");
                        $("#btndiv_3").removeClass("btn-active");
                        $("#btndiv_1").removeClass("btn-active");

                        $("#btndiv_22").removeClass("btn-main");
                        $("#btndiv_33").addClass("btn-main");
                        $("#btndiv_11").addClass("btn-main");

                        $("#div_2").removeClass("display_none");
                        $("#div_1").addClass("display_none");
                        $("#div_3").addClass("display_none");
                        btnCreateVoucher.disabled = false;
                        IsUpdated = true;
                        IsChange = false;

                    }

                }
            });
        }
        else {
            selectedLnkTransDetails = new Array<G_LnkTrans_Temp>();
            GetLnkVoucherDetail = new Array<GQ_GetLnkVoucherDetail>();
            VoucherDetailGrid.DataSource = GetLnkVoucherDetail;
            VoucherDetailGrid.Bind();
            txtDesc.value = "";
            txtDebit.value = "0";
            txtCedit.value = "0";
            txtDiff.value = "0";
            btnCreateVoucher.disabled = true;
            DisplayMassage("لا يوجد قيود لعرضها ", "There are no restrictions to display", MessageType.Error);
            return;
        }
    }
    function btnSelectAll_onclick() {
        const newArr = LnkTransDetails.map(object => {
            if (object.IsSelected === false) {
                return { ...object, IsSelected: true };
            }
            return object;
        });
        btnCreateVoucher.disabled = true;
        IsChange = true;
        LnkTransDetails = newArr;
        TransactionsGrid.DataSource = LnkTransDetails;
        TransactionsGrid.Bind();
    }
    function btnReverseSelection_onclick() {

        const newArr = LnkTransDetails.map(object => {
            if (object.IsSelected === false) {
                return { ...object, IsSelected: true };
            } else {
                return { ...object, IsSelected: false };
            }
        });
        btnCreateVoucher.disabled = true;
        IsChange = true;
        LnkTransDetails = newArr;
        TransactionsGrid.DataSource = LnkTransDetails;
        TransactionsGrid.Bind();


    }
    function btnUnSelectAll_onclick() {

        const newArr = LnkTransDetails.map(object => {
            if (object.IsSelected === true) {
                return { ...object, IsSelected: false };
            }
            return object;
        });
        btnCreateVoucher.disabled = true;
        IsChange = true;
        LnkTransDetails = newArr;
        TransactionsGrid.DataSource = LnkTransDetails;
        TransactionsGrid.Bind();

    }
    function btnCreateVoucher_onclick() {
        debugger
        if (IsUpdated == true) {
            if (txtDesc.value == " ") {
                DisplayMassage("يجب ادخال الوصف", "you must enter description", MessageType.Error);
                Errorinput(txtDesc);
                return;
            }
            debugger;
            var isGeneratedFlag: boolean = false;
            //for (let i = 0; i < LnkTransDetails.length; i++) {
            //    if (LnkTransDetails[i].IsGenerated == true) {
            //        isGeneratedFlag = true;
            //    }
            //}

            const newArr = LnkTransDetails.map(object => {
                if (object.IsGenerated === true) {
                    isGeneratedFlag = true;
                }
            });



            if (isGeneratedFlag == false) {
                DisplayMassage("لا يوجد حركات للترحيل", "there is no transactions for posting", MessageType.Error);
                return;
            }

      
            var Desc: string = txtDesc.value;
            var VoucherDate: string = DateFormatRep(txtVoucherDate.value);
            let lstTrans = JSON.stringify(LnkTransDetails);


            $('#btnCreateVoucher').html(' جاري انشاء القيد <span class="glyphicon glyphicon-file"></span>  <i class="fa fa-spinner fa-spin lod  Loading" style="font-size: 195% !important;z-index: 99999;"></i>');
            $('#btnCreateVoucher').attr('disabled', 'disabled')

            setTimeout(function () {




                Ajax.Callsync({
                    type: "Get",
                    url: sys.apiUrl("TranPosting", "GenerateVoucher"),
                    data: {
                        comp: compcode, branch: branch, Desc: Desc, VoucherDate: VoucherDate, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token, sec_FinYear: SysSession.CurrentEnvironment.CurrentYear, MODULE_CODE: Modules.TranPosting
                    },//(int comp, int branch, string Desc,string VoucherDate, string UserCode, string Token, string sec_FinYear, string MODULE_CODE)
                    success: (d) => {
                        let result = d as BaseResponse;
                        if (result.IsSuccess) {
                            if (result.Response != -1) {
                                //  lblVoucherNum.innerText = result.Response;

                                DisplayMassage("تم اصدار  سند قيد رقم  " + result.Response, "jouranl voucher number " + result.Response + "has been issued", MessageType.Succeed);
                                $('#btnCreateVoucher').html('انشاء القيد فى الحسابات');
                                $('#btnCreateVoucher').removeAttr('disabled')
                                setTimeout(() => {
                                    Clear();
                                    $("#VoucherDetailGrid").html("");

                                    $("#btndiv_1").addClass("btn-active");
                                    $("#btndiv_2").removeClass("btn-active");
                                    $("#btndiv_3").removeClass("btn-active");

                                    $("#btndiv_11").removeClass("btn-main");
                                    $("#btndiv_22").addClass("btn-main");
                                    $("#btndiv_33").addClass("btn-main");

                                    $("#div_1").removeClass("display_none");
                                    $("#div_3").addClass("display_none");
                                    $("#div_2").addClass("display_none");



                                }, 5000);
                                RefreshTransactions();
                            }
                            else
                                DisplayMassage("لم تتم عملية الترحيل راجع اعدادات الربط  ", "Transposting process not accomplished please review connection settings", MessageType.Error);

                        }
                    }
                });
            }, 300);
        }
        IsUpdated = false;
    }
    function btndiv_11_onclick() {
        if (LnkTransDetails.length == 0) {
            Errorinput($('#btnLoad'));
            DisplayMassage("يجب تحميل الحركات اولاً ", "Moves must be loaded first", MessageType.Error);
            $("#btndiv_3").addClass("btn-active");
            $("#btndiv_1").removeClass("btn-active");
            $("#btndiv_2").removeClass("btn-active");
            $("#btndiv_33").removeClass("btn-main");
            $("#btndiv_11").addClass("btn-main");
            $("#btndiv_22").addClass("btn-main");
            $("#div_3").removeClass("display_none");
            $("#div_1").addClass("display_none");
            $("#div_2").addClass("display_none");

        } else {
            $("#btndiv_1").addClass("btn-active");
            $("#btndiv_2").removeClass("btn-active");
            $("#btndiv_3").removeClass("btn-active");

            $("#btndiv_11").removeClass("btn-main");
            $("#btndiv_22").addClass("btn-main");
            $("#btndiv_33").addClass("btn-main");

            $("#div_1").removeClass("display_none");
            $("#div_2").addClass("display_none");
            $("#div_3").addClass("display_none");
        }
    }
    function btndiv_22_onclick() {
        debugger
        if (IsChange == true) {
            DisplayMassage("يجب توليد القيود قبل عرضها ", "Constraints must be generated before they are displayed", MessageType.Error);
            Errorinput($('#btnShowVouchers'));
            $("#btndiv_1").addClass("btn-active");
            $("#btndiv_2").removeClass("btn-active");
            $("#btndiv_3").removeClass("btn-active");

            $("#btndiv_11").removeClass("btn-main");
            $("#btndiv_22").addClass("btn-main");
            $("#btndiv_33").addClass("btn-main");

            $("#div_1").removeClass("display_none");
            $("#div_2").addClass("display_none");
            $("#div_3").addClass("display_none");

        } else {
            if (GetLnkVoucherDetail.length == 0 && LnkTransDetails.length == 0) {
                Errorinput($('#btnLoad'));

                DisplayMassage("يجب تحميل الحركات اولاً ", "Moves must be loaded first", MessageType.Error);

                $("#btndiv_3").addClass("btn-active");
                $("#btndiv_1").removeClass("btn-active");
                $("#btndiv_2").removeClass("btn-active");

                $("#btndiv_33").removeClass("btn-main");
                $("#btndiv_11").addClass("btn-main");
                $("#btndiv_22").addClass("btn-main");

                $("#div_3").removeClass("display_none");
                $("#div_1").addClass("display_none");
                $("#div_2").addClass("display_none");

            }
            else if (GetLnkVoucherDetail.length == 0) {
                Errorinput($('#btnShowVouchers'));

                DisplayMassage("يجب توليد القيود قبل عرضها ", "Constraints must be generated before they are displayed", MessageType.Error);

                $("#btndiv_1").addClass("btn-active");
                $("#btndiv_2").removeClass("btn-active");
                $("#btndiv_3").removeClass("btn-active");

                $("#btndiv_11").removeClass("btn-main");
                $("#btndiv_22").addClass("btn-main");
                $("#btndiv_33").addClass("btn-main");

                $("#div_1").removeClass("display_none");
                $("#div_2").addClass("display_none");
                $("#div_3").addClass("display_none");
            }

        }
    }
    function btndiv_33_onclick() {
        $("#btndiv_3").addClass("btn-active");
        $("#btndiv_1").removeClass("btn-active");
        $("#btndiv_2").removeClass("btn-active");

        $("#btndiv_33").removeClass("btn-main");
        $("#btndiv_11").addClass("btn-main");
        $("#btndiv_22").addClass("btn-main");

        $("#div_3").removeClass("display_none");
        $("#div_1").addClass("display_none");
        $("#div_2").addClass("display_none");
    }
    //------------------------------------------------------ Initialize Grid  Region ----------------------------------
    function txtSearchBox_onchange() {
        debugger
        $("#VoucherDetailGrid").jsGrid("option", "pageIndex", 1);

        if (txtSearchBox.value != "") {
            let search: string = txtSearchBox.value.toLowerCase();

            SearchDetails = GetLnkVoucherDetail.filter(x => x.Tr_No.toString().search(search) >= 0);

            VoucherDetailGrid.DataSource = SearchDetails;
            VoucherDetailGrid.Bind();
        } else {

            VoucherDetailGrid.DataSource = GetLnkVoucherDetail;
            VoucherDetailGrid.Bind();
        }



    }
    function txtSearchTrans_onchange() {
        debugger
        $("#TransactionsGrid").jsGrid("option", "pageIndex", 1);

        if (txtSearchTrans.value != "") {
            let search: string = txtSearchTrans.value.toLowerCase();
            try {
                SearchDetailsTrans = LnkTransDetails.filter(x => x.TR_CODE.toLowerCase().search(search) >= 0 || x.TR_DESCA.toLowerCase().search(search) >= 0 || x.TR_DESCE.toLowerCase().search(search) >= 0 || x.TR_AMOUNT.toString().search(search) >= 0 || x.User_Code.toLowerCase().search(search) >= 0 || x.VOUCHER_DESCA.toLowerCase().search(search) >= 0 || x.TR_NO.toString().search(search) >= 0);
            } catch (e) {
                SearchDetailsTrans = LnkTransDetails.filter(x => x.TR_CODE.toLowerCase().search(search) >= 0 || x.TR_DESCA.toLowerCase().search(search) >= 0 || x.TR_DESCE.toLowerCase().search(search) >= 0 || x.TR_AMOUNT.toString().search(search) >= 0 || x.User_Code.toLowerCase().search(search) >= 0 || x.VOUCHER_DESCA.toLowerCase().search(search) >= 0 || x.TR_NO.toString().search(search) >= 0);
            }

            TransactionsGrid.DataSource = SearchDetailsTrans;
            TransactionsGrid.Bind();
        } else {

            TransactionsGrid.DataSource = LnkTransDetails;
            TransactionsGrid.Bind();
        }



    }
    function InitializeSubSystemGrid() {

        let res: any = GetResourceList("");
        SubSystemGrid.ElementName = "SubSystemGrid";
        SubSystemGrid.PrimaryKey = "MODULE_CODE";
        SubSystemGrid.Paging = true;
        SubSystemGrid.PageSize = 15;
        SubSystemGrid.Sorting = true;
        SubSystemGrid.InsertionMode = JsGridInsertionMode.Binding;
        SubSystemGrid.Editing = false;
        SubSystemGrid.Inserting = false;
        SubSystemGrid.SelectedIndex = 1;
        SubSystemGrid.OnItemEditing = () => { };
        SubSystemGrid.Columns = [

            {
                title: res.TransSelect, css: "ColumPadding", name: "checkbox", width: "6%",
                itemTemplate: (s: string, item: G_LnkTrans): HTMLInputElement => {
                    let txt: HTMLInputElement = CreateElement("checkbox", "form-check-input", " ", " ", "", " ");
                    txt.style.height = "25px";
                    txt.style.width = "25px";
                    txt.onclick = (e) => {
                        if (txt.checked == true) {
                            item.Selected = true;

                        }
                        else {
                            item.Selected = false;
                        }
                    };

                    if (item.Selected == true) {
                        txt.checked = true;

                    }
                    else {
                        txt.checked = false;
                    }

                    return txt;
                }
            },
            { title: " ", name: "MODULE_CODE", type: "text", visible: false },
            { title: " ", name: "Statusflag", type: "text", visible: false },
            { title: res.TransSubSystem, name: "SUB_SYSTEM_CODE", type: "text", width: "5%" },
            { title: res.TransDesc, name: (lang == "ar" ? "TR_DESCA" : "TR_DESCE"), type: "text", width: "10%" },

        ];
        BindSubSystemGrid();
    }
    function BindSubSystemGrid() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("TranPosting", "GetAllTransactions"),
            data: {
                CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token, MODULE_CODE: Modules.TranPosting, sec_FinYear: SysSession.CurrentEnvironment.CurrentYear, BranchCode: SysSession.CurrentEnvironment.BranchCode



            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    SubSystemDetails = result.Response as Array<GQ_GetLnkTransComp>;
                    SubSystemGrid.DataSource = SubSystemDetails;
                    SubSystemGrid.Bind();
                }
            }
        });
    }
    function InitializeTransactionsGrid() {
        let res: any = GetResourceList("");
        TransactionsGrid.ElementName = "TransactionsGrid";
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
            { title: res.TransTrType, name: "TR_CODE", type: "text", width: "5%" },
            { title: res.App_Number, name: "TR_NO", type: "text", width: "5%" },
            { title: res.App_date, name: "TR_DATE", type: "text", width: "8%" },
            { title: res.TransDesc, name: (lang == "ar" ? "TR_DESCA" : "TR_DESCE"), type: "text", width: "10%" },
            { title: "النوع", name: "TR_TYPE", type: "text", width: "15%" },
            { title: res.value, name: "TR_AMOUNT", type: "text", width: "5%" },
            { title: res.User, name: "User_Code", type: "text", width: "8%" },
            { title: res.TransDesc, name: (lang == "ar" ? "VOUCHER_DESCA" : "VOUCHER_DESCE"), type: "text", width: "20%" },
            {
                title: res.appSelect, css: "ColumPadding", name: "IsSelected", width: "6%",
                itemTemplate: (s: string, item: G_LnkTrans_Temp): HTMLInputElement => {
                    let txt: HTMLInputElement = CreateElement("checkbox", "form-check-input", " ", " ", "", " ");
                    txt.style.height = "25px";
                    txt.style.width = "25px";
                    txt.onclick = (e) => {
                        btnCreateVoucher.disabled = true;
                        IsChange = true;
                        if (txt.checked == true) {
                            item.IsSelected = true;
                        } else {
                            item.IsSelected = false;
                        }
                    };
                    if (item.IsSelected == true) {
                        txt.checked = true;
                    } else
                        txt.checked = false;
                    return txt;
                }
            },
            { title: res.Trans_Generate, name: "IsGeneratedDesc", type: "text", width: "4%" },
            { title: res.App_Notes, name: "GenRemarks", type: "text", width: "10%" },
        ];

    }
    // function updateselect() {		   
    //     Ajax.Callsync({
    //         type: "Get",
    //url: sys.apiUrl("TranPosting", "Updateselect"),
    //data: JSON.stringify(LnkTransDetails),
    //         success: (d) => {
    //             let result = d as BaseResponse;

    //         }
    //     });
    // }
    function InitializeVoucherDetailGrid() {
        let res: any = GetResourceList("");
        VoucherDetailGrid.ElementName = "VoucherDetailGrid";
        VoucherDetailGrid.Paging = true;
        VoucherDetailGrid.PageSize = 15;
        VoucherDetailGrid.Sorting = true;
        VoucherDetailGrid.InsertionMode = JsGridInsertionMode.Binding;
        VoucherDetailGrid.Editing = false;
        VoucherDetailGrid.Inserting = false;
        VoucherDetailGrid.SelectedIndex = 1;
        VoucherDetailGrid.OnItemEditing = () => { };
        VoucherDetailGrid.Columns = [
            { title: res.App_serial, name: "Seq", type: "text", width: "5%" },
            { title: res.p_account_number, name: "ACC_CODE", type: "text", width: "14%" },
            { title: res.TransDesc, name: (lang == "ar" ? "ACC_DESCA" : "ACC_DESCL"), type: "text", width: "25%" },
            { title: res.App_Debtor, name: "DEBIT", type: "text", width: "15%" },
            { title: res.App_Creditor, name: "CREDIT", type: "text", width: "15%" },
            { title: res.menu_Costcenter, name: "CC_CODE", type: "text", width: "15%" },
            //    { title: res.TransCCDesc, name: (lang == "ar" ? "CC_DESCA" : "CC_DESCE"), type: "text", width: "15%" },
            { title: res.TransExplain, name: (lang == "ar" ? "LINE_DESCA" : "LINE_DESCE"), type: "text", width: "35%" },
            { title: res.Trns_TrNO, name: "Tr_No", type: "text", width: "15%" },
        ];
    }

    function RefreshTransactions() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("TranPosting", "GetTransactions"),
            data: { UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token/*, Modules: Modules.TranPosting, FinYear: SysSession.CurrentEnvironment.CurrentYear */ },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    LnkTransDetails = new Array<G_LnkTrans_Temp>();
                    LnkTransDetails = result.Response as Array<G_LnkTrans_Temp>;
                    for (let i = 0; i < LnkTransDetails.length; i++) {
                        (LnkTransDetails[i].TR_DATE != null) ? LnkTransDetails[i].TR_DATE = DateFormatRep(LnkTransDetails[i].TR_DATE) : "";
                        (LnkTransDetails[i].IsGenerated == true) ? LnkTransDetails[i].IsGeneratedDesc = "تم " : "";

                    }
                    InitializeTransactionsGrid();
                    TransactionsGrid.DataSource = LnkTransDetails;
                    TransactionsGrid.Bind();
                }
            }
        });
    }

    //------------------------------------------------------ Fill DropDownList Region ----------------------------------
    function fillddlBranch() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GBranch", "GetAll"),
            data: {
                CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    BranchDetails = result.Response as Array<G_BRANCH>;
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                        DocumentActions.FillCombowithdefult(BranchDetails, ddlBranch, "BRA_CODE", "BRA_DESCL", "Select branch");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(BranchDetails, ddlBranch, "BRA_CODE", "BRA_DESC", "اختر الفرع");
                    }

                }

            }
        });
    }

    //------------------------------------------------------ Date && Clear Region ----------------------------------
    function GetDate() {
        var today: Date = new Date();
        var dd: string = today.getDate().toString();
        var ReturnedDate: string;
        var mm: string = (today.getMonth() + 1).toString();
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
    function Clear() {
        //lblVoucherNum.innerText = "";
        txtDesc.value = "";
        txtCedit.value = "";
        txtDebit.value = "";
        txtDiff.value = "";
        txtFromNumber.value = "";
        txtToNumber.value = "";
        VoucherDetailGrid.DataSource = null;
        RefreshTransactions();
    }
    function txtToDate_onchange() {
        txtVoucherDate.value = txtToDate.value;
    }
    function txtVoucherDate_onchange() {

        if (!CheckDate(DateFormat(txtVoucherDate.value).toString(), DateFormat(SysSession.CurrentEnvironment.StartDate).toString(), DateFormat(SysSession.CurrentEnvironment.EndDate).toString())) {
            DisplayMassage("يجب ادخال تاريخ القيد بين السنة المالية ", "you must Enter the date between 'From Date' & 'To Date'", MessageType.Error);
            txtVoucherDate.value = GetDate();
            Errorinput(txtVoucherDate);
        }

        //if (txtVoucherDate.value > txtToDate.value || txtVoucherDate.value < txtFromDate.value) {
        //    DisplayMassage("يجب ادخال تاريخ القيد بين تاريخين الادخال", "you must Enter the date between 'From Date' & 'To Date'", MessageType.Error);
        //    txtVoucherDate.value = txtToDate.value;
        //}

    }

}

