using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.G_LnkTransVariables
{
   public class G_LnkTransVariableService : IG_LnkTransVariableService
    {
        private readonly IUnitOfWork unitOfWork;

        public G_LnkTransVariableService(IUnitOfWork _unitOfWork)
        {
            this.unitOfWork = _unitOfWork;
        }
        #region VoucherTypeService Service

        public G_LnkTransVariable GetById(int id)
        {
            return unitOfWork.Repository<G_LnkTransVariable>().GetById(id);
        }

        public List<G_LnkTransVariable> GetAll()
        {
            return unitOfWork.Repository<G_LnkTransVariable>().GetAll();
        }

        public List<G_LnkTransVariable> GetAll(Expression<Func<G_LnkTransVariable, bool>> predicate)
        {
            return unitOfWork.Repository<G_LnkTransVariable>().Get(predicate);
        }

        public G_LnkTransVariable Insert(G_LnkTransVariable entity)
        {
            var AccDefAccount = unitOfWork.Repository<G_LnkTransVariable>().Insert(entity);
            unitOfWork.Save();
            return AccDefAccount;
        }

        public G_LnkTransVariable Update(G_LnkTransVariable entity)
        {

            var AccDefAccount = unitOfWork.Repository<G_LnkTransVariable>().Update(entity);
            unitOfWork.Save();
            return AccDefAccount;
        }

        public void Delete(int id)
        {
            unitOfWork.Repository<G_LnkTransVariable>().Delete(id);
            unitOfWork.Save();
        }

        #endregion
    }
}
