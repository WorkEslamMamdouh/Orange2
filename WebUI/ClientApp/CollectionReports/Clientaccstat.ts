$(document).ready(() => {

    Clientaccstat.InitalizeComponent();
})

namespace Clientaccstat {

    var compcode: Number;
    var AccountType: Number = 1;
    var sys: SystemTools = new SystemTools();
    var SysSession: SystemSession = GetSystemSession(Modules.Clientaccstat);
    //------------------------------------------------------------
    var Details_Type_D_Category: Array<A_RecPay_D_Category> = new Array<A_RecPay_D_Category>();
    var Details_CustomerGroup: Array<A_RecPay_D_Group> = new Array<A_RecPay_D_Group>();
    var SalesmanDetails: Array<I_Sls_D_Salesman> = new Array<I_Sls_D_Salesman>();
    var Details: Array<IQ_GetCustomer> = new Array<IQ_GetCustomer>();
    var CustomersDetails: Array<A_Rec_D_Customer> = new Array<A_Rec_D_Customer>();
    var CustomersDetailsfillc: Array<A_Rec_D_Customer> = new Array<A_Rec_D_Customer>();
    var Customer: A_Rec_D_Customer = new A_Rec_D_Customer();



    //------------------------------------------------------------
    var txt_ID_APP_Category: HTMLSelectElement;
    var txt_ID_APP_Group: HTMLSelectElement; 
    var ddlCustomer: HTMLSelectElement;
    var txtDateFrom: HTMLInputElement;
    var txtDateTo: HTMLInputElement;
    var Rddetails: HTMLInputElement;
    var CheckboxStatus: HTMLInputElement;
    var checkboxCash: HTMLInputElement;
    var Rd_sum: HTMLInputElement;
    var Rd_custmastr: HTMLInputElement;
    var btnReset;

    var Rd_Code: HTMLInputElement;
    var Rd_Name: HTMLInputElement;
    var Rd_Bal: HTMLInputElement;
     
    var indebtedness;

    //--- Print Buttons
    var btnPrint: HTMLButtonElement;
    var btnPrintTrview: HTMLButtonElement;
    var btnPrintTrPDF: HTMLButtonElement;
    var btnPrintTrEXEL: HTMLButtonElement;

    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);

    export function InitalizeComponent() {
        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = "كشف حساب العملاء";

        } else {
            document.getElementById('Screen_name').innerHTML == "Client Account Statment";

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
        Display_CustomerCat();
        Display_CustomerGroup();
        Display_Salesman();
        FillddlCustomer();
        Rddetails.checked = true;
        Rd_Bal.checked = true;

        //Display(); 
    }

    function InitalizeControls() {

        txt_ID_APP_Category = document.getElementById("txt_ID_APP_Category") as HTMLSelectElement;
        txt_ID_APP_Group = document.getElementById("txt_ID_APP_Group") as HTMLSelectElement; 
        ddlCustomer = document.getElementById("ddlCustomer") as HTMLSelectElement;
        txtDateFrom = document.getElementById("txtFromDate") as HTMLInputElement;
        txtDateTo = document.getElementById("txtToDate") as HTMLInputElement;
        Rddetails = document.getElementById("Rd_detail") as HTMLInputElement;
        CheckboxStatus = document.getElementById("CheckboxStatus") as HTMLInputElement;
        checkboxCash = document.getElementById("checkboxCash") as HTMLInputElement;
        Rd_sum = document.getElementById("Rd_sum") as HTMLInputElement;
        Rd_custmastr = document.getElementById("Rd_custmastr") as HTMLInputElement;

        Rd_Code = document.getElementById("Rd_Code") as HTMLInputElement;
        Rd_Name = document.getElementById("Rd_Name") as HTMLInputElement;
        Rd_Bal = document.getElementById("Rd_Bal") as HTMLInputElement;
        //Rddetails = document.querySelector("input[name=details]:checked");


        btnReset = document.getElementById("btnReset") as HTMLButtonElement;




        //---------------------------------------------------------------------- Print Buttons

        btnPrint = document.getElementById("btnPrint") as HTMLButtonElement;
        btnPrintTrview = document.getElementById("btnPrintTrview") as HTMLButtonElement;
        btnPrintTrPDF = document.getElementById("btnPrintTrPDF") as HTMLButtonElement;
        btnPrintTrEXEL = document.getElementById("btnPrintTrEXEL") as HTMLButtonElement;

    }

    function InitalizeEvents() {

        txt_ID_APP_Category.onchange= FillddlCustomer;
        txt_ID_APP_Group.onchange= FillddlCustomer;
        btnReset.onclick = btnReset_onclick;
        // Print Buttons
        btnPrintTrview.onclick = () => { PrintReport(1); }
        btnPrintTrPDF.onclick = () => { PrintReport(2); }
        btnPrintTrEXEL.onclick = () => { PrintReport(3); }
        btnPrint.onclick = () => { PrintReport(4); }

    }

    //----------------------------------------------------( Get cus_Cat )
    function Display_CustomerCat() {
        //var StkDefCategory: Array<I_D_Category> = new Array<I_D_Category>();
        
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GenDefCategory", "GetAll"),
            data: {
                CompCode: compcode, AccountType: AccountType, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                //
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    Details_Type_D_Category = result.Response as Array<A_RecPay_D_Category>;

                    DisplayStGenDefCustomerCat();
                }
            }
        });
    }

    function DisplayStGenDefCustomerCat() {
        
        for (var i = 0; i < Details_Type_D_Category.length; i++) {



            $('#txt_ID_APP_Category').append('<option value="' + Details_Type_D_Category[i].CatID + '">' + (lang == "ar" ? Details_Type_D_Category[i].Cat_DescA : Details_Type_D_Category[i].Cat_DescE) + '</option>');


        }

    }
    //----------------------------------------------------( Get cus_Group )
    function Display_CustomerGroup() { 
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GenDefGroup", "GetAll"),
            data: {
                CompCode: compcode, AccountType: AccountType, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                //
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    Details_CustomerGroup = result.Response as Array<A_RecPay_D_Group>;

                    DisplayStkCustomerGroup();
                }
            }
        });
    }

    function DisplayStkCustomerGroup() {
        for (var i = 0; i < Details_CustomerGroup.length; i++) {



            $('#txt_ID_APP_Group').append('<option value="' + Details_CustomerGroup[i].GroupID + '">' + (lang == "ar" ? Details_CustomerGroup[i].Group_DescA : Details_CustomerGroup[i].Group_DescE) + '</option>');
            $('#txt_Grop').append('<option value="' + Details_CustomerGroup[i].GroupID + '">' + (lang == "ar" ? Details_CustomerGroup[i].Group_DescA : Details_CustomerGroup[i].Group_DescE) + '</option>');



        }

    }
    //----------------------------------------------------( Get sales_man )
    function Display_Salesman() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefSalesMen", "GetAllSalesPeople"),
            data: {
                CompCode: compcode, IsSalesEnable: true, BranchCode: SysSession.CurrentEnvironment.BranchCode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    //
                    SalesmanDetails = result.Response as Array<I_Sls_D_Salesman>;
                    SalesmanDetails = SalesmanDetails.filter(s => s.Isactive == true);
                    DisplaySalesman();
                }
            }
        });
    }

    function DisplaySalesman() {
        for (var i = 0; i < SalesmanDetails.length; i++) {

            $('#ddlSalesman').append('<option value="' + SalesmanDetails[i].SalesmanId + '">' + (lang == "ar" ? SalesmanDetails[i].NameA: SalesmanDetails[i].NameE) + '</option>');

        }

    }
    //----------------------------------------------------(Get customer)

    function FillddlCustomer() {

        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefCustomer", "GetAll"),
            data: {
                CompCode: compcode, BranchCode: SysSession.CurrentEnvironment.BranchCode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    CustomersDetails = result.Response as Array<A_Rec_D_Customer>;
                     
                    CustomersDetailsfillc =new  Array<A_Rec_D_Customer>();
                    if ($('#txt_ID_APP_Category').val() != "Null" && $('#txt_ID_APP_Group').val()=="Null")
                    {
                        CustomersDetailsfillc = CustomersDetails.filter(x => x.CatID == Number(txt_ID_APP_Category.value))
                        if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {    
                            DocumentActions.FillCombowithdefult(CustomersDetailsfillc, ddlCustomer, "CustomerId", "NAMEE", "Select Category");
                        }
                        else {
                            DocumentActions.FillCombowithdefult(CustomersDetailsfillc, ddlCustomer, "CustomerId", "NAMEA", "اختر العميل");
                        }

                    }
                    else if ($('#txt_ID_APP_Category').val() == "Null" && $('#txt_ID_APP_Group').val() != "Null")
                    {
                        CustomersDetailsfillc = CustomersDetails.filter(x => x.GroupId == Number($('#txt_ID_APP_Group').val()))
                        if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                            DocumentActions.FillCombowithdefult(CustomersDetailsfillc, ddlCustomer, "CustomerId", "NAMEE", "Select Category");
                        }
                        else {
                            DocumentActions.FillCombowithdefult(CustomersDetailsfillc, ddlCustomer, "CustomerId", "NAMEA", "اختر العميل");
                        }

                    }
                    else if ($('#txt_ID_APP_Category').val() != "Null" && $('#txt_ID_APP_Group').val()!= "Null")
                    {
                        CustomersDetailsfillc = CustomersDetails.filter(x => x.CatID == Number(txt_ID_APP_Category.value) && x.GroupId == Number($('#txt_ID_APP_Group').val()))
                        if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                            DocumentActions.FillCombowithdefult(CustomersDetailsfillc, ddlCustomer, "CustomerId", "NAMEE", "Select Category");
                        }
                        else {
                            DocumentActions.FillCombowithdefult(CustomersDetailsfillc, ddlCustomer, "CustomerId", "NAMEA", "اختر العميل");
                        }

                    } else {
                        if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                            DocumentActions.FillCombowithdefult(CustomersDetails, ddlCustomer, "CustomerId", "NAMEE", "Select Category");
                        }
                        else {
                            DocumentActions.FillCombowithdefult(CustomersDetails, ddlCustomer, "CustomerId", "NAMEA", "اختر العميل");
                        }
                    }
                    // CustomersDetails = CustomersDetails.filter(s => s.STATUS == true);

                   
                }
            }
        });
    }
    //----------------------------------------------------(Get Date )
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

    //----------------------------------------------------( Data )
  
    function btnReset_onclick() {
        
        txtDateFrom.value = DateFormat(SysSession.CurrentEnvironment.StartDate);
        txtDateTo.value = ConvertToDateDash(GetDate()) <= ConvertToDateDash(SysSession.CurrentEnvironment.EndDate) ? GetDate() : SysSession.CurrentEnvironment.EndDate;
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        discharge();
    }

    function discharge() {
        $('#txt_ID_APP_Category option[value=Null]').prop('selected', 'selected').change();
        $('#ddlSalesman option[value=Null]').prop('selected', 'selected').change();
        $('#txt_ID_APP_Group option[value=Null]').prop('selected', 'selected').change();
        $('#ddlCustomer option[value=null]').prop('selected', 'selected').change(); 
        $('#txt_indebtedness option[value=All]').prop('selected', 'selected').change();
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


        if ($("#txt_ID_APP_Category").val() == "Null") {//-------------جميع الفئات
            rp.CatId = -1;
        } else {
            rp.CatId = Number($("#txt_ID_APP_Category").val());
        }
        if ($("#txt_ID_APP_Group").val() == "Null") {//-------------جميع المجموعات
            rp.Groupid = -1;
        } else {
            rp.Groupid = Number($("#txt_ID_APP_Group").val());
        }
        if ($("#ddlSalesman").val() == "Null") {//-------------جميع المناديب 
            rp.SalesmanID = -1;
        } else {
            rp.SalesmanID = Number($("#ddlSalesman").val());
        }


        if ($("#ddlCustomer").val() == "null") {//-------------جميع العملاء 
            rp.CustomerID = -1;
        } else {
            rp.CustomerID = Number($("#ddlCustomer").val());
        }

         
        //if ($("#txt_ID_APP_Type").val() == 'Null') {//-------------غير منفذ///الجميع
        //    rp.Status = 3;

        //}
        //if (Number($("#txt_ID_APP_Type").val()) == 1) {//------------- منفذ
        //    rp.Status = 1;

        //}
        if ($("#txt_indebtedness").val() == ">") {//******عليه مديونيه
            rp.BalType = 1;

        }
        if ($("#txt_indebtedness").val() == "<") {//******ليه مديونيه
            rp.BalType = 2;

        }
        if ($("#txt_indebtedness").val() == "=") {//******صفري
            rp.BalType = 3;

        }
        if ($("#txt_indebtedness").val() == "All") {//******الجميع

            rp.BalType = 0;
        }
        if ($("#txt_indebtedness").val() == "!") {//******رصيد غير صفري 

            rp.BalType = 4;
        }

        //  OrderBy
        if (Rd_Code.checked == true) {
            rp.orderby = 1;
        }
        else if (Rd_Name.checked == true) {
            rp.orderby = 2;
        }
        else { rp.orderby = 3 }


        if (CheckboxStatus.checked == true) {
            rp.Status = 3;
        }
        else {
            rp.Status = 1; 
        }

        if (checkboxCash.checked == true) {
            rp.CashType = 1;
        }
        else {
            rp.CashType = 0; 
        }

        debugger
        //  Rd_detail
        if (Rddetails.checked == true) {//******  تقرير تفصيلي  
            rp.check = 1;



            Ajax.Callsync({
                url: Url.Action("IProc_Rpt_AccCustomerSummary", "GeneralReports"),
                data: rp,
                success: (d) => {

                    let result = d.result as string;


                    window.open(result, "_blank");
                }
            })
        }

        if (Rd_sum.checked == true) {//******  تقرير ملخص

            rp.check = 2;

            Ajax.Callsync({
                url: Url.Action("IProc_Rpt_AccCustomerDetail", "GeneralReports"),
                data: rp,
                success: (d) => {

                    let result = d.result as string;
                    
                    window.open(result, "_blank");
                }
            })
        }
        if (Rd_custmastr.checked == true) {//******  تقرير استاذ العملاء

            rp.check = 3;

            Ajax.Callsync({
                url: Url.Action("IProc_Rpt_AccCustomerLedger", "GeneralReports"),
                data: rp,
                success: (d) => {

                    let result = d.result as string;
                    
                    window.open(result, "_blank");
                }
            })
        } 
    } 
}