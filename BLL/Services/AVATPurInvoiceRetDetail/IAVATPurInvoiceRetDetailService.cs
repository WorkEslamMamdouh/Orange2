using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.AVATPurInvoiceRetDetail
{
  


    public interface IAVATPurInvoiceRetDetailService
    {

        AVAT_TR_PurInvoiceRetDetail GetById(int id);
        List<AVAT_TR_PurInvoiceRetDetail> GetAll();
        List<AVAT_TR_PurInvoiceRetDetail> GetAll(Expression<Func<AVAT_TR_PurInvoiceRetDetail, bool>> predicate);
        AVAT_TR_PurInvoiceRetDetail Insert(AVAT_TR_PurInvoiceRetDetail entity);
        AVAT_TR_PurInvoiceRetDetail Update(AVAT_TR_PurInvoiceRetDetail entity);
        void Delete(int id);

    }




}
