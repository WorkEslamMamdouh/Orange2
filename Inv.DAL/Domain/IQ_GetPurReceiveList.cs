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
    
    public partial class IQ_GetPurReceiveList
    {
        public int ReceiveID { get; set; }
        public Nullable<int> TrNo { get; set; }
        public string RefNO { get; set; }
        public Nullable<int> RefTrID { get; set; }
        public Nullable<System.DateTime> TrDate { get; set; }
        public string TrDateH { get; set; }
        public Nullable<int> TrType { get; set; }
        public Nullable<bool> IsCash { get; set; }
        public Nullable<int> SalesmanId { get; set; }
        public Nullable<int> StoreID { get; set; }
        public Nullable<decimal> VatAmount { get; set; }
        public Nullable<byte> VATType { get; set; }
        public Nullable<decimal> DiscountAmount { get; set; }
        public Nullable<byte> Status { get; set; }
        public Nullable<bool> IsPosted { get; set; }
        public Nullable<int> VoucherNo { get; set; }
        public Nullable<byte> VoucherType { get; set; }
        public Nullable<System.DateTime> CreatedAt { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<System.DateTime> UpdatedAt { get; set; }
        public string UpdatedBy { get; set; }
        public Nullable<int> CompCode { get; set; }
        public Nullable<int> BranchCode { get; set; }
        public string Slsm_Code { get; set; }
        public string Slsm_DescA { get; set; }
        public string Slsm_DescE { get; set; }
        public string Vnd_NameA { get; set; }
        public string Box_DescA { get; set; }
        public string Box_DescE { get; set; }
        public Nullable<int> VendorID { get; set; }
        public string VendorInvNo { get; set; }
        public Nullable<System.DateTime> PoDate { get; set; }
        public string PoNo { get; set; }
        public string Remarks { get; set; }
        public Nullable<decimal> Total { get; set; }
        public Nullable<decimal> DiscountPrcnt { get; set; }
        public Nullable<decimal> NetDue { get; set; }
        public Nullable<decimal> NetAdditionCost { get; set; }
        public string VendorCode { get; set; }
        public Nullable<int> PurRecType { get; set; }
        public Nullable<int> CashBoxID { get; set; }
        public Nullable<decimal> NetAdditionVat { get; set; }
        public string Vnd_NameE { get; set; }
        public string type_DescA { get; set; }
        public string Type_DescE { get; set; }
        public Nullable<decimal> CashPaidAmount { get; set; }
        public Nullable<decimal> RemainAmount { get; set; }
        public Nullable<int> PurOrderID { get; set; }
        public Nullable<int> PO_TrNo { get; set; }
        public Nullable<System.DateTime> PO_TrDate { get; set; }
        public Nullable<int> CurrencyID { get; set; }
        public Nullable<decimal> CurrencyRate { get; set; }
        public Nullable<decimal> TotalFC { get; set; }
        public Nullable<decimal> ItemTotalFC { get; set; }
        public Nullable<decimal> ItemDiscountTotalFC { get; set; }
        public Nullable<decimal> ItemTotal { get; set; }
        public Nullable<decimal> ItemVatTotal { get; set; }
        public Nullable<decimal> ItemDiscountTotal { get; set; }
    }
}
