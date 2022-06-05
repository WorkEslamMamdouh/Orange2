using Inv.API.Models;
using Inv.API.Tools;
using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Inv.BLL.Services.IControl;


namespace Inv.API.Controllers
{
    public class I_ControlController : BaseController

    {
        private readonly II_ControlService I_ControlService;


        public I_ControlController(II_ControlService ControlService)
        {
            this.I_ControlService = ControlService;
            
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAll(int CompCode)
        {
            if (ModelState.IsValid )
            {
                try
                {

             
                var documents = I_ControlService.GetAll(x => x.CompCode == CompCode);
                return Ok(new BaseResponse(documents));

                }
                catch (Exception EX)
                {

                    throw;
                }
            }
            return BadRequest(ModelState);
        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult Update([FromBody]I_Control obj)
        {
           
                    var res = I_ControlService.Update(obj);
                    return Ok(new BaseResponse(res));
               
        }


    }
}

