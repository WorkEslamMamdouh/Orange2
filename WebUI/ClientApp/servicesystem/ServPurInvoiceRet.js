$(document).ready(function () {
    ServPurInvoiceRet.InitializeComponent();
});
var ServPurInvoiceRet;
(function (ServPurInvoiceRet) {
    //************system variables
    var SysSession = GetSystemSession(Modules.Ser_Return_Pur);
    var sys = new SystemTools();
    var VatPrc;
    //***********controls
    var btnAdd;
    var btnShow;
    var btnSave;
    var btnAddDetails;
    var btnAddChildControls;
    var btnInvSearch;
    var drpSrchStatus;
    var drpVendor;
    var drpSrchVendor;
    var chk_ImportInvoice;
    var drpSrchType;
    var drpTrType;
    var MasterGrid = new JsGrid();
    var chkClosed;
    var btnUpdate;
    var btnBack;
    var chkImportInvoice;
    var txtStartDate;
    var txtEndDate;
    var txtTR_DATE;
    var txtCreatedBy;
    var txtCreatedAt;
    var txtUpdatedBy;
    var txtUpdatedAt;
    var txtTR_NO;
    var hd_InvoiceHeaderID;
    var hd_InvoiceId;
    var txtPurHd_DocNo;
    var searchbutmemreport;
    //print buttons
    var btnPrintTrview;
    var btnPrintTrPDF;
    var btnPrintTrEXEL;
    var btnPrintReceive;
    // var btnPrint: HTMLButtonElement;
    //***********Arrays
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);
    var List_Status = new Array();
    var List_StatusEn = new Array();
    var List_Type = new Array(2);
    var AccountDetails = new A_ACCOUNT();
    var Details = new Array();
    var Vendors = new Array();
    var Model = new AVAT_TR_PurInvoiceRet();
    var PurInvoice = new AVAT_TR_PurInvoice();
    var ServPurInvoiceMasterDetail = new AQ_ServPurInvoiceMasterDetail();
    var ModelDetail = new Array();
    var MasterDetail = new PurInvoiceRetMasterDetails();
    var MasterDetail_Q_purInvoiceRet = new AQPurInvoiceRetMasterDetails();
    var CountGrid_det = 0;
    var hd_InvoiceRetID;
    var selecteditem = new AQVAT_GetPurReturn();
    var Discount_InvoiceHeader;
    var Total_InvoiceHeader;
    var SearchDetails = new Array();
    var CompCode = Number(SysSession.CurrentEnvironment.CompCode);
    //*************************Initialization************************//
    function InitializeComponent() {
        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = "مرتجع المشتريات";
            List_Type = [{ id: 1, value: 'نقدى' }, { id: 0, value: 'على الحساب' }];
        }
        else {
            document.getElementById('Screen_name').innerHTML = "Purchase Returns Invoice";
            List_Type = [{ id: 1, value: 'monetary' }, { id: 0, value: 'On the Account' }];
        }
        InitializeControls();
        InitializeEvents();
        InitializeGrid();
        FillStatus();
        FillVendors();
        FillTypes();
        txtStartDate.value = DateStartMonth();
        txtEndDate.value = ConvertToDateDash(GetDate()) <= ConvertToDateDash(SysSession.CurrentEnvironment.EndDate) ? GetDate() : SysSession.CurrentEnvironment.EndDate;
        txtTR_DATE.value = txtEndDate.value;
        Button_privialges();
        btnShow_onclick();
    }
    ServPurInvoiceRet.InitializeComponent = InitializeComponent;
    function InitializeControls() {
        drpSrchStatus = document.getElementById("drpSrchStatus");
        drpVendor = document.getElementById("drpVendor");
        drpSrchVendor = document.getElementById("drpSrchVendor");
        drpSrchType = document.getElementById("drpSrchType");
        drpTrType = document.getElementById("drpTrType");
        btnAdd = document.getElementById("btnAdd");
        btnShow = document.getElementById("btnShow");
        btnSave = document.getElementById("btnSave");
        btnInvSearch = document.getElementById("btnInvSearch");
        btnAddDetails = document.getElementById("btnAddDetails");
        btnAddChildControls = document.getElementById("btnAddChildControls");
        chk_ImportInvoice = document.getElementById("chk_ImportInvoice");
        hd_InvoiceId = document.getElementById("hd_InvoiceId");
        chkImportInvoice = document.getElementById("chkImportInvoice");
        txtStartDate = document.getElementById("txtStartDate");
        txtEndDate = document.getElementById("txtEndDate");
        txtTR_DATE = document.getElementById("txtTR_DATE");
        txtCreatedBy = document.getElementById("txtCreatedBy");
        txtCreatedAt = document.getElementById("txtCreatedAt");
        txtUpdatedBy = document.getElementById("txtUpdatedBy");
        txtUpdatedAt = document.getElementById("txtUpdatedAt");
        txtTR_NO = document.getElementById("txtTR_NO");
        txtPurHd_DocNo = document.getElementById("txtPurHd_DocNo");
        hd_InvoiceHeaderID = document.getElementById("hd_InvoiceHeaderID");
        chkClosed = document.getElementById("chkClosed");
        btnUpdate = document.getElementById("btnUpdate");
        btnBack = document.getElementById("btnBack");
        searchbutmemreport = document.getElementById("searchbutmemreport");
        //print 
        btnPrintTrview = document.getElementById("btnPrintTrview");
        btnPrintTrPDF = document.getElementById("btnPrintTrPDF");
        btnPrintTrEXEL = document.getElementById("btnPrintTrEXEL");
        btnPrintReceive = document.getElementById("btnPrintReceive");
        // btnPrint = document.getElementById("btnPrint") as HTMLInputElement;
    }
    function InitializeEvents() {
        btnShow.onclick = btnShow_onclick;
        btnAdd.onclick = btnadd_onclick;
        btnSave.onclick = btnSave_onclick;
        btnInvSearch.onclick = btnInvSearch_onclick;
        btnUpdate.onclick = btnUpdate_onclick;
        btnBack.onclick = btnBack_onclick;
        chkClosed.onchange = chkClosed_onchecked;
        txtPurHd_DocNo.onchange = txtPurHd_DocNo_onchange;
        btnPrintTrview.onclick = function () { PrintReport(1); };
        btnPrintTrPDF.onclick = function () { PrintReport(2); };
        btnPrintTrEXEL.onclick = function () { PrintReport(3); };
        // btnPrint.onclick = () => { PrintReport(4); }
        searchbutmemreport.onkeyup = _SearchBox_Change;
        btnPrintReceive.onclick = btnPrintReceive_onclick;
    }
    function InitializeGrid() {
        $("#divMasterGridiv").removeClass("display_none");
        var res = GetResourceList("");
        MasterGrid.ElementName = "divMasterGrid";
        MasterGrid.Paging = true;
        MasterGrid.PageSize = 10;
        MasterGrid.Sorting = true;
        MasterGrid.InsertionMode = JsGridInsertionMode.Binding;
        MasterGrid.Editing = false;
        MasterGrid.Inserting = false;
        MasterGrid.SelectedIndex = 1;
        MasterGrid.OnRowDoubleClicked = MasterGridDouble_Click;
        MasterGrid.OnItemEditing = function () { };
        MasterGrid.PrimaryKey = "InvoiceRetID";
        MasterGrid.Columns = [
            { title: "Id", name: "InvoiceRetID", type: "number", width: "05%", css: "display_none" },
            { title: res.Trns_TrNO, name: "TR_NO", type: "number", width: "10%" },
            { title: res.App_date, name: "TR_DATE", type: "text", width: "12%" },
            { title: res.I_Vendor, name: "vnd_NameA", type: "text", width: "30%" },
            { title: res.I_Total, name: "TOTAL", type: "text", width: "30%" },
            { title: res.App_Tax, name: "Vat", type: "text", width: "20%" },
            { title: res.App_Net, name: "NetATax", type: "text", width: "30%" },
            { title: res.App_State, name: "Closed_txt", type: "text", width: "20%" },
        ];
        MasterGrid.Bind();
    }
    function BuildControls_Details(cnt) {
        var html;
        html = "<tr id=\"No_Row2" + cnt + "\">\n                    <input id=\"txtInvoiceRetDetailid" + cnt + "\" type=\"hidden\" class=\"form-control display_none\"  />\n                    <input id=\"txtInvoiceRetID" + cnt + "\" type=\"hidden\" class=\"form-control display_none\"  />   \n                    <input id=\"txtInvoiceDetailID" + cnt + "\" type=\"hidden\" class=\"form-control display_none\"  />   \n                    <input id=\"txtItemid" + cnt + "\" type=\"hidden\" class=\"form-control display_none\"  />   \n                    <input id=\"txtUomID" + cnt + "\" type=\"hidden\" class=\"form-control display_none\"  />   \n                    <td>\n\t\t                <div class=\"form-group\">\n\t\t\t                <span id=\"btn_minus2" + cnt + "\"><i class=\"fas fa-minus-circle  btn-minus\"></i></span>\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n\t\t\t              <input id=\"txtTR_SERIAL" + cnt + "\" type=\"text\" class=\"form-control\" disabled value=\"" + cnt + "\"/>\n\t\t                </div>\n\t                </td>\n\t                <td>\n\t\t                <div class=\"form-group\">\n\t\t\t              \t<input id=\"txtItemCode" + cnt + "\" name=\"\" disabled type=\"text\" class=\"form-control\"/>\n\t\t                </div>\n\t                </td>\n\t                <td>\n\t\t                <div class=\"form-group\">\n\t\t\t              <input id=\"txtitm_DescA" + cnt + "\" name=\"\" disabled type=\"text\" class=\"form-control\"/>\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n\t\t\t               <input id=\"txtQTY_SOLD" + cnt + "\" type=\"text\" class=\"form-control\" disabled value=\"0\"/>\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-check\">\n                            <input id=\"txtQTY_RET" + cnt + "\" type=\"text\" class=\"form-control\"  value=\"0\"/>\n                        </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n\t\t\t               <input id=\"txtUnitprice" + cnt + "\" type=\"text\"   class=\"form-control\" disabled value=\"0\"/>\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n\t\t\t              <input id=\"txtItemTotal" + cnt + "\" type=\"text\"   class=\"form-control\" disabled value=\"0\"/>\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n\t\t\t               <input id=\"txtVatPrc" + cnt + "\" type=\"text\" disabled class=\"form-control\"   value=\"0\"/>\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n\t\t\t                <input id=\"txtVatAmount" + cnt + "\" type=\"text\" disabled value=\"0\" class=\"form-control\"/>\n\t\t                </div>\n\t                </td>\n\t                <td>\n\t\t                <div class=\"form-group\">\n\t\t\t                <input id=\"txtNet" + cnt + "\" type=\"text\" disabled class=\"form-control\"   value=\"0\"/>\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n\t\t\t                <input id=\"txtCCcode" + cnt + "\" name=\"\" disabled type=\"text\" class=\"form-control\"/>\n\t\t                </div>\n\t                </td>\n                    <td>\n\t\t                <div class=\"form-group\">\n\t\t\t                <input id=\"txtCC_DESCA" + cnt + "\" name=\"\" disabled type=\"text\" class=\"form-control\"/>\n\t                    </div>\n                    </td>\n                    <input id=\"txt_StatusFlag2" + cnt + "\" name = \" \" type = \"hidden\" class=\"form-control\"/>\n                    <input id=\"txtVatNatID" + cnt + "\" name = \" \" type = \"hidden\" class=\"form-control\"/>\n                     <input id=\"txtDiscountPrc" + cnt + "\" name = \" \" type = \"hidden\" class=\"form-control\"/>\n                     <input id=\"txtDiscountAmount" + cnt + "\" name = \" \" type = \"hidden\" class=\"form-control\"/>\n                     <input id=\"txtNetUnitPrice" + cnt + "\" name = \" \" type = \"hidden\" class=\"form-control\"/>\n                     <input id=\"txtREMARK" + cnt + "\" name = \" \" type = \"hidden\" class=\"form-control\"/>\n                    <input id=\"txtACTUAL_DATE" + cnt + "\" name = \" \" type = \"hidden\" class=\"form-control\"/>\n                    <input id=\"txtVatApplied" + cnt + "\" name = \" \" type = \"hidden\" class=\"form-control\"/>\n                </tr>";
        //html = '<div id= "No_Row2' + cnt + '" class="container-fluid style_border" > <div class="row" > <div class="col-lg-12 col-md-12 col-sm-12 col-xl-12 col-xs-12 " > ' +
        //    '<span id="btn_minus2' + cnt + '" class="fa fa-minus-circle fontitm4PurTrReceive display_none"></span>' +
        //    '<div class="col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-1 p-0">' +
        //    '<input id="txtInvoiceRetDetailid' + cnt + '" type="hidden" class="form-control input-sm right2 display_none " value="0" />' +
        //    '<input id="txtInvoiceRetID' + cnt + '" type="hidden" class="form-control input-sm right2 display_none"/>' +
        //    '<input id="txtInvoiceDetailID' + cnt + '" type="hidden" class="form-control input-sm right2 display_none"/>' +
        //    '<input id="txtItemid' + cnt + '" type="hidden" class="form-control input-sm right2 display_none"/>' +
        //    '<input id="txtUomID' + cnt + '" type="hidden" class="form-control input-sm right2 display_none"/>' +
        //    '<input id="txtTR_SERIAL' + cnt + '" type="text" class="form-control input-sm right2" disabled value="' + cnt + '"/></div>' +
        //    '<div class="col-lg-3 col-md-3 col-sm-3 col-xl-3 col-xs-3 p-0">' +
        //    '<input id="txtItemCode' + cnt + '" name="" disabled type="text" class="col-lg-3 col-md-3 col-sm-3 col-xl-3 col-xs-3 form-control input-sm  text_Display  "/>' +
        //    '<input id="txtitm_DescA' + cnt + '" name="" disabled type="text" class="form-control col-lg-9 col-md-9 col-sm-9 col-xl-9 col-xs-9 input-sm  text_Display"/>' +
        //    '</div>' +
        //    '<div class="col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-1 p-0">' +
        //    '<input id="txtQTY_SOLD' + cnt + '" type="text" class="form-control input-sm right2" disabled value="0"/></div>' +
        //    '<div class="col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-1 p-0">' +
        //    '<input id="txtQTY_RET' + cnt + '" type="text" class="form-control input-sm right2 ReturnQtyCss"  value="0"/></div>' +
        //    '<div class="col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-1 p-0">' +
        //    '<input id="txtUnitprice' + cnt + '" type="text"   class="form-control input-sm right2" disabled value="0"/></div>' +
        //    '<div class="col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-1 p-0">' +
        //    '<input id="txtItemTotal' + cnt + '" type="text"   class="form-control input-sm right2" disabled value="0"/></div>' +
        //    '<div class="col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-1 p-0">' +
        //    '<input id="txtVatPrc' + cnt + '" type="text" disabled class="form-control input-sm right2"   value="0"/></div>' +
        //    '<div class="col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-1 p-0">' +
        //    '<input id="txtVatAmount' + cnt + '" type="text" disabled value="0" class="form-control input-sm right2"/></div>' +
        //    '<div class="col-lg-1 col-md-1 col-sm-1 col-xl-1 col-xs-1 p-0">' +
        //    '<input id="txtNet' + cnt + '" type="text" disabled class="form-control input-sm right2"   value="0"/></div>' +
        //    "<div class='col-lg-4 col-md-4 col-sm-4 col-xl-4 col-xs-4 positionSer_Return_Pur' style=''>" +
        //    '<input id="txtCCcode' + cnt + '" name="" disabled type="text" class="col-lg-5 col-md-5 col-sm-5 col-xl-5 col-xs-5 form-control input-sm  text_Display  "/>' +
        //    '<input id="txtCC_DESCA' + cnt + '" name="" disabled type="text" class="form-control input-sm col-lg-5 col-md-5 col-sm-5 col-xl-5 col-xs-5  text_Display"/>' +
        //    "</div>" +
        //    '</div>' +
        //    ' </div></div>' +
        //    '<input id="txt_StatusFlag2' + cnt + '" name = " " type = "hidden" class="form-control input-sm"/>' +
        //    '<input id="txtVatNatID' + cnt + '" name = " " type = "hidden" class="form-control input-sm"/>' +
        //    '<input id="txtDiscountPrc' + cnt + '" name = " " type = "hidden" class="form-control input-sm"/>' +
        //    '<input id="txtDiscountAmount' + cnt + '" name = " " type = "hidden" class="form-control input-sm"/>' +
        //    '<input id="txtNetUnitPrice' + cnt + '" name = " " type = "hidden" class="form-control input-sm"/>' +
        //    '<input id="txtREMARK' + cnt + '" name = " " type = "hidden" class="form-control input-sm"/>' +
        //    '<input id="txtACTUAL_DATE' + cnt + '" name = " " type = "hidden" class="form-control input-sm"/>' +
        //    '<input id="txtVatApplied' + cnt + '" name = " " type = "hidden" class="form-control input-sm"/>';
        $("#div_Data").append(html);
        $("#txtQTY_RET" + cnt).on('change', function () {
            //***Validaion
            if (Number($("#txtQTY_RET" + cnt).val()) > Number($("#txtQTY_SOLD" + cnt).val())) {
                DisplayMassage("لا يمكن ان تكون الكمية المرتجعة اكبر من الكمية المباعة", "Returned Quantity is more than Sold Quantity", MessageType.Error);
                $("#txtQTY_RET" + cnt).val("0");
                return;
            }
            //***اجمالى details
            var QTY_RET = Number($("#txtQTY_RET" + cnt).val());
            var Unitprice = Number($("#txtUnitprice" + cnt).val());
            var ItemTotal = QTY_RET * Unitprice;
            $("#txtItemTotal" + cnt).val(ItemTotal.RoundToSt(2));
            //***
            VatPrc = Number($("#txtVatPrc" + cnt).val());
            var vatAmount = Number(ItemTotal) * VatPrc / 100;
            $("#txtVatAmount" + cnt).val(vatAmount.RoundToSt(2));
            //***
            var Net = ItemTotal + vatAmount;
            $("#txtNet" + cnt).val(Net.RoundToSt(2));
            //***
            var total_InvRet = 0;
            var Vat_InvRet = 0;
            for (var i = 0; i < CountGrid_det; i++) {
                total_InvRet = total_InvRet + Number($("#txtItemTotal" + i).val());
                Vat_InvRet = Vat_InvRet + Number($("#txtVatAmount" + i).val());
            }
            $("#txtInvTotal").val(total_InvRet);
            $("#txtVat").val(Vat_InvRet);
            //***
            var Discount_InvRet = total_InvRet / Total_InvoiceHeader * Discount_InvoiceHeader;
            $("#txtDISCOUNT").val(Discount_InvRet.RoundToSt(2));
            //***
            var Net_InvRet = total_InvRet + Vat_InvRet - Discount_InvRet;
            $("#txtNet").val(Net_InvRet);
        });
        return;
    }
    //*****************************Fill Dropdown*********************//
    function FillStatus() {
        List_Status = ["جديد", " مغلق", "الجميع"];
        List_StatusEn = [" New", " Authorized", "All"];
        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            for (var i = 0; i < List_Status.length; i++) {
                var newoption = document.createElement("option");
                newoption.value = i.toString();
                newoption.text = List_Status[i];
                drpSrchStatus.options.add(newoption);
            }
        }
        else {
            for (var i = 0; i < List_StatusEn.length; i++) {
                var newoption = document.createElement("option");
                newoption.value = i.toString();
                newoption.text = List_StatusEn[i];
                drpSrchStatus.options.add(newoption);
            }
        }
        drpSrchStatus.value = "2";
    }
    function FillTypes() {
        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            DocumentActions.FillComboFirstvalue(List_Type, drpSrchType, "id", "value", "- اختر -", null);
            DocumentActions.FillComboFirstvalue(List_Type, drpTrType, "id", "value", "- اختر -", null);
        }
        else {
            DocumentActions.FillComboFirstvalue(List_Type, drpSrchType, "id", "value", "- Select -", null);
            DocumentActions.FillComboFirstvalue(List_Type, drpTrType, "id", "value", "- Select -", null);
        }
    }
    function FillVendors() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDefVendor", "GetAll"),
            data: {
                UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token,
                CompCode: SysSession.CurrentEnvironment.CompCode
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    Vendors = result.Response;
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
                        DocumentActions.FillComboFirstvalue(Vendors, drpVendor, "VendorID", "NAMEA", "- اختر -", null);
                        DocumentActions.FillComboFirstvalue(Vendors, drpSrchVendor, "VendorID", "NAMEA", "- اختر -", null);
                    }
                    else {
                        DocumentActions.FillComboFirstvalue(Vendors, drpVendor, "VendorID", "NAMEA", "- Select -", null);
                        DocumentActions.FillComboFirstvalue(Vendors, drpSrchVendor, "VendorID", "NAMEA", "- Select -", null);
                    }
                }
            }
        });
    }
    //****************************Main buttons*********************//
    function btnadd_onclick() {
        if (!SysSession.CurrentPrivileges.AddNew)
            return;
        clear();
        EnableControls();
        chkClosed.disabled = false;
        $("#DivFilter").addClass("disabledDiv");
        $("#divMasterGridiv").addClass("disabledDiv");
        hd_InvoiceRetID = 0;
        $('#btnPrintReceive').addClass('display_none');
    }
    function btnSave_onclick() {
        loading('btnsave');
        setTimeout(function () {
            finishSave('btnsave');
            if (!CheckDate(DateFormat(txtTR_DATE.value).toString(), DateFormat(SysSession.CurrentEnvironment.StartDate).toString(), DateFormat(SysSession.CurrentEnvironment.EndDate).toString())) {
                WorningMessage('  التاريخ ليس متطابق مع تاريخ السنه (' + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ')', '  The date is not identical with the date of the year (' + DateFormat(SysSession.CurrentEnvironment.StartDate).toString() + ')', "تحذير", "worning");
                Errorinput(txtTR_DATE);
                return;
            }
            if (!Validation())
                return;
            if (hd_InvoiceRetID == 0)
                Insert();
            else
                Update();
            $('#btnPrintReceive').removeClass('display_none');
        }, 100);
    }
    function btnUpdate_onclick() {
        if (!SysSession.CurrentPrivileges.EDIT)
            return;
        EnableControls();
        $(".ReturnQtyCss").prop("disabled", false);
        chkClosed.disabled = false;
        $('#btnPrintReceive').addClass('display_none');
    }
    function btnBack_onclick() {
        if (hd_InvoiceRetID != 0) {
            clear();
            Display();
            QueryMode();
        }
        else {
            clear();
            btnShow_onclick();
            $("#btnSave").addClass("display_none");
            $("#btnBack").addClass("display_none");
        }
    }
    function MasterGridDouble_Click() {
        selecteditem = MasterGrid.SelectedItem;
        Display();
        $('#btnPrintReceive').removeClass('display_none');
    }
    //***************************Save Data**************************//
    function Assign() {
        DocumentActions.AssignToModel(Model);
        Model.TR_NO = Number(txtTR_NO.value);
        Model.TR_DATE = txtTR_DATE.value;
        Model.VendorID = Number(drpVendor.value);
        Model.InvoiceHeaderID = Number(hd_InvoiceHeaderID.value);
        Model.InvoiceId = Number(hd_InvoiceId.value);
        Model.UserCode = SysSession.CurrentEnvironment.UserCode;
        Model.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
        Model.CompCode = Number(SysSession.CurrentEnvironment.CompCode);
        Model.BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);
        Model.VatType = SysSession.CurrentEnvironment.I_Control[0].DefPurVatType;
        Model.TR_TYPE = Number(drpTrType.value);
        Model.CLOSED = chkClosed.checked;
        Model.VndVatType = Vendors.filter(function (x) { return x.VendorID == Model.VendorID; })[0].VATType;
        Model.ImportInvoice = chkImportInvoice.checked;
        Model.TOTAL = Number($("#txtInvTotal").val());
        //from InvoiceHeader in insert mode
        if (hd_InvoiceRetID == 0) {
            Model.VENDOR_NAME = ServPurInvoiceMasterDetail.AQVAT_GetPurInvoiceHeader[0].VENDOR_NAME;
            Model.PAID = ServPurInvoiceMasterDetail.AQVAT_GetPurInvoiceHeader[0].PAID;
            Model.SalesType = ServPurInvoiceMasterDetail.AQVAT_GetPurInvoiceHeader[0].SalesType;
            Model.PAY_ACC_CODE = ServPurInvoiceMasterDetail.AQVAT_GetPurInvoiceHeader[0].PAY_ACC_CODE;
        }
        MasterDetail.Branch_Code = SysSession.CurrentEnvironment.BranchCode;
        MasterDetail.Comp_Code = SysSession.CurrentEnvironment.CompCode;
        MasterDetail.MODULE_CODE = Modules.Ser_Return_Pur;
        MasterDetail.UserCode = SysSession.CurrentEnvironment.UserCode;
        MasterDetail.sec_FinYear = SysSession.CurrentEnvironment.CurrentYear;
    }
    function AssignDetails() {
        ModelDetail = new Array();
        var RetDetail = new AVAT_TR_PurInvoiceRetDetail();
        for (var i = 0; i < CountGrid_det; i++) {
            RetDetail = new AVAT_TR_PurInvoiceRetDetail();
            RetDetail.InvoiceRetDetailid = $("#txtInvoiceRetDetailid" + i).val();
            RetDetail.InvoiceRetID = $("#txtInvoiceRetID" + i).val();
            RetDetail.InvoiceDetailID = $("#txtInvoiceDetailID" + i).val();
            RetDetail.TR_SERIAL = $("#txtTR_SERIAL" + i).val();
            RetDetail.Itemid = $("#txtItemid" + i).val();
            RetDetail.UomID = $("#txtUomID" + i).val();
            RetDetail.QTY_SOLD = $("#txtQTY_SOLD" + i).val();
            RetDetail.QTY_RET = $("#txtQTY_RET" + i).val();
            RetDetail.Unitprice = $("#txtUnitprice" + i).val();
            RetDetail.ItemTotal = $("#txtItemTotal" + i).val();
            RetDetail.VatPrc = $("#txtVatPrc" + i).val();
            RetDetail.VatAmount = $("#txtVatAmount" + i).val();
            RetDetail.CC_CODE = $("#txtCCcode" + i).val();
            RetDetail.CCDT_CODE = $("#txtCCDT_CODE" + i).val();
            RetDetail.VatNatID = $("#txtVatNatID" + i).val();
            //*********************????
            RetDetail.DiscountPrc = $("#txtDiscountPrc" + i).val();
            RetDetail.DiscountAmount = $("#txtDiscountAmount" + i).val();
            RetDetail.NetUnitPrice = $("#txtNetUnitPrice" + i).val();
            RetDetail.REMARK = $("#txtREMARK" + i).val();
            RetDetail.ACTUAL_DATE = $("#txtACTUAL_DATE" + i).val();
            RetDetail.VatApplied = $("#txtVatApplied" + i).val();
            //**********************
            RetDetail.CompCode = Number(SysSession.CurrentEnvironment.CompCode);
            RetDetail.BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);
            ModelDetail.push(RetDetail);
        }
    }
    function Insert() {
        Assign();
        AssignDetails();
        Model.InvoiceRetID = 0;
        Model.TR_NO = 0;
        Model.CreatedAt = DateTimeFormat(Date().toString());
        Model.CreatedBy = SysSession.CurrentEnvironment.UserCode;
        Model.JOURNAL_NO = null;
        Model.POSTED = false;
        Model.PrntNo = "0";
        MasterDetail.AVAT_TR_PurInvoiceRet = Model;
        MasterDetail.AVAT_TR_PurInvoiceRetDetail = ModelDetail;
        Ajax.Callsync({
            type: "post",
            url: sys.apiUrl("AVATPurInvoiceRet", "InsertAllData"),
            data: JSON.stringify(MasterDetail),
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    MasterDetail = result.Response;
                    hd_InvoiceRetID = MasterDetail.AVAT_TR_PurInvoiceRet.InvoiceRetID;
                    DisplayMassage("تم الحفظ", "Saved Succesfully", MessageType.Succeed);
                    btnShow_onclick();
                    QueryMode();
                    DisplayProcessedRecord();
                    Save_Succ_But();
                }
            }
        });
    }
    function Update() {
        Assign();
        AssignDetails();
        Model.InvoiceRetID = Number(hd_InvoiceRetID);
        Model.UpdatedAt = DateTimeFormat(Date().toString());
        Model.UpdatedBy = SysSession.CurrentEnvironment.UserCode;
        MasterDetail.AVAT_TR_PurInvoiceRet = Model;
        MasterDetail.AVAT_TR_PurInvoiceRetDetail = ModelDetail;
        Ajax.Callsync({
            type: "post",
            url: sys.apiUrl("AVATPurInvoiceRet", "UpdateAllData"),
            data: JSON.stringify(MasterDetail),
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    MasterDetail = result.Response;
                    DisplayMassage("تم الحفظ", "Saved Succesfully", MessageType.Succeed);
                    btnShow_onclick();
                    QueryMode();
                    DisplayProcessedRecord();
                    Save_Succ_But();
                }
            }
        });
    }
    //************************Display Data*************************//
    function GetAccByCode(AccCode) {
        var flag = true;
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GLDefAccount", "GetActivAccByCode"),
            data: { CompCode: CompCode, AccCode: AccCode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    AccountDetails = result.Response;
                }
            }
        });
        return flag;
    }
    function Display() {
        DocumentActions.RenderFromModel(selecteditem);
        drpVendor.value = selecteditem.VendorID.toString();
        drpTrType.value = selecteditem.TR_TYPE.toString();
        chkClosed.checked = selecteditem.CLOSED;
        chkImportInvoice.checked = selecteditem.ImportInvoice;
        DisplayInvoiceRetDetails(selecteditem.InvoiceRetID);
        hd_InvoiceRetID = Number(MasterGrid.SelectedKey);
        hd_InvoiceHeaderID.value = selecteditem.InvoiceHeaderID.toString();
        hd_InvoiceId.value = selecteditem.InvoiceId.toString();
        txtTR_NO.value = selecteditem.TR_NO.toString();
        txtTR_DATE.value = DateFormat(selecteditem.TR_DATE);
        $('#txtVoucherNo').val(selecteditem.JOURNAL_NO);
        debugger;
        if (selecteditem.PAY_ACC_CODE != null && selecteditem.PAY_ACC_CODE.trim() != '') {
            AccountDetails = new A_ACCOUNT;
            GetAccByCode(selecteditem.PAY_ACC_CODE);
            $('#txtPAY_ACC_Name').val((lang == "ar" ? AccountDetails.ACC_DESCA : AccountDetails.ACC_DESCL));
        }
        else {
            $('#txtPAY_ACC_Name').val('');
        }
        $("#txtInvTotal").val(selecteditem.TOTAL);
        QueryMode();
        checkprivialges();
        if (selecteditem.CLOSED == true) {
            chkClosed.checked = true;
            chkprivialgesToEditApprovedInvoice();
        }
        else {
            chkClosed.checked = false;
            btnUpdate.disabled = !SysSession.CurrentPrivileges.EDIT;
            chkClosed.disabled = true;
        }
        Model = selecteditem;
    }
    function DisplayInvoiceRetDetails(InvoiceRetID) {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AVATPurInvoiceRet", "GetPurInvoiceRetDetails"),
            data: {
                UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token, InvoiceRetID: InvoiceRetID
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    MasterDetail_Q_purInvoiceRet = result.Response;
                    //*****
                    $("#div_Data").html("");
                    for (var i = 0; i < MasterDetail_Q_purInvoiceRet.AQVAT_GetPurReturnDetail.length; i++) {
                        BuildControls_Details(i);
                        $("#txtInvoiceRetDetailid" + i).val(MasterDetail_Q_purInvoiceRet.AQVAT_GetPurReturnDetail[i].InvoiceRetDetailid);
                        $("#txtInvoiceRetID" + i).val(MasterDetail_Q_purInvoiceRet.AQVAT_GetPurReturnDetail[i].InvoiceRetID);
                        $("#txtInvoiceDetailID" + i).val(MasterDetail_Q_purInvoiceRet.AQVAT_GetPurReturnDetail[i].InvoiceDetailID);
                        $("#txtTR_SERIAL" + i).val(MasterDetail_Q_purInvoiceRet.AQVAT_GetPurReturnDetail[i].TR_SERIAL);
                        $("#txtItemid" + i).val(MasterDetail_Q_purInvoiceRet.AQVAT_GetPurReturnDetail[i].Itemid);
                        $("#txtUomID" + i).val(MasterDetail_Q_purInvoiceRet.AQVAT_GetPurReturnDetail[i].UomID);
                        $("#txtQTY_SOLD" + i).val(MasterDetail_Q_purInvoiceRet.AQVAT_GetPurReturnDetail[i].QTY_SOLD);
                        $("#txtQTY_RET" + i).val(MasterDetail_Q_purInvoiceRet.AQVAT_GetPurReturnDetail[i].QTY_RET);
                        $("#txtUnitprice" + i).val(MasterDetail_Q_purInvoiceRet.AQVAT_GetPurReturnDetail[i].Unitprice);
                        $("#txtDiscountPrc" + i).val(MasterDetail_Q_purInvoiceRet.AQVAT_GetPurReturnDetail[i].DiscountPrc);
                        $("#txtDiscountAmount" + i).val(MasterDetail_Q_purInvoiceRet.AQVAT_GetPurReturnDetail[i].DiscountAmount);
                        $("#txtNetUnitPrice" + i).val(MasterDetail_Q_purInvoiceRet.AQVAT_GetPurReturnDetail[i].NetUnitPrice);
                        $("#txtItemTotal" + i).val(MasterDetail_Q_purInvoiceRet.AQVAT_GetPurReturnDetail[i].ItemTotal);
                        $("#txtREMARK" + i).val(MasterDetail_Q_purInvoiceRet.AQVAT_GetPurReturnDetail[i].REMARK);
                        $("#txtACTUAL_DATE" + i).val(MasterDetail_Q_purInvoiceRet.AQVAT_GetPurReturnDetail[i].ACTUAL_DATE);
                        $("#txtVatApplied" + i).val(MasterDetail_Q_purInvoiceRet.AQVAT_GetPurReturnDetail[i].VatApplied);
                        $("#txtVatPrc" + i).val(MasterDetail_Q_purInvoiceRet.AQVAT_GetPurReturnDetail[i].VatPrc);
                        $("#txtVatAmount" + i).val(MasterDetail_Q_purInvoiceRet.AQVAT_GetPurReturnDetail[i].VatAmount);
                        $("#txtCCcode" + i).val(MasterDetail_Q_purInvoiceRet.AQVAT_GetPurReturnDetail[i].CC_CODE);
                        $("#txtCCDT_CODE" + i).val(MasterDetail_Q_purInvoiceRet.AQVAT_GetPurReturnDetail[i].CCDT_CODE);
                        $("#txtItemCode" + i).val(MasterDetail_Q_purInvoiceRet.AQVAT_GetPurReturnDetail[i].ItemCode);
                        $("#txtitm_DescA" + i).val(MasterDetail_Q_purInvoiceRet.AQVAT_GetPurReturnDetail[i].itm_DescA);
                        $("#txtCC_DESCA" + i).val(MasterDetail_Q_purInvoiceRet.AQVAT_GetPurReturnDetail[i].CC_DESCA);
                        $("#txtVatNatID" + i).val(MasterDetail_Q_purInvoiceRet.AQVAT_GetPurReturnDetail[i].VatNatID);
                        $("#txtNet" + i).val(MasterDetail_Q_purInvoiceRet.AQVAT_GetPurReturnDetail[i].ItemTotal + MasterDetail_Q_purInvoiceRet.AQVAT_GetPurReturnDetail[i].VatAmount);
                    }
                    CountGrid_det = MasterDetail_Q_purInvoiceRet.AQVAT_GetPurReturnDetail.length;
                }
            }
        });
    }
    function DisplayInvoiceData(InvoiceID) {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("ServPurInvoice", "GetById"),
            data: {
                UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token, id: InvoiceID
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    PurInvoice = result.Response;
                    $("#txtPur_Tr_No").val(PurInvoice.TR_NO);
                    hd_InvoiceId.value = PurInvoice.InvoiceId.toString();
                }
            }
        });
    }
    function DisplayInvoiceDetails(ServPurInvoiceMasterDetail) {
        hd_InvoiceHeaderID.value = ServPurInvoiceMasterDetail.AQVAT_GetPurInvoiceHeader[0].InvoiceHeaderID.toString();
        $("#txtPurHd_DocNo").val(ServPurInvoiceMasterDetail.AQVAT_GetPurInvoiceHeader[0].DocNo);
        drpVendor.value = ServPurInvoiceMasterDetail.AQVAT_GetPurInvoiceHeader[0].VendorID.toString();
        $("#txtPAY_ACC_CODE").val(ServPurInvoiceMasterDetail.AQVAT_GetPurInvoiceHeader[0].PAY_ACC_CODE.toString());
        $("#txtPAY_ACC_Name").val(ServPurInvoiceMasterDetail.AQVAT_GetPurInvoiceHeader[0].ACC_DESCA.toString());
        drpVendor.value = ServPurInvoiceMasterDetail.AQVAT_GetPurInvoiceHeader[0].VendorID.toString();
        Discount_InvoiceHeader = ServPurInvoiceMasterDetail.AQVAT_GetPurInvoiceHeader[0].DISCOUNT;
        Total_InvoiceHeader = ServPurInvoiceMasterDetail.AQVAT_GetPurInvoiceHeader[0].TOTAL;
        //*****
        $("#div_Data").html("");
        CountGrid_det = 0;
        for (var i = 0; i < ServPurInvoiceMasterDetail.AQVAT_GetPurInvoiceDetail.length; i++) {
            BuildControls_Details(i);
            $("#txtInvoiceRetDetailid" + i).val("0");
            $("#txtInvoiceRetID" + i).val("0");
            $("#txtInvoiceDetailID" + i).val(ServPurInvoiceMasterDetail.AQVAT_GetPurInvoiceDetail[i].InvoiceDetailID);
            $("#txtTR_SERIAL" + i).val(ServPurInvoiceMasterDetail.AQVAT_GetPurInvoiceDetail[i].TR_SERIAL);
            $("#txtItemid" + i).val(ServPurInvoiceMasterDetail.AQVAT_GetPurInvoiceDetail[i].ItemID);
            $("#txtUomID" + i).val(ServPurInvoiceMasterDetail.AQVAT_GetPurInvoiceDetail[i].UomID);
            //***الكمية المتبقية =الكمية المباعة - الكمية المرتجعة
            var Qty = ServPurInvoiceMasterDetail.AQVAT_GetPurInvoiceDetail[i].SoldQty - ServPurInvoiceMasterDetail.AQVAT_GetPurInvoiceDetail[i].QTY_RET;
            $("#txtQTY_SOLD" + i).val(Qty);
            $("#txtQTY_RET" + i).val("0");
            $("#txtUnitprice" + i).val(ServPurInvoiceMasterDetail.AQVAT_GetPurInvoiceDetail[i].Unitprice);
            $("#txtDiscountPrc" + i).val(ServPurInvoiceMasterDetail.AQVAT_GetPurInvoiceDetail[i].DiscountPrc);
            $("#txtDiscountAmount" + i).val(ServPurInvoiceMasterDetail.AQVAT_GetPurInvoiceDetail[i].DiscountAmount);
            //***unit price= net unit price
            $("#txtNetUnitPrice" + i).val(ServPurInvoiceMasterDetail.AQVAT_GetPurInvoiceDetail[i].Unitprice);
            $("#txtItemTotal" + i).val("0");
            $("#txtREMARK" + i).val(ServPurInvoiceMasterDetail.AQVAT_GetPurInvoiceDetail[i].REMARK);
            $("#txtACTUAL_DATE" + i).val(ServPurInvoiceMasterDetail.AQVAT_GetPurInvoiceDetail[i].ACTUAL_DATE);
            $("#txtVatApplied" + i).val(ServPurInvoiceMasterDetail.AQVAT_GetPurInvoiceDetail[i].VatApplied);
            $("#txtVatPrc" + i).val(ServPurInvoiceMasterDetail.AQVAT_GetPurInvoiceDetail[i].VatPrc);
            // $("#txtVatAmount" + i).val(ServPurInvoiceMasterDetail.AQVAT_GetPurInvoiceDetail[i].VatAmount);
            $("#txtVatAmount" + i).val("0");
            $("#txtCCcode" + i).val(ServPurInvoiceMasterDetail.AQVAT_GetPurInvoiceDetail[i].CC_CODE);
            $("#txtCCDT_CODE" + i).val(ServPurInvoiceMasterDetail.AQVAT_GetPurInvoiceDetail[i].CCDT_CODE);
            $("#txtItemCode" + i).val(ServPurInvoiceMasterDetail.AQVAT_GetPurInvoiceDetail[i].ItemCode);
            $("#txtitm_DescA" + i).val(ServPurInvoiceMasterDetail.AQVAT_GetPurInvoiceDetail[i].itm_DescA);
            $("#txtCC_DESCA" + i).val(ServPurInvoiceMasterDetail.AQVAT_GetPurInvoiceDetail[i].CC_DESCA);
            $("#txtVatNatID" + i).val(ServPurInvoiceMasterDetail.AQVAT_GetPurInvoiceDetail[i].VatNatID);
        }
        CountGrid_det = ServPurInvoiceMasterDetail.AQVAT_GetPurInvoiceDetail.length;
        //*****
        DisplayInvoiceData(ServPurInvoiceMasterDetail.AQVAT_GetPurInvoiceHeader[0].InvoiceId);
    }
    function DisplayProcessedRecord() {
        ;
        MasterGrid.SelectedKey = MasterDetail.AVAT_TR_PurInvoiceRet.InvoiceRetID.toString();
        //MasterGrid.Bind();
        MasterGrid.SelectedItem = MasterDetail.AVAT_TR_PurInvoiceRet;
        MasterGridDouble_Click();
        $("#divDetails").removeClass("display_none");
        $('#btnPrintReceive').removeClass('display_none');
    }
    //**********************search *************************//
    function btnShow_onclick() {
        var startdate = DateFormatRep($('#txtStartDate').val());
        var Enddate = DateFormatRep($('#txtEndDate').val());
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AVATPurInvoiceRet", "Search"),
            data: {
                UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token, strtdt: startdate, Enddt: Enddate, compcode: SysSession.CurrentEnvironment.CompCode,
                closed: drpSrchStatus.value, Tr_type: drpSrchType.value, vendor: drpSrchVendor.value
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    Details = result.Response;
                    for (var i = 0; i < Details.length; i++) {
                        Details[i].TR_DATE = DateFormat(Details[i].TR_DATE);
                        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar")
                            if (Details[i].CLOSED)
                                Details[i].Closed_txt = "مغلق";
                            else
                                Details[i].Closed_txt = "جديد";
                        else if (Details[i].CLOSED)
                            Details[i].Closed_txt = "Closed";
                        else
                            Details[i].Closed_txt = "New";
                    }
                    MasterGrid.DataSource = Details;
                    MasterGrid.Bind();
                    $("#searchtext").removeClass("display_none");
                    $("#divDetails").addClass("display_none");
                    $("#divMasterGridiv").removeClass("display_none");
                    $("#divMasterGridiv").removeClass("disabledDiv");
                    $("#DivFilter").removeClass("disabledDiv");
                    $('#btnPrintReceive').addClass('display_none');
                    $('#btnUpdate').addClass('display_none');
                }
            }
        });
    }
    function btnInvSearch_onclick() {
        var sys = new SystemTools();
        var cond = " CompCode = " + SysSession.CurrentEnvironment.CompCode;
        if (drpVendor.value != "null" && drpVendor.value != "")
            cond = cond + " and VendorID=" + drpVendor.value;
        sys.FindKey(Modules.Ser_Return_Pur, "btnInvSearch", cond, function () {
            //***clear 
            drpVendor.value = "null";
            $("#txtInvTotal").val("0");
            $("#txtVat").val("0");
            $("#txtDISCOUNT").val("0");
            $("#txtNet").val("0");
            $("#div_Data").html("");
            CountGrid_det = 0;
            //***search
            var id = SearchGrid.SearchDataGrid.SelectedKey;
            CountGrid_det = 0;
            Ajax.Callsync({
                type: "Get",
                url: sys.apiUrl("ServPurInvoice", "GetPurInvoiceDetails"),
                data: {
                    UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token, InvoiceHeaderID: id
                },
                success: function (d) {
                    var result = d;
                    if (result.IsSuccess) {
                        ServPurInvoiceMasterDetail = result.Response;
                        DisplayInvoiceDetails(ServPurInvoiceMasterDetail);
                    }
                }
            });
        });
    }
    function txtPurHd_DocNo_onchange() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("ServPurInvoice", "GetPurInvoiceby_InvoiceDoc_NO"),
            data: {
                UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token,
                DocNo: txtPurHd_DocNo.value
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    var res = result.Response;
                    if (res.AQVAT_GetPurInvoiceHeader.length != 0) {
                        DisplayInvoiceDetails(res);
                    }
                    else {
                        clear();
                        $("#div_Data").html("");
                        CountGrid_det = 0;
                    }
                }
            }
        });
    }
    function _SearchBox_Change() {
        $("#divMasterGrid").jsGrid("option", "pageIndex", 1);
        if (searchbutmemreport.value != "") {
            var search_1 = searchbutmemreport.value.toLowerCase();
            if (SysSession.CurrentEnvironment.ScreenLanguage == "ar")
                SearchDetails = Details.filter(function (x) { return x.TR_NO.toString().search(search_1) >= 0 || x.vnd_NameA.toLowerCase().search(search_1) >= 0; });
            else
                SearchDetails = Details.filter(function (x) { return x.TR_NO.toString().search(search_1) >= 0 || x.vnd_NameE.toLowerCase().search(search_1) >= 0; });
            MasterGrid.DataSource = SearchDetails;
            MasterGrid.Bind();
        }
        else {
            MasterGrid.DataSource = Details;
            MasterGrid.Bind();
        }
    }
    //**************************** functions********************//
    function clear() {
        $("#div_Master :input").val("");
        $("#div_Data").html("");
        txtTR_DATE.value = GetDate();
        txtTR_DATE.disabled = true;
        txtCreatedBy.value = SysSession.CurrentEnvironment.UserCode;
        txtCreatedAt.value = DateTimeFormat(Date().toString());
        txtUpdatedAt.value = "";
        txtUpdatedBy.value = "";
        hd_InvoiceHeaderID.value = "0";
        hd_InvoiceId.value = "0";
        hd_InvoiceRetID = 0;
        chkClosed.checked = false;
        chkImportInvoice.checked = false;
        drpVendor.value = "null";
        drpTrType.value = "null";
    }
    function QueryMode() {
        $("#divDetails").removeClass("display_none");
        $("#divDetails :input").prop("disabled", true);
        $("#btnUpdate").removeClass("display_none");
        $("#btnSave").addClass("display_none");
        $("#btnBack").addClass("display_none");
        $(".ReturnQtyCss").prop("disabled", true);
        $('#btnPrintReceive').removeClass('display_none');
        chkClosed.disabled = true;
    }
    function EnableControls() {
        $("#divDetails").removeClass("display_none");
        $("#txtRef_No").prop("disabled", false);
        $("#drpTrType").prop("disabled", false);
        $("#txtPurHd_DocNo").prop("disabled", false);
        btnInvSearch.disabled = false;
        $("#txtRemark").prop("disabled", false);
        $("#btnSave").removeClass("display_none");
        $("#btnBack").removeClass("display_none");
        $("#btnUpdate").addClass("display_none");
        $("#chkImportInvoice").prop("disabled", false);
        drpVendor.disabled = false;
    }
    function openInvoice() {
        Assign();
        Model.InvoiceRetID = hd_InvoiceRetID;
        Model.UpdatedBy = SysSession.CurrentEnvironment.UserCode;
        Model.UpdatedAt = DateTimeFormat(Date().toString());
        Model.CLOSED = false;
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("AVATPurInvoiceRet", "OpenPurInvRet"),
            data: JSON.stringify(Model),
            success: function (d) {
                var result = d;
                if (result.IsSuccess == true) {
                    btnUpdate.disabled = false;
                    DisplayMassage(' تم فك الاعتماد بنجاح ', 'Deaccredited successfully', MessageType.Succeed);
                    selecteditem = result.Response;
                    //Model = res;
                    btnShow_onclick();
                    MasterGrid.SelectedKey = selecteditem.InvoiceRetID.toString();
                    MasterGrid.SelectedItem = selecteditem;
                    MasterGridDouble_Click();
                    $("#divDetails").removeClass("display_none");
                    $('#btnPrintReceive').removeClass('display_none');
                }
                else {
                    DisplayMassage("الرجاء تحديث الصفحة واعادت تكرارالمحاولة مره اخري ", "Please refresh the page and try again", MessageType.Error);
                }
            }
        });
    }
    function chkClosed_onchecked() {
        if (chkClosed.checked == false && Model.CLOSED == true) {
            openInvoice();
        }
    }
    //***********************Validation && privilege*********//
    function Validation() {
        //if ($("#txtRef_No").val()=="")
        //{
        //    DisplayMassage(" من فضلك ادخل رقم المرجع  ", "Enter Ref NO please", MessageType.Error);
        //    return false;
        //}
        if ($("#drpTrType").val() == "" || $("#drpTrType").val() == null || $("#drpTrType").val() == "null") {
            DisplayMassage(" من فضلك ادخل النوع  ", "Enter Type please", MessageType.Error);
            Errorinput($("#drpTrType"));
            return false;
        }
        if ($("#txtPurHd_DocNo").val() == "") {
            DisplayMassage(" من فضلك ادخل رقم فاتورة المورد  ", "Enter InvoiceNo please", MessageType.Error);
            Errorinput($("#txtPurHd_DocNo"));
            return false;
        }
        if ($("#drpVendor").val() == "") {
            DisplayMassage(" من فضلك ادخل المورد  ", "Enter Vendor please", MessageType.Error);
            Errorinput($("#drpVendor"));
            return false;
        }
        var check_Qty = 0;
        for (var i = 0; i < CountGrid_det; i++) {
            if ($("#txtQTY_RET" + i).val() == 0)
                check_Qty++;
        }
        if (check_Qty == CountGrid_det) {
            DisplayMassage(" من فضلك ادخل الكمية المرتجعة  ", "Enter Returned Quantity  please", MessageType.Error);
            Errorinput($("#txtQTY_RET"));
            return false;
        }
        return true;
    }
    function checkprivialges() {
        // لو ليه صلاحية الاعتماد او فك الاعتماد هيكون مفنوح
        if (SysSession.CurrentPrivileges.CUSTOM1 || SysSession.CurrentPrivileges.CUSTOM2) {
            chkClosed.disabled = false;
        }
        else {
            chkClosed.disabled = true;
        }
    }
    function chkprivialgesToEditApprovedInvoice() {
        if (SysSession.CurrentPrivileges.CUSTOM2 == false) {
            chkClosed.disabled = true;
            btnUpdate.disabled = true;
        }
        else {
            chkClosed.disabled = false;
            btnUpdate.disabled = true;
        }
    }
    function Button_privialges() {
        btnAdd.disabled = !SysSession.CurrentPrivileges.AddNew;
        btnUpdate.disabled = !SysSession.CurrentPrivileges.EDIT;
    }
    //*************************Print**************************//
    function PrintReport(OutType) {
        if (!SysSession.CurrentPrivileges.PrintOut)
            return;
        var rp = new ReportParameters();
        rp.RepType = OutType; //output report as View
        rp.FromDate = DateFormatRep(txtStartDate.value);
        rp.ToDate = DateFormatRep(txtEndDate.value);
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
        rp.Status = Number($("#drpSrchStatus").val());
        if (drpSrchVendor.selectedIndex > 0) {
            rp.VendorId = Number($("#drpSrchVendor").val());
        }
        else {
            rp.VendorId = -1;
        }
        if (drpSrchType.selectedIndex > 0) {
            rp.CashType = Number($("#drpSrchType").val());
        }
        else {
            rp.CashType = 2;
        }
        Ajax.Callsync({
            url: Url.Action("IProc_Rpt_VATPurReturnList", "GeneralReports"),
            data: rp,
            success: function (d) {
                var result = d.result;
                window.open(result, "_blank");
            }
        });
    }
    ServPurInvoiceRet.PrintReport = PrintReport;
    function btnPrintReceive_onclick() {
        if (!SysSession.CurrentPrivileges.PrintOut)
            return;
        var rp = new ReportParameters();
        rp.Type = 0;
        rp.Repdesign = 1;
        rp.TRId = hd_InvoiceRetID;
        rp.Name_function = "IProc_Prnt_VATPurReturn";
        localStorage.setItem("Report_Data", JSON.stringify(rp));
        localStorage.setItem("result", '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>');
        window.open(Url.Action("ReportsPopup", "Home"), "_blank");
    }
})(ServPurInvoiceRet || (ServPurInvoiceRet = {}));
//# sourceMappingURL=ServPurInvoiceRet.js.map