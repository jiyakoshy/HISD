using System.Data;
using System.Linq;
using System.Web.Http;
using System.Web.OData;
using HisdAPI.Entities;
using HisdAPI.DAL;


namespace HisdAPI.Controllers
{
    public class StaffContractTypesController : ODataController
    {
        private EDWDataModel db = new EDWDataModel();

        // GET: odata/StaffContractTypes
        [EnableQuery]
        public IQueryable<StaffContractType> GetStaffContractTypes()
        {
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            return db.StaffContractTypes;
        }

        // GET: odata/StaffContractTypes(5)
        [EnableQuery]
        public SingleResult<StaffContractType> GetStaffContractType([FromODataUri] string key)
        {
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            return SingleResult.Create(db.StaffContractTypes.Where(staffContractType => staffContractType.StaffContractTypeNaturalKey == key));
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool StaffContractTypeExists(string key)
        {
            return db.StaffContractTypes.Count(e => e.StaffContractTypeNaturalKey == key) > 0;
        }
    }
}
