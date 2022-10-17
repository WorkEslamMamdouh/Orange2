using Inv.API.Models;
using Inv.API.Tools;
using Inv.BLL.Services.PurTrReceive;
using Inv.BLL.Services.PurInvoiceItems;
using Inv.BLL.Services.PurDefCharges;
using Inv.BLL.Services.PurTRCharges;
using Inv.BLL.Services.PurOrder;
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
    public class PurTrReceiveController : BaseController
    {
        private readonly IPurTrReceiveService PurTrReceiveService;
        private readonly G_USERSController UserControl;
        private readonly IPurTRReceiveItemsService PurTRReceiveItemsService;
        private readonly IPurDefChargesService PurDefChargesService;
        private readonly IPurTRChargesService PurTRChargesService;
        private readonly IPurOrderService IPurOrderService;

        public PurTrReceiveController(IPurTrReceiveService _IPurTrReceiveService, G_USERSController _Control, IPurTRReceiveItemsService _IPurTRReceiveItemsService, IPurDefChargesService _IPurDefChargesService, IPurTRChargesService _IPurTRChargesService, IPurOrderService _IPurOrderService)
        {
            this.PurTrReceiveService = _IPurTrReceiveService;
            this.UserControl = _Control;
            this.PurTRReceiveItemsService = _IPurTRReceiveItemsService;
            this.PurDefChargesService = _IPurDefChargesService;
            this.PurTRChargesService = _IPurTRChargesService;
            this.IPurOrderService = _IPurOrderService;
        }
        #region Purchase 
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAll(int CompCode,int BranchCode, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var ItemStoreInfoList = PurTrReceiveService.GetAll(x => x.CompCode == CompCode && x.BranchCode == BranchCode).ToList();

                return Ok(new BaseResponse(ItemStoreInfoList));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetById(int id, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var ItemStoreInfo = PurTrReceiveService.GetByIdFromIItem(id);

                return Ok(new BaseResponse(ItemStoreInfo));
            }
            return BadRequest(ModelState);
        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult Updatelist(List<I_Pur_TR_Receive> itemDefList)
        {

            //if (ModelState.IsValid && UserControl.CheckUser(itemDefList[0].Token, itemDefList[0].UserCode))
            //{
            //    using (var dbTransaction = db.Database.BeginTransaction())
            //    {
            //        try
            //        {
            //            Boolean AllSuccess = true;
            //            var insertedRecords = itemDefList.FindAll(x => x.StatusFlag == 'i');
            //            var updatedRecords = itemDefList.FindAll(x => x.StatusFlag == 'u');
            //            var deletedRecords = itemDefList.FindAll(x => x.StatusFlag == 'd');
            //            ResponseResult res = new ResponseResult();
            //            //loop insered 
            //            foreach (var item in insertedRecords)
            //            {
            //              //  item.CreatedAt = DateTime.Now;
            //                var InsertedRec = PurTrReceiveService.Insert(item);
            //                int br = 1; // item has no branch 
            //                res = Shared.TransactionProcess(Convert.ToInt32(InsertedRec.CompCode), br, InsertedRec.ItemID, "ItemDef", "Add", db);
            //                if (res.ResponseState == false)
            //                {
            //                    AllSuccess = false;
            //                    break;
            //                }

            //            }

            //            //loop Update 
            //            foreach (var item in updatedRecords)
            //            {
            //                item.UpdatedAt = DateTime.Now;
            //                var updatedRec = PurTrReceiveService.Update(item);
            //                int br = 1; // item has no branch 
            //                res = Shared.TransactionProcess(Convert.ToInt32(updatedRec.CompCode), br, updatedRec.ItemID, "ItemDef", "Update", db);
            //                if (res.ResponseState == false)
            //                {
            //                    AllSuccess = false;
            //                    break;
            //                }

            //            }

            //            //loop Delete 
            //            foreach (var item in deletedRecords)
            //            {

            //                int deletedId = item.ItemID;
            //                int DeletedComp = Convert.ToInt32(item.CompCode);
            //                int br = 1; // item has no branch 
            //                res = Shared.TransactionProcess(Convert.ToInt32(item.CompCode), br, item.ItemID, "ItemDef", "Delete", db);
            //                if (res.ResponseState == false)
            //                {
            //                    AllSuccess = false;
            //                    break;
            //                }
            //                else
            //                {
            //                    PurTrReceiveService.Delete(item.ItemID);
            //                }

            //            }

            //            // if all success commit 
            //            if (AllSuccess)
            //            {
            //                dbTransaction.Commit();
            //                // Return in case if the db generate transaction number   res.ResponseData
            //                return Ok(new BaseResponse(100));
            //            }
            //            else
            //            {
            //                dbTransaction.Rollback();
            //                return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, res.ResponseMessage));
            //            }


            //        }
            //        catch (Exception ex)
            //        {
            //            dbTransaction.Rollback();
            //            return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
            //        }
            //    }
            //}
            return BadRequest(ModelState);
        }

        //IQ_GetPurReceiveCharge
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetPurReceiveCharge(int ReceiveID, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var res = db.IQ_GetPurReceiveCharge.Where(s => s.ReceiveID == ReceiveID).ToList();
                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }
        //
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllPurReceiveStaistic(int CompCode,int BranchCode , string startDate, string endDate, int trtype, int Status, int? VendorId, int? SalesmanId, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                string s = "select * from IQ_GetPurReceiveStaistic where  CompCode = " + CompCode + " and BranchCode = "+ BranchCode + " and TrDate >=' " + startDate + "' and TrDate <=' " + endDate + " ' and TrType= " + trtype;

                string condition = "";

                if (SalesmanId != 0 && SalesmanId != null)
                    condition = condition + " and SalesmanId =" + SalesmanId;

                if (VendorId != 0 && VendorId != null)
                    condition = condition + " and VendorID =" + VendorId;

                if (Status == 0 || Status == 1)
                {
                    condition = condition + " and Status = " + Status;
                }
                else if (Status == 2)
                {
                    condition = condition + "";
                }

                string query = s + condition;
                var res = db.Database.SqlQuery<IQ_GetPurReceiveStaistic>(query).ToList();
                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }
        //IQ_GetPurChargeInfo
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetPurChargeInfo(int ChargeID, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var res = db.IQ_GetPurChargeInfo.Where(s => s.ChargeID == ChargeID).ToList();
                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }
        //I_Pur_TR_Receive  I_Pur_TR_ReceiveItems
        [HttpPost, AllowAnonymous]//done 
        public IHttpActionResult InsertPurchaseReceiveMasterDetail([FromBody]PurInvoiceMasterDetails obj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(obj.Token, obj.UserCode))
            {
                using (var dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        var Pur_TR_Invoice = PurTrReceiveService.Insert(obj.I_Pur_TR_Receive);
                        for (int i = 0; i < obj.I_Pur_TR_ReceiveItems.Count; i++)
                        {
                            obj.I_Pur_TR_ReceiveItems[i].ReceiveID = Pur_TR_Invoice.ReceiveID;
                        }
                        for (int i = 0; i < obj.I_Pur_Tr_ReceiveCharges.Count; i++)
                        {
                            obj.I_Pur_Tr_ReceiveCharges[i].ReceiveID = Pur_TR_Invoice.ReceiveID;
                        }
                        PurTRReceiveItemsService.InsertLst(obj.I_Pur_TR_ReceiveItems);
                        PurTRChargesService.InsertLst(obj.I_Pur_Tr_ReceiveCharges);

                        
                        ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(obj.I_Pur_TR_Receive.CompCode), Convert.ToInt32(obj.I_Pur_TR_Receive.BranchCode), Pur_TR_Invoice.ReceiveID, "PurInvoice", "Add", db);
                        if (res.ResponseState == true)
                        {
                            obj.I_Pur_TR_Receive.TrNo = int.Parse(res.ResponseData.ToString());
                            dbTransaction.Commit();

                            var displayData = db.IQ_GetPurReceiveStaistic.Where(x => x.ReceiveID == Pur_TR_Invoice.ReceiveID).FirstOrDefault();

                            LogUser.InsertPrint(db, obj.Comp_Code.ToString(),obj.Branch_Code, obj.sec_FinYear, obj.UserCode, null, LogUser.UserLog.Insert, obj.MODULE_CODE, true, null, null, null);

                            return Ok(new BaseResponse(displayData));
                        }
                        else
                        {
                            dbTransaction.Rollback();
                            LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, null, LogUser.UserLog.Insert, obj.MODULE_CODE, false, res.ResponseMessage.ToString(), null, null);

                            return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, res.ResponseMessage));
                        }
                    }
                    catch (Exception ex)
                    {
                        dbTransaction.Rollback();
                        LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, null, LogUser.UserLog.Insert, obj.MODULE_CODE, false, ex.Message.ToString(), null, null);

                        return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                    }
                }
            }
            return BadRequest(ModelState);
        }
        //IQ_GetPurReceiveItem
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetPurReceiveItems(int receiveID, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var res = db.IQ_GetPurReceiveItem.Where(x => x.ReceiveID == receiveID).ToList();
                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult AllGetPurReceiveItemsCharge(int ReceiveID, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                 
                var res_1 = db.IQ_GetPurReceiveItem.Where(x => x.ReceiveID == ReceiveID).ToList();
                var res_2 = db.IQ_GetPurReceiveCharge.Where(s => s.ReceiveID == ReceiveID).ToList();

                IQ_GetPurReceiveMasterDisplay Model = new IQ_GetPurReceiveMasterDisplay();
                Model.IQ_GetPurReceiveItem = res_1;
                Model.IQ_GetPurReceiveCharge = res_2;
                return Ok(new BaseResponse(Model));
                 
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllPurReceiveStatistic(int CompCode, int BranchCode , string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                List<IQ_GetPurReceiveStaistic> res = db.IQ_GetPurReceiveStaistic.Where(x => x.CompCode == CompCode && x.BranchCode == BranchCode).ToList();
                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetPurReceiveByIDFromStatistics(int receiveID, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var res = db.IQ_GetPurReceiveStaistic.Where(s => s.ReceiveID == receiveID).ToList();
                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllPurDefCharges(int compCode , string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var res = PurDefChargesService.GetAll(s => s.CompCode == compCode);
                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }
        [HttpPost, AllowAnonymous]
        public IHttpActionResult UpdateListPurchaseReceiveMasterDetail([FromBody]PurInvoiceMasterDetails updatedObj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(updatedObj.Token, updatedObj.UserCode))
            {
                using (var dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        // update master
                        PurTrReceiveService.Update(updatedObj.I_Pur_TR_Receive);

                        //update I_Pur_Tr_ReceiveCharges 
                        var insertedRecordsCharges = updatedObj.I_Pur_Tr_ReceiveCharges.Where(x => x.StatusFlag == 'i').ToList();
                        var updatedRecordsCharges = updatedObj.I_Pur_Tr_ReceiveCharges.Where(x => x.StatusFlag == 'u').ToList();
                        var deletedRecordsCharges = updatedObj.I_Pur_Tr_ReceiveCharges.Where(x => x.StatusFlag == 'd').ToList();

                        //update I_Pur_TR_ReceiveItems 
                        var insertedRecordsReceiveItems = updatedObj.I_Pur_TR_ReceiveItems.Where(x => x.StatusFlag == 'i').ToList();
                        var updatedRecordsReceiveItems = updatedObj.I_Pur_TR_ReceiveItems.Where(x => x.StatusFlag == 'u').ToList();
                        var deletedRecordsReceiveItems = updatedObj.I_Pur_TR_ReceiveItems.Where(x => x.StatusFlag == 'd').ToList();


                        //loop insered  I_Pur_Tr_ReceiveCharges
                        foreach (var item in insertedRecordsCharges)
                        {
                            item.ReceiveID = updatedObj.I_Pur_TR_Receive.ReceiveID;
                            var InsertedRec = PurTRChargesService.Insert(item);
                        }

                        //loop Update  I_Pur_Tr_ReceiveCharges
                        foreach (var item in updatedRecordsCharges)
                        {
                            item.ReceiveID = updatedObj.I_Pur_TR_Receive.ReceiveID;
                            var updatedRec = PurTRChargesService.Update(item);
                        }

                        //loop Delete  I_Pur_Tr_ReceiveCharges
                        foreach (var item in deletedRecordsCharges)
                        {
                            int deletedId = item.ReceiveExpensesID;
                            PurTRChargesService.Delete(deletedId);
                        }


                        //loop insered  I_Pur_TR_ReceiveItems
                        foreach (var item in insertedRecordsReceiveItems)
                        {
                            item.ReceiveID = updatedObj.I_Pur_TR_Receive.ReceiveID;
                            var InsertedRec = PurTRReceiveItemsService.Insert(item);
                        }

                        //loop Update  I_Pur_TR_ReceiveItems
                        foreach (var item in updatedRecordsReceiveItems)
                        {
                            item.ReceiveID = updatedObj.I_Pur_TR_Receive.ReceiveID;
                            var updatedRec = PurTRReceiveItemsService.Update(item);
                        }

                        //loop Delete  I_Pur_TR_ReceiveItems
                        foreach (var item in deletedRecordsReceiveItems)
                        {
                            int deletedId = item.ReciveDetailsID;
                            PurTRReceiveItemsService.Delete(deletedId);
                        }

                        
                        ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(updatedObj.I_Pur_TR_Receive.CompCode), Convert.ToInt32(updatedObj.I_Pur_TR_Receive.BranchCode), updatedObj.I_Pur_TR_Receive.ReceiveID, "PurInvoice", "Update", db);
                        if (res.ResponseState == true)
                        {
                            updatedObj.I_Pur_TR_Receive.TrNo = int.Parse(res.ResponseData.ToString());
                            dbTransaction.Commit();
                            var displayData = db.IQ_GetPurReceiveStaistic.Where(x => x.ReceiveID == updatedObj.I_Pur_TR_Receive.ReceiveID).FirstOrDefault();
                            LogUser.InsertPrint(db, updatedObj.Comp_Code.ToString(), updatedObj.Branch_Code, updatedObj.sec_FinYear, updatedObj.UserCode, null, LogUser.UserLog.Update, updatedObj.MODULE_CODE, true, null, null, null);

                            return Ok(new BaseResponse(displayData));
                        }
                        else
                        {
                            dbTransaction.Rollback();
                            LogUser.InsertPrint(db, updatedObj.Comp_Code.ToString(), updatedObj.Branch_Code, updatedObj.sec_FinYear, updatedObj.UserCode, null, LogUser.UserLog.Update, updatedObj.MODULE_CODE, false, res.ResponseMessage.ToString(), null, null);

                            return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, res.ResponseMessage));
                        }

                    }
                    catch (Exception ex)
                    {
                        dbTransaction.Rollback();
                        LogUser.InsertPrint(db, updatedObj.Comp_Code.ToString(), updatedObj.Branch_Code, updatedObj.sec_FinYear, updatedObj.UserCode, null, LogUser.UserLog.Update, updatedObj.MODULE_CODE, false, ex.Message.ToString(), null, null);

                        return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                    }
                }
            }
            return BadRequest(ModelState);
        }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllReturnPurReceiveStatistic(int CompCode,int BranchCode , string StartDate, string EndDate, int Status, int? returnType, int? VendorId, string SalesUser, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                //trtype=2
                string s = "select * from IQ_GetPurReceiveStaistic where CompCode = " + CompCode + "and BranchCode = "+ BranchCode + " and TrType = 2 and TrDate >=' " + StartDate + "' and TrDate <= ' " + EndDate + "'  and Status = " + Status;
                string condition = "";
                if (VendorId != 0 && VendorId != null)
                    condition = condition + " and VendorID =" + VendorId;
                if (SalesUser != "" && SalesUser != "null")
                    condition = condition + " and CreatedBy ='" + SalesUser + "'";
                if (returnType == 0)
                {
                    condition = condition + " and IsCash = 'false' ";
                }
                else if (returnType == 1)
                {
                    condition = condition + " and IsCash = 'true' ";
                }
                if (Status == 0)
                    condition = condition + "";
                string query = s + condition;
                var res = db.Database.SqlQuery<IQ_GetPurReceiveStaistic>(query).ToList();
                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }
        [HttpPost, AllowAnonymous]
        public IHttpActionResult open([FromBody]PurInvoiceMasterDetails updatedObj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(updatedObj.Token, updatedObj.UserCode))
            {
                using (var dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        // update master
                        PurTrReceiveService.Update(updatedObj.I_Pur_TR_Receive);
                           
                        ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(updatedObj.I_Pur_TR_Receive.CompCode), Convert.ToInt32(updatedObj.I_Pur_TR_Receive.BranchCode), updatedObj.I_Pur_TR_Receive.ReceiveID, "PurInvoice", "Open", db);
                        if (res.ResponseState == true)
                        {
                            updatedObj.I_Pur_TR_Receive.TrNo = int.Parse(updatedObj.I_Pur_TR_Receive.TrNo.ToString());
                            dbTransaction.Commit();
                            var displayData = db.IQ_GetPurReceiveStaistic.Where(x => x.ReceiveID == updatedObj.I_Pur_TR_Receive.ReceiveID).FirstOrDefault();
                            return Ok(new BaseResponse(displayData));
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
        public IHttpActionResult GetAllCashPurRecieveStatistic(int CompCode,int BranchCode, string stDate, string EndDate, int Status, int? CashBoxid, int? SalesmanId, int? Vendorid, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                string s = "select * from IQ_GetPurReceiveStaistic where CompCode = " + CompCode + " and BranchCode="+ BranchCode + " and TrType= 0  and TrDate >=' " + stDate + "' and TrDate <='  " + EndDate + "' and IsCash = 'true'  ";
                string condition = "";
                if (Status == 0)
                    CashBoxid = 0;
                if (CashBoxid != 0 && CashBoxid != null)
                    condition = condition + " and CashBoxID = " + CashBoxid;
                if (SalesmanId != 0 && SalesmanId != null)
                    condition = condition + " and SalesmanId =" + SalesmanId;
                if (Vendorid != 0 && Vendorid != null)
                    condition = condition + " and VendorID =" + Vendorid;

                if (Status == 0)// and RemainAmount > 0 
                    condition = condition + " and RemainAmount > 0";
                else if (Status == 1)// and RemainAmount > 0 
                    condition = condition + " and RemainAmount = 0";
                else if (Status == 2)// All Invoices
                    condition = condition + "";

                string query = s + condition;
                var res = db.Database.SqlQuery<IQ_GetPurReceiveStaistic>(query).ToList();
                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }
        [HttpPost, AllowAnonymous]
        public IHttpActionResult InsertReturnPurchaseReceiveMasterDetail([FromBody]PurInvoiceMasterDetails obj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(obj.Token, obj.UserCode))
            {
                using (var dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        obj.I_Pur_TR_Receive.TrType = 1;
                        var Pur_TR_Invoice = PurTrReceiveService.Insert(obj.I_Pur_TR_Receive);
                        for (int i = 0; i < obj.I_Pur_TR_ReceiveItems.Count; i++)
                        {
                            obj.I_Pur_TR_ReceiveItems[i].ReceiveID = Pur_TR_Invoice.ReceiveID;
                        }
                        PurTRReceiveItemsService.InsertLst(obj.I_Pur_TR_ReceiveItems);

                        
                        ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(obj.I_Pur_TR_Receive.CompCode), Convert.ToInt32(obj.I_Pur_TR_Receive.BranchCode), Pur_TR_Invoice.ReceiveID, "PurReturn", "Add", db);
                        if (res.ResponseState == true)
                        {
                            obj.I_Pur_TR_Receive.TrNo = int.Parse(res.ResponseData.ToString());
                            dbTransaction.Commit();
                            var displayData = db.IQ_GetPurReceiveStaistic.Where(x => x.ReceiveID == obj.I_Pur_TR_Receive.ReceiveID).FirstOrDefault();
                            LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, null, LogUser.UserLog.Insert, obj.MODULE_CODE, true, null, null, null);

                            return Ok(new BaseResponse(displayData));
                        }
                        else
                        {
                            dbTransaction.Rollback();
                            LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, null, LogUser.UserLog.Insert, obj.MODULE_CODE, false, res.ResponseMessage.ToString(), null, null);

                            return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, res.ResponseMessage));
                        }
                    }
                    catch (Exception ex)
                    {
                        dbTransaction.Rollback();
                        LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, null, LogUser.UserLog.Insert, obj.MODULE_CODE, false, ex.Message.ToString(), null, null);

                        return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                    }
                }
            }
            return BadRequest(ModelState);
        }
        [HttpPost, AllowAnonymous]
        public IHttpActionResult UpdateReturnPurchaseReceiveMasterDetail([FromBody]PurInvoiceMasterDetails updatedObj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(updatedObj.Token, updatedObj.UserCode))
            {
                using (var dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        // update master
                        PurTrReceiveService.Update(updatedObj.I_Pur_TR_Receive);


                        //update I_Pur_TR_ReceiveItems 
                        var insertedRecordsReceiveItems = updatedObj.I_Pur_TR_ReceiveItems.Where(x => x.StatusFlag == 'i').ToList();
                        var updatedRecordsReceiveItems = updatedObj.I_Pur_TR_ReceiveItems.Where(x => x.StatusFlag == 'u').ToList();
                        var deletedRecordsReceiveItems = updatedObj.I_Pur_TR_ReceiveItems.Where(x => x.StatusFlag == 'd').ToList();


                        //loop insered  I_Pur_TR_ReceiveItems
                        foreach (var item in insertedRecordsReceiveItems)
                        {
                            item.ReceiveID = updatedObj.I_Pur_TR_Receive.ReceiveID;
                            var InsertedRec = PurTRReceiveItemsService.Insert(item);
                        }

                        //loop Update  I_Pur_TR_ReceiveItems
                        foreach (var item in updatedRecordsReceiveItems)
                        {
                            item.ReceiveID = updatedObj.I_Pur_TR_Receive.ReceiveID;
                            var updatedRec = PurTRReceiveItemsService.Update(item);
                        }

                        //loop Delete  I_Pur_TR_ReceiveItems
                        foreach (var item in deletedRecordsReceiveItems)
                        {
                            int deletedId = item.ReciveDetailsID;
                            PurTRReceiveItemsService.Delete(deletedId);
                        }

                        
                        ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(updatedObj.I_Pur_TR_Receive.CompCode), Convert.ToInt32(updatedObj.I_Pur_TR_Receive.BranchCode), updatedObj.I_Pur_TR_Receive.ReceiveID, "PurReturn", "Update", db);
                        if (res.ResponseState == true)
                        {
                            updatedObj.I_Pur_TR_Receive.TrNo = int.Parse(res.ResponseData.ToString());
                            dbTransaction.Commit();
                            var displayData = db.IQ_GetPurReceiveStaistic.Where(x => x.ReceiveID == updatedObj.I_Pur_TR_Receive.ReceiveID).FirstOrDefault();
                            LogUser.InsertPrint(db, updatedObj.Comp_Code.ToString(), updatedObj.Branch_Code, updatedObj.sec_FinYear, updatedObj.UserCode, null, LogUser.UserLog.Update, updatedObj.MODULE_CODE, true, null, null, null);

                            return Ok(new BaseResponse(displayData));
                        }
                        else
                        {
                            dbTransaction.Rollback();
                            LogUser.InsertPrint(db, updatedObj.Comp_Code.ToString(), updatedObj.Branch_Code, updatedObj.sec_FinYear, updatedObj.UserCode, null, LogUser.UserLog.Update, updatedObj.MODULE_CODE, false, res.ResponseMessage.ToString(), null, null);

                            return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, res.ResponseMessage));
                        }

                    }
                    catch (Exception ex)
                    {
                        dbTransaction.Rollback();
                        LogUser.InsertPrint(db, updatedObj.Comp_Code.ToString(), updatedObj.Branch_Code, updatedObj.sec_FinYear, updatedObj.UserCode, null, LogUser.UserLog.Update, updatedObj.MODULE_CODE, false, ex.Message.ToString(), null, null);

                        return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                    }
                }
            }
            return BadRequest(ModelState);
        }
        [HttpPost, AllowAnonymous]
        public IHttpActionResult OpenReturn([FromBody]PurInvoiceMasterDetails updatedObj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(updatedObj.Token, updatedObj.UserCode))
            {
                using (var dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        // update master
                        PurTrReceiveService.Update(updatedObj.I_Pur_TR_Receive);

                         
                        
                        ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(updatedObj.I_Pur_TR_Receive.CompCode), Convert.ToInt32(updatedObj.I_Pur_TR_Receive.BranchCode), updatedObj.I_Pur_TR_Receive.ReceiveID, "PurReturn", "Open", db);
                        if (res.ResponseState == true)
                        {
                            updatedObj.I_Pur_TR_Receive.TrNo = int.Parse(res.ResponseData.ToString());
                            dbTransaction.Commit();
                            var displayData = db.IQ_GetPurReceiveStaistic.Where(x => x.ReceiveID == updatedObj.I_Pur_TR_Receive.ReceiveID).FirstOrDefault();
                            return Ok(new BaseResponse(displayData));
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
        public IHttpActionResult GetAllUnApprovedPurReturnListByReceiveD(int ReceiveID, int CompCode  ,int BranchCode )
        {
            if (ModelState.IsValid)
            {
                var res = db.IQ_GetPurReceiveList.Where(x => x.CompCode == CompCode &&  x.BranchCode == BranchCode && x.RefTrID == ReceiveID && x.Status == 0).ToList();
                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllReturnPurReceiveStaistic(int CompCode,int BranchCode , string startDate, string endDate, int Status, int isCash, int? VendorId, int? SalesmanId, string UserCode, string Token, string MODULE_CODE, string FinYear)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                string s = "select * from IQ_GetPurReceiveStaistic where CompCode = " + CompCode + "and BranchCode ="+ BranchCode + " and TrDate >=' " + startDate + "' and TrDate <=' " + endDate + " ' and TrType = 1 ";

                string condition = "";

                if (SalesmanId != 0 && SalesmanId != null)
                    condition = condition + " and SalesmanId =" + SalesmanId;

                if (VendorId != 0 && VendorId != null)
                    condition = condition + " and VendorID =" + VendorId;

                if (Status == 0 || Status == 1)
                {
                    condition = condition + " and Status = " + Status;
                }
                else if (Status == 2)
                {
                    condition = condition + "";
                }

                if (isCash == 0)//علي الحساب
                {
                    condition = condition + " and IsCash = 'false' ";
                }
                else if (isCash == 1)//نقدي
                {
                    condition = condition + " and IsCash = 'true' ";
                }
                else if (isCash == 2)
                {
                    condition = condition + "";
                }

                string query = s + condition;
                var res = db.Database.SqlQuery<IQ_GetPurReceiveStaistic>(query).ToList();
                LogUser.InsertPrint(db, CompCode.ToString(), BranchCode.ToString(), FinYear, UserCode, 0, LogUser.UserLog.Query, MODULE_CODE, true, null, null, null);

                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }
        [HttpPost, AllowAnonymous]
        public IHttpActionResult UpdateReceiveCashList(List<I_Pur_TR_Receive> receivesList)
        {
            try
            {
                for (int i = 0; i < receivesList.Count; i++)
                {
                    PurTrReceiveService.Update(receivesList[i]);
                }
                return Ok(new BaseResponse());
            }
            catch (Exception ex)
            {
                return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
            }
        }



        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetLastPrice(int CompCode, int BranchCode, int itemid, int vendorid, int storeid, int? invid)
        {
            //if (invid == 0) invid = null;

            try
            {


                string query = @" DECLARE	@return_value int,
                        	   @VndLastPrice numeric(18, 2),
                        	   @VndLastTr int,
                        	   @VndLastDate nvarchar(20),
                        	   @LastPurchase numeric(18, 2),
                        	   @Curcost numeric(18, 2)
                        
                        EXEC	@return_value = [dbo].[IProc_GetLastPurchasePrice]";
                query = query + CompCode.ToString() + "," + BranchCode.ToString() + "," + itemid.ToString() + "," + vendorid.ToString() + "," + storeid.ToString() + "," + (invid == 0 ? "null" : invid.ToString());

                query = query + @"         ,@VndLastPrice = @VndLastPrice OUTPUT,
                                      		@VndLastTr = @VndLastTr OUTPUT,
                                      		@VndLastDate = @VndLastDate OUTPUT,
                                      		@LastPurchase = @LastPurchase OUTPUT,
                                      		@Curcost = @Curcost OUTPUT;
                                      		 
                                    SELECT	@VndLastPrice as N'VndLastPrice',
                                    		@VndLastTr as N'VndLastTr',
                                    		@VndLastDate as N'VndLastDate',
                                    		@LastPurchase as N'LastPurchase',
                                    		@Curcost as N'Curcost' ";


                var res = db.Database.SqlQuery<ModelLastPurchase>(query).FirstOrDefault();
                return Ok(new BaseResponse(res));

            }
            catch (Exception ex)
            {
                return Ok(new BaseResponse(ex));
            }


        }


        #endregion

        #region Purchase Order 
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllPurOrder(int CompCode, int BranchCode, string startDate, string endDate,  int Status, int? VendorId, int? SalesmanId,int CashType, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                string s = "select * from IQ_GetPurchaseOrder where  CompCode = " + CompCode + " and BranchCode = " + BranchCode + " and TrDate >=' " + startDate + "' and TrDate <=' " + endDate + " '  " ;

                string condition = "";

                if (SalesmanId != 0 && SalesmanId != null)
                    condition = condition + " and SalesmanId =" + SalesmanId;

                if (VendorId != 0 && VendorId != null)
                    condition = condition + " and VendorID =" + VendorId;

                if (Status == 0 || Status == 1)
                {
                    condition = condition + " and Status = " + Status;
                }
                else if (Status == 2)
                {
                    condition = condition + "";
                }
                
                if (CashType == 0 || CashType == 1)
                {
                    condition = condition + " and IsCash = " + CashType;
                }
                else if (CashType == 2)
                {
                    condition = condition + "";
                }


                string query = s + condition;
                var res = db.Database.SqlQuery<IQ_GetPurchaseOrder>(query).ToList();
                var res2 = db.IQ_GetPurchaseOrderDetail.ToList();
                IQ_PurchaseOrderWithDetail model = new IQ_PurchaseOrderWithDetail();
                model.IQ_GetPurchaseOrder = res;
                model.IQ_GetPurchaseOrderDetail = res2;
                return Ok(new BaseResponse(model));
            }
            return BadRequest(ModelState);
        }

        public IHttpActionResult InsertPurOrderMasterDetail([FromBody]PurchaseOrderMasterDetails obj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(obj.Token, obj.UserCode))
            {
                using (var dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        var TransferHeader = IPurOrderService.Insert(obj.I_Pur_Tr_PurchaseOrder);
                        foreach (var item in obj.I_Pur_Tr_PurchaseOrderDetail)
                        {
                            item.PurOrderID = TransferHeader.PurOrderID;
                            IPurOrderService.Insert(item);
                        }

                        //// call process trans 
                        
                        ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(obj.I_Pur_Tr_PurchaseOrder.CompCode), Convert.ToInt32(obj.I_Pur_Tr_PurchaseOrder.BranchCode), TransferHeader.PurOrderID, "PurOrder", "Add", db);
                        if (res.ResponseState == true)
                        {
                            obj.I_Pur_Tr_PurchaseOrder.TrNo = int.Parse(res.ResponseData.ToString());
                            dbTransaction.Commit();
                            return Ok(new BaseResponse(obj.I_Pur_Tr_PurchaseOrder));
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
        public IHttpActionResult UpdatePurOrderDetail([FromBody]PurchaseOrderMasterDetails obj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(obj.Token, obj.UserCode))
            {
                using (var dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        var jouranalHeader = IPurOrderService.Update(obj.I_Pur_Tr_PurchaseOrder);

                        //update Details
                        var insertedObjects = obj.I_Pur_Tr_PurchaseOrderDetail.Where(x => x.StatusFlag == 'i').ToList();
                        var updatedObjects = obj.I_Pur_Tr_PurchaseOrderDetail.Where(x => x.StatusFlag == 'u').ToList();
                        var deletedObjects = obj.I_Pur_Tr_PurchaseOrderDetail.Where(x => x.StatusFlag == 'd').ToList();

                        foreach (var item in insertedObjects)
                        {
                            item.PurOrderID = obj.I_Pur_Tr_PurchaseOrder.PurOrderID;
                            IPurOrderService.Insert(item);
                        }
                        foreach (var item in updatedObjects)
                        {
                            item.PurOrderID = obj.I_Pur_Tr_PurchaseOrder.PurOrderID;
                            IPurOrderService.Update(item);
                        }
                        foreach (var item in deletedObjects)
                        {
                            IPurOrderService.Delete(item.PurOrderDetailsID);
                        }

                        //// call process trans 

                        
                        ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(obj.I_Pur_Tr_PurchaseOrder.CompCode), Convert.ToInt32(obj.I_Pur_Tr_PurchaseOrder.BranchCode), jouranalHeader.PurOrderID, "PurOrder", "Update", db);
                        if (res.ResponseState == true)
                        {
                            dbTransaction.Commit();
                            return Ok(new BaseResponse(obj.I_Pur_Tr_PurchaseOrder));
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
        public IHttpActionResult OpenPurOrder([FromBody]PurchaseOrderMasterDetails obj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(obj.Token, obj.UserCode))
            {
                using (var dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        var jouranalHeader = IPurOrderService.Update(obj.I_Pur_Tr_PurchaseOrder);

                        //update Details
                        var insertedObjects = obj.I_Pur_Tr_PurchaseOrderDetail.Where(x => x.StatusFlag == 'i').ToList();
                        var updatedObjects = obj.I_Pur_Tr_PurchaseOrderDetail.Where(x => x.StatusFlag == 'u').ToList();
                        var deletedObjects = obj.I_Pur_Tr_PurchaseOrderDetail.Where(x => x.StatusFlag == 'd').ToList();

                        foreach (var item in insertedObjects)
                        {
                            item.PurOrderID = obj.I_Pur_Tr_PurchaseOrder.PurOrderID;
                            IPurOrderService.Insert(item);
                        }
                        foreach (var item in updatedObjects)
                        {
                             item.PurOrderID = obj.I_Pur_Tr_PurchaseOrder.PurOrderID;
                            IPurOrderService.Update(item);
                        }
                        foreach (var item in deletedObjects)
                        {
                            IPurOrderService.Delete(item.PurOrderDetailsID);
                        }

                        //// call process trans 

                        
                        ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(obj.I_Pur_Tr_PurchaseOrder.CompCode), Convert.ToInt32(obj.I_Pur_Tr_PurchaseOrder.BranchCode), jouranalHeader.PurOrderID, "PurOrder", "Open", db);
                        if (res.ResponseState == true)
                        {
                            dbTransaction.Commit();
                            return Ok(new BaseResponse(obj.I_Pur_Tr_PurchaseOrder));
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
        public IHttpActionResult GetPurOrderMasterDetailByID(int PurOrderID, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var res = db.IQ_GetPurchaseOrder.Where(s => s.PurOrderID == PurOrderID).ToList();
                var res2 = db.IQ_GetPurchaseOrderDetail.Where(s => s.PurOrderID == PurOrderID).ToList();
                IQ_PurchaseOrderWithDetail model = new IQ_PurchaseOrderWithDetail();
                model.IQ_GetPurchaseOrder = res;
                model.IQ_GetPurchaseOrderDetail = res2;
                return Ok(new BaseResponse(model));
            }
            return BadRequest(ModelState);
        }

            #endregion
        }
}
