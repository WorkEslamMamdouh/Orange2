using Inv.API.Models;
using Inv.API.Tools;
using Inv.BLL.Services.AVATCONTROL;
using Inv.BLL.Services.AVATPERIOD;
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
    public class AVATCONTROLController : BaseController

    {
        private readonly IAVAT_CONTROLService AVAT_CONTROLService;
        private readonly IAVAT_PERIODService AVAT_PERIODService;
        private readonly G_USERSController UserControl ;
        public AVATCONTROLController(IAVAT_CONTROLService _AVAT_CONTROLService, G_USERSController _Control, IAVAT_PERIODService _AVAT_PERIODService)
        {
            this.AVAT_CONTROLService = _AVAT_CONTROLService;
            this.AVAT_PERIODService = _AVAT_PERIODService;
            this.UserControl = _Control;
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAll(string UserCode, string Token)
        {
            if (ModelState.IsValid  )
            {
                //var res = AVAT_CONTROLService.GetAll(x=>x.COMP_CODE==compcode).ToList();

                var res = AVAT_CONTROLService.GetAll().ToList();

                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllByYear(string UserCode, string Token,int COMP_CODE,int VAT_YEAR)
        {
            if (ModelState.IsValid)
            {
                var res = AVAT_CONTROLService.GetAll(x=>x.COMP_CODE==COMP_CODE && x.VAT_YEAR==VAT_YEAR).FirstOrDefault();

                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetById(int id, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var res = AVAT_CONTROLService.GetById(id);

                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }


        [HttpPost, AllowAnonymous]
        public IHttpActionResult Insert([FromBody]AVAT_CONTROL obj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(obj.Token, obj.UserCode))
            {
                    
                        var res = AVAT_CONTROLService.Insert(obj);
                        return Ok(new BaseResponse(res));
                       
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
                    AVAT_CONTROLService.Delete(ID);
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
        public IHttpActionResult Update([FromBody]AVAT_CONTROL obj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(obj.Token, obj.UserCode))
            {
                    try
                    {
                        var res = AVAT_CONTROLService.Update(obj);

                    LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, null,null, LogUser.UserLog.Update, obj.MODULE_CODE, true, null, null, obj.VAT_SETTING.ToString());

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
        public IHttpActionResult AllowControlSetting(string UserCode, string Token, int COMP_CODE, DateTime stdt, DateTime Enddt, int period,int vatyear)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                using (var dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        //****update vat control
                        var control = AVAT_CONTROLService.GetAll(x => x.COMP_CODE == COMP_CODE && x.VAT_YEAR == vatyear).FirstOrDefault();
                        control.VAT_SETTING = true;
                        control = AVAT_CONTROLService.Update(control);
                        //****fill vat period
                        DateTime st_period = stdt;
                        DateTime End_period = (stdt.AddMonths(period)).AddDays(-1);
                        int serial = 1;
                        AVAT_PERIOD VatPeriod = new AVAT_PERIOD();
                        //***first record
                        VatPeriod.COMP_CODE = COMP_CODE;
                        VatPeriod.CORRECTIONS = 0;
                        VatPeriod.NETVAT_AMOUNT = 0;
                        VatPeriod.PUR_VAT = 0;
                        VatPeriod.SALES_VAT = 0;
                        VatPeriod.STATUS = 0;
                        VatPeriod.TOTALPERIODVAT = 0;
                        VatPeriod.VAT_PREVBALANCE = 0;
                        VatPeriod.VAT_YEAR = vatyear;
                        VatPeriod.VOUCHER_CODE = null;
                        VatPeriod.FROM_DATE = st_period;
                        VatPeriod.PERIOD_CODE = 1;
                        VatPeriod.TO_DATE = End_period;
                        VatPeriod = AVAT_PERIODService.Insert(VatPeriod);
                        while (End_period < Enddt)
                        {
                            st_period = (st_period.AddMonths(period));
                            End_period = (st_period.AddMonths(period)).AddDays(-1);
                            if (End_period > Enddt)
                            {
                                End_period = Enddt;
                            }
                            serial = serial + 1;
                            VatPeriod = new AVAT_PERIOD();
                            VatPeriod.COMP_CODE = COMP_CODE;
                            VatPeriod.CORRECTIONS = 0;
                            VatPeriod.NETVAT_AMOUNT = 0;
                            VatPeriod.PUR_VAT = 0;
                            VatPeriod.SALES_VAT = 0;
                            VatPeriod.STATUS = 0;
                            VatPeriod.TOTALPERIODVAT = 0;
                            VatPeriod.VAT_PREVBALANCE = 0;
                            VatPeriod.VAT_YEAR = vatyear;
                            VatPeriod.VOUCHER_CODE = null;
                            VatPeriod.FROM_DATE = st_period;
                            VatPeriod.PERIOD_CODE = serial;
                            VatPeriod.TO_DATE = End_period;
                            VatPeriod = AVAT_PERIODService.Insert(VatPeriod);
                        }
                        dbTransaction.Commit();
                        return Ok(new BaseResponse(serial));
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


        //[HttpGet, AllowAnonymous]
        //public IHttpActionResult AllowControlSetting(string UserCode, string Token, int COMP_CODE, DateTime stdt, DateTime Enddt, int period)
        //{
        //    if (ModelState.IsValid)
        //    {

        //        DateTime st_period = stdt;
        //        DateTime End_period = (stdt.AddMonths(period)).AddDays(-1);
        //        int serial = 1;
        //        AVAT_PERIOD VatPeriod = new AVAT_PERIOD();
        //        if (End_period > Enddt)
        //        {
        //            End_period = Enddt;
        //        }
        //        while (End_period <= Enddt)
        //        {
        //            VatPeriod.COMP_CODE = COMP_CODE;
        //            VatPeriod.CORRECTIONS = 0;
        //            VatPeriod.NETVAT_AMOUNT = 0;
        //            VatPeriod.PUR_VAT = 0;
        //            VatPeriod.SALES_VAT = 0;
        //            VatPeriod.STATUS = 0;
        //            VatPeriod.TOTALPERIODVAT = 0;
        //            VatPeriod.VAT_PREVBALANCE = 0;
        //            VatPeriod.VAT_YEAR = 0;
        //            VatPeriod.VOUCHER_CODE = null;
        //            VatPeriod.FROM_DATE = st_period;
        //            VatPeriod.PERIOD_CODE = serial;
        //            VatPeriod.TO_DATE = End_period;
        //            VatPeriod = AVAT_PERIODService.Insert(VatPeriod);
        //            //****for the next record
        //            VatPeriod = new AVAT_PERIOD();
        //            st_period = (st_period.AddMonths(period));
        //            End_period = (st_period.AddMonths(period)).AddDays(-1);
        //            serial = serial + 1;
        //        }
        //        return Ok(new BaseResponse(serial));
        //    }
        //    return BadRequest(ModelState);
        //}


       

    }
}
