using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.JournalDetail
{
 public  class JournalDetailService : IJournalDetailService
    {
        private readonly IUnitOfWork unitOfWork;

        public JournalDetailService(IUnitOfWork _unitOfWork)
        {
            this.unitOfWork = _unitOfWork;
        }
        public List<A_JOURNAL_DETAIL> GetAll(Expression<Func<A_JOURNAL_DETAIL, bool>> predicate)
        {
            return unitOfWork.Repository<A_JOURNAL_DETAIL>().Get(predicate);
        }

        public void InsertLst(List<A_JOURNAL_DETAIL> obj)
        {
            unitOfWork.Repository<A_JOURNAL_DETAIL>().Insert(obj);
            unitOfWork.Save();
            return;
        }

        public A_JOURNAL_DETAIL Insert(A_JOURNAL_DETAIL entity)
        {
            var AccDefAccount = unitOfWork.Repository<A_JOURNAL_DETAIL>().Insert(entity);
            unitOfWork.Save();
            return AccDefAccount;
        }

        public A_JOURNAL_DETAIL Update(A_JOURNAL_DETAIL entity)
        {

            var AccDefAccount = unitOfWork.Repository<A_JOURNAL_DETAIL>().Update(entity);
            unitOfWork.Save();
            return AccDefAccount;
        }

        public void Delete(int id)
        {
            unitOfWork.Repository<A_JOURNAL_DETAIL>().Delete(id);
            unitOfWork.Save();
        }

    }
}
