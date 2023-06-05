using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Inv.API.Models.CustomModel
{
    public class Table
    { 
        public string NameTable { get; set; }
        public string Condition { get; set; } 
        public bool? IsProc { get; set; } 
        public bool? IsExec { get; set; } 
    }
}