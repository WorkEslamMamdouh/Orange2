using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Inv.DAL.Domain;
using Inv.API.Models;

namespace Inv.API.Models.CustomModel
{
    public class G_RoleModuleMaste : SecurityandUpdateFlagClass
    {
            public G_Role G_Role { get; set; }
            public List<G_RoleModule> G_RoleModule { get; set; }
 
    }
}