$(document).ready(function () {
    AdminReport.InitalizeComponent();
});
var AdminReport;
(function (AdminReport) {
    var compcode;
    var AccountType = 1;
    var sys = new SystemTools();
    var link = 'http://localhost:51374/';
    var SysSession = GetSystemSession('Home');
    var btnSave;
    var btnBack;
    var btnEdit;
    var btnAdd;
    function InitalizeComponent() {
        try {
            InitalizeControls();
            InitalizeEvents();
        }
        catch (e) {
            MessageBox.Show("      يجب معاودة الدخول مرة اخري بستخدم الاسم وكلمة السر", "You must log in again using your name and password ", function () {
                window.location.href = "/Login/HomePage";
            }), 1000;
        }
    }
    AdminReport.InitalizeComponent = InitalizeComponent;
    function InitalizeControls() {
        btnSave = document.getElementById("btnSave");
        btnBack = document.getElementById("btnBack");
        btnEdit = document.getElementById("btnEdit");
        btnAdd = document.getElementById("btnAdd");
    }
    function InitalizeEvents() {
    }
    function Update() {
        Assign();
        $("#btnEdit").removeClass("display_none");
        $("#btnSave").addClass("display_none");
        $("#btnBack").addClass("display_none");
        //Ajax.Callsync({
        //    type: "POST",
        //    url: sys.apiUrl("GComp", "Update"),
        //    data: JSON.stringify(Model),
        //    success: (d) => {
        //        let result = d as BaseResponse;
        //        if (result.IsSuccess) {
        //            DisplayMassage("تم الحفظ بنجاح", "Saved successfully", MessageType.Succeed);
        //            //var comp_CODE = result.Response as G_COMPANY;
        //        }
        //    }
        //});
    }
    function Insert() {
        Assign();
        //Ajax.Callsync({
        //    type: "Post",
        //    url: sys.apiUrl("GComp", "Insert"),
        //    data: JSON.stringify(Model),
        //    success: (d) => {
        //        let result = d as BaseResponse;
        //        if (result.IsSuccess) {
        //            DisplayMassage("تم الحفظ بنجاح", "Saved successfully", MessageType.Succeed);  
        //        }
        //        else {
        //            DisplayMassage("خطأء", "Error", MessageType.Error);
        //        }
        //    }
        //});
    }
    function Assign() {
    }
})(AdminReport || (AdminReport = {}));
//# sourceMappingURL=AdminReport.js.map