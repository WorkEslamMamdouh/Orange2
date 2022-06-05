using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.GenDefAdd
{
  public  class GenDefAddService : IGenDefAddService
    {
        private readonly IUnitOfWork unitOfWork;

        public GenDefAddService(IUnitOfWork _unitOfWork)
        {
            this.unitOfWork = _unitOfWork;
        }

        #region IGenDefGroup Services

        public I_Pur_D_Charges GetById(int id)
        {
            return unitOfWork.Repository<I_Pur_D_Charges>().GetById(id);
        }

        public List<I_Pur_D_Charges> GetAll()
        {
            return unitOfWork.Repository<I_Pur_D_Charges>().GetAll();
        }

        public List<I_Pur_D_Charges> GetAll(Expression<Func<I_Pur_D_Charges, bool>> predicate)
        {
            return unitOfWork.Repository<I_Pur_D_Charges>().Get(predicate);
        }

        public I_Pur_D_Charges Insert(I_Pur_D_Charges entity)
        {
            var memb = unitOfWork.Repository<I_Pur_D_Charges>().Insert(entity);
            unitOfWork.Save();
            return memb;
        }

        public I_Pur_D_Charges Update(I_Pur_D_Charges entity)
        {

            var memb = unitOfWork.Repository<I_Pur_D_Charges>().Update(entity);
            unitOfWork.Save();
            return memb;
        }

        public void Delete(int id)
        {
            unitOfWork.Repository<I_Pur_D_Charges>().Delete(id);
            unitOfWork.Save();
        }

        public void UpdateList(List<I_Pur_D_Charges> Lstservice)
        {

            
            foreach (var entity in Lstservice)
            {
                if (entity.StatusFlag == 'd')
                    unitOfWork.Repository<I_Pur_D_Charges>().Delete(entity.ChargeID );
                if (entity.StatusFlag == 'u')
                { 
                    unitOfWork.Repository<I_Pur_D_Charges>().Update(entity);
                }
                if (entity.StatusFlag == 'i')
                { 
                    unitOfWork.Repository<I_Pur_D_Charges>().Insert(entity);
                }

            }

            unitOfWork.Save();

        }
        #endregion

    }
}
