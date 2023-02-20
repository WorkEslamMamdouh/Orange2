using Inv.API.Models.CustomEntities;
using Inv.DAL.Domain;
using Inv.DAL.Repository;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity.Core.EntityClient;
using System.Data.SqlClient;
using System.IO;
using System.IO.Compression;
using System.Text;
using System.Threading;
using System.Web;
using System.Web.Configuration;
using System.Web.Http;

namespace Inv.API.Tools
{
    public abstract class BaseController : ApiController
    {
        //private readonly bool singleDb = Convert.ToBoolean(WebConfigurationManager.AppSettings["singleDb"]);


      


        //static string Comp_Code = GetValue("CompCode");
        //public string Year = GetValue("CurrentYear");

        protected InvEntities db = UnitOfWork.context(BuildConnectionString());
  

        //protected InvEntities db = UnitOfWork.context();


        //protected string? Username => User?.Identity?.Name?.Split("\\");



 


        public static string GetName()
        {

            string CompCode = "";
            string CurrentYear = "";

            IdRequest Base = new IdRequest(); 
            try
            {
                CompCode = Base.GetValue("CompCode");
                CurrentYear = Base.GetValue("CurrentYear");
            }
            catch (Exception ex)
            {
                 
            }


            string ServerName = WebConfigurationManager.AppSettings["ServerName"];
            string DbName = WebConfigurationManager.AppSettings["AbsoluteSysDbName"];
            string DbUserName = WebConfigurationManager.AppSettings["DbUserName"];
            string DbPassword = WebConfigurationManager.AppSettings["DbPassword"];

            //SessionRecord session = data[Shared.SessionKey].ToObject<SessionRecord>();

            string connectionString = @"Data Source=" + ServerName + ";Network Library=DBMSSOCN;Initial Catalog=" + DbName + ";User ID=" + DbUserName + ";Password=" + DbPassword + "";

            string Name;

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                using (SqlCommand com = new SqlCommand())
                {
                    com.CommandText = "select DbName from G_CONTROL where COMP_CODE = " + CompCode + " and FIN_YEAR = " + CurrentYear + "";
                    com.Connection = conn;
                    conn.Open();
                    Name = com.ExecuteScalar().ToString();
                    conn.Close();


                }
            }

            return Name;
        }
         
        public static string BuildConnectionString()
        { 

   



            SqlConnectionStringBuilder sqlBuilder = new SqlConnectionStringBuilder();
            EntityConnectionStringBuilder entityBuilder = new EntityConnectionStringBuilder();

            // Set the properties for the data source.
            sqlBuilder.DataSource = WebConfigurationManager.AppSettings["ServerName"];
            bool singleDb = Convert.ToBoolean(WebConfigurationManager.AppSettings["singleDb"]);

            if (singleDb == false)
                sqlBuilder.InitialCatalog = WebConfigurationManager.AppSettings["AbsoluteSysDbName"] + Shared.Session.SelectedYear;
            else
                sqlBuilder.InitialCatalog = WebConfigurationManager.AppSettings["AbsoluteSysDbName"];



            sqlBuilder.UserID = WebConfigurationManager.AppSettings["DbUserName"];
            sqlBuilder.Password = WebConfigurationManager.AppSettings["DbPassword"];
            sqlBuilder.IntegratedSecurity = Convert.ToBoolean(WebConfigurationManager.AppSettings["UseIntegratedSecurity"]);
            sqlBuilder.MultipleActiveResultSets = true;

            string providerString = sqlBuilder.ToString();

            entityBuilder.ProviderConnectionString = "Persist Security Info=True;" + providerString;
            entityBuilder.Provider = "System.Data.SqlClient";
            entityBuilder.Metadata = @"res://*/Domain.InvModel.csdl|res://*/Domain.InvModel.ssdl|res://*/Domain.InvModel.msl";

 
             

            return entityBuilder.ConnectionString;
        }

        protected IEnumerable<T> Get<T>(string SqlStatement)
        {

            string connectionString = db.Database.Connection.ConnectionString;
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                using (SqlCommand command = new SqlCommand())
                {
                    command.Connection = connection;
                    command.CommandText = SqlStatement;
                    connection.Open();
                    DataTable table = new DataTable();
                    table.Load(command.ExecuteReader());
                    connection.Close();
                    command.Dispose();
                    connection.Dispose();

                    IEnumerable<T> result = JsonConvert.DeserializeObject<IEnumerable<T>>(JsonConvert.SerializeObject(table));
                    return result;
                }
            }

        }

        protected void InitalizeLanguage(string lang)
        {
            Thread.CurrentThread.CurrentUICulture = new System.Globalization.CultureInfo(lang);
        }

        protected string JsonSerialize(object obj)
        {
            JsonSerializerSettings settings = new JsonSerializerSettings
            {
                ReferenceLoopHandling = ReferenceLoopHandling.Ignore
            };
            string result = JsonConvert.SerializeObject(obj, Formatting.Indented, settings);
            return result;
        }

        protected T JsonDeserialize<T>(string obj)
        {
            JsonSerializerSettings settings = new JsonSerializerSettings
            {
                ReferenceLoopHandling = ReferenceLoopHandling.Ignore
            };
            object objResult = (object)obj;
            T result = JsonConvert.DeserializeObject<T>(objResult.ToString(), settings);
            return result;
        }

        //public DateTime GetCurrentDate(int comcode)
        //{
        //    var kControl = db.K_Control.Where(x => x.CompCode == comcode).First();
        //    DateTime utc = DateTime.UtcNow;
        //    DateTime res = /*utc.AddHours*/(/*int.Parse(kControl.UserTimeZoneUTCDiff.ToString())*//*)*/;
        //    return res;

        //    return res;
        //}
    }
}
