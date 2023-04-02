using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Inv.DAL.Domain;
using Inv.API.Models;

namespace Inv.API.Models.CustomModel
{
    public class NewsDetails : SecurityandUpdateFlagClass
    { 
        public List<G_News> G_News { get; set; }
        public List<G_Codes> G_Codes { get; set; }
 
    }
}