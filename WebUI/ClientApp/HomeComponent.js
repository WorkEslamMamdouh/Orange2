$(document).ready(function () {
    try {
        HomeComponent.InitalizeComponent();
    }
    catch (e) {
        window.open(Url.Action("HomePage", "Login"), "_self");
    }
});
var HomeComponent;
(function (HomeComponent) {
    //let res: any = GetResourceList("");d
    debugger;
    var sys = new SystemTools();
    var ddbra;
    ddbra = document.getElementById("ddbra");
    var SelectSession;
    var btnDashboard;
    var btn_loguotuser;
    var SysSession = GetSystemSession('Home');
    var systemEnv = SysSession.CurrentEnvironment;
    var G_BRANCHService = new Array();
    var selectedbar;
    var newtap = false;
    G_BRANCHService = GetSystemG_BRANCH();
    debugger;
    $('Li').addClass('animate__animated animate__fadeInTopRight');
    $('#logOrg').addClass('animate__animated animate__backInDown');
    //$('#PageLodes').addClass('animate__animated animate__bounceInUp');
    setTimeout(function () {
        $('#Uesr_out').removeClass('animate__backInDown');
        $('#Uesr_out').removeClass('animate__animated');
        $('.mes').removeClass('display_none');
    }, 1000);
    function OpenPage(moduleCode) {
        SysSession.CurrentEnvironment.ModuleCode = moduleCode;
        // // ;
        var compCode = SysSession.CurrentEnvironment.CompCode;
        var branchCode = SysSession.CurrentEnvironment.BranchCode;
        var UserCode = SysSession.CurrentEnvironment.UserCode;
        var SystemCode = SysSession.CurrentEnvironment.SystemCode;
        var SubSystemCode = SysSession.CurrentEnvironment.SubSystemCode;
        var Modulecode = SysSession.CurrentEnvironment.ModuleCode;
        var CurrentYear = SysSession.CurrentEnvironment.CurrentYear;
        if (newtap == true) {
            window.open(Url.Action(moduleCode + "Index", "Home"), "_blank");
        }
        else {
            window.open(Url.Action(moduleCode + "Index", "Home"), "_self");
        }
        //window.open(Url.Action(moduleCode + "Index", "Home"), "_self");
        //Ajax.Callsync({
        //    type: "GET",
        //    url: sys.apiUrl("SystemTools", "GetUserPrivilage"),
        //    data: { year: Number(CurrentYear), compCode: compCode, branchCode: branchCode, UserCode: UserCode, SystemCode: SystemCode, Modulecode: Modulecode },
        //    success: (d) => {
        //        if (d == undefined) {
        //            window.open(Url.Action("HomePage", "Login"), "_self");
        //            return;
        //        }
        //        else {
        //            let result = JSON.parse(d) as UserPrivilege;
        //            if (result == null) {
        //                MessageBox.Show("Access denied", moduleCode);
        //                return;
        //            }
        //            if (result.Access == true) {
        //                SysSession.CurrentPrivileges = result;
        //                if (newtap == true) {
        //                    window.open(Url.Action(moduleCode + "Index", "Home"), "_blank");
        //                }
        //                else {
        //                    window.open(Url.Action(moduleCode + "Index", "Home"), "_self");
        //                }
        //                OpenScreen(SysSession.CurrentEnvironment.UserCode, SysSession.CurrentEnvironment.CompCode, SysSession.CurrentEnvironment.BranchCode, moduleCode, SysSession.CurrentEnvironment.CurrentYear);
        //            }
        //            else {
        //                MessageBox.Show("No Inv1_Privilage", moduleCode);
        //            }
        //        }
        //    }
        //});
    }
    HomeComponent.OpenPage = OpenPage;
    function OpenReportsPopup(moduleCode) {
        SysSession.CurrentEnvironment.ModuleCode = moduleCode;
        var compCode = SysSession.CurrentEnvironment.CompCode;
        var branchCode = SysSession.CurrentEnvironment.BranchCode;
        var UserCode = SysSession.CurrentEnvironment.UserCode;
        var SystemCode = SysSession.CurrentEnvironment.SystemCode;
        var SubSystemCode = SysSession.CurrentEnvironment.SubSystemCode;
        var Modulecode = SysSession.CurrentEnvironment.ModuleCode;
        Ajax.CallAsync({
            url: sys.apiUrl("SystemTools", "GetUserPrivilage"),
            data: { compCode: compCode, branchCode: branchCode, UserCode: UserCode, SystemCode: SystemCode, SubSystemCode: SubSystemCode, Modulecode: Modulecode },
            success: function (d) {
                if (d == undefined) {
                    window.open(Url.Action("HomePage", "Login"), "_self");
                    return;
                }
                else {
                    var result = JSON.parse(d);
                    if (result == null) {
                        MessageBox.Show("Access denied", "GeneralReports");
                        return;
                    }
                    if (result.Access == true) {
                        var opt = {
                            url: Url.Action(moduleCode, "GeneralReports"),
                            success: function (d) {
                                var result = d;
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
    HomeComponent.OpenReportsPopup = OpenReportsPopup;
    function OutSessionTimer() {
        if (SelectSession.value == '2') {
            LogoutUserApi();
        }
    }
    function InitalizeComponent() {
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
        SelectSession = document.getElementById('SelectSession');
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
        btn_loguotuser = DocumentActions.GetElementById("btn_loguotuser");
        var loguotuser = DocumentActions.GetElementById("loguotuser");
        loguotuser.onclick = LogoutUserApi;
        //CheckTime(); 
        $("#LanguageButtonHome").click(function () {
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
        $(window).scroll(function () {
            var backtotop = $('.back-to-top');
            if (window.scrollY > 10) {
                backtotop.addClass('active');
            }
            else {
                backtotop.removeClass('active');
            }
        });
        Cheak_UserTokenlog();
        //alert(SysSession.CurrentEnvironment.DbName);
        var isNews = localStorage.getItem("Show_News");
        if (isNews == 'false') {
            Show_News();
        }
        $('#btnNews').click(function (e) { Show_News(); });
    }
    HomeComponent.InitalizeComponent = InitalizeComponent;
    function Getbranch() {
        var lang = SysSession.CurrentEnvironment.Language;
        for (var i = 0; i < G_BRANCHService.length; i++) {
            $('#ddbra').append('<option value="' + G_BRANCHService[i].BRA_CODE + '">' + (lang == "ar" ? "  " + G_BRANCHService[i].BRA_CODE + " - " + G_BRANCHService[i].BRA_DESC : "  " + G_BRANCHService[i].BRA_CODE + " - " + G_BRANCHService[i].BRA_DESCE) + '</option>');
        }
        $('#ddbra').val(SysSession.CurrentEnvironment.BranchCode);
    }
    function LogoutUserApi() {
        var userCode = SysSession.CurrentEnvironment.UserCode;
        Ajax.Callsync({
            type: "GET",
            url: sys.apiUrl("G_USERS", "LogoutUser"),
            data: { user: userCode },
            success: function (d) {
                // // ;
                if (d !== undefined) {
                    window.open(Url.Action("HomePage", "Login"), "_self");
                    return;
                }
            }
        });
    }
    HomeComponent.LogoutUserApi = LogoutUserApi;
    ;
    function ApplyCompanyPrivilages() {
        if (systemEnv.IsDashboardActive == false) {
            // disable dashboard button
            btnDashboard = DocumentActions.GetElementById("btnDashboard");
            btnDashboard.style.display = "none";
        }
    }
    function ApplyModules() {
        var lis = document.getElementsByClassName("liItem");
        var obj = [document.getElementById('liItem')];
        var modules = new Array();
        var compCode = SysSession.CurrentEnvironment.CompCode;
        var branchCode = SysSession.CurrentEnvironment.BranchCode;
        var UserCode = SysSession.CurrentEnvironment.UserCode;
        var SystemCode = SysSession.CurrentEnvironment.SystemCode;
        var SubSystemCode = SysSession.CurrentEnvironment.SubSystemCode;
        var CurrentYear = SysSession.CurrentEnvironment.CurrentYear;
        Ajax.Callsync({
            type: "GET",
            url: sys.apiUrl("SystemTools", "GetAllUserPrivilage"),
            async: false,
            data: { year: Number(CurrentYear), compCode: Number(compCode), branchCode: Number(branchCode), UserCode: UserCode, SystemCode: SystemCode, SubSystemCode: SubSystemCode },
            success: function (d) {
                modules = d;
            }
        });
        // filter moulules where isavailable = false or access = false 
        var li;
        var li_T;
        for (var i = 0; i < modules.length; i++) {
            var singleUserModule = modules[i];
            //Notification control
            if (singleUserModule.MODULE_CODE.substring(0, 5) == "Note_") {
                li = document.getElementById(singleUserModule.MODULE_CODE);
            }
            else if (singleUserModule.MODULE_CODE.substring(0, 4) == "tol_") {
                li = document.getElementById(singleUserModule.MODULE_CODE);
            }
            else {
                li = document.getElementById("btn" + singleUserModule.MODULE_CODE);
                li_T = document.getElementById("btn" + singleUserModule.MODULE_CODE + "T");
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
                        var key = li.getAttribute("key");
                        li.style.display = "";
                        li_T.style.display = "";
                        li.className = "liItem";
                        li_T.className = "liItem";
                    }
                }
                catch (e) {
                }
            }
            else {
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
        var comCode = SysSession.CurrentEnvironment.CompCode;
        var BraCode = SysSession.CurrentEnvironment.BranchCode;
        var SystemCode = SysSession.CurrentEnvironment.SystemCode;
        var SubSystemCode = SysSession.CurrentEnvironment.SubSystemCode;
        var yearid = SysSession.CurrentEnvironment.CurrentYear;
        var PeriodinSec = SysSession.CurrentEnvironment.I_Control[0].NotePeriodinSec;
        Ajax.Callsync({
            type: "GET",
            url: sys.apiUrl("SystemTools", "GetNotifications"),
            data: { comCode: comCode, BraCode: BraCode, yearid: yearid, SystemCode: SystemCode, SubSystemCode: SubSystemCode },
            async: false,
            success: function (d) {
                var not = d;
                var ulcontent = "";
                $("#notificationUL").html("");
                var _loop_1 = function (n) {
                    var li = document.createElement("li");
                    var span = document.createElement("span");
                    var span2 = document.createElement("span");
                    if (n.NoteCount > 0) {
                        li.onclick = function () {
                            notification_onclick(n.MODULE_CODE, n.MODULE_CODE);
                        };
                    }
                    li.className = "liItem disabledLi dropdown cursor";
                    li.id = n.MODULE_CODE;
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
                        span.innerText = n.MODULE_DESCA;
                    }
                    else {
                        span.innerText = n.MODULE_DESCE;
                    }
                    span2.className = 'price';
                    span.className = 'bading_left';
                    span2.innerText = n.NoteCount.toString();
                    li.appendChild(span);
                    li.appendChild(span2);
                    $("#notificationUL").append(li);
                };
                for (var _i = 0, not_1 = not; _i < not_1.length; _i++) {
                    var n = not_1[_i];
                    _loop_1(n);
                }
                setTimeout(GetNotificationData, PeriodinSec * 1000);
            }
        });
    }
    function notification_onclick(ModuleCode, btnName) {
        var sys = new SystemTools();
        var condation = "CompCode = " + SysSession.CurrentEnvironment.CompCode + " and BranchCode = " + SysSession.CurrentEnvironment.BranchCode + "and finyear = " + SysSession.CurrentEnvironment.CurrentYear;
        //if (ModuleCode == "Note_openinvoice")
        //    condation = condation + "  and Status = 0";
        //else if (ModuleCode == "Note_openreceipt") 
        //    condation = condation + "  and Status = 0 and TrType =1";
        //else if (ModuleCode == "Note_openopration") 
        //    condation = condation + "  and Status = 0 ";
        //else if (ModuleCode == "Note_openpaymnt")
        //    condation = condation + "  and Status = 0 and TrType =2";
        sys.FindKey(ModuleCode, btnName, condation, function () {
        });
    }
    function UpdateNotificationAndSendMsg() {
        if (SysSession.CurrentEnvironment.IsNotificaitonActive == true) {
            var PeriodinSec = SysSession.CurrentEnvironment.I_Control[0].NotePeriodinSec;
            var comCode = SysSession.CurrentEnvironment.CompCode;
            var BraCode = SysSession.CurrentEnvironment.BranchCode;
            var SystemCode = SysSession.CurrentEnvironment.SystemCode;
            var SubSystemCode = SysSession.CurrentEnvironment.SubSystemCode;
            Ajax.Callsync({
                type: "GET",
                url: sys.apiUrl("SystemTools", "UpdateNotificationAndSndMsg"),
                data: { comCode: comCode, BraCode: BraCode, SystemCode: SystemCode, SubSystemCode: SubSystemCode },
                success: function (d) {
                    GetNotificationData();
                    ApplyModules();
                    setTimeout(UpdateNotificationAndSendMsg, PeriodinSec * 1000);
                }
            });
        }
    }
    function HomePrev(controllerName, moduleCode) {
        var compCode = SysSession.CurrentEnvironment.CompCode;
        var branchCode = SysSession.CurrentEnvironment.BranchCode;
        var UserCode = SysSession.CurrentEnvironment.UserCode;
        var SystemCode = SysSession.CurrentEnvironment.SystemCode;
        var SubSystemCode = SysSession.CurrentEnvironment.SubSystemCode;
        var Modulecode = SysSession.CurrentEnvironment.ModuleCode;
        Ajax.Callsync({
            url: sys.apiUrl("SystemTools", "GetUserPrivilage"),
            data: { compCode: compCode, branchCode: branchCode, UserCode: UserCode, SystemCode: SystemCode, SubSystemCode: SubSystemCode, Modulecode: moduleCode },
            success: function (d) {
                if (d == undefined) {
                    window.open(Url.Action("HomePage", "Login"), "_self");
                    return;
                }
                else {
                    var result = JSON.parse(d);
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
    HomeComponent.HomePrev = HomePrev;
    function OpenView(controllerName, moduleCode) {
        // ;
        SysSession.CurrentEnvironment.ModuleCode = moduleCode;
        var compCode = SysSession.CurrentEnvironment.CompCode;
        var branchCode = SysSession.CurrentEnvironment.BranchCode;
        var UserCode = SysSession.CurrentEnvironment.UserCode;
        var SystemCode = SysSession.CurrentEnvironment.SystemCode;
        var SubSystemCode = SysSession.CurrentEnvironment.SubSystemCode;
        var Modulecode = SysSession.CurrentEnvironment.ModuleCode;
        var CurrentYear = SysSession.CurrentEnvironment.CurrentYear;
        localStorage.setItem("Compcode1", compCode);
        window.open(Url.Action(controllerName + "Index", controllerName), "_self");
        //Ajax.Callsync({
        //    url: sys.apiUrl("SystemTools", "GetAllUserPrivilage"),
        //    data: { compCode: compCode, branchCode: branchCode, UserCode: UserCode, SystemCode: SystemCode, SubSystemCode: SubSystemCode, Modulecode: Modulecode },
        //    success: (d) => {
        //        // ;
        //        if (d == undefined) {
        //            window.open(Url.Action("HomePage", "Login"), "_self");
        //            return;
        //        }
        //        else {
        //            let result = JSON.parse(d) as UserPrivilege;
        //            if (result == null) {
        //                MessageBox.Show("Access denied", controllerName);
        //                return;
        //            }
        //            if (result.Access == true) {
        //                $("#spnFav").css("display", "inline-block");
        //                SysSession.CurrentPrivileges = result;
        //                SysSession.CurrentPrivileges.MODULE_CODE = SysSession.CurrentEnvironment.ModuleCode;
        //                sessionStorage.setItem("MODU_CODE", SysSession.CurrentEnvironment.ModuleCode);
        //                systemEnv.ScreenLanguage = sessionStorage.getItem("temp_lang");
        //                document.cookie = "Privilage=" + JSON.stringify(d).toString() + ";expires=Fri, 31 Dec 2030 23:59:59 GMT;path=/";
        //                window.open(Url.Action(controllerName + "Index", controllerName), "_self");
        //            }
        //            else {
        //                MessageBox.Show("Access denied", controllerName);
        //            }
        //        }
        //    }
        //});
    }
    HomeComponent.OpenView = OpenView;
    function InitializePages() {
        $("#btnHome").click(function () { newtap = false; OpenPage(Modules.Home); });
        $("#btnStkDefItems").click(function () { newtap = false; OpenPage(Modules.StkDefItems); });
        $("#btnStkDefItemsNew").click(function () { newtap = false; OpenPage(Modules.StkDefItemsNew); });
        $("#btnStkDefCategory").click(function () { newtap = false; OpenPage(Modules.StkDefCategory); });
        $("#btnPeriodManagement").click(function () { newtap = false; OpenPage(Modules.PeriodManagement); }); //
        $("#btnItemPeriodSummary").click(function () { newtap = false; OpenPage(Modules.ItemPeriodSummary); }); //
        $("#btnStkDefUnit").click(function () { newtap = false; OpenPage(Modules.StkDefUnit); });
        $("#btnStkDefItemType").click(function () { newtap = false; OpenPage(Modules.StkDefItemType); });
        $("#btnStkDefStore").click(function () { newtap = false; OpenPage(Modules.StkDefStore); });
        $("#btnDashboard").click(function () { newtap = false; OpenPage(Modules.Dashboard); });
        $("#btnAccDefVendor").click(function () { newtap = false; OpenPage(Modules.AccDefVendor); });
        $("#btnAccDefCustomer").click(function () { newtap = false; OpenPage(Modules.AccDefCustomer); });
        $("#btnAccDefSalesmen").click(function () { newtap = false; OpenPage(Modules.AccDefSalesmen); });
        $("#btnAccDefBox").click(function () { newtap = false; OpenPage(Modules.AccDefBox); });
        $("#btnAccDefExpenses").click(function () { newtap = false; OpenPage(Modules.AccDefExpenses); });
        $("#btnAccDefReceipts").click(function () { newtap = false; OpenPage(Modules.AccDefReceipts); });
        $("#btnCashBankAccount").click(function () { newtap = false; OpenPage(Modules.CashBankAccount); });
        $("#btnAgingCust").click(function () { newtap = false; OpenPage(Modules.AgingCust); }); //
        $("#btnAgingVend").click(function () { newtap = false; OpenPage(Modules.AgingVend); }); //
        $("#btnGenDefCustomerCat").click(function () { newtap = false; OpenPage(Modules.GenDefCustomerCat); });
        $("#btnGendefCustomerGroup").click(function () { newtap = false; OpenPage(Modules.GendefCustomerGroup); });
        $("#btnGenDefCustomerAdjust").click(function () { newtap = false; OpenPage(Modules.GenDefCustomerAdjust); });
        $("#btnGenDefVendorCat").click(function () { newtap = false; OpenPage(Modules.GenDefVendorCat); });
        $("#btnGendefVendorGroup").click(function () { newtap = false; OpenPage(Modules.GendefVendorGroup); });
        $("#btnGenDefVendorAdjust").click(function () { newtap = false; OpenPage(Modules.GenDefVendorAdjust); });
        $("#btnAccTrInvReceipt").click(function () { newtap = false; OpenPage(Modules.AccTrInvReceipt); });
        $("#btnAccTrReceiptNote").click(function () { newtap = false; OpenPage(Modules.AccTrReceiptNote); });
        $("#btnAccTrPaymentNote").click(function () { newtap = false; OpenPage(Modules.AccTrPaymentNote); });
        $("#btnAccTrCustomerAdjust").click(function () { newtap = false; OpenPage(Modules.AccTrCustomerAdjust); });
        $("#btnAccTrVendorAdjust").click(function () { newtap = false; OpenPage(Modules.AccTrVendorAdjust); });
        $("#btnSlsTrSales").click(function () { newtap = false; OpenPage(Modules.SlsTrSales); });
        $("#btnSlsTrReturn").click(function () { newtap = false; OpenPage(Modules.SlsTrReturn); });
        $("#btnSlsTrReturnOperation").click(function () { newtap = false; OpenPage(Modules.SlsTrReturnOperation); });
        $("#btnSlsTrReturnNew").click(function () { newtap = false; OpenPage(Modules.SlsTrReturnNew); });
        $("#btnSlsTrSalesManager").click(function () { newtap = false; OpenPage(Modules.SlsTrSalesManager); });
        $("#btnSlsTrSalesManagerNew").click(function () { newtap = false; OpenPage(Modules.SlsTrSalesManagerNew); });
        $("#btnSlsTrSalesOperation").click(function () { newtap = false; OpenPage(Modules.SlsTrSalesOperation); });
        $("#btnSlsTrShowPrice").click(function () { newtap = false; OpenPage(Modules.SlsTrShowPrice); });
        $("#btnPurOrder").click(function () { newtap = false; OpenPage(Modules.PurOrder); });
        $("#btnPurTrReceive").click(function () { newtap = false; OpenPage(Modules.PurTrReceive); });
        $("#btnPurTrReturn").click(function () { newtap = false; OpenPage(Modules.PurTrReturn); });
        $("#btnPurTrpaymemt").click(function () { newtap = false; OpenPage(Modules.PurTrpaymemt); });
        $("#btnProcesses").click(function () { newtap = false; OpenPage(Modules.Processes); });
        $("#btnSalesTrans").click(function () { newtap = false; OpenPage(Modules.SalesTrans); });
        $("#btnProcSalesRet").click(function () { newtap = false; OpenPage(Modules.ProcSalesRet); });
        $("#btnOperationExport").click(function () { newtap = false; OpenPage(Modules.OperationExport); });
        $("#btnOperationScrap").click(function () { newtap = false; OpenPage(Modules.OperationScrap); });
        $("#btnOperationRepScrap").click(function () { newtap = false; OpenPage(Modules.OperationRepScrap); });
        $("#btnProcSalesInvoice").click(function () { newtap = false; OpenPage(Modules.ProcSalesInvoice); });
        $("#btnProcSalesMgr").click(function () { newtap = false; OpenPage(Modules.ProcSalesMgr); }); //
        $("#btnCloseProcesses").click(function () { newtap = false; OpenPage(Modules.CloseProcesses); }); // 
        $("#btnClientaccstat").click(function () { newtap = false; OpenPage(Modules.Clientaccstat); }); //
        $("#btnCollectedaccstat").click(function () { newtap = false; OpenPage(Modules.Collectedaccstat); }); //
        $("#btnSupplieraccstat").click(function () { newtap = false; OpenPage(Modules.Supplieraccstat); }); //
        $("#btnCashBoxAccount").click(function () { newtap = false; OpenPage(Modules.CashBoxAccount); }); //
        $("#btnInventorymove").click(function () { newtap = false; OpenPage(Modules.Inventorymove); }); //
        $("#btnInventoryvalue").click(function () { newtap = false; OpenPage(Modules.Inventoryvalue); }); //
        $("#btnIncomeoperations").click(function () { newtap = false; OpenPage(Modules.Incomeoperations); }); //  
        $("#btnItemsalesSum").click(function () { newtap = false; OpenPage(Modules.ItemsalesSum); }); //
        $("#btnItemPurchase").click(function () { newtap = false; OpenPage(Modules.ItemPurchase); }); //
        $("#btnIssueType").click(function () { newtap = false; OpenPage(Modules.IssueType); }); //
        $("#btnIssueToCC").click(function () { newtap = false; OpenPage(Modules.IssueToCC); }); // 
        $("#btnGLDefAccount").click(function () { newtap = false; OpenPage(Modules.GLDefAccount); }); //
        $("#btnJournalVoucher").click(function () { newtap = false; OpenPage(Modules.JournalVoucher); });
        $("#btnReceiptVoucher").click(function () { newtap = false; OpenPage(Modules.ReceiptVoucher); });
        $("#btnPaymentVoucher").click(function () { newtap = false; OpenPage(Modules.PaymentVoucher); });
        $("#btnManagementVoucher").click(function () { newtap = false; OpenPage(Modules.ManagementVoucher); }); //
        $("#btnCostCenter").click(function () { newtap = false; OpenPage(Modules.CostCenter); }); //
        $("#btnAccountstatement").click(function () { newtap = false; OpenPage(Modules.Accountstatement); }); //
        $("#btnAccountbalances").click(function () { newtap = false; OpenPage(Modules.Accountbalances); }); // 
        $("#btnfinancialreports").click(function () { newtap = false; OpenPage(Modules.financialreports); }); //
        $("#btnUSERS").click(function () { newtap = false; OpenPage(Modules.USERS); }); //
        $("#btnTranPosting").click(function () { newtap = false; OpenPage(Modules.TranPosting); }); //
        $("#btnLnkvarBranch").click(function () { newtap = false; OpenPage(Modules.LnkvarBranch); }); //
        $("#btnLnkTransVoucher").click(function () { newtap = false; OpenPage(Modules.LnkTransVoucher); }); // 
        $("#btnDirecttransfer").click(function () { newtap = false; OpenPage(Modules.Directtransfer); });
        $("#btnSTKAdjust").click(function () { newtap = false; OpenPage(Modules.STKAdjust); });
        $("#btnSTKOpeningbalance").click(function () { newtap = false; OpenPage(Modules.STKOpeningbalance); });
        $("#btnReceiveTransfer").click(function () { newtap = false; OpenPage(Modules.ReceiveTransfer); });
        $("#btnsendTransfer").click(function () { newtap = false; OpenPage(Modules.sendTransfer); });
        $("#btnGenDefAdd").click(function () { newtap = false; OpenPage(Modules.GenDefAdd); });
        $("#btnDefStore").click(function () { newtap = false; OpenPage(Modules.DefStore); });
        $("#btnServiceCategories").click(function () { newtap = false; OpenPage(Modules.ServiceCategories); });
        $("#btnServices").click(function () { newtap = false; OpenPage(Modules.Services); });
        $("#btnSales_Services").click(function () { newtap = false; OpenPage(Modules.Sales_Services); });
        $("#btnSer_Return_Sales").click(function () { newtap = false; OpenPage(Modules.Ser_Return_Sales); });
        $("#btnSer_Purchasing").click(function () { newtap = false; OpenPage(Modules.Ser_Purchasing); });
        $("#btnSer_Return_Pur").click(function () { newtap = false; OpenPage(Modules.Ser_Return_Pur); });
        $("#btnSer_Sales_Report").click(function () { newtap = false; OpenPage(Modules.Ser_Sales_Report); });
        $("#btnSer_Pur_Report").click(function () { newtap = false; OpenPage(Modules.Ser_Pur_Report); });
        $("#btnVatLists").click(function () { newtap = false; OpenPage(Modules.VatLists); });
        $("#btnVatReport").click(function () { newtap = false; OpenPage(Modules.VatReport); });
        $("#btnVatSetting").click(function () { newtap = false; OpenPage(Modules.VatSetting); });
        $("#btnDtcostcenter").click(function () { newtap = false; OpenPage(Modules.Dtcostcenter); });
        $("#btnCcdtAccState").click(function () { newtap = false; OpenPage(Modules.CcdtAccState); });
        $("#btnCollectUnit").click(function () { newtap = false; OpenPage(Modules.CollectUnit); });
        //------------------------------------------------------------------------- N E W T A B -------------------------------------
        $("#btnHomeT").click(function () { newtap = true; OpenPage(Modules.Home); });
        $("#btnStkDefItemsT").click(function () { newtap = true; OpenPage(Modules.StkDefItems); });
        $("#btnStkDefItemsNewT").click(function () { newtap = true; OpenPage(Modules.StkDefItemsNew); });
        $("#btnStkDefCategoryT").click(function () { newtap = true; OpenPage(Modules.StkDefCategory); });
        $("#btnPeriodManagementT").click(function () { newtap = true; OpenPage(Modules.PeriodManagement); }); //
        $("#btnItemPeriodSummaryT").click(function () { newtap = true; OpenPage(Modules.ItemPeriodSummary); }); //
        $("#btnStkDefUnitT").click(function () { newtap = true; OpenPage(Modules.StkDefUnit); });
        $("#btnStkDefItemTypeT").click(function () { newtap = true; OpenPage(Modules.StkDefItemType); });
        $("#btnStkDefStoreT").click(function () { newtap = true; OpenPage(Modules.StkDefStore); });
        $("#btnDashboardT").click(function () { newtap = true; OpenPage(Modules.Dashboard); });
        $("#btnAccDefVendorT").click(function () { newtap = true; OpenPage(Modules.AccDefVendor); });
        $("#btnAccDefCustomerT").click(function () { newtap = true; OpenPage(Modules.AccDefCustomer); });
        $("#btnAccDefSalesmenT").click(function () { newtap = true; OpenPage(Modules.AccDefSalesmen); });
        $("#btnAccDefBoxT").click(function () { newtap = true; OpenPage(Modules.AccDefBox); });
        $("#btnAccDefExpensesT").click(function () { newtap = true; OpenPage(Modules.AccDefExpenses); });
        $("#btnAccDefReceiptsT").click(function () { newtap = true; OpenPage(Modules.AccDefReceipts); });
        $("#btnCashBankAccountT").click(function () { newtap = true; OpenPage(Modules.CashBankAccount); });
        $("#btnAgingCustT").click(function () { newtap = true; OpenPage(Modules.AgingCust); }); //
        $("#btnAgingVendT").click(function () { newtap = true; OpenPage(Modules.AgingVend); }); //
        $("#btnGenDefCustomerCatT").click(function () { newtap = true; OpenPage(Modules.GenDefCustomerCat); });
        $("#btnGendefCustomerGroupT").click(function () { newtap = true; OpenPage(Modules.GendefCustomerGroup); });
        $("#btnGenDefCustomerAdjustT").click(function () { newtap = true; OpenPage(Modules.GenDefCustomerAdjust); });
        $("#btnGenDefVendorCatT").click(function () { newtap = true; OpenPage(Modules.GenDefVendorCat); });
        $("#btnGendefVendorGroupT").click(function () { newtap = true; OpenPage(Modules.GendefVendorGroup); });
        $("#btnGenDefVendorAdjustT").click(function () { newtap = true; OpenPage(Modules.GenDefVendorAdjust); });
        $("#btnAccTrInvReceiptT").click(function () { newtap = true; OpenPage(Modules.AccTrInvReceipt); });
        $("#btnAccTrReceiptNoteT").click(function () { newtap = true; OpenPage(Modules.AccTrReceiptNote); });
        $("#btnAccTrPaymentNoteT").click(function () { newtap = true; OpenPage(Modules.AccTrPaymentNote); });
        $("#btnAccTrCustomerAdjustT").click(function () { newtap = true; OpenPage(Modules.AccTrCustomerAdjust); });
        $("#btnAccTrVendorAdjustT").click(function () { newtap = true; OpenPage(Modules.AccTrVendorAdjust); });
        $("#btnSlsTrSalesT").click(function () { newtap = true; OpenPage(Modules.SlsTrSales); });
        $("#btnSlsTrReturnT").click(function () { newtap = true; OpenPage(Modules.SlsTrReturn); });
        $("#btnSlsTrReturnOperationT").click(function () { newtap = true; OpenPage(Modules.SlsTrReturnOperation); });
        $("#btnSlsTrReturnNewT").click(function () { newtap = true; OpenPage(Modules.SlsTrReturnNew); });
        $("#btnSlsTrSalesManagerT").click(function () { newtap = true; OpenPage(Modules.SlsTrSalesManager); });
        $("#btnSlsTrSalesManagerNewT").click(function () { newtap = true; OpenPage(Modules.SlsTrSalesManagerNew); });
        $("#btnSlsTrSalesOperationT").click(function () { newtap = true; OpenPage(Modules.SlsTrSalesOperation); });
        $("#btnSlsTrShowPriceT").click(function () { newtap = true; OpenPage(Modules.SlsTrShowPrice); });
        $("#btnPurOrderT").click(function () { newtap = true; OpenPage(Modules.PurOrder); });
        $("#btnPurTrReceiveT").click(function () { newtap = true; OpenPage(Modules.PurTrReceive); });
        $("#btnPurTrReturnT").click(function () { newtap = true; OpenPage(Modules.PurTrReturn); });
        $("#btnPurTrpaymemtT").click(function () { newtap = true; OpenPage(Modules.PurTrpaymemt); });
        $("#btnProcessesT").click(function () { newtap = true; OpenPage(Modules.Processes); });
        $("#btnSalesTransT").click(function () { newtap = true; OpenPage(Modules.SalesTrans); });
        $("#btnProcSalesRetT").click(function () { newtap = true; OpenPage(Modules.ProcSalesRet); });
        $("#btnOperationExportT").click(function () { newtap = true; OpenPage(Modules.OperationExport); });
        $("#btnOperationScrapT").click(function () { newtap = true; OpenPage(Modules.OperationScrap); });
        $("#btnOperationRepScrapT").click(function () { newtap = true; OpenPage(Modules.OperationRepScrap); });
        $("#btnProcSalesInvoiceT").click(function () { newtap = true; OpenPage(Modules.ProcSalesInvoice); });
        $("#btnProcSalesMgrT").click(function () { newtap = true; OpenPage(Modules.ProcSalesMgr); }); //
        $("#btnCloseProcessesT").click(function () { newtap = true; OpenPage(Modules.CloseProcesses); }); // 
        $("#btnClientaccstatT").click(function () { newtap = true; OpenPage(Modules.Clientaccstat); }); //
        $("#btnCollectedaccstatT").click(function () { newtap = true; OpenPage(Modules.Collectedaccstat); }); //
        $("#btnSupplieraccstatT").click(function () { newtap = true; OpenPage(Modules.Supplieraccstat); }); //
        $("#btnCashBoxAccountT").click(function () { newtap = true; OpenPage(Modules.CashBoxAccount); }); //
        $("#btnInventorymoveT").click(function () { newtap = true; OpenPage(Modules.Inventorymove); }); //
        $("#btnInventoryvalueT").click(function () { newtap = true; OpenPage(Modules.Inventoryvalue); }); //
        $("#btnIncomeoperationsT").click(function () { newtap = true; OpenPage(Modules.Incomeoperations); }); //  
        $("#btnItemsalesSumT").click(function () { newtap = true; OpenPage(Modules.ItemsalesSum); }); //
        $("#btnItemPurchaseT").click(function () { newtap = true; OpenPage(Modules.ItemPurchase); }); //
        $("#btnIssueTypeT").click(function () { newtap = true; OpenPage(Modules.IssueType); }); //
        $("#btnIssueToCCT").click(function () { newtap = true; OpenPage(Modules.IssueToCC); }); // 
        $("#btnGLDefAccountT").click(function () { newtap = true; OpenPage(Modules.GLDefAccount); }); //
        $("#btnJournalVoucherT").click(function () { newtap = true; OpenPage(Modules.JournalVoucher); });
        $("#btnReceiptVoucherT").click(function () { newtap = true; OpenPage(Modules.ReceiptVoucher); });
        $("#btnPaymentVoucherT").click(function () { newtap = true; OpenPage(Modules.PaymentVoucher); });
        $("#btnManagementVoucherT").click(function () { newtap = true; OpenPage(Modules.ManagementVoucher); }); //
        $("#btnCostCenterT").click(function () { newtap = true; OpenPage(Modules.CostCenter); }); //
        $("#btnAccountstatementT").click(function () { newtap = true; OpenPage(Modules.Accountstatement); }); //
        $("#btnAccountbalancesT").click(function () { newtap = true; OpenPage(Modules.Accountbalances); }); // 
        $("#btnfinancialreportsT").click(function () { newtap = true; OpenPage(Modules.financialreports); }); //
        $("#btnUSERST").click(function () { newtap = true; OpenPage(Modules.USERS); }); //
        $("#btnTranPostingT").click(function () { newtap = true; OpenPage(Modules.TranPosting); }); //
        $("#btnLnkvarBranchT").click(function () { newtap = true; OpenPage(Modules.LnkvarBranch); }); //
        $("#btnLnkTransVoucherT").click(function () { newtap = true; OpenPage(Modules.LnkTransVoucher); }); // 
        $("#btnDirecttransferT").click(function () { newtap = true; OpenPage(Modules.Directtransfer); });
        $("#btnSTKAdjustT").click(function () { newtap = true; OpenPage(Modules.STKAdjust); });
        $("#btnSTKOpeningbalanceT").click(function () { newtap = true; OpenPage(Modules.STKOpeningbalance); });
        $("#btnReceiveTransferT").click(function () { newtap = true; OpenPage(Modules.ReceiveTransfer); });
        $("#btnsendTransferT").click(function () { newtap = true; OpenPage(Modules.sendTransfer); });
        $("#btnGenDefAddT").click(function () { newtap = true; OpenPage(Modules.GenDefAdd); });
        $("#btnDefStoreT").click(function () { newtap = true; OpenPage(Modules.DefStore); });
        $("#btnServiceCategoriesT").click(function () { newtap = true; OpenPage(Modules.ServiceCategories); });
        $("#btnServicesT").click(function () { newtap = true; OpenPage(Modules.Services); });
        $("#btnSales_ServicesT").click(function () { newtap = true; OpenPage(Modules.Sales_Services); });
        $("#btnSer_Return_SalesT").click(function () { newtap = true; OpenPage(Modules.Ser_Return_Sales); });
        $("#btnSer_PurchasingT").click(function () { newtap = true; OpenPage(Modules.Ser_Purchasing); });
        $("#btnSer_Return_PurT").click(function () { newtap = true; OpenPage(Modules.Ser_Return_Pur); });
        $("#btnSer_Sales_ReportT").click(function () { newtap = true; OpenPage(Modules.Ser_Sales_Report); });
        $("#btnSer_Pur_ReportT").click(function () { newtap = true; OpenPage(Modules.Ser_Pur_Report); });
        $("#btnVatListsT").click(function () { newtap = true; OpenPage(Modules.VatLists); });
        $("#btnVatReportT").click(function () { newtap = true; OpenPage(Modules.VatReport); });
        $("#btnVatSettingT").click(function () { newtap = true; OpenPage(Modules.VatSetting); });
        $("#btnDtcostcenterT").click(function () { newtap = true; OpenPage(Modules.Dtcostcenter); });
        $("#btnCcdtAccStateT").click(function () { newtap = true; OpenPage(Modules.CcdtAccState); });
        $("#btnCollectUnitT").click(function () { newtap = true; OpenPage(Modules.CollectUnit); });
    }
    function Notifications_Message() {
        var comCode = SysSession.CurrentEnvironment.CompCode;
        var BraCode = SysSession.CurrentEnvironment.BranchCode;
        var SystemCode = SysSession.CurrentEnvironment.SystemCode;
        var SubSystemCode = SysSession.CurrentEnvironment.SubSystemCode;
        Ajax.Callsync({
            type: "GET",
            url: sys.apiUrl("SystemTools", "GetNotifications_Message"),
            // data: { comCode: comCode, SystemCode: SystemCode },
            async: false,
            success: function (d) {
                var massg = d;
                var ulcontent = "";
                $("#creatnotesmassg").html("");
                for (var _i = 0, massg_1 = massg; _i < massg_1.length; _i++) {
                    var ms = massg_1[_i];
                    var li = document.createElement("li");
                    var span = document.createElement("span");
                    var span2 = document.createElement("span");
                    var span3 = document.createElement("span");
                    var span4 = document.createElement("span");
                    li.id = ms.AlertID.toString();
                    if (ms.NoteSubType == 1) {
                        li.className = "liItem disabledLi dropdown cursor border_li style_li1";
                    }
                    else {
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
    function Language() {
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
            SysSession.CurrentEnvironment.ScreenLanguage = "en";
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
            SysSession.CurrentEnvironment.ScreenLanguage = "ar";
            $("#btn_loguotuser").text("الخروج من النظام");
        }
        //$("#SearchBox").draggable();
        App.Startup();
    }
    HomeComponent.Language = Language;
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
        var ModuleCode = SysSession.CurrentPrivileges.MODULE_CODE;
        // 
        Ajax.Callsync({
            type: "GET",
            url: sys.apiUrl("SystemTools", "GetHelp"),
            data: { ModuleCode: ModuleCode },
            async: false,
            success: function (d) {
                // ;
                var result = d;
                var res = result.Response;
                if (res != null) {
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
                        $("#modalHelpRep").html("<div style=\"direction:rtl;height: 289px;overflow: scroll;overflow-x: hidden;font-weight: bold;\" >" + res.HelpBody_Ar + "</div>");
                    }
                    else {
                        $("#modalHelpRep").html("<div style=\"direction:ltr;height: 289px;overflow: scroll;overflow-x: hidden;font-weight: bold;\">" + res.HelpBody_En + "</div>");
                    }
                }
            }
        });
    }
    //***********************************************News******************************************
    var CompCode = Number(SysSession.CurrentEnvironment.CompCode);
    var BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);
    var News_Details = new NewsDetails();
    var Style_New = /** @class */ (function () {
        function Style_New() {
        }
        return Style_New;
    }());
    function Show_News() {
        debugger;
        $("#Div_History").html('');
        $("#Div_News").html('');
        $('.history-icon').attr('style', '');
        $('.down-arrow').addClass('display_none');
        $('.modal-History').addClass('display_none');
        var DateNow = DateFormatRep(GetDate());
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("I_VW_GetCompStatus", "GetNews"),
            data: { CompCode: CompCode, BranchCode: BranchCode, DateNow: DateNow },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    News_Details = result.Response;
                    if (News_Details.G_News.length > 0) {
                        for (var i = 0; i < News_Details.G_News.length; i++) {
                            BuildNews(i, false);
                        }
                        $('#success').click(function (e) { SetActiv_History('success', '#264051b3', 1); });
                        $('#info').click(function (e) { SetActiv_History('info', '#264051b3', 2); });
                        $('#warning').click(function (e) { SetActiv_History('warning', '#264051b3', 3); });
                        $('#error').click(function (e) { SetActiv_History('error', '#264051b3', 4); });
                        $("#News_Model").modal("show");
                        localStorage.setItem("Show_News", 'true');
                    }
                }
            }
        });
    }
    function SetActiv_History(Mode, color, News_Type) {
        Show_History(Mode, color, News_Type);
    }
    function Show_History(Mode, color, News_Type) {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("I_VW_GetCompStatus", "GetHistory"),
            data: { CompCode: CompCode, BranchCode: BranchCode, News_Type: News_Type, yr: Number(SysSession.CurrentEnvironment.CurrentYear) },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    News_Details = result.Response;
                    if (News_Details.G_News.length > 0) {
                        $('.history-icon').attr('style', '');
                        $('.down-arrow').addClass('display_none');
                        $("#Div_History").html('');
                        for (var i = 0; i < News_Details.G_News.length; i++) {
                            BuildNews(i, true);
                        }
                        $('.modal-History').removeClass('display_none');
                        $('#' + Mode + '').attr('style', 'box-shadow: inset 0 0 0 60px ' + color + ' ; color: #FFF;');
                        $('.' + Mode + '').addClass('animate__animated animate__fadeInDown');
                        $('.' + Mode + '').removeClass('display_none');
                        setTimeout(function () { $('.down-arrow').removeAttr('animate__animated animate__fadeInDown'); }, 600);
                    }
                    else {
                        Errorinput($('#' + Mode + ''));
                    }
                }
            }
        });
    }
    function BuildNews(cnt, IsHistory) {
        debugger;
        var class_News = GetClass(cnt);
        var html_News = "\n                      <div class=\"alert alert-" + class_News.class_title + " alert-white animate__animated animate__fadeInTopRight\">\n                        <div class=\"icon\">" + class_News.class_icon + "</div>\n                        <h5 class=\"news-date\"> " + DateFormat(News_Details.G_News[cnt].NewsDate) + "</h5>\n                        <strong>" + class_News.Type_Text + " :</strong>\n                        <span> " + News_Details.G_News[cnt].NewsText + " </span>\n                      </div>\n\n                   ";
        if (IsHistory) {
            $("#Div_History").append(html_News);
        }
        else {
            $("#Div_News").append(html_News);
        }
    }
    function GetClass(cnt) {
        debugger;
        var StyleNew = new Style_New();
        var TypeCode = News_Details.G_News[cnt].NewsTypeCode;
        var NewsType = News_Details.G_Codes.filter(function (x) { return x.CodeValue == TypeCode; });
        StyleNew.class_title = NewsType[0].SubCode;
        if (StyleNew.class_title == "success") {
            StyleNew.class_icon = '<i class="fa-solid fa-check-to-slot"></i>';
        }
        if (StyleNew.class_title == "info") {
            StyleNew.class_icon = '<i class="fa fa-info-circle"></i>';
        }
        if (StyleNew.class_title == "warning") {
            StyleNew.class_icon = '<i class="fa fa-warning"></i>';
        }
        if (StyleNew.class_title == "danger") {
            StyleNew.class_icon = '<i class="fa-sharp fa-solid fa-ban"></i>';
        }
        StyleNew.Type_Text = NewsType[0].DescA;
        return StyleNew;
    }
})(HomeComponent || (HomeComponent = {}));
//# sourceMappingURL=HomeComponent.js.map