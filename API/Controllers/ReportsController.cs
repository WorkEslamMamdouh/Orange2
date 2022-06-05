using Inv.API.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Inv.API.Controllers
{
    public class ReportsController : ApiController
    {

        private SqlConnection con;
        private void connection()
        {
            var SERVER_NAME = ConfigurationManager.AppSettings["ServerName"];
            var USER_NAME = ConfigurationManager.AppSettings["DbUserName"];
            var USER_PASSWORD = ConfigurationManager.AppSettings["DbPassword"];
            var DATABSE_NAME = ConfigurationManager.AppSettings["AbsoluteSysDbName"];


            con = new SqlConnection("Server=" + SERVER_NAME + ";Database=" + DATABSE_NAME + ";User Id=" + USER_NAME + ";Password=" + USER_PASSWORD + ";");

        }
        //[HttpGet, AllowAnonymous]//RSProc_RPT_FnPaymentList قائمة سندات الصرف
        //public IHttpActionResult RSProc_RPT_FnPaymentListData(int CompCode, int BranchCode, string CompNameA, string CompNameE, string FromDt, string ToDt, string FromDtH, string ToDtH, int TrType, int RentType, int CustCode, string BranchNameA, string BranchNameE, int Status, int RepType, string UserCode)
        //{

        //    connection();

        //    SqlCommand com = new SqlCommand("RSProc_RPT_FnPaymentList", con);
        //    com.CommandType = CommandType.StoredProcedure;
        //    com.Parameters.AddWithValue("@comp", CompCode);
        //    com.Parameters.AddWithValue("@bra", BranchCode);
        //    com.Parameters.AddWithValue("@CompNameA", CompNameA);
        //    com.Parameters.AddWithValue("@CompNameE", CompNameE);
        //    com.Parameters.AddWithValue("@LoginUser", UserCode);

        //    if (string.IsNullOrEmpty(BranchNameA) || string.IsNullOrEmpty(BranchNameE))
        //    {

        //        com.Parameters.AddWithValue("@BraNameA", "");
        //        com.Parameters.AddWithValue("@BraNameE", "");
        //    }
        //    else
        //    {

        //        com.Parameters.AddWithValue("@BraNameA", BranchNameA);
        //        com.Parameters.AddWithValue("@BraNameE", BranchNameE);
        //    }
        //    if (TrType == -1)
        //        com.Parameters.AddWithValue("@TrType", DBNull.Value);
        //    else
        //        com.Parameters.AddWithValue("@TrType", TrType);
        //    if (RentType == -1)
        //        com.Parameters.AddWithValue("@RentType", DBNull.Value);
        //    else
        //        com.Parameters.AddWithValue("@RentType", RentType);
        //    if (CustCode == -1)
        //        com.Parameters.AddWithValue("@CustCode", DBNull.Value);
        //    else
        //        com.Parameters.AddWithValue("@CustCode", CustCode);
        //    if (Status == -1)
        //        com.Parameters.AddWithValue("@Status", DBNull.Value);
        //    else
        //        com.Parameters.AddWithValue("@Status", Status);

        //    var from = DateTime.Parse(FromDt);
        //    var to = DateTime.Parse(ToDt);



        //    var xfrom = from.ToString("dd/MM/yyyy");
        //    var xto = to.ToString("dd/MM/yyyy");
        //    com.Parameters.AddWithValue("@FromDate", xfrom);
        //    com.Parameters.AddWithValue("@ToDate", xto);




        //    com.Parameters.AddWithValue("@FromDateH", FromDtH);
        //    com.Parameters.AddWithValue("@ToDateH", ToDtH);

        //    com.Parameters.AddWithValue("@RepType", RepType);


        //    SqlDataAdapter da = new SqlDataAdapter(com);
        //    DataTable dt = new DataTable();
        //    try
        //    {
        //        con.Open();
        //        da.Fill(dt);

        //        con.Close();



        //        return Ok(new BaseResponse(dt));
        //    }
        //    catch (Exception e)
        //    {
        //        con.Close();

        //    }


        //    return BadRequest(ModelState);






        //}

        [HttpGet, AllowAnonymous]//RSProc_RPT_FnPaymentList قائمة سندات الصرف
        public IHttpActionResult TestData(int CompCode, int BranchCode, string Token, string UserCode)
        {

            connection();

            SqlCommand com = new SqlCommand("IQ_GetSalesMan", con);
            com.CommandType = CommandType.TableDirect;
            //com.Parameters.AddWithValue("@comp", CompCode);
            //com.Parameters.AddWithValue("@bra", BranchCode);
            //com.Parameters.AddWithValue("@CompNameA", CompNameA);
            //com.Parameters.AddWithValue("@CompNameE", CompNameE);
            //com.Parameters.AddWithValue("@LoginUser", UserCode);

            //if (string.IsNullOrEmpty(BranchNameA) || string.IsNullOrEmpty(BranchNameE))
            //{

            //    com.Parameters.AddWithValue("@BraNameA", "");
            //    com.Parameters.AddWithValue("@BraNameE", "");
            //}
            //else
            //{

            //    com.Parameters.AddWithValue("@BraNameA", BranchNameA);
            //    com.Parameters.AddWithValue("@BraNameE", BranchNameE);
            //}
            //if (TrType == -1)
            //    com.Parameters.AddWithValue("@TrType", DBNull.Value);
            //else
            //    com.Parameters.AddWithValue("@TrType", TrType);
            //if (RentType == -1)
            //    com.Parameters.AddWithValue("@RentType", DBNull.Value);
            //else
            //    com.Parameters.AddWithValue("@RentType", RentType);
            //if (CustCode == -1)
            //    com.Parameters.AddWithValue("@CustCode", DBNull.Value);
            //else
            //    com.Parameters.AddWithValue("@CustCode", CustCode);
            //if (Status == -1)
            //    com.Parameters.AddWithValue("@Status", DBNull.Value);
            //else
            //    com.Parameters.AddWithValue("@Status", Status);

            //var from = DateTime.Parse(FromDt);
            //var to = DateTime.Parse(ToDt);



            //var xfrom = from.ToString("dd/MM/yyyy");
            //var xto = to.ToString("dd/MM/yyyy");
            //com.Parameters.AddWithValue("@FromDate", xfrom);
            //com.Parameters.AddWithValue("@ToDate", xto);




            //com.Parameters.AddWithValue("@FromDateH", FromDtH);
            //com.Parameters.AddWithValue("@ToDateH", ToDtH);

            //com.Parameters.AddWithValue("@RepType", RepType);


            SqlDataAdapter da = new SqlDataAdapter(com);
            DataTable dt = new DataTable();
            try
            {
                con.Open();
                da.Fill(dt);

                con.Close();



                return Ok(new BaseResponse(dt));
            }
            catch (Exception e)
            {
                con.Close();

            }


            return BadRequest(ModelState);






        }


    }
}
