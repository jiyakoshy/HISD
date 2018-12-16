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
    public class TimeConfigurationsController : ODataController
    {
        private MASContext db = new MASContext();
        private string connectionStringMAS = System.Configuration.ConfigurationManager.ConnectionStrings["MASContext"].ConnectionString;


        // GET: odata/  TimeConfigurations
        [EnableQuery]
        public IQueryable<TimeConfiguration> Get()
        {
            return db.TimeConfigurations;
        }

        // GET: odata/  TimeConfigurations(5)
        [EnableQuery]
        public SingleResult<TimeConfiguration> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.TimeConfigurations.Where(tc => tc.TimeConfigurationID == key));
        }
        /*------  DB Update operations ------- */

        //POST: odata/create a New   TimeConfigurations
        public IHttpActionResult Post(TimeConfiguration timeconfiguration)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            db.TimeConfigurations.Add(timeconfiguration);
            db.SaveChanges();
            return ResponseMessage(Request.CreateResponse(HttpStatusCode.Created, timeconfiguration));
            //return Created(timeconfiguration);
        }

        // PUT: odata/Complete update an   TimeConfigurations
        public IHttpActionResult Put([FromODataUri] int key, TimeConfiguration timeconfiguration)
        {
            // Locking the DB transaction
            var putTimeConfigurationLock = new SqlDistributedLock("putTimeConfigurationLock", connectionStringMAS);

            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var currentTimeConfiguration = db.TimeConfigurations.FirstOrDefault(tc => tc.TimeConfigurationID == key);

                if (currentTimeConfiguration == null)
                {
                    return NotFound();
                }
                // this block of code is protected by the lock!
                using (putTimeConfigurationLock.Acquire())
                {
                    timeconfiguration.TimeConfigurationID = currentTimeConfiguration.TimeConfigurationID;
                    db.Entry(currentTimeConfiguration).CurrentValues.SetValues(timeconfiguration);
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

        // PATCH: odata/Partial update an existing   TimeConfigurations
        public IHttpActionResult Patch([FromODataUri] int key, Delta<TimeConfiguration> patch)
        {

            // Locking the DB transaction
            var patchTimeConfigurationLock = new SqlDistributedLock("patchTimeConfigurationLock", connectionStringMAS);
            try
            {

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var currentTimeConfiguration = db.TimeConfigurations.FirstOrDefault(tc => tc.TimeConfigurationID == key);
                if (currentTimeConfiguration == null)
                {
                    return NotFound();
                }
                // this block of code is protected by the lock!
                using (patchTimeConfigurationLock.Acquire())
                {
                    patch.Patch(currentTimeConfiguration);
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

        // DELETE: odata/  TimeConfigurations(5)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var currentTimeConfiguration = db.TimeConfigurations.FirstOrDefault(tc => tc.TimeConfigurationID == key);

            if (currentTimeConfiguration == null)
            {
                return NotFound();
            }

            db.TimeConfigurations.Remove(currentTimeConfiguration);
            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);

        }

        private bool TimeConfigurationsExists(int key)
        {
            return db.TimeConfigurations.Count(tc => tc.TimeConfigurationID == key) > 0;
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
