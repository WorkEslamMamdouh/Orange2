
$(document).ready(() => {
    try {

        HomeComponent.InitalizeComponent();
    } catch (e) {
        window.open(Url.Action("HomePage", "Login"), "_self");

    }
});

namespace HomeComponent {
    //let res: any = GetResourceList("");d
    debugger
    var sys: SystemTools = new SystemTools();
    var ddbra: HTMLSelectElement;
    ddbra = document.getElementById("ddbra") as HTMLSelectElement;
    var SelectSession: HTMLSelectElement;
    var btnDashboard: HTMLButtonElement;
    var btn_loguotuser: HTMLButtonElement;
    var SysSession: SystemSession = GetSystemSession('Home');
    var systemEnv: SystemEnvironment = SysSession.CurrentEnvironment;

    var G_BRANCHService: Array<G_BRANCH> = new Array<G_BRANCH>();
    var selectedbar;
    var newtap = false;

    G_BRANCHService = GetSystemG_BRANCH();
    debugger
    $('Li').addClass('animate__animated animate__fadeInTopRight');
    $('#logOrg').addClass('animate__animated animate__backInDown');
    //$('#PageLodes').addClass('animate__animated animate__bounceInUp');
    setTimeout(function () {
        $('#Uesr_out').removeClass('animate__backInDown');
        $('#Uesr_out').removeClass('animate__animated'); 
    $('.mes').removeClass('display_none'); 
        
    }, 1000);

    export function OpenPage(moduleCode: string) {
        SysSession.CurrentEnvironment.ModuleCode = moduleCode;

        // // ;
        let compCode = SysSession.CurrentEnvironment.CompCode;
        let branchCode = SysSession.CurrentEnvironment.BranchCode;
        let UserCode = SysSession.CurrentEnvironment.UserCode;
        let SystemCode = SysSession.CurrentEnvironment.SystemCode;
        let SubSystemCode = SysSession.CurrentEnvironment.SubSystemCode;
        let Modulecode = SysSession.CurrentEnvironment.ModuleCode;
        let CurrentYear = SysSession.CurrentEnvironment.CurrentYear;
        Ajax.Callsync({
            type: "GET",
            url: sys.apiUrl("SystemTools", "GetUserPrivilage"),
            data: { year: Number(CurrentYear), compCode: compCode, branchCode: branchCode, UserCode: UserCode, SystemCode: SystemCode, Modulecode: Modulecode },
            success: (d) => {

                if (d == undefined) {
                    window.open(Url.Action("HomePage", "Login"), "_self");
                    return;
                }
                else {
                    let result = JSON.parse(d) as UserPrivilege;

                    if (result == null) {
                        MessageBox.Show("Access denied", moduleCode);
                        return;
                    }
                    if (result.Access == true) {
                        SysSession.CurrentPrivileges = result;

                        if (newtap == true) {
                            window.open(Url.Action(moduleCode + "Index", "Home"), "_blank");

                        }
                        else {
                            window.open(Url.Action(moduleCode + "Index", "Home"), "_self");
                        }

                        OpenScreen(SysSession.CurrentEnvironment.UserCode, SysSession.CurrentEnvironment.CompCode, SysSession.CurrentEnvironment.BranchCode, moduleCode, SysSession.CurrentEnvironment.CurrentYear);

                    }
                    else {
                        MessageBox.Show("No Inv1_Privilage", moduleCode);
                    }
                }
            }
        });
    }

    export function OpenReportsPopup(moduleCode: string) {

        SysSession.CurrentEnvironment.ModuleCode = moduleCode;
        let compCode = SysSession.CurrentEnvironment.CompCode;
        let branchCode = SysSession.CurrentEnvironment.BranchCode;
        let UserCode = SysSession.CurrentEnvironment.UserCode;
        let SystemCode = SysSession.CurrentEnvironment.SystemCode;
        let SubSystemCode = SysSession.CurrentEnvironment.SubSystemCode;
        let Modulecode = SysSession.CurrentEnvironment.ModuleCode;

        Ajax.CallAsync({
            url: sys.apiUrl("SystemTools", "GetUserPrivilage"),

            data: { compCode: compCode, branchCode: branchCode, UserCode: UserCode, SystemCode: SystemCode, SubSystemCode: SubSystemCode, Modulecode: Modulecode },
            success: (d) => {
                if (d == undefined) {
                    window.open(Url.Action("HomePage", "Login"), "_self");
                    return;
                }
                else {
                    let result = JSON.parse(d) as UserPrivilege;
                    if (result == null) {
                        MessageBox.Show("Access denied", "GeneralReports");
                        return;
                    }
                    if (result.Access == true) {
                        let opt: JQueryAjaxSettings = {
                            url: Url.Action(moduleCode, "GeneralReports"),

                            success: (d) => {

                                let result = d as string;

                                $("#PopupDialog").modal("show");
                                $("#PopupBody").html(result);
                                $('#PopupDialog').modal({
                                    refresh: true
                                });
                                var val = $("#rpTitle").text();
                                $("#TitleSpan").html(val);
                            }
                        };
                        Ajax.CallAsync(opt);
                    }
                    else {
                        MessageBox.Show("Access denied", "GeneralReports");
                    }
                }
            }
        });
    }


    function OutSessionTimer() {
        if (SelectSession.value == '2') {
            LogoutUserApi();
        }
    }


    export function InitalizeComponent() {


        $("#ddbra").on('change', function () {
            selectedbar = $('#ddbra').val();
            systemEnv.BranchCode = selectedbar;
            document.cookie = "Inv1_systemProperties=" + JSON.stringify(systemEnv).toString() + ";expires=Fri, 31 Dec 2030 23:59:59 GMT;path=/";
            newtap = false;
            OpenPage(Modules.Home);


        });
        Getbranch();

        //------------------------------------------------------NewSession---------------------------------------
        $('#idSession').val(sys.SysSession.CurrentEnvironment.I_Control[0].SysTimeOut);
        $('#SelectSession option[value=1]').prop('selected', 'selected').change();

        SelectSession = document.getElementById('SelectSession') as HTMLSelectElement;
        SelectSession.onchange = OutSessionTimer;
        //---------------------------------------------


        $('#sidebarCollapse').on('click', function () {
            $(".left-sidebar-pro").css({ 'display': 'block' });


        });
        $('#sidebarCollapse2').on('click', function () {
            $(".left-sidebar-pro").toggle("slide");
            $("#cont").addClass("colapsdivcont");

            $("#i_toolpar").removeAttr('hidden');
            $("#i_toolpar").addClass('i_toolpar');
        });
        $('#i_toolpar').on('click', function () {
            $(".left-sidebar-pro").css({ 'display': 'none' });
            $("#cont").addClass("colapsdivcont");

            $("#i_toolpar").attr('hidden');
            $("#i_toolpar").removeClass('i_toolpar');
        });
        Language();
        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            //$("#camp_name").val(SysSession.CurrentEnvironment.CompanyNameAr);

            document.getElementById('camp_name').innerHTML = SysSession.CurrentEnvironment.CompanyNameAr + " - " + SysSession.CurrentEnvironment.CurrentYear;
        }
        else {
            document.getElementById('camp_name').innerHTML = SysSession.CurrentEnvironment.CompanyName + " - " + SysSession.CurrentEnvironment.CurrentYear;
            $("#camp_name").val(SysSession.CurrentEnvironment.CompanyNameAr);

        }

        //GetBackgroundImage(); 
        //GetNotificationData();
        //Notifications_Message()

        // Apply user and company privilages 
        ApplyModules();
        ApplyCompanyPrivilages();
        //$("#btnHelpRep").click(() => { ScreenHelp(); })

        InitializePages();
        $("#DashButton").css('pointer-events', 'auto');
        document.getElementById('Admin_name').innerHTML = SysSession.CurrentEnvironment.UserCode;
        if (SysSession.CurrentEnvironment.ScreenLanguage == 'ar') {
            $('#homeTitle').text("نظام سيف لادارة الاملاك");
        }
        else {
            $('#homeTitle').text("Safe Proprity Managment");
            $("#main-menu").removeClass("sm-rtl");
        }
        if (SysSession.CurrentEnvironment.ScreenLanguage == 'ar') {
            $('#LanguageButtonHome').text("Change Language");
        }
        else {
            $('#LanguageButtonHome').text(" تغير اللغة  ");
        }

        btn_loguotuser = DocumentActions.GetElementById<HTMLButtonElement>("btn_loguotuser");
        var loguotuser = DocumentActions.GetElementById<HTMLButtonElement>("loguotuser");
        loguotuser.onclick = LogoutUserApi;
        //CheckTime(); 
        $("#LanguageButtonHome").click(() => {
            if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") { // English Mode  
                RemoveStyleSheet("bootstrap-rtl");
                //RemoveStyleSheet("mainAR");
                //RemoveStyleSheet("Style_Arabic");
                //RemoveStyleSheet("style");
                //RemoveStyleSheet("StyleNewmassege");
                //RemoveStyleSheet("responsive_AR");

                //AppendStyleSheet("bootstrap.min");
                //AppendStyleSheet("main");
                //AppendStyleSheet("responsive");
                //AppendStyleSheet("StyleEn");
                SysSession.CurrentEnvironment.ScreenLanguage = "en";

                $('#LanguageButtonHome').text(" تغير اللغة  ");


                document.cookie = "Inv1_systemProperties=" + JSON.stringify(SysSession.CurrentEnvironment) + ";expires=Fri, 31 Dec 2030 23:59:59 GMT;path=/";
            }
            else { // Arabic Mode

                //RemoveStyleSheet("StyleEn");
                //RemoveStyleSheet("bootstrap.min");
                //RemoveStyleSheet("main");
                //RemoveStyleSheet("responsive");

                //AppendStyleSheet("bootstrap-rtl");
                //AppendStyleSheet("StyleNewmassege");
                //AppendStyleSheet("mainAR");
                //AppendStyleSheet("style");
                //AppendStyleSheet("Style_Arabic");
                //AppendStyleSheet("responsive_AR");

                SysSession.CurrentEnvironment.ScreenLanguage = "ar";

                $('#LanguageButtonHome').text("Change Language");

                document.cookie = "Inv1_systemProperties=" + JSON.stringify(SysSession.CurrentEnvironment) + ";expires=Fri, 31 Dec 2030 23:59:59 GMT;path=/";
            }

            window.location.reload();
        });

        $(window).scroll(() => {
            let backtotop = $('.back-to-top');


            if (window.scrollY > 10) {
                backtotop.addClass('active');
            } else {
                backtotop.removeClass('active');
            }


        });



        Cheak_UserTokenlog();
    }


    function Getbranch() {
        var lang = SysSession.CurrentEnvironment.Language
        for (var i = 0; i < G_BRANCHService.length; i++) {
            $('#ddbra').append('<option value="' + G_BRANCHService[i].BRA_CODE + '">' + (lang == "ar" ? "  " + G_BRANCHService[i].BRA_CODE + " - " + G_BRANCHService[i].BRA_DESC : "  " + G_BRANCHService[i].BRA_CODE + " - " + G_BRANCHService[i].BRA_DESCE) + '</option>');
        }
        $('#ddbra').val(SysSession.CurrentEnvironment.BranchCode)
    }

    export function LogoutUserApi() {
        let userCode = SysSession.CurrentEnvironment.UserCode;
        Ajax.Callsync({
            type: "GET",
            url: sys.apiUrl("G_USERS", "LogoutUser"),
            data: { user: userCode },
            success: (d) => {
                // // ;

                if (d !== undefined) {
                    window.open(Url.Action("HomePage", "Login"), "_self");

                    return;
                }
            }
        });
    };
    function ApplyCompanyPrivilages() {


        if (systemEnv.IsDashboardActive == false) {
            // disable dashboard button
            btnDashboard = DocumentActions.GetElementById<HTMLButtonElement>("btnDashboard");
            btnDashboard.style.display = "none";
        }
    }


    function ApplyModules() {
        var lis = document.getElementsByClassName("liItem");
        let obj = [document.getElementById('liItem')];
        let modules: Array<UserPrivilege> = new Array<UserPrivilege>();
        let compCode = SysSession.CurrentEnvironment.CompCode;
        let branchCode = SysSession.CurrentEnvironment.BranchCode;
        let UserCode = SysSession.CurrentEnvironment.UserCode;
        let SystemCode = SysSession.CurrentEnvironment.SystemCode;
        let SubSystemCode = SysSession.CurrentEnvironment.SubSystemCode;
        let CurrentYear = SysSession.CurrentEnvironment.CurrentYear;

        $.ajax({
            type: "GET",
            url: sys.apiUrl("SystemTools", "GetAllUserPrivilage"),
            async: false,
            data: { year: Number(CurrentYear), compCode: Number(compCode), branchCode: Number(branchCode), UserCode: UserCode, SystemCode: SystemCode, SubSystemCode: SubSystemCode },
            success: (d) => {

                modules = d as Array<UserPrivilege>;
            }
        });
        // filter moulules where isavailable = false or access = false 
        let li;
        let li_T;
        for (var i = 0; i < modules.length; i++) {



            let singleUserModule: UserPrivilege = modules[i];
            //Notification control
            if (singleUserModule.MODULE_CODE.substring(0, 5) == "Note_") {

                li = document.getElementById(singleUserModule.MODULE_CODE) as HTMLLIElement;
            }
            else if (singleUserModule.MODULE_CODE.substring(0, 4) == "tol_") {

                li = document.getElementById(singleUserModule.MODULE_CODE) as HTMLLIElement;
            }

            else {
                li = document.getElementById("btn" + singleUserModule.MODULE_CODE) as HTMLLIElement;
                li_T = document.getElementById("btn" + singleUserModule.MODULE_CODE + "T") as HTMLLIElement;
            }


            if (li != null) {
                try {
                    if (singleUserModule != null) {
                        if (singleUserModule.Access === false) {

                            li.style.display = "none";
                            li_T.style.display = "none";
                        }
                        if (singleUserModule.AVAILABLE === false) {
                            li.style.display = "none";
                            li_T.style.display = "none";
                        }
                    }
                    else {
                        let key: string = li.getAttribute("key");
                        li.style.display = "";
                        li_T.style.display = "";
                        li.className = "liItem";
                        li_T.className = "liItem";
                    }

                } catch (e) {

                }



            } else {
                //alert("wrong code  " + singleUserModule.MODULE_CODE)
            }
        }
        $('.MED').removeClass('display_none');

        if (SysSession.CurrentEnvironment.I_Control[0].GL_VoucherCCDT_Type != 1) {
            $('#btnDtcostcenter').addClass('display_none');
            $('#btnDtcostcenterT').addClass('display_none');
            $('#btnCcdtAccState').addClass('display_none');
            $('#btnCcdtAccStateT').addClass('display_none');
        }
    }

    //By Muhammad Rajab 



    function GetNotificationData() {
        let comCode = SysSession.CurrentEnvironment.CompCode;
        let BraCode = SysSession.CurrentEnvironment.BranchCode;
        let SystemCode = SysSession.CurrentEnvironment.SystemCode;
        let SubSystemCode = SysSession.CurrentEnvironment.SubSystemCode;
        let yearid = SysSession.CurrentEnvironment.CurrentYear;
        var PeriodinSec = SysSession.CurrentEnvironment.I_Control[0].NotePeriodinSec;
        $.ajax({
            type: "GET",
            url: sys.apiUrl("SystemTools", "GetNotifications"),
            data: { comCode: comCode, BraCode: BraCode, yearid: yearid, SystemCode: SystemCode, SubSystemCode: SubSystemCode },
            async: false,
            success: (d) => {
                let not = d as NoteificationsModel[];
                let ulcontent = "";
                $("#notificationUL").html("");
                for (let n of not) {
                    let li = document.createElement("li");
                    let span = document.createElement("span");
                    let span2 = document.createElement("span");
                    if (n.NoteCount > 0) {
                        li.onclick = () => {
                            notification_onclick(n.MODULE_CODE, n.MODULE_CODE);
                        }
                    }
                    li.className = "liItem disabledLi dropdown cursor";
                    li.id = n.MODULE_CODE;
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
                        span.innerText = n.MODULE_DESCA;
                    } else {
                        span.innerText = n.MODULE_DESCE;
                    }
                    span2.className = 'price';
                    span.className = 'bading_left';
                    span2.innerText = n.NoteCount.toString();
                    li.appendChild(span);
                    li.appendChild(span2);
                    $("#notificationUL").append(li);
                }
                setTimeout(GetNotificationData, PeriodinSec * 1000);
            }
        });

    }
    function notification_onclick(ModuleCode: string, btnName: string) {
        let sys: SystemTools = new SystemTools();
        var condation = "CompCode = " + SysSession.CurrentEnvironment.CompCode + " and BranchCode = " + SysSession.CurrentEnvironment.BranchCode + "and finyear = " + SysSession.CurrentEnvironment.CurrentYear;
        //if (ModuleCode == "Note_openinvoice")
        //    condation = condation + "  and Status = 0";
        //else if (ModuleCode == "Note_openreceipt") 
        //    condation = condation + "  and Status = 0 and TrType =1";
        //else if (ModuleCode == "Note_openopration") 
        //    condation = condation + "  and Status = 0 ";
        //else if (ModuleCode == "Note_openpaymnt")
        //    condation = condation + "  and Status = 0 and TrType =2";
        sys.FindKey(ModuleCode, btnName, condation, () => {

        });
    }

    function UpdateNotificationAndSendMsg() {
        if (SysSession.CurrentEnvironment.IsNotificaitonActive == true) {
            var PeriodinSec = SysSession.CurrentEnvironment.I_Control[0].NotePeriodinSec;

            let comCode = SysSession.CurrentEnvironment.CompCode;
            let BraCode = SysSession.CurrentEnvironment.BranchCode;
            let SystemCode = SysSession.CurrentEnvironment.SystemCode;
            let SubSystemCode = SysSession.CurrentEnvironment.SubSystemCode;
            $.ajax({
                type: "GET",
                url: sys.apiUrl("SystemTools", "UpdateNotificationAndSndMsg"),
                data: { comCode: comCode, BraCode: BraCode, SystemCode: SystemCode, SubSystemCode: SubSystemCode },
                success: (d) => {
                    GetNotificationData();
                    ApplyModules();
                    setTimeout(UpdateNotificationAndSendMsg, PeriodinSec * 1000);
                }
            });
        }
    }


    export function HomePrev(controllerName: string, moduleCode: string) {
        let compCode = SysSession.CurrentEnvironment.CompCode;
        let branchCode = SysSession.CurrentEnvironment.BranchCode;
        let UserCode = SysSession.CurrentEnvironment.UserCode;
        let SystemCode = SysSession.CurrentEnvironment.SystemCode;
        let SubSystemCode = SysSession.CurrentEnvironment.SubSystemCode;
        let Modulecode = SysSession.CurrentEnvironment.ModuleCode;

        Ajax.Callsync({
            url: sys.apiUrl("SystemTools", "GetUserPrivilage"),
            data: { compCode: compCode, branchCode: branchCode, UserCode: UserCode, SystemCode: SystemCode, SubSystemCode: SubSystemCode, Modulecode: moduleCode },
            success: (d) => {

                if (d == undefined) {
                    window.open(Url.Action("HomePage", "Login"), "_self");
                    return;
                }
                else {
                    let result = JSON.parse(d) as UserPrivilege;
                    if (result == null) {
                        MessageBox.Show("Access denied", controllerName);
                        return;
                    }
                    if (result.Access == true) {
                        $("#spnFav").css("display", "inline-block");
                        SysSession.CurrentPrivileges = result;
                        SysSession.CurrentPrivileges.MODULE_CODE = SysSession.CurrentEnvironment.ModuleCode;
                        document.cookie = "Inv1_Privilage=" + JSON.stringify(result).toString() + ";expires=Fri, 31 Dec 2030 23:59:59 GMT;path=/";

                    }
                    else {
                        MessageBox.Show("Access denied", controllerName);
                    }
                }
            }
        });
    }


    export function OpenView(controllerName: string, moduleCode: string) {
        // ;
        SysSession.CurrentEnvironment.ModuleCode = moduleCode;

        let compCode = SysSession.CurrentEnvironment.CompCode;
        let branchCode = SysSession.CurrentEnvironment.BranchCode;
        let UserCode = SysSession.CurrentEnvironment.UserCode;
        let SystemCode = SysSession.CurrentEnvironment.SystemCode;
        let SubSystemCode = SysSession.CurrentEnvironment.SubSystemCode;
        let Modulecode = SysSession.CurrentEnvironment.ModuleCode;
        let CurrentYear = SysSession.CurrentEnvironment.CurrentYear;
        localStorage.setItem("Compcode1", compCode);

        Ajax.Callsync({
            url: sys.apiUrl("SystemTools", "GetAllUserPrivilage"),
            data: { compCode: compCode, branchCode: branchCode, UserCode: UserCode, SystemCode: SystemCode, SubSystemCode: SubSystemCode, Modulecode: Modulecode },
            success: (d) => {
                // ;
                if (d == undefined) {
                    window.open(Url.Action("HomePage", "Login"), "_self");
                    return;
                }
                else {
                    let result = JSON.parse(d) as UserPrivilege;

                    if (result == null) {
                        MessageBox.Show("Access denied", controllerName);
                        return;
                    }
                    if (result.Access == true) {

                        $("#spnFav").css("display", "inline-block");

                        SysSession.CurrentPrivileges = result;
                        SysSession.CurrentPrivileges.MODULE_CODE = SysSession.CurrentEnvironment.ModuleCode;
                        sessionStorage.setItem("MODU_CODE", SysSession.CurrentEnvironment.ModuleCode);
                        systemEnv.ScreenLanguage = sessionStorage.getItem("temp_lang");
                        document.cookie = "Privilage=" + JSON.stringify(d).toString() + ";expires=Fri, 31 Dec 2030 23:59:59 GMT;path=/";
                        window.open(Url.Action(controllerName + "Index", controllerName), "_self");
                    }
                    else {
                        MessageBox.Show("Access denied", controllerName);
                    }
                }
            }
        });
    }

    function InitializePages() {

        $("#btnHome").click(() => { newtap = false; OpenPage(Modules.Home); })
        $("#btnStkDefItems").click(() => { newtap = false; OpenPage(Modules.StkDefItems); })
        $("#btnStkDefItemsNew").click(() => { newtap = false; OpenPage(Modules.StkDefItemsNew); })
        $("#btnStkDefCategory").click(() => { newtap = false; OpenPage(Modules.StkDefCategory); })
        $("#btnPeriodManagement").click(() => { newtap = false; OpenPage(Modules.PeriodManagement); })//
        $("#btnItemPeriodSummary").click(() => { newtap = false; OpenPage(Modules.ItemPeriodSummary); })//
        $("#btnStkDefUnit").click(() => { newtap = false; OpenPage(Modules.StkDefUnit); })
        $("#btnStkDefItemType").click(() => { newtap = false; OpenPage(Modules.StkDefItemType); })
        $("#btnStkDefStore").click(() => { newtap = false; OpenPage(Modules.StkDefStore); })
        $("#btnDashboard").click(() => { newtap = false; OpenPage(Modules.Dashboard); })
        $("#btnAccDefVendor").click(() => { newtap = false; OpenPage(Modules.AccDefVendor); })
        $("#btnAccDefCustomer").click(() => { newtap = false; OpenPage(Modules.AccDefCustomer); })
        $("#btnAccDefSalesmen").click(() => { newtap = false; OpenPage(Modules.AccDefSalesmen); })
        $("#btnAccDefBox").click(() => { newtap = false; OpenPage(Modules.AccDefBox); })
        $("#btnAccDefExpenses").click(() => { newtap = false; OpenPage(Modules.AccDefExpenses); })
        $("#btnAccDefReceipts").click(() => { newtap = false; OpenPage(Modules.AccDefReceipts); })
        $("#btnCashBankAccount").click(() => { newtap = false; OpenPage(Modules.CashBankAccount); })
        $("#btnAgingCust").click(() => { newtap = false; OpenPage(Modules.AgingCust); })//
        $("#btnAgingVend").click(() => { newtap = false; OpenPage(Modules.AgingVend); })//
        $("#btnGenDefCustomerCat").click(() => { newtap = false; OpenPage(Modules.GenDefCustomerCat); })
        $("#btnGendefCustomerGroup").click(() => { newtap = false; OpenPage(Modules.GendefCustomerGroup); })
        $("#btnGenDefCustomerAdjust").click(() => { newtap = false; OpenPage(Modules.GenDefCustomerAdjust); })
        $("#btnGenDefVendorCat").click(() => { newtap = false; OpenPage(Modules.GenDefVendorCat); })
        $("#btnGendefVendorGroup").click(() => { newtap = false; OpenPage(Modules.GendefVendorGroup); })
        $("#btnGenDefVendorAdjust").click(() => { newtap = false; OpenPage(Modules.GenDefVendorAdjust); })
        $("#btnAccTrInvReceipt").click(() => { newtap = false; OpenPage(Modules.AccTrInvReceipt); })
        $("#btnAccTrReceiptNote").click(() => { newtap = false; OpenPage(Modules.AccTrReceiptNote); })
        $("#btnAccTrPaymentNote").click(() => { newtap = false; OpenPage(Modules.AccTrPaymentNote); })
        $("#btnAccTrCustomerAdjust").click(() => { newtap = false; OpenPage(Modules.AccTrCustomerAdjust); })
        $("#btnAccTrVendorAdjust").click(() => { newtap = false; OpenPage(Modules.AccTrVendorAdjust); })
        $("#btnSlsTrSales").click(() => { newtap = false; OpenPage(Modules.SlsTrSales); })
        $("#btnSlsTrReturn").click(() => { newtap = false; OpenPage(Modules.SlsTrReturn); })
        $("#btnSlsTrReturnOperation").click(() => { newtap = false; OpenPage(Modules.SlsTrReturnOperation); })
        $("#btnSlsTrReturnNew").click(() => { newtap = false; OpenPage(Modules.SlsTrReturnNew); })
        $("#btnSlsTrSalesManager").click(() => { newtap = false; OpenPage(Modules.SlsTrSalesManager); })
        $("#btnSlsTrSalesManagerNew").click(() => { newtap = false; OpenPage(Modules.SlsTrSalesManagerNew); })
        $("#btnSlsTrSalesOperation").click(() => { newtap = false; OpenPage(Modules.SlsTrSalesOperation); })
        $("#btnSlsTrShowPrice").click(() => { newtap = false; OpenPage(Modules.SlsTrShowPrice); })
        $("#btnPurOrder").click(() => { newtap = false; OpenPage(Modules.PurOrder); })
        $("#btnPurTrReceive").click(() => { newtap = false; OpenPage(Modules.PurTrReceive); })
        $("#btnPurTrReturn").click(() => { newtap = false; OpenPage(Modules.PurTrReturn); })
        $("#btnPurTrpaymemt").click(() => { newtap = false; OpenPage(Modules.PurTrpaymemt); })
        $("#btnProcesses").click(() => { newtap = false; OpenPage(Modules.Processes); })
        $("#btnSalesTrans").click(() => { newtap = false; OpenPage(Modules.SalesTrans); })
        $("#btnProcSalesRet").click(() => { newtap = false; OpenPage(Modules.ProcSalesRet); })
        $("#btnOperationExport").click(() => { newtap = false; OpenPage(Modules.OperationExport); })
        $("#btnOperationScrap").click(() => { newtap = false; OpenPage(Modules.OperationScrap); })
        $("#btnOperationRepScrap").click(() => { newtap = false; OpenPage(Modules.OperationRepScrap); })
        $("#btnProcSalesInvoice").click(() => { newtap = false; OpenPage(Modules.ProcSalesInvoice); })
        $("#btnProcSalesMgr").click(() => { newtap = false; OpenPage(Modules.ProcSalesMgr); })//
        $("#btnCloseProcesses").click(() => { newtap = false; OpenPage(Modules.CloseProcesses); })// 
        $("#btnClientaccstat").click(() => { newtap = false; OpenPage(Modules.Clientaccstat); })//
        $("#btnCollectedaccstat").click(() => { newtap = false; OpenPage(Modules.Collectedaccstat); })//
        $("#btnSupplieraccstat").click(() => { newtap = false; OpenPage(Modules.Supplieraccstat); })//
        $("#btnCashBoxAccount").click(() => { newtap = false; OpenPage(Modules.CashBoxAccount); })//
        $("#btnInventorymove").click(() => { newtap = false; OpenPage(Modules.Inventorymove); })//
        $("#btnInventoryvalue").click(() => { newtap = false; OpenPage(Modules.Inventoryvalue); })//
        $("#btnIncomeoperations").click(() => { newtap = false; OpenPage(Modules.Incomeoperations); })//  
        $("#btnItemsalesSum").click(() => { newtap = false; OpenPage(Modules.ItemsalesSum); })//
        $("#btnItemPurchase").click(() => { newtap = false; OpenPage(Modules.ItemPurchase); })//
        $("#btnIssueType").click(() => { newtap = false; OpenPage(Modules.IssueType); })//
        $("#btnIssueToCC").click(() => { newtap = false; OpenPage(Modules.IssueToCC); })// 
        $("#btnGLDefAccount").click(() => { newtap = false; OpenPage(Modules.GLDefAccount); })//
        $("#btnJournalVoucher").click(() => { newtap = false; OpenPage(Modules.JournalVoucher); })
        $("#btnReceiptVoucher").click(() => { newtap = false; OpenPage(Modules.ReceiptVoucher); })
        $("#btnPaymentVoucher").click(() => { newtap = false; OpenPage(Modules.PaymentVoucher); })
        $("#btnManagementVoucher").click(() => { newtap = false; OpenPage(Modules.ManagementVoucher); })//
        $("#btnCostCenter").click(() => { newtap = false; OpenPage(Modules.CostCenter); })//
        $("#btnAccountstatement").click(() => { newtap = false; OpenPage(Modules.Accountstatement); })//
        $("#btnAccountbalances").click(() => { newtap = false; OpenPage(Modules.Accountbalances); })// 
        $("#btnfinancialreports").click(() => { newtap = false; OpenPage(Modules.financialreports); })//
        $("#btnUSERS").click(() => { newtap = false; OpenPage(Modules.USERS); })//
        $("#btnTranPosting").click(() => { newtap = false; OpenPage(Modules.TranPosting); })//
        $("#btnLnkvarBranch").click(() => { newtap = false; OpenPage(Modules.LnkvarBranch); })//
        $("#btnLnkTransVoucher").click(() => { newtap = false; OpenPage(Modules.LnkTransVoucher); })// 
        $("#btnDirecttransfer").click(() => { newtap = false; OpenPage(Modules.Directtransfer); })
        $("#btnSTKAdjust").click(() => { newtap = false; OpenPage(Modules.STKAdjust); })
        $("#btnSTKOpeningbalance").click(() => { newtap = false; OpenPage(Modules.STKOpeningbalance); })
        $("#btnReceiveTransfer").click(() => { newtap = false; OpenPage(Modules.ReceiveTransfer); })
        $("#btnsendTransfer").click(() => { newtap = false; OpenPage(Modules.sendTransfer); })
        $("#btnGenDefAdd").click(() => { newtap = false; OpenPage(Modules.GenDefAdd); })
        $("#btnDefStore").click(() => { newtap = false; OpenPage(Modules.DefStore); })
        $("#btnServiceCategories").click(() => { newtap = false; OpenPage(Modules.ServiceCategories); })
        $("#btnServices").click(() => { newtap = false; OpenPage(Modules.Services); })
        $("#btnSales_Services").click(() => { newtap = false; OpenPage(Modules.Sales_Services); })
        $("#btnSer_Return_Sales").click(() => { newtap = false; OpenPage(Modules.Ser_Return_Sales); })
        $("#btnSer_Purchasing").click(() => { newtap = false; OpenPage(Modules.Ser_Purchasing); })
        $("#btnSer_Return_Pur").click(() => { newtap = false; OpenPage(Modules.Ser_Return_Pur); })
        $("#btnSer_Sales_Report").click(() => { newtap = false; OpenPage(Modules.Ser_Sales_Report); })
        $("#btnSer_Pur_Report").click(() => { newtap = false; OpenPage(Modules.Ser_Pur_Report); })
        $("#btnVatLists").click(() => { newtap = false; OpenPage(Modules.VatLists); })
        $("#btnVatReport").click(() => { newtap = false; OpenPage(Modules.VatReport); })
        $("#btnVatSetting").click(() => { newtap = false; OpenPage(Modules.VatSetting); })
        $("#btnDtcostcenter").click(() => { newtap = false; OpenPage(Modules.Dtcostcenter); })
        $("#btnCcdtAccState").click(() => { newtap = false; OpenPage(Modules.CcdtAccState); })
        $("#btnCollectUnit").click(() => { newtap = false; OpenPage(Modules.CollectUnit); })


        //------------------------------------------------------------------------- N E W T A B -------------------------------------


        $("#btnHomeT").click(() => { newtap = true; OpenPage(Modules.Home); })
        $("#btnStkDefItemsT").click(() => { newtap = true; OpenPage(Modules.StkDefItems); })
        $("#btnStkDefItemsNewT").click(() => { newtap = true; OpenPage(Modules.StkDefItemsNew); })
        $("#btnStkDefCategoryT").click(() => { newtap = true; OpenPage(Modules.StkDefCategory); })
        $("#btnPeriodManagementT").click(() => { newtap = true; OpenPage(Modules.PeriodManagement); })//
        $("#btnItemPeriodSummaryT").click(() => { newtap = true; OpenPage(Modules.ItemPeriodSummary); })//
        $("#btnStkDefUnitT").click(() => { newtap = true; OpenPage(Modules.StkDefUnit); })
        $("#btnStkDefItemTypeT").click(() => { newtap = true; OpenPage(Modules.StkDefItemType); })
        $("#btnStkDefStoreT").click(() => { newtap = true; OpenPage(Modules.StkDefStore); })
        $("#btnDashboardT").click(() => { newtap = true; OpenPage(Modules.Dashboard); })
        $("#btnAccDefVendorT").click(() => { newtap = true; OpenPage(Modules.AccDefVendor); })
        $("#btnAccDefCustomerT").click(() => { newtap = true; OpenPage(Modules.AccDefCustomer); })
        $("#btnAccDefSalesmenT").click(() => { newtap = true; OpenPage(Modules.AccDefSalesmen); })
        $("#btnAccDefBoxT").click(() => { newtap = true; OpenPage(Modules.AccDefBox); })
        $("#btnAccDefExpensesT").click(() => { newtap = true; OpenPage(Modules.AccDefExpenses); })
        $("#btnAccDefReceiptsT").click(() => { newtap = true; OpenPage(Modules.AccDefReceipts); })
        $("#btnCashBankAccountT").click(() => { newtap = true; OpenPage(Modules.CashBankAccount); })
        $("#btnAgingCustT").click(() => { newtap = true; OpenPage(Modules.AgingCust); })//
        $("#btnAgingVendT").click(() => { newtap = true; OpenPage(Modules.AgingVend); })//
        $("#btnGenDefCustomerCatT").click(() => { newtap = true; OpenPage(Modules.GenDefCustomerCat); })
        $("#btnGendefCustomerGroupT").click(() => { newtap = true; OpenPage(Modules.GendefCustomerGroup); })
        $("#btnGenDefCustomerAdjustT").click(() => { newtap = true; OpenPage(Modules.GenDefCustomerAdjust); })
        $("#btnGenDefVendorCatT").click(() => { newtap = true; OpenPage(Modules.GenDefVendorCat); })
        $("#btnGendefVendorGroupT").click(() => { newtap = true; OpenPage(Modules.GendefVendorGroup); })
        $("#btnGenDefVendorAdjustT").click(() => { newtap = true; OpenPage(Modules.GenDefVendorAdjust); })
        $("#btnAccTrInvReceiptT").click(() => { newtap = true; OpenPage(Modules.AccTrInvReceipt); })
        $("#btnAccTrReceiptNoteT").click(() => { newtap = true; OpenPage(Modules.AccTrReceiptNote); })
        $("#btnAccTrPaymentNoteT").click(() => { newtap = true; OpenPage(Modules.AccTrPaymentNote); })
        $("#btnAccTrCustomerAdjustT").click(() => { newtap = true; OpenPage(Modules.AccTrCustomerAdjust); })
        $("#btnAccTrVendorAdjustT").click(() => { newtap = true; OpenPage(Modules.AccTrVendorAdjust); })
        $("#btnSlsTrSalesT").click(() => { newtap = true; OpenPage(Modules.SlsTrSales); })
        $("#btnSlsTrReturnT").click(() => { newtap = true; OpenPage(Modules.SlsTrReturn); })
        $("#btnSlsTrReturnOperationT").click(() => { newtap = true; OpenPage(Modules.SlsTrReturnOperation); })
        $("#btnSlsTrReturnNewT").click(() => { newtap = true; OpenPage(Modules.SlsTrReturnNew); })
        $("#btnSlsTrSalesManagerT").click(() => { newtap = true; OpenPage(Modules.SlsTrSalesManager); })
        $("#btnSlsTrSalesManagerNewT").click(() => { newtap = true; OpenPage(Modules.SlsTrSalesManagerNew); })
        $("#btnSlsTrSalesOperationT").click(() => { newtap = true; OpenPage(Modules.SlsTrSalesOperation); })
        $("#btnSlsTrShowPriceT").click(() => { newtap = true; OpenPage(Modules.SlsTrShowPrice); })
        $("#btnPurOrderT").click(() => { newtap = true; OpenPage(Modules.PurOrder); })
        $("#btnPurTrReceiveT").click(() => { newtap = true; OpenPage(Modules.PurTrReceive); })
        $("#btnPurTrReturnT").click(() => { newtap = true; OpenPage(Modules.PurTrReturn); })
        $("#btnPurTrpaymemtT").click(() => { newtap = true; OpenPage(Modules.PurTrpaymemt); })
        $("#btnProcessesT").click(() => { newtap = true; OpenPage(Modules.Processes); })
        $("#btnSalesTransT").click(() => { newtap = true; OpenPage(Modules.SalesTrans); })
        $("#btnProcSalesRetT").click(() => { newtap = true; OpenPage(Modules.ProcSalesRet); })
        $("#btnOperationExportT").click(() => { newtap = true; OpenPage(Modules.OperationExport); })
        $("#btnOperationScrapT").click(() => { newtap = true; OpenPage(Modules.OperationScrap); })
        $("#btnOperationRepScrapT").click(() => { newtap = true; OpenPage(Modules.OperationRepScrap); })
        $("#btnProcSalesInvoiceT").click(() => { newtap = true; OpenPage(Modules.ProcSalesInvoice); })
        $("#btnProcSalesMgrT").click(() => { newtap = true; OpenPage(Modules.ProcSalesMgr); })//
        $("#btnCloseProcessesT").click(() => { newtap = true; OpenPage(Modules.CloseProcesses); })// 
        $("#btnClientaccstatT").click(() => { newtap = true; OpenPage(Modules.Clientaccstat); })//
        $("#btnCollectedaccstatT").click(() => { newtap = true; OpenPage(Modules.Collectedaccstat); })//
        $("#btnSupplieraccstatT").click(() => { newtap = true; OpenPage(Modules.Supplieraccstat); })//
        $("#btnCashBoxAccountT").click(() => { newtap = true; OpenPage(Modules.CashBoxAccount); })//
        $("#btnInventorymoveT").click(() => { newtap = true; OpenPage(Modules.Inventorymove); })//
        $("#btnInventoryvalueT").click(() => { newtap = true; OpenPage(Modules.Inventoryvalue); })//
        $("#btnIncomeoperationsT").click(() => { newtap = true; OpenPage(Modules.Incomeoperations); })//  
        $("#btnItemsalesSumT").click(() => { newtap = true; OpenPage(Modules.ItemsalesSum); })//
        $("#btnItemPurchaseT").click(() => { newtap = true; OpenPage(Modules.ItemPurchase); })//
        $("#btnIssueTypeT").click(() => { newtap = true; OpenPage(Modules.IssueType); })//
        $("#btnIssueToCCT").click(() => { newtap = true; OpenPage(Modules.IssueToCC); })// 
        $("#btnGLDefAccountT").click(() => { newtap = true; OpenPage(Modules.GLDefAccount); })//
        $("#btnJournalVoucherT").click(() => { newtap = true; OpenPage(Modules.JournalVoucher); })
        $("#btnReceiptVoucherT").click(() => { newtap = true; OpenPage(Modules.ReceiptVoucher); })
        $("#btnPaymentVoucherT").click(() => { newtap = true; OpenPage(Modules.PaymentVoucher); })
        $("#btnManagementVoucherT").click(() => { newtap = true; OpenPage(Modules.ManagementVoucher); })//
        $("#btnCostCenterT").click(() => { newtap = true; OpenPage(Modules.CostCenter); })//
        $("#btnAccountstatementT").click(() => { newtap = true; OpenPage(Modules.Accountstatement); })//
        $("#btnAccountbalancesT").click(() => { newtap = true; OpenPage(Modules.Accountbalances); })// 
        $("#btnfinancialreportsT").click(() => { newtap = true; OpenPage(Modules.financialreports); })//
        $("#btnUSERST").click(() => { newtap = true; OpenPage(Modules.USERS); })//
        $("#btnTranPostingT").click(() => { newtap = true; OpenPage(Modules.TranPosting); })//
        $("#btnLnkvarBranchT").click(() => { newtap = true; OpenPage(Modules.LnkvarBranch); })//
        $("#btnLnkTransVoucherT").click(() => { newtap = true; OpenPage(Modules.LnkTransVoucher); })// 
        $("#btnDirecttransferT").click(() => { newtap = true; OpenPage(Modules.Directtransfer); })
        $("#btnSTKAdjustT").click(() => { newtap = true; OpenPage(Modules.STKAdjust); })
        $("#btnSTKOpeningbalanceT").click(() => { newtap = true; OpenPage(Modules.STKOpeningbalance); })
        $("#btnReceiveTransferT").click(() => { newtap = true; OpenPage(Modules.ReceiveTransfer); })
        $("#btnsendTransferT").click(() => { newtap = true; OpenPage(Modules.sendTransfer); })
        $("#btnGenDefAddT").click(() => { newtap = true; OpenPage(Modules.GenDefAdd); })
        $("#btnDefStoreT").click(() => { newtap = true; OpenPage(Modules.DefStore); })
        $("#btnServiceCategoriesT").click(() => { newtap = true; OpenPage(Modules.ServiceCategories); })
        $("#btnServicesT").click(() => { newtap = true; OpenPage(Modules.Services); })
        $("#btnSales_ServicesT").click(() => { newtap = true; OpenPage(Modules.Sales_Services); })
        $("#btnSer_Return_SalesT").click(() => { newtap = true; OpenPage(Modules.Ser_Return_Sales); })
        $("#btnSer_PurchasingT").click(() => { newtap = true; OpenPage(Modules.Ser_Purchasing); })
        $("#btnSer_Return_PurT").click(() => { newtap = true; OpenPage(Modules.Ser_Return_Pur); })
        $("#btnSer_Sales_ReportT").click(() => { newtap = true; OpenPage(Modules.Ser_Sales_Report); })
        $("#btnSer_Pur_ReportT").click(() => { newtap = true; OpenPage(Modules.Ser_Pur_Report); })
        $("#btnVatListsT").click(() => { newtap = true; OpenPage(Modules.VatLists); })
        $("#btnVatReportT").click(() => { newtap = true; OpenPage(Modules.VatReport); })
        $("#btnVatSettingT").click(() => { newtap = true; OpenPage(Modules.VatSetting); })
        $("#btnDtcostcenterT").click(() => { newtap = true; OpenPage(Modules.Dtcostcenter); })
        $("#btnCcdtAccStateT").click(() => { newtap = true; OpenPage(Modules.CcdtAccState); })
        $("#btnCollectUnitT").click(() => { newtap = true; OpenPage(Modules.CollectUnit); })



    }

    function Notifications_Message() {

        let comCode = SysSession.CurrentEnvironment.CompCode;
        let BraCode = SysSession.CurrentEnvironment.BranchCode;
        let SystemCode = SysSession.CurrentEnvironment.SystemCode;
        let SubSystemCode = SysSession.CurrentEnvironment.SubSystemCode;

        $.ajax({
            type: "GET",
            url: sys.apiUrl("SystemTools", "GetNotifications_Message"),
            // data: { comCode: comCode, SystemCode: SystemCode },
            async: false,
            success: (d) => {

                let massg = d as KQ_GetAlertNoteLog[];
                let ulcontent = "";
                $("#creatnotesmassg").html("");
                for (let ms of massg) {
                    let li = document.createElement("li");
                    let span = document.createElement("span");
                    let span2 = document.createElement("span");
                    let span3 = document.createElement("span");
                    let span4 = document.createElement("span");
                    li.id = ms.AlertID.toString();
                    if (ms.NoteSubType == 1) {
                        li.className = "liItem disabledLi dropdown cursor border_li style_li1";
                    } else {
                        li.className = "liItem disabledLi dropdown cursor border_li style_li2";
                    }
                    span.innerText = ms.MsgText;
                    span.className = 'bading_left font_mseeg';
                    span2.className = 'col-lg-12 font_mseeg';
                    span3.className = 'col-lg-12 font_mseeg';
                    span4.className = 'col-lg-12 font_mseeg';
                    span2.innerText = DateTimeFormat(ms.MsgDate);
                    li.appendChild(span);
                    li.appendChild(span2);
                    li.appendChild(span3);
                    li.appendChild(span4);
                    $("#creatnotesmassg").append(li);

                }

            }
        });
    }
    //By Muhammad Rajab
    export function Language() {
        if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
            RemoveStyleSheet("bootstrap-rtl");
            //RemoveStyleSheet("responsive_AR");
            //RemoveStylejs("mainAR");
            //RemoveStyleSheet("Style_Arabic");
            //RemoveStyleSheet("style");
            //RemoveStyleSheet("StyleNewmassege");
            //$("#bootstrap_rtl").remove();
            //$("#Style_Arabic").remove();

            //AppendStyleSheet("bootstrap.min");
            //AppendStylejs("main");
            //AppendStyleSheet("responsive");
            //AppendStyleSheet("StyleEn");
            SysSession.CurrentEnvironment.ScreenLanguage = "en"
            $("#btn_loguotuser").text("Logout");
        }
        else {
            //RemoveStyleSheet("StyleEn");
            //RemoveStyleSheet("bootstrap.min");
            //RemoveStylejs("main");
            //RemoveStyleSheet("responsive");

            AppendStyleSheet("bootstrap-rtl");
            //AppendStyleSheet("StyleNewmassege");
            //AppendStylejs("mainAR");
            //AppendStyleSheet("style");
            //AppendStyleSheet("Style_Arabic");
            //AppendStyleSheet("responsive_AR");
            //$('#langImg').attr('src', '../images/english.png');
            SysSession.CurrentEnvironment.ScreenLanguage = "ar"

            $("#btn_loguotuser").text("الخروج من النظام")
        }
        //$("#SearchBox").draggable();
        App.Startup();
    }

    function AppendStyleSheet(fileName) {
        var lnk = document.createElement('link');
        lnk.href = "../Style_design/" + fileName + ".css";
        lnk.rel = 'stylesheet';
        lnk.type = 'text/css';
        document.getElementsByTagName("head")[0].appendChild(lnk);
    }
    function RemoveStyleSheet(fileName) {
        var href = "../Style_design/" + fileName + ".css";
        $("link[rel=stylesheet][href~='" + href + "']").remove();
    }
    //By Muhammad Rajab 
    function AppendStylejs(fileName) {

        var script = document.createElement('script');
        script.src = "../Style_design/" + fileName + ".js";
        document.getElementById("caret_script").appendChild(script);
    }
    //By Muhammad Rajab 
    function RemoveStylejs(fileName) {
        var href = "../Style_design/" + fileName + ".js";
        $("<script src=" + href + " ></script>").remove();
    }
    function ScreenHelp() {
        let ModuleCode = SysSession.CurrentPrivileges.MODULE_CODE;
        // 

        $.ajax({
            type: "GET",
            url: sys.apiUrl("SystemTools", "GetHelp"),
            data: { ModuleCode: ModuleCode },
            async: false,
            success: (d) => {
                // ;
                let result = d as BaseResponse;
                let res = result.Response as G_ModuleHelp;
                if (res != null) {
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
                        $("#modalHelpRep").html(`<div style="direction:rtl;height: 289px;overflow: scroll;overflow-x: hidden;font-weight: bold;" >` + res.HelpBody_Ar + `</div>`);
                    }
                    else {
                        $("#modalHelpRep").html(`<div style="direction:ltr;height: 289px;overflow: scroll;overflow-x: hidden;font-weight: bold;">` + res.HelpBody_En + `</div>`);
                    }
                }
            }


        });

    }


}
