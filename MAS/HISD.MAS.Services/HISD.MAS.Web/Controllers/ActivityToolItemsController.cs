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
    public class ActivityToolItemsController : ODataController
    {
        private MASContext db = new MASContext();
        private string connectionStringMAS = System.Configuration.ConfigurationManager.ConnectionStrings["MASContext"].ConnectionString;

        // GET: odata/ActivityToolItems
        [EnableQuery]
        public IQueryable<ActivityToolItem> Get()
        {
            return db.ActivityToolItems;
        }

        // GET: odata/ActivityCodes(5)
        [EnableQuery]
        public SingleResult<ActivityToolItem> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.ActivityToolItems.Where(ati => ati.ActivityToolItemID == key));
        }
        /*------  DB Update operations ------- */

        //POST: odata/create a New  ActivityToolItem
        public IHttpActionResult Post(ActivityToolItem activitytoolitem)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            db.ActivityToolItems.Add(activitytoolitem);
            db.SaveChanges();
            return ResponseMessage(Request.CreateResponse(HttpStatusCode.Created, activitytoolitem));
            //return Created(homemessage);
        }

        // PUT: odata/Complete update an ActivityToolItem
        public IHttpActionResult Put([FromODataUri] int key, ActivityToolItem activitytoolitem)
        {
            // Locking the DB transaction
            var putActivityToolItemLock = new SqlDistributedLock("putActivityToolItemLock", connectionStringMAS);

            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var currentActivityToolItem = db.ActivityToolItems.FirstOrDefault(ati => ati.ActivityToolItemID == key);

                if (currentActivityToolItem == null)
                {
                    return NotFound();
                }
                // this block of code is protected by the lock!
                using (putActivityToolItemLock.Acquire())
                {
                    activitytoolitem.ActivityToolItemID = currentActivityToolItem.ActivityToolItemID;
                    db.Entry(currentActivityToolItem).CurrentValues.SetValues(activitytoolitem);
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

        // PATCH: odata/Partial update an existing  ActivityToolItem
        public IHttpActionResult Patch([FromODataUri] int key, Delta<ActivityToolItem> patch)
        {
            // Locking the DB transaction
            var patchActivityToolItemLock = new SqlDistributedLock("patchActivityToolItemLock", connectionStringMAS);

            try
            {

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var currentActivityToolItem = db.ActivityToolItems.FirstOrDefault(ati => ati.ActivityToolItemID == key);
                if (currentActivityToolItem == null)
                {
                    return NotFound();
                }

                // this block of code is protected by the lock!
                using (patchActivityToolItemLock.Acquire())
                {
                    patch.Patch(currentActivityToolItem);
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

        // DELETE: odata/ ActivityToolItems(5)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var currentActivityToolItem = db.ActivityToolItems.FirstOrDefault(ati => ati.ActivityToolItemID == key);

            if (currentActivityToolItem == null)
            {
                return NotFound();
            }

            db.ActivityToolItems.Remove(currentActivityToolItem);
            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);

        }
        
        private bool currentActivityToolItemExists(int key)
        {
            return db.ActivityToolItems.Count(ati => ati.ActivityToolItemID == key) > 0;
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
