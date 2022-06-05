using Inv.API.Models;
using Inv.API.Tools;
using Inv.BLL.Services.GBRANCH;
using Inv.BLL.Services.Glnktrans;
using Inv.BLL.Services.GlnktransTemp;
using Inv.BLL.Services.VchrTemplateDetail;
using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Inv.API.Controllers;
using System.Data.Entity.Core.Objects;


namespace Inv.API.Controllers
{
    public class TranPostingController : BaseController
    {
        private readonly IGBRANCHService IGBRANCHService;
        private readonly GlnktransTempService GlnktransTempService;
        private readonly IGlnktransService IGlnktransService;
        private readonly G_USERSController UserControl;
        private readonly IVchrTemplateDetailService IVchrTemplateDetailService;

        public TranPostingController(IGBRANCHService _IGBRANCHService, GlnktransTempService _GlnktransTempService, IGlnktransService _IGlnktransService, G_USERSController _Control, IVchrTemplateDetailService _IVchrTemplateDetailService)
        {
            this.IGBRANCHService = _IGBRANCHService;
            this.GlnktransTempService = _GlnktransTempService;
            this.IGlnktransService = _IGlnktransService;
            this.IVchrTemplateDetailService = _IVchrTemplateDetailService;
            this.UserControl = _Control;
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllTransactions(string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var GenVatTypeList = IGlnktransService.GetAll(x => x.INTEGRATE == true).OrderBy(s => s.SUB_SYSTEM_CODE).ThenBy(a => a.TR_CODE).ToList();

                return Ok(new BaseResponse(GenVatTypeList));
            }
            return BadRequest(ModelState);
        }



        [HttpGet, AllowAnonymous]
        public IHttpActionResult LoadTransactions(int Comp, int branchCode, string TrType, string StartDate, string EndDate, int? FromNum, int? ToNum, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                db.GLnk_GenerateTrans(Comp, branchCode, UserCode, "I", TrType, StartDate, EndDate, FromNum, ToNum);
                var Arrays = GlnktransTempService.GetAll(s => s.User_Code == UserCode).ToList();
                return Ok(new BaseResponse(Arrays));
            }
            return BadRequest(ModelState);
        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult UpdateTransactions([FromBody]List<G_LnkTrans_Temp> lnkTempList)
        {
            if (ModelState.IsValid)
            {
                //GlnktransTempService.UpdateList(lnkTempList);
                db.GLnk_GenerateTransVchr(lnkTempList[0].User_Code);
                var userCode = lnkTempList[0].User_Code;
                var VchDeatilList = IVchrTemplateDetailService.GetAllFromView(s => s.User_Code == userCode).ToList();

                //LogUser.Insert(db, lnkTempList[0].COMP_CODE.ToString(), lnkTempList[0].BRA_CODE.ToString(), lnkTempList[0].ToString(), lnkTempList[0].User_Code, lnkTempList[0].TR_NO, LogUser.UserLog.Insert, LogUser.PageName.AccDefCustomer, true, null, lnkTempList[0].TR_NO.ToString(), null);

                return Ok(new BaseResponse(VchDeatilList));
            }
            return BadRequest(ModelState);
        }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult Updateselect(int Comp, int branchCode, string ROW_ID, int Isselect, string UserCode, string Token)
        {
            if (ModelState.IsValid)
            {
                db.Database.ExecuteSqlCommand("update G_LnKTrans_Temp set IsSelected = " + Isselect + " where COMP_CODE = " + Comp + " and BRA_CODE = " + branchCode + " and ROW_ID = '" + ROW_ID + "'");

            }
            return BadRequest(ModelState);
        }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetTransactions(string UserCode, string Token)
        {
            if (ModelState.IsValid)
            {
                var VchDeatilList = GlnktransTempService.GetAll(s => s.User_Code == UserCode);
                return Ok(new BaseResponse(VchDeatilList));
            }
            return BadRequest(ModelState);
        }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GenerateVoucher(int comp, int branch, string Desc, string UserCode, string Token)
        {
            if (ModelState.IsValid)
            {
                int Trno = 0;
                ObjectParameter objParameterOk = new ObjectParameter("vTrno", Trno);
                var RetValue = db.GLnk_GenerateVoucher(comp, branch, UserCode, Desc, objParameterOk);
                if (Convert.ToInt32(objParameterOk.Value) != 0)
                    Trno = Convert.ToInt32(objParameterOk.Value);
                else
                    Trno = -1;
                return Ok(new BaseResponse(Trno));
            }
            return BadRequest(ModelState);
        }

    }
}
