//using Inv.API.Models.CustomEntities;
using Inv.WebUI.Reports.Models;
using System.Web.Mvc;

namespace Inv.WebUI.Controllers
{//eslam 1 dec 2020
    public class GeneralReportsController : Controller
    {
        private ReportService MakeReport(ReportParameters p)
        {
            ReportService rep = new ReportService();

            rep.AddParameter<ReportParameters>("par", p);
            return rep;
        }
        /// <summary>
        /// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /// </summary>
        /// <returns></returns>
        public ReportService getStandardParameters()
        {
            //Models.SessionRecord sr = SessionManager.SessionRecord;
            ReportService rep = new ReportService();

            //sr.CompanyName = "";
            //sr.CompanyNameAr = "";
            // SystemEnvironment sys = new SystemEnvironment();

            //rep.AddParameter("CompCode", sr.CompCode);
            //rep.AddParameter("braCode", sr.BranchCode);
            //rep.AddParameter("LoginUser", sr.UserCode);
            //rep.AddParameter("ScreenLanguage", sr.ScreenLanguage);
            //rep.AddParameter("SystemCode", sr.SystemCode);
            //rep.AddParameter("SubSystemCode", sr.SubSystemCode);

            //rep.AddParameter("CompNameA", sr.CompanyNameAr);
            //rep.AddParameter("CompNameE", sr.CompanyName);

            //if (string.IsNullOrEmpty(sr.BranchName))
            //{
            //    rep.AddParameter("BraNameA", "");
            //    rep.AddParameter("BraNameE", "");
            //}
            //else
            //{
            //    rep.AddParameter("BraNameA", sr.BranchName);
            //    rep.AddParameter("BraNameE", sr.BranchName);
            //}


            return rep;
        }
        //mahroos adding new parameter 
        public ReportService getStandardParameters(StdParamters sr)
        {
            //Models.SessionRecord sr = SessionManager.SessionRecord;
            ReportService rep = new ReportService();

            //sr.CompanyName = "";
            //sr.CompanyNameAr = "";
            // SystemEnvironment sys = new SystemEnvironment();

            rep.AddParameter("BranchCode", sr.BranchCode);
            rep.AddParameter("LoginUser", sr.UserCode);
            rep.AddParameter("UserCode", sr.UserCode);
            rep.AddParameter("Tokenid", "HGFD-" + sr.Tokenid);
            rep.AddParameter("ScreenLanguage", sr.ScreenLanguage);
            rep.AddParameter("SystemCode", sr.SystemCode);
            rep.AddParameter("SubSystemCode", sr.SubSystemCode);
            rep.AddParameter("CompNameA", sr.CompNameA);
            rep.AddParameter("CompNameE", sr.CompNameE);
            rep.AddParameter("CompCode", sr.CompCode);

            if (string.IsNullOrEmpty(sr.BranchName))
            {
                rep.AddParameter("BraNameA", "");
                rep.AddParameter("BraNameE", "");
            }
            else
            {
                rep.AddParameter("BraNameA", sr.BranchName);
                rep.AddParameter("BraNameE", sr.BranchName);
            }


            return rep;
        }

        public JsonResult rptPaymentNote(Reportparam rp)
        {
            ReportService rep = getStandardParameters(rp);


            rep.AddParameter("TRId", rp.TRId);
            //rep.AddParameter("Type", rp.Type);
            string url = rep.GetReportUrl("KRpt_PaymentNote");


            return Shared.JsonObject(url);
        }
        //public JsonResult RSProc_RPT_FnPaymentList(PaymentRep rp)
        //{
        //    ReportService rep = getStandardParameters(rp);


        //    rep.AddParameter("RepType", rp.Type);
        //    rep.AddParameter("Status", rp.Status);
        //    rep.AddParameter("CustCode", rp.CustCode);
        //    rep.AddParameter("RentType", rp.RepType);
        //    rep.AddParameter("TrType", rp.TrType);
        //    rep.AddParameter("FromDate", rp.FromDate);
        //    rep.AddParameter("ToDate", rp.ToDate);
        //    rep.AddParameter("FromDateH", rp.FromDateH);
        //    rep.AddParameter("ToDateH", rp.ToDateH);


        //    string url = rep.GetReportUrl("R_RPT_FnPaymentList");


        //    return Shared.JsonObject(url);
        //}

        public JsonResult RPT_Test_(Reportparam rp)
        {
            ReportService rep = getStandardParameters(rp);


            //rep.AddParameter("RepType", rp.Type);
            //rep.AddParameter("Status", rp.Status);
            //rep.AddParameter("CustCode", rp.CustCode);
            //rep.AddParameter("RentType", rp.RepType);
            //rep.AddParameter("TrType", rp.TrType);
            //rep.AddParameter("FromDate", rp.FromDate);
            //rep.AddParameter("ToDate", rp.ToDate);
            //rep.AddParameter("FromDateH", rp.FromDateH);
            //rep.AddParameter("ToDateH", rp.ToDateH);


            string url = rep.GetReportUrl("RPT_Test");


            return Shared.JsonObject(url);
        }
        public JsonResult RPT_RecieveDemand_(Reportparam rp)
        {
            ReportService rep = getStandardParameters(rp);


            //rep.AddParameter("RepType", rp.Type);
            //rep.AddParameter("Status", rp.Status);
            //rep.AddParameter("CustCode", rp.CustCode);
            //rep.AddParameter("RentType", rp.RepType);
            //rep.AddParameter("TrType", rp.TrType);
            //rep.AddParameter("FromDate", rp.FromDate);
            //rep.AddParameter("ToDate", rp.ToDate);
            //rep.AddParameter("FromDateH", rp.FromDateH);
            //rep.AddParameter("ToDateH", rp.ToDateH);


            string url = rep.GetReportUrl("RPT_Test");


            return Shared.JsonObject(url);
        }
        //////////////////////////////////////////////////////////
        //printTransaction

        // print Recieptlist //IProc_Rpt_AccReceiptList 
        public JsonResult IProc_Rpt_AccReceiptList(RepFinancials rp)
        {
            ReportService rep = getStandardParameters(rp);

            rep.AddParameter("RepType", rp.RepType);
            rep.AddParameter("Status", rp.Status);
            rep.AddParameter("BoxId", rp.BoxId);
            rep.AddParameter("RecType", rp.RecType);
            rep.AddParameter("TrType", rp.TrType);
            rep.AddParameter("FromDate", rp.FromDate);
            rep.AddParameter("ToDate", rp.ToDate);
            rep.AddParameter("CashType", rp.CashType);
            if (rp.BnfID == null)
            {
                rp.BnfID = "";
            }

            rep.AddParameter("BnfID", rp.BnfID);
            if (rp.BnfDesc == null)
            {
                rp.BnfDesc = "";
            }

            rep.AddParameter("BnfDesc", rp.BnfDesc);
            rep.AddParameter("CashType", rp.CashType);


            //R_Rpt_AccReceiptList 
            string url = rep.GetReportUrl("R_Rpt_AccReceiptList");

            return Shared.JsonObject(url);
        }

        public JsonResult rptReceiptNote(RepFinancials rp)
        {
            ReportService rep = getStandardParameters(rp);

            rep.AddParameter("RepType", rp.Type);
            rep.AddParameter("TRId", rp.TRId);
            rep.AddParameter("Repdesign", rp.Repdesign);
            rep.AddParameter("slip", rp.slip);


            //rep.AddParameter("Type", rp.Type);//IProc_Prnt_AccReceive
            string url = rep.GetReportUrl("Rpt_Prnt_AccReceive");


            return Shared.JsonObject(url);
        }

        public JsonResult Rep_LnkVoucherList(RepFinancials rp)
        {
            ReportService rep = getStandardParameters(rp);
             
            rep.AddParameter("RepType", rp.RepType);
            rep.AddParameter("SystemCode", rp.SystemCode);
            rep.AddParameter("TrTypeSt", rp.TrTypeSt);
            rep.AddParameter("FromDate", rp.FromDate);
            rep.AddParameter("ToDate", rp.ToDate);
            rep.AddParameter("fromNum", rp.fromNum);
            rep.AddParameter("ToNum", rp.ToNum);

              
            string url = rep.GetReportUrl("Rep_LnkVoucherList");


            return Shared.JsonObject(url);
        }

        // print CustomerAdjustlist //IProc_Rep_AccAdjustList
        public JsonResult IProc_Rep_AccAdjustList(RepFinancials rp)
        {
            ReportService rep = getStandardParameters(rp);

            rep.AddParameter("RepType", rp.RepType);
            rep.AddParameter("Status", rp.Status);
            rep.AddParameter("AdjDebit", rp.AdjDebit);
            rep.AddParameter("AdjId", rp.AdjId);
            rep.AddParameter("CustomerID", rp.CustomerID);
            rep.AddParameter("VendorId", rp.VendorId);
            rep.AddParameter("TrType", rp.TrType);
            rep.AddParameter("FromDate", rp.FromDate);
            rep.AddParameter("ToDate", rp.ToDate);
            //R_Rpt_AccReceiptList 
            string url = rep.GetReportUrl("R_Rpt_AccAdjustList");

            return Shared.JsonObject(url);
        }
        //IProc_Prnt_AccAdjust
        public JsonResult rptAdjustNote(RepFinancials rp)
        {
            ReportService rep = getStandardParameters(rp);

            rep.AddParameter("RepType", rp.Type);
            rep.AddParameter("TRId", rp.TRId);
            rep.AddParameter("Repdesign", rp.Repdesign);
            //rep.AddParameter("Type", rp.Type);//IProc_Prnt_AccReceive
            string url = rep.GetReportUrl("Rpt_Prnt_AccAdjust");

            return Shared.JsonObject(url);
        }
        //IProc_Rpt_SlsInvoiceList
        public JsonResult IProc_Rpt_SlsInvoiceList(RepFinancials rp)
        {
            ReportService rep = getStandardParameters(rp);

            rep.AddParameter("RepType", rp.RepType);
            rep.AddParameter("Status", rp.Status);
            rep.AddParameter("SalesmanID", rp.SalesmanID);
            rep.AddParameter("CashType", rp.CashType);
            rep.AddParameter("CustomerID", rp.CustomerID);
            rep.AddParameter("VendorId", rp.VendorId);
            rep.AddParameter("OperationId", rp.OperationId);
            rep.AddParameter("TrType", rp.TrType);
            rep.AddParameter("FromDate", rp.FromDate);
            rep.AddParameter("ToDate", rp.ToDate);
            rep.AddParameter("Typ", rp.Typ);
            rep.AddParameter("src", rp.src);


            //R_Rpt_AccReceiptList 
            string url = rep.GetReportUrl("R_Rpt_SlsInvoiceList");

            return Shared.JsonObject(url);
        }
        public JsonResult IProc_Rpt_operationInvoiceList(RepFinancials rp)
        {
            ReportService rep = getStandardParameters(rp);

            rep.AddParameter("RepType", rp.RepType);
            rep.AddParameter("Status", rp.Status);
            rep.AddParameter("SalesmanID", rp.SalesmanID);
            rep.AddParameter("CashType", rp.CashType);
            rep.AddParameter("CustomerID", rp.CustomerID);
            rep.AddParameter("VendorId", rp.VendorId);
            rep.AddParameter("OperationId", rp.OperationId);
            rep.AddParameter("TrType", rp.TrType);
            rep.AddParameter("FromDate", rp.FromDate);
            rep.AddParameter("ToDate", rp.ToDate);
            rep.AddParameter("src", rp.src);


            //R_Rpt_AccReceiptList 
            string url = rep.GetReportUrl("R_Rpt_operationInvoiceList");

            return Shared.JsonObject(url);
        }
        public JsonResult IProc_Rpt_OperationList(RepFinancials rp)
        {
            ReportService rep = getStandardParameters(rp);

            rep.AddParameter("FromDate", rp.FromDate);
            rep.AddParameter("ToDate", rp.ToDate);
            rep.AddParameter("RepType", rp.RepType);
            rep.AddParameter("Status", rp.Status);
            rep.AddParameter("SalesmanID", rp.SalesmanID);
            rep.AddParameter("VendorId", rp.VendorId);
            rep.AddParameter("OperationId", rp.OperationId);

            //R_Rpt_AccReceiptList 
            string url = rep.GetReportUrl("Rpt_OperationList");

            return Shared.JsonObject(url);
        }
        public JsonResult IProc_Rpt_OperationExportList(RepFinancials rp)
        {
            ReportService rep = getStandardParameters(rp);

            rep.AddParameter("FromDate", rp.FromDate);
            rep.AddParameter("ToDate", rp.ToDate);
            rep.AddParameter("RepType", rp.RepType);
            rep.AddParameter("Status", rp.Status);
            rep.AddParameter("SalesmanID", rp.SalesmanID);
            rep.AddParameter("VendorId", rp.VendorId);
            rep.AddParameter("OperationId", rp.OperationId);

            //R_Rpt_AccReceiptList 
            string url = rep.GetReportUrl("Rpt_OperationExportList");

            return Shared.JsonObject(url);
        }


        public JsonResult IProc_Prnt_OperationCharges(RepFinancials rp)
        {
            ReportService rep = getStandardParameters(rp);

            rep.AddParameter("RepType", rp.RepType);
            rep.AddParameter("TRId", rp.TRId);
          

            //rep.AddParameter("Type", rp.Type);//IProc_Prnt_AccReceive
            string url = rep.GetReportUrl("Prnt_OperationCharges");

            return Shared.JsonObject(url);
        }
        public JsonResult rptInvoiceNote(RepFinancials rp)
        {
            ReportService rep = getStandardParameters(rp);

            rep.AddParameter("RepType", rp.Type);
            rep.AddParameter("TRId", rp.TRId);
            rep.AddParameter("Repdesign", rp.Repdesign);
            rep.AddParameter("typ", rp.Typ);
            rep.AddParameter("slip", rp.slip);
            rep.AddParameter("stat", rp.stat);

            //rep.AddParameter("Type", rp.Type);//IProc_Prnt_AccReceive
            string url = rep.GetReportUrl("Rpt_Prnt_SlsInvoice");

            return Shared.JsonObject(url);
        }
        public JsonResult Prnt_OperationInvoice(RepFinancials rp)
        {
            ReportService rep = getStandardParameters(rp);

            rep.AddParameter("RepType", rp.Type);
            rep.AddParameter("TRId", rp.TRId);
            rep.AddParameter("Repdesign", rp.Repdesign);
            rep.AddParameter("typ", rp.Typ);
            rep.AddParameter("slip", rp.slip);
            rep.AddParameter("stat", rp.stat);

            //rep.AddParameter("Type", rp.Type);//IProc_Prnt_AccReceive
            string url = rep.GetReportUrl("Rpt_Prnt_OperationInvoice");

            return Shared.JsonObject(url);
        }

        public JsonResult IProc_Prnt_OperationItems(RepFinancials rp)
        {
            ReportService rep = getStandardParameters(rp);


            rep.AddParameter("RepType", rp.RepType);
            rep.AddParameter("TRId", rp.TRId);

            //R_Rpt_AccReceiptList 
            string url = rep.GetReportUrl("Prnt_OperationItems");

            return Shared.JsonObject(url);
        }
        public JsonResult IProc_Rpt_AccCustomerAging(RepFinancials rp)
        {
            ReportService rep = getStandardParameters(rp);

            rep.AddParameter("RepType", rp.RepType);
            rep.AddParameter("FromDt", rp.FromDt);
            rep.AddParameter("CatId", rp.CatId);
            rep.AddParameter("Groupid", rp.Groupid);
            rep.AddParameter("CustomerID", rp.CustomerID);
            rep.AddParameter("Status", rp.Status);
            rep.AddParameter("BalType", rp.BalType);
            rep.AddParameter("Agtype", rp.Agtype); 

            string url = rep.GetReportUrl("Rpt_AccCustomerAging");

            return Shared.JsonObject(url);

        }
        public JsonResult IProc_Rpt_AccVendorAging(RepFinancials rp)
        {
            ReportService rep = getStandardParameters(rp);

            rep.AddParameter("RepType", rp.RepType);
            rep.AddParameter("FromDt", rp.FromDt);
            rep.AddParameter("CatId", rp.CatId);
            rep.AddParameter("Groupid", rp.Groupid);
            rep.AddParameter("CustomerID", rp.CustomerID);
            rep.AddParameter("Status", rp.Status);
            rep.AddParameter("BalType", rp.BalType);
            rep.AddParameter("Agtype", rp.Agtype);

            string url = rep.GetReportUrl("Rpt_AccVendorAging");

            return Shared.JsonObject(url);

        } 
        public JsonResult IProc_Prnt_OperationSalesmanItem(RepFinancials rp)
        {
            ReportService rep = getStandardParameters(rp);

            rep.AddParameter("RepType", rp.Type);
            rep.AddParameter("TRId", rp.TRId);
            rep.AddParameter("SalesmanID", rp.SalesmanID);


            //rep.AddParameter("Type", rp.Type);//IProc_Prnt_AccReceive
            string url = rep.GetReportUrl("Prnt_OperationSalesmanItem");

            return Shared.JsonObject(url);
        }

        public JsonResult IProc_Rep_OperationSum(RepFinancials rp)
        {
            ReportService rep = getStandardParameters(rp);

            rep.AddParameter("RepType", rp.Type);
            rep.AddParameter("TRId", rp.TRId); 

             string url = rep.GetReportUrl("Rep_OperationSum");

            return Shared.JsonObject(url);
        }


        public JsonResult IProc_Rep_OperationSumInternal(RepFinancials rp)
        {
            ReportService rep = getStandardParameters(rp);

            rep.AddParameter("RepType", rp.Type);
            rep.AddParameter("TRId", rp.TRId);

            string url = rep.GetReportUrl("Rep_OperationSumInternal");

            return Shared.JsonObject(url);
        }



        public JsonResult IProc_Rep_salesrecord(RepFinancials rp)
        {
            ReportService rep = getStandardParameters(rp);

            rep.AddParameter("RepType", rp.Type);
            rep.AddParameter("TRId", rp.TRId); 

             string url = rep.GetReportUrl("Rep_salesrecord");

            return Shared.JsonObject(url);
        }

        public JsonResult IProc_Prnt_OperationDeposit(RepFinancials rp)
        {
            ReportService rep = getStandardParameters(rp);

            rep.AddParameter("RepType", rp.Type);
            rep.AddParameter("TRId", rp.TRId);
            rep.AddParameter("SalesmanID", rp.SalesmanID);


            //rep.AddParameter("Type", rp.Type);//IProc_Prnt_AccReceive
            string url = rep.GetReportUrl("Prnt_OperationDeposit");

            return Shared.JsonObject(url);
        }
        public JsonResult rptInvoiceNoteRet(RepFinancials rp)
        {
            ReportService rep = getStandardParameters(rp);

            rep.AddParameter("RepType", rp.Type);
            rep.AddParameter("TRId", rp.TRId);
            rep.AddParameter("Repdesign", rp.Repdesign);
            rep.AddParameter("typ", rp.Typ);
            rep.AddParameter("slip", rp.slip);
            rep.AddParameter("stat", rp.stat);

            //rep.AddParameter("Type", rp.Type);//IProc_Prnt_AccReceive
            string url = rep.GetReportUrl("Rpt_Prnt_SlsInvReturn");

            return Shared.JsonObject(url);
        }
        ///IProc_Rpt_AccSlsCashInvoiceList
        public JsonResult IProc_Rpt_AccSlsCashInvoiceList(RepFinancials rp)
        {
            ReportService rep = getStandardParameters(rp);

            rep.AddParameter("RepType", rp.RepType);
            rep.AddParameter("FromDate", rp.FromDate);
            rep.AddParameter("ToDate", rp.ToDate);
            rep.AddParameter("MobileNo", rp.MobileNo);
            rep.AddParameter("SalesmanID", rp.SalesmanID);
            rep.AddParameter("PaymentType", rp.PaymentType);
            rep.AddParameter("CustomerID", rp.CustomerID);
            rep.AddParameter("CashBoxID", rp.CashBoxID);
            rep.AddParameter("TrType", rp.TrType);
            rep.AddParameter("Status", rp.Status);
            //R_Rpt_AccReceiptList 
            string url = rep.GetReportUrl("Rpt_AccSlsCashInvoiceList");

            return Shared.JsonObject(url);
        }
        ///IProc_Rpt_PurInvoiceList

        public JsonResult IProc_Rpt_PurReceiveList(RepFinancials rp)
        {
            ReportService rep = getStandardParameters(rp);

            rep.AddParameter("RepType", rp.RepType);
            rep.AddParameter("TrType", rp.TrType);
            rep.AddParameter("FromDate", rp.FromDate);
            rep.AddParameter("ToDate", rp.ToDate);
            rep.AddParameter("VendorId", rp.VendorId);
            rep.AddParameter("SalesmanID", rp.SalesmanID);
            rep.AddParameter("CashType", rp.CashType);
            rep.AddParameter("Status", rp.Status);

            //R_Rpt_AccReceiptList 
            string url = rep.GetReportUrl("Rpt_PurReceiveList");

            return Shared.JsonObject(url);
        }
        public JsonResult IProc_Rpt_VATSlsInvoiceList(RepFinancials rp)
        {
            ReportService rep = getStandardParameters(rp);

            rep.AddParameter("RepType", rp.RepType);
            rep.AddParameter("TrType", rp.TrType);
            rep.AddParameter("FromDate", rp.FromDate);
            rep.AddParameter("ToDate", rp.ToDate);
            rep.AddParameter("CustomerID", rp.CustomerID);
            rep.AddParameter("CashType", rp.CashType);
            rep.AddParameter("Status", rp.Status);

            //R_Rpt_AccReceiptList 
            string url = rep.GetReportUrl("Rpt_VATSlsInvoiceList");

            return Shared.JsonObject(url);
        }
        public JsonResult IProc_Prnt_PurReceive(RepFinancials rp)
        {
            ReportService rep = getStandardParameters(rp);

            rep.AddParameter("RepType", rp.Type);
            rep.AddParameter("Repdesign", rp.Repdesign);
            rep.AddParameter("TRId", rp.TRId);


            string url = rep.GetReportUrl("Rpt_Prnt_PurReceive");

            return Shared.JsonObject(url);
        }
       

        public JsonResult IProc_Prnt_PurReceiveRet(RepFinancials rp)
        {
            ReportService rep = getStandardParameters(rp);

            rep.AddParameter("RepType", rp.Type);
            rep.AddParameter("Repdesign", rp.Repdesign);
            rep.AddParameter("TRId", rp.TRId);


            string url = rep.GetReportUrl("Prnt_PurReceiveRet");

            return Shared.JsonObject(url);
        }

         public JsonResult IProc_Prnt_PurReceivePrice(RepFinancials rp)
        {
            ReportService rep = getStandardParameters(rp);

            rep.AddParameter("RepType", rp.Type);
            rep.AddParameter("Repdesign", rp.Repdesign);
            rep.AddParameter("TRId", rp.TRId);


            string url = rep.GetReportUrl("Prnt_PurReceivePrice");

            return Shared.JsonObject(url);
        }


        //-
        public JsonResult IProc_Prnt_VATPurReturn(RepFinancials rp)
        {
            ReportService rep = getStandardParameters(rp);

            rep.AddParameter("RepType", rp.Type);
            rep.AddParameter("TRId", rp.TRId);

            //rep.AddParameter("Type", rp.Type);//IProc_Prnt_AccReceive
            string url = rep.GetReportUrl("Prnt_VATPurReturn");

            return Shared.JsonObject(url);
        }


        public JsonResult IProc_Prnt_SlsInvoice(RepFinancials rp)
        {
            ReportService rep = getStandardParameters(rp);

            rep.AddParameter("RepType", rp.Type);
            rep.AddParameter("TRId", rp.TRId);
            rep.AddParameter("Repdesign", rp.Repdesign);
            rep.AddParameter("typ", rp.Typ);
            rep.AddParameter("slip", rp.slip);
            //rep.AddParameter("Type", rp.Type);//IProc_Prnt_AccReceive
            string url = rep.GetReportUrl("Rpt_Prnt_SlsInvoicepr");

            return Shared.JsonObject(url);
        }




        public JsonResult IProc_Rep_AccCustomerList(RepFinancials rp)
        {
            ReportService rep = getStandardParameters(rp);

            rep.AddParameter("RepType", rp.RepType);
            rep.AddParameter("CatId", rp.CatId);
            rep.AddParameter("Groupid", rp.Groupid);
            rep.AddParameter("SalesmanID", rp.SalesmanID);
            rep.AddParameter("IsCredit", rp.IsCredit);
            rep.AddParameter("BalStatus", rp.BalStatus);



            //R_Rpt_AccReceiptList 
            string url = rep.GetReportUrl("Rpt_AccCustomerList");

            return Shared.JsonObject(url);

        }



        public JsonResult IProc_Rep_AccVendorList(RepFinancials rp)
        {
            ReportService rep = getStandardParameters(rp);

            rep.AddParameter("RepType", rp.RepType);
            rep.AddParameter("CatId", rp.CatId);
            rep.AddParameter("Groupid", rp.Groupid);
            rep.AddParameter("IsCredit", rp.IsCredit);
            rep.AddParameter("BalStatus", rp.BalStatus);
            rep.AddParameter("VendType", rp.VendType);


            //R_Rpt_AccReceiptList 
            string url = rep.GetReportUrl("Rpt_AccVendorList");

            return Shared.JsonObject(url);

        }
        // كشف حساب عميل ملخص
        public JsonResult IProc_Rpt_AccCustomerSummary(RepFinancials rp)
        {
            ReportService rep = getStandardParameters(rp);

            rep.AddParameter("RepType", rp.RepType);
            rep.AddParameter("FromDate", rp.FromDate);
            rep.AddParameter("ToDate", rp.ToDate);
            rep.AddParameter("CatId", rp.CatId);
            rep.AddParameter("CustomerID", rp.CustomerID);
            rep.AddParameter("Groupid", rp.Groupid);
            rep.AddParameter("Status", rp.Status);
            rep.AddParameter("BalType", rp.BalType);
            rep.AddParameter("SalesmanID", rp.SalesmanID);
            rep.AddParameter("check", rp.check);
            rep.AddParameter("orderby", rp.orderby);
            rep.AddParameter("CashType", rp.CashType);


            string url = rep.GetReportUrl("Rpt_AccCustomerSummary");

            return Shared.JsonObject(url);

        }

        // كشف حساب عميل تفصيلي
        public JsonResult IProc_Rpt_AccCustomerDetail(RepFinancials rp)
        {
            ReportService rep = getStandardParameters(rp);

            rep.AddParameter("RepType", rp.RepType);
            rep.AddParameter("FromDate", rp.FromDate);
            rep.AddParameter("ToDate", rp.ToDate);
            rep.AddParameter("CatId", rp.CatId);
            rep.AddParameter("CustomerID", rp.CustomerID);
            rep.AddParameter("Groupid", rp.Groupid);
            rep.AddParameter("Status", rp.Status);
            rep.AddParameter("BalType", rp.BalType);
            rep.AddParameter("SalesmanID", rp.SalesmanID);
            rep.AddParameter("check", rp.check);
            rep.AddParameter("CashType", rp.CashType);

            string url = rep.GetReportUrl("Rpt_AccCustomerDetail");

            return Shared.JsonObject(url);

        }
        // كشف حساب عميل استاذ عملاء
        public JsonResult IProc_Rpt_AccCustomerLedger(RepFinancials rp)
        {
            ReportService rep = getStandardParameters(rp);

            rep.AddParameter("RepType", rp.RepType);
            rep.AddParameter("FromDate", rp.FromDate);
            rep.AddParameter("ToDate", rp.ToDate);
            rep.AddParameter("CatId", rp.CatId);
            rep.AddParameter("CustomerID", rp.CustomerID);
            rep.AddParameter("Groupid", rp.Groupid);
            rep.AddParameter("Status", rp.Status);
            rep.AddParameter("BalType", rp.BalType);
            rep.AddParameter("SalesmanID", rp.SalesmanID);
            rep.AddParameter("check", rp.check);
            rep.AddParameter("orderby", rp.orderby);
            string url = rep.GetReportUrl("Rpt_AccCustomerLedger");

            return Shared.JsonObject(url);

        }

        // كشف حساب مورد تفصيلي
        public JsonResult IProc_Rpt_AccVendorDetail(RepFinancials rp)
        {
            ReportService rep = getStandardParameters(rp);

            rep.AddParameter("RepType", rp.RepType);
            rep.AddParameter("FromDate", rp.FromDate);
            rep.AddParameter("ToDate", rp.ToDate);
            rep.AddParameter("CatId", rp.CatId);
            rep.AddParameter("CustomerID", rp.CustomerID);
            rep.AddParameter("Groupid", rp.Groupid);
            rep.AddParameter("Status", rp.Status);
            rep.AddParameter("BalType", rp.BalType);
            rep.AddParameter("VendorId", rp.VendorId);
            rep.AddParameter("VendType", rp.VendType);
            rep.AddParameter("CashType", rp.CashType);
        

            string url = rep.GetReportUrl("Rpt_AccVendorDetail");

            return Shared.JsonObject(url);

        }

        // كشف حساب مورد ملخص
        public JsonResult IProc_Rpt_AccVendorSummary(RepFinancials rp)
        {
            ReportService rep = getStandardParameters(rp);

            rep.AddParameter("RepType", rp.RepType);
            rep.AddParameter("FromDate", rp.FromDate);
            rep.AddParameter("ToDate", rp.ToDate);
            rep.AddParameter("CatId", rp.CatId);
            rep.AddParameter("CustomerID", rp.CustomerID);
            rep.AddParameter("Groupid", rp.Groupid);
            rep.AddParameter("Status", rp.Status);
            rep.AddParameter("BalType", rp.BalType);
            rep.AddParameter("VendorId", rp.VendorId);
            rep.AddParameter("VendType", rp.VendType);
            rep.AddParameter("orderby", rp.orderby);
            rep.AddParameter("CashType", rp.CashType);

            string url = rep.GetReportUrl("Rpt_AccVendorSummary");

            return Shared.JsonObject(url);

        }
        // كشف حساب   استاذ الموردين
        public JsonResult IProc_Rpt_AccVendorLedger(RepFinancials rp)
        {
            ReportService rep = getStandardParameters(rp);
            rep.AddParameter("RepType", rp.RepType);
            rep.AddParameter("FromDate", rp.FromDate);
            rep.AddParameter("ToDate", rp.ToDate);
            rep.AddParameter("CatId", rp.CatId);
            rep.AddParameter("CustomerID", rp.CustomerID);
            rep.AddParameter("Groupid", rp.Groupid);
            rep.AddParameter("Status", rp.Status);
            rep.AddParameter("BalType", rp.BalType);
            rep.AddParameter("VendorId", rp.VendorId);
            rep.AddParameter("VendType", rp.VendType);
            rep.AddParameter("orderby", rp.orderby);
            string url = rep.GetReportUrl("Rpt_AccVendorLedger");
            return Shared.JsonObject(url);

        }
        // كشف حركة المخزون
        public JsonResult IProc_Rpt_ItemStockSummary(RepFinancials rp)
        {
            ReportService rep = getStandardParameters(rp);

            rep.AddParameter("RepType", rp.RepType);
            rep.AddParameter("FromDate", rp.FromDate);
            rep.AddParameter("ToDate", rp.ToDate);
            rep.AddParameter("CatId", rp.CatId);
            rep.AddParameter("ItemFamId", rp.ItemFamId);
            rep.AddParameter("ItemID", rp.ItemID);
            rep.AddParameter("check", rp.check);
            rep.AddParameter("Status", rp.Status);
            rep.AddParameter("BalType", rp.BalType);

            string url = rep.GetReportUrl("Rpt_ItemStockSummary");

            return Shared.JsonObject(url);

        }
        // كشف قيمة المخزون
        public JsonResult IProc_Rpt_ItemStockValue(RepFinancials rp)
        {
            ReportService rep = getStandardParameters(rp);

            rep.AddParameter("RepType", rp.RepType);
            rep.AddParameter("FromDate", rp.FromDate);
            rep.AddParameter("ToDate", rp.ToDate);
            rep.AddParameter("CatId", rp.CatId);
            rep.AddParameter("ItemFamId", rp.ItemFamId);
            rep.AddParameter("ItemID", rp.ItemID);
            rep.AddParameter("check", rp.check);
            rep.AddParameter("Status", rp.Status);


            string url = rep.GetReportUrl("Rpt_ItemStockValue");

            return Shared.JsonObject(url);

        }
        //   كشف حركة المخزون تفصيلي
        public JsonResult IProc_Rpt_ItemStockDetail(RepFinancials rp)
        {
            ReportService rep = getStandardParameters(rp);

            rep.AddParameter("RepType", rp.RepType);
            rep.AddParameter("FromDate", rp.FromDate);
            rep.AddParameter("ToDate", rp.ToDate);
            rep.AddParameter("CatId", rp.CatId);
            rep.AddParameter("ItemFamId", rp.ItemFamId);
            rep.AddParameter("ItemID", rp.ItemID);
            rep.AddParameter("check", rp.check);
            rep.AddParameter("Status", rp.Status);
            rep.AddParameter("BalType", rp.BalType);
            rep.AddParameter("FromBra", rp.FromBra);

            string url = rep.GetReportUrl("Rpt_ItemStockDetail");

            return Shared.JsonObject(url);

        }
        // كشف ايراد العمليات
        public JsonResult IProc_Rpt_ItemStockIncome(RepFinancials rp)
        {
            ReportService rep = getStandardParameters(rp);

            rep.AddParameter("RepType", rp.RepType);
            rep.AddParameter("FromDate", rp.FromDate);
            rep.AddParameter("ToDate", rp.ToDate);
            rep.AddParameter("CatId", rp.CatId);
            rep.AddParameter("ItemFamId", rp.ItemFamId);
            rep.AddParameter("ItemID", rp.ItemID);
            rep.AddParameter("check", rp.check);
            rep.AddParameter("Status", rp.Status);


            string url = rep.GetReportUrl("Rpt_ItemStockIncome");

            return Shared.JsonObject(url);

        }
        // كشف التقرير المالى
        public JsonResult AProc_Rpt_GLFinancialStatment(RepFinancials rp)
        {
            ReportService rep = getStandardParameters(rp);

            rep.AddParameter("RepType", rp.RepType);
            rep.AddParameter("FromDate", rp.FromDate);
            rep.AddParameter("ToDate", rp.ToDate);
            rep.AddParameter("cc_code", rp.cc_code);
            rep.AddParameter("exzero", rp.exzero);
            rep.AddParameter("Level", rp.Level);
            rep.AddParameter("IsAuthVchr", rp.IsAuthVchr);
            rep.AddParameter("IsNewVchr", rp.IsNewVchr);
            rep.AddParameter("Typ", rp.Typ);
            rep.AddParameter("check", rp.check);


            // string  url = rep.GetReportUrl("Rpt_GLFinancialStatment_Lndscp"); 
            string url = "";
            if (rp.check == 0)
                url = rep.GetReportUrl("Rpt_GLFinancialStatment");
            else if (rp.check == 1)
                url = rep.GetReportUrl("Rpt_GLFinancialStatment_Lndscp");


            return Shared.JsonObject(url);

        }
        // كشف حساب  دفتر الاستاذ العام
        public JsonResult AProc_Rpt_GLGeneralLedger(RepFinancials rp)
        {
            ReportService rep = getStandardParameters(rp);

            rep.AddParameter("RepType", rp.RepType);
            rep.AddParameter("FromDate", rp.FromDate);
            rep.AddParameter("ToDate", rp.ToDate);
            rep.AddParameter("cc_code", rp.cc_code);
            rep.AddParameter("AccCode", rp.AccCode);
            rep.AddParameter("IsAuthVchr", rp.IsAuthVchr);
            rep.AddParameter("IsNewVchr", rp.IsNewVchr);
            rep.AddParameter("IncludeInvTR", rp.IncludeInvTR);
            rep.AddParameter("OpenType", rp.OpenType);
            rep.AddParameter("PrdType", rp.PrdType);
            rep.AddParameter("EndType", rp.EndType);


            string url = rep.GetReportUrl("Rpt_GLGeneralLedger");

            return Shared.JsonObject(url);

        } 
        // كشف حساب 
        public JsonResult AProc_Rpt_GLAccountStatment(RepFinancials rp)
        {
            ReportService rep = getStandardParameters(rp);

            rep.AddParameter("RepType", rp.RepType);
            rep.AddParameter("FromDate", rp.FromDate);
            rep.AddParameter("ToDate", rp.ToDate);
            rep.AddParameter("cc_code", rp.cc_code);
            rep.AddParameter("fromacc", rp.fromacc);
            rep.AddParameter("toacc", rp.toacc);
            rep.AddParameter("IsAuthVchr", rp.IsAuthVchr);
            rep.AddParameter("IsNewVchr", rp.IsNewVchr);
            rep.AddParameter("exzero", rp.exzero);
            rep.AddParameter("IncludeInvTR", rp.IncludeInvTR);


            string url = rep.GetReportUrl("Rpt_GLAccountStatment");

            return Shared.JsonObject(url);

        }
        // كشف حساب 
        public JsonResult AProc_Rpt_JournalVoucherList(RepFinancials rp)
        {
            ReportService rep = getStandardParameters(rp);

            rep.AddParameter("RepType", rp.RepType);
            rep.AddParameter("FromDate", rp.FromDate);
            rep.AddParameter("ToDate", rp.ToDate);
            rep.AddParameter("Status", rp.Status);
            rep.AddParameter("VchrSource", rp.VchrSource);
            rep.AddParameter("VchrType", rp.VchrType);


            string url = rep.GetReportUrl("Rpt_JournalVoucherList");

            return Shared.JsonObject(url);

        }
        public JsonResult AProc_Prnt_JournalVoucher(RepFinancials rp)
        {
            ReportService rep = getStandardParameters(rp);

            rep.AddParameter("RepType", rp.RepType);
            rep.AddParameter("TRId", rp.TRId);
            


            string url = rep.GetReportUrl("Prnt_JournalVoucher");

            return Shared.JsonObject(url);

        }
        public JsonResult IProc_Rpt_StkAdjustList(RepFinancials rp)
        {
            ReportService rep = getStandardParameters(rp);

            rep.AddParameter("RepType", rp.RepType);
            rep.AddParameter("TrType", rp.TrType);
            rep.AddParameter("FromDate", rp.FromDate);
            rep.AddParameter("ToDate", rp.ToDate);
            rep.AddParameter("storeID", rp.storeID);
            rep.AddParameter("Status", rp.Status);

            string url = rep.GetReportUrl("Rpt_StkAdjustList");

            return Shared.JsonObject(url);

        }
        public JsonResult IProc_Rpt_StkOpenList(RepFinancials rp)
        {
            ReportService rep = getStandardParameters(rp);

            rep.AddParameter("RepType", rp.RepType);
            rep.AddParameter("TrType", rp.TrType);
            rep.AddParameter("FromDate", rp.FromDate);
            rep.AddParameter("ToDate", rp.ToDate);
            rep.AddParameter("storeID", rp.storeID);
            rep.AddParameter("Status", rp.Status);

            string url = rep.GetReportUrl("Rpt_StkOpenList");

            return Shared.JsonObject(url);

        }
        public JsonResult IProc_Rpt_VATPurInvoiceList(RepFinancials rp)
        {
            ReportService rep = getStandardParameters(rp);

            rep.AddParameter("RepType", rp.RepType);
            rep.AddParameter("FromDate", rp.FromDate);
            rep.AddParameter("ToDate", rp.ToDate);
            rep.AddParameter("ISimport", rp.ISimport);
            rep.AddParameter("CashType", rp.CashType);
            rep.AddParameter("Status", rp.Status);

            string url = rep.GetReportUrl("Rpt_VATPurInvoiceList");

            return Shared.JsonObject(url);

        }
        public JsonResult IProc_Rpt_VATPurReturnList(RepFinancials rp)
        {
            ReportService rep = getStandardParameters(rp);

            rep.AddParameter("RepType", rp.RepType);
            rep.AddParameter("FromDate", rp.FromDate);
            rep.AddParameter("ToDate", rp.ToDate);
            rep.AddParameter("VendorId", rp.VendorId);
            rep.AddParameter("CashType", rp.CashType);
            rep.AddParameter("Status", rp.Status);

            string url = rep.GetReportUrl("Rpt_VATPurReturnList");

            return Shared.JsonObject(url);

        }
        public JsonResult IProc_Prnt_VATPurInvoice(RepFinancials rp)
        {
            ReportService rep = getStandardParameters(rp);

            rep.AddParameter("RepType", rp.Type);
            rep.AddParameter("Repdesign", rp.Repdesign);
            rep.AddParameter("TRId", rp.TRId);


            string url = rep.GetReportUrl("Prnt_VATPurInvoice");

            return Shared.JsonObject(url);
        }
      

        public JsonResult IProc_Rpt_StkTransferList(RepFinancials rp)
        {
            ReportService rep = getStandardParameters(rp);

            rep.AddParameter("RepType", rp.RepType);
            rep.AddParameter("TrType", rp.TrType);
            rep.AddParameter("TfType", rp.TfType);
            rep.AddParameter("FromDate", rp.FromDate);
            rep.AddParameter("ToDate", rp.ToDate);
            rep.AddParameter("FromBra", rp.FromBra);
            rep.AddParameter("ToBra", rp.ToBra);
            rep.AddParameter("FromstoreID", rp.FromstoreID);
            rep.AddParameter("ToStoreID", rp.ToStoreID);
            rep.AddParameter("Status", rp.Status);

            string url = rep.GetReportUrl("Rpt_StkTransferListdirect");

            return Shared.JsonObject(url);

        }
        public JsonResult IProc_Rpt_PurPurchaseOrderList(RepFinancials rp)
        {
            ReportService rep = getStandardParameters(rp);

            rep.AddParameter("RepType", rp.RepType);
            rep.AddParameter("FromDate", rp.FromDate);
            rep.AddParameter("ToDate", rp.ToDate);
            rep.AddParameter("VendorId", rp.VendorId);
            rep.AddParameter("SalesmanID", rp.SalesmanID);
            rep.AddParameter("CashType", rp.CashType);
            rep.AddParameter("Status", rp.Status);

            //R_Rpt_AccReceiptList 
            string url = rep.GetReportUrl("Rpt_PurPurchaseOrderList");

            return Shared.JsonObject(url);
        }
        public JsonResult IProc_Prnt_PurPurchaseOrder(RepFinancials rp)
        {
            ReportService rep = getStandardParameters(rp);

            rep.AddParameter("RepType", rp.Type);
            rep.AddParameter("TRId", rp.TRId);


            string url = rep.GetReportUrl("Prnt_PurPurchaseOrder");

            return Shared.JsonObject(url);
        }
        public JsonResult IProc_Prnt_StkTransfer(RepFinancials rp)
        {
            ReportService rep = getStandardParameters(rp);

            rep.AddParameter("RepType", rp.Type);
            rep.AddParameter("TRId", rp.TRId);
            //rep.AddParameter("Type", rp.Type);//IProc_Prnt_AccReceive
            string url = rep.GetReportUrl("Prnt_StkTransfer");

            return Shared.JsonObject(url);
        }
        public JsonResult IProc_Prnt_StkAdjust(RepFinancials rp)
        {
            ReportService rep = getStandardParameters(rp);

            rep.AddParameter("RepType", rp.Type);
            rep.AddParameter("TRId", rp.TRId);
            //rep.AddParameter("Type", rp.Type);//IProc_Prnt_AccReceive
            string url = rep.GetReportUrl("Prnt_StkAdjust");

            return Shared.JsonObject(url);
        }
        public JsonResult IProc_Rpt_OerationTFList(RepFinancials rp)
        {
            ReportService rep = getStandardParameters(rp);

            rep.AddParameter("RepType", rp.RepType);
            rep.AddParameter("FromDate", rp.FromDate);
            rep.AddParameter("ToDate", rp.ToDate);
            rep.AddParameter("OperationId", rp.OperationId);
            rep.AddParameter("FromSls", rp.FromSls);
            rep.AddParameter("ToSls", rp.ToSls);
            rep.AddParameter("Status", rp.Status);

            //R_Rpt_AccReceiptList 
            string url = rep.GetReportUrl("IProc_Rpt_OerationTFList");

            return Shared.JsonObject(url);
        }
        public JsonResult IProc_Prnt_OerationTf(RepFinancials rp)
        {
            ReportService rep = getStandardParameters(rp);

            rep.AddParameter("RepType", rp.Type);
            rep.AddParameter("TRId", rp.TRId);
            //rep.AddParameter("Type", rp.Type);//IProc_Prnt_AccReceive
            string url = rep.GetReportUrl("Prnt_OerationTf");

            return Shared.JsonObject(url);
        }
        public JsonResult IProc_Prnt_VATSlsInvoice(RepFinancials rp)
        {
            ReportService rep = getStandardParameters(rp);

            rep.AddParameter("RepType", rp.RepType);
            rep.AddParameter("TRId", rp.TRId);
            rep.AddParameter("slip", rp.slip);
            rep.AddParameter("TrType", rp.TrType);
            
            string url = rep.GetReportUrl("Prnt_VATSlsInvoice");

            return Shared.JsonObject(url);
        }
        public JsonResult IProc_Prnt_VATSlsInvoicePriceshow(RepFinancials rp)
        {
            ReportService rep = getStandardParameters(rp);

            rep.AddParameter("RepType", rp.RepType);
            rep.AddParameter("TRId", rp.TRId);
            rep.AddParameter("slip", rp.slip);
            rep.AddParameter("Typ", rp.Typ); 
       
            string url = rep.GetReportUrl("Prnt_VATSlsInvoice");

            return Shared.JsonObject(url);
        }


        // كشف حساب مجمع تفصيلي
        public JsonResult IProc_Rpt_AccVendorCollDetail(RepFinancials rp)
        {
            ReportService rep = getStandardParameters(rp);

            rep.AddParameter("RepType", rp.RepType);
            rep.AddParameter("FromDate", rp.FromDate);
            rep.AddParameter("ToDate", rp.ToDate);
            rep.AddParameter("CatId", rp.CatId);
            rep.AddParameter("VendorId", rp.VendorId);
            rep.AddParameter("Groupid", rp.Groupid);
            rep.AddParameter("Status", rp.Status);
            rep.AddParameter("BalType", rp.BalType);
             rep.AddParameter("VendType", rp.VendType); 

            string  url = rep.GetReportUrl("Rpt_AccVendorCollDetail"); 
         

            return Shared.JsonObject(url);

        } // كشف حساب مجمع ملخص
        public JsonResult IProc_Rpt_AccVendorCollSummary(RepFinancials rp)
        {
            ReportService rep = getStandardParameters(rp);

            rep.AddParameter("RepType", rp.RepType);
            rep.AddParameter("FromDate", rp.FromDate);
            rep.AddParameter("ToDate", rp.ToDate);
            rep.AddParameter("CatId", rp.CatId);
            rep.AddParameter("VendorId", rp.VendorId);
            rep.AddParameter("Groupid", rp.Groupid);
            rep.AddParameter("Status", rp.Status);
            rep.AddParameter("BalType", rp.BalType);
             rep.AddParameter("VendType", rp.VendType);

            string  url = rep.GetReportUrl("Rpt_AccVendorCollSummary");
         

            return Shared.JsonObject(url);

        }
        public JsonResult IProc_Rpt_VatSalesSummary(RepFinancials rp)
        {
             ReportService rep = getStandardParameters(rp);

            rep.AddParameter("RepType", rp.RepType);
            rep.AddParameter("FromDate", rp.FromDate);
            rep.AddParameter("ToDate", rp.ToDate);
            rep.AddParameter("FromBra", rp.FromBra);
            rep.AddParameter("CatId", rp.CatId);
            rep.AddParameter("ItemID", rp.ItemID);
            rep.AddParameter("Status", rp.Status);
            rep.AddParameter("TrType", rp.TrType);
            rep.AddParameter("check", rp.check);
            rep.AddParameter("cc_code", rp.cc_code);
            rep.AddParameter("CustomercatID", rp.CustomercatID);
            rep.AddParameter("CustomerGrpID", rp.CustomerGrpID);
            rep.AddParameter("CustomerID", rp.CustomerID);
            rep.AddParameter("stat", rp.stat);
            string url = "";
            if (rp.check==1)
            {
                url = rep.GetReportUrl("Rpt_VatSalesSummary");
            }
            else
            {
                url = rep.GetReportUrl("Rpt_VatSalesDetail");

            }
           
         

            return Shared.JsonObject(url);

        }

        public JsonResult IProc_Rpt_VatPurchaseSummary(RepFinancials rp)
        {

            ReportService rep = getStandardParameters(rp);

            rep.AddParameter("RepType", rp.RepType);
            rep.AddParameter("FromDate", rp.FromDate);
            rep.AddParameter("ToDate", rp.ToDate);
            rep.AddParameter("FromBra", rp.FromBra);
            rep.AddParameter("ISimport", rp.ISimport);
            rep.AddParameter("CatId", rp.CatId);
            rep.AddParameter("ItemID", rp.ItemID);
            rep.AddParameter("Status", rp.Status);
            rep.AddParameter("check", rp.check);
            rep.AddParameter("cc_code", rp.cc_code);
            rep.AddParameter("cusCatID", rp.cusCatID);
            rep.AddParameter("cusGroupid", rp.cusGroupid);
            rep.AddParameter("cusid", rp.cusid);
            rep.AddParameter("SLStype", rp.SLStype);
            rep.AddParameter("stat", rp.stat);
            rep.AddParameter("TrType", rp.TrType);
            string url = "";
            if (rp.check == 1)
            {
                 url = rep.GetReportUrl("Rpt_VatPurchaseSummary");
            }
            else
            {
                url = rep.GetReportUrl("Rpt_VatPurchaseDetail");

            }



            return Shared.JsonObject(url);

        }

        public JsonResult AProc_Rpt_CashVoucherList(RepFinancials rp)
        {

            ReportService rep = getStandardParameters(rp);

            rep.AddParameter("RepType", rp.RepType);
            rep.AddParameter("FromDate", rp.FromDate);
            rep.AddParameter("ToDate", rp.ToDate);
            rep.AddParameter("PaymentType", rp.PaymentType);
            rep.AddParameter("VchrType", rp.VchrType);
            rep.AddParameter("TrType", rp.TrType);
            rep.AddParameter("Status", rp.Status);
             
            string  url = rep.GetReportUrl("Rpt_CashVoucherList");
          

            return Shared.JsonObject(url);

        }
        public JsonResult AProc_Prnt_CashVoucher(RepFinancials rp)
        {

            ReportService rep = getStandardParameters(rp);

            rep.AddParameter("RepType", rp.RepType);
            rep.AddParameter("Typ", rp.Typ);
            rep.AddParameter("TfType", rp.TfType);
            rep.AddParameter("TRId", rp.TRId);
             
            string  url = rep.GetReportUrl("Prnt_CashVoucher");
          

            return Shared.JsonObject(url);

        }

        public JsonResult IProc_Rpt_VATListSummary(RepFinancials rp)
        {
            ReportService rep = getStandardParameters(rp);

            rep.AddParameter("comp", rp.CompCode);
            rep.AddParameter("bra", rp.BranchCode);
            rep.AddParameter("CompNameA", rp.CompNameA);
            rep.AddParameter("CompNameE", rp.CompNameE);
            rep.AddParameter("BraNameA", rp.BranchCode);
            rep.AddParameter("BraNameE", rp.BranchCode);
            
            rep.AddParameter("FromDate", rp.FromDate);
            rep.AddParameter("ToDate", rp.ToDate);
            rep.AddParameter("LoginUser", rp.UserCode);
            rep.AddParameter("RepType", rp.RepType);
            rep.AddParameter("TrType", rp.TrType);
          //  rep.AddParameter("Status", rp.Status);
           
            rep.AddParameter("VatBraCode", rp.VatBraCode);
            rep.AddParameter("SysCode", rp.SysCode);
            rep.AddParameter("TransCode", rp.TransCode);
            rep.AddParameter("Vattype", rp.Vattype);
            rep.AddParameter("Groupid", rp.Groupid);
         
            string url = "";
           
                url = rep.GetReportUrl("Rpt_VATListSummary");
            



            return Shared.JsonObject(url);

        }

        public JsonResult IProc_Rpt_VATListDetail(RepFinancials rp)
        {
            ReportService rep = getStandardParameters(rp);

            rep.AddParameter("comp", rp.CompCode);
            rep.AddParameter("bra", rp.BranchCode);
            rep.AddParameter("CompNameA", rp.CompNameA);
            rep.AddParameter("CompNameE", rp.CompNameE);
            rep.AddParameter("BraNameA", rp.BranchCode);
            rep.AddParameter("BraNameE", rp.BranchCode);

            rep.AddParameter("FromDate", rp.FromDate);
            rep.AddParameter("ToDate", rp.ToDate);
            rep.AddParameter("LoginUser", rp.UserCode);
            rep.AddParameter("RepType", rp.RepType);
            rep.AddParameter("TrType", rp.TrType);
          

            rep.AddParameter("VatBraCode", rp.VatBraCode);
            rep.AddParameter("SysCode", rp.SysCode);
            rep.AddParameter("TransCode", rp.TransCode);
            rep.AddParameter("Vattype", rp.Vattype);
            rep.AddParameter("check", rp.check);


            string url = "";
           if(rp.check==2)
                url = rep.GetReportUrl("Rpt_VATListDetail");
           else if (rp.check == 1)
                url = rep.GetReportUrl("Rpt_VATListDetail_Lndscp");

            


            return Shared.JsonObject(url);

        }
        public JsonResult AProc_Rpt_GLDtCCenterStatmentSummary(RepFinancials rp)
        {
            ReportService rep = getStandardParameters(rp);

             
            rep.AddParameter("FromDate", rp.FromDate);
            rep.AddParameter("ToDate", rp.ToDate); 
            rep.AddParameter("RepType", rp.RepType);
            rep.AddParameter("dtccCode", rp.dtccCode);
            rep.AddParameter("AccCode", rp.AccCode);
            rep.AddParameter("exzero", rp.exzero);
            rep.AddParameter("IsNewVchr", rp.IsNewVchr);
            rep.AddParameter("IsAuthVchr", rp.IsAuthVchr);
            rep.AddParameter("check", rp.check); 
            rep.AddParameter("TrType", rp.TrType); 
           
            
         
            string url = "";
            if (rp.check == 1)
            {
                url = rep.GetReportUrl("Rpt_GLDtCCenterStatmentSummary");
            }
            else
            {
                url = rep.GetReportUrl("Rpt_GLDtCCenterStatmentDetail");

            }



            return Shared.JsonObject(url);

        }

        public JsonResult IProc_Prnt_VATReport(RepFinancials rp)
        {
            ReportService rep = getStandardParameters(rp);

            rep.AddParameter("comp", rp.CompCode);
            rep.AddParameter("bra", rp.BranchCode);
            rep.AddParameter("CompNameA", rp.CompNameA);
            rep.AddParameter("CompNameE", rp.CompNameE);
            rep.AddParameter("BraNameA", rp.BranchCode);
            rep.AddParameter("BraNameE", rp.BranchCode);
            rep.AddParameter("LoginUser", rp.UserCode);
            rep.AddParameter("RepType", rp.RepType);
            rep.AddParameter("vatyear", rp.vatyear);
            rep.AddParameter("prdcode", rp.prdcode);
          

            string url = "";

            url = rep.GetReportUrl("Prnt_VATReport");




            return Shared.JsonObject(url);

        }

        public JsonResult IProc_Rpt_AccBoxSummary(RepFinancials rp)
        {
            ReportService rep = getStandardParameters(rp);

            rep.AddParameter("RepType", rp.RepType);
            rep.AddParameter("FromDate", rp.FromDate);
            rep.AddParameter("ToDate", rp.ToDate);
            rep.AddParameter("BoxId", rp.BoxId);
            rep.AddParameter("Status", rp.Status);
            rep.AddParameter("CashType", rp.CashType); 

            string url = rep.GetReportUrl("Rpt_AccBoxSummary");

            return Shared.JsonObject(url);

        }

        public JsonResult IProc_Rpt_AccBankSummary(RepFinancials rp)
        {
            ReportService rep = getStandardParameters(rp);

            rep.AddParameter("RepType", rp.RepType);
            rep.AddParameter("FromDate", rp.FromDate);
            rep.AddParameter("ToDate", rp.ToDate);
            rep.AddParameter("BankCode", rp.BankCode);
            rep.AddParameter("Status", rp.Status);

            string url = rep.GetReportUrl("Rpt_AccBankSummary");

            return Shared.JsonObject(url);

        }
        public JsonResult IProc_Rpt_AccBoxDetail(RepFinancials rp)
        {
            ReportService rep = getStandardParameters(rp);

            rep.AddParameter("RepType", rp.RepType);
            rep.AddParameter("FromDate", rp.FromDate);
            rep.AddParameter("ToDate", rp.ToDate);
            rep.AddParameter("BoxId", rp.BoxId);
            rep.AddParameter("Status", rp.Status);
            rep.AddParameter("CashType", rp.CashType);

            string url = rep.GetReportUrl("Rpt_AccBoxDetail");

            return Shared.JsonObject(url);

        }
        public JsonResult IProc_Rpt_AccBankDetail(RepFinancials rp)
        {
            ReportService rep = getStandardParameters(rp);

            rep.AddParameter("RepType", rp.RepType);
            rep.AddParameter("FromDate", rp.FromDate);
            rep.AddParameter("ToDate", rp.ToDate);
            rep.AddParameter("BankCode", rp.BankCode);
            rep.AddParameter("Status", rp.Status);

            string url = rep.GetReportUrl("Rpt_AccBankDetail");

            return Shared.JsonObject(url);

        }
        public JsonResult IProc_Rep_OperationScrap(RepFinancials rp)
        {
            ReportService rep = getStandardParameters(rp);

            rep.AddParameter("RepType", rp.RepType); 
            rep.AddParameter("VendorId", rp.VendorId);
            rep.AddParameter("OperationId", rp.OperationId);

            string url = rep.GetReportUrl("Rep_OperationScrap");

            return Shared.JsonObject(url);

        }
        public JsonResult IProc_Rep_OperationRepScrap(RepFinancials rp)
        {
            ReportService rep = getStandardParameters(rp);

            rep.AddParameter("RepType", rp.RepType); 
            rep.AddParameter("VendorId", rp.VendorId);
            rep.AddParameter("OperationId", rp.OperationId);
            rep.AddParameter("ByValue", rp.ByValue);

            string url = rep.GetReportUrl("Rep_OperationRepScrap");

            return Shared.JsonObject(url);

        }
         

        /////////////////***new
        public JsonResult IProc_Prnt_Collect(RepFinancials rp)
        {
            ReportService rep = getStandardParameters(rp);
            rep.AddParameter("RepType", rp.RepType);
            rep.AddParameter("TRId", rp.TRId);
            rep.AddParameter("Repdesign", rp.Repdesign);




            //R_Rpt_AccReceiptList 
            string url = rep.GetReportUrl("Prnt_Collect");

            return Shared.JsonObject(url);
        }

        public JsonResult IProc_Rep_CollectList(RepFinancials rp)
        {
            ReportService rep = getStandardParameters(rp);

            rep.AddParameter("RepType", rp.RepType);
            rep.AddParameter("Status", rp.Status);
            rep.AddParameter("storeID", rp.storeID);
            rep.AddParameter("FromDate", rp.FromDate);
            rep.AddParameter("ToDate", rp.ToDate);
            rep.AddParameter("TrType", rp.TrType);
            rep.AddParameter("CatId", rp.CatId);
            rep.AddParameter("ItemFamId", rp.ItemFamId);
            rep.AddParameter("ItemID", rp.ItemID);
            string url = rep.GetReportUrl("Rep_CollectList");
              
            return Shared.JsonObject(url);
        }

        public JsonResult IProc_Rpt_ItemSalesSum(RepFinancials rp)
        { 
                ReportService rep = getStandardParameters(rp);

                rep.AddParameter("RepType", rp.RepType);
                rep.AddParameter("CustomerID", rp.CustomerID);
                rep.AddParameter("SLStype", rp.SLStype);
                rep.AddParameter("PaymentType", rp.PaymentType);
                rep.AddParameter("check", rp.check);
                rep.AddParameter("CatId", rp.CatId);
                rep.AddParameter("ItemFamId", rp.ItemFamId);
                rep.AddParameter("ItemID", rp.ItemID);
                rep.AddParameter("Status", rp.Status);
                rep.AddParameter("FromDate", rp.FromDate);
                rep.AddParameter("ToDate", rp.ToDate);
                rep.AddParameter("invType", rp.invType);

                string url = rep.GetReportUrl("Rpt_ItemSalesSum");

                return Shared.JsonObject(url); 
    }
        public JsonResult IProc_Rpt_ItemSalesDetail(RepFinancials rp)
        {
            ReportService rep = getStandardParameters(rp);

            rep.AddParameter("RepType", rp.RepType);
            rep.AddParameter("CustomerID", rp.CustomerID);
            rep.AddParameter("PaymentType", rp.PaymentType);
            rep.AddParameter("SLStype", rp.SLStype);
            rep.AddParameter("check", rp.check);
            rep.AddParameter("CatId", rp.CatId);
            rep.AddParameter("ItemFamId", rp.ItemFamId);
            rep.AddParameter("ItemID", rp.ItemID);
            rep.AddParameter("Status", rp.Status);
            rep.AddParameter("FromDate", rp.FromDate);
            rep.AddParameter("ToDate", rp.ToDate);
            rep.AddParameter("invType", rp.invType);

            string url = rep.GetReportUrl("Rpt_ItemSalesDetail");

            return Shared.JsonObject(url);

        }
        public JsonResult IProc_Rpt_ItemPurchaseSum(RepFinancials rp)
        {
            ReportService rep = getStandardParameters(rp);

            rep.AddParameter("RepType", rp.RepType);
            rep.AddParameter("VendorId", rp.VendorId);
            rep.AddParameter("PaymentType", rp.PaymentType);
            rep.AddParameter("check", rp.check);
            rep.AddParameter("CatId", rp.CatId);
            rep.AddParameter("ItemFamId", rp.ItemFamId);
            rep.AddParameter("ItemID", rp.ItemID);
            rep.AddParameter("Status", rp.Status);
            rep.AddParameter("FromDate", rp.FromDate);
            rep.AddParameter("ToDate", rp.ToDate);
            rep.AddParameter("invType", rp.invType);

            string url = rep.GetReportUrl("Rpt_ItemPurchaseSum");

            return Shared.JsonObject(url);

        }
        public JsonResult IProc_Rpt_ItemPurchaseDetail(RepFinancials rp)
        {
            ReportService rep = getStandardParameters(rp);

            rep.AddParameter("RepType", rp.RepType);
            rep.AddParameter("VendorId", rp.VendorId);
            rep.AddParameter("PaymentType", rp.PaymentType);
            rep.AddParameter("check", rp.check);
            rep.AddParameter("CatId", rp.CatId);
            rep.AddParameter("ItemFamId", rp.ItemFamId);
            rep.AddParameter("ItemID", rp.ItemID);
            rep.AddParameter("Status", rp.Status);
            rep.AddParameter("FromDate", rp.FromDate);
            rep.AddParameter("ToDate", rp.ToDate);
            rep.AddParameter("invType", rp.invType);

            string url = rep.GetReportUrl("Rpt_ItemPurchaseDetail");

            return Shared.JsonObject(url);

        }

        public JsonResult IProc_Rpt_ItemPeriodSummary(RepFinancials rp)
        {
            ReportService rep = getStandardParameters(rp);

            rep.AddParameter("RepType", rp.RepType);
            rep.AddParameter("braCode", rp.braCode);
            rep.AddParameter("storeID", rp.storeID);
            rep.AddParameter("ItemTypeID", rp.ItemTypeID);
            rep.AddParameter("CatId", rp.CatId);
            rep.AddParameter("ItemFamId", rp.ItemFamId);
            rep.AddParameter("ItemID", rp.ItemID);
            rep.AddParameter("check", rp.check);
            rep.AddParameter("BalType", rp.BalType);
            rep.AddParameter("FinYear", rp.FinYear);
            rep.AddParameter("FromPrd", rp.FromPrd);
            rep.AddParameter("ToPrd", rp.ToPrd);
          

            string url = rep.GetReportUrl("Rpt_ItemPeriodSummary");

            return Shared.JsonObject(url);

        }
        public JsonResult IProc_Rpt_StkIssueList(RepFinancials rp)
        {
            ReportService rep = getStandardParameters(rp);

            rep.AddParameter("RepType", rp.RepType);
            rep.AddParameter("IssueTypeID", rp.IssueTypeID); 
            rep.AddParameter("FromDate", rp.FromDate); 
            rep.AddParameter("ToDate", rp.ToDate);
            rep.AddParameter("storeID", rp.storeID);
            rep.AddParameter("Status", rp.Status); 
              
            string url = rep.GetReportUrl("Rpt_StkIssueList");

            return Shared.JsonObject(url);

        }
        public JsonResult Rep_UserActivityLog(RepFinancials rp)
        {
            ReportService rep = getStandardParameters(rp);

            rep.AddParameter("RepType", rp.RepType); 
            rep.AddParameter("Typ", rp.Typ); 
            rep.AddParameter("FromDate", rp.FromDate); 
            rep.AddParameter("ToDate", rp.ToDate); 
            rep.AddParameter("FromTime", rp.FromTime); 
            rep.AddParameter("ToTime", rp.ToTime); 
            rep.AddParameter("FinYear", rp.FinYear); 
            rep.AddParameter("SysCode", rp.SysCode); 
            rep.AddParameter("Module", rp.Module); 
            rep.AddParameter("User_Code", rp.User_Code); 
            rep.AddParameter("OprStatus", rp.OprStatus); 
            rep.AddParameter("OperationId", rp.OperationId); 

            string url = rep.GetReportUrl("Rep_UserActivityLog");

            return Shared.JsonObject(url);

        }
    }
}