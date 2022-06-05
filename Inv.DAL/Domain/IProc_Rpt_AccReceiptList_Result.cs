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
    
    public partial class IProc_Rpt_AccReceiptList_Result
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
        public string Par_StatusDSA { get; set; }
        public string Par_StatusDSE { get; set; }
        public string Par_CashBoxDSA { get; set; }
        public string Par_BoxDSE { get; set; }
        public string Par_RecTypeDsA { get; set; }
        public string Par_RecTypeDsE { get; set; }
        public string Par_CashTypeDescA { get; set; }
        public string Par_CashTypeDescE { get; set; }
        public string Par_FromDate { get; set; }
        public string Par_Todate { get; set; }
        public int ReceiptID { get; set; }
        public Nullable<int> CashBoxID { get; set; }
        public Nullable<int> TrType { get; set; }
        public Nullable<int> RecPayTypeId { get; set; }
        public Nullable<int> TrNo { get; set; }
        public Nullable<System.DateTime> TrDate { get; set; }
        public string TrDateH { get; set; }
        public Nullable<int> Status { get; set; }
        public Nullable<int> CustomerID { get; set; }
        public Nullable<int> VendorID { get; set; }
        public Nullable<int> FromCashBoxID { get; set; }
        public Nullable<int> ExpenseID { get; set; }
        public Nullable<decimal> Amount { get; set; }
        public Nullable<decimal> CashAmount { get; set; }
        public Nullable<decimal> CardAmount { get; set; }
        public string BankAccountCode { get; set; }
        public string ReceiptDescA { get; set; }
        public string ReceiptDescE { get; set; }
        public Nullable<bool> IsPosted { get; set; }
        public Nullable<int> VoucherNo { get; set; }
        public Nullable<byte> VoucherType { get; set; }
        public string Remarks { get; set; }
        public Nullable<System.DateTime> CreatedAt { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<System.DateTime> UpdatedAt { get; set; }
        public string UpdatedBy { get; set; }
        public Nullable<int> CompCode { get; set; }
        public Nullable<int> BranchCode { get; set; }
        public Nullable<int> Bef_Code { get; set; }
        public string Bef_DescA { get; set; }
        public string Bef_DescE { get; set; }
        public string Type_DescA { get; set; }
        public string Type_DescE { get; set; }
        public string CashBox_DescA { get; set; }
        public string CashBox_DescE { get; set; }
        public Nullable<int> Bef_ID { get; set; }
        public string CashT_DescA { get; set; }
        public string CashT_DescE { get; set; }
        public string CheckNo { get; set; }
        public string TransferNo { get; set; }
        public string BankName { get; set; }
        public string BankAcc_Code { get; set; }
        public Nullable<bool> IsDeffered { get; set; }
        public Nullable<System.DateTime> DueDate { get; set; }
        public Nullable<int> CashType { get; set; }
        public string Bnk_acc_DescE { get; set; }
        public string ACC_DESCL { get; set; }
    }
}
