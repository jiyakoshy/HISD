using System.Data;
using System.Linq;
using System.Web.Http;
using System.Web.OData;
using HisdAPI.Entities;
using HisdAPI.DAL;

namespace HisdAPI.Controllers
{
    public class JobCodesController : ODataController
    {
        private EDWDataModel db = new EDWDataModel();

        // GET: odata/JobCodes
        [EnableQuery]
        public IQueryable<JobCodeEntity> GetJobCodes()
        {
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            return db.JobCodes;
        }

        // GET: odata/JobCodes(5)
        [EnableQuery]
        public SingleResult<JobCodeEntity> GetJobCodeEntity([FromODataUri] string key)
        {
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            return SingleResult.Create(db.JobCodes.Where(jobCodeEntity => jobCodeEntity.JobCodeNaturalKey == key));
        }

        
        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool JobCodeEntityExists(string key)
        {
            return db.JobCodes.Count(e => e.JobCodeNaturalKey == key) > 0;
        }
    }
}
