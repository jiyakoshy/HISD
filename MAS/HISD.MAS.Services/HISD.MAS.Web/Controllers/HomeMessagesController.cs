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
using Medallion.Threading.Sql;

namespace HISD.MAS.Web.Controllers
{
    public class HomeMessagesController : ODataController
    {
        private MASContext db = new MASContext();
        private string connectionStringMAS = System.Configuration.ConfigurationManager.ConnectionStrings["MASContext"].ConnectionString;

        // GET: odata/ HomeMessages
        [EnableQuery]
        public IQueryable<HomeMessage> Get()
        {
            return db.HomeMessages;
        }

        // GET: odata/ HomeMessages(5)
        [EnableQuery]
        public SingleResult<HomeMessage> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.HomeMessages.Where(hm => hm.HomeMessageID == key));
        }
        /*------  DB Update operations ------- */

        //POST: odata/create a New  HomeMessages
        public IHttpActionResult Post(HomeMessage homemessage)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            db.HomeMessages.Add(homemessage);
            db.SaveChanges();
            return ResponseMessage(Request.CreateResponse(HttpStatusCode.Created, homemessage));
            //return Created(homemessage);
        }

        // PUT: odata/Complete update an  HomeMessages
        public IHttpActionResult Put([FromODataUri] int key, HomeMessage homemessage)
        {
            // Locking the DB transaction
            var putHomeMessageLock = new SqlDistributedLock("putHomeMessageLock", connectionStringMAS);

            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var currentHomeMessage = db.HomeMessages.FirstOrDefault(hm => hm.HomeMessageID == key);

                if (currentHomeMessage == null)
                {
                    return NotFound();
                }
                // this block of code is protected by the lock!
                using (putHomeMessageLock.Acquire())
                {
                    homemessage.HomeMessageID = currentHomeMessage.HomeMessageID;
                    db.Entry(currentHomeMessage).CurrentValues.SetValues(homemessage);
                    db.SaveChanges();
                }

            }

            catch (ArgumentNullException)
            {
                throw new HttpResponseException(HttpStatusCode.BadRequest);
            }
            catch (Exception ex)
            {
                // CUSTOM Exception Filters to generate Http Error Response 
                //throw new HttpResponseException(HttpStatusCode.NotAcceptable);
                throw ex;
            }
            return StatusCode(HttpStatusCode.NoContent);
        }

        // PATCH: odata/Partial update an existing  HomeMessage
        public IHttpActionResult Patch([FromODataUri] int key, Delta<HomeMessage> patch)
        {
            // Locking the DB transaction
            var patchHomeMessageLock = new SqlDistributedLock("patchHomeMessageLock", connectionStringMAS);

            try
            {

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var currentHomeMessage = db.HomeMessages.FirstOrDefault(hm => hm.HomeMessageID == key);
                if (currentHomeMessage == null)
                {
                    return NotFound();
                }
                // this block of code is protected by the lock!
                using (patchHomeMessageLock.Acquire())
                {
                    patch.Patch(currentHomeMessage);
                    db.SaveChanges();
                }
            }
            catch (ArgumentNullException)
            {
                throw new HttpResponseException(HttpStatusCode.BadRequest);
            }
            catch (Exception ex)
            {
                // CUSTOM Exception Filters to generate Http Error Response 
                //throw new HttpResponseException(HttpStatusCode.NotAcceptable);
                throw ex;
            }
            
            return StatusCode(HttpStatusCode.NoContent);
        }

        // DELETE: odata/ HomeMessages(5)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var currentHomeMessage = db.HomeMessages.FirstOrDefault(hm => hm.HomeMessageID == key);

            if (currentHomeMessage == null)
            {
                return NotFound();
            }

            db.HomeMessages.Remove(currentHomeMessage);
            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);

        }

        private bool HomeMessagesExists(int key)
        {
            return db.HomeMessages.Count(hm => hm.HomeMessageID == key) > 0;
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
