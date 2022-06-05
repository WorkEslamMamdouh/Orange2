using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.JournalDetail
{
    public interface IJournalDetailService
    {
        List<A_JOURNAL_DETAIL> GetAll(Expression<Func<A_JOURNAL_DETAIL, bool>> predicate);
        void InsertLst(List<A_JOURNAL_DETAIL> obj);
        A_JOURNAL_DETAIL Insert(A_JOURNAL_DETAIL entity);
        A_JOURNAL_DETAIL Update(A_JOURNAL_DETAIL entity);
        void Delete(int id);
    }
}
