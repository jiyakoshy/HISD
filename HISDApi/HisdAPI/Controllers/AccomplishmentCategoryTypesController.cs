using System.Data;
using System.Linq;
using System.Web.Http;
using System.Web.OData;
using HisdAPI.Entities;
using HisdAPI.DAL;

namespace HisdAPI.Controllers
{
    public class AccomplishmentCategoryTypesController : ODataController
    {
        private EDWDataModel db = new EDWDataModel();

        // GET: odata/AccomplishmentCategoryTypes
        [EnableQuery]
        public IQueryable<AccomplishmentCategoryType> GetAccomplishmentCategoryTypes()
        {
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            return db.AccomplishmentCategoryTypes;
        }

        // GET: odata/AccomplishmentCategoryTypes(5)
        [EnableQuery]
        public SingleResult<AccomplishmentCategoryType> GetAccomplishmentCategoryType([FromODataUri] string key)
        {
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            return SingleResult.Create(db.AccomplishmentCategoryTypes.Where(accomplishmentCategoryType => accomplishmentCategoryType.AccomplishmentCategoryTypeNaturalKey == key));
        }        

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool AccomplishmentCategoryTypeExists(string key)
        {
            return db.AccomplishmentCategoryTypes.Count(e => e.AccomplishmentCategoryTypeNaturalKey == key) > 0;
        }
    }
}
