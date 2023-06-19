$(document).ready(() => {
	UserActLogSum.InitalizeComponent();
})
namespace UserActLogSum {
	var compcode: number;
	var BranchCode: number;
	var sys: SystemTools = new SystemTools();
	var SysSession: SystemSession = GetSystemSession(Modules.UserActLogSum);
	var BranchModules: Array<GProc_GetBranchModules_Result> = new Array<GProc_GetBranchModules_Result>();
	/*----------------------------------------------------------------- Input Control------------------------------------------------------------------ */
	var Screen_name: HTMLInputElement;
	var txtFromDate: HTMLInputElement;
	var txtToDate: HTMLInputElement;	  
	var repUser: HTMLInputElement;		  
	var repTitle: HTMLInputElement;		  
	var drpUser: HTMLSelectElement;
	var drpTitle: HTMLSelectElement;
	var drpBranch: HTMLSelectElement;	  
	/*----------------------------------------------------------------- Button Control------------------------------------------------------------------ */
	var btnReset;
	//--- Print Buttons
	var btnPrint: HTMLButtonElement;
	var btnPrintTrview: HTMLButtonElement;
	var btnPrintTrPDF: HTMLButtonElement;
	var btnPrintTrEXEL: HTMLButtonElement;
	/*----------------------------------------------------------------- Variable --------------------------------------------------------------------- */
	var lang = (SysSession.CurrentEnvironment.ScreenLanguage);
	export function InitalizeComponent() {
		 
		InitalizeControls();
		InitalizeEvents();
		$("#iconMainPages").addClass("d-none");
		$("#iconReportPages").removeClass("d-none");
		$("#btnPrintTrview").addClass("print-report");
		compcode = Number(SysSession.CurrentEnvironment.CompCode);
		BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);
		Screen_name.innerHTML = lang == "ar" ? "تقرير نشاط المستخدمين" : "User Activity Report";
		document.title = " نظام اورانج " + (lang == "ar" ? "تقرير نشاط المستخدمين" : "User Activity Report");	    
		txtFromDate.value = DateFormat(SysSession.CurrentEnvironment.StartDate);
		txtToDate.value = DateFormat(ConvertToDateDash(GetDate()) <= ConvertToDateDash(SysSession.CurrentEnvironment.EndDate) ? GetDate() : SysSession.CurrentEnvironment.EndDate);
		GetData_Header_loader();
		GetBranchModules();											     
	}
	function InitalizeControls() {
		/*----------------------------------------------------------------- Input Control------------------------------------------------------------------ */
		Screen_name = document.getElementById("Screen_name") as HTMLInputElement;
		txtFromDate = document.getElementById("txtFromDate") as HTMLInputElement;
		txtToDate = document.getElementById("txtToDate") as HTMLInputElement;	 
		repUser = document.getElementById("repUser") as HTMLInputElement;
		repTitle = document.getElementById("repTitle") as HTMLInputElement;
		repTitle = document.getElementById("repTitle") as HTMLInputElement;	    
		drpUser = document.getElementById("drpUser") as HTMLSelectElement;
		drpTitle = document.getElementById("drpTitle") as HTMLSelectElement;
		drpBranch = document.getElementById("drpBranch") as HTMLSelectElement;	 
		/*----------------------------------------------------------------- Button Control------------------------------------------------------------------ */
		btnReset = document.getElementById("btnReset") as HTMLButtonElement;
		//--- Print Buttons
		btnPrint = document.getElementById("btnPrint") as HTMLButtonElement;
		btnPrintTrview = document.getElementById("btnPrintTrview") as HTMLButtonElement;
		btnPrintTrPDF = document.getElementById("btnPrintTrPDF") as HTMLButtonElement;
		btnPrintTrEXEL = document.getElementById("btnPrintTrEXEL") as HTMLButtonElement;
	}
	function InitalizeEvents() {
		// Print Buttons
		btnPrintTrview.onclick = () => { PrintReport(1); }
		btnPrintTrPDF.onclick = () => { PrintReport(2); }
		btnPrintTrEXEL.onclick = () => { PrintReport(3); }
		btnPrint.onclick = () => { PrintReport(4); }
		drpBranch.onchange = GetBranchModules;	  
	}					   
	/*----------------------------------------------------------------- Get Func------------------------------------------------------------------ */
	function GetData_Header_loader() {	 
		var Table: Array<Table>;
		Table =
			[
				{ NameTable: 'G_USERS', Condition: " CompCode = " + compcode + " " },	 	  
				{ NameTable: 'G_BRANCH', Condition: " COMP_CODE = " + compcode + "" },		 
			]
		DataResult(Table);  
		FillDropwithAttr(GetDataTable('G_USERS'), "drpUser", "USER_CODE", "USER_CODE", (lang == "ar" ? "الجميع" : "All"),"","");	 
		FillDropwithAttr(GetDataTable('G_BRANCH'), "drpBranch", "BRA_CODE", "BRA_DESC", (lang == "ar" ? "الجميع" : "All"), "", "");		 
	}
	function GetBranchModules() {
		let BraCode = drpBranch.value == "Null" ? -1 : Number(drpBranch.value);	 
		Ajax.Callsync({
			type: "Get",
			url: sys.apiUrl("GBranch", "GetBranchModules"),
			data: { CompCode: compcode, BranchCode: BraCode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token},
			success: (d) => {	  
				let result = d as BaseResponse;
				if (result.IsSuccess) {
					debugger
					BranchModules = result.Response as Array<GProc_GetBranchModules_Result>;
					FillDropwithAttr(BranchModules, "drpTitle", "MODULE_CODE", (lang == "ar" ? "MODULE_DESCA" : "MODULE_DESCE"), (lang == "ar" ? "الجميع" : "All"), "", "");
				}
			}
		});
	}

	/*----------------------------------------------------------------- Rep Func------------------------------------------------------------------ */
	function PrintReport(OutType: number) {
		let rp: ReportParameters = new ReportParameters();
		rp.CompCode = SysSession.CurrentEnvironment.CompCode;
		rp.BranchCode = SysSession.CurrentEnvironment.BranchCode;
		rp.CompNameA = SysSession.CurrentEnvironment.CompanyNameAr;
		rp.CompNameE = SysSession.CurrentEnvironment.CompanyName;
		rp.UserCode = SysSession.CurrentEnvironment.UserCode;
		rp.Tokenid = "HGFD-" +SysSession.CurrentEnvironment.Token;
		var BranchNameA = SysSession.CurrentEnvironment.BranchName;
		var BranchNameE = SysSession.CurrentEnvironment.BranchNameEn;
		rp.ScreenLanguage = SysSession.CurrentEnvironment.ScreenLanguage;
		rp.SystemCode = SysSession.CurrentEnvironment.SystemCode;
		rp.SubSystemCode = SysSession.CurrentEnvironment.SubSystemCode;
		if (BranchNameA == null || BranchNameE == null) {

			BranchNameA = " ";
			BranchNameE = " ";
		}
		rp.BraNameA = BranchNameA;
		rp.BraNameE = BranchNameE;
		rp.LoginUser = SysSession.CurrentEnvironment.UserCode;
		rp.RepType = OutType;
		rp.braCode = drpBranch.value == "Null" ? -1 : Number(drpBranch.value);
		//--------------------GroupType
		if (repUser.checked) {
			rp.Typ = 1;
		} else if (repTitle.checked) {
			rp.Typ = 2;
		}
		else {
			rp.Typ = 3;
		}
		debugger
		rp.FromDate = DateFormatRep(txtFromDate.value);
		rp.ToDate = DateFormatRep(txtToDate.value);		  						    
		rp.SysCode = drpTitle.value == "Null" ? "-1" : $('option:selected', $("#drpTitle")).attr('data-syscode');
		rp.Module = drpTitle.value == "Null" ? "-1" : drpTitle.value;
		rp.User_Code = drpUser.value == "Null" ? "-1" : drpUser.value;
		rp.Typ = repUser.checked == true ? 1 : 0;				  
		  
		Ajax.Callsync({
			url: Url.Action("Rep_UserActivitySummary", "GeneralReports"),
			data: rp,
			success: (d) => {
				let result = d.result as string;
				PrintReportLog(SysSession.CurrentEnvironment.UserCode, SysSession.CurrentEnvironment.CompCode, SysSession.CurrentEnvironment.BranchCode, Modules.Inventorymove, SysSession.CurrentEnvironment.CurrentYear);
				window.open(result, "_blank");
			}

		})
	}
}