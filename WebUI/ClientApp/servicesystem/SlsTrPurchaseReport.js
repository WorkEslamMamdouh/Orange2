$(document).ready(function () {
    SlsTrPurchaseReport.InitalizeComponent();
});
var SlsTrPurchaseReport;
(function (SlsTrPurchaseReport) {
    //system varables
    var SysSession = GetSystemSession(Modules.Ser_Pur_Report);
    var compcode;
    var BranchCode;
    var sys = new SystemTools();
    //ddl
    var ddlFromVendor;
    // var ddlToVendor: HTMLSelectElement;
    var ddlBranch;
    var ddlCostCenter;
    var ddlCategory;
    var ddlItemCategory;
    // Arrays
    var servDetail = new Array();
    var servDetail1 = new Array();
    var VendorDetailList = new Array();
    var VendDetailsCat = new Array();
    var VendDetailsGrp = new Array();
    var VendDetailsfilter = new Array();
    var CostCenterDetails = new Array();
    var BranchesDetails = new Array();
    //var CategoriesDetails: Array<AVAT_D_SrvCategory> = new Array<AVAT_D_SrvCategory>();
    var GlobInvoiceModel = new AQVAT_GetPurInvoiceHeader();
    var CategoriesDetails = new Array();
    var itemCategoriesDetails = new Array();
    var groupsDetails = new Array();
    //TextBoxes
    var txtStartDate;
    var txtEndDate;
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
    var rdyes;
    var rdno;
    var rdno2;
    var ddlGroup;
    //buttons 
    var btnFromInvoiceSrch;
    var btnToInvoiceSrch;
    var btnServiceSrch;
    var btnReset;
    ////////////////Print Buttons           
    var btnPrintTrview;
    var btnPrintTrPDF;
    var btnPrintTrEXEL;
    var btnPrint;
    //------------------------------------------------------ Main Region------------------------
    function InitalizeComponent() {
        // VatPrc
        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = "تقرير مشتريات الخدمات";
        }
        else {
            document.getElementById('Screen_name').innerHTML = "Services Purchase Report";
        }
        $("#iconMainPages").addClass("d-none");
        $("#iconReportPages").removeClass("d-none");
        $("#btnPrintTrview span").text("عرض تقرير");
        $("#btnPrintTrview").addClass("print-report");
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);
        InitalizeControls();
        InitializeEvents();
        fillddlVendor();
        fillddlCostCenter();
        fillddlBranch();
        fillddlCategory();
        fillddlItemCategory();
        FillddlGroup();
        txtStartDate.value = SysSession.CurrentEnvironment.StartDate;
        txtEndDate.value = ConvertToDateDash(GetDate()) <= ConvertToDateDash(SysSession.CurrentEnvironment.EndDate) ? GetDate() : SysSession.CurrentEnvironment.EndDate;
        rdNew.checked = true;
        RdCredit.checked = true;
        rdInvoice.checked = true;
        rdsummary.checked = true;
        rdyes.checked = true;
    }
    SlsTrPurchaseReport.InitalizeComponent = InitalizeComponent;
    function InitalizeControls() {
        // Drop down lists
        ddlFromVendor = document.getElementById("ddlFromVendor");
        // ddlToVendor = document.getElementById("ddlToVendor") as HTMLSelectElement;
        ddlBranch = document.getElementById("ddlBranch");
        ddlCostCenter = document.getElementById("ddlCostCenter");
        ddlCategory = document.getElementById("ddlCategory");
        ddlItemCategory = document.getElementById("ddlItemCategory");
        //TextBoxes
        txtStartDate = document.getElementById("txtStartDate");
        txtEndDate = document.getElementById("txtEndDate");
        // txtToInvoice = document.getElementById("txtToInvoice") as HTMLInputElement;
        // txtFromInvoice = document.getElementById("txtFromInvoice") as HTMLInputElement;
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
        rdyes = document.getElementById("rdyes");
        rdno = document.getElementById("rdno");
        rdno2 = document.getElementById("rdno2");
        ddlGroup = document.getElementById("ddlGroup");
        //button
        btnFromInvoiceSrch = document.getElementById("btnFromInvoiceSrch");
        btnToInvoiceSrch = document.getElementById("btnToInvoiceSrch");
        btnServiceSrch = document.getElementById("btnServiceSrch");
        btnReset = document.getElementById("btnReset");
        //// print buttons
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
        ddlCategory.onchange = filterVend;
        ddlGroup.onchange = filterCustGrp;
        btnPrintTrview.onclick = function () { PrintReport(1); };
        btnPrintTrPDF.onclick = function () { PrintReport(2); };
        btnPrintTrEXEL.onclick = function () { PrintReport(3); };
        btnPrint.onclick = function () { PrintReport(4); };
    }
    //------------------------------------------------------ buttonsRegion------------------------
    function btnReset_onclick() {
        //Clear
        // CheckBoxes
        rdNew.checked = true;
        RdAll.checked = true;
        rdInvoice.checked = true;
        rdsummary.checked = true;
        //DropDownlist
        ddlFromVendor.value = "null";
        //ddlToVendor.value = "null";
        ddlBranch.value = "null";
        ddlCostCenter.value = "null";
        ddlCategory.value = "null";
        ddlItemCategory.value = "null";
        ddlGroup.value = "null";
        //Dates
        txtStartDate.value = SysSession.CurrentEnvironment.StartDate;
        txtEndDate.value = ConvertToDateDash(GetDate()) <= ConvertToDateDash(SysSession.CurrentEnvironment.EndDate) ? GetDate() : SysSession.CurrentEnvironment.EndDate;
        //TextBoxes
        txtServiceName.value = "";
        txtServiceCode.value = "";
    }
    //--------------------------------------------------- Search region---------------------------------
    function btnFromInvoiceSrch_onclick() {
        var sys = new SystemTools();
        sys.FindKey(Modules.Ser_Pur_Report, "btnFromInvoiceSrch", "CompCode=" + compcode, function () {
            var id = SearchGrid.SearchDataGrid.SelectedKey;
            GetInvoiceByID(id);
            //txtFromInvoice.value = GlobInvoiceModel.DocNo;
        });
    }
    function btnToInvoiceSrch_onclick() {
        var sys = new SystemTools();
        sys.FindKey(Modules.Ser_Pur_Report, "btnToInvoiceSrch", "CompCode=" + compcode, function () {
            var id = SearchGrid.SearchDataGrid.SelectedKey;
            GetInvoiceByID(id);
            //txtToInvoice.value = GlobInvoiceModel.DocNo;
        });
    }
    function btnServiceSrch_onclick() {
        if (ddlCategory.value == "null") {
            var sys_1 = new SystemTools();
            sys_1.FindKey(Modules.Ser_Pur_Report, "btnServiceSrch", "CompCode=" + compcode + "and IsPurchase = 'True' ", function () {
                var id = SearchGrid.SearchDataGrid.SelectedKey;
                GetservByID(id);
            });
        }
        else {
            var sys_2 = new SystemTools();
            sys_2.FindKey(Modules.Ser_Pur_Report, "btnServiceSrch", "CompCode=" + compcode + "and IsPurchase = 'True' and SrvCategoryID= " + Number(ddlCategory.value), function () {
                var id = SearchGrid.SearchDataGrid.SelectedKey;
                GetservByID(id);
            });
        }
    }
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
    //---------------------------------------------------get region---------------------------------
    function GetInvoiceByID(id) {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("ServPurInvoice", "GetPurInvoicebyID"),
            data: {
                InvID: id, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    GlobInvoiceModel = result.Response;
                }
            }
        });
    }
    function fillddlVendor() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefVendor", "GetAll"),
            data: { CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    VendorDetailList = result.Response;
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                        DocumentActions.FillCombowithdefult(VendorDetailList, ddlFromVendor, "VendorID", "NAMEL", "Select Vendor");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(VendorDetailList, ddlFromVendor, "VendorID", "NAMEA", "اختر المورد");
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
            url: sys.apiUrl("GenDefCategory", "GetAll"),
            data: {
                CompCode: compcode, AccountType: 2, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    CategoriesDetails = result.Response;
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                        DocumentActions.FillCombowithdefult(CategoriesDetails, ddlCategory, "CatID", "Cat_DescE", "Select category");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(CategoriesDetails, ddlCategory, "CatID", "Cat_DescA", "اختر الفئة");
                    }
                }
            }
        });
    }
    function fillddlItemCategory() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AVATSrvCategory", "GetServiceCat"),
            data: {
                UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token, compcode: compcode, IsPurchase: true
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    itemCategoriesDetails = result.Response;
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                        DocumentActions.FillCombowithdefult(itemCategoriesDetails, ddlItemCategory, "SrvCategoryID", "DescE", "Select Serv category");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(itemCategoriesDetails, ddlItemCategory, "SrvCategoryID", "DescA", "اختر فئة الخدمة");
                    }
                }
            }
        });
    }
    ///////////////Group ddl Fun
    function FillddlGroup() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GenDefGroup", "GetAll"),
            data: {
                CompCode: compcode, AccountType: 2, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    groupsDetails = result.Response;
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                        DocumentActions.FillCombowithdefult(groupsDetails, ddlGroup, "GroupID", "Group_DescE", "Select Group");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(groupsDetails, ddlGroup, "GroupID", "Group_DescA", "اختر المجموعه");
                    }
                }
            }
        });
    }
    function filterVend() {
        debugger;
        if (ddlCategory.value != "null") {
            VendDetailsCat = VendorDetailList.filter(function (s) { return s.CatID == Number(ddlCategory.value); });
            if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                DocumentActions.FillCombowithdefult(VendDetailsCat, ddlFromVendor, "VendorID", "NAMEL", "Select Vendor");
            }
            else {
                DocumentActions.FillCombowithdefult(VendDetailsCat, ddlFromVendor, "VendorID", "NAMEA", "اختر المورد");
            }
        }
        else if (ddlGroup.value != "null" && ddlCategory.value != "null") {
            VendDetailsfilter = VendorDetailList.filter(function (s) { return s.CatID == Number(ddlCategory.value == "null") && s.GroupId == Number(ddlGroup.value); });
            if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                DocumentActions.FillCombowithdefult(VendDetailsfilter, ddlFromVendor, "VendorID", "NAMEL", "Select Vendor");
            }
            else {
                DocumentActions.FillCombowithdefult(VendDetailsfilter, ddlFromVendor, "VendorID", "NAMEA", "اختر المورد");
            }
        }
        else {
            if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                DocumentActions.FillCombowithdefult(VendorDetailList, ddlFromVendor, "VendorID", "NAMEL", "Select Vendor");
            }
            else {
                DocumentActions.FillCombowithdefult(VendorDetailList, ddlFromVendor, "VendorID", "NAMEA", "اختر المورد");
            }
        }
    }
    function filterCustGrp() {
        debugger;
        if (ddlGroup.value != "null" && ddlCategory.value == "null") {
            VendDetailsGrp = VendorDetailList.filter(function (s) { return s.GroupId == Number(ddlGroup.value); });
            if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                DocumentActions.FillCombowithdefult(VendDetailsGrp, ddlFromVendor, "VendorID", "NAMEL", "Select Vendor");
            }
            else {
                DocumentActions.FillCombowithdefult(VendDetailsGrp, ddlFromVendor, "VendorID", "NAMEA", "اختر المورد");
            }
        }
        else if (ddlGroup.value != "null" && ddlCategory.value != "null") {
            VendDetailsfilter = VendorDetailList.filter(function (s) { return s.CatID == Number(ddlCategory.value) && s.GroupId == Number(ddlGroup.value); });
            if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                DocumentActions.FillCombowithdefult(VendDetailsfilter, ddlFromVendor, "VendorID", "NAMEL", "Select Vendor");
            }
            else {
                DocumentActions.FillCombowithdefult(VendDetailsfilter, ddlFromVendor, "VendorID", "NAMEA", "اختر المورد");
            }
        }
        else {
            if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                DocumentActions.FillCombowithdefult(VendorDetailList, ddlFromVendor, "VendorID", "NAMEL", "Select Vendor");
            }
            else {
                DocumentActions.FillCombowithdefult(VendorDetailList, ddlFromVendor, "VendorID", "NAMEA", "اختر المورد");
            }
        }
    }
    ///////////////// Print function 
    function PrintReport(OutType) {
        debugger;
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
            rp.cusCatID = -1;
        }
        else {
            rp.cusCatID = Number(ddlCategory.value);
        }
        if (txtServiceCode.value == '' || txtServiceCode.value.trim() == '') {
            rp.ItemID = -1;
        }
        else {
            rp.ItemID = Number(txtServiceCode.value);
        }
        //-------------------------------الحالة
        if (RdCredit.checked == true) {
            rp.SLStype = 0;
        } //  اجل     
        else if (RdCash.checked == true) {
            rp.SLStype = 1;
        } //  نقدي    
        else {
            rp.SLStype = 2;
        } //  الجميع
        //rp.IsImport = 0;
        if (rdyes.checked == true) {
            rp.ISimport = 1;
        } // منفذ 
        else {
            rp.ISimport = 0;
        }
        // rp.Status = 0;
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
        if (rdInvoice.checked == true) {
            rp.TrType = 1; //------------------invoice
        }
        else {
            rp.TrType = 0; //------------------Return
        }
        if (ddlGroup.value == "null") {
            rp.cusGroupid = -1;
        } // مجموعة المورد  
        else {
            rp.cusGroupid = Number(ddlGroup.value);
        }
        if (ddlItemCategory.value == "null") {
            rp.CatId = -1;
        } // مجموعة   قئة
        else {
            rp.CatId = Number(ddlItemCategory.value);
        }
        if (ddlFromVendor.value == "null") {
            rp.cusid = -1;
        } //   المورد  
        else {
            rp.cusid = Number(ddlFromVendor.value);
        }
        rp.Name_function = "IProc_Rpt_VatPurchaseSummary";
        localStorage.setItem("Report_Data", JSON.stringify(rp));
        localStorage.setItem("result", '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>');
        window.open(Url.Action("ReportsPopup", "Home"), "_blank");
    }
})(SlsTrPurchaseReport || (SlsTrPurchaseReport = {}));
//# sourceMappingURL=SlsTrPurchaseReport.js.map