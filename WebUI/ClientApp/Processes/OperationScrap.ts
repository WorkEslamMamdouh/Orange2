$(document).ready(() => {

    OperationRepScrap.InitalizeComponent();
})

namespace OperationRepScrap {

    var compcode: Number;
    var BranchCode: Number;
    var AccountType: Number = 2;
    var sys: SystemTools = new SystemTools();
    var SysSession: SystemSession = GetSystemSession(Modules.OperationScrap);
    //------------------------------------------------------------   

    var Details: Array<IQ_GetVendor> = new Array<IQ_GetVendor>();
    var Details_Vendor: Array<A_Pay_D_Vendor> = new Array<A_Pay_D_Vendor>();
    var operationDetailsList: Array<I_TR_Operation> = new Array<I_TR_Operation>();

    //------------------------------------------------------------

    var btnReset;
    var btnOPerationSearch: HTMLButtonElement;
    var txtVendorType: HTMLSelectElement;
    var OperaID = 0;
    //--- Print Buttons
    var btnPrint: HTMLButtonElement;
    var btnPrintTrview: HTMLButtonElement;
    var btnPrintTrPDF: HTMLButtonElement;
    var btnPrintTrEXEL: HTMLButtonElement;


    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);

    export function InitalizeComponent() {
        debugger

        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = "سجل البواقي";

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
        DisplayAccDefVendor();
        $('#btnPrint').addClass('display_none');
    }

    function InitalizeControls() {
        txtVendorType = document.getElementById("txtVendorType") as HTMLSelectElement;
        btnOPerationSearch = document.getElementById("btnOPerationSearch") as HTMLButtonElement;
        btnReset = document.getElementById("btnReset") as HTMLButtonElement;
        //---------------------------------------------------------------------- Print Buttons

        btnPrint = document.getElementById("btnPrint") as HTMLButtonElement;
        btnPrintTrview = document.getElementById("btnPrintTrview") as HTMLButtonElement;
        btnPrintTrPDF = document.getElementById("btnPrintTrPDF") as HTMLButtonElement;
        btnPrintTrEXEL = document.getElementById("btnPrintTrEXEL") as HTMLButtonElement;

    }

    function InitalizeEvents() {
        btnOPerationSearch.onclick = btnOPerationSearch_onclick;
        // Print Buttons
        btnPrintTrview.onclick = () => { PrintReport(1); }
        btnPrintTrPDF.onclick = () => { PrintReport(2); }
        btnPrintTrEXEL.onclick = () => { PrintReport(3); }
        btnPrint.onclick = () => { PrintReport(4); }
        btnReset.onclick = btnReset_onclick;
    }

    function btnOPerationSearch_onclick() {
        let sys: SystemTools = new SystemTools();
        sys.FindKey(Modules.ProcSalesMgr, "btnOPerationSearch", " BranchCode = " + BranchCode + " and CompCode = " + compcode + "and Status = 2 ", () => {
            let OperationID = SearchGrid.SearchDataGrid.SelectedKey
            GetOPeration(OperationID);
        });
    }

    function GetOPeration(OperationID: number) {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("OperationInvoice", "GetAllbyID"),
            data: { OperationID: OperationID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    operationDetailsList = result.Response as Array<I_TR_Operation>;
                    $('#txt_Processes').val(operationDetailsList[0].TrNo);
                    OperaID = operationDetailsList[0].OperationID;

                }
            }
        });

    }
    //----------------------------------------------------(Get Vendor )
    function DisplayAccDefVendor() {
        debugger
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefVendor", "GetAll"),
            data: {
                CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                //;
                let result = d as BaseResponse;
                if (result.IsSuccess) {

                    Details_Vendor = result.Response as Array<A_Pay_D_Vendor>;

                    for (var i = 0; i < Details_Vendor.length; i++) {
                        $('#txt_ID_Vendor').append('<option value="' + Details_Vendor[i].VendorID + '">' + (lang == "ar" ? Details_Vendor[i].NAMEA : Details_Vendor[i].NAMEL) + '</option>');
                    }

                }

            }
        });

    }

    function btnReset_onclick() {

        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);

        discharge();


    }

    function discharge() {
        $('#txt_ID_APP_Category option[value=Null]').prop('selected', 'selected').change();
        $('#ddlSalesman option[value=Null]').prop('selected', 'selected').change();
        $('#txt_ID_APP_Group option[value=Null]').prop('selected', 'selected').change();
        $('#ddlCustomer option[value=null]').prop('selected', 'selected').change();
        $('#txt_ID_APP_Type option[value=Null]').prop('selected', 'selected').change();
        $('#txtVendorType option[value=Null]').prop('selected', 'selected').change();
        $('#txt_indebtedness option[value=All]').prop('selected', 'selected').change();
        $('#txt_ID_Vendor option[value=Null]').prop('selected', 'selected').change();
    }


    //----------------------------------------------------( Report )
    function PrintReport(OutType: number) {
        debugger
        if ($("#txt_ID_Vendor").val() == "Null") {
            DisplayMassage("يجب اختيار مورد", "Must choose supplier", MessageType.Worning);
            Errorinput($("#txt_ID_Vendor"));
            return;
        }
        let rp: ReportParameters = new ReportParameters();

        rp.RepType = OutType;//output report as View


        rp.VendorId = Number($("#txt_ID_Vendor").val());

        if ($("#txt_Processes").val() == "") {
            rp.OperationId = -1;

        } else {
            rp.OperationId = OperaID;
        }

        rp.Name_function = "IProc_Rep_OperationScrap";
        localStorage.setItem("Report_Data", JSON.stringify(rp));
        

        localStorage.setItem("result", '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>');
        window.open(Url.Action("ReportsPopup", "Home"), "_blank");

    }

}