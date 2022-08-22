using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Inv.API.Models;
using Inv.API.Tools;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Web.Configuration;
using System.Web.Http;
using System.Collections.Specialized;
using System.Reflection;
using System.Data.Entity.Core.EntityClient;
using System.Xml;
using System.Web;
using System.Threading.Tasks;
using Inv.DAL.Domain;
using Security;
using System.Data.Entity;
using System.Text;
using System.Net.Http.Formatting;
using System.Data.Entity.Core.Objects;
using System.IO;
using System.Drawing;
using Inv.API.Models.CustomEntities;
using Microsoft.VisualBasic;
using QRCoder;

namespace Inv.API.Controllers
{
    public class QrModel
    {
        public string CompName { get; set; }
        public string VatNo { get; set; }
        public Nullable<System.DateTime> TrDate { get; set; }
        public Nullable<decimal> Total { get; set; }
        public Nullable<decimal> Vat { get; set; }

    }

    public class QRGeneratorController : BaseController
    {


        private class TLV
        {
            public byte TAG { get; set; }
            public byte Len { get; set; }
            public string Value { get; set; }
            public string HexVal { get; set; }
        }

        public static DateTime MargeTime_in_Date(DateTime dateTime, DateTime Time)
        {

            return new DateTime(dateTime.Year, dateTime.Month, dateTime.Day, Time.Hour, Time.Minute, Time.Second);
        }

        public static DateTime AddTimeIndata(DateTime dateTime, string stringTime)
        {

            //string stringTime = Time.ToString();
            string[] values = stringTime.Split(':');

            return new DateTime(dateTime.Year, dateTime.Month, dateTime.Day, Convert.ToInt16(values[0]), Convert.ToInt16(values[1]), 0);
        }


        public static string QrGenerator(QrModel Model)
        {
            // Test Case 
            //Model.CompName = "Safe Systems Est.";
            //Model.VatNo = "310122393500003";
            //Model.Total = 500;
            //Model.Vat = Convert.ToDecimal( 75);
            //Model.TrDate = Convert.ToDateTime("2022-11-30T14:30:00Z");

            //Qr = 010C426F6273205265636F726473020F3331303132323339333530303030330314323032322D30342D32355431363A33303A30305A0407313030302E303005063135302E3030
            // QR64 = AQxCb2JzIFJlY29yZHMCDzMxMDEyMjM5MzUwMDAwMwMUMjAyMi0wNC0yNVQxNjozMDowMFoEBzEwMDAuMDAFBjE1MC4wMA==

            string Qr =""; string Qr64;
            string st; DateTime d;  
            List<TLV> TlvList = new List<TLV>();

            
          
            st = Model.CompName;
            TlvList.Add(genartateTLV(1, st));
            TlvList.Add(genartateTLV(2, Model.VatNo));

            d = Convert.ToDateTime(Model.TrDate);
            st = d.ToUniversalTime().ToString("yyyy'-'MM'-'dd'T'HH':'mm':'ss'.'ff'Z'");
            TlvList.Add(genartateTLV(3,st));
            st = Convert.ToDecimal(Model.Total+ Model.Vat).ToString("#0.00");

            TlvList.Add(genartateTLV(4, st));
            st =Convert.ToDecimal( Model.Vat).ToString("#0.00");

            TlvList.Add(genartateTLV(5, st));

            foreach (var item in TlvList)
            {
                Qr = Qr + item.HexVal;
            }
            var HexArr = new byte[Qr.Length / 2];
            for (var i = 0; i < Qr.Length/2; i++)
            {
                HexArr[i] = Convert.ToByte(Qr.Substring(i * 2, 2),16);
            }
            
            Qr64 = System.Convert.ToBase64String(HexArr); 
             
            return (Qr64);

        }
        private static TLV   genartateTLV (byte tp , string Val)
        {
            TLV itm = new TLV();
            itm.TAG = tp;
            itm.Len = Convert.ToByte(Encoding.UTF8.GetBytes (Val).Length);
            itm.Value = Val;
            itm.HexVal = itm.TAG.ToString("X2") + itm.Len.ToString("X2") + ToHexString(Val);

            return (itm);
        }
        public static string ToHexString(string str)
        {
            var sb = new StringBuilder();

            var bytes = Encoding.UTF8.GetBytes(str);
            foreach (var t in bytes)
            {
                sb.Append(t.ToString("X2"));
            }

            return sb.ToString(); 
        }
      

      
 
    }
}