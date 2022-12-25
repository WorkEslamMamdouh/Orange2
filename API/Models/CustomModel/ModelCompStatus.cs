using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Inv.API.Models.CustomModel
{
    public class ModelCompStatus
    {
        public int COMP_CODE { get; set; }
        public string USER_CODE { get; set; } 
        public string NameA { get; set; }
        public string NameE { get; set; }
        public string LoginMsg { get; set; }
        public Nullable<System.DateTime> FirstDate { get; set; }
        public Nullable<System.DateTime> LastDate { get; set; }
        public Nullable<System.DateTime> MembeshipEndDate { get; set; }
        public Nullable<int> MembershipAllanceDays { get; set; }
        public Nullable<int> MembershipreadOnlyDays { get; set; }
        public Nullable<int> CompStatus { get; set; }
        public Nullable<bool> IsActive { get; set; }
    }
}