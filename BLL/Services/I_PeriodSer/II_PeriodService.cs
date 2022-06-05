using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.I_PeriodSer
{
   public interface II_PeriodService
    {
        I_Period GetById(int id);
        List<I_Period> GetAll();
        List<I_Period> GetAll(Expression<Func<I_Period, bool>> predicate);
        I_Period Insert(I_Period entity);
        I_Period Update(I_Period entity);
        void Delete(int id);
       
    }
}
