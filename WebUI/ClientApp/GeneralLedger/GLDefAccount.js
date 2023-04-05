$(document).ready(function () {
    GLDefAccount.InitalizeComponent();
});
var GLDefAccount;
(function (GLDefAccount) {
    var sys = new SystemTools();
    var SysSession = GetSystemSession(Modules.GLDefAccount);
    var compcode; //SharedSession.CurrentEnvironment.CompCode;
    var Details_ACCOUNT = new Array();
    var DetAccLst = new Array();
    var Details = new Array();
    var Singl_Details = new A_ACCOUNT_AND_YEAR();
    var DetAccLsts = new Array();
    var AQ_AccList = new AQ_GetAccount();
    var AccList = new A_ACCOUNT();
    var AccList_YEAR = new A_ACCOUNT_YEAR();
    var Details_GCodes = new Array();
    var DetGCod = new Array();
    var ACCDTTypes = new Array();
    var btnDelete;
    var btnEdit;
    var btnAdd;
    var btnsave;
    var btnback;
    var Refrash;
    var txt_Search;
    var Name_Acc;
    var txt_ACC_CODE;
    var txt_NAME_A;
    var txt_NAME_E;
    //var txtCCDT_Type: HTMLSelectElement;
    var txt_Type;
    var txt_CreditLimit;
    var txt_note;
    var txt_Openbalance;
    var txt_Debit;
    var txt_DebitFC;
    var txt_balance;
    var txt_level;
    var chkeck_active;
    var chkeck_Detailed;
    var txtCreatedBy;
    var txtCreatedAt;
    var txtUpdatedBy;
    var txtUpdatedAt;
    var NodeParent;
    var Success;
    var NAME = "";
    var StatusFlag;
    var ACC_CODE;
    var id_ul = 'menu-group-1';
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);
    function InitalizeComponent() {
        $("body").addClass("sidebar-icon-only");
        $('#cont').toggleClass('colapsdivcont');
        //$('#sidebar').toggleClass('active');
        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            $("body").toggleClass("mini-navbar_Arbec");
        }
        else {
            $("body").toggleClass("mini-navbar");
        }
        ;
        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = "الحسابات";
        }
        else {
            document.getElementById('Screen_name').innerHTML = "Accounts";
        }
        $('#divIconbar').addClass("display_none");
        $('#icon-bar').addClass("display_none");
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        InitalizeControls();
        InitalizeEvents();
        GetAll_Account();
        Display_GCodes();
        Display();
        //FillddlA_CCDT_Types();
        //if (SysSession.CurrentEnvironment.I_Control.GL_VoucherCCDT_Type != 1) {
        //    $("#txtCCDT_Type").addClass("display_none");
        //    $("#LabelCCDT_Type").addClass("display_none");
        //}
        OnClick_TreeData();
    }
    GLDefAccount.InitalizeComponent = InitalizeComponent;
    function InitalizeControls() {
        //--- Print Buttons
        ////// ;
        btnDelete = document.getElementById("btnDelete");
        btnEdit = document.getElementById("btnedite");
        btnAdd = document.getElementById("btnadd");
        btnsave = document.getElementById("btnsave");
        btnback = document.getElementById("btnback");
        Refrash = document.getElementById("Refrash");
        //textBoxes
        Name_Acc = document.getElementById("Name_Acc");
        txt_Search = document.getElementById("txt_Search");
        txt_ACC_CODE = document.getElementById("txt_ACC_CODE");
        txt_NAME_A = document.getElementById("txt_NAME_A");
        txt_NAME_E = document.getElementById("txt_NAME_E");
        txt_Type = document.getElementById("txt_Type");
        //txtCCDT_Type = document.getElementById("txtCCDT_Type") as HTMLSelectElement;
        txt_note = document.getElementById("txt_note");
        txt_level = document.getElementById("txt_level");
        txt_Debit = document.getElementById("txt_Debit");
        txt_DebitFC = document.getElementById("txt_DebitFC");
        txt_Openbalance = document.getElementById("txt_Openbalance");
        txt_CreditLimit = document.getElementById("txt_CreditLimit");
        txt_balance = document.getElementById("txt_balance");
        chkeck_active = document.getElementById("chkeck_active");
        chkeck_Detailed = document.getElementById("chkeck_Detailed");
        txtCreatedBy = document.getElementById("txtCreatedBy");
        txtCreatedAt = document.getElementById("txtCreatedAt");
        txtUpdatedBy = document.getElementById("txtUpdatedBy");
        txtUpdatedAt = document.getElementById("txtUpdatedAt");
    }
    function InitalizeEvents() {
        //// 
        for (var i = 0; i < 100; i++) {
            if ($("#txt_StatusFlag" + i).val() != "d" && $("#txt_StatusFlag" + i).val() != "m") {
                try {
                    $("#txt_StatusFlag" + i).val('i');
                }
                catch (e) {
                    continue;
                }
            }
        }
        btnDelete.onclick = btnDelete_onclick;
        btnAdd.onclick = btnAdd_onclick;
        btnsave.onclick = btnsave_onClick;
        btnback.onclick = btnback_onclick;
        btnEdit.onclick = btnEdit_onclick;
        Refrash.onclick = Refrash_onclick;
        txt_Search.onchange = txt_Search_onkeyup;
        //txt_Openbalance.onkeyup = balance_onchange;
        //txt_Cust_Type.onchange = txt_Cust_Type_onchange;
    }
    function OnClick_TreeData() {
        $('span').on('click', function () {
            //let ul = $(this).attr("href");
            //alert($('' + ul + '').attr("class"))
            debugger;
            var expanded = $(this).attr("aria-expanded");
            if (expanded == 'false') {
                $(this).attr("aria-expanded", "true");
                $(this).attr("class", "sign");
                var data_i = $(this).attr("data_i");
                var ul = $(this).attr("href");
                //alert($('' + ul + '').attr("class"))
                $('#' + data_i + '').attr("class", "fas fa-minus-circle");
                $('' + ul + '').attr("class", "children nav-child unstyled small ---");
                $('' + ul + '').attr("aria-expanded", "true");
                $('' + ul + '').attr("style", "");
                var node = $(this).attr("node");
                click_in_labl(node);
            }
            if (expanded == 'true') {
                $(this).attr("aria-expanded", "false");
                $(this).attr("class", "sign");
                var data_i = $(this).attr("data_i");
                var ul = $(this).attr("href");
                $('#' + data_i + '').attr("class", "fas fa-plus-circle");
                $('' + ul + '').attr("class", "children nav-child unstyled small collapse in");
                $('' + ul + '').attr("aria-expanded", "false");
                $('' + ul + '').attr("style", "height: 0px;");
                var node = $(this).attr("node");
                click_in_labl(node);
            }
        });
    }
    function txt_Search_onkeyup() {
        $('#menu-group-1').html('');
        if (txt_Search.value.trim() == '') {
            Display();
            OnClick_TreeData();
        }
        else {
            Displayfilter();
            OnClick_TreeData();
        }
    }
    function Refrash_onclick() {
        txt_Search.value = '';
        $('#menu-group-1').html('');
        GetAll_Account();
        Display();
        Display_GCodes();
        btnDelete.disabled = true;
        btnEdit.disabled = true;
        btnAdd.disabled = true;
        OnClick_TreeData();
    }
    function Display_GCodes() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GCodes", "GetAll_GCodes"),
            data: {
                UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    Details_GCodes = result.Response;
                }
            }
        });
    }
    function FillddlA_CCDT_Types() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("AccDtTypes", "GetAll"),
            data: {
                UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token, CompCode: compcode
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    ACCDTTypes = result.Response;
                    //DocumentActions.FillCombowithdefult(ACCDTTypes, txtCCDT_Type, "CCDT_TYPE", (lang == "ar" ? "DescA" : "DescE"), (lang == "ar" ? "اختر  نوع المركز" : " Center Type"));
                }
            }
        });
    }
    function Displayfilter() {
        debugger;
        DetAccLst = new Array();
        var desc = "";
        var Det = 0;
        var MaxLevel = 10;
        for (var l = 1; l < MaxLevel; l++) {
            DetAccLst = Details_ACCOUNT.filter(function (x) { return x.ACC_LEVEL == l; });
            for (var i = 0; i < DetAccLst.length; i++) {
                desc = SysSession.CurrentEnvironment.ScreenLanguage == "ar" ? DetAccLst[i].ACC_DESCA : DetAccLst[i].ACC_DESCL;
                Det = DetAccLst[i].DETAIL == true ? 1 : 0;
                Biuld_TreeOpen(DetAccLst[i].ACC_CODE, desc, DetAccLst[i].PARENT_ACC, Det, DetAccLst[i].ACC_LEVEL, DetAccLst[i]);
            }
        }
        debugger;
        if (l != 1) {
            var search_1 = txt_Search.value.toLowerCase();
            DetAccLst = Details_ACCOUNT.filter(function (x) { return x.ACC_CODE.toString().search(search_1) >= 0 || x.ACC_DESCA.toLowerCase().search(search_1) >= 0; });
        }
        $('#a_' + DetAccLst[0].ACC_CODE + '').focus();
        click_in_Focus(DetAccLst[0].ACC_CODE);
    }
    function Biuld_TreeOpen(Node, NodeName, NodeParent, Detail, LVL, DetAccList) {
        var class_Plus;
        var style_Plus = '';
        //if (NodeParent == null) {
        //    NodeParent = ""; 
        //} else {
        //    NodeParent = NodeParent;
        //}
        //if (Node == null) {
        //    Node = ""; 
        //} else {
        //    Node = Node;
        //}
        //if (NodeName == null) {
        //    NodeName = ""; 
        //} else {
        //    NodeName = NodeName;
        //} 
        if (LVL == 1) {
            id_ul = 'menu-group-1';
        }
        else {
            id_ul = 'sub-item-' + NodeParent;
        }
        if (Detail == 0) {
            class_Plus = 'fas fa-minus-circle fs-6';
        }
        else {
            class_Plus = 'fa-minus-circle fs-6';
            //  class_Plus = 'glyphicon-plusicon-white';
            style_Plus = 'height: 1rem;width:1rem; background-color: var(--dark-blue); border-radius:50%; margin:auto; margin-right: 5px;';
        }
        //---------------------------------------------------------li---------------------
        var li_1 = document.createElement('li');
        li_1.setAttribute('id', 'li_' + Node);
        li_1.setAttribute('class', 'item-' + Node + ' deeper parent');
        try {
            document.getElementById(id_ul).appendChild(li_1);
        }
        catch (e) {
            alert(Node);
        }
        //------------------------------------------------------------------------------
        //---------------------------------------------------------a---------------------
        var a_1 = document.createElement('a'); // a 
        a_1.setAttribute('id', 'a_' + Node);
        a_1.setAttribute('href', '#');
        try {
            document.getElementById('li_' + Node).appendChild(a_1);
        }
        catch (e) {
            alert(Node);
        }
        var span_1 = document.createElement('span'); // span زرار الفتح +
        span_1.setAttribute('id', 'span_1' + Node);
        span_1.setAttribute('data-toggle', 'collapse');
        span_1.setAttribute('data-parent', '#' + id_ul + '');
        span_1.setAttribute('href', '#sub-item-' + Node);
        span_1.setAttribute('class', 'sign collapsed');
        span_1.setAttribute('aria-expanded', 'true');
        span_1.setAttribute('Data_I', 'i_' + Node);
        span_1.setAttribute('Node', Node);
        span_1.setAttribute('style', style_Plus);
        try {
            document.getElementById('a_' + Node).appendChild(span_1);
        }
        catch (e) {
            alert(Node);
        }
        if (style_Plus == '') {
            var i_1 = document.createElement('i'); //icon +
            i_1.setAttribute('id', 'i_' + Node);
            i_1.setAttribute('class', class_Plus);
            document.getElementById('span_1' + Node).appendChild(i_1);
        }
        var span_2 = document.createElement('span'); // النص text in li
        span_2.setAttribute('id', Node);
        span_2.setAttribute('class', 'lbl');
        span_2.setAttribute('data-detail', Detail.toString());
        span_2.setAttribute('data-ACC_CODE', DetAccList.ACC_CODE);
        span_2.setAttribute('data-NAME_A', DetAccList.ACC_DESCA);
        span_2.setAttribute('data-NAME_E', DetAccList.ACC_DESCL);
        //span_2.setAttribute('data-CCDT_Type', DetAccList.CCDT_TYPE == null ? null : DetAccList.CCDT_TYPE.toString());
        span_2.setAttribute('data-ACC_TYPE', DetAccList.ACC_TYPE == null ? null : DetAccList.ACC_TYPE.toString());
        span_2.setAttribute('data-ACC_GROUP', DetAccList.ACC_GROUP == null ? null : DetAccList.ACC_GROUP.toString());
        span_2.setAttribute('data-REMARKS', DetAccList.REMARKS);
        span_2.setAttribute('data-level', DetAccList.ACC_LEVEL.toString());
        span_2.setAttribute('data-Debit', DetAccList.DEBIT.toString());
        span_2.setAttribute('data-DebitFC', DetAccList.CREDIT.toString());
        span_2.setAttribute('data-Openbalance', DetAccList.OPENING_BALANCE.toString());
        span_2.setAttribute('data-ACTIVE', DetAccList.ACC_ACTIVE.toString());
        span_2.setAttribute('data-NodeParent', DetAccList.PARENT_ACC = null ? '' : DetAccList.PARENT_ACC);
        span_2.setAttribute('data-CreditLimit', DetAccList.ACC_LIMIT == null ? '0' : DetAccList.ACC_LIMIT.toString());
        span_2.setAttribute('data-balance', '0');
        span_2.setAttribute('data-CreatedBy', DetAccList.CREATED_BY == null ? ' ' : DetAccList.CREATED_BY.toString());
        span_2.setAttribute('data-CreatedAt', DetAccList.CREATED_AT == null ? ' ' : DetAccList.CREATED_AT.toString());
        span_2.setAttribute('data-UpdatedBy', DetAccList.UPDATED_BY == null ? ' ' : DetAccList.UPDATED_BY.toString());
        span_2.setAttribute('data-UpdatedAt', DetAccList.LAST_UPDATE == null ? ' ' : DetAccList.LAST_UPDATE.toString());
        document.getElementById('a_' + Node).appendChild(span_2);
        document.getElementById(Node).innerHTML = "" + NodeName + " ( " + Node + " )";
        try {
            //$('#' + Node + '').click(click_in_labl);
            $("#" + Node + "").on('click', function () {
                click_in_labl(Node);
            });
        }
        catch (e) {
            alert(Node);
        }
        //------------------------------------------------------------------------------
        //---------------------------------------------------------ul---------------------
        var ul_1 = document.createElement('ul');
        ul_1.setAttribute('class', 'children nav-child unstyled small ---');
        ul_1.setAttribute('id', 'sub-item-' + Node);
        document.getElementById('li_' + Node).appendChild(ul_1);
        //------------------------------------------------------------------------------
    }
    function click_in_Focus(ACC_CODE) {
        ACC_CODE = $('#' + ACC_CODE + '').attr('data-ACC_CODE');
        DetAccLst = new Array();
        DetAccLst = Details_ACCOUNT.filter(function (x) { return x.ACC_CODE == $('#' + ACC_CODE + '').attr('data-NodeParent'); });
        // 
        if ($('#' + ACC_CODE + '').attr('data-NodeParent') == 'null' || $('#' + ACC_CODE + '').attr('data-NodeParent') == '0') {
            NAME = SysSession.CurrentEnvironment.ScreenLanguage == "ar" ? $('#' + ACC_CODE + '').attr('data-NAME_A') : $('#' + ACC_CODE + '').attr('data-NAME_E');
            Name_Acc.innerHTML = "" + NAME + " ( " + ACC_CODE + " )";
            Name_Acc.setAttribute('data-level', $('#' + ACC_CODE + '').attr('data-level'));
        }
        else {
            NAME = SysSession.CurrentEnvironment.ScreenLanguage == "ar" ? DetAccLst[0].ACC_DESCA : DetAccLst[0].ACC_DESCL;
            Name_Acc.innerHTML = "" + NAME + " ( " + $('#' + ACC_CODE + '').attr('data-NodeParent') + " )";
            Name_Acc.setAttribute('data-level', $('#' + ACC_CODE + '').attr('data-level'));
        }
        var ACC_TYPE = Number($('#' + ACC_CODE + '').attr('data-ACC_TYPE'));
        var ACC_GROUP = $('#' + ACC_CODE + '').attr('data-ACC_GROUP');
        Display_Type(ACC_TYPE, ACC_GROUP);
        txt_ACC_CODE.value = $('#' + ACC_CODE + '').attr('data-ACC_CODE');
        txt_NAME_A.value = $('#' + ACC_CODE + '').attr('data-NAME_A');
        txt_NAME_E.value = $('#' + ACC_CODE + '').attr('data-NAME_E');
        txt_note.value = $('#' + ACC_CODE + '').attr('data-REMARKS');
        txt_level.value = $('#' + ACC_CODE + '').attr('data-level');
        txt_Debit.value = $('#' + ACC_CODE + '').attr('data-Debit');
        txt_DebitFC.value = $('#' + ACC_CODE + '').attr('data-DebitFC');
        //txtCCDT_Type.value = $(this).attr('data-CCDT_Type');
        txt_Openbalance.value = $('#' + ACC_CODE + '').attr('data-Openbalance');
        txt_CreditLimit.value = $('#' + ACC_CODE + '').attr('data-CreditLimit');
        txt_balance.value = ((Number(txt_Openbalance.value) + Number(txt_Debit.value)) - Number(txt_DebitFC.value)).toString();
        chkeck_Detailed.checked = $('#' + ACC_CODE + '').attr('data-detail') == '1' ? true : false;
        chkeck_active.checked = $('#' + ACC_CODE + '').attr('data-ACTIVE') == 'true' ? true : false;
        txtCreatedBy.value = $('#' + ACC_CODE + '').attr('data-CreatedBy') == null ? '' : $('#' + ACC_CODE + '').attr('data-CreatedBy');
        txtCreatedAt.value = $('#' + ACC_CODE + '').attr('data-CreatedAt') == null ? '' : $('#' + ACC_CODE + '').attr('data-CreatedAt');
        txtUpdatedBy.value = $('#' + ACC_CODE + '').attr('data-UpdatedBy') == null ? '' : $('#' + ACC_CODE + '').attr('data-UpdatedBy');
        txtUpdatedAt.value = $('#' + ACC_CODE + '').attr('data-UpdatedAt') == null ? '' : $('#' + ACC_CODE + '').attr('data-UpdatedAt');
        $('#txt_Type').prop('value', $('#' + ACC_CODE + '').attr('data-acc_type') == '0' ? 'null' : $('#' + ACC_CODE + '').attr('data-acc_type'));
        btnDelete.disabled = false;
        btnEdit.disabled = false;
        btnAdd.disabled = false;
    }
    function GetAll_Account() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GLDefAccount", "GetAll_AQ_GetAccount"),
            data: {
                CompCode: compcode, FIN_YEAR: SysSession.CurrentEnvironment.CurrentYear, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                //////// ;
                var result = d;
                if (result.IsSuccess) {
                    Details_ACCOUNT = result.Response;
                }
            }
        });
    }
    function Display() {
        DetAccLst = new Array();
        var desc = "";
        var Det = 0;
        var MaxLevel = 10;
        for (var l = 1; l < MaxLevel; l++) {
            DetAccLst = Details_ACCOUNT.filter(function (x) { return x.ACC_LEVEL == l; });
            for (var i = 0; i < DetAccLst.length; i++) {
                desc = SysSession.CurrentEnvironment.ScreenLanguage == "ar" ? DetAccLst[i].ACC_DESCA : DetAccLst[i].ACC_DESCL;
                Det = DetAccLst[i].DETAIL == true ? 1 : 0;
                Biuld_Tree(DetAccLst[i].ACC_CODE, desc, DetAccLst[i].PARENT_ACC, Det, DetAccLst[i].ACC_LEVEL, DetAccLst[i]);
            }
        }
    }
    function Biuld_Tree(Node, NodeName, NodeParent, Detail, LVL, DetAccList) {
        var class_Plus;
        var style_Plus = '';
        //if (NodeParent == null) {
        //    NodeParent = ""; 
        //} else {
        //    NodeParent = NodeParent;
        //}
        //if (Node == null) {
        //    Node = ""; 
        //} else {
        //    Node = Node;
        //}
        //if (NodeName == null) {
        //    NodeName = ""; 
        //} else {
        //    NodeName = NodeName;
        //} 
        if (LVL == 1) {
            id_ul = 'menu-group-1';
        }
        else {
            id_ul = 'sub-item-' + NodeParent;
        }
        if (Detail == 0) {
            class_Plus = 'fas fa-plus-circle fs-6';
        }
        else {
            class_Plus = 'fa-plus-circle fs-6';
            //  class_Plus = 'glyphicon-plusicon-white';
            style_Plus = 'height: 1rem;width:1rem; background-color: var(--dark-blue); border-radius:50%; margin:auto; margin-right: 5px;';
        }
        //---------------------------------------------------------li---------------------
        var li_1 = document.createElement('li');
        li_1.setAttribute('id', 'li_' + Node);
        li_1.setAttribute('class', 'item-' + Node + ' deeper parent');
        try {
            document.getElementById(id_ul).appendChild(li_1);
        }
        catch (e) {
            alert(Node);
        }
        //------------------------------------------------------------------------------
        //---------------------------------------------------------a---------------------
        var a_1 = document.createElement('a'); // a 
        a_1.setAttribute('id', 'a_' + Node);
        a_1.setAttribute('href', '#');
        try {
            document.getElementById('li_' + Node).appendChild(a_1);
        }
        catch (e) {
            alert(Node);
        }
        var span_1 = document.createElement('span'); // span زرار الفتح +
        span_1.setAttribute('id', 'span_1' + Node);
        span_1.setAttribute('data-toggle', 'collapse');
        span_1.setAttribute('data-parent', '#' + id_ul + '');
        span_1.setAttribute('href', '#sub-item-' + Node);
        span_1.setAttribute('class', 'sign collapsed');
        span_1.setAttribute('aria-expanded', 'false');
        span_1.setAttribute('Data_I', 'i_' + Node);
        span_1.setAttribute('Node', Node);
        span_1.setAttribute('style', style_Plus);
        try {
            document.getElementById('a_' + Node).appendChild(span_1);
        }
        catch (e) {
            alert(Node);
        }
        if (style_Plus == '') {
            var i_1 = document.createElement('i'); //icon +
            i_1.setAttribute('id', 'i_' + Node);
            i_1.setAttribute('class', class_Plus);
            document.getElementById('span_1' + Node).appendChild(i_1);
        }
        var span_2 = document.createElement('span'); // النص text in li
        span_2.setAttribute('id', Node);
        span_2.setAttribute('class', 'lbl');
        span_2.setAttribute('data-detail', Detail.toString());
        span_2.setAttribute('data-ACC_CODE', DetAccList.ACC_CODE);
        span_2.setAttribute('data-NAME_A', DetAccList.ACC_DESCA);
        span_2.setAttribute('data-NAME_E', DetAccList.ACC_DESCL);
        //span_2.setAttribute('data-CCDT_Type', DetAccList.CCDT_TYPE == null ? null : DetAccList.CCDT_TYPE.toString());
        span_2.setAttribute('data-ACC_TYPE', DetAccList.ACC_TYPE == null ? null : DetAccList.ACC_TYPE.toString());
        span_2.setAttribute('data-ACC_GROUP', DetAccList.ACC_GROUP == null ? null : DetAccList.ACC_GROUP.toString());
        span_2.setAttribute('data-REMARKS', DetAccList.REMARKS);
        span_2.setAttribute('data-level', DetAccList.ACC_LEVEL.toString());
        span_2.setAttribute('data-Debit', DetAccList.DEBIT.toString());
        span_2.setAttribute('data-DebitFC', DetAccList.CREDIT.toString());
        span_2.setAttribute('data-Openbalance', DetAccList.OPENING_BALANCE.toString());
        span_2.setAttribute('data-ACTIVE', DetAccList.ACC_ACTIVE.toString());
        span_2.setAttribute('data-NodeParent', DetAccList.PARENT_ACC = null ? '' : DetAccList.PARENT_ACC);
        span_2.setAttribute('data-CreditLimit', DetAccList.ACC_LIMIT == null ? '0' : DetAccList.ACC_LIMIT.toString());
        span_2.setAttribute('data-balance', '0');
        span_2.setAttribute('data-CreatedBy', DetAccList.CREATED_BY == null ? ' ' : DetAccList.CREATED_BY.toString());
        span_2.setAttribute('data-CreatedAt', DetAccList.CREATED_AT == null ? ' ' : DetAccList.CREATED_AT.toString());
        span_2.setAttribute('data-UpdatedBy', DetAccList.UPDATED_BY == null ? ' ' : DetAccList.UPDATED_BY.toString());
        span_2.setAttribute('data-UpdatedAt', DetAccList.LAST_UPDATE == null ? ' ' : DetAccList.LAST_UPDATE.toString());
        document.getElementById('a_' + Node).appendChild(span_2);
        try {
            document.getElementById(Node).innerHTML = "" + NodeName + " ( " + Node + " )";
        }
        catch (e) {
            alert(Node);
        }
        try {
            //$('#' + Node + '').click(click_in_labl);
            $("#" + Node + "").on('click', function () {
                click_in_labl(Node);
            });
        }
        catch (e) {
            alert(Node);
        }
        //------------------------------------------------------------------------------
        //---------------------------------------------------------ul---------------------
        var ul_1 = document.createElement('ul');
        ul_1.setAttribute('class', 'children nav-child unstyled small collapse');
        ul_1.setAttribute('id', 'sub-item-' + Node);
        document.getElementById('li_' + Node).appendChild(ul_1);
        //------------------------------------------------------------------------------
    }
    function click_in_labl(Node) {
        debugger;
        ACC_CODE = $('#' + Node + '').attr('data-ACC_CODE');
        DetAccLst = new Array();
        DetAccLst = Details_ACCOUNT.filter(function (x) { return x.ACC_CODE == $('#' + Node + '').attr('data-NodeParent'); });
        // 
        if ($('#' + Node + '').attr('data-NodeParent') == 'null' || $('#' + Node + '').attr('data-NodeParent') == '0') {
            NAME = SysSession.CurrentEnvironment.ScreenLanguage == "ar" ? $('#' + Node + '').attr('data-NAME_A') : $('#' + Node + '').attr('data-NAME_E');
            Name_Acc.innerHTML = "" + NAME + " ( " + ACC_CODE + " )";
            Name_Acc.setAttribute('data-level', $('#' + Node + '').attr('data-level'));
        }
        else {
            NAME = SysSession.CurrentEnvironment.ScreenLanguage == "ar" ? DetAccLst[0].ACC_DESCA : DetAccLst[0].ACC_DESCL;
            Name_Acc.innerHTML = "" + NAME + " ( " + $('#' + Node + '').attr('data-NodeParent') + " )";
            Name_Acc.setAttribute('data-level', $('#' + Node + '').attr('data-level'));
        }
        var ACC_TYPE = Number($('#' + Node + '').attr('data-ACC_TYPE'));
        var ACC_GROUP = $('#' + Node + '').attr('data-ACC_GROUP');
        Display_Type(ACC_TYPE, ACC_GROUP);
        txt_ACC_CODE.value = $('#' + Node + '').attr('data-ACC_CODE');
        txt_NAME_A.value = $('#' + Node + '').attr('data-NAME_A');
        txt_NAME_E.value = $('#' + Node + '').attr('data-NAME_E');
        txt_note.value = $('#' + Node + '').attr('data-REMARKS');
        txt_level.value = $('#' + Node + '').attr('data-level');
        txt_Debit.value = $('#' + Node + '').attr('data-Debit');
        txt_DebitFC.value = $('#' + Node + '').attr('data-DebitFC');
        //txtCCDT_Type.value = $('#' + Node + '').attr('data-CCDT_Type');
        txt_Openbalance.value = $('#' + Node + '').attr('data-Openbalance');
        txt_CreditLimit.value = $('#' + Node + '').attr('data-CreditLimit');
        txt_balance.value = ((Number(txt_Openbalance.value) + Number(txt_Debit.value)) - Number(txt_DebitFC.value)).toString();
        chkeck_Detailed.checked = $('#' + Node + '').attr('data-detail') == '1' ? true : false;
        chkeck_active.checked = $('#' + Node + '').attr('data-ACTIVE') == 'true' ? true : false;
        txtCreatedBy.value = $('#' + Node + '').attr('data-CreatedBy') == null ? '' : $('#' + Node + '').attr('data-CreatedBy');
        txtCreatedAt.value = $('#' + Node + '').attr('data-CreatedAt') == null ? '' : $('#' + Node + '').attr('data-CreatedAt');
        txtUpdatedBy.value = $('#' + Node + '').attr('data-UpdatedBy') == null ? '' : $('#' + Node + '').attr('data-UpdatedBy');
        txtUpdatedAt.value = $('#' + Node + '').attr('data-UpdatedAt') == null ? '' : $('#' + Node + '').attr('data-UpdatedAt');
        $('#txt_Type').prop('value', $('#' + Node + '').attr('data-acc_type') == '0' ? 'null' : $('#' + Node + '').attr('data-acc_type'));
        btnDelete.disabled = false;
        btnEdit.disabled = false;
        btnAdd.disabled = false;
    }
    function Bilud_data_txt() {
        // 
        DetAccLst = new Array();
        DetAccLst = Details_ACCOUNT.filter(function (x) { return x.ACC_CODE == ACC_CODE; });
        if (DetAccLst[0].PARENT_ACC == null || DetAccLst[0].PARENT_ACC == 'null' || DetAccLst[0].PARENT_ACC == '0') {
            var NAME_1 = "";
            NAME_1 = SysSession.CurrentEnvironment.ScreenLanguage == "ar" ? DetAccLst[0].ACC_DESCA : DetAccLst[0].ACC_DESCL;
            Name_Acc.innerHTML = "" + NAME_1 + " ( " + ACC_CODE + " )";
            Name_Acc.setAttribute('data-level', DetAccLst[0].ACC_LEVEL.toString());
        }
        else {
            DetAccLsts = new Array();
            DetAccLsts = Details_ACCOUNT.filter(function (x) { return x.ACC_CODE == DetAccLst[0].PARENT_ACC; });
            NAME = SysSession.CurrentEnvironment.ScreenLanguage == "ar" ? DetAccLsts[0].ACC_DESCA : DetAccLsts[0].ACC_DESCL;
            Name_Acc.innerHTML = "" + NAME + " ( " + DetAccLst[0].PARENT_ACC + " )";
            Name_Acc.setAttribute('data-level', DetAccLst[0].ACC_LEVEL.toString());
        }
        var ACC_TYPE = Number(DetAccLst[0].ACC_TYPE);
        var ACC_GROUP = DetAccLst[0].ACC_GROUP == null ? '0' : DetAccLst[0].ACC_GROUP.toString();
        Display_Type(ACC_TYPE, ACC_GROUP);
        txt_ACC_CODE.value = DetAccLst[0].ACC_CODE;
        txt_NAME_A.value = DetAccLst[0].ACC_DESCA;
        txt_NAME_E.value = DetAccLst[0].ACC_DESCL;
        //txtCCDT_Type.value = DetAccLst[0].CCDT_TYPE == null ? 'null' : DetAccLst[0].CCDT_TYPE;
        txt_note.value = DetAccLst[0].REMARKS;
        txt_level.value = DetAccLst[0].ACC_LEVEL.toString();
        txt_Debit.value = DetAccLst[0].DEBIT.toString();
        txt_DebitFC.value = DetAccLst[0].CREDIT.toString();
        txt_Openbalance.value = DetAccLst[0].OPENING_BALANCE.toString();
        txt_CreditLimit.value = DetAccLst[0].ACC_LIMIT == null ? '0' : DetAccLst[0].ACC_LIMIT.toString();
        txt_balance.value = ((Number(txt_Openbalance.value) + Number(txt_Debit.value)) - Number(txt_DebitFC.value)).toString();
        chkeck_Detailed.checked = DetAccLst[0].DETAIL;
        chkeck_active.checked = DetAccLst[0].ACC_ACTIVE;
        txtCreatedBy.value = DetAccLst[0].CREATED_BY == null ? ' ' : DetAccLst[0].CREATED_BY;
        txtCreatedAt.value = DetAccLst[0].CREATED_AT == null ? ' ' : DetAccLst[0].CREATED_AT;
        txtUpdatedBy.value = DetAccLst[0].UPDATED_BY == null ? ' ' : DetAccLst[0].UPDATED_BY;
        txtUpdatedAt.value = DetAccLst[0].LAST_UPDATE == null ? ' ' : DetAccLst[0].LAST_UPDATE;
        $('#txt_Type').prop('value', DetAccLst[0].ACC_TYPE == 0 ? 'null' : DetAccLst[0].ACC_TYPE);
    }
    function Display_Type(ACC_TYPE, ACC_GROUP) {
        DetGCod = Details_GCodes.filter(function (x) { return x.CodeType == 'AccType' && x.SubCode == ACC_GROUP; });
        //DetGCod = Details_GCodes.filter(x => x.CodeType == 'AccType' && x.CodeValue == ACC_TYPE && x.SubCode == ACC_GROUP);
        $('#txt_Type').html('');
        $('#txt_Type').append('<option value="null">' + (lang == "ar" ? "النوع" : "Type") + '</option>');
        for (var i = 0; i < DetGCod.length; i++) {
            $('#txt_Type').append('<option data-GROUP="' + ACC_GROUP + '" value="' + DetGCod[i].CodeValue + '">' + (lang == "ar" ? DetGCod[i].DescA : DetGCod[i].DescE) + '</option>');
        }
    }
    function add_ACCOUNT() {
        var NAME = "";
        NAME = SysSession.CurrentEnvironment.ScreenLanguage == "ar" ? txt_NAME_A.value : txt_NAME_E.value;
        NodeParent = Number(txt_level.value) == 1 ? null : ACC_CODE;
        Biuld_Tree(txt_ACC_CODE.value, NAME, NodeParent, 1, Number(txt_level.value), AQ_AccList);
        if (ACC_CODE != null) {
            // 
            if (document.getElementById('span_1' + ACC_CODE).innerHTML == '') {
                document.getElementById('span_1' + ACC_CODE).setAttribute('style', ' ');
                var i_1 = document.createElement('i'); //icon +
                i_1.setAttribute('id', 'i_' + ACC_CODE);
                i_1.setAttribute('class', 'fas fa-plus-circle fs-6');
                document.getElementById('span_1' + ACC_CODE).appendChild(i_1);
            }
            document.getElementById(ACC_CODE).setAttribute('data-detail', '0');
        }
        txtCreatedAt.value = DateTimeFormat(Date().toString());
        txtCreatedBy.value = SysSession.CurrentEnvironment.UserCode;
        txtUpdatedAt.value = '';
        txtUpdatedBy.value = '';
        //Name_Acc.innerHTML = "" + NAME + " ( " + txt_ACC_CODE.value + " ) ";
    }
    function update_ACCOUNT() {
        var NAME = "";
        NAME = SysSession.CurrentEnvironment.ScreenLanguage == "ar" ? txt_NAME_A.value : txt_NAME_E.value;
        var ACC_update = document.getElementById(ACC_CODE);
        ACC_update.innerHTML = "" + NAME + " ( " + txt_ACC_CODE.value + " )";
        // 
        ACC_update.setAttribute('data-ACC_CODE', txt_ACC_CODE.value);
        ACC_update.setAttribute('data-NAME_A', txt_NAME_A.value);
        ACC_update.setAttribute('data-NAME_E', txt_NAME_E.value);
        ACC_update.setAttribute('data-ACC_TYPE', txt_Type.value);
        //ACC_update.setAttribute('data-CCDT_Type', txtCCDT_Type.value);
        ACC_update.setAttribute('data-REMARKS', txt_note.value);
        ACC_update.setAttribute('data-level', txt_level.value);
        ACC_update.setAttribute('data-Debit', txt_Debit.value);
        ACC_update.setAttribute('data-DebitFC', txt_DebitFC.value);
        ACC_update.setAttribute('data-Openbalance', txt_Openbalance.value);
        ACC_update.setAttribute('data-detail', chkeck_Detailed.checked == true ? '1' : '0');
        ACC_update.setAttribute('data-ACTIVE', chkeck_active.checked == true ? 'true' : 'false');
        ACC_update.setAttribute('data-CreditLimit', txt_CreditLimit.value == null ? '0' : txt_CreditLimit.value);
        ACC_update.setAttribute('id', txt_ACC_CODE.value);
        ACC_update.setAttribute('data-CreatedBy', txtCreatedBy.value);
        ACC_update.setAttribute('data-CreatedAt', txtCreatedAt.value);
        ACC_update.setAttribute('data-UpdatedBy', SysSession.CurrentEnvironment.UserCode);
        ACC_update.setAttribute('data-UpdatedAt', DateTimeFormat(Date().toString()));
        txtUpdatedAt.value = DateTimeFormat(Date().toString());
        txtUpdatedBy.value = SysSession.CurrentEnvironment.UserCode;
        $('#li_' + ACC_CODE).attr('id', 'li_' + txt_ACC_CODE.value);
        $('#a_' + ACC_CODE).attr('id', 'a_' + txt_ACC_CODE.value);
        $('#span_1' + ACC_CODE).attr('href', '#sub-item-' + txt_ACC_CODE.value);
        $('#span_1' + ACC_CODE).attr('id', 'span_1' + txt_ACC_CODE.value);
        $('#i_' + ACC_CODE).attr('id', 'i_' + txt_ACC_CODE.value);
        $('#i_' + ACC_CODE).attr('id', 'i_' + txt_ACC_CODE.value);
        $('#sub-item-' + ACC_CODE).attr('id', 'sub-item-' + txt_ACC_CODE.value);
        //Name_Acc.innerHTML = "" + NAME + " ( " + txt_ACC_CODE.value + " )";
        ACC_CODE = txt_ACC_CODE.value;
    }
    function Delete_ACCOUNT() {
        if (txt_ACC_CODE.value != null) {
            // 
            DetAccLst = new Array();
            DetAccLst = Details_ACCOUNT.filter(function (x) { return x.ACC_CODE == txt_ACC_CODE.value; });
            var index = Details_ACCOUNT.indexOf(DetAccLst[0]);
            deleteRow(Details_ACCOUNT, index);
            //alert(index);
            //console.log(Details_ACCOUNT);
            var list = document.getElementById("sub-item-" + DetAccLst[0].PARENT_ACC);
            if (list.childNodes.length == 1) // تغير icon 
             {
                var item = document.getElementById('li_' + txt_ACC_CODE.value);
                item.parentNode.removeChild(item);
                document.getElementById('span_1' + DetAccLst[0].PARENT_ACC).setAttribute('style', 'height: 18px;width: 21px;');
                var icon = document.getElementById('i_' + DetAccLst[0].PARENT_ACC);
                icon.parentNode.removeChild(icon);
                document.getElementById(DetAccLst[0].PARENT_ACC).setAttribute('data-detail', '1');
            }
            else {
                var item = document.getElementById('li_' + txt_ACC_CODE.value);
                item.parentNode.removeChild(item);
            }
        }
    }
    function deleteRow(arr, row) {
        delete arr[row];
        return arr;
    }
    function btnAdd_onclick() {
        if (!SysSession.CurrentPrivileges.AddNew)
            return;
        if (Name_Acc.innerHTML == '') {
            DisplayMassage(" برجاء أختيار مستوي!", "Please choose a level!", MessageType.Worning);
        }
        else {
            if (Name_Acc.innerHTML == '') {
                txt_level.value = '1';
                Name_Acc.innerHTML = (lang == "ar" ? "اضافه في المستوي الاول " : "Added to the first level");
            }
            else {
                txt_level.value = (Number(Name_Acc.getAttribute('data-level')) + 1).toString();
                NAME = SysSession.CurrentEnvironment.ScreenLanguage == "ar" ? txt_NAME_A.value : txt_NAME_E.value;
                Name_Acc.innerHTML = (lang == "ar" ? "اضافه داخل " : "add inside") + NAME + " ( " + ACC_CODE + " ) ";
                try {
                    var x = Details_ACCOUNT.filter(function (x) { return x.PARENT_ACC == ACC_CODE; });
                }
                catch (e) {
                }
            }
            clear();
            RemoveDisabled();
            try {
                if (x.length > 0) {
                    txt_ACC_CODE.value = Sub_ACC_CODE(x[x.length - 1].ACC_CODE);
                }
                else {
                    txt_ACC_CODE.value = ACC_CODE + "01";
                }
            }
            catch (e) {
                txt_ACC_CODE.value = '';
            }
            $('#btnsave').removeClass("display_none");
            $('#btnback').removeClass("display_none");
            $('#left').addClass("disabledDiv");
            $('#' + ACC_CODE + '').addClass("ModAdd");
            btnAdd.disabled = true;
            btnDelete.disabled = true;
            btnEdit.disabled = true;
            StatusFlag = 'i';
        }
    }
    function Sub_ACC_CODE(ACC_CODE_Str) {
        var First_ACC_CODE = ACC_CODE_Str.substr(0, ACC_CODE_Str.length - 2);
        var Last_ACC_CODE = ACC_CODE_Str.substr(ACC_CODE_Str.length - 2, ACC_CODE_Str.length);
        if (Number(Last_ACC_CODE) >= 9) {
            Last_ACC_CODE = (Number(Last_ACC_CODE) + 1).toString();
        }
        else {
            Last_ACC_CODE = ('0' + (Number(Last_ACC_CODE) + 1)).toString();
        }
        var New_ACC_CODE = (First_ACC_CODE + Last_ACC_CODE);
        return New_ACC_CODE;
        //alert('New_ACC_CODE ' + New_ACC_CODE)
        //alert('Last_ACC_CODE ' + Last_ACC_CODE)
    }
    function btnEdit_onclick() {
        if (!SysSession.CurrentPrivileges.EDIT)
            return;
        if (Name_Acc.innerHTML == '') {
            DisplayMassage(" برجاء أختيار مستوي!", "Please choose a level!", MessageType.Worning);
        }
        else {
            RemoveDisabled();
            txt_ACC_CODE.disabled = true;
            $('#' + txt_ACC_CODE.value + '').addClass("ModEdit");
            $('#btnsave').removeClass("display_none");
            $('#btnback').removeClass("display_none");
            $('#left').addClass("disabledDiv");
            btnAdd.disabled = true;
            btnDelete.disabled = true;
            btnEdit.disabled = true;
            StatusFlag = 'u';
        }
    }
    function btnDelete_onclick() {
        if (!SysSession.CurrentPrivileges.Remove)
            return;
        if (Name_Acc.innerHTML == '') {
            DisplayMassage(" برجاء أختيار مستوي!", "Please choose a level!", MessageType.Worning);
        }
        else {
            if (chkeck_Detailed.checked == true) {
                if (!Check_Not()) {
                    DisplayMassage(" لا يمكنك الحذف لانه لديه رقم حركه!", "You cannot delete it because it has a movement number!", MessageType.Worning);
                    return;
                }
                else {
                    NAME = SysSession.CurrentEnvironment.ScreenLanguage == "ar" ? txt_NAME_A.value : txt_NAME_E.value;
                    ConfirmMessage("هل تريد الحذف؟ ( " + NAME + " )", "Do you want to delete?", "تحذير", "worning", function () {
                        StatusFlag = 'd';
                        Save_Delete();
                    });
                }
            }
            else {
                DisplayMassage(" لا يمكنك الحذف لانه لديه ابناء!", "You cannot delete because he has children!", MessageType.Worning);
            }
        }
    }
    function btnback_onclick() {
        if (StatusFlag == 'i') {
            Name_Acc.innerHTML = '';
        }
        $('#' + ACC_CODE + '').removeClass("ModAdd");
        $('#' + txt_ACC_CODE.value + '').removeClass("ModEdit");
        Bilud_data_txt();
        Disabled();
        btnAdd.disabled = false;
        btnDelete.disabled = false;
        btnEdit.disabled = false;
        $('#btnsave').addClass("display_none");
        $('#btnback').addClass("display_none");
        $('#left').removeClass("disabledDiv");
        Success = false;
    }
    function btnsave_onClick() {
        loading('btnsave');
        setTimeout(function () {
            finishSave('btnsave');
            if (!ValidationHeader())
                return;
            if (txt_NAME_E.value == "") {
                txt_NAME_E.value = txt_NAME_A.value;
            }
            if (txt_CreditLimit.value == "") {
                txt_CreditLimit.value = '0';
            }
            if (StatusFlag == 'i') {
                Save_Insert();
            }
            else if (StatusFlag == 'u') {
                Save_update();
            }
        }, 100);
    }
    function clear() {
        txt_ACC_CODE.value = '';
        txt_NAME_A.value = '';
        txt_NAME_E.value = '';
        txt_Type.value = 'null';
        //txtCCDT_Type.value = 'null';
        txt_note.value = '';
        //txt_level.value = '';
        txt_Debit.value = '';
        txt_DebitFC.value = '';
        txt_Openbalance.value = '';
        txt_CreditLimit.value = '';
        txt_balance.value = '';
        txtCreatedBy.value = '';
        txtCreatedAt.value = '';
        txtUpdatedBy.value = '';
        txtUpdatedAt.value = '';
        chkeck_Detailed.checked = true;
        chkeck_active.checked = true;
    }
    function RemoveDisabled() {
        txt_ACC_CODE.disabled = false;
        txt_NAME_A.disabled = false;
        txt_NAME_E.disabled = false;
        txt_Type.disabled = false;
        txt_note.disabled = false;
        txt_CreditLimit.disabled = false;
        chkeck_active.disabled = false;
        //txt_level.disabled = false;
        //txt_Debit.disabled = false;
        //txt_DebitFC.disabled = false;
        //txt_Openbalance.disabled = false;
        //txt_balance.disabled = false;
        //if (SysSession.CurrentEnvironment.I_Control.GL_VoucherCCDT_Type == 1 && chkeck_Detailed.checked == true) {
        //    //txtCCDT_Type.disabled = false; 
        //}
    }
    function Disabled() {
        txt_ACC_CODE.disabled = true;
        txt_NAME_A.disabled = true;
        txt_NAME_E.disabled = true;
        txt_Type.disabled = true;
        //txtCCDT_Type.disabled = true;
        txt_note.disabled = true;
        txt_level.disabled = true;
        txt_Debit.disabled = true;
        txt_DebitFC.disabled = true;
        txt_Openbalance.disabled = true;
        txt_CreditLimit.disabled = true;
        txt_balance.disabled = true;
        chkeck_active.disabled = true;
        chkeck_Detailed.disabled = true;
    }
    function ValidationHeader() {
        if (txt_ACC_CODE.value == "") {
            DisplayMassage("برجاء أدخل رقم الحساب! ", "Please enter account number !  ", MessageType.Worning);
            Errorinput(txt_ACC_CODE);
            return false;
        }
        else if (txt_NAME_A.value == "" && lang == "ar") {
            DisplayMassage("برجاء أدخل الاسم بالعربي! ", "Please enter arabic describtion !  ", MessageType.Worning);
            Errorinput(txt_NAME_A);
            return false;
        }
        else if (txt_NAME_E.value == "" && lang != "ar") {
            DisplayMassage("برجاء أدخل الاسم بالانجليزي! ", "Please enter english describtion !  ", MessageType.Worning);
            Errorinput(txt_NAME_E);
            return false;
        }
        else if (txt_Type.value == "null") {
            DisplayMassage("يجب اختيار النوع! ", "must choose type!  ", MessageType.Worning);
            Errorinput(txt_Type);
            return false;
        }
        return true;
    }
    function Assign() {
        AccList = new A_ACCOUNT();
        AccList_YEAR = new A_ACCOUNT_YEAR();
        AQ_AccList = new AQ_GetAccount();
        Singl_Details = new A_ACCOUNT_AND_YEAR();
        //Details = new Array<A_ACCOUNT_AND_YEAR>();
        Singl_Details.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
        Singl_Details.UserCode = SysSession.CurrentEnvironment.UserCode;
        AccList_YEAR.FIN_YEAR = Number(SysSession.CurrentEnvironment.CurrentYear);
        AccList_YEAR.COMP_CODE = Number(compcode);
        AccList.COMP_CODE = Number(compcode);
        if (StatusFlag == "i") {
            AccList.StatusFlag = StatusFlag.toString();
            AccList.ACC_CODE = txt_ACC_CODE.value;
            AccList.ACC_DESCA = txt_NAME_A.value;
            AccList.ACC_DESCL = txt_NAME_E.value;
            AccList.ACC_TYPE = txt_Type.value == "null" ? null : Number(txt_Type.value);
            //AccList.CCDT_TYPE = txtCCDT_Type.value == "null" ? null : txtCCDT_Type.value;
            AccList.ACC_GROUP = Number($('option:selected', txt_Type).attr('data-group') == null ? 0 : $('option:selected', txt_Type).attr('data-group'));
            AccList.ACC_LEVEL = Number(txt_level.value);
            AccList.ACC_ACTIVE = chkeck_active.checked;
            AccList.DETAIL = chkeck_Detailed.checked;
            AccList.PARENT_ACC = NodeParent == null ? 0 : NodeParent;
            AccList.CREATED_AT = DateTimeFormat(Date().toString());
            AccList.CREATED_BY = SysSession.CurrentEnvironment.UserCode;
            AccList_YEAR.ACC_CODE = txt_ACC_CODE.value;
            AccList_YEAR.DEBIT = Number(txt_Debit.value);
            AccList_YEAR.CREDIT = Number(txt_DebitFC.value);
            AccList_YEAR.OPENING_BALANCE = Number(txt_Openbalance.value);
            AccList_YEAR.ACC_LIMIT = Number(txt_CreditLimit.value);
            AccList_YEAR.REMARKS = txt_note.value;
            AQ_AccList.ACC_CODE = txt_ACC_CODE.value;
            AQ_AccList.ACC_DESCA = txt_NAME_A.value;
            AQ_AccList.ACC_DESCL = txt_NAME_E.value;
            AQ_AccList.ACC_TYPE = txt_Type.value == "null" ? null : Number(txt_Type.value);
            //AQ_AccList.CCDT_TYPE = txtCCDT_Type.value == "null" ? null : txtCCDT_Type.value; 
            AQ_AccList.ACC_GROUP = Number($('option:selected', txt_Type).attr('data-group') == null ? 0 : $('option:selected', txt_Type).attr('data-group'));
            AQ_AccList.REMARKS = txt_note.value;
            AQ_AccList.ACC_LEVEL = Number(txt_level.value);
            AQ_AccList.DEBIT = Number(txt_Debit.value);
            AQ_AccList.CREDIT = Number(txt_DebitFC.value);
            AQ_AccList.OPENING_BALANCE = Number(txt_Openbalance.value);
            AQ_AccList.ACC_LIMIT = Number(txt_CreditLimit.value);
            AQ_AccList.ACC_ACTIVE = chkeck_active.checked;
            AQ_AccList.DETAIL = chkeck_Detailed.checked;
            AQ_AccList.PARENT_ACC = NodeParent == null ? 0 : NodeParent;
            AQ_AccList.CREATED_AT = DateTimeFormat(Date().toString());
            AQ_AccList.CREATED_BY = SysSession.CurrentEnvironment.UserCode;
            Details_ACCOUNT.push(AQ_AccList);
            Singl_Details.A_ACCOUNT.push(AccList);
            Singl_Details.A_ACCOUNT_YEAR = AccList_YEAR;
            //Details.push(AccList);
        }
        if (StatusFlag == "u") {
            AccList.StatusFlag = StatusFlag.toString();
            AccList.ACC_CODE = txt_ACC_CODE.value;
            AccList.ACC_DESCA = txt_NAME_A.value;
            AccList.ACC_DESCL = txt_NAME_E.value;
            AccList.ACC_TYPE = txt_Type.value == "null" ? null : Number(txt_Type.value);
            //AccList.CCDT_TYPE = txtCCDT_Type.value == "null" ? null : txtCCDT_Type.value; 
            AccList.ACC_GROUP = Number($('option:selected', txt_Type).attr('data-group') == null ? 0 : $('option:selected', txt_Type).attr('data-group'));
            AccList.ACC_LEVEL = Number(txt_level.value);
            AccList.ACC_ACTIVE = chkeck_active.checked;
            AccList.DETAIL = chkeck_Detailed.checked;
            AccList.PARENT_ACC = NodeParent == null ? 0 : NodeParent;
            AccList.CREATED_AT = DateTimeFormat(Date().toString());
            AccList.CREATED_BY = SysSession.CurrentEnvironment.UserCode;
            AccList_YEAR.ACC_CODE = txt_ACC_CODE.value;
            AccList_YEAR.DEBIT = Number(txt_Debit.value);
            AccList_YEAR.CREDIT = Number(txt_DebitFC.value);
            AccList_YEAR.OPENING_BALANCE = Number(txt_Openbalance.value);
            AccList_YEAR.ACC_LIMIT = Number(txt_CreditLimit.value);
            AccList_YEAR.REMARKS = txt_note.value;
            AQ_AccList.ACC_CODE = txt_ACC_CODE.value;
            AQ_AccList.ACC_DESCA = txt_NAME_A.value;
            AQ_AccList.ACC_DESCL = txt_NAME_E.value;
            AQ_AccList.ACC_TYPE = txt_Type.value == null ? 0 : Number(txt_Type.value);
            //AQ_AccList.CCDT_TYPE = txtCCDT_Type.value == "null" ? null : txtCCDT_Type.value;  
            AQ_AccList.ACC_GROUP = Number($('option:selected', txt_Type).attr('data-group') == null ? 0 : $('option:selected', txt_Type).attr('data-group'));
            AQ_AccList.REMARKS = txt_note.value;
            AQ_AccList.ACC_LEVEL = Number(txt_level.value);
            AQ_AccList.DEBIT = Number(txt_Debit.value);
            AQ_AccList.CREDIT = Number(txt_DebitFC.value);
            AQ_AccList.OPENING_BALANCE = Number(txt_Openbalance.value);
            AQ_AccList.ACC_LIMIT = Number(txt_CreditLimit.value);
            AQ_AccList.ACC_ACTIVE = chkeck_active.checked;
            AQ_AccList.DETAIL = chkeck_Detailed.checked;
            AQ_AccList.PARENT_ACC = NodeParent == null ? 0 : NodeParent;
            AQ_AccList.CREATED_AT = DateTimeFormat(Date().toString());
            AQ_AccList.CREATED_BY = SysSession.CurrentEnvironment.UserCode;
            Details_ACCOUNT.push(AQ_AccList);
            Singl_Details.A_ACCOUNT.push(AccList);
            Singl_Details.A_ACCOUNT_YEAR = AccList_YEAR;
        }
        if (StatusFlag == "d") {
            if (txt_ACC_CODE.value != "") {
                AccList.StatusFlag = StatusFlag.toString();
                AccList.ACC_CODE = txt_ACC_CODE.value;
                AccList.PARENT_ACC = NodeParent;
                //Details.push(AccList);
                AccList_YEAR.ACC_CODE = txt_ACC_CODE.value;
                Singl_Details.A_ACCOUNT.push(AccList);
                Singl_Details.A_ACCOUNT_YEAR = AccList_YEAR;
            }
        }
        Singl_Details.Branch_Code = SysSession.CurrentEnvironment.BranchCode;
        Singl_Details.Comp_Code = SysSession.CurrentEnvironment.CompCode;
        Singl_Details.MODULE_CODE = Modules.GLDefAccount;
        Singl_Details.sec_FinYear = SysSession.CurrentEnvironment.CurrentYear;
    }
    function Insert() {
        $("#MessageBoxDialog").modal("hide");
        // 
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("GLDefAccount", "UpdateGenralAcclist"),
            data: JSON.stringify(Singl_Details),
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    DisplayMassage("  تم الحفظ بنجاح  ", "saved success", MessageType.Succeed);
                    //alert("تم الحفظ بنجاح");
                    Success = true;
                }
                else {
                    MessageBox.Show("خطأء", "خطأء");
                    Success = false;
                }
            }
        });
    }
    function Save_Insert() {
        DetAccLst = new Array();
        //DetAccLst = Details_ACCOUNT.filter(x => x.ACC_CODE == txt_ACC_CODE.value);
        if (ACC_CODEFoundBefore() == false) {
            DisplayMassage("لا يمكنك تكرار رقم الحساب!", "You cannot duplicate the account number!", MessageType.Worning);
            Errorinput(txt_ACC_CODE);
        }
        else {
            if (Number(txt_level.value) == 1) {
                ACC_CODE = null;
                NodeParent = Number(txt_level.value) == 1 ? null : ACC_CODE;
                Assign();
                Insert();
                if (Success == true) {
                    $('#' + ACC_CODE + '').removeClass("ModAdd");
                    add_ACCOUNT();
                    Disabled();
                    btnAdd.disabled = false;
                    btnDelete.disabled = false;
                    btnEdit.disabled = false;
                    $('#btnsave').addClass("display_none");
                    $('#btnback').addClass("display_none");
                    $('#left').removeClass("disabledDiv");
                    DisplayMassage("  تم الحفظ بنجاح  ", "saved success", MessageType.Succeed);
                    Success = false;
                }
            }
            else {
                if (ACC_CODE == null) {
                    DisplayMassage(" برجاء أختيار مستوي!", "Please choose a level!", MessageType.Worning);
                    Errorinput(txt_level);
                }
                else {
                    NodeParent = Number(txt_level.value) == 1 ? null : ACC_CODE;
                    Assign();
                    Insert();
                    if (Success == true) {
                        $('#' + ACC_CODE + '').removeClass("ModAdd");
                        add_ACCOUNT();
                        Disabled();
                        btnAdd.disabled = false;
                        btnDelete.disabled = false;
                        btnEdit.disabled = false;
                        $('#btnsave').addClass("display_none");
                        $('#btnback').addClass("display_none");
                        $('#left').removeClass("disabledDiv");
                        Name_Acc.innerHTML = "" + NAME + " ( " + ACC_CODE + " ) ";
                        Success = false;
                    }
                }
            }
        }
    }
    function Save_update() {
        DetAccLst = new Array();
        if (ACC_CODE != txt_ACC_CODE.value) {
            DetAccLst = Details_ACCOUNT.filter(function (x) { return x.ACC_CODE == txt_ACC_CODE.value; });
        }
        if (DetAccLst.length > 0) {
            DisplayMassage(" لا يمكنك تكرار رقم الحساب!", "You cannot duplicate the account number!", MessageType.Worning);
            Errorinput(txt_ACC_CODE);
        }
        else {
            if (ACC_CODE == null) {
                DisplayMassage(" برجاء أختيار مستوي!", "Please choose a level!", MessageType.Worning);
                Errorinput(txt_level);
            }
            else {
                DetAccLst = Details_ACCOUNT.filter(function (x) { return x.ACC_CODE == ACC_CODE; });
                NodeParent = Number(txt_level.value) == 1 ? null : DetAccLst[0].PARENT_ACC;
                Assign();
                Insert();
                if (Success == true) {
                    $('#' + txt_ACC_CODE.value + '').removeClass("ModEdit");
                    update_ACCOUNT();
                    Disabled();
                    btnAdd.disabled = false;
                    btnDelete.disabled = false;
                    btnEdit.disabled = false;
                    $('#btnsave').addClass("display_none");
                    $('#btnback').addClass("display_none");
                    $('#left').removeClass("disabledDiv");
                    DisplayMassage("  تم التعديل بنجاح  ", "saved success", MessageType.Succeed);
                    Success = false;
                }
            }
        }
    }
    function Save_Delete() {
        if (ACC_CODE == null) {
            MessageBox.Show('يجب اختيار المستوي ', '(Error)');
        }
        else {
            DetAccLst = Details_ACCOUNT.filter(function (x) { return x.ACC_CODE == ACC_CODE; });
            NodeParent = Number(txt_level.value) == 1 ? null : DetAccLst[0].PARENT_ACC;
            Assign();
            Insert();
            if (Success == true) {
                Delete_ACCOUNT();
                clear();
                Disabled();
                btnAdd.disabled = false;
                btnDelete.disabled = false;
                btnEdit.disabled = false;
                $('#btnsave').addClass("display_none");
                $('#btnback').addClass("display_none");
                $('#left').removeClass("disabledDiv");
                DisplayMassage("  تم الحذف بنجاح  ", "saved success", MessageType.Succeed);
                Success = false;
                Name_Acc.innerHTML = "";
                Name_Acc.setAttribute('data-level', '1');
            }
        }
    }
    function ACC_CODEFoundBefore() {
        var res = true;
        var code = txt_ACC_CODE.value;
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GLDefAccount", "CodeFounBefore"),
            data: {
                code: code, compCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.Response == 0) {
                    res = true;
                }
                else
                    res = false;
            }
        });
        return res;
    }
    function Check_Not() {
        // 
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("GLDefAccount", "Check_Not"),
            data: { CompCode: compcode, ACC_CODE: txt_ACC_CODE.value },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    var Check = result.Response;
                    if (Check == -1) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    return false;
                }
            }
        });
        return true;
    }
})(GLDefAccount || (GLDefAccount = {}));
//# sourceMappingURL=GLDefAccount.js.map