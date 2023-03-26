using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;


namespace Inv.BLL.Services.Glnktrans
{
    public interface IGlnktransService
    {
        GQ_GetLnkTransComp GetById(int id);
        List<GQ_GetLnkTransComp> GetAll();
        List<GQ_GetLnkTransComp> GetAll(Expression<Func<GQ_GetLnkTransComp, bool>> predicate);
    }
}
