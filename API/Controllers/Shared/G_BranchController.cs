using Inv.API.Models;
using Inv.API.Tools;
using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http; 
using Inv.BLL.Services.G_Branch;

namespace Inv.API.Controllers
{
    public class G_BranchController : BaseController
    {
        private readonly IG_BranchService G_BranchService;


        public G_BranchController(IG_BranchService BranchService)
        {
            this.G_BranchService = BranchService;

        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAll(int CompCode)
        {
            if (ModelState.IsValid)
            { 
                var documents = G_BranchService.GetAll(x => x.COMP_CODE == CompCode);
                return Ok(new BaseResponse(documents));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetBranch(int CompCode , int BRA_CODE)
        {
            if (ModelState.IsValid)
            {
                var documents = G_BranchService.GetAll(x => x.COMP_CODE == CompCode && x.BRA_CODE == BRA_CODE); 
                return Ok(new BaseResponse(documents));
            }
            return BadRequest(ModelState);
        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult Update([FromBody]G_BRANCH obj)
        {

            var res = G_BranchService.Update(obj);
            return Ok(new BaseResponse(res));

        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllCOMP()
        {
            if (ModelState.IsValid)
            {
                var COMPANY = db.G_COMPANY.ToList();
                List<G_COMPANY> companiesList = new List<G_COMPANY>();

                foreach (G_COMPANY company in COMPANY)
                {
                    G_COMPANY comp = new G_COMPANY
                    {
                        COMP_CODE = company.COMP_CODE,
                        NameA = SecuritySystem.Decrypt(company.NameA),
                        NameE = SecuritySystem.Decrypt(company.NameE),
                        IsActive = Convert.ToBoolean(company.IsActive)
                    };
                    companiesList.Add(comp);
                };
                return Ok(companiesList);
             }
            return BadRequest(ModelState);
        }
    }
}

