using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Inv.DAL.Domain;
using Inv.API.Models;

namespace Inv.API.Models.CustomModel
{
    public class IQCollectMasterDetails : SecurityClass
    {
            public I_TR_Collect I_TR_Collect { get; set; }
            public List<IQ_GetCollectDetail> IQ_GetCollectDetail { get; set; }
         

    }
}