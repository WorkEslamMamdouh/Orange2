using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.AccDtCostCenters
{
   

    public class A_CCDT_COSTCENTERSService : IA_CCDT_COSTCENTERSService
    {
        private readonly IUnitOfWork unitOfWork;

        public A_CCDT_COSTCENTERSService(IUnitOfWork _unitOfWork)
        {
            this.unitOfWork = _unitOfWork;
        }


        #region  Services
        public A_CCDT_COSTCENTERS GetById(int id)
        {
            return unitOfWork.Repository<A_CCDT_COSTCENTERS>().GetById(id);
        }

        public List<A_CCDT_COSTCENTERS> GetAll()
        {
            return unitOfWork.Repository<A_CCDT_COSTCENTERS>().GetAll();
        }

        public List<A_CCDT_COSTCENTERS> GetAll(Expression<Func<A_CCDT_COSTCENTERS, bool>> predicate)
        {
            return unitOfWork.Repository<A_CCDT_COSTCENTERS>().Get(predicate);
        }

        public A_CCDT_COSTCENTERS Insert(A_CCDT_COSTCENTERS entity)
        {
            var res = unitOfWork.Repository<A_CCDT_COSTCENTERS>().Insert(entity);
            unitOfWork.Save();
            return res;
        }

        public A_CCDT_COSTCENTERS Update(A_CCDT_COSTCENTERS entity)
        {

            var res = unitOfWork.Repository<A_CCDT_COSTCENTERS>().Update(entity);
            unitOfWork.Save();
            return res;
        }

        public void Delete(int id)
        {
            unitOfWork.Repository<A_CCDT_COSTCENTERS>().Delete(id);
            unitOfWork.Save();
        }
        public void Delete(A_CCDT_COSTCENTERS obj)
        {
            unitOfWork.Repository<A_CCDT_COSTCENTERS>().Delete(obj);
            unitOfWork.Save();
        }
        //public void UpdateList(List<A_CCDT_COSTCENTERS> Lst)
        //{

        //    var insertedRecord = Lst.Where(x => x.StatusFlag == 'i');
        //    var updatedRecord = Lst.Where(x => x.StatusFlag == 'u');
        //    var deletedRecord = Lst.Where(x => x.StatusFlag == 'd');

        //    if (updatedRecord.Count() > 0)
        //        unitOfWork.Repository<A_CCDT_COSTCENTERS>().Update(updatedRecord);

        //    if (insertedRecord.Count() > 0)
        //        unitOfWork.Repository<A_CCDT_COSTCENTERS>().Insert(insertedRecord);


        //    if (deletedRecord.Count() > 0)
        //    {
        //        foreach (var entity in deletedRecord)
        //            unitOfWork.Repository<A_CCDT_COSTCENTERS>().Delete(entity);
        //    }

        //    unitOfWork.Save();

        //}

        public void UpdateList(List<A_CCDT_COSTCENTERS> updatedRecord)
        {
            if (updatedRecord.Count() > 0)
            {
                unitOfWork.Repository<A_CCDT_COSTCENTERS>().Update(updatedRecord);
                unitOfWork.Save();
            }
        }


        public void InsertList(List<A_CCDT_COSTCENTERS> insertedRecord)
        {
            if (insertedRecord.Count() > 0)
            {
                unitOfWork.Repository<A_CCDT_COSTCENTERS>().Insert(insertedRecord);
                unitOfWork.Save();
            }
        }

        #endregion
    }





}
