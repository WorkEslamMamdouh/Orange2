using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Inv.DAL.Domain;
using Inv.API.Models;

namespace Inv.API.Models.CustomModel
{
    public class IQ_PurchaseOrderWithDetail : SecurityandUpdateFlagClass
    {
        public List<IQ_GetPurchaseOrder> IQ_GetPurchaseOrder { get; set; }
        public List<IQ_GetPurchaseOrderDetail> IQ_GetPurchaseOrderDetail { get; set; }
    }
}