using Inv.API.Models;
using Inv.API.Tools;
using Inv.BLL.Services.I_PeriodSer;
using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Inv.API.Controllers; 
using Newtonsoft.Json;

namespace Inv.API.Controllers
{
    public class I_PeriodController : BaseController
    {
        // GET: StKDefinition
        private readonly II_PeriodService I_PeriodService;
        private readonly G_USERSController UserControl;

        public I_PeriodController(II_PeriodService _I_PeriodService, G_USERSController _Control)
        {
            this.I_PeriodService = _I_PeriodService;
            this.UserControl = _Control;
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAll(int CompCode, int FinYear, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var category = I_PeriodService.GetAll(x => x.CompCode == CompCode && x.FinYear == FinYear).ToList();

                return Ok(new BaseResponse(category));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetPERIOD(int CompCode, int FinYear, string Tr_Date, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                 
                string query = "select * from [dbo].[I_Period] where CompCode = " + CompCode + " and FinYear =" + FinYear + " and [FROM_DATE] <=(select CONVERT(DATETIME, '" + Tr_Date + "', 102))and [TO_DATE] >= (select CONVERT(DATETIME, '" + Tr_Date + "', 102))";
                var res = db.Database.SqlQuery<I_Period>(query).ToList();

                //var category = I_PeriodService.GetAll(x => x.CompCode == CompCode && x.FinYear == FinYear && x.FROM_DATE > Tr_Date).ToList();
                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetById(int id, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var category = I_PeriodService.GetById(id);

                return Ok(new BaseResponse(category));
            }
            return BadRequest(ModelState);
        }
        [HttpPost, AllowAnonymous]
        public IHttpActionResult Update(List<I_Period> Period)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Period[0].Token, Period[0].UserCode))
            {

                var insertedObjects = Period.Where(x => x.StatusFlag == 'i').ToList();
                var updatedObjects = Period.Where(x => x.StatusFlag == 'u').ToList();
                var deletedObjects = Period.Where(x => x.StatusFlag == 'd').ToList();

                foreach (var item in insertedObjects)
                {
                    I_PeriodService.Update(item);
                }
                return Ok(new BaseResponse(Period));


            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult Close_ReOpen(int CompCode, int FinYear, int PERIOD_CODE, bool IsClosed, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                if (IsClosed == true)
                {
                    db.Database.ExecuteSqlCommand("update I_Period set Status =1 , Closed_BY = '" + UserCode + "' , Closed_AT =GETDATE() where PERIOD_CODE =" + PERIOD_CODE + " and CompCode =" + CompCode + " and FinYear = " + FinYear + "");
                    db.Database.ExecuteSqlCommand("IProc_PeriodClose " + CompCode + " , " + PERIOD_CODE + " ," + FinYear + "");
                }
                else
                {
                    db.Database.ExecuteSqlCommand("update I_Period set Status =0 , ReOpen_BY = '" + UserCode + "' , ReOpen_AT =GETDATE() where PERIOD_CODE =" + PERIOD_CODE + " and CompCode =" + CompCode + " and FinYear = " + FinYear + "");

                }
                return Ok(new BaseResponse(1));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult FixzQty_Cost(int CompCode, int FinYear, int PERIOD_CODE, bool check, bool IsQty, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                int checke;
                if (check == false)
                {
                    checke = 0;
                }
                else
                {
                    checke = 1;
                }
                if (IsQty == true)
                {

                    db.Database.ExecuteSqlCommand("update I_Period set FixQty = " + checke + " where PERIOD_CODE =" + PERIOD_CODE + " and CompCode =" + CompCode + " and FinYear = " + FinYear + "");

                }
                else
                {
                    db.Database.ExecuteSqlCommand("update I_Period set FixCost = " + checke + " where PERIOD_CODE =" + PERIOD_CODE + " and CompCode =" + CompCode + " and FinYear = " + FinYear + "");

                }
                return Ok(new BaseResponse(1));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GeneratePeriod(int COMP, int YR, int lN, int TP, string PNAME, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                //I_PeriodService.Insert(obj);
                db.Database.ExecuteSqlCommand("IProc_CreateInvPeriod " + COMP + " , " + YR + " ," + lN + ","+ TP + ", '"+ PNAME + "'");
            }
               
                return Ok(new BaseResponse(ModelState));
        }
    }
}