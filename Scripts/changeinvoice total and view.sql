--
-- as detail total in invoice header 
--
alter table I_Sls_TR_Invoice add
SalesPersonId	int	,
QtyTotal	numeric(19, 2)	,
ItemCount	int	,
LineCount int 
go 
Create view IQ_GetSlsInvoiceListVer2 as 
SELECT        inv.InvoiceID, inv.TrNo, inv.RefNO, inv.RefTrID, inv.TrDate, inv.TrDateH, inv.TrType, inv.IsCash, inv.SlsInvType, inv.SlsInvSrc, inv.CashBoxID, inv.CustomerId, inv.CustomerName, inv.CustomerMobileNo, inv.SalesmanId, 
                         inv.StoreId, inv.OperationId, inv.TotalAmount, inv.VatAmount, inv.VatType, inv.DiscountAmount, inv.DiscountPrc, inv.NetAfterVat, inv.CommitionAmount, inv.CashAmount, inv.CardAmount, inv.BankTfAmount, inv.BankAccount, 
                         inv.TotalPaidAmount, inv.RemainAmount, inv.Remark, inv.Status, inv.IsPosted, inv.VoucherNo, inv.VoucherType, inv.CreatedAt, inv.CreatedBy, inv.UpdatedAt, inv.UpdatedBy, inv.CompCode, inv.BranchCode, 
                         Slsm.SalesmanCode AS Slsm_Code, Slsm.NameA AS Slsm_DescA, cus.CustomerCODE AS Cus_Code, ISNULL(cus.NAMEA, inv.CustomerName) AS Cus_NameA, Box.CashBox_DescA AS Box_DescA, inv.DocNo, inv.DocUUID, 
                         inv.TrTime, inv.InvoiceTypeCode, inv.InvoiceTransCode, inv.TaxNotes, inv.TaxCurrencyID, inv.InvoiceCurrenyID, inv.ContractNo, inv.PurchaseorderNo, inv.GlobalInvoiceCounter, inv.PrevInvoiceHash, inv.QRCode, 
                         inv.CryptographicStamp, inv.DeliveryDate, inv.DeliveryEndDate, inv.PaymentMeansTypeCode, inv.CRDBReasoncode, inv.PaymentTerms, inv.PaymentTermsID, inv.AllowAmount, inv.AllowPrc, inv.AllowBase, inv.AllowVatNatID, 
                         inv.AllowVatPrc, inv.AllowAfterVat, inv.AllowReason, inv.AllowCode, inv.ChargeAmount, inv.ChargePrc, inv.ChargeBase, inv.ChargeVatNatID, inv.ChargeVatPrc, inv.ChargeAfterVat, inv.ChargeReason, inv.ChargeCode, 
                         inv.ItemTotal, inv.ItemAllowTotal, inv.ItemDiscountTotal, inv.ItemVatTotal, inv.RoundingAmount, inv.FinYear, inv.SalesPersonId, sper.SalesmanCode AS Sper_code, sper.NameA AS SPer_NameA, inv.QtyTotal, 
                         inv.ItemCount,inv.LineCount
FROM            dbo.A_Rec_D_Customer AS cus RIGHT OUTER JOIN
                         dbo.I_Sls_TR_Invoice AS inv ON cus.CustomerId = inv.CustomerId INNER JOIN
                         dbo.I_Sls_D_Salesman AS Slsm ON inv.SalesmanId = Slsm.SalesmanId LEFT OUTER JOIN
                         dbo.I_Sls_D_Salesman AS sper ON inv.SalesPersonId = sper.SalesmanId LEFT OUTER JOIN
                         dbo.A_RecPay_D_CashBox AS Box ON inv.CashBoxID = Box.CashBoxID
go
Create view IQ_GetSlsInvoiceStatisticVer2  as 
SELECT        inv.InvoiceID, inv.TrNo, inv.RefNO, inv.RefTrID, inv.TrDate, inv.TrDateH, inv.TrType, inv.IsCash, inv.SlsInvType, inv.SlsInvSrc, inv.CashBoxID, inv.CustomerId, inv.CustomerName, inv.CustomerMobileNo, inv.SalesmanId, 
                         inv.StoreId, inv.OperationId, inv.TotalAmount, inv.VatAmount, inv.VatType, inv.DiscountAmount, inv.DiscountPrc, inv.NetAfterVat, inv.CommitionAmount, inv.CashAmount, inv.CardAmount, inv.BankTfAmount, inv.BankAccount, 
                         inv.TotalPaidAmount, inv.RemainAmount, inv.Remark, inv.Status, inv.IsPosted, inv.VoucherNo, inv.VoucherType, inv.CreatedAt, inv.CreatedBy, inv.UpdatedAt, inv.UpdatedBy, inv.CompCode, inv.BranchCode, 
                         Slsm.SalesmanCode AS Slsm_Code, Slsm.NameA AS Slsm_DescA, cus.CustomerCODE AS Cus_Code, ISNULL(cus.NAMEA, inv.CustomerName) AS Cus_NameA, Box.CashBox_DescA AS Box_DescA, inv.DocNo, inv.DocUUID, 
                         inv.TrTime, inv.InvoiceTypeCode, inv.InvoiceTransCode, inv.TaxNotes, inv.TaxCurrencyID, inv.InvoiceCurrenyID, inv.ContractNo, inv.PurchaseorderNo, inv.GlobalInvoiceCounter, inv.PrevInvoiceHash, inv.QRCode, 
                         inv.CryptographicStamp, inv.DeliveryDate, inv.DeliveryEndDate, inv.PaymentMeansTypeCode, inv.CRDBReasoncode, inv.PaymentTerms, inv.PaymentTermsID, inv.AllowAmount, inv.AllowPrc, inv.AllowBase, inv.AllowVatNatID, 
                         inv.AllowVatPrc, inv.AllowAfterVat, inv.AllowReason, inv.AllowCode, inv.ChargeAmount, inv.ChargePrc, inv.ChargeBase, inv.ChargeVatNatID, inv.ChargeVatPrc, inv.ChargeAfterVat, inv.ChargeReason, inv.ChargeCode, 
                         inv.ItemTotal, inv.ItemAllowTotal, inv.ItemDiscountTotal, inv.ItemVatTotal, inv.RoundingAmount, inv.FinYear, inv.SalesPersonId, sper.SalesmanCode AS Sper_code, sper.NameA AS SPer_NameA, inv.QtyTotal Tot_Qty, 
                         inv.ItemCount as Item_Count,inv.LineCount as  Line_Count
FROM            dbo.A_Rec_D_Customer AS cus RIGHT OUTER JOIN
                         dbo.I_Sls_TR_Invoice AS inv ON cus.CustomerId = inv.CustomerId INNER JOIN
                         dbo.I_Sls_D_Salesman AS Slsm ON inv.SalesmanId = Slsm.SalesmanId LEFT OUTER JOIN
                         dbo.I_Sls_D_Salesman AS sper ON inv.SalesPersonId = sper.SalesmanId LEFT OUTER JOIN
                         dbo.A_RecPay_D_CashBox AS Box ON inv.CashBoxID = Box.CashBoxID

go 

--
-- update current invoices 
--
update iv set linecount = s.Line_Count , QtyTotal = s.Tot_Qty , itemcount = s.Item_Count 
from I_Sls_TR_Invoice iv inner join 
IQ_GetSlsInvoiceSummary s on iv.InvoiceID = s.InvoiceID

go


-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description: invoice Print 
-- =============================================

 
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description: invoice Print 
-- =============================================
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
	select  @CustDSA= '???? ???????' ,  @CustDSE = 'All'
else 
	select  @CustDSA= NAMEA ,  @CustDSE = NAMEE from A_Rec_D_Customer where CustomerId =@CustomerID

if @SalesmanID is null  
	select  @SalesmanDSA= '???? ????????' ,  @SalesmanDSE = 'All'
else 
	select  @SalesmanDSA= NAMEA ,  @SalesmanDSE = NAMEE from I_Sls_D_Salesman where SalesmanId =@SalesmanID

select  @StatusDSA= case @status when 0 then '??? ????' when 1 then '????' when 2 then '??????' end 
select  @StatusDSE= case @status when 0 then 'Not authorized' when 1 then 'Authorized' when 2 then 'All' end 
select  @CashTypeDSA= case @CashType when 0 then '??? ??????' when 1 then '???' when 2 then '??????' end 
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
 
GO


-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description: invoice Print 
-- =============================================
ALTER   PROCEDURE [dbo].[IProc_Rpt_ItemSalesDetail]
@comp int , 
@bra int , 
@CompNameA nvarchar(100) , 
@CompNameE nvarchar(100) , 
@BraNameA nvarchar(100) , 
@BraNameE nvarchar(100) , 
@LoginUser nvarchar(25), 
@RepType int,  -- 1 view , 2 PDF , 3 Excel  , 4 : print direct 
@customerid int , -- null for all 
@PayType int, --1:Cash , 0: Credit , 2: All 
@GroupType int , --1:By customer , 2  By item 
@SalesType int ,-- 1 retail sales , 2 operations , 0 : all 
@CatID int ,  -- null for all 
@ItemFamId int , -- null for all 
@ItemID int , -- null for all 
@status int , -- 1: Auth only,  0 : All 
@FromDate nvarchar(20) , -- '' for all 
@Todate Nvarchar(20) ,  -- '' for all 
@invType int -- 1 invoice , 2:Return , 0 : all 
AS
BEGIN
Declare @StatusDSA as nvarchar(100) , @StatusDSE as nvarchar(100) , @BalTypeDSA as nvarchar(100) , @BalTypeDSE as nvarchar(100) , 
		@ItemDSA as nvarchar(100) , @ItemDSE as nvarchar(100) ,@SalesmanDSA as nvarchar(100) , @SalesmanDSE as nvarchar(100) , 
		@GroupDSA as nvarchar(100) , @GroupDSE as nvarchar(100) ,@CatDSA as nvarchar(100) , @CatDSE as nvarchar(100), 
		@BraDSA as nvarchar(100) , @BraDSE as nvarchar(100),@CusDSA as nvarchar(100) , @cusDSE as nvarchar(100),
		@DT as smalldatetime , @stdate smalldatetime ,@SalesDSA as nvarchar(100),@InvDSA as nvarchar(100) , @invDSE as nvarchar(100)
	
if @customerid is null  
	select  @CusDSA= 'Ã„Ì⁄ «·⁄„·«¡' ,  @cusDSE = 'All'
else 
	select  @CusDSA= NAMEA ,  @cusDSE = NAMEE from A_Rec_D_Customer where CustomerId =@customerid

if @ItemID is null  
	select  @ItemDSA= 'Ã„Ì⁄ «·«’‰«›' ,  @ItemDSE = 'All'
else 
	select  @ItemDSA= Desca ,  @ItemDSE = DescL from I_Item where itemid =@ItemID
		
if @ItemID is null  
	select  @ItemDSA= 'Ã„Ì⁄ «·«’‰«›' ,  @ItemDSE = 'All'
else 
	select  @ItemDSA= Desca ,  @ItemDSE = DescL from I_Item where itemid =@ItemID

if @CatID is null  
	select  @CatDSA= 'Ã„Ì⁄ «·›∆« ' ,  @CatDSE = 'All'
else 
	select  @CatDSA= DescA ,  @CatDSE = DescL from i_D_category where catid =@CatID

if @ItemFamId is null  
	select  @GroupDSA= 'Ã„Ì⁄ «·«‰Ê«⁄' ,  @GroupDSE = 'All'
else 
	select  @GroupDSA=  DescA ,  @GroupDSE =  DescL from I_ItemFamily where ItemFamilyID =@ItemFamId

select  @SalesDSA= case @SalesType when 0 then 'Ã„Ì⁄ «·„»Ì⁄« ' when 1 then '„»Ì⁄«   Ã“∆… ' when 2 then '„»Ì⁄«  ⁄„·Ì«  ' end 
select  @StatusDSA= case @status when 0 then ' *€Ì— „‰›–' when 1 then '›ﬁÿ „‰›–'  end 
select  @StatusDSE= case @status when 0 then '*Not authorized' when 1 then 'Authorized' end 
select  @invDSA= case @invtype when 0 then ' «·„»Ì⁄«  Ê«·„— Ã⁄« ' when 1 then '›Ê« Ì— «·„»Ì⁄« '  when 2 then '„— Ã⁄ «·„»Ì⁄« '  end 
select  @invDSE= case @invtype when 0 then 'Invoice and returns' when 1 then 'Sales invoices' when 2 then 'Sales Return' end 
 select 
  @comp as Comp , @Bra as Bra , @CompNameA as CompNameA , @CompNameE as CompNameE , @BraNameA as BraNameA , @BraNameE as BraNameE , @LoginUser as LoginUser ,  getdate() as PrintDate , @RepType as Par_RepType ,	
        @StatusDSA as Par_StatusDSA , @StatusDSE as Par_StatusDSE , @BalTypeDSA as Par_BalTypeDSA , @BalTypeDSE as Par_BalTypeDSE ,
		@CatDSA as Par_CatDSA , @CatDSE as Par_CatDSE , @GroupDSA as Par_FamilyDSA ,  @GroupDSE as Par_FamilyDSE , 
		@CusDSA as Par_CustDescA , @CusDSE as Par_CustDescE,  @GroupType as Par_GroupType,@SalesDSA as Par_SalesTypeDsA,
		@ItemDSA as Par_ItemDSA , @ItemDSE as Par_ItemDSE ,  
		@FromDate as Par_FromDate, @Todate as Par_Todate,  
		@invDSA as Par_InvoiceTypeDSA , @invDSe as Par_InvoiceTypeDSE , 

        hd.TrNo, hd.RefNO, hd.TrDate,hd.DocNo,  hd.TrType, hd.IsCash, cus.customercode Cus_Code, case when cus.customerid is null then hd.CustomerName else  cus.namea end Cus_NameA, 
		case when cus.customerid is null then hd.CustomerName else  cus.namee end Cus_NameE, hd.CustomerId, hd.TotalAmount, hd.VatAmount, hd.NetAfterVat, hd.CashAmount, hd.CardAmount, 
		case  hd.TrType when 0 then '›« Ê—…' when 1 then '„— Ã⁄' end + case  hd.SlsInvSrc when 1 then '  Ã“∆…' when 1 then ' ⁄„·Ì« ' end IV_Type,
		case  hd.IsCash when 1 then '‰ﬁœÌ' when 0 then '¬Ã·' end Pay_Type, 
		dt.ItemID, it.itemCode, it.DescA as It_DescA, DT.SERIAL , 
		it.DescL as It_DescE, fm.FamilyCode as ItFm_Code,fm.DescA as ItFm_DescA, fm.DescL as ItFm_DescE, 
		case when  hd.TrType =0 then 1 else -1 end * dt.SoldQty AS Dt_SoldQty, dt.Unitprice AS Dt_UnitPrice, case when  hd.TrType =0 then 1 else -1 end *dt.ItemTotal AS dt_ItemTotal, 
		case when  hd.TrType =0 then 1 else -1 end *dt.VatAmount AS dt_VatAmount, case when  hd.TrType =0 then 1 else -1 end *dt.NetAfterVat AS dt_NetAfterVat, 
		dt.StockUnitCost 
FROM     dbo.I_Sls_TR_Invoice AS hd INNER JOIN
         dbo.I_Sls_TR_InvoiceItems dt on hd.InvoiceID = dt.InvoiceID inner join 
		 i_item it on it.itemid = dt.itemid  inner join 
		 I_ItemFamily fm on fm.ItemFamilyID=it.ItemFamilyID  left  join 
		 A_Rec_D_Customer cus  on cus.CustomerId = hd.customerid 
where hd.CompCode = @comp and hd.BranchCode = @Bra and 
      (@PayType = 2 or hd.IsCash = @PayType) and 
	  (@status = 0 or hd.Status=@status) and 
	  (@SalesType = 0 or hd.SlsInvSrc = @SalesType) and 
	  (@customerid is null or hd.CustomerId = @customerid ) and 
	  (@CatID is null or fm.CatID = @catid ) and 
	  (@ItemFamId is null or fm.ItemFamilyID = @ItemFamId) and  
	  (@Itemid  is null or dt.ItemID = @itemid )  and 
	  (hd.trdate between @FromDate and @todate ) and 
	  (@invType = 0 or hd.trtype = @invType -1  ) 
	  

   
END

go
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description: invoice Print 
-- =============================================
ALTER   PROCEDURE [dbo].[IProc_Rpt_ItemSalesSum]
@comp int , 
@bra int , 
@CompNameA nvarchar(100) , 
@CompNameE nvarchar(100) , 
@BraNameA nvarchar(100) , 
@BraNameE nvarchar(100) , 
@LoginUser nvarchar(25), 
@RepType int,  -- 1 view , 2 PDF , 3 Excel  , 4 : print direct 
@customerid int , -- null for all 
@PayType int, --1:Cash , 0: Credit , 2: All 
@GroupType int , --1:By customer , 2  By item 
@SalesType int ,-- 1 retail sales , 2 operations , 0 : all 
@CatID int ,  -- null for all 
@ItemFamId int , -- null for all 
@ItemID int , -- null for all 
@status int , -- 1: Auth only,  0 : All 
@FromDate nvarchar(20) , -- '' for all 
@Todate Nvarchar(20) ,  -- '' for all 
@invType int -- 1 invoice , 2:Return , 0 : all 
AS
BEGIN
Declare @StatusDSA as nvarchar(100) , @StatusDSE as nvarchar(100) , @BalTypeDSA as nvarchar(100) , @BalTypeDSE as nvarchar(100) , 
		@ItemDSA as nvarchar(100) , @ItemDSE as nvarchar(100) ,@SalesmanDSA as nvarchar(100) , @SalesmanDSE as nvarchar(100) , 
		@GroupDSA as nvarchar(100) , @GroupDSE as nvarchar(100) ,@CatDSA as nvarchar(100) , @CatDSE as nvarchar(100), 
		@BraDSA as nvarchar(100) , @BraDSE as nvarchar(100),@CusDSA as nvarchar(100) , @cusDSE as nvarchar(100),
		@DT as smalldatetime , @stdate smalldatetime  , @SalesDSA as nvarchar(100),@InvDSA as nvarchar(100) , @invDSE as nvarchar(100)
	
if @customerid is null  
	select  @CusDSA= 'Ã„Ì⁄ «·⁄„·«¡' ,  @cusDSE = 'All'
else 
	select  @CusDSA= NAMEA ,  @cusDSE = NAMEE from A_Rec_D_Customer where CustomerId =@customerid

if @ItemID is null  
	select  @ItemDSA= 'Ã„Ì⁄ «·«’‰«›' ,  @ItemDSE = 'All'
else 
	select  @ItemDSA= Desca ,  @ItemDSE = DescL from I_Item where itemid =@ItemID
		
if @ItemID is null  
	select  @ItemDSA= 'Ã„Ì⁄ «·«’‰«›' ,  @ItemDSE = 'All'
else 
	select  @ItemDSA= Desca ,  @ItemDSE = DescL from I_Item where itemid =@ItemID

if @CatID is null  
	select  @CatDSA= 'Ã„Ì⁄ «·›∆« ' ,  @CatDSE = 'All'
else 
	select  @CatDSA= DescA ,  @CatDSE = DescL from i_D_category where catid =@CatID

if @ItemFamId is null  
	select  @GroupDSA= 'Ã„Ì⁄ «·«‰Ê«⁄' ,  @GroupDSE = 'All'
else 
	select  @GroupDSA=  DescA ,  @GroupDSE =  DescL from I_ItemFamily where ItemFamilyID =@ItemFamId
select  @SalesDSA= case @SalesType when 0 then 'Ã„Ì⁄ «·„»Ì⁄« ' when 1 then '„»Ì⁄«   Ã“∆… ' when 2 then '„»Ì⁄«  ⁄„·Ì«  ' end 
select  @StatusDSA= case @status when 0 then ' *€Ì— „‰›–' when 1 then '›ﬁÿ „‰›–'  end 
select  @StatusDSE= case @status when 0 then '*Not authorized' when 1 then 'Authorized' end 
select  @invDSA= case @invtype when 0 then ' «·„»Ì⁄«  Ê«·„— Ã⁄« ' when 1 then '›Ê« Ì— «·„»Ì⁄« '  when 2 then '„— Ã⁄ «·„»Ì⁄« '  end 
select  @invDSE= case @invtype when 0 then 'Invoice and returns' when 1 then 'Sales invoices' when 2 then 'Sales Return' end 

 select 
  @comp as Comp , @Bra as Bra , @CompNameA as CompNameA , @CompNameE as CompNameE , @BraNameA as BraNameA , @BraNameE as BraNameE , @LoginUser as LoginUser ,  getdate() as PrintDate , @RepType as Par_RepType ,	
        @StatusDSA as Par_StatusDSA , @StatusDSE as Par_StatusDSE , @BalTypeDSA as Par_BalTypeDSA , @BalTypeDSE as Par_BalTypeDSE ,
		@CatDSA as Par_CatDSA , @CatDSE as Par_CatDSE , @GroupDSA as Par_FamilyDSA ,  @GroupDSE as Par_FamilyDSE , 
		@CusDSA as Par_CustDescA , @CusDSE as Par_CustDescE,  @GroupType as Par_GroupType, @SalesDSA as Par_SalesTypeDsA,
		@ItemDSA as Par_ItemDSA , @ItemDSE as Par_ItemDSE ,  
		@FromDate as Par_FromDate, @Todate as Par_Todate, 
		@invDSA as Par_InvoiceTypeDSA , @invDSe as Par_InvoiceTypeDSE , 

        cus.customercode Cus_Code, case when cus.customerid is null then hd.CustomerName else  cus.namea end Cus_NameA, 
		case when cus.customerid is null then hd.CustomerName else  cus.namee end Cus_NameE, 
		hd.CustomerId, dt.ItemID, it.ItemCode, it.DescA AS It_DescA, it.DescL AS It_DescE, fm.FamilyCode AS ItFm_Code, fm.DescA AS ItFm_DescA, fm.DescL AS ItFm_DescE, 
        SUM(CASE WHEN hd.TrType = 0 THEN 1 ELSE - 1 END * dt.SoldQty) AS Dt_NetSoldQty,
		SUM(CASE WHEN hd.TrType = 0 and iscash = 1 THEN 1  ELSE 0 END * dt.SoldQty) AS Dt_CashSoldQty,
		SUM(CASE WHEN hd.TrType = 0 and iscash = 0 THEN 1  ELSE 0 END * dt.SoldQty) AS Dt_CreditSoldQty,
		SUM(CASE WHEN hd.TrType = 1 and iscash = 1 THEN 1  ELSE 0 END * dt.SoldQty) AS Dt_CashRetQty,
		SUM(CASE WHEN hd.TrType = 1 and iscash = 0 THEN 1  ELSE 0 END * dt.SoldQty) AS Dt_CreditRetQty,
		SUM(CASE WHEN hd.TrType = 0 THEN 1 ELSE - 1 END * dt.ItemTotal) AS dt_ItemTotal, 
		SUM(CASE WHEN hd.TrType = 0 and iscash = 1 THEN 1  ELSE 0 END * dt.NetAfterVat) AS Dt_CashSoldAmt,
		SUM(CASE WHEN hd.TrType = 0 and iscash = 0 THEN 1  ELSE 0 END * dt.NetAfterVat) AS Dt_CreditSoldAmt,
		SUM(CASE WHEN hd.TrType = 1 and iscash = 1 THEN 1  ELSE 0 END * dt.NetAfterVat) AS Dt_CashRetAmt,
		SUM(CASE WHEN hd.TrType = 1 and iscash = 0 THEN 1  ELSE 0 END * dt.NetAfterVat) AS Dt_CreditRetAmt,
        SUM(CASE WHEN hd.TrType = 0 THEN 1 ELSE - 1 END * dt.VatAmount) AS dt_NetVatAmount, 
		SUM(CASE WHEN hd.TrType = 0 THEN 1 ELSE - 1 END * dt.NetAfterVat) AS dt_NetAmt, 
        SUM(CASE WHEN hd.TrType = 0 THEN 1 ELSE - 1 END * dt.SoldQty * dt.StockUnitCost) AS Dt_Cost
FROM     dbo.I_Sls_TR_Invoice AS hd INNER JOIN
        dbo.I_Sls_TR_InvoiceItems AS dt ON hd.InvoiceID = dt.InvoiceID INNER JOIN
        dbo.I_Item AS it ON it.ItemID = dt.ItemID INNER JOIN
        dbo.I_ItemFamily AS fm ON fm.ItemFamilyID = it.ItemFamilyID left  join 
		 A_Rec_D_Customer cus  on cus.CustomerId = hd.customerid 

where hd.CompCode = @comp and hd.BranchCode = @Bra and trtype in (0,1) and 
      (@PayType = 2 or hd.IsCash = @PayType) and 
	  (@status = 0 or hd.Status=@status) and 
	  (@SalesType = 0 or hd.SlsInvSrc = @SalesType) and 
	  (@customerid is null or hd.CustomerId = @customerid ) and 
	  (@CatID is null or fm.CatID = @catid ) and 
	  (@ItemFamId is null or fm.ItemFamilyID = @ItemFamId) and  
	  (@Itemid  is null or dt.ItemID = @itemid )  and 
	  (hd.trdate between @FromDate and @todate ) and 
	  (@invType = 0 or hd.trtype = @invType-1 ) 
GROUP BY cus.CustomerId ,cus.CustomerCODE, cus.namea, cus.namee, hd.CustomerId, dt.ItemID, it.ItemCode, it.DescA, it.DescL, fm.FamilyCode, fm.DescA, fm.DescL,hd.CustomerName
	  

   
END
go

-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description: invoice Print 
-- =============================================
ALTER   PROCEDURE [dbo].[IProc_Rpt_AccSlsCashInvoiceList]
@comp int , 
@bra int , 
@CompNameA nvarchar(100) , 
@CompNameE nvarchar(100) , 
@BraNameA nvarchar(100) , 
@BraNameE nvarchar(100) , 
@LoginUser nvarchar(25), 
@RepType int,  -- 1 view , 2 PDF , 3 Excel  , 4 : print direct 
@TrType int , -- 1: invoice , 2 : return 
@FromDate nvarchar(20) , 
@ToDate nvarchar(20) ,  -- '' or later use 
@PaymentType int  ,  --0: not paid , 1:Paid , 2 : all 
@CustomerID int , -- null for all 
@SalesmanID int , -- null for all 
@CashBoxID int , -- null for all 
@MobileNo nvarchar(20) , --'' for all 
@Status int  -- 1 auth , 0, not auth , 2 all 
AS
BEGIN
declare @StatusDSA as nvarchar(100) , @StatusDSE as nvarchar(100) , @CashBoxDSA as nvarchar(100) , @CashBoxDSE as nvarchar(100) , 
		@CustDSA as nvarchar(100) , @CustDSE as nvarchar(100) ,@SalesmanDSA as nvarchar(100) , @SalesmanDSE as nvarchar(100),
		@PaymentDSA as nvarchar(100) , @PaymentDSE as nvarchar(100) 
if @CashBoxID is null  
	select  @CashBoxDSA= 'Ã„Ì⁄ «·’‰«œÌﬁ' ,  @CashBoxDSE = 'All'
else 
	select  @CashBoxDSA= CashBox_DescA ,  @CashBoxDSE = CashBox_DescE from A_RecPay_D_CashBox where CashBoxID =@CashBoxID
		
if @CustomerID is null  
	select  @CustDSA= 'Ã„Ì⁄ «·⁄„·«¡' ,  @CustDSE = 'All'
else 
	select  @CustDSA= NAMEA ,  @CustDSE = NAMEE from A_Rec_D_Customer where CustomerId =@CustomerID

if @SalesmanID is null  
	select  @SalesmanDSA= 'Ã„Ì⁄ «·„‰«œÌ»' ,  @SalesmanDSE = 'All'
else 
	select  @SalesmanDSA= NAMEA ,  @SalesmanDSE = NAMEE from I_Sls_D_Salesman where SalesmanId =@SalesmanID

select  @StatusDSA= case @status when 0 then '€Ì— „‰›–' when 1 then '„‰›–' when 2 then '«·Ã„Ì⁄' end 
select  @StatusDSE= case @status when 0 then 'Not authorized' when 1 then 'Authorized' when 2 then 'All' end 

select  @PaymentDSA= case @PaymentType when 0 then '€Ì— „”œœ' when 1 then '„”œœ' when 2 then '«·Ã„Ì⁄' end 
select  @PaymentDSE= case @PaymentType when 0 then 'Not Paid' when 1 then 'Paid' when 2 then 'All' end 

select  @comp as Comp , @Bra as Bra , @CompNameA as CompNameA , @CompNameE as CompNameE , @BraNameA as BraNameA , @BraNameE as BraNameE , @LoginUser as LoginUser ,  getdate() as PrintDate , @RepType as Par_RepType ,	
        @StatusDSA as Par_StatusDSA , @StatusDSE as Par_StatusDSE , @CashBoxDSA as Par_CashBoxDSA , @CashBoxDSE as Par_CashBoxDSE ,
		@CustDSA as Par_CustDSA , @CustDSE as Par_CustDSE , @SalesmanDSA as Par_SalesmanDSA , @SalesmanDSE as Par_SalesmanDSE , 
		@FromDate as Par_FromDate,  @PaymentDSA as Par_PaymentDSA , @PaymentDSE as Par_PaymentDSE ,
        invstat.InvoiceID, invstat.TrNo, invstat.RefNO, invstat.RefTrID, invstat.TrDate, invstat.TrDateH, invstat.TrType, invstat.IsCash, invstat.SlsInvType, invstat.SlsInvSrc, invstat.CashBoxID, invstat.CustomerId, 
        CASE WHEN invstat.customerid IS NULL THEN invstat.CustomerName ELSE Cus_NameA END AS Cust_nameA, CASE WHEN invstat.customerid IS NULL THEN invstat.CustomerName ELSE Cus_NameA END AS Cust_nameE, 
        invstat.SalesmanId, invstat.StoreId, invstat.OperationId, invstat.TotalAmount, invstat.VatAmount, invstat.VatType, invstat.DiscountAmount, invstat.DiscountPrc, invstat.NetAfterVat, invstat.CommitionAmount, invstat.CashAmount, 
        invstat.CardAmount, invstat.BankTfAmount, invstat.BankAccount, invstat.TotalPaidAmount, invstat.RemainAmount, invstat.Remark, invstat.Status, invstat.IsPosted, invstat.VoucherNo, invstat.VoucherType, invstat.CreatedAt, 
        invstat.CreatedBy, invstat.UpdatedAt, invstat.UpdatedBy, invstat.CompCode, invstat.BranchCode, invstat.Slsm_Code, invstat.Slsm_DescA,  invstat.Cus_Code, invstat.Box_DescA, 
        invstat.Line_Count, invstat.Item_Count, invstat.Tot_Qty,  ref.TrNo AS Ref_TrNo, ref.TrDate AS Ref_TrDate, invstat.CustomerMobileNo
FROM     IQ_GetSlsInvoiceStatistic AS invstat LEFT OUTER JOIN
         I_Sls_TR_Invoice AS ref ON invstat.RefTrID = ref.InvoiceID
where    invstat.CompCode = @comp and  invstat.TrType = @TrType and invstat.IsCash = 1 and 		
		(@SalesmanID is null or invstat.SalesmanId = @SalesmanID) AND 
		(@CashBoxID is null or invstat.CashBoxID = @CashBoxID) AND 
		(@CustomerID is null or invstat.CustomerId = @CustomerID) AND 
		(@MobileNo ='' or invstat.CustomerMobileNo =@MobileNo) and 
		(@status=2  or  invstat.status =   @status )   and 
		(@PaymentType = 2 or (@PaymentType = 0 and invstat.TotalPaidAmount =0 ) or (@PaymentType = 1 and invstat.RemainAmount =0 ) ) and 
		invstat.TrDate = @Fromdate 
END
