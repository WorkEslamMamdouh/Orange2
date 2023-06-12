$(document).ready(() => {
    VatLists.InitializeComponent();
})
namespace VatLists {
    //************system variables
    var SysSession: SystemSession = GetSystemSession(Modules.VatLists);
    var sys: SystemTools = new SystemTools();
    var VAT_TRANS: Array<AVAT_TRANS> = new Array<AVAT_TRANS>();
    var VatPeriod: Array<AVAT_PERIOD> = new Array<AVAT_PERIOD>();
    //***********Controls
    var txtStartDate: HTMLInputElement;
    var txtEndDate: HTMLInputElement;
    var btnBranchSearch: HTMLButtonElement;
    var txtbranchCode: HTMLInputElement;
    var drpSalesVatTp: HTMLSelectElement;
    var drpPurVatTp: HTMLSelectElement;

    var rd_SalesInvoice: HTMLInputElement;
    var rd_SalesUpdates: HTMLInputElement;
    var rd_PurchaseInvoice: HTMLInputElement;
    var rd_PurchaseUpdates: HTMLInputElement;

    var rd_Customer: HTMLInputElement;
    var rd_Process: HTMLInputElement;
    var rd_branch: HTMLInputElement;

    var drpSystem: HTMLSelectElement;
    var drpTrans: HTMLSelectElement;

    var rd_SummeryRpt: HTMLInputElement;
    var rd_DetailRpt: HTMLInputElement;
    var chkLandscapePrint: HTMLInputElement;
    //print buttons
    var btnPrintTrview: HTMLButtonElement;
    var btnPrintTrPDF: HTMLButtonElement;
    var btnPrintTrEXEL: HTMLButtonElement; 
    var btnPrint: HTMLButtonElement;


    //*************************Initialization************************//

    export function InitializeComponent() {
        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = "القوائم الضريبية";
        } else {
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
        debugger
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
    function InitializeControls() {
        drpSystem = document.getElementById("drpSystem") as HTMLSelectElement;
        drpTrans = document.getElementById("drpTrans") as HTMLSelectElement;
        txtStartDate = document.getElementById("txtStartDate") as HTMLInputElement;
        txtEndDate = document.getElementById("txtEndDate") as HTMLInputElement;
        btnBranchSearch = document.getElementById("btnBranchSearch") as HTMLButtonElement;
        txtbranchCode = document.getElementById("txtbranchCode") as HTMLInputElement;
        drpSalesVatTp = document.getElementById("drpSalesVatTp") as HTMLSelectElement;
        drpPurVatTp = document.getElementById("drpPurVatTp") as HTMLSelectElement;

        rd_SalesInvoice = document.getElementById("rd_SalesInvoice") as HTMLInputElement;
        rd_SalesUpdates = document.getElementById("rd_SalesUpdates") as HTMLInputElement;
        rd_PurchaseInvoice = document.getElementById("rd_PurchaseInvoice") as HTMLInputElement;
        rd_PurchaseUpdates = document.getElementById("rd_PurchaseUpdates") as HTMLInputElement;

        rd_Customer = document.getElementById("rd_Customer") as HTMLInputElement;
        rd_Process = document.getElementById("rd_Process") as HTMLInputElement;
        rd_branch = document.getElementById("rd_branch") as HTMLInputElement;

        rd_SummeryRpt = document.getElementById("rd_SummeryRpt") as HTMLInputElement;
        rd_DetailRpt = document.getElementById("rd_DetailRpt") as HTMLInputElement;
        chkLandscapePrint = document.getElementById("chkLandscapePrint") as HTMLInputElement;
        //print 
        btnPrintTrview = document.getElementById("btnPrintTrview") as HTMLButtonElement;
        btnPrintTrPDF = document.getElementById("btnPrintTrPDF") as HTMLButtonElement;
        btnPrintTrEXEL = document.getElementById("btnPrintTrEXEL") as HTMLButtonElement; 
        btnPrint = document.getElementById("btnPrint") as HTMLInputElement;

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
        btnPrintTrview.onclick = () => { PrintReport(1); }
        btnPrintTrPDF.onclick = () => { PrintReport(2); }
        btnPrintTrEXEL.onclick = () => { PrintReport(3); }
        btnPrint.onclick = () => { PrintReport(4); }

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
                    debugger
                    let VatTp = result.Response as Array<A_D_VAT_TYPE>;
                    let pur = VatTp.filter(x => x.TYPE == 2).sort(function (a, b) { return a.LineOrder - b.LineOrder; });
                    let sales = VatTp.filter(x => x.TYPE == 1).sort(function (a, b) { return a.LineOrder - b.LineOrder; });
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
                    debugger
                    let sys = result.Response as Array<AVAT_TRANS>;
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "ar")
                        DocumentActions.FillComboFirstvalue(sys, drpSystem, "SYSTEM_CODE", "SYSTEMDESCA", "- اختر -", null);
                    else
                        DocumentActions.FillComboFirstvalue(sys, drpSystem, "SYSTEM_CODE", "SYSTEMDESCE", "- Select -", null);
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
                    debugger
                    VAT_TRANS = result.Response as Array<AVAT_TRANS>;
                    let Trans = VAT_TRANS.filter(x => x.SYSTEM_CODE == drpSystem.value);
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
        let Trans = VAT_TRANS.filter(x => x.SYSTEM_CODE == drpSystem.value);
        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar")
            DocumentActions.FillComboFirstvalue(Trans, drpTrans, "TRTYPE", "TRDESCA", "- اختر -", null);
        else
            DocumentActions.FillComboFirstvalue(Trans, drpTrans, "TRTYPE", "TRDESCE", "- Select -", null);
    }

    function btnBranchSearch_onclick() {
        let sys: SystemTools = new SystemTools();
        let cond = " COMP_CODE = " + SysSession.CurrentEnvironment.CompCode;

        sys.FindKey(Modules.VatReport, "btnBranchSearch", cond, () => {
            txtbranchCode.value = SearchGrid.SearchDataGrid.SelectedKey;
            Ajax.Callsync({
                type: "Get",
                url: sys.apiUrl("GBranch", "GetAllByCode"),
                data: {
                    UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token, CompCode: SysSession.CurrentEnvironment.CompCode,
                    BRA_CODE: Number(txtbranchCode.value)
                },
                success: function (d) {
                    let result = d as BaseResponse;
                    if (result.IsSuccess) {
                        debugger
                        let branch = result.Response as G_BRANCH;
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
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    debugger
                    let branch = result.Response as G_BRANCH;
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


    export function PrintReport(OutType: number) {
        if (!SysSession.CurrentPrivileges.PrintOut) return;
        let rp: ReportParameters = new ReportParameters();
        debugger
        rp.RepType = OutType;//output report as View
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
        debugger
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
                success: (d) => {

                    let result = d.result as string;

                    

                    window.open(result, "_blank");
                }
            })
        }
        else if (rd_DetailRpt.checked == true) {

            Ajax.Callsync({
                url: Url.Action("IProc_Rpt_VATListDetail", "GeneralReports"),
                data: rp,
                success: (d) => {

                    let result = d.result as string;

                    

                    window.open(result, "_blank");
                }
            })

        }

    }


}