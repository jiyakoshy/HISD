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
using System.Web;
using System.Web.OData.Builder;
using System.Web.OData.Extensions;
using Medallion.Threading.Sql;
using HISD.SWAV.DAL.Models.SWAV;
using System.Web.ModelBinding;
using Newtonsoft.Json;

namespace HISD.SWAV.Web.Controllers
{
    public class SDMCController : ODataController
    {
        private SWAVContext db = new SWAVContext();
        private string connectionStringSWAV = System.Configuration.ConfigurationManager.ConnectionStrings["SWAVContext"].ConnectionString;
        //Get: odata/SDMC
        [EnableQuery]
        public IQueryable<SDMC> GetSDMC()
        {
            return db.SDMC;
        }
        // POST: odata/SDMC
        public IHttpActionResult Post(SDMC sdmc)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            sdmc.CreatedDate = DateTime.Now;
            sdmc.UpdatedDate = DateTime.Now;
            db.SDMC.Add(sdmc);
            db.SaveChanges();
            return ResponseMessage(Request.CreateResponse(HttpStatusCode.Created, sdmc));
        }
    }
}