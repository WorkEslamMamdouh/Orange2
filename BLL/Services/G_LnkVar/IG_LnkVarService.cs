using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;


namespace Inv.BLL.Services.G_LnkVarr
{
    public interface IG_LnkVarService
    {
        G_LnkVar GetById(int id);
        List<G_LnkVar> GetAll();
        List<G_LnkVar> GetAll(Expression<Func<G_LnkVar, bool>> predicate);
    }
}
