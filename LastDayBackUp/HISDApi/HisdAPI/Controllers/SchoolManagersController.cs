using System.Data;
using System.Linq;
using System.Web.Http;
using System.Web.OData;
using HisdAPI.Entities;
using HisdAPI.DAL;


namespace HisdAPI.Controllers
{
    public class SchoolManagersController : ODataController
    {      
        private EDWDataModel db = new EDWDataModel();

        // GET: odata/SchoolManagers
        [EnableQuery]
        public IQueryable<SchoolManagers> GetSchoolManagers()
        {
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            return db.SchoolManagers;
        }

        // GET: odata/SchoolManagers(5)
        [EnableQuery]
        public SingleResult<SchoolManagers> GetSchoolManagers([FromODataUri] string key)
        {
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            return SingleResult.Create(db.SchoolManagers.Where(schoolManagers => schoolManagers.EducationOrgNaturalKey == key));
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
