using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;


namespace Inv.BLL.Services.G_LnkTran
{
    public interface IG_LnkTransService
    {
        G_LnkTrans GetById(int id);
        List<G_LnkTrans> GetAll();
        List<G_LnkTrans> GetAll(Expression<Func<G_LnkTrans, bool>> predicate);
    }
}
