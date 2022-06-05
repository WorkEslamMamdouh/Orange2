using Inv.API.Models;
using Inv.API.Tools;
using Inv.BLL.Services.AVATSrvCategory;
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
    public class AVATSrvCategoryController : BaseController

    {
        private readonly IAVATSrvCategoryService AVATSrvCategoryService;
        private readonly G_USERSController UserControl ;
        public AVATSrvCategoryController(IAVATSrvCategoryService _AVATSrvCategoryService, G_USERSController _Control )
        {
            this.AVATSrvCategoryService = _AVATSrvCategoryService;
            this.UserControl = _Control;
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAll(string UserCode, string Token)
        {
            if (ModelState.IsValid &&  UserControl.CheckUser(Token, UserCode))
            {
                var res = AVATSrvCategoryService.GetAll().ToList();

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
                var res = AVATSrvCategoryService.GetById(id);

                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }


        [HttpPost, AllowAnonymous]
        public IHttpActionResult Insert([FromBody]AVAT_D_SrvCategory obj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(obj.Token, obj.UserCode))
            {
                    try
                    {
                        var res = AVATSrvCategoryService.Insert(obj);
                        return Ok(new BaseResponse(res.SrvCategoryID));
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
                    AVATSrvCategoryService.Delete(ID);
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
        public IHttpActionResult Update([FromBody]AVAT_D_SrvCategory obj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(obj.Token, obj.UserCode))
            {
                    try
                    {
                        var res = AVATSrvCategoryService.Update(obj);
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
