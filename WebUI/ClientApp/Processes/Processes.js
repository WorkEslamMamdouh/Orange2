$(document).ready(function () {
    ////// ;
    Processes.InitalizeComponent();
});
var Processes;
(function (Processes) {
    //system varables
    var AccType = 3; //نوع الحساب
    var SysSession = GetSystemSession(Modules.Processes);
    var compcode;
    var BranchCode; //SharedSession.CurrentEnvironment.BranchCode;
    var sys = new SystemTools();
    var Finyear;
    //Arrays    //Models 
    var SalesmanItem = new Array();
    var Get_IQ_OperationSalesman = new Array();
    //var Get_IQ_OperationSalesman: Array<I_TR_OperationSalesman> = new Array<I_TR_OperationSalesman>();
    var Get_IQ_GetOperation = new Array();
    var Selected_Data = new Array();
    var VendorDetails = new Array();
    var GetAllVendorDetails = new Array();
    var SellerDetails = new Array();
    var NationalityDetails = new Array();
    var Cashbox_DescA = new Array();
    var CashboxDetails = new Array();
    var StateDetailsAr = new Array();
    var StateDetailsEn = new Array();
    var SearchDetails = new Array();
    var SearchDetails_Salesman = new Array();
    var VatTypeDetails = new Array();
    var OperationDeposit;
    var DepositDetailsModel = new Array();
    var DepositsingleModel = new I_TR_OperationDeposit();
    var chargesDetailsModel = new Array();
    var chargesingleModel = new I_TR_OperationCharges();
    var AllGetOperationMasterDetailModel = new AllGetOperationMasterDisplay();
    var Model_I_TR_Operation = new I_TR_Operation();
    var ItemFamilyDetails = new Array();
    var OperationItemModel = new Array();
    var OperationItemSingleModel = new I_TR_OperationItems();
    var FamilyDetails = new Array();
    var ItemBaesdFamilyDetails = new Array();
    var VatTypeData = new Array();
    var AddonsData = new Array();
    var Details_Acount = new Array();
    //DropDownlist
    var ddlStateType;
    var ddlSalesman;
    var ddlSalesmanMaster;
    var ddlVendor;
    var ddlVendorMaster;
    var id_divGridDetails;
    // giedView
    var divMasterGrid = new JsGrid();
    var OerSalesmanGrid_Master = new JsGrid();
    var OerSalesmanGrid_Detail = new JsGrid();
    //Textboxes
    var txtFromDate;
    var txtToDate;
    var txtdateopening;
    var txtDateHeader;
    var txtNationality;
    var txt_tax;
    var ddlTrtype;
    //buttons 
    var btnclosingprocessing;
    var btnPresent;
    var btnfinish;
    var btnClose;
    var btnClose_Focus;
    var btnView_load;
    var btnExpenses;
    var btnOpen;
    var btnShow;
    var btnAdd;
    var btnUpdate_1;
    var btnSave_1;
    var btnBack_1;
    var btnUpdate_2;
    var btnSave_2;
    var btnBack_2;
    var btnUpdate_3;
    var btnSave_3;
    var btnBack_3;
    var btnUpdate_4;
    var btnSave_4;
    var btnBack_4;
    var btnUpdate_5;
    var btnSave_5;
    var btnBack_5;
    //new
    var txtTotal;
    var txtTotalValueCharge;
    var txtTotalVatCharge;
    var txtTotalAfterVatCharge;
    var txtClose_Adjustment;
    var txtClose_SalesManCommition;
    var txtClose_CompanyCommitionPrc;
    var txtTruckNumber;
    var txtPaperPurchaseValue;
    var txtClose_CompanyCommition;
    var txtClose_Marketting;
    var textClose_Coolingandstorage;
    var txtVatPrc;
    var txtVatAmount;
    var txtCustomNo;
    var txtPolice_num;
    var txtPortName;
    var btnAddDetails;
    var btnAddDetailsCharge;
    var btnAddDetailslebel;
    var searchbutmemreport;
    var searchOerSalesmanGrid_Master;
    //flags 
    var CountGrid = -1;
    var CountGridCharge = 0;
    var CountGridDeposit = 0;
    var CountItems = 0;
    var CountItemsCharge = 0;
    var OperationID;
    var OperationIDglopel;
    var VatPrc;
    var FlagIns_Operation;
    var flag_Back = false;
    var flag_Success_2 = false;
    var flag_Success_3 = false;
    var flag_Success_5 = false;
    var Status;
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
    var SalesmanId_Deposit = 0;
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);
    var SalesmanItem_Data = new Array();
    var SalesmanItem_Assign = new Array();
    var ListOp_Deposit_SalItem = new ListOperationDepositDetail();
    //------------------------------------report print ------------------------------
    var btnPrintTrview;
    var btnPrintTrPDF;
    var btnPrintTrEXEL;
    //    var btnPrint: HTMLButtonElement;
    //------------------------------------report print 1------------------------------
    var btnPrintTrview1;
    var btnPrintTrPDF1;
    var btnPrintTrEXEL1;
    var btnPrint1;
    //------------------------------------report print 2------------------------------
    var btnPrintTrview2;
    var btnPrintTrPDF2;
    var btnPrintTrEXEL2;
    var btnPrint2;
    //------------------------------------report print 3------------------------------
    var btnPrintTrview3;
    var btnPrintTrPDF3;
    var btnPrintTrEXEL3;
    var btnPrint3;
    //------------------------------------report print4------------------------------
    var btnPrintTrview4;
    var btnPrintTrPDF4;
    var btnPrintTrEXEL4;
    var btnPrint4;
    // button print 
    var btnPrintStock;
    var btnPrintDeposit;
    // button print   Operationsummary and sales History
    var btnPrintOperationsummary;
    var btnPrintsalesrecord;
    function InitalizeComponent() {
        $("#NoDubleclick").val('1');
        $("#div_Master").attr("disabled", "disabled").off('click');
        $("#div_Master").addClass("disabledDiv");
        //$("#DivShow").attr("disabled", "disabled").off('click');
        //$("#DivShow").addClass("disabledDiv");
        $("#data_lebel").attr("disabled", "disabled").off('click');
        $("#data_lebel").addClass("disabledDiv");
        $("#open_Trill").attr("disabled", "disabled").off('click');
        $("#open_Trill").addClass("disabledDiv");
        $("#divProcessClose").attr("disabled", "disabled").off('click');
        $("#divProcessClose").addClass("disabledDiv");
        Finyear = Number(SysSession.CurrentEnvironment.CurrentYear);
        // 
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
        //   $('#btnPrint').addClass('display_none');
        $('#btnPrint1').addClass('display_none');
        $('#btnPrint2').addClass('display_none');
        $('#btnPrint3').addClass('display_none');
        $('#btnPrint4').addClass('display_none');
        debugger;
        if (SysSession.CurrentPrivileges.CUSTOM5 == false) {
            $('#DivInformationCloce').addClass('display_none');
        }
    }
    Processes.InitalizeComponent = InitalizeComponent;
    function InitalizeControls() {
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);
        //Drop Downlists
        ddlStateType = document.getElementById("ddlStateType");
        ddlSalesman = document.getElementById("ddlSalesman");
        ddlSalesmanMaster = document.getElementById("ddlSalesmanMaster");
        ddlVendor = document.getElementById("ddlVendor");
        ddlVendorMaster = document.getElementById("ddlVendorMaster");
        txtNationality = document.getElementById("txtNationality");
        txt_tax = document.getElementById("txt_tax");
        ddlTrtype = document.getElementById("ddlTrtype");
        id_divGridDetails = document.getElementById("divMasterGridiv");
        //textboxes
        txtFromDate = document.getElementById("txtFromDate");
        txtToDate = document.getElementById("txtToDate");
        txtdateopening = document.getElementById("txtdateopening");
        txtTotal = document.getElementById("txtTotal");
        txtTotalValueCharge = document.getElementById("txtTotalValueCharge");
        txtTotalVatCharge = document.getElementById("txtTotalVatCharge");
        txtTotalAfterVatCharge = document.getElementById("txtTotalAfterVatCharge");
        txtClose_Adjustment = document.getElementById("txtClose_Adjustment");
        txtClose_SalesManCommition = document.getElementById("txtClose_SalesManCommition");
        txtClose_CompanyCommitionPrc = document.getElementById("txtClose_CompanyCommitionPrc");
        searchbutmemreport = document.getElementById("searchbutmemreport");
        searchOerSalesmanGrid_Master = document.getElementById("searchOerSalesmanGrid_Master");
        txtClose_CompanyCommition = document.getElementById("txtClose_CompanyCommition");
        txtClose_Marketting = document.getElementById("txtClose_Marketting");
        textClose_Coolingandstorage = document.getElementById("textClose_Coolingandstorage");
        txtVatPrc = document.getElementById("txtVatPrc");
        txtVatAmount = document.getElementById("txtVatAmount");
        txtTruckNumber = document.getElementById("txtTruckNumber");
        txtPaperPurchaseValue = document.getElementById("txtPaperPurchaseValue");
        txtCustomNo = document.getElementById("txtCustomNo");
        txtPolice_num = document.getElementById("txtPolice_num");
        txtPortName = document.getElementById("txtPortName");
        txtDateHeader = document.getElementById("txtDate");
        //buttons
        btnPresent = document.getElementById("btnPresent");
        btnClose = document.getElementById("btnClose");
        btnfinish = document.getElementById("btnfinish");
        btnClose_Focus = document.getElementById("btnClose_Focus");
        btnView_load = document.getElementById("btnView_load");
        btnExpenses = document.getElementById("btnExpenses");
        btnOpen = document.getElementById("btnOpen");
        // btnclosingprocessing = document.getElementById("btnclosingprocessing") as HTMLButtonElement;
        btnShow = document.getElementById("btnShow");
        btnAdd = document.getElementById("btnAdd");
        btnUpdate_1 = document.getElementById("btnUpdate_1");
        btnBack_1 = document.getElementById("btnBack_1");
        btnSave_1 = document.getElementById("btnSave_1");
        btnUpdate_2 = document.getElementById("btnUpdate_2");
        btnBack_2 = document.getElementById("btnBack_2");
        btnSave_2 = document.getElementById("btnSave_2");
        btnUpdate_3 = document.getElementById("btnUpdate_3");
        btnBack_3 = document.getElementById("btnBack_3");
        btnSave_3 = document.getElementById("btnSave_3");
        btnUpdate_4 = document.getElementById("btnUpdate_4");
        btnBack_4 = document.getElementById("btnBack_4");
        btnSave_4 = document.getElementById("btnSave_4");
        btnUpdate_5 = document.getElementById("btnUpdate_5");
        btnBack_5 = document.getElementById("btnBack_5");
        btnSave_5 = document.getElementById("btnSave_5");
        btnAddDetails = document.getElementById("btnAddDetails");
        btnAddDetailsCharge = document.getElementById("btnAddDetailsCharge");
        btnAddDetailslebel = document.getElementById("btnAddDetailslebel");
        //--------------------------- print Button  
        //   btnPrint = document.getElementById("btnPrint") as HTMLButtonElement;
        btnPrintTrview = document.getElementById("btnPrintTrview");
        btnPrintTrPDF = document.getElementById("btnPrintTrPDF");
        btnPrintTrEXEL = document.getElementById("btnPrintTrEXEL");
        //--------------------------- print Button1  
        btnPrint1 = document.getElementById("btnPrint1");
        btnPrintTrview1 = document.getElementById("btnPrintTrview1");
        btnPrintTrPDF1 = document.getElementById("btnPrintTrPDF1");
        btnPrintTrEXEL1 = document.getElementById("btnPrintTrEXEL1");
        //--------------------------- print Button2  
        btnPrint2 = document.getElementById("btnPrint2");
        btnPrintTrview2 = document.getElementById("btnPrintTrview2");
        btnPrintTrPDF2 = document.getElementById("btnPrintTrPDF2");
        btnPrintTrEXEL2 = document.getElementById("btnPrintTrEXEL2");
        //--------------------------- print Button3  
        btnPrint3 = document.getElementById("btnPrint3");
        btnPrintTrview3 = document.getElementById("btnPrintTrview3");
        btnPrintTrPDF3 = document.getElementById("btnPrintTrPDF3");
        btnPrintTrEXEL3 = document.getElementById("btnPrintTrEXEL3");
        //--------------------------- print Button4  
        btnPrint4 = document.getElementById("btnPrint4");
        btnPrintTrview4 = document.getElementById("btnPrintTrview4");
        btnPrintTrPDF4 = document.getElementById("btnPrintTrPDF4");
        btnPrintTrEXEL4 = document.getElementById("btnPrintTrEXEL4");
        btnPrintStock = document.getElementById("btnPrintStock");
        btnPrintDeposit = document.getElementById("btnPrintDeposit");
        //---------------------
        // button print   Operationsummary and sales History
        btnPrintOperationsummary = document.getElementById("btnPrintOperationsummary");
        btnPrintsalesrecord = document.getElementById("btnPrintsalesrecord");
        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = "ادارة الارساليات";
        }
        else {
            document.getElementById('Screen_name').innerHTML = "Processes";
        }
    }
    function IntializeEvents() {
        btnAddDetailsCharge.onclick = AddNewRowCharge;
        btnAddDetailslebel.onclick = AddNewRowlebel;
        btnAddDetails.onclick = AddNewRow;
        btnShow.onclick = btnShow_onclick;
        btnAdd.onclick = btnAdd_onclick;
        btnPresent.onclick = btnPresent_onclick;
        btnClose.onclick = btnClose_onclick;
        btnfinish.onclick = btnfinish_onclick;
        btnClose_Focus.onclick = btnClose_Focus_onclick;
        btnView_load.onclick = btnView_load_onclick;
        btnExpenses.onclick = btnExpenses_onclick;
        btnOpen.onclick = btnOpen_onclick;
        //btnclosingprocessing.onclick = btnclosingprocessingonclick;
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
        txtClose_Adjustment.onkeyup = Calculation_Close;
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
        btnPrintTrview.onclick = function () { PrintReport(1); };
        btnPrintTrPDF.onclick = function () { PrintReport(2); };
        btnPrintTrEXEL.onclick = function () { PrintReport(3); };
        // btnPrint.onclick = () => { PrintReport(4); }
        //--------------------------- print Button1  
        btnPrintTrview1.onclick = function () { PrintReport1(1); };
        btnPrintTrPDF1.onclick = function () { PrintReport1(2); };
        btnPrintTrEXEL1.onclick = function () { PrintReport1(3); };
        btnPrint1.onclick = function () { PrintReport1(4); };
        //--------------------------- print Button2  
        btnPrintTrview2.onclick = function () { PrintReport2(1); };
        btnPrintTrPDF2.onclick = function () { PrintReport2(2); };
        btnPrintTrEXEL2.onclick = function () { PrintReport2(3); };
        btnPrint2.onclick = function () { PrintReport2(4); };
        //--------------------------- print Button1  
        btnPrintTrview3.onclick = function () { PrintReport3(1); };
        btnPrintTrPDF3.onclick = function () { PrintReport3(2); };
        btnPrintTrEXEL3.onclick = function () { PrintReport3(3); };
        btnPrint3.onclick = function () { PrintReport3(4); };
        //--------------------------- print Button1  
        btnPrintTrview4.onclick = function () { PrintReport4(1); };
        btnPrintTrPDF4.onclick = function () { PrintReport4(2); };
        btnPrintTrEXEL4.onclick = function () { PrintReport4(3); };
        btnPrint4.onclick = function () { PrintReport4(4); };
        btnPrintDeposit.onclick = btnPrintDeposit_onclick;
        btnPrintStock.onclick = btnPrintStock_onclick;
        btnPrintOperationsummary.onclick = PrintOperationsummary;
        btnPrintsalesrecord.onclick = Printsalesrecord;
        //$("#DivFilter #DivHederMaster").click(divGridDetails_onclick );
    }
    function Check_on_user_type() {
        if (SysSession.CurrentEnvironment.UserType == 1 || SysSession.CurrentEnvironment.UserType == 3) { //Salesman
            var SalesId_1 = SysSession.CurrentEnvironment.SalesManID;
            SellerDetails = SellerDetails.filter(function (s) { return s.SalesmanId == SalesId_1; });
        }
        else if (SysSession.CurrentEnvironment.UserType == 2) { //CashBox
        }
    }
    function fillddlVatType() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GenVatType", "GetAll"),
            data: {
                CompCode: compcode, VatType: 2, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    VatTypeDetails = result.Response;
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
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    VendorDetails = result.Response;
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
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    GetAllVendorDetails = result.Response;
                }
            }
        });
    }
    function FillddlSalesmanMaster() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefSalesMen", "GetAllOperationPeople"),
            data: { CompCode: compcode, BranchCode: BranchCode, ISOperationEnable: true, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    SellerDetails = result.Response;
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
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    NationalityDetails = result.Response;
                    DocumentActions.FillCombowithdefult(NationalityDetails, txtNationality, "NationalityID", (lang == "ar" ? "DescA" : "DescL"), (lang == "ar" ? "اختر  الدولة" : "Select Seller"));
                }
            }
        });
    }
    function FillddlCashBox() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefBox", "GetAll"),
            data: { compCode: compcode, BranchCode: BranchCode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token, ModuleCode: Modules.Processes, FinYear: SysSession.CurrentEnvironment.CurrentYear },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    CashboxDetails = result.Response;
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
            success: function (d) {
                //////// ;
                var result = d;
                if (result.IsSuccess) {
                    FamilyDetails = result.Response;
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
            success: function (d) {
                ////////// ;
                var result = d;
                if (result.IsSuccess) {
                    ItemFamilyDetails = result.Response;
                }
            }
        });
    }
    function FillddlItems(ItemFamilyID) {
        ItemBaesdFamilyDetails = ItemFamilyDetails.filter(function (x) { return x.ItemFamilyID == ItemFamilyID; });
    }
    function FillddlAddonsType(cnt) {
        StateDetailsAr = ["خصم", "اضافة"];
        StateDetailsEn = ["Discount", "addition"];
        if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
            for (var i = 0; i < StateDetailsEn.length; i++) {
                $("#txtAddonsTypeCharge" + cnt).append(new Option(StateDetailsEn[i], i.toString()));
            }
        }
        else {
            for (var i = 0; i < StateDetailsAr.length; i++) {
                $("#txtAddonsTypeCharge" + cnt).append(new Option(StateDetailsAr[i], i.toString()));
            }
        }
    }
    function FillddlIsCashType(cnt) {
        StateDetailsAr = ["علي الحساب", "نقدى"];
        StateDetailsEn = ["Postpaid", "Cash"];
        if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
            for (var i = 0; i < StateDetailsEn.length; i++) {
                $("#txtVendorIsCheckCharge" + cnt).append(new Option(StateDetailsEn[i], i.toString()));
            }
        }
        else {
            for (var i = 0; i < StateDetailsAr.length; i++) {
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
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    //// 
                    Details_Acount = result.Response;
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
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    VatTypeData = result.Response;
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
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    AddonsData = result.Response;
                }
            }
        });
    }
    function ddlVendor_onchange() {
        var tax = $('option:selected', $("#ddlVendor")).attr('data_vattype');
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
        if (ddlVendorMaster.value != "null") {
            vendorId = Number(ddlVendorMaster.value.toString());
        }
        if (ddlSalesmanMaster.value != "null") {
            salesmanId = Number(ddlSalesmanMaster.value.toString());
        }
        status = Number(ddlStateType.value.toString());
        var trtype = Number($('#ddlTrtypeFilter').val());
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("Processes", "GetAll_IQ_GetOperation"),
            data: { CompCode: compcode, BranchCode: BranchCode, startDate: startdt, endDate: enddt, trtype: trtype, Status: status, VendorId: vendorId, SalesmanId: salesmanId, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    Get_IQ_GetOperation = result.Response;
                    Get_IQ_GetOperation = Get_IQ_GetOperation.sort(dynamicSortNew("TrNo"));
                    InitializeGrid();
                    divMasterGrid.DataSource = Get_IQ_GetOperation;
                    divMasterGrid.Bind();
                }
            }
        });
    }
    function _SearchBox_Change() {
        if (searchbutmemreport.value != "") {
            $("#divMasterGrid").jsGrid("option", "pageIndex", 1);
            var search_1 = searchbutmemreport.value.toLowerCase();
            SearchDetails = Get_IQ_GetOperation.filter(function (x) { return x.TrNo.toString().search(search_1) >= 0 || x.TruckNo.toLowerCase().search(search_1) >= 0 || x.nvd_DescA.toLowerCase().search(search_1) >= 0 || x.PortName.toLowerCase().search(search_1) >= 0; });
            divMasterGrid.DataSource = SearchDetails;
            divMasterGrid.Bind();
        }
        else {
            divMasterGrid.DataSource = Get_IQ_GetOperation;
            divMasterGrid.Bind();
        }
    }
    function InitializeGrid() {
        //$("#divMasterGrid").attr("style", "");
        var res = GetResourceList("");
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
                itemTemplate: function (s, item) {
                    var txt = document.createElement("label");
                    if (item.Trtype == 0) {
                        txt.innerHTML = "عموله";
                    }
                    else {
                        txt.innerHTML = "مشتراه";
                    }
                    return txt;
                }
            },
            { title: res.App_Salesman, name: (lang == "ar" ? "Sls_NameA" : "Sls_NameE"), type: "text", width: "16%" },
            {
                title: res.App_date, css: "ColumPadding", name: "TrDate", width: "13%",
                itemTemplate: function (s, item) {
                    var txt = document.createElement("label");
                    txt.innerHTML = DateFormat(item.TrDate);
                    return txt;
                }
            },
            {
                title: res.App_date, css: "ColumPadding", name: "ClearanceDate", width: "13%",
                itemTemplate: function (s, item) {
                    var txt = document.createElement("label");
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
        Selected_Data = new Array();
        Selected_Data = Get_IQ_GetOperation.filter(function (x) { return x.OperationID == Number(divMasterGrid.SelectedKey); });
        $("#div_Master_Hedr").removeClass("display_none");
        $("#txtVoucherNo").val("");
        DisplayData(Selected_Data);
        if (Selected_Data[0].Status == 0) { // تحت التجهيز
            Processes_under_preparing();
        }
        else if (Selected_Data[0].Status == 1) { //جاهز
        }
        else if (Selected_Data[0].Status == 2) { //مفتوحة
            Processes_Open();
        }
        else if (Selected_Data[0].Status == 3) { //مغلق
            Processes_Close();
            if (ddlTrtype.value == '1') {
                $('#btnClose').attr('disabled', 'disabled');
                $("#btnClose").attr("disabled", "disabled");
                //$("#btnClose").attr("style", "")
                $("#btnClose").removeClass("btn-red");
                $("#btnPresent").attr("disabled", "disabled");
                $("#btnPresent").removeClass("btn-green");
                //$("#btnPresent").attr("style", "")
            }
            else {
                $("#btnOpen").attr("disabled", "disabled");
                $("#btnOpen").removeClass("btn-dark-green");
                $("#btnClose").attr("disabled", "disabled");
                $("#btnClose").attr("style", "");
                $("#btnPresent").attr("disabled", "disabled");
                $("#btnPresent").attr("style", "");
            }
        }
        else if (Selected_Data[0].Status == 4) { //تحت الاغلاق
            Processes_Close();
            $('#btnClose').attr('disabled', 'disabled');
            $("#btnClose").attr("disabled", "disabled");
            //$("#btnClose").attr("style", "")
            $("#btnClose").removeClass("btn-red");
            $("#btnPresent").attr("disabled", "disabled");
            $("#btnPresent").removeClass("btn-green");
            //$("#btnPresent").attr("style", "")
        }
        flag_Add = false;
        document.body.scrollTop = 400;
        document.documentElement.scrollTop = 400;
    }
    function DisplayData(Selected_Data) {
        OperationIDglopel = Selected_Data[0].OperationID;
        CountGrid = -1;
        CountGridCharge = 0;
        $("#txtVoucherNo").val("");
        DocumentActions.RenderFromModel(Selected_Data[0]);
        try {
            var trDate = DateFormat(Selected_Data[0].TrDate);
        }
        catch (e) {
            flag_Add = true;
            flag_succ_insert = false;
            btnBack_1_onclick();
            DisplayMassage('تم الحفظ بنجاح ( برجاء اختيار التاريخ لعرض العمليه)', 'Saved successfully (Please select a date to view the operation)', MessageType.Worning);
            Errorinput(txtToDate);
            return;
        }
        $('#txtDate').val(trDate);
        txt_tax.value = Selected_Data[0].VatType == 0 ? 'null' : Selected_Data[0].VatType.toString();
        txtVatPrc.value = setVal(Selected_Data[0].VatPrc.toString());
        txtVatAmount.value = Selected_Data[0].VatAmount.toString();
        $('#txtClearanceDate').val(DateFormat(Selected_Data[0].ClearanceDate));
        $('#txtdateopening').val(DateFormat(Selected_Data[0].OpenAt));
        //$('#ddlVendor').prop("value", Selected_Data[0].VendorID);
        $('#ddlVendor option[value=' + Selected_Data[0].VendorID + ']').prop('selected', 'selected').change();
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
        var Close_TrDate = DateFormat(Selected_Data[0].Close_TrDate);
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
        var Netsales = Number(($('#txtClose_TotalSalesCash').val() - (Number($('#txtClose_TotalExpenses').val()) + Number(txtClose_Adjustment.value))));
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
        $('#lepRentdata').removeClass('display_none');
        $('#spanlepRentdata_4').toggleClass('fa-angle-double-left');
        $('#spanlepRentdata_4').toggleClass('fa-angle-double-down');
        $('#divlOerSalesman_2').removeClass('display_none');
        $('#spanlOerSalesman_2').toggleClass('fa-angle-double-left');
        $('#spanlOerSalesman_2').toggleClass('fa-angle-double-down');
        $('#lepMoney').removeClass('display_none');
        $('#spanlepMoney_4').toggleClass('fa-angle-double-left');
        $('#spanlepMoney_4').toggleClass('fa-angle-double-down');
        IsGenerated = Selected_Data[0].IsGenerated;
        txtTotal.value = "0";
        txtTotalValueCharge.value = "0";
        txtTotalVatCharge.value = "0";
        txtTotalAfterVatCharge.value = "0";
        Totaltax();
        ComputeTotals();
        ComputeTotalsCharge();
        $('#Print_salsman_1').addClass('display_none');
        $('#Print_salsman_2').addClass('display_none');
        if (ddlTrtype.value == '1') {
            Calculation_Close();
        }
    }
    function BindGetOperationItemsGridData(OperationID) {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("Processes", "AllGetOperationMasterDisplay"),
            data: { OperationID: OperationID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    AllGetOperationMasterDetailModel = result.Response;
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
    function BuildControls(cnt) {
        var html;
        html = "<tr id=\"No_Row" + cnt + "\">\n                    <input id=\"InvoiceItemID" + cnt + "\" type=\"hidden\" class=\"form-control display_none\"  />\n\t                <td>\n\t\t                <div class=\"form-group\">\n\t\t\t                <span id=\"btn_minus" + cnt + "\"><i class=\"fas fa-minus-circle  btn-minus\"></i></span>\n\t\t                </div>\n\t                </td>\n                     <td>\n\t\t                <div class=\"form-group\">\n\t\t\t                <select id=\"ddlFamily" + cnt + "\" class=\"form-control\" disabled  >\n\t\t\t\t                <option value=\"null\">\u0627\u062E\u062A\u0631</option>\n\t\t\t                </select>\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n\t\t\t               <select id=\"ddlItem" + cnt + "\" class=\"form-control\" disabled  >\n\t\t\t\t                <option  value=\"null\">\u0627\u062E\u062A\u0631</option>\n\t\t\t\t           </select>\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n\t\t\t                <input id=\"txtQuantity" + cnt + "\" type=\"number\" disabled class=\"form-control\"   value=\"0\"/>\n\t\t                </div>\n\t                </td>\n                     <td>\n\t\t                <div class=\"form-group\">\n\t\t\t                <input id=\"txtPrice" + cnt + "\" type=\"number\" disabled class=\"form-control\"   value=\"0\"/>\n\t\t                </div>\n\t                </td>\n                     <td>\n\t\t                <div class=\"form-group\">\n\t\t\t                <input id=\"txtMinPrice" + cnt + "\" type=\"number\" disabled class=\"form-control\"   value=\"0\"/>\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n\t\t\t                <input id=\"txtTotal" + cnt + "\" type=\"number\" disabled class=\"form-control\"   value=\"0\"/>\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n\t\t\t                <input id=\"txtSoldQty" + cnt + "\" type=\"number\" disabled class=\"form-control\"   value=\"0\"/>\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n\t\t\t                 <input id=\"txtScrapQty" + cnt + "\" type=\"number\" disabled class=\"form-control\"   value=\"0\"/>\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n\t\t\t                 <input id=\"txtAvailableQty" + cnt + "\" type=\"number\" disabled class=\"form-control\"   value=\"0\"/>\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n\t\t\t              <input id=\"txtRemark_item" + cnt + "\" type=\"text\" disabled class=\"form-control\"   value=\"\"/>\n\t\t                </div>\n\t                </td>\n                    <input id=\"txt_StatusFlag" + cnt + "\" name = \" \" type = \"hidden\" class=\"form-control\"/>\n                    <input id=\"txt_ID" + cnt + "\" name = \" \" type = \"hidden\" class=\"form-control\"/>\n                </tr>";
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
                $(".btn-number1[data-type='minus'][data-field='" + name + "']").removeAttr('disabled');
            }
            else {
                alert('Sorry, the minimum value was reached');
                $(this).val($(this).data('oldValue'));
            }
            if (valueCurrent <= maxValue) {
                $(".btn-number1[data-type='plus'][data-field='" + name + "']").removeAttr('disabled');
            }
            else {
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
        $('.input-number2' + cnt).focusin(function () {
            $(this).data('oldValue', $(this).val());
        });
        $('.input-number2' + cnt).change(function () {
            var minValue = parseInt($(this).attr('min'));
            var maxValue = parseInt($(this).attr('max'));
            var valueCurrent = parseInt($(this).val());
            var name = $(this).attr('name');
            if (valueCurrent >= minValue) {
                $(".btn-number2[data-type='minus'][data-field='" + name + "']").removeAttr('disabled');
            }
            else {
                alert('Sorry, the minimum value was reached');
                $(this).val($(this).data('oldValue'));
            }
            if (valueCurrent <= maxValue) {
                $(".btn-number2[data-type='plus'][data-field='" + name + "']").removeAttr('disabled');
            }
            else {
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
        var drop = '#ddlFamily' + cnt;
        $('#ddlFamily' + cnt).empty();
        $('#ddlFamily' + cnt).append('<option value="' + null + '">' + (lang == "ar" ? "اختر النوع" : "Choose Type") + '</option>');
        for (var i = 0; i < FamilyDetails.length; i++) {
            $('#ddlFamily' + cnt).append('<option value="' + FamilyDetails[i].ItemFamilyID + '">' + FamilyDetails[i].DescA + '</option>');
        }
        $('#ddlFamily' + cnt).change(function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
            // 
            if ($('#ddlFamily' + cnt).val() != "null") {
                $('#ddlItem' + cnt).empty();
                $('#ddlItem' + cnt).append('<option value="' + null + '">' + (lang == "ar" ? "اختر الصنف" : "Choose Item") + '</option>');
                FillddlItems(Number($('#ddlFamily' + cnt).val()));
                for (var i = 0; i < ItemBaesdFamilyDetails.length; i++) {
                    $('#ddlItem' + cnt).append('<option   data-OnhandQty="' + ItemBaesdFamilyDetails[i].OnhandQty + '" value="' + ItemBaesdFamilyDetails[i].ItemID + '">' + (lang == "ar" ? ItemBaesdFamilyDetails[i].DescA : ItemBaesdFamilyDetails[i].DescL) + '</option>');
                }
            }
            else {
                DisplayMassage("يجب اختيار النوع!", "must choose type!", MessageType.Worning);
                Errorinput($('#ddlFamily' + cnt));
                $('#ddlFamily' + cnt).val("null");
            }
        });
        var dropddlItem = '#ddlItem' + cnt;
        $('#ddlItem' + cnt).change(function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
            if ($('#ddlItem' + cnt).val() == "null") {
                $("#txtQuantity" + cnt).val("1");
                $("#txtPrice" + cnt).val("1");
                $("#txtTotal" + cnt).val("0");
                $("#txtTax" + cnt).val("0");
                $("#txtTotAfterTax" + cnt).val("0");
            }
            else {
                var selectedItem = $(dropddlItem + ' option:selected').attr('value');
                var selectedFamily = $(drop + ' option:selected').attr('value');
                var itemID = Number(selectedItem);
                var FamilyID = Number(selectedFamily);
                // var NumberSelect = ItemBaesdFamilyDetails.filter(s => s.ItemID == itemID);
                // 
                var res = false;
                res = checkRepeatedItems(itemID, FamilyID, cnt);
                if (res == true) {
                    $("#ddlItem" + cnt).val("null");
                    $("#txtPrice" + cnt).val("1");
                    DisplayMassage("لايمكن تكرار نفس الاصناف علي الفاتورة!", "The same items cannot be duplicated on the invoice!", MessageType.Worning);
                }
                else {
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
                    }
                    else {
                        var total = Number(txtQuantityValue) * Number(txtPriceValue);
                        $("#txtTotal" + cnt).val(total);
                        var vatAmount = Number(total) * VatPrc / 100;
                        $("#txtTax" + cnt).val(vatAmount);
                        var totalAfterVat = Number(vatAmount) + Number(total);
                        $("#txtTotAfterTax" + cnt).val(totalAfterVat);
                    }
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
                var total = (Number(txtQuantityValue) * Number(txtPriceValue)) /* - (Number(txtQuantityReturnValue) *0)*/;
                $("#txtTotal" + cnt).val(total);
            }
            $("#txtAvailableQty" + cnt).val(Number($("#txtQuantity" + cnt).val()) - Number($("#txtSoldQty" + cnt).val()) - Number($("#txtScrapQty" + cnt).val()));
            if (Number($("#txtQuantity" + cnt).val()) < 0) {
                $("#txtQuantity" + cnt).val('0');
            }
            ComputeTotals();
        });
        $("#txtRemark_item" + cnt).on('keyup', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
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
                $("#txtMinPrice" + cnt).val(0);
            }
            else if (Number($("#txtMinPrice" + cnt).val()) > Number($("#txtPrice" + cnt).val())) {
                DisplayMassage('يجب ان يكون أقل سعر اصغر من سعر الصنف', 'The lowest price should be smaller than the item price', MessageType.Worning);
                Errorinput($("#txtMinPrice" + cnt));
                $("#txtMinPrice" + cnt).val($("#txtPrice" + cnt).val() - 1);
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
                var total = (Number(txtQuantityValue) * Number(txtPriceValue)) /* - (Number(txtQuantityReturnValue) *0)*/;
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
        $("#txtQuantity" + cnt).click(function () {
        });
        $("#txtPrice" + cnt).click(function () {
        });
        $("#txtAddons" + cnt).change(function () {
            $("#txtTotAddons" + cnt).val((Number($("#txtAddons" + cnt).val()) + Number($("#txtPrice" + cnt).val())));
        });
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        return;
    }
    function Disbly_BuildControls(cnt, OperationItemInfo) {
        // 
        $("#btnAddDetails").addClass("display_none");
        $("#btn_minus" + cnt).addClass("display_none");
        $("#txt_StatusFlag" + cnt).val("");
        var FamilyID = Number(OperationItemInfo[cnt].ItemFamilyID);
        $("#ddlFamily" + cnt).prop("value", FamilyID);
        FillddlItems(Number($('#ddlFamily' + cnt).val()));
        for (var i = 0; i < OperationItemInfo.length; i++) {
            $('#ddlItem' + cnt).append('<option  value="' + OperationItemInfo[i].ItemID + '">' + OperationItemInfo[i].Itm_DescA + '</option>');
        }
        var itemcode = OperationItemInfo[cnt].ItemID;
        $("#txt_ID" + cnt).prop("value", OperationItemInfo[cnt].OperationItemID);
        $("#ddlItem" + cnt).prop("value", itemcode.toString());
        $("#txtQuantity" + cnt).prop("value", ((OperationItemInfo[cnt].ReceivedQty == null || undefined) ? 0 : OperationItemInfo[cnt].ReceivedQty));
        $("#txtRemark_item" + cnt).prop("value", ((OperationItemInfo[cnt].Expr1 == null || undefined) ? 0 : OperationItemInfo[cnt].Expr1));
        $("#txtPrice" + cnt).prop("value", (OperationItemInfo[cnt].Est_SalesPrice == null || undefined) ? 0 : OperationItemInfo[cnt].Est_SalesPrice.RoundToSt(2));
        $("#txtMinPrice" + cnt).prop("value", (OperationItemInfo[cnt].Min_SalesPrice == null || undefined) ? 0 : OperationItemInfo[cnt].Min_SalesPrice.RoundToSt(2));
        var Total = (Number(OperationItemInfo[cnt].ReceivedQty) * Number(OperationItemInfo[cnt].Est_SalesPrice));
        //$("#txtTotal" + cnt).prop("value", (Total).RoundToSt(2));
        $("#txtTotal" + cnt).prop("value", (OperationItemInfo[cnt].TotalSales == null || undefined) ? 0 : OperationItemInfo[cnt].TotalSales);
        debugger;
        $("#txtSoldQty" + cnt).prop("value", (OperationItemInfo[cnt].SoldQty == null || undefined) ? 0 : OperationItemInfo[cnt].SoldQty);
        $("#txtScrapQty" + cnt).prop("value", (OperationItemInfo[cnt].ScrapQty == null || undefined) ? 0 : OperationItemInfo[cnt].ScrapQty);
        var AvailableQty = (Number(OperationItemInfo[cnt].ReceivedQty) - Number(OperationItemInfo[cnt].SoldQty) - Number(OperationItemInfo[cnt].ScrapQty));
        $("#txtAvailableQty" + cnt).prop("value", (AvailableQty));
        $("#btn_minus" + cnt).on('click', function () {
            DeleteRow(cnt);
        });
        ComputeTotals();
    }
    function AddNewRow() {
        // 
        if (!SysSession.CurrentPrivileges.AddNew)
            return;
        var CanAdd = true;
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
            $("#txtRemark_item" + CountGrid).removeAttr("disabled");
            $("#txtPrice" + CountGrid).removeAttr("disabled");
            $("#txtMinPrice" + CountGrid).removeAttr("disabled");
            //$("#txtScrapQty" + CountGrid).removeAttr("disabled");
            // can delete new inserted record  without need for delete privilage
            $("#btn_minus" + CountGrid).removeClass("display_none");
            $("#btn_minus" + CountGrid).removeAttr("disabled");
            ComputeTotals();
            //CountGrid++;
            //eslam
            //bind statistics data
        }
    }
    function DeleteRow(RecNo) {
        if (!SysSession.CurrentPrivileges.Remove)
            return;
        WorningMessage("هل تريد الحذف؟", "Do you want to delete?", "تحذير", "worning", function () {
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
    function checkRepeatedItems(itemValue, familyValue, cnt) {
        var items = Number(CountGrid); //Error
        var flag = false;
        for (var i = 0; i < items; i++) {
            if (Number($("#ddlItem" + i).val()) == itemValue && Number($("#ddlFamily" + i).val()) == familyValue && i != cnt) {
                flag = true;
            }
        }
        return flag;
    }
    function ComputeTotals() {
        debugger;
        var Quantity = 0;
        var total = 0;
        var Voids = 0;
        var soldQty = 0;
        var Remaining_quantity = 0;
        for (var i = 0; i <= CountGrid; i++) {
            if ($("#txt_StatusFlag" + i).val() != 'm' && $("#txt_StatusFlag" + i).val() != 'd') {
                total += Number($("#txtTotal" + i).val());
                Quantity += Number($("#txtQuantity" + i).val());
                soldQty += Number($("#txtSoldQty" + i).val());
                Voids += Number($("#txtScrapQty" + i).val());
                Remaining_quantity += Number($("#txtAvailableQty" + i).val());
            }
        }
        txtTotal.value = total.RoundToSt(2).toString();
        $("#txtQuantity").val(Quantity);
        $("#txtsoldQty").val(soldQty);
        $("#txtVoids").val(Voids);
        $("#txtRemaining_quantity").val(Remaining_quantity);
    }
    function BuildControlsCharges(cnt) {
        var html;
        html = "<tr id=\"No_Row1" + cnt + "\">\n                    <input id=\"OperationExpensesID" + cnt + "\" type=\"text\" class=\"form-control\" style=\"display: none;\" disabled value=\"\"/>\n\t                <td>\n\t\t                <div class=\"form-group\">\n\t\t\t                <span id=\"btn_minus1" + cnt + "\" class=\"minusCharges\" ><i class=\"fas fa-minus-circle btn-minus\"></i></span>\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n\t\t\t               <input id=\"txtSerial" + cnt + "\" type=\"text\" class=\"form-control\" disabled value=\"" + CountItemsCharge + "\"/>\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n\t\t\t                <select id=\"txtAddonsCharge" + cnt + "\" class=\"form-control\" value=\"null\" ></select>\n\t\t                </div>\n\t                </td>\n                     <td>\n\t\t                <div class=\"form-group\">\n\t\t\t                <input id=\"txtAddonsTypeCharge" + cnt + "\" type=\"text\" class=\"form-control\" disabled value=\" \"/>\n\t\t                </div>\n\t                </td>\n                     <td>\n\t\t                <div class=\"form-group\">\n\t\t\t                 <input id=\"txtValueCharge" + cnt + "\" type=\"number\" class=\"form-control\"  value=\"0\"/>\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n\t\t\t                <select id=\"txtVatType" + cnt + "\" class=\"form-control\" value=\"null\" ></select>\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n\t\t\t                <input id=\"txtVatCharge" + cnt + "\" type=\"text\" value=\"0\" class=\"form-control\" disabled />\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n\t\t\t                 <input id=\"txtValueAfterVatCharge" + cnt + "\" type=\"text\" class=\"form-control\"  disabled  value=\"0\" />\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n\t\t\t                 <select id=\"txtVendorIsCheckCharge" + cnt + "\" class=\"form-control\"  ></select>\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n\t\t\t              <input id=\"txtInvoiceNumberCharge" + cnt + "\" type=\"text\" class=\"form-control\"  value=\"0\"/>\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n\t\t\t              <input id=\"txtInvoiceDateCharge" + cnt + "\" type=\"date\" class=\"form-control\"  />\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n\t\t\t              <select id=\"txtVendorCharge" + cnt + "\" class=\"form-control\"  ></select>\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n\t\t\t              <select id=\"txt_D_CashBox" + cnt + "\" name=\"\"  disabled class=\"form-control\" tabindex=\"-1\" aria-hidden=\"true\">\n\t\t\t                    <option value=\"Null\"> \u0627\u0644\u0635\u0646\u062F\u0648\u0642  </option>\n\t\t\t              </select>\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n\t\t\t              <input id=\"VoucherNoCharge" + cnt + "\" disabled type=\"text\" class=\"form-control\"  value=\"0\"/>\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n\t\t\t              <textarea id=\"RemarksCharge" + cnt + "\" type=\"text\" class=\"form-control\"  value=\"\"></textarea>\n\t\t                </div>\n\t                </td>\n                    <input id=\"TrNo" + cnt + "\" name = \" \" type =\"hidden\" class=\"form-control\"/>\n                    <input id=\"IsPosted" + cnt + "\" name = \" \" type =\"hidden\" class=\"form-control\"/>\n                    <input id=\"txt_StatusFlag1" + cnt + "\" name = \" \" type = \"hidden\" class=\"form-control\"/>\n                    <input id=\"txt_ID1" + cnt + "\" name = \" \" type = \"hidden\" class=\"form-control\"/>\n                </tr>";
        $("#div_ChargesData").append(html);
        $("#txtInvoiceDateCharge" + cnt).val(DateFormat(GetCurrentDate().toString()));
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
                $('#txtAddonsCharge' + cnt).append('<option VatType="' + AddonsData[i].VatType + '" value="' + AddonsData[i].ChargeID + '">' + AddonsData[i].DESCA + '</option>');
            else
                $('#txtAddonsCharge' + cnt).append('<option VatType="' + AddonsData[i].VatType + '" value="' + AddonsData[i].ChargeID + '">' + AddonsData[i].DESCL + '</option>');
        }
        var drop = '#txtAddonsCharge' + cnt;
        $(drop).change(function () {
            if ($("#txt_StatusFlag1" + cnt).val() != "i")
                $("#txt_StatusFlag1" + cnt).val("u");
            var Addons = Number($(drop + ' option:selected').attr('value'));
            if (isNaN(Addons)) {
                $("#txtAddonsTypeCharge" + cnt).val(" ");
            }
            else {
                var addTypeobj = AddonsData.filter(function (s) { return s.ChargeID == Addons; });
                var addType = addTypeobj[0].IsAddition;
                if (addType == true) {
                    $("#txtAddonsTypeCharge" + cnt).val("اضافة");
                }
                else {
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
                var NumberSelect = VatTypeData.filter(function (s) { return s.CODE == Code; });
                $("#txtVatType" + cnt).attr('data-VatPerc', NumberSelect[0].VatPerc);
                var vatPercentage = Number(NumberSelect[0].VatPerc);
                var amount = Number($("#txtValueCharge" + cnt).val());
                if (amount >= 0) {
                    var vatAmount = (vatPercentage * amount) / 100;
                    $("#txtVatCharge" + cnt).val(vatAmount.RoundToSt(2));
                    $("#txtValueAfterVatCharge" + cnt).val((vatAmount.RoundToNum(2) + amount.RoundToNum(2)).RoundToSt(2));
                }
                else {
                    $("#txtVatCharge" + cnt).val("0");
                    $("#txtValueAfterVatCharge" + cnt).val("0");
                }
            }
            else {
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
                var NumberSelect = VatTypeData.filter(function (s) { return s.CODE == Code; });
                var vatPercentage = Number(NumberSelect[0].VatPerc);
                var amount = Number($("#txtValueCharge" + cnt).val());
                if (amount >= 0) {
                    var vatAmount = (vatPercentage * amount) / 100;
                    $("#txtVatCharge" + cnt).val(vatAmount.RoundToSt(2));
                    $("#txtValueAfterVatCharge" + cnt).val((vatAmount.RoundToNum(2) + amount.RoundToNum(2)).RoundToSt(2));
                }
                else {
                    $("#txtVatCharge" + cnt).val("0");
                    $("#txtValueAfterVatCharge" + cnt).val("0");
                }
            }
            else {
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
        $("#txtVendorIsCheckCharge" + cnt).on('change', function () {
            // 
            if ($("#txt_StatusFlag1" + cnt).val() != "i")
                $("#txt_StatusFlag1" + cnt).val("u");
            if ($("#txtVendorIsCheckCharge" + cnt).val() == 1) {
                $("#txt_D_CashBox" + cnt).prop("disabled", false);
            }
            else {
                $("#txt_D_CashBox" + cnt).prop("disabled", true);
                $("#txt_D_CashBox" + cnt).prop("value", "Null");
            }
        });
        $("#txtAddonsCharge" + cnt).on('change', function () {
            // 
            if ($("#txt_StatusFlag1" + cnt).val() != "i")
                $("#txt_StatusFlag1" + cnt).val("u");
            var ChargeID = $("#txtAddonsCharge" + cnt).val();
            var VatType = AddonsData.filter(function (x) { return x.ChargeID == ChargeID; })[0].VatType;
            $("#txtVatType" + cnt).val(VatType);
            var selectedItem = $("#txtVatType" + cnt + ' option:selected').attr('value');
            if (selectedItem != "null") {
                var Code = Number(selectedItem);
                var NumberSelect = VatTypeData.filter(function (s) { return s.CODE == Code; });
                $("#txtVatType" + cnt).attr('data-VatPerc', NumberSelect[0].VatPerc);
                var vatPercentage = Number(NumberSelect[0].VatPerc);
                var amount = Number($("#txtValueCharge" + cnt).val());
                if (amount >= 0) {
                    var vatAmount = (vatPercentage * amount) / 100;
                    $("#txtVatCharge" + cnt).val(vatAmount.RoundToSt(2));
                    $("#txtValueAfterVatCharge" + cnt).val((vatAmount.RoundToNum(2) + amount.RoundToNum(2)).RoundToSt(2));
                }
                else {
                    $("#txtVatCharge" + cnt).val("0");
                    $("#txtValueAfterVatCharge" + cnt).val("0");
                }
            }
            else {
                $("#txtVatCharge" + cnt).val("0");
                $("#txtValueAfterVatCharge" + cnt).val("0");
            }
            //ComputeTotalsCharge();
            ComputeTotalsCharge();
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
    function Disbly_BuildControlsCharges(cnt, OperationCharges) {
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
            Cashbox_DescA = CashboxDetails.filter(function (x) { return x.CashBox_DescA == OperationCharges[cnt].CashBox_DescA; });
            $("#txt_D_CashBox" + cnt).val(Cashbox_DescA[0].CashBoxID);
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
        if (!SysSession.CurrentPrivileges.AddNew)
            return;
        var CanAddCharge = true;
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
            debugger;
            BuildControlsCharges(CountGridCharge);
            $("#txt_StatusFlag1" + CountGridCharge).val("i"); //In Insert mode
            $("#btn_minus1" + CountGridCharge).removeClass("display_none");
            $("#btn_minus1" + CountGridCharge).removeAttr("disabled");
            $(".minusCharges").removeClass("display_none");
            CountGridCharge += 1;
            debugger;
            Insert_Serial();
            ComputeTotalsCharge();
        }
    }
    function DeleteRowCharge(RecNo) {
        // 
        if (!SysSession.CurrentPrivileges.Remove)
            return;
        WorningMessage("هل تريد الحذف؟", "Do you want to delete?", "تحذير", "worning", function () {
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
        var TotalValueCharge = 0;
        var TotalVatCharge = 0;
        var TotalAfterVatCharge = 0;
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
        var Chack_Flag = false;
        var flagval = "";
        var Ser = 1;
        for (var i = 0; i < CountGridCharge; i++) {
            flagval = $("#txt_StatusFlag1" + i).val();
            if (flagval != "d" && flagval != "m") {
                $("#txtSerial" + i).val(Ser);
                Ser++;
            }
            if (flagval == 'd' || flagval == 'm' || flagval == 'i') {
                Chack_Flag = true;
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
            var search_2 = searchOerSalesmanGrid_Master.value.toLowerCase();
            SearchDetails_Salesman = AllGetOperationMasterDetailModel.TR_OperationSalesman.filter(function (x) { return x.NameA.toString().search(search_2) >= 0; });
            OerSalesmanGrid_Master.DataSource = SearchDetails_Salesman;
            OerSalesmanGrid_Master.Bind();
        }
        else {
            OerSalesmanGrid_Master.DataSource = AllGetOperationMasterDetailModel.TR_OperationSalesman;
            OerSalesmanGrid_Master.Bind();
        }
    }
    function InitializeSalnMaGrid() {
        var res = GetResourceList("");
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
        ];
    }
    function SalaGridDoubleClick() {
        if (Selected_Data[0].Status != 3) { //مغلق 
            btnBack_5_onclick();
        }
        var OperSale = AllGetOperationMasterDetailModel.TR_OperationSalesman.filter(function (x) { return x.OperationSalesmanID == Number(OerSalesmanGrid_Master.SelectedKey); });
        SalesmanId_Deposit = OperSale[0].SalesmanId;
        DisplayOperSaleMaster(SalesmanId_Deposit);
        $("#id_Lapl_Salesman").html('<i class="glyphicon glyphicon-hand-down"></i> &gt;&gt;  ' + (lang == "ar" ? ' الاصناف لدي المندوب ( ' + OperSale[0].NameA + ' ) ' : ' Items I have SalesMan ( ' + OperSale[0].NameE + ' ) ') + '   &lt;&lt; <i class="glyphicon glyphicon-hand-down"></i>');
        OperationDeposit = AllGetOperationMasterDetailModel.I_TR_OperationDeposit.filter(function (x) { return x.SalesmanId == SalesmanId_Deposit; });
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
            $('#lepRentdata').toggleClass('display_none');
            $('#spanlepRentdata_4').addClass('fa-angle-double-down');
        });
        $('#Div_Money').on('click', function () {
            $('#lepMoney').toggleClass('display_none');
            $('#spanlepMoney_4').toggleClass('fa-angle-double-down');
        });
        $('#lepRentdata').removeClass('display_none');
        $('#lepMoney').removeClass('display_none');
        $('#spanlepRentdata_4').addClass('fa-angle-double-left');
        //$('#spanlepRentdata_4').addClass('fa-angle-double-down');
    }
    function DisplayOperSaleMaster(SalesmanId) {
        SalesmanItem_Data = new Array();
        var OperSalesmanID = AllGetOperationMasterDetailModel.TR_OperationSalesman.filter(function (x) { return x.SalesmanId == SalesmanId; });
        SalesmanItem_Data = AllGetOperationMasterDetailModel.TR_OperationSalesmanItem.filter(function (x) { return x.OperationSalesmanID == OperSalesmanID[0].OperationSalesmanID; });
        OerSalesmanGrid_Detail.DataSource = SalesmanItem_Data;
        OerSalesmanGrid_Detail.Bind();
        SalesmanItem_AllAssign(SalesmanItem_Data);
        $('#Print_salsman_1').removeClass('display_none');
        $('#Print_salsman_2').removeClass('display_none');
    }
    function SalesmanItem_AllAssign(Item_Data) {
        SalesmanItem_Assign = new Array();
        for (var i = 0; i < Item_Data.length; i++) {
            var SinglSalesman = new I_TR_OperationSalesmanItem();
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
        var res = GetResourceList("");
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
                itemTemplate: function (s, item) {
                    var txt = document.createElement("input");
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
                    txt.onkeyup = function (e) {
                        check_OnhandQty(item.OperationSalesmanItemID);
                    };
                    txt.value = item.ScrapQty.toString();
                    txt.setAttribute('valScrapQty', item.ScrapQty.toString());
                    return txt;
                }
            },
            {
                title: res.Remaining_quantity, name: "OnhandQty", type: "text", width: "10%",
                itemTemplate: function (s, item) {
                    var txt = document.createElement("input");
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
        ];
    }
    function check_OnhandQty(id_Num) {
        var ScrapQty = document.getElementById("ScrapQty" + id_Num);
        var OnhandQty = document.getElementById("OnhandQty" + id_Num);
        var Onhand = Number(OnhandQty.getAttribute('val')) + Number(ScrapQty.getAttribute('valScrapQty'));
        OnhandQty.value = (Number(Onhand) - Number(ScrapQty.value)).toString();
        if (Number(ScrapQty.value) > Number(Onhand)) {
            DisplayMassage(" لا يمكنك تجاوز الكمية المتبقية ( " + Onhand + " )", "You cannot exceed the remaining quantity!", MessageType.Worning);
            ScrapQty.value = Onhand.toString();
            OnhandQty.value = "0";
            Errorinput(ScrapQty);
        }
        var index = findIndexInData(SalesmanItem_Assign, 'OperationSalesmanItemID', id_Num);
        SalesmanItem_Assign[index].ScrapQty = Number(ScrapQty.value);
        SalesmanItem_Assign[index].OnhandQty = null;
    }
    function BuildControlslebel(cnt) {
        var html;
        html = "<tr id=\"row_font_header" + cnt + "\">\n                    <input id=\"InvoiceItemID" + cnt + "\" type=\"hidden\" class=\"form-control display_none\"  />\n\t                <td>\n\t\t                <div class=\"form-group\">\n\t\t\t                <span id=\"btn_minus3" + cnt + "\" class=\"lebelminus\"><i class=\"fas fa-minus-circle  btn-minus\"></i></span>\n\t\t                </div>\n\t                </td>\n                     <td>\n\t\t                <div class=\"form-group\">\n\t\t\t                <input id=\"txtSerial3" + cnt + "\" type=\"number\" class=\"form-control\">\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n\t\t\t               <input type=\"date\" id=\"DepositDate" + cnt + "\" class=\"form-control\">\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n\t\t\t                <select id=\"Salesman" + cnt + "\" class=\"form-control\"> \n\t\t\t                    <option value=\"null\"> " + (lang == "ar" ? "اختار المندوب" : "Choose Salesman") + " </option> \n\t\t\t                </select >\n\t\t                </div>\n\t                </td>\n                     <td>\n\t\t                <div class=\"form-group\">\n\t\t\t                <input id=\"DepositAmount" + cnt + "\" type=\"number\" class=\"form-control\">\n\t\t                </div>\n\t                </td>\n                     <td>\n\t\t                <div class=\"form-group\">\n\t\t\t               \t<select id=\"ACC_type" + cnt + "\" class=\"form-control\"> \n\t\t\t                    <option value=\"Null\"> " + (lang == "ar" ? "النوع الحساب  " : "Account Type ") + "  </option> \n                                <option value=\"0\"> " + (lang == "ar" ? "بنك" : "Bank") + " </option>\n                                <option value=\"1\"> " + (lang == "ar" ? "صندوق" : "Cash box") + " </option> \n\t\t\t                </select >\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\" id=\"Acc_Code_div" + cnt + "\">\n\t\t\t               <select id=\"Acc_Code' + " + cnt + "\" class=\"form-control\"> \n\t\t\t                    <option value=\"Null\"> " + (lang == "ar" ? "رقم الحساب" : "Account Number") + " </option>\n\t\t\t               </select >\n\t\t                </div>\n                        <div class=\"form-group display_none\" id=\"CashBox_div" + cnt + "\">\n\t\t\t                <select id=\"CashBox" + cnt + "\" class=\"form-control display_none\"> \n\t\t\t                    <option value=\"Null\"> " + (lang == "ar" ? "الصندوق" : "CashBox") + "</option>\n\t\t\t                </select >\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n\t\t\t               <textarea rows=\"2\"  id=\"Remarks" + cnt + "\" class=\"form-control\"></textarea>\n\t\t                </div>\n\t                </td>\n                    <input id=\"txt_StatusFlag2" + cnt + "\" name = \" \" type = \"hidden\" class=\"form-control\"/>\n                    <input id=\"DepositID" + cnt + "\" name = \" \" type = \"hidden\" class=\"form-control\"/>\n                </tr>";
        $("#data_lebel").append(html);
        var Salsman = AllGetOperationMasterDetailModel.TR_OperationSalesman;
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
    function Disbly_BuildControlsDeposit(cnt, I_TR_OperationDeposit) {
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
        if (!SysSession.CurrentPrivileges.AddNew)
            return;
        var CanAddDeposit = true;
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
    function DeleteRow_3(RecNo) {
        if (!SysSession.CurrentPrivileges.Remove)
            return;
        WorningMessage("هل تريد الحذف؟", "Do you want to delete?", "تحذير", "worning", function () {
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
        Calculation_Close();
    }
    function Calculation_Close() {
        debugger;
        //صافي المبيعات = اجمالي المصروفات  + التسويه  - اجمالي المبيعات
        var Netsales = (Number($('#txtClose_TotalSalesCash').val()) - (Number(txtClose_Adjustment.value) + Number($('#txtClose_TotalExpenses').val()) + Number($('#textClose_Coolingandstorage').val()))).RoundToSt(2);
        $('#txtNetsales').val(Netsales);
        //العمولة
        var CompanyCommition = (Number($('#txtNetsales').val()) - Number($('#txtPaperPurchaseValue').val())).RoundToSt(2);
        $('#txtClose_CompanyCommition').val(CompanyCommition);
        //نسبة العمولة  
        var prc = ((Number($('#txtClose_CompanyCommition').val()) * 100) / Number($('#txtClose_TotalSalesCash').val())).RoundToSt(2);
        $('#txtClose_CompanyCommitionPrc').val(prc);
        //صافي الارباح = عمولة الشركة - عمولة البائع
        var NetProfit = ((Number($('#txtClose_CompanyCommition').val()) + Number($('#txtClose_Marketting').val())) - Number($('#txtClose_SalesManCommition').val()));
        $('#txtClose_NetProfit').val(NetProfit.RoundToSt(2).toString());
        //قيمة الشراء = صافي المبيعات - عمولة الشركة
        var purchaseValue = (Number($('#txtNetsales').val()) - Number($('#txtClose_CompanyCommition').val()));
        purchaseValue = (Number(purchaseValue) - Number($('#txtClose_Marketting').val()));
        $('#txtClose_purchaseValue').val(purchaseValue.RoundToSt(2).toString());
    }
    function Calculation_Close1() {
        //صافي المبيعات = اجمالي المصروفات  + التسويه  - اجمالي المبيعات
        var Netsales = Number(($('#txtClose_TotalSalesCash').val() - (Number($('#txtClose_TotalExpenses').val()) + Number(txtClose_Adjustment.value))));
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
    function ValidationHeader() {
        if (txtTruckNumber.value == "") {
            DisplayMassage(" برجاء أدخل رقم الشاحنة!", "must enter number of truck !", MessageType.Worning);
            Errorinput(txtTruckNumber);
            return false;
        }
        else if (txtPortName.value == "") {
            DisplayMassage(" برجاء أدخل اسم ميناء الدخول!", "must enter name of Port of entry !", MessageType.Worning);
            Errorinput(txtPortName);
            return false;
        }
        else if (ddlVendor.value == "null") {
            DisplayMassage(" برجاء اختيار المورد!", "must choose Vendor!", MessageType.Worning);
            Errorinput(ddlVendor);
            return false;
        }
        else if (txtNationality.value == "null") {
            DisplayMassage(" برجاء اختيار  الدولة!", "must choose state!", MessageType.Worning);
            Errorinput(txtNationality);
            return false;
        }
        else if (txtPaperPurchaseValue.value == "") {
            DisplayMassage("برجاء أدخل  قيمة البضاعة المسجلة!", "must enter value of registration goods !", MessageType.Worning);
            Errorinput(txtPaperPurchaseValue);
            return false;
        }
        else if (txtPolice_num.value == "") {
            DisplayMassage("برجاء أدخل  رقم البوليصه!", "must enter value of Police NO!", MessageType.Worning);
            Errorinput(txtPolice_num);
            return false;
        }
        else if (txtCustomNo.value == "") {
            DisplayMassage("برجاء أدخل  رقم البيان!", "must enter value of Custom NO!", MessageType.Worning);
            Errorinput(txtCustomNo);
            return false;
        }
        else if (txt_tax.value == "null") {
            DisplayMassage("برجاء أدخل  نوع الضريبه!", "must enter value of Custom NO!", MessageType.Worning);
            Errorinput(txt_tax);
            return false;
        }
        else if (ddlSalesman.value == "null" && Status == 1) {
            DisplayMassage(" برجاء اختيار  البائع!", "must choose seller!", MessageType.Worning);
            Errorinput(ddlSalesman);
            return false;
        }
        return true;
    }
    function ValidationClose() {
        if (txtClose_Adjustment.value.trim() == "") {
            DisplayMassage(" برجاء أدخل التسويات!", "must enter adjustment !", MessageType.Worning);
            Errorinput(txtClose_Adjustment);
            return false;
        }
        else if (txtClose_CompanyCommitionPrc.value.trim() == "") {
            DisplayMassage(" برجاء أدخل عمولة الشركة!", "must enter Company commission !", MessageType.Worning);
            Errorinput(txtClose_CompanyCommitionPrc);
            return false;
        }
        else if (txtClose_SalesManCommition.value.trim() == "") {
            DisplayMassage(" برجاء أدخل عمولة البائع!", "must enter seller commission !", MessageType.Worning);
            Errorinput(txtClose_SalesManCommition);
            return false;
        }
        return true;
    }
    function Validation_Grid(rowcount) {
        if ($("#ddlFamily" + rowcount).val() == "null" && ($("#txt_StatusFlag" + rowcount).val() != 'd' || $("#txt_StatusFlag" + rowcount).val() != 'm')) {
            DisplayMassage("  برجاءادخال النوع!", "must enter Type !", MessageType.Worning);
            Errorinput($("#ddlFamily" + rowcount));
            return false;
        }
        else if (($("#ddlItem" + rowcount).val() == "null") && ($("#txt_StatusFlag" + rowcount).val() != 'd' || $("#txt_StatusFlag" + rowcount).val() != 'm')) {
            DisplayMassage("برجاءادخال الصنف!", "must enter item !", MessageType.Worning);
            Errorinput($("#ddlItem" + rowcount));
            return false;
        }
        else if ((Number($("#txtQuantity" + rowcount).val()) < Number($("#txtSoldQty" + rowcount).val())) && ($("#txt_StatusFlag" + rowcount).val() != 'd' || $("#txt_StatusFlag" + rowcount).val() != 'm')) {
            DisplayMassage(" يجب تكون الكميه اكبر من الكمبه المباعه!", "must enter Quantity !", MessageType.Worning);
            Errorinput($("#txtQuantity" + rowcount));
            return false;
        }
        else if (($("#txtPrice" + rowcount).val() == "" || $("#txtPrice" + rowcount).val() == 0) && ($("#txt_StatusFlag" + rowcount).val() != 'd' || $("#txt_StatusFlag" + rowcount).val() != 'm')) {
            DisplayMassage("  برجاءادخال السعر!", "must enter Price !", MessageType.Worning);
            Errorinput($("#txtPrice" + rowcount));
            return false;
        }
        else if (($("#txtMinPrice" + rowcount).val() == "" || $("#txtMinPrice" + rowcount).val() == 0) && ($("#txt_StatusFlag" + rowcount).val() != 'd' || $("#txt_StatusFlag" + rowcount).val() != 'm')) {
            DisplayMassage(" برجاءادخال اقل سعر!", "must enter lowest price !", MessageType.Worning);
            Errorinput($("#txtMinPrice" + rowcount));
            return false;
        }
        return true;
    }
    function ValidationCharge_Grid(rowcount) {
        //else
        if ($("#txtAddonsCharge" + rowcount).val() == "null" && ($("#txt_StatusFlag1" + rowcount).val() != 'd' || $("#txt_StatusFlag1" + rowcount).val() != 'm')) {
            DisplayMassage(" برجاء اختيار الإضافة!", "must choose addition!", MessageType.Worning);
            Errorinput($("#txtAddonsCharge" + rowcount));
            return false;
        }
        else if ($("#txtAddonsTypeCharge" + rowcount).val() == "null" && ($("#txt_StatusFlag1" + rowcount).val() != 'd' || $("#txt_StatusFlag1" + rowcount).val() != 'm')) {
            DisplayMassage(" برجاء اختيار نوع الإضافة!", "must choose a type addition !", MessageType.Worning);
            Errorinput($("#txtAddonsTypeCharge" + rowcount));
            return false;
        }
        else if (($("#txtValueCharge" + rowcount).val() == "") || $("#txtValueCharge" + rowcount).val() == "0" && ($("#txt_StatusFlag1" + rowcount).val() != 'd' || $("#txt_StatusFlag1" + rowcount).val() != 'm')) {
            DisplayMassage(" برجاءادخال القيمة!", "must enter value !", MessageType.Worning);
            Errorinput($("#txtValueCharge" + rowcount));
            return false;
        }
        else if ($("#txtVatType" + rowcount).val() == "null" && ($("#txt_StatusFlag1" + rowcount).val() != 'd' || $("#txt_StatusFlag1" + rowcount).val() != 'm')) {
            DisplayMassage(" برجاء اختيار نوع الضريبة!", "must choose a type of tax  !", MessageType.Worning);
            Errorinput($("#txtVatType" + rowcount));
            return false;
        }
        else if ($("#txtVendorIsCheckCharge" + rowcount).val() == "null" && ($("#txt_StatusFlag1" + rowcount).val() != 'd' || $("#txt_StatusFlag1" + rowcount).val() != 'm')) {
            DisplayMassage("  برجاءاختيار نقدى ام علي الحساب!", "must choose cash or debit !", MessageType.Worning);
            Errorinput($("#txtVendorIsCheckCharge" + rowcount));
            return false;
        }
        else if (($("#txtInvoiceNumberCharge" + rowcount).val() == "" || $("#txtInvoiceNumberCharge" + rowcount).val() == "0") && ($("#txt_StatusFlag1" + rowcount).val() != 'd' || $("#txt_StatusFlag1" + rowcount).val() != 'm')) {
            DisplayMassage(" برجاء ادخال رقم الفاتورة!", "must enter number of invoice  !", MessageType.Worning);
            Errorinput($("#txtInvoiceNumberCharge" + rowcount));
            return false;
        }
        else if ($("#txtVendorCharge" + rowcount).val() == "null" && ($("#txt_StatusFlag1" + rowcount).val() != 'd' || $("#txt_StatusFlag1" + rowcount).val() != 'm')) {
            DisplayMassage("برجاءاختيارالمورد!", "must choose vendor !", MessageType.Worning);
            Errorinput($("#txtVendorCharge" + rowcount));
            return false;
        }
        else if ($("#txt_D_CashBox" + rowcount).val() == "Null" && $("#txtVendorIsCheckCharge" + rowcount).val() == "1" && ($("#txt_StatusFlag1" + rowcount).val() != 'd' || $("#txt_StatusFlag1" + rowcount).val() != 'm')) {
            DisplayMassage(" برجاء اختيار الصندوق!", "must Choose a box  !", MessageType.Worning);
            Errorinput($("#txt_D_CashBox" + rowcount));
            return false;
        }
        return true;
    }
    function ValidationDeposit_Grid(rowcount) {
        if ($("#txtSerial3" + rowcount).val() == "" && ($("#txt_StatusFlag2" + rowcount).val() != 'd' || $("#txt_StatusFlag" + rowcount).val() != 'm')) {
            DisplayMassage(" برجاء ادخال مسلسل!", "must enter serial number  !", MessageType.Worning);
            Errorinput($("#txtSerial3" + rowcount));
            return false;
        }
        else if ($("#Salesman" + rowcount).val() == "null" && ($("#txt_StatusFlag2" + rowcount).val() != 'd' || $("#txt_StatusFlag" + rowcount).val() != 'm')) {
            DisplayMassage(" برجاء اختيار المندوب!", "must value of Salesman !", MessageType.Worning);
            Errorinput($("#Salesman" + rowcount));
            return false;
        }
        else if ($("#DepositAmount" + rowcount).val() == "" && ($("#txt_StatusFlag2" + rowcount).val() != 'd' || $("#txt_StatusFlag" + rowcount).val() != 'm')) {
            DisplayMassage(" برجاء ادخال قيمة المبلغ!", "must value of amount !", MessageType.Worning);
            Errorinput($("#DepositAmount" + rowcount));
            return false;
        }
        else if ($("#ACC_type" + rowcount).val() == "Null" && ($("#txt_StatusFlag2" + rowcount).val() != 'd' || $("#txt_StatusFlag" + rowcount).val() != 'm')) {
            DisplayMassage("برجاء اختيار نوع الحساب !", "must Choose a type of deposit account !", MessageType.Worning);
            Errorinput($("#ACC_type" + rowcount));
            return false;
        }
        else if ($("#Acc_Code" + rowcount).val() == "Null" && $("#ACC_type" + rowcount).val() == "0" && ($("#txt_StatusFlag2" + rowcount).val() != 'd' || $("#txt_StatusFlag" + rowcount).val() != 'm')) {
            DisplayMassage("برجاء اختيار  الحساب البنك!", "must Choose a type of deposit account !", MessageType.Worning);
            Errorinput($("#Acc_Code" + rowcount));
            return false;
        }
        else if ($("#CashBox" + rowcount).val() == "Null" && $("#ACC_type" + rowcount).val() == "1" && ($("#txt_StatusFlag2" + rowcount).val() != 'd' || $("#txt_StatusFlag" + rowcount).val() != 'm')) {
            DisplayMassage("برجاء اختيار  الصندوق  !", "must Choose a type of deposit account !", MessageType.Worning);
            Errorinput($("#CashBox" + rowcount));
            return false;
        }
        else if ($("#Remarks" + rowcount).val() == "" && ($("#txt_StatusFlag2" + rowcount).val() != 'd' || $("#txt_StatusFlag" + rowcount).val() != 'm')) {
            DisplayMassage(" برجاء ادخال ملاحظات!", "must enter notes !", MessageType.Worning);
            Errorinput($("#Remarks" + rowcount));
            return false;
        }
        return true;
    }
    //----------------------------------------------------- Div_Processes----------------------------------------------------
    function Assign_1_Processes() {
        debugger;
        Model_I_TR_Operation = new I_TR_Operation();
        if (FlagIns_Operation == true) { //Insert
            if ($('#txtClose_CompanyCommition').val() == "NaN" || $('#txtClose_NetProfit').val() == "") {
                $('#txtClose_CompanyCommition').val('0');
            }
            if ($('#txtClose_purchaseValue').val() == "NaN" || $('#txtClose_NetProfit').val() == "") {
                $('#txtClose_purchaseValue').val('0');
            }
            if ($('#txtClose_NetProfit').val() == "NaN" || $('#txtClose_NetProfit').val() == "") {
                $('#txtClose_NetProfit').val('0');
            }
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
            Model_I_TR_Operation.IsGenerated = false;
            Model_I_TR_Operation.Close_Marketting = Number($('#txtClose_Marketting').val());
            Model_I_TR_Operation.PurVoucherNo = Number($('#txtPurVoucherNo').val());
            Model_I_TR_Operation.IsPurPosted = false;
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
            Model_I_TR_Operation.MODULE_CODE = Modules.Processes;
            Model_I_TR_Operation.UserCode = SysSession.CurrentEnvironment.UserCode;
            Model_I_TR_Operation.sec_FinYear = SysSession.CurrentEnvironment.CurrentYear;
        }
        else { // Update 
            // 
            if ($('#txtClose_CompanyCommition').val() == "NaN" || $('#txtClose_NetProfit').val() == "") {
                $('#txtClose_CompanyCommition').val('0');
            }
            if ($('#txtClose_purchaseValue').val() == "NaN" || $('#txtClose_NetProfit').val() == "") {
                $('#txtClose_purchaseValue').val('0');
            }
            if ($('#txtClose_NetProfit').val() == "NaN" || $('#txtClose_NetProfit').val() == "") {
                $('#txtClose_NetProfit').val('0');
            }
            DocumentActions.AssignToModel(Model_I_TR_Operation);
            Model_I_TR_Operation.RefNO = Selected_Data[0].RefNO;
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
            Model_I_TR_Operation.MODULE_CODE = Modules.Processes;
            Model_I_TR_Operation.UserCode = SysSession.CurrentEnvironment.UserCode;
            Model_I_TR_Operation.sec_FinYear = SysSession.CurrentEnvironment.CurrentYear;
        }
        Model_I_TR_Operation.Close_Coolingandstorage = Number(textClose_Coolingandstorage.value);
    }
    function Insert_1_Processes() {
        // 
        if (!CheckDate(DateFormat(txtDateHeader.value).toString(), DateFormat(SysSession.CurrentEnvironment.StartDate).toString(), DateFormat(SysSession.CurrentEnvironment.EndDate).toString())) {
            DisplayMassage('  التاريخ ليس متطابق مع تاريخ السنه (' + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ')', 'The date is not identical with the date of the year(' + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ')', MessageType.Worning);
            Errorinput(txtDateHeader);
            return;
        }
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("Processes", "Insert_Processes"),
            data: JSON.stringify(Model_I_TR_Operation),
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    OperationID = result.Response;
                    DisplayMassage("تم أضافة عملية بنجاح", "Operation added successfully", MessageType.Succeed);
                    flag_succ_insert = true;
                    $('#txtCreatedBy').val(SysSession.CurrentEnvironment.UserCode);
                    $('#txtCreatedAt').val(DateTimeFormat(Date().toString()));
                    $('#txtUpdatedBy').val("");
                    $('#txtUpdatedAt').val("");
                }
                else {
                    DisplayMassage("خطأء!", "Error!", MessageType.Worning);
                    flag_succ_insert = false;
                }
            }
        });
    }
    function Update_1_Processes() {
        if (!CheckDate(DateFormat(txtDateHeader.value).toString(), DateFormat(SysSession.CurrentEnvironment.StartDate).toString(), DateFormat(SysSession.CurrentEnvironment.EndDate).toString())) {
            DisplayMassage('  التاريخ ليس متطابق مع تاريخ السنه (' + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ')', 'The date is not identical with the date of the year(' + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ')', MessageType.Worning);
            Errorinput(txtDateHeader);
            return;
        }
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("Processes", "Update_Processes"),
            data: JSON.stringify(Model_I_TR_Operation),
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
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
                        $('#lepRentdata').removeClass('display_none');
                        $('#spanlepRentdata_4').toggleClass('fa-angle-double-left');
                        $('#spanlepRentdata_4').toggleClass('fa-angle-double-down');
                        $('#lepMoney').removeClass('display_none');
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
        Selected_Data = new Array();
        Selected_Data = Get_IQ_GetOperation.filter(function (x) { return x.OperationID == OperationID; });
        $("#div_Master_Hedr").removeClass("display_none");
        DisplayData(Selected_Data);
        if (Selected_Data[0].Status == 0) { // تحت التجهيز
            Processes_under_preparing();
        }
        else if (Selected_Data[0].Status == 1) { //جاهز
        }
        else if (Selected_Data[0].Status == 2) { //مفتوحة
            Processes_Open();
        }
        else if (Selected_Data[0].Status == 3) { //مغلق
            Processes_Close();
        }
        flag_Add = false;
    }
    //-----------------------------------------------------------------------------------------------------------------------
    //----------------------------------------------------- Div_items-------------------------------------------------------
    function Assign_2_items() {
        // ;
        OperationItemModel = new Array();
        var StatusFlag;
        for (var i = 0; i <= CountGrid; i++) {
            OperationItemSingleModel = new I_TR_OperationItems();
            StatusFlag = $("#txt_StatusFlag" + i).val();
            OperationItemSingleModel.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
            OperationItemSingleModel.UserCode = SysSession.CurrentEnvironment.UserCode;
            if (StatusFlag == "i") {
                i == 0 ? Save_Add = true : Save_Add = false;
                OperationItemSingleModel.StatusFlag = StatusFlag.toString();
                OperationItemSingleModel.OperationItemID = 0;
                OperationItemSingleModel.OperationID = OperationID;
                OperationItemSingleModel.ItemID = $("#ddlItem" + i).val();
                OperationItemSingleModel.ReceivedQty = $('#txtQuantity' + i).val();
                OperationItemSingleModel.Remarks = $('#txtRemark_item' + i).val();
                OperationItemSingleModel.Est_SalesPrice = $("#txtPrice" + i).val();
                OperationItemSingleModel.Min_SalesPrice = $("#txtMinPrice" + i).val();
                OperationItemSingleModel.TotalSales = $("#txtTotal" + i).val();
                OperationItemSingleModel.SoldQty = $('#txtSoldQty' + i).val(); //
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
                OperationItemSingleModel.Remarks = $('#txtRemark_item' + i).val();
                OperationItemSingleModel.Est_SalesPrice = $("#txtPrice" + i).val();
                OperationItemSingleModel.Min_SalesPrice = $("#txtMinPrice" + i).val();
                OperationItemSingleModel.TotalSales = $("#txtTotal" + i).val();
                OperationItemSingleModel.SoldQty = $('#txtSoldQty' + i).val(); //
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
            success: function (d) {
                var result = d;
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
            success: function (d) {
                var result = d;
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
        chargesDetailsModel = new Array();
        var StatusFlag;
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
                chargesingleModel.VatType = $('#txtVatType' + i).val(); //
                chargesingleModel.VatAmount = $("#txtVatCharge" + i).val();
                chargesingleModel.NetAtferVat = $("#txtValueAfterVatCharge" + i).val();
                chargesingleModel.VatPrc = Number($("#txtVatType" + i).attr('data-VatPerc'));
                var ispaid = $("#txtVendorIsCheckCharge" + i).val();
                if (ispaid == "0") {
                    chargesingleModel.isPaidByVendor = true;
                }
                else {
                    chargesingleModel.isPaidByVendor = false;
                }
                chargesingleModel.RefInvoiceNo = $("#txtInvoiceNumberCharge" + i).val();
                chargesingleModel.ChRemarks = $("#RemarksCharge" + i).val();
                chargesingleModel.VoucherNo = $("#VoucherNoCharge" + i).val();
                chargesingleModel.TrNo = $("#TrNo" + i).val();
                chargesingleModel.IsPosted = $("#IsPosted" + i).prop("checked");
                chargesingleModel.RefInvoiceDate = $("#txtInvoiceDateCharge" + i).val();
                chargesingleModel.VendorID = $("#txtVendorCharge" + i).val();
                if ($("#txt_D_CashBox" + i).val() == "Null") {
                    chargesingleModel.CashBoxID = 0;
                }
                else {
                    chargesingleModel.CashBoxID = $("#txt_D_CashBox" + i).val();
                }
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
                chargesingleModel.VatType = $('#txtVatType' + i).val(); //
                chargesingleModel.VatPrc = Number($("#txtVatType" + i).attr('data-VatPerc'));
                chargesingleModel.VatAmount = $("#txtVatCharge" + i).val();
                chargesingleModel.NetAtferVat = $("#txtValueAfterVatCharge" + i).val();
                var ispaid = $("#txtVendorIsCheckCharge" + i).val();
                if (ispaid == "0") {
                    chargesingleModel.isPaidByVendor = true;
                }
                else {
                    chargesingleModel.isPaidByVendor = false;
                }
                chargesingleModel.RefInvoiceNo = $("#txtInvoiceNumberCharge" + i).val();
                chargesingleModel.ChRemarks = $("#RemarksCharge" + i).val();
                chargesingleModel.VoucherNo = $("#VoucherNoCharge" + i).val();
                chargesingleModel.TrNo = $("#TrNo" + i).val();
                chargesingleModel.IsPosted = $("#IsPosted" + i).prop("checked");
                chargesingleModel.RefInvoiceDate = $("#txtInvoiceDateCharge" + i).val();
                chargesingleModel.VendorID = $("#txtVendorCharge" + i).val();
                if ($("#txt_D_CashBox" + i).val() == "Null") {
                    chargesingleModel.CashBoxID = 0;
                }
                else {
                    chargesingleModel.CashBoxID = $("#txt_D_CashBox" + i).val();
                }
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
            success: function (d) {
                var result = d;
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
        DepositDetailsModel = new Array();
        ListOp_Deposit_SalItem = new ListOperationDepositDetail();
        var StatusFlag;
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
                DepositsingleModel.DepositDate = $('#DepositDate' + i).val(); //
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
                DepositsingleModel.DepositDate = $('#DepositDate' + i).val(); //
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
            success: function (d) {
                var result = d;
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
    function Processes_under_preparing() {
        $("#btnfinish").attr("disabled", "disabled");
        $("#btnfinish").removeClass('btn-red');
        $("#btnfinish").addClass('display_none');
        $("#btnClose").removeClass('display_none');
        $("#open_Trill").attr("disabled", "disabled").off('click');
        $("#open_Trill").addClass("disabledDiv");
        $("#divProcessClose").attr("disabled", "disabled").off('click');
        $("#divProcessClose").addClass("disabledDiv");
        $("#data_lebel").attr("disabled", "disabled").off('click');
        $("#data_lebel").addClass("disabledDiv");
        $('#divlepRentdata_3').addClass('display_none');
        $('#spanlepRentdata_3').toggleClass('fa-angle-double-left');
        $('#spanlepRentdata_3').toggleClass('fa-angle-double-down');
        $('#lepRentdata').addClass('display_none');
        $('#spanlepRentdata_4').toggleClass('fa-angle-double-left');
        $('#spanlepRentdata_4').toggleClass('fa-angle-double-down');
        $('#lepMoney').addClass('display_none');
        $('#spanlepMoney_4').toggleClass('fa-angle-double-left');
        $('#spanlepMoney_4').toggleClass('fa-angle-double-down');
        $('#divlOerSalesman_2').addClass('display_none');
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
        // $("#btnOpen").attr("style", "")
        $("#btnOpen").removeClass("btn-dark-green");
        $("#btnClose").attr("disabled", "disabled").off('click');
        $("#btnPresent").removeAttr("disabled");
        // $("#btnClose").attr("style", "");
        $("#btnClose").removeClass("btn-red");
        //$("#btnPresent").attr("style", "background-color: #198754")
        $("#btnPresent").addClass("btn-green");
        if (ddlTrtype.value == '1') {
            $("#btnClose").addClass('display_none');
            $("#btnfinish").removeClass('display_none');
            $('#DivInformationCloce').addClass('display_none');
        }
        else {
            $("#btnfinish").addClass('display_none');
            $("#btnClose").removeClass('display_none');
            $('#DivInformationCloce').addClass('display_none');
        }
    }
    function Processes_Ready() {
        $("#btnfinish").attr("disabled", "disabled");
        $("#btnfinish").removeClass('btn-red');
        $("#btnfinish").addClass('display_none');
        $("#btnClose").removeClass('display_none');
        $("#divProcessClose").attr("disabled", "disabled").off('click');
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
        $('#lepRentdata').addClass('display_none');
        $('#spanlepRentdata_4').toggleClass('fa-angle-double-left');
        $('#spanlepRentdata_4').toggleClass('fa-angle-double-down');
        $('#lepMoney').addClass('display_none');
        $('#spanlepMoney_4').toggleClass('fa-angle-double-left');
        $('#spanlepMoney_4').toggleClass('fa-angle-double-down');
        $('#divlOerSalesman_2').addClass('display_none');
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
        if (ddlTrtype.value == '1') {
            $("#btnClose").addClass('display_none');
            $("#btnfinish").removeClass('display_none');
            $('#DivInformationCloce').addClass('display_none');
        }
        else {
            $("#btnfinish").addClass('display_none');
            $("#btnClose").removeClass('display_none');
            $('#DivInformationCloce').addClass('display_none');
        }
    }
    function Processes_Open() {
        $("#btnfinish").attr("disabled", "disabled");
        $("#btnfinish").addClass('display_none');
        $("#btnClose").removeClass('display_none');
        $("#div_Master").attr("disabled", "disabled").off('click');
        $("#div_Master").addClass("disabledDiv");
        //$("#DivShow").attr("disabled", "disabled").off('click');
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
        $('#divlepRentdata_3').addClass('display_none');
        $('#spanlepRentdata_3').toggleClass('fa-angle-double-left');
        $('#spanlepRentdata_3').toggleClass('fa-angle-double-down');
        //$('#lepRentdata').addClass('display_none');
        //$('#spanlepRentdata_4').toggleClass('fa-angle-double-left');
        //$('#spanlepRentdata_4').toggleClass('fa-angle-double-down');
        //$('#lepMoney').addClass('display_none');
        //$('#spanlepMoney_4').toggleClass('fa-angle-double-left');
        //$('#spanlepMoney_4').toggleClass('fa-angle-double-down');
        btnUpdate_1.classList.remove('display_none');
        btnUpdate_2.classList.remove('display_none');
        btnUpdate_3.classList.remove('display_none');
        btnUpdate_4.classList.add('display_none');
        btnUpdate_5.classList.remove('display_none');
        btnUpdate_1.removeAttribute('disabled');
        btnUpdate_5.removeAttribute('disabled');
        btnUpdate_3.removeAttribute('disabled');
        $("#btnPresent").attr("disabled", "disabled").off('click');
        $("#btnOpen").attr("disabled", "disabled").off('click');
        //  $("#btnOpen").attr("style", "")
        $("#btnOpen").removeClass("btn-dark-green");
        //  $("#btnPresent").attr("style", "margin-right: 8%;")
        $("#btnClose").removeAttr("disabled");
        // $("#btnClose").attr("style", "background-color: #fdb0b0;");
        $("#btnClose").addClass("btn-red");
        $("#id_Lapl_Salesman").html('<i class="glyphicon glyphicon-hand-down"></i> &gt;&gt;  ' + (lang == "ar" ? ' الاصناف لدي المناديب   ' : ' Items I have SalesMan  ') + '   &lt;&lt; <i class="glyphicon glyphicon-hand-down"></i>');
        if (SysSession.CurrentPrivileges.CUSTOM1 == false) {
            btnClose.disabled = true;
        }
        else {
            btnClose.disabled = false;
        }
        //if (ddlTrtype.value == '1') {
        //    btnClose.innerHTML = 'اغلاق الارساليات';
        //}
        //else {
        //    btnClose.innerHTML = 'تجهيز الاغلاق';
        //}
        if (ddlTrtype.value == '1') {
            $("#btnClose").addClass('display_none');
            $("#btnfinish").removeClass('display_none');
            $("#btnfinish").removeAttr("disabled");
            $("#btnfinish").addClass('btn-red');
            $('#DivInformationCloce').removeClass('display_none');
        }
        else {
            $("#btnfinish").addClass('display_none');
            $("#btnClose").removeClass('display_none');
            $('#DivInformationCloce').addClass('display_none');
        }
    }
    function Processes_Close() {
        $("#btnfinish").attr("disabled", "disabled");
        $("#btnfinish").removeClass('btn-red');
        $("#btnfinish").addClass('display_none');
        $("#btnClose").removeClass('display_none');
        $("#div_Master").attr("disabled", "disabled").off('click');
        $("#div_Master").addClass("disabledDiv");
        //$("#DivShow").attr("disabled", "disabled").off('click');
        //$("#DivShow").addClass("disabledDiv");
        $("#data_lebel").attr("disabled", "disabled").off('click');
        $("#data_lebel").addClass("disabledDiv");
        $("#open_Trill").attr("disabled", "disabled").off('click');
        $("#open_Trill").addClass("disabledDiv");
        $("#divProcessClose").attr("disabled", "disabled").off('click');
        $("#divProcessClose").addClass("disabledDiv");
        btnUpdate_1.classList.add('display_none');
        btnUpdate_2.classList.add('display_none');
        btnUpdate_3.classList.add('display_none');
        btnUpdate_4.classList.add('display_none');
        btnUpdate_5.classList.add('display_none');
        $("#btnPresent").attr("disabled", "disabled").off('click');
        $("#btnClose").attr("disabled", "disabled").off('click');
        //   $("#btnPresent").attr("style", " margin-right: 8%;")
        //   $("#btnClose").attr("style", " ")
        $("#btnClose").removeClass("btn-red");
        OerSalesmanGrid_Detail.DataSource = AllGetOperationMasterDetailModel.TR_OperationSalesmanItem;
        OerSalesmanGrid_Detail.Bind();
        $("#id_Lapl_Salesman").html('<i class="glyphicon glyphicon-hand-down"></i> &gt;&gt;  ' + (lang == "ar" ? ' الاصناف لدي المناديب   ' : ' Items I have SalesMan  ') + '   &lt;&lt; <i class="glyphicon glyphicon-hand-down"></i>');
        if (SysSession.CurrentPrivileges.CUSTOM2 == false) {
            $("#btnOpen").attr("disabled", "disabled");
            // $("#btnOpen").attr("style", "")
            $("#btnOpen").removeClass("btn-dark-green");
            $('#divlepRentdata_3').addClass('display_none');
            $('#spanlepRentdata_3').toggleClass('fa-angle-double-left');
            $('#spanlepRentdata_3').toggleClass('fa-angle-double-down');
            $("#Processshutdown").attr("disabled", "disabled").off('click');
        }
        else {
            btnClose.disabled = false;
            $("#btnOpen").removeAttr("disabled");
            // $("#btnOpen").attr("style", "background-color:   ")
            $("#btnOpen").addClass("btn-dark-green");
        }
        if (ddlTrtype.value == '1') {
            $("#btnClose").addClass('display_none');
            $("#btnfinish").removeClass('display_none');
            $('#DivInformationCloce').removeClass('display_none');
        }
        else {
            $("#btnfinish").addClass('display_none');
            $("#btnClose").removeClass('display_none');
            $('#DivInformationCloce').addClass('display_none');
        }
    }
    //-------------------------------------------------------button---Processes--------------------------------------
    function btnOpen_onclick() {
        debugger;
        if (Status == 4 || Status == 3) {
            Ajax.Callsync({
                type: "Get",
                url: sys.apiUrl("Processes", "OpenOperation"),
                data: { OperationID: OperationID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
                success: function (d) {
                    var result = d;
                    if (result.IsSuccess) {
                        ddlStateType.value = '111';
                        DisplayMassage("تم فتح عملية بنجاح", "Operation added successfully", MessageType.Succeed);
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
                            $('#lepRentdata').removeClass('display_none');
                            $('#spanlepRentdata_4').toggleClass('fa-angle-double-left');
                            $('#spanlepRentdata_4').toggleClass('fa-angle-double-down');
                            $('#lepMoney').removeClass('display_none');
                            $('#spanlepMoney_4').toggleClass('fa-angle-double-left');
                            $('#spanlepMoney_4').toggleClass('fa-angle-double-down');
                            Processes_Open();
                            Status = 2;
                            $('#txtStatus').val('مفتوحة');
                        }
                        btnBack_1_onclick();
                        flag_Back = false;
                    }
                    else {
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
                document.body.scrollTop = 800;
                document.documentElement.scrollTop = 800;
                btnUpdate_2.focus();
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
        if (Status == 2) {
            var AvailableQty = false;
            OerSalesmanGrid_Detail.DataSource = AllGetOperationMasterDetailModel.TR_OperationSalesmanItem;
            OerSalesmanGrid_Detail.Bind();
            SalesmanItem_AllAssign(AllGetOperationMasterDetailModel.TR_OperationSalesmanItem);
            $("#id_Lapl_Salesman").html('<i class="glyphicon glyphicon-hand-down"></i> &gt;&gt;  ' + (lang == "ar" ? ' الاصناف لدي المناديب   ' : ' Items I have SalesMan  ') + '   &lt;&lt; <i class="glyphicon glyphicon-hand-down"></i>');
            $("#Financialsituation").removeAttr("disabled");
            $("#Div_Money").removeAttr("disabled");
            $('#lepRentdata').removeClass('display_none');
            $('#spanlepRentdata_4').addClass('fa-angle-double-down');
            $('#lepMoney').removeClass('display_none');
            $('#spanlepMoney_4').addClass('fa-angle-double-down');
            var cnt = 1;
            var ii = 0;
            $("#OerSalesmanGrid_Detail").jsGrid("option", "pageIndex", cnt);
            for (var i = 0; i < AllGetOperationMasterDetailModel.TR_OperationSalesmanItem.length; i++) {
                if (ii > 15) {
                    cnt += 1;
                    $("#OerSalesmanGrid_Detail").jsGrid("option", "pageIndex", cnt);
                    ii = 0;
                }
                var id = AllGetOperationMasterDetailModel.TR_OperationSalesmanItem[i].OperationSalesmanItemID;
                if ($("#OnhandQty" + id).val() != '0' && $("#OnhandQty" + id).val() != null) {
                    AvailableQty = true;
                    Errorinput($("#OnhandQty" + id));
                }
                ii++;
            }
            if (AvailableQty == true) {
                DisplayMassage("يجب ان تكون الكمية المتبقية = صفر", "The remaining amount should be = 0!", MessageType.Worning);
                btnUpdate_5.focus();
                Update_5_onclick();
            }
            //else if ($('#lab_Close_CashOnhand').text() != '0') {
            //    DisplayMassage(" يجب ان يكون النقدي لدي المندوب = صفر", "The delegate's cash must be = 0!", MessageType.Worning);
            //    btnUpdate_5.focus();
            //    Update_5_onclick();
            //    Errorinput($("#lab_Close_CashOnhand"));
            //}
            else {
                debugger;
                //$("#Processshutdown").removeAttr("disabled");
                //$('#divlepRentdata_3').removeClass('display_none');
                //$('#spanlepRentdata_3').toggleClass('fa-angle-double-left');
                //$('#spanlepRentdata_3').toggleClass('fa-angle-double-down');
                //btnUpdate_4.classList.remove('display_none');
                //btnUpdate_4.focus();
                //Update_4_onclick();
                //btnBack_2_onclick();
                //btnBack_3_onclick();
                //btnBack_5_onclick();
                //btnUpdate_2.disabled = true;
                //btnUpdate_3.disabled = true;
                //btnUpdate_5.disabled = true;
                Ajax.Callsync({
                    type: "Get",
                    url: sys.apiUrl("Processes", "closingprocessingon"),
                    data: { OperationID: OperationIDglopel, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
                    success: function (d) {
                        var result = d;
                        if (result.Response) {
                            ddlStateType.value = '111';
                            DisplayMassage("تم تجهيز اغلاق  العملية بنجاح", "Operation added successfully", MessageType.Succeed);
                            flag_Success_5 = true;
                            $('#txtUpdatedBy').val(SysSession.CurrentEnvironment.UserCode);
                            $('#txtUpdatedAt').val(DateTimeFormat(Date().toString()));
                            Display();
                            Selected_Data = new Array();
                            Selected_Data = Get_IQ_GetOperation.filter(function (x) { return x.OperationID == Number(divMasterGrid.SelectedKey); });
                            $("#div_Master_Hedr").removeClass("display_none");
                            DisplayData(Selected_Data);
                            if (Selected_Data[0].Status == 0) { // تحت التجهيز
                                Processes_under_preparing();
                            }
                            else if (Selected_Data[0].Status == 1) { //جاهز
                            }
                            else if (Selected_Data[0].Status == 2) { //مفتوحة
                                Processes_Open();
                            }
                            else if (Selected_Data[0].Status == 3) { //مغلق
                                Processes_Close();
                            }
                            else if (Selected_Data[0].Status == 4) { //تحت الاغلاق
                                debugger;
                                Processes_Close();
                                $('#btnClose').attr('disabled', 'disabled');
                                //NewClose();
                            }
                            flag_Add = false;
                            flag_Success_5 = false;
                        }
                        else {
                            DisplayMassage("خطأء!", "Error!", MessageType.Worning);
                        }
                    }
                });
            }
        }
        else {
            DisplayMassage("يجب ان تكون العمليه مفتوحه", "The process must be open!", MessageType.Worning);
        }
    }
    function CloseNew() {
        $("#id_Lapl_Salesman").html('<i class="glyphicon glyphicon-hand-down"></i> &gt;&gt;  ' + (lang == "ar" ? ' الاصناف لدي المناديب   ' : ' Items I have SalesMan  ') + '   &lt;&lt; <i class="glyphicon glyphicon-hand-down"></i>');
        $("#Financialsituation").removeAttr("disabled");
        $("#Div_Money").removeAttr("disabled");
        $('#lepRentdata').removeClass('showdiv');
        $('#spanlepRentdata_4').addClass('fa-angle-double-down');
        $('#lepMoney').removeClass('showdiv');
        $('#spanlepMoney_4').addClass('fa-angle-double-down');
        $("#div_Master").attr("disabled", "disabled").off('click');
        $("#div_Master").addClass("disabledDiv");
        btnUpdate_1.classList.remove("display_none");
        btnSave_1.classList.add("display_none");
        btnBack_1.classList.add("display_none");
        DocumentActions.RenderFromModel(Selected_Data[0]);
        var trDate = DateFormat(Selected_Data[0].TrDate);
        $('#txtDate').val(trDate);
        Status = Selected_Data[0].Status;
        var OpenAt = DateFormat(Selected_Data[0].OpenAt);
        if (OpenAt != null) {
            $('#txtdateopening').val(OpenAt);
        }
        else {
            $('#txtdateopening').val(GetDate());
        }
        //$('#ddlVendor').prop("value", Selected_Data[0].VendorID);
        $('#ddlVendor option[value=' + Selected_Data[0].VendorID + ']').prop('selected', 'selected').change();
        $('#txtNationality').prop("value", Selected_Data[0].NationalityID);
        $('#ddlTrtype').prop("value", Selected_Data[0].Trtype);
        $('#ddlSalesman option[value=' + Selected_Data[0].SalesmanId + ']').prop('selected', 'selected').change();
        $("#open_Trill").attr("disabled", "disabled").off('click');
        $("#open_Trill").addClass("disabledDiv");
        Update_1 = false;
        debugger;
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
        btnUpdate_2.disabled = true;
        btnUpdate_3.disabled = true;
        btnUpdate_5.disabled = true;
        Calculation_Close();
        DisabledToolBar();
        $("#Processshutdown").removeAttr("disabled");
        $('#divlepRentdata_3').removeClass('display_none');
        $('#spanlepRentdata_3').toggleClass('fa-angle-double-left');
        $('#spanlepRentdata_3').toggleClass('fa-angle-double-down');
        $("#divProcessClose").removeClass("disabledDiv");
    }
    function btnfinish_onclick() {
        if (Status == 2) {
            var AvailableQty = false;
            OerSalesmanGrid_Detail.DataSource = AllGetOperationMasterDetailModel.TR_OperationSalesmanItem;
            OerSalesmanGrid_Detail.Bind();
            SalesmanItem_AllAssign(AllGetOperationMasterDetailModel.TR_OperationSalesmanItem);
            $("#id_Lapl_Salesman").html('<i class="glyphicon glyphicon-hand-down"></i> &gt;&gt;  ' + (lang == "ar" ? ' الاصناف لدي المناديب   ' : ' Items I have SalesMan  ') + '   &lt;&lt; <i class="glyphicon glyphicon-hand-down"></i>');
            $("#Financialsituation").removeAttr("disabled");
            $("#Div_Money").removeAttr("disabled");
            $('#lepRentdata').removeClass('display_none');
            $('#spanlepRentdata_4').addClass('fa-angle-double-down');
            $('#lepMoney').removeClass('display_none');
            $('#spanlepMoney_4').addClass('fa-angle-double-down');
            var cnt = 1;
            var ii = 0;
            $("#OerSalesmanGrid_Detail").jsGrid("option", "pageIndex", cnt);
            for (var i = 0; i < AllGetOperationMasterDetailModel.TR_OperationSalesmanItem.length; i++) {
                if (ii > 15) {
                    cnt += 1;
                    $("#OerSalesmanGrid_Detail").jsGrid("option", "pageIndex", cnt);
                    ii = 0;
                }
                var id = AllGetOperationMasterDetailModel.TR_OperationSalesmanItem[i].OperationSalesmanItemID;
                if ($("#OnhandQty" + id).val() != '0' && $("#OnhandQty" + id).val() != null) {
                    AvailableQty = true;
                    Errorinput($("#OnhandQty" + id));
                }
                ii++;
            }
            debugger;
            if (ddlTrtype.value == '1') {
                if (Number($("#txtTotal").val()) != Number($("#txtPaperPurchaseValue").val())) {
                    DisplayMassage("يجب ان يكون قيمة البضائع المسجلة = اجمالي الحمولة", "must enter lowest price !", MessageType.Worning);
                    Errorinput($("#txtTotal"));
                    Errorinput($("#txtPaperPurchaseValue"));
                    return false;
                }
            }
            if (AvailableQty == true) {
                DisplayMassage("يجب ان تكون الكمية المتبقية = صفر", "The remaining amount should be = 0!", MessageType.Worning);
                btnUpdate_5.focus();
                Update_5_onclick();
            }
            else {
                $('#btnfinish').attr('style', 'width: 104%;');
                $('#btnfinish').html(' جاري الاغلاق <span class="glyphicon glyphicon-file"></span>  <i class="fa fa-spinner fa-spin lod  Loading" style="font-size: 195% !important;z-index: 99999;"></i>');
                $('#btnfinish').attr('disabled', 'disabled');
                debugger;
                setTimeout(function () {
                    Ajax.Callsync({
                        type: "Get",
                        url: sys.apiUrl("Processes", "closingprocessingonNew"),
                        data: { OperationID: OperationIDglopel, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
                        success: function (d) {
                            var result = d;
                            if (result.Response) {
                                ddlStateType.value = '111';
                                //DisplayMassage("تم تجهيز اغلاق  العملية بنجاح", "Operation added successfully", MessageType.Succeed);
                                flag_Success_5 = true;
                                $('#txtUpdatedBy').val(SysSession.CurrentEnvironment.UserCode);
                                $('#txtUpdatedAt').val(DateTimeFormat(Date().toString()));
                                Display();
                                Selected_Data = new Array();
                                Selected_Data = Get_IQ_GetOperation.filter(function (x) { return x.OperationID == Number(divMasterGrid.SelectedKey); });
                                $("#div_Master_Hedr").removeClass("display_none");
                                DisplayData(Selected_Data);
                                if (Selected_Data[0].Status == 0) { // تحت التجهيز
                                    Processes_under_preparing();
                                }
                                else if (Selected_Data[0].Status == 1) { //جاهز
                                }
                                else if (Selected_Data[0].Status == 2) { //مفتوحة
                                    Processes_Open();
                                }
                                else if (Selected_Data[0].Status == 3) { //مغلق
                                    Processes_Close();
                                }
                                else if (Selected_Data[0].Status == 4) { //تحت الاغلاق
                                    debugger;
                                    Processes_Close();
                                    $('#btnClose').attr('disabled', 'disabled');
                                }
                                CloseNew();
                                flag_Add = false;
                                flag_Success_5 = false;
                                $('#btnfinish').attr('style', '');
                                $('#btnfinish').html(' اغلاق الارساليات');
                                $('#btnfinish').removeAttr('disabled');
                            }
                            else {
                                DisplayMassage("خطأء!", "Error!", MessageType.Worning);
                            }
                        }
                    });
                }, 200);
            }
        }
        else {
            DisplayMassage("يجب ان تكون العمليه مفتوحه", "The process must be open!", MessageType.Worning);
        }
    }
    function btnClose_Focus_onclick() {
        //$('#txtStatus').val(" مفتوحة");
        //Status = 2;
        //ddlSalesman.focus();
        $('html, body').animate({
            scrollTop: $("#txtClose_AdjustmentRemarks").offset().top
        }, 2000);
        //btnUpdate_2.focus();
    }
    function btnView_load_onclick() {
        //$('html, body').animate({
        //    scrollTop: $("#txtGoods_Desc").offset().top
        //}, 2000);
        document.body.scrollTop = 800;
        document.documentElement.scrollTop = 800;
        btnUpdate_2.focus();
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
        if (!SysSession.CurrentPrivileges.AddNew)
            return;
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
        $('#lepRentdata').addClass('display_none');
        $('#spanlepRentdata_4').toggleClass('fa-angle-double-left');
        $('#spanlepRentdata_4').toggleClass('fa-angle-double-down');
        $('#lepMoney').addClass('display_none');
        $('#spanlepMoney_4').toggleClass('fa-angle-double-left');
        $('#spanlepMoney_4').toggleClass('fa-angle-double-down');
        $('#divlOerSalesman_2').addClass('display_none');
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
        //  $("#btnPresent").attr("style", "  margin-right: 8%;")
        //$("#btnClose").attr("style", "")
        $("#btnClose").removeClass("btn-red");
        $("#btnOpen").attr("disabled", "disabled").off('click');
        $("#btnOpen").removeClass("btn-dark-green");
        //$("#txtNumber").removeAttr("disabled");
        $("#txtDate").removeAttr("disabled");
        //$("#txtReferenceNumber").removeAttr("disabled");
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
        Back();
        DisabledToolBar();
        btnfinish.classList.add("display_none");
    }
    function Update_1_onclick() {
        if (!SysSession.CurrentPrivileges.EDIT)
            return;
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
        btnBack_3_onclick();
        btnBack_2_onclick();
        if (Status == 2) { //مفتوحة 
            btnBack_5_onclick();
        }
        if (Status == 0) { //تحت التجهيز 
        }
        //(x1 == true) ?  : $("#div_Master").addClass("disabledDiv");
        DisabledToolBar();
    }
    function btnBack_1_onclick() {
        debugger;
        if (flag_Add == true) {
            debugger;
            if (flag_succ_insert == true) {
                debugger;
                $("#div_Master").attr("disabled", "disabled").off('click');
                $("#div_Master").addClass("disabledDiv");
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
                debugger;
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
            debugger;
            if (flag_Back == true) {
                //  debugger
                debugger;
                $("#div_Master").attr("disabled", "disabled").off('click');
                $("#div_Master").addClass("disabledDiv");
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
                debugger;
                $("#div_Master").attr("disabled", "disabled").off('click');
                $("#div_Master").addClass("disabledDiv");
                btnUpdate_1.classList.remove("display_none");
                btnSave_1.classList.add("display_none");
                btnBack_1.classList.add("display_none");
                //*************************************************************************************
                DocumentActions.RenderFromModel(Selected_Data[0]);
                debugger;
                var trDate = DateFormat(Selected_Data[0].TrDate);
                $('#txtDate').val(trDate);
                txt_tax.value = Selected_Data[0].VatType == 0 ? 'null' : Selected_Data[0].VatType.toString();
                txtVatPrc.value = setVal(Selected_Data[0].VatPrc.toString());
                txtVatAmount.value = Selected_Data[0].VatAmount.toString();
                Status = Selected_Data[0].Status;
                var OpenAt = DateFormat(Selected_Data[0].OpenAt);
                if (OpenAt != null) {
                    $('#txtdateopening').val(OpenAt);
                }
                else {
                    $('#txtdateopening').val(GetDate());
                }
                $('#txtClearanceDate').val(DateFormat(Selected_Data[0].ClearanceDate));
                //$('#ddlVendor').prop("value", Selected_Data[0].VendorID);
                $('#ddlVendor option[value=' + Selected_Data[0].VendorID + ']').prop('selected', 'selected').change();
                $('#txtNationality').prop("value", Selected_Data[0].NationalityID);
                $('#ddlTrtype').prop("value", Selected_Data[0].Trtype);
                $('#ddlSalesman option[value=' + Selected_Data[0].SalesmanId + ']').prop('selected', 'selected').change();
                $("#open_Trill").attr("disabled", "disabled").off('click');
                $("#open_Trill").addClass("disabledDiv");
            }
            debugger;
            RemoveDisabledToolBar();
        }
        debugger;
        Update_1 = false;
        disabled_divMasterGridiv();
        //divGridDetails_onclick();
    }
    function btnSave_1_onclick() {
        loading('btnsave');
        setTimeout(function () {
            finishSave('btnsave');
            if (!ValidationHeader())
                return;
            Assign_1_Processes();
            if (FlagIns_Operation == true) { //Insert
                // 
                Insert_1_Processes();
            }
            else { // Update 
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
        if (!SysSession.CurrentPrivileges.EDIT)
            return;
        btnUpdate_2.classList.add("display_none");
        btnSave_2.classList.remove("display_none");
        btnBack_2.classList.remove("display_none");
        //$("#DivShow").removeClass("disabledDiv");
        $("#DivHederMaster").attr("disabled", "disabled").off('click');
        $("#DivHederMaster").addClass("disabledDiv");
        $("#div_MasterGird").addClass("disabledDiv");
        if (Status == 2) {
            $("#btnAddDetails").addClass("display_none");
            $(".fontitm6Processes").addClass("display_none");
            for (var i = 0; i < AllGetOperationMasterDetailModel.IQ_GetOperationItemInfo.length; i++) {
                $("#txtPrice" + i).removeAttr("disabled");
                $("#txtMinPrice" + i).removeAttr("disabled");
                $("#txtQuantity" + i).removeAttr("disabled");
                $("#txtRemark_item" + i).removeAttr("disabled");
                //$("#txtScrapQty" + i).removeAttr("disabled");
                $("#btnAddDetails").removeClass("display_none");
            }
        }
        else {
            $("#btnAddDetails").removeClass("display_none");
            $(".fontitm6Processes").removeClass("display_none");
            remove_disabled_Grid_Controls();
        }
        Update_2 = true;
        if (Status == 2) { //مفتوحة
            btnBack_5_onclick();
            btnBack_3_onclick();
            btnBack_1_onclick();
        }
        else {
            btnBack_1_onclick();
            btnBack_3_onclick();
        }
        DisabledToolBar();
    }
    function btnBack_2_onclick() {
        if (flag_Add == true) {
            //$("#DivShow").attr("disabled", "disabled").off('click');
            //$("#DivShow").addClass("disabledDiv")
            $("#btnAddDetails").addClass("display_none");
            btnUpdate_2.classList.remove("display_none");
            btnSave_2.classList.add("display_none");
            btnBack_2.classList.add("display_none");
            $("#div_Data").html('');
            CountGrid = -1;
        }
        else {
            if (flag_Success_2 == true) {
                //$("#DivShow").attr("disabled", "disabled").off('click');
                //$("#DivShow").addClass("disabledDiv")
                $("#btnAddDetails").addClass("display_none");
                $(".fontitm6Processes").addClass("display_none");
                btnUpdate_2.classList.remove("display_none");
                btnSave_2.classList.add("display_none");
                btnBack_2.classList.add("display_none");
                disabled_Grid_Controls();
                flag_Success_2 = false;
                Display();
                MasterGridBiuld();
                flag_Success_2 = false;
            }
            else {
                //$("#DivShow").attr("disabled", "disabled").off('click');
                //$("#DivShow").addClass("disabledDiv")
                $("#btnAddDetails").addClass("display_none");
                btnUpdate_2.classList.remove("display_none");
                btnSave_2.classList.add("display_none");
                btnBack_2.classList.add("display_none");
                $("#div_Data").html('');
                CountGrid = -1;
                for (var i = 0; i < AllGetOperationMasterDetailModel.IQ_GetOperationItemInfo.length; i++) {
                    BuildControls(i);
                    Disbly_BuildControls(i, AllGetOperationMasterDetailModel.IQ_GetOperationItemInfo);
                    CountGrid = i;
                }
            }
        }
        Update_2 = false;
        disabled_divMasterGridiv();
        ComputeTotals();
        //divGridDetails_onclick();
        RemoveDisabledToolBar();
    }
    function btnSave_2_onclick() {
        loading('btnsave');
        setTimeout(function () {
            finishSave('btnsave');
            var CanAdd = true;
            if (CountGrid < 0) {
                DisplayMassage(" برجاء ادخال بيانات الحمولة", "Please enter the payload data", MessageType.Worning);
                Errorinput(btnAddDetails);
                CanAdd = false;
            }
            if (ddlTrtype.value == '1') {
                if (Number($("#txtTotal").val()) != Number($("#txtPaperPurchaseValue").val())) {
                    DisplayMassage("يجب ان يكون قيمة البضائع المسجلة = اجمالي الحمولة", "must enter lowest price !", MessageType.Worning);
                    Errorinput($("#txtTotal"));
                    Errorinput($("#txtPaperPurchaseValue"));
                    return false;
                }
            }
            else {
                if (CountGrid > -1) {
                    for (var i = 0; i <= CountGrid; i++) {
                        CanAdd = Validation_Grid(i);
                        if (CanAdd == false) {
                            break;
                        }
                    }
                }
            }
            if (CanAdd) {
                Assign_2_items();
                if (Status == 2) { //مفتوحة
                    Update_2_items_Open();
                }
                else {
                    Update_2_items();
                }
                btnBack_2_onclick();
            }
        }, 100);
    }
    function Update_3_onclick() {
        if (!SysSession.CurrentPrivileges.EDIT)
            return;
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
        $("#div_MasterGird").addClass("disabledDiv");
        Update_3 = true;
        btnBack_1_onclick();
        //btnBack_2_onclick();
        btnBack_2_onclick();
        if (Status == 2) { //مفتوحة
            btnBack_5_onclick();
        }
        if (Status == 0) { //مفتوحة
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
            var CanAddCharge = true;
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
        if (!SysSession.CurrentPrivileges.EDIT)
            return;
        btnUpdate_4.classList.add("display_none");
        btnSave_4.classList.remove("display_none");
        btnBack_4.classList.remove("display_none");
        $("#divProcessClose").removeClass("disabledDiv");
        $("#DivHederMaster").attr("disabled", "disabled").off('click');
        $("#DivHederMaster").addClass("disabledDiv");
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
            $("#btnPresent").attr("disabled", "disabled").off('click');
            $("#btnClose").attr("disabled", "disabled").off('click');
            //    $("#btnPresent").attr("style", "  margin-right: 8%;");
            // $("#btnClose").attr("style", "")
            $("#btnClose").removeClass("btn-red");
            $("#btnView_load").focus();
            Display();
            MasterGridBiuld();
            flag_Back = false;
        }
        else {
            $("#divProcessClose").attr("disabled", "disabled").off('click');
            $("#divProcessClose").addClass("disabledDiv");
            //btnUpdate_4.classList.remove("display_none");
            btnSave_4.classList.add("display_none");
            btnBack_4.classList.add("display_none");
            DocumentActions.RenderFromModel(Selected_Data[0]);
            var trDate = DateFormat(Selected_Data[0].TrDate);
            $('#txtDate').val(trDate);
            //txtDateHeader.value = trDate;
            $('#txtClearanceDate').val(DateFormat(Selected_Data[0].ClearanceDate));
            $('#txtdateopening').val(DateFormat(Selected_Data[0].OpenAt));
            $('#txtStatus').val(Selected_Data[0].Status_DescA);
            Status = Selected_Data[0].Status;
            //$('#ddlVendor').prop("value", Selected_Data[0].VendorID);
            $('#ddlVendor option[value=' + Selected_Data[0].VendorID + ']').prop('selected', 'selected').change();
            $('#txtNationality').prop("value", Selected_Data[0].NationalityID);
            $('#ddlTrtype').prop("value", Selected_Data[0].Trtype);
            $('#ddlSalesman option[value=' + Selected_Data[0].SalesmanId + ']').prop('selected', 'selected').change();
            $('#div_Master').removeClass('disabledDiv');
            $("#div_Master").attr("disabled", "disabled").off('click');
            $("#div_Master").addClass("disabledDiv");
            BindGetOperationItemsGridData(Selected_Data[0].OperationID);
            OperationID = Selected_Data[0].OperationID;
            var Close_TrDate = DateFormat(Selected_Data[0].Close_TrDate);
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
            $('#Close_AllAfterTotalSaleVAT').text((Number(AfterTotalSalesCreditVAT) + Number(AfterTotalSalesCashVAT)).RoundToSt(2));
            //$("#btnClose").focus();
            $("#Processshutdown").attr("disabled", "disabled").off('click');
            $('#divlepRentdata_3').addClass('display_none');
            $('#spanlepRentdata_3').toggleClass('fa-angle-double-left');
            $('#spanlepRentdata_3').toggleClass('fa-angle-double-down');
            btnUpdate_2.disabled = false;
            btnUpdate_3.disabled = false;
            btnUpdate_5.disabled = false;
        }
        Update_4 = false;
        disabled_divMasterGridiv();
        //divGridDetails_onclick();
        RemoveDisabledToolBar();
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }
    function btnSave_4_onclick() {
        loading('btnsave');
        setTimeout(function () {
            finishSave('btnsave');
            if (!ValidationClose())
                return;
            FlagIns_Operation = false;
            Status = 3;
            Assign_1_Processes();
            Update_1_Processes();
            btnBack_4_onclick();
            flag_Back = false;
        }, 100);
    }
    function Update_5_onclick() {
        if (!SysSession.CurrentPrivileges.EDIT)
            return;
        btnUpdate_5.classList.add("display_none");
        btnSave_5.classList.remove("display_none");
        btnBack_5.classList.remove("display_none");
        btnAddDetailslebel.classList.remove("display_none");
        btnAddDetailslebel.focus();
        $("#data_lebel").removeClass("disabledDiv");
        $(".lebelminus").removeClass("display_none");
        $("#DivHederMaster").attr("disabled", "disabled").off('click');
        $("#DivHederMaster").addClass("disabledDiv");
        $("#div_MasterGird").addClass("disabledDiv");
        Update_5 = true;
        if (Status == 2) { //مفتوحة
            btnBack_2_onclick();
            btnBack_3_onclick();
            btnBack_1_onclick();
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
            }
            catch (e) {
                alert('NO');
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
            var CanAddDeposit = true;
            if (CountGridDeposit > 0) {
                for (var i = 0; i < CountGridDeposit; i++) {
                    CanAddDeposit = ValidationDeposit_Grid(i);
                    if (CanAddDeposit == false) {
                        break;
                    }
                }
            }
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
        $('#ddlTrtype').val('0');
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
            $("#txtRemark_item" + i).removeAttr("disabled");
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
            $("#txtRemark_item" + i).attr("disabled", "disabled");
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
            $('#spanlepRentdata_1').toggleClass('fa-caretfa-angle-double-down');
        });
        $('#Expenses').on('click', function () {
            $('#divlepRentdata_2').toggleClass('display_none');
            $('#spanlepRentdata_2').toggleClass('fa-angle-double-left');
            $('#spanlepRentdata_2').toggleClass('fa-angle-double-down');
        });
        $('#OerSalesman').on('click', function () {
            $('#divlOerSalesman_2').toggleClass('display_none');
            $('#spanlOerSalesman_2').toggleClass('fa-angle-double-left');
            $('#spanlOerSalesman_2').toggleClass('fa-angle-double-down');
        });
        $('#Processshutdown').on('click', function () {
            $('#divlepRentdata_3').toggleClass('display_none');
            $('#spanlepRentdata_3').toggleClass('fa-angle-double-left');
            $('#spanlepRentdata_3').toggleClass('fa-angle-double-down');
        });
        $('#Financialsituation').on('click', function () {
            $('#lepRentdata').toggleClass('display_none');
            $('#spanlepRentdata_4').toggleClass('fa-angle-double-left');
            $('#spanlepRentdata_4').toggleClass('fa-angle-double-down');
        });
        $('#Div_Money').on('click', function () {
            $('#lepMoney').toggleClass('display_none');
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
    function Validate_code(rowno) {
        // 
        for (var i = 0; i < CountGridDeposit; i++) {
            if (i != rowno) {
                if ($("#txt_StatusFlag2" + i).val() == "d") {
                    return true;
                }
                else {
                    if ($("#txtSerial3" + rowno).val() == $("#txtSerial3" + i).val()) {
                        var Code = $("#txtSerial3" + rowno).val();
                        $("#txtSerial3" + rowno).val("");
                        WorningMessage("لا يمكن تكرار رقم الكود " + Code, "code cannot br repeated?", "تحذير", "worning", function () {
                            $("#txtSerial3" + rowno).val("");
                            return false;
                        });
                    }
                }
            }
        }
        if ($("#txt_StatusFlag2" + rowno).val() != "i")
            $("#txt_StatusFlag2" + rowno).val("u");
        return true;
    }
    //------------------------------------------------------- Print Report --------------------------------------
    function PrintReport(OutType) {
        //
        if (!SysSession.CurrentPrivileges.PrintOut)
            return;
        var rp = new ReportParameters();
        rp.RepType = OutType; //output report as View
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
        if (ddlVendorMaster.selectedIndex > 0) {
            rp.VendorId = Number($("#ddlVendorMaster").val());
        }
        else {
            rp.VendorId = -1;
        }
        rp.OperationId = -1;
        if (ddlSalesmanMaster.selectedIndex > 0) {
            rp.SalesmanID = Number($("#ddlSalesmanMaster").val());
        }
        else {
            rp.SalesmanID = -1;
        }
        if (ddlStateType.value == '111') {
            rp.Status = -1;
        }
        else {
            rp.Status = Number(ddlStateType.value);
        }
        Ajax.Callsync({
            url: Url.Action("IProc_Rpt_OperationList", "GeneralReports"),
            data: rp,
            success: function (d) {
                var result = d.result;
                window.open(result, "_blank");
            }
        });
    }
    function PrintReport1(OutType) {
        //
        if (!SysSession.CurrentPrivileges.PrintOut)
            return;
        var rp = new ReportParameters();
        rp.RepType = OutType; //output report as View
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
            success: function (d) {
                var result = d.result;
                PrintReportLogOperation(SysSession.CurrentEnvironment.UserCode, SysSession.CurrentEnvironment.CompCode, SysSession.CurrentEnvironment.BranchCode, Modules.Processes, SysSession.CurrentEnvironment.CurrentYear, "Load Data");
                window.open(result, "_blank");
            }
        });
    }
    function PrintReport2(OutType) {
        if (!SysSession.CurrentPrivileges.PrintOut)
            return;
        var rp = new ReportParameters();
        rp.RepType = OutType; //output report as View
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
            success: function (d) {
                var result = d.result;
                PrintReportLogOperation(SysSession.CurrentEnvironment.UserCode, SysSession.CurrentEnvironment.CompCode, SysSession.CurrentEnvironment.BranchCode, Modules.Processes, SysSession.CurrentEnvironment.CurrentYear, "print operation costs");
                window.open(result, "_blank");
            }
        });
    }
    function PrintReport3(OutType) {
        if (!SysSession.CurrentPrivileges.PrintOut)
            return;
        var rp = new ReportParameters();
        rp.RepType = OutType; //output report as View
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
            success: function (d) {
                var result = d.result;
                PrintReportLogOperation(SysSession.CurrentEnvironment.UserCode, SysSession.CurrentEnvironment.CompCode, SysSession.CurrentEnvironment.BranchCode, Modules.Processes, SysSession.CurrentEnvironment.CurrentYear, "Distributor stock printing");
                window.open(result, "_blank");
            }
        });
    }
    function PrintReport4(OutType) {
        var rp = new ReportParameters();
        rp.RepType = OutType; //output report as View
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
            success: function (d) {
                var result = d.result;
                PrintReportLogOperation(SysSession.CurrentEnvironment.UserCode, SysSession.CurrentEnvironment.CompCode, SysSession.CurrentEnvironment.BranchCode, Modules.Processes, SysSession.CurrentEnvironment.CurrentYear, "Distributor's Deposit Printing");
                window.open(result, "_blank");
            }
        });
    }
    function btnPrintDeposit_onclick() {
        if (!SysSession.CurrentPrivileges.PrintOut)
            return;
        var rp = new ReportParameters();
        rp.RepType = 0; //output report as View
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
            success: function (d) {
                var result = d.result;
                PrintTransactionLog(SysSession.CurrentEnvironment.UserCode, SysSession.CurrentEnvironment.CompCode, SysSession.CurrentEnvironment.BranchCode, Modules.Processes, SysSession.CurrentEnvironment.CurrentYear, rp.TRId.toString());
                window.open(result, "_blank");
            }
        });
    }
    function btnPrintStock_onclick() {
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
            success: function (d) {
                var result = d.result;
                PrintTransactionLog(SysSession.CurrentEnvironment.UserCode, SysSession.CurrentEnvironment.CompCode, SysSession.CurrentEnvironment.BranchCode, Modules.Processes, SysSession.CurrentEnvironment.CurrentYear, rp.TRId.toString());
                window.open(result, "_blank");
            }
        });
    }
    function PrintOperationsummary() {
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
            url: Url.Action("IProc_Rep_OperationSumInternal", "GeneralReports"),
            data: rp,
            success: function (d) {
                var result = d.result;
                PrintTransactionLog(SysSession.CurrentEnvironment.UserCode, SysSession.CurrentEnvironment.CompCode, SysSession.CurrentEnvironment.BranchCode, Modules.Processes, SysSession.CurrentEnvironment.CurrentYear, rp.TRId.toString());
                window.open(result, "_blank");
            }
        });
    }
    function Printsalesrecord() {
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
            success: function (d) {
                var result = d.result;
                PrintTransactionLog(SysSession.CurrentEnvironment.UserCode, SysSession.CurrentEnvironment.CompCode, SysSession.CurrentEnvironment.BranchCode, Modules.Processes, SysSession.CurrentEnvironment.CurrentYear, rp.TRId.toString());
                window.open(result, "_blank");
            }
        });
    }
    ;
})(Processes || (Processes = {}));
//# sourceMappingURL=Processes.js.map