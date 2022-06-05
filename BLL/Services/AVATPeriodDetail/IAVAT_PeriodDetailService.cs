using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.AVATPeriodDetail
{
    

    public interface IAVAT_PeriodDetailService
    {
        List<AVAT_PeriodDetail> GetAll();
        List<AVAT_PeriodDetail> GetAll(Expression<Func<AVAT_PeriodDetail, bool>> predicate);
        AVAT_PeriodDetail Insert(AVAT_PeriodDetail entity);
        AVAT_PeriodDetail Update(AVAT_PeriodDetail entity);
        AVAT_PeriodDetail GetById(int id);
        void Delete(int id);
    }


}
