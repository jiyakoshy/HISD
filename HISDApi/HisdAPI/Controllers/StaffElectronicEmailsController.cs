using System.Data;
using System.Linq;
using System.Web.Http;
using System.Web.OData;
using HisdAPI.Entities;
using HisdAPI.DAL;

namespace HisdAPI.Controllers
{
    public class StaffElectronicEmailsController : ODataController
    {
        private EDWDataModel db = new EDWDataModel();

        // GET: odata/StaffElectronicEmails
        [EnableQuery]
        public IQueryable<StaffElectronicEmail> GetStaffElectronicEmails()
        {
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            return db.StaffElectronicEmails;
        }

        // GET: odata/StaffElectronicEmails(5)
        [EnableQuery]
        public SingleResult<StaffElectronicEmail> GetStaffElectronicEmail([FromODataUri] string key)
        {
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            return SingleResult.Create(db.StaffElectronicEmails.Where(staffElectronicEmail => staffElectronicEmail.StaffNaturalKey == key));
        }
        
        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool StaffElectronicEmailExists(string key)
        {
            return db.StaffElectronicEmails.Count(e => e.StaffNaturalKey == key) > 0;
        }
    }
}
