using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.ServPurInvoiceDetail
{
   

    public interface IServPurInvoiceDetailService
    {
        AVAT_TR_PurInvoiceDetail GetById(int id);
        List<AVAT_TR_PurInvoiceDetail> GetAll();
        List<AVAT_TR_PurInvoiceDetail> GetAll(Expression<Func<AVAT_TR_PurInvoiceDetail, bool>> predicate);
        AVAT_TR_PurInvoiceDetail Insert(AVAT_TR_PurInvoiceDetail entity);
        void InsertList(List<AVAT_TR_PurInvoiceDetail> entity);
        AVAT_TR_PurInvoiceDetail Update(AVAT_TR_PurInvoiceDetail entity);
        void Delete(int id);

    }
}
