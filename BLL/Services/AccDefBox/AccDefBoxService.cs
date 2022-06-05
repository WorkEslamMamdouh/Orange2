using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.AccDefBox
{
 public class AccDefBoxService:IAccDefBoxService
    {//A_RecPay_D_CashBox
        private readonly IUnitOfWork unitOfWork;

        public AccDefBoxService(IUnitOfWork _unitOfWork)
        {
            this.unitOfWork = _unitOfWork;
        }

        #region AccDefBoxService Services
        public A_RecPay_D_CashBox GetById(int id)
        {
            return unitOfWork.Repository<A_RecPay_D_CashBox>().GetById(id);
        }

        public List<A_RecPay_D_CashBox> GetAll()
        {
            return unitOfWork.Repository<A_RecPay_D_CashBox>().GetAll();
        }

        public List<A_RecPay_D_CashBox> GetAll(Expression<Func<A_RecPay_D_CashBox, bool>> predicate)
        {
            return unitOfWork.Repository<A_RecPay_D_CashBox>().Get(predicate);
        }

        public A_RecPay_D_CashBox Insert(A_RecPay_D_CashBox entity)
        {
            var AccDefAccount = unitOfWork.Repository<A_RecPay_D_CashBox>().Insert(entity);
            unitOfWork.Save();
            return AccDefAccount;
        }

        public A_RecPay_D_CashBox Update(A_RecPay_D_CashBox entity)
        {

            var AccDefAccount = unitOfWork.Repository<A_RecPay_D_CashBox>().Update(entity);
            unitOfWork.Save();
            return AccDefAccount;
        }

        public void Delete(int id)
        {
            unitOfWork.Repository<A_RecPay_D_CashBox>().Delete(id);
            unitOfWork.Save();
        }

        public void UpdateList(List<A_RecPay_D_CashBox> AccDefAccountList)
        {

            foreach (var entity in AccDefAccountList)
            {
                if (entity.StatusFlag == 'd')
                    unitOfWork.Repository<A_RecPay_D_CashBox>().Delete(entity.CashBoxID);
                if (entity.StatusFlag == 'u')
                {
                    unitOfWork.Repository<A_RecPay_D_CashBox>().Update(entity);
                }
                if (entity.StatusFlag == 'i')
                {
                    unitOfWork.Repository<A_RecPay_D_CashBox>().Insert(entity);
                }
            }
            unitOfWork.Save();

        }
        #endregion
    }
}
