using Inv.API.Models;
using Inv.API.Tools;
using Inv.BLL.Services.AccDefCustomer;
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
    public class AccDefCustomerController  : BaseController
    {//A_Rec_D_Customer
        private readonly IAccDefCustomerService AccDefCustomerService;
        private readonly G_USERSController UserControl;
       
        public AccDefCustomerController(IAccDefCustomerService _IAccDefCustomerService, G_USERSController _Control)
        {
            this.AccDefCustomerService = _IAccDefCustomerService;
            this.UserControl = _Control;
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAll(int CompCode, int BranchCode, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                //read IsLocalBranchCustomer	bit	Checked from i_Contro where com 
                // if true filter by branch else remove branch filter 

                string qry = "select IsLocalBranchCustomer from I_Control where CompCode ="+ CompCode ; 
                var Check = db.Database.SqlQuery<bool>(qry).ToList(); 
                if (Check[0] == true)
                {
                    var AccDefCustomerList = AccDefCustomerService.GetAll(x => x.CompCode == CompCode && x.BranchCode == BranchCode).ToList();
                    return Ok(new BaseResponse(AccDefCustomerList));
                }
                else
                {
                    var AccDefCustomerList = AccDefCustomerService.GetAll(x => x.CompCode == CompCode).ToList();
                    return Ok(new BaseResponse(AccDefCustomerList));
                }

              
            }
            return BadRequest(ModelState);
        }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetFiltered(int CompCode, int BranchCode, int? Catid , int? Groupid , int? Slsid , int? CreditType , string BalType ,  string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                string s = "select * from IQ_GetCustomer where  CompCode = " + CompCode ;
                string condition = ""; 
                if (Catid != 0 )                
                    condition = condition + " and CatID =" + Catid ;
                if (Groupid != 0)
                    condition = condition + " and GroupId =" + Groupid ;
                if (Slsid != 0)
                    condition = condition + " and SalesmanId =" + Slsid;
                if (CreditType != 2)
                    condition = condition + " and IsCreditCustomer =" + CreditType;

                if (BalType != "All")
                {
                    if (BalType == ">")
                    {
                        condition = condition + " and Balance > 0 ";
                    }
                    if (BalType == "=")
                    {
                        condition = condition + " and Balance = 0 ";
                    }
                    if (BalType == "<")
                    {
                        condition = condition + " and Balance < 0 ";
                    }

                }

                string qry = "select IsLocalBranchCustomer from I_Control where CompCode =" + CompCode;
                var Check = db.Database.SqlQuery<bool>(qry).ToList();
                if (Check[0] == true)
                {
                    condition = condition + " and BranchCode =" + BranchCode; 
                }

                string query = s + condition;
                var res = db.Database.SqlQuery<IQ_GetCustomer>(query).ToList();
                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        
        }


        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetCustomerDoc(int CustomerId, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                string s = "select * from  AQ_GetCustomerDoc  where CustomerId = " + CustomerId; 

                string query = s ;
                var res = db.Database.SqlQuery<AQ_GetCustomerDoc>(query).ToList();
                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);

        }


        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetCustomerByCode(string Custcode, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                string s = "select * from  A_Rec_D_Customer  where CustomerCODE = " + Custcode;

                string query = s;
                var res = db.Database.SqlQuery<A_Rec_D_Customer>(query).FirstOrDefault();
                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);

        }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetByCode(string Code, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                string s = "select * from  IQ_GetCustomer  where CustomerCODE = " + Code;

                string query = s;
                var res = db.Database.SqlQuery<IQ_GetCustomer>(query).FirstOrDefault();
                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);

        }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetCustomerByCustomerId(string CustomerId, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                string s = "select * from  A_Rec_D_Customer  where CustomerId = " + CustomerId;

                string query = s;
                var res = db.Database.SqlQuery<A_Rec_D_Customer>(query).FirstOrDefault();
                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);

        }


        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetById(int id, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var AccDefCustomer = AccDefCustomerService.GetById(id);

                return Ok(new BaseResponse(AccDefCustomer));
            }
            return BadRequest(ModelState);
        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult Insert([FromBody]Rec_D_CustomerDetail obj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(obj.A_Rec_D_Customer.Token, obj.A_Rec_D_Customer.UserCode))
            {
                try
                { 
                    var AccDefCust = AccDefCustomerService.Insert(obj.A_Rec_D_Customer);
                    foreach (var item in obj.A_Rec_D_CustomerDoc)
                    {
                        item.CustomerId = AccDefCust.CustomerId;
                        AccDefCustomerService.Insert(item);
                    } 
                    return Ok(new BaseResponse(AccDefCust.CustomerId));
                }
                catch (Exception ex)
                {
                    return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                }
            }
            return BadRequest(ModelState);
        }


        [HttpPost, AllowAnonymous]
        public IHttpActionResult Update([FromBody]Rec_D_CustomerDetail obj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(obj.A_Rec_D_Customer.Token, obj.A_Rec_D_Customer.UserCode))
            {
                try
                {
                    var AccDefCust = AccDefCustomerService.Update(obj.A_Rec_D_Customer);

                    var insertedObjects = obj.A_Rec_D_CustomerDoc.Where(x => x.StatusFlag == 'i').ToList();
                    var updatedObjects = obj.A_Rec_D_CustomerDoc.Where(x => x.StatusFlag == 'u').ToList();
                    var deletedObjects = obj.A_Rec_D_CustomerDoc.Where(x => x.StatusFlag == 'd').ToList();

                    foreach (var item in insertedObjects)
                    {
                        item.CustomerId = obj.A_Rec_D_Customer.CustomerId;
                        AccDefCustomerService.Insert(item);
                    }
                    foreach (var item in updatedObjects)
                    {
                        item.CustomerId = obj.A_Rec_D_Customer.CustomerId;
                        AccDefCustomerService.Update(item);
                    }
                    foreach (var item in deletedObjects)
                    { 
                        AccDefCustomerService.Delete(item.CustomerDocID);
                    } 

                    return Ok(new BaseResponse(AccDefCust));
                }
                catch (Exception ex)
                {
                    return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                }
            }
            return BadRequest(ModelState);
        }


        public IHttpActionResult Delete(int ID, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                try
                {
                    AccDefCustomerService.Delete(ID);
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

        

        //[HttpPost, AllowAnonymous]
        //public IHttpActionResult UpdateLst(List<A_Rec_D_Customer> AccDefCustomerList)
        //{
        //    try
        //    {
        //        AccDefCustomerService.UpdateList(AccDefCustomerList);
        //        return Ok(new BaseResponse());
        //    }
        //    catch (Exception ex)
        //    {
        //        return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
        //    }
        //}

        [HttpGet, AllowAnonymous]
        public IHttpActionResult CodeFounBefore(string code, int compCode, int BranchCode, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var AccDefVendor = AccDefCustomerService.GetAll(x => x.CompCode == compCode && x.BranchCode == BranchCode && x.CustomerCODE == code);

                return Ok(new BaseResponse(AccDefVendor));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllWithCreditType(int CompCode, int BranchCode, bool isCredit, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var AccDefCustomerList = AccDefCustomerService.GetAll(x => x.CompCode == CompCode && x.BranchCode == BranchCode && x.IsCreditCustomer== isCredit).ToList();

                return Ok(new BaseResponse(AccDefCustomerList));
            }
            return BadRequest(ModelState);
        }

        //[HttpGet, AllowAnonymous]
        //public IHttpActionResult GetCustomerByCustomerId_code(int Compcode, bool code, string CustomerId, string UserCode, string Token)
        //{
        //    if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
        //    {
        //        string s = "";
        //        if (code == false)
        //        {
        //            s = "select * from  A_Rec_D_Customer  where CustomerId = " + CustomerId;
        //        }
        //        else
        //        {
        //            s = "select * from  A_Rec_D_Customer  where CustomerCODE = " + CustomerId + "and CompCode = " + Compcode;
        //        }
        //        try
        //        {
        //            string query = s;
        //            var res = db.Database.SqlQuery<A_Rec_D_Customer>(query).ToList();
        //            return Ok(new BaseResponse(res));

        //        }
        //        catch (Exception)
        //        {

        //            throw;
        //        }

        //    }
        //    return BadRequest(ModelState);

        //}
        
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetCustomerByCustomerId_code(int Compcode,int BranchCode, bool code, string CustomerId, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                string s = "";
                string condition = "";
                if (code == false)
                { 
                    s = "select * from  IQ_GetCustomer  where CustomerId = " + CustomerId;
                }
                else
                {
                    s = "select * from  IQ_GetCustomer  where CustomerCODE = '" + CustomerId + "' and CompCode = " + Compcode;
                }
                string qry = "select IsLocalBranchCustomer from I_Control where CompCode =" + Compcode;
                var Check = db.Database.SqlQuery<bool>(qry).FirstOrDefault();
                if (Check == true)
                {
                    condition = condition + " and BranchCode =" + BranchCode;
                }
                try
                {
                    string query = s + condition;
                    var res = db.Database.SqlQuery<IQ_GetCustomer>(query).ToList();
                    return Ok(new BaseResponse(res));

                }
                catch (Exception)
                {

                    throw;
                }

            }
            return BadRequest(ModelState);

        }



        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetCustomerACC(string Id, int COMP_CODE, int FIN_YEAR , string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                string s = "select * from  AQ_GetAccount  where ACC_CODE = '" + Id + "' and COMP_CODE=" + COMP_CODE + "  and FIN_YEAR = "+ FIN_YEAR;

                string query = s;
                var res = db.Database.SqlQuery<AQ_GetAccount>(query).ToList();
                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);

        }

    }
}
