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
    
    public partial class AProc_Rpt_GLFinancialStatment_Result
    {
        public Nullable<int> Comp { get; set; }
        public Nullable<int> Bra { get; set; }
        public string CompNameA { get; set; }
        public string CompNameE { get; set; }
        public string BraNameA { get; set; }
        public string BraNameE { get; set; }
        public string LoginUser { get; set; }
        public System.DateTime PrintDate { get; set; }
        public Nullable<int> Par_RepType { get; set; }
        public string Par_StNewDSA { get; set; }
        public string Par_StNewDSE { get; set; }
        public string Par_StAuthDSA { get; set; }
        public string Par_StAuthDSE { get; set; }
        public string Par_ZeroDSA { get; set; }
        public string Par_ZeroDSE { get; set; }
        public string Par_CCDESCA { get; set; }
        public string Par_CCDESCE { get; set; }
        public string Par_FromDate { get; set; }
        public string Par_Todate { get; set; }
        public Nullable<int> ID { get; set; }
        public string AccCode { get; set; }
        public Nullable<int> AccLEvel { get; set; }
        public Nullable<int> AccGroup { get; set; }
        public string ParentAcc { get; set; }
        public Nullable<int> detail { get; set; }
        public Nullable<decimal> PrevDebit { get; set; }
        public Nullable<decimal> Prevcredit { get; set; }
        public Nullable<decimal> PrdDebit { get; set; }
        public Nullable<decimal> Prdcredit { get; set; }
        public Nullable<decimal> EndDebit { get; set; }
        public Nullable<decimal> Endcredit { get; set; }
        public string acc_descA { get; set; }
        public string acc_descL { get; set; }
        public Nullable<decimal> Tot_PrevDebit { get; set; }
        public Nullable<decimal> Tot_PrevCredit { get; set; }
        public Nullable<decimal> Tot_PrdDebit { get; set; }
        public Nullable<decimal> TotPrdCredit { get; set; }
        public Nullable<decimal> Tot_EndDebit { get; set; }
        public Nullable<decimal> Tot_EndCredit { get; set; }
    }
}
