using Inv.API.Models;
using Inv.API.Models.CustomModel;
using Inv.API.Tools;
using Inv.BLL.Services.AccDefVendor;
using Inv.DAL.Domain;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web.Http;

namespace Inv.API.Controllers
{
    public class AccDefVendorController : BaseController
    {
        private readonly IAccDefVendorService AccDefVendorService;
        private readonly G_USERSController UserControl;

        public AccDefVendorController(IAccDefVendorService _IAccDefVendorService, G_USERSController _Control)
        {
            AccDefVendorService = _IAccDefVendorService;
            UserControl = _Control;
        }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAll(int CompCode, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                List<A_Pay_D_Vendor> AccDefVendorList = AccDefVendorService.GetAll(x => x.CompCode == CompCode).ToList();
                return Ok(new BaseResponse(AccDefVendorList));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllVendorType(int CompCode, int VendorType, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                List<A_Pay_D_Vendor> AccDefVendorList = AccDefVendorService.GetAll(x => x.CompCode == CompCode && x.VendorType == VendorType).ToList();
                return Ok(new BaseResponse(AccDefVendorList));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetFiltered(int CompCode, int? Catid, int? Groupid, int? CreditType, int? VendorType, string BalType, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                string s = "select * from IQ_GetVendor where CompCode = " + CompCode;
                string condition = "";
                if (Catid != 0)
                {
                    condition = condition + " and CatID =" + Catid;
                }

                if (Groupid != 0)
                {
                    condition = condition + " and GroupId =" + Groupid;
                }

                if (CreditType != 2)
                {
                    condition = condition + " and IsCreditVendor =" + CreditType;
                }

                if (VendorType != 0)
                {
                    condition = condition + " and VendorType =" + VendorType;
                }

                if (BalType != "All")
                {
                    if (BalType == ">")
                    {
                        condition = condition + " and Balance > 0 ";
                    }
                    if (BalType == "=")
                    {
                        condition = condition + " and Balance = 0 ";
                    }
                    if (BalType == "<")
                    {
                        condition = condition + " and Balance < 0 ";
                    }

                }
                string query = s + condition;

                List<IQ_GetVendor> res = db.Database.SqlQuery<IQ_GetVendor>(query).ToList();
                List<AQ_GetVendorDoc> res2 = db.AQ_GetVendorDoc.ToList();

                IQVendorMasterDetail model = new IQVendorMasterDetail
                {
                    IQ_GetVendor = res,
                    AQ_GetVendorDoc = res2
                };
                return Ok(new BaseResponse(model));
            }
            return BadRequest(ModelState);

        }


        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetById(int id, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                A_Pay_D_Vendor AccDefVendor = AccDefVendorService.GetById(id);

                return Ok(new BaseResponse(AccDefVendor));
            }
            return BadRequest(ModelState);
        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult Insert([FromBody]VendorMasterDetail obj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(obj.Token, obj.UserCode))
            {
                try
                {
                    using (System.Data.Entity.DbContextTransaction dbTransaction = db.Database.BeginTransaction())
                    {
                        A_Pay_D_Vendor AccDefVen = AccDefVendorService.Insert(obj.A_Pay_D_Vendor);
                        foreach (A_Pay_D_VendorDoc item in obj.A_Pay_D_VendorDoc)
                        {
                            item.VendorId = AccDefVen.VendorID;
                            AccDefVendorService.Insert(item);
                            LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, item.VendorDocID, LogUser.UserLog.Insert, obj.MODULE_CODE, true, null, null, null);

                        }

                        ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(AccDefVen.CompCode), 0, AccDefVen.VendorID, "VendDef", "Add", db);
                        if (res.ResponseState == true)
                        {
                            dbTransaction.Commit();
                            LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.A_Pay_D_Vendor.VendorID, LogUser.UserLog.Insert, obj.MODULE_CODE, true, null, null, null);
                            return Ok(new BaseResponse(obj.A_Pay_D_Vendor));
                        }
                        else
                        {
                            dbTransaction.Rollback();
                            LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.A_Pay_D_Vendor.VendorID, LogUser.UserLog.Insert, obj.MODULE_CODE, false, res.ResponseMessage.ToString(), null, null);
                            return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, res.ResponseMessage));
                        }
                    }
                }
                catch (Exception ex)
                {
                    LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.A_Pay_D_Vendor.VendorID, LogUser.UserLog.Insert, obj.MODULE_CODE, false, ex.Message.ToString(), null, null);
                    return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                }
            }
            return BadRequest(ModelState);
        }


        [HttpPost, AllowAnonymous]
        public IHttpActionResult Update([FromBody]VendorMasterDetail obj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(obj.Token, obj.UserCode))
            {
                try
                {
                    using (System.Data.Entity.DbContextTransaction dbTransaction = db.Database.BeginTransaction())
                    {

                        A_Pay_D_Vendor AccDefVen = AccDefVendorService.Update(obj.A_Pay_D_Vendor);
                        LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, AccDefVen.VendorID, LogUser.UserLog.Update, obj.MODULE_CODE, true, null, null, null);

                        //update Details
                        List<A_Pay_D_VendorDoc> insertedObjects = obj.A_Pay_D_VendorDoc.Where(x => x.StatusFlag == 'i').ToList();
                        List<A_Pay_D_VendorDoc> updatedObjects = obj.A_Pay_D_VendorDoc.Where(x => x.StatusFlag == 'u').ToList();
                        List<A_Pay_D_VendorDoc> deletedObjects = obj.A_Pay_D_VendorDoc.Where(x => x.StatusFlag == 'd').ToList();

                        foreach (A_Pay_D_VendorDoc item in insertedObjects)
                        {
                            item.VendorId = obj.A_Pay_D_Vendor.VendorID;
                            AccDefVendorService.Insert(item);
                            LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, item.VendorDocID, LogUser.UserLog.Insert, obj.MODULE_CODE, true, null, null, "VendorDocID");
                        }
                        foreach (A_Pay_D_VendorDoc item in updatedObjects)
                        {
                            item.VendorId = obj.A_Pay_D_Vendor.VendorID;
                            AccDefVendorService.Update(item);
                            LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, item.VendorDocID, LogUser.UserLog.Update, obj.MODULE_CODE, true, null, null, "VendorDocID");
                        }
                        foreach (A_Pay_D_VendorDoc item in deletedObjects)
                        {
                            AccDefVendorService.Delete(item.VendorDocID);
                            LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, item.VendorDocID, LogUser.UserLog.Delete, obj.MODULE_CODE, true, null, null, "VendorDocID");
                        }



                        ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(AccDefVen.CompCode), 0, AccDefVen.VendorID, "VendDef", "Update", db);
                        if (res.ResponseState == true)
                        {
                            dbTransaction.Commit();
                            LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.A_Pay_D_Vendor.VendorID, LogUser.UserLog.Update, obj.MODULE_CODE, true, null, null, null);
                            return Ok(new BaseResponse(obj.A_Pay_D_Vendor));
                        }
                        else
                        {
                            dbTransaction.Rollback();
                            LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.A_Pay_D_Vendor.VendorID, LogUser.UserLog.Update, obj.MODULE_CODE, false, res.ResponseMessage.ToString(), null, null);
                            return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, res.ResponseMessage));
                        }
                    }


                }
                catch (Exception ex)
                {
                    LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.A_Pay_D_Vendor.VendorID, LogUser.UserLog.Update, obj.MODULE_CODE, true, null, null, "VendorDocID");
                    return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                }
            }
            return BadRequest(ModelState);
        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult UpdateLst(List<A_Pay_D_Vendor> AccDefVendorList)
        {
            try
            {
                AccDefVendorService.UpdateList(AccDefVendorList);
                return Ok(new BaseResponse());
            }
            catch (Exception ex)
            {
                return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
            }
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult CodeFounBefore(string code, int compCode, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                List<A_Pay_D_Vendor> AccDefVendor = AccDefVendorService.GetAll(x => x.CompCode == compCode && x.VendorCode == code);

                return Ok(new BaseResponse(AccDefVendor));
            }
            return BadRequest(ModelState);
        }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllWithCreditType(int CompCode, bool isCredit, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                List<A_Pay_D_Vendor> AccDefCustomerList = AccDefVendorService.GetAll(x => x.CompCode == CompCode && x.IsCreditVendor == isCredit).ToList();

                return Ok(new BaseResponse(AccDefCustomerList));
            }
            return BadRequest(ModelState);
        }

        // Currency
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllCurrency(string UserCode, string Token)
        {
            if (ModelState.IsValid /*&& UserControl.CheckUser(Token, UserCode)*/)
            {
                List<G_Currency> AccDefCustomerList = db.G_Currency.ToList();

                return Ok(new BaseResponse(AccDefCustomerList));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetVendorByvndId_code(int Compcode, bool code, string VendorID, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                string s = "";
                if (code == false)
                {
                    s = "select * from  A_Pay_D_Vendor  where VendorID = " + VendorID;
                }
                else
                {
                    s = "select * from  A_Pay_D_Vendor  where VendorCode =  '" + VendorID + "' and CompCode = " + Compcode;
                }
                try
                {
                    string query = s;
                    List<A_Pay_D_Vendor> res = db.Database.SqlQuery<A_Pay_D_Vendor>(query).ToList();
                    return Ok(new BaseResponse(res));

                }
                catch (Exception)
                {

                    throw;
                }

            }
            return BadRequest(ModelState);

        }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetBycode(int Compcode, string code, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {

                string query = "select * from  IQ_GetVendor  where VendorCode = " + code + "and CompCode = " + Compcode;
                IQ_GetVendor res = db.Database.SqlQuery<IQ_GetVendor>(query).FirstOrDefault();
                return Ok(new BaseResponse(res));

            }
            return BadRequest(ModelState);

        }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetVendorById(int id, string UserCode, string Token)
        {

            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                string query = "select * from  IQ_GetVendor  where VendorID = " + id;
                IQ_GetVendor res = db.Database.SqlQuery<IQ_GetVendor>(query).FirstOrDefault();
                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetA_G_Vendor(string query ,string NameTable)
        {

            var res = Get_Model(query, NameTable);
            return Ok(new BaseResponse(res));
              

        }



    }
}
