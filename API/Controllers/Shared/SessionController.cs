using Inv.API.Models;
using Inv.API.Models.CustomEntities;
using Inv.API.Models.CustomModel;
using Inv.API.Tools;
using Inv.DAL.Domain;
using Microsoft.VisualBasic;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using QRCoder;
using Security;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity.Core.EntityClient;
using System.Data.SqlClient;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Reflection;
using System.Text;
using System.Web;
using System.Web.Configuration;
using System.Web.Http;
using System.Web.Services.Description;

namespace Inv.API.Controllers
{
   

    public class SessionController : BaseController
    {


        [HttpGet, AllowAnonymous]
        public IHttpActionResult SetSessionRecordValue(string propertyName, string value)
        {
            if (propertyName != null)
            {
                //PropertyInfo property = typeof(SessionRecord).GetProperty(propertyName);
                ////HttpContext.Current.Session["SessionRecord"] = value;
                //SessionRecord myObject = new SessionRecord();
                //property.SetValue(myObject, value);

                Config.Application[""+ propertyName + ""] = ""+ value + "";
            }
            return Ok(new BaseResponse(100));


        }
        

    }
}