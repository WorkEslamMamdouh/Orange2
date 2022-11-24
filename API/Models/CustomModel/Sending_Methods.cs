using Inv.API.Controllers; 
using Inv.BLL.Services.IControl;
using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;
using Inv.API.Tools;

namespace Inv.API
{
    public class Sending_Methods : BaseController
    {

        public string Send_SMS(string SMS_Provider, string username, string password, string msg, string sender, string number, int? CompCode)
        {
            string msg1 = "";  
              
                if (SMS_Provider == "Taqnyat")
                {
                    msg1 = Send_Taqnyat_KSA(username, password, msg, sender, number, CompCode);

                }
                else if (SMS_Provider == "Softex")
                {
                    Boolean IsUniCode = true;
                    string[] numbers = new string[1];
                    numbers[0] = number;
                    msg1 = Send_SMS_Softex(username, password, msg, numbers, IsUniCode, CompCode);
                }

            return msg1;

        }
       
        #region Send_SMS_Softex
        public string Send_SMS_Softex(string Email, string Password, string Message, string[] MobileNumbers, Boolean IsUniCode, int? CompCode)
        {
            IsUniCode = true;
            #region Number_verification
            string[] Number = new string[1];
            int Number_Lenght = MobileNumbers[0].Length;
            string SecStr = "SoftexSms@MiniClients";
            if (Number_Lenght == 12)
            {
                string str = MobileNumbers[0].Substring(1, 2);
                if (str != "01")
                {
                    return "Please enter a valid number  starting with (01)";
                }
                else
                {
                    string N = MobileNumbers[0];
                    Number[0] = N;
                    //Number[0] = "2" + N;

                }
            }
            else if (Number_Lenght > 12)
            {
                string str = MobileNumbers[0].Substring(0, 1);
                if (str != "0")
                {
                    string N = MobileNumbers[0].Replace("+2", "");
                    Number[0] = "2" + N;

                    if (Number[0].Length != 12)
                    {
                        return "Please enter a valid number (11 digits)";
                    }
                    else
                    {
                        Number[0] = MobileNumbers[0];
                    }

                }
                else
                {
                    return "Please enter a valid number starting with (010) OR (011) OR (012) ";
                }
            }

            #endregion



            I_Control I_Control = db.I_Control.Where(x => x.CompCode == CompCode).FirstOrDefault();
            if (I_Control.UsedMSGs <= I_Control.MaxYearlyMSGs || I_Control.MaxYearlyMSGs == 0)
            {

                string Response_ID = Helping_Methods.SendMessageSoftex(SecStr, Email, Password, Message, Number, IsUniCode);

                if (Response_ID == "1")
                {
                    var _Length = 0;
                    if (Message.Length % 70 > 0)
                    {
                        _Length = (Message.Length / 70) + 1;
                    }
                    I_Control.UsedMSGs += _Length;
                    string query = "UPDATE I_Control SET UsedMSGs = " + I_Control.UsedMSGs + " WHERE CompCode = " + CompCode.ToString();
                    db.Database.ExecuteSqlCommand(query);
                }

                return Helping_Methods.Response_SoftexsmsMessage(Response_ID);
            }
            else
            {
                return "تم نفاذ عدد الرسائل المتاحة";
            }

        }
        #endregion


        #region Send_SMS_HISMS
        public string Send_SMS_HISMS1(string username, string password, string number, string sender, string msg, int? CompCode)
        {
            #region Number_verification
            string Number = "";
            int Number_Lenght = number.Length;

            if (Number_Lenght == 10)
            {
                string str = number.Substring(0, 2);
                if (str != "05")
                {
                    return "Please enter a valid number  starting with (05)";
                }
                else
                {
                    string N = number.Substring(1, 9);
                    Number = "00966" + N;

                }
            }
            else if (Number_Lenght > 10)
            {
                string str = number.Substring(0, 2);
                if (str != "00")
                {
                    string N = number.Replace("+", "");
                    str = N.Substring(0, 4);
                    if (str != "9665")
                    {
                        str = N.Substring(0, 5);
                        if (str == "09665")
                        {
                            Number = "0" + N;
                            if (Number.Length != 14)
                            {
                                return "Please enter a valid number (14 digits)";
                            }
                            else
                            {
                                Number = number;
                            }

                        }
                        else
                        {
                            return "Please enter a valid number starting with (9665) OR (009665) OR (09665) ";
                        }
                    }

                    else
                    {
                        Number = "00" + N;
                        if (Number.Length != 14)
                        {
                            return "Please enter a valid number (14 digits)";
                        }
                        else
                        {
                            Number = number;
                        }

                    }
                }
                else
                {
                    if (Number_Lenght != 14)
                    {
                        return "Please enter a valid number of (14 digits)";
                    }
                    else
                    {
                        string str_1 = number.Substring(0, 6);
                        if (str_1 != "009665")
                        {
                            return "Please enter a valid number starting with (009665)";
                        }
                        else
                        {
                            Number = number;
                        }

                    }
                }
            }
            else
            {
                return "Please enter a valid number of 10 or 14 digits";
            }
            #endregion
            I_Control I_Control = db.I_Control.Where(x => x.CompCode == CompCode).FirstOrDefault();
            if (I_Control.UsedMSGs <= I_Control.MaxYearlyMSGs || I_Control.MaxYearlyMSGs == 0)
            {
                string Response_ID = Helping_Methods.SendMessageHISMS(username, password, Number, sender, Helping_Methods.ConvertToUnicode(msg));

                if (Response_ID == "1")
                {
                    I_Control.UsedMSGs += 1;
                    string query = "UPDATE I_Control SET UsedMSGs = " + I_Control.UsedMSGs + " WHERE CompCode = " + CompCode.ToString();
                    db.Database.ExecuteSqlCommand(query);
                }

                return Helping_Methods.Response_HismsMessage(Response_ID);
            }
            else
            {
                return "تم نفاذ عدد الرسائل المتاحة";
            }

        }
        #endregion

        #region Send_Email

        public string Send_Email(Email_Parameters Email_params)
        {
            try
            {

                if (
                    Email_params.From_Email == string.Empty ||
                    Email_params.From_Name == string.Empty ||
                    Email_params.Email_Host == string.Empty ||
                    Email_params.From_Email_Password == string.Empty ||
                    Email_params.To_Email == string.Empty ||
                    Email_params.To_Name == string.Empty || Email_params.HTML_Body == string.Empty
                    )
                {
                    return "Please enter values for all 11 prammeters";
                }
                #region Email_verification
                //if (!Helping_Methods.IsValidEmail(Email_params.From_Email))
                //{
                //    return "Please enter a Valid From Email";
                //}

                //if (!Helping_Methods.IsValidEmail(Email_params.To_Email))
                //{
                //    return "Please enter a Valid To Email";
                //}
                #endregion

                MailMessage m = new MailMessage();
                SmtpClient sc = new SmtpClient();
                var fromAddress = new MailAddress(Email_params.From_Email, Email_params.From_Name);
                var toAddress = new MailAddress(Email_params.To_Email, Email_params.To_Name);
                string fromPassword = Email_params.From_Email_Password;
                string subject = Email_params.Subject;
                // Timeout = 100000,

                string msgBody = Email_params.HTML_Body;
                var smtp = new SmtpClient
                {
                    Host = Email_params.Email_Host,
                    Port = Email_params.Email_Port,

                    EnableSsl = Email_params.EnableSSL,
                    DeliveryMethod = SmtpDeliveryMethod.Network,
                    UseDefaultCredentials = /*Email_params.UseDefaultCredentials*/false,
                    Credentials = new System.Net.NetworkCredential(fromAddress.Address, fromPassword)
                };
                using (var message = new MailMessage(fromAddress, toAddress)
                {
                    Subject = subject,
                    Body = msgBody,
                    HeadersEncoding = Encoding.UTF8,

                })
                //message.Sender = 
                {

                    message.IsBodyHtml = true;
                    smtp.Send(message);
                }
                return "Message Sent";

            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }
        public string Send_Email(Email_Parameters Email_params, string Attachment_Path)
        {
            try
            {

                if (
                    Email_params.From_Email == string.Empty ||
                    Email_params.From_Name == string.Empty ||
                    Email_params.Email_Host == string.Empty ||
                    Email_params.From_Email_Password == string.Empty ||
                    Email_params.To_Email == string.Empty ||
                    Email_params.To_Name == string.Empty || Email_params.HTML_Body == string.Empty
                    )
                {
                    return "Please enter values for all 11 prammeters";
                }
                #region Email_verification
                //if (!Helping_Methods.IsValidEmail(Email_params.From_Email))
                //{
                //    return "Please enter a Valid From Email";
                //}

                //if (!Helping_Methods.IsValidEmail(Email_params.To_Email))
                //{
                //    return "Please enter a Valid To Email";
                //}
                #endregion

                MailMessage m = new MailMessage();
                SmtpClient sc = new SmtpClient();
                var fromAddress = new MailAddress(Email_params.From_Email, Email_params.From_Name);
                var toAddress = new MailAddress(Email_params.To_Email, Email_params.To_Name);
                string fromPassword = Email_params.From_Email_Password;
                string subject = Email_params.Subject;

                Attachment att = new Attachment(Attachment_Path);
                att.ContentDisposition.Inline = true;

                string msgBody = Email_params.HTML_Body;
                var smtp = new SmtpClient
                {
                    Host = Email_params.Email_Host,
                    Port = Email_params.Email_Port,
                    EnableSsl = Email_params.EnableSSL,
                    DeliveryMethod = SmtpDeliveryMethod.Network,
                    UseDefaultCredentials = Email_params.UseDefaultCredentials,
                    Credentials = new System.Net.NetworkCredential(fromAddress.Address, fromPassword)
                };
                using (var message = new MailMessage(fromAddress, toAddress)
                {
                    Subject = subject,
                    Body = msgBody,
                    HeadersEncoding = Encoding.UTF8
                })
                {
                    message.Attachments.Add(att);
                    message.IsBodyHtml = true;
                    smtp.Send(message);
                }
                return "Message Sent";

            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }
        #endregion

        #region random_Number
        public string Random_Numbers()
        {
            string S, M, D, H, MM, SS;
            S = DateTime.Now.ToString("yyyy/MM/dd hh:mm:ss");
            M = S.Substring(5, 2);
            D = S.Substring(8, 2);
            H = S.Substring(11, 2);
            MM = S.Substring(14, 2);
            SS = S.Substring(17, 2);
            int N;
            N = int.Parse(M) * 100 + int.Parse(D) + 1111 + int.Parse(H) + int.Parse(MM) + int.Parse(SS) * 101;
            return N.ToString();
        }
        #endregion
        public string Send_Taqnyat_KSA(string username, string password, string msg, string sender, string number, int? CompCode)
        {
            string Number = "";
            string number_ = number;
            if (number_ == null || number_.Length < 9 || number_.Length > 14)
            {
                return "خطأ في الرقم المرسل اليه";
            }
            else
            {
                int Number_Lenght = number_.Length;

                if (Number_Lenght == 10)
                {
                    string str = number_.Substring(0, 2);
                    if (str != "05")
                    {
                        return "Please enter a valid number  starting with (05)";
                    }
                    else
                    {
                        string N = number_.Substring(1, 9);
                        Number = "00966" + N;

                    }
                }
                else if (Number_Lenght > 10)
                {
                    string str = number_.Substring(0, 2);
                    if (str != "00")
                    {
                        string N = number_.Replace("+", "");
                        str = N.Substring(0, 4);
                        if (str != "9665")
                        {
                            str = N.Substring(0, 5);
                            if (str == "09665")
                            {
                                Number = "0" + N;
                                if (Number.Length != 14)
                                {
                                    return "Please enter a valid number (14 digits)";
                                }
                                else
                                {
                                    Number = number_;
                                }

                            }
                            else
                            {
                                return "Please enter a valid number starting with (9665) OR (009665) OR (09665) ";
                            }
                        }

                        else
                        {
                            Number = "00" + N;
                            if (Number.Length != 14)
                            {
                                return "Please enter a valid number (14 digits)";
                            }
                            else
                            {
                                Number = number_;
                            }

                        }
                    }
                    else
                    {
                        if (Number_Lenght != 14)
                        {
                            return "Please enter a valid number of (14 digits)";
                        }
                        else
                        {
                            string str_1 = number_.Substring(0, 6);
                            if (str_1 != "009665")
                            {
                                return "Please enter a valid number starting with (009665)";
                            }
                            else
                            {
                                Number = number_;
                            }

                        }
                    }
                }
                else
                {
                    return "Please enter a valid number of 10 or 14 digits";
                } 

            }
            I_Control I_Control = db.I_Control.Where(x => x.CompCode == CompCode).FirstOrDefault();
            if (I_Control.UsedMSGs <= I_Control.MaxYearlyMSGs || I_Control.MaxYearlyMSGs == 0)
            {

                string Response_ID = Helping_Methods.SendMessageTaqnyatKSA(username, password, msg, sender, number);
 
                if (Response_ID.Substring(14, 3) == "201")
                {
                    var _Length = 0;
                    if (msg.Length % 70 > 0)
                    {
                        _Length = (msg.Length / 70) + 1;
                    }
                    I_Control.UsedMSGs += _Length;
                    string query = "UPDATE I_Control SET UsedMSGs = " + I_Control.UsedMSGs + " WHERE CompCode = " + CompCode.ToString();
                    db.Database.ExecuteSqlCommand(query);
                   // Helping_Methods.Response_KSAsmsMessage(Response_ID);
                }
               return "لقد تمت العملية بنجاح";
                //return Helping_Methods.Response_KSAsmsMessage(Response_ID); 

            }
            else
            {
                return "تم نفاذ عدد الرسائل المتاحة";
            }

        }
    }
}
