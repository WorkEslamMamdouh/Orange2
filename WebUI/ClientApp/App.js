var ScreenModes;
(function (ScreenModes) {
    ScreenModes[ScreenModes["Query"] = 0] = "Query";
    ScreenModes[ScreenModes["Add"] = 1] = "Add";
    ScreenModes[ScreenModes["Edit"] = 2] = "Edit";
    ScreenModes[ScreenModes["Start"] = 3] = "Start";
    ScreenModes[ScreenModes["DisableMenu"] = 4] = "DisableMenu";
})(ScreenModes || (ScreenModes = {}));
var JsGridHeaderCenter = "JsGridHeaderCenter";
var TransparentButton = "TransparentButton";
var Modules = {
    Home: "Home",
    StkDefinitionMenu: "StkDefinitionMenu",
    StkDefItems: "StkDefItems",
    StkDefItemsNew: "StkDefItemsNew",
    StkDefCategory: "StkDefCategory",
    PeriodManagement: "PeriodManagement",
    ItemPeriodSummary: "ItemPeriodSummary",
    StkDefUnit: "StkDefUnit",
    StkDefItemType: "StkDefItemType",
    StkDefStore: "StkDefStore",
    AccDefinitionMenu: "AccDefinitionMen",
    AccDefVendor: "AccDefVendor",
    AccDefCustomer: "AccDefCustomer",
    AccDefSalesmen: "AccDefSalesmen",
    AccDefBox: "AccDefBox",
    AccDefExpenses: "AccDefExpenses",
    AccDefReceipts: "AccDefReceipts",
    GeneralDefMenu: "GeneralDefMenu",
    GenDefCustomerCat: "GenDefCustomerCat",
    GendefCustomerGroup: "GendefCustomerGroup",
    GenDefCustomerAdjust: "GenDefCustomerAdjust",
    GenDefVendorCat: "GenDefVendorCat",
    GendefVendorGroup: "GendefVendorGroup",
    GenDefVendorAdjust: "GenDefVendorAdjust",
    AccTrInvReceipt: "AccTrInvReceipt",
    AccTrReceiptNote: "AccTrReceiptNote",
    AccTrPaymentNote: "AccTrPaymentNote",
    AccTrCustomerAdjust: "AccTrCustomerAdjust",
    AccTrVendorAdjust: "AccTrVendorAdjust",
    SlsTrSales: "SlsTrSales",
    SlsTrReturn: "SlsTrReturn",
    SlsTrReturnNew: "SlsTrReturnNew",
    SlsTrReturnOperation: "SlsTrReturnOperation",
    SlsTrSalesManager: "SlsTrSalesManager",
    SlsTrSalesManagerNew: "SlsTrSalesManagerNew",
    SlsTrSalesOperation: "SlsTrSalesOperation",
    PurTrReceive: "PurTrReceive",
    PurTrReturn: "PurTrReturn",
    PurTrpaymemt: "PurTrpaymemt",
    Processes: "Processes",
    ProcSalesMgr: "ProcSalesMgr",
    ProcSalesRet: "ProcSalesRet",
    OperationScrap: "OperationScrap",
    ProcSalesInvoice: "ProcSalesInvoice",
    Clientaccstat: "Clientaccstat",
    Supplieraccstat: "Supplieraccstat",
    CashBoxAccount: "CashBoxAccount",
    Inventorymove: "Inventorymove",
    Inventoryvalue: "Inventoryvalue",
    Incomeoperations: "Incomeoperations",
    GLDefAccount: "GLDefAccount",
    AgingCust: "AgingCust",
    AgingVend: "AgingVend",
    ItemsalesSum: "ItemsalesSum",
    ItemPurchase: "ItemPurchase",
    IssueType: "IssueType",
    IssueToCC: "IssueToCC",
    Dashboard: "Dashboard",
    JournalVoucher: "JournalVoucher",
    ReceiptVoucher: "ReceiptVoucher",
    PaymentVoucher: "PaymentVoucher",
    ManagementVoucher: "ManagementVoucher",
    CostCenter: "CostCenter",
    Accountstatement: "Accountstatement",
    Accountbalances: "Accountbalances",
    USERS: "USERS",
    TranPosting: "TranPosting",
    LnkvarBranch: "LnkvarBranch",
    LnkTransVoucher: "LnkTransVoucher",
    Directtransfer: "Directtransfer",
    STKAdjust: "STKAdjust",
    ReceiveTransfer: "ReceiveTransfer",
    sendTransfer: "sendTransfer",
    financialreports: "financialreports",
    GenDefAdd: "GenDefAdd",
    DefStore: "DefStore",
    SlsTrShowPrice: "SlsTrShowPrice",
    PurOrder: "PurOrder",
    ServiceCategories: "ServiceCategories",
    Services: "Services",
    Sales_Services: "Sales_Services",
    Ser_Return_Sales: "Ser_Return_Sales",
    Ser_Purchasing: "Ser_Purchasing",
    Ser_Return_Pur: "Ser_Return_Pur",
    Ser_Sales_Report: "Ser_Sales_Report",
    Ser_Pur_Report: "Ser_Pur_Report",
    Collectedaccstat: "Collectedaccstat",
    Dtcostcenter: "Dtcostcenter",
    SalesTrans: "SalesTrans",
    VatSetting: "VatSetting",
    VatLists: "VatLists",
    VatReport: "VatReport",
    CcdtAccState: "CcdtAccState",
    CashBankAccount: "CashBankAccount",
    CloseProcesses: "CloseProcesses",
    CollectUnit: "CollectUnit"
};
var MessageType = {
    Error: '2',
    Succeed: '1',
    Worning: '3',
};
var TransType = {
    Invoice: 'Inv',
    InvoiceReturn: 'Inv_Ret',
    InvoiceOperation: 'Pro',
    InvoiceOperationReturn: 'Pro_Ret',
    Pur_Receive: 'Pur',
    Pur_Receive_Return: 'Pur_Ret',
    AccReceive: 'AccReceive',
    AccPayment: 'AccPayment',
};
var Keys = {
    Enter: "Enter"
};
var setVal = function (value) {
    var Input = this;
    value == null || Number(value) == 0 ? Input.value = '' : Input.value = value;
    return value;
};
function IsNullOrEmpty(value) {
    if (value == null || value == "")
        return true;
    else
        return false;
}
function GetIndexByUseId(idValue, BaseTableName, idFieldName, Condition) {
    var result = "";
    if (IsNullOrEmpty(idValue.toString()) || IsNullOrEmpty(BaseTableName) || IsNullOrEmpty(idFieldName)) {
        return result;
    }
    else {
        var sys = new SystemTools;
        var result_1 = "";
        Ajax.Callsync({
            url: sys.apiUrl("SystemTools", "GetIndexByUseId"),
            data: { idValue: idValue.toString(), BaseTableName: BaseTableName, idFieldName: idFieldName, Condition: Condition },
            success: function (d) {
                result_1 = d;
            }
        });
        return result_1;
    }
}
function GetIndexByUseCode(idValue, BaseTableName, idFieldName, condition) {
    var result = "";
    if (IsNullOrEmpty(idValue.toString()) || IsNullOrEmpty(BaseTableName) || IsNullOrEmpty(idFieldName)) {
        return result;
    }
    else {
        var result_2 = Ajax.Call({
            url: Url.Action("GetIndexByUseCode", "ClientTools"),
            data: { idValue: idValue.toString(), BaseTableName: BaseTableName, idFieldName: idFieldName, condition: condition }
        });
        return result_2;
    }
}
var SearchModulesNames = {
    cashCustomer: "cashCustomer",
    cashCustomerCategory: "cashCustomerCategory",
    categories: "categories",
    colours: "colours",
    CostCenter: "CostCenter",
    CustAdjType: "CustAdjType",
    customerInformation: "customerInformation",
    customers: "customers",
    groups: "groups",
    Icustomers: "Icustomers",
    items: "items",
    Items2: "Items2",
    marks: "marks",
    movements: "movements",
    nations: "nations",
    salesMan: "salesMan",
    TrReceipt: "TrReceipt",
    types: "types",
    uoms: "uoms",
    store: "store"
};
function Numeric(value) {
    var result = 0;
    if (!isNaN(value)) {
        var strValue = value.RoundToSt(2);
        result = Number(strValue); // value;
    }
    return result;
}
function Fixed(value) {
    return Number(value.RoundToSt(2));
}
var App;
(function (App) {
    Number.prototype.RoundToNum = function (dec) {
        var num = this;
        return (Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec));
    };
    Number.prototype.RoundToSt = function (dec) {
        var num = this;
        return (Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec)).toString();
    };
    Number.prototype.setVal = function (value) {
        var Input = this;
        value == null || Number(value) == 0 ? Input.value = '' : Input.value = value;
        return value;
    };
    HTMLInputElement.prototype.setVal = function (value) {
        var Input = this;
        value == null || Number(value) == 0 ? Input.value = '' : Input.value = value;
        return value;
    };
    HTMLSelectElement.prototype.SetValSelect = function (value) {
        var Input = this;
        value == null || value == '' || value == 0 || value == '0' ? Input.value = 'null' : Input.value = value;
        return value;
    };
    var branchCodeSelected = "";
    var LanguageButton;
    function AssignLoginInformation() {
        var Env = GetSystemEnvironment();
        if (DocumentActions.GetElementById("infoSysName") != null)
            DocumentActions.GetElementById("infoSysName").innerText = Env.SystemCode;
        if (DocumentActions.GetElementById("infoSubSysName") != null)
            DocumentActions.GetElementById("infoSubSysName").innerText = Env.SubSystemCode;
        if (DocumentActions.GetElementById("infoCompanyName") != null) {
            if (Env.ScreenLanguage == "ar")
                DocumentActions.GetElementById("infoCompanyName").innerText = Env.CompanyNameAr;
            else
                DocumentActions.GetElementById("infoCompanyName").innerText = Env.CompanyName;
        }
        if (DocumentActions.GetElementById("infoCurrentYear") != null)
            DocumentActions.GetElementById("infoCurrentYear").innerText = Env.CurrentYear;
        if (DocumentActions.GetElementById("infoUserCode") != null)
            DocumentActions.GetElementById("infoUserCode").innerText = Env.UserCode;
    }
    function Startup() {
        var Env = GetSystemEnvironment();
        try {
            var SpanUserName = DocumentActions.GetElementById("SpanUserName");
            SpanUserName.innerText = Env.UserCode;
            SpanUserName.style.display = "block";
            SpanUserName.onclick = GetBranchs;
        }
        catch (e) {
        }
        var btnEditUserBranchs;
        try {
            btnEditUserBranchs = DocumentActions.GetElementById("btnEditUserBranchs");
            btnEditUserBranchs.onclick = EnableBranchSelected;
        }
        catch (e) {
        }
        //var btnChangeBranch: HTMLButtonElement;
        //try {
        //    btnChangeBranch = DocumentActions.GetElementById<HTMLButtonElement>("btnChangeBranch");
        //    btnChangeBranch.onclick = ChangeBranch;
        //} catch (e) {
        //}
        AssignLoginInformation();
        try {
            LanguageButton = DocumentActions.GetElementById("LanguageButton");
            LanguageButton.onclick = LanguageButton_Click;
        }
        catch (e) {
        }
        try {
            DocumentActions.GetElementById("btnChangePassword").onclick = function () {
                var oldPassword = DocumentActions.GetElementById("txtOldPassword").value;
                var newPassword = DocumentActions.GetElementById("txtNewPassword").value;
                ChangePassword(oldPassword, newPassword);
            };
        }
        catch (e) {
        }
        try {
            DocumentActions.GetElementById("spnFav").onclick = function () {
                var sys = new SystemTools();
                sys.SwitchUserFavorite();
            };
        }
        catch (e) {
        }
        AssignLoginInformation();
    }
    App.Startup = Startup;
    function LanguageButton_Click() {
        var SysSession = GetSystemEnvironment();
        if (SysSession.ScreenLanguage == "ar") {
            SysSession.ScreenLanguage = "en";
            //SysSession.CurrentEnvironment.ScreenLanguage = "en";
            //SysSession.CurrentEnvironment.CompanyNameAr = "";
            //SysSession.CurrentEnvironment.CompanyName = "";
        }
        else { // Arabic Mode other mohaamed ragab
            SysSession.ScreenLanguage = "ar";
            //SysSession.CurrentEnvironment.ScreenLanguage = "ar";
            //SysSession.CurrentEnvironment.CompanyNameAr = "";
            //SysSession.CurrentEnvironment.CompanyName = "";
        }
        document.cookie = "Inv1_systemProperties=" + JSON.stringify(SysSession) + ";expires=Fri, 31 Dec 2030 23:59:59 GMT;path=/";
        //Ajax.CallAsync({
        //    url: Url.Action("SetScreenLang", "ClientTools"),
        //    data: { lang: SysSession.CurrentEnvironment.ScreenLanguage },
        //    success: (response) => { }
        //});
    }
    function AppendStyleSheet(fileName) {
        var lnk = document.createElement('link');
        lnk.href = "../css/" + fileName + ".css";
        lnk.rel = 'stylesheet';
        lnk.type = 'text/css';
        var $head = $("head");
        var $headlinklast = $head.find("link[rel='stylesheet']:first");
        $headlinklast.after(lnk);
        //document.getElementsByTagName("head")[0].appendChild(lnk);
    }
    function RemoveStyleSheet(fileName) {
        var href = "../css/" + fileName + ".css";
        $("link[rel=stylesheet][href~='" + href + "']").remove();
    }
})(App || (App = {}));
function EnableBranchSelected() {
    var ddlBrachs = DocumentActions.GetElementById("ddlBrachs");
    ddlBrachs.removeAttribute("disabled");
}
function GetBranchs() {
    var sys = new SystemTools();
    var Env = GetSystemEnvironment();
    var ddlBrachs = DocumentActions.GetElementById("ddlBrachs");
    Ajax.Callsync({
        url: sys.apiUrl("SystemTools", "GetBranchsByUserCode"),
        data: { userCode: Env.UserCode, compCode: Env.CompCode },
        success: function (response) {
            var result = response;
            DocumentActions.FillCombo(result, ddlBrachs, "BRA_CODE", "BRA_DESCL");
        }
    });
}
var GQ_GetUserBranch = /** @class */ (function () {
    function GQ_GetUserBranch() {
        this.USER_CODE = "";
        this.COMP_CODE = 0;
        this.BRA_CODE = 0;
        this.BRA_DESCL = "";
        this.BRA_DESCE = "";
        this.BRA_DESC = "";
    }
    return GQ_GetUserBranch;
}());
function InitalizeLayout() {
    //ControlsButtons.ModuleEffects();
}
function GetParameterByName(name) {
    var url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
    if (!results)
        return null;
    if (!results[2])
        return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
function ChangePassword(OldPassword, NewPassword) {
    var sys = new SystemTools();
    var Env = GetSystemEnvironment();
    var UserCode = Env.UserCode;
    $.ajax({
        url: sys.apiUrl("SystemTools", "ChangePassword"),
        data: { OldPassword: OldPassword, NewPassword: NewPassword, UserCode: UserCode },
        success: function (response) {
            var result = response;
            if (result.IsSuccess == true) {
                alert("Password changed");
            }
            else {
                alert("Changing password failed");
            }
        }
    });
}
function CloseSearchBox() {
    $("#SearchBox").modal("hide"); //.css("display", "none");
}
// mahroos
function NavigateToSearchResultKey(IndexNo, Navigate) {
    //    CloseSearchBox();
    //    SharedWork.PageIndex = IndexNo;
    //    Navigate();
    //    SharedWork.Render();
}
function NavigateToSearchResult(Navigate) {
    //    CloseSearchBox();
    //    let index = SearchGrid.SearchDataGrid.SelectedKey;
    //    SharedWork.PageIndex = Number(index);
    //    Navigate();
    //    SharedWork.Render();
}
//var Url = {
//    Action: (actionName: string, controllerName: string) => ($.ajax({
//        url: $("#GetActionUrl").val(),
//        async: false,
//        data: { actionName: actionName, controllerName: controllerName }
//    }).responseJSON).result as string
//};
var Url = {
    Action: function (actionName, controllerName) { return (location.origin + "/" + controllerName + "/" + actionName); }
};
var Ajax = {
    Call: function (settings) {
        try {
            //// 
            CheckTime();
            var json = $.ajax({
                url: settings.url,
                data: settings.data,
                cache: false,
                async: false
            }).responseJSON;
            var result = json.result;
            return result;
        }
        catch (e) {
            $(".waitMe").removeAttr("style").fadeOut(200);
            return null;
        }
    },
    CallAsync: function (settings) {
        CheckTime();
        //run_waitMe();
        $.ajax({
            type: settings.type,
            url: settings.url,
            data: settings.data,
            cache: false,
            headers: {
                'Accept': 'application/json; charset=utf-8',
                'Content-Type': 'application/json'
            },
            success: function (d) {
                settings.success(d, "", null);
                $(".waitMe").removeAttr("style").fadeOut(200);
            },
            error: function () { $(".waitMe").removeAttr("style").fadeOut(200); }
        });
    },
    Callsync: function (settings) {
        CheckTime();
        //run_waitMe();
        $.ajax({
            type: settings.type,
            url: settings.url,
            data: settings.data,
            headers: {
                'Accept': 'application/json; charset=utf-8',
                'Content-Type': 'application/json'
            },
            cache: false,
            async: false,
            success: function (d) {
                settings.success(d, "", null);
                $(".waitMe").removeAttr("style").fadeOut(2500);
            },
            error: function () { $(".waitMe").removeAttr("style").fadeOut(2500); }
        });
    }
};
function GetView(controllerName, ModuleCode) {
    ////// ;
    //HomeComponent.UserAcsses(ModuleCode);
    var json = Ajax.CallAsync({
        //type: "GET",
        url: "OpenView",
        data: { controllerName: controllerName, ModuleCode: ModuleCode },
        cache: true,
        async: true,
        success: function (response) {
            window.open(Url.Action(controllerName + "Index", controllerName), "_self");
            //$("#cont").html(response);
        }
    });
    //back to home 
    //SysSession.ModuleCode = "Home";
}
function OpenPartial(ModuleCode, DivName) {
    var jsonf = $.ajax({
        type: "GET",
        url: "OpenView",
        data: { ModuleCode: ModuleCode },
        cache: false,
        async: false,
        success: function (response) {
            $("#" + DivName).html(response);
        }
    }).responseJSON;
}
function loading(NameBtn) {
    $('#' + NameBtn + '').attr('disabled', 'disabled');
    $('#Loading_Div').html('<i class="fa fa-spinner fa-spin lod  Loading" style="font-size: 465%;z-index: 99999;"></i>');
    setTimeout(function () {
        $('#Loading_Div').html('');
    }, 150);
}
function finishSave(NameBtn) {
    setTimeout(function () {
        $('#' + NameBtn + '').removeAttr('disabled');
    }, 100);
}
function Save_Succ_But() {
    $('#divIconbar').removeClass('display_none');
    $('#btnPrintTransaction').removeClass('display_none');
    $('#btnUpdate').removeClass('display_none');
    $('#btnBack').addClass('display_none');
    $('#btnSave').addClass('display_none');
    $('#btnPrintslip').removeClass('display_none');
    $('#btnPrintTransaction').removeClass('display_none');
    $("#NewAdd_Falg").val('0');
    $("#Mod_Flag").val('0');
    document.body.scrollTop = 600;
    document.documentElement.scrollTop = 600;
}
function run_waitMe() {
    $('.please_wait').waitMe({
        effect: "win8",
        text: "...Pleasewait",
        color: '#fff',
        sizeW: '80px',
        sizeH: '80px',
        textPos: "horizontal"
    });
    $('.please_wait').waitMe({
        effect: "win8",
        text: "...Pleasewait",
        color: '#fff',
        sizeW: '400',
        waitTime: '40000',
        sizeH: '400'
    });
}
var RequiredClassName = " required";
var RequiredElements = new Array();
var exchangeElements = new Array();
var DocumentActions = {
    SetRequiredElements: function () {
        var elements = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            elements[_i] = arguments[_i];
        }
        RequiredElements = new Array();
        for (var _a = 0, elements_1 = elements; _a < elements_1.length; _a++) {
            var element = elements_1[_a];
            //element.className += RequiredClassName;
            RequiredElements.push(element);
        }
    },
    SetExchangeElements: function (ArElement, EnElement) {
        exchangeElements = new Array();
        exchangeElements.push(ArElement);
        exchangeElements.push(EnElement);
    },
    ValidateRequired: function () {
        //let result: boolean = false;
        var bools = new Array();
        var elements = RequiredElements; // Array.prototype.slice.call(document.getElementsByClassName("required")) as Array<HTMLElement>;
        for (var _i = 0, elements_2 = elements; _i < elements_2.length; _i++) {
            var element = elements_2[_i];
            switch (element.tagName.toUpperCase()) {
                case "INPUT":
                    if (element.type == "check") {
                        if (element.checked == false) {
                            bools.push(false);
                            element.style.borderColor = "red";
                        }
                        else {
                            bools.push(true);
                            element.style.borderColor = "";
                        }
                    }
                    else {
                        if (element.value == "") {
                            bools.push(false);
                            element.style.borderColor = "red";
                        }
                        else {
                            bools.push(true);
                            element.style.borderColor = "";
                        }
                    }
                    break;
                case "SELECT":
                    if (element.value == "") {
                        bools.push(false);
                        element.style.borderColor = "red";
                    }
                    else {
                        bools.push(true);
                        element.style.borderColor = "";
                    }
                    break;
                default:
            }
        }
        if (exchangeElements.length > 0) {
            if (exchangeElements[0].value == "" && exchangeElements[1].value == "") {
                bools.push(false);
                exchangeElements[0].style.borderColor = "orange";
                exchangeElements[1].style.borderColor = "orange";
            }
            else {
                bools.push(true);
                exchangeElements[0].style.borderColor = "";
                exchangeElements[1].style.borderColor = "";
            }
        }
        var count = bools.filter(function (f) { return f == false; }).length;
        if (count > 0)
            return false;
        else
            return true;
    },
    RenderFromModel: function (dataSource) {
        try {
            var properties = Object.getOwnPropertyNames(dataSource);
            for (var _i = 0, properties_1 = properties; _i < properties_1.length; _i++) {
                var property = properties_1[_i];
                var element = document.getElementsByName(property)[0];
                if (element == null)
                    continue;
                if (property == "CreatedAt" || property == "UpdatedAt") {
                    if (String(dataSource[property]).indexOf("Date") > -1) {
                        element.value = DateTimeFormat(dataSource[property]);
                    }
                    else {
                        element.value = dataSource[property];
                    }
                    continue;
                }
                if (property == "CreatedBy" || property == "UpdatedBy") {
                    var value = String(dataSource[property]).toString();
                    if (value != null)
                        element.value = value;
                    else
                        element.value = "";
                    continue;
                }
                if (dataSource[property] == null) {
                    try {
                        element.value = dataSource[property];
                    }
                    catch (e) {
                    }
                    finally {
                        continue;
                    }
                }
                if (element.type == "checkbox")
                    element.checked = (dataSource[property]);
                else if (element.type == "date") {
                    element.value = dataSource[property];
                }
                else
                    element.value = dataSource[property];
            }
        }
        catch (e) {
        }
    },
    AssignToModel: function (model) {
        var properties = Object.getOwnPropertyNames(model);
        for (var _i = 0, properties_2 = properties; _i < properties_2.length; _i++) {
            var property = properties_2[_i];
            var element = document.getElementsByName(property)[0];
            if (element != null) {
                if (element.type == "checkbox")
                    model[property] = element.checked;
                else
                    model[property] = element.value;
            }
        }
        return model;
    },
    //eslam elassal
    FillComboSingular: function (dataSource, combo) {
        if (combo != null) {
            for (var i = combo.length; i >= 0; i--) {
                combo.remove(i);
            }
            for (var i = 0; i < dataSource.length; i++) {
                //let code = dataSource[i][i];
                //let name = dataSource[i][dataSource[i]];
                combo.add(new Option(dataSource[i], i.toString()));
            }
        }
    },
    FillCombo: function (dataSource, combo, codeField, textField) {
        if (combo != null) {
            for (var i = combo.length; i >= 0; i--) {
                combo.remove(i);
            }
            for (var i = 0; i < dataSource.length; i++) {
                var code = dataSource[i][codeField];
                var name_1 = dataSource[i][textField];
                combo.add(new Option(name_1, code));
            }
        }
    },
    FillComboFirstvalue: function (dataSource, combo, codeField, textField, Name, Code) {
        if (combo != null) {
            for (var i = combo.length; i >= 0; i--) {
                combo.remove(i);
            }
            combo.add(new Option(Name, Code));
            for (var i = 0; i < dataSource.length; i++) {
                var code = dataSource[i][codeField];
                var name_2 = dataSource[i][textField];
                combo.add(new Option(name_2, code));
                if (name_2 == Name && code == Code) {
                    combo.remove(i + 1);
                }
            }
        }
    },
    FillCombowithdefultAndEmptyChoice: function (dataSource, combo, codeField, textField, NameDefult, EmptyChoiceName) {
        if (combo != null) {
            for (var i = combo.length; i >= 0; i--) {
                combo.remove(i);
            }
            combo.add(new Option(NameDefult, null));
            for (var i = 0; i < dataSource.length; i++) {
                var code = dataSource[i][codeField];
                var name_3 = dataSource[i][textField];
                var id = dataSource[i][codeField];
                combo.add(new Option(name_3, code));
            }
            //add empty
            combo.add(new Option(EmptyChoiceName, "-1"));
        }
    },
    FillCombowithdefult: function (dataSource, combo, codeField, textField, NameDefult) {
        if (combo != null) {
            for (var i = combo.length; i >= 0; i--) {
                combo.remove(i);
            }
            combo.add(new Option(NameDefult, null));
            for (var i = 0; i < dataSource.length; i++) {
                var code = dataSource[i][codeField];
                var name_4 = dataSource[i][textField];
                var id = dataSource[i][codeField];
                //var x = true;
                //if (x==true) {
                //    $("#name").attr('id', id);
                //}
                //let test = 
                combo.add(new Option(name_4, code));
                //
            }
        }
    },
    //Filldefult: (combo: HTMLSelectElement, codeField: any, textField: any, NameDefult: any) => {
    //    if (combo != null) {
    //        for (let i: number = combo.length; i >= 0; i--) {
    //            combo.remove(i);
    //        }
    //        combo.add(new Option(NameDefult, null));              
    //    }
    //},
    FillComboWithEmpty: function (dataSource, combo, codeField, textField) {
        for (var i = combo.length; i >= 0; i--) {
            combo.remove(i);
        }
        combo.add(new Option("", ""));
        for (var i = 0; i < dataSource.length; i++) {
            var code = dataSource[i][codeField];
            var name_5 = dataSource[i][textField];
            combo.add(new Option(name_5, code));
        }
    },
    GetElementById: function (id) {
        var element = document.getElementById(id);
        return element;
    },
    CreateElement: function (id) {
        var element = document.createElement(id);
        return element;
    }
};
function DateFormatddmmyyyy(dateForm) {
    try {
        var date = new Date();
        var myDate = "";
        if (dateForm.indexOf("Date(") > -1) {
            myDate = dateForm.split('(')[1].split(')')[0];
            date = new Date(Number(myDate));
        }
        else {
            date = new Date(ConvertTDate(dateForm).toString());
        }
        var yy = date.getFullYear();
        var mm = (date.getMonth() + 1);
        var dd = date.getDate();
        var year = yy;
        var month = (mm < 10) ? ("0" + mm.toString()) : mm.toString();
        var day = (dd < 10) ? ("0" + dd.toString()) : dd.toString();
        var startDate = year + "-" + month + "-" + day;
        var form_date = startDate;
        return form_date;
    }
    catch (e) {
        return DateFormat((new Date()).toString());
    }
}
function DateFormat(dateForm) {
    try {
        var date = new Date();
        var myDate = "";
        if (dateForm.indexOf("Date(") > -1) {
            myDate = dateForm.split('(')[1].split(')')[0];
            date = new Date(Number(myDate));
        }
        else {
            date = new Date(dateForm);
        }
        var yy = date.getFullYear();
        var mm = (date.getMonth() + 1);
        var dd = date.getDate();
        var year = yy;
        var month = (mm < 10) ? ("0" + mm.toString()) : mm.toString();
        var day = (dd < 10) ? ("0" + dd.toString()) : dd.toString();
        //The specified value "'2018-01-15'" does not conform to the required format, "yyyy-MM-dd".
        var startDate = year + "-" + month + "-" + day;
        var form_date = startDate;
        return form_date;
    }
    catch (e) {
        return DateFormat((new Date()).toString());
    }
}
function DateFormatRep(dateForm) {
    try {
        var date = new Date();
        var myDate = "";
        if (dateForm.indexOf("Date(") > -1) {
            myDate = dateForm.split('(')[1].split(')')[0];
            date = new Date(Number(myDate));
        }
        else {
            date = new Date(dateForm);
        }
        var yy = date.getFullYear();
        var mm = (date.getMonth() + 1);
        var dd = date.getDate();
        var year = yy;
        var month = (mm < 10) ? ("0" + mm.toString()) : mm.toString();
        var day = (dd < 10) ? ("0" + dd.toString()) : dd.toString();
        //The specified value "'2018-01-15'" does not conform to the required format, "dd/MM/yyyy".
        var startDate = day + "/" + month + "/" + year;
        return startDate;
    }
    catch (e) {
        return DateFormatRep((new Date()).toString());
    }
}
function GetTime() {
    var date = new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? 0 + minutes : minutes;
    //var strTime = hours + ':' + minutes + ' ' + ampm;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    var TrTime = strTime;
    return TrTime;
}
function GetVat(Nature, Prc, VatType) {
    var Tax_Type_Model = new Tax_Type();
    if (VatType == 1 || VatType == 7 || VatType == 4) {
        Tax_Type_Model.Nature = Nature;
        Tax_Type_Model.Prc = Prc;
        Tax_Type_Model.VatType = VatType;
        return Tax_Type_Model;
    }
    if (VatType == 5 || VatType == 2) {
        Tax_Type_Model.Nature = 2;
        Tax_Type_Model.Prc = 0;
        Tax_Type_Model.VatType = VatType;
        return Tax_Type_Model;
    }
    if (VatType == 3 || VatType == 6) {
        Tax_Type_Model.Nature = 4;
        Tax_Type_Model.Prc = 0;
        Tax_Type_Model.VatType = VatType;
        return Tax_Type_Model;
    }
}
function DateTimeFormat2(dateForm) {
    try {
        var date = new Date();
        var myDate = "";
        if (dateForm.indexOf("Date(") > -1) {
            myDate = dateForm.split('(')[1].split(')')[0];
            date = new Date(Number(myDate));
        }
        else {
            date = new Date(dateForm);
        }
        var yy = date.getFullYear();
        var mm = (date.getMonth() + 1);
        var dd = date.getDate();
        var hh = (date.getHours());
        var mn = (date.getMinutes());
        var ss = (date.getSeconds());
        var year = yy;
        var month = (mm < 10) ? ("0" + mm.toString()) : mm.toString();
        var day = (dd < 10) ? ("0" + dd.toString()) : dd.toString();
        var hour = (hh < 10) ? ("0" + hh.toString()) : hh.toString();
        var Minute = (mn < 10) ? ("0" + mn.toString()) : mn.toString();
        var Second = (ss < 10) ? ("0" + ss.toString()) : ss.toString();
        var startDate = year + "-" + month + "-" + day + " " + hour + ":" + Minute; //+ ":" + Second;
        var form_date = startDate;
        return form_date;
    }
    catch (e) {
        return DateFormat((new Date()).toString());
    }
}
function DateTimeFormat(dateForm) {
    try {
        var date = new Date();
        var myDate = "";
        if (dateForm.indexOf("Date(") > -1) {
            myDate = dateForm.split('(')[1].split(')')[0];
            date = new Date(Number(myDate));
        }
        else {
            date = new Date(dateForm);
        }
        var yy = date.getFullYear();
        var mm = (date.getMonth() + 1);
        var dd = date.getDate();
        var hh = (date.getHours());
        var mn = (date.getMinutes());
        var ss = (date.getSeconds());
        var year = yy;
        var month = (mm < 10) ? ("0" + mm.toString()) : mm.toString();
        var day = (dd < 10) ? ("0" + dd.toString()) : dd.toString();
        var hour = (hh < 10) ? ("0" + hh.toString()) : hh.toString();
        var Minute = (mn < 10) ? ("0" + mn.toString()) : mn.toString();
        var Second = (ss < 10) ? ("0" + ss.toString()) : ss.toString();
        var startDate = year + "-" + month + "-" + day + "T" + hour + ":" + Minute; //+ ":" + Second;
        var form_date = startDate;
        return form_date;
    }
    catch (e) {
        return DateFormat((new Date()).toString());
    }
}
function DateStartMonth() {
    var sys = new SystemTools();
    var todaystr = ConvertToDateDash(GetDate()) <= ConvertToDateDash(sys.SysSession.CurrentEnvironment.EndDate) ? GetDate() : sys.SysSession.CurrentEnvironment.EndDate;
    var dateString = todaystr;
    var yyyy = dateString.substring(0, 4);
    var mm = dateString.substring(5, 7);
    var dd = dateString.substring(8, 10);
    var ReturnedDate;
    ReturnedDate = yyyy + '-' + mm + '-' + '01';
    return ReturnedDate;
}
function ConvertToDateDash(date) {
    try {
        var x = date.split(" ");
        var dt = x[0].split("-");
        var year = dt[0];
        var month = dt[1];
        var day = dt[2];
        var startDate = year + "-" + month + "-" + day + "T00:00:00";
        var form_date = new Date(startDate);
        return form_date;
    }
    catch (e) {
        return (GetCurrentDate());
    }
}
function ConvertToDate(date) {
    try {
        var x = date.split(" ");
        var dt = x[0].split("/");
        var tm = x[1].split(":");
        var st = x[2];
        var day = dt[0];
        var month = dt[1];
        var year = dt[2];
        var hour = tm[0];
        var Minute = tm[1];
        var Second = tm[2];
        var startDate = year + "-" + month + "-" + day + "T" + hour + ":" + Minute + ":" + Second;
        var form_date = new Date(startDate);
        return form_date;
    }
    catch (e) {
        return (GetCurrentDate());
    }
}
function DateTimeFormatWithoutT(dateForm) {
    try {
        var date = new Date();
        var myDate = "";
        if (dateForm.indexOf("Date(") > -1) {
            myDate = dateForm.split('(')[1].split(')')[0];
            date = new Date(Number(myDate));
        }
        else {
            date = new Date(dateForm);
        }
        var yy = date.getFullYear();
        var mm = (date.getMonth() + 1);
        var dd = date.getDate();
        var hh = (date.getHours());
        var mn = (date.getMinutes());
        var ss = (date.getSeconds());
        var year = yy;
        var month = (mm < 10) ? ("0" + mm.toString()) : mm.toString();
        var day = (dd < 10) ? ("0" + dd.toString()) : dd.toString();
        var hour = (hh < 10) ? ("0" + hh.toString()) : hh.toString();
        var Minute = (mn < 10) ? ("0" + mn.toString()) : mn.toString();
        var Second = (ss < 10) ? ("0" + ss.toString()) : ss.toString();
        var startDate = year + "-" + month + "-" + day + " " + hour + ":" + Minute; //+ ":" + Second;
        var form_date = new Date(startDate);
        return form_date.toLocaleString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true });
    }
    catch (e) {
        return DateFormat(new Date().toString());
    }
}
function ConvertTDate(date) {
    try {
        var x = date.split(" ");
        var dt = x[0].split("/");
        var day = dt[0];
        var month = dt[1];
        var year = dt[2];
        var startDate = year + "-" + month + "-" + day;
        var form_date = new Date(startDate);
        return form_date;
    }
    catch (e) {
        return (GetCurrentDate());
    }
}
function ClearGrid(_Grid, arr) {
    if (_Grid === void 0) { _Grid = new JsGrid(); }
    arr = new Array();
    _Grid.DataSource = arr;
    _Grid.Bind();
}
function HeaderTemplate(headerTitle, element) {
    var tbl = DocumentActions.CreateElement("table");
    tbl.style.width = "100%";
    var headerTr = DocumentActions.CreateElement("tr");
    headerTr.innerHTML = "<td style='text-align:center;'>" + headerTitle + "</td>";
    var cellTr = DocumentActions.CreateElement("tr");
    var cell = DocumentActions.CreateElement("td");
    cell.style.textAlign = "center";
    cell.appendChild(element);
    cellTr.appendChild(cell);
    tbl.appendChild(headerTr);
    tbl.appendChild(cellTr);
    return tbl;
}
//eslam 25 oct 2020
function HeaderTemplate_ThreeElements(headerTitle, element_1, element_2) {
    var tbl = DocumentActions.CreateElement("table");
    tbl.style.width = "100%";
    var headerTr = DocumentActions.CreateElement("tr");
    headerTr.innerHTML = "<td style='text-align:center;'>" + headerTitle + "</td>";
    var cellTr = DocumentActions.CreateElement("tr");
    var cell = DocumentActions.CreateElement("td");
    cell.style.textAlign = "center";
    cell.appendChild(element_1);
    cell.appendChild(element_2);
    cellTr.appendChild(cell);
    tbl.appendChild(headerTr);
    tbl.appendChild(cellTr);
    return tbl;
}
var Resources = /** @class */ (function () {
    function Resources() {
    }
    return Resources;
}());
function CreateElement(typeElement, className, defaultValue, minValue, id, step) {
    typeElement = typeElement.toLocaleLowerCase();
    var element = DocumentActions.CreateElement("input");
    element.className = className;
    element.id = "h_" + id;
    element.type = typeElement;
    element.value = defaultValue;
    element.min = minValue;
    element.step = step;
    return element;
}
//eslam 25 oct 2020
function CreateLabelElement(defaultValue, id) {
    var element = DocumentActions.CreateElement("label");
    element.style.textAlign = "center";
    element.id = id;
    element.innerText = defaultValue;
    return element;
}
function SetSearchControlName(id) {
    $("#SearchControlName").val(id);
}
var CodeDesciptionModel = /** @class */ (function () {
    function CodeDesciptionModel() {
    }
    return CodeDesciptionModel;
}());
function WorningMessage(msg_Ar, msg_En, tit_ar, tit_en, OnOk) {
    if (tit_ar === void 0) { tit_ar = "تنبيه"; }
    if (tit_en === void 0) { tit_en = "Worning"; }
    var Env = GetSystemEnvironment();
    switch (Env.ScreenLanguage) {
        case "ar":
            MessageBox.Show(msg_Ar, tit_ar, OnOk);
            focus();
            break;
        case "en":
            MessageBox.Show(msg_En, tit_en, OnOk);
            focus();
            break;
    }
}
function DisplayMassage(msg_Ar, msg_En, msg_type, OnOk) {
    var Env = GetSystemEnvironment();
    // msgtype : 1 : Sucess , 2: Fetal Error , 3: Data Entry Error 
    if (Env.ScreenLanguage == "en")
        $('#Text_Massage').html(msg_En);
    else
        $('#Text_Massage').html(msg_Ar);
    $('#DivMassage').removeClass("display_none");
    if (msg_type == '1') {
        $('#DivMassage .alert-message').attr("Class", "toast align-items-center text-white border-0 alert-message show bg-success");
        $('#DivMassage #icon_Massage').attr("Class", "fas fa-check-circle pe-3");
    }
    else if (msg_type == '2') {
        $('#DivMassage .alert-message').attr("Class", "toast align-items-center text-white border-0 alert-message show bg-danger");
        $('#DivMassage #icon_Massage').attr("Class", "fas fa-times-circle pe-3");
    }
    else if (msg_type == '3') {
        $('#DivMassage .alert-message').attr("Class", "toast align-items-center text-white border-0 alert-message show bg-orange");
        $('#DivMassage #icon_Massage').attr("Class", "fas fa-exclamation-triangle pe-3");
    }
    setTimeout(function () { $('#DivMassage').addClass("display_none"); }, 6000);
}
function DisplayMassage_Processes(msg_Ar, msg_En, msg_type, OnOk) {
    var Env = GetSystemEnvironment();
    // msgtype : 1 : Sucess , 2: Fetal Error , 3: Data Entry Error 
    if (Env.ScreenLanguage == "en")
        $('#Text_Massage').html(msg_En);
    else
        $('#Text_Massage').html(msg_Ar);
    if (msg_type == '1') {
        $('#DivMassage .alert-message').attr("Class", "toast align-items-center text-white border-0 alert-message show bg-success");
    }
    else if (msg_type == '2') {
        $('#DivMassage .alert-message').attr("Class", "toast align-items-center text-white border-0 alert-message show bg-danger");
    }
    else if (msg_type == '3') {
        $('#DivMassage .alert-message').attr("Class", "toast align-items-center text-white border-0 alert-message show bg-orange");
    }
    setTimeout(function () { $('#DivMassage').addClass("display_none"); }, 6000);
    //if (msg_type == '1') {
    //    $('#DivMassage').attr('class', 'col-lg-12  margingred  borderred');
    //    $('#DivMassage').attr('style', ' border-style: solid;border: solid;border-color: #5cb702; background-color : #000000 !important	');
    //    $('#Text_Massage').attr('style', 'text-align: center;font-weight: bold;color: #5cb702;margin-top: 14px; font-size: 24px; margin-left: 10%; margin-right: 6%;');
    //    setTimeout(function () { $('#DivMassage').attr('style', ' border-style: solid;border: solid;border-color: #5cb702; display: none; '); }, 7000);
    //}
    //else if (msg_type == '2') {
    //    $('#DivMassage').attr('class', 'col-lg-12  margingred  borderred');
    //    $('#DivMassage').attr('style', ' border-style: solid;border: solid;border-color: #e41b1b; background-color : #000000 !important	');
    //    $('#Text_Massage').attr('style', 'text-align: center;font-weight: bold;color: #e41b1b;margin-top: 14px; font-size: 24px; margin-left: 10%;  margin-right: 6%;');
    //    setTimeout(function () { $('#DivMassage').attr('style', ' border-style: solid;border: solid;border-color: #e41b1b; display: none; '); }, 7000);
    //}
    //else if (msg_type == '3') {
    //    $('#DivMassage').attr('class', 'col-lg-12  margingred  borderred');
    //    $('#DivMassage').attr('style', ' border-style: solid;border: solid;border-color: #f0ad4e; background-color : #000000 !important	');
    //    $('#Text_Massage').attr('style', 'text-align: center;font-weight: bold;color: #f0ad4e;margin-top: 14px; font-size: 24px; margin-left: 10%;  margin-right: 6%;');
    //    setTimeout(function () { $('#DivMassage').attr('style', ' border-style: solid;border: solid;border-color: #e41b1b; display: none; '); }, 7000);
    //}
}
function Errorinput(input) {
    var id = '';
    if (input.selector != null) {
        $('' + input.selector + '').addClass('text_Mandatory');
        $('' + input.selector + '').focus();
        setTimeout(function () { $('' + input.selector + '').removeClass('text_Mandatory'); }, 5000);
    }
    else {
        try {
            id = input.getAttribute('id');
        }
        catch (e) {
            id = input[0].id;
        }
        $('#' + id + '').addClass('text_Mandatory');
        $('#' + id + '').focus();
        setTimeout(function () { $('#' + id + '').removeClass('text_Mandatory'); }, 5000);
        $('#select2-' + id + '-container').addClass('text_Mandatory');
        $('#select2-' + id + '-container').focus();
        setTimeout(function () { $('#select2-' + id + '-container').removeClass('text_Mandatory'); }, 5000);
    }
}
function findIndexInData(data, property, value) {
    var result = -1;
    data.some(function (item, i) {
        if (item[property] === value) {
            result = i;
            return true;
        }
    });
    return result;
}
function ConfirmMessage(msg_Ar, msg_En, tit_ar, tit_en, OnOk) {
    if (msg_Ar === void 0) { msg_Ar = "تمت عملية الحفظ  بنجاح"; }
    if (msg_En === void 0) { msg_En = "Data Saved Successfully"; }
    if (tit_ar === void 0) { tit_ar = "تأكيد"; }
    if (tit_en === void 0) { tit_en = "Confirm"; }
    var Env = GetSystemEnvironment();
    switch (Env.ScreenLanguage) {
        case "ar":
            MessageBox.Show(msg_Ar, tit_ar, OnOk);
            break;
        case "en":
            MessageBox.Show(msg_En, tit_en, OnOk);
            break;
    }
}
function ConfirmMessagee(msg_Ar, msg_En, tit_ar, tit_en, OnOk) {
    if (msg_Ar === void 0) { msg_Ar = "تمت عملية الحفظ  بنجاح"; }
    if (msg_En === void 0) { msg_En = "Data Saved Successfully"; }
    if (tit_ar === void 0) { tit_ar = "تأكيد"; }
    if (tit_en === void 0) { tit_en = "Confirm"; }
    var Env = GetSystemEnvironment();
    switch (Env.ScreenLanguage) {
        case "ar":
            MessageBox.Show(msg_Ar, tit_ar, OnOk);
            return 1;
        case "en":
            MessageBox.Show(msg_En, tit_en, OnOk);
            return 1;
    }
}
function WorningMessageDailog(msg_Ar, msg_En, tit_ar, tit_en, OnOk, OnCancel) {
    if (tit_ar === void 0) { tit_ar = "تنبيه"; }
    if (tit_en === void 0) { tit_en = "Worning"; }
    var Env = GetSystemEnvironment();
    switch (Env.ScreenLanguage) {
        case "ar":
            MessageBox.Ask(msg_Ar, tit_ar, OnOk, OnCancel);
            break;
        case "en":
            MessageBox.Ask(msg_En, tit_en, OnOk, OnCancel);
            break;
    }
}
//function MessageDailog(msg_Ar: string, msg_En: string, tit_ar: string = "تنبيه", tit_en: string = "Worning") {
//     
//    switch (SysSession.CurrentEnvironment.ScreenLanguage) {
//        case "ar":
//            MessageBox.MSgBox(msg_Ar, tit_ar);
//            break;
//        case "en":
//            MessageBox.MSgBox(msg_En, tit_en);
//            break;
//    }
//}
function AddDate(prd, Sdate, count) {
    var Tdate;
    Tdate = Sdate; //new Date();
    switch (prd) {
        case 1: //hours
            Tdate.setHours(Sdate.getHours() + count);
            break;
        case 2: //Days
            Tdate.setDate(Sdate.getDate() + (count - 1));
            break;
        case 3: //week
            Tdate.setDate(Sdate.getDate() + ((7 * count) - 1));
            break;
        case 4: //month
            // Loop from cur month with Qty * Prd times 
            Tdate = Sdate;
            Tdate.setMonth(Tdate.getMonth() + count);
            Tdate.setDate(Tdate.getDate() + -1);
            break;
        case 5: //year
            // add 365 or 366 days 
            Tdate = Sdate;
            Tdate.setFullYear(Tdate.getFullYear() + count);
            Tdate.setDate(Tdate.getDate() + -1);
            break;
    }
    return Tdate;
}
function GetResourceByName(Sourcekey) {
    var result = "";
    Ajax.Callsync({
        url: Url.Action("GetResourceByName", "ClientTools"),
        data: { key: Sourcekey },
        success: function (d) {
            result = d.result;
        }
    });
    return result;
}
function GetResourceList(Sourcekey) {
    var result = Ajax.Call({
        url: Url.Action("GetResourceNames", "ClientTools"),
        data: { _prefix: Sourcekey },
        success: function (d) {
            result = JSON.parse(d.result);
        }
    });
    return result;
}
function GetCurrentDate() {
    //  
    var ses = GetSystemEnvironment();
    var kControl = ses.I_Control;
    if (kControl != undefined) {
        var now = new Date;
        var utc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
        utc.setHours(utc.getHours() + kControl.UserTimeZoneUTCDiff);
        return utc;
    }
    else {
        return (new Date());
    }
}
// Doha
function GetDate() {
    var today = new Date();
    var dd = today.getDate().toString();
    var ReturnedDate;
    var mm = (today.getMonth() + 1).toString();
    var yyyy = today.getFullYear();
    if (Number(dd) < 10) {
        dd = ('0' + dd);
    }
    if (Number(mm) < 10) {
        mm = ('0' + mm);
    }
    ReturnedDate = yyyy + '-' + mm + '-' + dd;
    return ReturnedDate;
}
function CreateDropdownList(arr, Name_Ar, Name_En, Key, IsSelectNull) {
    if (IsSelectNull === void 0) { IsSelectNull = false; }
    var Env = GetSystemEnvironment();
    var element = document.createElement("select");
    element.className = "form-control input-sm";
    if (IsSelectNull == true)
        element.options.add(new Option(" ", "null"));
    switch (Env.Language) {
        case "ar":
            for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
                var item = arr_1[_i];
                element.options.add(new Option(item[Name_Ar], item[Key]));
            }
            break;
        case "en":
            for (var _a = 0, arr_2 = arr; _a < arr_2.length; _a++) {
                var item = arr_2[_a];
                element.options.add(new Option(item[Name_En], item[Key]));
            }
            break;
    }
    return element;
}
//eslam elassal 20 oct 2020 => CreateDropdownListWithDefaultValue(K_D_ExpensesDataSource, "DescA", "DescE", "ExpenseID", "اختر",true);s
function CreateDropdownListWithDefaultValue(arr, Name_Ar, Name_En, Key, DefaultVal, IsSelectNull) {
    if (IsSelectNull === void 0) { IsSelectNull = false; }
    var Env = GetSystemEnvironment();
    var element = document.createElement("select");
    element.className = "form-control input-sm";
    if (IsSelectNull == true)
        element.options.add(new Option(DefaultVal, "null"));
    switch (Env.Language) {
        case "ar":
            for (var _i = 0, arr_3 = arr; _i < arr_3.length; _i++) {
                var item = arr_3[_i];
                element.options.add(new Option(item[Name_Ar], item[Key]));
            }
            break;
        case "en":
            for (var _a = 0, arr_4 = arr; _a < arr_4.length; _a++) {
                var item = arr_4[_a];
                element.options.add(new Option(item[Name_En], item[Key]));
            }
            break;
    }
    return element;
}
//function CreateListMaleFemale(): HTMLSelectElement {
//    var offDay = [
//        {
//            Name_Ar: "ولد",
//            Name_En: "Male",
//            Id: 1
//        },
//        {
//            Name_Ar: "بنت",
//            Name_En: "Female",
//            Id: 0
//        },
//    ];
//    let element = document.createElement("select") as HTMLSelectElement;
//    element.className = "form-control input-sm";
//    switch (SharedWork.Session.Language) {
//        case "ar":
//            for (var item of offDay) {
//                element.options.add(new Option(item.Name_Ar, item.Id.toString()));
//            }
//            break;
//        case "en":
//            for (var item of offDay) {
//                element.options.add(new Option(item.Name_En, item.Id.toString()));
//            }
//            break;
//    }
//    return element;
//}
function OpenPopUp(moduleCode, PopupBody, PopupDialog) {
    var json = $.ajax({
        type: "GET",
        url: "OpenView",
        data: { ModuleCode: moduleCode },
        cache: false,
        async: false,
        success: function (response) {
            $("#" + PopupBody).html(response);
            //$("#PopupDialog").modal("show");
            $("#" + PopupDialog).modal('show');
            $("#" + PopupDialog).modal({
                refresh: true
            });
            //var val = $("#rpTitle").text();
            //$("#TitleSpanRep").html(val);
        }
    });
}
//to be validated  in insert / update all trnasacations 
function CheckDate(TrDate, StDt, EdDt) {
    //// 
    var check = Date.parse(TrDate);
    var from = Date.parse(StDt);
    var to = Date.parse(EdDt);
    if ((check <= to && check >= from))
        return (true);
    else
        return false;
}
function ThousandsSeparator(num) {
    var numAsString = num.toString();
    var characters = numAsString.split("").reverse();
    var parts = [];
    for (var i = 0; i < characters.length; i += 3) {
        var part = characters.slice(i, i + 3).reverse().join("");
        parts.unshift(part);
    }
    return parts.join(",");
}
function convertToH(date) {
    var sys = new SystemTools();
    var HDate = "";
    if (date != "")
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("SystemTools", "GetHDate"),
            data: { GDate: date },
            success: function (d) {
                var result = d;
                HDate = result;
            }
        });
    return HDate;
}
function convertToG(date) {
    var sys = new SystemTools();
    var result = null;
    if (date != "")
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("Tools", "GetGDate"),
            data: { HDate: date },
            success: function (d) {
                result = d;
                //GDate = result;
                //  ;
            }
        });
    return result;
}
//function CheckTime() {
//    try {
//        var SysSession = GetSystemEnvironment();
//        var timelogin;
//        var dt = new Date();
//        var timenow = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
//        var LastAccess = localStorage.getItem("LastAccess");
//        var SysTimeOut = localStorage.getItem("startTimeOut");
//        timelogin = LastAccess
//        var timeout = CompareTime(timenow, timelogin);
//        localStorage.setItem("LastAccess", timenow)
//        var newSysTimeOut;
//        try {
//            if (SysSession.I_Control[0].SysTimeOut == null) {
//                newSysTimeOut = 10;
//            }
//            else {
//                newSysTimeOut = SysSession.I_Control[0].SysTimeOut;
//            }
//        } catch (e) {
//            newSysTimeOut = 10;
//        }
//        if (timeout > newSysTimeOut || timeout < 0)
//            MessageBox.Show("لقد استنفذت وقت الجلسة، يجب معاودة الدخول مرة اخري ", "System Time out , Please relogin ", function () {
//                document.cookie = "Inv1_systemProperties=" + null + ";expires=Fri, 31 Dec 2030 23:59:59 GMT;path=/";
//                //document.cookie = "Inv1_Privilage=" + null + ";expires=Fri, 31 Dec 2030 23:59:59 GMT;path=/";
//                //document.cookie = "Privilage=" + null + ";expires=Fri, 31 Dec 2030 23:59:59 GMT;path=/";
//                window.location.href = "/Login/HomePage";
//            }), 1000;
//    } catch (e) {
//    }
//}
function daysDifference(dateI1, dateI2) {
    debugger;
    //define two date object variables to store the date values
    var date1 = new Date(dateI1);
    var date2 = new Date(dateI2);
    //calculate time difference
    var time_difference = date2.getTime() - date1.getTime();
    //calculate days difference by dividing total milliseconds in a day
    var result = time_difference / (1000 * 60 * 60 * 24);
    return parseInt(result.toString());
}
function addDaysOrMonth(date, days, Month) {
    var result = new Date(date);
    days != 0 ? result.setDate(result.getDate() + days) : days = 0;
    Month != 0 ? result.setMonth(result.getMonth() + Month) : Month = 0;
    var today = result;
    var dd = today.getDate().toString();
    var ReturnedDate;
    var mm = (today.getMonth() + 1).toString();
    var yyyy = today.getFullYear();
    if (Number(dd) < 10) {
        dd = ('0' + dd);
    }
    if (Number(mm) < 10) {
        mm = ('0' + mm);
    }
    ReturnedDate = yyyy + '-' + mm + '-' + dd;
    return ReturnedDate;
}
function Get_PriceWithVAT(item_unitprice, VatPRc, flag_PriceWithVAT) {
    // 
    var Getunitprice = new IGetunitprice();
    var New_unitprice = 0;
    if (flag_PriceWithVAT) { //  return unitprice
        New_unitprice = item_unitprice;
        New_unitprice = New_unitprice * 100 / (100 + Number(VatPRc));
        Getunitprice.unitprice = Number(New_unitprice.RoundToSt(5));
        Getunitprice.unitpricewithvat = Number(item_unitprice.RoundToSt(5));
    }
    else { //  return unitpricewithvat
        New_unitprice = item_unitprice;
        New_unitprice = New_unitprice * (100 + Number(VatPRc)) / 100;
        Getunitprice.unitprice = Number(item_unitprice.RoundToSt(5));
        Getunitprice.unitpricewithvat = Number(New_unitprice.RoundToSt(5));
    }
    return Getunitprice;
}
function ScreenHelp(ModuleCode) {
    var sys = new SystemTools();
    $.ajax({
        type: "GET",
        url: sys.apiUrl("SystemTools", "GetHelp"),
        data: { ModuleCode: ModuleCode },
        async: false,
        success: function (d) {
            // ;
            var result = d;
            var res = result.Response;
            if (res != null) {
                if (sys.SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
                    $("#modalHelpRep").html("<div style=\"direction:rtl;height: 289px;overflow: scroll;overflow-x: hidden;font-weight: bold;\" >" + res.HelpBody_Ar + "</div>");
                }
                else {
                    $("#modalHelpRep").html("<div style=\"direction:ltr;height: 289px;overflow: scroll;overflow-x: hidden;font-weight: bold;\">" + res.HelpBody_En + "</div>");
                }
            }
        }
    });
}
function CompareTime(t1, t2) {
    // add days 
    //// ;
    var h1 = Number(t1.slice(0, 2));
    var m1 = Number(t1.slice(3, 5));
    var h2 = Number(t2.slice(0, 2));
    var m2 = Number(t2.slice(3, 5));
    var h3 = (h1 - h2) * 60 + (m1 - m2);
    return h3;
}
function CheckPeriodDate(Tr_Date, Type_Period) {
    // 
    var SysSession = GetSystemEnvironment();
    //let date = new Date(Tr_Date);
    //let mm = (date.getMonth() + 1);
    //let PERIOD_CODE = mm;
    var sys = new SystemTools;
    var Details_I_Period = new Array();
    var res = true;
    if (Type_Period == "I") {
        //alert(SysSession.I_Control[0].IsInvPeriodClose);
        if (SysSession.I_Control[0].IsInvPeriodClose == true) {
            Ajax.Callsync({
                type: "Get",
                url: sys.apiUrl("I_Period", "GetPERIOD"),
                data: { CompCode: Number(SysSession.CompCode), FinYear: Number(SysSession.CurrentYear), Tr_Date: Tr_Date, UserCode: SysSession.UserCode, Token: "HGFD-" + SysSession.Token },
                success: function (d) {
                    var result = d;
                    if (result.IsSuccess) {
                        Details_I_Period = result.Response;
                        if (Details_I_Period.length > 0) {
                            if (Details_I_Period[0].Status == 0) {
                                res = true;
                            }
                            else {
                                res = false;
                            }
                        }
                    }
                }
            });
        }
    }
    return res;
}
function Cheak_UserTokenlog() {
    var SysSession = GetSystemEnvironment();
    var compCode = SysSession.CompCode;
    var branchCode = SysSession.BranchCode;
    var userCode = SysSession.UserCode;
    var sys = new SystemTools;
    Ajax.Callsync({
        type: "GET",
        url: sys.apiUrl("G_USERS", "Cheak_UserTokenlog"),
        data: { user: userCode, compcode: compCode, Branch_Code: branchCode, Token: "HGFD-" + SysSession.Token },
        success: function (d) {
            if (d == false) {
                //alert("تم تسجيل الخروج من النظام اعد التسجيل مره اخري")
                DisplayMassage("تم تسجيل الخروج من النظام اعد التسجيل مره اخري", "You logout from the system, Login again", MessageType.Error);
                localStorage.setItem("OutUesr", "0");
                document.cookie = "Inv1_systemProperties=" + null + ";expires=Fri, 31 Dec 2030 23:59:59 GMT;path=/";
                document.cookie = "Inv1_Privilage=" + null + ";expires=Fri, 31 Dec 2030 23:59:59 GMT;path=/";
                document.cookie = "Privilage=" + null + ";expires=Fri, 31 Dec 2030 23:59:59 GMT;path=/";
                window.open(Url.Action("HomePage", "Login"), "_self");
                return;
            }
        }
    });
}
;
function dynamicSort(property) {
    var sortOrder = 1;
    if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a, b) {
        /* next line works with strings and numbers,
         * and you may want to customize it to your needs
         */
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    };
}
function printDiv(divName) {
    //var printContents = document.getElementById(divName).innerHTML;
    //var originalContents = document.body.innerHTML; 
    //document.body.innerHTML = printContents;
    //window.print();
    //document.body.innerHTML = originalContents;
    debugger;
    var sOption = "toolbar=no,location=no,directories=yes,menubar=no,";
    sOption += "scrollbars=yes,width=775,height=600,left=10,top=25";
    var mywindow = window.open('', 'PRINT', sOption);
    mywindow.document.write(document.getElementById(divName).innerHTML);
    //document.getElementById('header').style.display = 'none';
    //document.getElementById('footer').style.display = 'none';
    //mywindow.document.styl
    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/ 
    mywindow.pageXOffset; // necessary for IE >= 10*/ 
    mywindow.history.back();
    mywindow.onload = function () {
        mywindow.moveTo(0, 0);
        mywindow.resizeTo(640, 480);
    };
    mywindow.print();
    mywindow.close();
}
function DateSetsSccess(TxtDateProcesses, TxtDatefrom, TxtDateend) {
    var DateProcesses = $('#' + TxtDateProcesses + '').val();
    var Datefrom = $('#' + TxtDatefrom + '').val();
    var Dateend = $('#' + TxtDateend + '').val();
    var check = Date.parse(DateProcesses);
    var from = Date.parse(Datefrom);
    var End = Date.parse(Dateend);
    if ((check < from)) {
        $('#' + TxtDatefrom + '').val(DateProcesses);
    }
    else {
        $('#' + TxtDatefrom + '').val(Datefrom);
    }
    if ((check > End)) {
        $('#' + TxtDateend + '').val(DateProcesses);
    }
    else {
        $('#' + TxtDateend + '').val(Dateend);
    }
}
function OnClick_Tree() {
    $('span').on('click', function () {
        //let ul = $(this).attr("href");
        //alert($('' + ul + '').attr("class"))
        var expanded = $(this).attr("aria-expanded");
        if (expanded == 'false') {
            $(this).attr("aria-expanded", "true");
            $(this).attr("class", "sign");
            var data_i = $(this).attr("data_i");
            var ul = $(this).attr("href");
            //alert($('' + ul + '').attr("class"))
            $('#' + data_i + '').attr("class", "fas fa-minus-circle");
            $('' + ul + '').attr("class", "children nav-child unstyled small ---");
            $('' + ul + '').attr("aria-expanded", "true");
            $('' + ul + '').attr("style", "");
        }
        else {
            $(this).attr("aria-expanded", "false");
            $(this).attr("class", "sign");
            var data_i = $(this).attr("data_i");
            var ul = $(this).attr("href");
            $('#' + data_i + '').attr("class", "fas fa-plus-circle");
            $('' + ul + '').attr("class", "children nav-child unstyled small collapse in");
            $('' + ul + '').attr("aria-expanded", "false");
            $('' + ul + '').attr("style", "height: 0px;");
        }
    });
}
function Back() {
    $('#icon-bar').addClass('display_none');
    $('#divIconbar').removeClass('display_none');
    $('#btnPrintTransaction').removeClass('display_none');
    $('#btnUpdate').removeClass('display_none');
    $('#btnBack').addClass('display_none');
    $('#btnSave').addClass('display_none');
    $('#btnPrintslip').removeClass('display_none');
    $('#btnPrintTransaction').removeClass('display_none');
    $("#NewAdd_Falg").val('0');
    $("#Mod_Flag").val('0');
}
function RemoveDisabledToolBar() {
    $('#divIconbar').removeClass('disabledDiv');
}
function DisabledToolBar() {
    $('#divIconbar').addClass('disabledDiv');
}
function Resizable_Table() {
    'use strict';
    var initResizable = function (that) {
        //Deletes the plugin to re-create it
        that.$el.colResizable({ disable: true });
        //Creates the plugin
        that.$el.colResizable({
            liveDrag: that.options.liveDrag,
            fixed: that.options.fixed,
            headerOnly: that.options.headerOnly,
            minWidth: that.options.minWidth,
            hoverCursor: that.options.hoverCursor,
            dragCursor: that.options.dragCursor,
            onResize: that.onResize,
            onDrag: that.options.onResizableDrag
        });
    };
    $.extend($.fn.bootstrapTable.defaults, {
        resizable: false,
        liveDrag: false,
        fixed: true,
        headerOnly: false,
        minWidth: 15,
        hoverCursor: 'e-resize',
        dragCursor: 'e-resize',
        onResizableResize: function (e) {
            return false;
        },
        onResizableDrag: function (e) {
            return false;
        }
    });
    var BootstrapTable = $.fn.bootstrapTable.Constructor, _toggleView = BootstrapTable.prototype.toggleView, _resetView = BootstrapTable.prototype.resetView;
    BootstrapTable.prototype.toggleView = function () {
        _toggleView.apply(this, Array.prototype.slice.apply(arguments));
        if (this.options.resizable && this.options.cardView) {
            //Deletes the plugin
            $(this.$el).colResizable({ disable: true });
        }
    };
    BootstrapTable.prototype.resetView = function () {
        var that = this;
        _resetView.apply(this, Array.prototype.slice.apply(arguments));
        if (this.options.resizable) {
            // because in fitHeader function, we use setTimeout(func, 100);
            setTimeout(function () {
                initResizable(that);
            }, 100);
        }
    };
    BootstrapTable.prototype.onResize = function (e) {
        var that = $(e.currentTarget);
        that.bootstrapTable('resetView');
        that.data('bootstrap.table').options.onResizableResize.apply(e);
    };
    $('[data-toggle="table"]').bootstrapTable();
}
var outUesr = 0;
function CheckTime() {
    var sys = new SystemTools();
    try {
        var CheckLogin = document.getElementById('btnLogin');
        if (CheckLogin != null) {
            return;
        }
        var CheckUesr = sys.SysSession.CurrentEnvironment.UserCode;
    }
    catch (e) {
        outUesr += 1;
        if (outUesr == 2) {
            localStorage.setItem("OutUesr", "1");
            window.open(Url.Action("HomePage", "Login"), "_self");
        }
        return;
    }
}
function _base64ToArrayBuffer(base64) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}
function PrintsFrom_To(Type_Trans, Name_ID, NameTable, Condation, length) {
    if (length <= 0) {
        MessageBox.Show('لا توجد فواتير ', 'تحزير');
        return;
    }
    if (length > 100) {
        MessageBox.Show('الحد الاقصي لي عدد الفواتير ( 100 )', 'تحزير');
    }
    var SysSession = GetSystemEnvironment();
    var rp = new ReportParameters();
    $('#btnPrintsFrom_To').attr('style', 'width: 104%;');
    $('#btnPrintsFrom_To').html('<i class="fa fa-spinner fa-spin lod  Loading" style="font-size: 195%;z-index: 99999;"></i>');
    setTimeout(function () {
        $('#btnPrintsFrom_To').attr('style', 'width: 104%;');
        $('#btnPrintsFrom_To').html(' جاري تنزيل الفواتير <span class="glyphicon glyphicon-file"></span>  <i class="fa fa-spinner fa-spin lod  Loading" style="font-size: 195% !important;z-index: 99999;"></i>');
        $('#btnPrintsFrom_To').attr('disabled', 'disabled');
    }, 200);
    rp.CompCode = SysSession.CompCode;
    rp.BranchCode = SysSession.BranchCode;
    rp.CompNameA = SysSession.CompanyNameAr;
    rp.CompNameE = SysSession.CompanyName;
    rp.UserCode = SysSession.UserCode;
    rp.Tokenid = SysSession.Token;
    rp.ScreenLanguage = SysSession.ScreenLanguage;
    rp.SystemCode = SysSession.SystemCode;
    rp.SubSystemCode = SysSession.SubSystemCode;
    rp.BraNameA = SysSession.BranchName;
    rp.BraNameE = SysSession.BranchName;
    rp.DocPDFFolder = SysSession.I_Control[0].DocPDFFolder;
    rp.LoginUser = SysSession.UserCode;
    rp.Type_Trans = Type_Trans;
    rp.Name_ID = Name_ID;
    rp.NameTable = NameTable;
    rp.Condation = Condation;
    if (Type_Trans == "AccReceive") {
        rp.Repdesign = 1;
    }
    if (Type_Trans == "AccPayment") {
        rp.Repdesign = 2;
    }
    rp.FinYear = Number(SysSession.CurrentYear);
    Ajax.CallAsync({
        url: Url.Action("Prnt_From_To", "GeneralRep"),
        data: rp,
        success: function (d) {
            var result = d;
            $('#btnPrintsFrom_To').attr('style', '');
            $('#btnPrintsFrom_To').html(' <span class="glyphicon glyphicon-file"></span>    تنزيل ملف بطباعة الحركة المختارية PDF');
            $('#btnPrintsFrom_To').removeAttr('disabled');
            //alert(result);
            //debugger
            //window.open(result, "blank");
            var x = Url.Action("OpenPdf", "Home");
            var UrlPdf = x + "/" + "?" + "path=" + result + "";
            window.open(UrlPdf, "blank");
            return result;
        }
    });
    return '';
}
function SendInv_to_Cust(data_New) {
    var SysSession = GetSystemEnvironment();
    data_New.CompCode = SysSession.CompCode;
    data_New.BranchCode = SysSession.BranchCode;
    data_New.CompNameA = SysSession.CompanyNameAr;
    data_New.CompNameE = SysSession.CompanyName;
    data_New.UserCode = SysSession.UserCode;
    data_New.Tokenid = SysSession.Token;
    data_New.ScreenLanguage = SysSession.ScreenLanguage;
    data_New.SystemCode = SysSession.SystemCode;
    data_New.SubSystemCode = SysSession.SubSystemCode;
    data_New.BraNameA = SysSession.BranchName;
    data_New.BraNameE = SysSession.BranchName;
    data_New.DocPDFFolder = SysSession.I_Control[0].DocPDFFolder;
    data_New.LoginUser = SysSession.UserCode;
    data_New.Send_Pdf = 1;
    if (data_New.BraNameA == null || data_New.BraNameE == null) {
        data_New.BraNameA = " ";
        data_New.BraNameE = " ";
    }
    setTimeout(function () {
        $('#btnSend').attr('style', 'position: fixed;top: auto;bottom: 4px;left: 0%;');
        $('#btnSend').html(' جاري ارسال <span class="glyphicon glyphicon-file"></span>  <i class="fa fa-spinner fa-spin lod  Loading" style="font-size: 195% !important;z-index: 99999;"></i>');
        $('#btnSend').attr('disabled', 'disabled');
    }, 200);
    var baseDocUUID = "( " + data_New.TrNo.toString() + " )_" + data_New.TrDate.toString() + "_" + data_New.Module + "_" + SysSession.CompCode + "_" + SysSession.BranchCode;
    data_New.DocUUID = baseDocUUID;
    //data_New.DocUUID = window.btoa(baseDocUUID);
    //alert(data_New.DocUUID)
    Ajax.CallAsync({
        url: Url.Action("" + data_New.Name_function + "", "GeneralRep"),
        data: data_New,
        success: function (d) {
            var result = d;
            var res = window.btoa("" + result + "");
            //$('#printableArea').html("" + result + "");
            $('#printableArea').html("");
            var x = Url.Action("OpenPdfCust", "Home");
            var UrlPdf = x + "/" + "?" + "NameInv=" + res + "";
            alert(UrlPdf);
            //SendMessg(Number(SysSession.CompCode), data_New.Title_Mess, UrlPdf, data_New.ContactMobile, data_New.TRId)
            $('#btnSend').attr('style', 'position: fixed;top: auto;bottom: 4px;');
            $('#btnSend').html('<i class="fas fa-file-pdf fa-fw side-icon ms-1"></i> <span class="align-self-center mb-3">  ارسال PDF</span>');
            $('#btnSend').removeAttr('disabled');
        }
    });
}
function SendMessg(CompCode, HdMsg, DetMsg, ContactMobile, TrID) {
    debugger;
    var sys = new SystemTools;
    Ajax.Callsync({
        type: "Get",
        url: sys.apiUrl("SystemTools", "SendMessage"),
        data: { CompCode: CompCode, HdMsg: HdMsg, DetMsg: DetMsg, ContactMobile: ContactMobile, TrID: TrID },
        success: function (d) {
            var result = d;
            if (result.IsSuccess) {
                debugger;
                var res = result.Response;
                MessageBox.Show(res, "خطأ");
                //alert(res)
            }
        }
    });
}
function PrintTransactionLog(UserCode, compcode, BranchCode, ModuleCode, FinYear, TRId) {
    var sys = new SystemTools();
    Ajax.CallAsync({
        type: "GET",
        url: sys.apiUrl("SystemTools", "InsertLog"),
        data: { UserCode: UserCode, compcode: compcode, BranchCode: BranchCode, ModuleCode: ModuleCode, FinYear: FinYear, TRId: TRId },
        success: function (response) {
        }
    });
}
function PrintReportLog(UserCode, compcode, BranchCode, ModuleCode, FinYear) {
    debugger;
    var sys = new SystemTools();
    Ajax.CallAsync({
        type: "GET",
        url: sys.apiUrl("SystemTools", "PrintliestLog"),
        data: { UserCode: UserCode, compcode: compcode, BranchCode: BranchCode, FinYear: FinYear, ModuleCode: ModuleCode },
        success: function (response) {
        }
    });
}
function PrintReportLogOperation(UserCode, compcode, BranchCode, ModuleCode, FinYear, ExtraData) {
    debugger;
    var sys = new SystemTools();
    Ajax.CallAsync({
        type: "GET",
        url: sys.apiUrl("SystemTools", "InsertLogOperation"),
        data: { UserCode: UserCode, compcode: compcode, BranchCode: BranchCode, FinYear: FinYear, ModuleCode: ModuleCode, ExtraData: ExtraData },
        success: function (response) {
        }
    });
}
function OpenScreen(UserCode, compcode, BranchCode, ModuleCode, FinYear) {
    debugger;
    var sys = new SystemTools();
    Ajax.CallAsync({
        type: "GET",
        url: sys.apiUrl("SystemTools", "OpenScreenLog"),
        data: { UserCode: UserCode, compcode: compcode, BranchCode: BranchCode, FinYear: FinYear, ModuleCode: ModuleCode },
        success: function (response) {
        }
    });
}
function DoubleClickLog(UserCode, compcode, BranchCode, ModuleCode, FinYear, TRId) {
    var sys = new SystemTools();
    Ajax.CallAsync({
        type: "GET",
        url: sys.apiUrl("SystemTools", "InsertLogDoubleClick"),
        data: { UserCode: UserCode, compcode: compcode, BranchCode: BranchCode, ModuleCode: ModuleCode, FinYear: FinYear, TRId: TRId },
        success: function (response) {
        }
    });
}
//# sourceMappingURL=App.js.map