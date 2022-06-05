$(document).ready(function () {
    ////debugger;
    PurTrpaymemt.InitalizeComponent();
});
var PurTrpaymemt;
(function (PurTrpaymemt) {
    //system varables
    var SysSession = GetSystemSession(Modules.PurTrpaymemt);
    var compcode;
    var BranchCode; //SharedSession.CurrentEnvironment.BranchCode;
    var sys = new SystemTools();
    //    //Arrays
    var CashboxDetails = new Array();
    var SalesManDetails = new Array();
    var StateDetailsAr = new Array();
    var StateDetailsEn = new Array();
    var PurReceiveStatisticsDetails = new Array();
    var SearchDetails = new Array();
    var vendorDetails = new Array();
    var UpdatedModel = new Array();
    var FilteredModel = new Array();
    //    //DropDownlist
    var ddlCashBox;
    var ddlStateType;
    var ddlSalesman;
    var ddlVendor;
    //    // giedView
    var Grid = new JsGrid();
    //    //Textboxes
    var txtStartDate;
    var txtEndDate;
    var txtSearchBox1;
    var txtNetTot;
    var txtPaidAmountTot;
    var txtCashTot;
    //    //buttons 
    var btnExecute;
    var btnShow;
    //    //flags
    var NetTot = 0;
    var PaidAmountTot = 0;
    var CashTot = 0;
    function InitalizeComponent() {
        debugger;
        InitalizeControls();
        txtStartDate.value = DateStartMonth();
        txtEndDate.value = ConvertToDateDash(GetDate()) <= ConvertToDateDash(SysSession.CurrentEnvironment.EndDate) ? GetDate() : SysSession.CurrentEnvironment.EndDate;
        IntializeEvents();
        FillddlCashBox();
        FillddlStateType();
        FillddlSalesman();
        //        FillddlSeller();
        FillddlVendor();
        //        FillddlFamily();
        $('#ddlStateType').prop("value", "2");
        //        ShowFlag = true;
        //        StatusFlag = false;
        $("#btnExecute").attr("disabled", "disabled");
        txtNetTot.value = NetTot.toString();
        txtPaidAmountTot.value = PaidAmountTot.toString();
        txtCashTot.value = CashTot.toString();
        InitializeGrid();
        btnExecute.disabled = true;
    }
    PurTrpaymemt.InitalizeComponent = InitalizeComponent;
    function IntializeEvents() {
        //        btnUpdate.onclick = btnUpdate_onclick;
        btnShow.onclick = btnShow_onclick;
        btnExecute.onclick = btnExecute_onclick;
        txtSearchBox1.onkeyup = SearchBox_Change;
        ddlStateType.onchange = ddlStateType_onchange;
    }
    function InitalizeControls() {
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);
        //        vatType = SysSession.CurrentEnvironment.I_Control[0].DefSlsVatType;
        //        //Drop Downlists
        ddlCashBox = document.getElementById("ddlCashBox");
        ddlStateType = document.getElementById("ddlStateType");
        ddlSalesman = document.getElementById("ddlSalesman");
        //        ddlSeller = document.getElementById("ddlSeller") as HTMLSelectElement;
        ddlVendor = document.getElementById("ddlVendor");
        //        //textboxes
        txtStartDate = document.getElementById("txtStartDate");
        txtEndDate = document.getElementById("txtEndDate");
        txtSearchBox1 = document.getElementById("txtSearchBox1");
        //        //textbox Totals
        txtNetTot = document.getElementById("txtNetTot");
        txtPaidAmountTot = document.getElementById("txtPaidAmountTot");
        txtCashTot = document.getElementById("txtCashTot");
        //        //buttons
        btnExecute = document.getElementById("btnExecute");
        btnShow = document.getElementById("btnShow");
        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = " سداد المشتريات النقدية";
        }
        else {
            document.getElementById('Screen_name').innerHTML = "Pay off cash purchases";
        }
    }
    function InitializeGrid() {
        //debugger;
        var res = GetResourceList("");
        $("#id_divGridDetails").attr("style", "");
        Grid.ElementName = "divGridDetails";
        Grid.Paging = true;
        Grid.PageSize = 10;
        Grid.Sorting = true;
        // Grid.InsertionMode = JsGridInsertionMode.Binding;
        Grid.Editing = false;
        Grid.Inserting = false;
        //   Grid.OnRowDoubleClicked = Grid_RowDoubleClicked;
        Grid.SelectedIndex = 1;
        //Grid.OnItemEditing = () => { };
        Grid.PrimaryKey = "InvoiceID";
        Grid.Columns = [
            { title: "ID", name: "ReceiveID", type: "text", width: "", visible: false },
            { title: res.App_InvoiceNum, name: "TrNo", type: "text", width: "7%" },
            { title: res.I_Vendor, name: "Vnd_NameA", type: "text", width: "17%" },
            { title: res.App_Salesman, name: "Slsm_DescA", type: "text", width: "16%" },
            { title: res.Men_StkDefItems, name: "Line_Count", type: "text", width: "7%" },
            { title: res.App_PackageCount, name: "Tot_Qty", type: "text", width: "10%" },
            { title: res.I_Total, name: "Tot_Amount", type: "text", width: "13%" },
            { title: res.App_Tax, name: "VatAmount", type: "text", width: "7%" },
            {
                title: res.App_TobePaid, name: "RemainAmount", type: "text", width: "13%", css: "classfont"
            },
            {
                title: res.App_TobePaid, css: "ColumPadding", name: "CashPaidAmount", width: "10%",
                itemTemplate: function (s, item) {
                    var txt = CreateElement("number", "form-control", " ", " ", "", " ");
                    txt.id = "txtcash";
                    //txt.name = SlsInvoiceListModel.indexOf(item).toString();
                    //SlsInvoiceListModel = Grid.DataSource;
                    txt.style.height = "25px";
                    txt.style.width = "70px";
                    txt.onchange = function (e) {
                        item.CashPaidAmount = Number(txt.value);
                        CashTot = 0;
                        for (var i = 0; i < PurReceiveStatisticsDetails.length; i++) {
                            CashTot += PurReceiveStatisticsDetails[i].CashPaidAmount;
                        }
                        txtCashTot.value = CashTot.RoundToSt(2).toString();
                    };
                    //    txt.disabled = StatusFlag;
                    if (item.CashPaidAmount != null) {
                        txt.value = item.CashPaidAmount.toString();
                    }
                    if (ddlStateType.value != "null") {
                        var status = Number(ddlStateType.value.toString());
                        if (status == 0) {
                            txt.disabled = false;
                        }
                        else if (status == 2 || status == 1) {
                            txt.disabled = true;
                        }
                    }
                    return txt;
                }
            }
        ];
        //BindGridData();
        BindStatisticGridData();
    }
    function Check_on_user_type() {
        if (SysSession.CurrentEnvironment.UserType == 1 || SysSession.CurrentEnvironment.UserType == 3) { //Salesman
            var SalesId_1 = SysSession.CurrentEnvironment.SalesManID;
            SalesManDetails = SalesManDetails.filter(function (s) { return s.SalesmanId == SalesId_1; });
        }
        else if (SysSession.CurrentEnvironment.UserType == 2) { //CashBox
        }
    }
    function BindStatisticGridData() {
        var startdt = DateFormatRep(txtStartDate.value).toString();
        var Enddt = DateFormatRep(txtEndDate.value).toString();
        var cashboxId = 0;
        var salesmanId = 0;
        var vendorid = 0;
        var status = 0;
        if (ddlCashBox.value != "null") {
            cashboxId = Number(ddlCashBox.value.toString());
        }
        if (ddlSalesman.value != "null") {
            salesmanId = Number(ddlSalesman.value.toString());
        }
        if (ddlVendor.value != "null") {
            vendorid = Number(ddlVendor.value.toString());
        }
        status = Number(ddlStateType.value.toString());
        if (status == 1 || status == 2) //مسدد
         {
            if (ddlCashBox.value == "null") {
                cashboxId = 0;
            }
            else if (ddlCashBox.value != "null") {
                cashboxId = Number(ddlCashBox.value);
            }
        }
        else if (status == 0) //غير مسدد
         {
            cashboxId = 0;
        }
        //////////
        NetTot = 0;
        // CommisionTot = 0;
        PaidAmountTot = 0;
        CashTot = 0;
        //  VatTot = 0;
        //debugger;
        //int CompCode, string stDate, BranchCode string EndDate, int Status, int? CashBoxid, int? SalesmanId,int? Vendorid,string UserCode, string Token)
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("PurTrReceive", "GetAllCashPurRecieveStatistic"),
            data: { CompCode: compcode, BranchCode: BranchCode, stDate: startdt, EndDate: Enddt, Status: status, CashBoxid: cashboxId, SalesmanId: salesmanId, Vendorid: vendorid, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    //debugger;
                    PurReceiveStatisticsDetails = result.Response;
                    /////////////////
                    //debugger;
                    for (var i = 0; i < PurReceiveStatisticsDetails.length; i++) {
                        if (PurReceiveStatisticsDetails[i].Total != null && PurReceiveStatisticsDetails[i].Total != 0)
                            NetTot += PurReceiveStatisticsDetails[i].Total;
                        if (PurReceiveStatisticsDetails[i].RemainAmount != null && PurReceiveStatisticsDetails[i].RemainAmount != 0)
                            PaidAmountTot += PurReceiveStatisticsDetails[i].RemainAmount;
                        if (PurReceiveStatisticsDetails[i].CashPaidAmount != null && PurReceiveStatisticsDetails[i].CashPaidAmount != 0)
                            CashTot += PurReceiveStatisticsDetails[i].CashPaidAmount;
                    }
                    txtNetTot.value = NetTot.RoundToSt(2).toString();
                    txtPaidAmountTot.value = PaidAmountTot.RoundToSt(2).toString();
                    txtCashTot.value = CashTot.RoundToSt(2).toString();
                }
            }
        });
        Grid.DataSource = PurReceiveStatisticsDetails;
        Grid.Bind();
    }
    function Validation() {
        var res = true;
        if (ddlCashBox.value == "null" && ddlStateType.value == "0") {
            DisplayMassage('(يجب اختيار الصندوق الذي سوف يتم السداد علية)', '(The CashBox to be paid must be selected )', MessageType.Error);
            $("#divGridWithDetail").add("display_none");
            $("#btnExecute").attr("disabled", "disabled");
            $("#divGridDetails").add("disabledDiv"); //divGridDetailsTot
            $("#divGridDetailsTot").add("disabledDiv"); //
            $("#divGrid").addClass("display_none");
            $("#divGridDetailsTot").addClass("display_none");
            res = false;
        }
        return res;
    }
    function FillddlCashBox() {
        var CashBoxID = 0;
        if (SysSession.CurrentEnvironment.UserType == 2 || SysSession.CurrentEnvironment.UserType == 3) {
            CashBoxID = SysSession.CurrentEnvironment.CashBoxID == null ? 0 : SysSession.CurrentEnvironment.CashBoxID;
        }
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefBox", "GetById"),
            data: { compCode: compcode, BranchCode: BranchCode, CashBoxID: CashBoxID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    CashboxDetails = result.Response;
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                        DocumentActions.FillCombowithdefult(CashboxDetails, ddlCashBox, "CashBoxID", "CashBox_DescE", "Select CashBox");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(CashboxDetails, ddlCashBox, "CashBoxID", "CashBox_DescA", "اختر الصندوق");
                    }
                    SysSession.CurrentEnvironment.UserType == 2 || SysSession.CurrentEnvironment.UserType == 3 ? ($('#ddlCashBox option[value="null"]').remove()) : $('#ddlCashBox').prop('selectedIndex', 0);
                }
            }
        });
    }
    function FillddlStateType() {
        StateDetailsAr = [" غير مسدد", "مسدد", "الجميع"];
        StateDetailsEn = ["Not Paid", "Paid", "All"];
        if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
            for (var i = 0; i < StateDetailsEn.length; i++) {
                var newoption = document.createElement("option");
                newoption.value = i.toString();
                newoption.text = StateDetailsEn[i];
                ddlStateType.options.add(newoption);
            }
        }
        else {
            for (var i = 0; i < StateDetailsAr.length; i++) {
                var newoption = document.createElement("option");
                newoption.value = i.toString();
                newoption.text = StateDetailsAr[i];
                ddlStateType.options.add(newoption);
            }
        }
    }
    function FillddlSalesman() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefSalesMen", "GetAllPurchasePeople"),
            data: { CompCode: compcode, BranchCode: BranchCode, IsPurchaseEnable: true, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    SalesManDetails = result.Response;
                    Check_on_user_type();
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                        DocumentActions.FillCombowithdefult(SalesManDetails, ddlSalesman, "SalesmanId", "NameE", "Select Seller");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(SalesManDetails, ddlSalesman, "SalesmanId", "NameA", "اختر المندوب");
                    }
                    SysSession.CurrentEnvironment.UserType == 1 || SysSession.CurrentEnvironment.UserType == 3 ? ($('#ddlSalesman option[value="null"]').remove()) : $('#ddlSalesman').prop('selectedIndex', 0);
                }
            }
        });
    }
    function FillddlVendor() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefVendor", "GetAll"),
            data: {
                CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    vendorDetails = result.Response;
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
                        DocumentActions.FillCombowithdefult(vendorDetails, ddlVendor, "VendorID", "NAMEL", "Select Vendor");
                    }
                    else {
                        DocumentActions.FillCombowithdefult(vendorDetails, ddlVendor, "VendorID", "NAMEA", "اختر المورد");
                    }
                }
            }
        });
    }
    function btnShow_onclick() {
        if (ddlStateType.selectedIndex == 0) {
            btnExecute.disabled = false;
        }
        if (Validation() == false)
            return;
        //ShowFlag = true;
        //StatusFlag = true;
        BindStatisticGridData();
        $("#divGrid").removeClass("display_none");
        // $("#divGridWithDetail").removeClass("display_none");
        $("#btnExecute").removeAttr("disabled");
        $("#divGridDetails").removeClass("disabledDiv");
        $("#divGridDetailsTot").removeClass("disabledDiv");
        $("#divGridDetailsTot").removeClass("display_none");
        // $("#divGridDetails").attr("disabled", "disabled").off('click');
        //ShowFlag = false;
        //if (ddlStateType.value == "1" || ddlStateType.value == "2") {
        //    $("#btnUpdate").attr("disabled", "disabled");
        //} else {
        //    $("#btnUpdate").removeAttr("disabled");
        //}
        ddlStateType_onchange();
    }
    function btnExecute_onclick() {
        debugger;
        loading('btnExecute');
        setTimeout(function () {
            finishSave('btnExecute');
            var ValidDataFlag = true;
            FilteredModel = Grid.DataSource;
            /////////
            for (var i = 0; i < FilteredModel.length; i++) {
                var cash = FilteredModel[i].CashPaidAmount;
                var Remain = FilteredModel[i].RemainAmount;
                if (cash != 0 && cash != null) {
                    if (Remain != cash) {
                        //  $("#btnExecute").attr("disabled", "disabled");
                        DisplayMassage('يجب ان يكون المبلغ المطلوب سداده مساوي للسداد  بالكارت للفاتورة رقم   ( ' + FilteredModel[i].TrNo + "  )", '(The amount to be paid must be equal to the total cash payment with the card payment for invoice number)' + FilteredModel[i].TrNo + "  )", MessageType.Error);
                        ValidDataFlag = false;
                        break;
                    }
                }
            }
            ////////////////
            if (ValidDataFlag == true) {
                ValidDataFlag = false;
                UpdatedModel = Grid.DataSource;
                UpdatedModel = UpdatedModel.filter(function (s) { return s.CashPaidAmount != 0 && s.CashPaidAmount != null; });
                for (var i = 0; i < UpdatedModel.length; i++) {
                    UpdatedModel[i].UpdatedAt = DateTimeFormat(Date().toString());
                    UpdatedModel[i].UpdatedBy = SysSession.CurrentEnvironment.UserCode;
                    UpdatedModel[i].CashBoxID = Number(ddlCashBox.value);
                }
                if (UpdatedModel.length > 0) {
                    Ajax.Callsync({
                        type: "POST",
                        url: sys.apiUrl("PurTrReceive", "UpdateReceiveCashList"),
                        data: JSON.stringify(UpdatedModel),
                        success: function (d) {
                            var result = d;
                            if (result.IsSuccess == true) {
                                // $("#divGridWithDetail").addClass("display_none");
                                DisplayMassage('(تم التنفيذ بنجاح )', '(Successfully executed)', MessageType.Succeed);
                                BindStatisticGridData();
                            }
                            else {
                                DisplayMassage('( هناك خطأ )', '(Error)', MessageType.Error);
                            }
                        }
                    });
                }
                else {
                    DisplayMassage('( لا توجد فواتير مسدده كي يتم التنفيذ )', '(There are no invoices paid to be executed)', MessageType.Error);
                }
            }
        }, 100);
    }
    function GetDate() {
        var today = new Date();
        var dd = today.getDate().toString();
        var ReturnedDate;
        var mm = (today.getMonth() + 1).toString();
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
    function SearchBox_Change() {
        if (txtSearchBox1.value != "") {
            var search_1 = txtSearchBox1.value.toLowerCase();
            SearchDetails = PurReceiveStatisticsDetails.filter(function (x) { return x.TrNo.toString().toLowerCase().search(search_1) >= 0 || x.Vnd_NameA.toLowerCase().search(search_1) >= 0 || x.Vnd_NameE.toLowerCase().search(search_1) >= 0 || x.Slsm_DescA.toString().toLowerCase().search(search_1) >= 0 || x.Slsm_DescE.toString().toLowerCase().search(search_1) >= 0; }
            /*  || x.CustomerCODE.toString().search(search) >= 0  || x.CreditLimit.toString().search(search) >= 0 || x.Emp_NameA.toString().search(search) >= 0
              || x.ContactMobile.toString().search(search) >= 0 /*|| x.DueAmount.toString().search(search) >= 0 */ /*|| x.DaysDiff.toString().search(search) >= 0*/ );
            NetTot = 0;
            PaidAmountTot = 0;
            CashTot = 0;
            for (var i = 0; i < SearchDetails.length; i++) {
                NetTot += SearchDetails[i].Total;
                PaidAmountTot += SearchDetails[i].RemainAmount;
                CashTot += SearchDetails[i].CashPaidAmount;
            }
            txtNetTot.value = NetTot.RoundToSt(2).toString();
            txtPaidAmountTot.value = PaidAmountTot.RoundToSt(2).toString();
            txtCashTot.value = CashTot.RoundToSt(2).toString();
            Grid.DataSource = SearchDetails;
            Grid.Bind();
            PurReceiveStatisticsDetails = SearchDetails;
        }
        else {
            BindStatisticGridData();
            NetTot = 0;
            PaidAmountTot = 0;
            CashTot = 0;
            for (var i = 0; i < PurReceiveStatisticsDetails.length; i++) {
                NetTot += PurReceiveStatisticsDetails[i].Total;
                PaidAmountTot += PurReceiveStatisticsDetails[i].RemainAmount;
                CashTot += PurReceiveStatisticsDetails[i].CashPaidAmount;
            }
            txtNetTot.value = NetTot.RoundToSt(2).toString();
            txtPaidAmountTot.value = PaidAmountTot.RoundToSt(2).toString();
            txtCashTot.value = CashTot.RoundToSt(2).toString();
            Grid.DataSource = PurReceiveStatisticsDetails;
            Grid.Bind();
        }
    }
    function ddlStateType_onchange() {
        var status = Number(ddlStateType.value);
        if (status == 1 || status == 2) {
            $("#btnExecute").attr("disabled", "disabled");
        }
        else {
            //$("#btnExecute").removeAttr("disabled");
        }
    }
})(PurTrpaymemt || (PurTrpaymemt = {}));
//# sourceMappingURL=PurTrpaymemt.js.map