using System.Data;
using System.Linq;
using System.Web.Http;
using System.Web.OData;
using HisdAPI.Entities;
using HisdAPI.DAL;
using System.Web.OData.Routing;

namespace HisdAPI.Public.Controllers
{
    [ODataRoutePrefix("VendorInfo")]
    public class VendorCROSEController: ODataController
    {
        private EDWDataModel db = new EDWDataModel();

        
        [ODataRoute()]
        public IQueryable<VendorCROSE> Get()
        {
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            return db.VendorCROSE.OrderBy(v => v.Amount);
        }
        
        [ODataRoute("({key})")]        
        public IQueryable<VendorCROSE> Get([FromODataUri] string key)
        {
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            return db.VendorCROSE.Where(v => v.VendorNumber == key);
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