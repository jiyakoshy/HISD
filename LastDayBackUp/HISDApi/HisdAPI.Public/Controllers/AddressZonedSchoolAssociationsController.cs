using System.Data;
using System.Linq;
using System.Web.Http;
using System.Web.OData;
using HisdAPI.Entities;
using HisdAPI.DAL;

namespace HisdAPI.Public.Controllers
{    
    public class AddressZonedSchoolAssociationsController : ODataController
    {
        private EDWDataModel db = new EDWDataModel();

        // GET: odata/AddressZonedSchoolAssociations
        [EnableQuery]
        public IQueryable<AddressZonedSchoolAssociation> GetAddressZonedSchoolAssociations()
        {
            return db.AddressZonedSchoolAssociations;
        }

        // GET: odata/AddressZonedSchoolAssociations(5)
        [EnableQuery]
        public SingleResult<AddressZonedSchoolAssociation> GetAddressZonedSchoolAssociation([FromODataUri] string key)
        {
            return SingleResult.Create(db.AddressZonedSchoolAssociations.Where(addressZonedSchoolAssociation => addressZonedSchoolAssociation.AddressNaturalKey == key));
        }
        
        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool AddressZonedSchoolAssociationExists(string key)
        {
            return db.AddressZonedSchoolAssociations.Count(e => e.AddressNaturalKey == key) > 0;
        }
    }
}
