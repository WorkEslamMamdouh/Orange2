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
    
    public partial class IProc_Prnt_Collect_Result
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
        public Nullable<bool> IsInput { get; set; }
        public Nullable<int> ItemID { get; set; }
        public Nullable<int> UnitID { get; set; }
        public Nullable<decimal> Qty { get; set; }
        public Nullable<decimal> OnhandQty { get; set; }
        public Nullable<decimal> UnitCost { get; set; }
        public Nullable<decimal> NewUnitCost { get; set; }
        public Nullable<decimal> StkUnitCost { get; set; }
        public Nullable<decimal> StockQty { get; set; }
        public Nullable<decimal> StockOnhandQty { get; set; }
        public Nullable<decimal> CostFactorPrc { get; set; }
        public Nullable<decimal> NewStockUnitCost { get; set; }
        public string ItemCode { get; set; }
        public string itm_DescA { get; set; }
        public string itm_DescE { get; set; }
        public string UomCode { get; set; }
        public string u_DescA { get; set; }
        public string u_DescE { get; set; }
        public int CollectID { get; set; }
        public Nullable<int> TrNo { get; set; }
        public string RefNO { get; set; }
        public Nullable<System.DateTime> TrDate { get; set; }
        public string TrDateH { get; set; }
        public Nullable<int> StoreID { get; set; }
        public string Remark { get; set; }
        public Nullable<bool> IsPosted { get; set; }
        public Nullable<int> VoucherNo { get; set; }
        public Nullable<byte> VoucherType { get; set; }
        public Nullable<System.DateTime> CreatedAt { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<System.DateTime> UpdatedAt { get; set; }
        public string UpdatedBy { get; set; }
        public Nullable<int> CompCode { get; set; }
        public Nullable<int> BranchCode { get; set; }
        public Nullable<int> Status { get; set; }
        public Nullable<decimal> LabourCost { get; set; }
        public Nullable<decimal> MaterialCost { get; set; }
        public Nullable<decimal> InputItemCost { get; set; }
        public int CollectDetailID { get; set; }
        public string store_DescA { get; set; }
        public Nullable<int> STORE_CODE { get; set; }
        public string store_DescE { get; set; }
    }
}
