using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Inv.API.Models.CustomModel
{
    public class DashBalances
    {
        public decimal CustOp { get; set; }
        public decimal CustEnd { get; set; }
        public decimal VndOp { get; set; }
        public decimal VndEnd { get; set; }
    }
}