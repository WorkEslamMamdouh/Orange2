using Inv.API.Models;
using Inv.API.Tools;
using Inv.BLL.Services.GenDefCategory;
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
    public class GenDefCategoryController : BaseController
    {
        private readonly IGenDefCategoryService IGenDefCategoryService;
        private readonly G_USERSController UserControl;

        public GenDefCategoryController(IGenDefCategoryService _IGenDefCategoryService, G_USERSController _Control)
        {
            this.IGenDefCategoryService = _IGenDefCategoryService;
            this.UserControl = _Control;
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAll(int CompCode,int AccountType, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var RecPayCategory = IGenDefCategoryService.GetAll(x => x.CompCode == CompCode && x.AccountType==AccountType).ToList();

                return Ok(new BaseResponse(RecPayCategory));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetById(int id, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var RecPayCategory = IGenDefCategoryService.GetById(id);

                return Ok(new BaseResponse(RecPayCategory));
            }
            return BadRequest(ModelState);
        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult Insert([FromBody]A_RecPay_D_Category RecPayCategory)
        {
            if (ModelState.IsValid && UserControl.CheckUser(RecPayCategory.Token, RecPayCategory.UserCode))
            {
                try
                {
                    var RecPayCat = IGenDefCategoryService.Insert(RecPayCategory);
                    return Ok(new BaseResponse(RecPayCat));
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
                    IGenDefCategoryService.Delete(ID);
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
        public IHttpActionResult Update([FromBody]A_RecPay_D_Category RecPayCategory)
        {
            if (ModelState.IsValid && UserControl.CheckUser(RecPayCategory.Token, RecPayCategory.UserCode))
            {
                try
                {
                    var RecPayCat = IGenDefCategoryService.Update(RecPayCategory);
                    return Ok(new BaseResponse(RecPayCat));
                }
                catch (Exception ex)
                {
                    return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                }
            }
            return BadRequest(ModelState);
        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult UpdateLst(List<A_RecPay_D_Category> RecPayCategoryList)
        {
            try
            {
                IGenDefCategoryService.UpdateList(RecPayCategoryList);
                return Ok(new BaseResponse());
            }
            catch (Exception ex)
            {
                return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
            }
        }
    }
}