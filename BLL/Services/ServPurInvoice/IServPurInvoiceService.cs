using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.ServPurInvoice
{
   

    public interface IServPurInvoiceService
    {
        AVAT_TR_PurInvoice GetById(int id);
        List<AVAT_TR_PurInvoice> GetAll();
        List<AVAT_TR_PurInvoice> GetAll(Expression<Func<AVAT_TR_PurInvoice, bool>> predicate);
        AVAT_TR_PurInvoice Insert(AVAT_TR_PurInvoice entity);
        AVAT_TR_PurInvoice Update(AVAT_TR_PurInvoice entity);
        void Delete(int id);
       
    }
}
