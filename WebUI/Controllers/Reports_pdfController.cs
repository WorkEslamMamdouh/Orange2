//using Inv.API.Models.CustomEntities;
using Inv.WebUI.Reports.Models;
using Microsoft.Reporting.WebForms;
using System;
using System.IO;
using System.Web.Mvc;
using Inv.WebUI.Reports.Forms;
using System.Collections.Generic;
using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System.Net.Http;
using System.Web.Configuration;
using System.Data.SqlClient;
using Inv.API.Tools;
using Newtonsoft.Json;
using System.Linq;
using Shared = System.Web.Mvc.Shared;
using QRCoder;
using System.Drawing;
using System.Web;
using Microsoft.Reporting.WebForms.Internal.Soap.ReportingServices2005.Execution;
using System.Windows.Documents;
using Inv.WebUI.Models;

namespace Inv.WebUI.Controllers
{//eslam 1 dec 2020
    public class Reports_pdfController : Controller
    {


        StdParamters CurrentReportParameters;

        ReportsDetails ReportsDetail = new ReportsDetails();
        ReportInfo Rep = new ReportInfo();
        ClassPrint Printer = new ClassPrint();

        protected InvEntities db = UnitOfWork.context(BuildConnectionString());
        string NameAr;
        string NameEn;
        string BrNameAr;
        string BrNameEn;
        string DocNo = "";
        string VatNo = "";
        string Name_File = "";
        string Comp = "";
        string DocPDFFolder = "";
        string SystemCode = "";
        string SubSystemCode = "";
        int CompCode = 0;
        int? branCode = 0;
        string LoginUser = "";
        string ScreenLanguage = "";
        string reportName = "";
        object[] query;
        int TRId;
        ReportViewer reportViewer = new ReportViewer();
        public static string BuildConnectionString()
        {
            var httpClient = new HttpClient();
            var res = httpClient.GetStringAsync(WebConfigurationManager.AppSettings["ServiceUrl"] + "SystemTools/BuildConnection").Result;
            return res;
        }

        public void ReportsDetails()
        {

            ReportsDetail.PrintName = Rep.PrinterName;
            ReportsDetail.PageSize = Rep.PageSize;
            ReportsDetail.Landscape = Rep.Landscape;
            ReportsDetail.RightMargin = Rep.RightMargin;
            ReportsDetail.LeftMargin = Rep.LeftMargin;
            ReportsDetail.TopMargin = Rep.TopMargin;
            ReportsDetail.BottomMargin = Rep.BottomMargin;
            ReportsDetail.PageHight = Rep.PageHight;
            ReportsDetail.PageWidth = Rep.PageWidth;

        }
        public ReportService getStandardParameters(StdParamters sr)
        {
            ReportService rep = new ReportService();


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
        private ReportStandardParameters getStandardParameters(RepFinancials RepPar)
        {
            ReportStandardParameters StandardParameter = new ReportStandardParameters();


            ScreenLanguage = RepPar.Language;
            //CurrentSession = JsonConvert.DeserializeObject<SessionRecord>(Request["ses"]);
            if (ScreenLanguage == "ar")
            {
                reportViewer.Attributes.Add("style", "direction:rtl;");
            }
            else
            {
                reportViewer.Attributes.Add("style", "direction:ltr;");
            }
            //int CompCode = int.Parse(Request["CompCode"].ToString());
            CompCode = int.Parse(RepPar.CompCode);
            branCode = int.Parse(RepPar.BranchCode);
            // G_COMPANY Comp = new G_COMPANY();
            var Comp = db.G_COMPANY.Where(x => x.COMP_CODE == CompCode).ToList();
            var Bra = db.G_BRANCH.Where(x => x.COMP_CODE == CompCode && x.BRA_CODE == branCode).ToList();
            NameAr = SecuritySystem.Decrypt(Comp[0].NameA);
            NameEn = SecuritySystem.Decrypt(Comp[0].NameE);

            BrNameAr = Bra[0].BRA_DESC;
            BrNameEn = Bra[0].BRA_DESCL;
            if (BrNameAr == null)
                BrNameAr = " ";
            if (BrNameEn == null)
                BrNameEn = " ";
            StandardParameter.spComCode = new SqlParameter("@comp", CompCode);

            //string comapnyName = Request["CompNameA"].ToString();
            StandardParameter.spComNameA = new SqlParameter("@CompNameA", NameAr);

            //string CompNameE = Request["CompNameE"].ToString();
            StandardParameter.spComNameE = new SqlParameter("@CompNameE", NameEn);

            //string BraNameA = Request["BraNameA"].ToString();
            StandardParameter.spBraNameA = new SqlParameter("@BraNameA", BrNameAr);

            //string BraNameE = Request["BraNameE"].ToString();
            StandardParameter.braNameE = new SqlParameter("@BraNameE", BrNameEn);

            SystemCode = RepPar.SystemCode;

            SubSystemCode = RepPar.SubSystemCode;


            LoginUser = RepPar.UserCode;
            StandardParameter.spLoginUser = new SqlParameter("@LoginUser", LoginUser);

            StandardParameter.spbra = new SqlParameter("@bra", branCode);

            return StandardParameter;
        }
        private ReportInfo OpenReport(string ReportName)
        {

            GQ_ReportWebSetting Result = new GQ_ReportWebSetting();

            var DefauldReports = db.GQ_ReportWebSetting.Where(x => x.SystemCode == SystemCode && x.SubSystemCode == SubSystemCode && x.ReportID == ReportName);
            if (DefauldReports.Count() != 0)
            {
                var report = DefauldReports.Where(x => x.COMP_CODE == CompCode && x.BRA_Code == branCode && x.USER_CODE == LoginUser);
                if (report.Count() == 0)
                {
                    report = DefauldReports.Where(x => x.COMP_CODE == CompCode && x.USER_CODE == LoginUser);
                }
                if (report.Count() == 0)
                {
                    report = DefauldReports.Where(x => x.COMP_CODE == CompCode && x.BRA_Code == branCode);
                }
                if (report.Count() == 0)
                {
                    report = DefauldReports.Where(x => x.COMP_CODE == CompCode && x.BRA_Code == null);
                }
                if (report.Count() == 0)
                {
                    Result = DefauldReports.FirstOrDefault();
                }
                else
                {
                    Result = report.FirstOrDefault();
                }
            }

            ReportInfo ReportInfoObj = new ReportInfo();
            ReportInfoObj.OutputTypeNo = Result != null ? Result.OutputTypeNo.ToString() : "";
            ReportInfoObj.OutputType = Result != null ? Result.OutputType : "";
            ReportInfoObj.dataSource = Result != null ? Result.ReportDataSouce : "";
            ReportInfoObj.PrinterName = Result != null ? Result.PrinterName : "";
            ReportInfoObj.PageSize = Result != null ? Result.PageSize : "";
            ReportInfoObj.RightMargin = Result != null ? Convert.ToDouble(Result.RightMarginMM) : 0;
            ReportInfoObj.LeftMargin = Result != null ? Convert.ToDouble(Result.LeftMarginMM) : 0;
            ReportInfoObj.TopMargin = Result != null ? Convert.ToDouble(Result.TopMarginMM) : 0;
            ReportInfoObj.BottomMargin = Result != null ? Convert.ToDouble(Result.BottomMarginMM) : 0;
            ReportInfoObj.PageHight = Result != null ? Convert.ToDouble(Result.PageHightCM) : 0;
            ReportInfoObj.PageWidth = Result != null ? Convert.ToDouble(Result.PageWidthCM) : 0;
            ReportInfoObj.Landscape = Result != null ? Convert.ToBoolean(Result.IsLandScape) : false;
            ReportInfoObj.reportName = Result != null ? Result.ReportDesignNameAr : "";
            //if (ScreenLanguage == "ar")
            //{
            //    ReportInfoObj.reportName = Result != null ? Result.ReportDesignNameAr : "";
            //}
            //else
            //{
            //    ReportInfoObj.reportName = Result != null ? Result.ReportDesignNameEn : "";
            //}
            return ReportInfoObj;
        }


        public void buildReport(params object[] models)
        {



            string ReportPDFFilename = "Report-" + DateTime.Now + ".pdf";
            LocalReport localReport = new LocalReport();
            localReport.DataSources.Clear();

            string[] broken_str = reportName.Split('/');

            ReportDataSource source = new ReportDataSource(broken_str[broken_str.Length - 1], models[0]);
            localReport.DataSources.Add(source);


            if (reportName.Contains("Prnt"))
            {
                localReport.ReportPath = Server.MapPath("../Reports/Report/Print/" + reportName + ".rdlc");
            }
            else if (reportName.Contains("Slip"))
            {
                localReport.ReportPath = Server.MapPath("../Reports/Report/Slip/" + reportName + ".rdlc");
            }
            else
            {
                localReport.ReportPath = Server.MapPath("../Reports/Report/Reports/" + reportName + ".rdlc");
            }

            try
            {

                byte[] renderdByte;
                renderdByte = localReport.Render("PDF");



                DownloadContract(DocPDFFolder, "" + Name_File + "" + VatNo + "_" + (System.DateTime.Now.ToString("yyyy-MM-dd hh-mm")) + "_" + DocNo + "", renderdByte);

            }
            catch (Exception ex)
            {
                 
            }


        }
        private void DownloadContract(string DocPDFFolder, string nid, byte[] contractByte)
        {
            try
            {
                //string savePath = System.Web.HttpContext.Current.Server.MapPath(@"~/") + @"SavePath\" + nid + " " + ".pdf";
                //System.IO.File.WriteAllBytes(savePath, contractByte);
                //string path = @"F:/PDFFolder/" + @"Comp1\" + nid + "" + ".pdf" D:/PDFFolder/;

                //SessionRecord ses = new SessionRecord();
                //ses.CurrentYear = WebConfigurationManager.AppSettings["DefaultYear"];
                //ses.ScreenLanguage = WebConfigurationManager.AppSettings["Defaultlanguage"];

                string savePath = System.Web.HttpContext.Current.Server.UrlPathEncode(@"" + DocPDFFolder + "") + @"" + nid + "" + ".pdf";
                System.IO.File.WriteAllBytes(savePath, contractByte);

          

            }
            catch (Exception ex)
            {

            }
        }






        public void rptInvoiceNote(RepFinancials rp)
        {

            var que = Rpt_Prnt_SlsInvoice(rp);

            buildReport(que);

        }
        public IEnumerable<IProc_Prnt_SlsInvoiceVer2_Result> Rpt_Prnt_SlsInvoice(RepFinancials RepPar)
        {
            ReportStandardParameters StandPar = getStandardParameters(RepPar);

            TRId = int.Parse(RepPar.TRId.ToString());
            SqlParameter spTRId = new SqlParameter("@TRId", TRId);
            int typ = int.Parse(RepPar.Typ.ToString());




            var InvType = db.Database.SqlQuery<int?>("select  InvoiceTransCode from I_Sls_TR_Invoice where InvoiceID = " + TRId).FirstOrDefault();
            InvType = InvType == null ? 0 : InvType;

            int Repdesign = RepPar.Repdesign;
            int slip = RepPar.slip;
            if (slip == 1)
            {
                Rep = OpenReport("Slip_Prnt_SlsInvoiceSimpleVer2");
            }
            else
            {
                if (typ == 1)  // price show
                {
                    if (InvType == 1)
                    {
                        Rep = OpenReport("Prnt_SlsQuotationStdVer2");
                    }
                    else
                    {
                        Rep = OpenReport("Prnt_SlsQuotationeSimpleVer2");
                    }
                }
                else  // invoice 
                {



                    if (InvType == 1)   // std invoice 
                    {
                        Rep = OpenReport("Rpt_Prnt_SlsInvoiceStdVer2");
                    }
                    else    // simple invoice 
                    {
                        Rep = OpenReport("Rpt_Prnt_SlsInvoiceSimpleVer2");
                    }


                }
            }



            int Type = int.Parse(RepPar.Type.ToString());
            if (Type == 0) { Type = int.Parse(Rep.OutputTypeNo); }
            SqlParameter spRepType = new SqlParameter("@RepType", Type);






            string _Query = "execute " + Rep.dataSource +
                " @comp = '" + StandPar.spComCode.Value + "'" +
                ", @bra = '" + StandPar.spbra.Value + "'" +
                ", @CompNameA = '" + StandPar.spComNameA.Value + "'" +
                ", @CompNameE = '" + StandPar.spComNameE.Value + "'" +
                ", @BraNameA = '" + StandPar.spBraNameA.Value + "'" +
                ", @BraNameE = '" + StandPar.braNameE.Value + "'" +
                ", @LoginUser = '" + StandPar.spLoginUser.Value + "'" +
                 ",@RepType = " + spRepType.Value +
                 ",@TRId = " + spTRId.Value;

            var query = db.Database.SqlQuery<IProc_Prnt_SlsInvoiceVer2_Result>(_Query).ToList();


            string qr = query[0].QRSTR;
            DocNo = query[0].DocNo;
            VatNo = query[0].br_VatNo;
            Name_File = @"Invoice\";
            DocPDFFolder = RepPar.DocPDFFolder.ToString();
            //Comp = @"Comp" + StandPar.spComCode.Value+ @"\";

            QRCodeGenerator qRCodeGenerator = new QRCodeGenerator();
            QRCodeData qRCodeData = qRCodeGenerator.CreateQrCode(qr, QRCoder.QRCodeGenerator.ECCLevel.Q);
            QRCoder.QRCode qRCode = new QRCoder.QRCode(qRCodeData);
            var QRcode = "";
            using (Bitmap bitmap = qRCode.GetGraphic(2))
            {
                using (MemoryStream ms = new MemoryStream())
                {
                    bitmap.Save(ms, System.Drawing.Imaging.ImageFormat.Jpeg);
                    byte[] byteimage = ms.ToArray();
                    QRcode = Convert.ToBase64String(byteimage);

                }
            }
            query[0].QRSTR = QRcode;


            ReportsDetails();

            reportName = Rep.reportName;

            return query;
            //BindReport(Rep.reportName, Type, Rep.OutputType, ReportsDetail, query); 
        }

        public void rptInvoiceNoteRet(RepFinancials rp)
        {
            var que = Rpt_Prnt_SlsInvReturn(rp);

            buildReport(que);
        }

        public IEnumerable<IProc_Prnt_SlsInvoiceVer2_Result> Rpt_Prnt_SlsInvReturn(RepFinancials RepPar)
        {
            ReportStandardParameters StandPar = getStandardParameters(RepPar);

            var TRId = int.Parse(RepPar.TRId.ToString());
            SqlParameter spTRId = new SqlParameter("@TRId", TRId);
            int typ = int.Parse(RepPar.Typ.ToString());

            var InvType = db.Database.SqlQuery<int?>("select  InvoiceTransCode from I_Sls_TR_Invoice where InvoiceID = " + TRId).FirstOrDefault();
            InvType = InvType == null ? 0 : InvType;


            //int x = Convert.ToInt32(stat.InvoiceTransCode);

            int Repdesign = RepPar.Repdesign;
            int slip = RepPar.slip;

            if (InvType == 1)  // std invoice  return 
            {
                Rep = OpenReport("Rpt_Prnt_SlsInvReturnStdVer2");
            }
            else // simple invoice return 
            {
                Rep = OpenReport("Rpt_Prnt_SlsInvReturnSimpleVer2");
            }


            int Type = int.Parse(RepPar.Type.ToString());
            if (Type == 0) { Type = int.Parse(Rep.OutputTypeNo); }
            SqlParameter spRepType = new SqlParameter("@RepType", Type);


            string _Query = "execute " + Rep.dataSource +
                " @comp = '" + StandPar.spComCode.Value + "'" +
                ", @bra = '" + StandPar.spbra.Value + "'" +
                ", @CompNameA = '" + StandPar.spComNameA.Value + "'" +
                ", @CompNameE = '" + StandPar.spComNameE.Value + "'" +
                ", @BraNameA = '" + StandPar.spBraNameA.Value + "'" +
                ", @BraNameE = '" + StandPar.braNameE.Value + "'" +
                ", @LoginUser = '" + StandPar.spLoginUser.Value + "'" +
                 ",@RepType = " + spRepType.Value +
                 ",@TRId = " + spTRId.Value;

            var query = db.Database.SqlQuery<IProc_Prnt_SlsInvoiceVer2_Result>(_Query).ToList();
            string qr = query[0].QRSTR;
            QRCodeGenerator qRCodeGenerator = new QRCodeGenerator();
            QRCodeData qRCodeData = qRCodeGenerator.CreateQrCode(qr, QRCoder.QRCodeGenerator.ECCLevel.Q);
            QRCoder.QRCode qRCode = new QRCoder.QRCode(qRCodeData);
            var QRcode = "";
            using (Bitmap bitmap = qRCode.GetGraphic(2))
            {
                using (MemoryStream ms = new MemoryStream())
                {
                    bitmap.Save(ms, System.Drawing.Imaging.ImageFormat.Jpeg);
                    byte[] byteimage = ms.ToArray();
                    QRcode = Convert.ToBase64String(byteimage);

                }
            }
            query[0].QRSTR = QRcode;
            DocNo = query[0].DocNo;
            VatNo = query[0].br_VatNo;
            Name_File = @"InvoiceReturn\";
            DocPDFFolder = RepPar.DocPDFFolder.ToString();
            //Comp = "Comp" + StandPar.spComCode.Value + @"\";

            ReportsDetails();
            reportName = Rep.reportName;
            return query;
        }

        //Services
        public void Prnt_VATSlsInvoice(RepFinancials rp)
        {
            var que = Prnt_VATSlsInvoicee(rp);

            buildReport(que);

        }
        //ServicesReturn
        public void IProc_Prnt_VATSlsInvoice(RepFinancials rp)
        {
            var que = Prnt_VATSlsInvoicee(rp);

            buildReport(que);

        }
        public IEnumerable<IProc_Prnt_VATSlsInvoice_Result> Prnt_VATSlsInvoicee(RepFinancials RepPar)
        {
            ReportStandardParameters StandPar = getStandardParameters(RepPar);


            var TRId = int.Parse(RepPar.TRId.ToString());
            SqlParameter spTRId = new SqlParameter("@TRId", TRId);

            var InvType = db.Database.SqlQuery<int?>("select  InvoiceTransCode from I_Sls_TR_Invoice where InvoiceID = " + TRId).FirstOrDefault();
            InvType = InvType == null ? 0 : InvType;
            var TrType = int.Parse(RepPar.TrType.ToString());
            var slip = int.Parse(RepPar.slip.ToString());
            if (slip == 0)
            {
                if (InvType == 0)
                {
                    if (TrType == 1)
                    {
                        Rep = OpenReport("Prnt_VATSlsInvoiceRetSimple");
                    }
                    else
                    { Rep = OpenReport("Prnt_VATSlsInvoiceSimple"); }
                }
                else
                {
                    if (TrType == 1)
                    {
                        Rep = OpenReport("Prnt_VATSlsInvoiceRetstd");
                    }

                    else
                    {
                        Rep = OpenReport("Prnt_VATSlsInvoicestd");

                    }


                }

            }
            else
            {
                if (TrType == 1)
                {
                    Rep = OpenReport("Slip_VATSlsInvoiceRet");
                }
                else
                {

                    Rep = OpenReport("Slip_VATSlsInvoice");
                }
            }

            var typ = int.Parse(RepPar.Typ.ToString());
            if (typ == 1) { Rep = OpenReport("Prnt_VATSlsInvoicePrice"); }

            int Type = int.Parse(RepPar.Type.ToString());
            if (Type == 0) { Type = int.Parse(Rep.OutputTypeNo); }
            SqlParameter spRepType = new SqlParameter("@RepType", Type);


            string _Query = "execute " + Rep.dataSource +
                " @comp = '" + StandPar.spComCode.Value + "'" +
                ", @bra = '" + StandPar.spbra.Value + "'" +
                ", @CompNameA = '" + StandPar.spComNameA.Value + "'" +
                ", @CompNameE = '" + StandPar.spComNameE.Value + "'" +
                ", @BraNameA = '" + StandPar.spBraNameA.Value + "'" +
                ", @BraNameE = '" + StandPar.braNameE.Value + "'" +
                ", @LoginUser = '" + StandPar.spLoginUser.Value + "'" +
                ", @RepType = " + spRepType.Value + "  " +
                 ",@TRId = " + spTRId.Value;

            var query = db.Database.SqlQuery<IProc_Prnt_VATSlsInvoice_Result>(_Query).ToList();

            DocNo = query[0].DocNo;
            VatNo = query[0].br_VatNo;
            string qr = query[0].QRSTR;
            //Comp = "Comp" + StandPar.spComCode.Value + @"\";
            if (TrType == 1)
            {
                Name_File = @"InvoiceReturnServices\";
            }
            else
            {
                Name_File = @"InvoiceServices\";
            }
            DocPDFFolder = RepPar.DocPDFFolder.ToString();

            QRCodeGenerator qRCodeGenerator = new QRCodeGenerator();
            QRCodeData qRCodeData = qRCodeGenerator.CreateQrCode(qr, QRCoder.QRCodeGenerator.ECCLevel.Q);
            QRCoder.QRCode qRCode = new QRCoder.QRCode(qRCodeData);
            var QRcode = "";
            using (Bitmap bitmap = qRCode.GetGraphic(2))
            {
                using (MemoryStream ms = new MemoryStream())
                {
                    bitmap.Save(ms, System.Drawing.Imaging.ImageFormat.Jpeg);
                    byte[] byteimage = ms.ToArray();
                    QRcode = Convert.ToBase64String(byteimage);

                }
            }
            query[0].QRSTR = QRcode;

            ReportsDetails();

            reportName = Rep.reportName;

            return query;
        }



        //Services
        public void Prnt_OperationInvoice(RepFinancials rp)
        {
            var que = Rpt_Prnt_OperationInvoice(rp);

            buildReport(que);

        }

        // print _ operation _ invoice
        public IEnumerable<IProc_Prnt_SlsInvoiceVer2_Result> Rpt_Prnt_OperationInvoice(RepFinancials RepPar)
        {
            ReportStandardParameters StandPar = getStandardParameters(RepPar);


            var TRId = int.Parse(RepPar.TRId.ToString());
            SqlParameter spTRId = new SqlParameter("@TRId", TRId);
            int typ = int.Parse(RepPar.Typ.ToString());



            var InvType = db.Database.SqlQuery<int?>("select  InvoiceTransCode from I_Sls_TR_Invoice where InvoiceID = " + TRId).FirstOrDefault();
            InvType = InvType == null ? 0 : InvType;

            int Repdesign = RepPar.Repdesign;
            int slip = RepPar.slip;

            if (slip == 1)
            {
                Rep = OpenReport("Slip_OPerationInvoiceSimpleVer2");
            }
            else
            {

                if (InvType == 1)   // std invoice 
                {
                    Rep = OpenReport("Rpt_Prnt_OPerationInvoiceStdVer2");
                }
                else    // simple invoice 
                {
                    Rep = OpenReport("Rpt_Prnt_OPerationInvoiceSimpleVer2");
                }
            }


            int Type = int.Parse(RepPar.Type.ToString());
            if (Type == 0) { Type = int.Parse(Rep.OutputTypeNo); }
            SqlParameter spRepType = new SqlParameter("@RepType", Type);


            string _Query = "execute " + Rep.dataSource +
                " @comp = '" + StandPar.spComCode.Value + "'" +
                ", @bra = '" + StandPar.spbra.Value + "'" +
                ", @CompNameA = '" + StandPar.spComNameA.Value + "'" +
                ", @CompNameE = '" + StandPar.spComNameE.Value + "'" +
                ", @BraNameA = '" + StandPar.spBraNameA.Value + "'" +
                ", @BraNameE = '" + StandPar.braNameE.Value + "'" +
                ", @LoginUser = '" + StandPar.spLoginUser.Value + "'" +
                 ",@RepType = " + spRepType.Value +
                 ",@TRId = " + spTRId.Value;

            var query = db.Database.SqlQuery<IProc_Prnt_SlsInvoiceVer2_Result>(_Query).ToList();

            string qr = query[0].QRSTR;
            QRCodeGenerator qRCodeGenerator = new QRCodeGenerator();
            QRCodeData qRCodeData = qRCodeGenerator.CreateQrCode(qr, QRCoder.QRCodeGenerator.ECCLevel.Q);
            QRCoder.QRCode qRCode = new QRCoder.QRCode(qRCodeData);
            var QRcode = "";
            using (Bitmap bitmap = qRCode.GetGraphic(2))
            {
                using (MemoryStream ms = new MemoryStream())
                {
                    bitmap.Save(ms, System.Drawing.Imaging.ImageFormat.Jpeg);
                    byte[] byteimage = ms.ToArray();
                    QRcode = Convert.ToBase64String(byteimage);

                }
            }
            query[0].QRSTR = QRcode;
            DocNo = query[0].DocNo;
            VatNo = query[0].br_VatNo; 
            DocPDFFolder = RepPar.DocPDFFolder.ToString(); 
            if (RepPar.Repdesign == 1)
            {
                Name_File = @"InvoiceProcReturn\";
            }
            else
            {
                Name_File = @"InvoiceProc\";
            }

            ReportsDetails();

            reportName = Rep.reportName; 
            return query;
        }




    }
}