$(document).ready(() => {
    G_Module.InitalizeComponent();
})
namespace G_Module {
    var sys: SystemTools = new SystemTools();
    var SysSession: SystemSession = GetSystemSession(Modules.AdminRoleBranch);
    var ModelGRole: G_Role = new G_Role();
    var masterDetail: G_MODULES = new G_MODULES();
    var Model: G_MODULES = new G_MODULES();
    var Detail_Model = new Array<G_MODULES>();
    var GetRoleBranch = new Array<G_MODULES>();
    var GRole = new Array<G_Role>();
     
    var GRoleUsers = new Array<G_RoleUsers>();
    var RoleUsers = new Array<G_RoleUsers>();
    var GRoleModule = new Array<G_RoleModule>();
    var GMODULES = new Array<G_MODULES>();
    var GetG_MODULES = new Array<G_MODULES>();
    var RoleModule = new Array<G_RoleModule>();
    var SelecteData = new Array<G_Role>();
    var GBRANCH = new Array<G_BRANCH>();
    var Grid: JsGrid = new JsGrid(); 
    var btnSave: HTMLButtonElement;
    var btnBack: HTMLButtonElement;
    var btnEdit: HTMLButtonElement;
    var IsNew = true;
    var txtRoleId: HTMLInputElement;
    var txtComp: HTMLInputElement;
    var txtBranch: HTMLInputElement;
    var btnAddDetails: HTMLButtonElement;
    var btnAddDetails3: HTMLButtonElement;
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);
    var CountGrid = 0;
    var CountGrid3 = 0;
    var Newcount = 0;
    var Newcount3 = 0;
    var RoleId_;

    export function InitalizeComponent() {
        InitalizeControls();
        InitializeEvents();
        GetData_Header_loader();
        Get_G_MODULES();
    }

    function InitalizeControls() {
         btnSave = document.getElementById("btnSave") as HTMLButtonElement;
        btnBack = document.getElementById("btnBack") as HTMLButtonElement;
        btnEdit = document.getElementById("btnEdit") as HTMLButtonElement;
        btnAddDetails = document.getElementById("btnAddDetails") as HTMLInputElement;
        txtRoleId = document.getElementById("txtRoleId") as HTMLInputElement;
    }

    function InitializeEvents() {

        btnAddDetails.onclick = AddNewRow; 
        btnSave.onclick = btnSave_onclick;
        btnBack.onclick = btnBack_onclick;
        btnEdit.onclick = btnEdit_onclick;
    }

    

 
    function Get_G_MODULES() {
        debugger
         
        $("#div_BasicData :input").attr("disabled", "disabled");
         
        $("#btnEdit").addClass("display_none");
        $("#btnEdit").removeClass("display_none");
        $("#btnSave").addClass("display_none");
        $("#btnBack").addClass("display_none");
         
         
        $("#data_lebel2").removeClass("display_none");
        
        Display();

    }

 
    function EnableControls() {

        $("#Div_control").removeClass("display_none");
        $('#btnSave').removeClass("display_none");
        $('#btnBack').removeClass("display_none");
        $('#btnEdit').addClass("display_none");
        $('#txt_Category').prop("selectedIndex", 0);

    }

    function btnEdit_onclick() {
        IsNew = false;
        $("#btnBack").removeClass("display_none");
        $("#btnSave").removeClass("display_none");
        $("#btnEdit").addClass("display_none");
        $("#btnEdit").addClass("display_none");
        $("#btnAddDetails").removeClass("display_none");
        $("#GridDetails").attr("disabled", "disabled").off('click');
        $("#GridDetails").addClass("disabledDiv");
        $("#div_BasicData :input").removeAttr("disabled");
 
        Enabel()
        //for (var i = 0; i < CountGrid; i++) {

        //    CUSTOMChange("DELETE", i);
        //    CUSTOMChange("EXECUTE", i);
        //    CUSTOMChange("VIEW", i);
        //    CUSTOMChange("CREATE", i);
        //    CUSTOMChange("EDIT", i);
        //    CUSTOMChange("CUSTOM1", i);
        //    CUSTOMChange("CUSTOM2", i);
        //    CUSTOMChange("CUSTOM3", i);
        //    CUSTOMChange("CUSTOM4", i);
        //    CUSTOMChange("CUSTOM5", i);
        //    CUSTOMChange("CUSTOM6", i);
        //    CUSTOMChange("CUSTOM7", i);
        //}
    }

    function btnSave_onclick() {

        setTimeout(function () {

            finishSave('btnSave');
            if (!validation()) return
            debugger
            Newcount = 0;
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

                 
                    Assign();
                    Update();

                
            }
        }, 100);

    }

    function btnBack_onclick() {
        debugger
        if (IsNew == true) {

            $("#btnEdit").addClass("display_none");
            $("#btnSave").addClass("display_none");
            $("#btnBack").addClass("display_none"); 
            $("#data_lebel2").addClass("display_none");

            $("#GridDetails").removeAttr("disabled").off('click');
            $("#GridDetails").removeClass("disabledDiv");

            $("#div_BasicData :input").attr("disabled", "disabled");

            Disabled();
            InitalizeComponent();

        } else {
            $("#btnEdit").removeClass("display_none");
            $("#btnSave").addClass("display_none");
            $("#btnBack").addClass("display_none");

            $("#GridDetails").removeAttr("disabled").off('click');
            $("#GridDetails").removeClass("disabledDiv");

            $("#div_BasicData :input").attr("disabled", "disabled");

            Disabled();
        }


    }

    function validation() {

        if ($("#txtDescA").val() == "" || $("#txtDescA").val() == "") {
            DisplayMassage(" يجب ادخال اسم عربي  ", "Please, Enter The CompCode!", MessageType.Worning);
            Errorinput($("#txtDescA"));
            return false;
        }
        if ($("#txtDescE").val() == "" || $("#txtDescA").val() == "") {
            DisplayMassage(" يجب ادخال اسم انجليزي  ", "Please, Enter The CompCode!", MessageType.Worning);
            Errorinput($("#txtDescE"));
            return false;
        }
        if ($("#txtRemarks").val() == "" || $("#txtRemarks").val() == "") {
            DisplayMassage(" يجب ادخال الوصف الوصف لتفصيل الصلاحية  ", "Please, Enter The CompCode!", MessageType.Worning);
            Errorinput($("#txtRemarks"));
            return false;
        }

        return true;
    }
     
    function Display() {
        debugger


        GMODULES = GetDataTable('G_MODULES') as Array<G_MODULES>;
        debugger
        GetG_MODULES= GMODULES.sort(dynamicSort("MENU_NO"));
        $("#DataDetails").html('');
        CountGrid = 0;
        for (var i = 0; i < GetG_MODULES.length; i++) {
            BuildControls(i);
            Disbly_BuildControls(i, GetG_MODULES);
            CountGrid += 1;
        }
    }

    function Disbly_BuildControls(cnt: number, Module: Array<G_MODULES>) {
        debugger
        $("#btnAddDetails").addClass("display_none");
        $("#btn_minus3" + cnt).addClass("display_none");
        $("#txt_StatusFlag" + cnt).val("");
        $("#MODULE_CODE" + cnt).val(Module[cnt].MODULE_CODE); 
        $("#SYSTEM_CODE" + cnt).val(Module[cnt].SYSTEM_CODE);
        $("#SUB_SYSTEM_CODE" + cnt).val(Module[cnt].SUB_SYSTEM_CODE);
        $("#MENU_NO" + cnt).val(Module[cnt].MENU_NO);
        $("#MODULE_TYPE" + cnt).val(Module[cnt].MODULE_TYPE);
        $("#CUSTOM1_DESC" + cnt).val(Module[cnt].CUSTOM1_DESC);
        $("#CUSTOM2_DESC" + cnt).val(Module[cnt].CUSTOM2_DESC);
        $("#CUSTOM3_DESC" + cnt).val(Module[cnt].CUSTOM3_DESC);
        $("#CUSTOM4_DESC" + cnt).val(Module[cnt].CUSTOM4_DESC);
        $("#CUSTOM5_DESC" + cnt).val(Module[cnt].CUSTOM5_DESC);
        $("#CUSTOM6_DESC" + cnt).val(Module[cnt].CUSTOM6_DESC);
        $("#CUSTOM7_DESC" + cnt).val(Module[cnt].CUSTOM7_DESC);
        $("#CUSTOM8_DESC" + cnt).val(Module[cnt].CUSTOM8_DESC);
        $("#CUSTOM9_DESC" + cnt).val(Module[cnt].CUSTOM9_DESC);

        
         

        var AVAILABLE = document.getElementById("AVAILABLE" + cnt) as HTMLInputElement;
        if (Module[cnt].AVAILABLE == true) {
            AVAILABLE.checked = true;
        } else {
            AVAILABLE.checked = false;
           
        }
        var PRINT = document.getElementById("PRINT" + cnt) as HTMLInputElement;
        if (Module[cnt].PRINT == true) {
            PRINT.checked = true;
        } else {
            PRINT.checked = false;
           
        }
        var VIEW = document.getElementById("VIEW" + cnt) as HTMLInputElement;
        if (Module[cnt].VIEW == true) {
            VIEW.checked = true;
        } else {
            VIEW.checked = false;
           
        }
        var CREATE = document.getElementById("CREATE" + cnt) as HTMLInputElement;
        if (Module[cnt].CREATE == true) {
            CREATE.checked = true;
        } else {
            CREATE.checked = false;
           

        }

        var EDIT = document.getElementById("EDIT" + cnt) as HTMLInputElement;
        if (Module[cnt].EDIT == true) {
            EDIT.checked = true;
        } else {
            EDIT.checked = false;
           

        }

        var DELETE = document.getElementById("DELETE" + cnt) as HTMLInputElement;
        if (Module[cnt].DELETE == true) {
            DELETE.checked = true;
        } else {
            DELETE.checked = false;
           

        }

        var CUSTOM1 = document.getElementById("CUSTOM1" + cnt) as HTMLInputElement;
        if (Module[cnt].CUSTOM1 == true) {
            CUSTOM1.checked = true;
        } else {
            CUSTOM1.checked = false;
           

        }

        var CUSTOM2 = document.getElementById("CUSTOM2" + cnt) as HTMLInputElement;
        if (Module[cnt].CUSTOM2 == true) {
            CUSTOM2.checked = true;
        } else {
            CUSTOM2.checked = false;
           

        }

        var CUSTOM3 = document.getElementById("CUSTOM3" + cnt) as HTMLInputElement;
        if (Module[cnt].CUSTOM3 == true) {
            CUSTOM3.checked = true;
        } else {
            CUSTOM3.checked = false;
 
        }

        var CUSTOM4 = document.getElementById("CUSTOM4" + cnt) as HTMLInputElement;
        if (Module[cnt].CUSTOM4 == true) {
            CUSTOM4.checked = true;
        } else {
            CUSTOM4.checked = false;
 
        }

        var CUSTOM5 = document.getElementById("CUSTOM5" + cnt) as HTMLInputElement;
        if (Module[cnt].CUSTOM5 == true) {
            CUSTOM5.checked = true;
        } else {
            CUSTOM5.checked = false;
 
        }

        var CUSTOM6 = document.getElementById("CUSTOM6" + cnt) as HTMLInputElement;
        if (Module[cnt].CUSTOM2 == true) {
            CUSTOM6.checked = true;
        } else {
            CUSTOM6.checked = false;
 
        }

        var CUSTOM7 = document.getElementById("CUSTOM7" + cnt) as HTMLInputElement;
        if (Module[cnt].CUSTOM7 == true) {
            CUSTOM7.checked = true;
        } else {
            CUSTOM7.checked = false;
 
        }
        var CUSTOM8 = document.getElementById("CUSTOM8" + cnt) as HTMLInputElement;
        if (Module[cnt].CUSTOM8 == true) {
            CUSTOM8.checked = true;
        } else {
            CUSTOM8.checked = false;
 
        }
        var CUSTOM9 = document.getElementById("CUSTOM9" + cnt) as HTMLInputElement;
        if (Module[cnt].CUSTOM9 == true) {
            CUSTOM9.checked = true;
        } else {
            CUSTOM9.checked = false;
 
        }
    }

    function AddNewRow() {
        debugger
        Newcount = 0;
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
            $("#txt_StatusFlag" + CountGrid).val("i");
            $("#btn_minus" + CountGrid).removeClass("display_none");
            $("#btn_minus" + CountGrid).removeAttr("disabled");
            $("#MODULE_CODE" + i).removeAttr("disabled");
            $("#SYSTEM_CODE" + i).removeAttr("disabled");
            $("#SUB_SYSTEM_CODE" + i).removeAttr("disabled");
            $("#VIEW" + i).removeAttr("disabled");
            $("#MENU_NO" + i).removeAttr("disabled");
            $("#AVAILABLE" + i).removeAttr("disabled");
            $("#MODULE_TYPE" + i).removeAttr("disabled");
            $("#CREATE" + i).removeAttr("disabled");
            $("#EDIT" + i).removeAttr("disabled");
            $("#DELETE" + i).removeAttr("disabled");
            $("#CUSTOM1" + i).removeAttr("disabled");
            $("#CUSTOM2" + i).removeAttr("disabled");
            $("#CUSTOM3" + i).removeAttr("disabled");
            $("#CUSTOM4" + i).removeAttr("disabled");
            $("#CUSTOM5" + i).removeAttr("disabled");
            $("#CUSTOM6" + i).removeAttr("disabled");
            $("#CUSTOM7" + i).removeAttr("disabled");
            $("#CUSTOM8" + i).removeAttr("disabled");
            $("#CUSTOM9" + i).removeAttr("disabled");


            $("#CUSTOM1_DESC" + i).removeAttr("disabled");
            $("#CUSTOM2_DESC" + i).removeAttr("disabled");
            $("#CUSTOM3_DESC" + i).removeAttr("disabled");
            $("#CUSTOM4_DESC" + i).removeAttr("disabled");
            $("#CUSTOM5_DESC" + i).removeAttr("disabled");
            $("#CUSTOM6_DESC" + i).removeAttr("disabled");
            $("#CUSTOM7_DESC" + i).removeAttr("disabled");
            $("#CUSTOM8_DESC" + i).removeAttr("disabled");
            $("#CUSTOM9_DESC" + i).removeAttr("disabled");
            CountGrid++;
        }
    }

 
    function BuildControls(cnt: number) {

        var html;
        html = '<div id="No_Row' + cnt + '" class=" font_header col-lg-12" style="bottom: 5px;font-weight:bold;padding-top: 9px;">' +

            '<span id="btn_minus' + cnt + '" class="fa fa-minus-circle fontitm4user lebelminus display_none"></span>' +
            '<div class="col-lg-3" style=""> <input id="MODULE_CODE' + cnt + '" disabled name=" " type="text" class="form-control"/>  </div>' +
            '<div class="col-lg-1" style=""> <input id="SYSTEM_CODE' + cnt + '" disabled name=" " type="text" class="form-control"/>  </div>' +
            '<div class="col-lg-1" style=""> <input id="SUB_SYSTEM_CODE' + cnt + '" disabled name=" " type="text" class="form-control"/>  </div>' +
            '<div class="col-lg-1" style=""> <input id="MENU_NO' + cnt + '" disabled name=" " type="text" class="form-control"/>  </div>' +
            '<div class="col-lg-1" style=""> <input id="MODULE_TYPE' + cnt + '" disabled name=" " type="text" class="form-control"/>  </div>' +
            '<div class="col-lg-1" style=""> <input type="checkbox" class="checkbox" id="AVAILABLE' + cnt + '" disabled name="">  </div>' +
            '<div class="col-lg-1" style=""> <input type="checkbox" class="checkbox" id="VIEW' + cnt + '" disabled name="">  </div>' +
            '<div class="col-lg-1" style=""> <input type="checkbox" class="checkbox" id="PRINT' + cnt + '" disabled name="">  </div>' +
            '<div class="col-lg-1" style=""> <input type="checkbox" class="checkbox" id="CREATE' + cnt + '" disabled name="">  </div>' +
            '<div class="col-lg-1" style=""> <input type="checkbox" class="checkbox" id="EDIT' + cnt + '" disabled name="">  </div>' +
            '<div id =" " class="col-lg-12" style = "position: absolute;right: 96%;">' +

            '<div class="col-lg-1" style=""> <input type="checkbox" class="checkbox" id="DELETE' + cnt + '" disabled name="">  </div>' +
            '<div class="col-lg-1" style=""> <input type="checkbox" class="checkbox" id="CUSTOM1' + cnt + '" disabled name="">  </div>' +
            '<div class="col-lg-1 stylecollg1" style="left: 1%;"> <input id="CUSTOM1_DESC' + cnt + '" disabled name=" " type="text" class="form-control" />  </div>' +
             
            '<div class="col-lg-1" style=""> <input type="checkbox" class="checkbox" id="CUSTOM2' + cnt + '" disabled name="">  </div>' +
            '<div class="col-lg-1 stylecollg1" style=""> <input id="CUSTOM2_DESC' + cnt + '" disabled name=" " type="text" class="form-control" />  </div>' +

            '<div class="col-lg-1" style=""> <input type="checkbox" class="checkbox" id="CUSTOM3' + cnt + '" disabled name="">  </div>' +
            '<div class="col-lg-1 stylecollg1" style=""> <input id="CUSTOM3_DESC' + cnt + '" disabled name=" " type="text" class="form-control" />  </div>' +

            '<div class="col-lg-1" style=""> <input type="checkbox" class="checkbox" id="CUSTOM4' + cnt + '" disabled name="">  </div>' +
            '<div class="col-lg-1 stylecollg1" style=""> <input id="CUSTOM4_DESC' + cnt + '" disabled name=" " type="text" class="form-control" />  </div>' +

            '<div class="col-lg-1" style=""> <input type="checkbox" class="checkbox" id="CUSTOM5' + cnt + '" disabled name="">  </div>' +
            '<div class="col-lg-1 stylecollg1" style=""> <input id="CUSTOM5_DESC' + cnt + '" disabled name=" " type="text" class="form-control" />  </div>' +

            
            
            '</div>' +
            '<div id =" " class="col-lg-12" style = "position: absolute;right: 189%;">' +
            '<div class="col-lg-1" style=""> <input type="checkbox" class="checkbox" id="CUSTOM6' + cnt + '" disabled name="">  </div>' +
            '<div class="col-lg-1 stylecollg1" style=""> <input id="CUSTOM6_DESC' + cnt + '" disabled name=" " type="text" class="form-control" />  </div>' +
            '<div class="col-lg-1" style=""> <input type="checkbox" class="checkbox" id="CUSTOM7' + cnt + '" disabled name="">  </div>' +
            '<div class="col-lg-1 stylecollg1" style=""> <input id="CUSTOM7_DESC' + cnt + '" disabled name=" " type="text" class="form-control" />  </div>' +                                
            '<div class="col-lg-1" style=""> <input type="checkbox" class="checkbox" id="CUSTOM8' + cnt + '" disabled name="">  </div>' +
            '<div class="col-lg-1 stylecollg1" style=""> <input id="CUSTOM8_DESC' + cnt + '" disabled name=" " type="text" class="form-control" />  </div>' +                                
            '<div class="col-lg-1" style=""> <input type="checkbox" class="checkbox" id="CUSTOM9' + cnt + '" disabled name="">  </div>' +
            '<div class="col-lg-1 stylecollg1" style=""> <input id="CUSTOM9_DESC' + cnt + '" disabled name=" " type="text" class="form-control" />  </div>' +

            '</div>' +
            
            '<div class="col-lg-1" style=""> <input id="txt_StatusFlag' + cnt + '" name = " " type = "hidden" class="form-control"/><input id="txtRole' + cnt + '" name = " " type = "hidden" class="form-control" /><input id="BRA_CODE' + cnt + '" name = " " type = "hidden" class="form-control" /></div></div>';

        $("#DataDetails").append(html);

        debugger

        
         
        $("#btn_minus" + cnt).on('click', function () {
            DeleteRow(cnt);
        });

        $("#MODULE_CODE" + cnt).on('change', function () {
            debugger
            if (Validate_Role(cnt) == false) {
                DisplayMassage("رقم MODULES موجود من قبل ", "The Role already exists", MessageType.Worning);
                Errorinput($("#MODULE_CODE" + cnt));
                $("#MODULE_CODE" + cnt).val('null')
                return false;
            }
           // Disbly_NewBuildControls(cnt, $("#MODULE_CODE" + cnt).val())

            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });

        //$("#No_Row" + cnt).on('dblclick', function () {
        //    debugger
        //    Display3($("#MODULE_CODE" + cnt).val());
        //});

        $("#SYSTEM_CODE" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });

        $("#SUB_SYSTEM_CODE" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });

        $("#MENU_NO" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        $("#MODULE_TYPE" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });

        $("#AVAILABLE" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });

        $("#VIEW" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });

        $("#PRINT" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });

        $("#CREATE" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });

        $("#EDIT" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });


        $("#DELETE" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        $("#CUSTOM1" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        $("#CUSTOM2" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        $("#CUSTOM3" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        $("#CUSTOM4" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        $("#CUSTOM5" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        $("#CUSTOM6" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        $("#CUSTOM7" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        $("#CUSTOM8" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        $("#CUSTOM9" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        return;
    }

    function CUSTOMChange(CUSTOM: string, cnt: number) {
        debugger
        var CUSTOM1checked = $("#" + CUSTOM + "" + cnt).prop("checked");

        if (CUSTOM1checked == false) {
            $("#" + CUSTOM + "" + cnt).attr("disabled", "disabled");
            $("#" + CUSTOM + "" + cnt).prop("checked", false);
            $("#" + CUSTOM + "_DESC" + cnt).attr("disabled", "disabled");

        } else {
            $("#" + CUSTOM + "" + cnt).removeAttr("disabled");

        }
    }

    function DeleteRow(RecNo: number) {
        debugger
        $("#No_Row" + RecNo).attr("hidden", "true");

        $("#txt_StatusFlag" + RecNo).val() == 'i' ? $("#txt_StatusFlag" + RecNo).val('m') : $("#txt_StatusFlag" + RecNo).val('d');

        var StatusFlag = $("#txt_StatusFlag" + RecNo).val()

    }

    function Validation_Grid(rowcount: number) {
        if ($("#txt_StatusFlag" + rowcount).val() == "d" || $("#txt_StatusFlag" + rowcount).val() == "m") {
            Newcount++;

        }
        else {
            if ($("#MODULE_CODE" + rowcount).val() == "null") {
                DisplayMassage("اختر الصلاحية", "Choose validity", MessageType.Error);
                Errorinput($("#txtRole" + rowcount));
                return false;
            }
            if ($("#SYSTEM_CODE" + rowcount).val() == "null") {
                DisplayMassage("اختر الصلاحية", "Choose validity", MessageType.Error);
                Errorinput($("#txtRole" + rowcount));
                return false;
            }
            if ($("#SUB_SYSTEM_CODE" + rowcount).val() == "null") {
                DisplayMassage("اختر الصلاحية", "Choose validity", MessageType.Error);
                Errorinput($("#txtRole" + rowcount));
                return false;
            }
        }
        return true;
    }

    function Assign() {
        debugger

         Detail_Model = new Array<G_MODULES>(); 

      

        var StatusFlag: String;
        for (var i = 0; i < CountGrid; i++) {
            Model = new G_MODULES();
            StatusFlag = $("#txt_StatusFlag" + i).val();

            if (StatusFlag == "i") {
                debugger
                 

                Model.StatusFlag = StatusFlag.toString(); 
                Model.MODULE_CODE = $("#MODULE_CODE" + i).val();
                Model.SYSTEM_CODE = $("#SYSTEM_CODE" + i).val();
                Model.SUB_SYSTEM_CODE = $("#SUB_SYSTEM_CODE" + i).val();
                Model.MENU_NO = $("#MENU_NO" + i).val(); 
                Model.MODULE_TYPE = $("#MODULE_TYPE" + i).val();               
                Model.PRINT = $("#PRINT" + i).prop("checked");
                Model.AVAILABLE = $("#AVAILABLE" + i).prop("checked");
                Model.VIEW = $("#VIEW" + i).prop("checked");
                Model.CREATE = $("#CREATE" + i).prop("checked");
                Model.EDIT = $("#EDIT" + i).prop("checked");
                Model.DELETE = $("#DELETE" + i).prop("checked");
                 

                Model.CUSTOM1 = $("#CUSTOM1" + i).prop("checked");
                Model.CUSTOM2 = $("#CUSTOM2" + i).prop("checked");
                Model.CUSTOM3 = $("#CUSTOM3" + i).prop("checked");
                Model.CUSTOM4 = $("#CUSTOM4" + i).prop("checked");
                Model.CUSTOM5 = $("#CUSTOM5" + i).prop("checked");
                Model.CUSTOM6 = $("#CUSTOM6" + i).prop("checked");
                Model.CUSTOM7 = $("#CUSTOM7" + i).prop("checked");
                Model.CUSTOM8 = $("#CUSTOM8" + i).prop("checked");
                Model.CUSTOM9 = $("#CUSTOM9" + i).prop("checked");


                Model.CUSTOM1 = $("#CUSTOM1_DESC" + i).prop("checked");
                Model.CUSTOM2 = $("#CUSTOM2_DESC" + i).prop("checked");
                Model.CUSTOM3 = $("#CUSTOM3_DESC" + i).prop("checked");
                Model.CUSTOM4 = $("#CUSTOM4_DESC" + i).prop("checked");
                Model.CUSTOM5 = $("#CUSTOM5_DESC" + i).prop("checked");
                Model.CUSTOM6 = $("#CUSTOM6_DESC" + i).prop("checked");
                Model.CUSTOM7 = $("#CUSTOM7_DESC" + i).prop("checked");
                Model.CUSTOM8 = $("#CUSTOM8_DESC" + i).prop("checked");
                Model.CUSTOM9 = $("#CUSTOM9_DESC" + i).prop("checked");


                Detail_Model.push(Model);
            }
            if (StatusFlag == "u") {
                Model.StatusFlag = StatusFlag.toString();
                Model.MENU_NO = $("#MENU_NO" + i).val();
                Model.MODULE_TYPE = $("#MODULE_TYPE" + i).val();
                Model.PRINT = $("#PRINT" + i).prop("checked");
                Model.AVAILABLE = $("#AVAILABLE" + i).prop("checked");

                Model.MODULE_CODE = $("#MODULE_CODE" + i).val();
                Model.SYSTEM_CODE = $("#SYSTEM_CODE" + i).val();
                Model.SUB_SYSTEM_CODE = $("#SUB_SYSTEM_CODE" + i).val();

                Model.VIEW = $("#VIEW" + i).prop("checked"); 
                Model.CREATE = $("#CREATE" + i).prop("checked");
                Model.EDIT = $("#EDIT" + i).prop("checked");
                Model.DELETE = $("#DELETE" + i).prop("checked");
                Model.CUSTOM1 = $("#CUSTOM1" + i).prop("checked");
                Model.CUSTOM2 = $("#CUSTOM2" + i).prop("checked");
                Model.CUSTOM3 = $("#CUSTOM3" + i).prop("checked");
                Model.CUSTOM4 = $("#CUSTOM4" + i).prop("checked");
                Model.CUSTOM5 = $("#CUSTOM5" + i).prop("checked");
                Model.CUSTOM6 = $("#CUSTOM6" + i).prop("checked");
                Model.CUSTOM7 = $("#CUSTOM7" + i).prop("checked");
                Model.CUSTOM8 = $("#CUSTOM8" + i).prop("checked");
                Model.CUSTOM9 = $("#CUSTOM9" + i).prop("checked");


                Model.CUSTOM1 = $("#CUSTOM1_DESC" + i).prop("checked");
                Model.CUSTOM2 = $("#CUSTOM2_DESC" + i).prop("checked");
                Model.CUSTOM3 = $("#CUSTOM3_DESC" + i).prop("checked");
                Model.CUSTOM4 = $("#CUSTOM4_DESC" + i).prop("checked");
                Model.CUSTOM5 = $("#CUSTOM5_DESC" + i).prop("checked");
                Model.CUSTOM6 = $("#CUSTOM6_DESC" + i).prop("checked");
                Model.CUSTOM7 = $("#CUSTOM7_DESC" + i).prop("checked");
                Model.CUSTOM8 = $("#CUSTOM8_DESC" + i).prop("checked");
                Model.CUSTOM9 = $("#CUSTOM9_DESC" + i).prop("checked");

                Detail_Model.push(Model);

            }
            if (StatusFlag == "d") {
                debugger

                Model.StatusFlag = StatusFlag.toString();
                Model.MODULE_CODE = $("#MODULE_CODE" + i).val();
                Detail_Model.push(Model);


            }
        }
         

    }

 
    function success_Insert(id: number) {
        debugger
         
        $("#GridDetails").removeAttr("disabled").off('click');
        $("#GridDetails").removeClass("disabledDiv");
        $("#div_BasicData :input").attr("disabled", "disabled");
        $("#btnEdit").removeClass("display_none");
        $("#btnSave").addClass("display_none");
        $("#btnBack").addClass("display_none");
      
        Display();
    }

    function Update() {
        debugger
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("G_Branch", "updateG_ModuleMasteh"),
            data: JSON.stringify(Detail_Model),
            success: (d) => {
                debugger

                let result = d as BaseResponse;
                if (result.IsSuccess == true) {
                    RoleId_ = result.Response as G_Role;
                    DisplayMassage("تم الحفظ بنجاح", "Success", MessageType.Succeed);
                    success_Insert(Number(RoleId_));
                }
                else {
                    MessageBox.Show(result.ErrorMessage, "خطأ");
                }
            }
        });
    }

    function GetData_Header_loader() {
        var Table: Array<Table>;
        Table =
            [

                { NameTable: 'G_MODULES', Condition: "" }, 
                { NameTable: 'G_RoleUsers', Condition: "" }

            ]
        DataResult(Table);
        GMODULES = GetDataTable('G_MODULES') as Array<G_MODULES>;
 
    }

    function Validate_Role(rowno: number) {
        debugger
        var res: boolean = true;

        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("G_Branch", "chackModule"),
            data: {
                MODULE_CODE: $("#MODULE_CODE" + rowno).val()
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


        for (var i = 0; i < CountGrid; i++) {

            $("#btn_minus" + i).addClass("display_none");
            $("#MODULE_CODE" + i).attr("disabled", "disabled");
            $("#SYSTEM_CODE" + i).attr("disabled", "disabled");
            $("#SUB_SYSTEM_CODE" + i).attr("disabled", "disabled");
            $("#MENU_NO" + i).attr("disabled");
            $("#AVAILABLE" + i).attr("disabled");
            $("#MODULE_TYPE" + i).attr("disabled");
            $("#VIEW" + i).attr("disabled", "disabled");
            $("#CREATE" + i).attr("disabled", "disabled");
            $("#EDIT" + i).attr("disabled", "disabled");
            $("#DELETE" + i).attr("disabled", "disabled");

            $("#CUSTOM1" + i).attr("disabled", "disabled");
            $("#CUSTOM2" + i).attr("disabled", "disabled");
            $("#CUSTOM3" + i).attr("disabled");
            $("#CUSTOM4" + i).attr("disabled");
            $("#CUSTOM5" + i).attr("disabled");
            $("#CUSTOM6" + i).attr("disabled");
            $("#CUSTOM7" + i).attr("disabled");
            $("#CUSTOM8" + i).attr("disabled");
            $("#CUSTOM9" + i).attr("disabled");

            $("#CUSTOM1_DESC" + i).attr("disabled");
            $("#CUSTOM2_DESC" + i).attr("disabled");
            $("#CUSTOM3_DESC" + i).attr("disabled");
            $("#CUSTOM4_DESC" + i).attr("disabled");
            $("#CUSTOM5_DESC" + i).attr("disabled");
            $("#CUSTOM6_DESC" + i).attr("disabled");
            $("#CUSTOM7_DESC" + i).attr("disabled");
            $("#CUSTOM8_DESC" + i).attr("disabled");
            $("#CUSTOM9_DESC" + i).attr("disabled");
        }

    }

    function Enabel() {
        debugger
        for (var i = 0; i < CountGrid; i++) {
            if (IsNew == true) {
                $("#MODULE_CODE" + i).removeAttr("disabled");

            }
 
            $("#btn_minus" + i).removeClass("display_none");
            //$("#MODULE_CODE" + i).removeAttr("disabled");
            $("#SYSTEM_CODE" + i).removeAttr("disabled");
            $("#SUB_SYSTEM_CODE" + i).removeAttr("disabled");
            $("#MENU_NO" + i).removeAttr("disabled");
            $("#AVAILABLE" + i).removeAttr("disabled");
            $("#MODULE_TYPE" + i).removeAttr("disabled");
            $("#VIEW" + i).removeAttr("disabled");
            $("#PRINT" + i).removeAttr("disabled");
            $("#CREATE" + i).removeAttr("disabled");
            $("#EDIT" + i).removeAttr("disabled");
            $("#DELETE" + i).removeAttr("disabled");

            $("#CUSTOM1" + i).removeAttr("disabled");
            $("#CUSTOM2" + i).removeAttr("disabled");
            $("#CUSTOM3" + i).removeAttr("disabled");
            $("#CUSTOM4" + i).removeAttr("disabled");
            $("#CUSTOM5" + i).removeAttr("disabled");
            $("#CUSTOM6" + i).removeAttr("disabled");
            $("#CUSTOM7" + i).removeAttr("disabled");
            $("#CUSTOM8" + i).removeAttr("disabled");
            $("#CUSTOM9" + i).removeAttr("disabled");

            $("#CUSTOM3_DESC" + i).removeAttr("disabled");
            $("#CUSTOM4_DESC" + i).removeAttr("disabled");
            $("#CUSTOM5_DESC" + i).removeAttr("disabled");
            $("#CUSTOM6_DESC" + i).removeAttr("disabled");
            $("#CUSTOM7_DESC" + i).removeAttr("disabled");
            $("#CUSTOM8_DESC" + i).removeAttr("disabled");
            $("#CUSTOM9_DESC" + i).removeAttr("disabled");

        }

    }

    function Display3(UserCode: string) {


        GRoleUsers = GetDataTable('G_RoleUsers') as Array<G_RoleUsers>;
        debugger
        RoleUsers = GRoleUsers.filter(x => x.UserCode == UserCode);
        $("#DataDetails3").html('');
        CountGrid3 = 0;
        for (var i = 0; i < RoleUsers.length; i++) {
            BuildControls3(i);
            Disbly_BuildControls3(i, RoleUsers);
            CountGrid3 += 1;
        }

        $("#data_lebel3").removeClass("display_none");

    }

    function AddNewRow3() {
        debugger
        Newcount3 = 0;
        var CanAdd: boolean = true;
        if (CountGrid3 > 0) {
            for (var i = 0; i < CountGrid3; i++) {

                CanAdd = Validation_Grid3(i);
                if (CanAdd == false) {
                    break;
                }
            }
        }
        if (CanAdd) {
            BuildControls3(CountGrid3);
            $("#txt_StatusFlag3" + CountGrid).val("i");
            $("#btn_minus3" + CountGrid).removeClass("display_none");
            $("#btn_minus3" + CountGrid).removeAttr("disabled");
            $("#MODULE_CODESearchForm" + i).removeAttr("disabled");
            $("#ControlCode" + i).removeAttr("disabled");
            $("#SearchFormCode" + i).removeAttr("disabled");


            CountGrid3++;
        }
    }

    function BuildControls3(cnt: number) {

        var html;
        html = '<div id="No_Row3' + cnt + '" class=" font_header col-lg-12" style="bottom: 5px;font-weight:bold;padding-top: 9px;">' +

            '<span id="btn_minus3' + cnt + '" class="fa fa-minus-circle fontitm4user lebelminus display_none"></span>' +
            '<div class="col-lg-2" style="width: 22%;"> <select disabled id="ModuleCodeSearchForm' + cnt + '" class="form-control"><option value="null">  MODULE_CODE اختر   </option> </select>  </div>' +
            '<div class="col-lg-2" style=""> <input id="ControlCode' + cnt + '" disabled name=" " type="text" class="form-control"/>  </div>' +
            '<div class="col-lg-2" style=""> <input id="SearchFormCode' + cnt + '" disabled name=" " type="text" class="form-control"/>  </div>' +

            '<div class="col-lg-1" style=""><input id="txt_StatusFlag3' + cnt + '" name = " " type = "hidden" class="form-control"/> </div></div>';

        $("#DataDetails3").append(html);

        for (var i = 0; i < RoleUsers.length; i++) {
            $('#ModuleCodeSearchForm' + cnt).append('<option value="' + RoleUsers[i].USER_CODE + '">' + (lang == "ar" ? RoleUsers[i].USER_CODE : RoleUsers[i].USER_CODE) + '</option>');
        }

        $("#btn_minus3" + cnt).on('click', function () {
            DeleteRow3(cnt);
        });

        $("#ControlCode" + cnt).on('change', function () {

            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        $("#SearchFormCode" + cnt).on('change', function () {
            if ($("#txt_StatusFlag3" + cnt).val() != "i")
                $("#txt_StatusFlag3" + cnt).val("u");
        });

        $("#ModuleCodeSearchForm" + cnt).on('change', function () {
            //debugger
            //if (Validate_Role(cnt) == false) {
            //    DisplayMassage("رقم الصلاحية موجود من قبل ", "The Role already exists", MessageType.Worning);
            //    Errorinput($("#MODULE_CODE" + cnt));
            //    $("#MODULE_CODE" + cnt).val('null')
            //    return false;
            //}
            if ($("#txt_StatusFlag3" + cnt).val() != "i")
                $("#txt_StatusFlag3" + cnt).val("u");
        });




        return;
    }

    function DeleteRow3(RecNo: number) {
        debugger
        $("#No_Row3" + RecNo).attr("hidden", "true");

        $("#txt_StatusFlag3" + RecNo).val() == 'i' ? $("#txt_StatusFlag3" + RecNo).val('m') : $("#txt_StatusFlag3" + RecNo).val('d');

        var StatusFlag = $("#txt_StatusFlag3" + RecNo).val()

    }

    function Validation_Grid3(rowcount: number) {
        if ($("#txt_StatusFlag3" + rowcount).val() == "d" || $("#txt_StatusFlag3" + rowcount).val() == "m") {
            Newcount++;

        }
        else {
            if ($("#ModuleCodeSearchForm" + rowcount).val() == "null") {
                DisplayMassage("اختر الصلاحية", "Choose validity", MessageType.Error);
                Errorinput($("#MODULE_CODESearchForm" + rowcount));
                return false;
            }
            if ($("#ControlCode" + rowcount).val() == "null") {
                DisplayMassage("اختر الصلاحية", "Choose validity", MessageType.Error);
                Errorinput($("#ControlCode" + rowcount));
                return false;
            }
            if ($("#SearchFormCode" + rowcount).val() == "null") {
                DisplayMassage("اختر الصلاحية", "Choose validity", MessageType.Error);
                Errorinput($("#SearchFormCode" + rowcount));
                return false;
            }
        }
        return true;
    }

    function Disbly_BuildControls3(cnt: number, RoleUsers: Array<G_RoleUsers>) {
        debugger
        $("#btnAddDetails3").addClass("display_none");
        $("#btn_minus3" + cnt).addClass("display_none");
        $("#txt_StatusFlag3" + cnt).val("");
        $("#ModuleCodeSearchForm" + cnt).val(RoleUsers[cnt].USER_CODE);
        $("#ControlCode" + cnt).val(RoleUsers[cnt].Comp_Code);
        $("#SearchFormCode" + cnt).val(RoleUsers[cnt].Branch_Code);

    }

}