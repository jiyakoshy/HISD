using System.Data;
using System.Linq;
using System.Web.Http;
using System.Web.OData;
using HisdAPI.Entities;
using HisdAPI.DAL;

namespace HisdAPI.Controllers
{
    public class QualificationGroupAssociationsController : ODataController
    {
        private EDWDataModel db = new EDWDataModel();

        // GET: odata/QualificationGroupAssociations
        [EnableQuery]
        public IQueryable<QualificationGroupAssociation> GetQualificationGroupAssociations()
        {
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            return db.QualificationGroupAssociations;
        }

        // GET: odata/QualificationGroupAssociations(5)
        [EnableQuery]
        public SingleResult<QualificationGroupAssociation> GetQualificationGroupAssociation([FromODataUri] string key)
        {
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            return SingleResult.Create(db.QualificationGroupAssociations.Where(qualificationGroupAssociation => qualificationGroupAssociation.QualificationGroupAssociationNaturalKey == key));
        }

        
        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool QualificationGroupAssociationExists(string key)
        {
            return db.QualificationGroupAssociations.Count(e => e.QualificationGroupAssociationNaturalKey == key) > 0;
        }
    }
}
