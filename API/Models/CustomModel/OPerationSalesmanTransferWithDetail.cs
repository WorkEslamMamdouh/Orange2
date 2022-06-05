using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Inv.DAL.Domain;
using Inv.API.Models;

namespace Inv.API.Models.CustomModel
{
    public class OPerationSalesmanTransferWithDetail : SecurityandUpdateFlagClass
    {
        public I_TR_OperationTF I_TR_OperationTF { get; set; }
        public List<I_TR_OperationTFDetail> I_TR_OperationTFDetail { get; set; }
    }
}