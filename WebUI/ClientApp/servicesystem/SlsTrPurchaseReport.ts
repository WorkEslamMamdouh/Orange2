$(document).ready(() => {
    SlsTrPurchaseReport.InitalizeComponent();
})
namespace SlsTrPurchaseReport {
    //system varables
    var SysSession: SystemSession = GetSystemSession(Modules.Ser_Pur_Report);
    var compcode: Number;
    var BranchCode: number;
    var sys: SystemTools = new SystemTools();
    //ddl
    var ddlFromVendor: HTMLSelectElement;
    // var ddlToVendor: HTMLSelectElement;
    var ddlBranch: HTMLSelectElement;
    var ddlCostCenter: HTMLSelectElement;
    var ddlCategory: HTMLSelectElement;
    var ddlItemCategory: HTMLSelectElement;
    // Arrays
    var servDetail: Array<AVAT_D_Service> = new Array<AVAT_D_Service>();
    var servDetail1: Array<AVAT_D_Service> = new Array<AVAT_D_Service>();
    var VendorDetailList: Array<A_Pay_D_Vendor> = new Array<A_Pay_D_Vendor>();
    var VendDetailsCat: Array<A_Pay_D_Vendor> = new Array<A_Pay_D_Vendor>();
    var VendDetailsGrp: Array<A_Pay_D_Vendor> = new Array<A_Pay_D_Vendor>();
    var VendDetailsfilter: Array<A_Pay_D_Vendor> = new Array<A_Pay_D_Vendor>();
    var CostCenterDetails: Array<G_COST_CENTER> = new Array<G_COST_CENTER>();
    var BranchesDetails: Array<G_BRANCH> = new Array<G_BRANCH>();
    //var CategoriesDetails: Array<AVAT_D_SrvCategory> = new Array<AVAT_D_SrvCategory>();
    var GlobInvoiceModel: AQVAT_GetPurInvoiceHeader = new AQVAT_GetPurInvoiceHeader();
    var CategoriesDetails: Array<A_RecPay_D_Category> = new Array<A_RecPay_D_Category>();
    var itemCategoriesDetails: Array<AVAT_D_SrvCategory> = new Array<AVAT_D_SrvCategory>();
    var groupsDetails: Array<A_RecPay_D_Group> = new Array<A_RecPay_D_Group>();
    //TextBoxes
    var txtStartDate: HTMLInputElement;
    var txtEndDate: HTMLInputElement;
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
    var rdyes: HTMLInputElement;
    var rdno: HTMLInputElement;

    var rdno2: HTMLInputElement;
    var ddlGroup: HTMLSelectElement;
    //buttons 
    var btnFromInvoiceSrch: HTMLButtonElement;
    var btnToInvoiceSrch: HTMLButtonElement;
    var btnServiceSrch: HTMLButtonElement;
    var btnReset: HTMLButtonElement;
    ////////////////Print Buttons           
    var btnPrintTrview: HTMLButtonElement;
    var btnPrintTrPDF: HTMLButtonElement;
    var btnPrintTrEXEL: HTMLButtonElement;
    var btnPrint: HTMLButtonElement;
    //------------------------------------------------------ Main Region------------------------
    export function InitalizeComponent() {
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



    function InitalizeControls() {

        // Drop down lists
        ddlFromVendor = document.getElementById("ddlFromVendor") as HTMLSelectElement;
        // ddlToVendor = document.getElementById("ddlToVendor") as HTMLSelectElement;
        ddlBranch = document.getElementById("ddlBranch") as HTMLSelectElement;
        ddlCostCenter = document.getElementById("ddlCostCenter") as HTMLSelectElement;
        ddlCategory = document.getElementById("ddlCategory") as HTMLSelectElement;
        ddlItemCategory = document.getElementById("ddlItemCategory") as HTMLSelectElement;

        //TextBoxes
        txtStartDate = document.getElementById("txtStartDate") as HTMLInputElement;
        txtEndDate = document.getElementById("txtEndDate") as HTMLInputElement;
        // txtToInvoice = document.getElementById("txtToInvoice") as HTMLInputElement;
        // txtFromInvoice = document.getElementById("txtFromInvoice") as HTMLInputElement;
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



        rdyes = document.getElementById("rdyes") as HTMLInputElement;
        rdno = document.getElementById("rdno") as HTMLInputElement;

        rdno2 = document.getElementById("rdno2") as HTMLInputElement;
        ddlGroup = document.getElementById("ddlGroup") as HTMLSelectElement;

        //button
        btnFromInvoiceSrch = document.getElementById("btnFromInvoiceSrch") as HTMLButtonElement;
        btnToInvoiceSrch = document.getElementById("btnToInvoiceSrch") as HTMLButtonElement;
        btnServiceSrch = document.getElementById("btnServiceSrch") as HTMLButtonElement;
        btnReset = document.getElementById("btnReset") as HTMLButtonElement;

        //// print buttons
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
        ddlCategory.onchange = filterVend;
        ddlGroup.onchange = filterCustGrp;
        btnPrintTrview.onclick = () => { PrintReport(1); }
        btnPrintTrPDF.onclick = () => { PrintReport(2); }
        btnPrintTrEXEL.onclick = () => { PrintReport(3); }
        btnPrint.onclick = () => { PrintReport(4); }

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
        let sys: SystemTools = new SystemTools();
        sys.FindKey(Modules.Ser_Pur_Report, "btnFromInvoiceSrch", "CompCode=" + compcode, () => {
            let id = SearchGrid.SearchDataGrid.SelectedKey;
            GetInvoiceByID(id);
            //txtFromInvoice.value = GlobInvoiceModel.DocNo;
        });
    }
    function btnToInvoiceSrch_onclick() {
        let sys: SystemTools = new SystemTools();
        sys.FindKey(Modules.Ser_Pur_Report, "btnToInvoiceSrch", "CompCode=" + compcode, () => {
            let id = SearchGrid.SearchDataGrid.SelectedKey;
            GetInvoiceByID(id);
            //txtToInvoice.value = GlobInvoiceModel.DocNo;
        });
    }
    function btnServiceSrch_onclick() {
        if (ddlCategory.value == "null") {
            let sys: SystemTools = new SystemTools();
            sys.FindKey(Modules.Ser_Pur_Report, "btnServiceSrch", "CompCode=" + compcode + "and IsPurchase = 'True' ", () => {
                let id = SearchGrid.SearchDataGrid.SelectedKey;
                GetservByID(id);
            });
        } else {
            let sys: SystemTools = new SystemTools();
            sys.FindKey(Modules.Ser_Pur_Report, "btnServiceSrch", "CompCode=" + compcode + "and IsPurchase = 'True' and SrvCategoryID= " + Number(ddlCategory.value), () => {
                let id = SearchGrid.SearchDataGrid.SelectedKey;
                GetservByID(id);

            });
        }
    }
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
    //---------------------------------------------------get region---------------------------------
    function GetInvoiceByID(id: number) {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("ServPurInvoice", "GetPurInvoicebyID"),
            data: {
                InvID: id, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    GlobInvoiceModel = result.Response as AQVAT_GetPurInvoiceHeader;
                }
            }
        });
    }
    function fillddlVendor() {

        Ajax.Callsync({
            type: "Get",//GetAll(int CompCode
            url: sys.apiUrl("AccDefVendor", "GetAll"),
            data: { CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    VendorDetailList = result.Response as Array<A_Pay_D_Vendor>;


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
    function fillddlCategory() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GenDefCategory", "GetAll"),
            data: {
                CompCode: compcode, AccountType: 2, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    CategoriesDetails = result.Response as Array<A_RecPay_D_Category>;
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
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    itemCategoriesDetails = result.Response as Array<AVAT_D_SrvCategory>;
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
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    groupsDetails = result.Response as Array<A_RecPay_D_Group>;
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
            VendDetailsCat = VendorDetailList.filter(s => s.CatID == Number(ddlCategory.value));

            if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                DocumentActions.FillCombowithdefult(VendDetailsCat, ddlFromVendor, "VendorID", "NAMEL", "Select Vendor");
            }
            else {
                DocumentActions.FillCombowithdefult(VendDetailsCat, ddlFromVendor, "VendorID", "NAMEA", "اختر المورد");
            }
        }
        else if (ddlGroup.value != "null" && ddlCategory.value != "null") {
            VendDetailsfilter = VendorDetailList.filter(s => s.CatID == Number(ddlCategory.value == "null") && s.GroupId == Number(ddlGroup.value));

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
        debugger
        if (ddlGroup.value != "null" && ddlCategory.value == "null") {
            VendDetailsGrp = VendorDetailList.filter(s => s.GroupId == Number(ddlGroup.value));
            if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                DocumentActions.FillCombowithdefult(VendDetailsGrp, ddlFromVendor, "VendorID", "NAMEL", "Select Vendor");
            }
            else {
                DocumentActions.FillCombowithdefult(VendDetailsGrp, ddlFromVendor, "VendorID", "NAMEA", "اختر المورد");
            }
        }
        else if (ddlGroup.value != "null" && ddlCategory.value != "null") {
            VendDetailsfilter = VendorDetailList.filter(s => s.CatID == Number(ddlCategory.value) && s.GroupId == Number(ddlGroup.value));

            if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                DocumentActions.FillCombowithdefult(VendDetailsfilter, ddlFromVendor, "VendorID", "NAMEL", "Select Vendor");
            }
            else {
                DocumentActions.FillCombowithdefult(VendDetailsfilter, ddlFromVendor, "VendorID", "NAMEA", "اختر المورد");
            }

        } else {
            if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                DocumentActions.FillCombowithdefult(VendorDetailList, ddlFromVendor, "VendorID", "NAMEL", "Select Vendor");
            }
            else {
                DocumentActions.FillCombowithdefult(VendorDetailList, ddlFromVendor, "VendorID", "NAMEA", "اختر المورد");
            }
        }

    }
    ///////////////// Print function 
    function PrintReport(OutType: number) {
        debugger
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
            rp.cusCatID = -1;
        } else {
            rp.cusCatID = Number(ddlCategory.value);
        }

        if (txtServiceCode.value == '' || txtServiceCode.value.trim() == '') {
            rp.ItemID = -1;
        } else {
            rp.ItemID = Number(txtServiceCode.value);
        }
        //-------------------------------الحالة
        if (RdCredit.checked == true) { rp.SLStype = 0; }                //  اجل     
        else if (RdCash.checked == true) { rp.SLStype = 1; }             //  نقدي    
        else { rp.SLStype = 2; }                                         //  الجميع

        //rp.IsImport = 0;
        if (rdyes.checked == true) { rp.ISimport = 1; }                 // منفذ 
        else { rp.ISimport = 0; }
        // rp.Status = 0;

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


        if (rdInvoice.checked == true) {
            rp.TrType = 1;  //------------------invoice
        } else {
            rp.TrType = 0;  //------------------Return
        }

        if (ddlGroup.value == "null") { rp.cusGroupid = -1; }    // مجموعة المورد  
        else { rp.cusGroupid = Number(ddlGroup.value); }


        if (ddlItemCategory.value == "null") { rp.CatId = -1; }    // مجموعة   قئة
        else { rp.CatId = Number(ddlItemCategory.value); }

        if (ddlFromVendor.value == "null") { rp.cusid = -1; }           //   المورد  
        else { rp.cusid = Number(ddlFromVendor.value); }
                                                                                
            rp.Name_function = "IProc_Rpt_VatPurchaseSummary";
        localStorage.setItem("Report_Data", JSON.stringify(rp));
        

            localStorage.setItem("result", '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>');
             window.open(Url.Action("ReportsPopup", "Home"), "_blank");


    }

}