using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Inv.DAL.Domain;
using Inv.API.Models;

namespace Inv.API.Models.CustomModel
{
    public class AQ_GetJournalHeaderWithDetail : SecurityandUpdateFlagClass
    {
        public List<AQ_GetJournalHeader> AQ_GetJournalHeader { get; set; }
        public List<AQ_GetJournalDetail> AQ_GetJournalDetail { get; set; }
    }
}