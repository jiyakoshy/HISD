using System.Data;
using System.Linq;
using System.Web.Http;
using System.Web.OData;
using HisdAPI.Entities;
using HisdAPI.DAL;

namespace HisdAPI.Controllers
{
    public class QualificationTypesController : ODataController
    {
        private EDWDataModel db = new EDWDataModel();

        // GET: odata/QualificationTypes
        [EnableQuery]
        public IQueryable<QualificationType> GetQualificationTypes()
        {
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            return db.QualificationTypes;
        }

        // GET: odata/QualificationTypes(5)
        [EnableQuery]
        public SingleResult<QualificationType> GetQualificationType([FromODataUri] string key)
        {
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            return SingleResult.Create(db.QualificationTypes.Where(qualificationType => qualificationType.QualificationTypeNaturalKey == key));
        }        

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool QualificationTypeExists(string key)
        {
            return db.QualificationTypes.Count(e => e.QualificationTypeNaturalKey == key) > 0;
        }
    }
}
