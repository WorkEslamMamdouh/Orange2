//using Newtonsoft.Json;
//using Newtonsoft.Json.Linq;
using Inv.API.Models;
using Inv.API.Tools;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Web.Configuration;
using System.Web.Http;
using System.Collections.Specialized;
using System.Reflection;
using System.Data.Entity.Core.EntityClient;
using System.Xml;
using System.Web;
using System.Threading.Tasks;
using Inv.DAL.Domain;
using Security;
using System.Data.Entity;
using System.Text;
using System.Net.Http.Formatting;
using System.Data.Entity.Core.Objects;
using System.IO;
using System.Drawing;
using Inv.API.Models.CustomEntities;
using Microsoft.VisualBasic;
using QRCoder;

namespace Inv.API.Controllers
{
    public class LogUser
    {
        //    public static enum
        public enum UserLog
        {
            Login = 1,
            Logout = 3,
            Insert = 10,
            Update = 11,
            Delete = 12,
            UpdateList = 13,
            Query = 20,
            print = 21,
            Open= 22,
            AllSuccess = 23,
            OpenScreen = 5
        }
        public enum PageName
        {
            DirectTransfer,
            SlsTrSalesManager,
            Sales_Services,
            Ser_Return_Sales,
            Ser_Purchasing,
            Invoice,
            InvoiceReturn,
            Customer,
            PurOrder,
            PurTrReceive,
            PurTrReturn,
            AccDefCustomer,
            StkDefUnitGroup,
            StkDefItemsNew,
            DefStore,
            StkDefItemType,
            AccTrReceiptNote,
            AccTrCustomerAdjust,
            AccDefVendor,
            GenDefVendorCat,
            GenDefGroup,
            AccTrVendorAdjust,
            TranPosting,
            ID_Uom,
            User

        }
        public static void Insert(InvEntities _db, string COMP_CODE, string BranchCode, string FinYear, string USER_CODE,
        int? DataId, UserLog OperationId, PageName PageName, bool ISSucceed, string ErrorMessage, string ErrorNo, string Info)
        {
            try
            {

                string dateValue = DateTime.Now.ToString("dd-MM-yyyy hh:mm:ss");

                string sql = @"INSERT INTO  G_USER_LOG( USER_CODE, SYSTEM_CODE, COMP_CODE, BranchCode, FinYear, TimeStamp, MODULE_CODE, OperationId, DataID, ISSucceed, ErrorMessage, ExtraData) 
                            VALUES ('" + USER_CODE + "','I' ," + Convert.ToInt32(COMP_CODE) + "," + Convert.ToInt32(BranchCode) + ", " + short.Parse(FinYear) + ",'" + dateValue + "' ," + @"
                                   '" + PageName + "','" + Convert.ToByte(OperationId) + "', '" + DataId + "' ,'" + ISSucceed + "', '" + ErrorMessage + "' , '') ";

                _db.Database.ExecuteSqlCommand(sql);
                //G_USER_LOG obj = new G_USER_LOG();

                //obj.COMP_CODE = Convert.ToInt32(COMP_CODE);
                //obj.BranchCode = Convert.ToInt32(BranchCode);
                //obj.FinYear = short.Parse(FinYear);
                //obj.USER_CODE = USER_CODE;

                ////***const
                //obj.SYSTEM_CODE = "I";
                //obj.TimeStamp = DateTime.Now;
                //obj.ExtraData = Info;

                ////***Data
                //obj.DataID = DataId;
                //obj.ErrorMessage = ErrorMessage;
                ////obj.ErrorNo = ErrorNo;
                //obj.ISSucceed = ISSucceed;
                //obj.MODULE_CODE = PageName.ToString();
                //obj.OperationId = Convert.ToByte(OperationId);//G Code  ()
                //_db.G_USER_LOG.Add(obj);
                //_db.SaveChanges();
                return;
            }
            catch (Exception ex)
            {
                var m = ex.Message;
                return;
            }
        }

        public static void InsertPrint(InvEntities _db, string COMP_CODE, string BranchCode, string FinYear, string USER_CODE,
       int? DataId, UserLog OperationId, string ModuleCode, bool ISSucceed, string ErrorMessage, string ErrorNo, string Info)
        {
            try
            {
                string dateValue = DateTime.Now.ToString("dd-MM-yyyy hh:mm:ss");

                string sql = @"INSERT INTO  G_USER_LOG( USER_CODE, SYSTEM_CODE, COMP_CODE, BranchCode, FinYear, TimeStamp, MODULE_CODE, OperationId, DataID, ISSucceed, ErrorMessage, ExtraData) 
                            VALUES ('" + USER_CODE + "','I' ," + Convert.ToInt32(COMP_CODE) + "," + Convert.ToInt32(BranchCode) + ", " + short.Parse(FinYear) + ",'" + dateValue + "' ," + @"
                                   '" + ModuleCode + "','" + Convert.ToByte(OperationId) + "', '" + DataId + "' ,'" + ISSucceed + "', '" + ErrorMessage + "' , '') ";

                _db.Database.ExecuteSqlCommand(sql);

                //G_USER_LOG obj = new G_USER_LOG();
                ////***const
                //obj.SYSTEM_CODE = "I";

                //obj.TimeStamp = DateTime.Now;
                //obj.ExtraData = Info;
                ////***session
                //obj.COMP_CODE = Convert.ToInt32(COMP_CODE);
                //obj.BranchCode = Convert.ToInt32(BranchCode);
                //obj.FinYear = short.Parse(FinYear);
                //obj.USER_CODE = USER_CODE;
                ////***
                //obj.DataID = DataId;
                //obj.ErrorMessage = ErrorMessage;
                ////obj.ErrorNo = ErrorNo;
                //obj.ISSucceed = ISSucceed;
                //obj.MODULE_CODE = ModuleCode;
                // obj.OperationId = Convert.ToByte(OperationId);//G Code  ()
                //_db.G_USER_LOG.Add(obj);
                //_db.SaveChanges();
                return;
            }
            catch (Exception ex)
            {
                var m = ex.Message;
                return;
            }
        }

        
    }
}