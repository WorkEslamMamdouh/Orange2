using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;


namespace Inv.BLL.Services.AccTrReceipt
{
    public interface IAccTrReceiptService
    {
        A_RecPay_Tr_ReceiptNote GetById(int id);
        List<A_RecPay_Tr_ReceiptNote> GetAll();
        List<A_RecPay_Tr_ReceiptNote> GetAll(Expression<Func<A_RecPay_Tr_ReceiptNote, bool>> predicate);
        A_RecPay_Tr_ReceiptNote Insert(A_RecPay_Tr_ReceiptNote entity);
        A_RecPay_Tr_ReceiptNote Update(A_RecPay_Tr_ReceiptNote entity);
        void Delete(int id);
    }
}
