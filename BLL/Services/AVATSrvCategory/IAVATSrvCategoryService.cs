using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.AVATSrvCategory
{
    public interface IAVATSrvCategoryService
    {
        AVAT_D_SrvCategory GetById(int id);
        List<AVAT_D_SrvCategory> GetAll();
        List<AVAT_D_SrvCategory> GetAll(Expression<Func<AVAT_D_SrvCategory, bool>> predicate);

         AVAT_D_SrvCategory Insert(AVAT_D_SrvCategory entity);

         AVAT_D_SrvCategory Update(AVAT_D_SrvCategory entity);

        void Delete(int id);


    }
}
