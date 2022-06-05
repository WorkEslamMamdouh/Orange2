using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.AVATSrvCategory
{
    public class AVATSrvCategoryService : IAVATSrvCategoryService
    {
        private readonly IUnitOfWork unitOfWork;

        public AVATSrvCategoryService(IUnitOfWork _unitOfWork)
        {
            this.unitOfWork = _unitOfWork;
        }



        public AVAT_D_SrvCategory GetById(int id)
        {
            return unitOfWork.Repository<AVAT_D_SrvCategory>().GetById(id);
        }

        public List<AVAT_D_SrvCategory> GetAll()
        {
            return unitOfWork.Repository<AVAT_D_SrvCategory>().GetAll();
        }

        public List<AVAT_D_SrvCategory> GetAll(Expression<Func<AVAT_D_SrvCategory, bool>> predicate)
        {
            return unitOfWork.Repository<AVAT_D_SrvCategory>().Get(predicate);
        }


        public AVAT_D_SrvCategory Insert(AVAT_D_SrvCategory entity)
        {
            var memb = unitOfWork.Repository<AVAT_D_SrvCategory>().Insert(entity);
            unitOfWork.Save();
            return memb;
        }

        public AVAT_D_SrvCategory Update(AVAT_D_SrvCategory entity)
        {

            var memb = unitOfWork.Repository<AVAT_D_SrvCategory>().Update(entity);
            unitOfWork.Save();
            return memb;
        }

        public void Delete(int id)
        {
            unitOfWork.Repository<AVAT_D_SrvCategory>().Delete(id);
            unitOfWork.Save();
        }





    }
}
