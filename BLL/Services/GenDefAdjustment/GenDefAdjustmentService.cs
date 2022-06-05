using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.GenDefAdjustment
{
    public class GenDefAdjustmentService : IGenDefAdjustmentService
    {
        private readonly IUnitOfWork unitOfWork;

        public GenDefAdjustmentService(IUnitOfWork _unitOfWork)
        {
            this.unitOfWork = _unitOfWork;
        }

        #region IGenDefAdjustmentService Services

        public A_RecPay_D_AjustmentType GetById(int id)
        {
            return unitOfWork.Repository<A_RecPay_D_AjustmentType>().GetById(id);
        }

        public List<A_RecPay_D_AjustmentType> GetAll()
        {
            return unitOfWork.Repository<A_RecPay_D_AjustmentType>().GetAll();
        }

        public List<A_RecPay_D_AjustmentType> GetAll(Expression<Func<A_RecPay_D_AjustmentType, bool>> predicate)
        {
            return unitOfWork.Repository<A_RecPay_D_AjustmentType>().Get(predicate);
        }

        public A_RecPay_D_AjustmentType Insert(A_RecPay_D_AjustmentType entity)
        {
            var memb = unitOfWork.Repository<A_RecPay_D_AjustmentType>().Insert(entity);
            unitOfWork.Save();
            return memb;
        }

        public A_RecPay_D_AjustmentType Update(A_RecPay_D_AjustmentType entity)
        {

            var memb = unitOfWork.Repository<A_RecPay_D_AjustmentType>().Update(entity);
            unitOfWork.Save();
            return memb;
        }

        public void Delete(int id)
        {
            unitOfWork.Repository<A_RecPay_D_AjustmentType>().Delete(id);
            unitOfWork.Save();
        }

        public void UpdateList(List<A_RecPay_D_AjustmentType> Lstservice)
        {
            foreach (var entity in Lstservice)
            {
                if (entity.StatusFlag == 'd')
                    unitOfWork.Repository<A_RecPay_D_AjustmentType>().Delete(entity.AdustmentTypeID);
                if (entity.StatusFlag == 'u')
                {
                    //  entity.UpdatedAt = DateTime.Now;
                    unitOfWork.Repository<A_RecPay_D_AjustmentType>().Update(entity);
                }
                if (entity.StatusFlag == 'i')
                {
                    //entity.CreatedAt = DateTime.Now;
                    unitOfWork.Repository<A_RecPay_D_AjustmentType>().Insert(entity);

                }
                unitOfWork.Save();

            }
        }
 #endregion
    }
}