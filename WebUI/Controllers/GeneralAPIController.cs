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
using Newtonsoft.Json;

namespace Inv.WebUI.Controllers
{//eslam 1 dec 2020
    public class GeneralAPIController : ReportsPagePrintController
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



        public string AccessApi(string data)
        {

            Ajax_Data Ajaxdata = JsonConvert.DeserializeObject<Ajax_Data>(data);
            string type = Ajaxdata.type;
            string url = Ajaxdata.url;
            string dat = Ajaxdata.data;
            var httpClient = new HttpClient();
            //var res = httpClient.GetStringAsync(WebConfigurationManager.AppSettings["ServiceUrl"] + "SystemTools/BuildConnection/?ListAddress=" + DbName + "").Result;
            return "";
        }

        //-----------------------------------------------------*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*----

             
    }
}