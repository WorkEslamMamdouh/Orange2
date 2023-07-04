
$(document).ready(() => {
     GenDefCustomerCat.InitalizeComponent();
})

namespace GenDefCustomerCat {

    var AccType = 4;
    var AccountType: Number = 1;
    var MSG_ID: number;
    var Details: Array<A_RecPay_D_Category> = new Array<A_RecPay_D_Category>();
	var DetailsModel: Array<A_RecPay_D_Category> = new Array<A_RecPay_D_Category>();
	 

    var Details_Acount: Array<A_ACCOUNT> = new Array<A_ACCOUNT>();

    //var Details: Array<I_D_Category> = new Array<I_D_Category>();
    var btnNew_sub_Add_service: HTMLButtonElement;
    var btnSave_Def: HTMLButtonElement;
    var btnAddDetails: HTMLButtonElement;
    var btnEdit: HTMLButtonElement;
    var sys: SystemTools = new SystemTools();
    //var sys: _shared = new _shared();
    var SysSession: SystemSession = GetSystemSession(Modules.GenDefCustomerCat);
    var Model: A_RecPay_D_Category = new A_RecPay_D_Category();

    var CountGrid = 0;
    var compcode: Number;//SharedSession.CurrentEnvironment.CompCode;
    var btnBack_Def: HTMLButtonElement;

    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);
    var IsAutoCode = SysSession.CurrentEnvironment.I_Control[0].IsAutoNoCustVendor;
    export function InitalizeComponent() {


        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = "فئات العملاء";

        } else {
            document.getElementById('Screen_name').innerHTML = "Customers Categories";

        }

        $('#divIconbar').addClass('hidden_Control');
        $('#icon-bar').addClass('d-none');
        $('#iconbar_Definition').removeClass('hidden_Control');
        $("#divShow").removeClass("display_none");

        // 
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        InitalizeControls();
        InitalizeEvents();
     
        Display_Acount_Code();
        Display();



    }

    $('#btnUpdate_Def').on('click', function () {
        debugger 
        if (SysSession.CurrentPrivileges.EDIT) {
            $('#btnSave_Def').removeClass("display_none");
            $('#btnBack_Def').removeClass("display_none");
            $("#div_ContentData :input").removeAttr("disabled");
            $("#btnUpdate_Def").addClass("display_none");
        }
         
        if (SysSession.CurrentPrivileges.AddNew) {
            $(".btnAddDetails").removeAttr("disabled");
            $('#btnAddDetails').removeClass("display_none");
        }
        else {
            $(".btnAddDetails").attr("disabled", "disabled");

        }
        if (SysSession.CurrentPrivileges.Remove) {
            $(".btn-minus").removeClass("display_none");

        }
        else {

            $(".btn-minus").addClass("display_none");

        }

    });

    function InitalizeControls() {
        // 
        btnAddDetails = document.getElementById("btnAddDetails") as HTMLButtonElement;
        btnEdit = document.getElementById("btnUpdate_Def") as HTMLButtonElement;
        btnSave_Def = document.getElementById("btnSave_Def") as HTMLButtonElement;
        btnBack_Def = document.getElementById("btnBack_Def") as HTMLButtonElement;

        // Buton privialges for single record page



    }

    function InitalizeEvents() {
        // 
        btnAddDetails.onclick = AddNewRow;//
        btnSave_Def.onclick = btnSave_Def_onClick;
        btnBack_Def.onclick = btnBack_Def_onclick;
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
            $("#txt_StatusFlag" + CountGrid).val("i"); //In Insert mode

            $("#txtCode" + CountGrid).removeAttr("disabled");
            $("#txtDescA" + CountGrid).removeAttr("disabled");
            $("#txtDescL" + CountGrid).removeAttr("disabled");
            $("#CodePrefex" + CountGrid).removeAttr("disabled");
            $("#LastNumber" + CountGrid).removeAttr("disabled");
            $("#txtAcount_Code" + CountGrid).removeAttr("disabled");
             
            $("#btn_minus" + CountGrid).removeClass("display_none");
            $("#btn_minus" + CountGrid).removeAttr("disabled");
             
            $("#btnUpdate_Def").removeClass("display_none");

            CountGrid++;
        }
        $("#btnUpdate_Def").addClass("display_none");
    }


    function BuildControls(cnt: number) {
        var html;
        // 
        html = `<tr id= "No_Row${cnt}"> 
                    <td>
		                <div class="form-group">
			                <span id="btn_minus${cnt}" class="btn-minus"><i class="fas fa-minus-circle  btn-minus"></i></span>
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
                            <input id="txtDescL${cnt}" type="text" class="form-control" name="" disabled />
		                </div>
	                </td> 
                    <td>
                        <div class="form-group">
                            <select id="txtAcount_Code${cnt}" class="form-control"  disabled> 
		                        <option value="Null">${(lang == "ar" ? "رقم الحساب" : "Account number")}</option>
		                    </select >
                        </div>
	                </td>
                    <td>
		                <div class="form-group">
                            <input id="CodePrefex${cnt}" type="text" class="form-control" name="" disabled />
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
                            <input id="LastNumber${cnt}" type="text" class="form-control" name="" disabled />
		                </div>
	                </td>
                    
		        <input id = "txt_StatusFlag${cnt}" name = " " type = "hidden" disabled class="form-control"/></div>
		        <input id = "txt_ID${cnt}" name = " " type = "hidden" disabled class="form-control"/></div>
                </tr>`;

        $("#div_Data").append(html);

        for (var i = 0; i < Details_Acount.length; i++) {

            $('#txtAcount_Code' + cnt).append('<option value="' + Details_Acount[i].ACC_CODE + '">' + (lang == "ar" ? Details_Acount[i].ACC_DESCA : Details_Acount[i].ACC_DESCL) + '</option>');
        }


        $("#btn_minus" + cnt).on('click', function () {
            DeleteRow(cnt);
        });
        $("#txtCode" + cnt).on('change', function () {
            Validate_code(cnt);
        });
        $("#txtDescA" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        $("#txtDescL" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        $("#CodePrefex" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        $("#LastNumber" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        $("#txtAcount_Code" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
             
            $("#CodePrefex" + cnt).val($("#txtAcount_Code" + cnt).val());

            $("#LastNumber" + cnt).val('0001');

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


        $(document).ready(function () {
            // Initialize select2
            $("#txtAcount_Code" + cnt).select2();

            // Read selected option
            $('#but_read' + cnt).click(function () {
                var username = $('#txtAcount_Code' + cnt + ' option:selected').text();
                var userid = $('#txtAcount_Code' + cnt + '').val();

                $('#result').html("id : " + userid + ", name : " + username);
            });
        });





        return;
    }


    function Display_Acount_Code() {
        //var StkDefCategory: Array<G_USERS> = new Array<G_USERS>();
          
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GLDefAccount", "GetByTypeAuto"),
            data: {
                CompCode: compcode, AccType: AccType, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                     
                    Details_Acount = result.Response as Array<A_ACCOUNT>;

                    if (!IsAutoCode) {
                        Details_Acount = Details_Acount.filter(x => x.DETAIL == true)
                    }

                    //DisplayStkG_USERS();
                }
            }
        });
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
            }
        }, 100);
    }

    function refresh() {

        $('#div_Data').html("");

        CountGrid = 0;

        Display();

    }


    function Update() {
		Assign();
		if (DetailsModel.length > 0) {

		DetailsModel[0].Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
		DetailsModel[0].UserCode = SysSession.CurrentEnvironment.UserCode;

		DetailsModel[0].Branch_Code = SysSession.CurrentEnvironment.BranchCode;
		DetailsModel[0].Comp_Code = SysSession.CurrentEnvironment.CompCode;
		DetailsModel[0].MODULE_CODE = Modules.GenDefCustomerCat; 
		DetailsModel[0].sec_FinYear = SysSession.CurrentEnvironment.CurrentYear;

		}
         
        Ajax.Callsync({

            type: "POST",
            url: sys.apiUrl("GenDefCategory", "UpdateLst"),
			data: JSON.stringify(DetailsModel),
            success: (d) => {
                 
                let result = d as BaseResponse;
                if (result.IsSuccess == true) {
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
                        MessageBox.Show("تم الحفظ", "");
                    } else {
                        MessageBox.Show("Done", "");
                    }
                    
                    btnBack_Def_onclick();
                    refresh();
                    Save_Succ_But();

                }
                else {
                     
                    MessageBox.Show(result.ErrorMessage, "خطأ");
                }
            }
        });
    }

    function Assign() {			 
		DetailsModel = new Array<A_RecPay_D_Category>();
        for (var i = 0; i < CountGrid; i++) {
            Model = new A_RecPay_D_Category();

             

			if ($("#txt_StatusFlag" + i).val() == "i") {
				Model.StatusFlag = "i";

                Model.CatID = 0;
                Model.CompCode = Number(SysSession.CurrentEnvironment.CompCode);
                Model.AccountType = Number(AccountType);
                Model.CreatedBy = SysSession.CurrentEnvironment.UserCode;
                Model.UpdatedBy = "";

                Model.CatCode = $("#txtCode" + i).val();
                if ($("#txtDescA" + i).val() == "") {
                    Model.Cat_DescA = $("#txtDescL" + i).val();
                    $("#txtDescA" + i).val($("#txtDescL" + i).val());
                }
                else {
                    Model.Cat_DescA = $("#txtDescA" + i).val();
                }
                if ($("#txtDescL" + i).val() == "") {
                    Model.Cat_DescE = $("#txtDescA" + i).val();
                    $("#txtDescL" + i).val($("#txtDescA" + i).val());
                }
                else {
                    Model.Cat_DescE = $("#txtDescL" + i).val();
                }
                if ($("#txtAcount_Code" + i).val() == "Null") {
                    Model.AccountCode = "0";
                }
                else {
                    Model.AccountCode = $("#txtAcount_Code" + i).val();
                }
                Model.CodePrefex = $("#CodePrefex" + i).val();
                Model.LastNumber = $("#LastNumber" + i).val();
				DetailsModel.push(Model);




                //Model.CompCode = Number(compcode);
            }
			if ($("#txt_StatusFlag" + i).val() == "u") {
                 
				Model.StatusFlag = "u";


                Model.CatID = Number($("#txt_ID" + i).val());
                Model.CompCode = Number(SysSession.CurrentEnvironment.CompCode);
                Model.AccountType = Number(AccountType);
                Model.CreatedBy = SysSession.CurrentEnvironment.UserCode;
                Model.UpdatedBy = SysSession.CurrentEnvironment.UserCode;;

                Model.CatCode = $("#txtCode" + i).val();
                if ($("#txtDescA" + i).val() == "") {
                    Model.Cat_DescA = $("#txtDescL" + i).val();
                    $("#txtDescA" + i).val($("#txtDescL" + i).val());
                }
                else {
                    Model.Cat_DescA = $("#txtDescA" + i).val();
                }
                if ($("#txtDescL" + i).val() == "") {
                    Model.Cat_DescE = $("#txtDescA" + i).val();
                    $("#txtDescL" + i).val($("#txtDescA" + i).val());
                }
                else {
                    Model.Cat_DescE = $("#txtDescL" + i).val();
                }
                if ($("#txtAcount_Code" + i).val() == "Null") {
                    Model.AccountCode = "0";
                }
                else {
                    Model.AccountCode = $("#txtAcount_Code" + i).val();
                }
                Model.CodePrefex = $("#CodePrefex" + i).val();
                Model.LastNumber = $("#LastNumber" + i).val();
				DetailsModel.push(Model);


            }
			if ($("#txt_StatusFlag" + i).val() == "d") {
                if ($("#txt_ID" + i).val() != "")
                {

                    Model.StatusFlag = "d";

                    Model.CatID = Number($("#txt_ID" + i).val());
                    Model.CompCode = Number(SysSession.CurrentEnvironment.CompCode);
                    Model.AccountType = Number(AccountType);
                    Model.CreatedBy = SysSession.CurrentEnvironment.UserCode;
                    Model.UpdatedBy = SysSession.CurrentEnvironment.UserCode;;
					DetailsModel.push(Model);

                }

            }


        }
    }

    function Display() {
        var GenDefCategory: Array<A_RecPay_D_Category> = new Array<A_RecPay_D_Category>();
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GenDefCategory", "GetAll"),
            data: {
                CompCode: compcode, AccountType: AccountType, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                 
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    Details = result.Response as Array<A_RecPay_D_Category>;

                    debugger
                    console.log(Details);
                    DisplayGenDefCategory();
                }
            }
        });
    }

    function DisplayGenDefCategory() {
        for (var i = 0; i < Details.length; i++) {

            BuildControls(CountGrid);
            CountGrid++;
            $("#txt_ID" + i).val(Details[i].CatID);
            $("#txtCode" + i).val(Details[i].CatCode);
            $("#txtDescA" + i).val(Details[i].Cat_DescA);
            $("#txtDescL" + i).val(Details[i].Cat_DescE);
            $('#txtAcount_Code' + i + ' option[value=' + Details[i].AccountCode + ']').prop('selected', 'selected').change();
            $("#CodePrefex" + i).val(Details[i].CodePrefex);
            $("#LastNumber" + i).val(Details[i].LastNumber);
          
            $("#txt_StatusFlag" + i).val("");
        }
    }

    function DeleteRow(RecNo: number) {

        if (!SysSession.CurrentPrivileges.Remove) return;
        WorningMessage("هل تريد الحذف؟", "Do you want to delete?", "تحذير", "worning", () => {
             


            $("#No_Row" + RecNo).attr("hidden", "true");
            $("#txt_StatusFlag" + RecNo).val() == 'i' ? $("#txt_StatusFlag" + RecNo).val('m') : $("#txt_StatusFlag" + RecNo).val('d'); 
            $("#txtCode" + RecNo).val("000");
        });
    }

    function btnBack_Def_onclick()
    {

        $('#btnAddDetails').addClass("display_none");
        $('#btnSave_Def').addClass("display_none");
        $('#btnBack_Def').addClass("display_none");
        $("#div_ContentData :input").attr("disabled", "true");
        $(".btn-minus").addClass("display_none");
        $("#btnUpdate_Def").removeClass("display_none");
        $("#btnUpdate_Def").removeAttr("disabled");

        CountGrid = 0;
        $("#div_Data").html("");
        Display();

    }

    function Validation_Grid(rowcount: number) {
        debugger
        if ($("#txt_StatusFlag" + rowcount).val() == "d" || $("#txt_StatusFlag" + rowcount).val() == "m") {
            return true;
        }
        else {

            if ($("#txtDescA" + rowcount).val() == "") {
                $("#txtDescA" + rowcount).val($("#txtDescL" + rowcount).val());
            }
            if ($("#txtDescL" + rowcount).val() == "") {
                $("#txtDescL" + rowcount).val($("#txtDescL" + rowcount).val());
            }
             
            if ($("#txtCode" + rowcount).val() == '') {

                WorningMessage('ادخل كود', 'Enter The code', 'خطاء', 'Erorr');
                Errorinput($("#txtCode" + rowcount));
                return false;

            }
            if ((lang == "ar" ? $("#txtDescA" + rowcount).val() : $("#txtDescL" + rowcount).val())  == '' ) {

                WorningMessage('ادخل الوصف ', 'Enter The Description', 'خطاء', 'Erorr');
                Errorinput((lang == "ar" ? $("#txtDescA" + rowcount) : $("#txtDescL" + rowcount)));
                return false;

            } 
            if ($("#txtAcount_Code" + rowcount).val() == 'Null') {
                WorningMessage('اختار رقم الحساب', 'Enter The code', 'خطاء', 'Erorr');
                Errorinput($("#txtAcount_Code" + rowcount));
                return false;

            }
        
        }
        return true;
    }

    function Validate_code(rowno: number) {
         
        for (var i = 0; i < CountGrid; i++) {
            if (i != rowno) {

                if ($("#txt_StatusFlag" + i).val() == "d" || $("#txt_StatusFlag" + i).val() == "m") {
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












