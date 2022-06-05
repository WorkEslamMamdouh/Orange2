using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
namespace Inv.BLL.Services.Processes
{
  public  class Processes: IProcesses
    {
        private readonly IUnitOfWork unitOfWork;
        
        public Processes(IUnitOfWork _unitOfWork)
        {
            this.unitOfWork = _unitOfWork;
        }
        #region ItemDefService Services

        public I_TR_Operation GetById(int id)
        {
            return unitOfWork.Repository<I_TR_Operation>().GetById(id);
        }
        public I_TR_Operation GetByIdFromIItem(int id)
        {
            return unitOfWork.Repository<I_TR_Operation>().GetById(id);
        }

        public List<I_TR_Operation> GetAll()
        {
            return unitOfWork.Repository<I_TR_Operation>().GetAll();
        }

        public List<I_TR_Operation> GetAll(Expression<Func<I_TR_Operation, bool>> predicate)
        {
            return unitOfWork.Repository<I_TR_Operation>().Get(predicate);
        }

        public I_TR_Operation Insert(I_TR_Operation entity)
        {
            var Item = unitOfWork.Repository<I_TR_Operation>().Insert(entity);
            unitOfWork.Save();
            return Item;
        }

        public I_TR_Operation Update(I_TR_Operation entity)
        {

            var Item = unitOfWork.Repository<I_TR_Operation>().Update(entity);
            unitOfWork.Save();
            return Item;
        }

        public void Delete(int id)
        {
            unitOfWork.Repository<I_TR_Operation>().Delete(id);
            unitOfWork.Save();
        }

        public void InsertLst(List<I_TR_Operation> obj)
        {
            unitOfWork.Repository<I_TR_Operation>().Insert(obj);
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
