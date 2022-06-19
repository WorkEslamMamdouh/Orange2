$(document).ready(function () {
    Dashboard.InitalizeComponent();
});
var Dashboard;
(function (Dashboard) {
    //system varables
    var SysSession = GetSystemSession(Modules.Dashboard);
    var compcode;
    var BranchCode;
    var sys = new SystemTools();
    // giedView
    var Grid = new JsGrid();
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);
    // Arrays 
    //var Selected_Data: Array<FQ_GetDisposalHeader> = new Array<FQ_GetDisposalHeader>();
    //var SearchDetails: Array<FQ_GetDisposalHeader> = new Array<FQ_GetDisposalHeader>();
    //var Disposallist: Array<FQ_GetDisposalHeader> = new Array<FQ_GetDisposalHeader>();
    //var DisposalDetail: Array<FQ_GetDisposalDetail> = new Array<FQ_GetDisposalDetail>();
    //var ServicesDetails: Array<AQVAT_GetService> = new Array<AQVAT_GetService>();
    //var GlobInvoiceModel: AQ_ServSlsInvoiceMasterDetails = new AQ_ServSlsInvoiceMasterDetails();
    //var DetailsAssetList: Array<F_Asset> = new Array<F_Asset>();
    //var All_Asset: Array<F_Asset> = new Array<F_Asset>();
    //var DisposalDetailModel: Array<F_Tr_DisposalDetail> = new Array<F_Tr_DisposalDetail>();
    ////Models
    //var DisposalDetailSingleModel: F_Tr_DisposalDetail = new F_Tr_DisposalDetail;
    //var DisposalHeaderModel: F_Tr_DisposalHeader = new F_Tr_DisposalHeader;
    //var CustDetails: IQ_GetCustomerBalance = new IQ_GetCustomerBalance;
    //var _DisposalMasterDetail: DisposalMasterDetail = new DisposalMasterDetail();
    //ddl  
    //TextBoxes 
    var ddlType;
    var txt_Remarks;
    var txtStartDate;
    var txtEndDate;
    var txtCustomerCode;
    var txtCustomerName;
    var NameCustomer;
    var searchbutmemreport;
    //checkbox  
    var chkCertified;
    //buttons   
    var btnInvoiceSearch;
    var btnAddDetails;
    var btnCustomerSrchFltr;
    var btnCustomerSrch;
    var btnAdd;
    var btnShow;
    var btnUpdate;
    var btnBack; // btnBack btnSave
    var btnSave;
    //print buttons     
    var btnPrintTrview;
    var btnPrintTrPDF;
    var btnPrintTrEXEL;
    var btnPrintTransaction;
    //global    
    var Finyear;
    var GlobalinvoiceID = 0;
    var DisposalId = 0;
    var CustomerId = 0;
    var HCustomerId = 0;
    var CountGrid = 0;
    var BookValue = 0;
    var glopalAssetID = 0;
    //flags :  
    var NewAdd = false;
    function InitalizeComponent() {
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);
        Finyear = Number(SysSession.CurrentEnvironment.CurrentYear);
        InitalizeControls();
        InitializeEvents();
        $("#dataTable_1").html('');
        for (var i = 0; i < 10; i++) {
            InitializeGrid(i);
            DisplayGrid(i);
        }
    }
    Dashboard.InitalizeComponent = InitalizeComponent;
    function InitalizeControls() {
    }
    function InitializeEvents() {
    }
    function GetDashboard() {
    }
    function InitializeGrid(cnt) {
        var html;
        html = ' <tr  id="Grid1_' + cnt + '" >' +
            '<input id = "txt_StatusFlag' + cnt + '" name = " " type = "hidden" class="form-control" /> ' +
            '<input id = "OpeningDetailID' + cnt + '" name = " " type = "hidden" class="form-control" /> ' +
            '<td id="titel' + cnt + '" > ' +
            'العنوان' +
            '</td>' +
            '<td  > ' +
            '10000' +
            '</td>' +
            '<td   > ' +
            '10000' +
            '</td>' +
            '<td   > ' +
            '10000' +
            '</td>' +
            '<td  > ' +
            '10000' +
            '</td>' +
            '<td  > ' +
            '10000' +
            '</td>' +
            '<td  > ' +
            '10000' +
            '</td>' +
            '<td  > ' +
            '10000' +
            '</td>' +
            '<td  > ' +
            '10000' +
            '</td>' +
            '<td  > ' +
            '10000' +
            '</td>' +
            '<td  > ' +
            '10000' +
            '</td>' +
            '<td  > ' +
            '10000' +
            '</td>' +
            '<td  > ' +
            '10000' +
            '</td>' +
            '<td  > ' +
            '10000' +
            '</td>' +
            '</tr>';
        $("#dataTable_1").append(html);
    }
    function DisplayGrid(i) {
        $('#titel' + i).html('Eslam' + i);
        $('#titel' + i).addClass('th_Style');
    }
})(Dashboard || (Dashboard = {}));
//# sourceMappingURL=Dashboard.js.map