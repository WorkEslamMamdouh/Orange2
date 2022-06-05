using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.Nationality
{
    public class NationalityService : INationalityService
    {
        private readonly IUnitOfWork unitOfWork;

        public NationalityService(IUnitOfWork _unitOfWork)
        {
            this.unitOfWork = _unitOfWork;
        }


        #region Nationality Services
        public G_Nationality GetById(int id)
        {
            return unitOfWork.Repository<G_Nationality>().GetById(id);
        }

        public List<G_Nationality> GetAll()
        {
            return unitOfWork.Repository<G_Nationality>().GetAll();
        }

        public List<G_Nationality> GetAll(Expression<Func<G_Nationality, bool>> predicate)
        {
            return unitOfWork.Repository<G_Nationality>().Get(predicate);
        }

        public G_Nationality Insert(G_Nationality entity)
        {
            var memb = unitOfWork.Repository<G_Nationality>().Insert(entity);
            unitOfWork.Save();
            return memb;
        }

        public G_Nationality Update(G_Nationality entity)
        {
           
            var memb= unitOfWork.Repository<G_Nationality>().Update(entity);
            unitOfWork.Save();
            return memb;
        }

        public void Delete(int id)
        {
            unitOfWork.Repository<G_Nationality>().Delete(id);
            unitOfWork.Save();
        }

        public void UpdateList(List<G_Nationality> Lstservice)
        // public void UpdateList(string s)
        {

            var insertedRecord = Lstservice.Where(x => x.StatusFlag == 'i');
            var updatedRecord = Lstservice.Where(x => x.StatusFlag == 'u');
            var deletedRecord = Lstservice.Where(x => x.StatusFlag == 'd');

            if (updatedRecord.Count() > 0)
                unitOfWork.Repository<G_Nationality>().Update(updatedRecord);

            if (insertedRecord.Count() > 0)
                unitOfWork.Repository<G_Nationality>().Insert(insertedRecord);


            if (deletedRecord.Count() > 0)
            {
                foreach (var entity in deletedRecord)
                    unitOfWork.Repository<G_Nationality>().Delete(entity.NationalityID);
            }

            unitOfWork.Save();

        }
        #endregion
    }
}
