using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.operationItemsSum
{
    public interface IOperationItemsSum
    {
        I_TR_OperationItemsSum GetById(int id);
        I_TR_OperationItemsSum GetByIdFromIItem(int id);
        List<I_TR_OperationItemsSum> GetAll();
        List<I_TR_OperationItemsSum> GetAll(Expression<Func<I_TR_OperationItemsSum, bool>> predicate);
        I_TR_OperationItemsSum Insert(I_TR_OperationItemsSum entity);
         I_TR_OperationItemsSum Update(I_TR_OperationItemsSum entity);
        void InsertLst(List<I_TR_OperationItemsSum> obj);
        void Delete(int id);
    }
}
