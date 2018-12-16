using System.Data;
using System.Linq;
using System.Web.Http;
using System.Web.OData;
using HisdAPI.Entities;
using HisdAPI.DAL;

namespace HisdAPI.Controllers
{
    public class StaffQualificationAssociationsController : ODataController
    {
        private EDWDataModel db = new EDWDataModel();

        // GET: odata/StaffQualificationAssociations
        [EnableQuery]
        public IQueryable<StaffQualificationAssociation> GetStaffQualificationAssociations()
        {
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            return db.StaffQualificationAssociations;
        }

        // GET: odata/StaffQualificationAssociations(5)
        [EnableQuery]
        public SingleResult<StaffQualificationAssociation> GetStaffQualificationAssociation([FromODataUri] string key)
        {
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            return SingleResult.Create(db.StaffQualificationAssociations.Where(staffQualificationAssociation => staffQualificationAssociation.StaffQualificationNaturalKey == key));
        }
        
        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool StaffQualificationAssociationExists(string key)
        {
            return db.StaffQualificationAssociations.Count(e => e.StaffQualificationNaturalKey == key) > 0;
        }
    }
}
