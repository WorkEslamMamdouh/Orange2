using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.AccDefCustomer
{
    public interface IAccDefCustomerService
    {
        // Header
        A_Rec_D_Customer GetById(int id);
        List<A_Rec_D_Customer> GetAll();
        List<A_Rec_D_Customer> GetAll(Expression<Func<A_Rec_D_Customer, bool>> predicate);
        A_Rec_D_Customer Insert(A_Rec_D_Customer entity);
        A_Rec_D_Customer Update(A_Rec_D_Customer entity);
        //void Delete(int id);
        //void UpdateList(List<A_Rec_D_Customer> Lstservice);

        //Detail
        List<A_Rec_D_CustomerDoc> GetAll(Expression<Func<A_Rec_D_CustomerDoc, bool>> predicate);
        void InsertLst(List<A_Rec_D_CustomerDoc> obj);
        A_Rec_D_CustomerDoc Insert(A_Rec_D_CustomerDoc entity);
        A_Rec_D_CustomerDoc Update(A_Rec_D_CustomerDoc entity);
        void Delete(int id);
    }
}
