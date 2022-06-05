using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.GLDefAccount_year
{
   public class GLDefAccount_yearService : IGLDefAccount_yearService
    {
        private readonly IUnitOfWork unitOfWork;

        public GLDefAccount_yearService(IUnitOfWork _unitOfWork)
        {
            this.unitOfWork = _unitOfWork;
        }
        #region IGenDefCategory Services

        public A_ACCOUNT_YEAR GetById(int id)
        {
            return unitOfWork.Repository<A_ACCOUNT_YEAR>().GetById(id);
        }

        public List<A_ACCOUNT_YEAR> GetAll()
        {
            return unitOfWork.Repository<A_ACCOUNT_YEAR>().GetAll();
        }

        public List<A_ACCOUNT_YEAR> GetAll(Expression<Func<A_ACCOUNT_YEAR, bool>> predicate)
        {
            return unitOfWork.Repository<A_ACCOUNT_YEAR>().Get(predicate);
        }

        public A_ACCOUNT_YEAR Insert(A_ACCOUNT_YEAR entity)
        {
            var memb = unitOfWork.Repository<A_ACCOUNT_YEAR>().Insert(entity);
            unitOfWork.Save();
            return memb;
        }

        public A_ACCOUNT_YEAR Update(A_ACCOUNT_YEAR entity)
        {

            var memb = unitOfWork.Repository<A_ACCOUNT_YEAR>().Update(entity);
            unitOfWork.Save();
            return memb;
        }

        public void Delete(int id)
        {
            unitOfWork.Repository<A_ACCOUNT_YEAR>().Delete(id);
            unitOfWork.Save();
        }
        #endregion
    }
}
