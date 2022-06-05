using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.DefStoree
{
   public interface IDefStoreService
    {
        GQ_GetStore GetById(int id);
        List<GQ_GetStore> GetAll();
        List<GQ_GetStore> GetAll(Expression<Func<GQ_GetStore, bool>> predicate);
        G_STORE Insert(G_STORE entity);
        G_STORE Update(G_STORE entity);
    }
}
