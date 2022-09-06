using Inv.API.Models;
using Inv.API.Models.CustomModel;
using Inv.API.Tools;
using Inv.BLL.Services.ItemDef;
using Inv.BLL.Services.ItemDefYear;
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
    public class StkDefItemsController : BaseController
    {
        private readonly IItemDefService IItemDefService;
        private readonly G_USERSController UserControl;
        private readonly ItemDefYearService ItemDefYearService;

        public StkDefItemsController(IItemDefService _IItemDefService, G_USERSController _Control, ItemDefYearService _ItemDefYearService)
        {
            this.IItemDefService = _IItemDefService;
            this.UserControl = _Control;
            this.ItemDefYearService = _ItemDefYearService;
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAll(int CompCode, int FinYear, int ItemFamilyID, int catID, int storeCode, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {

                var ItemStoreInfoList = new List<IQ_GetItemStoreInfo>();
                if (ItemFamilyID == 0)
                {
                    ItemStoreInfoList = IItemDefService.GetAll(x => x.CompCode == CompCode && x.CatID == catID && x.StoreId == storeCode && x.FinYear == FinYear).ToList();
                }
                else
                {
                    ItemStoreInfoList = IItemDefService.GetAll(x => x.CompCode == CompCode && x.ItemFamilyID == ItemFamilyID && x.CatID == catID && x.StoreId == storeCode && x.FinYear == FinYear).ToList();
                }


                return Ok(new BaseResponse(ItemStoreInfoList));

            }
            return BadRequest(ModelState);
        }


        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAll(int CompCode, int FinYear, int storeCode, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                 
                var query = "select * from IQ_GetItemStoreInfo where  CompCode = " + CompCode + " and StoreId = " + storeCode + " and  FinYear = " + FinYear + " ORDER BY ItemCode ";
                var ItemStoreInfoList = db.Database.SqlQuery<IQ_GetItemStoreInfo>(query).ToList();
                 
                return Ok(new BaseResponse(ItemStoreInfoList));

            }
            return BadRequest(ModelState);
        }


        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllI_Item(int CompCode, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                 
                var res = db.I_Item.Where(x => x.CompCode == CompCode).ToList();
                return Ok(new BaseResponse(res));

            }
            return BadRequest(ModelState);
        }



        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAll_StocK(int CompCode,int BraCode, int FinYear, int ItemFamilyID, int storeCode, string StocK, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {


                if (StocK == "All")
                {
                    var ItemStoreInfoList = IItemDefService.GetAll(x => x.CompCode == CompCode && x.FinYear == FinYear && x.BraCode == BraCode && x.ItemFamilyID == ItemFamilyID && x.StoreId == storeCode).ToList();
                    return Ok(new BaseResponse(ItemStoreInfoList));
                }
                if (StocK == ">")
                {
                    var ItemStoreInfoList = IItemDefService.GetAll(x => x.CompCode == CompCode && x.FinYear == FinYear && x.BraCode == BraCode && x.ItemFamilyID == ItemFamilyID && x.StoreId == storeCode && x.OnhandQty > 0).ToList();
                    return Ok(new BaseResponse(ItemStoreInfoList));
                }
                if (StocK == "=")
                {

                    var ItemStoreInfoList = IItemDefService.GetAll(x => x.CompCode == CompCode && x.FinYear == FinYear && x.BraCode == BraCode && x.ItemFamilyID == ItemFamilyID && x.StoreId == storeCode && x.OnhandQty == 0).ToList();
                    return Ok(new BaseResponse(ItemStoreInfoList));
                }
                if (StocK == "<")
                {
                    var ItemStoreInfoList = IItemDefService.GetAll(x => x.CompCode == CompCode && x.FinYear == FinYear && x.BraCode == BraCode && x.ItemFamilyID == ItemFamilyID && x.StoreId == storeCode && x.OnhandQty < 0).ToList();
                    return Ok(new BaseResponse(ItemStoreInfoList));

                }


            }
            return BadRequest(ModelState);
        }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllItem(int CompCode, int BraCode, int FinYear, int? catid, int? itemFamilyid, int? Storeid, string StocK, string UserCode, string Token)
        {
            try
            {

                if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
                {
                    string cond = " CompCode= " + CompCode + "and BraCode ="+ BraCode+" and FinYear =" + FinYear;
                    if (catid != null)
                        cond = cond + " and CatID = " + catid;
                    if (itemFamilyid != 0)
                        cond = cond + " and ItemFamilyID = " + itemFamilyid;
                    if (Storeid != null)
                        cond = cond + " and Storeid = " + Storeid;
                    if (StocK != "All")
                    {
                        cond = cond + " and OnhandQty " + StocK + "0";
                    }


                    string SQL = "Select *  from IQ_GetItemStoreInfo    where " + cond;
                    var ItemList = db.Database.SqlQuery<IQ_GetItemStoreInfo>(SQL).ToList();

                    return Ok(new BaseResponse(ItemList));
                }
                return BadRequest(ModelState);
            }
            catch (Exception ex)
            {

                return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
            }
        }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllItem(int CompCode, int BraCode, int FinYear,string UserCode, string Token)
        { 
                if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
                { 
                    string SQL = "Select *  from IQ_GetItemStoreInfo where CompCode= " + CompCode + "and BraCode =" + BraCode + " and FinYear =" + FinYear;
                    var ItemList = db.Database.SqlQuery<IQ_GetItemStoreInfo>(SQL).ToList();

                    return Ok(new BaseResponse(ItemList));
                }
                return BadRequest(ModelState); 
        }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllItem(int CompCode, int FinYear, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var ItemStoreInfoList = IItemDefService.GetAll(x => x.CompCode == CompCode && x.FinYear == FinYear&&x.OnhandQty>0).ToList();

                return Ok(new BaseResponse(ItemStoreInfoList));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllItemPur(int CompCode, int FinYear, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var ItemStoreInfoList = IItemDefService.GetAll(x => x.CompCode == CompCode && x.FinYear == FinYear).ToList();

                return Ok(new BaseResponse(ItemStoreInfoList));
            }
            return BadRequest(ModelState);
        }

        public IHttpActionResult GetAllItemWithoutOnhandQty(int CompCode, int FinYear, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {

                var ItemStoreInfoList = IItemDefService.GetAll(x => x.CompCode == CompCode && x.FinYear == FinYear ).ToList();
                 

                return Ok(new BaseResponse(ItemStoreInfoList));
            }
            return BadRequest(ModelState);
        }
        public IHttpActionResult GetAllFromItems(int CompCode,  string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var ItemStoreInfoList = IItemDefService.GetAllFromItems(s => s.CompCode == CompCode).ToList();

                return Ok(new BaseResponse(ItemStoreInfoList));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetByIdFromIItem(int id, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                var ItemStoreInfo = IItemDefService.GetByIdFromIItem(id);

                return Ok(new BaseResponse(ItemStoreInfo));
            }
            return BadRequest(ModelState);
        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult Updatelist(I_Item_YearMasterDetails itemDefList)
        {
             
            //if (ModelState.IsValid && UserControl.CheckUser(itemDefList.Token, itemDefList.UserCode))
            //{
                using (var dbTransaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        Boolean AllSuccess = true;
                        Boolean Delet_Item = true;
                        ResponseResult res = new ResponseResult();

                        int i = 0;
                        int br = 1;

                        foreach (var item in itemDefList.I_Item)
                        {
                            if (item.StatusFlag == 'i')
                        { 
                                var InsertedRec = IItemDefService.Insert(item);
                                itemDefList.I_ItemYear[i].ItemID = InsertedRec.ItemID;
                                var yearrec = ItemDefYearService.Insert(itemDefList.I_ItemYear[i]);
                            
                            res = Shared.TransactionProcess(Convert.ToInt32(InsertedRec.CompCode), br, InsertedRec.ItemID, "ItemDef", "Add", db);
                                if (res.ResponseState == false)
                                {
                                    AllSuccess = false;
                                    break;
                                }
                            if (itemDefList.I_ItemYear[i].IsLocalSalePrice == false)
                            {
                                db.Database.ExecuteSqlCommand(" update I_ItemStore set UnitPrice =0 , MinUnitPrice=0 where CompCode = "+ itemDefList.I_Item[i].CompCode+ " and ItemID = " + itemDefList.I_Item[i].ItemID + "");
                            }
                            else
                            { 
                                itemDefList.I_ItemYear[i].UnitPrice = 0;
                                itemDefList.I_ItemYear[i].MinUnitPrice = 0;
                                yearrec= ItemDefYearService.Update(itemDefList.I_ItemYear[i]);
                            }

                        }
                        else if (item.StatusFlag == 'u')
                            {
                                var UpdateedRec = IItemDefService.Update(item);
                            var yearrec = new I_ItemYear();
                            //itemDefList.I_ItemYear[i].ItemID = UpdateedRec.ItemID;   
                            if (itemDefList.I_ItemYear[i].IsLocalSalePrice == false)
                            {
                                 yearrec = ItemDefYearService.Update(itemDefList.I_ItemYear[i]);
                                db.Database.ExecuteSqlCommand(" update I_ItemStore set UnitPrice =0 , MinUnitPrice=0  where CompCode = " + itemDefList.I_Item[i].CompCode + " and ItemID = " + itemDefList.I_Item[i].ItemID + "");
                            }
                            else
                            {
                                db.Database.ExecuteSqlCommand(" update I_ItemStore set UnitPrice ="+ itemDefList.I_ItemYear[i].UnitPrice + " , MinUnitPrice="+ itemDefList.I_ItemYear[i].MinUnitPrice + "");
                                itemDefList.I_ItemYear[i].UnitPrice = 0;
                                itemDefList.I_ItemYear[i].MinUnitPrice = 0;
                                 yearrec = ItemDefYearService.Update(itemDefList.I_ItemYear[i]);
                            }  
                            res = Shared.TransactionProcess(Convert.ToInt32(UpdateedRec.CompCode), br, UpdateedRec.ItemID, "ItemDef", "Update", db);
                                if (res.ResponseState == false)
                                {
                                    AllSuccess = false;
                                    break;
                                } 
                            }
                            else if (item.StatusFlag == 'd')
                            { 
                                string s = "exec Iproc_Deleteitem " + item.ItemID + "," + 0 +"";
                                string query = s;
                                 int output = db.Database.ExecuteSqlCommand(query);
                            
                            if (output == 0)
                                {
                                    Delet_Item = false;
                                    break;
                                }

                            }
                            i++;
                        }





                        // if all success commit 
                        if (!Delet_Item)
                        {
                            dbTransaction.Commit();
                            // Return in case if the db generate transaction number   res.ResponseData
                            return Ok(new BaseResponse(0));
                        }
                        if (AllSuccess)
                        {
                            dbTransaction.Commit();
                            // Return in case if the db generate transaction number   res.ResponseData
                            return Ok(new BaseResponse(100));
                        }
                        else
                        {
                            dbTransaction.Rollback();
                            return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, res.ResponseMessage));
                        }


                    }
                    catch (Exception ex)
                    {
                        dbTransaction.Rollback();
                        return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                    }


                }


            //}
            //return BadRequest(ModelState);




        }


    }
}
