$(document).ready(() => {
    Role.InitalizeComponent();
})
namespace Role {
    var sys: SystemTools = new SystemTools();
    var SysSession: SystemSession = GetSystemSession(Modules.AdminRoleBranch);
    var ModelGRole: G_Role = new G_Role();
    var masterDetail: G_RoleModuleMaste = new G_RoleModuleMaste();
    var Model: G_RoleModule = new G_RoleModule();
    var Detail_Model = new Array<G_RoleModule>();
    var GetRoleBranch = new Array<G_RoleModule>();
    var GRole = new Array<G_Role>();
    var GModule = new Array<G_MODULES>();
    var GRoleUsers = new Array<G_RoleUsers>();
    var RoleUsers = new Array<G_RoleUsers>();
    var GRoleModule = new Array<G_RoleModule>();
    var GQGetRoleModule = new Array<GQ_GetRoleModule>();
    var GetRoleModule = new Array<GQ_GetRoleModule>();
    var RoleModule = new Array<G_RoleModule>();
    var SelecteData = new Array<G_Role>();
    var GBRANCH = new Array<G_BRANCH>();
    var Grid: JsGrid = new JsGrid();
    var btnAdd: HTMLButtonElement;
    var btnSave: HTMLButtonElement;
    var btnBack: HTMLButtonElement;
    var btnEdit: HTMLButtonElement;
    var IsNew = true;
    var txtRoleId: HTMLInputElement;
    var txtComp: HTMLInputElement; 
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
        GRole = GetDataTable('G_Role') as Array<G_Role>;
        BindGrid();
        InitializeGrid();
        // GetComp();
    }

    function InitalizeControls() {
        btnAdd = document.getElementById("btnAdd") as HTMLButtonElement;
        btnSave = document.getElementById("btnSave") as HTMLButtonElement;
        btnBack = document.getElementById("btnBack") as HTMLButtonElement;
        btnEdit = document.getElementById("btnEdit") as HTMLButtonElement;
        btnAddDetails = document.getElementById("btnAddDetails") as HTMLInputElement;
        txtRoleId = document.getElementById("txtRoleId") as HTMLInputElement;
    }

    function InitializeEvents() {

        btnAddDetails.onclick = AddNewRow;
        btnAdd.onclick = btnAdd_onclick;
        btnSave.onclick = btnSave_onclick;
        btnBack.onclick = btnBack_onclick;
        btnEdit.onclick = btnEdit_onclick;
    }

    function BindGrid() {
        debugger
        Grid.DataSource = GRole;
        Grid.Bind();


    }

    function InitializeGrid() {

        debugger
        let res: any = GetResourceList("");
        Grid.ElementName = "divGridDetails";
        Grid.Paging = true;
        Grid.PageSize = 10;
        Grid.Sorting = true;
        Grid.Editing = false;
        Grid.Inserting = false;
        Grid.SelectedIndex = 1;
        Grid.OnRowDoubleClicked = Grid_RowDoubleClicked;
        Grid.OnItemEditing = () => { };
        Grid.PrimaryKey = "RoleId";
        Grid.Columns = [
            { title: res.App_Number, name: "RoleId", type: "text", width: "0%", visible: false },
            { title: " DescA  ", name: "DescA", type: "text", width: "15%" },
            { title: "DescE", name: "DescE", type: "text", width: "15%" },
            { title: "IsAvailable", name: "IsAvailable", type: "text", width: "5%" },
            { title: "IsShowable", name: "IsShowable", type: "text", width: "5%" },
            { title: "RoleType", name: "RoleType", type: "text", width: "5%" },

        ];
        BindGrid();
        //InitializeStoreGrid();
    }

    function Grid_RowDoubleClicked() {
        debugger


        $("#div_BasicData :input").attr("disabled", "disabled");




        $("#btnEdit").addClass("display_none");
        $("#btnEdit").removeClass("display_none");
        $("#btnSave").addClass("display_none");
        $("#btnBack").addClass("display_none");
        SelecteData = GRole.filter(x => x.RoleId == Number(Grid.SelectedKey));
        DocumentActions.RenderFromModel(SelecteData[0]);
        $("#data_lebel").removeClass("display_none");
        $("#data_lebel2").removeClass("display_none");
        if (SelecteData[0].IsAvailable == false) {
            $("#txtIsAvailable").val("0");
        } else {
            $("#txtIsAvailable").val("1");
        }
        if (SelecteData[0].IsShowable == false) {
            $("#txtIsShowable").val("0");
        } else {
            $("#txtIsShowable").val("1");
        }
        Display();

        Display3(txtRoleId.value);


    }

    function btnAdd_onclick() {
        IsNew = true;
        EnableControls()
        $("#id_div_Add").attr("disabled", "disabled").off('click');
        $("#GridDetails").addClass("disabledDiv");
        $("#DataDetails").html('');
        CountGrid = 0;
        $('#btnAddDetails').removeClass("display_none");
        $('#data_lebel').removeClass("display_none");
        $('#data_lebel2').removeClass("display_none");
        $('#div_BasicData').removeClass("display_none");
        $("#div_BasicData :input").val("");
        $("#div_BasicData :input").removeAttr("disabled");
        $("#DataDetails :input").removeAttr("disabled");
        AddNewRow()
        Enabel()
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
        $("#txtRoleId").attr("disabled", "disabled");

        Enabel()
        for (var i = 0; i < CountGrid; i++) {

            CUSTOMChange("DELETE", i);
            CUSTOMChange("EXECUTE", i);
            CUSTOMChange("VIEW", i);
            CUSTOMChange("CREATE", i);
            CUSTOMChange("EDIT", i);
            CUSTOMChange("CUSTOM1", i);
            CUSTOMChange("CUSTOM2", i);
            CUSTOMChange("CUSTOM3", i);
            CUSTOMChange("CUSTOM4", i);
            CUSTOMChange("CUSTOM5", i);
            CUSTOMChange("CUSTOM6", i);
            CUSTOMChange("CUSTOM7", i);
        }
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

                if (IsNew == true) {
                    Assign();
                    Insert();

                }
                else {
                    Assign();
                    Update();

                }
            }
        }, 100);

    }

    function btnBack_onclick() {
        debugger
        if (IsNew == true) {

            $("#btnEdit").addClass("display_none");
            $("#btnSave").addClass("display_none");
            $("#btnBack").addClass("display_none");
            $("#data_lebel").addClass("display_none");
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


        GQGetRoleModule = GetDataTable('GQ_GetRoleModule') as Array<GQ_GetRoleModule>;
        debugger
        GetRoleModule = GQGetRoleModule.filter(x => x.RoleId == SelecteData[0].RoleId).sort(dynamicSort("MENU_NO"));
        $("#DataDetails").html('');
        CountGrid = 0;
        for (var i = 0; i < GetRoleModule.length; i++) {
            BuildControls(i);
            Disbly_BuildControls(i, GetRoleModule);
            CountGrid += 1;
        }
    }

    function Disbly_BuildControls(cnt: number, GetRoleModule: Array<GQ_GetRoleModule>) {
        debugger
        $("#btnAddDetails").addClass("display_none");
        $("#btn_minus3" + cnt).addClass("display_none");
        $("#txt_StatusFlag" + cnt).val("");
        $("#MODULE_CODE" + cnt).val(GetRoleModule[cnt].MODULE_CODE);
        $("#txtRole" + cnt).val(GetRoleModule[cnt].RoleId);
        $("#SYSTEM_CODE" + cnt).val(GetRoleModule[cnt].SYSTEM_CODE);
        $("#SUB_SYSTEM_CODE" + cnt).val(GetRoleModule[cnt].SUB_SYSTEM_CODE);
        $("#CUSTOM1_DESC" + cnt).val(GetRoleModule[cnt].CUSTOM1_DESC);
        $("#CUSTOM2_DESC" + cnt).val(GetRoleModule[cnt].CUSTOM2_DESC);
        $("#CUSTOM3_DESC" + cnt).val(GetRoleModule[cnt].CUSTOM3_DESC);
        $("#CUSTOM4_DESC" + cnt).val(GetRoleModule[cnt].CUSTOM4_DESC);
        $("#CUSTOM5_DESC" + cnt).val(GetRoleModule[cnt].CUSTOM5_DESC);
        $("#CUSTOM6_DESC" + cnt).val(GetRoleModule[cnt].CUSTOM6_DESC);
        $("#CUSTOM7_DESC" + cnt).val(GetRoleModule[cnt].CUSTOM7_DESC);

        var EXECUTE = document.getElementById("EXECUTE" + cnt) as HTMLInputElement;
        if (GetRoleModule[cnt].EXECUTE == true) {
            EXECUTE.checked = true;
        } else {
            EXECUTE.checked = false;
            EXECUTE.disabled = true;
        }
        var VIEW = document.getElementById("VIEW" + cnt) as HTMLInputElement;
        if (GetRoleModule[cnt].md_view == true) {
            VIEW.checked = true;
        } else {
            VIEW.checked = false;
            VIEW.disabled = true;
        }
        var CREATE = document.getElementById("CREATE" + cnt) as HTMLInputElement;
        if (GetRoleModule[cnt].md_Create == true) {
            CREATE.checked = true;
        } else {
            CREATE.checked = false;
            CREATE.disabled = true;
        }

        var EDIT = document.getElementById("EDIT" + cnt) as HTMLInputElement;
        if (GetRoleModule[cnt].md_edit == true) {
            EDIT.checked = true;
        } else {
            EDIT.checked = false;
            EDIT.disabled = true;
        }

        var DELETE = document.getElementById("DELETE" + cnt) as HTMLInputElement;
        if (GetRoleModule[cnt].md_delete == true) {
            DELETE.checked = true;
        } else {
            DELETE.checked = false;
            DELETE.disabled = true;
        }

        var CUSTOM1 = document.getElementById("CUSTOM1" + cnt) as HTMLInputElement;
        if (GetRoleModule[cnt].md_custom1 == true) {
            CUSTOM1.checked = true;
        } else {
            CUSTOM1.checked = false;
            CUSTOM1.disabled = true;
        }
        var CUSTOM2 = document.getElementById("CUSTOM2" + cnt) as HTMLInputElement;
        if (GetRoleModule[cnt].md_custom2 == true) {
            CUSTOM2.checked = true;
        } else {
            CUSTOM2.checked = false;
            CUSTOM2.disabled = true;
        }

        var CUSTOM3 = document.getElementById("CUSTOM3" + cnt) as HTMLInputElement;
        if (GetRoleModule[cnt].md_custom3 == true) {
            CUSTOM3.checked = true;
        } else {
            CUSTOM2.checked = false;
            CUSTOM2.disabled = true;
        }

        var CUSTOM4 = document.getElementById("CUSTOM4" + cnt) as HTMLInputElement;
        if (GetRoleModule[cnt].md_custom4 == true) {
            CUSTOM4.checked = true;
        } else {
            CUSTOM4.checked = false;
            CUSTOM4.disabled = true;
        }

        var CUSTOM5 = document.getElementById("CUSTOM5" + cnt) as HTMLInputElement;
        if (GetRoleModule[cnt].md_custom5 == true) {
            CUSTOM5.checked = true;
        } else {
            CUSTOM5.checked = false;
        }
        var CUSTOM6 = document.getElementById("CUSTOM6" + cnt) as HTMLInputElement;
        if (GetRoleModule[cnt].md_custom6 == true) {
            CUSTOM6.checked = true;
        } else {
            CUSTOM6.checked = false;
            CUSTOM6.disabled = true;
        }

        var CUSTOM7 = document.getElementById("CUSTOM7" + cnt) as HTMLInputElement;
        if (GetRoleModule[cnt].md_custom7 == true) {
            CUSTOM7.checked = true;
        } else {
            CUSTOM7.checked = false;
            CUSTOM7.disabled = true;
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
            $("#EXECUTE" + i).removeAttr("disabled");
            $("#CREATE" + i).removeAttr("disabled");
            $("#EDIT" + i).removeAttr("disabled");
            $("#DELETE" + i).removeAttr("disabled");
            $("#CUSTOM1" + i).removeAttr("disabled");
            $("#CUSTOM2" + i).removeAttr("disabled");

            CountGrid++;
        }
    }

    function Disbly_NewBuildControls(cnt: number, Module: string) {
        debugger



        var newGModule = GModule.filter(x => x.MODULE_CODE == Module).sort(dynamicSort("MENU_NO"));;

        $("#btnAddDetails").addClass("display_none");
        $("#btn_minus3" + cnt).addClass("display_none");
        $("#txt_StatusFlag" + cnt).val("");
        $("#MODULE_CODE" + cnt).val(newGModule[0].MODULE_CODE);
        $("#SYSTEM_CODE" + cnt).val(newGModule[0].SYSTEM_CODE);
        $("#SUB_SYSTEM_CODE" + cnt).val(newGModule[0].SUB_SYSTEM_CODE);

        $("#CUSTOM1_DESC" + cnt).val(lang == "ar" ? newGModule[0].CUSTOM1_DESC : newGModule[0].CUSTOM1_DESC);
        $("#CUSTOM2_DESC" + cnt).val(lang == "ar" ? newGModule[0].CUSTOM2_DESC : newGModule[0].CUSTOM2_DESC);
        $("#CUSTOM3_DESC" + cnt).val(lang == "ar" ? newGModule[0].CUSTOM3_DESC : newGModule[0].CUSTOM3_DESC);
        $("#CUSTOM4_DESC" + cnt).val(lang == "ar" ? newGModule[0].CUSTOM4_DESC : newGModule[0].CUSTOM4_DESC);
        $("#CUSTOM5_DESC" + cnt).val(lang == "ar" ? newGModule[0].CUSTOM5_DESC : newGModule[0].CUSTOM5_DESC);
        $("#CUSTOM6_DESC" + cnt).val(lang == "ar" ? newGModule[0].CUSTOM6_DESC : newGModule[0].CUSTOM6_DESC);
        $("#CUSTOM7_DESC" + cnt).val(lang == "ar" ? newGModule[0].CUSTOM7_DESC : newGModule[0].CUSTOM7_DESC);

        var EXECUTE = document.getElementById("EXECUTE" + cnt) as HTMLInputElement;
        EXECUTE.checked = true;

        var VIEW = document.getElementById("VIEW" + cnt) as HTMLInputElement;
        if (newGModule[0].VIEW == true) {
            VIEW.checked = true;
        } else {
            VIEW.checked = false;
            VIEW.disabled = true
        }
        var CREATE = document.getElementById("CREATE" + cnt) as HTMLInputElement;
        if (newGModule[0].CREATE == true) {
            CREATE.checked = true;
        } else {
            CREATE.checked = false;
            VIEW.disabled = true

        }

        var EDIT = document.getElementById("EDIT" + cnt) as HTMLInputElement;
        if (newGModule[0].EDIT == true) {
            EDIT.checked = true;
        } else {
            EDIT.checked = false;
            VIEW.disabled = true

        }

        var DELETE = document.getElementById("DELETE" + cnt) as HTMLInputElement;
        if (newGModule[0].DELETE == true) {
            DELETE.checked = true;
        } else {
            DELETE.checked = false;
            VIEW.disabled = true

        }

        var CUSTOM1 = document.getElementById("CUSTOM1" + cnt) as HTMLInputElement;
        if (newGModule[0].CUSTOM1 == true) {
            CUSTOM1.checked = true;
        } else {
            CUSTOM1.checked = false;
            VIEW.disabled = true

        }

        var CUSTOM2 = document.getElementById("CUSTOM2" + cnt) as HTMLInputElement;
        if (newGModule[0].CUSTOM2 == true) {
            CUSTOM2.checked = true;
        } else {
            CUSTOM2.checked = false;
            VIEW.disabled = true

        }

        var CUSTOM3 = document.getElementById("CUSTOM3" + cnt) as HTMLInputElement;
        if (newGModule[0].CUSTOM3 == true) {
            CUSTOM3.checked = true;
        } else {
            CUSTOM3.checked = false;
            CUSTOM3.disabled = true

        }

        var CUSTOM4 = document.getElementById("CUSTOM4" + cnt) as HTMLInputElement;
        if (newGModule[0].CUSTOM4 == true) {
            CUSTOM4.checked = true;
        } else {
            CUSTOM4.checked = false;
            CUSTOM4.disabled = true

        }

        var CUSTOM5 = document.getElementById("CUSTOM5" + cnt) as HTMLInputElement;
        if (newGModule[0].CUSTOM5 == true) {
            CUSTOM5.checked = true;
        } else {
            CUSTOM5.checked = false;
            CUSTOM5.disabled = true

        }

        var CUSTOM6 = document.getElementById("CUSTOM6" + cnt) as HTMLInputElement;
        if (newGModule[0].CUSTOM2 == true) {
            CUSTOM6.checked = true;
        } else {
            CUSTOM6.checked = false;
            CUSTOM6.disabled = true

        }

        var CUSTOM7 = document.getElementById("CUSTOM7" + cnt) as HTMLInputElement;
        if (newGModule[0].CUSTOM7 == true) {
            CUSTOM7.checked = true;
        } else {
            CUSTOM7.checked = false;
            CUSTOM7.disabled = true

        }

    }

    function BuildControls(cnt: number) {

        var html;
        html = '<div id="No_Row' + cnt + '" class=" font_header col-lg-12" style="bottom: 5px;font-weight:bold;padding-top: 9px;">' +

            '<span id="btn_minus' + cnt + '" class="fa fa-minus-circle fontitm4user lebelminus display_none"></span>' +
            '<div class="col-lg-2" style="width: 22%;"> <select disabled id="MODULE_CODE' + cnt + '" class="form-control"><option value="null">  MODULE_CODE اختر   </option> </select>  </div>' +
            '<div class="col-lg-1" style=""> <input id="SYSTEM_CODE' + cnt + '" disabled name=" " type="text" class="form-control"/>  </div>' +
            '<div class="col-lg-1" style=""> <input id="SUB_SYSTEM_CODE' + cnt + '" disabled name=" " type="text" class="form-control"/>  </div>' +
            '<div class="col-lg-1" style=""> <input type="checkbox" class="checkbox" id="VIEW' + cnt + '" disabled name="">  </div>' +
            '<div class="col-lg-1" style=""> <input type="checkbox" class="checkbox" id="EXECUTE' + cnt + '" disabled name="">  </div>' +
            '<div class="col-lg-1" style=""> <input type="checkbox" class="checkbox" id="CREATE' + cnt + '" disabled name="">  </div>' +
            '<div class="col-lg-1" style=""> <input type="checkbox" class="checkbox" id="EDIT' + cnt + '" disabled name="">  </div>' +
            '<div class="col-lg-1" style=""> <input type="checkbox" class="checkbox" id="DELETE' + cnt + '" disabled name="">  </div>' +
            '<div class="col-lg-1" style=""> <input type="checkbox" class="checkbox" id="CUSTOM1' + cnt + '" disabled name="">  </div>' +
            '<div class="col-lg-1 stylecollg1" style="left: 1%;"> <input id="CUSTOM1_DESC' + cnt + '" disabled name=" " type="text" class="form-control" />  </div>' +
            '<div id =" " class="col-lg-12" style = "position: absolute;right: 94%;">' +
            '<div class="col-lg-1" style=""> <input type="checkbox" class="checkbox" id="CUSTOM2' + cnt + '" disabled name="">  </div>' +
            '<div class="col-lg-1 stylecollg1" style=""> <input id="CUSTOM2_DESC' + cnt + '" disabled name=" " type="text" class="form-control" />  </div>' +

            '<div class="col-lg-1" style=""> <input type="checkbox" class="checkbox" id="CUSTOM3' + cnt + '" disabled name="">  </div>' +
            '<div class="col-lg-1 stylecollg1" style=""> <input id="CUSTOM3_DESC' + cnt + '" disabled name=" " type="text" class="form-control" />  </div>' +

            '<div class="col-lg-1" style=""> <input type="checkbox" class="checkbox" id="CUSTOM4' + cnt + '" disabled name="">  </div>' +
            '<div class="col-lg-1 stylecollg1" style=""> <input id="CUSTOM4_DESC' + cnt + '" disabled name=" " type="text" class="form-control" />  </div>' +

            '<div class="col-lg-1" style=""> <input type="checkbox" class="checkbox" id="CUSTOM5' + cnt + '" disabled name="">  </div>' +
            '<div class="col-lg-1 stylecollg1" style=""> <input id="CUSTOM5_DESC' + cnt + '" disabled name=" " type="text" class="form-control" />  </div>' +

            '<div class="col-lg-1" style=""> <input type="checkbox" class="checkbox" id="CUSTOM6' + cnt + '" disabled name="">  </div>' +
            '<div class="col-lg-1 stylecollg1" style=""> <input id="CUSTOM6_DESC' + cnt + '" disabled name=" " type="text" class="form-control" />  </div>' +

            '<div class="col-lg-1" style=""> <input type="checkbox" class="checkbox" id="CUSTOM7' + cnt + '" disabled name="">  </div>' +
            '<div class="col-lg-1 stylecollg1" style=""> <input id="CUSTOM7_DESC' + cnt + '" disabled name=" " type="text" class="form-control" />  </div>' +

            '</div>' +
            '<div class="col-lg-1" style=""><input id="UserCode' + cnt + '" name = " " type = "hidden" class="form-control"/><input id="txt_StatusFlag' + cnt + '" name = " " type = "hidden" class="form-control"/><input id="txtRole' + cnt + '" name = " " type = "hidden" class="form-control" /><input id="BRA_CODE' + cnt + '" name = " " type = "hidden" class="form-control" /></div></div>';

        $("#DataDetails").append(html);

        debugger

        for (var i = 0; i < GRole.length; i++) {
            $('#txtRole' + cnt).append('<option value="' + GRole[i].RoleId + '">' + (lang == "ar" ? GRole[i].DescA : GRole[i].DescE) + '</option>');
        }
        for (var i = 0; i < GModule.length; i++) {
            $('#MODULE_CODE' + cnt).append('<option value="' + GModule[i].MODULE_CODE + '">' + (lang == "ar" ? GModule[i].MODULE_DESCA : GModule[i].MODULE_DESCE) + '</option>');
        }
        $("#btn_minus" + cnt).on('click', function () {
            DeleteRow(cnt);
        });

        $("#MODULE_CODE" + cnt).on('change', function () {
            debugger
            if (Validate_Role(cnt) == false) {
                DisplayMassage("رقم الصلاحية موجود من قبل ", "The Role already exists", MessageType.Worning);
                Errorinput($("#MODULE_CODE" + cnt));
                $("#MODULE_CODE" + cnt).val('null')
                return false;
            }
            Disbly_NewBuildControls(cnt, $("#MODULE_CODE" + cnt).val())

            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });

        

        $("#SYSTEM_CODE" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });

        $("#SUB_SYSTEM_CODE" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });

        $("#VIEW" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });

        $("#EXECUTE" + cnt).on('change', function () {
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

        masterDetail = new G_RoleModuleMaste();
        Detail_Model = new Array<G_RoleModule>();
        ModelGRole = DocumentActions.AssignToModel<G_Role>(ModelGRole);

        debugger

        ModelGRole.IsAvailable = $("#txtIsAvailable").prop("checked");
        ModelGRole.IsShowable = $("#txtIsShowable").prop("checked");


        var StatusFlag: String;
        for (var i = 0; i < CountGrid; i++) {
            Model = new G_RoleModule();
            StatusFlag = $("#txt_StatusFlag" + i).val();

            if (StatusFlag == "i") {
                debugger

                Model.StatusFlag = StatusFlag.toString();
                Model.RoleId = Number(txtRoleId.value);
                Model.MODULE_CODE = $("#MODULE_CODE" + i).val();
                Model.SYSTEM_CODE = $("#SYSTEM_CODE" + i).val();
                Model.SUB_SYSTEM_CODE = $("#SUB_SYSTEM_CODE" + i).val();

                Model.VIEW = $("#VIEW" + i).prop("checked");
                Model.EXECUTE = $("#EXECUTE" + i).prop("checked");
                Model.CREATE = $("#CREATE" + i).prop("checked");
                Model.EDIT = $("#EDIT" + i).prop("checked");
                Model.DELETE = $("#DELETE" + i).prop("checked");
                Model.CUSTOM1 = $("#CUSTOM1" + i).prop("checked");
                Model.CUSTOM2 = $("#CUSTOM2" + i).prop("checked");

                Detail_Model.push(Model);
            }
            if (StatusFlag == "u") {
                Model.StatusFlag = StatusFlag.toString();
                Model.RoleId = Number(txtRoleId.value);
                Model.MODULE_CODE = $("#MODULE_CODE" + i).val();
                Model.SYSTEM_CODE = $("#SYSTEM_CODE" + i).val();
                Model.SUB_SYSTEM_CODE = $("#SUB_SYSTEM_CODE" + i).val();

                Model.VIEW = $("#VIEW" + i).prop("checked");
                Model.EXECUTE = $("#EXECUTE" + i).prop("checked");
                Model.CREATE = $("#CREATE" + i).prop("checked");
                Model.EDIT = $("#EDIT" + i).prop("checked");
                Model.DELETE = $("#DELETE" + i).prop("checked");
                Model.CUSTOM1 = $("#CUSTOM1" + i).prop("checked");
                Model.CUSTOM2 = $("#CUSTOM2" + i).prop("checked");

                Detail_Model.push(Model);

            }
            if (StatusFlag == "d") {
                debugger

                Model.StatusFlag = StatusFlag.toString();
                Model.RoleId = Number(txtRoleId.value);
                Model.MODULE_CODE = $("#MODULE_CODE" + i).val();
                Detail_Model.push(Model);


            }
        }
        masterDetail.G_Role = ModelGRole;
        masterDetail.G_RoleModule = Detail_Model;

    }

    function Insert() {
        debugger

        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("G_Branch", "InsertRoleModuleMasteh"),
            data: JSON.stringify(masterDetail),
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

    function success_Insert(id: number) {
        debugger
        GetData_Header_loader();
        GRole = GetDataTable('G_Role') as Array<G_Role>;
        $("#GridDetails").removeAttr("disabled").off('click');
        $("#GridDetails").removeClass("disabledDiv");
        $("#div_BasicData :input").attr("disabled", "disabled");
        $("#btnEdit").removeClass("display_none");
        $("#btnSave").addClass("display_none");
        $("#btnBack").addClass("display_none");
        SelecteData = GRole.filter(x => x.RoleId == id);
        DocumentActions.RenderFromModel(SelecteData[0]);
        $("#data_lebel").removeClass("display_none");
        $("#data_lebel2").removeClass("display_none");
        if (SelecteData[0].IsAvailable == false) {
            $("#txtIsAvailable").val("0");
        } else {
            $("#txtIsAvailable").val("1");
        }
        if (SelecteData[0].IsShowable == false) {
            $("#txtIsShowable").val("0");
        } else {
            $("#txtIsShowable").val("1");
        }
        Display();
    }

    function Update() {
        debugger
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("G_Branch", "updateRoleModuleMasteh"),
            data: JSON.stringify(masterDetail),
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
                { NameTable: 'G_Role', Condition: "" },
                { NameTable: 'G_RoleModule', Condition: "" },
                { NameTable: 'GQ_GetRoleModule', Condition: "" },
                { NameTable: 'G_RoleUsers', Condition: "" }

            ]
        DataResult(Table);
        GModule = GetDataTable('G_MODULES') as Array<G_MODULES>;
 
    }

    function Validate_Role(rowno: number) {
        debugger
        var res: boolean = true;

        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("G_Branch", "chackRoleModule"),
            data: {
                MODULE_CODE: $("#MODULE_CODE" + rowno).val(), Roleid: Number(Grid.SelectedKey)
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
            $("#VIEW" + i).attr("disabled", "disabled");
            $("#EXECUTE" + i).attr("disabled", "disabled");
            $("#CREATE" + i).attr("disabled", "disabled");
            $("#EDIT" + i).attr("disabled", "disabled");
            $("#DELETE" + i).attr("disabled", "disabled");
            $("#CUSTOM1" + i).attr("disabled", "disabled");
            $("#CUSTOM2" + i).attr("disabled", "disabled");

            $("#CUSTOM3" + i).removeAttr("disabled");
            $("#CUSTOM4" + i).removeAttr("disabled");
            $("#CUSTOM5" + i).removeAttr("disabled");
            $("#CUSTOM6" + i).removeAttr("disabled");
            $("#CUSTOM7" + i).removeAttr("disabled");

            $("#CUSTOM3_DESC" + i).removeAttr("disabled");
            $("#CUSTOM4_DESC" + i).removeAttr("disabled");
            $("#CUSTOM5_DESC" + i).removeAttr("disabled");
            $("#CUSTOM6_DESC" + i).removeAttr("disabled");
            $("#CUSTOM7_DESC" + i).removeAttr("disabled");
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
            $("#VIEW" + i).removeAttr("disabled");
            $("#EXECUTE" + i).removeAttr("disabled");
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

            $("#CUSTOM3_DESC" + i).removeAttr("disabled");
            $("#CUSTOM4_DESC" + i).removeAttr("disabled");
            $("#CUSTOM5_DESC" + i).removeAttr("disabled");
            $("#CUSTOM6_DESC" + i).removeAttr("disabled");
            $("#CUSTOM7_DESC" + i).removeAttr("disabled");

        }

    }

    function Display3(RoleId: string) {
         
        GRoleUsers = GetDataTable('G_RoleUsers') as Array<G_RoleUsers>;
        debugger
        RoleUsers = GRoleUsers.filter(x => x.RoleId == Number(RoleId));
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