$(document).ready(function () {
    ProcSalesMgr.InitalizeComponent();
});
var ProcSalesMgr;
(function (ProcSalesMgr) {
    //system varables
    var SysSession = GetSystemSession(Modules.ProcSalesMgr);
    var compcode;
    var BranchCode; //SharedSession.CurrentEnvironment.BranchCode;
    var sys = new SystemTools();
    var vatType;
    //ddl
    var ddlCustomer;
    var ddlSalesmanFilter;
    var ddlSalesPersonFilter;
    var ddlStateType;
    var ddlInvoiceType;
    var ddlInvoiceCustomer;
    var ddlSalesman;
    var ddlSalesPerson;
    var ddlType;
    var ddlOPerationMaster;
    var txtRemarks;
    var txtRefNo;
    // Arrays
    var CustomerDetails = new Array();
    var filterCustomerDetails = new Array();
    var StateDetailsAr = new Array();
    var StateDetailsEn = new Array();
    var InvoiceDetailsAr = new Array();
    var InvoiceDetailsEn = new Array();
    var InvoiceTypeDetailsAr = new Array();
    var InvoiceEyptDetailsEn = new Array();
    var SlsInvoiceStatisticsDetails = new Array();
    var SearchDetails = new Array();
    var SlsInvoiceItemsDetails = new Array();
    var mainItemDetails = new Array();
    var ItemDetails = new Array();
    var AD_VatTypeDetails = new A_D_VAT_TYPE();
    var SalesmanDetails = new Array();
    var OperSalesmanDetails = new Array();
    var operationDetails = new Array();
    var operationDetailsList = new Array();
    var operationDetailsWithoutStatus = new Array();
    //Models
    var InvoiceStatisticsModel = new Array();
    var InvoiceItemsDetailsModel = new Array();
    var InvoiceModel = new I_Sls_TR_Invoice();
    var MasterDetailsModel = new SlsInvoiceMasterDetails();
    var invoiceItemSingleModel = new I_Sls_TR_InvoiceItems();
    var List_MinUnitPrice = new Array();
    var Tax_Type_Model = new Tax_Type();
    //TextBoxes
    var txtStartDate;
    var txtEndDate;
    var txtItemCount;
    var txtPackageCount;
    var txtTotal;
    var txtTax;
    var txtNet;
    var txtCommission;
    var txtInvoiceDate;
    var txtInvoiceCustomerName;
    var txt_ApprovePass;
    var searchbutmemreport;
    //labels
    var lblInvoiceNumber;
    var txtOperationStatusMaster;
    //checkbox
    var chkActive;
    var chkOpenProcess;
    //buttons 
    var btnOPerationSearch;
    var btnShow;
    var btnUpdate;
    var btnAdd;
    var btnAddDetails;
    var btnBack; // btnBack btnSave
    var btnSave;
    var btn_Approveprice;
    var btn_Exit_Approveprice;
    //print buttons 
    var btnPrintTrview;
    var btnPrintTrPDF;
    var btnPrintTrEXEL;
    var btnPrintTransaction;
    var btnPrintInvoicePrice;
    var btnPrintslip;
    // giedView
    var Grid = new JsGrid();
    //global
    var OperaID = 0;
    var CountGrid = 0;
    var CountItems = 0;
    var PackageCount = 0;
    var CountTotal = 0;
    var TaxCount = 0;
    var NetCount = 0;
    var commissionCount = 0;
    var VatPrc;
    var Validation_Insert = 0;
    var GlobalinvoiceID = 0;
    var GlobalOperationID = 0;
    var Tax_Rate = 0;
    var InvoiceTransCode = 0;
    //flags
    var Show = true;
    //  var btnPrint: HTMLInputElement;
    var editOrAddFlag = 0; //1 add  - 2 edit
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);
    var flag_PriceWithVAT = (SysSession.CurrentEnvironment.I_Control[0].OperationPriceWithVAT);
    var AfterInsertOrUpdateFlag = false;
    var Selecteditem;
    //------------------------------------------------------ Main Region -----------------------------------
    function InitalizeComponent() {
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);
        InitalizeControls();
        chkOpenProcess.checked = true;
        InitializeEvents();
        fillddlCustomer();
        fillddlSalesman();
        txtInvoiceDate.value = GetDate();
        FillddlStateType();
        FillddlInvoiceType();
        vatType = SysSession.CurrentEnvironment.I_Control[0].DefSlsVatType;
        GetVatPercentage();
        $('#ddlInvoiceType').prop("value", "2");
        $('#ddlStateType').prop("value", "2");
        txtItemCount.value = CountItems.toString();
        txtPackageCount.value = PackageCount.toString();
        txtTotal.value = CountTotal.toString();
        txtTax.value = TaxCount.toString();
        txtNet.value = NetCount.toString();
        txtCommission.value = commissionCount.toString();
        getAllOperations();
        //fillddlOperation();
        txtStartDate.value = DateStartMonth();
        txtEndDate.value = ConvertToDateDash(GetDate()) <= ConvertToDateDash(SysSession.CurrentEnvironment.EndDate) ? GetDate() : SysSession.CurrentEnvironment.EndDate;
        // $('#btnPrint').addClass('display_none');
        //   $('#btnPrintInvoicePrice').addClass('display_none');
        fillddlSalesPerson();
    }
    ProcSalesMgr.InitalizeComponent = InitalizeComponent;
    function InitalizeControls() {
        //debugger
        //  btnPrint = document.getElementById("btnPrint") as HTMLInputElement;
        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = "فواتير العمليات ";
        }
        else {
            document.getElementById('Screen_name').innerHTML = " Operations Invoices";
        }
        // Drop down lists
        ddlCustomer = document.getElementById("ddlCustomer");
        ddlSalesmanFilter = document.getElementById("ddlSalesmanFilter");
        ddlSalesPersonFilter = document.getElementById("ddlSalesPersonFilter");
        ddlStateType = document.getElementById("ddlStateType");
        ddlInvoiceCustomer = document.getElementById("ddlInvoiceCustomer");
        ddlSalesman = document.getElementById("ddlSalesman");
        ddlSalesPerson = document.getElementById("ddlSalesPerson");
        ddlInvoiceType = document.getElementById("ddlInvoiceType");
        ddlType = document.getElementById("ddlType");
        ddlOPerationMaster = document.getElementById("ddlOPerationMaster");
        txtRemarks = document.getElementById("txtRemarks");
        txtRefNo = document.getElementById("txtRefNo");
        //TextBoxes
        searchbutmemreport = document.getElementById("searchbutmemreport");
        txtStartDate = document.getElementById("txtStartDate");
        txtEndDate = document.getElementById("txtEndDate");
        txtItemCount = document.getElementById("txtItemCount");
        txtPackageCount = document.getElementById("txtPackageCount");
        txtTotal = document.getElementById("txtTotal");
        txtTax = document.getElementById("txtTax");
        txtNet = document.getElementById("txtNet");
        txtCommission = document.getElementById("txtCommission");
        txtInvoiceDate = document.getElementById("txtInvoiceDate");
        txtInvoiceCustomerName = document.getElementById("txtInvoiceCustomerName");
        txt_ApprovePass = document.getElementById("txt_ApprovePass");
        //labels
        lblInvoiceNumber = document.getElementById("lblInvoiceNumber");
        txtOperationStatusMaster = document.getElementById("txtOperationStatusMaster");
        //checkbox
        chkActive = document.getElementById("chkActive");
        chkOpenProcess = document.getElementById("chkOpenProcess");
        //  chkActiveFilter = document.getElementById("chkActiveFilter") as HTMLInputElement;
        //button
        btnOPerationSearch = document.getElementById("btnOPerationSearch");
        btnShow = document.getElementById("btnShow");
        btnAdd = document.getElementById("btnAdd");
        btnUpdate = document.getElementById("btnUpdate");
        btnAddDetails = document.getElementById("btnAddDetails"); // btnBack btnSave
        btnBack = document.getElementById("btnBack");
        btnSave = document.getElementById("btnSave");
        btn_Approveprice = document.getElementById("btn_Approveprice");
        btn_Exit_Approveprice = document.getElementById("btn_Exit_Approveprice");
        //print 
        btnPrintTrview = document.getElementById("btnPrintTrview");
        btnPrintTrPDF = document.getElementById("btnPrintTrPDF");
        btnPrintTrEXEL = document.getElementById("btnPrintTrEXEL");
        btnPrintTransaction = document.getElementById("btnPrintTransaction");
        btnPrintslip = document.getElementById("btnPrintslip");
        ////debugger
        //    btnPrintInvoicePrice = document.getElementById("btnPrintInvoicePrice") as HTMLButtonElement;
    }
    function InitializeEvents() {
        chkActive.onclick = chkActive_onchecked;
        btnShow.onclick = btnShow_onclick;
        btnOPerationSearch.onclick = btnOPerationSearch_onclick;
        btnUpdate.onclick = btnUpdate_onclick;
        btnAddDetails.onclick = AddNewRow;
        btnBack.onclick = btnBack_onclick;
        btnSave.onclick = btnSave_onclick;
        btnAdd.onclick = btnAdd_onclick;
        txtCommission.onchange = txtCommission_onchange;
        ddlType.onchange = ddlType_onchange;
        btn_Approveprice.onclick = btn_Approveprice_onclick;
        btn_Exit_Approveprice.onclick = btn_Exit_Approveprice_onclick;
        ddlInvoiceCustomer.onchange = ddlInvoiceCustomer_onchange;
        //print
        btnPrintTrview.onclick = function () { PrintReport(1); };
        btnPrintTrPDF.onclick = function () { PrintReport(2); };
        btnPrintTrEXEL.onclick = function () { PrintReport(3); };
        //btnPrint.onclick = () => { PrintReport(4); }
        btnPrintTransaction.onclick = PrintTransaction;
        btnPrintslip.onclick = btnPrintslip_onclick;
        //btnPrintInvoicePrice.onclick = btnPrintInvoicePrice_onclick;
        searchbutmemreport.onkeyup = _SearchBox_Change;
        ddlSalesmanFilter.onchange = ddlSalesmanFilter_onchange;
        chkOpenProcess.onclick = ddlSalesmanFilter_onchange;
        ddlSalesman.onchange = ddlSalesman_onchange;
        //ddlOPerationMaster.onchange = ddlOPerationMaster_onchange;
    }
    function Check_on_user_type() {
        if (SysSession.CurrentEnvironment.UserType == 1 || SysSession.CurrentEnvironment.UserType == 3) { //Salesman
            var SalesId_1 = SysSession.CurrentEnvironment.SalesManID;
            SalesmanDetails = SalesmanDetails.filter(function (s) { return s.SalesmanId == SalesId_1; });
        }
    }
    function Check_CreditLimit_Custom(net) {
        var custID = Number(ddlInvoiceCustomer.value);
        var custom1 = new A_Rec_D_Customer;
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefCustomer", "GetCustomerByCustomerId"),
            data: {
                CustomerId: custID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    custom1 = result.Response;
                }
            }
        });
        if (custom1 != null) {
            var Isbalance = Number((Number(custom1.Openbalance) + Number(custom1.Debit) - Number(custom1.Credit)).RoundToSt(2));
            var res = Number((net + Isbalance).RoundToSt(2));
            if (custom1.CreditLimit > 0) {
                if (res <= custom1.CreditLimit) {
                    return true;
                }
                else {
                    WorningMessage("خطأ لا يمكن ان تجاوز صافي الفاتوره (" + net + ") مع الرصيد (" + Isbalance + ") الحد الائتماني     (" + custom1.CreditLimit + ")", "Error The net invoice (" + net + ") cannot exceed the balance (" + Isbalance + ") credit limit (" + custom1.CreditLimit + ") ");
                    return false;
                }
            }
        }
        return true;
    }
    //------------------------------------------------------ Fill DDl Region -----------------------------------
    function btnOPerationSearch_onclick() {
        var stat = chkOpenProcess.checked == true ? 2 : 3;
        var sys = new SystemTools();
        sys.FindKey(Modules.ProcSalesMgr, "btnOPerationSearch", " BranchCode = " + BranchCode + " and CompCode = " + compcode + "and Status = " + stat + "", function () {
            var OperationID = SearchGrid.SearchDataGrid.SelectedKey;
            GetOPeration(OperationID);
        });
    }
    function GetOPeration(OperationID) {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("OperationInvoice", "GetAllbyID"),
            data: { OperationID: OperationID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    operationDetailsList = result.Response;
                    $('#ddlOPerationMaster').val(operationDetailsList[0].TrNo);
                    OperaID = operationDetailsList[0].OperationID;
                    ddlOPerationMaster_onchange();
                }
            }
        });
    }
    function fillddlSalesPerson() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefSalesMen", "GetAllSalesPeople"),
            data: {
                CompCode: compcode, BranchCode: BranchCode, IsSalesEnable: true, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    SalesmanDetails = result.Response;
                    //------------------------------------------------- ddlSalesPerson-----------------------------
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                        DocumentActions.FillCombowithdefult(SalesmanDetails, ddlSalesPerson, "SalesmanId", "NameE", "Select Salesman");
                        DocumentActions.FillCombowithdefult(SalesmanDetails, ddlSalesPersonFilter, "SalesmanId", "NameE", "Select Category");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(SalesmanDetails, ddlSalesPerson, "SalesmanId", "NameA", "اختر البائع");
                        DocumentActions.FillCombowithdefult(SalesmanDetails, ddlSalesPersonFilter, "SalesmanId", "NameA", "اختر البائع");
                    }
                }
            }
        });
    }
    function fillddlOperation() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("OperationInvoice", "GetAllOperations"),
            data: { CompCode: compcode, BranchCode: BranchCode, opstatus: chkOpenProcess.checked, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    operationDetailsList = result.Response;
                    //if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                    //    DocumentActions.FillCombowithdefult(operationDetailsList, ddlOPerationMaster, "OperationID", "TrNo", "Select operation");
                    //}
                    //else {
                    //    DocumentActions.FillCombowithdefult(operationDetailsList, ddlOPerationMaster, "OperationID", "TrNo", "اختر العملية");
                    //}
                }
            }
        });
    }
    function fillddlCustomer() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefCustomer", "GetAll"),
            data: {
                CompCode: compcode, BranchCode: BranchCode, AccountType: 1, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    CustomerDetails = result.Response;
                    filterCustomerDetails = result.Response;
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                        DocumentActions.FillCombowithdefult(CustomerDetails, ddlCustomer, "CustomerId", "NAMEE", "Select customer");
                        //filterCustomerDetails = CustomerDetails.filter(x => x.Isactive == true);
                        DocumentActions.FillCombowithdefult(filterCustomerDetails, ddlInvoiceCustomer, "CustomerId", "NAMEE", "Select customer");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(CustomerDetails, ddlCustomer, "CustomerId", "NAMEA", "اختر العميل");
                        //filterCustomerDetails = CustomerDetails.filter(x => x.Isactive == true);
                        DocumentActions.FillCombowithdefult(filterCustomerDetails, ddlInvoiceCustomer, "CustomerId", "NAMEA", "اختر العميل");
                    }
                }
            }
        });
    }
    function fillddlSalesman() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefSalesMen", "GetAllOperationPeople"),
            data: {
                CompCode: compcode, BranchCode: BranchCode, ISOperationEnable: true, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    SalesmanDetails = result.Response;
                    Check_on_user_type();
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                        DocumentActions.FillCombowithdefult(SalesmanDetails, ddlSalesmanFilter, "SalesmanId", "NameE", "Select salesman");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(SalesmanDetails, ddlSalesmanFilter, "SalesmanId", "NameA", "اختر المندوب");
                    }
                    SysSession.CurrentEnvironment.UserType == 1 || SysSession.CurrentEnvironment.UserType == 3 ? ($('#ddlSalesmanFilter option[value="null"]').remove()) : $('#ddlSalesmanFilter').prop('selectedIndex', 0);
                }
            }
        });
    }
    function fillddlSalesmanAdd(OperID) {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("Processes", "GetOperationSalesman"),
            data: {
                OperationID: OperID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    OperSalesmanDetails = result.Response;
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                        DocumentActions.FillCombowithdefult(OperSalesmanDetails, ddlSalesman, "SalesmanId", "NameE", "Select Salesman");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(OperSalesmanDetails, ddlSalesman, "SalesmanId", "NameA", "اختر المندوب");
                    }
                }
            }
        });
    }
    function FillddlStateType() {
        StateDetailsAr = ["غير معتمد", " معتمد", "الجميع"];
        StateDetailsEn = [" Not Approved", " Approved", "All"];
        if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
            for (var i = 0; i < StateDetailsEn.length; i++) {
                var newoption = document.createElement("option");
                newoption.value = i.toString();
                newoption.text = StateDetailsEn[i];
                ddlStateType.options.add(newoption);
            }
        }
        else {
            for (var i = 0; i < StateDetailsAr.length; i++) {
                var newoption = document.createElement("option");
                newoption.value = i.toString();
                newoption.text = StateDetailsAr[i];
                ddlStateType.options.add(newoption);
            }
        }
    }
    function FillddlInvoiceType() {
        InvoiceDetailsAr = ["علي الحساب", " نقدي", "الجميع"];
        InvoiceDetailsEn = [" Credit ", " Cash", "All"];
        if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
            for (var i = 0; i < InvoiceDetailsEn.length; i++) {
                var newoption = document.createElement("option");
                newoption.value = i.toString();
                newoption.text = InvoiceDetailsEn[i];
                ddlInvoiceType.options.add(newoption);
            }
        }
        else {
            for (var i = 0; i < InvoiceDetailsAr.length; i++) {
                var newoption = document.createElement("option");
                newoption.value = i.toString();
                newoption.text = InvoiceDetailsAr[i];
                ddlInvoiceType.options.add(newoption);
            }
        }
    }
    function FillddlType() {
        InvoiceTypeDetailsAr = ["علي الحساب", " نقدي"];
        InvoiceEyptDetailsEn = [" Credit ", " Cash"];
        $('#ddlType').empty();
        if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
            for (var i = 0; i < InvoiceEyptDetailsEn.length; i++) {
                var newoption = document.createElement("option");
                newoption.value = i.toString();
                newoption.text = InvoiceEyptDetailsEn[i];
                ddlType.options.add(newoption);
            }
        }
        else {
            for (var i = 0; i < InvoiceTypeDetailsAr.length; i++) {
                var newoption = document.createElement("option");
                newoption.value = i.toString();
                newoption.text = InvoiceTypeDetailsAr[i];
                ddlType.options.add(newoption);
            }
        }
    }
    function FillddlItem() {
        debugger;
        var operationId;
        if (ddlOPerationMaster.value.trim() != "") {
            operationId = Number(ddlOPerationMaster.value);
        }
        else {
            operationId = GlobalOperationID;
            OperaID = Selecteditem[0].OperationId;
        }
        //OperaID = operationId;
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("Processes", "GetAllOperSalesmanItems"),
            data: {
                operationID: OperaID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    mainItemDetails = result.Response;
                }
            }
        });
    }
    //------------------------------------------------------ Events  Region -----------------------------------
    function ddlInvoiceCustomer_onchange() {
        if (ddlInvoiceCustomer.value == "null") {
            txtInvoiceCustomerName.value = (lang == "ar" ? "عميل نقدي عام" : "General cash customer");
            //ddlType.value = "1";
        }
        else {
            var custID = Number(ddlInvoiceCustomer.value);
            var customer = CustomerDetails.filter(function (s) { return s.CustomerId == custID; });
            //  ddlSalesman.value = customer[0].SalesmanId.toString();
            txtInvoiceCustomerName.value = (lang == "ar" ? customer[0].NAMEA.toString() : customer[0].NAMEE.toString());
        }
    }
    function ddlType_onchange() {
        if (ddlType.value == "1") {
            txtInvoiceCustomerName.value = (lang == "ar" ? "عميل نقدي عام" : "General cash customer");
            $('#LabCashMoney').removeClass('display_none');
            $('#txtCashMoney').removeClass('display_none');
            $('#LabCardMoney').removeClass('display_none');
            $('#txtCardMoney').removeClass('display_none');
            $('#txtCashMoney').val('0');
            $('#txtCardMoney').val('0');
            if (editOrAddFlag == 1) {
                chkActive.checked = SysSession.CurrentEnvironment.I_Control[0].IsProcessCashInvoiceDefAuth;
            }
        }
        else {
            txtInvoiceCustomerName.value = "";
            //ddlInvoiceCustomer_onchange();
            $('#LabCashMoney').addClass('display_none');
            $('#txtCashMoney').addClass('display_none');
            $('#LabCardMoney').addClass('display_none');
            $('#txtCardMoney').addClass('display_none');
            $('#txtCashMoney').val('0');
            $('#txtCardMoney').val('0');
            if (editOrAddFlag == 1) {
                chkActive.checked = SysSession.CurrentEnvironment.I_Control[0].IsProcessCreditInvoiceDefAuth;
            }
        }
    }
    function ddlSalesmanFilter_onchange() {
        $("#div_btnUpdate").addClass("display_none");
        $("#DivInvoiceDetails").addClass("display_none");
        $("#divShow").addClass("display_none");
        if (ddlSalesmanFilter.value != "null") {
            var salesmanid = Number(ddlSalesmanFilter.value);
            //Ajax.Callsync({
            //    type: "Get",
            //    url: sys.apiUrl("Processes", "GetAllSalesmanOperations"),
            //    data: { salesmanId: salesmanid, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            //    success: (d) => {
            //        let result = d as BaseResponse;
            //        if (result.IsSuccess) {
            //            operationDetails = result.Response as Array<IQ_GetOperationSalesman>;
            //            if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
            //                DocumentActions.FillCombowithdefult(operationDetails, ddlOPerationMaster, "OperationID", "TrNo", "Select operation");
            //            }
            //            else {
            //                DocumentActions.FillCombowithdefult(operationDetails, ddlOPerationMaster, "OperationID", "TrNo", "اختر العملية");
            //            }
            //        }
            //    }
            //});
        }
        else {
            var opVal = ddlOPerationMaster.value;
            //fillddlOperation();
            ddlOPerationMaster.value = opVal;
            txtOperationStatusMaster.value = "";
        }
    }
    function ddlOPerationMaster_onchange() {
        //TrNo = $('#ddlOPerationMaster').val()
        //OperationID = $('#ddlOPerationMaster').val()
        if (ddlOPerationMaster.value.trim() == "" || ddlOPerationMaster.value == "0") {
            txtOperationStatusMaster.value = "";
            fillddlSalesman();
        }
        else {
            Ajax.Callsync({
                type: "Get",
                url: sys.apiUrl("Processes", "GetOperationSalesman"),
                data: { OperationID: OperaID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
                success: function (d) {
                    var result = d;
                    if (result.IsSuccess) {
                        OperSalesmanDetails = result.Response;
                        if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                            DocumentActions.FillCombowithdefult(OperSalesmanDetails, ddlSalesmanFilter, "SalesmanId", "NameE", "Select salesman");
                        }
                        else {
                            DocumentActions.FillCombowithdefult(OperSalesmanDetails, ddlSalesmanFilter, "SalesmanId", "NameA", "اختر المندوب");
                        }
                        if (OperSalesmanDetails.length > 0) {
                            ddlSalesmanFilter.selectedIndex = 1;
                        }
                    }
                }
            });
            var operObj = operationDetailsWithoutStatus.filter(function (s) { return s.OperationID == OperaID; });
            //  ddlSalesmanFilter.value = operObj[0].SalesmanId.toString();
            if (operObj.length > 0) {
                operObj[0].Status == (2 || 3) ? txtOperationStatusMaster.value = (lang == "ar" ? "مفتوحه" : "opened") : txtOperationStatusMaster.value = (lang == "ar" ? "مغلقة" : "Closed");
                operObj[0].Status == (2 || 3) ? chkOpenProcess.checked = true : chkOpenProcess.checked = false;
            }
        }
    }
    function txtCommission_onchange() {
        var ComissionAmount = Number(txtCommission.value);
        if (Number(txtCommission.value) > Number(txtNet.value)) {
            WorningMessage("يجب ان تكون العموله اقل من الاجمالي!", "The commission must be less than the total!", "خطأ", "Error");
            txtCommission.value = "0";
        }
        else {
            ComputeTotals();
            txtNet.value = (Number(Number(txtNet.value).RoundToSt(4)) - Number(ComissionAmount.RoundToSt(4))).RoundToSt(4);
            commissionCount = ComissionAmount;
            txtCommission.value = ComissionAmount.toString();
        }
        NetCount = Number(txtNet.value);
    }
    function ddlSalesman_onchange() {
        $('#div_Data').html("");
        CountGrid = 0;
        CountItems = CountGrid;
        PackageCount = 0;
        CountTotal = 0;
        TaxCount = 0;
        NetCount = 0;
        var salID = 0;
        if (ddlSalesman.value != "null") {
            salID = Number(ddlSalesman.value);
            ItemDetails = mainItemDetails.filter(function (s) { return s.SalesmanId == salID && s.OnhandQty > 0; });
            AddNewRow();
        }
    }
    function chkActive_onchecked() {
        //debugger
        GetOPeration(Selecteditem[0].OperationId);
        if (ddlInvoiceCustomer.disabled == true) {
            if (chkOpenProcess.checked == true) {
                if (chkActive.checked == false) {
                    if (operationDetailsList[0].Status == 2) {
                        openInvoice();
                        $("#chkActive").attr("disabled", "disabled");
                    }
                    else {
                        DisplayMassage(" لايمكن الاضافه او التعديل علي الفواتير لان العمليه غير مفتوحه", "Invoices cannot be modified on closed Processes", MessageType.Worning);
                        chkActive.checked = true;
                    }
                }
            }
            else {
                if (SysSession.CurrentPrivileges.CUSTOM3 == true) {
                    if (operationDetailsList[0].Status == 2) {
                        openInvoice();
                        $("#chkActive").attr("disabled", "disabled");
                    }
                    else {
                        DisplayMassage(" لايمكن الاضافه او التعديل علي الفاتوره لان العمليه غير مفتوحه", "Invoices cannot be modified on closed Processes", MessageType.Worning);
                        chkActive.checked = true;
                    }
                }
                else {
                    DisplayMassage(" لايمكن الاضافه او التعديل علي الفاتوره لان العمليه غير مفتوحه", "Invoices cannot be modified on closed Processes", MessageType.Worning);
                    chkActive.checked = true;
                }
            }
        }
    }
    function chkPreivilegeToEditApprovedInvoice() {
        if (SysSession.CurrentPrivileges.CUSTOM2 == false) {
            $("#chkActive").attr("disabled", "disabled");
        }
        else {
            $("#chkActive").removeAttr("disabled");
        }
    }
    //------------------------------------------------------ GetFunctions  Region -----------------------------------
    function getAllOperations() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("OperationInvoice", "GetAllOperationswithoutStatus"),
            data: { CompCode: compcode, BranchCode: BranchCode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    operationDetailsWithoutStatus = result.Response;
                }
            }
        });
    }
    function GetVatPercentage() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GenVatType", "GetVatPercentage"),
            data: {
                CompCode: compcode, VatType: vatType, Type: 1, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    AD_VatTypeDetails = result.Response;
                    VatPrc = AD_VatTypeDetails.VatPerc;
                }
            }
        });
    }
    //------------------------------------------------------ Validation && clear Region -----------------------------------
    function checkValidation() {
        if (SysSession.CurrentPrivileges.CUSTOM1 == false) {
            chkActive.disabled = true;
        }
        else {
            chkActive.disabled = false;
        }
    }
    function ValidationHeader() {
        debugger;
        if (ddlInvoiceCustomer.value == "null" && SysSession.CurrentEnvironment.InvoiceTransCode == 1) {
            DisplayMassage('(برجاء اختيار العميل)', '(Please select a customer)', MessageType.Error);
            Errorinput(ddlInvoiceCustomer);
            return false;
        }
        var newCount = 0;
        for (var i = 0; i < CountGrid; i++) {
            if ($("#txt_StatusFlag" + i).val() != "d" && $("#txt_StatusFlag" + i).val() != "m") {
                newCount++;
            }
        }
        var CashAmount = Number(Number($("#txtCashMoney").val()).RoundToSt(2));
        var CardAmount = Number(Number($("#txtCardMoney").val()).RoundToSt(2));
        var totalAmount = (CashAmount + CardAmount).RoundToSt(2);
        var NetAmount = Number($("#txtNet").val()).RoundToSt(2);
        //if (ddlInvoiceCustomer.value == 'null' && SysSession.CurrentEnvironment.I_Control[0].InvoiceWithoutCust == false && SysSession.CurrentEnvironment.InvoiceTransCode == 1) {
        //    DisplayMassage(" برجاء اختيار العميل", "Please select a customer", MessageType.Error);
        //    Errorinput(ddlInvoiceCustomer);
        //    return false
        //}
        if (ddlInvoiceCustomer.value == 'null' && ddlType.value == "0" && SysSession.CurrentEnvironment.I_Control[0].InvoiceWithoutCust == false) {
            DisplayMassage(" برجاء اختيار العميل", "Please select a customer", MessageType.Error);
            Errorinput(ddlInvoiceCustomer);
            return false;
        }
        else if (ddlSalesman.value == "null") {
            DisplayMassage(" برجاء اختيار المندوب", "Please select a Salesman", MessageType.Error);
            Errorinput(ddlSalesman);
            return false;
        }
        else if (ddlSalesPerson.value == "null") {
            DisplayMassage(" برجاء اختيار البائع", "Please select a Salesman", MessageType.Error);
            Errorinput(ddlSalesPerson);
            return false;
        }
        else if (txtInvoiceDate.value == "") {
            DisplayMassage(" برجاء ادخال التاريخ ", "Please enter the date", MessageType.Error);
            Errorinput(txtInvoiceDate);
            return false;
        }
        else if (chkActive.checked == true && ddlType.value == "1" && (totalAmount != NetAmount)) {
            DisplayMassage(" يجب ان يكون مجموع المبلغ المسدد بالكارت مع المسدد نقدا مساويا لصافي الفاتورة  ", "The total amount paid in the card together with the cash paid must be equal to the net invoice", MessageType.Error);
            Errorinput(txtNet);
            Errorinput($('#txtCashMoney'));
            Errorinput($('#txtCardMoney'));
            return false;
        }
        else if (newCount == 0) {
            DisplayMassage('يجب ادخال اصناف الفاتورة', 'Please enter Invoice Items', MessageType.Error);
            return false;
        }
        else if (!CheckPeriodDate(txtInvoiceDate.value, "I")) {
            debugger;
            DisplayMassage("لا يمكنك الاضافه او التعديل في هذة الفتره المغلقه ", "Please select a Invoice data", MessageType.Error);
            Errorinput(txtInvoiceDate);
            return false;
        }
        return true;
    }
    function Validation_Grid(rowcount) {
        if ($("#txt_StatusFlag" + rowcount).val() == "d" || $("#txt_StatusFlag" + rowcount).val() == "m") {
            return true;
        }
        else {
            var Qty = Number($("#txtQuantity" + rowcount).val());
            var Prc = Number($("#txtPrice" + rowcount).val());
            var Prc_WithVat = Number($("#txtUnitpriceWithVat" + rowcount).val());
            if ($("#ddlItem" + rowcount).val() == "null" || $("#ddlItem" + rowcount).val() == "") {
                DisplayMassage('برجاء ادخال الصنف', 'Please enter the item', MessageType.Error);
                Errorinput($("#ddlItem" + rowcount));
                return false;
            }
            else if (Qty == 0) {
                DisplayMassage('برجاء ادخال الكمية المباعة', 'Please enter the sold quantity ', MessageType.Error);
                Errorinput($("#txtQuantity" + rowcount));
                return false;
            }
            else if (Prc == 0) {
                DisplayMassage('برجاء ادخال السعر', 'Please enter price', MessageType.Error);
                Errorinput($("#txtPrice" + rowcount));
                Errorinput($("#txtUnitpriceWithVat" + rowcount));
                return false;
            }
            return true;
        }
    }
    function clear() {
        $('#div_Data').html("");
        CountGrid = 0;
        CountItems = CountGrid;
        PackageCount = 0;
        CountTotal = 0;
        TaxCount = 0;
        NetCount = 0;
        $("#txtInvoiceDate").prop("value", GetDate());
        $('#ddlInvoiceCustomer option[value=null]').prop('selected', 'selected').change();
        $("#ddlSalesman").prop("value", "null");
        $("#ddlSalesPerson").prop("value", "null");
        $("#txtInvoiceCustomerName").prop("value", "");
        $("#txtCashMoney").prop("value", "");
        $("#txtCardMoney").prop("value", "");
        $("#ddlType").prop("value", "null");
        $("#ddlSalesPerson").prop("value", "null");
        txtRefNo.value = "";
        txtRemarks.value = "";
        chkActive.checked = false;
        lblInvoiceNumber.innerText = "";
        txtItemCount.value = "";
        txtPackageCount.value = "";
        txtTotal.value = "";
        txtTax.value = "";
        txtNet.value = "";
        txtCommission.value = "";
        $("#txtItemCount").prop("value", "");
        $("#txtCreatedBy").prop("value", "");
        $("#txtCreatedAt").prop("value", "");
        $("#txtUpdatedBy").prop("value", "");
        $("#txtUpdatedAt").prop("value", "");
    }
    //------------------------------------------------------ buttons  Region -----------------------------------
    function btnSave_onclick() {
        loading('btnsave');
        setTimeout(function () {
            finishSave('btnsave');
            Validation_Insert = 0;
            if (!SysSession.CurrentPrivileges.AddNew)
                return;
            if (!ValidationHeader())
                return;
            for (var i = 0; i < CountGrid; i++) {
                if (!Validation_Grid(i))
                    return;
            }
            Assign();
            if (ddlInvoiceCustomer.selectedIndex != 0 && ddlType.value == "0") {
                var net = Number(txtNet.value);
                if (!Check_CreditLimit_Custom(net))
                    return;
            }
            if (chkActive.checked == true) {
                GetOPeration(InvoiceModel.OperationId);
                if (operationDetailsList[0].Status != 2) {
                    DisplayMassage(" لايمكن اعتماد الفاتوره لان العمليه غير مفتوحه", "Invoices cannot be modified on closed Processes", MessageType.Worning);
                    return;
                }
            }
            if (Validation_Insert == 1) {
                Open_poup_Pass();
            }
            else {
                if (editOrAddFlag == 2) {
                    Update();
                }
                else if (editOrAddFlag == 1) {
                    Insert();
                }
                InitializeGrid();
                $("#DivFilter").removeClass("disabledDiv");
                $("#divShow").removeClass("disabledDiv");
                $('#condtionbtn1').removeClass("col-lg-10");
                $('#condtionbtn1').addClass("col-lg-8");
                $('#condtionbtn2').removeClass("col-lg-2");
                $('#condtionbtn2').addClass("col-lg-4");
            }
        }, 100);
    }
    function btnAdd_onclick() {
        if (!SysSession.CurrentPrivileges.AddNew)
            return;
        if (ddlOPerationMaster.value.trim() == "" || ddlOPerationMaster.value == "0") {
            DisplayMassage(" يجب ادخال رقم العملية", "The process must be selected", MessageType.Worning);
            $("#DivInvoiceDetails").addClass("display_none");
            $("#div_btnUpdate").addClass("display_none");
            Errorinput(ddlOPerationMaster);
        }
        else {
            if (chkOpenProcess.checked == false) {
                DisplayMassage(" لايمكن اضافه فواتير على العمليات المغلقه", "It is not possible to add invoices to closed transactions", MessageType.Worning);
            }
            else {
                clear();
                FillddlItem();
                // ddlSalesman.value = ddlSalesmanFilter.value;
                FillddlType();
                editOrAddFlag = 1;
                Show = false;
                var opId = OperaID;
                fillddlSalesmanAdd(opId);
                EnableControls();
                $('#txtCreatedBy').prop("value", SysSession.CurrentEnvironment.UserCode);
                $('#txtCreatedAt').prop("value", DateTimeFormat(Date().toString()));
                ItemDetails = new Array();
                $('#ddlItem').empty();
                //AddNewRow();
                chkActive.checked = true;
                chkActive.disabled = false;
                $('#LabCashMoney').addClass('display_none');
                $('#txtCashMoney').addClass('display_none');
                $('#LabCardMoney').addClass('display_none');
                $('#txtCardMoney').addClass('display_none');
                SysSession.CurrentEnvironment.I_Control[0].IvoiceDateEditable == true ? $('#txtInvoiceDate').removeAttr("disabled") : $('#txtInvoiceDate').attr("disabled", "disabled");
                if (SysSession.CurrentEnvironment.I_Control[0].OperationInvoicePaymentDef == 2) {
                    txtInvoiceCustomerName.value = "";
                    $('#LabCashMoney').addClass('display_none');
                    $('#txtCashMoney').addClass('display_none');
                    $('#LabCardMoney').addClass('display_none');
                    $('#txtCardMoney').addClass('display_none');
                    $('#txtCashMoney').val('0');
                    $('#txtCardMoney').val('0');
                    ddlType.value = '0';
                    chkActive.disabled = !SysSession.CurrentPrivileges.CUSTOM1;
                    chkActive.checked = SysSession.CurrentEnvironment.I_Control[0].IsProcessCreditInvoiceDefAuth;
                }
                else {
                    txtInvoiceCustomerName.value = (lang == "ar" ? "عميل نقدي عام" : "General cash customer");
                    $('#LabCashMoney').removeClass('display_none');
                    $('#txtCashMoney').removeClass('display_none');
                    $('#LabCardMoney').removeClass('display_none');
                    $('#txtCardMoney').removeClass('display_none');
                    $('#txtCashMoney').val('0');
                    $('#txtCardMoney').val('0');
                    ddlType.value = '1';
                    chkActive.disabled = !SysSession.CurrentPrivileges.CUSTOM1;
                    chkActive.checked = SysSession.CurrentEnvironment.I_Control[0].IsProcessCashInvoiceDefAuth;
                }
                filterCustomerDetails = CustomerDetails.filter(function (x) { return x.Isactive == true; });
                DocumentActions.FillCombowithdefult(filterCustomerDetails, ddlInvoiceCustomer, "CustomerId", (lang == "ar" ? "NAMEA" : "NAMEE"), (lang == "ar" ? "اختر العميل" : "Select customer"));
            }
        }
    }
    function btnBack_onclick() {
        clear();
        DisableControls();
        if (editOrAddFlag == 2) {
            Grid_RowDoubleClicked();
            $("#btnUpdate").removeClass("display_none");
        }
        else {
            $("#div_btnUpdate").addClass("display_none");
            $("#DivInvoiceDetails").addClass("display_none");
            InitializeGrid();
        }
        $("#divShow").removeClass("display_none");
    }
    function btnShow_onclick() {
        InitializeGrid();
        $("#divShow").removeClass("display_none");
        $("#div_btnUpdate").addClass("display_none");
        $("#DivInvoiceDetails").addClass("display_none");
        $("#divShow").removeClass("disabledDiv");
    }
    function btnUpdate_onclick() {
        if (!SysSession.CurrentPrivileges.EDIT)
            return;
        if (chkOpenProcess.checked == false) {
            if (SysSession.CurrentPrivileges.CUSTOM3 == true) {
                editOrAddFlag = 2;
                EnableControls();
                checkValidation();
                var CustID_1 = Number(ddlInvoiceCustomer.value);
                var Cust = CustomerDetails.filter(function (x) { return x.CustomerId == CustID_1; });
                filterCustomerDetails = CustomerDetails.filter(function (x) { return x.Isactive == true; });
                filterCustomerDetails.push(Cust[0]);
                DocumentActions.FillCombowithdefult(filterCustomerDetails, ddlInvoiceCustomer, "CustomerId", (lang == "ar" ? "NAMEA" : "NAMEE"), (lang == "ar" ? "اختر العميل" : "Select customer"));
                ddlInvoiceCustomer.value = CustID_1.toString();
            }
            else {
                DisplayMassage(" لايمكن تعديل الفواتير على العمليات المغلقه", "It is not possible to edit invoices to closed transactions", MessageType.Worning);
            }
        }
        else {
            editOrAddFlag = 2;
            EnableControls();
            checkValidation();
            var CustID_2 = Number(ddlInvoiceCustomer.value);
            var Cust = CustomerDetails.filter(function (x) { return x.CustomerId == CustID_2; });
            filterCustomerDetails = CustomerDetails.filter(function (x) { return x.Isactive == true; });
            filterCustomerDetails.push(Cust[0]);
            DocumentActions.FillCombowithdefult(filterCustomerDetails, ddlInvoiceCustomer, "CustomerId", (lang == "ar" ? "NAMEA" : "NAMEE"), (lang == "ar" ? "اختر العميل" : "Select customer"));
            ddlInvoiceCustomer.value = CustID_2.toString();
        }
    }
    function _SearchBox_Change() {
        $("#divGridDetails").jsGrid("option", "pageIndex", 1);
        if (searchbutmemreport.value != "") {
            var search_1 = searchbutmemreport.value.toLowerCase();
            SearchDetails = SlsInvoiceStatisticsDetails.filter(function (x) { return x.TrNo.toString().search(search_1) >= 0 || x.CustomerName.toLowerCase().search(search_1) >= 0
                || x.Slsm_DescA.toLowerCase().search(search_1) >= 0 || x.Slsm_DescE.toLowerCase().search(search_1) >= 0; });
            Grid.DataSource = SearchDetails;
            Grid.Bind();
        }
        else {
            Grid.DataSource = SlsInvoiceStatisticsDetails;
            Grid.Bind();
        }
    }
    //------------------------------------------------------ Normal Grid Region -----------------------------------
    function InitializeGrid() {
        var res = GetResourceList("");
        //  $("#id_divGridDetails").attr("style", "");
        Grid.ElementName = "divGridDetails";
        Grid.Paging = true;
        Grid.PageSize = 10;
        Grid.Sorting = true;
        Grid.InsertionMode = JsGridInsertionMode.Binding;
        Grid.Editing = false;
        Grid.Inserting = false;
        Grid.SelectedIndex = 1;
        Grid.OnRowDoubleClicked = Grid_RowDoubleClicked;
        Grid.OnItemEditing = function () { };
        Grid.PrimaryKey = "InvoiceID";
        Grid.Columns = [
            { title: "ID", name: "InvoiceID", type: "text", width: "2%", visible: false },
            { title: res.App_InvoiceNum, name: "TrNo", type: "text", width: "13%" },
            { title: res.App_Cutomer, name: "CustomerName", type: "text", width: "25%" },
            { title: res.App_Salesman, name: (lang == "ar" ? "Slsm_DescA" : "Slsm_DescE"), type: "text", width: "25%" },
            { title: res.App_date, name: "TrDate", type: "text", width: "20%" },
            { title: res.Men_StkDefItemsNumber, name: "Line_Count", type: "text", width: "12%" },
            { title: res.App_PackageCount, name: "Tot_Qty", type: "text", width: "12%" },
            { title: res.App_total, name: "TotalAmount", type: "text", width: "15%" },
            { title: res.App_Tax, name: "VatAmount", type: "text", width: "12%" },
            { title: res.net, name: "NetAfterVat", type: "text", width: "13%" },
            { title: res.App_Commission, name: "CommitionAmount", type: "text", width: "15%" },
            { title: res.App_TobePaid, name: "RemainAmount", type: "text", width: "17%", css: "classfont" },
            { title: res.App_invoiceType, name: "IsCashDesciption", type: "text", width: "16%" },
            { title: res.App_Certified, name: "statusDesciption", type: "text", width: "15%" },
        ];
        BindStatisticGridData();
    }
    function BindStatisticGridData() {
        var startDate = DateFormatRep(txtStartDate.value).toString();
        var endDate = DateFormatRep(txtEndDate.value).toString();
        var customerId = 0;
        var status = 0;
        var ddlSalesmanFilterValue = 0;
        var SalesPersonFilter = 0;
        var IsCash = 0;
        var operationId = 0;
        if (ddlCustomer.value != "null") {
            customerId = Number(ddlCustomer.value.toString());
        }
        if (ddlOPerationMaster.value.trim() != "") {
            operationId = Number(ddlOPerationMaster.value.toString());
        }
        if (ddlSalesmanFilter.value != "null") {
            ddlSalesmanFilterValue = Number(ddlSalesmanFilter.value.toString());
        }
        if (ddlSalesPersonFilter.value != "null") {
            SalesPersonFilter = Number(ddlSalesPersonFilter.value.toString());
        }
        status = Number(ddlStateType.value.toString());
        IsCash = Number(ddlInvoiceType.value);
        if (AfterInsertOrUpdateFlag == true) {
            // salesman
            if (ddlSalesmanFilter.value != "null") {
                ddlSalesmanFilterValue = 0;
                ddlSalesmanFilter.value = "null";
            }
            // customer
            if (ddlCustomer.value != "null") {
                customerId = Number(ddlInvoiceCustomer.value.toString());
                ddlCustomer.value = ddlInvoiceCustomer.value;
            }
            // status
            if (ddlStateType.value != "2") {
                status = 2;
                ddlStateType.value = "2";
            }
            // type
            if (ddlInvoiceType.value != "2") {
                IsCash = 2;
                ddlInvoiceType.value = "2";
            }
        }
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("OperationInvoice", "GetAllSlsInvoiceReviewStatistic"),
            data: { CompCode: compcode, BranchCode: BranchCode, OperationID: OperaID, SalesPerson: SalesPersonFilter, IsCash: IsCash, StartDate: startDate, EndDate: endDate, Status: status, CustId: customerId, SalesMan: ddlSalesmanFilterValue, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    SlsInvoiceStatisticsDetails = new Array();
                    SlsInvoiceStatisticsDetails = result.Response;
                    for (var i = 0; i < SlsInvoiceStatisticsDetails.length; i++) {
                        SlsInvoiceStatisticsDetails[i].TrDate = DateFormat(SlsInvoiceStatisticsDetails[i].TrDate.toString());
                        SlsInvoiceStatisticsDetails[i].statusDesciption = SlsInvoiceStatisticsDetails[i].Status == 1 ? (lang == "ar" ? "معتمد" : "A certified") : (lang == "ar" ? "غير معتمد" : "Not supported");
                        SlsInvoiceStatisticsDetails[i].IsCashDesciption = SlsInvoiceStatisticsDetails[i].IsCash == true ? (lang == "ar" ? "نقدي" : "Cash") : (lang == "ar" ? "علي الحساب" : "Credit");
                    }
                    Grid.DataSource = SlsInvoiceStatisticsDetails;
                    Grid.Bind();
                }
            }
        });
    }
    function Grid_RowDoubleClicked() {
        //debugger
        FillddlType();
        Show = true;
        $("#btnUpdate").removeClass("display_none");
        $("#div_btnUpdate").removeClass("display_none");
        $("#DivInvoiceDetails").removeClass("display_none");
        clear();
        InvoiceStatisticsModel = new Array();
        SlsInvoiceItemsDetails = new Array();
        Selecteditem = SlsInvoiceStatisticsDetails.filter(function (x) { return x.InvoiceID == Number(Grid.SelectedKey); });
        if (AfterInsertOrUpdateFlag == true) {
            Selecteditem = SlsInvoiceStatisticsDetails.filter(function (x) { return x.InvoiceID == GlobalinvoiceID; });
            AfterInsertOrUpdateFlag = false;
        }
        GlobalinvoiceID = Number(Selecteditem[0].InvoiceID);
        GlobalOperationID = Number(Selecteditem[0].OperationId);
        fillddlSalesmanAdd(Selecteditem[0].OperationId);
        FillddlItem();
        InvoiceStatisticsModel = Selecteditem;
        if (InvoiceStatisticsModel.length) {
            txtItemCount.value = InvoiceStatisticsModel[0].Line_Count.toString();
            txtPackageCount.value = InvoiceStatisticsModel[0].Tot_Qty.toString();
            txtTotal.value = InvoiceStatisticsModel[0].TotalAmount.toString();
            txtTax.value = InvoiceStatisticsModel[0].VatAmount.toString();
            txtNet.value = (InvoiceStatisticsModel[0].NetAfterVat - InvoiceStatisticsModel[0].CommitionAmount).RoundToSt(4);
            txtCommission.value = InvoiceStatisticsModel[0].CommitionAmount.toString();
            commissionCount = InvoiceStatisticsModel[0].CommitionAmount;
            ComputeTotals();
            GlobalinvoiceID = InvoiceStatisticsModel[0].InvoiceID;
            lblInvoiceNumber.innerText = InvoiceStatisticsModel[0].TrNo.toString();
            txtInvoiceDate.value = DateFormat(InvoiceStatisticsModel[0].TrDate.toString());
            ddlSalesPerson.value = Number(InvoiceStatisticsModel[0].SalesPersonId) == 0 ? 'null' : InvoiceStatisticsModel[0].SalesPersonId.toString();
            if (InvoiceStatisticsModel[0].CustomerId != null) {
                $('#ddlInvoiceCustomer option[value=' + InvoiceStatisticsModel[0].CustomerId.toString() + ']').prop('selected', 'selected').change();
                $('#txtInvoiceCustomerName').prop("value", (lang == "ar" ? InvoiceStatisticsModel[0].Cus_NameA : InvoiceStatisticsModel[0].Cus_NameE));
            }
            else {
                $('#txtInvoiceCustomerName').prop("value", InvoiceStatisticsModel[0].CustomerName);
            }
            $('#txtCardMoney').prop("value", InvoiceStatisticsModel[0].CardAmount);
            $('#txtCashMoney').prop("value", InvoiceStatisticsModel[0].CashAmount);
            var ddlSalesmanValue = InvoiceStatisticsModel[0].SalesmanId.toString();
            $('#ddlSalesman').prop("value", ddlSalesmanValue);
            var salID = InvoiceStatisticsModel[0].SalesmanId;
            ItemDetails = mainItemDetails.filter(function (s) { return s.SalesmanId == salID; });
            if (InvoiceStatisticsModel[0].IsCash == true) {
                $('#ddlType').prop("value", "1");
                $('#LabCashMoney').removeClass('display_none');
                $('#txtCashMoney').removeClass('display_none');
                $('#LabCardMoney').removeClass('display_none');
                $('#txtCardMoney').removeClass('display_none');
            }
            else {
                $('#ddlType').prop("value", "0");
                $('#LabCashMoney').addClass('display_none');
                $('#txtCashMoney').addClass('display_none');
                $('#LabCardMoney').addClass('display_none');
                $('#txtCardMoney').addClass('display_none');
            }
            $('#txtCreatedBy').prop("value", InvoiceStatisticsModel[0].CreatedBy);
            $('#txtCreatedAt').prop("value", InvoiceStatisticsModel[0].CreatedAt);
            $('#txtUpdatedBy').prop("value", InvoiceStatisticsModel[0].UpdatedBy);
            $('#txtUpdatedAt').prop("value", InvoiceStatisticsModel[0].UpdatedAt);
        }
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("SlsTrSales", "GetSlsInvoiceItem"),
            data: { invoiceID: GlobalinvoiceID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    SlsInvoiceItemsDetails = result.Response;
                    for (var i = 0; i < SlsInvoiceItemsDetails.length; i++) {
                        BuildControls(i);
                    }
                    CountGrid = SlsInvoiceItemsDetails.length;
                    CountItems = SlsInvoiceItemsDetails.length;
                }
            }
        });
        DisableControls();
        if (InvoiceStatisticsModel[0].Status == 1) {
            chkActive.checked = true;
            chkPreivilegeToEditApprovedInvoice();
            btnUpdate.disabled = true;
        }
        else {
            chkActive.checked = false;
            $("#chkActive").attr("disabled", "disabled");
            btnUpdate.disabled = false;
        }
        DocumentActions.RenderFromModel(InvoiceStatisticsModel[0]);
        txtNet.value = (InvoiceStatisticsModel[0].NetAfterVat - InvoiceStatisticsModel[0].CommitionAmount).RoundToSt(4);
    }
    //------------------------------------------------------ Controls Grid Region -----------------------------------
    function BuildControls(cnt) {
        var html;
        html = "<tr id=\"No_Row" + cnt + "\">\n                    <input id=\"InvoiceItemID" + cnt + "\" type=\"hidden\" class=\"form-control display_none\"  />\n\t                <td>\n\t\t                <div class=\"form-group\">\n\t\t\t                <span id=\"btn_minus" + cnt + "\" class=\"display_none\"><i class=\"fas fa-minus-circle fs-4 btn-minus \"></i></span>\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n\t\t\t                <input id=\"txtSerial" + cnt + "\" type=\"text\" class=\"form-control\" disabled />\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n\t\t\t                <select id=\"ddlItem" + cnt + "\" class=\"form-control\">\n                                <option>\u0627\u0644\u0635\u0646\u0641</option>\n                            </select>\n                        </div>\n\t                </td>\n                     <td>\n\t\t                <div class=\"form-group\">\n\t\t\t                <div class=\"form-group ps-1\">\n\t\t\t                    <input class=\"counter\" type=\"number\" data-id=\"number\" id=\"txtQuantity" + cnt + "\" name=\"quant[1]\"  value=\"0\" min=\"1\" max=\"1000\" step=\"1\"/>\n\t\t\t                    <div class=\"value-button decrease-button btn-number1" + cnt + "\" data-id=\"decrease\" id=\"btnminus1\" data-type=\"minus\" data-field=\"quant[1]\">-</div>\n\t\t\t                    <div class=\"value-button increase-button btn-number1" + cnt + "\" data-id=\"increase\" id=\"btnplus1\" data-type=\"plus\" data-field=\"quant[1]\">+</div>\n\t\t                    </div>\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n\t\t\t                <input type=\"text\"  class=\"form-control\" id=\"txtReturnQuantity" + cnt + "\" name=\"quant[3]\" class=\"form-control\" value=\"0\" min=\"0\" max=\"1000\" step=\"1\">\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n\t\t\t                <div class=\"form-group ps-1\">\n\t\t\t                    <input class=\"counter\" type=\"number\" data-id=\"number\" id=\"txtPrice" + cnt + "\" name=\"quant[2]\"  value=\"1\" min=\"0\" max=\"1000\" step=\"0.5\"/>\n\t\t\t                    <div class=\"value-button decrease-button btn-number2" + cnt + "\" data-id=\"decrease\" id=\"btnminus2\" data-type=\"minus\" data-field=\"quant[2]\">-</div>\n\t\t\t                    <div class=\"value-button increase-button btn-number2" + cnt + "\" data-id=\"increase\" id=\"btnplus2\" data-type=\"plus\" data-field=\"quant[2]\">+</div>\n\t\t                    </div>\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n\t\t\t                <div class=\"form-group ps-1\">\n\t\t\t                    <input class=\"counter\" type=\"number\" data-id=\"number\" id=\"txtUnitpriceWithVat" + cnt + "\" name=\"quant[2]\"  value=\"1\" min=\"0\" max=\"1000\" step=\"0.5\"/>\n\t\t\t                    <div class=\"value-button decrease-button btn-number3" + cnt + "\" data-id=\"decrease\" id=\"btnminus3\" data-type=\"minus\" data-field=\"quant[2]\">-</div>\n\t\t\t                    <div class=\"value-button increase-button btn-number3" + cnt + "\" data-id=\"increase\" id=\"btnplus3\" data-type=\"plus\" data-field=\"quant[2]\">+</div>\n\t\t                    </div>\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n\t\t\t                <input type=\"text\"  class=\"form-control\" id=\"txtTotal" + cnt + "\"  class=\"form-control\" disabled>\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n\t\t\t               <input id=\"txtTax_Rate" + cnt + "\" type=\"text\"  class=\"form-control\"  disabled>\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n\t\t\t              <input id=\"txtTax" + cnt + "\" type=\"text\" class=\"form-control\" disabled />\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n\t\t\t              <input id=\"txtTotAfterTax" + cnt + "\" type=\"text\" class=\"form-control\" disabled />\n\t\t                </div>\n\t                </td>\n                    <input id=\"UnitCost" + cnt + "\" name = \" \" type = \"hidden\" class=\"form-control\"/>\n                    <input id=\"txt_StatusFlag" + cnt + "\" name = \" \" type = \"hidden\" class=\"form-control\"/>\n                    <input id=\"txt_ID" + cnt + "\" name = \" \" type = \"hidden\" class=\"form-control\" />\n                </tr>";
        $("#div_Data").append(html);
        $(".select_").select2();
        //script
        $('.btn-number1' + cnt).click(function (e) {
            e.preventDefault();
            var fieldName = $(this).attr('data-field');
            var type = $(this).attr('data-type');
            var input = $("#txtQuantity" + cnt);
            var currentVal = parseFloat(input.val());
            if (!isNaN(currentVal)) {
                if (type == 'minus') {
                    if (currentVal > Number(input.attr('min'))) {
                        input.val((currentVal - 1)).change();
                    }
                    if (parseFloat(input.val()) == Number(input.attr('min'))) {
                        $(this).val(input.attr('min'));
                    }
                }
                else if (type == 'plus') {
                    if (currentVal < Number(input.attr('max'))) {
                        input.val((currentVal + 1)).change();
                    }
                    if (parseFloat(input.val()) == parseFloat(input.attr('max'))) {
                        $(this).val(input.attr('max'));
                    }
                }
            }
            else {
                input.val(1);
            }
        });
        $('.input-number1' + cnt).focusin(function () {
            $(this).data('oldValue', $(this).val());
        });
        $('.input-number1' + cnt).change(function () {
            var minValue = parseInt($(this).attr('min'));
            var maxValue = parseInt($(this).attr('max'));
            var valueCurrent = parseInt($(this).val());
            var name = $(this).attr('name');
            if (valueCurrent >= minValue) {
                $(".btn-number1" + cnt + "[data-type='minus'][data-field='" + name + "']").removeAttr('disabled');
            }
            else {
                alert('Sorry, the minimum value was reached');
                $(this).val($(this).data('oldValue'));
            }
            if (valueCurrent <= maxValue) {
                $(".btn-number1" + cnt + "[data-type='plus'][data-field='" + name + "']").removeAttr('disabled');
            }
            else {
                alert('Sorry, the maximum value was reached');
                $(this).val($(this).data('oldValue'));
            }
        });
        $(".input-number1" + cnt).keydown(function (e) {
            // Allow: backspace, delete, tab, escape, enter and .
            if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 190]) !== -1 ||
                // Allow: Ctrl+A
                (e.keyCode == 65 && e.ctrlKey === true) ||
                // Allow: home, end, left, right
                (e.keyCode >= 35 && e.keyCode <= 39)) {
                // let it happen, don't do anything
                return;
            }
            // Ensure that it is a number and stop the keypress
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        });
        //script
        //script
        $('.btn-number2' + cnt).click(function (e) {
            e.preventDefault();
            var fieldName = $(this).attr('data-field');
            var type = $(this).attr('data-type');
            var input = $("#txtPrice" + cnt);
            var currentVal = parseFloat(input.val());
            if (!isNaN(currentVal)) {
                if (type == 'minus') {
                    if (currentVal > Number(input.attr('min'))) {
                        input.val((currentVal - 0.5)).change();
                    }
                    if (parseFloat(input.val()) == Number(input.attr('min'))) {
                        $(this).val(input.attr('min'));
                    }
                }
                else if (type == 'plus') {
                    if (currentVal < Number(input.attr('max'))) {
                        input.val((currentVal + 0.5)).change();
                    }
                    if (parseFloat(input.val()) == parseFloat(input.attr('max'))) {
                        $(this).val(input.attr('max'));
                    }
                }
            }
            else {
                input.val(1);
            }
        });
        $('.btn-number3' + cnt).click(function (e) {
            e.preventDefault();
            var fieldName = $(this).attr('data-field');
            var type = $(this).attr('data-type');
            var input = $("#txtUnitpriceWithVat" + cnt);
            var currentVal = parseFloat(input.val());
            if (!isNaN(currentVal)) {
                if (type == 'minus') {
                    if (currentVal > Number(input.attr('min'))) {
                        input.val((currentVal - 0.5)).change();
                    }
                    if (parseFloat(input.val()) == Number(input.attr('min'))) {
                        $(this).val(input.attr('min'));
                    }
                }
                else if (type == 'plus') {
                    if (currentVal < Number(input.attr('max'))) {
                        input.val((currentVal + 0.5)).change();
                    }
                    if (parseFloat(input.val()) == parseFloat(input.attr('max'))) {
                        $(this).val(input.attr('max'));
                    }
                }
            }
            else {
                input.val(1);
            }
        });
        $('.input-number2' + cnt).focusin(function () {
            $(this).data('oldValue', $(this).val());
        });
        $('.input-number2' + cnt).change(function () {
            var minValue = parseInt($(this).attr('min'));
            var maxValue = parseInt($(this).attr('max'));
            var valueCurrent = parseInt($(this).val());
            var name = $(this).attr('name');
            if (valueCurrent >= minValue) {
                $(".btn-number2" + cnt + "[data-type='minus'][data-field='" + name + "']").removeAttr('disabled');
            }
            else {
                alert('Sorry, the minimum value was reached');
                $(this).val($(this).data('oldValue'));
            }
            if (valueCurrent <= maxValue) {
                $(".btn-number2" + cnt + "[data-type='plus'][data-field='" + name + "']").removeAttr('disabled');
            }
            else {
                alert('Sorry, the maximum value was reached');
                $(this).val($(this).data('oldValue'));
            }
        });
        $(".input-number2" + cnt).keydown(function (e) {
            // Allow: backspace, delete, tab, escape, enter and .
            if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 190]) !== -1 ||
                // Allow: Ctrl+A
                (e.keyCode == 65 && e.ctrlKey === true) ||
                // Allow: home, end, left, right
                (e.keyCode >= 35 && e.keyCode <= 39)) {
                // let it happen, don't do anything
                return;
            }
            // Ensure that it is a number and stop the keypress
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        });
        //script
        //script
        $('.btn-number3' + cnt).click(function (e) {
            e.preventDefault();
            var fieldName = $(this).attr('data-field');
            var type = $(this).attr('data-type');
            var input = $("#txtReturnQuantity" + cnt);
            var currentVal = parseFloat(input.val());
            if (!isNaN(currentVal)) {
                if (type == 'minus') {
                    if (currentVal > Number(input.attr('min'))) {
                        input.val((currentVal - 0.5)).change();
                    }
                    if (parseFloat(input.val()) == Number(input.attr('min'))) {
                        $(this).val(input.attr('min'));
                    }
                }
                else if (type == 'plus') {
                    if (currentVal < Number(input.attr('max'))) {
                        input.val((currentVal + 0.5)).change();
                    }
                    if (parseFloat(input.val()) == parseFloat(input.attr('max'))) {
                        $(this).val(input.attr('max'));
                    }
                }
            }
            else {
                input.val(1);
            }
        });
        $('.input-number3' + cnt).focusin(function () {
            $(this).data('oldValue', $(this).val());
        });
        $('.input-number3' + cnt).change(function () {
            var minValue = parseInt($(this).attr('min'));
            var maxValue = parseInt($(this).attr('max'));
            var valueCurrent = parseInt($(this).val());
            var name = $(this).attr('name');
            if (valueCurrent >= minValue) {
                $(".btn-number3" + cnt + "[data-type='minus'][data-field='" + name + "']").removeAttr('disabled');
            }
            else {
                alert('Sorry, the minimum value was reached');
                $(this).val($(this).data('oldValue'));
            }
            if (valueCurrent <= maxValue) {
                $(".btn-number3" + cnt + "[data-type='plus'][data-field='" + name + "']").removeAttr('disabled');
            }
            else {
                alert('Sorry, the maximum value was reached');
                $(this).val($(this).data('oldValue'));
            }
        });
        $(".input-number3" + cnt).keydown(function (e) {
            // Allow: backspace, delete, tab, escape, enter and .
            if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 190]) !== -1 ||
                // Allow: Ctrl+A
                (e.keyCode == 65 && e.ctrlKey === true) ||
                // Allow: home, end, left, right
                (e.keyCode >= 35 && e.keyCode <= 39)) {
                // let it happen, don't do anything
                return;
            }
            // Ensure that it is a number and stop the keypress
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        });
        $('#ddlItem' + cnt).empty();
        $('#ddlItem' + cnt).append('<option value="' + null + '">' + (lang == "ar" ? "اختر الصنف" : "Select Item") + '</option>');
        for (var i = 0; i < ItemDetails.length; i++) {
            $('#ddlItem' + cnt).append('<option   data-MinUnitPrice="' + ItemDetails[i].Min_SalesPrice + '"  data-OnhandQty="' + ItemDetails[i].OnhandQty + '" value="' + ItemDetails[i].ItemID + '">' + (lang == "ar" ? ItemDetails[i].IT_DescA : ItemDetails[i].IT_DescE) + '</option>');
        }
        var dropddlItem = '#ddlItem' + cnt;
        $(dropddlItem).change(function () {
            if ($('#ddlItem' + cnt).val() == "null") {
                $("#txtQuantity" + cnt).val("0");
                $("#txtPrice" + cnt).val("1");
                $("#txtUnitpriceWithVat" + cnt).val("1");
                $("#txtTotal" + cnt).val("0");
                $("#txtTax" + cnt).val("0");
                $("#txtTax_Rate" + cnt).val("0");
                $("#txtTotAfterTax" + cnt).val("0");
                $("#InvoiceItemID" + cnt).val("");
            }
            else {
                var selectedItem = $(dropddlItem + ' option:selected').attr('value');
                var itemID = Number(selectedItem);
                var NumberSelect = ItemDetails.filter(function (s) { return s.ItemID == itemID; });
                var res = false;
                var NumberRowid = $("#InvoiceItemID" + cnt).val();
                //res = checkRepeatedItems(itemID, NumberRowid);
                //if (res == true) {
                //    $("#ddlItem" + cnt).val("null");
                //    $("#txtPrice" + cnt).val("1");
                //    DisplayMassage('( لايمكن تكرار نفس الاصناف علي الفاتورة )', 'The same items cannot be duplicated on the invoice', MessageType.Error);
                //    Errorinput($(dropddlItem));
                //} else {
                Tax_Rate = NumberSelect[0].VatPrc;
                Tax_Type_Model = GetVat(NumberSelect[0].VatNatID, Tax_Rate, vatType);
                Tax_Rate = Tax_Type_Model.Prc;
                VatPrc = Tax_Rate;
                $("#txtTax_Rate" + cnt).attr('Data-VatNatID', Tax_Type_Model.Nature);
                $("#txtTax_Rate" + cnt).val(VatPrc);
                var NumberSelect = ItemDetails.filter(function (s) { return s.ItemID == itemID; });
                var GetUnitprice = Get_PriceWithVAT(NumberSelect[0].Est_SalesPrice, VatPrc, flag_PriceWithVAT);
                var itemPrice = GetUnitprice.unitprice;
                $("#txtPrice" + cnt).val(itemPrice);
                $("#txtUnitpriceWithVat" + cnt).val(GetUnitprice.unitpricewithvat);
                //UomID = NumberSelect[0]
                var txtQuantityValue = $("#txtQuantity" + cnt).val();
                var txtPriceValue = $("#txtPrice" + cnt).val();
                var total = Number(txtQuantityValue) * Number(txtPriceValue);
                $("#txtTotal" + cnt).val(total.RoundToSt(2));
                var vatAmount = Number(total.RoundToSt(2)) * VatPrc / 100;
                $("#txtTax" + cnt).val(vatAmount.RoundToSt(4));
                var totalAfterVat = Number(vatAmount) + Number(total);
                $("#txtTotAfterTax" + cnt).val(totalAfterVat.RoundToSt(2));
                //}
            }
            ComputeTotals();
        });
        // text change
        $("#txtQuantity" + cnt).on('keyup', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
            var txtQuantityValue = Number($("#txtQuantity" + cnt).val());
            var txtPriceValue = $("#txtPrice" + cnt).val();
            var total = 0;
            if (txtQuantityValue < 0) {
                $("#txtQuantity" + cnt).val("0");
                $("#txtQuantity" + cnt).select();
            }
            var Onhand_Qty = Number($('option:selected', $("#ddlItem" + cnt)).attr('data-OnhandQty'));
            if (isNaN(Onhand_Qty)) {
                DisplayMassage('( برجاء اختيار الصنف  )', 'Please Select the item', MessageType.Error);
                $("#txtQuantity" + cnt).val("1");
            }
            else {
                if (txtQuantityValue < Onhand_Qty) { }
                else {
                    DisplayMassage("خطأ الكميه المتاحه (" + Onhand_Qty + ")", "Error quantity available(" + Onhand_Qty + ")", MessageType.Error);
                    $("#txtQuantity" + cnt).val(Onhand_Qty);
                    txtQuantityValue = Onhand_Qty;
                }
            }
            var quntity = Number(Number(txtQuantityValue).RoundToSt(2));
            if ($("#txtPrice" + cnt).val() == 0) {
                total = quntity * 1;
            }
            else {
                total = quntity * Number(txtPriceValue);
            }
            $("#txtTotal" + cnt).val(total.RoundToSt(2));
            var vatAmount = Number(total) * VatPrc / 100;
            $("#txtTax" + cnt).val(vatAmount.RoundToSt(4));
            var totalAfterVat = Number(vatAmount) + Number(total);
            $("#txtTotAfterTax" + cnt).val(totalAfterVat.RoundToSt(2));
            ComputeTotals();
        });
        $("#txtQuantity" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
            var txtQuantityValue = $("#txtQuantity" + cnt).val();
            var txtPriceValue = $("#txtPrice" + cnt).val();
            var total = 0;
            var Onhand_Qty = Number($('option:selected', $("#ddlItem" + cnt)).attr('data-OnhandQty'));
            if (isNaN(Onhand_Qty)) {
                DisplayMassage('برجاء اختيار الصنف ', 'Please Select the item', MessageType.Error);
                $("#txtQuantity" + cnt).val("0");
            }
            else {
                if (txtQuantityValue < Onhand_Qty) { }
                else {
                    DisplayMassage("خطأ الكميه المتاحه (" + Onhand_Qty + ")", "Error quantity available(" + Onhand_Qty + ")", MessageType.Error);
                    $("#txtQuantity" + cnt).val(Onhand_Qty);
                    txtQuantityValue = Onhand_Qty;
                }
            }
            total = Number(txtQuantityValue) * Number(txtPriceValue);
            $("#txtTotal" + cnt).val(total.RoundToSt(2));
            var vatAmount = Number(total) * VatPrc / 100;
            $("#txtTax" + cnt).val(vatAmount.RoundToSt(4));
            var totalAfterVat = Number(vatAmount) + Number(total);
            $("#txtTotAfterTax" + cnt).val(totalAfterVat.RoundToSt(2));
            ComputeTotals();
        });
        $("#txtPrice" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
            var SalesPrice = Number($("#txtPrice" + cnt).val());
            var GetUnitprice = Get_PriceWithVAT(SalesPrice, VatPrc, false);
            $("#txtUnitpriceWithVat" + cnt).val(GetUnitprice.unitpricewithvat);
            //$("#txtPrice" + cnt).val(GetUnitprice.unitprice);
            var txtQuantityValue = $("#txtQuantity" + cnt).val();
            var txtPriceValue = $("#txtPrice" + cnt).val();
            var total = Number(txtQuantityValue) * Number(txtPriceValue);
            var vatAmount = Number(total) * VatPrc / 100;
            $("#txtTax" + cnt).val(vatAmount.RoundToSt(4));
            var total = Number(txtQuantityValue) * Number(txtPriceValue);
            $("#txtTotal" + cnt).val(total.RoundToSt(2));
            var totalAfterVat = Number(vatAmount) + Number(total);
            $("#txtTotAfterTax" + cnt).val(totalAfterVat.RoundToSt(2));
            ComputeTotals();
        });
        $("#txtPrice" + cnt).on('keyup', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
            var SalesPrice = Number($("#txtPrice" + cnt).val());
            var GetUnitprice = Get_PriceWithVAT(SalesPrice, VatPrc, false);
            $("#txtUnitpriceWithVat" + cnt).val(GetUnitprice.unitpricewithvat);
            //$("#txtPrice" + cnt).val(GetUnitprice.unitprice);
            var txtQuantityValue = $("#txtQuantity" + cnt).val();
            var txtPriceValue = $("#txtPrice" + cnt).val();
            var total = Number(txtQuantityValue) * Number(txtPriceValue);
            var vatAmount = Number(total) * VatPrc / 100;
            $("#txtTax" + cnt).val(vatAmount.RoundToSt(4));
            var total = Number(txtQuantityValue) * Number(txtPriceValue);
            $("#txtTotal" + cnt).val(total.RoundToSt(2));
            var totalAfterVat = Number(vatAmount) + Number(total);
            $("#txtTotAfterTax" + cnt).val(totalAfterVat.RoundToSt(2));
            ComputeTotals();
        });
        $("#txtUnitpriceWithVat" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
            var SalesPrice = Number($("#txtUnitpriceWithVat" + cnt).val());
            var GetUnitprice = Get_PriceWithVAT(SalesPrice, VatPrc, true);
            //$("#txtUnitpriceWithVat" + cnt).val(GetUnitprice.unitpricewithvat)
            $("#txtPrice" + cnt).val(GetUnitprice.unitprice);
            var txtQuantityValue = $("#txtQuantity" + cnt).val();
            var txtPriceValue = $("#txtPrice" + cnt).val();
            var total = Number(txtQuantityValue) * Number(txtPriceValue);
            var vatAmount = Number(total) * VatPrc / 100;
            $("#txtTax" + cnt).val(vatAmount.RoundToSt(4));
            var total = Number(txtQuantityValue) * Number(txtPriceValue);
            $("#txtTotal" + cnt).val(total.RoundToSt(2));
            var totalAfterVat = Number(vatAmount) + Number(total);
            $("#txtTotAfterTax" + cnt).val(totalAfterVat.RoundToSt(2));
            ComputeTotals();
        });
        $("#txtUnitpriceWithVat" + cnt).on('keyup', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
            var SalesPrice = Number($("#txtUnitpriceWithVat" + cnt).val());
            var GetUnitprice = Get_PriceWithVAT(SalesPrice, VatPrc, true);
            //$("#txtUnitpriceWithVat" + cnt).val(GetUnitprice.unitpricewithvat)
            $("#txtPrice" + cnt).val(GetUnitprice.unitprice);
            var txtQuantityValue = $("#txtQuantity" + cnt).val();
            var txtPriceValue = $("#txtPrice" + cnt).val();
            var total = Number(txtQuantityValue) * Number(txtPriceValue);
            var vatAmount = Number(total) * VatPrc / 100;
            $("#txtTax" + cnt).val(vatAmount.RoundToSt(4));
            var total = Number(txtQuantityValue) * Number(txtPriceValue);
            $("#txtTotal" + cnt).val(total.RoundToSt(2));
            var totalAfterVat = Number(vatAmount) + Number(total);
            $("#txtTotAfterTax" + cnt).val(totalAfterVat.RoundToSt(2));
            ComputeTotals();
        });
        $("#btn_minus" + cnt).on('click', function () {
            DeleteRow(cnt);
        });
        if (SysSession.CurrentPrivileges.Remove) {
            $("#btn_minus" + cnt).removeClass("display_none");
            $("#btn_minus" + cnt).removeAttr("disabled");
        }
        else {
            $("#btn_minus" + cnt).addClass("display_none");
            $("#btn_minus" + cnt).attr("disabled", "disabled");
        }
        if (Show == true) {
            // disabled
            //debugger;
            $("#ddlItem" + cnt).attr("disabled", "disabled");
            $("#txtQuantity" + cnt).attr("disabled", "disabled");
            $("#txtPrice" + cnt).attr("disabled", "disabled");
            $("#txtUnitpriceWithVat" + cnt).attr("disabled", "disabled");
            $("#txtReturnQuantity" + cnt).attr("disabled", "disabled");
            $("#txtTotal" + cnt).attr("disabled", "disabled");
            $("#txtTax" + cnt).attr("disabled", "disabled");
            $("#txtTotAfterTax" + cnt).attr("disabled", "disabled");
            $("#txtTax_Rate" + cnt).attr("disabled", "disabled");
            $('.btn-number1' + cnt).attr("disabled", "disabled");
            $('.input-number1' + cnt).attr("disabled", "disabled");
            $('.btn-number2' + cnt).attr("disabled", "disabled");
            $('.input-number2' + cnt).attr("disabled", "disabled");
            $('.btn-number3' + cnt).attr("disabled", "disabled");
            $('.input-number3' + cnt).attr("disabled", "disabled");
            $("#btnAddDetails").addClass("display_none");
            $("#btn_minus" + cnt).addClass("display_none");
            $("#btn_minus" + cnt).attr("disabled", "disabled");
            //bind Data
            $("#txt_StatusFlag" + cnt).val("");
            $("#txtSerial" + cnt).val(SlsInvoiceItemsDetails[cnt].Serial);
            $("#ddlItem" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].ItemID.toString());
            $("#txtQuantity" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].SoldQty);
            $("#txtPrice" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].Unitprice);
            $("#txtReturnQuantity" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].TotRetQty);
            if (SlsInvoiceItemsDetails[cnt].UnitpriceWithVat == null || SlsInvoiceItemsDetails[cnt].UnitpriceWithVat == 0) {
                var GetUnitprice = Get_PriceWithVAT(SlsInvoiceItemsDetails[cnt].Unitprice, SlsInvoiceItemsDetails[cnt].VatPrc, false);
                $("#txtUnitpriceWithVat" + cnt).prop("value", GetUnitprice.unitpricewithvat);
            }
            else {
                $("#txtUnitpriceWithVat" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].UnitpriceWithVat);
            }
            //$("#txtReturnQuantity" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].InvoiceSoldQty);
            $("#txtTotal" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].ItemTotal.RoundToSt(2));
            $("#txtTax" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].VatAmount.RoundToSt(4));
            $("#txtTax_Rate" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].VatPrc);
            $("#txtTotAfterTax" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].NetAfterVat.RoundToSt(2));
            $("#InvoiceItemID" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].InvoiceItemID);
        }
        $("#btn_minus" + cnt).click(function (e) {
            DeleteRow(cnt);
        });
        return;
    }
    function checkRepeatedItems(itemValue, NumberRowid) {
        //debugger
        var items = Number(CountGrid);
        var flag = false;
        for (var i = 0; i < items - 1; i++) {
            if (NumberRowid.toString() != "") {
                if (Number($("#ddlItem" + i).val()) == itemValue && Number($("#InvoiceItemID" + i).val()) != NumberRowid) {
                    flag = true;
                }
            }
            else {
                if (Number($("#ddlItem" + i).val()) == itemValue) {
                    flag = true;
                }
            }
        }
        return flag;
    }
    function ComputeTotals() {
        PackageCount = 0;
        CountTotal = 0;
        TaxCount = 0;
        NetCount = 0;
        for (var i = 0; i < CountGrid; i++) {
            var flagvalue = $("#txt_StatusFlag" + i).val();
            if (flagvalue != "d") {
                PackageCount += Number($("#txtQuantity" + i).val());
                PackageCount = Number(PackageCount.RoundToSt(2).toString());
                CountTotal += Number($("#txtTotal" + i).val());
                CountTotal = Number(CountTotal.RoundToSt(2).toString());
                TaxCount += Number($("#txtTax" + i).val());
                TaxCount = Number(TaxCount.RoundToSt(4).toString());
                NetCount += Number($("#txtTotAfterTax" + i).val());
                NetCount = Number(NetCount.RoundToSt(5).toString());
            }
        }
        //// Display in footer 
        txtItemCount.value = CountItems.toString();
        txtPackageCount.value = PackageCount.toString();
        txtTotal.value = CountTotal.toString();
        txtTax.value = TaxCount.toString();
        NetCount = (Number(txtTotal.value) + Number(txtTax.value));
        txtNet.value = (NetCount - commissionCount).RoundToSt(4);
        txtCommission.value = commissionCount.toString();
    }
    function DeleteRow(RecNo) {
        if (!SysSession.CurrentPrivileges.Remove)
            return;
        WorningMessage("هل تريد الحذف؟", "Do you want to delete?", "تحذير", "worning", function () {
            $("#txt_StatusFlag" + RecNo).val() == 'i' ? $("#txt_StatusFlag" + RecNo).val('m') : $("#txt_StatusFlag" + RecNo).val('d');
            CountItems = CountItems - 1;
            ComputeTotals();
            txtItemCount.value = CountItems.toString();
            $("#ddlItem" + RecNo).val("99");
            $("#txtQuantity" + RecNo).val("1");
            $("#txtPrice" + RecNo).val("1");
            $("#txtUnitpriceWithVat" + RecNo).val("1");
            $("#No_Row" + RecNo).attr("hidden", "true");
        });
        Insert_Serial();
    }
    function AddNewRow() {
        if (SysSession.CurrentEnvironment.InvoiceTransCode == 1) {
            if (ddlInvoiceCustomer.selectedIndex == 0 && SysSession.CurrentEnvironment.InvoiceTransCode == 1) { //علي الحساب  
                DisplayMassage(" برجاء اختيار العميل", "Please select a customer", MessageType.Worning);
                Errorinput(ddlInvoiceCustomer);
                return false;
            }
        }
        else {
            if (ddlType.value == "0" && ddlInvoiceCustomer.selectedIndex == 0) { //علي الحساب  
                DisplayMassage(" برجاء اختيار العميل", "Please select a customer", MessageType.Worning);
                Errorinput(ddlInvoiceCustomer);
                return false;
            }
        }
        if (!SysSession.CurrentPrivileges.AddNew)
            return;
        var CanAdd = true;
        if (CountGrid > 0) {
            var LastRowNo = CountGrid - 1;
            CanAdd = Validation_Grid(LastRowNo);
        }
        if (CanAdd) {
            Show = false;
            CountItems = CountItems + 1;
            txtItemCount.value = CountItems.toString();
            BuildControls(CountGrid);
            $("#txt_StatusFlag" + CountGrid).val("i");
            $("#ddlItem" + CountGrid).removeAttr("disabled");
            $("#txtQuantity" + CountGrid).removeAttr("disabled");
            $("#txtPrice" + CountGrid).removeAttr("disabled");
            $("#txtUnitpriceWithVat" + CountGrid).removeAttr("disabled");
            $("#txtReturnQuantity" + CountGrid).attr("disabled", "disabled");
            $("#btn_minus" + CountGrid).removeClass("display_none");
            $("#btn_minus" + CountGrid).removeAttr("disabled");
            CountGrid++;
            Insert_Serial();
        }
    }
    function Insert_Serial() {
        var Chack_Flag = false;
        var flagval = "";
        var Ser = 1;
        for (var i = 0; i < CountGrid; i++) {
            flagval = $("#txt_StatusFlag" + i).val();
            if (flagval != "d" && flagval != "m") {
                $("#txtSerial" + i).val(Ser);
                Ser++;
            }
            if (flagval == 'd' || flagval == 'm') {
                Chack_Flag = true;
            }
            if (Chack_Flag) {
                if ($("#txt_StatusFlag" + i).val() != 'i' && $("#txt_StatusFlag" + i).val() != 'm' && $("#txt_StatusFlag" + i).val() != 'd') {
                    $("#txt_StatusFlag" + i).val('u');
                }
            }
        }
    }
    //------------------------------------------------------ main Functions Region -----------------------------------
    function Assign() {
        var StatusFlag;
        InvoiceModel = new I_Sls_TR_Invoice();
        InvoiceItemsDetailsModel = new Array();
        List_MinUnitPrice = new Array();
        InvoiceModel.CustomerName = txtInvoiceCustomerName.value;
        if ($("#txtCardMoney").val() != "")
            InvoiceModel.CardAmount = Number($("#txtCardMoney").val());
        if ($("#txtCashMoney").val() != "")
            InvoiceModel.CashAmount = Number($("#txtCashMoney").val());
        if (ddlInvoiceCustomer.value != "null") {
            InvoiceModel.CustomerId = Number(ddlInvoiceCustomer.value);
            var custid = Number(ddlInvoiceCustomer.value);
            var custList = CustomerDetails.filter(function (s) { return s.CustomerId == custid; });
            InvoiceModel.CustomerName = custList[0].NAMEA;
        }
        else {
            InvoiceModel.CustomerId = null;
        }
        InvoiceModel.CompCode = Number(compcode);
        InvoiceModel.BranchCode = Number(BranchCode);
        InvoiceModel.TrType = 0; //0 invoice 1 return
        InvoiceModel.SlsInvSrc = 2; // 1 from store 2 from van 
        InvoiceModel.SlsInvType = 1; //  retail 
        InvoiceModel.OperationId = OperaID;
        InvoiceModel.CashBoxID = null;
        InvoiceModel.RefTrID = null;
        InvoiceModel.SalesmanId = Number(ddlSalesman.value);
        InvoiceModel.NetAfterVat = NetCount;
        InvoiceModel.TotalAmount = Number(txtTotal.value);
        InvoiceModel.TrDate = txtInvoiceDate.value;
        InvoiceModel.RefNO = txtRefNo.value;
        InvoiceModel.SalesPersonId = Number(ddlSalesPerson.value);
        InvoiceModel.Remark = txtRemarks.value;
        //------------------------------------------------------
        InvoiceModel.AllowVatNatID = null;
        InvoiceModel.ChargeVatNatID = null;
        InvoiceModel.ItemTotal = Number(txtTotal.value);
        InvoiceModel.ItemAllowTotal = null;
        InvoiceModel.ItemDiscountTotal = null;
        InvoiceModel.ItemVatTotal = Number(txtTax.value);
        InvoiceModel.RoundingAmount = 0;
        //----------------------------------------------------- 
        InvoiceModel.CommitionAmount = Number(txtCommission.value);
        InvoiceModel.VatType = vatType;
        InvoiceModel.VatAmount = Number(txtTax.value);
        MasterDetailsModel.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
        MasterDetailsModel.UserCode = SysSession.CurrentEnvironment.UserCode;
        MasterDetailsModel.CompName = SysSession.CurrentEnvironment.CompanyNameAr;
        MasterDetailsModel.VatNo = SysSession.CurrentEnvironment.VatNo;
        InvoiceModel.VatType = vatType;
        InvoiceModel.VatAmount = Number(txtTax.value);
        InvoiceModel.CommitionAmount = Number(txtCommission.value);
        if (SysSession.CurrentEnvironment.InvoiceTransCode == 3) {
            if ((Number(ddlInvoiceCustomer.value) == 0 || ddlInvoiceCustomer.value == null || ddlInvoiceCustomer.value == "null")) {
                InvoiceModel.InvoiceTransCode = 2;
            }
            else {
                InvoiceModel.InvoiceTransCode = 1;
            }
        }
        else {
            InvoiceModel.InvoiceTransCode = SysSession.CurrentEnvironment.InvoiceTransCode;
        }
        if (ddlType.value == "0") {
            InvoiceModel.IsCash = false;
        }
        else {
            InvoiceModel.IsCash = true;
        }
        if (chkActive.checked == true) {
            InvoiceModel.Status = 1;
        }
        else {
            InvoiceModel.Status = 0;
        }
        // Details
        for (var i = 0; i < CountGrid; i++) {
            invoiceItemSingleModel = new I_Sls_TR_InvoiceItems();
            StatusFlag = $("#txt_StatusFlag" + i).val();
            invoiceItemSingleModel.Name_Item = $("#ddlItem" + i + " option:selected").text();
            invoiceItemSingleModel.MinUnitPrice = Number($('option:selected', $("#ddlItem" + i)).attr('data-MinUnitPrice'));
            if (Number($("#txtPrice" + i).val()) < Number($('option:selected', $("#ddlItem" + i)).attr('data-MinUnitPrice'))) {
                List_MinUnitPrice.push(invoiceItemSingleModel);
                Validation_Insert = 1;
            }
            if (StatusFlag == "i") {
                invoiceItemSingleModel.InvoiceItemID = 0;
                invoiceItemSingleModel.ItemID = $("#ddlItem" + i).val();
                invoiceItemSingleModel.SoldQty = $('#txtQuantity' + i).val();
                invoiceItemSingleModel.StockSoldQty = $('#txtQuantity' + i).val(); //
                invoiceItemSingleModel.NetUnitPrice = $("#txtPrice" + i).val();
                invoiceItemSingleModel.Unitprice = $("#txtPrice" + i).val();
                invoiceItemSingleModel.UnitpriceWithVat = $("#txtUnitpriceWithVat" + i).val();
                VatPrc = $("#txtTax_Rate" + i).val();
                var VatNatID = Number($("#txtTax_Rate" + i).attr('data-VatNatID'));
                invoiceItemSingleModel.VatPrc = VatPrc;
                //-----------------------------------------------------
                invoiceItemSingleModel.Serial = $("#txtSerial" + i).val();
                invoiceItemSingleModel.UomID = 1; //----------->
                invoiceItemSingleModel.VatNatID = VatNatID; //----------->
                invoiceItemSingleModel.NetUnitPriceWithVat = $("#txtUnitpriceWithVat" + i).val();
                invoiceItemSingleModel.BaseQty = 1;
                invoiceItemSingleModel.BaseQtyPrice = $("#txtPrice" + i).val();
                invoiceItemSingleModel.BaseQtyUomid = 1; //----------->
                invoiceItemSingleModel.ChargeVatNatID = null;
                invoiceItemSingleModel.DiscountVatNatID = null;
                invoiceItemSingleModel.ChargeCode = null;
                //-----------------------------------------------------
                invoiceItemSingleModel.ItemTotal = invoiceItemSingleModel.Unitprice * invoiceItemSingleModel.SoldQty;
                invoiceItemSingleModel.VatAmount = invoiceItemSingleModel.ItemTotal * invoiceItemSingleModel.VatPrc / 100;
                invoiceItemSingleModel.TotRetQty = $("#txtReturnQuantity" + i).val();
                invoiceItemSingleModel.StatusFlag = StatusFlag.toString();
                invoiceItemSingleModel.StockUnitCost = Number($("#UnitCost" + i).val());
                InvoiceItemsDetailsModel.push(invoiceItemSingleModel);
            }
            if (StatusFlag == "u") {
                var invoiceItemId = $("#InvoiceItemID" + i).val();
                invoiceItemSingleModel.InvoiceItemID = invoiceItemId;
                invoiceItemSingleModel.ItemID = $("#ddlItem" + i).val();
                invoiceItemSingleModel.StatusFlag = StatusFlag.toString();
                invoiceItemSingleModel.SoldQty = $('#txtQuantity' + i).val();
                invoiceItemSingleModel.StockSoldQty = $('#txtQuantity' + i).val(); //
                invoiceItemSingleModel.TotRetQty = $('#txtReturnQuantity' + i).val();
                invoiceItemSingleModel.NetUnitPrice = $("#txtPrice" + i).val();
                invoiceItemSingleModel.Unitprice = $("#txtPrice" + i).val();
                invoiceItemSingleModel.UnitpriceWithVat = $("#txtUnitpriceWithVat" + i).val();
                VatPrc = $("#txtTax_Rate" + i).val();
                var VatNatID = Number($("#txtTax_Rate" + i).attr('data-VatNatID'));
                invoiceItemSingleModel.VatPrc = VatPrc;
                //-----------------------------------------------------
                invoiceItemSingleModel.Serial = $("#txtSerial" + i).val();
                invoiceItemSingleModel.UomID = 1; //----------->
                invoiceItemSingleModel.VatNatID = VatNatID; //----------->
                invoiceItemSingleModel.NetUnitPriceWithVat = $("#txtUnitpriceWithVat" + i).val();
                invoiceItemSingleModel.BaseQty = 1;
                invoiceItemSingleModel.BaseQtyPrice = $("#txtPrice" + i).val();
                invoiceItemSingleModel.BaseQtyUomid = 1; //----------->
                invoiceItemSingleModel.ChargeVatNatID = null;
                invoiceItemSingleModel.DiscountVatNatID = null;
                invoiceItemSingleModel.ChargeCode = null;
                //-----------------------------------------------------
                invoiceItemSingleModel.ItemTotal = invoiceItemSingleModel.Unitprice * invoiceItemSingleModel.SoldQty;
                invoiceItemSingleModel.VatAmount = invoiceItemSingleModel.ItemTotal * invoiceItemSingleModel.VatPrc / 100;
                invoiceItemSingleModel.NetAfterVat = invoiceItemSingleModel.ItemTotal + invoiceItemSingleModel.VatAmount;
                invoiceItemSingleModel.StockUnitCost = Number($("#UnitCost" + i).val());
                InvoiceItemsDetailsModel.push(invoiceItemSingleModel);
            }
            if (StatusFlag == "d") {
                if ($("#InvoiceItemID" + i).val() != "") {
                    var deletedID = $("#InvoiceItemID" + i).val();
                    invoiceItemSingleModel.StatusFlag = StatusFlag.toString();
                    invoiceItemSingleModel.InvoiceItemID = deletedID;
                    InvoiceItemsDetailsModel.push(invoiceItemSingleModel);
                }
            }
        }
        MasterDetailsModel.I_Sls_TR_Invoice = InvoiceModel;
        MasterDetailsModel.I_Sls_TR_InvoiceItems = InvoiceItemsDetailsModel;
    }
    function Update() {
        MasterDetailsModel.I_Sls_TR_Invoice.TrNo = Number(lblInvoiceNumber.innerText);
        MasterDetailsModel.I_Sls_TR_Invoice.InvoiceID = GlobalinvoiceID;
        MasterDetailsModel.I_Sls_TR_Invoice.CreatedAt = $('#txtCreatedAt').val();
        MasterDetailsModel.I_Sls_TR_Invoice.CreatedBy = $('#txtCreatedBy').val();
        MasterDetailsModel.I_Sls_TR_Invoice.UpdatedBy = SysSession.CurrentEnvironment.UserCode;
        MasterDetailsModel.I_Sls_TR_Invoice.UpdatedAt = DateTimeFormat(Date().toString());
        MasterDetailsModel.I_Sls_TR_Invoice.TrTime = InvoiceStatisticsModel[0].TrTime;
        InvoiceModel.DocNo = InvoiceStatisticsModel[0].DocNo;
        InvoiceModel.TrTime = InvoiceStatisticsModel[0].TrTime;
        InvoiceModel.DocUUID = InvoiceStatisticsModel[0].DocUUID;
        if (ddlOPerationMaster.value.trim() != "")
            MasterDetailsModel.I_Sls_TR_Invoice.OperationId = OperaID;
        else
            MasterDetailsModel.I_Sls_TR_Invoice.OperationId = OperaID;
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("OperationInvoice", "updateProcessInvoiceMasterDetail"),
            data: JSON.stringify(MasterDetailsModel),
            success: function (d) {
                var result = d;
                if (result.IsSuccess == true) {
                    var res = result.Response;
                    DisplayMassage('( تم تعديل الفاتورة بنجاح )', 'The invoice has been successfully modified', MessageType.Succeed);
                    GlobalinvoiceID = res.InvoiceID;
                    AfterInsertOrUpdateFlag = true;
                    InitializeGrid();
                    Grid_RowDoubleClicked();
                    if (res.Status == 1) {
                        DownloadInvoicePdf();
                        Save_Succ_But();
                    }
                }
                else {
                    DisplayMassage('( هناك خطـأ)', '(Error)', MessageType.Error);
                }
            }
        });
    }
    function Insert() {
        InvoiceModel.CreatedAt = DateTimeFormat(Date().toString());
        InvoiceModel.CreatedBy = SysSession.CurrentEnvironment.UserCode;
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("OperationInvoice", "InsertProcessInvoiceMasterDetail"),
            data: JSON.stringify(MasterDetailsModel),
            success: function (d) {
                var result = d;
                if (result.IsSuccess == true) {
                    var res = result.Response;
                    DisplayMassage(" تم اصدار  فاتورة رقم  " + res.TrNo + " ", "Succeed", MessageType.Succeed);
                    lblInvoiceNumber.innerText = res.TrNo.toString();
                    GlobalinvoiceID = res.InvoiceID;
                    AfterInsertOrUpdateFlag = true;
                    InitializeGrid();
                    Grid_RowDoubleClicked();
                    $("#btnUpdate").removeClass("display_none");
                    if (res.Status == 1) {
                        DownloadInvoicePdf();
                        Save_Succ_But();
                    }
                }
                else {
                    DisplayMassage("خطأ", "Error", MessageType.Error);
                }
            }
        });
    }
    function openInvoice() {
        if (!CheckPeriodDate(txtInvoiceDate.value, "I")) {
            debugger;
            DisplayMassage("لا يمكنك الاضافه او التعديل في هذة الفتره المغلقه ", "Please select a Invoice data", MessageType.Error);
            Errorinput(txtInvoiceDate);
            chkActive.checked = true;
            return false;
        }
        Assign();
        MasterDetailsModel.I_Sls_TR_Invoice.TrNo = Number(lblInvoiceNumber.innerText);
        MasterDetailsModel.I_Sls_TR_Invoice.InvoiceID = GlobalinvoiceID;
        MasterDetailsModel.I_Sls_TR_Invoice.CreatedAt = $('#txtCreatedAt').val();
        MasterDetailsModel.I_Sls_TR_Invoice.CreatedBy = $('#txtCreatedBy').val();
        MasterDetailsModel.I_Sls_TR_Invoice.UpdatedBy = SysSession.CurrentEnvironment.UserCode;
        MasterDetailsModel.I_Sls_TR_Invoice.UpdatedAt = DateTimeFormat(Date().toString());
        MasterDetailsModel.I_Sls_TR_Invoice.TrTime = InvoiceStatisticsModel[0].TrTime;
        InvoiceModel.DocNo = InvoiceStatisticsModel[0].DocNo;
        InvoiceModel.TrTime = InvoiceStatisticsModel[0].TrTime;
        InvoiceModel.DocUUID = InvoiceStatisticsModel[0].DocUUID;
        if (ddlOPerationMaster.value.trim() != "")
            MasterDetailsModel.I_Sls_TR_Invoice.OperationId = OperaID;
        else
            MasterDetailsModel.I_Sls_TR_Invoice.OperationId = OperaID;
        MasterDetailsModel.I_Sls_TR_Invoice.Status = 0;
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("OperationInvoice", "Open"),
            data: JSON.stringify(MasterDetailsModel),
            success: function (d) {
                var result = d;
                if (result.IsSuccess == true) {
                    chkActive.disabled = true;
                    $('#btnUpdate').prop("disabled", false);
                    var res = result.Response;
                    GlobalinvoiceID = res.InvoiceID;
                    AfterInsertOrUpdateFlag = true;
                    InitializeGrid();
                    Grid_RowDoubleClicked();
                }
                else {
                    btnUpdate.disabled = true;
                }
            }
        });
    }
    //-----------------------------------------------Enable && Disable Controls-------------------------
    function EnableControls() {
        $("#DivInvoiceDetails :input").removeAttr("disabled");
        $("#DivInvoiceDetails").removeClass("display_none");
        $("#btnSave").removeClass("display_none");
        $("#btnBack").removeClass("display_none");
        $("#DivFilter").addClass("disabledDiv");
        $("#divShow").addClass("disabledDiv");
        $("#div_btnPrint").addClass("display_none");
        $("#div_btnUpdate").removeClass("display_none");
        $("#btnUpdate").addClass("display_none");
        $("#btnAddDetails").removeClass("display_none");
        for (var i = 0; i < CountGrid; i++) {
            $("#ddlItem" + i).removeAttr("disabled");
            $("#txtQuantity" + i).removeAttr("disabled");
            $("#txtReturnQuantity" + i).attr("disabled", "disabled");
            $("#txtTotal" + i).attr("disabled", "disabled");
            $("#txtTax" + i).attr("disabled", "disabled");
            $("#txtTotAfterTax" + i).attr("disabled", "disabled");
            $("#txtTax_Rate" + i).attr("disabled", "disabled");
            $('.btn-number1' + i).removeAttr("disabled");
            $('.input-number1' + i).removeAttr("disabled");
            $('.btn-number2' + i).removeAttr("disabled");
            $('.input-number2' + i).removeAttr("disabled");
            $('.btn-number3' + i).removeAttr("disabled");
            $('.input-number3' + i).removeAttr("disabled");
            $("#btn_minus" + i).removeClass("display_none");
            if (flag_PriceWithVAT == true) {
                $("#txtUnitpriceWithVat" + i).removeAttr("disabled");
                $("#txtPrice" + i).attr("disabled", "disabled");
            }
            else {
                $("#txtPrice" + i).removeAttr("disabled");
                $("#txtUnitpriceWithVat" + i).attr("disabled", "disabled");
            }
        }
        $('#txtCreatedBy').prop("disabled", "disabled");
        $('#txtCreatedAt').prop("disabled", "disabled");
        $('#txtUpdatedAt').prop("disabled", "disabled");
        $('#txtUpdatedBy').prop("disabled", "disabled");
        txtItemCount.disabled = true;
        txtPackageCount.disabled = true;
        txtTotal.disabled = true;
        txtTax.disabled = true;
        txtNet.disabled = true;
        txtCommission.disabled = false;
        txtRefNo.disabled = false;
        ddlSalesPerson.disabled = false;
        txtRemarks.disabled = false;
        SysSession.CurrentEnvironment.I_Control[0].IvoiceDateEditable == true ? $('#txtInvoiceDate').removeAttr("disabled") : $('#txtInvoiceDate').attr("disabled", "disabled");
    }
    function DisableControls() {
        $("#DivInvoiceDetails :input").attr("disabled", "disabled");
        $("#DivInvoiceDetails").removeClass("display_none");
        $("#btnSave").addClass("display_none");
        $("#btnBack").addClass("display_none");
        $("#div_btnUpdate").removeClass("display_none");
        $("#btnUpdate").removeClass("display_none");
        $("#div_btnPrint").removeClass("display_none");
        $('#btnPrintTransaction').prop("disabled", false);
        $('#btnPrintslip').prop("disabled", false);
        $('#btnShowPrint').prop("disabled", false);
        $("#DivFilter").removeClass("disabledDiv");
        $("#divShow").removeClass("disabledDiv");
        $("#divShow").removeClass("display_none");
        $("#btnAddDetails").addClass("display_none");
        for (var i = 0; i < CountGrid; i++) {
            $("#ddlItem" + i).attr("disabled", "disabled");
            $("#txtQuantity" + i).attr("disabled", "disabled");
            $("#txtPrice" + i).attr("disabled", "disabled");
            $("#txtUnitpriceWithVat" + i).attr("disabled", "disabled");
            $("#txtReturnQuantity" + i).attr("disabled", "disabled");
            $("#txtTotal" + i).attr("disabled", "disabled");
            $("#txtTax" + i).attr("disabled", "disabled");
            $("#txtTotAfterTax" + i).attr("disabled", "disabled");
            $('.btn-number1' + i).attr("disabled", "disabled");
            $('.input-number1' + i).attr("disabled", "disabled");
            $('.btn-number2' + i).attr("disabled", "disabled");
            $('.input-number2' + i).attr("disabled", "disabled");
            $('.btn-number3' + i).attr("disabled", "disabled");
            $('.input-number3' + i).attr("disabled", "disabled");
            $("#btn_minus" + i).addClass("display_none");
        }
        $('#txtCreatedBy').prop("disabled", "disabled");
        $('#txtCreatedAt').prop("disabled", "disabled");
        $('#txtUpdatedAt').prop("disabled", "disabled");
        $('#txtUpdatedBy').prop("disabled", "disabled");
        txtItemCount.disabled = true;
        txtPackageCount.disabled = true;
        txtTotal.disabled = true;
        txtTax.disabled = true;
        txtNet.disabled = true;
        txtCommission.disabled = true;
        txtRefNo.disabled = true;
        ddlSalesPerson.disabled = true;
        txtRemarks.disabled = true;
    }
    //------------------------------------------------------Poup_Pass------------------------
    function Open_poup_Pass() {
        $('#popu_Passowrd').attr('style', 'display:block;');
        $('#popu_Passowrd').attr('class', 'popu animated zoomInLeft');
        txt_ApprovePass.value = "";
        $("#Popup_Passowrd").modal("show");
        var Ul_List = document.getElementById('Ul_List_MinUnitPrice');
        Ul_List.innerHTML = '';
        for (var i = 0; i < List_MinUnitPrice.length; i++) {
            var li_List_MinUnitPrice = document.createElement('li');
            li_List_MinUnitPrice.setAttribute('id', 'li_List_MinUnitPrice' + i);
            li_List_MinUnitPrice.setAttribute('class', 'st_border_li_List_MinUnitPrice');
            Ul_List.appendChild(li_List_MinUnitPrice);
            var id_List = document.getElementById('li_List_MinUnitPrice' + i);
            id_List.innerHTML = '-( ' + List_MinUnitPrice[i].Name_Item + " )" + (lang == "ar" ? "السعر" : "Price") + " (" + List_MinUnitPrice[i].Unitprice + ") " + (lang == "ar" ? "الحد" : "Limit") + " (0" + List_MinUnitPrice[i].MinUnitPrice + '0)';
        }
    }
    function btn_Approveprice_onclick() {
        ////debugger;
        if (txt_ApprovePass.value == SysSession.CurrentEnvironment.I_Control[0].ExceedMinPricePassword) {
            if (editOrAddFlag == 2) {
                Update();
            }
            else if (editOrAddFlag == 1) {
                Insert();
            }
            BindStatisticGridData();
            $('#condtionbtn1').removeClass("col-lg-10");
            $('#condtionbtn1').addClass("col-lg-8");
            $('#condtionbtn2').removeClass("col-lg-2");
            $('#condtionbtn2').addClass("col-lg-4");
            $('#popu_Passowrd').attr('style', 'display:none;');
            $('#popu_Passowrd').attr('class', 'popu animated zoomOut');
            txt_ApprovePass.value = "";
            $("#Popup_Passowrd").modal("hide");
            Validation_Insert = 0;
        }
        else {
            DisplayMassage('لايمكن اعتماد الفاتورة', '(Error)', MessageType.Error);
            txt_ApprovePass.value = "";
            btn_Exit_Approveprice_onclick();
        }
    }
    function btn_Exit_Approveprice_onclick() {
        $('#popu_Passowrd').attr('style', 'display:none;');
        $('#popu_Passowrd').attr('class', 'popu animated zoomOut');
        txt_ApprovePass.value = "";
        $("#Popup_Passowrd").modal("hide");
        Validation_Insert = 0;
    }
    //------------------------------------------------------Print Region------------------------
    function PrintReport(OutType) {
        ////debugger;
        if (!SysSession.CurrentPrivileges.PrintOut)
            return;
        var rp = new ReportParameters();
        rp.RepType = OutType; //output report as View
        rp.FromDate = DateFormatRep(txtStartDate.value);
        rp.ToDate = DateFormatRep(txtEndDate.value);
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
        if (ddlSalesmanFilter.selectedIndex > 0) {
            rp.SalesmanID = Number($("#ddlSalesmanFilter").val());
        }
        else {
            rp.SalesmanID = -1;
        }
        if ($("#ddlCustomer").val() == "null") {
            rp.CustomerID = -1;
        }
        else {
            rp.CustomerID = Number($("#ddlCustomer").val());
        }
        if ($("#ddlOPerationMaster").val().trim() == "") {
            rp.OperationId = -1;
        }
        else {
            rp.OperationId = Number(OperaID);
        }
        rp.CashType = Number($("#ddlInvoiceType").val());
        rp.Status = Number($("#ddlStateType").val());
        rp.TrType = 0;
        rp.src = 2;
        Ajax.Callsync({
            url: Url.Action("IProc_Rpt_operationInvoiceList", "GeneralReports"),
            data: rp,
            success: function (d) {
                var result = d.result;
                window.open(result, "_blank");
            }
        });
    }
    ProcSalesMgr.PrintReport = PrintReport;
    function PrintTransaction() {
        if (!SysSession.CurrentPrivileges.PrintOut)
            return;
        var rp = new ReportParameters();
        rp.Type = 4;
        rp.Repdesign = 0;
        rp.TRId = GlobalinvoiceID;
        rp.slip = 0;
        rp.Name_function = "Prnt_OperationInvoice";
        localStorage.setItem("Report_Data", JSON.stringify(rp));
        localStorage.setItem("result", '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>');
        window.open(Url.Action("ReportsPopup", "Home"), "_blank");
    }
    function btnPrintInvoicePrice_onclick() {
        ////debugger
        if (!SysSession.CurrentPrivileges.PrintOut)
            return;
        var rp = new ReportParameters();
        rp.Type = 0;
        rp.FromDate = DateFormatRep(txtStartDate.value);
        rp.ToDate = DateFormatRep(txtEndDate.value);
        if (ddlSalesmanFilter.selectedIndex > 0) {
            rp.SalesmanID = Number($("#ddlSalesmanFilter").val());
        }
        else {
            rp.SalesmanID = -1;
        }
        if ($("#ddlCustomer").val() == "null") {
            rp.CustomerID = -1;
        }
        else {
            rp.CustomerID = Number($("#ddlCustomer").val());
        }
        rp.CashType = Number($("#ddlInvoiceType").val());
        rp.Status = Number($("#ddlStateType").val());
        rp.TrType = 0;
        rp.Typ = 1;
        rp.TRId = GlobalOperationID;
        rp.Name_function = "rptInvoiceNote";
        localStorage.setItem("Report_Data", JSON.stringify(rp));
        localStorage.setItem("result", '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>');
        window.open(Url.Action("ReportsPopup", "Home"), "_blank");
    }
    function btnPrintslip_onclick() {
        ////debugger;
        if (!SysSession.CurrentPrivileges.PrintOut)
            return;
        var rp = new ReportParameters();
        rp.CompCode = SysSession.CurrentEnvironment.CompCode;
        rp.BranchCode = SysSession.CurrentEnvironment.BranchCode;
        rp.CompNameA = SysSession.CurrentEnvironment.CompanyNameAr;
        rp.CompNameE = SysSession.CurrentEnvironment.CompanyName;
        rp.UserCode = SysSession.CurrentEnvironment.UserCode;
        rp.Tokenid = SysSession.CurrentEnvironment.Token;
        rp.ScreenLanguage = SysSession.CurrentEnvironment.ScreenLanguage;
        debugger;
        rp.SystemCode = SysSession.CurrentEnvironment.SystemCode;
        rp.SubSystemCode = SysSession.CurrentEnvironment.SubSystemCode;
        var BranchNameA = SysSession.CurrentEnvironment.BranchName;
        var BranchNameE = SysSession.CurrentEnvironment.BranchName;
        if (BranchNameA == null || BranchNameE == null) {
            BranchNameA = " ";
            BranchNameE = " ";
        }
        rp.BraNameA = BranchNameA;
        rp.BraNameE = BranchNameE;
        rp.Type = 4;
        rp.Repdesign = 0;
        rp.Typ = 0;
        rp.slip = 1;
        rp.TRId = GlobalinvoiceID;
        Ajax.CallAsync({
            url: Url.Action("Prnt_OperationInvoice", "GeneralReports"),
            data: rp,
            success: function (d) {
                var result = d.result;
                window.open(result, "_blank");
            }
        });
    }
    function DownloadInvoicePdf() {
        var rp = new ReportParameters();
        rp.CompCode = SysSession.CurrentEnvironment.CompCode;
        rp.BranchCode = SysSession.CurrentEnvironment.BranchCode;
        rp.CompNameA = SysSession.CurrentEnvironment.CompanyNameAr;
        rp.CompNameE = SysSession.CurrentEnvironment.CompanyName;
        rp.UserCode = SysSession.CurrentEnvironment.UserCode;
        rp.Tokenid = SysSession.CurrentEnvironment.Token;
        rp.ScreenLanguage = SysSession.CurrentEnvironment.ScreenLanguage;
        rp.SystemCode = SysSession.CurrentEnvironment.SystemCode;
        rp.SubSystemCode = SysSession.CurrentEnvironment.SubSystemCode;
        rp.DocPDFFolder = SysSession.CurrentEnvironment.I_Control[0].DocPDFFolder;
        var BranchNameA = SysSession.CurrentEnvironment.BranchName;
        var BranchNameE = SysSession.CurrentEnvironment.BranchName;
        if (BranchNameA == null || BranchNameE == null) {
            BranchNameA = " ";
            BranchNameE = " ";
        }
        rp.BraNameA = BranchNameA;
        rp.BraNameE = BranchNameE;
        rp.Type = 4;
        rp.Repdesign = 0;
        rp.TRId = GlobalinvoiceID;
        rp.slip = 0;
        Ajax.CallAsync({
            url: Url.Action("Prnt_OperationInvoice", "Reports_pdf"),
            data: rp,
            success: function (d) {
            }
        });
    }
})(ProcSalesMgr || (ProcSalesMgr = {}));
//# sourceMappingURL=ProcSalesMgr.js.map