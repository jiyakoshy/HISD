using System.Data;
using System.Linq;
using System.Web.Http;
using System.Web.OData;
using HisdAPI.Entities;
using HisdAPI.DAL;

namespace HisdAPI.Public.Controllers
{
    public class VendorController : ODataController
    {
        private EDWDataModel db = new EDWDataModel();

        [EnableQuery]
        public IQueryable<Vendor> GetVendor()
        {
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            return db.Vendor.OrderBy(v => v.Name);
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