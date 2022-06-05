using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.AVAT_D_Servicee
{
    public class AVAT_D_ServiceService : IAVAT_D_ServiceService
    {
        private readonly IUnitOfWork unitOfWork;

        public AVAT_D_ServiceService(IUnitOfWork _unitOfWork)
        {
            this.unitOfWork = _unitOfWork;
        }



        public AVAT_D_Service GetById(int id)
        {
            return unitOfWork.Repository<AVAT_D_Service>().GetById(id);
        }

        public List<AVAT_D_Service> GetAll()
        {
            return unitOfWork.Repository<AVAT_D_Service>().GetAll();
        }

        public List<AVAT_D_Service> GetAll(Expression<Func<AVAT_D_Service, bool>> predicate)
        {
            return unitOfWork.Repository<AVAT_D_Service>().Get(predicate);
        }


        public AVAT_D_Service Insert(AVAT_D_Service entity)
        {
            var memb = unitOfWork.Repository<AVAT_D_Service>().Insert(entity);
            unitOfWork.Save();
            return memb;
        }

        public AVAT_D_Service Update(AVAT_D_Service entity)
        {

            var memb = unitOfWork.Repository<AVAT_D_Service>().Update(entity);
            unitOfWork.Save();
            return memb;
        }

        public void Delete(int id)
        {
            unitOfWork.Repository<AVAT_D_Service>().Delete(id);
            unitOfWork.Save();
        }





    }
}
