using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.OperationDeposit
{
    public interface IOperationDeposit
    {
        I_TR_OperationDeposit GetById(int id);
        I_TR_OperationDeposit GetByIdFromIItem(int id);
        List<I_TR_OperationDeposit> GetAll();
        List<I_TR_OperationDeposit> GetAll(Expression<Func<I_TR_OperationDeposit, bool>> predicate);
        I_TR_OperationDeposit Insert(I_TR_OperationDeposit entity);
        I_TR_OperationDeposit Update(I_TR_OperationDeposit entity);
        void InsertLst(List<I_TR_OperationDeposit> obj);
        void Delete(int id);
    }
}
