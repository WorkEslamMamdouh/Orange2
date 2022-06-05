using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Inv.DAL.Domain;
using Inv.API.Models;

namespace Inv.API.Models.CustomModel
{
    public class SlsInvoiceMasterDetails: SecurityandUpdateFlagClass
    {
            public I_Sls_TR_Invoice I_Sls_TR_Invoice { get; set; }
            public List<I_Sls_TR_InvoiceItems> I_Sls_TR_InvoiceItems { get; set; }
    }
}