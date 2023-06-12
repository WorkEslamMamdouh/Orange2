using Inv.API.Models;
using Inv.API.Models.CustomModel;
using Inv.API.Tools;
using Inv.BLL.Services.ServPurInvoice;
using Inv.BLL.Services.ServPurInvoiceHeader;
using Inv.BLL.Services.ServPurInvoiceDetail;
using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Inv.API.Controllers;

namespace Inv.API.Controllers
{
    


    public class ServPurInvoiceController : BaseController

    {
        private readonly IServPurInvoiceService ServPurInvoiceService;
        private readonly IServPurInvoiceHeaderService IServPurInvoiceHeaderService;
        private readonly IServPurInvoiceDetailService IServPurInvoiceDetailService;
        private readonly G_USERSController UserControl;
        public ServPurInvoiceController(IServPurInvoiceDetailService _IServPurInvoiceDetailService, IServPurInvoiceService _ServPurInvoiceService, IServPurInvoiceHeaderService _IServPurInvoiceHeaderService, G_USERSController _Control)
        {
            this.ServPurInvoiceService = _ServPurInvoiceService;
            this.IServPurInvoiceHeaderService = _IServPurInvoiceHeaderService;
            this.IServPurInvoiceDetailService = _IServPurInvoiceDetailService;
            this.UserControl = _Control;
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAll(string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var res = ServPurInvoiceService.GetAll().ToList();

                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetById(int id, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var res = ServPurInvoiceService.GetById(id);

                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }
       

        [HttpPost, AllowAnonymous]
        public IHttpActionResult Insert([FromBody]ServPurchseInvoiceMasterDetail obj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(obj.Token, obj.UserCode))
            {
                using (var dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        var Menu = ServPurInvoiceService.Insert(obj.AVAT_TR_PurInvoice);

                        var insertedHeader = obj.AVAT_TR_PurInvoiceHeader.Where(x => x.StatusFlag == 'i').ToList();
                        var insertedDetail = obj.AVAT_TR_PurInvoiceDetail.Where(x => x.StatusFlag == 'i').ToList();
                        for (int i = 0; i < insertedHeader.Count; i++)
                        {
                            insertedHeader[i].InvoiceId = Menu.InvoiceId;
                            var header = IServPurInvoiceHeaderService.Insert(insertedHeader[i]);

                            for (int j = 0; j < insertedDetail.Count; j++)
                            {
                                if (header.VND_SERIAL == insertedDetail[j].VND_SERIAL)
                                {
                                    insertedDetail[j].InvoiceHeaderID = header.InvoiceHeaderID;
                                    insertedDetail[j].InvoiceId = header.InvoiceId;
                                    IServPurInvoiceDetailService.Insert(insertedDetail[j]);
                                }
                            }
                        }

                        ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(obj.AVAT_TR_PurInvoice.CompCode), Convert.ToInt32(obj.AVAT_TR_PurInvoice.BranchCode), Menu.InvoiceId, "servPurInv", "Add", db);
                        if (res.ResponseState == true)
                        {
                            dbTransaction.Commit();
                            Menu.TR_NO = int.Parse(res.ResponseData.ToString());
                            LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.AVAT_TR_PurInvoice.InvoiceId, LogUser.UserLog.Insert, obj.MODULE_CODE, true, null, null, null);
                            //updateHeadersDocNum(Menu.InvoiceId);
                            return Ok(new BaseResponse(Menu));
                        }

                        else
                        {
                            dbTransaction.Rollback();
                            LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.AVAT_TR_PurInvoice.InvoiceId, LogUser.UserLog.Insert, obj.MODULE_CODE, false, res.ResponseMessage.ToString(), null, null);
                            return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, res.ResponseMessage));
                        }
                    }

                    catch (Exception ex)
                    {
                        dbTransaction.Rollback();
                        LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, null, LogUser.UserLog.Insert, obj.MODULE_CODE, false, ex.Message.ToString(), null, null);
                        return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                    }
                }
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult updateHeadersDocNum(int IvnoiceID)
        {
            var MenuObj = db.AVAT_TR_PurInvoice.Where(s => s.InvoiceId == IvnoiceID).FirstOrDefault();
            var Headers = db.AVAT_TR_PurInvoiceHeader.Where(s => s.InvoiceId == IvnoiceID).ToList();
            for (int i = 0; i < Headers.Count; i++)
            {
                if (Headers[i].VND_SERIAL.ToString().Length == 1)
                {
                    Headers[i].DocNo = MenuObj.DocNo + '-' + '0' + Headers[i].VND_SERIAL;
                }
                else
                {
                    Headers[i].DocNo = MenuObj.DocNo + '-' + Headers[i].VND_SERIAL;
                }

                IServPurInvoiceHeaderService.Update(Headers[i]);
            }
            return Ok(1);
        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult UpdatePurchaseInvoice([FromBody]ServPurchseInvoiceMasterDetail obj)
        {
            //if (ModelState.IsValid && UserControl.CheckUser(obj.Token, obj.UserCode))
            if (UserControl.CheckUser(obj.Token, obj.UserCode))
            {
                using (var dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        var Menu = ServPurInvoiceService.Update(obj.AVAT_TR_PurInvoice);

                        var insertedHeader = obj.AVAT_TR_PurInvoiceHeader.Where(x => x.StatusFlag == 'i').ToList();
                        var UpdatedHeader = obj.AVAT_TR_PurInvoiceHeader.Where(x => x.StatusFlag == 'u').ToList();
                        var deletedHeader = obj.AVAT_TR_PurInvoiceHeader.Where(x => x.StatusFlag == 'd').ToList();

                        var insertedDetail = obj.AVAT_TR_PurInvoiceDetail.Where(x => x.StatusFlag == 'i' && x.InvoiceHeaderID==0).ToList();
                        var updatedDetail = obj.AVAT_TR_PurInvoiceDetail.Where(x => x.StatusFlag == 'u').ToList();
                        var deletedDetail = obj.AVAT_TR_PurInvoiceDetail.Where(x => x.StatusFlag == 'd').ToList();

                        // Insert Region
                        for ( int i = 0; i < insertedHeader.Count; i++)
                        {
                            insertedHeader[i].InvoiceId = Menu.InvoiceId;
                            var header = IServPurInvoiceHeaderService.Insert(insertedHeader[i]);

                            for (int j = 0; j < insertedDetail.Count; j++)
                            {
                                if (header.VND_SERIAL == insertedDetail[j].VND_SERIAL)
                                {
                                    insertedDetail[j].InvoiceHeaderID = header.InvoiceHeaderID;
                                    insertedDetail[j].InvoiceId = header.InvoiceId;
                                    IServPurInvoiceDetailService.Insert(insertedDetail[j]);
                                   insertedDetail[j].StatusFlag ='x';//Inserted Before
                                }
                            }
                        }

                        // delete header with its detail Region
                        for (int i = 0; i < deletedHeader.Count; i++)
                        {
                            var relatedDetailWithHeader = obj.AVAT_TR_PurInvoiceDetail.Where(x => x.InvoiceHeaderID == deletedHeader[i].InvoiceHeaderID).ToList();
                            for (int j = 0; j < relatedDetailWithHeader.Count; j++)
                            {
                                IServPurInvoiceDetailService.Delete(relatedDetailWithHeader[j].InvoiceDetailID);
                            }
                            IServPurInvoiceHeaderService.Delete(deletedHeader[i].InvoiceHeaderID);
                        }
                             
                        // update header 
                        for (int i = 0; i < UpdatedHeader.Count; i++)
                        {
                            UpdatedHeader[i].InvoiceId = obj.AVAT_TR_PurInvoice.InvoiceId;
                            IServPurInvoiceHeaderService.Update(UpdatedHeader[i]);
                        }

                        // update Details 
                        for (int i = 0; i < updatedDetail.Count; i++)
                        {
                            updatedDetail[i].InvoiceId = obj.AVAT_TR_PurInvoice.InvoiceId;

                            for (int j = 0; j < obj.AVAT_TR_PurInvoiceHeader.Count; j++)
                            {
                                if (obj.AVAT_TR_PurInvoiceHeader[j].VND_SERIAL == updatedDetail[i].VND_SERIAL)
                                {
                                    updatedDetail[i].InvoiceHeaderID = obj.AVAT_TR_PurInvoiceHeader[j].InvoiceHeaderID;
                                    IServPurInvoiceDetailService.Update(updatedDetail[i]);
                                }
                            }
                        }
                    // Insert Details 
                     insertedDetail = obj.AVAT_TR_PurInvoiceDetail.Where(x => x.StatusFlag == 'i').ToList();
                    for (int i = 0; i < insertedDetail.Count; i++)
                        {
                        insertedDetail[i].InvoiceId = obj.AVAT_TR_PurInvoice.InvoiceId;

                            for (int j = 0; j < obj.AVAT_TR_PurInvoiceHeader.Count; j++)
                            {
                                if (obj.AVAT_TR_PurInvoiceHeader[j].VND_SERIAL == insertedDetail[i].VND_SERIAL)
                                {
                                insertedDetail[i].InvoiceHeaderID = obj.AVAT_TR_PurInvoiceHeader[j].InvoiceHeaderID;
                                    IServPurInvoiceDetailService.Insert(insertedDetail[i]);
                                }
                            }
                        }

                        // delete Detail
                        for (int i = 0; i < deletedDetail.Count; i++)
                        {
                            IServPurInvoiceDetailService.Delete(deletedDetail[i].InvoiceDetailID);
                        }

                        ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(obj.AVAT_TR_PurInvoice.CompCode), Convert.ToInt32(obj.AVAT_TR_PurInvoice.BranchCode), Menu.InvoiceId, "servPurInv", "Update", db);
                        if (res.ResponseState == true)
                        {
                            dbTransaction.Commit();
                            LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.AVAT_TR_PurInvoice.InvoiceId, LogUser.UserLog.Update, obj.MODULE_CODE, true, null, null, null);
                            Menu.TR_NO = int.Parse(res.ResponseData.ToString());
                        return Ok(new BaseResponse(Menu));
                        }

                        else
                        {
                            dbTransaction.Rollback();
                            LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.AVAT_TR_PurInvoice.InvoiceId, LogUser.UserLog.Update, obj.MODULE_CODE, false, res.ResponseMessage.ToString(), null, null);
                            return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, res.ResponseMessage));
                        }
                    }

                    catch (Exception ex)
                    {
                        dbTransaction.Rollback();
                        LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, null, LogUser.UserLog.Update, obj.MODULE_CODE, false, ex.Message.ToString(), null, null);
                        return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                    }
                }
            }
            // return BadRequest(ModelState);
           return Ok(new BaseResponse());
        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult OpenPurchaseInvoice([FromBody]ServPurchseInvoiceMasterDetail obj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(obj.Token, obj.UserCode))
            {
                using (var dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        var Menu = ServPurInvoiceService.Update(obj.AVAT_TR_PurInvoice);

                        var insertedHeader = obj.AVAT_TR_PurInvoiceHeader.Where(x => x.StatusFlag == 'i').ToList();
                        var UpdatedHeader = obj.AVAT_TR_PurInvoiceHeader.Where(x => x.StatusFlag == 'u').ToList();
                        var deletedHeader = obj.AVAT_TR_PurInvoiceHeader.Where(x => x.StatusFlag == 'd').ToList();

                        var insertedDetail = obj.AVAT_TR_PurInvoiceDetail.Where(x => x.StatusFlag == 'i').ToList();
                        var updatedDetail = obj.AVAT_TR_PurInvoiceDetail.Where(x => x.StatusFlag == 'u').ToList();
                        var deletedDetail = obj.AVAT_TR_PurInvoiceDetail.Where(x => x.StatusFlag == 'd').ToList();

                        // Insert Region
                        for (int i = 0; i < insertedHeader.Count; i++)
                        {
                            insertedHeader[i].InvoiceId = Menu.InvoiceId;
                            var header = IServPurInvoiceHeaderService.Insert(insertedHeader[i]);

                            for (int j = 0; j < insertedDetail.Count; j++)
                            {
                                if (header.VND_SERIAL == insertedDetail[j].VND_SERIAL)
                                {
                                    insertedDetail[j].InvoiceHeaderID = header.InvoiceHeaderID;
                                    insertedDetail[j].InvoiceId = header.InvoiceId;
                                    IServPurInvoiceDetailService.Insert(insertedDetail[j]);
                                }
                            }
                        }

                        // delete header with its detail Region
                        for (int i = 0; i < deletedHeader.Count; i++)
                        {
                            var relatedDetailWithHeader = obj.AVAT_TR_PurInvoiceDetail.Where(x => x.InvoiceHeaderID == deletedHeader[i].InvoiceHeaderID).ToList();
                            for (int j = 0; j < relatedDetailWithHeader.Count; j++)
                            {
                                IServPurInvoiceDetailService.Delete(relatedDetailWithHeader[j].InvoiceDetailID);
                            }
                            IServPurInvoiceHeaderService.Delete(deletedHeader[i].InvoiceHeaderID);
                        }

                        // update header 
                        for (int i = 0; i < UpdatedHeader.Count; i++)
                        {
                            UpdatedHeader[i].InvoiceId = obj.AVAT_TR_PurInvoice.InvoiceId;
                            IServPurInvoiceHeaderService.Update(UpdatedHeader[i]);
                        }

                        // update Details 
                        for (int i = 0; i < updatedDetail.Count; i++)
                        {
                            updatedDetail[i].InvoiceId = obj.AVAT_TR_PurInvoice.InvoiceId;

                            for (int j = 0; j < obj.AVAT_TR_PurInvoiceHeader.Count; j++)
                            {
                                if (obj.AVAT_TR_PurInvoiceHeader[j].VND_SERIAL == updatedDetail[i].VND_SERIAL)
                                {
                                    updatedDetail[i].InvoiceHeaderID = obj.AVAT_TR_PurInvoiceHeader[j].InvoiceHeaderID;
                                    IServPurInvoiceDetailService.Update(updatedDetail[i]);
                                }
                            }
                        }
                        // Insert Details 
                        for (int i = 0; i < insertedDetail.Count; i++)
                        {
                            insertedDetail[i].InvoiceId = obj.AVAT_TR_PurInvoice.InvoiceId;

                            for (int j = 0; j < obj.AVAT_TR_PurInvoiceHeader.Count; j++)
                            {
                                if (obj.AVAT_TR_PurInvoiceHeader[j].VND_SERIAL == insertedDetail[i].VND_SERIAL)
                                {
                                    insertedDetail[i].InvoiceHeaderID = obj.AVAT_TR_PurInvoiceHeader[j].InvoiceHeaderID;
                                    IServPurInvoiceDetailService.Insert(insertedDetail[i]);
                                }
                            }
                        }

                        // delete Detail
                        for (int i = 0; i < deletedDetail.Count; i++)
                        {
                            IServPurInvoiceDetailService.Delete(deletedDetail[i].InvoiceDetailID);
                        }


                        ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(obj.AVAT_TR_PurInvoice.CompCode), Convert.ToInt32(obj.AVAT_TR_PurInvoice.BranchCode), Menu.InvoiceId, "servPurInv", "Open", db);
                        if (res.ResponseState == true)
                        {
                            dbTransaction.Commit();
                            LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.AVAT_TR_PurInvoice.InvoiceId, LogUser.UserLog.Open, obj.MODULE_CODE, true, null, null, null);
                            Menu.TR_NO = int.Parse(res.ResponseData.ToString());
                            return Ok(new BaseResponse(Menu));
                        }

                        else
                        {
                            dbTransaction.Rollback();
                            LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.AVAT_TR_PurInvoice.InvoiceId, LogUser.UserLog.Open, obj.MODULE_CODE, false, res.ResponseMessage.ToString(), null, null);
                            return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, res.ResponseMessage));
                        }
                    }

                    catch (Exception ex)
                    {
                        dbTransaction.Rollback();
                        LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, null, LogUser.UserLog.Open, obj.MODULE_CODE, false, ex.Message.ToString(), null, null);
                        return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                    }
                }
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult Delete(int ID, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                try
                {
                    ServPurInvoiceService.Delete(ID);
                    return Ok(new BaseResponse());
                }
                catch (Exception ex)
                {
                    return Ok(new BaseResponse(0, "Error"));
                }

            }
            else
            {
                return BadRequest(ModelState);
            }
        }
        [HttpPost, AllowAnonymous]
        public IHttpActionResult Update([FromBody]AVAT_TR_PurInvoice obj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(obj.Token, obj.UserCode))
            {
                try
                {
                    var res = ServPurInvoiceService.Update(obj);
                    return Ok(new BaseResponse(res));
                }
                catch (Exception ex)
                {
                    return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                }
            }
            return BadRequest(ModelState);
        }


        [HttpGet, AllowAnonymous]
        public IHttpActionResult Search(string UserCode, string Token, string strtdt, string Enddt, int clos,int chkImp,int compCode,int branch)
        {
            if ( UserControl.CheckUser(Token, UserCode))
            {
                string s  = "select * from AVAT_TR_PurInvoice where  CompCode="+compCode+ " and BranchCode="+branch;
                string condition = "";

                if (chkImp == 1)
                {
                    condition = condition + "and  ImportInvoice =  0 ";
                }
                else if (chkImp == 0)
                {
                    condition = condition + "and  ImportInvoice = 1";
                }

                if (clos == 0)
                {
                    condition = condition + " and CLOSED =  0 ";
                }
                else if (clos == 1)
                {
                    condition = condition + " and CLOSED = 1 ";
                }
                
                if (strtdt != "" && strtdt!=null)
                    condition = condition + "and TR_DATE>='" + strtdt + "'";
                if (Enddt != "" && Enddt!=null)
                    condition = condition + "and TR_DATE<='" + Enddt + "'";

                string query = s + condition;
                var res = db.Database.SqlQuery<AVAT_TR_PurInvoice>(query).ToList();
                //var res2 = db.AQVAT_GetPurInvoiceHeader.ToList();
                //var res3 = db.AQVAT_GetPurInvoiceDetail.ToList();
                //AQ_ServPurInvoiceMasterDetail model = new AQ_ServPurInvoiceMasterDetail();
                //model.AVAT_TR_PurInvoice = res;
                //model.AQVAT_GetPurInvoiceHeader = res2;
                //model.AQVAT_GetPurInvoiceDetail = res3;

                return Ok(new BaseResponse(res));
            }
            return Ok(new BaseResponse());
        }



        [HttpGet, AllowAnonymous]
        public IHttpActionResult AllGetGetPurInvoiceDetails(int InvoiceId, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                List<AQVAT_GetPurInvoiceHeader> res_1 = db.AQVAT_GetPurInvoiceHeader.Where(x => x.InvoiceId == InvoiceId).ToList();
                List<AQVAT_GetPurInvoiceDetail> res_2 = db.AQVAT_GetPurInvoiceDetail.Where(x => x.InvoiceId == InvoiceId).ToList();

                AQ_ServPurInvoiceMasterDetail Model = new AQ_ServPurInvoiceMasterDetail
                {
                    AQVAT_GetPurInvoiceHeader = res_1, 
                    AQVAT_GetPurInvoiceDetail = res_2,
                };

                return Ok(new BaseResponse(Model));
            }
            return BadRequest(ModelState);
        }


        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetPurInvoiceDetails(int InvoiceHeaderID, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                List<AQVAT_GetPurInvoiceHeader> res_1 = db.AQVAT_GetPurInvoiceHeader.Where(x => x.InvoiceHeaderID == InvoiceHeaderID).ToList();
                List<AQVAT_GetPurInvoiceDetail> res_2 = db.AQVAT_GetPurInvoiceDetail.Where(x => x.InvoiceHeaderID == InvoiceHeaderID).ToList();
                AQ_ServPurInvoiceMasterDetail Model = new AQ_ServPurInvoiceMasterDetail
                {
                    AQVAT_GetPurInvoiceHeader = res_1,
                    AQVAT_GetPurInvoiceDetail = res_2,
                };
                return Ok(new BaseResponse(Model));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetPurInvoiceby_InvoiceDoc_NO(string DocNo, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                List<AQVAT_GetPurInvoiceHeader> res_1 = db.AQVAT_GetPurInvoiceHeader.Where(x => x.DocNo == DocNo).ToList();
                List<AQVAT_GetPurInvoiceDetail> res_2 = new List<AQVAT_GetPurInvoiceDetail>();
                if (res_1.Count != 0)
                {
                    res_2 = db.AQVAT_GetPurInvoiceDetail.ToList().Where(x => x.InvoiceHeaderID == res_1[0].InvoiceHeaderID).ToList();
                }
                    AQ_ServPurInvoiceMasterDetail Model = new AQ_ServPurInvoiceMasterDetail
                {
                    AQVAT_GetPurInvoiceHeader = res_1,
                    AQVAT_GetPurInvoiceDetail = res_2,
                };
                return Ok(new BaseResponse(Model));
            }
            return BadRequest(ModelState);
        }

         [HttpGet, AllowAnonymous]
        public IHttpActionResult GetPurInvoicebyID(int InvID, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                AQVAT_GetPurInvoiceHeader res_1 = db.AQVAT_GetPurInvoiceHeader.Where(x => x.InvoiceHeaderID == InvID).FirstOrDefault();
               
                return Ok(new BaseResponse(res_1));
            }
            return BadRequest(ModelState);
        }


    }




}