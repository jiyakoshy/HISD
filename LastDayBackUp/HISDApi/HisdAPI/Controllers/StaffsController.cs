using System.Data;
using System.Linq;
using System.Web.Http;
using System.Web.OData;
using HisdAPI.Entities;
using HisdAPI.DAL;


namespace HisdAPI.Controllers
{
    public class StaffsController : ODataController
    {
        private EDWDataModel db = new EDWDataModel();

        // GET: odata/Staffs
        [EnableQuery]   
        public IQueryable<Staff> GetStaffs()
        {
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            return db.Staffs;
        }

        // GET: odata/Staffs(5)
        [EnableQuery]        
        public SingleResult<Staff> GetStaff([FromODataUri] string key)
        {
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            return SingleResult.Create(db.Staffs.Where(staff => staff.StaffNaturalKey == key));
        }
        
        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool StaffExists(string key)
        {
            return db.Staffs.Count(e => e.FirstName == key) > 0;
        }        
    }
}
