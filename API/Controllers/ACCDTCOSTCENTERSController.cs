using Inv.API.Models;
using Inv.API.Tools;
using Inv.BLL.Services.AccDtCostCenters;
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

    public class AccDtCostCentersController : BaseController

    {
        private readonly IA_CCDT_COSTCENTERSService A_CCDT_COSTCENTERSService;
        private readonly G_USERSController UserControl;
        public AccDtCostCentersController(IA_CCDT_COSTCENTERSService _A_CCDT_COSTCENTERSService, G_USERSController _Control)
        {
            this.A_CCDT_COSTCENTERSService = _A_CCDT_COSTCENTERSService;
            this.UserControl = _Control;
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAll(int compCode,string UserCode, string Token)
        {
            if (ModelState.IsValid)
            {
                var res = A_CCDT_COSTCENTERSService.GetAll(s=>s.COMP_CODE== compCode).ToList();

                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetById(int id, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var res = A_CCDT_COSTCENTERSService.GetById(id);

                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetByCCDT_CODE(string CCDT_CODE, string UserCode, string Token ,int CompCode)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var res = A_CCDT_COSTCENTERSService.GetAll(x=>x.CCDT_CODE== CCDT_CODE && x.COMP_CODE== CompCode).ToList();

                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }
        

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetCCDTCostByCode(int CompCode, string CostCntreCode, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var AccRec = A_CCDT_COSTCENTERSService.GetAll(x => x.COMP_CODE == CompCode && x.CCDT_CODE == CostCntreCode).FirstOrDefault();

                return Ok(new BaseResponse(AccRec));
            }
            return BadRequest(ModelState);
        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult Insert([FromBody]A_CCDT_COSTCENTERS obj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(obj.Token, obj.UserCode))
            {
                try
                {
                    var res = A_CCDT_COSTCENTERSService.Insert(obj);
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
        public IHttpActionResult Delete(int ID, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                try
                {
                    A_CCDT_COSTCENTERSService.Delete(ID);
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
        public IHttpActionResult Update([FromBody]A_CCDT_COSTCENTERS obj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(obj.Token, obj.UserCode))
            {
                try
                {
                    var res = A_CCDT_COSTCENTERSService.Update(obj);
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
        public IHttpActionResult UpdateLst(List<A_CCDT_COSTCENTERS> Lst)
        {
            try
            {
               
                var insertedRecord = Lst.Where(x => x.StatusFlag == 'i').ToList();
                var updatedRecord = Lst.Where(x => x.StatusFlag == 'u').ToList();
                var deletedRecord = Lst.Where(x => x.StatusFlag == 'd').ToList();

                if (updatedRecord.Count() > 0)
                    A_CCDT_COSTCENTERSService.UpdateList(updatedRecord);
                if (insertedRecord.Count() > 0)
                    A_CCDT_COSTCENTERSService.InsertList(insertedRecord);
                if (deletedRecord.Count() > 0)
                {
                    foreach (var entity in deletedRecord)
                    {
                        db.A_CCDT_COSTCENTERS.Attach(entity);
                        db.A_CCDT_COSTCENTERS.Remove(entity);
                        db.SaveChanges();
                    }
                }
                return Ok(new BaseResponse());
            }
            catch (Exception ex)
             {
                return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
            }
        }

      


    }


}