using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.G_Branch
{
    public interface IG_BranchService
    {
        G_BRANCH GetById(int id);
        G_BRANCH GetAll();
        List<G_BRANCH> GetAll(Expression<Func<G_BRANCH, bool>> predicate);
        G_BRANCH Insert(G_BRANCH iControl);
        G_BRANCH Update(G_BRANCH iControl);



        G_Role InsertG_Role(G_Role iControl);
        G_Role UpdateG_Role(G_Role iControl);
        void DeleteG_Role(int id);

        G_RoleModule InsertG_RoleModule(G_RoleModule iControl);
        G_RoleModule UpdateG_RoleModule(G_RoleModule iControl);
        void DeleteG_RoleModule(int id);

        void Delete(int id);
    }
}
