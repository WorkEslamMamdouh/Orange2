using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.GenDefGroup
{
    public interface IGenDefGroupService
    {
        A_RecPay_D_Group GetById(int id);
        List<A_RecPay_D_Group> GetAll();
        List<A_RecPay_D_Group> GetAll(Expression<Func<A_RecPay_D_Group, bool>> predicate);
        A_RecPay_D_Group Insert(A_RecPay_D_Group entity);
        A_RecPay_D_Group Update(A_RecPay_D_Group entity);
        void Delete(int id);
        void UpdateList(List<A_RecPay_D_Group> Lstservice);
    }
}
