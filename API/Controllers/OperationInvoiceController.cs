using Inv.API.Models;
using Inv.API.Tools;
using Inv.BLL.Services.PurTrReceive;
using Inv.BLL.Services.PurInvoiceItems;
using Inv.BLL.Services.PurDefCharges;
using Inv.BLL.Services.PurTRCharges;
using Inv.BLL.Services.Processes;
using Inv.BLL.Services.operationItemsSum;
using Inv.BLL.Services.OperationItems;
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
    public class OperationInvoiceController : BaseController
    {
        private readonly IOperationItems OperationItems;
        private readonly IProcesses Processes;
        private readonly IPurTrReceiveService PurTrReceiveService;
        private readonly G_USERSController UserControl;
        private readonly IPurTRReceiveItemsService PurTRReceiveItemsService;
        private readonly IPurDefChargesService PurDefChargesService;
        private readonly IPurTRChargesService PurTRChargesService;
        private readonly ISlsInvoiceItemsService SlsInvoiceItemsService;
        private readonly ISlsTRInvoiceService SlsTrSalesService;

        public partial class IQ_GetOperationItemInfo_New
        {

            public int ItemID { get; set; }
            public string Itm_DescA { get; set; }
            public string Itm_DescE { get; set; }
            public int ItemFamilyID { get; set; }
            public Nullable<decimal> Min_SalesPrice { get; set; }
            public Nullable<decimal> OnhandQty { get; set; }
            public Nullable<decimal> Est_SalesPrice { get; set; }

            public string Family_DescA { get; set; }
            public string Family_DescE { get; set; }


        }
        public partial class I_ItemFamily_New
        {
            public int ItemFamilyID { get; set; }
            public string DescA { get; set; }
            public string DescL { get; set; }
            public Nullable<int> CatID { get; set; }

        }

        public OperationInvoiceController(IPurTrReceiveService _IPurTrReceiveService, G_USERSController _Control, IPurTRReceiveItemsService _IPurTRReceiveItemsService, IPurDefChargesService _IPurDefChargesService, IPurTRChargesService _IPurTRChargesService, IProcesses _IProcesses, IOperationItems _IOperationItems, ISlsTRInvoiceService _ISlsTrSalesService, ISlsInvoiceItemsService _ISlsInvoiceItemsService)
        {
            this.PurTrReceiveService = _IPurTrReceiveService;
            this.UserControl = _Control;
            this.PurTRReceiveItemsService = _IPurTRReceiveItemsService;
            this.PurDefChargesService = _IPurDefChargesService;
            this.PurTRChargesService = _IPurTRChargesService;
            this.Processes = _IProcesses;
            this.OperationItems = _IOperationItems;
            this.SlsTrSalesService = _ISlsTrSalesService;
            this.SlsInvoiceItemsService = _ISlsInvoiceItemsService;
        }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllSalesmanOperations(int salesmanId, bool opstatus, int CompCode, int BranchCode, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                List<IQ_GetOperation> ItemStoreInfoList = new List<IQ_GetOperation>();
                if (opstatus == true)
                    ItemStoreInfoList = db.IQ_GetOperation.Where(x => x.CompCode == CompCode && x.BranchCode == BranchCode && x.SalesmanId == salesmanId && x.Status == 2).ToList();
                else
                    ItemStoreInfoList = db.IQ_GetOperation.Where(x => x.CompCode == CompCode && x.BranchCode == BranchCode && x.SalesmanId == salesmanId && x.Status == 3).ToList();

                return Ok(new BaseResponse(ItemStoreInfoList));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllbyID(int OperationID, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                List<IQ_GetOperation> ItemStoreInfoList = new List<IQ_GetOperation>();
                ItemStoreInfoList = db.IQ_GetOperation.Where(x => x.OperationID == OperationID).ToList();
                return Ok(new BaseResponse(ItemStoreInfoList));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllOperations(int CompCode, int BranchCode, bool opstatus, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                List<IQ_GetOperation> ItemStoreInfoList = new List<IQ_GetOperation>();

                if (opstatus == true)
                    ItemStoreInfoList = db.IQ_GetOperation.Where(x => x.CompCode == CompCode && x.BranchCode == BranchCode && x.Status == 2).ToList();
                else
                    ItemStoreInfoList = db.IQ_GetOperation.Where(x => x.CompCode == CompCode && x.BranchCode == BranchCode && x.Status == 3).ToList();
                return Ok(new BaseResponse(ItemStoreInfoList));
            }
            return BadRequest(ModelState);
        }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllOperationswithoutStatus(int CompCode, int BranchCode, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                List<IQ_GetOperation> ItemStoreInfoList = new List<IQ_GetOperation>();

                ItemStoreInfoList = db.IQ_GetOperation.Where(x => x.CompCode == CompCode && x.BranchCode == BranchCode && x.Status > 1).ToList();
                return Ok(new BaseResponse(ItemStoreInfoList));
            }
            return BadRequest(ModelState);
        }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetItemByFamilyIdOrdered(int familyid, int OperationID, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {

                string SQL = "Select ItemID,  Itm_DescA, Itm_DescE,  OnhandQty, Min_SalesPrice, Est_SalesPrice from   IQ_GetOperationItemInfo  where OnhandQty>0 and OperationID = " + OperationID + "and ItemFamilyID= " + familyid + " order by ItemCode";
                var GetItemStore = db.Database.SqlQuery<IQ_GetOperationItemInfo_New>(SQL).ToList();

                return Ok(new BaseResponse(GetItemStore));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetItemOrderedWithoutFamilyID(int OperationID, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {

                string SQL = "Select ItemID,  Itm_DescA, Itm_DescE, OnhandQty, Min_SalesPrice, Est_SalesPrice,ItemFamilyID from   IQ_GetOperationItemInfo  where OnhandQty>0 and OperationID = " + OperationID + " order by ItemCode";
                var GetItemStore = db.Database.SqlQuery<IQ_GetOperationItemInfo_New>(SQL).ToList();

                return Ok(new BaseResponse(GetItemStore));
            }
            return BadRequest(ModelState);
        }


        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetItemOrderedWithoutFamilyIDNew(int OperationID, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {

                string SQL = "Select ItemID,  Itm_DescA, Itm_DescE, OnhandQty, Min_SalesPrice, Est_SalesPrice,ItemFamilyID from   IQ_GetOperationItemInfo  where   OperationID = " + OperationID + " order by ItemCode";
                var GetItemStore = db.Database.SqlQuery<IQ_GetOperationItemInfo_New>(SQL).ToList();

                return Ok(new BaseResponse(GetItemStore));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllOrdered(int operationId, int CompCode, string UserCode, string Token)
        {
            try
            {

                if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
                {
                    string SQL = "Select  ItemFamilyID, Family_DescA, Family_DescE,CatID  from IQ_GetOperationItemInfo  where CompCode= " + CompCode + "and OperationID = " + operationId + " order by catid, FamilyCode";
                    var ItemFamilyList = db.Database.SqlQuery<IQ_GetOperationItemInfo_New>(SQL).ToList();

                    return Ok(new BaseResponse(ItemFamilyList));
                }
                return BadRequest(ModelState);
            }
            catch (Exception ex)
            {

                return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
            }
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllSlsInvoiceReviewStatistic(int CompCode, int BranchCode, int? OperationID,int? SalesPerson, int IsCash, string StartDate, string EndDate, int Status, int? CustId, int? SalesMan, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                string s = "select * from IQ_GetSlsInvoiceStatistic where TrType = 0 and CompCode = " + CompCode + "and BranchCode =" + BranchCode + " and SlsInvSrc = 2 and TrDate >=' " + StartDate + "' and TrDate <= ' " + EndDate + " ' ";
                string condition = "";
                if (CustId != 0 && CustId != null)
                    condition = condition + " and CustomerId =" + CustId;

                if (OperationID != 0 && OperationID != null)
                    condition = condition + " and OperationId =" + OperationID;
                if (SalesPerson != 0 && SalesPerson != null)
                    condition = condition + " and SalesPersonId =" + SalesPerson;// and Status = " + Status   
                if (SalesMan != 0 && SalesMan != null)
                    condition = condition + " and SalesmanId =" + SalesMan;// and Status = " + Status
                if (Status == 2)
                    condition = condition + "";
                else
                {
                    condition = condition + " and Status = " + Status;
                }
                /////////////' and IsCash = '" + IsCash+"'"  operationStatus
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
                var res = db.Database.SqlQuery<IQ_GetSlsInvoiceStatistic>(query).ToList();
                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult InsertProcessInvoiceMasterDetail([FromBody]SlsInvoiceMasterDetails obj)
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
                        //var QrCode = SystemToolsController.GenerateQRCode(compObj.NameA, branchObj.GroupVatNo, obj.I_Sls_TR_Invoice.TrDate.ToString(), obj.I_Sls_TR_Invoice.NetAfterVat.ToString(), obj.I_Sls_TR_Invoice.VatAmount.ToString());
                        //obj.I_Sls_TR_Invoice.QRCode = QrCode;
                        //var x = QrCode.Length;
                        ////////////
                        ///

                        var tstamp = DateTime.Now;

                        if (obj.I_Sls_TR_Invoice.Status == 1)
                        {


                            QrModel QrRec = new QrModel();
                            QrRec.CompName = obj.CompName;
                            QrRec.VatNo = obj.VatNo;
                            QrRec.Total = obj.I_Sls_TR_Invoice.TotalAmount;
                            QrRec.Vat = obj.I_Sls_TR_Invoice.VatAmount;
                            //QrRec.TrDate = tstamp;
                            QrRec.TrDate = obj.I_Sls_TR_Invoice.TrDate;




                            string QrCode = QRGeneratorController.QrGenerator(QrRec);

                            string st = SystemToolsController.GenerateGuid();
                            obj.I_Sls_TR_Invoice.DocUUID = st;
                            obj.I_Sls_TR_Invoice.QRCode = QrCode;
                            //obj.I_Sls_TR_Invoice.TrDate = tstamp.Date;
                        }
                        obj.I_Sls_TR_Invoice.CreatedAt = tstamp;
                        obj.I_Sls_TR_Invoice.TrTime = tstamp.TimeOfDay;

                        var Sls_TR_Invoice = SlsTrSalesService.Insert(obj.I_Sls_TR_Invoice);
                        for (int i = 0; i < obj.I_Sls_TR_InvoiceItems.Count; i++)
                        {
                            obj.I_Sls_TR_InvoiceItems[i].InvoiceID = Sls_TR_Invoice.InvoiceID;
                        }
                        SlsInvoiceItemsService.InsertLst(obj.I_Sls_TR_InvoiceItems);
                        // call process trans 

                        ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(obj.I_Sls_TR_Invoice.CompCode), Convert.ToInt32(obj.I_Sls_TR_Invoice.BranchCode), Sls_TR_Invoice.InvoiceID, "PrcInvoice", "Add", db);
                        if (res.ResponseState == true)
                        {
                            obj.I_Sls_TR_Invoice.TrNo = int.Parse(res.ResponseData.ToString());
                            dbTransaction.Commit();
                            return Ok(new BaseResponse(obj.I_Sls_TR_Invoice));
                        }
                        else
                        {
                            dbTransaction.Rollback();
                            return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, res.ResponseMessage));
                        }
                        //////////
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
        public IHttpActionResult updateProcessInvoiceMasterDetail([FromBody]SlsInvoiceMasterDetails updatedObj)
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

                        var tstamp = DateTime.Now;

                        if (updatedObj.I_Sls_TR_Invoice.Status == 1)
                        {


                            QrModel QrRec = new QrModel();
                            QrRec.CompName = updatedObj.CompName;
                            QrRec.VatNo = updatedObj.VatNo;
                            QrRec.Total = updatedObj.I_Sls_TR_Invoice.TotalAmount;
                            QrRec.Vat = updatedObj.I_Sls_TR_Invoice.VatAmount;
                            //QrRec.TrDate = tstamp;
                            QrRec.TrDate = updatedObj.I_Sls_TR_Invoice.TrDate;

                             
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

                        ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(updatedObj.I_Sls_TR_Invoice.CompCode), Convert.ToInt32(updatedObj.I_Sls_TR_Invoice.BranchCode), Sls_TR_Invoice.InvoiceID, "PrcInvoice", "Update", db);
                        if (res.ResponseState == true)
                        {
                            updatedObj.I_Sls_TR_Invoice.TrNo = int.Parse(res.ResponseData.ToString());
                            dbTransaction.Commit();
                            return Ok(new BaseResponse(updatedObj.I_Sls_TR_Invoice));
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
        public IHttpActionResult Open([FromBody] SlsInvoiceMasterDetails updatedObj)
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
                        ResponseResult result = Shared.TransactionProcess(int.Parse(Sls_TR_Invoice.CompCode.ToString()), int.Parse(Sls_TR_Invoice.BranchCode.ToString()), Sls_TR_Invoice.InvoiceID, "PrcInvoice", "Open", db);
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

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllReturnProcessInvoiceStatistic(int CompCode, int BranchCode, int? operationId, string StartDate, string EndDate, int Status, int FreeReturn, int? returnType, int? CustId, string SalesMan, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                //trtype=2
                string s = "select * from IQ_GetSlsInvoiceStatistic where CompCode = " + CompCode + "and BranchCode = " + BranchCode + " and TrType = 1 and SlsInvSrc = 2 and TrDate >=' " + StartDate + "' and TrDate <= ' " + EndDate + "'";
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

                if (operationId != 0 && operationId != null)
                    condition = condition + " and OperationId =" + operationId;

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
                var res = db.Database.SqlQuery<IQ_GetSlsInvoiceStatistic>(query).ToList();
                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }
        /////////// Edittttt
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllOperationReturnStatistic(int CompCode, int BranchCode, int? Operationid,int? SalesPerson, string StartDate, string EndDate, int Status, int? returnType, int? CustId, int? SalesMan, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                //trtype=2
                string s = "select * from IQ_GetSlsInvoiceStatistic where CompCode = " + CompCode + " and BranchCode = " + BranchCode + " and SlsInvSrc = 2  and TrType = 1 and TrDate >=' " + StartDate + "' and TrDate <= ' " + EndDate + "'";
                string condition = "";
                if (CustId != 0 && CustId != null)
                    condition = condition + " and CustomerId =" + CustId;

                if (SalesPerson != 0 && SalesPerson != null)
                    condition = condition + " and SalesPersonId =" + SalesPerson;// and Status = " + Status   

                if (SalesMan != 0 && SalesMan != null)
                    condition = condition + " and SalesmanId =" + SalesMan;

                if (Operationid != 0 && Operationid != null)
                    condition = condition + " and Operationid ='" + Operationid + "'";

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


                string query = s + condition;
                var res = db.Database.SqlQuery<IQ_GetSlsInvoiceStatistic>(query).ToList();
                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult InsertProcessReturnMasterDetail([FromBody]SlsInvoiceMasterDetails obj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(obj.Token, obj.UserCode))
            {
                using (var dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {


                        var tstamp = DateTime.Now;

                        if (obj.I_Sls_TR_Invoice.Status == 1)
                        {


                            QrModel QrRec = new QrModel();
                            QrRec.CompName = obj.CompName;
                            QrRec.VatNo = obj.VatNo;
                            QrRec.Total = obj.I_Sls_TR_Invoice.TotalAmount;
                            QrRec.Vat = obj.I_Sls_TR_Invoice.VatAmount;
                            //QrRec.TrDate = tstamp;
                            QrRec.TrDate = obj.I_Sls_TR_Invoice.TrDate;




                            string QrCode = QRGeneratorController.QrGenerator(QrRec);

                            string st = SystemToolsController.GenerateGuid();
                            obj.I_Sls_TR_Invoice.DocUUID = st;
                            obj.I_Sls_TR_Invoice.QRCode = QrCode;
                            //obj.I_Sls_TR_Invoice.TrDate = tstamp.Date;
                        }
                        obj.I_Sls_TR_Invoice.CreatedAt = tstamp;
                        obj.I_Sls_TR_Invoice.TrTime = tstamp.TimeOfDay;





                        var Sls_TR_Invoice = SlsTrSalesService.Insert(obj.I_Sls_TR_Invoice);

                        //var tm = DateTime.Now.ToString("HH:mm:ss");
                        //obj.I_Sls_TR_Invoice.TrTime = TimeSpan.Parse(tm);
                        for (int i = 0; i < obj.I_Sls_TR_InvoiceItems.Count; i++)
                        {
                            obj.I_Sls_TR_InvoiceItems[i].InvoiceID = Sls_TR_Invoice.InvoiceID;
                        }
                        SlsInvoiceItemsService.InsertLst(obj.I_Sls_TR_InvoiceItems);
                        // call process trans 

                        ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(obj.I_Sls_TR_Invoice.CompCode), Convert.ToInt32(obj.I_Sls_TR_Invoice.BranchCode), Sls_TR_Invoice.InvoiceID, "PrcReturn", "Add", db);
                        if (res.ResponseState == true)
                        {
                            obj.I_Sls_TR_Invoice.TrNo = int.Parse(res.ResponseData.ToString());
                            dbTransaction.Commit();
                            return Ok(new BaseResponse(obj.I_Sls_TR_Invoice));
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

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllUnApprovedSlsReturnListByInvoiceID(int invoiceID, int CompCode, string UserCode, string Token)
        {
            if (ModelState.IsValid)
            {
                var res = db.IQ_GetSlsInvoiceList.Where(x => x.CompCode == CompCode && x.RefTrID == invoiceID && x.Status == 0).ToList();
                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }


        [HttpPost, AllowAnonymous]
        public IHttpActionResult updateProcessReturnMasterDetail([FromBody]SlsInvoiceMasterDetails updatedObj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(updatedObj.Token, updatedObj.UserCode))
            {
                using (var dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {



                        var tstamp = DateTime.Now;

                        if (updatedObj.I_Sls_TR_Invoice.Status == 1)
                        {


                            QrModel QrRec = new QrModel();
                            QrRec.CompName = updatedObj.CompName;
                            QrRec.VatNo = updatedObj.VatNo;
                            QrRec.Total = updatedObj.I_Sls_TR_Invoice.TotalAmount;
                            QrRec.Vat = updatedObj.I_Sls_TR_Invoice.VatAmount;
                            //QrRec.TrDate = tstamp;
                            QrRec.TrDate = updatedObj.I_Sls_TR_Invoice.TrDate;


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

                        ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(updatedObj.I_Sls_TR_Invoice.CompCode), Convert.ToInt32(updatedObj.I_Sls_TR_Invoice.BranchCode), Sls_TR_Invoice.InvoiceID, "PrcReturn", "Update", db);
                        if (res.ResponseState == true)
                        {
                            //updatedObj.I_Sls_TR_Invoice.TrNo = int.Parse(res.ResponseData.ToString());
                            dbTransaction.Commit();
                            return Ok(new BaseResponse(updatedObj.I_Sls_TR_Invoice));
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
        public IHttpActionResult OpenProcessReturn([FromBody] SlsInvoiceMasterDetails updatedObj)
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
                        ResponseResult result = Shared.TransactionProcess(int.Parse(Sls_TR_Invoice.CompCode.ToString()), int.Parse(Sls_TR_Invoice.BranchCode.ToString()), Sls_TR_Invoice.InvoiceID, "PrcReturn", "Open", db);
                        if (result.ResponseState == true)
                        {
                            dbTransaction.Commit();
                            // Sls_TR_Invoice.TrNo = int.Parse(result.ResponseData.ToString());
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
    }
}
