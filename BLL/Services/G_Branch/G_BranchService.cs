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
    }
}
