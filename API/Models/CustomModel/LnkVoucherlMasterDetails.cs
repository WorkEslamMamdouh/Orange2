using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Inv.DAL.Domain;
using Inv.API.Models;

namespace Inv.API.Models.CustomModel
{
    public class LnkVoucherlMasterDetails : SecurityandUpdateFlagClass
    {
        public FilterLnkVoucher FilterLnkVoucher { get; set; }
        public List<A_LnkVoucher> A_LnkVoucher { get; set; }
    }
}