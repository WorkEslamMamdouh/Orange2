$(document).ready(() => {

    CashBankAccount.InitalizeComponent();
})

namespace CashBankAccount {

    var compcode: Number;
    var BranchCode: Number;
    var AccountType: Number = 1;
    var sys: SystemTools = new SystemTools(); 
    var SysSession: SystemSession = GetSystemSession(Modules.CashBankAccount);
    //------------------------------------------------------------
    var Details_ACCOUNT: Array<A_ACCOUNT> = new Array<A_ACCOUNT>();
     
    //------------------------------------------------------------

    var ddlBox: HTMLSelectElement;
    var txtDateFrom: HTMLInputElement;
    var txtDateTo: HTMLInputElement;
      
    var Rd_detail: HTMLInputElement;
    var btnReset: HTMLButtonElement;
     
    //--- Print Buttons
    var btnPrint: HTMLButtonElement;
    var btnPrintTrview: HTMLButtonElement;
    var btnPrintTrPDF: HTMLButtonElement;
    var btnPrintTrEXEL: HTMLButtonElement;
    var chk_Certified: HTMLInputElement;

    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);

    export function InitalizeComponent() {
        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = "كشف حساب بنك ";

        } else {
            document.getElementById('Screen_name').innerHTML == "Bank Account Statment";

        }
        $('#btnPrint').addClass('display_none');

        $("#iconMainPages").addClass("d-none");
        $("#iconReportPages").removeClass("d-none");
        $("#btnPrintTrview").addClass("print-report");
        $("#btnPrintTrview span").text("عرض تقرير");

        InitalizeControls();
        InitalizeEvents();
        txtDateFrom.value = DateFormat(SysSession.CurrentEnvironment.StartDate);
        txtDateTo.value = ConvertToDateDash(GetDate()) <= ConvertToDateDash(SysSession.CurrentEnvironment.EndDate) ? GetDate() : SysSession.CurrentEnvironment.EndDate;

        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);
        fillddlBank();
       
        Rd_detail.checked = true;

    }
    function InitalizeControls() {

        ddlBox = document.getElementById("ddlBox") as HTMLSelectElement;
        txtDateFrom = document.getElementById("txtFromDate") as HTMLInputElement;
        txtDateTo = document.getElementById("txtToDate") as HTMLInputElement;
        btnReset = document.getElementById("btnReset") as HTMLButtonElement;
        Rd_detail = document.getElementById("Rd_detail") as HTMLInputElement;
        chk_Certified = document.getElementById("chk_Certified") as HTMLInputElement;

        //---------------------------------------------------------------------- Print Buttons

        btnPrint = document.getElementById("btnPrint") as HTMLButtonElement;
        btnPrintTrview = document.getElementById("btnPrintTrview") as HTMLButtonElement;
        btnPrintTrPDF = document.getElementById("btnPrintTrPDF") as HTMLButtonElement;
        btnPrintTrEXEL = document.getElementById("btnPrintTrEXEL") as HTMLButtonElement;
        

    }
     
    function InitalizeEvents() {


        btnReset.onclick = btnReset_onclick;
        // Print Buttons
        btnPrintTrview.onclick = () => { PrintReport(1); }
        btnPrintTrPDF.onclick = () => { PrintReport(2); }
        btnPrintTrEXEL.onclick = () => { PrintReport(3); }
        btnPrint.onclick = () => { PrintReport(4); }

    }
     
    function fillddlBank() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GLDefAccount", "GetBankAcc"),
            data: {
                CompCode: compcode, AccType: 3 , UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
          
            success: (d) => {
                
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    Details_ACCOUNT = result.Response as Array<A_ACCOUNT>;

                    for (var i = 0; i < Details_ACCOUNT.length; i++) {
                        $('#ddlBox').append('<option value="' + Details_ACCOUNT[i].ACC_CODE + '">' + (lang == "ar" ? Details_ACCOUNT[i].ACC_DESCA : Details_ACCOUNT[i].ACC_CODE) + '</option>');
                    }

                }
            }

        });

    }
     
    function GetDate() {
        var today: Date = new Date();
        var dd: string = today.getDate().toString();
        var ReturnedDate: string;
        var mm: string = (today.getMonth() + 1).toString();
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
     
    function btnReset_onclick() {

        txtDateFrom.value = DateFormat(SysSession.CurrentEnvironment.StartDate);
        txtDateTo.value = ConvertToDateDash(GetDate()) <= ConvertToDateDash(SysSession.CurrentEnvironment.EndDate) ? GetDate() : SysSession.CurrentEnvironment.EndDate;
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        InitalizeComponent();
        ddlBox.value = "Null";
        
        chk_Certified.checked = true;
        Rd_detail.checked = true;
    }

    //----------------------------------------------------( Report )
    function PrintReport(OutType: number) { 

        let rp: ReportParameters = new ReportParameters();

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
        rp.RepType = OutType;//output report as View
        rp.FromDate = DateFormatRep(txtDateFrom.value);
        rp.ToDate = DateFormatRep(txtDateTo.value);

       
        if ($("#ddlBox").val() == "Null" && $("#ddlBox").val() == "-1" ) {//-------------جميع الصناديق
            rp.BankCode = '';
        } else {
            rp.BankCode = $("#ddlBox").val();
        }
        if (chk_Certified.checked==true)
            rp.Status = 3;
        else 
            rp.Status = 1;
        

        if (Rd_detail.checked == true) {//******  تقرير تفصيلي  
            rp.check = 1;

            Ajax.Callsync({
                url: Url.Action("IProc_Rpt_AccBankDetail", "GeneralReports"),
                data: rp,
                success: (d) => {

                    let result = d.result as string;
                    


                    window.open(result, "_blank");
                }
            })

        }
        else {//******  تقرير ملخص   

            rp.check = 2;

            Ajax.Callsync({
                url: Url.Action("IProc_Rpt_AccBankSummary", "GeneralReports"),
                data: rp,
                success: (d) => {

                    let result = d.result as string;
                    


                    window.open(result, "_blank");
                }
            })
        }



    }

}