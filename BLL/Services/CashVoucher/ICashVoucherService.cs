using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.CashVoucher
{
   public interface ICashVoucherService
    {
        // header
        A_CashVoucher_Header GetById(int id);
        List<A_CashVoucher_Header> GetAll(Expression<Func<A_CashVoucher_Header, bool>> predicate);
        A_CashVoucher_Header Insert(A_CashVoucher_Header entity);
        A_CashVoucher_Header Update(A_CashVoucher_Header entity);
        void UpdateList(List<A_CashVoucher_Header> Lstservice);

        //Detail
        List<A_CashVoucher_Detail> GetAll(Expression<Func<A_CashVoucher_Detail, bool>> predicate);
        void InsertLst(List<A_CashVoucher_Detail> obj);
        A_CashVoucher_Detail Insert(A_CashVoucher_Detail entity);
        A_CashVoucher_Detail Update(A_CashVoucher_Detail entity);
        void Delete(int id);
    }
}
