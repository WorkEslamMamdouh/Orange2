using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Inv.DAL.Domain;
using Inv.API.Models;

namespace Inv.API.Models.CustomModel
{
    public class ListOperationDepositDetail : SecurityandUpdateFlagClass
    { 
        public List<I_TR_OperationSalesmanItem> I_TR_OperationSalesmanItem { get; set; }
        public List<I_TR_OperationDeposit> I_TR_OperationDeposit { get; set; }
    }
}