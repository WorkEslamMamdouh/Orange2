$(document).ready(function () {
    Incomeoperations.InitalizeComponent();
});
var Incomeoperations;
(function (Incomeoperations) {
    var compcode;
    var BranchCode;
    var sys = new SystemTools();
    var SysSession = GetSystemSession(Modules.Incomeoperations);
    //------------------------------------------------------------
    var SalesmanDetails = new Array();
    var Details = new Array();
    var Display_ItemFamily = new Array();
    var Display_ItemFamily = new Array();
    var Display_ItemFamilyFill = new Array();
    //---------------------------------------------------------------------------------
    var txtFromDate;
    var txtToDate;
    var indebtedness;
    var reptp1;
    var Details_reptpEnable;
    //--- Print Buttons
    var btnPrint;
    var btnPrintTrview;
    var btnPrintTrPDF;
    var btnPrintTrEXEL;
    var btnReset;
    var drpitem_family;
    var txt_ID_APP_Type;
    var drpPaymentType;
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);
    function InitalizeComponent() {
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        BranchCode = Number(sys.SysSession.CurrentEnvironment.BranchCode);
        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = "ايراد المبيعات";
        }
        else {
            document.getElementById('Screen_name').innerHTML = "Income Operation";
        }
        $("#btnAdd").addClass("display_none");
        $("#btnShow").addClass("display_none");
        $("#btnPrintTrview").addClass("print-report");
        $("#btnPrintTrview span").text("عرض تقرير");
        InitalizeControls();
        InitalizeEvents();
        //Display_Salesman()
        Display_DrpPaymentType();
        Display_I_ItemFamily();
        reptp1.checked = true;
        txtFromDate.value = DateFormat(SysSession.CurrentEnvironment.StartDate);
        txtToDate.value = ConvertToDateDash(GetDate()) <= ConvertToDateDash(SysSession.CurrentEnvironment.EndDate) ? GetDate() : SysSession.CurrentEnvironment.EndDate;
        $('#txt_ID_APP_Type').append('<option value="' + 0 + '">' + (lang == "ar" ? "اختر الصنف" : "Choose item") + '</option>');
        $('#btnPrint').addClass('display_none');
    }
    Incomeoperations.InitalizeComponent = InitalizeComponent;
    function InitalizeControls() {
        reptp1 = document.getElementById("reptp1");
        txtFromDate = document.getElementById("txtFromDate");
        txtToDate = document.getElementById("txtToDate");
        drpitem_family = document.getElementById("drpitem_family");
        btnReset = document.getElementById("btnReset");
        txt_ID_APP_Type = document.getElementById("txt_ID_APP_Type");
        drpPaymentType = document.getElementById("drpPaymentType");
        btnPrint = document.getElementById("btnPrint");
        btnPrintTrview = document.getElementById("btnPrintTrview");
        btnPrintTrPDF = document.getElementById("btnPrintTrPDF");
        btnPrintTrEXEL = document.getElementById("btnPrintTrEXEL");
    }
    function InitalizeEvents() {
        // Print Buttons
        btnPrintTrview.onclick = function () { PrintReport(1); };
        btnPrintTrPDF.onclick = function () { PrintReport(2); };
        btnPrintTrEXEL.onclick = function () { PrintReport(3); };
        btnPrint.onclick = function () { PrintReport(4); };
        drpPaymentType.onchange = drpPaymentType_onchange;
        drpitem_family.onchange = itemDisplay;
        btnReset.onclick = btnReset_onclick;
    }
    //----------------------------------------------------( Get Item_Cat )
    function Display_DrpPaymentType() {
        var Display_Type = new Array();
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("StkDefCategory", "GetAll"),
            data: {
                CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    Display_Type = result.Response;
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
                        DocumentActions.FillCombowithdefult(Display_Type, drpPaymentType, "CatID", "DescA", "اختر الفئة");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(Display_Type, drpPaymentType, "CatID", "DescL", "Select Category");
                    }
                }
            }
        });
    }
    //----------------------------------------------------( Get item_familly )
    function Display_I_ItemFamily() {
        Display_ItemFamily = new Array();
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("StkDefItemType", "GetAll"),
            data: {
                CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    Display_ItemFamily = result.Response;
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
                        DocumentActions.FillCombowithdefult(Display_ItemFamily, drpitem_family, "ItemFamilyID", "DescA", "اختر النوع");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(Display_ItemFamily, drpitem_family, "ItemFamilyID", "DescL", "Select Type");
                    }
                    if (drpitem_family.value != 'null') {
                        $('#txt_ID_APP_Type').html('');
                        $('#txt_ID_APP_Type').removeAttr("disabled");
                    }
                    else {
                        $('#txt_ID_APP_Type').html('');
                        $('#txt_ID_APP_Type').attr("disabled");
                    }
                }
            }
        });
    }
    function drpPaymentType_onchange() {
        if (drpPaymentType.value != 'null') {
            Display_ItemFamilyFill = Display_ItemFamily.filter(function (x) { return x.CatID == Number(drpPaymentType.value); });
            if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
                DocumentActions.FillCombowithdefult(Display_ItemFamilyFill, drpitem_family, "ItemFamilyID", "DescA", "اختر النوع");
            }
            else {
                DocumentActions.FillCombowithdefult(Display_ItemFamilyFill, drpitem_family, "ItemFamilyID", "DescL", "Select Type");
            }
        }
        else {
            if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
                DocumentActions.FillCombowithdefult(Display_ItemFamily, drpitem_family, "ItemFamilyID", "DescA", "اختر النوع");
            }
            else {
                DocumentActions.FillCombowithdefult(Display_ItemFamily, drpitem_family, "ItemFamilyID", "DescL", "Select Type");
            }
        }
    }
    //----------------------------------------------------( Get Item_Desc )
    function itemDisplay() {
        if (drpitem_family.value != 'null') {
            Details = new Array();
            var ItemFamilyID = Number($("#drpitem_family").val());
            var finyear = sys.SysSession.CurrentEnvironment.CurrentYear;
            Ajax.Callsync({
                type: "Get",
                url: sys.apiUrl("StkDefItemType", "GetI_ItemByFamilyIdOrdered"),
                data: {
                    CompCode: compcode, FinYear: finyear, familyid: ItemFamilyID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
                },
                success: function (d) {
                    var result = d;
                    if (result.IsSuccess) {
                        Details = result.Response;
                        $('#txt_ID_APP_Type').html('');
                        $('#txt_ID_APP_Type').removeAttr("disabled");
                        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
                            DocumentActions.FillCombowithdefult(Details, txt_ID_APP_Type, "ItemID", "DescA", "اختر الصنف");
                        }
                        if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                            DocumentActions.FillCombowithdefult(Details, txt_ID_APP_Type, "ItemID", "DescL", "Select Item");
                        }
                    }
                }
            });
        }
        else {
            $('#txt_ID_APP_Type').attr("disabled", "disabled");
            DocumentActions.FillCombowithdefult(Details, txt_ID_APP_Type, "ItemID", "Itm_DescA", "اختر الصنف");
        }
    }
    function GetDate() {
        var today = new Date();
        var dd = today.getDate().toString();
        var ReturnedDate;
        var mm = (today.getMonth() + 1).toString();
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
    //----------------------------------------------------( Get sales_man )
    function Display_Salesman() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefSalesMen", "GetAllSalesPeople"),
            data: {
                CompCode: compcode, IsSalesEnable: true, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    SalesmanDetails = result.Response;
                    SalesmanDetails = SalesmanDetails.filter(function (s) { return s.Isactive == true; });
                    DisplaySalesman();
                }
            }
        });
    }
    function DisplaySalesman() {
        for (var i = 0; i < SalesmanDetails.length; i++) {
            $('#ddlSalesman').append('<option value="' + SalesmanDetails[i].SalesmanId + '">' + (lang == "ar" ? SalesmanDetails[i].NameA : SalesmanDetails[i].NameE) + '</option>');
        }
    }
    function btnReset_onclick() {
        txtFromDate.value = DateFormat(SysSession.CurrentEnvironment.StartDate);
        txtToDate.value = ConvertToDateDash(GetDate()) <= ConvertToDateDash(SysSession.CurrentEnvironment.EndDate) ? GetDate() : SysSession.CurrentEnvironment.EndDate;
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        discharge();
    }
    function discharge() {
        $('#drpPaymentType option[value=Null]').prop('selected', 'selected').change();
        $('#drpitem_family option[value=0]').prop('selected', 'selected').change();
        $('#txt_ID_status option[value=1]').prop('selected', 'selected').change();
        $('#txt_ID_APP_Type').html('');
        $('#txt_ID_APP_Type').append('<option value="' + 0 + '"> ' + (lang == "ar" ? "اختر الصنف" : "choose item") + '</option>');
        $('#txt_ID_APP_Type').attr("disabled", "disabled");
    }
    //----------------------------------------------------( Report )
    function PrintReport(OutType) {
        Details_reptpEnable = document.querySelector("input[name=reptp]:checked");
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
        if ($("#drpPaymentType").val() == "null") { //-------------جميع الفئات
            rp.CatId = -1;
        }
        else {
            rp.CatId = Number($("#drpPaymentType").val());
        }
        if ($("#drpitem_family").val() == "null") { //-------------جميع الانواع
            rp.ItemFamId = -1;
            rp.ItemID = -1;
        }
        else {
            rp.ItemFamId = Number($("#drpitem_family").val());
            if ($("#txt_ID_APP_Type").val() == "null") { //-------------جميع الاصناف
                rp.ItemID = -1;
            }
            else {
                rp.ItemID = Number($("#txt_ID_APP_Type").val());
            }
        }
        rp.Status = Number($("#txt_status").val());
        var check = Number(Details_reptpEnable.value);
        if (check == 1) {
            rp.check = 3;
        }
        else if (check == 2) {
            rp.check = 2;
        }
        else {
            rp.check = 1;
        }
        Ajax.Callsync({
            url: Url.Action("IProc_Rpt_ItemStockIncome", "GeneralReports"),
            data: rp,
            success: function (d) {
                var result = d.result;
                window.open(result, "_blank");
            }
        });
    }
})(Incomeoperations || (Incomeoperations = {}));
//# sourceMappingURL=Incomeoperations.js.map