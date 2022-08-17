
$(document).ready(() => {
    AccDefExpenses.InitalizeComponent();
})

namespace AccDefExpenses {

    var AccType = 31;
    var TrType: number = 2;
    var MSG_ID: number;
    var Details: Array<A_RecPay_D_Accounts> = new Array<A_RecPay_D_Accounts>();

    var Details_Acount: Array<A_ACCOUNT> = new Array<A_ACCOUNT>();

    //var Details: Array<I_D_Category> = new Array<I_D_Category>();
    var btnNew_sub_Add_service: HTMLButtonElement;
    var btnSave_Def: HTMLButtonElement;
    var btnAddDetails: HTMLButtonElement;
    var btnEdit: HTMLButtonElement;
    var sys: SystemTools = new SystemTools();
    //var sys: _shared = new _shared();
    var SysSession: SystemSession = GetSystemSession(Modules.AccDefExpenses);
    var Model: A_RecPay_D_Accounts = new A_RecPay_D_Accounts();

    var CountGrid = 0;
    var compcode: number;//SharedSession.CurrentEnvironment.CompCode;
    var btnBack_Def: HTMLButtonElement;

    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);


    export function InitalizeComponent() {

        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = " حسابات المصروف ";
            

        } else {
            document.getElementById('Screen_name').innerHTML = "expense accounts";

        }

        $('#divIconbar').addClass('hidden_Control');
        $('#icon-bar').addClass('d-none');
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
            $('#btnSave_Def').toggleClass("display_none");
            $('#btnBack_Def').toggleClass("display_none");
            $("#div_ContentData :input").removeAttr("disabled");
            $("#btnUpdate_Def").toggleClass("display_none");
        }
        else {
            $('#btnSave_Def').toggleClass("display_none");
            $('#btnBack_Def').toggleClass("display_none");

            $("#btnUpdate_Def").toggleClass("display_none");

        }
        if (SysSession.CurrentPrivileges.AddNew) {
            $(".btnAddDetails").removeAttr("disabled");
            $('#btnAddDetails').toggleClass("display_none");
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
        btnSave_Def.onclick = btnSave_onClick;
        btnBack_Def.onclick = btnBack_Def_onclick;
    }

    function AddNewRow() {
        ////debugger
        if (!SysSession.CurrentPrivileges.AddNew) return;
        var CanAdd: boolean = true;
        if (CountGrid > 0) {
            var LastRowNo = CountGrid - 1;
            CanAdd = Validation_Grid(LastRowNo);
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
			                <span id="btn_minus${cnt}"><i class="fas fa-minus-circle fs-4 btn-minus"></i></span>
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
                            <select id="txtAcount_Code' + cnt + '" class="form-control ddlAcc"  disabled="disabled"> 
			                    <option value="Null">${(lang == "ar" ? "رقم الحساب" : "Account number")}</option>
			                </select>
                         </div>
	                </td>
                    
               <input id = "txt_StatusFlag${cnt}" name = " " type = "hidden" disabled class="form-control"/>
               <input id = "txt_ID${cnt}" name = " " type = "hidden" disabled class="form-control"/>
                </tr>`;
        $("#div_Data").append(html);

        for (var i = 0; i < Details_Acount.length; i++) {
            //debugger;


            $('#txtAcount_Code' + cnt).append('<option value="' + Details_Acount[i].ACC_CODE + '">' + (lang == "ar" ? Details_Acount[i].ACC_DESCA  : Details_Acount[i].ACC_DESCL) + '</option>');


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
        //var StkDefCategory: Array<G_USERS> = new Array<G_USERS>();
        //debugger;
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GLDefAccount", "GetAccDetailByComp"),
            data: {
                CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    //debugger
                      Details_Acount = result.Response as Array<A_ACCOUNT>;
                    
                }
            }
        });
    }

    function btnSave_onClick() {
        ////debugger;
        loading('btnSave_Def');

        setTimeout(function () {    
            finishSave('btnSave_Def');  
        if (Validation_Grid(CountGrid - 1))
            Update();
    }, 100);
    }

    function refresh() {

        $('#div_Data').html("");

        CountGrid = 0;

        Display();

    }


    function Update() {
        Assign();
        //debugger;
        if (Details.filter(x => x.ExpCode == 0).length > 0) {
            WorningMessage("يجب ادخال الكود!", "must enter Code!", "تحذير", "worning");

            return;
        }
        if (Details.filter(x => x.ExpDescA == "").length > 0) {
            WorningMessage(" يجب ادخال الوصف باعربي!", "must enter arabic describtion!", "تحذير", "worning");
            return;
        }
        if (Details.filter(x => x.ExpAccountCode == "0").length > 0) {
            WorningMessage(" يجب ادخال رقم الحساب!", "must enter Account number!", "تحذير", "worning");
            return;
        }
        Details[0].Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
        Details[0].UserCode = SysSession.CurrentEnvironment.UserCode;


        //debugger;
        Ajax.Callsync({

            type: "POST",
            url: sys.apiUrl("AccDefAccounts", "UpdateLst"),
            data: JSON.stringify(Details),
            success: (d) => {
                //debugger
                let result = d as BaseResponse;
                if (result.IsSuccess == true) {
                    MessageBox.Show("تم الحفظ", "الحفظ");
                    btnBack_Def_onclick();
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
            Model = new A_RecPay_D_Accounts();

            StatusFlag = $("#txt_StatusFlag" + i).val();
            $("#txt_StatusFlag" + i).val("");
            //debugger;


            if (StatusFlag == "i") {
                Model.StatusFlag = StatusFlag.toString();
                Model.ExpenseID = 0;
                Model.CompCode = Number(SysSession.CurrentEnvironment.CompCode);
                //Model.AccountType = Number(AccountType);
                //Model.CreatedBy = SysSession.CurrentEnvironment.UserCode;
                //Model.UpdatedBy = "";
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
                Details.push(Model);




                //Model.CompCode = Number(compcode);
            }
            if (StatusFlag == "u") {


                var UpdatedDetail = Details.filter(x => x.ExpenseID == $("#txt_ID" + i).val())
                //UpdatedDetail[0].UpdatedBy = SysSession.CurrentEnvironment.UserCode;
                UpdatedDetail[0].StatusFlag = StatusFlag.toString();
                UpdatedDetail[0].ExpCode = $("#txtCode" + i).val();
                UpdatedDetail[0].TrType = Number(TrType);
                if ($("#txtAcount_Code" + i).val() == "Null") {
                    UpdatedDetail[0].ExpAccountCode = "0";
                }
                else {
                    UpdatedDetail[0].ExpAccountCode = $("#txtAcount_Code" + i).val();
                }
                if ($("#txtDescA" + i).val() == "") {
                    UpdatedDetail[0].ExpDescA = $("#txtDescL" + i).val();
                    $("#txtDescA" + i).val($("#txtDescL" + i).val());
                }
                else {
                    UpdatedDetail[0].ExpDescA = $("#txtDescA" + i).val();
                }
                if ($("#txtDescL" + i).val() == "") {
                    UpdatedDetail[0].ExpDescE = $("#txtDescA" + i).val();
                    $("#txtDescL" + i).val($("#txtDescA" + i).val());
                }
                else {
                    UpdatedDetail[0].ExpDescE = $("#txtDescL" + i).val();
                }
            }
            if (StatusFlag == "d") {
                if ($("#txt_ID" + i).val() != "") {
                    var UpdatedDetail = Details.filter(x => x.ExpenseID == $("#txt_ID" + i).val())
                    UpdatedDetail[0].StatusFlag = StatusFlag.toString();
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
            //debugger;

            $("#txt_StatusFlag" + RecNo).val() == 'i' ? $("#txt_StatusFlag" + RecNo).val('') : $("#txt_StatusFlag" + RecNo).val('d');

            $("#No_Row" + RecNo).attr("hidden", "true"); 
            $("#txtCode" + RecNo).val("000");
        });
    }

    function btnBack_Def_onclick() {

        $('#btnAddDetails').toggleClass("display_none");
        $('#btnSave_Def').toggleClass("display_none");
        $('#btnBack_Def').toggleClass("display_none");
        $("#div_ContentData :input").attr("disabled", "true");
        $(".btn-minus").addClass("display_none");
        $("#btnUpdate_Def").removeClass("display_none");
        $("#btnUpdate_Def").removeAttr("disabled");

        CountGrid = 0;
        $("#div_Data").html("");
        Display();

    }

    function Validation_Grid(rowcount: number) {

        if ($("#txtDescA" + rowcount).val() == "") {
            $("#txtDescA" + rowcount).val($("#txtDescL" + rowcount).val());
        }
        if ($("#txtDescL" + rowcount).val() == "") {
            $("#txtDescL" + rowcount).val($("#txtDescL" + rowcount).val());
        }

        if (
            ($("#txtCode" + rowcount).val() == "" || $("#txtDescA" + rowcount).val() == "" || $("#txtAcount_Code" + rowcount).val() == "Null")
            && $("#txt_StatusFlag" + rowcount).val() != "d") {
            WorningMessage("ادخل كود و الوصف العربي واختار رقم الحساب!", "Enter the Arabic code and description and choose the account number!", "تحذير", "worning");
        return false;
        }
        return true;
    }

    function Validate_code(rowno: number) {
        //debugger
        for (var i = 0; i < CountGrid; i++) {
            if (i != rowno) {

                if ($("#txt_StatusFlag" + i).val() == "d") {
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
        if ($("#txt_StatusFlag" + rowno).val() != "i") $("#txt_StatusFlag" + rowno).val("u");
        return true;
    }


}












