using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;
using System.Text;
using System.Threading.Tasks;

namespace Inv.API
{
    [DataContract()]
    public class SendTaqClass
    {
        private string _recipients = string.Empty;
        private string _body = string.Empty;
        private string _sender = string.Empty;

        [DataMember()]
        public string recipients
        {
            set
            {
                _recipients = value;
            }
            get
            {
                return _recipients;
            }
        }

        [DataMember()]
        public string body
        {
            set
            {
                _body = value;
            }
            get
            {
                return _body;
            }
        }

        [DataMember()]
        public string sender
        {
            set
            {
                _sender = value;
            }
            get
            {
                return _sender;
            }
        }
    }

    public class ReponseTq
    {
        public int statusCode;
        public string messageId;
        public string cost;
        public string currency; int totalCount;
        public int msgLength;
        public List<string> accepted;
        public List<string> rejected;
    }
    partial class Helping_Methods
    {
        public static string JSONSerialize(SendTaqClass objStudent)
        {
            MemoryStream stream = new MemoryStream();
            DataContractJsonSerializer jsonSer = new DataContractJsonSerializer(typeof(SendTaqClass));
            jsonSer.WriteObject(stream, objStudent);
            stream.Position = 0;
            StreamReader sr = new StreamReader(stream);
            return sr.ReadToEnd();
        }

        #region Send_SMS




        public static string ConvertToUnicode(string val)
        {

            string msg2 = string.Empty;
            int I = 0;
            for (I = 0; I <= val.Length - 1; I++)
            {
                msg2 += convertToUnicode(char.Parse(val.Substring(I, 1)));
            }

            return msg2;
        }


        private static string convertToUnicode(char ch)
        {
            System.Text.UnicodeEncoding class1 = new System.Text.UnicodeEncoding();
            byte[] msg = class1.GetBytes(System.Convert.ToString(ch));

            return fourDigits(msg[1] + msg[0].ToString("X"));
        }
        private static string fourDigits(string val)
        {

            string result = string.Empty;

            switch ((val.Length))
            {

                case 1:
                    result = "000" + val;
                    break;
                case 2:
                    result = "00" + val;
                    break;
                case 3:
                    result = "0" + val;
                    break;
                case 4:
                    result = val;
                    break;
            }

            return result;
        }

        public static byte[] fromhex(string hex)
        {
            byte[] raw = new byte[hex.Length / 4];
            for (int i = 0; i < raw.Length; i++)
            {
                raw[i] = Convert.ToByte(hex.Substring(i * 4, 4), 16);
            }
            return raw;
        }

        //public static string unicodesb(this string str)
        //{
        //    StringBuilder sb = new StringBuilder();
        //    foreach (var c in str)
        //    {
        //        sb.Append("\\u" + ((int)c).ToString("X4"));
        //    }
        //    return sb.ToString();
        //}

         public static string SendMessageSoftex(string SecStr, string Email, string Password, string Message, string[] MobileNumbers, Boolean IsUniCode)
        {
            Inv.API.SoftexMassage.MiniClientSoapClient SendMsg = new Inv.API.SoftexMassage.MiniClientSoapClient();
            var response = SendMsg.SendInstantMsg(SecStr, Email, Password, Message, MobileNumbers, IsUniCode);
            // var res = SendMsg.GetBalance(SecStr, Email, Password);

            return response.ToString();
        }

        public static string SendMessageHISMS(string username, string password, string msg , string sender, string numbers)
        {
            HttpWebRequest req = (HttpWebRequest)
            WebRequest.Create("http://www.hisms.ws/api.php");
            req.Method = "POST";





            //var shapedUnicode = unicodesb(msg); //output: \u0633\u0645\u064A\u0631
            //var unshapedUnicode = sb.GetUnShapedUnicode(); //output: \uFEB3\uFEE4\uFEF4\uFEAE
            //var unshapedText = unshapedUnicode.DecodeEncodedNonAsciiCharacters();

            //var arabic = Encoding.GetEncoding(1256);

            // var b5 = Helping_Methods.ConvertToUnicode("Safe UTF7 سيد كيدز");

            // var msg4 = ConvertToUnicode("Safe كيدز");
            // var msg3 = "Safe كيدز";
            // //string ch;
            // byte[] ms = new byte[50];

            // string str = "";

            //for (int i = 0; i < msg4.Length; i += 4)
            //    str += (char)Int16.Parse(msg4.Substring(i, 4), System.Globalization.NumberStyles.AllowHexSpecifier);


            //for (int i = 0; i < msg4.Length/4; i++)
            //{
            //    ch = msg4.Substring(i * 4, 4);

            //    str  string.Format(@"\x{0:x4}", (int)ch);
            //    ms[i] = Convert.ToByte(msg4.Substring(i * 4, 4),16);
            //}

            //var v = Encoding.UTF32.GetString(ms);


            //send_sms & username = xx & password = xx & numbers = 966xxxx,966xxx x&sender = xxx & message = xxx & date = 2015 - 1 - 30 & time = 24:01
            req.ContentType = "application/x-www-form-urlencoded";
            string postData = "send_sms" + "&username=" + username + "&password=" + password + "&numbers=" + numbers + "&sender=" + sender + "&message=" + msg;
            req.ContentLength = postData.Length;

            StreamWriter stOut = new StreamWriter(req.GetRequestStream(), System.Text.Encoding.ASCII);

            stOut.Write(postData);
            stOut.Close();
            // Do the request to get the response
            string strResponse;
            StreamReader stIn = new StreamReader(req.GetResponse().GetResponseStream());
            strResponse = stIn.ReadToEnd();
            stIn.Close();

            return strResponse;
        }
        public static string Response_KSAsmsMessage(string ID)
        {
            string response_message = "";

            switch (ID.Trim())
            {
                case "1":
                    response_message = "لقد تمت العملية بنجاح";
                    break;
                case "2":
                    response_message = "إن رصيدك لدى موبايلي قد إنتهى ولم يعد به أي رسائل. (لحل المشكلة قم بشحن رصيدك من الرسائل لدى موبايلي. لشحن رصيدك إتبع تعليمات شحن الرصيد";
                    break;
                case "3":
                    response_message = "إن رصيدك الحالي لا يكفي لإتمام عملية الإرسال. (لحل المشكلة قم بشحن رصيدك من الرسائل لدى موبايلي. لشحن رصيدك إتبع تعليمات شحن الرصيد";
                    break;
                case "4":
                    response_message = "إن إسم المستخدم الذي إستخدمته للدخول إلى حساب الرسائل غير صحيح (تأكد من أن إسم المستخدم الذي إستخدمته هو نفسه الذي تستخدمه عند دخولك إلى موقع موبايلي";
                    break;
                case "5":
                    response_message = "هناك خطأ في كلمة المرور (تأكد من أن كلمة المرور التي تم إستخدامها هي نفسها التي تستخدمها عند دخولك موقع موبايلي,إذا نسيت كلمة المرور إضغط على رابط نسيت كلمة المرور لتصلك رسالة على جوالك برقم المرور الخاص بك)";
                    break;
                case "6":
                    response_message = "إن صفحة الإرسال لاتجيب في الوقت الحالي (قد يكون هناك طلب كبير على الصفحة أو توقف مؤقت للصفحة فقط حاول مرة أخرى أو تواصل مع الدعم الفني إذا إستمر الخطأ)";
                    break;
                case "12":
                    response_message = "إن حسابك بحاجة إلى تحديث يرجى مراجعة الدعم الفني";
                    break;
                case "13":
                    response_message = "إن إسم المرسل الذي إستخدمته في هذه الرسالة لم يتم قبوله. (يرجى إرسال الرسالة بإسم مرسل آخر أو تعريف إسم المرسل لدى موبايلي)";
                    break;
                case "14":
                    response_message = "إن إسم المرسل الذي إستخدمته غير معرف لدى موبايلي. (يمكنك تعريف إسم المرسل من خلال صفحة إضافة إسم مرسل)";
                    break;
                case "15":
                    response_message = "يوجد رقم جوال خاطئ في الأرقام التي قمت بالإرسال لها. (تأكد من صحة الأرقام التي تريد الإرسال لها وأنها بالصيغة الدولية)";
                    break;
                case "16":
                    response_message = "الرسالة التي قمت بإرسالها لا تحتوي على إسم مرسل. (أدخل إسم مرسل عند إرسالك الرسالة)";
                    break;
                case "17":
                    response_message = "لم يتم ارسال نص الرسالة. الرجاء التأكد من ارسال نص الرسالة والتأكد من تحويل الرسالة الى يوني كود (الرجاء التأكد من استخدام الدالة)";
                    break;
                case "-1":
                    response_message = "لم يتم التواصل مع خادم (Server) الإرسال موبايلي بنجاح. (قد يكون هناك محاولات إرسال كثيرة تمت معا , أو قد يكون هناك عطل مؤقت طرأ على الخادم إذا إستمرت المشكلة يرجى التواصل مع الدعم الفني)";
                    break;
                case "-2":
                    response_message = "لم يتم الربط مع قاعدة البيانات (Database) التي تحتوي على حسابك وبياناتك لدى موبايلي. (قد يكون هناك محاولات إرسال كثيرة تمت معا , أو قد يكون هناك عطل مؤقت طرأ على الخادم إذا إستمرت المشكلة يرجى التواصل مع الدعم الفني)";
                    break;
                default:
                    response_message = ID;
                    break;
            }
            return response_message;
        }
        public static string Response_HismsMessage(string ID)
        {
            string response_message = "";

            switch (ID.Trim())
            {
                case "1":
                    response_message = "اسم المستخدم غير صحيح";
                    break;
                case "2":
                    response_message = "كلمة المرور غير صحيحة";
                    break;
                case "404":
                    response_message = "لم يتم ادخال جميع المعلومات";
                    break;
                case "403":
                    response_message = "تم تجاوز عدد المحاولات المسموحة";
                    break;
                case "504":
                    response_message = "ان حسابك معطل";
                    break;
                case "3":
                    response_message = "تم ارسال الرسالة بنجاح";
                    break;
                case "4":
                    response_message = "لا يوجد ارقام";
                    break;
                case "5":
                    response_message = "لا يوجد رسالة";
                    break;
                case "6":
                    response_message = "إن إسم المرسل الذي إستخدمته غير معرف لدينا . (يمكنك تعريف إسم المرسل من خلال صفحة إضافة إسم مرسل)";
                    break;
                case "7":
                    response_message = "ان اسم المرسل الذى استخدمتة غير مفعل";
                    break;
                case "8":
                    response_message = "ان الرسالة تحوى كلمات ممنوعة";
                    break;
                case "9":
                    response_message = "عفواً قد نفذ رصيدك لدينا";
                    break;
                case "10":
                    response_message = "لم يتم التواصل مع خادمصيغة التاريخ غير صحيحة";
                    break;
                case "11":
                    response_message = "عفواً صيغة الوقت غير صحيحة";
                    break;
                default:
                    response_message = ID;
                    break;
            }
            return response_message;
        }
        public static string Response_SoftexsmsMessage(string ID)
        {
            string response_message = "";

            switch (ID.Trim())
            {
                case "Error_":
                    response_message = "حدث خطأ";
                    break;
                case "Success":
                    response_message = "لقد تمت العملية بنجاح";
                    break;
                case "LoginFail":
                    response_message = "إن إسم المستخدم او كلمة المرور الذي إستخدمتهم للدخول إلى حساب الرسائل غير صحيح (تأكد من أن إسم المستخدم وكلمة المرور الذي إستخدمتهم هو نفسهم الذي تستخدمهم عند دخولك إلى موقع سوفتكس";
                    break;
                case "MsgNeedRevision":
                    response_message = "الرساله تحتاج الى المراجعه";
                    break;
                case "NoCredit":
                    response_message = "إن رصيدك لدى موبايلي قد إنتهى ولم يعد به أي رسائل. (لحل المشكلة قم بشحن رصيدك من الرسائل لدى موبايلي. لشحن رصيدك إتبع تعليمات شحن الرصيد";
                    break;
                case "NoSuccessPhones":
                    response_message = "رقم الموبايل خطأ";
                    break;

                default:
                    response_message = ID;
                    break;
            }
            return response_message;
        }
        public static string SendMessageTaqnyatKSA(string username, string password, string msg, string sender, string number)
        {
            string strResponse;
            try
            {
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Ssl3 | SecurityProtocolType.Tls;
                ServicePointManager.Expect100Continue = true;

                HttpWebRequest req = (HttpWebRequest)WebRequest.Create("https://api.taqnyat.sa/v1/messages");
                req.Method = "POST";

                req.ContentType = "application/json";
                req.Headers.Add("Authorization", "Bearer " + password);






                SendTaqClass objStudent = new SendTaqClass();

                objStudent.body = msg;
                objStudent.recipients = number;
                objStudent.sender = sender;






                Byte[] byteArray = System.Text.Encoding.UTF8.GetBytes(JSONSerialize(objStudent));
                req.ContentLength = byteArray.Length;
                Stream newStream = req.GetRequestStream();
                newStream.Write(byteArray, 0, byteArray.Length);
                newStream.Close();


                StreamReader stIn = new StreamReader(req.GetResponse().GetResponseStream());
                strResponse = stIn.ReadToEnd();
                stIn.Close();


                return strResponse;
            }
            catch (WebException ex)
            {
                using (WebResponse response = ex.Response)
                {
                    HttpWebResponse httpResponse1 = (HttpWebResponse)response;
                    try
                    {
                        using (Stream data = response.GetResponseStream())
                        {
                            using (var reader = new StreamReader(data))
                            {
                                strResponse = reader.ReadToEnd();
                            }
                        }

                        return strResponse;
                    }
                    catch (Exception exGetResp)
                    {
                        throw exGetResp;
                    }

                }
            }

            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
            }

        }

        #endregion

        #region Send_Email
        public static bool IsValidEmail(string email)
        {
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == email;
            }
            catch
            {
                return false;
            }
        }
        #endregion
    }
    public class Email_Parameters
    {
        public string From_Email { set; get; }
        public string From_Email_Password { set; get; }
        public string Email_Host { set; get; }
        public int Email_Port { set; get; }

        public string From_Name { set; get; }

        public string To_Email { set; get; }
        public string To_Name { set; get; }

        public string Subject { set; get; }
        public string HTML_Body { set; get; }

        public bool EnableSSL { set; get; }
        public bool UseDefaultCredentials { set; get; }

    }
}
