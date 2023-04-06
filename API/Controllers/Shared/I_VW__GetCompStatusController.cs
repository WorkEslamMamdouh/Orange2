using Inv.API.Models;
using Inv.API.Tools;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Inv.BLL.Services.CompStatus;
using Inv.BLL.Services.G_Control;
using Inv.API.Models.CustomModel;
using Inv.BLL.Services.IControl;
using Inv.DAL.Domain;
using Inv.API.Models.CustomEntities;

namespace Inv.API.Controllers
{
    public class I_VW_GetCompStatusController : BaseController
    {
        private readonly II_VW_GetCompStatusService GetCompStatusService;
        private readonly IG_ControlService G_ControlService;
        private readonly II_ControlService I_ControlService;


        public I_VW_GetCompStatusController(II_VW_GetCompStatusService _CompStatusService, IG_ControlService _G_ControlService, II_ControlService _I_ControlService)
        {
            this.GetCompStatusService = _CompStatusService;
            this.G_ControlService = _G_ControlService;
            this.I_ControlService = _I_ControlService;

        }

        [HttpGet, AllowAnonymous]
           
        public IHttpActionResult GetAll(int Compcode)
        {

           if (ModelState.IsValid )               
            {

                var Control = GetCompStatusService.GetAll(x => x.CompCode == Compcode).FirstOrDefault();
                return Ok(new BaseResponse(Control));
            }
            return BadRequest(ModelState);
        }

        public IHttpActionResult GetStat(int Compcode, int yr)
        {
            CompanyLoginStatus ctr = new CompanyLoginStatus();

            if (ModelState.IsValid)
            {
                var Control = GetCompStatusService.GetAll(x => x.CompCode == Compcode).FirstOrDefault();
                ctr.LoginMsg = Control.LoginMsg;
                ctr.CompStatus = Control.CompStatus;
                ctr.CompCode = Control.CompCode;
                ctr.AddAble = Control.AddAble;
                ctr.Editable = Control.Editable;
                var gc = G_ControlService.GetAll(x => x.COMP_CODE == Compcode && x.FIN_YEAR == yr);
                var Ic = I_ControlService.GetAll(x => x.CompCode == Compcode);
                if (gc.Count > 0)
                {

                    ctr.ACC_STATUS = gc[0].ACC_STATUS;
                    ctr.INV_STATUS = gc[0].INV_STATUS;
                    ctr.LastDate = gc[0].LastDate;
                    ctr.FirstDate = gc[0].FirstDate;
                    ctr.OpenAccVoucheNo = gc[0].OpenAccVoucheNo;
                    ctr.OpenInvAdjNo = gc[0].OpenInvAdjNo;
                    ctr.ProfitAcc_Code = gc[0].ProfitAcc_Code;
                    ctr.MembeshipEndDate = Ic[0].MembeshipEndDate;
                    ctr.MembershipAllanceDays = Ic[0].MembershipAllanceDays;
                    ctr.MembershipreadOnlyDays = Ic[0].MembershipreadOnlyDays;
                    ctr.DbName = "Orange2021";
                }
                else
                {
                    ctr.CompStatus = 5;
                    ctr.LoginMsg = "لايوجد بيانات للشركة في السنة المطلوبة ";
                }

                return Ok(new BaseResponse(ctr));
            }
            return BadRequest(ModelState);
        }




        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetComps(string userCode, int yr)
        {


            string Query = @"select c.[COMP_CODE],uc.[USER_CODE],getstat.LoginMsg ,c.NameA,c.NameE  , G_C.LastDate,G_C.FirstDate,getstat.CompStatus,
	                        I_C.MembeshipEndDate,I_C.MembershipAllanceDays,I_C.MembershipreadOnlyDays,c.IsActive   
	                        From dbo.G_USER_COMPANY as uc right JOIN
	                        dbo.G_COMPANY as c on  uc.COMP_CODE = c.COMP_CODE 
	                        inner join I_VW_GetCompStatus getstat on getstat.CompCode = uc.COMP_CODE
	                        inner join G_CONTROL G_C on G_C.COMP_CODE = uc.COMP_CODE
	                        inner join I_CONTROL I_C on I_C.CompCode = uc.COMP_CODE
	                        WHERE uc.USER_CODE = '" + userCode + "' and uc.[EXECUTE] = 1 and G_C.FIN_YEAR ='" + yr + "'";



            List<ModelCompStatus> companies = db.Database.SqlQuery<ModelCompStatus>(Query).ToList();
            foreach (ModelCompStatus company in companies)
            {


                company.NameA = SecuritySystem.Decrypt(company.NameA);
                company.NameE = SecuritySystem.Decrypt(company.NameE);

            };

            return Ok(new BaseResponse(companies));

        } 

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetCompsInAdmin(string userCode)
        {


            string Query = @"select c.[COMP_CODE],uc.[USER_CODE],c.NameA,c.NameE  ,c.IsActive   
	                        From dbo.G_USER_COMPANY as uc right JOIN
	                        dbo.G_COMPANY as c on  uc.COMP_CODE = c.COMP_CODE 
	                        WHERE uc.USER_CODE = '" + userCode + "' and uc.[EXECUTE] = 1 ";



            List<ModelCompStatus> companies = db.Database.SqlQuery<ModelCompStatus>(Query).ToList();
            foreach (ModelCompStatus company in companies)
            {


                company.NameA = SecuritySystem.Decrypt(company.NameA);
                company.NameE = SecuritySystem.Decrypt(company.NameE);

            };

            return Ok(new BaseResponse(companies));

        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult ChaekFinYear(int CompCode, int FinYear)
        {

            string Query = @"select * from [dbo].[G_CONTROL] where  Comp_Code = " + CompCode + " and fin_year = " + FinYear + " ";

            List<G_CONTROL> CONTROL = db.Database.SqlQuery<G_CONTROL>(Query).ToList();

            return Ok(new BaseResponse(CONTROL));

        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult ChangeAcc_Code(int CompCode, int FinYear, string Acc_Code)
        {

            string update_Query = @"update G_CONTROL set ProfitAcc_Code = '" + Acc_Code + "' where  Comp_Code = " + CompCode + " and fin_year = " + FinYear + " ";
            db.Database.ExecuteSqlCommand(update_Query);

            string Query = @"select * from [dbo].[G_CONTROL] where  Comp_Code = " + CompCode + " and fin_year = " + FinYear + " ";
            List<G_CONTROL> CONTROL = db.Database.SqlQuery<G_CONTROL>(Query).ToList();

            return Ok(new BaseResponse(CONTROL));

        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult PushProcessTrans(int CompCode, int FinYear, string Query)
        {
            try
            {
                Exec_Proc_Status res = db.Database.SqlQuery<Exec_Proc_Status>(Query).FirstOrDefault();
                return Ok(new BaseResponse(res));
            }
            catch (Exception ex)
            {
                Exec_Proc_Status Re = new Exec_Proc_Status();
                Re.res = 0;
                Re.msg = ex.Message;
                return Ok(new BaseResponse(Re));
            }


        }


        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetNews(int CompCode, int BranchCode, string DateNow)
        {
            
            string Query = @"select * from G_News where
                             '"+ DateNow + "' >= NewsDate and '" + DateNow + "' <= NewsExpiry and (CompCode ="+ CompCode + " or ISNULL(CompCode,0) =0 ) and (BranchCode = "+ BranchCode + " or ISNULL(BranchCode,0) = 0  )";

            List<G_News> News = db.Database.SqlQuery<G_News>(Query).ToList();
 
            List<G_Codes> NewsType = db.Database.SqlQuery<G_Codes>("select * from [dbo].[G_Codes] where CodeType = 'NewsType'").ToList();

            NewsDetails News_Details = new NewsDetails();

            News_Details.G_News = News;
            News_Details.G_Codes = NewsType;

            return Ok(new BaseResponse(News_Details));

        }


        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetHistory(int CompCode, int BranchCode, int News_Type, int yr)
        {

            string Query = @"select * from G_News where  year(NewsDate) = "+ yr + " and NewsTypeCode = " + News_Type + " and (CompCode =" + CompCode + " or ISNULL(CompCode,0) =0 ) and (BranchCode = " + BranchCode + " or ISNULL(BranchCode,0) = 0  )  order by NewsDate desc ";

            List<G_News> News = db.Database.SqlQuery<G_News>(Query).ToList();

            List<G_Codes> NewsType = db.Database.SqlQuery<G_Codes>("select * from [dbo].[G_Codes] where CodeType = 'NewsType'").ToList();

            NewsDetails News_Details = new NewsDetails();

            News_Details.G_News = News;
            News_Details.G_Codes = NewsType;

            return Ok(new BaseResponse(News_Details));

        }


    }
}