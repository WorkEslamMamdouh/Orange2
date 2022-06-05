using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.DirectTransfer
{
   public interface IDirectTransferService
    {
        // header
        I_Stk_TR_Transfer GetById(int id);
        List<I_Stk_TR_Transfer> GetAll(Expression<Func<I_Stk_TR_Transfer, bool>> predicate);
        I_Stk_TR_Transfer Insert(I_Stk_TR_Transfer entity);
        I_Stk_TR_Transfer Update(I_Stk_TR_Transfer entity);
        void UpdateList(List<I_Stk_TR_Transfer> Lstservice);

        //Detail
        List<I_Stk_TR_TransferDetails> GetAll(Expression<Func<I_Stk_TR_TransferDetails, bool>> predicate);
        void InsertLst(List<I_Stk_TR_TransferDetails> obj);
        I_Stk_TR_TransferDetails Insert(I_Stk_TR_TransferDetails entity);
        I_Stk_TR_TransferDetails Update(I_Stk_TR_TransferDetails entity);
        void Delete(int id);
    }
}
