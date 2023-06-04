using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Inv.API.Models.CustomModel
{
    public class FilterLnkVoucher
    {
        public int Comp { get; set; }
        public int branchCode { get; set; }
        public int FromNum { get; set; }
        public int ToNum { get; set; }
        public string TrType { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public string UserCode { get; set; }
         
    }
}