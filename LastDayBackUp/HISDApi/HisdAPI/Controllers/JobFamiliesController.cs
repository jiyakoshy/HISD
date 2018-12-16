using System.Data;
using System.Linq;
using System.Web.Http;
using System.Web.OData;
using HisdAPI.Entities;
using HisdAPI.DAL;

namespace HisdAPI.Controllers
{
    public class JobFamiliesController : ODataController
    {
        private EDWDataModel db = new EDWDataModel();

        // GET: odata/JobFamilies
        [EnableQuery]
        public IQueryable<JobFamily> GetJobFamilies()
        {
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            return db.JobFamilies;
        }

        // GET: odata/JobFamilies(5)
        [EnableQuery]
        public SingleResult<JobFamily> GetJobFamily([FromODataUri] string key)
        {
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            return SingleResult.Create(db.JobFamilies.Where(jobFamily => jobFamily.JobFamilyNaturalKey == key));
        }
        
        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool JobFamilyExists(string key)
        {
            return db.JobFamilies.Count(e => e.JobFamilyNaturalKey == key) > 0;
        }
    }
}
