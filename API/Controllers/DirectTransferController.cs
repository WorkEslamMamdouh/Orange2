using Inv.API.Models;
using Inv.API.Models.CustomModel;
using Inv.API.Tools;
using Inv.BLL.Services.DirectTransfer;
using Inv.BLL.Services.ItemDef;
using Inv.BLL.Services.StckAdjust;
using Inv.BLL.Services.STKOpen;
using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web.Http;


namespace Inv.API.Controllers
{
    public class DirectTransferController : BaseController
    {
        private readonly IDirectTransferService IDirectTransferService;
        private readonly ISTKOpenService ISTKOpenService;
        private readonly IStckAdjustService IStckAdjustService;
        private readonly IItemDefService IItemDefService;
        private readonly G_USERSController UserControl;

        public DirectTransferController(IDirectTransferService _IDirectTransferService, IItemDefService _IItemDefService, IStckAdjustService _IStckAdjustService, ISTKOpenService _ISTKOpenService, G_USERSController _Control)
        {
            IDirectTransferService = _IDirectTransferService;
            IStckAdjustService = _IStckAdjustService;
            ISTKOpenService = _ISTKOpenService;
            IItemDefService = _IItemDefService;
            UserControl = _Control;
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
                {
                    condition = condition + " and SenderBranchCode = " + sourcrBR;
                }

                if (ToBR != 0)
                {
                    condition = condition + " and ReceiverBranchCode = " + ToBR;
                }

                if (sourcrStore != 0)
                {
                    condition = condition + " and SenderStoreID = " + sourcrStore;
                }

                if (ToStore != 0)
                {
                    condition = condition + " and ReceiverStoreID = " + ToStore;
                }

                if (TFType != 0)
                {
                    condition = condition + "  and TFType = " + TFType;
                }
                else
                {
                    condition = condition + "";
                }


                if (status == 2)
                {
                    condition = condition + "";
                }

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
                List<IQ_GetTransfer> res = db.Database.SqlQuery<IQ_GetTransfer>(query).ToList();
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
                List<IQ_GetItemStoreInfo> itemsList = IItemDefService.GetAll(s => s.CompCode == comp && s.BraCode == branch && s.StoreId == Store).ToList();
                return Ok(new BaseResponse(itemsList));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllItemsInStoreNew(int branch, int comp, int Store,int FinYear, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                List<IQ_GetItemStoreInfo> itemsList = IItemDefService.GetAll(s => s.CompCode == comp && s.BraCode == branch && s.StoreId == Store && s.FinYear == FinYear).ToList();
                return Ok(new BaseResponse(itemsList));
            }
            return BadRequest(ModelState);
        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult InsertDirectTransferMasterDetail([FromBody]DirectTransferMasterDetails obj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(obj.Token, obj.UserCode))
            {
                using (System.Data.Entity.DbContextTransaction dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        I_Stk_TR_Transfer TransferHeader = IDirectTransferService.Insert(obj.I_Stk_TR_Transfer);
                        foreach (I_Stk_TR_TransferDetails item in obj.I_Stk_TR_TransferDetails)
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
                                LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.I_Stk_TR_Transfer.TransfareID, obj.I_Stk_TR_Transfer.Tr_No.ToString(), LogUser.UserLog.Insert, obj.MODULE_CODE, true, null, null, null);
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
                                LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.I_Stk_TR_Transfer.TransfareID, obj.I_Stk_TR_Transfer.Tr_No.ToString(), LogUser.UserLog.Insert, obj.MODULE_CODE, true, null, null, null);

                                return Ok(new BaseResponse(obj.I_Stk_TR_Transfer));
                            }
                            else
                            {
                                dbTransaction.Rollback();
                                LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.I_Stk_TR_Transfer.TransfareID, obj.I_Stk_TR_Transfer.Tr_No.ToString(), LogUser.UserLog.Insert, obj.MODULE_CODE, false, res.ResponseMessage.ToString(), null, null);

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
                                LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.I_Stk_TR_Transfer.TransfareID, obj.I_Stk_TR_Transfer.Tr_No.ToString(), LogUser.UserLog.Insert, obj.MODULE_CODE, true, null, null, null);

                                return Ok(new BaseResponse(obj.I_Stk_TR_Transfer));
                            }
                            else
                            {
                                dbTransaction.Rollback();
                                LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.I_Stk_TR_Transfer.TransfareID, obj.I_Stk_TR_Transfer.Tr_No.ToString(), LogUser.UserLog.Insert, obj.MODULE_CODE, true, null, null, null);

                                return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, res.ResponseMessage));
                            }
                            ////////
                        }
                    }
                    catch (Exception ex)
                    {
                        dbTransaction.Rollback();
                        LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.I_Stk_TR_Transfer.TransfareID, obj.I_Stk_TR_Transfer.Tr_No.ToString(), LogUser.UserLog.Insert, obj.MODULE_CODE, false, ex.Message.ToString(), null, null);

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
                using (System.Data.Entity.DbContextTransaction dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        I_Stk_TR_Transfer jouranalHeader = IDirectTransferService.Update(obj.I_Stk_TR_Transfer);

                        //update Details
                        List<I_Stk_TR_TransferDetails> insertedObjects = obj.I_Stk_TR_TransferDetails.Where(x => x.StatusFlag == 'i').ToList();
                        List<I_Stk_TR_TransferDetails> updatedObjects = obj.I_Stk_TR_TransferDetails.Where(x => x.StatusFlag == 'u').ToList();
                        List<I_Stk_TR_TransferDetails> deletedObjects = obj.I_Stk_TR_TransferDetails.Where(x => x.StatusFlag == 'd').ToList();

                        foreach (I_Stk_TR_TransferDetails item in insertedObjects)
                        {
                            item.TransfareID = obj.I_Stk_TR_Transfer.TransfareID;
                            IDirectTransferService.Insert(item);
                        }
                        foreach (I_Stk_TR_TransferDetails item in updatedObjects)
                        {
                            item.TransfareID = obj.I_Stk_TR_Transfer.TransfareID;
                            IDirectTransferService.Update(item);
                        }
                        foreach (I_Stk_TR_TransferDetails item in deletedObjects)
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
                                LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.I_Stk_TR_Transfer.TransfareID, obj.I_Stk_TR_Transfer.Tr_No.ToString(), LogUser.UserLog.Update, obj.MODULE_CODE, true, null, null, null);

                                return Ok(new BaseResponse(obj.I_Stk_TR_Transfer));
                            }
                            else
                            {
                                dbTransaction.Rollback();
                                LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.I_Stk_TR_Transfer.TransfareID, obj.I_Stk_TR_Transfer.Tr_No.ToString(), LogUser.UserLog.Update, obj.MODULE_CODE, false, res.ResponseMessage.ToString(), null, null);

                                return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, res.ResponseMessage));
                            }
                        }
                        else if (obj.I_Stk_TR_Transfer.TrType == 1 && obj.I_Stk_TR_Transfer.TFType == 1)
                        {

                            ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(obj.I_Stk_TR_Transfer.CompCode), Convert.ToInt32(obj.I_Stk_TR_Transfer.BranchCode), jouranalHeader.TransfareID, "sendTrans", "Update", db);
                            if (res.ResponseState == true)
                            {
                                dbTransaction.Commit();
                                LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.I_Stk_TR_Transfer.TransfareID, obj.I_Stk_TR_Transfer.Tr_No.ToString(), LogUser.UserLog.Update, obj.MODULE_CODE, true, null, null, null);

                                return Ok(new BaseResponse(obj.I_Stk_TR_Transfer));
                            }
                            else
                            {
                                dbTransaction.Rollback();
                                LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.I_Stk_TR_Transfer.TransfareID, obj.I_Stk_TR_Transfer.Tr_No.ToString(), LogUser.UserLog.Update, obj.MODULE_CODE, false, res.ResponseMessage.ToString(), null, null);

                                return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, res.ResponseMessage));
                            }
                        }
                        else if (obj.I_Stk_TR_Transfer.TrType == 1 && obj.I_Stk_TR_Transfer.TFType == 2)
                        {

                            ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(obj.I_Stk_TR_Transfer.CompCode), Convert.ToInt32(obj.I_Stk_TR_Transfer.BranchCode), jouranalHeader.TransfareID, "RecvTrans", "Update", db);
                            if (res.ResponseState == true)
                            {
                                dbTransaction.Commit();
                                LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.I_Stk_TR_Transfer.TransfareID, obj.I_Stk_TR_Transfer.Tr_No.ToString(), LogUser.UserLog.Update, obj.MODULE_CODE, true, null, null, null);

                                return Ok(new BaseResponse(obj.I_Stk_TR_Transfer));
                            }
                            else
                            {
                                dbTransaction.Rollback();
                                LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.I_Stk_TR_Transfer.TransfareID, obj.I_Stk_TR_Transfer.Tr_No.ToString(), LogUser.UserLog.Update, obj.MODULE_CODE, false, res.ResponseMessage.ToString(), null, null);

                                return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, res.ResponseMessage));
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        dbTransaction.Rollback();
                        LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.I_Stk_TR_Transfer.TransfareID, obj.I_Stk_TR_Transfer.Tr_No.ToString(), LogUser.UserLog.Update, obj.MODULE_CODE, false, ex.Message.ToString(), null, null);

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
                using (System.Data.Entity.DbContextTransaction dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        I_Stk_TR_Transfer jouranalHeader = IDirectTransferService.Update(obj.I_Stk_TR_Transfer);

                        //update Details
                        List<I_Stk_TR_TransferDetails> insertedObjects = obj.I_Stk_TR_TransferDetails.Where(x => x.StatusFlag == 'i').ToList();
                        List<I_Stk_TR_TransferDetails> updatedObjects = obj.I_Stk_TR_TransferDetails.Where(x => x.StatusFlag == 'u').ToList();
                        List<I_Stk_TR_TransferDetails> deletedObjects = obj.I_Stk_TR_TransferDetails.Where(x => x.StatusFlag == 'd').ToList();

                        foreach (I_Stk_TR_TransferDetails item in insertedObjects)
                        {
                            item.TransfareID = obj.I_Stk_TR_Transfer.TransfareID;
                            IDirectTransferService.Insert(item);
                        }
                        foreach (I_Stk_TR_TransferDetails item in updatedObjects)
                        {
                            item.TransfareID = obj.I_Stk_TR_Transfer.TransfareID;
                            IDirectTransferService.Update(item);
                        }
                        foreach (I_Stk_TR_TransferDetails item in deletedObjects)
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
                                LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.I_Stk_TR_Transfer.TransfareID, obj.I_Stk_TR_Transfer.Tr_No.ToString(), LogUser.UserLog.Open, obj.MODULE_CODE, true, null, null, null);
                                return Ok(new BaseResponse(obj.I_Stk_TR_Transfer));
                            }
                            else
                            {
                                dbTransaction.Rollback();
                                LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.I_Stk_TR_Transfer.TransfareID, obj.I_Stk_TR_Transfer.Tr_No.ToString(), LogUser.UserLog.Open, obj.MODULE_CODE, false, res.ResponseMessage.ToString(), null, null);
                                return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, res.ResponseMessage));
                            }
                        }
                        else if (obj.I_Stk_TR_Transfer.TrType == 1 && obj.I_Stk_TR_Transfer.TFType == 1)
                        {

                            ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(obj.I_Stk_TR_Transfer.CompCode), Convert.ToInt32(obj.I_Stk_TR_Transfer.BranchCode), jouranalHeader.TransfareID, "sendTrans", "Open", db);
                            if (res.ResponseState == true)
                            {
                                dbTransaction.Commit();
                                LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.I_Stk_TR_Transfer.TransfareID, obj.I_Stk_TR_Transfer.Tr_No.ToString(), LogUser.UserLog.Open, obj.MODULE_CODE, true, null, null, null);
                                return Ok(new BaseResponse(obj.I_Stk_TR_Transfer));
                            }
                            else
                            {
                                dbTransaction.Rollback();
                                LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.I_Stk_TR_Transfer.TransfareID, obj.I_Stk_TR_Transfer.Tr_No.ToString(), LogUser.UserLog.Open, obj.MODULE_CODE, false, res.ResponseMessage.ToString(), null, null);
                                return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, res.ResponseMessage));
                            }
                        }
                        else if (obj.I_Stk_TR_Transfer.TrType == 1 && obj.I_Stk_TR_Transfer.TFType == 2)
                        {

                            ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(obj.I_Stk_TR_Transfer.CompCode), Convert.ToInt32(obj.I_Stk_TR_Transfer.BranchCode), jouranalHeader.TransfareID, "RecvTrans", "Open", db);
                            if (res.ResponseState == true)
                            {
                                dbTransaction.Commit();
                                LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.I_Stk_TR_Transfer.TransfareID, obj.I_Stk_TR_Transfer.Tr_No.ToString(), LogUser.UserLog.Open, obj.MODULE_CODE, true, null, null, null);
                                return Ok(new BaseResponse(obj.I_Stk_TR_Transfer));
                            }
                            else
                            {
                                dbTransaction.Rollback();
                                LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.I_Stk_TR_Transfer.TransfareID, obj.I_Stk_TR_Transfer.Tr_No.ToString(), LogUser.UserLog.Open, obj.MODULE_CODE, false, res.ResponseMessage.ToString(), null, null);
                                return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, res.ResponseMessage));
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        dbTransaction.Rollback();
                        LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.I_Stk_TR_Transfer.TransfareID, obj.I_Stk_TR_Transfer.Tr_No.ToString(), LogUser.UserLog.Open, obj.MODULE_CODE, false, ex.Message.ToString(), null, null);
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
                List<IQ_GetTransfer> res = db.IQ_GetTransfer.Where(s => s.TransfareID == TransferID).ToList();
                List<IQ_GetTransferDetail> res2 = db.IQ_GetTransferDetail.Where(s => s.TransfareID == TransferID).ToList();
                IQ_DirectTransferWithDetail model = new IQ_DirectTransferWithDetail
                {
                    IQ_GetTransfer = res,
                    IQ_GetTransferDetail = res2
                };
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
                {
                    condition = condition + "";
                }
                else
                {
                    condition = condition + " and TrType =  " + TrType;
                }
                if (Store != 0)
                {
                    condition = condition + " and StoreID = " + Store;
                }

                if (State == 2)
                {
                    condition = condition + "";
                }
                else
                {
                    condition = condition + " and Status =  " + State;
                }

                string query = s + condition;
                List<IQ_GetStkAdjust> res = db.Database.SqlQuery<IQ_GetStkAdjust>(query).ToList(); 

                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetStockByID(int AdjustID, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                List<IQ_GetStkAdjust> res = db.IQ_GetStkAdjust.Where(s => s.AdjustID == AdjustID).ToList();
                List<IQ_GetStkAdjustDetail> res2 = db.IQ_GetStkAdjustDetail.Where(s => s.AdjustID == AdjustID).ToList();
                IQ_GetStkAdjustWithDetail model = new IQ_GetStkAdjustWithDetail
                {
                    IQ_GetStkAdjust = res,
                    IQ_GetStkAdjustDetail = res2
                };
                return Ok(new BaseResponse(model));
            }
            return BadRequest(ModelState);
        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult InsertStockAdjustmentMasterDetail([FromBody]StockAdjustMasterDetails obj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(obj.Token, obj.UserCode))
            {
                using (System.Data.Entity.DbContextTransaction dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        I_Stk_TR_Adjust TransferHeader = IStckAdjustService.Insert(obj.I_Stk_TR_Adjust);
                        foreach (I_Stk_Tr_AdjustDetails item in obj.I_Stk_Tr_AdjustDetails)
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
                            LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.I_Stk_TR_Adjust.AdjustID, obj.I_Stk_TR_Adjust.Tr_No.ToString(), LogUser.UserLog.Insert, obj.MODULE_CODE, true, null, null, null);

                            return Ok(new BaseResponse(obj.I_Stk_TR_Adjust));
                        }
                        else
                        {
                            dbTransaction.Rollback();
                            LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.I_Stk_TR_Adjust.AdjustID, obj.I_Stk_TR_Adjust.Tr_No.ToString(), LogUser.UserLog.Insert, obj.MODULE_CODE, false, res.ResponseMessage.ToString(), null, null);
                            return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, res.ResponseMessage));
                        }
                    }
                    catch (Exception ex)
                    {
                        dbTransaction.Rollback();
                        LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.I_Stk_TR_Adjust.AdjustID, obj.I_Stk_TR_Adjust.Tr_No.ToString(), LogUser.UserLog.Insert, obj.MODULE_CODE, false, ex.Message.ToString(), null, null);
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
                using (System.Data.Entity.DbContextTransaction dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        I_Stk_TR_Adjust jouranalHeader = IStckAdjustService.Update(obj.I_Stk_TR_Adjust);

                        List<I_Stk_Tr_AdjustDetails> insertedObjects = obj.I_Stk_Tr_AdjustDetails.Where(x => x.StatusFlag == 'i').ToList();
                        List<I_Stk_Tr_AdjustDetails> updatedObjects = obj.I_Stk_Tr_AdjustDetails.Where(x => x.StatusFlag == 'u').ToList();
                        List<I_Stk_Tr_AdjustDetails> deletedObjects = obj.I_Stk_Tr_AdjustDetails.Where(x => x.StatusFlag == 'd').ToList();

                        foreach (I_Stk_Tr_AdjustDetails item in insertedObjects)
                        {
                            item.AdjustID = obj.I_Stk_TR_Adjust.AdjustID;
                            IStckAdjustService.Insert(item);
                        }
                        foreach (I_Stk_Tr_AdjustDetails item in updatedObjects)
                        {
                            item.AdjustID = obj.I_Stk_TR_Adjust.AdjustID;
                            IStckAdjustService.Update(item);
                        }
                        foreach (I_Stk_Tr_AdjustDetails item in deletedObjects)
                        {
                            IStckAdjustService.Delete(item.AdjustDetailID);
                        }

                        ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(obj.I_Stk_TR_Adjust.CompCode), Convert.ToInt32(obj.I_Stk_TR_Adjust.BranchCode), jouranalHeader.AdjustID, "StkAdjust", "Update", db);
                        if (res.ResponseState == true)
                        {
                            dbTransaction.Commit();
                            LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.I_Stk_TR_Adjust.AdjustID, obj.I_Stk_TR_Adjust.Tr_No.ToString(), LogUser.UserLog.Update, obj.MODULE_CODE, true, null, null, null);

                            return Ok(new BaseResponse(obj.I_Stk_TR_Adjust));
                        }
                        else
                        {
                            dbTransaction.Rollback();
                            LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.I_Stk_TR_Adjust.AdjustID, obj.I_Stk_TR_Adjust.Tr_No.ToString(), LogUser.UserLog.Update, obj.MODULE_CODE, false, res.ResponseMessage.ToString(), null, null);
                            return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, res.ResponseMessage));
                        }

                    }
                    catch (Exception ex)
                    {
                        dbTransaction.Rollback();
                        LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.I_Stk_TR_Adjust.AdjustID, obj.I_Stk_TR_Adjust.Tr_No.ToString(), LogUser.UserLog.Update, obj.MODULE_CODE, false, ex.Message.ToString(), null, null);
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
                using (System.Data.Entity.DbContextTransaction dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        I_Stk_TR_Adjust jouranalHeader = IStckAdjustService.Update(obj.I_Stk_TR_Adjust);

                        //update Details
                        List<I_Stk_Tr_AdjustDetails> insertedObjects = obj.I_Stk_Tr_AdjustDetails.Where(x => x.StatusFlag == 'i').ToList();
                        List<I_Stk_Tr_AdjustDetails> updatedObjects = obj.I_Stk_Tr_AdjustDetails.Where(x => x.StatusFlag == 'u').ToList();
                        List<I_Stk_Tr_AdjustDetails> deletedObjects = obj.I_Stk_Tr_AdjustDetails.Where(x => x.StatusFlag == 'd').ToList();

                        foreach (I_Stk_Tr_AdjustDetails item in insertedObjects)
                        {
                            item.AdjustID = obj.I_Stk_TR_Adjust.AdjustID;
                            IStckAdjustService.Insert(item);
                        }
                        foreach (I_Stk_Tr_AdjustDetails item in updatedObjects)
                        {
                            item.AdjustID = obj.I_Stk_TR_Adjust.AdjustID;
                            IStckAdjustService.Update(item);
                        }
                        foreach (I_Stk_Tr_AdjustDetails item in deletedObjects)
                        {
                            IStckAdjustService.Delete(item.AdjustDetailID);
                        }

                        //// call process trans 


                        ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(obj.I_Stk_TR_Adjust.CompCode), Convert.ToInt32(obj.I_Stk_TR_Adjust.BranchCode), jouranalHeader.AdjustID, "StkAdjust", "Open", db);
                        if (res.ResponseState == true)
                        {
                            dbTransaction.Commit();
                            LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.I_Stk_TR_Adjust.AdjustID, obj.I_Stk_TR_Adjust.Tr_No.ToString(), LogUser.UserLog.Open, obj.MODULE_CODE, true, null, null, null);

                            return Ok(new BaseResponse(obj.I_Stk_TR_Adjust));
                        }
                        else
                        {
                            dbTransaction.Rollback();
                            LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.I_Stk_TR_Adjust.AdjustID, obj.I_Stk_TR_Adjust.Tr_No.ToString(), LogUser.UserLog.Open, obj.MODULE_CODE, false, res.ResponseMessage.ToString(), null, null);
                            return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, res.ResponseMessage));
                        }

                    }
                    catch (Exception ex)
                    {
                        dbTransaction.Rollback();
                        LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.I_Stk_TR_Adjust.AdjustID, obj.I_Stk_TR_Adjust.Tr_No.ToString(), LogUser.UserLog.Open, obj.MODULE_CODE, false, ex.Message.ToString(), null, null);
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
                using (System.Data.Entity.DbContextTransaction dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        I_Stk_TR_Adjust jouranalHeader = IStckAdjustService.Update(obj.I_Stk_TR_Adjust);
                        //update Details
                        List<I_Stk_Tr_AdjustDetails> insertedObjects = obj.I_Stk_Tr_AdjustDetails.Where(x => x.StatusFlag == 'i').ToList();
                        List<I_Stk_Tr_AdjustDetails> updatedObjects = obj.I_Stk_Tr_AdjustDetails.Where(x => x.StatusFlag == 'u').ToList();
                        List<I_Stk_Tr_AdjustDetails> deletedObjects = obj.I_Stk_Tr_AdjustDetails.Where(x => x.StatusFlag == 'd').ToList();
                        foreach (I_Stk_Tr_AdjustDetails item in insertedObjects)
                        {
                            item.AdjustID = obj.I_Stk_TR_Adjust.AdjustID;
                            IStckAdjustService.Insert(item);
                        }
                        foreach (I_Stk_Tr_AdjustDetails item in updatedObjects)
                        {
                            item.AdjustID = obj.I_Stk_TR_Adjust.AdjustID;
                            IStckAdjustService.Update(item);
                        }
                        foreach (I_Stk_Tr_AdjustDetails item in deletedObjects)
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




        #region Stock Open


        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllStockOpenHeaderWithDetail(int CompCode, int State, string FromDate, string toDate, int Store, string UserCode, string Token, string MODULE_CODE, string FinYear, string Branch_Code)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                string s = "select * from I_Stk_TR_Open where CompCode = " + CompCode + " and  TrDate >=' " + FromDate + "' and TrDate <= ' " + toDate + " '";
                string condition = "";
                if (Store != 0)
                {
                    condition = condition + " and StoreID = " + Store;
                }

                if (State == 2)
                {
                    condition = condition + "";
                }
                else
                {
                    condition = condition + " and Status =  " + State;
                }

                string query = s + condition;
                List<I_Stk_TR_Open> res = db.Database.SqlQuery<I_Stk_TR_Open>(query).ToList(); 
                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetStockOpenByID(int OpenID, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                List<I_Stk_TR_Open> res = db.I_Stk_TR_Open.Where(s => s.OpenID == OpenID).ToList();
                List<IQ_GetStkOpenDetail> res2 = db.IQ_GetStkOpenDetail.Where(s => s.OpenID == OpenID).ToList();
                IQ_GetStkOpenWithDetail model = new IQ_GetStkOpenWithDetail
                {
                    I_Stk_TR_Open = res,
                    IQ_GetStkOpenDetail = res2
                };
                return Ok(new BaseResponse(model));
            }
            return BadRequest(ModelState);
        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult InsertStockOpenMasterDetail([FromBody]StockOpenMasterDetails obj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(obj.Token, obj.UserCode))
            {
                using (System.Data.Entity.DbContextTransaction dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        I_Stk_TR_Open TransferHeader = ISTKOpenService.Insert(obj.I_Stk_TR_Open);
                        foreach (I_Stk_Tr_OpenDetails item in obj.I_Stk_Tr_OpenDetails)
                        {
                            item.OpenID = TransferHeader.OpenID;
                            ISTKOpenService.Insert(item);
                        }

                        //// call process trans 

                        ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(obj.I_Stk_TR_Open.CompCode), Convert.ToInt32(obj.I_Stk_TR_Open.BranchCode), TransferHeader.OpenID, "StkOpen", "Add", db);
                        if (res.ResponseState == true)
                        {
                            obj.I_Stk_TR_Open.Tr_No = int.Parse(res.ResponseData.ToString());
                            dbTransaction.Commit();
                            LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.I_Stk_TR_Open.OpenID, obj.I_Stk_TR_Open.Tr_No.ToString(), LogUser.UserLog.Insert, obj.MODULE_CODE, true, null, null, null);

                            return Ok(new BaseResponse(obj.I_Stk_TR_Open));
                        }
                        else
                        {
                            dbTransaction.Rollback();
                            LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.I_Stk_TR_Open.OpenID, obj.I_Stk_TR_Open.Tr_No.ToString(), LogUser.UserLog.Insert, obj.MODULE_CODE, false, res.ResponseMessage.ToString(), null, null);
                            return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, res.ResponseMessage));
                        }
                    }
                    catch (Exception ex)
                    {
                        dbTransaction.Rollback();
                        LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.I_Stk_TR_Open.OpenID, obj.I_Stk_TR_Open.Tr_No.ToString(), LogUser.UserLog.Insert, obj.MODULE_CODE, false, ex.Message.ToString(), null, null);
                        return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                    }
                }
            }
            return BadRequest(ModelState);
        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult UpdateStockOpenDetail([FromBody]StockOpenMasterDetails obj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(obj.Token, obj.UserCode))
            {
                using (System.Data.Entity.DbContextTransaction dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        I_Stk_TR_Open jouranalHeader = ISTKOpenService.Update(obj.I_Stk_TR_Open);

                        List<I_Stk_Tr_OpenDetails> insertedObjects = obj.I_Stk_Tr_OpenDetails.Where(x => x.StatusFlag == 'i').ToList();
                        List<I_Stk_Tr_OpenDetails> updatedObjects = obj.I_Stk_Tr_OpenDetails.Where(x => x.StatusFlag == 'u').ToList();
                        List<I_Stk_Tr_OpenDetails> deletedObjects = obj.I_Stk_Tr_OpenDetails.Where(x => x.StatusFlag == 'd').ToList();

                        foreach (I_Stk_Tr_OpenDetails item in insertedObjects)
                        {
                            item.OpenID = obj.I_Stk_TR_Open.OpenID;
                            ISTKOpenService.Insert(item);
                        }
                        foreach (I_Stk_Tr_OpenDetails item in updatedObjects)
                        {
                            item.OpenID = obj.I_Stk_TR_Open.OpenID;
                            ISTKOpenService.Update(item);
                        }
                        foreach (I_Stk_Tr_OpenDetails item in deletedObjects)
                        {
                            if (item.OpenDetailID != 0 && item.OpenDetailID != null)
                            { 
                                ISTKOpenService.Delete(item.OpenDetailID);
                            }
                        }

                        ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(obj.I_Stk_TR_Open.CompCode), Convert.ToInt32(obj.I_Stk_TR_Open.BranchCode), jouranalHeader.OpenID, "StkOpen", "Update", db);
                        if (res.ResponseState == true)
                        {
                            dbTransaction.Commit();
                            LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.I_Stk_TR_Open.OpenID, obj.I_Stk_TR_Open.Tr_No.ToString(), LogUser.UserLog.Update, obj.MODULE_CODE, true, null, null, null);

                            return Ok(new BaseResponse(obj.I_Stk_TR_Open));
                        }
                        else
                        {
                            dbTransaction.Rollback();
                            LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.I_Stk_TR_Open.OpenID, obj.I_Stk_TR_Open.Tr_No.ToString(), LogUser.UserLog.Update, obj.MODULE_CODE, false, res.ResponseMessage.ToString(), null, null);
                            return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, res.ResponseMessage));
                        }

                    }
                    catch (Exception ex)
                    {
                        dbTransaction.Rollback();
                        LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.I_Stk_TR_Open.OpenID, obj.I_Stk_TR_Open.Tr_No.ToString(), LogUser.UserLog.Update, obj.MODULE_CODE, false, ex.Message.ToString(), null, null);
                        return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                    }
                }
            }
            return BadRequest(ModelState);
        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult OpenStockOpen([FromBody]StockOpenMasterDetails obj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(obj.Token, obj.UserCode))
            {
                using (System.Data.Entity.DbContextTransaction dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        I_Stk_TR_Open jouranalHeader = ISTKOpenService.Update(obj.I_Stk_TR_Open);

                        //update Details
                        List<I_Stk_Tr_OpenDetails> insertedObjects = obj.I_Stk_Tr_OpenDetails.Where(x => x.StatusFlag == 'i').ToList();
                        List<I_Stk_Tr_OpenDetails> updatedObjects = obj.I_Stk_Tr_OpenDetails.Where(x => x.StatusFlag == 'u').ToList();
                        List<I_Stk_Tr_OpenDetails> deletedObjects = obj.I_Stk_Tr_OpenDetails.Where(x => x.StatusFlag == 'd').ToList();

                        foreach (I_Stk_Tr_OpenDetails item in insertedObjects)
                        {
                            item.OpenID = obj.I_Stk_TR_Open.OpenID;
                            ISTKOpenService.Insert(item);
                        }
                        foreach (I_Stk_Tr_OpenDetails item in updatedObjects)
                        {
                            item.OpenID = obj.I_Stk_TR_Open.OpenID;
                            ISTKOpenService.Update(item);
                        }
                        foreach (I_Stk_Tr_OpenDetails item in deletedObjects)
                        {
                            ISTKOpenService.Delete(item.OpenDetailID);
                        }

                        //// call process trans 


                        ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(obj.I_Stk_TR_Open.CompCode), Convert.ToInt32(obj.I_Stk_TR_Open.BranchCode), jouranalHeader.OpenID, "StkOpen", "Open", db);
                        if (res.ResponseState == true)
                        {
                            dbTransaction.Commit();
                            LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.I_Stk_TR_Open.OpenID, obj.I_Stk_TR_Open.Tr_No.ToString(), LogUser.UserLog.Open, obj.MODULE_CODE, true, null, null, null);

                            return Ok(new BaseResponse(obj.I_Stk_TR_Open));
                        }
                        else
                        {
                            dbTransaction.Rollback();
                            LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.I_Stk_TR_Open.OpenID, obj.I_Stk_TR_Open.Tr_No.ToString(), LogUser.UserLog.Open, obj.MODULE_CODE, false, res.ResponseMessage.ToString(), null, null);
                            return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, res.ResponseMessage));
                        }

                    }
                    catch (Exception ex)
                    {
                        dbTransaction.Rollback();
                        LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.I_Stk_TR_Open.OpenID, obj.I_Stk_TR_Open.Tr_No.ToString(), LogUser.UserLog.Open, obj.MODULE_CODE, false, ex.Message.ToString(), null, null);
                        return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                    }
                }
            }
            return BadRequest(ModelState);
        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult RefrashStockOpenDetail([FromBody]StockOpenMasterDetails obj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(obj.Token, obj.UserCode))
            {
                using (System.Data.Entity.DbContextTransaction dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        I_Stk_TR_Open jouranalHeader = ISTKOpenService.Update(obj.I_Stk_TR_Open);
                        //update Details
                        List<I_Stk_Tr_OpenDetails> insertedObjects = obj.I_Stk_Tr_OpenDetails.Where(x => x.StatusFlag == 'i').ToList();
                        List<I_Stk_Tr_OpenDetails> updatedObjects = obj.I_Stk_Tr_OpenDetails.Where(x => x.StatusFlag == 'u').ToList();
                        List<I_Stk_Tr_OpenDetails> deletedObjects = obj.I_Stk_Tr_OpenDetails.Where(x => x.StatusFlag == 'd').ToList();
                        foreach (I_Stk_Tr_OpenDetails item in insertedObjects)
                        {
                            item.OpenID = obj.I_Stk_TR_Open.OpenID;
                            ISTKOpenService.Insert(item);
                        }
                        foreach (I_Stk_Tr_OpenDetails item in updatedObjects)
                        {
                            item.OpenID = obj.I_Stk_TR_Open.OpenID;
                            ISTKOpenService.Update(item);
                        }
                        foreach (I_Stk_Tr_OpenDetails item in deletedObjects)
                        {
                            ISTKOpenService.Delete(item.OpenDetailID);
                        }
                        //// call process trans   


                        //string query = " IProc_StkAdjUpdate  " + obj.I_Stk_TR_Open.OpenID + "";
                        //db.Database.ExecuteSqlCommand(query);


                        dbTransaction.Commit();


                        return Ok(new BaseResponse(obj.I_Stk_TR_Open));

                    }
                    catch (Exception ex)
                    {
                        return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                    }
                }
            }
            return BadRequest(ModelState);
        }



        [HttpGet, AllowAnonymous]
        public IHttpActionResult DeleteStockOpen(string query)
        {

            db.Database.ExecuteSqlCommand(query);
            return Ok(new BaseResponse(100));

        }




        #endregion


    }
}
