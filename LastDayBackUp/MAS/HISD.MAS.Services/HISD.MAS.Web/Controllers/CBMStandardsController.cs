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
    public class CBMStandardsController : ODataController
    {
        private MASContext db = new MASContext();
        private string connectionStringMAS = System.Configuration.ConfigurationManager.ConnectionStrings["MASContext"].ConnectionString;

        // GET: odata/CBMStandards
        [EnableQuery]
        public IQueryable<CBMStandard> Get()
        {
            return db.CBMStandards;
        }

        // GET: odata/CBMStandards(5)
        [EnableQuery]
        public SingleResult<CBMStandard> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.CBMStandards.Where(cbms => cbms.CBMStandardID == key));
        }
        /*------  DB Update operations ------- */

        ////POST: odata/create a New CBMStandards
        public IHttpActionResult Post(CBMStandard cbmstandard)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            db.CBMStandards.Add(cbmstandard);
            db.SaveChanges();
            return ResponseMessage(Request.CreateResponse(HttpStatusCode.Created, cbmstandard));
            //return Created(cbmstandard);
        }

        // PUT: odata/Complete update an existing CBMStandards 
        public IHttpActionResult Put([FromODataUri] int key, CBMStandard cbmstandard)
        {
            // Locking the DB transaction
            var putCBMStandardLock = new SqlDistributedLock("putCBMStandardLock", connectionStringMAS);

            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var currentCBMStandard = db.CBMStandards.FirstOrDefault(cbms => cbms.CBMStandardID == key);

                if (currentCBMStandard == null)
                {
                    return NotFound();
                }
                // this block of code is protected by the lock!
                using (putCBMStandardLock.Acquire())
                {
                    cbmstandard.CBMStandardID = currentCBMStandard.CBMStandardID;
                    db.Entry(currentCBMStandard).CurrentValues.SetValues(cbmstandard);
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

        // PATCH: odata/Partial update an existing CBMStandards
        public IHttpActionResult Patch([FromODataUri] int key, Delta<CBMStandard> patch)
        {
            // Locking the DB transaction
            var patchCBMStandardLock = new SqlDistributedLock("patchCBMStandardLock", connectionStringMAS);

            try
            {

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var currentCBMStandard = db.CBMStandards.FirstOrDefault(cbms => cbms.CBMStandardID == key);
                if (currentCBMStandard == null)
                {
                    return NotFound();
                }

                // this block of code is protected by the lock!
                using (patchCBMStandardLock.Acquire())
                {
                    patch.Patch(currentCBMStandard);
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
            var currentCBMStandard = db.CBMStandards.FirstOrDefault(cbms => cbms.CBMStandardID == key);

            if (currentCBMStandard == null)
            {
                return NotFound();
            }

            db.CBMStandards.Remove(currentCBMStandard);
            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);

        }

        private bool CBMStandardsExists(int key)
        {
            return db.CBMStandards.Count(cbms => cbms.CBMStandardID == key) > 0;
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
