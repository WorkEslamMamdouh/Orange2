using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.AccDtTypes
{
    public interface IA_CCDT_TypesService
    {
        A_CCDT_Types GetById(int id);
         List<A_CCDT_Types> GetAll();
        List<A_CCDT_Types> GetAll(Expression<Func<A_CCDT_Types, bool>> predicate);
        A_CCDT_Types Insert(A_CCDT_Types obj);
        A_CCDT_Types Update(A_CCDT_Types obj);

        void Delete(A_CCDT_Types entity);

        void Delete(int id);
    }
}
