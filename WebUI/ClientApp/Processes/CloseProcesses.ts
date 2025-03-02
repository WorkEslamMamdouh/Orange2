﻿
$(document).ready(() => {
    ////// ;
    CloseProcesses.InitalizeComponent();
})

namespace CloseProcesses {
    //system varables
    var AccType = 3; //نوع الحساب
    var SysSession: SystemSession = GetSystemSession(Modules.CloseProcesses);
    var compcode: Number;
    var BranchCode: number;//SharedSession.CurrentEnvironment.BranchCode;
    var sys: SystemTools = new SystemTools();
    var Finyear: number;

    //Arrays    //Models 
    var SalesmanItem: Array<IQ_GetOperationSalesmanItem> = new Array<IQ_GetOperationSalesmanItem>();
    var Get_IQ_OperationSalesman: Array<IQ_GetOperationSalesmanItem> = new Array<IQ_GetOperationSalesmanItem>();
    //var Get_IQ_OperationSalesman: Array<I_TR_OperationSalesman> = new Array<I_TR_OperationSalesman>();
    var TR_OperationItemsSum: Array<I_TR_OperationItemsSum> = new Array<I_TR_OperationItemsSum>();
    var Get_IQ_GetOperation: Array<IQ_GetOperation> = new Array<IQ_GetOperation>();
    var Selected_Data: Array<IQ_GetOperation> = new Array<IQ_GetOperation>();
    var VendorDetails: Array<A_Pay_D_Vendor> = new Array<A_Pay_D_Vendor>();
    var GetAllVendorDetails: Array<A_Pay_D_Vendor> = new Array<A_Pay_D_Vendor>();
    var SellerDetails: Array<I_Sls_D_Salesman> = new Array<I_Sls_D_Salesman>();
    var NationalityDetails: Array<G_Nationality> = new Array<G_Nationality>();
    var Cashbox_DescA: Array<A_RecPay_D_CashBox> = new Array<A_RecPay_D_CashBox>();
    var CashboxDetails: Array<A_RecPay_D_CashBox> = new Array<A_RecPay_D_CashBox>();
    var StateDetailsAr: Array<string> = new Array<string>();
    var StateDetailsEn: Array<string> = new Array<string>();
    var SearchDetails: Array<IQ_GetOperation> = new Array<IQ_GetOperation>();
    var SearchDetails_Salesman: Array<IQ_GetOperationSalesman> = new Array<IQ_GetOperationSalesman>();
    var VatTypeDetails: Array<A_D_VAT_TYPE> = new Array<A_D_VAT_TYPE>();
    var OperationDeposit;
    var DepositDetailsModel: Array<I_TR_OperationDeposit> = new Array<I_TR_OperationDeposit>();
    var DepositsingleModel: I_TR_OperationDeposit = new I_TR_OperationDeposit();
    var chargesDetailsModel: Array<I_TR_OperationCharges> = new Array<I_TR_OperationCharges>();
    var chargesingleModel: I_TR_OperationCharges = new I_TR_OperationCharges();
    var AllGetOperationMasterDetailModel: AllGetOperationMasterDisplay = new AllGetOperationMasterDisplay();
    var Model_I_TR_Operation: I_TR_Operation = new I_TR_Operation();
    var ItemFamilyDetails: Array<I_Item> = new Array<I_Item>();
    var OperationItemModel: Array<I_TR_OperationItems> = new Array<I_TR_OperationItems>();
    var OperationItemsSum: Array<I_TR_OperationItemsSum> = new Array<I_TR_OperationItemsSum>();
    var OperationItemSingleModel: I_TR_OperationItems = new I_TR_OperationItems();
    var OperationItemsSumingleModel: I_TR_OperationItemsSum = new I_TR_OperationItemsSum();
    var FamilyDetails: Array<I_ItemFamily> = new Array<I_ItemFamily>();
    var ItemBaesdFamilyDetails: Array<I_Item> = new Array<I_Item>();
    var VatTypeData: Array<A_D_VAT_TYPE> = new Array<A_D_VAT_TYPE>();
    var AddonsData: Array<I_Pur_D_Charges> = new Array<I_Pur_D_Charges>();
    var Details_Acount: Array<A_ACCOUNT> = new Array<A_ACCOUNT>();
    //DropDownlist

    var ddlStateType: HTMLSelectElement;
    var ddlSalesman: HTMLSelectElement;
    var ddlSalesmanMaster: HTMLSelectElement;
    var ddlVendor: HTMLSelectElement;
    var ddlVendorMaster: HTMLSelectElement;

    var id_divGridDetails: HTMLDivElement;

    // giedView
    var divMasterGrid: JsGrid = new JsGrid();
    var divgridItemData: JsGrid = new JsGrid();
    var OerSalesmanGrid_Master: JsGrid = new JsGrid();
    var OerSalesmanGrid_Detail: JsGrid = new JsGrid();
    //Textboxes
    var txtFromDate: HTMLInputElement;
    var txtToDate: HTMLInputElement;
    var txtdateopening: HTMLInputElement;
    var txtDateHeader: HTMLInputElement;
    var txtNationality: HTMLSelectElement;
    var ddlTrtype: HTMLSelectElement;
    var txt_tax: HTMLSelectElement;
    //buttons 
    var btnReCalculation: HTMLButtonElement;
    var btnPresent: HTMLButtonElement;
    var btnClose: HTMLButtonElement;
    var btnClose_Focus: HTMLButtonElement;
    var btnView_load: HTMLButtonElement;
    var btnExpenses: HTMLButtonElement;
    var btnOpen: HTMLButtonElement;
    var btnShow: HTMLButtonElement;
    var btnAdd: HTMLButtonElement;
    var btnUpdate_1: HTMLButtonElement;
    var btnSave_1: HTMLButtonElement;
    var btnBack_1: HTMLButtonElement;
    var btnUpdate_2: HTMLButtonElement;
    var btnSave_2: HTMLButtonElement;
    var btnBack_2: HTMLButtonElement;
    var btnUpdate_3: HTMLButtonElement;
    var btnSave_3: HTMLButtonElement;
    var btnBack_3: HTMLButtonElement;
    var btnUpdate_4: HTMLButtonElement;
    var btnSave_4: HTMLButtonElement;
    var btnBack_4: HTMLButtonElement;
    var btnUpdate_5: HTMLButtonElement;
    var btnSave_5: HTMLButtonElement;
    var btnBack_5: HTMLButtonElement;

    //new
    var txtTotal: HTMLInputElement;
    var txtTotalValueCharge: HTMLInputElement;
    var txtTotalVatCharge: HTMLInputElement;
    var txtTotalAfterVatCharge: HTMLInputElement;
    var txtClose_Adjustment: HTMLInputElement;
    var txtClose_SalesManCommition: HTMLInputElement;
    var txtClose_CompanyCommitionPrc: HTMLInputElement;
    var txtTruckNumber: HTMLInputElement;
    var txtPaperPurchaseValue: HTMLInputElement;
    var txtClose_CompanyCommition: HTMLInputElement;
    var txtClose_Marketting: HTMLInputElement;
    var textClose_Coolingandstorage: HTMLInputElement;
    var txtVatPrc: HTMLInputElement;
    var txtVatAmount: HTMLInputElement;
    var txtCustomNo: HTMLInputElement;
    var txtPolice_num: HTMLInputElement;
    var txtPortName: HTMLInputElement;
    var btnAddDetails: HTMLButtonElement;
    var btnAddDetailsItemsData: HTMLButtonElement;
    var btnAddDetailsCharge: HTMLButtonElement;
    var btnAddDetailslebel: HTMLButtonElement;
    var searchbutmemreport: HTMLInputElement;
    var searchOerSalesmanGrid_Master: HTMLInputElement;

    //flags 
    var nameGlopl = "";
    var CountGrid = -1;
    var CountGridCharge = 0;
    var CountGridItemsData = 0;
    var CountGridDeposit = 0;
    var CountItems: number = 0;
    var CountItemsData: number = 0;
    var CountItemsCharge: number = 0;
    var golabelcnt: number = 0;
    var OperationID;
    var VatPrc;
    var FlagIns_Operation;
    var flag_Back = false;
    var flag_Success_2 = false;
    var flag_Success_3 = false;
    var flag_Success_5 = false;
    var Status: number;
    var flag_succ_insert = false;
    var flag_Add = false;
    var Update_1 = false;
    var Update_2 = false;
    var Update_3 = false;
    var Update_4 = false;
    var Update_5 = false;
    var IsGenerated = false;
    var Save_Add = false;
    var Ready = 0;

    var bramterItemID = 0;
    var bramterOperationID = 0;
    var bramterOperationItemID = 0;
    var SalesmanId_Deposit = 0;
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);
    var SalesmanItem_Data: Array<IQ_GetOperationSalesmanItem> = new Array<IQ_GetOperationSalesmanItem>();
    var SalesmanItem_Assign: Array<I_TR_OperationSalesmanItem> = new Array<I_TR_OperationSalesmanItem>();
    var ListOp_Deposit_SalItem: ListOperationDepositDetail = new ListOperationDepositDetail();

    //------------------------------------report print ------------------------------
    var btnPrintTrview: HTMLButtonElement;
    var btnPrintTrPDF: HTMLButtonElement;
    var btnPrintTrEXEL: HTMLButtonElement;
    var btnPrint: HTMLButtonElement;
    //------------------------------------report print 1------------------------------
    var btnPrintTrview1: HTMLButtonElement;
    var btnPrintTrPDF1: HTMLButtonElement;
    var btnPrintTrEXEL1: HTMLButtonElement;
    var btnPrint1: HTMLButtonElement;
    //------------------------------------report print 2------------------------------
    var btnPrintTrview2: HTMLButtonElement;
    var btnPrintTrPDF2: HTMLButtonElement;
    var btnPrintTrEXEL2: HTMLButtonElement;
    var btnPrint2: HTMLButtonElement;
    //------------------------------------report print 3------------------------------
    var btnPrintTrview3: HTMLButtonElement;
    var btnPrintTrPDF3: HTMLButtonElement;
    var btnPrintTrEXEL3: HTMLButtonElement;
    var btnPrint3: HTMLButtonElement;
    //------------------------------------report print4------------------------------
    var btnPrintTrview4: HTMLButtonElement;
    var btnPrintTrPDF4: HTMLButtonElement;
    var btnPrintTrEXEL4: HTMLButtonElement;
    var btnPrint4: HTMLButtonElement;


    // button print 
    var btnPrintStock: HTMLButtonElement;
    var btnPrintDeposit: HTMLButtonElement;


    // button print   Operationsummary and sales History
    var btnPrintOperationsummary: HTMLButtonElement;
    var btnPrintsalesrecord: HTMLButtonElement;



    export function InitalizeComponent() {



        $("#NoDubleclick").val('1');


        $("#div_Master").attr("disabled", "disabled").off('click');
        $("#div_Master").addClass("disabledDiv");

        $("#DivShow").attr("disabled", "disabled").off('click');
        ////$("#DivShow").addClass("disabledDiv");

        $("#data_lebel").attr("disabled", "disabled").off('click');
        $("#data_lebel").addClass("disabledDiv");

        $("#open_Trill").attr("disabled", "disabled").off('click');
        $("#open_Trill").addClass("disabledDiv");

        $("#divProcessClose").attr("disabled", "disabled").off('click');
        $("#divProcessClose").addClass("disabledDiv");

        Finyear = Number(SysSession.CurrentEnvironment.CurrentYear);
        // 

        $("#btnAdd").addClass("d-none");
        $("#btnUpdate").addClass("d-none");
        $("#btnPrintTransaction").addClass("d-none");
        $("#btnSave").addClass("d-none");
        $("#btnBack").addClass("d-none");
        $("#btnPrintTrview").addClass("print-list");
        $("#btnPrintTrPDF").addClass("print-list");
        $("#btnPrintTrEXEL").addClass("print-list");
        $("#btnPrintTrview span").text("طباعه قائمه عمليات");
        $("#btnPrintTrPDF span").text("PDF 'قائمه عمليات'");
        $("#btnPrintTrEXEL span").text("Excel 'قائمه عمليات'");
        InitalizeControls();
        IntializeEvents();
        FillddlVendorMaster();
        txtdateopening.value = GetDate();
        FillddlSalesmanMaster();
        FillddlCashBox();
        FillddlNationality();
        FillddlFamily();
        GetVatType();
        GetAddonsData();
        GetAllIItem();
        Display_Acount_Code();
        FillddlVendor();
        InitializeSalnMaGrid();
        InitializeSalnMaItemGrid();

        txtFromDate.value = DateStartMonth();
        txtToDate.value = ConvertToDateDash(GetDate()) <= ConvertToDateDash(SysSession.CurrentEnvironment.EndDate) ? GetDate() : SysSession.CurrentEnvironment.EndDate;

        fillddlVatType();
        $('#btnPrint').addClass('display_none');
        $('#btnPrint1').addClass('display_none');
        $('#btnPrint2').addClass('display_none');
        $('#btnPrint3').addClass('display_none');
        $('#btnPrint4').addClass('display_none');

    }
    function InitalizeControls() {

        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);
        //Drop Downlists

        ddlStateType = document.getElementById("ddlStateType") as HTMLSelectElement;
        ddlSalesman = document.getElementById("ddlSalesman") as HTMLSelectElement;
        ddlSalesmanMaster = document.getElementById("ddlSalesmanMaster") as HTMLSelectElement;
        ddlVendor = document.getElementById("ddlVendor") as HTMLSelectElement;
        ddlVendorMaster = document.getElementById("ddlVendorMaster") as HTMLSelectElement;
        txtNationality = document.getElementById("txtNationality") as HTMLSelectElement;
        ddlTrtype = document.getElementById("ddlTrtype") as HTMLSelectElement;
        txt_tax = document.getElementById("txt_tax") as HTMLSelectElement;

        id_divGridDetails = document.getElementById("divMasterGridiv") as HTMLDivElement;

        //textboxes
        txtFromDate = document.getElementById("txtFromDate") as HTMLInputElement;
        txtToDate = document.getElementById("txtToDate") as HTMLInputElement;
        txtdateopening = document.getElementById("txtdateopening") as HTMLInputElement;
        txtTotal = document.getElementById("txtTotal") as HTMLInputElement;
        txtTotalValueCharge = document.getElementById("txtTotalValueCharge") as HTMLInputElement;
        txtTotalVatCharge = document.getElementById("txtTotalVatCharge") as HTMLInputElement;
        txtTotalAfterVatCharge = document.getElementById("txtTotalAfterVatCharge") as HTMLInputElement;
        txtClose_Adjustment = document.getElementById("txtClose_Adjustment") as HTMLInputElement;
        txtClose_SalesManCommition = document.getElementById("txtClose_SalesManCommition") as HTMLInputElement;
        txtClose_CompanyCommitionPrc = document.getElementById("txtClose_CompanyCommitionPrc") as HTMLInputElement;
        searchbutmemreport = document.getElementById("searchbutmemreport") as HTMLInputElement;
        searchOerSalesmanGrid_Master = document.getElementById("searchOerSalesmanGrid_Master") as HTMLInputElement;
        txtClose_CompanyCommition = document.getElementById("txtClose_CompanyCommition") as HTMLInputElement;
        txtClose_Marketting = document.getElementById("txtClose_Marketting") as HTMLInputElement;
        textClose_Coolingandstorage = document.getElementById("textClose_Coolingandstorage") as HTMLInputElement;
        txtVatPrc = document.getElementById("txtVatPrc") as HTMLInputElement;
        txtVatAmount = document.getElementById("txtVatAmount") as HTMLInputElement;

        txtTruckNumber = document.getElementById("txtTruckNumber") as HTMLInputElement;
        txtPaperPurchaseValue = document.getElementById("txtPaperPurchaseValue") as HTMLInputElement;
        txtCustomNo = document.getElementById("txtCustomNo") as HTMLInputElement;
        txtPolice_num = document.getElementById("txtPolice_num") as HTMLInputElement;
        txtPortName = document.getElementById("txtPortName") as HTMLInputElement;
        txtDateHeader = document.getElementById("txtDate") as HTMLInputElement;

        //buttons
        btnReCalculation = document.getElementById("btnReCalculation") as HTMLButtonElement;
        btnPresent = document.getElementById("btnPresent") as HTMLButtonElement;
        btnClose = document.getElementById("btnClose") as HTMLButtonElement;
        btnClose_Focus = document.getElementById("btnClose_Focus") as HTMLButtonElement;
        btnView_load = document.getElementById("btnView_load") as HTMLButtonElement;
        btnExpenses = document.getElementById("btnExpenses") as HTMLButtonElement;
        btnOpen = document.getElementById("btnOpen") as HTMLButtonElement;



        btnShow = document.getElementById("btnShow") as HTMLButtonElement;
        btnAdd = document.getElementById("btnAdd") as HTMLButtonElement;
        btnUpdate_1 = document.getElementById("btnUpdate_1") as HTMLButtonElement;
        btnBack_1 = document.getElementById("btnBack_1") as HTMLButtonElement;
        btnSave_1 = document.getElementById("btnSave_1") as HTMLButtonElement;
        btnUpdate_2 = document.getElementById("btnUpdate_2") as HTMLButtonElement;
        btnBack_2 = document.getElementById("btnBack_2") as HTMLButtonElement;
        btnSave_2 = document.getElementById("btnSave_2") as HTMLButtonElement;
        btnUpdate_3 = document.getElementById("btnUpdate_3") as HTMLButtonElement;
        btnBack_3 = document.getElementById("btnBack_3") as HTMLButtonElement;
        btnSave_3 = document.getElementById("btnSave_3") as HTMLButtonElement;
        btnUpdate_4 = document.getElementById("btnUpdate_4") as HTMLButtonElement;
        btnBack_4 = document.getElementById("btnBack_4") as HTMLButtonElement;
        btnSave_4 = document.getElementById("btnSave_4") as HTMLButtonElement;
        btnUpdate_5 = document.getElementById("btnUpdate_5") as HTMLButtonElement;
        btnBack_5 = document.getElementById("btnBack_5") as HTMLButtonElement;
        btnSave_5 = document.getElementById("btnSave_5") as HTMLButtonElement;

        btnAddDetails = document.getElementById("btnAddDetails") as HTMLButtonElement;
        btnAddDetailsItemsData = document.getElementById("btnAddDetailsItemsData") as HTMLButtonElement;
        btnAddDetailsCharge = document.getElementById("btnAddDetailsCharge") as HTMLButtonElement;
        btnAddDetailslebel = document.getElementById("btnAddDetailslebel") as HTMLButtonElement;

        //--------------------------- print Button  
        btnPrint = document.getElementById("btnPrint") as HTMLButtonElement;
        btnPrintTrview = document.getElementById("btnPrintTrview") as HTMLButtonElement;
        btnPrintTrPDF = document.getElementById("btnPrintTrPDF") as HTMLButtonElement;
        btnPrintTrEXEL = document.getElementById("btnPrintTrEXEL") as HTMLButtonElement;
        //--------------------------- print Button1  
        btnPrint1 = document.getElementById("btnPrint1") as HTMLButtonElement;
        btnPrintTrview1 = document.getElementById("btnPrintTrview1") as HTMLButtonElement;
        btnPrintTrPDF1 = document.getElementById("btnPrintTrPDF1") as HTMLButtonElement;
        btnPrintTrEXEL1 = document.getElementById("btnPrintTrEXEL1") as HTMLButtonElement;
        //--------------------------- print Button2  
        btnPrint2 = document.getElementById("btnPrint2") as HTMLButtonElement;
        btnPrintTrview2 = document.getElementById("btnPrintTrview2") as HTMLButtonElement;
        btnPrintTrPDF2 = document.getElementById("btnPrintTrPDF2") as HTMLButtonElement;
        btnPrintTrEXEL2 = document.getElementById("btnPrintTrEXEL2") as HTMLButtonElement;
        //--------------------------- print Button3  
        btnPrint3 = document.getElementById("btnPrint3") as HTMLButtonElement;
        btnPrintTrview3 = document.getElementById("btnPrintTrview3") as HTMLButtonElement;
        btnPrintTrPDF3 = document.getElementById("btnPrintTrPDF3") as HTMLButtonElement;
        btnPrintTrEXEL3 = document.getElementById("btnPrintTrEXEL3") as HTMLButtonElement;
        //--------------------------- print Button4  
        btnPrint4 = document.getElementById("btnPrint4") as HTMLButtonElement;
        btnPrintTrview4 = document.getElementById("btnPrintTrview4") as HTMLButtonElement;
        btnPrintTrPDF4 = document.getElementById("btnPrintTrPDF4") as HTMLButtonElement;
        btnPrintTrEXEL4 = document.getElementById("btnPrintTrEXEL4") as HTMLButtonElement;


        btnPrintStock = document.getElementById("btnPrintStock") as HTMLButtonElement;
        btnPrintDeposit = document.getElementById("btnPrintDeposit") as HTMLButtonElement;
        //---------------------

        // button print   Operationsummary and sales History
        btnPrintOperationsummary = document.getElementById("btnPrintOperationsummary") as HTMLButtonElement;
        btnPrintsalesrecord = document.getElementById("btnPrintsalesrecord") as HTMLButtonElement;

        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") { document.getElementById('Screen_name').innerHTML = "اغلاق الارساليات"; }
        else { document.getElementById('Screen_name').innerHTML = "Close Processes "; }

    }
    function IntializeEvents() {
        btnAddDetailsCharge.onclick = AddNewRowCharge;
        btnAddDetailsItemsData.onclick = AddNewRowItemsData;
        btnAddDetailslebel.onclick = AddNewRowlebel;
        //btnAddDetails.onclick = AddNewRow;
        btnShow.onclick = btnShow_onclick;
        btnAdd.onclick = btnAdd_onclick;

        btnReCalculation.onclick = btnReCalculation_onclick;
        btnPresent.onclick = btnPresent_onclick;
        btnClose.onclick = btnClose_onclick;
        btnClose_Focus.onclick = btnClose_Focus_onclick;
        btnView_load.onclick = btnView_load_onclick;
        btnExpenses.onclick = btnExpenses_onclick;
        btnOpen.onclick = btnOpen_onclick;



        btnUpdate_1.onclick = Update_1_onclick;
        btnBack_1.onclick = btnBack_1_onclick;
        btnSave_1.onclick = btnSave_1_onclick;

        btnUpdate_2.onclick = Update_2_onclick;
        btnBack_2.onclick = btnBack_2_onclick;
        btnSave_2.onclick = btnSave_2_onclick;

        btnUpdate_3.onclick = Update_3_onclick;
        btnBack_3.onclick = btnBack_3_onclick;
        btnSave_3.onclick = btnSave_3_onclick;

        btnUpdate_4.onclick = Update_4_onclick;
        btnBack_4.onclick = btnBack_4_onclick;
        btnSave_4.onclick = btnSave_4_onclick;

        btnUpdate_5.onclick = Update_5_onclick;
        btnBack_5.onclick = btnBack_5_onclick;
        btnSave_5.onclick = btnSave_5_onclick;

        txtClose_Adjustment.onkeyup = Close_Adjustment_onChang;
        txtClose_SalesManCommition.onkeyup = Calculation_Close;
        txtClose_CompanyCommition.onkeyup = Calculation_Close;
        txtClose_CompanyCommitionPrc.onchange = CommitionPrc_onchange;
        txtClose_Marketting.onkeyup = Calculation_Close;
        textClose_Coolingandstorage.onkeyup = Calculation_Close;


        ddlVendor.onchange = ddlVendor_onchange;
        txt_tax.onchange = txt_tax_onchange;
        txtPaperPurchaseValue.onkeyup = Totaltax;
        txtVatPrc.onkeyup = Totaltax;


        //searchbutmemreport.onkeydown = _SearchBox_Change;
        searchbutmemreport.onkeyup = _SearchBox_Change;
        searchOerSalesmanGrid_Master.onkeyup = _searchOerSalesmanMaste_Change;

        id_divGridDetails.onclick = divGridDetails_onclick;
        //--------------------------- print Button  
        btnPrintTrview.onclick = () => { PrintReport(1); }
        btnPrintTrPDF.onclick = () => { PrintReport(2); }
        btnPrintTrEXEL.onclick = () => { PrintReport(3); }
        btnPrint.onclick = () => { PrintReport(4); }
        //--------------------------- print Button1  
        //btnPrintTrview1.onclick = () => { PrintReport1(1); }
        //btnPrintTrPDF1.onclick = () => { PrintReport1(2); }
        //btnPrintTrEXEL1.onclick = () => { PrintReport1(3); }
        //btnPrint1.onclick = () => { PrintReport1(4); }
        //--------------------------- print Button2  

        btnPrintTrview2.onclick = () => { PrintReport2(1); }
        btnPrintTrPDF2.onclick = () => { PrintReport2(2); }
        btnPrintTrEXEL2.onclick = () => { PrintReport2(3); }
        btnPrint2.onclick = () => { PrintReport2(4); }
        //--------------------------- print Button1  
        btnPrintTrview3.onclick = () => { PrintReport3(1); }
        btnPrintTrPDF3.onclick = () => { PrintReport3(2); }
        btnPrintTrEXEL3.onclick = () => { PrintReport3(3); }
        btnPrint3.onclick = () => { PrintReport3(4); }
        //--------------------------- print Button1  
        btnPrintTrview4.onclick = () => { PrintReport4(1); }
        btnPrintTrPDF4.onclick = () => { PrintReport4(2); }
        btnPrintTrEXEL4.onclick = () => { PrintReport4(3); }
        btnPrint4.onclick = () => { PrintReport4(4); }
        btnPrintDeposit.onclick = btnPrintDeposit_onclick;
        btnPrintStock.onclick = btnPrintStock_onclick;
        btnPrintOperationsummary.onclick = PrintOperationsummary;
        //btnPrintsalesrecord.onclick = Printsalesrecord;
        //$("#DivFilter #DivHederMaster").click(divGridDetails_onclick );
    }
    function Check_on_user_type() {


        if (SysSession.CurrentEnvironment.UserType == 1 || SysSession.CurrentEnvironment.UserType == 3) { //Salesman

            let SalesId = SysSession.CurrentEnvironment.SalesManID;
            SellerDetails = SellerDetails.filter(s => s.SalesmanId == SalesId);

        }
        else if (SysSession.CurrentEnvironment.UserType == 2) {//CashBox

        }

    }
    function fillddlVatType() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GenVatType", "GetAll"),
            data: {
                CompCode: compcode, VatType: 2, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    VatTypeDetails = result.Response as Array<A_D_VAT_TYPE>;
                    //if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                    //    DocumentActions.FillCombowithdefult(VatTypeDetails, txt_tax, "CODE", "DESCRIPTION", "Select VatType");
                    //}
                    //else {
                    //    DocumentActions.FillCombowithdefult(VatTypeDetails, txt_tax, "CODE", "DESCRIPTION", "اختر الضريبه");
                    //}

                    for (var i = 0; i < VatTypeDetails.length; i++) {

                        $('#txt_tax').append('<option Data_VatPerc="' + VatTypeDetails[i].VatPerc + '" value="' + VatTypeDetails[i].CODE + '">' + (lang == "ar" ? VatTypeDetails[i].DESCRIPTION : VatTypeDetails[i].DESCRIPTION) + '</option>');

                    }

                }
            }
        });
    }
    function FillddlVendorMaster() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefVendor", "GetAllVendorType"),
            data: { CompCode: compcode, VendorType: 1, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    VendorDetails = result.Response as Array<A_Pay_D_Vendor>;

                    if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {

                        DocumentActions.FillCombowithdefult(VendorDetails, ddlVendorMaster, "VendorID", "NAMEA", "اختر المورد");
                        //DocumentActions.FillCombowithdefult(VendorDetails, ddlVendor, "VendorID", "NAMEA", "اختر المورد");

                    }
                    else {
                        DocumentActions.FillCombowithdefult(VendorDetails, ddlVendorMaster, "VendorID", "NAMEL", "Select Vendor");
                        //DocumentActions.FillCombowithdefult(VendorDetails, ddlVendor, "VendorID", "NAMEL", "Select Vendor");
                    }

                    for (var i = 0; i < VendorDetails.length; i++) {

                        $('#ddlVendor').append('<option Data_VatType="' + VendorDetails[i].VATType + '" value="' + VendorDetails[i].VendorID + '">' + (lang == "ar" ? VendorDetails[i].NAMEA : VendorDetails[i].NAMEL) + '</option>');

                    }
                }
            }
        });
    }
    function FillddlVendor() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefVendor", "GetAllVendorType"),
            data: { CompCode: compcode, VendorType: 2, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    GetAllVendorDetails = result.Response as Array<A_Pay_D_Vendor>;


                }
            }
        });
    }
    function FillddlSalesmanMaster() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefSalesMen", "GetAllOperationPeople"),
            data: { CompCode: compcode, BranchCode: BranchCode, ISOperationEnable: true, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    SellerDetails = result.Response as Array<I_Sls_D_Salesman>;

                    Check_on_user_type();

                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {

                        DocumentActions.FillCombowithdefult(SellerDetails, ddlSalesmanMaster, "SalesmanId", "NameE", "Select Seller");
                        DocumentActions.FillCombowithdefult(SellerDetails, ddlSalesman, "SalesmanId", "NameE", "Select Seller");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(SellerDetails, ddlSalesmanMaster, "SalesmanId", "NameA", "اختر المندوب");
                        DocumentActions.FillCombowithdefult(SellerDetails, ddlSalesman, "SalesmanId", "NameA", "اختر المندوب");
                    }


                    SysSession.CurrentEnvironment.UserType == 1 || SysSession.CurrentEnvironment.UserType == 3 ? ($('#ddlSalesmanMaster option[value="null"]').remove()) : $('#ddlSalesmanMaster').prop('selectedIndex', 0);
                    SysSession.CurrentEnvironment.UserType == 1 || SysSession.CurrentEnvironment.UserType == 3 ? $('#ddlSalesman').prop('selectedIndex', 0) : $('#ddlSalesman').prop('selectedIndex', 0);

                }



            }
        });
    }
    function FillddlNationality() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("Nationality", "GetAll"),
            data: {
                CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {

                    NationalityDetails = result.Response as Array<G_Nationality>;


                    DocumentActions.FillCombowithdefult(NationalityDetails, txtNationality, "NationalityID", (lang == "ar" ? "DescA" : "DescL"), (lang == "ar" ? "اختر  الدولة" : "Select Seller"));



                }
            }
        });
    }
    function FillddlCashBox() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefBox", "GetAll"),
            data: { compCode: compcode, BranchCode: BranchCode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token, ModuleCode: Modules.CloseProcesses, FinYear: SysSession.CurrentEnvironment.CurrentYear },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    CashboxDetails = result.Response as Array<A_RecPay_D_CashBox>;

                }
            }
        });
    }
    function FillddlFamily() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("StkDefItemType", "GetAll"),
            data: {
                CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                //////// ;
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    FamilyDetails = result.Response as Array<I_ItemFamily>;
                }
            }
        });
    }
    function GetAllIItem() {
        // 
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("StkDefItems", "GetAllI_Item"),
            data: {
                CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                ////////// ;
                let result = d as BaseResponse;
                if (result.IsSuccess) {

                    ItemFamilyDetails = result.Response as Array<I_Item>;

                }
            }
        });
    }
    function FillddlItems(ItemFamilyID: number) {
        ItemBaesdFamilyDetails = ItemFamilyDetails.filter(x => x.ItemFamilyID == ItemFamilyID);
    }
    function FillddlAddonsType(cnt: number) {

        StateDetailsAr = ["خصم", "اضافة"];
        StateDetailsEn = ["Discount", "addition"];

        if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
            for (let i = 0; i < StateDetailsEn.length; i++) {

                $("#txtAddonsTypeCharge" + cnt).append(new Option(StateDetailsEn[i], i.toString()));

            }
        }
        else {
            for (let i = 0; i < StateDetailsAr.length; i++) {

                $("#txtAddonsTypeCharge" + cnt).append(new Option(StateDetailsAr[i], i.toString()));

            }
        }
    }
    function FillddlIsCashType(cnt: number) {

        StateDetailsAr = ["علي الحساب", "نقدى"];
        StateDetailsEn = ["Postpaid", "Cash"];

        if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {

            for (let i = 0; i < StateDetailsEn.length; i++) {

                $("#txtVendorIsCheckCharge" + cnt).append(new Option(StateDetailsEn[i], i.toString()));

            }
        }
        else {

            for (let i = 0; i < StateDetailsAr.length; i++) {

                $("#txtVendorIsCheckCharge" + cnt).append(new Option(StateDetailsAr[i], i.toString()));

            }
        }
    }
    function Display_Acount_Code() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GLDefAccount", "GetAcc_ByBank"),
            data: {
                CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    //// 
                    Details_Acount = result.Response as Array<A_ACCOUNT>;

                    //DisplayStkG_USERS();
                }
            }
        });
    }
    function GetVatType() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GenVatType", "GetAll"),
            data: {
                CompCode: compcode, VatType: 2, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {

                    VatTypeData = result.Response as Array<A_D_VAT_TYPE>;


                }
            }
        });
    }
    function GetAddonsData() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("Processes", "GetAllPurDefCharges"),
            data: {
                compCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {

                    AddonsData = result.Response as Array<I_Pur_D_Charges>;


                }
            }
        });
    }
    function ddlVendor_onchange() {
        let tax = $('option:selected', $("#ddlVendor")).attr('data_vattype');
        if (tax != '') {
            txt_tax.value = tax;
            txt_tax_onchange();
        }
    }
    function txt_tax_onchange() {
        txtVatPrc.value = $('option:selected', $("#txt_tax")).attr('data_VatPerc');

        Totaltax();

    }
    function Totaltax() {

        VatPrc = Number(txtVatPrc.value);
        var vatAmount = Number(txtPaperPurchaseValue.value) * VatPrc / 100;
        $("#txtVatAmount").val(vatAmount.RoundToSt(2));

        var totalAfterVat = Number(vatAmount.RoundToSt(2)) + Number(txtPaperPurchaseValue.value);
        $("#txtTotAfterTax").val(totalAfterVat.RoundToSt(2));

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
    function btnShow_onclick() {

        $('#divMasterGridiv').removeClass('display_none');
        Display();


    }

    function Display() {
        // 
        var startdt = DateFormatRep(txtFromDate.value).toString();
        var enddt = DateFormatRep(txtToDate.value).toString();
        var salesmanId = 0;
        var vendorId = 0;
        var status = 0;

        if (ddlVendorMaster.value != "null") { vendorId = Number(ddlVendorMaster.value.toString()); }
        if (ddlSalesmanMaster.value != "null") { salesmanId = Number(ddlSalesmanMaster.value.toString()); }

        status = Number(ddlStateType.value.toString());


        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("Processes", "GetAll_IQ_GetOperationItemsSum"),
            data: { CompCode: compcode, BranchCode: BranchCode, startDate: startdt, endDate: enddt, trtype: 0, Status: status, VendorId: vendorId, SalesmanId: salesmanId, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    Get_IQ_GetOperation = result.Response as Array<IQ_GetOperation>;

                    Get_IQ_GetOperation = Get_IQ_GetOperation.sort(dynamicSortNew("TrNo"));

                    InitializeGrid();
                    divMasterGrid.DataSource = Get_IQ_GetOperation;
                    divMasterGrid.Bind();
                }
            }
        });
    }


    function _SearchBox_Change() {

        $("#divMasterGrid").jsGrid("option", "pageIndex", 1);

        if (searchbutmemreport.value != "") {



            let search: string = searchbutmemreport.value.toLowerCase();
            SearchDetails = Get_IQ_GetOperation.filter(x => x.TrNo.toString().search(search) >= 0 || x.TruckNo.toLowerCase().search(search) >= 0 || x.nvd_DescA.toLowerCase().search(search) >= 0 || x.PortName.toLowerCase().search(search) >= 0);

            divMasterGrid.DataSource = SearchDetails;
            divMasterGrid.Bind();
        } else {
            divMasterGrid.DataSource = Get_IQ_GetOperation;
            divMasterGrid.Bind();
        }
    }

    function InitializeGrid() {
        //$("#divMasterGrid").attr("style", "");
        let res: any = GetResourceList("");
        divMasterGrid.ElementName = "divMasterGrid";
        divMasterGrid.Paging = true;
        divMasterGrid.PageSize = 10;
        divMasterGrid.Sorting = true;
        divMasterGrid.InsertionMode = JsGridInsertionMode.Binding;
        divMasterGrid.Editing = false;
        divMasterGrid.Inserting = false;
        divMasterGrid.SelectedIndex = 1;
        divMasterGrid.OnRowDoubleClicked = MasterGridDoubleClick;
        divMasterGrid.PrimaryKey = "OperationID";
        divMasterGrid.Columns = [
            { title: "ID", name: "OperationID", type: "text", width: "2%", visible: false },
            { title: res.App_Number, name: "TrNo", type: "number", width: "10%" },
            { title: res.Truck_number, name: "TruckNo", type: "text", width: "12%" },
            { title: res.I_Vendor, name: (lang == "ar" ? "nvd_DescA" : "Vnd_DescE"), type: "text", width: "35%" },
            { title: res.Consignment_number, name: "RefNO", type: "text", width: "14%" },
            {
                title: 'نوع الارسالية', css: "ColumPadding", name: "Trtype", width: "13%",
                itemTemplate: (s: string, item: IQ_GetOperation): HTMLLabelElement => {
                    let txt: HTMLLabelElement = document.createElement("label");
                    if (item.Trtype == 0) {
                        txt.innerHTML = "عموله";
                    } else {
                        txt.innerHTML = "مشتراه";
                    }
                    return txt;
                }
            },
            { title: res.App_Salesman, name: (lang == "ar" ? "Sls_NameA" : "Sls_NameE"), type: "text", width: "16%" },
            {
                title: res.App_date, css: "ColumPadding", name: "TrDate", width: "13%",
                itemTemplate: (s: string, item: IQ_GetOperation): HTMLLabelElement => {
                    let txt: HTMLLabelElement = document.createElement("label");
                    txt.innerHTML = DateFormat(item.TrDate);
                    return txt;
                }
            },
            {
                title: res.App_date, css: "ColumPadding", name: "ClearanceDate", width: "13%",
                itemTemplate: (s: string, item: IQ_GetOperation): HTMLLabelElement => {
                    let txt: HTMLLabelElement = document.createElement("label");
                    txt.innerHTML = DateFormat(item.ClearanceDate);
                    return txt;
                }
            },

            { title: res.Name_port_entry, name: "PortName", type: "text", width: "16%" },
            { title: res.State, name: (lang == "ar" ? "Nat_DescA" : "Nat_DescE"), type: "text", width: "12%" },
            { title: res.goods_value, name: "PaperPurchaseValue", type: "text", width: "10%" },
            { title: res.App_State, name: (lang == "ar" ? "Status_DescA" : "Status_DescE"), type: "text", width: "13%" },

        ];

    }
    function MasterGridDoubleClick() {
        Selected_Data = new Array<IQ_GetOperation>();
        

        Selected_Data = Get_IQ_GetOperation.filter(x => x.OperationID == Number(divMasterGrid.SelectedKey));

        $("#div_Master_Hedr").removeClass("display_none");
        $("#txtVoucherNo").val("");
        DisplayData(Selected_Data);

        debugger
        if (Selected_Data[0].Status == 0) {// تحت التجهيز
            Processes_under_preparing();
        }
        else if (Selected_Data[0].Status == 1) {//جاهز

        }
        else if (Selected_Data[0].Status == 2) {//مفتوحة
            Processes_Open();
        }
        else if (Selected_Data[0].Status == 3) { //مغلق
            Processes_Close();
        }
        else if (Selected_Data[0].Status == 4) { //مغلق 
            Processes_Open();
        }



        Calculation_Close();

        flag_Add = false;


        document.body.scrollTop = 400;
        document.documentElement.scrollTop = 400;
    }
    function DisplayData(Selected_Data: Array<IQ_GetOperation>) {

        CountGrid = -1;
        CountGridCharge = 0;
        $("#txtVoucherNo").val("");
        DocumentActions.RenderFromModel(Selected_Data[0]);
        try {
            var trDate: string = DateFormat(Selected_Data[0].TrDate);

        } catch (e) {

            flag_Add = true;
            flag_succ_insert = false;
            btnBack_1_onclick();
            DisplayMassage('تم الحفظ بنجاح ( برجاء اختيار التاريخ لعرض العمليه)', 'Saved successfully (Please select a date to view the operation)', MessageType.Worning);
            Errorinput(txtToDate);
            return
        }
        $('#txtDate').val(trDate);

        $('#txtClearanceDate').val(DateFormat(Selected_Data[0].ClearanceDate));
        $('#txtdateopening').val(DateFormat(Selected_Data[0].OpenAt));
        $('#ddlVendor').prop("value", Selected_Data[0].VendorID);
        $('#txtNationality').prop("value", Selected_Data[0].NationalityID);
        $('#ddlTrtype').prop("value", Selected_Data[0].Trtype);
        if (Selected_Data[0].SalesmanId != 0) {
            $('#ddlSalesman option[value=' + Selected_Data[0].SalesmanId + ']').prop('selected', 'selected').change();
        }
        else {
            $('#ddlSalesman option[value=null]').prop('selected', 'selected').change();
        }
        $('#div_Master').removeClass('disabledDiv');
        $("#div_Master").attr("disabled", "disabled").off('click');
        $("#div_Master").addClass("disabledDiv");

        $('#txtStatus').val(Selected_Data[0].Status_DescA);

        Status = Selected_Data[0].Status;

        BindGetOperationItemsGridData(Selected_Data[0].OperationID);

        OperationID = Selected_Data[0].OperationID;

        var Close_TrDate: string = DateFormat(Selected_Data[0].Close_TrDate);
        $('#txtClose_TrDate').val(Close_TrDate);

        //Calculation_Close();

        $('#Close_TotalSalesCredit').text(Selected_Data[0].Close_TotalSalesCredit.RoundToSt(2));
        $('#Close_TotalSalesCreditVAT').text(Selected_Data[0].Close_TotalSalesCreditVAT.RoundToSt(2));
        var AfterTotalSalesCreditVAT = Number(Selected_Data[0].Close_TotalSalesCredit.RoundToSt(2)) + Number(Selected_Data[0].Close_TotalSalesCreditVAT.RoundToSt(2));
        $('#Close_AfterTotalSalesCreditVAT').text(AfterTotalSalesCreditVAT.RoundToSt(2));

        $('#Close_TotalSalesCash').text(Selected_Data[0].Close_TotalSalesCash.RoundToSt(2));
        $('#Close_TotalSalesCashVAT').text(Selected_Data[0].Close_TotalSalesCashVAT.RoundToSt(2));
        var AfterTotalSalesCashVAT = Number(Selected_Data[0].Close_TotalSalesCash.RoundToSt(2)) + Number(Selected_Data[0].Close_TotalSalesCashVAT.RoundToSt(2));
        $('#Close_AfterTotalSalesCashVAT').text(AfterTotalSalesCashVAT);

        $('#Close_AllTotalSale').text((Number(Selected_Data[0].Close_TotalSalesCash.RoundToSt(2)) + Number(Selected_Data[0].Close_TotalSalesCredit.RoundToSt(2))).RoundToSt(2));
        $('#Close_AllTotalSaleVAT').text(Number(Selected_Data[0].Close_TotalSalesCashVAT.RoundToSt(2)) + Number(Selected_Data[0].Close_TotalSalesCreditVAT.RoundToSt(2)));
        $('#Close_AllAfterTotalSaleVAT').text(Number(AfterTotalSalesCreditVAT.RoundToSt(2)) + Number(AfterTotalSalesCashVAT.RoundToSt(2)));

        $('#lab_Close_CashOnhand').text(Number(Selected_Data[0].Close_CashOnhand.RoundToSt(2)));
        $('#lab_Close_CashOnBank').text(Number(Selected_Data[0].Close_CashOnBank.RoundToSt(2)));

        var Netsales = Number(($('#txtClose_TotalSalesCash').val() - (Number($('#txtClose_TotalExpenses').val() + Number($('#textClose_Coolingandstorage').val())) + Number(txtClose_Adjustment.value)) - Number($('#textClose_AdjTotalSales').val())))
        $('#txtNetsales').val(Netsales);

        showdiv();

        $('#divlepRentdata_1').removeClass('display_none');
        $('#spanlepRentdata_1').toggleClass('fa-angle-double-left');
        $('#spanlepRentdata_1').toggleClass('fa-angle-double-down');

        $('#divlepRentdata_2').removeClass('display_none');
        $('#spanlepRentdata_2').toggleClass('fa-angle-double-left');
        $('#spanlepRentdata_2').toggleClass('fa-angle-double-down');

        $('#divlepRentdata_3').removeClass('display_none');
        $('#spanlepRentdata_3').toggleClass('fa-angle-double-left');
        $('#spanlepRentdata_3').toggleClass('fa-angle-double-down');

        $('#lepRentdata').removeClass('showdiv');
        $('#spanlepRentdata_4').toggleClass('fa-angle-double-left');
        $('#spanlepRentdata_4').toggleClass('fa-angle-double-down');


        $('#divlOerSalesman_2').removeClass('showdiv');
        $('#spanlOerSalesman_2').toggleClass('fa-angle-double-left');
        $('#spanlOerSalesman_2').toggleClass('fa-angle-double-down');

        $('#lepMoney').removeClass('showdiv');
        $('#spanlepMoney_4').toggleClass('fa-angle-double-left');
        $('#spanlepMoney_4').toggleClass('fa-angle-double-down');

        IsGenerated = Selected_Data[0].IsGenerated;

        //txtTotal.value = "0";
        txtTotalValueCharge.value = "0";
        txtTotalVatCharge.value = "0";
        txtTotalAfterVatCharge.value = "0";
        txt_tax.value = Selected_Data[0].VatType == 0 ? 'null' : Selected_Data[0].VatType.toString();
        txtVatPrc.value = Selected_Data[0].VatPrc.toString();
        txtVatAmount.value = Selected_Data[0].VatAmount.toString();
        Totaltax();
        ComputeTotals();
        ComputeTotalsCharge();

        $('#Print_salsman_1').addClass('display_none');
        $('#Print_salsman_2').addClass('display_none');


    }
    function BindGetOperationItemsGridData(OperationID: number) {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("Processes", "AllGetOperationMasterDisplay"),
            data: { OperationID: OperationID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    AllGetOperationMasterDetailModel = result.Response as AllGetOperationMasterDisplay;

                    $("#div_Data").html('');
                    $("#div_ChargesData").html('');
                    $("#data_lebel").html('');

                    CountGridDeposit = 0;
                    CountItemsCharge = 0;
                    CountGrid = -1;

                    for (var i = 0; i < AllGetOperationMasterDetailModel.IQ_GetOperationItemInfo.length; i++) {

                        BuildControls(i);
                        Disbly_BuildControls(i, AllGetOperationMasterDetailModel.IQ_GetOperationItemInfo);
                        CountGrid += 1;
                    }

                    for (var i = 0; i < AllGetOperationMasterDetailModel.IQ_GetOperationCharges.length; i++) {

                        BuildControlsCharges(i);
                        Disbly_BuildControlsCharges(i, AllGetOperationMasterDetailModel.IQ_GetOperationCharges);
                        CountGridCharge += 1;
                        CountItemsCharge += 1;
                    }


                    OerSalesmanGrid_Master.DataSource = AllGetOperationMasterDetailModel.TR_OperationSalesman;
                    OerSalesmanGrid_Master.Bind();

                    SalesmanItem_Data = AllGetOperationMasterDetailModel.TR_OperationSalesmanItem;
                    OerSalesmanGrid_Detail.DataSource = AllGetOperationMasterDetailModel.TR_OperationSalesmanItem;
                    OerSalesmanGrid_Detail.Bind();

                    SalesmanItem_AllAssign(AllGetOperationMasterDetailModel.TR_OperationSalesmanItem);


                    OperationDeposit = AllGetOperationMasterDetailModel.I_TR_OperationDeposit;

                    for (var i = 0; i < OperationDeposit.length; i++) {

                        BuildControlslebel(i);
                        Disbly_BuildControlsDeposit(i, OperationDeposit);
                        CountGridDeposit += 1;

                    }

                    ComputeTotals();
                    ComputeTotalsCharge();

                }
            }
        });
    }

    function BuildControls(cnt: number) {
        var html;

        html = `<tr id="No_Row${cnt}">
                    <input id="InvoiceItemID${cnt}" type="hidden" class="form-control display_none"  />
	                <td>
		                <div class="form-group">
			                <span id="btn_minus${cnt}"><i class="fas fa-minus-circle  btn-minus"></i></span>
		                </div>
	                </td>
                     <td>
		                <div class="form-group">
			                <select id="ddlItem${cnt}" class="form-control" disabled  >
			                    <option  value="null">اختر</option>
			                </select>
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
			               <input id="txtQuantity${cnt}" type="number" disabled class="form-control"   value="0"/>
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
			               <input id="txtSoldQty${cnt}" type="number" disabled class="form-control"   value="0"/>
		                </div>
	                </td>
                     <td>
		                <div class="form-group">
			                <input id="txtScrapQty${cnt}" type="number" disabled class="form-control"   value="0"/>
		                </div>
	                </td>
                     <td>
		                <div class="form-group">
			                <input id="txtTotal${cnt}" type="number" disabled class="form-control"   value="0"/>
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
			                 <input id="txtClose_SoldQty${cnt}" type="number" disabled class="form-control"   value="0"/>
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
			                 <input id="txtClose_ScrapQty${cnt}" type="number" disabled class="form-control"   value="0"/>
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
			              <input id="txtClose_TotalSales${cnt}" type="number" disabled class="form-control"   value="0"/>
		                </div>
	                </td>
                    <input id="txt_StatusFlag${cnt}" name = " " type = "hidden" class="form-control"/>
                    <input id="txt_ID${cnt}" name = " " type = "hidden" class="form-control" />
                </tr>`;
        $("#div_Data").append(html);

        // 

        $('.btn-number1' + cnt).click(function (e) {
            e.preventDefault();
            var fieldName = $(this).attr('data-field');
            var type = $(this).attr('data-type');
            var input = $("input[name='" + fieldName + "']");
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
        $('.input-number1' + cnt).focusin(function () {
            $(this).data('oldValue', $(this).val());
        });
        $('.input-number1' + cnt).change(function () {

            var minValue = parseInt($(this).attr('min'));
            var maxValue = parseInt($(this).attr('max'));
            var valueCurrent = parseInt($(this).val());

            var name = $(this).attr('name');
            if (valueCurrent >= minValue) {
                $(".btn-number1[data-type='minus'][data-field='" + name + "']").removeAttr('disabled')
            } else {
                alert('Sorry, the minimum value was reached');
                $(this).val($(this).data('oldValue'));
            }
            if (valueCurrent <= maxValue) {
                $(".btn-number1[data-type='plus'][data-field='" + name + "']").removeAttr('disabled')
            } else {
                alert('Sorry, the maximum value was reached');
                $(this).val($(this).data('oldValue'));
            }


        });
        $('.input-number1' + cnt).keydown(function (e) {
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
            var input = $("input[name='" + fieldName + "']");
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
        $('.input-number2' + cnt).focusin(function () {
            $(this).data('oldValue', $(this).val());
        });
        $('.input-number2' + cnt).change(function () {

            var minValue = parseInt($(this).attr('min'));
            var maxValue = parseInt($(this).attr('max'));
            var valueCurrent = parseInt($(this).val());

            var name = $(this).attr('name');
            if (valueCurrent >= minValue) {
                $(".btn-number2[data-type='minus'][data-field='" + name + "']").removeAttr('disabled')
            } else {
                alert('Sorry, the minimum value was reached');
                $(this).val($(this).data('oldValue'));
            }
            if (valueCurrent <= maxValue) {
                $(".btn-number2[data-type='plus'][data-field='" + name + "']").removeAttr('disabled')
            } else {
                alert('Sorry, the maximum value was reached');
                $(this).val($(this).data('oldValue'));
            }


        });
        $('.input-number2' + cnt).keydown(function (e) {
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
        //fill dropdownlist
        // 

        var dropddlItem = '#ddlItem' + cnt;
        $('#ddlItem' + cnt).change(
            () => {
                if ($("#txt_StatusFlag" + cnt).val() != "i")
                    $("#txt_StatusFlag" + cnt).val("u");


                if ($('#ddlItem' + cnt).val() == "null") {
                    $("#txtQuantity" + cnt).val("1");
                    $("#txtPrice" + cnt).val("1");
                    $("#txtTotal" + cnt).val("0");
                    $("#txtTax" + cnt).val("0");
                    $("#txtTotAfterTax" + cnt).val("0");
                } else {
                    var selectedItem = $(dropddlItem + ' option:selected').attr('value');


                    var itemID = Number(selectedItem);
                    // var NumberSelect = ItemBaesdFamilyDetails.filter(s => s.ItemID == itemID);
                    // 



                    $("#txtPrice" + cnt).val("1");
                    var txtQuantityValue = $("#txtQuantity" + cnt).val();
                    var txtPriceValue = $("#txtPrice" + cnt).val();
                    if ($("#txtPrice" + cnt).val() == 0) {
                        var total = Number(txtQuantityValue) * 1;
                        $("#txtTotal" + cnt).val(total);
                        var vatAmount = Number(total) * VatPrc / 100;
                        $("#txtTax" + cnt).val(vatAmount);
                        var totalAfterVat = Number(vatAmount) + Number(total);
                        $("#txtTotAfterTax" + cnt).val(totalAfterVat);
                    } else {
                        var total = Number(txtQuantityValue) * Number(txtPriceValue);
                        $("#txtTotal" + cnt).val(total);
                        var vatAmount = Number(total) * VatPrc / 100;
                        $("#txtTax" + cnt).val(vatAmount);
                        var totalAfterVat = Number(vatAmount) + Number(total);
                        $("#txtTotAfterTax" + cnt).val(totalAfterVat);
                    }

                }

                //
            });

        // text change

        $("#txtQuantity" + cnt).on('keyup', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");


            var txtQuantityValue = Number($("#txtQuantity" + cnt).val());


            var txtPriceValue = $("#txtPrice" + cnt).val();
            if ($("#txtPrice" + cnt).val() != 0) {
                var total = (Number(txtQuantityValue) * Number(txtPriceValue))/* - (Number(txtQuantityReturnValue) *0)*/;
                $("#txtTotal" + cnt).val(total);
            }
            $("#txtAvailableQty" + cnt).val(Number($("#txtQuantity" + cnt).val()) - Number($("#txtSoldQty" + cnt).val()) - Number($("#txtScrapQty" + cnt).val()));
            if (Number($("#txtQuantity" + cnt).val()) < 0) {
                $("#txtQuantity" + cnt).val('0');
            }

            ComputeTotals();
        });

        $("#txtSoldQty" + cnt).on('keyup', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
            $("#txtAvailableQty" + cnt).val(Number($("#txtQuantity" + cnt).val()) - Number($("#txtSoldQty" + cnt).val()) - Number($("#txtScrapQty" + cnt).val()));
        });

        $("#txtScrapQty" + cnt).on('keyup', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");

            var Quantity = Number((Number($("#txtQuantity" + cnt).val()) - Number($("#txtSoldQty" + cnt).val())));
            if (Quantity < 0) {
                Quantity = Quantity * -1;
            }


            if (Number($("#txtScrapQty" + cnt).val()) <= Quantity) {

                $("#txtAvailableQty" + cnt).val(Number($("#txtQuantity" + cnt).val()) - Number($("#txtSoldQty" + cnt).val()) - Number($("#txtScrapQty" + cnt).val()));

            }
            else {
                DisplayMassage(' يجب ان يكون كمية الفوارغ بتساوي الكمية الصنف (' + Quantity + ')', 'The amount of voids must be equal to the item quantity(' + Quantity + ')', MessageType.Worning);
                $("#txtScrapQty" + cnt).val(Quantity);
                Errorinput($('#txtScrapQty' + cnt));

                $("#txtAvailableQty" + cnt).val('0');
            }


            if (Number($("#txtScrapQty" + cnt).val()) < 0) {
                $("#txtScrapQty" + cnt).val('0');
            }
        });

        $("#txtAvailableQty" + cnt).on('keyup', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });

        $("#txtMinPrice" + cnt).on('keyup', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");

            // 
            if ($("#txtPrice" + cnt).val() == "" || $("#txtPrice" + cnt).val() == 0) {
                DisplayMassage('يجب أدخال سعر الصنف اوالاً', 'Item price must be entered first', MessageType.Worning);
                Errorinput($("#txtPrice" + cnt));
                $("#txtMinPrice" + cnt).val(0)
            }
            else if (Number($("#txtMinPrice" + cnt).val()) > Number($("#txtPrice" + cnt).val())) {
                DisplayMassage('يجب ان يكون أقل سعر اصغر من سعر الصنف', 'The lowest price should be smaller than the item price', MessageType.Worning);
                Errorinput($("#txtMinPrice" + cnt));
                $("#txtMinPrice" + cnt).val($("#txtPrice" + cnt).val() - 1)
            }
            if (Number($("#txtMinPrice" + cnt).val()) < 0) {
                $("#txtMinPrice" + cnt).val('0');
            }

        });

        $("#txtPrice" + cnt).on('keyup', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");

            var txtQuantityValue = $("#txtQuantity" + cnt).val();

            var txtPriceValue = $("#txtPrice" + cnt).val();
            if ($("#txtPrice" + cnt).val() != 0) {
                var total = (Number(txtQuantityValue) * Number(txtPriceValue))/* - (Number(txtQuantityReturnValue) *0)*/;
                $("#txtTotal" + cnt).val(total);
            }
            if (Number($("#txtPrice" + cnt).val()) < 0) {
                $("#txtPrice" + cnt).val('0');

            }
            $("#txtAvailableQty" + cnt).val(Number($("#txtQuantity" + cnt).val()) - Number($("#txtSoldQty" + cnt).val()) - Number($("#txtScrapQty" + cnt).val()));

            $("#txtMinPrice" + cnt).val($("#txtPrice" + cnt).val() - 1);

            ComputeTotals();
        });

        $("#btn_minus" + cnt).on('click', function () {
            DeleteRow(cnt);
        });
        if (SysSession.CurrentPrivileges.Remove) {
            //$("#btn_minus" + cnt).removeClass("display_none");
            //$("#btn_minus" + cnt).removeAttr("disabled");

            $("#btn_minus" + cnt).addClass("display_none");
            $("#btn_minus" + cnt).attr("disabled", "disabled");
        }
        else {
            $("#btn_minus" + cnt).addClass("display_none");
            $("#btn_minus" + cnt).attr("disabled", "disabled");
        }
        $("#txtQuantity" + cnt).click(() => {


        });

        $("#txtPrice" + cnt).click(() => {


        });

        $("#txtAddons" + cnt).change(() => {
            $("#txtTotAddons" + cnt).val((Number($("#txtAddons" + cnt).val()) + Number($("#txtPrice" + cnt).val())));


        });



        return;

    }
    function Disbly_BuildControls(cnt: number, OperationItemInfo: Array<IQ_GetOperationItemInfo>) {
        // 														

        debugger
        $("#btnAddDetails").addClass("display_none");
        $("#btn_minus" + cnt).addClass("display_none");
        $("#txt_StatusFlag" + cnt).val("");

        for (var i = 0; i < OperationItemInfo.length; i++) {
            $('#ddlItem' + cnt).append('<option  value="' + OperationItemInfo[i].ItemID + '">' + OperationItemInfo[i].Itm_DescA + '</option>');
        }
        var itemcode = OperationItemInfo[cnt].ItemID;
        $("#txt_ID" + cnt).prop("value", OperationItemInfo[cnt].OperationItemID);
        $("#ddlItem" + cnt).prop("value", itemcode.toString());
        $("#txtQuantity" + cnt).prop("value", ((OperationItemInfo[cnt].ReceivedQty == null || undefined) ? 0 : OperationItemInfo[cnt].ReceivedQty));
        $("#txtPrice" + cnt).prop("value", (OperationItemInfo[cnt].Est_SalesPrice == null || undefined) ? 0 : OperationItemInfo[cnt].Est_SalesPrice.RoundToSt(2));
        $("#txtScrapQty" + cnt).prop("value", (OperationItemInfo[cnt].ScrapQty == null || undefined) ? 0 : OperationItemInfo[cnt].ScrapQty.RoundToSt(2));
        var Total = (Number(OperationItemInfo[cnt].ReceivedQty) * Number(OperationItemInfo[cnt].Est_SalesPrice));
        $("#txtTotal" + cnt).prop("value", (OperationItemInfo[cnt].TotalSales == null || undefined) ? 0 : OperationItemInfo[cnt].TotalSales);
        $("#txtSoldQty" + cnt).prop("value", (OperationItemInfo[cnt].SoldQty == null || undefined) ? 0 : OperationItemInfo[cnt].SoldQty);
        //var AvailableQty = (Number(OperationItemInfo[cnt].ReceivedQty) - Number(OperationItemInfo[cnt].SoldQty) - Number(OperationItemInfo[cnt].ScrapQty));
        //$("#txtAvailableQty" + cnt).prop("value", (AvailableQty));
        $("#btn_minus" + cnt).on('click', function () {
            DeleteRow(cnt);
        });

        $("#No_Row" + cnt).on('dblclick', function () {
            debugger
            //alert('100')
            golabelcnt = cnt;
            DisplayItemsData(OperationItemInfo[cnt].OperationItemID, OperationItemInfo[cnt].OperationID, cnt, OperationItemInfo[cnt].Itm_DescA);
        });
        $("#No_Row" + cnt).on('click', function () {
            debugger
            //alert('100')
            golabelcnt = cnt;
            DisplayItemsData(OperationItemInfo[cnt].OperationItemID, OperationItemInfo[cnt].OperationID, cnt, OperationItemInfo[cnt].Itm_DescA);
        });
        $("#txtClose_SoldQty" + cnt).prop("value", (OperationItemInfo[cnt].Close_SoldQty == null || undefined) ? 0 : OperationItemInfo[cnt].Close_SoldQty);
        $("#txtClose_ScrapQty" + cnt).prop("value", (OperationItemInfo[cnt].Close_ScrapQty == null || undefined) ? 0 : OperationItemInfo[cnt].Close_ScrapQty);
        $("#txtClose_TotalSales" + cnt).prop("value", (OperationItemInfo[cnt].Close_TotalSales == null || undefined) ? 0 : OperationItemInfo[cnt].Close_TotalSales);

        ComputeTotals();
    }
    function AddNewRow() {
        // 
        if (!SysSession.CurrentPrivileges.AddNew) return;
        var CanAdd: boolean = true;
        if (CountGrid > -1) {

            for (var i = 0; i <= CountGrid; i++) {
                CanAdd = Validation_Grid(i);
                if (CanAdd == false) {
                    break;
                }
            }
        }
        if (CanAdd) {
            CountGrid += 1;
            CountItems = CountItems + 1;
            BuildControls(CountGrid);
            $("#txt_StatusFlag" + CountGrid).val("i"); //In Insert mode
            $("#txtFamilyType").val(CountItems); //In Insert mode
            $("#ddlFamily" + CountGrid).removeAttr("disabled");
            $("#ddlItem" + CountGrid).removeAttr("disabled");
            $("#txtQuantity" + CountGrid).removeAttr("disabled");
            $("#txtPrice" + CountGrid).removeAttr("disabled");
            $("#txtMinPrice" + CountGrid).removeAttr("disabled");


            $("#btn_minus" + CountGrid).removeClass("display_none");
            $("#btn_minus" + CountGrid).removeAttr("disabled");

            ComputeTotals();


        }
    }
    function DeleteRow(RecNo: number) {
        if (!SysSession.CurrentPrivileges.Remove) return;
        WorningMessage("هل تريد الحذف؟", "Do you want to delete?", "تحذير", "worning", () => {


            $("#txt_StatusFlag" + RecNo).val() == 'i' ? $("#txt_StatusFlag" + RecNo).val('m') : $("#txt_StatusFlag" + RecNo).val('d');

            CountItems = CountItems - 1;
            $("#ddlFamily" + RecNo).val("1");
            $("#ddlItem" + RecNo).val("2");
            $("#txtQuantity" + RecNo).val("1");
            $("#txtPrice" + RecNo).val("1");
            $("#txtQuantityReturnValue" + RecNo).val("1111");
            $("#txtAddons" + RecNo).val("111");
            $("#txtTotAddons" + RecNo).val("111");
            $("#txtTax" + RecNo).val("111");
            $("#txtMinPrice" + RecNo).val("1111");
            $("#No_Row" + RecNo).attr("hidden", "true");
            $("#txtCode" + RecNo).val("000");
            ComputeTotals();
        });
    }
    function checkRepeatedItems(itemValue: number, familyValue: number, cnt: number) {

        var items: number = Number(CountGrid);//Error
        var flag = false;
        for (let i = 0; i < items; i++) {
            if (Number($("#ddlItem" + i).val()) == itemValue && Number($("#ddlFamily" + i).val()) == familyValue && i != cnt) {
                flag = true;
            }
        }
        return flag;
    }


    function BuildControlsCharges(cnt: number) {
        var html;
        html = `<tr id="No_Row1${cnt}">
                    <input id="OperationExpensesID${cnt}" type="text" class="form-control" style="display: none;" disabled value=""/>
	                <td>
		                <div class="form-group">
			                <span id="btn_minus1${cnt}" class="minusCharges" ><i class="fas fa-minus-circle  btn-minus"></i></span>
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
			               <input id="txtSerial${cnt}" type="text" class="form-control" disabled value="${CountItemsCharge}"/>
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
			                <select id="txtAddonsCharge${cnt}" class="form-control" value="null" ></select>
		                </div>
	                </td>
                     <td>
		                <div class="form-group">
			                <input id="txtAddonsTypeCharge${cnt}" type="text" class="form-control" disabled value=" "/>
		                </div>
	                </td>
                     <td>
		                <div class="form-group">
			                 <input id="txtValueCharge${cnt}" type="number" class="form-control"  value="0"/>
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
			                <select id="txtVatType${cnt}" class="form-control" value="null" ></select>
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
			                <input id="txtVatCharge${cnt}" type="text" value="0" class="form-control" disabled />
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
			                 <input id="txtValueAfterVatCharge${cnt}" type="text" class="form-control"  disabled  value="0" />
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
			                 <select id="txtVendorIsCheckCharge${cnt}" class="form-control"  ></select>
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
			              <input id="txtInvoiceNumberCharge${cnt}" type="text" class="form-control"  value="0"/>
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
			              <input id="txtInvoiceDateCharge${cnt}" type="date" class="form-control"  />
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
			              <select id="txtVendorCharge${cnt}" class="form-control"  ></select>
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
			              <select id="txt_D_CashBox${cnt}" name=""  disabled class="form-control" tabindex="-1" aria-hidden="true">
			                    <option value="Null"> الصندوق  </option>
			              </select>
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
			              <input id="VoucherNoCharge${cnt}" disabled type="text" class="form-control"  value="0"/>
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
			              <textarea id="RemarksCharge${cnt}" type="text" class="form-control"  value=""></textarea>
		                </div>
	                </td>
                    <input id="TrNo${cnt}" name = " " type ="hidden" class="form-control"/>
                    <input id="IsPosted${cnt}" name = " " type ="hidden" class="form-control"/>
                    <input id="txt_StatusFlag1${cnt}" name = " " type = "hidden" class="form-control"/>
                    <input id="txt_ID1${cnt}" name = " " type = "hidden" class="form-control"/>
                </tr>`;
        $("#div_ChargesData").append(html);

        $("#txtInvoiceDateCharge" + cnt).val(DateFormat(GetCurrentDate().toString()));
        // 


        $("#txtInvoiceDateCharge" + cnt).val(GetDate());
        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar")
            $('#txtVendorCharge' + cnt).append('<option value="null">' + "اختر" + '</option>');
        else
            $('#txtVendorCharge' + cnt).append('<option value="null">' + "Choose" + '</option>');

        for (var i = 0; i < GetAllVendorDetails.length; i++) {
            $('#txtVendorCharge' + cnt).append('<option value="' + GetAllVendorDetails[i].VendorID + '">' + (lang == "ar" ? GetAllVendorDetails[i].NAMEA : GetAllVendorDetails[i].NAMEL) + '</option>');
        }
        for (var i = 0; i < CashboxDetails.length; i++) {
            $('#txt_D_CashBox' + cnt).append('<option value="' + CashboxDetails[i].CashBoxID + '">' + (lang == "ar" ? CashboxDetails[i].CashBox_DescA : CashboxDetails[i].CashBox_DescE) + '</option>');

        }

        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar")
            $('#txtVatType' + cnt).append('<option value="null">' + "اختر" + '</option>');
        else
            $('#txtVatType' + cnt).append('<option value="null">' + "Choose" + '</option>');

        for (var i = 0; i < VatTypeData.length; i++) {
            if (SysSession.CurrentEnvironment.ScreenLanguage == "ar")
                $('#txtVatType' + cnt).append('<option value="' + VatTypeData[i].CODE + '">' + VatTypeData[i].DESCRIPTION + '</option>');
            else
                $('#txtVatType' + cnt).append('<option value="' + VatTypeData[i].CODE + '">' + VatTypeData[i].DESCRIPTION + '</option>');
        }

        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar")
            $('#txtAddonsCharge' + cnt).append('<option value="null">' + "اختر" + '</option>');
        else
            $('#txtAddonsCharge' + cnt).append('<option value="null">' + "Choose" + '</option>');

        for (var i = 0; i < AddonsData.length; i++) {
            if (SysSession.CurrentEnvironment.ScreenLanguage == "ar")
                $('#txtAddonsCharge' + cnt).append('<option value="' + AddonsData[i].ChargeID + '">' + AddonsData[i].DESCA + '</option>');
            else
                $('#txtAddonsCharge' + cnt).append('<option value="' + AddonsData[i].ChargeID + '">' + AddonsData[i].DESCL + '</option>');
        }

        var drop = '#txtAddonsCharge' + cnt;
        $(drop).change(function () {
            if ($("#txt_StatusFlag1" + cnt).val() != "i")
                $("#txt_StatusFlag1" + cnt).val("u");
            var Addons = Number($(drop + ' option:selected').attr('value'));
            if (isNaN(Addons)) {
                $("#txtAddonsTypeCharge" + cnt).val(" ");
            } else {
                var addTypeobj = AddonsData.filter(s => s.ChargeID == Addons);
                var addType = addTypeobj[0].IsAddition;
                if (addType == true) {
                    $("#txtAddonsTypeCharge" + cnt).val("اضافة");
                } else {
                    $("#txtAddonsTypeCharge" + cnt).val("خصم");
                }
            }
            //ComputeTotalsCharge();
        });

        FillddlIsCashType(cnt);

        $("#txtVatType" + cnt).change(function () {
            if ($("#txt_StatusFlag1" + cnt).val() != "i")
                $("#txt_StatusFlag1" + cnt).val("u");
            var selectedItem = $("#txtVatType" + cnt + ' option:selected').attr('value');
            if (selectedItem != "null") {
                var Code = Number(selectedItem);
                var NumberSelect = VatTypeData.filter(s => s.CODE == Code);
                $("#txtVatType" + cnt).attr('data-VatPerc', NumberSelect[0].VatPerc)
                var vatPercentage = Number(NumberSelect[0].VatPerc);
                var amount = Number($("#txtValueCharge" + cnt).val());
                if (amount >= 0) {
                    var vatAmount = (vatPercentage * amount) / 100;
                    $("#txtVatCharge" + cnt).val(vatAmount.RoundToSt(2));

                    $("#txtValueAfterVatCharge" + cnt).val((vatAmount.RoundToNum(2) + amount.RoundToNum(2)).RoundToSt(2));

                } else {

                    $("#txtVatCharge" + cnt).val("0");
                    $("#txtValueAfterVatCharge" + cnt).val("0");

                }
            } else {
                $("#txtVatCharge" + cnt).val("0");
                $("#txtValueAfterVatCharge" + cnt).val("0");

            }


            //ComputeTotalsCharge();
            ComputeTotalsCharge();
            //
        });

        // text change


        $("#txtValueCharge" + cnt).on('change', function () {
            if ($("#txt_StatusFlag1" + cnt).val() != "i")
                $("#txt_StatusFlag1" + cnt).val("u");

            var selectedItem = $("#txtVatType" + cnt + ' option:selected').attr('value');
            if (selectedItem != "null") {
                var Code = Number(selectedItem);
                var NumberSelect = VatTypeData.filter(s => s.CODE == Code);
                var vatPercentage = Number(NumberSelect[0].VatPerc);
                var amount = Number($("#txtValueCharge" + cnt).val());
                if (amount >= 0) {
                    var vatAmount = (vatPercentage * amount) / 100;
                    $("#txtVatCharge" + cnt).val(vatAmount.RoundToSt(2));

                    $("#txtValueAfterVatCharge" + cnt).val((vatAmount.RoundToNum(2) + amount.RoundToNum(2)).RoundToSt(2));

                } else {

                    $("#txtVatCharge" + cnt).val("0");
                    $("#txtValueAfterVatCharge" + cnt).val("0");

                }
            } else {
                $("#txtVatCharge" + cnt).val("0");
                $("#txtValueAfterVatCharge" + cnt).val("0");

            }

            ComputeTotalsCharge();
        });
        $("#txt_D_CashBox" + cnt).on('change', function () {
            if ($("#txt_StatusFlag1" + cnt).val() != "i")
                $("#txt_StatusFlag1" + cnt).val("u");

        });
        $("#txtInvoiceNumberCharge" + cnt).on('change', function () {
            if ($("#txt_StatusFlag1" + cnt).val() != "i")
                $("#txt_StatusFlag1" + cnt).val("u");

        });
        $("#RemarksCharge" + cnt).on('change', function () {
            if ($("#txt_StatusFlag1" + cnt).val() != "i")
                $("#txt_StatusFlag1" + cnt).val("u");

        });
        $("#txtInvoiceDateCharge" + cnt).on('change', function () {
            if ($("#txt_StatusFlag1" + cnt).val() != "i")
                $("#txt_StatusFlag1" + cnt).val("u");

        });
        $("#txtAddonsCharge" + cnt).on('change', function () {
            // 
            if ($("#txt_StatusFlag1" + cnt).val() != "i")
                $("#txt_StatusFlag1" + cnt).val("u");


            let ChargeID = $("#txtAddonsCharge" + cnt).val();
            let VatType = AddonsData.filter(x => x.ChargeID == ChargeID)[0].VatType;
            $("#txtVatType" + cnt).val(VatType);


            var selectedItem = $("#txtVatType" + cnt + ' option:selected').attr('value');
            if (selectedItem != "null") {
                var Code = Number(selectedItem);
                var NumberSelect = VatTypeData.filter(s => s.CODE == Code);
                $("#txtVatType" + cnt).attr('data-VatPerc', NumberSelect[0].VatPerc)
                var vatPercentage = Number(NumberSelect[0].VatPerc);
                var amount = Number($("#txtValueCharge" + cnt).val());
                if (amount >= 0) {
                    var vatAmount = (vatPercentage * amount) / 100;
                    $("#txtVatCharge" + cnt).val(vatAmount.RoundToSt(2));

                    $("#txtValueAfterVatCharge" + cnt).val((vatAmount.RoundToNum(2) + amount.RoundToNum(2)).RoundToSt(2));

                } else {

                    $("#txtVatCharge" + cnt).val("0");
                    $("#txtValueAfterVatCharge" + cnt).val("0");

                }
            } else {
                $("#txtVatCharge" + cnt).val("0");
                $("#txtValueAfterVatCharge" + cnt).val("0");

            }


            //ComputeTotalsCharge();
            ComputeTotalsCharge();

        });



        $("#txtVendorIsCheckCharge" + cnt).on('change', function () {
            // 
            if ($("#txt_StatusFlag1" + cnt).val() != "i")
                $("#txt_StatusFlag1" + cnt).val("u");
            if ($("#txtVendorIsCheckCharge" + cnt).val() == 1) {
                $("#txt_D_CashBox" + cnt).prop("disabled", false);
            }
            else { $("#txt_D_CashBox" + cnt).prop("disabled", true); $("#txt_D_CashBox" + cnt).prop("value", "Null"); }

        });


        $("#btn_minus1" + cnt).on('click', function () {
            DeleteRowCharge(cnt);
        });
        if (SysSession.CurrentPrivileges.Remove) {

            $("#btn_minus1" + cnt).removeClass("display_none");
            $("#btn_minus1" + cnt).removeAttr("disabled");
        }
        else {
            $("#btn_minus1" + cnt).addClass("display_none");
            $("#btn_minus1" + cnt).attr("disabled", "disabled");
        }


        return;

    }
    function Disbly_BuildControlsCharges(cnt: number, OperationCharges: Array<IQ_GetOperationCharges>) {

        $("#txtSerial" + cnt).attr("disabled", "disabled");
        $("#txtAddonsTypeCharge" + cnt).attr("disabled", "disabled");
        //$("#txtVatCharge" + cnt).attr("disabled", "disabled");
        //$("#txtValueAfterVatCharge" + cnt).attr("disabled", "disabled");
        //$("#btnAddDetailsCharge").addClass("display_none");
        $("#btn_minus1" + cnt).addClass("display_none");
        $("#txt_StatusFlag1" + cnt).val("");


        $("#txtInvoiceDateCharge" + cnt).val(DateFormat(OperationCharges[cnt].RefInvoiceDate));

        $("#txt_ID1" + cnt).prop("value", OperationCharges[cnt].OperationExpensesID);
        $("#txtSerial" + cnt).prop("value", (OperationCharges[cnt].Serial == null || undefined) ? 0 : OperationCharges[cnt].Serial);
        $("#txtValueCharge" + cnt).prop("value", (OperationCharges[cnt].Amount == null || undefined) ? 0 : OperationCharges[cnt].Amount);
        $("#txtVatCharge" + cnt).prop("value", (OperationCharges[cnt].VatAmount == null || undefined) ? 0 : OperationCharges[cnt].VatAmount);
        $("#txtValueAfterVatCharge" + cnt).prop("value", ((OperationCharges[cnt].NetAtferVat == null || undefined) ? 0 : OperationCharges[cnt].NetAtferVat));

        $("#txtInvoiceNumberCharge" + cnt).prop("value", (OperationCharges[cnt].RefInvoiceNo == null || undefined) ? 0 : OperationCharges[cnt].RefInvoiceNo);
        $("#RemarksCharge" + cnt).prop("value", (OperationCharges[cnt].ChRemarks == null || undefined) ? '' : OperationCharges[cnt].ChRemarks);
        $("#VoucherNoCharge" + cnt).prop("value", (OperationCharges[cnt].VoucherNo == null || undefined) ? 0 : OperationCharges[cnt].VoucherNo);
        $("#TrNo" + cnt).prop("value", (OperationCharges[cnt].TrNo == null || undefined) ? 0 : OperationCharges[cnt].TrNo);
        $("#IsPosted" + cnt).prop("checked", (OperationCharges[cnt].IsPosted == null || undefined ? false : OperationCharges[cnt].IsPosted));

        $("#txtAddonsCharge" + cnt).val(OperationCharges[cnt].ChargeID);
        FillddlAddonsType(cnt);
        $("#txtAddonsTypeCharge" + cnt).val(OperationCharges[cnt].IsAddition ? (lang == "ar" ? "اضافة" : "add") : (lang == "ar" ? "خصم" : "Discount"));
        $("#txtVatType" + cnt).val(OperationCharges[cnt].VatType);
        //$("#txtVatType" + cnt).val(OperationCharges[cnt].VatPrc);
        $("#txtVatType" + cnt).attr('data-VatPerc', OperationCharges[cnt].VatPrc);

        if (OperationCharges[cnt].CashBox_DescA != null) {
            Cashbox_DescA = CashboxDetails.filter(x => x.CashBox_DescA == OperationCharges[cnt].CashBox_DescA);
        }


        if (Number(OperationCharges[cnt].CashBoxID) > 0) {

        $("#txt_D_CashBox" + cnt).val(OperationCharges[cnt].CashBoxID);
        }
        else {
            $("#txt_D_CashBox" + cnt).val('Null');
        }

        //IsCash

        $("#txtVendorIsCheckCharge" + cnt).val(OperationCharges[cnt].isPaidByVendor ? "0" : "1");
        var OperationExpensesID = OperationCharges[cnt].OperationExpensesID;
        $("#OperationExpensesID" + cnt).prop("value", OperationExpensesID);
        //Vendor 
        $("#txtVendorCharge" + cnt).val(OperationCharges[cnt].VendorID);

        $("#btn_minus1" + cnt).on('click', function () {
            DeleteRowCharge(cnt);
        });


        $("#txtAddonsCharge" + cnt).attr("disabled", "disabled");
        $("#txtValueCharge" + cnt).attr("disabled", "disabled");
        $("#txtVatType" + cnt).attr("disabled", "disabled");
        $("#txtVendorIsCheckCharge" + cnt).attr("disabled", "disabled");
        $("#txtInvoiceNumberCharge" + cnt).attr("disabled", "disabled");
        $("#RemarksCharge" + cnt).attr("disabled", "disabled");
        $("#txtInvoiceDateCharge" + cnt).attr("disabled", "disabled");
        $("#txtVendorCharge" + cnt).attr("disabled", "disabled");


        ComputeTotalsCharge();


    }
    function AddNewRowCharge() {

        if (!SysSession.CurrentPrivileges.AddNew) return;
        var CanAddCharge: boolean = true;
        // 
        if (CountGridCharge > 0) {

            for (var i = 0; i < CountGridCharge; i++) {

                CanAddCharge = ValidationCharge_Grid(i);
                if (CanAddCharge == false) {
                    break;
                }
            }
        }
        if (CanAddCharge) {


            debugger
            BuildControlsCharges(CountGridCharge);
            $("#txt_StatusFlag1" + CountGridCharge).val("i"); //In Insert mode
            $("#btn_minus1" + CountGridCharge).removeClass("display_none");
            $("#btn_minus1" + CountGridCharge).removeAttr("disabled");
            CountGridCharge += 1;

            Insert_Serial();
            ComputeTotalsCharge();
        }
    }

    function DeleteRowCharge(RecNo: number) {
        // 
        if (!SysSession.CurrentPrivileges.Remove) return;
        WorningMessage("هل تريد الحذف؟", "Do you want to delete?", "تحذير", "worning", () => {


            $("#txt_StatusFlag1" + RecNo).val() == 'i' ? $("#txt_StatusFlag1" + RecNo).val('m') : $("#txt_StatusFlag1" + RecNo).val('d');

            CountItemsCharge = CountItemsCharge - 1;

            $("#txtAddonsCharge" + RecNo).val("Null");
            $("#txtSerial" + RecNo).val("0");
            $("#txtValueCharge" + RecNo).val("1");
            $("#txtVatType" + RecNo).val("Null");
            $("#txtVatCharge" + RecNo).val("0");
            $("#txtValueAfterVatCharge" + RecNo).val("0");
            $("#txtVendorIsCheckCharge" + RecNo).val("0");
            $("#txtInvoiceNumberCharge" + RecNo).val("00");
            $("#RemarksCharge" + RecNo).val("00");
            $("#txtInvoiceDateCharge" + RecNo).val("0");
            $("#txtVendorCharge" + RecNo).val("Null");
            $("#No_Row1" + RecNo).attr("hidden", "true");
            $("#txtCode1" + RecNo).val("000");



            Insert_Serial();
            ComputeTotalsCharge();
        });
    }
    function ComputeTotalsCharge() {

        let TotalValueCharge = 0;
        let TotalVatCharge = 0;
        let TotalAfterVatCharge = 0;

        for (var i = 0; i < CountGridCharge; i++) {

            if ($("#txt_StatusFlag1" + i).val() != 'm' && $("#txt_StatusFlag1" + i).val() != 'd') {

                TotalValueCharge += Number($("#txtValueCharge" + i).val());
                TotalVatCharge += Number($("#txtVatCharge" + i).val());
                TotalAfterVatCharge += Number($("#txtValueAfterVatCharge" + i).val());
            }

        }

        txtTotalValueCharge.value = TotalValueCharge.RoundToSt(2).toString();
        txtTotalVatCharge.value = TotalVatCharge.RoundToSt(2).toString();
        txtTotalAfterVatCharge.value = TotalAfterVatCharge.RoundToSt(2).toString();
    }

    function Insert_Serial() {

        let Chack_Flag = false;
        let flagval = "";
        let Ser = 1;
        for (let i = 0; i < CountGridCharge; i++) {
            flagval = $("#txt_StatusFlag1" + i).val();
            if (flagval != "d" && flagval != "m") {
                $("#txtSerial" + i).val(Ser);
                Ser++;
            }
            if (flagval == 'd' || flagval == 'm' || flagval == 'i') {
                Chack_Flag = true
            }
            if (Chack_Flag) {
                if ($("#txt_StatusFlag1" + i).val() != 'i' && $("#txt_StatusFlag1" + i).val() != 'm' && $("#txt_StatusFlag1" + i).val() != 'd') {
                    $("#txt_StatusFlag1" + i).val('u');
                }
            }
        }

    }

    function _searchOerSalesmanMaste_Change() {

        if (searchOerSalesmanGrid_Master.value != "") {

            let search: string = searchOerSalesmanGrid_Master.value.toLowerCase();
            SearchDetails_Salesman = AllGetOperationMasterDetailModel.TR_OperationSalesman.filter(x => x.NameA.toString().search(search) >= 0);

            OerSalesmanGrid_Master.DataSource = SearchDetails_Salesman;
            OerSalesmanGrid_Master.Bind();
        } else {
            OerSalesmanGrid_Master.DataSource = AllGetOperationMasterDetailModel.TR_OperationSalesman;
            OerSalesmanGrid_Master.Bind();
        }
    }

    function InitializeSalnMaGrid() {

        let res: any = GetResourceList("");
        OerSalesmanGrid_Master.ElementName = "OerSalesmanGrid_Master";
        OerSalesmanGrid_Master.Paging = true;
        OerSalesmanGrid_Master.PageSize = 10;
        OerSalesmanGrid_Master.Sorting = true;
        OerSalesmanGrid_Master.InsertionMode = JsGridInsertionMode.Binding;
        OerSalesmanGrid_Master.Editing = false;
        OerSalesmanGrid_Master.Inserting = false;
        OerSalesmanGrid_Master.SelectedIndex = 1;
        OerSalesmanGrid_Master.OnRowDoubleClicked = SalaGridDoubleClick;
        OerSalesmanGrid_Master.PrimaryKey = "OperationSalesmanID";
        OerSalesmanGrid_Master.Columns = [
            { title: "ID", name: "OperationSalesmanID", type: "text", width: "2%", visible: false },
            { title: res.App_Salesman, name: (lang == "ar" ? "NameA" : "NameE"), type: "text", width: "20%" },
            { title: res.Cash_Sales, name: "Close_TotalSalesCash", type: "text", width: "10%" },
            { title: res.Cash_sales_tax, name: "Close_TotalSalesCashVAT", type: "text", width: "10%" },
            { title: res.sales_credit, name: "Close_TotalSalesCredit", type: "text", width: "10%" },
            { title: res.Sales_credit_tax, name: "Close_TotalSalesCreditVAT", type: "text", width: "10%" },
            { title: res.Total_sales, name: "Close_TotalSales", type: "text", width: "10%" },
            { title: res.cash_to_sales, name: "Close_CashOnhand", type: "text", width: "10%" },
            { title: res.cash_in_bank, name: "Close_CashOnBank", type: "text", width: "10%" },
        ];

    }
    function SalaGridDoubleClick() {



        if (Selected_Data[0].Status != 3) { //مغلق 
            btnBack_5_onclick();
        }


        let OperSale = AllGetOperationMasterDetailModel.TR_OperationSalesman.filter(x => x.OperationSalesmanID == Number(OerSalesmanGrid_Master.SelectedKey));

        SalesmanId_Deposit = OperSale[0].SalesmanId;

        DisplayOperSaleMaster(SalesmanId_Deposit);



        $("#id_Lapl_Salesman").html('<i class="glyphicon glyphicon-hand-down"></i> &gt;&gt;  ' + (lang == "ar" ? ' الاصناف لدي المندوب ( ' + OperSale[0].NameA + ' ) ' : ' Items I have SalesMan ( ' + OperSale[0].NameE + ' ) ') + '   &lt;&lt; <i class="glyphicon glyphicon-hand-down"></i>');


        OperationDeposit = AllGetOperationMasterDetailModel.I_TR_OperationDeposit.filter(x => x.SalesmanId == SalesmanId_Deposit)

        CountGridDeposit = 0;
        $("#data_lebel").html('');
        for (var i = 0; i < OperationDeposit.length; i++) {

            BuildControlslebel(i);
            Disbly_BuildControlsDeposit(i, OperationDeposit);
            CountGridDeposit += 1;

        }

        $("#Financialsituation").removeAttr("disabled");
        $("#Div_Money").removeAttr("disabled");


        $('#Financialsituation').on('click', function () {
            $('#lepRentdata').toggleClass('showdiv');

            $('#spanlepRentdata_4').addClass('fa-angle-double-down');

        });

        $('#Div_Money').on('click', function () {
            $('#lepMoney').toggleClass('showdiv');

            $('#spanlepMoney_4').toggleClass('fa-angle-double-down');

        });

        $('#lepRentdata').removeClass('showdiv');
        $('#lepMoney').removeClass('showdiv');
        $('#spanlepRentdata_4').addClass('fa-angle-double-left');


    }
    function DisplayOperSaleMaster(SalesmanId: number) {


        SalesmanItem_Data = new Array<IQ_GetOperationSalesmanItem>();

        var OperSalesmanID = AllGetOperationMasterDetailModel.TR_OperationSalesman.filter(x => x.SalesmanId == SalesmanId);
        SalesmanItem_Data = AllGetOperationMasterDetailModel.TR_OperationSalesmanItem.filter(x => x.OperationSalesmanID == OperSalesmanID[0].OperationSalesmanID);


        OerSalesmanGrid_Detail.DataSource = SalesmanItem_Data;
        OerSalesmanGrid_Detail.Bind();

        SalesmanItem_AllAssign(SalesmanItem_Data);

        $('#Print_salsman_1').removeClass('display_none');
        $('#Print_salsman_2').removeClass('display_none');
    }
    function SalesmanItem_AllAssign(Item_Data: Array<IQ_GetOperationSalesmanItem>) {

        SalesmanItem_Assign = new Array<I_TR_OperationSalesmanItem>();

        for (var i = 0; i < Item_Data.length; i++) {

            let SinglSalesman = new I_TR_OperationSalesmanItem();
            SinglSalesman.OperationSalesmanItemID = Item_Data[i].OperationSalesmanItemID;
            SinglSalesman.OperationSalesmanID = Item_Data[i].OperationSalesmanID;
            SinglSalesman.OperationItemID = Item_Data[i].OperationItemID;
            SinglSalesman.OperationID = Item_Data[i].OperationID;
            SinglSalesman.ItemID = Item_Data[i].ItemID;
            SinglSalesman.OnhandQty = null;
            SinglSalesman.ReceivedQty = Item_Data[i].ReceivedQty;
            SinglSalesman.ScrapQty = Item_Data[i].ScrapQty;
            SinglSalesman.SoldQty = Item_Data[i].SoldQty;
            SinglSalesman.StatusFlag = '';

            SalesmanItem_Assign.push(SinglSalesman);
        }

    }
    function InitializeSalnMaItemGrid() {

        let res: any = GetResourceList("");
        OerSalesmanGrid_Detail.ElementName = "OerSalesmanGrid_Detail";
        OerSalesmanGrid_Detail.Paging = true;
        OerSalesmanGrid_Detail.PageSize = 10;
        OerSalesmanGrid_Detail.Sorting = true;
        OerSalesmanGrid_Detail.InsertionMode = JsGridInsertionMode.Binding;
        OerSalesmanGrid_Detail.Editing = false;
        OerSalesmanGrid_Detail.Inserting = false;
        OerSalesmanGrid_Detail.SelectedIndex = 1;
        OerSalesmanGrid_Detail.PrimaryKey = "OperationSalesmanItemID";
        OerSalesmanGrid_Detail.Columns = [
            { title: "ID", name: "OperationSalesmanItemID", type: "text", width: "2%", visible: false },
            { title: res.App_Type, name: (lang == "ar" ? "FamDescA" : "Fam_DescE"), type: "text", width: "10%" },
            { title: res.Itm_Item, name: (lang == "ar" ? "IT_DescA" : "IT_DescE"), type: "text", width: "12%" },
            { title: res.App_Quantity, name: "ReceivedQty", type: "text", width: "14%" },
            { title: res.App_soldQty, name: "SoldQty", type: "text", width: "16%" },
            //{ title: res.Voids, name: "ScrapQty", type: "text", width: "16%" },
            {
                title: res.Voids, name: "ScrapQty", type: "text", width: "10%",
                itemTemplate: (s: string, item: IQ_GetOperationSalesmanItem): HTMLInputElement => {
                    let txt: HTMLInputElement = document.createElement("input");
                    txt.type = "input";
                    txt.id = "ScrapQty" + item.OperationSalesmanItemID;
                    txt.name = "ScrapQty";
                    if (btnUpdate_5.getAttribute('class') == 'btn btn-primary display_none' && btnBack_5.getAttribute('class') != "btn btn-warning display_none") {
                        txt.disabled = false;
                    }
                    else {

                        txt.disabled = true;
                    }
                    txt.className = "form-control input-sm ScrapQty";
                    txt.onkeyup = (e) => {
                        check_OnhandQty(item.OperationSalesmanItemID);
                    };

                    txt.value = item.ScrapQty.toString();
                    txt.setAttribute('valScrapQty', item.ScrapQty.toString());


                    return txt;
                }
            },

            {
                title: res.Remaining_quantity, name: "OnhandQty", type: "text", width: "10%",
                itemTemplate: (s: string, item: IQ_GetOperationSalesmanItem): HTMLInputElement => {
                    let txt: HTMLInputElement = document.createElement("input");
                    txt.type = "input";
                    txt.id = "OnhandQty" + item.OperationSalesmanItemID;
                    txt.name = "OnhandQty";
                    txt.disabled = true;
                    txt.className = "form-control input-sm ";
                    txt.value = item.OnhandQty.toString();
                    txt.setAttribute('val', item.OnhandQty.toString());

                    return txt;
                }
            },
            //{ title: res.Remaining_quantity, name: "OnhandQty", type: "text", width: "22%" },
        ];

    }
    function check_OnhandQty(id_Num: number) {

        let ScrapQty: HTMLInputElement = document.getElementById("ScrapQty" + id_Num) as HTMLInputElement;
        let OnhandQty: HTMLInputElement = document.getElementById("OnhandQty" + id_Num) as HTMLInputElement;

        let Onhand = Number(OnhandQty.getAttribute('val')) + Number(ScrapQty.getAttribute('valScrapQty'));
        OnhandQty.value = (Number(Onhand) - Number(ScrapQty.value)).toString();
        if (Number(ScrapQty.value) > Number(Onhand)) {
            DisplayMassage(" لا يمكنك تجاوز الكمية المتبقية ( " + Onhand + " )", "You cannot exceed the remaining quantity!", MessageType.Worning);
            ScrapQty.value = Onhand.toString();
            OnhandQty.value = "0";
            Errorinput(ScrapQty);
        }

        let index = findIndexInData(SalesmanItem_Assign, 'OperationSalesmanItemID', id_Num);
        SalesmanItem_Assign[index].ScrapQty = Number(ScrapQty.value);
        SalesmanItem_Assign[index].OnhandQty = null;

    }


    function BuildControlslebel(cnt: number) {
        var html;

        html = `<tr id="row_font_header${cnt}">
                    <input id="InvoiceItemID${cnt}" type="hidden" class="form-control display_none"  />
	                <td>
		                <div class="form-group">
			                <span id="btn_minus3${cnt}"><i class="fas fa-minus-circle btn-minus"></i></span>
		                </div>
	                </td>
                     <td>
		                <div class="form-group">
			                <input id="txtSerial3${cnt}" type="number" class="form-control">
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
			               <input type="date" id="DepositDate${cnt}" class="form-control">
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
			                <select id="Salesman${cnt}" class="form-control"> 
			                    <option value="null"> ${ (lang == "ar" ? "اختار المندوب" : "Choose Salesman")} </option> 
			                </select >
		                </div>
	                </td>
                     <td>
		                <div class="form-group">
			                <input id="DepositAmount${cnt}" type="number" class="form-control">
		                </div>
	                </td>
                     <td>
		                <div class="form-group">
			               	<select id="ACC_type${cnt}" class="form-control"> 
			                    <option value="Null"> ${ (lang == "ar" ? "النوع الحساب  " : "Account Type ")}  </option> 
                                <option value="0"> ${ (lang == "ar" ? "بنك" : "Bank")} </option>
                                <option value="1"> ${ (lang == "ar" ? "صندوق" : "Cash box")} </option> 
			                </select >
		                </div>
	                </td>
                    <td>
		                <div class="form-group" id="Acc_Code_div${cnt}">
			               <select id="Acc_Code' + ${cnt}" class="form-control"> 
			                    <option value="Null"> ${ (lang == "ar" ? "رقم الحساب" : "Account Number")} </option>
			               </select >
		                </div>
                        <div class="form-group display_none" id="CashBox_div${cnt}">
			                <select id="CashBox${cnt}" class="form-control display_none"> 
			                    <option value="Null"> ${(lang == "ar" ? "الصندوق" : "CashBox")}</option>
			                </select >
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
			               <textarea rows="2"  id="Remarks${cnt}" class="form-control"></textarea>
		                </div>
	                </td>
                    <input id="txt_StatusFlag2${cnt}" name = " " type = "hidden" class="form-control"/>
                    <input id="DepositID${cnt}" name = " " type = "hidden" class="form-control"/>
                </tr>`;

        $("#data_lebel").append(html);


        let Salsman = AllGetOperationMasterDetailModel.TR_OperationSalesman

        for (var i = 0; i < Salsman.length; i++) {
            $('#Salesman' + cnt).append('<option value="' + Salsman[i].SalesmanId + '">' + (lang == "ar" ? Salsman[i].NameA : Salsman[i].NameE) + '</option>');
        }

        SalesmanId_Deposit != 0 ? $('#Salesman' + cnt).val('' + SalesmanId_Deposit + '') : $('#Salesman' + cnt).val('null');

        for (var i = 0; i < Details_Acount.length; i++) {
            $('#Acc_Code' + cnt).append('<option value="' + Details_Acount[i].ACC_CODE + '">' + (lang == "ar" ? Details_Acount[i].ACC_DESCA : Details_Acount[i].ACC_DESCL) + '</option>');
        }

        for (var i = 0; i < CashboxDetails.length; i++) {
            $('#CashBox' + cnt).append('<option value="' + CashboxDetails[i].CashBoxID + '">' + (lang == "ar" ? CashboxDetails[i].CashBox_DescA : CashboxDetails[i].CashBox_DescE) + '</option>');
        }

        $("#btn_minus3" + cnt).on('click', function () {

            DeleteRow_3(cnt);
        });
        if (SysSession.CurrentPrivileges.Remove) {
            $("#btn_minus3" + cnt).addClass("display_none");
            $("#btn_minus3" + cnt).attr("disabled", "disabled");
        }
        else {
            $("#btn_minus3" + cnt).addClass("display_none");
            $("#btn_minus3" + cnt).attr("disabled", "disabled");
        }
        $("#txtSerial3" + cnt).on('change', function () {
            // 

            if ($("#txt_StatusFlag2" + cnt).val() != "i")
                $("#txt_StatusFlag2" + cnt).val("u");
            if (Number($("#txtSerial3" + cnt).val()) < 0 || Number($("#txtSerial3" + cnt).val()) == 0) {
                DisplayMassage("يجب ادخال رقم صحيح", "You must enter a valid number", MessageType.Worning);
                Errorinput($("#txtSerial3" + cnt));
                $("#txtSerial3" + cnt).val("");
            }

            Validate_code(cnt);
        });
        $("#DepositDate" + cnt).on('keyup', function () {
            if ($("#txt_StatusFlag2" + cnt).val() != "i")
                $("#txt_StatusFlag2" + cnt).val("u");
        });
        $("#DepositAmount" + cnt).on('keyup', function () {
            if ($("#txt_StatusFlag2" + cnt).val() != "i")
                $("#txt_StatusFlag2" + cnt).val("u");
        });
        $("#ACC_type" + cnt).on('change', function () {
            if ($("#txt_StatusFlag2" + cnt).val() != "i")
                $("#txt_StatusFlag2" + cnt).val("u");

            if ($("#ACC_type" + cnt).val() == 0) {

                $('#Acc_Code' + cnt).removeClass('display_none');
                $('#Acc_Code_div' + cnt).removeClass('display_none');

                $('#CashBox' + cnt).addClass('display_none');
                $('#CashBox_div' + cnt).addClass('display_none');

                $('#Acc_Code' + cnt).removeAttr('disabled');
                $('#Acc_Code' + cnt).prop('value', 'Null');

            }
            if ($("#ACC_type" + cnt).val() == 1) {


                $('#Acc_Code' + cnt).addClass('display_none');
                $('#Acc_Code_div' + cnt).addClass('display_none');

                $('#CashBox' + cnt).removeAttr('disabled');
                $('#CashBox' + cnt).removeClass('display_none');
                $('#CashBox_div' + cnt).removeClass('display_none');

                $('#CashBox' + cnt).prop('value', 'Null');

            }

            if ($("#ACC_type" + cnt).val() == 'Null') {


                $('#Acc_Code' + cnt).attr('disabled', 'disabled');
                $('#Acc_Code' + cnt).prop('value', 'Null');

                $('#CashBox' + cnt).attr('disabled', 'disabled');
                $('#CashBox' + cnt).prop('value', 'Null');

            }

        });

        $("#Salesman" + cnt).on('change', function () {
            if ($("#txt_StatusFlag2" + cnt).val() != "i")
                $("#txt_StatusFlag2" + cnt).val("u");
        });

        $("#Acc_Code" + cnt).on('change', function () {
            if ($("#txt_StatusFlag2" + cnt).val() != "i")
                $("#txt_StatusFlag2" + cnt).val("u");
        });

        $("#CashBox" + cnt).on('change', function () {
            if ($("#txt_StatusFlag2" + cnt).val() != "i")
                $("#txt_StatusFlag2" + cnt).val("u");
        });
        $("#Remarks" + cnt).on('keyup', function () {
            if ($("#txt_StatusFlag2" + cnt).val() != "i")
                $("#txt_StatusFlag2" + cnt).val("u");
        });
    }
    function Disbly_BuildControlsDeposit(cnt: number, I_TR_OperationDeposit: Array<IQ_GetOperationDepsit>) {
        $("#btnAddDetailslebel").addClass("display_none");
        $("#btn_minus3" + cnt).addClass("display_none");
        $("#txt_StatusFlag2" + cnt).val("");

        $("#DepositID" + cnt).val(I_TR_OperationDeposit[cnt].OperationDepositID);
        $("#txtSerial3" + cnt).val(I_TR_OperationDeposit[cnt].ItemID);
        $("#DepositDate" + cnt).val(DateFormat(I_TR_OperationDeposit[cnt].DepositDate));
        $("#DepositAmount" + cnt).val(I_TR_OperationDeposit[cnt].DepositAmount);
        $("#ACC_type" + cnt).prop('value', I_TR_OperationDeposit[cnt].DepositType == null ? 'Null' : I_TR_OperationDeposit[cnt].DepositType);

        $("#Salesman" + cnt).prop('value', I_TR_OperationDeposit[cnt].SalesmanId == null ? 'null' : I_TR_OperationDeposit[cnt].SalesmanId);



        if (I_TR_OperationDeposit[cnt].DepositType == 1) {

            $('#Acc_Code' + cnt).addClass('display_none');
            $('#Acc_Code_div' + cnt).addClass('display_none');

            $('#CashBox' + cnt).removeClass('display_none');
            $('#CashBox_div' + cnt).removeClass('display_none');

            $("#CashBox" + cnt).prop('value', I_TR_OperationDeposit[cnt].CashBoxID == null ? 'Null' : I_TR_OperationDeposit[cnt].CashBoxID);

        }
        else {

            $('#Acc_Code' + cnt).removeClass('display_none');
            $('#Acc_Code_div' + cnt).removeClass('display_none');

            $('#CashBox' + cnt).addClass('display_none');
            $('#CashBox_div' + cnt).addClass('display_none');

            $("#Acc_Code" + cnt).prop('value', I_TR_OperationDeposit[cnt].Acc_Code == null ? 'Null' : I_TR_OperationDeposit[cnt].Acc_Code);


        }



        $("#Acc_Code" + cnt).prop('value', I_TR_OperationDeposit[cnt].Acc_Code);
        $("#Remarks" + cnt).val(I_TR_OperationDeposit[cnt].Remarks);

    }
    function AddNewRowlebel() {
        debugger
        if (!SysSession.CurrentPrivileges.AddNew) return;
        var CanAddDeposit: boolean = true;
        if (CountGridDeposit > 0) {

            for (var i = 0; i < CountGridDeposit; i++) {


                CanAddDeposit = ValidationDeposit_Grid(i);
                if (CanAddDeposit == false) {
                    break;
                }
            }
        }
        if (CanAddDeposit) {

            BuildControlslebel(CountGridDeposit);
            $("#txt_StatusFlag2" + CountGridDeposit).val("i"); //In Insert mode
            $("#btn_minus3" + CountGridDeposit).removeClass("display_none");
            $("#btn_minus3" + CountGridDeposit).removeAttr("disabled");
            $("#DepositDate" + CountGridDeposit).val(GetDate());

            CountGridDeposit++;
        }
    }
    function DeleteRow_3(RecNo: number) {
        if (!SysSession.CurrentPrivileges.Remove) return;
        WorningMessage("هل تريد الحذف؟", "Do you want to delete?", "تحذير", "worning", () => {


            $("#txt_StatusFlag2" + RecNo).val() == 'i' ? $("#txt_StatusFlag2" + RecNo).val('m') : $("#txt_StatusFlag2" + RecNo).val('d');


            $("#txtSerial3" + RecNo).val("1");
            $("#DepositDate" + RecNo).val("2");
            $("#DepositAmount" + RecNo).val("1");
            $("#Acc_Code" + RecNo).val("1");
            $("#Remarks" + RecNo).val("0");

            $("#row_font_header" + RecNo).attr("hidden", "true");



        });
    }

    function CommitionPrc_onchange() {
        //عمولة الشركة = عمولة الشركة / اجمالي المبيعات
        var CompanyCommition = (Number($('#txtClose_TotalSalesCash').val()) * Number($('#txtClose_CompanyCommitionPrc').val())) / 100;
        $('#txtClose_CompanyCommition').val(CompanyCommition);
        Calculation_Close()
    }
    function Calculation_Close() {
        debugger

        ComputeTotalsAdjTotalSales();
        ComputeTotalClose_Adjustment();

        //if (ddlTrtype.value == '1') { // مشتراه

        //    txtClose_CompanyCommitionPrc.disabled = true;
        //    txtClose_CompanyCommition.disabled = true;
        //    txtClose_Adjustment.value = '0';
        //    $('#Comp_comm').addClass('display_none');



        //    //صافي المبيعات = اجمالي المصروفات  + التسويه  - اجمالي المبيعات
        //    var Netsales = (Number($('#txtClose_TotalSalesCash').val()) - (Number(txtClose_Adjustment.value) + Number($('#txtClose_TotalExpenses').val()) + Number($('#textClose_Coolingandstorage').val()))).RoundToSt(2);
        //    $('#txtNetsales').val(Netsales);

        //    //نسبة العمولة  
        //    var prc = ((Number($('#txtClose_CompanyCommition').val()) * 100) / Number($('#txtClose_TotalSalesCash').val())).RoundToSt(2)
        //    $('#txtClose_CompanyCommitionPrc').val(prc);

        //    //صافي الارباح = عمولة الشركة - عمولة البائع
        //    //var NetProfit = ((Number($('#txtClose_CompanyCommition').val()) + Number($('#txtClose_Marketting').val())) - Number($('#txtClose_SalesManCommition').val()));
        //    //$('#txtClose_NetProfit').val(NetProfit.RoundToSt(2).toString());


        //    $('#txtClose_NetProfit').val(Netsales);

        //    //قيمة الشراء = صافي المبيعات - عمولة الشركة
        //    var purchaseValue = (Number($('#txtNetsales').val()) - Number($('#txtClose_CompanyCommition').val()));
        //    purchaseValue = (Number(purchaseValue) - Number($('#txtClose_Marketting').val()));
        //    purchaseValue = purchaseValue
        //    $('#txtClose_purchaseValue').val(purchaseValue.RoundToSt(2).toString());

        //}
        //else { //عموله



        //صافي المبيعات = اجمالي المصروفات  + التسويه  - اجمالي المبيعات
        var Netsales = (Number($('#txtClose_TotalSalesCash').val()) - (Number(txtClose_Adjustment.value) + Number($('#txtClose_TotalExpenses').val()) + Number($('#textClose_Coolingandstorage').val()))).RoundToSt(2);
        $('#txtNetsales').val(Netsales);


        //نسبة العمولة  
        var prc = ((Number($('#txtClose_CompanyCommition').val()) * 100) / Number($('#txtClose_TotalSalesCash').val())).RoundToSt(2)
        $('#txtClose_CompanyCommitionPrc').val(prc);

        //صافي الارباح = عمولة الشركة - عمولة البائع
        var NetProfit = ((Number($('#txtClose_CompanyCommition').val()) + Number($('#txtClose_Marketting').val())) - Number($('#txtClose_SalesManCommition').val()));
        $('#txtClose_NetProfit').val(NetProfit.RoundToSt(2).toString());

        //قيمة الشراء = صافي المبيعات - عمولة الشركة
        var purchaseValue = (Number($('#txtNetsales').val()) - Number($('#txtClose_CompanyCommition').val()));
        purchaseValue = (Number(purchaseValue) - Number($('#txtClose_Marketting').val()));
        $('#txtClose_purchaseValue').val(purchaseValue.RoundToSt(2).toString());
        //}


    }
    function Calculation_Close1() {

        //صافي المبيعات = اجمالي المصروفات  + التسويه  - اجمالي المبيعات
        var Netsales = Number(($('#txtClose_TotalSalesCash').val() - (Number($('#txtClose_TotalExpenses').val()) + Number(txtClose_Adjustment.value))))
        $('#txtNetsales').val(Netsales);

        //عمولة الشركة = عمولة الشركة / اجمالي المبيعات

        var CompanyCommition1 = (Number($('#txtClose_TotalSalesCash').val()) / Number($('#txtClose_CompanyCommition').val()));
        $('#txtClose_CompanyCommitionPrc').val(CompanyCommition1.RoundToSt(2).toString());

        //صافي الارباح = عمولة الشركة - عمولة البائع
        var NetProfit = (Number($('#txtClose_CompanyCommition').val()) - Number($('#txtClose_SalesManCommition').val()));
        $('#txtClose_NetProfit').val(NetProfit.RoundToSt(2).toString());

        //قيمة الشراء = صافي المبيعات - عمولة الشركة
        var purchaseValue = (Number($('#txtNetsales').val()) - Number($('#txtClose_CompanyCommition').val()));
        $('#txtClose_purchaseValue').val(purchaseValue.RoundToSt(2).toString());

    }
    function ComputeTotalsAdjTotalSales() {
        debugger
        let total = 0;
        for (var i = 0; i <= CountGrid; i++) {
            if ($("#txt_StatusFlagItemsData" + i).val() != 'm' && $("#txt_StatusFlagItemsData" + i).val() != 'd') {
                total += Number($("#txtClose_TotalSales" + i).val());

            }
        }
        $("#textClose_AdjTotalSales").val(total.RoundToSt(2).toString());

    }
    function ComputeTotalClose_Adjustment() {
        debugger
        let totalAdjustment = 0;
        totalAdjustment = (Number($("#txtClose_TotalSalesCash").val()) - Number($("#textClose_AdjTotalSales").val()));

        $("#txtClose_Adjustment").val(totalAdjustment.RoundToSt(2).toString());

    }
    function Close_Adjustment_onChang() {

        ComputeTotalsAdjTotalSales();
        //ComputeTotalClose_Adjustment();

        //صافي المبيعات = اجمالي المصروفات  + التسويه  - اجمالي المبيعات
        var Netsales = (Number($('#txtClose_TotalSalesCash').val()) - (Number(txtClose_Adjustment.value) + Number($('#txtClose_TotalExpenses').val()) + Number($('#textClose_Coolingandstorage').val()))).RoundToSt(2);
        $('#txtNetsales').val(Netsales);

        //نسبة العمولة  
        var prc = ((Number($('#txtClose_CompanyCommition').val()) * 100) / Number($('#txtClose_TotalSalesCash').val())).RoundToSt(2)
        $('#txtClose_CompanyCommitionPrc').val(prc);

        //صافي الارباح = عمولة الشركة - عمولة البائع
        var NetProfit = ((Number($('#txtClose_CompanyCommition').val()) + Number($('#txtClose_Marketting').val())) - Number($('#txtClose_SalesManCommition').val()));
        $('#txtClose_NetProfit').val(NetProfit.RoundToSt(2).toString());

        //قيمة الشراء = صافي المبيعات - عمولة الشركة
        var purchaseValue = (Number($('#txtNetsales').val()) - Number($('#txtClose_CompanyCommition').val()));
        purchaseValue = (Number(purchaseValue) - Number($('#txtClose_Marketting').val()));
        $('#txtClose_purchaseValue').val(purchaseValue.RoundToSt(2).toString());



    }
    function ValidationHeader() {



        if (txtTruckNumber.value == "") {
            DisplayMassage(" برجاء أدخل رقم الشاحنة!", "must enter number of truck !", MessageType.Worning);
            Errorinput(txtTruckNumber);

            return false
        }
        else if (txtPortName.value == "") {
            DisplayMassage(" برجاء أدخل اسم ميناء الدخول!", "must enter name of Port of entry !", MessageType.Worning);
            Errorinput(txtPortName);
            return false
        }
        else if (ddlVendor.value == "null") {
            DisplayMassage(" برجاء اختيار المورد!", "must choose Vendor!", MessageType.Worning);
            Errorinput(ddlVendor);

            return false
        }
        else if (txtNationality.value == "null") {
            DisplayMassage(" برجاء اختيار  الدولة!", "must choose state!", MessageType.Worning);
            Errorinput(txtNationality);

            return false
        }
        else if (txtPaperPurchaseValue.value == "") {
            DisplayMassage("برجاء أدخل  قيمة البضاعة المسجلة!", "must enter value of registration goods !", MessageType.Worning);
            Errorinput(txtPaperPurchaseValue);

            return false
        }
        else if (txtPolice_num.value == "") {
            DisplayMassage("برجاء أدخل  رقم البوليصه!", "must enter value of Police NO!", MessageType.Worning);
            Errorinput(txtPolice_num);

            return false
        }
        else if (txtCustomNo.value == "") {
            DisplayMassage("برجاء أدخل  رقم البيان!", "must enter value of Custom NO!", MessageType.Worning);
            Errorinput(txtCustomNo);

            return false
        }
        else if (txt_tax.value == "null") {
            DisplayMassage("برجاء أدخل  نوع الضريبه!", "must enter value of Custom NO!", MessageType.Worning);
            Errorinput(txt_tax);
            return false
        }
        else if (ddlSalesman.value == "null" && Status == 1) {
            DisplayMassage(" برجاء اختيار  البائع!", "must choose seller!", MessageType.Worning);
            Errorinput(ddlSalesman);

            return false
        }



        return true;
    }
    function ValidationClose() {

        if (txtClose_Adjustment.value.trim() == "") {
            DisplayMassage(" برجاء أدخل التسويات!", "must enter adjustment !", MessageType.Worning);
            Errorinput(txtClose_Adjustment);
            return false
        }
        else if (txtClose_CompanyCommitionPrc.value.trim() == "") {
            DisplayMassage(" برجاء أدخل عمولة الشركة!", "must enter Company commission !", MessageType.Worning);
            Errorinput(txtClose_CompanyCommitionPrc);
            return false
        }
        else if (txtClose_SalesManCommition.value.trim() == "") {
            DisplayMassage(" برجاء أدخل عمولة البائع!", "must enter seller commission !", MessageType.Worning);
            Errorinput(txtClose_SalesManCommition);
            return false
        }



        return true;
    }
    function Validation_Grid(rowcount: number) {

        if ($("#ddlFamily" + rowcount).val() == "null" && ($("#txt_StatusFlag" + rowcount).val() != 'd' || $("#txt_StatusFlag" + rowcount).val() != 'm')) {
            DisplayMassage("  برجاءادخال النوع!", "must enter Type !", MessageType.Worning);
            Errorinput($("#ddlFamily" + rowcount));
            return false
        }
        else if (($("#ddlItem" + rowcount).val() == "null") && ($("#txt_StatusFlag" + rowcount).val() != 'd' || $("#txt_StatusFlag" + rowcount).val() != 'm')) {
            DisplayMassage("برجاءادخال الصنف!", "must enter item !", MessageType.Worning);
            Errorinput($("#ddlItem" + rowcount));

            return false
        }
        else if ((Number($("#txtQuantity" + rowcount).val()) < Number($("#txtSoldQty" + rowcount).val())) && ($("#txt_StatusFlag" + rowcount).val() != 'd' || $("#txt_StatusFlag" + rowcount).val() != 'm')) {
            DisplayMassage(" يجب تكون الكميه اكبر من الكمبه المباعه!", "must enter Quantity !", MessageType.Worning);
            Errorinput($("#txtQuantity" + rowcount));
            return false
        }
        else if (($("#txtPrice" + rowcount).val() == "" || $("#txtPrice" + rowcount).val() == 0) && ($("#txt_StatusFlag" + rowcount).val() != 'd' || $("#txt_StatusFlag" + rowcount).val() != 'm')) {
            DisplayMassage("  برجاءادخال السعر!", "must enter Price !", MessageType.Worning);
            Errorinput($("#txtPrice" + rowcount));

            return false
        }
        else if (($("#txtMinPrice" + rowcount).val() == "" || $("#txtMinPrice" + rowcount).val() == 0) && ($("#txt_StatusFlag" + rowcount).val() != 'd' || $("#txt_StatusFlag" + rowcount).val() != 'm')) {
            DisplayMassage(" برجاءادخال اقل سعر!", "must enter lowest price !", MessageType.Worning);
            Errorinput($("#txtMinPrice" + rowcount));
            return false
        }


        return true;

    }

    function ValidationSum_Grid(rowcount: number) {

        if (($("#txt_SoldQty" + rowcount).val() == "" || $("#txt_SoldQty" + rowcount).val() == 0) && ($("#txt_StatusFlagItemsData" + rowcount).val() != 'd' && $("#txt_StatusFlagItemsData" + rowcount).val() != 'm')) {
            DisplayMassage("  برجاءادخال الكمية المباعة!", "must enter Price !", MessageType.Worning);
            Errorinput($("#txt_SoldQty" + rowcount));

            return false
        }
        else if (($("#txt_UnitPrice" + rowcount).val() == "" || $("#txt_UnitPrice" + rowcount).val() == 0) && ($("#txt_StatusFlagItemsData" + rowcount).val() != 'd' && $("#txt_StatusFlagItemsData" + rowcount).val() != 'm')) {
            DisplayMassage(" برجاءادخال سعر البيع!", "must enter lowest price !", MessageType.Worning);
            Errorinput($("#txt_UnitPrice" + rowcount));
            return false
        }


        return true;

    }

    function ValidationCharge_Grid(rowcount: number) {
        //else



        if ($("#txtAddonsCharge" + rowcount).val() == "null" && ($("#txt_StatusFlag1" + rowcount).val() != 'd' || $("#txt_StatusFlag1" + rowcount).val() != 'm')) {
            DisplayMassage(" برجاء اختيار الإضافة!", "must choose addition!", MessageType.Worning);
            Errorinput($("#txtAddonsCharge" + rowcount));

            return false
        }
        else if ($("#txtAddonsTypeCharge" + rowcount).val() == "null" && ($("#txt_StatusFlag1" + rowcount).val() != 'd' || $("#txt_StatusFlag1" + rowcount).val() != 'm')) {
            DisplayMassage(" برجاء اختيار نوع الإضافة!", "must choose a type addition !", MessageType.Worning);
            Errorinput($("#txtAddonsTypeCharge" + rowcount));
            return false
        }
        else if (($("#txtValueCharge" + rowcount).val() == "") || $("#txtValueCharge" + rowcount).val() == "0" && ($("#txt_StatusFlag1" + rowcount).val() != 'd' || $("#txt_StatusFlag1" + rowcount).val() != 'm')) {
            DisplayMassage(" برجاءادخال القيمة!", "must enter value !", MessageType.Worning);
            Errorinput($("#txtValueCharge" + rowcount));
            return false
        }
        else if ($("#txtVatType" + rowcount).val() == "null" && ($("#txt_StatusFlag1" + rowcount).val() != 'd' || $("#txt_StatusFlag1" + rowcount).val() != 'm')) {
            DisplayMassage(" برجاء اختيار نوع الضريبة!", "must choose a type of tax  !", MessageType.Worning);
            Errorinput($("#txtVatType" + rowcount));
            return false
        }

        else if ($("#txtVendorIsCheckCharge" + rowcount).val() == "null" && ($("#txt_StatusFlag1" + rowcount).val() != 'd' || $("#txt_StatusFlag1" + rowcount).val() != 'm')) {
            DisplayMassage("  برجاءاختيار نقدى ام علي الحساب!", "must choose cash or debit !", MessageType.Worning);
            Errorinput($("#txtVendorIsCheckCharge" + rowcount));

            return false
        }
        else if (($("#txtInvoiceNumberCharge" + rowcount).val() == "" || $("#txtInvoiceNumberCharge" + rowcount).val() == "0") && ($("#txt_StatusFlag1" + rowcount).val() != 'd' || $("#txt_StatusFlag1" + rowcount).val() != 'm')) {
            DisplayMassage(" برجاء ادخال رقم الفاتورة!", "must enter number of invoice  !", MessageType.Worning);
            Errorinput($("#txtInvoiceNumberCharge" + rowcount));

            return false
        }
        else if ($("#txtVendorCharge" + rowcount).val() == "null" && ($("#txt_StatusFlag1" + rowcount).val() != 'd' || $("#txt_StatusFlag1" + rowcount).val() != 'm')) {
            DisplayMassage("برجاءاختيارالمورد!", "must choose vendor !", MessageType.Worning);
            Errorinput($("#txtVendorCharge" + rowcount));

            return false
        }

        else if ($("#txt_D_CashBox" + rowcount).val() == "Null" && $("#txtVendorIsCheckCharge" + rowcount).val() == "1" && ($("#txt_StatusFlag1" + rowcount).val() != 'd' || $("#txt_StatusFlag1" + rowcount).val() != 'm')) {
            DisplayMassage(" برجاء اختيار الصندوق!", "must Choose a box  !", MessageType.Worning);
            Errorinput($("#txt_D_CashBox" + rowcount));

            return false
        }

        return true;

    }
    function ValidationDeposit_Grid(rowcount: number) {

        if ($("#txtSerial3" + rowcount).val() == "" && ($("#txt_StatusFlag2" + rowcount).val() != 'd' || $("#txt_StatusFlag" + rowcount).val() != 'm')) {
            DisplayMassage(" برجاء ادخال مسلسل!", "must enter serial number  !", MessageType.Worning);
            Errorinput($("#txtSerial3" + rowcount));

            return false
        }
        else if ($("#Salesman" + rowcount).val() == "null" && ($("#txt_StatusFlag2" + rowcount).val() != 'd' || $("#txt_StatusFlag" + rowcount).val() != 'm')) {
            DisplayMassage(" برجاء اختيار المندوب!", "must value of Salesman !", MessageType.Worning);
            Errorinput($("#Salesman" + rowcount));
            return false
        }
        else if ($("#DepositAmount" + rowcount).val() == "" && ($("#txt_StatusFlag2" + rowcount).val() != 'd' || $("#txt_StatusFlag" + rowcount).val() != 'm')) {
            DisplayMassage(" برجاء ادخال قيمة المبلغ!", "must value of amount !", MessageType.Worning);
            Errorinput($("#DepositAmount" + rowcount));

            return false
        }
        else if ($("#ACC_type" + rowcount).val() == "Null" && ($("#txt_StatusFlag2" + rowcount).val() != 'd' || $("#txt_StatusFlag" + rowcount).val() != 'm')) {
            DisplayMassage("برجاء اختيار نوع الحساب !", "must Choose a type of deposit account !", MessageType.Worning);
            Errorinput($("#ACC_type" + rowcount));

            return false
        }
        else if ($("#Acc_Code" + rowcount).val() == "Null" && $("#ACC_type" + rowcount).val() == "0" && ($("#txt_StatusFlag2" + rowcount).val() != 'd' || $("#txt_StatusFlag" + rowcount).val() != 'm')) {
            DisplayMassage("برجاء اختيار  الحساب البنك!", "must Choose a type of deposit account !", MessageType.Worning);
            Errorinput($("#Acc_Code" + rowcount));

            return false
        }
        else if ($("#CashBox" + rowcount).val() == "Null" && $("#ACC_type" + rowcount).val() == "1" && ($("#txt_StatusFlag2" + rowcount).val() != 'd' || $("#txt_StatusFlag" + rowcount).val() != 'm')) {
            DisplayMassage("برجاء اختيار  الصندوق  !", "must Choose a type of deposit account !", MessageType.Worning);
            Errorinput($("#CashBox" + rowcount));

            return false
        }
        else if ($("#Remarks" + rowcount).val() == "" && ($("#txt_StatusFlag2" + rowcount).val() != 'd' || $("#txt_StatusFlag" + rowcount).val() != 'm')) {
            DisplayMassage(" برجاء ادخال ملاحظات!", "must enter notes !", MessageType.Worning);
            Errorinput($("#Remarks" + rowcount));

            return false
        }

        return true;

    }

    //----------------------------------------------------- Div_Processes---------------------------------------------------
    function Assign_1_Processes() {

        debugger
        Model_I_TR_Operation = new I_TR_Operation();
        if (FlagIns_Operation == true) {//Insert
            if ($('#txtClose_CompanyCommition').val() == "NaN" || $('#txtClose_NetProfit').val() == "") { $('#txtClose_CompanyCommition').val('0') }
            if ($('#txtClose_purchaseValue').val() == "NaN" || $('#txtClose_NetProfit').val() == "") { $('#txtClose_purchaseValue').val('0') }
            if ($('#txtClose_NetProfit').val() == "NaN" || $('#txtClose_NetProfit').val() == "") { $('#txtClose_NetProfit').val('0') }
            DocumentActions.AssignToModel(Model_I_TR_Operation);
            Model_I_TR_Operation.OperationID = 0;
            Model_I_TR_Operation.CompCode = Number(compcode);
            Model_I_TR_Operation.BranchCode = Number(BranchCode);
            Model_I_TR_Operation.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
            Model_I_TR_Operation.UserCode = SysSession.CurrentEnvironment.UserCode;
            Model_I_TR_Operation.User_Code = SysSession.CurrentEnvironment.UserCode;
            Model_I_TR_Operation.CreatedAt = DateTimeFormat(Date().toString());
            Model_I_TR_Operation.CreatedBy = SysSession.CurrentEnvironment.UserCode;
            Model_I_TR_Operation.ClearanceDate = $('#txtClearanceDate').val();
            Model_I_TR_Operation.Close_Marketting = Number($('#txtClose_Marketting').val());

            Model_I_TR_Operation.PurVoucherNo = Number($('#txtPurVoucherNo').val());
            Model_I_TR_Operation.IsPurPosted = false;


            Model_I_TR_Operation.Close_AdjTotalSales = Number($('#textClose_AdjTotalSales').val());
            Model_I_TR_Operation.Close_Adjustment = Number($('#txtClose_Adjustment').val());


            Model_I_TR_Operation.IsGenerated = false;
            Model_I_TR_Operation.Status = Status;
            Model_I_TR_Operation.VendorID = $('#ddlVendor').val();
            Model_I_TR_Operation.NationalityID = $('#txtNationality').val();
            Model_I_TR_Operation.Trtype = $('#ddlTrtype').val();
            Model_I_TR_Operation.VatType = Number(txt_tax.value);
            Model_I_TR_Operation.VatPrc = Number(txtVatPrc.value);
            Model_I_TR_Operation.VatAmount = Number(txtVatAmount.value);


            if (Status == 1 || Status == 2) {
                Model_I_TR_Operation.SalesmanId = Number($('#ddlSalesman').val());
                Model_I_TR_Operation.Status = 2;
                Model_I_TR_Operation.OpenBy = ddlSalesman.options[ddlSalesman.selectedIndex].text;
            }
            if (Status == 3) {
                Model_I_TR_Operation.SalesmanId = Number($('#ddlSalesman').val());
                Model_I_TR_Operation.Status = 3;
                Model_I_TR_Operation.OpenBy = ddlSalesman.options[ddlSalesman.selectedIndex].text;
            }
            if (Status == 0) {
                Model_I_TR_Operation.SalesmanId = 0;
                Model_I_TR_Operation.OpenAt = null;
            }


            //if ($('#ddlSalesman').val() == "null") { Model_I_TR_Operation.SalesmanId = 0; }
            //else { Model_I_TR_Operation.SalesmanId = $('#ddlSalesman').val(); }

            Model_I_TR_Operation.Branch_Code = SysSession.CurrentEnvironment.BranchCode;
            Model_I_TR_Operation.Comp_Code = SysSession.CurrentEnvironment.CompCode;
            Model_I_TR_Operation.MODULE_CODE = Modules.CloseProcesses;
            Model_I_TR_Operation.UserCode = SysSession.CurrentEnvironment.UserCode;
            Model_I_TR_Operation.sec_FinYear = SysSession.CurrentEnvironment.CurrentYear;

        }
        else {// Update 
            // 
            if ($('#txtClose_CompanyCommition').val() == "NaN" || $('#txtClose_NetProfit').val() == "") { $('#txtClose_CompanyCommition').val('0') }
            if ($('#txtClose_purchaseValue').val() == "NaN" || $('#txtClose_NetProfit').val() == "") { $('#txtClose_purchaseValue').val('0') }
            if ($('#txtClose_NetProfit').val() == "NaN" || $('#txtClose_NetProfit').val() == "") { $('#txtClose_NetProfit').val('0') }

            DocumentActions.AssignToModel(Model_I_TR_Operation);
            Model_I_TR_Operation.OperationID = OperationID;
            Model_I_TR_Operation.CompCode = Number(compcode);
            Model_I_TR_Operation.BranchCode = Number(BranchCode);
            Model_I_TR_Operation.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
            Model_I_TR_Operation.UserCode = SysSession.CurrentEnvironment.UserCode;
            Model_I_TR_Operation.User_Code = SysSession.CurrentEnvironment.UserCode;
            Model_I_TR_Operation.UpdatedAt = DateTimeFormat(Date().toString());
            Model_I_TR_Operation.UpdatedBy = SysSession.CurrentEnvironment.UserCode;
            Model_I_TR_Operation.IsGenerated = IsGenerated;
            Model_I_TR_Operation.ClearanceDate = $('#txtClearanceDate').val();
            Model_I_TR_Operation.Close_Marketting = Number($('#txtClose_Marketting').val());

            Model_I_TR_Operation.PurVoucherNo = Number($('#txtPurVoucherNo').val());
            if (Selected_Data.length > 0) {
                Model_I_TR_Operation.IsPurPosted = Selected_Data[0].IsPurPosted;
            }
            else {
                Model_I_TR_Operation.IsPurPosted = false;
            }


            //Model_I_TR_Operation.TrDate = التاريخ 
            //Model_I_TR_Operation.OpenAt = تارخ الفتح
            Model_I_TR_Operation.Status = Status;
            Model_I_TR_Operation.VendorID = $('#ddlVendor').val();
            Model_I_TR_Operation.NationalityID = $('#txtNationality').val();
            Model_I_TR_Operation.Trtype = $('#ddlTrtype').val();
            Model_I_TR_Operation.VatType = Number(txt_tax.value);
            Model_I_TR_Operation.VatPrc = Number(txtVatPrc.value);
            Model_I_TR_Operation.VatAmount = Number(txtVatAmount.value);

            // 
            if (Status == 1 || Status == 2) {
                Model_I_TR_Operation.SalesmanId = Number($('#ddlSalesman').val());
                Model_I_TR_Operation.Status = 2;
                Model_I_TR_Operation.OpenBy = ddlSalesman.options[ddlSalesman.selectedIndex].text;
            }
            if (Status == 3) {
                Model_I_TR_Operation.SalesmanId = Number($('#ddlSalesman').val());
                Model_I_TR_Operation.Status = 3;
                Model_I_TR_Operation.OpenBy = ddlSalesman.options[ddlSalesman.selectedIndex].text;
            }
            if (Status == 0) {
                Model_I_TR_Operation.SalesmanId = 0;
                Model_I_TR_Operation.OpenAt = null;
            }
            Model_I_TR_Operation.Branch_Code = SysSession.CurrentEnvironment.BranchCode;
            Model_I_TR_Operation.Comp_Code = SysSession.CurrentEnvironment.CompCode;
            Model_I_TR_Operation.MODULE_CODE = Modules.CloseProcesses;
            Model_I_TR_Operation.UserCode = SysSession.CurrentEnvironment.UserCode;
            Model_I_TR_Operation.sec_FinYear = SysSession.CurrentEnvironment.CurrentYear;
        }

        Model_I_TR_Operation.Close_Coolingandstorage = Number(textClose_Coolingandstorage.value);

    }
    function Insert_1_Processes() {

        // 
        //if (!CheckDate(DateFormat(txtDateHeader.value).toString(), DateFormat(SysSession.CurrentEnvironment.StartDate).toString(), DateFormat(SysSession.CurrentEnvironment.EndDate).toString())) {
        //    DisplayMassage('  التاريخ ليس متطابق مع تاريخ السنه (' + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ')', 'The date is not identical with the date of the year(' + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ')', MessageType.Worning);
        //    Errorinput(txtDateHeader);

        //    return
        //}

        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("Processes", "Insert_Processes"),
            data: JSON.stringify(Model_I_TR_Operation),
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    ddlStateType.value = '111';
                    OperationID = result.Response as I_TR_Operation;
                    DisplayMassage("تم أضافة عملية بنجاح", "Operation added successfully", MessageType.Succeed);
                    flag_succ_insert = true;

                    $('#txtCreatedBy').val(SysSession.CurrentEnvironment.UserCode);
                    $('#txtCreatedAt').val(DateTimeFormat(Date().toString()));
                    $('#txtUpdatedBy').val("");
                    $('#txtUpdatedAt').val("");

                } else {
                    DisplayMassage("خطأء!", "Error!", MessageType.Worning);
                    flag_succ_insert = false;

                }
            }
        });
    }
    function Update_1_Processes() {
        //if (!CheckDate(DateFormat(txtDateHeader.value).toString(), DateFormat(SysSession.CurrentEnvironment.StartDate).toString(), DateFormat(SysSession.CurrentEnvironment.EndDate).toString())) {
        //    DisplayMassage('  التاريخ ليس متطابق مع تاريخ السنه (' + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ')', 'The date is not identical with the date of the year(' + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ')', MessageType.Worning);
        //    Errorinput(txtDateHeader);
        //    return
        //}
        console.log(Model_I_TR_Operation);
        Model_I_TR_Operation.UserCode = SysSession.CurrentEnvironment.UserCode;
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("Processes", "Update_Processes"),
            data: JSON.stringify(Model_I_TR_Operation),
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    ddlStateType.value = '111';

                    flag_Back = true;

                    Ready = 1;

                    $('#txtUpdatedBy').val(SysSession.CurrentEnvironment.UserCode);
                    $('#txtUpdatedAt').val(DateTimeFormat(Date().toString()));

                    if (Status == 1 || Status == 2) {
                        showdiv();
                        $('#divlepRentdata_1').removeClass('display_none');
                        $('#spanlepRentdata_1').toggleClass('fa-angle-double-left');
                        $('#spanlepRentdata_1').toggleClass('fa-angle-double-down');

                        $('#divlepRentdata_2').removeClass('display_none');
                        $('#spanlepRentdata_2').toggleClass('fa-angle-double-left');
                        $('#spanlepRentdata_2').toggleClass('fa-angle-double-down');

                        $('#divlepRentdata_3').removeClass('display_none');
                        $('#spanlepRentdata_3').toggleClass('fa-angle-double-left');
                        $('#spanlepRentdata_3').toggleClass('fa-angle-double-down');

                        $('#lepRentdata').removeClass('showdiv');
                        $('#spanlepRentdata_4').toggleClass('fa-angle-double-left');
                        $('#spanlepRentdata_4').toggleClass('fa-angle-double-down');

                        $('#lepMoney').removeClass('showdiv');
                        $('#spanlepMoney_4').toggleClass('fa-angle-double-left');
                        $('#spanlepMoney_4').toggleClass('fa-angle-double-down');

                        Processes_Open();
                        Status = 2;
                        $('#txtStatus').val('مفتوحة');

                        //DisplayMassage("تم فتح العمليه بنجاح!", "Operation opened successfully!", MessageType.Succeed);
                        DisplayMassage("تم التعديل بنجاح!", "Modified successfully!", MessageType.Succeed);


                    }
                    else if (Status == 3) {
                        DisplayMassage("تم غلق العمليه بنجاح!", "Operation close successfully!", MessageType.Succeed);

                    }
                    else {
                        DisplayMassage("تم التعديل بنجاح!", "Modified successfully!", MessageType.Succeed);
                    }
                }
                else {
                    DisplayMassage("خطأء!", "Error!", MessageType.Worning);
                    Ready = 0;
                    flag_Back = false;


                }
            }
        });

    }
    function MasterGridBiuld() {

        Selected_Data = new Array<IQ_GetOperation>();
        Selected_Data = Get_IQ_GetOperation.filter(x => x.OperationID == OperationID);

        $("#div_Master_Hedr").removeClass("display_none");
        DisplayData(Selected_Data);

        debugger
        if (Selected_Data[0].Status == 0) {// تحت التجهيز
            Processes_under_preparing();
        }
        else if (Selected_Data[0].Status == 1) {//جاهز

        }
        else if (Selected_Data[0].Status == 2) {//مفتوحة
            Processes_Open();
        }
        else if (Selected_Data[0].Status == 3) { //مغلق
            Processes_Close();
        }
        else if (Selected_Data[0].Status == 4) { //مغلق 
            Processes_Open();
        }

        Calculation_Close();

        flag_Add = false;
    }
    //-----------------------------------------------------------------------------------------------------------------------

    //----------------------------------------------------- Div_items-------------------------------------------------------
    function Assign_2_items() {

        // ;
        OperationItemModel = new Array<I_TR_OperationItems>();
        var StatusFlag: String;
        for (var i = 0; i <= CountGrid; i++) {
            OperationItemSingleModel = new I_TR_OperationItems();
            StatusFlag = $("#txt_StatusFlag" + i).val();
            $("#txt_StatusFlag" + i).val("");
            OperationItemSingleModel.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
            OperationItemSingleModel.UserCode = SysSession.CurrentEnvironment.UserCode;


            if (StatusFlag == "i") {

                i == 0 ? Save_Add = true : Save_Add = false;

                OperationItemSingleModel.StatusFlag = StatusFlag.toString();
                OperationItemSingleModel.OperationItemID = 0;
                OperationItemSingleModel.OperationID = OperationID;
                OperationItemSingleModel.ItemID = $("#ddlItem" + i).val();
                OperationItemSingleModel.ReceivedQty = $('#txtQuantity' + i).val();
                OperationItemSingleModel.Est_SalesPrice = $("#txtPrice" + i).val();
                OperationItemSingleModel.Min_SalesPrice = $("#txtMinPrice" + i).val();
                OperationItemSingleModel.SoldQty = $('#txtSoldQty' + i).val();//
                OperationItemSingleModel.ScrapQty = $("#txtScrapQty" + i).val();
                OperationItemModel.push(OperationItemSingleModel);

            }
            if (StatusFlag == "u") {
                var OperationItemID = $("#txt_ID" + i).val();
                OperationItemSingleModel.StatusFlag = StatusFlag.toString();
                OperationItemSingleModel.OperationItemID = OperationItemID;
                OperationItemSingleModel.OperationID = OperationID;
                OperationItemSingleModel.ItemID = $("#ddlItem" + i).val();
                OperationItemSingleModel.ReceivedQty = $('#txtQuantity' + i).val();
                OperationItemSingleModel.Est_SalesPrice = $("#txtPrice" + i).val();
                OperationItemSingleModel.Min_SalesPrice = $("#txtMinPrice" + i).val();
                OperationItemSingleModel.SoldQty = $('#txtSoldQty' + i).val();//
                OperationItemSingleModel.ScrapQty = $("#txtScrapQty" + i).val();
                OperationItemModel.push(OperationItemSingleModel);
                if ($("#txtPrice" + i).val() < $("#txtMinPrice" + i).val()) {
                    DisplayMassage("يجب ان يكون السعر اكبر من اقل سعر!", "The price must be greater than the lowest price!", MessageType.Worning);
                    Errorinput($("#txtPrice" + i));

                }
            }
            if (StatusFlag == "d") {
                if ($("#ReciveDetailsID" + i).val() != "") {
                    var OperationItemID = $("#txt_ID" + i).val();
                    OperationItemSingleModel.StatusFlag = StatusFlag.toString();
                    OperationItemSingleModel.OperationID = OperationID;
                    OperationItemSingleModel.OperationItemID = OperationItemID;
                    OperationItemModel.push(OperationItemSingleModel);
                }
            }
        }
    }
    function Update_2_items() {
        // 
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("Processes", "ListOperationItemsDetail"),
            data: JSON.stringify(OperationItemModel),
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {

                    if (Save_Add == true) {



                        DisplayMassage("تم أضافة  بيانات الحمولة في العمليه بنجاح!", "Payload data has been added in the process successfully!", MessageType.Succeed);

                    }
                    else {
                        DisplayMassage("تم التعديل  بيانات الحمولة بنجاح!", "Payload data has been modified successfully!", MessageType.Succeed);

                        //WorningMessage("تم التعديل  بيانات الحمولة بنجاح!", "Payload data has been modified successfully!", "تم", "Done"); 
                    }
                    flag_Success_2 = true;

                    $('#txtUpdatedBy').val(SysSession.CurrentEnvironment.UserCode);
                    $('#txtUpdatedAt').val(DateTimeFormat(Date().toString()));
                    flag_Add = false;
                    Save_Add = false;

                }
                else {
                    DisplayMassage("خطأء!", "Error!", MessageType.Worning);

                    flag_Success_2 = false;
                    Save_Add = false;

                }
            }
        });

    }
    function Update_2_items_Open() {
        // 
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("Processes", "ListOperationItemsDetailProcesses_Open"),
            data: JSON.stringify(OperationItemModel),
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {

                    if (Save_Add == true) {



                        DisplayMassage("تم أضافة  بيانات الحمولة في العمليه بنجاح!", "Payload data has been added in the process successfully!", MessageType.Succeed);

                    }
                    else {
                        DisplayMassage("تم التعديل  بيانات الحمولة بنجاح!", "Payload data has been modified successfully!", MessageType.Succeed);

                        //WorningMessage("تم التعديل  بيانات الحمولة بنجاح!", "Payload data has been modified successfully!", "تم", "Done"); 
                    }
                    flag_Success_2 = true;

                    $('#txtUpdatedBy').val(SysSession.CurrentEnvironment.UserCode);
                    $('#txtUpdatedAt').val(DateTimeFormat(Date().toString()));
                    flag_Add = false;
                    Save_Add = false;

                }
                else {
                    DisplayMassage("خطأء!", "Error!", MessageType.Worning);

                    flag_Success_2 = false;
                    Save_Add = false;

                }
            }
        });

    }
    //-----------------------------------------------------------------------------------------------------------------------

    //----------------------------------------------------- Div_Charges-------------------------------------------------------
    function Assign_3_Charges() {

        // ;
        chargesDetailsModel = new Array<I_TR_OperationCharges>();
        var StatusFlag: String;
        for (var i = 0; i < CountGridCharge; i++) {
            chargesingleModel = new I_TR_OperationCharges();
            StatusFlag = $("#txt_StatusFlag1" + i).val();

            chargesingleModel.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
            chargesingleModel.UserCode = SysSession.CurrentEnvironment.UserCode;
            if (StatusFlag == "i") {

                i == 0 ? Save_Add = true : Save_Add = false;

                chargesingleModel.OperationExpensesID = 0;
                chargesingleModel.OperationID = OperationID;
                chargesingleModel.StatusFlag = StatusFlag.toString();
                chargesingleModel.Serial = $("#txtSerial" + i).val();
                chargesingleModel.ChargeID = $("#txtAddonsCharge" + i).val();
                chargesingleModel.Amount = $('#txtValueCharge' + i).val();
                chargesingleModel.VatType = $('#txtVatType' + i).val();//
                chargesingleModel.VatAmount = $("#txtVatCharge" + i).val();
                chargesingleModel.NetAtferVat = $("#txtValueAfterVatCharge" + i).val();
                chargesingleModel.VatPrc = Number($("#txtVatType" + i).attr('data-VatPerc'));
                var ispaid = $("#txtVendorIsCheckCharge" + i).val();
                if (ispaid == "0") { chargesingleModel.isPaidByVendor = true } else { chargesingleModel.isPaidByVendor = false }

                chargesingleModel.RefInvoiceNo = $("#txtInvoiceNumberCharge" + i).val();
                chargesingleModel.ChRemarks = $("#RemarksCharge" + i).val();
                chargesingleModel.VoucherNo = $("#VoucherNoCharge" + i).val(); 
                chargesingleModel.TrNo = Number($('#txtNumber').val())
                chargesingleModel.IsPosted = $("#IsPosted" + i).prop("checked")
                chargesingleModel.RefInvoiceDate = $("#txtInvoiceDateCharge" + i).val();
                chargesingleModel.VendorID = $("#txtVendorCharge" + i).val();
                if ($("#txt_D_CashBox" + i).val() == "Null") { chargesingleModel.CashBoxID = 0; }
                else { chargesingleModel.CashBoxID = $("#txt_D_CashBox" + i).val(); }

                chargesDetailsModel.push(chargesingleModel);

            }
            if (StatusFlag == "u") {
                var chargeItemId = $("#txt_ID1" + i).val();
                chargesingleModel.StatusFlag = StatusFlag.toString();
                chargesingleModel.Serial = $("#txtSerial" + i).val();
                chargesingleModel.OperationExpensesID = chargeItemId;
                chargesingleModel.OperationID = OperationID;
                chargesingleModel.ChargeID = $("#txtAddonsCharge" + i).val();
                chargesingleModel.Amount = $('#txtValueCharge' + i).val();
                chargesingleModel.VatType = $('#txtVatType' + i).val();//
                chargesingleModel.VatPrc = Number($("#txtVatType" + i).attr('data-VatPerc'));
                chargesingleModel.VatAmount = $("#txtVatCharge" + i).val();
                chargesingleModel.NetAtferVat = $("#txtValueAfterVatCharge" + i).val();
                var ispaid = $("#txtVendorIsCheckCharge" + i).val();
                if (ispaid == "0") { chargesingleModel.isPaidByVendor = true } else { chargesingleModel.isPaidByVendor = false }

                chargesingleModel.RefInvoiceNo = $("#txtInvoiceNumberCharge" + i).val();
                chargesingleModel.ChRemarks = $("#RemarksCharge" + i).val();
                chargesingleModel.VoucherNo = $("#VoucherNoCharge" + i).val();
                chargesingleModel.TrNo = Number($('#txtNumber').val())
                chargesingleModel.IsPosted = $("#IsPosted" + i).prop("checked")
                chargesingleModel.RefInvoiceDate = $("#txtInvoiceDateCharge" + i).val();
                chargesingleModel.VendorID = $("#txtVendorCharge" + i).val();
                if ($("#txt_D_CashBox" + i).val() == "Null") { chargesingleModel.CashBoxID = 0; }
                else { chargesingleModel.CashBoxID = $("#txt_D_CashBox" + i).val(); }
                chargesDetailsModel.push(chargesingleModel);

            }
            if (StatusFlag == "d") {
                if ($("#ReceiveExpensesID" + i).val() != "") {
                    var deletedID = $("#txt_ID1" + i).val();
                    chargesingleModel.StatusFlag = StatusFlag.toString();
                    chargesingleModel.OperationExpensesID = deletedID;
                    chargesingleModel.OperationID = OperationID;
                    chargesDetailsModel.push(chargesingleModel);
                }
            }
        }
    }
    function Update_3_Charges() {
        // 
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("Processes", "ListOperationChargesDetail"),
            data: JSON.stringify(chargesDetailsModel),
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {

                    if (Save_Add == true) {

                        DisplayMassage("تم أضافة المصروفات  في العمليه بنجاح!", "Expenses have been added in the process successfully!", MessageType.Succeed);

                    }
                    else {
                        DisplayMassage("تم التعديل علي المصروفات بنجاح!", "Modified successfully!", MessageType.Succeed);
                    }
                    flag_Success_3 = true;
                    $('#txtUpdatedBy').val(SysSession.CurrentEnvironment.UserCode);
                    $('#txtUpdatedAt').val(DateTimeFormat(Date().toString()));
                    flag_Add = false;
                    Save_Add = false;

                }
                else {
                    DisplayMassage("خطأء!", "Error!", MessageType.Worning);
                    flag_Success_3 = false;
                    Save_Add = false;


                }
            }
        });

    }
    //-----------------------------------------------------------------------------------------------------------------------

    //----------------------------------------------------- Div_Deposit-------------------------------------------------------
    function Assign_5_Deposit() {

        // ;
        DepositDetailsModel = new Array<I_TR_OperationDeposit>();
        ListOp_Deposit_SalItem = new ListOperationDepositDetail();

        var StatusFlag: String;
        for (var i = 0; i < CountGridDeposit; i++) {
            DepositsingleModel = new I_TR_OperationDeposit();
            StatusFlag = $("#txt_StatusFlag2" + i).val();

            DepositsingleModel.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
            DepositsingleModel.UserCode = SysSession.CurrentEnvironment.UserCode;
            if (StatusFlag == "i") {
                DepositsingleModel.OperationDepositID = 0;
                DepositsingleModel.OperationID = OperationID;
                DepositsingleModel.StatusFlag = StatusFlag.toString();
                DepositsingleModel.ItemID = $("#txtSerial3" + i).val();
                DepositsingleModel.DepositDate = $('#DepositDate' + i).val();//
                DepositsingleModel.DepositAmount = $('#DepositAmount' + i).val();
                DepositsingleModel.Remarks = $("#Remarks" + i).val();
                DepositsingleModel.DepositType = $("#ACC_type" + i).val();
                DepositsingleModel.SalesmanId = $("#Salesman" + i).val();

                if ($("#ACC_type" + i).val() == 0) {
                    DepositsingleModel.Acc_Code = $("#Acc_Code" + i).val();
                    DepositsingleModel.CashBoxID = null;

                }
                if ($("#ACC_type" + i).val() == 1) {
                    DepositsingleModel.CashBoxID = $("#CashBox" + i).val();
                    DepositsingleModel.Acc_Code = null;
                }


                DepositDetailsModel.push(DepositsingleModel);

            }
            if (StatusFlag == "u") {
                var DepositID = $("#DepositID" + i).val();
                DepositsingleModel.OperationDepositID = DepositID;
                DepositsingleModel.OperationID = OperationID;
                DepositsingleModel.StatusFlag = StatusFlag.toString();
                DepositsingleModel.ItemID = $("#txtSerial3" + i).val();
                DepositsingleModel.DepositDate = $('#DepositDate' + i).val();//
                DepositsingleModel.Acc_Code = $("#Acc_Code" + i).val();
                DepositsingleModel.DepositAmount = $('#DepositAmount' + i).val();
                DepositsingleModel.Remarks = $("#Remarks" + i).val();
                DepositsingleModel.DepositType = $("#ACC_type" + i).val();
                DepositsingleModel.SalesmanId = $("#Salesman" + i).val();


                if ($("#ACC_type" + i).val() == 0) {
                    DepositsingleModel.Acc_Code = $("#Acc_Code" + i).val();
                    DepositsingleModel.CashBoxID = null;
                }
                if ($("#ACC_type" + i).val() == 1) {
                    DepositsingleModel.CashBoxID = $("#CashBox" + i).val();
                    DepositsingleModel.Acc_Code = null;
                }

                DepositDetailsModel.push(DepositsingleModel);


            }
            if (StatusFlag == "d") {
                if ($("#ReceiveExpensesID" + i).val() != "") {
                    var DepositID = $("#DepositID" + i).val();
                    DepositsingleModel.OperationDepositID = DepositID;
                    DepositsingleModel.OperationID = OperationID;
                    DepositsingleModel.StatusFlag = StatusFlag.toString();
                    DepositDetailsModel.push(DepositsingleModel);
                }
            }
        }

        ListOp_Deposit_SalItem.I_TR_OperationDeposit = DepositDetailsModel;
        ListOp_Deposit_SalItem.I_TR_OperationSalesmanItem = SalesmanItem_Assign;

        ListOp_Deposit_SalItem.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
        ListOp_Deposit_SalItem.UserCode = SysSession.CurrentEnvironment.UserCode;
    }
    function Update_5_Deposit() {

        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("Processes", "ListOperationDepositDetail"),
            data: JSON.stringify(ListOp_Deposit_SalItem),
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    // 
                    DisplayMassage("تم التعديل بنجاح!", "Modified successfully!", MessageType.Succeed);
                    flag_Success_5 = true;
                    $('#txtUpdatedBy').val(SysSession.CurrentEnvironment.UserCode);
                    $('#txtUpdatedAt').val(DateTimeFormat(Date().toString()));
                }
                else {
                    DisplayMassage("خطأء!", "Error!", MessageType.Succeed);

                    flag_Success_5 = false;


                }
            }
        });

    }
    //------------------------------------------------------------------------------------------------------------------------

    //-------------------------------------------------------Processes--------------------------------------------------------
    function Processes_under_preparing() { // تحت التجهيز

        $("#open_Trill").attr("disabled", "disabled").off('click');
        $("#open_Trill").addClass("disabledDiv");


        $("#divProcessClose").attr("disabled", "disabled").off('click');
        $("#divProcessClose").addClass("disabledDiv");

        $("#data_lebel").attr("disabled", "disabled").off('click');
        $("#data_lebel").addClass("disabledDiv");

        $('#divlepRentdata_3').addClass('display_none');
        $('#spanlepRentdata_3').toggleClass('fa-angle-double-left');
        $('#spanlepRentdata_3').toggleClass('fa-angle-double-down');

        $('#lepRentdata').addClass('showdiv');
        $('#spanlepRentdata_4').toggleClass('fa-angle-double-left');
        $('#spanlepRentdata_4').toggleClass('fa-angle-double-down');

        $('#lepMoney').addClass('showdiv');
        $('#spanlepMoney_4').toggleClass('fa-angle-double-left');
        $('#spanlepMoney_4').toggleClass('fa-angle-double-down');

        $('#divlOerSalesman_2').addClass('showdiv');
        $('#spanlOerSalesman_2').toggleClass('fa-angle-double-left');
        $('#spanlOerSalesman_2').toggleClass('fa-angle-double-down');


        $("#Processshutdown").attr("disabled", "disabled").off('click');
        $("#Financialsituation").attr("disabled", "disabled").off('click');
        $("#Div_Money").attr("disabled", "disabled").off('click');




        $("#OerSalesman").attr("disabled", "disabled").off('click');




        btnUpdate_1.classList.remove('display_none');
        btnUpdate_2.classList.remove('display_none');
        btnUpdate_3.classList.remove('display_none');
        btnUpdate_4.classList.add('display_none');
        btnUpdate_5.classList.add('display_none');

        btnUpdate_1.removeAttribute('disabled');
        btnUpdate_2.removeAttribute('disabled');
        btnUpdate_3.removeAttribute('disabled');

        $("#btnOpen").attr("disabled", "disabled").off('click');
        $("#btnOpen").removeClass("btn-dark-green");
        // $("#btnOpen").attr("style", "")

        $("#btnClose").attr("disabled", "disabled").off('click');
        $("#btnPresent").removeAttr("disabled");

        // $("#btnClose").attr("style", "")
        //$("#btnPresent").attr("style", "background-color: #b0fdc8; margin-right: 8%;")
        $("#btnClose").removeClass("btn-red");
        $("#btnPresent").addClass("btn-green");



    }
    function Processes_Ready() { //جاهزة

        /* $("#divProcessClose").attr("disabled", "disabled").off*/('click');
        $("#divProcessClose").addClass("disabledDiv");

        $("#data_lebel").attr("disabled", "disabled").off('click');
        $("#data_lebel").addClass("disabledDiv");

        $('#divlepRentdata_1').addClass('display_none');
        $('#spanlepRentdata_1').toggleClass('fa-angle-double-left');
        $('#spanlepRentdata_1').toggleClass('fa-angle-double-down');

        $('#divlepRentdata_2').addClass('display_none');
        $('#spanlepRentdata_2').toggleClass('fa-angle-double-left');
        $('#spanlepRentdata_2').toggleClass('fa-angle-double-down');

        $('#divlepRentdata_3').addClass('display_none');
        $('#spanlepRentdata_3').toggleClass('fa-angle-double-left');
        $('#spanlepRentdata_3').toggleClass('fa-angle-double-down');

        $('#lepRentdata').addClass('showdiv');
        $('#spanlepRentdata_4').toggleClass('fa-angle-double-left');
        $('#spanlepRentdata_4').toggleClass('fa-angle-double-down');

        $('#lepMoney').addClass('showdiv');
        $('#spanlepMoney_4').toggleClass('fa-angle-double-left');
        $('#spanlepMoney_4').toggleClass('fa-angle-double-down');

        $('#divlOerSalesman_2').addClass('showdiv');
        $('#spanlOerSalesman_2').toggleClass('fa-angle-double-left');
        $('#spanlOerSalesman_2').toggleClass('fa-angle-double-down');


        $("#Payload_data").attr("disabled", "disabled").off('click');
        $("#Expenses").attr("disabled", "disabled").off('click');
        $("#Processshutdown").attr("disabled", "disabled").off('click');
        $("#Div_Money").attr("disabled", "disabled").off('click');



        $("#OerSalesman").attr("disabled", "disabled").off('click');



        Update_1_onclick();

        $("#open_Trill").removeAttr("disabled");
        $("#open_Trill").removeClass("disabledDiv");

        $("#txtNumber").attr("disabled", "disabled");
        $("#txtDate").attr("disabled", "disabled");
        $("#txtReferenceNumber").attr("disabled", "disabled");
        $("#txtTruckNumber").attr("disabled", "disabled");
        $("#txtPortName").attr("disabled", "disabled");
        $("#ddlVendor").attr("disabled", "disabled");
        $("#txtNationality").attr("disabled", "disabled");
        $("#ddlTrtype").attr("disabled", "disabled");
        $("#txtClearanceDate").attr("disabled", "disabled");
        $("#txtPaperPurchaseValue").attr("disabled", "disabled");
        $("#txtCustomNo").attr("disabled", "disabled");
        $("#txtPolice_num").attr("disabled", "disabled");

        $("#txtStatus").val("جاهزة");

        ////btnUpdate_1.classList.remove('display_none');
        //btnUpdate_2.classList.add('display_none');
        //btnUpdate_3.classList.add('display_none');
        //btnUpdate_4.classList.add('display_none');
        //btnUpdate_5.classList.add('display_none');

    }
    function Processes_Open() { //مفتوحة

        $("#div_Master").attr("disabled", "disabled").off('click');
        $("#div_Master").addClass("disabledDiv");

        $("#DivShow").attr("disabled", "disabled").off('click');
        //$("#DivShow").addClass("disabledDiv");

        $("#data_lebel").attr("disabled", "disabled").off('click');
        $("#data_lebel").addClass("disabledDiv");

        $("#open_Trill").attr("disabled", "disabled").off('click');
        $("#open_Trill").addClass("disabledDiv");

        $("#divProcessClose").attr("disabled", "disabled").off('click');
        $("#divProcessClose").addClass("disabledDiv");

        //$("#Processshutdown").attr("disabled", "disabled").off('click');

        //$("#Financialsituation").attr("disabled", "disabled").off('click');
        //$("#Div_Money").attr("disabled", "disabled").off('click');


        //$('#divlepRentdata_3').addClass('display_none');
        //$('#spanlepRentdata_3').toggleClass('fa-angle-double-left');
        //$('#spanlepRentdata_3').toggleClass('fa-angle-double-down');

        //$('#lepRentdata').addClass('showdiv');
        //$('#spanlepRentdata_4').toggleClass('fa-angle-double-left');
        //$('#spanlepRentdata_4').toggleClass('fa-angle-double-down');

        //$('#lepMoney').addClass('showdiv');
        //$('#spanlepMoney_4').toggleClass('fa-angle-double-left');
        //$('#spanlepMoney_4').toggleClass('fa-angle-double-down');

        btnUpdate_1.classList.remove('display_none');

        btnUpdate_3.classList.remove('display_none');
        btnUpdate_4.classList.add('display_none');
        btnUpdate_5.classList.remove('display_none');

        btnReCalculation.classList.remove('display_none');
        btnUpdate_2.style.display = 'block';


        btnUpdate_1.removeAttribute('disabled');
        btnUpdate_5.removeAttribute('disabled');
        btnUpdate_3.removeAttribute('disabled');

        $("#btnPresent").attr("disabled", "disabled").off('click');
        $("#btnOpen").attr("disabled", "disabled").off('click');
        // $("#btnOpen").attr("style", "")
        $("#btnOpen").removeClass("btn-dark-green");

        //$("#btnPresent").attr("style", "margin-right: 8%;")
        //$("#btnClose").attr("style", "background-color: #fdb0b0;");
        $("#btnClose").removeAttr("disabled");
        $("#btnPresent").removeClass("btn-green");
        $("#btnClose").addClass("btn-red");
        $("#id_Lapl_Salesman").html('<i class="glyphicon glyphicon-hand-down"></i> &gt;&gt;  ' + (lang == "ar" ? ' الاصناف لدي المناديب   ' : ' Items I have SalesMan  ') + '   &lt;&lt; <i class="glyphicon glyphicon-hand-down"></i>');


        if (SysSession.CurrentPrivileges.CUSTOM1 == false) {
            btnClose.disabled = true;
        } else {
            btnClose.disabled = false;
        }


        //$('#divlepRentdata_3').addClass('display_none');
        //$('#spanlepRentdata_3').toggleClass('fa-angle-double-left');
        //$('#spanlepRentdata_3').toggleClass('fa-angle-double-down');
        //$("#Processshutdown").attr("disabled", "disabled").off('click');


    }
    function Processes_Close() {  //مغلقة

        $("#div_Master").attr("disabled", "disabled").off('click');
        $("#div_Master").addClass("disabledDiv");

        $("#DivShow").attr("disabled", "disabled").off('click');
        //$("#DivShow").addClass("disabledDiv");

        $("#data_lebel").attr("disabled", "disabled").off('click');
        $("#data_lebel").addClass("disabledDiv");

        $("#open_Trill").attr("disabled", "disabled").off('click');
        $("#open_Trill").addClass("disabledDiv");

        $("#divProcessClose").attr("disabled", "disabled").off('click');
        $("#divProcessClose").addClass("disabledDiv");

        btnUpdate_1.classList.add('display_none');

        btnUpdate_3.classList.add('display_none');
        btnUpdate_4.classList.add('display_none');
        btnUpdate_5.classList.add('display_none');
        btnReCalculation.classList.add('display_none');
        btnUpdate_2.style.display = 'none';


        $("#btnPresent").attr("disabled", "disabled").off('click');
        $("#btnClose").attr("disabled", "disabled").off('click');

        //$("#btnPresent").attr("style", " margin-right: 8%;")
        $("#btnPresent").removeClass("btn-green");
        $("#btnClose").removeClass("btn-red");
        //  $("#btnClose").attr("style", " ")

        OerSalesmanGrid_Detail.DataSource = AllGetOperationMasterDetailModel.TR_OperationSalesmanItem;
        OerSalesmanGrid_Detail.Bind();



        $("#id_Lapl_Salesman").html('<i class="glyphicon glyphicon-hand-down"></i> &gt;&gt;  ' + (lang == "ar" ? ' الاصناف لدي المناديب   ' : ' Items I have SalesMan  ') + '   &lt;&lt; <i class="glyphicon glyphicon-hand-down"></i>');


        if (SysSession.CurrentPrivileges.CUSTOM2 == false) {
            $("#btnOpen").attr("disabled", "disabled");
            //  $("#btnOpen").attr("style", "")
            $("#btnOpen").removeClass("btn-dark-green");


        } else {
            btnClose.disabled = false;
            $("#btnOpen").removeAttr("disabled");
            //$("#btnOpen").attr("style", "background-color: #00e927")
            $("#btnOpen").addClass("btn-dark-green");


        }



        $('#divlepRentdata_3').removeClass('display_none');
        $('#spanlepRentdata_3').toggleClass('fa-angle-double-left');
        $('#spanlepRentdata_3').toggleClass('fa-angle-double-down');
        $("#Processshutdown").removeAttr("disabled");




        $("#btnClose").attr("disabled", "disabled");
        //$("#btnClose").attr("style", "")
        $("#btnClose").removeClass("btn-red");

        $("#btnPresent").attr("disabled", "disabled");
        // $("#btnPresent").attr("style", "")
        $("#btnPresent").removeClass("btn-green")

        //Calculation_Close();

    }
    function Processes_itemClose() {  //تجهيز الاغلاق

        $("#div_Master").attr("disabled", "disabled").off('click');
        $("#div_Master").addClass("disabledDiv");

        $("#DivShow").attr("disabled", "disabled").off('click');
        //$("#DivShow").addClass("disabledDiv");

        $("#data_lebel").attr("disabled", "disabled").off('click');
        $("#data_lebel").addClass("disabledDiv");

        $("#open_Trill").attr("disabled", "disabled").off('click');
        $("#open_Trill").addClass("disabledDiv");

        $("#divProcessClose").attr("disabled", "disabled").off('click');
        $("#divProcessClose").addClass("disabledDiv");

        btnUpdate_1.classList.add('display_none');

        btnUpdate_3.classList.add('display_none');
        btnUpdate_4.classList.add('display_none');
        btnUpdate_5.classList.add('display_none');


        $("#btnPresent").attr("disabled", "disabled").off('click');
        $("#btnClose").attr("disabled", "disabled").off('click');

        // $("#btnPresent").attr("style", " margin-right: 8%;")
        $("#btnPresent").removeClass("btn-green");
        $("#btnClose").removeClass("btn-red");
        //$("#btnClose").attr("style", " ")

        OerSalesmanGrid_Detail.DataSource = AllGetOperationMasterDetailModel.TR_OperationSalesmanItem;
        OerSalesmanGrid_Detail.Bind();



        $("#id_Lapl_Salesman").html('<i class="glyphicon glyphicon-hand-down"></i> &gt;&gt;  ' + (lang == "ar" ? ' الاصناف لدي المناديب   ' : ' Items I have SalesMan  ') + '   &lt;&lt; <i class="glyphicon glyphicon-hand-down"></i>');


        if (SysSession.CurrentPrivileges.CUSTOM2 == false) {
            $("#btnOpen").attr("disabled", "disabled");
            //$("#btnOpen").attr("style", "")
            $("#btnOpen").removeClass("btn-dark-green");

            $('#divlepRentdata_3').addClass('display_none');
            $('#spanlepRentdata_3').toggleClass('fa-angle-double-left');
            $('#spanlepRentdata_3').toggleClass('fa-angle-double-down');
            $("#Processshutdown").attr("disabled", "disabled").off('click');
        } else {
            btnClose.disabled = false;
            $("#btnOpen").removeAttr("disabled");
            // $("#btnOpen").attr("style", "background-color: #00e927")
            $("#btnOpen").addClass("btn-dark-green");


        }

    }
    //-------------------------------------------------------button---Processes--------------------------------------
    function btnReCalculation_onclick() {
        let OperID = Number(OperationID);
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("Processes", "ReCalculation"),
            data: { OperationID: OperID },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    disabled_Grid_Controls();
                    flag_Success_2 = false;
                    Display();
                    MasterGridBiuld();
                    Processes_Open();
                    flag_Success_2 = false;
                }
                else {

                }
            }
        });

    }

    function btnOpen_onclick() {


        if (Status == 3) {

            Ajax.Callsync({
                type: "Get",
                url: sys.apiUrl("Processes", "OpenOperationItemsSum"),
                data: { OperationID: OperationID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
                success: (d) => {
                    let result = d as BaseResponse;
                    if (result.IsSuccess) {
                        ddlStateType.value = '111';

                        DisplayMassage("تم فتح عملية بنجاح", "Operation added successfully", MessageType.Succeed);


                        flag_Back = true;

                        Ready = 1;

                        $('#txtUpdatedBy').val(SysSession.CurrentEnvironment.UserCode);
                        $('#txtUpdatedAt').val(DateTimeFormat(Date().toString()));

                        btnBack_1_onclick();


                        showdiv();
                        $('#divlepRentdata_1').removeClass('display_none');
                        $('#spanlepRentdata_1').toggleClass('fa-angle-double-left');
                        $('#spanlepRentdata_1').toggleClass('fa-angle-double-down');

                        $('#divlepRentdata_2').removeClass('display_none');
                        $('#spanlepRentdata_2').toggleClass('fa-angle-double-left');
                        $('#spanlepRentdata_2').toggleClass('fa-angle-double-down');

                        $('#divlepRentdata_3').addClass('display_none');
                        $('#spanlepRentdata_3').toggleClass('fa-angle-double-left');
                        $('#spanlepRentdata_3').toggleClass('fa-angle-double-down');


                        Processes_Open();



                        $("#btnOpen").attr("disabled", "disabled");
                        //  $("#btnOpen").attr("style", "")
                        $("#btnOpen").removeClass("btn-dark-green");


                        $("#btnPresent").attr("disabled", "disabled");
                        // $("#btnPresent").attr("style", "")
                        $("#btnPresent").removeClass("btn-green");


                        flag_Back = false;


                    } else {
                        DisplayMassage("خطأء!", "Error!", MessageType.Worning);

                    }
                }
            });
        }
        else {
            DisplayMassage("يجب ان تكون العمليه مغلقة", "The process must be under preparation!", MessageType.Worning);
        }

    }
    function btnPresent_onclick() {
        if (Status == 0) {

            if (CountGrid == -1) {
                DisplayMassage("يجب ادخال يبنات الحموله", "Payload data must be entered!", MessageType.Worning);
                btnUpdate_2.focus();
                Update_2_onclick();
            }
            else {
                Processes_Ready();
                Ready = 1;
                Status = 1;
            }
        }
        else {
            DisplayMassage("يجب ان تكون العمليه تحت التجهيز", "The process must be under preparation!", MessageType.Worning);
        }

    }
    function btnClose_onclick() {
        if (Status == 4) {
            var AvailableQty = false;

            OerSalesmanGrid_Detail.DataSource = AllGetOperationMasterDetailModel.TR_OperationSalesmanItem;
            OerSalesmanGrid_Detail.Bind();
            SalesmanItem_AllAssign(AllGetOperationMasterDetailModel.TR_OperationSalesmanItem);

            $("#id_Lapl_Salesman").html('<i class="glyphicon glyphicon-hand-down"></i> &gt;&gt;  ' + (lang == "ar" ? ' الاصناف لدي المناديب   ' : ' Items I have SalesMan  ') + '   &lt;&lt; <i class="glyphicon glyphicon-hand-down"></i>');
            $("#Financialsituation").removeAttr("disabled");
            $("#Div_Money").removeAttr("disabled");

            $('#lepRentdata').removeClass('showdiv');
            $('#spanlepRentdata_4').addClass('fa-angle-double-down');

            $('#lepMoney').removeClass('showdiv');
            $('#spanlepMoney_4').addClass('fa-angle-double-down');

            let cnt = 1;
            let ii = 0;
            $("#OerSalesmanGrid_Detail").jsGrid("option", "pageIndex", cnt);

            for (var i = 0; i < AllGetOperationMasterDetailModel.TR_OperationSalesmanItem.length; i++) {

                if (ii > 15) {
                    cnt += 1;

                    $("#OerSalesmanGrid_Detail").jsGrid("option", "pageIndex", cnt);

                    ii = 0;
                }
                let id = AllGetOperationMasterDetailModel.TR_OperationSalesmanItem[i].OperationSalesmanItemID;

                if ($("#OnhandQty" + id).val() != '0' && $("#OnhandQty" + id).val() != null) {
                    AvailableQty = true;
                    Errorinput($("#OnhandQty" + id));
                }

                ii++;
            }



            //if (AvailableQty == true) {
            //    DisplayMassage("يجب ان تكون الكمية المتبقية = صفر", "The remaining amount should be = 0!", MessageType.Worning);
            //    btnUpdate_5.focus();
            //    Update_5_onclick();

            //}
            //else if ($('#lab_Close_CashOnhand').text() != '0') {
            //    DisplayMassage(" يجب ان يكون النقدي لدي المندوب = صفر", "The delegate's cash must be = 0!", MessageType.Worning);
            //    btnUpdate_5.focus();
            //    Update_5_onclick();
            //    Errorinput($("#lab_Close_CashOnhand"));
            //}
            //else {

            debugger
            $("#Processshutdown").removeAttr("disabled");
            $('#divlepRentdata_3').removeClass('display_none');
            $('#spanlepRentdata_3').toggleClass('fa-angle-double-left');
            $('#spanlepRentdata_3').toggleClass('fa-angle-double-down');
            btnUpdate_4.classList.remove('display_none');
            btnUpdate_4.focus();
            Update_4_onclick();
            //$('#txtClose_CompanyCommition').val(0);
            //$('#txtClose_NetProfit').val(0);
            //$('#txtClose_purchaseValue').val(0);


            if (btnSave_2.getAttribute('class') == 'icon-bar3 d-flex justify-content-between btn-save') {

                btnBack_2_onclick();

            }
            btnBack_3_onclick();
            btnBack_5_onclick();

            btnUpdate_1.disabled = true;
            btnUpdate_2.disabled = true;
            btnUpdate_3.disabled = true;
            btnUpdate_5.disabled = true;
            btnReCalculation.disabled = true;
            //}



            Calculation_Close();

        }
        else {
            DisplayMassage("يجب ان تكون العمليه مفتوحه", "The process must be open!", MessageType.Worning);
        }

        DisabledToolBar();
    }
    function btnClose_Focus_onclick() {
        //$('#txtStatus').val(" مفتوحة");
        //Status = 2;
        //ddlSalesman.focus();
        //$('html, body').animate({
        //    scrollTop: $("#txtClose_AdjustmentRemarks").offset().top
        //}, 2000);

        document.body.scrollTop = 2000;
        document.documentElement.scrollTop = 2000;
        //btnUpdate_2.focus();
    }
    function btnView_load_onclick() {

        //$('html, body').animate({
        //    scrollTop: $("#txtGoods_Desc").offset().top
        //}, 2000);

        document.body.scrollTop = 800;
        document.documentElement.scrollTop = 800;

        // btnUpdate_2.focus();

    }
    function btnExpenses_onclick() {
        //$('html, body').animate({
        //    scrollTop: $("#txtRemark").offset().top
        //}, 2000);

        document.body.scrollTop = 1100;
        document.documentElement.scrollTop = 1100;

        btnUpdate_3.focus();
    }
    //-------------------------------------------------------button---Save and Back and Eidt--------------------------------------
    function btnAdd_onclick() {
        if (!SysSession.CurrentPrivileges.AddNew) return;
        flag_Add = true;
        FlagIns_Operation = true;
        clear();
        btnUpdate_1.classList.add("display_none");
        btnSave_1.classList.remove("display_none");
        btnBack_1.classList.remove("display_none");

        $("#div_Master").removeClass("disabledDiv");

        $("#DivHederMaster").attr("disabled", "disabled").off('click');
        $("#DivHederMaster").addClass("disabledDiv");

        $("#div_MasterGird").attr("disabled", "disabled").off('click');
        $("#div_MasterGird").addClass("disabledDiv");

        $('#divlepRentdata_1').addClass('display_none');
        $('#spanlepRentdata_1').toggleClass('fa-angle-double-left');
        $('#spanlepRentdata_1').toggleClass('fa-angle-double-down');


        $('#divlepRentdata_2').addClass('display_none');
        $('#spanlepRentdata_2').toggleClass('fa-angle-double-left');
        $('#spanlepRentdata_2').toggleClass('fa-angle-double-down');

        $('#divlepRentdata_3').addClass('display_none');
        $('#spanlepRentdata_3').toggleClass('fa-angle-double-left');
        $('#spanlepRentdata_3').toggleClass('fa-angle-double-down');

        $('#lepRentdata').addClass('showdiv');
        $('#spanlepRentdata_4').toggleClass('fa-angle-double-left');
        $('#spanlepRentdata_4').toggleClass('fa-angle-double-down');

        $('#lepMoney').addClass('showdiv');
        $('#spanlepMoney_4').toggleClass('fa-angle-double-left');
        $('#spanlepMoney_4').toggleClass('fa-angle-double-down');

        $('#divlOerSalesman_2').addClass('showdiv');
        $('#spanlOerSalesman_2').toggleClass('fa-angle-double-left');
        $('#spanlOerSalesman_2').toggleClass('fa-angle-double-down');


        $("#Payload_data").attr("disabled", "disabled").off('click');
        $("#Expenses").attr("disabled", "disabled").off('click');
        $("#Processshutdown").attr("disabled", "disabled").off('click');
        $("#Financialsituation").attr("disabled", "disabled").off('click');
        $("#Div_Money").attr("disabled", "disabled").off('click');
        $("#OerSalesman").attr("disabled", "disabled").off('click');



        $("#btnPresent").attr("disabled", "disabled").off('click');
        $("#btnClose").attr("disabled", "disabled").off('click');

        //$("#btnPresent").attr("style", "  margin-right: 8%;")
        //$("#btnClose").attr("style", "")
        $("#btnClose").removeClass("btn-red");
        $("#btnPresent").removeClass("btn-green");

        $("#btnOpen").attr("disabled", "disabled").off('click');
        //$("#btnOpen").attr("style", "")
        $("#btnOpen").removeClass("btn-dark-green");

        //$("#txtNumber").removeAttr("disabled");
        //$("#txtReferenceNumber").removeAttr("disabled");
        $("#txtDate").removeAttr("disabled");
        $("#txtTruckNumber").removeAttr("disabled");
        $("#txtPortName").removeAttr("disabled");
        $("#ddlVendor").removeAttr("disabled");
        $("#txtNationality").removeAttr("disabled");
        $("#ddlTrtype").removeAttr("disabled");
        $("#txtClearanceDate").removeAttr("disabled");
        $("#txtPaperPurchaseValue").removeAttr("disabled");
        $("#txtCustomNo").removeAttr("disabled");
        $("#txtPolice_num").removeAttr("disabled");

        $('#ddlSalesman').prop('selectedIndex', 0);
    }

    function Update_1_onclick() {
        if (!SysSession.CurrentPrivileges.EDIT) return;
        btnUpdate_1.classList.add("display_none");
        btnSave_1.classList.remove("display_none");
        btnBack_1.classList.remove("display_none");

        $("#div_Master").removeClass("disabledDiv");

        FlagIns_Operation = false;

        $("#DivHederMaster").attr("disabled", "disabled").off('click');
        $("#DivHederMaster").addClass("disabledDiv");
        $("#div_MasterGird").addClass("disabledDiv");


        //$("#txtNumber").removeAttr("disabled");
        $("#txtDate").removeAttr("disabled");
        //$("#txtReferenceNumber").removeAttr("disabled");
        $("#txtTruckNumber").removeAttr("disabled");
        $("#txtPortName").removeAttr("disabled");
        $("#ddlVendor").removeAttr("disabled");
        $("#txtNationality").removeAttr("disabled");
        $("#ddlTrtype").removeAttr("disabled");
        $("#txtClearanceDate").removeAttr("disabled");
        $("#txtCustomNo").removeAttr("disabled");
        $("#txtPaperPurchaseValue").removeAttr("disabled");
        $("#txtPolice_num").removeAttr("disabled");



        flag_Add = false;
        Update_1 = true;


        //btnBack_3_onclick();
        //btnBack_2_onclick();

        //if (Status == 2) {//مفتوحة 
        //    btnBack_5_onclick();
        //}
        //if (Status == 0) {//تحت التجهيز 
        //}


        //(x1 == true) ?  : $("#div_Master").addClass("disabledDiv");

        DisabledToolBar();
    }
    function btnBack_1_onclick() {
        debugger
        if (flag_Add == true) {
            debugger
            if (flag_succ_insert == true) {
                debugger
                $("#div_Master").attr("disabled", "disabled").off('click');
                $("#div_Master").addClass("disabledDiv")
                btnUpdate_1.classList.remove("display_none");
                btnSave_1.classList.add("display_none");
                btnBack_1.classList.add("display_none");
                $('#ddlStateType option[value=111]').prop('selected', 'selected').change();
                btnShow_onclick();

                MasterGridBiuld();
                $('#divlepRentdata_1').removeClass('display_none');
                $('#spanlepRentdata_1').toggleClass('fa-angle-double-left');
                $('#spanlepRentdata_1').toggleClass('fa-angle-double-down');

                $('#divlepRentdata_2').removeClass('display_none');
                $('#spanlepRentdata_2').toggleClass('fa-angle-double-left');
                $('#spanlepRentdata_2').toggleClass('fa-angle-double-down');

                //Update_2_onclick();
                //Update_3_onclick();
                //btnUpdate_3.focus();

                $("#btnPresent").removeAttr("disabled");
                $("#btnClose").attr("disabled", "disabled").off('click');
                //   $("#btnPresent").attr("style", "background-color: #198754")
                $("#btnPresent").addClass("btn-green");
                //  $("#btnClose").attr("style", "")
                $("#btnClose").addClass("btn-red");

            }
            else {
                debugger
                $("#div_Master_Hedr").addClass("display_none");
                $('#div_Master').addClass('disabledDiv');

                btnUpdate_1.classList.remove("display_none");
                btnSave_1.classList.add("display_none");
                btnBack_1.classList.add("display_none");

            }
            flag_succ_insert = false;

            RemoveDisabledToolBar();
        }
        else {
            debugger
            if (flag_Back == true) {
                //  debugger
                debugger
                $("#div_Master").attr("disabled", "disabled").off('click');
                $("#div_Master").addClass("disabledDiv")
                btnUpdate_1.classList.remove("display_none");
                btnSave_1.classList.add("display_none");
                btnBack_1.classList.add("display_none");
                Display();
                flag_Back = false;

                $("#open_Trill").attr("disabled", "disabled").off('click');
                $("#open_Trill").addClass("disabledDiv");
                MasterGridBiuld();
                //Update_1 = false;
                //Update_2 = false;
                //Update_3 = false;
                //Update_4 = false;
                //Update_5 = false;
                //disabled_divMasterGridiv();
            }
            else {
                debugger
                $("#div_Master").attr("disabled", "disabled").off('click');
                $("#div_Master").addClass("disabledDiv")
                btnUpdate_1.classList.remove("display_none");
                btnSave_1.classList.add("display_none");
                btnBack_1.classList.add("display_none");
                MasterGridBiuld();
                $("#open_Trill").attr("disabled", "disabled").off('click');
                $("#open_Trill").addClass("disabledDiv");
            }
            debugger
            RemoveDisabledToolBar();
        }

        debugger

        Update_1 = false;
        disabled_divMasterGridiv();
        //divGridDetails_onclick();

    }
    function btnSave_1_onclick() {
        loading('btnsave');

        setTimeout(function () {

            finishSave('btnsave');

            if (!ValidationHeader()) return

            Assign_1_Processes();
            if (FlagIns_Operation == true) {//Insert
                // 
                Insert_1_Processes();

            }
            else {// Update 

                Update_1_Processes();
                disabled_divMasterGridiv();
            }

            //alert('ok');
            //console.log(Model_I_TR_Operation);
            btnBack_1_onclick();
            flag_Back = false;

        }, 100);
        //btnSave_2.classList.add("display_none");
        //btnBack_2.classList.add("display_none");
        //btnSave_3.classList.add("display_none");
        //btnBack_3.classList.add("display_none");
        //btnSave_4.classList.add("display_none");
        //btnBack_4.classList.add("display_none");
        //btnSave_5.classList.add("display_none");
        //btnBack_5.classList.add("display_none");
    }

    function Update_2_onclick() {
        if (!SysSession.CurrentPrivileges.EDIT) return;

        btnUpdate_2.classList.add("display_none");
        btnSave_2.classList.remove("display_none");
        btnBack_2.classList.remove("display_none");

        //$("#DivShow").removeClass("disabledDiv");
        $("#DivShow").attr("disabled", "disabled");
        $("#DivHederMaster").attr("disabled", "disabled").off('click');
        $("#DivHederMaster").addClass("disabledDiv");

        $("#div_MasterGird").attr("disabled", "disabled").off('click');
        $("#div_MasterGird").addClass("disabledDiv");

        debugger

        //$("#btnAddDetailsItemsData").addClass("display_none");
        debugger
        for (var i = 0; i < CountGridItemsData; i++) {
            $("#btn_minusclous" + i).removeClass("display_none");
            $("#btn_minusclous" + i).removeAttr("disabled");
            $("#txt_SoldQty" + i).removeAttr("disabled");
            $("#txt_UnitPrice" + i).removeAttr("disabled");
            $("#txt_Remark" + i).removeAttr("disabled");
            $("#btnAddDetailsItemsData").removeClass("display_none");
        }


        Update_2 = true;


        btnBack_3_onclick()
        //btnBack_1_onclick()

        $(".UnitPrice").removeAttr("disabled");
        $(".SoldQty").removeAttr("disabled");


        DisabledToolBar();
    }
    function btnBack_2_onclick() {
        debugger
        btnUpdate_2.classList.remove("display_none");
        btnSave_2.classList.add("display_none");
        btnBack_2.classList.add("display_none");
        disabled_Grid_Controls();
        flag_Success_2 = false;
        //Display();
        MasterGridBiuld();
        //Processes_Open();
        $("#div_ItemsData").html('');
        CountGridItemsData = 0;

        for (var i = 0; i < TR_OperationItemsSum.length; i++) {

            BuildControlsItemsData(i, golabelcnt);
            Disbly_BuildControlsItemsData(i, TR_OperationItemsSum);
            CountGridItemsData += 1;
        }

        $("#nameitem").text(nameGlopl);
        Update_2 = false;

        remove_disabled_ItemsData_Grid();
        ComputeTotals();

        $("#DivHederMaster").removeClass("disabledDiv");
        $("#div_MasterGird").removeClass("disabledDiv");

        //divGridDetails_onclick();
        RemoveDisabledToolBar();
    }
    function btnSave_2_onclick() {
        loading('btnsave');

        setTimeout(function () {
            finishSave('btnsave');


            var CanAdd: boolean = true;
            if (CountGridItemsData < 0) {
                DisplayMassage(" برجاء ادخال  تفاصيل مبيعات الصنف", "Please enter the payload data", MessageType.Worning);
                Errorinput(btnAddDetails);
                CanAdd = false;
            }
            //else {
            //    //    if (CountGridItemsData > 0) {

            //    //        for (var i = 0; i <= CountGridItemsData; i++) {

            //    //            CanAdd = ValidationSum_Grid(i);
            //    //        if (CanAdd == false) {
            //    //            break;
            //    //        }
            //    //    }
            //    //}
            //}
            if (CanAdd) {
                Assign_2_ItemsSum();
                //if (Status == 2) {//مفتوحة
                //    Update_2_items_Open();
                //}
                //else {
                Update_2_ItemsSum();
                //}
                //btnBack_2_onclick();
                ComputeTotals();

                Calculation_Close();

            }


        }, 100);
    }

    function Update_3_onclick() {

        if (!SysSession.CurrentPrivileges.EDIT) return;
        btnUpdate_3.classList.add("display_none");
        btnSave_3.classList.remove("display_none");
        btnBack_3.classList.remove("display_none");



        for (var cnt = 0; cnt < AllGetOperationMasterDetailModel.IQ_GetOperationCharges.length; cnt++) {
            $("#txtAddonsCharge" + cnt).removeAttr("disabled");
            $("#txtValueCharge" + cnt).removeAttr("disabled");
            $("#txtVatType" + cnt).removeAttr("disabled");
            $("#txtVendorIsCheckCharge" + cnt).removeAttr("disabled");
            $("#txtInvoiceNumberCharge" + cnt).removeAttr("disabled");
            $("#RemarksCharge" + cnt).removeAttr("disabled");
            $("#txtInvoiceDateCharge" + cnt).removeAttr("disabled");
            $("#txtVendorCharge" + cnt).removeAttr("disabled");

            if ($("#txtVendorIsCheckCharge" + cnt).val() == 1) {
                $("#txt_D_CashBox" + cnt).prop("disabled", false);

            }
            else {
                $("#txt_D_CashBox" + cnt).prop("disabled", true);
            }

        }


        $("#btnAddDetailsCharge").removeClass("display_none");
        $(".minusCharges").removeClass("display_none");


        //$("#DivChargesShow").removeClass("disabledDiv");

        $("#DivHederMaster").attr("disabled", "disabled").off('click');
        $("#DivHederMaster").addClass("disabledDiv");
        $("#div_MasterGird").attr("disabled", "disabled").off('click');
        $("#div_MasterGird").addClass("disabledDiv");
        Update_3 = true;



        //btnBack_1_onclick(); 
        if (btnSave_2.getAttribute('class') == 'icon-bar3 d-flex justify-content-between btn-save') {

            btnBack_2_onclick();

        }

        if (Status == 2) {//مفتوحة
            btnBack_5_onclick();
        }
        if (Status == 0) {//مفتوحة
        }

        //(x1 == true) ?  : $("#div_Master").addClass("disabledDiv");

        DisabledToolBar();
    }
    function btnBack_3_onclick() {
        if (flag_Add == true) {

            $(".minusCharges").addClass("display_none");
            $("#btnAddDetailsCharge").addClass("display_none");
            btnUpdate_3.classList.remove("display_none");
            btnSave_3.classList.add("display_none");
            btnBack_3.classList.add("display_none");

            $("#div_ChargesData").html('');
            CountGridCharge = 0;
            CountItemsCharge = 0;
        }
        else {

            if (flag_Success_3 == true) {

                $(".minusCharges").addClass("display_none");
                $("#btnAddDetailsCharge").addClass("display_none");
                btnUpdate_3.classList.remove("display_none");
                btnSave_3.classList.add("display_none");
                btnBack_3.classList.add("display_none");
                Display();
                MasterGridBiuld();
                flag_Success_3 = false;
            }
            else {

                $(".minusCharges").addClass("display_none");
                $("#btnAddDetailsCharge").addClass("display_none");
                btnUpdate_3.classList.remove("display_none");
                btnSave_3.classList.add("display_none");
                btnBack_3.classList.add("display_none");

                $("#div_ChargesData").html('');
                CountGridCharge = 0;
                CountItemsCharge = 0;
                for (var i = 0; i < AllGetOperationMasterDetailModel.IQ_GetOperationCharges.length; i++) {

                    BuildControlsCharges(i);
                    Disbly_BuildControlsCharges(i, AllGetOperationMasterDetailModel.IQ_GetOperationCharges);
                    CountGridCharge += 1;
                    CountItemsCharge += 1;
                }
            }
        }

        Update_3 = false;
        disabled_divMasterGridiv();
        ComputeTotalsCharge();
        //divGridDetails_onclick();
        RemoveDisabledToolBar();
    }
    function btnSave_3_onclick() {
        loading('btnsave');

        setTimeout(function () {

            finishSave('btnsave');

            var CanAddCharge: boolean = true;

            if (CountGridCharge > 0) {

                for (var i = 0; i < CountGridCharge; i++) {

                    CanAddCharge = ValidationCharge_Grid(i);
                    if (CanAddCharge == false) {
                        break;
                    }
                }
            }
            if (CanAddCharge) {
                Assign_3_Charges();
                Update_3_Charges();
                btnBack_3_onclick();
            }
        }, 100);
    }

    function Update_4_onclick() {
        if (!SysSession.CurrentPrivileges.EDIT) return;
        btnUpdate_4.classList.add("display_none");
        btnSave_4.classList.remove("display_none");
        btnBack_4.classList.remove("display_none");

        $("#divProcessClose").removeClass("disabledDiv");


        $("#DivHederMaster").attr("disabled", "disabled").off('click');
        $("#DivHederMaster").addClass("disabledDiv");

        $("#div_MasterGird").attr("disabled", "disabled").off('click');
        $("#div_MasterGird").addClass("disabledDiv");

        Update_4 = true;

        DisabledToolBar();
    }
    function btnBack_4_onclick() {


        if (flag_Back == true) {
            // 
            $("#divProcessClose").attr("disabled", "disabled").off('click');
            $("#divProcessClose").addClass("disabledDiv");
            //btnUpdate_4.classList.remove("display_none");
            btnSave_4.classList.add("display_none");
            btnBack_4.classList.add("display_none");
            Display();
            $('#txtStatus').val('مغلقة');
            Processes_Close();

            $("#btnView_load").focus();

            Display();
            MasterGridBiuld();

            flag_Back = false;

            btnUpdate_1.disabled = false;
            btnUpdate_2.disabled = false;
            btnUpdate_3.disabled = false;
            btnReCalculation.disabled = false;
        }
        else {

            $("#divProcessClose").attr("disabled", "disabled").off('click');
            $("#divProcessClose").addClass("disabledDiv")
            //btnUpdate_4.classList.remove("display_none");
            btnSave_4.classList.add("display_none");
            btnBack_4.classList.add("display_none");

            DocumentActions.RenderFromModel(Selected_Data[0]);
            var trDate: string = DateFormat(Selected_Data[0].TrDate);
            txtDateHeader.value = trDate;
            $('#txtClearanceDate').val(DateFormat(Selected_Data[0].ClearanceDate));
            $('#txtdateopening').val(DateFormat(Selected_Data[0].OpenAt));
            $('#txtStatus').val(Selected_Data[0].Status_DescA);
            Status = Selected_Data[0].Status;
            $('#ddlVendor').prop("value", Selected_Data[0].VendorID);
            $('#txtNationality').prop("value", Selected_Data[0].NationalityID);
            $('#ddlTrtype').prop("value", Selected_Data[0].Trtype);
            $('#ddlSalesman option[value=' + Selected_Data[0].SalesmanId + ']').prop('selected', 'selected').change();
            $('#div_Master').removeClass('disabledDiv');
            $("#div_Master").attr("disabled", "disabled").off('click');
            $("#div_Master").addClass("disabledDiv");


            BindGetOperationItemsGridData(Selected_Data[0].OperationID);

            OperationID = Selected_Data[0].OperationID;

            var Close_TrDate: string = DateFormat(Selected_Data[0].Close_TrDate);
            $('#txtClose_TrDate').val(Close_TrDate);

            Calculation_Close();


            $('#Close_TotalSalesCredit').text(Selected_Data[0].Close_TotalSalesCredit.RoundToSt(2));
            $('#Close_TotalSalesCreditVAT').text(Selected_Data[0].Close_TotalSalesCreditVAT.RoundToSt(2));
            var AfterTotalSalesCreditVAT = Number(Selected_Data[0].Close_TotalSalesCredit) + Number(Selected_Data[0].Close_TotalSalesCreditVAT);
            $('#Close_AfterTotalSalesCreditVAT').text(AfterTotalSalesCreditVAT.RoundToSt(2));

            $('#Close_TotalSalesCash').text(Selected_Data[0].Close_TotalSalesCash.RoundToSt(2));
            $('#Close_TotalSalesCashVAT').text(Selected_Data[0].Close_TotalSalesCashVAT.RoundToSt(2));
            var AfterTotalSalesCashVAT = Number(Selected_Data[0].Close_TotalSalesCash) + Number(Selected_Data[0].Close_TotalSalesCashVAT);
            $('#Close_AfterTotalSalesCashVAT').text(AfterTotalSalesCashVAT.RoundToSt(2));

            $('#Close_AllTotalSale').text(Number(Selected_Data[0].Close_TotalSalesCash.RoundToSt(2)) + Number(Selected_Data[0].Close_TotalSalesCredit.RoundToSt(2)));
            $('#Close_AllTotalSaleVAT').text(Number(Selected_Data[0].Close_TotalSalesCashVAT.RoundToSt(2)) + Number(Selected_Data[0].Close_TotalSalesCreditVAT.RoundToSt(2)));
            $('#Close_AllAfterTotalSaleVAT').text(Number(AfterTotalSalesCreditVAT.RoundToSt(2)) + Number(AfterTotalSalesCashVAT.RoundToSt(2)));

            $("#btnClose").focus();

            $("#Processshutdown").attr("disabled", "disabled").off('click');

            //$('#divlepRentdata_3').addClass('display_none');
            //$('#spanlepRentdata_3').toggleClass('fa-angle-double-left');
            //$('#spanlepRentdata_3').toggleClass('fa-angle-double-down');

            btnUpdate_1.disabled = false;
            btnUpdate_2.disabled = false;
            btnUpdate_3.disabled = false;
            btnUpdate_5.disabled = false;
            btnReCalculation.disabled = false;

        }



        Update_4 = false;
        disabled_divMasterGridiv();
        //divGridDetails_onclick();
        RemoveDisabledToolBar();
    }
    function btnSave_4_onclick() {
        loading('btnsave');

        setTimeout(function () {

            finishSave('btnsave');

            if (!ValidationClose()) return

            FlagIns_Operation = false;
            Status = 3;

            debugger
            let Date = $('#txtClose_TrDate').val();
            if (!isDateValidInYear(Date, Finyear)) {
                DisplayMassage(" برجاء ادخال تاريخ الاغلاق صحيح", "Please enter financial data", MessageType.Worning);
                Errorinput($('#txtClose_TrDate'))
                return false
            }

            Assign_1_Processes();
            Update_1_Processes();
            btnBack_4_onclick();

            flag_Back = false;
        }, 100);
    }

    function Update_5_onclick() {
        if (!SysSession.CurrentPrivileges.EDIT) return;
        btnUpdate_5.classList.add("display_none");
        btnSave_5.classList.remove("display_none");
        btnBack_5.classList.remove("display_none");
        btnAddDetailslebel.classList.remove("display_none");
        btnAddDetailslebel.focus();
        $("#data_lebel").removeClass("disabledDiv");
        $(".lebelminus").removeClass("display_none");


        $("#DivHederMaster").attr("disabled", "disabled").off('click');
        $("#DivHederMaster").addClass("disabledDiv");

        $("#div_MasterGird").attr("disabled", "disabled").off('click');
        $("#div_MasterGird").addClass("disabledDiv");
        Update_5 = true;

        if (Status == 2) {//مفتوحة
            //btnBack_2_onclick();
            //btnBack_3_onclick();
            //btnBack_1_onclick();

        }


        $(".ScrapQty").removeAttr("disabled");
        DisabledToolBar();

    }
    function btnBack_5_onclick() {

        if (flag_Success_5 == true) {
            $("#data_lebel").attr("disabled", "disabled").off('click');
            $("#data_lebel").addClass("disabledDiv");
            btnUpdate_5.classList.remove("display_none");
            btnSave_5.classList.add("display_none");
            btnBack_5.classList.add("display_none");
            btnAddDetailslebel.classList.add("display_none");
            $(".lebelminus").addClass("display_none");
            $(".ScrapQty").attr("disabled", "disabled");


            Display();
            MasterGridBiuld();

            flag_Success_5 = false;
        }
        else {

            $("#data_lebel").attr("disabled", "disabled").off('click');
            $("#data_lebel").addClass("disabledDiv");
            btnUpdate_5.classList.remove("display_none");
            btnSave_5.classList.add("display_none");
            btnBack_5.classList.add("display_none");
            btnAddDetailslebel.classList.add("display_none");
            $(".ScrapQty").attr("disabled", "disabled");

            try {

                OerSalesmanGrid_Detail.DataSource = SalesmanItem_Data;
                OerSalesmanGrid_Detail.Bind();
                SalesmanItem_AllAssign(SalesmanItem_Data);


            } catch (e) {

            }




            $("#data_lebel").html('');
            CountGridDeposit = 0;
            for (var i = 0; i < OperationDeposit.length; i++) {

                BuildControlslebel(i);
                Disbly_BuildControlsDeposit(i, OperationDeposit);
                CountGridDeposit += 1;
            }
        }

        Update_5 = false;
        disabled_divMasterGridiv();
        //divGridDetails_onclick();
        RemoveDisabledToolBar();
    }
    function btnSave_5_onclick() {


        loading('btnsave');

        setTimeout(function () {

            finishSave('btnsave');

            var CanAddDeposit: boolean = true;

            //if (CountGridDeposit == 0) {
            //    DisplayMassage(" برجاء ادخال بيانات المالي", "Please enter financial data", MessageType.Worning);
            //    Errorinput(btnAddDetailslebel);
            //    CanAddDeposit = false;
            //}
            //else {
            if (CountGridDeposit > 0) {

                for (var i = 0; i < CountGridDeposit; i++) {

                    CanAddDeposit = ValidationDeposit_Grid(i);
                    if (CanAddDeposit == false) {
                        break;
                    }
                }
            }
            //}
            if (CanAddDeposit) {
                Assign_5_Deposit();
                Update_5_Deposit();
                btnBack_5_onclick();
            }
        }, 100);
    }

    function clear() {
        $("#div_Master_Hedr").removeClass("display_none");
        $('#div_Master').removeClass('disabledDiv');

        $('#txtNumber').val('0');
        $('#txtReferenceNumber').val('0');
        $('#txtTruckNumber').val('');
        $('#txtStatus').val('تحت التجهيز');
        Status = 0;
        $('#txtPortName').val('');
        $('#txtPaperPurchaseValue').val('');
        $('#txtCustomNo').val('');
        $('#txtPolice_num').val('');
        $('#txtGoods_Desc').val('');
        $('#txtRemark').val('');



        $('#txtClose_TotalSalesCash').val('0');
        $('#txtNetsales').val('0');
        $('#txtClose_TotalExpenses').val('0');
        $('#txtClose_Adjustment').val('0');
        $('#txtClose_AdjustmentRemarks').val('0');
        $('#txtClose_Remarks').val('0');
        $('#txtClose_CompanyCommitionPrc').val('0');
        $('#txtClose_CompanyCommition').val('0');
        $('#txtClose_SalesManCommition').val('0');
        $('#txtClose_NetProfit').val('0');
        $('#txtClose_purchaseValue').val('0');



        $('#txtDate').val(GetDate());
        $('#txtClearanceDate').val(GetDate());
        $('#txtdateopening').val(GetDate());
        $('#txtClose_TrDate').val(GetDate());

        $('#ddlVendor option[value=null]').prop('selected', 'selected').change();
        $('#txtNationality option[value=null]').prop('selected', 'selected').change();
        $('#ddlTrtype option[value=null]').prop('selected', 'selected').change();
        $('#ddlSalesman option[value=null]').prop('selected', 'selected').change();

        $('#txt_tax').val('null');
        $('#txtVatPrc').val('');
        $('#txtVatAmount').val('');
        $('#txtTotAfterTax').val('');

        $("#btnAddDetails").addClass("display_none");
        $("#btnAddDetailsCharge").addClass("display_none");

        $("#div_Data").html('');
        CountGrid = 0;

        $("#div_ChargesData").html('');
        CountGridCharge = 0;
        CountItemsCharge = 0;

    }
    function remove_disabled_Grid_Controls() {
        for (var i = 0; i < CountGrid + 1; i++) {
            $("#ddlFamily" + i).removeAttr("disabled");
            $("#ddlItem" + i).removeAttr("disabled");
            $("#txtQuantity" + i).removeAttr("disabled");
            $("#txtPrice" + i).removeAttr("disabled");
            $("#txtMinPrice" + i).removeAttr("disabled");
            //$("#txtScrapQty" + i).removeAttr("disabled");

        }
    }
    function disabled_Grid_Controls() {
        for (var i = 0; i < CountGrid + 1; i++) {

            $("#ddlFamily" + i).attr("disabled", "disabled");
            $("#ddlItem" + i).attr("disabled", "disabled");
            $("#txtQuantity" + i).attr("disabled", "disabled");
            $("#txtPrice" + i).attr("disabled", "disabled");
            $("#txtMinPrice" + i).attr("disabled", "disabled");
            $("#txtScrapQty" + i).attr("disabled", "disabled");
        }
    }
    function disabled_divMasterGridiv() {
        // 
        if (Update_1 == false && Update_2 == false && Update_3 == false && Update_4 == false && Update_5 == false) {
            $("#DivHederMaster").removeClass("disabledDiv");
            $("#div_MasterGird").removeClass("disabledDiv");
            //$("#btnPresent").removeAttr("disabled");
            //$("#btnClose").removeAttr("disabled");
            Back();
        }

    }
    function showdiv() {


        $("#Payload_data").removeAttr("disabled");
        $("#Expenses").removeAttr("disabled");
        $("#OerSalesman").removeAttr("disabled");
        $("#Processshutdown").removeAttr("disabled");
        $("#Financialsituation").removeAttr("disabled");
        $("#Div_Money").removeAttr("disabled");


        $('#Payload_data').on('click', function () {
            $('#divlepRentdata_1').toggleClass('display_none');
            $('#spanlepRentdata_1').toggleClass('fa-angle-double-left');
            $('#spanlepRentdata_1').toggleClass('fa-angle-double-down');

        });

        $('#Expenses').on('click', function () {
            $('#divlepRentdata_2').toggleClass('display_none');
            $('#spanlepRentdata_2').toggleClass('fa-angle-double-left');
            $('#spanlepRentdata_2').toggleClass('fa-angle-double-down');

        });

        $('#OerSalesman').on('click', function () {
            $('#divlOerSalesman_2').toggleClass('showdiv');
            $('#spanlOerSalesman_2').toggleClass('fa-angle-double-left');
            $('#spanlOerSalesman_2').toggleClass('fa-angle-double-down');

        });


        $('#Processshutdown').on('click', function () {
            $('#divlepRentdata_3').toggleClass('display_none');
            $('#spanlepRentdata_3').toggleClass('fa-angle-double-left');
            $('#spanlepRentdata_3').toggleClass('fa-angle-double-down');

        });


        $('#Financialsituation').on('click', function () {
            $('#lepRentdata').toggleClass('showdiv');
            $('#spanlepRentdata_4').toggleClass('fa-angle-double-left');
            $('#spanlepRentdata_4').toggleClass('fa-angle-double-down');

        });

        $('#Div_Money').on('click', function () {
            $('#lepMoney').toggleClass('showdiv');
            $('#spanlepMoney_4').toggleClass('fa-angle-double-left');
            $('#spanlepMoney_4').toggleClass('fa-angle-double-down');

        });




    }
    function divGridDetails_onclick() {

        if (Update_1 == true) {
            DisplayMassage("  الرجاء التراجع من تعديل العمليه", "Please undo this process", MessageType.Worning);
            btnBack_1.focus();
        }
        else if (Update_2 == true) {
            DisplayMassage("  الرجاء التراجع من تعديل  بيانات الحمولة", "Please undo  edit of the payload data", MessageType.Worning);
            btnBack_2.focus();
        }
        else if (Update_3 == true) {
            DisplayMassage("  الرجاء التراجع من تعديل المصروفات", "Please undo  edit the expense adjustments", MessageType.Worning);
            btnBack_3.focus();
        }
        else if (Update_4 == true) {
            DisplayMassage("  الرجاء التراجع من تعديل اغلاق العملية", "Please undo edit close process", MessageType.Worning);
            btnBack_4.focus();
        }
        else if (Update_5 == true) {
            DisplayMassage("  الرجاء التراجع من تعديل الوضع المالي", "Please undo edit the financial status adjustment", MessageType.Worning);
            btnBack_5.focus();
        }
    }
    function Validate_code(rowno: number) {
        // 
        for (var i = 0; i < CountGridDeposit; i++) {
            if (i != rowno) {

                if ($("#txt_StatusFlag2" + i).val() == "d") {
                    return true;

                }
                else {

                    if ($("#txtSerial3" + rowno).val() == $("#txtSerial3" + i).val()) {
                        let Code = $("#txtSerial3" + rowno).val();
                        $("#txtSerial3" + rowno).val("");
                        WorningMessage("لا يمكن تكرار رقم الكود " + Code, "code cannot br repeated?", "تحذير", "worning", () => {
                            $("#txtSerial3" + rowno).val("");
                            return false;
                        });
                    }

                }
            }
        }
        if ($("#txt_StatusFlag2" + rowno).val() != "i") $("#txt_StatusFlag2" + rowno).val("u");
        return true;
    }

    //------------------------------------------------------- Print Report --------------------------------------
    function PrintReport(OutType: number) {
        //
        if (!SysSession.CurrentPrivileges.PrintOut) return;
        let rp: ReportParameters = new ReportParameters();
        rp.RepType = OutType;//output report as View
        rp.FromDate = DateFormatRep(txtFromDate.value);
        rp.ToDate = DateFormatRep(txtToDate.value);
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

        if (ddlVendorMaster.selectedIndex > 0) { rp.VendorId = Number($("#ddlVendorMaster").val()); }
        else { rp.VendorId = -1; }

        rp.OperationId = -1;

        if (ddlSalesmanMaster.selectedIndex > 0) { rp.SalesmanID = Number($("#ddlSalesmanMaster").val()); }
        else { rp.SalesmanID = -1; }

        if (ddlStateType.value == '111') { rp.Status = -1; }
        else { rp.Status = Number(ddlStateType.value); }




        Ajax.Callsync({
            url: Url.Action("IProc_Rpt_OperationList", "GeneralReports"),
            data: rp,
            success: (d) => {

                let result = d.result as string;



                window.open(result, "_blank");
            }
        })
    }

    function PrintReport1(OutType: number) {
        //
        if (!SysSession.CurrentPrivileges.PrintOut) return;
        let rp: ReportParameters = new ReportParameters();
        rp.RepType = OutType;//output report as View
        rp.FromDate = DateFormatRep(txtFromDate.value);
        rp.ToDate = DateFormatRep(txtToDate.value);
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
        rp.TRId = OperationID;


        Ajax.Callsync({
            url: Url.Action("IProc_Prnt_OperationItems", "GeneralReports"),
            data: rp,
            success: (d) => {

                let result = d.result as string;


                window.open(result, "_blank");
            }
        })
    }


    function PrintReport2(OutType: number) {

        if (!SysSession.CurrentPrivileges.PrintOut) return;
        let rp: ReportParameters = new ReportParameters();
        rp.RepType = OutType;//output report as View
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
        rp.TRId = OperationID;

        Ajax.Callsync({
            url: Url.Action("IProc_Prnt_OperationCharges", "GeneralReports"),
            data: rp,
            success: (d) => {

                let result = d.result as string;

                PrintReportLogOperation(SysSession.CurrentEnvironment.UserCode, SysSession.CurrentEnvironment.CompCode, SysSession.CurrentEnvironment.BranchCode, Modules.CloseProcesses, SysSession.CurrentEnvironment.CurrentYear, "print operation costs");

                window.open(result, "_blank");
            }
        })
    }
    function btnPrintDeposit_onclick() {

        if (!SysSession.CurrentPrivileges.PrintOut) return;
        let rp: ReportParameters = new ReportParameters();
        rp.RepType = 0;//output report as View
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
        rp.TRId = OperationID;
        rp.SalesmanID = -1;
        Ajax.Callsync({
            url: Url.Action("IProc_Prnt_OperationDeposit", "GeneralReports"),
            data: rp,
            success: (d) => {

                let result = d.result as string;

                PrintTransactionLog(SysSession.CurrentEnvironment.UserCode, SysSession.CurrentEnvironment.CompCode, SysSession.CurrentEnvironment.BranchCode, Modules.CloseProcesses, SysSession.CurrentEnvironment.CurrentYear, rp.TRId.toString());

                window.open(result, "_blank");
            }
        })
    }
    function PrintReport3(OutType: number) {

        if (!SysSession.CurrentPrivileges.PrintOut) return;
        let rp: ReportParameters = new ReportParameters();
        rp.RepType = OutType;//output report as View
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
        rp.TRId = OperationID;
        rp.SalesmanID = SalesmanId_Deposit;
        Ajax.Callsync({
            url: Url.Action("IProc_Prnt_OperationSalesmanItem", "GeneralReports"),
            data: rp,
            success: (d) => {

                let result = d.result as string;
                PrintReportLogOperation(SysSession.CurrentEnvironment.UserCode, SysSession.CurrentEnvironment.CompCode, SysSession.CurrentEnvironment.BranchCode, Modules.CloseProcesses, SysSession.CurrentEnvironment.CurrentYear, "Distributor stock printing");
                window.open(result, "_blank");
            }
        })
    }

    function PrintReport4(OutType: number) {

        let rp: ReportParameters = new ReportParameters();
        rp.RepType = OutType;//output report as View
        rp.CompCode = SysSession.CurrentEnvironment.CompCode;
        rp.BranchCode = SysSession.CurrentEnvironment.BranchCode;
        rp.CompNameA = SysSession.CurrentEnvironment.CompanyNameAr;
        rp.CompNameE = SysSession.CurrentEnvironment.CompanyName;
        rp.UserCode = SysSession.CurrentEnvironment.UserCode;
        rp.Tokenid = SysSession.CurrentEnvironment.Token;
        rp.ScreenLanguage = SysSession.CurrentEnvironment.ScreenLanguage;
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
        rp.TRId = OperationID;
        rp.SalesmanID = SalesmanId_Deposit;

        Ajax.CallAsync({
            url: Url.Action("IProc_Prnt_OperationDeposit", "GeneralReports"),
            data: rp,
            success: (d) => {
                let result = d.result as string;
                PrintReportLogOperation(SysSession.CurrentEnvironment.UserCode, SysSession.CurrentEnvironment.CompCode, SysSession.CurrentEnvironment.BranchCode, Modules.CloseProcesses, SysSession.CurrentEnvironment.CurrentYear, "Distributor's Deposit Printing");

                window.open(result, "_blank");
            }
        })

    }
    function btnPrintStock_onclick() {


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
        var BranchNameA = SysSession.CurrentEnvironment.BranchName;
        var BranchNameE = SysSession.CurrentEnvironment.BranchName;
        if (BranchNameA == null || BranchNameE == null) {

            BranchNameA = " ";
            BranchNameE = " ";
        }
        rp.BraNameA = BranchNameA;
        rp.BraNameE = BranchNameE;
        rp.TRId = OperationID;
        rp.SalesmanID = -1;

        Ajax.CallAsync({
            url: Url.Action("IProc_Prnt_OperationSalesmanItem", "GeneralReports"),
            data: rp,
            success: (d) => {
                let result = d.result as string;
                PrintTransactionLog(SysSession.CurrentEnvironment.UserCode, SysSession.CurrentEnvironment.CompCode, SysSession.CurrentEnvironment.BranchCode, Modules.CloseProcesses, SysSession.CurrentEnvironment.CurrentYear, rp.TRId.toString());

                window.open(result, "_blank");
            }
        })






    }


    function PrintOperationsummary() {


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
        var BranchNameA = SysSession.CurrentEnvironment.BranchName;
        var BranchNameE = SysSession.CurrentEnvironment.BranchName;
        if (BranchNameA == null || BranchNameE == null) {

            BranchNameA = " ";
            BranchNameE = " ";
        }
        rp.BraNameA = BranchNameA;
        rp.BraNameE = BranchNameE;
        rp.TRId = OperationID;

        Ajax.CallAsync({
            url: Url.Action("IProc_Rep_OperationSum", "GeneralReports"),
            data: rp,
            success: (d) => {
                let result = d.result as string;
                PrintTransactionLog(SysSession.CurrentEnvironment.UserCode, SysSession.CurrentEnvironment.CompCode, SysSession.CurrentEnvironment.BranchCode, Modules.CloseProcesses, SysSession.CurrentEnvironment.CurrentYear, rp.TRId.toString());

                window.open(result, "_blank");
            }
        })

    }


    function Printsalesrecord() {
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
        var BranchNameA = SysSession.CurrentEnvironment.BranchName;
        var BranchNameE = SysSession.CurrentEnvironment.BranchName;
        if (BranchNameA == null || BranchNameE == null) {

            BranchNameA = " ";
            BranchNameE = " ";
        }
        rp.BraNameA = BranchNameA;
        rp.BraNameE = BranchNameE;
        rp.TRId = OperationID;

        Ajax.CallAsync({
            url: Url.Action("IProc_Rep_salesrecord", "GeneralReports"),
            data: rp,
            success: (d) => {
                let result = d.result as string;
                PrintTransactionLog(SysSession.CurrentEnvironment.UserCode, SysSession.CurrentEnvironment.CompCode, SysSession.CurrentEnvironment.BranchCode, Modules.CloseProcesses, SysSession.CurrentEnvironment.CurrentYear, rp.TRId.toString());

                window.open(result, "_blank");
            }
        })
    };

    function DisplayItemsData(OperationItemID: number, OperationID: number, cnt: number, name: string) {
        debugger
        nameGlopl = name;
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("Processes", "GetAllOperationItemsSum"),
            data: { OperationItemId: OperationItemID, OperationId: OperationID, CompCode: compcode, BranchCode: BranchCode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                debugger
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    TR_OperationItemsSum = result.Response as Array<I_TR_OperationItemsSum>;

                    $("#DivShowItemsData").removeClass("display_none");

                    if (Selected_Data[0].Status != 3) { //مغلق
                        $("#btnBack_2").addClass("display_none");
                        $("#btnSave_2").addClass("display_none");
                        $("#btnUpdate_2").removeClass("display_none");
                    }
                    else {
                        $("#btnBack_2").addClass("display_none");
                        $("#btnSave_2").addClass("display_none");
                        $("#btnUpdate_2").addClass("display_none");
                    }

                    $("#div_ItemsData").html('');
                    CountGridItemsData = 0;

                    for (var i = 0; i < TR_OperationItemsSum.length; i++) {

                        BuildControlsItemsData(i, cnt);
                        Disbly_BuildControlsItemsData(i, TR_OperationItemsSum);
                        CountGridItemsData += 1;
                    }

                    $("#nameitem").text(nameGlopl);

                }
            }
        });
    }
    function InitializeGridItemsData() {
        //$("#divMasterGrid").attr("style", "");
        let res: any = GetResourceList("");
        divgridItemData.ElementName = "divgridItemData";
        divgridItemData.Paging = true;
        divgridItemData.PageSize = 10;
        divgridItemData.Sorting = true;
        divgridItemData.InsertionMode = JsGridInsertionMode.Binding;
        divgridItemData.Editing = true;
        divgridItemData.Inserting = false;

        divgridItemData.PrimaryKey = "OperationItemSumID";
        divgridItemData.Columns = [
            { title: "ID", name: "OperationItemSumID", type: "text", width: "2%", visible: false },
            { title: "ID", name: "OperationItemID", type: "text", width: "2%", visible: false },
            { title: "ID", name: "OperationID", type: "text", width: "2%", visible: false },
            { title: "ID", name: "ItemID", type: "text", width: "2%", visible: false },

            {
                title: "الكمية المباعة", name: "SoldQty", type: "text", width: "10%", css: "SoldQty",
                itemTemplate: (s: string, item: I_TR_OperationItemsSum): HTMLInputElement => {
                    let txt: HTMLInputElement = document.createElement("input");
                    txt.type = "input";
                    txt.id = "SoldQty" + item.OperationItemSumID;
                    txt.name = "SoldQty";
                    if (btnUpdate_2.getAttribute('class') == 'btn btn-primary display_none' && btnBack_2.getAttribute('class') != "btn btn-warning display_none") {
                        txt.disabled = false;
                    }
                    else {

                        txt.disabled = true;
                    }
                    txt.className = "form-control input-sm ScrapQty UnitPrice";
                    txt.onkeyup = (e) => {
                        check_OnhandQty(item.OperationItemSumID);
                    };
                    txt.value = item.SoldQty.toString();
                    txt.setAttribute('valScrapQty', item.SoldQty.toString());
                    return txt;
                }
            },

            {
                title: "سعر البيع", name: "UnitPrice", type: "text", width: "10%", css: "UnitPrice",
                itemTemplate: (s: string, item: I_TR_OperationItemsSum): HTMLInputElement => {
                    let txt: HTMLInputElement = document.createElement("input");
                    txt.type = "input";
                    txt.id = "UnitPrice" + item.OperationItemSumID;
                    txt.name = "UnitPrice";
                    txt.disabled = true;
                    txt.className = "form-control input-sm UnitPrice";
                    txt.value = item.UnitPrice.toString();
                    txt.setAttribute('val', item.UnitPrice.toString());
                    return txt;
                }
            },

            { title: "الإجمالي", name: "Total", type: "text", width: "14%" },

        ];

    }

    function BuildControlsItemsData(cnt: number, cntch: number) {
        var html;
        html = `<tr id="No_RowItemSumID${cnt}">
	                <td>
		                <div class="form-group">
			                <span id="btn_minusclous${cnt}"><i class="fas fa-minus-circle  btn-minus"></i></span>
		                </div>
	                </td>
                     <td>
		                <div class="form-group">
			                <input id="txt_SoldQty${cnt}" type="number"  disabled class="form-control"   value="0"/>
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
			               	<input id="txt_UnitPrice${cnt}" type="number" disabled  class="form-control"   value="0"/>
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
			               	<input id="txt_Total${cnt}" type="number" disabled class="form-control"   value="0"/>
		                </div>
	                </td>
                     <td>
		                <div class="form-group">
			               	<input id="txt_Remark${cnt}" type="text" disabled class="form-control"/>
		                </div>
	                </td>
                    
                    <input id="txt_StatusFlagItemsData${cnt}" name = " " type = "hidden" class="form-control"/>
                    <input id="txtOperationItemSumID${cnt}" name = " " type = "hidden" class="form-control"/>
                    <input id="txtOperationItemID${cnt}" name = " " type = "hidden" class="form-control"/>
                    <input id="txtOperationID${cnt}" name = " " type = "hidden" class="form-control"/>
                    <input id="txtItemID${cnt}" name = " " type = "hidden" class="form-control"/>
                    <input id="txt_ID${cnt}" name = " " type = "hidden" class="form-control" />
                </tr>`;
        //html = '<div id= "No_RowItemSumID' + cnt + '" class="container-fluid style_border" > <div class=""> <div class="col-lg-12" > ' +
        //    '<span id="btn_minusclous' + cnt + '" class="fa fa-minus-circle fontitm6Processes display_none"></span>' +
        //    '<div class="col-lg-2" style=""><input id="txt_SoldQty' + cnt + '" type="number"  disabled class="form-control right2"   value="0"/></div>' +
        //    '<div class="col-lg-2" style=""><input id="txt_UnitPrice' + cnt + '" type="number" disabled  class="form-control right2"   value="0"/></div>' +
        //    '<div class="col-lg-2" style=""><input id="txt_Total' + cnt + '" type="number" disabled class="form-control right2"   value="0"/></div>' +
        //    '<div class="col-lg-4" style=""><input id="txt_Remark' + cnt + '" type="text" disabled class="form-control right2"/></div>' +
        //    '<input id="txt_StatusFlagItemsData' + cnt + '" name = " " type = "hidden" class="form-control"/>' +
        //    '<input id="txtOperationItemSumID' + cnt + '" name = " " type = "hidden" class="form-control"/>' +
        //    '<input id="txtOperationItemID' + cnt + '" name = " " type = "hidden" class="form-control"/>' +
        //    '<input id="txtOperationID' + cnt + '" name = " " type = "hidden" class="form-control"/>' +
        //    '<input id="txtItemID' + cnt + '" name = " " type = "hidden" class="form-control"/>' +


        //    ' <input id="txt_ID' + cnt + '" name = " " type = "hidden" class="form-control" />' +
        //    '</div></div>';

        $("#div_ItemsData").append(html);

        $("#btn_minusclous" + cnt).on('click', function () {
            debugger
            DeleteRowItemsData(cnt, cntch);


        });

        $("#btnRecalculation").on('click', function () {

            ComputeTotals();
            Calculation_Close();

        });


        $("#txt_SoldQty" + cnt).keyup(function () {

            if ($("#txt_StatusFlagItemsData" + cnt).val() != "i")
                $("#txt_StatusFlagItemsData" + cnt).val("u");

            debugger
            $('#txtClose_SoldQty' + cntch).val("0");

            debugger
            var nwetotal = 0;
            var totalnet = 0;
            for (var i = 0; i < CountGridItemsData; i++) {
                var total = Number($("#txt_SoldQty" + i).val());
                var UnitPrice = Number($("#txt_UnitPrice" + i).val());
                $("#txt_Total" + i).val(total * UnitPrice);
                nwetotal += total;
                var net = Number($("#txt_Total" + i).val());
                totalnet += net;


            }
            $('#txtClose_SoldQty' + cntch).val(nwetotal);
            $("#txtClose_TotalSales" + cntch).val(totalnet);


            $("#textClose_AdjTotalSales").val(totalnet);

            ComputeTotals();
            Calculation_Close();
        });


        $("#txt_UnitPrice" + cnt).keyup(function () {
            var totalnet = 0;
            for (var i = 0; i < CountGridItemsData; i++) {
                var total = Number($("#txt_SoldQty" + i).val());
                var UnitPrice = Number($("#txt_UnitPrice" + i).val());
                $("#txt_Total" + i).val(total * UnitPrice);

                var net = Number($("#txt_Total" + i).val());
                totalnet += net;
            }
            $("#txtClose_TotalSales" + cntch).val(totalnet);


            if ($("#txt_StatusFlagItemsData" + cnt).val() != "i")
                $("#txt_StatusFlagItemsData" + cnt).val("u");

            ComputeTotals();
            Calculation_Close();

        });


        $("#txt_Remark" + cnt).on('change', function () {
            debugger
            if ($("#txt_StatusFlagItemsData" + cnt).val() != "i")
                $("#txt_StatusFlagItemsData" + cnt).val("u");

            Calculation_Close();

        });
        if (SysSession.CurrentPrivileges.Remove) {
            $("#btn_minusclous" + cnt).addClass("display_none");
            $("#btn_minusclous" + cnt).attr("disabled", "disabled");
        }
        else {
            $("#btn_minusclous" + cnt).addClass("display_none");
            $("#btn_minusclous" + cnt).attr("disabled", "disabled");
        }

        return;

    }

    function DeleteRowItemsData(RecNo: number, cntch: number) {
        if (!SysSession.CurrentPrivileges.Remove) return;
        WorningMessage("هل تريد الحذف؟", "Do you want to delete?", "تحذير", "worning", () => {


            $("#txt_StatusFlagItemsData" + RecNo).val() == 'i' ? $("#txt_StatusFlagItemsData" + RecNo).val('m') : $("#txt_StatusFlagItemsData" + RecNo).val('d');
            $("#txt_SoldQty" + RecNo).val("0");
            $("#txt_UnitPrice" + RecNo).val("0");
            $("#No_RowItemSumID" + RecNo).attr("hidden", "true");


            $('#txtClose_SoldQty' + cntch).val("0");

            debugger
            var nwetotal = 0;
            var totalnet = 0;
            for (var i = 0; i < CountGridItemsData; i++) {
                var total = Number($("#txt_SoldQty" + i).val());
                var UnitPrice = Number($("#txt_UnitPrice" + i).val());
                $("#txt_Total" + i).val(total * UnitPrice);
                nwetotal += total;
                var net = Number($("#txt_Total" + i).val());
                totalnet += net;


            }
            $('#txtClose_SoldQty' + cntch).val(nwetotal);
            $("#txtClose_TotalSales" + cntch).val(totalnet);


            $("#textClose_AdjTotalSales").val(totalnet);

            ComputeTotals();
            Calculation_Close();

        });
    }
    function ComputeTotalsItemsData() {

        let total = 0;
        for (var i = 0; i <= CountGrid; i++) {
            if ($("#txt_StatusFlagItemsData" + i).val() != 'm' && $("#txt_StatusFlagItemsData" + i).val() != 'd') {
                total += Number($("#txtTotal" + i).val());
            }
        }
        //txtTotal.value = total.RoundToSt(2).toString();
    }
    function Disbly_BuildControlsItemsData(cnt: number, OperationItemSumInfo: Array<I_TR_OperationItemsSum>) {
        // 
        $("#btnAddDetailsItemsData").addClass("display_none");
        $("#btn_minusclous" + cnt).addClass("display_none");
        $("#txt_StatusFlagItemsData" + cnt).val("");

        $("#txt_SoldQty" + cnt).prop("value", ((OperationItemSumInfo[cnt].SoldQty == null || undefined) ? 0 : OperationItemSumInfo[cnt].SoldQty));
        $("#txt_UnitPrice" + cnt).prop("value", ((OperationItemSumInfo[cnt].UnitPrice == null || undefined) ? 0 : OperationItemSumInfo[cnt].UnitPrice));
        $("#txt_Total" + cnt).prop("value", ((OperationItemSumInfo[cnt].Total == null || undefined) ? 0 : OperationItemSumInfo[cnt].Total));


        $("#txt_Remark" + cnt).prop("value", ((OperationItemSumInfo[cnt].Remark == null || undefined) ? 0 : OperationItemSumInfo[cnt].Remark));

        $("#txtItemID" + cnt).prop("value", ((OperationItemSumInfo[cnt].ItemID == null || undefined) ? 0 : OperationItemSumInfo[cnt].ItemID));
        $("#txtOperationID" + cnt).prop("value", ((OperationItemSumInfo[cnt].OperationID == null || undefined) ? 0 : OperationItemSumInfo[cnt].OperationID));
        $("#txtOperationItemID" + cnt).prop("value", ((OperationItemSumInfo[cnt].OperationItemID == null || undefined) ? 0 : OperationItemSumInfo[cnt].OperationItemID));
        $("#txtOperationItemSumID" + cnt).prop("value", ((OperationItemSumInfo[cnt].OperationItemSumID == null || undefined) ? 0 : OperationItemSumInfo[cnt].OperationItemSumID));

        bramterItemID = OperationItemSumInfo[cnt].ItemID;
        bramterOperationID = OperationItemSumInfo[cnt].OperationID;
        bramterOperationItemID = OperationItemSumInfo[cnt].OperationItemID;

    }
    function AddNewRowItemsData() {
        if (!SysSession.CurrentPrivileges.AddNew) return;
        var CanAddData_Grid: boolean = true;
        if (CountGridItemsData > 0) {
            for (var i = 0; i < CountGridItemsData; i++) {
                CanAddData_Grid = ValidationItemsData_Grid(i);
                if (CanAddData_Grid == false) {
                    break;
                }
            }
        }
        if (CanAddData_Grid) {
            BuildControlsItemsData(CountGridItemsData, golabelcnt);
            $("#txt_StatusFlagItemsData" + CountGridItemsData).val("i"); //In Insert mode
            $("#btn_minusclous" + CountGridItemsData).removeClass("display_none");
            $("#btn_minusclous" + CountGridItemsData).removeAttr("disabled");
            $("#txt_SoldQty" + CountGridItemsData).removeAttr("disabled");
            $("#txt_UnitPrice" + CountGridItemsData).removeAttr("disabled");
            $("#txt_Remark" + CountGridItemsData).removeAttr("disabled");

            $("#txtItemID" + CountGridItemsData).prop("value", ((bramterItemID == null || undefined) ? 0 : bramterItemID));
            $("#txtOperationID" + CountGridItemsData).prop("value", ((bramterOperationID == null || undefined) ? 0 : bramterOperationID));
            $("#txtOperationItemID" + CountGridItemsData).prop("value", ((bramterOperationItemID == null || undefined) ? 0 : bramterOperationItemID));
            CountGridItemsData += 1;
            Insert_Serial();
            ComputeTotals()
        }
    }
    function ValidationItemsData_Grid(rowcount: number) {


        return true;

    }
    function remove_disabled_ItemsData_Grid() {
        debugger
        for (var i = 0; i < CountGridItemsData + 1; i++) {
            $("#txt_SoldQty" + i).attr("disabled", "disabled");
            $("#txt_UnitPrice" + i).attr("disabled", "disabled");
            $("#txt_Remark" + i).attr("disabled", "disabled");
            $("#btn_minusclous" + i).addClass("display_none");

        }
        $("#btnAddDetailsItemsData").addClass("display_none");

    }
    function Update_2_ItemsSum() {
        // 
        console.log(OperationItemsSum);

        debugger
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("Processes", "ListOperationItemsDetailItemsSum"),
            data: JSON.stringify(OperationItemsSum),
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {



                    if (Save_Add == true) {

                        DisplayMassage("تم أضافة  بيانات الحمولة في العمليه بنجاح!", "Payload data has been added in the process successfully!", MessageType.Succeed);

                    }
                    else {
                        DisplayMassage("تم التعديل  بيانات  تفاصيل مبيعات بنجاح!", "Payload data has been modified successfully!", MessageType.Succeed);
                    }
                    flag_Success_2 = true;

                    $('#txtUpdatedBy').val(SysSession.CurrentEnvironment.UserCode);
                    $('#txtUpdatedAt').val(DateTimeFormat(Date().toString()));
                    flag_Add = false;
                    Save_Add = false;


                    $("#DivShow").attr("disabled", "disabled").off('click');
                    $("#btnAddDetailsItemsData").addClass("display_none");
                    $(".fontitm6Processes").addClass("display_none");

                    btnUpdate_2.classList.remove("display_none");
                    btnSave_2.classList.add("display_none");
                    btnBack_2.classList.add("display_none");
                    disabled_Grid_Controls();
                    flag_Success_2 = false;
                    //Display();
                    MasterGridBiuld();
                    //Processes_Open();

                    let cnt = golabelcnt;
                    DisplayItemsData(OperationItemsSum[0].OperationItemID, OperationItemsSum[0].OperationID, cnt, "");
                    $("#nameitem").text(nameGlopl);
                    flag_Success_2 = false;
                    $("#DivHederMaster").removeClass("disabledDiv");
                    $("#div_MasterGird").removeClass("disabledDiv");
                    Update_2 = false;
                }
                else {
                    DisplayMassage("خطأء!", "Error!", MessageType.Worning);

                    flag_Success_2 = false;
                    Save_Add = false;
                }
            }
        });

    }
    function Assign_2_ItemsSum() {

        debugger
        OperationItemsSum = new Array<I_TR_OperationItemsSum>();
        var StatusFlag: String;
        for (var i = 0; i <= CountGridItemsData; i++) {
            OperationItemsSumingleModel = new I_TR_OperationItemsSum();
            StatusFlag = $("#txt_StatusFlagItemsData" + i).val();
            OperationItemsSumingleModel.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
            OperationItemsSumingleModel.UserCode = SysSession.CurrentEnvironment.UserCode;


            if (StatusFlag == "i") {

                i == 0 ? Save_Add = true : Save_Add = false;

                OperationItemsSumingleModel.StatusFlag = StatusFlag.toString();
                OperationItemsSumingleModel.SoldQty = $('#txt_SoldQty' + i).val();
                OperationItemsSumingleModel.UnitPrice = $("#txt_UnitPrice" + i).val();
                OperationItemsSumingleModel.Total = $("#txt_Total" + i).val();
                OperationItemsSumingleModel.Remark = $("#txt_Remark" + i).val();
                OperationItemsSumingleModel.ItemID = $("#txtItemID" + i).val();
                OperationItemsSumingleModel.OperationID = $("#txtOperationID" + i).val();
                OperationItemsSumingleModel.OperationItemID = $("#txtOperationItemID" + i).val();
                OperationItemsSumingleModel.OperationItemSumID = 0;
                OperationItemsSum.push(OperationItemsSumingleModel);

            }
            if (StatusFlag == "u") {
                OperationItemsSumingleModel.StatusFlag = StatusFlag.toString();
                OperationItemsSumingleModel.SoldQty = $('#txt_SoldQty' + i).val();
                OperationItemsSumingleModel.UnitPrice = $("#txt_UnitPrice" + i).val();
                OperationItemsSumingleModel.Total = $("#txt_Total" + i).val();
                OperationItemsSumingleModel.Remark = $("#txt_Remark" + i).val();
                OperationItemsSumingleModel.ItemID = $("#txtItemID" + i).val();
                OperationItemsSumingleModel.OperationID = $("#txtOperationID" + i).val();
                OperationItemsSumingleModel.OperationItemID = $("#txtOperationItemID" + i).val();
                OperationItemsSumingleModel.OperationItemSumID = $("#txtOperationItemSumID" + i).val();

                OperationItemsSum.push(OperationItemsSumingleModel);
            }
            if (StatusFlag == "d") {


                OperationItemsSumingleModel.StatusFlag = StatusFlag.toString();
                OperationItemsSumingleModel.ItemID = $("#txtItemID" + i).val();
                OperationItemsSumingleModel.OperationID = $("#txtOperationID" + i).val();
                OperationItemsSumingleModel.OperationItemID = $("#txtOperationItemID" + i).val();
                OperationItemsSumingleModel.OperationItemSumID = $("#txtOperationItemSumID" + i).val();
                OperationItemsSum.push(OperationItemsSumingleModel);

            }
        }
    }

    function ComputeTotals() {

        let total = 0;
        let TotalQuantity = 0;
        let TotalSoldQty = 0;
        let TotalScrapQty = 0;
        let TotalClose_SoldQty = 0;
        let TotalClose_ScrapQty = 0;
        let TotalClose_TotalSales = 0;
        for (var i = 0; i <= CountGrid; i++) {
            if ($("#txt_StatusFlag" + i).val() != 'm' && $("#txt_StatusFlag" + i).val() != 'd') {
                TotalQuantity += Number($("#txtQuantity" + i).val());
                TotalSoldQty += Number($("#txtSoldQty" + i).val());
                TotalScrapQty += Number($("#txtScrapQty" + i).val());
                total += Number($("#txtTotal" + i).val());
                TotalClose_SoldQty += Number($("#txtClose_SoldQty" + i).val());
                TotalClose_ScrapQty += Number($("#txtClose_ScrapQty" + i).val());
                TotalClose_TotalSales += Number($("#txtClose_TotalSales" + i).val());
            }
        }
        $("#txtTotalQuantity").val(TotalQuantity.RoundToSt(2).toString());
        $("#txtTotalSoldQty").val(TotalSoldQty.RoundToSt(2).toString());
        $("#txtTotalScrapQty").val(TotalScrapQty.RoundToSt(2).toString());
        txtTotal.value = total.RoundToSt(2).toString();
        $("#txtTotalClose_SoldQty").val(TotalClose_SoldQty.RoundToSt(2).toString());
        $("#txtTotalClose_ScrapQty").val(TotalClose_ScrapQty.RoundToSt(2).toString());
        $("#txtTotalClose_TotalSales").val(TotalClose_TotalSales.RoundToSt(2).toString());
        //ComputeTotalClose_Adjustment();
        //Calculation_Close();
    }
}