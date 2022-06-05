using Inv.API.Models;
using Inv.API.Tools;
using Inv.BLL.Services.GCostCenter;
using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Inv.API.Controllers;


namespace Inv.API.Controllers
{
    public class CostCenterController : BaseController
    {
        private readonly IGCostCenterService GCostCenterService;
        private readonly G_USERSController UserControl;

        public CostCenterController(IGCostCenterService _IGCostCenterService, G_USERSController _Control)
        {
            this.GCostCenterService = _IGCostCenterService;
            this.UserControl = _Control;
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAll(int CompCode, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var COSTCENTERList = GCostCenterService.GetAll(x => x.COMP_CODE == CompCode).ToList();

                return Ok(new BaseResponse(COSTCENTERList));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetById(int id, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var COSTCENTER = GCostCenterService.GetById(id);

                return Ok(new BaseResponse(COSTCENTER));
            }
            return BadRequest(ModelState);
        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult Insert([FromBody]G_COST_CENTER COSTCENTER)
        {
            if (ModelState.IsValid && UserControl.CheckUser(COSTCENTER.Token, COSTCENTER.UserCode))
            {
                try
                {
                    var AccDefAcc = GCostCenterService.Insert(COSTCENTER);
                    return Ok(new BaseResponse(AccDefAcc));
                }
                catch (Exception ex)
                {
                    return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
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
                    GCostCenterService.Delete(ID);
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
        public IHttpActionResult Update([FromBody]G_COST_CENTER COSTCENTER)
        {
            if (ModelState.IsValid && UserControl.CheckUser(COSTCENTER.Token, COSTCENTER.UserCode))
            {
                try
                {
                    var AccDefAcc = GCostCenterService.Update(COSTCENTER);
                    return Ok(new BaseResponse(AccDefAcc));
                }
                catch (Exception ex)
                {
                    return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                }
            }
            return BadRequest(ModelState);
        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult UpdateLst(List<G_COST_CENTER> COSTCENTER)
        {
            try
            {
                GCostCenterService.UpdateList(COSTCENTER);
                return Ok(new BaseResponse());
            }
            catch (Exception ex)
            {
                return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
            }
        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult UpdateGenralAcclist(List<G_COST_CENTER> COST_CENTER_List)
        {

            if (ModelState.IsValid && UserControl.CheckUser(COST_CENTER_List[0].Token, COST_CENTER_List[0].UserCode))
            {
                using (var dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        var insertedRecords = COST_CENTER_List.Where(x => x.StatusFlag == 'i').ToList();
                        var updatedRecords = COST_CENTER_List.Where(x => x.StatusFlag == 'u').ToList();
                        var deletedRecords = COST_CENTER_List.Where(x => x.StatusFlag == 'd').ToList();
                        ResponseResult res = new ResponseResult();
                        //loop insered 
                        foreach (var item in insertedRecords)
                        {
                            
                            var InsertedRec = GCostCenterService.Insert(item);
                            if (item.CC_PARENT != null)
                            {
                                var item2 = GCostCenterService.GetAll(s => s.COMP_CODE == item.COMP_CODE && s.CC_CODE == item.CC_PARENT);
                                foreach (var item3 in item2)
                                {
                                    item3.LEAF = false;
                                    GCostCenterService.Update(item3);
                                }
                            }


                        }

                        //loop Update 
                        foreach (var item in updatedRecords)
                        {                            
                            var updatedRec = GCostCenterService.Update(item);
                            
                        }

                        //loop Delete 
                        foreach (var item in deletedRecords)
                        {



                            if (item.CC_PARENT != null)
                            {
                                var CH_DETAIL = GCostCenterService.GetAll(x => x.COMP_CODE == item.COMP_CODE && x.CC_PARENT == item.CC_PARENT);

                                if (CH_DETAIL.Count == 1)
                                {
                                    var item2 = GCostCenterService.GetAll(s => s.COMP_CODE == item.COMP_CODE && s.CC_CODE == item.CC_PARENT);
                                    foreach (var item3 in item2)
                                    {
                                        item3.LEAF = true;
                                        GCostCenterService.Update(item3);
                                    }
                                }

                            }

                            string Q = "DELETE FROM G_COST_CENTER WHERE COMP_CODE = " + item.COMP_CODE + " and CC_CODE ='" + item.CC_CODE + "'";

                            string query = Q;
                            var de = db.Database.ExecuteSqlCommand(query);

                        }


                        dbTransaction.Commit();
                        // Return in case if the db generate transaction number   res.ResponseData
                        return Ok(new BaseResponse(100));



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
        public IHttpActionResult GetByCostCntreCode(int CompCode, string CostCntreCode, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var AccRec = GCostCenterService.GetAll(x => x.COMP_CODE == CompCode && x.CC_CODE == CostCntreCode).FirstOrDefault();

                return Ok(new BaseResponse(AccRec));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetActiveCostCntreByCode(int CompCode, string CostCntreCode, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var AccRec = GCostCenterService.GetAll(x => x.COMP_CODE == CompCode && x.CC_CODE == CostCntreCode && x.ACTIVE == true).FirstOrDefault();

                return Ok(new BaseResponse(AccRec));
            }
            return BadRequest(ModelState);
        }

    }
}
