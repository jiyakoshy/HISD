using System.Data;
using System.Linq;
using System.Web.Http;
using System.Web.OData;
using HisdAPI.Entities;
using HisdAPI.DAL;


namespace HisdAPI.Controllers
{
    public class EducationOrganizationHierarchiesController : ODataController
    {
        private EDWDataModel db = new EDWDataModel();

        // GET: odata/EducationOrganizationHierarchies
        [EnableQuery]
        public IQueryable<EducationOrganizationHierarchy> GetEducationOrganizationHierarchies()
        {
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            return db.EducationOrganizationHierarchies;
        }

        // GET: odata/EducationOrganizationHierarchies(5)
        [EnableQuery]
        public SingleResult<EducationOrganizationHierarchy> GetEducationOrganizationHierarchy([FromODataUri] string key)
        {
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            return SingleResult.Create(db.EducationOrganizationHierarchies.Where(educationOrganizationHierarchy => educationOrganizationHierarchy.EducationOrgNaturalKey == key));
        }
        
        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool EducationOrganizationHierarchyExists(string key)
        {
            return db.EducationOrganizationHierarchies.Count(e => e.EducationOrgNaturalKey == key) > 0;
        }
    }
}
