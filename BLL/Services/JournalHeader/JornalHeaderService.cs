using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.JournalHeader
{
 public  class JornalHeaderService : IJornalHeaderService
    {
        private readonly IUnitOfWork unitOfWork;

        public JornalHeaderService(IUnitOfWork _unitOfWork)
        {
            this.unitOfWork = _unitOfWork;
        }
        public A_JOURNAL_HEADER GetById(int id)
        {
            return unitOfWork.Repository<A_JOURNAL_HEADER>().GetById(id);
        }

        public List<A_JOURNAL_HEADER> GetAll(Expression<Func<A_JOURNAL_HEADER, bool>> predicate)
        {
            return unitOfWork.Repository<A_JOURNAL_HEADER>().Get(predicate);
        }

        public A_JOURNAL_HEADER Insert(A_JOURNAL_HEADER entity)
        {
            var Item = unitOfWork.Repository<A_JOURNAL_HEADER>().Insert(entity);
            unitOfWork.Save();
            return Item;
        }
        public A_JOURNAL_HEADER Update(A_JOURNAL_HEADER entity)
        {

            var Item = unitOfWork.Repository<A_JOURNAL_HEADER>().Update(entity);
            unitOfWork.Save();
            return Item;
        }
        public void UpdateList(List<A_JOURNAL_HEADER> entityList)
        {
            unitOfWork.Repository<A_JOURNAL_HEADER>().Update(entityList);
            unitOfWork.Save();

        }
    }
}
