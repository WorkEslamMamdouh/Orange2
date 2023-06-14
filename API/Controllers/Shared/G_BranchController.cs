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
using Inv.API.Models.CustomModel;

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
        public IHttpActionResult GetAllRoles()
        {
            if (ModelState.IsValid)
            {
                var documents = db.G_Role.ToList();
                return Ok(new BaseResponse(documents));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetBranch(int CompCode, int BRA_CODE)
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


        [HttpPost, AllowAnonymous]
        public IHttpActionResult InsertRoleBranch(List<G_RoleBranch> obj)
        {
            if (ModelState.IsValid)
            {
                using (var dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        for (int i = 0; i < obj.Count; i++)
                        {
                            if (obj[i].StatusFlag == 'i')
                            {
                                db.Database.ExecuteSqlCommand("INSERT INTO [dbo].[G_RoleBranch] ([COMP_CODE],[BRA_CODE],[RoleId])VALUES(" + obj[i].COMP_CODE + "," + obj[i].BRA_CODE + "," + obj[i].RoleId + ")");

                            }
                            else if (obj[i].StatusFlag == 'u')
                            {
                                db.Database.ExecuteSqlCommand("update G_RoleBranch set RoleId=" + obj[i].RoleId + " where COMP_CODE=" + obj[i].COMP_CODE + " and BRA_CODE=" + obj[i].BRA_CODE + "");

                            }
                            else if (obj[i].StatusFlag == 'd')
                            {
                                db.Database.ExecuteSqlCommand("delete G_RoleBranch where COMP_CODE = " + obj[i].COMP_CODE + " and BRA_CODE = " + obj[i].BRA_CODE + " and RoleId= " + obj[i].RoleId + "  ");

                            }


                        }
                        if (obj.Count > 0)
                        {
                            db.Database.ExecuteSqlCommand("EXEC [dbo].[GProc_GenerateBranchModules] @CompCode = " + obj[0].COMP_CODE + ",@BraCode = " + obj[0].BRA_CODE + "");

                        }

                        dbTransaction.Commit();

                        return Ok(new BaseResponse(1));
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

        [HttpPost, AllowAnonymous]
        public IHttpActionResult InsertRoleModuleMasteh(G_RoleModuleMaste obj)
        {

            using (var dbTransaction = db.Database.BeginTransaction())
            {
                try
                {
                    var objGrole = G_BranchService.InsertG_Role(obj.G_Role);


                    for (int i = 0; i < obj.G_RoleModule.Count; i++)
                    {
                        obj.G_RoleModule[i].RoleId = objGrole.RoleId;
                        G_BranchService.InsertG_RoleModule(obj.G_RoleModule[i]);
                    }

                    dbTransaction.Commit();
                    return Ok(new BaseResponse(objGrole.RoleId));
                }
                catch (Exception ex)
                {
                    dbTransaction.Rollback();
                    return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                }
            }

        }


        [HttpPost, AllowAnonymous]
        public IHttpActionResult updateRoleModuleMasteh(G_RoleModuleMaste obj)
        {
            if (ModelState.IsValid)
            {
                using (var dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        var objGrole = G_BranchService.UpdateG_Role(obj.G_Role);
                        var insert = obj.G_RoleModule.Where(x => x.StatusFlag == 'i').ToList();
                        var update = obj.G_RoleModule.Where(x => x.StatusFlag == 'u').ToList();
                        var delete = obj.G_RoleModule.Where(x => x.StatusFlag == 'd').ToList();
                        for (int i = 0; i < insert.Count; i++)
                        {
                            insert[i].RoleId = obj.G_Role.RoleId;
                            G_BranchService.InsertG_RoleModule(insert[i]);
                        }
                        for (int i = 0; i < update.Count; i++)
                        {
                            update[i].RoleId = obj.G_Role.RoleId;
                            G_BranchService.InsertG_RoleModule(update[i]);
                        }

                        for (int i = 0; i < delete.Count; i++)
                        {
                            db.Database.ExecuteSqlCommand("delete[dbo].[G_RoleModule] where RoleId = " + delete[i].RoleId + " and MODULE_CODE ='" + delete[i].MODULE_CODE + "'");

                        }

                        dbTransaction.Commit();
                        return Ok(new BaseResponse(objGrole.RoleId));
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

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetRoleBranch(int CompCode, int BRA_CODE)
        {
            if (ModelState.IsValid)
            {
                var G_RoleBranch = db.G_RoleBranch.Where(x => x.COMP_CODE == CompCode && x.BRA_CODE == BRA_CODE).ToList();

                return Ok(new BaseResponse(G_RoleBranch));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult chackRole(int COMP_CODE, int Branch_CODE, int Roleid)
        {
            string SQL = "select * from [dbo].[G_RoleBranch]   where [COMP_CODE] = '" + COMP_CODE + "' and BRA_CODE = " + Branch_CODE + " and RoleId =" + Roleid + " ";

            List<G_RoleBranch> ItemList = db.Database.SqlQuery<G_RoleBranch>(SQL).ToList();
            return Ok(new BaseResponse(ItemList.Count));
        }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult chackRoleModule(string MODULE_CODE, int Roleid)
        {
            string SQL = "select * from [dbo].[G_RoleModule]   where [RoleId] = " + Roleid + " and MODULE_CODE='" + MODULE_CODE + "' ";

            List<G_RoleModule> ItemList = db.Database.SqlQuery<G_RoleModule>(SQL).ToList();
            return Ok(new BaseResponse(ItemList.Count));
        }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult chackModule(string MODULE_CODE)
        {
            string SQL = "select * from [dbo].[G_MODULES]   where  MODULE_CODE='" + MODULE_CODE + "' ";

            List<G_MODULES> ItemList = db.Database.SqlQuery<G_MODULES>(SQL).ToList();
            return Ok(new BaseResponse(ItemList.Count));
        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult updateG_ModuleMasteh(List<G_MODULES>  obj)
        {
            if (ModelState.IsValid)
            {
                using (var dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        var insert = obj.Where(x => x.StatusFlag == 'i').ToList();
                        var update = obj.Where(x => x.StatusFlag == 'u').ToList();
                        var delete = obj.Where(x => x.StatusFlag == 'd').ToList();
                        for (int i = 0; i < insert.Count; i++)
                        {
                            
                            G_BranchService.InsertG_MODULES(insert[i]);
                        }
                        for (int i = 0; i < update.Count; i++)
                        {
                             G_BranchService.UpdateG_MODULES(update[i]);
                        }

                        for (int i = 0; i < delete.Count; i++)
                        {
                            db.Database.ExecuteSqlCommand("delete[dbo].[G_MODULES] where  MODULE_CODE ='" + delete[i].MODULE_CODE + "'");

                        }

                        dbTransaction.Commit();
                        return Ok(new BaseResponse(1));
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

    }
}

