using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.GLTrVoucher
{
    public interface IGLTrVoucherService
    {
        A_ACCOUNT GetById(int id);
        List<A_ACCOUNT> GetAll();
        List<A_ACCOUNT> GetAll(Expression<Func<A_ACCOUNT, bool>> predicate);
        A_ACCOUNT Insert(A_ACCOUNT entity);
        A_ACCOUNT Update(A_ACCOUNT entity);
        void Delete(int id);
    }
}
