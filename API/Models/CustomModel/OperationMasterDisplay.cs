using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Inv.DAL.Domain;
using Inv.API.Models;

namespace Inv.API.Models.CustomModel
{
    public class OperationMasterDisplay : SecurityandUpdateFlagClass
    {
            
            public List<IQ_GetOperationItemInfo> IQ_GetOperationItemInfo { get; set; }
            public List<IQ_GetOperationCharges> IQ_GetOperationCharges { get; set; }
            public List<IQ_GetOperationDepsit> I_TR_OperationDeposit { get; set; }
            public List<IQ_GetOperationSalesman> TR_OperationSalesman { get; set; }
            public List<IQ_GetOperationSalesmanItem> TR_OperationSalesmanItem { get; set; }



    }
}