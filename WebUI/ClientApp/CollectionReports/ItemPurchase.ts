$(document).ready(() => {

    ItemPurchase.InitalizeComponent();
})

namespace ItemPurchase {

    var compcode: number;
    var BranchCode: number;          
    var Finyear : number;          
    var sys: SystemTools = new SystemTools();
    var SysSession: SystemSession = GetSystemSession(Modules.ItemPurchase);
    var Display_ItemFamily: Array<I_ItemFamily> = new Array<I_ItemFamily>();
    var Display_ItemFamilyFill: Array<I_ItemFamily> = new Array<I_ItemFamily>();
    var VendorDetails: IQ_GetVendor = new IQ_GetVendor;
    var Details: Array<I_Item> = new Array<I_Item>();
    //------------------------------------------------------------
    var catId;
    var txtVendorCode: HTMLInputElement;
    var txtVendorName: HTMLInputElement;
    var MVendorId = 0;
    var txtDateFrom: HTMLInputElement;
    var txtDateTo: HTMLInputElement;    
    var reptp1: HTMLInputElement;
    var chk_Authorized: HTMLInputElement;
    var reptp2: HTMLInputElement;
    var InvTp1: HTMLInputElement;
    var InvTp2: HTMLInputElement;
    var btnReset;
    var reptype2: HTMLInputElement;
    var btnVendorSrch: HTMLButtonElement;
    //--- Print Buttons
    var btnPrint: HTMLButtonElement;
    var btnPrintTrview: HTMLButtonElement;
    var btnPrintTrPDF: HTMLButtonElement;
    var btnPrintTrEXEL: HTMLButtonElement;
    var drpitem_family: HTMLSelectElement;
    var txt_ID_APP_Type: HTMLSelectElement;
    var drpPaymentType: HTMLSelectElement;
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);

    export function InitalizeComponent() {
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        BranchCode = Number(sys.SysSession.CurrentEnvironment.BranchCode);
        Finyear = Number(SysSession.CurrentEnvironment.CurrentYear);
        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = "مشتريات موردين";

        } else {
            document.getElementById('Screen_name').innerHTML = "Customer Sales";

        }
        $("#iconMainPages").addClass("d-none");
        $("#iconReportPages").removeClass("d-none");
        $("#btnPrintTrview span").text("عرض تقرير");
        $("#btnPrintTrview").addClass("print-report");
      
        InitalizeControls();
        InitalizeEvents();
        reptp1.checked = true;
        reptype2.checked = true;
        InvTp1.checked = true;
         txtDateFrom.value = DateFormat(SysSession.CurrentEnvironment.StartDate);
        txtDateTo.value = ConvertToDateDash(GetDate()) <= ConvertToDateDash(SysSession.CurrentEnvironment.EndDate) ? GetDate() : SysSession.CurrentEnvironment.EndDate;

        Display_DrpPaymentType();
        Display_I_ItemFamily();

        $('#txt_ID_APP_Type').append('<option value="' + 0 + '"> ' + (lang == "ar" ? "اختر الصنف " : "choose item") + '</option>');
        $('#btnPrint').addClass('display_none');
        $('#txt_PaymentType').val('2');

    } 

    function InitalizeControls() {

        btnVendorSrch = document.getElementById("btnVendorSrch") as HTMLButtonElement;
        btnPrint = document.getElementById("btnPrint") as HTMLButtonElement;
        btnPrintTrview = document.getElementById("btnPrintTrview") as HTMLButtonElement;
        btnPrintTrPDF = document.getElementById("btnPrintTrPDF") as HTMLButtonElement;
        btnPrintTrEXEL = document.getElementById("btnPrintTrEXEL") as HTMLButtonElement;
        txtDateFrom = document.getElementById("txtFromDate") as HTMLInputElement;
        txtDateTo = document.getElementById("txtToDate") as HTMLInputElement;
        drpitem_family = document.getElementById("drpitem_family") as HTMLSelectElement;
        txt_ID_APP_Type = document.getElementById("txt_ID_APP_Type") as HTMLSelectElement;
        drpPaymentType = document.getElementById("drpPaymentType") as HTMLSelectElement;
        reptp1 = document.getElementById("reptp1") as HTMLInputElement;
        reptp2 = document.getElementById("reptp2") as HTMLInputElement;
        reptype2 = document.getElementById("reptype2") as HTMLInputElement;
        txtVendorCode = document.getElementById("txtVendorCode") as HTMLInputElement;
        txtVendorName = document.getElementById("txtVendorName") as HTMLInputElement;
        chk_Authorized = document.getElementById("chk_Authorized") as HTMLInputElement;
        btnReset = document.getElementById("btnReset") as HTMLButtonElement;
        InvTp1 = document.getElementById("InvTp1") as HTMLInputElement;
        InvTp2 = document.getElementById("InvTp2") as HTMLInputElement;
    }
    

    function InitalizeEvents() {
        // Print Buttons
        btnPrintTrview.onclick = () => { PrintReport(1); }
        btnPrintTrPDF.onclick = () => { PrintReport(2); }
        btnPrintTrEXEL.onclick = () => { PrintReport(3); }
        btnPrint.onclick = () => { PrintReport(4); }
        drpPaymentType.onchange = drpPaymentType_onchange;
        btnReset.onclick = btnReset_onclick;
        drpitem_family.onchange = itemDisplay;
        btnVendorSrch.onclick = btnVendor_onclick;
        txtVendorCode.onchange = () => { GetVendorByCode(txtVendorCode.value); }
    }

    //----------------------------------------------------( Get Item_Cat )
    function Display_DrpPaymentType() {
         
        var Display_Type: Array<I_D_Category> = new Array<I_D_Category>();
         
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("StkDefCategory", "GetAll"),
            data: {
                CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    Display_Type = result.Response as Array<I_D_Category>;
                     
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
                        DocumentActions.FillCombowithdefult(Display_Type, drpPaymentType, "CatID", "DescA", "اختر الفئة");
                  }
                     else {
                         DocumentActions.FillCombowithdefult(Display_Type, drpPaymentType, "CatID", "DescL", "Select Category");
                     }


                    
                }
            }
        });
    }
    
    //----------------------------------------------------( Get item familly )
    function Display_I_ItemFamily() {
       
         Display_ItemFamily= new Array<I_ItemFamily>();

        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("StkDefItemType", "GetAll"),
            data: {
                CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {

                    Display_ItemFamily = result.Response as Array<I_ItemFamily>;
                   
                       
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
                        DocumentActions.FillCombowithdefult(Display_ItemFamily, drpitem_family, "ItemFamilyID", "DescA", "اختر النوع");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(Display_ItemFamily, drpitem_family, "ItemFamilyID", "DescL", "Select Type");                             
                    }

                    if (drpitem_family.value != 'null') {
                        $('#txt_ID_APP_Type').html('');
                        $('#txt_ID_APP_Type').removeAttr("disabled")
                    } else {
                        $('#txt_ID_APP_Type').html('');
                        $('#txt_ID_APP_Type').attr("disabled")
                    }
                     
                }
            }
        });
    }
    function drpPaymentType_onchange()
    {
        if (drpPaymentType.value!='null') {
            Display_ItemFamilyFill = Display_ItemFamily.filter(x => x.CatID == Number(drpPaymentType.value))
            if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
                DocumentActions.FillCombowithdefult(Display_ItemFamilyFill, drpitem_family, "ItemFamilyID", "DescA", "اختر النوع");
            }
            else {
                DocumentActions.FillCombowithdefult(Display_ItemFamilyFill, drpitem_family, "ItemFamilyID", "DescL", "Select Type");
            }
        } else {
            if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
                DocumentActions.FillCombowithdefult(Display_ItemFamily, drpitem_family, "ItemFamilyID", "DescA", "اختر النوع");
            }
            else {
                DocumentActions.FillCombowithdefult(Display_ItemFamily, drpitem_family, "ItemFamilyID", "DescL", "Select Type");
            }
        }
       
    }

    //----------------------------------------------------( Get Customer )
    function btnVendor_onclick() {        
        sys.FindKey(Modules.ItemPurchase, "btnVendorSrch", "CompCode=" + compcode + "", () => {
            let id = SearchGrid.SearchDataGrid.SelectedKey;
            GetVendorById(id);
                          debugger
            txtVendorCode.value = VendorDetails.VendorCode;
            txtVendorName.value = lang == "ar" ? VendorDetails.NAMEA : VendorDetails.NAMEL;
            MVendorId = id;
        });
    }
    function GetVendorById(id: number) {
        VendorDetails = new IQ_GetVendor();   
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefVendor", "GetVendorById"),
            data: {
                id: id, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    debugger
                    VendorDetails = result.Response as IQ_GetVendor;
                }
            }
        });
    }   
    function GetVendorByCode(Code: string) {
        if (txtVendorCode.value.trim() == "") {
            txtVendorCode.value = "";
            txtVendorName.value = "";
            MVendorId = 0;
        } else {

        VendorDetails = new IQ_GetVendor();
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefVendor", "GetBycode"),
            data: {
                Compcode: compcode, code: Code , UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                 
                VendorDetails = result.Response as IQ_GetVendor;
                if (VendorDetails == null) {
                    txtVendorCode.value = VendorDetails.VendorCode;
                    txtVendorName.value = lang == "ar" ? VendorDetails.NAMEA : VendorDetails.NAMEL;
                    MVendorId = VendorDetails.VendorID;

                } else {
                    txtVendorCode.value = "";
                    txtVendorName.value = "";
                    MVendorId = 0;
                }
            }
            });

        }
    }
    //----------------------------------------------------( Item Desc )
    function itemDisplay() {
         
        if (drpitem_family.value!='null') {
            Details = new Array<I_Item>();

             
             var ItemFamilyID = Number($("#drpitem_family").val());
            var finyear = sys.SysSession.CurrentEnvironment.CurrentYear;
            Ajax.Callsync({
                type: "Get",
                url: sys.apiUrl("StkDefItemType", "GetI_ItemByFamilyIdOrdered"),
                data: {
                    CompCode: compcode,  FinYear: finyear, familyid: ItemFamilyID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
                },
                success: (d) => {

                    let result = d as BaseResponse;
                    if (result.IsSuccess) {
                         
                        Details = result.Response as Array<I_Item>;


                        $('#txt_ID_APP_Type').html('');
                        $('#txt_ID_APP_Type').removeAttr("disabled")
                        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
                            DocumentActions.FillCombowithdefult(Details, txt_ID_APP_Type, "ItemID", "DescA", "اختر الصنف");
                        }
                        if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                            DocumentActions.FillCombowithdefult(Details, txt_ID_APP_Type, "ItemID", "DescL", "Select Item");
                        }
                        
                    }
                }
            });
        } else {
            $('#txt_ID_APP_Type').attr("disabled", "disabled");         
            DocumentActions.FillCombowithdefult(Details, txt_ID_APP_Type, "ItemID", "Itm_DescA", "اختر الصنف");   
        }
       

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
        discharge(); 
     }

    function discharge() {
        $('#drpPaymentType option[value=Null]').prop('selected', 'selected').change();
        $('#txt_indebtedness option[value=All]').prop('selected', 'selected').change();
        $('#drpitem_family option[value=0]').prop('selected', 'selected').change();
        $('#txt_ID_status option[value=1]').prop('selected', 'selected').change(); 
        $('#txt_ID_APP_Type').html('');
        $('#txt_ID_APP_Type').append('<option value="' + 0 + '">' + (lang == "ar" ? " اختر الصنف" : "choose item")+'  </option>');
        $('#txt_ID_APP_Type').attr("disabled", "disabled");
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
        debugger
        if (MVendorId == 0) {
            rp.VendorId = -1;
        } else {
            rp.VendorId = MVendorId;
        }
        rp.PaymentType = Number($('#txt_PaymentType').val());
        rp.invType = Number($('#invType').val());
        debugger
        if (InvTp1.checked == true) {
            rp.invType = 1;
        } else if (InvTp2.checked == true) {
            rp.invType = 2;
        } else {
            rp.invType = 0;
        }
        if (reptp1.checked == true) {  //------------By_Cust
            rp.check = 1;

        }
        else {                         //------------By_Item
            rp.check = 2;
        }     
        if ($("#drpPaymentType").val() == "null") {//-------------جميع الفئات
            rp.CatId = -1;
        } else {
            rp.CatId = Number($("#drpPaymentType").val());
        }
        if ($("#drpitem_family").val() == "null") {//-------------جميع الانواع
            rp.ItemFamId = -1;
            rp.ItemID = -1;
        } else {
            rp.ItemFamId = Number($("#drpitem_family").val());

            if ($("#txt_ID_APP_Type").val() == "null") {//-------------جميع الاصناف
                rp.ItemID = -1;
            } else {
                rp.ItemID = Number($("#txt_ID_APP_Type").val());
            }
        }                 
        rp.Status = $('#Authorized').val(); 
        
        if (reptype2.checked == true) {      
            Ajax.Callsync({
                url: Url.Action("IProc_Rpt_ItemPurchaseSum", "GeneralReports"), 
                data: rp,
                success: (d) => {     
                    let result = d.result as string;
                    

                    window.open(result, "_blank");
                }
            })
        }
        else {
            Ajax.Callsync({             
                url: Url.Action("IProc_Rpt_ItemPurchaseDetail", "GeneralReports"),
                data: rp,
                success: (d) => {     
                    let result = d.result as string;
                    
                    window.open(result, "_blank");
                }
            })
        }   
    } 
}