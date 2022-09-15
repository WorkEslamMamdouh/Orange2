using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
//eslam 1 dec 2020
namespace Inv.WebUI.Reports.Models
{
    public class StdParamters
    {
        public string SystemCode { get; set; }
        public string SubSystemCode { get; set; }
        public string Modulecode { get; set; }
        public string UserCode { get; set; }
        public string CompCode { get; set; }
        public string BranchCode { get; set; }
        public string Language { get; set; }
        public string CurrentYear { get; set; }
        public string ScreenLanguage { get; set; }
        public string SystemName { get; set; }
        public string SubSystemName { get; set; }
        public string CompNameE { get; set; }
        public string CompNameA { get; set; }
        public string BranchName { get; set; }
        public string Tokenid { get; set; }
    }
    public class ReportParameters : StdParamters // eslam Adding base class 
    {

        public int DepartmentID { get; set; }
        public string UserCode { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
    }
    public class RepAttend : StdParamters // mahroos Adding base class 
    {

        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public string FromDt { get; set; }
        public string ToDt { get; set; }
        public int? SrvId { get; set; }
        public int? ShiftId { get; set; }
        public int Sex { get; set; }
        public int? PeriodId { get; set; }
        public int Type { get; set; }

        public int Shift { get; set; }
    }


    public class RepAttendAndResev : StdParamters // eslam Adding base class 
    {
        public int id1 { get; set; }
        public int id2 { get; set; }
        public int id3 { get; set; }
        public int id4 { get; set; }
        public int typ { get; set; }
        public bool ISQR { get; set; }
    }
    public class Reportparam : StdParamters // eslam Adding base class 
    {

        public bool ISQR { get; set; }
        public int TRId { get; set; }
        public int usr { get; set; }


    }
    public class Reporttransactionparam : StdParamters // eslam Adding base class 
    {

        public bool ISQR { get; set; }
        public int id { get; set; }
        public int id1 { get; set; }
        public int id2 { get; set; }
        public int id3 { get; set; }
        public int id4 { get; set; }
        public int Type { get; set; }
        public int ExpenseStatementID { get; set; }
        public string User_Code { get; set; }


    }

    public class RepExpensesDetails : StdParamters // eslam Adding base class 
    {
        public DateTime FromDt { get; set; }
        public DateTime ToDt { get; set; }
        public int CatId { get; set; }
        public int ExpID { get; set; }
        public int PeriodId { get; set; }
        public int PurchId { get; set; }
        public int Type { get; set; }

    }

    public class RepCollInPer : StdParamters // eslam Adding base class 
    {
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public DateTime FromDt { get; set; }
        public DateTime ToDt { get; set; }
        public int SrvId { get; set; }
        public int ShiftId { get; set; }
        public int Sex { get; set; }
        public int PeriodId { get; set; }
        public int Shift { get; set; }
        public string User { get; set; }
        public int cashType { get; set; }
        public int stat { get; set; }
        public string CompNameA { get; set; }
        public string CompNameE { get; set; }
        public int Type { get; set; }
    }

    public class RepStatement : StdParamters // eslam Adding base class 
    {
        public DateTime FromDt { get; set; }
        public DateTime ToDt { get; set; }

        public int MemId { get; set; }
        public int SrvId { get; set; }
        public int ShiftId { get; set; }
        public int Sex { get; set; }
        public int PeriodId { get; set; }
        public int Type { get; set; }
        public int Shift { get; set; }

    }

    public class RepFinancialSituation : StdParamters // eslam Adding base class 
    {
        public DateTime FromDt { get; set; }
        public DateTime ToDt { get; set; }
        public int stat { get; set; }
        public int Shift { get; set; }
        public int PeriodId { get; set; }
        public int SrvId { get; set; }
        public int ShiftId { get; set; }
        public int Sex { get; set; }
        public int Type { get; set; }
        // public string User { get; set; }
    }

    public class RepCurrentSubscribers : StdParamters // eslam Adding base class 
    {
        public DateTime FromDt { get; set; }
        public DateTime ToDt { get; set; }
        public int PeriodDays { get; set; }
        public int SrvId { get; set; }
        public int ShiftId { get; set; }
        public int Sex { get; set; }
        public int Shift { get; set; }
        public int PeriodId { get; set; }
        public int Type { get; set; }
    }

    public class RepAttendanceReport : StdParamters // mahroos Adding base class 
    {
        public int TRId { get; set; }
        public int CatId { get; set; }
        public int JobID { get; set; }
        public int NatId { get; set; }
        public int Empid { get; set; }
        public int EmpStat1 { get; set; }
        public int EmpStat2 { get; set; }
        public int EmpStat3 { get; set; }
        public int EmpStat5 { get; set; }
        public int Type { get; set; }

    }

    public class RepEmployeeReport : StdParamters // eslam Adding base class 
    {
        public int CatId { get; set; }
        public int JobID { get; set; }
        public int NatId { get; set; }
        public int EmpStat1 { get; set; }
        public int EmpStat2 { get; set; }
        public int EmpStat3 { get; set; }
        public int EmpStat5 { get; set; }
        public int Type { get; set; }

    }

    public class RepVatList : StdParamters // eslam Adding base class 
    {
        public DateTime FromDt { get; set; }
        public DateTime ToDt { get; set; }
        public int Type { get; set; }
        public int stat { get; set; }

    }
    public class RepFinServiceIncome : StdParamters // eslam Adding base class 
    {

        public DateTime FromDt { get; set; }
        public DateTime ToDt { get; set; }
        public int SrvCatId { get; set; }
        public int ShiftId { get; set; }
        public int Sex { get; set; }
        public int PeriodId { get; set; }
        public int Type { get; set; }

        public int Shift { get; set; }
    }
    public class Repcome : StdParamters // eslam Adding base class 
    {
        public int Type { get; set; }
        public int TRId { get; set; }
        public int Repdesign { get; set; }
        public int Typ { get; set; }
        public int slip { get; set; }
        public int stat { get; set; }
    }

    public class Invoices_ID  
    {
        public int InvoiceID { get; set; }
    }


    public class RepFinancials : StdParamters // Mona Adding  class 
    {
        public string FromDate { get; set; }
        public string FromDt { get; set; }
        public string ToDate { get; set; }
        public int BoxId { get; set; }
        public string BankCode { get; set; }
        public int RepType { get; set; }
        public int TrType { get; set; }
        public int IncludeInvTR{ get; set; }
        public int RecType { get; set; }
        public string BnfID { get; set; }
        public string BnfDesc { get; set; }
        public string Condation { get; set; }
        public string Name_ID { get; set; }
        public string NameTable { get; set; }
        public int Status { get; set; }
        public int Repdesign { get; set; }
        public int TRId { get; set; }
        public int AdjDebit { get; set; }
        public int AdjId { get; set; }
        public int CustomerID { get; set; }
        public int VendorId { get; set; }
        public int SalesmanID { get; set; }
        public int CashType { get; set; }
        public int PaymentType { get; set; }
        public int CashBoxID { get; set; }
        public string MobileNo { get; set; }
        public int Typ { get; set; }
        public int Type { get; set; }
        public int fromNum { get; set; }
        public int ToNum { get; set; } 
        public int CatId { get; set; }
        public int Groupid { get; set; }
        public int IsCredit { get; set; }
        public int BalStatus { get; set; }
        public int slip { get; set; }
        public int VendType { get; set; }
        public int check { get; set; }
        public int BalType { get; set; }
        public int ItemFamId { get; set; }
        public int ItemID { get; set; }
        public string cc_code { get; set; }
        public int exzero { get; set; }
        public int IsAuthVchr { get; set; }
        public int IsNewVchr { get; set; }
        public int Level { get; set; }
        public string AccCode { get; set; }
        public int OpenType { get; set; }
        public int PrdType { get; set; }
        public int EndType { get; set; }
        public string fromacc { get; set; }
        public string toacc { get; set; }
        public int @VchrSource { get; set; }
        public int VchrType { get; set; }
        public int storeID { get; set; }
        public int TfType { get; set; }
        public int FromstoreID { get; set; }
        public int ToStoreID { get; set; }
        public int FromBra { get; set; }
        public int ToBra { get; set; }
        public int src { get; set; }
        public int OperationId { get; set; }
        public int FromSls { get; set; }
        public int ToSls { get; set; }
        public int stat { get; set; }
        public int invType { get; set; }
        public int ISimport { get; set; }
        public Boolean checkedprint { get; set; }
        public int CustomercatID { get; set; }
        public int CustomerGrpID { get; set; }

        public string TransCode { get; set; }

        public int Vattype { get; set; }
        public string SysCode { get; set; }

        public int cusCatID { get; set; }
        public int cusGroupid { get; set; }
        public int cusid { get; set; } 
        public int SLStype { get; set; }
        public string dtccCode { get; set; }
        public int VatBraCode { get; set; }
        public int vatyear { get; set; }
        public int prdcode { get; set; }
        public string DocPDFFolder { get; set; }
        public int braCode { get; set; }
        public int FinYear { get; set; }
        public int ItemTypeID { get; set; }
        public int FromPrd { get; set; }
        public int ToPrd { get; set; }
        public int Agtype { get; set; }

        public int orderby { get; set; }
        public int IssueTypeID { get; set; }
    }

}