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
    
    public partial class IProc_Prnt_OperationCharges_Result
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
        public int OperationID { get; set; }
        public Nullable<int> TrNo { get; set; }
        public string RefNO { get; set; }
        public Nullable<System.DateTime> TrDate { get; set; }
        public string TruckNo { get; set; }
        public string PortName { get; set; }
        public Nullable<decimal> PaperPurchaseValue { get; set; }
        public Nullable<System.DateTime> ClearanceDate { get; set; }
        public string ClearanceDateH { get; set; }
        public string vnd_Code { get; set; }
        public string Vnd_nameA { get; set; }
        public string Vnd_nameE { get; set; }
        public string PolicyNo { get; set; }
        public string CustomNo { get; set; }
        public string nat_Code { get; set; }
        public string Nat_DescA { get; set; }
        public string Nat_DescE { get; set; }
        public string Goods_Desc { get; set; }
        public string Remark { get; set; }
        public string sls_Code { get; set; }
        public string sls_nameA { get; set; }
        public string sls_NameE { get; set; }
        public Nullable<System.DateTime> OpenAt { get; set; }
        public string Close_TrDate { get; set; }
        public Nullable<decimal> Close_TotalSalesCash { get; set; }
        public Nullable<decimal> Close_TotalSalesCashVAT { get; set; }
        public Nullable<decimal> Close_TotalSalesCredit { get; set; }
        public Nullable<decimal> Close_TotalSalesCreditVAT { get; set; }
        public Nullable<decimal> Close_CashOnhand { get; set; }
        public Nullable<decimal> Close_CashOnBank { get; set; }
        public string Close_BankAccNo { get; set; }
        public Nullable<decimal> Close_TotalSales { get; set; }
        public Nullable<decimal> Close_TotalExpenses { get; set; }
        public Nullable<decimal> Close_Marketting { get; set; }
        public Nullable<decimal> Close_Adjustment { get; set; }
        public string Close_AdjustmentRemarks { get; set; }
        public Nullable<decimal> Close_CompanyCommition { get; set; }
        public Nullable<decimal> Close_purchaseValue { get; set; }
        public Nullable<decimal> Close_SalesManCommition { get; set; }
        public Nullable<decimal> Close_NetProfit { get; set; }
        public string Close_Remarks { get; set; }
        public string Status_DescA { get; set; }
        public string Status_DescE { get; set; }
        public Nullable<int> ch_Serail { get; set; }
        public string ch_DescA { get; set; }
        public string ch_DescE { get; set; }
        public Nullable<bool> ch_IsAdddition { get; set; }
        public Nullable<decimal> ch_Amount { get; set; }
        public Nullable<decimal> ch_VatAmount { get; set; }
        public Nullable<decimal> ch_VatPrc { get; set; }
        public Nullable<decimal> ch_NetAfterVat { get; set; }
        public Nullable<bool> ch_PaidByVendor { get; set; }
        public string ch_RefInvoiceNo { get; set; }
        public Nullable<System.DateTime> ch_RefInvoiceDate { get; set; }
        public string ch_VendorCode { get; set; }
        public string ch_VndNameA { get; set; }
        public string ch_VndNameE { get; set; }
        public string ch_CashDescA { get; set; }
        public string ch_CashDescE { get; set; }
        public string ChRemarks { get; set; }
    }
}
