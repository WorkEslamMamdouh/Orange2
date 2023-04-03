using Inv.API.Models;
using Inv.API.Tools;
using Inv.BLL.Services.GLDefAccount;
using Inv.BLL.Services.GLDefAccount_year;
using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Inv.API.Controllers;
using Inv.API.Models.CustomModel;

namespace Inv.API.Controllers
{
    public class GLDefAccountController : BaseController
    {
        private readonly IGLDefAccountService GLDefAccountService;
        private readonly IGLDefAccount_yearService GLDefAccount_yearService;
        private readonly G_USERSController UserControl;

        public GLDefAccountController(IGLDefAccountService _IGLDefAccountService, IGLDefAccount_yearService _IGLDefAccount_yearService , G_USERSController _Control)
        {
            this.GLDefAccountService = _IGLDefAccountService;
            this.GLDefAccount_yearService = _IGLDefAccount_yearService;
            this.UserControl = _Control;
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAll(int CompCode, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var AccountList = GLDefAccountService.GetAll(x => x.COMP_CODE == CompCode).ToList();

                return Ok(new BaseResponse(AccountList));
            }
            return BadRequest(ModelState);
        }

        public IHttpActionResult GetAll_store(int CompCode, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var AccountList = GLDefAccountService.GetAll(x => x.COMP_CODE == CompCode&&x.ACC_TYPE==5).ToList();

                return Ok(new BaseResponse(AccountList));
            }
            return BadRequest(ModelState);
        }
        public IHttpActionResult GetAllfix(int CompCode, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                string s = "select * from A_ACCOUNT where COMP_CODE = " + CompCode + " and DETAIL =" + 1 + " ";

                string query = s;
                var res = db.Database.SqlQuery<A_ACCOUNT>(query).ToList();
                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
            
        }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAll_AQ_GetAccount(int CompCode,int FIN_YEAR, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                string s = "select * from AQ_GetAccount where COMP_CODE = " + CompCode + " and FIN_YEAR ="+ FIN_YEAR + " ";

                string query = s;
                var res = db.Database.SqlQuery<AQ_GetAccount>(query).ToList();
                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAll_AQGetAccount(int CompCode, int FIN_YEAR, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                string query = "select * from AQ_GetAccount where COMP_CODE = " + CompCode + " and FIN_YEAR =" + FIN_YEAR + " and DETAIL = 1 ";

                
                var res = db.Database.SqlQuery<AQ_GetAccount>(query).ToList();
                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetById(int id, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var AccountDef = GLDefAccountService.GetById(id);

                return Ok(new BaseResponse(AccountDef));
            }
            return BadRequest(ModelState);
        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult Updatelist(List<A_ACCOUNT> AccountList)
        {

            if (ModelState.IsValid && UserControl.CheckUser(AccountList[0].Token, AccountList[0].UserCode))
            {
                using (var dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        Boolean AllSuccess = true;
                        var insertedRecords = AccountList.Where(x => x.StatusFlag == 'i');
                        var updatedRecords = AccountList.Where(x => x.StatusFlag == 'u');
                        var deletedRecords = AccountList.Where(x => x.StatusFlag == 'd');
                        ResponseResult res = new ResponseResult();
                        //loop insered 
                        foreach (var item in insertedRecords)
                        {
                            item.CREATED_AT = DateTime.Now;
                            var InsertedRec = GLDefAccountService.Insert(item);
                            int br = 1; // item has no branch 
                            res = Shared.TransactionProcess(Convert.ToInt32(InsertedRec.COMP_CODE), br,int.Parse( InsertedRec.ACC_CODE), "Acc", "ADD",db);
                            if (res.ResponseState == false)
                            {
                                AllSuccess = false;
                                break;
                            }

                        }

                        //loop Update 
                        foreach (var item in updatedRecords)
                        {
                            item.LAST_UPDATE = DateTime.Now;
                            var updatedRec = GLDefAccountService.Update(item);
                            int br = 1; // item has no branch 
                            res = Shared.TransactionProcess(Convert.ToInt32(updatedRec.COMP_CODE), br, int.Parse(updatedRec.ACC_CODE), "Acc","Update", db);
                            if (res.ResponseState == false)
                            {
                                AllSuccess = false;
                                break;
                            }

                        }

                        //loop Delete 
                        foreach (var item in deletedRecords)
                        {

                            int deletedId =int.Parse( item.ACC_CODE);
                            int DeletedComp = Convert.ToInt32(item.COMP_CODE);
                            GLDefAccountService.Delete(int.Parse(item.ACC_CODE));
                            int br = 1; // item has no branch 
                            res = Shared.TransactionProcess(DeletedComp, br, deletedId, "Acc", "Delete",db);
                            if (res.ResponseState == false)
                            {
                                AllSuccess = false;
                                break;
                            }

                        }

                        // if all success commit 
                        if (AllSuccess)
                        {
                            dbTransaction.Commit();
                            // Return in case if the db generate transaction number   res.ResponseData
                            return Ok(new BaseResponse(100));
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
        public IHttpActionResult GetAllByComp(int CompCode, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var AccList = GLDefAccountService.GetAll(x => x.COMP_CODE == CompCode).ToList();

                return Ok(new BaseResponse(AccList));
            }
            return BadRequest(ModelState);
        }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAccDetailByComp(int CompCode, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var AccList = GLDefAccountService.GetAll(x => x.COMP_CODE == CompCode && x.DETAIL == true).ToList();

                return Ok(new BaseResponse(AccList));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetByAccCode(int CompCode, string AccCode, int AccType, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var AccList = GLDefAccountService.GetAll(x => x.COMP_CODE == CompCode && x.ACC_CODE == AccCode && x.ACC_TYPE == AccType && x.DETAIL == true && x.ACC_ACTIVE == true).ToList();

                return Ok(new BaseResponse(AccList));
            }
            return BadRequest(ModelState);
        }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetByAccCode(int CompCode, string AccCode, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var AccRec = GLDefAccountService.GetAll(x => x.COMP_CODE == CompCode && x.ACC_CODE == AccCode).ToList().FirstOrDefault();

                return Ok(new BaseResponse(AccRec));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetByType(int CompCode, int AccType, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var AccList = GLDefAccountService.GetAll(x => x.COMP_CODE == CompCode && x.ACC_TYPE == AccType && x.DETAIL == true && x.ACC_ACTIVE == true).ToList();

                return Ok(new BaseResponse(AccList));
            }
            return BadRequest(ModelState);
        }


        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetByTypeAuto(int CompCode, int AccType, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var AccList = GLDefAccountService.GetAll(x => x.COMP_CODE == CompCode && x.ACC_TYPE == AccType && x.ACC_ACTIVE == true).ToList();

                return Ok(new BaseResponse(AccList));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetByTypeForBoxes(int CompCode, int AccType, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var AccList = GLDefAccountService.GetAll(x => x.COMP_CODE == CompCode &&( x.ACC_TYPE == AccType || x.ACC_TYPE == 2) && x.DETAIL == true && x.ACC_ACTIVE == true).ToList();

                return Ok(new BaseResponse(AccList));
            }
            return BadRequest(ModelState);
        }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetByTypeNew(int CompCode, int AccType, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var AccList = GLDefAccountService.GetAll(x => x.COMP_CODE == CompCode  && x.DETAIL == true  ).ToList();

                return Ok(new BaseResponse(AccList));
            }
            return BadRequest(ModelState);
        }



        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAcc_ByBank(int CompCode, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var AccList = GLDefAccountService.GetAll(x => x.COMP_CODE == CompCode && x.ACC_TYPE == 1  && x.DETAIL == true && x.ACC_ACTIVE == true).ToList();
                //var AccList = GLDefAccountService.GetAll(x => x.COMP_CODE == CompCode && x.ACC_TYPE == 1  && x.DETAIL == true && x.ACC_ACTIVE == true ||   x.COMP_CODE == CompCode && x.ACC_TYPE == 3 && x.DETAIL == true && x.ACC_ACTIVE == true).ToList();

                return Ok(new BaseResponse(AccList));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetBankAcc(int CompCode, int AccType, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var AccList = GLDefAccountService.GetAll(x => x.COMP_CODE == CompCode && x.ACC_TYPE == AccType && x.DETAIL == true).ToList();

                return Ok(new BaseResponse(AccList));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllWithAccountType(int CompCode, int AccType, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var AccDefAccountList = GLDefAccountService.GetAll(x => x.COMP_CODE == CompCode && x.ACC_TYPE == AccType).ToList();

                return Ok(new BaseResponse(AccDefAccountList));
            }
            return BadRequest(ModelState);
        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult UpdateGenralAcclist(A_ACCOUNT_AND_YEAR AccountList)
        {

            if (ModelState.IsValid && UserControl.CheckUser(AccountList.Token, AccountList.UserCode))
            {
                using (var dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        var insertedRecords = AccountList.A_ACCOUNT.Where(x => x.StatusFlag == 'i').ToList();
                        var updatedRecords = AccountList.A_ACCOUNT.Where(x => x.StatusFlag == 'u').ToList();
                        var deletedRecords = AccountList.A_ACCOUNT.Where(x => x.StatusFlag == 'd').ToList();
                        ResponseResult res = new ResponseResult();
                         
                         
                        //loop insered 
                        foreach (var item in insertedRecords)
                        {
                            item.CREATED_AT = DateTime.Now;
                             
                            var InsertedRec = GLDefAccountService.Insert(item);
                            if (item.PARENT_ACC != null)
                            {
                              var item2=  GLDefAccountService.GetAll(s=>s.COMP_CODE== item.COMP_CODE && s.ACC_CODE== item.PARENT_ACC);
                                foreach (var item3 in item2)
                                {
                                    item3.DETAIL = false;
                                    GLDefAccountService.Update(item3);
                                }
                            }

                             
                           var InsertedRec_in_A_ACCOUNT_YEAR = GLDefAccount_yearService.Insert(AccountList.A_ACCOUNT_YEAR);
                            LogUser.InsertPrint(db, AccountList.Comp_Code.ToString(), AccountList.Branch_Code, AccountList.sec_FinYear, AccountList.UserCode, null, LogUser.UserLog.Insert, AccountList.MODULE_CODE, true, null, null, InsertedRec.ACC_CODE);


                        }

                        //loop Update 
                        foreach (var item in updatedRecords)
                        {
                            item.LAST_UPDATE = DateTime.Now;
                            var updatedRec = GLDefAccountService.Update(item);

                            var updatedRec_in_A_ACCOUNT_YEAR = GLDefAccount_yearService.Update(AccountList.A_ACCOUNT_YEAR);
                            LogUser.InsertPrint(db, AccountList.Comp_Code.ToString(), AccountList.Branch_Code, AccountList.sec_FinYear, AccountList.UserCode, null, LogUser.UserLog.Update, AccountList.MODULE_CODE, true, null, null, updatedRec.ACC_CODE);

                        }

                        //loop Delete 
                        foreach (var item in deletedRecords)
                        { 

                            if (item.PARENT_ACC != null)
                            {
                                var CH_DETAIL = GLDefAccountService.GetAll(x => x.COMP_CODE == item.COMP_CODE && x.PARENT_ACC == item.PARENT_ACC);

                                if (CH_DETAIL.Count == 1)
                                {
                                    var item2 = GLDefAccountService.GetAll(s => s.COMP_CODE == item.COMP_CODE && s.ACC_CODE == item.PARENT_ACC);
                                    foreach (var item3 in item2)
                                    {
                                        item3.DETAIL = true;
                                        GLDefAccountService.Update(item3);
                                    }
                                }
                                 
                            }
                            //DELETE A_ACCOUNT 
                            string Q = "DELETE FROM A_ACCOUNT WHERE COMP_CODE = "+ item.COMP_CODE + " and ACC_CODE ='" + item.ACC_CODE + "'";                            
                            string query = Q;
                            var de = db.Database.ExecuteSqlCommand(query);

                            //DELETE A_ACCOUNT_YEAR 
                            string Q_YEAR = "DELETE FROM A_ACCOUNT_YEAR WHERE COMP_CODE = " + item.COMP_CODE + " and ACC_CODE ='" + item.ACC_CODE + "'";                            
                            var YEAR = db.Database.ExecuteSqlCommand(Q_YEAR);

                            LogUser.InsertPrint(db, AccountList.Comp_Code.ToString(), AccountList.Branch_Code, AccountList.sec_FinYear, AccountList.UserCode, null, LogUser.UserLog.Delete, AccountList.MODULE_CODE, true, null, null, item.ACC_CODE);


                        }


                        dbTransaction.Commit();
                            // Return in case if the db generate transaction number   res.ResponseData
                            return Ok(new BaseResponse(100));
                  


                    }
                    catch (Exception ex)
                    {
                        dbTransaction.Rollback();
                        LogUser.InsertPrint(db, AccountList.Comp_Code.ToString(), AccountList.Branch_Code, AccountList.sec_FinYear, AccountList.UserCode, null, LogUser.UserLog.Update, AccountList.MODULE_CODE, false, ex.Message.ToString(), null, null);

                        return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                    }
                }
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult Check_Not(int CompCode , string ACC_CODE)
        {

            if (ModelState.IsValid)
            {
                string s = "select count(*) from A_JOURNAL_DETAIL where COMP_CODE = " + CompCode + " and  ACC_CODE ='"+ ACC_CODE + "'";
                
                string query = s;
                //int Check;
                var res = db.Database.ExecuteSqlCommand(query);
                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult CodeFounBefore(string code, int compCode, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var GLDefAccount = GLDefAccountService.GetAll(x => x.COMP_CODE == compCode && x.ACC_CODE == code);

                return Ok(new BaseResponse(GLDefAccount));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetActivAccByCode(int CompCode, string AccCode, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var AccRec = GLDefAccountService.GetAll(x => x.COMP_CODE == CompCode && x.ACC_CODE == AccCode&&x.DETAIL==true&&x.ACC_ACTIVE==true).ToList().FirstOrDefault();

                return Ok(new BaseResponse(AccRec));
            }
            return BadRequest(ModelState);
        }
    }
}
