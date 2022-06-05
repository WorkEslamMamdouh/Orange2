using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.ITRCollect
{
   

    public interface II_TR_CollectService
    {
        I_TR_Collect GetById(int id);
        List<I_TR_Collect> GetAll();
        List<I_TR_Collect> GetAll(Expression<Func<I_TR_Collect, bool>> predicate);
        I_TR_Collect Insert(I_TR_Collect entity);
        I_TR_Collect Update(I_TR_Collect entity);
        void Delete(int id);
       
    }
}
