using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.AVATCONTROL
{
   
    public class AVAT_CONTROLService : IAVAT_CONTROLService
    {
        private readonly IUnitOfWork unitOfWork;

        public AVAT_CONTROLService(IUnitOfWork _unitOfWork)
        {
            this.unitOfWork = _unitOfWork;
        }
        public AVAT_CONTROL GetById(int id)
        {
            return unitOfWork.Repository<AVAT_CONTROL>().GetById(id);
        }

        public List<AVAT_CONTROL> GetAll(Expression<Func<AVAT_CONTROL, bool>> predicate)
        {
            return unitOfWork.Repository<AVAT_CONTROL>().Get(predicate);
        }

        public List<AVAT_CONTROL> GetAll()
        {
            return unitOfWork.Repository<AVAT_CONTROL>().GetAll();
        }

        public AVAT_CONTROL Insert(AVAT_CONTROL entity)
        {
            var Item = unitOfWork.Repository<AVAT_CONTROL>().Insert(entity);
            unitOfWork.Save();
            return Item;
        }
        public AVAT_CONTROL Update(AVAT_CONTROL entity)
        {

            var Item = unitOfWork.Repository<AVAT_CONTROL>().Update(entity);
            unitOfWork.Save();
            return Item;
        }
        
        public void Delete(int id)
        {
            unitOfWork.Repository<AVAT_CONTROL>().Delete(id);
            unitOfWork.Save();
        }
    }
}
