using System.Linq;
using System.Net;
using System.Web.Http;
using System.Web.OData;
using System.Web.OData.Routing;

namespace Mshp.Service
{
    public class CalendarController : ODataController
    {
        private MshpDbContext db;

        public CalendarController()
        {
            db = new MshpDbContext();
        }

        [EnableQuery]
        public IQueryable<Calendar> Get()
        {           
            var response = db.CalendarSet;
            return response;
        }

        [EnableQuery, ODataRoute("Calendar({key})")]
        public SingleResult<Calendar> Get([FromODataUri] int key)
        {
            IQueryable<Calendar> response = db.CalendarSet.Where(p => p.Id == key);
            return SingleResult.Create(response);
        }

        #region Command operations...
        public IHttpActionResult Post(Calendar entity)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            db.CalendarSet.Add(entity);
            int rowsAffected = db.SaveChanges();
            if (rowsAffected > 0)
                return Created(entity);

            return StatusCode(HttpStatusCode.NoContent);
        }

        public IHttpActionResult Put([FromODataUri] int key, Calendar update)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (update == null || key != update.Id)
                return BadRequest();

            var original = db.CalendarSet.Where(p => p.Id == key).FirstOrDefault();
            if (original == null)
                return NotFound();

            db.Entry(original).CurrentValues.SetValues(update);
            int rowsAffected = db.SaveChanges();
            if (rowsAffected > 0)
                return Updated(update);

            return StatusCode(HttpStatusCode.NoContent);
        }

        public IHttpActionResult Patch([FromODataUri] int key, Delta<Calendar> delta)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var original = db.CalendarSet.Where(p => p.Id == key).FirstOrDefault();
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
            var original = db.CalendarSet.Where(p => p.Id == key).FirstOrDefault();
            if (original == null)
                return NotFound();

            db.CalendarSet.Remove(original);
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
