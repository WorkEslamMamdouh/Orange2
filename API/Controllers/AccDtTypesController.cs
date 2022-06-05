using Inv.API.Models;
using Inv.API.Tools;
using Inv.BLL.Services.AccDtTypes;
using Inv.BLL.Services.AccDtCostCenters;
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
    

    public class AccDtTypesController : BaseController

    {
        private readonly IA_CCDT_TypesService A_CCDT_TypesService;
        private readonly IA_CCDT_COSTCENTERSService A_CCDT_COSTCENTERSService;
        private readonly G_USERSController UserControl;
        public AccDtTypesController(IA_CCDT_TypesService _A_CCDT_TypesService, G_USERSController _Control,
                                    IA_CCDT_COSTCENTERSService _A_CCDT_COSTCENTERSService)
        {
            this.A_CCDT_TypesService = _A_CCDT_TypesService;
            this.A_CCDT_COSTCENTERSService = _A_CCDT_COSTCENTERSService;
            this.UserControl = _Control;
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAll(string UserCode, string Token, int CompCode)
        {
            if (ModelState.IsValid)
            {
                var res = A_CCDT_TypesService.GetAll().Where(x=>x.COMP_CODE==CompCode).ToList();

                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetById(int id, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var res = A_CCDT_TypesService.GetById(id);

                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }


        [HttpPost, AllowAnonymous]
        public IHttpActionResult Insert([FromBody]A_CCDT_Types obj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(obj.Token, obj.UserCode))
            {
                try
                {
                    var res = A_CCDT_TypesService.Insert(obj);
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
        public IHttpActionResult InsertAll([FromBody]Account_CCDT_CCDTTP_MasterDetails obj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(obj.A_CCDT_Types.Token, obj.A_CCDT_Types.UserCode))
            {
                using (var dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        var res = A_CCDT_TypesService.Insert(obj.A_CCDT_Types);
                        obj.A_CCDT_Types = res;
                        //update Account
                        string Query = "";
                        for (int i = 0; i < obj.A_ACCOUNT.Count; i++)
                        {
                            obj.A_ACCOUNT[i].CCDT_TYPE = res.CCDT_TYPE;
                            Query = "update A_ACCOUNT set CCDT_TYPE = " + res.CCDT_TYPE + " where ACC_CODE='" + obj.A_ACCOUNT[i].ACC_CODE + "'and COMP_CODE=" + obj.A_ACCOUNT[i].COMP_CODE;
                            db.Database.ExecuteSqlCommand(Query);
                        }
                        //update CCDT
                        for (int i = 0; i < obj.A_CCDT_COSTCENTERS.Count; i++)
                        {
                            obj.A_CCDT_COSTCENTERS[i].CCDT_TYPE = res.CCDT_TYPE;
                            A_CCDT_COSTCENTERSService.Update(obj.A_CCDT_COSTCENTERS[i]);
                        }
                        dbTransaction.Commit();
                        return Ok(new BaseResponse(obj));
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

        [HttpPost, AllowAnonymous]
        public IHttpActionResult UpdateAll([FromBody]Account_CCDT_CCDTTP_MasterDetails obj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(obj.A_CCDT_Types.Token, obj.A_CCDT_Types.UserCode))
            {
                using (var dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        //****Update A_CCDT_Types
                        string Query = "update A_CCDT_Types set DescA = '" + obj.A_CCDT_Types.DescA + "',DescE='" + obj.A_CCDT_Types.DescE + "',Remarks='" + obj.A_CCDT_Types.Remarks + "'" +
                                                    " where CCDT_TYPE='" + obj.A_CCDT_Types.CCDT_TYPE + "' and COMP_CODE=" + obj.A_CCDT_Types.COMP_CODE;
                        db.Database.ExecuteSqlCommand(Query);
                        //****update Account
                        var OldAccount = db.A_ACCOUNT.Where(x => x.CCDT_TYPE == obj.A_CCDT_Types.CCDT_TYPE && x.COMP_CODE == obj.A_CCDT_Types.COMP_CODE).ToList();
                        var CurrentAccount = obj.A_ACCOUNT;
                        for (int i = 0; i < CurrentAccount.Count; i++)
                        {
                            obj.A_ACCOUNT[i].CCDT_TYPE = obj.A_CCDT_Types.CCDT_TYPE;
                            Query = "update A_ACCOUNT set CCDT_TYPE = '" + obj.A_CCDT_Types.CCDT_TYPE + "' where ACC_CODE='" + obj.A_ACCOUNT[i].ACC_CODE + "'";
                            db.Database.ExecuteSqlCommand(Query);
                        }
                        int count = 0;
                        //***all old data that not in new List ,CCDT_tp value = null
                        for (int i = 0; i < OldAccount.Count; i++)
                        {
                            count = CurrentAccount.Where(x => x.ACC_CODE == OldAccount[i].ACC_CODE).ToList().Count;
                            if (count == 0)
                            {
                                OldAccount[i].CCDT_TYPE = null;
                                Query = "update A_ACCOUNT set CCDT_TYPE = null where ACC_CODE='" + OldAccount[i].ACC_CODE + "'";
                                db.Database.ExecuteSqlCommand(Query);
                            }
                        }
                        //**********************update CCDT*****************************
                        var OldCCDt = A_CCDT_COSTCENTERSService.GetAll(x => x.CCDT_TYPE == obj.A_CCDT_Types.CCDT_TYPE).ToList();
                        var CurrentCCDt = obj.A_CCDT_COSTCENTERS;
                        for (int i = 0; i < CurrentCCDt.Count; i++)
                        {
                            obj.A_CCDT_COSTCENTERS[i].CCDT_TYPE = obj.A_CCDT_Types.CCDT_TYPE;
                            Query = "update A_CCDT_COSTCENTERS set CCDT_TYPE = '" + obj.A_CCDT_Types.CCDT_TYPE + "' where CCDT_CODE='" + obj.A_CCDT_COSTCENTERS[i].CCDT_CODE + "'";
                            db.Database.ExecuteSqlCommand(Query);
                        }
                        //***all old data that not in new List ,CCDT value = null
                        for (int i = 0; i < OldCCDt.Count; i++)
                        {
                            count = CurrentCCDt.Where(x => x.CCDT_CODE == OldCCDt[i].CCDT_CODE).ToList().Count;
                            if (count == 0)
                            {
                                OldCCDt[i].CCDT_TYPE = null;
                                Query = "update A_CCDT_COSTCENTERS set CCDT_TYPE = null where CCDT_CODE='" + OldCCDt[i].CCDT_CODE + "'";
                                db.Database.ExecuteSqlCommand(Query);
                            }
                        }
                        db.SaveChanges();
                        dbTransaction.Commit();
                        return Ok(new BaseResponse(obj));
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

        [HttpPost, AllowAnonymous]
        public IHttpActionResult UpdateAccount([FromBody]List<A_ACCOUNT> CurrentAccount)
        {
            if (ModelState.IsValid && UserControl.CheckUser(CurrentAccount[0].Token, CurrentAccount[0].UserCode))
            {
                using (var dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        string CCDT_TYPE = CurrentAccount[0].CCDT_TYPE;
                        int compcode = CurrentAccount[0].COMP_CODE;
                        string Query = "";
                       //****update Account
                       var OldAccount = db.A_ACCOUNT.Where(x => x.CCDT_TYPE == CCDT_TYPE && x.COMP_CODE == compcode).ToList();
                        for (int i = 0; i < CurrentAccount.Count; i++)
                        {
                            Query = "update A_ACCOUNT set CCDT_TYPE = '" + CurrentAccount[i].CCDT_TYPE + "' where ACC_CODE='" + CurrentAccount[i].ACC_CODE + "'";
                            db.Database.ExecuteSqlCommand(Query);
                        }
                        int count = 0;
                        //***all old data that not in new List ,CCDT_tp value = null
                        for (int i = 0; i < OldAccount.Count; i++)
                        {
                            count = CurrentAccount.Where(x => x.ACC_CODE == OldAccount[i].ACC_CODE).ToList().Count;
                            if (count == 0)
                            {
                                OldAccount[i].CCDT_TYPE = null;
                                Query = "update A_ACCOUNT set CCDT_TYPE = null where ACC_CODE='" + OldAccount[i].ACC_CODE + "'";
                                db.Database.ExecuteSqlCommand(Query);
                            }
                        }
                        db.SaveChanges();
                        dbTransaction.Commit();
                        return Ok(new BaseResponse(CurrentAccount));
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

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAll_by_CCDT_TYPE(string UserCode, string Token, string CCDT_TYPE)
        {
            if (ModelState.IsValid)
            {
                var MasterDet = new Account_CCDT_CCDTTP_MasterDetails();
                MasterDet.A_CCDT_Types = db.A_CCDT_Types.Where(x=>x.CCDT_TYPE== CCDT_TYPE).FirstOrDefault();
                MasterDet.A_CCDT_COSTCENTERS = db.A_CCDT_COSTCENTERS.Where(x => x.CCDT_TYPE == CCDT_TYPE).ToList();
                MasterDet.A_ACCOUNT = db.A_ACCOUNT.Where(x => x.CCDT_TYPE == CCDT_TYPE && x.COMP_CODE== MasterDet.A_CCDT_Types.COMP_CODE && x.DETAIL==true).ToList();
                return Ok(new BaseResponse(MasterDet));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult DeleteAll([FromBody]Account_CCDT_CCDTTP_MasterDetails obj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(obj.A_CCDT_Types.Token, obj.A_CCDT_Types.UserCode))
            {
                using (var dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        var res = A_CCDT_TypesService.Insert(obj.A_CCDT_Types);
                        obj.A_CCDT_Types = res;
                        //update Account
                        string Query = "";
                        for (int i = 0; i < obj.A_ACCOUNT.Count; i++)
                        {
                            obj.A_ACCOUNT[i].CCDT_TYPE = res.CCDT_TYPE;
                            Query = "update A_ACCOUNT set CCDT_TYPE = " + null + " where ACC_CODE='" + obj.A_ACCOUNT[i].ACC_CODE + "'and COMP_CODE=" + obj.A_ACCOUNT[i].COMP_CODE;
                            db.Database.ExecuteSqlCommand(Query);
                        }
                        //update CCDT
                        for (int i = 0; i < obj.A_CCDT_COSTCENTERS.Count; i++)
                        {
                            obj.A_CCDT_COSTCENTERS[i].CCDT_TYPE = null;
                            A_CCDT_COSTCENTERSService.Update(obj.A_CCDT_COSTCENTERS[i]);
                        }
                        //Delete CCDt type
                        A_CCDT_TypesService.Delete(obj.A_CCDT_Types);
                        dbTransaction.Commit();
                        return Ok(new BaseResponse(obj));
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

        [HttpGet, AllowAnonymous]
        public IHttpActionResult Delete(int ID, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                try
                {
                    A_CCDT_TypesService.Delete(ID);
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

        [HttpGet, AllowAnonymous]
        public IHttpActionResult ExecuteAccountQry(string Query, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                try
                {
                    var res= db.Database.SqlQuery<A_ACCOUNT>(Query).ToList();
                    return Ok(new BaseResponse(res));
                }
                catch (Exception ex)
                {
                    return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                }
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult ExecuteAccountCommand(string Query, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                try
                {
                    var res = db.Database.ExecuteSqlCommand(Query);
                    return Ok(new BaseResponse(res));
                }
                catch (Exception ex)
                {
                    return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                }
            }
            return BadRequest(ModelState);
        }



    }
}