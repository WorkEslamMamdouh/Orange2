using Inv.API.Models;
using Inv.API.Tools;
using Inv.BLL.Services.GBRANCH;
using Inv.DAL.Domain;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web.Http;


namespace Inv.API.Controllers
{
    public class GBranchController : BaseController
    {
        private readonly IGBRANCHService IGBRANCHService;
        private readonly G_USERSController UserControl;

        public GBranchController(IGBRANCHService _IGBRANCHService, G_USERSController _Control)
        {
            IGBRANCHService = _IGBRANCHService;
            UserControl = _Control;
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAll(int CompCode, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                List<G_BRANCH> GenVatTypeList = IGBRANCHService.GetAll(x => x.COMP_CODE == CompCode).ToList();

                return Ok(new BaseResponse(GenVatTypeList));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllByCode(int CompCode, string UserCode, string Token, int BRA_CODE)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                G_BRANCH GenVatTypeList = IGBRANCHService.GetAll(x => x.COMP_CODE == CompCode && x.BRA_CODE == BRA_CODE).FirstOrDefault();

                return Ok(new BaseResponse(GenVatTypeList));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetById(int id, string UserCode, string Token)
        {

            string Query = "select * from G_BRANCH where COMP_CODE =" + id;
            List<G_BRANCH> res = db.Database.SqlQuery<G_BRANCH>(Query).ToList();
            return Ok(new BaseResponse(res));



        }
        [HttpPost, AllowAnonymous]
        public IHttpActionResult Insert([FromBody]G_BRANCH G_BRANCH)
        {

            G_BRANCH AccDefAcc = IGBRANCHService.Insert(G_BRANCH);
            string query = "GProc_CreateBranch " + G_BRANCH.COMP_CODE + " , " + G_BRANCH.BRA_CODE + " ";
            db.Database.ExecuteSqlCommand(query);

            return Ok(new BaseResponse(AccDefAcc.BRA_CODE));


        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult Update([FromBody]G_BRANCH COSTCENTER)
        {

            G_BRANCH AccDefAcc = IGBRANCHService.Update(COSTCENTER);
            return Ok(new BaseResponse(AccDefAcc));
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetBranchModules(int CompCode, int BranchCode, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                int BraCode = BranchCode;
                SqlParameter spBraCode = new SqlParameter("@BraCode", BraCode == -1 ? System.Data.SqlTypes.SqlInt32.Null : BraCode);
                 
                List<GProc_GetBranchModules_Result> BranchModules = db.Database.SqlQuery<GProc_GetBranchModules_Result>("Exec GProc_GetBranchModules " + CompCode + " , " + spBraCode.Value + "").ToList();

                return Ok(new BaseResponse(BranchModules));
            }
            return BadRequest(ModelState);
        }

    }
}
