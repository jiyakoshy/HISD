using System.Data;
using System.Linq;
using System.Web.Http;
using System.Web.OData;
using HisdAPI.Entities;
using HisdAPI.DAL;


namespace HisdAPI.Controllers
{
    public class StaffSectionAssociationsController : ODataController
    {
        private EDWDataModel db = new EDWDataModel();

        // GET: odata/StaffSectionAssociations
        [EnableQuery]
        public IQueryable<StaffSectionAssociation> GetStaffSectionAssociations()
        {
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            return db.StaffSectionAssociations;
        }

        // GET: odata/StaffSectionAssociations(5)
        [EnableQuery]
        public SingleResult<StaffSectionAssociation> GetStaffSectionAssociation([FromODataUri] string key)
        {
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            return SingleResult.Create(db.StaffSectionAssociations.Where(staffSectionAssociation => staffSectionAssociation.StaffSectionAssociationNaturalKey == key));
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool StaffSectionAssociationExists(string key)
        {
            return db.StaffSectionAssociations.Count(e => e.StaffSectionAssociationNaturalKey == key) > 0;
        }
    }
}
