﻿using Inv.API.Models;
using Inv.API.Tools;
using Inv.BLL.Services.AccDefBox;
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
    public class AccDefBoxController : BaseController
    {
        private readonly IAccDefBoxService AccDefBoxService;
        private readonly G_USERSController UserControl;

        public AccDefBoxController(IAccDefBoxService _IAccDefBoxService, G_USERSController _Control)
        {
            this.AccDefBoxService = _IAccDefBoxService;
            this.UserControl = _Control;
        }
        public IHttpActionResult GetAll(int compCode, int BranchCode, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var AccDefBoxList = AccDefBoxService.GetAll(s => s.CompCode == compCode && s.BranchCode == BranchCode).ToList();
                LogUser.InsertPrint(db, compCode.ToString(), BranchCode.ToString(), "",UserCode, null, LogUser.UserLog.Query, "", true, null, null, null);

                return Ok(new BaseResponse(AccDefBoxList));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetById(int id, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var AccDefBox = AccDefBoxService.GetById(id);

                return Ok(new BaseResponse(AccDefBox));
            }
            return BadRequest(ModelState);
        }



        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetById(int compCode, int BranchCode, int CashBoxID, string UserCode, string Token)
        {

            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {

                if (CashBoxID == 0)
                {
                    var AccDefBox = AccDefBoxService.GetAll(s => s.CompCode == compCode && s.BranchCode == BranchCode).ToList();
                    return Ok(new BaseResponse(AccDefBox)); 
                }
                else
                {
                    var AccDefBox = AccDefBoxService.GetAll(s => s.CompCode == compCode && s.BranchCode == BranchCode && s.CashBoxID == CashBoxID).ToList();
                    return Ok(new BaseResponse(AccDefBox));
                }


            }
            return BadRequest(ModelState);
        }


        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllRec(int compCode, int CashBoxID, string UserCode, string Token)
        {

            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {

                if (CashBoxID == 0)
                {
                    var AccDefBox = AccDefBoxService.GetAll(s => s.CompCode == compCode ).ToList();
                    return Ok(new BaseResponse(AccDefBox));
                }
                else
                {
                    var AccDefBox = AccDefBoxService.GetAll(s => s.CompCode == compCode && s.CashBoxID == CashBoxID).ToList();
                    return Ok(new BaseResponse(AccDefBox));
                }


            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetByIdpaynote(int compCode, int BranchCode, int CashBoxID, string UserCode, string Token)
        {

            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {

                if (CashBoxID == 0)
                {
                    var AccDefBox = AccDefBoxService.GetAll(s => s.CompCode == compCode && s.BranchCode == BranchCode).ToList();
                    return Ok(new BaseResponse(AccDefBox));
                }
                else
                {
                    var AccDefBox = AccDefBoxService.GetAll(s => s.CompCode == compCode && s.CashBoxID == CashBoxID).ToList();
                    return Ok(new BaseResponse(AccDefBox));
                }


            }
            return BadRequest(ModelState);
        }
        [HttpPost, AllowAnonymous]
        public IHttpActionResult Insert([FromBody]A_RecPay_D_CashBox AccDefBox)
        {
            if (ModelState.IsValid && UserControl.CheckUser(AccDefBox.Token, AccDefBox.UserCode))
            {
                try
                {
                    var AccDefB = AccDefBoxService.Insert(AccDefBox);
                    return Ok(new BaseResponse(AccDefB));
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
                    AccDefBoxService.Delete(ID);
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
        public IHttpActionResult Update([FromBody]A_RecPay_D_CashBox AccDefBox)
        {
            if (ModelState.IsValid && UserControl.CheckUser(AccDefBox.Token, AccDefBox.UserCode))
            {
                try
                {
                    var AccDefB = AccDefBoxService.Update(AccDefBox);
                    return Ok(new BaseResponse(AccDefB));
                }
                catch (Exception ex)
                {
                    return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                }
            }
            return BadRequest(ModelState);
        }
        [HttpPost, AllowAnonymous]
        public IHttpActionResult UpdateLst(List<A_RecPay_D_CashBox> AccDefBoxList)
        {
            try
            {
                AccDefBoxService.UpdateList(AccDefBoxList);
                LogUser.InsertPrint(db, AccDefBoxList[0].Comp_Code.ToString(), AccDefBoxList[0].BranchCode.ToString(), AccDefBoxList[0].sec_FinYear, AccDefBoxList[0].UserCode, null, LogUser.UserLog.UpdateList, AccDefBoxList[0].MODULE_CODE, true, null, null, null);


                return Ok(new BaseResponse());
            }
            catch (Exception ex)
            {
                LogUser.InsertPrint(db, AccDefBoxList[0].CompCode.ToString(), AccDefBoxList[0].BranchCode.ToString(), AccDefBoxList[0].sec_FinYear, AccDefBoxList[0].UserCode, null, LogUser.UserLog.UpdateList, AccDefBoxList[0].MODULE_CODE, false, ex.Message.ToString(), null, null);
                return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
            }
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllByUsercode(int compCode, int BranchCode, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var AccDefBox = AccDefBoxService.GetAll(s => s.CompCode == compCode && s.BranchCode == BranchCode && s.User_Code == UserCode).ToList();

                return Ok(new BaseResponse(AccDefBox));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllBy_USER_TYPE(int compCode, int BranchCode, int id, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var AccDefBox = AccDefBoxService.GetAll(s => s.CompCode == compCode && s.BranchCode == BranchCode && s.User_Code == UserCode).ToList();

                return Ok(new BaseResponse(AccDefBox));
            }
            return BadRequest(ModelState);
        }

    }
}
