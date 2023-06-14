
$(document).ready(() => {
    StkDefItems.InitalizeComponent();
})

namespace StkDefItems {

    var AccountType: Number = 1;
    var MSG_ID: number;
    var Details: Array<IQ_GetItemStoreInfo> = new Array<IQ_GetItemStoreInfo>();
    var Display_Type: Array<I_D_Category> = new Array<I_D_Category>();
    var Display_STORE: Array<G_STORE> = new Array<G_STORE>();
    var Display_D_UOM: Array<I_D_UOM> = new Array<I_D_UOM>();

    var Display_ItemFamily: Array<I_ItemFamily> = new Array<I_ItemFamily>();
    var BilldItemFamily: Array<I_ItemFamily> = new Array<I_ItemFamily>();
    var BilldDetail = new I_Item_Year_Details();
    var IsLocalSalePrice: boolean;
    //var Details: Array<I_D_Category> = new Array<I_D_Category>();
    var btnNew_sub_Add_service: HTMLButtonElement;
    var btnSave_Def: HTMLButtonElement;
    var btnAddDetails: HTMLButtonElement;
    var btnEdit: HTMLButtonElement;
    var btnShow_Def: HTMLButtonElement;
    //var btnView: HTMLButtonElement;
    var sys: SystemTools = new SystemTools();
    //var sys: _shared = new _shared();
    var SysSession: SystemSession = GetSystemSession(Modules.StkDefItems);
    var Model: I_Item = new I_Item();
    var Model_Year: I_ItemYear = new I_ItemYear();

    var CountGrid = 0;
    var compcode: Number;//SharedSession.CurrentEnvironment.CompCode;
    var BranchCode: number;//SharedSession.CurrentEnvironment.BranchCode;
    var btnBack_Def: HTMLButtonElement;

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
        $('#divIconbar').addClass('hidden_Control');
        $('#icon-bar').addClass('hidden_Control');
        $('#iconbar_Definition').removeClass('hidden_Control');
        $('#btnShow_Def').removeClass('hidden_Control');

        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = "الاصناف";

        } else {
            document.getElementById('Screen_name').innerHTML = "Items";

        }
       
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);
        IsLocalSalePrice = sys.SysSession.CurrentEnvironment.I_Control[0].IsLocalSalePrice;

        InitalizeControls();
        InitalizeEvents();

        Display_DrpPaymentType();

        //Display();

        Display_G_store();

        Display_UOM();

        $('#drp_G_Store').prop("selectedIndex", 1);
        //$('#drp_G_Store').prop("value", 1);

        $("#drp_G_Store").attr("disabled", "disabled");
        //Display_I_ItemFamily();

        



    }

    $('#btnUpdate_Def').on('click', function () {

        if (SysSession.CurrentPrivileges.EDIT) {

            $('#divShow').removeClass("display_none");
            $('#btnSave_Def').removeClass("display_none");
            $('#btnBack_Def').removeClass("display_none");
            $("#div_ContentData :input").removeAttr("disabled");
            $("#btnUpdate_Def").addClass("display_none");
            $(".SelectDIS").attr("disabled", "disabled");

            if ($('#drpitem_family').val() == "null") {
                $("#drpitem_family").attr("disabled", "disabled")
            }
            else {
                $("#drpitem_family").removeAttr("disabled");
            }
            $("#drp_G_Store").attr("disabled", "disabled");

            $("#drpPaymentType").attr("disabled", "disabled");
            $("#drpitem_family").attr("disabled", "disabled");
            $("#drp_StocK").attr("disabled", "disabled");
            $("#btnShow_Def").attr("disabled", "disabled");


        }
        else {
            $('#btnSave_Def').addClass("display_none");
            $('#btnBack_Def').addClass("display_none");

            $("#btnUpdate_Def").removeClass("display_none");

        }
        if (SysSession.CurrentPrivileges.AddNew) {
            $(".btnAddDetails").removeAttr("disabled");
            $('#btnAddDetails').attr('class', 'glyphicon glyphicon-plus-sign')

        }
        else {
            $(".btnAddDetails").attr("disabled", "disabled");

        }
        if (SysSession.CurrentPrivileges.Remove) {

            $(".fa-minus").removeClass("display_none");

        }
        else {

            $(".fa-minus").addClass("display_none");

        }


    });

    function InitalizeControls() {
        // 
        btnAddDetails = document.getElementById("btnAddDetails") as HTMLButtonElement;
        btnEdit = document.getElementById("btnUpdate_Def") as HTMLButtonElement;
        btnSave_Def = document.getElementById("btnSave_Def") as HTMLButtonElement;
        btnBack_Def = document.getElementById("btnBack_Def") as HTMLButtonElement;
        btnShow_Def = document.getElementById("btnShow_Def") as HTMLButtonElement;

        // Buton privialges for single record page



    }

    function InitalizeEvents() {
        // 

        $("#drpitem_family").attr("disabled", "disabled");
        //$("#drpPaymentType").attr("disabled", "disabled");

        btnAddDetails.onclick = AddNewRow;//
        btnSave_Def.onclick = btnSave_Def_onClick;
        btnBack_Def.onclick = btnBack_Def_onclick;
        btnShow_Def.onclick = btnShow_Def_onclick;
        //btnShow_Def.onkeyup = btnShow_Def_onclick;

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
                //btnBack_Def_onclick();

            }



        });


        $("#drpitem_family").on('change', function () {


            //$('#drpitem_family').html("");


            ItemFamilyID = $('#drpitem_family').val();





            //btnBack_Def_onclick();







        });

    }

    function btnShow_Def_onclick() {
        $("#divShow").removeClass("display_none");
        debugger
        storeCode = $('#drp_G_Store').val();
        catId = $('#drpPaymentType').val();
        ItemFamilyID = $('#drpitem_family').val();
        StocK = $('#drp_StocK').val();

        if ($("#drpPaymentType").val() == "null") {
            WorningMessage("يجب اختيار الفئة!", "Category must be selected!", "تحذير", "worning");
            Errorinput($("#drpPaymentType"));
        }
        else {

            btnBack_Def_onclick();
        }

    }

    function AddNewRow() {

        if (!SysSession.CurrentPrivileges.AddNew) return;
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
            BuildControls(CountGrid);


            $("#txtCode" + CountGrid).removeAttr("disabled");
            $("#txtDescA" + CountGrid).removeAttr("disabled");
            $("#txtDescL" + CountGrid).removeAttr("disabled");
            $("#select_Type_Item" + CountGrid).removeAttr("disabled");
            $("#select_ItemFamily" + CountGrid).removeAttr("disabled");
            $("#txtRefItemCode" + CountGrid).removeAttr("disabled");
            $("#txtUnitPrice" + CountGrid).removeAttr("disabled");
            $("#txtLastBarCodeSeq" + CountGrid).removeAttr("disabled");
            $("#txt_UOM" + CountGrid).removeAttr("disabled");
            $("#txtMinUnitPrice" + CountGrid).removeAttr("disabled");

            $("#btn_minus" + CountGrid).removeClass("display_none");
            $("#btn_minus" + CountGrid).removeAttr("disabled");

            $("#select_Type_Item" + CountGrid).prop('value', $("#drpPaymentType").val() == 'null' ? 'null' : Number($("#drpPaymentType").val()));
            $("#select_ItemFamily" + CountGrid).prop('value', $("#drpitem_family").val() == 'null' || $("#drpitem_family").val() == null ? 'null' : Number($("#drpitem_family").val()));
          
            $("#txt_UOM" + CountGrid).prop('selectedIndex', 1);
            $("#txt_StatusFlag" + CountGrid).val("i"); //In Insert mode
            CountGrid++;
        }

        $("#btnUpdate_Def").addClass("display_none");

    }


    function BuildControls(cnt: number) {

        var html;
        html = `<tr id= "No_Row${cnt}">ass="form-control display_none"  />  
                    <td>
		                <div class="form-group">
			                <span id="btn_minus${cnt}" class="fa-minus" ><i class="fas fa-minus-circle  btn-minus  " disabled ></i></span>
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
                            <input id="txtCode${cnt}" type="text" class="form-control" name="" disabled />
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
                            <input id="txtDescA${cnt}" type="text" class="form-control" name="" disabled />
		                </div>
	                </td>
                    <td>
		               <div class="form-group">
			                <select id="select_Type_Item${cnt}" class="form-control" disabled></select>
		                </div>
	                </td>
                    <td>
		               <div class="form-group">
			                <select id="select_ItemFamily${cnt}" class="form-control" disabled></select>
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
                            <input id="txtOnhandQty${cnt}" type="text" class="form-control" name="" disabled />
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
                            <input id="txtUnitPrice${cnt}" type="number" class="form-control" name="" disabled />
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
                            <input id="txtMinUnitPrice${cnt}" type="number" class="form-control" name="" disabled />
		                </div>
	                </td>
                    <td>
		               <div class="form-group">
			                <select id="txt_UOM${cnt}" class="form-control" disabled></select>
		                </div>
	                </td>
                     <td>
		                <div class="form-group">
                            <input id="txtDescL${cnt}" type="text" class="form-control" name="" disabled />
		                </div>
	                </td>
                     <td>
		                <div class="form-group">
                            <input id="Check_isActive${cnt}" type="checkbox" class="form-check-input" disabled  />
		                </div>
	                </td>
                    
               <input id="txt_StatusFlag${cnt}" type="hidden"   />
               <input id="txt_ID${cnt}" type="hidden"   />
               <input id="txt_ItemYearID${cnt}" type="hidden"   />
               <input id="txt_ItemStoreID${cnt}" type="hidden"   />
                </tr>`;
        $("#div_Data").append(html);


        
        //(lang == "ar" ? $('#DescL' + cnt).addClass('display_none') : $('#DescA' + cnt).addClass('display_none')); 



        $('#select_Type_Item' + cnt).append('<option value="null">' + (lang == "ar" ? "أختر الفئة" : "Choose category") + '</option>');
        for (var i = 0; i < Display_Type.length; i++) {

            $('#select_Type_Item' + cnt).append('<option value="' + Display_Type[i].CatID + '">' + (lang == "ar" ? Display_Type[i].DescA : Display_Type[i].DescL) + '</option>');

        }

     //   $('#txt_UOM' + cnt).append('<option value="null">' + (lang == "ar" ? "وحدة القياس" : "Choose unit") + '</option>');
        for (var i = 0; i < Display_D_UOM.length; i++) {

            $('#txt_UOM' + cnt).append('<option value="' + Display_D_UOM[i].UomID + '">' + (lang == "ar" ? Display_D_UOM[i].DescA : Display_D_UOM[i].DescE) + '</option>');

        }

        $('#select_ItemFamily' + cnt).append('<option value="null"> ' + (lang == "ar" ? "اختر النوع" : "Choose Type") + '</option>');
        for (var i = 0; i < Display_ItemFamily.length; i++) {

            $('#select_ItemFamily' + cnt).append('<option value="' + Display_ItemFamily[i].ItemFamilyID + '">' + (lang == "ar" ? Display_ItemFamily[i].DescA : Display_ItemFamily[i].DescL) + '</option>');

        }

        $("#btn_minus" + cnt).on('click', function () {
            DeleteRow(cnt);
        });
        $("#txtCode" + cnt).on('change', function () {
            if (Validate_Item(cnt, true) == false) {
                DisplayMassage("رقم الصنف موجود من قبل ", "The Item number already exists", MessageType.Worning);
                Errorinput($("#txtCode" + cnt));
                $("#txtCode" + cnt).val('')
                return false;
            } 
        });
        $("#txtDescA" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");

            if (Validate_Item(cnt, false) == false) {
                DisplayMassage("وصف الصنف موجود من قبل ", "The Item   already exists", MessageType.Worning);
                Errorinput($("#txtDescA" + cnt));
                $("#txtDescA" + cnt).val('')
                return false;
            }

        });
        $("#txtDescL" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        $("#select_Type_Item" + cnt).on('change', function () {

            catId_type_change = $("#select_Type_Item" + cnt).val();

            $("#select_ItemFamily" + cnt).removeAttr("disabled");

            $('#select_ItemFamily' + cnt).html("");


            Display_I_ItemFamily_GRED();

            for (var i = 0; i < Display_ItemFamily.length; i++) {



                $('#select_ItemFamily' + cnt).append('<option value="' + Display_ItemFamily[i].ItemFamilyID + '">' + Display_ItemFamily[i].DescA + '</option>');


            }




            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        $("#select_ItemFamily" + cnt).on('change', function () {

            ItemFamilyID_change = $("#select_ItemFamily" + cnt).val();

            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        $("#txtRefItemCode" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        $("#txtOnhandQty" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        $("#txtUnitPrice" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        $("#Check_isActive" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        $("#txtMinUnitPrice" + cnt).on('keyup', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");

            //debugger
            if ($("#txtUnitPrice" + cnt).val() == "" || $("#txtUnitPrice" + cnt).val() == 0) {
                WorningMessage("يجب أدخال سعر الصنف اوالاً!", "The item price must be entered first!", "تحذير", "worning");
                $("#txtMinUnitPrice" + cnt).val(0)
            }
            else if (Number($("#txtMinUnitPrice" + cnt).val()) > Number($("#txtUnitPrice" + cnt).val())) {
                WorningMessage("يجب ان يكون أقل سعر اصغر من سعر الصنف!", "The lowest price should be smaller than the item price!", "تحذير", "worning");
                $("#txtMinUnitPrice" + cnt).val($("#txtUnitPrice" + cnt).val() - 1)
            }


        });
        $("#txt_UOM" + cnt).on('change', function () {

            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });

        if (SysSession.CurrentPrivileges.Remove) {
            $("#btn_minus" + cnt).addClass("display_none");
            $("#btn_minus" + cnt).attr("disabled", "disabled");
        }
        else {
            $("#btn_minus" + cnt).addClass("display_none");
            $("#btn_minus" + cnt).attr("disabled", "disabled");
        }


        return;
    }

    function btnSave_Def_onClick() {
        loading('btnSave_Def');

        setTimeout(function () {

            finishSave('btnSave_Def');
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

    function Display_G_store() {
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

                    DisplayStk_G_store();
                }
            }
        });
    }

    function DisplayStk_G_store() {
        for (var i = 0; i < Display_STORE.length; i++) {



            $('#drp_G_Store').append('<option value="' + Display_STORE[i].StoreId + '">' + (lang == "ar" ? Display_STORE[i].DescA : Display_STORE[i].DescL) + '</option>');


        }

    }

    function Display_I_ItemFamily() {
        //var StkDefCategory: Array<I_D_Category> = new Array<I_D_Category>();

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

    function Display_DrpPaymentType() {
        //var StkDefCategory: Array<I_D_Category> = new Array<I_D_Category>();

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

                    DisplayStkDefCategory();
                }
            }
        });
    }

    function DisplayStkDefCategory() {
        ;
        for (var i = 0; i < Display_Type.length; i++) {

            $('#drpPaymentType').append('<option data-ItemID="' + (lang == "ar" ? Display_Type[i].DescA : Display_Type[i].DescL) + '" value="' + Display_Type[i].CatID + '">' + (lang == "ar" ? Display_Type[i].DescA : Display_Type[i].DescL) + '</option>');


        }

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
        Assign();


        //BilldDetail.UserCode = SysSession.CurrentEnvironment.UserCode;
        BilldDetail.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
        BilldDetail.Branch_Code = SysSession.CurrentEnvironment.BranchCode;
        BilldDetail.Comp_Code = SysSession.CurrentEnvironment.CompCode;
        BilldDetail.MODULE_CODE = Modules.StkDefItems;
        BilldDetail.UserCode = SysSession.CurrentEnvironment.UserCode;
        BilldDetail.sec_FinYear = SysSession.CurrentEnvironment.CurrentYear;

        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("StkDefItems", "Updatelist"),
            data: JSON.stringify(BilldDetail),
            success: (d) => {

                let result = d as BaseResponse;
                if (result.IsSuccess == true) {
                    var OK = result.Response


                    OK == 0 ? DisplayMassage_Processes('خطاء الصنف مستخدم بالفغل ', 'Wrong the Item is already used ', MessageType.Worning) : DisplayMassage_Processes('تم الحفظ', 'Done', MessageType.Succeed);

                    btnBack_Def_onclick(); 
                    flag_Assign = 0;
                    Save_Succ_But();
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

                //if ($("#Check_isActive" + i).is(':checked')) { Model.IsActive = true; }
                //else { Model.IsActive = false; }
                Model.IsActive = true;

                Model_Year.ItemYearID = $("#txt_ItemYearID" + i).val();
                Model_Year.UnitPrice = $('#txtUnitPrice' + i).val();
                Model_Year.MinUnitPrice = $('#txtMinUnitPrice' + i).val();
                Model_Year.FinYear = FinYear;
                Model_Year.IsLocalSalePrice = IsLocalSalePrice;

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


                if ($("#Check_isActive" + i).is(':checked')) { Model.IsActive = true; }
                else { Model.IsActive = false; }


                Model_Year.ItemYearID = $("#txt_ItemYearID" + i).val();
                Model_Year.ItemID = $("#txt_ID" + i).val();
                Model_Year.UnitPrice = $('#txtUnitPrice' + i).val();
                Model_Year.MinUnitPrice = $('#txtMinUnitPrice' + i).val();
                Model_Year.FinYear = FinYear;
                Model_Year.IsLocalSalePrice = IsLocalSalePrice;
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

                    Details_All();
                }
            }
        });
    }

    function Details_All() {


        CountGrid = 0;



        $("#div_Data").html('');
        for (var i = 0; i < Details.length; i++) {

            BuildControls(CountGrid);

            $("#txt_ItemStoreID" + i).val(Details[i].ItemStoreID);
            $("#txt_ItemYearID" + i).val(Details[i].ItemYearID);
            $("#txt_ID" + i).val(Details[i].ItemID);
            $("#txtCode" + i).val(Details[i].ItemCode);
            $("#txtDescA" + i).val(Details[i].Itm_DescA);
            $("#txtDescL" + i).val(Details[i].Itm_DescE);
            $("#txt_UOM" + i).val(Details[i].UomID);
            $("#txtRefItemCode" + i).val(Details[i].RefItemCode);
            $("#txtOnhandQty" + i).val(Details[i].OnhandQty);
            $("#txtUnitPrice" + i).val(Details[i].UnitPrice);
            $("#txtMinUnitPrice" + i).val(Details[i].MinUnitPrice);

            $("#txt_StatusFlag" + i).val("");

            if (Details[i].IsActive) { $("#Check_isActive" + i).attr('checked', 'true') }
            else $("#Check_isActive" + i).removeAttr('checked');



            $('#select_Type_Item' + i).prop("value", catId);
            $('#select_ItemFamily' + i).prop("value", Details[i].ItemFamilyID);

            CountGrid++;

        }






    }

    function Display() {
        debugger
        storeCode = $('#drp_G_Store').val();
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("StkDefItems", "GetAll_StocK"),
            data: {
                CompCode: compcode, BraCode: BranchCode, FinYear: FinYear, ItemFamilyID: ItemFamilyID, storeCode: storeCode, StocK: StocK, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
          },
            success: (d) => {

                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    Details = result.Response as Array<IQ_GetItemStoreInfo>;

                    DisplayGetItemStore();
                }
            }
        });
    }

    function DisplayGetItemStore() {


        CountGrid = 0;

        $("#div_Data").html('');
        for (var i = 0; i < Details.length; i++) {

            BuildControls(CountGrid);

            $("#txt_ItemStoreID" + i).val(Details[i].ItemStoreID);
            $("#txt_ItemYearID" + i).val(Details[i].ItemYearID);
            $("#txt_ID" + i).val(Details[i].ItemID);
            $("#txtCode" + i).val(Details[i].ItemCode);
            $("#txtDescA" + i).val(Details[i].Itm_DescA);
            $("#txtDescL" + i).val(Details[i].Itm_DescE);
            $("#txt_UOM" + i).val(Details[i].UomID);
            $("#txtRefItemCode" + i).val(Details[i].RefItemCode);
            $("#txtOnhandQty" + i).val(Details[i].OnhandQty);
            $("#txtUnitPrice" + i).val(Details[i].UnitPrice);
            $("#txtMinUnitPrice" + i).val(Details[i].MinUnitPrice);
            $("#txt_StatusFlag" + i).val("");

            if (Details[i].IsActive) { $("#Check_isActive" + i).attr('checked', 'true') }
            else $("#Check_isActive" + i).removeAttr('checked');



            $('#select_Type_Item' + i).prop("value", catId);
            $('#select_ItemFamily' + i).prop("value", ItemFamilyID);

            CountGrid++;

        }






    }

    function DeleteRow(RecNo: number) {

        if (!SysSession.CurrentPrivileges.Remove) return;
        WorningMessage("هل تريد الحذف؟", "Do you want to delete?", "تحذير", "worning", () => {


            if ($("#txtCode" + RecNo).val() == "") {

                Null_Fild(RecNo);
                $("#No_Row" + RecNo).attr("hidden", "true");

            }
            else {


                $("#No_Row" + RecNo).attr("hidden", "true");

            }

            $("#txt_StatusFlag" + RecNo).val() == 'i' ? $("#txt_StatusFlag" + RecNo).val('m') : $("#txt_StatusFlag" + RecNo).val('d');

            $("#txtCode" + RecNo).val("000");
            $("#txtUnitPrice" + RecNo).val("000");
            $("#txtMinUnitPrice" + RecNo).val("000");
        });
    }

    function Null_Fild(RecNo: number) {


        $("#txt_ItemStoreID" + RecNo).val("");
        $("#txt_ItemYearID" + RecNo).val("");
        $("#txt_ID" + RecNo).val("");
        $("#txtCode" + RecNo).val("0");
        $("#txtDescA" + RecNo).val(0);
        $("#txtDescL" + RecNo).val(0);
        $("#txtRefItemCode" + RecNo).val(0);
        $("#txtOnhandQty" + RecNo).val(0);
        $("#Check_isActive" + RecNo).removeAttr('checked');
        $("#txtLastBarCodeSeq" + RecNo).val(0);
        $("#txtLastBarCodeSeq" + RecNo).val(0);
        $('#select_Type_Item' + RecNo).prop("selectedIndex", 0);
        $('#select_ItemFamily' + RecNo).prop("selectedIndex", 0);
    }

    function btnBack_Def_onclick() {
         
        $('#btnBack_Def').addClass("display_none");
        $('#btnSave_Def').addClass("display_none");

        $('#btnAddDetails').attr('class', 'glyphicon glyphicon-plus-sign  display_none')
        $(".fa-minus").addClass("display_none");
        $("#btnUpdate_Def").removeClass("display_none");
        $("#btnUpdate_Def").removeAttr("disabled");

        $("#btnBack_Def").removeAttr("disabled");
        $("#btnSave_Def").removeAttr("disabled");

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
        $("#btnShow_Def").removeAttr("disabled");


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

    function Validate_Item(rowno: number, IsCode: boolean) {
          
        var res: boolean = true;
        var ItemCode = $("#txtCode" + rowno).val().trim();
        let ItID = Number($("#txt_ID" + rowno).val());
        let ItemDescA = $("#txtDescA" + rowno).val();
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("StkDefItems", "chackItem"),
            data: {//int CompCode, string ItemCode, string ItemDescA, int ItemID, bool IsCode
                compCode: compcode, ItemCode: ItemCode, ItemDescA: ItemDescA, ItemID: ItID, IsCode: IsCode
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.Response == 0) {
                    res = true;
                }
                else
                    res = false;
            }
        });
        return res;

    }
     


}












