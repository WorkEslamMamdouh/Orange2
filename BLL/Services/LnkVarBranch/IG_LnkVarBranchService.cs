using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.LnkVarBranch
{
    public interface IG_LnkVarBranchService
    {
        GQ_GetLnkVarBranch GetById(int id);
        List<GQ_GetLnkVarBranch> GetAll();
        List<GQ_GetLnkVarBranch> GetAll(Expression<Func<GQ_GetLnkVarBranch, bool>> predicate);
        G_LnkVarBranch Insert(G_LnkVarBranch entity);
        G_LnkVarBranch Update(G_LnkVarBranch entity);
        void Delete(int id);
     }
}
