$(document).ready(() => {

    ItemPeriodSummary.InitalizeComponent();
})

namespace ItemPeriodSummary {

    var compcode: number;
    var BranchCode: number;
    var sys: SystemTools = new SystemTools();
    var SysSession: SystemSession = GetSystemSession(Modules.ItemPeriodSummary);
    var Display_ItemFamily: Array<I_ItemFamily> = new Array<I_ItemFamily>();
    var Display_ItemFamilyFill: Array<I_ItemFamily> = new Array<I_ItemFamily>();
    var Details: Array<I_Item> = new Array<I_Item>();
    var Display_STORE: Array<G_STORE> = new Array<G_STORE>();
    var Display_Branch: Array<G_BRANCH> = new Array<G_BRANCH>();
    var ItemTypeDet: Array<I_G_ItemType> = new Array<I_G_ItemType>();
    var Display_Period: Array<I_Period> = new Array<I_Period>();
    //------------------------------------------------------------
    var catId;
    var FinYear = SysSession.CurrentEnvironment.CurrentYear;
    //var txtDateFrom: HTMLInputElement;
    //var txtDateTo: HTMLInputElement;
    var reptp1: HTMLInputElement;
    var reptp2: HTMLInputElement;
    var BalTp0: HTMLInputElement;
    var BalTp1: HTMLInputElement;
    var BalTp2: HTMLInputElement;
    var BalTp3: HTMLInputElement;
    var btnReset;
    // var reptype2: HTMLInputElement;
    //--- Print Buttons
    var btnPrint: HTMLButtonElement;
    var btnPrintTrview: HTMLButtonElement;
    var btnPrintTrPDF: HTMLButtonElement;
    var btnPrintTrEXEL: HTMLButtonElement;
    var drpitem_family: HTMLSelectElement;
    var txt_ID_APP_Type: HTMLSelectElement;
    var ddl_Cat: HTMLSelectElement;
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);

    export function InitalizeComponent() {
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        BranchCode = Number(sys.SysSession.CurrentEnvironment.BranchCode);
        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = "ملخص الفترات";

        } else {
            document.getElementById('Screen_name').innerHTML = "Item Period Summary";

        }
        $("#iconMainPages").addClass("d-none");
        $("#iconReportPages").removeClass("d-none");
        $("#btnPrintTrview").addClass("print-report");
        $("#btnPrintTrview span").text("عرض تقرير");
        InitalizeControls();
        InitalizeEvents();
        reptp1.checked = true;
        BalTp0.checked = true;
        // reptype2.checked = true;

        //txtDateFrom.value = DateFormat(SysSession.CurrentEnvironment.StartDate);
        //txtDateTo.value = ConvertToDateDash(GetDate()) <= ConvertToDateDash(SysSession.CurrentEnvironment.EndDate) ? GetDate() : SysSession.CurrentEnvironment.EndDate;

        Display_ddl_Cat();
        Display_I_ItemFamily();

        $('#txt_ID_APP_Type').append('<option value="' + 0 + '"> ' + (lang == "ar" ? "اختر الصنف " : "choose item") + '</option>');
        $('#btnPrint').addClass('display_none');
        Display_G_store();
        Display_GBranch();
        GetItemType();
        Display_I_Period();
    }

    function InitalizeControls() {


        btnPrint = document.getElementById("btnPrint") as HTMLButtonElement;
        btnPrintTrview = document.getElementById("btnPrintTrview") as HTMLButtonElement;
        btnPrintTrPDF = document.getElementById("btnPrintTrPDF") as HTMLButtonElement;
        btnPrintTrEXEL = document.getElementById("btnPrintTrEXEL") as HTMLButtonElement;
        //txtDateFrom = document.getElementById("txtFromDate") as HTMLInputElement;
        //txtDateTo = document.getElementById("txtToDate") as HTMLInputElement;
        drpitem_family = document.getElementById("drpitem_family") as HTMLSelectElement;
        txt_ID_APP_Type = document.getElementById("txt_ID_APP_Type") as HTMLSelectElement;
        ddl_Cat = document.getElementById("ddl_Cat") as HTMLSelectElement;
        reptp1 = document.getElementById("reptp1") as HTMLInputElement;
        reptp2 = document.getElementById("reptp2") as HTMLInputElement;
        BalTp0 = document.getElementById("BalTp0") as HTMLInputElement;
        BalTp1 = document.getElementById("BalTp1") as HTMLInputElement;
        BalTp2 = document.getElementById("BalTp2") as HTMLInputElement;
        BalTp3 = document.getElementById("BalTp3") as HTMLInputElement;
        //reptype2 = document.getElementById("reptype2") as HTMLInputElement;
        btnReset = document.getElementById("btnReset") as HTMLButtonElement;

    }


    function InitalizeEvents() {
        // Print Buttons
        btnPrintTrview.onclick = () => { PrintReport(1); }
        btnPrintTrPDF.onclick = () => { PrintReport(2); }
        btnPrintTrEXEL.onclick = () => { PrintReport(3); }
        btnPrint.onclick = () => { PrintReport(4); }
        ddl_Cat.onchange = ddl_Cat_onchange;
        btnReset.onclick = btnReset_onclick;
        drpitem_family.onchange = itemDisplay;
    }

    //----------------------------------------------------( Get Item_Cat )
    function Display_ddl_Cat() {

        var Display_Type: Array<I_D_Category> = new Array<I_D_Category>();

        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("StkDefCategory", "GetAll"),
            data: {
                CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    Display_Type = result.Response as Array<I_D_Category>;
                    $('#ddl_Cat').append('<option value="null">' + (lang == "ar" ? "اختر الفئة" : "Select Category") + '</option>');
                    for (var i = 0; i < Display_Type.length; i++) {
                        $('#ddl_Cat').append('<option value="' + Display_Type[i].CatID + '">' + (lang == "ar" ? Display_Type[i].DescA : Display_Type[i].DescL) + '</option>');
                    }
                    //if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
                    //    DocumentActions.FillCombowithdefult(Display_Type, ddl_Cat, "CatID", "DescA", "اختر الفئة");
                    //}
                    //else {
                    //    DocumentActions.FillCombowithdefult(Display_Type, ddl_Cat, "CatID", "DescL", "Select Category");
                    //}



                }
            }
        });
    }

    //----------------------------------------------------( Get item familly )
    function Display_I_ItemFamily() {

        Display_ItemFamily = new Array<I_ItemFamily>();

        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("StkDefItemType", "GetAll"),
            data: {
                CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {

                    Display_ItemFamily = result.Response as Array<I_ItemFamily>;
                    //$('#txt_ID_APP_Type').append('<option value="null">' + (lang == "ar" ? "اختر النوع" : "Select Type") + '</option>');
                    //for (var i = 0; i < Display_ItemFamily.length; i++) {
                    //    $('#txt_ID_APP_Type').append('<option value="' + Display_ItemFamily[i].ItemFamilyID + '">' + (lang == "ar" ? Display_ItemFamily[i].DescA : Display_ItemFamily[i].DescL) + '</option>');
                    //}

                    if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
                        DocumentActions.FillCombowithdefult(Display_ItemFamily, drpitem_family, "ItemFamilyID", "DescA", "اختر النوع");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(Display_ItemFamily, drpitem_family, "ItemFamilyID", "DescL", "Select Type");
                    }

                    if (drpitem_family.value != 'null') {
                        $('#txt_ID_APP_Type').html('');
                        $('#txt_ID_APP_Type').removeAttr("disabled")
                    } else {
                        $('#txt_ID_APP_Type').html('');
                        $('#txt_ID_APP_Type').attr("disabled")
                    }

                }
            }
        });
    }
    function ddl_Cat_onchange() {
        if (ddl_Cat.value != 'null') {
            Display_ItemFamilyFill = Display_ItemFamily.filter(x => x.CatID == Number(ddl_Cat.value))
            if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
                DocumentActions.FillCombowithdefult(Display_ItemFamilyFill, drpitem_family, "ItemFamilyID", "DescA", "اختر النوع");
            }
            else {
                DocumentActions.FillCombowithdefult(Display_ItemFamilyFill, drpitem_family, "ItemFamilyID", "DescL", "Select Type");
            }
        } else {
            if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
                DocumentActions.FillCombowithdefult(Display_ItemFamily, drpitem_family, "ItemFamilyID", "DescA", "اختر النوع");
            }
            else {
                DocumentActions.FillCombowithdefult(Display_ItemFamily, drpitem_family, "ItemFamilyID", "DescL", "Select Type");
            }
        }

    }

    //----------------------------------------------------( Item Desc )
    function itemDisplay() {

        if (drpitem_family.value != 'null') {
            Details = new Array<I_Item>();


            var ItemFamilyID = Number($("#drpitem_family").val());
            var finyear = sys.SysSession.CurrentEnvironment.CurrentYear;
            Ajax.Callsync({
                type: "Get",
                url: sys.apiUrl("StkDefItemType", "GetI_ItemByFamilyIdOrdered"),
                data: {
                    CompCode: compcode, FinYear: finyear, familyid: ItemFamilyID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
                },
                success: (d) => {

                    let result = d as BaseResponse;
                    if (result.IsSuccess) {

                        Details = result.Response as Array<I_Item>;


                        $('#txt_ID_APP_Type').html('');
                        $('#txt_ID_APP_Type').removeAttr("disabled")
                        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
                            DocumentActions.FillCombowithdefult(Details, txt_ID_APP_Type, "ItemID", "DescA", "اختر الصنف");
                        }
                        if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                            DocumentActions.FillCombowithdefult(Details, txt_ID_APP_Type, "ItemID", "DescL", "Select Item");
                        }

                    }
                }
            });
        } else {
            $('#txt_ID_APP_Type').attr("disabled", "disabled");
            DocumentActions.FillCombowithdefult(Details, txt_ID_APP_Type, "ItemID", "Itm_DescA", "اختر الصنف");
        }


    }

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

    function btnReset_onclick() {

        //txtDateFrom.value = DateFormat(SysSession.CurrentEnvironment.StartDate);
        //txtDateTo.value = ConvertToDateDash(GetDate()) <= ConvertToDateDash(SysSession.CurrentEnvironment.EndDate) ? GetDate() : SysSession.CurrentEnvironment.EndDate;

        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        discharge();
        reptp1.checked = true;
        BalTp0.checked = true;

        $('#ddl_Store').val('null');
        $('#ddl_Branch').val('null');
        $('#ddl_FromPer').val('null');
        $('#ddl_ToPer').val('null');
        $('#ddl_Cat').val('null');
        $('#ddl_Item_Type').val('null');

    }

    function discharge() {
        $('#ddl_Cat option[value=Null]').prop('selected', 'selected').change();
        $('#txt_indebtedness option[value=All]').prop('selected', 'selected').change();
        $('#drpitem_family option[value=0]').prop('selected', 'selected').change();
        $('#txt_ID_status option[value=1]').prop('selected', 'selected').change();
        $('#txt_ID_APP_Type').html('');
        $('#txt_ID_APP_Type').append('<option value="' + 0 + '">' + (lang == "ar" ? " اختر الصنف" : "choose item") + '  </option>');
        $('#txt_ID_APP_Type').attr("disabled", "disabled");
    


    }

    function Display_G_store() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("StkDefStore", "GetAll"),
            data: {
                CompCode: compcode, BranchCode: BranchCode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    Display_STORE = result.Response as Array<G_STORE>;
                    $('#ddl_Store').append('<option value="null">' + (lang == "ar" ? "اختر المستودع" : "Choose Store") + '</option>');
                    for (var i = 0; i < Display_STORE.length; i++) {
                        $('#ddl_Store').append('<option value="' + Display_STORE[i].StoreId + '">' + (lang == "ar" ? Display_STORE[i].DescA : Display_STORE[i].DescL) + '</option>');
                    }
                }
            }
        });
    }

    function Display_GBranch() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GBranch", "GetAll"),
            data: {
                CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    Display_Branch = result.Response as Array<G_BRANCH>;
                    $('#ddl_Branch').append('<option value="null">' + (lang == "ar" ? "اختر الفرع" : "Choose Branch") + '</option>');
                    for (var i = 0; i < Display_Branch.length; i++) {
                        $('#ddl_Branch').append('<option value="' + Display_Branch[i].BRA_CODE + '">' + (lang == "ar" ? Display_Branch[i].BRA_DESC : Display_Branch[i].BRA_DESCE) + '</option>');
                    }
                }
            }
        });
    }
    
    function Display_I_Period() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("I_Period", "GetAll"),
            data: {
                CompCode: compcode, FinYear: FinYear, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    Display_Period = result.Response as Array<I_Period>;
                    //$('#ddl_FromPer').append('<option value="null">' + (lang == "ar" ? "من" : "F") + '</option>');
                    //$('#ddl_ToPer').append('<option value="null">' + (lang == "ar" ? "الي" : "To") + '</option>');
                    for (var i = 0; i < Display_Period.length; i++) {
                        $('#ddl_FromPer').append('<option value="' + Display_Period[i].PERIOD_CODE + '">' + Display_Period[i].PERIOD_CODE + '</option>');
                        $('#ddl_ToPer').append('<option value="' + Display_Period[i].PERIOD_CODE + '">' + Display_Period[i].PERIOD_CODE + '</option>');
                    }
                }
            }
        });
    }
       
    function GetItemType() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("StkDefCategory", "GetItemType"),
            data: {
                CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    ItemTypeDet = result.Response as Array<I_G_ItemType>;
                    $('#ddl_Item_Type').append('<option value="null">' + (lang == "ar" ? "اختر النوع" : "Choose Type") + '</option>');
                    for (var i = 0; i < ItemTypeDet.length; i++) {
                        $('#ddl_Item_Type').append('<option value="' + ItemTypeDet[i].ItemTypeID + '">' + (lang == "ar" ? ItemTypeDet[i].DescA : ItemTypeDet[i].DescL) + '</option>');
                    }
                }
            }
        });
    }

    //----------------------------------------------------( Report )
    function PrintReport(OutType: number) {
        debugger
        let rp: ReportParameters = new ReportParameters();

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
        rp.RepType = OutType;//output report as View
        if ($("#ddl_Branch").val() == "null") {//-------------جميع الفروع
            rp.braCode = -1;
        } else {
            rp.braCode = Number($("#ddl_Branch").val());
        }

        if ($("#ddl_Store").val() == "null") {//-------------جميع المستودعات
            rp.storeID = -1;
        } else {
            rp.storeID = Number($("#ddl_Store").val());
        }

        if ($("#ddl_Item_Type").val() == "null") {
            rp.ItemTypeID = -1
        } else {
            rp.ItemTypeID = $("#ddl_Item_Type").val();
        }
        if ($("#ddl_Cat").val() == "null") {//-------------جميع الفئات
            rp.CatId = -1;
        } else {
            rp.CatId = Number($("#ddl_Cat").val());
        }
        if ($("#drpitem_family").val() == "null") {//-------------جميع الانواع
            rp.ItemFamId = -1;
            rp.ItemID = -1;
        } else {
            rp.ItemFamId = Number($("#drpitem_family").val());

            if ($("#txt_ID_APP_Type").val() == "null") {//-------------جميع الاصناف
                rp.ItemID = -1;
            }

            else { rp.ItemID = Number($("#txt_ID_APP_Type").val()); }
        }
        if (reptp1.checked == true) { rp.check = 3; }
        else if (reptp2.checked == true) { rp.check = 2; }
        else { rp.check = 1; }

        if (BalTp0.checked == true) { rp.BalType = 0; }
        else if (BalTp1.checked == true) { rp.BalType = 1; }
        else if (BalTp2.checked == true) { rp.BalType = 2; }
        else { rp.BalType = 3; }

        rp.FinYear = Number(SysSession.CurrentEnvironment.CurrentYear);

        if ($("#ddl_FromPer").val() == "null") {//-------------From Period
            rp.FromPrd = -1;
        } else {
            rp.FromPrd = Number($("#ddl_FromPer").val());
        }

        if ($("#ddl_ToPer").val() == "null") {//-------------to period
            rp.ToPrd = -1;
        } else {
            rp.ToPrd = Number($("#ddl_ToPer").val());
        }
        //rp.FromPrd = DateFormatRep(txtDateFrom.value);
        //rp.ToPrd = DateFormatRep(txtDateTo.value);
        //rp.Status = $("#txt_ID_status").val();


        Ajax.Callsync({
            url: Url.Action("IProc_Rpt_ItemPeriodSummary", "GeneralReports"),
            data: rp,
            success: (d) => {

                let result = d.result as string;
                

                window.open(result, "_blank");
            }
        })

    }
}