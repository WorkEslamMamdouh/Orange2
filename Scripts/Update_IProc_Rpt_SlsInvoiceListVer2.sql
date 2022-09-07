Create  PROCEDURE [dbo].[IProc_Rpt_SlsInvoiceListVer2]
@comp int , 
@bra int , 
@CompNameA nvarchar(100) , 
@CompNameE nvarchar(100) , 
@BraNameA nvarchar(100) , 
@BraNameE nvarchar(100) , 
@LoginUser nvarchar(25), 
@RepType int,  -- 1 view , 2 PDF , 3 Excel  , 4 : print direct 
@TrType int , -- 1: invoice , 2 : return 
@SlsInvSrc int , -- 1:normal invoice/ret , 2:Op invoice and return 
@FromDate nvarchar(20) , 
@ToDate nvarchar(20) , 
@CustomerID int , -- null for all 
@SalesmanID int , -- null for all 
@CashType int,  -- 1 cash , 0 not auth , 2 all 
@Status int , -- 1 auth , 0, not auth , 2 all 
@OperationID int   -- null for all 
AS
BEGIN
declare @StatusDSA as nvarchar(100) , @StatusDSE as nvarchar(100) , @CashTypeDSA as nvarchar(100) , @CashTypeDSE as nvarchar(100) , 
		@CustDSA as nvarchar(100) , @CustDSE as nvarchar(100) ,@SalesmanDSA as nvarchar(100) , @SalesmanDSE as nvarchar(100),
		@OPno nvarchar(20) , @shipNo nvarchar(20) 

--if @OperationID is null 
	select @Opno = 'All' , @shipNo = 'All' 
--else 
--    select @opno = trno , @shipno = RefNO from I_TR_Operation where operationid = @OperationID

		
if @CustomerID is null  
	select  @CustDSA= 'جميع العملاء' ,  @CustDSE = 'All'
else 
	select  @CustDSA= NAMEA ,  @CustDSE = NAMEE from A_Rec_D_Customer where CustomerId =@CustomerID

if @SalesmanID is null  
	select  @SalesmanDSA= 'جميع المناديب' ,  @SalesmanDSE = 'All'
else 
	select  @SalesmanDSA= NAMEA ,  @SalesmanDSE = NAMEE from I_Sls_D_Salesman where SalesmanId =@SalesmanID

select  @StatusDSA= case @status when 0 then 'غير منفذ' when 1 then 'منفذ' when 2 then 'الجميع' end 
select  @StatusDSE= case @status when 0 then 'Not authorized' when 1 then 'Authorized' when 2 then 'All' end 
select  @CashTypeDSA= case @CashType when 0 then 'علي الحساب' when 1 then 'آجل' when 2 then 'الجميع' end 
select  @CashTypeDSE= case @CashType when 0 then 'Cash' when 1 then 'Credit' when 2 then 'All' end 
select  @comp as Comp , @Bra as Bra , @CompNameA as CompNameA , @CompNameE as CompNameE , @BraNameA as BraNameA , @BraNameE as BraNameE , @LoginUser as LoginUser ,  getdate() as PrintDate , @RepType as Par_RepType ,	
        @StatusDSA as Par_StatusDSA , @StatusDSE as Par_StatusDSE , @CashTypeDSA as Par_CashTypeDSA , @CashTypeDSE as Par_CashTypeDSE ,
		@CustDSA as Par_CustDSA , @CustDSE as Par_CustDSE , @SalesmanDSA as Par_SalesmanDSA , @SalesmanDSE as Par_SalesmanDSE , 
		@FromDate as Par_FromDate, @Todate as Par_Todate, @OPno as par_op_TRNo , @shipNo as par_op_shipno , 
         invstat.InvoiceID, invstat.TrNo, invstat.RefNO, invstat.RefTrID, invstat.TrDate, invstat.TrDateH, invstat.TrType, invstat.IsCash, invstat.SlsInvType, invstat.SlsInvSrc, invstat.CashBoxID, invstat.CustomerId, 
        CASE WHEN invstat.customerid IS NULL THEN invstat.CustomerName ELSE Cus_NameA END AS Cust_nameA, 
        invstat.SalesmanId, invstat.StoreId, invstat.OperationId, invstat.TotalAmount, invstat.VatAmount, invstat.VatType, invstat.DiscountAmount, invstat.DiscountPrc, invstat.NetAfterVat, invstat.CommitionAmount, invstat.CashAmount, 
        invstat.CardAmount, invstat.BankTfAmount, invstat.BankAccount, invstat.TotalPaidAmount, invstat.RemainAmount, invstat.Remark, invstat.Status, invstat.IsPosted, invstat.VoucherNo, invstat.VoucherType, invstat.CreatedAt, 
        invstat.CreatedBy, invstat.UpdatedAt, invstat.UpdatedBy, invstat.CompCode, invstat.BranchCode, invstat.Slsm_Code, invstat.Slsm_DescA, invstat.Cus_Code, invstat.Box_DescA,  
        invstat.Line_Count, invstat.Item_Count, invstat.Tot_Qty,  ref.TrNo AS Ref_TrNo, ref.TrDate AS Ref_TrDate, op.TrNo AS op_TrNo, op.TrDate AS Op_TrDate, 
        op.TruckNo AS Op_TruckNo, op.RefNO AS Op_RefNo,invstat.RefNO as RefNO1, invstat.Sper_code, invstat.SPer_NameA
FROM     dbo.IQ_GetSlsInvoiceStatisticVer2 AS invstat LEFT OUTER JOIN
        dbo.I_TR_Operation AS op ON invstat.OperationId = op.OperationID LEFT OUTER JOIN
        dbo.I_Sls_TR_Invoice AS ref ON invstat.RefTrID = ref.InvoiceID
where    invstat.CompCode = @comp and INVSTAT.BranchCode= @BRA AND  invstat.SlsInvSrc = @SlsInvSrc and  invstat.TrType = @TrType and 
		(@CashType = 2 or invstat.IsCash  = @CashType ) and 
		(@SalesmanID is null or invstat.SalesmanId = @SalesmanID) AND 
		(@CustomerID is null or invstat.CustomerId = @CustomerID) AND 
		(@status=2  or  invstat.status =   @status )   and 
		(@OperationID is null or  invstat.OperationId =@OperationID ) and
		invstat.TrDate between @Fromdate and @Todate 

END
go
 