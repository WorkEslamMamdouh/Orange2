using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.PurOrder
{
   public interface IPurOrderService
    {
        // header
        I_Pur_Tr_PurchaseOrder GetById(int id);
        List<I_Pur_Tr_PurchaseOrder> GetAll(Expression<Func<I_Pur_Tr_PurchaseOrder, bool>> predicate);
        I_Pur_Tr_PurchaseOrder Insert(I_Pur_Tr_PurchaseOrder entity);
        I_Pur_Tr_PurchaseOrder Update(I_Pur_Tr_PurchaseOrder entity);
        void UpdateList(List<I_Pur_Tr_PurchaseOrder> Lstservice);

        //Detail
        List<I_Pur_Tr_PurchaseOrderDetail> GetAll(Expression<Func<I_Pur_Tr_PurchaseOrderDetail, bool>> predicate);
        void InsertLst(List<I_Pur_Tr_PurchaseOrderDetail> obj);
        I_Pur_Tr_PurchaseOrderDetail Insert(I_Pur_Tr_PurchaseOrderDetail entity);
        I_Pur_Tr_PurchaseOrderDetail Update(I_Pur_Tr_PurchaseOrderDetail entity);
        void Delete(int id);
    }
}
