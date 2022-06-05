using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.GenDefAdjustment
{
  public  interface IGenDefAdjustmentService
    {
        A_RecPay_D_AjustmentType GetById(int id);
        List<A_RecPay_D_AjustmentType> GetAll();
        List<A_RecPay_D_AjustmentType> GetAll(Expression<Func<A_RecPay_D_AjustmentType, bool>> predicate);
        A_RecPay_D_AjustmentType Insert(A_RecPay_D_AjustmentType entity);
        A_RecPay_D_AjustmentType Update(A_RecPay_D_AjustmentType entity);
        void Delete(int id);
        void UpdateList(List<A_RecPay_D_AjustmentType> Lstservice);
    }
}
