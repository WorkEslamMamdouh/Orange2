using Inv.API.Models;
using Inv.API.Tools;
using Inv.BLL.Services.AVATTRANS;

using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Inv.API.Controllers;
using Inv.API.Models.CustomModel;

namespace Inv.API.Controllers
{
    public class AVATTRANSController : BaseController

    {
        private readonly IAVATTRANSService AVATTRANSService;
        private readonly G_USERSController UserControl ;
        public AVATTRANSController(IAVATTRANSService _AVATTRANSService, G_USERSController _Control)
        {
            this.AVATTRANSService = _AVATTRANSService;
            this.UserControl = _Control;
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAll(string UserCode, string Token)
        {
            if (ModelState.IsValid)
            {
                var res = AVATTRANSService.GetAll().ToList();

                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }

     


        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllByComp(string UserCode, string Token,int compcode)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var res = AVATTRANSService.GetAll(x=>x.COMP_CODE==compcode && x.ISAVAILABLE==true).ToList().Distinct();
              
                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetDistinctSystem(string UserCode, string Token, int compcode)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                string s = "select distinct [SYSTEMDESCA],SYSTEM_CODE from AVAT_TRANS where COMP_CODE="+compcode+ " and ISAVAILABLE=1";
          var res = db.Database.SqlQuery<System_Class>(s).ToList();
              

                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }


        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetById(int id, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var res = AVATTRANSService.GetById(id);

                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }


        [HttpPost, AllowAnonymous]
        public IHttpActionResult Insert([FromBody]AVAT_TRANS obj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(obj.Token, obj.UserCode))
            {
                    try
                    {
                        var res = AVATTRANSService.Insert(obj);
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
                    AVATTRANSService.Delete(ID);
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
        public IHttpActionResult Update([FromBody]AVAT_TRANS obj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(obj.Token, obj.UserCode))
            {
                    try
                    {
                        var res = AVATTRANSService.Update(obj);
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
