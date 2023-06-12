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
using System.Web.Http;


namespace Inv.API.Controllers
{
    public class StkDefItemsController : BaseController
    {
        private readonly IItemDefService IItemDefService;
        private readonly G_USERSController UserControl;
        private readonly ItemDefYearService ItemDefYearService;

        public StkDefItemsController(IItemDefService _IItemDefService, G_USERSController _Control, ItemDefYearService _ItemDefYearService)
        {
            IItemDefService = _IItemDefService;
            UserControl = _Control;
            ItemDefYearService = _ItemDefYearService;
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAll(int CompCode, int FinYear, int ItemFamilyID, int catID, int storeCode, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {

                List<IQ_GetItemStoreInfo> ItemStoreInfoList = new List<IQ_GetItemStoreInfo>();
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

                string query = "select * from IQ_GetItemStoreInfo where  CompCode = " + CompCode + " and StoreId = " + storeCode + " and  FinYear = " + FinYear + " ORDER BY ItemCode ";
                List<IQ_GetItemStoreInfo> ItemStoreInfoList = db.Database.SqlQuery<IQ_GetItemStoreInfo>(query).ToList();

                return Ok(new BaseResponse(ItemStoreInfoList));

            }
            return BadRequest(ModelState);
        }


        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllI_Item(int CompCode, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {

                List<I_Item> res = db.I_Item.Where(x => x.CompCode == CompCode).ToList();
                return Ok(new BaseResponse(res));

            }
            return BadRequest(ModelState);
        }



        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAll_StocK(int CompCode, int BraCode, int FinYear, int ItemFamilyID, int storeCode, string StocK, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {


                if (StocK == "All")
                {
                    List<IQ_GetItemStoreInfo> ItemStoreInfoList = IItemDefService.GetAll(x => x.CompCode == CompCode && x.FinYear == FinYear && x.BraCode == BraCode && x.ItemFamilyID == ItemFamilyID && x.StoreId == storeCode).ToList();
                    return Ok(new BaseResponse(ItemStoreInfoList));
                }
                if (StocK == ">")
                {
                    List<IQ_GetItemStoreInfo> ItemStoreInfoList = IItemDefService.GetAll(x => x.CompCode == CompCode && x.FinYear == FinYear && x.BraCode == BraCode && x.ItemFamilyID == ItemFamilyID && x.StoreId == storeCode && x.OnhandQty > 0).ToList();
                    return Ok(new BaseResponse(ItemStoreInfoList));
                }
                if (StocK == "=")
                {

                    List<IQ_GetItemStoreInfo> ItemStoreInfoList = IItemDefService.GetAll(x => x.CompCode == CompCode && x.FinYear == FinYear && x.BraCode == BraCode && x.ItemFamilyID == ItemFamilyID && x.StoreId == storeCode && x.OnhandQty == 0).ToList();
                    return Ok(new BaseResponse(ItemStoreInfoList));
                }
                if (StocK == "<")
                {
                    List<IQ_GetItemStoreInfo> ItemStoreInfoList = IItemDefService.GetAll(x => x.CompCode == CompCode && x.FinYear == FinYear && x.BraCode == BraCode && x.ItemFamilyID == ItemFamilyID && x.StoreId == storeCode && x.OnhandQty < 0).ToList();
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
                    string cond = " CompCode= " + CompCode + "and BraCode =" + BraCode + " and FinYear =" + FinYear;
                    if (catid != null)
                    {
                        cond = cond + " and CatID = " + catid;
                    }

                    if (itemFamilyid != 0)
                    {
                        cond = cond + " and ItemFamilyID = " + itemFamilyid;
                    }

                    if (Storeid != null)
                    {
                        cond = cond + " and Storeid = " + Storeid;
                    }

                    if (StocK != "All")
                    {
                        cond = cond + " and OnhandQty " + StocK + "0";
                    }


                    string SQL = "Select *  from IQ_GetItemStoreInfo    where " + cond;
                    List<IQ_GetItemStoreInfo> ItemList = db.Database.SqlQuery<IQ_GetItemStoreInfo>(SQL).ToList();

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
        public IHttpActionResult GetAllItem(int CompCode, int BraCode, int FinYear, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                string SQL = "Select *  from IQ_GetItemStoreInfo where CompCode= " + CompCode + "and BraCode =" + BraCode + " and FinYear =" + FinYear;
                List<IQ_GetItemStoreInfo> ItemList = db.Database.SqlQuery<IQ_GetItemStoreInfo>(SQL).ToList();

                return Ok(new BaseResponse(ItemList));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetItem(int CompCode, int BraCode, int FinYear, int ItemID, int StoreId, bool Show, string UserCode, string Token)
        { //CompCode: compcode, BraCode: BranchCode, FinYear: Finyear, ItemID: ItemID , StoreId: StoreId, Show: Show, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                string SQL = "";
                if (Show)
                {
                    SQL = "Select *  from IQ_GetItemStoreInfo where CompCode= " + CompCode + "and BraCode =" + BraCode + " and FinYear =" + FinYear + " and  ItemID =" + ItemID + " and  StoreId =" + StoreId + "";
                }
                else
                {
                    SQL = "Select *  from IQ_GetItemStoreInfo where CompCode= " + CompCode + "and BraCode =" + BraCode + " and FinYear =" + FinYear + " and  ItemID =" + ItemID + " and  StoreId =" + StoreId + " and IsActive =1 and ISSales = 1 ";
                }

                List<IQ_GetItemStoreInfo> ItemList = db.Database.SqlQuery<IQ_GetItemStoreInfo>(SQL).ToList();

                return Ok(new BaseResponse(ItemList));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetItem(int CompCode, int BraCode, int FinYear, string ItemCode, int StoreId, bool Show, string UserCode, string Token)
        { //CompCode: compcode, BraCode: BranchCode, FinYear: Finyear, ItemID: ItemID , StoreId: StoreId, Show: Show, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token

            string SQL = "";
            if (Show)
            {
                SQL = "Select *  from IQ_GetItemStoreInfo where CompCode= " + CompCode + "and BraCode =" + BraCode + " and FinYear =" + FinYear + " and  ItemCode ='" + ItemCode + "' and  StoreId =" + StoreId + "";
            }
            else
            {
                SQL = "Select *  from IQ_GetItemStoreInfo where CompCode= " + CompCode + "and BraCode =" + BraCode + " and FinYear =" + FinYear + " and  ItemCode ='" + ItemCode + "' and  StoreId =" + StoreId + " and IsActive =1 and ISSales = 1 ";
            }

            List<IQ_GetItemStoreInfo> ItemList = db.Database.SqlQuery<IQ_GetItemStoreInfo>(SQL).ToList();

            return Ok(new BaseResponse(ItemList));

        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllItem(int CompCode, int FinYear, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                List<IQ_GetItemStoreInfo> ItemStoreInfoList = IItemDefService.GetAll(x => x.CompCode == CompCode && x.FinYear == FinYear && x.OnhandQty > 0).ToList();

                return Ok(new BaseResponse(ItemStoreInfoList));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllItemPur(int CompCode, int FinYear, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                List<IQ_GetItemStoreInfo> ItemStoreInfoList = IItemDefService.GetAll(x => x.CompCode == CompCode && x.FinYear == FinYear).ToList();

                return Ok(new BaseResponse(ItemStoreInfoList));
            }
            return BadRequest(ModelState);
        }

        public IHttpActionResult GetAllItemWithoutOnhandQty(int CompCode, int FinYear, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {

                List<IQ_GetItemStoreInfo> ItemStoreInfoList = IItemDefService.GetAll(x => x.CompCode == CompCode && x.FinYear == FinYear).ToList();


                return Ok(new BaseResponse(ItemStoreInfoList));
            }
            return BadRequest(ModelState);
        }
        public IHttpActionResult GetAllFromItems(int CompCode, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                List<I_Item> ItemStoreInfoList = IItemDefService.GetAllFromItems(s => s.CompCode == CompCode).ToList();

                return Ok(new BaseResponse(ItemStoreInfoList));
            }
            return BadRequest(ModelState);
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetByIdFromIItem(int id, string UserCode, string Token)
        {
            if (ModelState.IsValid && UserControl.CheckUser(Token, UserCode))
            {
                I_Item ItemStoreInfo = IItemDefService.GetByIdFromIItem(id);

                return Ok(new BaseResponse(ItemStoreInfo));
            }
            return BadRequest(ModelState);
        }

        [HttpPost, AllowAnonymous]
        public IHttpActionResult Updatelist(I_Item_YearMasterDetails itemDefList)
        {

            //if (ModelState.IsValid && UserControl.CheckUser(itemDefList.Token, itemDefList.UserCode))
            //{
            using (System.Data.Entity.DbContextTransaction dbTransaction = db.Database.BeginTransaction())
            {
                try
                {
                    bool AllSuccess = true;
                    bool Delet_Item = true;
                    ResponseResult res = new ResponseResult();

                    int i = 0;
                    int br = 1;

                    foreach (I_Item item in itemDefList.I_Item)
                    {
                        if (item.StatusFlag == 'i')
                        {
                            I_Item InsertedRec = IItemDefService.Insert(item);
                            itemDefList.I_ItemYear[i].ItemID = InsertedRec.ItemID;
                            I_ItemYear yearrec = ItemDefYearService.Insert(itemDefList.I_ItemYear[i]);

                            res = Shared.TransactionProcess(Convert.ToInt32(InsertedRec.CompCode), br, InsertedRec.ItemID, "ItemDef", "Add", db);
                            if (res.ResponseState == false)
                            {
                                AllSuccess = false;
                                break;
                            }
                            if (itemDefList.I_ItemYear[i].IsLocalSalePrice == false)
                            {
                                db.Database.ExecuteSqlCommand(" update I_ItemStore set UnitPrice =0 , MinUnitPrice=0 where CompCode = " + itemDefList.I_Item[i].CompCode + " and ItemID = " + itemDefList.I_Item[i].ItemID + "");
                            }
                            else
                            {
                                itemDefList.I_ItemYear[i].UnitPrice = 0;
                                itemDefList.I_ItemYear[i].MinUnitPrice = 0;
                                yearrec = ItemDefYearService.Update(itemDefList.I_ItemYear[i]);
                            }
                            
                        }
                        else if (item.StatusFlag == 'u')
                        {
                            I_Item UpdateedRec = IItemDefService.Update(item);
                            I_ItemYear yearrec = new I_ItemYear();
                            //itemDefList.I_ItemYear[i].ItemID = UpdateedRec.ItemID;   
                            if (itemDefList.I_ItemYear[i].IsLocalSalePrice == false)
                            {
                                yearrec = ItemDefYearService.Update(itemDefList.I_ItemYear[i]);
                                db.Database.ExecuteSqlCommand(" update I_ItemStore set UnitPrice =0 , MinUnitPrice=0  where CompCode = " + itemDefList.I_Item[i].CompCode + " and ItemID = " + itemDefList.I_Item[i].ItemID + "");
                            }
                            else
                            {
                                db.Database.ExecuteSqlCommand(" update I_ItemStore set UnitPrice =" + itemDefList.I_ItemYear[i].UnitPrice + " , MinUnitPrice=" + itemDefList.I_ItemYear[i].MinUnitPrice + "");
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
                            string s = "exec Iproc_Deleteitem " + item.ItemID + "," + 0 + "";
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
                    LogUser.InsertPrint(db, itemDefList.Comp_Code.ToString(), itemDefList.Branch_Code, itemDefList.sec_FinYear, itemDefList.UserCode, null,null, LogUser.UserLog.Update, itemDefList.MODULE_CODE, false, ex.Message.ToString(), null, null);

                    return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                }


            }


            //}
            //return BadRequest(ModelState);




        }


        [HttpGet, AllowAnonymous]
        public IHttpActionResult chackItem(int CompCode, string ItemCode, string ItemDescA, int ItemID, bool IsCode)
        {

            string SQL = "";
            if (ItemID == 0)
            {
                if (IsCode)
                {
                    SQL = "select * from [dbo].[I_Item]   where [ItemCode] = '" + ItemCode + "' and CompCode = " + CompCode + " ";
                }
                else
                {
                    SQL = "select * from [dbo].[I_Item]   where [DescA] = '" + ItemDescA + "' and CompCode = " + CompCode + " ";
                }
            }
            else
            {
                if (IsCode)
                {
                    SQL = "select * from [dbo].[I_Item]   where [ItemCode] = '" + ItemCode + "' and CompCode = " + CompCode + " and ItemID <> " + ItemID + "";
                }
                else
                {
                    SQL = "select * from [dbo].[I_Item]   where [DescA] = '" + ItemDescA + "' and CompCode = " + CompCode + " and ItemID <> " + ItemID + "";
                }
            }

            List<I_Item> ItemList = db.Database.SqlQuery<I_Item>(SQL).ToList();

            return Ok(new BaseResponse(ItemList.Count));

        }


        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetItemsControl(string FildItemID, string FildItemCode, string FildItm_Desc, string qury)
        {

            string SQL = "select " + FildItemID + " as ItemID, " + FildItemCode + " as ItemCode , " + FildItm_Desc + " as ItemDesc from " + qury + "";

            List<Custom_Items> ItemList = db.Database.SqlQuery<Custom_Items>(SQL).ToList();

            return Ok(new BaseResponse(ItemList));

        }



    }
}
