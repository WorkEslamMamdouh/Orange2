using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.AccDefVendor
{
   public interface IAccDefVendorService
    {// Header
        A_Pay_D_Vendor GetById(int id);
        List<A_Pay_D_Vendor> GetAll();
        List<A_Pay_D_Vendor> GetAll(Expression<Func<A_Pay_D_Vendor, bool>> predicate);
        A_Pay_D_Vendor Insert(A_Pay_D_Vendor entity);
        A_Pay_D_Vendor Update(A_Pay_D_Vendor entity); 
        void UpdateList(List<A_Pay_D_Vendor> Lstservice);
        
        //Detail
        List<A_Pay_D_VendorDoc> GetAll(Expression<Func<A_Pay_D_VendorDoc, bool>> predicate);
        void InsertLst(List<A_Pay_D_VendorDoc> obj);
        A_Pay_D_VendorDoc Insert(A_Pay_D_VendorDoc entity);
        A_Pay_D_VendorDoc Update(A_Pay_D_VendorDoc entity);
        void Delete(int id);
    }
}
