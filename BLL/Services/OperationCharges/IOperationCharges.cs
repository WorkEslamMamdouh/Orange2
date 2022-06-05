using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.OperationCharges
{
    public interface IOperationCharges
    {
        I_TR_OperationCharges GetById(int id);
        I_TR_OperationCharges GetByIdFromIItem(int id);
        List<I_TR_OperationCharges> GetAll();
        List<I_TR_OperationCharges> GetAll(Expression<Func<I_TR_OperationCharges, bool>> predicate);
        I_TR_OperationCharges Insert(I_TR_OperationCharges entity);
        I_TR_OperationCharges Update(I_TR_OperationCharges entity);
        void InsertLst(List<I_TR_OperationCharges> obj);
        void Delete(int id);
    }
}
