using Inv.API.Models;
using Inv.API.Tools;
using Inv.BLL.Services.StkDefStore;
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
    public class StkDefStoreController : BaseController
    {
        private readonly IStkDefStoreService StkDefStoreService;
        private readonly G_USERSController UserControl;

        public StkDefStoreController(IStkDefStoreService _IStkDefStoreService, G_USERSController _Control)
        {
            this.StkDefStoreService = _IStkDefStoreService;
            this.UserControl = _Control;
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAll(int CompCode, int BranchCode ,string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var AccDefCustomerList = StkDefStoreService.GetAll(x => x.COMP_CODE == CompCode && x.BRA_CODE == BranchCode).ToList();

                return Ok(new BaseResponse(AccDefCustomerList));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetById(int id, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var AccDefCustomer = StkDefStoreService.GetById(id);

                return Ok(new BaseResponse(AccDefCustomer));
            }
            return BadRequest(ModelState);
        }

    }
}
