$(document).ready(function () {
    OperationRepScrap.InitalizeComponent();
});
var OperationRepScrap;
(function (OperationRepScrap) {
    var compcode;
    var BranchCode;
    var AccountType = 2;
    var sys = new SystemTools();
    var SysSession = GetSystemSession(Modules.OperationScrap);
    //------------------------------------------------------------   
    var Details = new Array();
    var Details_Vendor = new Array();
    var operationDetailsList = new Array();
    //------------------------------------------------------------
    var btnReset;
    var btnOPerationSearch;
    var txtVendorType;
    var OperaID = 0;
    //--- Print Buttons
    var btnPrint;
    var btnPrintTrview;
    var btnPrintTrPDF;
    var btnPrintTrEXEL;
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);
    function InitalizeComponent() {
        debugger;
        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = "سجل البواقي";
        }
        else {
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
    OperationRepScrap.InitalizeComponent = InitalizeComponent;
    function InitalizeControls() {
        txtVendorType = document.getElementById("txtVendorType");
        btnOPerationSearch = document.getElementById("btnOPerationSearch");
        btnReset = document.getElementById("btnReset");
        //---------------------------------------------------------------------- Print Buttons
        btnPrint = document.getElementById("btnPrint");
        btnPrintTrview = document.getElementById("btnPrintTrview");
        btnPrintTrPDF = document.getElementById("btnPrintTrPDF");
        btnPrintTrEXEL = document.getElementById("btnPrintTrEXEL");
    }
    function InitalizeEvents() {
        btnOPerationSearch.onclick = btnOPerationSearch_onclick;
        // Print Buttons
        btnPrintTrview.onclick = function () { PrintReport(1); };
        btnPrintTrPDF.onclick = function () { PrintReport(2); };
        btnPrintTrEXEL.onclick = function () { PrintReport(3); };
        btnPrint.onclick = function () { PrintReport(4); };
        btnReset.onclick = btnReset_onclick;
    }
    function btnOPerationSearch_onclick() {
        var sys = new SystemTools();
        sys.FindKey(Modules.ProcSalesMgr, "btnOPerationSearch", " BranchCode = " + BranchCode + " and CompCode = " + compcode + "and Status = 2 ", function () {
            var OperationID = SearchGrid.SearchDataGrid.SelectedKey;
            GetOPeration(OperationID);
        });
    }
    function GetOPeration(OperationID) {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("OperationInvoice", "GetAllbyID"),
            data: { OperationID: OperationID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    operationDetailsList = result.Response;
                    $('#txt_Processes').val(operationDetailsList[0].TrNo);
                    OperaID = operationDetailsList[0].OperationID;
                }
            }
        });
    }
    //----------------------------------------------------(Get Vendor )
    function DisplayAccDefVendor() {
        debugger;
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefVendor", "GetAll"),
            data: {
                CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                //;
                var result = d;
                if (result.IsSuccess) {
                    Details_Vendor = result.Response;
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
    function PrintReport(OutType) {
        debugger;
        if ($("#txt_ID_Vendor").val() == "Null") {
            DisplayMassage("يجب اختيار مورد", "Must choose supplier", MessageType.Worning);
            Errorinput($("#txt_ID_Vendor"));
            return;
        }
        var rp = new ReportParameters();
        rp.RepType = OutType; //output report as View
        rp.VendorId = Number($("#txt_ID_Vendor").val());
        if ($("#txt_Processes").val() == "") {
            rp.OperationId = -1;
        }
        else {
            rp.OperationId = OperaID;
        }
        rp.Name_function = "IProc_Rep_OperationScrap";
        localStorage.setItem("Report_Data", JSON.stringify(rp));
        localStorage.setItem("result", '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>');
        window.open(Url.Action("ReportsPopup", "Home"), "_blank");
    }
})(OperationRepScrap || (OperationRepScrap = {}));
//# sourceMappingURL=OperationScrap.js.map