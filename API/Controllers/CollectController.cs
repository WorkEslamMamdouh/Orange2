using Inv.API.Models;
using Inv.API.Tools;
using Inv.BLL.Services.ITRCollect;
using Inv.BLL.Services.ITRCollectDetail;
using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Inv.API.Controllers;
using Inv.API.Models.CustomModel;

namespace Inv.API.Controllers
{
    public class CollectController : BaseController
    {
        private readonly II_TR_CollectService I_TR_CollectService;
        private readonly II_TR_CollectDetailService I_TR_CollectDetailService;
        private readonly G_USERSController UserControl;

        public CollectController(II_TR_CollectService _II_TR_CollectService, G_USERSController _Control,
                                  I_TR_CollectDetailService _I_TR_CollectDetailService)
        {
            this.I_TR_CollectService = _II_TR_CollectService;
            this.I_TR_CollectDetailService = _I_TR_CollectDetailService;
            this.UserControl = _Control;
        }
        public IHttpActionResult GetAll(int compCode, int BranchCode, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var res = I_TR_CollectService.GetAll(s => s.CompCode == compCode && s.BranchCode == BranchCode).ToList();

                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetById(int id, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var obj = I_TR_CollectService.GetById(id);

                return Ok(new BaseResponse(obj));
            }
            return BadRequest(ModelState);
        }


        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllDatabyId(int Id, string UserCode, string Token, int COMP_CODE, int BRA_CODE)
        {
            try
            {
                if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
                {
                    var result = new IQCollectMasterDetails();
                    result.I_TR_Collect = db.I_TR_Collect.Where(x => x.CollectID == Id && x.CompCode == COMP_CODE && x.BranchCode == BRA_CODE).FirstOrDefault();
                    result.IQ_GetCollectDetail = db.IQ_GetCollectDetail.Where(x => x.CollectID == Id).ToList();
                  
                    return Ok(new BaseResponse(result));
                }
                return BadRequest(ModelState);
            }
            catch (Exception ex)
            {
               
                return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
            }
        }



        [HttpPost, AllowAnonymous]
        public IHttpActionResult Insert([FromBody]I_TR_Collect obj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(obj.Token, obj.UserCode))
            {
                try
                {
                    var res = I_TR_CollectService.Insert(obj);
                    return Ok(new BaseResponse(res));
                }
                catch (Exception ex)
                {
                    return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                }
            }
            return BadRequest(ModelState);
        }


        [HttpPost, AllowAnonymous]
        public IHttpActionResult InsertAll([FromBody]ICollectMasterDetails obj)
        {
            if (UserControl.CheckUser(obj.I_TR_Collect.Token, obj.I_TR_Collect.UserCode))
            {
                using (var dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        //***save Collect 
                        var result = I_TR_CollectService.Insert(obj.I_TR_Collect);
                        //*****insert det
                        for (int i = 0; i < obj.I_TR_CollectDetail.Count; i++)
                        {
                            obj.I_TR_CollectDetail[i].CollectID = result.CollectID;
                            obj.I_TR_CollectDetail[i] = I_TR_CollectDetailService.Insert(obj.I_TR_CollectDetail[i]);
                        }
                        //*****Run TransProcess
                        ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(obj.I_TR_Collect.CompCode),Convert.ToInt32(obj.I_TR_Collect.BranchCode), obj.I_TR_Collect.CollectID, "collect", "Add", db);
                        dbTransaction.Commit();
                        return Ok(new BaseResponse(result));
                    }
                    catch (Exception ex)
                    {
                        dbTransaction.Rollback();
                        return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                    }

                }
                
            }
            return Ok(new BaseResponse());
        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult UpdateALL([FromBody]ICollectMasterDetails obj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(obj.I_TR_Collect.Token, obj.I_TR_Collect.UserCode))
            {
                using (var dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        //***save invoice 
                        var result = I_TR_CollectService.Update(obj.I_TR_Collect);
                        //*****update det
                        I_TR_CollectDetailService.UpdateList(obj.I_TR_CollectDetail);
                        //*****Run TransProcess
                        ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(obj.I_TR_Collect.CompCode), Convert.ToInt32(obj.I_TR_Collect.BranchCode), obj.I_TR_Collect.CollectID, "collect", "Update", db);
                        dbTransaction.Commit();
                        return Ok(new BaseResponse(result));
                    }
                    catch (Exception ex)
                    {
                        dbTransaction.Rollback();
                        return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                    }
                }
            }
            return BadRequest(ModelState);
        }
        public IHttpActionResult Delete(int ID, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                try
                {
                    I_TR_CollectService.Delete(ID);
                    return Ok(new BaseResponse());
                }
                catch (Exception ex)
                {
                    return Ok(new BaseResponse(0, "Error"));
                }

            }
            else
            {
                return BadRequest(ModelState);
            }
        }
        [HttpPost, AllowAnonymous]
        public IHttpActionResult Update([FromBody]I_TR_Collect obj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(obj.Token, obj.UserCode))
            {
                try
                {
                    var res = I_TR_CollectService.Update(obj);
                    return Ok(new BaseResponse(res));
                }
                catch (Exception ex)
                {
                    return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                }
            }
            return BadRequest(ModelState);
        }
        [HttpPost, AllowAnonymous]
        public IHttpActionResult UpdateLst(List<I_TR_CollectDetail> CollectDet)
        {
            try
            {
                I_TR_CollectDetailService.UpdateList(CollectDet);
                return Ok(new BaseResponse());
            }
            catch (Exception ex)
            {
                return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
            }
        }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult Search(string condition, string strtdt, string Enddt, string UserCode, string Token)
        {
            try
            {
                if (UserControl.CheckUser(Token, UserCode))
                {
                    if (strtdt != null)
                        condition = condition + " and TrDate>='" + strtdt + "'";
                    if (Enddt != null)
                        condition = condition + " and TrDate<='" + Enddt + "'";
                    string s = "select * from I_TR_Collect where ";
                    s = s + condition;
                    var res = db.Database.SqlQuery<I_TR_Collect>(s).ToList();
                    return Ok(new BaseResponse(res));
                }
            }
            catch (Exception ex)
            {
                return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
            }
            return Ok(new BaseResponse());
        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult Open([FromBody]I_TR_Collect obj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(obj.Token, obj.UserCode))
            {
                using (var dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        //***save  
                        var result = I_TR_CollectService.Update(obj);
                        //*****Run TransProcess
                        ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(obj.CompCode), Convert.ToInt32(obj.BranchCode), obj.CollectID, "collect", "Open", db);
                        dbTransaction.Commit();
                        return Ok(new BaseResponse(result));
                    }
                    catch (Exception ex)
                    {

                        dbTransaction.Rollback();
                      
                        return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                    }
                }
            }
            return BadRequest(ModelState);
        }

    }
}
