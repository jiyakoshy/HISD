using System.Data;
using System.Linq;
using System.Web.Http;
using System.Web.OData;
using HisdAPI.Entities;
using HisdAPI.DAL;


namespace HisdAPI.Controllers
{
    public class GradeLevelTypesController : ODataController
    {
        private EDWDataModel db = new EDWDataModel();

        // GET: odata/GradeLevelTypes
        [EnableQuery]
        public IQueryable<GradeLevelType> GetGradeLevelTypes()
        {
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            return db.GradeLevelTypes;
        }

        // GET: odata/GradeLevelTypes(5)
        [EnableQuery]
        public SingleResult<GradeLevelType> GetGradeLevelType([FromODataUri] string key)
        {
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            return SingleResult.Create(db.GradeLevelTypes.Where(gradeLevelType => gradeLevelType.GradeLvlTypeNaturalKey == key));
        }
        
        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool GradeLevelTypeExists(string key)
        {
            return db.GradeLevelTypes.Count(e => e.GradeLvlTypeNaturalKey == key) > 0;
        }
    }
}
