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
    public class WaiverSettingsController : ODataController
    {
        private SWAVContext db = new SWAVContext();
        private string connectionStringSWAV = System.Configuration.ConfigurationManager.ConnectionStrings["SWAVContext"].ConnectionString;

        //Get: odata/WaiverSettings
        [EnableQuery]
        public IQueryable<WaiverSetting> GetWaiverSettings()
        {
            return db.WaiverSettings;
        }
        // POST: odata/WaiverSettings
        public IHttpActionResult Post(WaiverSetting waiverSetting)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            waiverSetting.CreatedDate = DateTime.Now;
            waiverSetting.UpdatedDate = DateTime.Now;

            db.WaiverSettings.Add(waiverSetting);
            db.SaveChanges();

            return ResponseMessage(Request.CreateResponse(HttpStatusCode.Created, waiverSetting));
        }

        //PATCH: odata/WaiverSettings(5)
        public IHttpActionResult Patch([FromODataUri] int key, Delta<WaiverSetting> patch)
        {
            var patchWaiverSettingItemLock = new SqlDistributedLock("patchWaiverSettingItemLock", connectionStringSWAV);
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                var currentWaiverSetting = db.WaiverSettings.FirstOrDefault(m => m.WaiverSettingID == key);

                if (currentWaiverSetting == null)
                {
                    return NotFound();
                }
                // this block of code is protected by the lock!
                using (patchWaiverSettingItemLock.Acquire())
                {
                    patch.Patch(currentWaiverSetting);
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

        /*[HttpPatch]
        [ODataRoute("UpdateWaiverSettings")]
        public IHttpActionResult UpdatePatch(WaiverSetting waiverSetting)
        {
            var patchWaiverSettingItemLock = new SqlDistributedLock("patchWaiverSettingItemLock", connectionStringSWAV);
            try
            {
                var currentWaiverSettingID = db.WaiverSettings.FirstOrDefault(tr => tr.WaiverSettingID == waiverSetting.WaiverSettingID);
                if (currentWaiverSettingID == null)
                {
                    //return NotFound();
                    waiverSetting.CreatedDate = DateTime.Now;
                    waiverSetting.UpdatedDate = DateTime.Now;
                    db.WaiverSettings.Add(waiverSetting);
                    db.SaveChanges();
                }
                if (currentWaiverSettingID != null)
                {
                    using (patchWaiverSettingItemLock.Acquire())
                    {
                        waiverSetting.WaiverSettingID = currentWaiverSettingID.WaiverSettingID;
                        waiverSetting.UpdatedDate = DateTime.Now;
                        db.Entry(currentWaiverSettingID).CurrentValues.SetValues(waiverSetting);
                        db.SaveChanges();
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
            return ResponseMessage(Request.CreateResponse(HttpStatusCode.Created, waiverSetting));
        }*/

        // DELETE: odata/WaiverSettings(5)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            WaiverSetting waiverSetting = db.WaiverSettings.Find(key);
            if (waiverSetting == null)
            {
                return NotFound();
            }

            db.WaiverSettings.Remove(waiverSetting);
            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }
    }
    
}
