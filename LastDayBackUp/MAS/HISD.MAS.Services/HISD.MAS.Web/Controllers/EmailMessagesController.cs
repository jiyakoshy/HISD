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
namespace HISD.MAS.Web.Controllers
{
    public class EmailMessagesController : ODataController
    {
        private MASContext db = new MASContext();

        // GET: odata/EmailMessages
        [EnableQuery]
        public IQueryable<EmailMessage> Get()
        {
            return db.EmailMessages;
        }

        // GET: odata/EmailMessages(5)
        [EnableQuery]
        public SingleResult<EmailMessage> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.EmailMessages.Where(em => em.EmailMessageID == key));
        }
        //update operations
        //POST: odata/create a New EmailMessage
        public IHttpActionResult Post(EmailMessage emailmessage)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            db.EmailMessages.Add(emailmessage);
            db.SaveChanges();
            return ResponseMessage(Request.CreateResponse(HttpStatusCode.Created, emailmessage));
            //return Created(emailmessage);
        }

        // PUT: odata/Complete update an EmailMessage 
        public IHttpActionResult Put([FromODataUri] int key, EmailMessage emailmessage)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var currentEmailMessage = db.EmailMessages.FirstOrDefault(em => em.EmailMessageID == key);

            if (currentEmailMessage == null)
            {
                return NotFound();
            }

            emailmessage.EmailMessageID = currentEmailMessage.EmailMessageID;
            db.Entry(currentEmailMessage).CurrentValues.SetValues(emailmessage);
            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

        // PATCH: odata/Partial update an existing EmailMessage
        public IHttpActionResult Patch([FromODataUri] int key, Delta<EmailMessage> patch)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var currentEmailMessage = db.EmailMessages.FirstOrDefault(em => em.EmailMessageID == key);
            if (currentEmailMessage == null)
            {
                return NotFound();
            }
            patch.Patch(currentEmailMessage);
            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);

        }

        // DELETE: odata/EmailMessages(5)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var currentEmailMessage = db.EmailMessages.FirstOrDefault(em => em.EmailMessageID == key);

            if (currentEmailMessage == null)
            {
                return NotFound();
            }

            db.EmailMessages.Remove(currentEmailMessage);
            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);

        }

        private bool EmailMessagesExists(int key)
        {
            return db.EmailMessages.Count(em => em.EmailMessageID == key) > 0;
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
