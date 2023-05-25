
$(document).ready(() => {
    LnkVoucher.InitalizeComponent();
})

namespace LnkVoucher {

    //System
    var sys: SystemTools = new SystemTools();
    var SysSession: SystemSession = GetSystemSession(Modules.JournalVoucher);
    var compcode: Number;
    var VoucherCCDtType: number = 0;
    var VoucherCCType: number = 0;
    var GL_JournalSaveUnbalanced: boolean = false;
    var startDate: string;
    var EndDate: string;
    var FinYear = (SysSession.CurrentEnvironment.CurrentYear);

    //GridView
    var Grid: JsGrid = new JsGrid();

    //Arrays
    var StatesFilterDetailsAr: Array<string> = new Array<string>();
    var StatesFilterDetailsEn: Array<string> = new Array<string>();
    var VoucherTypesDetails: Array<A_Voucher_Types> = new Array<A_Voucher_Types>();
    var VoucherSourceDetails: Array<G_Codes> = new Array<G_Codes>();
    var AQJournalHeaderWithDetails: Array<AQ_GetJournalHeader> = new Array<AQ_GetJournalHeader>();
    var TempHeaderWithDetail: VchrTemplatMasterDetail = new VchrTemplatMasterDetail();
    var SearchDetails: Array<AQ_GetJournalHeader> = new Array<AQ_GetJournalHeader>();
    var AccountDetails: A_ACCOUNT = new A_ACCOUNT();
    var AccountDetailsIst: Array<A_ACCOUNT> = new Array<A_ACCOUNT>();
    var CostCentreDetailsIst: Array<G_COST_CENTER> = new Array<G_COST_CENTER>();
    var CostCenterDetails: G_COST_CENTER = new G_COST_CENTER();

    var CostCentreDetailsCCDTIst: Array<A_CCDT_COSTCENTERS> = new Array<A_CCDT_COSTCENTERS>();
    var CostCentreDetailsCCDT: A_CCDT_COSTCENTERS = new A_CCDT_COSTCENTERS();

    //Models
    var MasterDetailModel: JournalMasterDetails = new JournalMasterDetails();
    var ReversedJournalMasterDetailModel: AQ_GetJournalHeaderWithDetail = new AQ_GetJournalHeaderWithDetail();
    var JournalHeaderModel: A_JOURNAL_HEADER = new A_JOURNAL_HEADER();
    var JournalDetailModel: Array<A_JOURNAL_DETAIL> = new Array<A_JOURNAL_DETAIL>();
    var JournalDetailSingleModel: A_JOURNAL_DETAIL = new A_JOURNAL_DETAIL();
    var JournalDetailModelFiltered: Array<AQ_GetJournalDetail> = new Array<AQ_GetJournalDetail>();

    var AQJournalDetailModel: Array<AQ_GetJournalDetail> = new Array<AQ_GetJournalDetail>();
    var AQJournalDetailSingleModel: AQ_GetJournalDetail = new AQ_GetJournalDetail();
    var SelectedJournalModel: Array<AQ_GetJournalHeader> = new Array<AQ_GetJournalHeader>();
    var selectedTemplateModel: A_TR_VchrTemplate = new A_TR_VchrTemplate();
    var TemplateDetailModelFiltered: Array<A_TR_VchrTemplateDetail> = new Array<A_TR_VchrTemplateDetail>();

    var TempMasterDetailModel: VchrTemplatMasterDetail = new VchrTemplatMasterDetail();
    var TempHeaderModel: A_TR_VchrTemplate = new A_TR_VchrTemplate();
    var TempDetailModel: Array<A_TR_VchrTemplateDetail> = new Array<A_TR_VchrTemplateDetail>();
    var TempDetailSingleModel: A_TR_VchrTemplateDetail = new A_TR_VchrTemplateDetail();

    //textboxs
    var txtFromDate: HTMLInputElement;
    var txtToDate: HTMLInputElement;
    var txtJouranlNumber: HTMLInputElement;
    var txtJouranlDate: HTMLInputElement;
    var txtJournalDescripton: HTMLInputElement;
    var txtRefNumber: HTMLInputElement;
    var txtResource: HTMLInputElement;
    var txtCreatedBy: HTMLInputElement;
    var txtCreatedAt: HTMLInputElement;
    var txtUpdatedBy: HTMLInputElement;
    var txtUpdatedAt: HTMLInputElement;
    var txtAuthorizedBy: HTMLInputElement;
    var txtAuthorizedAt: HTMLInputElement;
    var txtPostedBy: HTMLInputElement;
    var txtPostedAt: HTMLInputElement;
    var txtSearch: HTMLInputElement;
    var txtTotalDebit: HTMLInputElement;
    var txtTotalCredit: HTMLInputElement;
    var txtDifference: HTMLInputElement;
    var txtCostCntrNameFooter: HTMLInputElement;
    var txtAccountNameFooter: HTMLInputElement;
    var txtTempName: HTMLInputElement;
    var txtTempNumber: HTMLInputElement;

    //DropdownLists
    var ddlStatusFilter: HTMLSelectElement;
    var ddlVoucherTypeFilter: HTMLSelectElement;
    var ddlVoucherSourceFilter: HTMLSelectElement;
    var ddlJournalType: HTMLSelectElement;


    //buttons

    var btnCopyRemark: HTMLButtonElement;
    var btnShow: HTMLButtonElement;
    var btnAdd: HTMLButtonElement;
    var btnUpdate: HTMLButtonElement;
    var btnSave: HTMLButtonElement;
    var btnSaveTemp: HTMLButtonElement;
    var btnBackTemp: HTMLButtonElement;


    var btnBack: HTMLButtonElement;
    var btnAddDetails: HTMLButtonElement;
    var btnPost: HTMLButtonElement;
    var btnAuthorize: HTMLButtonElement;
    var btnUnAuthorize: HTMLButtonElement;
    var btnReverseVoucher: HTMLButtonElement;
    var btnLoadTemplate: HTMLButtonElement;
    var btnCreateTemplate: HTMLButtonElement;
    var btnUpdateTemplate: HTMLButtonElement;
    var btnDeleteTemplate: HTMLButtonElement;


    //--- Print Buttons
    var btnPrint: HTMLButtonElement;
    var btnPrintTrview: HTMLButtonElement;
    var btnPrintTrPDF: HTMLButtonElement;
    var btnPrintTrEXEL: HTMLButtonElement;



    // Radio Buttons
    var rdNew: HTMLInputElement;
    var rdAuthorized: HTMLInputElement;
    var rdPosted: HTMLInputElement;
    //var rdPosted: HTMLInputElement;
    var rdSaveValue: HTMLInputElement;
    var rdSaveDesc: HTMLInputElement;

    // Flages
    var FlagAddOrEdit: number = 0;//1 Add 2 Edit
    var TempFlagAddOrEdit: number = 0;//1 Add 2 Edit Template
    var showFlag: boolean = false;
    var TempshowFlag: boolean = false;
    var AuthorizeFlag: boolean = false;
    var PostFlag: boolean = false;
    var ReverseFlag: boolean = false;
    var AfterInsertOrUpdateFlag: boolean = false;

    //global
    var CountGrid: number = 0;
    var GlobalVoucherID: number = 0;
    var GlobalTemplateID: number = 0;
    var DepitTotal: number = 0;
    var CreditTotal: number = 0;
    var btnPrintTransaction;
    var GlobalNum = 0;
    var Events = 0; 
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);

    export function InitalizeComponent() {
      
    }

    //------------------------------------------------------ Main Region -----------------------------------
    function InitalizeControls() {
 

    }
    function InitalizeEvents() {
         
    }
    
     
}