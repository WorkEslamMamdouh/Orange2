using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;


namespace Inv.BLL.Services.GlnktransTemp
{
    public interface IGlnktransTempService
    {
        G_LnkTrans_Temp GetById(int id);
        List<G_LnkTrans_Temp> GetAll();
        List<G_LnkTrans_Temp> GetAll(Expression<Func<G_LnkTrans_Temp, bool>> predicate);
        void InsertLst(List<G_LnkTrans_Temp> obj);
        void UpdateList(List<G_LnkTrans_Temp> Lstservice);
    }
}
