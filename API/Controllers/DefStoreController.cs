using Inv.API.Models;
using Inv.API.Tools;
using Inv.BLL.Services.DefStoree;
using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web.Http;

namespace Inv.API.Controllers
{
    public class DefStoreController : BaseController
    {
        private readonly IDefStoreService DefStoreService;
        private readonly G_USERSController UserControl;

        public DefStoreController(IDefStoreService _IDefStoreService, G_USERSController _Control)
        {
            DefStoreService = _IDefStoreService;
            UserControl = _Control;
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAll(int CompCode, int BranchCode, string UserCode, string Token)
        {
            //if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            //{
            List<GQ_GetStore> AccDefCustomerList = DefStoreService.GetAll(x => x.COMP_CODE == CompCode && x.BRA_CODE == BranchCode).ToList();

            return Ok(new BaseResponse(AccDefCustomerList));
            //}
            //return BadRequest(ModelState);
        }


        //public IHttpActionResult GetAllbycomp(int CompCode, string UserCode, string Token)
        //{
        //    if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
        //    {
        //        var AccDefCustomerList = DefStoreService.GetAll(x => x.COMP_CODE == CompCode).ToList();

        //        return Ok(new BaseResponse(AccDefCustomerList));
        //    }
        //    return BadRequest(ModelState);
        //}

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetById(int id, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                GQ_GetStore AccDefCustomer = DefStoreService.GetById(id);

                return Ok(new BaseResponse(AccDefCustomer));
            }
            return BadRequest(ModelState);
        }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult Update(int BRA_CODE, int STORE_CODE, string DescA, string DescL, string Tel1, string Tel2, string Address, string Remarks, string UpdatedBy)
        {
            string query = "UPDATE G_STORE SET    DescA= '" + DescA + "',DescL='" + DescL + "',Tel1 ='" + Tel1 + "', Tel2='" + Tel2 + "', Address ='" + Address + "' ,Remarks= '" + Remarks + "',UpdatedBy='" + UpdatedBy + "' WHERE STORE_CODE = " + STORE_CODE + " and BRA_CODE= " + BRA_CODE + "";




            //if (ModelState.IsValid && UserControl.CheckUser(AccTrReceipt.Token, AccTrReceipt.UserCode))
            //{
            //var res = DefStoreService.Update(AccTrReceipt);
            db.Database.ExecuteSqlCommand(query);
            return Ok(new BaseResponse(STORE_CODE));

            //}
            //return BadRequest(ModelState);
        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult Update([FromBody]G_STORE STORE)
        {
            //if (ModelState.IsValid && UserControl.CheckUser(AccTrReceipt.Token, AccTrReceipt.UserCode))
            //{
            G_STORE res = DefStoreService.Update(STORE);
            LogUser.InsertPrint(db, STORE.Comp_Code.ToString(), STORE.Branch_Code, STORE.sec_FinYear, STORE.UserCode, res.StoreId, res.STORE_CODE.ToString(), LogUser.UserLog.Update, STORE.MODULE_CODE, true, null, null, res.DescA);

            return Ok(new BaseResponse(res.StoreId));

            //}
            //return BadRequest(ModelState);
        }
        [HttpPost, AllowAnonymous]
        public IHttpActionResult Insert([FromBody]G_STORE obj)
        {
            using (System.Data.Entity.DbContextTransaction dbTransaction = db.Database.BeginTransaction())
            {
                try
                {
                    G_STORE result = DefStoreService.Insert(obj);

                    ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(obj.Comp_Code), Convert.ToInt32(obj.Branch_Code), result.StoreId, "Store", "Add", db);
                    if (res.ResponseState == true)
                    {
                        obj.STORE_CODE = int.Parse(res.ResponseData.ToString());
                        dbTransaction.Commit();

                        LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, result.StoreId,result.STORE_CODE.ToString(), LogUser.UserLog.Insert, obj.MODULE_CODE, true, null, null, result.DescA);

                        return Ok(new BaseResponse(obj));
                    }
                    else
                    {
                        dbTransaction.Rollback();
                        LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, result.StoreId, result.STORE_CODE.ToString(), LogUser.UserLog.Insert, obj.MODULE_CODE, true, null, null, result.DescA);

                        return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, res.ResponseMessage));
                    }
                }
                catch (Exception ex)
                {
                    dbTransaction.Rollback();
                    LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, null, null, LogUser.UserLog.Insert, obj.MODULE_CODE, true, null, null, null);

                    return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                }
            }

        }
    }
}
