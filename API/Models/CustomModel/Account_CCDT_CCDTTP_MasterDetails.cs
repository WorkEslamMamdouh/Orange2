using System;
using Inv.DAL.Domain;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Inv.API.Models.CustomModel
{
    public class Account_CCDT_CCDTTP_MasterDetails
    {
       
        public A_CCDT_Types A_CCDT_Types { get; set; }
        public List<A_ACCOUNT> A_ACCOUNT { get; set; }
        public List<A_CCDT_COSTCENTERS> A_CCDT_COSTCENTERS { get; set; }

    }

  

}

