using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.AVATPERIOD
{
   

    public class AVAT_PERIODService : IAVAT_PERIODService
    {
        private readonly IUnitOfWork unitOfWork;

        public AVAT_PERIODService(IUnitOfWork _unitOfWork)
        {
            this.unitOfWork = _unitOfWork;
        }
        public AVAT_PERIOD GetById(int id)
        {
            return unitOfWork.Repository<AVAT_PERIOD>().GetById(id);
        }

        public List<AVAT_PERIOD> GetAll(Expression<Func<AVAT_PERIOD, bool>> predicate)
        {
            return unitOfWork.Repository<AVAT_PERIOD>().Get(predicate);
        }

        public List<AVAT_PERIOD> GetAll()
        {
            return unitOfWork.Repository<AVAT_PERIOD>().GetAll();
        }

        public AVAT_PERIOD Insert(AVAT_PERIOD entity)
        {
            var Item = unitOfWork.Repository<AVAT_PERIOD>().Insert(entity);
            unitOfWork.Save();
            return Item;
        }
        public AVAT_PERIOD Update(AVAT_PERIOD entity)
        {

            var Item = unitOfWork.Repository<AVAT_PERIOD>().Update(entity);
            unitOfWork.Save();
            return Item;
        }

        public void Delete(int id)
        {
            unitOfWork.Repository<AVAT_PERIOD>().Delete(id);
            unitOfWork.Save();
        }
    }



}
