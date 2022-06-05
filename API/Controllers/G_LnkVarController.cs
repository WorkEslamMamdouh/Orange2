using Inv.API.Models;
using Inv.API.Tools;
using Inv.BLL.Services.G_LnkVarr;
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
    public class G_LnkVarController : BaseController
    {
        private readonly IG_LnkVarService G_LnkVarService;
        private readonly G_USERSController UserControl;

        public G_LnkVarController(IG_LnkVarService _IG_LnkVarService, G_USERSController _Control)
        {
            this.G_LnkVarService = _IG_LnkVarService;
            this.UserControl = _Control;
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAll(string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var AccDefAccountList = G_LnkVarService.GetAll(x=>x.Lnktype== "ACC").ToList();

                return Ok(new BaseResponse(AccDefAccountList));
            }
            return BadRequest(ModelState);
        }
          public IHttpActionResult GetAllCC(string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var AccDefAccountList = G_LnkVarService.GetAll(x=>x.Lnktype== "CC").ToList();

                return Ok(new BaseResponse(AccDefAccountList));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetById(int id, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var AccDefAccount = G_LnkVarService.GetById(id);

                return Ok(new BaseResponse(AccDefAccount));
            }
            return BadRequest(ModelState);
        }
 
        

       
        

    }
}
