using Inv.API.Models;
using Inv.API.Tools;
using Inv.BLL.Services.AccDefAccounts;
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
    public class AccDefAccountsController : BaseController
    {
        private readonly IAccDefAccountsService AccDefAccountsService;
        private readonly G_USERSController UserControl;

        public AccDefAccountsController(IAccDefAccountsService _IAccDefAccountsService, G_USERSController _Control)
        {
            this.AccDefAccountsService = _IAccDefAccountsService;
            this.UserControl = _Control;
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAll(int CompCode, int TrType, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var AccDefAccountList = AccDefAccountsService.GetAll(x => x.CompCode == CompCode && x.TrType == TrType).ToList();

                return Ok(new BaseResponse(AccDefAccountList));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetById(int id, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var AccDefAccount = AccDefAccountsService.GetById(id);

                return Ok(new BaseResponse(AccDefAccount));
            }
            return BadRequest(ModelState);
        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult Insert([FromBody]A_RecPay_D_Accounts AccDefAccount)
        {
            if (ModelState.IsValid && UserControl.CheckUser(AccDefAccount.Token, AccDefAccount.UserCode))
            {
                try
                {
                    var AccDefAcc = AccDefAccountsService.Insert(AccDefAccount);
                    return Ok(new BaseResponse(AccDefAcc));
                }
                catch (Exception ex)
                {
                    return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                }
            }
            return BadRequest(ModelState);
        }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult Delete(int ID, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                try
                {
                    AccDefAccountsService.Delete(ID);
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
        public IHttpActionResult Update([FromBody]A_RecPay_D_Accounts AccDefAccount)
        {
            if (ModelState.IsValid && UserControl.CheckUser(AccDefAccount.Token, AccDefAccount.UserCode))
            {
                try
                {
                    var AccDefAcc = AccDefAccountsService.Update(AccDefAccount);
                    return Ok(new BaseResponse(AccDefAcc));
                }
                catch (Exception ex)
                {
                    return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                }
            }
            return BadRequest(ModelState);
        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult UpdateLst(List<A_RecPay_D_Accounts> AccDefAccount)
        {
            try
            {
                AccDefAccountsService.UpdateList(AccDefAccount);  
                return Ok(new BaseResponse());
            }
            catch (Exception ex)
            {
               
                return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
            }
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetByCode_and_byid(int CompCode, string id, bool code, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                string query = "";
                if (code == true)
                {
                    query = "select * from A_RecPay_D_Accounts where ExpCode = " + id + "  and CompCode =" + CompCode + " and TrType = 1   ";
                }
                else
                {
                    query = "select * from A_RecPay_D_Accounts where ExpenseID = " + id + "  and CompCode =" + CompCode + " and TrType = 1   ";
                }

                var AccDefAccount = db.Database.SqlQuery<A_RecPay_D_Accounts>(query).ToList();
                return Ok(new BaseResponse(AccDefAccount));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetPayByCode_and_byid(int CompCode, string id, bool code, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                string query = "";
                if (code == true)
                {
                    query = "select * from A_RecPay_D_Accounts where ExpCode = " + id + "  and CompCode =" + CompCode + " and TrType = 2   ";
                }
                else
                {
                    query = "select * from A_RecPay_D_Accounts where ExpenseID = " + id + "  and CompCode =" + CompCode + " and TrType = 2   ";
                }

                var AccDefAccount = db.Database.SqlQuery<A_RecPay_D_Accounts>(query).ToList();
                return Ok(new BaseResponse(AccDefAccount));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetByCode_and_byidPay(int CompCode, string id, bool code, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {

                string query = "";
                if (code == true)
                {

                    query = "select * from A_RecPay_D_Accounts where ExpCode = " + id + "  and CompCode =" + CompCode + " and TrType = 2 ";
                }
                else
                {

                    query = "select * from A_RecPay_D_Accounts where ExpenseID = " + id + "  and CompCode =" + CompCode + " and TrType = 2 ";
                }




                var AccDefAccount = db.Database.SqlQuery<A_RecPay_D_Accounts>(query).ToList();

                return Ok(new BaseResponse(AccDefAccount));
            }
            return BadRequest(ModelState);
        }


    }
}
