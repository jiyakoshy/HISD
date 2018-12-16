using System.Data;
using System.Linq;
using System.Web.Http;
using System.Web.OData;
using HisdAPI.Entities;
using HisdAPI.DAL;
using System.Web.OData.Routing;
using System;

namespace HisdAPI.Controllers
{
    public class SchoolYearTypesController : ODataController
    {
        private EDWDataModel db = new EDWDataModel();

        // GET: odata/SchoolYearTypes
        [EnableQuery]
        public IQueryable<SchoolYearType> GetSchoolYearTypes()
        {
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            return db.SchoolYearTypes.Where(syt => syt.SchoolYearBeginDate < DateTime.Now);
        }

        [EnableQuery]
        public SingleResult<SchoolYearType> GetSchoolYearType([FromODataUri] string key)
        {
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            return SingleResult.Create(db.SchoolYearTypes.Where(schoolYearType => schoolYearType.SchoolYearTypeNaturalKey == key && schoolYearType.SchoolYearBeginDate < DateTime.Now));
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
