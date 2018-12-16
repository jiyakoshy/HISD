using System.Data;
using System.Linq;
using System.Web.Http;
using System.Web.OData;
using HisdAPI.Entities;
using HisdAPI.DAL;

namespace HisdAPI.Controllers
{
    public class StaffPayGradeAssociationsController : ODataController
    {
        private EDWDataModel db = new EDWDataModel();

        [EnableQuery]
        public IQueryable<StaffPayGradeAssociation> GetStaffPayGradeAssociations()
        {
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            return db.StaffPayGradeAssociations;
        }

        [EnableQuery]
        public SingleResult<StaffPayGradeAssociation> GetStaffPayGradeAssociation([FromODataUri] string key)
        {
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            return SingleResult.Create(db.StaffPayGradeAssociations.Where(spga => spga.StaffNaturalKey == key));
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
