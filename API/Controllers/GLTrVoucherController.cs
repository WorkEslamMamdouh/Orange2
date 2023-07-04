using Inv.API.Models;
using Inv.API.Models.CustomModel;
using Inv.API.Tools;
using Inv.BLL.Services.GCostCenter;
using Inv.BLL.Services.GLTrVoucher;
using Inv.BLL.Services.JournalDetail;
using Inv.BLL.Services.JournalHeader;
using Inv.BLL.Services.TmpVoucherProcess;
using Inv.BLL.Services.VchrTemplateDetail;
using Inv.BLL.Services.VchrTemplateHeader;
using Inv.BLL.Services.VoucherType;
using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Net;
using System.Web.Http;
namespace Inv.API.Controllers
{
    public class GLTrVoucherController : BaseController
    {
        private readonly IGLTrVoucherService IGLTrVoucherService;
        private readonly IVoucherTypeService IVoucherTypeService;
        private readonly IGCostCenterService IGCostCenterService;
        private readonly IJornalHeaderService IJornalHeaderService;
        private readonly IJournalDetailService IJournalDetailService;
        private readonly ITmpVoucherProcessService ITmpVoucherProcessService;
        private readonly IVchrTemplateDetailService IVchrTemplateDetailService;
        private readonly IVchrTemplateHeaderService IVchrTemplateHeaderService;

        private readonly G_USERSController UserControl;

        public GLTrVoucherController(IGLTrVoucherService _IGLTrVoucherService, IGCostCenterService _IGCostCenterService,
            IVoucherTypeService _IVoucherTypeService, G_USERSController _Control, IJournalDetailService _IJournalDetailService,
            IJornalHeaderService _IJornalHeaderService, ITmpVoucherProcessService _ITmpVoucherProcessService,
            IVchrTemplateHeaderService _IVchrTemplateHeaderService, IVchrTemplateDetailService _IVchrTemplateDetailService)
        {
            IVchrTemplateHeaderService = _IVchrTemplateHeaderService;
            IVchrTemplateDetailService = _IVchrTemplateDetailService;
            IGLTrVoucherService = _IGLTrVoucherService;
            IVoucherTypeService = _IVoucherTypeService;
            IGCostCenterService = _IGCostCenterService;
            IJornalHeaderService = _IJornalHeaderService;
            IJournalDetailService = _IJournalDetailService;
            ITmpVoucherProcessService = _ITmpVoucherProcessService;
            UserControl = _Control;
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAll(int CompCode, string UserCode, string Token)
        {
            //if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            //{
            List<A_Voucher_Types> VoucherTypesList = IVoucherTypeService.GetAll(x => x.COMP_CODE == CompCode).ToList();
            return Ok(new BaseResponse(VoucherTypesList));
            //}
            //return BadRequest(ModelState);
        }



        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllConistraint(string UserCode, string Token)
        {
            //if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            //{
            List<A_Voucher_Types> VoucherTypesList = IVoucherTypeService.GetAll().ToList();
            return Ok(new BaseResponse(VoucherTypesList));
            //}
            //return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllVoucherTypes(int CompCode, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                List<A_Voucher_Types> VoucherTypesList = IVoucherTypeService.GetAll(x => x.COMP_CODE == CompCode).ToList();
                return Ok(new BaseResponse(VoucherTypesList));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllVoucherTypes(int VoucherType, int CompCode, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                List<A_Voucher_Types> VoucherTypesList = IVoucherTypeService.GetAll(x => x.COMP_CODE == CompCode && x.VoucherType == VoucherType).ToList();
                return Ok(new BaseResponse(VoucherTypesList));
            }
            return BadRequest(ModelState);
        }
        public IHttpActionResult GetAllVoucher(int CompCode, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                List<A_Voucher_Types> VoucherTypesList = IVoucherTypeService.GetAll(x => x.COMP_CODE == CompCode).ToList();
                return Ok(new BaseResponse(VoucherTypesList));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllCostCenters(int CompCode, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                List<G_COST_CENTER> VoucherTypesList = IGCostCenterService.GetAll(x => x.COMP_CODE == CompCode).ToList();
                return Ok(new BaseResponse(VoucherTypesList));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllAQ_GetJournalHeader(int CompCode, string FromDate, string toDate, int? source, int status, int? type, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                string s = "select * from AQ_GetJournalHeader where COMP_CODE = " + CompCode + "and  VOUCHER_DATE >=' " + FromDate + "' and VOUCHER_DATE <= ' " + toDate + " ' ";
                string condition = "";
                if (source != 0 && source != null)
                {
                    condition = condition + " and SOURCE_TYPE = " + source;
                }

                if (type != 0 && type != null)
                {
                    condition = condition + " and TYPE_CODE = " + type;
                }

                if (status == 3)
                {
                    condition = condition + "";
                }
                else
                {
                    condition = condition + " and VOUCHER_STATUS = " + status;
                }

                string query = s + condition + " ORDER BY VOUCHER_CODE DESC;";
                List<AQ_GetJournalHeader> res = db.Database.SqlQuery<AQ_GetJournalHeader>(query).ToList();
                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllJournalDetail(int VoucherID, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {

                List<AQ_GetJournalDetail> res2 = db.Database.SqlQuery<AQ_GetJournalDetail>("select * from AQ_GetJournalDetail where  VoucherID = " + VoucherID + "").ToList();
                //List<AQ_GetJournalDetail> res2 = db.AQ_GetJournalDetail.Where(x => x.VoucherID == VoucherID).ToList();
                return Ok(new BaseResponse(res2));
            }
            return BadRequest(ModelState);
        }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllAQ_GetJournal(int CompCode, string USER_CODE, string FromDate, string toDate, int? source, int status, int? type, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                string s = "select * from AQ_GetJournalHeader where COMP_CODE = " + CompCode + "and  VOUCHER_DATE >=' " + FromDate + "' and VOUCHER_DATE <= ' " + toDate + " ' ";
                string condition = "";
                if (source != 0 && source != null)
                {
                    condition = condition + " and SOURCE_TYPE = " + source;
                }

                if (type != 0 && type != null)
                {
                    condition = condition + " and TYPE_CODE = " + type;
                }

                if (USER_CODE != "NUll")
                {
                    condition = condition + " and CREATED_BY = '" + USER_CODE + "'";
                }

                if (status == 3)
                {
                    condition = condition + "";
                }
                else
                {
                    condition = condition + " and VOUCHER_STATUS = " + status;
                }

                string query = s + condition + " ORDER BY VOUCHER_CODE DESC;";
                List<AQ_GetJournalHeader> res = db.Database.SqlQuery<AQ_GetJournalHeader>(query).ToList();
                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllAQ_GetCashVoucherHeader(int CompCode, string USER_CODE, string FromDate, string toDate, int? source, int status, int? type, int TRType, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                string s = "select * from AQ_GetCashVoucherHeader where COMP_CODE = " + CompCode + "and  VOUCHER_DATE >=' " + FromDate + "' and VOUCHER_DATE <= ' " + toDate + " 'and TRType = " + TRType + " ";
                string condition = "";
                if (source != 0 && source != null)
                {
                    condition = condition + " and SOURCE_TYPE = " + source;
                }

                if (type != 0 && type != null)
                {
                    condition = condition + " and TYPE_CODE = " + type;
                }

                if (USER_CODE != "NUll")
                {
                    condition = condition + " and CREATED_BY = '" + USER_CODE + "'";
                }

                if (status == 3)
                {
                    condition = condition + "";
                }
                else
                {
                    condition = condition + " and VOUCHER_STATUS = " + status;
                }

                string query = s + condition + " ORDER BY VOUCHER_CODE DESC;";
                List<AQ_GetCashVoucherHeader> res = db.Database.SqlQuery<AQ_GetCashVoucherHeader>(query).ToList();
                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }


       


        [HttpPost, AllowAnonymous]
        public IHttpActionResult InsertJournalMasterDetail([FromBody]JournalMasterDetails obj)
        {
            //if (ModelState.IsValid && UserControl.CheckUser(obj.Token, obj.UserCode))
            //{
            using (System.Data.Entity.DbContextTransaction dbTransaction = db.Database.BeginTransaction())
            {
                try
                {
                    A_JOURNAL_HEADER jouranalHeader = IJornalHeaderService.Insert(obj.A_JOURNAL_HEADER);
                    foreach (A_JOURNAL_DETAIL item in obj.A_JOURNAL_DETAIL)
                    {
                        item.VoucherID = jouranalHeader.VoucherID;
                        IJournalDetailService.Insert(item);
                    }
                    //// call process trans 
                    int br = 1;
                    ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(obj.A_JOURNAL_HEADER.COMP_CODE), Convert.ToInt32(obj.Branch_Code), jouranalHeader.VoucherID, "JourVouchr", "Add", db);
                    if (res.ResponseState == true)
                    {
                        obj.A_JOURNAL_HEADER.VOUCHER_CODE = int.Parse(res.ResponseData.ToString());
                        dbTransaction.Commit();
                        LogUser.InsertPrint(db, obj.A_JOURNAL_HEADER.COMP_CODE.ToString(), obj.Branch_Code.ToString(), obj.sec_FinYear.ToString(), obj.UserCode, obj.A_JOURNAL_HEADER.VoucherID, obj.A_JOURNAL_HEADER.VOUCHER_CODE.ToString(), LogUser.UserLog.Insert, "JournalVoucher", true, null, res.ResponseData.ToString(), null);

                        AQ_GetJournalHeader displayData = db.AQ_GetJournalHeader.Where(x => x.VoucherID == jouranalHeader.VoucherID).FirstOrDefault();
                        return Ok(new BaseResponse(displayData));
                    }
                    else
                    {


                        dbTransaction.Rollback();
                        LogUser.InsertPrint(db, obj.A_JOURNAL_HEADER.COMP_CODE.ToString(), obj.Branch_Code.ToString(), obj.sec_FinYear.ToString(), obj.UserCode, obj.A_JOURNAL_HEADER.VoucherID, obj.A_JOURNAL_HEADER.VOUCHER_CODE.ToString(), LogUser.UserLog.Insert, "JournalVoucher", false, res.ResponseMessage.ToString(), res.ResponseData.ToString(), null);
                        return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, res.ResponseMessage));
                    }
                    ////////
                }
                catch (Exception ex)
                {

                    dbTransaction.Rollback();
                    LogUser.InsertPrint(db, obj.A_JOURNAL_HEADER.COMP_CODE.ToString(), obj.Branch_Code.ToString(), obj.sec_FinYear.ToString(), obj.UserCode, obj.A_JOURNAL_HEADER.VoucherID, obj.A_JOURNAL_HEADER.VOUCHER_CODE.ToString(), LogUser.UserLog.Insert, "JournalVoucher", false, ex.Message, ex.Message, null);
                    return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                }
            }
            //}
            //return BadRequest(ModelState);
        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult UpdateJournalMasterDetail([FromBody]JournalMasterDetails obj)
        {
            //if (ModelState.IsValid && UserControl.CheckUser(obj.Token, obj.UserCode))
            //{
            using (System.Data.Entity.DbContextTransaction dbTransaction = db.Database.BeginTransaction())
            {
                try
                {
                    A_JOURNAL_HEADER jouranalHeader = IJornalHeaderService.Update(obj.A_JOURNAL_HEADER);




                    //update Details
                    List<A_JOURNAL_DETAIL> insertedObjects = obj.A_JOURNAL_DETAIL.Where(x => x.StatusFlag == 'i').ToList();
                    List<A_JOURNAL_DETAIL> deletedObjects = obj.A_JOURNAL_DETAIL.Where(x => x.StatusFlag == 'd').ToList();
                    List<A_JOURNAL_DETAIL> updatedObjects = obj.A_JOURNAL_DETAIL.Where(x => x.StatusFlag == 'u').ToList();
                    List<A_JOURNAL_DETAIL> updatedRowObjects = obj.A_JOURNAL_DETAIL.Where(x => x.FlagUpdate == 's').ToList();



                    foreach (A_JOURNAL_DETAIL item in insertedObjects)
                    {
                        item.VoucherID = obj.A_JOURNAL_HEADER.VoucherID;
                        IJournalDetailService.Insert(item);
                    }

                    foreach (A_JOURNAL_DETAIL item in deletedObjects)
                    {
                        IJournalDetailService.Delete(item.VoucherDetailID);
                        //string query = "DELETE FROM A_JOURNAL_DETAIL  WHERE COMP_CODE = " + item.COMP_CODE + " and VOUCHER_CODE =" + item.VOUCHER_CODE + "and VOUCHER_SERIAL = "+item.VOUCHER_SERIAL;
                        // db.Database.ExecuteSqlCommand(query);
                    }

                    //*************************************************Update************************
                    foreach (A_JOURNAL_DETAIL item in updatedRowObjects)
                    {
                        item.VoucherID = obj.A_JOURNAL_HEADER.VoucherID;
                        IJournalDetailService.Update(item);
                    }

                    string sql = " ";
                    foreach (A_JOURNAL_DETAIL item in updatedObjects)
                    {
                        item.VoucherID = obj.A_JOURNAL_HEADER.VoucherID;
                        sql = sql + " update A_JOURNAL_DETAIL set VOUCHER_SERIAL = " + item.VOUCHER_SERIAL + " , DESCA =N'" + item.DESCA + "' where VoucherDetailID =  " + item.VoucherDetailID + " and VoucherID = " + item.VoucherID + " ";
                    }
                    if (updatedObjects.Count() > 0)
                    {
                        db.Database.ExecuteSqlCommand(sql);
                    }
                    //*************************************************************************************


                    if (obj.A_JOURNAL_HEADER.VOUCHER_STATUS == 2)
                    {
                        //db.A_ProcessVouchers("", obj.A_JOURNAL_HEADER.COMP_CODE, 1, 3);
                    }

                    //// call process trans 
                    int br = 1;
                    ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(obj.A_JOURNAL_HEADER.COMP_CODE), br, jouranalHeader.VoucherID, "JourVouchr", "Update", db);
                    if (res.ResponseState == true)
                    {

                        dbTransaction.Commit();
                        LogUser.InsertPrint(db, obj.A_JOURNAL_HEADER.COMP_CODE.ToString(), obj.Branch_Code.ToString(), obj.sec_FinYear.ToString(), obj.UserCode, obj.A_JOURNAL_HEADER.VoucherID, obj.A_JOURNAL_HEADER.VOUCHER_CODE.ToString(), LogUser.UserLog.Update, obj.MODULE_CODE, true, null, res.ResponseData.ToString(), null);

                        AQ_GetJournalHeader displayData = db.AQ_GetJournalHeader.Where(x => x.VoucherID == jouranalHeader.VoucherID).FirstOrDefault();
                        return Ok(new BaseResponse(displayData));
                    }
                    else
                    {
                        LogUser.InsertPrint(db, obj.A_JOURNAL_HEADER.COMP_CODE.ToString(), obj.Branch_Code.ToString(), obj.sec_FinYear.ToString(), obj.UserCode, obj.A_JOURNAL_HEADER.VoucherID, obj.A_JOURNAL_HEADER.VOUCHER_CODE.ToString(), LogUser.UserLog.Update, obj.MODULE_CODE, false, res.ResponseMessage.ToString(), res.ResponseData.ToString(), null);

                        dbTransaction.Rollback();
                        return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, res.ResponseMessage));
                    }
                }
                catch (Exception ex)
                {
                    LogUser.InsertPrint(db, obj.A_JOURNAL_HEADER.COMP_CODE.ToString(), obj.Branch_Code.ToString(), obj.sec_FinYear.ToString(), obj.UserCode, obj.A_JOURNAL_HEADER.VoucherID, obj.A_JOURNAL_HEADER.VOUCHER_CODE.ToString(), LogUser.UserLog.Update, obj.MODULE_CODE, false, ex.Message, ex.Message, null);

                    dbTransaction.Rollback();
                    return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                }
            }
            //}
            //return BadRequest(ModelState);
        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult Open([FromBody]JournalMasterDetails obj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(obj.Token, obj.UserCode))
            {
                using (System.Data.Entity.DbContextTransaction dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        A_JOURNAL_HEADER jouranalHeader = IJornalHeaderService.Update(obj.A_JOURNAL_HEADER);



                        //// call process trans 
                        int br = 1;
                        ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(obj.A_JOURNAL_HEADER.COMP_CODE), br, jouranalHeader.VoucherID, "JourVouchr", "Open", db);
                        if (res.ResponseState == true)
                        {

                            dbTransaction.Commit();
                            LogUser.InsertPrint(db, obj.A_JOURNAL_HEADER.COMP_CODE.ToString(), obj.Branch_Code.ToString(), obj.sec_FinYear.ToString(), obj.UserCode, obj.A_JOURNAL_HEADER.VoucherID, obj.A_JOURNAL_HEADER.VOUCHER_CODE.ToString(), LogUser.UserLog.Open, obj.MODULE_CODE, true, null, res.ResponseData.ToString(), null);

                            AQ_GetJournalHeader displayData = db.AQ_GetJournalHeader.Where(x => x.VoucherID == jouranalHeader.VoucherID).FirstOrDefault();
                            return Ok(new BaseResponse(displayData));
                        }
                        else
                        {

                            dbTransaction.Rollback();
                            LogUser.InsertPrint(db, obj.A_JOURNAL_HEADER.COMP_CODE.ToString(), obj.Branch_Code.ToString(), obj.sec_FinYear.ToString(), obj.UserCode, obj.A_JOURNAL_HEADER.VoucherID, obj.A_JOURNAL_HEADER.VOUCHER_CODE.ToString(), LogUser.UserLog.Open, obj.MODULE_CODE, false, res.ResponseMessage.ToString(), res.ResponseData.ToString(), null);
                            return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, res.ResponseMessage));
                        }
                    }
                    catch (Exception ex)
                    {

                        dbTransaction.Rollback();
                        LogUser.InsertPrint(db, obj.A_JOURNAL_HEADER.COMP_CODE.ToString(), obj.Branch_Code.ToString(), obj.sec_FinYear.ToString(), obj.UserCode, obj.A_JOURNAL_HEADER.VoucherID, obj.A_JOURNAL_HEADER.VOUCHER_CODE.ToString(), LogUser.UserLog.Open, obj.MODULE_CODE, false, ex.Message, ex.Message, null);
                        return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                    }
                }
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult CodeFoundBefore(int VoucherCode, int compCode, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                List<A_JOURNAL_HEADER> AccDefVendor = IJornalHeaderService.GetAll(x => x.COMP_CODE == compCode && x.VOUCHER_CODE == VoucherCode);

                return Ok(new BaseResponse(AccDefVendor));
            }
            return BadRequest(ModelState);
        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult Insert_A_TmpVoucher_Proc(List<A_TmpVoucherProcess> A_TmpVouProList)
        {

            if (ModelState.IsValid && UserControl.CheckUser(A_TmpVouProList[0].Token, A_TmpVouProList[0].UserCode))
            {

                using (System.Data.Entity.DbContextTransaction dbTransaction = db.Database.BeginTransaction())
                {

                    try
                    {
                        db.Database.ExecuteSqlCommand("DELETE FROM A_TmpVoucherProcess WHERE CurrentUserCode = '" + A_TmpVouProList[0].UserCode + "'");

                        ITmpVoucherProcessService.InsertLst(A_TmpVouProList);


                        int res = db.A_ProcessVouchers(A_TmpVouProList[0].UserCode, A_TmpVouProList[0].COMP_CODE,Convert.ToInt16(A_TmpVouProList[0].sec_FinYear), 1, A_TmpVouProList[0].OpCode);
                        if (res > 0)
                        {
                            dbTransaction.Commit();
                            return Ok(new BaseResponse(res));
                        }
                        else
                        {
                            dbTransaction.Rollback();
                            return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, "Error"));
                        }

                    }
                    catch (Exception ex)
                    {
                        dbTransaction.Rollback();
                        return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                    }

                }
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult ReverseVoucher(int? comp, int VoucherId, string UserCode, string Token, string Branch_Code, string sec_FinYear, string MODULE_CODE)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                ObjectParameter objParameterOk = new ObjectParameter("newID", VoucherId);
                db.AProc_ReverseVoucher(comp, UserCode, VoucherId, objParameterOk);
                int newID = Convert.ToInt32(objParameterOk.Value);
                List<AQ_GetJournalHeader> VoucherHeader = db.AQ_GetJournalHeader.Where(x => x.VoucherID == newID).ToList();
                List<AQ_GetJournalDetail> VoucherDetailList = db.AQ_GetJournalDetail.Where(s => s.VoucherID == newID).ToList();
                AQ_GetJournalHeaderWithDetail customObj = new AQ_GetJournalHeaderWithDetail
                {
                    AQ_GetJournalHeader = VoucherHeader,
                    AQ_GetJournalDetail = VoucherDetailList
                };
                LogUser.InsertPrint(db, comp.ToString(), Branch_Code, sec_FinYear, UserCode, VoucherId, VoucherHeader[0].VOUCHER_CODE.ToString(), LogUser.UserLog.Update, MODULE_CODE, true, null, VoucherId.ToString(), "عكس القيد");

                return Ok(new BaseResponse(customObj));
            }
            return BadRequest(ModelState);
        }

        #region Template 

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetTemplateByID(int TemplateId, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                A_TR_VchrTemplate VoucherHeader = IVchrTemplateHeaderService.GetAll(x => x.TemplateID == TemplateId).FirstOrDefault();
                List<A_TR_VchrTemplateDetail> VoucherDetailList = IVchrTemplateDetailService.GetAll(s => s.TemplateID == TemplateId).ToList();
                VchrTemplatMasterDetail customObj = new VchrTemplatMasterDetail
                {
                    A_TR_VchrTemplate = VoucherHeader,
                    A_TR_VchrTemplateDetail = VoucherDetailList
                };
                return Ok(new BaseResponse(customObj));
            }
            return BadRequest(ModelState);
        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult InsertJournalTemplateMasterDetail([FromBody]VchrTemplatMasterDetail obj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(obj.Token, obj.UserCode))
            {
                using (System.Data.Entity.DbContextTransaction dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        A_TR_VchrTemplate TempHeader = IVchrTemplateHeaderService.Insert(obj.A_TR_VchrTemplate);
                        foreach (A_TR_VchrTemplateDetail item in obj.A_TR_VchrTemplateDetail)
                        {
                            item.TemplateID = TempHeader.TemplateID;
                            IVchrTemplateDetailService.Insert(item);
                        }
                        //// call process trans 
                        int br = 1;
                        ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(obj.A_TR_VchrTemplate.COMP_CODE), br, TempHeader.TemplateID, "JourTemp", "Add", db);
                        if (res.ResponseState == true)
                        {
                            obj.A_TR_VchrTemplate.VOUCHER_CODE = int.Parse(res.ResponseData.ToString());
                            dbTransaction.Commit();
                            return Ok(new BaseResponse(obj.A_TR_VchrTemplate));
                        }
                        else
                        {
                            dbTransaction.Rollback();
                            return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, res.ResponseMessage));
                        }
                    }
                    catch (Exception ex)
                    {
                        dbTransaction.Rollback();
                        return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                    }
                }
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult DeleteJournalTemplateMasterDetail(int TemplateID, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                List<A_TR_VchrTemplateDetail> DetailObjects = IVchrTemplateDetailService.GetAll(s => s.TemplateID == TemplateID).ToList();
                foreach (A_TR_VchrTemplateDetail item in DetailObjects)
                {
                    IVchrTemplateDetailService.Delete(item.VoucherDetailID);
                }
                IVchrTemplateHeaderService.Delete(TemplateID);
                return Ok(new BaseResponse(200));
            }
            return BadRequest(ModelState);
        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult UpdateJournalTemplateMasterDetail([FromBody]VchrTemplatMasterDetail obj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(obj.Token, obj.UserCode))
            {
                using (System.Data.Entity.DbContextTransaction dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        A_TR_VchrTemplate TempHeader = IVchrTemplateHeaderService.Update(obj.A_TR_VchrTemplate);

                        //update Details
                        List<A_TR_VchrTemplateDetail> insertedObjects = obj.A_TR_VchrTemplateDetail.Where(x => x.StatusFlag == 'i').ToList();
                        List<A_TR_VchrTemplateDetail> updatedObjects = obj.A_TR_VchrTemplateDetail.Where(x => x.StatusFlag == 'u').ToList();
                        List<A_TR_VchrTemplateDetail> deletedObjects = obj.A_TR_VchrTemplateDetail.Where(x => x.StatusFlag == 'd').ToList();

                        foreach (A_TR_VchrTemplateDetail item in insertedObjects)
                        {
                            item.TemplateID = obj.A_TR_VchrTemplate.TemplateID;
                            IVchrTemplateDetailService.Insert(item);
                        }
                        foreach (A_TR_VchrTemplateDetail item in updatedObjects)
                        {
                            item.TemplateID = obj.A_TR_VchrTemplate.TemplateID;
                            IVchrTemplateDetailService.Update(item);
                        }
                        foreach (A_TR_VchrTemplateDetail item in deletedObjects)
                        {
                            IVchrTemplateDetailService.Delete(item.VoucherDetailID);
                        }

                        //// call process trans 
                        int br = 1;
                        ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(obj.A_TR_VchrTemplate.COMP_CODE), br, TempHeader.TemplateID, "JourTemp", "Update", db);
                        if (res.ResponseState == true)
                        {

                            dbTransaction.Commit();
                            return Ok(new BaseResponse(obj.A_TR_VchrTemplate));
                        }
                        else
                        {
                            dbTransaction.Rollback();
                            return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, res.ResponseMessage));
                        }
                    }
                    catch (Exception ex)
                    {
                        dbTransaction.Rollback();
                        return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                    }
                }
            }

            return BadRequest(ModelState);
        }

        #endregion

    }
}
