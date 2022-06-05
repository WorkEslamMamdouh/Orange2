using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.AccDefBox
{
    public interface IAccDefBoxService
    {
        A_RecPay_D_CashBox GetById(int id);
        List<A_RecPay_D_CashBox> GetAll();
        List<A_RecPay_D_CashBox> GetAll(Expression<Func<A_RecPay_D_CashBox, bool>> predicate);
        A_RecPay_D_CashBox Insert(A_RecPay_D_CashBox entity);
        A_RecPay_D_CashBox Update(A_RecPay_D_CashBox entity);
        void Delete(int id);
        void UpdateList(List<A_RecPay_D_CashBox> Lstservice);
    }
}
