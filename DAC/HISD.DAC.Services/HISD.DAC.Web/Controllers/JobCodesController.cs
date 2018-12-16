using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.OData;
using System.Web.OData.Query;
using System.Web.OData.Routing;
using HISD.DAC.DAL.Models;
using HISD.DAC.DAL.Models.DAC;
using System.Threading.Tasks;
using System.Web.ModelBinding;
using Newtonsoft.Json;
using HISD.DAC.Web.Models;

namespace HISD.DAC.Web.Controllers
{
    public class JobCodesController : ODataController
    {
        private DACContext db = new DACContext();
        private string connectionStringDAC = System.Configuration.ConfigurationManager.ConnectionStrings["DACContext"].ConnectionString;

        // GET: odata/JobCodes
        [EnableQuery]
        public IQueryable<JobCode> Get()
        {
            return db.JobCodes;
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