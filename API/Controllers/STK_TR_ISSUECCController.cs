using Inv.API.Models;
using Inv.API.Models.CustomModel;
using Inv.API.Tools;
using Inv.BLL.Services.Stk_TR_IssueToCC;
using Inv.DAL.Domain;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web.Http;

namespace Inv.API.Controllers
{
    public class Stk_TR_IssueToCCController : BaseController
    {
        // GET: StKDefinition
        private readonly IStk_TR_IssueToCCService Stk_TR_IssueToCCService;
        private readonly G_USERSController UserControl;

        public Stk_TR_IssueToCCController(IStk_TR_IssueToCCService _Stk_TR_IssueToCCService, G_USERSController _Control)
        {
            Stk_TR_IssueToCCService = _Stk_TR_IssueToCCService;
            UserControl = _Control;
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAll(int CompCode, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                List<I_Stk_TR_IssueToCC> category = Stk_TR_IssueToCCService.GetAll(x => x.CompCode == CompCode).ToList();

                return Ok(new BaseResponse(category));
            }
            return BadRequest(ModelState);
        }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAll(int CompCode, int TRType, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                List<I_Stk_TR_IssueToCC> StkIssueCC = new List<I_Stk_TR_IssueToCC>();

                if (TRType == 0)
                {
                    StkIssueCC = Stk_TR_IssueToCCService.GetAll(x => x.CompCode == CompCode).ToList();
                }
                else
                {
                    StkIssueCC = Stk_TR_IssueToCCService.GetAll(x => x.CompCode == CompCode && x.TRType == TRType).ToList();
                }
                return Ok(new BaseResponse(StkIssueCC));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetFiltered(int CompCode, int BranchCode, string FromDate, string ToDate, int TRType, int StoreID, string CC_CODE, int Status, string UserCode, string Token, string FinYear, string MODULE_CODE)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                string cond = "";
                cond = "select * from IQ_GetStkIssueCC where CompCode = " + CompCode + " and BranchCode = " + BranchCode + " and TrDate >= '" + FromDate + "' and TrDate <= '" + ToDate + "'";
                if (StoreID != 0)
                {
                    cond = cond + " and StoreID = " + StoreID + "";
                }
                if (TRType != 0)
                {
                    cond = cond + " and TRType = " + TRType + "";
                }
                if (Status != 0)
                {
                    cond = cond + " and Status = " + Status + "";
                }
                if (CC_CODE != "0")
                {
                    cond = cond + " and CC_CODE = '" + CC_CODE + "'";
                }
                List<IQ_GetStkIssueCC> StkIssueCC = db.Database.SqlQuery<IQ_GetStkIssueCC>(cond).ToList();
                

                return Ok(new BaseResponse(StkIssueCC));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetDetailByID(int IssueToCcID, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                string Query = "select * from IQ_GetStkIssueCCDetail where IssueToCcID = " + IssueToCcID + "";

                List<IQ_GetStkIssueCCDetail> StkIssueCCDetail = db.Database.SqlQuery<IQ_GetStkIssueCCDetail>(Query).ToList();
                return Ok(new BaseResponse(StkIssueCCDetail));
            }
            return BadRequest(ModelState);
        }


        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetById(int id, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                I_Stk_TR_IssueToCC TR_IssueToCC = Stk_TR_IssueToCCService.GetById(id);

                return Ok(new BaseResponse(TR_IssueToCC));
            }
            return BadRequest(ModelState);
        }


        [HttpGet, AllowAnonymous]
        public IHttpActionResult Insert(string stringDetail)
        {
            Stk_TR_IssueToCCMasterDetails Obj = JsonConvert.DeserializeObject<Stk_TR_IssueToCCMasterDetails>(stringDetail);

            if (ModelState.IsValid && UserControl.CheckUser(Obj.Token, Obj.UserCode))
            {
                using (System.Data.Entity.DbContextTransaction dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        I_Stk_TR_IssueToCC IssueToCC = Stk_TR_IssueToCCService.Insert(Obj.I_Stk_TR_IssueToCC);

                        foreach (I_Stk_TR_IssueToCCDetails item in Obj.I_Stk_TR_IssueToCCDetails)
                        {
                            item.IssueToCcID = IssueToCC.IssueToCcID;
                            Stk_TR_IssueToCCService.Insert(item);
                        }
                        int comp = Convert.ToInt16(IssueToCC.CompCode);
                        int Branch = Convert.ToInt16(IssueToCC.BranchCode);
                        ResponseResult res = Shared.TransactionProcess(comp, Branch, IssueToCC.IssueToCcID, "PayOrder", "ADD", db);
                        if (res.ResponseState == true)
                        {
                            dbTransaction.Commit();
                            IssueToCC.Tr_No = int.Parse(res.ResponseData.ToString());
                            LogUser.InsertPrint(db, Obj.Comp_Code.ToString(), Obj.Branch_Code, Obj.sec_FinYear, Obj.UserCode, Obj.I_Stk_TR_IssueToCC.IssueToCcID,Obj.I_Stk_TR_IssueToCC.Tr_No.ToString(), LogUser.UserLog.Insert, Obj.MODULE_CODE, true, null, null, null);

                            return Ok(new BaseResponse(IssueToCC));
                        }
                        else
                        {
                            dbTransaction.Rollback();
                            LogUser.InsertPrint(db, Obj.Comp_Code.ToString(), Obj.Branch_Code, Obj.sec_FinYear, Obj.UserCode, Obj.I_Stk_TR_IssueToCC.IssueToCcID, Obj.I_Stk_TR_IssueToCC.Tr_No.ToString(), LogUser.UserLog.Insert, Obj.MODULE_CODE, false, res.ResponseMessage.ToString(), null, null);

                            return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ""));
                        }
                    }
                    catch (Exception ex)
                    {
                        LogUser.InsertPrint(db, Obj.Comp_Code.ToString(), Obj.Branch_Code, Obj.sec_FinYear, Obj.UserCode, Obj.I_Stk_TR_IssueToCC.IssueToCcID, Obj.I_Stk_TR_IssueToCC.Tr_No.ToString(), LogUser.UserLog.Update, Obj.MODULE_CODE, false, ex.Message.ToString(), null, null);

                        return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                    }
                }
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult Update(string stringDetail)
        {
            Stk_TR_IssueToCCMasterDetails Obj = JsonConvert.DeserializeObject<Stk_TR_IssueToCCMasterDetails>(stringDetail);

            if (ModelState.IsValid && UserControl.CheckUser(Obj.Token, Obj.UserCode))
            {
                using (System.Data.Entity.DbContextTransaction dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        I_Stk_TR_IssueToCC IssueToCC = Stk_TR_IssueToCCService.Update(Obj.I_Stk_TR_IssueToCC);

                        List<I_Stk_TR_IssueToCCDetails> insertedObjects = Obj.I_Stk_TR_IssueToCCDetails.Where(x => x.StatusFlag == 'i').ToList();
                        List<I_Stk_TR_IssueToCCDetails> updatedObjects = Obj.I_Stk_TR_IssueToCCDetails.Where(x => x.StatusFlag == 'u').ToList();
                        List<I_Stk_TR_IssueToCCDetails> deletedObjects = Obj.I_Stk_TR_IssueToCCDetails.Where(x => x.StatusFlag == 'd').ToList();

                        foreach (I_Stk_TR_IssueToCCDetails item in insertedObjects)
                        {
                            Stk_TR_IssueToCCService.Insert(item);
                        }
                        foreach (I_Stk_TR_IssueToCCDetails item in updatedObjects)
                        {
                            Stk_TR_IssueToCCService.Update(item);
                        }
                        foreach (I_Stk_TR_IssueToCCDetails item in deletedObjects)
                        {
                            Stk_TR_IssueToCCService.Delete(item.IssueToCcDetailID);
                        }
                        int comp = Convert.ToInt16(IssueToCC.CompCode);
                        int Branch = Convert.ToInt16(IssueToCC.BranchCode);
                        ResponseResult res = Shared.TransactionProcess(comp, Branch, IssueToCC.IssueToCcID, "PayOrder", "Update", db);
                        if (res.ResponseState == true)
                        {
                            dbTransaction.Commit();
                            LogUser.InsertPrint(db, Obj.Comp_Code.ToString(), Obj.Branch_Code, Obj.sec_FinYear, Obj.UserCode, Obj.I_Stk_TR_IssueToCC.IssueToCcID, Obj.I_Stk_TR_IssueToCC.Tr_No.ToString(), LogUser.UserLog.Update, Obj.MODULE_CODE, true, null, null, null);
                          
                            IssueToCC.Tr_No = int.Parse(res.ResponseData.ToString());
                            return Ok(new BaseResponse(IssueToCC));
                        }
                        else
                        {
                            dbTransaction.Rollback();
                            LogUser.InsertPrint(db, Obj.Comp_Code.ToString(), Obj.Branch_Code, Obj.sec_FinYear, Obj.UserCode, Obj.I_Stk_TR_IssueToCC.IssueToCcID, Obj.I_Stk_TR_IssueToCC.Tr_No.ToString(), LogUser.UserLog.Update, Obj.MODULE_CODE, false, res.ResponseMessage.ToString(), null, null);

                            return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ""));
                        }
                    }
                    catch (Exception ex)
                    {
                        LogUser.InsertPrint(db, Obj.Comp_Code.ToString(), Obj.Branch_Code, Obj.sec_FinYear, Obj.UserCode, Obj.I_Stk_TR_IssueToCC.IssueToCcID, Obj.I_Stk_TR_IssueToCC.Tr_No.ToString(), LogUser.UserLog.Update, Obj.MODULE_CODE, false, ex.Message.ToString(), null, null);

                        return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                    }
                }
            }
            return BadRequest(ModelState);
        }





        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllIssueTypes(int CompCode, string UserCode, string Token, string Branch_Code, string FinYear, string MODULE_CODE)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                List<I_D_IssueType> category = Stk_TR_IssueToCCService.GetIssueTypes(x => x.CompCode == CompCode).ToList(); 

                return Ok(new BaseResponse(category));
            }
            return BadRequest(ModelState);
        }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetIssueTypes(int CompCode, int TRType, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                List<I_D_IssueType> category = new List<I_D_IssueType>();


                category = Stk_TR_IssueToCCService.GetIssueTypes(x => x.CompCode == CompCode).ToList();

                return Ok(new BaseResponse(category));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult UpdateLISTIssueTypes(string stringDetail)
        {
            List<I_D_IssueType> Obj = JsonConvert.DeserializeObject<List<I_D_IssueType>>(stringDetail);


            try
            {
                List<I_D_IssueType> insertedObjects = Obj.Where(x => x.StatusFlag == 'i').ToList();
                List<I_D_IssueType> updatedObjects = Obj.Where(x => x.StatusFlag == 'u').ToList();
                List<I_D_IssueType> deletedObjects = Obj.Where(x => x.StatusFlag == 'd').ToList();

                foreach (I_D_IssueType item in insertedObjects)
                {
                    I_D_IssueType Obj2 = new I_D_IssueType(); 
                    Obj2 = Stk_TR_IssueToCCService.InsertIssueTypes(item);
                    
                }
                foreach (I_D_IssueType item in updatedObjects)
                {
                    Stk_TR_IssueToCCService.UpdateIssueTypes(item);
                   
                }
                foreach (I_D_IssueType item in deletedObjects)
                {
                    Stk_TR_IssueToCCService.DeleteIssueTypes(item.IssueTypeID);
                   
                }


                return Ok(new BaseResponse(100));
            }
            catch (Exception ex)
            {
                
                return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));

            }

        }



    }
}