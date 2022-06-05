using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.GenDefCategory
{
    public class GenDefCategoryService: IGenDefCategoryService
    {
        private readonly IUnitOfWork unitOfWork;

        public GenDefCategoryService(IUnitOfWork _unitOfWork)
        {
            this.unitOfWork = _unitOfWork;
        }
        #region IGenDefCategory Services

        public A_RecPay_D_Category GetById(int id)
        {
            return unitOfWork.Repository<A_RecPay_D_Category>().GetById(id);
        }

        public List<A_RecPay_D_Category> GetAll()
        {
            return unitOfWork.Repository<A_RecPay_D_Category>().GetAll();
        }

        public List<A_RecPay_D_Category> GetAll(Expression<Func<A_RecPay_D_Category, bool>> predicate)
        {
            return unitOfWork.Repository<A_RecPay_D_Category>().Get(predicate);
        }

        public A_RecPay_D_Category Insert(A_RecPay_D_Category entity)
        {
            var memb = unitOfWork.Repository<A_RecPay_D_Category>().Insert(entity);
            unitOfWork.Save();
            return memb;
        }

        public A_RecPay_D_Category Update(A_RecPay_D_Category entity)
        {

            var memb = unitOfWork.Repository<A_RecPay_D_Category>().Update(entity);
            unitOfWork.Save();
            return memb;
        }

        public void Delete(int id)
        {
            unitOfWork.Repository<A_RecPay_D_Category>().Delete(id);
            unitOfWork.Save();
        }

        public void UpdateList(List<A_RecPay_D_Category> Lstservice)
        {

           


            foreach (var entity in Lstservice)
            {
                if (entity.StatusFlag == 'd')
                    unitOfWork.Repository<A_RecPay_D_Category>().Delete(entity.CatID);
                if (entity.StatusFlag == 'u')
                {
                    entity.UpdatedAt = DateTime.Now;
                    unitOfWork.Repository<A_RecPay_D_Category>().Update(entity);
                }
                if (entity.StatusFlag == 'i')
                {
                    entity.CreatedAt = DateTime.Now;
                    unitOfWork.Repository<A_RecPay_D_Category>().Insert(entity);
                }

            }
                unitOfWork.Save();

        }
        #endregion

    }
}
