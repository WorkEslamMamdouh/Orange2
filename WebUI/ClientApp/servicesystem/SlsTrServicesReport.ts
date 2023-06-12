$(document).ready(() => {

    SlsTrServicesReport.InitalizeComponent();
})
namespace SlsTrServicesReport {
    //system varables
    var AccountType: Number = 1;
    var SysSession: SystemSession = GetSystemSession(Modules.Ser_Sales_Report);
    var compcode: Number;
    var BranchCode: number;
    var sys: SystemTools = new SystemTools();


    //ddl
    var ddl
    var ddlCatCustomer: HTMLSelectElement;
    var ddlGrpCustomer: HTMLSelectElement;
    var ddlBranch: HTMLSelectElement;
    var ddlCostCenter: HTMLSelectElement;
    var ddlCategory: HTMLSelectElement;
    var ddlCustomer: HTMLSelectElement;


    // Arrays
    var VendorDetails: Array<A_Rec_D_Customer> = new Array<A_Rec_D_Customer>();
    var servDetail: Array<AVAT_D_Service> = new Array<AVAT_D_Service>();
    var servDetail1: Array<AVAT_D_Service> = new Array<AVAT_D_Service>();
    var VendorDetailsCat: Array<A_Rec_D_Customer> = new Array<A_Rec_D_Customer>();
    var VendorDetailsfilter: Array<A_Rec_D_Customer> = new Array<A_Rec_D_Customer>();
    var VendorDetailsGrp: Array<A_Rec_D_Customer> = new Array<A_Rec_D_Customer>();
    var CostCenterDetails: Array<G_COST_CENTER> = new Array<G_COST_CENTER>();
    var BranchesDetails: Array<G_BRANCH> = new Array<G_BRANCH>();
    var CategoriesDetails: Array<AVAT_D_SrvCategory> = new Array<AVAT_D_SrvCategory>();
    var GlobInvoiceModel: AQ_ServSlsInvoiceMasterDetails = new AQ_ServSlsInvoiceMasterDetails();
    var Details_Type_D_Category: Array<A_RecPay_D_Category> = new Array<A_RecPay_D_Category>();
    var Details_CustomerGroup: Array<A_RecPay_D_Group> = new Array<A_RecPay_D_Group>();
    //TextBoxes
    var txtStartDate: HTMLInputElement;
    var txtEndDate: HTMLInputElement;
    var txtToInvoice: HTMLInputElement;
    var txtFromInvoice: HTMLInputElement;
    var txtServiceCode: HTMLInputElement;
    var txtServiceName: HTMLInputElement;

    //Radio buttons
    var rdNew: HTMLInputElement;
    var rdExecuted: HTMLInputElement;
    var RdCredit: HTMLInputElement;
    var RdCash: HTMLInputElement;
    var RdAll: HTMLInputElement;
    var rdInvoice: HTMLInputElement;
    var rdReturn: HTMLInputElement;
    var rdsummary: HTMLInputElement;
    var rdDetail: HTMLInputElement;



    //buttons 
    var btnFromInvoiceSrch: HTMLButtonElement;
    var btnToInvoiceSrch: HTMLButtonElement;
    var btnServiceSrch: HTMLButtonElement;
    var btnReset: HTMLButtonElement;
    var btnPrintTrview: HTMLButtonElement;
    var btnPrintTrPDF: HTMLButtonElement;
    var btnPrintTrEXEL: HTMLButtonElement;
    var btnPrint: HTMLButtonElement;
    var id;

    //------------------------------------------------------ Main Region------------------------
    export function InitalizeComponent() {


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
    function InitalizeControls() {

        // Drop down lists
        ddlCatCustomer = document.getElementById("ddlCatCustomer") as HTMLSelectElement;
        ddlGrpCustomer = document.getElementById("ddlGrpCustomer") as HTMLSelectElement;
        ddlBranch = document.getElementById("ddlBranch") as HTMLSelectElement;
        ddlCostCenter = document.getElementById("ddlCostCenter") as HTMLSelectElement;
        ddlCategory = document.getElementById("ddlCategory") as HTMLSelectElement;
        ddlCustomer = document.getElementById("ddlCustomer") as HTMLSelectElement;

        //TextBoxes
        txtStartDate = document.getElementById("txtStartDate") as HTMLInputElement;
        txtEndDate = document.getElementById("txtEndDate") as HTMLInputElement;
        txtToInvoice = document.getElementById("txtToInvoice") as HTMLInputElement;
        txtFromInvoice = document.getElementById("txtFromInvoice") as HTMLInputElement;
        txtServiceCode = document.getElementById("txtServiceCode") as HTMLInputElement;
        txtServiceName = document.getElementById("txtServiceName") as HTMLInputElement;

        //Radio buttons
        rdNew = document.getElementById("rdNew") as HTMLInputElement;
        rdExecuted = document.getElementById("rdExecuted") as HTMLInputElement;
        RdCredit = document.getElementById("RdCredit") as HTMLInputElement;
        RdCash = document.getElementById("RdCash") as HTMLInputElement;
        RdAll = document.getElementById("RdAll") as HTMLInputElement;
        rdInvoice = document.getElementById("rdInvoice") as HTMLInputElement;
        rdReturn = document.getElementById("rdReturn") as HTMLInputElement;
        rdsummary = document.getElementById("rdsummary") as HTMLInputElement;
        rdDetail = document.getElementById("rdDetail") as HTMLInputElement;

        //button
        btnFromInvoiceSrch = document.getElementById("btnFromInvoiceSrch") as HTMLButtonElement;
        btnToInvoiceSrch = document.getElementById("btnToInvoiceSrch") as HTMLButtonElement;
        btnServiceSrch = document.getElementById("btnServiceSrch") as HTMLButtonElement;
        btnReset = document.getElementById("btnReset") as HTMLButtonElement;

        //print Button
        btnPrintTrview = document.getElementById("btnPrintTrview") as HTMLButtonElement;
        btnPrintTrPDF = document.getElementById("btnPrintTrPDF") as HTMLButtonElement;
        btnPrintTrEXEL = document.getElementById("btnPrintTrEXEL") as HTMLButtonElement;
        btnPrint = document.getElementById("btnPrint") as HTMLButtonElement;


    }
    function InitializeEvents() {

        //btnFromInvoiceSrch.onclick = btnFromInvoiceSrch_onclick;
        //btnToInvoiceSrch.onclick = btnToInvoiceSrch_onclick;
        btnServiceSrch.onclick = btnServiceSrch_onclick;
        btnReset.onclick = btnReset_onclick;
        ddlCatCustomer.onchange = filterCust;
        ddlGrpCustomer.onchange = filterCustGrp;


        btnPrintTrview.onclick = () => { PrintReport(1); }
        btnPrintTrPDF.onclick = () => { PrintReport(2); }
        btnPrintTrEXEL.onclick = () => { PrintReport(3); }
        btnPrint.onclick = () => { PrintReport(4); }
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
            let sys: SystemTools = new SystemTools();
            sys.FindKey(Modules.Ser_Sales_Report, "btnServiceSrch", "CompCode=" + compcode + "and IsPurchase = 'False' ", () => {
                id = SearchGrid.SearchDataGrid.SelectedKey;
                txtServiceCode.value = id;
                GetservByID(id);
            });
        } else {
            let sys: SystemTools = new SystemTools();
            sys.FindKey(Modules.Ser_Sales_Report, "btnServiceSrch", "CompCode=" + compcode + "and IsPurchase = 'False' and SrvCategoryID= " + Number(ddlCategory.value), () => {
                id = SearchGrid.SearchDataGrid.SelectedKey;
                txtServiceCode.value = id;
                GetservByID(id);

            });
        }
    }
    //---------------------------------------------------get region---------------------------------
    function GetservByID(id: number) {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AVAT_D_Service", "GetAll"),
            data: {
                UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    servDetail = result.Response as Array<AVAT_D_Service>;
                    servDetail1 = servDetail.filter(x => x.Itemid == id)
                    txtServiceCode.value = servDetail1[0].ItemCode;
                    txtServiceName.value = servDetail1[0].DescA;

                }
            }
        });
    }

    function filterCust() {
        debugger;
        if (ddlCatCustomer.value != "null") {
            VendorDetailsCat = VendorDetails.filter(s => s.CatID == Number(ddlCatCustomer.value));

            if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                DocumentActions.FillCombowithdefult(VendorDetailsCat, ddlCustomer, "CustomerId", "NAMEE", "Select Category");
            }
            else {
                DocumentActions.FillCombowithdefult(VendorDetailsCat, ddlCustomer, "CustomerId", "NAMEA", "اختر العميل");
            }
        }
        else if (ddlGrpCustomer.value != "null" && ddlCatCustomer.value != "null") {
            VendorDetailsfilter = VendorDetails.filter(s => s.CatID == Number(ddlCatCustomer.value == "null") && s.GroupId == Number(ddlGrpCustomer.value));

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
        debugger
        if (ddlGrpCustomer.value != "null" && ddlCatCustomer.value == "null") {
            VendorDetailsGrp = VendorDetails.filter(s => s.GroupId == Number(ddlGrpCustomer.value));
            if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                DocumentActions.FillCombowithdefult(VendorDetailsGrp, ddlCustomer, "CustomerId", "NAMEE", "Select Category");
            }
            else {
                DocumentActions.FillCombowithdefult(VendorDetailsGrp, ddlCustomer, "CustomerId", "NAMEA", "اختر العميل");
            }
        }
        else if (ddlGrpCustomer.value != "null" && ddlCatCustomer.value != "null") {
            VendorDetailsfilter = VendorDetails.filter(s => s.CatID == Number(ddlCatCustomer.value) && s.GroupId == Number(ddlGrpCustomer.value));

            if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                DocumentActions.FillCombowithdefult(VendorDetailsfilter, ddlCustomer, "CustomerId", "NAMEE", "Select Category");
            }
            else {
                DocumentActions.FillCombowithdefult(VendorDetailsfilter, ddlCustomer, "CustomerId", "NAMEA", "اختر العميل");
            }

        } else {
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
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {

                    Details_Type_D_Category = result.Response as Array<A_RecPay_D_Category>;
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {//ddlInvoiceCustomer 
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
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {

                    Details_CustomerGroup = result.Response as Array<A_RecPay_D_Group>;
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {//ddlInvoiceCustomer 
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
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {

                    VendorDetails = result.Response as Array<A_Rec_D_Customer>;
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
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {

                    CostCenterDetails = result.Response as Array<G_COST_CENTER>;
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
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {

                    BranchesDetails = result.Response as Array<G_BRANCH>;
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
    function fillddlCategory() {//GetServiceCat(string UserCode, string Token,int compcode,bool IsPurchase)

        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AVATSrvCategory", "GetServiceCat"),
            data: {
                compcode: compcode, IsPurchase: false, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {

                    CategoriesDetails = result.Response as Array<AVAT_D_SrvCategory>;
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
    function PrintReport(OutType: number) {
        let rp: ReportParameters = new ReportParameters();

        rp.RepType = OutType;//output report as View
        rp.FromDate = DateFormatRep(txtStartDate.value);
        rp.ToDate = DateFormatRep(txtEndDate.value);

        if (ddlBranch.value == "null") {                                 //الفرع
            rp.FromBra = -1;
        } else {
            rp.FromBra = Number(ddlBranch.value);
        }

        if (ddlCategory.value == "null") {                                 //الفئة
            rp.CatId = -1;
        } else {
            rp.CatId = Number(ddlCategory.value);
        }

        if (txtServiceCode.value == '' || txtServiceCode.value.trim() == '') {                                 //الخدمة
            rp.ItemID = -1;
        } else {
            rp.ItemID = id;
        }
        //-------------------------------الحالة
        if (RdCredit.checked == true) { rp.Status = 0; }                //  اجل     
        else if (RdCash.checked == true) { rp.Status = 1; }             //  نقدي    
        else { rp.Status = 2; }                                         //  الجميع 

        //-----------------------------نوع الفاتورة
        if (rdInvoice.checked == true) { rp.TrType = 0; }                // فاتورة
        else { rp.TrType = 1; }                                          // مرتجع

        //------------------------------
        if (rdExecuted.checked == true) { rp.stat = 1; }                 // منفذ 
        else { rp.stat = 0; }                                            //  الجميع

        if (rdsummary.checked == true) { rp.check = 1; }                  //  ملخص 
        else { rp.check = 0 }                                             // تفصيلي

        if (ddlCostCenter.value == "null") { rp.cc_code = '-1'; }           // مركز التكلفة
        else { rp.cc_code = ddlCostCenter.value; }


        if (ddlCatCustomer.value == "null") { rp.CustomercatID = -1; }     // فئة العميل  
        else { rp.CustomercatID = Number(ddlCatCustomer.value); }

        if (ddlGrpCustomer.value == "null") { rp.CustomerGrpID = -1; }    // مجموعة العميل  
        else { rp.CustomerGrpID = Number(ddlGrpCustomer.value); }

        if (ddlCustomer.value == "null") { rp.CustomerID = -1; }           //   العميل  
        else { rp.CustomerID = Number(ddlCustomer.value); }

        rp.Name_function = "IProc_Rpt_VatSalesSummary";
        localStorage.setItem("Report_Data", JSON.stringify(rp));
        

        localStorage.setItem("result", '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>');
        window.open(Url.Action("ReportsPopup", "Home"), "_blank");


    }
    function ddlCategory_onchange() {
        txtServiceCode.value = "";
        txtServiceName.value = "";
    }
     
}