using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
namespace Inv.BLL.Services.OperationCharges
{
  public  class OperationCharges : IOperationCharges
    {
        private readonly IUnitOfWork unitOfWork;
        
        public OperationCharges(IUnitOfWork _unitOfWork)
        {
            this.unitOfWork = _unitOfWork;
        }
        #region ItemDefService Services

        public I_TR_OperationCharges GetById(int id)
        {
            return unitOfWork.Repository<I_TR_OperationCharges>().GetById(id);
        }
        public I_TR_OperationCharges GetByIdFromIItem(int id)
        {
            return unitOfWork.Repository<I_TR_OperationCharges>().GetById(id);
        }

        public List<I_TR_OperationCharges> GetAll()
        {
            return unitOfWork.Repository<I_TR_OperationCharges>().GetAll();
        }

        public List<I_TR_OperationCharges> GetAll(Expression<Func<I_TR_OperationCharges, bool>> predicate)
        {
            return unitOfWork.Repository<I_TR_OperationCharges>().Get(predicate);
        }

        public I_TR_OperationCharges Insert(I_TR_OperationCharges entity)
        {
            var Item = unitOfWork.Repository<I_TR_OperationCharges>().Insert(entity);
            unitOfWork.Save();
            return Item;
        }

        public I_TR_OperationCharges Update(I_TR_OperationCharges entity)
        {

            var Item = unitOfWork.Repository<I_TR_OperationCharges>().Update(entity);
            unitOfWork.Save();
            return Item;
        }

        public void Delete(int id)
        {
            unitOfWork.Repository<I_TR_OperationCharges>().Delete(id);
            unitOfWork.Save();
        }

        public void InsertLst(List<I_TR_OperationCharges> obj)
        {
            unitOfWork.Repository<I_TR_OperationCharges>().Insert(obj);
            unitOfWork.Save();
            return;
        }

        //public void UpdateList(List<I_Item> Lstservice)
        //// public void UpdateList(string s)
        //{

        //    var insertedRecord = Lstservice.Where(x => x.StatusFlag == 'i');
        //    var updatedRecord = Lstservice.Where(x => x.StatusFlag == 'u');
        //    var deletedRecord = Lstservice.Where(x => x.StatusFlag == 'd');

        //    if (updatedRecord.Count() > 0)
        //        unitOfWork.Repository<G_Nationality>().Update(updatedRecord);

        //    if (insertedRecord.Count() > 0)
        //        unitOfWork.Repository<G_Nationality>().Insert(insertedRecord);


        //    if (deletedRecord.Count() > 0)
        //    {
        //        foreach (var entity in deletedRecord)
        //            unitOfWork.Repository<G_Nationality>().Delete(entity.NationalityID);
        //    }

        //    unitOfWork.Save();

        //}
        #endregion
    }
}
