
$(document).ready(() => {
    AccDefReceipts.InitalizeComponent();
})

namespace AccDefReceipts{

    var AccType = 21;
    var TrType: number = 1;
    var MSG_ID: number;
    var Details: Array<A_RecPay_D_Accounts> = new Array<A_RecPay_D_Accounts>();
    var DetailsModel: Array<A_RecPay_D_Accounts> = new Array<A_RecPay_D_Accounts>();

    var Details_Acount: Array<A_ACCOUNT> = new Array<A_ACCOUNT>();

    //var Details: Array<I_D_Category> = new Array<I_D_Category>();
    var btnNew_sub_Add_service: HTMLButtonElement;
    var btnSave_Def: HTMLButtonElement;
    var btnAddDetails: HTMLButtonElement;
    var btnEdit: HTMLButtonElement;
    var sys: SystemTools = new SystemTools();
    //var sys: _shared = new _shared();
    var SysSession: SystemSession = GetSystemSession(Modules.AccDefReceipts);
    var Model: A_RecPay_D_Accounts = new A_RecPay_D_Accounts();

    var CountGrid = 0;
    var compcode: Number;//SharedSession.CurrentEnvironment.CompCode;
    var btnBack_Def: HTMLButtonElement;


    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);

    export function InitalizeComponent() {

        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = "  حسابات إلايراد ";

        } else {
            document.getElementById('Screen_name').innerHTML = "Revenue Accounts";

        }
        $('#icon-bar').addClass('hidden_Control');
        $('#divIconbar').addClass('hidden_Control');
        $('#divIconbar').addClass('d-none');
        $('#iconbar_Definition').removeClass('hidden_Control');
        $("#divShow").removeClass("display_none");


        ////debugger;
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        InitalizeControls();
        InitalizeEvents();

        Display_Acount_Code();
        Display();



    }

    $('#btnUpdate_Def').on('click', function () {

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
        ////debugger;
        btnAddDetails = document.getElementById("btnAddDetails") as HTMLButtonElement;
        btnEdit = document.getElementById("btnUpdate_Def") as HTMLButtonElement;
        btnSave_Def = document.getElementById("btnSave_Def") as HTMLButtonElement;
        btnBack_Def = document.getElementById("btnBack_Def") as HTMLButtonElement;

        // Buton privialges for single record page



    }

    function InitalizeEvents() {
        ////debugger;
        btnAddDetails.onclick = AddNewRow;//
        btnSave_Def.onclick = btnsave_onClick;
        btnBack_Def.onclick = btnback_onclick;
    }

    function AddNewRow() {
        ////debugger
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
            $("#txtAcount_Code" + CountGrid).removeAttr("disabled");

            // can delete new inserted record  without need for delete privilage
            $("#btn_minus" + CountGrid).removeClass("display_none");
            $("#btn_minus" + CountGrid).removeAttr("disabled");

            //$(".btn-minus").addClass("display_none");
            $("#btnUpdate_Def").removeClass("display_none");

            CountGrid++;
        }
        $("#btnUpdate_Def").addClass("display_none");



        $(document).ready(function () {
            // Initialize select2
            $(".ddlAcc").select2();

            // Read selected option
            $('#but_read').click(function () {
                var username = $('.ddlAcc option:selected').text();
                var userid = $('.ddlAcc').val();


                $('#result').html("id : " + userid + ", name : " + username);
            });
        });
    }


    function BuildControls(cnt: number) {
        var html;
        ////debugger;
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
                        <select id="txtAcount_Code${cnt}" class="form-control ddlAcc"  disabled="disabled"> 
			                <option value="Null">${(lang == "ar" ? "رقم الحساب" : "Account number")}</option>
			            </select >
	                </td>
                    
               <input id = "txt_StatusFlag${cnt}" name = " " type = "hidden" disabled class="form-control"/>
               <input id = "txt_ID${cnt}" name = " " type = "hidden" disabled class="form-control"/>
                </tr>`;

        $("#div_Data").append(html);

        for (var i = 0; i < Details_Acount.length; i++) {
            //debugger;


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
        $("#txtAcount_Code" + cnt).on('change', function () {
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


        return;
    }


    function Display_Acount_Code() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GLDefAccount", "GetAccDetailByComp"),
            data: {
                CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    Details_Acount = result.Response as Array<A_ACCOUNT>;

                }
            }
        });
    }

    function btnsave_onClick() {
        ////debugger;
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


        if (DetailsModel.length > 0) {
            DetailsModel[0].Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
            DetailsModel[0].UserCode = SysSession.CurrentEnvironment.UserCode;
            DetailsModel[0].Branch_Code = SysSession.CurrentEnvironment.BranchCode;
            DetailsModel[0].Comp_Code = SysSession.CurrentEnvironment.CompCode;
            DetailsModel[0].MODULE_CODE = Modules.AccDefReceipts;
            DetailsModel[0].sec_FinYear = SysSession.CurrentEnvironment.CurrentYear;
        }

        Ajax.Callsync({

            type: "POST",
            url: sys.apiUrl("AccDefAccounts", "UpdateLst"),
            data: JSON.stringify(DetailsModel),
            success: (d) => {
                //debugger
                let result = d as BaseResponse;
                if (result.IsSuccess == true) {
                    MessageBox.Show("تم الحفظ", "الحفظ");
                    btnback_onclick();
                    refresh();
                    Save_Succ_But();
                }
                else {
                    //debugger;
                    MessageBox.Show(result.ErrorMessage, "خطأ");
                }
            }
        });
    }

    function Assign() {
        var StatusFlag: String;
        for (var i = 0; i < CountGrid; i++) {
            DetailsModel = new Array<A_RecPay_D_Accounts>();
            Model = new A_RecPay_D_Accounts();

            StatusFlag = $("#txt_StatusFlag" + i).val();


            if (StatusFlag == "i") {
                Model.StatusFlag = StatusFlag.toString();
                Model.ExpenseID = 0;
                Model.CompCode = Number(SysSession.CurrentEnvironment.CompCode);
                Model.TrType = Number(TrType);
                Model.ExpCode = $("#txtCode" + i).val();
                if ($("#txtDescA" + i).val() == "") {
                    Model.ExpDescA = $("#txtDescL" + i).val();
                    $("#txtDescA" + i).val($("#txtDescL" + i).val());
                }
                else {
                    Model.ExpDescA = $("#txtDescA" + i).val();
                }
                if ($("#txtDescL" + i).val() == "") {
                    Model.ExpDescE = $("#txtDescA" + i).val();
                    $("#txtDescL" + i).val($("#txtDescA" + i).val());
                }
                else {
                    Model.ExpDescE = $("#txtDescL" + i).val();
                }
                if ($("#txtAcount_Code" + i).val() == "Null") {
                    Model.ExpAccountCode = "0";
                }
                else {
                    Model.ExpAccountCode = $("#txtAcount_Code" + i).val();
                }
                DetailsModel.push(Model);

            }
            if (StatusFlag == "u") {

                Model.StatusFlag = StatusFlag.toString();
                Model.ExpenseID = Number($("#txt_ID" + i).val());
                Model.CompCode = Number(SysSession.CurrentEnvironment.CompCode);
                Model.TrType = Number(TrType);
                Model.ExpCode = $("#txtCode" + i).val();
                if ($("#txtDescA" + i).val() == "") {
                    Model.ExpDescA = $("#txtDescL" + i).val();
                    $("#txtDescA" + i).val($("#txtDescL" + i).val());
                }
                else {
                    Model.ExpDescA = $("#txtDescA" + i).val();
                }
                if ($("#txtDescL" + i).val() == "") {
                    Model.ExpDescE = $("#txtDescA" + i).val();
                    $("#txtDescL" + i).val($("#txtDescA" + i).val());
                }
                else {
                    Model.ExpDescE = $("#txtDescL" + i).val();
                }
                if ($("#txtAcount_Code" + i).val() == "Null") {
                    Model.ExpAccountCode = "0";
                }
                else {
                    Model.ExpAccountCode = $("#txtAcount_Code" + i).val();
                }
                DetailsModel.push(Model);


            }
            if (StatusFlag == "d") {
                if ($("#txt_ID" + i).val() != "") {
                    Model.StatusFlag = StatusFlag.toString();
                    Model.ExpenseID = Number($("#txt_ID" + i).val());
                    Model.CompCode = Number(SysSession.CurrentEnvironment.CompCode);
                    Model.TrType = Number(TrType);
                    Model.ExpCode = $("#txtCode" + i).val();
                    if ($("#txtDescA" + i).val() == "") {
                        Model.ExpDescA = $("#txtDescL" + i).val();
                        $("#txtDescA" + i).val($("#txtDescL" + i).val());
                    }
                    else {
                        Model.ExpDescA = $("#txtDescA" + i).val();
                    }
                    if ($("#txtDescL" + i).val() == "") {
                        Model.ExpDescE = $("#txtDescA" + i).val();
                        $("#txtDescL" + i).val($("#txtDescA" + i).val());
                    }
                    else {
                        Model.ExpDescE = $("#txtDescL" + i).val();
                    }
                    if ($("#txtAcount_Code" + i).val() == "Null") {
                        Model.ExpAccountCode = "0";
                    }
                    else {
                        Model.ExpAccountCode = $("#txtAcount_Code" + i).val();
                    }
                    DetailsModel.push(Model);
                }

            }


        }
    }

    function Display() {
        var AccDefAccounts: Array<A_RecPay_D_Accounts> = new Array<A_RecPay_D_Accounts>();
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefAccounts", "GetAll"),
            data: {
                CompCode: compcode, TrType: TrType, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                //debugger;
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    Details = result.Response as Array<A_RecPay_D_Accounts>;

                    DisplayAccDefAccounts();
                }
            }
        });
    }

    function DisplayAccDefAccounts() {
        for (var i = 0; i < Details.length; i++) {

            BuildControls(CountGrid);
            CountGrid++;
            $("#txt_ID" + i).val(Details[i].ExpenseID);
            $("#txtCode" + i).val(Details[i].ExpCode);
            $("#txtDescA" + i).val(Details[i].ExpDescA);
            $("#txtDescL" + i).val(Details[i].ExpDescE);

            //debugger
            try {
                for (var u = 0; u < Details_Acount.length; u++) {

                    if (Details[i].ExpAccountCode == Details_Acount[u].ACC_CODE) {
                        $("#txtAcount_Code" + i).prop("value", Details[i].ExpAccountCode);
                        break;
                    }
                    else {
                        $("#txtAcount_Code" + i).prop("value", "Null");
                        //break;
                    }
                }

            } catch (e) {

                $("#txtAcount_Code" + i).prop("value", "Null");

            }


            $("#txt_StatusFlag" + i).val("");





        }


        $(document).ready(function () {
            // Initialize select2
            $(".ddlAcc").select2();

            // Read selected option
            $('#but_read').click(function () {
                var username = $('.ddlAcc option:selected').text();
                var userid = $('.ddlAcc').val();


                $('#result').html("id : " + userid + ", name : " + username);
            });
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
        $("#div_ContentData :input").attr("disabled", "true");
        $(".btn-minus").addClass("display_none");
        $("#btnUpdate_Def").removeClass("display_none");
        $("#btnUpdate_Def").removeAttr("disabled");

        CountGrid = 0;
        $("#div_Data").html("");
        Display();

    }

    function Validation_Grid(rowcount: number) {

        if ($("#txt_StatusFlag" + rowcount).val() == "d" || $("#txt_StatusFlag" + rowcount).val() == "m") {
            return true;
        }

        if ($("#txtDescA" + rowcount).val().trim() == "") {
            $("#txtDescA" + rowcount).val($("#txtDescL" + rowcount).val());
        }
        if ($("#txtDescL" + rowcount).val().trim() == "") {
            $("#txtDescL" + rowcount).val($("#txtDescL" + rowcount).val());
        }
        if (($("#txtCode" + rowcount).val().trim() == "")) {
            if (lang == "ar") {
                MessageBox.Show(" ادخل كود ", "خطأ");
            }
            else {
                MessageBox.Show(" Must Enter Code", "Error");
            }
            Errorinput($("#txtCode" + rowcount));
            return false;
        }
        if (($("#txtDescA" + rowcount).val().trim() == "")) {
            if (lang == "ar") {
                MessageBox.Show(" ادخل الوصف العربي", "خطأ");
            }
            else {
                MessageBox.Show(" Must Arabic describtion ", "Error");
            }
            Errorinput($("#txtDescA" + rowcount));

            return false;
        }
        if (($("#txtAcount_Code" + rowcount).val() == "Null")) {
            if (lang == "ar") {
                MessageBox.Show(" ادخل اختار رقم الحساب", "خطأ");
            }
            else {
                MessageBox.Show(" Must select Account number", "Error");
            }
            Errorinput($("#txtAcount_Code" + rowcount));

            return false;
        }

        return true;
    }

    function Validate_code(rowno: number) {
        //debugger
        for (var i = 0; i < CountGrid; i++) {
            if (i != rowno) {

                if ($("#txt_StatusFlag" + i).val() == "d" || $("#txt_StatusFlag" + i).val() == "m") {
                    return true;

                }
                else {

                    if ($("#txtCode" + rowno).val() == $("#txtCode" + i).val())
                        WorningMessage("لا يمكن تكرار رقم الكود " + $("#txtCode" + rowno).val(), "code cannot br repeated?", "تحذير", "worning", () => {
                            $("#txtCode" + rowno).val("");
                            return false;
                        });
                }
            }
        }
        return true;
    }


}












