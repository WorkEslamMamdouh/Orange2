 using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.LnkVarBranch
{
  public  class G_LnkVarBranchService : IG_LnkVarBranchService
    {
        private readonly IUnitOfWork unitOfWork;

        public G_LnkVarBranchService(IUnitOfWork _unitOfWork)
        {
            this.unitOfWork = _unitOfWork;
        }


        #region AccDefAccountsService Services
        public GQ_GetLnkVarBranch GetById(int id)
        {
            return unitOfWork.Repository<GQ_GetLnkVarBranch>().GetById(id);
        }

        public List<GQ_GetLnkVarBranch> GetAll()
        {
            return unitOfWork.Repository<GQ_GetLnkVarBranch>().GetAll();
        }

        public List<GQ_GetLnkVarBranch> GetAll(Expression<Func<GQ_GetLnkVarBranch, bool>> predicate)
        {
            return unitOfWork.Repository<GQ_GetLnkVarBranch>().Get(predicate);
        }

        public G_LnkVarBranch Insert(G_LnkVarBranch entity)
        {
            var AccDefAccount = unitOfWork.Repository<G_LnkVarBranch>().Insert(entity);
            unitOfWork.Save();
            return AccDefAccount;
        }

        public G_LnkVarBranch Update(G_LnkVarBranch entity)
        {

            var AccDefAccount = unitOfWork.Repository<G_LnkVarBranch>().Update(entity);
            unitOfWork.Save();
            return AccDefAccount;
        }

        public void Delete(int id)
        {
            unitOfWork.Repository<G_LnkVarBranch>().Delete(id);
            unitOfWork.Save();
        }

      



        #endregion

    }
}
