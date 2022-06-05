using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.I_PeriodSer
{
   public class I_PeriodService : II_PeriodService
    {
        private readonly IUnitOfWork unitOfWork;

        public I_PeriodService(IUnitOfWork _unitOfWork)
        {
            this.unitOfWork = _unitOfWork;
        }


        #region I_Period Services
        public I_Period GetById(int id)
        {
            return unitOfWork.Repository<I_Period>().GetById(id);
        }

        public List<I_Period> GetAll()
        {
            return unitOfWork.Repository<I_Period>().GetAll();
        }

        public List<I_Period> GetAll(Expression<Func<I_Period, bool>> predicate)
        {
            return unitOfWork.Repository<I_Period>().Get(predicate);
        }

        public I_Period Insert(I_Period entity)
        {
            var memb = unitOfWork.Repository<I_Period>().Insert(entity);
            unitOfWork.Save();
            return memb;
        }

        public I_Period Update(I_Period entity)
        {

            var memb = unitOfWork.Repository<I_Period>().Update(entity);
            unitOfWork.Save();
            return memb;
        }

        public void Delete(int id)
        {
            unitOfWork.Repository<I_Period>().Delete(id);
            unitOfWork.Save();
        }  
        #endregion
    }
}
