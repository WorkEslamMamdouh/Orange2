$(document).ready(function () {
    VATReport.InitializeComponent();
});
var VATReport;
(function (VATReport) {
    debugger;
    //************system variables
    var SysSession = GetSystemSession(Modules.VatReport);
    var sys = new SystemTools();
    //***********Variables
    var VatPeriodDetail = new Array();
    var VatPeriod = new Array();
    var SalesGrid = new JsGrid();
    var PurGrid = new JsGrid();
    var vatyear = SysSession.CurrentEnvironment.CurrentYear;
    var SelectedPeriodCode = "";
    //***********Controls
    var drpVatPeriod;
    var txtFromDate;
    var txtToDate;
    var btn_Save;
    var btnEdit;
    var btn_Back;
    var btnLoad;
    var txtCORRECTIONS;
    var txtVAT_PREVBALANCE;
    var btnClose;
    var btnReopen;
    var btnDeliveringReport;
    var LbSlsAmount;
    var LbSlsChanges;
    var LbSlsVat;
    var LbPurAmount;
    var LbPurChanges;
    var LbPurVat;
    var rd_close;
    var rd_delivered;
    var rd_Open;
    var txtNETVAT_AMOUNT;
    //print buttons
    var btnPrintTrview;
    var btnPrintTrPDF;
    var btnPrintTrEXEL;
    var btnPrintReceive;
    var btnPrint;
    //*************************Initialization************************//
    function InitializeComponent() {
        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = "الاقرار الضريبي ";
        }
        else {
            document.getElementById('Screen_name').innerHTML = "Vat Report";
        }
        InitializeControls();
        InitializeEvents();
        InitializeSalesGrid();
        InitializePurGrid();
        Load_VatPeriod();
        //Button_privialges();
        btnEdit.disabled = !SysSession.CurrentPrivileges.EDIT;
        btnClose.disabled = !SysSession.CurrentPrivileges.CUSTOM1;
        btnReopen.disabled = !SysSession.CurrentPrivileges.CUSTOM2;
        $('#btnPrint').addClass('display_none');
        $("#btnShow").addClass("d-none");
        $("#btnAdd").addClass("d-none");
        $("#icon-bar").addClass("d-none");
    }
    VATReport.InitializeComponent = InitializeComponent;
    function InitializeControls() {
        drpVatPeriod = document.getElementById("drpVatPeriod");
        btnLoad = document.getElementById("btnLoad");
        rd_delivered = document.getElementById("rd_delivered");
        rd_close = document.getElementById("rd_close");
        rd_Open = document.getElementById("rd_Open");
        btnClose = document.getElementById("btnClose");
        btnReopen = document.getElementById("btnReopen");
        btnDeliveringReport = document.getElementById("btnDeliveringReport");
        LbSlsAmount = document.getElementById("LbSlsAmount");
        LbSlsChanges = document.getElementById("LbSlsChanges");
        LbSlsVat = document.getElementById("LbSlsVat");
        //drpVAT_PERIOD = document.getElementById("drpVAT_PERIOD") as HTMLSelectElement;
        txtCORRECTIONS = document.getElementById("txtCORRECTIONS");
        //chkSetting = document.getElementById("chkSetting") as HTMLInputElement;
        txtVAT_PREVBALANCE = document.getElementById("txtVAT_PREVBALANCE");
        //txtVAT_DB_ACC = document.getElementById("txtVAT_DB_ACC") as HTMLInputElement;
        //txtVAT_CR_ACC = document.getElementById("txtVAT_CR_ACC") as HTMLInputElement;
        //txtVAT_ACCURUAL_ACC = document.getElementById("txtVAT_ACCURUAL_ACC") as HTMLInputElement;
        btnEdit = document.getElementById("btnEdit");
        btn_Save = document.getElementById("btn_Save");
        btn_Back = document.getElementById("btn_Back");
        //btnAccountSearch_DB = document.getElementById("btnAccountSearch_DB") as HTMLButtonElement;
        //btnAccountSearch_CR = document.getElementById("btnAccountSearch_CR") as HTMLButtonElement;
        //btnAccountSearch_Acc = document.getElementById("btnAccountSearch_Acc") as HTMLButtonElement;
        LbPurAmount = document.getElementById("LbPurAmount");
        LbPurChanges = document.getElementById("LbPurChanges");
        LbPurVat = document.getElementById("LbPurVat");
        txtNETVAT_AMOUNT = document.getElementById("txtNETVAT_AMOUNT");
        //print 
        btnPrintTrview = document.getElementById("btnPrintTrview");
        btnPrintTrPDF = document.getElementById("btnPrintTrPDF");
        btnPrintTrEXEL = document.getElementById("btnPrintTrEXEL");
        btnPrintReceive = document.getElementById("btnPrintReceive");
        btnPrint = document.getElementById("btnPrint");
    }
    function InitializeEvents() {
        drpVatPeriod.onchange = drpVatPeriod_onchange;
        btnLoad.onclick = btnLoad_onclick;
        btnReopen.onclick = btnReopen_onclick;
        btnClose.onclick = btnClose_onclick;
        btnDeliveringReport.onclick = btnDeliveringReport_onclick;
        txtVAT_PREVBALANCE.onchange = txtVAT_PREVBALANCE_onchange;
        txtCORRECTIONS.onchange = txtCORRECTIONS_onchange;
        btnEdit.onclick = btnEdit_onclick;
        btn_Save.onclick = btnSave_onclick;
        btn_Back.onclick = btnBack_onclick;
        btnPrintTrview.onclick = function () { PrintReport(1); };
        btnPrintTrPDF.onclick = function () { PrintReport(2); };
        btnPrintTrEXEL.onclick = function () { PrintReport(3); };
        btnPrint.onclick = function () { PrintReport(4); };
    }
    function InitializeSalesGrid() {
        var res = GetResourceList("");
        SalesGrid.ElementName = "divSalesGrid";
        SalesGrid.Paging = true;
        SalesGrid.PageSize = 10;
        SalesGrid.Sorting = true;
        SalesGrid.InsertionMode = JsGridInsertionMode.Binding;
        SalesGrid.Editing = false;
        SalesGrid.Inserting = false;
        SalesGrid.SelectedIndex = 1;
        SalesGrid.OnItemEditing = function () { };
        SalesGrid.PrimaryKey = "LineOrder";
        SalesGrid.Columns = [
            { title: res.App_Code, name: "COMP_CODE", type: "number", width: "10%", visible: false },
            { title: res.App_Code, name: "VAT_YEAR", type: "number", width: "10%", visible: false },
            { title: res.App_Number, name: "LineOrder", type: "number", width: "10%" },
            { title: res.TransDesc, name: "DESCRIPTION", type: "number", width: "30%" },
            { title: res.App_Amount, name: "Val_Amount", type: "text", width: "20%" },
            { title: res.Update_Sales, name: "Upd_Amount", type: "text", width: "20%" },
            { title: res.App_Tax, name: "VAT_Amount", type: "text", width: "20%" }
        ];
        SalesGrid.Bind();
    }
    function InitializePurGrid() {
        var res = GetResourceList("");
        PurGrid.ElementName = "divPurGrid";
        PurGrid.Paging = true;
        PurGrid.PageSize = 10;
        PurGrid.Sorting = true;
        PurGrid.InsertionMode = JsGridInsertionMode.Binding;
        PurGrid.Editing = false;
        PurGrid.Inserting = false;
        PurGrid.SelectedIndex = 1;
        PurGrid.OnItemEditing = function () { };
        PurGrid.PrimaryKey = "LineOrder";
        PurGrid.Columns = [
            { title: res.App_Code, name: "COMP_CODE", type: "number", width: "10%", visible: false },
            { title: res.App_Code, name: "VAT_YEAR", type: "number", width: "10%", visible: false },
            { title: res.App_Number, name: "LineOrder", type: "number", width: "10%" },
            { title: res.TransDesc, name: "DESCRIPTION", type: "number", width: "30%" },
            { title: res.App_Amount, name: "Val_Amount", type: "text", width: "20%" },
            { title: res.Update_Purshase, name: "Upd_Amount", type: "text", width: "20%" },
            { title: res.App_Tax, name: "VAT_Amount", type: "text", width: "20%" }
        ];
        PurGrid.Bind();
    }
    function Load_VatPeriodDetails() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AVATPERIOD", "GetVatDetails"),
            data: {
                UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token, COMP_CODE: Number(SysSession.CurrentEnvironment.CompCode),
                VAT_YEAR: vatyear, PERIOD_CODE: Number(drpVatPeriod.value)
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    VatPeriodDetail = result.Response;
                    //****************************************
                    var SlsPeriodDet = VatPeriodDetail.filter(function (x) { return x.TYPE == 1; }).sort(function (a, b) { return a.LineOrder - b.LineOrder; });
                    SalesGrid.DataSource = SlsPeriodDet;
                    SalesGrid.Bind();
                    var AmountValueSum = 0;
                    var AmountUpdtSum = 0;
                    var AmountVatSum = 0;
                    for (var i = 0; i < SlsPeriodDet.length; i++) {
                        AmountValueSum = (AmountValueSum + SlsPeriodDet[i].Val_Amount);
                        AmountUpdtSum = AmountUpdtSum + SlsPeriodDet[i].Upd_Amount;
                        AmountVatSum = AmountVatSum + SlsPeriodDet[i].VAT_Amount;
                    }
                    LbSlsAmount.innerHTML = AmountValueSum.RoundToSt(2);
                    LbSlsVat.innerHTML = AmountVatSum.RoundToSt(2);
                    LbSlsChanges.innerHTML = AmountUpdtSum.RoundToSt(2);
                    //****************************************
                    var PurPeriodDet = VatPeriodDetail.filter(function (x) { return x.TYPE == 2; }).sort(function (a, b) { return a.LineOrder - b.LineOrder; });
                    PurGrid.DataSource = PurPeriodDet;
                    PurGrid.Bind();
                    AmountValueSum = 0;
                    AmountUpdtSum = 0;
                    AmountVatSum = 0;
                    for (var i = 0; i < PurPeriodDet.length; i++) {
                        AmountValueSum = AmountValueSum + PurPeriodDet[i].Val_Amount;
                        AmountUpdtSum = AmountUpdtSum + PurPeriodDet[i].Upd_Amount;
                        AmountVatSum = AmountVatSum + PurPeriodDet[i].VAT_Amount;
                    }
                    LbPurAmount.innerHTML = AmountValueSum.RoundToSt(2);
                    LbPurVat.innerHTML = AmountVatSum.RoundToSt(2);
                    LbPurChanges.innerHTML = AmountUpdtSum.RoundToSt(2);
                }
            }
        });
    }
    function Load_VatPeriod() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AVATPERIOD", "GetAllByComp"),
            data: {
                UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token, compcode: Number(SysSession.CurrentEnvironment.CompCode)
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    debugger;
                    VatPeriod = result.Response;
                    VatPeriod = VatPeriod.filter(function (x) { return x.VAT_YEAR == Number(vatyear); });
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "ar")
                        DocumentActions.FillComboFirstvalue(VatPeriod, drpVatPeriod, "PERIOD_CODE", "PERIOD_CODE", "- اختر -", null);
                    else
                        DocumentActions.FillComboFirstvalue(VatPeriod, drpVatPeriod, "PERIOD_CODE", "PERIOD_CODE", "- select -", null);
                }
            }
        });
    }
    function btnLoad_onclick() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AVATPERIOD", "CalculateVatPeriod"),
            data: {
                UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token, COMP_CODE: Number(SysSession.CurrentEnvironment.CompCode),
                VAT_YEAR: vatyear, VatPeriod: Number(drpVatPeriod.value)
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    Display();
                    btnEdit_onclick();
                    debugger;
                    CalculateTotalVat();
                    CalculateRequiredVat();
                }
            }
        });
    }
    function drpVatPeriod_onchange() {
        if (drpVatPeriod.value != "null" && drpVatPeriod.value != "") {
            SelectedPeriodCode = drpVatPeriod.value;
            Load_VatPeriodDetails();
            var selected = VatPeriod.filter(function (x) { return x.PERIOD_CODE == Number(drpVatPeriod.value); })[0];
            if (selected.CORRECTIONS != null)
                $("#txtCORRECTIONS").val(selected.CORRECTIONS.toString());
            else
                $("#txtCORRECTIONS").val("0");
            if (selected.VAT_PREVBALANCE != null)
                $("#txtVAT_PREVBALANCE").val(selected.VAT_PREVBALANCE.toString());
            else
                $("#txtVAT_PREVBALANCE").val("0");
            if (selected.NETVAT_AMOUNT != null)
                $("#txtNETVAT_AMOUNT").val(selected.NETVAT_AMOUNT.toString());
            else
                $("#txtNETVAT_AMOUNT").val("0");
            if (selected.TOTALPERIODVAT != null)
                $("#txtTOTALPERIODVAT").val(selected.TOTALPERIODVAT.RoundToSt(2));
            else
                $("#txtTOTALPERIODVAT").val("0");
            $("#txtToDate").val(DateFormat(selected.TO_DATE.toString()));
            $("#txtFromDate").val(DateFormat(selected.FROM_DATE.toString()));
            if (selected.VOUCHER_CODE != null)
                $("#txtVOUCHER_CODE").val((selected.VOUCHER_CODE.toString()));
            else
                $("#txtVOUCHER_CODE").val("0");
            //CalculateTotalVat();
            // CalculateRequiredVat();
            if (selected.STATUS == 0)
                rd_Open.checked = true;
            else if (selected.STATUS == 1)
                rd_close.checked = true;
            else if (selected.STATUS == 2)
                rd_delivered.checked = true;
            else {
                rd_close.checked = false;
                rd_Open.checked = false;
                rd_delivered.checked = false;
            }
            AdjustButtons();
        }
        else {
            Clear();
        }
    }
    function btnClose_onclick() {
        if (!SysSession.CurrentPrivileges.CUSTOM1)
            return;
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AVATPERIOD", "ChangeStatus"),
            data: {
                UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token, COMP_CODE: Number(SysSession.CurrentEnvironment.CompCode),
                VAT_YEAR: vatyear, VatPeriod: Number(drpVatPeriod.value), status: 1
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    Display();
                }
            }
        });
    }
    function btnReopen_onclick() {
        if (!SysSession.CurrentPrivileges.CUSTOM2)
            return;
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AVATPERIOD", "ChangeStatus"),
            data: {
                UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token, COMP_CODE: Number(SysSession.CurrentEnvironment.CompCode),
                VAT_YEAR: vatyear, VatPeriod: Number(drpVatPeriod.value), status: 0
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    Display();
                    //Load_VatPeriodDetails();
                }
            }
        });
    }
    function btnDeliveringReport_onclick() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AVATPERIOD", "DeliveringReport_VatPeriod"),
            data: {
                UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token, COMP_CODE: Number(SysSession.CurrentEnvironment.CompCode),
                VAT_YEAR: vatyear, VatPeriod: Number(drpVatPeriod.value)
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    Display();
                }
            }
        });
    }
    function txtVAT_PREVBALANCE_onchange() {
        debugger;
        CalculateRequiredVat();
    }
    function txtCORRECTIONS_onchange() {
        CalculateRequiredVat();
    }
    //****الضريبة المستحقة
    function CalculateRequiredVat() {
        // $("#txtTOTALPERIODVAT").val(Number(txtNETVAT_AMOUNT.value) + Number(txtCORRECTIONS.value) - Number(txtVAT_PREVBALANCE.value)).toString();
        $("#txtNETVAT_AMOUNT").val((Number($("#txtTOTALPERIODVAT").val()) + Number(txtCORRECTIONS.value) - Number(txtVAT_PREVBALANCE.value)).RoundToSt(2));
    }
    //***صافي الضريبة
    //ضريبة المبيعات - ضريبة المشتريات
    function CalculateTotalVat() {
        //$("#txtNETVAT_AMOUNT").val(Number(LbSlsVat.innerHTML) - Number(LbPurVat.innerHTML));
        $("#txtTOTALPERIODVAT").val((Number(LbSlsVat.innerHTML) - Number(LbPurVat.innerHTML)).RoundToSt(2));
    }
    function btnEdit_onclick() {
        $("#btn_Save").removeClass("display_none");
        $("#btn_Back").removeClass("display_none");
        $("#btnEdit").addClass("display_none");
        $("#btnClose").addClass("display_none");
        $("#btnLoad").removeClass("display_none");
        $("#btnprint").addClass("display_none");
        txtCORRECTIONS.disabled = false;
        txtVAT_PREVBALANCE.disabled = false;
    }
    function btnSave_onclick() {
        loading('btnsave');
        setTimeout(function () {
            finishSave('btnsave');
            var selected = VatPeriod.filter(function (x) { return x.PERIOD_CODE == Number(drpVatPeriod.value); })[0];
            selected.CORRECTIONS = Number(txtCORRECTIONS.value);
            selected.VAT_PREVBALANCE = Number(txtVAT_PREVBALANCE.value);
            selected.TOTALPERIODVAT = Number($("#txtTOTALPERIODVAT").val());
            selected.NETVAT_AMOUNT = Number($("#txtNETVAT_AMOUNT").val());
            selected.UserCode = SysSession.CurrentEnvironment.UserCode;
            selected.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
            Ajax.Callsync({
                type: "post",
                url: sys.apiUrl("AVATPERIOD", "Update"),
                data: JSON.stringify(selected),
                success: function (d) {
                    var result = d;
                    if (result.IsSuccess) {
                        Display();
                    }
                }
            });
        }, 100);
    }
    function AdjustButtons() {
        if (rd_Open.checked) {
            $("#btnEdit").removeClass("display_none");
            $("#btn_Save").addClass("display_none");
            $("#btn_Back").addClass("display_none");
            $("#btnClose").removeClass("display_none");
            $("#btnLoad").addClass("display_none");
            $("#btnReopen").addClass("display_none");
            $("#btnDeliveringReport").addClass("display_none");
            $("#btnprint").removeClass("display_none");
        }
        else if (rd_close.checked) {
            $("#btnReopen").removeClass("display_none");
            $("#btnDeliveringReport").removeClass("display_none");
            $("#btnprint").removeClass("display_none");
            $("#btnEdit").addClass("display_none");
            $("#btn_Save").addClass("display_none");
            $("#btnClose").addClass("display_none");
            $("#btnLoad").addClass("display_none");
            $("#btn_Back").addClass("display_none");
        }
        else if (rd_delivered.checked) {
            $("#btnEdit").addClass("display_none");
            $("#btn_Save").addClass("display_none");
            $("#btnClose").addClass("display_none");
            $("#btnLoad").addClass("display_none");
            $("#btnReopen").addClass("display_none");
            $("#btnDeliveringReport").addClass("display_none");
            $("#btn_Back").addClass("display_none");
            $("#btnprint").removeClass("display_none");
        }
    }
    function Display() {
        SelectedPeriodCode = drpVatPeriod.value;
        Load_VatPeriod();
        drpVatPeriod.value = SelectedPeriodCode;
        drpVatPeriod_onchange();
        txtCORRECTIONS.disabled = true;
        txtVAT_PREVBALANCE.disabled = true;
        //CalculateTotalVat();
    }
    function btnBack_onclick() {
        Display();
    }
    function Clear() {
        SelectedPeriodCode = drpVatPeriod.value;
        $("#txtToDate").val("");
        $("#txtFromDate").val("");
        $("#txtVOUCHER_CODE").val("0");
        $("#txtNETVAT_AMOUNT").val("0");
        $("#txtCORRECTIONS").val("0");
        $("#txtVAT_PREVBALANCE").val("0");
        $("#txtTOTALPERIODVAT").val("0");
        rd_Open.checked = true;
        VatPeriodDetail = new Array();
        SalesGrid.DataSource = VatPeriodDetail;
        SalesGrid.Bind();
        PurGrid.DataSource = VatPeriodDetail;
        PurGrid.Bind();
    }
    //*************************Print**************************//
    function PrintReport(OutType) {
        if (!SysSession.CurrentPrivileges.PrintOut)
            return;
        var rp = new ReportParameters();
        rp.RepType = OutType; //output report as View
        rp.vatyear = Number(vatyear);
        rp.prdcode = Number(drpVatPeriod.value);
        rp.Name_function = "IProc_Prnt_VATReport";
        localStorage.setItem("Report_Data", JSON.stringify(rp));
        PrintReportLog(SysSession.CurrentEnvironment.UserCode, SysSession.CurrentEnvironment.CompCode, SysSession.CurrentEnvironment.BranchCode, Modules.VatReport, SysSession.CurrentEnvironment.CurrentYear);
        localStorage.setItem("result", '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>');
        window.open(Url.Action("ReportsPopup", "Home"), "_blank");
    }
    VATReport.PrintReport = PrintReport;
})(VATReport || (VATReport = {}));
//# sourceMappingURL=VatReport.js.map