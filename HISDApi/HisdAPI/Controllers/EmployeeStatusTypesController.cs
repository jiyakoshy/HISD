using System.Data;
using System.Linq;
using System.Web.Http;
using System.Web.OData;
using HisdAPI.Entities;
using HisdAPI.DAL;

namespace HisdAPI.Controllers
{
    public class EmployeeStatusTypesController : ODataController
    {
        private EDWDataModel db = new EDWDataModel();

        // GET: odata/EmployeeStatusTypes
        [EnableQuery]
        public IQueryable<EmployeeStatusType> GetEmployeeStatusTypes()
        {
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            return db.EmployeeStatusTypes;
        }

        // GET: odata/EmployeeStatusTypes(5)
        [EnableQuery]
        public SingleResult<EmployeeStatusType> GetEmployeeStatusType([FromODataUri] string key)
        {
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            return SingleResult.Create(db.EmployeeStatusTypes.Where(employeeStatusType => employeeStatusType.EmployeeStatusTypeNaturalKey == key));
        }        

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool EmployeeStatusTypeExists(string key)
        {
            return db.EmployeeStatusTypes.Count(e => e.EmployeeStatusTypeNaturalKey == key) > 0;
        }
    }
}
