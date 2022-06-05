using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.Processes
{
    public interface IProcesses
    {
        I_TR_Operation GetById(int id);
        I_TR_Operation GetByIdFromIItem(int id);
        List<I_TR_Operation> GetAll();
        List<I_TR_Operation> GetAll(Expression<Func<I_TR_Operation, bool>> predicate);
        I_TR_Operation Insert(I_TR_Operation entity);
        I_TR_Operation Update(I_TR_Operation entity);
        void InsertLst(List<I_TR_Operation> obj);
        void Delete(int id);
    }
}
