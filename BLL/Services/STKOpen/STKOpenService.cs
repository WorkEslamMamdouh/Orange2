using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.STKOpen
{
    public class STKOpenService : ISTKOpenService
    {
        private readonly IUnitOfWork unitOfWork;

        public STKOpenService(IUnitOfWork _unitOfWork)
        {
            this.unitOfWork = _unitOfWork;
        }

        #region Header Services
        public I_Stk_TR_Open GetById(int id)
        {
            return unitOfWork.Repository<I_Stk_TR_Open>().GetById(id);
        }

        public List<I_Stk_TR_Open> GetAll(Expression<Func<I_Stk_TR_Open, bool>> predicate)
        {
            return unitOfWork.Repository<I_Stk_TR_Open>().Get(predicate);
        }

        public I_Stk_TR_Open Insert(I_Stk_TR_Open entity)
        {
            var Item = unitOfWork.Repository<I_Stk_TR_Open>().Insert(entity);
            unitOfWork.Save();
            return Item;
        }
        public I_Stk_TR_Open Update(I_Stk_TR_Open entity)
        {

            var Item = unitOfWork.Repository<I_Stk_TR_Open>().Update(entity);
            unitOfWork.Save();
            return Item;
        }
        public void UpdateList(List<I_Stk_TR_Open> entityList)
        {
            unitOfWork.Repository<I_Stk_TR_Open>().Update(entityList);
            unitOfWork.Save();

        }
        #endregion

        #region Detail Services
        public List<I_Stk_Tr_OpenDetails> GetAll(Expression<Func<I_Stk_Tr_OpenDetails, bool>> predicate)
        {
            return unitOfWork.Repository<I_Stk_Tr_OpenDetails>().Get(predicate);
        }

        public void InsertLst(List<I_Stk_Tr_OpenDetails> obj)
        {
            unitOfWork.Repository<I_Stk_Tr_OpenDetails>().Insert(obj);
            unitOfWork.Save();
            return;
        }

        public I_Stk_Tr_OpenDetails Insert(I_Stk_Tr_OpenDetails entity)
        {
            var AccDefAccount = unitOfWork.Repository<I_Stk_Tr_OpenDetails>().Insert(entity);
            unitOfWork.Save();
            return AccDefAccount;
        }

        public I_Stk_Tr_OpenDetails Update(I_Stk_Tr_OpenDetails entity)
        {

            var AccDefAccount = unitOfWork.Repository<I_Stk_Tr_OpenDetails>().Update(entity);
            unitOfWork.Save();
            return AccDefAccount;
        }

        public void Delete(int id)
        {
            unitOfWork.Repository<I_Stk_Tr_OpenDetails>().Delete(id);
            unitOfWork.Save();
        }

        #endregion

    }
}
