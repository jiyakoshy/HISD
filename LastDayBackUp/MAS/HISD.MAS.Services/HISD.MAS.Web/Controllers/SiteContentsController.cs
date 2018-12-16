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
    public class SiteContentsController : ODataController
    {
        private MASContext db = new MASContext();
        private string connectionStringMAS = System.Configuration.ConfigurationManager.ConnectionStrings["MASContext"].ConnectionString;


        // GET: odata/ SiteContents
        [EnableQuery]
        public IQueryable<SiteContent> Get()
        {
            return db.SiteContents;
        }

        // GET: odata/ SiteContents(5)
        [EnableQuery]
        public SingleResult<SiteContent> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.SiteContents.Where(sc => sc.SiteContentID == key));
        }
        /*------  DB Update operations ------- */

        //POST: odata/create a New  SiteContent
        public IHttpActionResult Post(SiteContent sitecontent)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            db.SiteContents.Add(sitecontent);
            db.SaveChanges();
            return ResponseMessage(Request.CreateResponse(HttpStatusCode.Created, sitecontent));
            //return Created(sitecontent);
        }

        // PUT: odata/Complete update a SiteContents
        public IHttpActionResult Put([FromODataUri] int key, SiteContent sitecontent)
        {
            // Locking the DB transaction
            var putSiteContentLock = new SqlDistributedLock("putSiteContentLock", connectionStringMAS);

            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var currentSiteContent = db.SiteContents.FirstOrDefault(sc => sc.SiteContentID == key);

                if (currentSiteContent == null)
                {
                    return NotFound();
                }
                // this block of code is protected by the lock!
                using (putSiteContentLock.Acquire())
                {
                    sitecontent.SiteContentID = currentSiteContent.SiteContentID;
                    db.Entry(currentSiteContent).CurrentValues.SetValues(sitecontent);
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

        // PATCH: odata/Partial update an existing  SiteContent
        public IHttpActionResult Patch([FromODataUri] int key, Delta<SiteContent> patch)
        {
            // Locking the DB transaction
            var patchSiteContentLock = new SqlDistributedLock("patchSiteContentLock", connectionStringMAS);
            try
            {

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var currentSiteContent = db.SiteContents.FirstOrDefault(sc => sc.SiteContentID == key);
                if (currentSiteContent == null)
                {
                    return NotFound();
                }
                // this block of code is protected by the lock!
                using (patchSiteContentLock.Acquire())
                {
                    patch.Patch(currentSiteContent);
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

        // DELETE: odata/ SiteContents(5)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var currentSiteContent = db.SiteContents.FirstOrDefault(sc => sc.SiteContentID == key);

            if (currentSiteContent == null)
            {
                return NotFound();
            }

            db.SiteContents.Remove(currentSiteContent);
            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);

        }

        private bool SiteContentsExists(int key)
        {
            return db.SiteContents.Count(sc => sc.SiteContentID == key) > 0;
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

