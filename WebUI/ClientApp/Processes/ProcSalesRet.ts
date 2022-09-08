
$(document).ready(() => {
    ProcSalesRet.InitalizeComponent();
})

namespace ProcSalesRet {
    //system varables
    var SysSession: SystemSession = GetSystemSession(Modules.ProcSalesRet);
    var compcode: Number;
    var BranchCode: number;//SharedSession.CurrentEnvironment.BranchCode;
    var sys: SystemTools = new SystemTools();
    var vatType: number;

    //ddl
    var ddlCustomer: HTMLSelectElement;
    var ddlSalesMan: HTMLSelectElement;
    var ddlSalesPerson: HTMLSelectElement;
    var ddlSalesPersonFilter: HTMLSelectElement;
    var ddlStateType: HTMLSelectElement;
    var ddlInvoiceCustomer: HTMLSelectElement;
    var ddlFreeSalesman: HTMLSelectElement;
    var ddlReturnType: HTMLSelectElement;
    var ddlReturnTypeShow: HTMLSelectElement;
    var ddlTaxTypeHeader: HTMLSelectElement;
    var searchbutmemreport: HTMLInputElement;
    var ddlOPerationMaster: HTMLSelectElement;
    var txtOPerationDetail: HTMLInputElement;

    // Arrays
    var VendorDetails: Array<A_Rec_D_Customer> = new Array<A_Rec_D_Customer>();
    var ReturnDetailsAr: Array<string> = new Array<string>();
    var ReturnDetailsEn: Array<string> = new Array<string>();
    var AddReturnDetailsAr: Array<string> = new Array<string>();
    var AddReturnDetailsEn: Array<string> = new Array<string>();
    var StateDetailsAr: Array<string> = new Array<string>();
    var StateDetailsEn: Array<string> = new Array<string>();
    var SlsInvoiceStatisticsDetails: Array<IQ_GetSlsInvoiceStatisticVer2> = new Array<IQ_GetSlsInvoiceStatisticVer2>();
    var Selecteditem: Array<IQ_GetSlsInvoiceStatisticVer2> = new Array<IQ_GetSlsInvoiceStatisticVer2>();
    var SearchDetails: Array<IQ_GetSlsInvoiceStatisticVer2> = new Array<IQ_GetSlsInvoiceStatisticVer2>();
    var SlsInvoiceItemsDetails: Array<IQ_GetSlsInvoiceItem> = new Array<IQ_GetSlsInvoiceItem>();
    var operationDetails: Array<I_TR_Operation> = new Array<I_TR_Operation>();
    var operationDetailsWithoutStatus: Array<I_TR_Operation> = new Array<I_TR_Operation>();
    var ItemDetails: Array<IQ_GetOperationItemInfo_New> = new Array<IQ_GetOperationItemInfo_New>();
    var AD_VatTypeDetails: A_D_VAT_TYPE = new A_D_VAT_TYPE();
    var SalesmanDetails: Array<I_Sls_D_Salesman> = new Array<I_Sls_D_Salesman>();
    var VatDetails: Array<A_D_VAT_TYPE> = new Array<A_D_VAT_TYPE>();
    //Model
    var InvoiceStatisticsModel: Array<IQ_GetSlsInvoiceStatisticVer2> = new Array<IQ_GetSlsInvoiceStatisticVer2>();
    var InvoicemodelForReturn: Array<IQ_GetSlsInvoiceStatisticVer2> = new Array<IQ_GetSlsInvoiceStatisticVer2>();
    var MasterDetailModel: SlsInvoiceMasterDetails = new SlsInvoiceMasterDetails();
    var InvoiceModel: I_Sls_TR_Invoice = new I_Sls_TR_Invoice();
    var invoiceItemsModel: Array<I_Sls_TR_InvoiceItems> = new Array<I_Sls_TR_InvoiceItems>();
    var invoiceItemSingleModel: I_Sls_TR_InvoiceItems = new I_Sls_TR_InvoiceItems();

    //TextBoxes
    var txtStartDate: HTMLInputElement;
    var txtEndDate: HTMLInputElement;
    var txtItemCount: HTMLInputElement;
    var txtPackageCount: HTMLInputElement;
    var txtTotal: HTMLInputElement;
    var txtTax: HTMLInputElement;
    var txtNet: HTMLInputElement;
    var txtCashAmount: HTMLInputElement;
    var txtCashAmountLabel: HTMLLabelElement;
    var txtRefNo: HTMLInputElement;
    var txtRemarks: HTMLInputElement;
    var txtInvoiceDate: HTMLInputElement;
    var txtInvoiceNumber: HTMLInputElement;
    var lblReturnNumber: HTMLInputElement;

    //labels
    var txtOperationStatusMaster: HTMLInputElement;

    //checkbox
    var chkActive: HTMLInputElement;
    var chkOpenProcess: HTMLInputElement;

    //buttons 
    var btnShow: HTMLButtonElement;
    var btnAdd: HTMLButtonElement;
    var btnAddDetails: HTMLButtonElement;
    var btnBack: HTMLButtonElement;// 
    var btnSave: HTMLButtonElement;
    var btnProcessInvoiceSearch: HTMLButtonElement;
    var btnUpdate: HTMLButtonElement;
    //var btnAddFreeReturn: HTMLButtonElement;
    //print buttons 
    var btnPrintTrview: HTMLButtonElement;
    var btnPrintTrPDF: HTMLButtonElement;
    var btnPrintTrEXEL: HTMLButtonElement;
    var btnPrintTransaction: HTMLButtonElement;

    // giedView
    var Grid: JsGrid = new JsGrid();


    //global
    var operationGlobalID: number = 0;
    var CountGrid = 0;
    var CountItems: number = 0;
    var PackageCount: number = 0;
    var CountTotal: number = 0;
    var TaxCount: number = 0;
    var NetCount: number = 0;
    var VatPrc;
    var globalInvoiceID: number = 0;
    var RefTrID: number = 0;

    //flags
    var AddReturn: boolean = true;
    var Show: boolean = true;
    var EditFlag: boolean = false;
    var InsertFlag: boolean = false;
    var InvoiceFlag: boolean = false;
    var AfterInsertOrUpdateFlag: boolean = false;
    var FlagTochooseWhichOperationID: boolean = false;
  //  var btnPrint: HTMLInputElement;
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);
    var flag_PriceWithVAT = (SysSession.CurrentEnvironment.I_Control[0].OperationPriceWithVAT);

    //------------------------------------------------------ Main Region -----------------------------------
    export function InitalizeComponent() {
        // VatPrc 
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);
        InitalizeControls();
        chkOpenProcess.checked = true;
        InitializeEvents();
        fillddlCustomer();
        FillddlSalesMan();
        fillddlFreeSalesman();
        FillddlStateType();
        FillddlReturnType();
        FillddlTaxType();

        getAllOperations();
        fillddlOperation();
        vatType = SysSession.CurrentEnvironment.I_Control[0].DefSlsVatType;
        GetVatPercentage();
        $('#ddlStateType').prop("value", "2");
        $('#ddlReturnType').prop("value", "2");
        txtItemCount.value = CountItems.toString();
        txtPackageCount.value = PackageCount.toString();
        txtTotal.value = CountTotal.toString();
        txtTax.value = TaxCount.toString();
        txtNet.value = NetCount.toString();

        txtStartDate.value = DateStartMonth();
        txtEndDate.value = ConvertToDateDash(GetDate()) <= ConvertToDateDash(SysSession.CurrentEnvironment.EndDate) ? GetDate() : SysSession.CurrentEnvironment.EndDate;
    //    $('#btnPrint').addClass('display_none');   

        fillddlSalesPerson();

    }
    function InitalizeControls() {
        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = "مرتجع العمليات";
        }
        else {
            document.getElementById('Screen_name').innerHTML = "Review and Approve Invoices";
        }
        // Drop down lists
        ddlCustomer = document.getElementById("ddlCustomer") as HTMLSelectElement;
        ddlSalesMan = document.getElementById("ddlSalesMan") as HTMLSelectElement;
        ddlSalesPerson = document.getElementById("ddlSalesPerson") as HTMLSelectElement;
        ddlSalesPersonFilter = document.getElementById("ddlSalesPersonFilter") as HTMLSelectElement;
        ddlStateType = document.getElementById("ddlStateType") as HTMLSelectElement;
        ddlReturnType = document.getElementById("ddlReturnType") as HTMLSelectElement;
        ddlReturnTypeShow = document.getElementById("ddlReturnTypeShow") as HTMLSelectElement;
        ddlInvoiceCustomer = document.getElementById("ddlInvoiceCustomer") as HTMLSelectElement;
        ddlFreeSalesman = document.getElementById("ddlFreeSalesman") as HTMLSelectElement;
        ddlTaxTypeHeader = document.getElementById("ddlTaxTypeHeader") as HTMLSelectElement;
        ddlOPerationMaster = document.getElementById("ddlOPerationMaster") as HTMLSelectElement;

        txtOPerationDetail = document.getElementById("txtOPerationDetail") as HTMLInputElement;

        //TextBoxes
        searchbutmemreport = document.getElementById("searchbutmemreport") as HTMLInputElement;
        txtStartDate = document.getElementById("txtStartDate") as HTMLInputElement;
        txtEndDate = document.getElementById("txtEndDate") as HTMLInputElement;
        txtItemCount = document.getElementById("txtItemCount") as HTMLInputElement;
        txtPackageCount = document.getElementById("txtPackageCount") as HTMLInputElement;
        txtTotal = document.getElementById("txtTotal") as HTMLInputElement;
        txtTax = document.getElementById("txtTax") as HTMLInputElement;
        txtNet = document.getElementById("txtNet") as HTMLInputElement;
        txtInvoiceDate = document.getElementById("txtInvoiceDate") as HTMLInputElement;
        txtInvoiceNumber = document.getElementById("txtInvoiceNumber") as HTMLInputElement;
        lblReturnNumber = document.getElementById("lblReturnNumber") as HTMLInputElement;
        txtCashAmount = document.getElementById("txtCashAmount") as HTMLInputElement;
        txtCashAmountLabel = document.getElementById("txtCashAmountLabel") as HTMLLabelElement;
        txtRefNo= document.getElementById("txtRefNo") as HTMLInputElement;
        txtRemarks = document.getElementById("txtRemarks") as HTMLInputElement;


        //checkbox
        chkActive = document.getElementById("chkActive") as HTMLInputElement;
        chkOpenProcess = document.getElementById("chkOpenProcess") as HTMLInputElement;

        //button
        btnShow = document.getElementById("btnShow") as HTMLButtonElement;
        btnAdd = document.getElementById("btnAdd") as HTMLButtonElement;
        btnAddDetails = document.getElementById("btnAddDetails") as HTMLButtonElement;// btnBack btnSave
        btnBack = document.getElementById("btnBack") as HTMLButtonElement;
        btnSave = document.getElementById("btnSave") as HTMLButtonElement;
        btnProcessInvoiceSearch = document.getElementById("btnProcessInvoiceSearch") as HTMLButtonElement;
        btnUpdate = document.getElementById("btnUpdate") as HTMLButtonElement;
       // btnAddFreeReturn = document.getElementById("btnAddFreeReturn") as HTMLButtonElement;

        //print 
        btnPrintTrview = document.getElementById("btnPrintTrview") as HTMLButtonElement;
        btnPrintTrPDF = document.getElementById("btnPrintTrPDF") as HTMLButtonElement;
        btnPrintTrEXEL = document.getElementById("btnPrintTrEXEL") as HTMLButtonElement;
        btnPrintTransaction = document.getElementById("btnPrintTransaction") as HTMLButtonElement;
     //   btnPrint = document.getElementById("btnPrint") as HTMLInputElement;

        //labels
        txtOperationStatusMaster = document.getElementById("txtOperationStatusMaster") as HTMLInputElement;
    }
    function InitializeEvents() {
        chkActive.onclick = chkActive_onchecked;
        btnShow.onclick = btnShow_onclick;
        btnAdd.onclick = AddNewReturn_onclick;
        btnBack.onclick = btnBack_onclick;
        btnSave.onclick = btnSave_onclick;
        txtInvoiceNumber.onchange = txtInvoiceNumber_onchange;
        btnProcessInvoiceSearch.onclick = btnProcessInvoiceSearch_onclick;
       // btnAddFreeReturn.onclick = btnAddFreeReturn_onclick;
        btnUpdate.onclick = btnUpdate_onclick;
        ddlInvoiceCustomer.onchange = ddlInvoiceCustomer_onchange;
        ddlReturnTypeShow.onchange = ddlReturnTypeShow_onchange;
        ddlCustomer.onchange = ddlCustomer_onchange;
        //print
        btnPrintTrview.onclick = () => { PrintReport(1); }
        btnPrintTrPDF.onclick = () => { PrintReport(2); }
        btnPrintTrEXEL.onclick = () => { PrintReport(3); }
     //   btnPrint.onclick = () => { PrintReport(4); }
        btnPrintTransaction.onclick = PrintTransaction;
        searchbutmemreport.onkeyup = _SearchBox_Change;
        ddlSalesMan.onchange = ddlSalesman_onchange;
        chkOpenProcess.onclick = ddlSalesman_onchange;
        ddlOPerationMaster.onchange = ddlOPerationMaster_onchange;

    }
    function Check_on_user_type() {

        if (SysSession.CurrentEnvironment.UserType == 1 || SysSession.CurrentEnvironment.UserType == 3) { //Salesman

            let SalesId = SysSession.CurrentEnvironment.SalesManID;
            SalesmanDetails = SalesmanDetails.filter(s => s.SalesmanId == SalesId);

        }
        else if (SysSession.CurrentEnvironment.UserType == 2) {//CashBox

        }

    }
    //---------------------------------------------- get  functions ----------------------------------------
    function getAllOperations() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("OperationInvoice", "GetAllOperationswithoutStatus"),
            data: { CompCode: compcode, BranchCode: BranchCode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    operationDetailsWithoutStatus = result.Response as Array<I_TR_Operation>;

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
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    AD_VatTypeDetails = result.Response as A_D_VAT_TYPE;
                    VatPrc = AD_VatTypeDetails.VatPerc;
                }
            }
        });
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
    function GetInvoiceByID(invoiceID: number) {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("SlsTrSales", "GetSlsInvoiceByIDFromStatistics"),
            data: { invoiceID: invoiceID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    InvoicemodelForReturn = result.Response as Array<IQ_GetSlsInvoiceStatisticVer2>;
                    if (InvoicemodelForReturn.length > 0)
                        txtInvoiceNumber.value = InvoicemodelForReturn[0].TrNo.toString();
                }
            }
        });
    }
    //------------------------------------------------------ Buttons Region -----------------------------------
    function btnUpdate_onclick() {
        if (!SysSession.CurrentPrivileges.EDIT) return;
        if (chkOpenProcess.checked == false) {
            DisplayMassage(" لا يمكن تعديل مرتجع علي العمليات المغلقة", "Returns on closed operations cannot be modified", MessageType.Worning);
        } else {
            EditFlag = true;
            InsertFlag = false;
            btnProcessInvoiceSearch.disabled = true;
            $("#btnBack").removeClass("display_none");
            $("#btnSave").removeClass("display_none");
            $('#btnUpdate').addClass("display_none");
            $('#btnPrintTransaction').addClass("display_none");
            $("#txtCashAmount").removeAttr("disabled");
            $("#txtCashAmountLabel").removeAttr("disabled");
            txtRefNo.disabled = false;
            txtRemarks.disabled = false;
            $("#divGridDetails_View").addClass("disabledDiv");
            $("#DivFilter").addClass("disabledDiv");
            
            $("#divGridDetails_View").attr("disabled", "disabled").off('click');
            $("#div_hedr").addClass("disabledDiv");
            $("#div_hedr").attr("disabled", "disabled").off('click');

            $("#txtInvoiceDate").removeAttr("disabled");
            chkActive.disabled = !SysSession.CurrentPrivileges.CUSTOM1;
            $("#btnAddDetails").addClass("display_none");

            for (let cnt = 0; cnt <= CountGrid; cnt++) {

                $("#txtReturnQuantity" + cnt).removeAttr("disabled");

                $('.btn-number3' + cnt).removeAttr("disabled");
                $('.input-number3' + cnt).removeAttr("disabled");



            }
        }
    }
    function btnAddFreeReturn_onclick() {
        if (!SysSession.CurrentPrivileges.AddNew) return;
        $("#divShow").removeClass("display_none"); 
        txtInvoiceNumber.value = "";
        $('#btnUpdate').addClass("display_none");
        $('#btnPrintTransaction').addClass("display_none");
        $("#btnBack").removeClass("display_none");
        $("#btnSave").removeClass("display_none");
      // $("#btnPrint").addClass("display_none");

        btnProcessInvoiceSearch.disabled = true;
        txtInvoiceDate.value = GetDate();
        clear();

        Show = false;
        CountGrid = 0;
        $("#txtInvoiceDate").removeAttr("disabled");
        $("#ddlInvoiceCustomer").removeAttr("disabled");

        $("#ddlReturnTypeShow").removeAttr("disabled");

        $("#chkActive").removeAttr("disabled");

        $("#btnAddDetails").removeClass("display_none");

        txtRefNo.disabled = false;
        txtRemarks.disabled=false;

    }
    function btnProcessInvoiceSearch_onclick() {
        InvoiceFlag = true;
        let sys: SystemTools = new SystemTools();
        var operatiodID: number = Number(ddlOPerationMaster.value);
        sys.FindKey(Modules.ProcSalesRet, "btnProcessInvoiceSearch", "CompCode=" + compcode + " and BranchCode = " + BranchCode + " and OperationId =" + operatiodID + "and TrType = 0 and SlsInvSrc = 2 and Status = 1 ", () => {
            let id = SearchGrid.SearchDataGrid.SelectedKey
            //globalInvoiceID = id;
            RefTrID = id;
            txtInvoiceNumber_onchange();
            if (AddReturn != false) {
                btnAdd_onclick();
                ComputeTotals();
                $("#btnProcessInvoiceSearch").removeAttr("disabled");
            }
            InvoiceFlag = false;
        });

    }
    function btnSave_onclick() {
        debugger
        loading('btnsave');

        setTimeout(function () {

            finishSave('btnsave');
        btnProcessInvoiceSearch.disabled = false;
        if (EditFlag == true) {
            if (!SysSession.CurrentPrivileges.EDIT) return;

            if (!ValidationHeader())
                return;

            Assign();
            let ReturnQuan = false;
            for (var i = 0; i < CountGrid; i++) {
                if ($('#txtReturnQuantity' + i).val() != '0' && $('#txtReturnQuantity' + i).val() != '') {
                    ReturnQuan = true;
                    break; 
                }
                else {
                    ReturnQuan = false;
                } 
            }
            if (ReturnQuan == true) {

                Update();
                BindStatisticGridData();
            }
            else {
                DisplayMassage(' يجب أضافه قيمه للكمية المرتجعه على الفاتورة', 'A value must be added to the returned quantity on the invoice', MessageType.Error);
            }
        }
        else {
            if (!SysSession.CurrentPrivileges.AddNew) return;
            if (!ValidationHeader())
                return;

            Assign();



            if (chkActive.checked == true) { 
                let operationDetailsList = operationDetailsWithoutStatus.filter(x => x.OperationID == operationGlobalID);
                if (operationDetailsList[0].Status != 2) {
                    DisplayMassage(" لايمكن اعتماد الفاتوره لان العمليه غير مفتوحه", "Invoices cannot be modified on closed Processes", MessageType.Worning);
                    return;
                }
            }



            var returnValueFlag: boolean = false;
            if (invoiceItemsModel.length > 0) {
                for (let i = 0; i < invoiceItemsModel.length; i++) {
                    if (invoiceItemsModel[i].SoldQty == 0) {
                        DisplayMassage(' يجب أضافه قيمه للكمية المرتجعه على الفاتورة', 'A value must be added to the returned quantity on the invoice', MessageType.Error);
                        returnValueFlag = true;
                        return;
                    }
                }
                if (returnValueFlag == false) {
                    Insert();
                }
            }
            else {
                DisplayMassage('يجب أضافه قيمه للكمية المرتجعه على الفاتورة', 'A value must be added to the returned quantity on the invoice', MessageType.Error);
            }
        }

    }, 100);
    }
    function btnBack_onclick() {
        FlagTochooseWhichOperationID = false;
        if (InsertFlag == false) {

            $("#divReturnDetails").addClass("display_none");
            $("#btnBack").addClass("display_none");
            $("#btnSave").addClass("display_none");
            $("#divGridDetails_View").removeClass("disabledDiv");
            $("#DivFilter").removeClass("disabledDiv");
            
            $("#div_hedr").removeAttr("disabled")
            $("#div_hedr").removeClass("disabledDiv");
            $("#chkActive").attr("disabled", "disabled");
        }
        else {
            globalInvoiceID = 0;
            $("#div_hedr").removeAttr("disabled")
            $("#div_hedr").removeClass("disabledDiv");
            $('#condtionbtn1').removeClass("col-lg-10");
            $('#condtionbtn1').addClass("col-lg-8");
            $('#condtionbtn2').removeClass("col-lg-2");
            $('#condtionbtn2').addClass("col-lg-4");
            $("#divGridDetails_View").removeClass("disabledDiv");
            $("#DivFilter").removeClass("disabledDiv");
            
            $("#txtCustomerName").attr("disabled", "disabled");
            $("#ddlFreeSalesman").attr("disabled", "disabled");
            $("#txtInvoiceDate").attr("disabled", "disabled");
            $("#btnUpdate").addClass("display_none");
        //    $('#btnPrint').removeClass("display_none");
            $("#btnSave").addClass("display_none");
            $('#btnBack').addClass("display_none");
            $('#btnUpdate').removeClass("display_none");
            $("#txtCashAmount").attr("disabled", "disabled");
            $("#txtCashAmountLabel").attr("disabled", "disabled");
            txtRefNo.disabled = true;
            txtRemarks.disabled = true;
            $("#btnProcessInvoiceSearch").attr("disabled", "disabled");
            $("#txtInvoiceDate").attr("disabled", "disabled");
            $("#chkActive").attr("disabled", "disabled");

            try {
                if (InvoiceStatisticsModel[0].CashBoxID != null && InvoiceStatisticsModel[0].CashBoxID != 0) {
                    var cashAmount = InvoiceStatisticsModel[0].CashAmount.toString();
                    $("#txtCashAmount").prop("value", cashAmount);
                } else {
                    $("#txtCashAmount").val('');
                }
            } catch (e) {

            }
            $("#div_Data").html('');
            for (let i = 0; i < SlsInvoiceItemsDetails.length; i++) {
                BuildControls(i);
            }
            CountGrid = SlsInvoiceItemsDetails.length;
            CountItems = SlsInvoiceItemsDetails.length;

            txtInvoiceDate.value = DateFormat(InvoiceStatisticsModel[0].TrDate.toString());
            if (InvoiceStatisticsModel[0].Status == 1) { chkActive.checked = true; } else { chkActive.checked = false; }

        }
    }
    function btnShow_onclick() {
        InitializeGrid();
        $("#divShow").removeClass("display_none");
        $("#divReturnDetails").addClass("display_none");

        $("#divGridDetails_View").removeClass("disabledDiv");
        $("#DivFilter").removeClass("disabledDiv");
        
    }
    function AddNewReturn_onclick() {
        debugger
        if (ddlOPerationMaster.value == "null" || ddlOPerationMaster.value == "") {
            DisplayMassage(" يجب اختيار العملية", "The process must be selected", MessageType.Worning);
            
            Errorinput(ddlOPerationMaster);
            Back();
        } else {
            if (chkOpenProcess.checked == false) {
                DisplayMassage(" لا يمكن اضافه مرتجع علي العمليات المغلقة", "It is not possible to add a return on closed processes", MessageType.Worning);
                Back();
            } else {
                FlagTochooseWhichOperationID = true;
                FillddlItem();
                ddlFreeSalesman.value = ddlSalesMan.value;
                $("#DivFilter").addClass("disabledDiv");
                $("#divGridDetails_View").addClass("disabledDiv");
                $("#divGridDetails_View").attr("disabled", "disabled").off('click');
                $("#div_hedr").addClass("disabledDiv");
                $("#div_hedr").attr("disabled", "disabled").off('click');

                $("#divShow").removeClass("display_none");
                btnProcessInvoiceSearch.disabled = false;
                $("#divReturnDetails").removeClass("display_none");
                $("#btnBack").removeClass("display_none");
                $("#btnSave").removeClass("display_none");
                $("#btnUpdate").addClass("display_none");
                $("#btnPrintTransaction").addClass("display_none");
             //   $("#btnPrint").addClass("display_none");

                $('#div_Data').html("");
                txtItemCount.value = "";
                txtPackageCount.value = "";
                txtTotal.value = "";
                txtTax.value = "";
                txtNet.value = "";
                txtInvoiceNumber.value = "";

                lblReturnNumber.value = "";
                txtInvoiceDate.value = "";
                ddlInvoiceCustomer.value = "null";
                ddlReturnTypeShow.value = "0";
                ddlFreeSalesman.value = "null";
                ddlSalesPerson.value = "null";
                txtCashAmount.value = "";
                txtRefNo.value = "";
                txtRemarks.value = "";
                ddlTaxTypeHeader.value = "null";
                txtOPerationDetail.value = "";
                $("#txtCustomerName").prop("value", "");


                $('#txtCreatedBy').prop("value", SysSession.CurrentEnvironment.UserCode);
                $('#txtCreatedAt').prop("value", DateTimeFormat(Date().toString()));

                $('#txtUpdatedBy').prop("value", "");
                $('#txtUpdatedAt').prop("value", "");

                $("#btnAddDetails").attr("disabled", "disabled");
                $("#btnAddDetails").addClass("display_none");
                chkActive.checked = true;
                chkActive.disabled = false;
                txtRefNo.disabled = false;
                txtRemarks.disabled = false;
                txtInvoiceDate.value = GetDate();

                $("#ddlFreeSalesman").attr("disabled", "disabled");
                $("#ddlSalesPerson").attr("disabled", "disabled");


                InsertFlag = false;
                EditFlag = false;
            }
        }
    }
    function btnAdd_onclick() {
        debugger
        txtInvoiceDate.value = GetDate();
        var unApprovedReturn: boolean = false;
        lblReturnNumber.value = "";

        unApprovedReturn = checkUnApprovedReturns(RefTrID);
        if (unApprovedReturn == true) {
            DisplayMassage('لا يمكن اضافه مرتجع علي الفاتورة قبل اعتماد المرتجعات السابقه', 'A return cannot be added to the invoice before previous returns are approved', MessageType.Error);
 
        } else {
            Show = false;
            $("#btnBack").removeClass("display_none");
            $("#btnSave").removeClass("display_none");
          //  $("#btnPrint").addClass("display_none");
            $('#btnUpdate').addClass("display_none");

            var items: number = Number(txtItemCount.value);
            for (let i = 0; i < items; i++) {
                $("#txtReturnQuantity" + i).removeAttr("disabled");

                $('.btn-number3' + i).removeAttr("disabled");
                $('.input-number3' + i).removeAttr("disabled");


            }
            $("#ddlInvoiceCustomer").attr("disabled", "disabled");
            $("#ddlReturnTypeShow").attr("disabled", "disabled");
            $("#ddlFreeSalesman").attr("disabled", "disabled");
            $("#ddlSalesPerson").attr("disabled", "disabled");
            $("#btnAddDetails").addClass("display_none");
            $("#ddlReturnTypeShow").attr("disabled", "disabled");
            $("#txtCustomerName").attr("disabled", "disabled");


            $("#txtInvoiceDate").removeAttr("disabled");
            $("#txtCashAmount").removeAttr("disabled");
            $("#txtCashAmountLabel").removeAttr("disabled");
            $("#txtRefNo").removeAttr("disabled");
            $("#txtRemarks").removeAttr("disabled");
            btnProcessInvoiceSearch.disabled = true;
        }
    }
    //-----------------------------------------------------------------------  DropDownList Region ----------------------------------
    function fillddlSalesPerson() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefSalesMen", "GetAllSalesPeople"),// GetAllSalesPeople(int CompCode, bool IsSalesEnable, string UserCode, string Token)
            data: {
                CompCode: compcode, BranchCode: BranchCode, IsSalesEnable: true, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {

                    SalesmanDetails = result.Response as Array<I_Sls_D_Salesman>;

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

        if (chkOpenProcess.checked == true) {
            operationDetails = operationDetailsWithoutStatus.filter(s => s.Status == 2);
        }
        else {
            operationDetails = operationDetailsWithoutStatus.filter(s => s.Status == 3);
        }

        if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
            DocumentActions.FillCombowithdefult(operationDetails, ddlOPerationMaster, "OperationID", "TrNo", "Select operation");
        }
        else {
            DocumentActions.FillCombowithdefult(operationDetails, ddlOPerationMaster, "OperationID", "TrNo", "اختر العملية");
        }


    }
    function FillddlSalesMan() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefSalesMen", "GetAllOperationPeople"),
            data: {
                CompCode: compcode, BranchCode: BranchCode, ISOperationEnable: true, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {

                    SalesmanDetails = result.Response as Array<I_Sls_D_Salesman>;
                    Check_on_user_type();

                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                        DocumentActions.FillCombowithdefult(SalesmanDetails, ddlSalesMan, "SalesmanId", "NameE", "Select Category");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(SalesmanDetails, ddlSalesMan, "SalesmanId", "NameA", "اختر المندوب");
                    }
                    SysSession.CurrentEnvironment.UserType == 1 || SysSession.CurrentEnvironment.UserType == 3 ? ($('#ddlSalesMan option[value="null"]').remove()) : $('#ddlSalesMan').prop('selectedIndex', 0);
                }
            }
        });
    }
    function fillddlFreeSalesman() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefSalesMen", "GetAllOperationPeople"),
            data: {
                CompCode: compcode, BranchCode: BranchCode, ISOperationEnable: true, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {

                    SalesmanDetails = result.Response as Array<I_Sls_D_Salesman>;
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                        DocumentActions.FillCombowithdefult(SalesmanDetails, ddlFreeSalesman, "SalesmanId", "NameE", "Select Category");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(SalesmanDetails, ddlFreeSalesman, "SalesmanId", "NameA", "اختر المندوب");
                    }
                }
            }
        });
    }
    function FillddlStateType() {
        StateDetailsAr = [" غير معتمد", "معتمد", "الجميع"];
        StateDetailsEn = ["Not Approved", "Approved", "All"];

        if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
            for (let i = 0; i < StateDetailsEn.length; i++) {
                let newoption = document.createElement("option");
                newoption.value = i.toString();
                newoption.text = StateDetailsEn[i];
                ddlStateType.options.add(newoption);
            }
        }
        else {
            for (let i = 0; i < StateDetailsAr.length; i++) {
                let newoption = document.createElement("option");
                newoption.value = i.toString();
                newoption.text = StateDetailsAr[i];
                ddlStateType.options.add(newoption);
            }
        }
    }
    function FillddlReturnType() {
        StateDetailsAr = ["علي الحساب ", "نقدي", "الجميع"];
        StateDetailsEn = ["Credit", "Cash", "All"];

        if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
            for (let i = 0; i < StateDetailsEn.length; i++) {
                let newoption = document.createElement("option");
                newoption.value = i.toString();
                newoption.text = StateDetailsEn[i];
                ddlReturnType.options.add(newoption);
                ddlReturnTypeShow.options.add(newoption);

            }
        }
        else {
            for (let i = 0; i < StateDetailsAr.length; i++) {
                let newoption = document.createElement("option");
                newoption.value = i.toString();
                newoption.text = StateDetailsAr[i];
                ddlReturnType.options.add(newoption);
                ddlReturnTypeShow.options.add(newoption);
            }
        }
    }
    function FillddlItem() {
        var operationId = 0;
        let Selecteditem = SlsInvoiceStatisticsDetails.filter(x => x.InvoiceID == Number(Grid.SelectedKey));
        if (FlagTochooseWhichOperationID == false) {
            operationId = Number(Selecteditem[0].OperationId);
        } else {
            operationId = Number(ddlOPerationMaster.value.toString());
        }

        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("OperationInvoice", "GetItemOrderedWithoutFamilyIDNew"),
            data: {
                OperationID: operationId, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                ////debugger;
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    ItemDetails = result.Response as Array<IQ_GetOperationItemInfo_New>;
                }
            }
        });
    }
    function FillddlTaxType() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GenVatType", "GetAll"),
            data: {
                CompCode: compcode, VatType: 1, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {

                    VatDetails = result.Response as Array<A_D_VAT_TYPE>;

                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                        DocumentActions.FillCombowithdefult(VatDetails, ddlTaxTypeHeader, "CODE", "DESCRIPTION", "Select Tax");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(VatDetails, ddlTaxTypeHeader, "CODE", "DESCRIPTION", "اختر الضريبة");
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
                CompCode: compcode, BranchCode: BranchCode, AccountType: 1, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    VendorDetails = result.Response as Array<A_Rec_D_Customer>;
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                        DocumentActions.FillCombowithdefult(VendorDetails, ddlCustomer, "CustomerId", "NAMEE", "Select customer");
                        DocumentActions.FillCombowithdefult(VendorDetails, ddlInvoiceCustomer, "CustomerId", "NAMEE", "Select customer");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(VendorDetails, ddlCustomer, "CustomerId", "NAMEA", "اختر العميل");
                        DocumentActions.FillCombowithdefult(VendorDetails, ddlInvoiceCustomer, "CustomerId", "NAMEA", "اختر العميل");
                    }
                }
            }
        });
    }
    //------------------------------------------------------ Clear && Search && Validation Region -----------------------------------
    function _SearchBox_Change() {
        if (searchbutmemreport.value != "") {

            let search: string = searchbutmemreport.value.toLowerCase();
            SearchDetails = SlsInvoiceStatisticsDetails.filter(x => x.TrNo.toString().search(search) >= 0 || x.CustomerName.toLowerCase().search(search) >= 0
                || x.Slsm_DescA.toLowerCase().search(search) >= 0);

            Grid.DataSource = SearchDetails;
            Grid.Bind();
        } else {
            Grid.DataSource = SlsInvoiceStatisticsDetails;
            Grid.Bind();
        }
    }
    function ValidationHeader() {



        if (chkActive.checked == true && ddlReturnTypeShow.value == "1" && (Number(txtCashAmount.value).RoundToSt(2) != Number(txtNet.value).RoundToSt(2))) {
            DisplayMassage('يجب ان يتساوي المبلغ المسدد مع الصافي', '(The amount paid must be equal to the net)', MessageType.Error);
            Errorinput(txtCashAmount);
            Errorinput(txtNet);
            return false
        }


        else if ($('#txtRefNo').val()) {
            debugger
            DisplayMassage("لا يمكنك الاضافه او التعديل في هذة الفتره المغلقه ", "Please select a Invoice data", MessageType.Error);
            Errorinput(txtInvoiceDate);
            return false
        }

        else if (!CheckPeriodDate(txtInvoiceDate.value, "I")) {
            debugger
            DisplayMassage("لا يمكنك الاضافه او التعديل في هذة الفتره المغلقه ", "Please select a Invoice data", MessageType.Error);
            Errorinput(txtInvoiceDate);
            return false
        }

        return true;

    }
    function clear() {
        CountGrid = 0;
        CountItems = 0;
        $('#div_Data').html("");
        txtItemCount.value = "";
        txtPackageCount.value = "";
        txtTotal.value = "";
        txtTax.value = "";
        txtNet.value = "";
        txtInvoiceNumber.value = "";
        lblReturnNumber.value = "";
        txtInvoiceDate.value = "";
        txtRefNo.value = "";
        txtRemarks.value = "";
        ddlInvoiceCustomer.value = "null";
        ddlReturnTypeShow.value = "0";
        ddlFreeSalesman.value = "null";
        ddlSalesPerson.value = "null";

        $("#txtCustomerName").prop("value", "");
        $("#txtCustomerName").attr("disabled", "disabled");

        ddlFreeSalesman.disabled = true;
        ddlSalesPerson.disabled = true;

        $('#txtCreatedBy').prop("value", "");
        $('#txtCreatedAt').prop("value", "");

        $('#txtUpdatedBy').prop("value", "");
        $('#txtUpdatedAt').prop("value", "");

        $("#txtInvoiceDate").attr("disabled", "disabled");
        $("#ddlInvoiceCustomer").attr("disabled", "disabled");

        $("#ddlReturnTypeShow").attr("disabled", "disabled");
        $("#ddlFreeSalesman").attr("disabled", "disabled");

        /// $("#ddlCashBox").attr("disabled", "disabled");
        $("#txtCashAmount").attr("disabled", "disabled");
        $("#txtCashAmountLabel").attr("disabled", "disabled");

        //$("#ddlCashBox").prop("value", "null");
        $("#txtCashAmount").prop("value", "");
        $("#ddlTaxTypeHeader").prop("value", "null");

        // $("#chkActive").attr("disabled", "disabled");

        $("#btnAddDetails").attr("disabled", "disabled");
        $("#btnAddDetails").addClass("display_none");
       // $("#btnPrint").addClass("display_none");

        for (let cnt = 0; cnt <= CountGrid; cnt++) {
            //  $("#ddlFamily" + cnt).attr("disabled", "disabled");
            $("#ddlItem" + cnt).attr("disabled", "disabled");
            $("#txtQuantity" + cnt).attr("disabled", "disabled");
            $("#txtPrice" + cnt).attr("disabled", "disabled");
            $("#txtUnitpriceWithVat" + cnt).attr("disabled", "disabled");
            $("#txtReturnQuantity" + cnt).attr("disabled", "disabled");
            $("#txtTotal" + cnt).attr("disabled", "disabled");
            $("#txtTax" + cnt).attr("disabled", "disabled");
            $("#txtTotAfterTax" + cnt).attr("disabled", "disabled");


            $('.btn-number1' + cnt).attr("disabled", "disabled");
            $('.input-number1' + cnt).attr("disabled", "disabled");

            $('.btn-number2' + cnt).attr("disabled", "disabled");
            $('.input-number2' + cnt).attr("disabled", "disabled");

            $('.btn-number3' + cnt).attr("disabled", "disabled");
            $('.input-number3' + cnt).attr("disabled", "disabled");



        }
        txtInvoiceDate.value = GetDate();
    }
    //------------------------------------------------------ Normal Grid Region -----------------------------------
    function InitializeGrid() {
        let res: any = GetResourceList("");
        Grid.ElementName = "divGridDetails_View";
        Grid.Paging = true;
        Grid.PageSize = 10;
        Grid.Sorting = true;
        Grid.InsertionMode = JsGridInsertionMode.Binding;
        Grid.Editing = false;
        Grid.Inserting = false;
        Grid.SelectedIndex = 1;
        Grid.OnRowDoubleClicked = Grid_RowDoubleClicked;
        Grid.OnItemEditing = () => { };
        Grid.PrimaryKey = "InvoiceID";
        Grid.Columns = [
            { title: "ID", name: "InvoiceID", type: "text", width: "2%", visible: false },
            { title: res.App_ReturnNum, name: "TrNo", type: "text", width: "13%" },
            { title: res.App_date, name: "TrDate", type: "text", width: "16%" },
            { title: res.App_Cutomer, name: "CustomerName", type: "text", width: "25%" },
            { title: res.App_Salesman, name: "Slsm_DescA", type: "text", width: "25%" },
            { title: res.Men_StkDefItemsNumber, name: "Line_Count", type: "text", width: "12%" },
            { title: res.App_PackageCount, name: "Tot_Qty", type: "text", width: "12%" },
            { title: res.App_total, name: "TotalAmount", type: "text", width: "10%" },
            { title: res.App_Tax, name: "VatAmount", type: "text", width: "10%" },
            { title: res.net, name: "NetAfterVat", type: "text", width: "10%" },
            { title: res.Cash_credit, name: "returnTypeDesciption", type: "text", width: "20%" },
            { title: res.App_Certified, name: "statusDesciption", type: "text", width: "17%", css: "classfont" }
        ];
        BindStatisticGridData();
    }
    function BindStatisticGridData() {
        var startDate = DateFormatRep(txtStartDate.value).toString();
        var endDate = DateFormatRep(txtEndDate.value).toString();
        var customerId = 0;
        var status = 0;
        var returnType = 0;
        var SalesMan = 0;
        var operationId = 0;
        var SalesPersonFilter = 0;

        if (ddlOPerationMaster.value != "null") {
            operationId = Number(ddlOPerationMaster.value.toString());
        }
        if (ddlCustomer.value != "null") {
            customerId = Number(ddlCustomer.value.toString());
        }
        if (ddlSalesMan.value != "null") {
            SalesMan = Number(ddlSalesMan.value.toString());
        }
        if (ddlSalesPersonFilter.value != "null") {
            SalesPersonFilter = Number(ddlSalesPersonFilter.value.toString());
        }


        status = Number(ddlStateType.value.toString());


        returnType = Number(ddlReturnType.value.toString());

        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("OperationInvoice", "GetAllOperationReturnStatistic"),
            data: { CompCode: compcode, BranchCode: BranchCode, operationId: operationId, SalesPerson: SalesPersonFilter , StartDate: startDate, EndDate: endDate, Status: status, returnType: returnType, CustId: customerId, SalesMan: SalesMan, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    SlsInvoiceStatisticsDetails = result.Response as Array<IQ_GetSlsInvoiceStatisticVer2>;
                    for (var i = 0; i < SlsInvoiceStatisticsDetails.length; i++) {
                        SlsInvoiceStatisticsDetails[i].returnTypeDesciption = SlsInvoiceStatisticsDetails[i].IsCash == true ? (lang == "ar" ? "نقدي" : "Cash") : (lang == "ar" ? "على الحساب" : "Credit");
                        SlsInvoiceStatisticsDetails[i].statusDesciption = SlsInvoiceStatisticsDetails[i].Status == 1 ? (lang == "ar" ? "معتمد" : "A certified") : (lang == "ar" ? "غير معتمد" : "Not supported");
                        SlsInvoiceStatisticsDetails[i].TrDate = DateFormat(SlsInvoiceStatisticsDetails[i].TrDate.toString());
                    }

                    Grid.DataSource = SlsInvoiceStatisticsDetails;
                    Grid.Bind();
                }
            }
        });
    }
    function Grid_RowDoubleClicked() {
        Show = true;
        clear();
        FillddlItem();
        Success();
        InvoiceStatisticsModel = new Array<IQ_GetSlsInvoiceStatisticVer2>();

        Selecteditem = SlsInvoiceStatisticsDetails.filter(x => x.InvoiceID == Number(Grid.SelectedKey));

        if (AfterInsertOrUpdateFlag == true) {
            Selecteditem = SlsInvoiceStatisticsDetails.filter(x => x.InvoiceID == globalInvoiceID);
            AfterInsertOrUpdateFlag = false;
        }

        InvoiceStatisticsModel = Selecteditem;
        if (InvoiceStatisticsModel.length > 0) {
            globalInvoiceID = Number(InvoiceStatisticsModel[0].InvoiceID);
            txtItemCount.value = InvoiceStatisticsModel[0].Line_Count.toString();
            txtPackageCount.value = InvoiceStatisticsModel[0].Tot_Qty.toString();
            txtTotal.value = InvoiceStatisticsModel[0].TotalAmount.toString();
            txtTax.value = InvoiceStatisticsModel[0].VatAmount.toString();
            txtNet.value = InvoiceStatisticsModel[0].NetAfterVat.toString();

            var operationID = Number(InvoiceStatisticsModel[0].OperationId);
            operationGlobalID = Number(InvoiceStatisticsModel[0].OperationId);
            var operationlist = operationDetailsWithoutStatus.filter(s => s.OperationID == operationID)
            txtOPerationDetail.value = operationlist[0].TrNo.toString();

            ddlTaxTypeHeader.value = InvoiceStatisticsModel[0].VatType.toString();

            if (InvoiceStatisticsModel[0].RefTrID != null) {
                var RefID: number = InvoiceStatisticsModel[0].RefTrID;
                GetInvoiceByID(RefID);
            }
            var ReturnNum = InvoiceStatisticsModel[0].TrNo.toString();
            lblReturnNumber.value = ReturnNum;
            txtInvoiceDate.value = DateFormat(InvoiceStatisticsModel[0].TrDate.toString());
            txtRefNo.value = InvoiceStatisticsModel[0].RefNO.toString();
            txtRemarks.value = InvoiceStatisticsModel[0].Remark.toString();

            txtRefNo.disabled = true;
            txtRemarks.disabled = true;
            if (InvoiceStatisticsModel[0].CustomerId != null) {
                $('#txtCustomerName').prop("value", InvoiceStatisticsModel[0].Cus_NameA.toString());

                var custId = InvoiceStatisticsModel[0].CustomerId.toString();
                ddlInvoiceCustomer.value = custId;
            } else {
                $('#txtCustomerName').prop("value", InvoiceStatisticsModel[0].CustomerName.toString());
            }

            if (InvoiceStatisticsModel[0].IsCash == true) {
                $('#ddlReturnTypeShow').prop("value", "1");
                $("#txtCashAmount").removeClass("display_none");
                $("#txtCashAmountLabel").removeClass("display_none");
                if (InvoiceStatisticsModel[0].CashBoxID != null && InvoiceStatisticsModel[0].CashBoxID != 0) {
                    var cashAmount = InvoiceStatisticsModel[0].CashAmount.toString();
                    $("#txtCashAmount").prop("value", cashAmount);
                }

            } else {
                $("#txtCashAmount").addClass("display_none");
                $("#txtCashAmountLabel").addClass("display_none");
                $('#ddlReturnTypeShow').prop("value", "0");
            }
            $('#ddlFreeSalesman').prop("value", InvoiceStatisticsModel[0].SalesmanId == null ? "null" : InvoiceStatisticsModel[0].SalesmanId.toString());
            $('#ddlSalesPerson').prop("value", InvoiceStatisticsModel[0].SalesPersonId == null ? "null" : InvoiceStatisticsModel[0].SalesPersonId.toString());
            if (InvoiceStatisticsModel[0].Status == 1) {
                chkActive.disabled = !SysSession.CurrentPrivileges.CUSTOM2;
                btnUpdate.disabled = true;
                chkActive.checked = true;
            }
            else {
                chkActive.disabled = true;
                btnUpdate.disabled = !SysSession.CurrentPrivileges.EDIT;
                chkActive.checked = false;
            }

            $('#divCreationPanel').removeClass("display_none");

            $('#txtCreatedBy').prop("value", InvoiceStatisticsModel[0].CreatedBy);
            $('#txtCreatedAt').prop("value", InvoiceStatisticsModel[0].CreatedAt);

            $('#txtUpdatedBy').prop("value", InvoiceStatisticsModel[0].UpdatedBy);
            $('#txtUpdatedAt').prop("value", InvoiceStatisticsModel[0].UpdatedAt);


            $("#txtCustomerName").attr("disabled", "disabled");
            $("#ddlFreeSalesman").attr("disabled", "disabled");


            $("#btnProcessInvoiceSearch").attr("disabled", "disabled");
            $('#btnPrintTransaction').removeClass("display_none");


            Ajax.Callsync({
                type: "Get",
                url: sys.apiUrl("SlsTrSales", "GetSlsInvoiceItem"),
                data: { invoiceID: globalInvoiceID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
                success: (d) => {
                    let result = d as BaseResponse;
                    if (result.IsSuccess) {
                        SlsInvoiceItemsDetails = result.Response as Array<IQ_GetSlsInvoiceItem>;
                        $("#div_Data").html('');
                        for (let i = 0; i < SlsInvoiceItemsDetails.length; i++) {
                            BuildControls(i);
                        }
                        CountGrid = SlsInvoiceItemsDetails.length;
                        CountItems = SlsInvoiceItemsDetails.length;
                        ComputeTotals();
                        //Insert_Serial();
                    }
                }
            });

        }




    }
    //------------------------------------------------------ Controls Grid Region -----------------------------------
    function BuildControls(cnt: number) {
        var html;
        html = `<tr id="No_Row${cnt}">
                    <input id="InvoiceItemID${cnt}" type="hidden" class="form-control display_none"  />
	                <td>
		                <div class="form-group">
			                <span id="btn_minus${cnt}" class="display_none"><i class="fas fa-minus-circle  btn-minus "></i></span>
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
			                <input id="txtSerial${cnt}" type="text" class="form-control" disabled />
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
			                <select id="ddlItem${cnt}" class="form-control">
                                <option>الصنف</option>
                            </select>
                        </div>
	                </td>
                     <td>
		                <div class="form-group">
			                <div class="form-group ps-1">
			                    <input class="counter" type="number" data-id="number" id="txtQuantity${cnt}" name="quant[1]"  value="0" min="1" max="1000" step="1"/>
			                    <div class="value-button decrease-button btn-number1${cnt}" data-id="decrease" id="btnminus1" data-type="minus" data-field="quant[1]">-</div>
			                    <div class="value-button increase-button btn-number1${cnt}" data-id="increase" id="btnplus1" data-type="plus" data-field="quant[1]">+</div>
		                    </div>
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
			                <input type="text"  class="form-control" id="txtReturnQuantity${cnt}" name="quant[3]" class="form-control" value="0" min="0" max="1000" step="1">
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
			                <div class="form-group ps-1">
			                    <input class="counter" type="number" data-id="number" id="txtPrice${cnt}" name="quant[2]"  value="1" min="0" max="1000" step="0.5"/>
			                    <div class="value-button decrease-button btn-number2${cnt}" data-id="decrease" id="btnminus2" data-type="minus" data-field="quant[2]">-</div>
			                    <div class="value-button increase-button btn-number2${cnt}" data-id="increase" id="btnplus2" data-type="plus" data-field="quant[2]">+</div>
		                    </div>
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
			                <div class="form-group ps-1">
			                    <input class="counter" type="number" data-id="number" id="txtUnitpriceWithVat${cnt}" name="quant[2]"  value="1" min="0" max="1000" step="0.5"/>
			                    <div class="value-button decrease-button btn-number3${cnt}" data-id="decrease" id="btnminus3" data-type="minus" data-field="quant[2]">-</div>
			                    <div class="value-button increase-button btn-number3${cnt}" data-id="increase" id="btnplus3" data-type="plus" data-field="quant[2]">+</div>
		                    </div>
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
			                <input type="text"  class="form-control" id="txtTotal${cnt}"  class="form-control" disabled>
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
			               <input id="txtTax_Rate${cnt}" type="text"  class="form-control"  disabled>
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
			              <input id="txtTax${cnt}" type="text" class="form-control" disabled />
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
			              <input id="txtTotAfterTax${cnt}" type="text" class="form-control" disabled />
		                </div>
	                </td>
                    <input id="vatnatid${cnt}" name = " " type = "hidden" class="form-control"/>
                    <input id="txt_StatusFlag${cnt}" name = " " type = "hidden" class="form-control"/>
                    <input id="txt_ID${cnt}" name = " " type = "hidden" class="form-control" />
                </tr>`;
    
        $("#div_Data").append(html);

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

                } else if (type == 'plus') {

                    if (currentVal < Number(input.attr('max'))) {
                        input.val((currentVal + 0.5)).change();
                    }
                    if (parseFloat(input.val()) == parseFloat(input.attr('max'))) {
                        $(this).val(input.attr('max'));
                    }

                }
            } else {
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
                $(".btn-number2" + cnt + "[data-type='minus'][data-field='" + name + "']").removeAttr('disabled')
            } else {
                alert('Sorry, the minimum value was reached');
                $(this).val($(this).data('oldValue'));
            }
            if (valueCurrent <= maxValue) {
                $(".btn-number2" + cnt + "[data-type='plus'][data-field='" + name + "']").removeAttr('disabled')
            } else {
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
                        input.val((currentVal - 1)).change();
                    }
                    if (parseFloat(input.val()) == Number(input.attr('min'))) {
                        $(this).val(input.attr('min'));
                    }

                } else if (type == 'plus') {

                    if (currentVal < Number(input.attr('max'))) {
                        input.val((currentVal + 1)).change();
                    }
                    if (parseFloat(input.val()) == parseFloat(input.attr('max'))) {
                        $(this).val(input.attr('max'));
                    }

                }
            } else {
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
                $(".btn-number3" + cnt + "[data-type='minus'][data-field='" + name + "']").removeAttr('disabled')
            } else {
                alert('Sorry, the minimum value was reached');
                $(this).val($(this).data('oldValue'));
            }
            if (valueCurrent <= maxValue) {
                $(".btn-number3" + cnt + "[data-type='plus'][data-field='" + name + "']").removeAttr('disabled')
            } else {
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

        $('.btn-number4' + cnt).click(function (e) {
            e.preventDefault();
            var fieldName = $(this).attr('data-field');
            var type = $(this).attr('data-type');
            var input = $("#txtUnitpriceWithVat" + cnt);
            var currentVal = parseFloat(input.val());
            if (!isNaN(currentVal)) {
                if (type == 'minus') {

                    if (currentVal > Number(input.attr('min'))) {
                        input.val((currentVal - 1)).change();
                    }
                    if (parseFloat(input.val()) == Number(input.attr('min'))) {
                        $(this).val(input.attr('min'));
                    }

                } else if (type == 'plus') {

                    if (currentVal < Number(input.attr('max'))) {
                        input.val((currentVal + 1)).change();
                    }
                    if (parseFloat(input.val()) == parseFloat(input.attr('max'))) {
                        $(this).val(input.attr('max'));
                    }

                }
            } else {
                input.val(1);
            }
        });
        //script
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
            } else {
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
                $(".btn-number1" + cnt + "[data-type='minus'][data-field='" + name + "']").removeAttr('disabled')
            } else {
                alert('Sorry, the minimum value was reached');
                $(this).val($(this).data('oldValue'));
            }
            if (valueCurrent <= maxValue) {
                $(".btn-number1" + cnt + "[data-type='plus'][data-field='" + name + "']").removeAttr('disabled')
            } else {
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
        for (var i = 0; i < ItemDetails.length; i++) {
            $('#ddlItem' + cnt).append('<option value="' + ItemDetails[i].ItemID + '">' + (lang == "ar" ? ItemDetails[i].Itm_DescA : ItemDetails[i].Itm_DescE) + '</option>');
        }

        var dropddlItem = '#ddlItem' + cnt;
        $(dropddlItem).change(function () {
            if ($('#ddlItem' + cnt).val() == "null") {
                $("#txtReturnQuantity" + cnt).val("1");
                $("#txtPrice" + cnt).val("1");
                $("#txtUnitpriceWithVat" + cnt).val("1");
                $("#txtTotal" + cnt).val("0");
                $("#txtTax" + cnt).val("0");
                $("#txtTotAfterTax" + cnt).val("0");
            } else {

                var selectedItem = $(dropddlItem + ' option:selected').attr('value');
                var itemID = Number(selectedItem);
                var NumberSelect = ItemDetails.filter(s => s.ItemID == itemID);

                var res = false;
                var NumberRowid = $("#InvoiceItemID" + cnt).val();
                res = checkRepeatedItems(itemID, NumberRowid);
                if (res == true) {
                    $("#ddlItem" + cnt).val("null");
                    $("#txtPrice" + cnt).val("1");
                    DisplayMassage('( لايمكن تكرار نفس الاصناف علي الفاتورة )', 'The same items cannot be duplicated on the invoice', MessageType.Error);
                } else {
                    var NumberSelect = ItemDetails.filter(s => s.ItemID == itemID);
                    let GetUnitprice: IGetunitprice = Get_PriceWithVAT(NumberSelect[0].Est_SalesPrice, VatPrc, flag_PriceWithVAT);
                    var itemPrice = GetUnitprice.unitprice;
                    $("#txtPrice" + cnt).val(itemPrice);
                    $("#txtUnitpriceWithVat" + cnt).val(GetUnitprice.unitpricewithvat);


                    var txtQuantityValue = $("#txtReturnQuantity" + cnt).val();
                    var txtPriceValue = $("#txtPrice" + cnt).val();
                    if ($("#txtPrice" + cnt).val() == 0) {
                        var total = Number(txtQuantityValue) * 1;
                        $("#txtTotal" + cnt).val(total.RoundToSt(2));
                        var vatAmount = Number(total) * VatPrc / 100;
                        $("#txtTax" + cnt).val(vatAmount.RoundToSt(2));
                        var totalAfterVat = Number(vatAmount) + Number(total);
                        $("#txtTotAfterTax" + cnt).val(totalAfterVat.RoundToSt(2));
                    } else {
                        var total = Number(txtQuantityValue) * Number(txtPriceValue);
                        $("#txtTotal" + cnt).val(total.RoundToSt(2));
                        var vatAmount = Number(total) * VatPrc / 100;
                        $("#txtTax" + cnt).val(vatAmount.RoundToSt(2));
                        var totalAfterVat = Number(vatAmount) + Number(total);
                        $("#txtTotAfterTax" + cnt).val(totalAfterVat.RoundToSt(2));
                    }
                }
            }
            //Insert_Serial();
            ComputeTotals();
        });

        // text change

        $("#txtQuantity" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");

            var txtQuantityValue = $("#txtReturnQuantity" + cnt).val();
            var txtPriceValue = $("#txtPrice" + cnt).val();
            if ($("#txtPrice" + cnt).val() == 0) {
                var total = Number(txtQuantityValue) * 1;
                $("#txtTotal" + cnt).val(total.RoundToSt(2));
                var vatAmount = Number(total) * VatPrc / 100;
                $("#txtTax" + cnt).val(vatAmount.RoundToSt(2));
                var totalAfterVat = Number(vatAmount) + Number(total);
                $("#txtTotAfterTax" + cnt).val(totalAfterVat.RoundToSt(2));
                ComputeTotals();
            } else {
                var total = Number(txtQuantityValue) * Number(txtPriceValue);
                $("#txtTotal" + cnt).val(total.RoundToSt(2));
                var vatAmount = Number(total) * VatPrc / 100;
                $("#txtTax" + cnt).val(vatAmount.RoundToSt(2));
                var totalAfterVat = Number(vatAmount) + Number(total);
                $("#txtTotAfterTax" + cnt).val(totalAfterVat.RoundToSt(2));
                ComputeTotals();
            }
        });
        $("#txtPrice" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");

            var txtQuantityValue = $("#txtReturnQuantity" + cnt).val();
            var txtPriceValue = $("#txtPrice" + cnt).val();

            if ($("#txtReturnQuantity" + cnt).val() == 0) {
                var total = 1 * Number(txtPriceValue);
                $("#txtTotal" + cnt).val(total.RoundToSt(2));
                var vatAmount = Number(total) * VatPrc / 100;
                $("#txtTax" + cnt).val(vatAmount.RoundToSt(2));

                var totalAfterVat = Number(vatAmount) + Number(total);
                $("#txtTotAfterTax" + cnt).val(totalAfterVat.RoundToSt(2));

                ComputeTotals();

            } else {
                var total = 1 * Number(txtPriceValue);
                var vatAmount = Number(total) * VatPrc / 100;
                $("#txtTax" + cnt).val(vatAmount.RoundToSt(2));
                var total = Number(txtQuantityValue) * Number(txtPriceValue);
                $("#txtTotal" + cnt).val(total.RoundToSt(2));

                var totalAfterVat = Number(vatAmount) + Number(total);
                $("#txtTotAfterTax" + cnt).val(totalAfterVat.RoundToSt(2));

                ComputeTotals();
            }
        });
        //txtReturnQuantity
        $("#txtReturnQuantity" + cnt).on('keyup', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");

            var txtQuantityValue = $("#txtQuantity" + cnt).val();
            var txtReturnQuantityValue = $("#txtReturnQuantity" + cnt).val();
            var txtPriceValue = $("#txtPrice" + cnt).val();
            if (Number(txtReturnQuantityValue) <= Number(txtQuantityValue) ) {


                var total = Number(txtReturnQuantityValue) * Number(txtPriceValue);
                $("#txtTotal" + cnt).val(total.RoundToSt(2));
                var vatAmount = Number(total) * VatPrc / 100;
                $("#txtTax" + cnt).val(vatAmount.RoundToSt(2));
                var totalAfterVat = Number(vatAmount) + Number(total);
                $("#txtTotAfterTax" + cnt).val(totalAfterVat.RoundToSt(2));
                ComputeTotals();

            }
            else {

                $("#txtReturnQuantity" + cnt).val(txtQuantityValue);
                var total = Number(txtReturnQuantityValue) * Number(txtPriceValue);
                $("#txtTotal" + cnt).val(total.RoundToSt(2));
                var vatAmount = Number(total) * VatPrc / 100;
                $("#txtTax" + cnt).val(vatAmount.RoundToSt(2));
                var totalAfterVat = Number(vatAmount) + Number(total);
                $("#txtTotAfterTax" + cnt).val(totalAfterVat.RoundToSt(2));
                ComputeTotals();
                DisplayMassage('يجب ان تكون الكميه المرتجعه اقل من الكمية المباعة', 'The returned quantity should be less than the sold quantity', MessageType.Error);
            }
        });


        $("#ddlItem" + cnt).attr("disabled", "disabled");
        $("#txtQuantity" + cnt).attr("disabled", "disabled");
        $("#txtPrice" + cnt).attr("disabled", "disabled");
        $("#txtUnitpriceWithVat" + cnt).attr("disabled", "disabled");
        $("#txtReturnQuantity" + cnt).attr("disabled", "disabled");
        $("#txtTotal" + cnt).attr("disabled", "disabled");
        $("#txtTax" + cnt).attr("disabled", "disabled");
        $("#txtTotAfterTax" + cnt).attr("disabled", "disabled");


        $('.btn-number1' + cnt).attr("disabled", "disabled");
        $('.input-number1' + cnt).attr("disabled", "disabled");

        $('.btn-number2' + cnt).attr("disabled", "disabled");
        $('.input-number2' + cnt).attr("disabled", "disabled");

        $('.btn-number3' + cnt).attr("disabled", "disabled");
        $('.input-number3' + cnt).attr("disabled", "disabled");

        $("#btnAddDetails").addClass("display_none");

        debugger
         
        $("#ddlItem" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].ItemID.toString());
        $("#txtSerial" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].Serial);
        $("#txtPrice" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].Unitprice);

        if (SlsInvoiceItemsDetails[cnt].UnitpriceWithVat == null || SlsInvoiceItemsDetails[cnt].UnitpriceWithVat == 0) {

            let GetUnitprice: IGetunitprice = Get_PriceWithVAT(SlsInvoiceItemsDetails[cnt].Unitprice, SlsInvoiceItemsDetails[cnt].VatPrc, false)
            $("#txtUnitpriceWithVat" + cnt).prop("value", GetUnitprice.unitpricewithvat);
        }
        else {
            $("#txtUnitpriceWithVat" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].UnitpriceWithVat);
        }






        if (Show == true) { // display return


            //bind Data
            $("#txt_StatusFlag" + cnt).val("");
            $("#txtReturnQuantity" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].SoldQty);
            $("#txtQuantity" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].InvoiceSoldQty);
            $("#txtTotal" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].ItemTotal);
            $("#txtTax_Rate" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].VatPrc);
            $("#txtSerial" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].Serial);
            $("#vatnatid" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].VatNatID);            
            $("#txtTax" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].VatAmount.RoundToSt(2));
            $("#txtTotAfterTax" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].NetAfterVat.RoundToSt(2));
            $("#InvoiceItemID" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].InvoiceItemID);
            $("#ddlItem" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].ItemID);



        } else { // load from invoice 
            $("#txt_StatusFlag" + cnt).val("i");
            let InvoiceSoldQty = SlsInvoiceItemsDetails[cnt].SoldQty - SlsInvoiceItemsDetails[cnt].TotRetQty;
            let total = InvoiceSoldQty * SlsInvoiceItemsDetails[cnt].NetUnitPrice;
            let vat = total * SlsInvoiceItemsDetails[cnt].VatPrc / 100;
            $("#txtReturnQuantity" + cnt).prop("value", InvoiceSoldQty);
            $("#txtQuantity" + cnt).prop("value", InvoiceSoldQty);
            $("#txtTotal" + cnt).prop("value", total.RoundToSt(2));
            $("#txtTax_Rate" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].VatPrc);
            $("#txtSerial" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].Serial);
            $("#vatnatid" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].VatNatID);
            $("#txtTax" + cnt).prop("value", vat.RoundToSt(2));
            $("#txtTotAfterTax" + cnt).prop("value", (vat + total).RoundToSt(2));
            $("#InvoiceItemID" + cnt).prop("value", 0);
            $("#txtReturnQuantity" + cnt).removeAttr("disabled");
            $("#ddlItem" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].ItemID);
            $("#btn_minus" + cnt).addClass("display_none");
            $("#btn_minus" + cnt).removeAttr("disabled");
        }







        //if (Show == true) {
        //    // disabled

        //    //bind Data

        //    $("#txt_StatusFlag" + cnt).val("u");
        //    var SoldQty = SlsInvoiceItemsDetails[cnt].TotRetQty - SlsInvoiceItemsDetails[cnt].SoldQty;
        //    if (SoldQty < 0) {
        //        SoldQty = SoldQty * -1;
        //    }
        //    $("#txtQuantity" + cnt).prop("value", SoldQty);



        //    if (InvoiceFlag == false) {
        //        //$("#txtReturnQuantity" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].SoldQty.toString());
        //        var Tot = SlsInvoiceItemsDetails[cnt].SoldQty * SlsInvoiceItemsDetails[cnt].Unitprice;
        //        $("#txtTotal" + cnt).prop("value", Tot.RoundToSt(2));
        //        var Tax = SlsInvoiceItemsDetails[cnt].VatAmount;
        //        $("#txtTax_Rate" + cnt).prop("value", SlsInvoiceItemsDetails[cnt].VatPrc);
        //        $("#txtTax" + cnt).prop("value", Tax.RoundToSt(2));
        //        var Net = SlsInvoiceItemsDetails[cnt].NetAfterVat;
        //        $("#txtTotAfterTax" + cnt).prop("value", Net.RoundToSt(2));
        //    }
        //    else {
        //        $("#txtReturnQuantity" + cnt).prop("value", "0");
        //        $("#txtTotal" + cnt).prop("value", "0");
        //        $("#txtTax" + cnt).prop("value", "0");
        //        $("#txtTotAfterTax" + cnt).prop("value", "0");

        //    }


        //}

        return;
    }
    function ComputeTotals() {
        PackageCount = 0;
        CountTotal = 0;
        TaxCount = 0;
        NetCount = 0;

        for (let i = 0; i < CountGrid; i++) {
            var flagvalue = $("#txt_StatusFlag" + i).val();
            if (flagvalue != "d") {
                var ReturnQty = Number($("#txtReturnQuantity" + i).val());
                PackageCount += ReturnQty;
                PackageCount = Number(PackageCount);

                CountTotal += Number($("#txtTotal" + i).val());
                CountTotal = Number(CountTotal.RoundToSt(2).toString());

                TaxCount += Number($("#txtTax" + i).val());
                TaxCount = Number(TaxCount.RoundToSt(2).toString());

                NetCount += Number($("#txtTotAfterTax" + i).val());
                NetCount = Number(NetCount.RoundToSt(2).toString());
            }
        }
        //// Display in footer 
        txtItemCount.value = CountItems.toString();
        txtPackageCount.value = PackageCount.toString();
        txtTotal.value = CountTotal.toString();
        txtTax.value = TaxCount.toString();
        txtNet.value = NetCount.toString();
    }
    function checkRepeatedItems(itemValue: number, NumberRowid: number) {
        var items: number = Number(txtItemCount.value);
        var flag = false;
        for (let i = 0; i < items - 1; i++) {
            if (Number($("#ddlItem" + i).val()) == itemValue && Number($("#InvoiceItemID" + i).val()) != NumberRowid) {
                flag = true;
            }
        }
        return flag;
    }
    function Insert_Serial() {

        let Ser = 1;
        for (let i = 0; i < CountGrid; i++) {
            var flagvalue = $("#txt_StatusFlag" + i).val();
            if (flagvalue != "d" && flagvalue != "m" && flagvalue != "" && flagvalue != null) {
                $("#txtSerial" + i).val(Ser);
                Ser++;
            }
        }

    }
    //----------------------------------------------------------Events region---------------------------------------
    function ddlSalesman_onchange() {
        if (ddlSalesMan.value != "null") {
            var salesmanid = Number(ddlSalesMan.value);
            Ajax.Callsync({
                type: "Get",
                url: sys.apiUrl("OperationInvoice", "GetAllSalesmanOperations"),
                data: { salesmanId: salesmanid, opstatus: chkOpenProcess.checked, CompCode: compcode, BranchCode: BranchCode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
                success: (d) => {
                    let result = d as BaseResponse;
                    if (result.IsSuccess) {
                        operationDetails = result.Response as Array<I_TR_Operation>;
                        if (chkOpenProcess.checked == false) {
                            operationDetails = operationDetails.filter(s => s.Status == 3)
                            if (ddlOPerationMaster.value == "null" || ddlOPerationMaster.value == "") { txtOperationStatusMaster.value = ""; }
                            else { txtOperationStatusMaster.value = "مغلقة"; }
                        } else {
                            operationDetails = operationDetails.filter(s => s.Status == 2)
                            if (ddlOPerationMaster.value == "null" || ddlOPerationMaster.value == "") {
                                txtOperationStatusMaster.value = "";
                            } else { txtOperationStatusMaster.value = "مفتوحة"; }
                        }
                        if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                            DocumentActions.FillCombowithdefult(operationDetails, ddlOPerationMaster, "OperationID", "TrNo", "Select operation");
                        }
                        else {
                            DocumentActions.FillCombowithdefult(operationDetails, ddlOPerationMaster, "OperationID", "TrNo", "اختر العملية");
                        }
                    }
                }
            });
        } else {
            var opVal = ddlOPerationMaster.value;
            fillddlOperation();
            ddlOPerationMaster.value = opVal;
            txtOperationStatusMaster.value = "";
        }
    }
    function ddlOPerationMaster_onchange() {
        $("#divReturnDetails").addClass("display_none");
        if (ddlOPerationMaster.value == "null" || ddlOPerationMaster.value == "") {
            txtOperationStatusMaster.value = "";
        }
        else {
            (chkOpenProcess.checked == true || false) ? txtOperationStatusMaster.value = (lang == "ar" ? "مفتوحه" : "Opened") : txtOperationStatusMaster.value = (lang == "ar" ? "مغلقة" : "Closed");

            var oprationID = Number(ddlOPerationMaster.value);
            var operObj = operationDetailsWithoutStatus.filter(s => s.OperationID == oprationID);
            ddlSalesMan.value = operObj[0].SalesmanId.toString();
        }

    }
    function chkActive_onchecked() {
        if (chkOpenProcess.checked == false) {
            DisplayMassage(" لا يمكن تعديل مرتجع علي العمليات المغلقة", "Returns on closed operations cannot be modified", MessageType.Worning);
            chkActive.checked = true;
        } else {
            if (chkActive.checked == false && ddlInvoiceCustomer.disabled == true) {

                let operationDetailsList = operationDetailsWithoutStatus.filter(x => x.OperationID == operationGlobalID);
                if (operationDetailsList[0].Status != 2) {
                    DisplayMassage(" لايمكن اعتماد مرتجع لان العمليه غير مفتوحه", "Invoices cannot be modified on closed Processes", MessageType.Worning);
                    Errorinput(ddlOPerationMaster);
                    return;
                }
                else {
                    openReturn();

                }

            }
        }
    }
    function chkPreivilegeToEditApprovedReturns() {
        try {
            if (InvoiceStatisticsModel[0].Status == 1) {
                chkActive.disabled = !SysSession.CurrentPrivileges.CUSTOM2;
                btnUpdate.disabled = SysSession.CurrentPrivileges.EDIT;
            }
            else {
                chkActive.disabled = SysSession.CurrentPrivileges.CUSTOM2;
                btnUpdate.disabled = !SysSession.CurrentPrivileges.EDIT;
            }
        } catch (e) {

        }
    }
    function checkUnApprovedReturns(invoiceID: number) {
        let res = false;
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("SlsTrSales", "GetAllUnApprovedSlsReturnListByInvoiceID"),
            data: {
                invoiceID: invoiceID, CompCode: compcode, BranchCode: BranchCode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    if (result.Response != 0) {
                        res = true;
                    }
                }
            }
        });
        return res;
    }
    
    function ddlCustomer_onchange() {
        var customerID = Number(ddlCustomer.value);
        var custObj = VendorDetails.filter(s => s.CustomerId == customerID);
        FillddlSalesMan();
        ddlSalesMan.value = custObj[0].SalesmanId.toString();
    }
    function ddlInvoiceCustomer_onchange() {
        var customerID = Number(ddlInvoiceCustomer.value);
        var custObj = VendorDetails.filter(s => s.CustomerId == customerID);
        $("#txtCustomerName").prop("value", (lang == "ar" ? custObj[0].NAMEA : custObj[0].NAMEE));

    }
    function ddlReturnTypeShow_onchange() {

        if (ddlReturnTypeShow.value == "1") {
            $("#txtCashAmount").prop("value", "");
            var cashCustomers = VendorDetails.filter(s => s.IsCreditCustomer == false)
            if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                DocumentActions.FillCombowithdefult(cashCustomers, ddlInvoiceCustomer, "CustomerId", "NAMEE", "Select customer");
            }
            else {
                DocumentActions.FillCombowithdefult(cashCustomers, ddlInvoiceCustomer, "CustomerId", "NAMEA", "اختر العميل");
            }


        }
        else if (ddlReturnTypeShow.value == "0") {
            $("#txtCashAmount").prop("value", "");

            var creditCustomers = VendorDetails.filter(s => s.IsCreditCustomer == true);
            if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                DocumentActions.FillCombowithdefult(creditCustomers, ddlInvoiceCustomer, "CustomerId", "NAMEE", "Select customer");
            }
            else {
                DocumentActions.FillCombowithdefult(creditCustomers, ddlInvoiceCustomer, "CustomerId", "NAMEA", "اختر العميل");
            }
        }
    }
    function txtInvoiceNumber_onchange() {
        $('#div_Data').html("");
        txtItemCount.value = "";
        txtPackageCount.value = "";
        txtTotal.value = "";
        txtTax.value = "";
        txtNet.value = "";

        lblReturnNumber.value = "";
        txtInvoiceDate.value = "";
        ddlInvoiceCustomer.value = "null";
        ddlReturnTypeShow.value = "0";
        ddlFreeSalesman.value = "null";

        $('#txtCreatedBy').prop("value", "");
        $('#txtCreatedAt').prop("value", "");

        $('#txtUpdatedBy').prop("value", "");
        $('#txtUpdatedAt').prop("value", "");

        var operationid = Number(ddlOPerationMaster.value);
        var oplist = operationDetailsWithoutStatus.filter(s => s.OperationID == operationid);
        txtOPerationDetail.value = oplist[0].TrNo.toString();

        $("#divReturnDetails").removeClass("display_none");
        Show = false;
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("SlsTrSales", "GetSlsInvoiceByIDFromStatistics"),
            data: { invoiceID: RefTrID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.Response.length == 0) {
                    DisplayMassage('( لا توجد فاتورة بهذا الرقم)', '(Error)', MessageType.Error);
                    txtInvoiceNumber.innerText = "";
                    AddReturn = false;

                } else if (result.IsSuccess) {
                    AddReturn = true;
                    InvoiceStatisticsModel = result.Response as Array<IQ_GetSlsInvoiceStatisticVer2>;
                    txtInvoiceNumber.value = InvoiceStatisticsModel[0].TrNo.toString();
                    txtItemCount.value = InvoiceStatisticsModel[0].Line_Count.toString();
                    var operationID = Number(InvoiceStatisticsModel[0].OperationId);
                    operationGlobalID = Number(InvoiceStatisticsModel[0].OperationId);
                    var operationlist = operationDetailsWithoutStatus.filter(s => s.OperationID == operationID)
                    txtOPerationDetail.value = operationlist[0].TrNo.toString();
                    txtPackageCount.value = "0";
                    txtTotal.value = "0";
                    txtTax.value = "0";
                    txtNet.value = "0";

                    ddlTaxTypeHeader.value = InvoiceStatisticsModel[0].VatType.toString();
                    txtInvoiceDate.value = DateFormat(InvoiceStatisticsModel[0].TrDate.toString());
                    vatType = InvoiceStatisticsModel[0].VatType;
                    GetVatPercentage();
                    ddlFreeSalesman.value = InvoiceStatisticsModel[0].SalesmanId.toString();
                    ddlSalesPerson.value = InvoiceStatisticsModel[0].SalesPersonId.toString();
                    if (InvoiceStatisticsModel[0].CustomerId != null) {
                        ddlInvoiceCustomer.value = InvoiceStatisticsModel[0].CustomerId.toString();
                        var customerName = InvoiceStatisticsModel[0].Cus_NameA.toString();
                        $('#txtCustomerName').prop("value", customerName);
                    }
                    else {
                        var customerName = InvoiceStatisticsModel[0].CustomerName.toString();
                        $('#txtCustomerName').prop("value", customerName);
                    }
                    if (InvoiceStatisticsModel[0].Status == 1) {
                        chkActive.checked = true;
                    } else {
                        chkActive.checked = false;
                    }

                    if (InvoiceStatisticsModel[0].IsCash == true) {
                        $('#ddlReturnTypeShow').prop("value", 1);
                        $("#txtCashAmountLabel").removeClass("display_none");
                        $("#txtCashAmount").removeClass("display_none");
                        $("#txtCashAmount").val("");

                    } else {
                        $('#ddlReturnTypeShow').prop("value", 0);
                        $("#txtCashAmountLabel").addClass("display_none");
                        $("#txtCashAmount").addClass("display_none");
                        $("#txtCashAmount").val("");
                    }
                    $('#divCreationPanel').removeClass("display_none");

                    $('#txtCreatedBy').prop("value", SysSession.CurrentEnvironment.UserCode);
                    $('#txtCreatedAt').prop("value", GetDate().toString());

                    $('#txtUpdatedBy').prop("value", "");
                    $('#txtUpdatedAt').prop("value", "");
                }
            }
        });
        FillddlItem();
        if (InvoiceStatisticsModel[0].InvoiceID != 0) {
            Ajax.Callsync({
                type: "Get",
                url: sys.apiUrl("SlsTrSales", "GetSlsInvoiceItem"),
                data: { invoiceID: RefTrID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
                success: (d) => {
                    let result = d as BaseResponse;
                    if (result.IsSuccess) {
                        SlsInvoiceItemsDetails = result.Response as Array<IQ_GetSlsInvoiceItem>;
                        var buildedRows: number = 0;
                        for (let i = 0; i < SlsInvoiceItemsDetails.length; i++) {

                            if ((SlsInvoiceItemsDetails[i].SoldQty - SlsInvoiceItemsDetails[i].TotRetQty) > 0) {
                                BuildControls(i);
                                buildedRows++;
                            }
                            if (buildedRows == 0) {
                                txtInvoiceNumber.value = "";
                                DisplayMassage('( لا توجد اصناف علي هذه الفاتورة)', '(There are no items on this invoice)', MessageType.Error);
                            }
                            else {
                            }
                        }
                        CountGrid = SlsInvoiceItemsDetails.length;
                        CountItems = SlsInvoiceItemsDetails.length;
                    }
                }
            });
        }
    }
    //--------------------------------------------------- Main Functions-----------------------------------------------
    function Assign() {
        MasterDetailModel = new SlsInvoiceMasterDetails();
        InvoiceModel = new I_Sls_TR_Invoice();
        invoiceItemsModel = new Array<I_Sls_TR_InvoiceItems>();

        var StatusFlag: String;
        // Header
        InvoiceModel.VatType = vatType;
        InvoiceModel.VatAmount = Number(txtTax.value);
        InvoiceModel.CustomerName = $("#ddlInvoiceCustomer option:selected").text();
        InvoiceModel.TrType = 1//0 invoice 1 return
        InvoiceModel.SlsInvSrc = 2  // 1 from store 2 from van 
        InvoiceModel.SlsInvType = 1 //  retail 
        InvoiceModel.SalesmanId = Number(ddlFreeSalesman.value);
        InvoiceModel.SalesPersonId = Number(ddlSalesPerson.value);

        InvoiceModel.CompCode = Number(compcode);
        InvoiceModel.BranchCode = Number(BranchCode);
        InvoiceModel.OperationId = operationGlobalID;//main store
        InvoiceModel.CashBoxID = null;//main store

        //if (txtInvoiceNumber.value.toString() == "") {
        //    InvoiceModel.RefTrID = null;
        //}
        //else {
        //}

        InvoiceModel.RefTrID = RefTrID;

        if (ddlReturnTypeShow.value == "0") {
            InvoiceModel.IsCash = false;

        }
        else {
            InvoiceModel.IsCash = true;

        }
        InvoiceModel.CashAmount = $("#txtCashAmount").val();
        InvoiceModel.CustomerName = $("#ddlInvoiceCustomer option:selected").text();
        InvoiceModel.CustomerId = Number(ddlInvoiceCustomer.value);
        InvoiceModel.TrDate = txtInvoiceDate.value;
        InvoiceModel.NetAfterVat = NetCount;
        InvoiceModel.TotalAmount = Number(txtTotal.value);
        InvoiceModel.RefNO = txtRefNo.value;
        InvoiceModel.Remark = txtRemarks.value;
        if (chkActive.checked == true) {
            InvoiceModel.Status = 1;
        } else {
            InvoiceModel.Status = 0;
        }

        // Details
        for (var i = 0; i < CountGrid; i++) {
            invoiceItemSingleModel = new I_Sls_TR_InvoiceItems();
            StatusFlag = $("#txt_StatusFlag" + i).val();
            if (StatusFlag == "i") {
                invoiceItemSingleModel.InvoiceItemID = 0;
                invoiceItemSingleModel.ItemID = $("#ddlItem" + i).val();
                invoiceItemSingleModel.SoldQty = $('#txtReturnQuantity' + i).val();
                invoiceItemSingleModel.InvoiceSoldQty = $('#txtQuantity' + i).val();
                //invoiceItemSingleModel.TotRetQty = $('#txtQuantity' + i).val();
                invoiceItemSingleModel.NetUnitPrice = $("#txtPrice" + i).val();
                invoiceItemSingleModel.Unitprice = $("#txtPrice" + i).val();
                invoiceItemSingleModel.UnitpriceWithVat = $("#txtUnitpriceWithVat" + i).val();
                VatPrc = $("#txtTax_Rate" + i).val();
                let VatNatID = Number($("#txtTax_Rate" + i).attr('data-VatNatID'));
                invoiceItemSingleModel.VatPrc = VatPrc;
                //-----------------------------------------------------
                invoiceItemSingleModel.Serial = $("#txtSerial" + i).val();
                invoiceItemSingleModel.VatNatID = $("#vatnatid" + i).val();
                invoiceItemSingleModel.UomID = 1;//-----------> 
                invoiceItemSingleModel.NetUnitPriceWithVat = $("#txtUnitpriceWithVat" + i).val();
                invoiceItemSingleModel.BaseQty = 1;
                invoiceItemSingleModel.BaseQtyPrice = $("#txtPrice" + i).val();
                invoiceItemSingleModel.BaseQtyUomid = 1; //----------->
                invoiceItemSingleModel.ChargeVatNatID = null;
                invoiceItemSingleModel.DiscountVatNatID = null;
                invoiceItemSingleModel.ChargeCode = null;
                //-----------------------------------------------------
                invoiceItemSingleModel.VatAmount = $("#txtTax" + i).val();
                invoiceItemSingleModel.ItemTotal = invoiceItemSingleModel.Unitprice * invoiceItemSingleModel.SoldQty;
                invoiceItemSingleModel.StatusFlag = StatusFlag.toString();
                var Qty = Number($('#txtReturnQuantity' + i).val());
                if (Qty != 0) {
                    invoiceItemsModel.push(invoiceItemSingleModel);
                }
            }
            if (StatusFlag == "u") {
                var invoiceItemId = $("#InvoiceItemID" + i).val()
                invoiceItemSingleModel.InvoiceItemID = invoiceItemId;
                invoiceItemSingleModel.ItemID = $("#ddlItem" + i).val();
                invoiceItemSingleModel.StatusFlag = StatusFlag.toString();
                //invoiceItemSingleModel.ItemID = $("#ddlItem" + i).val();
                invoiceItemSingleModel.SoldQty = $('#txtReturnQuantity' + i).val();
                let SoldQty = Number($("#txtReturnQuantity" + i).val());
                let TotRetQty = Number($("#txtQuantity" + i).val());
                invoiceItemSingleModel.InvoiceSoldQty = (TotRetQty - SoldQty);
                //invoiceItemSingleModel.TotRetQty = $('#txtQuantity' + i).val();
                invoiceItemSingleModel.NetUnitPrice = $("#txtPrice" + i).val();
                invoiceItemSingleModel.Unitprice = $("#txtPrice" + i).val();
                invoiceItemSingleModel.UnitpriceWithVat = $("#txtUnitpriceWithVat" + i).val();
                VatPrc = $("#txtTax_Rate" + i).val();
                let VatNatID = Number($("#txtTax_Rate" + i).attr('data-VatNatID'));
                invoiceItemSingleModel.VatPrc = VatPrc;
                //-----------------------------------------------------
                invoiceItemSingleModel.Serial = $("#txtSerial" + i).val();
                invoiceItemSingleModel.UomID = 1;//----------->
                invoiceItemSingleModel.VatNatID = $("#vatnatid" + i).val(); 
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
                var Qty = Number($('#txtReturnQuantity' + i).val());
                if (Qty != 0) {
                    invoiceItemsModel.push(invoiceItemSingleModel);
                }
            }
            if (StatusFlag == "d") {
                if (EditFlag == true) {
                    if ($("#InvoiceItemID" + i).val() != "") {
                        var deletedID = $("#InvoiceItemID" + i).val();
                        invoiceItemSingleModel.StatusFlag = StatusFlag.toString();
                        invoiceItemSingleModel.InvoiceItemID = deletedID;
                        invoiceItemsModel.push(invoiceItemSingleModel);
                    }
                }
            }

        }
        MasterDetailModel.I_Sls_TR_Invoice = InvoiceModel;
        MasterDetailModel.I_Sls_TR_InvoiceItems = invoiceItemsModel;

        MasterDetailModel.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
        MasterDetailModel.UserCode = SysSession.CurrentEnvironment.UserCode;
        MasterDetailModel.CompName = SysSession.CurrentEnvironment.CompanyNameAr;
        MasterDetailModel.VatNo = SysSession.CurrentEnvironment.VatNo;
    }
    function Insert() {
        InvoiceModel.InvoiceID = 0;
        InvoiceModel.TrNo = 0;
        InvoiceModel.CreatedBy = SysSession.CurrentEnvironment.UserCode;
        InvoiceModel.CreatedAt = DateTimeFormat(Date().toString());
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("OperationInvoice", "InsertProcessReturnMasterDetail"),
            data: JSON.stringify(MasterDetailModel),
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess == true) {
                    let res = result.Response as I_Sls_TR_Invoice;
                    globalInvoiceID = res.InvoiceID;
                    DisplayMassage("تم اصدار  مرتجع رقم " + res.TrNo, '(success)', MessageType.Succeed);
                    var returnValue = res.TrNo.toString();
                    lblReturnNumber.value = returnValue.toString();
                    $('#txtCreatedBy').prop("value", SysSession.CurrentEnvironment.UserCode);
                    $('#txtCreatedAt').prop("value", DateTimeFormat(Date().toString()));
                    Success();
                    AfterInsertOrUpdateFlag = true;
                    Grid_RowDoubleClicked();
                    InsertFlag = true;
                    FlagTochooseWhichOperationID = false;
                    BindStatisticGridData();
                    DownloadInvoicePdf();
                    $('#btnPrintTransaction').removeClass("display_none");
                    Save_Succ_But();

                } else {
                    DisplayMassage("هناك خطــأ ", '(Error)', MessageType.Error);
                    InsertFlag = true;
                }
            }
        });

    }
    function Success() {
        InitializeGrid();
        $("#divReturnDetails").removeClass("display_none");
        $("#txtCashAmount").attr("disabled", "disabled");
        $("#txtCashAmountLabel").attr("disabled", "disabled");
        $("#btnProcessInvoiceSearch").attr("disabled", "disabled");
      //  $('#btnPrint').removeClass("display_none");
        $("#btnSave").addClass("display_none");
        $('#btnBack').addClass("display_none");
        $('#btnUpdate').removeClass("display_none");
        $("#divGridDetails_View").removeClass("disabledDiv");
        $("#DivFilter").removeClass("disabledDiv");
        $("#div_hedr").removeAttr("disabled")
        $("#div_hedr").removeClass("disabledDiv");
        txtInvoiceDate.disabled = true;
        chkPreivilegeToEditApprovedReturns();
        $('#btnPrintTransaction').removeClass("display_none");

        for (let i = 0; i < CountGrid; i++) {

            $("#txtReturnQuantity" + i).attr("disabled", "disabled");

            $('.btn-number1' + i).attr("disabled", "disabled");
            $('.input-number1' + i).attr("disabled", "disabled");

            $('.btn-number2' + i).attr("disabled", "disabled");
            $('.input-number2' + i).attr("disabled", "disabled");

            $('.btn-number3' + i).attr("disabled", "disabled");
            $('.input-number3' + i).attr("disabled", "disabled");

            $("#btnAddDetails").addClass("display_none");

        }

    }
    function Update() {
        let Selecteditem = SlsInvoiceStatisticsDetails.filter(x => x.InvoiceID == Number(Grid.SelectedKey));
        globalInvoiceID = Number(Selecteditem[0].InvoiceID);
        InvoiceModel.InvoiceID = globalInvoiceID;
        InvoiceModel.TrNo = Number(lblReturnNumber.value);

        if (txtInvoiceNumber.value.toString() == "") {
            InvoiceModel.RefTrID = null;
            InvoiceModel.SalesmanId = Number(ddlFreeSalesman.value);
            InvoiceModel.SalesPersonId = Number(ddlSalesPerson.value);

        }
        else {
            InvoiceModel.SalesPersonId = InvoiceStatisticsModel[0].SalesPersonId;
            InvoiceModel.SalesmanId = InvoiceStatisticsModel[0].SalesmanId;
            InvoiceModel.RefTrID = InvoiceStatisticsModel[0].RefTrID;
        }

        InvoiceModel.UpdatedBy = SysSession.CurrentEnvironment.UserCode;
        InvoiceModel.UpdatedAt = DateTimeFormat(Date().toString());

        if (InvoiceStatisticsModel.length > 0) {
            InvoiceModel.CreatedBy = InvoiceStatisticsModel[0].CreatedBy;
            InvoiceModel.CreatedAt = InvoiceStatisticsModel[0].CreatedAt;
        } else {
            InvoiceModel.CreatedBy = SysSession.CurrentEnvironment.UserCode;
            InvoiceModel.CreatedAt = DateTimeFormat(Date().toString());
        }

        MasterDetailModel.I_Sls_TR_Invoice.TrTime = InvoiceStatisticsModel[0].TrTime;

        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("OperationInvoice", "updateProcessReturnMasterDetail"),
            data: JSON.stringify(MasterDetailModel),
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess == true) {
                    let res = result.Response as I_Sls_TR_Invoice;
                    globalInvoiceID = res.InvoiceID;
                    DisplayMassage("تم تعديل المرتجع بنجاح  ", '(The return has been modified successfully)', MessageType.Succeed);
                    $('#txtUpdatedBy').prop("value", res.UpdatedBy);
                    $('#txtUpdatedAt').prop("value", res.UpdatedAt);
                    Success();
                    AfterInsertOrUpdateFlag = true;
                    Grid_RowDoubleClicked();
                    Save_Succ_But();

                } else {
                    DisplayMassage("هناك خطـأ", '(Error)', MessageType.Error);
                }
            }
        });


        EditFlag = false;
    }
    function openReturn() {

        if (!CheckPeriodDate(txtInvoiceDate.value, "I")) {
            debugger
            DisplayMassage("لا يمكنك الاضافه او التعديل في هذة الفتره المغلقه ", "Please select a Invoice data", MessageType.Error);
            Errorinput(txtInvoiceDate);
            chkActive.checked = true;
            return false
        }

        Assign();
        let Selecteditem = SlsInvoiceStatisticsDetails.filter(x => x.InvoiceID == Number(Grid.SelectedKey));
        globalInvoiceID = Number(Selecteditem[0].InvoiceID);
        InvoiceModel.InvoiceID = globalInvoiceID;
        InvoiceModel.TrNo = Number(lblReturnNumber.value);

        InvoiceModel.Status = 0;
        $('#btnPrintTransaction').removeClass("display_none");
        if (txtInvoiceNumber.value.toString() == "") {
            InvoiceModel.RefTrID = null;
            InvoiceModel.SalesmanId = Number(ddlFreeSalesman.value);
            InvoiceModel.SalesPersonId = Number(ddlSalesPerson.value);

        }
        else {
            InvoiceModel.SalesPersonId = InvoiceStatisticsModel[0].SalesPersonId;
            InvoiceModel.SalesmanId = InvoiceStatisticsModel[0].SalesmanId;
            InvoiceModel.RefTrID = InvoiceStatisticsModel[0].RefTrID
        }

        InvoiceModel.UpdatedBy = SysSession.CurrentEnvironment.UserCode;
        InvoiceModel.UpdatedAt = DateTimeFormat(Date().toString());

        if (InvoiceStatisticsModel.length > 0) {
            InvoiceModel.CreatedBy = InvoiceStatisticsModel[0].CreatedBy;
            InvoiceModel.CreatedAt = InvoiceStatisticsModel[0].CreatedAt;
        } else {
            InvoiceModel.CreatedBy = SysSession.CurrentEnvironment.UserCode;
            InvoiceModel.CreatedAt = DateTimeFormat(Date().toString());
        }

        MasterDetailModel.I_Sls_TR_Invoice.TrTime = InvoiceStatisticsModel[0].TrTime;

        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("OperationInvoice", "OpenProcessReturn"),
            data: JSON.stringify(MasterDetailModel),
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess == true) {
                    let res = result.Response as I_Sls_TR_Invoice;
                    globalInvoiceID = res.InvoiceID;
                    InitializeGrid();
                    AfterInsertOrUpdateFlag = true;
                    Grid_RowDoubleClicked();
                    chkActive.disabled = true;
                }
            }
        });
    }
    //----------------------------------------------------------PRint region---------------------------------------
    export function PrintReport(OutType: number) {
        if (!SysSession.CurrentPrivileges.PrintOut) return;
        let rp: ReportParameters = new ReportParameters();

        rp.RepType = OutType;//output report as View
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




        if (ddlSalesMan.selectedIndex > 0) { rp.SalesmanID = Number($("#ddlSalesMan").val()); }
        else { rp.SalesmanID = -1; }

        if ($("#ddlCustomer").val() == "null") { rp.CustomerID = -1; }
        else { rp.CustomerID = Number($("#ddlCustomer").val()); }

        if ($("#ddlOPerationMaster").val() == "null") { rp.OperationId = -1; }
        else { rp.OperationId = Number($("#ddlOPerationMaster").val()); }

        rp.CashType = Number($("#ddlReturnType").val());
        rp.Status = Number($("#ddlStateType").val());

        rp.TrType = 1;


        rp.src = 2;



        Ajax.Callsync({
            url: Url.Action("IProc_Rpt_operationInvoiceList", "GeneralReports"),
            data: rp,
            success: (d) => {

                let result = d.result as string;


                window.open(result, "_blank");
            }
        })
    }
    function PrintTransaction() {
        //debugger;
        if (!SysSession.CurrentPrivileges.PrintOut) return;
        let rp: ReportParameters = new ReportParameters();
        
        rp.Type = 0;
        rp.Repdesign = 1;
        rp.TRId = globalInvoiceID;
                                                                        
            rp.Name_function = "rptInvoiceNoteRet";
            localStorage.setItem("Report_Data", JSON.stringify(rp));

            localStorage.setItem("result", '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>');
             window.open(Url.Action("ReportsPopup", "Home"), "_blank");
    }

    function DownloadInvoicePdf() {


        let rp: ReportParameters = new ReportParameters();

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
        rp.Type = 0;
        rp.Repdesign = 1;
        rp.TRId = globalInvoiceID;


        Ajax.CallAsync({
            url: Url.Action("Prnt_OperationInvoice", "Reports_pdf"),
            data: rp,
            success: (d) => {
            }
        })

    }

}