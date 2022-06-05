using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Inv.DAL.Domain;
using Inv.API.Models;

namespace Inv.API.Models.CustomModel
{
    public class IQ_DirectTransferWithDetail : SecurityandUpdateFlagClass
    {
        public List<IQ_GetTransfer> IQ_GetTransfer { get; set; }
        public List<IQ_GetTransferDetail> IQ_GetTransferDetail { get; set; }
    }
}