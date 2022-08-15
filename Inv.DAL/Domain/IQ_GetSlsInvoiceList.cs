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
    
    public partial class IQ_GetSlsInvoiceList
    {
        public int InvoiceID { get; set; }
        public Nullable<int> TrNo { get; set; }
        public string RefNO { get; set; }
        public Nullable<int> RefTrID { get; set; }
        public Nullable<System.DateTime> TrDate { get; set; }
        public string TrDateH { get; set; }
        public Nullable<int> TrType { get; set; }
        public Nullable<bool> IsCash { get; set; }
        public Nullable<int> SlsInvType { get; set; }
        public Nullable<int> SlsInvSrc { get; set; }
        public Nullable<int> CashBoxID { get; set; }
        public Nullable<int> CustomerId { get; set; }
        public string CustomerName { get; set; }
        public string CustomerMobileNo { get; set; }
        public Nullable<int> SalesmanId { get; set; }
        public Nullable<int> StoreId { get; set; }
        public Nullable<int> OperationId { get; set; }
        public Nullable<decimal> TotalAmount { get; set; }
        public Nullable<decimal> VatAmount { get; set; }
        public Nullable<int> VatType { get; set; }
        public Nullable<decimal> DiscountAmount { get; set; }
        public Nullable<decimal> DiscountPrc { get; set; }
        public Nullable<decimal> NetAfterVat { get; set; }
        public Nullable<decimal> CommitionAmount { get; set; }
        public Nullable<decimal> CashAmount { get; set; }
        public Nullable<decimal> CardAmount { get; set; }
        public Nullable<decimal> BankTfAmount { get; set; }
        public string BankAccount { get; set; }
        public Nullable<decimal> TotalPaidAmount { get; set; }
        public Nullable<decimal> RemainAmount { get; set; }
        public string Remark { get; set; }
        public Nullable<int> Status { get; set; }
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
        public string Cus_Code { get; set; }
        public string Cus_NameA { get; set; }
        public string Box_DescA { get; set; }
        public string DocNo { get; set; }
        public string DocUUID { get; set; }
        public Nullable<System.TimeSpan> TrTime { get; set; }
        public Nullable<int> InvoiceTypeCode { get; set; }
        public Nullable<int> InvoiceTransCode { get; set; }
        public string TaxNotes { get; set; }
        public Nullable<int> TaxCurrencyID { get; set; }
        public Nullable<int> InvoiceCurrenyID { get; set; }
        public string ContractNo { get; set; }
        public string PurchaseorderNo { get; set; }
        public Nullable<int> GlobalInvoiceCounter { get; set; }
        public string PrevInvoiceHash { get; set; }
        public string QRCode { get; set; }
        public string CryptographicStamp { get; set; }
        public Nullable<System.DateTime> DeliveryDate { get; set; }
        public Nullable<System.DateTime> DeliveryEndDate { get; set; }
        public Nullable<int> PaymentMeansTypeCode { get; set; }
        public Nullable<int> CRDBReasoncode { get; set; }
        public string PaymentTerms { get; set; }
        public Nullable<int> PaymentTermsID { get; set; }
        public Nullable<decimal> AllowAmount { get; set; }
        public Nullable<decimal> AllowPrc { get; set; }
        public Nullable<decimal> AllowBase { get; set; }
        public Nullable<int> AllowVatNatID { get; set; }
        public Nullable<decimal> AllowVatPrc { get; set; }
        public Nullable<decimal> AllowAfterVat { get; set; }
        public string AllowReason { get; set; }
        public Nullable<int> AllowCode { get; set; }
        public Nullable<decimal> ChargeAmount { get; set; }
        public Nullable<decimal> ChargePrc { get; set; }
        public Nullable<decimal> ChargeBase { get; set; }
        public Nullable<int> ChargeVatNatID { get; set; }
        public Nullable<decimal> ChargeVatPrc { get; set; }
        public Nullable<decimal> ChargeAfterVat { get; set; }
        public string ChargeReason { get; set; }
        public Nullable<int> ChargeCode { get; set; }
        public Nullable<decimal> ItemTotal { get; set; }
        public Nullable<decimal> ItemAllowTotal { get; set; }
        public Nullable<decimal> ItemDiscountTotal { get; set; }
        public Nullable<decimal> ItemVatTotal { get; set; }
        public Nullable<decimal> RoundingAmount { get; set; }
        public Nullable<int> FinYear { get; set; }
        public Nullable<int> SalesPersonId { get; set; }
        public string Sper_code { get; set; }
        public string SPer_NameA { get; set; }
        public Nullable<decimal> QtyTotal { get; set; }
        public Nullable<int> ItemCount { get; set; }
        public Nullable<int> LineCount { get; set; }
    }
}
