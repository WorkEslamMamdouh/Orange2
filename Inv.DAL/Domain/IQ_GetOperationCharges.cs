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
    
    public partial class IQ_GetOperationCharges
    {
        public Nullable<int> ChargeID { get; set; }
        public Nullable<decimal> Amount { get; set; }
        public Nullable<decimal> VatAmount { get; set; }
        public Nullable<int> VatType { get; set; }
        public Nullable<decimal> VatPrc { get; set; }
        public Nullable<decimal> NetAtferVat { get; set; }
        public Nullable<bool> isPaidByVendor { get; set; }
        public string RefInvoiceNo { get; set; }
        public Nullable<System.DateTime> RefInvoiceDate { get; set; }
        public int VendorID { get; set; }
        public Nullable<int> CostAddCode { get; set; }
        public string DESCA { get; set; }
        public string DESCL { get; set; }
        public Nullable<bool> IsAddition { get; set; }
        public string VendorCode { get; set; }
        public string Vnd_NameA { get; set; }
        public string Vnd_NameE { get; set; }
        public Nullable<int> Serial { get; set; }
        public int OperationExpensesID { get; set; }
        public int OperationID { get; set; }
        public string CashBox_DescA { get; set; }
        public string CashBox_DescE { get; set; }
        public int CashBoxID { get; set; }
        public Nullable<bool> IsPosted { get; set; }
        public Nullable<int> VoucherNo { get; set; }
        public string ChRemarks { get; set; }
    }
}
