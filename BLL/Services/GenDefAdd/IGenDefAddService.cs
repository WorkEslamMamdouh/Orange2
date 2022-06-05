using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.GenDefAdd
{
    public interface IGenDefAddService
    {
        I_Pur_D_Charges GetById(int id);
        List<I_Pur_D_Charges> GetAll();
        List<I_Pur_D_Charges> GetAll(Expression<Func<I_Pur_D_Charges, bool>> predicate);
        I_Pur_D_Charges Insert(I_Pur_D_Charges entity);
        I_Pur_D_Charges Update(I_Pur_D_Charges entity);
        void Delete(int id);
        void UpdateList(List<I_Pur_D_Charges> Lstservice);
    }
}
