using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.AccDefCustomer
{
    public class AccDefCustomerService: IAccDefCustomerService
    {
        private readonly IUnitOfWork unitOfWork;

        public AccDefCustomerService(IUnitOfWork _unitOfWork)
        {
            this.unitOfWork = _unitOfWork;
        }

        #region AccDefCustomerService Services
        public A_Rec_D_Customer GetById(int id)
        {
            return unitOfWork.Repository<A_Rec_D_Customer>().GetById(id);
        }

        public List<A_Rec_D_Customer> GetAll()
        {
            return unitOfWork.Repository<A_Rec_D_Customer>().GetAll();
        }

        public List<A_Rec_D_Customer> GetAll(Expression<Func<A_Rec_D_Customer, bool>> predicate)
        {
            return unitOfWork.Repository<A_Rec_D_Customer>().Get(predicate);
        }

        public A_Rec_D_Customer Insert(A_Rec_D_Customer entity)
        {
            var AccDefAccount = unitOfWork.Repository<A_Rec_D_Customer>().Insert(entity);
            unitOfWork.Save();
            return AccDefAccount;
        }

        public A_Rec_D_Customer Update(A_Rec_D_Customer entity)
        {

            var AccDefAccount = unitOfWork.Repository<A_Rec_D_Customer>().Update(entity);
            unitOfWork.Save();
            return AccDefAccount;
        }

     
        //public void UpdateList(List<A_Rec_D_Customer> AccDefAccountList)
        //{

        //    foreach (var entity in AccDefAccountList)
        //    {
        //        if (entity.StatusFlag == 'd')
        //            unitOfWork.Repository<A_Rec_D_Customer>().Delete(entity.CustomerId);
        //        if (entity.StatusFlag == 'u')
        //        {
        //            entity.UPDATED_AT = DateTime.Now;
        //            unitOfWork.Repository<A_Rec_D_Customer>().Update(entity);
        //        }
        //        if (entity.StatusFlag == 'i')
        //        {
        //            entity.CREATED_AT = DateTime.Now;
        //            unitOfWork.Repository<A_Rec_D_Customer>().Insert(entity);
        //        }
        //    }
        //    unitOfWork.Save();

        //}
        #endregion


        #region Detail Services
        public List<A_Rec_D_CustomerDoc> GetAll(Expression<Func<A_Rec_D_CustomerDoc, bool>> predicate)
        {
            return unitOfWork.Repository<A_Rec_D_CustomerDoc>().Get(predicate);
        }

        public void InsertLst(List<A_Rec_D_CustomerDoc> obj)
        {
            unitOfWork.Repository<A_Rec_D_CustomerDoc>().Insert(obj);
            unitOfWork.Save();
            return;
        }

        public A_Rec_D_CustomerDoc Insert(A_Rec_D_CustomerDoc entity)
        {
            var AccDefAccount = unitOfWork.Repository<A_Rec_D_CustomerDoc>().Insert(entity);
            unitOfWork.Save();
            return AccDefAccount;
        }

        public A_Rec_D_CustomerDoc Update(A_Rec_D_CustomerDoc entity)
        {

            var AccDefAccount = unitOfWork.Repository<A_Rec_D_CustomerDoc>().Update(entity);
            unitOfWork.Save();
            return AccDefAccount;
        }

        public void Delete(int id)
        {
            unitOfWork.Repository<A_Rec_D_CustomerDoc>().Delete(id);
            unitOfWork.Save();
        }

        #endregion
    }
}
