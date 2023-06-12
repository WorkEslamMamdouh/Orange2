$(document).ready(function () {
    AgingCust.InitalizeComponent();
});
var AgingCust;
(function (AgingCust) {
    var compcode;
    var BranchCode;
    var AccountType = 1;
    var sys = new SystemTools();
    var SysSession = GetSystemSession(Modules.AgingCust);
    //------------------------------------------------------------
    var Details_Type_D_Category = new Array();
    var Details_CustomerGroup = new Array();
    var Details_Vendor = new Array();
    var Details_Vendornew = new Array();
    //------------------------------------------------------------
    var txt_ID_APP_Category;
    var txt_ID_APP_Group;
    var txtDateFrom;
    var btnReset;
    ///////////////////////////////////////donia
    var AccountDetails = new Array();
    var btnCust;
    var txt_CustCode;
    var txt_CustName;
    var CheckboxStatus;
    var GLOBALopenbalance;
    var custIdfilter;
    ;
    var customerId;
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
            document.getElementById('Screen_name').innerHTML = "إعمار مديونية العملاء";
        }
        else {
            document.getElementById('Screen_name').innerHTML = "Customers Aging";
        }
        $("#iconMainPages").addClass("d-none");
        $("#iconReportPages").removeClass("d-none");
        $("#btnPrintTrview").addClass("print-report");
        $("#btnPrintTrview span").text("عرض تقرير");
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);
        InitalizeControls();
        InitalizeEvents();
        txtDateFrom.value = SysSession.CurrentEnvironment.StartDate;
        Display_SupplierCat();
        Display_SupplierGroup();
        discharge();
        // DisplayAccDefVendor();
        $("#txtFromDate").val(GetDate());
    }
    AgingCust.InitalizeComponent = InitalizeComponent;
    function InitalizeControls() {
        txt_ID_APP_Category = document.getElementById("txt_ID_APP_Category");
        txt_ID_APP_Group = document.getElementById("txt_ID_APP_Group");
        txtDateFrom = document.getElementById("txtFromDate");
        btnReset = document.getElementById("btnReset");
        btnCust = document.getElementById("btnCust");
        txt_CustCode = document.getElementById("txt_CustCode");
        txt_CustName = document.getElementById("txt_CustName");
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
        btnCust.onclick = btnCust_OnClick;
        txt_CustCode.onchange = txt_CustCode_onchange;
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
        discharge();
    }
    function discharge() {
        $('#txt_ID_APP_Category option[value=Null]').prop('selected', 'selected').change();
        $('#txt_ID_APP_Group option[value=Null]').prop('selected', 'selected').change();
        txt_CustCode.value = "";
        txt_CustName.value = "";
    }
    //----------------------------------------------------( Report )
    function PrintReport(OutType) {
        var rp = new ReportParameters();
        debugger;
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
        //////////////////////////Donia
        if ($("#txt_CustCode").val() == "") { //-------------جميع العملاء 
            rp.CustomerID = -1;
        }
        else {
            rp.CustomerID = customerId;
        }
        if (CheckboxStatus.checked == true) {
            rp.Status = 3;
        }
        else {
            rp.Status = 1;
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
        rp.Agtype = 1;
        rp.typedata = 1;
        Ajax.Callsync({
            url: Url.Action("IProc_Rpt_AccCustomerAging", "GeneralReports"),
            data: rp,
            success: function (d) {
                var result = d.result;
                window.open(result, "_blank");
            }
        });
    }
    function btnCust_OnClick() {
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
        sys.FindKey(Modules.AgingCust, "btncustSearch", "" + cond + "", function () {
            var id = SearchGrid.SearchDataGrid.SelectedKey;
            customerId = id;
            getAccountById(id, false);
        });
    }
    function getAccountById(custId, code) {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefCustomer", "GetCustomerByCustomerId_code"),
            data: { Compcode: compcode, BranchCode: BranchCode, code: code, CustomerId: custId, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    AccountDetails = result.Response;
                    if (AccountDetails.length == 0) {
                        $('#txt_CustCode').val("");
                        $('#txt_CustName').val("");
                        Errorinput(txt_CustCode);
                        DisplayMassage("كود العميل غير صحيح", "Wrong Customer code", MessageType.Error);
                    }
                    else {
                        $('#txt_CustCode').val(AccountDetails[0].CustomerCODE);
                        $('#txt_CustName').val(AccountDetails[0].NAMEA);
                        GLOBALopenbalance = AccountDetails[0].Openbalance;
                        custIdfilter = custId;
                    }
                }
            }
        });
    }
    function txt_CustCode_onchange() {
        getAccountById(txt_CustCode.value, true);
    }
})(AgingCust || (AgingCust = {}));
//# sourceMappingURL=AgingCust.js.map