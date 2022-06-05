
$(document).ready(() => {
    StkDefItemsNew.InitalizeComponent();
})

namespace StkDefItemsNew {

    var AccountType: Number = 1;
    var MSG_ID: number;
    var Selected_Data: Array<IQ_GetItemStoreInfo> = new Array<IQ_GetItemStoreInfo>();
    var Details: Array<IQ_GetItemStoreInfo> = new Array<IQ_GetItemStoreInfo>();
    var Display_Type: Array<I_D_Category> = new Array<I_D_Category>();
    var Display_STORE: Array<G_STORE> = new Array<G_STORE>();
    var Display_D_UOM: Array<I_D_UOM> = new Array<I_D_UOM>();

    var Display_ItemFamily: Array<I_ItemFamily> = new Array<I_ItemFamily>();
    var BilldItemFamily: Array<I_ItemFamily> = new Array<I_ItemFamily>();
    var BilldDetail = new I_Item_Year_Details();
    var IsLocalSalePrice: boolean;
    var btnsave: HTMLButtonElement;
    var btnEdit: HTMLButtonElement;
    var btnShow: HTMLButtonElement;
    var btnback: HTMLButtonElement;
    var ID_Print: HTMLButtonElement;

    var drp_G_Store: HTMLSelectElement;
    var txtCat_Type: HTMLSelectElement;
    var txtFamily: HTMLSelectElement;
    var drpPaymentType: HTMLSelectElement;

    //var btnView: HTMLButtonElement;
    var sys: SystemTools = new SystemTools();
    //var sys: _shared = new _shared();
    var SysSession: SystemSession = GetSystemSession(Modules.StkDefItemsNew);
    var Model: I_Item = new I_Item();
    var Model_Year: I_ItemYear = new I_ItemYear();
    var divMasterGrid: JsGrid = new JsGrid();

    var CountGrid = 0;
    var compcode: Number;//SharedSession.CurrentEnvironment.CompCode;
    var BranchCode: number;//SharedSession.CurrentEnvironment.BranchCode;

    var catId;
    var catId_type_change;
    var ItemFamilyID_change;

    var flag_Assign = 0;
    var ItemFamilyID;
    var storeCode = 1;
    var Itm_DescA;
    var flag_Display = 0;
    var StocK = "All";
    var FinYear = Number(SysSession.CurrentEnvironment.CurrentYear);
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);
    export function InitalizeComponent() {
        // 
        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = "تعريف الأصناف";

        } else {
            document.getElementById('Screen_name').innerHTML = "Items";

        }

        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);
        InitalizeControls();
        InitalizeEvents();
        FillddlCategoryType();
        Fillddl_G_store();

        Display_UOM();

        $('#drp_G_Store').prop("selectedIndex", 1);
        $("#drp_G_Store").attr("disabled", "disabled");


    }

    function InitalizeControls() {

        btnEdit = document.getElementById("btnedite") as HTMLButtonElement;
        btnsave = document.getElementById("btnsave") as HTMLButtonElement;
        btnback = document.getElementById("btnback") as HTMLButtonElement;
        btnShow = document.getElementById("btnShow") as HTMLButtonElement;
        ID_Print = document.getElementById("ID_Print") as HTMLButtonElement;

        txtCat_Type = document.getElementById("txtCat_Type") as HTMLSelectElement;
        txtFamily = document.getElementById("txtFamily") as HTMLSelectElement;
        drpPaymentType = document.getElementById("drpPaymentType") as HTMLSelectElement;
        drp_G_Store = document.getElementById("drp_G_Store") as HTMLSelectElement;




    }

    function InitalizeEvents() {
        // 

        $("#drpitem_family").attr("disabled", "disabled");
        //$("#drpPaymentType").attr("disabled", "disabled");

        btnsave.onclick = btnsave_onClick;
        btnback.onclick = btnback_onclick;
        btnShow.onclick = btnShow_onclick;
        ID_Print.onclick = DownloadInvoicePdf;


        $("#drp_G_Store").on('change', function () {
            $("#drpPaymentType").removeAttr("disabled");

            storeCode = $('#drp_G_Store').val();

        });
        $("#drpPaymentType").on('change', function () {
            if ($("#drpPaymentType").val() == "null") {
                $("#div_Data").html('');

                $("#drpitem_family").attr("disabled", "disabled");
                $('#drpitem_family').prop("value", 'null');
            }
            else {

                storeCode = $('#drp_G_Store').val();
                $("#drpitem_family").removeAttr("disabled");
                $('#drpitem_family').html("");

                catId = $('#drpPaymentType').val();


                //DisplayStk_I_Item();

                Display_I_ItemFamily();
                //Display();


                ItemFamilyID = $('#drpitem_family').val();

                //Display_All();
                //btnback_onclick();

            }



        });


        $("#drpitem_family").on('change', function () {


            //$('#drpitem_family').html("");


            ItemFamilyID = $('#drpitem_family').val();





            //btnback_onclick();







        });

    }



    function DownloadInvoicePdf() {


        let rp: ReportParameters = new ReportParameters();


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
        rp.Type = 0;
        rp.Typ = 2;
        rp.TRId = 1726;
        rp.stat = SysSession.CurrentEnvironment.I_Control[0].InvoiceTransCode;
        Ajax.Callsync({
            url: Url.Action("rptInvoiceNote", "Reports_pdf"),
            data: rp,
            success: (d) => {
                debugger
                let result = d as BaseResponse;


                $('#printableArea').html('<img src="data:image/png;base64,' + result + '" />');


                PrintImage('data:image/png;base64,' + result + '')

                //var originalContents = document.body.innerHTML;

                //document.body.innerHTML = '<img src="data:image/png;base64,' + result + '" />';

                //window.print();

                //document.body.innerHTML = originalContents;


                //console.log('<img src="data:image/png;base64,' + result + '" />');
                //alert('<img src="data:image/png;base64,' + result + '" />');

            }
        })





    }



    function printDiv(divName: string) {


        var printContents = document.getElementById(divName).innerHTML;
        var originalContents = document.body.innerHTML;

        document.body.innerHTML = printContents;

        window.print();

        document.body.innerHTML = originalContents;
    }


    function ImagetoPrint(source) {
        return "<html><head><scri" + "pt>function step1(){\n" +
            "setTimeout('step2()', 10);}\n" +
            "function step2(){window.print();window.close()}\n" +
            "</scri" + "pt></head><body onload='step1()'>\n" +
            "<img src='" + source + "' /></body></html>";
    }

    function PrintImage(source) {
        var Pagelink = "about:blank";
        var pwa = window.open(Pagelink, "_new");
        pwa.document.open();
        pwa.document.write(ImagetoPrint(source));
        pwa.document.close();
    }



    function FillddlCategoryType() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("StkDefCategory", "GetAll"),
            data: {
                CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    Display_Type = result.Response as Array<I_D_Category>;

                    DocumentActions.FillCombowithdefult(Display_Type, drpPaymentType, "CatID", (lang == "ar" ? "DescA" : "DescL"), (lang == "ar" ? "اختر  الفئه" : "Select Category"));
                    DocumentActions.FillCombowithdefult(Display_Type, txtCat_Type, "CatID", (lang == "ar" ? "DescA" : "DescL"), (lang == "ar" ? "اختر  الفئه" : "Select Category"));

                }
            }
        });
    }
    function Fillddl_G_store() {
        //var StkDefCategory: Array<I_D_Category> = new Array<I_D_Category>();

        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("StkDefStore", "GetAll"),
            data: {
                CompCode: compcode, BranchCode: BranchCode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    Display_STORE = result.Response as Array<G_STORE>;

                    DocumentActions.FillCombowithdefult(Display_STORE, drp_G_Store, "StoreId", (lang == "ar" ? "DescA" : "DescL"), (lang == "ar" ? "اختر المستودع" : "Select store"));

                }
            }
        });
    }
    function Display_I_ItemFamily() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("StkDefItemType", "GetByCategory"),
            data: {
                CompCode: compcode, CatID: catId, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {

                    Display_ItemFamily = result.Response as Array<I_ItemFamily>;

                    DocumentActions.FillCombowithdefult(Display_ItemFamily, txtFamily, "ItemFamilyID", (lang == "ar" ? "DescA" : "DescL"), (lang == "ar" ? "اختر النوع" : "Select ItemFamily"));

                    DisplayStk_I_Item()
                }
            }
        });
    }
    function DisplayStk_I_Item() {

        $('#drpitem_family').append('<option value="' + 0 + '"> ' + (lang == "ar" ? " اختر النوع " : "Choose Type") + '</option>');
        for (var i = 0; i < Display_ItemFamily.length; i++) {

            $('#drpitem_family').append('<option value="' + Display_ItemFamily[i].ItemFamilyID + '">' + (lang == "ar" ? Display_ItemFamily[i].DescA : Display_ItemFamily[i].DescL) + '</option>');

        }

    }



    function btnShow_onclick() {

        debugger

        //printDiv('printableArea');

       

         storeCode = $('#drp_G_Store').val();
         catId = $('#drpPaymentType').val();
         ItemFamilyID = $('#drpitem_family').val();
         StocK = $('#drp_StocK').val();

        if ($("#drpPaymentType").val() == "null") {
            WorningMessage("يجب اختيار الفئة!", "Category must be selected!", "تحذير", "worning");
        }
        else {

            if ($("#drpitem_family").val() == "0") {
                Display_All();
            }
            else {
                Display();
            }


        }

    }

    function Display() {
        //debugger
        storeCode = $('#drp_G_Store').val();
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("StkDefItems", "GetAll_StocK"),
            data: {
                CompCode: compcode, BraCode:BranchCode , FinYear: FinYear, ItemFamilyID: ItemFamilyID, storeCode: storeCode, StocK: StocK, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {

                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    Details = result.Response as Array<IQ_GetItemStoreInfo>;

                    for (var i = 0; i < Details.length; i++) {

                        var Type = Display_Type.filter(x => x.CatID == Details[i].CatID);

                        Details[i].Cat_Desc = (lang == "ar" ? Type[0].DescA : Type[0].DescL)

                    }

                    InitializeGrid();
                    divMasterGrid.DataSource = Details;
                    divMasterGrid.Bind();
                    $('#id_divMasterGrid').removeClass('display_none');
                }
            }
        });
    }

    function Display_All() {
        debugger
        storeCode = $('#drp_G_Store').val();
        ItemFamilyID = 0;
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("StkDefItems", "GetAllItem"),
            data: {
                CompCode: compcode, BraCode: BranchCode, FinYear: Number(FinYear), catid: Number(catId), itemFamilyid: Number(ItemFamilyID), Storeid: storeCode, StocK: StocK, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {

                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    debugger
                    Details = result.Response as Array<IQ_GetItemStoreInfo>;

                    for (var i = 0; i < Details.length; i++) {

                        var Type = Display_Type.filter(x => x.CatID == Details[i].CatID);

                        Details[i].Cat_Desc = (lang == "ar" ? Type[0].DescA : Type[0].DescL)

                    }

                    InitializeGrid();
                    divMasterGrid.DataSource = Details;
                    divMasterGrid.Bind();
                    $('#id_divMasterGrid').removeClass('display_none');
                }
            }
        });
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
        divMasterGrid.PrimaryKey = "ItemID";
        divMasterGrid.Columns = [
            { title: "ID", name: "ItemID", type: "text", width: "2%", visible: false },
            { title: 'رقم الصنف', name: "ItemCode", type: "text", width: "10%" },
            { title: 'الوصف', name: (lang == "ar" ? "Itm_DescA" : "Itm_DescE"), type: "text", width: "35%" },
            { title: 'الفئة', name: "Cat_Desc", type: "text", width: "12%" },
            { title: 'الصنف الرئيسي', name: (lang == "ar" ? "Family_DescA" : "Family_DescE"), type: "text", width: "14%" },
            { title: 'الوحدة الرئيسية', name: (lang == "ar" ? "Uom_DescA" : "Uom_DescE"), type: "text", width: "16%" },
            { title: 'الكمية  في الفرع ', name: "OnhandQty", type: "text", width: "13%" },
            { title: 'الكمية في الشركة ', name: "OnhandQty", type: "text", width: "13%" },


        ];

    }

    function MasterGridDoubleClick() {
        Selected_Data = new Array<IQ_GetItemStoreInfo>();

        Selected_Data = Details.filter(x => x.ItemID == Number(divMasterGrid.SelectedKey));

        $("#div_Master_Hedr").removeClass("display_none");
        DisplayData(Selected_Data);


    }
    function DisplayData(Selected_Data: Array<IQ_GetItemStoreInfo>) {

        CountGrid = 0;
        DocumentActions.RenderFromModel(Selected_Data[0]);

        $('#Div_Show_units').removeClass('display_none');
        $('#Div_Show_Quantity').removeClass('display_none');


        //$('#txtClearanceDate').val(DateFormat(Selected_Data[0].ClearanceDate));
        //$('#txtdateopening').val(DateFormat(Selected_Data[0].OpenAt));
        //$('#ddlVendor').prop("value", Selected_Data[0].VendorID);


        //BindGetOperationItemsGridData(Selected_Data[0].ItemID);



    }
    function BindGetOperationItemsGridData(ItemID: number) {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("Processes", "AllGetOperationMasterDisplay"),
            data: { ItemID: ItemID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    //AllGetOperationMasterDetailModel = result.Response as AllGetOperationMasterDisplay;

                    //$("#div_Data").html('');
                    //$("#div_ChargesData").html('');
                    //$("#data_lebel").html('');

                    //CountGridDeposit = 0;
                    //CountItemsCharge = 0;
                    //CountGrid = -1;

                    //for (var i = 0; i < AllGetOperationMasterDetailModel.IQ_GetOperationItemInfo.length; i++) {

                    //    BuildControls(i);
                    //    Disbly_BuildControls(i, AllGetOperationMasterDetailModel.IQ_GetOperationItemInfo);
                    //    CountGrid += 1;
                    //}

                    //for (var i = 0; i < AllGetOperationMasterDetailModel.IQ_GetOperationCharges.length; i++) {

                    //    BuildControlsCharges(i);
                    //    Disbly_BuildControlsCharges(i, AllGetOperationMasterDetailModel.IQ_GetOperationCharges);
                    //    CountGridCharge += 1;
                    //    CountItemsCharge += 1;
                    //}


                    //OerSalesmanGrid_Master.DataSource = AllGetOperationMasterDetailModel.TR_OperationSalesman;
                    //OerSalesmanGrid_Master.Bind();

                    //SalesmanItem_Data = AllGetOperationMasterDetailModel.TR_OperationSalesmanItem;
                    //OerSalesmanGrid_Detail.DataSource = AllGetOperationMasterDetailModel.TR_OperationSalesmanItem;
                    //OerSalesmanGrid_Detail.Bind();

                    //SalesmanItem_AllAssign(AllGetOperationMasterDetailModel.TR_OperationSalesmanItem);


                    //OperationDeposit = AllGetOperationMasterDetailModel.I_TR_OperationDeposit;

                    //for (var i = 0; i < OperationDeposit.length; i++) {

                    //    BuildControlslebel(i);
                    //    Disbly_BuildControlsDeposit(i, OperationDeposit);
                    //    CountGridDeposit += 1;

                    //}

                    //ComputeTotals();
                    //ComputeTotalsCharge();

                }
            }
        });
    }



    function btnsave_onClick() {
        loading('btnsave');

        setTimeout(function () {

            finishSave('btnsave');
        var CanAdd: boolean = true;
        if (CountGrid > 0) {
            for (var i = 0; i < CountGrid; i++) {
                debugger
                CanAdd = Validation_Grid(i);
                if (CanAdd == false) {
                    break;
                }
            }
        }
        if (CanAdd) {
            Update();
            flag_Assign = 0;
        }
        }, 100);
    }



    function Display_I_ItemFamily_GRED() {
        //var StkDefCategory: Array<I_D_Category> = new Array<I_D_Category>();

        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("StkDefItemType", "GetByCategory"),
            data: {
                CompCode: compcode, CatID: catId_type_change, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {

                    Display_ItemFamily = result.Response as Array<I_ItemFamily>;


                }
            }
        });
    }





    function Display_UOM() {
        //var StkDefCategory: Array<I_D_Category> = new Array<I_D_Category>();

        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("StkDefUnit", "GetAll"),
            data: {
                CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    Display_D_UOM = result.Response as Array<I_D_UOM>;


                }
            }
        });
    }

    function DisplayStk_UOM() {
        for (var i = 0; i < Display_D_UOM.length; i++) {



            $('#txt_UOM').append('<option value="' + Display_D_UOM[i].UomID + '">' + Display_D_UOM[i].DescA + '</option>');


        }

    }

    function Update() {
         IsLocalSalePrice = sys.SysSession.CurrentEnvironment.I_Control[0].IsLocalSalePrice;
        Assign();



        BilldDetail.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
        BilldDetail.UserCode = SysSession.CurrentEnvironment.UserCode;


        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("StkDefItems", "Updatelist"),
            data: JSON.stringify(BilldDetail),
            success: (d) => {

                let result = d as BaseResponse;
                if (result.IsSuccess == true) {
                    var OK = result.Response


                    OK == 0 ? DisplayMassage_Processes('خطاء الصنف مستخدم بالفغل ', 'Wrong the Item is already used ', MessageType.Worning) : DisplayMassage_Processes('تم الحفظ', 'Done', MessageType.Succeed);

                    btnback_onclick();
                    flag_Assign = 0;
                }
                else {


                    DisplayMassage_Processes('خطأ', 'Wrong', MessageType.Worning);
                }
            }
        });
    }

    function Assign() {

        debugger;
        BilldDetail = new I_Item_Year_Details();
        var StatusFlag: String;
        for (var i = 0; i < CountGrid; i++) {
            Model = new I_Item();
            Model_Year = new I_ItemYear();

            StatusFlag = $("#txt_StatusFlag" + i).val();

            if (StatusFlag == "i") {
                Model.StatusFlag = StatusFlag.toString();
                Model_Year.StatusFlag = StatusFlag.toString();
                Model.CompCode = Number(SysSession.CurrentEnvironment.CompCode);
                Model.CreatedBy = SysSession.CurrentEnvironment.UserCode;
                Model.CreatedAt = DateTimeFormat(Date().toString());

                Model.ItemID = 0;
                Model.ItemCode = $("#txtCode" + i).val();
                Model.ItemFamilyID = $('#select_ItemFamily' + i).val();
                Model.RefItemCode = $("#txtRefItemCode" + i).val();
                Model.OnhandQty = $("#txtOnhandQty" + i).val() == null ? 0 : $("#txtOnhandQty" + i).val();
                Model.UomID = $('#txt_UOM' + i).val();
                Model.DescA = $("#txtDescA" + i).val() == null ? $("#txtDescL" + i).val() : $("#txtDescA" + i).val();
                Model.DescL = $("#txtDescL" + i).val() == null ? $("#txtDescA" + i).val() : $("#txtDescL" + i).val();

                Model_Year.ItemYearID = $("#txt_ItemYearID" + i).val();
                Model_Year.UnitPrice = $('#txtUnitPrice' + i).val();
                Model_Year.MinUnitPrice = $('#txtMinUnitPrice' + i).val();
                Model_Year.IsLocalSalePrice = IsLocalSalePrice;
                Model_Year.FinYear = FinYear;

                flag_Assign = 1;
                BilldDetail.I_Item.push(Model);
                BilldDetail.I_ItemYear.push(Model_Year);
            }
            if (StatusFlag == "u") {
                Model.StatusFlag = StatusFlag.toString();
                Model_Year.StatusFlag = StatusFlag.toString();
                Model.CompCode = Number(SysSession.CurrentEnvironment.CompCode);
                Model.UpdatedBy = SysSession.CurrentEnvironment.UserCode;
                Model.UpdatedAt = DateTimeFormat(Date().toString());

                Model.ItemID = $("#txt_ID" + i).val();
                Model.ItemCode = $("#txtCode" + i).val();
                Model.ItemFamilyID = $('#select_ItemFamily' + i).val();
                Model.RefItemCode = $("#txtRefItemCode" + i).val();
                Model.OnhandQty = $("#txtOnhandQty" + i).val() == null ? 0 : $("#txtOnhandQty" + i).val();
                Model.UomID = $('#txt_UOM' + i).val();
                Model.DescA = $("#txtDescA" + i).val() == null ? $("#txtDescL" + i).val() : $("#txtDescA" + i).val();
                Model.DescL = $("#txtDescL" + i).val() == null ? $("#txtDescA" + i).val() : $("#txtDescL" + i).val();

                Model_Year.ItemYearID = $("#txt_ItemYearID" + i).val();
                Model_Year.ItemID = $("#txt_ID" + i).val();
                Model_Year.UnitPrice = $('#txtUnitPrice' + i).val();
                Model_Year.MinUnitPrice = $('#txtMinUnitPrice' + i).val();
                Model_Year.IsLocalSalePrice = IsLocalSalePrice;

                Model_Year.FinYear = FinYear;

                flag_Assign = 1;
                BilldDetail.I_Item.push(Model);
                BilldDetail.I_ItemYear.push(Model_Year);
            }
            if (StatusFlag == "d") {
                if ($("#txt_ID" + i).val() != "") {
                    Model.StatusFlag = StatusFlag.toString();
                    Model_Year.StatusFlag = StatusFlag.toString();
                    Model.ItemID = $("#txt_ID" + i).val();
                    Model_Year.ItemYearID = $("#txt_ItemYearID" + i).val();
                    Model_Year.ItemID = $("#txt_ID" + i).val();
                    Model_Year.FinYear = FinYear;

                    flag_Assign = 1;
                    BilldDetail.I_Item.push(Model);
                    BilldDetail.I_ItemYear.push(Model_Year);
                }
            }

        }
    }



    function btnback_onclick() {


        if ($('#btnback').attr('class') != "btn btn-warning display_none") {
            $('#btnback').toggleClass("display_none");
        }
        if ($('#btnsave').attr('class') != "btn btn-success display_none") {
            $('#btnsave').toggleClass("display_none");
        }


        $('#btnAddDetails').attr('class', 'glyphicon glyphicon-plus-sign  display_none')
        $(".fa-minus-circle").addClass("display_none");
        $("#btnedite").removeClass("display_none");
        $("#btnedite").removeAttr("disabled");

        $("#btnback").removeAttr("disabled");
        $("#btnsave").removeAttr("disabled");

        CountGrid = 0;
        $("#div_Data").html("");


        if ($("#drpitem_family").val() == "0") {
            Display_All();
        }
        else {
            Display();
        }

        $("#drpPaymentType").removeAttr("disabled");
        $("#drpitem_family").removeAttr("disabled");
        $("#drp_StocK").removeAttr("disabled");
        $("#btnShow").removeAttr("disabled");


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

            if ($("#txtCode" + rowcount).val() == "" && $("#txt_StatusFlag" + rowcount).val() != "d") {
                Errorinput($("#txtCode" + rowcount));
                DisplayMassage_Processes('ادخل كود', 'Enter The Code', MessageType.Worning);

                return false;
            }
            if ((lang == "ar" ? $("#txtDescA" + rowcount).val() : $("#txtDescL" + rowcount).val()) == '') {

                DisplayMassage_Processes('ادخل الوصف', 'Enter The Description', MessageType.Worning);

                Errorinput((lang == "ar" ? $("#txtDescA" + rowcount) : $("#txtDescL" + rowcount)));
                return false;

            }
            if ($("#select_Type_Item" + rowcount).val() == "null" && $("#txt_StatusFlag" + rowcount).val() != "d") {
                Errorinput($("#select_Type_Item" + rowcount));

                DisplayMassage_Processes('اختار الفئة', ' Choose The Category', MessageType.Worning);


                return false;
            }
            if ($("#select_ItemFamily" + rowcount).val() == "null" && $("#txt_StatusFlag" + rowcount).val() != "d") {
                Errorinput($("#select_ItemFamily" + rowcount));

                DisplayMassage_Processes('اختار النوع', ' Choose The Type', MessageType.Worning);

                return false;
            }
            if ($("#txt_UOM" + rowcount).val() == "null" && $("#txt_StatusFlag" + rowcount).val() != "d") {
                Errorinput($("#txt_UOM" + rowcount));

                DisplayMassage_Processes('اختار وحدة القياس', 'Choose The Measuring Unit', MessageType.Worning);

                return false;
            }
            var Qty: number = Number($("#txtUnitPrice" + rowcount).val());
            if ($("#txtUnitPrice" + rowcount).val() == "" || Qty == 0) {
                $("#txtUnitPrice" + rowcount).val('0');
                //Errorinput($("#txtUnitPrice" + rowcount));
                //if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") { 
                //    MessageBox.Show("ادخل السعر", "");
                //} else {
                //    MessageBox.Show("Please,Enter The Price", "");
                //}


                //return false;
            }
            if ($("#txtMinUnitPrice" + rowcount).val() == "") {
                $("#txtMinUnitPrice" + rowcount).val('0');

                //Errorinput($("#txtMinUnitPrice" + rowcount));
                //if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
                //    MessageBox.Show("ادخل اقل سعر", "");
                //} else {
                //    MessageBox.Show("Please,Enter The less Price", "");
                //}
                //return false;
            }

        }
        return true;
    }

    function Validate_code(rowno: number) {

        for (var i = 0; i < CountGrid; i++) {
            if (i != rowno) {

                if ($("#txt_StatusFlag" + i).val() == "d") {
                    return true;

                }
                else {

                    if ($("#txtCode" + rowno).val() == $("#txtCode" + i).val()) {

                        let Code = $("#txtCode" + rowno).val();
                        $("#txtCode" + rowno).val("");
                        WorningMessage("لا يمكن تكرار رقم الكود " + Code, "code cannot br repeated?", "تحذير", "worning", () => {
                            $("#txtCode" + rowno).val("");
                            return false;
                        });
                    }

                }
            }
        }
        if ($("#txt_StatusFlag" + rowno).val() != "i") $("#txt_StatusFlag" + rowno).val("u");
        return true;
    }


}












