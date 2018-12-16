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
    public class MultiChoiceListsController : ODataController
    {
        private MASContext db = new MASContext();
        private string connectionStringMAS = System.Configuration.ConfigurationManager.ConnectionStrings["MASContext"].ConnectionString;


        // GET: odata/SiteMultiValuedLists
        [EnableQuery]
        public IQueryable<MultiChoiceList> Get()
        {
            return db.MultiChoiceLists;
        }

        // GET: odata/SiteMultiValuedLists(5)
        [EnableQuery]
        public SingleResult<MultiChoiceList> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.MultiChoiceLists.Where(sml => sml.MultiChoiceListID == key));
        }
        /*------  DB Update operations ------- */

        ////POST: odata/create a New SiteMultiValuedLists
        public IHttpActionResult Post(MultiChoiceList multichoicelist)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            db.MultiChoiceLists.Add(multichoicelist);
            db.SaveChanges();
            return ResponseMessage(Request.CreateResponse(HttpStatusCode.Created, multichoicelist));
            
        }

        // PUT: odata/Complete update an existing SiteMultiValuedList 
        public IHttpActionResult Put([FromODataUri] int key, MultiChoiceList multichoicelist)
        {
            // Locking the DB transaction
            var putMultiChoiceListLock = new SqlDistributedLock("putMultiChoiceListLock", connectionStringMAS);

            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var currentMultiChoiceList = db.MultiChoiceLists.FirstOrDefault(sml => sml.MultiChoiceListID == key);

                if (currentMultiChoiceList == null)
                {
                    return NotFound();
                }
                // this block of code is protected by the lock!
                using (putMultiChoiceListLock.Acquire())
                {
                    multichoicelist.MultiChoiceListID = multichoicelist.MultiChoiceListID;
                    db.Entry(currentMultiChoiceList).CurrentValues.SetValues(multichoicelist);
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

        // PATCH: odata/Partial update an existing SiteMultiValuedList
        public IHttpActionResult Patch([FromODataUri] int key, Delta<MultiChoiceList> patch)
        {
            // Locking the DB transaction
            var patchMultiChoiceListLock = new SqlDistributedLock("patchMultiChoiceListLock", connectionStringMAS);
            try
            {

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var currentMultiChoiceList = db.MultiChoiceLists.FirstOrDefault(sml => sml.MultiChoiceListID == key);
                if (currentMultiChoiceList == null)
                {
                    return NotFound();
                }
                // this block of code is protected by the lock!
                using (patchMultiChoiceListLock.Acquire())
                {
                    patch.Patch(currentMultiChoiceList);
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

        // DELETE: odata/SiteMultiValuedLists(5)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var currentMultiChoiceList = db.MultiChoiceLists.FirstOrDefault(sml => sml.MultiChoiceListID == key);

            if (currentMultiChoiceList == null)
            {
                return NotFound();
            }

            db.MultiChoiceLists.Remove(currentMultiChoiceList);
            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);

        }

        private bool currentMultiChoiceListExists(int key)
        {
            return db.MultiChoiceLists.Count(sml => sml.MultiChoiceListID == key) > 0;
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
