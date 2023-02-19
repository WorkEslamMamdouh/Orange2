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
using System.IO.Compression;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Reflection;
using System.Text;
using System.Web;
using System.Web.Configuration;
using System.Web.Http;
using System.Web.Services.Description;

namespace Inv.API.Models.CustomEntities
{
     
    public class IdRequest : ApiController
    {
        public static class Config
        {
            public static Dictionary<string, string> Application = new Dictionary<string, string>();
        }

        public static class GlobalData
        {
            public static KeyValuePair<string, object> Application { get; set; }
        }

        [HttpGet, AllowAnonymous]
        public string GetIdRequest()
        {

            HttpContext httpContext = HttpContext.Current;  
            string IdReq = httpContext.Request.UserAgent.ToString() + httpContext.Request.LogonUserIdentity.Name.ToString();
            IdReq = Compress(IdReq);
            return IdReq;
        }

        [HttpGet, AllowAnonymous]
        public string GetKeyId(string Key )
        {
            return "" + GetIdRequest() + Key + "";
        }

        [HttpGet, AllowAnonymous]
        public string GetValue(string Key)
        {

            string Value = Config.Application[GetKeyId(Key)];
            return Value;
        }

        [HttpGet, AllowAnonymous]
        public static string Compress(string uncompressedString)
        {
            byte[] compressedBytes;

            using (var uncompressedStream = new MemoryStream(Encoding.UTF8.GetBytes(uncompressedString)))
            {
                using (var compressedStream = new MemoryStream())
                {
                    // setting the leaveOpen parameter to true to ensure that compressedStream will not be closed when compressorStream is disposed
                    // this allows compressorStream to close and flush its buffers to compressedStream and guarantees that compressedStream.ToArray() can be called afterward
                    // although MSDN documentation states that ToArray() can be called on a closed MemoryStream, I don't want to rely on that very odd behavior should it ever change
                    using (var compressorStream = new DeflateStream(compressedStream, CompressionLevel.Fastest, true))
                    {
                        uncompressedStream.CopyTo(compressorStream);
                    }

                    // call compressedStream.ToArray() after the enclosing DeflateStream has closed and flushed its buffer to compressedStream
                    compressedBytes = compressedStream.ToArray();
                }
            }

            return Convert.ToBase64String(compressedBytes);
        }


    }
}