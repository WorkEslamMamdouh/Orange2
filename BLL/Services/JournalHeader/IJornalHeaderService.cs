using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.JournalHeader
{
    public interface IJornalHeaderService
    {
        List<A_JOURNAL_HEADER> GetAll(Expression<Func<A_JOURNAL_HEADER, bool>> predicate);
        A_JOURNAL_HEADER Insert(A_JOURNAL_HEADER entity);
        A_JOURNAL_HEADER Update(A_JOURNAL_HEADER entity);
        void UpdateList(List<A_JOURNAL_HEADER> Lstservice);
        A_JOURNAL_HEADER GetById(int id);
    }
}
