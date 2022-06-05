using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
namespace Inv.BLL.Services.ITRCollect
{
   


    public class I_TR_CollectService : II_TR_CollectService
    {
        private readonly IUnitOfWork unitOfWork;

        public I_TR_CollectService(IUnitOfWork _unitOfWork)
        {
            this.unitOfWork = _unitOfWork;
        }


        #region  Services
        public I_TR_Collect GetById(int id)
        {
            return unitOfWork.Repository<I_TR_Collect>().GetById(id);
        }

        public List<I_TR_Collect> GetAll()
        {
            return unitOfWork.Repository<I_TR_Collect>().GetAll();
        }

        public List<I_TR_Collect> GetAll(Expression<Func<I_TR_Collect, bool>> predicate)
        {
            return unitOfWork.Repository<I_TR_Collect>().Get(predicate);
        }

        public I_TR_Collect Insert(I_TR_Collect entity)
        {
            var memb = unitOfWork.Repository<I_TR_Collect>().Insert(entity);
            unitOfWork.Save();
            return memb;
        }

        public I_TR_Collect Update(I_TR_Collect entity)
        {

            var memb = unitOfWork.Repository<I_TR_Collect>().Update(entity);
            unitOfWork.Save();
            return memb;
        }

        public void Delete(int id)
        {
            unitOfWork.Repository<I_TR_Collect>().Delete(id);
            unitOfWork.Save();
        }

     
        #endregion
    }
}
