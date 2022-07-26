$(document).ready(function () {
    SlsTrServicesReport.InitalizeComponent();
});
var SlsTrServicesReport;
(function (SlsTrServicesReport) {
    //system varables
    var AccountType = 1;
    var SysSession = GetSystemSession(Modules.Ser_Sales_Report);
    var compcode;
    var BranchCode;
    var sys = new SystemTools();
    //ddl
    var ddl;
    var ddlCatCustomer;
    var ddlGrpCustomer;
    var ddlBranch;
    var ddlCostCenter;
    var ddlCategory;
    var ddlCustomer;
    // Arrays
    var VendorDetails = new Array();
    var servDetail = new Array();
    var servDetail1 = new Array();
    var VendorDetailsCat = new Array();
    var VendorDetailsfilter = new Array();
    var VendorDetailsGrp = new Array();
    var CostCenterDetails = new Array();
    var BranchesDetails = new Array();
    var CategoriesDetails = new Array();
    var GlobInvoiceModel = new AQ_ServSlsInvoiceMasterDetails();
    var Details_Type_D_Category = new Array();
    var Details_CustomerGroup = new Array();
    //TextBoxes
    var txtStartDate;
    var txtEndDate;
    var txtToInvoice;
    var txtFromInvoice;
    var txtServiceCode;
    var txtServiceName;
    //Radio buttons
    var rdNew;
    var rdExecuted;
    var RdCredit;
    var RdCash;
    var RdAll;
    var rdInvoice;
    var rdReturn;
    var rdsummary;
    var rdDetail;
    //buttons 
    var btnFromInvoiceSrch;
    var btnToInvoiceSrch;
    var btnServiceSrch;
    var btnReset;
    var btnPrintTrview;
    var btnPrintTrPDF;
    var btnPrintTrEXEL;
    var btnPrint;
    var id;
    //------------------------------------------------------ Main Region------------------------
    function InitalizeComponent() {
        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = "تقرير مبيعات الخدمات";
        }
        else {
            document.getElementById('Screen_name').innerHTML = "Services Sales Report";
        }
        $("#iconMainPages").addClass("d-none");
        $("#iconReportPages").removeClass("d-none");
        $("#btnPrintTrview span").text("عرض تقرير");
        $("#btnPrintTrview").addClass("print-report");
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);
        InitalizeControls();
        InitializeEvents();
        fillddlCustomer();
        fillddlCostCenter();
        fillddlBranch();
        fillddlCategory();
        fillddlGrpCustomer();
        fillddlCatCustomer();
        txtStartDate.value = SysSession.CurrentEnvironment.StartDate;
        txtEndDate.value = ConvertToDateDash(GetDate()) <= ConvertToDateDash(SysSession.CurrentEnvironment.EndDate) ? GetDate() : SysSession.CurrentEnvironment.EndDate;
        rdNew.checked = true;
        rdInvoice.checked = true;
        RdCredit.checked = true;
        rdsummary.checked = true;
    }
    SlsTrServicesReport.InitalizeComponent = InitalizeComponent;
    function InitalizeControls() {
        // Drop down lists
        ddlCatCustomer = document.getElementById("ddlCatCustomer");
        ddlGrpCustomer = document.getElementById("ddlGrpCustomer");
        ddlBranch = document.getElementById("ddlBranch");
        ddlCostCenter = document.getElementById("ddlCostCenter");
        ddlCategory = document.getElementById("ddlCategory");
        ddlCustomer = document.getElementById("ddlCustomer");
        //TextBoxes
        txtStartDate = document.getElementById("txtStartDate");
        txtEndDate = document.getElementById("txtEndDate");
        txtToInvoice = document.getElementById("txtToInvoice");
        txtFromInvoice = document.getElementById("txtFromInvoice");
        txtServiceCode = document.getElementById("txtServiceCode");
        txtServiceName = document.getElementById("txtServiceName");
        //Radio buttons
        rdNew = document.getElementById("rdNew");
        rdExecuted = document.getElementById("rdExecuted");
        RdCredit = document.getElementById("RdCredit");
        RdCash = document.getElementById("RdCash");
        RdAll = document.getElementById("RdAll");
        rdInvoice = document.getElementById("rdInvoice");
        rdReturn = document.getElementById("rdReturn");
        rdsummary = document.getElementById("rdsummary");
        rdDetail = document.getElementById("rdDetail");
        //button
        btnFromInvoiceSrch = document.getElementById("btnFromInvoiceSrch");
        btnToInvoiceSrch = document.getElementById("btnToInvoiceSrch");
        btnServiceSrch = document.getElementById("btnServiceSrch");
        btnReset = document.getElementById("btnReset");
        //print Button
        btnPrintTrview = document.getElementById("btnPrintTrview");
        btnPrintTrPDF = document.getElementById("btnPrintTrPDF");
        btnPrintTrEXEL = document.getElementById("btnPrintTrEXEL");
        btnPrint = document.getElementById("btnPrint");
    }
    function InitializeEvents() {
        //btnFromInvoiceSrch.onclick = btnFromInvoiceSrch_onclick;
        //btnToInvoiceSrch.onclick = btnToInvoiceSrch_onclick;
        btnServiceSrch.onclick = btnServiceSrch_onclick;
        btnReset.onclick = btnReset_onclick;
        ddlCatCustomer.onchange = filterCust;
        ddlGrpCustomer.onchange = filterCustGrp;
        btnPrintTrview.onclick = function () { PrintReport(1); };
        btnPrintTrPDF.onclick = function () { PrintReport(2); };
        btnPrintTrEXEL.onclick = function () { PrintReport(3); };
        btnPrint.onclick = function () { PrintReport(4); };
        ddlCategory.onchange = ddlCategory_onchange;
    }
    //------------------------------------------------------ buttonsRegion------------------------
    function btnReset_onclick() {
        // CheckBoxes
        rdNew.checked = true;
        RdAll.checked = true;
        rdInvoice.checked = true;
        rdsummary.checked = true;
        //DropDownlist         
        ddlCatCustomer.value = "null";
        ddlGrpCustomer.value = "null";
        //DocumentActions.Filldefult(ddlCustomer,"CustomerId", "NAMEA", "اختر العميل");
        DocumentActions.FillCombowithdefult(VendorDetails, ddlCustomer, "CustomerId", "NAMEA", "اختر العميل");
        ddlBranch.value = "null";
        ddlCostCenter.value = "null";
        ddlCategory.value = "null";
        //Dates
        txtStartDate.value = SysSession.CurrentEnvironment.StartDate;
        txtEndDate.value = ConvertToDateDash(GetDate()) <= ConvertToDateDash(SysSession.CurrentEnvironment.EndDate) ? GetDate() : SysSession.CurrentEnvironment.EndDate;
        //TextBoxes
        //txtToInvoice.value = "";
        //txtFromInvoice.value = "";
        txtServiceCode.value = "";
        txtServiceName.value = "";
    }
    //--------------------------------------------------- Search region---------------------------------
    function btnServiceSrch_onclick() {
        if (ddlCategory.value == "null") {
            var sys_1 = new SystemTools();
            sys_1.FindKey(Modules.Ser_Sales_Report, "btnServiceSrch", "CompCode=" + compcode + "and IsPurchase = 'False' ", function () {
                id = SearchGrid.SearchDataGrid.SelectedKey;
                txtServiceCode.value = id;
                GetservByID(id);
            });
        }
        else {
            var sys_2 = new SystemTools();
            sys_2.FindKey(Modules.Ser_Sales_Report, "btnServiceSrch", "CompCode=" + compcode + "and IsPurchase = 'False' and SrvCategoryID= " + Number(ddlCategory.value), function () {
                id = SearchGrid.SearchDataGrid.SelectedKey;
                txtServiceCode.value = id;
                GetservByID(id);
            });
        }
    }
    //---------------------------------------------------get region---------------------------------
    function GetservByID(id) {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AVAT_D_Service", "GetAll"),
            data: {
                UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    servDetail = result.Response;
                    servDetail1 = servDetail.filter(function (x) { return x.Itemid == id; });
                    txtServiceCode.value = servDetail1[0].ItemCode;
                    txtServiceName.value = servDetail1[0].DescA;
                }
            }
        });
    }
    function filterCust() {
        debugger;
        if (ddlCatCustomer.value != "null") {
            VendorDetailsCat = VendorDetails.filter(function (s) { return s.CatID == Number(ddlCatCustomer.value); });
            if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                DocumentActions.FillCombowithdefult(VendorDetailsCat, ddlCustomer, "CustomerId", "NAMEE", "Select Category");
            }
            else {
                DocumentActions.FillCombowithdefult(VendorDetailsCat, ddlCustomer, "CustomerId", "NAMEA", "اختر العميل");
            }
        }
        else if (ddlGrpCustomer.value != "null" && ddlCatCustomer.value != "null") {
            VendorDetailsfilter = VendorDetails.filter(function (s) { return s.CatID == Number(ddlCatCustomer.value == "null") && s.GroupId == Number(ddlGrpCustomer.value); });
            if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                DocumentActions.FillCombowithdefult(VendorDetailsfilter, ddlCustomer, "CustomerId", "NAMEE", "Select Category");
            }
            else {
                DocumentActions.FillCombowithdefult(VendorDetailsfilter, ddlCustomer, "CustomerId", "NAMEA", "اختر العميل");
            }
        }
        else {
            if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                DocumentActions.FillCombowithdefult(VendorDetails, ddlCustomer, "CustomerId", "NAMEE", "Select Category");
            }
            else {
                DocumentActions.FillCombowithdefult(VendorDetails, ddlCustomer, "CustomerId", "NAMEA", "اختر العميل");
            }
        }
    }
    function filterCustGrp() {
        debugger;
        if (ddlGrpCustomer.value != "null" && ddlCatCustomer.value == "null") {
            VendorDetailsGrp = VendorDetails.filter(function (s) { return s.GroupId == Number(ddlGrpCustomer.value); });
            if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                DocumentActions.FillCombowithdefult(VendorDetailsGrp, ddlCustomer, "CustomerId", "NAMEE", "Select Category");
            }
            else {
                DocumentActions.FillCombowithdefult(VendorDetailsGrp, ddlCustomer, "CustomerId", "NAMEA", "اختر العميل");
            }
        }
        else if (ddlGrpCustomer.value != "null" && ddlCatCustomer.value != "null") {
            VendorDetailsfilter = VendorDetails.filter(function (s) { return s.CatID == Number(ddlCatCustomer.value) && s.GroupId == Number(ddlGrpCustomer.value); });
            if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                DocumentActions.FillCombowithdefult(VendorDetailsfilter, ddlCustomer, "CustomerId", "NAMEE", "Select Category");
            }
            else {
                DocumentActions.FillCombowithdefult(VendorDetailsfilter, ddlCustomer, "CustomerId", "NAMEA", "اختر العميل");
            }
        }
        else {
            if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                DocumentActions.FillCombowithdefult(VendorDetails, ddlCustomer, "CustomerId", "NAMEE", "Select Category");
            }
            else {
                DocumentActions.FillCombowithdefult(VendorDetails, ddlCustomer, "CustomerId", "NAMEA", "اختر العميل");
            }
        }
    }
    function fillddlCatCustomer() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GenDefCategory", "GetAll"),
            data: {
                CompCode: compcode, AccountType: AccountType, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    Details_Type_D_Category = result.Response;
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") { //ddlInvoiceCustomer 
                        DocumentActions.FillCombowithdefult(Details_Type_D_Category, ddlCatCustomer, "CatID", "Cat_DescE", "Select Category");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(Details_Type_D_Category, ddlCatCustomer, "CatID", "Cat_DescA", "اختر الفئة");
                    }
                }
            }
        });
    }
    function fillddlGrpCustomer() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GenDefGroup", "GetAll"),
            data: {
                CompCode: compcode, AccountType: AccountType, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    Details_CustomerGroup = result.Response;
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") { //ddlInvoiceCustomer 
                        DocumentActions.FillCombowithdefult(Details_CustomerGroup, ddlGrpCustomer, "GroupID", "Group_DescE", "Select Group");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(Details_CustomerGroup, ddlGrpCustomer, "GroupID", "Group_DescA", "اختر المجموعه");
                    }
                }
            }
        });
    }
    function fillddlCustomer() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefCustomer", "GetAll"),
            data: {
                CompCode: compcode, BranchCode: BranchCode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    VendorDetails = result.Response;
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                        DocumentActions.FillCombowithdefult(VendorDetails, ddlCustomer, "CustomerId", "NAMEE", "Select Category");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(VendorDetails, ddlCustomer, "CustomerId", "NAMEA", "اختر العميل");
                    }
                }
            }
        });
    }
    function fillddlCostCenter() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("CostCenter", "GetAll"),
            data: {
                CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    CostCenterDetails = result.Response;
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                        DocumentActions.FillCombowithdefult(CostCenterDetails, ddlCostCenter, "CC_CODE", "CC_DESCE", "Select cost Center");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(CostCenterDetails, ddlCostCenter, "CC_CODE", "CC_DESCA", "اختر مركز التكلفه");
                    }
                }
            }
        });
    }
    function fillddlBranch() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GBranch", "GetAll"),
            data: {
                CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    BranchesDetails = result.Response;
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                        DocumentActions.FillCombowithdefult(BranchesDetails, ddlBranch, "BRA_CODE", "BRA_DESCL", "Select All");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(BranchesDetails, ddlBranch, "BRA_CODE", "BRA_DESC", "الجميع");
                    }
                }
            }
        });
    }
    function fillddlCategory() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AVATSrvCategory", "GetServiceCat"),
            data: {
                compcode: compcode, IsPurchase: false, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    CategoriesDetails = result.Response;
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                        DocumentActions.FillCombowithdefult(CategoriesDetails, ddlCategory, "SrvCategoryID", "DescE", "Select category");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(CategoriesDetails, ddlCategory, "SrvCategoryID", "DescA", "اختر الفئه");
                    }
                }
            }
        });
    }
    function PrintReport(OutType) {
        var rp = new ReportParameters();
        rp.RepType = OutType; //output report as View
        rp.FromDate = DateFormatRep(txtStartDate.value);
        rp.ToDate = DateFormatRep(txtEndDate.value);
        if (ddlBranch.value == "null") { //الفرع
            rp.FromBra = -1;
        }
        else {
            rp.FromBra = Number(ddlBranch.value);
        }
        if (ddlCategory.value == "null") { //الفئة
            rp.CatId = -1;
        }
        else {
            rp.CatId = Number(ddlCategory.value);
        }
        if (txtServiceCode.value == '' || txtServiceCode.value.trim() == '') { //الخدمة
            rp.ItemID = -1;
        }
        else {
            rp.ItemID = id;
        }
        //-------------------------------الحالة
        if (RdCredit.checked == true) {
            rp.Status = 0;
        } //  اجل     
        else if (RdCash.checked == true) {
            rp.Status = 1;
        } //  نقدي    
        else {
            rp.Status = 2;
        } //  الجميع 
        //-----------------------------نوع الفاتورة
        if (rdInvoice.checked == true) {
            rp.TrType = 0;
        } // فاتورة
        else {
            rp.TrType = 1;
        } // مرتجع
        //------------------------------
        if (rdExecuted.checked == true) {
            rp.stat = 1;
        } // منفذ 
        else {
            rp.stat = 0;
        } //  الجميع
        if (rdsummary.checked == true) {
            rp.check = 1;
        } //  ملخص 
        else {
            rp.check = 0;
        } // تفصيلي
        if (ddlCostCenter.value == "null") {
            rp.cc_code = '-1';
        } // مركز التكلفة
        else {
            rp.cc_code = ddlCostCenter.value;
        }
        if (ddlCatCustomer.value == "null") {
            rp.CustomercatID = -1;
        } // فئة العميل  
        else {
            rp.CustomercatID = Number(ddlCatCustomer.value);
        }
        if (ddlGrpCustomer.value == "null") {
            rp.CustomerGrpID = -1;
        } // مجموعة العميل  
        else {
            rp.CustomerGrpID = Number(ddlGrpCustomer.value);
        }
        if (ddlCustomer.value == "null") {
            rp.CustomerID = -1;
        } //   العميل  
        else {
            rp.CustomerID = Number(ddlCustomer.value);
        }
        rp.Name_function = "IProc_Rpt_VatSalesSummary";
        localStorage.setItem("Report_Data", JSON.stringify(rp));
        localStorage.setItem("result", '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>');
        window.open(Url.Action("ReportsPopup", "Home"), "_blank");
    }
    function ddlCategory_onchange() {
        txtServiceCode.value = "";
        txtServiceName.value = "";
    }
})(SlsTrServicesReport || (SlsTrServicesReport = {}));
//# sourceMappingURL=SlsTrServicesReport.js.map