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
    public class WaiverRequestDetailsController : ODataController
    {
        private SWAVContext db = new SWAVContext();
        private string connectionStringSWAV = System.Configuration.ConfigurationManager.ConnectionStrings["SWAVContext"].ConnectionString;

        //Get: odata/WaiverRequestDetails
        [EnableQuery]
        public IQueryable<WaiverRequestDetail> GetWaiverRequestDetails()
        {
            return db.WaiverRequestDetails;//
        }
        
        //odata/GetWaiverRequestDetail(SchoolStartYear=2017)
        [HttpGet]
        [EnableQuery]
        [ODataRoute("GetWaiverRequestDetail(SchoolStartYear={schoolyear})")]
        public IQueryable<WaiverRequestDetailAll> GetWaiverRequestDetail([FromODataUri] int schoolyear)
        {
            var waiverRequest = (from x in db.WaiverRequestDetails.ToList()
                                 join y in db.SchoolWaivers.ToList()
                                 on x.SchoolWaiverID equals y.SchoolWaiverID
                                 join z in db.Waivers.ToList()
                                 on y.WaiverID equals z.WaiverID
                                 where y.SchoolStartYear.Equals(schoolyear)
                                 //where y.SchoolWaiverID.Equals(campusNumber)
                                 select new WaiverRequestDetailAll
                                 {
                                     WaiverRequestDetailID = x.WaiverRequestDetailID,
                                     SourceOfData = x.SourceOfData,
                                     EvidenceOfCompliance = x.EvidenceOfCompliance,
                                     SchoolWaiverID = y.SchoolWaiverID,
                                     CampusNumber = (Convert.ToDecimal(y.CampusNumber)).ToString("000"),
                                     WaiverID = y.WaiverID,
                                     WaiverName = z.WaiverName,
                                     WaiverDescription = z.WaiverDescription,
                                     WaiverStatusID = y.WaiverStatusID,
                                     SchoolStartYear = y.SchoolStartYear,
                                     SchoolEndYear = y.SchoolEndYear
                                 }).AsEnumerable().ToList();
            return waiverRequest.AsQueryable<WaiverRequestDetailAll>();
        }

        //Get: odata/GetWaiverRequestSchools(SchoolStartYear=2017)
        [HttpGet]
        [EnableQuery]
        [ODataRoute("GetWaiverRequestSchools(SchoolStartYear={schoolyear})")]
        public IQueryable<SchoolStatus> GetWaiverRequestSchools([FromODataUri] int schoolyear)
        {
            var waiverRequestSchools = (from x in db.WaiverRequestDetails.ToList()
                                        join y in db.SchoolWaivers.ToList()
                                        on x.SchoolWaiverID equals y.SchoolWaiverID
                                        where y.SchoolStartYear.Equals(schoolyear)
                                        select new SchoolStatus
                                        {
                                            //WaiverRequestDetailID = x.WaiverRequestDetailID,
                                            SchoolWaiverID = y.SchoolWaiverID,
                                            CampusNumber = (Convert.ToDecimal(y.CampusNumber).ToString("000")),
                                            WaiverStatusID = y.WaiverStatusID,
                                            SchoolStartYear = y.SchoolStartYear,
                                            SchoolEndYear = y.SchoolEndYear
                                        }).AsEnumerable().ToList();
            return waiverRequestSchools.GroupBy(x => x.CampusNumber).Select(t => t.FirstOrDefault()).AsQueryable<SchoolStatus>();
        }

        //Post: odata/AddWaiverRequestDetailsForm
        [HttpPost]
        [ODataRoute("AddWaiverRequestDetailsForm")]
        public IHttpActionResult Post(WaiverRequestDetailsFormSchools waiverRequestDetailsForm)
        {
            foreach (WaiverRequestDetail c in waiverRequestDetailsForm.WaiverRequestDetails)
            {
                db.WaiverRequestDetails.Add(c);
            }
            db.SaveChanges();
            return ResponseMessage(Request.CreateResponse(HttpStatusCode.Created, waiverRequestDetailsForm.WaiverRequestDetails));
        }

        //PATCH: odata/WaiverRequestDetails(5)
        public IHttpActionResult Patch([FromODataUri] int key, Delta<WaiverRequestDetail> patch)
        {
            var patchWaiverRequestDetailItemLock = new SqlDistributedLock("patchWaiverRequestDetailItemLock", connectionStringSWAV);
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                var currentWaiverRequestDetail = db.WaiverRequestDetails.FirstOrDefault(m => m.WaiverRequestDetailID == key);

                if (currentWaiverRequestDetail == null)
                {
                    return NotFound();
                }
                // this block of code is protected by the lock!
                using (patchWaiverRequestDetailItemLock.Acquire())
                {
                    //currentWaiverRequestDetail.UpdatedDate = DateTime.Now;
                    patch.Patch(currentWaiverRequestDetail);
                    db.SaveChanges();
                }
            }
            catch (ArgumentNullException)
            {
                throw new HttpResponseException(HttpStatusCode.BadRequest);
            }
            catch (Exception ex)
            {
                // CUSTOM Exception Filters to generate Http Error Response 
                //throw new HttpResponseException(HttpStatusCode.NotAcceptable);
                throw ex;
            }
            return StatusCode(HttpStatusCode.NoContent);
        }
    }
}
