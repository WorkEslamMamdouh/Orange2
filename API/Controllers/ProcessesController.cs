using Inv.API.Models;
using Inv.API.Models.CustomModel;
using Inv.API.Tools;
using Inv.BLL.Services.AccDefVendor;
using Inv.BLL.Services.OperationCharges;
using Inv.BLL.Services.OperationDeposit;
using Inv.BLL.Services.OperationItems;
using Inv.BLL.Services.operationItemsSum;
using Inv.BLL.Services.OperationSalesmanItem;
using Inv.BLL.Services.Processes;
using Inv.BLL.Services.PurDefCharges;
using Inv.BLL.Services.SalesTrans;
using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web.Http;

namespace Inv.API.Controllers
{
    public class ProcessesController : BaseController
    {
        private readonly IOperationItems OperationItems;
        private readonly IOperationCharges OperationCharges;
        private readonly IOperationDeposit OperationDeposit;
        private readonly IProcesses Processes;
        private readonly IPurDefChargesService PurDefChargesService;
        private readonly G_USERSController UserControl;
        private readonly ISalesTranservice ISalesTranservice;
        private readonly IOperationSalesmanItemsService OperationSalesmanItem;
        private readonly IAccDefVendorService AccDefVendorService;
        private readonly IOperationItemsSum OperationItemsSum;



        public ProcessesController(G_USERSController _Control, IPurDefChargesService _IPurDefChargesService, IProcesses _IProcesses, IOperationItems _IOperationItems, IOperationCharges _IOperationCharges, IOperationDeposit _IOperationDeposit, ISalesTranservice _ISalesTranservice, IOperationSalesmanItemsService _IOperationSalesmanItem, IAccDefVendorService _IAccDefVendor, IOperationItemsSum _IOperationItemsSum)
        {

            UserControl = _Control;
            PurDefChargesService = _IPurDefChargesService;
            Processes = _IProcesses;
            OperationItems = _IOperationItems;
            OperationCharges = _IOperationCharges;
            OperationDeposit = _IOperationDeposit;
            ISalesTranservice = _ISalesTranservice;
            OperationSalesmanItem = _IOperationSalesmanItem;
            AccDefVendorService = _IAccDefVendor;
            OperationItemsSum = _IOperationItemsSum;
        }

        #region OPeration
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAll(int CompCode, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                //var ItemStoreInfoList = PurTrReceiveService.GetAll(x => x.CompCode == CompCode).ToList();

                //return Ok(new BaseResponse(ItemStoreInfoList));
            }
            return BadRequest(ModelState);
        }

        [HttpPost, AllowAnonymous]//done 
        public IHttpActionResult OpenReturn([FromBody]PurInvoiceMasterDetails updatedObj)
        {
            //if (ModelState.IsValid && UserControl.CheckUser(updatedObj.Token, updatedObj.UserCode))
            //{
            //    using (var dbTransaction = db.Database.BeginTransaction())
            //    {
            //        try
            //        {
            //            // update master
            //            PurTrReceiveService.Update(updatedObj.I_Pur_TR_Receive);


            //            //update I_Pur_TR_ReceiveItems 
            //            var insertedRecordsReceiveItems = updatedObj.I_Pur_TR_ReceiveItems.Where(x => x.StatusFlag == 'i').ToList();
            //            var updatedRecordsReceiveItems = updatedObj.I_Pur_TR_ReceiveItems.Where(x => x.StatusFlag == 'u').ToList();
            //            var deletedRecordsReceiveItems = updatedObj.I_Pur_TR_ReceiveItems.Where(x => x.StatusFlag == 'd').ToList();


            //            //loop insered  I_Pur_TR_ReceiveItems
            //            foreach (var item in insertedRecordsReceiveItems)
            //            {
            //                item.ReceiveID = updatedObj.I_Pur_TR_Receive.ReceiveID;
            //                var InsertedRec = PurTRReceiveItemsService.Insert(item);
            //            }

            //            //loop Update  I_Pur_TR_ReceiveItems
            //            foreach (var item in updatedRecordsReceiveItems)
            //            {
            //                item.ReceiveID = updatedObj.I_Pur_TR_Receive.ReceiveID;
            //                var updatedRec = PurTRReceiveItemsService.Update(item);
            //            }

            //            //loop Delete  I_Pur_TR_ReceiveItems
            //            foreach (var item in deletedRecordsReceiveItems)
            //            {
            //                int deletedId = item.ReciveDetailsID;
            //                PurTRReceiveItemsService.Delete(deletedId);
            //            }

            //            var br = 1;
            //            ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(updatedObj.I_Pur_TR_Receive.CompCode), br, updatedObj.I_Pur_TR_Receive.ReceiveID, "PurReturn", "Open", db);
            //            if (res.ResponseState == true)
            //            {
            //                updatedObj.I_Pur_TR_Receive.TrNo = int.Parse(res.ResponseData.ToString());
            //                dbTransaction.Commit();
            //                return Ok(new BaseResponse(updatedObj.I_Pur_TR_Receive));
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

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllPurDefCharges(int compCode, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                List<I_Pur_D_Charges> res = PurDefChargesService.GetAll(s => s.CompCode == compCode);
                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAll_IQ_GetOperation(int CompCode, int BranchCode, string startDate, string endDate, int trtype, int Status, int? VendorId, int? SalesmanId, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                string s = "select * from IQ_GetOperation where  CompCode = " + CompCode + " and BranchCode = " + BranchCode + "and TrDate >=' " + startDate + "' and TrDate <=' " + endDate + " ' ";

                string condition = "";

                if (SalesmanId != 0 && SalesmanId != null)
                {
                    condition = condition + " and SalesmanId =" + SalesmanId;
                }

                if (trtype != -1)
                {
                    condition = condition + " and trtype =" + trtype;
                }

                if (VendorId != 0 && VendorId != null)
                {
                    condition = condition + " and VendorID =" + VendorId;
                }

                if (Status != 111)
                {
                    condition = condition + " and Status =" + Status;
                }

                string query = s + condition;
                List<IQ_GetOperation> res = db.Database.SqlQuery<IQ_GetOperation>(query).ToList();
                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAll_IQ_GetOperationItemsSum(int CompCode, int BranchCode, string startDate, string endDate, int trtype, int Status, int? VendorId, int? SalesmanId, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                string s = "select * from IQ_GetOperation where Trtype =0 and CompCode = " + CompCode + " and BranchCode = " + BranchCode + "and TrDate >=' " + startDate + "' and TrDate <=' " + endDate + " ' ";

                string condition = "";

                if (SalesmanId != 0 && SalesmanId != null)
                {
                    condition = condition + " and SalesmanId =" + SalesmanId;
                }

                if (VendorId != 0 && VendorId != null)
                {
                    condition = condition + " and VendorID =" + VendorId;
                }

                if (Status != 111)
                {
                    condition = condition + " and Status =" + Status;
                }
                else
                {
                    condition = condition + " and Status >= 3";
                }

                string query = s + condition;
                List<IQ_GetOperation> res = db.Database.SqlQuery<IQ_GetOperation>(query).ToList();
                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllOperationItemsSum(int OperationItemId, int OperationId, int CompCode, int BranchCode, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                try
                {
                    string query = "select * from I_TR_OperationItemsSum where  OperationItemID = " + OperationItemId + " and OperationID =" + OperationId + "  ";

                    List<I_TR_OperationItemsSum> res = db.Database.SqlQuery<I_TR_OperationItemsSum>(query).ToList();
                    return Ok(new BaseResponse(res));
                }
                catch (Exception ex)

                {

                    return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                }


            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult OpenOperation(int OperationID, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                string query = "update I_TR_Operation set [Status] =2   where OperationID =" + OperationID + " ";

                db.Database.ExecuteSqlCommand(query);


                var Oper = db.I_TR_Operation.Where(x => x.OperationID == OperationID).FirstOrDefault();
                LogUser.InsertPrint(db, Oper.CompCode.ToString(), Oper.BranchCode.ToString(), Oper.FIN_YEAR.ToString(), UserCode, OperationID, Oper.TrNo.ToString(), LogUser.UserLog.Open, "Processes", true, null, null, null);

                return Ok(new BaseResponse(100));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult OpenOperationItemsSum(int OperationID, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                string query = "update I_TR_Operation set [Status] =4   where OperationID =" + OperationID + " ";

                db.Database.ExecuteSqlCommand(query);


                var Oper = db.I_TR_Operation.Where(x => x.OperationID == OperationID).FirstOrDefault();
                LogUser.InsertPrint(db, Oper.CompCode.ToString(), Oper.BranchCode.ToString(), Oper.FIN_YEAR.ToString(), UserCode, OperationID, Oper.TrNo.ToString(), LogUser.UserLog.Open, "Processes", true, null, null, null);


                return Ok(new BaseResponse(100));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult AllGetOperationMasterDisplay(int OperationID, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                List<IQ_GetOperationItemInfo> res_1 = db.IQ_GetOperationItemInfo.Where(x => x.OperationID == OperationID).ToList();
                List<IQ_GetOperationCharges> res_2 = db.IQ_GetOperationCharges.Where(x => x.OperationID == OperationID).ToList();
                List<IQ_GetOperationDepsit> res_3 = db.IQ_GetOperationDepsit.Where(x => x.OperationID == OperationID).ToList();
                List<IQ_GetOperationSalesman> res_4 = db.IQ_GetOperationSalesman.Where(x => x.OperationID == OperationID).ToList();
                List<IQ_GetOperationSalesmanItem> res_5 = db.IQ_GetOperationSalesmanItem.Where(x => x.OperationID == OperationID).ToList();


                OperationMasterDisplay Model = new OperationMasterDisplay
                {
                    IQ_GetOperationItemInfo = res_1,
                    IQ_GetOperationCharges = res_2,
                    I_TR_OperationDeposit = res_3,
                    TR_OperationSalesman = res_4,
                    TR_OperationSalesmanItem = res_5
                };

                return Ok(new BaseResponse(Model));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetOperationSalesmanItem(int OperationSalesmanID, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                List<IQ_GetOperationSalesmanItem> res = db.IQ_GetOperationSalesmanItem.Where(x => x.OperationSalesmanID == OperationSalesmanID).ToList();

                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult Insert_Processes([FromBody]I_TR_Operation Operation)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Operation.Token, Operation.UserCode))
            {
                using (System.Data.Entity.DbContextTransaction dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {

                        A_Pay_D_Vendor VendorObj = db.A_Pay_D_Vendor.Where(s => s.VendorID == Operation.VendorID).FirstOrDefault();

                        if (VendorObj.OperationSer == null || VendorObj.OperationSer == "")
                        {
                            VendorObj.OperationSer = "010";
                        }
                        int lastNum = int.Parse(VendorObj.OperationSer.Last().ToString()) + 1;

                        string newItemFormatSerial = VendorObj.OperationSer;
                        string x = newItemFormatSerial.Remove(newItemFormatSerial.Length - 1, 1);

                        VendorObj.OperationSer = x + lastNum;
                        AccDefVendorService.Update(VendorObj);

                        Operation.RefNO = VendorObj.OperationFixed + VendorObj.OperationSer;


                        I_TR_Operation TR_Operation = Processes.Insert(Operation);

                        // call process trans 
                        int br = 1;
                        ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(Operation.CompCode), br, Operation.OperationID, "Process", "Add", db);
                        if (res.ResponseState == true)
                        {
                            Operation.TrNo = int.Parse(res.ResponseData.ToString());
                            dbTransaction.Commit();
                            LogUser.InsertPrint(db, Operation.Comp_Code.ToString(), Operation.Branch_Code, Operation.sec_FinYear, Operation.UserCode, Operation.OperationID, Operation.TrNo.ToString(), LogUser.UserLog.Insert, Operation.MODULE_CODE, true, null, null, null);

                            return Ok(new BaseResponse(Operation.OperationID));
                        }
                        else
                        {
                            dbTransaction.Rollback();
                            LogUser.InsertPrint(db, Operation.Comp_Code.ToString(), Operation.Branch_Code, Operation.sec_FinYear, Operation.UserCode, Operation.OperationID, Operation.TrNo.ToString(), LogUser.UserLog.Insert, Operation.MODULE_CODE, false, res.ResponseMessage.ToString(), null, null);

                            return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, res.ResponseMessage));
                        }
                    }
                    catch (Exception ex)
                    {
                        dbTransaction.Rollback();
                        LogUser.InsertPrint(db, Operation.Comp_Code.ToString(), Operation.Branch_Code, Operation.sec_FinYear, Operation.UserCode, Operation.OperationID, Operation.TrNo.ToString(), LogUser.UserLog.Insert, Operation.MODULE_CODE, false, ex.Message.ToString(), null, null);

                        return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                    }
                }
            }
            return BadRequest(ModelState);
        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult Update_Processes([FromBody]I_TR_Operation Operation)
        {
            //if (ModelState.IsValid && UserControl.CheckUser(Operation.Token, Operation.UserCode))
            //{

            using (System.Data.Entity.DbContextTransaction dbTransaction = db.Database.BeginTransaction())
            {
                try
                {
                    if (Operation.OperationID != 0 && Operation.OperationID != null)
                    {

                        IQ_GetOperation chackVendorChang = db.IQ_GetOperation.Where(s => s.OperationID == Operation.OperationID).FirstOrDefault();
                        if (chackVendorChang.VendorID != Operation.VendorID)
                        {

                            A_Pay_D_Vendor VendorObj = db.A_Pay_D_Vendor.Where(s => s.VendorID == Operation.VendorID).FirstOrDefault();

                            if (VendorObj.OperationSer == null || VendorObj.OperationSer == "")
                            {
                                VendorObj.OperationSer = "010";
                            }
                            int lastNum = int.Parse(VendorObj.OperationSer.Last().ToString()) + 1;

                            string newItemFormatSerial = VendorObj.OperationSer;
                            string x = newItemFormatSerial.Remove(newItemFormatSerial.Length - 1, 1);

                            VendorObj.OperationSer = x + lastNum;
                            AccDefVendorService.Update(VendorObj);

                            Operation.RefNO = VendorObj.OperationFixed + VendorObj.OperationSer;

                        }

                    }

                    //var VendorObj = db.A_Pay_D_Vendor.Where(s => s.VendorID == Operation.VendorID).FirstOrDefault();

                    //Operation.RefNO = VendorObj.OperationFixed + VendorObj.OperationSer;

                    //currentContext.Attach(Operation);
                    db.I_TR_Operation.Attach(Operation);

                    I_TR_Operation TR_Operation = Processes.Update(Operation);
                    // call process trans 
                    int br = 1;
                    ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(Operation.CompCode), br, Operation.OperationID, "Process", "Update", db);
                    if (res.ResponseState == true)
                    {
                        Operation.TrNo = int.Parse(res.ResponseData.ToString());
                        dbTransaction.Commit();
                        LogUser.InsertPrint(db, Operation.Comp_Code.ToString(), Operation.Branch_Code, Operation.sec_FinYear, Operation.UserCode, Operation.OperationID, Operation.TrNo.ToString(), LogUser.UserLog.Update, Operation.MODULE_CODE, true, null, null, null);

                        return Ok(new BaseResponse(Operation));
                    }
                    else
                    {
                        dbTransaction.Rollback();
                        LogUser.InsertPrint(db, Operation.Comp_Code.ToString(), Operation.Branch_Code, Operation.sec_FinYear, Operation.UserCode, Operation.OperationID, Operation.TrNo.ToString(), LogUser.UserLog.Update, Operation.MODULE_CODE, false, res.ResponseMessage.ToString(), null, null);

                        return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, res.ResponseMessage));
                    }
                }


                catch (Exception ex)
                {
                    dbTransaction.Rollback();
                    LogUser.InsertPrint(db, Operation.Comp_Code.ToString(), Operation.Branch_Code, Operation.sec_FinYear, Operation.UserCode, Operation.OperationID, Operation.TrNo.ToString(), LogUser.UserLog.Update, Operation.MODULE_CODE, false, ex.Message.ToString(), null, null);

                    return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                }
            }
            //}
            //return BadRequest(ModelState);
        }


        [HttpPost, AllowAnonymous]//done status =2 مفتوحه
        public IHttpActionResult ListOperationItemsDetailProcesses_Open(List<I_TR_OperationItems> updatedObj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(updatedObj[0].Token, updatedObj[0].UserCode))
            {
                using (System.Data.Entity.DbContextTransaction dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        // update master
                        //OperationItems.Update(I_TR_OperationItems);


                        //update I_Pur_TR_ReceiveItems 
                        List<I_TR_OperationItems> insertedOperationItems = updatedObj.Where(x => x.StatusFlag == 'i').ToList();
                        List<I_TR_OperationItems> updatedOperationItems = updatedObj.Where(x => x.StatusFlag == 'u').ToList();
                        List<I_TR_OperationItems> deletedOperationItems = updatedObj.Where(x => x.StatusFlag == 'd').ToList();

                        //loop insered  I_Pur_TR_ReceiveItems
                        foreach (I_TR_OperationItems item in insertedOperationItems)
                        {
                            // item.OperationItemID = updatedObj[0].OperationItemID;

                            int OperationItemID = 0;
                            int OperationSalesmanID = 0;

                            I_TR_OperationItems InsertedRec = OperationItems.Insert(item);

                            OperationItemID = InsertedRec.OperationItemID;

                            string query1 = "select OperationSalesmanID from [dbo].[I_TR_OperationSalesman]  where SalesmanId = (Select SalesmanId from [dbo].[I_TR_Operation] where OperationID = " + item.OperationID + ") and OperationID = " + item.OperationID + "";
                            OperationSalesmanID = db.Database.SqlQuery<int>(query1).FirstOrDefault();

                            string Execut_insert = "insert into [dbo].[I_TR_OperationSalesmanItem] values(" + OperationSalesmanID + " , " + OperationItemID + " ," + item.OperationID + " ," + item.ItemID + " ," + item.ReceivedQty + " ,0,0)";
                            db.Database.ExecuteSqlCommand(Execut_insert);
                        }

                        //loop Update  I_Pur_TR_ReceiveItems
                        foreach (I_TR_OperationItems item in updatedOperationItems)
                        {
                            decimal diff = 0;
                            decimal Qty_M = 0;
                            decimal Old_Qty = 0;
                            decimal New_Qty = 0;
                            int OperationItemID = 0;
                            int OperationSalesmanID = 0;
                            New_Qty = Convert.ToInt16(item.ReceivedQty);
                            OperationItemID = Convert.ToInt16(item.OperationItemID);

                            string query = "select ReceivedQty from [dbo].[I_TR_OperationItems] where OperationItemID = " + OperationItemID + "";
                            Old_Qty = db.Database.SqlQuery<decimal>(query).FirstOrDefault();
                            Qty_M = Old_Qty;
                            diff = New_Qty - Old_Qty;

                            if ((Qty_M + diff) >= (Convert.ToDecimal(item.SoldQty)))
                            {
                                item.ReceivedQty = (Qty_M + diff);


                                I_TR_OperationItems updatedRec = OperationItems.Update(item);

                                string query1 = "select OperationSalesmanID from [dbo].[I_TR_OperationSalesman]  where SalesmanId = (Select SalesmanId from [dbo].[I_TR_Operation] where OperationID = " + item.OperationID + ") and OperationID = " + item.OperationID + "";
                                OperationSalesmanID = db.Database.SqlQuery<int>(query1).FirstOrDefault();

                                string Execut_Update = "update [dbo].[I_TR_OperationSalesmanItem] set ReceivedQty = (ReceivedQty + " + diff + ") where OperationSalesmanID =" + OperationSalesmanID + " and OperationItemID = " + OperationItemID + " and OperationID = " + item.OperationID + "";
                                db.Database.ExecuteSqlCommand(Execut_Update);

                            }
                        }

                        //loop Delete  I_Pur_TR_ReceiveItems
                        foreach (I_TR_OperationItems item in deletedOperationItems)
                        {
                            string query= @"DECLARE	 @res int SELECT   @res = 0
                                                            EXEC	 [dbo].[IProc_OperationItemDelete]
		                                                            @Operationitemid = " + item.OperationItemID + @",
		                                                            @itemid = " + item.ItemID + @",
		                                                            @Operationid = " + item.OperationID + @",
		                                                            @res = @res OUTPUT
                                                            SELECT	@res as N'@res'";
                            int res_ = db.Database.SqlQuery<int>(query).FirstOrDefault();
                        }
                        int val = updatedObj[0].OperationID;
                        I_TR_Operation operObj = db.I_TR_Operation.Where(s => s.OperationID == val).FirstOrDefault();
                        int br = 1;
                        ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(operObj.CompCode), br, updatedObj[0].OperationID, "Process", "Update", db);
                        if (res.ResponseState == true)
                        {
                            dbTransaction.Commit();
                            return Ok(new BaseResponse("ok"));
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

        [HttpPost, AllowAnonymous]//done I_TR_OperationItemsSum
        public IHttpActionResult ListOperationItemsDetailItemsSum(List<I_TR_OperationItemsSum> updatedObj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(updatedObj[0].Token, updatedObj[0].UserCode))
            {
                using (System.Data.Entity.DbContextTransaction dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {

                        List<I_TR_OperationItemsSum> insertedOperationItems = updatedObj.Where(x => x.StatusFlag == 'i').ToList();
                        List<I_TR_OperationItemsSum> updatedOperationItems = updatedObj.Where(x => x.StatusFlag == 'u').ToList();
                        List<I_TR_OperationItemsSum> deletedOperationItems = updatedObj.Where(x => x.StatusFlag == 'd').ToList();

                        int? OperationID = 0;

                        //loop insered  I_TR_OperationItemsSum
                        foreach (I_TR_OperationItemsSum item in insertedOperationItems)
                        {

                            I_TR_OperationItemsSum InsertedRec = OperationItemsSum.Insert(item);
                            OperationID = item.OperationID;
                        }

                        //loop Update  I_TR_OperationItemsSum
                        foreach (I_TR_OperationItemsSum item in updatedOperationItems)
                        {

                            I_TR_OperationItemsSum updatedRec = OperationItemsSum.Update(item);

                            OperationID = item.OperationID;
                        }

                        //loop Delete  I_TR_OperationItemsSum
                        foreach (I_TR_OperationItemsSum item in deletedOperationItems)
                        {
                            int deletedId = item.OperationItemSumID;
                            OperationItemsSum.Delete(deletedId);
                            OperationID = item.OperationID;
                        }

                        if (OperationID > 0)
                        {
                            db.Database.ExecuteSqlCommand("IProc_UpdateOperationClose " + OperationID + "");
                        }

                        //int val = updatedObj[0].OperationID;
                        //I_TR_Operation operObj = db.I_TR_Operation.Where(s => s.OperationID == val).FirstOrDefault();
                        //int br = 1;
                        //ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(operObj.CompCode), br, updatedObj[0].OperationID, "Process", "Update", db);
                        //if (res.ResponseState == true)
                        //{
                        dbTransaction.Commit();
                        return Ok(new BaseResponse("ok"));
                        //}
                        //else
                        //{
                        //    dbTransaction.Rollback();
                        //    return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, res.ResponseMessage));
                        //}

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

        [HttpGet, AllowAnonymous]//done I_TR_OperationItemsSum
        public IHttpActionResult ReCalculation(int OperationID)
        {

            if (OperationID > 0)
            {
                db.Database.ExecuteSqlCommand("IProc_UpdateOperationClose " + OperationID + "");
            }

            return Ok(new BaseResponse("ok"));

        }



        [HttpPost, AllowAnonymous]//done 
        public IHttpActionResult ListOperationItemsDetail(List<I_TR_OperationItems> updatedObj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(updatedObj[0].Token, updatedObj[0].UserCode))
            {
                using (System.Data.Entity.DbContextTransaction dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        // update master
                        //OperationItems.Update(I_TR_OperationItems);


                        //update I_Pur_TR_ReceiveItems 
                        List<I_TR_OperationItems> insertedOperationItems = updatedObj.Where(x => x.StatusFlag == 'i').ToList();
                        List<I_TR_OperationItems> updatedOperationItems = updatedObj.Where(x => x.StatusFlag == 'u').ToList();
                        List<I_TR_OperationItems> deletedOperationItems = updatedObj.Where(x => x.StatusFlag == 'd').ToList();

                        //loop insered  I_Pur_TR_ReceiveItems
                        foreach (I_TR_OperationItems item in insertedOperationItems)
                        {
                            // item.OperationItemID = updatedObj[0].OperationItemID;
                            I_TR_OperationItems InsertedRec = OperationItems.Insert(item);
                        }

                        //loop Update  I_Pur_TR_ReceiveItems
                        foreach (I_TR_OperationItems item in updatedOperationItems)
                        {

                            I_TR_OperationItems updatedRec = OperationItems.Update(item);
                        }

                        //loop Delete  I_Pur_TR_ReceiveItems
                        foreach (I_TR_OperationItems item in deletedOperationItems)
                        { 
                            int res_ = db.Database.SqlQuery<int>(@"DECLARE	 @res int SELECT   @res = 0
                                                            EXEC	 [dbo].[IProc_OperationItemDelete]
		                                                            @Operationitemid = "+ item.OperationItemID + @",
		                                                            @itemid = "+ item.ItemID + @",
		                                                            @Operationid = "+ item.OperationID + @",
		                                                            @res = @res OUTPUT
                                                            SELECT	@res as N'@res'").FirstOrDefault();
                        }
                        int val = updatedObj[0].OperationID;
                        I_TR_Operation operObj = db.I_TR_Operation.Where(s => s.OperationID == val).FirstOrDefault();
                        int br = 1;
                        ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(operObj.CompCode), br, updatedObj[0].OperationID, "Process", "Update", db);
                        if (res.ResponseState == true)
                        {
                            dbTransaction.Commit();
                            return Ok(new BaseResponse("ok"));
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

        [HttpPost, AllowAnonymous]//done 
        public IHttpActionResult ListOperationChargesDetail(List<I_TR_OperationCharges> updatedObj)
        {
            if (updatedObj.Count == 0)
            {
                return Ok(new BaseResponse("ok"));
            } 
            using (System.Data.Entity.DbContextTransaction dbTransaction = db.Database.BeginTransaction())
            {
                try
                {
                    // update master
                    //OperationItems.Update(I_TR_OperationItems);


                    //update I_Pur_TR_ReceiveItems 
                    List<I_TR_OperationCharges> insertedOperationItems = updatedObj.Where(x => x.StatusFlag == 'i').ToList();
                    List<I_TR_OperationCharges> updatedOperationItems = updatedObj.Where(x => x.StatusFlag == 'u').ToList();
                    List<I_TR_OperationCharges> deletedOperationItems = updatedObj.Where(x => x.StatusFlag == 'd').ToList();

                    //loop insered  I_Pur_TR_ReceiveItems
                    foreach (I_TR_OperationCharges item in insertedOperationItems)
                    {
                        //item.OperationExpensesID = updatedObj[0].OperationItemID;
                        I_TR_OperationCharges InsertedRec = OperationCharges.Insert(item);
                    }

                    //loop Update  I_Pur_TR_ReceiveItems
                    foreach (I_TR_OperationCharges item in updatedOperationItems)
                    {

                        I_TR_OperationCharges updatedRec = OperationCharges.Update(item);
                    }

                    //loop Delete  I_Pur_TR_ReceiveItems
                    foreach (I_TR_OperationCharges item in deletedOperationItems)
                    {
                        int deletedId = item.OperationExpensesID;
                        OperationCharges.Delete(deletedId);
                    }
                    int val = updatedObj[0].OperationID;
                    I_TR_Operation operObj = db.I_TR_Operation.Where(s => s.OperationID == val).FirstOrDefault();
                    int br = 1;
                    ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(operObj.CompCode), br, updatedObj[0].OperationID, "Process", "Update", db);
                    if (res.ResponseState == true)
                    {
                        dbTransaction.Commit();
                        return Ok(new BaseResponse("ok"));
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

        [HttpPost, AllowAnonymous]//done 
        public IHttpActionResult ListOperationDepositDetail([FromBody]ListOperationDepositDetail updatedObj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(updatedObj.Token, updatedObj.UserCode))
            {
                using (System.Data.Entity.DbContextTransaction dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        // update master

                        int val = 0;


                        foreach (I_TR_OperationSalesmanItem item in updatedObj.I_TR_OperationSalesmanItem)
                        {
                            //I_TR_OperationSalesmanItem updatedRec = OperationSalesmanItem.Update(item); 
                            string Q = "update [dbo].[I_TR_OperationSalesmanItem] set [OperationSalesmanID]= " + item.OperationSalesmanID + ", [OperationItemID] =" + item.OperationItemID + ", [OperationID] =" + item.OperationID + ", [ItemID] =" + item.ItemID + ", [ReceivedQty]=" + item.ReceivedQty + ", [SoldQty]=" + item.SoldQty + ", [ScrapQty]=" + item.ScrapQty + " where [OperationSalesmanItemID]= " + item.OperationSalesmanItemID + "";
                            string query = Q;
                            int de = db.Database.ExecuteSqlCommand(query);

                            val = Convert.ToInt32(item.OperationID);
                        }



                        //update I_Pur_TR_ReceiveItems 
                        List<I_TR_OperationDeposit> insertedOperationItems = updatedObj.I_TR_OperationDeposit.Where(x => x.StatusFlag == 'i').ToList();
                        List<I_TR_OperationDeposit> updatedOperationItems = updatedObj.I_TR_OperationDeposit.Where(x => x.StatusFlag == 'u').ToList();
                        List<I_TR_OperationDeposit> deletedOperationItems = updatedObj.I_TR_OperationDeposit.Where(x => x.StatusFlag == 'd').ToList();

                        //loop insered  I_Pur_TR_ReceiveItems
                        foreach (I_TR_OperationDeposit item in insertedOperationItems)
                        {

                            //item.OperationExpensesID = updatedObj[0].OperationItemID;
                            val = Convert.ToInt32(item.OperationID);
                            I_TR_OperationDeposit InsertedRec = OperationDeposit.Insert(item);
                        }

                        //loop Update  I_Pur_TR_ReceiveItems
                        foreach (I_TR_OperationDeposit item in updatedOperationItems)
                        {

                            val = Convert.ToInt32(item.OperationID);
                            I_TR_OperationDeposit updatedRec = OperationDeposit.Update(item);
                        }

                        //loop Delete  I_Pur_TR_ReceiveItems
                        foreach (I_TR_OperationDeposit item in deletedOperationItems)
                        {
                            val = Convert.ToInt32(item.OperationID);
                            int deletedId = item.OperationDepositID;
                            OperationDeposit.Delete(deletedId);
                        }
                        // call process trans 

                        I_TR_Operation operObj = db.I_TR_Operation.Where(s => s.OperationID == val).FirstOrDefault();
                        int br = 1;
                        ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(operObj.CompCode), br, val, "Process", "Update", db);
                        if (res.ResponseState == true)
                        {
                            dbTransaction.Commit();
                            return Ok(new BaseResponse("ok"));
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

        #region Salesman Transfer

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllSalesmanTransferHeaderWithDetail(int TrType, string FromDate, string toDate, int status, int sourcrSales, int ToSales, int operation, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                string s = "select * from IQ_GetOperationTF where  TrDate >=' " + FromDate + "' and TrDate <= ' " + toDate + " '  and TrType= " + TrType;

                string condition = "";
                if (sourcrSales != 0)
                {
                    condition = condition + " and FromSalesmanID = " + sourcrSales;
                }

                if (ToSales != 0)
                {
                    condition = condition + " and ToSalesmanID = " + ToSales;
                }

                if (operation != 0)
                {
                    condition = condition + " and OperationID = " + operation;
                }

                if (status == 2)
                {
                    condition = condition + "";
                }
                else if (status == 0)
                {
                    condition = condition + " and IsSent = 'False'  ";
                }
                else if (status == 1)
                {
                    condition = condition + " and IsSent = 'True' ";
                }

                string query = s + condition;
                List<IQ_GetOperationTF> res = db.Database.SqlQuery<IQ_GetOperationTF>(query).ToList();
                List<IQ_GetOperationTFDetail> res2 = db.IQ_GetOperationTFDetail.ToList();
                IQ_GetOPerationTransferWithDetail model = new IQ_GetOPerationTransferWithDetail
                {
                    IQ_GetOperationTF = res,
                    IQ_GetOperationTFDetail = res2
                };
                return Ok(new BaseResponse(model));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetOperationSalesman(int OperationID, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                List<IQ_GetOperationSalesman> res = db.IQ_GetOperationSalesman.Where(x => x.OperationID == OperationID).ToList();

                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllOperationItems(int operationid, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                List<IQ_GetOperationSalesmanItem> res = db.IQ_GetOperationSalesmanItem.Where(x => x.OperationID == operationid).ToList();

                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetOperSalesmanItemByID(int Id, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                IQ_GetOperationSalesmanItem res = db.IQ_GetOperationSalesmanItem.Where(x => x.OperationSalesmanItemID == Id).FirstOrDefault();

                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllOperSalesmanItems(int operationID, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                List<IQ_GetOperationSalesmanItem> res = db.IQ_GetOperationSalesmanItem.Where(x => x.OperationID == operationID).ToList();

                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetOperItem(int operationID,int ItemID , string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                List<IQ_GetOperationSalesmanItem> res = db.IQ_GetOperationSalesmanItem.Where(x => x.OperationID == operationID && x.ItemID == ItemID).ToList();

                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetOperItem(int operationID, string ItemCode ,  string UserCode, string Token)
        {
            
               
            string SQL = "";
                SQL = "Select *  from IQ_GetOperationItemInfo where OperationID= " + operationID + "and ItemCode ='" + ItemCode + "' ";
           
            List<IQ_GetOperationItemInfo> ItemList = db.Database.SqlQuery<IQ_GetOperationItemInfo>(SQL).ToList();


            return Ok(new BaseResponse(ItemList));

        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetOperationByID(int OperationID, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                List<IQ_GetOperation> res_1 = db.IQ_GetOperation.Where(x => x.OperationID == OperationID).ToList();

                return Ok(new BaseResponse(res_1));
            }
            return BadRequest(ModelState);
        }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllItemsInStore(int branch, int comp, int operationID, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                List<I_TR_OperationTF> itemsList = ISalesTranservice.GetAll(s => s.CompCode == comp && s.BranchCode == branch && s.OperationID == operationID).ToList();
                return Ok(new BaseResponse(itemsList));
            }
            return BadRequest(ModelState);
        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult InsertProcesTransferMasterDetail([FromBody]OPerationSalesmanTransferWithDetail obj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(obj.Token, obj.UserCode))
            {
                using (System.Data.Entity.DbContextTransaction dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        I_TR_OperationTF Header = ISalesTranservice.Insert(obj.I_TR_OperationTF);
                        foreach (I_TR_OperationTFDetail item in obj.I_TR_OperationTFDetail)
                        {
                            item.OperationTFID = Header.OperationTFID;
                            ISalesTranservice.Insert(item);
                        }

                        //// call process trans 
                        ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(obj.I_TR_OperationTF.CompCode), Convert.ToInt32(obj.I_TR_OperationTF.BranchCode), Header.OperationTFID, "SlsTrnsfer", "Add", db);
                        if (res.ResponseState == true)
                        {
                            obj.I_TR_OperationTF.Tr_No = int.Parse(res.ResponseData.ToString());
                            dbTransaction.Commit();
                            LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.I_TR_OperationTF.OperationID, obj.I_TR_OperationTF.Tr_No.ToString(), LogUser.UserLog.Insert, obj.MODULE_CODE, true, null, null, null);

                            return Ok(new BaseResponse(obj.I_TR_OperationTF));
                        }
                        else
                        {
                            dbTransaction.Rollback();
                            LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.I_TR_OperationTF.OperationID, obj.I_TR_OperationTF.Tr_No.ToString(), LogUser.UserLog.Insert, obj.MODULE_CODE, false, res.ResponseMessage.ToString(), null, null);

                            return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, res.ResponseMessage));
                        }

                    }
                    catch (Exception ex)
                    {
                        dbTransaction.Rollback();
                        LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.I_TR_OperationTF.OperationID, obj.I_TR_OperationTF.Tr_No.ToString(), LogUser.UserLog.Insert, obj.MODULE_CODE, false, ex.Message.ToString(), null, null);

                        return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                    }
                }
            }
            return BadRequest(ModelState);
        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult UpdateProcesTransferDetail([FromBody]OPerationSalesmanTransferWithDetail obj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(obj.Token, obj.UserCode))
            {
                using (System.Data.Entity.DbContextTransaction dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        I_TR_OperationTF Header = ISalesTranservice.Update(obj.I_TR_OperationTF);

                        //update Details
                        List<I_TR_OperationTFDetail> insertedObjects = obj.I_TR_OperationTFDetail.Where(x => x.StatusFlag == 'i').ToList();
                        List<I_TR_OperationTFDetail> updatedObjects = obj.I_TR_OperationTFDetail.Where(x => x.StatusFlag == 'u').ToList();
                        List<I_TR_OperationTFDetail> deletedObjects = obj.I_TR_OperationTFDetail.Where(x => x.StatusFlag == 'd').ToList();

                        foreach (I_TR_OperationTFDetail item in insertedObjects)
                        {
                            item.OperationTFID = obj.I_TR_OperationTF.OperationTFID;
                            ISalesTranservice.Insert(item);
                        }
                        foreach (I_TR_OperationTFDetail item in updatedObjects)
                        {
                            item.OperationTFID = obj.I_TR_OperationTF.OperationTFID;
                            ISalesTranservice.Update(item);
                        }
                        foreach (I_TR_OperationTFDetail item in deletedObjects)
                        {
                            ISalesTranservice.Delete(item.OperationTFDetailID);
                        }

                        ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(obj.I_TR_OperationTF.CompCode), Convert.ToInt32(obj.I_TR_OperationTF.BranchCode), Header.OperationTFID, "SlsTrnsfer", "Update", db);
                        if (res.ResponseState == true)
                        {
                            dbTransaction.Commit();
                            LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.I_TR_OperationTF.OperationID, obj.I_TR_OperationTF.Tr_No.ToString(), LogUser.UserLog.Update, obj.MODULE_CODE, true, null, null, null);
                            return Ok(new BaseResponse(obj.I_TR_OperationTF));
                        }
                        else
                        {
                            dbTransaction.Rollback();
                            LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.I_TR_OperationTF.OperationID, obj.I_TR_OperationTF.Tr_No.ToString(), LogUser.UserLog.Update, obj.MODULE_CODE, false, res.ResponseMessage.ToString(), null, null);
                            return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, res.ResponseMessage));
                        }

                    }
                    catch (Exception ex)
                    {
                        dbTransaction.Rollback();
                        LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.I_TR_OperationTF.OperationID, obj.I_TR_OperationTF.Tr_No.ToString(), LogUser.UserLog.Update, obj.MODULE_CODE, false, ex.Message.ToString(), null, null);
                        return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                    }
                }
            }
            return BadRequest(ModelState);
        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult OpenProcesTransfer([FromBody]OPerationSalesmanTransferWithDetail obj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(obj.Token, obj.UserCode))
            {
                using (System.Data.Entity.DbContextTransaction dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        I_TR_OperationTF jouranalHeader = ISalesTranservice.Update(obj.I_TR_OperationTF);

                        //update Details
                        List<I_TR_OperationTFDetail> insertedObjects = obj.I_TR_OperationTFDetail.Where(x => x.StatusFlag == 'i').ToList();
                        List<I_TR_OperationTFDetail> updatedObjects = obj.I_TR_OperationTFDetail.Where(x => x.StatusFlag == 'u').ToList();
                        List<I_TR_OperationTFDetail> deletedObjects = obj.I_TR_OperationTFDetail.Where(x => x.StatusFlag == 'd').ToList();

                        foreach (I_TR_OperationTFDetail item in insertedObjects)
                        {
                            item.OperationTFID = obj.I_TR_OperationTF.OperationTFID;
                            ISalesTranservice.Insert(item);
                        }
                        foreach (I_TR_OperationTFDetail item in updatedObjects)
                        {
                            item.OperationTFID = obj.I_TR_OperationTF.OperationTFID;
                            ISalesTranservice.Update(item);
                        }
                        foreach (I_TR_OperationTFDetail item in deletedObjects)
                        {
                            ISalesTranservice.Delete(item.OperationTFDetailID);
                        }

                        ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(obj.I_TR_OperationTF.CompCode), Convert.ToInt32(obj.I_TR_OperationTF.BranchCode), jouranalHeader.OperationTFID, "SlsTrnsfer", "Open", db);
                        if (res.ResponseState == true)
                        {
                            dbTransaction.Commit();
                            LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.I_TR_OperationTF.OperationID, obj.I_TR_OperationTF.Tr_No.ToString(), LogUser.UserLog.Open, obj.MODULE_CODE, true, null, null, null);
                            return Ok(new BaseResponse(obj.I_TR_OperationTF));
                        }
                        else
                        {
                            dbTransaction.Rollback();
                            LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.I_TR_OperationTF.OperationID, obj.I_TR_OperationTF.Tr_No.ToString(), LogUser.UserLog.Open, obj.MODULE_CODE, false, res.ResponseMessage.ToString(), null, null);
                            return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, res.ResponseMessage));
                        }
                    }
                    catch (Exception ex)
                    {
                        dbTransaction.Rollback();
                        LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.I_TR_OperationTF.OperationID,obj.I_TR_OperationTF.Tr_No.ToString(), LogUser.UserLog.Open, obj.MODULE_CODE, false, ex.Message.ToString(), null, null);
                        return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                    }
                }
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetTransferByID(int OperationTFID, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                List<IQ_GetOperationTF> res = db.IQ_GetOperationTF.Where(s => s.OperationTFID == OperationTFID).ToList();
                List<IQ_GetOperationTFDetail> res2 = db.IQ_GetOperationTFDetail.Where(s => s.OperationTFID == OperationTFID).ToList();
                IQ_GetOPerationTransferWithDetail model = new IQ_GetOPerationTransferWithDetail
                {
                    IQ_GetOperationTF = res,
                    IQ_GetOperationTFDetail = res2
                };
                return Ok(new BaseResponse(model));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllSalesmanOperations(int salesmanId, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                List<IQ_GetOperationSalesman> ItemStoreInfoList = db.IQ_GetOperationSalesman.Where(x => x.SalesmanId == salesmanId).ToList();

                return Ok(new BaseResponse(ItemStoreInfoList));
            }
            return BadRequest(ModelState);
        }
        #endregion

        [HttpGet, AllowAnonymous]
        public IHttpActionResult closingprocessingon(int OperationID, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                string query = "EXEC IProc_UpdateOperationSummaryVer2 " + OperationID + "  ";
                db.Database.ExecuteSqlCommand(query);
                return Ok(new BaseResponse(true));
            }
            return BadRequest(ModelState);
        }


        [HttpGet, AllowAnonymous]
        public IHttpActionResult closingprocessingonNew(int OperationID, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                string query = @"EXEC IProc_UpdateOperationSummaryVer2 "+ OperationID + @"
                        update [dbo].[I_TR_Operation] set Status = 2 where OperationID = " + OperationID + "";

                db.Database.ExecuteSqlCommand(query);
                return Ok(new BaseResponse(true));
            }
            return BadRequest(ModelState);
        }

    }
}
