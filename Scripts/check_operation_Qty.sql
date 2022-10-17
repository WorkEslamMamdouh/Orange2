select hd.compcode, hd.trno , hd.trdate,hd.status , hd.close_trDate ,  op.operationid ,  op.itemid ,op.ReceivedQty, op.soldqty, s.q 
--update op set soldqty = isnull( s.q  ,0)
from I_TR_Operation hd inner join [dbo].[I_TR_OperationItems] op on hd.operationid = op.operationid left join 
(SELECT   dt.operationid, hd.CompCode, dt.ItemID, SUM(case when hd.trtype = 0 then dt.SoldQty else -dt.SoldQty end) AS q
FROM     dbo.I_Sls_TR_Invoice AS hd INNER JOIN
                  dbo.I_Sls_TR_InvoiceItems AS dt ON hd.InvoiceID = dt.InvoiceID
WHERE  (hd.SlsInvSrc = 2) and hd.status = 1 
GROUP BY dt.operationid, hd.CompCode, dt.ItemID
) s on op.operationid = s.operationid and op.itemid = s.itemid 
where op.soldqty<> isnull( s.q  ,0) and hd.compcode in ( 3, 4) and year(hd.trdate) = 2022  


select distinct hd.compcode, hd.trno , hd.trdate,hd.status , hd.close_trDate 
from I_TR_Operation hd inner join [dbo].[I_TR_OperationItems] op on hd.operationid = op.operationid left join 
(SELECT   dt.operationid, hd.CompCode, dt.ItemID, SUM(case when hd.trtype = 0 then dt.SoldQty else -dt.SoldQty end) AS q
FROM     dbo.I_Sls_TR_Invoice AS hd INNER JOIN
                  dbo.I_Sls_TR_InvoiceItems AS dt ON hd.InvoiceID = dt.InvoiceID
WHERE  (hd.SlsInvSrc = 2) and hd.status = 1 
GROUP BY dt.operationid, hd.CompCode, dt.ItemID
) s on op.operationid = s.operationid and op.itemid = s.itemid 
where op.soldqty<> isnull( s.q  ,0) and hd.compcode in ( 3, 4) and year(hd.trdate) = 2022 and hd.status > 2 
order by  hd.compcode, hd.trno