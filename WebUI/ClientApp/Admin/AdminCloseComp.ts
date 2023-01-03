$(document).ready(() => {

    debugger;
    AdminCloseComp.InitalizeComponent();
})
namespace AdminCloseComp {
    var sys: SystemTools = new SystemTools();
    var SysSession: SystemSession = GetSystemSession('Home');
    var GetCompStatus: Array<ModelCompStatus> = new Array<ModelCompStatus>();

    //GridView                        
    var Grid: JsGrid = new JsGrid();
    var today: Date = new Date();

    export function InitalizeComponent() {

        InitalizeControls();
        InitializeEvents();
        InitializeGrid();
        Display();
    }
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
        Grid.OnItemEditing = () => { };
        Grid.Columns = [
            { title: "رقم", name: "COMP_CODE", type: "number", width: "6%" },
            { title: "اسم الشركه", name: "NameA", type: "text", width: "6%" },
            {
                title: "السنه", width: "3%",
                itemTemplate: (s: string, item: ModelCompStatus): HTMLInputElement => {
                    let txt: HTMLInputElement = document.createElement("input");
                    txt.type = "number";
                    txt.value = today.getFullYear().toString();
                    txt.id = "TextYear" + item.COMP_CODE;
                    txt.className = "inputYesr";
                    txt.disabled = false;
                    txt.onchange = (e) => {

                        ChaekFinYear(item.COMP_CODE, Number(txt.value))


                    };
                    return txt;
                }
            },
            {
                title: "حساب الارباح ", width: "5%",
                itemTemplate: (s: string, item: ModelCompStatus): HTMLInputElement => {
                    let txt: HTMLInputElement = document.createElement("input");
                    txt.type = "text";
                    txt.value = "";
                    txt.id = "Txt_Acc_Code" + item.COMP_CODE;
                    txt.className = "inputYesr";
                    txt.disabled = true;
                    txt.onchange = (e) => {

                        let FinYear = Number($('#TextYear' + item.COMP_CODE).val());

                        ChangeAcc_Code(item.COMP_CODE, FinYear, txt.value)


                    };
                    return txt;
                }
            },
            {
                title: "تهيئة سنة جديدة", width: "3%",
                itemTemplate: (s: string, item: ModelCompStatus): HTMLInputElement => {
                    let txt: HTMLInputElement = document.createElement("input");
                    txt.type = "button";
                    txt.value = "تنفـيذ";
                    txt.id = "but1_" + item.COMP_CODE;
                    txt.className = "ClasBut_" + item.COMP_CODE + " src-btn btn btn-warning input-sm dis";
                    txt.disabled = true;
                    txt.onclick = (e) => {

                        let Comp = item.COMP_CODE;
                        let FinYear = Number($('#TextYear' + Comp).val());
                        debugger
                        ProcessTrans(Comp, FinYear, 1, "تهيئة سنة جديدة")
                    };
                    return txt;
                }
            },
            {
                title: "تحديث البيانت من السنة السابقة", width: "3%",
                itemTemplate: (s: string, item: ModelCompStatus): HTMLInputElement => {
                    let txt: HTMLInputElement = document.createElement("input");
                    txt.type = "button";
                    txt.value = "تنفـيذ";
                    txt.id = "but2_" + item.COMP_CODE;
                    txt.className = "ClasBut_" + item.COMP_CODE + " src-btn btn btn-warning input-sm dis";
                    txt.disabled = true;
                    txt.onclick = (e) => {

                        let Comp = item.COMP_CODE;
                        let FinYear = Number($('#TextYear' + Comp).val());
                        ProcessTrans(Comp, FinYear, 2, "تحديث البيانت من السنة السابقة")
                    };
                    return txt;
                }
            },
            {
                title: "اصدار القيد الافتتاحي ", width: "3%",
                itemTemplate: (s: string, item: ModelCompStatus): HTMLInputElement => {
                    let txt: HTMLInputElement = document.createElement("input");
                    txt.type = "button";
                    txt.value = "تنفـيذ";
                    txt.id = "but3_" + item.COMP_CODE;
                    txt.className = "ClasBut_" + item.COMP_CODE + " src-btn btn btn-warning input-sm dis";
                    txt.disabled = true;
                    txt.onclick = (e) => {

                        let Comp = item.COMP_CODE;
                        let FinYear = Number($('#TextYear' + Comp).val());
                        if ($('#Txt_Acc_Code' + Comp).val().trim() == '') {  
                            DisplayMassage("يجب ادخال حساب الارباح", "خطأ", MessageType.Error)
                            Errorinput($('#Txt_Acc_Code' + Comp))
                            return
                        }
                        ProcessTrans(Comp, FinYear, 3, "اصدار القيد الافتتاحي ")
                    };
                    return txt;
                }
            },
            {
                title: "اغلاق المخازن", width: "3%",
                itemTemplate: (s: string, item: ModelCompStatus): HTMLInputElement => {
                    let txt: HTMLInputElement = document.createElement("input");
                    txt.type = "button";
                    txt.value = "تنفـيذ";
                    txt.id = "but4-" + item.COMP_CODE;
                    txt.className = "ClasBut_" + item.COMP_CODE + " src-btn btn btn-warning input-sm dis";
                    txt.disabled = true;
                    txt.onclick = (e) => {

                        let Comp = item.COMP_CODE;
                        let FinYear = Number($('#TextYear' + Comp).val());
                        ProcessTrans(Comp, FinYear, 4, "اغلاق المخازن")
                    };
                    return txt;
                }
            },
            {
                title: "اغلاق الحسابات ", width: "3%",
                itemTemplate: (s: string, item: ModelCompStatus): HTMLInputElement => {
                    let txt: HTMLInputElement = document.createElement("input");
                    txt.type = "button";
                    txt.value = "تنفـيذ";
                    txt.id = "but5_" + item.COMP_CODE;
                    txt.className = "ClasBut_" + item.COMP_CODE + " src-btn btn btn-warning input-sm dis";
                    txt.disabled = true;
                    txt.onclick = (e) => {

                        let Comp = item.COMP_CODE;
                        let FinYear = Number($('#TextYear' + Comp).val());
                        ProcessTrans(Comp, FinYear, 5, "اغلاق الحسابات ")
                    };
                    return txt;
                }
            },
            {
                title: "ضبط رصيد المخزون", width: "3%",
                itemTemplate: (s: string, item: ModelCompStatus): HTMLInputElement => {
                    let txt: HTMLInputElement = document.createElement("input");
                    txt.type = "button";
                    txt.value = "تنفـيذ";
                    txt.id = "but6_" + item.COMP_CODE;
                    txt.className = "ClasBut_" + item.COMP_CODE + " src-btn btn btn-warning input-sm dis";
                    txt.disabled = true;
                    txt.onclick = (e) => {

                        let Comp = item.COMP_CODE;
                        let FinYear = Number($('#TextYear' + Comp).val());
                        ProcessTrans(Comp, FinYear, 6, "ضبط رصيد المخزون")
                    };
                    return txt;
                }
            },
            {
                title: "ضبط رصيد العملا والموردين", width: "3%",
                itemTemplate: (s: string, item: ModelCompStatus): HTMLInputElement => {
                    let txt: HTMLInputElement = document.createElement("input");
                    txt.type = "button";
                    txt.value = "تنفـيذ";
                    txt.id = "but7_" + item.COMP_CODE;
                    txt.className = "ClasBut_" + item.COMP_CODE + " src-btn btn btn-warning input-sm dis";
                    txt.disabled = true;
                    txt.onclick = (e) => {

                        let Comp = item.COMP_CODE;
                        let FinYear = Number($('#TextYear' + Comp).val());
                        ProcessTrans(Comp, FinYear, 7, "ضبط رصيد العملا والموردين")

                    };
                    return txt;
                }
            },






        ];
    }
    function Display() {
        debugger
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("I_VW_GetCompStatus", "GetCompsInAdmin"),
            data: { userCode: SysSession.CurrentEnvironment.UserCode },
            success: (d) => {//(int CompCode, string StartDate, string EndDate, int Status, int? CustId, string SalesUser, string UserCode, string Token)
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    GetCompStatus = result.Response as Array<ModelCompStatus>;
                    Grid.DataSource = GetCompStatus;
                    Grid.Bind();
                    $('.jsgrid-grid-header').addClass('opacitydisabled')
                    for (var i = 0; i < GetCompStatus.length; i++) {
                        ChaekFinYear(GetCompStatus[i].COMP_CODE, Number(today.getFullYear()))
                    }
                }
            }
        });
    }
    function ChaekFinYear(CompCode: number, FinYear: number) {
        debugger
        if (FinYear.toString().length == 4) {
            Ajax.Callsync({
                type: "Get",
                url: sys.apiUrl("I_VW_GetCompStatus", "ChaekFinYear"),
                data: { CompCode: CompCode, FinYear: FinYear },
                success: (d) => {
                    debugger
                    let result = d as BaseResponse;
                    if (result.IsSuccess) {
                        let Mode_G_CONTROL = result.Response as Array<G_CONTROL>;

                        Display_but(Mode_G_CONTROL, CompCode)

                    }
                }
            });
        }
        else {
            $('.ClasBut_' + CompCode).attr('disabled', 'disabled')
        }

    }
    function ChangeAcc_Code(CompCode: number, FinYear: number, Acc_Code: string) {
        debugger
        if (FinYear.toString().length == 4) {
            Ajax.Callsync({
                type: "Get",
                url: sys.apiUrl("I_VW_GetCompStatus", "ChangeAcc_Code"),
                data: { CompCode: CompCode, FinYear: FinYear, Acc_Code: Acc_Code },
                success: (d) => {
                    debugger
                    let result = d as BaseResponse;
                    if (result.IsSuccess) {
                        let Mode_G_CONTROL = result.Response as Array<G_CONTROL>;

                        Display_but(Mode_G_CONTROL, CompCode)

                    }
                }
            });
        }
        else {
            $('.ClasBut_' + CompCode).attr('disabled', 'disabled')
        }

    }
    function Display_but(Mode: Array<G_CONTROL>, CompCode: number) {

        if (Mode.length > 0) {

            $('#Txt_Acc_Code' + CompCode).val(Mode[0].ProfitAcc_Code)
            $('#Txt_Acc_Code' + CompCode).removeAttr('disabled')

            $('.ClasBut_' + CompCode).removeAttr('disabled')
            $('#but1_' + CompCode).attr('disabled', 'disabled')
            if (Mode[0].INV_STATUS == 1) {
                $('#but4_' + CompCode).attr('disabled', 'disabled')
                $('#but6_' + CompCode).attr('disabled', 'disabled')
            }

            if (Mode[0].ACC_STATUS == 2 || Mode[0].INV_STATUS != 1) {
                $('#but5_' + CompCode).attr('disabled', 'disabled')
            }

        }
        else {
            $('#Txt_Acc_Code' + CompCode).val("")
            $('#Txt_Acc_Code' + CompCode).attr('disabled', 'disabled')

            $('.ClasBut_' + CompCode).attr('disabled', 'disabled')
            $('#but1_' + CompCode).removeAttr('disabled')
        }

    }
    function ProcessTrans(CompCode: number, FinYear: number, Type: number, titel: string) {

        let Query = "sys_sp_opr " + FinYear + " , " + CompCode + " ," + Type + " ";
        debugger
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("I_VW_GetCompStatus", "PushProcessTrans"),
            data: { CompCode: CompCode, FinYear: FinYear, Query: Query },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    let Les = result.Response as Exec_Proc_Status;
                    if (Les.res == 1) { 
                        DisplayMassage("تم " + titel + " بنجاح", "تم بنجاح", MessageType.Succeed)
                    }
                    else {
                        DisplayMassage(Les.msg, "خطأ", MessageType.Error)
                    }
                    ChaekFinYear(CompCode, FinYear)

                }

            }
        });
    }



}

