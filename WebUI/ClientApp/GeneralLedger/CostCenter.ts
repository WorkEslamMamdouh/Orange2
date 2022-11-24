
$(document).ready(() => {
    CostCenter.InitalizeComponent();
})

namespace CostCenter {

    var sys: SystemTools = new SystemTools();
    var SysSession: SystemSession = GetSystemSession(Modules.CostCenter);
    var compcode: Number;//SharedSession.CurrentEnvironment.CompCode;

    var Details_G_COST: Array<G_COST_CENTER> = new Array<G_COST_CENTER>();
    var Details: Array<G_COST_CENTER> = new Array<G_COST_CENTER>();
    var DetAccLst: Array<G_COST_CENTER> = new Array<G_COST_CENTER>();
    var DetAccLsts: Array<G_COST_CENTER> = new Array<G_COST_CENTER>();
    var AccList: G_COST_CENTER = new G_COST_CENTER();

    var btnDelete: HTMLButtonElement;
    var btnEdit: HTMLButtonElement;
    var btnAdd: HTMLButtonElement;
    var btnsave: HTMLButtonElement;
    var btnback: HTMLButtonElement;
    var Refrash: HTMLButtonElement;
    var Add_first_level: HTMLButtonElement;

    var Name_Acc: HTMLLabelElement;
    var txt_CC_CODE: HTMLInputElement;
    var txt_NAME_A: HTMLInputElement;
    var txt_NAME_E: HTMLInputElement;
    var LblAD: HTMLInputElement;

    var txt_note: HTMLInputElement;
    //var txt_TARGET: HTMLInputElement;

    var txt_level: HTMLInputElement;
    var chkeck_active: HTMLInputElement;
    var chkeck_Detailed: HTMLInputElement;

    var NodeParent;
    var Success;
    var NAME = "";
    var StatusFlag;
    var CC_CODE;
    var id_ul = 'menu-group-1';

    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);

    
    export function InitalizeComponent() {
        $("body").addClass("sidebar-icon-only");

        $('#cont').toggleClass('colapsdivcont');
        //$('#sidebar').toggleClass('active');
        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            $("body").toggleClass("mini-navbar_Arbec");
        }
        else {
            $("body").toggleClass("mini-navbar");
        }
        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = "  مركز التكلفة  ";

        } else {
            document.getElementById('Screen_name').innerHTML = "Cost Center";

        }
        $('#divIconbar').addClass("display_none");
        $('#icon-bar').addClass("display_none");
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        InitalizeControls();
        InitalizeEvents();
        GetAll_Account();
        Display();
        OnClick_Tree();
    }
    function InitalizeControls() {
        //--- Print Buttons

        btnDelete = document.getElementById("btnDelete") as HTMLButtonElement;
        btnEdit = document.getElementById("btnedite") as HTMLButtonElement;
        btnAdd = document.getElementById("btnadd") as HTMLButtonElement;
        btnsave = document.getElementById("btnsave") as HTMLButtonElement;
        btnback = document.getElementById("btnback") as HTMLButtonElement;
        Refrash = document.getElementById("Refrash") as HTMLButtonElement;
        Add_first_level = document.getElementById("Add_first_level") as HTMLButtonElement;
        LblAD = document.getElementById("LblAD") as HTMLInputElement;

        //textBoxes
        Name_Acc = document.getElementById("Name_Acc") as HTMLLabelElement;
        txt_CC_CODE = document.getElementById("txt_CC_CODE") as HTMLInputElement;
        txt_NAME_A = document.getElementById("txt_NAME_A") as HTMLInputElement;
        txt_NAME_E = document.getElementById("txt_NAME_E") as HTMLInputElement;
        txt_note = document.getElementById("txt_note") as HTMLInputElement;
        txt_level = document.getElementById("txt_level") as HTMLInputElement;
        //txt_TARGET = document.getElementById("txt_TARGET") as HTMLInputElement;         
        chkeck_active = document.getElementById("chkeck_active") as HTMLInputElement;
        chkeck_Detailed = document.getElementById("chkeck_Detailed") as HTMLInputElement;

    }
    function InitalizeEvents() {
        LblAD.onclick = Add_first_level_onclick;
        btnDelete.onclick = btnDelete_onclick;
        btnAdd.onclick = btnAdd_onclick;
        btnsave.onclick = btnsave_onClick;
        btnback.onclick = btnback_onclick;
        btnEdit.onclick = btnEdit_onclick;
        Refrash.onclick = Refrash_onclick;
        Add_first_level.onclick = Add_first_level_onclick;

    }
    function Add_first_level_onclick() {

        Name_Acc.innerHTML = (lang == "ar" ? "اضافه في المستوي الاول" : "Added to the first level ") ;
        txt_level.value = '1';
        clear();
        btnAdd_onclick();
    }
    function Refrash_onclick() {

        $('#menu-group-1').html('');
        GetAll_Account();
        Display();

        btnDelete.disabled = true;
        btnEdit.disabled = true;
        //btnAdd.disabled = true;
    }
    function GetAll_Account() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("CostCenter", "GetAll"),
            data: {
                CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    Details_G_COST = result.Response as Array<G_COST_CENTER>;
                }

            }
        });

    }
    function Display() {
        //debugger
        DetAccLst = new Array<G_COST_CENTER>();
        var desc = "";
        var Det = 0;
        var MaxLevel = 10;
        for (var l = 1; l < MaxLevel; l++) {

            DetAccLst = Details_G_COST.filter(x => x.CC_LEVEL == l);
            for (var i = 0; i < DetAccLst.length; i++) {
                desc = SysSession.CurrentEnvironment.ScreenLanguage == "ar" ? DetAccLst[i].CC_DESCA : DetAccLst[i].CC_DESCE
                Det = DetAccLst[i].LEAF == true ? 1 : 0;
                Biuld_Tree(DetAccLst[i].CC_CODE, desc, DetAccLst[i].CC_PARENT, Det, DetAccLst[i].CC_LEVEL, DetAccLst[i])

            }

        }

    }
    function Biuld_Tree(Node: string, NodeName: string, NodeParent: string, Detail: number, LVL: number, DetAccList: G_COST_CENTER) {

        //debugger


        var class_Plus;
        var style_Plus = '';

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
            class_Plus = 'fas fa-plus-circle f-6';
            style_Plus = 'height: 1rem;width: 1rem; background-color: var(--dark-blue) ;  border-radius:50%; margin:auto; margin-right: 5px;';
        }
        //---------------------------------------------------------li---------------------
        var li_1 = document.createElement('li');
        li_1.setAttribute('id', 'li_' + Node);
        li_1.setAttribute('class', 'item-' + Node + ' deeper parent');
        document.getElementById(id_ul).appendChild(li_1);
        //------------------------------------------------------------------------------

        //---------------------------------------------------------a---------------------
        var a_1 = document.createElement('a');   // a 
        a_1.setAttribute('id', 'a_' + Node);
        a_1.setAttribute('href', '#');
        document.getElementById('li_' + Node).appendChild(a_1);


        var span_1 = document.createElement('span');     // span زرار الفتح +
        span_1.setAttribute('id', 'span_1' + Node);
        span_1.setAttribute('data-toggle', 'collapse');
        span_1.setAttribute('data-parent', '#' + id_ul + '');
        span_1.setAttribute('href', '#sub-item-' + Node);
        span_1.setAttribute('class', 'sign collapsed');
        span_1.setAttribute('aria-expanded', 'false');
        span_1.setAttribute('Data_I', 'i_' + Node);
        span_1.setAttribute('style', style_Plus);
        document.getElementById('a_' + Node).appendChild(span_1);

        if (style_Plus == '') {
            var i_1 = document.createElement('i');     //icon +
            i_1.setAttribute('id', 'i_' + Node);
            i_1.setAttribute('class', class_Plus);
            document.getElementById('span_1' + Node).appendChild(i_1);
        }



        var span_2 = document.createElement('span');     // النص text in li
        span_2.setAttribute('id', Node);
        span_2.setAttribute('class', 'lbl');
        span_2.setAttribute('data-detail', Detail.toString());
        span_2.setAttribute('data-CC_CODE', DetAccList.CC_CODE);
        span_2.setAttribute('data-NAME_A', DetAccList.CC_DESCA);
        span_2.setAttribute('data-NAME_E', DetAccList.CC_DESCE);
        span_2.setAttribute('data-REMARKS', DetAccList.CC_LOCATION);
        //span_2.setAttribute('data-TARGET', DetAccList.CC_TARGET.toString());
        span_2.setAttribute('data-ACTIVE', DetAccList.ACTIVE.toString());
        span_2.setAttribute('data-level', DetAccList.CC_LEVEL.toString());

        span_2.setAttribute('data-NodeParent', DetAccList.CC_PARENT = null ? '' : DetAccList.CC_PARENT);


        document.getElementById('a_' + Node).appendChild(span_2);
        document.getElementById(Node).innerHTML = "" + NodeName + " ( " + Node + " )";

        $('#' + Node + '').click(click_in_labl);

        //------------------------------------------------------------------------------

        //---------------------------------------------------------ul---------------------
        var ul_1 = document.createElement('ul');
        ul_1.setAttribute('class', 'children nav-child unstyled small collapse');
        ul_1.setAttribute('id', 'sub-item-' + Node);
        document.getElementById('li_' + Node).appendChild(ul_1);
        //------------------------------------------------------------------------------

    }
    function click_in_labl() {

        CC_CODE = $(this).attr('data-CC_CODE');

        DetAccLst = new Array<G_COST_CENTER>();
        DetAccLst = Details_G_COST.filter(x => x.CC_CODE == $(this).attr('data-NodeParent'));
        //debugger
        if ($(this).attr('data-NodeParent') == 'null' || $(this).attr('data-NodeParent') == '0') {
            NAME = SysSession.CurrentEnvironment.ScreenLanguage == "ar" ? $(this).attr('data-NAME_A') : $(this).attr('data-NAME_E');
            Name_Acc.innerHTML = "" + NAME + " ( " + CC_CODE + " )";
            Name_Acc.setAttribute('data-level', $(this).attr('data-level'));
        }
        else {



            NAME = SysSession.CurrentEnvironment.ScreenLanguage == "ar" ? DetAccLst[0].CC_DESCA : DetAccLst[0].CC_DESCE;
            Name_Acc.innerHTML = "" + NAME + " ( " + $(this).attr('data-NodeParent') + " )";
            Name_Acc.setAttribute('data-level', $(this).attr('data-level'));


        }



        txt_CC_CODE.value = $(this).attr('data-CC_CODE');
        txt_NAME_A.value = $(this).attr('data-NAME_A');
        txt_NAME_E.value = $(this).attr('data-NAME_E');
        txt_note.value = $(this).attr('data-REMARKS');
        txt_level.value = $(this).attr('data-level');
        //txt_TARGET.value = $(this).attr('data-TARGET');
        chkeck_Detailed.checked = $(this).attr('data-detail') == '1' ? true : false;
        chkeck_active.checked = $(this).attr('data-ACTIVE') == 'true' ? true : false;


        btnDelete.disabled = false;
        btnEdit.disabled = false;
        btnAdd.disabled = false;

    }

    function Bilud_data_txt() {

        //debugger
        DetAccLst = new Array<G_COST_CENTER>();
        DetAccLst = Details_G_COST.filter(x => x.CC_CODE == CC_CODE);


        if (DetAccLst[0].CC_PARENT == null || DetAccLst[0].CC_PARENT == 'null' || DetAccLst[0].CC_PARENT == '0') {
            let NAME = "";
            NAME = SysSession.CurrentEnvironment.ScreenLanguage == "ar" ? DetAccLst[0].CC_DESCA : DetAccLst[0].CC_DESCE;
            Name_Acc.innerHTML = "" + NAME + " ( " + CC_CODE + " )";
            Name_Acc.setAttribute('data-level', DetAccLst[0].CC_LEVEL.toString());
        }
        else {

            DetAccLsts = new Array<G_COST_CENTER>();
            DetAccLsts = Details_G_COST.filter(x => x.CC_CODE == DetAccLst[0].CC_PARENT);

            NAME = SysSession.CurrentEnvironment.ScreenLanguage == "ar" ? DetAccLsts[0].CC_DESCA : DetAccLsts[0].CC_DESCE;
            Name_Acc.innerHTML = "" + NAME + " ( " + DetAccLst[0].CC_PARENT + " )";
            Name_Acc.setAttribute('data-level', DetAccLst[0].CC_LEVEL.toString());


        }




        txt_CC_CODE.value = DetAccLst[0].CC_CODE;
        txt_NAME_A.value = DetAccLst[0].CC_DESCA;
        txt_NAME_E.value = DetAccLst[0].CC_DESCE;
        txt_level.value = DetAccLst[0].CC_LEVEL.toString();
        txt_note.value = DetAccLst[0].CC_LOCATION;
        //txt_TARGET.value = DetAccLst[0].CC_TARGET.toString();
        chkeck_Detailed.checked = DetAccLst[0].LEAF;
        chkeck_active.checked = DetAccLst[0].ACTIVE;






    }

    function add_ACCOUNT() {

        let NAME = "";
        NAME = SysSession.CurrentEnvironment.ScreenLanguage == "ar" ? txt_NAME_A.value : txt_NAME_E.value;

        NodeParent = Number(txt_level.value) == 1 ? null : CC_CODE;

        Biuld_Tree(txt_CC_CODE.value, NAME, NodeParent, 1, Number(txt_level.value), AccList);

        if (CC_CODE != null) {
            //debugger
            if (document.getElementById('span_1' + CC_CODE).innerHTML == '') {
                document.getElementById('span_1' + CC_CODE).setAttribute('style', ' ');
                var i_1 = document.createElement('i');     //icon +
                i_1.setAttribute('id', 'i_' + CC_CODE);
                i_1.setAttribute('class', 'fas fa-plus-circle fs-6');
                document.getElementById('span_1' + CC_CODE).appendChild(i_1);
            }
            document.getElementById(CC_CODE).setAttribute('data-detail', '0');

        }

    }
    function update_ACCOUNT() {

        let NAME = "";
        NAME = SysSession.CurrentEnvironment.ScreenLanguage == "ar" ? txt_NAME_A.value : txt_NAME_E.value;

        var ACC_update = document.getElementById(CC_CODE);
        ACC_update.innerHTML = "" + NAME + " ( " + txt_CC_CODE.value + " )";

        //debugger
        ACC_update.setAttribute('data-CC_CODE', txt_CC_CODE.value);
        ACC_update.setAttribute('data-NAME_A', txt_NAME_A.value);
        ACC_update.setAttribute('data-NAME_E', txt_NAME_E.value);
        ACC_update.setAttribute('data-REMARKS', txt_note.value);
        ACC_update.setAttribute('data-level', txt_level.value);
        //ACC_update.setAttribute('data-TARGET', txt_TARGET.value);
        ACC_update.setAttribute('data-detail', chkeck_Detailed.checked == true ? '1' : '0');
        ACC_update.setAttribute('data-ACTIVE', chkeck_active.checked == true ? 'true' : 'false');
        ACC_update.setAttribute('id', txt_CC_CODE.value);


        $('#li_' + CC_CODE).attr('id', 'li_' + txt_CC_CODE.value);
        $('#a_' + CC_CODE).attr('id', 'a_' + txt_CC_CODE.value);
        $('#span_1' + CC_CODE).attr('href', '#sub-item-' + txt_CC_CODE.value);
        $('#span_1' + CC_CODE).attr('id', 'span_1' + txt_CC_CODE.value);
        $('#i_' + CC_CODE).attr('id', 'i_' + txt_CC_CODE.value);
        $('#i_' + CC_CODE).attr('id', 'i_' + txt_CC_CODE.value);
        $('#sub-item-' + CC_CODE).attr('id', 'sub-item-' + txt_CC_CODE.value);

        //Name_Acc.innerHTML = "" + NAME + " ( " + txt_CC_CODE.value + " )";
        CC_CODE = txt_CC_CODE.value;
    }
    function Delete_ACCOUNT() {

        if (txt_CC_CODE.value != null) {
            //debugger

            DetAccLst = new Array<G_COST_CENTER>();
            DetAccLst = Details_G_COST.filter(x => x.CC_CODE == txt_CC_CODE.value);

            var index = Details_G_COST.indexOf(DetAccLst[0]);

            deleteRow(Details_G_COST, index);

            var list = document.getElementById("sub-item-" + DetAccLst[0].CC_PARENT);

            if (list.childNodes.length == 1) // تغير icon 
            {
                let item = document.getElementById('li_' + txt_CC_CODE.value);
                item.parentNode.removeChild(item);

                //document.getElementById('span_1' + DetAccLst[0].CC_PARENT).setAttribute('style', 'height: 18px;width: 21px');

                let icon = document.getElementById('i_' + DetAccLst[0].CC_PARENT);
                icon.parentNode.removeChild(icon);

                document.getElementById(DetAccLst[0].CC_PARENT).setAttribute('data-detail', '1');

            }
            else {
                let item = document.getElementById('li_' + txt_CC_CODE.value);
                item.parentNode.removeChild(item);


            }

        }

    }
    function deleteRow(arr, row) {

        delete arr[row]

        return arr;
    }

    function btnAdd_onclick() {
        if (!SysSession.CurrentPrivileges.AddNew) return;
        if (Name_Acc.innerHTML == '') {

            WorningMessage("برجاء أختيار مستوي!", "must choose Level!", "تحذير", "worning");
        }
        else {


            if (Name_Acc.innerHTML == 'اضافه في المستوي الاول') {
                txt_level.value = '1';
                Name_Acc.innerHTML = "اضافه في المستوي الاول";

            }
            else {
                txt_level.value = (Number(Name_Acc.getAttribute('data-level')) + 1).toString();



                NAME = SysSession.CurrentEnvironment.ScreenLanguage == "ar" ? txt_NAME_A.value : txt_NAME_E.value;

                Name_Acc.innerHTML = "اضافه داخل " + NAME + " ( " + CC_CODE + " ) ";


            }

            clear();
            RemoveDisabled();
            $('#btnsave').removeClass("display_none");
            $('#btnback').removeClass("display_none");
            $('#left').addClass("disabledDiv");

            btnAdd.disabled = true;
            btnDelete.disabled = true;
            btnEdit.disabled = true;
            StatusFlag = 'i';
        }
    }
    function btnEdit_onclick() {
        if (!SysSession.CurrentPrivileges.EDIT) return;
        if (Name_Acc.innerHTML == '') {
            WorningMessage("برجاء أختيار مستوي!", "must choose Level!", "تحذير", "worning");

            }
        else {
            RemoveDisabled();
            txt_CC_CODE.disabled = true;
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
        if (!SysSession.CurrentPrivileges.Remove) return;

        if (Name_Acc.innerHTML == '') {
            WorningMessage("برجاء أختيار مستوي!", "must choose Level!", "تحذير", "worning");
            MessageBox.Show(" ", "خطأ");
        }
        else {

            if (chkeck_Detailed.checked == true) {

                if (!Check_Not()) {
                    WorningMessage("لا يمكنك الحذف لانه لديه رقم حركه!", "You cannot delete it because it has a movement number!", "تحذير", "worning");
                    return;
                }
                else {
                    NAME = SysSession.CurrentEnvironment.ScreenLanguage == "ar" ? txt_NAME_A.value : txt_NAME_E.value;
                    ConfirmMessage("هل تريد الحذف؟ ( " + NAME + " )", "Do you want to delete?", "تحذير", "worning", () => {
                        StatusFlag = 'd';
                        Save_Delete();

                    });
                }

            }
            else {
                WorningMessage("لا يمكنك الحذف لانه لديه ابناء!", "You cannot delete because he has children!", "خطأ", "Error");
                MessageBox.Show(" ", "خطأ");
            }

        }
    }
    function btnback_onclick() {
        if (StatusFlag == 'i') {
            Name_Acc.innerHTML = '';
        }
        try {

            Bilud_data_txt();
        } catch (e) {

        }
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
        //debugger
        loading('btnsave');

        setTimeout(function () {

            finishSave('btnsave');

        if (!ValidationHeader()) return

        if (txt_NAME_E.value == "") {
            txt_NAME_E.value = txt_NAME_A.value;
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
        txt_CC_CODE.value = '';
        txt_NAME_A.value = '';
        txt_NAME_E.value = '';
        txt_note.value = '';
        //txt_TARGET.value = '';
        chkeck_Detailed.checked = true;
        chkeck_active.checked = true;
    }

    function RemoveDisabled() {
        //debugger
        txt_CC_CODE.disabled = false;
        txt_NAME_A.disabled = false;
        txt_NAME_E.disabled = false;
        txt_note.disabled = false;
        chkeck_active.disabled = false;

    }
    function Disabled() {
        txt_CC_CODE.disabled = true;
        txt_NAME_A.disabled = true;
        txt_NAME_E.disabled = true;
        txt_note.disabled = true;
        txt_level.disabled = true;
        //txt_TARGET.disabled = true;        
        chkeck_active.disabled = true;
        chkeck_Detailed.disabled = true;

    }
    function ValidationHeader() {
        if (txt_CC_CODE.value == "") {
            WorningMessage("برجاء أدخل رقم الحساب!", "Please Enter Account Number!", "خطأ", "Error");
            Errorinput(txt_CC_CODE)
            return false
        }
        else if (txt_NAME_A.value == "") {
            WorningMessage("برجاء أدخل الاسم بالعربي!", "Please Enter Arabic Name!", "خطأ", "Error");
            Errorinput(txt_NAME_A)

            return false
        }
        return true;
    }

    function Assign() {

        AccList = new G_COST_CENTER();
        Details = new Array<G_COST_CENTER>();

        AccList.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
        AccList.UserCode = SysSession.CurrentEnvironment.UserCode;
        AccList.COMP_CODE = Number(compcode);

        if (StatusFlag == "i") {
            AccList.StatusFlag = StatusFlag.toString();
            AccList.CC_CODE = txt_CC_CODE.value;
            AccList.CC_DESCA = txt_NAME_A.value;
            AccList.CC_DESCE = txt_NAME_E.value;
            AccList.CC_LEVEL = Number(txt_level.value);
            AccList.ACTIVE = chkeck_active.checked;
            AccList.CC_LOCATION = txt_note.value;
            //AccList.CC_TARGET = Number(txt_level.value); 
            AccList.LEAF = chkeck_Detailed.checked;
            AccList.CC_PARENT = NodeParent == null ? 0 : NodeParent;

            Details_G_COST.push(AccList);
            Details.push(AccList);

        }
        if (StatusFlag == "u") {
            AccList.StatusFlag = StatusFlag.toString();
            AccList.CC_CODE = txt_CC_CODE.value;
            AccList.CC_DESCA = txt_NAME_A.value;
            AccList.CC_DESCE = txt_NAME_E.value;
            AccList.CC_LEVEL = Number(txt_level.value);
            AccList.ACTIVE = chkeck_active.checked;
            AccList.CC_LOCATION = txt_note.value;
            //AccList.CC_TARGET = Number(txt_level.value);
            AccList.LEAF = chkeck_Detailed.checked;
            AccList.CC_PARENT = NodeParent == null ? 0 : NodeParent;

            Details_G_COST.push(AccList);
            Details.push(AccList);
        }
        if (StatusFlag == "d") {
            if (txt_CC_CODE.value != "") {
                AccList.StatusFlag = StatusFlag.toString();
                AccList.CC_CODE = txt_CC_CODE.value;
                AccList.CC_PARENT = NodeParent;
                Details.push(AccList);
            }
        }


        Details[0].Branch_Code = SysSession.CurrentEnvironment.BranchCode;
        Details[0].Comp_Code = SysSession.CurrentEnvironment.CompCode;
        Details[0].MODULE_CODE = Modules.CostCenter;
        Details[0].sec_FinYear = SysSession.CurrentEnvironment.CurrentYear;
    }
    function Insert() {
        $("#MessageBoxDialog").modal("hide");
        //debugger
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("CostCenter", "UpdateGenralAcclist"),
            data: JSON.stringify(Details),
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {

                    WorningMessage("تم الحفظ !", "Saved!", "Success", "Success");

                    Success = true;
                }
                else {
                    WorningMessage("خطأء !", "Error!", "تحذير", "worning");

                    Success = false;

                }
            }
        });
    }

    function Save_Insert() {

        DetAccLst = new Array<G_COST_CENTER>();
        DetAccLst = Details_G_COST.filter(x => x.CC_CODE == txt_CC_CODE.value);
        if (DetAccLst.length > 0) {
            WorningMessage("لا يمكنك تكرار رقم المركز !", "You cannot duplicate Cost Center!", "تحذير", "worning");
            Errorinput(txt_CC_CODE)

        }
        else {

            if (Number(txt_level.value) == 1) {
                CC_CODE = null;
                NodeParent = Number(txt_level.value) == 1 ? null : CC_CODE;
                Assign();
                Insert();
                if (Success == true) {
                    add_ACCOUNT();
                    Disabled();
                    btnAdd.disabled = false;
                    btnDelete.disabled = false;
                    btnEdit.disabled = false;
                    $('#btnsave').addClass("display_none");
                    $('#btnback').addClass("display_none");
                    $('#left').removeClass("disabledDiv");

                    Success = false;
                }

            }
            else {
                if (CC_CODE == null) {
                    WorningMessage("يجب اختيار المستوي !", "must choose Level!", "تحذير", "worning");
                }
                else {
                    NodeParent = Number(txt_level.value) == 1 ? null : CC_CODE;
                    Assign();
                    Insert();
                    if (Success == true) {
                        add_ACCOUNT();
                        Disabled();
                        btnAdd.disabled = false;
                        btnDelete.disabled = false;
                        btnEdit.disabled = false;
                        $('#btnsave').addClass("display_none");
                        $('#btnback').addClass("display_none");
                        $('#left').removeClass("disabledDiv");
                        Name_Acc.innerHTML = "" + NAME + " ( " + CC_CODE + " ) ";
                        Success = false;
                    }


                }
            }
        }

    }
    function Save_update() {
        DetAccLst = new Array<G_COST_CENTER>();
        if (CC_CODE != txt_CC_CODE.value) {
            DetAccLst = Details_G_COST.filter(x => x.CC_CODE == txt_CC_CODE.value);
        }
        if (DetAccLst.length > 0) {
            WorningMessage("لا يمكنك تكرار رقم المركز  !", "You cannot duplicate account Cost Center!", "تحذير", "worning");
            Errorinput(txt_CC_CODE)

            }
        else {


            if (CC_CODE == null) {
                WorningMessage("يجب اختيار المستوي !", "must choose Level!", "تحذير", "worning");
            }
            else {

                DetAccLst = Details_G_COST.filter(x => x.CC_CODE == CC_CODE);
                NodeParent = Number(txt_level.value) == 1 ? null : DetAccLst[0].CC_PARENT;
                Assign();
                Insert();
                if (Success == true) {
                    update_ACCOUNT();
                    Disabled();
                    btnAdd.disabled = false;
                    btnDelete.disabled = false;
                    btnEdit.disabled = false;
                    $('#btnsave').addClass("display_none");
                    $('#btnback').addClass("display_none");
                    $('#left').removeClass("disabledDiv");
                    Success = false;
                }
            }

        }
    }
    function Save_Delete() {
        if (CC_CODE == null) {
            WorningMessage("يجب اختيار المستوي !", "must choose Level!", "تحذير", "worning");
        }
        else {
            DetAccLst = Details_G_COST.filter(x => x.CC_CODE == CC_CODE);
            NodeParent = Number(txt_level.value) == 1 ? null : DetAccLst[0].CC_PARENT;
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
                Success = false;
                Name_Acc.innerHTML = "";
                Name_Acc.setAttribute('data-level', '1');
            }
        }

    }

    function Check_Not() {
        //debugger
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("CostCenter", "Check_Not"),
            data: { CompCode: compcode, CC_CODE: txt_CC_CODE.value },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    var Check = result.Response;

                    if (Check == -1) { return true; }
                    else { return false; }

                }
                else {

                    return false;

                }
            }
        });
        return true;
    }
}












