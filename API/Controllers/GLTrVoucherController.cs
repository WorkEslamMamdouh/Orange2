using Inv.API.Models;
using Inv.API.Tools;
using Inv.BLL.Services.GLTrVoucher;
using Inv.BLL.Services.VoucherType;
using Inv.BLL.Services.GCostCenter;
using Inv.BLL.Services.JournalHeader;
using Inv.BLL.Services.JournalDetail;
using Inv.BLL.Services.VchrTemplateHeader;
using Inv.BLL.Services.VchrTemplateDetail;
using Inv.BLL.Services.TmpVoucherProcess;
using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Inv.API.Controllers;
using System.Data.SqlClient;
using Inv.API.Models.CustomModel;
using System.Data.Entity.Core.Objects;
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
            this.IVchrTemplateHeaderService = _IVchrTemplateHeaderService;
            this.IVchrTemplateDetailService = _IVchrTemplateDetailService;
            this.IGLTrVoucherService = _IGLTrVoucherService;
            this.IVoucherTypeService = _IVoucherTypeService;
            this.IGCostCenterService = _IGCostCenterService;
            this.IJornalHeaderService = _IJornalHeaderService;
            this.IJournalDetailService = _IJournalDetailService;
            this.ITmpVoucherProcessService = _ITmpVoucherProcessService;
            this.UserControl = _Control;
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAll(  string UserCode, string Token)
        {
            //if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            //{
                var VoucherTypesList = IVoucherTypeService.GetAll( ).ToList();
                return Ok(new BaseResponse(VoucherTypesList));
            //}
            //return BadRequest(ModelState);
        }


        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllVoucherTypes(int CompCode, int VoucherType, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var VoucherTypesList = IVoucherTypeService.GetAll(x => x.COMP_CODE == CompCode && x.VoucherType == VoucherType).ToList();
                return Ok(new BaseResponse(VoucherTypesList));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllCostCenters(int CompCode, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var VoucherTypesList = IGCostCenterService.GetAll(x => x.COMP_CODE == CompCode).ToList();
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
                    condition = condition + " and SOURCE_TYPE = " + source;

                if (type != 0 && type != null)
                    condition = condition + " and TYPE_CODE = " + type;

                if (status == 3)
                    condition = condition + "";
                else
                {
                    condition = condition + " and VOUCHER_STATUS = " + status;
                }

                string query = s + condition + " ORDER BY VOUCHER_CODE ";
                var res = db.Database.SqlQuery<AQ_GetJournalHeader>(query).ToList();
                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllJournalDetail(int VoucherID, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var res2 = db.AQ_GetJournalDetail.Where(x => x.VoucherID == VoucherID).ToList();
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
                    condition = condition + " and SOURCE_TYPE = " + source;

                if (type != 0 && type != null)
                    condition = condition + " and TYPE_CODE = " + type;
                if (USER_CODE != "NUll")
                    condition = condition + " and CREATED_BY = '" + USER_CODE + "'";

                if (status == 3)
                    condition = condition + "";
                else
                {
                    condition = condition + " and VOUCHER_STATUS = " + status;
                }

                string query = s + condition;
                var res = db.Database.SqlQuery<AQ_GetJournalHeader>(query).ToList();
                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult InsertJournalMasterDetail([FromBody]JournalMasterDetails obj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(obj.Token, obj.UserCode))
            {
                using (var dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        var jouranalHeader = IJornalHeaderService.Insert(obj.A_JOURNAL_HEADER);
                      foreach (var item in obj.A_JOURNAL_DETAIL)
                        {
                            item.VoucherID = jouranalHeader.VoucherID;
                            IJournalDetailService.Insert(item);
                        }
                        //// call process trans 
                        var br = 1;
                        ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(obj.A_JOURNAL_HEADER.COMP_CODE), br, jouranalHeader.VoucherID, "JourVouchr", "Add", db);
                        if (res.ResponseState == true)
                        {
                            obj.A_JOURNAL_HEADER.VOUCHER_CODE = int.Parse(res.ResponseData.ToString());
                            dbTransaction.Commit();
                            return Ok(new BaseResponse(obj.A_JOURNAL_HEADER));
                    }
                        else
                        {
                        dbTransaction.Rollback();
                        return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, res.ResponseMessage));
                    }
                    ////////
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

        [HttpPost, AllowAnonymous]
        public IHttpActionResult UpdateJournalMasterDetail([FromBody]JournalMasterDetails obj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(obj.Token, obj.UserCode))
            {
                using (var dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        var jouranalHeader = IJornalHeaderService.Update(obj.A_JOURNAL_HEADER);

                        //update Details
                        var insertedObjects = obj.A_JOURNAL_DETAIL.Where(x => x.StatusFlag == 'i').ToList();
                        var updatedObjects = obj.A_JOURNAL_DETAIL.Where(x => x.StatusFlag == 'u').ToList();
                        var deletedObjects = obj.A_JOURNAL_DETAIL.Where(x => x.StatusFlag == 'd').ToList();

                        foreach (var item in insertedObjects)
                        {
                            item.VoucherID = obj.A_JOURNAL_HEADER.VoucherID;
                            IJournalDetailService.Insert(item);
                        }
                        foreach (var item in updatedObjects)
                        {
                            item.VoucherID = obj.A_JOURNAL_HEADER.VoucherID;
                            IJournalDetailService.Update(item);
                        }
                        foreach (var item in deletedObjects)
                        {
                            IJournalDetailService.Delete(item.VoucherDetailID);
                            //string query = "DELETE FROM A_JOURNAL_DETAIL  WHERE COMP_CODE = " + item.COMP_CODE + " and VOUCHER_CODE =" + item.VOUCHER_CODE + "and VOUCHER_SERIAL = "+item.VOUCHER_SERIAL;
                            // db.Database.ExecuteSqlCommand(query);
                        }

                        //// call process trans 
                        var br = 1;
                        ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(obj.A_JOURNAL_HEADER.COMP_CODE), br, jouranalHeader.VoucherID, "JourVouchr", "Update", db);
                        if (res.ResponseState == true)
                        {

                            dbTransaction.Commit();
                            return Ok(new BaseResponse(obj.A_JOURNAL_HEADER));
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

        [HttpPost, AllowAnonymous]
        public IHttpActionResult Open([FromBody]JournalMasterDetails obj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(obj.Token, obj.UserCode))
            {
                using (var dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        var jouranalHeader = IJornalHeaderService.Update(obj.A_JOURNAL_HEADER);

                        //update Details
                        var insertedObjects = obj.A_JOURNAL_DETAIL.Where(x => x.StatusFlag == 'i').ToList();
                        var updatedObjects = obj.A_JOURNAL_DETAIL.Where(x => x.StatusFlag == 'u').ToList();
                        var deletedObjects = obj.A_JOURNAL_DETAIL.Where(x => x.StatusFlag == 'd').ToList();

                        foreach (var item in insertedObjects)
                        {
                            item.VOUCHER_CODE = obj.A_JOURNAL_HEADER.VOUCHER_CODE;
                            IJournalDetailService.Insert(item);
                        }
                        foreach (var item in updatedObjects)
                        {
                            item.VoucherID = obj.A_JOURNAL_HEADER.VoucherID;
                            IJournalDetailService.Update(item);
                        }
                        foreach (var item in deletedObjects)
                        {
                            IJournalDetailService.Delete(item.VoucherDetailID);
                            //string query = "DELETE FROM A_JOURNAL_DETAIL  WHERE COMP_CODE = " + item.COMP_CODE + " and VOUCHER_CODE =" + item.VOUCHER_CODE + "and VOUCHER_SERIAL = "+item.VOUCHER_SERIAL;
                            // db.Database.ExecuteSqlCommand(query);
                        }

                        //// call process trans 
                        var br = 1;
                        ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(obj.A_JOURNAL_HEADER.COMP_CODE), br, jouranalHeader.VoucherID, "JourVouchr", "Open", db);
                        if (res.ResponseState == true)
                        {

                            dbTransaction.Commit();
                            return Ok(new BaseResponse(obj.A_JOURNAL_HEADER));
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
        public IHttpActionResult CodeFoundBefore(int VoucherCode, int compCode, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var AccDefVendor = IJornalHeaderService.GetAll(x => x.COMP_CODE == compCode && x.VOUCHER_CODE == VoucherCode);

                return Ok(new BaseResponse(AccDefVendor));
            }
            return BadRequest(ModelState);
        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult Insert_A_TmpVoucher_Proc(List<A_TmpVoucherProcess> A_TmpVouProList)
        {


            if (ModelState.IsValid && UserControl.CheckUser(A_TmpVouProList[0].Token, A_TmpVouProList[0].UserCode))
            {

                using (var dbTransaction = db.Database.BeginTransaction())
                {

                    try
                    {
                        db.Database.ExecuteSqlCommand("DELETE FROM A_TmpVoucherProcess WHERE CurrentUserCode = '" + A_TmpVouProList[0].UserCode + "'");

                        ITmpVoucherProcessService.InsertLst(A_TmpVouProList);

                        int res = db.A_ProcessVouchers(A_TmpVouProList[0].UserCode, A_TmpVouProList[0].COMP_CODE,1,  A_TmpVouProList[0].OpCode);
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
        public IHttpActionResult ReverseVoucher(int? comp,int VoucherId, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                ObjectParameter objParameterOk = new ObjectParameter("newID", VoucherId);
               db.AProc_ReverseVoucher(comp, UserCode, VoucherId, objParameterOk);
                var newID =Convert.ToInt32( objParameterOk.Value);
                var VoucherHeader = db.AQ_GetJournalHeader.Where(x => x.VoucherID == newID).ToList();
                var VoucherDetailList = db.AQ_GetJournalDetail.Where(s => s.VoucherID == newID).ToList();
                AQ_GetJournalHeaderWithDetail customObj = new AQ_GetJournalHeaderWithDetail();
                customObj.AQ_GetJournalHeader = VoucherHeader;
                customObj.AQ_GetJournalDetail = VoucherDetailList;
                return Ok(new BaseResponse(customObj));
            }
            return BadRequest(ModelState);
        }

        #region Template 

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetTemplateByID( int TemplateId, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var VoucherHeader = IVchrTemplateHeaderService.GetAll(x => x.TemplateID == TemplateId).FirstOrDefault();
                var VoucherDetailList = IVchrTemplateDetailService.GetAll(s => s.TemplateID == TemplateId).ToList();
                VchrTemplatMasterDetail customObj = new VchrTemplatMasterDetail();
                customObj.A_TR_VchrTemplate = VoucherHeader;
                customObj.A_TR_VchrTemplateDetail = VoucherDetailList;
                return Ok(new BaseResponse(customObj));
            }
            return BadRequest(ModelState);
        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult InsertJournalTemplateMasterDetail([FromBody]VchrTemplatMasterDetail obj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(obj.Token, obj.UserCode))
            {
                using (var dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        var TempHeader = IVchrTemplateHeaderService.Insert(obj.A_TR_VchrTemplate);
                        foreach (var item in obj.A_TR_VchrTemplateDetail)
                        {
                            item.TemplateID = TempHeader.TemplateID;
                            IVchrTemplateDetailService.Insert(item);
                        }
                        //// call process trans 
                        var br = 1;
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
        public IHttpActionResult DeleteJournalTemplateMasterDetail(int TemplateID,string UserCode, string Token )
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                 var  DetailObjects=   IVchrTemplateDetailService.GetAll(s => s.TemplateID == TemplateID).ToList();
                    foreach(var item in DetailObjects)
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
                    using (var dbTransaction = db.Database.BeginTransaction())
                    {
                        try
                        {
                            var TempHeader = IVchrTemplateHeaderService.Update(obj.A_TR_VchrTemplate);

                            //update Details
                            var insertedObjects = obj.A_TR_VchrTemplateDetail.Where(x => x.StatusFlag == 'i').ToList();
                            var updatedObjects = obj.A_TR_VchrTemplateDetail.Where(x => x.StatusFlag == 'u').ToList();
                            var deletedObjects = obj.A_TR_VchrTemplateDetail.Where(x => x.StatusFlag == 'd').ToList();

                            foreach (var item in insertedObjects)
                            {
                                item.TemplateID = obj.A_TR_VchrTemplate.TemplateID;
                             IVchrTemplateDetailService.Insert(item);
                            }
                            foreach (var item in updatedObjects)
                            {
                            item.TemplateID = obj.A_TR_VchrTemplate.TemplateID;
                            IVchrTemplateDetailService.Update(item);
                            }
                            foreach (var item in deletedObjects)
                            {
                            IVchrTemplateDetailService.Delete(item.VoucherDetailID);
                            }

                            //// call process trans 
                            var br = 1;
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
