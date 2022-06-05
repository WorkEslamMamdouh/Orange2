using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Inv.DAL.Domain;
using Inv.API.Models;

namespace Inv.API.Models.CustomModel
{
    public class StockAdjustMasterDetails : SecurityandUpdateFlagClass
    {
        public I_Stk_TR_Adjust I_Stk_TR_Adjust { get; set; }
        public List<I_Stk_Tr_AdjustDetails> I_Stk_Tr_AdjustDetails { get; set; }
    }
}