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
using Microsoft.VisualBasic.ApplicationServices;
using System.Security.Claims;
using static Inv.API.Models.CustomEntities.IdRequest;

namespace Inv.API.Controllers
{
   

    public class SessionController : ApiController
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

                Config.Application["" + propertyName + ""] = "" + value + "";

                //string ipAddress = "";
                //if (Dns.GetHostAddresses(Dns.GetHostName()).Length > 0)
                //{
                //    ipAddress = Dns.GetHostAddresses(Dns.GetHostName())[0].ToString() + Dns.GetHostAddresses(Dns.GetHostName())[1].ToString() + Dns.GetHostAddresses(Dns.GetHostName())[2].ToString();
                //    string ee = Dns.GetHostAddresses(Dns.GetHostName())[4].ToString();
                //}


                //System.Web.HttpContext context = System.Web.HttpContext.Current;
                //string ipAddress = context.Request.ServerVariables["HTTP_X_FORWARDED_FOR"];
            }




            return Ok(new BaseResponse(100));


        }
        

    }
}