﻿ using Inv.API.Models;
using Inv.API.Tools;
using Inv.BLL.Services.ISlsTRInvoice;
using Inv.BLL.Services.SlsInvoiceItems;
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
    public class SlsTrSalesController : BaseController
    {
    

        private readonly ISlsInvoiceItemsService SlsInvoiceItemsService;
        private readonly ISlsTRInvoiceService SlsTrSalesService;
        private readonly G_USERSController UserControl;
        private string username;
        public SlsTrSalesController(ISlsTRInvoiceService _ISlsTrSalesService, G_USERSController _Control, ISlsInvoiceItemsService _ISlsInvoiceItemsService)
        {
            this.SlsTrSalesService = _ISlsTrSalesService;
            this.SlsInvoiceItemsService = _ISlsInvoiceItemsService;
            this.UserControl = _Control;
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllSlsInvoiceList(int CompCode, int BranchCode , string UserCode, string Token)
        {
            
            if (ModelState.IsValid)
            {
                var res = db.IQ_GetSlsInvoiceListVer2.Where(x => x.CompCode == CompCode && x.BranchCode == BranchCode).ToList();
                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllSlsInvoiceStatistic(int CompCode, int BranchCode, string UserCode, string Token)
        {// mahroos .. البرامتر تكون بناء علي المطلوب في ui 
            //int CompCode , int? Cashierid , string Salescode , int? ispaid
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                List<IQ_GetSlsInvoiceStatisticVer2> res = db.IQ_GetSlsInvoiceStatisticVer2.Where(x => x.CompCode == CompCode && x.BranchCode == BranchCode).ToList();
                // build the linque consition based on parameters 
                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetSlsInvoiceItemsByinvoiceID(int invoiceID, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var res =db.IQ_GetSlsInvoiceItemVer2.Where(s=>s.InvoiceID==invoiceID ).ToList();
                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetPriceshowById(int InvId, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                string query = "select * from IQ_GetSlsInvoiceStatisticVer2 where InvoiceID =" + InvId + " ";

                var res = db.Database.SqlQuery<IQ_GetSlsInvoiceStatisticVer2>(query).ToList();
                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetSlsInvoiceByIDFromStatistics(int invoiceID, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var res = db.IQ_GetSlsInvoiceStatisticVer2.Where(s => s.InvoiceID == invoiceID).ToList();
                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }
           [HttpGet, AllowAnonymous]
        public IHttpActionResult GetSlsInvoiceByIDFromtable(int invoiceID, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var res = db.I_Sls_TR_Invoice.Where(s => s.InvoiceID == invoiceID).ToList();
                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetSlsReturnByIDFromStatistics(int invoiceID, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var res = db.IQ_GetSlsInvoiceStatisticVer2.Where(s => s.InvoiceID == invoiceID && s.TrType == 1).ToList();
                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllSlsInvoiceCashStatistic(int CompCode, int BranchCode ,  string TrDate , int Status , int? CashBoxid, int? SalesmanId,int? CustId ,  string SalesUser, string UserCode, string Token)
        {
          

            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                string s = "select * from IQ_GetSlsInvoiceStatisticVer2 where BranchCode = "+ BranchCode + " and CompCode = " + CompCode + "  and SlsInvSrc = 1 and TrType= 0  and TrDate =' " + TrDate + "' and IsCash = 'true'  " ;
                string condition = "";
                if (Status == 0)
                    CashBoxid = 0;
                if (CashBoxid != 0 && CashBoxid != null)
                    condition = condition + " and CashBoxID = " + CashBoxid ;
                if (SalesmanId != 0 && SalesmanId != null)
                    condition = condition + " and SalesmanId =" + SalesmanId;
                if (CustId != 0 && CustId != null)
                    condition = condition + " and CustomerId =" + CustId;
                if (SalesUser != "" && SalesUser != "null" && SalesUser != "x")
                    condition = condition + " and CreatedBy ='" + SalesUser + "'";

                if (Status == 0)// and RemainAmount > 0 
                    condition = condition + " and RemainAmount > 0";
                else if (Status == 1)// and RemainAmount > 0 
                    condition = condition + " and RemainAmount = 0";
                else if (Status == 2)// All Invoices
                    condition = condition + "";

                   string query = s + condition;
                var res = db.Database.SqlQuery<IQ_GetSlsInvoiceStatisticVer2>(query).ToList();
                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetSlsInvoiceItem(int invoiceID,string UserCode,string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                //var res = db.IQ_GetSlsInvoiceItemVer2.Where(x => x.InvoiceID == invoiceID).ToList();

                string query = "select * from IQ_GetSlsInvoiceItemVer2 where InvoiceID = " + invoiceID + " ";
               
                var res = db.Database.SqlQuery<IQ_GetSlsInvoiceItemVer2>(query).ToList();

                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult InsertInvoiceMasterDetail([FromBody]SlsInvoiceMasterDetails obj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(obj.Token, obj.UserCode))
            {
                using (var dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        // doha 4-7-2021 GUID and QR Code
                        //string st = SystemToolsController.GenerateGuid();
                        //obj.I_Sls_TR_Invoice.DocUUID = st;

                        //var tm = DateTime.Now.ToString("HH:mm:ss"); 
                        //obj.I_Sls_TR_Invoice.TrTime = TimeSpan.Parse(tm);

                        //var compObj = db.G_COMPANY.Where(s => s.COMP_CODE == obj.I_Sls_TR_Invoice.CompCode).FirstOrDefault();
                        //var branchObj = db.G_BRANCH.Where(s => s.BRA_CODE == obj.I_Sls_TR_Invoice.BranchCode).FirstOrDefault();
                        //var QrCode= SystemToolsController.GenerateQRCode(compObj.NameA, branchObj.GroupVatNo, obj.I_Sls_TR_Invoice.TrDate.ToString(), obj.I_Sls_TR_Invoice.NetAfterVat.ToString(), obj.I_Sls_TR_Invoice.VatAmount.ToString());
                        //obj.I_Sls_TR_Invoice.QRCode = QrCode;
                        //var x=QrCode.Length;
                        ////////////
                        ///
                        ///
                        DateTime tstamp = DateTime.Now;
                        DateTime data1 = DateTime.Now;


                        if (obj.I_Sls_TR_Invoice.Status == 1)
                        {


                            QrModel QrRec = new QrModel();
                            QrRec.CompName = obj.CompName;
                            QrRec.VatNo = obj.VatNo;
                            QrRec.Total = obj.I_Sls_TR_Invoice.TotalAmount;
                            QrRec.Vat = obj.I_Sls_TR_Invoice.VatAmount;
                            //QrRec.TrDate = tstamp;
                            data1 = Convert.ToDateTime(obj.I_Sls_TR_Invoice.TrDate);
                            tstamp = QRGeneratorController.MargeTime_in_Date(data1, tstamp);

                            QrRec.TrDate = tstamp;
                            //QrRec.TrDate = obj.I_Sls_TR_Invoice.TrDate;




                            string QrCode = QRGeneratorController.QrGenerator(QrRec);

                            string st = SystemToolsController.GenerateGuid();
                            obj.I_Sls_TR_Invoice.DocUUID = st;
                            obj.I_Sls_TR_Invoice.QRCode = QrCode;
                            //obj.I_Sls_TR_Invoice.TrDate = tstamp.Date;
                        }
                        obj.I_Sls_TR_Invoice.CreatedAt = tstamp;
                        obj.I_Sls_TR_Invoice.TrTime = tstamp.TimeOfDay;



                        obj.I_Sls_TR_Invoice.AllowAfterVat = obj.I_Sls_TR_Invoice.AllowAfterVat == null ? 0 : obj.I_Sls_TR_Invoice.AllowAfterVat;

                        var Sls_TR_Invoice = SlsTrSalesService.Insert(obj.I_Sls_TR_Invoice);
                        
                        for (int i = 0; i < obj.I_Sls_TR_InvoiceItems.Count; i++)
                        {
                            obj.I_Sls_TR_InvoiceItems[i].InvoiceID = Sls_TR_Invoice.InvoiceID;
                        }
                        SlsInvoiceItemsService.InsertLst(obj.I_Sls_TR_InvoiceItems);
                        // call process trans 
                        
                        ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(obj.I_Sls_TR_Invoice.CompCode), Convert.ToInt32(obj.I_Sls_TR_Invoice.BranchCode), Sls_TR_Invoice.InvoiceID, "SlsInvoice", "Add", db);
                        if (res.ResponseState == true)
                        {
                             
                            obj.I_Sls_TR_Invoice.TrNo=int.Parse(res.ResponseData.ToString());

                            if (obj.I_Sls_TR_Invoice.TrNo == 0)
                            {
                                dbTransaction.Rollback();

                                db.Database.ExecuteSqlCommand("delete I_Sls_TR_InvoiceItems where invoiceid = "+ obj.I_Sls_TR_Invoice.InvoiceID+ " ");
                                db.Database.ExecuteSqlCommand("delete [dbo].[I_Sls_TR_Invoice] where invoiceid = " + obj.I_Sls_TR_Invoice.InvoiceID + "");                            
                                return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, res.ResponseMessage));

                            }


                            dbTransaction.Commit();

                            //*********************************************************************************************************
                            var displayItems = db.I_Sls_TR_InvoiceItems.Where(x => x.InvoiceID == obj.I_Sls_TR_Invoice.InvoiceID).ToList();
                            if (displayItems.Count == 0)
                            {
                                for (int i = 0; i < obj.I_Sls_TR_InvoiceItems.Count; i++)
                                {
                                    obj.I_Sls_TR_InvoiceItems[i].InvoiceID = Sls_TR_Invoice.InvoiceID;
                                }
                                SlsInvoiceItemsService.InsertLst(obj.I_Sls_TR_InvoiceItems);
                                ResponseResult res1 = Shared.TransactionProcess(Convert.ToInt32(obj.I_Sls_TR_Invoice.CompCode), Convert.ToInt32(obj.I_Sls_TR_Invoice.BranchCode), Sls_TR_Invoice.InvoiceID, "SlsInvoice", "Add", db);
                            }
                            //*********************************************************************************************************




                            obj.I_Sls_TR_Invoice.DocNo = db.Database.SqlQuery<string>("select DocNo from I_Sls_TR_Invoice where InvoiceID = " + obj.I_Sls_TR_Invoice.InvoiceID + "").FirstOrDefault();

                            var displayData = db.IQ_GetSlsInvoiceStatisticVer2.Where(x => x.InvoiceID == obj.I_Sls_TR_Invoice.InvoiceID).FirstOrDefault();
                            LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.I_Sls_TR_Invoice.InvoiceID, obj.I_Sls_TR_Invoice.TrNo.ToString(), LogUser.UserLog.Insert, obj.MODULE_CODE, true, null, null, null);

                            return Ok(new BaseResponse(displayData));
                        }
                        else
                        {
                            dbTransaction.Rollback();
                            db.Database.ExecuteSqlCommand("delete I_Sls_TR_InvoiceItems where invoiceid = " + obj.I_Sls_TR_Invoice.InvoiceID + " ");
                            db.Database.ExecuteSqlCommand("delete [dbo].[I_Sls_TR_Invoice] where invoiceid = " + obj.I_Sls_TR_Invoice.InvoiceID + "");
                            LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.I_Sls_TR_Invoice.InvoiceID, obj.I_Sls_TR_Invoice.TrNo.ToString(), LogUser.UserLog.Insert, obj.MODULE_CODE, false, res.ResponseMessage.ToString(), null, null);

                            return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, res.ResponseMessage));
                        }
                        ////////
                    }
                    catch (Exception ex)
                    {
                        dbTransaction.Rollback();
                        db.Database.ExecuteSqlCommand("delete I_Sls_TR_InvoiceItems where invoiceid = " + obj.I_Sls_TR_Invoice.InvoiceID + " ");
                        db.Database.ExecuteSqlCommand("delete [dbo].[I_Sls_TR_Invoice] where invoiceid = " + obj.I_Sls_TR_Invoice.InvoiceID + "");
                        LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.I_Sls_TR_Invoice.InvoiceID, obj.I_Sls_TR_Invoice.TrNo.ToString(), LogUser.UserLog.Insert, obj.MODULE_CODE, false, ex.Message.ToString(), null, null);

                        return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                    }
                }
            }
            return BadRequest(ModelState);
        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult UpdateInoviceCashList(List<I_Sls_TR_Invoice> invoicesList)
        {
            try
            {
                var tm = DateTime.Now.ToString("HH:mm:ss");
                 

                for (int i = 0; i < invoicesList.Count; i++)
                {
                    SlsTrSalesService.Update(invoicesList[i]);
                    invoicesList[i].TrTime = TimeSpan.Parse(tm);
                }
                return Ok(new BaseResponse());
            }
            catch (Exception ex)
            {
                return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
            }
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllSlsInvoicePriceSrch(int CompCode, int BranchCode, int OperationId, int SlsInvSrc, int IsCash, string StartDate, string EndDate, int Status, int? CustId, int? SalesMan, int? SalesPerson, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                string s = "select * from IQ_GetSlsInvoiceStatisticVer2 where TrType = 2 and BranchCode = " + BranchCode + " and CompCode = " + CompCode + "and SlsInvSrc = " + SlsInvSrc + " and TrDate >=' " + StartDate + "' and TrDate <= ' " + EndDate + " ' ";
                string condition = "";
                if (CustId != 0 && CustId != null)
                    condition = condition + " and CustomerId =" + CustId;
                if (SalesPerson != 0 && SalesPerson != null)
                    condition = condition + " and SalesPersonId =" + SalesPerson;// and Status = " + Status   
                if (SalesMan != 0 && SalesMan != null)
                    condition = condition + " and SalesmanId =" + SalesMan;// and Status = " + Status 
                if (OperationId != 0 && OperationId != null)
                    condition = condition + " and OperationId =" + OperationId;
                if (Status == 2)
                    condition = condition + "";
                else
                {
                    condition = condition + " and Status = " + Status;
                }
                /////////////' and IsCash = '" + IsCash+"'"
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
                ///////////
                string query = s + condition + " ORDER BY TrNo ASC;";
                var res = db.Database.SqlQuery<IQ_GetSlsInvoiceStatisticVer2>(query).ToList();
                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult InsertInvoicePriceSrch([FromBody]SlsInvoiceMasterDetails obj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(obj.Token, obj.UserCode))
            {
                using (var dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {


                        //DateTime tstamp = DateTime.Now;
                        //DateTime data1 = DateTime.Now;


                        //if (obj.I_Sls_TR_Invoice.Status == 1)
                        //{


                        //    QrModel QrRec = new QrModel();
                        //    QrRec.CompName = obj.CompName;
                        //    QrRec.VatNo = obj.VatNo;
                        //    QrRec.Total = obj.I_Sls_TR_Invoice.TotalAmount;
                        //    QrRec.Vat = obj.I_Sls_TR_Invoice.VatAmount;
                        //    //QrRec.TrDate = tstamp;
                        //    data1 = Convert.ToDateTime(obj.I_Sls_TR_Invoice.TrDate);
                        //    tstamp = QRGeneratorController.MargeTime_in_Date(data1, tstamp);

                        //    QrRec.TrDate = tstamp;
                        //    //QrRec.TrDate = obj.I_Sls_TR_Invoice.TrDate;




                        //    string QrCode = QRGeneratorController.QrGenerator(QrRec);

                        //    string st = SystemToolsController.GenerateGuid();
                        //    obj.I_Sls_TR_Invoice.DocUUID = st;
                        //    obj.I_Sls_TR_Invoice.QRCode = QrCode;
                        //    //obj.I_Sls_TR_Invoice.TrDate = tstamp.Date;
                        //}
                        //obj.I_Sls_TR_Invoice.CreatedAt = tstamp;
                        //obj.I_Sls_TR_Invoice.TrTime = tstamp.TimeOfDay;


                        obj.I_Sls_TR_Invoice.AllowAfterVat = obj.I_Sls_TR_Invoice.AllowAfterVat == null ? 0 : obj.I_Sls_TR_Invoice.AllowAfterVat;

                        var Sls_TR_Invoice = SlsTrSalesService.Insert(obj.I_Sls_TR_Invoice);

                        for (int i = 0; i < obj.I_Sls_TR_InvoiceItems.Count; i++)
                        {
                            obj.I_Sls_TR_InvoiceItems[i].InvoiceID = Sls_TR_Invoice.InvoiceID;
                        }
                        SlsInvoiceItemsService.InsertLst(obj.I_Sls_TR_InvoiceItems);
                        // call process trans 

                        ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(obj.I_Sls_TR_Invoice.CompCode), Convert.ToInt32(obj.I_Sls_TR_Invoice.BranchCode), Sls_TR_Invoice.InvoiceID, "ShwPrice", "Add", db);
                        if (res.ResponseState == true)
                        {

                            obj.I_Sls_TR_Invoice.TrNo = int.Parse(res.ResponseData.ToString());

                            if (obj.I_Sls_TR_Invoice.TrNo == 0)
                            {
                                dbTransaction.Rollback();

                                db.Database.ExecuteSqlCommand("delete I_Sls_TR_InvoiceItems where invoiceid = " + obj.I_Sls_TR_Invoice.InvoiceID + " ");
                                db.Database.ExecuteSqlCommand("delete [dbo].[I_Sls_TR_Invoice] where invoiceid = " + obj.I_Sls_TR_Invoice.InvoiceID + "");
                                return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, res.ResponseMessage));

                            }

                            dbTransaction.Commit();


                            obj.I_Sls_TR_Invoice.DocNo = db.Database.SqlQuery<string>("select DocNo from I_Sls_TR_Invoice where InvoiceID = " + obj.I_Sls_TR_Invoice.InvoiceID + "").FirstOrDefault();

                            var displayData = db.IQ_GetSlsInvoiceStatisticVer2.Where(x => x.InvoiceID == obj.I_Sls_TR_Invoice.InvoiceID).FirstOrDefault();
                            LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.I_Sls_TR_Invoice.InvoiceID, obj.I_Sls_TR_Invoice.TrNo.ToString(), LogUser.UserLog.Insert, obj.MODULE_CODE, true, null, null, null);

                            return Ok(new BaseResponse(displayData));
                        }
                        else
                        {
                            dbTransaction.Rollback();
                            db.Database.ExecuteSqlCommand("delete I_Sls_TR_InvoiceItems where invoiceid = " + obj.I_Sls_TR_Invoice.InvoiceID + " ");
                            db.Database.ExecuteSqlCommand("delete [dbo].[I_Sls_TR_Invoice] where invoiceid = " + obj.I_Sls_TR_Invoice.InvoiceID + "");
                            LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.I_Sls_TR_Invoice.InvoiceID, obj.I_Sls_TR_Invoice.TrNo.ToString(), LogUser.UserLog.Insert, obj.MODULE_CODE, false, res.ResponseMessage.ToString(), null, null);

                            return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, res.ResponseMessage));
                        }
                        ////////
                    }
                    catch (Exception ex)
                    {
                        dbTransaction.Rollback();
                        db.Database.ExecuteSqlCommand("delete I_Sls_TR_InvoiceItems where invoiceid = " + obj.I_Sls_TR_Invoice.InvoiceID + " ");
                        db.Database.ExecuteSqlCommand("delete [dbo].[I_Sls_TR_Invoice] where invoiceid = " + obj.I_Sls_TR_Invoice.InvoiceID + "");
                        LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.I_Sls_TR_Invoice.InvoiceID, obj.I_Sls_TR_Invoice.TrNo.ToString(), LogUser.UserLog.Insert, obj.MODULE_CODE, false, ex.Message.ToString(), null, null);

                        return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                    }
                }
            }
            return BadRequest(ModelState);
        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult updateInvoicePriceSrch([FromBody]SlsInvoiceMasterDetails updatedObj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(updatedObj.Token, updatedObj.UserCode))
            {
                using (var dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {


                        //DateTime tstamp = DateTime.Now;
                        //DateTime data1 = DateTime.Now;

                        ////tstamp = QRGeneratorController.AddTimeIndata(data1, updatedObj.I_Sls_TR_Invoice.TrTime.ToString());

                        //if (updatedObj.I_Sls_TR_Invoice.Status == 1)
                        //{


                        //    QrModel QrRec = new QrModel();
                        //    QrRec.CompName = updatedObj.CompName;
                        //    QrRec.VatNo = updatedObj.VatNo;
                        //    QrRec.Total = updatedObj.I_Sls_TR_Invoice.TotalAmount;
                        //    QrRec.Vat = updatedObj.I_Sls_TR_Invoice.VatAmount;
                        //    //QrRec.TrDate = tstamp;
                        //    data1 = Convert.ToDateTime(updatedObj.I_Sls_TR_Invoice.TrDate);
                        //    tstamp = QRGeneratorController.MargeTime_in_Date(data1, tstamp);

                        //    QrRec.TrDate = tstamp;

                        //    //QrRec.TrDate = updatedObj.I_Sls_TR_Invoice.TrDate;

                        //    string QrCode = QRGeneratorController.QrGenerator(QrRec);

                        //    string st = SystemToolsController.GenerateGuid();
                        //    updatedObj.I_Sls_TR_Invoice.DocUUID = st;
                        //    updatedObj.I_Sls_TR_Invoice.QRCode = QrCode;
                        //    //updatedObj.I_Sls_TR_Invoice.TrDate = tstamp.Date;
                        //    //updatedObj.I_Sls_TR_Invoice.CreatedAt = tstamp;
                        //    //updatedObj.I_Sls_TR_Invoice.TrTime = tstamp.TimeOfDay;
                        //}

                        //update Master
                        var Sls_TR_Invoice = SlsTrSalesService.Update(updatedObj.I_Sls_TR_Invoice);

                        //update Details
                        var insertedInvoiceItems = updatedObj.I_Sls_TR_InvoiceItems.Where(x => x.StatusFlag == 'i').ToList();
                        var updatedInvoiceItems = updatedObj.I_Sls_TR_InvoiceItems.Where(x => x.StatusFlag == 'u').ToList();
                        var deletedInvoiceItems = updatedObj.I_Sls_TR_InvoiceItems.Where(x => x.StatusFlag == 'd').ToList();

                        //loop insered  
                        foreach (var item in insertedInvoiceItems)
                        {
                            item.InvoiceID = updatedObj.I_Sls_TR_Invoice.InvoiceID;
                            var InsertedRec = SlsInvoiceItemsService.Insert(item);



                        }

                        //loop Update  
                        foreach (var item in updatedInvoiceItems)
                        {
                            item.InvoiceID = updatedObj.I_Sls_TR_Invoice.InvoiceID;
                            var updatedRec = SlsInvoiceItemsService.Update(item);
                        }

                        //loop Delete  
                        foreach (var item in deletedInvoiceItems)
                        {
                            int deletedId = item.InvoiceItemID;
                            SlsInvoiceItemsService.Delete(deletedId);
                        }
                        // call process trans 

                        ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(updatedObj.I_Sls_TR_Invoice.CompCode), Convert.ToInt32(updatedObj.I_Sls_TR_Invoice.BranchCode), Sls_TR_Invoice.InvoiceID, "ShwPrice", "Update", db);
                        if (res.ResponseState == true)
                        {
                            updatedObj.I_Sls_TR_Invoice.TrNo = int.Parse(res.ResponseData.ToString());
                            dbTransaction.Commit();

                            var displayData = db.IQ_GetSlsInvoiceStatisticVer2.Where(x => x.InvoiceID == updatedObj.I_Sls_TR_Invoice.InvoiceID).FirstOrDefault();

                            LogUser.InsertPrint(db, updatedObj.Comp_Code.ToString(), updatedObj.Branch_Code, updatedObj.sec_FinYear, updatedObj.UserCode, updatedObj.I_Sls_TR_Invoice.InvoiceID, updatedObj.I_Sls_TR_Invoice.TrNo.ToString(), LogUser.UserLog.Update, updatedObj.MODULE_CODE, true, null, null, null);

                            return Ok(new BaseResponse(displayData));
                        }
                        else
                        {
                            dbTransaction.Rollback();
                            LogUser.InsertPrint(db, updatedObj.Comp_Code.ToString(), updatedObj.Branch_Code, updatedObj.sec_FinYear, updatedObj.UserCode, updatedObj.I_Sls_TR_Invoice.InvoiceID, updatedObj.I_Sls_TR_Invoice.TrNo.ToString(), LogUser.UserLog.Update, updatedObj.MODULE_CODE, false, res.ResponseMessage.ToString(), null, null);

                            return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, res.ResponseMessage));
                        }
                    }
                    catch (Exception ex)
                    {
                        dbTransaction.Rollback();
                        LogUser.InsertPrint(db, updatedObj.Comp_Code.ToString(), updatedObj.Branch_Code, updatedObj.sec_FinYear, updatedObj.UserCode, updatedObj.I_Sls_TR_Invoice.InvoiceID, updatedObj.I_Sls_TR_Invoice.TrNo.ToString(), LogUser.UserLog.Update, updatedObj.MODULE_CODE, false, ex.Message.ToString(), null, null);

                        return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                    }
                }
            }
            return BadRequest(ModelState);
        }


        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllSlsInvoiceReviewStatistic(int CompCode, int BranchCode , int OperationId ,int SlsInvSrc ,int IsCash, string StartDate, string EndDate, int Status, int? CustId, int? SalesMan, int? SalesPerson, string UserCode, string Token)
        {
            //username = GetKeyId('c');

            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                string s = "select * from IQ_GetSlsInvoiceStatisticVer2 where TrType = 0 and BranchCode = "+ BranchCode + " and CompCode = " + CompCode + "and SlsInvSrc = "+ SlsInvSrc + " and TrDate >=' " + StartDate +  "' and TrDate <= ' " + EndDate + " ' ";
                string condition = "";
                if (CustId != 0 && CustId != null)
                    condition = condition + " and CustomerId =" + CustId;
                if (SalesPerson != 0 && SalesPerson != null)
                    condition = condition + " and SalesPersonId =" + SalesPerson;// and Status = " + Status   
                if (SalesMan != 0 && SalesMan != null)
                    condition = condition + " and SalesmanId =" + SalesMan;// and Status = " + Status 
                if (OperationId != 0 && OperationId != null)
                    condition = condition + " and OperationId =" + OperationId; 
                if (Status == 2)
                    condition = condition + "";
                else
                {
                    condition = condition + " and Status = " + Status;
                }
                /////////////' and IsCash = '" + IsCash+"'"
                if (IsCash == 2)
                    condition = condition + "";
                else if (IsCash == 0)
                {
                    condition = condition + " and IsCash = 'False' " ;
                }
                else if (IsCash ==1)
                {
                    condition = condition + " and IsCash = 'True' ";
                }
                ///////////
                string query = s + condition + " ORDER BY TrNo ASC;";
                var res = db.Database.SqlQuery<IQ_GetSlsInvoiceStatisticVer2>(query).ToList();
                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllOperationInvoiceReviewStatistic(int CompCode, int BranchCode , int IsCash, int Operationid , string StartDate, string EndDate, int Status, int? CustId, int? SalesMan, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                string s = "select * from IQ_GetSlsInvoiceStatisticVer2 where TrType = 0 and BranchCode = "+ BranchCode + " and CompCode = " + CompCode + " and SlsInvSrc = 2 and Operationid = " + Operationid + " and TrDate >=' " + StartDate + "' and TrDate <= ' " + EndDate + " ' ";
                string condition = "";
                if (CustId != 0 && CustId != null)
                    condition = condition + " and CustomerId =" + CustId;
                if (SalesMan != 0 && SalesMan != null)
                    condition = condition + " and SalesmanId =" + SalesMan;// and Status = " + Status
                if (Status == 2)
                    condition = condition + "";
                else
                {
                    condition = condition + " and Status = " + Status;
                }
                /////////////' and IsCash = '" + IsCash+"'"
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
                ///////////
                string query = s + condition;
                var res = db.Database.SqlQuery<IQ_GetSlsInvoiceStatisticVer2>(query).ToList();
                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult updateInvoiceMasterDetail([FromBody]SlsInvoiceMasterDetails updatedObj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(updatedObj.Token, updatedObj.UserCode))
            {
                using (var dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {

                        //string st = SystemToolsController.GenerateGuid();
                        //updatedObj.I_Sls_TR_Invoice.DocUUID = st;

                        //var tm = DateTime.Now.ToString("HH:mm:ss");
                        //updatedObj.I_Sls_TR_Invoice.TrTime = TimeSpan.Parse(tm);


                        DateTime tstamp = DateTime.Now;
                        DateTime data1 = DateTime.Now;

                        tstamp = QRGeneratorController.AddTimeIndata(data1, updatedObj.I_Sls_TR_Invoice.TrTime.ToString());

                        if (updatedObj.I_Sls_TR_Invoice.Status == 1)
                        {


                            QrModel QrRec = new QrModel();
                            QrRec.CompName = updatedObj.CompName;
                            QrRec.VatNo = updatedObj.VatNo;
                            QrRec.Total = updatedObj.I_Sls_TR_Invoice.TotalAmount;
                            QrRec.Vat = updatedObj.I_Sls_TR_Invoice.VatAmount;
                            //QrRec.TrDate = tstamp;
                            data1 = Convert.ToDateTime(updatedObj.I_Sls_TR_Invoice.TrDate);
                            tstamp = QRGeneratorController.MargeTime_in_Date(data1, tstamp);

                            QrRec.TrDate = tstamp;

                            //QrRec.TrDate = updatedObj.I_Sls_TR_Invoice.TrDate;

                            string QrCode = QRGeneratorController.QrGenerator(QrRec);

                            string st = SystemToolsController.GenerateGuid();
                            updatedObj.I_Sls_TR_Invoice.DocUUID = st;
                            updatedObj.I_Sls_TR_Invoice.QRCode = QrCode;
                            //updatedObj.I_Sls_TR_Invoice.TrDate = tstamp.Date;
                            //updatedObj.I_Sls_TR_Invoice.CreatedAt = tstamp;
                            //updatedObj.I_Sls_TR_Invoice.TrTime = tstamp.TimeOfDay;
                        }

                        //update Master
                        var Sls_TR_Invoice = SlsTrSalesService.Update(updatedObj.I_Sls_TR_Invoice);

                        //update Details
                        var insertedInvoiceItems = updatedObj.I_Sls_TR_InvoiceItems.Where(x => x.StatusFlag == 'i').ToList();
                        var updatedInvoiceItems = updatedObj.I_Sls_TR_InvoiceItems.Where(x => x.StatusFlag == 'u').ToList();
                        var deletedInvoiceItems = updatedObj.I_Sls_TR_InvoiceItems.Where(x => x.StatusFlag == 'd').ToList();
                        
                        //loop insered  
                        foreach (var item in insertedInvoiceItems)
                        {
                            item.InvoiceID = updatedObj.I_Sls_TR_Invoice.InvoiceID;
                            var InsertedRec = SlsInvoiceItemsService.Insert(item);



                        }

                        //loop Update  
                        foreach (var item in updatedInvoiceItems)
                        {
                            item.InvoiceID = updatedObj.I_Sls_TR_Invoice.InvoiceID;
                            var updatedRec = SlsInvoiceItemsService.Update(item);
                        }

                        //loop Delete  
                        foreach (var item in deletedInvoiceItems)
                        {
                            int deletedId = item.InvoiceItemID;
                            SlsInvoiceItemsService.Delete(deletedId);
                        }
                        // call process trans 
                        
                        ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(updatedObj.I_Sls_TR_Invoice.CompCode), Convert.ToInt32(updatedObj.I_Sls_TR_Invoice.BranchCode), Sls_TR_Invoice.InvoiceID, "SlsInvoice", "Update", db);
                        if (res.ResponseState == true)
                        {
                            updatedObj.I_Sls_TR_Invoice.TrNo = int.Parse(res.ResponseData.ToString());
                            dbTransaction.Commit();

                            var displayData = db.IQ_GetSlsInvoiceStatisticVer2.Where(x => x.InvoiceID == updatedObj.I_Sls_TR_Invoice.InvoiceID).FirstOrDefault();

                            LogUser.InsertPrint(db, updatedObj.Comp_Code.ToString(), updatedObj.Branch_Code, updatedObj.sec_FinYear, updatedObj.UserCode, updatedObj.I_Sls_TR_Invoice.InvoiceID, updatedObj.I_Sls_TR_Invoice.TrNo.ToString(), LogUser.UserLog.Update, updatedObj.MODULE_CODE, true, null, null, null);

                            return Ok(new BaseResponse(displayData));
                        }
                        else
                        {
                            dbTransaction.Rollback();
                            LogUser.InsertPrint(db, updatedObj.Comp_Code.ToString(), updatedObj.Branch_Code, updatedObj.sec_FinYear, updatedObj.UserCode, updatedObj.I_Sls_TR_Invoice.InvoiceID, updatedObj.I_Sls_TR_Invoice.TrNo.ToString(), LogUser.UserLog.Update, updatedObj.MODULE_CODE, false, res.ResponseMessage.ToString(), null, null);

                            return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, res.ResponseMessage));
                        }
                    }
                    catch (Exception ex)
                    {
                        dbTransaction.Rollback();
                        LogUser.InsertPrint(db, updatedObj.Comp_Code.ToString(), updatedObj.Branch_Code, updatedObj.sec_FinYear, updatedObj.UserCode, updatedObj.I_Sls_TR_Invoice.InvoiceID, updatedObj.I_Sls_TR_Invoice.TrNo.ToString(), LogUser.UserLog.Update, updatedObj.MODULE_CODE, false, ex.Message.ToString(), null, null);

                        return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                    }
                }
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetSlsInvoiceItemsFromTabel(int invoiceID, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var res = SlsInvoiceItemsService.GetAll(x => x.InvoiceID == invoiceID).ToList();
                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult Open([FromBody] SlsInvoiceMasterDetails updatedObj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(updatedObj.Token, updatedObj.UserCode))
            {
                using (var dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {
                                db.Database.ExecuteSqlCommand("update I_Sls_TR_Invoice set [Status]  = 0 where CompCode="+ updatedObj.I_Sls_TR_Invoice.CompCode + " and BranchCode=" + updatedObj.I_Sls_TR_Invoice.BranchCode + " and InvoiceID = " + updatedObj.I_Sls_TR_Invoice.InvoiceID + "");

                        ResponseResult result = Shared.TransactionProcess(int.Parse(updatedObj.I_Sls_TR_Invoice.CompCode.ToString()), int.Parse(updatedObj.I_Sls_TR_Invoice.BranchCode.ToString()), updatedObj.I_Sls_TR_Invoice.InvoiceID, "SlsInvoice", "Open", db);
                        if (result.ResponseState == true)
                        {
                            //Sls_TR_Invoice.TrNo = int.Parse(result.ResponseData.ToString());
                            dbTransaction.Commit();
                            LogUser.InsertPrint(db, updatedObj.Comp_Code.ToString(), updatedObj.Branch_Code, updatedObj.sec_FinYear, updatedObj.UserCode, updatedObj.I_Sls_TR_Invoice.InvoiceID, updatedObj.I_Sls_TR_Invoice.TrNo.ToString(), LogUser.UserLog.Open, updatedObj.MODULE_CODE, true, null, null, null);
                             
                            var displayData = db.IQ_GetSlsInvoiceStatisticVer2.Where(x => x.InvoiceID == updatedObj.I_Sls_TR_Invoice.InvoiceID).FirstOrDefault();
                            return Ok(new BaseResponse(displayData));
                        
                        }
                        else
                        {
                            dbTransaction.Rollback();
                            LogUser.InsertPrint(db, updatedObj.Comp_Code.ToString(), updatedObj.Branch_Code, updatedObj.sec_FinYear, updatedObj.UserCode, updatedObj.I_Sls_TR_Invoice.InvoiceID, updatedObj.I_Sls_TR_Invoice.TrNo.ToString(), LogUser.UserLog.Open, updatedObj.MODULE_CODE, false, result.ResponseMessage.ToString(), null, null);
                            return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, result.ResponseMessage));
                        }

                    }
                    catch (Exception ex)
                    {
                        dbTransaction.Rollback();
                        LogUser.InsertPrint(db, updatedObj.Comp_Code.ToString(), updatedObj.Branch_Code, updatedObj.sec_FinYear, updatedObj.UserCode, updatedObj.I_Sls_TR_Invoice.InvoiceID, updatedObj.I_Sls_TR_Invoice.TrNo.ToString(), LogUser.UserLog.Open, updatedObj.MODULE_CODE, false, ex.Message.ToString(), null, null);
                        return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                    }
                }
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllReturnSlsInvoiceStatistic(int CompCode, int BranchCode , int OperationId , int SlsInvSrc ,string StartDate, string EndDate, int Status,int FreeReturn, int? returnType, int? CustId, string SalesMan, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                //trtype=2
                string s = "select * from IQ_GetSlsInvoiceStatisticVer2 where BranchCode = "+ BranchCode + " and CompCode = " + CompCode + "and TrType = 1 and SlsInvSrc = "+ SlsInvSrc + " and TrDate >=' " + StartDate + "' and TrDate <= ' " + EndDate + "'";
                string condition = "";
                if (CustId != 0 && CustId != null)
                    condition = condition + " and CustomerId =" + CustId;
                if (SalesMan != "" && SalesMan != "null")
                    condition = condition + " and SalesmanId ='" + SalesMan + "'";
                if (OperationId != 0 && OperationId != null)
                    condition = condition + " and OperationId =" + OperationId;

                if (returnType == 0) {
                    condition = condition + " and IsCash = 'false' ";
                }
                else if (returnType == 1)
                {
                    condition = condition + " and IsCash = 'true' ";
                }
                else if (returnType == 2)
                {
                    condition = condition + " ";
                }


                if (Status == 2)//and Status = " + Status
                    condition = condition + "";

                else if (Status == 0 || Status == 1)
                {
                    condition = condition + "and Status = " + Status;
                }

                //if (FreeReturn == 2)//All 
                //    condition = condition + "";
                //else if (FreeReturn == 1)// Free
                //{
                //    condition = condition + " and RefTrID Is NULL   ";
                //}
                //else if (FreeReturn == 0)// With invoice ID
                //{
                //    condition = condition + " and RefTrID Is Not NULL ";
                //}


                string query = s + condition;
                var res = db.Database.SqlQuery<IQ_GetSlsInvoiceStatisticVer2>(query).ToList();
                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllOperationReturnStatistic(int CompCode, int BranchCode , int Operationid, string StartDate, string EndDate, int Status, int FreeReturn, int? returnType, int? CustId, string SalesMan, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                //trtype=2
                string s = "select * from IQ_GetSlsInvoiceStatisticVer2 where BranchCode ="+ BranchCode + " and CompCode = " + CompCode + " and SlsInvSrc = 2 and Operationid = " + Operationid + " and TrType = 1 and TrDate >=' " + StartDate + "' and TrDate <= ' " + EndDate + "'";
                string condition = "";
                if (CustId != 0 && CustId != null)
                    condition = condition + " and CustomerId =" + CustId;
                if (SalesMan != "" && SalesMan != "null")
                    condition = condition + " and SalesmanId ='" + SalesMan + "'";

                if (returnType == 0)
                {
                    condition = condition + " and IsCash = 'false' ";
                }
                else if (returnType == 1)
                {
                    condition = condition + " and IsCash = 'true' ";
                }
                else if (returnType == 2)
                {
                    condition = condition + " ";
                }


                if (Status == 2)//and Status = " + Status
                    condition = condition + "";

                else if (Status == 0 || Status == 1)
                {
                    condition = condition + "and Status = " + Status;
                }

                //if (FreeReturn == 2)//All 
                //    condition = condition + "";
                //else if (FreeReturn == 1)// Free
                //{
                //    condition = condition + " and RefTrID Is NULL   ";
                //}
                //else if (FreeReturn == 0)// With invoice ID
                //{
                //    condition = condition + " and RefTrID Is Not NULL ";
                //}


                string query = s + condition;
                var res = db.Database.SqlQuery<IQ_GetSlsInvoiceStatisticVer2>(query).ToList();
                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult InsertSlsReturnMasterDetail([FromBody]SlsInvoiceMasterDetails obj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(obj.Token, obj.UserCode))
            {
                using (var dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        //var tm = DateTime.Now.ToString("HH:mm:ss");
                        //obj.I_Sls_TR_Invoice.TrTime = TimeSpan.Parse(tm);
                        var tstamp = DateTime.Now;
                        DateTime data1 = DateTime.Now;

                        if (obj.I_Sls_TR_Invoice.Status == 1)
                        {


                            QrModel QrRec = new QrModel();
                            QrRec.CompName = obj.CompName;
                            QrRec.VatNo = obj.VatNo;
                            QrRec.Total = obj.I_Sls_TR_Invoice.TotalAmount;
                            QrRec.Vat = obj.I_Sls_TR_Invoice.VatAmount;
                            //QrRec.TrDate = tstamp;

                            data1 = Convert.ToDateTime(obj.I_Sls_TR_Invoice.TrDate);
                            tstamp = QRGeneratorController.MargeTime_in_Date(data1, tstamp);

                            QrRec.TrDate = tstamp;

                            //QrRec.TrDate = obj.I_Sls_TR_Invoice.TrDate;




                            string QrCode = QRGeneratorController.QrGenerator(QrRec);

                            string st = SystemToolsController.GenerateGuid();
                            obj.I_Sls_TR_Invoice.DocUUID = st;
                            obj.I_Sls_TR_Invoice.QRCode = QrCode;
                            //obj.I_Sls_TR_Invoice.TrDate = tstamp.Date;
                        }
                        obj.I_Sls_TR_Invoice.CreatedAt = tstamp;
                        obj.I_Sls_TR_Invoice.TrTime = tstamp.TimeOfDay;



                        obj.I_Sls_TR_Invoice.AllowAfterVat = obj.I_Sls_TR_Invoice.AllowAfterVat == null ? 0 : obj.I_Sls_TR_Invoice.AllowAfterVat;
                        var Sls_TR_Invoice = SlsTrSalesService.Insert(obj.I_Sls_TR_Invoice);
                        for (int i = 0; i < obj.I_Sls_TR_InvoiceItems.Count; i++)
                        {
                            obj.I_Sls_TR_InvoiceItems[i].InvoiceID = Sls_TR_Invoice.InvoiceID;
                        }
                        SlsInvoiceItemsService.InsertLst(obj.I_Sls_TR_InvoiceItems);
                        // call process trans 
                        
                        ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(obj.I_Sls_TR_Invoice.CompCode), Convert.ToInt32(obj.I_Sls_TR_Invoice.BranchCode), Sls_TR_Invoice.InvoiceID, "SlsReturn", "Add", db);
                        if (res.ResponseState == true)
                        {

                            obj.I_Sls_TR_Invoice.TrNo = int.Parse(res.ResponseData.ToString());
                            dbTransaction.Commit();
                            var displayData = db.IQ_GetSlsInvoiceStatisticVer2.Where(x => x.InvoiceID == obj.I_Sls_TR_Invoice.InvoiceID).FirstOrDefault();
                            LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.I_Sls_TR_Invoice.InvoiceID, obj.I_Sls_TR_Invoice.TrNo.ToString(), LogUser.UserLog.Insert, obj.MODULE_CODE, true, null, null, null);

                            return Ok(new BaseResponse(displayData));
                        }
                        else
                        {
                            dbTransaction.Rollback();
                            LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.I_Sls_TR_Invoice.InvoiceID, obj.I_Sls_TR_Invoice.TrNo.ToString(), LogUser.UserLog.Insert, obj.MODULE_CODE, false, res.ResponseState.ToString(), null, null);

                            return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, res.ResponseMessage));
                        }
                        ////////
                    }
                    catch (Exception ex)
                    {
                        dbTransaction.Rollback();
                        LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.I_Sls_TR_Invoice.InvoiceID, obj.I_Sls_TR_Invoice.TrNo.ToString(), LogUser.UserLog.Insert, obj.MODULE_CODE, false, ex.Message.ToString(), null, null);

                        return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                    }
                }
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllUnApprovedSlsReturnListByInvoiceID(int invoiceID,int CompCode,int BranchCode , string UserCode, string Token)
        {
            if (ModelState.IsValid)
            {
                var res = db.IQ_GetSlsInvoiceListVer2.Where(x => x.CompCode == CompCode && x.BranchCode == BranchCode && x.RefTrID==invoiceID && x.Status==0).ToList();
                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult OpenCashInvoices(I_Sls_TR_Invoice updatedObj)
        {
            if (ModelState.IsValid)
            {
                using (var dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        //update Master
                        updatedObj.Status = 0;
                        var Sls_TR_Invoice = SlsTrSalesService.Update(updatedObj);

                        // process Transaction
                        ResponseResult result = Shared.TransactionProcess(int.Parse(Sls_TR_Invoice.CompCode.ToString()), int.Parse(Sls_TR_Invoice.BranchCode.ToString()), Sls_TR_Invoice.InvoiceID, "SlsInvoice", "Open", db);
                        if (result.ResponseState == true)
                        {
                            dbTransaction.Commit();
                            Sls_TR_Invoice.TrNo = int.Parse(result.ResponseData.ToString());
                            return Ok(new BaseResponse(Sls_TR_Invoice));
                        }
                        else
                        {
                            dbTransaction.Rollback();
                            return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, result.ResponseMessage));
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
        public IHttpActionResult updateReturnMasterDetail([FromBody]SlsInvoiceMasterDetails updatedObj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(updatedObj.Token, updatedObj.UserCode))
            {
                using (var dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        //var tm = DateTime.Now.ToString("HH:mm:ss");
                        //updatedObj.I_Sls_TR_Invoice.TrTime = TimeSpan.Parse(tm);


                        DateTime data1 = DateTime.Now;
                        DateTime tstamp = DateTime.Now;

                        tstamp = QRGeneratorController.AddTimeIndata(data1, updatedObj.I_Sls_TR_Invoice.TrTime.ToString());


                        if (updatedObj.I_Sls_TR_Invoice.Status == 1)
                        {


                            QrModel QrRec = new QrModel();
                            QrRec.CompName = updatedObj.CompName;
                            QrRec.VatNo = updatedObj.VatNo;
                            QrRec.Total = updatedObj.I_Sls_TR_Invoice.TotalAmount;
                            QrRec.Vat = updatedObj.I_Sls_TR_Invoice.VatAmount;
                            //QrRec.TrDate = tstamp;
                            data1 = Convert.ToDateTime(updatedObj.I_Sls_TR_Invoice.TrDate);
                            tstamp = QRGeneratorController.MargeTime_in_Date(data1, tstamp);

                            QrRec.TrDate = tstamp;
                            //QrRec.TrDate = updatedObj.I_Sls_TR_Invoice.TrDate;


                            string QrCode = QRGeneratorController.QrGenerator(QrRec);

                            string st = SystemToolsController.GenerateGuid();
                            updatedObj.I_Sls_TR_Invoice.DocUUID = st;
                            updatedObj.I_Sls_TR_Invoice.QRCode = QrCode;
                            //updatedObj.I_Sls_TR_Invoice.TrDate = tstamp.Date;
                            //updatedObj.I_Sls_TR_Invoice.CreatedAt = tstamp;
                            //updatedObj.I_Sls_TR_Invoice.TrTime = tstamp.TimeOfDay;
                        }

                        //update Master
                        var Sls_TR_Invoice = SlsTrSalesService.Update(updatedObj.I_Sls_TR_Invoice);

                        //update Details
                        var insertedInvoiceItems = updatedObj.I_Sls_TR_InvoiceItems.Where(x => x.StatusFlag == 'i').ToList();
                        var updatedInvoiceItems = updatedObj.I_Sls_TR_InvoiceItems.Where(x => x.StatusFlag == 'u').ToList();
                        var deletedInvoiceItems = updatedObj.I_Sls_TR_InvoiceItems.Where(x => x.StatusFlag == 'd').ToList();

                        //loop insered  
                        foreach (var item in insertedInvoiceItems)
                        {
                            item.InvoiceID = updatedObj.I_Sls_TR_Invoice.InvoiceID;
                            var InsertedRec = SlsInvoiceItemsService.Insert(item);
                        }

                        //loop Update  
                        foreach (var item in updatedInvoiceItems)
                        {
                            item.InvoiceID = updatedObj.I_Sls_TR_Invoice.InvoiceID;
                            var updatedRec = SlsInvoiceItemsService.Update(item);
                        }

                        //loop Delete  
                        foreach (var item in deletedInvoiceItems)
                        {
                            int deletedId = item.InvoiceItemID;
                            SlsInvoiceItemsService.Delete(deletedId);
                        }
                        // call process trans 

                        ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(updatedObj.I_Sls_TR_Invoice.CompCode), Convert.ToInt32(updatedObj.I_Sls_TR_Invoice.BranchCode), Sls_TR_Invoice.InvoiceID, "SlsReturn", "Update", db);
                        if (res.ResponseState == true)
                        {
                            //updatedObj.I_Sls_TR_Invoice.TrNo = int.Parse(res.ResponseData.ToString());
                            dbTransaction.Commit();

                            var displayData = db.IQ_GetSlsInvoiceStatisticVer2.Where(x => x.InvoiceID == updatedObj.I_Sls_TR_Invoice.InvoiceID).FirstOrDefault();
                            LogUser.InsertPrint(db, updatedObj.Comp_Code.ToString(), updatedObj.Branch_Code, updatedObj.sec_FinYear, updatedObj.UserCode, updatedObj.I_Sls_TR_Invoice.InvoiceID, updatedObj.I_Sls_TR_Invoice.TrNo.ToString(), LogUser.UserLog.Update, updatedObj.MODULE_CODE, true, null, null, null);
                            return Ok(new BaseResponse(displayData));
                        }
                        else
                        {
                            dbTransaction.Rollback();
                            LogUser.InsertPrint(db, updatedObj.Comp_Code.ToString(), updatedObj.Branch_Code, updatedObj.sec_FinYear, updatedObj.UserCode, updatedObj.I_Sls_TR_Invoice.InvoiceID, updatedObj.I_Sls_TR_Invoice.TrNo.ToString(), LogUser.UserLog.Update, updatedObj.MODULE_CODE, false, res.ResponseMessage.ToString(), null, null);

                            return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, res.ResponseMessage));
                        }
                    }
                    catch (Exception ex)
                    {
                        dbTransaction.Rollback();
                        LogUser.InsertPrint(db, updatedObj.Comp_Code.ToString(), updatedObj.Branch_Code, updatedObj.sec_FinYear, updatedObj.UserCode, updatedObj.I_Sls_TR_Invoice.InvoiceID, updatedObj.I_Sls_TR_Invoice.TrNo.ToString(), LogUser.UserLog.Update, updatedObj.MODULE_CODE, false, ex.Message.ToString(), null, null);

                        return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                    }
                }
            }
            return BadRequest(ModelState);
        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult OpenReturn([FromBody] SlsInvoiceMasterDetails updatedObj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(updatedObj.Token, updatedObj.UserCode))
            {
                using (var dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        //update Master
                        var Sls_TR_Invoice = SlsTrSalesService.Update(updatedObj.I_Sls_TR_Invoice);

                        //update Details
                        var insertedInvoiceItems = updatedObj.I_Sls_TR_InvoiceItems.Where(x => x.StatusFlag == 'i').ToList();
                        var updatedInvoiceItems = updatedObj.I_Sls_TR_InvoiceItems.Where(x => x.StatusFlag == 'u').ToList();
                        var deletedInvoiceItems = updatedObj.I_Sls_TR_InvoiceItems.Where(x => x.StatusFlag == 'd').ToList();

                        //loop insered  
                        foreach (var item in insertedInvoiceItems)
                        {
                            item.InvoiceID = updatedObj.I_Sls_TR_Invoice.InvoiceID;
                            var InsertedRec = SlsInvoiceItemsService.Insert(item);
                        }

                        //loop Update  
                        foreach (var item in updatedInvoiceItems)
                        {
                            item.InvoiceID = updatedObj.I_Sls_TR_Invoice.InvoiceID;
                            var updatedRec = SlsInvoiceItemsService.Update(item);
                        }

                        //loop Delete  
                        foreach (var item in deletedInvoiceItems)
                        {
                            int deletedId = item.InvoiceItemID;
                            SlsInvoiceItemsService.Delete(deletedId);
                        }
                        // process Transaction
                        ResponseResult result = Shared.TransactionProcess(int.Parse(Sls_TR_Invoice.CompCode.ToString()), int.Parse(Sls_TR_Invoice.BranchCode.ToString()), Sls_TR_Invoice.InvoiceID, "SlsReturn", "Open", db);
                        if (result.ResponseState == true)
                        {
                            dbTransaction.Commit();
                            // Sls_TR_Invoice.TrNo = int.Parse(result.ResponseData.ToString());
                            LogUser.InsertPrint(db, updatedObj.Comp_Code.ToString(), updatedObj.Branch_Code, updatedObj.sec_FinYear, updatedObj.UserCode, updatedObj.I_Sls_TR_Invoice.InvoiceID, updatedObj.I_Sls_TR_Invoice.TrNo.ToString(), LogUser.UserLog.Open, updatedObj.MODULE_CODE, true, null, null, null);
                            var displayData = db.IQ_GetSlsInvoiceStatisticVer2.Where(x => x.InvoiceID == updatedObj.I_Sls_TR_Invoice.InvoiceID).FirstOrDefault();
                            return Ok(new BaseResponse(displayData));
                        }
                        else
                        {
                            dbTransaction.Rollback();
                            LogUser.InsertPrint(db, updatedObj.Comp_Code.ToString(), updatedObj.Branch_Code, updatedObj.sec_FinYear, updatedObj.UserCode, updatedObj.I_Sls_TR_Invoice.InvoiceID, updatedObj.I_Sls_TR_Invoice.TrNo.ToString(), LogUser.UserLog.Open, updatedObj.MODULE_CODE, false, result.ResponseMessage.ToString(), null, null);
                            return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, result.ResponseMessage));
                        }

                    }
                    catch (Exception ex)
                    {
                        dbTransaction.Rollback();
                        LogUser.InsertPrint(db, updatedObj.Comp_Code.ToString(), updatedObj.Branch_Code, updatedObj.sec_FinYear, updatedObj.UserCode, updatedObj.I_Sls_TR_Invoice.InvoiceID, updatedObj.I_Sls_TR_Invoice.TrNo.ToString(), LogUser.UserLog.Open, updatedObj.MODULE_CODE, false, ex.Message.ToString(), null, null);
                        return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                    }
                }
            }
            return BadRequest(ModelState);
        }


        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllSlsTrShowPriceStatistic(int CompCode, int BranchCode, int IsCash, string StartDate, string EndDate, int Status, int? CustId, int? SalesMan, string UserCode, string Token, string MODULE_CODE, string FinYear)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                string s = "select * from IQ_GetSlsInvoiceStatisticVer2 where TrType = 2 and BranchCode = " + BranchCode + " and CompCode = " + CompCode + "and SlsInvSrc = 1 and TrDate >=' " + StartDate + "' and TrDate <= ' " + EndDate + " ' ";
                string condition = "";
                if (CustId != 0 && CustId != null)
                    condition = condition + " and CustomerId =" + CustId;
                if (SalesMan != 0 && SalesMan != null)
                    condition = condition + " and SalesmanId =" + SalesMan;// and Status = " + Status
                if (Status == 2)
                    condition = condition + "";
                else
                {
                    condition = condition + " and Status = " + Status;
                }
                /////////////' and IsCash = '" + IsCash+"'"
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
                ///////////
                string query = s + condition;
                var res = db.Database.SqlQuery<IQ_GetSlsInvoiceStatisticVer2>(query).ToList();
               
                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }


        [HttpPost, AllowAnonymous]
        public IHttpActionResult updateSlsTrShowPriceDetail([FromBody]SlsInvoiceMasterDetails updatedObj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(updatedObj.Token, updatedObj.UserCode))
            {
                using (var dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        //var tm = DateTime.Now.ToString("HH:mm:ss");
                        //updatedObj.I_Sls_TR_Invoice.TrTime = TimeSpan.Parse(tm);


                        
                        //update Master
                        var Sls_TR_Invoice = SlsTrSalesService.Update(updatedObj.I_Sls_TR_Invoice);

                        //update Details
                        var insertedInvoiceItems = updatedObj.I_Sls_TR_InvoiceItems.Where(x => x.StatusFlag == 'i').ToList();
                        var updatedInvoiceItems = updatedObj.I_Sls_TR_InvoiceItems.Where(x => x.StatusFlag == 'u').ToList();
                        var deletedInvoiceItems = updatedObj.I_Sls_TR_InvoiceItems.Where(x => x.StatusFlag == 'd').ToList();

                        //loop insered  
                        foreach (var item in insertedInvoiceItems)
                        {
                            item.InvoiceID = updatedObj.I_Sls_TR_Invoice.InvoiceID;
                            var InsertedRec = SlsInvoiceItemsService.Insert(item);
                        }

                        //loop Update  
                        foreach (var item in updatedInvoiceItems)
                        {
                            item.InvoiceID = updatedObj.I_Sls_TR_Invoice.InvoiceID;
                            var updatedRec = SlsInvoiceItemsService.Update(item);
                        }

                        //loop Delete  
                        foreach (var item in deletedInvoiceItems)
                        {
                            int deletedId = item.InvoiceItemID;
                            SlsInvoiceItemsService.Delete(deletedId);
                        }
                        // call process trans 
                        
                        ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(updatedObj.I_Sls_TR_Invoice.CompCode), Convert.ToInt32(updatedObj.I_Sls_TR_Invoice.BranchCode), Sls_TR_Invoice.InvoiceID, "ShwPrice", "Update", db);
                        if (res.ResponseState == true)
                        {
                            updatedObj.I_Sls_TR_Invoice.TrNo = int.Parse(res.ResponseData.ToString());
                            dbTransaction.Commit();
                            LogUser.InsertPrint(db, updatedObj.Comp_Code.ToString(),updatedObj.Branch_Code, updatedObj.sec_FinYear, updatedObj.UserCode, updatedObj.I_Sls_TR_Invoice.InvoiceID, updatedObj.I_Sls_TR_Invoice.TrNo.ToString(), LogUser.UserLog.Update, updatedObj.MODULE_CODE, true, null, null, null);

                            return Ok(new BaseResponse(updatedObj.I_Sls_TR_Invoice));
                        }
                        else
                        {
                            dbTransaction.Rollback();
                            LogUser.InsertPrint(db, updatedObj.Comp_Code.ToString(), updatedObj.Branch_Code, updatedObj.sec_FinYear, updatedObj.UserCode, updatedObj.I_Sls_TR_Invoice.InvoiceID, updatedObj.I_Sls_TR_Invoice.TrNo.ToString(), LogUser.UserLog.Update, updatedObj.MODULE_CODE, false, res.ResponseState.ToString(), null, null);

                            return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, res.ResponseMessage));
                        }
                    }
                    catch (Exception ex)
                    {
                        dbTransaction.Rollback();
                        LogUser.InsertPrint(db, updatedObj.Comp_Code.ToString(), updatedObj.Branch_Code, updatedObj.sec_FinYear, updatedObj.UserCode, updatedObj.I_Sls_TR_Invoice.InvoiceID, updatedObj.I_Sls_TR_Invoice.TrNo.ToString(), LogUser.UserLog.Update, updatedObj.MODULE_CODE, false, ex.Message.ToString(), null, null);

                        return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                    }
                }
            }
            return BadRequest(ModelState);
        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult OpenShwPrice([FromBody] SlsInvoiceMasterDetails updatedObj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(updatedObj.Token, updatedObj.UserCode))
            {
                using (var dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {

                        //update Master
                        var Sls_TR_Invoice = SlsTrSalesService.Update(updatedObj.I_Sls_TR_Invoice);

                        //update Details
                        var insertedInvoiceItems = updatedObj.I_Sls_TR_InvoiceItems.Where(x => x.StatusFlag == 'i').ToList();
                        var updatedInvoiceItems = updatedObj.I_Sls_TR_InvoiceItems.Where(x => x.StatusFlag == 'u').ToList();
                        var deletedInvoiceItems = updatedObj.I_Sls_TR_InvoiceItems.Where(x => x.StatusFlag == 'd').ToList();

                        //loop insered  
                        foreach (var item in insertedInvoiceItems)
                        {
                            item.InvoiceID = updatedObj.I_Sls_TR_Invoice.InvoiceID;
                            var InsertedRec = SlsInvoiceItemsService.Insert(item);
                        }

                        //loop Update  
                        foreach (var item in updatedInvoiceItems)
                        {
                            item.InvoiceID = updatedObj.I_Sls_TR_Invoice.InvoiceID;
                            var updatedRec = SlsInvoiceItemsService.Update(item);
                        }

                        //loop Delete  
                        foreach (var item in deletedInvoiceItems)
                        {
                            int deletedId = item.InvoiceItemID;
                            SlsInvoiceItemsService.Delete(deletedId);
                        }
                        // process Transaction
                        ResponseResult result = Shared.TransactionProcess(int.Parse(Sls_TR_Invoice.CompCode.ToString()), int.Parse(Sls_TR_Invoice.BranchCode.ToString()), Sls_TR_Invoice.InvoiceID, "ShwPrice", "Open", db);
                        if (result.ResponseState == true)
                        {
                           
                           // Sls_TR_Invoice.TrNo = int.Parse(result.ResponseData.ToString());
                            dbTransaction.Commit();
                            LogUser.InsertPrint(db, updatedObj.Comp_Code.ToString(), updatedObj.Branch_Code, updatedObj.sec_FinYear, updatedObj.UserCode, updatedObj.I_Sls_TR_Invoice.InvoiceID, updatedObj.I_Sls_TR_Invoice.TrNo.ToString(), LogUser.UserLog.Open, updatedObj.MODULE_CODE, true, null, null, null);
                            return Ok(new BaseResponse(Sls_TR_Invoice));
                        }
                        else
                        {
                            dbTransaction.Rollback();
                            LogUser.InsertPrint(db, updatedObj.Comp_Code.ToString(), updatedObj.Branch_Code, updatedObj.sec_FinYear, updatedObj.UserCode, updatedObj.I_Sls_TR_Invoice.InvoiceID, updatedObj.I_Sls_TR_Invoice.TrNo.ToString(), LogUser.UserLog.Open, updatedObj.MODULE_CODE, false, result.ResponseMessage.ToString(), null, null);
                            return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, result.ResponseMessage));
                        }

                    }
                    catch (Exception ex)
                    {
                        dbTransaction.Rollback();
                        LogUser.InsertPrint(db, updatedObj.Comp_Code.ToString(), updatedObj.Branch_Code, updatedObj.sec_FinYear, updatedObj.UserCode, updatedObj.I_Sls_TR_Invoice.InvoiceID, updatedObj.I_Sls_TR_Invoice.TrNo.ToString(), LogUser.UserLog.Open, updatedObj.MODULE_CODE, false, ex.Message.ToString(), null, null);
                        return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                    }
                }
            }
            return BadRequest(ModelState);
        }


        [HttpPost, AllowAnonymous]
        public IHttpActionResult InsertShwPriceMasterDetail([FromBody]SlsInvoiceMasterDetails obj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(obj.Token, obj.UserCode))
            {
                using (var dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {

                      



                        obj.I_Sls_TR_Invoice.AllowAfterVat = obj.I_Sls_TR_Invoice.AllowAfterVat == null ? 0 : obj.I_Sls_TR_Invoice.AllowAfterVat;
                        var Sls_TR_Invoice = SlsTrSalesService.Insert(obj.I_Sls_TR_Invoice);
                        for (int i = 0; i < obj.I_Sls_TR_InvoiceItems.Count; i++)
                        {
                            obj.I_Sls_TR_InvoiceItems[i].InvoiceID = Sls_TR_Invoice.InvoiceID;
                        }
                        SlsInvoiceItemsService.InsertLst(obj.I_Sls_TR_InvoiceItems);
                        // call process trans 
                        
                        ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(obj.I_Sls_TR_Invoice.CompCode), Convert.ToInt32(obj.I_Sls_TR_Invoice.BranchCode), Sls_TR_Invoice.InvoiceID, "ShwPrice", "Add", db);
                        if (res.ResponseState == true)
                        {
                            obj.I_Sls_TR_Invoice.TrNo = int.Parse(res.ResponseData.ToString());
                            dbTransaction.Commit();
                            LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.I_Sls_TR_Invoice.InvoiceID, obj.I_Sls_TR_Invoice.TrNo.ToString(), LogUser.UserLog.Insert, obj.MODULE_CODE, true, null, null, null);

                            return Ok(new BaseResponse(obj.I_Sls_TR_Invoice));
                        }
                        else
                        {
                            dbTransaction.Rollback();
                            LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.I_Sls_TR_Invoice.InvoiceID, obj.I_Sls_TR_Invoice.TrNo.ToString(), LogUser.UserLog.Insert, obj.MODULE_CODE, false, res.ResponseState.ToString(), null, null);

                            return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, res.ResponseMessage));
                        }
                        ////////
                    }
                    catch (Exception ex)
                    {
                        dbTransaction.Rollback();
                        LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.I_Sls_TR_Invoice.InvoiceID, obj.I_Sls_TR_Invoice.TrNo.ToString(), LogUser.UserLog.Insert, obj.MODULE_CODE, false, ex.Message.ToString(), null, null);

                        return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                    }
                }
            }
            return BadRequest(ModelState);
        }


        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetLastPrice(int CompCode, int BranchCode, int itemid, int customerid, int storeid, int? invid)
        {
            //if (invid == 0) invid = null;

            try
            {

          
            string query = @"  DECLARE	@return_value int,
                                      		@CustLastPrice numeric(18, 2),
                                      		@CustLastTr int,
                                      		@custLastDate nvarchar(20),
                                      		@LastPrice numeric(18, 2),
                                      		@LastPurchase numeric(18, 2),
                                      		@Curcost numeric(18, 2);
                                      
                                      EXEC	@return_value = [dbo].[IProc_GetLastSalePrice] ";
            query = query + CompCode.ToString() + "," + BranchCode.ToString() + "," + itemid.ToString() + "," + customerid.ToString() + "," + storeid.ToString() + "," + (invid == 0 ? "null" : invid.ToString());
                 
                           query = query + @" ,@CustLastPrice = @CustLastPrice OUTPUT,
                                      		@CustLastTr = @CustLastTr OUTPUT,
                                      		@custLastDate = @custLastDate OUTPUT,
                                      		@LastPrice = @LastPrice OUTPUT,
                                      		@LastPurchase = @LastPurchase OUTPUT,
                                      		@Curcost = @Curcost OUTPUT;
                                      
                                     SELECT	@CustLastPrice as N'CustLastPrice',
                                      		@CustLastTr as N'CustLastTr',
                                      		@custLastDate as N'custLastDate',
                                      		@LastPrice as N'LastPrice',
                                      		@LastPurchase as N'LastPurchase',
                                      		@Curcost as N'Curcost'  ";
             
                var res = db.Database.SqlQuery<ModelLastPrice>(query).FirstOrDefault();
                return Ok(new BaseResponse(res));

            }
            catch (Exception ex)
            { 
                return Ok(new BaseResponse(ex)); 
            }


        }
    }
}
