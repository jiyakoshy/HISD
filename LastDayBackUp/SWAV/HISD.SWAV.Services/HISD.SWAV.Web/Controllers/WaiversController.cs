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
    public class WaiversController : ODataController
    {
        private SWAVContext db = new SWAVContext();
        private string connectionStringSWAV = System.Configuration.ConfigurationManager.ConnectionStrings["SWAVContext"].ConnectionString;

        //Get: odata/Waivers
        [EnableQuery]
        public IQueryable<Waiver> GetWaivers()
        {
            return db.Waivers;
        }
        //Post: odata/Waivers
        public IHttpActionResult Post(Waiver generalWaivers)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            generalWaivers.CreatedDate = DateTime.Now;
            generalWaivers.UpdatedDate = DateTime.Now;
            db.Waivers.Add(generalWaivers);
            db.SaveChanges();
            return ResponseMessage(Request.CreateResponse(HttpStatusCode.Created, generalWaivers));
        }
        //Add Custom Waiver
        [HttpPost]
        [ODataRoute("AddCustomWaiver")]
        public IHttpActionResult AddCustomWaiver(Waiver customWaiver)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            customWaiver.CreatedDate = DateTime.Now;
            customWaiver.UpdatedDate = DateTime.Now;
            db.Waivers.Add(customWaiver);
            db.SaveChanges();
            return ResponseMessage(Request.CreateResponse(HttpStatusCode.Created, customWaiver));
        }

        //Put: odata/Waivers(5)
        public IHttpActionResult Put([FromODataUri] int key, Waiver waiver)
        {
            var putWaiverItemLock = new SqlDistributedLock("putWaiverItemLock", connectionStringSWAV);
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                var currentWaiver = db.Waivers.FirstOrDefault(m => m.WaiverID == key);
                if (currentWaiver == null)
                {
                    return NotFound();
                }
                // this block of code is protected by the lock!
                using (putWaiverItemLock.Acquire())
                {
                    currentWaiver.WaiverID = currentWaiver.WaiverID;
                    currentWaiver.UpdatedDate = DateTime.Now;
                    db.Entry(currentWaiver).CurrentValues.SetValues(waiver);
                    db.SaveChanges();
                    foreach (WaiverAdministration tr in waiver.WaiverAdministrations)
                    {
                        var currentWaiverAdminID = db.WaiverAdministrations.FirstOrDefault(cc => cc.WaiverAdministrationID == tr.WaiverAdministrationID);
                        if (currentWaiverAdminID != null)
                        {
                            tr.WaiverAdministrationID = currentWaiverAdminID.WaiverAdministrationID;
                            tr.UpdatedDate = DateTime.Now;
                            db.Entry(currentWaiverAdminID).CurrentValues.SetValues(tr);
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
            return StatusCode(HttpStatusCode.NoContent);
            //}
        }

        //Patch Waivers(5)
        public IHttpActionResult Patch([FromODataUri] int key, Delta<Waiver> patch)
        {
            var patchWaiverItemLock = new SqlDistributedLock("patchWaiverItemLock", connectionStringSWAV);
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                var currentWaiver = db.Waivers.FirstOrDefault(m => m.WaiverID == key);

                if (currentWaiver == null)
                {
                    return NotFound();
                }
                // this block of code is protected by the lock!
                using (patchWaiverItemLock.Acquire())
                {
                    currentWaiver.UpdatedDate = DateTime.Now;
                    patch.Patch(currentWaiver);
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

        //Update Custom Waiver by Campus and School Year
        //[HttpPatch]
        //[ODataRoute("UpdateSchoolCustomWaiver")]
        //public IHttpActionResult UpdateSchoolCustomWaiver(Waiver customWaiver)
        //{
        //    var putCustomWaiverItemLock = new SqlDistributedLock("putCustomWaiverItemLock", connectionStringSWAV);
        //    try
        //    {
        //        if (!ModelState.IsValid)
        //        {
        //            return BadRequest(ModelState);
        //        }
        //        var currentCustomWaiver = db.Waivers.FirstOrDefault(m => m.WaiverID == customWaiver.WaiverID);
        //        if (currentCustomWaiver == null)
        //        {
        //            return NotFound();
        //        }
        //        using (putCustomWaiverItemLock.Acquire())
        //        {
        //            currentCustomWaiver.WaiverID = currentCustomWaiver.WaiverID;
        //            currentCustomWaiver.UpdatedDate = DateTime.Now;
        //            db.Entry(currentCustomWaiver).CurrentValues.SetValues(customWaiver);
        //            db.SaveChanges();
        //            foreach (SchoolWaiver tr in customWaiver.SchoolWaivers)
        //            {
        //                var currentSchoolWaiverID = db.SchoolWaivers.FirstOrDefault(cc => cc.SchoolWaiverID == tr.SchoolWaiverID);
        //                if (currentSchoolWaiverID != null)
        //                {
        //                    tr.SchoolWaiverID = currentSchoolWaiverID.SchoolWaiverID;
        //                    tr.UpdatedDate = DateTime.Now;
        //                    db.Entry(currentSchoolWaiverID).CurrentValues.SetValues(tr);
        //                    db.SaveChanges();
        //                }
        //            }

        //        }
        //    }
        //    catch (ArgumentNullException)
        //    {
        //        throw new HttpResponseException(HttpStatusCode.BadRequest);
        //    }
        //    catch (Exception ex)
        //    {
        //        // CUSTOM Exception Filters to generate Http Error Response 
        //        //throw new HttpResponseException(HttpStatusCode.NotAcceptable);
        //        throw ex;
        //    }
        //        return StatusCode(HttpStatusCode.NoContent);
        //}

        // DELETE: odata/Waivers(5)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            Waiver waiver = db.Waivers.Find(key);
            if (waiver == null)
            {
                return NotFound();
            }

            db.Waivers.Remove(waiver);
            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }
    }
}
