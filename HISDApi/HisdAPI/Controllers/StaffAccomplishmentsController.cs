using System.Data;
using System.Linq;
using System.Web.Http;
using System.Web.OData;
using HisdAPI.Entities;
using HisdAPI.DAL;


namespace HisdAPI.Controllers
{
    public class StaffAccomplishmentsController : ODataController
    {
        private EDWDataModel db = new EDWDataModel();

        // GET: odata/StaffAccomplishments
        [EnableQuery]
        public IQueryable<StaffAccomplishments> GetStaffAccomplishments()
        {
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            return db.StaffAccomplishments.Where(staff => staff.HighestLevelDegreeIndicator == 1 && staff.AccomplishmentCategoryTypeNaturalKey == "Certification");
        }

        // GET: odata/StaffAccomplishments(5)
        [EnableQuery]
        public SingleResult<StaffAccomplishments> GetStaffAccomplishments([FromODataUri] string key)
        {
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            return SingleResult.Create(db.StaffAccomplishments.Where(staff => staff.StaffNaturalKey == key && staff.HighestLevelDegreeIndicator == 1 && staff.AccomplishmentCategoryTypeNaturalKey == "Certification"));
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool StaffAccomplishmentExists(string key)
        {
            return db.StaffAccomplishments.Count(e => e.StaffNaturalKey == key) > 0;
        }
    }
}