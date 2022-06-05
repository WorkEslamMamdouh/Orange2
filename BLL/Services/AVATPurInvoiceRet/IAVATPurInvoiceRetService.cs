using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.AVATPurInvoiceRet
{
   

    public interface IAVATPurInvoiceRetService
    {
        AVAT_TR_PurInvoiceRet GetById(int id);
        List<AVAT_TR_PurInvoiceRet> GetAll();
        List<AVAT_TR_PurInvoiceRet> GetAll(Expression<Func<AVAT_TR_PurInvoiceRet, bool>> predicate);
        AVAT_TR_PurInvoiceRet Insert(AVAT_TR_PurInvoiceRet entity);
        AVAT_TR_PurInvoiceRet Update(AVAT_TR_PurInvoiceRet entity);
        void Delete(int id);
      
    }


}
