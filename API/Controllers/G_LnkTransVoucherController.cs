using Inv.API.Models;
using Inv.API.Tools;
using Inv.BLL.Services.G_LnkTransVoucherr;
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
    public class G_LnkTransVoucherController : BaseController
    {
        private readonly IG_LnkTransVoucherService G_LnkTransVoucherService;
        private readonly G_USERSController UserControl;

        public G_LnkTransVoucherController(IG_LnkTransVoucherService _IG_LnkTransVoucherService, G_USERSController _Control)
        {
            this.G_LnkTransVoucherService = _IG_LnkTransVoucherService;
            this.UserControl = _Control;
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAll(string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var AccDefAccountList = G_LnkTransVoucherService.GetAll().ToList();

                return Ok(new BaseResponse(AccDefAccountList));

            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllGetLnkTransVoucher(int CompCode, string SUB_SYSTEM_CODE, string TR_CODE, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                string s = "select * from GQ_GetLnkTransVoucher where COMP_CODE = " + CompCode + "";
                string condition = "";

                if (SUB_SYSTEM_CODE != "Null")
                    condition = condition + " and SUB_SYSTEM_CODE = '" + SUB_SYSTEM_CODE + "'";

                if (TR_CODE != "Null")
                    condition = condition + " and TR_CODE ='" + TR_CODE + "'";

                string query = s + condition;
                var res = db.Database.SqlQuery<GQ_GetLnkTransVoucher>(query).ToList();
                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }



        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetById(int id, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var AccDefAccount = G_LnkTransVoucherService.GetById(id);

                return Ok(new BaseResponse(AccDefAccount));
            }
            return BadRequest(ModelState);
        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult Insert([FromBody]G_LnkTransVoucher G_LnkTransVoucher)
        {
            if (ModelState.IsValid && UserControl.CheckUser(G_LnkTransVoucher.Token, G_LnkTransVoucher.UserCode))
            {
                try
                {
                    var AccDefAcc = G_LnkTransVoucherService.Insert(G_LnkTransVoucher);
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
                    G_LnkTransVoucherService.Delete(ID);
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
        public IHttpActionResult Update(List<G_LnkTransVoucher> G_LnkTransVoucher)
        {
            if (ModelState.IsValid && UserControl.CheckUser(G_LnkTransVoucher[0].Token, G_LnkTransVoucher[0].UserCode))
            {
                try
                {

                    foreach (var item in G_LnkTransVoucher)
                    {
                        var updatedRec = G_LnkTransVoucherService.Update(item);
                    }

                    return Ok(new BaseResponse(100));
                }
                catch (Exception ex)
                {
                    return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                }
            }
            return BadRequest(ModelState);
        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult Updatelsit(List<G_LnkTransVoucher> G_LnkTransVoucher)
        {

            try
            {

                var insertedOperationItems = G_LnkTransVoucher.Where(x => x.StatusFlag == 'i').ToList();
                var updatedOperationItems = G_LnkTransVoucher.Where(x => x.StatusFlag == 'u').ToList();
                var deletedOperationItems = G_LnkTransVoucher.Where(x => x.StatusFlag == 'd').ToList();

                //loop insered  I_Pur_TR_ReceiveItems
                foreach (var item in insertedOperationItems)
                {


                    var InsertedRec = G_LnkTransVoucherService.Insert(item);
                }

                //loop Update  I_Pur_TR_ReceiveItems
                foreach (var item in updatedOperationItems)
                {

                    //var updatedRec = G_LnkTransVoucherService.Update(item);

                    string query = "update G_LnkTransVoucher set COMP_CODE=" + item.COMP_CODE + " ,SYSTEM_CODE='" + item.SYSTEM_CODE + "',SUB_SYSTEM_CODE='" + item.SUB_SYSTEM_CODE + "',TR_CODE='" + item.TR_CODE + "',SERIAL =" + item.SERIAL + ",LineRemarkA = N'"+ item.LineRemarkA+ "' ,LineRemarkE = N'" + item.LineRemarkE + "',VarCode ='" + item.VarCode + "',ISDebit='" + item.ISDebit + "',AccType =" + item.AccType + ",AccFixedCode='" + item.AccFixedCode + "',AccVarCode='" + item.AccVarCode + "',AccBraCode='" + item.AccBraCode + "',CCType ='" + item.CCType + "',CCFixedCode='" + item.CCFixedCode + "',CCVarCode='" + item.VarCode + "',CCBraCode ='" + item.CCBraCode + "',IsCollective ='" + item.IsCollective + "'where COMP_CODE = " + item.COMP_CODE + " and SYSTEM_CODE = '" + item.SYSTEM_CODE + "' and SUB_SYSTEM_CODE = '" + item.SUB_SYSTEM_CODE + "'  and TR_CODE = '" + item.TR_CODE + "' and SERIAL = " + item.serial_num + "";
                    var de = db.Database.ExecuteSqlCommand(query);

                }

                //loop Delete  I_Pur_TR_ReceiveItems
                foreach (var item in deletedOperationItems)
                {
                    int COMP_CODE = item.COMP_CODE;
                    string SYSTEM_CODE = item.SYSTEM_CODE;
                    string SUB_SYSTEM_CODE = item.SUB_SYSTEM_CODE;
                    string TR_CODE = item.TR_CODE;
                    int SERIAL = item.SERIAL;
                    G_LnkTransVoucherService.DeleteLnkTransVoucher(COMP_CODE, SYSTEM_CODE, SUB_SYSTEM_CODE, TR_CODE, SERIAL);
                }
                return Ok(new BaseResponse("ok"));

            }
            catch (Exception ex)
            {
                return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
            }

        }






    }
}
