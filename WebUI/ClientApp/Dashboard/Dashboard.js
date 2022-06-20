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
    var totVal1 = 0;
    var totVal2 = 0;
    var totVal3 = 0;
    var totVal4 = 0;
    var totVal5 = 0;
    var totVal6 = 0;
    var totVal7 = 0;
    var totVal8 = 0;
    var totVal9 = 0;
    var totVal10 = 0;
    var totVal11 = 0;
    var totVal12 = 0;
    var totalVal = 0;
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
        totVal1 = 0;
        totVal2 = 0;
        totVal3 = 0;
        totVal4 = 0;
        totVal5 = 0;
        totVal6 = 0;
        totVal7 = 0;
        totVal8 = 0;
        totVal9 = 0;
        totVal10 = 0;
        totVal11 = 0;
        totVal12 = 0;
        totalVal = 0;
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("SystemTools", "GetDashboard"),
            data: { _Type: _Type, comp: compcode, bracode: BranchCode },
            success: function (d) {
                var result = d;
                IprocDash = result.Response;
                CountGrid = 0;
                $("#dataTable_0").html('');
                for (var i = 0; i < IprocDash.length; i++) {
                    InitializeGrid(i);
                    DisplayGrid(i, IprocDash[i], _Type);
                    CountGrid++;
                }
                DisplayTotal(CountGrid + 1);
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
            '<td  id="Val1_' + cnt + '" > ' +
            '0' +
            '</td>' +
            '<td  id="Val2_' + cnt + '"  > ' +
            '0' +
            '</td>' +
            '<td  id="Val3_' + cnt + '"  > ' +
            '0' +
            '</td>' +
            '<td id="Val4_' + cnt + '"  > ' +
            '0' +
            '</td>' +
            '<td id="Val5_' + cnt + '"  > ' +
            '0' +
            '</td>' +
            '<td id="Val6_' + cnt + '" > ' +
            '0' +
            '</td>' +
            '<td id="Val7_' + cnt + '" > ' +
            '0' +
            '</td>' +
            '<td id="Val8_' + cnt + '" > ' +
            '0' +
            '</td>' +
            '<td id="Val9_' + cnt + '" > ' +
            '0' +
            '</td>' +
            '<td id="Val10_' + cnt + '" > ' +
            '0' +
            '</td>' +
            '<td id="Val11_' + cnt + '" > ' +
            '0' +
            '</td>' +
            '<td id="Val12_' + cnt + '" > ' +
            '0' +
            '</td>' +
            '<td id="Total_' + cnt + '" > ' +
            '0' +
            '</td>' +
            '</tr>';
        $("#dataTable_0").append(html);
    }
    function DisplayGrid(i, _Data, _Type) {
        debugger;
        $('#titel' + i).addClass('th_Style');
        var titel = '';
        if (_Type == 0) { // عمليات
            titel = _Data.rowno == 1 ? 'عدد التريلات' : _Data.rowno == 2 ? 'مغلق' : _Data.rowno == 3 ? 'مفتوح' : _Data.rowno == 4 ? 'المبيعات' : _Data.rowno == 5 ? 'المشتريات' : _Data.rowno == 6 ? 'المصاريف' : _Data.rowno == 7 ? 'دعم المورد' : _Data.rowno == 8 ? '  التبريد' : _Data.rowno == 9 ? '  التسويق' : _Data.rowno == 10 ? '  الكمسيون' : '';
        }
        $('#titel' + i).html(titel);
        $('#Val1_' + i).html(_Data.Val1.toString());
        $('#Val2_' + i).html(_Data.Val2.toString());
        $('#Val3_' + i).html(_Data.Val3.toString());
        $('#Val4_' + i).html(_Data.Val4.toString());
        $('#Val5_' + i).html(_Data.Val5.toString());
        $('#Val6_' + i).html(_Data.Val6.toString());
        $('#Val7_' + i).html(_Data.Val7.toString());
        $('#Val8_' + i).html(_Data.Val8.toString());
        $('#Val9_' + i).html(_Data.Val9.toString());
        $('#Val10_' + i).html(_Data.Val10.toString());
        $('#Val11_' + i).html(_Data.Val11.toString());
        $('#Val12_' + i).html(_Data.Val12.toString());
        $('#Total_' + i).html(_Data.Total.toString());
        totVal1 += _Data.Val1;
        totVal2 += _Data.Val2;
        totVal3 += _Data.Val3;
        totVal4 += _Data.Val4;
        totVal5 += _Data.Val5;
        totVal6 += _Data.Val6;
        totVal7 += _Data.Val7;
        totVal8 += _Data.Val8;
        totVal9 += _Data.Val9;
        totVal10 += _Data.Val10;
        totVal11 += _Data.Val11;
        totVal12 += _Data.Val12;
        totalVal += _Data.Total;
    }
    function DisplayTotal(cnt) {
        InitializeGrid(cnt);
        $('#titel' + cnt).addClass('th_Style');
        $('#titel' + cnt).html('الاجمالي');
        $('#Val1_' + cnt).html(totVal1.RoundToSt(2));
        $('#Val2_' + cnt).html(totVal2.RoundToSt(2));
        $('#Val3_' + cnt).html(totVal3.RoundToSt(2));
        $('#Val4_' + cnt).html(totVal4.RoundToSt(2));
        $('#Val5_' + cnt).html(totVal5.RoundToSt(2));
        $('#Val6_' + cnt).html(totVal6.RoundToSt(2));
        $('#Val7_' + cnt).html(totVal7.RoundToSt(2));
        $('#Val8_' + cnt).html(totVal8.RoundToSt(2));
        $('#Val9_' + cnt).html(totVal9.RoundToSt(2));
        $('#Val10_' + cnt).html(totVal10.RoundToSt(2));
        $('#Val11_' + cnt).html(totVal11.RoundToSt(2));
        $('#Val12_' + cnt).html(totVal12.RoundToSt(2));
        $('#Total_' + cnt).html(totalVal.RoundToSt(2));
    }
})(Dashboard || (Dashboard = {}));
//# sourceMappingURL=Dashboard.js.map