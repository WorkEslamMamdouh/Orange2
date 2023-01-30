using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Inv.DAL.Domain;
using Inv.API.Models;

namespace Inv.API.Models.CustomModel
{
    public class IQ_GetStkOpenWithDetail : SecurityandUpdateFlagClass
    {
        public List<I_Stk_TR_Open> I_Stk_TR_Open { get; set; }
        public List<IQ_GetStkOpenDetail> IQ_GetStkOpenDetail { get; set; }
    }
}