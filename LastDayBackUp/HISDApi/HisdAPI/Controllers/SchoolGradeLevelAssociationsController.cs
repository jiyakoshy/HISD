using System.Data;
using System.Linq;
using System.Web.Http;
using System.Web.OData;
using HisdAPI.Entities;
using HisdAPI.DAL;

namespace HisdAPI.Controllers
{
    public class SchoolGradeLevelAssociationsController : ODataController
    {
        private EDWDataModel db = new EDWDataModel();

        [EnableQuery]
        public IQueryable<SchoolGradeLevelAssociation> GetSchoolGradeLevelAssociations()
        {
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            return db.SchoolGradeLevelAssociations;
        }

        [EnableQuery]
        public SingleResult<SchoolGradeLevelAssociation> GetSchoolGradeLevelAssociation([FromODataUri]string key)
        {
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            return SingleResult.Create(db.SchoolGradeLevelAssociations.Where(sgla => sgla.SchoolGradeLevelAssociationNaturalKey == key));
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
