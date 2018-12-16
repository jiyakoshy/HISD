using System.Data;
using System.Linq;
using System.Web.Http;
using System.Web.OData;
using HisdAPI.DAL;
using HisdAPI.Entities;

namespace HisdAPI.Controllers
{
    public class AccomplishmentTypesController : ODataController
    {
        private EDWDataModel db = new EDWDataModel();

        // GET: odata/AccomplishmentTypes
        [EnableQuery]
        public IQueryable<AccomplishmentType> GetAccomplishmentTypes()
        {
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            return db.AccomplishmentTypes;
        }

        // GET: odata/AccomplishmentTypes(5)
        [EnableQuery]
        public SingleResult<AccomplishmentType> GetAccomplishmentType([FromODataUri] string key)
        {
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            return SingleResult.Create(db.AccomplishmentTypes.Where(accomplishmentType => accomplishmentType.AccomplishmentTypeNaturalKey == key));
        }                

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool AccomplishmentTypeExists(string key)
        {
            return db.AccomplishmentTypes.Count(e => e.AccomplishmentTypeNaturalKey == key) > 0;
        }
    }
}
