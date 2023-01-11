using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.STKOpen
{
   public interface ISTKOpenService
    {
        // header
        I_Stk_TR_Open GetById(int id);
        List<I_Stk_TR_Open> GetAll(Expression<Func<I_Stk_TR_Open, bool>> predicate);
        I_Stk_TR_Open Insert(I_Stk_TR_Open entity);
        I_Stk_TR_Open Update(I_Stk_TR_Open entity);
        void UpdateList(List<I_Stk_TR_Open> Lstservice);

        //Detail
        List<I_Stk_Tr_OpenDetails> GetAll(Expression<Func<I_Stk_Tr_OpenDetails, bool>> predicate);
        void InsertLst(List<I_Stk_Tr_OpenDetails> obj);
        I_Stk_Tr_OpenDetails Insert(I_Stk_Tr_OpenDetails entity);
        I_Stk_Tr_OpenDetails Update(I_Stk_Tr_OpenDetails entity);
        void Delete(int id);
    }
}
