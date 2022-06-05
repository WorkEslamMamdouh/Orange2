using Inv.API.Models;
using Inv.API.Tools;
using Inv.BLL.Services.AVAT_D_Servicee;
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
    public class AVAT_D_ServiceController : BaseController

    {
        private readonly IAVAT_D_ServiceService AVAT_D_ServiceService;
        private readonly G_USERSController UserControl ;
        public AVAT_D_ServiceController(IAVAT_D_ServiceService _AVAT_D_ServiceService, G_USERSController _Control )
        {
            this.AVAT_D_ServiceService = _AVAT_D_ServiceService;
            this.UserControl = _Control;
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAll(string UserCode, string Token)
        {
            if (ModelState.IsValid &&  UserControl.CheckUser(Token, UserCode))
            {
                var res = AVAT_D_ServiceService.GetAll().ToList();

                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetServiceCat(string UserCode, string Token,int compcode,bool IsPurchase)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var res = db.AQVAT_GetSrvCategory.Where(x=>x.COMP_CODE== compcode && x.IsPurchase== IsPurchase).OrderBy(s=>s.CAT_CODE).ToList();

                return Ok(new BaseResponse(res));
        }
            return BadRequest(ModelState);
    }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetById(int id, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var res = AVAT_D_ServiceService.GetById(id);

                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }


        //[HttpPost, AllowAnonymous]
        //public IHttpActionResult Insert([FromBody]AVAT_D_Service obj)
        //{
        //    if (ModelState.IsValid && UserControl.CheckUser(obj.Token, obj.UserCode))
        //    {
        //        try
        //        {
        //            var res = AVAT_D_ServiceService.Insert(obj);
        //            return Ok(new BaseResponse(res.SrvCategoryID));
        //        }
        //        catch (Exception ex)
        //        {
        //            return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
        //        }
        //    }
        //    return BadRequest(ModelState);
        //}
        //[HttpGet, AllowAnonymous]
        //public IHttpActionResult Delete(int ID, string UserCode, string Token)
        //{
        //    if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
        //    {
        //        try
        //        {
        //            AVAT_D_ServiceService.Delete(ID);
        //            return Ok(new BaseResponse());
        //        }
        //        catch (Exception ex)
        //        {
        //            return Ok(new BaseResponse(0, "Error"));
        //        }

        //    }
        //    else
        //    {
        //        return BadRequest(ModelState);
        //    }
        //}
        //[HttpPost, AllowAnonymous]
        //public IHttpActionResult Update([FromBody]AVAT_D_Service obj)
        //{
        //    if (ModelState.IsValid && UserControl.CheckUser(obj.Token, obj.UserCode))
        //    {
        //        try
        //        {
        //            var res = AVAT_D_ServiceService.Update(obj);
        //            return Ok(new BaseResponse(res));
        //        }
        //        catch (Exception ex)
        //        {
        //            return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
        //        }
        //    }
        //    return BadRequest(ModelState);
        //}





    }
}
