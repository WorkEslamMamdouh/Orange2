using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Newtonsoft.Json;
using System.Data.SqlClient;
using System.Drawing.Printing;
using System.IO;
using System.Drawing.Imaging;
using System.Drawing;
using System.Collections.Specialized;
using System.Globalization;
using System.Text;
using System.Web.Configuration;
using Inv.WebUI.Reports.Models;
using Inv.WebUI.Reports.Forms;


using System.Net.Http; 
using QRCoder;
using Inv.DAL.Repository;
using Inv.API.Tools;
using Inv.DAL.Domain;
using Microsoft.Reporting.WebForms;
using System.Data.Entity.Core.EntityClient;

namespace RS.WebUI.Reports.Forms
{//eslam 1 dec 2020
    public partial class ReportsForm : System.Web.UI.Page
    {
        //SessionRecord CurrentSession;
        StdParamters CurrentReportParameters;

        ReportsDetails ReportsDetail = new ReportsDetails();
        ReportInfo Rep = new ReportInfo();
        ClassPrint Printer = new ClassPrint();

        protected InvEntities db = UnitOfWork.context(BuildConnectionString());
        string Par;
        string NameAr;
        string NameEn;
        string BrNameAr;
        string BrNameEn;
        string SystemCode = "";
        string SubSystemCode = "";
        int CompCode = 0;
        int? branCode = 0;
        string LoginUser = "";
        string ScreenLanguage = "";
        //public static string BuildConnectionString()
        //{


        //    string DbName = "";
        //    try
        //    {
        //        ClassPrint ListInformation = new ClassPrint();
        //        string[] ListUserInformation = ListInformation.GetUserInformationFromReport();
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
                    sqlBuilder.InitialCatalog = WebConfigurationManager.AppSettings["AbsoluteSysDbNameReportsForm"] + Shared.Session.SelectedYear;
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

        public Boolean CheckUser(string Guid, string uCode)

        {
            string Pref = Guid.Substring(0, 5);
            string OrgGuid = Guid.Remove(0, 5); // remove  prefix 

            string EnGuid = Pref + Inv.WebUI.Reports.Models.UserTools.Encrypt(OrgGuid, "Business-Systems");

            var usr = db.G_USERS.Where(x => x.USER_CODE == uCode).ToList();
            if (usr.Count == 0)
            {
                return false;
            }
            if (usr[0].Tokenid != EnGuid)
            {
                return false;
            }
            if (usr[0].LastLogin == null)
            {
                return false;
            }
            DateTime LL = Convert.ToDateTime(usr[0].LastLogin);
            if (DateTime.Now.Subtract(LL).Hours > 8)
            {
                return false;
            }
            return true;

        }

        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                string x = Request["rpt"];
                string y = Request["par"];
                y = y.Replace("*", "+");
                if (Request["rpt"] == null)
                    return;
                if (Request["par"] != null)
                {   //mahroos 
                    Par = Inv.WebUI.Reports.Models.UserTools.Decrypt(y, "Business-Systems");

                    CurrentReportParameters = JsonConvert.DeserializeObject<StdParamters>(Par);
                }
                //add api call returns boolean mahroos 
                if (!CheckUser(CurrentReportParameters.Tokenid, CurrentReportParameters.UserCode))
                {
                    return;
                }

                reportViewer1.ShowPrintButton = true;

                string ReportName = Request["rpt"];

                if (!IsPostBack)
                {
                    var method = this.GetType().GetMethod(ReportName);
                    method.Invoke(this, null);


                }

            }

        }

        #region Bind Reports Functions
        private void BindReport(string reportName, int OutputTypeNo, string OutputType, ReportsDetails ReportsDetail, params object[] models)
        {
            if (OutputTypeNo == 2) { OutputType = "PDF"; }
            else { OutputType = "Excel"; }
            //reportViewer1.LocalReport.ReportPath = Se"Excel"rver.MapPath("../Report/" + reportName + ".rdlc");
            if (reportName.Contains("Prnt"))
                reportViewer1.LocalReport.ReportPath = Server.MapPath("../Report/Print/" + reportName + ".rdlc");
            else if (reportName.Contains("Slip"))
            {
                reportViewer1.LocalReport.ReportPath = Server.MapPath("../Report/Slip/" + reportName + ".rdlc");

            }
            else
                reportViewer1.LocalReport.ReportPath = Server.MapPath("../Report/Reports/" + reportName + ".rdlc");


            reportViewer1.LocalReport.DataSources.Clear();

            string[] broken_str = reportName.Split('/');
            ReportDataSource source = new ReportDataSource(broken_str[broken_str.Length - 1], models[0]);
            reportViewer1.LocalReport.DataSources.Add(source);
             


            if (OutputTypeNo == 1)
            {
                reportViewer1.DataBind();

            }
            else if (OutputTypeNo == 4)
            {

                Printer.PrintToPrinter(reportViewer1.LocalReport, ReportsDetail);
            }
            else
            {

                Warning[] warnings;
                string[] streamIds;
                string mimeType = string.Empty;
                string encoding = string.Empty;
                string extension = string.Empty;
                byte[] bytes = reportViewer1.LocalReport.Render(OutputType, null, out mimeType, out encoding, out extension, out streamIds, out warnings);
                Response.Buffer = true;
                Response.Clear();
                Response.ContentType = mimeType;
                Response.AddHeader("content-disposition", "attachment; filename=" + reportName + "." + extension);
                Response.OutputStream.Write(bytes, 0, bytes.Length);
                Response.Flush();
                Response.End();
            }



        }
        private void BindReport(string reportName, List<DataSourceStruct> models)
        {
            reportViewer1.LocalReport.ReportPath = Server.MapPath("../Reports/" + reportName + ".rdlc");
            reportViewer1.LocalReport.DataSources.Clear();
            foreach (var model in models)
            {
                ReportDataSource source = new ReportDataSource(model.Name, model.DataSource);
                reportViewer1.LocalReport.DataSources.Add(source);
            }

            reportViewer1.DataBind();

        }
        private void BindSSRS(string reportName, List<DataSourceStruct> models)
        {
            reportViewer1.LocalReport.ReportPath = Server.MapPath("../Reports/" + reportName + ".rdlc");
            reportViewer1.LocalReport.DataSources.Clear();
            foreach (var model in models)
            {
                ReportDataSource source = new ReportDataSource(model.Name, model.DataSource);
                reportViewer1.LocalReport.DataSources.Add(source);
            }

            reportViewer1.DataBind();
        }
        #endregion

        #region Calling Reports Function

        protected void btnPrint_Click(object sender, EventArgs e)
        {
            ReportPrintDocument rp = new ReportPrintDocument(reportViewer1.LocalReport);
            rp.Print();
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
                    report = DefauldReports.Where(x => x.COMP_CODE == CompCode && x.BRA_Code ==null );
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

        private ReportStandardParameters getStandardParameters()
        {
            ReportStandardParameters StandardParameter = new ReportStandardParameters();
            ScreenLanguage = CurrentReportParameters.ScreenLanguage;
            //CurrentSession = JsonConvert.DeserializeObject<SessionRecord>(Request["ses"]);
            if (ScreenLanguage == "ar")
            {
                reportViewer1.Attributes.Add("style", "direction:rtl;");
            }
            else
            {
                reportViewer1.Attributes.Add("style", "direction:ltr;");
            }
            //int CompCode = int.Parse(Request["CompCode"].ToString());
            CompCode = int.Parse(CurrentReportParameters.CompCode);
            branCode = int.Parse(CurrentReportParameters.BranchCode);
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

            SystemCode = CurrentReportParameters.SystemCode;

            SubSystemCode = CurrentReportParameters.SubSystemCode;


            LoginUser = CurrentReportParameters.UserCode;
            StandardParameter.spLoginUser = new SqlParameter("@LoginUser", LoginUser);

            StandardParameter.spbra = new SqlParameter("@bra", branCode);

            return StandardParameter;
        }

        public class ReportPrintDocument : PrintDocument
        {
            private PageSettings m_pageSettings;
            private int m_currentPage;
            private List<Stream> m_pages = new List<Stream>();

            public ReportPrintDocument(ServerReport serverReport)
                : this((Report)serverReport)
            {
                RenderAllServerReportPages(serverReport);
            }

            public ReportPrintDocument(LocalReport localReport)
                : this((Report)localReport)
            {
                RenderAllLocalReportPages(localReport);
            }

            private ReportPrintDocument(Report report)
            {
                // Set the page settings to the default defined in the report 
                ReportPageSettings reportPageSettings = report.GetDefaultPageSettings();
                m_pageSettings = new PageSettings();
                m_pageSettings.PaperSize = reportPageSettings.PaperSize;
                m_pageSettings.Margins = reportPageSettings.Margins;
                m_pageSettings.Landscape = true;
            }

            protected override void Dispose(bool disposing)
            {
                base.Dispose(disposing);

                if (disposing)
                {
                    foreach (Stream s in m_pages)
                    {
                        s.Dispose();
                    }

                    m_pages.Clear();
                }
            }

            protected override void OnBeginPrint(PrintEventArgs e)
            {
                base.OnBeginPrint(e);

                m_currentPage = 0;
            }

            protected override void OnPrintPage(PrintPageEventArgs e)
            {
                if (e == null)
                    throw new ArgumentNullException("e");

                base.OnPrintPage(e);

                Stream pageToPrint = m_pages[m_currentPage];
                pageToPrint.Position = 0;

                // Load each page into a Metafile to draw it. 
                using (Metafile pageMetaFile = new Metafile(pageToPrint))
                {
                    Rectangle adjustedRect = new Rectangle(
                            e.PageBounds.Left - (int)e.PageSettings.HardMarginX,
                            e.PageBounds.Top - (int)e.PageSettings.HardMarginY,
                            e.PageBounds.Width,
                            e.PageBounds.Height);

                    // Draw a white background for the report 
                    e.Graphics.FillRectangle(Brushes.White, adjustedRect);

                    // Draw the report content 
                    e.Graphics.DrawImage(pageMetaFile, adjustedRect);

                    // Prepare for next page.  Make sure we haven't hit the end. 
                    m_currentPage++;
                    e.HasMorePages = m_currentPage < m_pages.Count;
                }
            }

            protected override void OnQueryPageSettings(QueryPageSettingsEventArgs e)
            {
                if (e == null)
                    throw new ArgumentNullException("e");

                e.PageSettings = (PageSettings)m_pageSettings.Clone();
            }

            private void RenderAllServerReportPages(ServerReport serverReport)
            {
                string deviceInfo = CreateEMFDeviceInfo();

                // Generating Image renderer pages one at a time can be expensive.  In order 
                // to generate page 2, the server would need to recalculate page 1 and throw it 
                // away.  Using PersistStreams causes the server to generate all the pages in 
                // the background but return as soon as page 1 is complete. 
                NameValueCollection firstPageParameters = new NameValueCollection();
                firstPageParameters.Add("rs:PersistStreams", "True");

                // GetNextStream returns the next page in the sequence from the background process 
                // started by PersistStreams. 
                NameValueCollection nonFirstPageParameters = new NameValueCollection();
                nonFirstPageParameters.Add("rs:GetNextStream", "True");

                string mimeType;
                string fileExtension;
                Stream pageStream = serverReport.Render("IMAGE", deviceInfo, firstPageParameters, out mimeType, out fileExtension);

                // The server returns an empty stream when moving beyond the last page. 
                while (pageStream.Length > 0)
                {
                    m_pages.Add(pageStream);

                    pageStream = serverReport.Render("IMAGE", deviceInfo, nonFirstPageParameters, out mimeType, out fileExtension);
                }
            }

            private void RenderAllLocalReportPages(LocalReport localReport)
            {
                string deviceInfo = CreateEMFDeviceInfo();

                Warning[] warnings;
                localReport.Render("IMAGE", deviceInfo, LocalReportCreateStreamCallback, out warnings);
            }

            private Stream LocalReportCreateStreamCallback(
                string name,
                string extension,
                Encoding encoding,
                string mimeType,
                bool willSeek)
            {
                MemoryStream stream = new MemoryStream();
                m_pages.Add(stream);

                return stream;
            }

            private string CreateEMFDeviceInfo()
            {
                PaperSize paperSize = m_pageSettings.PaperSize;
                Margins margins = m_pageSettings.Margins;

                // The device info string defines the page range to print as well as the size of the page. 
                // A start and end page of 0 means generate all pages. 
                return string.Format(
                    CultureInfo.InvariantCulture,
                    "<DeviceInfo><OutputFormat>emf</OutputFormat><StartPage>0</StartPage><EndPage>0</EndPage><MarginTop>{0}</MarginTop><MarginLeft>{1}</MarginLeft><MarginRight>{2}</MarginRight><MarginBottom>{3}</MarginBottom><PageHeight>{4}</PageHeight><PageWidth>{5}</PageWidth></DeviceInfo>",
                    ToInches(margins.Top),
                    ToInches(margins.Left),
                    ToInches(margins.Right),
                    ToInches(margins.Bottom),
                    "21.5cm",
                    "14cm");
            }

            private static string ToInches(int hundrethsOfInch)
            {
                double inches = hundrethsOfInch / 100.0;
                return inches.ToString(CultureInfo.InvariantCulture) + "in";
            }
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

        #endregion
        /// <summary>
        //work 1/12/2020
        /// </summary>
        /// <returns></returns>
        public IEnumerable<IQ_GetSalesMan> RPT_Test()
        {
            ReportStandardParameters StandPar = getStandardParameters();
            Reportparam RepPar = JsonConvert.DeserializeObject<Reportparam>(Par);



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

            BindReport(Rep.reportName, Type, Rep.OutputType, ReportsDetail, query);
            return query;
        }
        //R_Rpt_AccReceiptList
        public IEnumerable<IProc_Rpt_AccReceiptList_Result> R_Rpt_AccReceiptList()
        {
            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);

            //ReportInfo Rep;
            int Type = int.Parse(RepPar.RepType.ToString());
            SqlParameter spRepType = new SqlParameter("@RepType", Type);

            int TrType = int.Parse(RepPar.TrType.ToString());
            SqlParameter spTrType = new SqlParameter("@TrType", TrType);

            string dateForm = RepPar.FromDate.ToString();
            SqlParameter spformDate = new SqlParameter("@FromDate", dateForm);

            string dateTo = RepPar.ToDate.ToString();
            SqlParameter sptoDate = new SqlParameter("@ToDate", dateTo);

            int BoxId = int.Parse(RepPar.BoxId.ToString());
            SqlParameter spBoxId = new SqlParameter("@BoxId", BoxId == -1 ? System.Data.SqlTypes.SqlInt32.Null : BoxId);

            int RecType = int.Parse(RepPar.RecType.ToString());
            SqlParameter spRecType = new SqlParameter("@RecType", RecType == -1 ? System.Data.SqlTypes.SqlInt32.Null : RecType);

            int CashType = int.Parse(RepPar.CashType.ToString());
            SqlParameter spCashType = new SqlParameter("@CashType", CashType == -1 ? System.Data.SqlTypes.SqlInt32.Null : CashType);             

            string BnfID = RepPar.BnfID.ToString();
            SqlParameter spBnfID = new SqlParameter("@BnfID", BnfID);

            string BnfDesc = RepPar.BnfDesc.ToString();
            SqlParameter spBnfDesc = new SqlParameter("@BnfDesc", BnfDesc);

            int Status = int.Parse(RepPar.Status.ToString());
            SqlParameter spStatus = new SqlParameter("@Status", Status);
            int Repdesign = RepPar.Repdesign;

            Rep = OpenReport("Rpt_AccPaymentList");
            if (TrType == 1)
            {
                Rep = OpenReport("Rpt_AccReceiptList");
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
           ", @TrType = " + spTrType.Value +
           ", @FromDate = '" + spformDate.Value + "'" +
           ", @ToDate = '" + sptoDate.Value + "'" +
           ", @BoxId = " + spBoxId.Value +
           ", @RecType = " + spRecType.Value +
           ", @BnfID = '" + spBnfID.Value + "'" +
           ", @BnfDesc = '" + spBnfDesc.Value + "'" +
           ", @CashType = " + spCashType.Value + "" +
           ", @Status = " + spStatus.Value;

            var query = db.Database.SqlQuery<IProc_Rpt_AccReceiptList_Result>(_Query).ToList();

            //if (Type == 1)
            //BindReport(Rep.reportName, Rep.OutputTypeNo, Rep.OutputType, query);
            //else if (Type == 2)
            //    BindReport(Rep.reportName, "2", "PDF", query);
            //else
            //    BindReport(Rep.reportName, "3", "Excel", query);
            ReportsDetails();


            BindReport(Rep.reportName, Type, Rep.OutputType, ReportsDetail, query);
            return query;
        }
        //IProc_Prnt_AccReceive
        public IEnumerable<IProc_Prnt_AccReceive_Result> Rpt_Prnt_AccReceive()
        {
            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);




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



            int Type = int.Parse(RepPar.RepType.ToString());
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
            BindReport(Rep.reportName, Type, Rep.OutputType, ReportsDetail, query);
            return query;
        }

        //R_Rpt_AccAdjustList
        public IEnumerable<IProc_Rep_AccAdjustList_Result> R_Rpt_AccAdjustList()
        {

            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);


            int Type = int.Parse(RepPar.RepType.ToString());
            SqlParameter spRepType = new SqlParameter("@RepType", Type);

            int TrType = int.Parse(RepPar.TrType.ToString());
            SqlParameter spTrType = new SqlParameter("@TrType", TrType);

            string dateForm = RepPar.FromDate.ToString();
            SqlParameter spformDate = new SqlParameter("@FromDate", dateForm);

            string dateTo = RepPar.ToDate.ToString();
            SqlParameter sptoDate = new SqlParameter("@ToDate", dateTo);

            int AdjDebit = int.Parse(RepPar.AdjDebit.ToString());
            SqlParameter spAdjDebit = new SqlParameter("@AdjDebit", AdjDebit == -1 ? System.Data.SqlTypes.SqlInt32.Null : AdjDebit);

            int AdjId = int.Parse(RepPar.AdjId.ToString());
            SqlParameter spAdjId = new SqlParameter("@AdjId", AdjId == -1 ? System.Data.SqlTypes.SqlInt32.Null : AdjId);

            int CustomerID = int.Parse(RepPar.CustomerID.ToString());
            SqlParameter spCustomerID = new SqlParameter("@CustomerID", CustomerID == -1 ? System.Data.SqlTypes.SqlInt32.Null : CustomerID);

            int VendorId = int.Parse(RepPar.VendorId.ToString());
            SqlParameter spVendorId = new SqlParameter("@VendorId", VendorId == -1 ? System.Data.SqlTypes.SqlInt32.Null : VendorId);

            int Status = int.Parse(RepPar.Status.ToString());
            SqlParameter spStatus = new SqlParameter("@Status", Status);
            int Repdesign = RepPar.Repdesign;
            //@RepType int,  @TrType int , @FromDate n, @ToDate  , @BoxId int ,RecType int , @BnfID  
            //@Status int
            //Rpt_AccAdjustList
            Rep = OpenReport("Rpt_AccVendorAdjustList");
            if (TrType == 1)
            {
                Rep = OpenReport("Rpt_AccAdjustList");
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
           ", @TrType = " + spTrType.Value +
           ", @FromDate = '" + spformDate.Value + "'" +
           ", @ToDate = '" + sptoDate.Value + "'" +
           ", @AdjDebit = " + spAdjDebit.Value +
           ", @AdjId = " + spAdjId.Value +
           ", @CustomerID = " + spCustomerID.Value +
           ", @VendorId = " + spVendorId.Value +
           ", @Status = " + spStatus.Value;


            var query = db.Database.SqlQuery<IProc_Rep_AccAdjustList_Result>(_Query).ToList();

            //if (Type == 1)
            ReportsDetails();
            BindReport(Rep.reportName, Type, Rep.OutputType, ReportsDetail, query);
            return query;
        }
        //Prnt_AccAdjust
        public IEnumerable<IProc_Prnt_AccAdjust_Result> Rpt_Prnt_AccAdjust()
        {
            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);



            var TRId = int.Parse(RepPar.TRId.ToString());
            SqlParameter spTRId = new SqlParameter("@TRId", TRId);

            int Repdesign = RepPar.Repdesign;

            Rep = OpenReport("Rpt_Prnt_AccVendorAdjust");
            int Type = int.Parse(RepPar.RepType.ToString());
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
            BindReport(Rep.reportName, Type, Rep.OutputType, ReportsDetail, query);
            return query;
        }

        //R_Rpt_SlsInvoiceList
        public IEnumerable<IProc_Rpt_SlsInvoiceListVer2_Result> R_Rpt_SlsInvoiceList()
        {

            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);


            int Type = int.Parse(RepPar.RepType.ToString());
            SqlParameter spRepType = new SqlParameter("@RepType", Type);

            int TrType = int.Parse(RepPar.TrType.ToString());
            SqlParameter spTrType = new SqlParameter("@TrType", TrType);

            string dateForm = RepPar.FromDate.ToString();
            SqlParameter spformDate = new SqlParameter("@FromDate", dateForm);

            string dateTo = RepPar.ToDate.ToString();
            SqlParameter sptoDate = new SqlParameter("@ToDate", dateTo);

            int CustomerID = int.Parse(RepPar.CustomerID.ToString());
            SqlParameter spCustomerID = new SqlParameter("@CustomerID", CustomerID == -1 ? System.Data.SqlTypes.SqlInt32.Null : CustomerID);

            int SalesmanID = int.Parse(RepPar.SalesmanID.ToString());
            SqlParameter spSalesmanID = new SqlParameter("@SalesmanID", SalesmanID == -1 ? System.Data.SqlTypes.SqlInt32.Null : SalesmanID);

            int OperationId = int.Parse(RepPar.OperationId.ToString());
            SqlParameter spOperationId = new SqlParameter("@OperationID", OperationId == -1 ? System.Data.SqlTypes.SqlInt32.Null : OperationId);

            int CashType = int.Parse(RepPar.CashType.ToString());
            SqlParameter spCashType = new SqlParameter("@CashType", CashType);

            int Status = int.Parse(RepPar.Status.ToString());
            SqlParameter spStatus = new SqlParameter("@Status", Status);
            int Repdesign = RepPar.Repdesign;
            int SlsInvSrc = RepPar.src;
            int Typ = RepPar.Typ;



            SqlParameter spSlsInvSrc = new SqlParameter("@SlsInvSrc", SlsInvSrc);
            if (SlsInvSrc == 2)
            {
                if (TrType == 0)
                {
                    Rep = OpenReport("Rpt_OperationInvoiceListVer2");
                }
                else
                {
                    Rep = OpenReport("Rpt_OperationReturnListVer2");
                }

            }
            else
            {
                if (TrType == 0)
                {
                    Rep = OpenReport("Rpt_SlsInvoiceListVer2");
                }

                else
                {
                    Rep = OpenReport("Rpt_SlsReturnListVer2");
                }
            }
            if (Typ == 5)
            {
                Rep = OpenReport("Rpt_QutationListVer2");
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
           ", @TrType = " + spTrType.Value +
           ", @FromDate = '" + spformDate.Value + "'" +
           ", @ToDate = '" + sptoDate.Value + "'" +
           ", @SlsInvSrc = " + spSlsInvSrc.Value +
           ", @CustomerID = " + spCustomerID.Value +
           ", @SalesmanID= " + spSalesmanID.Value +
           ", @OperationID= " + spOperationId.Value +
           ", @CashType = " + spCashType.Value +
           ", @Status = " + spStatus.Value;



            var query = db.Database.SqlQuery<IProc_Rpt_SlsInvoiceListVer2_Result>(_Query).ToList();

            //if (Type == 1)
            ReportsDetails();
            BindReport(Rep.reportName, Type, Rep.OutputType, ReportsDetail, query);
            return query;
        }

        // operation invoice list
        public IEnumerable<IProc_Rpt_SlsInvoiceListVer2_Result> R_Rpt_operationInvoiceList()
        {

            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);


            int Type = int.Parse(RepPar.RepType.ToString());
            SqlParameter spRepType = new SqlParameter("@RepType", Type);

            int TrType = int.Parse(RepPar.TrType.ToString());
            SqlParameter spTrType = new SqlParameter("@TrType", TrType);

            string dateForm = RepPar.FromDate.ToString();
            SqlParameter spformDate = new SqlParameter("@FromDate", dateForm);

            string dateTo = RepPar.ToDate.ToString();
            SqlParameter sptoDate = new SqlParameter("@ToDate", dateTo);

            int CustomerID = int.Parse(RepPar.CustomerID.ToString());
            SqlParameter spCustomerID = new SqlParameter("@CustomerID", CustomerID == -1 ? System.Data.SqlTypes.SqlInt32.Null : CustomerID);

            int SalesmanID = int.Parse(RepPar.SalesmanID.ToString());
            SqlParameter spSalesmanID = new SqlParameter("@SalesmanID", SalesmanID == -1 ? System.Data.SqlTypes.SqlInt32.Null : SalesmanID);

            int OperationId = int.Parse(RepPar.OperationId.ToString());
            SqlParameter spOperationId = new SqlParameter("@OperationID", OperationId == -1 ? System.Data.SqlTypes.SqlInt32.Null : OperationId);

            int CashType = int.Parse(RepPar.CashType.ToString());
            SqlParameter spCashType = new SqlParameter("@CashType", CashType);

            int Status = int.Parse(RepPar.Status.ToString());
            SqlParameter spStatus = new SqlParameter("@Status", Status);
            int Repdesign = RepPar.Repdesign;

            int SlsInvSrc = RepPar.src;
            SqlParameter spSlsInvSrc = new SqlParameter("@SlsInvSrc", SlsInvSrc);

            if (TrType == 0)
            {
                Rep = OpenReport("Rpt_OperationInvoiceListVer2");
            }
            else
            {
                Rep = OpenReport("Rpt_OperationReturnListVer2");
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
           ", @TrType = " + spTrType.Value +
           ", @FromDate = '" + spformDate.Value + "'" +
           ", @ToDate = '" + sptoDate.Value + "'" +
           ", @SlsInvSrc = " + spSlsInvSrc.Value +
           ", @CustomerID = " + spCustomerID.Value +
           ", @SalesmanID= " + spSalesmanID.Value +
           ", @OperationID= " + spOperationId.Value +
           ", @CashType = " + spCashType.Value +
           ", @Status = " + spStatus.Value;



            var query = db.Database.SqlQuery<IProc_Rpt_SlsInvoiceListVer2_Result>(_Query).ToList();

            //if (Type == 1)
            ReportsDetails();
            BindReport(Rep.reportName, Type, Rep.OutputType, ReportsDetail, query);
            return query;
        }





        public IEnumerable<IProc_Rpt_OperationExportList_Result> Rpt_OperationExportList()
        {

            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);


            int Type = int.Parse(RepPar.RepType.ToString());
            SqlParameter spRepType = new SqlParameter("@RepType", Type);


            string dateForm = RepPar.FromDate.ToString();
            SqlParameter spformDate = new SqlParameter("@FromDate", dateForm);

            string dateTo = RepPar.ToDate.ToString();
            SqlParameter sptoDate = new SqlParameter("@ToDate", dateTo);


            int SalesmanID = int.Parse(RepPar.SalesmanID.ToString());
            SqlParameter spSalesmanID = new SqlParameter("@SlsID", SalesmanID == -1 ? System.Data.SqlTypes.SqlInt32.Null : SalesmanID);

            int VendorId = int.Parse(RepPar.VendorId.ToString());
            SqlParameter spVendorId = new SqlParameter("@vndId", VendorId == -1 ? System.Data.SqlTypes.SqlInt32.Null : VendorId);

            int OperationId = int.Parse(RepPar.OperationId.ToString());
            SqlParameter spOperationId = new SqlParameter("@OperationID", OperationId == -1 ? System.Data.SqlTypes.SqlInt32.Null : OperationId);


            int Status = int.Parse(RepPar.Status.ToString());
            SqlParameter spStatus = new SqlParameter("@Status", Status == -1 ? System.Data.SqlTypes.SqlInt32.Null : Status);
            int Repdesign = RepPar.Repdesign;


            Rep = OpenReport("Rpt_OperationExportList");



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
           ", @ToDate = '" + sptoDate.Value + "'";



            var query = db.Database.SqlQuery<IProc_Rpt_OperationExportList_Result>(_Query).ToList();

            //if (Type == 1)
            ReportsDetails();
            BindReport(Rep.reportName, Type, Rep.OutputType, ReportsDetail, query);
            return query;
        }


        public IEnumerable<IProc_Rpt_OperationList_Result> Rpt_OperationList()
        {

            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);


            int Type = int.Parse(RepPar.RepType.ToString());
            SqlParameter spRepType = new SqlParameter("@RepType", Type);


            string dateForm = RepPar.FromDate.ToString();
            SqlParameter spformDate = new SqlParameter("@FromDate", dateForm);

            string dateTo = RepPar.ToDate.ToString();
            SqlParameter sptoDate = new SqlParameter("@ToDate", dateTo);


            int SalesmanID = int.Parse(RepPar.SalesmanID.ToString());
            SqlParameter spSalesmanID = new SqlParameter("@SlsID", SalesmanID == -1 ? System.Data.SqlTypes.SqlInt32.Null : SalesmanID);

            int VendorId = int.Parse(RepPar.VendorId.ToString());
            SqlParameter spVendorId = new SqlParameter("@vndId", VendorId == -1 ? System.Data.SqlTypes.SqlInt32.Null : VendorId);

            int OperationId = int.Parse(RepPar.OperationId.ToString());
            SqlParameter spOperationId = new SqlParameter("@OperationID", OperationId == -1 ? System.Data.SqlTypes.SqlInt32.Null : OperationId);


            int Status = int.Parse(RepPar.Status.ToString());
            SqlParameter spStatus = new SqlParameter("@Status", Status == -1 ? System.Data.SqlTypes.SqlInt32.Null : Status);
            int Repdesign = RepPar.Repdesign;


            Rep = OpenReport("Rpt_OperationList");



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
           ", @ToDate = '" + sptoDate.Value + "'" +
           ", @vndId= " + spVendorId.Value +
           ", @OperationID= " + spOperationId.Value +
           ", @SlsID= " + spSalesmanID.Value +
           ", @Status = " + spStatus.Value;



            var query = db.Database.SqlQuery<IProc_Rpt_OperationList_Result>(_Query).ToList();

            //if (Type == 1)
            ReportsDetails();
            BindReport(Rep.reportName, Type, Rep.OutputType, ReportsDetail, query);
            return query;
        }

        //Prnt_OperationCharges
        public IEnumerable<IProc_Prnt_OperationCharges_Result> Prnt_OperationCharges()
        {
            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);

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
            BindReport(Rep.reportName, Type, Rep.OutputType, ReportsDetail, query);
            return query;
        }



        public IEnumerable<IProc_Prnt_OperationItems_Result> Prnt_OperationItems()
        {

            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);


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

            //if (Type == 1)
            ReportsDetails();
            BindReport(Rep.reportName, Type, Rep.OutputType, ReportsDetail, query);
            return query;
        }

        public IEnumerable<IProc_Prnt_OperationSalesmanItem_Result> Prnt_OperationSalesmanItem()
        {
            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);

            int Type = int.Parse(RepPar.RepType.ToString());
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
            BindReport(Rep.reportName, Type, Rep.OutputType, ReportsDetail, query);
            return query;
        }
        public IEnumerable<IProc_Rep_OperationSum_Result> Rep_OperationSum()
        {
            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);

            int Type = int.Parse(RepPar.RepType.ToString());
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
            BindReport(Rep.reportName, Type, Rep.OutputType, ReportsDetail, query);
            return query;
        }

        public IEnumerable<IProc_Rep_OperationSumInternal_Result> Rep_OperationSumInternal()
        {
            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);

            int Type = int.Parse(RepPar.RepType.ToString());
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
            BindReport(Rep.reportName, Type, Rep.OutputType, ReportsDetail, query);
            return query;
        }

        public IEnumerable<IProc_Rep_OperationItemSales_Result> Rep_salesrecord()
        {
            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);

            int Type = int.Parse(RepPar.RepType.ToString()); 

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
            BindReport(Rep.reportName, Type, Rep.OutputType, ReportsDetail, query);
            return query;
        }
        public IEnumerable<IProc_Prnt_OperationDeposit_Result> Prnt_OperationDeposit()
        {
            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);

            int Type = int.Parse(RepPar.RepType.ToString());
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
            BindReport(Rep.reportName, Type, Rep.OutputType, ReportsDetail, query);
            return query;
        }








        //IProc_Prnt_SlsInvoice
        public IEnumerable<IProc_Prnt_SlsInvoiceVer2_Result> Rpt_Prnt_SlsInvoice()
        {
            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);

            var TRId = int.Parse(RepPar.TRId.ToString());
            SqlParameter spTRId = new SqlParameter("@TRId", TRId);
            int typ = int.Parse(RepPar.Typ.ToString());



            var InvType = db.Database.SqlQuery<int?>("select  InvoiceTransCode from I_Sls_TR_Invoice where InvoiceID = " + TRId).FirstOrDefault();
            InvType = InvType == null ? 0 : InvType;

            int Repdesign = RepPar.Repdesign;
            int slip = RepPar.slip;
            if (slip == 1)
            {
                Rep = OpenReport("Slip_Prnt_SlsInvoiceSimple");
            }
            else
            {
                if (typ == 1)  // price show
                {
                    if (InvType == 1)
                    {
                        Rep = OpenReport("Prnt_SlsQuotationStd");
                    }
                    else
                    {
                        Rep = OpenReport("Prnt_SlsQuotationeSimple");
                    }
                }
                else  // invoice 
                {



                    if (InvType == 1)   // std invoice 
                    {
                        Rep = OpenReport("Rpt_Prnt_SlsInvoiceStd");
                    }
                    else    // simple invoice 
                    {
                        Rep = OpenReport("Rpt_Prnt_SlsInvoiceSimple");
                    }


                }
            }

            int Type = int.Parse(RepPar.RepType.ToString());
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
            BindReport(Rep.reportName, Type, Rep.OutputType, ReportsDetail, query);
            return query;
        }





        // print _ operation _ invoice
        public IEnumerable<IProc_Prnt_SlsInvoiceVer2_Result> Rpt_Prnt_OperationInvoice()
        {
            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);

            var TRId = int.Parse(RepPar.TRId.ToString());
            SqlParameter spTRId = new SqlParameter("@TRId", TRId);
            int typ = int.Parse(RepPar.Typ.ToString());



            var InvType = db.Database.SqlQuery<int?>("select  InvoiceTransCode from I_Sls_TR_Invoice where InvoiceID = " + TRId).FirstOrDefault();
            InvType = InvType == null ? 0 : InvType;

            int Repdesign = RepPar.Repdesign;
            int slip = RepPar.slip;

            if (slip == 1)
            {
                Rep = OpenReport("Slip_OPerationInvoiceSimple");
            }
            else
            {

                if (InvType == 1)   // std invoice 
                {
                    Rep = OpenReport("Rpt_Prnt_OPerationInvoiceStd");
                }
                else    // simple invoice 
                {
                    Rep = OpenReport("Rpt_Prnt_OPerationInvoiceSimple");
                }
            }


            int Type = int.Parse(RepPar.RepType.ToString());
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
            BindReport(Rep.reportName, Type, Rep.OutputType, ReportsDetail, query);
            return query;
        }
        public IEnumerable<IProc_Prnt_SlsInvoiceVer2_Result> Rpt_Prnt_SlsInvReturn()
        {
            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);




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
                Rep = OpenReport("Rpt_Prnt_SlsInvReturnStd");
            }
            else // simple invoice return 
            {
                Rep = OpenReport("Rpt_Prnt_SlsInvReturnSimple");
            }


            int Type = int.Parse(RepPar.RepType.ToString());
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
            BindReport(Rep.reportName, Type, Rep.OutputType, ReportsDetail, query);
            return query;
        }

        ///IProc_Rpt_AccSlsCashInvoiceList
        public IEnumerable<IProc_Rpt_AccSlsCashInvoiceList_Result> Rpt_AccSlsCashInvoiceList()
        {

            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);


            int Type = int.Parse(RepPar.RepType.ToString());
            SqlParameter spRepType = new SqlParameter("@RepType", Type);

            int TrType = int.Parse(RepPar.TrType.ToString());
            SqlParameter spTrType = new SqlParameter("@TrType", TrType);

            string dateForm = RepPar.FromDate.ToString();
            SqlParameter spformDate = new SqlParameter("@FromDate", dateForm);

            string dateTo = RepPar.ToDate.ToString();
            SqlParameter sptoDate = new SqlParameter("@ToDate", dateTo);

            int PaymentType = int.Parse(RepPar.PaymentType.ToString());
            SqlParameter spPaymentType = new SqlParameter("@PaymentType", PaymentType);

            int CustomerID = int.Parse(RepPar.CustomerID.ToString());
            SqlParameter spCustomerID = new SqlParameter("@CustomerID", CustomerID == -1 ? System.Data.SqlTypes.SqlInt32.Null : CustomerID);

            int SalesmanID = int.Parse(RepPar.SalesmanID.ToString());
            SqlParameter spSalesmanID = new SqlParameter("@SalesmanID", SalesmanID == -1 ? System.Data.SqlTypes.SqlInt32.Null : SalesmanID);

            int CashBoxID = int.Parse(RepPar.CashBoxID.ToString());
            SqlParameter spCashBoxID = new SqlParameter("@CashBoxID", CashBoxID == -1 ? System.Data.SqlTypes.SqlInt32.Null : CashBoxID);

            string MobileNo = RepPar.MobileNo.ToString();
            SqlParameter spMobileNo = new SqlParameter("@MobileNo", MobileNo == "-1" ? null : MobileNo);

            int Status = int.Parse(RepPar.Status.ToString());
            SqlParameter spStatus = new SqlParameter("@Status", Status);
            int Repdesign = RepPar.Repdesign;

            Rep = OpenReport("Rpt_AccSlsCashInvoiceList");


            string _Query = "execute " + Rep.dataSource +
           " @comp = '" + StandPar.spComCode.Value + "'" +
           ", @bra = '" + StandPar.spbra.Value + "'" +
           ", @CompNameA = '" + StandPar.spComNameA.Value + "'" +
           ", @CompNameE = '" + StandPar.spComNameE.Value + "'" +
           ", @BraNameA = '" + StandPar.spBraNameA.Value + "'" +
           ", @BraNameE = '" + StandPar.braNameE.Value + "'" +
           ", @LoginUser = '" + StandPar.spLoginUser.Value + "'" +
           ", @RepType = " + spRepType.Value +
           ", @TrType = " + spTrType.Value +
           ", @FromDate = '" + spformDate.Value + "'" +
           ", @ToDate = '" + sptoDate.Value + "'" +
           ", @PaymentType = " + spPaymentType.Value +
           ", @CustomerID = " + spCustomerID.Value +
           ", @SalesmanID= " + spSalesmanID.Value +
           ", @CashBoxID = " + spCashBoxID.Value +
           ", @MobileNo = '" + spMobileNo.Value + "'" +
           ", @Status = " + spStatus.Value;

            var query = db.Database.SqlQuery<IProc_Rpt_AccSlsCashInvoiceList_Result>(_Query).ToList();

            //if (Type == 1)
            ReportsDetails();
            BindReport(Rep.reportName, Type, Rep.OutputType, ReportsDetail, query);
            return query;
        }


        public IEnumerable<IProc_Rpt_PurReceiveList_Result> Rpt_PurReceiveList()
        {
            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);

            int RepType = int.Parse(RepPar.RepType.ToString());
            SqlParameter spRepType = new SqlParameter("@RepType", RepType);

            int TrType = int.Parse(RepPar.TrType.ToString());
            SqlParameter spTrType = new SqlParameter("@TrType", TrType);

            string FormDate = RepPar.FromDate.ToString();
            SqlParameter spFromDate = new SqlParameter("@FromDate", FormDate);

            string ToDate = RepPar.ToDate.ToString();
            SqlParameter spToDate = new SqlParameter("@ToDate", ToDate);

            int vendorID = int.Parse(RepPar.SalesmanID.ToString());
            SqlParameter spvendorID = new SqlParameter("@VendorID", vendorID == -1 ? System.Data.SqlTypes.SqlInt32.Null : vendorID);

            int SalesmanID = int.Parse(RepPar.SalesmanID.ToString());
            SqlParameter spSalesmanID = new SqlParameter("@SalesmanID", SalesmanID == -1 ? System.Data.SqlTypes.SqlInt32.Null : SalesmanID);

            int CashType = int.Parse(RepPar.CashType.ToString());
            SqlParameter spCashType = new SqlParameter("@CashType", CashType);

            int Status = int.Parse(RepPar.Status.ToString());
            SqlParameter spStatus = new SqlParameter("@Status", Status);

            int Repdesign = RepPar.Repdesign;


            if (TrType == 0)
            {
                Rep = OpenReport("Rpt_PurReceiveList");
            }
            else
            {
                Rep = OpenReport("Rpt_PurReceiveReturn");
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
               ", @TrType = " + spTrType.Value +
               ", @FromDate = '" + spFromDate.Value + "'" +
               ", @ToDate = '" + spToDate.Value + "'" +
               ", @VendorID = " + spvendorID.Value +
               ", @SalesmanID= " + spSalesmanID.Value +
               ", @CashType = " + spCashType.Value +
               ", @Status = " + spStatus.Value;

            var query = db.Database.SqlQuery<IProc_Rpt_PurReceiveList_Result>(_Query).ToList();

            //if (Type == 1)
            ReportsDetails();
            BindReport(Rep.reportName, RepType, Rep.OutputType, ReportsDetail, query);
            return query;

        }
        public IEnumerable<IProc_Rpt_VATSlsInvoiceList_Result> Rpt_VATSlsInvoiceList()
        {
            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);

            int RepType = int.Parse(RepPar.RepType.ToString());
            SqlParameter spRepType = new SqlParameter("@RepType", RepType);

            int TrType = int.Parse(RepPar.TrType.ToString());
            SqlParameter spTrType = new SqlParameter("@TrType", TrType);

            string FormDate = RepPar.FromDate.ToString();
            SqlParameter spFromDate = new SqlParameter("@FromDate", FormDate);

            string ToDate = RepPar.ToDate.ToString();
            SqlParameter spToDate = new SqlParameter("@ToDate", ToDate);

            int CustomerID = int.Parse(RepPar.CustomerID.ToString());
            SqlParameter spCustomerID = new SqlParameter("@CustomerID", CustomerID == -1 ? System.Data.SqlTypes.SqlInt32.Null : CustomerID);

            int CashType = int.Parse(RepPar.CashType.ToString());
            SqlParameter spCashType = new SqlParameter("@CashType", CashType);

            int Status = int.Parse(RepPar.Status.ToString());
            SqlParameter spStatus = new SqlParameter("@Status", Status);

            int Repdesign = RepPar.Repdesign;


            if (TrType == 1)
            {
                Rep = OpenReport("Rpt_VATSlsInvoiceListRet");
            }
            else
            {
                Rep = OpenReport("Rpt_VATSlsInvoiceList");
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
               ", @TrType = " + spTrType.Value +
               ", @FromDate = '" + spFromDate.Value + "'" +
               ", @ToDate = '" + spToDate.Value + "'" +
              ", @CustomerID= " + spCustomerID.Value +
               ", @CashType = " + spCashType.Value +
               ", @Status = " + spStatus.Value;

            var query = db.Database.SqlQuery<IProc_Rpt_VATSlsInvoiceList_Result>(_Query).ToList();

            //if (Type == 1)
            ReportsDetails();
            BindReport(Rep.reportName, RepType, Rep.OutputType, ReportsDetail, query);
            return query;

        }
        ///IProc_Rpt_prnt_PurInvoice

        public IEnumerable<IProc_Prnt_PurReceive_Result> Rpt_Prnt_PurReceive()
        {
            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);


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



            int Type = int.Parse(RepPar.RepType.ToString());
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
            BindReport(Rep.reportName, Type, Rep.OutputType, ReportsDetail, query);
            return query;
        }


        public IEnumerable<IProc_Prnt_PurReceive_Result> Prnt_PurReceivePrice()
        {
            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);


            var TRId = int.Parse(RepPar.TRId.ToString());
            SqlParameter spTRId = new SqlParameter("@TRId", TRId);

            int Repdesign = RepPar.Repdesign;


            Rep = OpenReport("Rpt_Prnt_PurReceivePrice");




            int Type = int.Parse(RepPar.RepType.ToString());
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
            BindReport(Rep.reportName, Type, Rep.OutputType, ReportsDetail, query);
            return query;
        }
        //----------------------------------------



        public IEnumerable<IProc_Rpt_PurReceiveList_Result> Rpt_PurReceiveList_R()
        {
            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);




            int TrType = int.Parse(RepPar.TrType.ToString());
            SqlParameter spTrType = new SqlParameter("@TrType", TrType);

            string FormDate = RepPar.FromDate.ToString();
            SqlParameter spFromDate = new SqlParameter("@FromDate", FormDate);

            string ToDate = RepPar.ToDate.ToString();
            SqlParameter spToDate = new SqlParameter("@ToDate", ToDate);

            int vendorID = int.Parse(RepPar.SalesmanID.ToString());
            SqlParameter spvendorID = new SqlParameter("@SalesmanID", vendorID == -1 ? System.Data.SqlTypes.SqlInt32.Null : vendorID);

            int SalesmanID = int.Parse(RepPar.SalesmanID.ToString());
            SqlParameter spSalesmanID = new SqlParameter("@SalesmanID", SalesmanID == -1 ? System.Data.SqlTypes.SqlInt32.Null : SalesmanID);

            int CashType = int.Parse(RepPar.CashType.ToString());
            SqlParameter spCashType = new SqlParameter("@CashType", CashType);

            int Status = int.Parse(RepPar.Status.ToString());
            SqlParameter spStatus = new SqlParameter("@Status", Status);

            int Repdesign = RepPar.Repdesign;

            Rep = OpenReport("Rpt_PurReceiveReturn");


            int Type = int.Parse(RepPar.RepType.ToString());
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
         ", @TrType = " + spTrType.Value +
         ", @FromDate = '" + spFromDate.Value + "'" +
         ", @ToDate = '" + spToDate.Value + "'" +
         ", @VendorID = " + spvendorID.Value +
         ", @SalesmanID= " + spSalesmanID.Value +
         ", @CashType = " + spCashType.Value +
         ", @Status = " + spStatus.Value;

            var query = db.Database.SqlQuery<IProc_Rpt_PurReceiveList_Result>(_Query).ToList();

            //if (Type == 1)
            ReportsDetails();
            BindReport(Rep.reportName, Type, Rep.OutputType, ReportsDetail, query);
            return query;

        }


        public IEnumerable<IProc_Prnt_PurReceiveRet_Result> Prnt_PurReceiveRet()
        {
            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);


            var TRId = int.Parse(RepPar.TRId.ToString());
            SqlParameter spTRId = new SqlParameter("@TRId", TRId);

            int Repdesign = RepPar.Repdesign;

            Rep = OpenReport("Rpt_Prnt_PurReceiveReturn");

            int Type = int.Parse(RepPar.RepType.ToString());
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
            BindReport(Rep.reportName, Type, Rep.OutputType, ReportsDetail, query);
            return query;
        }

        public IEnumerable<IProc_Prnt_SlsInvoiceVer2_Result> Rpt_Prnt_SlsInvoicepr()
        {
            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);
            var typ = int.Parse(RepPar.Typ.ToString());


            var TRId = int.Parse(RepPar.TRId.ToString());
            SqlParameter spTRId = new SqlParameter("@TRId", TRId);
            var slip = int.Parse(RepPar.slip.ToString());


            int Repdesign = RepPar.Repdesign;
            if (slip == 0)
            {
                Rep = OpenReport("Rpt_Prnt_CashInvoice");
            }
            else
            {
                Rep = OpenReport("Slip_CashInvoice");
            }


            int Type = int.Parse(RepPar.RepType.ToString());
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
            BindReport(Rep.reportName, Type, Rep.OutputType, ReportsDetail, query);
            return query;
        }


        //******---Rpt_AccCustomerList
        public IEnumerable<IProc_Rep_AccCustomerList_Result> Rpt_AccCustomerList()
        {
            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);

            //ReportInfo Rep;
            int Type = int.Parse(RepPar.RepType.ToString());
            SqlParameter spRepType = new SqlParameter("@RepType", Type);

            int CatId = int.Parse(RepPar.CatId.ToString());
            SqlParameter spCatId = new SqlParameter("@CatId", CatId == -1 ? System.Data.SqlTypes.SqlInt32.Null : CatId);

            int Groupid = int.Parse(RepPar.Groupid.ToString());
            SqlParameter spGroupid = new SqlParameter("@Groupid", Groupid == -1 ? System.Data.SqlTypes.SqlInt32.Null : Groupid);

            int SalesmanID = int.Parse(RepPar.SalesmanID.ToString());
            SqlParameter spSalesmanID = new SqlParameter("@Groupid", SalesmanID == -1 ? System.Data.SqlTypes.SqlInt32.Null : SalesmanID);


            int IsCredit = int.Parse(RepPar.IsCredit.ToString());
            SqlParameter spIsCredit = new SqlParameter("@IsCredit", IsCredit == -1 ? System.Data.SqlTypes.SqlInt32.Null : IsCredit);

            int BalStatus = int.Parse(RepPar.BalStatus.ToString());
            SqlParameter spBalStatus = new SqlParameter("@BalStatus", BalStatus);


            Rep = OpenReport("Rpt_AccCustomerList");


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
           ", @SalesManID = " + spSalesmanID.Value +
           ", @IsCredit = " + spIsCredit.Value +
           ", @BalStatus = " + spBalStatus.Value;


            var query = db.Database.SqlQuery<IProc_Rep_AccCustomerList_Result>(_Query).ToList();
            ReportsDetails();

            BindReport(Rep.reportName, Type, Rep.OutputType, ReportsDetail, query);
            return query;
        }

        public IEnumerable<IProc_Rep_AccVendorList_Result> Rpt_AccVendorList()
        {
            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);

            //ReportInfo Rep;
            int Type = int.Parse(RepPar.RepType.ToString());
            SqlParameter spRepType = new SqlParameter("@RepType", Type);

            int CatId = int.Parse(RepPar.CatId.ToString());
            SqlParameter spCatId = new SqlParameter("@CatId", CatId == -1 ? System.Data.SqlTypes.SqlInt32.Null : CatId);

            int Groupid = int.Parse(RepPar.Groupid.ToString());
            SqlParameter spGroupid = new SqlParameter("@Groupid", Groupid == -1 ? System.Data.SqlTypes.SqlInt32.Null : Groupid);


            int IsCredit = int.Parse(RepPar.IsCredit.ToString());
            SqlParameter spIsCredit = new SqlParameter("@IsCredit", IsCredit == -1 ? System.Data.SqlTypes.SqlInt32.Null : IsCredit);

            int VendType = int.Parse(RepPar.VendType.ToString());
            SqlParameter spVendType = new SqlParameter("@IsCredit", VendType == -1 ? System.Data.SqlTypes.SqlInt32.Null : VendType);

            int BalStatus = int.Parse(RepPar.BalStatus.ToString());
            SqlParameter spBalStatus = new SqlParameter("@BalStatus", BalStatus);


            Rep = OpenReport("Rpt_AccVendorList");


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
           ", @IsCredit = " + spIsCredit.Value +
           ", @VendType = " + spVendType.Value +
           ", @BalStatus = " + spBalStatus.Value;


            var query = db.Database.SqlQuery<IProc_Rep_AccVendorList_Result>(_Query).ToList();
            ReportsDetails();

            BindReport(Rep.reportName, Type, Rep.OutputType, ReportsDetail, query);
            return query;
        }


        ////كشف حساب عميل ملخص
        public IEnumerable<IProc_Rpt_AccCustomerSummaryVer2_Result> Rpt_AccCustomerSummary()
        {
            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);

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

            int CashType = int.Parse(RepPar.CashType.ToString());
            SqlParameter spCashType = new SqlParameter("@Cash", CashType == -1 ? System.Data.SqlTypes.SqlInt32.Null : CashType);


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
           ", @Cash = " + spCashType.Value +
           ", @FromDate = '" + spformDate.Value + "'" +
           ", @Todate = '" + sptoDate.Value + "'" +
           ", @BalType = " + spBalType.Value +
           ", @orderby = " + sporderby.Value;

            List<IProc_Rpt_AccCustomerSummaryVer2_Result> query = db.Database.SqlQuery<IProc_Rpt_AccCustomerSummaryVer2_Result>(_Query).ToList();
            ReportsDetails();

            BindReport(Rep.reportName, Type, Rep.OutputType, ReportsDetail, query);
            return query;
        }
        //كشف حساب عميل تفصيلي
        public IEnumerable<IProc_Rpt_AccCustomerDetailVer2_Result> Rpt_AccCustomerDetail()
        {
            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);

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


            int CashType = int.Parse(RepPar.CashType.ToString());
            SqlParameter spCashType = new SqlParameter("@Cash", CashType == -1 ? System.Data.SqlTypes.SqlInt32.Null : CashType);


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
           ", @Cash = " + spCashType.Value +
           ", @FromDate = '" + spformDate.Value + "'" +
           ", @Todate = '" + sptoDate.Value + "'" +
           ", @BalType = " + spBalType.Value;

            List<IProc_Rpt_AccCustomerDetailVer2_Result> query = db.Database.SqlQuery<IProc_Rpt_AccCustomerDetailVer2_Result>(_Query).ToList();
            ReportsDetails();

            BindReport(Rep.reportName, Type, Rep.OutputType, ReportsDetail, query);
            return query;
        }


        //كشف حساب عميل استاذ العملاء
        public IEnumerable<IProc_Rpt_AccCustomerLedger_Result> Rpt_AccCustomerLedger()
        {
            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);

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
            SqlParameter spBalType = new SqlParameter("@BalType", BalType);

            int SalesmanID = int.Parse(RepPar.SalesmanID.ToString());
            SqlParameter spSalesmanID = new SqlParameter("@SalesmanID", SalesmanID == -1 ? System.Data.SqlTypes.SqlInt32.Null : SalesmanID);


            int orderby = int.Parse(RepPar.orderby.ToString());
            SqlParameter sporderby = new SqlParameter("@orderby", orderby == -1 ? System.Data.SqlTypes.SqlInt32.Null : orderby);

            Rep = OpenReport("Rpt_AccCustomerLedger");

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
           ", @BalType = " + spBalType.Value +
           ", @FromDate = '" + spformDate.Value + "'" +
           ", @Todate = '" + sptoDate.Value + "'" +
           ", @orderby = " + sporderby.Value;

            List<IProc_Rpt_AccCustomerLedger_Result> query = db.Database.SqlQuery<IProc_Rpt_AccCustomerLedger_Result>(_Query).ToList();
            ReportsDetails();

            BindReport(Rep.reportName, Type, Rep.OutputType, ReportsDetail, query);
            return query;
        }


        //كشف حساب مورد تفصيلي
        public IEnumerable<IProc_Rpt_AccVendorDetailVer2_Result> Rpt_AccVendorDetail()
        {
            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);

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

            int CashType = int.Parse(RepPar.CashType.ToString());
            SqlParameter spCashType = new SqlParameter("@Cash", CashType == -1 ? System.Data.SqlTypes.SqlInt32.Null : CashType);


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
           ", @Cash = " + spCashType.Value +
           ", @FromDate = '" + spformDate.Value + "'" +
           ", @Todate = '" + sptoDate.Value + "'" +
           ", @BalType = " + spBalType.Value;

            List<IProc_Rpt_AccVendorDetailVer2_Result> query = db.Database.SqlQuery<IProc_Rpt_AccVendorDetailVer2_Result>(_Query).ToList();
            ReportsDetails();

            BindReport(Rep.reportName, Type, Rep.OutputType, ReportsDetail, query);
            return query;
        }

        //كشف حساب مورد ملخص
        public IEnumerable<IProc_Rpt_AccVendorSummaryVer2_Result> Rpt_AccVendorSummary()
        {
            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);

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


            int CashType = int.Parse(RepPar.CashType.ToString());
            SqlParameter spCashType = new SqlParameter("@Cash", CashType == -1 ? System.Data.SqlTypes.SqlInt32.Null : CashType);

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
           ", @Cash = " + spCashType.Value +
           ", @BalType = " + spBalType.Value+
           ", @FromDate = '" + spformDate.Value + "'" +
           ", @Todate = '" + sptoDate.Value + "'" +
            ", @orderby = " + sporderby.Value;

            List<IProc_Rpt_AccVendorSummaryVer2_Result> query = db.Database.SqlQuery<IProc_Rpt_AccVendorSummaryVer2_Result>(_Query).ToList();
            ReportsDetails();

            BindReport(Rep.reportName, Type, Rep.OutputType, ReportsDetail, query);
            return query;
        }
          //كشف حساب  استاذ موردين 
        public IEnumerable<IProc_Rpt_AccVendorLedger_Result> Rpt_AccVendorLedger()
        {
            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);

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


            Rep = OpenReport("Rpt_AccVendorLedger");



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
           ", @BalType = " + spBalType.Value+
           ", @FromDate = '" + spformDate.Value + "'" +
           ", @Todate = '" + sptoDate.Value + "'" +
            ", @orderby = " + sporderby.Value;

            List<IProc_Rpt_AccVendorLedger_Result> query = db.Database.SqlQuery<IProc_Rpt_AccVendorLedger_Result>(_Query).ToList();
            ReportsDetails();

            BindReport(Rep.reportName, Type, Rep.OutputType, ReportsDetail, query);
            return query;
        }

        //كشف حركة مخزون
        public IEnumerable<IProc_Rpt_ItemStockSummary_Result> Rpt_ItemStockSummary()
        {
            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);

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

            BindReport(Rep.reportName, Type, Rep.OutputType, ReportsDetail, query);
            
            return query;
        }

        //كشف حركة مخزون مفصل
        public IEnumerable<IProc_Rpt_ItemStockDetail_Result> Rpt_ItemStockDetail()
        {
            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);

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

            int BraCode = int.Parse(RepPar.FromBra.ToString());
            SqlParameter spBraCode = new SqlParameter("@BraCode", BraCode == -1 ? System.Data.SqlTypes.SqlInt32.Null : BraCode);

            int BalType = int.Parse(RepPar.BalType.ToString());
            SqlParameter spBalType = new SqlParameter("@BalStatus", BalType);

            int Status = int.Parse(RepPar.Status.ToString());
            SqlParameter spStatus = new SqlParameter("@Status", Status);

            int type = int.Parse(RepPar.check.ToString());
            SqlParameter sptype = new SqlParameter("@type", type);

            Rep = OpenReport("Rpt_ItemStockDetail");


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
           ", @status = " + spStatus.Value +
           ", @BalType = " + spBalType.Value +
           ", @FromDate = '" + spformDate.Value + "'" +
           ", @Todate = '" + sptoDate.Value + "'";

            List<IProc_Rpt_ItemStockDetail_Result> query = db.Database.SqlQuery<IProc_Rpt_ItemStockDetail_Result>(_Query).ToList();
            ReportsDetails();

            BindReport(Rep.reportName, Type, Rep.OutputType, ReportsDetail, query);
            return query;
        }
        //كشف قيمة مخزون
        public IEnumerable<IProc_Rpt_ItemStockValue_Result> Rpt_ItemStockValue()
        {
            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);

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

            BindReport(Rep.reportName, Type, Rep.OutputType, ReportsDetail, query);
            return query;
        }
        //-------------ايراد العمليات
        public IEnumerable<IProc_Rpt_ItemStockIncome_Result> Rpt_ItemStockIncome()
        {
            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);

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

            BindReport(Rep.reportName, Type, Rep.OutputType, ReportsDetail, query);
            return query;
        }

        //-------------التقرير المالى
        //public IEnumerable<AProc_Rpt_GLFinancialStatment_Result> Rpt_GLFinancialStatment()
        //{
        //    ReportStandardParameters StandPar = getStandardParameters();
        //    RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);

        //    //ReportInfo Rep;
        //    int Type = int.Parse(RepPar.RepType.ToString());
        //    SqlParameter spRepType = new SqlParameter("@RepType", Type);

        //    string formDate = RepPar.FromDate.ToString();
        //    SqlParameter spformDate = new SqlParameter("@FromDate", formDate);

        //    string toDate = RepPar.ToDate.ToString();
        //    SqlParameter sptoDate = new SqlParameter("@ToDate", toDate);

        //    string cc_Code = RepPar.cc_code.ToString();
        //    SqlParameter spcc_Code = new SqlParameter("@cc_Code", cc_Code == "-1" ? null : cc_Code);

        //    int Level = int.Parse(RepPar.Level.ToString());
        //    SqlParameter spLevel = new SqlParameter("@Level", Level == -1 ? System.Data.SqlTypes.SqlInt32.Null : Level);

        //    int IsAuthVchr = int.Parse(RepPar.IsAuthVchr.ToString());
        //    SqlParameter spIsAuthVchr = new SqlParameter("@IsAuthVchr", IsAuthVchr);

        //    int IsNewVchr = int.Parse(RepPar.IsNewVchr.ToString());
        //    SqlParameter spIsNewVchr = new SqlParameter("@IsNewVchr", IsNewVchr);

        //    int ExZero = int.Parse(RepPar.exzero.ToString());
        //    SqlParameter spExZero = new SqlParameter("@ExZero", ExZero);

        //    int Typ = int.Parse(RepPar.Typ.ToString());
        //    SqlParameter spTyp = new SqlParameter("@type", Typ);

        //    int check = int.Parse(RepPar.check.ToString());

        //    if (check == 1 )
        //    {
        //        if (Typ == 1)
        //        {
        //            Rep = OpenReport("Rpt_GLFinancialStatment_Lndscp");

        //        }

        //        else if (Typ == 2)
        //        {
        //            Rep = OpenReport("Rpt_GLFinancialIncome_Lndscp");

        //        }
        //        else
        //        {
        //            Rep = OpenReport("Rpt_GLFinancialbalancesheet_Lndscp");
        //        }


        //    }
        //    else
        //    {

            
        //    if (Typ == 1)
        //    {
        //        Rep = OpenReport("Rpt_GLFinancialTrailbalance");

        //    }

        //    else if (Typ == 2)
        //    {
        //        Rep = OpenReport("Rpt_GLFinancialIncome");

        //    }
        //    else
        //    {
        //        Rep = OpenReport("Rpt_GLFinancialbalancesheet");
        //    }
        //    }





        //    string _Query = "execute " + Rep.dataSource +
        //   " @comp = '" + StandPar.spComCode.Value + "'" +
        //   ", @bra = '" + StandPar.spbra.Value + "'" +
        //   ", @CompNameA = '" + StandPar.spComNameA.Value + "'" +
        //   ", @CompNameE = '" + StandPar.spComNameE.Value + "'" +
        //   ", @BraNameA = '" + StandPar.spBraNameA.Value + "'" +
        //   ", @BraNameE = '" + StandPar.braNameE.Value + "'" +
        //   ", @LoginUser = '" + StandPar.spLoginUser.Value + "'" +
        //   ", @RepType = " + spRepType.Value +
        //   ", @FromDate = '" + spformDate.Value + "'" +
        //   ", @Todate = '" + sptoDate.Value + "'" +
        //   ", @cc_Code ='" + spcc_Code.Value + "'" +
        //   ", @IsAuthVchr = " + spIsAuthVchr.Value +
        //   ", @IsNewVchr = " + spIsNewVchr.Value +
        //   ", @Level = " + spLevel.Value +
        //   ", @ExZero = " + spExZero.Value +
        //   ", @RepTyp = " + spTyp.Value;


        //    List<AProc_Rpt_GLFinancialStatment_Result> query = db.Database.SqlQuery<AProc_Rpt_GLFinancialStatment_Result>(_Query).ToList();
        //    ReportsDetails();

        //    BindReport(Rep.reportName, Type, Rep.OutputType, ReportsDetail, query);
        //    return query;
        //}

        public IEnumerable<AProc_Rpt_GLGeneralLedgerVer2_Result> Rpt_GLGeneralLedger()
        {
            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);

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

            int IncludeInvTR = int.Parse(RepPar.IncludeInvTR.ToString());
            SqlParameter spIncludeInvTR = new SqlParameter("@IncludeInvTR", IncludeInvTR);

            int OpenType = int.Parse(RepPar.OpenType.ToString());
            SqlParameter spOpenType = new SqlParameter("@OpenType", OpenType == -1 ? System.Data.SqlTypes.SqlInt32.Null : OpenType);

            int PrdType = int.Parse(RepPar.PrdType.ToString());
            SqlParameter spPrdType = new SqlParameter("@PrdType", PrdType);

            int EndType = int.Parse(RepPar.EndType.ToString());
            SqlParameter spEndType = new SqlParameter("@EndType", EndType);

            //Rep = OpenReport("Rpt_GLGeneralLedger");
            Rep = OpenReport("Rpt_GLGeneralLedgerVer2");


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
           ", @EndType = " + spEndType.Value +
           ", @IncludeInvTR = " + spIncludeInvTR.Value;


            List<AProc_Rpt_GLGeneralLedgerVer2_Result> query = db.Database.SqlQuery<AProc_Rpt_GLGeneralLedgerVer2_Result>(_Query).ToList();
            ReportsDetails();

            BindReport(Rep.reportName, Type, Rep.OutputType, ReportsDetail, query);
            return query;
        }
        public IEnumerable<AProc_Rpt_GLAccountStatment_Result> Rpt_GLAccountStatment()
        {
            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);

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


            int IncludeInvTR = int.Parse(RepPar.IncludeInvTR.ToString());
            SqlParameter spIncludeInvTR = new SqlParameter("@IncludeInvTR ", IncludeInvTR);


            int exzero = int.Parse(RepPar.exzero.ToString());
            SqlParameter spexzero = new SqlParameter("@exzero", exzero);






            Rep = OpenReport("Rpt_GLAccountStatmentVer2");


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
           ", @IncludeInvTR  = " + spIncludeInvTR.Value +
           ", @ExZero = " + spexzero.Value;



            List<AProc_Rpt_GLAccountStatment_Result> query = db.Database.SqlQuery<AProc_Rpt_GLAccountStatment_Result>(_Query).ToList();
            ReportsDetails();

            BindReport(Rep.reportName, Type, Rep.OutputType, ReportsDetail, query);
            return query;
        }

        public IEnumerable<AProc_Rpt_JournalVoucherList_Result> Rpt_JournalVoucherList()
        {
            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);

            //ReportInfo Rep;
            int Type = int.Parse(RepPar.RepType.ToString());
            SqlParameter spRepType = new SqlParameter("@RepType", Type);

            string formDate = RepPar.FromDate.ToString();
            SqlParameter spformDate = new SqlParameter("@FromDate", formDate);

            string toDate = RepPar.ToDate.ToString();
            SqlParameter sptoDate = new SqlParameter("@ToDate", toDate);

            int Status = int.Parse(RepPar.Status.ToString());
            SqlParameter spStatus = new SqlParameter("@Status", Status);

            int VchrSource = int.Parse(RepPar.VchrSource.ToString());
            SqlParameter spVchrSource = new SqlParameter("@VchrSource", VchrSource == -1 ? System.Data.SqlTypes.SqlInt32.Null : VchrSource);

            int VchrType = int.Parse(RepPar.VchrType.ToString());
            SqlParameter spVchrType = new SqlParameter("@VchrType", VchrType == -1 ? System.Data.SqlTypes.SqlInt32.Null : VchrType);




            Rep = OpenReport("Rpt_JournalVoucherList");


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
           ", @Status =" + spStatus.Value + "" +
           ", @VchrSource =" + spVchrSource.Value + "" +
           ", @VchrType = " + spVchrType.Value;

            List<AProc_Rpt_JournalVoucherList_Result> query = db.Database.SqlQuery<AProc_Rpt_JournalVoucherList_Result>(_Query).ToList();
            ReportsDetails();

            BindReport(Rep.reportName, Type, Rep.OutputType, ReportsDetail, query);
            return query;
        }
        public IEnumerable<AProc_Prnt_JournalVoucher_Result> Prnt_JournalVoucher()
        {
            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);


            int TRId = int.Parse(RepPar.TRId.ToString());
            SqlParameter spTRId = new SqlParameter("@TRId", TRId);



            Rep = OpenReport("Prnt_JournalVoucher");
            int Type = int.Parse(RepPar.RepType.ToString());
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

            BindReport(Rep.reportName, Type, Rep.OutputType, ReportsDetail, query);
            return query;
        }

        public IEnumerable<IProc_Rpt_StkAdjustList_Result> Rpt_StkAdjustList()
        {
            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);

            //ReportInfo Rep;
            int Type = int.Parse(RepPar.RepType.ToString());
            SqlParameter spRepType = new SqlParameter("@RepType", Type);

            string formDate = RepPar.FromDate.ToString();
            SqlParameter spformDate = new SqlParameter("@FromDate", formDate);

            string toDate = RepPar.ToDate.ToString();
            SqlParameter sptoDate = new SqlParameter("@ToDate", toDate);

            int TrType = int.Parse(RepPar.TrType.ToString());
            SqlParameter spTrType = new SqlParameter("@TrType", TrType == -1 ? System.Data.SqlTypes.SqlInt32.Null : TrType);

            int storeID = int.Parse(RepPar.storeID.ToString());
            SqlParameter spstoreID = new SqlParameter("@storeID", storeID == -1 ? System.Data.SqlTypes.SqlInt32.Null : storeID);

            int Status = int.Parse(RepPar.Status.ToString());
            SqlParameter spStatus = new SqlParameter("@Status", Status == -1 ? System.Data.SqlTypes.SqlInt32.Null : Status);


            Rep = OpenReport("Rpt_StkAdjustList");


            string _Query = "execute " + Rep.dataSource +
           " @comp = '" + StandPar.spComCode.Value + "'" +
           ", @bra = '" + StandPar.spbra.Value + "'" +
           ", @CompNameA = '" + StandPar.spComNameA.Value + "'" +
           ", @CompNameE = '" + StandPar.spComNameE.Value + "'" +
           ", @BraNameA = '" + StandPar.spBraNameA.Value + "'" +
           ", @BraNameE = '" + StandPar.braNameE.Value + "'" +
           ", @LoginUser = '" + StandPar.spLoginUser.Value + "'" +
           ", @RepType = " + spRepType.Value +
           ", @TrType = " + spTrType.Value +
           ", @FromDate = '" + spformDate.Value + "'" +
           ", @Todate = '" + sptoDate.Value + "'" +
           ", @storeID = " + spstoreID.Value + "" +
           ", @Status =" + spStatus.Value + "";

            List<IProc_Rpt_StkAdjustList_Result> query = db.Database.SqlQuery<IProc_Rpt_StkAdjustList_Result>(_Query).ToList();
            ReportsDetails();

            BindReport(Rep.reportName, Type, Rep.OutputType, ReportsDetail, query);
            return query;
        }

        public IEnumerable<IProc_Rpt_StkOpenList_Result> Rpt_StkOpenList()
        {
            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);

            //ReportInfo Rep;
            int Type = int.Parse(RepPar.RepType.ToString());
            SqlParameter spRepType = new SqlParameter("@RepType", Type);

            string formDate = RepPar.FromDate.ToString();
            SqlParameter spformDate = new SqlParameter("@FromDate", formDate);

            string toDate = RepPar.ToDate.ToString();
            SqlParameter sptoDate = new SqlParameter("@ToDate", toDate);

            int TrType = int.Parse(RepPar.TrType.ToString());
            SqlParameter spTrType = new SqlParameter("@TrType", TrType == -1 ? System.Data.SqlTypes.SqlInt32.Null : TrType);

            int storeID = int.Parse(RepPar.storeID.ToString());
            SqlParameter spstoreID = new SqlParameter("@storeID", storeID == -1 ? System.Data.SqlTypes.SqlInt32.Null : storeID);

            int Status = int.Parse(RepPar.Status.ToString());
            SqlParameter spStatus = new SqlParameter("@Status", Status == -1 ? System.Data.SqlTypes.SqlInt32.Null : Status);

                
            Rep = OpenReport("Rpt_StkOpenList");


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
           ", @storeID = " + spstoreID.Value + "" +
           ", @Status =" + spStatus.Value + "";

            List<IProc_Rpt_StkOpenList_Result> query = db.Database.SqlQuery<IProc_Rpt_StkOpenList_Result>(_Query).ToList();
            ReportsDetails();

            BindReport(Rep.reportName, Type, Rep.OutputType, ReportsDetail, query);
            return query;
        }


        public IEnumerable<IProc_Rpt_StkTransferList_Result> Rpt_StkTransferListdirect()
        {
            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);

            //ReportInfo Rep;
            int Type = int.Parse(RepPar.RepType.ToString());
            SqlParameter spRepType = new SqlParameter("@RepType", Type);

            string formDate = RepPar.FromDate.ToString();
            SqlParameter spformDate = new SqlParameter("@FromDate", formDate);

            string toDate = RepPar.ToDate.ToString();
            SqlParameter sptoDate = new SqlParameter("@ToDate", toDate);

            int TrType = int.Parse(RepPar.TrType.ToString());
            SqlParameter spTrType = new SqlParameter("@TrType", TrType == -1 ? System.Data.SqlTypes.SqlInt32.Null : TrType);

            int TfType = int.Parse(RepPar.TfType.ToString());
            SqlParameter spTfType = new SqlParameter("@TfType", TfType);

            int FromBra = int.Parse(RepPar.FromBra.ToString());
            SqlParameter spFromBra = new SqlParameter("@FromBra", FromBra == -1 ? System.Data.SqlTypes.SqlInt32.Null : FromBra);

            int ToBra = int.Parse(RepPar.ToBra.ToString());
            SqlParameter spToBra = new SqlParameter("@ToBra", ToBra == -1 ? System.Data.SqlTypes.SqlInt32.Null : ToBra);

            int FromstoreID = int.Parse(RepPar.FromstoreID.ToString());
            SqlParameter spFromstoreID = new SqlParameter("@FromstoreID", FromstoreID == -1 ? System.Data.SqlTypes.SqlInt32.Null : FromstoreID);

            int ToStoreID = int.Parse(RepPar.ToStoreID.ToString());
            SqlParameter spToStoreID = new SqlParameter("@ToStoreID", ToStoreID == -1 ? System.Data.SqlTypes.SqlInt32.Null : ToStoreID);

            int Status = int.Parse(RepPar.Status.ToString());
            SqlParameter spStatus = new SqlParameter("@Status", Status == -1 ? System.Data.SqlTypes.SqlInt32.Null : Status);
            if (TfType == 1 && TrType == 0)
            {
                Rep = OpenReport("Rpt_StkTransferListdirect");
            }
            else if (TfType == 1 && TrType == 1)
            {
                Rep = OpenReport("Rpt_StkTransferListsend");

            }
            else
            {
                Rep = OpenReport("Rpt_StkTransferListReceive");

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
           ", @TrType = " + spTrType.Value +
           ", @TfType = " + spTfType.Value +
           ", @FromDate = '" + spformDate.Value + "'" +
           ", @Todate = '" + sptoDate.Value + "'" +
            ",@FromBra = " + spFromBra.Value +
            ",@FromstoreID = " + spFromstoreID.Value +
            ",@ToBra = " + spToBra.Value +
            ",@ToStoreID = " + spToStoreID.Value +
           ", @Status =" + spStatus.Value + "";

            List<IProc_Rpt_StkTransferList_Result> query = db.Database.SqlQuery<IProc_Rpt_StkTransferList_Result>(_Query).ToList();
            ReportsDetails();

            BindReport(Rep.reportName, Type, Rep.OutputType, ReportsDetail, query);
            return query;
        }
        public IEnumerable<IProc_Rpt_PurPurchaseOrderList_Result> Rpt_PurPurchaseOrderList()
        {
            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);

            int RepType = int.Parse(RepPar.RepType.ToString());
            SqlParameter spRepType = new SqlParameter("@RepType", RepType);

            string FormDate = RepPar.FromDate.ToString();
            SqlParameter spFromDate = new SqlParameter("@FromDate", FormDate);

            string ToDate = RepPar.ToDate.ToString();
            SqlParameter spToDate = new SqlParameter("@ToDate", ToDate);

            int vendorID = int.Parse(RepPar.SalesmanID.ToString());
            SqlParameter spvendorID = new SqlParameter("@SalesmanID", vendorID == -1 ? System.Data.SqlTypes.SqlInt32.Null : vendorID);

            int SalesmanID = int.Parse(RepPar.SalesmanID.ToString());
            SqlParameter spSalesmanID = new SqlParameter("@SalesmanID", SalesmanID == -1 ? System.Data.SqlTypes.SqlInt32.Null : SalesmanID);

            int CashType = int.Parse(RepPar.CashType.ToString());
            SqlParameter spCashType = new SqlParameter("@CashType", CashType);

            int Status = int.Parse(RepPar.Status.ToString());
            SqlParameter spStatus = new SqlParameter("@Status", Status);

            //int Repdesign = RepPar.Repdesign;

            Rep = OpenReport("Rpt_PurPurchaseOrderList");



            string _Query = "execute " + Rep.dataSource +
               " @comp = '" + StandPar.spComCode.Value + "'" +
               ", @bra = '" + StandPar.spbra.Value + "'" +
               ", @CompNameA = '" + StandPar.spComNameA.Value + "'" +
               ", @CompNameE = '" + StandPar.spComNameE.Value + "'" +
               ", @BraNameA = '" + StandPar.spBraNameA.Value + "'" +
               ", @BraNameE = '" + StandPar.braNameE.Value + "'" +
               ", @LoginUser = '" + StandPar.spLoginUser.Value + "'" +
               ", @RepType = " + spRepType.Value +
               ", @FromDate = '" + spFromDate.Value + "'" +
               ", @ToDate = '" + spToDate.Value + "'" +
               ", @VendorID = " + spvendorID.Value +
               ", @SalesmanID= " + spSalesmanID.Value +
               ", @CashType = " + spCashType.Value +
               ", @Status = " + spStatus.Value;

            var query = db.Database.SqlQuery<IProc_Rpt_PurPurchaseOrderList_Result>(_Query).ToList();

            //if (Type == 1)
            ReportsDetails();
            BindReport(Rep.reportName, RepType, Rep.OutputType, ReportsDetail, query);
            return query;

        }
        public IEnumerable<IProc_Prnt_PurPurchaseOrder_Result> Prnt_PurPurchaseOrder()
        {
            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);


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
            BindReport(Rep.reportName, Type, Rep.OutputType, ReportsDetail, query);
            return query;
        }
        public IEnumerable<IProc_Prnt_StkTransfer_Result> Prnt_StkTransfer()
        {
            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);


            var TRId = int.Parse(RepPar.TRId.ToString());
            SqlParameter spTRId = new SqlParameter("@TRId", TRId);


            Rep = OpenReport("Prnt_StkTransfer");
            int Type = int.Parse(RepPar.RepType.ToString());
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
            BindReport(Rep.reportName, Type, Rep.OutputType, ReportsDetail, query);
            return query;
        }



        public IEnumerable<IProc_Prnt_StkAdjust_Result> Prnt_StkAdjust()
        {
            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);


            var TRId = int.Parse(RepPar.TRId.ToString());
            SqlParameter spTRId = new SqlParameter("@TRId", TRId);


            Rep = OpenReport("Prnt_StkAdjust");
            int Type = int.Parse(RepPar.RepType.ToString());
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
            BindReport(Rep.reportName, Type, Rep.OutputType, ReportsDetail, query);
            return query;
        }
        public IEnumerable<IProc_Rpt_OerationTFList_Result> IProc_Rpt_OerationTFList()
        {
            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);

            //ReportInfo Rep;
            int Type = int.Parse(RepPar.RepType.ToString());
            SqlParameter spRepType = new SqlParameter("@RepType", Type);

            string formDate = RepPar.FromDate.ToString();
            SqlParameter spformDate = new SqlParameter("@FromDate", formDate);

            string toDate = RepPar.ToDate.ToString();
            SqlParameter sptoDate = new SqlParameter("@ToDate", toDate);

            int OperationId = int.Parse(RepPar.OperationId.ToString());
            SqlParameter spOperationId = new SqlParameter("@OperationId", OperationId == -1 ? System.Data.SqlTypes.SqlInt32.Null : OperationId);

            int FromSls = int.Parse(RepPar.FromSls.ToString());
            SqlParameter spFromSls = new SqlParameter("@FromSls", FromSls == -1 ? System.Data.SqlTypes.SqlInt32.Null : FromSls);

            int ToSls = int.Parse(RepPar.ToSls.ToString());
            SqlParameter spToSls = new SqlParameter("@ToSls", ToSls == -1 ? System.Data.SqlTypes.SqlInt32.Null : ToSls);

            int Status = int.Parse(RepPar.Status.ToString());
            SqlParameter spStatus = new SqlParameter("@Status", Status);

            Rep = OpenReport("Rpt_OerationTFList");

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
           ", @OperationId =" + spOperationId.Value + "" +
           ", @FromSls =" + spFromSls.Value + "" +
           ", @ToSls =" + spToSls.Value + "" +
           ", @Status =" + spStatus.Value + "";
            List<IProc_Rpt_OerationTFList_Result> query = db.Database.SqlQuery<IProc_Rpt_OerationTFList_Result>(_Query).ToList();
            ReportsDetails();

            BindReport(Rep.reportName, Type, Rep.OutputType, ReportsDetail, query);
            return query;
        }
        public IEnumerable<IProc_Prnt_OerationTf_Result> Prnt_OerationTf()
        {
            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);


            var TRId = int.Parse(RepPar.TRId.ToString());
            SqlParameter spTRId = new SqlParameter("@TRId", TRId);


            Rep = OpenReport("Prnt_OerationTf");
            int Type = int.Parse(RepPar.RepType.ToString());
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
            BindReport(Rep.reportName, Type, Rep.OutputType, ReportsDetail, query);
            return query;
        }
        public IEnumerable<IProc_Prnt_VATSlsInvoice_Result> Prnt_VATSlsInvoice()
        {
            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);


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

            int Type = int.Parse(RepPar.RepType.ToString());
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
            BindReport(Rep.reportName, Type, Rep.OutputType, ReportsDetail, query);
            return query;
        }
        public IEnumerable<IProc_Rpt_VATPurInvoiceList_Result> Rpt_VATPurInvoiceList()
        {
            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);



            string FromDate = RepPar.FromDate.ToString();
            SqlParameter spFromDate = new SqlParameter("@FromDate", FromDate);

            string ToDate = RepPar.ToDate.ToString();
            SqlParameter spToDate = new SqlParameter("@ToDate", ToDate);

            var ISimport = int.Parse(RepPar.ISimport.ToString());
            SqlParameter spISimport = new SqlParameter("@ISimport", ISimport);


            var CashType = int.Parse(RepPar.CashType.ToString());
            SqlParameter spCashType = new SqlParameter("@CashType", CashType == -1 ? System.Data.SqlTypes.SqlInt32.Null : CashType);

            var Status = int.Parse(RepPar.Status.ToString());
            SqlParameter spStatus = new SqlParameter("@Status", Status);



            Rep = OpenReport("Rpt_VATPurInvoiceList");



            int Type = int.Parse(RepPar.RepType.ToString());
            if (Type == 0) { Type = int.Parse(Rep.OutputTypeNo); }
            SqlParameter spRepType = new SqlParameter("@RepType", Type);


            string _Query = "execute " + Rep.dataSource +
                " @comp = '" + StandPar.spComCode.Value + "'" +
                ", @bra = '" + StandPar.spbra.Value + "'" +
                ", @CompNameA = '" + StandPar.spComNameA.Value + "'" +
                ", @CompNameE = '" + StandPar.spComNameE.Value + "'" +
                ", @BraNameA = '" + StandPar.spBraNameA.Value + "'" +
                ", @FromDate = '" + spFromDate.Value + "'" +
                ", @ToDate = '" + spToDate.Value + "'" +
                ", @BraNameE = '" + StandPar.braNameE.Value + "'" +
                ", @LoginUser = '" + StandPar.spLoginUser.Value + "'" +
                ", @RepType = " + spRepType.Value + "  " +
                ", @ISimport = " + spISimport.Value + "  " +
                ", @CashType = " + spCashType.Value + "  " +
                 ",@Status = " + spStatus.Value;

            var query = db.Database.SqlQuery<IProc_Rpt_VATPurInvoiceList_Result>(_Query).ToList();

            ReportsDetails();
            BindReport(Rep.reportName, Type, Rep.OutputType, ReportsDetail, query);
            return query;
        }
        public IEnumerable<IProc_Rpt_VATPurReturnList_Result> Rpt_VATPurReturnList()
        {
            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);



            string FromDate = RepPar.FromDate.ToString();
            SqlParameter spFromDate = new SqlParameter("@FromDate", FromDate);

            string ToDate = RepPar.ToDate.ToString();
            SqlParameter spToDate = new SqlParameter("@ToDate", ToDate);

            var VendorID = int.Parse(RepPar.VendorId.ToString());
            SqlParameter spVendorID = new SqlParameter("@VendorID", VendorID == -1 ? System.Data.SqlTypes.SqlInt32.Null : VendorID);


            var CashType = int.Parse(RepPar.CashType.ToString());
            SqlParameter spCashType = new SqlParameter("@CashType", CashType == -1 ? System.Data.SqlTypes.SqlInt32.Null : CashType);

            var Status = int.Parse(RepPar.Status.ToString());
            SqlParameter spStatus = new SqlParameter("@Status", Status);



            Rep = OpenReport("Rpt_VATPurReturnList");



            int Type = int.Parse(RepPar.RepType.ToString());
            if (Type == 0) { Type = int.Parse(Rep.OutputTypeNo); }
            SqlParameter spRepType = new SqlParameter("@RepType", Type);


            string _Query = "execute " + Rep.dataSource +
                " @comp = '" + StandPar.spComCode.Value + "'" +
                ", @bra = '" + StandPar.spbra.Value + "'" +
                ", @CompNameA = '" + StandPar.spComNameA.Value + "'" +
                ", @CompNameE = '" + StandPar.spComNameE.Value + "'" +
                ", @BraNameA = '" + StandPar.spBraNameA.Value + "'" +
                ", @FromDate = '" + spFromDate.Value + "'" +
                ", @ToDate = '" + spToDate.Value + "'" +
                ", @BraNameE = '" + StandPar.braNameE.Value + "'" +
                ", @LoginUser = '" + StandPar.spLoginUser.Value + "'" +
                ", @RepType = " + spRepType.Value + "  " +
                ", @VendorID = " + spVendorID.Value + "  " +
                ", @CashType = " + spCashType.Value + "  " +
                 ",@Status = " + spStatus.Value;

            var query = db.Database.SqlQuery<IProc_Rpt_VATPurReturnList_Result>(_Query).ToList();

            ReportsDetails();
            BindReport(Rep.reportName, Type, Rep.OutputType, ReportsDetail, query);
            return query;
        }
        public IEnumerable<IProc_Prnt_VATPurInvoice_Result> Prnt_VATPurInvoice()
        {
            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);


            var TRId = int.Parse(RepPar.TRId.ToString());
            SqlParameter spTRId = new SqlParameter("@TRId", TRId);


            Rep = OpenReport("Prnt_VATPurInvoice");


            int Type = int.Parse(RepPar.RepType.ToString());
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
            BindReport(Rep.reportName, Type, Rep.OutputType, ReportsDetail, query);
            return query;
        }
        public IEnumerable<IProc_Prnt_VATPurReturn_Result> Prnt_VATPurReturn()
        {
            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);


            var TRId = int.Parse(RepPar.TRId.ToString());
            SqlParameter spTRId = new SqlParameter("@TRId", TRId);


            Rep = OpenReport("Prnt_VATPurReturn");


            int Type = int.Parse(RepPar.RepType.ToString());
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
            BindReport(Rep.reportName, Type, Rep.OutputType, ReportsDetail, query);
            return query;
        }

        //كشف حساب مجمع تفصيلي
        public IEnumerable<IProc_Rpt_AccVendorCollDetail_Result> Rpt_AccVendorCollDetail()
        {
            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);

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

            BindReport(Rep.reportName, Type, Rep.OutputType, ReportsDetail, query);
            return query;
        }




        public IEnumerable<IProc_Rpt_AccVendorCollSummary_Result> Rpt_AccVendorCollSummary()
        {
            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);

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

            BindReport(Rep.reportName, Type, Rep.OutputType, ReportsDetail, query);
            return query;
        }
        public IEnumerable<IProc_Rpt_VatSalesSummary_Result> Rpt_VatSalesSummary()
        {
            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);

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

            BindReport(Rep.reportName, Type, Rep.OutputType, ReportsDetail, query);
            return query;
        }
        public IEnumerable<IProc_Rpt_VatSalesDetail_Result> Rpt_VatSalesDetail()
        {
            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);

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

            BindReport(Rep.reportName, Type, Rep.OutputType, ReportsDetail, query);
            return query;
        }

        public IEnumerable<IProc_Rpt_VatPurchaseSummary_Result> Rpt_VatPurchaseSummary()
        {
            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);


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

            BindReport(Rep.reportName, Type, Rep.OutputType, ReportsDetail, query);
            return query;
        }

        public IEnumerable<IProc_Rpt_VatPurchaseDetail_Result> Rpt_VatPurchaseDetail()
        {
            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);


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

            BindReport(Rep.reportName, Type, Rep.OutputType, ReportsDetail, query);
            return query;
        }
        public IEnumerable<AProc_Prnt_CashVoucher_Result> Prnt_CashVoucher()
        {
            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);

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

            BindReport(Rep.reportName, Type, Rep.OutputType, ReportsDetail, query);
            return query;
        }



        public IEnumerable<AProc_Rpt_CashVoucherList_Result> Rpt_CashVoucherList()
        {
            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);


            //ReportInfo Rep;
            int Type = int.Parse(RepPar.RepType.ToString());
            SqlParameter spRepType = new SqlParameter("@RepType", Type);

            string formDate = RepPar.FromDate.ToString();
            SqlParameter spformDate = new SqlParameter("@FromDate", formDate);

            string toDate = RepPar.ToDate.ToString();
            SqlParameter sptoDate = new SqlParameter("@ToDate", toDate);

            int PaymentType = int.Parse(RepPar.PaymentType.ToString());
            SqlParameter spPaymentType = new SqlParameter("@PaymentType", PaymentType == -1 ? System.Data.SqlTypes.SqlInt32.Null : PaymentType);

            int VchrType = int.Parse(RepPar.VchrType.ToString());
            SqlParameter spVchrType = new SqlParameter("@VchrType", VchrType == -1 ? System.Data.SqlTypes.SqlInt32.Null : VchrType);

            int TRType = int.Parse(RepPar.TrType.ToString());
            SqlParameter spTRType = new SqlParameter("@TRType", TRType == -1 ? System.Data.SqlTypes.SqlInt32.Null : TRType);

            int Status = int.Parse(RepPar.Status.ToString());
            SqlParameter spStatus = new SqlParameter("@Status", Status == -1 ? System.Data.SqlTypes.SqlInt32.Null : Status);


            Rep = OpenReport("Rpt_CashVoucherList");



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
           "',@VchrType= " + spVchrType.Value +
           ", @PaymentType = " + spPaymentType.Value +
           ", @TRType = " + spTRType.Value +
           ", @status = " + spStatus.Value;

            List<AProc_Rpt_CashVoucherList_Result> query = db.Database.SqlQuery<AProc_Rpt_CashVoucherList_Result>(_Query).ToList();
            ReportsDetails();

            BindReport(Rep.reportName, Type, Rep.OutputType, ReportsDetail, query);
            return query;
        }

        public IEnumerable<AProc_Rpt_GLDtCCenterStatmentSummary_Result> Rpt_GLDtCCenterStatmentSummary()
        {
            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);


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

            BindReport(Rep.reportName, Type, Rep.OutputType, ReportsDetail, query);
            return query;
        }

        public IEnumerable<AProc_Rpt_GLDtCCenterStatmentDetail_Result> Rpt_GLDtCCenterStatmentDetail()
        {
            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);


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

            BindReport(Rep.reportName, Type, Rep.OutputType, ReportsDetail, query);
            return query;
        }

        public IEnumerable<IProc_Rpt_VATListSummary_Result> Rpt_VATListSummary()
        {
            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);

            // //ReportInfo Rep;
            int RepType = int.Parse(RepPar.RepType.ToString());
            SqlParameter spRepType = new SqlParameter("@RepType", RepType);

            string formDate = RepPar.FromDate.ToString();
            SqlParameter spformDate = new SqlParameter("@FromDate", formDate);

            string toDate = RepPar.ToDate.ToString();
            SqlParameter sptoDate = new SqlParameter("@ToDate", toDate);

            int Vattype = int.Parse(RepPar.Vattype.ToString());
            SqlParameter spVattype = new SqlParameter("@Vattype", Vattype == -1 ? System.Data.SqlTypes.SqlInt32.Null : Vattype);

            int VatBraCode = int.Parse(RepPar.VatBraCode.ToString());
            SqlParameter spVatBraCode = new SqlParameter("@BraCode", VatBraCode == -1 ? System.Data.SqlTypes.SqlInt32.Null : VatBraCode);


            string SysCode = RepPar.SysCode.ToString();
            if (SysCode == "-1")
            {
                SysCode = "";
            }
            SqlParameter spSysCode = new SqlParameter("@SysCode", SysCode);

            string TransCode = RepPar.TransCode.ToString();
            if (TransCode == "-1")
            {
                TransCode = "";
            }
            SqlParameter spTransCode = new SqlParameter("@TransCode", TransCode);



            string groupBy = RepPar.Groupid.ToString();
            SqlParameter spgroupBy = new SqlParameter("@groupBy", groupBy);

            // int CustomercatID = int.Parse(RepPar.CustomercatID.ToString());
            // SqlParameter spCustomercatID = new SqlParameter("@cusCatID", CustomercatID == -1 ? System.Data.SqlTypes.SqlInt32.Null : CustomercatID);

            int TrType = int.Parse(RepPar.TrType.ToString());
            SqlParameter spTrType = new SqlParameter("@TrType", TrType == -1 ? System.Data.SqlTypes.SqlInt32.Null : TrType);


            // int CustomerGrpID = int.Parse(RepPar.CustomerGrpID.ToString());
            // SqlParameter spCustomerGrpID = new SqlParameter("@cusGroupid", CustomerGrpID == -1 ? System.Data.SqlTypes.SqlInt32.Null : CustomerGrpID);

            // int CustomerID = int.Parse(RepPar.CustomerID.ToString());
            // SqlParameter spCustomerID = new SqlParameter("@cusid", CustomerID == -1 ? System.Data.SqlTypes.SqlInt32.Null : CustomerID);
            // if (TrType == 0)
            // {
            //     Rep = OpenReport("Rpt_VatSalesSummary");

            // }
            // else
            // {
            //     Rep = OpenReport("Rpt_VatSalesSummaryRet");
            // }


            Rep = OpenReport("Rpt_VATListSummary");



            string _Query = "execute " + Rep.dataSource +
           " @comp = '" + StandPar.spComCode.Value + "'" +
           ", @bra = '" + StandPar.spbra.Value + "'" +
           ", @CompNameA = '" + StandPar.spComNameA.Value + "'" +
           ", @CompNameE = '" + StandPar.spComNameE.Value + "'" +
           ", @BraNameA = '" + StandPar.spBraNameA.Value + "'" +
           ", @BraNameE = '" + StandPar.braNameE.Value + "'" +
           ", @LoginUser = '" + StandPar.spLoginUser.Value + "'" +
           ", @RepType = " + spRepType.Value +
           ", @TrType = " + spTrType.Value +
           ", @BraCode = " + spVatBraCode.Value +
           ", @SysCode = '" + spSysCode.Value + "'" +
           ", @TransCode = '" + spTransCode.Value + "'" +
           ", @Vattype = " + spVattype.Value +
           ", @groupBy = " + spgroupBy.Value +
           ", @FromDate = '" + spformDate.Value + "'" +
           ", @Todate = '" + sptoDate.Value + "'";


            List<IProc_Rpt_VATListSummary_Result> query = db.Database.SqlQuery<IProc_Rpt_VATListSummary_Result>(_Query).ToList();
            ReportsDetails();

            BindReport(Rep.reportName, RepType, Rep.OutputType, ReportsDetail, query);
            return query;
        }

        public IEnumerable<IProc_Rpt_VATListDetail_Result> Rpt_VATListDetail()
        {
            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);

            // //ReportInfo Rep;
            int RepType = int.Parse(RepPar.RepType.ToString());
            SqlParameter spRepType = new SqlParameter("@RepType", RepType);

            string formDate = RepPar.FromDate.ToString();
            SqlParameter spformDate = new SqlParameter("@FromDate", formDate);

            string toDate = RepPar.ToDate.ToString();
            SqlParameter sptoDate = new SqlParameter("@ToDate", toDate);

            int Vattype = int.Parse(RepPar.Vattype.ToString());
            SqlParameter spVattype = new SqlParameter("@Vattype", Vattype == -1 ? System.Data.SqlTypes.SqlInt32.Null : Vattype);

            int VatBraCode = int.Parse(RepPar.VatBraCode.ToString());
            SqlParameter spVatBraCode = new SqlParameter("@BraCode", VatBraCode == -1 ? System.Data.SqlTypes.SqlInt32.Null : VatBraCode);


            string SysCode = RepPar.SysCode.ToString();
            if (SysCode == "-1")
            {
                SysCode = "";
            }
            SqlParameter spSysCode = new SqlParameter("@SysCode", SysCode);

            string TransCode = RepPar.TransCode.ToString();
            if (TransCode == "-1")
            {
                TransCode = "";
            }
            SqlParameter spTransCode = new SqlParameter("@TransCode", TransCode);

            int TrType = int.Parse(RepPar.TrType.ToString());
            SqlParameter spTrType = new SqlParameter("@TrType", TrType == -1 ? System.Data.SqlTypes.SqlInt32.Null : TrType);





            Rep = OpenReport("Rpt_VATListDetail");



            string _Query = "execute " + Rep.dataSource +
           " @comp = '" + StandPar.spComCode.Value + "'" +
           ", @bra = '" + StandPar.spbra.Value + "'" +
           ", @CompNameA = '" + StandPar.spComNameA.Value + "'" +
           ", @CompNameE = '" + StandPar.spComNameE.Value + "'" +
           ", @BraNameA = '" + StandPar.spBraNameA.Value + "'" +
           ", @BraNameE = '" + StandPar.braNameE.Value + "'" +
           ", @LoginUser = '" + StandPar.spLoginUser.Value + "'" +
           ", @RepType = " + spRepType.Value +
           ", @TrType = " + spTrType.Value +
           ", @BraCode = " + spVatBraCode.Value +
           ", @SysCode = '" + spSysCode.Value + "'" +
           ", @TransCode = '" + spTransCode.Value + "'" +
           ", @Vattype = " + spVattype.Value +
           ", @FromDate = '" + spformDate.Value + "'" +
           ", @Todate = '" + sptoDate.Value + "'";


            List<IProc_Rpt_VATListDetail_Result> query = db.Database.SqlQuery<IProc_Rpt_VATListDetail_Result>(_Query).ToList();
            ReportsDetails();

            BindReport(Rep.reportName, RepType, Rep.OutputType, ReportsDetail, query);
            return query;
        }

        public IEnumerable<IProc_Rpt_VATListDetail_Result> Rpt_VATListDetail_Lndscp()
        {
            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);

            // //ReportInfo Rep;
            int RepType = int.Parse(RepPar.RepType.ToString());
            SqlParameter spRepType = new SqlParameter("@RepType", RepType);

            string formDate = RepPar.FromDate.ToString();
            SqlParameter spformDate = new SqlParameter("@FromDate", formDate);

            string toDate = RepPar.ToDate.ToString();
            SqlParameter sptoDate = new SqlParameter("@ToDate", toDate);

            int Vattype = int.Parse(RepPar.Vattype.ToString());
            SqlParameter spVattype = new SqlParameter("@Vattype", Vattype == -1 ? System.Data.SqlTypes.SqlInt32.Null : Vattype);

            int VatBraCode = int.Parse(RepPar.VatBraCode.ToString());
            SqlParameter spVatBraCode = new SqlParameter("@BraCode", VatBraCode == -1 ? System.Data.SqlTypes.SqlInt32.Null : VatBraCode);


            string SysCode = RepPar.SysCode.ToString();
            if (SysCode == "-1")
            {
                SysCode = "";
            }
            SqlParameter spSysCode = new SqlParameter("@SysCode", SysCode);

            string TransCode = RepPar.TransCode.ToString();
            if (TransCode == "-1")
            {
                TransCode = "";
            }
            SqlParameter spTransCode = new SqlParameter("@TransCode", TransCode);

            int TrType = int.Parse(RepPar.TrType.ToString());
            SqlParameter spTrType = new SqlParameter("@TrType", TrType == -1 ? System.Data.SqlTypes.SqlInt32.Null : TrType);





            Rep = OpenReport("Rpt_VATListDetail_Lndscp");



            string _Query = "execute " + Rep.dataSource +
           " @comp = '" + StandPar.spComCode.Value + "'" +
           ", @bra = '" + StandPar.spbra.Value + "'" +
           ", @CompNameA = '" + StandPar.spComNameA.Value + "'" +
           ", @CompNameE = '" + StandPar.spComNameE.Value + "'" +
           ", @BraNameA = '" + StandPar.spBraNameA.Value + "'" +
           ", @BraNameE = '" + StandPar.braNameE.Value + "'" +
           ", @LoginUser = '" + StandPar.spLoginUser.Value + "'" +
           ", @RepType = " + spRepType.Value +
           ", @TrType = " + spTrType.Value +
           ", @BraCode = " + spVatBraCode.Value +
           ", @SysCode = '" + spSysCode.Value + "'" +
           ", @TransCode = '" + spTransCode.Value + "'" +
           ", @Vattype = " + spVattype.Value +
           ", @FromDate = '" + spformDate.Value + "'" +
           ", @Todate = '" + sptoDate.Value + "'";


            List<IProc_Rpt_VATListDetail_Result> query = db.Database.SqlQuery<IProc_Rpt_VATListDetail_Result>(_Query).ToList();
            ReportsDetails();

            BindReport(Rep.reportName, RepType, Rep.OutputType, ReportsDetail, query);
            return query;
        }

        public IEnumerable<IProc_Prnt_VATReport_Result> Prnt_VATReport()
        {
            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);

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

            BindReport(Rep.reportName, RepType, Rep.OutputType, ReportsDetail, query);
            return query;
        }



        public IEnumerable<IProc_Rpt_AccBoxSummaryVer2_Result> Rpt_AccBoxSummary()
        {
            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);

            //ReportInfo Rep;
            int Type = int.Parse(RepPar.RepType.ToString());
            SqlParameter spRepType = new SqlParameter("@RepType", Type);

            int BoxId = int.Parse(RepPar.BoxId.ToString());
            SqlParameter spBoxId = new SqlParameter("@boxid", BoxId == -1 ? System.Data.SqlTypes.SqlInt32.Null : BoxId);

            int Status = int.Parse(RepPar.Status.ToString());
            SqlParameter spStatus = new SqlParameter("@status", Status == -1 ? System.Data.SqlTypes.SqlInt32.Null : Status);

            int BalType = int.Parse(RepPar.BalType.ToString());
            SqlParameter spBalType = new SqlParameter("@BalType", BalType);

            int CashType = int.Parse(RepPar.CashType.ToString());
            SqlParameter spCashType = new SqlParameter("@CashType", CashType);

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
           ", @CashType = " + spCashType.Value +
           ", @FromDate = '" + spFromDate.Value + "'" +
           ", @Todate = '" + spToDate.Value + "'";



            List<IProc_Rpt_AccBoxSummaryVer2_Result> query = db.Database.SqlQuery<IProc_Rpt_AccBoxSummaryVer2_Result>(_Query).ToList();
            ReportsDetails();

            BindReport(Rep.reportName, Type, Rep.OutputType, ReportsDetail, query);
            return query;
        }


        public IEnumerable<IProc_Rpt_AccBoxDetailVer2_Result> Rpt_AccBoxDetail()
        {
            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);

            //ReportInfo Rep;
            int Type = int.Parse(RepPar.RepType.ToString());
            SqlParameter spRepType = new SqlParameter("@RepType", Type);

            int BoxId = int.Parse(RepPar.BoxId.ToString());
            SqlParameter spBoxId = new SqlParameter("@boxid", BoxId == -1 ? System.Data.SqlTypes.SqlInt32.Null : BoxId);

            int Status = int.Parse(RepPar.Status.ToString());
            SqlParameter spStatus = new SqlParameter("@status", Status == -1 ? System.Data.SqlTypes.SqlInt32.Null : Status);

            int BalType = int.Parse(RepPar.BalType.ToString());
            SqlParameter spBalType = new SqlParameter("@BalType", BalType);

            int CashType = int.Parse(RepPar.CashType.ToString());
            SqlParameter spCashType = new SqlParameter("@CashType", CashType);

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
           ", @CashType = " + spCashType.Value +
           ", @FromDate = '" + spFromDate.Value + "'" +
           ", @Todate = '" + spToDate.Value + "'";



            List<IProc_Rpt_AccBoxDetailVer2_Result> query = db.Database.SqlQuery<IProc_Rpt_AccBoxDetailVer2_Result>(_Query).ToList();
            ReportsDetails();

            BindReport(Rep.reportName, Type, Rep.OutputType, ReportsDetail, query);
            return query;
        }
        public IEnumerable<IProc_Rpt_AccBankDetail_Result> Rpt_AccBankDetail()
        {
            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);

            //ReportInfo Rep;
            int Type = int.Parse(RepPar.RepType.ToString());
            SqlParameter spRepType = new SqlParameter("@RepType", Type);

            string BankCode = RepPar.BankCode.ToString();
            SqlParameter spBankCode = new SqlParameter("@AccCode", BankCode == "Null" ? "" : BankCode);

            int Status = int.Parse(RepPar.Status.ToString());
            SqlParameter spStatus = new SqlParameter("@status", Status == -1 ? System.Data.SqlTypes.SqlInt32.Null : Status);

            
            string FromDate = RepPar.FromDate.ToString();
            SqlParameter spFromDate = new SqlParameter("@FromDate", FromDate);

            string ToDate = RepPar.ToDate.ToString();
            SqlParameter spToDate = new SqlParameter("@Todate", ToDate);

            Rep = OpenReport("Rpt_AccBankDetail");

            string _Query = "execute " + Rep.dataSource +
           " @comp = '" + StandPar.spComCode.Value + "'" +
           ", @bra = '" + StandPar.spbra.Value + "'" +
           ", @CompNameA = '" + StandPar.spComNameA.Value + "'" +
           ", @CompNameE = '" + StandPar.spComNameE.Value + "'" +
           ", @BraNameA = '" + StandPar.spBraNameA.Value + "'" +
           ", @BraNameE = '" + StandPar.braNameE.Value + "'" +
           ", @LoginUser = '" + StandPar.spLoginUser.Value + "'" +
           ", @RepType = " + spRepType.Value +
           ", @AccCode = '" + spBankCode.Value +"'"+
           ", @status = " + spStatus.Value +
           ", @FromDate = '" + spFromDate.Value + "'" +
           ", @Todate = '" + spToDate.Value + "'";



            List<IProc_Rpt_AccBankDetail_Result> query = db.Database.SqlQuery<IProc_Rpt_AccBankDetail_Result>(_Query).ToList();
            ReportsDetails();

            BindReport(Rep.reportName, Type, Rep.OutputType, ReportsDetail, query);
            return query;
        }

        public IEnumerable<IProc_Rpt_AccBankSummary_Result> Rpt_AccBankSummary()
        {
            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);

            //ReportInfo Rep;
            int Type = int.Parse(RepPar.RepType.ToString());
            SqlParameter spRepType = new SqlParameter("@RepType", Type);

            
            string BankCode = RepPar.BankCode.ToString();
            SqlParameter spBankCode = new SqlParameter("@AccCode", BankCode == "Null" ? "" : BankCode);

            int Status = int.Parse(RepPar.Status.ToString());
            SqlParameter spStatus = new SqlParameter("@status", Status == -1 ? System.Data.SqlTypes.SqlInt32.Null : Status);



            string FromDate = RepPar.FromDate.ToString();
            SqlParameter spFromDate = new SqlParameter("@FromDate", FromDate);

            string ToDate = RepPar.ToDate.ToString();
            SqlParameter spToDate = new SqlParameter("@Todate", ToDate);

            Rep = OpenReport("Rpt_AccBankSummary");

            string _Query = "execute " + Rep.dataSource +
           " @comp = '" + StandPar.spComCode.Value + "'" +
           ", @bra = '" + StandPar.spbra.Value + "'" +
           ", @CompNameA = '" + StandPar.spComNameA.Value + "'" +
           ", @CompNameE = '" + StandPar.spComNameE.Value + "'" +
           ", @BraNameA = '" + StandPar.spBraNameA.Value + "'" +
           ", @BraNameE = '" + StandPar.braNameE.Value + "'" +
           ", @LoginUser = '" + StandPar.spLoginUser.Value + "'" +
           ", @RepType = " + spRepType.Value +
           ", @AccCode = '" + spBankCode.Value +"'" +
           ", @status = " + spStatus.Value +
           ", @FromDate = '" + spFromDate.Value + "'" +
           ", @Todate = '" + spToDate.Value + "'";



            List<IProc_Rpt_AccBankSummary_Result> query = db.Database.SqlQuery<IProc_Rpt_AccBankSummary_Result>(_Query).ToList();
            ReportsDetails();

            BindReport(Rep.reportName, Type, Rep.OutputType, ReportsDetail, query);
            return query;
        }

        public IEnumerable<IProc_Rep_OperationScrap_Result> Rep_OperationScrap()
        {
            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);

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

            BindReport(Rep.reportName, Type, Rep.OutputType, ReportsDetail, query);
            return query;
        }


        public IEnumerable<IProc_Rep_OperationScrapList_Result> Rep_OperationRepScrap()
        {
            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);

            //ReportInfo Rep;
            int Type = int.Parse(RepPar.RepType.ToString());
            SqlParameter spRepType = new SqlParameter("@RepType", Type);

            int vendorid = int.Parse(RepPar.VendorId.ToString());
            SqlParameter spvendorid = new SqlParameter("@vendorid", vendorid == -1 ? System.Data.SqlTypes.SqlInt32.Null : vendorid);

            int ByValue = int.Parse(RepPar.ByValue.ToString());
            SqlParameter spByValue = new SqlParameter("@ByValue", ByValue == -1 ? System.Data.SqlTypes.SqlInt32.Null : ByValue);

            int TRId = int.Parse(RepPar.OperationId.ToString());
            SqlParameter spTRId = new SqlParameter("@TRId", TRId == -1 ? System.Data.SqlTypes.SqlInt32.Null : TRId);




            Rep = OpenReport("Rep_OperationRepScrap");

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
           ", @TRId= " + spTRId.Value +
           ", @ByValue = " + spByValue.Value;


            List<IProc_Rep_OperationScrapList_Result> query = db.Database.SqlQuery<IProc_Rep_OperationScrapList_Result>(_Query).ToList();
            ReportsDetails();

            BindReport(Rep.reportName, Type, Rep.OutputType, ReportsDetail, query);
            return query;
        }


        public IEnumerable<AProc_Rpt_GLFinancialStatment_Result> Rpt_GLFinancialStatment()
        {
            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);

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

            BindReport(Rep.reportName, Type, Rep.OutputType, ReportsDetail, query);
            return query;
        }
        public IEnumerable<AProc_Rpt_GLFinancialStatment_Result> Rpt_GLFinancialStatment_Lndscp()
        {
            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);

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

            BindReport(Rep.reportName, Type, Rep.OutputType, ReportsDetail, query);
            return query;
        }

        public IEnumerable<IProc_Rep_CollectList_Result> Rep_CollectList()
        {

            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);


            int RepType = int.Parse(RepPar.RepType.ToString());
            SqlParameter spRepType = new SqlParameter("@RepType", RepType);

            int TrType = int.Parse(RepPar.TrType.ToString()); 
            SqlParameter spTrType = new SqlParameter("@TrType", TrType == -1 ? System.Data.SqlTypes.SqlInt32.Null : TrType);

            int CatId = int.Parse(RepPar.CatId.ToString());
            SqlParameter spCatId = new SqlParameter("@CatID", CatId == -1 ? System.Data.SqlTypes.SqlInt32.Null : CatId);

              int ItemFamId = int.Parse(RepPar.ItemFamId.ToString());
            SqlParameter spItemFamId = new SqlParameter("@ItemFamId", ItemFamId == -1 ? System.Data.SqlTypes.SqlInt32.Null : ItemFamId);

            int ItemID = int.Parse(RepPar.ItemID.ToString());
            SqlParameter spItemID = new SqlParameter("@ItemID", ItemID == -1 ? System.Data.SqlTypes.SqlInt32.Null : ItemID);
              
            string dateForm = RepPar.FromDate.ToString();
            SqlParameter spformDate = new SqlParameter("@FromDate", dateForm);

            string dateTo = RepPar.ToDate.ToString();
            SqlParameter sptoDate = new SqlParameter("@ToDate", dateTo);


      




            //int storeID = int.Parse(RepPar.storeID.ToString());
            //SqlParameter spStore_Code = new SqlParameter("@Store_Code", Store_Code == -1 ? System.Data.SqlTypes.SqlInt32.Null : Store_Code);

            int Status = int.Parse(RepPar.Status.ToString());
            SqlParameter spStatus = new SqlParameter("@Status", Status);
            int Repdesign = RepPar.Repdesign;
            int SlsInvSrc = RepPar.src;
            int Typ = RepPar.Typ;

            Rep = OpenReport("Rep_CollectList");



            string _Query = "execute " + Rep.dataSource +
           " @comp = '" + StandPar.spComCode.Value + "'" +
           ", @bra = '" + StandPar.spbra.Value + "'" +
           ", @CompNameA = '" + StandPar.spComNameA.Value + "'" +
           ", @CompNameE = '" + StandPar.spComNameE.Value + "'" +
           ", @BraNameA = '" + StandPar.spBraNameA.Value + "'" +
           ", @BraNameE = '" + StandPar.braNameE.Value + "'" +
           ", @LoginUser = '" + StandPar.spLoginUser.Value + "'" +
           ", @RepType = " + spRepType.Value +
           ", @TrType = " + spTrType.Value +
           ", @CatID = " + spCatId.Value +
           ", @ItemFamId = " + spItemFamId.Value +
           ", @ItemID = " + spItemID.Value +
           ", @FromDate = '" + spformDate.Value + "'" +
           ", @ToDate = '" + sptoDate.Value + "'" +
          
           //", @Store_Code= " + spStore_Code.Value +
           ", @Status = " + spStatus.Value;



            var query = db.Database.SqlQuery<IProc_Rep_CollectList_Result>(_Query).ToList();

            //if (Type == 1)
            ReportsDetails();
            BindReport(Rep.reportName, RepType, Rep.OutputType, ReportsDetail, query);
          
            return query;
        }

        public IEnumerable<IProc_Prnt_Collect_Result> Prnt_Collect()
        {

            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);
           
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

            BindReport(Rep.reportName, RepType, Rep.OutputType, ReportsDetail, query);
            return query;


           
        }



        public IEnumerable<IProc_Rpt_ItemSalesDetailVer2_Result> Rpt_ItemSalesDetail()
        {
            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);

            //ReportInfo Rep;
            int Type = int.Parse(RepPar.RepType.ToString());
            SqlParameter spRepType = new SqlParameter("@RepType", Type);

            string formDate = RepPar.FromDate.ToString();
            SqlParameter spformDate = new SqlParameter("@FromDate", formDate);

            string toDate = RepPar.ToDate.ToString();
            SqlParameter sptoDate = new SqlParameter("@ToDate", toDate);

            int CustomerID = int.Parse(RepPar.CustomerID.ToString());
            SqlParameter spCustomerID = new SqlParameter("@customerid", CustomerID == -1 ? System.Data.SqlTypes.SqlInt32.Null : CustomerID);

            int invType = int.Parse(RepPar.invType.ToString());
            SqlParameter spinvType = new SqlParameter("@invType", invType);
 
            int PaymentType = int.Parse(RepPar.PaymentType.ToString());
            SqlParameter spPaymentType = new SqlParameter("@PayType", PaymentType);

            int SLStype = int.Parse(RepPar.SLStype.ToString());
            SqlParameter spSLStype = new SqlParameter("@SalesType", SLStype);

            int GroupType = int.Parse(RepPar.check.ToString());
            SqlParameter spGroupType = new SqlParameter("@GroupType", GroupType); 

            int CatId = int.Parse(RepPar.CatId.ToString());
            SqlParameter spCatId = new SqlParameter("@CatId", CatId == -1 ? System.Data.SqlTypes.SqlInt32.Null : CatId);

            int ItemFamId = int.Parse(RepPar.ItemFamId.ToString());
            SqlParameter spItemFamId = new SqlParameter("@ItemFamId", ItemFamId == -1 ? System.Data.SqlTypes.SqlInt32.Null : ItemFamId);

            int ItemID = int.Parse(RepPar.ItemID.ToString());
            SqlParameter spItemID = new SqlParameter("@ItemID", ItemID == -1 ? System.Data.SqlTypes.SqlInt32.Null : ItemID);

            int Status = int.Parse(RepPar.Status.ToString());
            SqlParameter spStatus = new SqlParameter("@Status", Status);
            if (GroupType == 1)
            {
            Rep = OpenReport("Rpt_ItemSalesDetailByCustomerVer2");
            }
            else
            {
                Rep = OpenReport("Rpt_ItemSalesDetailByItemVer2");
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
           ", @customerid = " + spCustomerID.Value +
           ", @SalesType = " + spSLStype.Value +
           ", @PayType= " + spPaymentType.Value +
           ", @GroupType= " + spGroupType.Value +
           ", @CatID = " + spCatId.Value +
           ", @ItemFamId = " + spItemFamId.Value +
           ", @ItemID = " + spItemID.Value +
           ", @status = " + spStatus.Value +
           ", @FromDate = '" + spformDate.Value + "'" +
           ", @Todate = '" + sptoDate.Value + "'"+
           ", @invType = '" + spinvType.Value + "'";

            List<IProc_Rpt_ItemSalesDetailVer2_Result> query = db.Database.SqlQuery<IProc_Rpt_ItemSalesDetailVer2_Result>(_Query).ToList();
            ReportsDetails();

            BindReport(Rep.reportName, Type, Rep.OutputType, ReportsDetail, query);

            return query;
        }
        public IEnumerable<IProc_Rpt_ItemSalesSumVer2_Result> Rpt_ItemSalesSum()
        {
            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);

            //ReportInfo Rep;
            int Type = int.Parse(RepPar.RepType.ToString());
            SqlParameter spRepType = new SqlParameter("@RepType", Type);

            string formDate = RepPar.FromDate.ToString();
            SqlParameter spformDate = new SqlParameter("@FromDate", formDate);

            string toDate = RepPar.ToDate.ToString();
            SqlParameter sptoDate = new SqlParameter("@ToDate", toDate);

            int CustomerID = int.Parse(RepPar.CustomerID.ToString());
            SqlParameter spCustomerID = new SqlParameter("@customerid", CustomerID == -1 ? System.Data.SqlTypes.SqlInt32.Null : CustomerID);

            int invType = int.Parse(RepPar.invType.ToString());
            SqlParameter spinvType = new SqlParameter("@invType", invType);

            int PaymentType = int.Parse(RepPar.PaymentType.ToString());
            SqlParameter spPaymentType = new SqlParameter("@PayType", PaymentType);
             
            int GroupType = int.Parse(RepPar.check.ToString());
            SqlParameter spGroupType = new SqlParameter("@GroupType", GroupType);

            int SLStype = int.Parse(RepPar.SLStype.ToString());
            SqlParameter spSLStype = new SqlParameter("@SalesType", SLStype);

            int CatId = int.Parse(RepPar.CatId.ToString());
            SqlParameter spCatId = new SqlParameter("@CatId", CatId == -1 ? System.Data.SqlTypes.SqlInt32.Null : CatId);

            int ItemFamId = int.Parse(RepPar.ItemFamId.ToString());
            SqlParameter spItemFamId = new SqlParameter("@ItemFamId", ItemFamId == -1 ? System.Data.SqlTypes.SqlInt32.Null : ItemFamId);

            int ItemID = int.Parse(RepPar.ItemID.ToString());
            SqlParameter spItemID = new SqlParameter("@ItemID", ItemID == -1 ? System.Data.SqlTypes.SqlInt32.Null : ItemID);

            int Status = int.Parse(RepPar.Status.ToString());
            SqlParameter spStatus = new SqlParameter("@Status", Status);
            if (GroupType == 1)
            {
            Rep = OpenReport("Rpt_ItemSalesSumByCustomerVer2");
            }
            else
            {
                Rep = OpenReport("Rpt_ItemSalesSumByItemVer2");
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
           ", @customerid = " + spCustomerID.Value +
           ", @SalesType = " + spSLStype.Value +
           ", @PayType= " + spPaymentType.Value +
           ", @GroupType= " + spGroupType.Value +
           ", @CatID = " + spCatId.Value +
           ", @ItemFamId = " + spItemFamId.Value +
           ", @ItemID = " + spItemID.Value +
           ", @status = " + spStatus.Value +
           ", @FromDate = '" + spformDate.Value + "'" +
           ", @Todate = '" + sptoDate.Value + "'"+
           ", @invType = '" + spinvType.Value + "'";

            List<IProc_Rpt_ItemSalesSumVer2_Result> query = db.Database.SqlQuery<IProc_Rpt_ItemSalesSumVer2_Result>(_Query).ToList();
            ReportsDetails();

            BindReport(Rep.reportName, Type, Rep.OutputType, ReportsDetail, query);

            return query;
        }
        public IEnumerable<IProc_Rpt_ItemPurchaseSumVer2_Result> Rpt_ItemPurchaseSum()
        {
            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);

            //ReportInfo Rep;
            int Type = int.Parse(RepPar.RepType.ToString());
            SqlParameter spRepType = new SqlParameter("@RepType", Type);

            string formDate = RepPar.FromDate.ToString();
            SqlParameter spformDate = new SqlParameter("@FromDate", formDate);

            string toDate = RepPar.ToDate.ToString();
            SqlParameter sptoDate = new SqlParameter("@ToDate", toDate);

            int vendorid = int.Parse(RepPar.VendorId.ToString());
            SqlParameter spvendorid = new SqlParameter("@vendorid", vendorid == -1 ? System.Data.SqlTypes.SqlInt32.Null : vendorid);

            int PaymentType = int.Parse(RepPar.PaymentType.ToString());
            SqlParameter spPaymentType = new SqlParameter("@PayType", PaymentType);

            int invType = int.Parse(RepPar.invType.ToString());
            SqlParameter spinvType = new SqlParameter("@invType", invType);

            int GroupType = int.Parse(RepPar.check.ToString());
            SqlParameter spGroupType = new SqlParameter("@GroupType", GroupType); 

            int CatId = int.Parse(RepPar.CatId.ToString());
            SqlParameter spCatId = new SqlParameter("@CatId", CatId == -1 ? System.Data.SqlTypes.SqlInt32.Null : CatId);

            int ItemFamId = int.Parse(RepPar.ItemFamId.ToString());
            SqlParameter spItemFamId = new SqlParameter("@ItemFamId", ItemFamId == -1 ? System.Data.SqlTypes.SqlInt32.Null : ItemFamId);

            int ItemID = int.Parse(RepPar.ItemID.ToString());
            SqlParameter spItemID = new SqlParameter("@ItemID", ItemID == -1 ? System.Data.SqlTypes.SqlInt32.Null : ItemID);

            int Status = int.Parse(RepPar.Status.ToString());
            SqlParameter spStatus = new SqlParameter("@Status", Status);
            if (GroupType == 1)
            {
            Rep = OpenReport("Rpt_ItemPurchaseSumByCustomerVer2");
            }
            else
            {
                Rep = OpenReport("Rpt_ItemPurchaseSumByItemVer2");
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
           ", @vendorid = " + spvendorid.Value +
           ", @PayType= " + spPaymentType.Value +
           ", @GroupType= " + spGroupType.Value +
           ", @CatID = " + spCatId.Value +
           ", @ItemFamId = " + spItemFamId.Value +
           ", @ItemID = " + spItemID.Value +
           ", @status = " + spStatus.Value +
           ", @FromDate = '" + spformDate.Value + "'" +
           ", @Todate = '" + sptoDate.Value + "'"+
            ", @invType = '" + spinvType.Value + "'";

            List<IProc_Rpt_ItemPurchaseSumVer2_Result> query = db.Database.SqlQuery<IProc_Rpt_ItemPurchaseSumVer2_Result>(_Query).ToList();
            ReportsDetails();

            BindReport(Rep.reportName, Type, Rep.OutputType, ReportsDetail, query);

            return query;
        }
        public IEnumerable<IProc_Rpt_ItemPurchaseDetailVer2_Result> Rpt_ItemPurchaseDetail()
        {
            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);

            //ReportInfo Rep;
            int Type = int.Parse(RepPar.RepType.ToString());
            SqlParameter spRepType = new SqlParameter("@RepType", Type);

            string formDate = RepPar.FromDate.ToString();
            SqlParameter spformDate = new SqlParameter("@FromDate", formDate);

            string toDate = RepPar.ToDate.ToString();
            SqlParameter sptoDate = new SqlParameter("@ToDate", toDate);

            int vendorid = int.Parse(RepPar.VendorId.ToString());
            SqlParameter spvendorid = new SqlParameter("@vendorid", vendorid == -1 ? System.Data.SqlTypes.SqlInt32.Null : vendorid);

            int PaymentType = int.Parse(RepPar.PaymentType.ToString());
            SqlParameter spPaymentType = new SqlParameter("@PayType", PaymentType);

            int invType = int.Parse(RepPar.invType.ToString());
            SqlParameter spinvType = new SqlParameter("@invType", invType);

            int GroupType = int.Parse(RepPar.check.ToString());
            SqlParameter spGroupType = new SqlParameter("@GroupType", GroupType); 

            int CatId = int.Parse(RepPar.CatId.ToString());
            SqlParameter spCatId = new SqlParameter("@CatId", CatId == -1 ? System.Data.SqlTypes.SqlInt32.Null : CatId);

            int ItemFamId = int.Parse(RepPar.ItemFamId.ToString());
            SqlParameter spItemFamId = new SqlParameter("@ItemFamId", ItemFamId == -1 ? System.Data.SqlTypes.SqlInt32.Null : ItemFamId);

            int ItemID = int.Parse(RepPar.ItemID.ToString());
            SqlParameter spItemID = new SqlParameter("@ItemID", ItemID == -1 ? System.Data.SqlTypes.SqlInt32.Null : ItemID);

            int Status = int.Parse(RepPar.Status.ToString());
            SqlParameter spStatus = new SqlParameter("@Status", Status);
            if (GroupType == 1)
            {
            Rep = OpenReport("Rpt_ItemPurchaseDetailByCustomerVer2");
            }
            else
            {
                Rep = OpenReport("Rpt_ItemPurchaseDetailByItemVer2");
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
           ", @vendorid = " + spvendorid.Value +
           ", @PayType= " + spPaymentType.Value +
           ", @GroupType= " + spGroupType.Value +
           ", @CatID = " + spCatId.Value +
           ", @ItemFamId = " + spItemFamId.Value +
           ", @ItemID = " + spItemID.Value +
           ", @status = " + spStatus.Value +
           ", @FromDate = '" + spformDate.Value + "'" +
           ", @Todate = '" + sptoDate.Value + "'"+
            ", @invType = '" + spinvType.Value + "'";

            List<IProc_Rpt_ItemPurchaseDetailVer2_Result> query = db.Database.SqlQuery<IProc_Rpt_ItemPurchaseDetailVer2_Result>(_Query).ToList();
            ReportsDetails();

            BindReport(Rep.reportName, Type, Rep.OutputType, ReportsDetail, query);

            return query;
        }





        public IEnumerable<IProc_Rpt_ItemPeriodSummary_Result> Rpt_ItemPeriodSummary()
        {
            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);

            //ReportInfo Rep;
            int Type = int.Parse(RepPar.RepType.ToString());
            SqlParameter spRepType = new SqlParameter("@RepType", Type);

            int braCode = int.Parse(RepPar.braCode.ToString());
            SqlParameter spbraCode = new SqlParameter("@braCode", braCode == -1 ? System.Data.SqlTypes.SqlInt32.Null : braCode);

            int storeID = int.Parse(RepPar.storeID.ToString());
            SqlParameter spstoreID = new SqlParameter("@storeid", storeID == -1 ? System.Data.SqlTypes.SqlInt32.Null : storeID);
            
            int ItemTypeID = int.Parse(RepPar.ItemTypeID.ToString());
            SqlParameter spItemTypeID = new SqlParameter("@ItemTypeID", ItemTypeID == -1 ? System.Data.SqlTypes.SqlInt32.Null : ItemTypeID);

            int CatId = int.Parse(RepPar.CatId.ToString());
            SqlParameter spCatId = new SqlParameter("@CatId", CatId == -1 ? System.Data.SqlTypes.SqlInt32.Null : CatId);

            int ItemFamId = int.Parse(RepPar.ItemFamId.ToString());
            SqlParameter spItemFamId = new SqlParameter("@ItemFamId", ItemFamId == -1 ? System.Data.SqlTypes.SqlInt32.Null : ItemFamId);

            int ItemID = int.Parse(RepPar.ItemID.ToString());
            SqlParameter spItemID = new SqlParameter("@ItemID", ItemID == -1 ? System.Data.SqlTypes.SqlInt32.Null : ItemID);

            int check = int.Parse(RepPar.check.ToString());
            SqlParameter spcheck = new SqlParameter("@type", check);

            int BalType = int.Parse(RepPar.BalType.ToString());
            SqlParameter spBalType = new SqlParameter("@BalType", BalType);

            string FinYear = RepPar.FinYear.ToString();
            SqlParameter spFinYear = new SqlParameter("@FinYear", FinYear);

            int FromPrd = int.Parse(RepPar.FromPrd.ToString());
            SqlParameter spFromPrd = new SqlParameter("@FromPrd", FromPrd == -1 ? System.Data.SqlTypes.SqlInt32.Null : FromPrd);


            int ToPrd = int.Parse(RepPar.ToPrd.ToString());
            SqlParameter spToPrd = new SqlParameter("@ToPrd", ToPrd == -1 ? System.Data.SqlTypes.SqlInt32.Null : ToPrd);





            Rep = OpenReport("Rpt_ItemPeriodSummary");


            string _Query = "execute " + Rep.dataSource +
           " @comp = '" + StandPar.spComCode.Value + "'" +
           ", @bra = '" + StandPar.spbra.Value + "'" +
           ", @CompNameA = '" + StandPar.spComNameA.Value + "'" +
           ", @CompNameE = '" + StandPar.spComNameE.Value + "'" +
           ", @BraNameA = '" + StandPar.spBraNameA.Value + "'" +
           ", @BraNameE = '" + StandPar.braNameE.Value + "'" +
           ", @LoginUser = '" + StandPar.spLoginUser.Value + "'" +
           ", @RepType = " + spRepType.Value +
           ", @braCode = " + spbraCode.Value +
           ", @storeid = " + spstoreID.Value +
           ", @ItemTypeID = " + spItemTypeID.Value +
           ", @CatID = " + spCatId.Value +
           ", @ItemFamId = " + spItemFamId.Value +
           ", @ItemID = " + spItemID.Value +
           ", @type = " + spcheck.Value +
           ", @BalType = " + spBalType.Value +
           ", @FinYear = " + spFinYear.Value +
           ", @FromPrd = " + spFromPrd.Value +
           ", @ToPrd = " + spToPrd.Value ;

            List<IProc_Rpt_ItemPeriodSummary_Result> query = db.Database.SqlQuery<IProc_Rpt_ItemPeriodSummary_Result>(_Query).ToList();
            ReportsDetails();

            BindReport(Rep.reportName, Type, Rep.OutputType, ReportsDetail, query);

            return query;
        }
         

        public IEnumerable<IProc_Rpt_AccCustomerAging_Result> Rpt_AccCustomerAging()
        {
            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);

            //ReportInfo Rep;
            int Type = int.Parse(RepPar.RepType.ToString());
            SqlParameter spRepType = new SqlParameter("@RepType", Type);


            int CatId = int.Parse(RepPar.CatId.ToString());
            SqlParameter spCatId = new SqlParameter("@CatID", CatId == -1 ? System.Data.SqlTypes.SqlInt32.Null : CatId);


            int Groupid = int.Parse(RepPar.Groupid.ToString());
            SqlParameter spGroupid = new SqlParameter("@GroupID", Groupid == -1 ? System.Data.SqlTypes.SqlInt32.Null : Groupid);

            int CustomerID = int.Parse(RepPar.CustomerID.ToString());
            SqlParameter spCustomerID = new SqlParameter("@CustomerID", CustomerID == -1 ? System.Data.SqlTypes.SqlInt32.Null : CustomerID);

            int Status = int.Parse(RepPar.Status.ToString());
            SqlParameter spStatus = new SqlParameter("@status", Status == -1 ? System.Data.SqlTypes.SqlInt32.Null : Status);

            int BalType = int.Parse(RepPar.BalType.ToString());
            SqlParameter spBalType = new SqlParameter("@BalType", BalType);

            string FromDt = RepPar.FromDt.ToString();
            SqlParameter spFromDt = new SqlParameter("@Todate", FromDt);

            int Agtype = int.Parse(RepPar.Agtype.ToString());
            SqlParameter spAgtype = new SqlParameter("@Agtype", Agtype);
             
            if (Agtype == 1)
            {
                Rep = OpenReport("Rpt_AccCustomerAging");
            }
            else if (Agtype == 3)
            {
                Rep = OpenReport("Rpt_AccCustomerAgingThree");
            }
            else
            {
                Rep = OpenReport("Rpt_AccCustomerAgingFive");
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
           ", @CatID = " + spCatId.Value +
           ", @GroupID = " + spGroupid.Value +
           ", @CustomerID = " + spCustomerID.Value +
           ", @status = " + spStatus.Value +
           ", @BalType = " + spBalType.Value +
           ", @Todate = '" + spFromDt.Value + "'" +
           ", @Agtype = " + spAgtype.Value;    


            List<IProc_Rpt_AccCustomerAging_Result> query = db.Database.SqlQuery<IProc_Rpt_AccCustomerAging_Result>(_Query).ToList();
            ReportsDetails();

            BindReport(Rep.reportName, Type, Rep.OutputType, ReportsDetail, query);
            return query;
        }

        public IEnumerable<IProc_Rpt_AccVendorAging_Result> Rpt_AccVendorAging()
        {
            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);

            //ReportInfo Rep;
            int Type = int.Parse(RepPar.RepType.ToString());
            SqlParameter spRepType = new SqlParameter("@RepType", Type);


            int CatId = int.Parse(RepPar.CatId.ToString());
            SqlParameter spCatId = new SqlParameter("@CatID", CatId == -1 ? System.Data.SqlTypes.SqlInt32.Null : CatId);


            int Groupid = int.Parse(RepPar.Groupid.ToString());
            SqlParameter spGroupid = new SqlParameter("@GroupID", Groupid == -1 ? System.Data.SqlTypes.SqlInt32.Null : Groupid);

            int CustomerID = int.Parse(RepPar.CustomerID.ToString());
            SqlParameter spCustomerID = new SqlParameter("@CustomerID", CustomerID == -1 ? System.Data.SqlTypes.SqlInt32.Null : CustomerID);

            int Status = int.Parse(RepPar.Status.ToString());
            SqlParameter spStatus = new SqlParameter("@status", Status == -1 ? System.Data.SqlTypes.SqlInt32.Null : Status);

            int BalType = int.Parse(RepPar.BalType.ToString());
            SqlParameter spBalType = new SqlParameter("@BalType", BalType);

            string FromDt = RepPar.FromDt.ToString();
            SqlParameter spFromDt = new SqlParameter("@Todate", FromDt);

            int Agtype = int.Parse(RepPar.Agtype.ToString());
            SqlParameter spAgtype = new SqlParameter("@Agtype", Agtype);
            if (Agtype == 1)
            {
                Rep = OpenReport("Rpt_AccVendorAging");
            }
            else if (Agtype == 3)
            {
                Rep = OpenReport("Rpt_AccVendorAgingThree");

            }
            else
            {

                Rep = OpenReport("Rpt_AccVendorAgingFive");
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
           ", @CatID = " + spCatId.Value +
           ", @GroupID = " + spGroupid.Value +
           ", @CustomerID = " + spCustomerID.Value +
           ", @status = " + spStatus.Value +
           ", @BalType = " + spBalType.Value +
           ", @Todate = '" + spFromDt.Value + "'" +
           ", @Agtype = " + spAgtype.Value;


            List<IProc_Rpt_AccVendorAging_Result> query = db.Database.SqlQuery<IProc_Rpt_AccVendorAging_Result>(_Query).ToList();
            ReportsDetails();

            BindReport(Rep.reportName, Type, Rep.OutputType, ReportsDetail, query);
            return query;
        }


        public IEnumerable<IProc_Rpt_StkIssueList_Result> Rpt_StkIssueList()
        {
            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);

            //ReportInfo Rep;
            int Type = int.Parse(RepPar.RepType.ToString());
            SqlParameter spRepType = new SqlParameter("@RepType", Type);


            int IssueTypeID = int.Parse(RepPar.IssueTypeID.ToString());
            SqlParameter spIssueTypeID = new SqlParameter("@IssueTypeID", IssueTypeID == -1 ? System.Data.SqlTypes.SqlInt32.Null : IssueTypeID);


            string FromDate = RepPar.FromDate;
            SqlParameter spFromDate = new SqlParameter("@FromDate", FromDate);

            string ToDate = RepPar.ToDate;
            SqlParameter spToDate = new SqlParameter("@ToDate", ToDate);
             
            int storeID = int.Parse(RepPar.storeID.ToString());
            SqlParameter spstoreID = new SqlParameter("@storeID", storeID == -1 ? System.Data.SqlTypes.SqlInt32.Null : storeID);

            int Status = int.Parse(RepPar.Status.ToString());
            SqlParameter spStatus = new SqlParameter("@Status", Status == -1 ? System.Data.SqlTypes.SqlInt32.Null : Status);
             

            Rep = OpenReport("Rpt_StkIssueList");


            string _Query = "execute " + Rep.dataSource +
           " @comp = '" + StandPar.spComCode.Value + "'" +
           ", @bra = '" + StandPar.spbra.Value + "'" +
           ", @CompNameA = '" + StandPar.spComNameA.Value + "'" +
           ", @CompNameE = '" + StandPar.spComNameE.Value + "'" +
           ", @BraNameA = '" + StandPar.spBraNameA.Value + "'" +
           ", @BraNameE = '" + StandPar.braNameE.Value + "'" +
           ", @LoginUser = '" + StandPar.spLoginUser.Value + "'" +
           ", @RepType = " + spRepType.Value +
           ", @IssueTypeID= " + spIssueTypeID.Value +
           ", @FromDate = '" + spFromDate.Value +
           "',@ToDate ='" + spToDate.Value +
           "',@storeID = " + spstoreID.Value +
           ", @Status = " + spStatus.Value ;


            List<IProc_Rpt_StkIssueList_Result> query = db.Database.SqlQuery<IProc_Rpt_StkIssueList_Result>(_Query).ToList();
            ReportsDetails();

            BindReport(Rep.reportName, Type, Rep.OutputType, ReportsDetail, query);
            return query;
        }
        public IEnumerable<GProc_Rep_UserActivityLog_Result> Rep_UserActivityLog()
        {
            ReportStandardParameters StandPar = getStandardParameters();
            RepFinancials RepPar = JsonConvert.DeserializeObject<RepFinancials>(Par);
             
      
            int Typ = RepPar.Typ;
            SqlParameter spTyp = new SqlParameter("@GrpType", Typ);

            int braCode = RepPar.braCode;
            SqlParameter spbraCode = new SqlParameter("@bra", braCode == -1 ? System.Data.SqlTypes.SqlInt32.Null : braCode);

            string FromDate = RepPar.FromDate;
            SqlParameter spFromDate = new SqlParameter("@FromDate", FromDate);

            string ToDate = RepPar.ToDate;
            SqlParameter spToDate = new SqlParameter("@ToDate", ToDate);

            string FromTime = RepPar.FromTime;
            SqlParameter spFromTime = new SqlParameter("@FromTime", FromTime);

            string ToTime = RepPar.ToTime;
            SqlParameter spToTime = new SqlParameter("@ToTime", ToTime);

            int FinYear =RepPar.FinYear;
            SqlParameter spFinYear = new SqlParameter("@FinYear", FinYear == -1 ? System.Data.SqlTypes.SqlInt32.Null : FinYear);

            string SysCode = RepPar.SysCode;
            SqlParameter spSysCode = new SqlParameter("@sys", SysCode == "-1" ? null : SysCode);

            string Module = RepPar.Module;
            SqlParameter spModule = new SqlParameter("@module", Module == "-1" ? null : Module);

            string UserCode = RepPar.User_Code;
            SqlParameter spUserCode = new SqlParameter("@usr", UserCode == "-1" ? null : UserCode);

            int OprStatus = RepPar.OprStatus;
            SqlParameter spOprStatus = new SqlParameter("@OpStatus", OprStatus == -1 ? System.Data.SqlTypes.SqlInt32.Null : OprStatus);
             
            int OperationId = RepPar.OperationId;
            SqlParameter spOperationId = new SqlParameter("@opid", OperationId == -1 ? System.Data.SqlTypes.SqlInt32.Null : OperationId);

            if (Typ == 1)
            {

            Rep = OpenReport("Rep_UserActivityLogByUser");
            }else if (Typ == 2)
            {
                Rep = OpenReport("Rep_UserActivityLogByTitle");

            }
            else
            {
                Rep = OpenReport("Rep_UserActivityLogByDate");

            }


            int RepType = int.Parse(RepPar.RepType.ToString());
            SqlParameter spRepType = new SqlParameter("@RepType", RepType);

            string _Query = "execute " + Rep.dataSource +
           "   @comp = " + StandPar.spComCode.Value +
           ", @bra = " + spbraCode.Value+
           ", @CompNameA = '" + StandPar.spComNameA.Value +
           "', @CompNameE = '" + StandPar.spComNameE.Value +
           "', @BraNameA = '" + StandPar.spBraNameA.Value +
           "', @BraNameE = '" + StandPar.braNameE.Value +
           "', @LoginUser = '" + StandPar.spLoginUser.Value + 
           "', @RepType= " + spRepType.Value +
           ",  @GrpType= " + spTyp.Value +
           ",  @FromDate = '" + spFromDate.Value +
           "', @ToDate = '" + spToDate.Value +
           "', @FromTime='" + spFromTime.Value +
           "', @ToTime= '" + spToTime.Value +
           "', @finYear= " + spFinYear.Value +
           ",  @sys = '" + spSysCode.Value +
           "', @module= '" + spModule.Value +
           "', @usr= '" + spUserCode.Value +
           "', @OpStatus= " + spOprStatus.Value +
           ",  @opid= " + spOperationId.Value;


    List <GProc_Rep_UserActivityLog_Result> query = db.Database.SqlQuery<GProc_Rep_UserActivityLog_Result>(_Query).ToList();
            ReportsDetails();

            BindReport(Rep.reportName,RepType, Rep.OutputType, ReportsDetail, query);
            return query;
        }
    }

}



