using Inv.WebUI.Filter;
using System.Web.Mvc;

namespace Inv.WebUI.Controllers
{

    [AuthorizeUserAttribute()]
    public class HomeController : Controller
    {



        //    GET: Home
        public ActionResult HomeIndex()
        {

            //Session["ErrorUrl"] = "";//Url.Action("LoginIndex", "Login");
            //SessionManager.SessionRecord.CompanyNameAr = "";

            //Session["SystemProperties"] = SessionManager.SessionRecord;

            return View("HomeIndex");
        }

        public ActionResult Admin()
        {
            return View();
        }

        public ActionResult AdminHome()
        {
            return View();
        }
        public JsonResult AdminHome_()
        {

            var obj = new
            {
                url = Url.Action("AdminHome", "Home")

            };
            var result = Shared.JsonObject(obj);
            return result;
        }
        public ActionResult HomeIndexPackage()
        {


            return View("HomeIndex");
        }

        //public JsonResult GetSystemProperties()
        //{
        //    SessionRecord jsonObject = (SessionRecord)Session["SystemProperties"];
        //    string data = Newtonsoft.Json.JsonConvert.SerializeObject(jsonObject, Newtonsoft.Json.Formatting.Indented);
        //    return Shared.JsonObject(data);
        //}

        public ActionResult Logout()
        {

            //SessionManager.Me = null;
            //SessionManager.ModelCount = 0;
            //SessionManager.PageIndex = 0;
            //SessionManager.SessionRecord = null;

            return RedirectToAction("Loginindex", "Login");
        }

        public ViewResult Help()
        {

            return View();
        }


        public ActionResult OpenView(string ModuleCode)
        {


            if (ModuleCode == "ImagPopUp")
            {
                return PartialView("~/Views/Shared/ImagePopup.cshtml");

            }
            if (ModuleCode == "Messages_screen")
            {
                return PartialView("~/Views/Shared/Messages_screen.cshtml");
            }
            if (ModuleCode == "ImagePopupiupload")
            {
                return PartialView("~/Views/Shared/ImagePopupiupload.cshtml");
            }

            return PartialView("");

        }

        #region Open Pages 

        public ActionResult OpenPdf(string path)
        {
          
            return File(""+ path + "","application/pdf");
        }

        public ActionResult AgingCustIndex()
        {
            return View("~/Views/CollectionReports/AgingCustIndex.cshtml");
        }
        public ActionResult AgingVendIndex()
        {
            return View("~/Views/CollectionReports/AgingVendIndex.cshtml");
        }
        public ActionResult StkDefItemsIndex()
        {
            return View("~/Views/StkDefinition/StkDefItemsIndex.cshtml");
        }
        public ActionResult StkDefItemsNewIndex()
        {
            return View("~/Views/StkDefinition/StkDefItemsNewIndex.cshtml");
        }
        public ActionResult StkDefCategoryIndex()
        {
            return View("~/Views/StkDefinition/StkDefCategoryIndex.cshtml");
        }
        public ActionResult PeriodManagementIndex()
        {
            return View("~/Views/StkDefinition/PeriodManagementIndex.cshtml");
        }
             public ActionResult ItemPeriodSummaryIndex()
        {
            return View("~/Views/StkDefinition/ItemPeriodSummaryIndex.cshtml");
        }

        public ActionResult StkDefUnitIndex()
        {
            return View("~/Views/StkDefinition/StkDefUnitIndex.cshtml");
        }
        public ActionResult StkDefItemTypeIndex()
        {
            return View("~/Views/StkDefinition/StkDefItemTypeIndex.cshtml");
        }
        public ActionResult StkDefStoreIndex()
        {
            return View("~/Views/StkDefinition/StkDefStoreIndex.cshtml");
        }
        
        public ActionResult AccDefBoxIndex()
        {
            return View("~/Views/AccDefinition/AccDefBoxIndex.cshtml");
        }
        
        public ActionResult AccDefCustomerIndex()
        {
            return View("~/Views/AccDefinition/AccDefCustomerIndex.cshtml");
        }
        public ActionResult AccDefExpensesIndex()
        {
            return View("~/Views/AccDefinition/AccDefExpensesIndex.cshtml");
        }
        public ActionResult AccDefReceiptsIndex()
        {
            return View("~/Views/AccDefinition/AccDefReceiptsIndex.cshtml");
        }
        public ActionResult AccDefSalesmenIndex()
        {
            return View("~/Views/AccDefinition/AccDefSalesmenIndex.cshtml");
        }
        public ActionResult AccDefVendorIndex()
        {
            return View("~/Views/AccDefinition/AccDefVendorIndex.cshtml");
        }
        
        public ActionResult GenDefCustomerAdjustIndex()
        {
            return View("~/Views/GeneralDefinition/GenDefCustomerAdjustIndex.cshtml");
        }
        public ActionResult GenDefCustomerCatIndex()
        {
            return View("~/Views/GeneralDefinition/GenDefCustomerCatIndex.cshtml");
        }
        public ActionResult GendefCustomerGroupIndex()
        {
            return View("~/Views/GeneralDefinition/GendefCustomerGroupIndex.cshtml");
        }
        public ActionResult GenDefVendorAdjustIndex()
        {
            return View("~/Views/GeneralDefinition/GenDefVendorAdjustIndex.cshtml");
        }
        public ActionResult GenDefVendorCatIndex()
        {
            return View("~/Views/GeneralDefinition/GenDefVendorCatIndex.cshtml");
        }
        public ActionResult GendefVendorGroupIndex()
        {
            return View("~/Views/GeneralDefinition/GendefVendorGroupIndex.cshtml");
        }
        public ActionResult AccTrInvReceiptIndex()
        {
            return View("~/Views/FundMovement/AccTrInvReceiptIndex.cshtml");
        }

        public ActionResult AccTrReceiptNoteIndex()
        {
            return View("~/Views/FundMovement/AccTrReceiptNoteIndex.cshtml");
        }
        public ActionResult AccTrPaymentNoteIndex()
        {
            return View("~/Views/FundMovement/AccTrPaymentNoteIndex.cshtml");
        }
        public ActionResult AccTrCustomerAdjustIndex()
        {
            return View("~/Views/FundMovement/AccTrCustomerAdjustIndex.cshtml");
        }
        public ActionResult AccTrVendorAdjustIndex()
        {
            return View("~/Views/FundMovement/AccTrVendorAdjustIndex.cshtml");
        }

        public ActionResult SlsTrSalesIndex()
        {
            return View("~/Views/Sales/SlsTrSalesIndex.cshtml");
        }
        public ActionResult SlsTrReturnIndex()
        {
            return View("~/Views/Sales/SlsTrReturnIndex.cshtml");
        }


        public ActionResult SlsTrSalesManagerNewIndex()
        {
            return View("~/Views/Sales/SlsTrSalesManagerNewIndex.cshtml");
        }

        public ActionResult SlsTrSalesOperationIndex()
        {
            return View("~/Views/Sales/SlsTrSalesOperationIndex.cshtml");
        }

        public ActionResult SlsTrSalesManagerIndex()
        {
            return View("~/Views/Sales/SlsTrSalesManagerIndex.cshtml");
        }
        public ActionResult SlsTrShowPriceIndex()
        {
            return View("~/Views/Sales/SlsTrShowPriceIndex.cshtml");
        }
        public ActionResult PurOrderIndex()
        {
            return View("~/Views/Purchase/PurOrderIndex.cshtml");
        }
        public ActionResult PurTrReceiveIndex()
        {
            return View("~/Views/Purchase/PurTrReceiveIndex.cshtml");
        }

        public ActionResult PurTrReturnIndex()
        {
            return View("~/Views/Purchase/PurTrReturnIndex.cshtml");
        }
        public ActionResult PurTrpaymemtIndex()
        {
            return View("~/Views/Purchase/PurTrpaymemtIndex.cshtml");
        }


        public ActionResult Processesindex()
        {
            return View("~/Views/Processes/Processesindex.cshtml");
        }
        public ActionResult CloseProcessesindex()
        {
            return View("~/Views/Processes/CloseProcessesindex.cshtml");
        }
        public ActionResult SalesTransIndex()
        {
            return View("~/Views/Processes/SalesTransIndex.cshtml");
        }
        public ActionResult ProcSalesMgrIndex()
        {
            return View("~/Views/Processes/ProcSalesMgrIndex.cshtml");
        }
        //
        public ActionResult ProcSalesRetIndex()
        {
            return View("~/Views/Processes/ProcSalesRetIndex.cshtml");
        }
        
  public ActionResult OperationScrapIndex()
        {
            return View("~/Views/Processes/OperationScrapIndex.cshtml");
        }


        //ProcSalesInvoice
        public ActionResult ProcSalesInvoiceIndex()
        {
            return View("~/Views/Processes/ProcSalesInvoiceIndex.cshtml");
        }

        public ActionResult ClientaccstatIndex()
        {
            return View("~/Views/CollectionReports/ClientaccstatIndex.cshtml");
        } 
        public ActionResult CollectedaccstatIndex()
        {
            return View("~/Views/CollectionReports/CollectedaccstatIndex.cshtml");
        }

        public ActionResult SupplieraccstatIndex()
        {
            return View("~/Views/CollectionReports/SupplieraccstatIndex.cshtml");
        }

        public ActionResult CashBoxAccountIndex()
        {
            return View("~/Views/CollectionReports/CashBoxAccountIndex.cshtml");
        }
        public ActionResult CashBankAccountIndex()
        {
            return View("~/Views/CollectionReports/CashBankAccountIndex.cshtml");
        }
        public ActionResult InventorymoveIndex()
        {
            return View("~/Views/CollectionReports/InventorymoveIndex.cshtml");
        }

        public ActionResult ItemsalesSumIndex()
        {
            return View("~/Views/CollectionReports/ItemsalesSumIndex.cshtml");
        }
        public ActionResult ItemPurchaseIndex()
        {
            return View("~/Views/CollectionReports/ItemPurchaseIndex.cshtml");
        }
         
        public ActionResult InventoryvalueIndex()
        {
            return View("~/Views/CollectionReports/InventoryvalueIndex.cshtml");
        }
        public ActionResult IncomeoperationsIndex()
        {
            return View("~/Views/CollectionReports/IncomeoperationsIndex.cshtml");
        }

        public ActionResult GLDefAccountIndex()
        {
            return View("~/Views/GeneralLedgerMenu/GLDefAccountIndex.cshtml");
        }
        public ActionResult JournalVoucherIndex()
        {
            return View("~/Views/GeneralLedgerMenu/JournalVoucherIndex.cshtml");

        }
        public ActionResult ReceiptVoucherIndex()
        {
            return View("~/Views/GeneralLedgerMenu/ReceiptVoucherIndex.cshtml");

        }
        public ActionResult PaymentVoucherIndex()
        {
            return View("~/Views/GeneralLedgerMenu/PaymentVoucherIndex.cshtml");

        }
        public ActionResult ManagementVoucherIndex()
        {
            return View("~/Views/GeneralLedgerMenu/ManagementVoucherIndex.cshtml");
        }
        public ActionResult CostCenterIndex()
        {
            return View("~/Views/GeneralLedgerMenu/CostCenterIndex.cshtml");
        }
        public ActionResult AccountbalancesIndex()
        {
            return View("~/Views/GeneralLedgerMenu/AccountbalancesIndex.cshtml");
        }
        public ActionResult AccountstatementIndex()
        {
            return View("~/Views/GeneralLedgerMenu/AccountstatementIndex.cshtml");
        }
        public ActionResult financialreportsIndex()
        {
            return View("~/Views/GeneralLedgerMenu/financialreportsIndex.cshtml");
        }

        public ActionResult USERSIndex()
        {
            return View("~/Views/Tools/USERS/USERSIndex.cshtml");
        }
        public ActionResult TranPostingIndex()
        {
            return View("~/Views/Tools/TranPosting/TranPostingIndex.cshtml");
        }

        public ActionResult LnkvarBranchIndex()
        {
            return View("~/Views/Tools/LnkvarBranch/LnkvarBranchIndex.cshtml");
        }


        public ActionResult DashboardIndex()
        {
            return View("~/Views/Dashboard/DashboardIndex.cshtml");
        
        }

        public ActionResult LnkTransVoucherIndex()
        {
            return View("~/Views/Tools/LnkTransVoucher/LnkTransVoucherIndex.cshtml");
        }

        public ActionResult DirecttransferIndex()
        {
            return View("~/Views/Inventory/DirecttransferIndex.cshtml");
        }
        public ActionResult STKAdjustIndex()
        {
            return View("~/Views/Inventory/STKAdjustIndex.cshtml");
        }
        public ActionResult sendTransferIndex()
        {
            return View("~/Views/Inventory/sendTransferIndex.cshtml");
        }
        public ActionResult ReceiveTransferIndex()
        {
            return View("~/Views/Inventory/ReceiveTransferIndex.cshtml");
        }
        public ActionResult GenDefAddIndex()
        {
            return View("~/Views/GeneralDefinition/GenDefAddIndex.cshtml");
        }
           public ActionResult DefStoreIndex()
        {
            return View("~/Views/AccDefinition/DefStoreIndex.cshtml");
        }
           public ActionResult ServiceCategoriesIndex()
        {
            return View("~/Views/servicesystem/ServiceCategoriesIndex.cshtml");
        }
        public ActionResult ServicesIndex()
        {
            return View("~/Views/servicesystem/ServicesIndex.cshtml");
        }
        public ActionResult Sales_ServicesIndex()
        {
            return View("~/Views/servicesystem/Sales_ServicesIndex.cshtml");
        }

        public ActionResult Ser_Return_SalesIndex()
        {
            return View("~/Views/servicesystem/Ser_Return_SalesIndex.cshtml");
        }

        public ActionResult Ser_PurchasingIndex()
        {
            return View("~/Views/servicesystem/Ser_PurchasingIndex.cshtml");
        }
            public ActionResult Ser_Return_PurIndex()
        {
            return View("~/Views/servicesystem/Ser_Return_PurIndex.cshtml");
        }
            public ActionResult Ser_Sales_ReportIndex()
        {
            return View("~/Views/servicesystem/Ser_Sales_ReportIndex.cshtml");
        } 
            public ActionResult Ser_Pur_ReportIndex()
        {
            return View("~/Views/servicesystem/Ser_Pur_ReportIndex.cshtml");
        }
         public ActionResult AdminBarIndex()
        {
            return View("~/Views/AdminSetting/AdminBarIndex.cshtml");
        }
        public ActionResult AdminCompDataIndex()
        {
            return View("~/Views/AdminSetting/AdminCompDataIndex.cshtml");
        }
        public ActionResult AdminCompIndex()
        {
            return View("~/Views/AdminSetting/AdminCompIndex.cshtml");
        }
        
        public ActionResult DtcostcenterIndex()
        {
            return View("~/Views/costcenter/DtcostcenterIndex.cshtml");
        }
         public ActionResult CcdtAccStateIndex()
        {
            return View("~/Views/costcenter/CcdtAccStateIndex.cshtml");
        }

        public ActionResult VatReportIndex()
        {
            return View("~/Views/TaxSystem/VatReportIndex.cshtml");
        }
         public ActionResult VatListsIndex()
        {
            return View("~/Views/TaxSystem/VatListsIndex.cshtml");
        }
        
         public ActionResult VatSettingIndex()
        {
            return View("~/Views/TaxSystem/VatSettingIndex.cshtml");
        }

        public ActionResult ReportsPopup()
        {
            return View("~/Views/Partial/ReportsPopup.cshtml");
        }

        public ActionResult CollectUnitIndex()
        {
            return View("~/Views/Inventory/CollectUnitIndex.cshtml");
        }
         public ActionResult IssueTypeIndex()
        { 
            return View("~/Views/StkDefinition/IssueTypeIndex.cshtml");
        }
         public ActionResult IssueToCCIndex()
        { 
            return View("~/Views/StkDefinition/IssueToCCIndex.cshtml");
        }

        #endregion  Open Pages 

    }
}