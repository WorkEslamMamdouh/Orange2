using Inv.API.Models;
using Inv.API.Tools;
using Inv.BLL.Services.PurDefCharges;
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
    public class PurDefChargesController : BaseController
    {
        private readonly IPurDefChargesService PurDefChargesService;
        private readonly G_USERSController UserControl;

        public PurDefChargesController(IPurDefChargesService _IPurDefChargesService, G_USERSController _Control)
        {
            this.PurDefChargesService = _IPurDefChargesService;
            this.UserControl = _Control;
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAll(int CompCode, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var purDChargesList = PurDefChargesService.GetAll(x => x.CompCode == CompCode ).ToList();

                return Ok(new BaseResponse(purDChargesList));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetById(int id, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var purDCharges = PurDefChargesService.GetById(id);

                return Ok(new BaseResponse(purDCharges));
            }
            return BadRequest(ModelState);
        }
    }
}
