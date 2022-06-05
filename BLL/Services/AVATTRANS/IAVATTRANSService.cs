using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.AVATTRANS
{
   
    public interface IAVATTRANSService
    {
        List<AVAT_TRANS> GetAll();
        List<AVAT_TRANS> GetAll(Expression<Func<AVAT_TRANS, bool>> predicate);
        AVAT_TRANS Insert(AVAT_TRANS entity);
        AVAT_TRANS Update(AVAT_TRANS entity);
        AVAT_TRANS GetById(int id);
        void Delete(int id);
    }
}
