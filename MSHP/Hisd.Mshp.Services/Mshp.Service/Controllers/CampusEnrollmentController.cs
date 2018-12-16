using System.Linq;
using System.Net;
using System.Web.Http;
using System.Web.OData;
using System.Web.OData.Routing;

namespace Mshp.Service
{
    public class CampusEnrollmentController : ODataController
    {
        private MshpDbContext db;

        public CampusEnrollmentController()
        {
            db = new MshpDbContext();
        }

        [EnableQuery(PageSize = 100)]
        public IQueryable<CampusEnrollment> Get()
        {
            var response = db.CampusEnrollmentSet;
            return response;
        }

        [EnableQuery, ODataRoute("CampusEnrollment({key})")]
        public SingleResult<CampusEnrollment> Get([FromODataUri] int key)
        {
            var response = db.CampusEnrollmentSet.Where(p => p.CampusEnrollmentId == key);
            return SingleResult.Create(response);
        }


        #region Command operations...
        public IHttpActionResult Post(CampusEnrollment entity)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            db.CampusEnrollmentSet.Add(entity);
            int rowsAffected = db.SaveChanges();
            if (rowsAffected > 0)
                return Created(entity);

            return StatusCode(HttpStatusCode.NoContent);
        }

        public IHttpActionResult Put([FromODataUri] int key, CampusEnrollment update)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (update == null || key != update.CampusEnrollmentId)
                return BadRequest();

            var original = db.CampusEnrollmentSet.Where(p => p.CampusEnrollmentId == key).FirstOrDefault();
            if (original == null)
                return NotFound();

            db.Entry(original).CurrentValues.SetValues(update);
            int rowsAffected = db.SaveChanges();
            if (rowsAffected > 0)
                return Updated(update);

            return StatusCode(HttpStatusCode.NoContent);
        }

        public IHttpActionResult Patch([FromODataUri] int key, Delta<CampusEnrollment> delta)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var original = db.CampusEnrollmentSet.Where(p => p.CampusEnrollmentId == key).FirstOrDefault();
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
            var original = db.CampusEnrollmentSet.Where(p => p.CampusEnrollmentId == key).FirstOrDefault();
            if (original == null)
                return NotFound();

            db.CampusEnrollmentSet.Remove(original);
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

