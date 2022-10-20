
$(document).ready(() => {
    GenDefCustomerAdjust.InitalizeComponent();
})

namespace GenDefCustomerAdjust {

    var isCustomer = true;
    var Isdebit = true;
    var AccType = 4;

    var MSG_ID: number;
    var Details: Array<A_RecPay_D_AjustmentType> = new Array<A_RecPay_D_AjustmentType>();
    //var Details: Array<I_D_Category> = new Array<I_D_Category>();
    var btnNew_sub_Add_service: HTMLButtonElement;
    var btnSave_Def: HTMLButtonElement;
    var btnAddDetails: HTMLButtonElement;
    var btnEdit: HTMLButtonElement;
    var sys: SystemTools = new SystemTools();
    //var sys: _shared = new _shared();
    var SysSession: SystemSession = GetSystemSession(Modules.GenDefCustomerAdjust);
    var Model: A_RecPay_D_AjustmentType = new A_RecPay_D_AjustmentType();
    var VatTypeDetails: Array<A_D_VAT_TYPE> = new Array<A_D_VAT_TYPE>();
    var Details_Acount: Array<A_ACCOUNT> = new Array<A_ACCOUNT>();

    var CountGrid = 0;
    var compcode: Number;//SharedSession.CurrentEnvironment.CompCode;
    var btnBack_Def: HTMLButtonElement;

    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);


    export function InitalizeComponent() {

        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = "أنواع تسويات العملاء";

        } else {
            document.getElementById('Screen_name').innerHTML = " Types of Customers Adjustment";

        }


        $('#divIconbar').addClass('hidden_Control');
        $('#icon-bar').addClass('d-none');
        $('#iconbar_Definition').removeClass('hidden_Control');
        $("#divShow").removeClass("display_none");
        //;
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        InitalizeControls();
        InitalizeEvents();
        fillddlVatType();
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
        //;
        btnAddDetails = document.getElementById("btnAddDetails") as HTMLButtonElement;
        btnEdit = document.getElementById("btnUpdate_Def") as HTMLButtonElement;
        btnSave_Def = document.getElementById("btnSave_Def") as HTMLButtonElement;
        btnBack_Def = document.getElementById("btnBack_Def") as HTMLButtonElement;

        // Buton privialges for single record page



    }

    function InitalizeEvents() {
        //;
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
            $("#txtAcount_Code" + CountGrid).removeAttr("disabled");
            $("#txt_Settlement_type" + CountGrid).removeAttr("disabled");
            $("#txt_tax" + CountGrid).removeAttr("disabled");
            

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
                            <select id="txt_tax${cnt}" class="form-control" disabled> 
                                <option value="Null">${ (lang == "ar" ? "نوع الضريبة " : "Tax Type")}</option>
                            </select>
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
                             <select id="txt_Settlement_type${cnt}"  disabled class="form-control"> 
                                  <option value="Null">${(lang == "ar" ? "نوع التسويه" : "Adjustment type")}</option>
                                  <option value="true">${(lang == "ar" ? "مدين" : "Debit")}</option>
                                  <option value="false">${(lang == "ar" ? "دائن" : "Credit")} </option>
                              </select>
                        </div>
	                </td>
                    
                    
		        <input id = "txt_StatusFlag${cnt}" name = " " type = "hidden" disabled class="form-control"/></div>
		        <input id = "txt_ID${cnt}" name = " " type = "hidden" disabled class="form-control"/></div>
                </tr>`;

        $("#div_Data").append(html);


        for (var i = 0; i < Details_Acount.length; i++) {
           


            $('#txtAcount_Code' + cnt).append('<option value="' + Details_Acount[i].ACC_CODE + '">' + (lang == "ar" ? Details_Acount[i].ACC_DESCA : Details_Acount[i].ACC_DESCL) + '</option>');


        }

        for (var i = 0; i < VatTypeDetails.length; i++) {



            $('#txt_tax' + cnt).append('<option value="' + VatTypeDetails[i].CODE + '">' + VatTypeDetails[i].DESCRIPTION + '</option>');



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
        $("#txt_Settlement_type" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        $("#txt_tax" + cnt).on('change', function () {
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
            url: sys.apiUrl("GLDefAccount", "GetByTypeNew"),
            data: {
                CompCode: compcode, AccType: AccType, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    
                    Details_Acount = result.Response as Array<A_ACCOUNT>;

                    //DisplayStkG_USERS();
                }
            }
        });
    }



    function btnsave_onClick() {
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

    function fillddlVatType() {
        //
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GenVatType", "GetAll"),
            data: {
                CompCode: compcode, VatType: 1, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    VatTypeDetails = result.Response as Array<A_D_VAT_TYPE>;

                    //DisplayStVatTypeDetails();

                }
            }
        });
    }


    function DisplayStVatTypeDetails() {
        //    //
        for (var i = 0; i < VatTypeDetails.length; i++)
        {



            $('#txt_tax').append('<option value="' + VatTypeDetails[i].CODE + '">' + VatTypeDetails[i].DESCRIPTION + '</option>');



        }

    }

    function Update() {
        Assign();

      
        Details[0].Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
        Details[0].UserCode = SysSession.CurrentEnvironment.UserCode;


        Details[0].Branch_Code = SysSession.CurrentEnvironment.BranchCode;
        Details[0].Comp_Code = SysSession.CurrentEnvironment.CompCode;
        Details[0].MODULE_CODE = Modules.GenDefCustomerCat;
        Details[0].sec_FinYear = SysSession.CurrentEnvironment.CurrentYear;
        ;
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("GenDefAdjustment", "UpdateLst"),
            data: JSON.stringify(Details),
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
                    ;
                    MessageBox.Show(result.ErrorMessage, "خطأ");
                }
            }
        });
    }

    function Assign() {
        var StatusFlag: String;
        for (var i = 0; i < CountGrid; i++) {
            Model = new A_RecPay_D_AjustmentType();

            StatusFlag = $("#txt_StatusFlag" + i).val();
            $("#txt_StatusFlag" + i).val("");
            ;


            if (StatusFlag == "i") {
                Model.StatusFlag = StatusFlag.toString();
                Model.AdustmentTypeID = 0;
                Model.CompCode = Number(SysSession.CurrentEnvironment.CompCode);



                Model.AdjCode = $("#txtCode" + i).val();
                if ($("#txtDescA" + i).val() == "") {
                    Model.Adj_DescA = $("#txtDescL" + i).val();
                    $("#txtDescA" + i).val($("#txtDescL" + i).val());
                }
                else {
                    Model.Adj_DescA = $("#txtDescA" + i).val();
                }
                if ($("#txtDescL" + i).val() == "") {
                    Model.Adj_DescE = $("#txtDescA" + i).val();
                    $("#txtDescL" + i).val($("#txtDescA" + i).val());
                }
                else {
                    Model.Adj_DescE = $("#txtDescL" + i).val();
                }
                if ($("#txtAcount_Code" + i).val() == "Null") {
                    Model.AccountCode = "0";
                }
                else {
                    Model.AccountCode = $("#txtAcount_Code" + i).val();
                }
                if ($("#txt_Settlement_type" + i).val() == "Null") {
                    //Model.IsDebit = "0";
                }
                else {
                    Model.IsDebit = $("#txt_Settlement_type" + i).val();
                }
                
                Model.VatType = $("#txt_tax" + i).val();

                Model.IsCustomer = isCustomer;
                Model.IsDebit = Isdebit;

              
                Details.push(Model);




                //Model.CompCode = Number(compcode);
            }
            if (StatusFlag == "u") {


                var UpdatedDetail = Details.filter(x => x.AdustmentTypeID == $("#txt_ID" + i).val())
                
                UpdatedDetail[0].StatusFlag = StatusFlag.toString();
                UpdatedDetail[0].AdjCode = $("#txtCode" + i).val();
                if ($("#txt_Settlement_type" + i).val() == "Null") {
                    //Model.IsDebit = "0";
                }
                else {
                    UpdatedDetail[0].IsDebit = $("#txt_Settlement_type" + i).val();
                }
                if ($("#txtAcount_Code" + i).val() == "Null") {
                    UpdatedDetail[0].AccountCode = "0";
                }
                else {
                    UpdatedDetail[0].AccountCode = $("#txtAcount_Code" + i).val();
                }
                if ($("#txtDescA" + i).val() == "") {
                    UpdatedDetail[0].Adj_DescA = $("#txtDescL" + i).val();
                    $("#txtDescA" + i).val($("#txtDescL" + i).val());
                }
                else {
                    UpdatedDetail[0].Adj_DescA = $("#txtDescA" + i).val();
                }
                if ($("#txtDescL" + i).val() == "") {
                    UpdatedDetail[0].Adj_DescE = $("#txtDescA" + i).val();
                    $("#txtDescL" + i).val($("#txtDescA" + i).val());
                }
                else {
                    UpdatedDetail[0].Adj_DescE = $("#txtDescL" + i).val();
                }
                UpdatedDetail[0].VatType = $("#txt_tax" + i).val();

                Model.IsCustomer = isCustomer;
                Model.IsDebit = Isdebit;
                


            }
            if (StatusFlag == "d") {
                if ($("#txt_ID" + i).val() != "") {
                    var UpdatedDetail = Details.filter(x => x.AdustmentTypeID == $("#txt_ID" + i).val())
                    UpdatedDetail[0].StatusFlag = StatusFlag.toString();
                }

            }


        }
    }

    function Display() {
        var GenDefAdjustment: Array<A_RecPay_D_AjustmentType> = new Array<A_RecPay_D_AjustmentType>();
        ;
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GenDefAdjustment", "GetAllGenDefAdjustment"),
            data: {
                CompCode: compcode, isCustomer: isCustomer, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                ;
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    Details = result.Response as Array<A_RecPay_D_AjustmentType>;

                    DisplayGenDefAdjustment();
                }
            }
        });
    }

    function DisplayGenDefAdjustment() {
        for (var i = 0; i < Details.length; i++) {
            ;
            BuildControls(CountGrid);
            CountGrid++;
            $("#txt_ID" + i).val(Details[i].AdustmentTypeID);
            $("#txtCode" + i).val(Details[i].AdjCode);
            $("#txtDescA" + i).val(Details[i].Adj_DescA);
            $("#txtDescL" + i).val(Details[i].Adj_DescE);
            $("#txt_tax" + i).prop("value", Details[i].VatType);
            $("#txt_Settlement_type" + i).prop("value", Details[i].IsDebit);  
            $('#txtAcount_Code'+i+' option[value=' + Details[i].AccountCode + ']').prop('selected', 'selected').change();

          
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
            if ($("#txt_tax" + rowcount).val() == "Null" ) {
                WorningMessage('اختار الضريبه', 'Enter The Tax', 'خطاء', 'Erorr');
                Errorinput($("#txt_tax" + rowcount));
                return false;

            }
            if ($("#txtAcount_Code" + rowcount).val() == 'Null') {
                WorningMessage('اختار رقم الحساب', 'Enter The code', 'خطاء', 'Erorr');
                Errorinput($("#txtAcount_Code" + rowcount));
                Errorinput($("#select2-txtAcount_Code" + rowcount+"-container"));
                return false;

            } 
            if ($("#txt_Settlement_type" + rowcount).val() == "Null") {
                if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
                    MessageBox.Show("يجب اختيار نوع التسوية", "");
                } else {
                    MessageBox.Show("Please, Enter The Adjustment Type!", "");
                }
                Errorinput($("#txt_Settlement_type" + rowcount));

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












