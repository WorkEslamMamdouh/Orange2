using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.OperationItems
{
    public interface IOperationItems
    {
        I_TR_OperationItems GetById(int id);
        I_TR_OperationItems GetByIdFromIItem(int id);
        List<I_TR_OperationItems> GetAll();
        List<I_TR_OperationItems> GetAll(Expression<Func<I_TR_OperationItems, bool>> predicate);
        I_TR_OperationItems Insert(I_TR_OperationItems entity);
        I_TR_OperationItems Update(I_TR_OperationItems entity);
        void InsertLst(List<I_TR_OperationItems> obj);
        void Delete(int id);
    }
}
