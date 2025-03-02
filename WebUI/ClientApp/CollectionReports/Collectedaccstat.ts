﻿$(document).ready(() => { 
    Collectedaccstat.InitalizeComponent();
})

namespace Collectedaccstat {

    var compcode: Number;
    var AccountType: Number = 2;
    var sys: SystemTools = new SystemTools();
    var SysSession: SystemSession = GetSystemSession(Modules.Collectedaccstat);

    //------------------------------------------------------------
    var Details_Type_D_Category: Array<A_RecPay_D_Category> = new Array<A_RecPay_D_Category>();
    var Details_CustomerGroup: Array<A_RecPay_D_Group> = new Array<A_RecPay_D_Group>();
    var SalesmanDetails: Array<I_Sls_D_Salesman> = new Array<I_Sls_D_Salesman>();
    var Details: Array<IQ_GetVendor> = new Array<IQ_GetVendor>();
    var Details_Vendor: Array<A_Pay_D_Vendor> = new Array<A_Pay_D_Vendor>();
    var VatTypeDetails: Array<A_D_VAT_TYPE> = new Array<A_D_VAT_TYPE>();
    var ddl_CustomerFilter: Array<A_Rec_D_Customer> = new Array<A_Rec_D_Customer>();
     
    //------------------------------------------------------------
    var txt_ID_APP_Category: HTMLSelectElement; 
    var txtVendorType: HTMLSelectElement;
    var Rddetails: HTMLInputElement;
    var Rd_sum: HTMLInputElement;
    var txtDateFrom: HTMLInputElement;
    var txtDateTo: HTMLInputElement;
    var btnReset;

    var CheckboxStatus: HTMLInputElement;
    var ddl_Customer: HTMLSelectElement;
    //-------------------------------------------------------------
    var indebtedness;

    //--- Print Buttons
    var btnPrint: HTMLButtonElement;
    var btnPrintTrview: HTMLButtonElement;
    var btnPrintTrPDF: HTMLButtonElement;
    var btnPrintTrEXEL: HTMLButtonElement;
     
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);

     export function InitalizeComponent() {
        debugger

        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = "كشف حساب مجمع";

        } else {
            document.getElementById('Screen_name').innerHTML = "collected Account Statement";

         }
         $("#iconMainPages").addClass("d-none");
         $("#iconReportPages").removeClass("d-none");
         $("#btnPrintTrview").addClass("print-report");
         $("#btnPrintTrview span").text("عرض تقرير");
        InitalizeControls();
        InitalizeEvents();
        txtDateFrom.value = DateFormat(SysSession.CurrentEnvironment.StartDate);
        txtDateTo.value = ConvertToDateDash(GetDate()) <= ConvertToDateDash(SysSession.CurrentEnvironment.EndDate) ? GetDate() : SysSession.CurrentEnvironment.EndDate;
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        DisplayAccDefVendor();
        Display_SupplierCat();
        Display_SupplierGroup();
        Display_Salesman(); 
         Rddetails.checked = true;
         Fillddl_Customer();
         $('#btnPrint').addClass('display_none'); 
    }
     
    function InitalizeControls() {

        txt_ID_APP_Category = document.getElementById("txt_ID_APP_Category") as HTMLSelectElement; 
        txtVendorType = document.getElementById("txtVendorType") as HTMLSelectElement;
        txtDateFrom = document.getElementById("txtFromDate") as HTMLInputElement;
        txtDateTo = document.getElementById("txtToDate") as HTMLInputElement;
        Rddetails = document.getElementById("Rd_detail") as HTMLInputElement;
        Rd_sum = document.getElementById("Rd_sum") as HTMLInputElement;


        btnReset = document.getElementById("btnReset") as HTMLButtonElement;
        

        ddl_Customer = document.getElementById("ddl_Customer") as HTMLSelectElement;
        CheckboxStatus = document.getElementById("CheckboxStatus") as HTMLInputElement;
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
        btnReset.onclick = btnReset_onclick;
    }
    //----------------------------------------------------( Get cus_Cat )
    function Display_SupplierCat() {
        //var StkDefCategory: Array<I_D_Category> = new Array<I_D_Category>();
        debugger
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GenDefCategory", "GetAll"),
            data: {
                CompCode: compcode, AccountType: AccountType, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                //debugger;
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    Details_Type_D_Category = result.Response as Array<A_RecPay_D_Category>;

                    DisplayStGenDefSupplierCat();
                }
            }
        });
    }

    function DisplayStGenDefSupplierCat() {
        debugger
        for (var i = 0; i < Details_Type_D_Category.length; i++) {



            $('#txt_ID_APP_Category').append('<option value="' + Details_Type_D_Category[i].CatID + '">' + (lang == "ar" ? Details_Type_D_Category[i].Cat_DescA  : Details_Type_D_Category[i].Cat_DescE) + '</option>');


        }

    }
    //----------------------------------------------------( Get cus_Group )
    function Display_SupplierGroup() {


        //debugger
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GenDefGroup", "GetAll"),
            data: {
                CompCode: compcode, AccountType: AccountType, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                //debugger;
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    Details_CustomerGroup = result.Response as Array<A_RecPay_D_Group>;

                    DisplayStkSupplierGroup();
                }
            }
        });
    }

    function DisplayStkSupplierGroup() {
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
                CompCode: compcode, IsSalesEnable: true, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    //debugger;
                    SalesmanDetails = result.Response as Array<I_Sls_D_Salesman>;
                    SalesmanDetails = SalesmanDetails.filter(s => s.Isactive == true);
                    DisplaySalesman();
                }
            }
        });
    }

    function DisplaySalesman() {
        for (var i = 0; i < SalesmanDetails.length; i++) {

            $('#ddlSalesman').append('<option value="' + SalesmanDetails[i].SalesmanId + '">' + (lang == "ar" ? SalesmanDetails[i].NameA : SalesmanDetails[i].NameE) + '</option>');

        }

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
   
    //----------------------------------------------------(Get Vendor )
    function DisplayAccDefVendor() {
         
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefVendor", "GetAll"),
            data: {
                CompCode: compcode , UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                //;
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    debugger
                    Details_Vendor = result.Response as Array<A_Pay_D_Vendor>;
                    Details_Vendor = Details_Vendor.filter(x => x.PurchaserId != null)
                    DisplayStVendor();

                }

            }
        });

    }
    function DisplayStVendor() {
        debugger
        for (var i = 0; i < Details_Vendor.length; i++)
        {
            $('#txt_ID_Vendor').append('<option value="' + Details_Vendor[i].VendorID + '">' + (lang == "ar" ? Details_Vendor[i].NAMEA  : Details_Vendor[i].NAMEL) + '</option>');
        }
               
    }
     
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
        $('#txtVendorType option[value=Null]').prop('selected', 'selected').change();
        $('#txt_indebtedness option[value=All]').prop('selected', 'selected').change();
        $('#txt_ID_Vendor option[value=Null]').prop('selected', 'selected').change();
    }

    function Fillddl_Customer() {

        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefCustomer", "GetAll"),
            data: {
                CompCode: compcode, BranchCode: SysSession.CurrentEnvironment.BranchCode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess == true) {

                    ddl_CustomerFilter = result.Response as Array<A_Rec_D_Customer>;
                    DocumentActions.FillCombowithdefult(ddl_CustomerFilter, ddl_Customer, "CustomerId", "NAMEA", " اختر العميل ");
                }
            }
        });
    }

    //----------------------------------------------------( Report )
    function PrintReport(OutType: number) {

        debugger
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

        if ($("#txt_ID_Vendor").val() == "null") {//-------------جميع العملاء
            rp.VendorId = -1;
        } else {
            rp.VendorId = Number($("#txt_ID_Vendor").val());
        }

        if ($("#txtVendorType").val() == "Null") {//-------------جميع المناديب 
            rp.VendType = -1;
        } if ($("#txtVendorType").val() == "1") {//---------------مورد بضاعه 
            rp.VendType = 0;
        } if ($("#txtVendorType").val() == "2") {//---------------مورد خدمات
            rp.VendType = 1;
        }
 

        if ($("#txt_indebtedness").val() == ">") {//******عليه مديونيه
            rp.BalType = 1;

        }
        else if ($("#txt_indebtedness").val() == "<") {//******ليه مديونيه
            rp.BalType = 2;

        }
        else if ($("#txt_indebtedness").val() == "=") {//******صفري
            rp.BalType = 3;

        }
        else {//******الجميع

            rp.BalType = 0;
        }


        if (CheckboxStatus.checked == true) {
            rp.Status = 3;
        }
        else {
            rp.Status = 1;
        }



        if ($("#txt_ID_Vendor").val() == "Null") {//-------------جميع الفئات
            rp.VendorId = -1;
        } else {
            rp.VendorId = Number($("#txt_ID_Vendor").val());
        }
        rp.checkedprint = Rddetails.checked;
         
        if (rp.checkedprint == true) {

            Ajax.Callsync({
                url: Url.Action("IProc_Rpt_AccVendorCollDetail", "GeneralReports"),
                data: rp,
                success: (d) => {

                    let result = d.result as string;

                    
 
                    window.open(result, "_blank");
                }
            })

        } else {

            Ajax.Callsync({
                url: Url.Action("IProc_Rpt_AccVendorCollSummary", "GeneralReports"),
                data: rp,
                success: (d) => {

                    let result = d.result as string;

                    

                    window.open(result, "_blank");
                }
            })
        }
    }

}