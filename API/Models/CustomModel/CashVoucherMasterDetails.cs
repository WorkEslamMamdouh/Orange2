using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Inv.DAL.Domain;
using Inv.API.Models;

namespace Inv.API.Models.CustomModel
{
    public class CashVoucherMasterDetails : SecurityandUpdateFlagClass
    {
        public A_CashVoucher_Header A_CashVoucher_Header { get; set; }
        public List<A_CashVoucher_Detail> A_CashVoucher_Detail { get; set; }
    }
}