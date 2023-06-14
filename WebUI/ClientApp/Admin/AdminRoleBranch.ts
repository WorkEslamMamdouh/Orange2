$(document).ready(() => {
    AdminRoleBranch.InitalizeComponent();
})
namespace AdminRoleBranch {
    var sys: SystemTools = new SystemTools();
    var SysSession: SystemSession = GetSystemSession(Modules.AdminRoleBranch);
    var Model: G_RoleBranch = new G_RoleBranch();  
    var Detail_Model = new Array<G_RoleBranch>();
    var GetRoleBranch = new Array<G_RoleBranch>(); 
    var GRole = new Array<G_Role>();
    var GBRANCH = new Array<G_BRANCH>();
    var btnSave: HTMLButtonElement;
    var btnBack: HTMLButtonElement;
    var btnEdit: HTMLButtonElement;
    var IsNew = true;
    var txtComp: HTMLInputElement;
    var txtBranch: HTMLInputElement;
    var btnAddDetails: HTMLButtonElement;
    var btnPermissionsrole: HTMLButtonElement;
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);
    var CountGrid = 0;

    export function InitalizeComponent() {
        InitalizeControls();
        InitializeEvents();
        GetData_Header_loader();
        GetComp();
    }

    function InitalizeControls() {
         btnSave = document.getElementById("btnSave") as HTMLButtonElement;
        btnBack = document.getElementById("btnBack") as HTMLButtonElement;
        btnEdit = document.getElementById("btnEdit") as HTMLButtonElement; 
        txtComp = document.getElementById("txtComp") as HTMLInputElement;
        txtBranch = document.getElementById("txtBranch") as HTMLInputElement;
        btnAddDetails = document.getElementById("btnAddDetails") as HTMLInputElement;
        btnPermissionsrole = document.getElementById("btnPermissionsrole") as HTMLInputElement;
    }

    function InitializeEvents() {
        txtComp.onchange = txtComp_onchange;
        txtBranch.onchange = txtBranch_onchange;
        btnAddDetails.onclick = AddNewRow;
        btnPermissionsrole.onclick = Update;

        //btnAdd.onclick = btnAdd_onclick;
        btnSave.onclick = btnSave_onclick;
        btnBack.onclick = btnBack_onclick;
        btnEdit.onclick = btnEdit_onclick;
    }
     
    function btnEdit_onclick() {
        $("#btnBack").removeClass("display_none");
        $("#btnSave").removeClass("display_none");
        $("#btnEdit").addClass("display_none");
        $("#btnEdit").addClass("display_none");
        $("#btnAddDetails").removeClass("display_none");
        txtComp.disabled = true;
        txtBranch.disabled = true;

        for (var i = 0; i < CountGrid; i++) {

           // $("#txtRole" + i).removeAttr("disabled");
            $("#btn_minus" + i).removeClass("display_none");

        }


    }

    function btnSave_onclick() {
        debugger
        if (!validation())
            return;
        var CanAdd: boolean = true;
        if (CountGrid > 0) {
            for (var i = 0; i < CountGrid; i++) {
                CanAdd = Validation_Grid(i);
                if (CanAdd == false) {
                    break;
                }
            }
        }
        if (CanAdd && CountGrid > 0) {
            Assign();
            Update();
            succes();
        } else {
            DisplayMassage('( برجاء اختيار الصلاحيه )', '(Error)', MessageType.Error);

        }


        

    }

    function validation() {


        if (txtComp.value == "" || txtComp.value.trim() == "") {
            DisplayMassage("يجب اختيار الشركة  ", "Please, Enter The CompCode!", MessageType.Worning);
            Errorinput(txtComp);
            return false;
        }
        if (txtBranch.value == "" || txtBranch.value.trim() == "") {
            DisplayMassage("يجب اختيار القرع  ", "Please, Enter The BranchCode!", MessageType.Worning);
            Errorinput(txtBranch);
            return false;
        } 
        return true;
    }

    function succes() {

        Disabled();
        // $("#divcompinformtion").removeClass("display_none");
        $("#btnEdit").removeClass("display_none");
        $("#btnBack").addClass("display_none");
        $("#btnSave").addClass("display_none");
        if (IsNew == false) {
            //Grid_RowDoubleClicked();
        }
        else {

            $("#btnEdit").removeClass("display_none");
            $("#btnSave").addClass("display_none");
            $("#btnBack").addClass("display_none");
            Disabled();
        }

    }

    function btnBack_onclick() {
        $("#btnEdit").removeClass("display_none");
        $("#btnSave").addClass("display_none");
        $("#btnBack").addClass("display_none"); 
        txtComp.disabled = false;
        txtBranch.disabled = false;
        $("#btnAddDetails").addClass("display_none");
        Display();
    }

    function txtComp_onchange() {
        $("#Div_DOC").removeClass("display_none");
        GetBranch();
        Display();
    }

    function txtBranch_onchange() {
        Display();
    }

    function GetComp() {

        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("G_Branch", "GetAllCOMP"),
            //data: {},
            success: (d) => {
                let result = d as Array<G_COMPANY>;
                debugger;
                if (result.length > 0) {
                    var compList: Array<G_COMPANY> = result as Array<G_COMPANY>;

                    for (var i = 0; i < compList.length; i++) {

                        $('#txtComp').append('<option value="' + compList[i].COMP_CODE + '">' + (lang == "ar" ? compList[i].NameA : compList[i].NameE) + '</option>');

                    }
                }
            }
        });

    }

    function GetBranch() {
        debugger
        txtBranch.innerHTML = "";
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("G_Branch", "GetAll"),
            data: { CompCode: Number(txtComp.value) },
            success: (d) => {
                let result = d as BaseResponse;
                debugger
                if (result.IsSuccess) {
                    var BranchList: Array<G_BRANCH> = result.Response as Array<G_BRANCH>;
                    for (var i = 0; i < BranchList.length; i++) {
                        $('#txtBranch').append(' <option value = "' + BranchList[i].BRA_CODE + '" > ' + (lang == "ar" ? BranchList[i].BRA_DESCE : BranchList[i].BRA_DESC) + ' </option>');
                    }
                }
            }
        });
    }

    function Display() {
         
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("G_Branch", "GetRoleBranch"),
            data: { CompCode: txtComp.value, BRA_CODE: txtBranch.value },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    GetRoleBranch = result.Response as Array<G_RoleBranch>;

                    $("#data_lebel").html('');
                    CountGrid = 0;
                    for (var i = 0; i < GetRoleBranch.length; i++) {
                        BuildControls(i);
                        Disbly_BuildControls(i, GetRoleBranch);
                        CountGrid += 1;
                    } 
                }
            }
        });
    }

    function Disbly_BuildControls(cnt: number, AQ_GetCustomerDoc: Array<G_RoleBranch>) {
        debugger
        $("#btnAddDetails").addClass("display_none");
        $("#btn_minus3" + cnt).addClass("display_none");
        $("#txt_StatusFlag" + cnt).val("");
        $("#COMP_CODE" + cnt).val(AQ_GetCustomerDoc[cnt].COMP_CODE);
        $("#BRA_CODE" + cnt).val(AQ_GetCustomerDoc[cnt].BRA_CODE);
        $("#txtRole" + cnt).val(AQ_GetCustomerDoc[cnt].RoleId);



    }

    function AddNewRow() {
        debugger
        if (txtComp.value == "null") {
            DisplayMassage(" يجب اختيار الشركة ", "The company must be selected", MessageType.Worning);
            Errorinput($('#txtComp'));
            return
        } else {
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
                $("#txtRole" + CountGrid).removeAttr("disabled");
                $("#btn_minus" + CountGrid).removeClass("display_none");
                $("#btn_minus" + CountGrid).removeAttr("disabled");
                 CountGrid++;
            }
             
        }

    }

    function BuildControls(cnt: number) {

        var html;
        html = '<div id="No_Row' + cnt + '" class=" font_header col-lg-12" style="bottom: 5px;font-weight:bold">' +
            '<span id="btn_minus' + cnt + '" class="fa fa-minus-circle fontitm4user lebelminus display_none"></span>' +
            '<div class="col-lg-5" style=""> <select disabled id="txtRole' + cnt + '" class="form-control"><option value="null">   اختر   </option> </select>  </div>' +

            '<div class="col-lg-1" style=""><input id="txt_StatusFlag' + cnt + '" name = " " type = "hidden" class="form-control"/><input id="COMP_CODE' + cnt + '" name = " " type = "hidden" class="form-control" /><input id="BRA_CODE' + cnt + '" name = " " type = "hidden" class="form-control" /></div></div>';

        $("#data_lebel").append(html);


        GetDataTable
        for (var i = 0; i < GRole.length; i++) {

            $('#txtRole' + cnt).append('<option value="' + GRole[i].RoleId + '">' + (lang == "ar" ? GRole[i].DescA : GRole[i].DescE) + '</option>');

        }

        $("#btn_minus" + cnt).on('click', function () {
            DeleteRow(cnt);
        });

        $("#txtRole" + cnt).on('change', function () {
            debugger
            if (Validate_Role(cnt) == false) {
                DisplayMassage("رقم الصلاحية موجود من قبل ", "The Role already exists", MessageType.Worning);
                Errorinput($("#txtRole" + cnt));
                $("#txtRole" + cnt).val('null')
                return false;
            }

            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");

        });
        return;
    }

    function DeleteRow(RecNo: number) {
        debugger
        $("#No_Row" + RecNo).attr("hidden", "true");

        $("#txt_StatusFlag" + RecNo).val() == 'i' ? $("#txt_StatusFlag" + RecNo).val('m') : $("#txt_StatusFlag" + RecNo).val('d');

        var StatusFlag = $("#txt_StatusFlag" + RecNo).val()

    }

    function Validation_Grid(rowcount: number) {
        if ($("#txt_StatusFlag" + rowcount).val() == "d" || $("#txt_StatusFlag" + rowcount).val() == "m") {
            return true;
        }
        else {
            if ($("#txtRole" + rowcount).val() == "null") {
                 DisplayMassage("اختر الصلاحية", "Choose validity", MessageType.Error);

                Errorinput($("#txtRole" + rowcount));
                return false;
            }

        }
        return true;
    }
     
    function btnBack_Def_onclick() {

        $('#btnBack_Def').addClass("display_none");
        $('#btnSave_Def').addClass("display_none"); 
        $('#btnAddDetails').attr('class', 'glyphicon glyphicon-plus-sign  display_none')
        $(".fa-minus-circle").addClass("display_none"); 
        CountGrid = 0;
        $("#data_lebel").html(""); 
    }

    function refresh() {

        $('#data_lebel').html("");
        CountGrid = 0;

    }

    function Update() {
        debugger 
        Ajax.Callsync({ 
            type: "POST",
            url: sys.apiUrl("G_Branch", "InsertRoleBranch"),
            data: JSON.stringify(Detail_Model),
            success: (d) => {
                debugger
                let result = d as BaseResponse;
                if (result.IsSuccess == true) {

                     if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
                        DisplayMassage('( تم تعديل بنجاح )', '(success)', MessageType.Succeed);
                      }
                     else {
                        DisplayMassage('( Done )', '(success)', MessageType.Succeed);
                     }
                     btnBack_Def_onclick();
                    refresh();
                    Display();

                    txtComp.disabled = false;
                    txtBranch.disabled = false;
                }
                else { 
                    MessageBox.Show(result.ErrorMessage, "خطأ");
                }
            }
        });
    }

    function Assign() {
        debugger
        Detail_Model = new Array<G_RoleBranch>();
        var StatusFlag: String;
        for (var i = 0; i < CountGrid; i++) {
            Model = new G_RoleBranch();
            StatusFlag = $("#txt_StatusFlag" + i).val();
            $("#txt_StatusFlag" + i).val("");
            if (StatusFlag == "i") {
                Model.StatusFlag = StatusFlag.toString();
                Model.COMP_CODE = Number(txtComp.value);
                Model.BRA_CODE = Number(txtBranch.value);
                Model.RoleId = Number($("#txtRole" + i).val());
                Detail_Model.push(Model);
            }
            if (StatusFlag == "u") {

                Model.StatusFlag = StatusFlag.toString();
                Model.COMP_CODE = Number(txtComp.value);
                Model.BRA_CODE = Number(txtBranch.value);
                Model.RoleId = Number($("#txtRole" + i).val());
                Detail_Model.push(Model);

            }
            if (StatusFlag == "d") {
                debugger
                if (txtComp.value != "null") {
                    Model.StatusFlag = StatusFlag.toString();
                    Model.COMP_CODE = Number(txtComp.value);
                    Model.BRA_CODE = Number(txtBranch.value);
                    Model.RoleId = Number($("#txtRole" + i).val());
                    Detail_Model.push(Model);

                }
            }
        }
    }

    function GetData_Header_loader() {
        var Table: Array<Table>;
        Table =
            [ 
                 { NameTable: 'G_Role', Condition: "RoleType=3" },

            ]
        DataResult(Table);
        GRole = GetDataTable('G_Role') as Array<G_Role>;

    }

    function Validate_Role(rowno: number) {

        var res: boolean = true;

        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("G_Branch", "chackRole"),
            data: {
                COMP_CODE: Number(txtComp.value), Branch_CODE: Number(txtBranch.value), Roleid: Number($("#txtRole" + rowno).val())
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

    function Disabled() {



    } 
}
