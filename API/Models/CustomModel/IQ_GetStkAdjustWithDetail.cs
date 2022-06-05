using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Inv.DAL.Domain;
using Inv.API.Models;

namespace Inv.API.Models.CustomModel
{
    public class IQ_GetStkAdjustWithDetail : SecurityandUpdateFlagClass
    {
        public List<IQ_GetStkAdjust> IQ_GetStkAdjust { get; set; }
        public List<IQ_GetStkAdjustDetail> IQ_GetStkAdjustDetail { get; set; }
    }
}