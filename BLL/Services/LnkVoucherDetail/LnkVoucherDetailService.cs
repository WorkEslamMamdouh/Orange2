using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.LnkVoucherDetail
{
 public  class LnkVoucherDetailService : ILnkVoucherDetailService
    {
        private readonly IUnitOfWork unitOfWork;

        public LnkVoucherDetailService(IUnitOfWork _unitOfWork)
        {
            this.unitOfWork = _unitOfWork;
        }
     
        public A_LnkVoucher Insert(A_LnkVoucher entity)
        {
            var AccDefAccount = unitOfWork.Repository<A_LnkVoucher>().Insert(entity);
            unitOfWork.Save();
            return AccDefAccount;
        }

        public A_LnkVoucher Update(A_LnkVoucher entity)
        {

            var AccDefAccount = unitOfWork.Repository<A_LnkVoucher>().Update(entity);
            unitOfWork.Save();
            return AccDefAccount;
        }

        public void Delete(long id)
        {
            unitOfWork.Repository<A_LnkVoucher>().Deletelong(id);
            unitOfWork.Save();
        }

    }
}
