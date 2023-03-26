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
        public IHttpActionResult GetAllTransactions(int CompCode, string UserCode, string Token, string sec_FinYear, string MODULE_CODE, string BranchCode)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            { 
                var GenVatTypeList = IGlnktransService.GetAll(x => x.INTEGRATE == true && x.COMP_CODE == CompCode.ToString() && x.Comp_INTEGRATE == true).OrderBy(s => s.SUB_SYSTEM_CODE).ThenBy(a => a.TR_CODE).ToList();
                LogUser.InsertPrint(db, CompCode.ToString(), BranchCode, sec_FinYear, UserCode, null, LogUser.UserLog.Query, MODULE_CODE, true, null, null, "GetAllTransactions");

                return Ok(new BaseResponse(GenVatTypeList));
            }
            return BadRequest(ModelState);
        }



        [HttpGet, AllowAnonymous]
        public IHttpActionResult LoadTransactions(int Comp, int branchCode, string TrType, string StartDate, string EndDate, int? FromNum, int? ToNum, string UserCode, string Token, string Modules, string FinYear)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                db.GLnk_GenerateTrans(Comp, branchCode, UserCode, "I", TrType, StartDate, EndDate, FromNum, ToNum);
                var Arrays = GlnktransTempService.GetAll(s => s.User_Code == UserCode).ToList();
                LogUser.InsertPrint(db, Comp.ToString(), branchCode.ToString(), FinYear, UserCode, null, LogUser.UserLog.Query, Modules, true, null, null, "LoadTransactions");

                return Ok(new BaseResponse(Arrays));
            }
            return BadRequest(ModelState);
        }
        [HttpPost, AllowAnonymous]
        public IHttpActionResult UpdateTransactions([FromBody]List<G_LnkTrans_Temp> lnkTempList)
        {
            db.Database.ExecuteSqlCommand("Update G_LnkTrans_Temp set IsSelected = 0 where User_Code = '" + lnkTempList[0].User_Code + "'");
            string ID = "";
            string Code = "";
            int i = 0;
            foreach (var item in lnkTempList)
            {
                if (i == 0)
                {
                    ID = "" + item.ROW_ID + "";
                    Code = "'" + item.TR_CODE + "'";
                }
                else
                {
                    ID = ID + "," + item.ROW_ID + "";
                    Code = Code + ",'" + item.TR_CODE + "'";

                }
                i = 1;
            }
            db.Database.ExecuteSqlCommand("Update G_LnkTrans_Temp set IsSelected = 1 where ROW_ID in (" + ID + ") and TR_CODE in (" + Code + ") and User_Code = '" + lnkTempList[0].User_Code + "' ");

            if (ModelState.IsValid)
            {
                //GlnktransTempService.UpdateList(lnkTempList);
                db.GLnk_GenerateTransVchr(lnkTempList[0].User_Code);
                var userCode = lnkTempList[0].User_Code;
                var VchDeatilList = IVchrTemplateDetailService.GetAllFromView(s => s.User_Code == userCode).ToList();

                LogUser.InsertPrint(db, lnkTempList[0].Comp_Code.ToString(), lnkTempList[0].Branch_Code.ToString(), lnkTempList[0].sec_FinYear, lnkTempList[0].UserCode, null, LogUser.UserLog.Update, lnkTempList[0].MODULE_CODE, true, null, null, null);

                return Ok(new BaseResponse(VchDeatilList));
            }
            return BadRequest(ModelState);
        }
        //[HttpGet, AllowAnonymous]
        //public IHttpActionResult Updateselect(int Comp, int branchCode, string ROW_ID, int Isselect, string UserCode, string Token)
        //{
        //    if (ModelState.IsValid)
        //    {
        //        db.Database.ExecuteSqlCommand("update G_LnKTrans_Temp set IsSelected = " + Isselect + " where COMP_CODE = " + Comp + " and BRA_CODE = " + branchCode + " and ROW_ID = '" + ROW_ID + "'");

        //    }
        //    return BadRequest(ModelState);
        //}
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
        public IHttpActionResult GenerateVoucher(int comp, int branch, string Desc,string VoucherDate, string UserCode, string Token, string sec_FinYear, string MODULE_CODE)
        {
            if (ModelState.IsValid)
            {
                int Trno = 0;
                ObjectParameter objParameterOk = new ObjectParameter("vTrno", Trno);
                var RetValue = db.GLnk_GenerateVoucherVer2(comp, branch, UserCode, Desc, VoucherDate,objParameterOk);
                if (Convert.ToInt32(objParameterOk.Value) != 0)
                    Trno = Convert.ToInt32(objParameterOk.Value);
                else
                    Trno = -1;

                LogUser.InsertPrint(db, comp.ToString(), branch.ToString(), sec_FinYear, UserCode, null, LogUser.UserLog.Update, MODULE_CODE, true, null, null, "GenerateVoucher" + Desc);

                return Ok(new BaseResponse(Trno));
            }
            return BadRequest(ModelState);
        }

    }
}
