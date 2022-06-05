using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.DirectTransfer
{
    public class DirectTransferService : IDirectTransferService
    {
        private readonly IUnitOfWork unitOfWork;

        public DirectTransferService(IUnitOfWork _unitOfWork)
        {
            this.unitOfWork = _unitOfWork;
        }

        #region Header Services
        public I_Stk_TR_Transfer GetById(int id)
        {
            return unitOfWork.Repository<I_Stk_TR_Transfer>().GetById(id);
        }

        public List<I_Stk_TR_Transfer> GetAll(Expression<Func<I_Stk_TR_Transfer, bool>> predicate)
        {
            return unitOfWork.Repository<I_Stk_TR_Transfer>().Get(predicate);
        }

        public I_Stk_TR_Transfer Insert(I_Stk_TR_Transfer entity)
        {
            var Item = unitOfWork.Repository<I_Stk_TR_Transfer>().Insert(entity);
            unitOfWork.Save();
            return Item;
        }
        public I_Stk_TR_Transfer Update(I_Stk_TR_Transfer entity)
        {

            var Item = unitOfWork.Repository<I_Stk_TR_Transfer>().Update(entity);
            unitOfWork.Save();
            return Item;
        }
        public void UpdateList(List<I_Stk_TR_Transfer> entityList)
        {
            unitOfWork.Repository<I_Stk_TR_Transfer>().Update(entityList);
            unitOfWork.Save();

        }
        #endregion

        #region Detail Services
        public List<I_Stk_TR_TransferDetails> GetAll(Expression<Func<I_Stk_TR_TransferDetails, bool>> predicate)
        {
            return unitOfWork.Repository<I_Stk_TR_TransferDetails>().Get(predicate);
        }

        public void InsertLst(List<I_Stk_TR_TransferDetails> obj)
        {
            unitOfWork.Repository<I_Stk_TR_TransferDetails>().Insert(obj);
            unitOfWork.Save();
            return;
        }

        public I_Stk_TR_TransferDetails Insert(I_Stk_TR_TransferDetails entity)
        {
            var AccDefAccount = unitOfWork.Repository<I_Stk_TR_TransferDetails>().Insert(entity);
            unitOfWork.Save();
            return AccDefAccount;
        }

        public I_Stk_TR_TransferDetails Update(I_Stk_TR_TransferDetails entity)
        {

            var AccDefAccount = unitOfWork.Repository<I_Stk_TR_TransferDetails>().Update(entity);
            unitOfWork.Save();
            return AccDefAccount;
        }

        public void Delete(int id)
        {
            unitOfWork.Repository<I_Stk_TR_TransferDetails>().Delete(id);
            unitOfWork.Save();
        }

        #endregion

    }
}
