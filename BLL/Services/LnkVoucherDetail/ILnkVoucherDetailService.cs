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
        A_LnkVoucher Insert(A_LnkVoucher entity);
        A_LnkVoucher Update(A_LnkVoucher entity);
        void Delete(long id);
    }
}
