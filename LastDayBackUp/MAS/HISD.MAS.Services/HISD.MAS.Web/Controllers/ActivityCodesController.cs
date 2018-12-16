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
    public class ActivityCodesController : ODataController
    {
        private MASContext db = new MASContext();
        private string connectionStringMAS = System.Configuration.ConfigurationManager.ConnectionStrings["MASContext"].ConnectionString;

        // GET: odata/ActivityCodes
        [EnableQuery]
        public IQueryable<ActivityCode> Get()
        {
            return db.ActivityCodes;
        }

        // GET: odata/ActivityCodes(5)
        [EnableQuery]
        public SingleResult<ActivityCode> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.ActivityCodes.Where(ac => ac.ActivityCodeID == key));
        }
        /*------  DB Update operations ------- */

        //POST: odata/create a New Activity Code
        public IHttpActionResult Post(ActivityCode activitycode)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            db.ActivityCodes.Add(activitycode);
            db.SaveChanges();
            return ResponseMessage(Request.CreateResponse(HttpStatusCode.Created, activitycode));
            
        }

        // PUT: odata/Complete update an existing Activity Code 
        public IHttpActionResult Put([FromODataUri] int key, ActivityCode activitycode)
        {
            // Locking the DB transaction
            var putActivityCodeLock = new SqlDistributedLock("putActivityCodeLock", connectionStringMAS);

            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var currentActivitycode = db.ActivityCodes.FirstOrDefault(m => m.ActivityCodeID == key);

                if (currentActivitycode == null)
                {
                    return NotFound();
                }

                // this block of code is protected by the lock!
                using (putActivityCodeLock.Acquire())
                {
                    activitycode.ActivityCodeID = activitycode.ActivityCodeID;
                    db.Entry(currentActivitycode).CurrentValues.SetValues(activitycode);
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

        // PATCH: odata/Partial update an existing Activity Code
        public IHttpActionResult Patch([FromODataUri] int key, Delta<ActivityCode> patch)
        {
            // Locking the DB transaction
            var patchActivityCodeLock = new SqlDistributedLock("patchActivityCodeLock", connectionStringMAS);

            try
            {

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);

                }

                var currentActivitycode = db.ActivityCodes.FirstOrDefault(ac => ac.ActivityCodeID == key);
                if (currentActivitycode == null)
                {
                    return NotFound();
                }
                // this block of code is protected by the lock!
                using (patchActivityCodeLock.Acquire())
                {
                    patch.Patch(currentActivitycode);
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

        // DELETE: odata/ActivityCodes(5)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var currentActivitycode = db.ActivityCodes.FirstOrDefault(ac => ac.ActivityCodeID == key);

            if (currentActivitycode == null)
            {
                return NotFound();
            }

            db.ActivityCodes.Remove(currentActivitycode);
            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);

        }

        private bool ActivitycodeExists(int key)
        {
            return db.ActivityCodes.Count(ac => ac.ActivityCodeID == key) > 0;
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
