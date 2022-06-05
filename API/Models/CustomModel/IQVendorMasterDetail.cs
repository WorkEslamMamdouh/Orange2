using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Inv.DAL.Domain;
using Inv.API.Models;

namespace Inv.API.Models.CustomModel
{
    public class IQVendorMasterDetail : SecurityandUpdateFlagClass
    {
        public List<IQ_GetVendor >IQ_GetVendor { get; set; }
        public List<AQ_GetVendorDoc> AQ_GetVendorDoc { get; set; }
    }
}