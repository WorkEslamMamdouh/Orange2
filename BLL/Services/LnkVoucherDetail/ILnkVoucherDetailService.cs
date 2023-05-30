using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.LnkVoucherDetail
{
    public interface ILnkVoucherDetailService
    {
        AQ_GetLnkVoucher Insert(AQ_GetLnkVoucher entity);
        AQ_GetLnkVoucher Update(AQ_GetLnkVoucher entity);
        void Delete(long id);
    }
}
