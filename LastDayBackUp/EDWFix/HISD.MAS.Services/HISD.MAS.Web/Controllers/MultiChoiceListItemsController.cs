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
    public class MultiChoiceListItemsController : ODataController
    {
        private MASContext db = new MASContext();
        private string connectionStringMAS = System.Configuration.ConfigurationManager.ConnectionStrings["MASContext"].ConnectionString;

        // GET: odata/SiteMultiValuedLists
        [EnableQuery]
        public IQueryable<MultiChoiceListItem> Get()
        {
            return db.MultiChoiceListItems;
        }

        // GET: odata/SiteMultiValuedLists(5)
        [EnableQuery]
        public SingleResult<MultiChoiceListItem> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.MultiChoiceListItems.Where(mvi => mvi.MultiChoiceListItemID == key));
        }
        /*------  DB Update operations ------- */

        //POST: odata/create a New SiteMultiValuedLists
        public IHttpActionResult Post(MultiChoiceListItem multivaluedlistitem)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            db.MultiChoiceListItems.Add(multivaluedlistitem);
            db.SaveChanges();
            return ResponseMessage(Request.CreateResponse(HttpStatusCode.Created, multivaluedlistitem));

        }

        // PUT: odata/Complete update an existing SiteMultiValuedList 
        public IHttpActionResult Put([FromODataUri] int key, MultiChoiceListItem multichoicelistitem)
        {
            // Locking the DB transaction
            var putMultiChoiceListItemLock = new SqlDistributedLock("putMultiChoiceListItemLock", connectionStringMAS);

            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var currentMultiChoiceListItem = db.MultiChoiceListItems.FirstOrDefault(mvi => mvi.MultiChoiceListItemID == key);

                if (currentMultiChoiceListItem == null)
                {
                    return NotFound();
                }
                // this block of code is protected by the lock!
                using (putMultiChoiceListItemLock.Acquire())
                {
                    multichoicelistitem.MultiChoiceListItemID = multichoicelistitem.MultiChoiceListItemID;
                    db.Entry(currentMultiChoiceListItem).CurrentValues.SetValues(multichoicelistitem);
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
        public IHttpActionResult Patch([FromODataUri] int key, Delta<MultiChoiceListItem> patch)
        {
            // Locking the DB transaction
            var patchMultiChoiceListItemLock = new SqlDistributedLock("patchMultiChoiceListItemLock", connectionStringMAS);
            try
            {

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var currentMultiChoiceListItem = db.MultiChoiceListItems.FirstOrDefault(mvi => mvi.MultiChoiceListItemID == key);
                if (currentMultiChoiceListItem == null)
                {
                    return NotFound();
                }
                // this block of code is protected by the lock!
                using (patchMultiChoiceListItemLock.Acquire())
                {
                    patch.Patch(currentMultiChoiceListItem);
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
            var currentMultiChoiceListItem = db.MultiChoiceListItems.FirstOrDefault(mvi => mvi.MultiChoiceListItemID == key);

            if (currentMultiChoiceListItem == null)
            {
                return NotFound();
            }

            db.MultiChoiceListItems.Remove(currentMultiChoiceListItem);
            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);

        }

        private bool MultiChoiceListItemExists(int key)
        {
            return db.MultiChoiceListItems.Count(mvi => mvi.MultiChoiceListItemID == key) > 0;
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
