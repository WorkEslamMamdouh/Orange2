$(document).ready(() => {

    AdminCompData.InitalizeComponent();
})

namespace AdminCompData {

    var CompCode: Number;
    var AccountType: Number = 1;
    var sys: SystemTools = new SystemTools();
    var SysSession: SystemSession = GetSystemSession('Home');
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);



    var ddlCompFilter: HTMLSelectElement;
    var ddlBraFilter: HTMLSelectElement;
    var ddlCompInforFilter: HTMLSelectElement;
    var ddlBraInforFilter: HTMLSelectElement;


    var txt_FIN_YEAR: HTMLInputElement;
    var txt_FirstDate: HTMLInputElement;
    var txt_LastDate: HTMLInputElement;
    var ddl_OpenAccVoucheNo: HTMLSelectElement;
    var ddl_OpenInvAdjNo: HTMLSelectElement;
    var txt_VAT_YEAR: HTMLInputElement;
    var txt_VAT_START_DATE: HTMLInputElement;
    var txt_VAT_END_DATE: HTMLInputElement;
    var ddl_VAT_PERIOD: HTMLSelectElement;


    var Chk_CopyAccount: HTMLInputElement;
    var Chk_CopyAccount2: HTMLInputElement;
    var Chk_CopyCoseCenter: HTMLInputElement;
    var Chk_CopyCoseCenter2: HTMLInputElement;
    var Chk_copyAccLink: HTMLInputElement;
    var Chk_copyAccLink2: HTMLInputElement;
    var Chk_CopyCharges: HTMLInputElement;
    var Chk_CopyCharges2: HTMLInputElement;
    var Chk_CopyItems: HTMLInputElement;
    var Chk_CopyItems2: HTMLInputElement;
    var Chk_CopyStkCategory: HTMLInputElement;
    var Chk_CopyStkCategory2: HTMLInputElement;
    var Chk_CopyCustVndCat: HTMLInputElement;
    var Chk_CopyCustVndCat2: HTMLInputElement;


    var btnInitialize: HTMLButtonElement;

    var btnAdd: HTMLButtonElement;
    var btnEdit: HTMLButtonElement;
    var btnBack: HTMLButtonElement;
    var btnSave: HTMLButtonElement;
    var btnAdd2: HTMLButtonElement;
    var btnEdit2: HTMLButtonElement;
    var btnBack2: HTMLButtonElement;
    var btnSave2: HTMLButtonElement;

    var IsNew = true;


    //------------------------------------------------------------

    var CompFilter: Array<G_COMPANY> = new Array<G_COMPANY>();
    var BraFilter: Array<G_BRANCH> = new Array<G_BRANCH>();
    var CompInforFilter: Array<G_COMPANY> = new Array<G_COMPANY>();
    var BraInforFilter: Array<G_BRANCH> = new Array<G_BRANCH>();
    //var Initializebtn: Array<G_BRANCH> = new Array<G_BRANCH>();

    var OpenAccVoucheNoFilter: Array<A_Voucher_Types> = new Array<A_Voucher_Types>();
    var OpenInvAdjNoFilter: Array<G_Codes> = new Array<G_Codes>();
    //var VAT_PERIODFilter: Array<AVAT_CONTROL> = new Array<AVAT_CONTROL>();
    var VAT_PERIODFilter = new Array(2);
    var Model: G_CONTROL = new G_CONTROL();
    var ModelAVatControl: AVAT_CONTROL = new AVAT_CONTROL();

    var SelectData: Array<G_CONTROL> = new Array<G_CONTROL>();
    var SelectDataAVat: Array<AVAT_CONTROL> = new Array<AVAT_CONTROL>();


    export function InitalizeComponent() {
        try {

            CompCode = Number(SysSession.CurrentEnvironment.CompCode);
            VAT_PERIODFilter = [{ id: 1, value: 'كل شهر' }, { id: 2, value: 'كل 3 شهور' }];
            InitalizeControls();
            InitalizeEvents();
            //FillddlCompFilter();
            FillCompInforFilter();
            FillddlCompFilter();
            FillVAT_PERIODFilter();
            //alertddlbranch();
            alertddlInforbranch();

            Fillddl_OpenInvAdjNo();
            DisAbledGControl();
            DisAbledAVatControl();
            Disabled();
            //Fillddl_OpenAccVoucheNo();
            //ddlCompFilter_onchange();
            //btnInitialize_onclick();
            $("#btnEdit").addClass("display_none");
            $("#btnEdit2").addClass("display_none");

            Chk_CopyAccount2.checked = true;
            Chk_CopyCoseCenter2.checked = true;
            Chk_copyAccLink2.checked = true;
            Chk_CopyCharges2.checked = true;
            Chk_CopyItems2.checked = true;
            Chk_CopyStkCategory2.checked = true;
            Chk_CopyCustVndCat2.checked = true;


        } catch (e) {
            MessageBox.Show("      يجب معاودة الدخول مرة اخري بستخدم الاسم وكلمة السر", "You must log in again using your name and password ", function () {
                window.location.href = "/Login/HomePage";

            }), 1000;
        }
    }

    function InitalizeControls() {
        ddlCompFilter = document.getElementById("ddlCompFilter") as HTMLSelectElement;
        ddlBraFilter = document.getElementById("ddlBraFilter") as HTMLSelectElement;
        ddlCompInforFilter = document.getElementById("ddlCompInforFilter") as HTMLSelectElement;
        ddlBraInforFilter = document.getElementById("ddlBraInforFilter") as HTMLSelectElement;
        btnInitialize = document.getElementById("btnInitialize") as HTMLButtonElement;
        btnAdd = document.getElementById("btnAdd") as HTMLButtonElement;
        btnEdit = document.getElementById("btnEdit") as HTMLButtonElement;
        btnBack = document.getElementById("btnBack") as HTMLButtonElement;
        btnSave = document.getElementById("btnSave") as HTMLButtonElement;
        btnAdd2 = document.getElementById("btnAdd2") as HTMLButtonElement;
        btnEdit2 = document.getElementById("btnEdit2") as HTMLButtonElement;
        btnBack2 = document.getElementById("btnBack2") as HTMLButtonElement;
        btnSave2 = document.getElementById("btnSave2") as HTMLButtonElement;


        txt_FIN_YEAR = document.getElementById("txt_FIN_YEAR") as HTMLInputElement;
        txt_FirstDate = document.getElementById("txt_FirstDate") as HTMLInputElement;
        txt_LastDate = document.getElementById("txt_LastDate") as HTMLInputElement;
        ddl_OpenAccVoucheNo = document.getElementById("ddl_OpenAccVoucheNo") as HTMLSelectElement;
        ddl_OpenInvAdjNo = document.getElementById("ddl_OpenInvAdjNo") as HTMLSelectElement;

        txt_VAT_YEAR = document.getElementById("txt_VAT_YEAR") as HTMLInputElement;
        txt_VAT_START_DATE = document.getElementById("txt_VAT_START_DATE") as HTMLInputElement;
        txt_VAT_END_DATE = document.getElementById("txt_VAT_END_DATE") as HTMLInputElement;
        ddl_VAT_PERIOD = document.getElementById("ddl_VAT_PERIOD") as HTMLSelectElement;

        Chk_CopyAccount = document.getElementById("Chk_CopyAccount") as HTMLInputElement;
        Chk_CopyAccount2 = document.getElementById("Chk_CopyAccount2") as HTMLInputElement;
        Chk_CopyCoseCenter = document.getElementById("Chk_CopyCoseCenter") as HTMLInputElement;
        Chk_CopyCoseCenter2 = document.getElementById("Chk_CopyCoseCenter2") as HTMLInputElement;
        Chk_copyAccLink = document.getElementById("Chk_copyAccLink") as HTMLInputElement;
        Chk_copyAccLink2 = document.getElementById("Chk_copyAccLink2") as HTMLInputElement;
        Chk_CopyCharges = document.getElementById("Chk_CopyCharges") as HTMLInputElement;
        Chk_CopyCharges2 = document.getElementById("Chk_CopyCharges2") as HTMLInputElement;
        Chk_CopyItems = document.getElementById("Chk_CopyItems") as HTMLInputElement;
        Chk_CopyItems2 = document.getElementById("Chk_CopyItems2") as HTMLInputElement;
        Chk_CopyStkCategory = document.getElementById("Chk_CopyStkCategory") as HTMLInputElement;
        Chk_CopyStkCategory2 = document.getElementById("Chk_CopyStkCategory2") as HTMLInputElement;
        Chk_CopyCustVndCat = document.getElementById("Chk_CopyCustVndCat") as HTMLInputElement;
        Chk_CopyCustVndCat2 = document.getElementById("Chk_CopyCustVndCat2") as HTMLInputElement;
    }

    function InitalizeEvents() {

        ddlCompFilter.onchange = ddlCompFilter_onchange;

        ddlCompInforFilter.onchange = ddlCompInforFilter_onchange;


        btnInitialize.onclick = btnInitialize_onclick;

        btnAdd.onclick = btnAdd_onclick;
        btnEdit.onclick = btnEdit_onclick;
        btnBack.onclick = btnBack_onclick;
        btnSave.onclick = btnSave_onclick;

        btnAdd2.onclick = btnAdd2_onclick;
        btnEdit2.onclick = btnEdit2_onclick;
        btnBack2.onclick = btnBack2_onclick;
        btnSave2.onclick = btnSave2_onclick;

        ddl_OpenAccVoucheNo.onclick = ddl_OpenAccVoucheNo_onchange;

    }
    function ddl_OpenAccVoucheNo_onchange() {
        if (ddlCompInforFilter.value == "null") {
            DisplayMassage("يجب ادخال اسم الشركة من مصدر المعلومات   ", "Please, Enter The Company Name!", MessageType.Worning);
            Errorinput(ddlCompInforFilter);
            return false;
        }
        else {
            Fillddl_OpenAccVoucheNo();
        }
    }

    function InitializeGrid() {

    }

    function FillddlCompFilter() {


        Ajax.Callsync({// GetAll( string UserCode, string Token)
            type: "Get",
            url: sys.apiUrl("GComp", "GetAll"),
            //url: link +"GComp/GetAll", 
            data: { UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {

                    CompFilter = result.Response as Array<G_COMPANY>;

                    DocumentActions.FillCombowithdefult(CompFilter, ddlCompFilter, "COMP_CODE", "NameA", "اختر الشركة");

                }

            }
        });

    }
    function FillBraFilter() {

        if (alertddlbranch())
            return


        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GBranch", "GetAll"),
            data: { CompCode: ddlCompFilter.value, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    BraFilter = result.Response as Array<G_BRANCH>;
                    DocumentActions.FillCombowithdefult(BraFilter, ddlBraFilter, "BRA_CODE", "BRA_DESC", "اختر الفرع")
                }
            }
        });
    }

    function alertddlbranch() {

        if (ddlCompFilter.value == "null") {
            Clear();
            ddlBraFilter.disabled = true;
            $("#ddlBraFilter").val('null');
            return true;
        }
        else {
            ddlBraFilter.disabled = false;
            return false;
        }
    }
    function alertddlInforbranch() {

        if (ddlCompInforFilter.value == "null") {
            ddlBraInforFilter.disabled = true;
            $("#ddlBraInforFilter").val('null');

            return true;
        }
        else {
            ddlBraInforFilter.disabled = false;


            //FillddlCompFilter();
            //alertddlbranch();

            return false;
        }
    }


    function FillCompInforFilter() {


        Ajax.Callsync({// GetAll( string UserCode, string Token)
            type: "Get",
            url: sys.apiUrl("GComp", "GetAll"),
            //url: link +"GComp/GetAll", 
            data: { UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {

                    CompInforFilter = result.Response as Array<G_COMPANY>;

                    DocumentActions.FillCombowithdefult(CompInforFilter, ddlCompInforFilter, "COMP_CODE", "NameA", "اختر الشركة");


                }

            }
        });


    }
    function FillBraInforFilter() {

        if (alertddlInforbranch())
            return


        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GBranch", "GetAll"),
            data: { CompCode: ddlCompInforFilter.value, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    BraInforFilter = result.Response as Array<G_BRANCH>;
                    DocumentActions.FillCombowithdefult(BraInforFilter, ddlBraInforFilter, "BRA_CODE", "BRA_DESC", "اختر الفرع")
                }
            }
        });
    }

    function Clear() {
        //ddlCompFilter.value = "null";
        //ddlCompInforFilter.value = "null";
        ddlBraFilter.value = "null";
        ddlBraInforFilter.value = "null";

        txt_FIN_YEAR.value = "0";
        txt_FirstDate.value = "";
        txt_LastDate.value = "";
        ddl_OpenAccVoucheNo.value = "null";
        ddl_OpenInvAdjNo.value = "null";

        txt_VAT_YEAR.value = "0";
        txt_VAT_START_DATE.value = "";
        txt_VAT_END_DATE.value = "";
        ddl_VAT_PERIOD.value = "null";
    }

    function Enabled() {
        ddlCompFilter.disabled = false;
        ddlCompInforFilter.disabled = false;
        ddlBraFilter.disabled = false;
        ddlBraInforFilter.disabled = false;

        Chk_CopyAccount.disabled = false;
        Chk_CopyAccount2.disabled = false;
        Chk_CopyCoseCenter.disabled = false;
        Chk_CopyCoseCenter2.disabled = false;
        Chk_copyAccLink.disabled = false;
        Chk_copyAccLink2.disabled = false;
        Chk_CopyCharges.disabled = false;
        Chk_CopyCharges2.disabled = false;
        Chk_CopyItems.disabled = false;
        Chk_CopyItems2.disabled = false;
        Chk_CopyStkCategory.disabled = false;
        Chk_CopyStkCategory2.disabled = false;
        Chk_CopyCustVndCat.disabled = false;
        Chk_CopyCustVndCat2.disabled = false;
    }
    function Disabled() {
        //ddlCompFilter.disabled = true;
        //ddlCompInforFilter.disabled = true;
        ddlBraFilter.disabled = true;
        ddlBraInforFilter.disabled = true;

        txt_FIN_YEAR.disabled = true;
        txt_FirstDate.disabled = true;
        txt_LastDate.disabled = true;
        ddl_OpenAccVoucheNo.disabled = true;
        ddl_OpenInvAdjNo.disabled = true;

        txt_VAT_YEAR.disabled = true;
        txt_VAT_START_DATE.disabled = true;
        txt_VAT_END_DATE.disabled = true;
        ddl_VAT_PERIOD.disabled = true;


        Chk_CopyAccount.disabled = true;
        Chk_CopyAccount2.disabled = true;
        Chk_CopyCoseCenter.disabled = true;
        Chk_CopyCoseCenter2.disabled = true;
        Chk_copyAccLink.disabled = true;
        Chk_copyAccLink2.disabled = true;
        Chk_CopyCharges.disabled = true;
        Chk_CopyCharges2.disabled = true;
        Chk_CopyItems.disabled = true;
        Chk_CopyItems2.disabled = true;
        Chk_CopyStkCategory.disabled = true;
        Chk_CopyStkCategory2.disabled = true;
        Chk_CopyCustVndCat.disabled = true;
        Chk_CopyCustVndCat2.disabled = true;


    }

    function btnInitialize_onclick() {

        if (!Validation()) {
            return;
        }


        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GComp", "IPRoc_initCompany"),
            data: {
                comp: Number(ddlCompFilter.value), BraCode: Number(ddlBraFilter.value), yearid: Number(txt_FIN_YEAR.value),
                fromcomp: Number(ddlCompInforFilter.value),
                CopyAccount: Number(Chk_CopyAccount.checked), CopyCoseCenter: Number(Chk_CopyCoseCenter.checked),
                copyAccLink: Number(Chk_copyAccLink.checked), CopyCustVndCat: Number(Chk_CopyCustVndCat.checked),
                CopyCharges: Number(Chk_CopyCharges.checked), CopyStkCategory: Number(Chk_CopyStkCategory.checked),
                CopyItems: Number(Chk_CopyItems.checked), UserCode: SysSession.CurrentEnvironment.UserCode,
                Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    DisplayMassage("تم التهيئة بنجاح", "Saved successfully", MessageType.Succeed);

                }
            }
        });

    }

    function Fillddl_OpenAccVoucheNo() {


        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GLTrVoucher", "GetAllVoucherTypes"),
            data: { UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token, VoucherType: 1, CompCode: Number(ddlCompInforFilter.value) },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {

                    OpenAccVoucheNoFilter = result.Response as Array<A_Voucher_Types>;
                    //OpenAccVoucheNoFilter = OpenAccVoucheNoFilter.filter(x => x.COMP_CODE == Number(ddlCompInforFilter.value));
                    DocumentActions.FillCombowithdefult(OpenAccVoucheNoFilter, ddl_OpenAccVoucheNo, "TYPE_CODE", "TYPE_DESCA", "اختر نوع القيد");

                }

            }
        });

    }


    function Fillddl_OpenInvAdjNo() {


        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GCodes", "GetAll"),
            data: { codeType: "StkAdjType", UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {

                    OpenInvAdjNoFilter = result.Response as Array<G_Codes>;
                    //  OpenInvAdjNoFilter = OpenInvAdjNoFilter.filter(x => x.CodeType == ddlCompInforFilter.value);
                    DocumentActions.FillCombowithdefult(OpenInvAdjNoFilter, ddl_OpenInvAdjNo, "CodeValue", "DescA", "اختر نوع التسوية");

                }

            }
        });

    }


    function FillVAT_PERIODFilter() {
        DocumentActions.FillComboFirstvalue(VAT_PERIODFilter, ddl_VAT_PERIOD, "id", "value", "- اختر -", null);
        //Ajax.Callsync({
        //    type: "Get",
        //    url: sys.apiUrl("AVATCONTROL", "GetAll"),
        //    data: { UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
        //    success: (d) => {
        //        let result = d as BaseResponse;
        //        if (result.IsSuccess) {

        //            VAT_PERIODFilter = result.Response as Array<AVAT_CONTROL>;

        //            DocumentActions.FillCombowithdefult(VAT_PERIODFilter, ddl_VAT_PERIOD, "COMP_CODE", "VAT_PERIOD", "فترة التكرار كل ");

        //        }

        //    }
        //});

    }

    function DisAbledGControl() {

        txt_FIN_YEAR.disabled = true;
        txt_FirstDate.disabled = true;
        txt_LastDate.disabled = true;
        ddl_OpenAccVoucheNo.disabled = true;
        ddl_OpenInvAdjNo.disabled = true;

    }
    function DisAbledAVatControl() {

        txt_VAT_YEAR.disabled = true;
        txt_VAT_START_DATE.disabled = true;
        txt_VAT_END_DATE.disabled = true;
        ddl_VAT_PERIOD.disabled = true;


    }

    function EnabledGControl() {
        txt_FIN_YEAR.disabled = false;
        txt_FirstDate.disabled = false;
        txt_LastDate.disabled = false;
        ddl_OpenAccVoucheNo.disabled = false;
        ddl_OpenInvAdjNo.disabled = false;

    }
    function EnabledAVatControl() {

        txt_VAT_YEAR.disabled = false;
        txt_VAT_START_DATE.disabled = false;
        txt_VAT_END_DATE.disabled = false;
        ddl_VAT_PERIOD.disabled = false;
    }

    function ClearGControl() {

        txt_FIN_YEAR.value = "0";
        txt_FirstDate.value = "";
        txt_LastDate.value = "";
        ddl_OpenAccVoucheNo.value = "null";
        ddl_OpenInvAdjNo.value = "null";

    }
    function ClearAVatControl() {

        txt_VAT_YEAR.value = "0";
        txt_VAT_START_DATE.value = "";
        txt_VAT_END_DATE.value = "";
        ddl_VAT_PERIOD.value = "null";
    }

    function btnAdd_onclick() {
        if (!ValidationAdd()) {
            return;
        }
        ClearGControl();
        EnabledGControl();
        $("#btnEdit").addClass("display_none");
        $("#btnSave").removeClass("display_none");
        $("#btnBack").removeClass("display_none");
        $("#btnAdd").addClass("display_none");
        IsNew = true;

    }

    function btnAdd2_onclick() {
        if (!ValidationAdd()) {
            return;
        }
        ClearAVatControl();
        EnabledAVatControl();
        $("#btnEdit2").addClass("display_none");
        $("#btnSave2").removeClass("display_none");
        $("#btnBack2").removeClass("display_none");
        $("#btnAdd2").addClass("display_none");
        IsNew = true;

    }

    function btnEdit_onclick() {
        $("#btnEdit").addClass("display_none");
        $("#btnAdd").addClass("display_none");
        $("#btnSave").removeClass("display_none");
        $("#btnBack").removeClass("display_none");
        IsNew = false;
        EnabledGControl();
    }
    function btnEdit2_onclick() {
        $("#btnEdit2").addClass("display_none");
        $("#btnAdd2").addClass("display_none");
        $("#btnSave2").removeClass("display_none");
        $("#btnBack2").removeClass("display_none");
        IsNew = false;
        EnabledAVatControl();
    }

    function btnBack_onclick() {
        $("#btnSave").addClass("display_none");
        $("#btnBack").addClass("display_none");
        DisAbledGControl();
        if (IsNew == true) {
            ClearGControl();
            $("#btnEdit").addClass("display_none");
            $("#btnAdd").removeClass("display_none");
        } else {
            $("#btnEdit").removeClass("display_none");
            $("#btnAdd").addClass("display_none");
        }
    }
    function btnBack2_onclick() {
        $("#btnSave2").addClass("display_none");
        $("#btnBack2").addClass("display_none");
        DisAbledAVatControl();
        if (IsNew == true) {
            ClearAVatControl();
            $("#btnEdit2").addClass("display_none");
            $("#btnAdd2").removeClass("display_none");
        } else {
            $("#btnEdit2").removeClass("display_none");
            $("#btnAdd2").addClass("display_none");
        }
    }

    function btnSave_onclick() {

        if (!ValidationControl()) {
            return;
        }
        if (IsNew == true) {
            InsertGControl();
        } else {
            UpdateGControl();
        }
        DisAbledGControl();
        $("#btnSave").addClass("display_none");
        $("#btnBack").addClass("display_none");
        $("#btnEdit").removeClass("display_none");
    }
    function btnSave2_onclick() {
        if (!ValidationAVControl()) {
            return;
        }
        if (IsNew == true) {
            InsertAVatControl();
        } else {
            UpdateAVatControl();
        }
        $("#btnSave2").addClass("display_none");
        $("#btnBack2").addClass("display_none");
        $("#btnEdit2").removeClass("display_none");
        DisAbledAVatControl();
    }

    function ddlCompInforFilter_onchange() {

        FillBraInforFilter();

        // Fillddl_OpenAccVoucheNo();

    }

    function AssignGControl() {
        Model = new G_CONTROL();
        Model.COMP_CODE = Number(ddlCompFilter.value);
        Model.FIN_YEAR = Number(txt_FIN_YEAR.value);
        Model.ACC_STATUS = 0;
        Model.INV_STATUS = 0;
        Model.ProfitAcc_Code = "";
        Model.FirstDate = txt_FirstDate.value;
        Model.LastDate = txt_LastDate.value;
        Model.UserCode = SysSession.CurrentEnvironment.UserCode;
        Model.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
        Model.OpenAccVoucheNo = Number(ddl_OpenAccVoucheNo.value);
        Model.OpenInvAdjNo = Number(ddl_OpenInvAdjNo.value);
    }
    function AssignAVatControl() {
        ModelAVatControl = new AVAT_CONTROL();
        ModelAVatControl.COMP_CODE = Number(ddlCompFilter.value);
        ModelAVatControl.VAT_YEAR = Number(txt_VAT_YEAR.value);
        ModelAVatControl.VAT_SETTING = true;
        ModelAVatControl.VAT_PERIOD = Number(ddl_VAT_PERIOD.value);
        ModelAVatControl.VAT_START_DATE = txt_VAT_START_DATE.value;
        ModelAVatControl.VAT_END_DATE = txt_VAT_END_DATE.value;
        ModelAVatControl.VAT_CR_ACC = "";
        ModelAVatControl.VAT_DB_ACC = "";
        ModelAVatControl.VAT_ACCURUAL_ACC = "";
        ModelAVatControl.VAT_WARNING_DAYS = 0;
        ModelAVatControl.VAT_PREVBAL = 0;
        ModelAVatControl.UserCode = SysSession.CurrentEnvironment.UserCode;
        ModelAVatControl.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;


    }




    function InsertGControl() {
        AssignGControl();
        Ajax.Callsync({
            type: "Post",
            url: sys.apiUrl("GCONTROL", "Insert"),
            data: JSON.stringify(Model),
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    DisplayMassage("تم الحفظ بنجاح", "Saved successfully", MessageType.Succeed);
                    Model = result.Response as G_CONTROL;
                    txt_FIN_YEAR.value = Model.FIN_YEAR.toString();
                    txt_FirstDate.value = DateFormat(Model.FirstDate);
                    txt_LastDate.value = DateFormat(Model.LastDate);
                    if (ModelAVatControl.VAT_PERIOD != null) {
                        ddl_OpenAccVoucheNo.value = Model.OpenAccVoucheNo.toString();
                    }
                    if (ModelAVatControl.VAT_PERIOD != null) {
                        ddl_OpenInvAdjNo.value = Model.OpenInvAdjNo.toString();
                    }


                }
                else {
                    DisplayMassage("خطأء", "Error", MessageType.Error);
                }
            }
        });
    }



    function InsertAVatControl() {
        AssignAVatControl();
        Ajax.Callsync({
            type: "Post",
            url: sys.apiUrl("AVATCONTROL", "Insert"),
            data: JSON.stringify(ModelAVatControl),
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    DisplayMassage("تم الحفظ بنجاح", "Saved successfully", MessageType.Succeed);
                    ModelAVatControl = result.Response as AVAT_CONTROL;
                    txt_VAT_YEAR.value = ModelAVatControl.VAT_YEAR.toString();
                    txt_VAT_START_DATE.value = DateFormat(ModelAVatControl.VAT_START_DATE);
                    txt_VAT_END_DATE.value = DateFormat(ModelAVatControl.VAT_END_DATE);
                    if (ModelAVatControl.VAT_PERIOD != null) {
                        ddl_VAT_PERIOD.value = ModelAVatControl.VAT_PERIOD.toString();
                    }



                }
                else {
                    DisplayMassage("خطأء", "Error", MessageType.Error);
                }
            }
        });
    }

    function UpdateGControl() {
        AssignGControl();

        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("GCONTROL", "Update"),
            data: JSON.stringify(Model),
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    DisplayMassage("تم الحفظ بنجاح", "Saved successfully", MessageType.Succeed);
                    var GCONTROL = result.Response as G_CONTROL;

                }
            }
        });
    }

    function UpdateAVatControl() {
        AssignAVatControl();

        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("AVATCONTROL", "Update"),
            data: JSON.stringify(ModelAVatControl),
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    DisplayMassage("تم الحفظ بنجاح", "Saved successfully", MessageType.Succeed);
                    var AVatControl = result.Response as AVAT_CONTROL;

                }
            }
        });
    }

    function Validation() {

        if (ddlCompFilter.value == "null" || ddlCompInforFilter.value == "null" || ddlBraInforFilter.value == "null" || ddlBraFilter.value == "null") {
            DisplayMassage("يجب ادخال اسم الشركه و الفرع المراد تهيئته وادخال اسم الشركة الجديدة و الفرع الجديد  ", "Please, Enter The Code!", MessageType.Worning);
            Errorinput(ddlCompFilter);
            Errorinput(ddlCompInforFilter);
            Errorinput(ddlBraInforFilter);
            Errorinput(ddlBraFilter);
            return false;
        }

        if (ddlCompFilter.value == ddlCompInforFilter.value) {
            DisplayMassage("يلزم تغيير اي من الشركتين حتي تتم التهيئه  ", "Please, !", MessageType.Worning);
            Errorinput(ddlCompFilter);
            Errorinput(ddlCompInforFilter);

            return false;

        }

        if (txt_FIN_YEAR.value.trim() == "" || txt_FIN_YEAR.value == "0") {
            DisplayMassage("يجب ادخال قيمة السنة المالية   ", "Please, Enter The Financial Year!", MessageType.Worning);
            Errorinput(txt_FIN_YEAR);
            return false;
        }

        if (txt_VAT_YEAR.value.trim() == "" || txt_VAT_YEAR.value == "0") {
            DisplayMassage("يجب ادخال قيمة السنة الضريبية   ", "Please, Enter The Vat Year!", MessageType.Worning);
            Errorinput(txt_VAT_YEAR);
            return false;
        }


        return true;
    }

    function ValidationControl() {
        if (txt_FIN_YEAR.value.trim() == "" || txt_FIN_YEAR.value == "0") {
            DisplayMassage("يجب ادخال قيمة السنة المالية   ", "Please, Enter The Financial Year!", MessageType.Worning);
            Errorinput(txt_FIN_YEAR);
            return false;
        }
        return true;
    }

    function ValidationAVControl() {
        if (txt_VAT_YEAR.value.trim() == "" || txt_VAT_YEAR.value == "0") {
            DisplayMassage("يجب ادخال قيمة السنة الضريبية   ", "Please, Enter The Vat Year!", MessageType.Worning);
            Errorinput(txt_VAT_YEAR);
            return false;
        }
        return true;
    }

    function ValidationAdd() {

        //if (ddlCompFilter.value == "null" || ddlBraFilter.value == "null") {
        //    DisplayMassage("يجب ادخال اسم الشركة الجديدة و الفرع الجديد  ", "Please, Enter The Code!", MessageType.Worning);
        //    Errorinput(ddlCompFilter);
        //    Errorinput(ddlBraFilter);
        //    return false;
        //}

        if ((ddlCompFilter.value == "null" && ddlCompInforFilter.value == "null") || (ddlCompFilter.value != "null" && ddlCompInforFilter.value == "null") || (ddlCompFilter.value == "null" && ddlCompInforFilter.value != "null")) {
            DisplayMassage("يجب ادخال اسم الشركة الجديدة و مصدر المعلومات   ", "Please, Enter The Code!", MessageType.Worning);
            Errorinput(ddlCompFilter);
            Errorinput(ddlCompInforFilter);
            return false;
        }
        return true
    }

    function ddlCompFilter_onchange() {
        Enabled();
        FillBraFilter();
        btnBack2_onclick();
        btnBack_onclick();
        Fillddl_OpenAccVoucheNo();

        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GCONTROL", "GetAll"),
            data: { UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {

                    SelectData = result.Response as Array<G_CONTROL>;
                    SelectData = SelectData.filter(x => x.COMP_CODE == Number(ddlCompFilter.value));
                    if (SelectData.length > 0) {

                        txt_FIN_YEAR.value = SelectData[0].FIN_YEAR.toString();
                        txt_FirstDate.value = DateFormat(SelectData[0].FirstDate);
                        txt_LastDate.value = DateFormat(SelectData[0].LastDate);
                        ddl_OpenAccVoucheNo.value = SelectData[0].OpenAccVoucheNo.toString();
                        ddl_OpenInvAdjNo.value = SelectData[0].OpenInvAdjNo.toString();

                        $("#btnEdit").removeClass("display_none");
                        $("#btnAdd").addClass("display_none");
                        $("#btnEdit2").removeClass("display_none");
                        $("#btnAdd2").addClass("display_none");
                    } else {
                        ClearGControl();
                        $("#btnEdit").addClass("display_none");
                        $("#btnAdd").removeClass("display_none");
                        //$("#btnEdit2").addClass("display_none");
                        //$("#btnAdd2").removeClass("display_none");

                    }

                }

            }
        });

        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AVATCONTROL", "GetAll"),
            data: { UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {

                    SelectDataAVat = result.Response as Array<AVAT_CONTROL>;
                    SelectDataAVat = SelectDataAVat.filter(x => x.COMP_CODE == Number(ddlCompFilter.value));
                    if (SelectDataAVat.length > 0) {

                        txt_VAT_YEAR.value = SelectDataAVat[0].VAT_YEAR.toString();
                        txt_VAT_START_DATE.value = DateFormat(SelectDataAVat[0].VAT_START_DATE);
                        txt_VAT_END_DATE.value = DateFormat(SelectDataAVat[0].VAT_END_DATE);
                        if (SelectDataAVat[0].VAT_PERIOD != null) {
                            ddl_VAT_PERIOD.value = SelectDataAVat[0].VAT_PERIOD.toString();
                        }


                        $("#btnEdit2").removeClass("display_none");
                        $("#btnAdd2").addClass("display_none");
                    } else {
                        ClearAVatControl();
                        $("#btnEdit2").addClass("display_none");
                        $("#btnAdd2").removeClass("display_none");

                    }

                }

            }
        });

    }

}

