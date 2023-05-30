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
     
        public AQ_GetLnkVoucher Insert(AQ_GetLnkVoucher entity)
        {
            var AccDefAccount = unitOfWork.Repository<AQ_GetLnkVoucher>().Insert(entity);
            unitOfWork.Save();
            return AccDefAccount;
        }

        public AQ_GetLnkVoucher Update(AQ_GetLnkVoucher entity)
        {

            var AccDefAccount = unitOfWork.Repository<AQ_GetLnkVoucher>().Update(entity);
            unitOfWork.Save();
            return AccDefAccount;
        }

        public void Delete(long id)
        {
            unitOfWork.Repository<AQ_GetLnkVoucher>().Deletelong(id);
            unitOfWork.Save();
        }

    }
}
