$(document).ready(function () {
    VatLists.InitializeComponent();
});
var VatLists;
(function (VatLists) {
    //************system variables
    var SysSession = GetSystemSession(Modules.VatLists);
    var sys = new SystemTools();
    var VAT_TRANS = new Array();
    var VatPeriod = new Array();
    //***********Controls
    var txtStartDate;
    var txtEndDate;
    var btnBranchSearch;
    var txtbranchCode;
    var drpSalesVatTp;
    var drpPurVatTp;
    var rd_SalesInvoice;
    var rd_SalesUpdates;
    var rd_PurchaseInvoice;
    var rd_PurchaseUpdates;
    var rd_Customer;
    var rd_Process;
    var rd_branch;
    var drpSystem;
    var drpTrans;
    var rd_SummeryRpt;
    var rd_DetailRpt;
    var chkLandscapePrint;
    //print buttons
    var btnPrintTrview;
    var btnPrintTrPDF;
    var btnPrintTrEXEL;
    var btnPrint;
    //*************************Initialization************************//
    function InitializeComponent() {
        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = "القوائم الضريبية";
        }
        else {
            document.getElementById('Screen_name').innerHTML = "Vat Lists";
        }
        $("#iconReportPages").removeClass("d-none");
        $("#icon-bar").addClass("display_none");
        $("#btnShow").addClass("display_none");
        $("#btnAdd").addClass("display_none");
        $("#btnPrintTrview").addClass("viewresult");
        $("#btnPrintTrview span").html("عرض تقرير");
        InitializeControls();
        InitializeEvents();
        debugger;
        Load_System();
        Load_Transactions();
        Load_VatTp();
        txtStartDate.value = SysSession.CurrentEnvironment.StartDate;
        txtEndDate.value = ConvertToDateDash(GetDate()) <= ConvertToDateDash(SysSession.CurrentEnvironment.EndDate) ? GetDate() : SysSession.CurrentEnvironment.EndDate;
        //*****Privilage
        btnPrint.disabled = !SysSession.CurrentPrivileges.PrintOut;
        btnPrintTrEXEL.disabled = !SysSession.CurrentPrivileges.PrintOut;
        btnPrintTrPDF.disabled = !SysSession.CurrentPrivileges.PrintOut;
        btnPrintTrview.disabled = !SysSession.CurrentPrivileges.PrintOut;
    }
    VatLists.InitializeComponent = InitializeComponent;
    function InitializeControls() {
        drpSystem = document.getElementById("drpSystem");
        drpTrans = document.getElementById("drpTrans");
        txtStartDate = document.getElementById("txtStartDate");
        txtEndDate = document.getElementById("txtEndDate");
        btnBranchSearch = document.getElementById("btnBranchSearch");
        txtbranchCode = document.getElementById("txtbranchCode");
        drpSalesVatTp = document.getElementById("drpSalesVatTp");
        drpPurVatTp = document.getElementById("drpPurVatTp");
        rd_SalesInvoice = document.getElementById("rd_SalesInvoice");
        rd_SalesUpdates = document.getElementById("rd_SalesUpdates");
        rd_PurchaseInvoice = document.getElementById("rd_PurchaseInvoice");
        rd_PurchaseUpdates = document.getElementById("rd_PurchaseUpdates");
        rd_Customer = document.getElementById("rd_Customer");
        rd_Process = document.getElementById("rd_Process");
        rd_branch = document.getElementById("rd_branch");
        rd_SummeryRpt = document.getElementById("rd_SummeryRpt");
        rd_DetailRpt = document.getElementById("rd_DetailRpt");
        chkLandscapePrint = document.getElementById("chkLandscapePrint");
        //print 
        btnPrintTrview = document.getElementById("btnPrintTrview");
        btnPrintTrPDF = document.getElementById("btnPrintTrPDF");
        btnPrintTrEXEL = document.getElementById("btnPrintTrEXEL");
        btnPrint = document.getElementById("btnPrint");
    }
    function InitializeEvents() {
        drpSystem.onchange = drpSystem_onchange;
        btnBranchSearch.onclick = btnBranchSearch_onclick;
        rd_SalesInvoice.onchange = Change_VatTp;
        rd_SalesUpdates.onchange = Change_VatTp;
        rd_PurchaseInvoice.onchange = Change_VatTp;
        rd_PurchaseUpdates.onchange = Change_VatTp;
        rd_SummeryRpt.onchange = rd_SummeryRpt_onchange;
        rd_DetailRpt.onchange = rd_DetailRpt_onchange;
        txtbranchCode.onchange = txtbranchCode_change;
        btnPrintTrview.onclick = function () { PrintReport(1); };
        btnPrintTrPDF.onclick = function () { PrintReport(2); };
        btnPrintTrEXEL.onclick = function () { PrintReport(3); };
        btnPrint.onclick = function () { PrintReport(4); };
    }
    function Load_VatTp() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GenVatType", "GetAll"),
            data: {
                UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token, CompCode: Number(SysSession.CurrentEnvironment.CompCode)
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    debugger;
                    var VatTp = result.Response;
                    var pur = VatTp.filter(function (x) { return x.TYPE == 2; }).sort(function (a, b) { return a.LineOrder - b.LineOrder; });
                    var sales = VatTp.filter(function (x) { return x.TYPE == 1; }).sort(function (a, b) { return a.LineOrder - b.LineOrder; });
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
                        DocumentActions.FillComboFirstvalue(pur, drpPurVatTp, "CODE", "DESCRIPTION", "- اختر -", null);
                        DocumentActions.FillComboFirstvalue(sales, drpSalesVatTp, "CODE", "DESCRIPTION", "- اختر -", null);
                    }
                    else {
                        DocumentActions.FillComboFirstvalue(pur, drpPurVatTp, "CODE", "DESCRIPTION", "-select -", null);
                        DocumentActions.FillComboFirstvalue(sales, drpSalesVatTp, "CODE", "DESCRIPTION", "- select -", null);
                    }
                }
            }
        });
    }
    function Load_System() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AVATTRANS", "GetDistinctSystem"),
            data: {
                UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token, compcode: Number(SysSession.CurrentEnvironment.CompCode)
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    debugger;
                    var sys_1 = result.Response;
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "ar")
                        DocumentActions.FillComboFirstvalue(sys_1, drpSystem, "SYSTEM_CODE", "SYSTEMDESCA", "- اختر -", null);
                    else
                        DocumentActions.FillComboFirstvalue(sys_1, drpSystem, "SYSTEM_CODE", "SYSTEMDESCE", "- Select -", null);
                }
            }
        });
    }
    function Load_Transactions() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AVATTRANS", "GetAllByComp"),
            data: {
                UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token, compcode: Number(SysSession.CurrentEnvironment.CompCode)
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    debugger;
                    VAT_TRANS = result.Response;
                    var Trans = VAT_TRANS.filter(function (x) { return x.SYSTEM_CODE == drpSystem.value; });
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "ar")
                        DocumentActions.FillComboFirstvalue(Trans, drpTrans, "TRTYPE", "TRDESCA", "- اختر -", null);
                    else
                        DocumentActions.FillComboFirstvalue(Trans, drpTrans, "TRTYPE", "TRDESCE", "- Select -", null);
                    //if (SysSession.CurrentEnvironment.ScreenLanguage == "ar")
                    //    DocumentActions.FillComboFirstvalue(VAT_TRANS, drpSystem, "SYSTEM_CODE", "SYSTEMDESCA", "- اختر -", null);
                    //else
                    //    DocumentActions.FillComboFirstvalue(VAT_TRANS, drpSystem, "SYSTEM_CODE", "SYSTEMDESCE", "- Select -", null);
                }
            }
        });
    }
    function drpSystem_onchange() {
        var Trans = VAT_TRANS.filter(function (x) { return x.SYSTEM_CODE == drpSystem.value; });
        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar")
            DocumentActions.FillComboFirstvalue(Trans, drpTrans, "TRTYPE", "TRDESCA", "- اختر -", null);
        else
            DocumentActions.FillComboFirstvalue(Trans, drpTrans, "TRTYPE", "TRDESCE", "- Select -", null);
    }
    function btnBranchSearch_onclick() {
        var sys = new SystemTools();
        var cond = " COMP_CODE = " + SysSession.CurrentEnvironment.CompCode;
        sys.FindKey(Modules.VatReport, "btnBranchSearch", cond, function () {
            txtbranchCode.value = SearchGrid.SearchDataGrid.SelectedKey;
            Ajax.Callsync({
                type: "Get",
                url: sys.apiUrl("GBranch", "GetAllByCode"),
                data: {
                    UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token, CompCode: SysSession.CurrentEnvironment.CompCode,
                    BRA_CODE: Number(txtbranchCode.value)
                },
                success: function (d) {
                    var result = d;
                    if (result.IsSuccess) {
                        debugger;
                        var branch = result.Response;
                        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar")
                            $("#txtbranchDesc").val(branch.BRA_DESC);
                        else
                            $("#txtbranchDesc").val(branch.BRA_DESCL);
                    }
                }
            });
        });
    }
    function Change_VatTp() {
        if (rd_PurchaseInvoice.checked == true || rd_PurchaseUpdates.checked == true) {
            $("#drpPurVatTp").removeClass("display_none");
            $("#drpSalesVatTp").addClass("display_none");
        }
        else if (rd_SalesInvoice.checked == true || rd_SalesUpdates.checked == true) {
            $("#drpPurVatTp").addClass("display_none");
            $("#drpSalesVatTp").removeClass("display_none");
        }
    }
    function rd_SummeryRpt_onchange() {
        if (rd_SummeryRpt.checked) {
            $("#div_summery").removeClass("display_none");
            $("#div_Landscape").addClass("display_none");
        }
        else {
            $("#div_summery").addClass("display_none");
            $("#div_Landscape").removeClass("display_none");
        }
    }
    function rd_DetailRpt_onchange() {
        if (rd_DetailRpt.checked) {
            $("#div_summery").addClass("display_none");
            $("#div_Landscape").removeClass("display_none");
        }
        else {
            $("#div_summery").removeClass("display_none");
            $("#div_Landscape").addClass("display_none");
        }
    }
    function txtbranchCode_change() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GBranch", "GetAllByCode"),
            data: {
                UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token, CompCode: SysSession.CurrentEnvironment.CompCode,
                BRA_CODE: Number(txtbranchCode.value)
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    debugger;
                    var branch = result.Response;
                    if (branch != null) {
                        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar")
                            $("#txtbranchDesc").val(branch.BRA_DESC);
                        else
                            $("#txtbranchDesc").val(branch.BRA_DESCL);
                    }
                    else {
                        $("#txtbranchDesc").val("");
                        DisplayMassage(" رقم الفرع غير صحيح  ", "Branch Code is wrong", MessageType.Error);
                    }
                }
            }
        });
    }
    //*************************Print**************************//
    //export function PrintReport(OutType: number) {
    //    if (!SysSession.CurrentPrivileges.PrintOut) return;
    //    let rp: ReportParameters = new ReportParameters();
    //    debugger
    //    rp.RepType = OutType;//output report as View
    //    rp.FromDate = DateFormatRep(txtStartDate.value);
    //    rp.ToDate = DateFormatRep(txtEndDate.value);
    //    rp.CompCode = SysSession.CurrentEnvironment.CompCode;
    //    rp.BranchCode = SysSession.CurrentEnvironment.BranchCode;
    //    rp.CompNameA = SysSession.CurrentEnvironment.CompanyNameAr;
    //    rp.CompNameE = SysSession.CurrentEnvironment.CompanyName;
    //    rp.UserCode = SysSession.CurrentEnvironment.UserCode;
    //    rp.Tokenid = SysSession.CurrentEnvironment.Token;
    //    var BranchNameA = SysSession.CurrentEnvironment.BranchName;
    //    var BranchNameE = SysSession.CurrentEnvironment.BranchNameEn;
    //    rp.ScreenLanguage = SysSession.CurrentEnvironment.ScreenLanguage;
    //    rp.SystemCode = SysSession.CurrentEnvironment.SystemCode;
    //    rp.SubSystemCode = SysSession.CurrentEnvironment.SubSystemCode;
    //    if (BranchNameA == null || BranchNameE == null) {
    //        BranchNameA = "";
    //        BranchNameE = "";
    //    }
    //    rp.BraNameA = BranchNameA;
    //    rp.BraNameE = BranchNameE;
    //    rp.LoginUser = SysSession.CurrentEnvironment.UserCode;
    //    //@TrType
    //    if (rd_SalesInvoice.checked)
    //        rp.TrType = 1;
    //    else if (rd_SalesUpdates.checked)
    //        rp.TrType = 2;
    //    else if (rd_PurchaseInvoice.checked)
    //        rp.TrType = 3;
    //    else if (rd_PurchaseUpdates.checked)
    //        rp.TrType = 4;
    //    //if (drpTrans.selectedIndex > 0) {
    //    //    rp.TrType = Number($("#drpTrans").val());
    //    //}
    //    //else {
    //    //    rp.TrType = -1;
    //    //}
    //    //@SysCode
    //    if (drpSystem.selectedIndex > 0) {
    //        rp.SysCode = $("#drpSystem").val();
    //    }
    //    else {
    //        rp.SysCode = "-1";
    //    }
    //    if (rd_SummeryRpt.checked == true) {
    //        rp.check = 0;
    //    }
    //    else if (rd_DetailRpt.checked == true && chkLandscapePrint.checked == true) {
    //         rp.check = 1;
    //     }
    //     else
    //     {
    //         rp.check =2;
    //     }
    //     //
    //     if (rd_PurchaseInvoice.checked == true || rd_PurchaseUpdates.checked == true) {
    //         rp.Typ = 2;
    //     }
    //     else if (rd_SalesInvoice.checked == true || rd_SalesUpdates.checked == true) {
    //         rp.Typ = 1;
    //     } 
    //     //@BraCode
    //     if (txtbranchCode.value != "")
    //         rp.VatBraCode = Number(txtbranchCode.value);
    //     else
    //         rp.VatBraCode = -1;
    //     //@TransCode
    //     if (drpTrans.value != "" && drpTrans.value != "null") {
    //         rp.TransCode = drpTrans.value;
    //     }
    //     else
    //     {
    //         rp.TransCode = "-1";
    //     }
    //     //@Vattype
    //     if (rd_SalesInvoice.checked || rd_SalesUpdates.checked) {
    //         if (drpSalesVatTp.value != "" && drpSalesVatTp.value != "null") {
    //             rp.Vattype = Number(drpSalesVatTp.value);
    //         }
    //         else {
    //             rp.Vattype = -1;
    //         }
    //     }
    //     else if (rd_PurchaseInvoice.checked || rd_PurchaseUpdates.checked) {
    //         if (drpPurVatTp.value != "" && drpPurVatTp.value != "null") {
    //             rp.Vattype = Number(drpPurVatTp.value);
    //         }
    //         else {
    //             rp.Vattype = -1;
    //         }
    //     }
    //     //@groupBy
    //     if (rd_branch.checked == true) {
    //         rp.Groupid = 1;
    //     }
    //     else if (rd_Process.checked == true) {
    //         rp.Groupid = 2;
    //     }
    //     else if (rd_Customer.checked == true) {
    //         rp.Groupid = 3;
    //     }
    //     if (rd_SummeryRpt.checked) {
    //         Ajax.Callsync({
    //             url: Url.Action("IProc_Rpt_VATListSummary", "GeneralReports"),
    //             data: rp,
    //             success: (d) => {
    //                 let result = d.result as string;
    //                 window.open(result, "_blank");
    //             }
    //         })
    //     }
    //     else if (rd_DetailRpt.checked == true) {
    //         Ajax.Callsync({
    //             url: Url.Action("IProc_Rpt_VATListDetail", "GeneralReports"),
    //             data: rp,
    //             success: (d) => {
    //                 let result = d.result as string;
    //                 window.open(result, "_blank");
    //             }
    //         })
    //     }
    //}
    function PrintReport(OutType) {
        if (!SysSession.CurrentPrivileges.PrintOut)
            return;
        var rp = new ReportParameters();
        debugger;
        rp.RepType = OutType; //output report as View
        rp.FromDate = DateFormatRep(txtStartDate.value);
        rp.ToDate = DateFormatRep(txtEndDate.value);
        rp.CompCode = SysSession.CurrentEnvironment.CompCode;
        rp.BranchCode = SysSession.CurrentEnvironment.BranchCode;
        rp.CompNameA = SysSession.CurrentEnvironment.CompanyNameAr;
        rp.CompNameE = SysSession.CurrentEnvironment.CompanyName;
        rp.UserCode = SysSession.CurrentEnvironment.UserCode;
        rp.Tokenid = SysSession.CurrentEnvironment.Token;
        var BranchNameA = SysSession.CurrentEnvironment.BranchName;
        var BranchNameE = SysSession.CurrentEnvironment.BranchNameEn;
        rp.ScreenLanguage = SysSession.CurrentEnvironment.ScreenLanguage;
        rp.SystemCode = SysSession.CurrentEnvironment.SystemCode;
        rp.SubSystemCode = SysSession.CurrentEnvironment.SubSystemCode;
        if (BranchNameA == null || BranchNameE == null) {
            BranchNameA = "";
            BranchNameE = "";
        }
        rp.BraNameA = BranchNameA;
        rp.BraNameE = BranchNameE;
        rp.LoginUser = SysSession.CurrentEnvironment.UserCode;
        //@TrType
        if (rd_SalesInvoice.checked)
            rp.TrType = 1;
        else if (rd_SalesUpdates.checked)
            rp.TrType = 2;
        else if (rd_PurchaseInvoice.checked)
            rp.TrType = 3;
        else if (rd_PurchaseUpdates.checked)
            rp.TrType = 4;
        //if (drpTrans.selectedIndex > 0) {
        //    rp.TrType = Number($("#drpTrans").val());
        //}
        //else {
        //    rp.TrType = -1;
        //}
        //@SysCode
        debugger;
        if (drpSystem.selectedIndex > 0) {
            rp.SysCode = $("#drpSystem").val();
        }
        else {
            rp.SysCode = "-1";
        }
        if (rd_SummeryRpt.checked == true) {
            rp.check = 0;
        }
        else if (rd_DetailRpt.checked == true && chkLandscapePrint.checked == true) {
            rp.check = 1;
        }
        else {
            rp.check = 2;
        }
        //
        if (rd_PurchaseInvoice.checked == true || rd_PurchaseUpdates.checked == true) {
            rp.Typ = 2;
        }
        else if (rd_SalesInvoice.checked == true || rd_SalesUpdates.checked == true) {
            rp.Typ = 1;
        }
        //@BraCode
        if (txtbranchCode.value != "")
            rp.VatBraCode = Number(txtbranchCode.value);
        else
            rp.VatBraCode = -1;
        //@TransCode
        if (drpTrans.value != "" && drpTrans.value != "null") {
            rp.TransCode = drpTrans.value;
        }
        else {
            rp.TransCode = "-1";
        }
        //@Vattype
        if (rd_SalesInvoice.checked || rd_SalesUpdates.checked) {
            if (drpSalesVatTp.value != "" && drpSalesVatTp.value != "null") {
                rp.Vattype = Number(drpSalesVatTp.value);
            }
            else {
                rp.Vattype = -1;
            }
        }
        else if (rd_PurchaseInvoice.checked || rd_PurchaseUpdates.checked) {
            if (drpPurVatTp.value != "" && drpPurVatTp.value != "null") {
                rp.Vattype = Number(drpPurVatTp.value);
            }
            else {
                rp.Vattype = -1;
            }
        }
        //@groupBy
        if (rd_branch.checked == true) {
            rp.Groupid = 1;
        }
        else if (rd_Process.checked == true) {
            rp.Groupid = 2;
        }
        else if (rd_Customer.checked == true) {
            rp.Groupid = 3;
        }
        if (rd_SummeryRpt.checked) {
            Ajax.Callsync({
                url: Url.Action("IProc_Rpt_VATListSummary", "GeneralReports"),
                data: rp,
                success: function (d) {
                    var result = d.result;
                    window.open(result, "_blank");
                }
            });
        }
        else if (rd_DetailRpt.checked == true) {
            Ajax.Callsync({
                url: Url.Action("IProc_Rpt_VATListDetail", "GeneralReports"),
                data: rp,
                success: function (d) {
                    var result = d.result;
                    window.open(result, "_blank");
                }
            });
        }
    }
    VatLists.PrintReport = PrintReport;
})(VatLists || (VatLists = {}));
//# sourceMappingURL=VatLists.js.map