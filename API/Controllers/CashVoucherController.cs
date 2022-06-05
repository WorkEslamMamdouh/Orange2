using Inv.API.Models;
using Inv.API.Tools;
using Inv.BLL.Services.GLTrVoucher;
using Inv.BLL.Services.VoucherType;
using Inv.BLL.Services.GCostCenter;
using Inv.BLL.Services.CashVoucher;
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
    public class CashVoucherController : BaseController
    {
        private readonly IVoucherTypeService IVoucherTypeService;
        private readonly IGCostCenterService IGCostCenterService;
        private readonly ICashVoucherService ICashVoucherService;
 
        private readonly IVchrTemplateDetailService IVchrTemplateDetailService;
        private readonly IVchrTemplateHeaderService IVchrTemplateHeaderService;

        private readonly G_USERSController UserControl;

        public CashVoucherController(IGCostCenterService _IGCostCenterService,
            IVoucherTypeService _IVoucherTypeService, G_USERSController _Control,
            ICashVoucherService ICashVoucherService, 
            IVchrTemplateHeaderService _IVchrTemplateHeaderService, IVchrTemplateDetailService _IVchrTemplateDetailService)
        {
            this.IVchrTemplateHeaderService = _IVchrTemplateHeaderService;
            this.IVchrTemplateDetailService = _IVchrTemplateDetailService;
            this.IVoucherTypeService = _IVoucherTypeService;
            this.IGCostCenterService = _IGCostCenterService;
            this.ICashVoucherService = ICashVoucherService;
            this.UserControl = _Control;
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAll(int CompCode, string UserCode, string Token)
        {
            //if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            //{
                var VoucherTypesList = IVoucherTypeService.GetAll(x => x.COMP_CODE == CompCode).ToList();
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
        public IHttpActionResult GetAllAQ_GetJournalHeader(int trType,int CompCode, string FromDate, string toDate, int? PaymentType, int status, int? type, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                string s = "select * from AQ_GetCashVoucherHeader where COMP_CODE = " + CompCode + " and  VOUCHER_DATE >=' " + FromDate + "' and VOUCHER_DATE <= ' " + toDate + " ' and TRType = "+trType;
                string condition = "";
                if (PaymentType != 0 && PaymentType != null)
                    condition = condition + " and CheckType = " + PaymentType;

                if (type != 0 && type != null)
                    condition = condition + " and TYPE_CODE = " + type;

                if (status == 3)
                    condition = condition + "";
                else
                {
                    condition = condition + " and VOUCHER_STATUS = " + status;
                }

                string query = s + condition;
                var res = db.Database.SqlQuery<AQ_GetCashVoucherHeader>(query).ToList();
                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllJournalDetail(int VoucherID, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var res2 = db.AQ_GetCashVoucherDetail.Where(x => x.VoucherID == VoucherID).ToList();
                return Ok(new BaseResponse(res2));
            }
            return BadRequest(ModelState);
        }
      
        [HttpPost, AllowAnonymous]
        public IHttpActionResult InsertJournalMasterDetail([FromBody]CashVoucherMasterDetails obj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(obj.Token, obj.UserCode))
            {
                using (var dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        var jouranalHeader = ICashVoucherService.Insert(obj.A_CashVoucher_Header);
                      foreach (var item in obj.A_CashVoucher_Detail)
                        {
                            item.VoucherID = jouranalHeader.VoucherID;
                            ICashVoucherService.Insert(item);
                        }
                        
                        var br = 1;
                        string ProcessType="";
                        if (jouranalHeader.TRType == 1)
                            ProcessType = "RecptVchr";
                        else
                            ProcessType = "PaymntVchr";

                        ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(obj.A_CashVoucher_Header.COMP_CODE), br, jouranalHeader.VoucherID, ProcessType, "Add", db);
                        if (res.ResponseState == true)
                        {
                            obj.A_CashVoucher_Header.VOUCHER_CODE = int.Parse(res.ResponseData.ToString());
                            dbTransaction.Commit();
                            return Ok(new BaseResponse(obj.A_CashVoucher_Header));
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
        public IHttpActionResult UpdateJournalMasterDetail([FromBody]CashVoucherMasterDetails obj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(obj.Token, obj.UserCode))
            {
                using (var dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        var jouranalHeader = ICashVoucherService.Update(obj.A_CashVoucher_Header);

                        //update Details
                        var insertedObjects = obj.A_CashVoucher_Detail.Where(x => x.StatusFlag == 'i').ToList();
                        var updatedObjects = obj.A_CashVoucher_Detail.Where(x => x.StatusFlag == 'u').ToList();
                        var deletedObjects = obj.A_CashVoucher_Detail.Where(x => x.StatusFlag == 'd').ToList();

                        foreach (var item in insertedObjects)
                        {
                            item.VoucherID = obj.A_CashVoucher_Header.VoucherID;
                            ICashVoucherService.Insert(item);
                        }
                        foreach (var item in updatedObjects)
                        {
                            item.VoucherID = obj.A_CashVoucher_Header.VoucherID;
                            ICashVoucherService.Update(item);
                        }
                        foreach (var item in deletedObjects)
                        {
                            ICashVoucherService.Delete(item.VoucherDetailID);
                        }
                        
                        var br = 1;
                        string ProcessType = "";
                        if (jouranalHeader.TRType == 1)
                            ProcessType = "RecptVchr";
                        else
                            ProcessType = "PaymntVchr";

                        ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(obj.A_CashVoucher_Header.COMP_CODE), br, jouranalHeader.VoucherID,ProcessType , "Update", db);
                        if (res.ResponseState == true)
                        {

                            dbTransaction.Commit();
                            return Ok(new BaseResponse(obj.A_CashVoucher_Header));
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
        public IHttpActionResult Open([FromBody]A_CashVoucher_Header obj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(obj.Token, obj.UserCode))
            {
                using (var dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {

                        var jouranalHeader = ICashVoucherService.Update(obj);
                        //// call process trans 
                        var br = 1;
                        string ProcessType = "";
                        if (jouranalHeader.TRType == 1)
                            ProcessType = "RecptVchr";
                        else
                            ProcessType = "PaymntVchr";

                        ResponseResult res;
                        if (obj.VOUCHER_STATUS == 0)
                        {
                             res = Shared.TransactionProcess(Convert.ToInt32(obj.COMP_CODE), br, jouranalHeader.VoucherID, ProcessType, "Open", db);

                        }
                        else
                        {
                             res = Shared.TransactionProcess(Convert.ToInt32(obj.COMP_CODE), br, jouranalHeader.VoucherID, ProcessType, "Update", db);

                        }

                     //   ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(obj.COMP_CODE), br, jouranalHeader.VoucherID, ProcessType, "Open", db);
                        if (res.ResponseState == true)
                        {

                            dbTransaction.Commit();
                            return Ok(new BaseResponse(obj));
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
