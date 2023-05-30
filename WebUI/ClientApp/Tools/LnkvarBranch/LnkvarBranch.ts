$(document).ready(() => {

    LnkvarBranch.InitalizeComponent();
})
namespace LnkvarBranch {

    var LnktypeA = "ACC";
    var LnktypeC = "CC";
    var compcode: Number;
    var BranchCode;
    var cnt: number;


    var SysSession: SystemSession = GetSystemSession(Modules.LnkvarBranch);
    var sys: SystemTools = new SystemTools();


    //GridView                        
    var ReportGrid: JsGrid = new JsGrid();
    var ReportGrid2: JsGrid = new JsGrid();


    var Detailsbra: Array<GQ_GetLnkVarBranch> = new Array<GQ_GetLnkVarBranch>();
    var Detailsnull: Array<GQ_GetLnkVarBranch> = new Array<GQ_GetLnkVarBranch>();
    var Details: Array<GQ_GetLnkVarBranch> = new Array<GQ_GetLnkVarBranch>();
    var Details1: Array<GQ_GetLnkVarBranch> = new Array<GQ_GetLnkVarBranch>();
    var Detailsbranch: Array<G_LnkVarBranch> = new Array<G_LnkVarBranch>();
    var DetaiSinglbranch: G_LnkVarBranch = new G_LnkVarBranch();
    var BranchDetails: Array<G_BRANCH> = new Array<G_BRANCH>();
    var CostCenterDetails: Array<G_COST_CENTER> = new Array<G_COST_CENTER>();
    var AccountDetails: Array<A_ACCOUNT> = new Array<A_ACCOUNT>();


    var btnUpdate_Def: HTMLButtonElement;
    var btnBack_Def: HTMLButtonElement;
    var btnSave_Def: HTMLButtonElement;
    var btnAddDetails: HTMLButtonElement;


    var drpuserType: HTMLSelectElement;
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);
    var flagUpdate = false;
    export function InitalizeComponent() {
        $("#NoDubleclick").val('1');
        $("#Mod_Flag").val('1');

        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") { document.getElementById('Screen_name').innerHTML = "حسابات ربط الفروع"; }

        else { document.getElementById('Screen_name').innerHTML = "Branch Interconnect Accounts"; }

        compcode = Number(SysSession.CurrentEnvironment.CompCode);


        InitalizeControls();
        InitializeEvents();
        InitializeGridACC();
        InitializeGridCC();
        fillddlBranch();
        GetAll_Acc();
        Get_CostCenter();
    }
    function InitalizeControls() {
        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") { document.getElementById('Screen_name').innerHTML = " حسابات ربط الفروع  "; } else { document.getElementById('Screen_name').innerHTML = "Branch Link Accounts"; }

        $('#divIconbar').addClass('hidden_Control');
        $('#divIconbar').addClass('icon-bar');
        $('#iconbar_Definition').removeClass('hidden_Control');
        $("#divShow").removeClass("display_none");

        btnUpdate_Def = document.getElementById("btnUpdate_Def") as HTMLButtonElement;
        btnBack_Def = document.getElementById("btnBack_Def") as HTMLButtonElement;
        btnSave_Def = document.getElementById("btnSave_Def") as HTMLButtonElement;


        btnAddDetails = document.getElementById("btnAddDetails") as HTMLButtonElement;
        drpuserType = document.getElementById("drpuserType") as HTMLSelectElement;

    }
    function InitializeEvents() {
        drpuserType.onchange = Display;
        btnUpdate_Def.onclick = btnedite_onclick;
        btnBack_Def.onclick = btnback_onclick;
        btnSave_Def.onclick = btnsave_onclick;
    }

    function check_Account(Ser: number) {
        debugger
        $("#text_AccountCode" + Ser).val();
        //alert($(this).val());
        Detailsbra = new Array<GQ_GetLnkVarBranch>();

        let check_ACC = AccountDetails.filter(s => s.ACC_CODE == $("#text_AccountCode" + Ser).val() && s.COMP_CODE == compcode && s.DETAIL == true);

        if (check_ACC.length > 0) {
            Detailsbra = Details.filter(s => s.Ser == Ser);
            Detailsbra[0].GLAccountCode = check_ACC[0].ACC_CODE;
            Detailsbra[0].GLAcc_DescA = check_ACC[0].ACC_DESCA;
            $("#text_Acc_Desc" + Ser).val((lang == "ar" ? check_ACC[0].ACC_DESCA : check_ACC[0].ACC_DESCL));
            Detailsbranch.push(Detailsbra[0]);
        }
        else {
            $("#text_AccountCode" + Ser).val('');
            $("#text_Acc_Desc" + Ser).val('');
            WorningMessage("هذا الرقم لا يوجد له حساب!", "This number does not have an account!", "تحذير", "worning");
        }

    }

    function check_ccenter(Ser: number) {
        debugger
        $("#text_CC_Code" + Ser).val();
        //alert($(this).val());
        Detailsbra = new Array<GQ_GetLnkVarBranch>();
        let check_ACC = CostCenterDetails.filter(s => s.CC_CODE == $("#text_CC_Code" + Ser).val() && s.COMP_CODE == compcode);
        if (check_ACC.length > 0) {
            Detailsbra = Details1.filter(s => s.Ser == Ser);
            Detailsbra[0].CC_Code = check_ACC[0].CC_CODE;
            Detailsbra[0].GSt_DescA = check_ACC[0].CC_DESCA;
            $("#text_CC_Desc" + Ser).val((lang == "ar" ? check_ACC[0].CC_DESCA : check_ACC[0].CC_DESCE));
            Detailsbranch.push(Detailsbra[0]);
        }
        else {
            $("#text_CC_Code" + Ser).val('');
            $("#text_CC_Desc" + Ser).val('');

            WorningMessage("هذا الرقم لا يوجد له حساب!", "This number does not have an account!", "تحذير", "worning");
        }

    }



    function check_Account_Grid(Ser: number) {

        let check_ACC = AccountDetails.filter(s => s.ACC_CODE == $("#text_AccountCode" + Ser).val() && s.COMP_CODE == compcode && s.DETAIL == true);

        if (check_ACC.length > 0 || $("#text_AccountCode" + Ser).val() == "" || $("#text_AccountCode" + Ser).val() == " " || $("#text_AccountCode" + Ser).val() == "  " || $("#text_AccountCode" + Ser).val() == null) {
            $("#text_AccountCode" + Ser).removeClass('text_Mandatory');
            $("#text_Acc_Desc" + Ser).removeClass('text_Mandatory');
        }
        else {
            $("#text_AccountCode" + Ser).addClass('text_Mandatory');
            $("#text_Acc_Desc" + Ser).addClass('text_Mandatory');
            WorningMessage("هذا الرقم لا يوجد له حساب!", "This number does not have an account!", "تحذير", "worning");
            return false;

        }

        return true;
    }


    function check_ccenter_Grid(Ser: number) {

        let check_CC = CostCenterDetails.filter(s => s.CC_CODE == $("#text_CC_Code" + Ser).val() && s.COMP_CODE == compcode);

        if (check_CC.length > 0 || $("#text_CC_Code" + Ser).val() == "" || $("#text_CC_Code" + Ser).val() == " " || $("#text_CC_Code" + Ser).val() == "  " || $("#text_CC_Code" + Ser).val() == null) {
            $("#text_CC_Code" + Ser).removeClass('text_Mandatory');
            $("#text_CC_Desc" + Ser).removeClass('text_Mandatory');
        }
        else {
            $("#text_CC_Code" + Ser).addClass('text_Mandatory');
            $("#text_CC_Desc" + Ser).addClass('text_Mandatory');
            WorningMessage("هذا الرقم لا يوجد له حساب!", "This number does not have an account!", "تحذير", "worning");
            return false;

        }

        return true;
    }


    function btnedite_onclick() {
        if ($('#drpuserType').val() != "Null") {
            $('#btnBack_Def').removeClass('display_none')
            $('#btnSave_Def').removeClass('display_none')
            $('#btnUpdate_Def').addClass('display_none')
            $('.dis').removeAttr('disabled');
            $(".acc_Cod").removeAttr('disabled');
            flagUpdate = true;
        } else {
            WorningMessage("يجب اختيار الفرع!", "Must choose Type!", "تحذير", "worning");
          

            return;

        }


    }
    function btnback_onclick() {
        $('#btnBack_Def').addClass('display_none')
        $('#btnSave_Def').addClass('display_none')
        $('#btnUpdate_Def').removeClass('display_none')
        $('.dis').attr('disabled', 'disabled');
        $('.acc_Cod').attr('disabled', 'disabled');
        Display();
    }
    function btnsave_onclick() {


        var CanAdd: boolean = true;
        var Can_Check: boolean = true;
        let cnt = 1;

        if (Details.length > -1) {
            let ii = 0;

            $("#ReportGrid1").jsGrid("option", "pageIndex", cnt);

            for (var i = 0; i < Details.length; i++) {
                debugger

                if (ii > 15) {
                    cnt += 1;

                    $("#ReportGrid1").jsGrid("option", "pageIndex", cnt);

                    ii = 0;
                }
                CanAdd = check_Account_Grid(Details[i].Ser);
                if (CanAdd == false) {
                    Can_Check = false;
                    break;
                }
                ii++;
            }
        }
        if (Can_Check) {

            CanAdd = true;
            Can_Check = true;
            cnt = 1;

            if (Details1.length > -1) {
                let ii = 0;

                $("#ReportGrid2").jsGrid("option", "pageIndex", cnt);

                for (var i = 0; i < Details1.length; i++) {
                    debugger

                    if (ii > 15) {
                        cnt += 1;

                        $("#ReportGrid2").jsGrid("option", "pageIndex", cnt);

                        ii = 0;
                    }
                    CanAdd = check_ccenter_Grid(Details1[i].Ser);
                    if (CanAdd == false) {
                        Can_Check = false;
                        break;
                    }
                    ii++;
                }
            }

        }

        if (Can_Check) {

            if (Detailsbranch.length != 0) {

                Detailsbranch[0].Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
                Detailsbranch[0].UserCode = SysSession.CurrentEnvironment.UserCode;

                Detailsbranch[0].Branch_Code = SysSession.CurrentEnvironment.BranchCode;
                Detailsbranch[0].Comp_Code = SysSession.CurrentEnvironment.CompCode;
                Detailsbranch[0].MODULE_CODE = Modules.LnkvarBranch; 
                Detailsbranch[0].sec_FinYear = SysSession.CurrentEnvironment.CurrentYear;


                Ajax.Callsync({
                    type: "POST",
                    url: sys.apiUrl("G_LnkVarBranch", "Update"),
                    data: JSON.stringify(Detailsbranch),
                    success: (d) => {
                        let result = d as BaseResponse;
                        if (result.IsSuccess == true) {
                            MessageBox.Show('تم الحفظ', '');
                            $('#btnBack_Def').addClass('display_none')
                            $('#btnSave_Def').addClass('display_none')
                            $('#btnUpdate_Def').removeClass('display_none')
                            $('.dis').attr('disabled', 'disabled');
                            Display();
                        }
                        else {

                            MessageBox.Show('خطأ', 'Error')
                        }
                    }
                });

            }
            else {
                MessageBox.Show('لا يوجد تعديل للحفظ', 'No edit to save');

            }


        }

    }

    function fillddlBranch() {

        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GBranch", "GetAll"),
            data: {
                CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    BranchDetails = result.Response as Array<G_BRANCH>;
                    DisplaydrpuserType();
                }

            }
        });
    }
    function DisplaydrpuserType() {
        debugger

        //BranchDetails = new Array<G_BRANCH>();
        for (var i = 0; i < BranchDetails.length; i++) {
            $('#drpuserType').append('<option value="' + BranchDetails[i].BRA_CODE + '">' + BranchDetails[i].BRA_DESC + '</option>');

        }

    }
    function Display() {
        debugger;
        if ($('#drpuserType').val() != "Null") {

            Display1();
            Display2();
        }
        else {

            gridempty();


        }
        flagUpdate = false;
    }
    function gridempty() {
        InitializeGridACC();
        InitializeGridCC();
        ReportGrid.DataSource = Detailsnull;
        ReportGrid.Bind();
        ReportGrid2.DataSource = Detailsnull;
        ReportGrid2.Bind();
    }
    function Display1() {
        debugger;



        Details = new Array<GQ_GetLnkVarBranch>();
        // Detailsbranch = new Array<G_LnkVarBranch>();

        BranchCode = Number($('#drpuserType').val());
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("G_LnkVarBranch", "GetAll_GQ_GetLnkVarBranch"),
            data: {
                CompCode: compcode, BraCode: BranchCode, Lnktype: LnktypeA, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                //debugger;
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    debugger
                    Details = result.Response as Array<GQ_GetLnkVarBranch>;

                    InitializeGridACC();
                    ReportGrid.DataSource = Details;
                    ReportGrid.Bind();


                }

            }
        });
    }
    function InitializeGridACC() {
         
        let res: any = GetResourceList("");
        $("#id_ReportGrid").attr("style", "");
         
        ReportGrid.ElementName = "ReportGrid1"; 
        ReportGrid.Paging = true;
        ReportGrid.PageSize = 15;
        ReportGrid.Sorting = true;
        ReportGrid.InsertionMode = JsGridInsertionMode.Binding;
        ReportGrid.Editing = false;
        ReportGrid.Inserting = false;
        ReportGrid.SelectedIndex = 1;
        ReportGrid.OnItemEditing = () => { };
        ReportGrid.Columns = [
                    
            { title: res.App_serial, name: "Ser", type: "text", width: "5%" },
            { title: res.App_desc, name: (lang == "ar" ? "Acc_DescA" : "Acc_DescE") , type: "text", width: "10%" },
            {
                title: res.p_account_number, name: "GLAccountCode", type: "text", width: "10%",
                itemTemplate: (s: string, item: GQ_GetLnkVarBranch): HTMLInputElement => {
                    let txt: HTMLInputElement = document.createElement("input");
                    txt.type = "input";
                    //txt.disabled = false;
                    txt.id = "text_AccountCode" + item.Ser;
                    txt.name = "GLAccountCode";
                    if ($('#btnUpdate_Def').is(":hidden")) {
                        txt.disabled = false;
                    }
                    else {

                        txt.disabled = true;
                    }
                
                    txt.className = "form-control acc_Cod";
                    txt.onchange = (e) => {
                        check_Account(item.Ser);

                    };
                    txt.value = item.GLAccountCode;
                    //alert(item.GLAccountCode);
                    return txt;
                }
            },
            {
                title: res.Account_name, name: "Acc_DescA", type: "text", width: "10%",
                itemTemplate: (s: string, item: GQ_GetLnkVarBranch): HTMLInputElement => {
                    let txt: HTMLInputElement = document.createElement("input");
                    txt.type = "input";
                    txt.disabled = false;
                    txt.id = "text_Acc_Desc" + item.Ser;
                    txt.disabled = true;
                    txt.name = (lang == "ar" ? "Acc_DescA" : "Acc_DescL");
                    txt.value = item.GLAcc_DescA;
                    txt.className = "form-control";


                    return txt;
                }
            },
            {
                width: "5%",
                itemTemplate: (s: string, item: GQ_GetLnkVarBranch): HTMLInputElement => {
                    let txt: HTMLInputElement = document.createElement("input");
                    txt.type = "button";
                    txt.value = (lang == "ar" ? "بحث" : "Search");
                    txt.id = "but" + item.Ser;
                    txt.className = "btn btn-main dis";

                    if ($('#btnUpdate_Def').is(":hidden")) {
                        txt.disabled = false;
                    }
                    else {

                        txt.disabled = true;
                    }
                    txt.onclick = (e) => {
                        PopUpSearch(item.Ser);


                    };
                    return txt;
                }
            },

        ];

        ReportGrid.Bind();
    }
    function PopUpSearch(txtId: number) {

        debugger
        Detailsbra = new Array<GQ_GetLnkVarBranch>();
        sys.FindKey(Modules.Accountbalances, "btnFromAccSearch", "COMP_CODE= " + compcode + " and DETAIL = 1 ", () => {
            let id = SearchGrid.SearchDataGrid.SelectedKey;
            $("#text_AccountCode" + txtId).val(id);

            let Get_ACC = AccountDetails.filter(s => s.ACC_CODE == $("#text_AccountCode" + txtId).val() && s.COMP_CODE == compcode && s.DETAIL == true);
            $("#text_Acc_Desc" + txtId).val((lang == "ar" ? Get_ACC[0].ACC_DESCA : Get_ACC[0].ACC_DESCL));

            Detailsbra = Details.filter(s => s.Ser == txtId);
            Detailsbra[0].GLAccountCode = $("#text_AccountCode" + Detailsbra[0].Ser).val();
            Detailsbra[0].Acc_DescA = $("#text_Acc_Desc" + Detailsbra[0].Ser).val();
            Detailsbranch.push(Detailsbra[0]);


        });

    }
    function GetAll_Acc() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GLDefAccount", "GetAll"),
            data: { CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    AccountDetails = result.Response as Array<A_ACCOUNT>;
                }
            }
        });

    }
    function Display2() {
        debugger;

        Details1 = new Array<GQ_GetLnkVarBranch>();

        BranchCode = Number($('#drpuserType').val());
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("G_LnkVarBranch", "GetAll"),
            data: {
                CompCode: compcode, BraCode: BranchCode, Lnktype: LnktypeC, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                //debugger;
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    Details1 = result.Response as Array<GQ_GetLnkVarBranch>;

                    InitializeGridCC();
                    ReportGrid2.DataSource = Details1;
                    ReportGrid2.Bind();


                }

            }
        });
    }
    function InitializeGridCC() {
        let res: any = GetResourceList(""); 
        $("#id_ReportGrid").attr("style", ""); 
                 
        ReportGrid2.ElementName = "ReportGrid2"; 
        ReportGrid2.Paging = true;
        ReportGrid2.PageSize = 10;
        ReportGrid2.Sorting = true;
        ReportGrid2.InsertionMode = JsGridInsertionMode.Binding;
        ReportGrid2.Editing = false;
        ReportGrid2.Inserting = false;
        ReportGrid2.SelectedIndex = 1;
        ReportGrid2.OnItemEditing = () => { };
        ReportGrid2.Columns = [
            { title: res.App_serial, name: "Ser", type: "text", width: "5%" },
            { title: res.App_desc, name: (lang == "ar" ? "Acc_DescA" : "Acc_DescE") , type: "text", width: "10%" },
            {
                title: res.menu_Costcenter, name: "CC_Code", type: "text", width: "10%",
                itemTemplate: (s: string, item: GQ_GetLnkVarBranch): HTMLInputElement => {
                    let txt: HTMLInputElement = document.createElement("input");
                    txt.type = "input";
                    txt.disabled = false;
                    txt.id = "text_CC_Code" + item.Ser;
                    txt.disabled = true;
                    txt.name = "CC_Code";
                    txt.value = item.CC_Code;  
                    if ($('#btnUpdate_Def').is(":hidden")) {
                        txt.disabled = false;
                    }
                    else
                    {
                          txt.disabled = true;
                    }
                    txt.className = "form-control acc_Cod";
                    txt.onchange = (e) => {
                    check_ccenter(item.Ser);
                    };
                    return txt;
                }
            },
            {
                title: res.Costcenter_name, name: (lang == "ar" ? "CC_DescA" : "CC_DescE") , type: "text", width: "10%",
                itemTemplate: (s: string, item: GQ_GetLnkVarBranch): HTMLInputElement => {
                    let txt: HTMLInputElement = document.createElement("input");
                    txt.type = "input";
                    txt.disabled = false;
                    txt.id = "text_CC_Desc" + item.Ser;
                    txt.disabled = true;
                    txt.name = (lang == "ar" ? "CC_DescA" : "CC_DescE");
                    txt.value = item.GSt_DescA;
                    txt.className = "form-control";  
                    return txt;
                }
            },

            {
                width: "5%",
                itemTemplate: (s: string, item: GQ_GetLnkVarBranch): HTMLInputElement => {
                    let txt: HTMLInputElement = document.createElement("input");
                    txt.type = "button";
                    txt.value = (lang == "ar" ? "بحث" : "Search");
                    txt.disabled = false;
                    txt.id = "but" + item.Ser;
                    txt.disabled = true;
                    txt.className = "btn btn-main dis"; 

                    if ($('#btnUpdate_Def').is(":hidden")) {
                        txt.disabled = false;
                    }
                    else {

                        txt.disabled = true;
                    }
                    txt.onclick = (e) => {
                        btnCCostSearch_onclick(item.Ser);

                    };
                    return txt;
                }
            },

        ];

        ReportGrid2.Bind();
    }
    function btnCCostSearch_onclick(txtId: number) {

        debugger
        Detailsbra = new Array<GQ_GetLnkVarBranch>();
        let sys: SystemTools = new SystemTools();
        sys.FindKey(Modules.Accountstatement, "btnCCostSearch", "COMP_CODE=" + compcode + " ", () => {
            let id = SearchGrid.SearchDataGrid.SelectedKey
            $("#text_CC_Code" + txtId).val(id);

            let Get_CC = CostCenterDetails.filter(s => s.CC_CODE == id && s.COMP_CODE == compcode);
            //alert(Get_CC);
            $("#text_CC_Desc" + txtId).val(Get_CC[0].CC_DESCA);
            Detailsbra = Details1.filter(s => s.Ser == txtId);
            Detailsbra[0].CC_Code = $("#text_CC_Code" + Detailsbra[0].Ser).val();
            Detailsbranch.push(Detailsbra[0]);

        });

    }
    function Get_CostCenter() {

        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("CostCenter", "GetAll"),
            data: { CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    CostCenterDetails = result.Response as Array<G_COST_CENTER>;
                }
            }
        });

    }






}



