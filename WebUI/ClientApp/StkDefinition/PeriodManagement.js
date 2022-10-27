$(document).ready(function () {
    debugger;
    PeriodManagement.InitalizeComponent();
});
var PeriodManagement;
(function (PeriodManagement) {
    var compcode;
    var BranchCode;
    var RD;
    var FinYear = 0;
    var SysSession = GetSystemSession(Modules.PeriodManagement);
    var sys = new SystemTools();
    //GridView                        
    var Grid = new JsGrid();
    var Details = new Array();
    var ValidateDet = new Array();
    var Model = new I_Period();
    //var Dates: I_Period = new I_Period(); 
    //var btnedite: HTMLButtonElement;
    //var btnback: HTMLButtonElement;
    //var btnsave: HTMLButtonElement;
    //var butClose1: HTMLButtonElement;
    //var butOpen1: HTMLButtonElement;
    var txtPerDesc;
    var txtPerLong;
    var Rd_Day;
    var Rd_Month;
    var btnGen;
    var flagupdate = false;
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);
    function InitalizeComponent() {
        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = "إدارة الفترات";
        }
        else {
            document.getElementById('Screen_name').innerHTML = "Period Management";
        }
        $("#iconbar_Definition").addClass("d-none");
        $("#divIconbar").addClass("d-none");
        $("#icon-bar").addClass("d-none");
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        FinYear = Number(SysSession.CurrentEnvironment.CurrentYear);
        InitalizeControls();
        InitializeEvents();
        InitializeGrid();
        Display();
        Rd_Day.checked = true;
    }
    PeriodManagement.InitalizeComponent = InitalizeComponent;
    function InitalizeControls() {
        //btnedite = document.getElementById("btnedite") as HTMLButtonElement;
        //btnback = document.getElementById("btnback") as HTMLButtonElement;
        //btnsave = document.getElementById("btnsave") as HTMLButtonElement; 
        //butClose1 = document.getElementById("butClose1") as HTMLButtonElement; 
        //butOpen1 = document.getElementById("butOpen1") as HTMLButtonElement; 
        txtPerDesc = document.getElementById("txtPerDesc");
        txtPerLong = document.getElementById("txtPerLong");
        Rd_Day = document.getElementById("Rd_Day");
        Rd_Month = document.getElementById("Rd_Month");
        btnGen = document.getElementById("btnGen");
    }
    function InitializeEvents() {
        //btnedite.onclick = btnedite_onclick;
        //btnback.onclick = btnback_onclick;
        //btnsave.onclick = btnsave_onclick;
        btnGen.onclick = btnGen_onclick;
    }
    function InitializeGrid() {
        var res = GetResourceList("");
        Grid.ElementName = "ReportGrid";
        Grid.Paging = true;
        Grid.PageSize = 15;
        Grid.Sorting = true;
        Grid.InsertionMode = JsGridInsertionMode.Binding;
        Grid.Editing = false;
        Grid.Inserting = false;
        Grid.SelectedIndex = 1;
        Grid.OnItemEditing = function () { };
        Grid.Columns = [
            { title: res.App_PeriodCode, name: "PERIOD_CODE", type: "number", width: "2%" },
            { title: res.App_PeriodName, name: "PERIOD_DESC", type: "text", width: "6%" },
            { title: res.App_FromDate, name: "FROM_DATE", type: "text", width: "8%" },
            { title: res.App_ToDate, name: "TO_DATE", type: "text", width: "8%" },
            {
                title: res.App_FixQty, name: "FixQty", type: "text", width: "5%",
                itemTemplate: function (s, item) {
                    var txt = document.createElement("input");
                    txt.type = "checkbox";
                    txt.disabled = false;
                    txt.id = "FixQty" + item.PERIOD_CODE;
                    txt.name = "FixQty";
                    txt.className = "form-check-input";
                    txt.onchange = function (e) {
                        //  check_Account(item.Ser);
                        UpdateFixzQty_Cost(item.PERIOD_CODE, txt.checked, true);
                    };
                    txt.checked = item.FixQty;
                    txt.disabled = item.Status == 1 ? true : false;
                    //alert(item.GLAccountCode);
                    return txt;
                }
            },
            {
                title: res.App_FixCost, name: "FixCost", type: "text", width: "5%",
                itemTemplate: function (s, item) {
                    var txt = document.createElement("input");
                    txt.type = "checkbox";
                    txt.disabled = false;
                    txt.id = "FixCost" + item.PERIOD_CODE;
                    txt.name = "FixCost";
                    txt.className = "form-check-input";
                    txt.onchange = function (e) {
                        //  check_Account(item.Ser);
                        UpdateFixzQty_Cost(item.PERIOD_CODE, txt.checked, false);
                    };
                    txt.checked = item.FixCost;
                    txt.disabled = item.Status == 1 ? true : false;
                    return txt;
                }
            },
            {
                title: res.App_Close, width: "15%",
                itemTemplate: function (s, item) {
                    var txt = document.createElement("input");
                    txt.type = "button";
                    txt.value = (lang == "ar" ? "اغلاق" : "Close");
                    txt.id = "butClose" + item.PERIOD_CODE;
                    txt.className = "btn btn-main";
                    txt.disabled = item.Status == 1 ? true : false;
                    txt.onclick = function (e) {
                        UpdateClose_ReOpen(item.PERIOD_CODE, true);
                    };
                    return txt;
                }
            },
            {
                title: res.Reopen, width: "15%",
                itemTemplate: function (s, item) {
                    var txt = document.createElement("input");
                    txt.type = "button";
                    txt.value = (lang == "ar" ? "اعادة الفتح" : "ReOpen");
                    txt.id = "butOpen" + item.PERIOD_CODE;
                    txt.className = "btn btn-main";
                    txt.disabled = item.Status == 1 ? false : true;
                    txt.onclick = function (e) {
                        UpdateClose_ReOpen(item.PERIOD_CODE, false);
                    };
                    return txt;
                }
            },
            { title: res.App_Closed_BY, name: "Closed_BY", type: "text", width: "10%" },
            { title: res.App_Closed_AT, name: "Closed_AT", type: "text", width: "13%" },
            { title: res.App_ReOpen_BY, name: "ReOpen_BY", type: "text", width: "10%" },
            { title: res.App_ReOpen_AT, name: "ReOpen_AT", type: "text", width: "13%" },
        ];
    }
    function Display() {
        Details = new Array();
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("I_Period", "GetAll"),
            data: { CompCode: compcode, FinYear: FinYear, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    Details = result.Response;
                    for (var i = 0; i < Details.length; i++) {
                        Details[i].FROM_DATE = Details[i].FROM_DATE == null ? "" : DateFormat(Details[i].FROM_DATE);
                        Details[i].TO_DATE = Details[i].TO_DATE == null ? "" : DateFormat(Details[i].TO_DATE);
                        Details[i].Closed_AT = Details[i].Closed_AT == null ? "" : DateTimeFormatWithoutT(Details[i].Closed_AT);
                        Details[i].ReOpen_AT = Details[i].ReOpen_AT == null ? "" : DateTimeFormatWithoutT(Details[i].ReOpen_AT);
                    }
                    InitializeGrid();
                    Grid.DataSource = Details;
                    Grid.Bind();
                }
            }
        });
    }
    function UpdateClose_ReOpen(PERIOD_CODE, IsClosed) {
        debugger;
        flagupdate = false;
        ValidateDet = new Array();
        ValidateDet = Details;
        if (IsClosed == true) {
            for (var i = 0; i < PERIOD_CODE; i++) {
                if (ValidateDet[i].PERIOD_CODE < PERIOD_CODE && ValidateDet[i].Status == 0) {
                    DisplayMassage("لا يمكن اغلاق هذه الفترة قبل اغلاق ما قبلها", "This period cannot be closed before the previous one closes", MessageType.Error);
                    flagupdate = false;
                    return;
                }
                else {
                    flagupdate = true;
                }
            }
        }
        else {
            for (var i = 0; i < ValidateDet.length; i++) {
                if (ValidateDet[i].PERIOD_CODE > PERIOD_CODE && ValidateDet[i].Status == 1) {
                    DisplayMassage("لا يمكن اعادة فتح هذه الفترة قبل فتح ما بعدها", "This period cannot be open before the Next one Open", MessageType.Error);
                    flagupdate = false;
                    return;
                }
                else {
                    flagupdate = true;
                }
            }
        }
        if (flagupdate == true) {
            Ajax.Callsync({
                type: "Get",
                url: sys.apiUrl("I_Period", "Close_ReOpen"),
                data: { CompCode: compcode, FinYear: FinYear, PERIOD_CODE: PERIOD_CODE, IsClosed: IsClosed, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token, Modules: Modules.PeriodManagement, Branch_Code: SysSession.CurrentEnvironment.BranchCode },
                success: function (d) {
                    Display();
                }
            });
        }
        else {
            DisplayMassage("هناك خطأ", "Wrong", MessageType.Error);
        }
    }
    function UpdateFixzQty_Cost(PERIOD_CODE, check, IsQty) {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("I_Period", "FixzQty_Cost"),
            data: { CompCode: compcode, FinYear: FinYear, PERIOD_CODE: PERIOD_CODE, check: check, IsQty: IsQty, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token, Modules: Modules.PeriodManagement, Branch_Code: SysSession.CurrentEnvironment.BranchCode },
            success: function (d) {
                Display();
            }
        });
    }
    function btnGen_onclick() {
        debugger;
        if (!Validation())
            return;
        var TP = Rd_Day.checked == true ? 1 : 2;
        if (!SysSession.CurrentPrivileges.CUSTOM1)
            return;
        //WorningMessage("سيتم حذف جميع الفترات الموجودة و انشاء جديدة", "Do you want to delete?", "تحذير", "worning", () => {     
        var txt;
        if (confirm("سيتم حذف جميع الفترات الموجودة و انشاء جديدة")) {
            Ajax.Callsync({
                type: "Get",
                url: sys.apiUrl("I_Period", "GeneratePeriod"),
                data: { COMP: compcode, YR: FinYear, lN: Number(txtPerLong.value), TP: TP, PNAME: txtPerDesc.value, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
                success: function (d) {
                    txt = "تطبيق الفترة";
                    Display();
                }
            });
            //});
        }
        else {
            txt = "تطبيق الفترة";
        }
        document.getElementById("btnGen").innerHTML = txt;
    }
    function Validation() {
        if (txtPerDesc.value.trim() == "") {
            DisplayMassage("يجب ادخال اسم الفترة  ", "Please, Enter The Period Name!", MessageType.Worning);
            Errorinput(txtPerDesc);
            return false;
        }
        var Qty = Number(txtPerLong.value);
        if (txtPerLong.value.trim() == "" || Qty <= 0) {
            DisplayMassage("يجب ادخال طول الفترة ", "Please, Enter long Period!", MessageType.Worning);
            Errorinput(txtPerLong);
            return false;
        }
        return true;
    }
})(PeriodManagement || (PeriodManagement = {}));
//# sourceMappingURL=PeriodManagement.js.map