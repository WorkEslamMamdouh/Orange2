using Inv.API.Models;
using Inv.API.Tools;
using Inv.BLL.Services.AVatDService;
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
    public class AVatDServiceController : BaseController

    {
        private readonly IAVATSrvCategoryService AVATSrvCategoryService;
        private readonly IAVatDServiceService IAVatDServiceService;
        private readonly G_USERSController UserControl ;
        public AVatDServiceController(IAVatDServiceService _IAVatDServiceService, IAVATSrvCategoryService _AVATSrvCategoryService, G_USERSController _Control )
        {
            this.IAVatDServiceService = _IAVatDServiceService;
            this.AVATSrvCategoryService = _AVATSrvCategoryService;
            this.UserControl = _Control;
        }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllFiltered(int compcode,bool isPurchase,int? SrvCatId ,string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                string s = "select * from AQVAT_GetService where CompCode = " + compcode ;
                string condition = "";
                if (SrvCatId != 0 && SrvCatId != null)
                    condition = condition + " and SrvCategoryID = " + SrvCatId;

                if (isPurchase == false)
                {
                    condition = condition + " and IsPurchase = 'False' ";
                }
                else if (isPurchase ==true )
                {
                    condition = condition + " and IsPurchase = 'True' ";
                }

                string query = s + condition;
                var res = db.Database.SqlQuery<AQVAT_GetService>(query).ToList();

                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAll( int compcode,string UserCode, string Token)
        {
            if (ModelState.IsValid &&  UserControl.CheckUser(Token, UserCode))
            {
                var res = IAVatDServiceService.GetAll().Where(x => x.CompCode == compcode).ToList();

                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllFromView( int compcode,bool ispur,string UserCode, string Token)
        {
            if (ModelState.IsValid &&  UserControl.CheckUser(Token, UserCode))
            {
                var res = db.AQVAT_GetService.Where(x => x.CompCode == compcode&&x.IsPurchase==ispur).ToList();

                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetById(int id, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var res = IAVatDServiceService.GetById(id);

                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }


        [HttpPost, AllowAnonymous]
        public IHttpActionResult Insert([FromBody]AVAT_D_Service obj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(obj.Token, obj.UserCode))
            {
                    try
                    {
                    // region to update category serial and insert service code
                    var CatObj = db.AVAT_D_SrvCategory.Where(s => s.SrvCategoryID == obj.SrvCategoryID).FirstOrDefault();

                    int lastNum = int.Parse(CatObj.ItemFormatSerial.Last().ToString())+1;

                    string newItemFormatSerial = CatObj.ItemFormatSerial;
                   var x=newItemFormatSerial.Remove(newItemFormatSerial.Length - 1, 1);

                    CatObj.ItemFormatSerial = x + lastNum;
                    AVATSrvCategoryService.Update(CatObj);

                   obj.ItemCode = CatObj.ItemFormatFix + CatObj.ItemFormatSerial;
                     
                        var res = IAVatDServiceService.Insert(obj);
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
                    IAVatDServiceService.Delete(ID);
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
        public IHttpActionResult Update([FromBody]AVAT_D_Service obj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(obj.Token, obj.UserCode))
            {
                    try
                    {
                        var res = IAVatDServiceService.Update(obj);
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
