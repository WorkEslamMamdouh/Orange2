using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
namespace Inv.BLL.Services.operationItemsSum
{
  public  class OperationItemsSum : IOperationItemsSum
    {
        private readonly IUnitOfWork unitOfWork;
        
        public OperationItemsSum(IUnitOfWork _unitOfWork)
        {
            this.unitOfWork = _unitOfWork;
        }
        #region ItemDefService Services

        public I_TR_OperationItemsSum GetById(int id)
        {
            return unitOfWork.Repository<I_TR_OperationItemsSum>().GetById(id);
        }
        public I_TR_OperationItemsSum GetByIdFromIItem(int id)
        {
            return unitOfWork.Repository<I_TR_OperationItemsSum>().GetById(id);
        }

        public List<I_TR_OperationItemsSum> GetAll()
        {
            return unitOfWork.Repository<I_TR_OperationItemsSum>().GetAll();
        }

        public List<I_TR_OperationItemsSum> GetAll(Expression<Func<I_TR_OperationItemsSum, bool>> predicate)
        {
            return unitOfWork.Repository<I_TR_OperationItemsSum>().Get(predicate);
        }

        public I_TR_OperationItemsSum Insert(I_TR_OperationItemsSum entity)
        {
            var Item = unitOfWork.Repository<I_TR_OperationItemsSum>().Insert(entity);
            unitOfWork.Save();
            return Item;
        }
        

        public I_TR_OperationItemsSum Update(I_TR_OperationItemsSum entity)
        {

            var Item = unitOfWork.Repository<I_TR_OperationItemsSum>().Update(entity);
            unitOfWork.Save();
            return Item;
        }

        public void Delete(int id)
        {
            unitOfWork.Repository<I_TR_OperationItemsSum>().Delete(id);
            unitOfWork.Save();
        }

        public void InsertLst(List<I_TR_OperationItemsSum> obj)
        {
            unitOfWork.Repository<I_TR_OperationItemsSum>().Insert(obj);
            unitOfWork.Save();
            return;
        }
         
        #endregion
    }
}
