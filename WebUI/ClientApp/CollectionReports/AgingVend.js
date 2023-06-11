$(document).ready(function () {
    AgingVend.InitalizeComponent();
});
var AgingVend;
(function (AgingVend) {
    var compcode;
    var AccountType = 2;
    var sys = new SystemTools();
    var SysSession = GetSystemSession(Modules.AgingVend);
    //------------------------------------------------------------
    var Details_Type_D_Category = new Array();
    var Details_CustomerGroup = new Array();
    var Details_Vendor = new Array();
    var Details_Vendornew = new Array();
    //------------------------------------------------------------
    var txt_ID_APP_Category;
    var txt_ID_APP_Group;
    var txtDateFrom;
    var threeyear;
    var btnReset;
    //-----checkbox
    //var chk_1: HTMLInputElement;
    //var chk_2: HTMLInputElement;
    //var chk_3: HTMLInputElement;
    //var chk_4: HTMLInputElement;
    //var chk_5: HTMLInputElement;
    //var chk_6: HTMLInputElement;
    ////////////////////////////////////Donia
    var AccountDetails = new Array();
    var btnVnd;
    var txt_VndCode;
    var txt_VndName;
    var CheckboxStatus;
    var VndIdfilter;
    ;
    var VendorId;
    //--- Print Buttons
    var btnPrint;
    var btnPrintTrview;
    var btnPrintTrPDF;
    var btnPrintTrEXEL;
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);
    var FinYear = (SysSession.CurrentEnvironment.CurrentYear);
    function InitalizeComponent() {
        $('#footer_1').html('');
        $('#dir_11').addClass('hidden_Control');
        $('#dir').addClass('hidden_Control');
        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = "اعمار مديونية الموردين";
        }
        else {
            document.getElementById('Screen_name').innerHTML = "Vendors Aging";
        }
        $("#iconMainPages").addClass("d-none");
        $("#iconReportPages").removeClass("d-none");
        $("#btnPrintTrview").addClass("print-report");
        $("#btnPrintTrview span").text("عرض تقرير");
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        InitalizeControls();
        InitalizeEvents();
        txtDateFrom.value = SysSession.CurrentEnvironment.StartDate;
        Display_SupplierCat();
        Display_SupplierGroup();
        discharge();
        // DisplayAccDefVendor();      
        $("#txtFromDate").val(GetDate());
    }
    AgingVend.InitalizeComponent = InitalizeComponent;
    function InitalizeControls() {
        txt_ID_APP_Category = document.getElementById("txt_ID_APP_Category");
        txt_ID_APP_Group = document.getElementById("txt_ID_APP_Group");
        txtDateFrom = document.getElementById("txtFromDate");
        threeyear = document.getElementById("threeyear");
        //chk_1 = document.getElementById("chk_1") as HTMLInputElement;
        //chk_2 = document.getElementById("chk_2") as HTMLInputElement;
        //chk_3 = document.getElementById("chk_3") as HTMLInputElement;
        //chk_4 = document.getElementById("chk_4") as HTMLInputElement;
        //chk_5 = document.getElementById("chk_5") as HTMLInputElement;
        //chk_6 = document.getElementById("chk_6") as HTMLInputElement;
        btnReset = document.getElementById("btnReset");
        //////////////////////////////////Donia
        btnVnd = document.getElementById("btnVnd");
        txt_VndCode = document.getElementById("txt_VndCode");
        txt_VndName = document.getElementById("txt_VndName");
        CheckboxStatus = document.getElementById("CheckboxStatus");
        //---------------------------------------------------------------------- Print Buttons
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
        btnReset.onclick = btnReset_onclick;
        //txt_ID_APP_Category.onchange = displayvendor;
        //txt_ID_APP_Group.onchange = displayvendor;
        ////////////////////////////////Donia
        btnVnd.onclick = btnVnd_OnClick;
        txt_VndCode.onchange = txt_VndCode_onchange;
    }
    //----------------------------------------------------( Get Vend_Cat )
    function Display_SupplierCat() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GenDefCategory", "GetAll"),
            data: { CompCode: compcode, AccountType: AccountType, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                //debugger;
                var result = d;
                if (result.IsSuccess) {
                    Details_Type_D_Category = result.Response;
                    for (var i = 0; i < Details_Type_D_Category.length; i++) {
                        $('#txt_ID_APP_Category').append('<option value="' + Details_Type_D_Category[i].CatID + '">' + (lang == "ar" ? Details_Type_D_Category[i].Cat_DescA : Details_Type_D_Category[i].Cat_DescE) + '</option>');
                    }
                }
            }
        });
    }
    //----------------------------------------------------( Get vend_Group )
    function Display_SupplierGroup() {
        //debugger
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GenDefGroup", "GetAll"),
            data: {
                CompCode: compcode, AccountType: AccountType, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                //debugger;
                var result = d;
                if (result.IsSuccess) {
                    Details_CustomerGroup = result.Response;
                    for (var i = 0; i < Details_CustomerGroup.length; i++) {
                        $('#txt_ID_APP_Group').append('<option value="' + Details_CustomerGroup[i].GroupID + '">' + (lang == "ar" ? Details_CustomerGroup[i].Group_DescA : Details_CustomerGroup[i].Group_DescE) + '</option>');
                        $('#txt_Grop').append('<option value="' + Details_CustomerGroup[i].GroupID + '">' + (lang == "ar" ? Details_CustomerGroup[i].Group_DescA : Details_CustomerGroup[i].Group_DescE) + '</option>');
                    }
                }
            }
        });
    }
    //----------------------------------------------------( Get Vendor)
    //----------------------------------------------------(Get Date )
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
    function btnReset_onclick() {
        txtDateFrom.value = DateStartMonth();
        //txtDateTo.value = ConvertToDateDash(GetDate()) <= ConvertToDateDash(SysSession.CurrentEnvironment.EndDate) ? GetDate() : SysSession.CurrentEnvironment.EndDate;
        discharge();
    }
    function discharge() {
        //chk_1.checked = false;
        //chk_2.checked = true;
        //chk_3.checked = false;
        //chk_4.checked = false;
        //chk_5.checked = false;
        //chk_6.checked = false;   
        $('#txt_ID_APP_Category option[value=Null]').prop('selected', 'selected').change();
        $('#txt_ID_APP_Group option[value=Null]').prop('selected', 'selected').change();
        //$('#txt_ID_Vendor option[value=Null]').prop('selected', 'selected').change();
        txt_VndCode.value = "";
        txt_VndName.value = "";
    }
    //----------------------------------------------------( Report )
    function PrintReport(OutType) {
        debugger;
        var rp = new ReportParameters();
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
        rp.RepType = OutType; //output report as View
        rp.FromDt = DateFormatRep(txtDateFrom.value);
        if ($("#txt_ID_APP_Category").val() == "Null") { //-------------جميع الفئات
            rp.CatId = -1;
        }
        else {
            rp.CatId = Number($("#txt_ID_APP_Category").val());
        }
        if ($("#txt_ID_APP_Group").val() == "Null") { //-------------جميع المجموعات
            rp.Groupid = -1;
        }
        else {
            rp.Groupid = Number($("#txt_ID_APP_Group").val());
        }
        if ($("#txt_VndCode").val() == "") { //-------------جميع العملاء 
            rp.CustomerID = -1;
        }
        else {
            rp.CustomerID = VendorId;
        }
        if ($("#txt_indebtedness").val() == 0) { //******الجميع 
            rp.BalType = 0;
        }
        if ($("#txt_indebtedness").val() == 1) { //******عليه مديونيه
            rp.BalType = 1;
        }
        if ($("#txt_indebtedness").val() == 2) { //******   ليه مديونيه
            rp.BalType = 2;
        }
        if ($("#txt_indebtedness").val() == 3) { //******صفري
            rp.BalType = 3;
        }
        if (CheckboxStatus.checked == true) {
            rp.Status = 3;
        }
        else {
            rp.Status = 1;
        }
        rp.Agtype = 1;
        rp.typedata = 2;
        Ajax.Callsync({
            url: Url.Action("IProc_Rpt_AccVendorAging", "GeneralReports"),
            data: rp,
            success: function (d) {
                var result = d.result;
                window.open(result, "_blank");
            }
        });
    }
    function btnVnd_OnClick() {
        var cond = "CompCode= " + compcode + "";
        if ($('#txt_ID_APP_Category').val() != "Null" && $('#txt_ID_APP_Group').val() == "Null") {
            cond = cond + " and CatID = " + Number(txt_ID_APP_Category.value) + "";
        }
        if ($('#txt_ID_APP_Category').val() == "Null" && $('#txt_ID_APP_Group').val() != "Null") {
            cond = cond + " and GroupId = " + Number($('#txt_ID_APP_Group').val()) + "";
        }
        if ($('#txt_ID_APP_Category').val() != "Null" && $('#txt_ID_APP_Group').val() != "Null") {
            cond = cond + " and CatID = " + Number(txt_ID_APP_Category.value) + " and GroupId =" + Number($('#txt_ID_APP_Group').val());
        }
        ///////////////////+ "and IsCreditVendor = 1" Was iN  Sys.FindKey
        sys.FindKey(Modules.AgingVend, "btnVndSearch", "" + cond + "", function () {
            var id = SearchGrid.SearchDataGrid.SelectedKey;
            VendorId = id;
            getAccountById(id, false);
        });
    }
    function getAccountById(custId, code) {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefVendor", "GetVendorByvndId_code"),
            data: { Compcode: compcode, FinYear: sys.SysSession.CurrentEnvironment.CurrentYear, code: code, VendorID: custId, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    AccountDetails = result.Response;
                    if (AccountDetails.length == 0) {
                        $('#txt_VndCode').val("");
                        $('#txt_VndName').val("");
                        Errorinput(txt_VndCode);
                        DisplayMassage("كود المورد غير صحيح", "Wrong vendor code", MessageType.Error);
                    }
                    else {
                        $('#txt_VndCode').val(AccountDetails[0].VendorCode);
                        $('#txt_VndName').val(AccountDetails[0].NAMEA);
                        VndIdfilter = custId;
                    }
                }
            }
        });
    }
    function txt_VndCode_onchange() {
        txt_VndName.value = "";
        getAccountById(txt_VndCode.value, true);
    }
})(AgingVend || (AgingVend = {}));
//# sourceMappingURL=AgingVend.js.map