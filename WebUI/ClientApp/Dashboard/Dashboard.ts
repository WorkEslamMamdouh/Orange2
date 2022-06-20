$(document).ready(() => {
    Dashboard.InitalizeComponent();
})
namespace Dashboard {
    //system varables
    var SysSession: SystemSession = GetSystemSession(Modules.Dashboard);
    var compcode: Number;
    var BranchCode: number;
    var sys: SystemTools = new SystemTools();

    // giedView
    var Grid: JsGrid = new JsGrid();
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
    var IprocDash: Array<Iproc_Dash> = new Array<Iproc_Dash>();


    //ddl  
    //TextBoxes 
    var ddlType: HTMLSelectElement;
    var txt_Remarks: HTMLInputElement;
    var txtStartDate: HTMLInputElement;
    var txtEndDate: HTMLInputElement;
    var txtCustomerCode: HTMLInputElement;
    var txtCustomerName: HTMLInputElement;
    var NameCustomer: HTMLInputElement;
    var searchbutmemreport: HTMLInputElement;
    //checkbox  
    var chkCertified: HTMLInputElement;
    //buttons   
    var btnInvoiceSearch: HTMLButtonElement;
    var btnAddDetails: HTMLButtonElement;
    var btnCustomerSrchFltr: HTMLButtonElement;
    var btnCustomerSrch: HTMLButtonElement;
    var btnAdd: HTMLButtonElement;
    var btnShow: HTMLButtonElement;
    var btnUpdate: HTMLButtonElement;
    var btnBack: HTMLButtonElement;// btnBack btnSave
    var btnSave: HTMLButtonElement;
    //print buttons     
    var btnPrintTrview: HTMLButtonElement;
    var btnPrintTrPDF: HTMLButtonElement;
    var btnPrintTrEXEL: HTMLButtonElement;
    var btnPrintTransaction: HTMLButtonElement;

    //global    
    var Finyear: number;
    var GlobalinvoiceID: number = 0;
    var DisposalId: number = 0;
    var CustomerId: number = 0;
    var HCustomerId: number = 0;
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

    export function InitalizeComponent() {

        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);
        Finyear = Number(SysSession.CurrentEnvironment.CurrentYear);
        InitalizeControls();
        InitializeEvents();
        GetDashboard();

    }
    function InitalizeControls() {

    }
    function InitializeEvents() {


    }

    function GetDashboard() {

        let _Type = 0;

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

        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("SystemTools", "GetDashboard"),
            data: { _Type: _Type, comp: compcode, bracode: BranchCode },
            success: (d) => {
                let result = d as BaseResponse;
                IprocDash = result.Response as Array<Iproc_Dash>;
                CountGrid = 0;

                $("#dataTable_1").html('');

                for (var i = 0; i < IprocDash.length; i++) {
                    InitializeGrid(i);
                    DisplayGrid(i, IprocDash[i], _Type);
                    CountGrid++;
                }

                DisplayTotal(CountGrid + 1);


            }
        });



    }
    function InitializeGrid(cnt: number) {

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
    function DisplayGrid(i: number, _Data: Iproc_Dash, _Type: number) {
        debugger
        $('#titel' + i).addClass('th_Style');
        let titel = '';

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


        totVal1 += _Data.Val1 ;
        totVal2 += _Data.Val2 ;
        totVal3 += _Data.Val3 ;
        totVal4 += _Data.Val4 ;
        totVal5 += _Data.Val5 ;
        totVal6 += _Data.Val6 ;
        totVal7 += _Data.Val7 ;
        totVal8 += _Data.Val8 ;
        totVal9 += _Data.Val9 ;
        totVal10 += _Data.Val10 ;
        totVal11 += _Data.Val11 ;
        totVal12 += _Data.Val12 ;


    }

    function DisplayTotal(cnt: number) { 
        InitializeGrid(cnt);

        $('#titel' + cnt).html('الاجمالي');
        $('#Val1' + cnt).html(totVal1.toString());
        $('#Val2' + cnt).html(totVal1.toString());
        $('#Val3' + cnt).html(totVal1.toString());
        $('#Val4' + cnt).html(totVal1.toString());
        $('#Val5' + cnt).html(totVal1.toString());
        $('#Val6' + cnt).html(totVal1.toString());
        $('#Val7' + cnt).html(totVal1.toString());
        $('#Val8' + cnt).html(totVal1.toString());
        $('#Val9' + cnt).html(totVal1.toString());
        $('#Val10' + cnt).html(totVal1.toString());
        $('#Val11' + cnt).html(totVal1.toString());
        $('#Val12' + cnt).html(totVal1.toString());
        $('#Total' + cnt).html(totVal1.toString());

    }
}