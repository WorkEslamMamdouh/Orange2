using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.TmpVoucherProcess
{
    public interface ITmpVoucherProcessService
    {
        A_TmpVoucherProcess GetById(int id);
        List<A_TmpVoucherProcess> GetAll();
        List<A_TmpVoucherProcess> GetAll(Expression<Func<A_TmpVoucherProcess, bool>> predicate);
        A_TmpVoucherProcess Insert(A_TmpVoucherProcess entity);
        void InsertLst(List<A_TmpVoucherProcess> obj);
        A_TmpVoucherProcess Update(A_TmpVoucherProcess entity);
        void Delete(int id);
        void UpdateList(List<A_TmpVoucherProcess> Lstservice);
    }
}
