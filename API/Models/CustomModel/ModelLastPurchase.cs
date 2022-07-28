using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Inv.API.Models.CustomModel
{
    public class ModelLastPurchase
    {
        public decimal VndLastPrice { get; set; }
        public int VndLastTr { get; set; }
        public string VndLastDate { get; set; } 
        public decimal LastPurchase { get; set; }
        public decimal Curcost { get; set; }
          
    }
}