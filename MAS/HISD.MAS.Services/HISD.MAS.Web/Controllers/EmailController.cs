using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.OData;
using System.Web.OData.Query;
using System.Web.OData.Routing;
using HISD.MAS.DAL.Models;
using System.Threading.Tasks;
using System.Web.ModelBinding;
using Microsoft.OData.UriParser;
using System.Reflection;
using System.Web;
using System.Web.OData.Builder;
using System.Web.OData.Extensions;
using HISD.MAS.DAL.Models.Mapping;
using HISD.MAS.DAL.Models.EDW;
using HISD.MAS.DAL.Models.EDWMapping;
using HISD.MAS.Web.Helpers;
using Medallion.Threading.Sql;
using System.Net.Mail;


namespace HISD.MAS.Web.Controllers
{
    public class EmailController : ODataController
    {
       [HttpPost]
        [ODataRoute("SendEmailCIC")]
        public IHttpActionResult SendEmailCIC(CampusContactArray campusContactArray)
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
                MailMessage message = new MailMessage();
                message.From = new MailAddress("no-reply@houstonisd.org", "MAS", System.Text.Encoding.UTF8);
                // Set destinations for the e-mail message.
                //MailAddress to;// = new MailAddress(email.To);
                string[] emials = campusContactArray.To.Split(',');
                foreach (string Multiemails in emials)
                {
                    message.To.Add(new MailAddress(Multiemails));
                }
                // Specify the message content.

                message.Body = campusContactArray.Body;
                message.IsBodyHtml = true;
                message.BodyEncoding = System.Text.Encoding.UTF8;
                message.Subject = campusContactArray.Subject;
                message.SubjectEncoding = System.Text.Encoding.UTF8;

                //don't send emails.  This is useful when you are testing from Visual Studio from your PC
                // if (RunMode != "NO_EMAIL")
                // {
                client.Send(message);
                //  }
                message.Dispose();
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return ResponseMessage(Request.CreateResponse(HttpStatusCode.Created, campusContactArray));
        }

    }
}