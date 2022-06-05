using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.DefStoree
{
   public class DefStoreService: IDefStoreService
    {
        private readonly IUnitOfWork unitOfWork;

        public DefStoreService(IUnitOfWork _unitOfWork)
        {
            this.unitOfWork = _unitOfWork;
        }

        #region GQ_GetStore Service

        public GQ_GetStore GetById(int id)
        {
            return unitOfWork.Repository<GQ_GetStore>().GetById(id);
        }

        public List<GQ_GetStore> GetAll()
        {
            return unitOfWork.Repository<GQ_GetStore>().GetAll();
        }

        public List<GQ_GetStore> GetAll(Expression<Func<GQ_GetStore, bool>> predicate)
        {
            return unitOfWork.Repository<GQ_GetStore>().Get(predicate);
        }
        public G_STORE Insert(G_STORE entity)
        {
            var insertedentity = unitOfWork.Repository<G_STORE>().Insert(entity);
            unitOfWork.Save();
            return insertedentity;
        }

        public G_STORE Update(G_STORE entity)
        {

            var updatedentity = unitOfWork.Repository<G_STORE>().Update(entity);
            unitOfWork.Save();
            return updatedentity;
        }

        public void Delete(int id)
        {
            unitOfWork.Repository<G_STORE>().Delete(id);
            unitOfWork.Save();
        }

        #endregion
    }
}
