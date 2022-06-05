using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.AccDefAccounts
{
  public  class AccDefAccountsService:IAccDefAccountsService
    {
        private readonly IUnitOfWork unitOfWork;

        public AccDefAccountsService(IUnitOfWork _unitOfWork)
        {
            this.unitOfWork = _unitOfWork;
        }


        #region AccDefAccountsService Services
        public A_RecPay_D_Accounts GetById(int id)
        {
            return unitOfWork.Repository<A_RecPay_D_Accounts>().GetById(id);
        }

        public List<A_RecPay_D_Accounts> GetAll()
        {
            return unitOfWork.Repository<A_RecPay_D_Accounts>().GetAll();
        }

        public List<A_RecPay_D_Accounts> GetAll(Expression<Func<A_RecPay_D_Accounts, bool>> predicate)
        {
            return unitOfWork.Repository<A_RecPay_D_Accounts>().Get(predicate);
        }

        public A_RecPay_D_Accounts Insert(A_RecPay_D_Accounts entity)
        {
            var AccDefAccount = unitOfWork.Repository<A_RecPay_D_Accounts>().Insert(entity);
            unitOfWork.Save();
            return AccDefAccount;
        }

        public A_RecPay_D_Accounts Update(A_RecPay_D_Accounts entity)
        {

            var AccDefAccount = unitOfWork.Repository<A_RecPay_D_Accounts>().Update(entity);
            unitOfWork.Save();
            return AccDefAccount;
        }

        public void Delete(int id)
        {
            unitOfWork.Repository<A_RecPay_D_Accounts>().Delete(id);
            unitOfWork.Save();
        }

        public void UpdateList(List<A_RecPay_D_Accounts> AccDefAccountList)
        {

            foreach (var entity in AccDefAccountList)
            {
                if (entity.StatusFlag == 'd')
                    unitOfWork.Repository<A_RecPay_D_Accounts>().Delete(entity.ExpenseID);
                if (entity.StatusFlag == 'u')
                {
                    unitOfWork.Repository<A_RecPay_D_Accounts>().Update(entity);
                }
                if (entity.StatusFlag == 'i')
                {
                    unitOfWork.Repository<A_RecPay_D_Accounts>().Insert(entity);
                }
            }
            unitOfWork.Save();

        }
        #endregion

    }
}
