$(document).ready(() => {

	AdminReport.InitalizeComponent();
})

namespace AdminReport {

    var compcode: Number;
    var AccountType: Number = 1;
    var sys: SystemTools = new SystemTools();
    var link = 'http://localhost:51374/';
    var SysSession: SystemSession = GetSystemSession('Home');
    							    
    var btnSave: HTMLButtonElement;
    var btnBack: HTMLButtonElement;
    var btnEdit: HTMLButtonElement;
    var btnAdd: HTMLButtonElement;		        				  

    export function InitalizeComponent() {
        try {					  
            InitalizeControls();
            InitalizeEvents();	   
        } catch (e) {
            MessageBox.Show("      يجب معاودة الدخول مرة اخري بستخدم الاسم وكلمة السر", "You must log in again using your name and password ", function () {
                window.location.href = "/Login/HomePage";

            }), 1000;
        }		     
    }

    function InitalizeControls() {	   
        btnSave = document.getElementById("btnSave") as HTMLButtonElement;
        btnBack = document.getElementById("btnBack") as HTMLButtonElement;
        btnEdit = document.getElementById("btnEdit") as HTMLButtonElement;
        btnAdd = document.getElementById("btnAdd") as HTMLButtonElement;
		    
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
							    
}