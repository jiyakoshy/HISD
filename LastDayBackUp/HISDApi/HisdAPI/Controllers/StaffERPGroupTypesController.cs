using System.Data;
using System.Linq;
using System.Web.Http;
using System.Web.OData;
using HisdAPI.Entities;
using HisdAPI.DAL;


namespace HisdAPI.Controllers
{

    public class StaffERPGroupTypesController : ODataController
    {
        private EDWDataModel db = new EDWDataModel();

        // GET: odata/StaffERPGroupTypes
        [EnableQuery]
        public IQueryable<StaffERPGroupType> GetStaffERPGroupTypes()
        {
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            return db.StaffERPGroupTypes;
        }

        // GET: odata/StaffERPGroupTypes(5)
        [EnableQuery]
        public SingleResult<StaffERPGroupType> GetStaffERPGroupType([FromODataUri] string key)
        {
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            return SingleResult.Create(db.StaffERPGroupTypes.Where(staffERPGroupType => staffERPGroupType.StaffERPGroupTypeCode == key));
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool StaffERPGroupTypeExists(string key)
        {
            return db.StaffERPGroupTypes.Count(e => e.StaffERPGroupTypeCode == key) > 0;
        }
    }
}
