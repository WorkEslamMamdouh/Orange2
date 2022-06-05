using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;


namespace Inv.BLL.Services.PurDefCharges
{
   public interface IPurDefChargesService
    {
        I_Pur_D_Charges GetById(int id);
        List<I_Pur_D_Charges> GetAll();
        List<I_Pur_D_Charges> GetAll(Expression<Func<I_Pur_D_Charges, bool>> predicate);
    }
}
