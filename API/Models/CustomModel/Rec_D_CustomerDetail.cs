using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Inv.DAL.Domain;
using Inv.API.Models;

namespace Inv.API.Models.CustomModel
{
    public class Rec_D_CustomerDetail : SecurityandUpdateFlagClass
    {
        public A_Rec_D_Customer A_Rec_D_Customer { get; set; }
        public List<A_Rec_D_CustomerDoc> A_Rec_D_CustomerDoc { get; set; }
    }
}