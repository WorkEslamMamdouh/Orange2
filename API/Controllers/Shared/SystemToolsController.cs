﻿using Inv.API.Models;
using Inv.API.Models.CustomEntities;
using Inv.API.Models.CustomModel;
using Inv.API.Tools;
using Inv.DAL.Domain;
using Microsoft.VisualBasic;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using QRCoder;
using Security;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity.Core.EntityClient;
using System.Data.SqlClient;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Reflection;
using System.Text;
using System.Web;
using System.Web.Configuration;
using System.Web.Http;

namespace Inv.API.Controllers
{
    public enum Status
    {
        NotProcess = 0,
        Process = 1,
        Canceled = 2
    }

    public class Users
    {
        public string USER_CODE { get; set; }
        public bool USER_ACTIVE { get; set; }
        public Nullable<int> CompCode { get; set; }
    }

    public class SystemToolsController : BaseController
    {

        [HttpGet]
        public string GetDesciptionByCode(string tableName, string codeField, string codeValue, string descs, string language)
        {
            string connectionString = db.Database.Connection.ConnectionString;
            string result = string.Empty;
            using (SqlConnection connection = new SqlConnection(connectionString))
            {

                using (SqlCommand command = new SqlCommand())
                {
                    string SqlStatement = string.Format("Select top 1 {0} From {1} Where {2} = {3}", descs, tableName, codeField, codeValue);
                    command.Connection = connection;
                    command.CommandText = SqlStatement;
                    connection.Open();
                    DataTable table = new DataTable();
                    table.Load(command.ExecuteReader());
                    connection.Close();
                    command.Dispose();
                    connection.Dispose();
                    if (table.Rows.Count == 0)
                    {
                        return "";
                    }

                    string arDesc = table.Rows[0][descs.Split(',')[0]].ToString();
                    string enDesc = table.Rows[0][descs.Split(',')[1]].ToString();

                    if (language == "ar")
                    {
                        result = arDesc;
                    }
                    else
                    {
                        result = enDesc;
                    }

                    return result;
                }
            }
        }


        [HttpGet]
        public string ExecuteReader(string SqlStatement)
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

                    string result = JsonConvert.SerializeObject(table);
                    return result;
                }
            }
        }

        [HttpGet]
        public string ExecuteScalar(string SqlStatement)
        {
            string connectionString = db.Database.Connection.ConnectionString;

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                using (SqlCommand command = new SqlCommand())
                {
                    command.Connection = connection;
                    command.CommandText = SqlStatement;
                    connection.Open();
                    string result = string.Empty;
                    result = command.ExecuteScalar().ToString();
                    connection.Close();
                    command.Dispose();
                    connection.Dispose();


                    return result;
                }
            }

        }


        public struct CodeDescriptionModel
        {
            public string Code { get; set; }
            public string Description { get; set; }
        }


        #region Just for test
        private void testDesc()
        {
            List<string> tables = db.Database.SqlQuery<string>("Select name from sys.tables").ToList();
            List<string> result = new List<string>();
            foreach (string table in tables)
            {
                Type tableType = Type.GetType("Inv.APIService.Models." + table);
                if (tableType == null)
                {
                    result.Add("null: " + table);
                    continue;
                }
                result.Add(Desc(tableType, "ar"));
            }
        }

        private string Desc(Type type, string lang)
        {
            if (type == null)
            {
                return "null";
            }

            string result = string.Empty;
            List<PropertyInfo> properties = new List<PropertyInfo>();
            //var type = typeof(T);
            //if (lang == "en")
            //{
            properties = (from p in type.GetProperties()
                          where (p.Name.ToLower().Contains("desc") || p.Name.ToLower().Contains("name"))
                          && (p.Name[p.Name.Length - 1].ToString().ToLower() == "e" || p.Name[p.Name.Length - 1].ToString().ToLower() == "l")
                          select p).ToList();
            if (properties.Count > 0)
            {
                result = type.Name + ": " + properties.First().Name;
            }
            else
            {
                result = type.Name + ": " + "EN\\Undefiend";
            }
            //}
            //else
            //{
            properties = (from p in type.GetProperties()
                          where (p.Name.ToLower().Contains("desc") || p.Name.ToLower().Contains("name"))
                          && (p.Name[p.Name.Length - 1].ToString().ToLower() == "a")
                          select p).ToList();
            if (properties.Count > 0)
            {
                result += ", " + properties.First().Name;
            }
            else
            {
                result += ", AR:Undefiend";
            }
            //}
            return result;
        }
        #endregion


        //[HttpPost]
        //public IHttpActionResult Post(string SystemCode, string SubSystemCode)
        //{
        //    SystemEnvironment.SystemCode = SystemCode;
        //    SystemEnvironment.SubSystemCode = SystemCode;
        //    return Ok();
        //}

        [HttpGet]
        public string Get()
        {
            return "test from system tools";
        }

        private string returnSubSystems(string strSource, string strStart, string strEnd)
        {
            int Start, End;
            if (strSource.Contains(strStart) && strSource.Contains(strEnd))
            {
                Start = strSource.IndexOf(strStart, 0) + strStart.Length;
                End = strSource.IndexOf(strEnd, Start);
                string data = strSource.Substring(Start, End - Start);
                return data;
            }
            else
            {
                return "";
            }

        }

        //[HttpPost]
        //public string GetUserModules(JObject data)
        //{
        //    SessionRecord session = data[Shared.SessionKey].ToObject<SessionRecord>();

        //    var module = db.G_USER_MODULE.Where(f => f.USER_CODE == session.UserCode);
        //    var json = JsonConvert.SerializeObject(module);
        //    return json;
        //}

        [HttpGet]
        public object GetByIndex2(int index, string idField, string TableName, string Condition)
        {
            string Columns = string.Empty;

            string cols = string.Empty;
            if (Columns == "")
            {
                cols = "*";
            }
            else
            {
                cols = Columns;
            }

            string cond = string.IsNullOrEmpty(Condition) ? " Where RowNum = " + index.ToString() :
                " where RowNum = " + index.ToString() + " And " + Condition;
            string SqlStatment = "Select * From (Select Row_Number() Over (Order By (" + idField + ")) As RowNum, *  From " + TableName + " where " + Condition + ") t2" + cond;

            IEnumerable<object> result = Get<object>(SqlStatment);
            return result.FirstOrDefault();


        }

        [HttpPost]
        public string GetByIndex(JObject data)
        {
            string TableName = data["TableName"].ToString();
            string Index = data["Index"].ToString();
            string condition = data["Condition"].ToString();
            string cond = condition == "" ? "" : " where " + condition;

            SqlConnection connection = new SqlConnection(db.Database.Connection.ConnectionString);// System.Configuration.ConfigurationManager.ConnectionStrings["ConnectionString"].ConnectionString);
            SqlCommand command = new SqlCommand
            {
                Connection = connection,
                CommandText = "Select * From (Select Row_Number() Over (Order By (Select 0)) As RowIndex, * From " + TableName + cond + ") t2 where RowIndex = " + Index// where " + condition; ;
            };
            //command.CommandText = "Select " + columns.Substring(1) + " From " + TableName;
            connection.Open();
            DataTable table = new DataTable();
            table.Load(command.ExecuteReader());
            connection.Close();
            connection.Dispose();
            command.Dispose();
            string jsonResult = JsonConvert.SerializeObject(table);

            return jsonResult;// JsonConvert.SerializeObject(dicResult);
        }



        #region GeneralTools (Temp)

        [HttpPost]
        public string GetSubSystemNameE(JObject data)
        {
            SessionRecord session = data["session"].ToObject<SessionRecord>();
            string systemCode = session.SystemCode;
            string subSystemCode = session.SubSystemCode;

            string name = "";
            string sqlString;
            try
            {
                sqlString = @"SELECT dbo.G_SUB_SYSTEMS.SUB_SYSTEM_DESCE
                            FROM dbo.G_SYSTEM INNER JOIN
                            dbo.G_SUB_SYSTEMS ON dbo.G_SYSTEM.SYSTEM_CODE = dbo.G_SUB_SYSTEMS.SYSTEM_CODE
                            WHERE (dbo.G_SUB_SYSTEMS.SUB_SYSTEM_CODE = @SubSystemCode) AND (dbo.G_SUB_SYSTEMS.SYSTEM_CODE = @SystemCode)";
                System.Data.Common.DbCommand comm = GenericDataAccess.CreateTextCommand(sqlString);
                GenericDataAccess.AddStoredProcedureParameter(comm, "@SystemCode", systemCode, DbType.String);
                GenericDataAccess.AddStoredProcedureParameter(comm, "@SubSystemCode", subSystemCode, DbType.String);
                name = GenericDataAccess.ExecuteScalar(comm);
            }
            catch { }
            return name;
        }

        [HttpGet]
        public string NumberToWord(double number)
        {
            string word = Security.NumberWriter.WriteNumber(Security.LanguageCulture.Arabic, "E.P", number, "3");
            return word;

        }

        #endregion


        [HttpGet]
        public string GetAppSettings(string key)
        {
            string result =
                System.Configuration.ConfigurationManager.AppSettings[key];

            return result;
        }


        //[HttpGet]
        //public G_USERModel LoginUrl(string userName, string userPassword)
        //{
        //    var query = db.G_USERS
        //                  .Where(ee => ee.USER_CODE == userName & ee.USER_PASSWORD == userPassword & ee.USER_ACTIVE == true);

        //    return query.Select(x => new G_USERModel
        //    {
        //        USER_CODE = x.USER_CODE

        //    }).FirstOrDefault();
        //}



        [HttpGet]
        public string GetIndex(int id, string idField, string TableName, string Condition)
        {
            if (!string.IsNullOrEmpty(Condition))
            {
                Condition = "where " + Condition;
            }

            string Columns = string.Empty;
            string cols = string.Empty;
            if (Columns == "")
            {
                cols = "*";
            }
            else
            {
                cols = Columns;
            }

            string cond = " Where " + idField + "  = " + id.ToString();


            string SqlStatment = "Select top 1 RowNum  From (Select Row_Number() Over (Order By (" + idField + ")) As RowNum ," + idField + " From " + TableName + " " + Condition + ") t2" + cond;

            string result = ExecuteScalar(SqlStatment);

            return result;
        }


        [HttpGet]
        public object GetDataDisplay(string idField, string TableName, string Condition, int id)
        {
            if (!string.IsNullOrEmpty(Condition))
            {
                Condition = "where " + Condition;
            }

            string Columns = string.Empty;
            string cols = string.Empty;
            if (Columns == "")
            {
                cols = "*";
            }
            else
            {
                cols = Columns;
            }

            string cond = " Where " + idField + "  = " + id;

            string SqlStatment = "Select* From(Select Row_Number() Over (Order By (select 0)) As RowNum, *From " + TableName + " " + Condition + ") t2" + cond;
            IEnumerable<object> result = Get<object>(SqlStatment);
            return result.FirstOrDefault();
        }

        [HttpGet]
        public object GetIndex(int index, string TableName, string Condition)
        {
            string Columns = string.Empty;

            string cols = string.Empty;
            if (Columns == "")
            {
                cols = "*";
            }
            else
            {
                cols = Columns;
            }

            string cond = string.IsNullOrEmpty(Condition) ? " Where RowNum = " + index.ToString() :
                " where RowNum = " + index.ToString() + " And " + Condition;
            string SqlStatment = "Select * From (Select Row_Number() Over (Order By (select 0)) As RowNum, *  From " + TableName + " where " + Condition + ") t2" + cond;

            IEnumerable<object> result = Get<object>(SqlStatment);
            return result.FirstOrDefault();


        }

        [HttpGet]
        public object GetByIndex(int index, string idField, string TableName, string Condition)
        {
            string Columns = string.Empty;

            string cols = string.Empty;
            if (Columns == "")
            {
                cols = "*";
            }
            else
            {
                cols = Columns;
            }

            string cond = string.IsNullOrEmpty(Condition) ? " Where RowNum = " + index.ToString() :
                " where RowNum = " + index.ToString() + " And " + Condition;
            string SqlStatment = "Select * From (Select Row_Number() Over (Order By (" + idField + ")) As RowNum, *  From " + TableName + " where " + Condition + ") t2" + cond;

            IEnumerable<object> result = Get<object>(SqlStatment);
            return result.FirstOrDefault();


        }

        [HttpGet]
        public object GetModelCount(string TableName, string Condition)
        {

            string SqlStatment = "Select count(*)  From " + TableName + (string.IsNullOrEmpty(Condition) ? "" : " where " + Condition);
            string result = ExecuteScalar(SqlStatment);
            return result;


        }

        [HttpGet]

        public IHttpActionResult LoginSubmit(string userName, string userPassword)
        {

            if (ModelState.IsValid)
            {

                db.Configuration.ProxyCreationEnabled = false;
                G_USERS user = db.G_USERS.Where(ee => ee.USER_CODE == userName && ee.USER_PASSWORD == userPassword && ee.USER_ACTIVE == true).FirstOrDefault();
                return Ok(new BaseResponse(user));
            }
            return BadRequest(ModelState);
        }


        //        [HttpGet]
        //        public IHttpActionResult GetAppSettings(string userCode,string SystemCode,string SubSystemCode)
        //        {
        //            char[] splitChar = { '|' };
        //            char[] splitQMark = { '?' };
        //            XmlDocument doc = new XmlDocument();
        //            List<CompainesData> companyList = new List<CompainesData>();
        //            List<CompainesData> companyListFinal = new List<CompainesData>();
        //            List<string> gUserCompanyList = new List<string>();

        //            string Defaultlanguage = ConfigurationManager.AppSettings["Defaultlanguage"];
        //            string DefaultYear = ConfigurationManager.AppSettings["DefaultYear"];

        //            var enc = SecuritySystem.Encrypt("BSE");
        //            var dec=SecuritySystem.Decrypt(enc);

        //            doc.LoadXml(SecuritySystem.Decrypt(ConfigurationManager.AppSettings["ConnectionInfo"]).ToString());
        //            XmlNodeList compines = doc.GetElementsByTagName("Companies");

        //            string[] all_data = compines[0].FirstChild.Value.Split(splitQMark, StringSplitOptions.RemoveEmptyEntries);
        //            foreach (var item in all_data)
        //            {
        //                CompainesData compaines = new CompainesData();
        //                string[] myData = item.Split(splitChar, StringSplitOptions.RemoveEmptyEntries);
        //                compaines.companyCode = Convert.ToInt32(myData[0].ToString());
        //                compaines.comanyNameAr = myData[1].ToString();
        //                compaines.comanyNameEn = myData[2].ToString();
        //                compaines.Code = myData[3].ToString();

        //                string subSystems = returnSubSystems(compaines.Code, SystemCode + "(", ")");
        //                if (subSystems != "")
        //                    if (subSystems.Contains(SubSystemCode))
        //                        companyList.Add(compaines);

        //                companyListFinal = companyList.ToList();
        //            }

        //            foreach (var item in companyList)
        //            {
        //                int index = companyList.FindIndex(xx => xx.companyCode == item.companyCode);
        //                var userCompany = db.G_USER_COMPANY
        //                    .Where(row => (row.COMP_CODE == item.companyCode) &
        //                        (row.USER_CODE == userCode) & (row.EXECUTE == true))
        //                    .Select(t => new
        //                    {
        //                        t.COMP_CODE,
        //                        t.EXECUTE,
        //                        t.USER_CODE,
        //                    }).ToJsonString();

        //                if (userCompany == "[]")
        //                    companyListFinal.RemoveAt(index);
        //            }

        //            var obj = new
        //            {
        //                Defaultlanguage = Defaultlanguage,
        //                DefaultYear = DefaultYear,

        //                CompanyCode = companyListFinal[0].companyCode,
        //                CompanyArabicDescription = companyListFinal[0].comanyNameAr,
        //                CompanyEnglishDescription = companyListFinal[0].comanyNameEn,
        //            };

        //            List<SystemParameters> data = new List<SystemParameters>();
        //            data.Add(new SystemParameters() {
        //                Defaultlanguage = obj.Defaultlanguage,
        //                DefaultYear = obj.DefaultYear,

        //                CompanyCode = obj.CompanyCode.ToString(),
        //                CompanyArabicDescription = obj.CompanyArabicDescription,
        //                CompanyEnglishDescription = obj.CompanyEnglishDescription,

        //            });
        //            // var result = JsonConvert.SerializeObject(obj);
        //            // return result;

        //            return Ok(data
        //);
        //        }


        [HttpGet]
        public IHttpActionResult GetAppSettings(string userCode, string SystemCode, string SubSystemCode)
        {
            List<GFun_Companies_Result> companies = db.Database.SqlQuery<GFun_Companies_Result>("select * from GFun_Companies('" + userCode + "')").ToList();
            //var companies = db.GFun_Companies(userCode).ToList();
            List<SystemParameters> companiesList = new List<SystemParameters>();
            foreach (GFun_Companies_Result company in companies)
            {
                SystemParameters comp = new SystemParameters
                {
                    CompanyCode = company.COMP_CODE.ToString(),
                    CompanyNameA = SecuritySystem.Decrypt(company.NameA),
                    CompanyNameE = SecuritySystem.Decrypt(company.NameE),
                    IsActive = Convert.ToBoolean(company.IsActive)
                };
                companiesList.Add(comp);
            };
            return Ok(companiesList);
        }


        [HttpGet]
        public IHttpActionResult GetBranchsUser(string userCode, int compCode)
        {
            if (ModelState.IsValid)
            {
                List<GQ_GetUserBranch> query = db.GQ_GetUserBranch
                     .Where(brn => brn.COMP_CODE == compCode & brn.USER_CODE == userCode).ToList();
                return Ok(new BaseResponse(query));
            }
            return BadRequest(ModelState);


        }

        [HttpGet]
        public IHttpActionResult GetHelp(string ModuleCode)
        {

            if (ModelState.IsValid)
            {
                G_ModuleHelp model = db.G_ModuleHelp.Where(x => x.MODULE_CODE == ModuleCode).FirstOrDefault();
                return Ok(new BaseResponse(model));
            }
            return BadRequest(ModelState);


        }

        [HttpGet]
        public IHttpActionResult GetK_control(int comCode)
        {
            //if (ModelState.IsValid)
            //{
            //    var kControl = db.K_Control.Where(x => x.CompCode == comCode).FirstOrDefault();
            //    return Ok(kControl);
            //}
            //return BadRequest(ModelState);
            return Ok();

        }

        [HttpGet]
        public IHttpActionResult GetChartData(int comCode)
        {
            //if (ModelState.IsValid)
            //{
            //    var chartData = db.KFunc_DashBoard(comCode);
            //    return Ok(chartData);
            //}
            //return BadRequest(ModelState);
            return Ok();

        }

        [HttpGet]
        public IHttpActionResult GetNotifications(int comCode, int BraCode, int yearid, string SystemCode, string SubSystemCode)
        {
            if (ModelState.IsValid)
            {
                IQueryable<G_Noteifications> not = db.G_Noteifications.Where(x => x.SYSTEM_CODE == SystemCode); // && x.SUB_SYSTEM_CODE == SubSystemCode
                IQueryable<G_NotificationCompany> notCom = db.G_NotificationCompany.Where(x => x.SYSTEM_CODE == SystemCode && x.FIN_YEAR == yearid && x.CompCode == comCode && x.BranchCode == BraCode); // && x.SUB_SYSTEM_CODE == SubSystemCode

                var res = (from nt in not
                           join ntc in notCom on nt.MODULE_CODE equals ntc.MODULE_CODE
                           where nt.ISActive == true && ntc.ISActive == true
                           select new { nt.MODULE_CODE, nt.MODULE_DESCA, nt.MODULE_DESCE, ntc.NoteCount, nt.DisplayOrder }).OrderBy(x => x.DisplayOrder).ToList();

                return Ok(res);
            }
            return BadRequest(ModelState);

        }

        [HttpGet]
        public IHttpActionResult UpdateNotificationAndSndMsg(int comCode, int BraCode, string SystemCode, string SubSystemCode)
        {
            //if (ModelState.IsValid)
            //{
            //    var result = db.KProc_NotificationUpdate(comCode, BraCode, SystemCode, SubSystemCode);
            //    MessageController msg = new MessageController();
            //    msg.MessageGenerator(comCode);
            //    msg.SendMessage(comCode);
            //    return Ok(result);

            //}
            //return BadRequest(ModelState);
            return Ok();

        }

        [HttpGet]
        public IHttpActionResult GetKControl()
        {
            //            if (ModelState.IsValid)
            //            {
            //                var control = db.K_Control.FirstOrDefault()
            //;
            //                return Ok(control);
            //            }
            //            return BadRequest(ModelState);
            return Ok();

        }

        [HttpGet]
        public IHttpActionResult GetFavorites(string UserCode, string SystemCode, string SubSystemCode)
        {
            //var query = db.GQ_UserFavorite.Where(f => f.SYSTEM_CODE == SystemCode & f.SUB_SYSTEM_CODE == SubSystemCode & f.USER_CODE == UserCode).ToList();
            //return Ok(query);
            return Ok();

        }


        [HttpGet]
        public IHttpActionResult GetUserPrivilage(int year, int compCode, int branchCode, string UserCode, string SystemCode, string Modulecode)
        {

            string query = "SELECT * FROM [dbo].[GFunc_GetPrivilage] (" + year + "," + compCode + "," + branchCode + ",'" + UserCode + "', '" + SystemCode + "','" + Modulecode + "')";

            UserPrivilege result = db.Database.SqlQuery<UserPrivilege>(query).FirstOrDefault();

            //result = result.ToJsonString();
            return Ok(result.ToJsonString());
        }

        [HttpGet]
        public IHttpActionResult GetUserPrivilage(int compCode, int branchCode, string UserCode, string SystemCode, string SubSystemCode, string Modulecode)
        {

            string query = "SELECT * FROM [dbo].[GFunc_GetPrivilage] (" + compCode + "," + branchCode + ",'" + UserCode + "', '" + SystemCode + "','" + SubSystemCode + "','" + Modulecode + "')";

            UserPrivilege result = db.Database.SqlQuery<UserPrivilege>(query).FirstOrDefault();

            //result = result.ToJsonString();
            return Ok(result.ToJsonString());
        }

        [HttpGet]
        public IHttpActionResult GetAllUserPrivilage(int year, int compCode, int branchCode, string UserCode, string SystemCode, string SubSystemCode)
        {
            //+year + ","
            string Modulecode = "";
            string query = "SELECT * FROM [dbo].[GFunc_GetPrivilage] (" + year + "," + compCode + "," + branchCode + ",'" + UserCode + "', '" + SystemCode + "','" + Modulecode + "')";
            List<UserPrivilege> result = db.Database.SqlQuery<UserPrivilege>(query).Where(row => row.Access == false || row.AVAILABLE == false).ToList();
            return Ok(result);
        }

        [HttpGet]
        public IHttpActionResult SwitchUserFavorite(string UserCode, string Modulecode, string SubSystemCode)
        {

            //var favorits = db.G_USER_FAVORITE.Where(c =>
            //c.SYSTEM_CODE == "K" &
            //c.SUB_SYSTEM_CODE == "K" &
            //c.USER_CODE == UserCode &
            //c.MODULE_CODE == Modulecode).ToList();

            //int count = favorits.Count();

            //if (count == 0)
            //{
            //    G_USER_FAVORITE fav = new G_USER_FAVORITE();
            //    fav.MODULE_CODE = Modulecode;

            //    fav.OPTIONORDER = 0;
            //    fav.SUB_SYSTEM_CODE = "K";// session.SubSystemCode;
            //    fav.SYSTEM_CODE = "K";// session.SystemCode;
            //    fav.USER_CODE = UserCode;

            //    db.G_USER_FAVORITE.Add(fav);
            //}
            //else
            //{
            //    db.G_USER_FAVORITE.Remove(favorits.First());
            //}
            //db.SaveChanges();
            return Ok();
        }

        [HttpGet]
        public IHttpActionResult GetBranchsByUserCode(string userCode, int compCode)

        {
            //var result = db.GQ_GetUserBranch
            //    .Where(user => user.USER_CODE == userCode & user.COMP_CODE == compCode).ToList();

            //return Ok(result);
            return Ok();

        }

        [HttpGet]
        public IHttpActionResult ChangePassword(string OldPassword, string NewPassword, string UserCode)
        {


            G_USERS user = db.G_USERS.Where(f => f.USER_CODE == UserCode).FirstOrDefault();

            if (user.USER_PASSWORD != OldPassword)
            {

                return Ok(new BaseResponse(HttpStatusCode.NotAcceptable, ""));
            }

            user.USER_PASSWORD = NewPassword;
            db.SaveChanges();

            return Ok(new BaseResponse());
        }


        [HttpGet]
        public IHttpActionResult GetUserControl(int CompCode)
        {
            //var result = db.K_Control.Where(f => f.CompCode == CompCode).FirstOrDefault();
            //if (result == null)
            //{
            //    result = new K_Control()
            //    {
            //        CompCode = CompCode,
            //        IsVat = true
            //    };
            //}

            //return Ok(result);
            return Ok();

        }


        private struct ColumnObjectStruct
        {
            public string headerText { get; set; }
            public bool hidden { get; set; }
            public string key { get; set; }
            public string dataType { get; set; }
            public string width { get; set; }
            public bool filterable { get; set; }
        }

        public struct SearchAttruibuts
        {
            public List<G_SearchFormSetting> Columns { get; set; }
            public G_SearchForm Settings { get; set; }
        }

        [HttpPost]
        public SearchAttruibuts SearchProperties(string moduleCode, string controlName, string SystemCode, string SubSystemCode)
        {

            G_SearchFormModule searchFormModule = (from module in db.G_SearchFormModule
                                                   where module.SystemCode == SystemCode
                                                   && module.SubSystemCode == SubSystemCode
                                                   && module.ModuleCode == moduleCode
                                                   && (module.ControlCode == controlName || module.ControlCode == "*")
                                                   select module).FirstOrDefault();
            if (searchFormModule == null)
            {
                return new SearchAttruibuts { Columns = new List<G_SearchFormSetting>(), Settings = new G_SearchForm() };
            }

            string SearchFormCode = searchFormModule.SearchFormCode;// db.G_SearchFormModule.Where(f => f.ModuleCode == moduleCode).First().SearchFormCode;

            List<G_SearchFormSetting> columns = (from cols in db.G_SearchFormSetting
                                                 orderby cols.FieldSequence
                                                 where cols.SearchFormCode == SearchFormCode
                                                 select cols).ToList();

            IQueryable<G_SearchForm> settings = from searchForm in db.G_SearchForm
                                                where searchForm.SearchFormCode == SearchFormCode
                                                select searchForm;

            SearchAttruibuts obj = new SearchAttruibuts
            {
                Columns = columns as List<G_SearchFormSetting>,
                Settings = settings.First()
            };

            return obj;
            // var jsonObject = Newtonsoft.Json.JsonConvert.SerializeObject(obj, Newtonsoft.Json.Formatting.Indented);
            //  return jsonObject;
        }

        [HttpPost, ActionName("Find")]
        public string Find(string TableName, string Condition, string Columns, string orderBy)
        {
            SqlConnection connection = new SqlConnection(db.Database.Connection.ConnectionString);
            connection.Open();

            int pageSize = db.G_SearchForm.FirstOrDefault(f => f.DataSourceName == TableName).PageSize;

            string cond = Condition;

            SqlCommand command = new SqlCommand
            {
                Connection = connection
            };
            if (pageSize == 0)
            {
                command.CommandText = "Select " + Columns + " From " + TableName + cond + " Order By " + orderBy;
            }
            else
            {
                command.CommandText = "Select Top " + pageSize.ToString() + " " + Columns + " From " + TableName + cond + " Order By " + orderBy;
            }

            //if (pageSize == 0)
            //    command.CommandText = "Select RowIndex," + Columns + " From (Select Row_Number() Over (Order By (Select 0)) As RowIndex, * From " + TableName + ") t2" + cond + " Order By " + orderBy;
            //else
            //    command.CommandText = "Select Top " + pageSize.ToString() + " RowIndex," + Columns + " From (Select Row_Number() Over (Order By (Select 0)) As RowIndex, * From " + TableName + ") t2" + cond + " Order By " + orderBy;

            DataTable table = new DataTable();
            table.Load(command.ExecuteReader());
            connection.Close();
            connection.Dispose();
            command.Dispose();
            string jsonResult = JsonConvert.SerializeObject(table);

            return jsonResult;

        }

        [HttpGet]
        public IHttpActionResult FindKey(string moduleCode, string Condition, string controlName, string SystemCode, string SubSystemCode, string ScreenLanguage)
        {

            SearchAttruibuts obj = SearchProperties(moduleCode, controlName, SystemCode, SubSystemCode);
            if (obj.Settings.DataSourceName == null)
            {
                return Ok();
            }
            string cols = string.Empty;

            List<ColumnObjectStruct> columnsObject = new List<ColumnObjectStruct>
            {
                new ColumnObjectStruct()
                {
                    dataType = "number",
                    headerText = "",
                    hidden = true,
                    key = "RowIndex",
                    width = ""
                }
            };
            foreach (G_SearchFormSetting column in obj.Columns)
            {
                if ((column.Language == 0) ||
                    (ScreenLanguage == "en" && column.Language == 2) ||
                    (ScreenLanguage == "ar" && column.Language == 1))
                {
                    cols += "," + column.AlternateDataMember + " AS " + column.DataMember;  //cols += "," + column.DataMember;
                    ColumnObjectStruct colObj = new ColumnObjectStruct
                    {
                        dataType = column.Datatype == 0 ? "string" : "number"
                    };

                    if (ScreenLanguage == "en")
                    {
                        colObj.headerText = column.FieldTitle;
                    }
                    else
                    {
                        colObj.headerText = column.FieldTitleA;
                    }

                    colObj.hidden = !column.IsReadOnly;
                    colObj.filterable = false;
                    colObj.key = column.DataMember;
                    colObj.width = column.FieldWidth == 0 ? "100px" : (column.FieldWidth.ToString() + "px");

                    columnsObject.Add(colObj);
                }
            }

            string tableName = obj.Settings.DataSourceName;
            string condition = "";

            if (Condition == null || Condition == "")
            {
                condition = "";
            }
            else
            {
                condition = " Where " + Condition;
            }

            string columns = cols.Substring(1);
            string orderBy = obj.Settings.ReturnDataPropertyName;

            string result = Find(tableName, condition, columns, orderBy);

            var resultObject = new
            {
                TableName = tableName,
                Condition = condition,
                DataResult = result,
                Settings = obj.Settings,
                Columns = columnsObject

            };

            return Ok(resultObject);
        }

        [HttpGet]
        public IHttpActionResult GetIndexByUseId(int idValue, string BaseTableName, string idFieldName, string Condition)
        {
            if (!string.IsNullOrEmpty(Condition))
            {
                Condition = "where " + Condition;
            }

            string SqlStatment = "";
            string cond = " Where " + idFieldName + "  = " + idValue.ToString();
            SqlStatment = "Select top 1 RowNum  From (Select Row_Number() Over (Order By (" + idFieldName + ")) As RowNum ," + idFieldName + " From " + BaseTableName + " " + Condition + " " + ") t2" + cond;
            string result = ExecuteScalar(SqlStatment);
            return Ok(result);
        }

        [HttpGet]
        public HttpResponseMessage BuildConnection()
        {
            return new HttpResponseMessage()
            {
                Content = new StringContent(
                    BuildConnectionString(),
                    Encoding.UTF8,
                    "text/html"
                )
            };
        }

        [HttpGet]
        public HttpResponseMessage BuildConnection(string ListAddress)
        {

            string DbName = "";
            //string DbName = ListAddress; 

            return new HttpResponseMessage()
            {
                Content = new StringContent(
                    BuildConnectionString(DbName),
                    Encoding.UTF8,
                    "text/html"
                )
            };
        }

        [HttpGet]
        public IHttpActionResult getBackgroundImage(int CompCode)
        {
            string result = db.G_COMPANY.Where(f => f.COMP_CODE == CompCode).FirstOrDefault().BkImage1;
            return Ok(result);
            //return Ok();

        }
        //[HttpGet]
        //public IHttpActionResult getBackgroundImage(int CompCode)
        //{
        //    var result = db.G_COMPANY.Where(f => f.COMP_CODE == CompCode).FirstOrDefault().BkImage1;         
        //    return Ok(result);
        //}
        [HttpGet]
        public string ConvertToHDate(string date)
        {
            DateTime c = Convert.ToDateTime(date);
            string x = c.ToString("dd'/'MM'/'yyyy");

            string sql = "select dbo.G_GetHDate('" + x + "')";
            string t = db.Database.SqlQuery<string>(sql).FirstOrDefault();
            return t;

        }
        [HttpGet]
        public string ConvertDate(string date)
        {
            DateTime c = Convert.ToDateTime(date);
            string x = c.ToString("dd'/'MM'/'yyyy");

            //string sql = "select dbo.G_GetHDate('" + x + "')";
            //string t = db.Database.SqlQuery<string>(sql).FirstOrDefault();
            return x;

        }
        // [HttpGet]
        //public IHttpActionResult CheckDateCompCtrl(int Comp,int Bra,int SemsterID,string Dt,int Typ)
        //{
        //    ObjectParameter Res = new ObjectParameter("Res", typeof(Int32));
        //    db.KProc_CheckDate(Comp, Bra, SemsterID, Dt, Typ, Res);
        //    bool reslt = Convert.ToBoolean(Res.Value);

        //    return Ok(reslt);

        //}

        public static string GenerateGuid()
        {
            Guid obj = Guid.NewGuid();

            return obj.ToString();
        }

        public static string GenerateQRCode(string compNameA, string BraVatno, string TrDate, string NetAfterVat, string VatAmount)
        {

            QRCodeGenerator qRCodeGenerator = new QRCodeGenerator();
            string plainText = compNameA + BraVatno + TrDate + NetAfterVat + VatAmount;
            QRCodeData qRCodeData = qRCodeGenerator.CreateQrCode(plainText, QRCoder.QRCodeGenerator.ECCLevel.Q);
            QRCoder.QRCode qRCode = new QRCoder.QRCode(qRCodeData);
            string QRcode = "";
            using (Bitmap bitmap = qRCode.GetGraphic(2))
            {
                using (MemoryStream ms = new MemoryStream())
                {
                    bitmap.Save(ms, System.Drawing.Imaging.ImageFormat.Jpeg);
                    byte[] byteimage = ms.ToArray();
                    QRcode = Convert.ToBase64String(byteimage);

                }
            }
            return QRcode;
        }
        [HttpGet]
        public IHttpActionResult CheckDateCompCtrl(int Comp, int Bra, int SemsterID, DateTime Dt, int Typ)
        {
            //string t = Dt.Day.ToString("00") + "-" + Dt.Month.ToString("00") + "-" + Dt.Year.ToString("0000");
            //ObjectParameter Res = new ObjectParameter("Res", typeof(Int32));
            //db.KProc_CheckDate(Comp, Bra, SemsterID, t, Typ, Res);
            //bool reslt = Convert.ToBoolean(Res.Value);

            //return Ok(reslt);
            return Ok();

        }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetUpdateLog()
        {


            // connection = new SqlConnection(db.Database.Connection.ConnectionString);
            //string dd = @"Persist Security Info=True;Data Source=DC\SQL2014;Initial Catalog=Kids_2019;Integrated Security=False;User ID=SYSUSER;Password=SYSUSER;MultipleActiveResultSets=True";
            string dd = BiuldConnectionStringOutProject();
            SqlConnection connection = new SqlConnection(dd);


            connection.Open();

            SqlCommand command = new SqlCommand
            {
                Connection = connection,
                CommandText = "select * from G_UpdateLog"
            };

            DataTable table = new DataTable();
            table.Load(command.ExecuteReader());
            connection.Close();
            connection.Dispose();
            command.Dispose();


            //List<G_UpdateLog> studentList = new List<G_UpdateLog>();
            for (int i = 0; i < table.Rows.Count; i++)
            {
                //G_UpdateLog student = new G_UpdateLog();
                //student.Ser = Convert.ToInt32(table.Rows[i]["Ser"]);
                //student.SubjectA = table.Rows[i]["SubjectA"].ToString();
                //student.DescA = table.Rows[i]["DescA"].ToString();
                //student.DoneAt = Convert.ToDateTime(table.Rows[i]["DoneAt"]);
                //studentList.Add(student);
            }

            //return Ok(new BaseResponse(studentList));
            return Ok();



        }
        //Mohamed abd el moatay
        public static string BiuldConnectionStringOutProject()
        {

            SqlConnectionStringBuilder sqlBuilder = new SqlConnectionStringBuilder();
            EntityConnectionStringBuilder entityBuilder = new EntityConnectionStringBuilder();

            // Set the properties for the data source.
            sqlBuilder.DataSource = WebConfigurationManager.AppSettings["ServerName"];
            bool singleDb = Convert.ToBoolean(WebConfigurationManager.AppSettings["singleDb"]);

            if (singleDb == false)
            {
                sqlBuilder.InitialCatalog = WebConfigurationManager.AppSettings["AbsoluteSysDbName"] + (DateTime.Now.Year).ToString();
            }
            else
            {
                sqlBuilder.InitialCatalog = WebConfigurationManager.AppSettings["AbsoluteSysDbName"];
            }

            sqlBuilder.UserID = WebConfigurationManager.AppSettings["DbUserName"];
            sqlBuilder.Password = WebConfigurationManager.AppSettings["DbPassword"];
            sqlBuilder.IntegratedSecurity = Convert.ToBoolean(WebConfigurationManager.AppSettings["UseIntegratedSecurity"]);
            sqlBuilder.MultipleActiveResultSets = true;

            string providerString = sqlBuilder.ToString();

            entityBuilder.ProviderConnectionString = "Persist Security Info=True;" + providerString;
            //entityBuilder.Provider = "System.Data.SqlClient";
            //entityBuilder.Metadata = @"res://*/Domain.Kids.csdl|res://*/Domain.Kids.ssdl|res://*/Domain.Kids.msl";

            return entityBuilder.ProviderConnectionString;
        }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetClientData()
        {


            // connection = new SqlConnection(db.Database.Connection.ConnectionString);
            //string dd = @"Persist Security Info=True;Data Source=DC\SQL2014;Initial Catalog=Kids_2019;Integrated Security=False;User ID=SYSUSER;Password=SYSUSER;MultipleActiveResultSets=True";
            string dd = BiuldConnectionStringOutProject();
            SqlConnection connection = new SqlConnection(dd);


            connection.Open();

            SqlCommand command = new SqlCommand
            {
                Connection = connection,
                CommandText = "select * from KQ_G_CustomerInfo"
            };

            DataTable table = new DataTable();
            table.Load(command.ExecuteReader());
            connection.Close();
            connection.Dispose();
            command.Dispose();


            //List<KQ_G_CustomerInfo> studentList = new List<KQ_G_CustomerInfo>();
            for (int i = 0; i < table.Rows.Count; i++)
            {
                //KQ_G_CustomerInfo student = new KQ_G_CustomerInfo();
                //    student.Country = table.Rows[i]["Country"].ToString();
                //    student.CustomerNameA = table.Rows[i]["CustomerNameA"].ToString();
                //    student.Address = table.Rows[i]["Address"].ToString();
                //    student.DetailedInfo = table.Rows[i]["DetailedInfo"].ToString();
                //    student.CityID = Convert.ToInt32(table.Rows[i]["CityID"]);
                //    student.DistrictId = Convert.ToInt32(table.Rows[i]["DistrictId"]);
                //    student.Dist_DescE = table.Rows[i]["Dist_DescE"].ToString();
                //    student.Dist_DescA = table.Rows[i]["Dist_DescA"].ToString();
                //    student.CustomerNameE = table.Rows[i]["CustomerNameE"].ToString();
                //    student.City_descA = table.Rows[i]["City_descA"].ToString();
                //    student.City_DescE = table.Rows[i]["City_DescE"].ToString();
                //    //student.CompCode= Convert.ToInt32(table.Rows[i]["CompCode"]);
                //    //student.BranchCode= Convert.ToInt32(table.Rows[i]["BranchCode"]);
                //    student.ContactInfo = table.Rows[i]["ContactInfo"].ToString();
                //    student.CustomerId = Convert.ToInt32(table.Rows[i]["CustomerId"]);
                //    student.Tel = table.Rows[i]["Tel"].ToString();
                //    student.WebSite = table.Rows[i]["WebSite"].ToString();
                //    //student.Otherinfo= table.Rows[i]["Otherinfo"].ToString();
                //    studentList.Add(student);
            }

            //return Ok(new BaseResponse(studentList));

            return Ok();


        }


        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetCityData()
        {


            // connection = new SqlConnection(db.Database.Connection.ConnectionString);
            //string dd = @"Persist Security Info=True;Data Source=DC\SQL2014;Initial Catalog=Kids_2019;Integrated Security=False;User ID=SYSUSER;Password=SYSUSER;MultipleActiveResultSets=True";
            string dd = BiuldConnectionStringOutProject();
            SqlConnection connection = new SqlConnection(dd);


            connection.Open();

            SqlCommand command = new SqlCommand
            {
                Connection = connection,
                CommandText = "select * from k_G_City"
            };

            DataTable table = new DataTable();
            table.Load(command.ExecuteReader());
            connection.Close();
            connection.Dispose();
            command.Dispose();


            //List<k_G_City> studentList = new List<k_G_City>();
            //for (int i = 0; i < table.Rows.Count; i++)
            //{
            //    k_G_City student = new k_G_City();
            //    student.country = table.Rows[i]["country"].ToString();
            //    student.CityId = Convert.ToInt32(table.Rows[i]["CityId"]);
            //    student.DescA = table.Rows[i]["DescA"].ToString();
            //    student.CityCode = table.Rows[i]["CityCode"].ToString();
            //    student.DescE = table.Rows[i]["DescE"].ToString();
            //    student.CityCode = table.Rows[i]["CityCode"].ToString();
            //    studentList.Add(student);
            //}

            //return Ok(new BaseResponse(studentList));
            return Ok();



        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetDistrictData()
        {


            // connection = new SqlConnection(db.Database.Connection.ConnectionString);
            //string dd = @"Persist Security Info=True;Data Source=DC\SQL2014;Initial Catalog=Kids_2019;Integrated Security=False;User ID=SYSUSER;Password=SYSUSER;MultipleActiveResultSets=True";
            string dd = BiuldConnectionStringOutProject();
            SqlConnection connection = new SqlConnection(dd);


            connection.Open();

            SqlCommand command = new SqlCommand
            {
                Connection = connection,
                CommandText = "select * from K_G_District"
            };

            DataTable table = new DataTable();
            table.Load(command.ExecuteReader());
            connection.Close();
            connection.Dispose();
            command.Dispose();


            //List<K_G_District> studentList = new List<K_G_District>();
            //for (int i = 0; i < table.Rows.Count; i++)
            //{
            //    K_G_District student = new K_G_District();
            //    student.CityId = Convert.ToInt32(table.Rows[i]["CityId"]);
            //    student.DescA = table.Rows[i]["DescA"].ToString();
            //    student.DescE = table.Rows[i]["DescE"].ToString();
            //    student.DistrictId = Convert.ToInt32(table.Rows[i]["DistrictId"]);

            //    studentList.Add(student);
            //}

            //return Ok(new BaseResponse(studentList));
            return Ok();



        }
        /// <summary>
        /// ragab
        /// </summary>
        /// <returns></returns>
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetURLVideo()
        {
            // connection = new SqlConnection(db.Database.Connection.ConnectionString);
            //string dd = @"Persist Security Info=True;Data Source=DC\SQL2014;Initial Catalog=Kids_2019;Integrated Security=False;User ID=SYSUSER;Password=SYSUSER;MultipleActiveResultSets=True";
            string dd = BiuldConnectionStringOutProject();
            SqlConnection connection = new SqlConnection(dd);

            connection.Open();
            SqlCommand command = new SqlCommand
            {
                Connection = connection,
                CommandText = "select * from G_WebVideo"
            };
            DataTable table = new DataTable();
            table.Load(command.ExecuteReader());
            connection.Close();
            connection.Dispose();
            command.Dispose();

            //List<G_WebVideo> URLVideoList = new List<G_WebVideo>();
            //for (int i = 0; i < table.Rows.Count; i++)
            //{
            //    G_WebVideo URlViedo = new G_WebVideo();
            //    URlViedo.VideoId = Convert.ToInt32(table.Rows[i]["VideoId"]);
            //    URlViedo.SectionID = Convert.ToInt32(table.Rows[i]["SectionID"]);
            //    URlViedo.VideoDescA = table.Rows[i]["VideoDescA"].ToString();
            //    URlViedo.VideoDescE = table.Rows[i]["VideoDescE"].ToString();
            //    URlViedo.URL = table.Rows[i]["URL"].ToString();
            //    URlViedo.DisplayOrder = Convert.ToInt32(table.Rows[i]["DisplayOrder"]);
            //    URlViedo.Show = Convert.ToBoolean(table.Rows[i]["Show"]);
            //    URLVideoList.Add(URlViedo);
            //}

            //return Ok(new BaseResponse(URLVideoList));
            return Ok();

        }
        /// <summary>
        /// ragab
        /// </summary>
        /// <returns></returns>
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetURLSecion()
        {

            // connection = new SqlConnection(db.Database.Connection.ConnectionString);
            //string dd = @"Persist Security Info=True;Data Source=DC\SQL2014;Initial Catalog=Kids_2019;Integrated Security=False;User ID=SYSUSER;Password=SYSUSER;MultipleActiveResultSets=True";
            string dd = BiuldConnectionStringOutProject();
            SqlConnection connection = new SqlConnection(dd);

            connection.Open();
            SqlCommand command = new SqlCommand
            {
                Connection = connection,
                CommandText = "select * from G_WebSesction"
            };
            DataTable table = new DataTable();
            table.Load(command.ExecuteReader());
            connection.Close();
            connection.Dispose();
            command.Dispose();

            //List<G_WebSesction> SectionList = new List<G_WebSesction>();
            //for (int i = 0; i < table.Rows.Count; i++)
            //{
            //    G_WebSesction Section = new G_WebSesction();
            //    Section.SectionID = Convert.ToInt32(table.Rows[i]["SectionID"]);
            //    Section.SecionDescA = table.Rows[i]["SecionDescA"].ToString();
            //    Section.SecionDescE = table.Rows[i]["SecionDescE"].ToString();
            //    Section.DisplayOrder = Convert.ToInt32(table.Rows[i]["DisplayOrder"]);
            //    Section.Show = Convert.ToBoolean(table.Rows[i]["Show"]);
            //    SectionList.Add(Section);
            //}

            //return Ok(new BaseResponse(SectionList));
            return Ok();

        }


        [HttpGet]
        public IHttpActionResult GetMaxImagesize(int comp, int bracode)
        {
            //if (ModelState.IsValid)
            //{
            //    return Ok(new BaseResponse(db.K_Control.Where(x => x.CompCode == comp).FirstOrDefault().MaxImagesize));
            //}
            //return BadRequest();
            return Ok();

        }
        public string GetPath(string Comp, string Branch, string ModuleCode, string TrNo, string NewSerial, bool PathFolderOnly)
        {
            string result = "";
            string ArchivePath = db.Database.SqlQuery<string>("select ImgPath from K_Control where CompCode = " + Comp).FirstOrDefault();
            //string ArchivePath = db.P_Control.Where(x => x.CompCode == int.Parse(Comp) && x.BraCode == int.Parse(Branch)).FirstOrDefault().ImgPath;// @"D:/PMSImage/";
            string strPath = ArchivePath + Comp + "/" + ModuleCode + "/";
            string strImgName = TrNo + "_" + NewSerial + ".Jpg";
            string _Path = Path.Combine(strPath, strImgName);
            switch (PathFolderOnly)
            {
                case true:
                    result = strPath;
                    break;
                case false:
                    result = _Path;
                    break;
            }
            return result;
        }


        [HttpPost, AllowAnonymous]
        public IHttpActionResult UploadImageTemp()
        {
            if (HttpContext.Current.Request.Files.AllKeys.Any())
            {
                try
                {
                    HttpPostedFile httpPostedFile = HttpContext.Current.Request.Files["UploadedImage"];
                    HttpPostedFile Comp = HttpContext.Current.Request.Files["Comp"];
                    HttpPostedFile Branch = HttpContext.Current.Request.Files["Branch"];
                    HttpPostedFile MouleCode = HttpContext.Current.Request.Files["MouleCode"];

                    if (httpPostedFile != null)
                    {
                        string strPath = GetPath(Comp.FileName, Branch.FileName, MouleCode.FileName, httpPostedFile.FileName, null, true);
                        string fileSavePath = GetPath(Comp.FileName, Branch.FileName, MouleCode.FileName, httpPostedFile.FileName, "1", false);

                        if (Directory.Exists(strPath))
                        {
                            DirectoryInfo d = new DirectoryInfo(strPath);
                            FileInfo[] Files = d.GetFiles(httpPostedFile.FileName + "_*.Jpg");
                            if (Files.Count() == 0)
                            {
                                httpPostedFile.SaveAs(fileSavePath);
                            }
                            else
                            {
                                int _NewSerial = GetMax(Files) + 1;
                                string NewImgPath = GetPath(Comp.FileName, Branch.FileName, MouleCode.FileName, httpPostedFile.FileName, _NewSerial.ToString(), false);
                                httpPostedFile.SaveAs(NewImgPath);
                            }
                        }
                        else
                        {
                            DirectoryInfo di = Directory.CreateDirectory(strPath);
                            httpPostedFile.SaveAs(fileSavePath);
                        }
                    }
                }
                catch (Exception ex)
                {
                    return Ok(new BaseResponse(ex.Message));
                }
            }
            return Ok();
        }
        //Test VV
        [HttpPost, AllowAnonymous]
        public IHttpActionResult UploadImage()
        {
            if (HttpContext.Current.Request.Files.AllKeys.Any())
            {
                try
                {
                    // var httpPostedFile = HttpContext.Current.Request.Files["UploadedImage"];
                    HttpPostedFile Comp = HttpContext.Current.Request.Files["Comp"];
                    HttpPostedFile Branch = HttpContext.Current.Request.Files["Branch"];
                    HttpPostedFile MouleCode = HttpContext.Current.Request.Files["MouleCode"];
                    for (int i = 0; i <= HttpContext.Current.Request.Files.Count - 3; i++)
                    {
                        HttpPostedFile httpPostedFile = HttpContext.Current.Request.Files["UploadedImage" + i];
                        if (httpPostedFile != null)
                        {
                            string strPath = GetPath(Comp.FileName, Branch.FileName, MouleCode.FileName, httpPostedFile.FileName, null, true);
                            string fileSavePath = GetPath(Comp.FileName, Branch.FileName, MouleCode.FileName, httpPostedFile.FileName, "1", false);

                            if (Directory.Exists(strPath))
                            {
                                DirectoryInfo d = new DirectoryInfo(strPath);
                                FileInfo[] Files = d.GetFiles(httpPostedFile.FileName + "_*.Jpg");
                                if (Files.Count() == 0)
                                {
                                    httpPostedFile.SaveAs(fileSavePath);
                                }
                                else
                                {
                                    int _NewSerial = GetMax(Files) + 1;
                                    string NewImgPath = GetPath(Comp.FileName, Branch.FileName, MouleCode.FileName, httpPostedFile.FileName, _NewSerial.ToString(), false);
                                    httpPostedFile.SaveAs(NewImgPath);
                                }
                            }
                            else
                            {
                                DirectoryInfo di = Directory.CreateDirectory(strPath);
                                httpPostedFile.SaveAs(fileSavePath);
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    return Ok(new BaseResponse(ex.Message));
                }
            }
            return Ok();
        }


        public int GetMax(FileInfo[] Files)
        {
            char[] _ = { '_' };
            char[] _Jpg = { '.' };
            List<int> num = new List<int>();
            foreach (FileInfo file in Files)
            {
                string _Serial = file.Name.Split(_)[1].Split(_Jpg)[0];
                num.Add(int.Parse(_Serial));
            }
            return num.Max();
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetImgCountForCurrentTrNo(string Comp, string Branch, string ModuleCode, string TrNo)
        {
            if (ModelState.IsValid)
            {
                string strPath = GetPath(Comp, Branch, ModuleCode, TrNo, null, true);
                DirectoryInfo d = new DirectoryInfo(strPath);
                FileInfo[] Files = d.GetFiles(TrNo + "_*.Jpg");
                return Ok(new BaseResponse(Files.Count().ToString()));
            }
            return BadRequest();
        }
        //[HttpGet, AllowAnonymous]
        //public IHttpActionResult GetImgListForCurentTrNo(string Comp, string Branch, string ModuleCode, string TrNo)
        //{
        //    if (ModelState.IsValid)
        //    {
        //        string strPath = GetPath(Comp, Branch, ModuleCode, TrNo, null, true);
        //        if (Directory.Exists(strPath))
        //        {
        //            DirectoryInfo d = new DirectoryInfo(strPath);
        //            FileInfo[] Files = d.GetFiles(TrNo + "_*.Jpg");
        //            char[] _ = { '_' };
        //            char[] _Jpg = { '.' };
        //            Dictionary<int, string> dic = new Dictionary<int, string>();
        //            List<string> str = new List<string>();
        //            List<ImgPath> img = new List<ImgPath>();
        //            //List<int> num = new List<int>();
        //            foreach (FileInfo file in Files)
        //            {
        //                using (Image image = Image.FromFile(strPath + file.Name))
        //                {
        //                    using (MemoryStream m = new MemoryStream())
        //                    {
        //                        image.Save(m, image.RawFormat);
        //                        byte[] imageBytes = m.ToArray();

        //                        // Convert byte[] to Base64 String
        //                        string base64String = Convert.ToBase64String(imageBytes);
        //                        //return base64String;
        //                        str.Add("data:image/jpeg;base64," + base64String);
        //                        img.Add(new ImgPath { ID = 0, Name = strPath + file.Name, IncodeImg = "data:image/jpeg;base64," + base64String });
        //                    }
        //                }

        //            }
        //            return Ok(new BaseResponse(img));
        //        }
        //        else
        //        {
        //            BaseResponse res = new BaseResponse();
        //            res.IsSuccess = false;
        //            return Ok(res);
        //        }
        //    }
        //    return BadRequest();
        //}

        [HttpGet, AllowAnonymous]
        public IHttpActionResult DeleteImg(string ImgPath)
        {

            //ImgPath = "C:/inetpub/wwwroot/CloudKids/CloudKidsAPI/image/Comp1/MemDelivPic/24_1.Jpg";
            if (File.Exists(ImgPath))
            {
                File.Delete(ImgPath);
                return Ok(new BaseResponse());

            }
            return BadRequest();
        }

        [HttpGet]
        public string ConvertToGDate(string date)
        {
            try
            {
                string sql = "select dbo.G_Tool_HToGDate('" + date + "')";
                DateTime t = db.Database.SqlQuery<DateTime>(sql).FirstOrDefault();
                return t.ToShortDateString();
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        public string GetHDate(DateTime? GDate)
        {
            if (!GDate.HasValue)
            {
                return "";
            }

            string sqlString;
            string formattedDate = "";
            DateTime lghGDate = new DateTime(); ;
            string monthStamp = "", lghYear = "";
            int counter, ldayh, lmonthh;
            sqlString = "SELECT * FROM dbo.HIJRA_CONVERT WHERE (CONVERT(DATETIME, '" + GDate.Value.ToString("dd/MM/yyyy") + "', 103)>=START_DATE)AND (CONVERT(DATETIME, '" + GDate.Value.ToString("dd/MM/yyyy") + "', 103)-START_DATE)<=360";
            List<HIJRA_CONVERT> Lst = db.Database.SqlQuery<HIJRA_CONVERT>(sqlString).ToList();
            for (int i = 0; i < Lst.Count; i++)
            {
                lghGDate = DateTime.Parse(Lst[i].START_DATE.ToString());
                monthStamp = Lst[i].MONTHSTMAP;
                lghYear = Lst[i].HYEAR.ToString();
            }
            //ldayh = (int)DateAndTime.DateDiff(DateInterval.Day, lghGDate, GDate.Value, FirstDayOfWeek.System, FirstWeekOfYear.System) + 1;

            ldayh = (int)DateAndTime.DateDiff(DateInterval.Day, lghGDate, GDate.Value, FirstDayOfWeek.System, FirstWeekOfYear.System) + 1;


            counter = 0;
            lmonthh = 1;
            do
            {
                try
                {


                    counter = counter + 1;
                    if (monthStamp.Substring(counter - 1, 1) == "1")
                    {
                        if (ldayh > 30)
                        {
                            ldayh = ldayh - 30;
                            lmonthh = lmonthh + 1;
                        }
                        else
                        {
                            formattedDate = string.Format(@"{0}/{1}/{2}", ldayh.ToString().PadLeft(2, '0'), lmonthh.ToString().PadLeft(2, '0'), lghYear.ToString().PadLeft(4, '0'));
                            break;
                        }
                    }
                    else
                    {
                        if (ldayh > 29)
                        {
                            ldayh = ldayh - 29;
                            lmonthh = lmonthh + 1;
                        }
                        else
                        {
                            formattedDate = string.Format(@"{0}/{1}/{2}", ldayh.ToString().PadLeft(2, '0'), lmonthh.ToString().PadLeft(2, '0'), lghYear.ToString().PadLeft(4, '0'));
                            break;
                        }
                    }
                }
                catch (Exception)
                {
                    break;

                    //throw;
                }
            } while (1 == 1);
            return formattedDate;
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetDashboard(int _Type, int comp, int bracode)
        {
            string query = "";

            object res = new object();


            if (_Type == 0)
            {
                query = "exec Iproc_DashOperation " + comp + " ";
                res = db.Database.SqlQuery<Iproc_DashOperation_Result>(query).ToList();

            }
            if (_Type == 1)
            {
                query = "exec Iproc_DashSales " + comp + " ";
                res = db.Database.SqlQuery<IProc_DashSales_Result>(query).ToList();

            }
            if (_Type == 2)
            {
                query = "exec Iproc_DashPurchase " + comp + " ";
                res = db.Database.SqlQuery<Iproc_DashPurchase_Result>(query).ToList();
            }



            return Ok(new BaseResponse(res));

        }


        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetDataCashAndBank(int comp, int bracode)
        {
            string query = "";

            query = "exec IProc_DashAccounts " + comp + " , " + bracode + " ";
            List<IProc_DashAccounts_Result> res = db.Database.SqlQuery<IProc_DashAccounts_Result>(query).ToList();

            return Ok(new BaseResponse(res));

        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetDashBalances()
        {
            string query = "";

            //object res = new object();


            query = @"
                        DECLARE @return_value int,
                                @CustOp numeric(19, 2),
                        		@CustEnd numeric(19, 2),
                        		@VndOp numeric(19, 2),
                        		@VndEnd numeric(19, 2)
                        
                        EXEC @return_value = [dbo].[Iproc_DashBalances]
                        
                                @comp = 3,
                        		@CustOp = @CustOp OUTPUT,
                        		@CustEnd = @CustEnd OUTPUT,
                        		@VndOp = @VndOp OUTPUT,
                        		@VndEnd = @VndEnd OUTPUT
                        
                        SELECT  @CustOp as N'CustOp',
                        		@CustEnd as N'CustEnd',
                        		@VndOp as N'VndOp',
                        		@VndEnd as N'VndEnd'";
            List<DashBalances> res = db.Database.SqlQuery<DashBalances>(query).ToList();


            return Ok(new BaseResponse(res));

        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult InsertLog(string UserCode, string compcode, string BranchCode, string FinYear, string ModuleCode, string TRId)
        {
            try
            {
                LogUser.InsertPrint(db, compcode, BranchCode, FinYear, UserCode, Convert.ToInt32(TRId),"", LogUser.UserLog.print, ModuleCode, true, null, null, null);

                return Ok(new BaseResponse());
            }
            catch (Exception ex)
            {

                return BadRequest();
            }
        }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult InsertLogDoubleClick(string UserCode, string compcode, string BranchCode, string FinYear, string ModuleCode, string TRId , string TrNo)
        {
            try
            {
                LogUser.InsertPrint(db, compcode, BranchCode, FinYear, UserCode, Convert.ToInt32(TRId), TrNo, LogUser.UserLog.Query, ModuleCode, true, null, TrNo, null);

                return Ok(new BaseResponse());
            }
            catch (Exception ex)
            {

                return BadRequest();
            }
        }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult InsertLogOperation(string UserCode, string compcode, string BranchCode, string FinYear, string ModuleCode, string TRId, string ExtraData)
        {
            try
            {
                LogUser.InsertPrint(db, compcode, BranchCode, FinYear, UserCode, Convert.ToInt32(TRId), ExtraData, LogUser.UserLog.print, ModuleCode, true, null, null, ExtraData);

                return Ok(new BaseResponse());
            }
            catch (Exception ex)
            {

                return BadRequest();
            }
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult ViewListLog(string UserCode, string compcode, string BranchCode, string FinYear, string ModuleCode)
        {
            try
            {
                LogUser.InsertPrint(db, compcode, BranchCode, FinYear, UserCode, null, "", LogUser.UserLog.View, ModuleCode, true, null, null, null);
                return Ok(new BaseResponse());
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult UpdateListLog(string UserCode, string compcode, string BranchCode, string FinYear, string ModuleCode)
        {
            try
            {
                LogUser.InsertPrint(db, compcode, BranchCode, FinYear, UserCode, null, "", LogUser.UserLog.UpdateList, ModuleCode, true, null, null, null);
                return Ok(new BaseResponse());
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult PrintliestLog(string UserCode, string compcode, string BranchCode, string FinYear, string ModuleCode)
        {
            try
            {
                LogUser.InsertPrint(db, compcode, BranchCode, FinYear, UserCode, null, "", LogUser.UserLog.PrintList, ModuleCode, true, null, null, null);
                return Ok(new BaseResponse());
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult OpenScreenLog(string UserCode, string compcode, string BranchCode, string FinYear, string ModuleCode)
        {
            try
            {
                LogUser.InsertPrint(db, compcode, BranchCode, FinYear, UserCode, null, "",  LogUser.UserLog.OpenScreen, ModuleCode, true, null, null, null);
                return Ok(new BaseResponse());
            }
            catch (Exception ex)
            {
                LogUser.InsertPrint(db, compcode, BranchCode, FinYear, UserCode, null, "", LogUser.UserLog.OpenScreen, ModuleCode, false, ex.Message, null, null);

                return BadRequest();
            }
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult LoginOpen(string UserCode, string compcode, string BranchCode, string FinYear, string ModuleCode , int InOrOut)
        {
                var TypeLog = LogUser.UserLog.Login;
            try
            {

                if (InOrOut != 1)
                {
                    TypeLog = LogUser.UserLog.Logout;
                }

                LogUser.InsertPrint(db, compcode, BranchCode, FinYear, UserCode, null, "", TypeLog, ModuleCode, true, null, null, null);
                return Ok(new BaseResponse());
            }
            catch (Exception ex)
            {
                LogUser.InsertPrint(db, compcode, BranchCode, FinYear, UserCode, null, "", TypeLog, ModuleCode, false, ex.Message, null, null);

                return BadRequest();
            }
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult SendMessage(int CompCode, string HdMsg, string DetMsg, string ContactMobile, int TrID)
        {
            Sending_Methods SendingMethods = new Sending_Methods();


            string res = "";
            string response = "";



            I_Control IControl = db.I_Control.Where(x => x.CompCode == CompCode).First();


            G_AlertControl cntrl = db.G_AlertControl.Where(x => x.Compcode == CompCode).First();

            //----------------------SMS---------------------//

            if (IControl.SendSMS == true)
            {
                response = SendingMethods.Send_SMS(cntrl.SMS_Provider, cntrl.SMS_UserName, cntrl.SMS_Password, cntrl.EMAIL_SenderName + " " + HdMsg + "\n " + DetMsg, cntrl.SMS_SenderName, cntrl.MobileNoPreFex + "" + ContactMobile.Substring(1, ContactMobile.Length - 1), CompCode);//"966504170785");
                if (response == "لقد تمت العملية بنجاح")
                {
                    G_AlertLog ALertLogSMS = new G_AlertLog
                    {
                        CompCode = CompCode,
                        TrID = TrID,
                        MobileNo = ContactMobile
                    };

                    if (HdMsg.Length < 50)
                    {
                        ALertLogSMS.MsgHeader = HdMsg;
                    }
                    else
                    {
                        ALertLogSMS.MsgHeader = HdMsg.Substring(0, 49); 
                    }
                    ALertLogSMS.MsgBody = DetMsg;
                    ALertLogSMS.AlertType = "1";
                    ALertLogSMS.SendDate = DateTime.Now;
                    ALertLogSMS.IsSent = true;
                    db.G_AlertLog.Add(ALertLogSMS);
                    db.SaveChanges();
                }
                else
                {

                }
            }
            res = response + "\n " + cntrl.SMS_SenderName + "\n " + cntrl.EMAIL_SenderName + " " + HdMsg + "\n " + DetMsg;
            return Ok(new BaseResponse(res));
        }


        [HttpGet, AllowAnonymous]
        public IHttpActionResult Get_Table(string query, string NameTable)
        {

            var res = Get_Model(query, NameTable);
            return Ok(new BaseResponse(res));


        }


        [HttpPost, AllowAnonymous]
        public IHttpActionResult Get_TableNew([FromBody]List<Table> Entity)
        {

            List<object> Res = new List<object>();

            foreach (var item in Entity)
            {
                List<object> Table_Res = new List<object>();
                string query = "";
                object res;
                if (item.IsProc == false || item.IsProc == null)
                {
                    query = "select * from " + item.NameTable + " " + (item.Condition.Trim() == "" ? "" : " Where " + item.Condition);
                      res = Get_Model(query, item.NameTable);

                }
                else
                {
                    query = "" + item.NameTable + " " + (item.Condition);

                    if (item.IsExec == true)
                    {
                        db.Database.ExecuteSqlCommand(" exec " + query + "");
                        res = new List<object>();
                    }
                    else
                    {
                        res = Get_Model(query, item.NameTable + "_Result"); 
                    }

                }


                Table_Res.Add(res);
                Res.AddRange(Table_Res);

            }

            return Ok(new BaseResponse(Res));


        }
         

    }
}