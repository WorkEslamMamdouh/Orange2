var APiSession = /** @class */ (function () {
    function APiSession() {
    }
    APiSession.Session = new APISessionRecord();
    return APiSession;
}());
var SearchGrid = /** @class */ (function () {
    function SearchGrid() {
    }
    return SearchGrid;
}());
var SharedWork = /** @class */ (function () {
    function SharedWork() {
    }
    Object.defineProperty(SharedWork, "PageIndex", {
        get: function () {
            var value2 = Number(localStorage.getItem("PageIndex")); //this.GetClientSession<number>("PageIndex");
            return value2;
        },
        set: function (value) {
            //this.SetClientSession("PageIndex", value);
            localStorage.setItem("PageIndex", value.toString());
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SharedWork, "ModelCount", {
        get: function () {
            if (localStorage.getItem("TableName") != null) {
                var _Table = localStorage.getItem("TableName");
                var _Cond = localStorage.getItem("ModelCount");
                var result = 0;
                var sys = new SystemTools();
                Ajax.Callsync({
                    type: "GET",
                    url: sys.apiUrl("SystemTools", "GetModelCount"),
                    data: { TableName: _Table, Condition: _Cond },
                    async: false,
                    success: function (res) {
                        result = Number(res);
                    }
                });
                return result;
            }
            return 0;
        },
        set: function (value) {
        },
        enumerable: true,
        configurable: true
    });
    SharedWork.Render = function () {
        if (this.PageIndex < 1) {
            $("#ModelPreview").val("");
        }
        else {
            $("#ModelPreview").val("1");
        }
        $("#txtNav").val(this.PageIndex.toString() + "/" + this.ModelCount.toString());
    };
    SharedWork.SwitchModes = function (mode) {
        switch (mode) {
            case ScreenModes.Add:
                $("#AddIconSpan").show();
                $("#EditIconSpan").hide();
                $("#QueryIconSpan").hide();
                //ControlsButtons.AddButton.disabled = true;
                //ControlsButtons.EditButton.disabled = true;
                //ControlsButtons.DeleteButton.disabled = true;
                //ControlsButtons.SaveButton.disabled = false;
                //ControlsButtons.UndoButton.disabled = false;
                $(".xaddable").attr("disabled", "disabled");
                $(".addable").removeAttr("disabled");
                $("[name=nav]").prop('disabled', true);
                break;
            case ScreenModes.Edit:
                $("#AddIconSpan").hide();
                $("#EditIconSpan").show();
                $("#QueryIconSpan").hide();
                //ControlsButtons.AddButton.disabled = true;
                //ControlsButtons.EditButton.disabled = true;
                //ControlsButtons.DeleteButton.disabled = true;
                //ControlsButtons.SaveButton.disabled = false;
                //ControlsButtons.UndoButton.disabled = false;
                $(".xeditable").attr("disabled", "disabled");
                $(".editable").removeAttr("disabled");
                $("[name=nav]").prop('disabled', true);
                break;
            case ScreenModes.Query:
                $("#AddIconSpan").hide();
                $("#EditIconSpan").hide();
                $("#QueryIconSpan").show();
                //ControlsButtons.AddButton.disabled = false;
                //ControlsButtons.EditButton.disabled = false;
                //ControlsButtons.DeleteButton.disabled = false;
                //ControlsButtons.SaveButton.disabled = true;
                //ControlsButtons.UndoButton.disabled = true;
                $(".xaddable").removeAttr("disabled");
                $(".xeditable").removeAttr("disabled");
                $(".editable").attr("disabled", "disabled");
                $(".addable").attr("disabled", "disabled");
                $(".addable").val("");
                $(".editable").val("");
                $("[name=nav]").prop('disabled', false);
                break;
            case ScreenModes.DisableMenu:
                $("#AddIconSpan").hide();
                $("#EditIconSpan").hide();
                $("#QueryIconSpan").show();
                //ControlsButtons.AddButton.disabled = true;
                //ControlsButtons.EditButton.disabled = true;
                //ControlsButtons.DeleteButton.disabled = true;
                //ControlsButtons.SaveButton.disabled = true;
                //ControlsButtons.UndoButton.disabled = true;
                $(".xaddable").removeAttr("disabled");
                $(".xeditable").removeAttr("disabled");
                $(".editable").attr("disabled", "disabled");
                $(".addable").attr("disabled", "disabled");
                $("[name=nav]").prop('disabled', false);
                break;
        }
        //  ControlsButtons.ModuleEffects();
        SharedWork.CurrentMode = mode;
        if (SharedWork.OnSwitchModes != null)
            SharedWork.OnSwitchModes();
        SharedWork.Render();
    };
    SharedWork.UserFavorits = new Array();
    SharedWork.OnNavigate = null;
    SharedWork.OnSwitchModes = null;
    return SharedWork;
}());
var UserPrivilege = /** @class */ (function () {
    function UserPrivilege() {
    }
    return UserPrivilege;
}());
var SystemEnvironment = /** @class */ (function () {
    function SystemEnvironment() {
    }
    return SystemEnvironment;
}());
var sysInternal_Comm = /** @class */ (function () {
    function sysInternal_Comm() {
    }
    sysInternal_Comm.slected_MemberID = 0;
    sysInternal_Comm.period_ID = 0;
    return sysInternal_Comm;
}());
var SystemSession = /** @class */ (function () {
    function SystemSession() {
        this.CurrentPrivileges = new UserPrivilege();
        this.CurrentEnvironment = new SystemEnvironment();
    }
    return SystemSession;
}());
function getCookie(cookieName) {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        if (cookie.indexOf(cookieName + "=") === 0) {
            var encodedValue = cookie.substring(cookieName.length + 1);
            var decodedValue = decodeURIComponent(encodedValue);
            return decodedValue;
        }
    }
    return null;
}
function readCookie(cookieName) {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        if (cookie.indexOf(cookieName + "=") === 0) {
            var encodedValue = cookie.substring(cookieName.length + 1);
            var decodedValue = decodeURIComponent(encodedValue);
            return decodedValue;
        }
    }
    return null;
}
function GetPrivileges() {
    // 
    if (document.cookie.length > 0) {
        var user = JSON.parse(getCookie("Inv1_Privilage"));
        //user.MODULE_DESCA = "";
        //user.MODULE_DESCE = "";
        //var unmaskedData = JSON.parse(JSON.parse(getCookie("Privilage")));
        //var maskedData = JSON.stringify(unmaskedData, maskInfo);
        //function maskInfo(key, value) {
        //    var maskedValue = value;
        //    if (key == "MODULE_DESCA") {
        //        maskedValue = "";
        //        return maskedValue;
        //    }
        //}
        //alert(getCookie("Privilage"));
        //alert(getCookie("Privilage").length);
        //SysSession.CurrentPrivileges = user;
        return user;
    }
}
function GetSystemEnvironment() {
    if (document.cookie.length > 0) {
        var sys = JSON.parse(getCookie("Inv1_systemProperties"));
        sys.CompanyNameAr = "";
        sys.CompanyName = "";
        //alert(getCookie("Kids_systemProperties"));
        //alert(getCookie("Kids_systemProperties").length);
        // 
        //SysSession.CurrentEnvironment = sys
        return sys;
    }
}
//function GetI_Control(): I_Control {
//    if (document.cookie.length > 0) {
//        let sys: I_Control = JSON.parse(getCookie("kControl")) as I_Control;
//        //alert(getCookie("kControl"));
//        //alert(getCookie("kControl").length);
//        // 
//        SysSession.CurrentEnvironment.I_Control = sys
//        return sys;
//    }
//}
//function GetSystemSession(): SystemSession {
//    if (document.cookie.length > 0) {
//        // 
//        var SysSession = new SystemSession;
//        SysSession.CurrentEnvironment = JSON.parse(readCookie("Inv1_systemProperties")) as SystemEnvironment;
//        SysSession.CurrentPrivileges = JSON.parse(readCookie("Inv1_Privilage")) as UserPrivilege;
//        //RS.CurrentMemberComm = JSON.parse(getCookie("Inv1_Comm")) as Kids_Comm;
//        return SysSession;
//    }
//}
function GetSystemSession(Mod) {
    if (Mod != "Home") {
        $('#divIconbar').removeClass('hidden_Control');
        localStorage.setItem("Model_Screen", Mod);
    }
    if (document.cookie.length > 0) {
        var SysSession = new SystemSession;
        SysSession.CurrentEnvironment = JSON.parse(readCookie("Inv1_systemProperties"));
        if (SysSession.CurrentEnvironment == null) {
            return;
        }
        var DbName = SysSession.CurrentEnvironment.DbName;
        var compCode = SysSession.CurrentEnvironment.CompCode;
        var UserCode = SysSession.CurrentEnvironment.UserCode;
        var BranchCode = SysSession.CurrentEnvironment.BranchCode;
        var CurrentYear = SysSession.CurrentEnvironment.CurrentYear;
        $('#GetIPAddress').val(compCode + "_" + UserCode + "_" + DbName);
        localStorage.setItem("UserCode", UserCode);
        localStorage.setItem("compCode", compCode);
        localStorage.setItem("BranchCode", BranchCode);
        localStorage.setItem("CurrentYear", CurrentYear);
        if (Mod == "Home")
            return SysSession;
        var sys = new SystemTools();
        if (!(compCode == "Undefied")) {
            var branchCode = SysSession.CurrentEnvironment.BranchCode;
            var UserCode_1 = SysSession.CurrentEnvironment.UserCode;
            var SystemCode = SysSession.CurrentEnvironment.SystemCode;
            var SubSystemCode = SysSession.CurrentEnvironment.SubSystemCode;
            var CurrentYear_1 = SysSession.CurrentEnvironment.CurrentYear;
            //var apiUrl = $("#GetAPIUrl").val() + "SystemTools" + "/" + "GetUserPrivilage";
            Ajax.Callsync({
                type: "GET",
                url: sys.apiUrl("SystemTools", "GetUserPrivilage"),
                data: { year: Number(CurrentYear_1), compCode: Number(compCode), branchCode: Number(branchCode), UserCode: UserCode_1, SystemCode: SystemCode, Modulecode: Mod },
                success: function (d) {
                    debugger;
                    var result = JSON.parse(d);
                    if (result == null || result.Access != true) {
                        alert("Access denied  ( " + Mod + " )");
                        return;
                    }
                    if (result.Access == true) {
                        $("#btnHelpRep").click(function () { ScreenHelp(Mod); });
                        SysSession.CurrentPrivileges = result;
                        if (!result.VIEW) {
                            $('#btnShow').addClass('hidden_Control');
                            $('#btnPrint').addClass('hidden_Control');
                            $('#btnPrintTrview').addClass('hidden_Control');
                            $('#btnPrintTrPDF').addClass('hidden_Control');
                            $('#btnPrintTrEXEL').addClass('hidden_Control');
                        }
                        if (!result.AddNew) {
                            $('#btnAdd').addClass('hidden_Control');
                        }
                        if (!result.PrintOut) {
                            $('#btnPrintTransaction').addClass('hidden_Control');
                        }
                        if (!result.EDIT) {
                            $('#btnUpdate').addClass('hidden_Control');
                        }
                        setTimeout(function () { $('._Loding').removeClass('Btn_Loder'); }, 1000);
                        setTimeout(function () {
                            OpenScreen(SysSession.CurrentEnvironment.UserCode, SysSession.CurrentEnvironment.CompCode, SysSession.CurrentEnvironment.BranchCode, Mod, SysSession.CurrentEnvironment.CurrentYear);
                        }, 3000);
                    }
                    else {
                        alert("No Inv1_Privilage  ( " + Mod + " )");
                    }
                }
            });
        }
        return SysSession;
    }
    document.body.style.zoom = "90%";
}
//function GetMemberComm(): Kids_Comm {
//    if (document.cookie.length > 0) {
//        // 
//       let kids = JSON.parse(getCookie("Inv1_Comm")) as Kids_Comm;
//        //Kids_Comm = Kids
//        return Kids;
//    }
//}
var PropertiesPage = /** @class */ (function () {
    function PropertiesPage() {
    }
    PropertiesPage.Render = function () {
        if (this.PageIndex < 1) {
            $("#ModelPreview").val("");
        }
        else {
            $("#ModelPreview").val("1");
        }
        $("#txtNav").val(this.PageIndex.toString() + "/" + this.ModelCount.toString());
    };
    PropertiesPage.OnNavigate = null;
    return PropertiesPage;
}());
function GetCompanyName(compcode) {
    // 
    var sys = new SystemTools();
    var compname = new G_COMPANY();
    Ajax.Callsync({
        url: sys.apiUrl("K_CompanyControl", "GetAllCompanyName"),
        data: { compcode: compcode },
        success: function (d) {
            var result = d;
            if (result.IsSuccess) {
                compname = result.Response;
            }
        }
    });
    return compname;
}
function OpenReportsPopup(moduleCode) {
    var opt = {
        url: Url.Action(moduleCode, "GeneralReports"),
        success: function (d) {
            var result = d;
            $("#ReportPopupBody").html(result);
            $("#ReportsPopupDialog").modal("show");
            $('#ReportsPopupDialog').modal({
                refresh: true
            });
            var val = $("#rpTitle").text();
            $("#TitleSpanRep").html(val);
        }
    };
    Ajax.CallAsync(opt);
}
function GetMAxImgSize(CompCode, BranchCode) {
    var sys = new SystemTools();
    var Cont = 0;
    Ajax.Callsync({
        type: "GET",
        url: sys.apiUrl("SystemTools", "GetMaxImagesize"),
        data: { comp: CompCode, bracode: BranchCode },
        success: function (d) {
            var result = d;
            if (result.IsSuccess == true) {
                Cont = result.Response;
            }
        }
    });
    return Cont;
}
function GetSystemG_BRANCH() {
    if (document.cookie.length > 0) {
        var sys = JSON.parse(getCookie("Inv1_systemG_BRANCH"));
        return sys;
    }
}
//# sourceMappingURL=Shared.js.map