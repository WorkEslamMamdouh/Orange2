//$(document).ready(() => {
//    //////debugger;
//    ProcSalesInvoice.InitalizeComponent();
//})
//namespace ProcSalesInvoice {
//    var TrType = 1;
//    var SysSession: SystemSession = GetSystemSession();
//    var compcode: Number;
//    var sys: SystemTools = new SystemTools();
//    //Arrays    
//    var salesmanDetails: Array<I_Sls_D_Salesman> = new Array<I_Sls_D_Salesman>();
//    var CashDetailsAr: Array<string> = new Array<string>();
//    var CashDetailsEn: Array<string> = new Array<string>();
//    var StateDetailsAr: Array<string> = new Array<string>();
//    var StateDetailsEn: Array<string> = new Array<string>();
//    var operationDetails: Array<I_TR_Operation> = new Array<I_TR_Operation>();
//    var VendorDetails: Array<A_Rec_D_Customer> = new Array<A_Rec_D_Customer>();
//    var SearchGetPurReceiveStaisticData: Array<IQ_GetPurReceiveStaistic> = new Array<IQ_GetPurReceiveStaistic>();
//    var List_MinUnitPrice: Array<I_Sls_TR_InvoiceItems> = new Array<I_Sls_TR_InvoiceItems>();
//    //Models
//    var AD_VatTypeDetails: A_D_VAT_TYPE = new A_D_VAT_TYPE();
//    var SlsInvoiceItemsDetails: Array<IQ_GetPurReceiveItem> = new Array<IQ_GetPurReceiveItem>();
//    var MasterDetailModel: SlsInvoiceMasterDetails = new SlsInvoiceMasterDetails();
//    //Model
//    var InvoiceStatisticsModel: Array<IQ_GetPurReceiveStaistic> = new Array<IQ_GetPurReceiveStaistic>();
//    var InvoiceModel: I_Sls_TR_Invoice = new I_Sls_TR_Invoice();
//    var invoiceItemsModel: Array<I_Sls_TR_InvoiceItems> = new Array<I_Sls_TR_InvoiceItems>();
//    var invoiceItemSingleModel: I_Sls_TR_InvoiceItems = new I_Sls_TR_InvoiceItems();
//    var PurReceiveStaistic: IQ_GetPurReceiveStaistic = new IQ_GetPurReceiveStaistic();
//    var VatDetails: Array<A_D_VAT_TYPE> = new Array<A_D_VAT_TYPE>();
//    var cashboxDetails: Array<A_RecPay_D_CashBox> = new Array<A_RecPay_D_CashBox>();
//    var FamilyDetails: Array<IQ_GetOperationItemInfo_New> = new Array<IQ_GetOperationItemInfo_New>();
//    var ItemDetails: Array<IQ_GetOperationItemInfo_New> = new Array<IQ_GetOperationItemInfo_New>();
//    //DropDownlist
//    var ddlOPerationMaster: HTMLSelectElement;
//    var ddlCustomerMaster: HTMLSelectElement;
//    var ddlVendorDetails: HTMLSelectElement;
//    var ddlSalesmanMaster: HTMLSelectElement;
//    var ddlCashTypeMaster: HTMLSelectElement;
//    var ddlVendorMaster: HTMLSelectElement;
//    var ddlFreeSalesman: HTMLSelectElement;
//    var ddlReturnTypeShow: HTMLSelectElement;
//    // giedView
//    var divMasterGrid: JsGrid = new JsGrid();
//    //Textboxes
//    var txtDate: HTMLInputElement;
//    var txtCustomerNameMaster: HTMLInputElement;
//    var  txtCustomerMobileMaster :HTMLInputElement;
//    var searchbutmemreport: HTMLInputElement;
//    var ddlReturnType: HTMLSelectElement;
//    var ddlTaxTypeHeader: HTMLSelectElement;
//    var btnShow: HTMLButtonElement;
//    var chkActive: HTMLInputElement;
//    var txtItemCount: HTMLInputElement;
//    var txtPackageCount: HTMLInputElement;
//    var txtTotal: HTMLInputElement;
//    var txtTax: HTMLInputElement;
//    var txtNet: HTMLInputElement;
//    var txtCommission: HTMLInputElement;
//    var txt_ApprovePass: HTMLInputElement;
//    //labels
//    var lblOperationStatusMaster: HTMLLabelElement;
//    //Array
//    var AddReturnDetailsAr: Array<string> = new Array<string>();
//    var AddReturnDetailsEn: Array<string> = new Array<string>();
//    //checkbox
//    var chkOpenProcess: HTMLInputElement;
//    var chkAddFreeReturn: HTMLInputElement;
//    //buttons 
//    var btnShow: HTMLButtonElement;
//    var btnAddDetails: HTMLButtonElement;
//    var btnEdit: HTMLButtonElement;
//    var btnAdd: HTMLButtonElement;
//    var btnRecieveSearch: HTMLButtonElement;
//    var chkAddFreeReturn: HTMLInputElement;
//    var btnPrntPrice: HTMLButtonElement;
//    var btnPrint: HTMLButtonElement;
//    var btnSave: HTMLButtonElement;
//    var btnBack: HTMLButtonElement;
//    //flags
//    var Show: boolean = true;
//    var EditFlag: boolean = false;
//    var InvoiceFlag: boolean = false;
//    var TypeFlag: boolean = false;
//    //global
//    var vatType: number;
//    var CountGrid = 0;
//    var CountItems: number = 0;
//    var PackageCount: number = 0;
//    var CountTotal: number = 0;
//    var TaxCount: number = 0;
//    var NetCount: number = 0;
//    var VatPrc;
//    var Validation_Insert = 0;
//    var receiveID: number = 0;
//    var ShowFlag;
//    var PurRecType = 0;
//    var isCash;
//    var RefTrID;
//    var flag_Insert = 0;
//    var StoreID;
//    // print button
//    var btnPrintTrview: HTMLButtonElement;
//    var btnPrintTrPDF: HTMLButtonElement;
//    var btnPrintTrEXEL: HTMLButtonElement;
//    var btnPrint: HTMLButtonElement;
//    var btnPrintTransaction: HTMLButtonElement;
//    export function InitalizeComponent() {
//        if (SysSession.CurrentEnvironment.ScreenLanguage = "ar") { document.getElementById('Screen_name').innerHTML = " فاتورة العمليات"; }
//        else { document.getElementById('Screen_name').innerHTML = "Opreration Invoice"; }
//        compcode = Number(SysSession.CurrentEnvironment.CompCode);
//         vatType = SysSession.CurrentEnvironment.I_Control[0].DefSlsVatType; //From Session
//        InitalizeControls();
//        IntializeEvents();
//        FillddlSalesmanMaster();
//        FillddlCashTypeMaster();
//        //FillddlFamily();
//        $('#ddlCashTypeMaster').prop("value", "1");
//        txtDate.value = GetDate();
//        chkOpenProcess.checked = true;
//        fillddlCustomerMaster();
//        GetVatPercentage();
//    }
//    function IntializeEvents() {
//        ddlSalesmanMaster.onchange = ddlSalesmanMaster_onchange;
//        chkOpenProcess.onclick = ddlSalesmanMaster_onchange;
//        ddlOPerationMaster.onchange = ddlOPerationMaster_onchange;
//        ddlCashTypeMaster.onchange = ddlCashTypeMaster_onchange;
//        ddlCustomerMaster.onchange = ddlCustomerMaster_onchange;
//        btnAdd.onclick = btnAdd_onclick;
//        btnAddDetails.onclick = AddNewRow;
//        //btn_Approveprice.onclick = btn_Approveprice_onclick;
//        //btn_Exit_Approveprice.onclick = btn_Exit_Approveprice_onclick;
//    }
//    function InitalizeControls() {
//        //labels
//        lblOperationStatusMaster = document.getElementById("lblOperationStatusMaster") as HTMLLabelElement;
//        ddlSalesmanMaster = document.getElementById("ddlSalesmanMaster") as HTMLSelectElement;
//        ddlCashTypeMaster = document.getElementById("ddlCashTypeMaster") as HTMLSelectElement;
//        ddlOPerationMaster = document.getElementById("ddlOPerationMaster") as HTMLSelectElement;
//        ddlCustomerMaster = document.getElementById("ddlCustomerMaster") as HTMLSelectElement;
//        txtDate = document.getElementById("txtDate") as HTMLInputElement;
//        txtCustomerNameMaster = document.getElementById("txtCustomerNameMaster") as HTMLInputElement;
//        txtCustomerMobileMaster = document.getElementById("txtCustomerMobileMaster") as HTMLInputElement;
//        txtItemCount = document.getElementById("txtItemCount") as HTMLInputElement;
//        txtPackageCount = document.getElementById("txtPackageCount") as HTMLInputElement;
//        txtTotal = document.getElementById("txtTotal") as HTMLInputElement;
//        txtTax = document.getElementById("txtTax") as HTMLInputElement;
//        txtNet = document.getElementById("txtNet") as HTMLInputElement;
//        txtCommission = document.getElementById("txtCommission") as HTMLInputElement;
//        txt_ApprovePass = document.getElementById("txt_ApprovePass") as HTMLInputElement;
//        chkOpenProcess = document.getElementById("chkOpenProcess") as HTMLInputElement;
//        btnAdd = document.getElementById("btnAdd") as HTMLButtonElement;
//        btnAddDetails = document.getElementById("btnAddDetails") as HTMLButtonElement;
//        btnSave = document.getElementById("btnSave") as HTMLButtonElement;
//        btnBack = document.getElementById("btnBack") as HTMLButtonElement;
//        btnPrint = document.getElementById("btnPrint") as HTMLButtonElement;
//        btnPrntPrice = document.getElementById("btnPrntPrice") as HTMLButtonElement;
//    }
//    function FillddlSalesmanMaster() {
//        Ajax.Callsync({
//            type: "Get",
//            url: sys.apiUrl("AccDefSalesMen", "GetAllOperationPeople"),
//            data: { CompCode: compcode, ISOperationEnable: true, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
//            success: (d) => {
//                let result = d as BaseResponse;
//                if (result.IsSuccess) {
//                    salesmanDetails = result.Response as Array<I_Sls_D_Salesman>;
//                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
//                        DocumentActions.FillCombowithdefult(salesmanDetails, ddlSalesmanMaster, "SalesmanId", "NameE", "Select Seller");
//                    }
//                    else {
//                        DocumentActions.FillCombowithdefult(salesmanDetails, ddlSalesmanMaster, "SalesmanId", "NameA", "اختر المندوب");
//                    }
//                }
//            }
//        });
//    }
//    function FillddlCashTypeMaster() {
//        CashDetailsAr = ["علي الحساب", "نقدي"];
//        CashDetailsEn = ["Cash", "Doubted"];
//        if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
//            for (let i = 0; i < CashDetailsEn.length; i++) {
//                let newoption = document.createElement("option");
//                newoption.value = i.toString();
//                newoption.text = CashDetailsEn[i];
//                ddlCashTypeMaster.options.add(newoption);
//            }
//        }
//        else {
//            for (let i = 0; i < CashDetailsAr.length; i++) {
//                let newoption = document.createElement("option");
//                newoption.value = i.toString();
//                newoption.text = CashDetailsAr[i];
//                ddlCashTypeMaster.options.add(newoption);
//            }
//        }
//    }
//    function fillddlCustomerMaster() {
//        // //debugger;
//        // ////debugger;
//        Ajax.Callsync({
//            type: "Get",
//            url: sys.apiUrl("AccDefCustomer", "GetAll"),
//            data: {
//                CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
//            },
//            success: (d) => {
//                let result = d as BaseResponse;
//                if (result.IsSuccess) {
//                    VendorDetails = result.Response as Array<A_Rec_D_Customer>;
//                    VendorDetails = VendorDetails.filter(s => s.Isactive == true);
//                    //  //debugger;
//                    //  ////debugger;
//                    if (TypeFlag == true) {
//                        VendorDetails = VendorDetails.filter(s => s.STATUS == true);
//                    } else {
//                        VendorDetails = VendorDetails.filter(s => s.STATUS == false);
//                    }
//                    if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
//                        DocumentActions.FillCombowithdefult(VendorDetails, ddlCustomerMaster, "CustomerId", "NAMEE", "Select Category");
//                    }
//                    else {
//                        DocumentActions.FillCombowithdefult(VendorDetails, ddlCustomerMaster, "CustomerId", "NAMEA", "اختر العميل");
//                    }
//                }
//            }
//        });
//        if (ddlCashTypeMaster.value == "null") {
//            $("#ddlCustomerMaster").empty();
//        }
//        $("#ddlCustomerMaster").removeAttr('disabled');
//    }
//    //function FillddlFamily() {
//    //    Ajax.Callsync({
//    //        type: "Get",
//    //        url: sys.apiUrl("StkDefItemType", "GetAllOrdered"),
//    //        data: {
//    //            CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
//    //        },
//    //        success: (d) => {
//    //            ////////debugger;
//    //            let result = d as BaseResponse;
//    //            if (result.IsSuccess) {
//    //                FamilyDetails = result.Response as Array<I_ItemFamily>;
//    //            }
//    //        }
//    //    });
//    //}
//    function FillddlItem( FamilyID: number) {
//        //debugger
//        var operationID: number = Number(ddlOPerationMaster.value);
//        Ajax.Callsync({
//            type: "Get",
//            url: sys.apiUrl("OperationInvoice", "GetItemByFamilyIdOrdered"),
//            data: {
//                familyid: FamilyID, OperationID: operationID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
//            },
//            success: (d) => {
//                //debugger;
//                let result = d as BaseResponse;
//                if (result.IsSuccess) {
//                    ItemDetails = result.Response as Array<IQ_GetOperationItemInfo_New>;
//                }
//            }
//        });
//    }
//    function GetDate() {
//        var today: Date = new Date();
//        var dd: string = today.getDate().toString();
//        var ReturnedDate: string;
//        var mm: string = (today.getMonth() + 1).toString();
//        var yyyy = today.getFullYear();
//        if (Number(dd) < 10) {
//            dd = ('0' + dd);
//        }
//        if (Number(mm) < 10) {
//            mm = ('0' + mm);
//        }
//        ReturnedDate = yyyy + '-' + mm + '-' + dd;
//        return ReturnedDate;
//    }
//    function ddlSalesmanMaster_onchange() {
//        //debugger;
//        if (ddlSalesmanMaster.value != "null") {
//            var salesmanid = Number(ddlSalesmanMaster.value);
//            //GetAllSalesmanOperations(int salesmanId,int CompCode, string UserCode, string Token) TruckNo
//            Ajax.Callsync({
//                type: "Get",
//                url: sys.apiUrl("OperationInvoice", "GetAllSalesmanOperations"),
//                data: { salesmanId: salesmanid, CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
//                success: (d) => {
//                    let result = d as BaseResponse;
//                    if (result.IsSuccess) {
//                        //debugger;
//                        operationDetails = result.Response as Array<I_TR_Operation>;
//                        if (chkOpenProcess.checked == false) {
//                            operationDetails = operationDetails.filter(s => s.Status == 3)
//                            if (ddlOPerationMaster.value == "null" || ddlOPerationMaster.value == "") { lblOperationStatusMaster.innerText = ""; }
//                            else { lblOperationStatusMaster.innerText = "مغلقة"; }
//                        } else {
//                            operationDetails = operationDetails.filter(s => s.Status == 2)
//                            if (ddlOPerationMaster.value == "null" || ddlOPerationMaster.value == "") {
//                                lblOperationStatusMaster.innerText = "";
//                            } else { lblOperationStatusMaster.innerText = "مفتوحة"; }
//                        }
//                        if (SysSession.CurrentEnvironment.ScreenLanguage == "en") {
//                            DocumentActions.FillCombowithdefult(operationDetails, ddlOPerationMaster, "OperationID", "TruckNo", "Select operation");
//                        }
//                        else {
//                            DocumentActions.FillCombowithdefult(operationDetails, ddlOPerationMaster, "OperationID", "TruckNo", "اختر العملية");
//                        }
//                    }
//                }
//            });
//        }
//    }
//    function ddlOPerationMaster_onchange() {
//        if (ddlOPerationMaster.value == "null" || ddlOPerationMaster.value == "")
//        {
//        lblOperationStatusMaster.innerText = "";
//        }
//        else {
//            // (PurReceiveChargeData[cnt].Serial == null || undefined) ? 0 : PurReceiveChargeData[cnt].Serial)
//            (chkOpenProcess.checked == true || false) ? lblOperationStatusMaster.innerText = "مفتوحه" : lblOperationStatusMaster.innerText = "مغلقة" 
//        }
//    }
//    function ddlCashTypeMaster_onchange() {
//        if (ddlCashTypeMaster.value == "1") {//نقدي
//            //  $("#divType").removeClass("display_none");
//            txtCustomerNameMaster.value = "عميل نقدي عام";
//            txtCustomerMobileMaster.value = "";
//            $('#ddlCustomerMaster option[value=null]').prop('selected', 'selected').change();
//            TypeFlag = true;
//            $("#ddlCustomerMaster").attr("disabled", "disabled");
//        } else {//علي الحساب
//            TypeFlag = false;
//            txtCustomerNameMaster.value = "";
//            fillddlCustomerMaster();
//        }
//    }
//    function ddlCustomerMaster_onchange() {
//        if (ddlCustomerMaster.value != "null") {
//            var customerID = Number(ddlCustomerMaster.value);
//            var custom1 = VendorDetails.filter(s => s.CustomerId == customerID);
//            txtCustomerNameMaster.value = custom1[0].NAMEA;
//            txtCustomerMobileMaster.value = custom1[0].MOBILE;
//           // ddlSalesman.value = custom1[0].SalesmanId.toString();
//        }
//    }
//    // buttons Events
//    function btnAdd_onclick() {
//        if (ddlOPerationMaster.value == "null" || ddlOPerationMaster.value == "") {
//            DisplayMassage(" يجب اختيار العملية", "خطأ", MessageType.Worning);
//        } else {
//            var operationId = Number(ddlOPerationMaster.value);
//            Ajax.Callsync({
//                type: "Get",
//                url: sys.apiUrl("OperationInvoice", "GetAllOrdered"),
//                data: {//(int operationId,int CompCode, string UserCode, string Token)
//                    operationId: operationId, CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
//                },
//                success: (d) => {
//                    let result = d as BaseResponse;
//                    if (result.IsSuccess) {
//                        FamilyDetails = result.Response as Array<IQ_GetOperationItemInfo_New>;
//                    }
//                }
//            });
//        }
//    }
//    function btnSave_onclick() {
//        //debugger
//        if (!SysSession.CurrentPrivileges.AddNew) return;
//        if (!ValidationHeader())
//            return;
//        Validation_Insert = 0;
//        Assign();
//        MasterDetailModel.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
//        MasterDetailModel.UserCode = SysSession.CurrentEnvironment.UserCode;
//        if (Validation_Insert == 1) { Open_poup_Pass(); }
//        else {
//            Insert();
//            $('#condtionbtn1').removeClass("col-lg-10");
//            $('#condtionbtn1').addClass("col-lg-8");
//            $('#condtionbtn2').removeClass("col-lg-2");
//            $('#condtionbtn2').addClass("col-lg-4");
//            $('#btnPrint').removeClass("display_none");
//            $('#btnPrntPrice').removeClass("display_none");
//           // clear();
//        }
//}
//    function Assign() {
//        debugger;
//        List_MinUnitPrice = new Array<I_Sls_TR_InvoiceItems>();
//        var StatusFlag: String;
//        InvoiceModel = new I_Sls_TR_Invoice();
//        invoiceItemsModel = new Array<I_Sls_TR_InvoiceItems>();
//        InvoiceModel.CreatedAt = InvoiceStatisticsModel[0].CreatedAt;
//        InvoiceModel.CreatedBy = InvoiceStatisticsModel[0].CreatedBy;
//        if (ddlCustomerMaster.value != "null")
//            InvoiceModel.CustomerId = Number(ddlCustomerMaster.value);
//        InvoiceModel.CompCode = Number(compcode);
//       // var InvoiceNumber = Number(lblInvoiceNumber.innerText);
//       // InvoiceModel.TrNo = InvoiceNumber;
//        //InvoiceModel.UpdatedBy = SysSession.CurrentEnvironment.UserCode;
//        //InvoiceModel.UpdatedAt = DateTimeFormat(Date().toString());
//        InvoiceModel.TrType = 0//0 invoice 1 return
//        InvoiceModel.SlsInvSrc = 2   // 1 from store 2 from van 
//        InvoiceModel.SlsInvType = 1 //  retail 
//      //  InvoiceModel.StoreId = 1;//main store
//        InvoiceModel.RefTrID = null;
//        ///////////////
//       // InvoiceModel.InvoiceID = GlobalinvoiceID;
//        InvoiceModel.SalesmanId = Number(ddlSalesmanMaster.value);
//        InvoiceModel.NetAfterVat = NetCount;
//        InvoiceModel.TotalAmount = Number(txtTotal.value);
//        InvoiceModel.TrDate = txtDate.value;
//        InvoiceModel.CustomerName = txtCustomerNameMaster.value;
//        InvoiceModel.CustomerMobileNo = txtCustomerMobileMaster.value;
//        InvoiceModel.CommitionAmount = Number(txtCommission.value);
//        InvoiceModel.VatType = vatType;
//        InvoiceModel.VatAmount = Number(txtTax.value);
//        if (ddlCashTypeMaster.value == "0") {
//            InvoiceModel.IsCash = false;
//        } else {
//            InvoiceModel.IsCash = true;
//        }
//        if (chkActive.checked == true) {
//            InvoiceModel.Status = 1;
//        } else {
//            InvoiceModel.Status = 0;
//        }
//        // Details
//        for (var i = 0; i < CountGrid; i++) {
//            invoiceItemSingleModel = new I_Sls_TR_InvoiceItems();
//            StatusFlag = $("#txt_StatusFlag" + i).val();
//            $("#txt_StatusFlag" + i).val("");
//            debugger
//            invoiceItemSingleModel.Name_Item = $("#ddlItem" + i + " option:selected").text();
//            invoiceItemSingleModel.MinUnitPrice = Number($('option:selected', $("#ddlItem" + i)).attr('data-MinUnitPrice'));
//            if (Number($("#txtPrice" + i).val()) < Number($('option:selected', $("#ddlItem" + i)).attr('data-MinUnitPrice'))) {
//                List_MinUnitPrice.push(invoiceItemSingleModel);
//                Validation_Insert = 1;
//            }
//            if (StatusFlag == "i") {
//                invoiceItemSingleModel.InvoiceItemID = 0;
//                invoiceItemSingleModel.ItemID = $("#ddlItem" + i).val();
//                invoiceItemSingleModel.SoldQty = $('#txtQuantity' + i).val();
//                invoiceItemSingleModel.StockSoldQty = $('#txtQuantity' + i).val();//
//                invoiceItemSingleModel.NetUnitPrice = $("#txtPrice" + i).val();
//                invoiceItemSingleModel.Unitprice = $("#txtPrice" + i).val();
//                invoiceItemSingleModel.VatPrc = VatPrc;//$("#txtTax" + i).val();
//                invoiceItemSingleModel.VatAmount = $("#txtTax" + i).val();
//                invoiceItemSingleModel.ItemTotal = invoiceItemSingleModel.Unitprice * invoiceItemSingleModel.SoldQty;
//                //   invoiceItemSingleModel.VatAmount = invoiceItemSingleModel.ItemTotal * invoiceItemSingleModel.VatPrc / 100;
//                invoiceItemSingleModel.TotRetQty = $("#txtReturnQuantity" + i).val();
//                invoiceItemSingleModel.StatusFlag = StatusFlag.toString();
//                invoiceItemsModel.push(invoiceItemSingleModel);
//            }
//            if (StatusFlag == "u") {
//                var invoiceItemId = $("#InvoiceItemID" + i).val()
//                invoiceItemSingleModel.InvoiceItemID = invoiceItemId;
//                invoiceItemSingleModel.ItemID = $("#ddlItem" + i).val();
//                invoiceItemSingleModel.StatusFlag = StatusFlag.toString();
//                invoiceItemSingleModel.ItemID = $("#ddlItem" + i).val();
//                invoiceItemSingleModel.SoldQty = $('#txtQuantity' + i).val();
//                invoiceItemSingleModel.StockSoldQty = $('#txtQuantity' + i).val();//
//                invoiceItemSingleModel.TotRetQty = $('#txtReturnQuantity' + i).val();
//                invoiceItemSingleModel.NetUnitPrice = $("#txtPrice" + i).val();
//                invoiceItemSingleModel.Unitprice = $("#txtPrice" + i).val();
//                invoiceItemSingleModel.VatPrc = VatPrc;// $("#txtTax" + i).val();
//                invoiceItemSingleModel.ItemTotal = invoiceItemSingleModel.Unitprice * invoiceItemSingleModel.SoldQty;
//                invoiceItemSingleModel.VatAmount = invoiceItemSingleModel.ItemTotal * invoiceItemSingleModel.VatPrc / 100;
//                invoiceItemSingleModel.NetAfterVat = invoiceItemSingleModel.ItemTotal + invoiceItemSingleModel.VatAmount;
//                invoiceItemsModel.push(invoiceItemSingleModel);
//            }
//            if (StatusFlag == "d") {
//                if ($("#InvoiceItemID" + i).val() != "") {
//                    var deletedID = $("#InvoiceItemID" + i).val();
//                    invoiceItemSingleModel.StatusFlag = StatusFlag.toString();
//                    invoiceItemSingleModel.InvoiceItemID = deletedID;
//                    invoiceItemsModel.push(invoiceItemSingleModel);
//                }
//            }
//        }
//        MasterDetailModel.I_Sls_TR_Invoice = InvoiceModel;
//        MasterDetailModel.I_Sls_TR_InvoiceItems = invoiceItemsModel;
//    }
//    function Insert() {
//        InvoiceModel.InvoiceID = 0;
//        InvoiceModel.CompCode = Number(compcode);
//        InvoiceModel.CreatedBy = SysSession.CurrentEnvironment.UserCode;
//        InvoiceModel.CreatedAt = DateTimeFormat(Date().toString());
//        InvoiceModel.VatType = vatType;
//        InvoiceModel.VatAmount = Number(txtTax.value);
//        InvoiceModel.CommitionAmount = Number(txtCommission.value);
//        InvoiceModel.TrType = 0 //0 invoice 1 return
//        InvoiceModel.SlsInvSrc = 2  // 1 from store 2 from van 
//        InvoiceModel.SlsInvType = 1 //  retail 
//        Ajax.Callsync({
//            type: "POST",
//            url: sys.apiUrl("SlsTrSales", "InsertInvoiceMasterDetail"),
//            data: JSON.stringify(MasterDetailModel),
//            success: (d) => {
//                let result = d as BaseResponse;
//                if (result.IsSuccess == true) {
//                    let res = result.Response as I_Sls_TR_Invoice;
//                    //$("#lblMessage").addClass("label label-success");
//                    //lblMessage.innerText = "تم اصدار  فاتورة رقم " + res.TrNo;
//                    //setTimeout(() => { lblMessage.innerText = ""; $("#lblMessage").removeClass("label label-success"); }, 9000);
//                    //lblInvoiceNumber.innerText = res.TrNo.toString();
//                    DisplayMassage(" تم اصدار  فاتورة رقم  " + res.TrNo + " ", "Succeed", MessageType.Succeed);
//                    $('#divCreationPanel').removeClass("display_none");
//                    $('#txtCreatedBy').prop("value", SysSession.CurrentEnvironment.UserCode);
//                    $('#txtCreatedAt').prop("value", DateTimeFormat(Date().toString()));
//                    $("#btnSave").addClass("display_none");
//                    $("#btnBack").addClass("display_none");
//                    $("#btnAddDetails").addClass("display_none");
//                    $("#btnAdd").removeClass("display_none");
//                    $("#General_Div").attr("disabled", "disabled").off('click');
//                    $("#General_Div").addClass("disabledDiv");
//                    // clear();
//                    //DisplayMassage("تم اصدار  فاتورة رقم " + res.InvoiceID, "خطأ");
//                    //lblInvoiceNumber.innerText = res.InvoiceID.toString();
//                } else {
//                    //$("#btnAdd").removeClass("display_none");
//                    //$("#lblMessage").addClass("label label-danger");
//                    //$("#lblMessage").innerText = "هناك خطـأ ";
//                    //setTimeout(() => { $("#lblMessage").innerText = ""; $("#lblMessage").removeClass("label label-danger"); }, 5000);
//                    DisplayMassage("خطأء", "Error", MessageType.Error);
//                }
//            }
//        });
//    }
//    function ValidationHeader() {
//        ////debugger
//        if (ddlCustomerMaster.selectedIndex == 0 && TypeFlag == false) {
//            DisplayMassage(" برجاء اختيار العميل", "خطأ", MessageType.Worning);
//            return false
//        }
//        else if (ddlSalesmanMaster.value == "null") {
//            DisplayMassage(" برجاء اختيار المندوب", "خطأ", MessageType.Worning);
//            return false
//        }
//        else if (ddlOPerationMaster.selectedIndex == 0) {
//            DisplayMassage(" برجاء اختيار العملية", "خطأ", MessageType.Worning);
//            return false
//        }
//        else if (txtDate.value == "") {
//            DisplayMassage(" برجاء ادخال التاريخ", "خطأ", MessageType.Worning);
//            return false
//        }
//        else if (CountGrid == 0) {
//            DisplayMassage(" برجاء ادخال بيانات الفاتورة", "خطأ", MessageType.Worning);
//            return false
//        }
//        return true;
//    }
//    //controls Region
//    function AddNewRow() {
//        //$("#btnEdit").addClass("display_none");
//        //$("#DivShow").removeClass("display_none");
//        //////debugger
//        if (!SysSession.CurrentPrivileges.AddNew) return;
//        var CanAdd: boolean = true;
//        if (CountGrid > 0) {
//            var LastRowNo = CountGrid - 1;
//            CanAdd = Validation_Grid(LastRowNo);
//        }
//        if (CanAdd) {
//            CountItems = CountItems + 1;
//            txtItemCount.value = CountItems.toString();
//            BuildControls(CountGrid);
//            $("#txt_StatusFlag" + CountGrid).val("i"); //In Insert mode
//            $("#ddlFamily" + CountGrid).removeAttr("disabled");
//            $("#ddlItem" + CountGrid).removeAttr("disabled");
//            $("#txtQuantity" + CountGrid).removeAttr("disabled");
//            $("#txtPrice" + CountGrid).removeAttr("disabled");
//            // can delete new inserted record  without need for delete privilage
//            $("#btn_minus" + CountGrid).removeClass("display_none");
//            $("#btn_minus" + CountGrid).removeAttr("disabled");
//            //chkActive.checked = true;
//            CountGrid++;
//        }
//    }
//    function DeleteRow(RecNo: number) {
//        if (!SysSession.CurrentPrivileges.Remove) return;
//        WorningMessage("هل تريد الحذف؟", "Do you want to delete?", "تحذير", "worning", () => {
//            ////////debugger;
//            $("#txt_StatusFlag" + RecNo).val("d");
//            CountItems = CountItems - 1;
//            ComputeTotals();
//            txtItemCount.value = CountItems.toString();
//            $("#ddlFamily" + RecNo).val("99");
//            $("#ddlItem" + RecNo).val("99");
//            $("#txtQuantity" + RecNo).val("1");
//            $("#txtPrice" + RecNo).val("1");
//            $("#No_Row" + RecNo).attr("hidden", "true");
//            $("#txtCode" + RecNo).val("000");
//        });
//    }
//    function BuildControls(cnt: number) {
//        ////////debugger;
//        var html = '<div id= "No_Row' + cnt + '" class="container-fluid style_border" > <div class="row" > <div class="col-lg-12" > ' +
//            '<span id="btn_minus' + cnt + '" class="fa fa-minus-circle fontitm3 display_none"></span>' +
//            '<input id="InvoiceItemID' + cnt + '" type="hidden" class="form-control right2 display_none"  />' +
//            '<div class="col-lg-2">' +
//            '<select id="ddlFamily' + cnt + '" class="form-control" disabled><option>النوع</option></select></div>' +
//            '<div class="col-lg-2">' +
//            '<select id="ddlItem' + cnt + '" class="form-control" disabled><option>الصنف</option></select></div>' +
//            '<div class="row col-lg-2" style=""><div class="input-group "style="width: 86%;"><span class="input-group-btn"><button type="button" style="background-color: #4CAF50; "   class="btn btn-default btn-number1' + cnt + '"  id="btnminus1" data-type="minus" data-field="quant[1]"><span class="glyphicon glyphicon-minus"></span></button></span><input type="text"   style="height:36px;" id="txtQuantity' + cnt + '" name="quant[1]" class="form-control   font1" value="1" min="1" max="1000" step="1"><span class="input-group-btn"><button type="button" style="background-color: #f44336;" id="btnplus1"   class="btn btn-default btn-number1' + cnt + '" data-type="plus" data-field="quant[1]"><span class="glyphicon glyphicon-plus"></span></button></span></div></div>' +
//            '<div class="row col-lg-2" style=""><div class="input-group "style="width: 86%;"><span class="input-group-btn"><button type="button" style="background-color: #4CAF50; "   class="btn btn-default btn-number2' + cnt + '"  id="btnminus2" data-type="minus" data-field="quant[2]"><span class="glyphicon glyphicon-minus"></span></button></span><input type="text"   style="height:36px;" id="txtPrice' + cnt + '" name="quant[2]" class="form-control   font1" value="1" min="0" max="1000" step="0.5"><span class="input-group-btn"><button type="button" style="background-color: #f44336;" id="btnplus2' + cnt + '"   class="btn btn-default btn-number2' + cnt + '" data-type="plus" data-field="quant[2]"><span class="glyphicon glyphicon-plus"></span></button></span></div></div>' +
//            '<div class="col-lg-1">' +
//            '<input id="txtTotal' + cnt + '" type="text" class="form-control right2" disabled /></div>' +
//            '<div class="col-lg-1">' +
//            '<input id="txtTax' + cnt + '" type="text" class="form-control right2" disabled /></div>' +
//            '<div class="col-lg-2">' +
//            '<input id="txtTotAfterTax' + cnt + '" type="text" class="form-control right2" disabled /></div>' +
//            '</div></div></div>' +
//            '<input id="txt_StatusFlag' + cnt + '" name = " " type = "hidden" class="form-control"/><input id="txt_ID' + cnt + '" name = " " type = "hidden" class="form-control" />';
//        $("#div_Data").append(html);
//        //script
//        $('.btn-number1' + cnt).click(function (e) {
//            e.preventDefault();
//            var fieldName = $(this).attr('data-field');
//            var type = $(this).attr('data-type');
//            var input = $("#txtQuantity" + cnt);
//            var currentVal = parseFloat(input.val());
//            if (!isNaN(currentVal)) {
//                if (type == 'minus') {
//                    if (currentVal > Number(input.attr('min'))) {
//                        input.val((currentVal - 1)).change();
//                    }
//                    if (parseFloat(input.val()) == Number(input.attr('min'))) {
//                        $(this).val(input.attr('min'));
//                    }
//                }
//                else if (type == 'plus') {
//                    if (currentVal < Number(input.attr('max'))) {
//                        input.val((currentVal + 1)).change();
//                    }
//                    if (parseFloat(input.val()) == parseFloat(input.attr('max'))) {
//                        $(this).val(input.attr('max'));
//                    }
//                }
//            } else {
//                input.val(1);
//            }
//        });
//        $('.input-number1' + cnt).focusin(function () {
//            $(this).data('oldValue', $(this).val());
//        });
//        $('.input-number1' + cnt).change(function () {
//            var minValue = parseInt($(this).attr('min'));
//            var maxValue = parseInt($(this).attr('max'));
//            var valueCurrent = parseInt($(this).val());
//            var name = $(this).attr('name');
//            if (valueCurrent >= minValue) {
//                $(".btn-number1" + cnt + "[data-type='minus'][data-field='" + name + "']").removeAttr('disabled')
//            } else {
//                alert('Sorry, the minimum value was reached');
//                $(this).val($(this).data('oldValue'));
//            }
//            if (valueCurrent <= maxValue) {
//                $(".btn-number1" + cnt + "[data-type='plus'][data-field='" + name + "']").removeAttr('disabled')
//            } else {
//                alert('Sorry, the maximum value was reached');
//                $(this).val($(this).data('oldValue'));
//            }
//        });
//        $(".input-number1" + cnt).keydown(function (e) {
//            // Allow: backspace, delete, tab, escape, enter and .
//            if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 190]) !== -1 ||
//                // Allow: Ctrl+A
//                (e.keyCode == 65 && e.ctrlKey === true) ||
//                // Allow: home, end, left, right
//                (e.keyCode >= 35 && e.keyCode <= 39)) {
//                // let it happen, don't do anything
//                return;
//            }
//            // Ensure that it is a number and stop the keypress
//            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
//                e.preventDefault();
//            }
//        });
//        //script
//        //script
//        $('.btn-number2' + cnt).click(function (e) {
//            e.preventDefault();
//            var fieldName = $(this).attr('data-field');
//            var type = $(this).attr('data-type');
//            var input = $("#txtPrice" + cnt);
//            var currentVal = parseFloat(input.val());
//            if (!isNaN(currentVal)) {
//                if (type == 'minus') {
//                    if (currentVal > Number(input.attr('min'))) {
//                        input.val((currentVal - 0.5)).change();
//                    }
//                    if (parseFloat(input.val()) == Number(input.attr('min'))) {
//                        $(this).val(input.attr('min'));
//                    }
//                } else if (type == 'plus') {
//                    if (currentVal < Number(input.attr('max'))) {
//                        input.val((currentVal + 0.5)).change();
//                    }
//                    if (parseFloat(input.val()) == parseFloat(input.attr('max'))) {
//                        $(this).val(input.attr('max'));
//                    }
//                }
//            } else {
//                input.val(1);
//            }
//        });
//        $('.input-number2' + cnt).focusin(function () {
//            $(this).data('oldValue', $(this).val());
//        });
//        $('.input-number2' + cnt).change(function () {
//            var minValue = parseInt($(this).attr('min'));
//            var maxValue = parseInt($(this).attr('max'));
//            var valueCurrent = parseInt($(this).val());
//            var name = $(this).attr('name');
//            if (valueCurrent >= minValue) {
//                $(".btn-number2" + cnt + "[data-type='minus'][data-field='" + name + "']").removeAttr('disabled')
//            } else {
//                alert('Sorry, the minimum value was reached');
//                $(this).val($(this).data('oldValue'));
//            }
//            if (valueCurrent <= maxValue) {
//                $(".btn-number2" + cnt + "[data-type='plus'][data-field='" + name + "']").removeAttr('disabled')
//            } else {
//                alert('Sorry, the maximum value was reached');
//                $(this).val($(this).data('oldValue'));
//            }
//        });
//        $(".input-number2" + cnt).keydown(function (e) {
//            // Allow: backspace, delete, tab, escape, enter and .
//            if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 190]) !== -1 ||
//                // Allow: Ctrl+A
//                (e.keyCode == 65 && e.ctrlKey === true) ||
//                // Allow: home, end, left, right
//                (e.keyCode >= 35 && e.keyCode <= 39)) {
//                // let it happen, don't do anything
//                return;
//            }
//            // Ensure that it is a number and stop the keypress
//            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
//                e.preventDefault();
//            }
//        });
//        //script
//        //fill dropdownlist
//        for (var i = 0; i < FamilyDetails.length; i++) {
//            $('#ddlFamily' + cnt).append('<option value="' + FamilyDetails[i].ItemFamilyID + '">' + FamilyDetails[i].Family_DescA + '</option>');
//        }
//        //FillddlItem
//        var drop = '#ddlFamily' + cnt;
//        $(drop).change(function () {
//            ////debugger
//            var selectedFamily = $(drop + ' option:selected').attr('value');
//           FillddlItem(Number(selectedFamily));
//            $('#ddlItem' + cnt).empty();
//            $('#ddlItem' + cnt).append('<option value="' + null + '">' + "اختر الصنف" + '</option>');
//            for (var i = 0; i < ItemDetails.length; i++) {
//                $('#ddlItem' + cnt).append('<option data-MinUnitPrice="' + ItemDetails[i].MinUnitPrice + '" data-OnhandQty="' + ItemDetails[i].OnhandQty + '" value="' + ItemDetails[i].ItemID + '">' + ItemDetails[i].Itm_DescA + '</option>');
//            }
//            ComputeTotals();
//        });
//        var dropddlItem = '#ddlItem' + cnt;
//        $(dropddlItem).change(function () {
//            debugger
//            if ($('#ddlItem' + cnt).val() == "null") {
//                $("#txtQuantity" + cnt).val("1");
//                $("#txtPrice" + cnt).val("1");
//                $("#txtTotal" + cnt).val("0");
//                $("#txtTax" + cnt).val("0");
//                $("#txtTotAfterTax" + cnt).val("0");
//            } else {
//                var selectedItem = $(dropddlItem + ' option:selected').attr('value');
//                var selectedFamily = $(drop + ' option:selected').attr('value');
//                var itemID = Number(selectedItem);
//                var FamilyID = Number(selectedFamily);
//                var NumberSelect = ItemDetails.filter(s => s.ItemID == itemID);
//                var res = false;
//                var NumberRowid = $("#InvoiceItemID" + cnt).val();
//                res = checkRepeatedItems(itemID, FamilyID, NumberRowid);
//                if (res == true) {
//                    $("#ddlItem" + cnt).val("null");
//                    $("#txtPrice" + cnt).val("1");
//                    DisplayMassage('( لايمكن تكرار نفس الاصناف علي الفاتورة )', '(Error)', MessageType.Error);
//                } else {
//                    var itemPrice = NumberSelect[0].UnitPrice;
//                    $("#txtPrice" + cnt).val(itemPrice);
//                    //
//                    var txtQuantityValue = $("#txtQuantity" + cnt).val();
//                    var txtPriceValue = $("#txtPrice" + cnt).val();
//                    if ($("#txtPrice" + cnt).val() == 0) {
//                        var total = Number(txtQuantityValue) * 1;
//                        $("#txtTotal" + cnt).val(total);
//                        var vatAmount = Number(total) * VatPrc / 100;
//                        $("#txtTax" + cnt).val(vatAmount);
//                        var totalAfterVat = Number(vatAmount) + Number(total);
//                        $("#txtTotAfterTax" + cnt).val(totalAfterVat);
//                    } else {
//                        var total = Number(txtQuantityValue) * Number(txtPriceValue);
//                        $("#txtTotal" + cnt).val(total);
//                        var vatAmount = Number(total) * VatPrc / 100;
//                        $("#txtTax" + cnt).val(vatAmount);
//                        var totalAfterVat = Number(vatAmount) + Number(total);
//                        $("#txtTotAfterTax" + cnt).val(totalAfterVat);
//                    }
//                }
//            }
//            ComputeTotals();
//        });
//        // text change
//        $("#txtQuantity" + cnt).on('change', function () {
//            if ($("#txt_StatusFlag" + cnt).val() != "i")
//                $("#txt_StatusFlag" + cnt).val("u");
//            var txtQuantityValue = $("#txtQuantity" + cnt).val();
//            var txtPriceValue = $("#txtPrice" + cnt).val();
//            var total = 0;
//            let Onhand_Qty = Number($('option:selected', $("#ddlItem" + cnt)).attr('data-OnhandQty'))
//            if (txtQuantityValue < Onhand_Qty) { }
//            else {
//                DisplayMassage("خطأ الكميه المتاحه (" + Onhand_Qty + ")", "خطأ", MessageType.Worning)
//                $("#txtQuantity" + cnt).val(Onhand_Qty);
//                txtQuantityValue = Onhand_Qty;
//            }
//            if ($("#txtPrice" + cnt).val() == 0) { total = Number(txtQuantityValue) * 1; }
//            else { total = Number(txtQuantityValue) * Number(txtPriceValue); }
//            $("#txtTotal" + cnt).val(total);//= total;
//            var vatAmount = Number(total) * VatPrc / 100;
//            $("#txtTax" + cnt).val(vatAmount);
//            var totalAfterVat = Number(vatAmount) + Number(total);
//            $("#txtTotAfterTax" + cnt).val(totalAfterVat);
//            ComputeTotals();
//        });
//        $("#txtQuantity" + cnt).on('keyup', function () {
//            if ($("#txt_StatusFlag" + cnt).val() != "i")
//                $("#txt_StatusFlag" + cnt).val("u");
//            var txtQuantityValue = $("#txtQuantity" + cnt).val();
//            var txtPriceValue = $("#txtPrice" + cnt).val();
//            var total = 0;
//            let Onhand_Qty = Number($('option:selected', $("#ddlItem" + cnt)).attr('data-OnhandQty'))
//            if (txtQuantityValue < Onhand_Qty) { }
//            else {
//                DisplayMassage("خطأ الكميه المتاحه (" + Onhand_Qty + ")", "خطأ", MessageType.Worning)
//                $("#txtQuantity" + cnt).val(Onhand_Qty);
//                txtQuantityValue = Onhand_Qty;
//            }
//            if ($("#txtPrice" + cnt).val() == 0) { total = Number(txtQuantityValue) * 1; }
//            else { total = Number(txtQuantityValue) * Number(txtPriceValue); }
//            $("#txtTotal" + cnt).val(total);//= total;
//            var vatAmount = Number(total) * VatPrc / 100;
//            $("#txtTax" + cnt).val(vatAmount);
//            var totalAfterVat = Number(vatAmount) + Number(total);
//            $("#txtTotAfterTax" + cnt).val(totalAfterVat);
//            ComputeTotals();
//        });
//        $("#txtPrice" + cnt).on('change', function () {
//            if ($("#txt_StatusFlag" + cnt).val() != "i")
//                $("#txt_StatusFlag" + cnt).val("u");
//            var txtQuantityValue = $("#txtQuantity" + cnt).val();
//            var txtPriceValue = $("#txtPrice" + cnt).val();
//            if ($("#txtQuantity" + cnt).val() == 0) {
//                var total = 1 * Number(txtPriceValue);
//                $("#txtTotal" + cnt).val(total);
//                var vatAmount = Number(total) * VatPrc / 100;
//                $("#txtTax" + cnt).val(vatAmount);
//                var totalAfterVat = Number(vatAmount) + Number(total);
//                $("#txtTotAfterTax" + cnt).val(totalAfterVat);
//                ComputeTotals();
//                //txtTotal.value = (CountTotal + total).RoundToSt(2).toString();
//                //CountTotal = Number((CountTotal + total).RoundToSt(2).toString());
//                //txtNet.value = (NetCount + totalAfterVat).RoundToSt(2).toString();
//                //NetCount = Number((NetCount + totalAfterVat).RoundToSt(2).toString());
//                //txtTax.value = (TaxCount + vatAmount).RoundToSt(2).toString();
//                //TaxCount = Number((TaxCount + vatAmount).RoundToSt(2).toString());
//            } else {
//                var total = 1 * Number(txtPriceValue);
//                var vatAmount = Number(total) * VatPrc / 100;
//                $("#txtTax" + cnt).val(vatAmount);
//                var total = Number(txtQuantityValue) * Number(txtPriceValue);
//                $("#txtTotal" + cnt).val(total);
//                var totalAfterVat = Number(vatAmount) + Number(total);
//                $("#txtTotAfterTax" + cnt).val(totalAfterVat);
//                ComputeTotals();
//            }
//        });
//        $("#btn_minus" + cnt).on('click', function () {
//            DeleteRow(cnt);
//        });
//        if (SysSession.CurrentPrivileges.Remove) {
//            //$("#btn_minus" + cnt).removeClass("display_none");
//            //$("#btn_minus" + cnt).removeAttr("disabled");
//            $("#btn_minus" + cnt).addClass("display_none");
//            $("#btn_minus" + cnt).attr("disabled", "disabled");
//        }
//        else {
//            $("#btn_minus" + cnt).addClass("display_none");
//            $("#btn_minus" + cnt).attr("disabled", "disabled");
//        }
//        return;
//    }
//    function ComputeTotals() {
//        //CountGrid = 0;
//        //  CountItems = CountGrid;
//        ////debugger
//       PackageCount = 0;
//        CountTotal = 0;
//        TaxCount = 0;
//        NetCount = 0;
//        for (let i = 0; i < CountGrid; i++) {//$("#txt_StatusFlag" + cnt).val() != "i"
//            var flagvalue = $("#txt_StatusFlag" + i).val();
//            if (flagvalue != "d") {
//                PackageCount += Number($("#txtQuantity" + i).val());
//                PackageCount = Number(PackageCount.RoundToSt(2).toString());
//                CountTotal += Number($("#txtTotal" + i).val());
//                CountTotal = Number(CountTotal.RoundToSt(2).toString());
//                TaxCount += Number($("#txtTax" + i).val());
//                TaxCount = Number(TaxCount.RoundToSt(2).toString());
//                NetCount += Number($("#txtTotAfterTax" + i).val());
//                NetCount = Number(NetCount.RoundToSt(2).toString());
//            }
//        }
//        //// Display in footer 
//        txtItemCount.value = CountItems.toString();
//        txtPackageCount.value = PackageCount.toString();
//        txtTotal.value = CountTotal.toString();
//        txtTax.value = TaxCount.toString();
//        txtNet.value = NetCount.toString();
//    }
//    function Validation_Grid(rowcount: number) {
//        ////debugger
//        if ($("#txt_StatusFlag" + rowcount).val() == "d") {
//            return true;
//        } else {
//            if ($("#ddlFamily" + rowcount).val() == "النوع") {
//                DisplayMassage(" برجاء ادخال النوع", "خطأ", MessageType.Worning);
//                return false
//            }
//            else if ($("#ddlItem" + rowcount).val() == "الصنف") {
//                DisplayMassage(" برجاء ادخال الصنف", "خطأ", MessageType.Worning);
//                return false
//            }
//            else if ($("#ddlItem" + rowcount).val() == "null") {
//                DisplayMassage(" برجاء ادخال الصنف", "خطأ", MessageType.Worning);
//                return false
//            }
//            else if ($("#txtQuantity" + rowcount).val() == "") {
//                DisplayMassage(" برجاء ادخال الكمية", "خطأ", MessageType.Worning);
//                return false
//            }
//            else if ($("#txtPrice" + rowcount).val() == "") {
//                DisplayMassage(" برجاء ادخال السعر", "خطأ", MessageType.Worning);
//                return false
//            }
//            return true;
//        }
//        //|| $("#ddlItem" + rowcount).val() == null
//        //$("#ddlItem" + rowcount).val() == "null" ||
//    }
//    function checkRepeatedItems(itemValue: number, familyValue: number,NumberRowid: number) {
//        var items: number = Number(CountGrid);
//        var flag = false;
//        for (let i = 0; i < items - 1; i++) {
//            if (NumberRowid.toString() != "") {
//                if (Number($("#ddlItem" + i).val()) == itemValue && Number($("#ddlFamily" + i).val()) == familyValue && Number($("#InvoiceItemID" + i).val()) != NumberRowid) {
//                    flag = true;
//                }
//            }
//            else {
//                if (Number($("#ddlItem" + i).val()) == itemValue && Number($("#ddlFamily" + i).val()) == familyValue) {
//                    flag = true;
//                }
//            }
//        }
//        return flag;
//    }
//    function GetVatPercentage() {
//        ////debugger
//        Ajax.Callsync({
//            type: "Get",
//            url: sys.apiUrl("GenVatType", "GetVatPercentage"),
//            data: {
//                CompCode: compcode, VatType: vatType, Type: 1, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
//            },
//            success: (d) => {
//                let result = d as BaseResponse;
//                if (result.IsSuccess) {
//                    AD_VatTypeDetails = result.Response as A_D_VAT_TYPE;
//                    VatPrc = AD_VatTypeDetails.VatPerc;
//                }
//            }
//        });
//    }
//    //------------------------------------------------------Poup_Pass------------------------
//    function Open_poup_Pass() {
//        $('#popu_Passowrd').attr('style', 'display:block;');
//        $('#popu_Passowrd').attr('class', 'popu animated zoomInLeft');
//        txt_ApprovePass.value = "";
//        $("#Popup_Passowrd").modal("show");
//        var Ul_List = document.getElementById('Ul_List_MinUnitPrice');
//        Ul_List.innerHTML = '';
//        for (var i = 0; i < List_MinUnitPrice.length; i++) {
//            var li_List_MinUnitPrice = document.createElement('li');
//            li_List_MinUnitPrice.setAttribute('id', 'li_List_MinUnitPrice' + i);
//            li_List_MinUnitPrice.setAttribute('class', 'st_border_li_List_MinUnitPrice');
//            Ul_List.appendChild(li_List_MinUnitPrice);
//            var id_List = document.getElementById('li_List_MinUnitPrice' + i);
//            id_List.innerHTML = '-( ' + List_MinUnitPrice[i].Name_Item + ' ) السعر (' + List_MinUnitPrice[i].Unitprice + ') الحد (0' + List_MinUnitPrice[i].MinUnitPrice + '0)';
//        }
//    }
//    //function btn_Approveprice_onclick() {
//    //    //debugger;
//    //    if (Men_Sales_2.getAttribute('style') == 'display: none;') {
//    //        if (txt_ApprovePass.value == SysSession.CurrentEnvironment.I_Control[0].ExceedMinPricePassword) {
//    //            Insert();
//    //            $('#popu_Passowrd').attr('style', 'display:none;');
//    //            $('#popu_Passowrd').attr('class', 'popu animated zoomOut');
//    //            txt_ApprovePass.value = "";
//    //            $("#Popup_Passowrd").modal("hide");
//    //            $('#condtionbtn1').removeClass("col-lg-10");
//    //            $('#condtionbtn1').addClass("col-lg-8");
//    //            $('#condtionbtn2').removeClass("col-lg-2");
//    //            $('#condtionbtn2').addClass("col-lg-4");
//    //            $('#btnPrint').removeClass("display_none");
//    //            $('#btnPrntPrice').removeClass("display_none");
//    //            clear();
//    //        }
//    //        else {
//    //            MessageBox.Show("لايمكن اعتماد الفاتورة", "خطأ");
//    //            txt_ApprovePass.value = "";
//    //        }
//    //    }
//    //    else {
//    //        if (txt_ApprovePass.value == SysSession.CurrentEnvironment.I_Control[0].ExceedMinPricePassword) {
//    //            Insert_Basket();
//    //            Remove_Item_in_Basket();
//    //            ValidationMinUnitPrice = 0;
//    //            Validation_Insert = 0;
//    //            txtCommission_Basket.value = "0";
//    //            $('#popu_Passowrd').attr('style', 'display:none;');
//    //            $('#popu_Passowrd').attr('class', 'popu animated zoomOut');
//    //            txt_ApprovePass.value = "";
//    //            $("#Popup_Passowrd").modal("hide");
//    //            btnChanege_onclick();
//    //            $('#condtionbtn1').removeClass("col-lg-10");
//    //            $('#condtionbtn1').addClass("col-lg-8");
//    //            $('#condtionbtn2').removeClass("col-lg-2");
//    //            $('#condtionbtn2').addClass("col-lg-4");
//    //            $('#btnPrint').removeClass("display_none");
//    //            $('#btnPrntPrice').removeClass("display_none");
//    //            clear();
//    //        }
//    //        else {
//    //            MessageBox.Show("لايمكن اعتماد الفاتورة", "خطأ");
//    //            txt_ApprovePass.value = "";
//    //        }
//    //    }
//    //}
//    //function btn_Exit_Approveprice_onclick() {
//    //    $('#popu_Passowrd').attr('style', 'display:none;');
//    //    $('#popu_Passowrd').attr('class', 'popu animated zoomOut');
//    //    txt_ApprovePass.value = "";
//    //    $("#Popup_Passowrd").modal("hide");
//    //    Validation_Insert = 0;
//    //}
//}
//# sourceMappingURL=ProcSalesInvoice.js.map