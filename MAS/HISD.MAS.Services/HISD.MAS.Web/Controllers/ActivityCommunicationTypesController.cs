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
    public class ActivityCommunicationTypesController : ODataController
    {
        private MASContext db = new MASContext();
        private string connectionStringMAS = System.Configuration.ConfigurationManager.ConnectionStrings["MASContext"].ConnectionString;

        // GET: odata/ActivityCommunicationTypes
        [EnableQuery]
        public IQueryable<ActivityCommunicationType> Get()
        {
            return db.ActivityCommunicationTypes;
        }

        // GET: odata/ActivityCommunicationTypes(5)
        [EnableQuery]
        public SingleResult<ActivityCommunicationType> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.ActivityCommunicationTypes.Where(act => act.ActivityCommunicationTypeID == key));
        }
        /*------  DB Update operations ------- */

        //POST: odata/create a New ActivityCommunicationType
        public IHttpActionResult Post(ActivityCommunicationType activitycomtype)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            db.ActivityCommunicationTypes.Add(activitycomtype);
            db.SaveChanges();
            return ResponseMessage(Request.CreateResponse(HttpStatusCode.Created, activitycomtype));
            //return Created(activitycomtype);
        }

        // PUT: odata/Complete update an existing ActivityCommunicationType 
        public IHttpActionResult Put([FromODataUri] int key, ActivityCommunicationType activitycomtype)
        {
            // Locking the DB transaction
            var putActivityCommunicationTypeLock = new SqlDistributedLock("putActivityCommunicationTypeLock", connectionStringMAS);

            try 
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var currentActivityComType = db.ActivityCommunicationTypes.FirstOrDefault(act => act.ActivityCommunicationTypeID == key);

                if (currentActivityComType == null)
                {
                    return NotFound();
                }
                // this block of code is protected by the lock!
                using (putActivityCommunicationTypeLock.Acquire())
                {
                    activitycomtype.ActivityCommunicationTypeID = currentActivityComType.ActivityCommunicationTypeID;
                    db.Entry(currentActivityComType).CurrentValues.SetValues(activitycomtype);
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

        // PATCH: odata/Partial update an existing ActivityCommunicationType
        public IHttpActionResult Patch([FromODataUri] int key, Delta<ActivityCommunicationType> patch)
        {
            // Locking the DB transaction
            var patchActivityCommunicationTypeLock = new SqlDistributedLock("patchActivityCommunicationTypeLock", connectionStringMAS);

            try 
            {

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var currentActivityComType = db.ActivityCommunicationTypes.FirstOrDefault(act => act.ActivityCommunicationTypeID == key);
                if (currentActivityComType == null)
                {
                    return NotFound();
                }

                // this block of code is protected by the lock!
                using (patchActivityCommunicationTypeLock.Acquire())
                {
                    patch.Patch(currentActivityComType);
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

        // DELETE: odata/ActivityCommunicationType(5)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var currentActivityComType = db.ActivityCommunicationTypes.FirstOrDefault(act => act.ActivityCommunicationTypeID == key);

            if (currentActivityComType == null)
            {
                return NotFound();
            }

            db.ActivityCommunicationTypes.Remove(currentActivityComType);
            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);

        }

        private bool ActivityComTypeExists(int key)
        {
            return db.ActivityCommunicationTypes.Count(act => act.ActivityCommunicationTypeID == key) > 0;
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
