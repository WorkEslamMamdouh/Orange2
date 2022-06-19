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
    //var All_Asset: Array<F_Asset> = new Array<F_Asset>();
    //var DisposalDetailModel: Array<F_Tr_DisposalDetail> = new Array<F_Tr_DisposalDetail>();
    ////Models
    //var DisposalDetailSingleModel: F_Tr_DisposalDetail = new F_Tr_DisposalDetail;
    //var DisposalHeaderModel: F_Tr_DisposalHeader = new F_Tr_DisposalHeader;
    //var CustDetails: IQ_GetCustomerBalance = new IQ_GetCustomerBalance;
    //var _DisposalMasterDetail: DisposalMasterDetail = new DisposalMasterDetail();


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

    export function InitalizeComponent() {

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
    function InitalizeControls() {

    }
    function InitializeEvents() {


    }

    function GetDashboard() {




    }
    function InitializeGrid(cnt: number) {

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
    function DisplayGrid(i: number) {


        $('#titel' + i).html('Eslam' + i);
        $('#titel' + i).addClass('th_Style');


    }

}