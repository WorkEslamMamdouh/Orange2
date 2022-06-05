using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.AVATTRANS
{
  

    public class AVATTRANService : IAVATTRANSService
    {
        private readonly IUnitOfWork unitOfWork;

        public AVATTRANService(IUnitOfWork _unitOfWork)
        {
            this.unitOfWork = _unitOfWork;
        }
        public AVAT_TRANS GetById(int id)
        {
            return unitOfWork.Repository<AVAT_TRANS>().GetById(id);
        }

        public List<AVAT_TRANS> GetAll(Expression<Func<AVAT_TRANS, bool>> predicate)
        {
            return unitOfWork.Repository<AVAT_TRANS>().Get(predicate);
        }

        public List<AVAT_TRANS> GetAll()
        {
            return unitOfWork.Repository<AVAT_TRANS>().GetAll();
        }

        public AVAT_TRANS Insert(AVAT_TRANS entity)
        {
            var Item = unitOfWork.Repository<AVAT_TRANS>().Insert(entity);
            unitOfWork.Save();
            return Item;
        }
        public AVAT_TRANS Update(AVAT_TRANS entity)
        {

            var Item = unitOfWork.Repository<AVAT_TRANS>().Update(entity);
            unitOfWork.Save();
            return Item;
        }

        public void Delete(int id)
        {
            unitOfWork.Repository<AVAT_TRANS>().Delete(id);
            unitOfWork.Save();
        }
    }
}
