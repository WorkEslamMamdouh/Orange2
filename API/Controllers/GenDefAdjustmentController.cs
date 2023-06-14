using Inv.API.Models;
using Inv.API.Tools;
using Inv.BLL.Services.GenDefAdjustment;
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
    public class GenDefAdjustmentController : BaseController
    {
        private readonly IGenDefAdjustmentService GenDefAdjustmentService;
        private readonly G_USERSController UserControl;

        public GenDefAdjustmentController(IGenDefAdjustmentService _IGenDefAdjustmentService, G_USERSController _Control)
        {
            this.GenDefAdjustmentService = _IGenDefAdjustmentService;
            this.UserControl = _Control;
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAll(int CompCode,Boolean isCustomer,Boolean Isdebit, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var  AdjustmentTypeList = GenDefAdjustmentService.GetAll(x => x.CompCode == CompCode && x.IsCustomer == isCustomer&& x.IsDebit==Isdebit).ToList();
                
                return Ok(new BaseResponse(AdjustmentTypeList));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllGenDefAdjustment(int CompCode, Boolean isCustomer, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                
                var AdjustmentTypeList = GenDefAdjustmentService.GetAll(x =>x.CompCode == CompCode && x.IsCustomer == isCustomer).ToList();

                return Ok(new BaseResponse(AdjustmentTypeList));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetById(int id, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var AdjustmentType = GenDefAdjustmentService.GetById(id);

                return Ok(new BaseResponse(AdjustmentType));
            }
            return BadRequest(ModelState);
        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult Insert([FromBody]A_RecPay_D_AjustmentType AdjustmentType)
        {
            if (ModelState.IsValid && UserControl.CheckUser(AdjustmentType.Token, AdjustmentType.UserCode))
            {
                try
                {
                    var Adjustment = GenDefAdjustmentService.Insert(AdjustmentType);
                    return Ok(new BaseResponse(Adjustment));
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
                    GenDefAdjustmentService.Delete(ID);
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
        public IHttpActionResult Update([FromBody]A_RecPay_D_AjustmentType category)
        {
            if (ModelState.IsValid && UserControl.CheckUser(category.Token, category.UserCode))
            {
                try
                {
                    var AdjustmentType = GenDefAdjustmentService.Update(category);
                    return Ok(new BaseResponse(AdjustmentType));
                }
                catch (Exception ex)
                {
                    return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                }
            }
            return BadRequest(ModelState);
        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult UpdateLst(List<A_RecPay_D_AjustmentType> AdjustmentType)
        {
            try
            {
                GenDefAdjustmentService.UpdateList(AdjustmentType);
                 
                return Ok(new BaseResponse());
            }
            catch (Exception ex)
            { 
                return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
            }
        }
    }
}
