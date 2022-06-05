using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Inv.DAL.Domain;
using Inv.API.Models;

namespace Inv.API.Models.CustomModel
{
    public class VendorMasterDetail : SecurityandUpdateFlagClass
    {
        public A_Pay_D_Vendor A_Pay_D_Vendor { get; set; }
        public List<A_Pay_D_VendorDoc> A_Pay_D_VendorDoc { get; set; }
    }
}