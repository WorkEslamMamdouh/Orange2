using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Inv.DAL.Domain;
using Inv.API.Models;

namespace Inv.API.Models.CustomModel
{
    public class IQ_GetOPerationTransferWithDetail : SecurityandUpdateFlagClass
    {
        public List<IQ_GetOperationTF> IQ_GetOperationTF { get; set; }
        public List<IQ_GetOperationTFDetail> IQ_GetOperationTFDetail { get; set; }
    }
}