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
    public class ActivityStandardGroupsController : ODataController
    {
        private MASContext db = new MASContext();
        private string connectionStringMAS = System.Configuration.ConfigurationManager.ConnectionStrings["MASContext"].ConnectionString;

        // GET: odata/CBMStandards
        [EnableQuery]
        public IQueryable<ActivityStandardGroup> Get()
        {
            return db.ActivityStandardGroups;
        }

        // GET: odata/CBMStandards(5)
        [EnableQuery]
        public SingleResult<ActivityStandardGroup> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.ActivityStandardGroups.Where(asg => asg.ActivityStandardGroupID == key));
        }

        /*------  DB Update operations ------- */
        
        //POST: odata/create a New CBMStandard
        public IHttpActionResult Post(ActivityStandardGroup activitystandardgroup)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            db.ActivityStandardGroups.Add(activitystandardgroup);
            db.SaveChanges();
            return ResponseMessage(Request.CreateResponse(HttpStatusCode.Created, activitystandardgroup));
            //return Created(activitystandardgroup);
        }

        // PUT: odata/Complete update an existing CBMStandard 
        public IHttpActionResult Put([FromODataUri] int key, ActivityStandardGroup activitystandardgroup)
        {

            // Locking the DB transaction
            var putActivityStandardGroupLock = new SqlDistributedLock("putActivityStandardGroupLock", connectionStringMAS);

            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var currentActivitystandardgroup = db.ActivityStandardGroups.FirstOrDefault(asg => asg.ActivityStandardGroupID == key);

                if (currentActivitystandardgroup == null)
                {
                    return NotFound();
                }
                // this block of code is protected by the lock!
                using (putActivityStandardGroupLock.Acquire())
                {
                    activitystandardgroup.ActivityStandardGroupID = currentActivitystandardgroup.ActivityStandardGroupID;
                    db.Entry(currentActivitystandardgroup).CurrentValues.SetValues(activitystandardgroup);
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

        // PATCH: odata/Partial update an existing CBMStandard
        public IHttpActionResult Patch([FromODataUri] int key, Delta<ActivityStandardGroup> patch)
        {
            // Locking the DB transaction
            var patchActivityStandardGroupLock = new SqlDistributedLock("patchActivityStandardGroupLock", connectionStringMAS);

            try
            {

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var currentActivitystandardgroup = db.ActivityStandardGroups.FirstOrDefault(asg => asg.ActivityStandardGroupID == key);
                if (currentActivitystandardgroup == null)
                {
                    return NotFound();
                }

                // this block of code is protected by the lock!
                using (patchActivityStandardGroupLock.Acquire())
                {
                    patch.Patch(currentActivitystandardgroup);
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

        // DELETE: odata/CBMStandards(5)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var currentActivitystandardgroup = db.ActivityStandardGroups.FirstOrDefault(asg => asg.ActivityStandardGroupID == key);

            if (currentActivitystandardgroup == null)
            {
                return NotFound();
            }

            db.ActivityStandardGroups.Remove(currentActivitystandardgroup);
            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);

        }

        private bool ActivityStandardGroupsExists(int key)
        {
            return db.ActivityStandardGroups.Count(asg => asg.ActivityStandardGroupID == key) > 0;
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
