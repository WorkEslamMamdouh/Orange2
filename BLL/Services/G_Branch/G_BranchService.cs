using System;
using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.G_Branch
{
    public class G_BranchService : IG_BranchService
    {
        private readonly IUnitOfWork unitOfWork;

        public G_BranchService(IUnitOfWork _unitOfWork)
        {
            this.unitOfWork = _unitOfWork;
        }

        public G_BRANCH GetById(int id)
        {
            return unitOfWork.Repository<G_BRANCH>().GetById(id);
        }

        public G_BRANCH GetAll()
        {
            var x = unitOfWork.Repository<G_BRANCH>().GetAll();
            return x.FirstOrDefault();
        }

        public List<G_BRANCH> GetAll(Expression<Func<G_BRANCH, bool>> predicate)
        {
            return unitOfWork.Repository<G_BRANCH>().Get(predicate);
        }
       
        public G_BRANCH Insert(G_BRANCH KControl)
        {
            var Control = unitOfWork.Repository<G_BRANCH>().Insert(KControl);
            unitOfWork.Save();
            return Control;
        }

        public G_BRANCH Update(G_BRANCH KControl)
        {
            var Control = unitOfWork.Repository<G_BRANCH>().Update(KControl);
            unitOfWork.Save();
            return Control;
        }

        public void Delete(int id)
        {
            unitOfWork.Repository<G_BRANCH>().Delete(id);
            unitOfWork.Save();
        }

        public G_Role InsertG_Role(G_Role KControl)
        {
            var Control = unitOfWork.Repository<G_Role>().Insert(KControl);
            unitOfWork.Save();
            return Control;
        }

        public G_Role UpdateG_Role(G_Role KControl)
        {
            var Control = unitOfWork.Repository<G_Role>().Update(KControl);
            unitOfWork.Save();
            return Control;
        }

        public void DeleteG_Role(int id)
        {
            unitOfWork.Repository<G_Role>().Delete(id);
            unitOfWork.Save();
        }

        public G_RoleModule InsertG_RoleModule(G_RoleModule KControl)
        {
            var Control = unitOfWork.Repository<G_RoleModule>().Insert(KControl);
            unitOfWork.Save();
            return Control;
        }

        public G_RoleModule UpdateG_RoleModule(G_RoleModule KControl)
        {
            var Control = unitOfWork.Repository<G_RoleModule>().Update(KControl);
            unitOfWork.Save();
            return Control;
        }

        public void DeleteG_RoleModule(int id)
        {
            unitOfWork.Repository<G_RoleModule>().Delete(id);
            unitOfWork.Save();
        }



        public G_MODULES InsertG_MODULES(G_MODULES KControl)
        {
            var Control = unitOfWork.Repository<G_MODULES>().Insert(KControl);
            unitOfWork.Save();
            return Control;
        }

        public G_MODULES UpdateG_MODULES(G_MODULES KControl)
        {
            var Control = unitOfWork.Repository<G_MODULES>().Update(KControl);
            unitOfWork.Save();
            return Control;
        }

        public void DeleteG_MODULES(int id)
        {
            unitOfWork.Repository<G_MODULES>().Delete(id);
            unitOfWork.Save();
        }

    }
}
