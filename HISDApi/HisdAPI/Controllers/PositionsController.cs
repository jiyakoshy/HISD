using System.Data;
using System.Linq;
using System.Web.Http;
using System.Web.OData;
using HisdAPI.Entities;
using HisdAPI.DAL;

namespace HisdAPI.Controllers
{
    public class PositionsController : ODataController
    {
        private EDWDataModel db = new EDWDataModel();

        // GET: odata/Positions
        [EnableQuery]
        public IQueryable<Position> GetPositions()
        {
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            return db.Positions;
        }

        // GET: odata/Positions(5)
        [EnableQuery]
        public SingleResult<Position> GetPosition([FromODataUri] string key)
        {
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            return SingleResult.Create(db.Positions.Where(position => position.PositionNumber == key));
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool PositionExists(string key)
        {
            return db.Positions.Count(e => e.PositionNumber == key) > 0;
        }
    }
}
