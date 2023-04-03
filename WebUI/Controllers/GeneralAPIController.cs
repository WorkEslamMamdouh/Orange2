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
using System.Web.Mvc;

namespace Inv.WebUI.Controllers
{//eslam 1 dec 2020
    public class GeneralAPIController : Controller
    {
        private Dictionary<string, object> _parameters = new Dictionary<string, object>();


        public class Ajax_Data
        {
            public string type { get; set; }
            public string url { get; set; }
            public string data { get; set; }
            public bool ISObject { get; set; }
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
                if (NewData != "")
                {
                    NewData = ConvertDateStr(NewData);
                }

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