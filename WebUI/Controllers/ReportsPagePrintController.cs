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
using Warning = Microsoft.Reporting.WebForms.Warning;
using Spire.Xls;
using Spire.Pdf;
using FileFormat = Spire.Pdf.FileFormat;
using System.Web.UI.WebControls;
using System.Text;
using Microsoft.Win32; 
using iTextSharp.text.pdf;
using iTextSharp.text;
using System.IO;

//using Spire.Xls;

namespace Inv.WebUI.Controllers
{//eslam 1 dec 2020
    public class ReportsPagePrintController : Controller
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
        int? CompCode = 0;
        int? branCode = 0;
        string LoginUser = "";
        string ScreenLanguage = "";
        string reportName = "";
        int? Send_Pdf = 0;
        string DocUUID = ""; 
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


            ScreenLanguage = RepPar.ScreenLanguage;
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
            if (DefauldReports.Count() > 1)
            {
                var report = DefauldReports.Where(x => x.COMP_CODE == CompCode && x.BRA_Code == branCode && x.USER_CODE == LoginUser);
                if (report.Count() == 1)
                {
                    Result = report.FirstOrDefault();
                }
                else

                {
                    report = DefauldReports.Where(x => x.COMP_CODE == CompCode && x.BRA_Code == branCode);
                    if (report.Count() == 1)
                    {
                        Result = report.FirstOrDefault();
                    }
                    else
                    {
                        report = DefauldReports.Where(x => x.COMP_CODE == CompCode && x.BRA_Code == null);
                        if (report.Count() == 1)
                        {
                            Result = report.FirstOrDefault();
                        }
                        else
                        {
                            report = DefauldReports.Where(x => x.COMP_CODE == null && x.BRA_Code == null);
                            Result = report.FirstOrDefault();



                        }

                    }

                }
            }
            else
            {
                Result = DefauldReports.FirstOrDefault();
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
            if (ScreenLanguage == "ar")
            {
                ReportInfoObj.reportName = Result != null ? Result.ReportDesignNameAr : "";
            }
            else
            {
                ReportInfoObj.reportName = Result != null ? Result.ReportDesignNameEn : "";
            }
            return ReportInfoObj;
        }


        public string DownloadContract(string nid, byte[] contractByte)
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


                string savePath = "";

                if (Send_Pdf == 1)
                {
                    savePath = System.Web.HttpContext.Current.Server.UrlPathEncode(@"C:/PdfCustSend_Or/") + @"" + DocUUID + "" + ".pdf";
                    System.IO.File.WriteAllBytes(savePath, contractByte);

                    return DocUUID;

                }
                else
                {
                    savePath = System.Web.HttpContext.Current.Server.UrlPathEncode(@"" + nid + "") + @"Pdf_Invoices" + ".pdf";

                    System.IO.File.WriteAllBytes(savePath, contractByte);

                    path = savePath;
                    path = path.Replace(@"\", "/");

                    return path;

                }
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


        public string buildReport(params object[] models)
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
            string Str = "";
            try
            {


                //Byte[] mybytes = localReport.Render("HTML 4.0");

                byte[] renderdByte;
                renderdByte = localReport.Render("PDF");


                String path = String.Empty;


                if (DocPDFFolder == "")
                {
                    path = Server.MapPath("/SavePath/");
                }
                else
                {
                    path = DocPDFFolder;
                }


                path = DownloadContract(path, renderdByte);


                return path;

            }
            catch (Exception ex)
            {
                string html = ex.ToString(); ;
                return html;
                throw;
            }


        }

        public void DownloadDdf(string url)
        {
            try
            {
                //string savePath = System.Web.HttpContext.Current.Server.MapPath(@"~/") + @"SavePath\" + nid + " " + ".pdf";
                //System.IO.File.WriteAllBytes(savePath, contractByte);
                //string path = @"F:/PDFFolder/" + @"Comp1\" + nid + "" + ".pdf" D:/PDFFolder/;

                //SessionRecord ses = new SessionRecord();
                //ses.CurrentYear = WebConfigurationManager.AppSettings["DefaultYear"];
                //ses.ScreenLanguage = WebConfigurationManager.AppSettings["Defaultlanguage"];


                //PdfDocument pdf = new PdfDocument();
                //pdf.LoadFromFile(Str);



                //StringBuilder buffer = new StringBuilder();

                //foreach (PdfPageBase page in pdf.Pages)
                //{
                //    buffer.Append(page.ExtractText());
                //}

                //pdf.Close();
                //String fileName = @"C:\Users\Tamal\Desktop\101395a.txt";
                //File.WriteAllText(fileName, buffer.ToString());
                //System.Diagnostics.Process.Start(fileName);


                string Str = Server.MapPath(@"~/SavePath\Report.pdf");


                byte[] bytes = System.IO.File.ReadAllBytes(Str);



                string savePath = System.Web.HttpContext.Current.Server.MapPath(GetFileName("Report")) + "Report.pdf";
                System.IO.File.WriteAllBytes(savePath, bytes);





                //SaveFileDialog saveFileDialog1 = new SaveFileDialog();

                //using (Stream s = File.open)


                //System.IO.File.WriteAllBytes("hello.pdf", bytes);

                //Warning[] warnings;
                //string[] streamIds;
                //string mimeType = string.Empty;
                //string encoding = string.Empty;
                //string extension = string.Empty;
                //byte[] bytes = GeMimeTypeFromImageByteArray(bytess);
                //Response.Buffer = true;
                //Response.Clear();
                //Response.ContentType = mimeType;
                //Response.AddHeader("content-disposition", "attachment; filename=" + reportName + "." + extension);
                //Response.OutputStream.Write(bytes, 0, bytes.Length);
                //Response.Flush();
                //Response.End();

                //FileStream fs = new FileStream(Server.MapPath(Str), FileMode.Create);
                //fs.Write(bytes, 0, bytes.Length);
                //fs.Close();


                //FileInfo fi = new FileInfo(Str);

                ////Open file for Read\Write
                //FileStream fs = fi.Open(FileMode.OpenOrCreate, FileAccess.ReadWrite, FileShare.ReadWrite);

                ////create byte array of same size as FileStream length
                //byte[] fileBytes = new byte[fs.Length];

                ////define counter to check how much bytes to read. Decrease the counter as you read each byte
                //int numBytesToRead = (int)fileBytes.Length;

                ////Counter to indicate number of bytes already read
                //int numBytesRead = 0;

                ////iterate till all the bytes read from FileStream
                //while (numBytesToRead > 0)
                //{
                //    int n = fs.Read(fileBytes, numBytesRead, numBytesToRead);

                //    if (n == 0)
                //        break;

                //    numBytesRead += n;
                //    numBytesToRead -= n;
                //}

                ////Once you read all the bytes from FileStream, you can convert it into string using UTF8 encoding
                //string filestring = Encoding.UTF8.GetString(fileBytes);



            }
            catch (Exception ex)
            {

            }
        }

        public byte[] buildReportNew(params object[] models)
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
 
                //Byte[] mybytes = localReport.Render("HTML 4.0");

                byte[] renderdByte;
                renderdByte = localReport.Render("PDF");

                
                return renderdByte;

            }
            catch (Exception ex)
            {
                byte[] html = null;
                return html;
                throw;
            }


        }



        public string GetFileName(string FileNameWithExtension)
        {
            try
            {
                return FileNameWithExtension.Substring(0, FileNameWithExtension.LastIndexOf('.'));
            }
            catch (Exception)
            {
                return "";
            }
        } 

        public IEnumerable<IQ_GetSalesMan> RPT_Test(RepFinancials RepPar)
        {
            ReportStandardParameters StandPar = getStandardParameters(RepPar); 

            ReportInfo Rep = OpenReport("Test");
            int Type = 3;

            if (Type == 2)
                Rep = OpenReport("TestPDF");
            if (Type == 3)
                Rep = OpenReport("TestEXCEL");

            var query = db.Database.SqlQuery<IQ_GetSalesMan>
                ("select * from   " + Rep.dataSource + "").ToList();

            ReportsDetails ReportsDetail = new ReportsDetails();
            ReportsDetail.PrintName = Rep.PrinterName;
            ReportsDetail.PageSize = Rep.PageSize;
            ReportsDetail.Landscape = Rep.Landscape;
            ReportsDetail.RightMargin = Rep.RightMargin;
            ReportsDetail.LeftMargin = Rep.LeftMargin;
            ReportsDetail.TopMargin = Rep.TopMargin;
            ReportsDetail.BottomMargin = Rep.BottomMargin;
            ReportsDetail.PageHight = Rep.PageHight;
            ReportsDetail.PageWidth = Rep.PageWidth;

            ReportsDetails();

            reportName = Rep.reportName; Send_Pdf = RepPar.Send_Pdf; DocUUID = RepPar.DocUUID;
            DocPDFFolder = RepPar.DocPDFFolder == null ? "/SavePath/" : RepPar.DocPDFFolder.ToString();
            return query;
        }

        public IEnumerable<IProc_Prnt_AccReceive_Result> Rpt_Prnt_AccReceive(RepFinancials RepPar)
        {
            ReportStandardParameters StandPar = getStandardParameters(RepPar);
            




            var TRId = int.Parse(RepPar.TRId.ToString());
            SqlParameter spTRId = new SqlParameter("@TRId", TRId);

            int Repdesign = RepPar.Repdesign;
            //Rpt_Prnt_Receipt

            int slip = int.Parse(RepPar.slip.ToString());
            if (slip == 0)
            {
                Rep = OpenReport("Rpt_Prnt_AccReceive");

            }
            else
            {
                Rep = OpenReport("Slip_AccReceive");
            }



            int Type = int.Parse(RepPar.Type.ToString());
            if (Type == 0) { Type = int.Parse(Rep.OutputTypeNo); }
            SqlParameter spRepType = new SqlParameter("@RepType", Type);


            if (Repdesign == 2) { Rep = OpenReport("Rpt_Prnt_AccPayment"); }
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

            var query = db.Database.SqlQuery<IProc_Prnt_AccReceive_Result>(_Query).ToList();

            ReportsDetails();

            reportName = Rep.reportName; Send_Pdf = RepPar.Send_Pdf; DocUUID = RepPar.DocUUID; 
            DocPDFFolder = RepPar.DocPDFFolder == null ? "/SavePath/" : RepPar.DocPDFFolder.ToString();
            return query;
        } 

        public IEnumerable<IProc_Prnt_AccAdjust_Result> Rpt_Prnt_AccAdjust(RepFinancials RepPar)
        {
            ReportStandardParameters StandPar = getStandardParameters(RepPar);
            



            var TRId = int.Parse(RepPar.TRId.ToString());
            SqlParameter spTRId = new SqlParameter("@TRId", TRId);

            int Repdesign = RepPar.Repdesign;

            Rep = OpenReport("Rpt_Prnt_AccVendorAdjust");
            int Type = int.Parse(RepPar.Type.ToString());
            if (Type == 0) { Type = int.Parse(Rep.OutputTypeNo); }
            SqlParameter spRepType = new SqlParameter("@RepType", Type);
            if (Repdesign == 1) { Rep = OpenReport("Rpt_Prnt_AccAdjust"); }
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

            var query = db.Database.SqlQuery<IProc_Prnt_AccAdjust_Result>(_Query).ToList();

            ReportsDetails();

            reportName = Rep.reportName; Send_Pdf = RepPar.Send_Pdf; DocUUID = RepPar.DocUUID;
            DocPDFFolder = RepPar.DocPDFFolder == null ? "/SavePath/" : RepPar.DocPDFFolder.ToString();
            return query;
        }
         
        public IEnumerable<IProc_Prnt_OperationCharges_Result> Prnt_OperationCharges(RepFinancials RepPar)
        {
            ReportStandardParameters StandPar = getStandardParameters(RepPar);
            

            int Type = int.Parse(RepPar.RepType.ToString());
            SqlParameter spRepType = new SqlParameter("@RepType", Type);

            var TRId = int.Parse(RepPar.TRId.ToString());
            SqlParameter spTRId = new SqlParameter("@TRId", TRId);


            Rep = OpenReport("Prnt_OperationCharges");


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

            var query = db.Database.SqlQuery<IProc_Prnt_OperationCharges_Result>(_Query).ToList();

            ReportsDetails();

            reportName = Rep.reportName; Send_Pdf = RepPar.Send_Pdf; DocUUID = RepPar.DocUUID;
            DocPDFFolder = RepPar.DocPDFFolder == null ? "/SavePath/" : RepPar.DocPDFFolder.ToString();
            return query;
        }

        public IEnumerable<IProc_Prnt_OperationItems_Result> Prnt_OperationItems(RepFinancials RepPar)
        {

            ReportStandardParameters StandPar = getStandardParameters(RepPar);
            


            int Type = int.Parse(RepPar.RepType.ToString());
            SqlParameter spRepType = new SqlParameter("@RepType", Type);

            int TRId = int.Parse(RepPar.TRId.ToString());
            SqlParameter spTRId = new SqlParameter("@TRId", TRId);



            Rep = OpenReport("Prnt_OperationItems");



            string _Query = "execute " + Rep.dataSource +
           " @comp = '" + StandPar.spComCode.Value + "'" +
           ", @bra = '" + StandPar.spbra.Value + "'" +
           ", @CompNameA = '" + StandPar.spComNameA.Value + "'" +
           ", @CompNameE = '" + StandPar.spComNameE.Value + "'" +
           ", @BraNameA = '" + StandPar.spBraNameA.Value + "'" +
           ", @BraNameE = '" + StandPar.braNameE.Value + "'" +
           ", @LoginUser = '" + StandPar.spLoginUser.Value + "'" +
           ", @RepType = " + spRepType.Value +
           ", @TRId = " + spTRId.Value;



            var query = db.Database.SqlQuery<IProc_Prnt_OperationItems_Result>(_Query).ToList();

            ReportsDetails();

            reportName = Rep.reportName; Send_Pdf = RepPar.Send_Pdf; DocUUID = RepPar.DocUUID;
            DocPDFFolder = RepPar.DocPDFFolder == null ? "/SavePath/" : RepPar.DocPDFFolder.ToString();
            return query;
        }

        public IEnumerable<IProc_Prnt_OperationSalesmanItem_Result> Prnt_OperationSalesmanItem(RepFinancials RepPar)
        {
            ReportStandardParameters StandPar = getStandardParameters(RepPar);
            

            int Type = int.Parse(RepPar.Type.ToString());
            SqlParameter spRepType = new SqlParameter("@RepType", Type);

            var TRId = int.Parse(RepPar.TRId.ToString());
            SqlParameter spTRId = new SqlParameter("@TRId", TRId);

            var SalesmanID = int.Parse(RepPar.SalesmanID.ToString());
            SqlParameter spSalesmanID = new SqlParameter("@Slsid", SalesmanID == -1 ? System.Data.SqlTypes.SqlInt32.Null : SalesmanID);


            Rep = OpenReport("Prnt_OperationSalesmanItem");


            if (Type == 0) { Type = int.Parse(Rep.OutputTypeNo); }


            string _Query = "execute " + Rep.dataSource +
                " @comp = '" + StandPar.spComCode.Value + "'" +
                ", @bra = '" + StandPar.spbra.Value + "'" +
                ", @CompNameA = '" + StandPar.spComNameA.Value + "'" +
                ", @CompNameE = '" + StandPar.spComNameE.Value + "'" +
                ", @BraNameA = '" + StandPar.spBraNameA.Value + "'" +
                ", @BraNameE = '" + StandPar.braNameE.Value + "'" +
                ", @LoginUser = '" + StandPar.spLoginUser.Value + "'" +
                 ",@RepType = " + spRepType.Value +
                 ",@TRId = " + spTRId.Value +
                 ",@Slsid = " + spSalesmanID.Value;
            var query = db.Database.SqlQuery<IProc_Prnt_OperationSalesmanItem_Result>(_Query).ToList();

            ReportsDetails();

            reportName = Rep.reportName; Send_Pdf = RepPar.Send_Pdf; DocUUID = RepPar.DocUUID;
            DocPDFFolder = RepPar.DocPDFFolder == null ? "/SavePath/" : RepPar.DocPDFFolder.ToString();
            return query;
        }

        public IEnumerable<IProc_Rep_OperationSum_Result> Rep_OperationSum(RepFinancials RepPar)
        {
            ReportStandardParameters StandPar = getStandardParameters(RepPar);
            

            int Type = int.Parse(RepPar.Type.ToString());
            SqlParameter spRepType = new SqlParameter("@RepType", Type);

            var TRId = int.Parse(RepPar.TRId.ToString());
            SqlParameter spTRId = new SqlParameter("@TRId", TRId);

            Rep = OpenReport("Rep_OperationSum");


            if (Type == 0) { Type = int.Parse(Rep.OutputTypeNo); }


            string _Query = "execute " + Rep.dataSource +
                " @comp = " + StandPar.spComCode.Value + "" +
                ", @bra = " + StandPar.spbra.Value + "" +
                ", @CompNameA = '" + StandPar.spComNameA.Value + "'" +
                ", @CompNameE = '" + StandPar.spComNameE.Value + "'" +
                ", @BraNameA = '" + StandPar.spBraNameA.Value + "'" +
                ", @BraNameE = '" + StandPar.braNameE.Value + "'" +
                ", @LoginUser = '" + StandPar.spLoginUser.Value + "'" +
                 ",@RepType = " + spRepType.Value +
                 ",@TRId = " + spTRId.Value;
            List<IProc_Rep_OperationSum_Result> query = db.Database.SqlQuery<IProc_Rep_OperationSum_Result>(_Query).ToList();

            ReportsDetails();

            reportName = Rep.reportName; Send_Pdf = RepPar.Send_Pdf; DocUUID = RepPar.DocUUID;
            DocPDFFolder = RepPar.DocPDFFolder == null ? "/SavePath/" : RepPar.DocPDFFolder.ToString();
            return query;
        }



        public IEnumerable<IProc_Rep_OperationSumInternal_Result> Rep_OperationSumInternal(RepFinancials RepPar)
        {
            ReportStandardParameters StandPar = getStandardParameters(RepPar);


            int Type = int.Parse(RepPar.Type.ToString());
            SqlParameter spRepType = new SqlParameter("@RepType", Type);

            var TRId = int.Parse(RepPar.TRId.ToString());
            SqlParameter spTRId = new SqlParameter("@TRId", TRId);

            Rep = OpenReport("Rep_OperationSumInternal");


            if (Type == 0) { Type = int.Parse(Rep.OutputTypeNo); }


            string _Query = "execute " + Rep.dataSource +
                " @comp = " + StandPar.spComCode.Value + "" +
                ", @bra = " + StandPar.spbra.Value + "" +
                ", @CompNameA = '" + StandPar.spComNameA.Value + "'" +
                ", @CompNameE = '" + StandPar.spComNameE.Value + "'" +
                ", @BraNameA = '" + StandPar.spBraNameA.Value + "'" +
                ", @BraNameE = '" + StandPar.braNameE.Value + "'" +
                ", @LoginUser = '" + StandPar.spLoginUser.Value + "'" +
                 ",@RepType = " + spRepType.Value +
                 ",@TRId = " + spTRId.Value;
            List<IProc_Rep_OperationSumInternal_Result> query = db.Database.SqlQuery<IProc_Rep_OperationSumInternal_Result>(_Query).ToList();

            ReportsDetails();

            reportName = Rep.reportName; Send_Pdf = RepPar.Send_Pdf; DocUUID = RepPar.DocUUID;
            DocPDFFolder = RepPar.DocPDFFolder == null ? "/SavePath/" : RepPar.DocPDFFolder.ToString();
            return query;
        }


        public IEnumerable<IProc_Rep_OperationItemSales_Result> Rep_salesrecord(RepFinancials RepPar)
        {
            ReportStandardParameters StandPar = getStandardParameters(RepPar);
            

            int Type = int.Parse(RepPar.Type.ToString());

            var TRId = int.Parse(RepPar.TRId.ToString());
            SqlParameter spTRId = new SqlParameter("@TRId", TRId);

            Rep = OpenReport("Rep_salesrecord");


            if (Type == 0) { Type = int.Parse(Rep.OutputTypeNo); }
            SqlParameter spRepType = new SqlParameter("@RepType", Type);

            string _Query = "execute " + Rep.dataSource +
                " @comp = " + StandPar.spComCode.Value + "" +
                ", @bra = " + StandPar.spbra.Value + "" +
                ", @CompNameA = '" + StandPar.spComNameA.Value + "'" +
                ", @CompNameE = '" + StandPar.spComNameE.Value + "'" +
                ", @BraNameA = '" + StandPar.spBraNameA.Value + "'" +
                ", @BraNameE = '" + StandPar.braNameE.Value + "'" +
                ", @LoginUser = '" + StandPar.spLoginUser.Value + "'" +
                 ",@RepType = " + spRepType.Value +
                 ",@TRId = " + spTRId.Value;

            List<IProc_Rep_OperationItemSales_Result> query = db.Database.SqlQuery<IProc_Rep_OperationItemSales_Result>(_Query).ToList();
            ReportsDetails();

            reportName = Rep.reportName; Send_Pdf = RepPar.Send_Pdf; DocUUID = RepPar.DocUUID;
            DocPDFFolder = RepPar.DocPDFFolder == null ? "/SavePath/" : RepPar.DocPDFFolder.ToString();
            return query;
        }

        public IEnumerable<IProc_Prnt_OperationDeposit_Result> Prnt_OperationDeposit(RepFinancials RepPar)
        {
            ReportStandardParameters StandPar = getStandardParameters(RepPar);
            

            int Type = int.Parse(RepPar.Type.ToString());
            SqlParameter spRepType = new SqlParameter("@RepType", Type);

            var TRId = int.Parse(RepPar.TRId.ToString());
            SqlParameter spTRId = new SqlParameter("@TRId", TRId);

            var SalesmanID = int.Parse(RepPar.SalesmanID.ToString());
            SqlParameter spSalesmanID = new SqlParameter("@Slsid", SalesmanID == -1 ? System.Data.SqlTypes.SqlInt32.Null : SalesmanID);


            Rep = OpenReport("Prnt_OperationDeposit");


            if (Type == 0) { Type = int.Parse(Rep.OutputTypeNo); }

            string _Query = "execute " + Rep.dataSource +
                " @comp = '" + StandPar.spComCode.Value + "'" +
                ", @bra = '" + StandPar.spbra.Value + "'" +
                ", @CompNameA = '" + StandPar.spComNameA.Value + "'" +
                ", @CompNameE = '" + StandPar.spComNameE.Value + "'" +
                ", @BraNameA = '" + StandPar.spBraNameA.Value + "'" +
                ", @BraNameE = '" + StandPar.braNameE.Value + "'" +
                ", @LoginUser = '" + StandPar.spLoginUser.Value + "'" +
                 ",@RepType = " + spRepType.Value +
                 ",@TRId = " + spTRId.Value +
                 ",@Slsid = " + spSalesmanID.Value;

            List<IProc_Prnt_OperationDeposit_Result> query = db.Database.SqlQuery<IProc_Prnt_OperationDeposit_Result>(_Query).ToList();

            ReportsDetails();

            reportName = Rep.reportName; Send_Pdf = RepPar.Send_Pdf; DocUUID = RepPar.DocUUID;
            DocPDFFolder = RepPar.DocPDFFolder == null ? "/SavePath/" : RepPar.DocPDFFolder.ToString();
            return query;
        }

        public IEnumerable<IProc_Prnt_SlsInvoiceVer2_Result> Rpt_Prnt_SlsInvoice(RepFinancials RepPar)
        {
            ReportStandardParameters StandPar = getStandardParameters(RepPar);
            

            var TRId = int.Parse(RepPar.TRId.ToString());
            SqlParameter spTRId = new SqlParameter("@TRId", TRId);
            int typ = int.Parse(RepPar.Typ.ToString());


            //DocUUID = db.Database.SqlQuery<string>("select  DocUUID from I_Sls_TR_Invoice where InvoiceID = " + TRId).FirstOrDefault();
            //if (DocUUID.Trim() == "")
            //{
            //    DocUUID = RepPar.DocUUID;
            //}
            DocUUID = RepPar.DocUUID;

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

            reportName = Rep.reportName; Send_Pdf = RepPar.Send_Pdf;  
            DocPDFFolder = RepPar.DocPDFFolder == null ? "/SavePath/" : RepPar.DocPDFFolder.ToString();
            return query;
        }

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

            ReportsDetails();

            reportName = Rep.reportName; Send_Pdf = RepPar.Send_Pdf; DocUUID = RepPar.DocUUID;
            DocPDFFolder = RepPar.DocPDFFolder == null ? "/SavePath/" : RepPar.DocPDFFolder.ToString();
            return query;
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

            ReportsDetails();

            reportName = Rep.reportName; Send_Pdf = RepPar.Send_Pdf; DocUUID = RepPar.DocUUID;
            DocPDFFolder = RepPar.DocPDFFolder == null ? "/SavePath/" : RepPar.DocPDFFolder.ToString();
            return query;
        }

        public IEnumerable<IProc_Prnt_PurReceive_Result> Rpt_Prnt_PurReceive(RepFinancials RepPar)
        {
            ReportStandardParameters StandPar = getStandardParameters(RepPar);
            


            var TRId = int.Parse(RepPar.TRId.ToString());
            SqlParameter spTRId = new SqlParameter("@TRId", TRId);

            int Repdesign = RepPar.Repdesign;
            if (Repdesign == 0)
            {
                Rep = OpenReport("Rpt_Prnt_PurReceive");
            }
            else
            {
                Rep = OpenReport("Rpt_Prnt_PurReceiveorder");

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
                 ",@TRId = " + spTRId.Value;

            var query = db.Database.SqlQuery<IProc_Prnt_PurReceive_Result>(_Query).ToList();
            ReportsDetails();

            
          
            ReportsDetails();
            reportName = Rep.reportName; Send_Pdf = RepPar.Send_Pdf; DocUUID = RepPar.DocUUID;
            DocPDFFolder = RepPar.DocPDFFolder == null ? "/SavePath/" : RepPar.DocPDFFolder.ToString();
            return query;
        }

        public IEnumerable<IProc_Prnt_PurReceive_Result> Prnt_PurReceivePrice(RepFinancials RepPar)
        {
            ReportStandardParameters StandPar = getStandardParameters(RepPar);
            


            var TRId = int.Parse(RepPar.TRId.ToString());
            SqlParameter spTRId = new SqlParameter("@TRId", TRId);

            int Repdesign = RepPar.Repdesign;


            Rep = OpenReport("Rpt_Prnt_PurReceivePrice");




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
                 ",@TRId = " + spTRId.Value;

            var query = db.Database.SqlQuery<IProc_Prnt_PurReceive_Result>(_Query).ToList();

            ReportsDetails();
            reportName = Rep.reportName; Send_Pdf = RepPar.Send_Pdf; DocUUID = RepPar.DocUUID;
            DocPDFFolder = RepPar.DocPDFFolder == null ? "/SavePath/" : RepPar.DocPDFFolder.ToString();
            return query;
        }

        public IEnumerable<IProc_Prnt_PurReceiveRet_Result> Prnt_PurReceiveRet(RepFinancials RepPar)
        {
            ReportStandardParameters StandPar = getStandardParameters(RepPar);
            


            var TRId = int.Parse(RepPar.TRId.ToString());
            SqlParameter spTRId = new SqlParameter("@TRId", TRId);

            int Repdesign = RepPar.Repdesign;

            Rep = OpenReport("Rpt_Prnt_PurReceiveReturn");

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
                 ",@TRId = " + spTRId.Value;

            var query = db.Database.SqlQuery<IProc_Prnt_PurReceiveRet_Result>(_Query).ToList();

            ReportsDetails();
            reportName = Rep.reportName; Send_Pdf = RepPar.Send_Pdf; DocUUID = RepPar.DocUUID;
            DocPDFFolder = RepPar.DocPDFFolder == null ? "/SavePath/" : RepPar.DocPDFFolder.ToString();
            return query;
        }

        public IEnumerable<IProc_Prnt_SlsInvoiceVer2_Result> Rpt_Prnt_SlsInvoicepr(RepFinancials RepPar)
        {
            ReportStandardParameters StandPar = getStandardParameters(RepPar);
            
            var typ = int.Parse(RepPar.Typ.ToString());




            var TRId = int.Parse(RepPar.TRId.ToString());
            SqlParameter spTRId = new SqlParameter("@TRId", TRId);
            var slip = int.Parse(RepPar.slip.ToString());

            //DocUUID = db.Database.SqlQuery<string>("select  DocUUID from I_Sls_TR_Invoice where InvoiceID = " + TRId).FirstOrDefault();
            DocUUID = RepPar.DocUUID;
            int Repdesign = RepPar.Repdesign;
            if (slip == 0)
            {
                Rep = OpenReport("Rpt_Prnt_CashInvoiceVer");
            }
            else
            {
                Rep = OpenReport("Slip_CashInvoiceVer");
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

            ReportsDetails();
            reportName = Rep.reportName; Send_Pdf = RepPar.Send_Pdf;  
            DocPDFFolder = RepPar.DocPDFFolder == null ? "/SavePath/" : RepPar.DocPDFFolder.ToString();
            return query;
        }

        public IEnumerable<IProc_Rpt_AccCustomerSummary_Result> Rpt_AccCustomerSummary(RepFinancials RepPar)
        {
            ReportStandardParameters StandPar = getStandardParameters(RepPar);
            

            //ReportInfo Rep;
            int Type = int.Parse(RepPar.RepType.ToString());
            SqlParameter spRepType = new SqlParameter("@RepType", Type);

            string formDate = RepPar.FromDate.ToString();
            SqlParameter spformDate = new SqlParameter("@FromDate", formDate);

            string toDate = RepPar.ToDate.ToString();
            SqlParameter sptoDate = new SqlParameter("@ToDate", toDate);

            int CatId = int.Parse(RepPar.CatId.ToString());
            SqlParameter spCatId = new SqlParameter("@CatId", CatId == -1 ? System.Data.SqlTypes.SqlInt32.Null : CatId);

            int CustomerID = int.Parse(RepPar.CustomerID.ToString());
            SqlParameter spCustomerID = new SqlParameter("@CustomerID", CustomerID == -1 ? System.Data.SqlTypes.SqlInt32.Null : CustomerID);

            int Groupid = int.Parse(RepPar.Groupid.ToString());
            SqlParameter spGroupid = new SqlParameter("@Groupid", Groupid == -1 ? System.Data.SqlTypes.SqlInt32.Null : Groupid);

            int Status = int.Parse(RepPar.Status.ToString());
            SqlParameter spStatus = new SqlParameter("@Status", Status == -1 ? System.Data.SqlTypes.SqlInt32.Null : Status);

            int BalType = int.Parse(RepPar.BalType.ToString());
            SqlParameter spBalType = new SqlParameter("@BalStatus", BalType);

            int SalesmanID = int.Parse(RepPar.SalesmanID.ToString());
            SqlParameter spSalesmanID = new SqlParameter("@SalesmanID", SalesmanID == -1 ? System.Data.SqlTypes.SqlInt32.Null : SalesmanID);


            int orderby = int.Parse(RepPar.orderby.ToString());
            SqlParameter sporderby = new SqlParameter("@orderby", orderby == -1 ? System.Data.SqlTypes.SqlInt32.Null : orderby);


            Rep = OpenReport("Rpt_AccCustomerSummary_total");


            string _Query = "execute " + Rep.dataSource +
           " @comp = '" + StandPar.spComCode.Value + "'" +
           ", @bra = '" + StandPar.spbra.Value + "'" +
           ", @CompNameA = '" + StandPar.spComNameA.Value + "'" +
           ", @CompNameE = '" + StandPar.spComNameE.Value + "'" +
           ", @BraNameA = '" + StandPar.spBraNameA.Value + "'" +
           ", @BraNameE = '" + StandPar.braNameE.Value + "'" +
           ", @LoginUser = '" + StandPar.spLoginUser.Value + "'" +
           ", @RepType = " + spRepType.Value +
           ", @CatID = " + spCatId.Value +
           ", @Groupid = " + spGroupid.Value +
           ", @CustomerID = " + spCustomerID.Value +
           ", @SalesManID = " + spSalesmanID.Value +
           ", @status = " + spStatus.Value +
           ", @FromDate = '" + spformDate.Value + "'" +
           ", @Todate = '" + sptoDate.Value + "'" +
           ", @BalType = " + spBalType.Value +
           ", @orderby = " + sporderby.Value;

            List<IProc_Rpt_AccCustomerSummary_Result> query = db.Database.SqlQuery<IProc_Rpt_AccCustomerSummary_Result>(_Query).ToList();
            ReportsDetails();
            reportName = Rep.reportName; Send_Pdf = RepPar.Send_Pdf; DocUUID = RepPar.DocUUID;

            DocPDFFolder = RepPar.DocPDFFolder == null ? "/SavePath/" : RepPar.DocPDFFolder.ToString();
            return query;
        }

        public IEnumerable<IProc_Rpt_AccCustomerDetail_Result> Rpt_AccCustomerDetail(RepFinancials RepPar)
        {
            ReportStandardParameters StandPar = getStandardParameters(RepPar);
            

            //ReportInfo Rep;
            int Type = int.Parse(RepPar.RepType.ToString());
            SqlParameter spRepType = new SqlParameter("@RepType", Type);

            string formDate = RepPar.FromDate.ToString();
            SqlParameter spformDate = new SqlParameter("@FromDate", formDate);

            string toDate = RepPar.ToDate.ToString();
            SqlParameter sptoDate = new SqlParameter("@ToDate", toDate);

            int CatId = int.Parse(RepPar.CatId.ToString());
            SqlParameter spCatId = new SqlParameter("@CatId", CatId == -1 ? System.Data.SqlTypes.SqlInt32.Null : CatId);

            int CustomerID = int.Parse(RepPar.CustomerID.ToString());
            SqlParameter spCustomerID = new SqlParameter("@CustomerID", CustomerID == -1 ? System.Data.SqlTypes.SqlInt32.Null : CustomerID);

            int Groupid = int.Parse(RepPar.Groupid.ToString());
            SqlParameter spGroupid = new SqlParameter("@Groupid", Groupid == -1 ? System.Data.SqlTypes.SqlInt32.Null : Groupid);

            int Status = int.Parse(RepPar.Status.ToString());
            SqlParameter spStatus = new SqlParameter("@Status", Status == -1 ? System.Data.SqlTypes.SqlInt32.Null : Status);

            int BalType = int.Parse(RepPar.BalType.ToString());
            SqlParameter spBalType = new SqlParameter("@BalStatus", BalType);

            int SalesmanID = int.Parse(RepPar.SalesmanID.ToString());
            SqlParameter spSalesmanID = new SqlParameter("@SalesmanID", SalesmanID == -1 ? System.Data.SqlTypes.SqlInt32.Null : SalesmanID);

            Rep = OpenReport("Rpt_AccCustomerSummary_detail");

            string _Query = "execute " + Rep.dataSource +
           " @comp = '" + StandPar.spComCode.Value + "'" +
           ", @bra = '" + StandPar.spbra.Value + "'" +
           ", @CompNameA = '" + StandPar.spComNameA.Value + "'" +
           ", @CompNameE = '" + StandPar.spComNameE.Value + "'" +
           ", @BraNameA = '" + StandPar.spBraNameA.Value + "'" +
           ", @BraNameE = '" + StandPar.braNameE.Value + "'" +
           ", @LoginUser = '" + StandPar.spLoginUser.Value + "'" +
           ", @RepType = " + spRepType.Value +
           ", @CatID = " + spCatId.Value +
           ", @Groupid = " + spGroupid.Value +
           ", @CustomerID = " + spCustomerID.Value +
           ", @SalesManID = " + spSalesmanID.Value +
           ", @status = " + spStatus.Value +
           ", @FromDate = '" + spformDate.Value + "'" +
           ", @Todate = '" + sptoDate.Value + "'" +
           ", @BalType = " + spBalType.Value;

            List<IProc_Rpt_AccCustomerDetail_Result> query = db.Database.SqlQuery<IProc_Rpt_AccCustomerDetail_Result>(_Query).ToList();
            ReportsDetails();
            reportName = Rep.reportName; Send_Pdf = RepPar.Send_Pdf; DocUUID = RepPar.DocUUID;

            DocPDFFolder = RepPar.DocPDFFolder == null ? "/SavePath/" : RepPar.DocPDFFolder.ToString();
            return query;
        }

        public IEnumerable<IProc_Rpt_AccVendorDetail_Result> Rpt_AccVendorDetail(RepFinancials RepPar)
        {
            ReportStandardParameters StandPar = getStandardParameters(RepPar);
            

            //ReportInfo Rep;
            int Type = int.Parse(RepPar.RepType.ToString());
            SqlParameter spRepType = new SqlParameter("@RepType", Type);

            string formDate = RepPar.FromDate.ToString();
            SqlParameter spformDate = new SqlParameter("@FromDate", formDate);

            string toDate = RepPar.ToDate.ToString();
            SqlParameter sptoDate = new SqlParameter("@ToDate", toDate);

            int CatId = int.Parse(RepPar.CatId.ToString());
            SqlParameter spCatId = new SqlParameter("@CatId", CatId == -1 ? System.Data.SqlTypes.SqlInt32.Null : CatId);

            int CustomerID = int.Parse(RepPar.CustomerID.ToString());
            SqlParameter spCustomerID = new SqlParameter("@CustomerID", CustomerID == -1 ? System.Data.SqlTypes.SqlInt32.Null : CustomerID);

            int Groupid = int.Parse(RepPar.Groupid.ToString());
            SqlParameter spGroupid = new SqlParameter("@Groupid", Groupid == -1 ? System.Data.SqlTypes.SqlInt32.Null : Groupid);

            int Status = int.Parse(RepPar.Status.ToString());
            SqlParameter spStatus = new SqlParameter("@Status", Status);

            int BalType = int.Parse(RepPar.BalType.ToString());
            SqlParameter spBalType = new SqlParameter("@BalType", BalType);

            int VendType = int.Parse(RepPar.VendType.ToString());
            SqlParameter spVendType = new SqlParameter("@VendType", VendType == -1 ? System.Data.SqlTypes.SqlInt32.Null : VendType);

            int VendorId = int.Parse(RepPar.VendorId.ToString());
            SqlParameter spVendorId = new SqlParameter("@CustomerID", VendorId == -1 ? System.Data.SqlTypes.SqlInt32.Null : VendorId);


            Rep = OpenReport("Rpt_AccVendorDetail");




            string _Query = "execute " + Rep.dataSource +
           " @comp = '" + StandPar.spComCode.Value + "'" +
           ", @bra = '" + StandPar.spbra.Value + "'" +
           ", @CompNameA = '" + StandPar.spComNameA.Value + "'" +
           ", @CompNameE = '" + StandPar.spComNameE.Value + "'" +
           ", @BraNameA = '" + StandPar.spBraNameA.Value + "'" +
           ", @BraNameE = '" + StandPar.braNameE.Value + "'" +
           ", @LoginUser = '" + StandPar.spLoginUser.Value + "'" +
           ", @RepType = " + spRepType.Value +
           ", @CatID = " + spCatId.Value +
           ", @Groupid = " + spGroupid.Value +
           ", @CustomerID = " + spVendorId.Value +
           ", @VendType = " + spVendType.Value +
           ", @status = " + spStatus.Value +
           ", @FromDate = '" + spformDate.Value + "'" +
           ", @Todate = '" + sptoDate.Value + "'" +
           ", @BalType = " + spBalType.Value;

            List<IProc_Rpt_AccVendorDetail_Result> query = db.Database.SqlQuery<IProc_Rpt_AccVendorDetail_Result>(_Query).ToList();
            ReportsDetails();
            reportName = Rep.reportName; Send_Pdf = RepPar.Send_Pdf; DocUUID = RepPar.DocUUID;
            DocPDFFolder = RepPar.DocPDFFolder == null ? "/SavePath/" : RepPar.DocPDFFolder.ToString();
            return query;
        }

        public IEnumerable<IProc_Rpt_AccVendorSummary_Result> Rpt_AccVendorSummary(RepFinancials RepPar)
        {
            ReportStandardParameters StandPar = getStandardParameters(RepPar);
            

            //ReportInfo Rep;
            int Type = int.Parse(RepPar.RepType.ToString());
            SqlParameter spRepType = new SqlParameter("@RepType", Type);

            string formDate = RepPar.FromDate.ToString();
            SqlParameter spformDate = new SqlParameter("@FromDate", formDate);

            string toDate = RepPar.ToDate.ToString();
            SqlParameter sptoDate = new SqlParameter("@ToDate", toDate);

            int CatId = int.Parse(RepPar.CatId.ToString());
            SqlParameter spCatId = new SqlParameter("@CatId", CatId == -1 ? System.Data.SqlTypes.SqlInt32.Null : CatId);

            int VendorId = int.Parse(RepPar.VendorId.ToString());
            SqlParameter spVendorId = new SqlParameter("@CustomerID", VendorId == -1 ? System.Data.SqlTypes.SqlInt32.Null : VendorId);

            int Groupid = int.Parse(RepPar.Groupid.ToString());
            SqlParameter spGroupid = new SqlParameter("@GroupID", Groupid == -1 ? System.Data.SqlTypes.SqlInt32.Null : Groupid);

            int Status = int.Parse(RepPar.Status.ToString());
            SqlParameter spStatus = new SqlParameter("@status", Status == -1 ? System.Data.SqlTypes.SqlInt32.Null : Status);

            int BalType = int.Parse(RepPar.BalType.ToString());
            SqlParameter spBalType = new SqlParameter("@BalStatus", BalType);

            int VendType = int.Parse(RepPar.VendType.ToString());
            SqlParameter spVendType = new SqlParameter("@VendType", VendType == -1 ? System.Data.SqlTypes.SqlInt32.Null : VendType);



            int orderby = int.Parse(RepPar.orderby.ToString());
            SqlParameter sporderby = new SqlParameter("@orderby", orderby == -1 ? System.Data.SqlTypes.SqlInt32.Null : orderby);


            Rep = OpenReport("Rpt_AccVendorSummary");



            string _Query = "execute " + Rep.dataSource +
           " @comp = '" + StandPar.spComCode.Value + "'" +
           ", @bra = '" + StandPar.spbra.Value + "'" +
           ", @CompNameA = '" + StandPar.spComNameA.Value + "'" +
           ", @CompNameE = '" + StandPar.spComNameE.Value + "'" +
           ", @BraNameA = '" + StandPar.spBraNameA.Value + "'" +
           ", @BraNameE = '" + StandPar.braNameE.Value + "'" +
           ", @LoginUser = '" + StandPar.spLoginUser.Value + "'" +
           ", @RepType = " + spRepType.Value +
           ", @CatID = " + spCatId.Value +
           ", @GroupID = " + spGroupid.Value +
           ", @CustomerID = " + spVendorId.Value +
           ", @VendType = " + spVendType.Value +
           ", @status = " + spStatus.Value +
           ", @BalType = " + spBalType.Value +
           ", @FromDate = '" + spformDate.Value + "'" +
           ", @Todate = '" + sptoDate.Value + "'" +
            ", @orderby = " + sporderby.Value;

            List<IProc_Rpt_AccVendorSummary_Result> query = db.Database.SqlQuery<IProc_Rpt_AccVendorSummary_Result>(_Query).ToList();
            ReportsDetails();
            reportName = Rep.reportName; Send_Pdf = RepPar.Send_Pdf; DocUUID = RepPar.DocUUID;
            DocPDFFolder = RepPar.DocPDFFolder == null ? "/SavePath/" : RepPar.DocPDFFolder.ToString();
            return query;
        }

        public IEnumerable<IProc_Rpt_ItemStockSummary_Result> Rpt_ItemStockSummary(RepFinancials RepPar)
        {
            ReportStandardParameters StandPar = getStandardParameters(RepPar);
            

            //ReportInfo Rep;
            int Type = int.Parse(RepPar.RepType.ToString());
            SqlParameter spRepType = new SqlParameter("@RepType", Type);

            string formDate = RepPar.FromDate.ToString();
            SqlParameter spformDate = new SqlParameter("@FromDate", formDate);

            string toDate = RepPar.ToDate.ToString();
            SqlParameter sptoDate = new SqlParameter("@ToDate", toDate);

            int CatId = int.Parse(RepPar.CatId.ToString());
            SqlParameter spCatId = new SqlParameter("@CatId", CatId == -1 ? System.Data.SqlTypes.SqlInt32.Null : CatId);

            int ItemFamId = int.Parse(RepPar.ItemFamId.ToString());
            SqlParameter spItemFamId = new SqlParameter("@ItemFamId", ItemFamId == -1 ? System.Data.SqlTypes.SqlInt32.Null : ItemFamId);

            int ItemID = int.Parse(RepPar.ItemID.ToString());
            SqlParameter spItemID = new SqlParameter("@ItemID", ItemID == -1 ? System.Data.SqlTypes.SqlInt32.Null : ItemID);

            int BalType = int.Parse(RepPar.BalType.ToString());
            SqlParameter spBalType = new SqlParameter("@BalStatus", BalType);

            int Status = int.Parse(RepPar.Status.ToString());
            SqlParameter spStatus = new SqlParameter("@Status", Status);

            int type = int.Parse(RepPar.check.ToString());
            SqlParameter sptype = new SqlParameter("@type", type);

            Rep = OpenReport("Rpt_ItemStockSummary");


            string _Query = "execute " + Rep.dataSource +
           " @comp = '" + StandPar.spComCode.Value + "'" +
           ", @bra = '" + StandPar.spbra.Value + "'" +
           ", @CompNameA = '" + StandPar.spComNameA.Value + "'" +
           ", @CompNameE = '" + StandPar.spComNameE.Value + "'" +
           ", @BraNameA = '" + StandPar.spBraNameA.Value + "'" +
           ", @BraNameE = '" + StandPar.braNameE.Value + "'" +
           ", @LoginUser = '" + StandPar.spLoginUser.Value + "'" +
           ", @RepType = " + spRepType.Value +
           ", @CatID = " + spCatId.Value +
           ", @ItemFamId = " + spItemFamId.Value +
           ", @ItemID = " + spItemID.Value +
           ", @type = " + sptype.Value +
           ", @status = " + spStatus.Value +
           ", @FromDate = '" + spformDate.Value + "'" +
           ", @Todate = '" + sptoDate.Value + "'" +
           ", @BalType = " + spBalType.Value;

            List<IProc_Rpt_ItemStockSummary_Result> query = db.Database.SqlQuery<IProc_Rpt_ItemStockSummary_Result>(_Query).ToList();
            ReportsDetails();
            reportName = Rep.reportName; Send_Pdf = RepPar.Send_Pdf; DocUUID = RepPar.DocUUID;
            DocPDFFolder = RepPar.DocPDFFolder == null ? "/SavePath/" : RepPar.DocPDFFolder.ToString();

            return query;
        }

        public IEnumerable<IProc_Rpt_ItemStockValue_Result> Rpt_ItemStockValue(RepFinancials RepPar)
        {
            ReportStandardParameters StandPar = getStandardParameters(RepPar);
            

            //ReportInfo Rep;
            int Type = int.Parse(RepPar.RepType.ToString());
            SqlParameter spRepType = new SqlParameter("@RepType", Type);

            string formDate = RepPar.FromDate.ToString();
            SqlParameter spformDate = new SqlParameter("@FromDate", formDate);

            string toDate = RepPar.ToDate.ToString();
            SqlParameter sptoDate = new SqlParameter("@ToDate", toDate);

            int CatId = int.Parse(RepPar.CatId.ToString());
            SqlParameter spCatId = new SqlParameter("@CatId", CatId == -1 ? System.Data.SqlTypes.SqlInt32.Null : CatId);

            int ItemFamId = int.Parse(RepPar.ItemFamId.ToString());
            SqlParameter spItemFamId = new SqlParameter("@ItemFamId", ItemFamId == -1 ? System.Data.SqlTypes.SqlInt32.Null : ItemFamId);

            int ItemID = int.Parse(RepPar.ItemID.ToString());
            SqlParameter spItemID = new SqlParameter("@ItemID", ItemID == -1 ? System.Data.SqlTypes.SqlInt32.Null : ItemID);

            int Status = int.Parse(RepPar.Status.ToString());
            SqlParameter spStatus = new SqlParameter("@Status", Status);

            int check = int.Parse(RepPar.check.ToString());
            SqlParameter spcheck = new SqlParameter("@type", check);

            Rep = OpenReport("Rpt_ItemStockValue");


            string _Query = "execute " + Rep.dataSource +
           " @comp = '" + StandPar.spComCode.Value + "'" +
           ", @bra = '" + StandPar.spbra.Value + "'" +
           ", @CompNameA = '" + StandPar.spComNameA.Value + "'" +
           ", @CompNameE = '" + StandPar.spComNameE.Value + "'" +
           ", @BraNameA = '" + StandPar.spBraNameA.Value + "'" +
           ", @BraNameE = '" + StandPar.braNameE.Value + "'" +
           ", @LoginUser = '" + StandPar.spLoginUser.Value + "'" +
           ", @RepType = " + spRepType.Value +
           ", @CatID = " + spCatId.Value +
           ", @ItemFamId = " + spItemFamId.Value +
           ", @ItemID = " + spItemID.Value +
           ", @type = " + spcheck.Value +
           ", @status = " + spStatus.Value +
           ", @FromDate = '" + spformDate.Value + "'" +
           ", @Todate = '" + sptoDate.Value + "'";

            List<IProc_Rpt_ItemStockValue_Result> query = db.Database.SqlQuery<IProc_Rpt_ItemStockValue_Result>(_Query).ToList();
            ReportsDetails();
            reportName = Rep.reportName; Send_Pdf = RepPar.Send_Pdf; DocUUID = RepPar.DocUUID;
            DocPDFFolder = RepPar.DocPDFFolder == null ? "/SavePath/" : RepPar.DocPDFFolder.ToString();
            return query;
        }

        public IEnumerable<IProc_Rpt_ItemStockIncome_Result> Rpt_ItemStockIncome(RepFinancials RepPar)
        {
            ReportStandardParameters StandPar = getStandardParameters(RepPar);
            

            //ReportInfo Rep;
            int Type = int.Parse(RepPar.RepType.ToString());
            SqlParameter spRepType = new SqlParameter("@RepType", Type);

            string formDate = RepPar.FromDate.ToString();
            SqlParameter spformDate = new SqlParameter("@FromDate", formDate);

            string toDate = RepPar.ToDate.ToString();
            SqlParameter sptoDate = new SqlParameter("@ToDate", toDate);

            int CatId = int.Parse(RepPar.CatId.ToString());
            SqlParameter spCatId = new SqlParameter("@CatId", CatId == -1 ? System.Data.SqlTypes.SqlInt32.Null : CatId);

            int ItemFamId = int.Parse(RepPar.ItemFamId.ToString());
            SqlParameter spItemFamId = new SqlParameter("@ItemFamId", ItemFamId == -1 ? System.Data.SqlTypes.SqlInt32.Null : ItemFamId);

            int ItemID = int.Parse(RepPar.ItemID.ToString());
            SqlParameter spItemID = new SqlParameter("@ItemID", ItemID == -1 ? System.Data.SqlTypes.SqlInt32.Null : ItemID);

            int Status = int.Parse(RepPar.Status.ToString());
            SqlParameter spStatus = new SqlParameter("@Status", Status);

            int type = int.Parse(RepPar.check.ToString());
            SqlParameter sptype = new SqlParameter("@type", type);

            Rep = OpenReport("Rpt_ItemStockIncome");


            string _Query = "execute " + Rep.dataSource +
           " @comp = '" + StandPar.spComCode.Value + "'" +
           ", @bra = '" + StandPar.spbra.Value + "'" +
           ", @CompNameA = '" + StandPar.spComNameA.Value + "'" +
           ", @CompNameE = '" + StandPar.spComNameE.Value + "'" +
           ", @BraNameA = '" + StandPar.spBraNameA.Value + "'" +
           ", @BraNameE = '" + StandPar.braNameE.Value + "'" +
           ", @LoginUser = '" + StandPar.spLoginUser.Value + "'" +
           ", @RepType = " + spRepType.Value +
           ", @CatID = " + spCatId.Value +
           ", @ItemFamId = " + spItemFamId.Value +
           ", @ItemID = " + spItemID.Value +
           ", @type = " + sptype.Value +
           ", @status = " + spStatus.Value +
           ", @FromDate = '" + spformDate.Value + "'" +
           ", @Todate = '" + sptoDate.Value + "'";

            List<IProc_Rpt_ItemStockIncome_Result> query = db.Database.SqlQuery<IProc_Rpt_ItemStockIncome_Result>(_Query).ToList();
            ReportsDetails();
            reportName = Rep.reportName; Send_Pdf = RepPar.Send_Pdf; DocUUID = RepPar.DocUUID;
            DocPDFFolder = RepPar.DocPDFFolder == null ? "/SavePath/" : RepPar.DocPDFFolder.ToString();
            return query;
        }

        public IEnumerable<AProc_Rpt_GLFinancialStatment_Result> Rpt_GLFinancialStatment(RepFinancials RepPar)
        {
            ReportStandardParameters StandPar = getStandardParameters(RepPar);
            

            //ReportInfo Rep;
            int Type = int.Parse(RepPar.RepType.ToString());
            SqlParameter spRepType = new SqlParameter("@RepType", Type);

            string formDate = RepPar.FromDate.ToString();
            SqlParameter spformDate = new SqlParameter("@FromDate", formDate);

            string toDate = RepPar.ToDate.ToString();
            SqlParameter sptoDate = new SqlParameter("@ToDate", toDate);

            string cc_Code = RepPar.cc_code.ToString();
            SqlParameter spcc_Code = new SqlParameter("@cc_Code", cc_Code == "-1" ? null : cc_Code);

            int Level = int.Parse(RepPar.Level.ToString());
            SqlParameter spLevel = new SqlParameter("@Level", Level == -1 ? System.Data.SqlTypes.SqlInt32.Null : Level);

            int IsAuthVchr = int.Parse(RepPar.IsAuthVchr.ToString());
            SqlParameter spIsAuthVchr = new SqlParameter("@IsAuthVchr", IsAuthVchr);

            int IsNewVchr = int.Parse(RepPar.IsNewVchr.ToString());
            SqlParameter spIsNewVchr = new SqlParameter("@IsNewVchr", IsNewVchr);

            int ExZero = int.Parse(RepPar.exzero.ToString());
            SqlParameter spExZero = new SqlParameter("@ExZero", ExZero);

            int Typ = int.Parse(RepPar.Typ.ToString());
            SqlParameter spTyp = new SqlParameter("@type", Typ);

            if (Typ == 1)
            {
                Rep = OpenReport("Rpt_GLFinancialTrailbalance");

            }

            else if (Typ == 2)
            {
                Rep = OpenReport("Rpt_GLFinancialIncome");

            }
            else
            {
                Rep = OpenReport("Rpt_GLFinancialbalancesheet");
            }






            string _Query = "execute " + Rep.dataSource +
           " @comp = '" + StandPar.spComCode.Value + "'" +
           ", @bra = '" + StandPar.spbra.Value + "'" +
           ", @CompNameA = '" + StandPar.spComNameA.Value + "'" +
           ", @CompNameE = '" + StandPar.spComNameE.Value + "'" +
           ", @BraNameA = '" + StandPar.spBraNameA.Value + "'" +
           ", @BraNameE = '" + StandPar.braNameE.Value + "'" +
           ", @LoginUser = '" + StandPar.spLoginUser.Value + "'" +
           ", @RepType = " + spRepType.Value +
           ", @FromDate = '" + spformDate.Value + "'" +
           ", @Todate = '" + sptoDate.Value + "'" +
           ", @cc_Code ='" + spcc_Code.Value + "'" +
           ", @IsAuthVchr = " + spIsAuthVchr.Value +
           ", @IsNewVchr = " + spIsNewVchr.Value +
           ", @Level = " + spLevel.Value +
           ", @ExZero = " + spExZero.Value +
           ", @RepTyp = " + spTyp.Value;


            List<AProc_Rpt_GLFinancialStatment_Result> query = db.Database.SqlQuery<AProc_Rpt_GLFinancialStatment_Result>(_Query).ToList();
            ReportsDetails();
            reportName = Rep.reportName; Send_Pdf = RepPar.Send_Pdf; DocUUID = RepPar.DocUUID;
            DocPDFFolder = RepPar.DocPDFFolder == null ? "/SavePath/" : RepPar.DocPDFFolder.ToString();
            return query;
        }

        public IEnumerable<AProc_Rpt_GLGeneralLedger_Result> Rpt_GLGeneralLedger(RepFinancials RepPar)
        {
            ReportStandardParameters StandPar = getStandardParameters(RepPar);
            

            //ReportInfo Rep;
            int Type = int.Parse(RepPar.RepType.ToString());
            SqlParameter spRepType = new SqlParameter("@RepType", Type);

            string formDate = RepPar.FromDate.ToString();
            SqlParameter spformDate = new SqlParameter("@FromDate", formDate);

            string toDate = RepPar.ToDate.ToString();
            SqlParameter sptoDate = new SqlParameter("@ToDate", toDate);

            string cc_Code = RepPar.cc_code.ToString();
            SqlParameter spcc_Code = new SqlParameter("@cc_Code", cc_Code == "-1" ? "" : cc_Code);

            string AccCode = RepPar.AccCode.ToString();
            SqlParameter spAccCode = new SqlParameter("@AccCode", AccCode == "-1" ? "" : AccCode);

            int IsAuthVchr = int.Parse(RepPar.IsAuthVchr.ToString());
            SqlParameter spIsAuthVchr = new SqlParameter("@IsAuthVchr", IsAuthVchr);

            int IsNewVchr = int.Parse(RepPar.IsNewVchr.ToString());
            SqlParameter spIsNewVchr = new SqlParameter("@IsNewVchr", IsNewVchr);

            int OpenType = int.Parse(RepPar.OpenType.ToString());
            SqlParameter spOpenType = new SqlParameter("@OpenType", OpenType == -1 ? System.Data.SqlTypes.SqlInt32.Null : OpenType);

            int PrdType = int.Parse(RepPar.PrdType.ToString());
            SqlParameter spPrdType = new SqlParameter("@PrdType", PrdType);

            int EndType = int.Parse(RepPar.EndType.ToString());
            SqlParameter spEndType = new SqlParameter("@EndType", EndType);

            Rep = OpenReport("Rpt_GLGeneralLedger");


            string _Query = "execute " + Rep.dataSource +
           " @comp = " + StandPar.spComCode.Value +
           ", @bra = " + StandPar.spbra.Value +
           ", @CompNameA = '" + StandPar.spComNameA.Value + "'" +
           ", @CompNameE = '" + StandPar.spComNameE.Value + "'" +
           ", @BraNameA = '" + StandPar.spBraNameA.Value + "'" +
           ", @BraNameE = '" + StandPar.braNameE.Value + "'" +
           ", @LoginUser = '" + StandPar.spLoginUser.Value + "'" +
           ", @RepType = " + spRepType.Value +
           ", @FromDate ='" + spformDate.Value + "'" +
           ", @Todate = '" + sptoDate.Value + "'" +
           ", @cc_Code ='" + spcc_Code.Value + "'" +
           ", @AccCode ='" + spAccCode.Value + "'" +
           ", @IsAuthVchr = " + spIsAuthVchr.Value +
           ", @IsNewVchr = " + spIsNewVchr.Value +
           ", @PrdType = " + spPrdType.Value +
           ", @OpenType = " + spOpenType.Value +
           ", @EndType = " + spEndType.Value;


            List<AProc_Rpt_GLGeneralLedger_Result> query = db.Database.SqlQuery<AProc_Rpt_GLGeneralLedger_Result>(_Query).ToList();
            ReportsDetails();
            reportName = Rep.reportName; Send_Pdf = RepPar.Send_Pdf; DocUUID = RepPar.DocUUID;
            DocPDFFolder = RepPar.DocPDFFolder == null ? "/SavePath/" : RepPar.DocPDFFolder.ToString();
            return query;
        }

        public IEnumerable<AProc_Rpt_GLAccountStatment_Result> Rpt_GLAccountStatment(RepFinancials RepPar)
        {
            ReportStandardParameters StandPar = getStandardParameters(RepPar);
            

            //ReportInfo Rep;
            int Type = int.Parse(RepPar.RepType.ToString());
            SqlParameter spRepType = new SqlParameter("@RepType", Type);

            string formDate = RepPar.FromDate.ToString();
            SqlParameter spformDate = new SqlParameter("@FromDate", formDate);

            string toDate = RepPar.ToDate.ToString();
            SqlParameter sptoDate = new SqlParameter("@ToDate", toDate);

            string cc_Code = RepPar.cc_code.ToString();
            SqlParameter spcc_Code = new SqlParameter("@cc_Code", cc_Code == "-1" ? null : cc_Code);

            string fromacc = RepPar.fromacc.ToString();
            SqlParameter spfromacc = new SqlParameter("@fromacc", fromacc == "-1" ? null : fromacc);

            string toacc = RepPar.toacc.ToString();
            SqlParameter sptoacc = new SqlParameter("@toacc", toacc == "-1" ? null : toacc);

            int IsAuthVchr = int.Parse(RepPar.IsAuthVchr.ToString());
            SqlParameter spIsAuthVchr = new SqlParameter("@IsAuthVchr", IsAuthVchr);

            int IsNewVchr = int.Parse(RepPar.IsNewVchr.ToString());
            SqlParameter spIsNewVchr = new SqlParameter("@IsNewVchr", IsNewVchr);
            int exzero = int.Parse(RepPar.exzero.ToString());
            SqlParameter spexzero = new SqlParameter("@exzero", exzero);






            Rep = OpenReport("Rpt_GLAccountStatment");


            string _Query = "execute " + Rep.dataSource +
           " @comp = '" + StandPar.spComCode.Value + "'" +
           ", @bra = '" + StandPar.spbra.Value + "'" +
           ", @CompNameA = '" + StandPar.spComNameA.Value + "'" +
           ", @CompNameE = '" + StandPar.spComNameE.Value + "'" +
           ", @BraNameA = '" + StandPar.spBraNameA.Value + "'" +
           ", @BraNameE = '" + StandPar.braNameE.Value + "'" +
           ", @LoginUser = '" + StandPar.spLoginUser.Value + "'" +
           ", @RepType = " + spRepType.Value +
           ", @FromDate = '" + spformDate.Value + "'" +
           ", @Todate = '" + sptoDate.Value + "'" +
           ", @cc_Code ='" + spcc_Code.Value + "'" +
           ", @FromAccCode ='" + spfromacc.Value + "'" +
           ", @ToAccCode ='" + sptoacc.Value + "'" +
           ", @IsAuthVchr = " + spIsAuthVchr.Value +
           ", @IsNewVchr = " + spIsNewVchr.Value +
           ", @ExZero = " + spexzero.Value;



            List<AProc_Rpt_GLAccountStatment_Result> query = db.Database.SqlQuery<AProc_Rpt_GLAccountStatment_Result>(_Query).ToList();
            ReportsDetails();
            reportName = Rep.reportName; Send_Pdf = RepPar.Send_Pdf; DocUUID = RepPar.DocUUID;
            DocPDFFolder = RepPar.DocPDFFolder == null ? "/SavePath/" : RepPar.DocPDFFolder.ToString();
            return query;
        }
         
        public IEnumerable<AProc_Prnt_JournalVoucher_Result> Prnt_JournalVoucher(RepFinancials RepPar)
        {
            ReportStandardParameters StandPar = getStandardParameters(RepPar);
            


            int TRId = int.Parse(RepPar.TRId.ToString());
            SqlParameter spTRId = new SqlParameter("@TRId", TRId);



            Rep = OpenReport("Prnt_JournalVoucher");
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
           ", @RepType = " + spRepType.Value +
           ",@TRId = " + spTRId.Value;

            List<AProc_Prnt_JournalVoucher_Result> query = db.Database.SqlQuery<AProc_Prnt_JournalVoucher_Result>(_Query).ToList();
            ReportsDetails();
            reportName = Rep.reportName; Send_Pdf = RepPar.Send_Pdf; DocUUID = RepPar.DocUUID;
            DocPDFFolder = RepPar.DocPDFFolder == null ? "/SavePath/" : RepPar.DocPDFFolder.ToString();
            return query;
        }
         
        public IEnumerable<IProc_Prnt_PurPurchaseOrder_Result> Prnt_PurPurchaseOrder(RepFinancials RepPar)
        {
            ReportStandardParameters StandPar = getStandardParameters(RepPar);
            


            var TRId = int.Parse(RepPar.TRId.ToString());
            SqlParameter spTRId = new SqlParameter("@TRId", TRId);
            Rep = OpenReport("Prnt_PurPurchaseOrder");
            int Type = int.Parse(Rep.OutputTypeNo);

            string _Query = "execute " + Rep.dataSource +
                " @comp = '" + StandPar.spComCode.Value + "'" +
                ", @bra = '" + StandPar.spbra.Value + "'" +
                ", @CompNameA = '" + StandPar.spComNameA.Value + "'" +
                ", @CompNameE = '" + StandPar.spComNameE.Value + "'" +
                ", @BraNameA = '" + StandPar.spBraNameA.Value + "'" +
                ", @BraNameE = '" + StandPar.braNameE.Value + "'" +
                ", @LoginUser = '" + StandPar.spLoginUser.Value + "'" +
                 ",@TRId = " + spTRId.Value;

            var query = db.Database.SqlQuery<IProc_Prnt_PurPurchaseOrder_Result>(_Query).ToList();

            ReportsDetails();
            reportName = Rep.reportName; Send_Pdf = RepPar.Send_Pdf; DocUUID = RepPar.DocUUID;
            DocPDFFolder = RepPar.DocPDFFolder == null ? "/SavePath/" : RepPar.DocPDFFolder.ToString();
            return query;
        }

        public IEnumerable<IProc_Prnt_StkTransfer_Result> Prnt_StkTransfer(RepFinancials RepPar)
        {
            ReportStandardParameters StandPar = getStandardParameters(RepPar);
            


            var TRId = int.Parse(RepPar.TRId.ToString());
            SqlParameter spTRId = new SqlParameter("@TRId", TRId);


            Rep = OpenReport("Prnt_StkTransfer");
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

            var query = db.Database.SqlQuery<IProc_Prnt_StkTransfer_Result>(_Query).ToList();

            ReportsDetails();
            reportName = Rep.reportName; Send_Pdf = RepPar.Send_Pdf; DocUUID = RepPar.DocUUID;
            DocPDFFolder = RepPar.DocPDFFolder == null ? "/SavePath/" : RepPar.DocPDFFolder.ToString();
            return query;
        }

        public IEnumerable<IProc_Prnt_StkAdjust_Result> Prnt_StkAdjust(RepFinancials RepPar)
        {
            ReportStandardParameters StandPar = getStandardParameters(RepPar);
            


            var TRId = int.Parse(RepPar.TRId.ToString());
            SqlParameter spTRId = new SqlParameter("@TRId", TRId);


            Rep = OpenReport("Prnt_StkAdjust");
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

            var query = db.Database.SqlQuery<IProc_Prnt_StkAdjust_Result>(_Query).ToList();

            ReportsDetails();
            reportName = Rep.reportName; Send_Pdf = RepPar.Send_Pdf; DocUUID = RepPar.DocUUID;
            DocPDFFolder = RepPar.DocPDFFolder == null ? "/SavePath/" : RepPar.DocPDFFolder.ToString();
            return query;
        } 

        public IEnumerable<IProc_Prnt_OerationTf_Result> Prnt_OerationTf(RepFinancials RepPar)
        {
            ReportStandardParameters StandPar = getStandardParameters(RepPar);
            


            var TRId = int.Parse(RepPar.TRId.ToString());
            SqlParameter spTRId = new SqlParameter("@TRId", TRId);


            Rep = OpenReport("Prnt_OerationTf");
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

            var query = db.Database.SqlQuery<IProc_Prnt_OerationTf_Result>(_Query).ToList();

            ReportsDetails();
            reportName = Rep.reportName; Send_Pdf = RepPar.Send_Pdf; DocUUID = RepPar.DocUUID;
            DocPDFFolder = RepPar.DocPDFFolder == null ? "/SavePath/" : RepPar.DocPDFFolder.ToString();
            return query;
        }

        public IEnumerable<IProc_Prnt_VATSlsInvoice_Result> Prnt_VATSlsInvoice(RepFinancials RepPar)
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
                if (InvType == 2)
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


            ReportsDetails();
            reportName = Rep.reportName; Send_Pdf = RepPar.Send_Pdf; DocUUID = RepPar.DocUUID;
            DocPDFFolder = RepPar.DocPDFFolder == null ? "/SavePath/" : RepPar.DocPDFFolder.ToString();
            return query;
        } 

        public IEnumerable<IProc_Prnt_VATPurInvoice_Result> Prnt_VATPurInvoice(RepFinancials RepPar)
        {
            ReportStandardParameters StandPar = getStandardParameters(RepPar);
            


            var TRId = int.Parse(RepPar.TRId.ToString());
            SqlParameter spTRId = new SqlParameter("@TRId", TRId);


            Rep = OpenReport("Prnt_VATPurInvoice");


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

            var query = db.Database.SqlQuery<IProc_Prnt_VATPurInvoice_Result>(_Query).ToList();

             ReportsDetails();
            reportName = Rep.reportName; Send_Pdf = RepPar.Send_Pdf; DocUUID = RepPar.DocUUID;
            DocPDFFolder = RepPar.DocPDFFolder == null ? "/SavePath/" : RepPar.DocPDFFolder.ToString();
            return query;
        }

        public IEnumerable<IProc_Prnt_VATPurReturn_Result> Prnt_VATPurReturn(RepFinancials RepPar)
        {
            ReportStandardParameters StandPar = getStandardParameters(RepPar);
            


            var TRId = int.Parse(RepPar.TRId.ToString());
            SqlParameter spTRId = new SqlParameter("@TRId", TRId);


            Rep = OpenReport("Prnt_VATPurReturn");


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

            var query = db.Database.SqlQuery<IProc_Prnt_VATPurReturn_Result>(_Query).ToList();

             ReportsDetails();
            reportName = Rep.reportName; Send_Pdf = RepPar.Send_Pdf; DocUUID = RepPar.DocUUID;
            DocPDFFolder = RepPar.DocPDFFolder == null ? "/SavePath/" : RepPar.DocPDFFolder.ToString();
            return query;
        }

        //كشف حساب مجمع تفصيلي
        public IEnumerable<IProc_Rpt_AccVendorCollDetail_Result> Rpt_AccVendorCollDetail(RepFinancials RepPar)
        {
            ReportStandardParameters StandPar = getStandardParameters(RepPar);
            

            //ReportInfo Rep;
            int Type = int.Parse(RepPar.RepType.ToString());
            SqlParameter spRepType = new SqlParameter("@RepType", Type);

            string formDate = RepPar.FromDate.ToString();
            SqlParameter spformDate = new SqlParameter("@FromDate", formDate);

            string toDate = RepPar.ToDate.ToString();
            SqlParameter sptoDate = new SqlParameter("@ToDate", toDate);

            int CatId = int.Parse(RepPar.CatId.ToString());
            SqlParameter spCatId = new SqlParameter("@CatId", CatId == -1 ? System.Data.SqlTypes.SqlInt32.Null : CatId);

            int VendorId = int.Parse(RepPar.VendorId.ToString());
            SqlParameter spVendorId = new SqlParameter("@CustomerID", VendorId == -1 ? System.Data.SqlTypes.SqlInt32.Null : VendorId);

            int Groupid = int.Parse(RepPar.Groupid.ToString());
            SqlParameter spGroupid = new SqlParameter("@Groupid", Groupid == -1 ? System.Data.SqlTypes.SqlInt32.Null : Groupid);

            int Status = int.Parse(RepPar.Status.ToString());
            SqlParameter spStatus = new SqlParameter("@Status", Status == -1 ? System.Data.SqlTypes.SqlInt32.Null : Status);

            int BalType = int.Parse(RepPar.BalType.ToString());
            SqlParameter spBalType = new SqlParameter("@BalType", BalType);

            int VendType = int.Parse(RepPar.VendType.ToString());
            SqlParameter spVendType = new SqlParameter("@VendType", VendType == -1 ? System.Data.SqlTypes.SqlInt32.Null : VendType);


            Rep = OpenReport("Rpt_AccVendorCollDetail");




            string _Query = "execute " + Rep.dataSource +
           " @comp = '" + StandPar.spComCode.Value + "'" +
           ", @bra = '" + StandPar.spbra.Value + "'" +
           ", @CompNameA = '" + StandPar.spComNameA.Value + "'" +
           ", @CompNameE = '" + StandPar.spComNameE.Value + "'" +
           ", @BraNameA = '" + StandPar.spBraNameA.Value + "'" +
           ", @BraNameE = '" + StandPar.braNameE.Value + "'" +
           ", @LoginUser = '" + StandPar.spLoginUser.Value + "'" +
           ", @RepType = " + spRepType.Value +
           ", @CatID = " + spCatId.Value +
           ", @Groupid = " + spGroupid.Value +
           ", @CustomerID = " + spVendorId.Value +
           ", @VendType = " + spVendType.Value +
           ", @status = " + spStatus.Value +
           ", @FromDate = '" + spformDate.Value + "'" +
           ", @Todate = '" + sptoDate.Value + "'" +
           ", @BalType = " + spBalType.Value;

            List<IProc_Rpt_AccVendorCollDetail_Result> query = db.Database.SqlQuery<IProc_Rpt_AccVendorCollDetail_Result>(_Query).ToList();
             ReportsDetails();
            reportName = Rep.reportName; Send_Pdf = RepPar.Send_Pdf; DocUUID = RepPar.DocUUID;

            DocPDFFolder = RepPar.DocPDFFolder == null ? "/SavePath/" : RepPar.DocPDFFolder.ToString();
            return query;
        }
         
        public IEnumerable<IProc_Rpt_AccVendorCollSummary_Result> Rpt_AccVendorCollSummary(RepFinancials RepPar)
        {
            ReportStandardParameters StandPar = getStandardParameters(RepPar);
            

            //ReportInfo Rep;
            int Type = int.Parse(RepPar.RepType.ToString());
            SqlParameter spRepType = new SqlParameter("@RepType", Type);

            string formDate = RepPar.FromDate.ToString();
            SqlParameter spformDate = new SqlParameter("@FromDate", formDate);

            string toDate = RepPar.ToDate.ToString();
            SqlParameter sptoDate = new SqlParameter("@ToDate", toDate);

            int CatId = int.Parse(RepPar.CatId.ToString());
            SqlParameter spCatId = new SqlParameter("@CatId", CatId == -1 ? System.Data.SqlTypes.SqlInt32.Null : CatId);

            int VendorId = int.Parse(RepPar.VendorId.ToString());
            SqlParameter spVendorId = new SqlParameter("@CustomerID", VendorId == -1 ? System.Data.SqlTypes.SqlInt32.Null : VendorId);

            int Groupid = int.Parse(RepPar.Groupid.ToString());
            SqlParameter spGroupid = new SqlParameter("@Groupid", Groupid == -1 ? System.Data.SqlTypes.SqlInt32.Null : Groupid);

            int Status = int.Parse(RepPar.Status.ToString());
            SqlParameter spStatus = new SqlParameter("@Status", Status == -1 ? System.Data.SqlTypes.SqlInt32.Null : Status);

            int BalType = int.Parse(RepPar.BalType.ToString());
            SqlParameter spBalType = new SqlParameter("@BalType", BalType);

            int VendType = int.Parse(RepPar.VendType.ToString());
            SqlParameter spVendType = new SqlParameter("@VendType", VendType == -1 ? System.Data.SqlTypes.SqlInt32.Null : VendType);


            Rep = OpenReport("Rpt_AccVendorCollSummary");




            string _Query = "execute " + Rep.dataSource +
           " @comp = '" + StandPar.spComCode.Value + "'" +
           ", @bra = '" + StandPar.spbra.Value + "'" +
           ", @CompNameA = '" + StandPar.spComNameA.Value + "'" +
           ", @CompNameE = '" + StandPar.spComNameE.Value + "'" +
           ", @BraNameA = '" + StandPar.spBraNameA.Value + "'" +
           ", @BraNameE = '" + StandPar.braNameE.Value + "'" +
           ", @LoginUser = '" + StandPar.spLoginUser.Value + "'" +
           ", @RepType = " + spRepType.Value +
           ", @CatID = " + spCatId.Value +
           ", @Groupid = " + spGroupid.Value +
           ", @CustomerID = " + spVendorId.Value +
           ", @VendType = " + spVendType.Value +
           ", @status = " + spStatus.Value +
           ", @FromDate = '" + spformDate.Value + "'" +
           ", @Todate = '" + sptoDate.Value + "'" +
           ", @BalType = " + spBalType.Value;

            List<IProc_Rpt_AccVendorCollSummary_Result> query = db.Database.SqlQuery<IProc_Rpt_AccVendorCollSummary_Result>(_Query).ToList();
             ReportsDetails();
            reportName = Rep.reportName; Send_Pdf = RepPar.Send_Pdf; DocUUID = RepPar.DocUUID;

            DocPDFFolder = RepPar.DocPDFFolder == null ? "/SavePath/" : RepPar.DocPDFFolder.ToString();
            return query;
        }

        public IEnumerable<IProc_Rpt_VatSalesSummary_Result> Rpt_VatSalesSummary(RepFinancials RepPar)
        {
            ReportStandardParameters StandPar = getStandardParameters(RepPar);
            

            //ReportInfo Rep;
            int Type = int.Parse(RepPar.RepType.ToString());
            SqlParameter spRepType = new SqlParameter("@RepType", Type);

            string formDate = RepPar.FromDate.ToString();
            SqlParameter spformDate = new SqlParameter("@FromDate", formDate);

            string toDate = RepPar.ToDate.ToString();
            SqlParameter sptoDate = new SqlParameter("@ToDate", toDate);

            int CatId = int.Parse(RepPar.CatId.ToString());
            SqlParameter spCatId = new SqlParameter("@CatId", CatId == -1 ? System.Data.SqlTypes.SqlInt32.Null : CatId);

            int FromBra = int.Parse(RepPar.FromBra.ToString());
            SqlParameter spFromBra = new SqlParameter("@braCode", FromBra == -1 ? System.Data.SqlTypes.SqlInt32.Null : FromBra);


            int ItemID = int.Parse(RepPar.ItemID.ToString());
            SqlParameter spItemID = new SqlParameter("@ItemID", ItemID == -1 ? System.Data.SqlTypes.SqlInt32.Null : ItemID);

            int Status = int.Parse(RepPar.Status.ToString());
            SqlParameter spStatus = new SqlParameter("@SLStype", Status);

            int TrType = int.Parse(RepPar.TrType.ToString());
            SqlParameter spTrType = new SqlParameter("@TrType", TrType);

            string ccCode = RepPar.cc_code.ToString();
            SqlParameter spcc_code = new SqlParameter("@ccCode", ccCode == "-1" ? null : ccCode);

            int CustomercatID = int.Parse(RepPar.CustomercatID.ToString());
            SqlParameter spCustomercatID = new SqlParameter("@cusCatID", CustomercatID == -1 ? System.Data.SqlTypes.SqlInt32.Null : CustomercatID);

            int stat = int.Parse(RepPar.stat.ToString());
            SqlParameter spstat = new SqlParameter("@status", stat == -1 ? System.Data.SqlTypes.SqlInt32.Null : stat);

            int CustomerGrpID = int.Parse(RepPar.CustomerGrpID.ToString());
            SqlParameter spCustomerGrpID = new SqlParameter("@cusGroupid", CustomerGrpID == -1 ? System.Data.SqlTypes.SqlInt32.Null : CustomerGrpID);

            int CustomerID = int.Parse(RepPar.CustomerID.ToString());
            SqlParameter spCustomerID = new SqlParameter("@cusid", CustomerID == -1 ? System.Data.SqlTypes.SqlInt32.Null : CustomerID);
            if (TrType == 0)
            {
                Rep = OpenReport("Rpt_VatSalesSummary");

            }
            else
            {
                Rep = OpenReport("Rpt_VatSalesSummaryRet");
            }





            string _Query = "execute " + Rep.dataSource +
           " @comp = '" + StandPar.spComCode.Value + "'" +
           ", @bra = '" + StandPar.spbra.Value + "'" +
           ", @CompNameA = '" + StandPar.spComNameA.Value + "'" +
           ", @CompNameE = '" + StandPar.spComNameE.Value + "'" +
           ", @BraNameA = '" + StandPar.spBraNameA.Value + "'" +
           ", @BraNameE = '" + StandPar.braNameE.Value + "'" +
           ", @LoginUser = '" + StandPar.spLoginUser.Value + "'" +
           ", @RepType = " + spRepType.Value +
           ", @braCode = " + spFromBra.Value +
           ", @CatID = " + spCatId.Value +
           ", @ItemID = " + spItemID.Value +
           ", @cusCatID = " + spCustomercatID.Value +
           ", @cusGroupid = " + spCustomerGrpID.Value +
           ", @cusid = " + spCustomerID.Value +
           ", @SLStype = " + spStatus.Value +
           ", @TRtype = " + spTrType.Value +
           ", @ccCode = '" + spcc_code.Value +
           "', @FromDate = '" + spformDate.Value + "'" +
           ", @Todate = '" + sptoDate.Value + "'" +
           ", @status = " + spstat.Value;

            List<IProc_Rpt_VatSalesSummary_Result> query = db.Database.SqlQuery<IProc_Rpt_VatSalesSummary_Result>(_Query).ToList();
             ReportsDetails();
            reportName = Rep.reportName; Send_Pdf = RepPar.Send_Pdf; DocUUID = RepPar.DocUUID;

            DocPDFFolder = RepPar.DocPDFFolder == null ? "/SavePath/" : RepPar.DocPDFFolder.ToString();
            return query;
        }

        public IEnumerable<IProc_Rpt_VatSalesDetail_Result> Rpt_VatSalesDetail(RepFinancials RepPar)
        {
            ReportStandardParameters StandPar = getStandardParameters(RepPar);
            

            //ReportInfo Rep;
            int Type = int.Parse(RepPar.RepType.ToString());
            SqlParameter spRepType = new SqlParameter("@RepType", Type);

            string formDate = RepPar.FromDate.ToString();
            SqlParameter spformDate = new SqlParameter("@FromDate", formDate);

            string toDate = RepPar.ToDate.ToString();
            SqlParameter sptoDate = new SqlParameter("@ToDate", toDate);

            int CatId = int.Parse(RepPar.CatId.ToString());
            SqlParameter spCatId = new SqlParameter("@CatId", CatId == -1 ? System.Data.SqlTypes.SqlInt32.Null : CatId);

            int FromBra = int.Parse(RepPar.FromBra.ToString());
            SqlParameter spFromBra = new SqlParameter("@braCode", FromBra == -1 ? System.Data.SqlTypes.SqlInt32.Null : FromBra);


            int ItemID = int.Parse(RepPar.ItemID.ToString());
            SqlParameter spItemID = new SqlParameter("@ItemID", ItemID == -1 ? System.Data.SqlTypes.SqlInt32.Null : ItemID);

            int Status = int.Parse(RepPar.Status.ToString());
            SqlParameter spStatus = new SqlParameter("@SLStype", Status);

            int TrType = int.Parse(RepPar.TrType.ToString());
            SqlParameter spTrType = new SqlParameter("@TrType", TrType);

            string ccCode = RepPar.cc_code.ToString();
            SqlParameter spcc_code = new SqlParameter("@ccCode", ccCode == "-1" ? null : ccCode);

            int CustomercatID = int.Parse(RepPar.CustomercatID.ToString());
            SqlParameter spCustomercatID = new SqlParameter("@cusCatID", CustomercatID == -1 ? System.Data.SqlTypes.SqlInt32.Null : CustomercatID);

            int stat = int.Parse(RepPar.stat.ToString());
            SqlParameter spstat = new SqlParameter("@status", stat == -1 ? System.Data.SqlTypes.SqlInt32.Null : stat);

            int CustomerGrpID = int.Parse(RepPar.CustomerGrpID.ToString());
            SqlParameter spCustomerGrpID = new SqlParameter("@cusGroupid", CustomerGrpID == -1 ? System.Data.SqlTypes.SqlInt32.Null : CustomerGrpID);

            int CustomerID = int.Parse(RepPar.CustomerID.ToString());
            SqlParameter spCustomerID = new SqlParameter("@cusid", CustomerID == -1 ? System.Data.SqlTypes.SqlInt32.Null : CustomerID);
            if (TrType == 0)
            {
                Rep = OpenReport("Rpt_VatSalesDetail");
            }
            else
            {
                Rep = OpenReport("Rpt_VatSalesDetailRet");
            }





            string _Query = "execute " + Rep.dataSource +
           " @comp = '" + StandPar.spComCode.Value + "'" +
           ", @bra = '" + StandPar.spbra.Value + "'" +
           ", @CompNameA = '" + StandPar.spComNameA.Value + "'" +
           ", @CompNameE = '" + StandPar.spComNameE.Value + "'" +
           ", @BraNameA = '" + StandPar.spBraNameA.Value + "'" +
           ", @BraNameE = '" + StandPar.braNameE.Value + "'" +
           ", @LoginUser = '" + StandPar.spLoginUser.Value + "'" +
           ", @RepType = " + spRepType.Value +
           ", @braCode = " + spFromBra.Value +
           ", @CatID = " + spCatId.Value +
           ", @ItemID = " + spItemID.Value +
           ", @cusCatID = " + spCustomercatID.Value +
           ", @cusGroupid = " + spCustomerGrpID.Value +
           ", @cusid = " + spCustomerID.Value +
           ", @SLStype = " + spStatus.Value +
           ", @TRtype = " + spTrType.Value +
           ", @ccCode = '" + spcc_code.Value +
           "', @FromDate = '" + spformDate.Value + "'" +
           ", @Todate = '" + sptoDate.Value + "'" +
           ", @status = " + spstat.Value;

            List<IProc_Rpt_VatSalesDetail_Result> query = db.Database.SqlQuery<IProc_Rpt_VatSalesDetail_Result>(_Query).ToList();
             ReportsDetails();
            reportName = Rep.reportName; Send_Pdf = RepPar.Send_Pdf; DocUUID = RepPar.DocUUID;

            DocPDFFolder = RepPar.DocPDFFolder == null ? "/SavePath/" : RepPar.DocPDFFolder.ToString();
            return query;
        }

        public IEnumerable<IProc_Rpt_VatPurchaseSummary_Result> Rpt_VatPurchaseSummary(RepFinancials RepPar)
        {
            ReportStandardParameters StandPar = getStandardParameters(RepPar);
            


            //ReportInfo Rep;
            int Type = int.Parse(RepPar.RepType.ToString());
            SqlParameter spRepType = new SqlParameter("@RepType", Type);

            string formDate = RepPar.FromDate.ToString();
            SqlParameter spformDate = new SqlParameter("@FromDate", formDate);

            string toDate = RepPar.ToDate.ToString();
            SqlParameter sptoDate = new SqlParameter("@ToDate", toDate);

            int CatId = int.Parse(RepPar.CatId.ToString());
            SqlParameter spCatId = new SqlParameter("@CatID", CatId == -1 ? System.Data.SqlTypes.SqlInt32.Null : CatId);

            int FromBra = int.Parse(RepPar.FromBra.ToString());
            SqlParameter spFromBra = new SqlParameter("@braCode", FromBra == -1 ? System.Data.SqlTypes.SqlInt32.Null : FromBra);

            int ItemID = int.Parse(RepPar.ItemID.ToString());
            SqlParameter spItemID = new SqlParameter("@ItemID", ItemID == -1 ? System.Data.SqlTypes.SqlInt32.Null : ItemID);

            int SLStype = int.Parse(RepPar.SLStype.ToString());
            SqlParameter spSLStype = new SqlParameter("@SLStype", SLStype);

            int stat = int.Parse(RepPar.stat.ToString());
            SqlParameter spstat = new SqlParameter("@status", stat == -1 ? System.Data.SqlTypes.SqlInt32.Null : stat);

            string ccCode = RepPar.cc_code.ToString();
            SqlParameter spcc_code = new SqlParameter("@ccCode", ccCode == "-1" ? null : ccCode);

            int cusCatID = int.Parse(RepPar.cusCatID.ToString());
            SqlParameter spcusCatID = new SqlParameter("@cusCatID", cusCatID == -1 ? System.Data.SqlTypes.SqlInt32.Null : cusCatID);

            int cusGroupid = int.Parse(RepPar.cusGroupid.ToString());
            SqlParameter spcusGroupid = new SqlParameter("@cusGroupid", cusGroupid == -1 ? System.Data.SqlTypes.SqlInt32.Null : cusGroupid);

            int cusid = int.Parse(RepPar.cusid.ToString());
            SqlParameter spcusid = new SqlParameter("@cusid", cusid == -1 ? System.Data.SqlTypes.SqlInt32.Null : cusid);

            int ISimport = int.Parse(RepPar.ISimport.ToString());
            SqlParameter spISimport = new SqlParameter("@IsImport", ISimport);

            int TrType = int.Parse(RepPar.TrType.ToString());
            SqlParameter spTrType = new SqlParameter("@TrType", TrType);



            if (TrType == 1)
            {
                Rep = OpenReport("Rpt_VatPurchaseSummary");

            }
            else
            {
                Rep = OpenReport("Rpt_VatPurchaseSummaryRet");
            }


            string _Query = "execute " + Rep.dataSource +
           " @comp = '" + StandPar.spComCode.Value + "'" +
           ", @bra = '" + StandPar.spbra.Value + "'" +
           ", @CompNameA = '" + StandPar.spComNameA.Value + "'" +
           ", @CompNameE = '" + StandPar.spComNameE.Value + "'" +
           ", @BraNameA = '" + StandPar.spBraNameA.Value + "'" +
           ", @BraNameE = '" + StandPar.braNameE.Value + "'" +
           ", @LoginUser = '" + StandPar.spLoginUser.Value + "'" +
           ", @RepType = " + spRepType.Value +
           ", @braCode = " + spFromBra.Value +
           ", @CatID = " + spCatId.Value +
           ", @ItemID = " + spItemID.Value +
           ", @cusCatID = " + spcusCatID.Value +
           ", @cusGroupid = " + spcusGroupid.Value +
           ", @cusid = " + spcusid.Value +
           ", @SLStype = " + spSLStype.Value +
           ", @IsImport = " + spISimport.Value +
           ", @ccCode = '" + spcc_code.Value +
           "', @status = " + spstat.Value +
           ", @FromDate = '" + spformDate.Value +
           "', @Todate = '" + sptoDate.Value + "'";
            //+ "'" +
            //", @TRtype = " + spTrType.Value;

            List<IProc_Rpt_VatPurchaseSummary_Result> query = db.Database.SqlQuery<IProc_Rpt_VatPurchaseSummary_Result>(_Query).ToList();
             ReportsDetails();
            reportName = Rep.reportName; Send_Pdf = RepPar.Send_Pdf; DocUUID = RepPar.DocUUID;

            DocPDFFolder = RepPar.DocPDFFolder == null ? "/SavePath/" : RepPar.DocPDFFolder.ToString();
            return query;
        }

        public IEnumerable<IProc_Rpt_VatPurchaseDetail_Result> Rpt_VatPurchaseDetail(RepFinancials RepPar)
        {
            ReportStandardParameters StandPar = getStandardParameters(RepPar);
            


            //ReportInfo Rep;
            int Type = int.Parse(RepPar.RepType.ToString());
            SqlParameter spRepType = new SqlParameter("@RepType", Type);

            string formDate = RepPar.FromDate.ToString();
            SqlParameter spformDate = new SqlParameter("@FromDate", formDate);

            string toDate = RepPar.ToDate.ToString();
            SqlParameter sptoDate = new SqlParameter("@ToDate", toDate);

            int CatId = int.Parse(RepPar.CatId.ToString());
            SqlParameter spCatId = new SqlParameter("@CatID", CatId == -1 ? System.Data.SqlTypes.SqlInt32.Null : CatId);

            int FromBra = int.Parse(RepPar.FromBra.ToString());
            SqlParameter spFromBra = new SqlParameter("@braCode", FromBra == -1 ? System.Data.SqlTypes.SqlInt32.Null : FromBra);

            int ItemID = int.Parse(RepPar.ItemID.ToString());
            SqlParameter spItemID = new SqlParameter("@ItemID", ItemID == -1 ? System.Data.SqlTypes.SqlInt32.Null : ItemID);

            int SLStype = int.Parse(RepPar.SLStype.ToString());
            SqlParameter spSLStype = new SqlParameter("@SLStype", SLStype);

            int stat = int.Parse(RepPar.stat.ToString());
            SqlParameter spstat = new SqlParameter("@status", stat == -1 ? System.Data.SqlTypes.SqlInt32.Null : stat);

            string ccCode = RepPar.cc_code.ToString();
            SqlParameter spcc_code = new SqlParameter("@ccCode", ccCode == "-1" ? null : ccCode);

            int cusCatID = int.Parse(RepPar.cusCatID.ToString());
            SqlParameter spcusCatID = new SqlParameter("@cusCatID", cusCatID == -1 ? System.Data.SqlTypes.SqlInt32.Null : cusCatID);

            int cusGroupid = int.Parse(RepPar.cusGroupid.ToString());
            SqlParameter spcusGroupid = new SqlParameter("@cusGroupid", cusGroupid == -1 ? System.Data.SqlTypes.SqlInt32.Null : cusGroupid);

            int cusid = int.Parse(RepPar.cusid.ToString());
            SqlParameter spcusid = new SqlParameter("@cusid", cusid == -1 ? System.Data.SqlTypes.SqlInt32.Null : cusid);

            int ISimport = int.Parse(RepPar.ISimport.ToString());
            SqlParameter spISimport = new SqlParameter("@IsImport", ISimport);

            int TrType = int.Parse(RepPar.TrType.ToString());
            SqlParameter spTrType = new SqlParameter("@TrType", TrType);



            if (TrType == 1)
            {
                Rep = OpenReport("Rpt_VatPurchaseDetail");

            }
            else
            {
                Rep = OpenReport("Rpt_VatPurchaseDetailRet");
            }


            string _Query = "execute " + Rep.dataSource +
           " @comp = '" + StandPar.spComCode.Value + "'" +
           ", @bra = '" + StandPar.spbra.Value + "'" +
           ", @CompNameA = '" + StandPar.spComNameA.Value + "'" +
           ", @CompNameE = '" + StandPar.spComNameE.Value + "'" +
           ", @BraNameA = '" + StandPar.spBraNameA.Value + "'" +
           ", @BraNameE = '" + StandPar.braNameE.Value + "'" +
           ", @LoginUser = '" + StandPar.spLoginUser.Value + "'" +
           ", @RepType = " + spRepType.Value +
           ", @braCode = " + spFromBra.Value +
           ", @CatID = " + spCatId.Value +
           ", @ItemID = " + spItemID.Value +
           ", @cusCatID = " + spcusCatID.Value +
           ", @cusGroupid = " + spcusGroupid.Value +
           ", @cusid = " + spcusid.Value +
           ", @SLStype = " + spSLStype.Value +
           ", @IsImport = " + spISimport.Value +
           ", @ccCode = '" + spcc_code.Value +
           "', @status = " + spstat.Value +
           ", @FromDate = '" + spformDate.Value +
           "', @Todate = '" + sptoDate.Value + "'";
            //+ "'" +
            //", @TRtype = " + spTrType.Value;

            List<IProc_Rpt_VatPurchaseDetail_Result> query = db.Database.SqlQuery<IProc_Rpt_VatPurchaseDetail_Result>(_Query).ToList();
             ReportsDetails();
            reportName = Rep.reportName; Send_Pdf = RepPar.Send_Pdf; DocUUID = RepPar.DocUUID;

            DocPDFFolder = RepPar.DocPDFFolder == null ? "/SavePath/" : RepPar.DocPDFFolder.ToString();
            return query;
        }

        public IEnumerable<AProc_Prnt_CashVoucher_Result> Prnt_CashVoucher(RepFinancials RepPar)
        {
            ReportStandardParameters StandPar = getStandardParameters(RepPar);
            

            int TRId = int.Parse(RepPar.TRId.ToString());
            SqlParameter spTRId = new SqlParameter("@TRId", TRId == -1 ? System.Data.SqlTypes.SqlInt32.Null : TRId);
            int typ = int.Parse(RepPar.Typ.ToString());
            int TfType = int.Parse(RepPar.TfType.ToString());

            if (TfType == 1)
            {
                if (typ == 0)
                {
                    Rep = OpenReport("Prnt_CashVoucherpay");
                }
                else
                {
                    Rep = OpenReport("Prnt_CashVoucherpay2");
                }
            }
            else
            {


                if (typ == 0)
                {
                    Rep = OpenReport("Prnt_CashVoucher");
                }
                else
                {
                    Rep = OpenReport("Prnt_CashVoucher2");
                }
            }
            int Type = int.Parse(Rep.OutputTypeNo);
            SqlParameter spRepType = new SqlParameter("@RepType", Type);

            string _Query = "execute " + Rep.dataSource +
           " @comp = '" + StandPar.spComCode.Value + "'" +
           ", @bra = '" + StandPar.spbra.Value + "'" +
           ", @CompNameA = '" + StandPar.spComNameA.Value + "'" +
           ", @CompNameE = '" + StandPar.spComNameE.Value + "'" +
           ", @BraNameA = '" + StandPar.spBraNameA.Value + "'" +
           ", @BraNameE = '" + StandPar.braNameE.Value + "'" +
           ", @LoginUser = '" + StandPar.spLoginUser.Value + "'" +
           ", @RepType = " + spRepType.Value +
           ", @TRId = " + spTRId.Value;

            List<AProc_Prnt_CashVoucher_Result> query = db.Database.SqlQuery<AProc_Prnt_CashVoucher_Result>(_Query).ToList();
             ReportsDetails();
            reportName = Rep.reportName; Send_Pdf = RepPar.Send_Pdf; DocUUID = RepPar.DocUUID;

            DocPDFFolder = RepPar.DocPDFFolder == null ? "/SavePath/" : RepPar.DocPDFFolder.ToString();
            return query;
        }
         
        public IEnumerable<AProc_Rpt_GLDtCCenterStatmentSummary_Result> Rpt_GLDtCCenterStatmentSummary(RepFinancials RepPar)
        {
            ReportStandardParameters StandPar = getStandardParameters(RepPar);
            


            //ReportInfo Rep;
            int Type = int.Parse(RepPar.RepType.ToString());
            SqlParameter spRepType = new SqlParameter("@RepType", Type);

            string formDate = RepPar.FromDate.ToString();
            SqlParameter spformDate = new SqlParameter("@FromDate", formDate);

            string toDate = RepPar.ToDate.ToString();
            SqlParameter sptoDate = new SqlParameter("@ToDate", toDate);

            string dtccCode = RepPar.dtccCode.ToString();
            SqlParameter spdtccCode = new SqlParameter("@dtccCode", dtccCode == "-1" ? "" : dtccCode);

            string AccCode = RepPar.AccCode.ToString();
            SqlParameter spAccCode = new SqlParameter("@FromAccCode", AccCode == "0" ? "" : AccCode);

            int exzero = int.Parse(RepPar.exzero.ToString());
            SqlParameter spexzero = new SqlParameter("@exzero", exzero);

            int IsNewVchr = int.Parse(RepPar.IsNewVchr.ToString());
            SqlParameter spIsNewVchr = new SqlParameter("@IsNewVchr", IsNewVchr);

            int IsAuthVchr = int.Parse(RepPar.IsAuthVchr.ToString());
            SqlParameter spIsAuthVchr = new SqlParameter("@IsAuthVchr", IsAuthVchr);

            int TRType = int.Parse(RepPar.TrType.ToString());



            if (TRType == 1)
            {
                Rep = OpenReport("Rpt_GLDtCCenterStatmentSummaryByAccount");
            }
            else
            {
                Rep = OpenReport("Rpt_GLDtCCenterStatmentSummaryByCenter");
            }





            string _Query = "execute " + Rep.dataSource +
           " @comp = '" + StandPar.spComCode.Value + "'" +
           ", @bra = '" + StandPar.spbra.Value + "'" +
           ", @CompNameA = '" + StandPar.spComNameA.Value + "'" +
           ", @CompNameE = '" + StandPar.spComNameE.Value + "'" +
           ", @BraNameA = '" + StandPar.spBraNameA.Value + "'" +
           ", @BraNameE = '" + StandPar.braNameE.Value + "'" +
           ", @LoginUser = '" + StandPar.spLoginUser.Value + "'" +
           ", @RepType = " + spRepType.Value +
           ", @FromDate = '" + spformDate.Value +
           "', @Todate = '" + sptoDate.Value +
           "',@dtcc_Code= '" + spdtccCode.Value +
           "', @FromAccCode = '" + spAccCode.Value +
           "', @IsAuthVchr = " + spIsAuthVchr.Value +
           ", @IsNewVchr= " + spIsNewVchr.Value +
           ", @ExZero = " + spexzero.Value;

            List<AProc_Rpt_GLDtCCenterStatmentSummary_Result> query = db.Database.SqlQuery<AProc_Rpt_GLDtCCenterStatmentSummary_Result>(_Query).ToList();
             ReportsDetails();
            reportName = Rep.reportName; Send_Pdf = RepPar.Send_Pdf; DocUUID = RepPar.DocUUID;

            DocPDFFolder = RepPar.DocPDFFolder == null ? "/SavePath/" : RepPar.DocPDFFolder.ToString();
            return query;
        }

        public IEnumerable<AProc_Rpt_GLDtCCenterStatmentDetail_Result> Rpt_GLDtCCenterStatmentDetail(RepFinancials RepPar)
        {
            ReportStandardParameters StandPar = getStandardParameters(RepPar);
            


            //ReportInfo Rep;
            int Type = int.Parse(RepPar.RepType.ToString());
            SqlParameter spRepType = new SqlParameter("@RepType", Type);

            string formDate = RepPar.FromDate.ToString();
            SqlParameter spformDate = new SqlParameter("@FromDate", formDate);

            string toDate = RepPar.ToDate.ToString();
            SqlParameter sptoDate = new SqlParameter("@ToDate", toDate);

            string dtccCode = RepPar.dtccCode.ToString();
            SqlParameter spdtccCode = new SqlParameter("@dtccCode", dtccCode == "-1" ? "" : dtccCode);

            string AccCode = RepPar.AccCode.ToString();
            SqlParameter spAccCode = new SqlParameter("@FromAccCode", AccCode == "0" ? "" : AccCode);

            int exzero = int.Parse(RepPar.exzero.ToString());
            SqlParameter spexzero = new SqlParameter("@exzero", exzero);

            int IsNewVchr = int.Parse(RepPar.IsNewVchr.ToString());
            SqlParameter spIsNewVchr = new SqlParameter("@IsNewVchr", IsNewVchr);

            int IsAuthVchr = int.Parse(RepPar.IsAuthVchr.ToString());
            SqlParameter spIsAuthVchr = new SqlParameter("@IsAuthVchr", IsAuthVchr);

            int TRType = int.Parse(RepPar.TrType.ToString());



            if (TRType == 1)
            {
                Rep = OpenReport("Rpt_GLDtCCenterStatmentDetailByAccount");
            }
            else
            {
                Rep = OpenReport("Rpt_GLDtCCenterStatmentDetailByCenter");
            }





            string _Query = "execute " + Rep.dataSource +
           " @comp = '" + StandPar.spComCode.Value + "'" +
           ", @bra = '" + StandPar.spbra.Value + "'" +
           ", @CompNameA = '" + StandPar.spComNameA.Value + "'" +
           ", @CompNameE = '" + StandPar.spComNameE.Value + "'" +
           ", @BraNameA = '" + StandPar.spBraNameA.Value + "'" +
           ", @BraNameE = '" + StandPar.braNameE.Value + "'" +
           ", @LoginUser = '" + StandPar.spLoginUser.Value + "'" +
           ", @RepType = " + spRepType.Value +
           ", @FromDate = '" + spformDate.Value +
           "', @Todate = '" + sptoDate.Value +
           "',@dtcc_Code= '" + spdtccCode.Value +
           "', @FromAccCode = '" + spAccCode.Value +
           "', @IsAuthVchr = " + spIsAuthVchr.Value +
           ", @IsNewVchr= " + spIsNewVchr.Value +
           ", @ExZero = " + spexzero.Value;

            List<AProc_Rpt_GLDtCCenterStatmentDetail_Result> query = db.Database.SqlQuery<AProc_Rpt_GLDtCCenterStatmentDetail_Result>(_Query).ToList();
             ReportsDetails();
            reportName = Rep.reportName; Send_Pdf = RepPar.Send_Pdf; DocUUID = RepPar.DocUUID;

            DocPDFFolder = RepPar.DocPDFFolder == null ? "/SavePath/" : RepPar.DocPDFFolder.ToString();
            return query;
        }
         
        public IEnumerable<IProc_Prnt_VATReport_Result> Prnt_VATReport(RepFinancials RepPar)
        {
            ReportStandardParameters StandPar = getStandardParameters(RepPar);
            

            // //ReportInfo Rep;
            int RepType = int.Parse(RepPar.RepType.ToString());
            SqlParameter spRepType = new SqlParameter("@RepType", RepType);

            int vatyear = int.Parse(RepPar.vatyear.ToString());
            SqlParameter spvatyear = new SqlParameter("@vatyear", vatyear);

            int prdcode = int.Parse(RepPar.prdcode.ToString());
            SqlParameter spprdcode = new SqlParameter("@prdcode", prdcode);

            Rep = OpenReport("Prnt_VATReport");

            string _Query = "execute " + Rep.dataSource +
           " @comp = '" + StandPar.spComCode.Value + "'" +
           ", @bra = '" + StandPar.spbra.Value + "'" +
           ", @CompNameA = '" + StandPar.spComNameA.Value + "'" +
           ", @CompNameE = '" + StandPar.spComNameE.Value + "'" +
           ", @BraNameA = '" + StandPar.spBraNameA.Value + "'" +
           ", @BraNameE = '" + StandPar.braNameE.Value + "'" +
           ", @LoginUser = '" + StandPar.spLoginUser.Value + "'" +
           ", @RepType = " + spRepType.Value +
           ", @vatyear = " + spvatyear.Value +
           ", @prdcode = " + spprdcode.Value + "";

            List<IProc_Prnt_VATReport_Result> query = db.Database.SqlQuery<IProc_Prnt_VATReport_Result>(_Query).ToList();
             ReportsDetails();
            reportName = Rep.reportName; Send_Pdf = RepPar.Send_Pdf; DocUUID = RepPar.DocUUID;

            DocPDFFolder = RepPar.DocPDFFolder == null ? "/SavePath/" : RepPar.DocPDFFolder.ToString();
            return query;
        }
         
        public IEnumerable<IProc_Rpt_AccBoxSummaryVer2_Result> Rpt_AccBoxSummary(RepFinancials RepPar)
        {
            ReportStandardParameters StandPar = getStandardParameters(RepPar);
            

            //ReportInfo Rep;
            int Type = int.Parse(RepPar.RepType.ToString());
            SqlParameter spRepType = new SqlParameter("@RepType", Type);

            int BoxId = int.Parse(RepPar.BoxId.ToString());
            SqlParameter spBoxId = new SqlParameter("@boxid", BoxId == -1 ? System.Data.SqlTypes.SqlInt32.Null : BoxId);

            int Status = int.Parse(RepPar.Status.ToString());
            SqlParameter spStatus = new SqlParameter("@status", Status == -1 ? System.Data.SqlTypes.SqlInt32.Null : Status);

            int BalType = int.Parse(RepPar.BalType.ToString());
            SqlParameter spBalType = new SqlParameter("@BalType", BalType);

            string FromDate = RepPar.FromDate.ToString();
            SqlParameter spFromDate = new SqlParameter("@FromDate", FromDate);

            string ToDate = RepPar.ToDate.ToString();
            SqlParameter spToDate = new SqlParameter("@Todate", ToDate);

            Rep = OpenReport("Rpt_AccBoxSummaryVer2");

            string _Query = "execute " + Rep.dataSource +
           " @comp = '" + StandPar.spComCode.Value + "'" +
           ", @bra = '" + StandPar.spbra.Value + "'" +
           ", @CompNameA = '" + StandPar.spComNameA.Value + "'" +
           ", @CompNameE = '" + StandPar.spComNameE.Value + "'" +
           ", @BraNameA = '" + StandPar.spBraNameA.Value + "'" +
           ", @BraNameE = '" + StandPar.braNameE.Value + "'" +
           ", @LoginUser = '" + StandPar.spLoginUser.Value + "'" +
           ", @RepType = " + spRepType.Value +
           ", @boxid = " + spBoxId.Value +
           ", @status = " + spStatus.Value +
           ", @FromDate = '" + spFromDate.Value + "'" +
           ", @Todate = '" + spToDate.Value + "'";



            List<IProc_Rpt_AccBoxSummaryVer2_Result> query = db.Database.SqlQuery<IProc_Rpt_AccBoxSummaryVer2_Result>(_Query).ToList();
             ReportsDetails();
            reportName = Rep.reportName; Send_Pdf = RepPar.Send_Pdf; DocUUID = RepPar.DocUUID;

            DocPDFFolder = RepPar.DocPDFFolder == null ? "/SavePath/" : RepPar.DocPDFFolder.ToString();
            return query;
        }
         
        public IEnumerable<IProc_Rpt_AccBoxDetailVer2_Result> Rpt_AccBoxDetail(RepFinancials RepPar)
        {
            ReportStandardParameters StandPar = getStandardParameters(RepPar);
            

            //ReportInfo Rep;
            int Type = int.Parse(RepPar.RepType.ToString());
            SqlParameter spRepType = new SqlParameter("@RepType", Type);

            int BoxId = int.Parse(RepPar.BoxId.ToString());
            SqlParameter spBoxId = new SqlParameter("@boxid", BoxId == -1 ? System.Data.SqlTypes.SqlInt32.Null : BoxId);

            int Status = int.Parse(RepPar.Status.ToString());
            SqlParameter spStatus = new SqlParameter("@status", Status == -1 ? System.Data.SqlTypes.SqlInt32.Null : Status);

            int BalType = int.Parse(RepPar.BalType.ToString());
            SqlParameter spBalType = new SqlParameter("@BalType", BalType);

            string FromDate = RepPar.FromDate.ToString();
            SqlParameter spFromDate = new SqlParameter("@FromDate", FromDate);

            string ToDate = RepPar.ToDate.ToString();
            SqlParameter spToDate = new SqlParameter("@Todate", ToDate);

            Rep = OpenReport("Rpt_AccBoxDetailVer2");

            string _Query = "execute " + Rep.dataSource +
           " @comp = '" + StandPar.spComCode.Value + "'" +
           ", @bra = '" + StandPar.spbra.Value + "'" +
           ", @CompNameA = '" + StandPar.spComNameA.Value + "'" +
           ", @CompNameE = '" + StandPar.spComNameE.Value + "'" +
           ", @BraNameA = '" + StandPar.spBraNameA.Value + "'" +
           ", @BraNameE = '" + StandPar.braNameE.Value + "'" +
           ", @LoginUser = '" + StandPar.spLoginUser.Value + "'" +
           ", @RepType = " + spRepType.Value +
           ", @boxid = " + spBoxId.Value +
           ", @status = " + spStatus.Value +
           ", @FromDate = '" + spFromDate.Value + "'" +
           ", @Todate = '" + spToDate.Value + "'";



            List<IProc_Rpt_AccBoxDetailVer2_Result> query = db.Database.SqlQuery<IProc_Rpt_AccBoxDetailVer2_Result>(_Query).ToList();
             ReportsDetails();
            reportName = Rep.reportName; Send_Pdf = RepPar.Send_Pdf; DocUUID = RepPar.DocUUID;

            DocPDFFolder = RepPar.DocPDFFolder == null ? "/SavePath/" : RepPar.DocPDFFolder.ToString();
            return query;
        }
         
        public IEnumerable<IProc_Rep_OperationScrap_Result> Rep_OperationScrap(RepFinancials RepPar)
        {
            ReportStandardParameters StandPar = getStandardParameters(RepPar);
            

            //ReportInfo Rep;
            int Type = int.Parse(RepPar.RepType.ToString());
            SqlParameter spRepType = new SqlParameter("@RepType", Type);

            int vendorid = int.Parse(RepPar.VendorId.ToString());
            SqlParameter spvendorid = new SqlParameter("@vendorid", vendorid == -1 ? System.Data.SqlTypes.SqlInt32.Null : vendorid);

            int TRId = int.Parse(RepPar.OperationId.ToString());
            SqlParameter spTRId = new SqlParameter("@TRId", TRId == -1 ? System.Data.SqlTypes.SqlInt32.Null : TRId);




            Rep = OpenReport("Rep_OperationScrap");

            string _Query = "execute " + Rep.dataSource +
           " @comp = '" + StandPar.spComCode.Value + "'" +
           ", @bra = '" + StandPar.spbra.Value + "'" +
           ", @CompNameA = '" + StandPar.spComNameA.Value + "'" +
           ", @CompNameE = '" + StandPar.spComNameE.Value + "'" +
           ", @BraNameA = '" + StandPar.spBraNameA.Value + "'" +
           ", @BraNameE = '" + StandPar.braNameE.Value + "'" +
           ", @LoginUser = '" + StandPar.spLoginUser.Value + "'" +
           ", @RepType = " + spRepType.Value +
           ", @vendorid= " + spvendorid.Value +
           ", @TRId = " + spTRId.Value;



            List<IProc_Rep_OperationScrap_Result> query = db.Database.SqlQuery<IProc_Rep_OperationScrap_Result>(_Query).ToList();
             ReportsDetails();
            reportName = Rep.reportName; Send_Pdf = RepPar.Send_Pdf; DocUUID = RepPar.DocUUID;

            DocPDFFolder = RepPar.DocPDFFolder == null ? "/SavePath/" : RepPar.DocPDFFolder.ToString();
            return query;
        }
         
        public IEnumerable<AProc_Rpt_GLFinancialStatment_Result> Rpt_GLFinancialStatment_Lndscp(RepFinancials RepPar)
        {
            ReportStandardParameters StandPar = getStandardParameters(RepPar);
            

            //ReportInfo Rep;
            int Type = int.Parse(RepPar.RepType.ToString());
            SqlParameter spRepType = new SqlParameter("@RepType", Type);

            string formDate = RepPar.FromDate.ToString();
            SqlParameter spformDate = new SqlParameter("@FromDate", formDate);

            string toDate = RepPar.ToDate.ToString();
            SqlParameter sptoDate = new SqlParameter("@ToDate", toDate);

            string cc_Code = RepPar.cc_code.ToString();
            SqlParameter spcc_Code = new SqlParameter("@cc_Code", cc_Code == "-1" ? null : cc_Code);

            int Level = int.Parse(RepPar.Level.ToString());
            SqlParameter spLevel = new SqlParameter("@Level", Level == -1 ? System.Data.SqlTypes.SqlInt32.Null : Level);

            int IsAuthVchr = int.Parse(RepPar.IsAuthVchr.ToString());
            SqlParameter spIsAuthVchr = new SqlParameter("@IsAuthVchr", IsAuthVchr);

            int IsNewVchr = int.Parse(RepPar.IsNewVchr.ToString());
            SqlParameter spIsNewVchr = new SqlParameter("@IsNewVchr", IsNewVchr);

            int ExZero = int.Parse(RepPar.exzero.ToString());
            SqlParameter spExZero = new SqlParameter("@ExZero", ExZero);

            int Typ = int.Parse(RepPar.Typ.ToString());
            SqlParameter spTyp = new SqlParameter("@type", Typ);

            if (Typ == 1)
            {
                Rep = OpenReport("Rpt_GLFinancialStatment_Lndscp");

            }

            else if (Typ == 2)
            {
                Rep = OpenReport("Rpt_GLFinancialIncome_Lndscp");

            }
            else
            {
                Rep = OpenReport("Rpt_GLFinancialbalancesheet_Lndscp");
            }






            string _Query = "execute " + Rep.dataSource +
           " @comp = '" + StandPar.spComCode.Value + "'" +
           ", @bra = '" + StandPar.spbra.Value + "'" +
           ", @CompNameA = '" + StandPar.spComNameA.Value + "'" +
           ", @CompNameE = '" + StandPar.spComNameE.Value + "'" +
           ", @BraNameA = '" + StandPar.spBraNameA.Value + "'" +
           ", @BraNameE = '" + StandPar.braNameE.Value + "'" +
           ", @LoginUser = '" + StandPar.spLoginUser.Value + "'" +
           ", @RepType = " + spRepType.Value +
           ", @FromDate = '" + spformDate.Value + "'" +
           ", @Todate = '" + sptoDate.Value + "'" +
           ", @cc_Code ='" + spcc_Code.Value + "'" +
           ", @IsAuthVchr = " + spIsAuthVchr.Value +
           ", @IsNewVchr = " + spIsNewVchr.Value +
           ", @Level = " + spLevel.Value +
           ", @ExZero = " + spExZero.Value +
           ", @RepTyp = " + spTyp.Value;


            List<AProc_Rpt_GLFinancialStatment_Result> query = db.Database.SqlQuery<AProc_Rpt_GLFinancialStatment_Result>(_Query).ToList();
             ReportsDetails();
            reportName = Rep.reportName; Send_Pdf = RepPar.Send_Pdf; DocUUID = RepPar.DocUUID;

            DocPDFFolder = RepPar.DocPDFFolder == null ? "/SavePath/" : RepPar.DocPDFFolder.ToString();
            return query;
        }
          
        public IEnumerable<IProc_Prnt_Collect_Result> Prnt_Collect(RepFinancials RepPar)
        {

            ReportStandardParameters StandPar = getStandardParameters(RepPar);
            

            int TRId = int.Parse(RepPar.TRId.ToString());
            SqlParameter spTRId = new SqlParameter("@TRId", TRId);
            int Repdesign = int.Parse(RepPar.Repdesign.ToString());


            Rep = OpenReport("Prnt_Collect");


            //Rep = OpenReport("Prnt_SlsInvoice");


            int RepType = int.Parse(RepPar.RepType.ToString());
            if (RepType == 0) { RepType = int.Parse(Rep.OutputTypeNo); }
            SqlParameter spRepType = new SqlParameter("@RepType", RepType);

            string _Query = "execute " + Rep.dataSource +
           " @comp = '" + StandPar.spComCode.Value + "'" +
           ", @bra = '" + StandPar.spbra.Value + "'" +
           ", @CompNameA = '" + StandPar.spComNameA.Value + "'" +
           ", @CompNameE = '" + StandPar.spComNameE.Value + "'" +
           ", @BraNameA = '" + StandPar.spBraNameA.Value + "'" +
           ", @BraNameE = '" + StandPar.braNameE.Value + "'" +
           ", @LoginUser = '" + StandPar.spLoginUser.Value + "'" +
           ", @RepType = " + spRepType.Value +
           ", @TRId = " + spTRId.Value;


            var query = db.Database.SqlQuery<IProc_Prnt_Collect_Result>(_Query).ToList();
             ReportsDetails();
            reportName = Rep.reportName; Send_Pdf = RepPar.Send_Pdf; DocUUID = RepPar.DocUUID;

            DocPDFFolder = RepPar.DocPDFFolder == null ? "/SavePath/" : RepPar.DocPDFFolder.ToString();
            return query;



        }
        public IEnumerable<IProc_Prnt_StkIssue_Result> Prnt_StkIssue(RepFinancials RepPar)
        {

            ReportStandardParameters StandPar = getStandardParameters(RepPar);
            

            int TRId = int.Parse(RepPar.TRId.ToString());
            SqlParameter spTRId = new SqlParameter("@TRId", TRId);
            int Repdesign = int.Parse(RepPar.Repdesign.ToString());


            Rep = OpenReport("Prnt_StkIssue");


            //Rep = OpenReport("Prnt_SlsInvoice");


            int RepType = int.Parse(RepPar.RepType.ToString());
            if (RepType == 0) { RepType = int.Parse(Rep.OutputTypeNo); }
            SqlParameter spRepType = new SqlParameter("@RepType", RepType);

            string _Query = "execute " + Rep.dataSource +
           " @comp = '" + StandPar.spComCode.Value + "'" +
           ", @bra = '" + StandPar.spbra.Value + "'" +
           ", @CompNameA = '" + StandPar.spComNameA.Value + "'" +
           ", @CompNameE = '" + StandPar.spComNameE.Value + "'" +
           ", @BraNameA = '" + StandPar.spBraNameA.Value + "'" +
           ", @BraNameE = '" + StandPar.braNameE.Value + "'" +
           ", @LoginUser = '" + StandPar.spLoginUser.Value + "'" +
           ", @RepType = " + spRepType.Value +
           ", @TRId = " + spTRId.Value;


            var query = db.Database.SqlQuery<IProc_Prnt_StkIssue_Result>(_Query).ToList();
             ReportsDetails();
            reportName = Rep.reportName; Send_Pdf = RepPar.Send_Pdf; DocUUID = RepPar.DocUUID;

            DocPDFFolder = RepPar.DocPDFFolder == null ? "/SavePath/" : RepPar.DocPDFFolder.ToString();
            return query;



        }









    }
}