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
    public class VotingSettingsController : ODataController
    {
        private DACContext db = new DACContext();
        private string connectionStringDAC = System.Configuration.ConfigurationManager.ConnectionStrings["DACContext"].ConnectionString;

        // GET: odata/VotingSettings
        [EnableQuery]
        public IQueryable<VotingSetting> Get()
        {
             return db.VotingSettings;
        }
        //POST: odata/create a New VotingSettings
        public IHttpActionResult Post(VotingSetting votingsetting)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            votingsetting.CreatedDate = DateTime.Now;
            votingsetting.UpdatedDate = DateTime.Now;
            db.VotingSettings.Add(votingsetting);
            db.SaveChanges();
            return ResponseMessage(Request.CreateResponse(HttpStatusCode.Created, votingsetting));
            //return Created(votingsetting);
        }
        // PATCH: odata/Partial update an existing  VotingSettings
        public IHttpActionResult Patch([FromODataUri] int key, Delta<VotingSetting> patch)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var currentVotingSetting = db.VotingSettings.FirstOrDefault(al => al.VotingSettingID == key);
            if (currentVotingSetting == null)
            {
                return NotFound();
            }
            currentVotingSetting.UpdatedDate = DateTime.Now;
            patch.Patch(currentVotingSetting);
            db.SaveChanges();

            var currentVotingSettingRest = db.VotingSettings.Where(vs => vs.VotingSettingID != key).ToList();
            currentVotingSettingRest.ForEach(vsr => vsr.IsActive = false);
            db.SaveChanges();
           // return ResponseMessage(Request.CreateResponse(HttpStatusCode.Created, patch));
            return StatusCode(HttpStatusCode.NoContent);

        }

        //public IHttpActionResult Post(VotingSetting[] votingsetting)
        //{
        //    VotingSetting Dt = new VotingSetting();
        //   // Dt.VotingStartDate = votingsetting[0].VotingStartDate;
        //   // Dt.VotingEndDate = votingsetting[0].VotingEndDate;
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }
        //    db.VotingSettings.Add(votingsetting[0]);
        //    db.SaveChanges();
        //    return ResponseMessage(Request.CreateResponse(HttpStatusCode.Created, votingsetting));
        //    //return Created(votingsetting);
        //}
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