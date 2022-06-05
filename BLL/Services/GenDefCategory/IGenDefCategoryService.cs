using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.GenDefCategory
{
 public  interface IGenDefCategoryService
    {
        A_RecPay_D_Category GetById(int id);
        List<A_RecPay_D_Category> GetAll();
        List<A_RecPay_D_Category> GetAll(Expression<Func<A_RecPay_D_Category, bool>> predicate);
        A_RecPay_D_Category Insert(A_RecPay_D_Category entity);
        A_RecPay_D_Category Update(A_RecPay_D_Category entity);
        void Delete(int id);
        void UpdateList(List<A_RecPay_D_Category> Lstservice);
    }
}
