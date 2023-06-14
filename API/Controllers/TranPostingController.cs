using Inv.API.Models;
using Inv.API.Models.CustomModel;
using Inv.API.Tools;
using Inv.BLL.Services.GBRANCH;
using Inv.BLL.Services.Glnktrans;
using Inv.BLL.Services.GlnktransTemp;
using Inv.BLL.Services.LnkVoucherDetail;
using Inv.BLL.Services.VchrTemplateDetail;
using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Web.Http;


namespace Inv.API.Controllers
{
    public class TranPostingController : BaseController
    {
        private readonly IGBRANCHService IGBRANCHService;
        private readonly GlnktransTempService GlnktransTempService;
        private readonly IGlnktransService IGlnktransService;
        private readonly G_USERSController UserControl;
        private readonly IVchrTemplateDetailService IVchrTemplateDetailService;
        private readonly ILnkVoucherDetailService ILnkVoucherService;

        public TranPostingController(IGBRANCHService _IGBRANCHService, GlnktransTempService _GlnktransTempService, IGlnktransService _IGlnktransService, G_USERSController _Control, IVchrTemplateDetailService _IVchrTemplateDetailService, ILnkVoucherDetailService _ILnkVoucherDetailService)
        {
            IGBRANCHService = _IGBRANCHService;
            GlnktransTempService = _GlnktransTempService;
            IGlnktransService = _IGlnktransService;
            IVchrTemplateDetailService = _IVchrTemplateDetailService;
            UserControl = _Control;
            ILnkVoucherService = _ILnkVoucherDetailService;
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllTransactions(int CompCode, string UserCode, string Token, string sec_FinYear, string MODULE_CODE, string BranchCode)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                List<GQ_GetLnkTransComp> GenVatTypeList = IGlnktransService.GetAll(x => x.INTEGRATE == true && x.COMP_CODE == CompCode.ToString() && x.Comp_INTEGRATE == true).OrderBy(s => s.SUB_SYSTEM_CODE).ThenBy(a => a.TR_CODE).ToList();
                LogUser.InsertPrint(db, CompCode.ToString(), BranchCode, sec_FinYear, UserCode, null, "", LogUser.UserLog.View, MODULE_CODE, true, null, null, "GetAllTransactions");

                return Ok(new BaseResponse(GenVatTypeList));
            }
            return BadRequest(ModelState);
        }



        [HttpGet, AllowAnonymous]
        public IHttpActionResult LoadLnkVouchTransactions(int Comp, int branchCode, string TrType, string StartDate, string EndDate, int? FromNum, int? ToNum, string UserCode, string Token, string Modules, string FinYear)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {

                ObjectResult<AProc_LnkGenerateTrans_Result> Arrays = db.AProc_LnkGenerateTrans(Comp, branchCode, UserCode, "I", TrType, StartDate, EndDate, FromNum, ToNum, 1);
                LogUser.InsertPrint(db, Comp.ToString(), branchCode.ToString(), FinYear, UserCode, null, "", LogUser.UserLog.View, Modules, true, null, null, "LoadTransactions");

                return Ok(new BaseResponse(Arrays));
            }
            return BadRequest(ModelState);
        }


        [HttpPost, AllowAnonymous]
        public IHttpActionResult UpdateDetail([FromBody]LnkVoucherlMasterDetails obj)
        {
            //if (ModelState.IsValid && UserControl.CheckUser(obj.Token, obj.UserCode))
            //{
            using (System.Data.Entity.DbContextTransaction dbTransaction = db.Database.BeginTransaction())
            {
                try
                {


                    //update Details
                    List<A_LnkVoucher> insertedObjects = obj.A_LnkVoucher.Where(x => x.StatusFlag == 'i').ToList();
                    List<A_LnkVoucher> deletedObjects = obj.A_LnkVoucher.Where(x => x.StatusFlag == 'd').ToList();
                    List<A_LnkVoucher> updatedObjects = obj.A_LnkVoucher.Where(x => x.StatusFlag == 'u').ToList();

                    foreach (A_LnkVoucher item in insertedObjects)
                    {
                        ILnkVoucherService.Insert(item);
                    }

                    foreach (A_LnkVoucher item in updatedObjects)
                    {
                        ILnkVoucherService.Update(item);
                    }

                    foreach (A_LnkVoucher item in deletedObjects)
                    {
                        ILnkVoucherService.Delete(item.ID);
                    }

                    dbTransaction.Commit();


                    List<AProc_LnkGenerateTrans_Result> Arrays = db.AProc_LnkGenerateTrans(obj.FilterLnkVoucher.Comp, obj.FilterLnkVoucher.branchCode, obj.FilterLnkVoucher.UserCode, "I", obj.FilterLnkVoucher.TrType, obj.FilterLnkVoucher.StartDate, obj.FilterLnkVoucher.EndDate, obj.FilterLnkVoucher.FromNum, obj.FilterLnkVoucher.ToNum, 1).ToList();


                    if (obj.A_LnkVoucher.Count() > 0)
                    {
                        LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, Convert.ToInt32(obj.A_LnkVoucher[0].TrID), obj.A_LnkVoucher[0].TrNo.ToString(), LogUser.UserLog.Update, obj.MODULE_CODE, true, null, null, null);
                    }




                    //string DataJson = JsonConvert.SerializeObject(Arrays, Formatting.None);

                    //return GetObjectClass(DataJson, Arrays.GetType());

                    return Ok(new BaseResponse(Arrays));



                    ////// call process trans 
                    //int br = 1;
                    //ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(obj.A_JOURNAL_HEADER.COMP_CODE), br, jouranalHeader.VoucherID, "JourVouchr", "Update", db);
                    //if (res.ResponseState == true)
                    //{

                    //    dbTransaction.Commit();
                    //    LogUser.InsertPrint(db, obj.A_JOURNAL_HEADER.COMP_CODE.ToString(), obj.Branch_Code.ToString(), obj.sec_FinYear.ToString(), obj.UserCode, obj.A_JOURNAL_HEADER.VOUCHER_CODE, LogUser.UserLog.Update, obj.MODULE_CODE, true, null, res.ResponseData.ToString(), null);

                    //    var displayData = db.AQ_GetJournalHeader.Where(x => x.VoucherID == jouranalHeader.VoucherID).FirstOrDefault();
                    //    return Ok(new BaseResponse(displayData));
                    //}
                    //else
                    //{
                    //    LogUser.InsertPrint(db, obj.A_JOURNAL_HEADER.COMP_CODE.ToString(), obj.Branch_Code.ToString(), obj.sec_FinYear.ToString(), obj.UserCode, obj.A_JOURNAL_HEADER.VOUCHER_CODE, LogUser.UserLog.Update, obj.MODULE_CODE, false, res.ResponseMessage.ToString(), res.ResponseData.ToString(), null);
                    //    dbTransaction.Rollback();
                    //    return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, res.ResponseMessage));
                    //}
                }
                catch (Exception ex)
                {

                    dbTransaction.Rollback();
                    return Ok(new BaseResponse(ex.Message));
                }
            }
        }




        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetLnkVoucherById(int TrID, int CompCode, string tr_code)
        {

            List<AProc_GetLnkVoucher_Result> list = db.AProc_GetLnkVoucher(CompCode, tr_code, TrID).ToList();
            //var list = db.Database.SqlQuery<AQ_GetLnkVoucher>("select * from [dbo].[AQ_GetLnkVoucher] where TrID = " + TrID + "").ToList();
            return Ok(new BaseResponse(list));
        }



        [HttpGet, AllowAnonymous]
        public IHttpActionResult LnkVoucherGenerate(int TrID, int CompCode, int BranchCode, string tr_code)
        {
            string Quy = "DECLARE @ok INT; exec  [Aproc_LnkVoucherGenerate] " + CompCode + " , " + BranchCode + " ,'I','" + tr_code + "'," + TrID + " ,'admin',1,@ok output";
            db.Database.ExecuteSqlCommand(Quy);

            List<AProc_GetLnkVoucher_Result> list = db.AProc_GetLnkVoucher(CompCode, tr_code, TrID).ToList();
            return Ok(new BaseResponse(list));
        }



        [HttpGet, AllowAnonymous]
        public IHttpActionResult LoadTransactions(int Comp, int branchCode, string TrType, string StartDate, string EndDate, int? FromNum, int? ToNum, string UserCode, string Token, string Modules, string FinYear)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                db.GLnk_GenerateTrans(Comp, branchCode, UserCode, "I", TrType, StartDate, EndDate, FromNum, ToNum);
                List<G_LnkTrans_Temp> Arrays = GlnktransTempService.GetAll(s => s.User_Code == UserCode).ToList();
                LogUser.InsertPrint(db, Comp.ToString(), branchCode.ToString(), FinYear, UserCode, null,  null, LogUser.UserLog.View, Modules, true, null, null, "LoadTransactions");

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
            foreach (G_LnkTrans_Temp item in lnkTempList)
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
                string userCode = lnkTempList[0].User_Code;
                List<GQ_GetLnkVoucherDetail> VchDeatilList = IVchrTemplateDetailService.GetAllFromView(s => s.User_Code == userCode).ToList();

                LogUser.InsertPrint(db, lnkTempList[0].Comp_Code.ToString(), lnkTempList[0].Branch_Code.ToString(), lnkTempList[0].sec_FinYear, lnkTempList[0].UserCode, null,null, LogUser.UserLog.Update, lnkTempList[0].MODULE_CODE, true, null, null, null);

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
                List<G_LnkTrans_Temp> VchDeatilList = GlnktransTempService.GetAll(s => s.User_Code == UserCode);
                return Ok(new BaseResponse(VchDeatilList));
            }
            return BadRequest(ModelState);
        }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GenerateVoucher(int comp, int branch, string Desc, string VoucherDate, string UserCode, string Token, string sec_FinYear, string MODULE_CODE)
        {
            if (ModelState.IsValid)
            {
                int Trno = 0;
                ObjectParameter objParameterOk = new ObjectParameter("vTrno", Trno);
                int RetValue = db.GLnk_GenerateVoucherVer2(comp, branch, UserCode, Desc, VoucherDate, objParameterOk);
                if (Convert.ToInt32(objParameterOk.Value) != 0)
                {
                    Trno = Convert.ToInt32(objParameterOk.Value);
                }
                else
                {
                    Trno = -1;
                }

                LogUser.InsertPrint(db, comp.ToString(), branch.ToString(), sec_FinYear, UserCode, null,"", LogUser.UserLog.Update, MODULE_CODE, true, null, null, "GenerateVoucher" + Desc);

                return Ok(new BaseResponse(Trno));
            }
            return BadRequest(ModelState);
        }

    }
}
