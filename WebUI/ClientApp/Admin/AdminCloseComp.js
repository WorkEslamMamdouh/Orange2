$(document).ready(function () {
    debugger;
    AdminCloseComp.InitalizeComponent();
});
var AdminCloseComp;
(function (AdminCloseComp) {
    var sys = new SystemTools();
    var SysSession = GetSystemSession('Home');
    var GetCompStatus = new Array();
    var CountGrid = 0;
    //GridView                        
    var Grid = new JsGrid();
    var today = new Date();
    function InitalizeComponent() {
        InitalizeControls();
        InitializeEvents();
        InitializeGrid();
        Display();
    }
    AdminCloseComp.InitalizeComponent = InitalizeComponent;
    function InitalizeControls() {
    }
    function InitializeEvents() {
    }
    function InitializeGrid() {
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
            { title: "رقم", name: "COMP_CODE", type: "number", width: "6%" },
            { title: "اسم الشركه", name: "NameA", type: "text", width: "6%" },
            {
                title: "السنه", width: "3%",
                itemTemplate: function (s, item) {
                    var txt = document.createElement("input");
                    txt.type = "number";
                    txt.value = today.getFullYear().toString();
                    txt.id = "TextYear" + item.COMP_CODE;
                    txt.className = "inputYesr";
                    txt.disabled = false;
                    txt.onchange = function (e) {
                        ChaekFinYear(item.COMP_CODE, Number(txt.value));
                    };
                    return txt;
                }
            },
            {
                title: "تهيئة سنة جديدة", width: "3%",
                itemTemplate: function (s, item) {
                    var txt = document.createElement("input");
                    txt.type = "button";
                    txt.value = "تنفـيذ";
                    txt.id = "but1_" + item.COMP_CODE;
                    txt.className = "ClasBut_" + item.COMP_CODE + " src-btn btn btn-warning input-sm dis";
                    txt.disabled = true;
                    txt.onclick = function (e) {
                        var Comp = item.COMP_CODE;
                        var FinYear = Number($('#TextYear' + Comp).val());
                        debugger;
                        ProcessTrans(Comp, FinYear, 1, "تهيئة سنة جديدة");
                    };
                    return txt;
                }
            },
            {
                title: "تحديث البيانت من السنة السابقة", width: "3%",
                itemTemplate: function (s, item) {
                    var txt = document.createElement("input");
                    txt.type = "button";
                    txt.value = "تنفـيذ";
                    txt.id = "but2_" + item.COMP_CODE;
                    txt.className = "ClasBut_" + item.COMP_CODE + " src-btn btn btn-warning input-sm dis";
                    txt.disabled = true;
                    txt.onclick = function (e) {
                        var Comp = item.COMP_CODE;
                        var FinYear = Number($('#TextYear' + Comp).val());
                        ProcessTrans(Comp, FinYear, 2, "تحديث البيانت من السنة السابقة");
                    };
                    return txt;
                }
            },
            {
                title: "اصدار القيد الافتتاحي ", width: "3%",
                itemTemplate: function (s, item) {
                    var txt = document.createElement("input");
                    txt.type = "button";
                    txt.value = "تنفـيذ";
                    txt.id = "but3_" + item.COMP_CODE;
                    txt.className = "ClasBut_" + item.COMP_CODE + " src-btn btn btn-warning input-sm dis";
                    txt.disabled = true;
                    txt.onclick = function (e) {
                        var Comp = item.COMP_CODE;
                        var FinYear = Number($('#TextYear' + Comp).val());
                        ProcessTrans(Comp, FinYear, 3, "اصدار القيد الافتتاحي ");
                    };
                    return txt;
                }
            },
            {
                title: "اغلاق المخازن", width: "3%",
                itemTemplate: function (s, item) {
                    var txt = document.createElement("input");
                    txt.type = "button";
                    txt.value = "تنفـيذ";
                    txt.id = "but4-" + item.COMP_CODE;
                    txt.className = "ClasBut_" + item.COMP_CODE + " src-btn btn btn-warning input-sm dis";
                    txt.disabled = true;
                    txt.onclick = function (e) {
                        var Comp = item.COMP_CODE;
                        var FinYear = Number($('#TextYear' + Comp).val());
                        ProcessTrans(Comp, FinYear, 4, "اغلاق المخازن");
                    };
                    return txt;
                }
            },
            {
                title: "اغلاق الحسابات ", width: "3%",
                itemTemplate: function (s, item) {
                    var txt = document.createElement("input");
                    txt.type = "button";
                    txt.value = "تنفـيذ";
                    txt.id = "but5_" + item.COMP_CODE;
                    txt.className = "ClasBut_" + item.COMP_CODE + " src-btn btn btn-warning input-sm dis";
                    txt.disabled = true;
                    txt.onclick = function (e) {
                        var Comp = item.COMP_CODE;
                        var FinYear = Number($('#TextYear' + Comp).val());
                        ProcessTrans(Comp, FinYear, 5, "اغلاق الحسابات ");
                    };
                    return txt;
                }
            },
            {
                title: "ضبط رصيد المخزون", width: "3%",
                itemTemplate: function (s, item) {
                    var txt = document.createElement("input");
                    txt.type = "button";
                    txt.value = "تنفـيذ";
                    txt.id = "but6_" + item.COMP_CODE;
                    txt.className = "ClasBut_" + item.COMP_CODE + " src-btn btn btn-warning input-sm dis";
                    txt.disabled = true;
                    txt.onclick = function (e) {
                        var Comp = item.COMP_CODE;
                        var FinYear = Number($('#TextYear' + Comp).val());
                        ProcessTrans(Comp, FinYear, 6, "ضبط رصيد المخزون");
                    };
                    return txt;
                }
            },
            {
                title: "ضبط رصيد العملا والموردين", width: "3%",
                itemTemplate: function (s, item) {
                    var txt = document.createElement("input");
                    txt.type = "button";
                    txt.value = "تنفـيذ";
                    txt.id = "but7_" + item.COMP_CODE;
                    txt.className = "ClasBut_" + item.COMP_CODE + " src-btn btn btn-warning input-sm dis";
                    txt.disabled = true;
                    txt.onclick = function (e) {
                        var Comp = item.COMP_CODE;
                        var FinYear = Number($('#TextYear' + Comp).val());
                        ProcessTrans(Comp, FinYear, 7, "ضبط رصيد العملا والموردين");
                    };
                    return txt;
                }
            },
        ];
    }
    function Display() {
        debugger;
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("I_VW_GetCompStatus", "GetCompsInAdmin"),
            data: { userCode: SysSession.CurrentEnvironment.UserCode },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    GetCompStatus = result.Response;
                    InitializeGrid();
                    Grid.DataSource = GetCompStatus;
                    Grid.Bind();
                    $('.jsgrid-grid-header').addClass('opacitydisabled');
                    for (var i = 0; i < GetCompStatus.length; i++) {
                        ChaekFinYear(GetCompStatus[i].COMP_CODE, Number(today.getFullYear()));
                    }
                }
            }
        });
    }
    function ChaekFinYear(CompCode, FinYear) {
        debugger;
        if (FinYear.toString().length == 4) {
            Ajax.Callsync({
                type: "Get",
                url: sys.apiUrl("I_VW_GetCompStatus", "ChaekFinYear"),
                data: { CompCode: CompCode, FinYear: FinYear },
                success: function (d) {
                    debugger;
                    var result = d;
                    if (result.IsSuccess) {
                        var Mode_G_CONTROL = result.Response;
                        Display_but(Mode_G_CONTROL, CompCode);
                    }
                }
            });
        }
        else {
            $('.ClasBut_' + CompCode).attr('disabled', 'disabled');
        }
    }
    function Display_but(Mode, CompCode) {
        if (Mode.length > 0) {
            $('.ClasBut_' + CompCode).removeAttr('disabled');
            $('#but1_' + CompCode).attr('disabled', 'disabled');
            if (Mode[0].INV_STATUS == 1) {
                $('#but4_' + CompCode).attr('disabled', 'disabled');
                $('#but6_' + CompCode).attr('disabled', 'disabled');
            }
            if (Mode[0].ACC_STATUS == 2 || Mode[0].INV_STATUS != 1) {
                $('#but5_' + CompCode).attr('disabled', 'disabled');
            }
        }
        else {
            $('.ClasBut_' + CompCode).attr('disabled', 'disabled');
            $('#but1_' + CompCode).removeAttr('disabled');
        }
    }
    function ProcessTrans(CompCode, FinYear, Type, titel) {
        var Query = "sys_sp_opr " + CompCode + " , " + FinYear + " ," + Type + " ";
        debugger;
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("I_VW_GetCompStatus", "PushProcessTrans"),
            data: { CompCode: CompCode, FinYear: FinYear, Query: Query },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    var Les = result.Response;
                    if (Les.res == 1) {
                        DisplayMassage("تم " + titel + " بنجاح", "تم " + titel + " بنجاح", MessageType.Succeed);
                    }
                    else {
                        DisplayMassage(Les.msg, Les.msg, MessageType.Error);
                    }
                    ChaekFinYear(CompCode, FinYear);
                }
            }
        });
    }
})(AdminCloseComp || (AdminCloseComp = {}));
//# sourceMappingURL=AdminCloseComp.js.map