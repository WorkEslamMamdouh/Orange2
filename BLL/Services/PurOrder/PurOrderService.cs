using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.PurOrder
{
    public class PurOrderService : IPurOrderService
    {
        private readonly IUnitOfWork unitOfWork;

        public PurOrderService(IUnitOfWork _unitOfWork)
        {
            this.unitOfWork = _unitOfWork;
        }

        #region Header Services
        public I_Pur_Tr_PurchaseOrder GetById(int id)
        {
            return unitOfWork.Repository<I_Pur_Tr_PurchaseOrder>().GetById(id);
        }

        public List<I_Pur_Tr_PurchaseOrder> GetAll(Expression<Func<I_Pur_Tr_PurchaseOrder, bool>> predicate)
        {
            return unitOfWork.Repository<I_Pur_Tr_PurchaseOrder>().Get(predicate);
        }

        public I_Pur_Tr_PurchaseOrder Insert(I_Pur_Tr_PurchaseOrder entity)
        {
            var Item = unitOfWork.Repository<I_Pur_Tr_PurchaseOrder>().Insert(entity);
            unitOfWork.Save();
            return Item;
        }
        public I_Pur_Tr_PurchaseOrder Update(I_Pur_Tr_PurchaseOrder entity)
        {

            var Item = unitOfWork.Repository<I_Pur_Tr_PurchaseOrder>().Update(entity);
            unitOfWork.Save();
            return Item;
        }
        public void UpdateList(List<I_Pur_Tr_PurchaseOrder> entityList)
        {
            unitOfWork.Repository<I_Pur_Tr_PurchaseOrder>().Update(entityList);
            unitOfWork.Save();

        }
        #endregion

        #region Detail Services
        public List<I_Pur_Tr_PurchaseOrderDetail> GetAll(Expression<Func<I_Pur_Tr_PurchaseOrderDetail, bool>> predicate)
        {
            return unitOfWork.Repository<I_Pur_Tr_PurchaseOrderDetail>().Get(predicate);
        }

        public void InsertLst(List<I_Pur_Tr_PurchaseOrderDetail> obj)
        {
            unitOfWork.Repository<I_Pur_Tr_PurchaseOrderDetail>().Insert(obj);
            unitOfWork.Save();
            return;
        }

        public I_Pur_Tr_PurchaseOrderDetail Insert(I_Pur_Tr_PurchaseOrderDetail entity)
        {
            var AccDefAccount = unitOfWork.Repository<I_Pur_Tr_PurchaseOrderDetail>().Insert(entity);
            unitOfWork.Save();
            return AccDefAccount;
        }

        public I_Pur_Tr_PurchaseOrderDetail Update(I_Pur_Tr_PurchaseOrderDetail entity)
        {

            var AccDefAccount = unitOfWork.Repository<I_Pur_Tr_PurchaseOrderDetail>().Update(entity);
            unitOfWork.Save();
            return AccDefAccount;
        }

        public void Delete(int id)
        {
            unitOfWork.Repository<I_Pur_Tr_PurchaseOrderDetail>().Delete(id);
            unitOfWork.Save();
        }

        #endregion

    }
}
