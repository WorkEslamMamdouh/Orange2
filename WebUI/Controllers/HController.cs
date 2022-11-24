using Inv.WebUI.Filter;
using System.Web.Mvc;

namespace Inv.WebUI.Controllers
{

    [Route("api/[controller]")]
    public class HController : Controller
    {



        #region Open Pages  
        public ActionResult O(string N)
        {
            try
            {
                string base64Encoded = N;
                string base64Decoded;
                byte[] data = System.Convert.FromBase64String(base64Encoded);
                base64Decoded = System.Text.ASCIIEncoding.ASCII.GetString(data);

                string Path = "C:/PdfCustSend_Or/" + base64Decoded + ".pdf";
                if (System.IO.File.Exists(Path))
                {
                    var fil = File(Path, "application/pdf");

                    int index1 =0;
                    int index2 = base64Decoded.LastIndexOf('_'); 
                    base64Decoded = base64Decoded.Substring(index1 , index2);

                    fil.FileDownloadName = ""+ base64Decoded + " فاتورة رقم" + ".pdf";
                    return fil;

                }
                else
                {

                    return ErrorPDF_Fix();
                }

            }
            catch (System.Exception)
            {
                return ErrorPDF_Fix();
            }



        }

        public ActionResult ErrorPDF_Fix()
        {
            return View("~/Views/Error/ErrorPDF_Fix.cshtml");
        }

        public ActionResult OpenPdf(string path)
        {
          
            return File(""+ path + "","application/pdf");
        }
         
        #endregion  Open Pages 

    }
}