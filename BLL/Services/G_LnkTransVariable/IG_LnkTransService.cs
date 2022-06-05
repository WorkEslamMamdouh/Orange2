using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;


namespace Inv.BLL.Services.G_LnkTransVariables
{
    public interface IG_LnkTransVariableService
    {
        G_LnkTransVariable GetById(int id);
        List<G_LnkTransVariable> GetAll();
        List<G_LnkTransVariable> GetAll(Expression<Func<G_LnkTransVariable, bool>> predicate);
        G_LnkTransVariable Insert(G_LnkTransVariable entity);
        G_LnkTransVariable Update(G_LnkTransVariable entity);
        void Delete(int id);
    }
}
