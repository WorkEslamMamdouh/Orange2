using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.Nationality
{
    public interface INationalityService
    {
        G_Nationality GetById(int id);      
        List<G_Nationality> GetAll();
        List<G_Nationality> GetAll(Expression<Func<G_Nationality, bool>> predicate);
        G_Nationality Insert(G_Nationality entity);
        G_Nationality Update(G_Nationality entity);
        void Delete(int id);
        void UpdateList(List<G_Nationality> Lstservice);
    }
}
