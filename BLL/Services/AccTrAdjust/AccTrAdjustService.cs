using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.AccTrAdjust
{
    public class AccTrAdjustService : IAccTrAdjustService
    {
        private readonly IUnitOfWork unitOfWork;

        public AccTrAdjustService(IUnitOfWork _unitOfWork)
        {
            this.unitOfWork = _unitOfWork;
        }

        #region AccTrAdjustService Services
        public A_RecPay_Tr_Adjustment GetById(int id)
        {
            return unitOfWork.Repository<A_RecPay_Tr_Adjustment>().GetById(id);
        }

        public List<A_RecPay_Tr_Adjustment> GetAll()
        {
            return unitOfWork.Repository<A_RecPay_Tr_Adjustment>().GetAll();
        }

        public List<A_RecPay_Tr_Adjustment> GetAll(Expression<Func<A_RecPay_Tr_Adjustment, bool>> predicate)
        {
            return unitOfWork.Repository<A_RecPay_Tr_Adjustment>().Get(predicate);
        }

        public A_RecPay_Tr_Adjustment Insert(A_RecPay_Tr_Adjustment entity)
        {
            var insertedentity = unitOfWork.Repository<A_RecPay_Tr_Adjustment>().Insert(entity);
            unitOfWork.Save();
            return insertedentity;
        }

        public A_RecPay_Tr_Adjustment Update(A_RecPay_Tr_Adjustment entity)
        {

            var updatedentity = unitOfWork.Repository<A_RecPay_Tr_Adjustment>().Update(entity);
            unitOfWork.Save();
            return updatedentity;
        }

        public void Delete(int id)
        {
            unitOfWork.Repository<A_RecPay_Tr_Adjustment>().Delete(id);
            unitOfWork.Save();
        }

        #endregion

    }
}
