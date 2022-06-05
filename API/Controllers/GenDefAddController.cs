using Inv.API.Models;
using Inv.API.Tools;
using Inv.BLL.Services.GenDefAdd;
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
    public class GenDefAddController : BaseController
    {
        private readonly IGenDefAddService IGenDefAddService;
        private readonly G_USERSController UserControl;

        public GenDefAddController(IGenDefAddService _IGenDefAddService, G_USERSController _Control)
        {
            this.IGenDefAddService = _IGenDefAddService;
            this.UserControl = _Control;
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAll(int CompCode, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var GenDefAdd = IGenDefAddService.GetAll(x => x.CompCode == CompCode ).ToList();

                return Ok(new BaseResponse(GenDefAdd));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetById(int id, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var GenDefAdd = IGenDefAddService.GetById(id);

                return Ok(new BaseResponse(GenDefAdd));
            }
            return BadRequest(ModelState);
        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult Insert([FromBody]I_Pur_D_Charges RecPayGroup)
        {
            if (ModelState.IsValid && UserControl.CheckUser(RecPayGroup.Token, RecPayGroup.UserCode))
            {
                try
                {
                    var RecPayGr = IGenDefAddService.Insert(RecPayGroup);
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
                    IGenDefAddService.Delete(ID);
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
        public IHttpActionResult Update([FromBody]I_Pur_D_Charges RecPayGroup)
        {
            if (ModelState.IsValid && UserControl.CheckUser(RecPayGroup.Token, RecPayGroup.UserCode))
            {
                try
                {
                    var RecPayGrp = IGenDefAddService.Update(RecPayGroup);
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
        public IHttpActionResult UpdateLst(List<I_Pur_D_Charges> RecPayGroupList)
        {
            try
            {
                IGenDefAddService.UpdateList(RecPayGroupList);
                return Ok(new BaseResponse());
            }
            catch (Exception ex)
            {
                return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
            }
        }
    }
}
