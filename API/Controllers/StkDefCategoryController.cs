using Inv.API.Models;
using Inv.API.Tools;
using Inv.BLL.Services.StkDefCategory;
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
    public class StkDefCategoryController : BaseController
    {
        // GET: StKDefinition
        private readonly IStkDefCategoryService StkDefCategoryService;
        private readonly G_USERSController UserControl;

        public StkDefCategoryController(IStkDefCategoryService _StkDefCategoryService, G_USERSController _Control)
        {
            this.StkDefCategoryService = _StkDefCategoryService;
            this.UserControl = _Control;
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAll(int CompCode, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var category = StkDefCategoryService.GetAll(x => x.CompCode == CompCode).ToList();

                return Ok(new BaseResponse(category));
            }
            return BadRequest(ModelState);
        }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAll(int CompCode, int ItemTypeID, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                List<I_D_Category> category = new List<I_D_Category>();

                if (ItemTypeID == 0)
                {
                    category = StkDefCategoryService.GetAll(x => x.CompCode == CompCode).ToList();
                }
                else
                {
                    category = StkDefCategoryService.GetAll(x => x.CompCode == CompCode && ItemTypeID == ItemTypeID).ToList();
                }
                return Ok(new BaseResponse(category));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllCat(int CompCode,int CatID , string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var category = StkDefCategoryService.GetAll(x => x.CompCode == CompCode && x.CatID == CatID).ToList();
                
                return Ok(new BaseResponse(category));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetById(int id, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var category = StkDefCategoryService.GetById(id);

                return Ok(new BaseResponse(category));
            }
            return BadRequest(ModelState);
        }


        [HttpPost, AllowAnonymous]
        public IHttpActionResult Insert([FromBody]I_D_Category category)
        {
            //if (ModelState.IsValid && UserControl.CheckUser(category.Token, category.UserCode))
            //{
                try
                {
                    var Catg = StkDefCategoryService.Insert(category);
                    return Ok(new BaseResponse(Catg));
                }
                catch (Exception ex)
                {
                    return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                }
            //}
            //return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult Delete(int ID, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                try
                {
                    StkDefCategoryService.Delete(ID);
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
        public IHttpActionResult Update([FromBody]I_D_Category category)
        { 
                    var Catg = StkDefCategoryService.Update(category);
                    return Ok(new BaseResponse(Catg)); 
        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult UpdateLst(List<I_D_Category> CategoryList)
        {
            try
            {
                StkDefCategoryService.UpdateList(CategoryList);
                return Ok(new BaseResponse());
            }
            catch (Exception ex)
            {
                return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
            }
        }


        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetItemType(int CompCode, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var ItemType = db.Database.SqlQuery<I_G_ItemType>("select * from I_G_ItemType where CompCode = "+ CompCode +"").ToList();

                return Ok(new BaseResponse(ItemType));
            }
            return BadRequest(ModelState);
        }

    }
}