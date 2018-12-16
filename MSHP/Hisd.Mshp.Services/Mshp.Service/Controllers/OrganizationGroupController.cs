using System.Linq;
using System.Net;
using System.Web.Http;
using System.Web.OData;
using System.Web.OData.Routing;

namespace Mshp.Service
{
    public class OrganizationGroupController : ODataController
    {
        private MshpDbContext db;

        public OrganizationGroupController()
        {
            db = new MshpDbContext();
        }

        [EnableQuery]
        public IQueryable<OrganizationGroup> Get()
        {           
            var response = db.OrganizationGroupSet;
            return response;
        }

        [EnableQuery, ODataRoute("OrganizationGroup({key})")]
        public SingleResult<OrganizationGroup> Get([FromODataUri] int key)
        {
            var response = db.OrganizationGroupSet.Where(p => p.OrganizationGroupId == key);
            return SingleResult.Create(response);
        }


        #region Command operations...
        public IHttpActionResult Post(OrganizationGroup entity)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            db.OrganizationGroupSet.Add(entity);
            int rowsAffected = db.SaveChanges();
            if (rowsAffected > 0)
                return Created(entity);

            return StatusCode(HttpStatusCode.NoContent);
        }

        public IHttpActionResult Put([FromODataUri] int key, OrganizationGroup update)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (update == null || key != update.OrganizationGroupId)
                return BadRequest();

            var original = db.OrganizationGroupSet.Where(p => p.OrganizationGroupId == key).FirstOrDefault();

            if (original == null)
                return NotFound();

            db.Entry(original).CurrentValues.SetValues(update);
            int rowsAffected = db.SaveChanges();
            if (rowsAffected > 0)
                return Updated(update);

            return StatusCode(HttpStatusCode.NoContent);
        }

        public IHttpActionResult Patch([FromODataUri] int key, Delta<OrganizationGroup> delta)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var original = db.OrganizationGroupSet.Where(p => p.OrganizationGroupId == key).FirstOrDefault();
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
            var original = db.OrganizationGroupSet.Where(p => p.OrganizationGroupId == key).FirstOrDefault();
            if (original == null)
                return NotFound();

            db.OrganizationGroupSet.Remove(original);
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


/*  Sample commands
 GET
 Url: /odata/OrganizationGroup
 Name, Attribute: Content-Type,application/json
  

 PATCH
 Url: /odata/OrganizationGroup(178)
 Body: { Description:"TestPATCH Area" }

 PUT
 Url: /odata/OrganizationGroup(178)
 Body: {Id:178, CalendarId:463, SchoolYear:"2018-2019", ShortDescription:"PUT", Description:"TestPUT Area Region", IsOrganizationGroup:true, DisplayOrder:4} 

 DELETE
 Url: /odata/OrganizationGroup(178)

 POST
 Url: /odata/OrganizationGroup
 Body: {CalendarId:463, SchoolYear:"2018-2019", ShortDescription:"POST", Description:"TestPOST Area Region", IsOrganizationGroup:true, DisplayOrder:4} 


*/


