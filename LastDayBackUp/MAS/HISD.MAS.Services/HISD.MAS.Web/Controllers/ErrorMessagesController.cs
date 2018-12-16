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
    public class ErrorMessagesController : ODataController
    {
        private MASContext db = new MASContext();

        // GET: odata/ ErrorMessages
        [EnableQuery]
        public IQueryable<ErrorMessage> Get()
        {
            return db.ErrorMessages;
        }

        // GET: odata/ ErrorMessages(5)
        [EnableQuery]
        public SingleResult<ErrorMessage> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.ErrorMessages.Where(em => em.ErrorMessageID == key));
        }
        //update operations
        //POST: odata/create a New  ErrorMessage
        public IHttpActionResult Post(ErrorMessage errormessage)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            db.ErrorMessages.Add(errormessage);
            db.SaveChanges();
            return ResponseMessage(Request.CreateResponse(HttpStatusCode.Created, errormessage));
            //return Created(errormessage);
        }

        // PUT: odata/Complete update an  ErrorMessage 
        public IHttpActionResult Put([FromODataUri] int key, ErrorMessage errormessage)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var currentErrorMessage = db.ErrorMessages.FirstOrDefault(em => em.ErrorMessageID == key);

            if (currentErrorMessage == null)
            {
                return NotFound();
            }

            errormessage.ErrorMessageID = currentErrorMessage.ErrorMessageID;
            db.Entry(currentErrorMessage).CurrentValues.SetValues(errormessage);
            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

        // PATCH: odata/Partial update an existing  ErrorMessage
        public IHttpActionResult Patch([FromODataUri] int key, Delta<ErrorMessage> patch)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var currentErrorMessage = db.ErrorMessages.FirstOrDefault(em => em.ErrorMessageID == key);
            if (currentErrorMessage == null)
            {
                return NotFound();
            }
            patch.Patch(currentErrorMessage);
            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);

        }

        // DELETE: odata/ ErrorMessages(5)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var currentErrorMessage = db.ErrorMessages.FirstOrDefault(em => em.ErrorMessageID == key);

            if (currentErrorMessage == null)
            {
                return NotFound();
            }

            db.ErrorMessages.Remove(currentErrorMessage);
            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);

        }

        private bool ErrorMessagesExists(int key)
        {
            return db.ErrorMessages.Count(em => em.ErrorMessageID == key) > 0;
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
