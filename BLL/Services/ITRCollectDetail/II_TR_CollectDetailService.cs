using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.ITRCollectDetail
{
   

    public interface II_TR_CollectDetailService
    {
        I_TR_CollectDetail GetById(int id);
        List<I_TR_CollectDetail> GetAll();
        List<I_TR_CollectDetail> GetAll(Expression<Func<I_TR_CollectDetail, bool>> predicate);
        I_TR_CollectDetail Insert(I_TR_CollectDetail entity);
        I_TR_CollectDetail Update(I_TR_CollectDetail entity);
        void UpdateList(List<I_TR_CollectDetail> Lst);
        void Delete(int id);
       
    }
}
