using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.AVATPERIOD
{
  
    public interface IAVAT_PERIODService
    {
        List<AVAT_PERIOD> GetAll();
        List<AVAT_PERIOD> GetAll(Expression<Func<AVAT_PERIOD, bool>> predicate);
        AVAT_PERIOD Insert(AVAT_PERIOD entity);
        AVAT_PERIOD Update(AVAT_PERIOD entity);
        AVAT_PERIOD GetById(int id);
        void Delete(int id);
    }
}
