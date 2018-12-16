using System.Data;
using System.Linq;
using System.Web.Http;
using System.Web.OData;
using HisdAPI.Entities;
using HisdAPI.DAL;

namespace HisdAPI.Controllers
{    
    public class EmployeeHISDStatusTypesController : ODataController
    {
        private EDWDataModel db = new EDWDataModel();

        // GET: odata/EmployeeHISDStatusTypes
        [EnableQuery]
        public IQueryable<EmployeeHISDStatusType> GetEmployeeHISDStatusTypes()
        {
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            return db.EmployeeHISDStatusTypes;
        }

        // GET: odata/EmployeeHISDStatusTypes(5)
        [EnableQuery]
        public SingleResult<EmployeeHISDStatusType> GetEmployeeHISDStatusType([FromODataUri] string key)
        {
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            return SingleResult.Create(db.EmployeeHISDStatusTypes.Where(employeeHISDStatusType => employeeHISDStatusType.EmployeeHISDStatusTypeNaturalKey == key));
        }
        
        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool EmployeeHISDStatusTypeExists(string key)
        {
            return db.EmployeeHISDStatusTypes.Count(e => e.EmployeeHISDStatusTypeNaturalKey == key) > 0;
        }
    }
}
