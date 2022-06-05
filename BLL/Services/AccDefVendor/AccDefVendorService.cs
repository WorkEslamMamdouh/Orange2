using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;


namespace Inv.BLL.Services.AccDefVendor
{
    public class AccDefVendorService:IAccDefVendorService
    {
        private readonly IUnitOfWork unitOfWork;

        public AccDefVendorService(IUnitOfWork _unitOfWork)
        {
            this.unitOfWork = _unitOfWork;
        }

        #region AccDefVendorService Services
        public A_Pay_D_Vendor GetById(int id)
        {
            return unitOfWork.Repository<A_Pay_D_Vendor>().GetById(id);
        }

        public List<A_Pay_D_Vendor> GetAll()
        {
            return unitOfWork.Repository<A_Pay_D_Vendor>().GetAll();
        }

        public List<A_Pay_D_Vendor> GetAll(Expression<Func<A_Pay_D_Vendor, bool>> predicate)
        {
            return unitOfWork.Repository<A_Pay_D_Vendor>().Get(predicate);
        }

        public A_Pay_D_Vendor Insert(A_Pay_D_Vendor entity)
        {
            var AccDefAccount = unitOfWork.Repository<A_Pay_D_Vendor>().Insert(entity);
            unitOfWork.Save();
            return AccDefAccount;
        }

        public A_Pay_D_Vendor Update(A_Pay_D_Vendor entity)
        {

            var vendor = unitOfWork.Repository<A_Pay_D_Vendor>().Update(entity);
            unitOfWork.Save();
            return vendor;
        }
        

        public void UpdateList(List<A_Pay_D_Vendor> vendorList)
        {

            foreach (var entity in vendorList)
            {
                if (entity.StatusFlag == 'd')
                    unitOfWork.Repository<A_Pay_D_Vendor>().Delete(entity.VendorID);
                if (entity.StatusFlag == 'u')
                {
                    entity.UPDATED_AT = DateTime.Now;
                    unitOfWork.Repository<A_Pay_D_Vendor>().Update(entity);
                }
                if (entity.StatusFlag == 'i')
                {
                    entity.CREATED_AT = DateTime.Now;
                    unitOfWork.Repository<A_Pay_D_Vendor>().Insert(entity);
                }
            }
            unitOfWork.Save();

        }
        #endregion
        #region Detail Services
        public List<A_Pay_D_VendorDoc> GetAll(Expression<Func<A_Pay_D_VendorDoc, bool>> predicate)
        {
            return unitOfWork.Repository<A_Pay_D_VendorDoc>().Get(predicate);
        }

        public void InsertLst(List<A_Pay_D_VendorDoc> obj)
        {
            unitOfWork.Repository<A_Pay_D_VendorDoc>().Insert(obj);
            unitOfWork.Save();
            return;
        }

        public A_Pay_D_VendorDoc Insert(A_Pay_D_VendorDoc entity)
        {
            var AccDefAccount = unitOfWork.Repository<A_Pay_D_VendorDoc>().Insert(entity);
            unitOfWork.Save();
            return AccDefAccount;
        }

        public A_Pay_D_VendorDoc Update(A_Pay_D_VendorDoc entity)
        {

            var AccDefAccount = unitOfWork.Repository<A_Pay_D_VendorDoc>().Update(entity);
            unitOfWork.Save();
            return AccDefAccount;
        }

        public void Delete(int id)
        {
            unitOfWork.Repository<A_Pay_D_VendorDoc>().Delete(id);
            unitOfWork.Save();
        }

        #endregion
    }
}
