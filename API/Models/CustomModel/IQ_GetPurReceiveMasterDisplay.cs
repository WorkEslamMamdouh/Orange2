using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Inv.DAL.Domain;
using Inv.API.Models;

namespace Inv.API.Models.CustomModel
{
    public class IQ_GetPurReceiveMasterDisplay : SecurityandUpdateFlagClass
    {
            
            public List<IQ_GetPurReceiveItem> IQ_GetPurReceiveItem { get; set; }
            public List<IQ_GetPurReceiveCharge> IQ_GetPurReceiveCharge { get; set; }

    }
}