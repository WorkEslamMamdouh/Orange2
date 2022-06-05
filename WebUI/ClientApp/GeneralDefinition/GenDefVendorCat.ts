
$(document).ready(() => {
    GenDefVendorCat.InitalizeComponent();
})

namespace GenDefVendorCat {

    var AccType = 11;
    var AccountType: Number = 2;
    var MSG_ID: number;
    var Details: Array<A_RecPay_D_Category> = new Array<A_RecPay_D_Category>();
    //var Details: Array<I_D_Category> = new Array<I_D_Category>();

    var Details_Acount: Array<A_ACCOUNT> = new Array<A_ACCOUNT>();

    var btnNew_sub_Add_service: HTMLButtonElement;
    var btnsave: HTMLButtonElement;
    var btnAddDetails: HTMLButtonElement;
    var btnEdit: HTMLButtonElement;
    var sys: SystemTools = new SystemTools();
    //var sys: _shared = new _shared();
    var SysSession: SystemSession = GetSystemSession(Modules.GenDefVendorCat);
    var Model: A_RecPay_D_Category = new A_RecPay_D_Category();

    var CountGrid = 0;
    var compcode: Number;//SharedSession.CurrentEnvironment.CompCode;
    var btnback: HTMLButtonElement;


    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);


    export function InitalizeComponent() {

        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = "فئات الموردين";

        } else {
            document.getElementById('Screen_name').innerHTML = "Categories of Suppliers";

        }


        //
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        InitalizeControls();
        InitalizeEvents();
        Display_Acount_Code();
        Display();
    }

    $('#btnedite').on('click', function () {

        if (SysSession.CurrentPrivileges.EDIT) {
            $('#btnsave').toggleClass("display_none");
            $('#btnback').toggleClass("display_none");
            $("#div_ContentData :input").removeAttr("disabled");
            $("#btnedite").toggleClass("display_none");
        }
        else {
            $('#btnsave').toggleClass("display_none");
            $('#btnback').toggleClass("display_none");

            $("#btnedite").toggleClass("display_none");

        }
        if (SysSession.CurrentPrivileges.AddNew) {
            $(".btnAddDetails").removeAttr("disabled");
            $('#btnAddDetails').toggleClass("display_none");
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
        //
        btnAddDetails = document.getElementById("btnAddDetails") as HTMLButtonElement;
        btnEdit = document.getElementById("btnedite") as HTMLButtonElement;
        btnsave = document.getElementById("btnsave") as HTMLButtonElement;
        btnback = document.getElementById("btnback") as HTMLButtonElement;

        // Buton privialges for single record page



    }

    function InitalizeEvents() {
        //
        btnAddDetails.onclick = AddNewRow;//
        btnsave.onclick = btnsave_onClick;
        btnback.onclick = btnback_onclick;
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

            // can delete new inserted record  without need for delete privilage
            $("#btn_minus" + CountGrid).removeClass("display_none");
            $("#btn_minus" + CountGrid).removeAttr("disabled");

            //$(".minus_btn").addClass("display_none");
            $("#btnedite").removeClass("display_none");

            CountGrid++;
        }
        $("#btnedite").addClass("display_none");

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
        //
        html = '<div id="No_Row' + cnt + '" class="col-lg-12" ><div class="col-lg-12"><span id="btn_minus' + cnt + '" class="glyphicon glyphicon-remove-sign fontitm3GenDefVendorCat  minus_btn"></span><div class="col-lg-1 style_pading"> <input id="txtCode' + cnt + '" type= "number" class="form-control right2 " disabled="disabled"/></div><div class="col-lg-4 style_pading"> <input id="txtDescA' + cnt + '" type= "text" class="form-control right3" disabled="disabled"/></div><div class="col-lg-4 style_pading"> <input id="txtDescL' + cnt + '" type= "text" class="form-control right4" disabled="disabled" /></div><div class="col-lg-2 style_pading"> <select id="txtAcount_Code' + cnt + '" class="form-control ddlAcc"  disabled="disabled"> <option value="Null">' +(lang == "ar" ? "رقم الحساب" : "Account number")+'</option></select ></div><div class="col-lg-12"> <input id = "txt_StatusFlag' + cnt + '" name = " " type = "hidden" disabled class="form-control"/></div><div class="col-lg-12"> <input id = "txt_ID' + cnt + '" name = " " type = "hidden" class="form-control"/></div></div></div>';
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
        
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GLDefAccount", "GetByType"),
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
      
        Details[0].Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
        Details[0].UserCode = SysSession.CurrentEnvironment.UserCode;


        
        Ajax.Callsync({

            type: "POST",
            url: sys.apiUrl("GenDefCategory", "UpdateLst"),
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
                }
                else {
                    
                    MessageBox.Show(result.ErrorMessage, "خطأ");
                }
            }
        });
    }

    function Assign() {
        var StatusFlag: String;
        for (var i = 0; i < CountGrid; i++) {
            Model = new A_RecPay_D_Category();

            StatusFlag = $("#txt_StatusFlag" + i).val();
            $("#txt_StatusFlag" + i).val("");
            


            if (StatusFlag == "i") {
                Model.StatusFlag = StatusFlag.toString();
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
                if ($("#txtAcount_Code" + i).val() == "Null")
                {
                    Model.AccountCode = "0";
                }
                else {
                    Model.AccountCode = $("#txtAcount_Code" + i).val();
                }
                Details.push(Model);




                //Model.CompCode = Number(compcode);
            }
            if (StatusFlag == "u") {


                var UpdatedDetail = Details.filter(x => x.CatID == $("#txt_ID" + i).val())
                UpdatedDetail[0].UpdatedBy = SysSession.CurrentEnvironment.UserCode;
                UpdatedDetail[0].StatusFlag = StatusFlag.toString();
                UpdatedDetail[0].CatCode = $("#txtCode" + i).val();
                //UpdatedDetail[0].AccountCode = $("#txtAcount_Code" + i).val();
                if ($("#txtAcount_Code" + i).val() == "Null") {
                    UpdatedDetail[0].AccountCode = "0";
                }
                else {
                    UpdatedDetail[0].AccountCode = $("#txtAcount_Code" + i).val();
                }
                if ($("#txtDescA" + i).val() == "") {
                    UpdatedDetail[0].Cat_DescA = $("#txtDescL" + i).val();
                    $("#txtDescA" + i).val($("#txtDescL" + i).val());
                }
                else {
                    UpdatedDetail[0].Cat_DescA = $("#txtDescA" + i).val();
                }
                if ($("#txtDescL" + i).val() == "") {
                    UpdatedDetail[0].Cat_DescE = $("#txtDescA" + i).val();
                    $("#txtDescL" + i).val($("#txtDescA" + i).val());
                }
                else {
                    UpdatedDetail[0].Cat_DescE = $("#txtDescL" + i).val();
                }
            }
            if (StatusFlag == "d") {

                if ($("#txt_ID" + i).val() != "") {
                    var UpdatedDetail = Details.filter(x => x.CatID == $("#txt_ID" + i).val())
                    UpdatedDetail[0].StatusFlag = StatusFlag.toString();
                }

            }


        }
    }

    function Display() {

        
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

          
            
            try {
                for (var u = 0; u < Details_Acount.length; u++) {

                    if (Details[i].AccountCode == Details_Acount[u].ACC_CODE)
                    {
                        $("#txtAcount_Code" + i).prop("value", Details[i].AccountCode);
                        break;
                    }
                    else {
                        $("#txtAcount_Code" + i).prop("value", "Null");
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
            


            $("#No_Row" + RecNo).attr("hidden", "true");
            $("#txt_StatusFlag" + RecNo).val() == 'i' ? $("#txt_StatusFlag" + RecNo).val('m') : $("#txt_StatusFlag" + RecNo).val('d'); 
            $("#txtCode" + RecNo).val("000");
        });
    }

    function btnback_onclick() {
        $('#btnAddDetails').toggleClass("display_none");
        $('#btnsave').toggleClass("display_none");
        $('#btnback').toggleClass("display_none");
        $("#div_ContentData :input").attr("disabled", "true");
        $(".minus_btn").addClass("display_none");
        $("#btnedite").removeClass("display_none");
        $("#btnedite").removeAttr("disabled");


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

                if ($("#txt_StatusFlag" + i).val() == "d"||$("#txt_StatusFlag" + i).val() == "d") {
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












