using Inv.API.Models;
using Inv.API.Tools;
using Inv.BLL.Services.AVATPurInvoiceRet;
using Inv.BLL.Services.AVATPurInvoiceRetDetail;
using Inv.BLL.Services.ServPurInvoiceDetail;
using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Inv.API.Controllers;
using Inv.API.Models.CustomModel;

namespace Inv.API.Controllers
{
  

    public class AVATPurInvoiceRetController : BaseController

    {
        private readonly IAVATPurInvoiceRetService AVATPurInvoiceRetService;
        private readonly IAVATPurInvoiceRetDetailService AVATPurInvoiceRetDetailService;
        private readonly IServPurInvoiceDetailService ServPurInvoiceDetailService;
        private readonly G_USERSController UserControl;
        public AVATPurInvoiceRetController(IAVATPurInvoiceRetService _AVATPurInvoiceRetService, G_USERSController _Control,
                                           AVATPurInvoiceRetDetailService _AVATPurInvoiceRetDetailService,
                                           ServPurInvoiceDetailService _ServPurInvoiceDetailService)
        {
            this.AVATPurInvoiceRetService = _AVATPurInvoiceRetService;
            this.AVATPurInvoiceRetDetailService = _AVATPurInvoiceRetDetailService;
            this.ServPurInvoiceDetailService = _ServPurInvoiceDetailService;
            this.UserControl = _Control;
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAll(string UserCode, string Token,int compcode)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var res = AVATPurInvoiceRetService.GetAll().Where(x=>x.CompCode==compcode).ToList();

                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetById(int id, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var res = AVATPurInvoiceRetService.GetById(id);

                return Ok(new BaseResponse(res));
            }
            return BadRequest(ModelState);
        }


        [HttpPost, AllowAnonymous]
        public IHttpActionResult Insert([FromBody]AVAT_TR_PurInvoiceRet obj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(obj.Token, obj.UserCode))
                
                {
                try
                {
                    var res = AVATPurInvoiceRetService.Insert(obj);
                    return Ok(new BaseResponse(res));
                }
                catch (Exception ex)
                {
                    return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                }
            }
            return BadRequest(ModelState);
           
        }



        [HttpPost, AllowAnonymous]
        public IHttpActionResult InsertAllData([FromBody]PurInvoiceRetMasterDetails obj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(obj.AVAT_TR_PurInvoiceRet.Token, obj.AVAT_TR_PurInvoiceRet.UserCode))
            {
                using (var dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        //*****Insert Master
                        var result = AVATPurInvoiceRetService.Insert(obj.AVAT_TR_PurInvoiceRet);
                        //******Insert Details
                        for (int i = 0; i < obj.AVAT_TR_PurInvoiceRetDetail.Count; i++)
                        {
                            obj.AVAT_TR_PurInvoiceRetDetail[i].InvoiceRetID = result.InvoiceRetID;
                            obj.AVAT_TR_PurInvoiceRetDetail[i] = AVATPurInvoiceRetDetailService.Insert(obj.AVAT_TR_PurInvoiceRetDetail[i]);
                            //****فى حالة الاعتماد يتم تعديل الكمية المرتجعة فى فاتورة المشتريات
                            //*****update REturned Qunty in PurInvoiceHeader
                            if (obj.AVAT_TR_PurInvoiceRet.CLOSED == true)
                            {
                                var Invoiceheaderdet = ServPurInvoiceDetailService.GetById(Convert.ToInt32(obj.AVAT_TR_PurInvoiceRetDetail[i].InvoiceDetailID));
                                Invoiceheaderdet.QTY_RET = Invoiceheaderdet.QTY_RET + obj.AVAT_TR_PurInvoiceRetDetail[i].QTY_RET;
                                ServPurInvoiceDetailService.Update(Invoiceheaderdet);
                            }

                        }
                        obj.AVAT_TR_PurInvoiceRet = result;
                        ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(obj.AVAT_TR_PurInvoiceRet.CompCode), Convert.ToInt32(obj.AVAT_TR_PurInvoiceRet.BranchCode), Convert.ToInt32(result.InvoiceRetID), "servPurRet", "Add", db);
                        if (res.ResponseState == true)
                        {
                            obj.AVAT_TR_PurInvoiceRet.TR_NO =Convert.ToInt32(res.ResponseData);
                            dbTransaction.Commit();
                            LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.AVAT_TR_PurInvoiceRet.InvoiceRetID, obj.AVAT_TR_PurInvoiceRet.TR_NO.ToString(), LogUser.UserLog.Insert, obj.MODULE_CODE, true, null, null, null);

                            return Ok(new BaseResponse(obj));
                        }
                        else
                        {
                            dbTransaction.Rollback();
                            LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.AVAT_TR_PurInvoiceRet.InvoiceRetID, obj.AVAT_TR_PurInvoiceRet.TR_NO.ToString(), LogUser.UserLog.Insert, obj.MODULE_CODE, false, res.ResponseMessage.ToString(), null, null);

                            return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, res.ResponseMessage));
                        }
                    }
                    catch (Exception ex)
                    {
                        dbTransaction.Rollback();
                        LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.AVAT_TR_PurInvoiceRet.InvoiceRetID, obj.AVAT_TR_PurInvoiceRet.TR_NO.ToString(), LogUser.UserLog.Insert, obj.MODULE_CODE, false, ex.Message.ToString(), null, null);

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
                    AVATPurInvoiceRetService.Delete(ID);
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
        public IHttpActionResult Update([FromBody]AVAT_TR_PurInvoiceRet obj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(obj.Token, obj.UserCode))
            {
                try
                {
                    var res = AVATPurInvoiceRetService.Update(obj);
                    return Ok(new BaseResponse(res));
                }
                catch (Exception ex)
                {
                    return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                }
            }
            return BadRequest(ModelState);
        }



        [HttpPost, AllowAnonymous]
        public IHttpActionResult UpdateAllData([FromBody]PurInvoiceRetMasterDetails obj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(obj.AVAT_TR_PurInvoiceRet.Token, obj.AVAT_TR_PurInvoiceRet.UserCode))
            {
                using (var dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        //***Update Master
                        obj.AVAT_TR_PurInvoiceRet = AVATPurInvoiceRetService.Update(obj.AVAT_TR_PurInvoiceRet);
                        //****Update Details
                        for (int i = 0; i < obj.AVAT_TR_PurInvoiceRetDetail.Count; i++)
                        {
                            obj.AVAT_TR_PurInvoiceRetDetail[i] = AVATPurInvoiceRetDetailService.Update(obj.AVAT_TR_PurInvoiceRetDetail[i]);
                            //****فى حالة الاعتماد يتم تعديل الكمية المرتجعة فى فاتورة المشتريات
                            //*****update REturned Qunty in PurInvoiceHeader
                            if (obj.AVAT_TR_PurInvoiceRet.CLOSED == true)
                            {
                                var Invoiceheaderdet = ServPurInvoiceDetailService.GetById(Convert.ToInt32(obj.AVAT_TR_PurInvoiceRetDetail[i].InvoiceDetailID));
                                Invoiceheaderdet.QTY_RET = Invoiceheaderdet.QTY_RET+obj.AVAT_TR_PurInvoiceRetDetail[i].QTY_RET;
                                ServPurInvoiceDetailService.Update(Invoiceheaderdet);
                            }
                        }

                        //***process Trans
                        ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(obj.AVAT_TR_PurInvoiceRet.CompCode), Convert.ToInt32(obj.AVAT_TR_PurInvoiceRet.BranchCode), Convert.ToInt32(obj.AVAT_TR_PurInvoiceRet.InvoiceRetID), "servPurRet", "Update", db);
                        if (res.ResponseState == true)
                        {
                            dbTransaction.Commit();
                            LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.AVAT_TR_PurInvoiceRet.InvoiceRetID, obj.AVAT_TR_PurInvoiceRet.TR_NO.ToString(), LogUser.UserLog.Update, obj.MODULE_CODE, true, null, null, null);

                            return Ok(new BaseResponse(obj));
                        }
                        else
                        {
                            dbTransaction.Rollback();
                            LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.AVAT_TR_PurInvoiceRet.InvoiceRetID, obj.AVAT_TR_PurInvoiceRet.TR_NO.ToString(), LogUser.UserLog.Update, obj.MODULE_CODE, false, res.ResponseMessage.ToString(), null, null);

                            return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, res.ResponseMessage));
                        }
                    }
                    catch (Exception ex)
                    {
                        dbTransaction.Rollback();
                        LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.AVAT_TR_PurInvoiceRet.InvoiceRetID, obj.AVAT_TR_PurInvoiceRet.TR_NO.ToString(), LogUser.UserLog.Update, obj.MODULE_CODE, false, ex.Message.ToString(), null, null);

                        return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                    }
                }
            }
            return BadRequest(ModelState);
        }





        [HttpGet, AllowAnonymous]
        public IHttpActionResult Search(string UserCode, string Token, string strtdt, string Enddt,int compcode,int closed,string Tr_type,string vendor)
        {
            if (UserControl.CheckUser(Token, UserCode))
            {
                string s = " select * from AQVAT_GetPurReturn where  CompCode=" + compcode;

                string condition = "";

                if (closed != 2)//if 2 =all
                    condition = condition + " and CLOSED="+closed;
                if(Tr_type!="null")
                    condition = condition + " and TR_TYPE=" + Tr_type;
                if (vendor != "null")
                    condition = condition + " and VendorID=" + vendor;
                if (strtdt != "" && strtdt != null)
                    condition = condition + " and TR_DATE>='" + strtdt + "'";
                if (Enddt != "" && Enddt != null)
                    condition = condition + " and TR_DATE<='" + Enddt + "'";


                string query = s + condition;
                var res = db.Database.SqlQuery<AQVAT_GetPurReturn>(query).ToList();

                return Ok(new BaseResponse(res));
            }
            return Ok(new BaseResponse());
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetPurInvoiceRetDetails(int InvoiceRetID, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                AVAT_TR_PurInvoiceRet res_1 = db.AVAT_TR_PurInvoiceRet.Where(x => x.InvoiceRetID == InvoiceRetID).FirstOrDefault();
                List<AQVAT_GetPurReturnDetail> res_2 = db.AQVAT_GetPurReturnDetail.Where(x => x.InvoiceRetID == InvoiceRetID).ToList();
                AQPurInvoiceRetMasterDetails Model = new AQPurInvoiceRetMasterDetails
                {
                    AVAT_TR_PurInvoiceRet = res_1,
                    AQVAT_GetPurReturnDetail = res_2,
                };
                return Ok(new BaseResponse(Model));
            }
            return BadRequest(ModelState);
        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult OpenPurInvRet([FromBody]AVAT_TR_PurInvoiceRet obj)
        {
            if (ModelState.IsValid && UserControl.CheckUser(obj.Token, obj.UserCode))
            {
                using (var dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        //update Master
                        var master = AVATPurInvoiceRetService.Update(obj);
                        ////****Get Details
                        //var det = AVATPurInvoiceRetDetailService.GetAll().Where(x => x.InvoiceRetID == obj.InvoiceRetID).ToList();
                        //for (int i = 0; i < det.Count; i++)
                        //{
                        //    //    //****فى حالة فك الاعتماد يتم تعديل الكمية المرتجعة فى فاتورة المشتريات
                        //    //    //*****update Returned Qunty in PurInvoiceHeader
                        //    //var Invoiceheaderdet = ServPurInvoiceDetailService.GetById(Convert.ToInt32(det[i].InvoiceDetailID));
                        //    //////Invoiceheaderdet.QTY_RET = Invoiceheaderdet.QTY_RET - det[i].QTY_RET;
                        //    //ServPurInvoiceDetailService.Update(Invoiceheaderdet);
                        //    ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(obj.CompCode), Convert.ToInt32(obj.BranchCode), Convert.ToInt32(det[i].InvoiceRetDetailid), "SPurRetDet", "Open", db);

                        //}
                        //*****
                        ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(master.CompCode), Convert.ToInt32(master.BranchCode), Convert.ToInt32(master.InvoiceRetID), "servPurRet", "Open", db);
                        if (res.ResponseState == true)
                        {
                            var PurReturnData = db.AQVAT_GetPurReturn.Where(x => x.InvoiceRetID == master.InvoiceRetID).FirstOrDefault();
                            dbTransaction.Commit();
                            LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.InvoiceRetID, obj.TR_NO.ToString(), LogUser.UserLog.Open, obj.MODULE_CODE, true, null, null, null);
                            return Ok(new BaseResponse(PurReturnData));
                        }
                        else
                        {
                            dbTransaction.Rollback();
                            LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.InvoiceRetID, obj.TR_NO.ToString(), LogUser.UserLog.Open, obj.MODULE_CODE, false, res.ResponseMessage.ToString(), null, null);
                            return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, res.ResponseMessage));
                        }
                    }
                    catch (Exception ex)
                    {
                        dbTransaction.Rollback();
                        LogUser.InsertPrint(db, obj.Comp_Code.ToString(), obj.Branch_Code, obj.sec_FinYear, obj.UserCode, obj.InvoiceRetID,obj.TR_NO.ToString(), LogUser.UserLog.Open, obj.MODULE_CODE, false, ex.Message.ToString(), null, null);
                        return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                    }
                }
            }
            return BadRequest(ModelState);
        }

    }





}