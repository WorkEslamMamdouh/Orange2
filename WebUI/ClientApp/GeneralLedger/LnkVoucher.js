$(document).ready(function () {
    LnkVoucher.InitalizeComponent();
});
var LnkVoucher;
(function (LnkVoucher) {
    //System
    var sys = new SystemTools();
    var SysSession = GetSystemSession(Modules.JournalVoucher);
    var compcode;
    var VoucherCCDtType = 0;
    var VoucherCCType = 0;
    var GL_JournalSaveUnbalanced = false;
    var startDate;
    var EndDate;
    var FinYear = (SysSession.CurrentEnvironment.CurrentYear);
    //GridView
    var Grid = new JsGrid();
    //Arrays
    var StatesFilterDetailsAr = new Array();
    var StatesFilterDetailsEn = new Array();
    var VoucherTypesDetails = new Array();
    var VoucherSourceDetails = new Array();
    var AQJournalHeaderWithDetails = new Array();
    var TempHeaderWithDetail = new VchrTemplatMasterDetail();
    var SearchDetails = new Array();
    var AccountDetails = new A_ACCOUNT();
    var AccountDetailsIst = new Array();
    var CostCentreDetailsIst = new Array();
    var CostCenterDetails = new G_COST_CENTER();
    var CostCentreDetailsCCDTIst = new Array();
    var CostCentreDetailsCCDT = new A_CCDT_COSTCENTERS();
    //Models
    var MasterDetailModel = new JournalMasterDetails();
    var ReversedJournalMasterDetailModel = new AQ_GetJournalHeaderWithDetail();
    var JournalHeaderModel = new A_JOURNAL_HEADER();
    var JournalDetailModel = new Array();
    var JournalDetailSingleModel = new A_JOURNAL_DETAIL();
    var JournalDetailModelFiltered = new Array();
    var AQJournalDetailModel = new Array();
    var AQJournalDetailSingleModel = new AQ_GetJournalDetail();
    var SelectedJournalModel = new Array();
    var selectedTemplateModel = new A_TR_VchrTemplate();
    var TemplateDetailModelFiltered = new Array();
    var TempMasterDetailModel = new VchrTemplatMasterDetail();
    var TempHeaderModel = new A_TR_VchrTemplate();
    var TempDetailModel = new Array();
    var TempDetailSingleModel = new A_TR_VchrTemplateDetail();
    //textboxs
    var txtFromDate;
    var txtToDate;
    var txtJouranlNumber;
    var txtJouranlDate;
    var txtJournalDescripton;
    var txtRefNumber;
    var txtResource;
    var txtCreatedBy;
    var txtCreatedAt;
    var txtUpdatedBy;
    var txtUpdatedAt;
    var txtAuthorizedBy;
    var txtAuthorizedAt;
    var txtPostedBy;
    var txtPostedAt;
    var txtSearch;
    var txtTotalDebit;
    var txtTotalCredit;
    var txtDifference;
    var txtCostCntrNameFooter;
    var txtAccountNameFooter;
    var txtTempName;
    var txtTempNumber;
    //DropdownLists
    var ddlStatusFilter;
    var ddlVoucherTypeFilter;
    var ddlVoucherSourceFilter;
    var ddlJournalType;
    //buttons
    var btnCopyRemark;
    var btnShow;
    var btnAdd;
    var btnUpdate;
    var btnSave;
    var btnSaveTemp;
    var btnBackTemp;
    var btnBack;
    var btnAddDetails;
    var btnPost;
    var btnAuthorize;
    var btnUnAuthorize;
    var btnReverseVoucher;
    var btnLoadTemplate;
    var btnCreateTemplate;
    var btnUpdateTemplate;
    var btnDeleteTemplate;
    //--- Print Buttons
    var btnPrint;
    var btnPrintTrview;
    var btnPrintTrPDF;
    var btnPrintTrEXEL;
    // Radio Buttons
    var rdNew;
    var rdAuthorized;
    var rdPosted;
    //var rdPosted: HTMLInputElement;
    var rdSaveValue;
    var rdSaveDesc;
    // Flages
    var FlagAddOrEdit = 0; //1 Add 2 Edit
    var TempFlagAddOrEdit = 0; //1 Add 2 Edit Template
    var showFlag = false;
    var TempshowFlag = false;
    var AuthorizeFlag = false;
    var PostFlag = false;
    var ReverseFlag = false;
    var AfterInsertOrUpdateFlag = false;
    //global
    var CountGrid = 0;
    var GlobalVoucherID = 0;
    var GlobalTemplateID = 0;
    var DepitTotal = 0;
    var CreditTotal = 0;
    var btnPrintTransaction;
    var GlobalNum = 0;
    var Events = 0;
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);
    function InitalizeComponent() {
    }
    LnkVoucher.InitalizeComponent = InitalizeComponent;
    //------------------------------------------------------ Main Region -----------------------------------
    function InitalizeControls() {
    }
    function InitalizeEvents() {
    }
})(LnkVoucher || (LnkVoucher = {}));
//# sourceMappingURL=LnkVoucher.js.map