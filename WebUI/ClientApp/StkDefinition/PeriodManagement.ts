$(document).ready(() => {

    debugger;
    PeriodManagement.InitalizeComponent();
})
namespace PeriodManagement {


    var compcode: number;
    var BranchCode;
    var RD: number;
    var FinYear: number = 0;

    var SysSession: SystemSession = GetSystemSession(Modules.PeriodManagement);
    var sys: SystemTools = new SystemTools();


    //GridView                        
    var Grid: JsGrid = new JsGrid();
    var Details: Array<I_Period> = new Array<I_Period>();
    var ValidateDet: Array<I_Period> = new Array<I_Period>();
    var Model: I_Period = new I_Period();
    //var Dates: I_Period = new I_Period(); 
    //var btnedite: HTMLButtonElement;
    //var btnback: HTMLButtonElement;
    //var btnsave: HTMLButtonElement;
    //var butClose1: HTMLButtonElement;
    //var butOpen1: HTMLButtonElement;



    var txtPerDesc: HTMLInputElement;
    var txtPerLong: HTMLInputElement;
    var Rd_Day: HTMLInputElement;
    var Rd_Month: HTMLInputElement;
    var btnGen: HTMLButtonElement;
    var flagupdate: boolean = false;

    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);

    export function InitalizeComponent() {
        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") { document.getElementById('Screen_name').innerHTML = "إدارة الفترات"; } else { document.getElementById('Screen_name').innerHTML = "Period Management"; }

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
    function InitalizeControls() {
        //btnedite = document.getElementById("btnedite") as HTMLButtonElement;
        //btnback = document.getElementById("btnback") as HTMLButtonElement;
        //btnsave = document.getElementById("btnsave") as HTMLButtonElement; 
        //butClose1 = document.getElementById("butClose1") as HTMLButtonElement; 
        //butOpen1 = document.getElementById("butOpen1") as HTMLButtonElement; 

        txtPerDesc = document.getElementById("txtPerDesc") as HTMLInputElement;
        txtPerLong = document.getElementById("txtPerLong") as HTMLInputElement;
        Rd_Day = document.getElementById("Rd_Day") as HTMLInputElement;
        Rd_Month = document.getElementById("Rd_Month") as HTMLInputElement;
        btnGen = document.getElementById("btnGen") as HTMLButtonElement;

    }
    function InitializeEvents() {

        //btnedite.onclick = btnedite_onclick;
        //btnback.onclick = btnback_onclick;
        //btnsave.onclick = btnsave_onclick;
        btnGen.onclick = btnGen_onclick;
    }


    //function btnedite_onclick() {
    //    if ($('#drpuserType').val() != "Null") {
    //        $('#btnback').removeClass('display_none')
    //        $('#btnsave').removeClass('display_none')
    //        $('#btnedite').addClass('display_none')
    //        $('.dis').removeAttr('disabled');
    //        $(".acc_Cod").removeAttr('disabled');
    //    } else {
    //        WorningMessage("يجب اختيار الفرع!", "Must choose Type!", "تحذير", "worning");
    //        return;
    //    }
    //}
    //function btnback_onclick() {
    //    $('#btnback').addClass('display_none')
    //    $('#btnsave').addClass('display_none')
    //    $('#btnedite').removeClass('display_none')
    //    //Display();
    //}
    //function btnsave_onclick() { }

    function InitializeGrid() {

        let res: any = GetResourceList("");
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
            { title: res.App_PeriodCode, name: "PERIOD_CODE", type: "number", width: "6%" },
            { title: res.App_PeriodName, name: "PERIOD_DESC", type: "text", width: "6%" },
            { title: res.App_FromDate, name: "FROM_DATE", type: "text", width: "8%" },
            { title: res.App_ToDate, name: "TO_DATE", type: "text", width: "8%" },
            {
                title: res.App_FixQty, name: "FixQty", type: "text", width: "7%",
                itemTemplate: (s: string, item: I_Period): HTMLInputElement => {
                    let txt: HTMLInputElement = document.createElement("input");
                    txt.type = "checkbox";
                    txt.disabled = false;
                    txt.id = "FixQty" + item.PERIOD_CODE;
                    txt.name = "FixQty";
                    txt.className = "form-check-input";
                    txt.onchange = (e) => {
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
                title: res.App_FixCost, name: "FixCost", type: "text", width: "7%",
                itemTemplate: (s: string, item: I_Period): HTMLInputElement => {
                    let txt: HTMLInputElement = document.createElement("input");
                    txt.type = "checkbox";
                    txt.disabled = false;
                    txt.id = "FixCost" + item.PERIOD_CODE;
                    txt.name = "FixCost";
                    txt.className = "form-check-input";
                    txt.onchange = (e) => {
                        //  check_Account(item.Ser);
                        UpdateFixzQty_Cost(item.PERIOD_CODE, txt.checked, false);
                    };
                    txt.checked = item.FixCost;
                    txt.disabled = item.Status == 1 ? true : false;
                    return txt;
                }
            },
            {
                title: res.App_Close, width: "5%",
                itemTemplate: (s: string, item: I_Period): HTMLInputElement => {
                    let txt: HTMLInputElement = document.createElement("input");
                    txt.type = "button";
                    txt.value = (lang == "ar" ? "اغلاق" : "Close");
                    txt.id = "butClose" + item.PERIOD_CODE;
                    txt.className = "btn btn-main";
                    txt.disabled = item.Status == 1 ? true : false;
                    txt.onclick = (e) => {
                        UpdateClose_ReOpen(item.PERIOD_CODE, true);


                    };
                    return txt;
                }
            },



            {
                title: res.Reopen, width: "7%",
                itemTemplate: (s: string, item: I_Period): HTMLInputElement => {
                    let txt: HTMLInputElement = document.createElement("input");
                    txt.type = "button";
                    txt.value = (lang == "ar" ? "اعادة الفتح" : "ReOpen");
                    txt.id = "butOpen" + item.PERIOD_CODE;
                    txt.className = "btn btn-main";
                    txt.disabled = item.Status == 1 ? false : true;
                    txt.onclick = (e) => {
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

        Details = new Array<I_Period>();
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("I_Period", "GetAll"),
            data: { CompCode: compcode, FinYear: FinYear, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    Details = result.Response as Array<I_Period>;
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

    function UpdateClose_ReOpen(PERIOD_CODE: number, IsClosed: boolean) {
        debugger
        flagupdate = false;
        ValidateDet = new Array<I_Period>();
        ValidateDet = Details;

        if (IsClosed == true) {
            for (var i = 0; i < PERIOD_CODE; i++) {
                if (ValidateDet[i].PERIOD_CODE < PERIOD_CODE && ValidateDet[i].Status == 0) {
                    DisplayMassage("لا يمكن اغلاق هذه الفترة قبل اغلاق ما قبلها", "This period cannot be closed before the previous one closes", MessageType.Error)
                    flagupdate = false;
                    return;
                } else {
                    flagupdate = true;
                }
            }
        }
        else {
            for (var i = 0; i < ValidateDet.length; i++) {
                if (ValidateDet[i].PERIOD_CODE > PERIOD_CODE && ValidateDet[i].Status == 1) {
                    DisplayMassage("لا يمكن اعادة فتح هذه الفترة قبل فتح ما بعدها", "This period cannot be open before the Next one Open", MessageType.Error)
                    flagupdate = false;
                    return;
                } else {
                    flagupdate = true;
                }
            }
        }





        if (flagupdate == true) {
            Ajax.Callsync({
                type: "Get",
                url: sys.apiUrl("I_Period", "Close_ReOpen"),
                data: { CompCode: compcode, FinYear: FinYear, PERIOD_CODE: PERIOD_CODE, IsClosed: IsClosed, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
                success: (d) => {
                    Display();
                }
            });

        } else {
            DisplayMassage("هناك خطأ", "Wrong", MessageType.Error)

        }
    }

    function UpdateFixzQty_Cost(PERIOD_CODE: number, check: boolean, IsQty: boolean) {

        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("I_Period", "FixzQty_Cost"),
            data: { CompCode: compcode, FinYear: FinYear, PERIOD_CODE: PERIOD_CODE, check: check, IsQty: IsQty, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {

                Display();
            }
        });
    }

    function btnGen_onclick() {
        debugger;

        if (!Validation())
            return;

        let TP = Rd_Day.checked == true ? 1:2;
        if (!SysSession.CurrentPrivileges.CUSTOM1) return;
       
        //WorningMessage("سيتم حذف جميع الفترات الموجودة و انشاء جديدة", "Do you want to delete?", "تحذير", "worning", () => {     
            var txt;
            if (confirm("سيتم حذف جميع الفترات الموجودة و انشاء جديدة")) {
            Ajax.Callsync({
                type: "Get",
            url: sys.apiUrl("I_Period", "GeneratePeriod"),
                data: { COMP: compcode, YR: FinYear, lN: Number(txtPerLong.value), TP: TP , PNAME: txtPerDesc.value, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
                success: (d) => {
                   txt = "تطبيق الفترة";
                    Display();
                }
            });
        
            //});
            } else {
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


} 

