
alter  FUNCTION [dbo].[AFunc_GLAccountStatmentDetail]
(	@comp int , 
	@FromDate nvarchar(20) , 
	@ToDate nvarchar(20 ) , 
	@cc_Code nvarchar(20) , -- '' for all
	@FromAccCode nvarchar(25) ,
	@ToAccCode nvarchar(25) ,
	@IsAuthVchr int , -- 1 include auth. Voucher , 0 Not include auth vouchers 
	@IsNewVchr int ,  -- 1 include New. Voucher , 0 Not include auth vouchers 
	@ExZero int ,-- 1 : Excluse Zero , 0 :  no exclude 
	@IncludeInvTR int -- 1: include , 0 not include 
)
RETURNS  @Stat TABLE  ( typ int ,VOUCHER_CODE int , VOUCHER_DATE smalldatetime , 
                        ACC_CODE  nvarchar(25) , DESCL nvarchar(300) ,DESCA nvarchar(300), 
						debit numeric(18,2), credit numeric(18,2), VOUCHER_STATUS int 
					   )
AS
begin  
  Declare @MaxLvL int   , @PrdProfit  numeric(18,2) , @PrvProfit  numeric(18,2)  , @StNewA nvarchar(50) , @StNewE nvarchar(50) ,  
	        @StAuthA nvarchar(50) ,  @StAuthE nvarchar(50) , @ZeroA nvarchar(50) ,  @ZeroE nvarchar(50)  , @CCDESCA nvarchar(100) ,@CCDESCE nvarchar(100)  
			

	Declare @tmpAcc Table (  ID  int primary key ,  AccCode nvarchar(20) , AccLEvel int , AccGroup int , 
			ParentAcc nvarchar(20) , detail int , 
	        PrevDebit numeric(18,2) , Prevcredit numeric(18,2) ,PrdDebit numeric(18,2) , Prdcredit numeric(18,2) ,
			EndDebit numeric(18,2) , Endcredit numeric(18,2) )

	insert into @tmpAcc 
			SELECT   Row_number()  OVer (order by a.acc_Code )  ,a.acc_Code ,ACC_LEVEL ,  Acc_Group , 
			Parent_Acc ,   detail , 0,0,			 
			--case when  ay.OPENING_BALANCE > 0 then ay.OPENING_BALANCE  else  0 end ,
			--case when  ay.OPENING_BALANCE < 0 then -ay.OPENING_BALANCE  else  0 end ,
			0,0 ,
			0,0
			FROM A_ACCOUNT a inner join 
			     a_account_year ay on a.comp_code= ay.comp_code and a.acc_Code=ay.acc_code and ay.fin_year = year(@fromdate) 
				  where detail = 1  and a.COMP_CODE = @comp and  
			          a.acc_code > = @FromAccCode and a.Acc_Code <= @ToAccCode
        
	update tmp set  PrevDebit = case when tmp.prevdebit - tmp.prevcredit + tot.OpenBal > 0 then tmp.prevdebit - tmp.prevcredit + tot.OpenBal else  0  end  , 
	                Prevcredit =  case when tmp.prevdebit - tmp.prevcredit + tot.OpenBal <0  then -(tmp.prevdebit - tmp.prevcredit + tot.OpenBal) else  0  end ,
	                PrdDebit =tot.PrdDebit ,  Prdcredit= tot.PrdCredit 
	from @tmpAcc tmp inner join 
	    [dbo].[AFunc_VoucherTotals] (@comp, @IsAuthVchr,@IsNewVchr,@cc_Code,@FromDate,@ToDate)  tot on tot.acc_code= tmp.accCode COLLATE Arabic_CI_AI



  
  	update @tmpAcc set  EndDebit = case when PrevDebit -Prevcredit +PrdDebit-PrdCredit   > 0 then PrevDebit -Prevcredit +PrdDebit-PrdCredit else  0  end  ,
			Endcredit = case when PrevDebit -Prevcredit +PrdDebit-PrdCredit   < 0 then -(PrevDebit -Prevcredit +PrdDebit-PrdCredit) else  0  end
  
 		 
	insert into @stat 
	select 1 typ, jh.VOUCHER_CODE, jh.VOUCHER_DATE , jd.ACC_CODE , jd.DESCL , jd.DESCA , debit, credit , VOUCHER_STATUS
	from A_JOURNAL_HEADER jh inner join A_JOURNAL_DETAIL jd on jh.VoucherID = jd.VoucherID and jh.COMP_CODE = @comp  inner join 
		@tmpAcc t on t.AccCode = jd.ACC_CODE inner join 
			i_Control c on c.compcode = jh.comp_code 
	where jh.comp_code =@comp and jh.VOUCHER_DATE between @fromdate and @ToDate    and jh.TYPE_CODE <> c.Gl_JournalOpenType and
	    ( jh.VOUCHER_STATUS = 2 or (jh.VOUCHER_STATUS = 1 and @IsAuthVchr = 1) or (jh.VOUCHER_STATUS = 0 and @IsNewVchr = 1)) and 
	    (@cc_code = '' or  jd.CC_CODE in (select cc_code from [AFunc_BuildCCTreeWithCC](@comp , @cc_code))  )

	insert into @stat  
	select  jh.trtype + 1 , jh.VOUCHER_CODE, jh.VOUCHER_DATE , jd.ACC_CODE , jd.DESCL , jd.DESCA , isnull(debit,0), isnull(credit,0) , VOUCHER_STATUS
	from A_CashVoucher_Header jh inner join A_CashVoucher_Detail jd on jh.VoucherID = jd.VoucherID and jh.COMP_CODE = @comp  inner join 
		@tmpAcc t on t.AccCode = jd.ACC_CODE 
	where jh.comp_code =@comp and jh.VOUCHER_DATE between @fromdate and @ToDate and  
	    ( jh.VOUCHER_STATUS = 2 or (jh.VOUCHER_STATUS = 1 and @IsAuthVchr = 1) or (jh.VOUCHER_STATUS = 0 and @IsNewVchr = 1)) and 
	    (@cc_code = '' or  jd.CC_CODE in (select cc_code from [AFunc_BuildCCTreeWithCC](@comp , @cc_code))  )

 	insert into @stat  
	select jh.trtype + 1 , jh.VOUCHER_CODE, jh.VOUCHER_DATE , jh.ACC_CODE , jh.VOUCHER_DESC , jh.VOUCHER_DESC , 
	 case when jh.trtype=1 then isnull(amount,0) else 0 end , case when jh.trtype=2 then isnull(amount,0) else 0 end  , VOUCHER_STATUS
	from A_CashVoucher_Header jh   inner join 
		@tmpAcc t on t.AccCode = jh.ACC_CODE  collate Arabic_CI_AI
	where  jh.comp_code =@comp and jh.VOUCHER_DATE between @fromdate and @ToDate and  
	    ( jh.VOUCHER_STATUS = 2 or (jh.VOUCHER_STATUS = 1 and @IsAuthVchr = 1) or (jh.VOUCHER_STATUS = 0 and @IsNewVchr = 1)) and 
	    (@cc_code = '')

   insert into @stat 
   select 0, 0, @FromDate , Acccode , 'Open Balance' , ' —’Ìœ «›  «ÕÌ' , prevdebit, prevCredit , 2 
   from @tmpAcc
   if @IncludeInvTR = 1 -- import the sales transactions not included in the vouchers 
   begin 
        --type 10 : invoice , 11: inv return , 12: purchase return , 13 : purchase , 14: operation , 15: op expenses 16 purchase exp , 17 rec note, 18 pay note , 

   		insert into @stat   -- credit invoice and return 
		select jh.trtype + 10 , jh.TrNo, jh.trdate , case when ctr.ISCustVendorInGL = 1 then c.AccountNo else cat.AccountCode end  , jh.Remark , jh.Remark , 
		 case when jh.trtype=0 then isnull(jh.NetAfterVat,0) else 0 end , case when jh.trtype=1 then isnull(NetAfterVat,0) else 0 end  , jh.Status
		from I_Sls_TR_Invoice jh   inner join  A_Rec_D_Customer c on c.CustomerId = jh.CustomerId and jh.IsCash = 0 inner join 
			 A_RecPay_D_Category cat on cat.CatID = c.CatID inner join 
			 i_control  ctr on ctr.CompCode = jh.CompCode  inner join 
			 @tmpAcc t on t.AccCode =case when ctr.ISCustVendorInGL = 1 then c.AccountNo else cat.AccountCode end 
		where  jh.CompCode =@comp and jh.TrDate between @fromdate and @ToDate and (@cc_code = '') and jh.Status=1
		and  (( jh.SlsInvSrc = 1 and  jh.IsPosted = 0 ) or (jh.SlsInvSrc = 2 and jh.OperationId in (select operationid from I_TR_Operation where IsPosted = 0 and CompCode = @comp ) ) )
 
   		insert into @stat   -- cash invoice and return  
		select jh.trtype + 10 , jh.TrNo, jh.trdate , c.AccountCode , jh.Remark , jh.Remark , 
		 case when jh.trtype=0 then isnull(jh.NetAfterVat,0) else 0 end , case when jh.trtype=1 then isnull(NetAfterVat,0) else 0 end  , jh.Status
		from I_Sls_TR_Invoice jh   inner join  A_RecPay_D_CashBox c on c.CashBoxID = jh.CashBoxID and jh.IsCash = 1 inner join 
			@tmpAcc t on t.AccCode = c.AccountCode 
		where  jh.CompCode =@comp and  jh.TrDate between @fromdate and @ToDate and (@cc_code = '')  and jh.Status=1
		and  (( jh.SlsInvSrc = 1 and  jh.IsPosted = 0 ) or (jh.SlsInvSrc = 2 and jh.OperationId in (select operationid from I_TR_Operation where IsPosted = 0 and CompCode = @comp ) ) )
 
   		insert into @stat   -- credit purchase  and return 
		select   12 -jh.trtype  , jh.TrNo, jh.trdate , case when ctr.ISCustVendorInGL = 1 then c.BankAccountNo else cat.AccountCode end  , jh.Remarks , jh.Remarks , 
		 case when jh.trtype=1 then isnull(jh.NetDue,0) else 0 end , case when jh.trtype=0 then isnull(NetDue,0) else 0 end  , jh.Status
		from I_Pur_TR_Receive jh   inner join  A_Pay_D_Vendor c on c.VendorID = jh.VendorID and jh.IsCash = 0 inner join 
			 A_RecPay_D_Category cat on cat.CatID = c.CatID inner join 
			 i_control  ctr on ctr.CompCode = jh.CompCode  inner join 
			 @tmpAcc t on t.AccCode =case when ctr.ISCustVendorInGL = 1 then c.BankAccountNo else cat.AccountCode end 
		where  jh.CompCode =@comp and jh.IsPosted = 0 and jh.TrDate between @fromdate and @ToDate and (@cc_code = '')  and jh.Status=1
  
    	insert into @stat   -- cash purchase  and return 
		select   12 -jh.trtype  , jh.TrNo, jh.trdate ,c.AccountCode  , jh.Remarks , jh.Remarks , 
		 case when jh.trtype=1 then isnull(jh.NetDue,0) else 0 end , case when jh.trtype=0 then isnull(NetDue,0) else 0 end  , jh.Status
		from I_Pur_TR_Receive jh   inner join  A_RecPay_D_CashBox c on c.CashBoxID = jh.CashBoxID and jh.IsCash = 1 inner join 
			@tmpAcc t on t.AccCode = c.AccountCode
		where  jh.CompCode =@comp and jh.IsPosted = 0 and jh.TrDate between @fromdate and @ToDate and (@cc_code = '')  and jh.Status=1

   		insert into @stat   -- credit operation purchase  
		select   14  , jh.TrNo, jh.trdate , case when ctr.ISCustVendorInGL = 1 then c.BankAccountNo else cat.AccountCode end  , jh.Remark , jh.Remark , 
		 0 , jh.Close_purchaseValue , jh.Status
		from I_TR_Operation jh   inner join  A_Pay_D_Vendor c on c.VendorID = jh.VendorID   inner join 
			 A_RecPay_D_Category cat on cat.CatID = c.CatID inner join 
			 i_control  ctr on ctr.CompCode = jh.CompCode  inner join 
			 @tmpAcc t on t.AccCode =case when ctr.ISCustVendorInGL = 1 then c.BankAccountNo else cat.AccountCode end 
		where  jh.CompCode =@comp and jh.IsPosted = 0 and jh.TrDate between @fromdate and @ToDate and (@cc_code = '')  and jh.Status=3

   		insert into @stat   -- credit operation purchase  expenses
		select   15   , jh.TrNo, jh.trdate , case when ctr.ISCustVendorInGL = 1 then c.BankAccountNo else cat.AccountCode end  ,chd.desca ,chd.DESCL , 
		 0 ,  isnull(ch.NetAtferVat,0)   , jh.Status
		from I_TR_Operation jh   inner join  I_TR_OperationCharges ch on ch.OperationID=jh.OperationID inner join 
		    I_Pur_D_Charges chd on chd.ChargeID = ch.ChargeID inner join 
		     A_Pay_D_Vendor c on c.VendorID =ch.VendorID   and ch.isPaidByVendor = 1 inner join 
			 A_RecPay_D_Category cat on cat.CatID = c.CatID inner join 
			 i_control  ctr on ctr.CompCode = jh.CompCode  inner join 
			 @tmpAcc t on t.AccCode =case when ctr.ISCustVendorInGL = 1 then c.BankAccountNo else cat.AccountCode end 
		where  jh.CompCode =@comp and jh.IsPosted = 0 and jh.TrDate between @fromdate and @ToDate and (@cc_code = '')  and jh.Status=3

   		insert into @stat   -- cash  operation purchase  expenses
		select   15   , jh.TrNo, jh.trdate , c.AccountCode  ,chd.desca ,chd.DESCL , 
		 0 ,  isnull(ch.NetAtferVat,0)   , jh.Status
		from I_TR_Operation jh   inner join  I_TR_OperationCharges ch on ch.OperationID=jh.OperationID and ch.isPaidByVendor = 0 inner join 
		    I_Pur_D_Charges chd on chd.ChargeID = ch.ChargeID inner join  A_RecPay_D_CashBox c on c.CashBoxID = ch.CashBoxID and ch.isPaidByVendor = 0 inner join 
			@tmpAcc t on t.AccCode = c.AccountCode
		where  jh.CompCode =@comp and jh.IsPosted = 0 and jh.TrDate between @fromdate and @ToDate and (@cc_code = '')  and jh.Status=3

   		insert into @stat   -- credit purchase  expenses
		select   16   , jh.TrNo, jh.trdate , case when ctr.ISCustVendorInGL = 1 then c.BankAccountNo else cat.AccountCode end  ,chd.desca ,chd.DESCL , 
		 0 ,  isnull(ch.NetAtferVat,0)   , jh.Status
		from I_Pur_TR_Receive jh   inner join  I_Pur_Tr_ReceiveCharges ch on ch.ReceiveID=jh.ReceiveID inner join 
		    I_Pur_D_Charges chd on chd.ChargeID = ch.ChargeID inner join 
		     A_Pay_D_Vendor c on c.VendorID =ch.VendorID   and ch.isPaidByVendor = 1 inner join 
			 A_RecPay_D_Category cat on cat.CatID = c.CatID inner join 
			 i_control  ctr on ctr.CompCode = jh.CompCode  inner join 
			 @tmpAcc t on t.AccCode =case when ctr.ISCustVendorInGL = 1 then c.BankAccountNo else cat.AccountCode end 
		where  jh.CompCode =@comp and jh.IsPosted = 0 and jh.TrDate between @fromdate and @ToDate and (@cc_code = '')  and jh.Status=1

   		insert into @stat   -- cash  purchase  expenses
		select   16   , jh.TrNo, jh.trdate , c.AccountCode  ,chd.desca ,chd.DESCL , 
		 0 ,  isnull(ch.NetAtferVat,0)   , jh.Status
		from I_Pur_TR_Receive jh   inner join  I_Pur_Tr_ReceiveCharges ch on ch.ReceiveID=jh.ReceiveID and ch.isPaidByVendor = 0 inner join 
		    I_Pur_D_Charges chd on chd.ChargeID = ch.ChargeID inner join  A_RecPay_D_CashBox c on c.CashBoxID = ch.CashBoxID and ch.isPaidByVendor =0 inner join 
			@tmpAcc t on t.AccCode = c.AccountCode
		where  jh.CompCode =@comp and jh.IsPosted = 0 and jh.TrDate between @fromdate and @ToDate and (@cc_code = '')  and jh.Status=1

   		insert into @stat   -- cash receive and pay -- source 
		select jh.trtype + 16 , jh.TrNo, jh.trdate , CASE WHEN jh.CashType = 0 THEN c.AccountCode ELSE jh.BankAcc_Code END AS acc , jh.ReceiptDescA , jh.ReceiptDescA , 
		 case when jh.trtype=1 then isnull(jh.Amount,0) else 0 end , case when jh.trtype=2 then isnull(Amount,0) else 0 end  , jh.Status	 
         FROM        dbo.A_RecPay_Tr_ReceiptNote AS jh INNER JOIN
                  dbo.A_RecPay_D_CashBox AS c ON jh.CashBoxID = c.CashBoxID inner join 
			@tmpAcc t on t.AccCode = CASE WHEN jh.CashType = 0 THEN c.AccountCode ELSE jh.BankAcc_Code END  
		where  jh.CompCode =@comp and jh.IsPosted = 0 and jh.TrDate between @fromdate and @ToDate and (@cc_code = '')  and jh.Status=1

   		insert into @stat   -- cash receive and pay -- benif 
		select jh.trtype + 16 , jh.TrNo, jh.trdate , case  jh.RecPayTypeId when 1 then case when ctr.ISCustVendorInGL = 1 then cus.AccountNo else  cuscat.AccountCode end when 2 then case when ctr.ISCustVendorInGL = 1 then vnd.BankAccountNo else  vndcat.AccountCode end  when 3 then jh.BankAccountCode 
  when 4 then ex.ExpAccountCode when 5 then c.AccountCode end , jh.ReceiptDescA , jh.ReceiptDescA , 
		 case when jh.trtype=2 then isnull(jh.Amount,0) else 0 end , case when jh.trtype=1then isnull(Amount,0) else 0 end  , jh.Status	 
            FROM   dbo.A_Pay_D_Vendor AS vnd INNER JOIN
                  dbo.A_RecPay_D_Category AS vndcat ON vnd.CatID = vndcat.CatID RIGHT OUTER JOIN
                  dbo.A_RecPay_D_CashBox AS c RIGHT OUTER JOIN
                  dbo.A_RecPay_D_Category AS cuscat INNER JOIN
                  dbo.A_Rec_D_Customer AS cus ON cuscat.CatID = cus.CatID RIGHT OUTER JOIN
                  dbo.A_RecPay_Tr_ReceiptNote AS jh ON cus.CustomerId = jh.CustomerID LEFT OUTER JOIN
                  dbo.A_RecPay_D_Accounts AS ex ON jh.ExpenseID = ex.ExpenseID ON c.CashBoxID = jh.FromCashBoxID ON vnd.VendorID = jh.VendorID inner join 
				  i_control ctr on ctr.CompCode = jh.CompCode  inner join 
			@tmpAcc t on t.AccCode =case  jh.RecPayTypeId when 1 then case when ctr.ISCustVendorInGL = 1 then cus.AccountNo else  cuscat.AccountCode end when 2 then case when ctr.ISCustVendorInGL = 1 then vnd.BankAccountNo else  vndcat.AccountCode end  when 3 then jh.BankAccountCode 
  when 4 then ex.ExpAccountCode when 5 then c.AccountCode end  
		where  jh.CompCode =@comp and jh.IsPosted = 0 and jh.TrDate between @fromdate and @ToDate and (@cc_code = '')  and jh.Status=1
		
   end 
      if @ExZero = 1 
	  begin 
		delete   @tmpAcc where  AccCode in (select ACC_CODE   from @Stat group by ACC_CODE having sum(debit-credit) = 0 ) 
		delete   @Stat where  ACC_CODE in (select ACC_CODE    from @Stat group by ACC_CODE having sum(debit-credit) = 0 ) 
	  end 
   return
end
go
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
ALTER    PROCEDURE [dbo].[AProc_Rpt_GLAccountStatment]
	@comp int , 
	@bra int , 
	@CompNameA nvarchar(100) , 
	@CompNameE nvarchar(100) , 
	@BraNameA nvarchar(100) , 
	@BraNameE nvarchar(100) , 
	@LoginUser nvarchar(25), 
	@RepType int,  -- 1 view , 2 PDF , 3 Excel  , 4 : print direct 
	 
	@FromDate nvarchar(20) , 
	@ToDate nvarchar(20 ) , 
	@cc_Code nvarchar(20) , -- '' for all
	@FromAccCode nvarchar(25) ,
	@ToAccCode nvarchar(25) ,
	@IsAuthVchr int , -- 1 include auth. Voucher , 0 Not include auth vouchers 
	@IsNewVchr int ,  -- 1 include New. Voucher , 0 Not include auth vouchers 
	@ExZero int, -- 1 : Excluse Zero , 0 :  no exclude 
	@IncludeInvTR int -- 1: include , 0 not include 
AS
BEGIN
	--SET FMTONLY ON

    Declare @MaxLvL int   , @PrdProfit  numeric(18,2) , @PrvProfit  numeric(18,2)  , @StNewA nvarchar(50) , @StNewE nvarchar(50) ,  
	        @StAuthA nvarchar(50) ,  @StAuthE nvarchar(50) , @ZeroA nvarchar(50) ,  @ZeroE nvarchar(50)  , @CCDESCA nvarchar(100) ,@CCDESCE nvarchar(100)  
			, @incInvDSA nvarchar(100) ,@incInvDSE nvarchar(100)  
declare @typds as table (code int, desca    nvarchar(50), desce nvarchar(50)) 
--type 10 : invoice , 11: inv return , 12: purchase return , 13 : purchase , 14: operation , 15: op expenses 16 purchase exp , 17 rec note, 18 pay note , 

insert into @typds (code,desca, desce) values
  (1,'”‰œ ﬁÌœ','Journal Vouchr'),(2,'”‰œ ﬁ»÷','Receipt Voucher'),(3,'”‰œ ’—›','Payment Voucher'),
  (10,'›« Ê—… ','Invoice'),(11,'„— Ã⁄ »Ì⁄','Sales Return'),(12,'„— Ã⁄ „‘ —Ì« ','Pur Return'),(13,'„‘ —Ì« ','Purchase'),
  (14,'⁄„·Ì« ','Operation'),(15,'„’«—Ì› ⁄„·Ì« ','Oper. charges'),(16,'„’«—Ì› „‘ —Ì« ','Purch. Charges'),
  (17,'«–‰ ﬁ»÷','Receipt Note'),(18,'«–‰ ’—›','Pay Note')

select  @StNewA= case @IsNewVchr when 1 then '«œ—«Ã «·ﬁÌÊœ «·€Ì— „⁄ „œ…' when 1 then ' '   end 
select  @StNewE= case @IsNewVchr when 1 then 'Include New Vouchers' when 1 then ' '  end 
select  @StAuthA= case @IsAuthVchr when 1 then '«œ—«Ã «·ﬁÌÊœ «·„’œﬁ…' when 1 then ' '   end 
select  @StAuthE= case @IsAuthVchr when 1 then 'Include Auth. Vouchers' when 1 then ' '  end 
select  @ZeroA= case @ExZero when 1 then '«·€«¡ «·Õ”«»«  «·’›—Ì…' when 1 then ' '   end 
select  @ZeroE= case @ExZero when 1 then 'Remove Zero Accounts' when 1 then ' '  end 
select @incInvDSA = case @IncludeInvTR when  1  then '«œ—«Ã ⁄„·Ì«  «·„ «Ã—… ⁄‰ «·› —…' else '›ﬁÿ ﬁÌÊœ «·Õ”«»« ' end 
select @incInvDSE = case @IncludeInvTR when  1  then 'Include Period trading operation' else 'Only GL Vouchers' end 
if @cc_Code = ''  
	select @CCDESCA=' „” ÊÌ «·‘—ﬂ…', @CCDESCE= ' Company level '
else 
    select @CCDESCA=CC_DESCA, @CCDESCE= CC_DESCE  from G_COST_CENTER where comp_code = @comp and cc_Code = @cc_Code

SET FMTONLY OFF

select  @comp as Comp , @Bra as Bra , @CompNameA as CompNameA , @CompNameE as CompNameE , @BraNameA as BraNameA , @BraNameE as BraNameE , @LoginUser as LoginUser ,  getdate() as PrintDate , @RepType as Par_RepType ,	
        @StNewA as Par_StNewDSA , @StNewE as Par_StNewDSE ,@StAuthA as Par_StAuthDSA , @StAuthE as Par_StAuthDSE ,@incInvDSA as Par_incinvDSA ,@incInvDSE Par_incinvDSE ,
		 @ZeroA as Par_ZeroDSA , @ZeroE as Par_ZeroDSE ,@FromAccCode as Par_FromAcc , @ToAccCode as Par_ToAccCode , @FromDate as Par_FromDate, @Todate as Par_Todate, 
		tmp.typ   ,t.desca typ_DESCA, t.desce typ_DESCE ,  tmp.VOUCHER_CODE , tmp.VOUCHER_DATE, tmp.Acc_Code  ,tmp.debit , tmp.credit, tmp.DESCA , tmp.DESCL , acc.ACC_DESCA , acc.ACC_DESCL   
        
FROM      AFunc_GLAccountStatmentDetail (@comp  , 
						@FromDate  , 
						@ToDate  , 
						@cc_Code  , -- '' for all
						@FromAccCode  ,
						@ToAccCode  ,
						@IsAuthVchr  ,  
						@IsNewVchr  ,    
						@ExZero,@IncludeInvTR ) tmp INNER JOIN
         A_ACCOUNT AS Acc ON Acc.acc_Code = tmp.acc_code and acc.Comp_code = @comp  inner join 
		 @typds t on t.code = tmp.typ
order by tmp.ACC_CODE, tmp.typ , tmp.VOUCHER_DATE , tmp.VOUCHER_CODE


END

go