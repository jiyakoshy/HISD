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

namespace HISD.SWAV.Web.Controllers
{
    public class WaiverAdministrationsController : ODataController
    {
        private SWAVContext db = new SWAVContext();
        private string connectionStringSWAV = System.Configuration.ConfigurationManager.ConnectionStrings["SWAVContext"].ConnectionString;
        [EnableQuery]
        public IQueryable<WaiverAdministration> GetWaiverAdministrations()
        {
            return db.WaiverAdministrations;
        }
        [HttpGet]
        [EnableQuery]
        [ODataRoute("GetSchoolNotStartedStatusWaivers(SchoolStartYear={schoolyear})")]
        //Get School Status: "Not Started" Waivers(General)
        public IQueryable<SchoolNotStartedStatusWaivers> GetSchoolNotStartedStatusWaivers([FromODataUri] int schoolyear)
        {
            var schoolNotStartedStatus = (from x in db.WaiverAdministrations
                                          join y in db.Waivers
                                          on x.WaiverID equals y.WaiverID
                                          join z in db.WaiverTypes
                                          on y.WaiverTypeID equals z.WaiverTypeID
                                          join a in db.ReportTypes
                                          on x.ReportTypeID equals a.ReportTypeID
                                          //join c in db.Sc
                                          where x.SchoolStartYear.Equals(schoolyear)
                                          select new SchoolNotStartedStatusWaivers
                                          {
                                              WaiverAdministrationID = x.WaiverAdministrationID,
                                              Elementary = x.Elementary,
                                              Middle = x.Middle,
                                              High = x.High,
                                              SchoolStartYear = x.SchoolStartYear,
                                              SchoolEndYear = x.SchoolEndYear,
                                              WaiverID = x.WaiverID,
                                              WaiverName = y.WaiverName,
                                              WaiverDescription = y.WaiverDescription,
                                              WaiverTypeID = y.WaiverTypeID,
                                              WaiverType1 = z.WaiverType1.Trim(),
                                              WaiverRequestDetailStatus = y.WaiverRequestDetailStatus,
                                              ReportTypeID = x.ReportTypeID,
                                              ReportType = a.ReportType1,
                                              Deleted = x.Deleted,
                                              CheckBox = false
                                          }).AsEnumerable().ToList();
            return schoolNotStartedStatus.AsQueryable<SchoolNotStartedStatusWaivers>();
        }

        [HttpGet]
        [EnableQuery]
        [ODataRoute("GetGeneralWaivers(SchoolStartYear={schoolyear})")]
        //Get General Waivers By SchoolYear
        public IQueryable<SchoolNotStartedStatusWaivers> GetGeneralWaivers([FromODataUri] int schoolyear)
        {
            var generalWaivers = (from x in db.WaiverAdministrations
                                  join y in db.Waivers
                                  on x.WaiverID equals y.WaiverID
                                  join z in db.WaiverTypes
                                  on y.WaiverTypeID equals z.WaiverTypeID
                                  where y.WaiverTypeID == 1 //'1' is General Waiver
                                  where x.Deleted == false  // filter the deleted waivers
                                  join a in db.ReportTypes
                                  on x.ReportTypeID equals a.ReportTypeID
                                  //join c in db.Sc
                                  where x.SchoolStartYear.Equals(schoolyear)  //Get the General Waivers by SchoolYear
                                  select new SchoolNotStartedStatusWaivers
                                  {
                                      WaiverAdministrationID = x.WaiverAdministrationID,
                                      Elementary = x.Elementary,
                                      Middle = x.Middle,
                                      High = x.High,
                                      SchoolStartYear = x.SchoolStartYear,
                                      SchoolEndYear = x.SchoolEndYear,
                                      WaiverID = x.WaiverID,
                                      WaiverName = y.WaiverName,
                                      WaiverDescription = y.WaiverDescription,
                                      WaiverRequestDetailStatus = y.WaiverRequestDetailStatus,
                                      WaiverTypeID = y.WaiverTypeID,
                                      WaiverType1 = z.WaiverType1.Trim(),
                                      ReportTypeID = x.ReportTypeID,
                                      ReportType = a.ReportType1,
                                      Deleted = x.Deleted,
                                      CreatedDate = x.CreatedDate,
                                      UpdatedDate = x.UpdatedDate,
                                      WaiverCreatedDate = y.CreatedDate,
                                      WaiverUpdatedDate = y.UpdatedDate,
                                  }).AsEnumerable().ToList();
            return generalWaivers.AsQueryable<SchoolNotStartedStatusWaivers>();
        }

        [HttpPost]
        [ODataRoute("CopyGeneralWaivers")]
        public IHttpActionResult AddGenealWaivers(GeneralWaiversArray generalWaivers)
        {
            foreach (Waiver c in generalWaivers.GeneralWaivers)
            {
                c.CreatedDate = DateTime.Now;
                db.Waivers.Add(c);
            }
            db.SaveChanges();
            return ResponseMessage(Request.CreateResponse(HttpStatusCode.Created, generalWaivers.GeneralWaivers));
        }

        //PATCH: odata/WaiverAdministration(5)
        public IHttpActionResult Patch([FromODataUri] int key, Delta<WaiverAdministration> patch)
        {
            var patchWaiverAdministrationItemLock = new SqlDistributedLock("patchWaiverAdministrationItemLock", connectionStringSWAV);
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                var currentWaiverAdministration = db.WaiverAdministrations.FirstOrDefault(m => m.WaiverAdministrationID == key);

                if (currentWaiverAdministration == null)
                {
                    return NotFound();
                }
                // this block of code is protected by the lock!
                using (patchWaiverAdministrationItemLock.Acquire())
                {
                    currentWaiverAdministration.UpdatedDate = DateTime.Now;
                    patch.Patch(currentWaiverAdministration);
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
