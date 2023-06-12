
$(document).ready(() => {
    ServiceCategories.InitalizeComponent();
})
namespace ServiceCategories {
    var SysSession: SystemSession = GetSystemSession(Modules.ServiceCategories);
    var compcode: Number;
    var BranchCode: number;//SharedSession.CurrentEnvironment.BranchCode;
    var Finyear: number;//SharedSession.CurrentEnvironment.BranchCode;
    var sys: SystemTools = new SystemTools();
    var lang: string;

    //Arrays
    var SelecteData: Array<AVAT_D_SrvCategory> = new Array<AVAT_D_SrvCategory>();
    var SlsInvoiceStatisticsDetails: Array<AQVAT_GetSrvCategory> = new Array<AQVAT_GetSrvCategory>();
    var vat_natuerDetails: Array<G_VatNature> = new Array<G_VatNature>();
    var Model: AVAT_D_SrvCategory = new AVAT_D_SrvCategory();
    var AccountDetails: A_ACCOUNT = new A_ACCOUNT();

    //DropDownlist
    var txtvat_natuer: HTMLSelectElement;
    // giedView
    var Grid: JsGrid = new JsGrid();
    //Textboxes
    var TypeS: HTMLInputElement;
    var TypeP: HTMLInputElement;
    var searchbutmemreport: HTMLInputElement;
    var txt_CODE: HTMLInputElement;
    var txt_descA: HTMLInputElement;
    var txt_descE: HTMLInputElement;
    var txtSaleNO: HTMLInputElement;
    var txtreturnNO: HTMLInputElement;
    var txtdiscountNO: HTMLInputElement;
    var txtService_prefix: HTMLInputElement;
    var txtService_serial: HTMLInputElement;
    //buttons
    var btnShow: HTMLButtonElement;
    var btnAdd: HTMLButtonElement;
    var btnBack: HTMLButtonElement;
    var btnUpdate: HTMLButtonElement;
    var btnSave: HTMLButtonElement;
    var btnSaleNO: HTMLButtonElement;
    var btnreturnNO: HTMLButtonElement;
    var btndiscountNO: HTMLButtonElement;
    //global
    var SearchDetails;

    var flag = true;
    var IsNew = true;
    var SrvCategoryID = 0;
    // var flags: number;

    var txtSaleD: HTMLInputElement;
    var txtreturnD: HTMLInputElement;
    var txtdiscountD: HTMLInputElement;

    var txtCreatedBy: HTMLInputElement;
    var txtCreatedAt: HTMLInputElement;

    var id1;
    export function InitalizeComponent() {
        $("#btnShow").addClass("d-none");
        $("#btnPrintTrview").addClass("d-none");
        $("#btnPrintTrPDF").addClass("d-none");
        $("#btnPrintTrEXEL").addClass("d-none");
        $("#btnPrintTransaction").addClass("d-none");


        InitalizeControls();
        IntializeEvents();
        TypeS.checked = true
        InitializeGrid();
        Fillddlvat_natuer();
        BindStatisticGridData();
    }
    function IntializeEvents() {
        // btnShow.onclick = btnShow_onclick;
        btnAdd.onclick = btnAdd_onclick;
        btnBack.onclick = btnback_onclick;
        searchbutmemreport.onkeyup = _SearchBox_Change;
        btnUpdate.onclick = btnedite_onclick;
        btnSave.onclick = btnsave_onclick;
        btnSaleNO.onclick = btnSaleNO_onclick;
        btnreturnNO.onclick = btnreturnNO_onclick;
        btndiscountNO.onclick = btndiscountNO_onclick;

        txtSaleNO.onchange = txtSaleNO_onchange;
        txtreturnNO.onchange = txtreturnNO_onchange;
        txtdiscountNO.onchange = txtdiscountNO_onchange;

        TypeS.onchange = btnShow_onclick;
        TypeP.onchange = btnShow_onclick;
        txt_CODE.onchange = txt_CODE_onChange;
    }


    function txtSaleNO_onchange() {
        id1 = $('#txtSaleNO').val();
        getAccountById(id1, 1);
    }

    function txtreturnNO_onchange() {
        id1 = $('#txtreturnNO').val();
        getAccountById(id1, 2);
    }
    function txtdiscountNO_onchange() {
        id1 = $('#txtdiscountNO').val();
        getAccountById(id1, 3);
    }

    function txt_CODE_onChange() {

        if (IsNew == true) {

            var x = Number(txt_CODE.value);
            if (x <= 0 || x == null || txt_CODE.value == "") {
                DisplayMassage("يجب ادخال الرمز  ", "Code must be entered", MessageType.Worning);
                Errorinput(txt_CODE);
                txtService_prefix.value = "";
                txtService_serial.value = "";
                return false;
            }
            SelecteData = SlsInvoiceStatisticsDetails.filter(x => x.CAT_CODE == txt_CODE.value);
            if (SelecteData.length > 0) {
                DisplayMassage("الكود موجود من قبل  ", "Code already was found ", MessageType.Worning);
                Errorinput(txt_CODE);
                return false;
            }
            else {
                txtService_prefix.value = txt_CODE.value + "-";
                txtService_serial.value = "000";
            }
        }
    }
    function InitalizeControls() {


        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);
        //vatType = SysSession.CurrentEnvironment.I_Control[0].DefSlsVatType;
        lang = (SysSession.CurrentEnvironment.ScreenLanguage);

        //Drop Downlists


        txtvat_natuer = document.getElementById("txtvat_natuer") as HTMLSelectElement;

        //textboxes

        TypeS = document.getElementById("TypeS") as HTMLInputElement;
        TypeP = document.getElementById("TypeP") as HTMLInputElement;
        searchbutmemreport = document.getElementById("searchbutmemreport") as HTMLInputElement;
        txt_CODE = document.getElementById("txt_CODE") as HTMLInputElement;
        txt_descA = document.getElementById("txt_descA") as HTMLInputElement;
        txt_descE = document.getElementById("txt_descE") as HTMLInputElement;
        txtSaleNO = document.getElementById("txtSaleNO") as HTMLInputElement;
        txtreturnNO = document.getElementById("txtreturnNO") as HTMLInputElement;
        txtdiscountNO = document.getElementById("txtdiscountNO") as HTMLInputElement;
        txtService_prefix = document.getElementById("txtService_prefix") as HTMLInputElement;
        txtService_serial = document.getElementById("txtService_serial") as HTMLInputElement;


        txtSaleD = document.getElementById("txtSaleD") as HTMLInputElement;
        txtreturnD = document.getElementById("txtreturnD") as HTMLInputElement;
        txtdiscountD = document.getElementById("txtdiscountD") as HTMLInputElement;

        txtCreatedBy = document.getElementById("txtCreatedBy") as HTMLInputElement;
        txtCreatedAt = document.getElementById("txtCreatedAt") as HTMLInputElement;

        //buttons

        btnShow = document.getElementById("btnShow") as HTMLButtonElement;
        btnAdd = document.getElementById("btnAdd") as HTMLButtonElement;
        btnBack = document.getElementById("btnBack") as HTMLButtonElement;
        btnUpdate = document.getElementById("btnUpdate") as HTMLButtonElement;
        btnSave = document.getElementById("btnSave") as HTMLButtonElement;
        btnSaleNO = document.getElementById("btnSaleNO") as HTMLButtonElement;
        btnreturnNO = document.getElementById("btnreturnNO") as HTMLButtonElement;
        btndiscountNO = document.getElementById("btndiscountNO") as HTMLButtonElement;




        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = " فئات الخدمات";

        } else {
            document.getElementById('Screen_name').innerHTML = "Service Categories";

        }


    }
    
    function btnSaleNO_onclick() {


        sys.FindKey(Modules.Accountstatement, "btnFromAccSearch", "COMP_CODE= " + compcode + " and DETAIL = 1  ", () => {
            var id1 = SearchGrid.SearchDataGrid.SelectedKey
            $('#txtSaleNO').val(id1);
            getAccountById(id1, 1);
        });
        // flags = 1;

    }
    function btnreturnNO_onclick() {

        var accGrup: number;
        if (TypeP.checked == true) {
            accGrup = 4;
        } else {
            accGrup = 5;

        }


        sys.FindKey(Modules.Accountstatement, "btnFromAccSearch", "COMP_CODE= " + compcode + " and DETAIL = 1 ", () => {
            var id = SearchGrid.SearchDataGrid.SelectedKey
            $('#txtreturnNO ').val(id);

            getAccountById(id, 2);
        });
        //flags = 2;
    }
    function btndiscountNO_onclick() {
        let accGrup: number;

        sys.FindKey(Modules.Accountstatement, "btnFromAccSearch", "COMP_CODE= " + compcode + " and DETAIL = 1 ", () => {
            let id = SearchGrid.SearchDataGrid.SelectedKey
            $('#txtdiscountNO').val(id);
            getAccountById(id, 3);

        });
        //  flags = 3;
    }

    function getAccountById(accountCode: string, flag: number) {
        // call ajax
        var AccCode = accountCode;
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GLDefAccount", "GetActivAccByCode"),
            data: { CompCode: compcode, AccCode: AccCode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;


                if (result.IsSuccess) {
                    AccountDetails = result.Response as A_ACCOUNT;
                    if (flag == 1) {
                        $('#txtSaleD').val(AccountDetails.ACC_DESCA);

                    }

                    if (flag == 2) {
                        $('#txtreturnD').val(AccountDetails.ACC_DESCA);

                    }

                    if (flag == 3) {
                        $('#txtdiscountD').val(AccountDetails.ACC_DESCA);

                    }



                }
            }
        });

    }

    function InitializeGrid() {

        let res: any = GetResourceList("");
        Grid.ElementName = "ReportGrid";
        Grid.Paging = true;
        Grid.PageSize = 10;
        Grid.Sorting = true;
        Grid.Editing = false;
        Grid.Inserting = false;
        Grid.OnRowDoubleClicked = doubleclick;
        Grid.SelectedIndex = 1;
        Grid.PrimaryKey = "SrvCategoryID";
        Grid.Columns = [
            { title: "ID", name: "SrvCategoryID", type: "text", width: "5%", visible: false },
            { title: res.SHT_Code, name: "CAT_CODE", type: "text", width: "15%" },
            { title: res.App_DescA, name: "DescA", type: "text", width: "25%" },
            { title: res.App_DescE, name: "DescE", type: "text", width: "25%" },
            { title: res.App_Tax, name: (lang == "ar" ? "VatNatureDescA" : "VatNatureDescE"), type: "text", width: "15%" },
            //  { title: res.App_Tax, name: "VatNatID", type: "text", width: "40%" },
            { title: res.Service_prefix, name: "ItemFormatFix", type: "text", width: "12.5%" },
            { title: res.Service_serial, name: "ItemFormatSerial", type: "text", width: "12.5%" },

        ];


    }
    function btnShow_onclick() {
        // $("#lebtxtSaleNO").html("رقم حساب المشتريات")
        BindStatisticGridData();
        $("#Div_control").addClass("display_none");
    }
    function BindStatisticGridData() {
        $("#id_div_Add").removeAttr("disabled").off('click');
        $("#id_div_Add").removeClass("disabledDiv");
        var IsPurchase: boolean;
        if (TypeS.checked == true) {
            $("#lebtxtSaleNO").html("رقم حساب المبيعات")
            IsPurchase = true;
        } else {
            $("#lebtxtSaleNO").html("رقم حساب المشتريات")
            IsPurchase = false;

        }
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AVATSrvCategory", "GetServiceCat"),
            data: { UserCode: SysSession.CurrentEnvironment.UserCode, compcode: compcode, IsPurchase: IsPurchase, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    SlsInvoiceStatisticsDetails = result.Response as Array<AQVAT_GetSrvCategory>;


                }
            }
        });

        Grid.DataSource = SlsInvoiceStatisticsDetails;
        Grid.Bind();
    }
    function btnAdd_onclick() {
        if (TypeS.checked == true) {
            $("#lebtxtSaleNO").html("رقم حساب المشتريات")

        } else {
            $("#lebtxtSaleNO").html("رقم حساب المبيعات")


        }
        flag = false;
        $("#id_div_Add").attr("disabled", "disabled").off('click');
        $("#id_div_Add").addClass("disabledDiv");
        $("#Div_control").removeClass("display_none");
        textdel();
        removedis();
        txtCreatedAt.value = DateTimeFormat(GetDate().toString());
        txtCreatedBy.value = SysSession.CurrentEnvironment.UserCode;
    }
    function btnback_onclick() {
        if (flag == false) {

            $("#id_div_Add").removeAttr("disabled").off('click');
            $("#id_div_Add").removeClass("disabledDiv");
            $("#Div_control").addClass("display_none");
            textdel();
            $("#btnUpdate").addClass("display_none");
            $("#btnSave").addClass("display_none");
            $("#btnBack").addClass("display_none");
            adddis();
        } else {
            $("#id_div_Add").removeAttr("disabled").off('click');
            $("#id_div_Add").removeClass("disabledDiv");
            $("#btnUpdate").removeClass("display_none");
            $("#btnSave").addClass("display_none");
            $("#btnBack").addClass("display_none");
            adddis();
            doubleclick();
        }
    }
    function btnedite_onclick() {

        $("#id_div_Add").attr("disabled", "disabled").off('click');
        $("#id_div_Add").addClass("disabledDiv");
        flag = true;
        removedis();
        $("#txt_CODE").attr("disabled", "disabled");

        $("#btnUpdate").addClass("display_none");
        $("#btnSave").removeClass("display_none");
        $("#btnBack").removeClass("display_none");
        IsNew = false;
    }
    function btnsave_onclick() {
        loading('btnSave');

        setTimeout(function () {

            finishSave('btnSave');


        if (!validation())
            return;



        if (flag == true) {
            IsNew = false;
            Update();
        }
        else {
            IsNew = true;
            Insert();

        }

    }, 100);
    }
    function success() {

        $("#btnUpdate").removeClass("display_none");
        $("#btnSave").addClass("display_none");
        $("#btnBack").addClass("display_none")

        BindStatisticGridData();

        $("#Div_control").removeClass("display_none");
        $("#btnUpdate").removeClass("display_none");
        SelecteData = SlsInvoiceStatisticsDetails.filter(x => x.SrvCategoryID == Number(SrvCategoryID));
        DocumentActions.RenderFromModel(SelecteData[0]);
        SrvCategoryID = SelecteData[0].SrvCategoryID;


        adddis();
    }
    function insertsuccess() {

        $("#btnUpdate").removeClass("display_none");
        $("#btnSave").addClass("display_none");
        $("#btnBack").addClass("display_none")

        BindStatisticGridData();

        $("#Div_control").removeClass("display_none");
        $("#btnUpdate").removeClass("display_none");
        SelecteData = SlsInvoiceStatisticsDetails.filter(x => x.SrvCategoryID == Number(SrvCategoryID));
        DocumentActions.RenderFromModel(SelecteData[0]);
        SrvCategoryID = SelecteData[0].SrvCategoryID;

        adddis();


    }
    function Assign() {
        var pur: boolean = false;
        if (TypeS.checked == true) {
            pur = true;
        }
        Model = new AVAT_D_SrvCategory();
        if (IsNew == true) {
            DocumentActions.AssignToModel(Model);//Insert Update
            Model.SrvCategoryID = 0;
            Model.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
            Model.UserCode = SysSession.CurrentEnvironment.UserCode;
            Model.COMP_CODE = Number(SysSession.CurrentEnvironment.CompCode);
            Model.CreatedAt = DateTimeFormat(Date().toString());
            Model.CreatedBy = SysSession.CurrentEnvironment.UserCode;
            Model.IsPurchase = pur;
            Model.VatNatID = Number(txtvat_natuer.value);

            Model.Branch_Code = SysSession.CurrentEnvironment.BranchCode;
            Model.Comp_Code = SysSession.CurrentEnvironment.CompCode;
            Model.MODULE_CODE = Modules.ServiceCategories; 
            Model.sec_FinYear = SysSession.CurrentEnvironment.CurrentYear;

        }
        else {
            DocumentActions.AssignToModel(Model);//Insert Update
            Model.SrvCategoryID = SrvCategoryID;
            Model.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
            Model.UserCode = SysSession.CurrentEnvironment.UserCode;
            Model.UpdatedAt = DateTimeFormat(Date().toString());
            Model.UpdatedBy = SysSession.CurrentEnvironment.UserCode;
            Model.COMP_CODE = Number(SysSession.CurrentEnvironment.CompCode);
            Model.IsPurchase = pur;
            Model.VatNatID = Number(txtvat_natuer.value);

            Model.Branch_Code = SysSession.CurrentEnvironment.BranchCode;
            Model.Comp_Code = SysSession.CurrentEnvironment.CompCode;
            Model.MODULE_CODE = Modules.ServiceCategories;
            Model.sec_FinYear = SysSession.CurrentEnvironment.CurrentYear;

        }


    }
    function Insert() {
        Assign();


        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("AVATSrvCategory", "Insert"),
            data: JSON.stringify(Model),
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    DisplayMassage("تم الحفظ بنجاح", "Saved successfully", MessageType.Succeed);
                    SrvCategoryID = result.Response;
                    insertsuccess();
                    Save_Succ_But();
                }
                else {
                    DisplayMassage("خطأء", "Error", MessageType.Error);
                }

            }
        });
    }
    function Update() {
        Assign();
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("AVATSrvCategory", "Update"),
            data: JSON.stringify(Model),
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    DisplayMassage("تم الحفظ بنجاح", "Success", MessageType.Succeed);
                    success();
                    Save_Succ_But();
                } else {
                    DisplayMassage("خطأء", "Error", MessageType.Error);

                }
            }
        });

    }
    function Fillddlvat_natuer() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GenVatType", "GetAllVatNature"),
            data: {
                CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    vat_natuerDetails = result.Response as Array<G_VatNature>;

                    if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
                        DocumentActions.FillCombowithdefult(vat_natuerDetails, txtvat_natuer, "VatNatID", "VatNatureDescA", "اختر نوع الضريبه");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(vat_natuerDetails, txtvat_natuer, "VatNatID", "VatNatureDescE", "Select Vendor");
                    }
                }
            }
        });
    }
    function _SearchBox_Change() {
        if (searchbutmemreport.value != "") {

            let search: string = searchbutmemreport.value.toLowerCase();
            SearchDetails = SlsInvoiceStatisticsDetails.filter(x => x.CAT_CODE.toString().search(search) >= 0 || x.DescA.toLowerCase().search(search) >= 0 || x.DescE.toLowerCase().search(search) >= 0 || x.VatNatureDescA.toLowerCase().search(search) >= 0 || x.VatNatureDescE.toLowerCase().search(search) >= 0);

            Grid.DataSource = SearchDetails;
            Grid.Bind();
        } else {
            Grid.DataSource = SlsInvoiceStatisticsDetails;
            Grid.Bind();
        }
    }
    function textdel() {
        $("#btnUpdate").addClass("display_none");
        $("#btnSave").removeClass("display_none");
        $("#btnBack").removeClass("display_none");
        $("#txt_CODE").val("");
        $("#txt_descA").val("");
        $("#txt_descE").val("");
        $("#txtSaleNO").val("");
        $("#txtreturnNO").val("");
        $("#txtdiscountNO").val("");
        $("#txtvat_natuer").val("null");
        $("#txtService_prefix").val("");
        $("#txtService_serial").val("");
        $("#txtCreatedBy").val("");
        $("#txtCreatedAt").val("");
        $("#txtUpdatedBy").val("");
        $("#txtUpdatedAt").val("");


        $("#txtSaleD").val("");
        $("#txtreturnD").val("");
        $("#txtdiscountD").val("");

    }
    function removedis() {

        $("#txt_CODE").removeAttr("disabled");
        $("#txt_descA").removeAttr("disabled");
        $("#txt_descE").removeAttr("disabled");
        $("#btnSaleNO").removeAttr("disabled");
        $("#btnreturnNO").removeAttr("disabled");
        $("#btndiscountNO").removeAttr("disabled");
        $("#txtvat_natuer").removeAttr("disabled");

        $("#txtSaleNO").removeAttr("disabled");
        $("#txtreturnNO").removeAttr("disabled");
        $("#txtdiscountNO").removeAttr("disabled");
        $("#txtService_prefix").removeAttr("disabled");
        $("#txtService_serial").removeAttr("disabled");

    }
    function adddis() {

        $("#txt_CODE").attr("disabled", "disabled");
        $("#txt_descA").attr("disabled", "disabled");
        $("#txt_descE").attr("disabled", "disabled");
        $("#txtSaleNO").attr("disabled", "disabled");
        $("#txtreturnNO").attr("disabled", "disabled");
        $("#txtdiscountNO").attr("disabled", "disabled");
        $("#txtvat_natuer").attr("disabled", "disabled");
        $("#txtService_prefix").attr("disabled", "disabled");
        $("#txtService_serial").attr("disabled", "disabled");


    }
    function doubleclick() {

        if (TypeS.checked == true) {
            $("#lebtxtSaleNO").html("رقم حساب المشتريات")

        } else {
            $("#lebtxtSaleNO").html("رقم حساب المبيعات")


        }
        $("#Div_control").removeClass("display_none");
        $("#btnUpdate").removeClass("display_none");
        

        SelecteData = SlsInvoiceStatisticsDetails.filter(x => x.SrvCategoryID == Number(Grid.SelectedKey));
        getAccountById(SelecteData[0].SALES_ACC_CODE, 1);
        getAccountById(SelecteData[0].RETURN_ACC_CODE, 2);
        getAccountById(SelecteData[0].DISC_ACC_CODE, 3);

        DocumentActions.RenderFromModel(SelecteData[0]);
        SrvCategoryID = SelecteData[0].SrvCategoryID;
    }
    function validation() {

        var x = Number(txt_CODE.value);
        if (x <= 0 || x == null || txt_CODE.value == "") {
            DisplayMassage("يجب ادخال الرمز  ", "Code must be entered", MessageType.Worning);
            Errorinput(txt_CODE);
            txtService_prefix.value = "";
            txtService_serial.value = "";
            return false;
        }
        if ((txt_descA.value == "" || txt_descA.value.trim() == "") && (txt_descE.value == "" || txt_descE.value.trim() == "")) {
            DisplayMassage("يجب ادخال الوصف بالعربي او الوصف بالانجليزي  ", "Arabic or English describtion must be entered", MessageType.Worning);
            Errorinput(txt_descA); Errorinput(txt_descE);
            return false;
        }
        if ((txt_descA.value == "" || txt_descA.value.trim() == "") && txt_descE.value != "") {
            txt_descA.value = txt_descE.value;
        }
        if ((txt_descE.value == "" || txt_descE.value.trim() == "") && txt_descA.value != "") {
            txt_descE.value = txt_descA.value;
        }
        if (txtSaleNO.value == "" || txtSaleNO.value.trim() == "") {
            DisplayMassage("يجب ادخال رقم حساب المبيعات", "Sales account number must be entered", MessageType.Worning);
            Errorinput(txtSaleNO);
            return false;
        }
        if (txtreturnNO.value == "" || txtreturnNO.value.trim() == "") {
            DisplayMassage("يجب ادخال رقم حساب المرتجع  ", "Return account number must be entered", MessageType.Worning);
            Errorinput(txtreturnNO);
            return false;
        }
        if (txtdiscountNO.value == "" || txtdiscountNO.value.trim() == "") {
            DisplayMassage("يجب ادخال رقم حساب الخصم  ", "Discount account number must be entered", MessageType.Worning);
            Errorinput(txtdiscountNO);
            return false;
        }
        if (txtvat_natuer.value == "null") {
            DisplayMassage("يجب ادخال نوع الضريبه", "Vat Type must be selected", MessageType.Worning);
            Errorinput(txtvat_natuer);
            return false;
        }
        //if (txtService_prefix.value == "" || txtService_prefix.value.trim() == "") {
        //    DisplayMassage("يجب ادخال مميز الخدمة  ", "Service prefix must be entered", MessageType.Worning);
        //    Errorinput(txtService_prefix);
        //    return false;
        //}
        //if (txtService_serial.value == "" || txtService_serial.value.trim() == "") {
        //    DisplayMassage("يجب ادخال مسلسل الخدمة  ", "Service serial must be entered", MessageType.Worning);
        //    Errorinput(txtService_serial);
        //    return false;
        //}

        return true;
    }
} 