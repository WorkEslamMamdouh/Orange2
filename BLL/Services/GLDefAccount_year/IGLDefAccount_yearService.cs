using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.GLDefAccount_year
{
    public interface IGLDefAccount_yearService
    {
        A_ACCOUNT_YEAR GetById(int id);
        List<A_ACCOUNT_YEAR> GetAll();
        List<A_ACCOUNT_YEAR> GetAll(Expression<Func<A_ACCOUNT_YEAR, bool>> predicate);
        A_ACCOUNT_YEAR Insert(A_ACCOUNT_YEAR entity);
        A_ACCOUNT_YEAR Update(A_ACCOUNT_YEAR entity);
        void Delete(int id);
    }
}
