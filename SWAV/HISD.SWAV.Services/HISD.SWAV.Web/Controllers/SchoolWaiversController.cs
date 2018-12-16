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
    public class SchoolWaiversController : ODataController
    {
        private SWAVContext db = new SWAVContext();
        private string connectionStringSWAV = System.Configuration.ConfigurationManager.ConnectionStrings["SWAVContext"].ConnectionString;
        [EnableQuery]
        public IQueryable<SchoolWaiver> GetSchoolWaivers()
        {
            return db.SchoolWaivers;
        }
        
        //Get Schools Status for Current School Year.........
        [HttpGet]
        [EnableQuery]
        [ODataRoute("GetSchoolStatus(SchoolStartYear={schoolyear})")]
        public IQueryable<SchoolStatus> GetSchoolStatus([FromODataUri] int schoolyear)
        {
            return db.SchoolWaivers
                 .Where(a => a.SchoolStartYear == schoolyear)
                 .GroupBy(test => test.CampusNumber).Select(g => g.FirstOrDefault())
                  .ToList()
                 .Select(w => new SchoolStatus
                 {
                     SchoolWaiverID = w.SchoolWaiverID,
                     CampusNumber = (Convert.ToDecimal(w.CampusNumber).ToString("000")),
                     WaiverStatusID = w.WaiverStatusID,
                     SchoolStartYear = w.SchoolStartYear,
                     SchoolEndYear = w.SchoolEndYear
                 })
                 .AsQueryable();
        }

        //Get School Waivers for Current Schoool Year.......
        [HttpGet]
        [EnableQuery]
        [ODataRoute("GetSchoolStatusWaivers(SchoolStartYear={schoolyear})")]
        public IQueryable<SchoolSatusWaivers> GetSchoolStatusWaivers([FromODataUri] int schoolyear)
        {
            var schoolStatusWaivers = (from x in db.SchoolWaivers.ToList()
                                       join y in db.Waivers.ToList()
                                       on x.WaiverID equals y.WaiverID
                                       join z in db.WaiverTypes.ToList()
                                       on y.WaiverTypeID equals z.WaiverTypeID
                                       where x.SchoolStartYear.Equals(schoolyear)
                                       select new SchoolSatusWaivers
                                       {
                                           SchoolWaiverID = x.SchoolWaiverID,
                                           CampusNumber = (Convert.ToDecimal(x.CampusNumber)).ToString("000"),
                                           Elementary = x.Elementary,
                                           Middle = x.Middle,
                                           High = x.High,
                                           WaiverID = x.WaiverID,
                                           WaiverName = y.WaiverName,
                                           WaiverDescription = y.WaiverDescription,
                                           WaiverStatusID = x.WaiverStatusID,
                                           WaiverTypeID = y.WaiverTypeID,
                                           WaiverType1 = z.WaiverType1.Trim(),
                                           WaiverRequestDetailStatus = y.WaiverRequestDetailStatus,
                                           SchoolWaiverDeleted = x.SchoolWaiverDeleted,
                                           CustomApprovalStatus = x.CustomApprovalStatus,
                                           SchoolStartYear = x.SchoolStartYear,
                                           SchoolEndYear = x.SchoolEndYear,
                                           EmailMessageID = x.EmailMessageID,
                                           //CreatedBy = x.CreatedBy,
                                           CreatedDate = x.CreatedDate,
                                           //CreatedDate = x.CreatedDate
                                           CheckBox = true
                                           
                                       })
                                       .AsEnumerable().ToList();
            return schoolStatusWaivers.AsQueryable<SchoolSatusWaivers>();
        }
        //Get Custom Waivers for All Campuses by SchoolYear
        [HttpGet]
        [EnableQuery]
        [ODataRoute("GetSchoolCustomWaivers(SchoolStartYear={schoolyear})")]
        public IQueryable<SchoolCustomWaivers> GetSchoolCustomWaivers([FromODataUri] int schoolyear)
        {
            var schoolCustomWaivers = (from x in db.SchoolWaivers.ToList()
                                       join y in db.Waivers.ToList()
                                       on x.WaiverID equals y.WaiverID
                                       join z in db.WaiverTypes.ToList()
                                       on y.WaiverTypeID equals z.WaiverTypeID
                                       join xy in db.WaiverAdministrations.ToList()
                                       on y.WaiverID equals xy.WaiverID
                                       join yz in db.ReportTypes.ToList()
                                       on xy .ReportTypeID equals yz.ReportTypeID
                                       where y.WaiverTypeID == 2
                                       where x.SchoolWaiverDeleted == false
                                       where x.SchoolStartYear.Equals(schoolyear)
                                       select new SchoolCustomWaivers
                                       {
                                           SchoolWaiverID = x.SchoolWaiverID,
                                           CampusNumber = (Convert.ToDecimal(x.CampusNumber)).ToString("000"),
                                           WaiverID = x.WaiverID,
                                           WaiverName = y.WaiverName,
                                           WaiverDescription = y.WaiverDescription,
                                           WaiverTypeID = y.WaiverTypeID,
                                           WaiverType1 = z.WaiverType1.Trim(),
                                           WaiverStatusID = x.WaiverStatusID,
                                           WaiverAdministrationID = xy.WaiverAdministrationID,
                                           Elementary = x.Elementary,
                                           Middle = x.Middle,
                                           High = x.High,
                                           ReportTypeID = xy.ReportTypeID,
                                           ReportType = yz.ReportType1,
                                           CustomApprovalStatus = x.CustomApprovalStatus,
                                           SchoolWaiverDeleted = x.SchoolWaiverDeleted,
                                           Deleted = xy.Deleted,
                                           SchoolStartYear = x.SchoolStartYear,
                                           SchoolEndYear = x.SchoolEndYear,
                                           CreatedDate = x.CreatedDate,
                                           UpdatedDate = x.UpdatedDate,
                                           WaiverAdminCreatedDate = xy.CreatedDate,
                                           WaiverCreatedDate = y.CreatedDate
                                       })
                                       .AsEnumerable().ToList();
            return schoolCustomWaivers.AsQueryable<SchoolCustomWaivers>();
        }


        // POST: odata/SchoolWaivers
        public IHttpActionResult Post(SchoolWaiver schoolWaiver)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            schoolWaiver.CreatedDate = DateTime.Now;
            db.SchoolWaivers.Add(schoolWaiver);
            db.SaveChanges();

            return ResponseMessage(Request.CreateResponse(HttpStatusCode.Created, schoolWaiver));
            //return Created(schoolWaiver);
        }

        [HttpPost]
        [ODataRoute("AddSchoolWaivers")]
        public IHttpActionResult AddWaiver(SchoolWaiversArray schoolWaiver)
        {
            foreach(SchoolWaiver c in schoolWaiver.SchoolWaivers)
            {
                c.CreatedDate = DateTime.Now;
                c.UpdatedDate = DateTime.Now;
                db.SchoolWaivers.Add(c);
            }
            db.SaveChanges();
            return ResponseMessage(Request.CreateResponse(HttpStatusCode.Created, schoolWaiver.SchoolWaivers));
        }

        //PATCH: odata/SchoolWaivers(5)
        public IHttpActionResult Patch([FromODataUri] int key, Delta<SchoolWaiver> patch)
        {
            var patchSchoolWaiverItemLock = new SqlDistributedLock("patchSchoolWaiverItemLock", connectionStringSWAV);
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                var currentSchoolWaiver = db.SchoolWaivers.FirstOrDefault(m => m.SchoolWaiverID == key);

                if (currentSchoolWaiver == null)
                {
                    return NotFound();
                }
                // this block of code is protected by the lock!
                using (patchSchoolWaiverItemLock.Acquire())
                {
                    patch.Patch(currentSchoolWaiver);
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

        //PATCH: Finalize Submission SchoolWaivers by Campus Number and School Start Year
        //odata/FinalizeSchoolWaivers(SchoolStartYear=2017,CampusNumber='001')
        [HttpPatch]
        [ODataRoute("FinalizeSchoolWaivers(SchoolStartYear={schoolyear},CampusNumber={campus})")]
        public IHttpActionResult PatchSchoolWaivers([FromODataUri]int schoolyear, [FromODataUri]string campus, Delta<SchoolWaiver> patch)
        {
            var patchSchoolWaiverItemLock = new SqlDistributedLock("patchSchoolWaiverItemLock", connectionStringSWAV);
            try
            {
                var currentSchoolWaiver = db.SchoolWaivers.Where(t => t.SchoolStartYear == schoolyear).Where(tr => tr.CampusNumber == campus);
                if (currentSchoolWaiver == null)
                {
                    return NotFound();
                }
                using (patchSchoolWaiverItemLock.Acquire())
                {
                    foreach (SchoolWaiver xy in currentSchoolWaiver)
                    {
                        xy.UpdatedDate = DateTime.Now;
                        patch.Patch(xy);
                    }
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
            return StatusCode(HttpStatusCode.OK);
        }

        [HttpPatch]
        [ODataRoute("UpdateSchoolWaivers")]
        public IHttpActionResult UpdatePatch(SchoolWaiversArray schoolWaiver)
        {
            var patchSchoolWaiverItemLock = new SqlDistributedLock("patchSchoolWaiverItemLock", connectionStringSWAV);
            try
            {
                foreach (SchoolWaiver tr in schoolWaiver.SchoolWaivers)
                {
                    var currentSchoolWaiverID = db.SchoolWaivers.FirstOrDefault(cc => cc.SchoolWaiverID == tr.SchoolWaiverID);
                    if (currentSchoolWaiverID == null)
                    {
                        tr.CreatedDate = DateTime.Now;
                        tr.UpdatedDate = DateTime.Now;
                        db.SchoolWaivers.Add(tr);
                        db.SaveChanges();
                    }
                    if(currentSchoolWaiverID != null)
                    {
                        using (patchSchoolWaiverItemLock.Acquire())
                        {
                            tr.SchoolWaiverID = currentSchoolWaiverID.SchoolWaiverID;
                            tr.UpdatedDate = DateTime.Now;
                            db.Entry(currentSchoolWaiverID).CurrentValues.SetValues(tr);
                            db.SaveChanges();
                        }
                    }
                    
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
            return ResponseMessage(Request.CreateResponse(HttpStatusCode.Created, schoolWaiver.SchoolWaivers));
        }


        // DELETE: odata/SchoolWaivers(5)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            SchoolWaiver schoolWaiver = db.SchoolWaivers.Find(key);
            if (schoolWaiver == null)
            {
                return NotFound();
            }
            db.SchoolWaivers.Remove(schoolWaiver);
            db.SaveChanges();
            return StatusCode(HttpStatusCode.NoContent);
        }

        //Delete: Reset or Delete SchoolWaivers by Campus Number and School Start Year
        //odata/ResetSchoolWaivers(SchoolStartYear=2017,CampusNumber='001')
        [HttpDelete]
        [ODataRoute("ResetSchoolWaivers(SchoolStartYear={schoolyear},CampusNumber={campus})")]
        public IHttpActionResult DeleteSchoolWaivers([FromODataUri]int schoolyear, [FromODataUri]string campus)
        {
            var currentSchoolWaiver = db.SchoolWaivers.Where(t => t.SchoolStartYear == schoolyear).Where(tr => tr.CampusNumber == campus);
            foreach(SchoolWaiver xy in currentSchoolWaiver)
            {
                db.SchoolWaivers.Remove(xy);
            }
            db.SaveChanges();
            return StatusCode(HttpStatusCode.OK);
        }
                       
    }

    
}
