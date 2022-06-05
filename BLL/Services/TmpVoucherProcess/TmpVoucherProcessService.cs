using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.TmpVoucherProcess
{
    public class TmpVoucherProcessService : ITmpVoucherProcessService
    {
        private readonly IUnitOfWork unitOfWork;

        public TmpVoucherProcessService(IUnitOfWork _unitOfWork)
        {
            this.unitOfWork = _unitOfWork;
        }


        #region AccDefAccountsService Services
        public A_TmpVoucherProcess GetById(int id)
        {
            return unitOfWork.Repository<A_TmpVoucherProcess>().GetById(id);
        }

        public List<A_TmpVoucherProcess> GetAll()
        {
            return unitOfWork.Repository<A_TmpVoucherProcess>().GetAll();
        }

        public List<A_TmpVoucherProcess> GetAll(Expression<Func<A_TmpVoucherProcess, bool>> predicate)
        {
            return unitOfWork.Repository<A_TmpVoucherProcess>().Get(predicate);
        }

        public A_TmpVoucherProcess Insert(A_TmpVoucherProcess entity)
        {
            var AccDefAccount = unitOfWork.Repository<A_TmpVoucherProcess>().Insert(entity);
            unitOfWork.Save();
            return AccDefAccount;
        }
        public void InsertLst(List<A_TmpVoucherProcess> obj)
        {
            unitOfWork.Repository<A_TmpVoucherProcess>().Insert(obj);
            unitOfWork.Save();
            return;
        }

        public A_TmpVoucherProcess Update(A_TmpVoucherProcess entity)
        {

            var AccDefAccount = unitOfWork.Repository<A_TmpVoucherProcess>().Update(entity);
            unitOfWork.Save();
            return AccDefAccount;
        }

        public void Delete(int id)
        {
            unitOfWork.Repository<A_TmpVoucherProcess>().Delete(id);
            unitOfWork.Save();
        }

        public void UpdateList(List<A_TmpVoucherProcess> AccDefAccountList)
        {

            foreach (var entity in AccDefAccountList)
            {
                if (entity.StatusFlag == 'd')
                    unitOfWork.Repository<A_TmpVoucherProcess>().Delete(entity.id);
                if (entity.StatusFlag == 'u')
                {
                    unitOfWork.Repository<A_TmpVoucherProcess>().Update(entity);
                }
                if (entity.StatusFlag == 'i')
                {
                    unitOfWork.Repository<A_TmpVoucherProcess>().Insert(entity);
                }
            }
            unitOfWork.Save();

        }
        #endregion

    }
}
