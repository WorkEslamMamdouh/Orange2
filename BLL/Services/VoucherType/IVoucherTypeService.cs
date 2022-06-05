using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;


namespace Inv.BLL.Services.VoucherType
{
    public interface IVoucherTypeService
    {
        A_Voucher_Types GetById(int id);
        List<A_Voucher_Types> GetAll();
        List<A_Voucher_Types> GetAll(Expression<Func<A_Voucher_Types, bool>> predicate);
    }
}
