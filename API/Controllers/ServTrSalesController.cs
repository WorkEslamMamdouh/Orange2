 using Inv.API.Models;
using Inv.API.Tools;
using Inv.BLL.Services.ServiceTRInvoice;
using Inv.BLL.Services.ServSlsInvoiceItems;
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

namespace Inv.API.Controllers
{
    public class ServTrSalesController : BaseController
    {
        private readonly IServSlsInvoiceItemsService IServSlsInvoiceItemsService;
        private readonly IServiceTRInvoiceService IServiceTRInvoiceService;
        private readonly G_USERSController UserControl;

        public ServTrSalesController(IServiceTRInvoiceService _IServiceTRInvoiceService, G_USERSController _Control, IServSlsInvoiceItemsService _IServSlsInvoiceItemsService)
        {
            this.IServiceTRInvoiceService = _IServiceTRInvoiceService;
            this.IServSlsInvoiceItemsService = _IServSlsInvoiceItemsService;
            this.UserControl = _Control;
        }

        #region Invoices
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllServSalesInvoice(int CompCode, int trtype, int BranchCode, int IsCash, string StartDate, string EndDate, int Status, int? CustId,  string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                string s = "select * from AQVAT_GetSlsInvoiceList where  BranchCode = " + BranchCode + " and CompCode = " + CompCode + "and TrDate >=' " + StartDate + "' and TrDate <= ' " + EndDate + " ' and  TrType = " + trtype;
                string condition = "";
                if (CustId != 0 && CustId != null)
                    condition = condition + " and CustomerId =" + CustId;
         
                if (Status == 2)
                    condition = condition + "";
                else
                {
                    condition = condition + " and Status = " + Status;
                }
                if (IsCash == 2)
                    condition = condition + "";
                else if (IsCash == 0)
                {
                    condition = condition + " and IsCash = 'False' ";
                }
                else if (IsCash == 1)
                {
                    condition = condition + " and IsCash = 'True' ";
                }
                string query = s + condition;
                var res = db.Database.SqlQuery<AQVAT_GetSlsInvoiceList>(query).ToList();

                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }



        [HttpPost, AllowAnonymous]
        public IHttpActionResult InsertInvoiceMasterDetail([FromBody]ServSlsInvoiceMasterDetails obj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(obj.Token, obj.UserCode))
            {
                using (var dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        //string st = SystemToolsController.GenerateGuid();
                        //obj.AVAT_TR_SlsInvoice.DocUUID = st;

                        //var tm = DateTime.Now.ToString("HH:mm:ss");
                        //obj.AVAT_TR_SlsInvoice.TrTime = TimeSpan.Parse(tm);

                        var tstamp = DateTime.Now;

                        if (obj.AVAT_TR_SlsInvoice.Status == 1)
                        {


                            QrModel QrRec = new QrModel();
                            QrRec.CompName = obj.CompName;
                            QrRec.VatNo = obj.VatNo;
                            QrRec.Total = obj.AVAT_TR_SlsInvoice.TotalAmount;
                            QrRec.Vat = obj.AVAT_TR_SlsInvoice.VatAmount;
                            //QrRec.TrDate = tstamp;
                            QrRec.TrDate = obj.AVAT_TR_SlsInvoice.TrDate;




                            string QrCode = QRGeneratorController.QrGenerator(QrRec);

                            string st = SystemToolsController.GenerateGuid();
                            obj.AVAT_TR_SlsInvoice.DocUUID = st;
                            obj.AVAT_TR_SlsInvoice.QRCode = QrCode;
                            //obj.I_Sls_TR_Invoice.TrDate = tstamp.Date;
                        }
                        obj.AVAT_TR_SlsInvoice.CreatedAt = tstamp;
                        obj.AVAT_TR_SlsInvoice.TrTime = tstamp.TimeOfDay;






                        obj.AVAT_TR_SlsInvoice.AllowAfterVat = obj.AVAT_TR_SlsInvoice.AllowAfterVat == null ? 0 : obj.AVAT_TR_SlsInvoice.AllowAfterVat;
                        var Sls_TR_Invoice = IServiceTRInvoiceService.Insert(obj.AVAT_TR_SlsInvoice);

                        for (int i = 0; i < obj.AVAT_TR_SlsInvoiceItem.Count; i++)
                        {
                            obj.AVAT_TR_SlsInvoiceItem[i].InvoiceID = Sls_TR_Invoice.InvoiceID;
                        }
                        IServSlsInvoiceItemsService.InsertLst(obj.AVAT_TR_SlsInvoiceItem);
                        ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(obj.AVAT_TR_SlsInvoice.CompCode), Convert.ToInt32(obj.AVAT_TR_SlsInvoice.BranchCode), Sls_TR_Invoice.InvoiceID, "ServSlsInv", "Add", db);
                        if (res.ResponseState == true)
                        {
                            obj.AVAT_TR_SlsInvoice.TrNo = int.Parse(res.ResponseData.ToString());
                            dbTransaction.Commit();

                            LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, Sls_TR_Invoice.InvoiceID, LogUser.UserLog.Insert, obj.MODULE_CODE, true, null, null, null);
                          
                            return Ok(new BaseResponse(obj.AVAT_TR_SlsInvoice));
                        }
                        else
                        {
                            dbTransaction.Rollback();
                            LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, Sls_TR_Invoice.InvoiceID, LogUser.UserLog.Insert, obj.MODULE_CODE, false, res.ResponseMessage.ToString(), null, null);

                            return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, res.ResponseMessage));
                        }
                    }
                    catch (Exception ex)
                    {
                        dbTransaction.Rollback();
                        LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.AVAT_TR_SlsInvoice.InvoiceID, LogUser.UserLog.Insert, obj.MODULE_CODE, false, ex.Message.ToString(), null, null);

                        return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                    }
                }
            }
            return BadRequest(ModelState);
        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult updateInvoiceMasterDetail([FromBody]ServSlsInvoiceMasterDetails updatedObj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(updatedObj.Token, updatedObj.UserCode))
            {
                using (var dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        //var tm = DateTime.Now.ToString("HH:mm:ss");
                        //updatedObj.AVAT_TR_SlsInvoice.TrTime = TimeSpan.Parse(tm);


                        var tstamp = DateTime.Now;

                        if (updatedObj.AVAT_TR_SlsInvoice.Status == 1)
                        {


                            QrModel QrRec = new QrModel();
                            QrRec.CompName = updatedObj.CompName;
                            QrRec.VatNo = updatedObj.VatNo;
                            QrRec.Total = updatedObj.AVAT_TR_SlsInvoice.TotalAmount;
                            QrRec.Vat = updatedObj.AVAT_TR_SlsInvoice.VatAmount;
                            //QrRec.TrDate = tstamp;
                            QrRec.TrDate = updatedObj.AVAT_TR_SlsInvoice.TrDate;


                            string QrCode = QRGeneratorController.QrGenerator(QrRec);

                            string st = SystemToolsController.GenerateGuid();
                            updatedObj.AVAT_TR_SlsInvoice.DocUUID = st;
                            updatedObj.AVAT_TR_SlsInvoice.QRCode = QrCode;
                            //updatedObj.I_Sls_TR_Invoice.TrDate = tstamp.Date;
                            //updatedObj.I_Sls_TR_Invoice.CreatedAt = tstamp;
                            //updatedObj.I_Sls_TR_Invoice.TrTime = tstamp.TimeOfDay;
                        }




                        //update Master
                        updatedObj.AVAT_TR_SlsInvoice.AllowAfterVat =updatedObj.AVAT_TR_SlsInvoice.AllowAfterVat == null ? 0 : updatedObj.AVAT_TR_SlsInvoice.AllowAfterVat;

                        var Sls_TR_Invoice = IServiceTRInvoiceService.Update(updatedObj.AVAT_TR_SlsInvoice);

                        //update Details
                        var insertedInvoiceItems = updatedObj.AVAT_TR_SlsInvoiceItem.Where(x => x.StatusFlag == 'i').ToList();
                        var updatedInvoiceItems = updatedObj.AVAT_TR_SlsInvoiceItem.Where(x => x.StatusFlag == 'u').ToList();
                        var deletedInvoiceItems = updatedObj.AVAT_TR_SlsInvoiceItem.Where(x => x.StatusFlag == 'd').ToList();

                        //loop insered  
                        foreach (var item in insertedInvoiceItems)
                        {
                            item.InvoiceID = updatedObj.AVAT_TR_SlsInvoice.InvoiceID;
                            var InsertedRec = IServSlsInvoiceItemsService.Insert(item);
                        }

                        //loop Update  
                        foreach (var item in updatedInvoiceItems)
                        {
                            item.InvoiceID = updatedObj.AVAT_TR_SlsInvoice.InvoiceID;
                            var updatedRec = IServSlsInvoiceItemsService.Update(item);
                        }

                        //loop Delete  
                        foreach (var item in deletedInvoiceItems)
                        {
                            int deletedId = item.InvoiceItemID;
                            IServSlsInvoiceItemsService.Delete(deletedId);
                        }
                        // call process trans 

                        ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(updatedObj.AVAT_TR_SlsInvoice.CompCode), Convert.ToInt32(updatedObj.AVAT_TR_SlsInvoice.BranchCode), Sls_TR_Invoice.InvoiceID, "ServSlsInv", "Update", db);
                        if (res.ResponseState == true)
                        {
                            dbTransaction.Commit();

                            LogUser.InsertPrint(db, updatedObj.Comp_Code.ToString(),updatedObj.Branch_Code, updatedObj.sec_FinYear, updatedObj.UserCode, updatedObj.AVAT_TR_SlsInvoice.InvoiceID, LogUser.UserLog.Update, updatedObj.MODULE_CODE, true, null, null, null);

                            return Ok(new BaseResponse(updatedObj.AVAT_TR_SlsInvoice));
                        }
                        else
                        {
                            dbTransaction.Rollback();
                            LogUser.InsertPrint(db, updatedObj.Comp_Code.ToString(), updatedObj.Branch_Code, updatedObj.sec_FinYear, updatedObj.UserCode, updatedObj.AVAT_TR_SlsInvoice.InvoiceID, LogUser.UserLog.Update, updatedObj.MODULE_CODE, false, res.ResponseMessage.ToString(), null, null);

                            return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, res.ResponseMessage));
                        }
                    }
                    catch (Exception ex)
                    {
                        dbTransaction.Rollback();
                        LogUser.InsertPrint(db, updatedObj.Comp_Code.ToString(), updatedObj.Branch_Code, updatedObj.sec_FinYear, updatedObj.UserCode, updatedObj.AVAT_TR_SlsInvoice.InvoiceID, LogUser.UserLog.Update, updatedObj.MODULE_CODE, false, ex.Message.ToString(), null, null);

                        return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                    }
                }
            }
            return BadRequest(ModelState);
        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult OpenSrvSlsInv([FromBody]ServSlsInvoiceMasterDetails updatedObj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(updatedObj.Token, updatedObj.UserCode))
            {
                using (var dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {

                        //update Master
                        var Sls_TR_Invoice = IServiceTRInvoiceService.Update(updatedObj.AVAT_TR_SlsInvoice);

                        //update Details
                        var insertedInvoiceItems = updatedObj.AVAT_TR_SlsInvoiceItem.Where(x => x.StatusFlag == 'i').ToList();
                        var updatedInvoiceItems = updatedObj.AVAT_TR_SlsInvoiceItem.Where(x => x.StatusFlag == 'u').ToList();
                        var deletedInvoiceItems = updatedObj.AVAT_TR_SlsInvoiceItem.Where(x => x.StatusFlag == 'd').ToList();

                        //loop insered  
                        foreach (var item in insertedInvoiceItems)
                        {
                            updatedObj.AVAT_TR_SlsInvoice.AllowAfterVat = updatedObj.AVAT_TR_SlsInvoice.AllowAfterVat == null ? 0 : updatedObj.AVAT_TR_SlsInvoice.AllowAfterVat;

                            item.InvoiceID = updatedObj.AVAT_TR_SlsInvoice.InvoiceID;
                            var InsertedRec = IServSlsInvoiceItemsService.Insert(item);
                        }

                        //loop Update  
                        foreach (var item in updatedInvoiceItems)
                        {
                            item.InvoiceID = updatedObj.AVAT_TR_SlsInvoice.InvoiceID;
                            var updatedRec = IServSlsInvoiceItemsService.Update(item);
                        }

                        //loop Delete  
                        foreach (var item in deletedInvoiceItems)
                        {
                            int deletedId = item.InvoiceItemID;
                            IServSlsInvoiceItemsService.Delete(deletedId);
                        }
                        // call process trans 

                        ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(updatedObj.AVAT_TR_SlsInvoice.CompCode), Convert.ToInt32(updatedObj.AVAT_TR_SlsInvoice.BranchCode), Sls_TR_Invoice.InvoiceID, "ServSlsInv", "Open", db);
                        if (res.ResponseState == true)
                        {
                            dbTransaction.Commit();
                            return Ok(new BaseResponse(updatedObj.AVAT_TR_SlsInvoice));
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
        public IHttpActionResult GetServSalesInvByID(int InvoiceID, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {

                var res2 = db.AQVAT_GetSlsInvoiceItem.Where(s => s.InvoiceID == InvoiceID).ToList();
                var res = db.AQVAT_GetSlsInvoiceList.Where(s => s.InvoiceID == InvoiceID).ToList();
                
                AQ_ServSlsInvoiceMasterDetails model = new AQ_ServSlsInvoiceMasterDetails();
                model.AQVAT_GetSlsInvoiceList = res;
                model.AQVAT_GetSlsInvoiceItem = res2;
                return Ok(new BaseResponse(model));
            }
            return BadRequest(ModelState);
        }


        #endregion

        #region Return
        [HttpPost, AllowAnonymous]
        public IHttpActionResult InsertRetInvoiceMasterDetail([FromBody]ServSlsInvoiceMasterDetails obj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(obj.Token, obj.UserCode))
            {
                using (var dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        //string st = SystemToolsController.GenerateGuid();
                        //obj.AVAT_TR_SlsInvoice.DocUUID = st;

                        //var tm = DateTime.Now.ToString("HH:mm:ss");
                        //obj.AVAT_TR_SlsInvoice.TrTime = TimeSpan.Parse(tm);

                        var tstamp = DateTime.Now;

                        if (obj.AVAT_TR_SlsInvoice.Status == 1)
                        {


                            QrModel QrRec = new QrModel();
                            QrRec.CompName = obj.CompName;
                            QrRec.VatNo = obj.VatNo;
                            QrRec.Total = obj.AVAT_TR_SlsInvoice.TotalAmount;
                            QrRec.Vat = obj.AVAT_TR_SlsInvoice.VatAmount;
                            //QrRec.TrDate = tstamp;
                            QrRec.TrDate = obj.AVAT_TR_SlsInvoice.TrDate;




                            string QrCode = QRGeneratorController.QrGenerator(QrRec);

                            string st = SystemToolsController.GenerateGuid();
                            obj.AVAT_TR_SlsInvoice.DocUUID = st;
                            obj.AVAT_TR_SlsInvoice.QRCode = QrCode;
                            //obj.I_Sls_TR_Invoice.TrDate = tstamp.Date;
                        }
                        obj.AVAT_TR_SlsInvoice.CreatedAt = tstamp;
                        obj.AVAT_TR_SlsInvoice.TrTime = tstamp.TimeOfDay;

                        obj.AVAT_TR_SlsInvoice.AllowAfterVat = obj.AVAT_TR_SlsInvoice.AllowAfterVat == null ? 0 : obj.AVAT_TR_SlsInvoice.AllowAfterVat;

                        var Sls_TR_Invoice = IServiceTRInvoiceService.Insert(obj.AVAT_TR_SlsInvoice);

                        for (int i = 0; i < obj.AVAT_TR_SlsInvoiceItem.Count; i++)
                        {
                            obj.AVAT_TR_SlsInvoiceItem[i].InvoiceID = Sls_TR_Invoice.InvoiceID;
                            if (obj.AVAT_TR_SlsInvoice.Status == 1)
                            {
                                    var Invoiceheaderdet = IServSlsInvoiceItemsService.GetAll(s=>s.InvoiceID==obj.AVAT_TR_SlsInvoice.RefTrID);
                                for (int j = 0; j < Invoiceheaderdet.Count; j++)
                                {
                                    if (obj.AVAT_TR_SlsInvoiceItem[i].Serial == Invoiceheaderdet[j].Serial)
                                    {
                                        Invoiceheaderdet[j].TotRetQty += obj.AVAT_TR_SlsInvoiceItem[i].TotRetQty;
                                        IServSlsInvoiceItemsService.Update(Invoiceheaderdet[j]);
                                    }
                                }
                            }
                        }
                       IServSlsInvoiceItemsService.InsertLst(obj.AVAT_TR_SlsInvoiceItem);
                        ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(obj.AVAT_TR_SlsInvoice.CompCode), Convert.ToInt32(obj.AVAT_TR_SlsInvoice.BranchCode), Sls_TR_Invoice.InvoiceID, "servSlsRet", "Add", db);
                        if (res.ResponseState == true)
                        {
                            obj.AVAT_TR_SlsInvoice.TrNo = int.Parse(res.ResponseData.ToString());
                            dbTransaction.Commit();
                            LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.AVAT_TR_SlsInvoice.InvoiceID, LogUser.UserLog.Insert, obj.MODULE_CODE, true, null, null, null);
 
                            return Ok(new BaseResponse(obj.AVAT_TR_SlsInvoice));
                        }
                        else
                        {
                            dbTransaction.Rollback();
                            LogUser.InsertPrint(db, obj.Comp_Code.ToString(),obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.AVAT_TR_SlsInvoice.InvoiceID, LogUser.UserLog.Update, obj.MODULE_CODE, false, res.ResponseMessage.ToString(), null, null);

                            return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, res.ResponseMessage));
                        }
                    }
                    catch (Exception ex)
                    {
                        dbTransaction.Rollback();
                        LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.AVAT_TR_SlsInvoice.InvoiceID, LogUser.UserLog.Update, obj.MODULE_CODE, false, ex.Message.ToString(), null, null);

                        return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                    }
                }
            }
            return BadRequest(ModelState);
        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult updateRetInvoiceMasterDetail([FromBody]ServSlsInvoiceMasterDetails updatedObj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(updatedObj.Token, updatedObj.UserCode))
            {
                using (var dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {



                        var tstamp = DateTime.Now;

                        if (updatedObj.AVAT_TR_SlsInvoice.Status == 1)
                        {


                            QrModel QrRec = new QrModel();
                            QrRec.CompName = updatedObj.CompName;
                            QrRec.VatNo = updatedObj.VatNo;
                            QrRec.Total = updatedObj.AVAT_TR_SlsInvoice.TotalAmount;
                            QrRec.Vat = updatedObj.AVAT_TR_SlsInvoice.VatAmount;
                            //QrRec.TrDate = tstamp;
                            QrRec.TrDate = updatedObj.AVAT_TR_SlsInvoice.TrDate;


                            string QrCode = QRGeneratorController.QrGenerator(QrRec);

                            string st = SystemToolsController.GenerateGuid();
                            updatedObj.AVAT_TR_SlsInvoice.DocUUID = st;
                            updatedObj.AVAT_TR_SlsInvoice.QRCode = QrCode;
                            //updatedObj.I_Sls_TR_Invoice.TrDate = tstamp.Date;
                            //updatedObj.I_Sls_TR_Invoice.CreatedAt = tstamp;
                            //updatedObj.I_Sls_TR_Invoice.TrTime = tstamp.TimeOfDay;
                        }


                        //update Master
                        var Sls_TR_Invoice = IServiceTRInvoiceService.Update(updatedObj.AVAT_TR_SlsInvoice);

                        //update Details
                        var insertedInvoiceItems = updatedObj.AVAT_TR_SlsInvoiceItem.Where(x => x.StatusFlag == 'i').ToList();
                        var updatedInvoiceItems = updatedObj.AVAT_TR_SlsInvoiceItem.Where(x => x.StatusFlag == 'u').ToList();
                        var deletedInvoiceItems = updatedObj.AVAT_TR_SlsInvoiceItem.Where(x => x.StatusFlag == 'd').ToList();

                        //loop insered  
                        foreach (var item in insertedInvoiceItems)
                        {
                            updatedObj.AVAT_TR_SlsInvoice.AllowAfterVat = updatedObj.AVAT_TR_SlsInvoice.AllowAfterVat == null ? 0 : updatedObj.AVAT_TR_SlsInvoice.AllowAfterVat;

                            item.InvoiceID = updatedObj.AVAT_TR_SlsInvoice.InvoiceID;
                            var InsertedRec = IServSlsInvoiceItemsService.Insert(item);
                        }

                        //loop Update  
                        foreach (var item in updatedInvoiceItems)
                        {
                            item.InvoiceID = updatedObj.AVAT_TR_SlsInvoice.InvoiceID;
                            var updatedRec = IServSlsInvoiceItemsService.Update(item);
                        }

                        //loop Delete  
                        foreach (var item in deletedInvoiceItems)
                        {
                            int deletedId = item.InvoiceItemID;
                            IServSlsInvoiceItemsService.Delete(deletedId);
                        }
                        for (int i = 0; i < updatedObj.AVAT_TR_SlsInvoiceItem.Count; i++)
                        {
                            if (updatedObj.AVAT_TR_SlsInvoice.Status == 1)
                            {
                                var Invoiceheaderdet = IServSlsInvoiceItemsService.GetAll(s => s.InvoiceID == updatedObj.AVAT_TR_SlsInvoice.RefTrID);
                                for (int j = 0; j < Invoiceheaderdet.Count; j++)
                                {
                                    if (updatedObj.AVAT_TR_SlsInvoiceItem[i].Serial == Invoiceheaderdet[j].Serial)
                                    {
                                        Invoiceheaderdet[j].TotRetQty += updatedObj.AVAT_TR_SlsInvoiceItem[i].TotRetQty;
                                        IServSlsInvoiceItemsService.Update(Invoiceheaderdet[j]);
                                    }
                                }
                            }
                        }
                        // call process trans 
                        ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(updatedObj.AVAT_TR_SlsInvoice.CompCode), Convert.ToInt32(updatedObj.AVAT_TR_SlsInvoice.BranchCode), Sls_TR_Invoice.InvoiceID, "servSlsRet", "Update", db);
                        if (res.ResponseState == true)
                        {
                            dbTransaction.Commit();

                            LogUser.InsertPrint(db, updatedObj.Comp_Code.ToString(), updatedObj.Branch_Code, updatedObj.sec_FinYear, updatedObj.UserCode, updatedObj.AVAT_TR_SlsInvoice.InvoiceID, LogUser.UserLog.Update, updatedObj.MODULE_CODE, true, null, null, null);

                            return Ok(new BaseResponse(updatedObj.AVAT_TR_SlsInvoice));
                        }
                        else
                        {
                            dbTransaction.Rollback();
                            LogUser.InsertPrint(db, updatedObj.Comp_Code.ToString(), updatedObj.Branch_Code, updatedObj.sec_FinYear, updatedObj.UserCode, updatedObj.AVAT_TR_SlsInvoice.InvoiceID, LogUser.UserLog.Update, updatedObj.MODULE_CODE, false, res.ResponseMessage.ToString(), null, null);

                            return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, res.ResponseMessage));
                        }
                    }
                    catch (Exception ex)
                    {
                        dbTransaction.Rollback();
                        LogUser.InsertPrint(db, updatedObj.Comp_Code.ToString(), updatedObj.Branch_Code, updatedObj.sec_FinYear, updatedObj.UserCode, updatedObj.AVAT_TR_SlsInvoice.InvoiceID, LogUser.UserLog.Update, updatedObj.MODULE_CODE, false, ex.Message.ToString(), null, null);

                        return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                    }
                }
            }
            return BadRequest(ModelState);
        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult OpenRetSrvSlsInv([FromBody]ServSlsInvoiceMasterDetails updatedObj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(updatedObj.Token, updatedObj.UserCode))
            {
                using (var dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {

                        //update Master
                        var Sls_TR_Invoice = IServiceTRInvoiceService.Update(updatedObj.AVAT_TR_SlsInvoice);

                        //update Details
                        var insertedInvoiceItems = updatedObj.AVAT_TR_SlsInvoiceItem.Where(x => x.StatusFlag == 'i').ToList();
                        var updatedInvoiceItems = updatedObj.AVAT_TR_SlsInvoiceItem.Where(x => x.StatusFlag == 'u').ToList();
                        var deletedInvoiceItems = updatedObj.AVAT_TR_SlsInvoiceItem.Where(x => x.StatusFlag == 'd').ToList();

                        //loop insered  
                        foreach (var item in insertedInvoiceItems)
                        {
                            item.InvoiceID = updatedObj.AVAT_TR_SlsInvoice.InvoiceID;
                            var InsertedRec = IServSlsInvoiceItemsService.Insert(item);
                        }

                        //loop Update  
                        foreach (var item in updatedInvoiceItems)
                        {
                            item.InvoiceID = updatedObj.AVAT_TR_SlsInvoice.InvoiceID;
                            var updatedRec = IServSlsInvoiceItemsService.Update(item);
                        }

                        //loop Delete  
                        foreach (var item in deletedInvoiceItems)
                        {
                            int deletedId = item.InvoiceItemID;
                            IServSlsInvoiceItemsService.Delete(deletedId);
                        }

                        for (int i = 0; i < updatedObj.AVAT_TR_SlsInvoiceItem.Count; i++)
                        {
                            if (updatedObj.AVAT_TR_SlsInvoice.Status == 1)
                            {
                                var Invoiceheaderdet = IServSlsInvoiceItemsService.GetAll(s => s.InvoiceID == updatedObj.AVAT_TR_SlsInvoice.RefTrID);
                                for (int j = 0; j < Invoiceheaderdet.Count; j++)
                                {
                                    if (updatedObj.AVAT_TR_SlsInvoiceItem[i].Serial == Invoiceheaderdet[j].Serial)
                                    {
                                        Invoiceheaderdet[j].TotRetQty -= updatedObj.AVAT_TR_SlsInvoiceItem[i].TotRetQty;
                                        IServSlsInvoiceItemsService.Update(Invoiceheaderdet[j]);
                                    }
                                }
                            }
                        }
                        // call process trans 

                        ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(updatedObj.AVAT_TR_SlsInvoice.CompCode), Convert.ToInt32(updatedObj.AVAT_TR_SlsInvoice.BranchCode), Sls_TR_Invoice.InvoiceID, "servSlsRet", "Open", db);
                        if (res.ResponseState == true)
                        {
                            dbTransaction.Commit();
                            return Ok(new BaseResponse(updatedObj.AVAT_TR_SlsInvoice));
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
