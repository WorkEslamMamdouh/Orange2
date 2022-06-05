using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Inv.DAL.Domain;
using Inv.API.Models;

namespace Inv.API.Models.CustomModel
{
    public class VchrTemplatMasterDetail : SecurityandUpdateFlagClass
    {
        public A_TR_VchrTemplate A_TR_VchrTemplate { get; set; }
        public List<A_TR_VchrTemplateDetail> A_TR_VchrTemplateDetail { get; set; }
    }
}