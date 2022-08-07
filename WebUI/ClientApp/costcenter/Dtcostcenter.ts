$(document).ready(() => {
    Dtcostcenter.InitializeComponent();
})
namespace Dtcostcenter {
    //************system variables
    var SysSession: SystemSession = GetSystemSession(Modules.Dtcostcenter);
    var sys: SystemTools = new SystemTools();
    //***********controls
    var btnAddDetails: HTMLButtonElement;
    var btnAddDetails2: HTMLButtonElement;
    var btn_Add: HTMLButtonElement;
    var btn_Update: HTMLButtonElement;
    var btn_Save: HTMLButtonElement;
    var MasterGrid: JsGrid = new JsGrid();
    //var btnShow: HTMLButtonElement;
    var searchbutmemreport: HTMLInputElement;
    var btn_Back: HTMLButtonElement;
    var btnDelete: HTMLButtonElement;
    var btnEditAcc: HTMLButtonElement;
    var btnSaveAcc: HTMLButtonElement;
    var btnEditCCDT: HTMLButtonElement;
    var btnSaveCCDT: HTMLButtonElement;
    var btnBackCCDT: HTMLButtonElement;
    var btnBackAcc: HTMLButtonElement;
    var txtCCDT_TYPE: HTMLInputElement;
    //***********Variables
    var CountAccGrid = 0;
    var CountCCDtGrid = 0;
    var Model: A_CCDT_Types = new A_CCDT_Types();
    var AccountDetail: Array<A_ACCOUNT> = new Array<A_ACCOUNT>(); 
    var CCDTDetail: Array<A_CCDT_COSTCENTERS> = new Array<A_CCDT_COSTCENTERS>();
    var Details: Array<A_CCDT_Types> = new Array<A_CCDT_Types>();
    var selecteditem: A_CCDT_Types = new A_CCDT_Types();
    var MasterDetail: Account_CCDT_CCDTTP_MasterDetails = new Account_CCDT_CCDTTP_MasterDetails();
    var SearchDetails: Array<A_CCDT_Types> = new Array<A_CCDT_Types>();
    var Mode = "Query";
    //*************************Initialization************************//

    export function InitializeComponent() {

        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = "مراكز التكلفة الفرعية";

        } else {
            document.getElementById('Screen_name').innerHTML = "Detail Cost Center Types ";
        }
        $("#divIconbar").addClass("hidden_Control");
        $("#icon-bar").addClass("hidden_Control");
        InitializeControls();
        InitializeEvents();
        InitializeGrid();
        btnShow_onclick();
        Button_privialges();
    }

    function InitializeControls() {
        btnAddDetails = document.getElementById("btnAddDetails") as HTMLButtonElement;
        btnAddDetails2 = document.getElementById("btnAddDetails2") as HTMLButtonElement;
        btn_Add = document.getElementById("btn_Add") as HTMLButtonElement;
        btn_Update = document.getElementById("btn_Update") as HTMLButtonElement;
        //btnShow = document.getElementById("btnShow") as HTMLButtonElement;
        btn_Save = document.getElementById("btn_Save") as HTMLButtonElement;
        btn_Back = document.getElementById("btn_Back") as HTMLButtonElement;
        btnDelete = document.getElementById("btnDelete") as HTMLButtonElement;
        searchbutmemreport = document.getElementById("searchbutmemreport") as HTMLInputElement;
        btnEditAcc = document.getElementById("btnEditAcc") as HTMLButtonElement;
        btnSaveAcc = document.getElementById("btnSaveAcc") as HTMLButtonElement;
        btnEditCCDT = document.getElementById("btnEditCCDT") as HTMLButtonElement;
        btnSaveCCDT = document.getElementById("btnSaveCCDT") as HTMLButtonElement;
        btnBackAcc = document.getElementById("btnBackAcc") as HTMLButtonElement;
        btnBackCCDT = document.getElementById("btnBackCCDT") as HTMLButtonElement;
        txtCCDT_TYPE = document.getElementById("txtCCDT_TYPE") as HTMLInputElement;
    }

    function InitializeEvents() {
        btn_Add.onclick = btnAdd_onclick;
        btnAddDetails.onclick = btnAddDetails_onclick;
        btnAddDetails2.onclick = btnAddDetails2_onclick;
        //btnShow.onclick = btnShow_onclick;
        btn_Update.onclick = btnEdit_onclick;
        btn_Save.onclick = btnSave_onclick;
        searchbutmemreport.onkeyup = _SearchBox_Change;
        btn_Back.onclick = btnBack_onclick;
        btnEditAcc.onclick = btnEditAcc_onclick;
        btnSaveAcc.onclick = btnSaveAcc_onclick;
        btnEditCCDT.onclick = btnEditCCDT_onclick;
        btnSaveCCDT.onclick = btnSaveCCDT_onclick;
        btnBackAcc.onclick = btnBackAcc_onclick;
        btnBackCCDT.onclick = btnBackCCDT_onclick;
        txtCCDT_TYPE.onchange = txtCCDT_TYPE_onchange;
       // btnDelete.onclick = btnDelete_onclick;
    }

    function InitializeGrid() {
        $("#divMasterGridiv").removeClass("display_none");
        let res: any = GetResourceList("");
        MasterGrid.ElementName = "divMasterGrid";
        MasterGrid.Paging = true;
        MasterGrid.PageSize = 10;
        MasterGrid.Sorting = true;
        MasterGrid.InsertionMode = JsGridInsertionMode.Binding;
        MasterGrid.Editing = false;
        MasterGrid.Inserting = false;
        MasterGrid.SelectedIndex = 1;
        MasterGrid.OnRowDoubleClicked = MasterGridDouble_Click;
        MasterGrid.OnItemEditing = () => { };
        MasterGrid.PrimaryKey = "CCDT_TYPE";
        MasterGrid.Columns = [
            { title: res.App_Code, name: "CCDT_TYPE", type: "number", width: "10%" },
            { title: res.App_DescA, name: "DescA", type: "text", width: "12%" },
            { title: res.App_DescE, name: "DescE", type: "text", width: "30%" },
        ];
        MasterGrid.Bind();
    }

    function Build_ACC_Controls(cnt: number) {
        var html;
        html = `<tr id= "No_Row${cnt}">
                    <input id="ItemID${cnt}" type="hidden" class="form-control display_none"  />  
                    <td>
		                <div class="form-group">
			                <span id="btn_minus${cnt}"><i class="fas fa-minus-circle fs-4 btn-minus"></i></span>
		                </div>
	                </td>
                    <td>
                        <div class="form-group d-flex">
                            <button type="button" class="btn btn-main btn-search" id="btnSearchAcc${cnt}" name="ColSearch" >
                                <i class="fas fa-search"></i>
                            </button>
                            <input id="txtCode${cnt}" type="text" class="form-control" name="" disabled />
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
                            <input id="txtDescA${cnt}" type="text" class="form-control" name="" disabled />
		                </div>
	                </td>
                    <input id = "txt_StatusFlag${cnt}" name = " " type = "hidden" disabled class="form-control"/>

                </tr>`;


        $("#div_Data").append(html);
        $("#btnSearchAcc" + cnt).on('click', function () {
            Search_Account_onclick(cnt);
        });
        $("#btn_minus" + cnt).on('click', function () {
            Delete_Account_Row(cnt);
        });
        return;
    }

    function Build_CCDT_Controls(cnt: number) {
        var html;
        html = `<tr id= "No_Row_CCDT${cnt}">
                    <input id="ItemID${cnt}" type="hidden" class="form-control display_none"  />  
                    <td>
		                <div class="form-group">
			                <span id="btn_minus_CCDt${cnt}"><i class="fas fa-minus-circle fs-4 btn-minus btn-minus-CCDt"></i></span>
		                </div>
	                </td>
                    <td>
                        <div class="form-group ">
                            <input id="txtCCDT_CODE${cnt}" type="text" class="form-control" name="" disabled />
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
                            <input id="txtCCDT_DESCA${cnt}" type="text" class="form-control" name="" disabled />
		                </div>
	                </td>
                    <td>
		                <div class="form-group">
                            <input id="txtCCDT_DESCE${cnt}" type="text" class="form-control" name="" disabled />
		                </div>
	                </td>
                    <input id = "txt_StatusFlag_CCdt${cnt}" name = " " type = "hidden" disabled class="form-control"/>
                    <input id = "txtCCDT_TYPE${cnt}" name = " " type = "hidden" disabled class="form-control"/>

                </tr>`;
        $("#div_Data2").append(html);

        $("#btnSearch_CCDT" + cnt).on('click', function () {
            Search_CCDT_onclick(cnt);
        });
        $("#btn_minus_CCDt" + cnt).on('click', function () {
            Delete_CCDT_Row(cnt);
        });
        $("#txtCCDT_DESCA" + cnt).on('change', function () {
            if ($("#txt_StatusFlag_CCdt" + cnt).val()=='v')
               $("#txt_StatusFlag_CCdt" + cnt).val('u');
        });
        $("#txtCCDT_DESCE" + cnt).on('change', function () {
            if ($("#txt_StatusFlag_CCdt" + cnt).val() == 'v')
            $("#txt_StatusFlag_CCdt" + cnt).val('u');
        });
        $("#txtCCDT_CODE" + cnt).on('change', function () {
            CheckExistance_Code(cnt);
        });
     
    }

 //****************************Main buttons*********************//

    function btnAdd_onclick()
    {
        if (!SysSession.CurrentPrivileges.AddNew) return;
        clear();
        EnableControls();
        $("#DivFilter").addClass("disabledDiv");
       $("#divGrid").addClass("disabledDiv");
        $('#btnPrintReceive').addClass('display_none');
        Mode = "Add";
    }

    function btnEdit_onclick() {
        if (!SysSession.CurrentPrivileges.EDIT) return;
        EnableControls();
        $("#txtCCDT_TYPE").prop("disabled", true);
        Mode = "Edit";
        $("#divGrid").addClass("disabledDiv");

    }

    function btnEditAcc_onclick() {
        if (!SysSession.CurrentPrivileges.EDIT) return;
        $("#btnBackAcc").removeClass("display_none");
        $("#btnSaveAcc").removeClass("display_none");
        $("#btnAddDetails").removeClass("display_none");
        $(".btn-minus").removeClass("display_none");
        $("#btnEditAcc").addClass("display_none");
        $("#divGrid").addClass("disabledDiv");
        $("#div_Master").addClass("disabledDiv");
        $("#divCCDT").addClass("disabledDiv");
        $(".btn-search").removeClass("display_none");
        Mode = "Edit";
    }

    function btnEditCCDT_onclick()
    {
        if (!SysSession.CurrentPrivileges.EDIT) return;
        $("#btnBackCCDT").removeClass("display_none");
        $("#btnSaveCCDT").removeClass("display_none");
        $("#btnAddDetails2").removeClass("display_none");
        $(".btn-minus-CCDt").removeClass("display_none");
        $("#btnEditCCDT").addClass("display_none");
        $('.CCDtControl').removeAttr("disabled");
        $("#divGrid").addClass("disabledDiv");
        $("#div_Master").addClass("disabledDiv");
        $("#div_ACC").addClass("disabledDiv");
        Mode = "Edit";
    }

    function btnSave_onclick() {
        debugger
        if (!Validation())
            return;
        if (Mode == "Add")
            Insert();
        else if (Mode == "Edit")
            Update();
    }

    function btnSaveAcc_onclick()
    {
        //***Validate

        if ( $("#txtCCDT_TYPE").val() == "") {
            DisplayMassage(" من فضلك اختر كود المركز  ", "Enter Cost Center Type please", MessageType.Error);
            return;
        }

        if (CountAccGrid == 0)
        {
            DisplayMassage(" من فضلك ادخل جميع الحسابات المرتبطة  ", "Enter All Accounts please", MessageType.Error);
            return;
        }

        for (var i = 0; i < CountAccGrid; i++) {
            if ($("#txtCode" + i).val() == "" && $("#txt_StatusFlag" + i).val() != "d") {
                DisplayMassage(" من فضلك ادخل جميع الحسابات المرتبطة  ", "Enter All Accounts please", MessageType.Error);
                return ;
            }
        }
        //***update cost center type in Account
        UpdateAccount();

    }

    function btnSaveCCDT_onclick()
    {
        debugger
        if ($("#txtCCDT_TYPE").val() == "") {
            DisplayMassage(" من فضلك اختر كود المركز  ", "Enter Cost Center Type please", MessageType.Error);
            return;
        }

        if (CountCCDtGrid == 0) {
            DisplayMassage(" من فضلك ادخل المركز الفرعية المرتبطة  ", "Enter Centers please", MessageType.Error);
            return;
        }

        //***Validate
        for (var i = 0; i < CountCCDtGrid; i++) {
            if ($("#txtCCDT_CODE" + i).val() == "" && $("#txt_StatusFlag_CCdt" + i).val() != "d") {
                DisplayMassage(" من فضلك ادخل المركز الفرعية المرتبطة  ", "Enter Centers please", MessageType.Error);
                return;
            }
        }
        //***Add cost center type in Centers
        UpdateCostCenters();
    }

    function btnBack_onclick() {
        if (Mode == "Edit") {
            clear();
            Display();
            QueryMode();
           
        }
        else if(Mode == "Add") {
            clear();
            QueryMode();
            btnShow_onclick();
            $("#btn_Save").addClass("display_none");
            $("#btn_Back").addClass("display_none");
            $("#btn_Update").addClass("display_none");
            $("#btnEditAcc").addClass("display_none");
            $("#btnEditCCDT").addClass("display_none");
           // $("#btnDelete").addClass("display_none");
        }
     
    }

    function btnBackAcc_onclick() {
        btnBack_onclick();
        $("#divGrid").removeClass("disabledDiv");
        $("#div_Master").removeClass("disabledDiv");
        $("#divCCDT").removeClass("disabledDiv");
    }

    function btnBackCCDT_onclick() {
        debugger
        btnBack_onclick();
    }

    function MasterGridDouble_Click() {
        selecteditem = MasterGrid.SelectedItem as A_CCDT_Types;
        Display();
        QueryMode();
        $("#btnEditAcc").removeClass("display_none");
        $("#btnEditCCDT").removeClass("display_none");
        //$("#btnDelete").removeClass("display_none");
    }

    //************************Display Data*************************//

    function Display() {
        DocumentActions.RenderFromModel(selecteditem);
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDtTypes", "GetAll_by_CCDT_TYPE"),
            data: {
                UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token, CCDT_TYPE: selecteditem.CCDT_TYPE
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    MasterDetail = result.Response as Account_CCDT_CCDTTP_MasterDetails;
                    DisplayAccount();
                    DisplayCCDT();
                    
                }
            }
        });
    }

    function DisplayAccount()
    {
        $("#div_Data").html("");
        CountAccGrid = 0;
        for (var i = 0; i < MasterDetail.A_ACCOUNT.length; i++) {
            Build_ACC_Controls(i);
            $("#txtCode" + i).val(MasterDetail.A_ACCOUNT[i].ACC_CODE);
            if (SysSession.CurrentEnvironment.Language=="ar") $("#txtDescA" + i).val(MasterDetail.A_ACCOUNT[i].ACC_DESCA);
            else $("#txtDescA" + i).val(MasterDetail.A_ACCOUNT[i].ACC_DESCL);
        }
        CountAccGrid = MasterDetail.A_ACCOUNT.length;
    }

    function DisplayCCDT() {
        $("#div_Data2").html("");
        CountCCDtGrid = 0;
        debugger
        for (var i = 0; i < MasterDetail.A_CCDT_COSTCENTERS.length; i++) {
            Build_CCDT_Controls(i);
            $("#txtCCDT_CODE" + i).val(MasterDetail.A_CCDT_COSTCENTERS[i].CCDT_CODE);
            $("#txt_StatusFlag_CCdt" + i).val('v');//V for view
            $("#txtCCDT_DESCA" + i).val(MasterDetail.A_CCDT_COSTCENTERS[i].CCDT_DESCA);
            $("#txtCCDT_DESCE" + i).val(MasterDetail.A_CCDT_COSTCENTERS[i].CCDT_DESCE);
        }
        CountCCDtGrid = MasterDetail.A_CCDT_COSTCENTERS.length;
    }

    function DisplayProcessedRecord() {

        MasterGrid.SelectedKey = MasterDetail.A_CCDT_Types.CCDT_TYPE.toString();
        MasterGrid.SelectedItem = MasterDetail.A_CCDT_Types;
        MasterGridDouble_Click();
        $("#divDetails").removeClass("display_none");

    }

    //***************************Save Data**************************//

    function Assign() {
        DocumentActions.AssignToModel(Model);
        Model.CCDT_TYPE =  $("#txtCCDT_TYPE").val() ;
        Model.UserCode = SysSession.CurrentEnvironment.UserCode;
        Model.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
        Model.COMP_CODE = Number(SysSession.CurrentEnvironment.CompCode);
    }

    function AssignAccount() {
        AccountDetail = new Array<A_ACCOUNT>();
        let obj = new A_ACCOUNT();
        for (var i = 0; i < CountAccGrid; i++) {
           obj = new A_ACCOUNT();
           obj.ACC_CODE = $("#txtCode" + i).val();
           obj.COMP_CODE = Number(SysSession.CurrentEnvironment.CompCode);
           obj.CCDT_TYPE = $("#txtCCDT_TYPE").val();
           obj.UserCode = SysSession.CurrentEnvironment.UserCode;
           obj.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
           obj.StatusFlag = 'i';
          AccountDetail.push(obj);
        }
    }

    function AssignCCDt() {
        CCDTDetail = new Array<A_CCDT_COSTCENTERS>();
        let obj = new A_CCDT_COSTCENTERS();
        for (var i = 0; i < CountCCDtGrid; i++) {
            obj = new A_CCDT_COSTCENTERS();
            obj.CCDT_CODE = $("#txtCCDT_CODE" + i).val();
            obj.COMP_CODE = Number(SysSession.CurrentEnvironment.CompCode);
            obj.StatusFlag = $("#txt_StatusFlag_CCdt" + i).val();
            obj.CCDT_DESCA = $("#txtCCDT_DESCA" + i).val();
            obj.CCDT_DESCE = $("#txtCCDT_DESCE" + i).val();
         
            obj.CCDT_TYPE = $("#txtCCDT_TYPE").val();
            obj.UserCode = SysSession.CurrentEnvironment.UserCode;
            obj.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
            CCDTDetail.push(obj);
        }
    }

    function Insert() {
        Assign();
        AssignAccount();
        AssignCCDt();
        MasterDetail.A_CCDT_Types = Model;
        MasterDetail.A_CCDT_COSTCENTERS = CCDTDetail.filter(x => x.StatusFlag!='d');
        MasterDetail.A_ACCOUNT = AccountDetail;
        Ajax.Callsync({
            type: "post",
            url: sys.apiUrl("AccDtTypes", "InsertAll"),
            data: JSON.stringify(MasterDetail),
            success: (d) => {
                debugger
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    MasterDetail = result.Response as Account_CCDT_CCDTTP_MasterDetails;
                    DisplayMassage("تم الحفظ", "Saved Succesfully", MessageType.Succeed);
                    btnShow_onclick();
                    QueryMode();
                    Mode = "Query";
                }
            }
        });
    }

    function Update() {
        Assign();
        AssignAccount();
        AssignCCDt();
        debugger
        MasterDetail.A_CCDT_Types = Model;
        MasterDetail.A_CCDT_COSTCENTERS = CCDTDetail.filter(x => x.StatusFlag != 'd');
        MasterDetail.A_ACCOUNT = AccountDetail;
        Ajax.Callsync({
            type: "post",
            url: sys.apiUrl("AccDtTypes", "UpdateAll"),
            data: JSON.stringify(MasterDetail),
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    MasterDetail = result.Response as Account_CCDT_CCDTTP_MasterDetails;
                    DisplayMassage("تم الحفظ", "Saved Succesfully", MessageType.Succeed);
                    btnShow_onclick();
                    QueryMode();
                    DisplayProcessedRecord();
                    Mode = "Query";
                }
            }
        });
    }

    function UpdateAccount()
    {
        AssignAccount();
        Ajax.Callsync({
            type: "post",
            url: sys.apiUrl("AccDtTypes", "UpdateAccount"),
            data: JSON.stringify(AccountDetail),
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    AccountDetail = result.Response as Array<A_ACCOUNT>;
                    MasterDetail.A_ACCOUNT = AccountDetail;
                    DisplayMassage("تم الحفظ", "Saved Succesfully", MessageType.Succeed);
                    btnShow_onclick();
                    QueryMode();
                    DisplayProcessedRecord();
                    Mode = "Query";
                }
            }
        });
        
        
    }

    function UpdateCostCenters()
    {
        debugger

        AssignCCDt();
       
        Ajax.Callsync({
            type: "post",
            url: sys.apiUrl("AccDtCostCenters", "UpdateLst"),
            data: JSON.stringify(CCDTDetail),
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    DisplayMassage("تم الحفظ", "Saved Succesfully", MessageType.Succeed);
                    btnShow_onclick();
                    QueryMode();
                    DisplayProcessedRecord();
                    Mode = "Query";
                    $("#btnBackCCDT").addClass("display_none");
                    $("#btnSaveCCDT").addClass("display_none");
                }
            }
        });
    }

   
    //**********************search *************************//

    function btnShow_onclick() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDtTypes", "GetAll"),
            data: {
                UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token, CompCode: SysSession.CurrentEnvironment.CompCode
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    Details = result.Response as Array<A_CCDT_Types>;
                    MasterGrid.DataSource = Details;
                    MasterGrid.Bind();
                }
            }
        });
    }

    function Search_Account_onclick(cnt: number)
    {
        let sys: SystemTools = new SystemTools();
        let cond = " COMP_CODE = " + SysSession.CurrentEnvironment.CompCode +" and DETAIL=1 and CCDT_TYPE IS NULL";
        sys.FindKey(Modules.Dtcostcenter, "btnSearch_Account", cond, () => {
            let id = SearchGrid.SearchDataGrid.SelectedKey;
            var Query: string = "select * from [dbo].[A_ACCOUNT] where ACC_CODE= " + id;
            $("#txtCode" + cnt).val(id);
            Ajax.Callsync({
                type: "Get",
                url: sys.apiUrl("AccDtTypes", "ExecuteAccountQry"),
                data: {
                    UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token, Query: Query
                },
                success: function (d) {
                    let result = d as BaseResponse;
                    if (result.IsSuccess) {
                        let res = result.Response as Array<A_ACCOUNT>;
                        if (SysSession.CurrentEnvironment.Language == "ar") $("#txtDescA" + cnt).val(res[0].ACC_DESCA);
                        else $("#txtDescA" + cnt).val(res[0].ACC_DESCL);
                    }
                }
            });


           
            
        });
    }

    function Search_CCDT_onclick(cnt: number) {
        let sys: SystemTools = new SystemTools();
        let cond = " COMP_CODE = " + SysSession.CurrentEnvironment.CompCode + " and  CCDT_TYPE IS NULL";
        sys.FindKey(Modules.Dtcostcenter, "btnSearch_CCDT", cond, () => {
            let id = SearchGrid.SearchDataGrid.SelectedKey;
            $("#txt_StatusFlag_CCdt" + cnt).val('i');
            $("#txtCCDT_CODE" + cnt).val(id);
            Ajax.Callsync({
                type: "Get",
                url: sys.apiUrl("AccDtCostCenters", "GetByCCDT_CODE"),
                data: {
                    UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token, CCDT_CODE: id
                },
                success: function (d) {
                    let result = d as BaseResponse;
                    if (result.IsSuccess) {
                        let res = result.Response as Array<A_CCDT_COSTCENTERS>;
                        $("#txtCCDT_DESCA" + cnt).val(res[0].CCDT_DESCA);
                        $("#txtCCDT_DESCE" + cnt).val(res[0].CCDT_DESCE);
                    }
                }
            });



            $("#txtDescA" + cnt).val();
        });
    }

    function _SearchBox_Change() {
        if (searchbutmemreport.value != "") {

            let search: string = searchbutmemreport.value.toLowerCase();
            if (SysSession.CurrentEnvironment.Language == "ar")
                SearchDetails = Details.filter(x => x.CCDT_TYPE.toString().search(search) >= 0 || x.DescA.toLowerCase().search(search) >= 0);
            else
                SearchDetails = Details.filter(x => x.CCDT_TYPE.toString().search(search) >= 0 || x.DescE.toLowerCase().search(search) >= 0);
            MasterGrid.DataSource = SearchDetails;
            MasterGrid.Bind();
        } else {
            MasterGrid.DataSource = Details;
            MasterGrid.Bind();
        }
    }

//***************************Delete**************************************//

    function Delete_CCDT_Row(RecNo: number) {
        if (!SysSession.CurrentPrivileges.Remove) return;
        WorningMessage("هل تريد الحذف؟", "Do you want to delete?", "تحذير", "worning", () => {
          $("#No_Row_CCDT" + RecNo).attr("hidden", "true");
            $("#txt_StatusFlag_CCdt" + RecNo).val('d');
        });
    }

    function Delete_Account_Row(RecNo: number) {
        if (!SysSession.CurrentPrivileges.Remove) return;
        WorningMessage("هل تريد الحذف؟", "Do you want to delete?", "تحذير", "worning", () => {
            $("#No_Row" + RecNo).attr("hidden", "true");
            $("#txt_StatusFlag" + RecNo).val('d');
            $("#txtCode" + RecNo).val("000");
        });
    }

    function btnDelete_onclick() {
        debugger
        Assign();
        AssignAccount();
        AssignCCDt();
        MasterDetail.A_CCDT_Types = Model;
        MasterDetail.A_CCDT_COSTCENTERS = CCDTDetail.filter(x => x.StatusFlag != 'd');
        MasterDetail.A_ACCOUNT = AccountDetail;
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDtTypes", "DeleteAll"),
            data: JSON.stringify(MasterDetail),
            success: function (d) {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    MasterDetail = new Account_CCDT_CCDTTP_MasterDetails();
                    DisplayMassage("تم الحذف", "Deleted Succesfully", MessageType.Succeed);
                    btnShow_onclick();
                    QueryMode();
                    Mode = "Query";
                   // $("#btnDelete").addClass("display_none");
                    selecteditem = new A_CCDT_Types();
                }
            }
        });
    }

    //***********************Validation && privilege*********//

    function Validation() {
       
       
        if ($("#txtCCDT_TYPE").val() == "") {
            DisplayMassage(" من فضلك ادخل الرمز  ", "Enter Code please", MessageType.Error); 
            return false;
        }
        if ($("#txtDescA").val() == "" && $("#txtDescE").val()=="") {
            DisplayMassage(" من فضلك ادخل الوصف  ", "Enter Vendor please", MessageType.Error); 
            return false;
        }
       
      
       
        return true;
    }

    function Button_privialges() {
        btn_Add.disabled = !SysSession.CurrentPrivileges.AddNew;
        btn_Update.disabled = !SysSession.CurrentPrivileges.EDIT;
    }

    //***********************Functions*****************************//

    function clear() {
        $("#div_Master :input").val("");
        $("#div_Data").html("");
        $("#div_Data2").html("");
        CountAccGrid = 0;
        CountCCDtGrid = 0;
    }

    function QueryMode() {

        $("#divDetails").removeClass("display_none");
        $("#div_Master :input").prop("disabled", true);
        $("#btn_Update").removeClass("display_none");
        $("#btn_Save").addClass("display_none");
        $("#btn_Back").addClass("display_none");
        $("#btn_Add").removeClass("display_none");
        btn_Update.disabled = false;
        btn_Add.disabled = false;
        btnDelete.disabled = false;
        $("#btnAddDetails").addClass("display_none");
        $("#btnAddDetails2").addClass("display_none");
        $(".btn-minus").addClass("display_none");
        $(".btn-minus-CCDt").addClass("display_none");
        $(".btn-search").addClass("display_none");
       $("#divGrid").removeClass("disabledDiv");
        $("#btnEditAcc").removeClass("display_none");
        $("#btnSaveAcc").addClass("display_none");
        $("#btnBackAcc").addClass("display_none");
        $("#btnEditCCDT").removeClass("display_none");
        $("#btnSaveCCDT").addClass("display_none");
        $("#btnBackCCDT").addClass("display_none");
        $("#div_Master").removeClass("disabledDiv");
        $("#divCCDT").removeClass("disabledDiv");
        $("#div_ACC").removeClass("disabledDiv");
        
        //  $("#btnDelete").removeClass("display_none");
    }

    function EnableControls() {
        $("#div_Master :input").prop("disabled", false);
        $("#divDetails").removeClass("display_none");
        $("#btn_Save").removeClass("display_none");
        $("#btn_Back").removeClass("display_none");
        $("#btn_Update").addClass("display_none");
        $("#btn_Add").addClass("display_none");
        $("#btnAddDetails").addClass("display_none");
        $("#btnAddDetails2").addClass("display_none");
        $(".btn-minus").removeClass("display_none");
        $(".btn-minus-CCDt").removeClass("display_none");
        $(".btn-search").removeClass("display_none");
        $("#btnEditAcc").addClass("display_none");
        $("#btnEditCCDT").addClass("display_none");
        
    }

    function btnAddDetails_onclick() {
        if (!SysSession.CurrentPrivileges.AddNew) return;
        Build_ACC_Controls(CountAccGrid);
       

     


        CountAccGrid++;
        $("#btnedite").addClass("display_none");
    }

    function btnAddDetails2_onclick() {
        if (!SysSession.CurrentPrivileges.AddNew) return;
        Build_CCDT_Controls(CountCCDtGrid);
        $("#txt_StatusFlag_CCdt" + CountCCDtGrid).val("i"); //In Insert mode
        $("#txtCCDT_DESCA" + CountCCDtGrid).removeAttr("disabled");
        $("#txtCCDT_DESCE" + CountCCDtGrid).removeAttr("disabled");
        $("#txtCCDT_CODE" + CountCCDtGrid).removeAttr("disabled");
        CountCCDtGrid++; 

        $("#btnedite").addClass("display_none");
        
    }

    function CheckExistance_Code(count:number)
    {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDtCostCenters", "GetByCCDT_CODE"),
            data: {
                UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token, CompCode:Number(SysSession.CurrentEnvironment.CompCode),
                CCDT_CODE: $("#txtCCDT_CODE" + count).val()
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    let ccdt = result.Response as Array<A_CCDT_COSTCENTERS>;
                    if (ccdt.length > 0)
                    {
                        DisplayMassage("  كود المركز الفرعي موجود من قبل  ", "Cost Center  Code Exist before", MessageType.Error);
                        $("#txtCCDT_CODE" + count).val("");
                        return;
                    }
                }
            }
        });
    }

    function txtCCDT_TYPE_onchange()
    {
        var CCDT_Tp = Details.filter(x => x.CCDT_TYPE == txtCCDT_TYPE.value);
        if (CCDT_Tp.length > 0) {
            DisplayMassage(" هذا الكود موجود من قبل  ", "This Code Exist before", MessageType.Error);
            txtCCDT_TYPE.value = "";
            return;
        }
    }
   
   
}