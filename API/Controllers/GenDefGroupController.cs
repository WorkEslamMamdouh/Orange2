using Inv.API.Models;
using Inv.API.Tools;
using Inv.BLL.Services.GenDefGroup;
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
    public class GenDefGroupController :BaseController
    {
        private readonly IGenDefGroupService IGenDefGroupService;
        private readonly G_USERSController UserControl;

        public GenDefGroupController(IGenDefGroupService _IGenDefGroupService, G_USERSController _Control)
        {
            this.IGenDefGroupService = _IGenDefGroupService;
            this.UserControl = _Control;
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAll(int CompCode, int AccountType, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var GenDefGroup = IGenDefGroupService.GetAll(x => x.CompCode == CompCode && x.AccountType == AccountType).ToList();

                return Ok(new BaseResponse(GenDefGroup));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetById(int id, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var GenDefGroup = IGenDefGroupService.GetById(id);

                return Ok(new BaseResponse(GenDefGroup));
            }
            return BadRequest(ModelState);
        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult Insert([FromBody]A_RecPay_D_Group RecPayGroup)
        {
            if (ModelState.IsValid && UserControl.CheckUser(RecPayGroup.Token, RecPayGroup.UserCode))
            {
                try
                {
                    var RecPayGr = IGenDefGroupService.Insert(RecPayGroup);
                    return Ok(new BaseResponse(RecPayGr));
                }
                catch (Exception ex)
                {
                    return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
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
                    IGenDefGroupService.Delete(ID);
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
        public IHttpActionResult Update([FromBody]A_RecPay_D_Group RecPayGroup)
        {
            if (ModelState.IsValid && UserControl.CheckUser(RecPayGroup.Token, RecPayGroup.UserCode))
            {
                try
                {
                    var RecPayGrp = IGenDefGroupService.Update(RecPayGroup);
                    return Ok(new BaseResponse(RecPayGrp));
                }
                catch (Exception ex)
                {
                    return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                }
            }
            return BadRequest(ModelState);
        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult UpdateLst(List<A_RecPay_D_Group> RecPayGroupList)
        {
            try
            {
                IGenDefGroupService.UpdateList(RecPayGroupList);
                return Ok(new BaseResponse());
            }
            catch (Exception ex)
            {
                return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
            }
        }
    }
}
