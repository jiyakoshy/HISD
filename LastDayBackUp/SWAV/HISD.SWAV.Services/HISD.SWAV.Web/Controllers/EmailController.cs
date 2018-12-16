using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using HISD.SWAV.Web.Models;
using System.Net.Mail;

namespace HISD.SWAV.Web.Controllers
{
    public class EmailController : ApiController
    {
        public IHttpActionResult Post(Email email)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            SmtpClient client = new SmtpClient("MAIL.HOUSTONISD.ORG");
            try
            {
                // Specify the e-mail sender.
                // Create a mailing address that includes a UTF8 character in the display name.
                //MailAddress from = new MailAddress("P00126358@houstonisd.org", "School Waivers", System.Text.Encoding.UTF8);

                //MailAddress from = new MailAddress("no-reply@houstonisd.org", "School Waivers", System.Text.Encoding.UTF8);

                // Set destinations for the e-mail message.
                //MailAddress to = new MailAddress(email.To);

                // Specify the message content.
                MailMessage message = new MailMessage();
                //From Address.....
                message.From = new MailAddress("no-reply@houstonisd.org", "School Waivers", System.Text.Encoding.UTF8);
                string[] emials = email.To.Split(',');
                foreach (string Multiemails in emials)
                {
                    message.To.Add(new MailAddress(Multiemails));   //To Address.....
                }
                message.Body = email.Body;
                message.IsBodyHtml = true;
                message.BodyEncoding = System.Text.Encoding.UTF8;
                message.Subject = email.Subject;
                message.SubjectEncoding = System.Text.Encoding.UTF8;

                //don't send emails.  This is useful when you are testing from Visual Studio from your PC
               // if (RunMode != "NO_EMAIL")
               // {
                    client.Send(message);
              //  }
                message.Dispose();
            }
            catch(Exception ex)
            {
                throw ex;
            }
            return ResponseMessage(Request.CreateResponse(HttpStatusCode.Created, email));
        }

    }
}
