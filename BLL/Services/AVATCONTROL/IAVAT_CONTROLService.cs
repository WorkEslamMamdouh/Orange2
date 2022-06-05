using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.AVATCONTROL
{
    

    public interface IAVAT_CONTROLService
    {
        List<AVAT_CONTROL> GetAll();
        List<AVAT_CONTROL> GetAll(Expression<Func<AVAT_CONTROL, bool>> predicate);
        AVAT_CONTROL Insert(AVAT_CONTROL entity);
        AVAT_CONTROL Update(AVAT_CONTROL entity);
        AVAT_CONTROL GetById(int id);
        void Delete(int id);
    }
}
