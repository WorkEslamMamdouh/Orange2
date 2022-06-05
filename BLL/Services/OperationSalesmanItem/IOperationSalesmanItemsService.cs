using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.OperationSalesmanItem
{
   public interface IOperationSalesmanItemsService
    {
        void InsertLst(List<I_TR_OperationSalesmanItem> obj);
        I_TR_OperationSalesmanItem Insert(I_TR_OperationSalesmanItem entity);
        I_TR_OperationSalesmanItem Update(I_TR_OperationSalesmanItem entity);
        void Delete(int id);
    }
}
