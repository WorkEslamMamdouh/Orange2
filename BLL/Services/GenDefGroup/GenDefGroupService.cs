using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.GenDefGroup
{
  public  class GenDefGroupService:IGenDefGroupService
    {
        private readonly IUnitOfWork unitOfWork;

        public GenDefGroupService(IUnitOfWork _unitOfWork)
        {
            this.unitOfWork = _unitOfWork;
        }

        #region IGenDefGroup Services

        public A_RecPay_D_Group GetById(int id)
        {
            return unitOfWork.Repository<A_RecPay_D_Group>().GetById(id);
        }

        public List<A_RecPay_D_Group> GetAll()
        {
            return unitOfWork.Repository<A_RecPay_D_Group>().GetAll();
        }

        public List<A_RecPay_D_Group> GetAll(Expression<Func<A_RecPay_D_Group, bool>> predicate)
        {
            return unitOfWork.Repository<A_RecPay_D_Group>().Get(predicate);
        }

        public A_RecPay_D_Group Insert(A_RecPay_D_Group entity)
        {
            var memb = unitOfWork.Repository<A_RecPay_D_Group>().Insert(entity);
            unitOfWork.Save();
            return memb;
        }

        public A_RecPay_D_Group Update(A_RecPay_D_Group entity)
        {

            var memb = unitOfWork.Repository<A_RecPay_D_Group>().Update(entity);
            unitOfWork.Save();
            return memb;
        }

        public void Delete(int id)
        {
            unitOfWork.Repository<A_RecPay_D_Group>().Delete(id);
            unitOfWork.Save();
        }

        public void UpdateList(List<A_RecPay_D_Group> Lstservice)
        {

            
            foreach (var entity in Lstservice)
            {
                if (entity.StatusFlag == 'd')
                    unitOfWork.Repository<A_RecPay_D_Group>().Delete(entity.GroupID);
                if (entity.StatusFlag == 'u')
                {
                    entity.UpdatedAt = DateTime.Now;
                    unitOfWork.Repository<A_RecPay_D_Group>().Update(entity);
                }
                if (entity.StatusFlag == 'i')
                {
                    entity.CreatedAt = DateTime.Now;
                    unitOfWork.Repository<A_RecPay_D_Group>().Insert(entity);
                }

            }

            unitOfWork.Save();

        }
        #endregion

    }
}
