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
    
    public partial class I_TR_Operation
    {
        public int OperationID { get; set; }
        public Nullable<int> TrNo { get; set; }
        public string RefNO { get; set; }
        public Nullable<System.DateTime> TrDate { get; set; }
        public string TrDateH { get; set; }
        public string TruckNo { get; set; }
        public string PortName { get; set; }
        public Nullable<decimal> PaperPurchaseValue { get; set; }
        public Nullable<int> NationalityID { get; set; }
        public int VendorID { get; set; }
        public string Goods_Desc { get; set; }
        public string Remark { get; set; }
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
        public Nullable<System.DateTime> OpenAt { get; set; }
        public string OpenBy { get; set; }
        public Nullable<System.DateTime> CloseAt { get; set; }
        public string CloseBy { get; set; }
        public string User_Code { get; set; }
        public Nullable<int> SalesmanId { get; set; }
        public Nullable<decimal> CompanyCommitionPrc { get; set; }
        public Nullable<decimal> Close_CompanyCommitionPrc { get; set; }
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
        public Nullable<decimal> Close_Adjustment { get; set; }
        public string Close_AdjustmentRemarks { get; set; }
        public Nullable<decimal> Close_CompanyCommition { get; set; }
        public Nullable<decimal> Close_purchaseValue { get; set; }
        public Nullable<decimal> Close_SalesManCommition { get; set; }
        public Nullable<decimal> Close_NetProfit { get; set; }
        public string Close_Remarks { get; set; }
        public Nullable<System.DateTime> ClearanceDate { get; set; }
        public string ClearanceDateH { get; set; }
        public Nullable<bool> IsGenerated { get; set; }
        public string PolicyNo { get; set; }
        public string CustomNo { get; set; }
        public Nullable<decimal> Close_Marketting { get; set; }
        public Nullable<int> VatType { get; set; }
        public Nullable<decimal> VatPrc { get; set; }
        public Nullable<decimal> VatAmount { get; set; }
        public Nullable<decimal> Close_AdjTotalSales { get; set; }
        public Nullable<decimal> Close_Coolingandstorage { get; set; }
        public Nullable<decimal> Close_TotalQtyRec { get; set; }
        public Nullable<decimal> Close_TotalQtySold { get; set; }
        public Nullable<decimal> Close_TotalQtyScrap { get; set; }
    }
}
