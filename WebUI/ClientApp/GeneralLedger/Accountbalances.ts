$(document).ready(() => {

    Accountbalances.InitalizeComponent();
})
namespace Accountbalances {
    var compcode: Number;
    var AccountType: Number = 1;
    var sys: SystemTools = new SystemTools();
    var SysSession: SystemSession = GetSystemSession(Modules.Accountbalances);

    var AccountDetails: A_ACCOUNT = new A_ACCOUNT();
    var CostCenterDetails: G_COST_CENTER = new G_COST_CENTER();


    var txtFromDate: HTMLInputElement;
    var txtToDate: HTMLInputElement;

    var btnReset;
     
    var chk_Certified: HTMLInputElement
    var chk_New: HTMLInputElement
    var chk_IncludeInvTR: HTMLInputElement
    var IsMoveEnable: HTMLInputElement
    var IsE_termEnable: HTMLInputElement
    var IsF_termEnable: HTMLInputElement

    var IsF_AEnable: HTMLInputElement
    var IsM_AEnable: HTMLInputElement
    var IsE_AEnable: HTMLInputElement
    var Details_IsF_termEnable: HTMLInputElement;
    var Details_IsM_AEnable: HTMLInputElement;
    var Details_IsE_termEnable: HTMLInputElement;
    var txtFromAcc_ID: HTMLInputElement;
    var txtCenter_Cost_ID: HTMLInputElement;
    var txtFromAcc_DESC: HTMLInputElement;
    var txtCenter_Cost_DESC: HTMLInputElement;

    var btnFromAccSearch: HTMLButtonElement;
    var btnCCostSearch: HTMLButtonElement;


    // Print Buttons
    var btnPrint: HTMLButtonElement;
    var btnPrintTrview: HTMLButtonElement;
    var btnPrintTrPDF: HTMLButtonElement;
    var btnPrintTrEXEL: HTMLButtonElement;
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);


    export function InitalizeComponent()
    {
        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar")
        {
            document.getElementById('Screen_name').innerHTML = "الاستاذ العام"; 
        }
        else
        {
            document.getElementById('Screen_name').innerHTML == "general ledger";  
        }
        $("#iconMainPages").addClass("d-none");
        $("#iconReportPages").removeClass("d-none");
        $("#btnPrintTrview").addClass("print-report");
        $("#btnPrintTrview span").text("عرض تقرير");
         
        InitalizeControls();
        InitalizeEvents();
        txtFromDate.value = DateStartMonth();
        txtToDate.value = ConvertToDateDash(GetDate()) <= ConvertToDateDash(SysSession.CurrentEnvironment.EndDate) ? GetDate() : SysSession.CurrentEnvironment.EndDate;

        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        
        chk_Certified.checked = false;
        chk_New.checked = false;
        chk_IncludeInvTR.checked = false;

                    
        IsF_AEnable.checked = true;
        IsM_AEnable.checked = true;
        IsE_AEnable.checked = true;     
        $('#btnPrint').addClass('display_none');     
        IsE_AEnable.checked = true;
        txtFromAcc_ID.disabled = false;
        txtCenter_Cost_ID.disabled = false;

    } 
    function InitalizeControls() {

        btnPrint = document.getElementById("btnPrint") as HTMLButtonElement;

        txtFromDate = document.getElementById("txtFromDate") as HTMLInputElement;
        txtToDate = document.getElementById("txtToDate") as HTMLInputElement;
        btnFromAccSearch = document.getElementById("btnFromAccSearch") as HTMLButtonElement;
        btnCCostSearch = document.getElementById("btnCCostSearch") as HTMLButtonElement;

        IsF_AEnable = document.getElementById("IsF_AEnable") as HTMLInputElement;
        IsM_AEnable = document.getElementById("IsM_AEnable") as HTMLInputElement;
        IsE_AEnable = document.getElementById("IsE_AEnable") as HTMLInputElement;
        btnReset = document.getElementById("btnReset") as HTMLButtonElement;
        
        txtFromAcc_ID = document.getElementById("txtFromAcc_ID") as HTMLInputElement;
        txtCenter_Cost_ID = document.getElementById("txtCenter_Cost_ID") as HTMLInputElement;
        txtFromAcc_DESC = document.getElementById("txtFromAcc_DESC") as HTMLInputElement;
        txtCenter_Cost_DESC = document.getElementById("txtCenter_Cost_DESC") as HTMLInputElement;
        chk_Certified = document.getElementById("chk_Certified") as HTMLInputElement;
        chk_New = document.getElementById("chk_New") as HTMLInputElement;
        chk_IncludeInvTR = document.getElementById("chk_IncludeInvTR") as HTMLInputElement;








        //---------------------------------------------------------------------- Print Buttons

        btnPrint = document.getElementById("btnPrint") as HTMLButtonElement;
        btnPrintTrview = document.getElementById("btnPrintTrview") as HTMLButtonElement;
        btnPrintTrPDF = document.getElementById("btnPrintTrPDF") as HTMLButtonElement;
        btnPrintTrEXEL = document.getElementById("btnPrintTrEXEL") as HTMLButtonElement;

    }
    function InitalizeEvents() {
        btnFromAccSearch.onclick = btnFromAccSearch_onclick;
        txtFromAcc_ID.onchange = txtFromAcc_ID_onchange;
        btnCCostSearch.onclick = btnCCostSearch_onclick;
        txtCenter_Cost_ID.onchange = txtCenter_Cost_ID_onchange;

        btnReset.onclick = btnReset_onclick;




        // Print Buttons
        btnPrintTrview.onclick = () => { PrintReport(1); }
        btnPrintTrPDF.onclick = () => { PrintReport(2); }
        btnPrintTrEXEL.onclick = () => { PrintReport(3); }
        btnPrint.onclick = () => { PrintReport(4); }
        
    }                                                                                                                   
           //-----------------------------------------------------------------------   (  Button search from Account  )
    function btnFromAccSearch_onclick() {

         
        sys.FindKey(Modules.Accountbalances, "btnFromAccSearch", "COMP_CODE= " + compcode + " and DETAIL = 0 ", () => {
            let id = SearchGrid.SearchDataGrid.SelectedKey
            $('#txtFromAcc_ID').val(id);
            GetAccByCode(id);
            $('#txtFromAcc_DESC').val((lang == "ar" ? AccountDetails.ACC_DESCA : AccountDetails.ACC_DESCL));




        });

    }  
    function GetAccByCode(AccCode: string) {
         
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GLDefAccount", "GetByAccCode"),
            data: { CompCode: compcode, AccCode: AccCode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    AccountDetails = result.Response as A_ACCOUNT;
                    debugger
                    if (AccountDetails == null ) {

                        txtFromAcc_ID.value = "";
                        txtFromAcc_DESC.value = "";                      
                        Errorinput(txtFromAcc_ID);
                        DisplayMassage("كود الحساب غير صحيح", "Wrong Account code", MessageType.Error);

                    }
                    else {
                        $('#txtFromAcc_ID').val(AccountDetails.ACC_CODE);
                        $('#txtFromAcc_DESC').val(AccountDetails.ACC_DESCA);
               
                    }

                }
            }
        });
    }

    function txtFromAcc_ID_onchange() {
        txtFromAcc_DESC.value = "";
        GetAccByCode(txtFromAcc_ID.value);
    }

           //-----------------------------------------------------------------------   (  Button search Cost Center )
    function btnCCostSearch_onclick() {

         

        let sys: SystemTools = new SystemTools();
        sys.FindKey(Modules.Accountbalances, "btnCCostSearch", "COMP_CODE=" + compcode + "", () => {
            let id = SearchGrid.SearchDataGrid.SelectedKey
            $('#txtCenter_Cost_ID').val(id);
            GetCostCenterByCode(id);
            $('#txtCenter_Cost_DESC').val((lang == "ar" ? CostCenterDetails.CC_DESCA : CostCenterDetails.CC_DESCE));
        });

    }   
    function GetCostCenterByCode(CC_Code: string) {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("CostCenter", "GetByCostCntreCode"),
            data: { CompCode: compcode, CostCntreCode: CC_Code, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    CostCenterDetails = result.Response as G_COST_CENTER;
                    debugger
                    if (CostCenterDetails == null) {

                        txtCenter_Cost_ID.value = "";
                       // txtCenter_Cost_DESC.value = "";
                        $('#txtCenter_Cost_DESC').val("");
                        Errorinput(txtCenter_Cost_ID);
                        DisplayMassage("كود التكلفة غير صحيح", "Wrong Account cost", MessageType.Error);

                    }
                    else {
                        $('#txtCenter_Cost_ID').val(CostCenterDetails.CC_CODE);
                        $('#txtCenter_Cost_DESC').val(CostCenterDetails.CC_DESCA);

                    }
                }
            }
        });
    }
    function txtCenter_Cost_ID_onchange() {
        txtCenter_Cost_DESC.value = "";
        GetCostCenterByCode(txtCenter_Cost_ID.value);
    }
            //-----------------------------------------------------------------------   (  Get Date  )
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
         
        txtFromDate.value = DateFormat(SysSession.CurrentEnvironment.StartDate);
        txtToDate.value = ConvertToDateDash(GetDate()) <= ConvertToDateDash(SysSession.CurrentEnvironment.EndDate) ? GetDate() : SysSession.CurrentEnvironment.EndDate;
                                                                     
        discharge();
        chk_Certified.checked = false;
        chk_New.checked = false;
        chk_IncludeInvTR.checked = false;
        IsF_AEnable.checked = true;
        IsM_AEnable.checked = true;
        IsE_AEnable.checked = true;

    }

    function discharge() {
        $('#txtFromAcc_ID').val("");
        $('#txtFromAcc_DESC').val("");
        $('#txtCenter_Cost_ID').val("");
        $('#txtCenter_Cost_DESC').val("");
        $('#txtToAcc_ID').val("");
        $('#txtToAcc_DESC').val("");
    }



    //----------------------------------------------------( Report )
    function PrintReport(OutType: number) {


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
        rp.RepType = OutType;//output report as View
        rp.FromDate = DateFormatRep(txtFromDate.value);
        rp.ToDate = DateFormatRep(txtToDate.value);
        if ($('#txtCenter_Cost_ID').val() == "") {
            rp.cc_code = "-1";
        }
        else {
            rp.cc_code = $('#txtCenter_Cost_ID').val();
        }
        if ($('#txtFromAcc_ID').val() == "") {
            rp.AccCode = "-1";
        }
        else {
            rp.AccCode = $('#txtFromAcc_ID').val();
        }
        if (chk_Certified.checked == true)  //------------------------------------( Inclusion of certified restrictions )
        {
            rp.IsAuthVchr = 1;
        }
        else {
            rp.IsAuthVchr = 0;
        }
        if (chk_New.checked == true)       //-------------------------------------( Inclusion of new restrictions )
        {
            rp.IsNewVchr = 1;
        }
        else {
            rp.IsNewVchr = 0;
        }

        if (chk_IncludeInvTR.checked == true)       //-------------------------------------( Inclusion of new restrictions )
        {
            rp.IncludeInvTR = 1;
        }
        else {
            rp.IncludeInvTR = 0;
        }


        Details_IsF_termEnable = document.querySelector("input[name=IsF_termEnable]:checked") as HTMLInputElement;
        if (Details_IsF_termEnable.value == "D") {
            rp.OpenType = 1;
        }
        else if (Details_IsF_termEnable.value == "C") {
            rp.OpenType = 2;
        }
        else if (Details_IsF_termEnable.value == "Z") {
            rp.OpenType = 3;
        }
        else {
            rp.OpenType = 4;
        }



        Details_IsM_AEnable = document.querySelector("input[name=IsMoveEnable]:checked") as HTMLInputElement;

        if (Details_IsM_AEnable.value == "D") {
            rp.PrdType = 1;
        }
        else if (Details_IsM_AEnable.value == "C") {
            rp.PrdType = 2;
        }
        else if (Details_IsM_AEnable.value == "Z") {
            rp.PrdType = 3;
        }
        else {
            rp.PrdType = 4;
        }


        Details_IsE_termEnable = document.querySelector("input[name=IsE_termEnable]:checked") as HTMLInputElement;

        if (Details_IsE_termEnable.value == "D") {
            rp.EndType = 1;
        }
        else if (Details_IsE_termEnable.value == "C") {
            rp.EndType = 2;
        }
        else if (Details_IsE_termEnable.value == "Z") {
            rp.EndType = 3;
        }
        else {
            rp.EndType = 4;
        }


        if ($('#txtFromAcc_ID').val() == "") {
            //MessageBox.Show("يجب اختيار حساب الاستاذ", "تنبيه")
            WorningMessage("يجب اختيار حساب الاستاذ!", "Please Enter Account Number!", "خطأ", "Error");
            return;
        }


        Ajax.Callsync({
            url: Url.Action("AProc_Rpt_GLGeneralLedger", "GeneralReports"),
            data: rp,
            success: (d) => {
                let result = d.result as string;

                PrintReportLog(SysSession.CurrentEnvironment.UserCode, SysSession.CurrentEnvironment.CompCode, SysSession.CurrentEnvironment.BranchCode, Modules.Accountbalances, SysSession.CurrentEnvironment.CurrentYear);

                window.open(result, "_blank");
            }
        })
    }
}