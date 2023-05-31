using Inv.DAL.Domain;
using Inv.DAL.Repository;
using Inv.WebUI.Reports.Forms;
using Inv.WebUI.Reports.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web.Configuration;
using iTextSharp.text.pdf;
using iTextSharp.text;
using System.IO;
using Microsoft.Win32;
using System.Data.Entity.Core.EntityClient;
using System.Data.SqlClient;

namespace Inv.WebUI.Controllers
{//eslam 1 dec 2020
    public class GeneralRepController : ReportsPagePrintController
    {
        private readonly StdParamters CurrePrnt_OperationInvoicentReportParameters;
        private readonly ReportsDetails ReportsDetail = new ReportsDetails();
        private readonly ReportInfo Rep = new ReportInfo();
        private readonly ClassPrint Printer = new ClassPrint();

        protected InvEntities db = UnitOfWork.context(BuildConnectionString());

        //public static string BuildConnectionString()
        //{


        //    string DbName = "";
        //    try
        //    {
        //        ClassPrint ListInformation = new ClassPrint();
        //        string[] ListUserInformation = ListInformation.GetUserInformation();
        //        DbName = ListUserInformation[2];

        //    }
        //    catch (Exception ex)
        //    {

        //        DbName = "";
        //    }

        //    var httpClient = new HttpClient();
        //    var res = httpClient.GetStringAsync(WebConfigurationManager.AppSettings["ServiceUrl"] + "SystemTools/BuildConnection/?ListAddress=" + DbName + "").Result;
        //    return res;
        //}

        public static string BuildConnectionString()
        {
            try
            {

                SqlConnectionStringBuilder sqlBuilder = new SqlConnectionStringBuilder();
                EntityConnectionStringBuilder entityBuilder = new EntityConnectionStringBuilder();

                // Set the properties for the data source.
                sqlBuilder.DataSource = WebConfigurationManager.AppSettings["ServerNameReportsForm"];
                bool singleDb = Convert.ToBoolean(WebConfigurationManager.AppSettings["singleDb"]);

                if (singleDb == false)
                    sqlBuilder.InitialCatalog = WebConfigurationManager.AppSettings["AbsoluteSysDbNameReportsForm"];
                else
                    sqlBuilder.InitialCatalog = WebConfigurationManager.AppSettings["AbsoluteSysDbNameReportsForm"];

                sqlBuilder.UserID = WebConfigurationManager.AppSettings["DbUserNameReportsForm"];
                sqlBuilder.Password = WebConfigurationManager.AppSettings["DbPasswordReportsForm"];
                sqlBuilder.IntegratedSecurity = Convert.ToBoolean(WebConfigurationManager.AppSettings["UseIntegratedSecurity"]);
                sqlBuilder.MultipleActiveResultSets = true;

                string providerString = sqlBuilder.ToString();

                entityBuilder.ProviderConnectionString = "Persist Security Info=True;" + providerString;
                entityBuilder.Provider = "System.Data.SqlClient";
                entityBuilder.Metadata = @"res://*/Domain.InvModel.csdl|res://*/Domain.InvModel.ssdl|res://*/Domain.InvModel.msl";

                return entityBuilder.ConnectionString;
            }
            catch (Exception ex)
            {

            }
            return "";
        }

        public string GetHtml(string DocPDFFolder, int success)
        {

            string Str = "";
            if (DocPDFFolder == "")
            {
                Str = Server.MapPath("/SavePath/");

            }
            else
            {
                Str = DocPDFFolder;

            }
            try
            {
                string html;
                if (success == 1)
                {
                    html = System.IO.File.ReadAllText(Str + "Result.html");
                }
                else
                {
                    html = System.IO.File.ReadAllText(Str + "HtmlErorr.html");

                }
                return html;
            }
            catch (Exception)
            {
                Str = Server.MapPath("/SavePath/");
                string html = System.IO.File.ReadAllText(Str + "HtmlErorr.html");
                return html;
            }


        }

        //-----------------------------------------------------*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*----



        public string rptReceiptNote(RepFinancials rp)
        {
            IEnumerable<IProc_Prnt_AccReceive_Result> que = Rpt_Prnt_AccReceive(rp);
            return buildReport(que);
        }

        public string rptPrnt_LnkVoucher(RepFinancials rp)
        {
            IEnumerable<AProc_Prnt_LnkVoucher_Result> que = Prnt_LnkVoucher(rp);
            return buildReport(que);
        }

        public string rptAdjustNote(RepFinancials rp)
        {
            IEnumerable<IProc_Prnt_AccAdjust_Result> que = Rpt_Prnt_AccAdjust(rp);
            return buildReport(que);

        }

        public string IProc_Prnt_OperationCharges(RepFinancials rp)
        {
            IEnumerable<IProc_Prnt_OperationCharges_Result> que = Prnt_OperationCharges(rp);
            return buildReport(que);

        }

        public string rptInvoiceNote(RepFinancials rp)
        {
       
            IEnumerable<IProc_Prnt_SlsInvoiceVer2_Result> que = Rpt_Prnt_SlsInvoice(rp);
            return buildReport(que);

        }

        public string rptInvoiceNotePrice(RepFinancials rp)
        {
            IEnumerable<IProc_Prnt_SlsInvoiceVer2_Result> que = Rpt_Prnt_SlsInvoice(rp);
            return buildReport(que);

        }

        public string Prnt_OperationInvoice(RepFinancials rp)
        {
            IEnumerable<IProc_Prnt_SlsInvoiceVer2_Result> que = Rpt_Prnt_OperationInvoice(rp);
            return buildReport(que);

        }

        public string IProc_Prnt_OperationItems(RepFinancials rp)
        {
            IEnumerable<IProc_Prnt_OperationItems_Result> que = Prnt_OperationItems(rp);
            return buildReport(que);
        }

        public string IProc_Prnt_OperationSalesmanItem(RepFinancials rp)
        {
            IEnumerable<IProc_Prnt_OperationSalesmanItem_Result> que = Prnt_OperationSalesmanItem(rp);
            return buildReport(que);

        }

        public string IProc_Rep_OperationSum(RepFinancials rp)
        {
            IEnumerable<IProc_Rep_OperationSum_Result> que = Rep_OperationSum(rp);
            return buildReport(que);

        }

        public string IProc_Rep_salesrecord(RepFinancials rp)
        {
            IEnumerable<IProc_Rep_OperationItemSales_Result> que = Rep_salesrecord(rp);
            return buildReport(que);

        }

        public string IProc_Prnt_OperationDeposit(RepFinancials rp)
        {
            IEnumerable<IProc_Prnt_OperationDeposit_Result> que = Prnt_OperationDeposit(rp);
            return buildReport(que);

        }

        public string rptInvoiceNoteRet(RepFinancials rp)
        {
            IEnumerable<IProc_Prnt_SlsInvoiceVer2_Result> que = Rpt_Prnt_SlsInvReturn(rp);
            return buildReport(que);

        }

        public string IProc_Prnt_PurReceive(RepFinancials rp)
        {
            IEnumerable<IProc_Prnt_PurReceive_Result> que = Rpt_Prnt_PurReceive(rp);
            return buildReport(que);

        }

        public string IProc_Prnt_PurReceiveRet(RepFinancials rp)
        {
            IEnumerable<IProc_Prnt_PurReceiveRet_Result> que = Prnt_PurReceiveRet(rp);
            return buildReport(que);

        }

        public string IProc_Prnt_PurReceivePrice(RepFinancials rp)
        {
            IEnumerable<IProc_Prnt_PurReceive_Result> que = Prnt_PurReceivePrice(rp);
            return buildReport(que);
        }

        public string IProc_Prnt_VATPurReturn(RepFinancials rp)
        {
            IEnumerable<IProc_Prnt_VATPurReturn_Result> que = Prnt_VATPurReturn(rp);
            return buildReport(que);
        }

        public string IProc_Prnt_SlsInvoice(RepFinancials rp)
        {
            IEnumerable<IProc_Prnt_SlsInvoiceVer2_Result> que = Rpt_Prnt_SlsInvoicepr(rp);
            return buildReport(que);
        }

        public string IProc_Rpt_AccCustomerSummary(RepFinancials rp)
        {
            IEnumerable<IProc_Rpt_AccCustomerSummary_Result> que = Rpt_AccCustomerSummary(rp);
            return buildReport(que);

        }

        public string IProc_Rpt_AccCustomerDetail(RepFinancials rp)
        {
            IEnumerable<IProc_Rpt_AccCustomerDetail_Result> que = Rpt_AccCustomerDetail(rp);
            return buildReport(que);
        }

        public string IProc_Rpt_AccVendorDetail(RepFinancials rp)
        {
            IEnumerable<IProc_Rpt_AccVendorDetail_Result> que = Rpt_AccVendorDetail(rp);
            return buildReport(que);

        }

        public string IProc_Rpt_AccVendorSummary(RepFinancials rp)
        {
            IEnumerable<IProc_Rpt_AccVendorSummary_Result> que = Rpt_AccVendorSummary(rp);
            return buildReport(que);

        }

        public string IProc_Rpt_ItemStockSummary(RepFinancials rp)
        {
            IEnumerable<IProc_Rpt_ItemStockSummary_Result> que = Rpt_ItemStockSummary(rp);
            return buildReport(que);
        }

        public string IProc_Rpt_ItemStockValue(RepFinancials rp)
        {
            IEnumerable<IProc_Rpt_ItemStockValue_Result> que = Rpt_ItemStockValue(rp);
            return buildReport(que);

        }

        public string IProc_Rpt_ItemStockIncome(RepFinancials rp)
        {
            IEnumerable<IProc_Rpt_ItemStockIncome_Result> que = Rpt_ItemStockIncome(rp);
            return buildReport(que);
        }

        public string AProc_Rpt_GLFinancialStatment(RepFinancials rp)
        {
            if (rp.check == 0)
            {
                IEnumerable<AProc_Rpt_GLFinancialStatment_Result> que = Rpt_GLFinancialStatment(rp);
                return buildReport(que);
            }
            else
            {
                IEnumerable<AProc_Rpt_GLFinancialStatment_Result> que = Rpt_GLFinancialStatment_Lndscp(rp);
                return buildReport(que);
            }
        }

        public string AProc_Rpt_GLGeneralLedger(RepFinancials rp)
        {
            IEnumerable<AProc_Rpt_GLGeneralLedger_Result> que = Rpt_GLGeneralLedger(rp);
            return buildReport(que);
        }

        public string AProc_Rpt_GLAccountStatment(RepFinancials rp)
        {
            IEnumerable<AProc_Rpt_GLAccountStatment_Result> que = Rpt_GLAccountStatment(rp);
            return buildReport(que);
        }

        public string AProc_Prnt_JournalVoucher(RepFinancials rp)
        {
            IEnumerable<AProc_Prnt_JournalVoucher_Result> que = Prnt_JournalVoucher(rp);
            return buildReport(que);

        }

        public string IProc_Prnt_VATPurInvoice(RepFinancials rp)
        {
            IEnumerable<IProc_Prnt_VATPurInvoice_Result> que = Prnt_VATPurInvoice(rp);
            return buildReport(que);
        }

        public string IProc_Prnt_PurPurchaseOrder(RepFinancials rp)
        {
            IEnumerable<IProc_Prnt_PurPurchaseOrder_Result> que = Prnt_PurPurchaseOrder(rp);
            return buildReport(que);
        }

        public string IProc_Prnt_StkTransfer(RepFinancials rp)
        {
            IEnumerable<IProc_Prnt_StkTransfer_Result> que = Prnt_StkTransfer(rp);
            return buildReport(que);
        }

        public string IProc_Prnt_StkAdjust(RepFinancials rp)
        {
            IEnumerable<IProc_Prnt_StkAdjust_Result> que = Prnt_StkAdjust(rp);
            return buildReport(que);
        }

        public string IProc_Prnt_StkOpen(RepFinancials rp)
        {
            IEnumerable<IProc_Prnt_StkOpen_Result> que = Prnt_StkOpen(rp);
            return buildReport(que);
        }

        public string IProc_Prnt_OerationTf(RepFinancials rp)
        {
            IEnumerable<IProc_Prnt_OerationTf_Result> que = Prnt_OerationTf(rp);
            return buildReport(que);
        }

        public string IProc_Prnt_VATSlsInvoice(RepFinancials rp)
        {
            IEnumerable<IProc_Prnt_VATSlsInvoice_Result> que = Prnt_VATSlsInvoice(rp);
            return buildReport(que);

        }

        public string IProc_Prnt_VATSlsInvoicePriceshow(RepFinancials rp)
        {
            IEnumerable<IProc_Prnt_VATSlsInvoice_Result> que = Prnt_VATSlsInvoice(rp);
            return buildReport(que);

        }

        public string IProc_Rpt_AccVendorCollDetail(RepFinancials rp)
        {
            IEnumerable<IProc_Rpt_AccVendorCollDetail_Result> que = Rpt_AccVendorCollDetail(rp);
            return buildReport(que);

        }

        public string IProc_Rpt_AccVendorCollSummary(RepFinancials rp)
        {
            IEnumerable<IProc_Rpt_AccVendorCollSummary_Result> que = Rpt_AccVendorCollSummary(rp);
            return buildReport(que);
        }

        public string IProc_Rpt_VatSalesSummary(RepFinancials rp)
        {
            if (rp.check == 1)
            {
                IEnumerable<IProc_Rpt_VatSalesSummary_Result> que = Rpt_VatSalesSummary(rp);
                return buildReport(que);
            }
            else
            {
                IEnumerable<IProc_Rpt_VatSalesDetail_Result> que = Rpt_VatSalesDetail(rp);
                return buildReport(que);
            }
        }

        public string IProc_Rpt_VatPurchaseSummary(RepFinancials rp)
        {
            if (rp.check == 1)
            {
                IEnumerable<IProc_Rpt_VatPurchaseSummary_Result> que = Rpt_VatPurchaseSummary(rp);
                return buildReport(que);

            }
            else
            {
                IEnumerable<IProc_Rpt_VatPurchaseDetail_Result> que = Rpt_VatPurchaseDetail(rp);
                return buildReport(que);

            }
        }

        public string AProc_Prnt_CashVoucher(RepFinancials rp)
        {
            IEnumerable<AProc_Prnt_CashVoucher_Result> que = Prnt_CashVoucher(rp);
            return buildReport(que);
        }

        public string AProc_Rpt_GLDtCCenterStatmentSummary(RepFinancials rp)
        {
            if (rp.check == 1)
            {
                IEnumerable<AProc_Rpt_GLDtCCenterStatmentSummary_Result> que = Rpt_GLDtCCenterStatmentSummary(rp);
                return buildReport(que);
            }
            else
            {
                IEnumerable<AProc_Rpt_GLDtCCenterStatmentDetail_Result> que = Rpt_GLDtCCenterStatmentDetail(rp);
                return buildReport(que);
            }

        }

        public string IProc_Prnt_VATReport(RepFinancials rp)
        {
            IEnumerable<IProc_Prnt_VATReport_Result> que = Prnt_VATReport(rp);
            return buildReport(que);
        }

        public string IProc_Rpt_AccBoxSummary(RepFinancials rp)
        {
            IEnumerable<IProc_Rpt_AccBoxSummaryVer2_Result> que = Rpt_AccBoxSummary(rp);
            return buildReport(que);
        }

        public string IProc_Rpt_AccBoxDetail(RepFinancials rp)
        {
            IEnumerable<IProc_Rpt_AccBoxDetailVer2_Result> que = Rpt_AccBoxDetail(rp);
            return buildReport(que);
        }

        public string IProc_Rep_OperationScrap(RepFinancials rp)
        {
            IEnumerable<IProc_Rep_OperationScrap_Result> que = Rep_OperationScrap(rp);
            return buildReport(que);
        }


        public string IProc_Rep_OperationRepScrap(RepFinancials rp)
        {
            IEnumerable<IProc_Rep_OperationScrapList_Result> que = Rep_OperationRepScrap(rp);
            return buildReport(que);
        }

        public string IProc_Prnt_Collect(RepFinancials rp)
        {
            IEnumerable<IProc_Prnt_Collect_Result> que = Prnt_Collect(rp);
            return buildReport(que);
        }

        public string IProc_Prnt_StkIssue(RepFinancials rp)
        {
            IEnumerable<IProc_Prnt_StkIssue_Result> que = Prnt_StkIssue(rp);
            return buildReport(que);
        }



        public string Prnt_From_To(RepFinancials rp)
        {



            string Qury = @"select  TOP (100)" + rp.Name_ID + " as InvoiceID from " + rp.NameTable + " where  "+ rp.Condation+ "";

            //string Qury = @"select  InvoiceID from I_Sls_TR_Invoice where SlsInvSrc = 1 and  TrType = 0 and CompCode = " + rp.CompCode + " and BranchCode =" + rp.BranchCode + @" and
            //                TrNo >= " + rp.fromNum + " and TrNo <=" + rp.ToNum + @" and 
            //                (YEAR(TrDate) = " + rp.FinYear + ") ";

            List<Invoices_ID> InvID = db.Database.SqlQuery<Invoices_ID>(Qury).ToList();

            List<byte[]> Listbyte = new  List<byte[]>();
            byte[] Model_byte = new byte[] { };

            for (int i = 0; i < InvID.Count; i++)
            {
                byte[] Singl_byte = { };

                rp.TRId = InvID[i].InvoiceID;
                if (rp.Type_Trans == "Inv")
                {
                    IEnumerable<IProc_Prnt_SlsInvoiceVer2_Result> que = Rpt_Prnt_SlsInvoice(rp);
                    Singl_byte = buildReportNew(que);
                }
                if (rp.Type_Trans == "Inv_Ret")
                {
                    IEnumerable<IProc_Prnt_SlsInvoiceVer2_Result> que = Rpt_Prnt_SlsInvReturn(rp);
                    Singl_byte = buildReportNew(que);
                }
                if (rp.Type_Trans == "Pur")
                {
                    IEnumerable<IProc_Prnt_PurReceive_Result> que = Rpt_Prnt_PurReceive(rp);
                    Singl_byte = buildReportNew(que);
                }
                if (rp.Type_Trans == "Pur_Ret")
                {
                    IEnumerable<IProc_Prnt_PurReceiveRet_Result> que = Prnt_PurReceiveRet(rp);
                    Singl_byte = buildReportNew(que);
                }
                if (rp.Type_Trans == "Pro")
                {
                    IEnumerable<IProc_Prnt_SlsInvoiceVer2_Result> que = Rpt_Prnt_OperationInvoice(rp);
                    Singl_byte = buildReportNew(que);
                }
                if (rp.Type_Trans == "Pro_Ret")
                {
                    IEnumerable<IProc_Prnt_SlsInvoiceVer2_Result> que = Rpt_Prnt_OperationInvoice(rp);
                    Singl_byte = buildReportNew(que);
                }
                if (rp.Type_Trans == "AccReceive")
                {
                    IEnumerable<IProc_Prnt_AccReceive_Result> que = Rpt_Prnt_AccReceive(rp);
                    Singl_byte = buildReportNew(que);
                }
                if (rp.Type_Trans == "AccPayment")
                {
                    IEnumerable<IProc_Prnt_AccReceive_Result> que = Rpt_Prnt_AccReceive(rp);
                    Singl_byte = buildReportNew(que);
                }
 

                Listbyte.Add(Singl_byte); 

            }

            Model_byte = ConcatenatePdfs(Listbyte);


            String path = String.Empty;


            if (rp.DocPDFFolder == "")
            {
                path = Server.MapPath("/SavePath/"); 
            }
            else
            {
                path = rp.DocPDFFolder; 
            }

             
            path =  DownloadContract(path, Model_byte);


            return path;

        }

        public string DownloadContract( string nid, byte[] contractByte)
        {
            string path = "";
            try
            {
                //string savePath = System.Web.HttpContext.Current.Server.MapPath(@"~/") + @"SavePath\" + nid + " " + ".pdf";
                //System.IO.File.WriteAllBytes(savePath, contractByte);
                //string path = @"F:/PDFFolder/" + @"Comp1\" + nid + "" + ".pdf" D:/PDFFolder/;

                //SessionRecord ses = new SessionRecord();
                //ses.CurrentYear = WebConfigurationManager.AppSettings["DefaultYear"];
                //ses.ScreenLanguage = WebConfigurationManager.AppSettings["Defaultlanguage"];

                //string savePath = System.Web.HttpContext.Current.Server.MapPath(@"" + DocPDFFolder + "") + @"" + nid + "" + ".pdf";
                //System.IO.File.WriteAllBytes(savePath, contractByte);

 
                string savePath = System.Web.HttpContext.Current.Server.UrlPathEncode(@"" + nid + "") + @"Pdf_Invoices" + ".pdf";


                System.IO.File.WriteAllBytes(savePath, contractByte);

                path = savePath;
                //System.IO.File.WriteAllBytes(path, contractByte);

                path = path.Replace(@"\", "/");

                return path;
            }
            catch (Exception ex)
            {
                return path;
            }

             
        }
 
        public static byte[] ConcatenatePdfs(IEnumerable<byte[]> documents)
        {
            using (var ms = new MemoryStream())
            {
                var outputDocument = new Document();
                var writer = new PdfCopy(outputDocument, ms);
                outputDocument.Open();

                foreach (var doc in documents)
                {
                    var reader = new PdfReader(doc);
                    for (var i = 1; i <= reader.NumberOfPages; i++)
                    {
                        writer.AddPage(writer.GetImportedPage(reader, i));
                    }
                    writer.FreeReader(reader);
                    reader.Close();
                }

                writer.Close();
                outputDocument.Close();
                var allPagesContent = ms.GetBuffer();
                ms.Flush();

                return allPagesContent;
            }
        }
         
    }
}