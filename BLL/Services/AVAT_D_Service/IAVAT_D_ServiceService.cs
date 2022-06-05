using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.AVAT_D_Servicee
{
    public interface IAVAT_D_ServiceService
    {
        AVAT_D_Service GetById(int id);
        List<AVAT_D_Service> GetAll();
        List<AVAT_D_Service> GetAll(Expression<Func<AVAT_D_Service, bool>> predicate);

        AVAT_D_Service Insert(AVAT_D_Service entity);

        AVAT_D_Service Update(AVAT_D_Service entity);

        void Delete(int id);


    }
}
