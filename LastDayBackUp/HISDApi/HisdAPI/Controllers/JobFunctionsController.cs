using System.Data;
using System.Linq;
using System.Web.Http;
using System.Web.OData;
using HisdAPI.Entities;
using HisdAPI.DAL;

namespace HisdAPI.Controllers
{
    public class JobFunctionsController : ODataController
    {
        private EDWDataModel db = new EDWDataModel();

        // GET: odata/JobFunctions
        [EnableQuery]
        public IQueryable<JobFunction> GetJobFunctions()
        {
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            return db.JobFunctions;
        }

        // GET: odata/JobFunctions(5)
        [EnableQuery]
        public SingleResult<JobFunction> GetJobFunction([FromODataUri] string key)
        {
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            return SingleResult.Create(db.JobFunctions.Where(jobFunction => jobFunction.JobFunctionNaturalKey == key));
        }        

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool JobFunctionExists(string key)
        {
            return db.JobFunctions.Count(e => e.JobFunctionNaturalKey == key) > 0;
        }
    }
}
