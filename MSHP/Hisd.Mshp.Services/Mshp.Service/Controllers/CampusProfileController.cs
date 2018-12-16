using System.Linq;
using System.Net;
using System.Web.Http;
using System.Web.OData;
using System.Web.OData.Routing;

namespace Mshp.Service
{
    public class CampusProfileController : ODataController
    {
        private MshpDbContext db;

        public CampusProfileController()
        {
            db = new MshpDbContext();
        }

        [EnableQuery]
        public IQueryable<CampusProfile> Get()
        {
            var response = db.CampusProfileSet;
            return response;
        }

        [EnableQuery, ODataRoute("CampusProfile({key})")]
        public SingleResult<CampusProfile> Get([FromODataUri] int key)
        {
            var response = db.CampusProfileSet.Where(p => p.CampusProfileId == key);
            return SingleResult.Create(response);
        }

        #region Command operations...
        public IHttpActionResult Post(CampusProfile entity)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            db.CampusProfileSet.Add(entity);
            int rowsAffected = db.SaveChanges();
            if (rowsAffected > 0)
                return Created(entity);

            return StatusCode(HttpStatusCode.NoContent);
        }

        public IHttpActionResult Put([FromODataUri] int key, CampusProfile update)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (update == null || key != update.CampusProfileId)
                return BadRequest();

            var original = db.CampusProfileSet.Where(p => p.CampusProfileId == key).FirstOrDefault();
            if (original == null)
                return NotFound();

            db.Entry(original).CurrentValues.SetValues(update);
            int rowsAffected = db.SaveChanges();
            if (rowsAffected > 0)
                return Updated(update);

            return StatusCode(HttpStatusCode.NoContent);
        }

        public IHttpActionResult Patch([FromODataUri] int key, Delta<CampusProfile> delta)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var original = db.CampusProfileSet.Where(p => p.CampusProfileId == key).FirstOrDefault();
            if (original == null)
                return NotFound();

            delta.Patch(original);
            int rowsAffected = db.SaveChanges();
            if (rowsAffected > 0)
                return Updated(delta);

            return StatusCode(HttpStatusCode.NoContent);
        }

        public IHttpActionResult Delete([FromODataUri] int key)
        {
            var original = db.CampusProfileSet.Where(p => p.CampusProfileId == key).FirstOrDefault();
            if (original == null)
                return NotFound();

            db.CampusProfileSet.Remove(original);
            int rowsAffected = db.SaveChanges();
            if (rowsAffected > 0)
                return Ok();

            return StatusCode(HttpStatusCode.NoContent);
        }

        protected override void Dispose(bool disposing)
        {
            db.Dispose();
            base.Dispose(disposing);
        }
        #endregion

    }
}

