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
    
    public partial class A_TR_VchrTemplate
    {
        public int TemplateID { get; set; }
        public Nullable<int> COMP_CODE { get; set; }
        public Nullable<int> VOUCHER_CODE { get; set; }
        public Nullable<byte> VOUCHER_TYPE { get; set; }
        public string TEMPLATE_DESC { get; set; }
        public string VOUCHER_DESC { get; set; }
        public Nullable<short> TYPE_CODE { get; set; }
        public string ACC_CODE { get; set; }
        public string CREATED_BY { get; set; }
        public Nullable<System.DateTime> CREATED_AT { get; set; }
        public string UPDATED_BY { get; set; }
        public Nullable<System.DateTime> UPDATED_AT { get; set; }
        public Nullable<bool> IsSaveValue { get; set; }
        public Nullable<bool> ISSaveLineDescr { get; set; }
    }
}
