using Inv.API.Models;
using Inv.API.Tools;
using Inv.BLL.Services.G_LnkTran;
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
    public class G_LnkTransController : BaseController
    {
        private readonly IG_LnkTransService G_LnkTransService;
        private readonly G_USERSController UserControl;

        public G_LnkTransController(IG_LnkTransService _IG_LnkTransService, G_USERSController _Control)
        {
            this.G_LnkTransService = _IG_LnkTransService;
            this.UserControl = _Control;
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAll(string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var AccDefAccountList = G_LnkTransService.GetAll( ).ToList();

                return Ok(new BaseResponse(AccDefAccountList));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetById(int id, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var AccDefAccount = G_LnkTransService.GetById(id);

                return Ok(new BaseResponse(AccDefAccount));
            }
            return BadRequest(ModelState);
        }
 
        

       
        

    }
}
