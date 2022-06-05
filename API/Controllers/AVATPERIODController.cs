using Inv.API.Models;
using Inv.API.Tools;
using Inv.BLL.Services.AVATPERIOD;
using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Inv.API.Controllers;
using System.Data.Entity.Core.Objects;

namespace Inv.API.Controllers
{
    public class AVATPERIODController : BaseController

    {
        private readonly IAVAT_PERIODService AVAT_PERIODService;
        private readonly G_USERSController UserControl ;
        public AVATPERIODController(IAVAT_PERIODService _AVAT_PERIODService, G_USERSController _Control )
        {
            this.AVAT_PERIODService = _AVAT_PERIODService;
            this.UserControl = _Control;
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAll(string UserCode, string Token)
        {
            if (ModelState.IsValid  )
            {
                var res = AVAT_PERIODService.GetAll().ToList();

                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllByComp(string UserCode, string Token,int compcode)
        {
            if (ModelState.IsValid)
            {
                var res = AVAT_PERIODService.GetAll(x=>x.COMP_CODE==compcode).ToList();

                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetById(int id, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var res = AVAT_PERIODService.GetById(id);

                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }


        [HttpPost, AllowAnonymous]
        public IHttpActionResult Insert([FromBody]AVAT_PERIOD obj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(obj.Token, obj.UserCode))
            {
                    try
                    {
                        var res = AVAT_PERIODService.Insert(obj);
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
        public IHttpActionResult Delete(int ID, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                try
                {
                    AVAT_PERIODService.Delete(ID);
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
        public IHttpActionResult Update([FromBody]AVAT_PERIOD obj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(obj.Token, obj.UserCode))
            {
                    try
                    {
                        var res = AVAT_PERIODService.Update(obj);
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
        public IHttpActionResult GetVatDetails(string UserCode, string Token, int COMP_CODE, int VAT_YEAR,int PERIOD_CODE)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var res = db.AQVAT_GetPeriodDetail.Where(x => x.COMP_CODE == COMP_CODE && x.VAT_YEAR == VAT_YEAR && x.PERIOD_CODE== PERIOD_CODE).ToList();

                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult CalculateVatPeriod(string UserCode, string Token, int COMP_CODE, int VAT_YEAR,int VatPeriod)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                ////******update 
                //var vatp = AVAT_PERIODService.GetAll().Where(x => x.COMP_CODE == COMP_CODE && x.VAT_YEAR == VAT_YEAR && x.PERIOD_CODE == VatPeriod).FirstOrDefault();
                //vatp.CORRECTIONS =CORRECTIONS;
                //vatp.CORRECTIONS = VAT_PREVBALANCE;
                //vatp = AVAT_PERIODService.Update(vatp);
                ////*******

                ResponseResult result = new ResponseResult();
                ObjectParameter objParameterOk = new ObjectParameter("ok", typeof(Int32));
                
                var ok = db.AProc_VATVatPeriodCalculate(COMP_CODE, VAT_YEAR, VatPeriod, objParameterOk);
                if ((int)objParameterOk.Value == 0)
                {
                    result.ResponseState = true;
                }
                else if ((int)objParameterOk.Value == 1)
                {
                    result.ResponseState = false;
                }
                return Ok(new BaseResponse(result));
            }
            return BadRequest(ModelState);
        }


        [HttpGet, AllowAnonymous]
        public IHttpActionResult DeliveringReport_VatPeriod(string UserCode, string Token, int COMP_CODE, int VAT_YEAR, int VatPeriod)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                
                ResponseResult result = new ResponseResult();
                ObjectParameter objParameter_VoucherCode = new ObjectParameter("VoucherCode", typeof(Int32));

                var output = db.AProc_VATPeriodClose(COMP_CODE, VAT_YEAR, VatPeriod, objParameter_VoucherCode);
                //if ((int)objParameter_VoucherCode.Value == 0)
                //{
                //    result.ResponseState = true;
                //}
                //else if ((int)objParameter_VoucherCode.Value == 1)
                //{
                //    result.ResponseState = false;
                //}
                result.ResponseData = output;
                result.ResponseState = true;
                return Ok(new BaseResponse(result));
            }
            return BadRequest(ModelState);
        }





        [HttpGet, AllowAnonymous]
        public IHttpActionResult ChangeStatus(string UserCode, string Token, int COMP_CODE, int VAT_YEAR, int VatPeriod,int status)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var result = AVAT_PERIODService.GetAll().Where(x=>x.COMP_CODE==COMP_CODE && x.VAT_YEAR==VAT_YEAR && x.PERIOD_CODE==VatPeriod).FirstOrDefault();
                result.STATUS =Convert.ToByte(status);
                result = AVAT_PERIODService.Update(result);
                return Ok(new BaseResponse(result));
            }
            return BadRequest(ModelState);
        }

    }
}
