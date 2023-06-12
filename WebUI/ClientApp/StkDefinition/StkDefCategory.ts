
$(document).ready(() => {
    StkDefCategory.InitalizeComponent();
})

namespace StkDefCategory {
    var SysSession: SystemSession = GetSystemSession(Modules.StkDefCategory);
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);
    var compcode: number;//SharedSession.CurrentEnvironment.CompCode;
    var branchcode: number;
    var FIN_YEAR: number;
    //-------------------------------------------------------------------***A R R A Y S ***--------------------------
    var Grid: JsGrid = new JsGrid;
    var sys: SystemTools = new SystemTools();
    var Model: I_D_Category = new I_D_Category();
    var DocObj: I_D_Category = new I_D_Category();
    var Details: Array<I_D_Category> = new Array<I_D_Category>();
    var SelectedItem: Array<I_D_Category> = new Array<I_D_Category>();
    var ItemTypeDet: Array<I_G_ItemType> = new Array<I_G_ItemType>();
    var ItemTypeDetFiltr: Array<I_G_ItemType> = new Array<I_G_ItemType>();
    var Detailsfilter: Array<I_D_Category> = new Array<I_D_Category>();
    var DetailsVatNature: Array<G_VatNature> = new Array<G_VatNature>();
    var AccountDetail: Array<AQ_GetAccount> = new Array<AQ_GetAccount>();

    //-------------------------------------------------------------------*** B U T T O N S ***--------------------------       
    var btnAdd: HTMLButtonElement;
    var btnBack: HTMLButtonElement;
    var btnSave: HTMLButtonElement;
    var btnUpdate: HTMLButtonElement;
    //-------------------------------------------------------------------*** I N P U T S ***--------------------------    
    var searchbutmemreport: HTMLInputElement;
    var txtCatCode: HTMLInputElement;
    var txtDescA: HTMLInputElement;
    var txtDescL: HTMLInputElement;
    var txtRemarks: HTMLInputElement;
    var txtISSales: HTMLInputElement;
    var txtIsStock: HTMLInputElement;         
    var txtIsPurchase: HTMLInputElement;
    var txtCreatedBy: HTMLInputElement;
    var txtCreatedBy: HTMLInputElement;
    var txtUpdatedBy: HTMLInputElement;
    var txtUpdatedAt: HTMLInputElement;
    //-------------------------------------------------------------------*** D R O P . D O W N S ***--------------------------    
    var DrpItemType: HTMLSelectElement;
    var TxtItemType: HTMLSelectElement;
    var DrpCashSalesAccount: HTMLSelectElement;
    var DrpCashReturnAccount: HTMLSelectElement;
    var DrpDiscountCash: HTMLSelectElement;
    var DrpCreditSalesAccount: HTMLSelectElement;
    var DrpCreditReturnAccount: HTMLSelectElement;
    var DrpDiscountCredit: HTMLSelectElement;
    var DrpPurchasingAccount: HTMLSelectElement;
    var DrpPurchaseReturnAccount: HTMLSelectElement;
    var DrpDiscountPur: HTMLSelectElement;
    var DrpVatNat: HTMLSelectElement;
        //-------------------------------------------------------------------*** D I V S ***--------------------------   
    var DivDetails: HTMLDivElement;
    var DivMaster: HTMLDivElement;
    var DivGrid : HTMLDivElement;         
        //-------------------------------------------------------------------*** G L O B A L S ***--------------------------   
    var Isnew = false;
    var GlobalCatID : number = 0;        
    var CountGrid = 0;          
    //-------------------------------------------------------------------*** M A I N ***-------------------------------   
    export function InitalizeComponent() {
        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = " فئات الأصناف";

        } else {
            document.getElementById('Screen_name').innerHTML = "Item Category";

        }
        $("#btnShow").addClass("display_none");
        $("#btnPrintTrview").addClass("display_none");
        $("#btnPrintTrPDF").addClass("display_none");
        $("#btnPrintTrEXEL").addClass("display_none");
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        branchcode = Number(SysSession.CurrentEnvironment.BranchCode);
        FIN_YEAR = Number(SysSession.CurrentEnvironment.CurrentYear);
        InitalizeControls();
        InitalizeEvents();
        InitializeGrid();
        BindGridData();
        FillddlVatNature();
        GetGLAccount();    
        GetItemType();
        FillDrpItemType();

        

    }
    function InitalizeControls() {
         //-------------------------------------------------------------------*** B U T T O N S ***--------------------------     
        btnAdd = document.getElementById("btnAdd") as HTMLButtonElement;
        btnUpdate = document.getElementById("btnUpdate") as HTMLButtonElement;
        btnSave = document.getElementById("btnSave") as HTMLButtonElement;
        btnBack = document.getElementById("btnBack") as HTMLButtonElement;
        //-------------------------------------------------------------------*** I N P U T S ***--------------------------    
        searchbutmemreport = document.getElementById("searchbutmemreport") as  HTMLInputElement;
        txtCatCode = document.getElementById("txtCatCode") as  HTMLInputElement;
        txtDescA = document.getElementById("txtDescA") as  HTMLInputElement;
        txtDescL = document.getElementById("txtDescL") as  HTMLInputElement;       
        txtRemarks = document.getElementById("txtRemarks") as  HTMLInputElement;
        txtISSales = document.getElementById("txtISSales") as  HTMLInputElement;
        txtIsStock = document.getElementById("txtIsStock") as  HTMLInputElement;                
        txtIsPurchase = document.getElementById("txtIsPurchase") as  HTMLInputElement;
        txtCreatedBy = document.getElementById("txtCreatedBy") as  HTMLInputElement;
        txtCreatedBy = document.getElementById("txtCreatedBy") as  HTMLInputElement;
        txtUpdatedBy = document.getElementById("txtUpdatedBy") as  HTMLInputElement;
        txtUpdatedAt = document.getElementById("txtUpdatedAt") as  HTMLInputElement;
        //-------------------------------------------------------------------*** D R O P . D O W N S ***--------------------------   
        DrpItemType = document.getElementById("DrpItemType") as  HTMLSelectElement;
        TxtItemType = document.getElementById("TxtItemType") as  HTMLSelectElement;
        DrpCashSalesAccount = document.getElementById("DrpCashSalesAccount") as  HTMLSelectElement;
        DrpCashReturnAccount = document.getElementById("DrpCashReturnAccount") as  HTMLSelectElement;
        DrpDiscountCash = document.getElementById("DrpDiscountCash") as  HTMLSelectElement;
        DrpCreditSalesAccount = document.getElementById("DrpCreditSalesAccount") as  HTMLSelectElement;
        DrpCreditReturnAccount = document.getElementById("DrpCreditReturnAccount") as  HTMLSelectElement;
        DrpDiscountCredit = document.getElementById("DrpDiscountCredit") as  HTMLSelectElement;
        DrpPurchasingAccount = document.getElementById("DrpPurchasingAccount") as  HTMLSelectElement;
        DrpPurchaseReturnAccount = document.getElementById("DrpPurchaseReturnAccount") as  HTMLSelectElement;
        DrpDiscountPur = document.getElementById("DrpDiscountPur") as  HTMLSelectElement;
        DrpVatNat = document.getElementById("DrpVatNat") as  HTMLSelectElement;
        //-------------------------------------------------------------------*** D I V S ***--------------------------   
        DivDetails = document.getElementById("DivDetails") as HTMLDivElement;
        DivMaster = document.getElementById("DivMaster") as HTMLDivElement;
        DivGrid = document.getElementById("DivGrid") as HTMLDivElement;
    }
    function InitalizeEvents() {
        btnSave.onclick = btnsave_onClick;
        btnBack.onclick = btnback_onclick;
        btnUpdate.onclick = btnedite_onclick;
        DrpItemType.onchange = DrpItemType_onchange;
        TxtItemType.onchange = TxtItemType_onchange;
        btnAdd.onclick = btnAdd_onclick;
        txtISSales.onchange = validationEnabel;
        txtIsPurchase.onchange = validationEnabel;
    }
    //-------------------------------------------------------------------*** G E T . A C C O U N T ***-------------------------------
    function GetGLAccount() {   
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GLDefAccount", "GetAll_AQGetAccount"),
            data: {
                CompCode: compcode, FIN_YEAR: FIN_YEAR, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    debugger
                    AccountDetail = result.Response as Array<AQ_GetAccount>;
                    FillAccounts();
                }
            }
        });
    }
    function FillAccounts() {
         
        $('#DrpCashSalesAccount').append('<option value="null">' + (lang == "ar" ? "اختر الحساب" : "Choose Type") + '</option>');
        $('#DrpCashReturnAccount').append('<option value="null">' + (lang == "ar" ? "اختر الحساب" : "Choose Type") + '</option>');
        $('#DrpDiscountCash').append('<option value="null">' + (lang == "ar" ? "اختر الحساب" : "Choose Type") + '</option>');
        $('#DrpCreditSalesAccount').append('<option value="null">' + (lang == "ar" ? "اختر الحساب" : "Choose Type") + '</option>');
        $('#DrpCreditReturnAccount').append('<option value="null">' + (lang == "ar" ? "اختر الحساب" : "Choose Type") + '</option>');
        $('#DrpDiscountCredit').append('<option value="null">' + (lang == "ar" ? "اختر الحساب" : "Choose Type") + '</option>');
        $('#DrpPurchasingAccount').append('<option value="null">' + (lang == "ar" ? "اختر الحساب" : "Choose Type") + '</option>');
        $('#DrpPurchaseReturnAccount').append('<option value="null">' + (lang == "ar" ? "اختر الحساب" : "Choose Type") + '</option>');
        $('#DrpDiscountPur').append('<option value="null">' + (lang == "ar" ? "اختر الحساب" : "Choose Type") + '</option>');
        for (var i = 0; i < AccountDetail.length; i++) {
            $('#DrpCashSalesAccount').append('<option value="' + AccountDetail[i].ACC_CODE + '">' + (lang == "ar" ? AccountDetail[i].ACC_DESCA : AccountDetail[i].ACC_DESCL) + '</option>');
            $('#DrpCashReturnAccount').append('<option value="' + AccountDetail[i].ACC_CODE + '">' + (lang == "ar" ? AccountDetail[i].ACC_DESCA : AccountDetail[i].ACC_DESCL) + '</option>');
            $('#DrpDiscountCash').append('<option value="' + AccountDetail[i].ACC_CODE + '">' + (lang == "ar" ? AccountDetail[i].ACC_DESCA : AccountDetail[i].ACC_DESCL) + '</option>');
            $('#DrpCreditSalesAccount').append('<option value="' + AccountDetail[i].ACC_CODE + '">' + (lang == "ar" ? AccountDetail[i].ACC_DESCA : AccountDetail[i].ACC_DESCL) + '</option>');
            $('#DrpCreditReturnAccount').append('<option value="' + AccountDetail[i].ACC_CODE + '">' + (lang == "ar" ? AccountDetail[i].ACC_DESCA : AccountDetail[i].ACC_DESCL) + '</option>');
            $('#DrpDiscountCredit').append('<option value="' + AccountDetail[i].ACC_CODE + '">' + (lang == "ar" ? AccountDetail[i].ACC_DESCA : AccountDetail[i].ACC_DESCL) + '</option>');
            $('#DrpPurchasingAccount').append('<option value="' + AccountDetail[i].ACC_CODE + '">' + (lang == "ar" ? AccountDetail[i].ACC_DESCA : AccountDetail[i].ACC_DESCL) + '</option>');
            $('#DrpPurchaseReturnAccount').append('<option value="' + AccountDetail[i].ACC_CODE + '">' + (lang == "ar" ? AccountDetail[i].ACC_DESCA : AccountDetail[i].ACC_DESCL) + '</option>');
            $('#DrpDiscountPur').append('<option value="' + AccountDetail[i].ACC_CODE + '">' + (lang == "ar" ? AccountDetail[i].ACC_DESCA : AccountDetail[i].ACC_DESCL) + '</option>');
        }
    }
    //-------------------------------------------------------------------*** G E T . V A T N A T U R E ***-------------------------------
    function FillddlVatNature() {

        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GenVatType", "GetAllVatNature"),
            data: {
                CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    DetailsVatNature = result.Response as Array<G_VatNature>;
                    for (var i = 0; i < DetailsVatNature.length; i++) {
                        $('#DrpVatNat').append('<option value="' + DetailsVatNature[i].VatNatID + '">' + (lang == "ar" ? DetailsVatNature[i].VatNatureDescA : DetailsVatNature[i].VatNatureDescE) + '</option>');
                    }
                }
            }
        });
    }
    //-------------------------------------------------------------------*** G E T . I T E M . T Y P E ***-------------------------------  
    function GetItemType() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("StkDefCategory", "GetItemType"),
            data: {
                CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    ItemTypeDet = result.Response as Array<I_G_ItemType>;

                }
            }
        });
    }
    function FillDrpItemType() {
        $('#DrpItemType').append('<option value="null">' + (lang == "ar" ? "اختر النوع" : "Choose Type") + '</option>');
        for (var i = 0; i < ItemTypeDet.length; i++) {
            $('#DrpItemType').append('<option value="' + ItemTypeDet[i].ItemTypeID + '">' + (lang == "ar" ? ItemTypeDet[i].DescA : ItemTypeDet[i].DescL) + '</option>');
            $('#TxtItemType').append('<option value="' + ItemTypeDet[i].ItemTypeID + '">' + (lang == "ar" ? ItemTypeDet[i].DescA : ItemTypeDet[i].DescL) + '</option>');
        }
    }
    function DrpItemType_onchange() { 
        //btnUpdate.classList.remove("display_none");
        //btnBack.classList.add("display_none");
        //btnSave.classList.add("display_none");    
  
        DivDetails.classList.add("display_none");    

        if (DrpItemType.value == "null") {
            Grid.DataSource = Details;
            Grid.Bind();
        } else {

            Detailsfilter = Details.filter(x => x.ItemTypeID == Number(DrpItemType.value));

            Grid.DataSource = Detailsfilter;
            Grid.Bind();
        }
         
        $('#icon-bar').addClass('display_none');
        $('#divIconbar').removeClass('display_none');
        $('#btnPrintTransaction').removeClass('display_none');
        $('#btnUpdate').removeClass('display_none');

        $('#btnBack').addClass('display_none');
        $('#btnSave').addClass('display_none');

        $('#btnPrintslip').removeClass('display_none');
        $('#btnPrintTransaction').removeClass('display_none');

        $("#NewAdd_Falg").val('0');
        $("#Mod_Flag").val('0');

    }
    //-------------------------------------------------------------------*** D I S P L A Y ***-------------------------------
    function InitializeGrid() {
        let res: any = GetResourceList("");
        Grid.ElementName = "divGridDetails";
        Grid.Paging = true;
        Grid.PageSize = 10;
        Grid.Sorting = true;
        Grid.InsertionMode = JsGridInsertionMode.Binding;
        Grid.Editing = false;
        Grid.Inserting = false;
        Grid.SelectedIndex = 1;
        Grid.OnRowDoubleClicked = Grid_RowDoubleClicked;
        Grid.OnItemEditing = () => { };
        Grid.PrimaryKey = "CatID";
        Grid.Columns = [
            { title: res.App_Number, name: "CatID", type: "text", width: "1%", visible: false },
            { title: res.App_Code, name: "CatCode", type: "number", width: "7%" },
            { title: res.App_DescA, name: "DescA", type: "text", width: "30%", css:"textaligncenter" },
            { title: res.App_DescE, name: "DescL", type: "text", width: "30%",css: "textaligncenter" },
            { title: res.IsPurchase, name: "IsPurchasedesc", type: "text", width: "11%", css: "textaligncenter" },
            { title: res.IsStock, name: "IsStockdesc", type: "text", width: "11%", css: "textaligncenter"},
            { title: res.ISSales, name: "ISSalesdesc", type: "text", width: "11%", css: "textaligncenter"},
        ];
    }
    function BindGridData() {
        var ItemTypeID: number = 0;
        if (DrpItemType.value != "null") {
            ItemTypeID = Number(DrpItemType.value);
        }
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("StkDefCategory", "GetAll"),
            data: {
                CompCode: compcode, ItemTypeID: ItemTypeID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    Details = result.Response as Array<I_D_Category>;
                    for (var i = 0; i < Details.length; i++) {
                        Details[i].ISSalesdesc = Details[i].ISSales == true ? (lang == "ar" ? "نعم" : "Yes") : (lang == "ar" ? "لا" : "No");
                        Details[i].IsStockdesc = Details[i].IsStock == true ? (lang == "ar" ? "نعم" : "Yes") : (lang == "ar" ? "لا" : "No");
                        Details[i].IsProductdesc = Details[i].IsProduct == true ? (lang == "ar" ? "نعم" : "Yes") : (lang == "ar" ? "لا" : "No");
                        Details[i].IsIssuetoCCdesc = Details[i].IsIssuetoCC == true ? (lang == "ar" ? "نعم" : "Yes") : (lang == "ar" ? "لا" : "No");
                        Details[i].IsIssueToProddesc = Details[i].IsIssueToProd == true ? (lang == "ar" ? "نعم" : "Yes") : (lang == "ar" ? "لا" : "No");
                        Details[i].IsPurchasedesc = Details[i].IsPurchase == true ? (lang == "ar" ? "نعم" : "Yes") : (lang == "ar" ? "لا" : "No");
                    }
                    Grid.DataSource = Details;
                    Grid.Bind();
                }
            }
        });
    }
    function Grid_RowDoubleClicked() {
        

        SelectedItem = Details.filter(x => x.CatID == Number(Grid.SelectedKey));  
        GlobalCatID = Number(Grid.SelectedKey);
        BindDetail();
    }
    function BindDetail() {
        debugger
        DisabledInput();
        $('#DivDetails').removeClass("display_none");
        if (Isnew == true) {
            DocumentActions.RenderFromModel(DocObj);
            $('#DrpCashSalesAccount option[value=' + DocObj.CashSales_ACC_CODE + ']').prop('selected', 'selected').change();
            $('#DrpCashReturnAccount option[value=' + DocObj.CashSalesRet_ACC_CODE + ']').prop('selected', 'selected').change();
            $('#DrpDiscountCash option[value=' + DocObj.CashSalesDisc_ACC_CODE + ']').prop('selected', 'selected').change();
            $('#DrpCreditSalesAccount option[value=' + DocObj.CreditSales_ACC_CODE + ']').prop('selected', 'selected').change();
            $('#DrpCreditReturnAccount option[value=' + DocObj.CreditSalesRet_ACC_CODE + ']').prop('selected', 'selected').change();
            $('#DrpDiscountCredit option[value=' + DocObj.CreditSalesDisc_ACC_CODE + ']').prop('selected', 'selected').change();
            $('#DrpPurchasingAccount option[value=' + DocObj.Pur_ACC_CODE + ']').prop('selected', 'selected').change();
            $('#DrpPurchaseReturnAccount option[value=' + DocObj.PurRet_ACC_CODE + ']').prop('selected', 'selected').change();
            $('#ddlInvoicDrpDiscountPureCustomer option[value=' + DocObj.PurDisc_ACC_CODE + ']').prop('selected', 'selected').change();
        }
        else {
            DocumentActions.RenderFromModel(Grid.SelectedItem);
            $('#DrpCashSalesAccount option[value=' + SelectedItem[0].CashSales_ACC_CODE + ']').prop('selected', 'selected').change();
            $('#DrpCashReturnAccount option[value=' + SelectedItem[0].CashSalesRet_ACC_CODE + ']').prop('selected', 'selected').change();
            $('#DrpDiscountCash option[value=' + SelectedItem[0].CashSalesDisc_ACC_CODE + ']').prop('selected', 'selected').change();
            $('#DrpCreditSalesAccount option[value=' + SelectedItem[0].CreditSales_ACC_CODE + ']').prop('selected', 'selected').change();
            $('#DrpCreditReturnAccount option[value=' + SelectedItem[0].CreditSalesRet_ACC_CODE + ']').prop('selected', 'selected').change();
            $('#DrpDiscountCredit option[value=' + SelectedItem[0].CreditSalesDisc_ACC_CODE + ']').prop('selected', 'selected').change();
            $('#DrpPurchasingAccount option[value=' + SelectedItem[0].Pur_ACC_CODE + ']').prop('selected', 'selected').change();
            $('#DrpPurchaseReturnAccount option[value=' + SelectedItem[0].PurRet_ACC_CODE + ']').prop('selected', 'selected').change();
            $('#ddlInvoicDrpDiscountPureCustomer option[value=' + SelectedItem[0].PurDisc_ACC_CODE + ']').prop('selected', 'selected').change();
        }  
        Isnew = false;                               
      
      
    }
    //-------------------------------------------------------------------*** B U T T O N S ***-------------------------------    
    function btnedite_onclick() {
        Isnew = false;
        EnabledInput();
        validationEnabel();
        btnUpdate.classList.add("display_none");
        btnBack.classList.remove("display_none");
        btnSave.classList.remove("display_none");
        btnAdd.setAttribute("disabled", "disabled");
        DivDetails.classList.remove("display_none");
        DrpItemType.setAttribute("disabled", "disabled");
        searchbutmemreport.setAttribute("disabled", "disabled");
        $("#divGridDetails").addClass("disabledDiv");
        $("#divGridDetails").attr("disabled", "disabled").off('click');
    }
    function btnback_onclick() {
        DisabledInput();
        btnUpdate.classList.remove("display_none");
        btnBack.classList.add("display_none");
        btnSave.classList.add("display_none");
        btnAdd.removeAttribute("disabled");
        DrpItemType.removeAttribute("disabled");
        searchbutmemreport.removeAttribute("disabled");
        $("#divGridDetails").removeClass("disabledDiv");
        $("#divGridDetails").removeAttr("disabled").off('click');
        if (Isnew == true) {
            DivDetails.classList.add("display_none");
        } else {
            Grid_RowDoubleClicked();
        }
    }
    function btnAdd_onclick() {         
        Isnew = true;
        Clear();
        EnabledInput();
        btnUpdate.classList.add("display_none");
        btnBack.classList.remove("display_none");
        btnSave.classList.remove("display_none");
        DivDetails.classList.remove("display_none");
        DrpItemType.setAttribute("disabled", "disabled");
        searchbutmemreport.setAttribute("disabled", "disabled");
        $("#divGridDetails").addClass("disabledDiv");
        $("#divGridDetails").attr("disabled", "disabled").off('click');
        TxtItemType_onchange();
    }
    function btnsave_onClick() {

        loading('btnSave');

        setTimeout(function () {

            finishSave('btnSave');
            Assign();
            if (Isnew == true) {
               
                Insert();
            }        
            else {
                Update();
            }
        }, 100);
    }

    function TxtItemType_onchange() {
        ItemTypeDetFiltr = ItemTypeDet.filter(x => x.ItemTypeID == Number(TxtItemType.value));
        txtIsPurchase.checked = ItemTypeDetFiltr[0].IsStock;
        txtISSales.checked = ItemTypeDetFiltr[0].IsPurchase;
        txtIsStock.checked = ItemTypeDetFiltr[0].ISSales;
    }               
    function Assign() {
        DocumentActions.AssignToModel(Model);
        Model.CatID = GlobalCatID;
        Model.CompCode = compcode;
        Model.CashSales_ACC_CODE = DrpCashSalesAccount.value == "null" ? null : DrpCashSalesAccount.value;
        Model.CashSalesRet_ACC_CODE = DrpCashReturnAccount.value == "null" ? null : DrpCashReturnAccount.value;
        Model.CashSalesDisc_ACC_CODE = DrpDiscountCash.value == "null" ? null : DrpDiscountCash.value;
        Model.CreditSales_ACC_CODE = DrpCreditSalesAccount.value == "null" ? null : DrpCreditSalesAccount.value;
        Model.CreditSalesRet_ACC_CODE = DrpCreditReturnAccount.value == "null" ? null : DrpCreditReturnAccount.value ;
        Model.CreditSalesDisc_ACC_CODE = DrpDiscountCredit.value == "null" ? null : DrpDiscountCredit.value;
        Model.Pur_ACC_CODE = DrpPurchasingAccount.value == "null" ? null : DrpPurchasingAccount.value;
        Model.PurRet_ACC_CODE = DrpPurchaseReturnAccount.value == "null" ? null : DrpPurchaseReturnAccount.value ;
        Model.PurDisc_ACC_CODE = DrpDiscountPur.value == "null" ? null : DrpDiscountPur.value ;
        Model.UserCode = sys.SysSession.CurrentEnvironment.UserCode;
        Model.Token = sys.SysSession.CurrentEnvironment.Token;

        Model.Branch_Code = SysSession.CurrentEnvironment.BranchCode;
        Model.Comp_Code = SysSession.CurrentEnvironment.CompCode;
        Model.MODULE_CODE = Modules.StkDefCategory;
        Model.UserCode = SysSession.CurrentEnvironment.UserCode;
        Model.sec_FinYear = SysSession.CurrentEnvironment.CurrentYear;

    }
    function Insert() {
        Model.CreatedAt = GetDate(); 
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("StkDefCategory", "Insert"),
            data: JSON.stringify(Model),
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess == true) {
                    DocObj = result.Response as I_D_Category;
                    success();  
                    Save_Succ_But();
                }
                else {
                    MessageBox.Show(result.ErrorMessage, "خطأ");
                }
            }
        });
    }
    function Update() {
        Model.UpdatedAt = GetDate();

        Ajax.Callsync({      
            type: "POST",
            url: sys.apiUrl("StkDefCategory", "Update"),
            data: JSON.stringify(Model),
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess == true) {
                    DocObj = result.Response as I_D_Category;
                    success();
                    Save_Succ_But();
                }
                else {
                    MessageBox.Show(result.ErrorMessage, "خطأ");
                }
            }
        });
    }    
    function success() {
        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            MessageBox.Show("تم الحفظ", "");
        } else {
            MessageBox.Show("Done", "");
        }
        DisabledInput();
        //btnUpdate.classList.remove("display_none");
        //btnBack.classList.add("display_none");
        //btnSave.classList.add("display_none");
    
        btnAdd.removeAttribute("disabled");
        DrpItemType.removeAttribute("disabled");
        searchbutmemreport.removeAttribute("disabled");
        $("#divGridDetails").removeClass("disabledDiv");
        $("#divGridDetails").removeAttr("disabled").off('click');
        BindGridData();
        Isnew = true;
        BindDetail(); 

    }

    function Validation_Grid(rowcount: number) {

        if ($("#txt_StatusFlag" + rowcount).val() == "d" || $("#txt_StatusFlag" + rowcount).val() == "m") {
            return true;
        }
        else {

            if ($("#txtDescA" + rowcount).val() == "") {
                $("#txtDescA" + rowcount).val($("#txtDescL" + rowcount).val());
            }
            if ($("#txtDescL" + rowcount).val() == "") {
                $("#txtDescL" + rowcount).val($("#txtDescA" + rowcount).val());
            }

            if ($("#txtCode" + rowcount).val() == '') {

                WorningMessage('ادخل كود', 'Enter The code', 'خطاء', 'Erorr');
                Errorinput($("#txtCode" + rowcount));
                return false;

            }

            if ((lang == "ar" ? $("#txtDescA" + rowcount).val() : $("#txtDescL" + rowcount).val()) == '') {

                WorningMessage('ادخل الوصف ', 'Enter The Description', 'خطاء', 'Erorr');
                Errorinput((lang == "ar" ? $("#txtDescA" + rowcount) : $("#txtDescL" + rowcount)));
                return false;

            }
            if ($("#DrpVatNat" + rowcount).val() == 'Null') {

                WorningMessage('برجاء اختيار الضريبه', 'Enter The Tax', 'خطاء', 'Erorr');
                Errorinput($("#DrpVatNat" + rowcount));
                return false;

            }

        }
        return true;
    }   
    function validationEnabel() {
        if (txtISSales.checked == true) {
            DrpCashSalesAccount.removeAttribute("disabled");
            DrpCashReturnAccount.removeAttribute("disabled");
            DrpDiscountCash.removeAttribute("disabled");
            DrpCreditSalesAccount.removeAttribute("disabled");
            DrpCreditReturnAccount.removeAttribute("disabled");
            DrpDiscountCredit.removeAttribute("disabled");
        } else {
            DrpCashSalesAccount.setAttribute("disabled", "disabled");
            DrpCashReturnAccount.setAttribute("disabled", "disabled");
            DrpDiscountCash.setAttribute("disabled", "disabled");
            DrpCreditSalesAccount.setAttribute("disabled", "disabled");
            DrpCreditReturnAccount.setAttribute("disabled", "disabled");
            DrpDiscountCredit.setAttribute("disabled", "disabled");
        }
        if (txtIsPurchase.checked == true) {
            DrpPurchasingAccount.removeAttribute("disabled");
            DrpPurchaseReturnAccount.removeAttribute("disabled");
            DrpDiscountPur.removeAttribute("disabled");
        } else {
            DrpPurchasingAccount.setAttribute("disabled", "disabled");
            DrpPurchaseReturnAccount.setAttribute("disabled", "disabled");
            DrpDiscountPur.setAttribute("disabled", "disabled"); 
        }     

    }     
    function Clear() {
        txtCatCode.value="";
        txtDescA.value="";
        txtDescL.value="";
        txtRemarks.value="";   
        TxtItemType.value ="1";
        txtCreatedBy.value="";   
        txtCreatedBy.value="";   
        txtUpdatedBy.value="";   
        txtUpdatedAt.value="";   
        DrpCashSalesAccount.value ="null";
        DrpCashReturnAccount.value ="null";
        DrpDiscountCash.value ="null";
        DrpCreditSalesAccount.value ="null";
        DrpCreditReturnAccount.value ="null";
        DrpDiscountCredit.value ="null";
        DrpPurchasingAccount.value ="null";
        DrpPurchaseReturnAccount.value ="null";
        DrpDiscountPur.value = "null";  
        DrpVatNat.value = "null";  
        
    }
    function DisabledInput() {
        txtCatCode.setAttribute("disabled", "disabled");
        txtDescA.setAttribute("disabled", "disabled");
        txtDescL.setAttribute("disabled", "disabled");
        txtRemarks.setAttribute("disabled", "disabled");
        txtISSales.setAttribute("disabled", "disabled");
        txtIsStock.setAttribute("disabled", "disabled");             
        txtIsPurchase.setAttribute("disabled", "disabled");   
        TxtItemType.setAttribute("disabled","disabled");
        DrpCashSalesAccount.setAttribute("disabled","disabled");
        DrpCashReturnAccount.setAttribute("disabled","disabled");
        DrpDiscountCash.setAttribute("disabled","disabled");
        DrpCreditSalesAccount.setAttribute("disabled","disabled");
        DrpCreditReturnAccount.setAttribute("disabled","disabled");
        DrpDiscountCredit.setAttribute("disabled","disabled");
        DrpPurchasingAccount.setAttribute("disabled","disabled");
        DrpPurchaseReturnAccount.setAttribute("disabled","disabled");
        DrpDiscountPur.setAttribute("disabled","disabled");   
        DrpVatNat.setAttribute("disabled","disabled");   
    }
    function EnabledInput() {
        txtCatCode.removeAttribute("disabled");
        txtDescA.removeAttribute("disabled");
        txtDescL.removeAttribute("disabled");
        txtRemarks.removeAttribute("disabled");
        txtISSales.removeAttribute("disabled");
        txtIsStock.removeAttribute("disabled");              
        txtIsPurchase.removeAttribute("disabled");      
        TxtItemType.removeAttribute("disabled");
        DrpCashSalesAccount.removeAttribute("disabled");
        DrpCashReturnAccount.removeAttribute("disabled");
        DrpDiscountCash.removeAttribute("disabled");
        DrpCreditSalesAccount.removeAttribute("disabled");
        DrpCreditReturnAccount.removeAttribute("disabled");
        DrpDiscountCredit.removeAttribute("disabled");
        DrpPurchasingAccount.removeAttribute("disabled");
        DrpPurchaseReturnAccount.removeAttribute("disabled");
        DrpDiscountPur.removeAttribute("disabled");
        DrpVatNat.removeAttribute("disabled");
    }
}












