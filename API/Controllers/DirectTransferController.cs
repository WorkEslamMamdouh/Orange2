using Inv.API.Models;
using Inv.API.Models.CustomModel;
using Inv.API.Tools;
using Inv.BLL.Services.DirectTransfer;
using Inv.BLL.Services.StckAdjust;
using Inv.BLL.Services.ItemDef;
using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Inv.API.Controllers;


namespace Inv.API.Controllers
{
    public class DirectTransferController : BaseController
    {
        private readonly IDirectTransferService IDirectTransferService;
        private readonly IStckAdjustService IStckAdjustService;
        private readonly IItemDefService IItemDefService;
        private readonly G_USERSController UserControl;

        public DirectTransferController(IDirectTransferService _IDirectTransferService, IItemDefService _IItemDefService, IStckAdjustService _IStckAdjustService, G_USERSController _Control)
        {
            this.IDirectTransferService = _IDirectTransferService;
            this.IStckAdjustService = _IStckAdjustService;
            this.IItemDefService = _IItemDefService;
            this.UserControl = _Control;
        }

        #region Direct Transfer
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllDirectTransferHeaderWithDetail(int compcode, int TrType, int TFType, string FromDate, string toDate, int status, int sourcrBR, int ToBR, int sourcrStore, int ToStore, string UserCode, string Token, string MODULE_CODE, string FinYear)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                string s = "select * from IQ_GetTransfer where  TrDate >=' " + FromDate + "' and TrDate <= ' " + toDate + " '  and TrType= " + TrType + "  and CompCode= " + compcode;

                string condition = "";
                if (sourcrBR != 0)
                    condition = condition + " and SenderBranchCode = " + sourcrBR;

                if (ToBR != 0)
                    condition = condition + " and ReceiverBranchCode = " + ToBR;

                if (sourcrStore != 0)
                    condition = condition + " and SenderStoreID = " + sourcrStore;

                if (ToStore != 0)
                    condition = condition + " and ReceiverStoreID = " + ToStore;

                if (TFType != 0)
                {
                    condition = condition + "  and TFType = " + TFType;
                }
                else
                {
                    condition = condition + "";
                }


                if (status == 2)
                    condition = condition + "";

                if (status == 0 && TFType == 1)
                {
                    condition = condition + " and IsSent = 'False'  ";
                }
                else if (status == 1 && TFType == 1)
                {
                    condition = condition + " and IsSent = 'True' ";
                }

                if (status == 0 && TFType == 2)
                {
                    condition = condition + " and IsReceived = 'False'  ";
                }
                else if (status == 1 && TFType == 2)
                {
                    condition = condition + " and IsReceived = 'True' ";
                }


                string query = s + condition;
                var res = db.Database.SqlQuery<IQ_GetTransfer>(query).ToList();
                //var res2 = db.IQ_GetTransferDetail.ToList();
                //IQ_DirectTransferWithDetail model = new IQ_DirectTransferWithDetail();
                //model.IQ_GetTransfer = res;
                //model.IQ_GetTransferDetail = res2;


                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllItemsInStore(int branch, int comp, int Store, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var itemsList = IItemDefService.GetAll(s => s.CompCode == comp && s.BraCode == branch && s.StoreId == Store).ToList();
                return Ok(new BaseResponse(itemsList));
            }
            return BadRequest(ModelState);
        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult InsertDirectTransferMasterDetail([FromBody]DirectTransferMasterDetails obj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(obj.Token, obj.UserCode))
            {
                using (var dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        var TransferHeader = IDirectTransferService.Insert(obj.I_Stk_TR_Transfer);
                        foreach (var item in obj.I_Stk_TR_TransferDetails)
                        {
                            item.TransfareID = TransferHeader.TransfareID;
                            IDirectTransferService.Insert(item);
                        }
                        if (obj.I_Stk_TR_Transfer.TrType == 0 && obj.I_Stk_TR_Transfer.TFType == 1)
                        {
                            //// call process trans 

                            ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(obj.I_Stk_TR_Transfer.CompCode), Convert.ToInt32(obj.I_Stk_TR_Transfer.BranchCode), TransferHeader.TransfareID, "DirctTrans", "Add", db);
                            if (res.ResponseState == true)
                            {
                                obj.I_Stk_TR_Transfer.Tr_No = int.Parse(res.ResponseData.ToString());
                                dbTransaction.Commit();
                                return Ok(new BaseResponse(obj.I_Stk_TR_Transfer));
                            }
                            else
                            {
                                dbTransaction.Rollback();
                                return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, res.ResponseMessage));
                            }
                            ////////
                        }
                        else if (obj.I_Stk_TR_Transfer.TrType == 1 && obj.I_Stk_TR_Transfer.TFType == 1)
                        {
                            //// call process trans 

                            ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(obj.I_Stk_TR_Transfer.CompCode), Convert.ToInt32(obj.I_Stk_TR_Transfer.BranchCode), TransferHeader.TransfareID, "sendTrans", "Add", db);
                            if (res.ResponseState == true)
                            {
                                obj.I_Stk_TR_Transfer.Tr_No = int.Parse(res.ResponseData.ToString());
                                dbTransaction.Commit();
                                LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, null, LogUser.UserLog.Update, obj.MODULE_CODE, true, null, null, null);

                                return Ok(new BaseResponse(obj.I_Stk_TR_Transfer));
                            }
                            else
                            {
                                dbTransaction.Rollback();
                                LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, null, LogUser.UserLog.Update, obj.MODULE_CODE, false, res.ResponseMessage.ToString(), null, null);

                                return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, res.ResponseMessage));
                            }
                            ////////
                        }
                        else if (obj.I_Stk_TR_Transfer.TrType == 1 && obj.I_Stk_TR_Transfer.TFType == 2)
                        {
                            //// call process trans 

                            ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(obj.I_Stk_TR_Transfer.CompCode), Convert.ToInt32(obj.I_Stk_TR_Transfer.BranchCode), TransferHeader.TransfareID, "RecvTrans", "Add", db);
                            if (res.ResponseState == true)
                            {
                                obj.I_Stk_TR_Transfer.Tr_No = int.Parse(res.ResponseData.ToString());
                                dbTransaction.Commit();
                                LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, null, LogUser.UserLog.Update, obj.MODULE_CODE, true, null, null, null);

                                return Ok(new BaseResponse(obj.I_Stk_TR_Transfer));
                            }
                            else
                            {
                                dbTransaction.Rollback();
                                LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, null, LogUser.UserLog.Update, obj.MODULE_CODE, true, null, null, null);

                                return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, res.ResponseMessage));
                            }
                            ////////
                        }
                    }
                    catch (Exception ex)
                    {
                        dbTransaction.Rollback();
                        LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, null, LogUser.UserLog.Update, obj.MODULE_CODE, false, ex.Message.ToString(), null, null);

                        return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                    }
                }
            }
            return BadRequest(ModelState);
        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult UpdateDirectTransferDetail([FromBody]DirectTransferMasterDetails obj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(obj.Token, obj.UserCode))
            {
                using (var dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        var jouranalHeader = IDirectTransferService.Update(obj.I_Stk_TR_Transfer);

                        //update Details
                        var insertedObjects = obj.I_Stk_TR_TransferDetails.Where(x => x.StatusFlag == 'i').ToList();
                        var updatedObjects = obj.I_Stk_TR_TransferDetails.Where(x => x.StatusFlag == 'u').ToList();
                        var deletedObjects = obj.I_Stk_TR_TransferDetails.Where(x => x.StatusFlag == 'd').ToList();

                        foreach (var item in insertedObjects)
                        {
                            item.TransfareID = obj.I_Stk_TR_Transfer.TransfareID;
                            IDirectTransferService.Insert(item);
                        }
                        foreach (var item in updatedObjects)
                        {
                            item.TransfareID = obj.I_Stk_TR_Transfer.TransfareID;
                            IDirectTransferService.Update(item);
                        }
                        foreach (var item in deletedObjects)
                        {
                            IDirectTransferService.Delete(item.TransfareDetailID);
                        }

                        //// call process trans 
                        if (obj.I_Stk_TR_Transfer.TrType == 0 && obj.I_Stk_TR_Transfer.TFType == 1)
                        {

                            ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(obj.I_Stk_TR_Transfer.CompCode), Convert.ToInt32(obj.I_Stk_TR_Transfer.BranchCode), jouranalHeader.TransfareID, "DirctTrans", "Update", db);
                            if (res.ResponseState == true)
                            {
                                dbTransaction.Commit();
                                LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, null, LogUser.UserLog.Update, obj.MODULE_CODE, true, null, null, null);

                                return Ok(new BaseResponse(obj.I_Stk_TR_Transfer));
                            }
                            else
                            {
                                dbTransaction.Rollback();
                                LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, null, LogUser.UserLog.Update, obj.MODULE_CODE, false, res.ResponseMessage.ToString(), null, null);

                                return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, res.ResponseMessage));
                            }
                        }
                        else if (obj.I_Stk_TR_Transfer.TrType == 1 && obj.I_Stk_TR_Transfer.TFType == 1)
                        {

                            ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(obj.I_Stk_TR_Transfer.CompCode), Convert.ToInt32(obj.I_Stk_TR_Transfer.BranchCode), jouranalHeader.TransfareID, "sendTrans", "Update", db);
                            if (res.ResponseState == true)
                            {
                                dbTransaction.Commit();
                                LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, null, LogUser.UserLog.Update, obj.MODULE_CODE, true, null, null, null);

                                return Ok(new BaseResponse(obj.I_Stk_TR_Transfer));
                            }
                            else
                            {
                                dbTransaction.Rollback();
                                LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, null, LogUser.UserLog.Update, obj.MODULE_CODE, false, res.ResponseMessage.ToString(), null, null);

                                return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, res.ResponseMessage));
                            }
                        }
                        else if (obj.I_Stk_TR_Transfer.TrType == 1 && obj.I_Stk_TR_Transfer.TFType == 2)
                        {

                            ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(obj.I_Stk_TR_Transfer.CompCode), Convert.ToInt32(obj.I_Stk_TR_Transfer.BranchCode), jouranalHeader.TransfareID, "RecvTrans", "Update", db);
                            if (res.ResponseState == true)
                            {
                                dbTransaction.Commit();
                                LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, null, LogUser.UserLog.Update, obj.MODULE_CODE, true, null, null, null);

                                return Ok(new BaseResponse(obj.I_Stk_TR_Transfer));
                            }
                            else
                            {
                                dbTransaction.Rollback();
                                LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, null, LogUser.UserLog.Update, obj.MODULE_CODE, false, res.ResponseMessage.ToString(), null, null);

                                return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, res.ResponseMessage));
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        dbTransaction.Rollback();
                        LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, null, LogUser.UserLog.Update, obj.MODULE_CODE, false, ex.Message.ToString(), null, null);

                        return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                    }
                }
            }
            return BadRequest(ModelState);
        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult Open([FromBody]DirectTransferMasterDetails obj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(obj.Token, obj.UserCode))
            {
                using (var dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        var jouranalHeader = IDirectTransferService.Update(obj.I_Stk_TR_Transfer);

                        //update Details
                        var insertedObjects = obj.I_Stk_TR_TransferDetails.Where(x => x.StatusFlag == 'i').ToList();
                        var updatedObjects = obj.I_Stk_TR_TransferDetails.Where(x => x.StatusFlag == 'u').ToList();
                        var deletedObjects = obj.I_Stk_TR_TransferDetails.Where(x => x.StatusFlag == 'd').ToList();

                        foreach (var item in insertedObjects)
                        {
                            item.TransfareID = obj.I_Stk_TR_Transfer.TransfareID;
                            IDirectTransferService.Insert(item);
                        }
                        foreach (var item in updatedObjects)
                        {
                            item.TransfareID = obj.I_Stk_TR_Transfer.TransfareID;
                            IDirectTransferService.Update(item);
                        }
                        foreach (var item in deletedObjects)
                        {
                            IDirectTransferService.Delete(item.TransfareDetailID);
                        }

                        //// call process trans 
                        if (obj.I_Stk_TR_Transfer.TrType == 0 && obj.I_Stk_TR_Transfer.TFType == 1)
                        {

                            ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(obj.I_Stk_TR_Transfer.CompCode), Convert.ToInt32(obj.I_Stk_TR_Transfer.BranchCode), jouranalHeader.TransfareID, "DirctTrans", "Open", db);
                            if (res.ResponseState == true)
                            {
                                dbTransaction.Commit();
                                return Ok(new BaseResponse(obj.I_Stk_TR_Transfer));
                            }
                            else
                            {
                                dbTransaction.Rollback();
                                return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, res.ResponseMessage));
                            }
                        }
                        else if (obj.I_Stk_TR_Transfer.TrType == 1 && obj.I_Stk_TR_Transfer.TFType == 1)
                        {

                            ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(obj.I_Stk_TR_Transfer.CompCode), Convert.ToInt32(obj.I_Stk_TR_Transfer.BranchCode), jouranalHeader.TransfareID, "sendTrans", "Open", db);
                            if (res.ResponseState == true)
                            {
                                dbTransaction.Commit();
                                return Ok(new BaseResponse(obj.I_Stk_TR_Transfer));
                            }
                            else
                            {
                                dbTransaction.Rollback();
                                return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, res.ResponseMessage));
                            }
                        }
                        else if (obj.I_Stk_TR_Transfer.TrType == 1 && obj.I_Stk_TR_Transfer.TFType == 2)
                        {

                            ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(obj.I_Stk_TR_Transfer.CompCode), Convert.ToInt32(obj.I_Stk_TR_Transfer.BranchCode), jouranalHeader.TransfareID, "RecvTrans", "Open", db);
                            if (res.ResponseState == true)
                            {
                                dbTransaction.Commit();
                                return Ok(new BaseResponse(obj.I_Stk_TR_Transfer));
                            }
                            else
                            {
                                dbTransaction.Rollback();
                                return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, res.ResponseMessage));
                            }
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
        public IHttpActionResult GetTransferByID(int TransferID, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var res = db.IQ_GetTransfer.Where(s => s.TransfareID == TransferID).ToList();
                var res2 = db.IQ_GetTransferDetail.Where(s => s.TransfareID == TransferID).ToList();
                IQ_DirectTransferWithDetail model = new IQ_DirectTransferWithDetail();
                model.IQ_GetTransfer = res;
                model.IQ_GetTransferDetail = res2;
                return Ok(new BaseResponse(model));
            }
            return BadRequest(ModelState);
        }

        #endregion

        #region Stock Adjustment
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllStockAdjustmentHeaderWithDetail(int CompCode, int TrType, int State, string FromDate, string toDate, int Store, string UserCode, string Token, string MODULE_CODE, string FinYear, string Branch_Code)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                string s = "select * from IQ_GetStkAdjust where CompCode = " + CompCode + " and  TrDate >=' " + FromDate + "' and TrDate <= ' " + toDate + " '";
                string condition = "";
                if (TrType == 3)
                    condition = condition + "";
                else
                {
                    condition = condition + " and TrType =  " + TrType;
                }
                if (Store != 0)
                    condition = condition + " and StoreID = " + Store;

                if (State == 2)
                    condition = condition + "";
                else
                {
                    condition = condition + " and Status =  " + State;
                }

                string query = s + condition;
                var res = db.Database.SqlQuery<IQ_GetStkAdjust>(query).ToList();
                LogUser.InsertPrint(db, CompCode.ToString(), Branch_Code, FinYear, UserCode, null, LogUser.UserLog.Query, MODULE_CODE, true, null, null, null);

                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetStockByID(int AdjustID, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var res = db.IQ_GetStkAdjust.Where(s => s.AdjustID == AdjustID).ToList();
                var res2 = db.IQ_GetStkAdjustDetail.Where(s => s.AdjustID == AdjustID).ToList();
                IQ_GetStkAdjustWithDetail model = new IQ_GetStkAdjustWithDetail();
                model.IQ_GetStkAdjust = res;
                model.IQ_GetStkAdjustDetail = res2;
                return Ok(new BaseResponse(model));
            }
            return BadRequest(ModelState);
        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult InsertStockAdjustmentMasterDetail([FromBody]StockAdjustMasterDetails obj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(obj.Token, obj.UserCode))
            {
                using (var dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        var TransferHeader = IStckAdjustService.Insert(obj.I_Stk_TR_Adjust);
                        foreach (var item in obj.I_Stk_Tr_AdjustDetails)
                        {
                            item.AdjustID = TransferHeader.AdjustID;
                            IStckAdjustService.Insert(item);
                        }

                        //// call process trans 

                        ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(obj.I_Stk_TR_Adjust.CompCode), Convert.ToInt32(obj.I_Stk_TR_Adjust.BranchCode), TransferHeader.AdjustID, "StkAdjust", "Add", db);
                        if (res.ResponseState == true)
                        {
                            obj.I_Stk_TR_Adjust.Tr_No = int.Parse(res.ResponseData.ToString());
                            dbTransaction.Commit();
                            LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, null, LogUser.UserLog.Insert, obj.MODULE_CODE, true, null, null, null);

                            return Ok(new BaseResponse(obj.I_Stk_TR_Adjust));
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
        public IHttpActionResult UpdateStockAdjustmentDetail([FromBody]StockAdjustMasterDetails obj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(obj.Token, obj.UserCode))
            {
                using (var dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        var jouranalHeader = IStckAdjustService.Update(obj.I_Stk_TR_Adjust);

                        var insertedObjects = obj.I_Stk_Tr_AdjustDetails.Where(x => x.StatusFlag == 'i').ToList();
                        var updatedObjects = obj.I_Stk_Tr_AdjustDetails.Where(x => x.StatusFlag == 'u').ToList();
                        var deletedObjects = obj.I_Stk_Tr_AdjustDetails.Where(x => x.StatusFlag == 'd').ToList();

                        foreach (var item in insertedObjects)
                        {
                            item.AdjustID = obj.I_Stk_TR_Adjust.AdjustID;
                            IStckAdjustService.Insert(item);
                        }
                        foreach (var item in updatedObjects)
                        {
                            item.AdjustID = obj.I_Stk_TR_Adjust.AdjustID;
                            IStckAdjustService.Update(item);
                        }
                        foreach (var item in deletedObjects)
                        {
                            IStckAdjustService.Delete(item.AdjustDetailID);
                        }

                        ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(obj.I_Stk_TR_Adjust.CompCode), Convert.ToInt32(obj.I_Stk_TR_Adjust.BranchCode), jouranalHeader.AdjustID, "StkAdjust", "Update", db);
                        if (res.ResponseState == true)
                        {
                            dbTransaction.Commit();
                            LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, null, LogUser.UserLog.Update, obj.MODULE_CODE, true, null, null, null);

                            return Ok(new BaseResponse(obj.I_Stk_TR_Adjust));
                        }
                        else
                        {
                            dbTransaction.Rollback();
                            LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, null, LogUser.UserLog.Update, obj.MODULE_CODE, false, res.ResponseMessage.ToString(), null, null);
                            return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, res.ResponseMessage));
                        }

                    }
                    catch (Exception ex)
                    {
                        dbTransaction.Rollback();
                        LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, null, LogUser.UserLog.Update, obj.MODULE_CODE, false, ex.Message.ToString(), null, null);
                        return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                    }
                }
            }
            return BadRequest(ModelState);
        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult OpenStockAdjustment([FromBody]StockAdjustMasterDetails obj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(obj.Token, obj.UserCode))
            {
                using (var dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        var jouranalHeader = IStckAdjustService.Update(obj.I_Stk_TR_Adjust);

                        //update Details
                        var insertedObjects = obj.I_Stk_Tr_AdjustDetails.Where(x => x.StatusFlag == 'i').ToList();
                        var updatedObjects = obj.I_Stk_Tr_AdjustDetails.Where(x => x.StatusFlag == 'u').ToList();
                        var deletedObjects = obj.I_Stk_Tr_AdjustDetails.Where(x => x.StatusFlag == 'd').ToList();

                        foreach (var item in insertedObjects)
                        {
                            item.AdjustID = obj.I_Stk_TR_Adjust.AdjustID;
                            IStckAdjustService.Insert(item);
                        }
                        foreach (var item in updatedObjects)
                        {
                            item.AdjustID = obj.I_Stk_TR_Adjust.AdjustID;
                            IStckAdjustService.Update(item);
                        }
                        foreach (var item in deletedObjects)
                        {
                            IStckAdjustService.Delete(item.AdjustDetailID);
                        }

                        //// call process trans 


                        ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(obj.I_Stk_TR_Adjust.CompCode), Convert.ToInt32(obj.I_Stk_TR_Adjust.BranchCode), jouranalHeader.AdjustID, "StkAdjust", "Open", db);
                        if (res.ResponseState == true)
                        {
                            dbTransaction.Commit();
                            LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, null, LogUser.UserLog.Open, obj.MODULE_CODE, true, null, null, null);

                            return Ok(new BaseResponse(obj.I_Stk_TR_Adjust));
                        }
                        else
                        {
                            dbTransaction.Rollback();
                            LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, null, LogUser.UserLog.Open, obj.MODULE_CODE, false, res.ResponseMessage.ToString(), null, null);
                            return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, res.ResponseMessage));
                        }

                    }
                    catch (Exception ex)
                    {
                        dbTransaction.Rollback();
                        LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, null, LogUser.UserLog.Open, obj.MODULE_CODE, false, ex.Message.ToString(), null, null);
                        return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                    }
                }
            }
            return BadRequest(ModelState);
        }


        [HttpPost, AllowAnonymous]
        public IHttpActionResult RefrashStockAdjustmentDetail([FromBody]StockAdjustMasterDetails obj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(obj.Token, obj.UserCode))
            {
                using (var dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        var jouranalHeader = IStckAdjustService.Update(obj.I_Stk_TR_Adjust);
                        //update Details
                        var insertedObjects = obj.I_Stk_Tr_AdjustDetails.Where(x => x.StatusFlag == 'i').ToList();
                        var updatedObjects = obj.I_Stk_Tr_AdjustDetails.Where(x => x.StatusFlag == 'u').ToList();
                        var deletedObjects = obj.I_Stk_Tr_AdjustDetails.Where(x => x.StatusFlag == 'd').ToList();
                        foreach (var item in insertedObjects)
                        {
                            item.AdjustID = obj.I_Stk_TR_Adjust.AdjustID;
                            IStckAdjustService.Insert(item);
                        }
                        foreach (var item in updatedObjects)
                        {
                            item.AdjustID = obj.I_Stk_TR_Adjust.AdjustID;
                            IStckAdjustService.Update(item);
                        }
                        foreach (var item in deletedObjects)
                        {
                            IStckAdjustService.Delete(item.AdjustDetailID);
                        }
                        //// call process trans   


                        string query = " IProc_StkAdjUpdate  " + obj.I_Stk_TR_Adjust.AdjustID + "";
                        db.Database.ExecuteSqlCommand(query);


                        dbTransaction.Commit();


                        return Ok(new BaseResponse(obj.I_Stk_TR_Adjust));

                    }
                    catch (Exception ex)
                    {
                        return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                    }
                }
            }
            return BadRequest(ModelState);
        }


        #endregion


    }
}
