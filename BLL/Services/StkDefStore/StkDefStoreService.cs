using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.StkDefStore
{
   public class StkDefStoreService: IStkDefStoreService
    {
        private readonly IUnitOfWork unitOfWork;

        public StkDefStoreService(IUnitOfWork _unitOfWork)
        {
            this.unitOfWork = _unitOfWork;
        }

        #region G_STORE Service

        public G_STORE GetById(int id)
        {
            return unitOfWork.Repository<G_STORE>().GetById(id);
        }

        public List<G_STORE> GetAll()
        {
            return unitOfWork.Repository<G_STORE>().GetAll();
        }

        public List<G_STORE> GetAll(Expression<Func<G_STORE, bool>> predicate)
        {
            return unitOfWork.Repository<G_STORE>().Get(predicate);
        }
        #endregion
    }
}
