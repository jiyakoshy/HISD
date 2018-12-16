using System.Data;
using System.Linq;
using System.Web.Http;
using System.Web.OData;
using HisdAPI.Entities;
using HisdAPI.DAL;

namespace HisdAPI.Controllers
{
    public class SalaryPlanTypesController : ODataController
    {
        private EDWDataModel db = new EDWDataModel();

        // GET: odata/SalaryPlanTypes
        [EnableQuery]
        public IQueryable<SalaryPlanType> GetSalaryPlanTypes()
        {
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            return db.SalaryPlanTypes;
        }

        // GET: odata/SalaryPlanTypes(5)
        [EnableQuery]
        public SingleResult<SalaryPlanType> GetSalaryPlanType([FromODataUri] string key)
        {
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            return SingleResult.Create(db.SalaryPlanTypes.Where(salaryPlanType => salaryPlanType.SalaryPlanTypeNaturalKey == key));
        }
        
        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool SalaryPlanTypeExists(string key)
        {
            return db.SalaryPlanTypes.Count(e => e.SalaryPlanTypeNaturalKey == key) > 0;
        }
    }
}
