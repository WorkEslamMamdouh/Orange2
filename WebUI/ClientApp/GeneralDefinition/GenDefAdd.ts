
$(document).ready(() => {
    GenDefAdd.InitalizeComponent();
})

namespace GenDefAdd {

    var AccountType: Number = 1;
    var MSG_ID: number;
    var Details: Array<I_Pur_D_Charges> = new Array<I_Pur_D_Charges>();
    var Model_Details: Array<I_Pur_D_Charges> = new Array<I_Pur_D_Charges>();

    //var Details: Array<I_D_Category> = new Array<I_D_Category>();
    var btnNew_sub_Add_service: HTMLButtonElement;
    var btnSave_Def: HTMLButtonElement;
    var btnAddDetails: HTMLButtonElement;
    var btnEdit: HTMLButtonElement;
    var sys: SystemTools = new SystemTools();
    //var sys: _shared = new _shared();
    var SysSession: SystemSession = GetSystemSession(Modules.GenDefAdd);
    var Model: I_Pur_D_Charges = new I_Pur_D_Charges();
    var VatTypeData: Array<A_D_VAT_TYPE> = new Array<A_D_VAT_TYPE>();
    var AccDataData: Array<A_ACCOUNT> = new Array<A_ACCOUNT>();
    var AccDataDatacode: Array<A_ACCOUNT> = new Array<A_ACCOUNT>();
    var CountGrid = 0;
    var compcode: Number;//SharedSession.CurrentEnvironment.CompCode;
    var btnBack_Def: HTMLButtonElement;

    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);


    export function InitalizeComponent() {
        //debugger
        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = "مصاريف المشتريات";

        } else {
            document.getElementById('Screen_name').innerHTML = "Purchase Outlay";

        }
        $('#divIconbar').addClass('hidden_Control');
        $('#icon-bar').addClass('d-none');
        $('#iconbar_Definition').removeClass('hidden_Control');
        $("#divShow").removeClass("display_none");

        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        InitalizeControls();
        InitalizeEvents();

        GetVatType();
        GetddlAcc(); 
        Display();
    }

    $('#btnUpdate_Def').on('click', function () {
        debugger
        if (SysSession.CurrentPrivileges.EDIT) {
            $('#btnSave_Def').removeClass("display_none");
            $('#btnBack_Def').removeClass("display_none");
            $("#div_Data :input").removeAttr("disabled");
            $("#Defaultperc").removeAttr("disabled");
            $("#VatType").removeAttr("disabled");
            $("#btnUpdate_Def").addClass("display_none");
            $('.btn-minus').removeClass("display_none");

        }

        if (SysSession.CurrentPrivileges.AddNew) {
            $(".btnAddDetails").removeAttr("disabled");
            $('#btnAddDetails').removeClass("display_none");
        }
        else {
            $(".btnAddDetails").attr("disabled", "disabled");

        }
        if (SysSession.CurrentPrivileges.Remove) {
            $(".minus_btn").removeClass("display_none");

        }
        else {

            $(".minus_btn").addClass("display_none");

        }

    });

    function InitalizeControls() {
        // ;
        btnAddDetails = document.getElementById("btnAddDetails") as HTMLButtonElement; 
        btnSave_Def = document.getElementById("btnSave_Def") as HTMLButtonElement;
        btnBack_Def = document.getElementById("btnBack_Def") as HTMLButtonElement;

        // Buton privialges for single record page



    }

    function InitalizeEvents() {
        // ;
        btnAddDetails.onclick = AddNewRow;//
        btnSave_Def.onclick = btnsave_onClick;
        btnBack_Def.onclick = btnback_onclick;
    }

    function AddNewRow() {
        // 
        if (!SysSession.CurrentPrivileges.AddNew) return;
        var CanAdd: boolean = true;
        if (CountGrid > 0) {
            for (var i = 0; i < CountGrid; i++) {
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
            $("#VatType" + CountGrid).removeAttr("disabled");
            $("#ddlAcc" + CountGrid).removeAttr("disabled");
            $("#Defaultperc" + CountGrid).removeAttr("disabled");
            $("#ddlAccop" + CountGrid).removeAttr("disabled");

            // can delete new inserted record  without need for delete privilage
            $("#btn_minus" + CountGrid).removeClass("display_none");
            $("#btn_minus" + CountGrid).removeAttr("disabled");
            $("#btnUpdate_Def").removeClass("display_none");

            CountGrid++;
        }

        $("#btnUpdate_Def").addClass("display_none");

        $(document).ready(function () {
            // Initialize select2
            $(".ddlAcc").select2();
            $(".ddlAccop").select2();

            // Read selected option
            $('#but_read').click(function () {
                var username = $('.ddlAcc option:selected').text();
                var userid = $('.ddlAcc').val();

                var username = $('.ddlAccop option:selected').text();
                var userid = $('.ddlAccop').val();


                $('#result').html("id : " + userid + ", name : " + username);
            });
        });
    }


    function BuildControls(cnt: number) {
        var html;

        html = `<tr id= "No_Row${cnt}"> 
                    <td>
		                <div class="form-group">
			                <span id="btn_minus${cnt}" class="btn-minus" ><i class="fas fa-minus-circle btn-minus"></i></span>
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
                            <input id="Defaultperc${cnt}" type="Number" class="form-control" name="" disabled />
		                </div>
	                </td>
                    <td>
                        <div class="form-group">
                            <select id="VatType${cnt}" disabled   class="form-control ">
			                      <option value="Null">${(lang == "ar" ? "اختر الضريبه" : "Choose Tax")}</option>
			                </select>
                        </div>
	                </td>
                    <td>
                        <div class="form-group">
                            <select style="display: none;"  id="ddlAcc${cnt}" disabled   class="form-control ">
			                  <option value="Null">${(lang == "ar" ? "اختر رقم الحساب" : "Choose Account Number")}</option>
			                </select>
                        </div>
	                </td>
                    <td>
                        <div class="form-group">
                            <select style="display: none;"  id="ddlAccop${cnt}" disabled   class="form-control">
			                  <option value="Null">${(lang == "ar" ? "اختر رقم الحساب" : "Choose Account Number")}</option>
			                </select>
 		            <input id = "txt_StatusFlag${cnt}" name = " " type ="text" disabled class="form-control display_none"/>
		            <input id = "txt_ID${cnt}" name = " " type = "text" disabled class="form-control display_none"/>

                        </div>
	                </td>
                    
		          
                </tr>`;


        $("#div_Data").append(html);

        $("#btn_minus" + cnt).on('click', function () {
            DeleteRow(cnt);
        });
        $("#txtCode" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");

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

        $("#VatType" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        $("#ddlAcc" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        }); $("#ddlAccop" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        $("#Defaultperc" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
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

        for (var i = 0; i < VatTypeData.length; i++) {
            if (SysSession.CurrentEnvironment.ScreenLanguage == "ar")
                $('#VatType' + cnt).append('<option value="' + VatTypeData[i].CODE + '">' + VatTypeData[i].DESCRIPTION + '</option>');
            else
                $('#VatType' + cnt).append('<option value="' + VatTypeData[i].CODE + '">' + VatTypeData[i].DESCRIPTION + '</option>');
        }
        for (var i = 0; i < AccDataData.length; i++) {
            if (SysSession.CurrentEnvironment.ScreenLanguage == "ar")
                $('#ddlAcc' + cnt).append('<option value="' + AccDataData[i].ACC_CODE + '">' + AccDataData[i].ACC_DESCA + '</option>');
            else
                $('#ddlAcc' + cnt).append('<option value="' + AccDataData[i].ACC_CODE + '">' + AccDataData[i].ACC_DESCL + '</option>');
        }
        for (var i = 0; i < AccDataDatacode.length; i++) {
            if (SysSession.CurrentEnvironment.ScreenLanguage == "ar")
                $('#ddlAccop' + cnt).append('<option value="' + AccDataDatacode[i].ACC_CODE + '">' + AccDataDatacode[i].ACC_DESCA + '</option>');
            else
                $('#ddlAccop' + cnt).append('<option value="' + AccDataDatacode[i].ACC_CODE + '">' + AccDataDatacode[i].ACC_DESCL + '</option>');
        }


        $(document).ready(function () {
            // Initialize select2
            $("#ddlAcc" + cnt).select2();
            $("#ddlAccop" + cnt).select2();

            // Read selected option
            $('#but_read' + cnt).click(function () {
                var username = $('#ddlAcc' + cnt + ' option:selected').text();
                var userid = $('#ddlAcc' + cnt + '').val();

                var username = $('#ddlAccop' + cnt + ' option:selected').text();
                var userid = $('#ddlAccop' + cnt + '').val();


                $('#result').html("id : " + userid + ", name : " + username);
            });
        });


        return;
    }

    function btnsave_onClick() {
        loading('btnSave_Def');

        setTimeout(function () {

            finishSave('btnSave_Def');
            var CanAdd: boolean = true;
            if (CountGrid > 0) {
                for (var i = 0; i < CountGrid; i++) {
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
        debugger
        if (Model_Details.length > 0) {
            Model_Details[0].Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
            Model_Details[0].UserCode = SysSession.CurrentEnvironment.UserCode;

            Model_Details[0].Branch_Code = SysSession.CurrentEnvironment.BranchCode;
            Model_Details[0].Comp_Code = SysSession.CurrentEnvironment.CompCode;
            Model_Details[0].MODULE_CODE = Modules.GenDefAdd;
            Model_Details[0].sec_FinYear = SysSession.CurrentEnvironment.CurrentYear;

            Ajax.Callsync({

                type: "POST",
                url: sys.apiUrl("GenDefAdd", "UpdateLst"),
                data: JSON.stringify(Model_Details),
                success: (d) => {

                    let result = d as BaseResponse;
                    if (result.IsSuccess == true) {
                        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
                            MessageBox.Show("تم الحفظ", "");
                        } else {
                            MessageBox.Show("Done", "");
                        }
                        btnback_onclick();
                        refresh();
                        Save_Succ_But();

                    }
                    else {
                        MessageBox.Show(result.ErrorMessage, "خطأ");
                    }
                }
            });

        }

    }

    function Assign() {
        debugger
        var StatusFlag: String;
        Model_Details = new Array<I_Pur_D_Charges>();

        for (var i = 0; i < CountGrid; i++) {
            Model = new I_Pur_D_Charges();

            StatusFlag = $("#txt_StatusFlag" + i).val();

            if (StatusFlag == "i") {
                Model.ChargeID = 0;
                Model.StatusFlag = StatusFlag.toString();

                Model.CompCode = Number(SysSession.CurrentEnvironment.CompCode);
                Model.CostAddCode = $("#txtCode" + i).val();

                Model.VatType = Number($("#VatType" + i).val());
                Model.GLExpenseAcc = $("#ddlAcc" + i).val();
                Model.OPGLExpenseAcc = $("#ddlAccop" + i).val();
                Model.IsAddition = true;
                Model.IsAffectPurchaseCost = true;

                if ($("#txtDescA" + i).val() == "") {
                    Model.DESCA = $("#txtDescL" + i).val();
                    $("#txtDescA" + i).val($("#txtDescL" + i).val());
                }
                else {
                    Model.DESCA = $("#txtDescA" + i).val();
                }
                if ($("#txtDescL" + i).val() == "") {
                    Model.DESCL = $("#txtDescA" + i).val();
                    $("#txtDescL" + i).val($("#txtDescA" + i).val());
                }
                else {
                    Model.DESCL = $("#txtDescL" + i).val();
                }


                Model_Details.push(Model);



            }
            if (StatusFlag == "u") {

                Model.CompCode = Number(SysSession.CurrentEnvironment.CompCode);
                Model.ChargeID = Number($("#txt_ID" + i).val());
                Model.StatusFlag = StatusFlag.toString();
                Model.CostAddCode = $("#txtCode" + i).val();

                Model.VatType = Number($("#VatType" + i).val());
                Model.GLExpenseAcc = $("#ddlAcc" + i).val();
                Model.OPGLExpenseAcc = $("#ddlAccop" + i).val();
                Model.IsAddition = true;

                if ($("#txtDescA" + i).val() == "") {
                    Model.DESCA = $("#txtDescL" + i).val();
                    $("#txtDescA" + i).val($("#txtDescL" + i).val());
                }
                else {
                    Model.DESCA = $("#txtDescA" + i).val();
                }
                if ($("#txtDescL" + i).val() == "") {
                    Model.DESCL = $("#txtDescA" + i).val();
                    $("#txtDescL" + i).val($("#txtDescA" + i).val());
                }
                else {
                    Model.DESCL = $("#txtDescL" + i).val();
                }

                Model_Details.push(Model);

            }
            if (StatusFlag == "d") {

                if ($("#txt_ID" + i).val() != "") {

                    Model.CompCode = Number(SysSession.CurrentEnvironment.CompCode);
                    Model.ChargeID = Number($("#txt_ID" + i).val());
                    Model.StatusFlag = StatusFlag.toString();
                }

                Model_Details.push(Model);

            }


        }
    }

    function Display() {


        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GenDefAdd", "GetAll"),
            data: {
                CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                ;
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    Details = result.Response as Array<I_Pur_D_Charges>;
                    DisplayGenDefCategory();
                }
            }
        });
    }

    function DisplayGenDefCategory() {

        debugger
        for (var i = 0; i < Details.length; i++) {

            BuildControls(CountGrid);
            $("#txt_ID" + i).val(Details[i].ChargeID);
            $("#txtCode" + i).val(Details[i].CostAddCode);
            $("#txtDescA" + i).val(Details[i].DESCA);
            $("#txtDescL" + i).val(Details[i].DESCL);
            $("#Defaultperc" + i).val(Details[i].DefaultPerc);
            $("#VatType" + i).val(Details[i].VatType);
            $("#ddlAcc" + i).val(Details[i].GLExpenseAcc);
            $("#ddlAccop" + i).val(Details[i].OPGLExpenseAcc);

            $("#txt_StatusFlag" + i).val("");
            CountGrid++;
        }

        $(document).ready(function () {
            // Initialize select2
            $(".ddlAcc").select2();
            $(".ddlAccop").select2();

            // Read selected option
            $('#but_read').click(function () {
                var username = $('.ddlAcc option:selected').text();
                var userid = $('.ddlAcc').val();

                var username = $('.ddlAccop option:selected').text();
                var userid = $('.ddlAccop').val();


                $('#result').html("id : " + userid + ", name : " + username);
            });
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
    function GetddlAcc() {

        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GLDefAccount", "GetAccDetailByComp"),
            data: { CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                AccDataData = result.Response as Array<A_ACCOUNT>;
                AccDataDatacode = result.Response as Array<A_ACCOUNT>;
            }
        });
    } 

    function DeleteRow(RecNo: number) {

        if (!SysSession.CurrentPrivileges.Remove) return;
        WorningMessage("هل تريد الحذف؟", "Do you want to delete?", "تحذير", "worning", () => {

            $("#txt_StatusFlag" + RecNo).val() == 'i' ? $("#txt_StatusFlag" + RecNo).val('m') : $("#txt_StatusFlag" + RecNo).val('d');

            $("#No_Row" + RecNo).attr("hidden", "true");
            $("#txtCode" + RecNo).val("000");

        });
    }

    function btnback_onclick() {
        $('#btnAddDetails').addClass("display_none");
        $('#btnSave_Def').addClass("display_none");
        $('#btnBack_Def').addClass("display_none");
        $("#div_Data :input").attr("disabled", "true");
        $(".minus_btn").addClass("display_none");
        $("#btnUpdate_Def").removeClass("display_none");
        $("#btnUpdate_Def").removeAttr("disabled");
        $("#Defaultperc").attr("disabled", "disabled");
        $("#VatType").attr("disabled", "disabled");
        $("#ddlAcc").attr("disabled", "disabled");
        $("#ddlAccop").attr("disabled", "disabled");



        CountGrid = 0;
        $("#div_Data").html("");
        Display();


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
                $("#txtDescL" + rowcount).val($("#txtDescL" + rowcount).val());
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


            if (
                ($('#VatType' + rowcount).val() == "Null") && $("#txt_StatusFlag" + rowcount).val() != "d") {
                if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
                    MessageBox.Show("برجاء اختيار الضريبه", "");
                } else {
                    MessageBox.Show("Please, Enter the Tax", "");
                }
                Errorinput($('#VatType' + rowcount));
                return false;
            }
            if (
                ($('#ddlAcc' + rowcount).val() == "Null") && $("#txt_StatusFlag" + rowcount).val() != "d") {
                if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
                    MessageBox.Show("برجاء اختيار رقم الحساب المشتريات ", "");
                } else {
                    MessageBox.Show("Please, Enter Account Number", "");
                }
                Errorinput($('.select2-selection' + rowcount));
                return false;
            }
            if (
                ($('#ddlAccop' + rowcount).val() == "Null") && $("#txt_StatusFlag" + rowcount).val() != "d") {
                if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
                    MessageBox.Show("برجاء اختيار رقم الحساب العمليات", "");
                } else {
                    MessageBox.Show("Please, Enter Account Number", "");
                }
                Errorinput($('.select2-selection' + rowcount));
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
                    if ($('#txtCode' + rowno).val() == "") {
                        WorningMessage("يجب ادخال الكود", "should insert code", "تحذير", "worning");
                        return false;

                    }

                }
            }
        }
        if ($("#txt_StatusFlag" + rowno).val() != "i") $("#txt_StatusFlag" + rowno).val("u");
        return true;
    }


}












