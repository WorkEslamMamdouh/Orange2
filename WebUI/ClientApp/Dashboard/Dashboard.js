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
    //var DisposalDetailModel: Array<F_Tr_DisposalDetail> = new Array<F_Tr_DisposalDetail>();
    ////Models
    //var DisposalDetailSingleModel: F_Tr_DisposalDetail = new F_Tr_DisposalDetail;
    //var DisposalHeaderModel: F_Tr_DisposalHeader = new F_Tr_DisposalHeader;
    //var CustDetails: IQ_GetCustomerBalance = new IQ_GetCustomerBalance;
    //var _DisposalMasterDetail: DisposalMasterDetail = new DisposalMasterDetail();
    var IprocDash = new Array();
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
        GetDashboard();
    }
    Dashboard.InitalizeComponent = InitalizeComponent;
    function InitalizeControls() {
    }
    function InitializeEvents() {
    }
    function GetDashboard() {
        var _Type = 0;
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("SystemTools", "GetDashboard"),
            data: { _Type: _Type, comp: compcode, bracode: BranchCode },
            success: function (d) {
                var result = d;
                IprocDash = result.Response;
                CountGrid = 0;
                $("#dataTable_1").html('');
                for (var i = 0; i < IprocDash.length; i++) {
                    InitializeGrid(i);
                    DisplayGrid(i, IprocDash[i], _Type);
                    CountGrid++;
                }
            }
        });
    }
    function InitializeGrid(cnt) {
        var html;
        html = ' <tr  id="Grid1_' + cnt + '" >' +
            '<input id = "txt_StatusFlag' + cnt + '" name = " " type = "hidden" class="form-control" /> ' +
            '<input id = "OpeningDetailID' + cnt + '" name = " " type = "hidden" class="form-control" /> ' +
            '<td id="titel' + cnt + '" > ' +
            'العنوان' +
            '</td>' +
            '<td  id="Val1' + cnt + '" > ' +
            '10000' +
            '</td>' +
            '<td  id="Val2' + cnt + '"  > ' +
            '10000' +
            '</td>' +
            '<td  id="Val3' + cnt + '"  > ' +
            '10000' +
            '</td>' +
            '<td id="Val4' + cnt + '"  > ' +
            '10000' +
            '</td>' +
            '<td id="Val5' + cnt + '"  > ' +
            '10000' +
            '</td>' +
            '<td id="Val6' + cnt + '" > ' +
            '10000' +
            '</td>' +
            '<td id="Val7' + cnt + '" > ' +
            '10000' +
            '</td>' +
            '<td id="Val8' + cnt + '" > ' +
            '10000' +
            '</td>' +
            '<td id="Val9' + cnt + '" > ' +
            '10000' +
            '</td>' +
            '<td id="Val10' + cnt + '" > ' +
            '10000' +
            '</td>' +
            '<td id="Val11' + cnt + '" > ' +
            '10000' +
            '</td>' +
            '<td id="Val12' + cnt + '" > ' +
            '10000' +
            '</td>' +
            '<td id="Total' + cnt + '" > ' +
            '10000' +
            '</td>' +
            '</tr>';
        $("#dataTable_1").append(html);
    }
    function DisplayGrid(i, _Data, _Type) {
        debugger;
        $('#titel' + i).addClass('th_Style');
        var titel = '';
        if (_Type == 0) { // عمليات
            titel = _Data.rowno == 1 ? 'عدد التريلات' : _Data.rowno == 2 ? 'مغلق' : _Data.rowno == 3 ? 'مفتوح' : _Data.rowno == 4 ? 'المبيعات' : _Data.rowno == 5 ? 'المشتريات' : _Data.rowno == 6 ? 'المصاريف' : _Data.rowno == 7 ? 'دعم المورد' : _Data.rowno == 8 ? '  التبريد' : _Data.rowno == 9 ? '  التسويق' : _Data.rowno == 10 ? '  الكمسيون' : '';
        }
        $('#titel' + i).html(titel);
        $('#Val1' + i).html(_Data.Val1.toString());
        $('#Val2' + i).html(_Data.Val2.toString());
        $('#Val3' + i).html(_Data.Val3.toString());
        $('#Val4' + i).html(_Data.Val4.toString());
        $('#Val5' + i).html(_Data.Val5.toString());
        $('#Val6' + i).html(_Data.Val6.toString());
        $('#Val7' + i).html(_Data.Val7.toString());
        $('#Val8' + i).html(_Data.Val8.toString());
        $('#Val9' + i).html(_Data.Val9.toString());
        $('#Val10' + i).html(_Data.Val10.toString());
        $('#Val11' + i).html(_Data.Val11.toString());
        $('#Val12' + i).html(_Data.Val12.toString());
        $('#Total' + i).html(_Data.Total.toString());
    }
})(Dashboard || (Dashboard = {}));
//# sourceMappingURL=Dashboard.js.map