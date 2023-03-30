using Inv.DAL.Domain;
using Inv.DAL.Repository;
using Inv.WebUI.Reports.Forms;
using Inv.WebUI.Reports.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.EntityClient;
using System.Data.SqlClient;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web.Configuration;

namespace Inv.WebUI.Controllers
{//eslam 1 dec 2020
    public class GeneralAPIController : ReportsPagePrintController
    {
        private readonly StdParamters CurrePrnt_OperationInvoicentReportParameters;
        private readonly ReportsDetails ReportsDetail = new ReportsDetails();
        private readonly ReportInfo Rep = new ReportInfo();
        private readonly ClassPrint Printer = new ClassPrint();

        protected InvEntities db = UnitOfWork.context(BuildConnectionString());

        private Dictionary<string, object> _parameters = new Dictionary<string, object>();
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
                {
                    sqlBuilder.InitialCatalog = WebConfigurationManager.AppSettings["AbsoluteSysDbNameReportsForm"];
                }
                else
                {
                    sqlBuilder.InitialCatalog = WebConfigurationManager.AppSettings["AbsoluteSysDbNameReportsForm"];
                }

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

            string NewData = "";

            Ajax_Data Ajaxdata = JsonConvert.DeserializeObject<Ajax_Data>(data);
            HttpClient httpClient = new HttpClient();
            NewData = Ajaxdata.data;
            string url = WebConfigurationManager.AppSettings["ServiceUrl"] + "" + Ajaxdata.url;
            if (Ajaxdata.ISObject)
            {
                NewData = ConvertDateStr(NewData);

                url = url + "" + NewData + "";
                string res = httpClient.GetStringAsync(url).Result;
                return res;
            } 
            else
            {
                string res = PostRequest(url, NewData);
                return res;
            }
             
        }

        public string ConvertDateStr(string data)
        {
            StringBuilder models = new StringBuilder();
            _parameters = System.Web.Helpers.Json.Decode(data);
            int falgfrist = 0;
            foreach (KeyValuePair<string, object> item in _parameters)
            {
                string Key = item.Key;
                object Value = item.Value;


                if (falgfrist == 0)
                {
                    models.Append("?" + Key + "=" + Value);
                }
                else
                {
                    models.Append("&" + Key + "=" + Value);
                }

                falgfrist = 1;
            }


            return models.ToString();
        }


        public string PostRequest(string url, string oJsonObject)
        {
             
            HttpClient oHttpClient = new HttpClient();

            var content = new StringContent(oJsonObject, Encoding.UTF8, "application/json");
            var result = oHttpClient.PostAsync(url, content).Result;
             
            string resultContent = result.Content.ReadAsStringAsync().Result;
            return resultContent;
             
        }

        //-----------------------------------------------------*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*----


    }
}