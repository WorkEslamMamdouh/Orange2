using Inv.API.Models;
using Inv.API.Tools;
using Inv.BLL.Services.Nationality;
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
    public class NationalityController : BaseController

    {
        private readonly INationalityService NationalityService;
        private readonly G_USERSController UserControl ;
        public NationalityController(INationalityService _NationalityService, G_USERSController _Control )
        {
            this.NationalityService = _NationalityService;
            this.UserControl = _Control;
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAll(string UserCode, string Token)
        {
            if (ModelState.IsValid  )
            {
                var nationality = NationalityService.GetAll().ToList();

                return Ok(new BaseResponse(nationality));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetById(int id, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var nationality = NationalityService.GetById(id);

                return Ok(new BaseResponse(nationality));
            }
            return BadRequest(ModelState);
        }


        [HttpPost, AllowAnonymous]
        public IHttpActionResult Insert([FromBody]G_Nationality Nation)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Nation.Token, Nation.UserCode))
            {
                    try
                    {
                        var Nationality = NationalityService.Insert(Nation);
                        return Ok(new BaseResponse(Nationality));
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
                    NationalityService.Delete(ID);
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
        public IHttpActionResult Update([FromBody]G_Nationality Nation)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Nation.Token, Nation.UserCode))
            {
                    try
                    {
                        var Nationality = NationalityService.Update(Nation);
                        return Ok(new BaseResponse(Nationality));
                    }
                    catch (Exception ex)
                    {
                        return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                    }
            }
            return BadRequest(ModelState);
        }



        //***************asmaa********************//
        [HttpPost, AllowAnonymous]
        public IHttpActionResult UpdateLst(List<G_Nationality> G_Nationality)
        {
            try
            {
                NationalityService.UpdateList(G_Nationality);
                return Ok(new BaseResponse());
            }
            catch (Exception ex)
            {
                return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
            }
        }

    }
}
