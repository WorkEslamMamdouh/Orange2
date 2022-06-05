using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.G_LnkTransVoucherr
{
    public interface IG_LnkTransVoucherService
    {
        GQ_GetLnkTransVoucher GetById(int id);
        List<GQ_GetLnkTransVoucher> GetAll();
        List<GQ_GetLnkTransVoucher> GetAll(Expression<Func<GQ_GetLnkTransVoucher, bool>> predicate);
        G_LnkTransVoucher Insert(G_LnkTransVoucher entity);
        G_LnkTransVoucher Update(G_LnkTransVoucher entity);
        void Delete(int id);
        void DeleteLnkTransVoucher(int COMP_CODE, string SYSTEM_CODE, string SUB_SYSTEM_CODE, string TR_CODE, int SERIAL);

    }
}
