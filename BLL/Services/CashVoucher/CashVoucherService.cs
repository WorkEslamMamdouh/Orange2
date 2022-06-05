using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.CashVoucher
{
    public class CashVoucherService : ICashVoucherService
    {
        private readonly IUnitOfWork unitOfWork;

        public CashVoucherService(IUnitOfWork _unitOfWork)
        {
            this.unitOfWork = _unitOfWork;
        }

        #region Header Services
        public A_CashVoucher_Header GetById(int id)
        {
            return unitOfWork.Repository<A_CashVoucher_Header>().GetById(id);
        }

        public List<A_CashVoucher_Header> GetAll(Expression<Func<A_CashVoucher_Header, bool>> predicate)
        {
            return unitOfWork.Repository<A_CashVoucher_Header>().Get(predicate);
        }

        public A_CashVoucher_Header Insert(A_CashVoucher_Header entity)
        {
            var Item = unitOfWork.Repository<A_CashVoucher_Header>().Insert(entity);
            unitOfWork.Save();
            return Item;
        }
        public A_CashVoucher_Header Update(A_CashVoucher_Header entity)
        {

            var Item = unitOfWork.Repository<A_CashVoucher_Header>().Update(entity);
            unitOfWork.Save();
            return Item;
        }
        public void UpdateList(List<A_CashVoucher_Header> entityList)
        {
            unitOfWork.Repository<A_CashVoucher_Header>().Update(entityList);
            unitOfWork.Save();

        }
        #endregion

        #region Detail Services
        public List<A_CashVoucher_Detail  > GetAll(Expression<Func<A_CashVoucher_Detail  , bool>> predicate)
        {
            return unitOfWork.Repository<A_CashVoucher_Detail  >().Get(predicate);
        }

        public void InsertLst(List<A_CashVoucher_Detail  > obj)
        {
            unitOfWork.Repository<A_CashVoucher_Detail  >().Insert(obj);
            unitOfWork.Save();
            return;
        }

        public A_CashVoucher_Detail   Insert(A_CashVoucher_Detail   entity)
        {
            var AccDefAccount = unitOfWork.Repository<A_CashVoucher_Detail  >().Insert(entity);
            unitOfWork.Save();
            return AccDefAccount;
        }

        public A_CashVoucher_Detail   Update(A_CashVoucher_Detail   entity)
        {

            var AccDefAccount = unitOfWork.Repository<A_CashVoucher_Detail  >().Update(entity);
            unitOfWork.Save();
            return AccDefAccount;
        }

        public void Delete(int id)
        {
            unitOfWork.Repository<A_CashVoucher_Detail  >().Delete(id);
            unitOfWork.Save();
        }

        #endregion

    }
}
