using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.AVATPeriodDetail
{
 
    public class AVAT_PeriodDetailService : IAVAT_PeriodDetailService
    {
        private readonly IUnitOfWork unitOfWork;

        public AVAT_PeriodDetailService(IUnitOfWork _unitOfWork)
        {
            this.unitOfWork = _unitOfWork;
        }
        public AVAT_PeriodDetail GetById(int id)
        {
            return unitOfWork.Repository<AVAT_PeriodDetail>().GetById(id);
        }

        public List<AVAT_PeriodDetail> GetAll(Expression<Func<AVAT_PeriodDetail, bool>> predicate)
        {
            return unitOfWork.Repository<AVAT_PeriodDetail>().Get(predicate);
        }

        public List<AVAT_PeriodDetail> GetAll()
        {
            return unitOfWork.Repository<AVAT_PeriodDetail>().GetAll();
        }

        public AVAT_PeriodDetail Insert(AVAT_PeriodDetail entity)
        {
            var Item = unitOfWork.Repository<AVAT_PeriodDetail>().Insert(entity);
            unitOfWork.Save();
            return Item;
        }
        public AVAT_PeriodDetail Update(AVAT_PeriodDetail entity)
        {

            var Item = unitOfWork.Repository<AVAT_PeriodDetail>().Update(entity);
            unitOfWork.Save();
            return Item;
        }

        public void Delete(int id)
        {
            unitOfWork.Repository<AVAT_PeriodDetail>().Delete(id);
            unitOfWork.Save();
        }
    }
}
