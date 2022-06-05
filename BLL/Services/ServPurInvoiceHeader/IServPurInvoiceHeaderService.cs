using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.ServPurInvoiceHeader
{
   

    public interface IServPurInvoiceHeaderService
    {
        AVAT_TR_PurInvoiceHeader GetById(int id);
        List<AVAT_TR_PurInvoiceHeader> GetAll();
        List<AVAT_TR_PurInvoiceHeader> GetAll(Expression<Func<AVAT_TR_PurInvoiceHeader, bool>> predicate);
        AVAT_TR_PurInvoiceHeader Insert(AVAT_TR_PurInvoiceHeader entity);
        AVAT_TR_PurInvoiceHeader Update(AVAT_TR_PurInvoiceHeader entity);
        void Delete(int id);
       
    }
}
