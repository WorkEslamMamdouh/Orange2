using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Inv.DAL.Domain;
using Inv.API.Models;

namespace Inv.API.Models.CustomModel
{
    public class AQPurInvoiceRetMasterDetails 
    {
            public AVAT_TR_PurInvoiceRet AVAT_TR_PurInvoiceRet { get; set; }
            public List<AQVAT_GetPurReturnDetail> AQVAT_GetPurReturnDetail { get; set; }
           

    }
}