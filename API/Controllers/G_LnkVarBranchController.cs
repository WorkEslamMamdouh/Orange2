using Inv.API.Models;
using Inv.API.Tools;
using Inv.BLL.Services.LnkVarBranch;
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
    public class G_LnkVarBranchController : BaseController
    {
        private readonly IG_LnkVarBranchService G_LnkVarBranchService;
        private readonly G_USERSController UserControl;

        public G_LnkVarBranchController(IG_LnkVarBranchService _IG_LnkVarBranchService, G_USERSController _Control)
        {
            this.G_LnkVarBranchService = _IG_LnkVarBranchService;
            this.UserControl = _Control;
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAll(int CompCode, int BraCode, string Lnktype ,string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var AccDefAccountList = G_LnkVarBranchService.GetAll(x => x.CompCode == CompCode && x.BraCode == BraCode && x.Lnktype == Lnktype).ToList();
                 return Ok(new BaseResponse(AccDefAccountList));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAll_GQ_GetLnkVarBranch(int CompCode, int BraCode, string Lnktype, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                string s = "select * from GQ_GetLnkVarBranch  where CompCode = " + CompCode + " and BraCode = " + BraCode + " and Lnktype = '" + Lnktype + "'";

                string query = s;
                var res = db.Database.SqlQuery<GQ_GetLnkVarBranch>(query).ToList();
                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }


        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetById(int id, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var AccDefAccount = G_LnkVarBranchService.GetById(id);

                return Ok(new BaseResponse(AccDefAccount));
            }
            return BadRequest(ModelState);
        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult Insert([FromBody]G_LnkVarBranch LnkVarBranch)
        {
            if (ModelState.IsValid && UserControl.CheckUser(LnkVarBranch.Token, LnkVarBranch.UserCode))
            {
                try
                {
                    var AccDefAcc = G_LnkVarBranchService.Insert(LnkVarBranch);
                    return Ok(new BaseResponse(AccDefAcc));
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
                    G_LnkVarBranchService.Delete(ID);
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
        public IHttpActionResult Update(List<G_LnkVarBranch> LnkVarBranch)
        {
            if (ModelState.IsValid && UserControl.CheckUser(LnkVarBranch[0].Token, LnkVarBranch[0].UserCode))
            {
                try
                {

                    foreach (var item in LnkVarBranch)
                    {
                        var updatedRec = G_LnkVarBranchService.Update(item);
                    }
                    
                    return Ok(new BaseResponse(100));
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
