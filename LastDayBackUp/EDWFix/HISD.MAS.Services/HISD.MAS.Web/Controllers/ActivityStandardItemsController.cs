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
    public class ActivityStandardItemsController : ODataController
    {
        private MASContext db = new MASContext();
        private string connectionStringMAS = System.Configuration.ConfigurationManager.ConnectionStrings["MASContext"].ConnectionString;

        // GET: odata/ActivityStandardItems
        [EnableQuery]
        public IQueryable<ActivityStandardItem> Get()
        {
            return db.ActivityStandardItems;
        }

        // GET: odata/ActivityStandardItems(5)
        [EnableQuery]
        public SingleResult<ActivityStandardItem> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.ActivityStandardItems.Where(asi => asi.ActivityStandardItemID == key));
        }
        /*------  DB Update operations ------- */
        
        //POST: odata/create a New ActivityStandardItem
        public IHttpActionResult Post(ActivityStandardItem activitystandarditem)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            db.ActivityStandardItems.Add(activitystandarditem);
            db.SaveChanges();
            return ResponseMessage(Request.CreateResponse(HttpStatusCode.Created, activitystandarditem));
           
        }

        // PUT: odata/Complete update an existing ActivityStandardItem 
        public IHttpActionResult Put([FromODataUri] int key, ActivityStandardItem activitystandarditem)
        {
            // Locking the DB transaction
            var putActivityStandardItemLock = new SqlDistributedLock("putActivityStandardItemLock", connectionStringMAS);

            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var currentActivityStandardItem = db.ActivityStandardItems.FirstOrDefault(asi => asi.ActivityStandardItemID == key);

                if (currentActivityStandardItem == null)
                {
                    return NotFound();
                }
                // this block of code is protected by the lock!
                using (putActivityStandardItemLock.Acquire())
                {
                    activitystandarditem.ActivityStandardGroupID = currentActivityStandardItem.ActivityStandardGroupID;
                    db.Entry(currentActivityStandardItem).CurrentValues.SetValues(currentActivityStandardItem);
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

        // PATCH: odata/Partial update an existing ActivityStandardItem
        public IHttpActionResult Patch([FromODataUri] int key, Delta<ActivityStandardItem> patch)
        {
            // Locking the DB transaction
            var patchActivityStandardItemLock = new SqlDistributedLock("patchActivityStandardItemLock", connectionStringMAS);

            try
            {

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var currentActivityStandardItem = db.ActivityStandardItems.FirstOrDefault(asi => asi.ActivityStandardItemID == key);
                if (currentActivityStandardItem == null)
                {
                    return NotFound();
                }

                // this block of code is protected by the lock!
                using (patchActivityStandardItemLock.Acquire())
                {
                    patch.Patch(currentActivityStandardItem);
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

        // DELETE: odata/ActivityStandardItems(5)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var currentActivityStandardItem = db.ActivityStandardItems.FirstOrDefault(asi => asi.ActivityStandardItemID == key);

            if (currentActivityStandardItem == null)
            {
                return NotFound();
            }

            db.ActivityStandardItems.Remove(currentActivityStandardItem);
            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);

        }

        private bool ActivityStandardItemsExists(int key)
        {
            return db.ActivityStandardItems.Count(asi => asi.ActivityStandardItemID == key) > 0;
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
