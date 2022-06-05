using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
namespace Inv.BLL.Services.ITRCollectDetail
{
   


    public class I_TR_CollectDetailService : II_TR_CollectDetailService
    {
        private readonly IUnitOfWork unitOfWork;

        public I_TR_CollectDetailService(IUnitOfWork _unitOfWork)
        {
            this.unitOfWork = _unitOfWork;
        }


        #region  Services
        public I_TR_CollectDetail GetById(int id)
        {
            return unitOfWork.Repository<I_TR_CollectDetail>().GetById(id);
        }

        public List<I_TR_CollectDetail> GetAll()
        {
            return unitOfWork.Repository<I_TR_CollectDetail>().GetAll();
        }

        public List<I_TR_CollectDetail> GetAll(Expression<Func<I_TR_CollectDetail, bool>> predicate)
        {
            return unitOfWork.Repository<I_TR_CollectDetail>().Get(predicate);
        }

        public I_TR_CollectDetail Insert(I_TR_CollectDetail entity)
        {
            var memb = unitOfWork.Repository<I_TR_CollectDetail>().Insert(entity);
            unitOfWork.Save();
            return memb;
        }

        public I_TR_CollectDetail Update(I_TR_CollectDetail entity)
        {

            var memb = unitOfWork.Repository<I_TR_CollectDetail>().Update(entity);
            unitOfWork.Save();
            return memb;
        }

        public void Delete(int id)
        {
            unitOfWork.Repository<I_TR_CollectDetail>().Delete(id);
            unitOfWork.Save();
        }

        public void UpdateList(List<I_TR_CollectDetail> Lst)
        {

            var insertedRecord = Lst.Where(x => x.StatusFlag == 'i');
            var updatedRecord = Lst.Where(x => x.StatusFlag == 'u');
            var deletedRecord = Lst.Where(x => x.StatusFlag == 'd');

            if (updatedRecord.Count() > 0)
                unitOfWork.Repository<I_TR_CollectDetail>().Update(updatedRecord);

            if (insertedRecord.Count() > 0)
                unitOfWork.Repository<I_TR_CollectDetail>().Insert(insertedRecord);


            if (deletedRecord.Count() > 0)
            {
                foreach (var entity in deletedRecord)
                    unitOfWork.Repository<I_TR_CollectDetail>().Delete(entity.CollectDetailID);
            }

            unitOfWork.Save();

        }
        #endregion
    }
}
