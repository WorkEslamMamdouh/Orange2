//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Inv.DAL.Domain
{
    using System;
    using System.Collections.Generic;
    
    public partial class G_NotificationCompany
    {
        public string SYSTEM_CODE { get; set; }
        public string SUB_SYSTEM_CODE { get; set; }
        public string MODULE_CODE { get; set; }
        public int CompCode { get; set; }
        public int BranchCode { get; set; }
        public Nullable<bool> ISActive { get; set; }
        public Nullable<int> NoteCount { get; set; }
        public Nullable<int> FIN_YEAR { get; set; }
    }
}
