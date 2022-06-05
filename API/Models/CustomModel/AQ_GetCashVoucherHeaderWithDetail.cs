using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Inv.DAL.Domain;
using Inv.API.Models;

namespace Inv.API.Models.CustomModel
{
    public class AQ_GetCashVoucherHeaderWithDetail : SecurityandUpdateFlagClass
    {
        public List<AQ_GetCashVoucherHeader> AQ_GetCashVoucherHeader { get; set; }
        public List<AQ_GetCashVoucherDetail> AQ_GetCashVoucherDetail { get; set; }
    }
}