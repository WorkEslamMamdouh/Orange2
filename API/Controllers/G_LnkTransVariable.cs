using Inv.API.Models;
using Inv.API.Tools;
using Inv.BLL.Services.G_LnkTransVariables;
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
    public class G_LnkTransVariableController : BaseController
    {
        private readonly IG_LnkTransVariableService G_LnkTransVariableService;
        private readonly G_USERSController UserControl;

        public G_LnkTransVariableController(IG_LnkTransVariableService _IG_LnkTransVariableService, G_USERSController _Control)
        {
            this.G_LnkTransVariableService = _IG_LnkTransVariableService;
            this.UserControl = _Control;
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllVAl(string UserCode, string Token, string SUB_SYSTEM_CODE, string SYSTEM_CODE)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var AccDefAccountList = G_LnkTransVariableService.GetAll(x=>x.VarType== "VAL" && x.SUB_SYSTEM_CODE== SUB_SYSTEM_CODE&&x.SYSTEM_CODE== SYSTEM_CODE).ToList();

                return Ok(new BaseResponse(AccDefAccountList));
            }
            return BadRequest(ModelState);
        }
         [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllVAR(string UserCode, string Token, string SUB_SYSTEM_CODE, string SYSTEM_CODE)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var AccDefAccountList = G_LnkTransVariableService.GetAll(x=>x.VarType== "ACC" && x.SUB_SYSTEM_CODE == SUB_SYSTEM_CODE && x.SYSTEM_CODE == SYSTEM_CODE).ToList();

                return Ok(new BaseResponse(AccDefAccountList));
            }
            return BadRequest(ModelState);
        }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllCC(string UserCode, string Token, string SUB_SYSTEM_CODE, string SYSTEM_CODE)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var AccDefAccountList = G_LnkTransVariableService.GetAll(x=>x.VarType== "CC" && x.SUB_SYSTEM_CODE == SUB_SYSTEM_CODE && x.SYSTEM_CODE == SYSTEM_CODE).ToList();

                return Ok(new BaseResponse(AccDefAccountList));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetById(int id, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var AccDefAccount = G_LnkTransVariableService.GetById(id);

                return Ok(new BaseResponse(AccDefAccount));
            }
            return BadRequest(ModelState);
        }
 
        

       
        

    }
}
