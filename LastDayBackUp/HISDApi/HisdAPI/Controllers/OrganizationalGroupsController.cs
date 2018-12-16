using System.Data;
using System.Linq;
using System.Web.Http;
using System.Web.OData;
using HisdAPI.Entities;
using HisdAPI.DAL;


namespace HisdAPI.Controllers
{
    public class OrganizationalGroupsController : ODataController
    {
        private EDWDataModel db = new EDWDataModel();

        // GET: odata/OrganizationalGroups
        [EnableQuery]
        public IQueryable<OrganizationalGroup> GetOrganizationalGroups()
        {
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            return db.OrganizationalGroups;
        }

        // GET: odata/OrganizationalGroups(5)
        [EnableQuery]
        public SingleResult<OrganizationalGroup> GetOrganizationalGroup([FromODataUri] string key)
        {
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            return SingleResult.Create(db.OrganizationalGroups.Where(organizationalGroup => organizationalGroup.OrgGrpNaturalKey == key));
        }
        
        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool OrganizationalGroupExists(string key)
        {
            return db.OrganizationalGroups.Count(e => e.OrgGrpNaturalKey == key) > 0;
        }
    }
}
