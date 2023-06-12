$(document).ready(() => {

    OperationExport.InitalizeComponent();
})

namespace OperationExport {

    var compcode: Number;
    var BranchCode: Number;
    var AccountType: Number = 2;
    var sys: SystemTools = new SystemTools();
    var SysSession: SystemSession = GetSystemSession(Modules.OperationExport); 

    //------------------------------------------------------------

    var txtFromDate: HTMLInputElement;
    var txtToDate: HTMLInputElement;
    //--- Print Buttons
    var btnPrint: HTMLButtonElement;
    var btnPrintTrview: HTMLButtonElement;
    var btnPrintTrPDF: HTMLButtonElement;
    var btnPrintTrEXEL: HTMLButtonElement;


    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);

    export function InitalizeComponent() {
        debugger

        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = "تقرير الاستيراد";

        } else {
            document.getElementById('Screen_name').innerHTML = "Record the rest";

        }
        $("#iconMainPages").addClass("d-none");
        $("#iconReportPages").removeClass("d-none");
        $("#btnPrintTrview").addClass("print-report");
        $("#btnPrintTrview span").text("عرض تقرير");

        InitalizeControls();
        InitalizeEvents();
        BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);
        compcode = Number(SysSession.CurrentEnvironment.CompCode); 
        $('#btnPrint').addClass('display_none');

        txtFromDate.value = DateStartMonth();
        txtToDate.value = ConvertToDateDash(GetDate()) <= ConvertToDateDash(SysSession.CurrentEnvironment.EndDate) ? GetDate() : SysSession.CurrentEnvironment.EndDate;

    }

    function InitalizeControls() {

        txtFromDate = document.getElementById("txtFromDate") as HTMLInputElement;
        txtToDate = document.getElementById("txtToDate") as HTMLInputElement;
        //---------------------------------------------------------------------- Print Buttons

        btnPrint = document.getElementById("btnPrint") as HTMLButtonElement;
        btnPrintTrview = document.getElementById("btnPrintTrview") as HTMLButtonElement;
        btnPrintTrPDF = document.getElementById("btnPrintTrPDF") as HTMLButtonElement;
        btnPrintTrEXEL = document.getElementById("btnPrintTrEXEL") as HTMLButtonElement;

    }

    function InitalizeEvents() { 
        // Print Buttons
        btnPrintTrview.onclick = () => { PrintReport(1); }
        btnPrintTrPDF.onclick = () => { PrintReport(2); }
        btnPrintTrEXEL.onclick = () => { PrintReport(3); }
        btnPrint.onclick = () => { PrintReport(4); } 
    }
     

     

    //----------------------------------------------------( Report )
    function PrintReport(OutType: number) {
        if (!SysSession.CurrentPrivileges.PrintOut) return;
        let rp: ReportParameters = new ReportParameters();
        rp.RepType = OutType;//output report as View
        rp.FromDate = DateFormatRep(txtFromDate.value);
        rp.ToDate = DateFormatRep(txtToDate.value);
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

            BranchNameA = " ";
            BranchNameE = " ";
        }
        rp.BraNameA = BranchNameA;
        rp.BraNameE = BranchNameE;
        rp.LoginUser = SysSession.CurrentEnvironment.UserCode;
 

        Ajax.Callsync({
            url: Url.Action("IProc_Rpt_OperationExportList", "GeneralReports"),
            data: rp,
            success: (d) => {

                let result = d.result as string;

                

                window.open(result, "_blank");
            }
        })
    }

}