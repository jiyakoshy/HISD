using System.Data;
using System.Linq;
using System.Web.Http;
using System.Web.OData;
using HisdAPI.Entities;
using HisdAPI.DAL;


namespace HisdAPI.Controllers
{
    public class StaffSupervisorTypesController : ODataController
    {
        private EDWDataModel db = new EDWDataModel();

        // GET: odata/StaffSupervisorTypes
        [EnableQuery]
        public IQueryable<StaffSupervisorType> GetStaffSupervisorTypes()
        {
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            return db.StaffSupervisorTypes;
        }

        // GET: odata/StaffSupervisorTypes(5)
        [EnableQuery]
        public SingleResult<StaffSupervisorType> GetStaffSupervisorType([FromODataUri] string key)
        {
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            return SingleResult.Create(db.StaffSupervisorTypes.Where(staffSupervisorType => staffSupervisorType.StaffSupervisorTypeNaturalKey == key));
        }
        
        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool StaffSupervisorTypeExists(string key)
        {
            return db.StaffSupervisorTypes.Count(e => e.StaffSupervisorTypeNaturalKey == key) > 0;
        }
    }
}
