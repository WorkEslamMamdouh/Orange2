using Inv.API.Models;
using Inv.API.Tools;
using Inv.BLL.Services.Stk_TR_IssueToCC;
using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Inv.API.Controllers;
using Inv.API.Models.CustomModel; 
using Newtonsoft.Json;

namespace Inv.API.Controllers
{
    public class Stk_TR_IssueToCCController : BaseController
    {
        // GET: StKDefinition
        private readonly IStk_TR_IssueToCCService Stk_TR_IssueToCCService;
        private readonly G_USERSController UserControl;

        public Stk_TR_IssueToCCController(IStk_TR_IssueToCCService _Stk_TR_IssueToCCService, G_USERSController _Control)
        {
            this.Stk_TR_IssueToCCService = _Stk_TR_IssueToCCService;
            this.UserControl = _Control;
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAll(int CompCode, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var category = Stk_TR_IssueToCCService.GetAll(x => x.CompCode == CompCode).ToList();

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
        public IHttpActionResult GetFiltered(int CompCode,int BranchCode ,string FromDate ,string ToDate ,int TRType,int StoreID, string CC_CODE, int Status, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {  
                string cond = "";
                cond = "select * from IQ_GetStkIssueCC where CompCode = " + CompCode + " and BranchCode = " + BranchCode + " and TrDate >= '" + FromDate + "' and TrDate <= '" + ToDate + "'";
                if (StoreID != 0)
                {
                    cond = cond + " and StoreID = "+ StoreID + "";
                }
                if (TRType != 0 )
                {
                    cond = cond + " and TRType = " + TRType + "";
                }
                if (Status != 0 )
                {
                    cond = cond + " and Status = " + Status + "";
                }
                if (CC_CODE != "0" )
                {
                    cond = cond + " and CC_CODE = '" + CC_CODE + "'";
                } 
                 var StkIssueCC = db.Database.SqlQuery<IQ_GetStkIssueCC>(cond).ToList(); 
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
                
                var StkIssueCCDetail = db.Database.SqlQuery<IQ_GetStkIssueCCDetail>(Query).ToList();
                return Ok(new BaseResponse(StkIssueCCDetail));
            }
            return BadRequest(ModelState);
        }


        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetById(int id, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var TR_IssueToCC = Stk_TR_IssueToCCService.GetById(id);

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
                using (var dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        var IssueToCC = Stk_TR_IssueToCCService.Insert(Obj.I_Stk_TR_IssueToCC);

                        foreach (var item in Obj.I_Stk_TR_IssueToCCDetails)
                        {
                            item.IssueToCcID = IssueToCC.IssueToCcID;
                            Stk_TR_IssueToCCService.Insert(item);
                        }
                        int comp = Convert.ToInt16(IssueToCC.CompCode);
                        int Branch = Convert.ToInt16(IssueToCC.BranchCode);
                        var res = Shared.TransactionProcess(comp, Branch, IssueToCC.IssueToCcID, "PayOrder", "ADD", db);
                        if (res.ResponseState == true)
                        {
                            dbTransaction.Commit();
                            IssueToCC.Tr_No = int.Parse(res.ResponseData.ToString());
                            return Ok(new BaseResponse(IssueToCC));
                        }
                        else
                        {
                            dbTransaction.Rollback();
                            return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ""));
                        }
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
        public IHttpActionResult Update(string stringDetail)
        {
            Stk_TR_IssueToCCMasterDetails Obj = JsonConvert.DeserializeObject<Stk_TR_IssueToCCMasterDetails>(stringDetail);

            if (ModelState.IsValid && UserControl.CheckUser(Obj.Token, Obj.UserCode))
            {
                using (var dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        var IssueToCC = Stk_TR_IssueToCCService.Update(Obj.I_Stk_TR_IssueToCC);

                        var insertedObjects = Obj.I_Stk_TR_IssueToCCDetails.Where(x => x.StatusFlag == 'i').ToList();
                        var updatedObjects = Obj.I_Stk_TR_IssueToCCDetails.Where(x => x.StatusFlag == 'u').ToList();
                        var deletedObjects = Obj.I_Stk_TR_IssueToCCDetails.Where(x => x.StatusFlag == 'd').ToList();

                        foreach (var item in insertedObjects)
                        {
                            Stk_TR_IssueToCCService.Insert(item);
                        }
                        foreach (var item in updatedObjects)
                        {
                            Stk_TR_IssueToCCService.Update(item);
                        }
                        foreach (var item in deletedObjects)
                        {
                            Stk_TR_IssueToCCService.Delete(item.IssueToCcDetailID);
                        }
                        int comp = Convert.ToInt16(IssueToCC.CompCode);
                        int Branch = Convert.ToInt16(IssueToCC.BranchCode);
                        var res = Shared.TransactionProcess(comp, Branch, IssueToCC.IssueToCcID, "PayOrder", "Update", db);
                        if (res.ResponseState == true)
                        {
                            dbTransaction.Commit();
                            IssueToCC.Tr_No = int.Parse(res.ResponseData.ToString());
                            return Ok(new BaseResponse(IssueToCC));
                        }
                        else
                        {
                            dbTransaction.Rollback();
                            return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ""));
                        } 
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
        public IHttpActionResult GetAllIssueTypes(int CompCode, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var category = Stk_TR_IssueToCCService.GetIssueTypes(x => x.CompCode == CompCode).ToList();

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

            if (ModelState.IsValid && UserControl.CheckUser(Obj[0].Token, Obj[0].UserCode))
            {
                try
                { 
                    var insertedObjects = Obj.Where(x => x.StatusFlag == 'i').ToList();
                    var updatedObjects = Obj.Where(x => x.StatusFlag == 'u').ToList();
                    var deletedObjects = Obj.Where(x => x.StatusFlag == 'd').ToList();

                    foreach (var item in insertedObjects)
                    {
                        Stk_TR_IssueToCCService.InsertIssueTypes(item);
                    }
                    foreach (var item in updatedObjects)
                    {
                        Stk_TR_IssueToCCService.UpdateIssueTypes(item);
                    }
                    foreach (var item in deletedObjects)
                    {
                        Stk_TR_IssueToCCService.DeleteIssueTypes(item.IssueTypeID);
                    }
                }
                catch (Exception ex)
                {
                    return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                }
            }
            return BadRequest(ModelState);
        }



    }
}