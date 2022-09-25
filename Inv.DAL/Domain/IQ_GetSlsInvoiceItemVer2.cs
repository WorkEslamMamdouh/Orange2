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
    
    public partial class IQ_GetSlsInvoiceItemVer2
    {
        public int InvoiceItemID { get; set; }
        public Nullable<int> InvoiceID { get; set; }
        public Nullable<int> ItemID { get; set; }
        public Nullable<int> UomID { get; set; }
        public Nullable<decimal> SoldQty { get; set; }
        public Nullable<decimal> Unitprice { get; set; }
        public Nullable<decimal> DiscountPrc { get; set; }
        public Nullable<decimal> DiscountAmount { get; set; }
        public Nullable<decimal> NetUnitPrice { get; set; }
        public Nullable<decimal> ItemTotal { get; set; }
        public Nullable<decimal> VatPrc { get; set; }
        public Nullable<decimal> VatAmount { get; set; }
        public Nullable<decimal> NetAfterVat { get; set; }
        public Nullable<decimal> StockSoldQty { get; set; }
        public Nullable<decimal> StockUnitCost { get; set; }
        public Nullable<int> VatApplied { get; set; }
        public Nullable<decimal> TotRetQty { get; set; }
        public string it_itemCode { get; set; }
        public string it_DescA { get; set; }
        public Nullable<int> CompCode { get; set; }
        public string It_DescE { get; set; }
        public string ItFm_Code { get; set; }
        public string ItFm_DescA { get; set; }
        public string ItFm_DescE { get; set; }
        public string Cat_Code { get; set; }
        public string Cat_DescA { get; set; }
        public string Cat_DescE { get; set; }
        public string Uom_Code { get; set; }
        public string Uom_DescA { get; set; }
        public string Uom_DescE { get; set; }
        public int ItemFamilyID { get; set; }
        public Nullable<decimal> InvoiceSoldQty { get; set; }
        public Nullable<int> Serial { get; set; }
        public Nullable<decimal> AllowAmount { get; set; }
        public Nullable<decimal> AllowancePrc { get; set; }
        public Nullable<decimal> AllowanceBase { get; set; }
        public string AllowReason { get; set; }
        public Nullable<int> AllowCode { get; set; }
        public Nullable<decimal> BaseQty { get; set; }
        public Nullable<int> BaseQtyUomid { get; set; }
        public Nullable<decimal> BaseQtyPrice { get; set; }
        public Nullable<decimal> BaseQtyDiscount { get; set; }
        public Nullable<decimal> DiscountPrcBase { get; set; }
        public Nullable<int> DiscountVatNatID { get; set; }
        public string Discountreason { get; set; }
        public Nullable<int> DiscountCode { get; set; }
        public Nullable<decimal> ItemNetAmount { get; set; }
        public Nullable<decimal> ChargeAmount { get; set; }
        public Nullable<decimal> ChargePrc { get; set; }
        public Nullable<decimal> ChargeBase { get; set; }
        public Nullable<int> ChargeVatNatID { get; set; }
        public Nullable<decimal> ChargeVatPrc { get; set; }
        public Nullable<decimal> ChargeAfterVat { get; set; }
        public string ChargeReason { get; set; }
        public Nullable<int> ChargeCode { get; set; }
        public Nullable<int> VatNatID { get; set; }
        public Nullable<decimal> UnitpriceWithVat { get; set; }
        public Nullable<decimal> NetUnitPriceWithVat { get; set; }
        public Nullable<int> SlsInvSrc { get; set; }
        public Nullable<int> StoreId { get; set; }
        public Nullable<int> OperationId { get; set; }
        public Nullable<int> op_TrNo { get; set; }
        public Nullable<byte> op_status { get; set; }
        public Nullable<int> STORE_CODE { get; set; }
        public string Store_DescA { get; set; }
        public Nullable<decimal> Onhand_Qty { get; set; }
        public Nullable<decimal> MinSalesPrice { get; set; }
    }
}
