﻿$(document).ready(() => {

    LnkTransVoucher.InitalizeComponent();
})
namespace LnkTransVoucher {
    var SysSession: SystemSession = GetSystemSession(Modules.LnkTransVoucher);
    var sys: SystemTools = new SystemTools();
    var cnt: number;
    cnt = 0;
    var compcode: Number;

    var BranchDetails: Array<G_SUB_SYSTEMS> = new Array<G_SUB_SYSTEMS>();
    var moveDetails: Array<G_LnkTrans> = new Array<G_LnkTrans>();
    var Details: Array<GQ_GetLnkTransVoucher> = new Array<GQ_GetLnkTransVoucher>();
    var valdetails: Array<G_LnkTransVariable> = new Array<G_LnkTransVariable>();
    var vardetails: Array<G_LnkTransVariable> = new Array<G_LnkTransVariable>();
    var fixaccdetails: Array<A_ACCOUNT> = new Array<A_ACCOUNT>();
    var braccdetails: Array<G_LnkVar> = new Array<G_LnkVar>();
    var fixccdetails: Array<G_COST_CENTER> = new Array<G_COST_CENTER>();
    var varccdetails: Array<G_LnkTransVariable> = new Array<G_LnkTransVariable>();
    var brccdetails: Array<G_LnkVar> = new Array<G_LnkVar>();


    var TransVoucher_details: Array<G_LnkTransVoucher> = new Array<G_LnkTransVoucher>();

    var TransVoucher_Model: G_LnkTransVoucher = new G_LnkTransVoucher();

    var CountGrid = 0;




    var btnAddDetails: HTMLButtonElement;
    var btnShow: HTMLButtonElement;
    var btnSave_Def: HTMLButtonElement;
    var btnBack_Def: HTMLButtonElement;
    var btnUpdate_Def: HTMLButtonElement;
    var btn_minus: HTMLButtonElement;

    var drpuserType: HTMLSelectElement;
    var drpStatus: HTMLSelectElement;
    var SUB_SYSTEM_CODE = SysSession.CurrentEnvironment.SubSystemCode;
    var SYSTEM_CODE = SysSession.CurrentEnvironment.SystemCode;
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);

    export function InitalizeComponent() {
        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") { document.getElementById('Screen_name').innerHTML = " تصميم قيود الربط  "; }
        else { document.getElementById('Screen_name').innerHTML = "Design link constraints"; }

        $('#divIconbar').addClass('hidden_Control');
        $('#divIconbar').addClass('icon-bar');
        $('#iconbar_Definition').removeClass('hidden_Control');
        $("#divShow").removeClass("display_none");

        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        InitalizeControls();
        InitializeEvents();
        fillddlBranch();
        fillddlmovement();
        fillTransVariable();
        fillTransfixacc();
        fillTransvalVariable();
        fillbracc();
        fixcc();
        fillCCVariable();
        fillbrcc();

    }
    function InitalizeControls() {

        btnAddDetails = document.getElementById("btnAddDetails") as HTMLButtonElement;
        btnSave_Def = document.getElementById("btnSave_Def") as HTMLButtonElement;
        btnBack_Def = document.getElementById("btnBack_Def") as HTMLButtonElement;
        btnShow = document.getElementById("btnShow") as HTMLButtonElement;
        btnUpdate_Def = document.getElementById("btnUpdate_Def") as HTMLButtonElement;
        btn_minus = document.getElementById("btn_minus") as HTMLButtonElement;

        drpuserType = document.getElementById("drpuserType") as HTMLSelectElement;
        drpStatus = document.getElementById("drpStatus") as HTMLSelectElement;
    }
    function InitializeEvents() {
        btnAddDetails.onclick = AddNewRow;
        //btnShow.onclick = Display_All;
        drpStatus.onchange = Display_All ;
        btnSave_Def.onclick = btnsave_onclick;
        btnBack_Def.onclick = btnback_onclick;
        btnUpdate_Def.onclick = btnedite_onclick;



    }
    function fillddlBranch() {

        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("G_SUB_SYSTEMS", "GetAll"),
            data: { UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    BranchDetails = result.Response as Array<G_SUB_SYSTEMS>;
                    DisplaydrpuserType();
                }

            }
        });
    }
    function DisplaydrpuserType() {

        $('#drpuserType').append('<option value="Null">' + (lang == "ar" ? "اختر النظام الفرعى" : "Choose Subsystem") + '</option>');

        for (var i = 0; i < BranchDetails.length; i++) {
            $('#drpuserType').append('<option value="' + BranchDetails[i].SUB_SYSTEM_CODE + '">' + (lang == "ar" ? BranchDetails[i].SUB_SYSTEM_DESCA : BranchDetails[i].SUB_SYSTEM_DESCE) + '</option>');



        }

    }
    function fillddlmovement() {

        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("G_LnkTrans", "GetAll"),
            data: { UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    moveDetails = result.Response as Array<G_LnkTrans>;
                    DisplaydrpStatus();
                }

            }
        });
    }
    function DisplaydrpStatus() {

        $('#drpStatus').append('<option value="Null">' + (lang == "ar" ? "اختر الحركة" : "Choose Movement") + '</option>');

        for (var i = 0; i < moveDetails.length; i++) {
            $('#drpStatus').append('<option value="' + moveDetails[i].TR_CODE + '">' + (lang == "ar" ? moveDetails[i].TR_DESCA : moveDetails[i].TR_DESCE) + '</option>');



        }

    }
    function fillTransvalVariable() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("G_LnkTransVariable", "GetAllVAL"),
            data: { CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token, SUB_SYSTEM_CODE, SYSTEM_CODE },
            success: (d) => {

                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    valdetails = result.Response as Array<G_LnkTransVariable>;


                }
            }
        });
    }
    function fillTransVariable() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("G_LnkTransVariable", "GetAllVAR"),
            data: { UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token, SUB_SYSTEM_CODE, SYSTEM_CODE },
            success: (d) => {

                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    //
                    vardetails = result.Response as Array<G_LnkTransVariable>;


                }
            }
        });
    }
    function fillCCVariable() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("G_LnkTransVariable", "GetAllCC"),
            data: { UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token, SUB_SYSTEM_CODE, SYSTEM_CODE },
            success: (d) => {

                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    //
                    varccdetails = result.Response as Array<G_LnkTransVariable>;


                }
            }
        });
    }
    function fillTransfixacc() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GLDefAccount", "GetAllfix"),
            data: { CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {

                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    //
                    fixaccdetails = result.Response as Array<A_ACCOUNT>;


                }
            }
        });
    }
    function fixcc() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("CostCenter", "GetAll"),
            data: { CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {

                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    //
                    fixccdetails = result.Response as Array<G_COST_CENTER>;


                }
            }
        });
    }
    function fillbracc() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("G_LnkVar", "GetAll"),
            data: { UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {

                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    //
                    braccdetails = result.Response as Array<G_LnkVar>;


                }
            }
        });
    }
    function fillbrcc() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("G_LnkVar", "GetAllCC"),
            data: { UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {

                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    //
                    brccdetails = result.Response as Array<G_LnkVar>;


                }
            }
        });
    }
    function btnedite_onclick() {


        for (var i = 0; i < Details.length; i++) {

            validation(i);


        }

        $('#btnUpdate_Def').addClass('display_none');
        $('#btnBack_Def').removeClass('display_none');
        $('#title_grid1').removeClass('display_none');
        $('#btnSave_Def').removeClass('display_none');
        $('#btnAddDetails').removeClass('display_none');
        $('#btnShow').addClass('display_none');
        $('#drpStatus').attr('disabled', 'disabled');
        $('#drpuserType').attr('disabled', 'disabled');

    }
    function btnback_onclick() {
        for (var i = 0; i < Details.length; i++) {

            validationdis(i);

        }
        Display_All();
        $('#btnUpdate_Def').removeClass('display_none');
        $('#btnBack_Def').addClass('display_none');
        $('#btnSave_Def').addClass('display_none');
        $('#btnAddDetails').addClass('display_none');
        //$('#btnShow').removeClass('display_none');
        $('#drpuserType').removeAttr('disabled');
        $('#drpStatus').removeAttr('disabled');
    }
    function btnsave_onclick() {


        var CanAddDeposit: boolean = true;
        if (CountGrid > 0) {

            for (var i = 0; i < CountGrid; i++) {

                CanAddDeposit = validationGrid(i);
                if (CanAddDeposit == false) {
                    break;
                }
            }
        }
        if (CanAddDeposit) {
            Assign();
            updatelist();


        }

    }
    function BuildControls(cnt: number) {

        var html;
        html = `<tr id= "rowhead${cnt}">
                    <input id="txt_StatusFlag${cnt}" disabled type="text" class="form-control display_none"  />  
                    <input id="serial_none${cnt}" disabled type="text" class="form-control display_none"  />  
                    <td>
		                <div class="form-group">
			                <span id="btn_minus${cnt}"><i class="fas fa-minus-circle fs-4 btn-minus display_none"></i></span>
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
                            <input id="ser${cnt}" type="number"  value="${(cnt + 1)}" class="form-control" name="" disabled />
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
                            <input id="txtLineRemarkA${cnt}" type="text" class="form-control" name="" disabled />
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
                            <input id="txtLineRemarkE${cnt}" type="text" class="form-control" name="" disabled />
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
                           <select id="Val${cnt}" disabled  class="form-control">
			                     <option value="Null">${ (lang == "ar" ? " القيمة " : "Value") } </option>
			               </select>
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
                           	<select id="ISDebit${cnt}" disabled  class="form-control">
			                    <option value="True">${(lang == "ar" ? "مدين" : "Debit") }</option>
			                    <option value="False">${(lang == "ar" ? "دائن" : "Credit") }</option>
			                </select>
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
                           <select id="AccType${cnt}"disabled class="form-control">
			                    <option value="1">${ (lang == "ar" ? " حساب ثابت" : "Fixed Account") }</option>
			                    <option value="2">${ (lang == "ar" ? "حساب متغير" : "variable account") }</option>
			                    <option value="3">${ (lang == "ar" ? "حساب فرع" : "Branch Account") } </option>
			                </select>
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
                           <select id="FixAcc${cnt}" disabled   class="form-control">
			                    <option value="Null">  </option>
			               </select>
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
                           <select id="VarAcc${cnt}" disabled  class="form-control">
			                    <option value="Null">  </option>
			                </select>
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
                           <select id="BrAcc${cnt}" disabled class="form-control">
			                    <option value="Null">   </option>
			                </select>
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
                           	<select id="CCType${cnt}" disabled  class="form-control">
			                    <option value="Null"> 
			                    <option value="1">${ (lang == "ar" ? "مركز تكلفة ثابت" : "Fixed Cost Center") }</option>
			                    <option value="2">${ (lang == "ar" ? "مركز تكلفة متغير" : "Varible Cost center") }</option>
			                    <option value="3">${ (lang == "ar" ? "مركز تكلفة فرع" : "Branch Cost Center") }</option>
			                </select>
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
                           	<select id="Fixcc${cnt}"disabled class="form-control">
			                    <option value="Null"> </option>
			                 </select>
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
                           	<select id="VarCC${cnt}" disabled  class="form-control">
			                  <option value="Null"> </option>
			                </select>
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
                           	<select id="BrCC${cnt}" disabled class="form-control">
			                  <option value="Null">   </option>
			                </select>
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
                           	<select id="IsCollective${cnt}" disabled class="form-control">
			                 <option value="False">${(lang == "ar" ? "إفرادي" : "individual") } </option>
			                <select>
		                </div>
	                </td>
          
                </tr>`;

        $("#div_Data").append(html);


        $("#IsCollective" + cnt).on('change', function () {

            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        $("#txtLineRemarkA" + cnt).on('change', function () {

            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        $("#txtLineRemarkE" + cnt).on('change', function () {

            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        $("#ISDebit" + cnt).on('change', function () {

            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        $("#AccType" + cnt).on('change', function () {

            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
            if ($("#AccType" + cnt).val() == '1') {
                $("#FixAcc" + cnt).prop('value', 'Null');
                $("#VarAcc" + cnt).prop('value', 'Null');
                $("#BrAcc" + cnt).prop('value', 'Null');
                $("#FixAcc" + cnt).removeAttr("disabled");
                $("#VarAcc" + cnt).attr("disabled", "disabled");
                $("#BrAcc" + cnt).attr("disabled", "disabled");
            }
            else if ($("#AccType" + cnt).val() == '2') {
                $("#FixAcc" + cnt).prop('value', 'Null');
                $("#VarAcc" + cnt).prop('value', 'Null');
                $("#BrAcc" + cnt).prop('value', 'Null');
                $("#FixAcc" + cnt).attr("disabled", "disabled");
                $("#BrAcc" + cnt).attr("disabled", "disabled");
                $("#VarAcc" + cnt).removeAttr("disabled");
            }
            else if ($("#AccType" + cnt).val() == '3') {
                $("#FixAcc" + cnt).prop('value', 'Null');
                $("#VarAcc" + cnt).prop('value', 'Null');
                $("#BrAcc" + cnt).prop('value', 'Null');
                $("#FixAcc" + cnt).attr("disabled", "disabled");
                $("#VarAcc" + cnt).attr("disabled", "disabled");
                $("#BrAcc" + cnt).removeAttr("disabled");
            }
            else {
                $("#FixAcc" + cnt).prop('value', 'Null');
                $("#VarAcc" + cnt).prop('value', 'Null');
                $("#BrAcc" + cnt).prop('value', 'Null');
                $("#FixAcc" + cnt).attr("disabled", "disabled");
                $("#VarAcc" + cnt).attr("disabled", "disabled");
                $("#BrAcc" + cnt).attr("disabled", "disabled");
            }

        });
        $("#CCType" + cnt).on('change', function () {



            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");

            if ($("#CCType" + cnt).val() == '3') {

                $("#Fixcc" + cnt).prop('value', 'Null');
                $("#VarCC" + cnt).prop('value', 'Null');
                $("#BrCC" + cnt).prop('value', 'Null');


                $("#Fixcc" + cnt).attr("disabled", "disabled");
                $("#VarCC" + cnt).attr("disabled", "disabled");
                $("#BrCC" + cnt).removeAttr("disabled");
            }
            else if ($("#CCType" + cnt).val() == '1') {
                $("#Fixcc" + cnt).prop('value', 'Null');
                $("#VarCC" + cnt).prop('value', 'Null');
                $("#BrCC" + cnt).prop('value', 'Null');

                $("#Fixcc" + cnt).removeAttr("disabled");
                $("#VarCC" + cnt).attr("disabled", "disabled");
                $("#BrCC" + cnt).attr("disabled", "disabled");
            }
            else if ($("#CCType" + cnt).val() == '2') {
                $("#Fixcc" + cnt).prop('value', 'Null');
                $("#VarCC" + cnt).prop('value', 'Null');
                $("#BrCC" + cnt).prop('value', 'Null');

                $("#VarCC" + cnt).removeAttr("disabled");
                $("#Fixcc" + cnt).attr("disabled", "disabled");
                $("#BrCC" + cnt).attr("disabled", "disabled");
            }
            else {
                $("#Fixcc" + cnt).prop('value', 'Null');
                $("#VarCC" + cnt).prop('value', 'Null');
                $("#BrCC" + cnt).prop('value', 'Null');

                $("#Fixcc" + cnt).attr("disabled", "disabled");
                $("#VarCC" + cnt).attr("disabled", "disabled");
                $("#BrCC" + cnt).attr("disabled", "disabled");
            }

        });
        $("#FixAcc" + cnt).on('change', function () {

            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        $("#VarAcc" + cnt).on('change', function () {

            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");



            $("#VarAcc" + cnt).removeClass('text_Mandatory');

        });
        $("#BrAcc" + cnt).on('change', function () {

            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        $("#Fixcc" + cnt).on('change', function () {

            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        $("#VarCC" + cnt).on('change', function () {

            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");


            $("#VarCC" + cnt).removeClass('text_Mandatory');
        });
        $("#BrCC" + cnt).on('change', function () {

            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        $("#ser" + cnt).on('change', function () {

            Validate_serial(cnt);

            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        $("#Val" + cnt).on('change', function () {

            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");



            $("#Val" + cnt).removeClass('text_Mandatory');

        });
        $("#btn_minus" + cnt).on('click', function () {


            btndelete_onclick(cnt);
        });



        //let Val = valdetails.filter(x => x.TR_CODE == $("#drpStatus").val());

        //for (var u = 0; u < Val.length; u++) {
        //    $('#Val' + cnt).append('<option data-Source="' + Val[u].DataSource + '" data-TR_CODE ="' + Val[u].TR_CODE + '" data-VarCode ="' + Val[u].VarCode + '" value="' + Val[u].TR_CODE + Val[u].VarCode + '">' + (lang == "ar" ? Val[u].Var_DESCA : Val[u].Var_DESCE) + '</option>');
        //}
        //for (var u = 0; u < fixaccdetails.length; u++) {
        //    $('#FixAcc' + cnt).append('<option value="' + fixaccdetails[u].ACC_CODE + '">' + (lang == "ar" ? fixaccdetails[u].ACC_DESCA : fixaccdetails[u].ACC_DESCL) + '</option>');
        //}



        //let Varacc = vardetails.filter(x => x.TR_CODE == $("#drpStatus").val());

        //for (var u = 0; u < Varacc.length; u++) {
        //    $('#VarAcc' + cnt).append('<option data-Source="' + Varacc[u].DataSource + '" value="' + Varacc[u].VarCode + '">' + (lang == "ar" ? Varacc[u].Var_DESCA : Varacc[u].Var_DESCE) + '</option>');
        //}

        //for (var u = 0; u < braccdetails.length; u++) {

        //    $('#BrAcc' + cnt).append('<option value="' + braccdetails[u].LnkCode + '">' + (lang == "ar" ? braccdetails[u].Acc_DescA : braccdetails[u].Acc_DescE) + '</option>');

        //}


        //for (var u = 0; u < fixccdetails.length; u++) {
        //    $('#Fixcc' + cnt).append('<option value="' + fixccdetails[u].CC_CODE + '">' + (lang == "ar" ? fixccdetails[u].CC_DESCA : fixccdetails[u].CC_DESCE) + '</option>');
        //}



        //let Varcc = varccdetails.filter(x => x.TR_CODE == $("#drpStatus").val());
        //for (var u = 0; u < Varcc.length; u++) {
        //    $('#VarCC' + cnt).append('<option data-Source="' + Varcc[u].DataSource + '" value="' + Varcc[u].VarCode + '">' + (lang == "ar" ? Varcc[u].Var_DESCA : Varcc[u].Var_DESCE) + '</option>');
        //}


        //for (var u = 0; u < brccdetails.length; u++) {
        //    $('#BrCC' + cnt).append('<option value="' + brccdetails[u].LnkCode + '">' + (lang == "ar" ? brccdetails[u].Acc_DescA : brccdetails[u].Acc_DescE) + '</option>');
        //}

    }


    function Display_DrpDown() {

        let Val = valdetails.filter(x => x.TR_CODE == $("#drpStatus").val());

        for (var u = 0; u < Val.length; u++) {
            $('.Val').append('<option data-Source="' + Val[u].DataSource + '" data-TR_CODE ="' + Val[u].TR_CODE + '" data-VarCode ="' + Val[u].VarCode + '" value="' + Val[u].TR_CODE + Val[u].VarCode + '">' + (lang == "ar" ? Val[u].Var_DESCA : Val[u].Var_DESCE) + '</option>');
        }
        for (var u = 0; u < fixaccdetails.length; u++) {
            $('.FixAcc').append('<option value="' + fixaccdetails[u].ACC_CODE + '">' + (lang == "ar" ? fixaccdetails[u].ACC_DESCA : fixaccdetails[u].ACC_DESCL) + '</option>');
        }



        let Varacc = vardetails.filter(x => x.TR_CODE == $("#drpStatus").val());

        for (var u = 0; u < Varacc.length; u++) {
            $('.VarAcc').append('<option data-Source="' + Varacc[u].DataSource + '" value="' + Varacc[u].VarCode + '">' + (lang == "ar" ? Varacc[u].Var_DESCA : Varacc[u].Var_DESCE) + '</option>');
        }

        for (var u = 0; u < braccdetails.length; u++) {

            $('.BrAcc').append('<option value="' + braccdetails[u].LnkCode + '">' + (lang == "ar" ? braccdetails[u].Acc_DescA : braccdetails[u].Acc_DescE) + '</option>');

        }


        for (var u = 0; u < fixccdetails.length; u++) {
            $('.Fixcc').append('<option value="' + fixccdetails[u].CC_CODE + '">' + (lang == "ar" ? fixccdetails[u].CC_DESCA : fixccdetails[u].CC_DESCE) + '</option>');
        }



        let Varcc = varccdetails.filter(x => x.TR_CODE == $("#drpStatus").val());
        for (var u = 0; u < Varcc.length; u++) {
            $('.VarCC').append('<option data-Source="' + Varcc[u].DataSource + '" value="' + Varcc[u].VarCode + '">' + (lang == "ar" ? Varcc[u].Var_DESCA : Varcc[u].Var_DESCE) + '</option>');
        }


        for (var u = 0; u < brccdetails.length; u++) {
            $('.BrCC').append('<option value="' + brccdetails[u].LnkCode + '">' + (lang == "ar" ? brccdetails[u].Acc_DescA : brccdetails[u].Acc_DescE) + '</option>');
        }

    }

    function btndelete_onclick(recnum: number) {
        if (!SysSession.CurrentPrivileges.Remove) return;
        WorningMessage("هل تريد الحذف؟", "Do you want to delete?", "تحذير", "worning", () => {
            $("#txt_StatusFlag" + recnum).val() == 'i' ? $("#txt_StatusFlag" + recnum).val('') : $("#txt_StatusFlag" + recnum).val('d');
            $("#IsCollective" + recnum).val("1");
            $("#txtLineRemarkA" + recnum).val("2");
            $("#txtLineRemarkE" + recnum).val("2");
            $("#ISDebit" + recnum).val("2");
            $("#AccType" + recnum).val("1");
            $("#CCType" + recnum).val("1");
            $("#FixAcc" + recnum).val("2");
            $("#VarAcc" + recnum).val("0");
            $("#BrAcc" + recnum).val("2");
            $("#Fixcc" + recnum).val("0");
            $("#VarCC" + recnum).val("1");
            $("#BrCC" + recnum).val("0");

            $("#rowhead" + recnum).attr("hidden", "true");
        });


        Assign();
    }
    function Display_All() {
        var TR_CODE = $('#drpStatus').val();
        var SUB_SYSTEM_CODE = $('#drpuserType').val();
        if (TR_CODE == "Null" || SUB_SYSTEM_CODE == "Null") {
            WorningMessage("يجب اختيار النظام الفرعي و الحركة!", "You must choose the subsystem and the movement!", "تحذير", "worning");
            Errorinput($('#drpuserType'));
            $('#drpStatus').val('Null')
            return;
        } else {
            $('#title_grid1').removeClass('display_none');
            Ajax.Callsync({
                type: "Get",
                url: sys.apiUrl("G_LnkTransVoucher", "GetAllGetLnkTransVoucher"),
                data: { CompCode: compcode, SUB_SYSTEM_CODE: SUB_SYSTEM_CODE, TR_CODE: TR_CODE, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
                success: (d) => {

                    let result = d as BaseResponse;
                    if (result.IsSuccess) {
                        Details = result.Response as Array<GQ_GetLnkTransVoucher>;
                        Details_All();
                    }
                }
            });
        }

    }
    function Details_All() {
        debugger
        CountGrid = 0;
        $("#div_Data").html('');

        for (var i = 0; i < Details.length; i++) {

            BuildControls(CountGrid);
            CountGrid++;
        }

        Display_DrpDown();

        for (var i = 0; i < Details.length; i++) {



            $('#ser' + i).val(Details[i].SERIAL)
            $('#serial_none' + i).val(Details[i].SERIAL)




            $("#Val" + i).prop("value", Details[i].TR_CODE + Details[i].VarCode);

            //for (var y = 0; y < valdetails.length;y++)
            //{
            //    if (valdetails[y].TR_CODE == Details[i].TR_CODE && valdetails[y].VarCode == Details[i].VarCode) {

            //    }
            //}



            $("#ISDebit" + i).prop("value", Details[i].ISDebit == true ? "True" : "False");
            $("#AccType" + i).prop("value", Details[i].AccType);
            $("#txtLineRemarkA" + i).prop("value", Details[i].LineRemarkA);
            $("#txtLineRemarkE" + i).prop("value", Details[i].LineRemarkE);

            if (Details[i].AccType == 1)      //  FixAcc           حساب ثابت
            {
                $("#FixAcc" + i).prop("value", Details[i].AccFixedCode);
            }
            if (Details[i].AccType == 2) {  //VarAcc              حساب متغير
                $("#VarAcc" + i).prop("value", Details[i].AccVarCode);
            }
            if (Details[i].AccType == 3) {   //             حساب فرع
                $("#BrAcc" + i).prop("value", Details[i].AccBraCode);
            }

            //--------------------------------------------------------------------------------------------


            $("#CCType" + i).prop("value", Details[i].CCType == null ? "Null" : Details[i].CCType);


            if (Details[i].CCType == 1) {   //            تكلفة ثابت
                $("#Fixcc" + i).prop("value", Details[i].CCFixedCode);
            }
            if (Details[i].CCType == 2) {   //              تكلفة متغير
                $("#VarCC" + i).prop("value", Details[i].CCVarCode);
            }
            if (Details[i].CCType == 3) {   //              تكلفة فرع
                $("#BrCC" + i).prop("value", Details[i].CCBraCode);
            }

            if (Details[i].IsCollective == false) {   //              تكلفة فرع
                $("#IsCollective" + i).val("False");
            }
            else {
                $("#IsCollective" + i).val("True");
            }

        }
        $('#btnUpdate_Def').removeClass('display_none')




    }
    function AddNewRow() {

        if (!SysSession.CurrentPrivileges.AddNew) return;
        var CanAdd: boolean = true;
        if (CountGrid > 0) {
            // var LastRowNo = CountGrid - 1;
            // CanAdd = Validation_Grid(LastRowNo);
        }
        if (CanAdd) {
            BuildControls(CountGrid);

            $("#ser" + CountGrid).removeAttr("disabled");
            $("#Val" + CountGrid).removeAttr("disabled");
            $("#ISDebit" + CountGrid).removeAttr("disabled");
            $("#txtLineRemarkA" + CountGrid).removeAttr("disabled");
            $("#txtLineRemarkE" + CountGrid).removeAttr("disabled");
            $("#AccType" + CountGrid).removeAttr("disabled");
            $("#CCType" + CountGrid).removeAttr("disabled");
            $("#FixAcc" + CountGrid).removeAttr("disabled");
            $("#IsCollective" + CountGrid).removeAttr("disabled");


            $("#btn_minus" + CountGrid).removeClass("display_none");
            $("#btn_minus" + CountGrid).removeAttr("disabled");

            $("#txt_StatusFlag" + CountGrid).val("i"); //In Insert mode

            cnt = CountGrid;

            let Val = valdetails.filter(x => x.TR_CODE == $("#drpStatus").val());

            for (var u = 0; u < Val.length; u++) {
                $('#Val' + cnt).append('<option data-Source="' + Val[u].DataSource + '" data-TR_CODE ="' + Val[u].TR_CODE + '" data-VarCode ="' + Val[u].VarCode + '" value="' + Val[u].TR_CODE + Val[u].VarCode + '">' + (lang == "ar" ? Val[u].Var_DESCA : Val[u].Var_DESCE) + '</option>');
            }
            for (var u = 0; u < fixaccdetails.length; u++) {
                $('#FixAcc' + cnt).append('<option value="' + fixaccdetails[u].ACC_CODE + '">' + (lang == "ar" ? fixaccdetails[u].ACC_DESCA : fixaccdetails[u].ACC_DESCL) + '</option>');
            }



            let Varacc = vardetails.filter(x => x.TR_CODE == $("#drpStatus").val());

            for (var u = 0; u < Varacc.length; u++) {
                $('#VarAcc' + cnt).append('<option data-Source="' + Varacc[u].DataSource + '" value="' + Varacc[u].VarCode + '">' + (lang == "ar" ? Varacc[u].Var_DESCA : Varacc[u].Var_DESCE) + '</option>');
            }

            for (var u = 0; u < braccdetails.length; u++) {

                $('#BrAcc' + cnt).append('<option value="' + braccdetails[u].LnkCode + '">' + (lang == "ar" ? braccdetails[u].Acc_DescA : braccdetails[u].Acc_DescE) + '</option>');

            }


            for (var u = 0; u < fixccdetails.length; u++) {
                $('#Fixcc' + cnt).append('<option value="' + fixccdetails[u].CC_CODE + '">' + (lang == "ar" ? fixccdetails[u].CC_DESCA : fixccdetails[u].CC_DESCE) + '</option>');
            }



            let Varcc = varccdetails.filter(x => x.TR_CODE == $("#drpStatus").val());
            for (var u = 0; u < Varcc.length; u++) {
                $('#VarCC' + cnt).append('<option data-Source="' + Varcc[u].DataSource + '" value="' + Varcc[u].VarCode + '">' + (lang == "ar" ? Varcc[u].Var_DESCA : Varcc[u].Var_DESCE) + '</option>');
            }


            for (var u = 0; u < brccdetails.length; u++) {
                $('#BrCC' + cnt).append('<option value="' + brccdetails[u].LnkCode + '">' + (lang == "ar" ? brccdetails[u].Acc_DescA : brccdetails[u].Acc_DescE) + '</option>');
            }

            CountGrid++;
        }

        $("#btnUpdate_Def").addClass("display_none");



    }
    function Assign() {

        //
        TransVoucher_details = new Array<G_LnkTransVoucher>();

        var StatusFlag: String;
        for (var i = 0; i <= CountGrid; i++) {
            TransVoucher_Model = new G_LnkTransVoucher();

            StatusFlag = $("#txt_StatusFlag" + i).val();

            TransVoucher_Model.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
            TransVoucher_Model.UserCode = SysSession.CurrentEnvironment.UserCode;


            if (StatusFlag == "i") {
                TransVoucher_Model.COMP_CODE = Number(SysSession.CurrentEnvironment.CompCode);
                TransVoucher_Model.SUB_SYSTEM_CODE = drpuserType.value;
                TransVoucher_Model.SYSTEM_CODE = SysSession.CurrentEnvironment.SystemCode;
                TransVoucher_Model.StatusFlag = StatusFlag.toString();
                TransVoucher_Model.SERIAL = $('#ser' + i).val();
                TransVoucher_Model.serial_num = $('#serial_none' + i).val();
                TransVoucher_Model.VarCode = $('option:selected', $('#Val' + i)).attr('data-varcode');
                TransVoucher_Model.TR_CODE = $('option:selected', $('#Val' + i)).attr('data-TR_CODE');
                TransVoucher_Model.ISDebit = $('#ISDebit' + i).val();
                TransVoucher_Model.LineRemarkA = $('#txtLineRemarkA' + i).val().trim() == '' ? $('#txtLineRemarkE' + i).val() : $('#txtLineRemarkA' + i).val() ;
                TransVoucher_Model.LineRemarkE = $('#txtLineRemarkE' + i).val().trim() == '' ? $('#txtLineRemarkA' + i).val() : $('#txtLineRemarkE' + i).val();;

                TransVoucher_Model.AccType = $("#AccType" + i).val();//--------------------------------------------------(نوع الحساب)  
                if ($('#AccType' + i).val() == "1") { TransVoucher_Model.AccFixedCode = $("#FixAcc" + i).val(); }     //-----(حساب  ثابت)

                else if ($('#AccType' + i).val() == "2") { TransVoucher_Model.AccVarCode = $("#VarAcc" + i).val(); }  //-----(حساب  متغير)

                else if ($('#AccType' + i).val() == "3") { TransVoucher_Model.AccBraCode = $("#BrAcc" + i).val(); }   //-----(حساب  فرع)

                TransVoucher_Model.CCType = $("#CCType" + i).val();//--------------------------------------------------(نوع الحساب)
                if ($('#CCType' + i).val() == "1") { TransVoucher_Model.CCFixedCode = $("#Fixcc" + i).val(); }       //----- (حساب  ثابت)

                else if ($('#CCType' + i).val() == "2") { TransVoucher_Model.CCVarCode = $("#VarCC" + i).val(); }    //-----(حساب  متغير)

                else if ($('#CCType' + i).val() == "3") { TransVoucher_Model.CCBraCode = $("#BrCC" + i).val(); }     //-----(حساب  فرع)

                TransVoucher_Model.IsCollective = $("#IsCollective" + i).val();
                TransVoucher_details.push(TransVoucher_Model);

            }
            if (StatusFlag == "u") {

                TransVoucher_Model.COMP_CODE = Number(SysSession.CurrentEnvironment.CompCode);
                TransVoucher_Model.SUB_SYSTEM_CODE = drpuserType.value;
                TransVoucher_Model.SYSTEM_CODE = SysSession.CurrentEnvironment.SystemCode;
                TransVoucher_Model.StatusFlag = StatusFlag.toString();
                TransVoucher_Model.SERIAL = $('#ser' + i).val();
                TransVoucher_Model.serial_num = $('#serial_none' + i).val();
                TransVoucher_Model.VarCode = $('option:selected', $('#Val' + i)).attr('data-varcode');
                TransVoucher_Model.TR_CODE = $('option:selected', $('#Val' + i)).attr('data-TR_CODE');
                TransVoucher_Model.ISDebit = $('#ISDebit' + i).val();
                TransVoucher_Model.LineRemarkA = $('#txtLineRemarkA' + i).val().trim() == '' ? $('#txtLineRemarkE' + i).val() : $('#txtLineRemarkA' + i).val();
                TransVoucher_Model.LineRemarkE = $('#txtLineRemarkE' + i).val().trim() == '' ? $('#txtLineRemarkA' + i).val() : $('#txtLineRemarkE' + i).val();;


                TransVoucher_Model.AccType = $("#AccType" + i).val();//--------------------------------------------------(نوع الحساب)  
                if ($('#AccType' + i).val() == "1") { TransVoucher_Model.AccFixedCode = $("#FixAcc" + i).val(); }     //-----(حساب  ثابت)

                else if ($('#AccType' + i).val() == "2") { TransVoucher_Model.AccVarCode = $("#VarAcc" + i).val(); }  //-----(حساب  متغير)

                else if ($('#AccType' + i).val() == "3") { TransVoucher_Model.AccBraCode = $("#BrAcc" + i).val(); }   //-----(حساب  فرع)

                TransVoucher_Model.CCType = $("#CCType" + i).val();//--------------------------------------------------(نوع الحساب)

                if ($('#CCType' + i).val() == "1") { TransVoucher_Model.CCFixedCode = $("#Fixcc" + i).val(); }       //----- (حساب  ثابت)

                else if ($('#CCType' + i).val() == "2") { TransVoucher_Model.CCVarCode = $("#VarCC" + i).val(); }    //-----(حساب  متغير)

                else if ($('#CCType' + i).val() == "3") { TransVoucher_Model.CCBraCode = $("#BrCC" + i).val(); }     //-----(حساب  فرع)

                TransVoucher_Model.IsCollective = $("#IsCollective" + i).val();
                TransVoucher_details.push(TransVoucher_Model);

            }
            if (StatusFlag == "d") {

                TransVoucher_Model.StatusFlag = StatusFlag.toString();
                TransVoucher_Model.COMP_CODE = Number(SysSession.CurrentEnvironment.CompCode);
                TransVoucher_Model.SUB_SYSTEM_CODE = drpuserType.value;
                TransVoucher_Model.SYSTEM_CODE = SysSession.CurrentEnvironment.SystemCode;
                TransVoucher_Model.TR_CODE = $('option:selected', $('#Val' + i)).attr('data-TR_CODE');
                TransVoucher_Model.SERIAL = $('#ser' + i).val();
                TransVoucher_Model.serial_num = $('#serial_none' + i).val();
                TransVoucher_details.push(TransVoucher_Model);

            }

        }


    }
    function updatelist() {

        Ajax.Callsync({
            type: "Post",
            url: sys.apiUrl("G_LnkTransVoucher", "Updatelsit"),
            data: JSON.stringify(TransVoucher_details),
            success: (d) => {

                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    MessageBox.Show('تم الحفظ', 'تم')
                    $('#btnUpdate_Def').removeClass('display_none');
                    $('#btnBack_Def').addClass('display_none');
                    $('#btnSave_Def').addClass('display_none');
                    //$('#btnShow').removeClass('display_none');
                    $('#btnAddDetails').addClass('display_none');
                    $('#drpuserType').removeAttr('disabled');
                    $('#drpStatus').removeAttr('disabled');
                    btnback_onclick();
                    //Display_All();
                }
            }
        });


    }
    function validation(cnt: number) {

        $("#ser" + cnt).removeAttr("disabled");
        $("#Val" + cnt).removeAttr("disabled");
        $("#ISDebit" + cnt).removeAttr("disabled");
        $("#txtLineRemarkA" + cnt).removeAttr("disabled");
        $("#txtLineRemarkE" + cnt).removeAttr("disabled");
        $("#AccType" + cnt).removeAttr("disabled");
        if ($("#AccType" + cnt).val() == '1') {
            $("#FixAcc" + cnt).removeAttr("disabled");
            $("#VarAcc" + cnt).attr("disabled", "disabled");
            $("#BrAcc" + cnt).attr("disabled", "disabled");
        }
        else if ($("#AccType" + cnt).val() == '2') {
            $("#FixAcc" + cnt).attr("disabled", "disabled");
            $("#BrAcc" + cnt).attr("disabled", "disabled");
            $("#VarAcc" + cnt).removeAttr("disabled");
        }
        else if ($("#AccType" + cnt).val() == '3') {
            $("#FixAcc" + cnt).attr("disabled", "disabled");
            $("#VarAcc" + cnt).attr("disabled", "disabled");
            $("#BrAcc" + cnt).removeAttr("disabled");
        }
        else {
            $("#FixAcc" + cnt).attr("disabled", "disabled");
            $("#VarAcc" + cnt).attr("disabled", "disabled");
            $("#BrAcc" + cnt).attr("disabled", "disabled");
        }
        $("#CCType" + cnt).removeAttr("disabled");
        if ($("#CCType" + cnt).val() == '1') {
            $("#BrCC" + cnt).attr("disabled", "disabled");
            $("#VarCC" + cnt).attr("disabled", "disabled");
            $("#Fixcc" + cnt).removeAttr("disabled");
        }
        else if ($("#CCType" + cnt).val() == '2') {
            $("#VarCC" + cnt).removeAttr("disabled");
            $("#Fixcc" + cnt).attr("disabled", "disabled");
            $("#BrCC" + cnt).attr("disabled", "disabled");
        }
        else if ($("#CCType" + cnt).val() == '3') {
            $("#Fixcc" + cnt).attr("disabled", "disabled");
            $("#BrCC" + cnt).removeAttr("disabled");
            $("#VarCC" + cnt).attr("disabled", "disabled");
        }
        else {
            $("#Fixcc" + cnt).attr("disabled", "disabled");
            $("#VarCC" + cnt).attr("disabled", "disabled");
            $("#BrCC" + cnt).attr("disabled", "disabled");
        }

        $("#IsCollective" + cnt).removeAttr("disabled");


        $("#btn_minus" + cnt).removeClass("display_none");
        $("#btn_minus" + cnt).removeAttr("disabled");
    }
    function validationdis(cnt: number) {
        $("#ser" + cnt).attr("disabled", "disabled");
        $("#Val" + cnt).attr("disabled", "disabled");
        $("#ISDebit" + cnt).attr("disabled", "disabled");
        $("#txtLineRemarkA" + cnt).attr("disabled", "disabled");
        $("#txtLineRemarkE" + cnt).attr("disabled", "disabled");
        $("#AccType" + cnt).attr("disabled", "disabled");
        $("#FixAcc" + cnt).attr("disabled", "disabled");
        $("#VarAcc" + cnt).attr("disabled", "disabled");
        $("#BrAcc" + cnt).attr("disabled", "disabled");
        $("#CCType" + cnt).attr("disabled", "disabled");
        $("#Fixcc" + cnt).attr("disabled", "disabled");
        $("#VarCC" + cnt).attr("disabled", "disabled");
        $("#BrCC" + cnt).attr("disabled", "disabled");
        $("#IsCollective" + cnt).attr("disabled", "disabled");
        $("#btn_minus" + cnt).addClass("display_none");
        $("#btn_minus" + cnt).attr("disabled", "disabled");





    }
    function validationGrid(cnt: number) {

        if ($('#ser' + cnt).val() == "") {
            WorningMessage("برجاء ادخال رقم المسلسل!", "Please enter the serial number!", "تحذير", "worning");


            Errorinput($('#ser' + cnt));
            return false

        }

        if ($('#txtLineRemarkA' + cnt).val().trim() == "" && $('#txtLineRemarkE' + cnt).val().trim() == "") {
            WorningMessage("برجاء ادخل الوصف باعربي او بالانجليزي!", "Please enter the description in Arabic or English!", "تحذير", "worning");
            Errorinput($('#txtLineRemarkA' + cnt));
            Errorinput($('#txtLineRemarkE' + cnt));

            return false

        }

        if ($('#Val' + cnt).val() == "Null") {
            WorningMessage("يجب اختيار النوع!", "must Enter Value!", "تحذير", "worning");
            Errorinput($('#Val' + cnt));

            return false

        }

        if ($('#AccType' + cnt).val() == "1" && $('#FixAcc' + cnt).val() == "Null") {
            WorningMessage("يجب اختيار النوع!", "must Enter Fixed Account!", "تحذير", "worning");
            Errorinput($('#FixAcc' + cnt));

            return false

        }
        if ($('#AccType' + cnt).val() == "2" && $('#VarAcc' + cnt).val() == "Null") {
            WorningMessage("يجب اختيار النوع!", "must Enter Varible Account!", "تحذير", "worning");
            Errorinput($('#VarAcc' + cnt));

            return false

        }
        if ($('#AccType' + cnt).val() == "3" && $('#BrAcc' + cnt).val() == "Null") {
            WorningMessage("يجب اختيار النوع!", "must Enter Branch Account!", "تحذير", "worning");
            Errorinput($('#BrAcc' + cnt));

            return false
        }

        if ($('#AccType' + cnt).val() == 2 && $('#CCType' + cnt).val() == 2) {

            let val = $('option:selected', $('#Val' + cnt)).attr('data-Source');
            let VarAcc = $('option:selected', $('#VarAcc' + cnt)).attr('data-Source');
            let VarCC = $('option:selected', $('#VarCC' + cnt)).attr('data-Source');


            if (val != VarAcc || val != VarCC || VarAcc != VarCC) {
                WorningMessage("يجب أختيار الحركات من نفس الجدول!", "Movements must be selected from the same table!", "تحذير", "worning");

                Errorinput($('#VarAcc' + cnt));
                Errorinput($('#VarCC' + cnt));
                Errorinput($('#Val' + cnt));

                 
                return false
            }

        }


        return true;



    }
    function Validate_serial(rowno: number) {
        //
        for (var i = 0; i < CountGrid; i++) {
            if (i != rowno) {

                if ($("#txt_StatusFlag" + i).val() == "d") {
                    return true;

                }
                else {

                    if ($("#ser" + rowno).val() == $("#ser" + i).val()) {
                        let Code = $("#ser" + rowno).val();
                        $("#ser" + rowno).val("");
                        WorningMessage("لا يمكن تكرار رقم الكود " + Code, "code cannot br repeated?", "تحذير", "worning", () => {
                            $("#ser" + rowno).val("");
                            Errorinput($("#ser" + rowno));
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



