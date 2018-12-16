using System.Data;
using System.Linq;
using System.Web.Http;
using System.Web.OData;
using HisdAPI.Entities;
using HisdAPI.DAL;

namespace HisdAPI.Public.Controllers
{
    public class AddressController : ODataController
    {
        private EDWDataModel db = new EDWDataModel();

        // GET: odata/Address
        [EnableQuery]
        public IQueryable<AddressEntity> GetAddress()
        {
            var data = db.Address.ToList();
            return data.AsQueryable();
        }

        // GET: odata/Address(5)
        [EnableQuery]
        public SingleResult<AddressEntity> GetAddressEntity([FromODataUri] string key)
        {
            return SingleResult.Create(db.Address.Where(addressEntity => addressEntity.AddressNaturalKey == key));
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool AddressEntityExists(string key)
        {
            return db.Address.Count(e => e.AddressNaturalKey == key) > 0;
        }
    }
}
