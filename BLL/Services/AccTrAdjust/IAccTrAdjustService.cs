using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.AccTrAdjust
{
   public  interface IAccTrAdjustService
    {
        A_RecPay_Tr_Adjustment GetById(int id);
        List<A_RecPay_Tr_Adjustment> GetAll();
        List<A_RecPay_Tr_Adjustment> GetAll(Expression<Func<A_RecPay_Tr_Adjustment, bool>> predicate);
        A_RecPay_Tr_Adjustment Insert(A_RecPay_Tr_Adjustment entity);
        A_RecPay_Tr_Adjustment Update(A_RecPay_Tr_Adjustment entity);
        void Delete(int id);
    }
}
