using System.Data;
using System.Linq;
using System.Web.Http;
using System.Web.OData;
using HisdAPI.Entities;
using HisdAPI.DAL;

namespace HisdAPI.Controllers
{

    public class JobIndicatorTypesController : ODataController
    {
        private EDWDataModel db = new EDWDataModel();

        // GET: odata/JobIndicatorTypes
        [EnableQuery]
        public IQueryable<JobIndicatorType> GetJobIndicatorTypes()
        {
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            return db.JobIndicatorTypes;
        }

        // GET: odata/JobIndicatorTypes(5)
        [EnableQuery]
        public IQueryable<JobIndicatorType> GetJobIndicatorType([FromODataUri] string key)
        {
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));            
            return db.JobIndicatorTypes.Where(jobIndicatorType => jobIndicatorType.JobIndicatorTypeNaturalKey == key);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool JobIndicatorTypeExists(string key)
        {
            return db.JobIndicatorTypes.Count(e => e.JobIndicatorTypeNaturalKey == key) > 0;
        }
    }
}
