using Inv.API.Models;
using Inv.API.Tools;
using Inv.BLL.Services.AccTrReceipt;
using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web.Http;

namespace Inv.API.Controllers
{
    public class AccTrReceiptController : BaseController
    {
        private readonly IAccTrReceiptService AccTrReceiptService;
        private readonly G_USERSController UserControl;

        public AccTrReceiptController(IAccTrReceiptService _IAccTrReceiptService, G_USERSController _Control)
        {
            AccTrReceiptService = _IAccTrReceiptService;
            UserControl = _Control;
        }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAll(string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                List<A_RecPay_Tr_ReceiptNote> AccTrReceipList = AccTrReceiptService.GetAll().ToList();

                return Ok(new BaseResponse(AccTrReceipList));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetBoxReceiveList(int comp, int GlobalID, int IQ_TrType, int? Boxid, int? RecPayTypeId, string Status, string FromDate, string Todate, int? custId, int? vndid, int? expid, int? BankCode, int? fromBoxid, int? CashType, string UserCode, string Token, string FinYear, string MODULE_CODE, string BranchCode)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                if (custId == 0) { custId = null; }
                if (vndid == 0) { vndid = null; }
                if (BankCode == 0) { BankCode = null; }
                if (expid == 0) { expid = null; }
                if (fromBoxid == 0) { fromBoxid = null; }
                if (Boxid == 0) { Boxid = null; }
                if (RecPayTypeId == 0) { RecPayTypeId = null; }
                if (CashType == 1001) { CashType = null; }
                if (Status == "All") { Status = null; }

                string s = "select * from IQ_GetBoxReceiveList where TrType=" + IQ_TrType + " and CompCode= " + comp + "";
                string condition = "";

                if (CashType != null)
                {
                    condition = condition + " and CashType=" + CashType;
                }

                if (Boxid != null)
                {
                    condition = condition + " and CashBoxID=" + Boxid;
                }

                if (RecPayTypeId != null)
                {
                    condition = condition + " and RecPayTypeId=" + RecPayTypeId;
                }

                if (GlobalID != 0)
                {
                    if (RecPayTypeId == 1)
                    {
                        condition = condition + " and CustomerID =" + GlobalID;
                    }
                    else if (RecPayTypeId == 2)
                    {
                        condition = condition + " and VendorID =" + GlobalID;
                    }
                    else if (RecPayTypeId == 3)
                    {
                        condition = condition + " and BankAccountCode ='" + GlobalID + "'";
                    }
                    else if (RecPayTypeId == 4)
                    {
                        condition = condition + " and ExpenseID =" + GlobalID;
                    }
                    else if (RecPayTypeId == 5)
                    {
                        condition = condition + " and FromCashBoxID =" + GlobalID;
                    }
                }
                if (Status != null)
                {
                    condition = condition + " and Status=" + Convert.ToInt16(Status);
                }

                if (custId != null)
                {
                    condition = condition + " and CustomerID=" + GlobalID;
                }

                if (vndid != null)
                {
                    condition = condition + " and VendorID=" + GlobalID;
                }

                if (BankCode != null)
                {
                    condition = condition + " and BankAccountCode='" + GlobalID + "'";
                }

                if (expid != null)
                {
                    condition = condition + " and ExpenseID=" + GlobalID;
                }

                if (fromBoxid != null)
                {
                    condition = condition + " and FromCashBoxID=" + GlobalID;
                }

                if (FromDate != "")
                {
                    condition = condition + " and TrDate>='" + FromDate + "'";
                }

                if (Todate != "")
                {
                    condition = condition + " and TrDate<='" + Todate + "'";
                }

                try
                {
                    string query = s + condition + " ORDER BY [TrNo] ";
                    List<IQ_GetBoxReceiveList> AccTrReceipList = db.Database.SqlQuery<IQ_GetBoxReceiveList>(query).ToList(); 

                    return Ok(new BaseResponse(AccTrReceipList));
                }
                catch (Exception e)
                {

                }


            }
            return BadRequest(ModelState);
        }



        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetBoxReceiveListNew(int comp, int BenID, int TrType, int? Boxid, int? RecPayTypeId, string Status, string FromDate, string Todate, int? CashType, string UserCode, string Token, string FinYear, string MODULE_CODE, string BranchCode)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {


                if (Boxid == 0) { Boxid = null; }
                if (RecPayTypeId == 0) { RecPayTypeId = null; }
                if (CashType == -1) { CashType = null; }
                if (Status == "All") { Status = null; }

                string s = "select * from IQ_GetBoxReceiveList where TrType=" + TrType + " and CompCode= " + comp + "";
                string condition = "";

                if (CashType != null)
                {
                    condition = condition + " and CashType=" + CashType;
                }

                if (Boxid != null)
                {
                    condition = condition + " and CashBoxID=" + Boxid;
                }

                if (RecPayTypeId != null)
                {
                    condition = condition + " and RecPayTypeId=" + RecPayTypeId;
                }

                if (BenID != 0)
                {
                    if (RecPayTypeId == 1)
                    {
                        condition = condition + " and CustomerID =" + BenID;
                    }
                    else if (RecPayTypeId == 2)
                    {
                        condition = condition + " and VendorID =" + BenID;
                    }
                    else if (RecPayTypeId == 3)
                    {
                        condition = condition + " and BankAccountCode ='" + BenID + "'";
                    }
                    else if (RecPayTypeId == 4)
                    {
                        condition = condition + " and ExpenseID =" + BenID;
                    }
                    else if (RecPayTypeId == 5)
                    {
                        condition = condition + " and FromCashBoxID =" + BenID;
                    }
                }
                if (Status != null)
                {
                    condition = condition + " and Status=" + Convert.ToInt16(Status);
                }

                if (FromDate != "")
                {
                    condition = condition + " and TrDate>='" + FromDate + "'";
                }

                if (Todate != "")
                {
                    condition = condition + " and TrDate<='" + Todate + "'";
                }

                try
                {
                    string query = s + condition + " ORDER BY [TrNo] ";
                    List<IQ_GetBoxReceiveList> AccTrReceipList = db.Database.SqlQuery<IQ_GetBoxReceiveList>(query).ToList(); 

                    return Ok(new BaseResponse(AccTrReceipList));
                }
                catch (Exception e)
                {

                }


            }
            return BadRequest(ModelState);
        }


        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetById(int id, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                A_RecPay_Tr_ReceiptNote AccTrReceip = AccTrReceiptService.GetById(id);

                return Ok(new BaseResponse(AccTrReceip));
            }
            return BadRequest(ModelState);
        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult Insert([FromBody]A_RecPay_Tr_ReceiptNote Entity)
        {

            using (System.Data.Entity.DbContextTransaction dbTransaction = db.Database.BeginTransaction())
            {
                try
                { 
                    A_RecPay_Tr_ReceiptNote res = AccTrReceiptService.Insert(Entity);
                    string Typ;
                    if (res.TrType == 1)
                    {
                        Typ = "BoxReceipt";
                    }
                    else if (res.TrType == 2)
                    {
                        Typ = "BoxPayment";
                    }
                    else
                    {
                        Typ = "BoxTransfer";
                    }

                    ResponseResult result = Shared.TransactionProcess(int.Parse(res.CompCode.ToString()), int.Parse(res.BranchCode.ToString()), res.ReceiptID, Typ, "Add", db);
                    if (result.ResponseState == true)
                    {
                        dbTransaction.Commit();
                        res.TrNo = int.Parse(result.ResponseData.ToString());
                        LogUser.InsertPrint(db, Entity.Comp_Code.ToString(), Entity.Branch_Code, Entity.sec_FinYear, Entity.UserCode, Entity.ReceiptID, Entity.TrNo.ToString(), LogUser.UserLog.Insert, Entity.MODULE_CODE, true, null, null, null);

                        IQ_GetBoxReceiveList displayData = db.IQ_GetBoxReceiveList.Where(x => x.ReceiptID == res.ReceiptID).FirstOrDefault();
                        return Ok(new BaseResponse(displayData));
                    }
                    else
                    {
                        dbTransaction.Rollback();
                        LogUser.InsertPrint(db, Entity.Comp_Code.ToString(), Entity.Branch_Code, Entity.sec_FinYear, Entity.UserCode, Entity.ReceiptID, Entity.TrNo.ToString(), LogUser.UserLog.Insert, Entity.MODULE_CODE, false, result.ResponseMessage.ToString(), null, null);
                        return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, result.ResponseMessage));
                    }
                }
                catch (Exception ex)
                {
                    dbTransaction.Rollback();
                    LogUser.InsertPrint(db, Entity.Comp_Code.ToString(), Entity.Branch_Code, Entity.sec_FinYear, Entity.UserCode, Entity.ReceiptID, Entity.TrNo.ToString(), LogUser.UserLog.Insert, Entity.MODULE_CODE, false, ex.Message.ToString(), null, null);
                    return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                }
            }
        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult Open([FromBody] A_RecPay_Tr_ReceiptNote obj)
        {
            using (System.Data.Entity.DbContextTransaction dbTransaction = db.Database.BeginTransaction())
            {
                try
                {
                    db.Database.ExecuteSqlCommand("update A_RecPay_Tr_ReceiptNote set [Status] = 0 where ReceiptID = " + obj.ReceiptID + "");
                    A_RecPay_Tr_ReceiptNote res = obj;
                    //var res = AccTrReceiptService.Update(obj);
                    string Typ;
                    if (res.TrType == 1)
                    {
                        Typ = "BoxReceipt";
                    }
                    else if (res.TrType == 2)
                    {
                        Typ = "BoxPayment";
                    }
                    else
                    {
                        Typ = "BoxTransfer";
                    }

                    ResponseResult result = Shared.TransactionProcess(int.Parse(res.CompCode.ToString()), int.Parse(res.BranchCode.ToString()), res.ReceiptID, Typ, "Open", db);
                    if (result.ResponseState == true)
                    {
                        dbTransaction.Commit();
                        res.TrNo = int.Parse(result.ResponseData.ToString());
                        LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.ReceiptID, obj.TrNo.ToString(), LogUser.UserLog.Open, obj.MODULE_CODE, true, null, null, null);
                        IQ_GetBoxReceiveList displayData = db.IQ_GetBoxReceiveList.Where(x => x.ReceiptID == res.ReceiptID).FirstOrDefault();
                        return Ok(new BaseResponse(displayData));
                    }
                    else
                    {
                        dbTransaction.Rollback();
                        LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.ReceiptID, obj.TrNo.ToString(), LogUser.UserLog.Open, obj.MODULE_CODE, false, result.ResponseMessage.ToString(), null, null);
                        return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, result.ResponseMessage));
                    }

                }
                catch (Exception ex)
                {
                    dbTransaction.Rollback();
                    LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.ReceiptID, obj.TrNo.ToString(), LogUser.UserLog.Open, obj.MODULE_CODE, false, ex.Message.ToString(), null, null);
                    return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                }
            }
        }

        public IHttpActionResult Delete(int ID, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                try
                {
                    AccTrReceiptService.Delete(ID);
                    return Ok(new BaseResponse());
                }
                catch (Exception ex)
                {
                    return Ok(new BaseResponse(0, "Error"));
                }

            }
            else
            {
                return BadRequest(ModelState);
            }
        }
        [HttpPost, AllowAnonymous]
        public IHttpActionResult Update([FromBody]A_RecPay_Tr_ReceiptNote AccTrReceipt)
        {
            using (System.Data.Entity.DbContextTransaction dbTransaction = db.Database.BeginTransaction())
            {
                try
                {
                    A_RecPay_Tr_ReceiptNote res = AccTrReceiptService.Update(AccTrReceipt);
                    string Typ;
                    if (res.TrType == 1)
                    {
                        Typ = "BoxReceipt";
                    }
                    else if (res.TrType == 2)
                    {
                        Typ = "BoxPayment";
                    }
                    else
                    {
                        Typ = "BoxTransfer";
                    }

                    ResponseResult result = Shared.TransactionProcess(int.Parse(res.CompCode.ToString()), int.Parse(res.BranchCode.ToString()), res.ReceiptID, Typ, "Update", db);
                    if (result.ResponseState == true)
                    {
                        dbTransaction.Commit();
                        res.TrNo = int.Parse(result.ResponseData.ToString());
                        LogUser.InsertPrint(db, AccTrReceipt.Comp_Code.ToString(), AccTrReceipt.Branch_Code, AccTrReceipt.sec_FinYear, AccTrReceipt.UserCode, AccTrReceipt.ReceiptID, AccTrReceipt.TrNo.ToString(), LogUser.UserLog.Update, AccTrReceipt.MODULE_CODE, true, null, null, null);

                        IQ_GetBoxReceiveList displayData = db.IQ_GetBoxReceiveList.Where(x => x.ReceiptID == res.ReceiptID).FirstOrDefault();
                        return Ok(new BaseResponse(displayData));
                    }
                    else
                    {
                        dbTransaction.Rollback();
                        LogUser.InsertPrint(db, AccTrReceipt.Comp_Code.ToString(), AccTrReceipt.Branch_Code, AccTrReceipt.sec_FinYear, AccTrReceipt.UserCode, AccTrReceipt.ReceiptID, AccTrReceipt.TrNo.ToString(), LogUser.UserLog.Update, AccTrReceipt.MODULE_CODE, false, result.ResponseMessage.ToString(), null, null);

                        return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, result.ResponseMessage));
                    }

                }
                catch (Exception ex)
                {
                    dbTransaction.Rollback();
                    LogUser.InsertPrint(db, AccTrReceipt.Comp_Code.ToString(), AccTrReceipt.Branch_Code, AccTrReceipt.sec_FinYear, AccTrReceipt.UserCode, AccTrReceipt.ReceiptID, AccTrReceipt.TrNo.ToString(), LogUser.UserLog.Update, AccTrReceipt.MODULE_CODE, false, ex.Message.ToString(), null, null);

                    return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                }
            }

        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult TrNoFounBefore(int TrNo, int TrType, int compCode, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                List<A_RecPay_Tr_ReceiptNote> AccDefVendor = AccTrReceiptService.GetAll(x => x.CompCode == compCode && x.TrNo == TrNo && x.TrType == TrType);

                return Ok(new BaseResponse(AccDefVendor));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult TafkeetArab(int Currency, float Amount, string lang)
        {
            string s = "select * from G_Currency where CurrencyID=" + Currency;
            try
            {
                string query = s;
                G_Currency G_CurrencyList = db.Database.SqlQuery<G_Currency>(query).FirstOrDefault();
                if (lang == "ar")
                {

                    string Execut_Fun = " select [dbo].[BSE_TafkeetArab]('" + G_CurrencyList.CurNameA + "','" + G_CurrencyList.CurSmallNameA + "'," + Amount + ")";
                    string TafkeetArab = db.Database.SqlQuery<string>(Execut_Fun).FirstOrDefault();

                    return Ok(new BaseResponse(TafkeetArab));
                }
                else
                {
                    string Execut_Fun = " select [dbo].[BSE_TafkeetEng]('" + G_CurrencyList.CurNameE + "','" + G_CurrencyList.CurSmallNameE + "'," + Amount + ")";
                    string TafkeetArab = db.Database.SqlQuery<string>(Execut_Fun).FirstOrDefault();

                    return Ok(new BaseResponse(TafkeetArab));
                }

            }
            catch (Exception e)
            {

            }

            return BadRequest(ModelState);

        }

    }
}
